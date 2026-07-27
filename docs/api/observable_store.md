# ObservableStore

Use `store()` to create a named state module. A store owns state and named transitions. It can also own derived values and shared server data.

The factory returns the store with the same name. Define each store in one module. Import that module from components.

## Create a typed store module

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

## Factory configuration

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| `name` | `string` | `"cami-store"` | Singleton lookup and diagnostics |
| `state` | `TState` | `{}` | Initial trusted state |
| `enableLogging` | `boolean` | `false` | Store diagnostics |
| `enableDevtools` | `boolean` | `false` | Development tooling integration |

Cami does not run a second schema system over store state. Parse unknown network, storage, attribute, and message data at the module entry point. Use TypeScript for trusted state and payloads.

## Actions

`defineAction(name, handler)` registers a state transition. `dispatch(name, payload?)` runs it. Dispatch returns the latest state.

The handler receives state as an Immer draft. Mutate that draft. Cami publishes an immutable snapshot after success. It rolls back when an action or hook throws.

Prefer names such as `item:add` and `selection:clear` over generic setters.

## Memos

`defineMemo(name, handler)` registers a derived value. `memo(name, payload?)` reads it. Cami tracks state reads and reuses the result while its dependencies remain unchanged.

Use memos for shared derived values. Compute one-component display values in `template()`.

## Queries

Register a server read with `defineQuery(name, config)`. Run it with `query(name, payload?)`. Calls with the same key share a cache.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    PostsStore.defineQuery('posts:list', {
      queryKey: ['posts'],
      queryFn: () => fetch('/api/posts').then(response => response.json()),
      staleTime: 30_000,
      onSuccess: ({ data, dispatch }) => dispatch('posts:loaded', data),
    })
    ```

=== "TypeScript"

    ```typescript
    interface Post {
      id: string
      title: string
    }

    PostsStore.defineQuery<void, Post[]>('posts:list', {
      queryKey: ['posts'],
      queryFn: async (): Promise<Post[]> => {
        const response = await fetch('/api/posts')
        const input: unknown = await response.json()
        return parsePosts(input)
      },
      staleTime: 30_000,
      onSuccess: ({ data, dispatch }) => dispatch('posts:loaded', data),
    })
    ```

| Query option | Purpose |
| --- | --- |
| `queryKey` | Cache identity |
| `staleTime` | Freshness window |
| `gcTime` | Cache lifetime |
| Retry and refetch options | Request policy |
| Lifecycle callbacks | Fetch, success, error, and settled work |

Trigger application-level queries from bootstrap, URL routing, or a user action. Do not tie shared server data to a component mount.

## Mutations

Register a server write with `defineMutation(name, config)`. Run it with `mutate(name, payload?)`.

`mutationFn` performs the write. Other callbacks report each stage. `onMutate` may return rollback context.

Parse mutation responses before dispatching them into trusted state.

## Async actions

`defineAsyncAction(name, handler)` registers application orchestration that may await several operations. Call it with `dispatchAsync(name, payload?)`.

Use async actions when a workflow combines existing actions, queries, mutations, and URL transitions. Prefer a query or mutation when there is one server operation.

## Hooks

`beforeHook(handler)` and `afterHook(handler)` observe every transition. Each returns an unsubscribe function.

Production uses include logging, persistence, and cross-cutting domain checks. Throwing from a hook aborts or rolls back the transition. Do not use hooks to hide ordinary feature logic that belongs in an action.

## State machines

`defineMachine(name, definition)` declares a closed transition graph. Trigger an event with `trigger('machine:event', payload?)`.

State machines are useful for navigation and other workflows with explicit allowed transitions. A store with simple writes should use actions instead.

## Specs

`defineSpec(actionName, { precondition, postcondition })` attaches boolean domain checks to an action. Use specs only when a rule must hold around every execution of that action.

## Reading and observing

| Method | Purpose |
| --- | --- |
| `state` | Immutable reactive snapshot; reading tracks dependencies |
| `getState()` | Current immutable snapshot without relying on property syntax |
| `subscribe(observer)` | Observe store snapshots; returns a subscription |
| `hasAction(name)` | Check whether an action exists |
| `hasAsyncAction(name)` | Check whether an async action exists |

## Public TypeScript contexts

The package exports these store types:

- `ReducerContext` and `MemoContext`.
- `QueryConfig`, `QueryContext`, and query result contexts.
- `MutationConfig`, `MutationContext`, and mutation result contexts.
- `AsyncActionContext` and `AsyncActionHandler`.
- `HookContext`, `StateMachineDefinition`, and `ActionSpec`.
