# ObservableStore

The `ObservableStore` is Cami's reactive state container. It holds your application's state, provides methods to read and update it, and automatically notifies reactive components when state changes.

## Overview

An `ObservableStore` is built on these principles:

- **Immutable reads**: `getState()` returns a frozen snapshot—safe to pass around without mutation.
- **Mutable writes via Immer**: Inside action handlers, you mutate `state` directly; Immer converts this to immutable updates.
- **Reactive**: Components that call `getState()` inside `template()` are automatically re-rendered when state changes.
- **Single source of truth**: Client state, UI state, cached server data, and derived state all belong in stores.

**The golden rule**: Components read via `getState()` and write via `dispatch()`.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { store, html, ReactiveElement } from "cami";
    // Create a store
    const CounterStore = store({
        name: "counter",
        state: { count: 0 },
    });
    // Define actions
    CounterStore.defineAction("increment", ({ state }) => {
        state.count += 1;
    });
    CounterStore.defineAction("decrement", ({ state }) => {
        state.count -= 1;
    });
    // Use in a component
    class CounterElement extends ReactiveElement {
        template() {
            const { count } = CounterStore.getState();
            return html `
          <button @click=${() => CounterStore.dispatch("decrement")}>-</button>
          <span>${count}</span>
          <button @click=${() => CounterStore.dispatch("increment")}>+</button>
        `;
        }
    }
    customElements.define("counter-element", CounterElement);
    ```

=== "TypeScript"

    ```typescript
    import { store, html, ReactiveElement } from "cami";

    interface CounterState {
      count: number;
    }

    // Create a store
    const CounterStore = store<CounterState>({
      name: "counter",
      state: { count: 0 },
    });

    // Define actions
    CounterStore.defineAction("increment", ({ state }) => {
      state.count += 1;
    });

    CounterStore.defineAction("decrement", ({ state }) => {
      state.count -= 1;
    });

    // Use in a component
    class CounterElement extends ReactiveElement {
      template(): ReturnType<typeof html> {
        const { count } = CounterStore.getState();
        return html`
          <button @click=${() => CounterStore.dispatch("decrement")}>-</button>
          <span>${count}</span>
          <button @click=${() => CounterStore.dispatch("increment")}>+</button>
        `;
      }
    }
    customElements.define("counter-element", CounterElement);
    ```

---

## Creating Stores

### `store(config)`

Creates a new store instance or returns an existing one with the same name (singleton by name).

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { store } from "cami";
    const CartStore = store({
        name: "CartStore",
        state: { cartItems: [] },
    });
    ```

=== "TypeScript"

    ```typescript
    import { store } from "cami";

    interface CartState {
      cartItems: Array<{ id: string; name: string; price: number }>;
    }

    const CartStore = store<CartState>({
      name: "CartStore",
      state: { cartItems: [] },
    });
    ```

**Config options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `state` | `TState` | `{}` | Initial state |
| `name` | `string` | `"cami-store"` | Store name (also used for singleton lookup) |
| `schema` | `Record<string, TypeDefinition>` | `{}` | Optional schema for runtime validation |
| `enableLogging` | `boolean` | `false` | Enable debug logging |
| `enableDevtools` | `boolean` | `false` | Enable devtools integration |

**Singleton behavior:** Calling `store({ name: "foo" })` multiple times returns the same instance. This is useful for accessing stores across modules without explicit imports.

---

## Reading State

### `getState()` and `state`

Both return a frozen snapshot of current state.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const { cartItems } = CartStore.getState();
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    ```

=== "TypeScript"

    ```typescript
    const { cartItems } = CartStore.getState();
    const total: number = cartItems.reduce(
      (acc: number, item: CartState['cartItems'][number]) => acc + item.price,
      0,
    );
    ```

**Dependency tracking:** When called inside a reactive context (like `template()`), the component automatically subscribes to state changes.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    class CartTotal extends ReactiveElement {
        template() {
            // This registers a dependency—component re-renders when cartItems changes
            const { cartItems } = CartStore.getState();
            const total = cartItems.reduce((acc, item) => acc + item.price, 0);
            return html `<div>Total: $${(total / 100).toFixed(2)}</div>`;
        }
    }
    ```

