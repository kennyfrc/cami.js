# Tutorial: share state between islands

Local fields are ideal when one element owns the data. A store is useful when separate islands need the same state.

This tutorial builds two elements: one changes a cart count and the other displays it.

## 1. Create the store

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const { html, ReactiveElement, store } = cami

    const CartStore = store({
      name: 'tutorial-cart',
      state: { quantity: 0 },
    })

    CartStore.defineAction('add', ({ state }) => {
      state.quantity += 1
    })

    CartStore.defineAction('clear', ({ state }) => {
      state.quantity = 0
    })
    ```

=== "TypeScript"

    ```typescript
    import { html, ReactiveElement, store } from 'cami'

    interface CartState {
      quantity: number
    }

    const CartStore = store<CartState>({
      name: 'tutorial-cart',
      state: { quantity: 0 },
    })

    CartStore.defineAction('add', ({ state }) => {
      state.quantity += 1
    })

    CartStore.defineAction('clear', ({ state }) => {
      state.quantity = 0
    })
    ```

Store names are identity keys. Reusing the same name returns the same store instance.

## 2. Add the controls

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class CartControls extends ReactiveElement {
      template() {
        return html`
          <button @click=${() => CartStore.dispatch('add')}>Add item</button>
          <button @click=${() => CartStore.dispatch('clear')}>Clear</button>
        `
      }
    }

    customElements.define('cart-controls', CartControls)
    ```

=== "TypeScript"

    ```typescript
    class CartControls extends ReactiveElement {
      template(): ReturnType<typeof html> {
        return html`
          <button @click=${() => CartStore.dispatch('add')}>Add item</button>
          <button @click=${() => CartStore.dispatch('clear')}>Clear</button>
        `
      }
    }

    declare global {
      interface HTMLElementTagNameMap {
        'cart-controls': CartControls
      }
    }

    customElements.define('cart-controls', CartControls)
    ```

## 3. Read the store from another island

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class CartSummary extends ReactiveElement {
      template() {
        const { quantity } = CartStore.getState()
        return html`<p aria-live="polite">Cart items: ${quantity}</p>`
      }
    }

    customElements.define('cart-summary', CartSummary)
    ```

=== "TypeScript"

    ```typescript
    class CartSummary extends ReactiveElement {
      template(): ReturnType<typeof html> {
        const { quantity } = CartStore.getState()
        return html`<p aria-live="polite">Cart items: ${quantity}</p>`
      }
    }

    declare global {
      interface HTMLElementTagNameMap {
        'cart-summary': CartSummary
      }
    }

    customElements.define('cart-summary', CartSummary)
    ```

When `template()` reads `getState()`, Cami tracks the store as a dependency. A dispatch that changes the store schedules the summary to render again.

## 4. Place the islands anywhere

```html
<header><cart-summary></cart-summary></header>
<main><cart-controls></cart-controls></main>
```

The elements do not need a common component parent. The store gives both elements one interface for reading and updating the cart.

## What you learned

- Use local component fields for state owned by one island.
- Use a named store for state shared across islands.
- Change store state through named actions and `dispatch()`.
- Read store state during `template()` to establish a reactive dependency.

For design guidance, read [Choose a state interface](../explanation/state-interfaces.md).
