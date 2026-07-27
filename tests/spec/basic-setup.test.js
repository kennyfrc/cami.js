import { describe, expect, it } from 'vitest'

describe('Basic Setup Test', () => {
  it('should have cami available as global', () => {
    expect(globalThis.cami).toBeDefined()
    expect(typeof cami.store).toBe('function')
    expect(typeof cami.ReactiveElement).toBe('function')
    expect(typeof cami.html).toBe('function')
  })

  it('should have DOM APIs available', () => {
    expect(document).toBeDefined()
    expect(window).toBeDefined()
    expect(customElements).toBeDefined()
  })

  it('should have polyfilled APIs available', () => {
    expect(window.indexedDB).toBeDefined()
    expect(window.requestAnimationFrame).toBeDefined()
    expect(window.performance).toBeDefined()
    expect(window.requestIdleCallback).toBeDefined()
  })

  it('should be able to create and register a custom element', () => {
    class TestElement extends cami.ReactiveElement {
      render() {
        return cami.html`<div>Test</div>`
      }
    }

    customElements.define('test-element-basic', TestElement)
    const element = document.createElement('test-element-basic')
    document.body.appendChild(element)

    expect(element).toBeInstanceOf(TestElement)
    expect(document.body.contains(element)).toBe(true)
  })
})