=== "TypeScript"

    ```typescript
    class CartTotal extends ReactiveElement {
      template() {
        // This registers a dependency—component re-renders when cartItems changes
        const { cartItems } = CartStore.getState();
        const total = cartItems.reduce((acc, item) => acc + item.price, 0);
        return html`<div>Total: $${(total / 100).toFixed(2)}</div>`;
      }
    }
    ```

---

## Actions

Actions are the only way to modify store state. They receive a context object with the current state draft and various utilities.

### `defineAction(name, handler)`

Defines a synchronous action.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    CartStore.defineAction("add", ({ state, payload }) => {
        state.cartItems.push(payload);
    });
    CartStore.defineAction("remove", ({ state, payload }) => {
        state.cartItems = state.cartItems.filter(item => item.id !== payload.id);
    });
    CartStore.defineAction("clear", ({ state }) => {
        state.cartItems = [];
    });
    ```

=== "TypeScript"

    ```typescript
    CartStore.defineAction("add", ({ state, payload }) => {
      state.cartItems.push(payload as CartState['cartItems'][number]);
    });

    CartStore.defineAction("remove", ({ state, payload }) => {
      const { id } = payload as Pick<CartState['cartItems'][number], 'id'>;
      state.cartItems = state.cartItems.filter(item => item.id !== id);
    });

    CartStore.defineAction("clear", ({ state }) => {
      state.cartItems = [];
    });
    ```

**Handler context:**

| Field | Type | Description |
|-------|------|-------------|
| `state` | `Draft<TState>` | Mutable state draft (Immer) |
| `payload` | `any` | Data passed to `dispatch()` |
| `dispatch` | `(action, payload?) => TState` | Dispatch another action |
| `query` | `(name, payload?) => Promise` | Execute a query |
| `mutate` | `(name, payload?) => Promise` | Execute a mutation |
| `invalidateQueries` | `(options) => void` | Invalidate cached queries |
| `memo` | `(name, payload?) => any` | Get a memoized value |
| `trigger` | `(event, payload?) => Promise` | Trigger a state machine event |
| `dispatchAsync` | `(name, payload?) => Promise` | Dispatch an async action |

### `dispatch(action, payload?)`

Dispatches an action and returns the new state.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    CartStore.dispatch("add", { id: "p1", name: "Widget", price: 999 });
    CartStore.dispatch("remove", { id: "p1" });
    ```

=== "TypeScript"

    ```typescript
    CartStore.dispatch("add", { id: "p1", name: "Widget", price: 999 });
    CartStore.dispatch("remove", { id: "p1" });
    ```

**Convenience methods:** `defineAction` also creates `store.actions[actionName]`:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    CartStore.actions.add({ id: "p1", name: "Widget", price: 999 });
    CartStore.actions.remove({ id: "p1" });
    ```

=== "TypeScript"

    ```typescript
    CartStore.actions.add({ id: "p1", name: "Widget", price: 999 });
    CartStore.actions.remove({ id: "p1" });
    ```

---

## Hooks

Hooks replace the old middleware system. They run before or after every action dispatch.

### `beforeHook(hook)` / `afterHook(hook)`

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Logging hook
    const unsubscribe = CartStore.beforeHook(({ action, payload }) => {
        console.log(`[${action}]`, payload);
    });
    // Persistence hook (runs after state changes)
    CartStore.afterHook(({ action, state, patches }) => {
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
    });
    // Unsubscribe when done
    unsubscribe();
    ```

=== "TypeScript"

    ```typescript
    // Logging hook
    const unsubscribe = CartStore.beforeHook(({ action, payload }) => {
      console.log(`[${action}]`, payload);
    });

    // Persistence hook (runs after state changes)
    CartStore.afterHook(({ action, state, patches }) => {
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    });

    // Unsubscribe when done
    unsubscribe();
    ```

**Hook context:**

| Field | Type | Description |
|-------|------|-------------|
| `action` | `string` | Action name |
| `payload` | `any` | Action payload |
| `state` | `TState` | Current state |
| `previousState` | `TState` | State before action (afterHook only) |
| `patches` | `Patch[]` | Immer patches (afterHook only) |
| `inversePatches` | `Patch[]` | Inverse patches for undo (afterHook only) |
| `dispatch` | `(action, payload?) => TState` | Dispatch another action |

