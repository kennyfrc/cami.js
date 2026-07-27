# Public API reference

The package entry point is `src/cami.ts`. Application code should start with components, typed stores, and browser integration.

## Supported core

### Rendering and components

| Export | Purpose |
| --- | --- |
| `ReactiveElement` | Reactive custom-element base class |
| `html`, `svg` | lit-html template tags |
| `repeat`, `keyed` | Stable collection rendering |
| `unsafeHTML` | Render content that has already crossed an application trust check |
| `useImage` | Load and decode an image through a component's resource lifecycle |

### State and server data

| Export | Purpose |
| --- | --- |
| `store` | Create or retrieve a named store module |
| `ObservableStore` | Store implementation and TypeScript interface |
| Store actions and memos | Named state transitions and derived values |
| Store queries and mutations | Shared server state, caching, retries, and optimistic updates |
| Store async actions, hooks, specs, and machines | Advanced orchestration |

### Browser integration

| Export | Purpose |
| --- | --- |
| `URLStore`, `createURLStore` | Hash navigation, route guards, and route-owned resources |
| `createLocalStorage` | Versioned localStorage adapter |
| `persistToLocalStorageThunk` | Persist store state from an `afterHook` |
| `debug`, `events` | Runtime diagnostics and browser event configuration |


## TypeScript exports

Cami exports component, store, query, mutation, resource, and routing types from the package entry point.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    export {}
    ```

=== "TypeScript"

    ```typescript
    import type {
      MutationConfig,
      QueryConfig,
      Resource,
      StoreFactoryConfig,
      URLStoreOptions,
    } from 'cami'
    ```

Use the detailed reference pages for method signatures and lifecycle contracts.
