import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { store } = cami

describe('Hooks', function () {
  let appStore

  beforeEach(function () {
    // Use a unique random name to prevent test interference
    const uniqueName = `test-store-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    appStore = store({
      state: {
        count: 0,
        user: null,
        items: [],
        settings: { theme: 'default', fontSize: 12 },
        subscription: {
          id: 'sub1',
          teamId: 'team1',
          plan: 'basic',
          seats: 5,
        },
        team: {
          id: 'team1',
          name: 'My Team',
          ownerId: 'user1',
          memberIds: ['user1'],
        },
      },
      name: uniqueName,
      localStorage: false,
    })

    appStore.defineAction('incrementCount', ({ state, payload }) => {
      state.count += payload
    })

    appStore.defineAction('setUser', ({ state, payload }) => {
      state.user = payload
    })

    appStore.defineAction('addItem', ({ state, payload }) => {
      state.items = [...state.items, payload]
    })

    appStore.defineAction('updateSettings', ({ state, payload }) => {
      state.settings = { ...state.settings, ...payload }
    })

    appStore.defineAction('setSubscription', ({ state, payload }) => {
      state.subscription = payload
    })

    appStore.defineAction('setTeam', ({ state, payload }) => {
      state.team = payload
    })

    // Reset hooks
    appStore.beforeHooks = []
    appStore.afterHooks = []
  })

  afterEach(function () {
    // Clear all hooks after each test to prevent interference
    if (appStore) {
      appStore.beforeHooks.length = 0
      appStore.afterHooks.length = 0
    }
  })

  it('should use beforeHook for input validation', function () {
    appStore.beforeHook(({ action, payload }) => {
      if (action === 'incrementCount' && typeof payload !== 'number') {
        throw new Error('Payload must be a number for incrementCount action')
      }
    })

    expect(() => appStore.dispatch('incrementCount', 'not a number')).toThrowError(
      'Payload must be a number for incrementCount action'
    )
    expect(() => appStore.dispatch('incrementCount', 5)).not.toThrow()
    expect(appStore.state.count).toBe(5)
  })

  it('should use afterHook for schema validation', function () {
    const schema = {
      count: 'number',
      user: 'object',
    }

    appStore.afterHook(({ state }) => {
      Object.keys(schema).forEach(key => {
        if (state[key] !== null && typeof state[key] !== schema[key]) {
          throw new Error(
            `Invalid type for ${key}. Expected ${schema[key]}, got ${typeof state[key]}`
          )
        }
      })
    })

    expect(() => appStore.dispatch('setUser', 'not an object')).toThrowError(
      'Invalid type for user. Expected object, got string'
    )
    expect(() => appStore.dispatch('setUser', { name: 'John' })).not.toThrow()
    expect(appStore.state.user).toEqual({ name: 'John' })
  })

  it('should apply both beforeHook and afterHook', function () {
    appStore.beforeHook(({ action, payload }) => {
      if (action === 'incrementCount' && payload < 0) {
        throw new Error('Cannot decrement count')
      }
    })

    appStore.afterHook(({ state }) => {
      if (state.count > 10) {
        throw new Error('Count cannot exceed 10')
      }
    })

    expect(() => appStore.dispatch('incrementCount', -1)).toThrowError('Cannot decrement count')
    expect(() => appStore.dispatch('incrementCount', 15)).toThrowError('Count cannot exceed 10')

    appStore.dispatch('incrementCount', 5)
    expect(appStore.state.count).toBe(5)

    appStore.dispatch('incrementCount', 3)
    expect(appStore.state.count).toBe(8)
  })

  it('should roll back to previous state if beforeHook throws an error', function () {
    appStore.beforeHook(({ action, payload }) => {
      if (action === 'incrementCount' && payload > 10) {
        throw new Error('Cannot increment by more than 10')
      }
    })

    appStore.dispatch('incrementCount', 5)
    expect(appStore.state.count).toBe(5)

    expect(() => appStore.dispatch('incrementCount', 15)).toThrowError(
      'Cannot increment by more than 10'
    )
    expect(appStore.state.count).toBe(5) // Should remain unchanged
  })

  it('should roll back to previous state if afterHook throws an error', function () {
    appStore.afterHook(({ state }) => {
      if (state.count > 10) {
        throw new Error('Count cannot exceed 10')
      }
    })

    appStore.dispatch('incrementCount', 5)
    expect(appStore.state.count).toBe(5)

    expect(() => appStore.dispatch('incrementCount', 10)).toThrowError('Count cannot exceed 10')
    expect(appStore.state.count).toBe(5) // Should roll back to previous state
  })

  it('should maintain consistent state across multiple actions if hook throws an error', function () {
    appStore.afterHook(({ state }) => {
      if (state.count > 10) {
        throw new Error('Count cannot exceed 10')
      }
    })

    appStore.dispatch('incrementCount', 5)
    expect(appStore.state.count).toBe(5)

    appStore.dispatch('incrementCount', 3)
    expect(appStore.state.count).toBe(8)

    expect(() => appStore.dispatch('incrementCount', 5)).toThrowError('Count cannot exceed 10')
    expect(appStore.state.count).toBe(8) // Should remain at 8, not increment to 13

    appStore.dispatch('incrementCount', 2)
    expect(appStore.state.count).toBe(10) // Should successfully increment to 10
  })
})