---

## Queries

Queries handle async data fetching with caching, refetching, and lifecycle callbacks.

### `defineQuery(name, config)`

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const PostsStore = store({
        name: "PostsStore",
        state: { posts: { status: "idle", data: [] } },
    });
    // Actions to update state
    PostsStore.defineAction("posts:setPending", ({ state }) => {
        state.posts.status = "pending";
        state.posts.error = undefined;
    });
    PostsStore.defineAction("posts:setSuccess", ({ state, payload }) => {
        state.posts.status = "success";
        state.posts.data = payload;
    });
    PostsStore.defineAction("posts:setError", ({ state, payload }) => {
        state.posts.status = "error";
        state.posts.error = String(payload?.message || payload);
    });
    // Define the query
    PostsStore.defineQuery("posts:fetch", {
        queryKey: () => ["posts"],
        queryFn: async () => {
            const res = await fetch("/api/posts");
            return res.json();
        },
        onFetch: ({ dispatch }) => {
            dispatch("posts:setPending");
        },
        onSuccess: ({ data, dispatch }) => {
            dispatch("posts:setSuccess", data);
        },
        onError: ({ error, dispatch }) => {
            dispatch("posts:setError", error);
        },
    });
    ```

=== "TypeScript"

    ```typescript
    interface PostsState {
      posts: {
        status: "idle" | "pending" | "success" | "error";
        data: any[];
        error?: string;
      };
    }

    const PostsStore = store<PostsState>({
      name: "PostsStore",
      state: { posts: { status: "idle", data: [] } },
    });

    // Actions to update state
    PostsStore.defineAction("posts:setPending", ({ state }) => {
      state.posts.status = "pending";
      state.posts.error = undefined;
    });

    PostsStore.defineAction("posts:setSuccess", ({ state, payload }) => {
      state.posts.status = "success";
      state.posts.data = payload;
    });

    PostsStore.defineAction("posts:setError", ({ state, payload }) => {
      state.posts.status = "error";
      state.posts.error = String(payload?.message || payload);
    });

    // Define the query
    PostsStore.defineQuery("posts:fetch", {
      queryKey: () => ["posts"],
      queryFn: async () => {
        const res = await fetch("/api/posts");
        return res.json();
      },
      onFetch: ({ dispatch }) => {
        dispatch("posts:setPending");
      },
      onSuccess: ({ data, dispatch }) => {
        dispatch("posts:setSuccess", data);
      },
      onError: ({ error, dispatch }) => {
        dispatch("posts:setError", error);
      },
    });
    ```

**Query config:**

| Option | Type | Description |
|--------|------|-------------|
| `queryKey` | `string \| string[] \| (args) => string[]` | Cache key |
| `queryFn` | `(args) => Promise<TResult>` | Function to fetch data |
| `staleTime` | `number` | Milliseconds before data is considered stale (default: 0) |
| `gcTime` | `number` | Milliseconds before unused cache is garbage collected |
| `retry` | `number` | Number of retry attempts (default: 1) |
| `retryDelay` | `number \| (attempt) => number` | Delay between retries |
| `refetchOnWindowFocus` | `boolean` | Refetch when window regains focus |
| `refetchOnReconnect` | `boolean` | Refetch when network reconnects |
| `refetchInterval` | `number \| null` | Polling interval in milliseconds |
| `onFetch` | `(context) => void` | Called when query starts |
| `onSuccess` | `(context) => void` | Called on success |
| `onError` | `(context) => void` | Called on error |
| `onSettled` | `(context) => void` | Called after success or error |

### `query(name, payload?)`

Executes a query and returns the result.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    await PostsStore.query("posts:fetch");
    ```

=== "TypeScript"

    ```typescript
    await PostsStore.query("posts:fetch");
    ```

