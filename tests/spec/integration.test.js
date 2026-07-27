import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('Vitest + Cami.js Integration', () => {
  describe('Store functionality', () => {
    let testStore

    beforeEach(() => {
      testStore = cami.store({
        state: { count: 0 },
        name: `test-store-${Date.now()}`,
        localStorage: false,
      })
    })

    it('should create and update store', () => {
      expect(testStore.getState().count).toBe(0)

      testStore.defineAction('increment', ({ state, payload }) => {
        state.count = payload
      })

      testStore.dispatch('increment', 5)
      expect(testStore.getState().count).toBe(5)
    })

    it('should handle nested objects', () => {
      const complexStore = cami.store({
        state: {
          user: { name: 'Test', age: 25 },
          items: [],
        },
        name: `complex-store-${Date.now()}`,
        localStorage: false,
      })

      complexStore.defineAction('updateUser', ({ state }) => {
        state.user.name = 'Updated'
      })

      complexStore.defineAction('addItem', ({ state, payload }) => {
        state.items.push(payload)
      })

      complexStore.dispatch('updateUser')
      complexStore.dispatch('addItem', 'item1')

      expect(complexStore.getState().user.name).toBe('Updated')
      expect(complexStore.getState().items).toHaveLength(1)
    })
  })

  describe('ReactiveElement with store', () => {
    let element
    let elementName

    beforeEach(() => {
      elementName = `test-store-element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      class TestStoreElement extends cami.ReactiveElement {
        myStore = cami.store({
          state: { message: 'Hello' },
          name: `element-store-${Date.now()}`,
          localStorage: false,
        })

        template() {
          return cami.html`<div>${this.myStore.getState().message}</div>`
        }
      }

      customElements.define(elementName, TestStoreElement)
      element = document.createElement(elementName)
      document.body.appendChild(element)
    })

    afterEach(() => {
      if (element && document.body.contains(element)) {
        document.body.removeChild(element)
      }
    })

    it('should render with store data', async () => {
      await element.updateComplete
      const div = element.querySelector('div')
      expect(div.textContent).toBe('Hello')
    })

    it('should update when store changes', async () => {
      await element.updateComplete

      element.myStore.defineAction('updateMessage', ({ state }) => {
        state.message = 'Updated Message'
      })

      element.myStore.dispatch('updateMessage')
      await element.updateComplete

      const div = element.querySelector('div')
      expect(div.textContent).toBe('Updated Message')
    })
  })

  describe('Observable functionality', () => {
    it('should create ObservableState', () => {
      const state = new cami.ObservableState({ count: 42 })
      expect(state.value.count).toBe(42)

      state.value = { count: 100 }
      expect(state.value.count).toBe(100)

      state.set('count', 150)
      expect(state.value.count).toBe(150)
    })

    it('should support effects', () => {
      let effectCount = 0
      let lastValue = null
      const state = new cami.ObservableState({ count: 0 })

      const dispose = cami.effect(() => {
        effectCount++
        lastValue = state.value.count
      })

      expect(effectCount).toBe(1)
      expect(lastValue).toBe(0)

      state.value = { count: 5 }
      expect(effectCount).toBe(2)
      expect(lastValue).toBe(5)

      // Clean up
      if (dispose) dispose()
    })
  })

  describe('HTML templates', () => {
    it('should support lit-html directives', () => {
      const items = ['a', 'b', 'c']
      const template = cami.html`
        <ul>
          ${cami.repeat(
            items,
            item => item,
            item => cami.html`<li>${item}</li>`
          )}
        </ul>
      `

      expect(template).toBeDefined()
      expect(template.strings).toBeDefined()
    })

    it('should support keyed directive', () => {
      const key = 'test-key'
      const template = cami.keyed(key, cami.html`<div>Keyed content</div>`)

      expect(template).toBeDefined()
    })
  })
})
