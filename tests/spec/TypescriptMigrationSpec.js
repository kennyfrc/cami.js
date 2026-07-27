import { describe, expect, it, vi } from 'vitest'

import * as cami from '../../build/cami.module.js'

const { store, ObservableState } = cami

describe('TypeScript Migration Integration Tests', () => {
  it('keeps unreleased experimental APIs out of the public entry point', () => {
    const removedExports = [
      'Model',
      'Type',
      'useValidationHook',
      'useValidationThunk',
      'createIdbPromise',
      'persistToIdbThunk',
      'keyedRepeat',
      'ref',
      'invariant',
      '_deepEqual',
      '_deepMerge',
      '_deepClone',
      'setAfterRenderEnabled',
      'flushAfterRender',
    ]

    removedExports.forEach(exportName => {
      expect(cami).not.toHaveProperty(exportName)
    })
  })

  describe('Typed store compatibility', () => {
    it('should handle Draft<TState> types correctly in store', () => {
      const testStore = store({
        state: { count: 0, items: [] },
        name: 'typescript-test-store',
      })

      testStore.defineAction('increment', ({ state }) => {
        state.count++
      })

      testStore.defineAction('addItem', ({ state, payload }) => {
        state.items.push(payload)
      })

      expect(testStore.state.count).toBe(0)
      testStore.dispatch('increment')
      expect(testStore.state.count).toBe(1)

      testStore.dispatch('addItem', { id: 1, name: 'test' })
      expect(testStore.state.items).toHaveLength(1)
      expect(testStore.state.items[0]).toEqual({ id: 1, name: 'test' })
    })

    it('should handle undefined checks in observable state', () => {
      const state = new ObservableState({
        nested: { deep: { value: 42 } },
      })

      // Test set with nested keys
      state.set('nested.deep.value', 100)
      expect(state.value.nested.deep.value).toBe(100)

      // Test delete with nested keys
      state.delete('nested.deep.value')
      expect(state.value.nested.deep.value).toBeUndefined()

      // Test with empty key paths
      expect(() => state.set('', 'value')).not.toThrow()
    })

    it('should maintain ObservableStore compatibility with dependency tracking', async () => {
      const testStore = store({
        state: { value: 10 },
        name: 'dependency-test',
      })

      expect(testStore._uid).toBe('dependency-test')

      testStore.defineAction('setValue', ({ state, payload }) => {
        state.value = payload
      })

      let effectRuns = 0
      let lastValue = null
      const cleanup = cami.effect(() => {
        // Access store state to track dependency
        const val = testStore.state.value
        lastValue = val
        effectRuns++
      })

      // Initial run
      expect(effectRuns).toBeGreaterThan(0)
      expect(lastValue).toBe(10)

      const runsBefore = effectRuns
      testStore.dispatch('setValue', 20)

      // The effect should run at least once more
      expect(effectRuns).toBeGreaterThan(runsBefore)
      expect(lastValue).toBe(20)

      cleanup()
    })

    it('should handle proxy creation with object and array states', () => {
      // Immer requires objects or arrays, not primitives
      // Test store with object wrapping primitive
      const objectStore = store({
        state: { value: 42 },
        name: 'object-store',
      })

      expect(objectStore.state.value).toBe(42)

      // Test store with array state
      const arrayStore = store({
        state: [1, 2, 3],
        name: 'array-store',
      })

      expect(arrayStore.state).toEqual([1, 2, 3])
    })
  })
})