**Convenience method:** `store.queries[queryName]`:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    await PostsStore.queries["posts:fetch"]();
    ```

=== "TypeScript"

    ```typescript
    await PostsStore.queries["posts:fetch"]();
    ```

### `invalidateQueries(options)`

Marks queries as stale, causing them to refetch on next access.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Invalidate by key (recommended)
    PostsStore.invalidateQueries({ queryKey: ["posts"] });
    // Invalidate by predicate (advanced)
    // Note: predicate receives the QueryConfig object, not the resolved key
    PostsStore.invalidateQueries({
        predicate: (queryConfig) => {
            // Handle both string keys and function-based keys safely
            try {
                const key = typeof queryConfig.queryKey === 'function'
                    ? queryConfig.queryKey({})
                    : Array.isArray(queryConfig.queryKey)
                        ? queryConfig.queryKey
                        : [queryConfig.queryKey];
                return key.some(k => k === "posts" || k?.includes?.("posts"));
            }
            catch {
                // If queryKey function throws (e.g., expects specific payload), skip this query
                return false;
            }
        },
    });
    ```

=== "TypeScript"

    ```typescript
    // Invalidate by key (recommended)
    PostsStore.invalidateQueries({ queryKey: ["posts"] });

    // Invalidate by predicate (advanced)
    // Note: predicate receives the QueryConfig object, not the resolved key
    PostsStore.invalidateQueries({
      predicate: (queryConfig) => {
        // Handle both string keys and function-based keys safely
        try {
          const key = typeof queryConfig.queryKey === 'function'
            ? queryConfig.queryKey({})
            : Array.isArray(queryConfig.queryKey)
              ? queryConfig.queryKey
              : [queryConfig.queryKey];
          return key.some(k => k === "posts" || k?.includes?.("posts"));
        } catch {
          // If queryKey function throws (e.g., expects specific payload), skip this query
          return false;
        }
      },
    });
    ```

---

## Mutations

Mutations handle async write operations with optimistic updates and rollback support.

### `defineMutation(name, config)`

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    PostsStore.defineMutation("posts:create", {
        mutationFn: async (payload) => {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            return res.json();
        },
        onMutate: ({ dispatch }) => {
            dispatch("posts:setPending");
        },
        onSuccess: ({ data, dispatch, invalidateQueries }) => {
            dispatch("posts:setSuccess", data);
            invalidateQueries({ queryKey: ["posts"] });
        },
        onError: ({ error, dispatch }) => {
            dispatch("posts:setError", error);
        },
    });
    ```

=== "TypeScript"

    ```typescript
    PostsStore.defineMutation("posts:create", {
      mutationFn: async (payload) => {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return res.json();
      },
      onMutate: ({ dispatch }) => {
        dispatch("posts:setPending");
      },
      onSuccess: ({ data, dispatch, invalidateQueries }) => {
        dispatch("posts:setSuccess", data);
        invalidateQueries({ queryKey: ["posts"] });
      },
      onError: ({ error, dispatch }) => {
        dispatch("posts:setError", error);
      },
    });
    ```

**Mutation config:**

| Option | Type | Description |
|--------|------|-------------|
| `mutationFn` | `(args) => Promise<TResult>` | Function to perform mutation |
| `onMutate` | `(context) => any` | Called before mutation (for optimistic updates) |
| `onSuccess` | `(context) => void` | Called on success |
| `onError` | `(context) => void` | Called on error |
| `onSettled` | `(context) => void` | Called after success or error |

**Mutation context** includes `previousState` for rollback:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    PostsStore.defineMutation("posts:delete", {
        mutationFn: async (id) => {
            await fetch(`/api/posts/${id}`, { method: "DELETE" });
        },
        onMutate: ({ state, payload, dispatch }) => {
            // Optimistic: remove item immediately
            dispatch("posts:setSuccess", state.posts.data.filter(p => p.id !== payload));
            // Note: previousState is automatically captured and available in onError
        },
        onError: ({ error, dispatch, previousState }) => {
            // Rollback on error using previousState (captured before onMutate ran)
            dispatch("posts:setSuccess", previousState.posts.data);
            dispatch("posts:setError", error);
        },
    });
    ```

=== "TypeScript"

    ```typescript
    PostsStore.defineMutation("posts:delete", {
      mutationFn: async (id) => {
        await fetch(`/api/posts/${id}`, { method: "DELETE" });
      },
      onMutate: ({ state, payload, dispatch }) => {
        // Optimistic: remove item immediately
        dispatch("posts:setSuccess", state.posts.data.filter(p => p.id !== payload));
        // Note: previousState is automatically captured and available in onError
      },
      onError: ({ error, dispatch, previousState }) => {
        // Rollback on error using previousState (captured before onMutate ran)
        dispatch("posts:setSuccess", previousState.posts.data);
        dispatch("posts:setError", error);
      },
    });
    ```

