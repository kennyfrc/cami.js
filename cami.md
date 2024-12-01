# Cami.js Framework Documentation

Cami.js is a lightweight framework for building reactive web applications, combining state management, custom elements, and a query system.

## Core Concepts

### Store Creation and State Management

The foundation of Cami.js applications is the store:

```javascript
const myStore = store({
  state: {
    count: 0,
    user: null
  },
  name: "app-store"
});
```

Stores can be persisted to localStorage:

```javascript
const storage = createLocalStorage({
  name: "app-storage",
  version: 1
});

myStore.afterHook(persistToLocalStorageThunk(storage));
```

### Actions

Actions modify store state and are defined using `defineAction`. There are important considerations around state mutations and dispatching:

```javascript
// Basic action
myStore.defineAction("incrementCount", ({ state, payload }) => {
  state.count += payload.amount;
});

// Action with state mutation and dispatch
myStore.defineAction("updateUser", ({ state, payload }) => {
  state.user = payload;
});
```

#### State Mutations and Dispatching

State mutations within actions are batched and only applied after all dispatches complete. This has important implications:

```javascript
// ❌ Won't work as expected - mutated state not available in dispatch
store.defineAction("updateAndNotify", ({ state, dispatch }) => {
  state.counter += 1;
  dispatch("notify", state.counter);  // Will get old counter value!
});

// ✅ Correct way - pass the new value directly
store.defineAction("updateAndNotify", ({ state, dispatch }) => {
  const newCount = state.counter + 1;
  state.counter = newCount;
  dispatch("notify", newCount);
});
```

#### Dispatch Types and Behavior

1. **Same-Store Dispatch**
   - Dispatches within the same store are checked for cycles
   - You'll get warnings about potential circular dependencies
   ```javascript
   store.defineAction("action1", ({ state, dispatch }) => {
     state.value = 1;
     dispatch("action2");  // Warning: Potential cycle
   });
   ```

2. **Cross-Store Dispatch**
   - Dispatches between different stores are fully supported
   - Execute synchronously in order
   - No cyclic detection warnings
   ```javascript
   store1.defineAction("updateMultiple", ({ dispatch }) => {
     store2.dispatch("action1");  // Executes first
     store3.dispatch("action2");  // Executes second
   });
   ```

#### State Update Order

1. All synchronous code executes in order
2. State mutations are batched
3. Actual state updates occur after all dispatches complete
4. State change events fire at the end

Actions can be validated using specs:

```javascript
myStore.defineSpec("incrementCount", {
  precondition: ({ payload }) => {
    return invariant("Amount must be a number", () => {
      return typeof payload.amount === "number";
    });
  }
});
```

### Async Operations

Cami.js provides Query and Mutation patterns for async operations:

```javascript
// Query definition
myStore.defineQuery("fetchUser", {
  queryKey: () => ["user"],
  queryFn: () => fetch("/api/user").then(r => r.json()),
  onFetch: ({ dispatch }) => {
    dispatch("setLoadingState", true);
  },
  onSuccess: ({ data, dispatch }) => {
    dispatch("setUser", data);
  },
  onError: ({ error, dispatch }) => {
    dispatch("setError", error);
  }
});

// Mutation definition
myStore.defineMutation("updateUser", {
  mutationFn: (payload) => fetch("/api/user", {
    method: "PUT",
    body: JSON.stringify(payload)
  }),
  onSuccess: ({ invalidateQueries }) => {
    invalidateQueries(["user"]);
  }
});

// Async action
myStore.defineAsyncAction("saveUserData", async ({ state, dispatch }) => {
  await api.saveUser(state.user);
  dispatch("userSaved");
});
```

### State Machines

Complex state transitions are managed using state machines:

```javascript
myStore.defineMachine("nav_fsm", {
  open_panel: {
    from: [{ panel: "closed" }],
    to: { panel: "open" },
    onTransition: ({ state, dispatch }) => {
      dispatch("panelOpened");
    }
  },
  close_panel: {
    from: [{ panel: "open" }],
    to: { panel: "closed" }
  }
});
```

### Custom Elements

Cami.js integrates with Web Components through ReactiveElement. While ReactiveElement provides reactive properties, it's recommended to keep components as stateless as possible:

```javascript
customElements.define("user-profile", class extends ReactiveElement {
  // ❌ Avoid local state management
  constructor() {
    super();
    this.count = 0;  // Local state should be avoided
  }

  // ✅ Use store state and memos instead
  template() {
    const { user } = rootStore.getState();
    const fullName = rootStore.memo("userFullName");

    return html`
      <div class="profile">
        <h2>${fullName}</h2>
        <p>${user.email}</p>
      </div>
    `;
  }
});
```

ReactiveElement provides reactive properties that update automatically:
- Properties update triggers re-renders
- Automatic cleanup on disconnect
- Efficient update batching

However, prefer store-based state management over component state:
- Better state centralization
- Easier testing and debugging
- More predictable data flow
- Simpler component disposal

## Philosophy and Best Practices

### Core Principles
1. **Centralized State**
   - State belongs in stores, not components
   - Components should be primarily view logic
   - Use memos for computed values
   - Keep components stateless and disposable

2. **State Management**
   - Keep state normalized and flat where possible
   - Use meaningful store names
   - Split stores only when performance requires it
   - Avoid local component state

