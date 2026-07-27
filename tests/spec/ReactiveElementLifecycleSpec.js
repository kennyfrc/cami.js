import { afterEach, describe, expect, it, vi } from 'vitest'

const { ReactiveElement, html, store } = cami

const flushMicrotasks = async () => {
  await Promise.resolve()
  await Promise.resolve()
  await Promise.resolve()
}

const settleTasks = async (count = 3) => {
  for (let index = 0; index < count; index += 1) {
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}

describe('ReactiveElement post-render lifecycle', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('runs afterRender after DOM commit and cleans up before the keyed callback reruns', async () => {
    const state = store({ name: 'after-render-order', state: { value: 0 } })
    state.defineAction('setValue', ({ state: draft, payload }) => {
      draft.value = payload
    })
    const events = []

    class AfterRenderOrderElement extends ReactiveElement {
      template() {
        const value = state.getState().value
        this.afterRender('dom-sync', () => {
          events.push(`effect:${this.textContent.trim()}`)
          return () => events.push(`cleanup:${value}`)
        })
        return html`<span>${value}</span>`
      }
    }

    customElements.define('after-render-order-element', AfterRenderOrderElement)
    const element = new AfterRenderOrderElement()
    document.body.appendChild(element)
    await flushMicrotasks()

    expect(events).toEqual(['effect:0'])

    state.dispatch('setValue', 1)
    await flushMicrotasks()

    expect(events).toEqual(['effect:0', 'cleanup:0', 'effect:1'])
  })

  it('uses dependency arrays to skip unchanged post-render work', async () => {
    const state = store({ name: 'after-render-deps', state: { value: 0, other: 0 } })
    state.defineAction('setValue', ({ state: draft, payload }) => {
      draft.value = payload
    })
    state.defineAction('setOther', ({ state: draft, payload }) => {
      draft.other = payload
    })
    const callback = vi.fn()

    class AfterRenderDepsElement extends ReactiveElement {
      template() {
        const { value, other } = state.getState()
        this.afterRender('measured-value', callback, [value])
        return html`<span>${value}:${other}</span>`
      }
    }

    customElements.define('after-render-deps-element', AfterRenderDepsElement)
    const element = new AfterRenderDepsElement()
    document.body.appendChild(element)
    await flushMicrotasks()
    expect(callback).toHaveBeenCalledTimes(1)

    state.dispatch('setOther', 1)
    await flushMicrotasks()
    expect(callback).toHaveBeenCalledTimes(1)

    state.dispatch('setValue', 1)
    await flushMicrotasks()
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('cleans up removed keys and invalidates pending work on disconnect', async () => {
    const state = store({ name: 'after-render-removal', state: { visible: true } })
    state.defineAction('hide', ({ state: draft }) => {
      draft.visible = false
    })
    const cleanup = vi.fn()
    const effect = vi.fn(() => cleanup)

    class AfterRenderRemovalElement extends ReactiveElement {
      template() {
        const visible = state.getState().visible
        if (visible) this.afterRender('conditional', effect)
        return html`<span>${visible ? 'visible' : 'hidden'}</span>`
      }
    }

    customElements.define('after-render-removal-element', AfterRenderRemovalElement)
    const element = new AfterRenderRemovalElement()
    document.body.appendChild(element)
    await flushMicrotasks()
    expect(effect).toHaveBeenCalledTimes(1)

    state.dispatch('hide')
    await flushMicrotasks()
    expect(cleanup).toHaveBeenCalledTimes(1)

    element.render()
    element.remove()
    await flushMicrotasks()
    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('runs afterSettle after the DOM reflects the watched value', async () => {
    const state = store({ name: 'after-settle-dom', state: { value: 0 } })
    state.defineAction('setValue', ({ state: draft, payload }) => {
      draft.value = payload
    })
    const observations = []

    class AfterSettleDomElement extends ReactiveElement {
      onConnect() {
        this.afterSettle(
          () => state.getState().value,
          (value, previousValue) => {
            observations.push({ value, previousValue, text: this.textContent.trim() })
          }
        )
      }

      template() {
        return html`<span>${state.getState().value}</span>`
      }
    }

    customElements.define('after-settle-dom-element', AfterSettleDomElement)
    const element = new AfterSettleDomElement()
    document.body.appendChild(element)
    await settleTasks()

    expect(observations).toEqual([{ value: 0, previousValue: undefined, text: '0' }])

    state.dispatch('setValue', 42)
    await settleTasks(4)
    expect(observations.at(-1)).toEqual({ value: 42, previousValue: 0, text: '42' })
  })

  it('tracks only values read by the afterSettle source', async () => {
    const state = store({ name: 'after-settle-deps', state: { tracked: 0, other: 0 } })
    state.defineAction('setTracked', ({ state: draft, payload }) => {
      draft.tracked = payload
    })
    state.defineAction('setOther', ({ state: draft, payload }) => {
      draft.other = payload
    })
    const callback = vi.fn()

    class AfterSettleDepsElement extends ReactiveElement {
      onConnect() {
        this.afterSettle(() => state.getState().tracked, callback)
      }

      template() {
        const { tracked, other } = state.getState()
        return html`<span>${tracked}:${other}</span>`
      }
    }

    customElements.define('after-settle-deps-element', AfterSettleDepsElement)
    const element = new AfterSettleDepsElement()
    document.body.appendChild(element)
    await settleTasks()
    expect(callback).toHaveBeenCalledTimes(1)

    state.dispatch('setOther', 1)
    await settleTasks()
    expect(callback).toHaveBeenCalledTimes(1)

    state.dispatch('setTracked', 1)
    await settleTasks()
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('allows a guarded afterSettle update to complete a second render pass', async () => {
    const state = store({ name: 'after-settle-follow-up', state: { input: 0, output: 0 } })
    state.defineAction('setInput', ({ state: draft, payload }) => {
      draft.input = payload
    })
    state.defineAction('setOutput', ({ state: draft, payload }) => {
      draft.output = payload
    })

    class AfterSettleFollowUpElement extends ReactiveElement {
      onConnect() {
        this.afterSettle(
          () => state.getState().input,
          input => {
            if (input > 0 && state.getState().output !== input) {
              state.dispatch('setOutput', input)
            }
          }
        )
      }

      template() {
        return html`<span>output=${state.getState().output}</span>`
      }
    }

    customElements.define('after-settle-follow-up-element', AfterSettleFollowUpElement)
    const element = new AfterSettleFollowUpElement()
    document.body.appendChild(element)
    await settleTasks()

    state.dispatch('setInput', 7)
    await settleTasks(6)

    expect(state.getState().output).toBe(7)
    expect(element.textContent).toContain('output=7')
  })

  it('stops a continuous afterSettle loop after the scheduler pass limit', async () => {
    const state = store({ name: 'after-settle-loop-guard', state: { count: 0 } })
    state.defineAction('increment', ({ state: draft }) => {
      draft.count += 1
    })
    const errors = []
    vi.spyOn(console, 'error').mockImplementation(error => {
      errors.push(String(error))
    })

    class AfterSettleLoopElement extends ReactiveElement {
      onConnect() {
        this.afterSettle(
          () => state.getState().count,
          () => {
            if (state.getState().count < 100) state.dispatch('increment')
          }
        )
      }

      template() {
        return html`<span>${state.getState().count}</span>`
      }
    }

    customElements.define('after-settle-loop-element', AfterSettleLoopElement)
    document.body.appendChild(new AfterSettleLoopElement())
    await settleTasks(20)

    expect(state.getState().count).toBeLessThanOrEqual(11)
    expect(errors.some(message => message.includes('maxPasses'))).toBe(true)
  })
})