### `mutate(name, payload?)`

Executes a mutation.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    await PostsStore.mutate("posts:create", { title: "New Post", body: "..." });
    await PostsStore.mutate("posts:delete", "post-123");
    ```

=== "TypeScript"

    ```typescript
    await PostsStore.mutate("posts:create", { title: "New Post", body: "..." });
    await PostsStore.mutate("posts:delete", "post-123");
    ```

---

## Memos (Derived State)

Memos compute and cache derived values. They're recomputed when their dependencies change.

### `defineMemo(name, fn)`

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    CartStore.defineMemo("cart:totalCents", ({ state }) => {
        return state.cartItems.reduce((acc, item) => acc + item.price, 0);
    });
    CartStore.defineMemo("cart:itemCount", ({ state }) => {
        return state.cartItems.length;
    });
    ```

=== "TypeScript"

    ```typescript
    CartStore.defineMemo("cart:totalCents", ({ state }) => {
      return state.cartItems.reduce((acc, item) => acc + item.price, 0);
    });

    CartStore.defineMemo("cart:itemCount", ({ state }) => {
      return state.cartItems.length;
    });
    ```

### `memo(name, payload?)`

Returns the memoized value.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const total = CartStore.memo("cart:totalCents");
    const count = CartStore.memo("cart:itemCount");
    ```

=== "TypeScript"

    ```typescript
    const total = CartStore.memo("cart:totalCents");
    const count = CartStore.memo("cart:itemCount");
    ```

**Memo context:**

| Field | Type | Description |
|-------|------|-------------|
| `state` | `TState` | Current state (tracked for dependency invalidation) |
| `payload` | `any` | Optional payload |
| `dispatch` | `(action, payload?) => TState` | Dispatch an action |
| `memo` | `(name, payload?) => any` | Call another memo |
| `query` | `(name, payload?) => Promise` | Execute a query |
| `mutate` | `(name, payload?) => Promise` | Execute a mutation |

---

## Async Actions (Thunks)

Async actions handle complex async workflows that need access to store context.

### `defineAsyncAction(name, fn)`

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    PostsStore.defineAsyncAction("posts:bootstrap", async ({ dispatch, query }) => {
        dispatch("posts:setPending");
        try {
            await query("posts:fetch");
        }
        catch (error) {
            dispatch("posts:setError", error);
        }
    });
    PostsStore.defineAsyncAction("posts:refresh", async ({ dispatch, query, invalidateQueries }) => {
        invalidateQueries({ queryKey: ["posts"] });
        await query("posts:fetch");
    });
    ```

=== "TypeScript"

    ```typescript
    PostsStore.defineAsyncAction("posts:bootstrap", async ({ dispatch, query }) => {
      dispatch("posts:setPending");
      try {
        await query("posts:fetch");
      } catch (error) {
        dispatch("posts:setError", error);
      }
    });

    PostsStore.defineAsyncAction("posts:refresh", async ({ dispatch, query, invalidateQueries }) => {
      invalidateQueries({ queryKey: ["posts"] });
      await query("posts:fetch");
    });
    ```

### `dispatchAsync(name, payload?)`

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    await PostsStore.dispatchAsync("posts:bootstrap");
    ```

=== "TypeScript"

    ```typescript
    await PostsStore.dispatchAsync("posts:bootstrap");
    ```

---

## Action Specs (Validation)

Specs add preconditions and postconditions to actions for runtime validation.

### `defineSpec(actionName, spec)`

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { invariant } from "cami";
    CartStore.defineSpec("add", {
        precondition: ({ payload }) => {
            invariant("item must have id", () => typeof payload?.id === "string");
            invariant("price must be positive", () => typeof payload?.price === "number" && payload.price > 0);
            return true;
        },
        postcondition: ({ state, payload }) => {
            invariant("item was added", () => state.cartItems.some(item => item.id === payload.id));
            return true;
        },
    });
    ```