3. **Logic Organization**
   - "IFs up, FORs down" - Complex logic belongs in stores/memos
   - Components should be primarily template rendering
   - Move computations to memos
   - Keep view logic simple and declarative
   - When component logic is unavoidable:
     - Contain it in parent/container components
     - Keep child components pure and logic-free
     - Don't spread logic across component hierarchy
     - Example:
       ```javascript
       // ✅ Good: Logic contained in parent
       class ParentComponent extends ReactiveElement {
         template() {
           const shouldShowDetails = this.determineVisibility();
           return html`
             <child-component
               .visible=${shouldShowDetails}
             ></child-component>
           `;
         }
       }

       // ✅ Good: Child is pure rendering
       class ChildComponent extends ReactiveElement {
         template() {
           return html`
             ${this.visible ? html`<div>Details</div>` : null}
           `;
         }
       }
       ```

4. **Memos and Computations**
   - Use memos for derived state
   - Memos automatically cache and update
   - Prefer memos over component computations
   - Example:
     ```javascript
     store.defineMemo("activeUsers", ({ state }) => {
       return state.users.filter(u => u.isActive);
     });
     ```

### Action Design
- Keep actions atomic and focused
- Use clear, intention-revealing names
- Validate payloads using specs
- Handle side effects in async actions

### Query/Mutation Usage
- Use consistent queryKey patterns
- Handle loading/error states
- Cache invalidation should be explicit
- Use staleTime and caching appropriately

### Component Design
- Keep components focused and small
- Use templates for declarative rendering
- Handle lifecycle properly
- Follow Web Components best practices

## Error Handling

Cami.js provides several error handling mechanisms:

```javascript
// Action validation
myStore.defineSpec("actionName", {
  precondition: ({ payload }) => {
    return invariant("Validation message", () => {
      return /* validation logic */;
    });
  }
});

// Query error handling
myStore.defineQuery("fetchData", {
  onError: ({ error, dispatch }) => {
    dispatch("setError", error.message);
    dispatch("showErrorNotification");
  }
});

// Custom error handling
try {
  await store.dispatchAsync("riskyAction");
} catch (error) {
  store.dispatch("handleError", error);
}
```

## Debugging

Enable debug mode to log state changes and actions:

```javascript
debug.enable();
```

Use the Redux DevTools extension to inspect state:

```javascript
if (process.env.NODE_ENV === 'development') {
  store.enableDevTools();
}
```

## Common Patterns

### State Updates
```javascript
// Direct mutations (powered by Immer)
store.defineAction("updateUser", ({ state, payload }) => {
  state.user = payload;  // Direct assignment works!
});

// Array updates
store.defineAction("addItem", ({ state, payload }) => {
  state.items.push(payload);  // Direct array mutations work!
});

// Nested updates
store.defineAction("updateUserPreferences", ({ state, payload }) => {
  state.user.preferences.theme = payload.theme;  // Deep updates are fine
  state.user.preferences.notifications = payload.notifications;
});
```

### Async Workflows
```javascript
// Loading states
store.defineAction("setLoading", ({ state, payload }) => {
  state.loading = payload;
});

store.defineQuery("fetchData", {
  queryFn: () => api.getData(),
  onFetch: ({ dispatch }) => dispatch("setLoading", true),
  onSettled: ({ dispatch }) => dispatch("setLoading", false)
});
```

### State Machines
```javascript
// Complex workflows
store.defineMachine("checkout", {
  next_step: {
    from: [{ step: "cart" }],
    to: { step: "shipping" },
    onTransition: ({ dispatch }) => {
      dispatch("validateCart");
    }
  }
});
```

### Component Patterns
```javascript
// Reactive components
class MyComponent extends ReactiveElement {
  template() {
    return html`
      ${this.loading ? html`<loading-spinner></loading-spinner>` : this.renderContent()}
    `;
  }

  renderContent() {
    return html`<div>Content</div>`;
  }
}
```

## Architecture Guidelines

1. **Store Organization**
   - Multiple store patterns:
     - Single root store for small-medium apps
     - Domain-specific stores for large apps or performance-critical features
     - Micro-stores for high-frequency updates (e.g., real-time data, animations)
   - Consider splitting stores when:
     - Feature requires high-frequency updates
     - Component needs isolated state management
     - Different parts of the app have different update patterns
   - Local storage persistence strategies:
     - Selective persistence for performance
     - Batch updates for frequent changes
   - Clear state boundaries and ownership
   - Examples:
     ```javascript
     // Multiple store pattern
     const uiStore = store({
       state: { theme: 'light', sidebar: 'closed' },
       name: "ui-store"
     });

     const dataStore = store({
       state: { users: [], posts: [] },
       name: "data-store"
     });

     const realtimeStore = store({
       state: { messages: [], notifications: [] },
       name: "realtime-store"
     });
     ```

2. **Action Organization**
   - Group related actions
   - Use clear naming conventions
   - Handle side effects appropriately
   - Validate inputs

3. **Component Organization**
   - Follow Web Components specs
   - Keep templates clean
   - Handle lifecycle properly
   - Use composition

4. **Data Flow**
   - Unidirectional data flow
   - Props down, events up
   - Clear update patterns
   - Predictable state changes

## Performance Considerations

1. **State Updates**
   - Immer handles immutability efficiently under the hood
   - State updates are batched automatically
   - Direct mutations are converted to immutable updates
   - Deep updates are optimized by Immer

2. **Rendering**
   - Use efficient templates
   - Avoid unnecessary renders
   - Leverage Web Components
   - Profile performance

3. **Async Operations**
   - Use proper caching
   - Handle loading states
   - Cancel stale requests
   - Batch network calls

## Testing

```javascript
// Action tests
test("increment action", () => {
  const store = createTestStore();
  store.dispatch("increment", { amount: 1 });
  expect(store.getState().count).toBe(1);
});

// Query tests
test("fetch user query", async () => {
  const store = createTestStore();
  await store.query("fetchUser");
  expect(store.getState().user).toBeDefined();
});
```
