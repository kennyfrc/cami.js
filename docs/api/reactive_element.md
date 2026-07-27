# ReactiveElement

`ReactiveElement` is Cami's custom-element base class. Public fields become reactive after connection. Reading them during `template()` records dependencies; writing them schedules a render.

## Minimal component

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { html, ReactiveElement } from 'cami'

    class CamiCounter extends ReactiveElement {
      count = 0

      template() {
        return html`<button @click=${() => this.count++}>${this.count}</button>`
      }
    }

    customElements.define('cami-counter', CamiCounter)
    ```

=== "TypeScript"

    ```typescript
    import { html, ReactiveElement } from 'cami'

    class CamiCounter extends ReactiveElement {
      count: number = 0

      template(): ReturnType<typeof html> {
        return html`<button @click=${() => this.count++}>${this.count}</button>`
      }
    }

    declare global {
      interface HTMLElementTagNameMap {
        'cami-counter': CamiCounter
      }
    }

    customElements.define('cami-counter', CamiCounter)
    ```

Keep `template()` declarative. It may read fields and stores. State writes belong in event handlers, store actions, lifecycle callbacks, or post-render work.

## Browser lifecycle

Override native custom-element callbacks and call `super`:

| Callback | Use |
| --- | --- |
| `connectedCallback()` | Start browser subscriptions owned by the element |
| `disconnectedCallback()` | Stop browser subscriptions and call base cleanup |
| `attributeChangedCallback()` | React to an observed attribute |
| `adoptedCallback()` | Handle a move to another document |

`onConnect()` and `onDisconnect()` are deprecated compatibility wrappers.

## `afterRender(key, effect, deps?)`

Registers work that runs after lit-html commits this element's DOM. Declare it while rendering so Cami can remove effects that are no longer part of the template.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    template() {
      this.afterRender('scroll-active-item', () => {
        this.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest' })
      }, [this.activeItemId])

      return html`...`
    }
    ```

=== "TypeScript"

    ```typescript
    template(): ReturnType<typeof html> {
      this.afterRender('scroll-active-item', () => {
        this.querySelector<HTMLElement>('[aria-current="true"]')
          ?.scrollIntoView({ block: 'nearest' })
      }, [this.activeItemId])

      return html`...`
    }
    ```

The effect may return cleanup. Cleanup runs before changed dependencies rerun the effect, when the key disappears, or when the element disconnects.

## `afterSettle(source, callback)`

Advanced API for a reaction that must wait until the current render batch settles. The callback receives the new value and previous value. Cami limits repeated settle passes to prevent an infinite reaction loop.

Prefer actions, memos, and `afterRender()` unless the work truly depends on the whole render batch.

## `resource(key, loader, options?)`

Owns asynchronous work for one component. Cami exposes status, data, and error through a `Resource<T>` value and aborts stale requests.

Use a store query instead when several islands share the same server data or cache.

## `ephemeral(key, initial, options?)`

Stores a local draft outside the shared store. It is useful for high-frequency slider, drag, resize, or editor input that should commit only when the interaction finishes.

`resetOnDisconnect` controls whether the draft survives a temporary element disconnect.

## Attributes

Use `static observableAttributes` to map attributes into reactive properties. Attribute parsers should return the property value expected by the component.

## Deprecated low-level APIs

The public `effect()` helper and direct `ObservableState` construction remain for v0.3 compatibility. New components should use reactive fields, `afterRender()`, and shared stores instead.