=== "TypeScript"

    ```typescript
    import { invariant } from "cami";

    CartStore.defineSpec("add", {
      precondition: ({ payload }) => {
        invariant("item must have id", () => typeof payload?.id === "string");
        invariant("price must be positive", () => typeof payload?.price === "number" && payload.price > 0);
        return true;
      },
      postcondition: ({ state, payload }) => {
        invariant("item was added", () => state.cartItems.some(item => item.id === payload.id));
        return true;
      },
    });
    ```

**Spec options:**

| Option | Type | Description |
|--------|------|-------------|
| `precondition` | `(context) => boolean` | Checked before action runs |
| `postcondition` | `(context) => boolean` | Checked after action runs |

Precondition context: `{ state, payload, action }`
Postcondition context: `{ state, payload, action, previousState }`

---

## State Machines

State machines define valid state transitions with guards and lifecycle hooks.

### `defineMachine(name, definition)`

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const UIStore = store({
        name: "UIStore",
        state: { modal: "closed" },
    });
    UIStore.defineMachine("modal", {
        open: {
            from: { modal: "closed" },
            to: { modal: "open" },
            guard: ({ payload }) => payload?.allowed !== false,
            onEntry: ({ state, payload }) => {
                console.log("Modal opened with", payload);
            },
        },
        close: {
            from: { modal: "open" },
            to: { modal: "closed" },
            onExit: ({ state }) => {
                console.log("Modal closing");
            },
        },
        startLoading: {
            from: { modal: "open" },
            to: { modal: "loading" },
        },
        finishLoading: {
            from: { modal: "loading" },
            to: { modal: "open" },
        },
    });
    ```

=== "TypeScript"

    ```typescript
    interface ModalState {
      modal: "closed" | "open" | "loading";
    }

    const UIStore = store<ModalState>({
      name: "UIStore",
      state: { modal: "closed" },
    });

    UIStore.defineMachine("modal", {
      open: {
        from: { modal: "closed" },
        to: { modal: "open" },
        guard: ({ payload }) => payload?.allowed !== false,
        onEntry: ({ state, payload }) => {
          console.log("Modal opened with", payload);
        },
      },
      close: {
        from: { modal: "open" },
        to: { modal: "closed" },
        onExit: ({ state }) => {
          console.log("Modal closing");
        },
      },
      startLoading: {
        from: { modal: "open" },
        to: { modal: "loading" },
      },
      finishLoading: {
        from: { modal: "loading" },
        to: { modal: "open" },
      },
    });
    ```

### `trigger(event, payload?)`

Triggers a state machine transition.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    await UIStore.trigger("modal:open", { contentId: "123" });
    await UIStore.trigger("modal:close");
    ```

=== "TypeScript"

    ```typescript
    await UIStore.trigger("modal:open", { contentId: "123" });
    await UIStore.trigger("modal:close");
    ```

**Machine event options:**

| Option | Type | Description |
|--------|------|-------------|
| `from` | `Partial<TState> \| Partial<TState>[] \| (state) => boolean` | Valid source states |
| `to` | `Partial<TState> \| (context) => Partial<TState>` | Target state |
| `guard` | `(context) => boolean` | Condition for transition |
| `onEntry` | `(context) => void` | Called when entering new state |
| `onExit` | `(context) => void` | Called when leaving current state |
| `onTransition` | `(context) => void` | Called during transition |

---

## Patches

Patches provide fine-grained change tracking using Immer's patch format.

### `onPatch(key, listener)`

Subscribe to patches for a specific state key.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const unsubscribe = CartStore.onPatch("cartItems", (patches) => {
        console.log("Cart changes:", patches);
        // patches: [{ op: "add", path: ["cartItems", 0], value: {...} }]
    });
    ```

=== "TypeScript"

    ```typescript
    const unsubscribe = CartStore.onPatch("cartItems", (patches) => {
      console.log("Cart changes:", patches);
      // patches: [{ op: "add", path: ["cartItems", 0], value: {...} }]
    });
    ```

### `applyPatch(patches)`

Apply patches to the store state (useful for undo/redo or sync).

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const patches = [
        { op: "replace", path: ["cartItems", 0, "price"], value: 1999 },
    ];
    CartStore.applyPatch(patches);
    ```

=== "TypeScript"

    ```typescript
    const patches = [
      { op: "replace", path: ["cartItems", 0, "price"], value: 1999 },
    ];
    CartStore.applyPatch(patches);
    ```

---

## Subscriptions

