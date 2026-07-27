# Automatic reactivity in web components

`ReactiveElement` makes public component fields reactive after connection. Read a field during `template()` and Cami records the dependency. Write that field later and Cami schedules another render.

## Define a component

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { html, ReactiveElement } from 'cami'

    class CounterElement extends ReactiveElement {
      count = 0

      template() {
        return html`
          <button @click=${() => this.count--}>-</button>
          <output>${this.count}</output>
          <button @click=${() => this.count++}>+</button>
        `
      }
    }

    customElements.define('counter-component', CounterElement)
    ```

=== "TypeScript"

    ```typescript
    import { html, ReactiveElement } from 'cami'

    class CounterElement extends ReactiveElement {
      count: number = 0

      template(): ReturnType<typeof html> {
        return html`
          <button @click=${() => this.count--}>-</button>
          <output>${this.count}</output>
          <button @click=${() => this.count++}>+</button>
        `
      }
    }

    declare global {
      interface HTMLElementTagNameMap {
        'counter-component': CounterElement
      }
    }

    customElements.define('counter-component', CounterElement)
    ```

Then place the custom element in HTML:

```html
<counter-component></counter-component>
```

## Keep state local until it is shared

Use reactive fields for state owned by one component. Move state to a typed store module only when several islands need the same values or transitions.

Compute display-only values in `template()`. Use keyed `afterRender()` effects for focus, measurement, scrolling, or third-party widgets that require committed DOM.

See [ReactiveElement](../api/reactive_element.md) for lifecycle details and [Choose a state interface](../explanation/state-interfaces.md) for ownership guidance.
