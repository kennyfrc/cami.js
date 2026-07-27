# Production practices

These practices come from Cami's production use in a large multi-page application. They favor a small public interface, explicit ownership, and browser-native lifecycle behavior.

## Keep one owner for each kind of state

Choose state by its owner:

- One component owns the value. Use a reactive field.
- Several islands share it. Use a named store module.
- History or a copied link should restore it. Use `URLStore`.
- One component owns async work. Use a component resource.
- Several islands share server data. Use a store query or mutation.

Do not copy store state into component fields. Read the store while rendering and dispatch named transitions from event handlers.

## Treat stores as modules

Create a store once in its own module. Define its state shape and transitions beside it. Import the module wherever the state is needed.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { store } from 'cami'

    export const CartStore = store({
      name: 'cart',
      state: { items: [] },
    })

    CartStore.defineAction('item:add', ({ state, payload }) => {
      state.items.push(payload)
    })

    CartStore.defineMemo('total', ({ state }) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    )
    ```

=== "TypeScript"

    ```typescript
    import { store, type MemoContext, type ReducerContext } from 'cami'

    interface CartItem {
      id: string
      price: number
      quantity: number
    }

    interface CartState {
      items: CartItem[]
    }

    export const CartStore = store<CartState>({
      name: 'cart',
      state: { items: [] },
    })

    CartStore.defineAction('item:add', ({ state, payload }: ReducerContext<CartState>) => {
      state.items.push(payload as CartItem)
    })

    CartStore.defineMemo('total', ({ state }: MemoContext<CartState>) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    )
    ```

Name actions after domain transitions. `item:add` says what happened. `setItems` exposes storage details.

## Parse data at entry points

TypeScript protects trusted application code. Network responses, browser storage, attributes, and third-party messages still arrive as `unknown`.

Parse those values once where they enter the module. A successful parser should return the domain type. Do not run a second runtime type system after every store transition.

Store queries and mutations own the server handoff. Parse results in their callbacks.

## Use native custom-element lifecycle callbacks

Use `connectedCallback()` to start browser subscriptions. Use `disconnectedCallback()` to stop them. Always call `super`.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    connectedCallback() {
      super.connectedCallback()
      window.addEventListener('resize', this.handleResize)
    }

    disconnectedCallback() {
      window.removeEventListener('resize', this.handleResize)
      super.disconnectedCallback()
    }
    ```

=== "TypeScript"

    ```typescript
    connectedCallback(): void {
      super.connectedCallback()
      window.addEventListener('resize', this.handleResize)
    }

    disconnectedCallback(): void {
      window.removeEventListener('resize', this.handleResize)
      super.disconnectedCallback()
    }
    ```

`onConnect()` and `onDisconnect()` remain only for v0.3 compatibility.

## Use `afterRender()` for committed DOM

Declare `afterRender()` during `template()` when an integration needs nodes from that render. Common uses include focus, scrolling, measurement, popover positioning, editors, charts, and third-party widgets.

Give each integration a stable key. Pass dependencies when setup must rerun. Return cleanup for listeners or external instances.

Do not dispatch state or focus elements inside `template()`.

## Fetch shared data outside component mounting

Register store queries and mutations in the store module. Trigger initial queries from application bootstrap, URL routing, or an explicit user action.

Avoid fetching in a component's connection callback. Reconnecting the element would repeat application-level work and couple server state to DOM placement.

## Keep high-frequency drafts local

Input, drag, and slider events can fire faster than shared state needs to update. Use a component field or `ephemeral()` draft while the interaction is active. Dispatch the final value on `change`, pointer release, or submit.

This keeps controls responsive and avoids broadcasting incomplete domain state.

## Give URL state one composition root

One routing module should own route registration and resource loaders. It should also own redirects and global hooks. Components may read URL state and call `navigate()`. Keep route definitions out of component classes.

Put state in the URL only when back/forward, reload, or copied links should restore it.

## Render with stable identity

Use `repeat(items, key, render)` for collections that can move or change. The key should be a domain identifier, not the array index.

Use `keyed(key, template)` when changing identity should replace one whole template region.

Only pass trusted or sanitized content to `unsafeHTML()`. Cami does not sanitize HTML.

## Keep advanced orchestration uncommon

Use advanced tools only for a real workflow:

- A state machine owns a closed transition graph.
- A spec enforces a domain rule around an action.
- A hook integrates logging, persistence, or shared policy.

Do not add these layers to a store that only needs named actions.

## Review checklist

- Does each state value have one owner?
- Are writes named domain transitions?
- Is unknown data parsed at its entry point?
- Does `template()` remain free of writes and imperative DOM work?
- Does committed-DOM work use a keyed `afterRender()` effect?
- Do lifecycle overrides call `super`?
- Are shared requests owned by a store or router rather than a component mount?
- Are list keys stable domain identifiers?
- Is every `unsafeHTML()` value trusted or sanitized?