### `subscribe(observer)`

Subscribe to all state changes.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const unsubscribe = CartStore.subscribe((state) => {
        console.log("State changed:", state);
    });
    // Later
    unsubscribe();
    ```

=== "TypeScript"

    ```typescript
    const unsubscribe = CartStore.subscribe((state) => {
      console.log("State changed:", state);
    });

    // Later
    unsubscribe();
    ```

---

## Complete Example

Here's a full example showing the recommended patterns:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { store, html, ReactiveElement } from "cami";
    // 2. Create store
    const TodoStore = store({
        name: "TodoStore",
        state: {
            todos: [],
            filter: "all",
        },
    });
    // 3. Define actions
    TodoStore.defineAction("add", ({ state, payload }) => {
        state.todos.push({
            id: crypto.randomUUID(),
            text: payload.text,
            done: false,
        });
    });
    TodoStore.defineAction("toggle", ({ state, payload }) => {
        const todo = state.todos.find(t => t.id === payload.id);
        if (todo)
            todo.done = !todo.done;
    });
    TodoStore.defineAction("remove", ({ state, payload }) => {
        state.todos = state.todos.filter(t => t.id !== payload.id);
    });
    TodoStore.defineAction("setFilter", ({ state, payload }) => {
        state.filter = payload;
    });
    // 4. Define memos for derived state
    TodoStore.defineMemo("filteredTodos", ({ state }) => {
        switch (state.filter) {
            case "active":
                return state.todos.filter(t => !t.done);
            case "completed":
                return state.todos.filter(t => t.done);
            default:
                return state.todos;
        }
    });
    TodoStore.defineMemo("stats", ({ state }) => ({
        total: state.todos.length,
        active: state.todos.filter(t => !t.done).length,
        completed: state.todos.filter(t => t.done).length,
    }));
    // 5. Create a pure component
    class TodoApp extends ReactiveElement {
        template() {
            // Read state (registers dependency)
            const { filter } = TodoStore.getState();
            const todos = TodoStore.memo("filteredTodos");
            const stats = TodoStore.memo("stats");
            return html `
          <div>
            <h1>Todos (${stats.active} active)</h1>

            <form @submit=${this.handleAdd}>
              <input type="text" name="text" placeholder="What needs to be done?" />
              <button type="submit">Add</button>
            </form>

            <div>
              <button @click=${() => TodoStore.dispatch("setFilter", "all")}
                      ?disabled=${filter === "all"}>All (${stats.total})</button>
              <button @click=${() => TodoStore.dispatch("setFilter", "active")}
                      ?disabled=${filter === "active"}>Active (${stats.active})</button>
              <button @click=${() => TodoStore.dispatch("setFilter", "completed")}
                      ?disabled=${filter === "completed"}>Completed (${stats.completed})</button>
            </div>

            <ul>
              ${todos.map(todo => html `
                <li>
                  <input type="checkbox"
                         ?checked=${todo.done}
                         @change=${() => TodoStore.dispatch("toggle", { id: todo.id })} />
                  <span style=${todo.done ? "text-decoration: line-through" : ""}>
                    ${todo.text}
                  </span>
                  <button @click=${() => TodoStore.dispatch("remove", { id: todo.id })}>×</button>
                </li>
              `)}
            </ul>
          </div>
        `;
        }
        handleAdd(e) {
            e.preventDefault();
            const form = e.target;
            const input = form.elements.namedItem("text");
            if (input.value.trim()) {
                TodoStore.dispatch("add", { text: input.value.trim() });
                input.value = "";
            }
        }
    }
    customElements.define("todo-app", TodoApp);
    ```

