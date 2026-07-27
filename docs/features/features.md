# Feature Overview

Cami.js provides a complete toolkit for building interactive web applications:

## Core Features

* **Reactive Web Components**: Build UI with `ReactiveElement`, which automatically re-renders when properties change. No boilerplate like `signal()`, `setState()`, or `reactive()` needed—just define properties and they're reactive. See the [ReactiveElement API](../api/reactive_element.md) for details.

* **Store-Based State Management**: Centralize application state in [ObservableStores](../api/observable_store.md). Stores provide:
  - **Actions** for synchronous state updates
  - **Queries** for async data fetching with caching
  - **Mutations** for async data modifications with optimistic updates
  - **Memos** for cached derived computations
  - **Hooks** for middleware-like side effects
  - **State Machines** for complex state transitions

* **Async Data Management**: Fetch and cache server data with [queries and mutations](async_state_management.md). Built-in support for caching, refetching, retry logic, and optimistic updates.

* **Cross-Component State**: Share state across components with ease using [stores](client_state_management.md). Multiple components can read from and dispatch to the same store.

* **State Persistence**: Persist state to [localStorage or IndexedDB](persistence.md) using storage adapters. State survives page refreshes and browser restarts.

* **Type System**: Define schemas with the [Type system](../api/type_system.md) for runtime validation. Create [Models](../api/model.md) that combine schemas with stores.

* **URL Routing**: Handle navigation with [URLStore](../api/url_store.md)—hash-based routing with resource loading and navigation hooks.

## Architecture

Cami follows a **store-centric architecture**:

```
┌─────────────────────────────────────────────────┐
│  Components (ReactiveElement)                    │
│  - Read state via getState()                     │
│  - Write state via dispatch()                    │
│  - Render UI via template()                      │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  Stores (ObservableStore)                        │
│  - State: single source of truth                 │
│  - Actions: sync state updates                   │
│  - Queries: async data fetching + caching        │
│  - Mutations: async data modifications           │
│  - Memos: derived computations                   │
│  - Hooks: side effects (logging, persistence)    │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  Persistence (optional)                          │
│  - LocalStorage adapter                          │
│  - IndexedDB adapter                             │
└─────────────────────────────────────────────────┘
```

## Internals You Don't Need to Worry About

* **Dependency Tracking**: Components automatically re-render when their dependencies change. The `DependencyTracker` observes which stores are accessed during render.

* **Immutable Updates**: State mutations use Immer internally—you write mutable code, but updates are immutable under the hood.

* **Query Caching**: Queries automatically cache results and manage staleness. Configure `staleTime` to control when data is refetched.

* **Automatic Disposal**: Effects, subscriptions, and observers are cleaned up when components disconnect.

## Best Practices

See the [Best Practices](../best_practices.md) guide for production patterns:

- Keep components pure (render + dispatch only)
- Centralize state in stores
- Use memos for derived values
- Avoid `effect()` in application code
