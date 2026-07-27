# Public API reference

This reference follows the exports in `src/cami.ts`, the package's public entry point. Experimental code under `src/exp/` is not exported and is not part of this API.

## Rendering and components

| Export | Purpose |
| --- | --- |
| `ReactiveElement` | Reactive custom-element base class |
| `html`, `svg` | lit-html template tags |
| `unsafeHTML` | Render explicitly trusted HTML strings |
| `repeat`, `keyed` | Re-exported lit-html list/key directives |
| `keyedRepeat` | String-keyed list helper with development checks |
| `ref` | Assign a rendered element to an object or callback ref |
| `useImage` | Component-owned image loading resource |

## State and data

| Export | Purpose |
| --- | --- |
| `store`, `ObservableStore` | Named shared state, actions, async operations, and orchestration |
| `ObservableState`, `effect` | Fine-grained reactive state and effects |
| `Observable` | Push stream primitive with operators |
| `Model`, `Type` | Runtime-validated model state and schema definitions |
| `useValidationHook`, `useValidationThunk` | Attach runtime validation to store workflows |

## Browser integration

| Export | Purpose |
| --- | --- |
| `createURLStore`, `URLStore` | Hash-based navigation state and route resources |
| `createLocalStorage`, `persistToLocalStorageThunk` | localStorage adapter and persistence hook |
| `createIdbPromise`, `persistToIdbThunk` | IndexedDB adapter and persistence hook |

## Configuration and utilities

| Export | Purpose |
| --- | --- |
| `debug`, `events` | Runtime debug and event configuration |
| `invariant` | Configurable invariant assertion |
| `_deepEqual`, `_deepMerge`, `_deepClone` | Internal-style data utilities currently exported publicly |
| `setAfterRenderEnabled`, `flushAfterRender` | Test seams for deterministic post-render effects |

## TypeScript-only exports

The entry point exports types for observables, store configuration, models, components, refs, keyed lists, resources, runtime type definitions, and URL routing. Import them with `import type`:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    export {};
    ```

=== "TypeScript"

    ```typescript
    import type { Ref, Resource, StoreFactoryConfig, URLStoreOptions } from 'cami'
    ```

Use the detailed pages in this section for method signatures and examples.