=== "TypeScript"

    ```typescript
    import { store, html, ReactiveElement } from "cami";

    // 1. Define state shape
    interface TodoState {
      todos: Array<{ id: string; text: string; done: boolean }>;
      filter: "all" | "active" | "completed";
    }

    // 2. Create store
    const TodoStore = store<TodoState>({
      name: "TodoStore",
      state: {
        todos: [],
        filter: "all",
      },
    });

    // 3. Define actions
    TodoStore.defineAction("add", ({ state, payload }) => {
      state.todos.push({
        id: crypto.randomUUID(),
        text: payload.text,
        done: false,
      });
    });

    TodoStore.defineAction("toggle", ({ state, payload }) => {
      const todo = state.todos.find(t => t.id === payload.id);
      if (todo) todo.done = !todo.done;
    });

    TodoStore.defineAction("remove", ({ state, payload }) => {
      state.todos = state.todos.filter(t => t.id !== payload.id);
    });

    TodoStore.defineAction("setFilter", ({ state, payload }) => {
      state.filter = payload;
    });

    // 4. Define memos for derived state
    TodoStore.defineMemo("filteredTodos", ({ state }) => {
      switch (state.filter) {
        case "active":
          return state.todos.filter(t => !t.done);
        case "completed":
          return state.todos.filter(t => t.done);
        default:
          return state.todos;
      }
    });

    TodoStore.defineMemo("stats", ({ state }) => ({
      total: state.todos.length,
      active: state.todos.filter(t => !t.done).length,
      completed: state.todos.filter(t => t.done).length,
    }));

    // 5. Create a pure component
    class TodoApp extends ReactiveElement {
      template() {
        // Read state (registers dependency)
        const { filter } = TodoStore.getState();
        const todos = TodoStore.memo("filteredTodos");
        const stats = TodoStore.memo("stats");

        return html`
          <div>
            <h1>Todos (${stats.active} active)</h1>

            <form @submit=${this.handleAdd}>
              <input type="text" name="text" placeholder="What needs to be done?" />
              <button type="submit">Add</button>
            </form>

            <div>
              <button @click=${() => TodoStore.dispatch("setFilter", "all")}
                      ?disabled=${filter === "all"}>All (${stats.total})</button>
              <button @click=${() => TodoStore.dispatch("setFilter", "active")}
                      ?disabled=${filter === "active"}>Active (${stats.active})</button>
              <button @click=${() => TodoStore.dispatch("setFilter", "completed")}
                      ?disabled=${filter === "completed"}>Completed (${stats.completed})</button>
            </div>

            <ul>
              ${todos.map(todo => html`
                <li>
                  <input type="checkbox"
                         ?checked=${todo.done}
                         @change=${() => TodoStore.dispatch("toggle", { id: todo.id })} />
                  <span style=${todo.done ? "text-decoration: line-through" : ""}>
                    ${todo.text}
                  </span>
                  <button @click=${() => TodoStore.dispatch("remove", { id: todo.id })}>×</button>
                </li>
              `)}
            </ul>
          </div>
        `;
      }

      handleAdd(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem("text") as HTMLInputElement;
        if (input.value.trim()) {
          TodoStore.dispatch("add", { text: input.value.trim() });
          input.value = "";
        }
      }
    }

    customElements.define("todo-app", TodoApp);
    ```

---

## API Reference

### Store Factory

| Function | Description |
|----------|-------------|
| `store<TState>(config)` | Create or get a store instance |

### Instance Methods

| Method | Description |
|--------|-------------|
| `getState()` | Get frozen state snapshot |
| `dispatch(action, payload?)` | Dispatch a sync action |
| `defineAction(name, handler)` | Define a sync action |
| `defineAsyncAction(name, handler)` | Define an async action |
| `dispatchAsync(name, payload?)` | Dispatch an async action |
| `defineQuery(name, config)` | Define a query |
| `query(name, payload?)` | Execute a query |
| `invalidateQueries(options)` | Invalidate cached queries |
| `defineMutation(name, config)` | Define a mutation |
| `mutate(name, payload?)` | Execute a mutation |
| `defineMemo(name, fn)` | Define a memoized value |
| `memo(name, payload?)` | Get a memoized value |
| `defineMachine(name, definition)` | Define a state machine |
| `trigger(event, payload?)` | Trigger a state machine event |
| `defineSpec(action, spec)` | Define action validation |
| `beforeHook(hook)` | Add a before-action hook |
| `afterHook(hook)` | Add an after-action hook |
| `onPatch(key, listener)` | Subscribe to patches |
| `applyPatch(patches)` | Apply Immer patches |
| `subscribe(observer)` | Subscribe to state changes |

### Convenience Properties

| Property | Description |
|----------|-------------|
| `store.state` | Alias for `getState()` |
| `store.actions` | Object with action methods |
| `store.queries` | Object with query methods |
| `store.mutations` | Object with mutation methods |
