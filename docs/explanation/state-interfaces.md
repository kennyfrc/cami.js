# Choose a state interface

Cami provides different interfaces for local, shared, asynchronous, and URL-backed state. Choose the simplest interface that matches who uses the state and how long it should live.

## Use a component field

Choose a reactive field for a value used by one element. The value disappears with that element.

Examples: an open popover, the current tab, an input draft, or a local selection.

## Use `ephemeral()`

Choose keyed ephemeral state when local UI state is created during rendering or should expire.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const expanded = this.ephemeral('details-open', () => false)
    this.setEphemeral('details-open', !expanded)
    ```

=== "TypeScript"

    ```typescript
    const expanded = this.ephemeral('details-open', () => false)
    this.setEphemeral('details-open', !expanded)
    ```

By default, ephemeral entries reset when the element disconnects. Use `ttlMs` for time-based expiry or `resetOnDisconnect: false` to retain the entry while that element instance is detached.

## Use a store

Choose `store()` when several islands must read or change the same state. A store also fits transitions that deserve names.

Good examples: cart contents, session UI, editor state, cached server records, and state-machine workflows.

Create a store when several islands need the same state and operations. Do not create one just to make a value global.

## Use a component resource

Choose `resource()` or `useImage()` for async state owned by one component. Cami aborts active loaders when the element disconnects and ignores stale request results.

Choose store queries when several elements share the result. Queries also support cache invalidation and coordinated optimistic mutations.

## Use the URL

Choose `URLStore` for navigation state that should be bookmarkable, shareable, and restored by browser history. Mirror URL state into another store only when separate domain state needs it.
