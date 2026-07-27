# State Persistence

Cami provides adapters for persisting store state to localStorage and IndexedDB. Use these to maintain state across page refreshes or browser sessions.

## Overview

Persistence works through store hooks—you attach an `afterHook` that saves state changes to storage, and hydrate state on load.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { store, createLocalStorage, persistToLocalStorageThunk } from "cami";
    // Create store
    const AppStore = store({
        name: "AppStore",
        state: { user: null, preferences: {} },
    });
    // Define hydrate action to restore saved state
    AppStore.defineAction("hydrate", ({ state, payload }) => {
        Object.assign(state, payload);
    });
    // Create storage adapter
    const storage = createLocalStorage({
        name: "app-storage",
        version: 1,
    });
    // Attach persistence hook
    AppStore.afterHook(persistToLocalStorageThunk(storage));
    // Hydrate on startup
    async function initializeApp() {
        const savedState = await storage.getState();
        if (savedState) {
            AppStore.dispatch("hydrate", savedState);
        }
    }
    ```

=== "TypeScript"

    ```typescript
    import { store, createLocalStorage, persistToLocalStorageThunk } from "cami";

    interface UserPreferences {
      theme?: "light" | "dark" | "system";
    }

    interface AppState {
      user: { id: string; name: string } | null;
      preferences: UserPreferences;
    }

    // Create store
    const AppStore = store<AppState>({
      name: "AppStore",
      state: { user: null, preferences: {} },
    });

    // Define hydrate action to restore saved state
    AppStore.defineAction("hydrate", ({ state, payload }) => {
      Object.assign(state, payload as Partial<AppState>);
    });

    // Create storage adapter
    const storage = createLocalStorage({
      name: "app-storage",
      version: 1,
    });

    // Attach persistence hook
    AppStore.afterHook(persistToLocalStorageThunk(storage));

    // Hydrate on startup
    async function initializeApp(): Promise<void> {
      const savedState = await storage.getState() as AppState | null;
      if (savedState) {
        AppStore.dispatch("hydrate", savedState);
      }
    }
    ```

---

## LocalStorage

### `createLocalStorage(config)`

Creates a localStorage adapter:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createLocalStorage } from "cami";
    const storage = createLocalStorage({
        name: "my-app", // Storage key
        version: 1, // Version for migrations
    });
    ```

=== "TypeScript"

    ```typescript
    import { createLocalStorage } from "cami";

    const storage = createLocalStorage({
      name: "my-app",     // Storage key
      version: 1,         // Version for migrations
    });
    ```

### `persistToLocalStorageThunk(adapter)`

Creates a hook that persists state on changes:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { store, createLocalStorage, persistToLocalStorageThunk } from "cami";
    const CartStore = store({
        name: "CartStore",
        state: { items: [] },
    });
    const cartStorage = createLocalStorage({
        name: "cart",
        version: 1,
    });
    // Auto-persist on every state change
    CartStore.afterHook(persistToLocalStorageThunk(cartStorage));
    ```

=== "TypeScript"

    ```typescript
    import { store, createLocalStorage, persistToLocalStorageThunk } from "cami";

    interface CartItem {
      id: string;
      quantity: number;
    }

    interface CartState {
      items: CartItem[];
    }

    const CartStore = store<CartState>({
      name: "CartStore",
      state: { items: [] },
    });

    const cartStorage = createLocalStorage({
      name: "cart",
      version: 1,
    });

    // Auto-persist on every state change
    CartStore.afterHook(persistToLocalStorageThunk(cartStorage));
    ```

### Full LocalStorage Example

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { store, createLocalStorage, persistToLocalStorageThunk, html, ReactiveElement } from "cami";
    // Create store
    const PreferencesStore = store({
        name: "PreferencesStore",
        state: {
            theme: "light",
            fontSize: 16,
            notifications: true,
        },
    });
    // Actions
    PreferencesStore.defineAction("setTheme", ({ state, payload }) => {
        state.theme = payload;
    });
    PreferencesStore.defineAction("setFontSize", ({ state, payload }) => {
        state.fontSize = payload;
    });
    PreferencesStore.defineAction("setNotifications", ({ state, payload }) => {
        state.notifications = payload;
    });
    PreferencesStore.defineAction("hydrate", ({ state, payload }) => {
        Object.assign(state, payload);
    });
    // Set up persistence
    const storage = createLocalStorage({
        name: "preferences",
        version: 1,
    });
    PreferencesStore.afterHook(persistToLocalStorageThunk(storage));
    // Hydrate on startup
    async function initializePreferences() {
        try {
            const saved = await storage.getState();
            if (saved) {
                PreferencesStore.dispatch("hydrate", saved);
            }
        }
        catch (e) {
            console.warn("Failed to load preferences:", e);
        }
    }
    initializePreferences();
    // Component
    class PreferencesPanel extends ReactiveElement {
        template() {
            const { theme, fontSize, notifications } = PreferencesStore.getState();
            return html `
          <div>
            <h2>Preferences</h2>

            <label>
              Theme:
              <select @change=${(e) => PreferencesStore.dispatch("setTheme", e.target.value)}>
                <option value="light" ?selected=${theme === "light"}>Light</option>
                <option value="dark" ?selected=${theme === "dark"}>Dark</option>
              </select>
            </label>

            <label>
              Font Size:
              <input
                type="range"
                min="12"
                max="24"
                .value=${fontSize}
                @input=${(e) => PreferencesStore.dispatch("setFontSize", Number(e.target.value))}
              />
              ${fontSize}px
            </label>

            <label>
              <input
                type="checkbox"
                ?checked=${notifications}
                @change=${(e) => PreferencesStore.dispatch("setNotifications", e.target.checked)}
              />
              Enable notifications
            </label>

            <p><em>Settings are saved automatically.</em></p>
          </div>
        `;
        }
    }
    customElements.define("preferences-panel", PreferencesPanel);
    ```

=== "TypeScript"

    ```typescript
    import { store, createLocalStorage, persistToLocalStorageThunk, html, ReactiveElement } from "cami";

    // Create store
    const PreferencesStore = store({
      name: "PreferencesStore",
      state: {
        theme: "light",
        fontSize: 16,
        notifications: true,
      },
    });

    // Actions
    PreferencesStore.defineAction("setTheme", ({ state, payload }) => {
      state.theme = payload;
    });

    PreferencesStore.defineAction("setFontSize", ({ state, payload }) => {
      state.fontSize = payload;
    });

    PreferencesStore.defineAction("setNotifications", ({ state, payload }) => {
      state.notifications = payload;
    });

    PreferencesStore.defineAction("hydrate", ({ state, payload }) => {
      Object.assign(state, payload);
    });

    // Set up persistence
    const storage = createLocalStorage({
      name: "preferences",
      version: 1,
    });

    PreferencesStore.afterHook(persistToLocalStorageThunk(storage));

    // Hydrate on startup
    async function initializePreferences() {
      try {
        const saved = await storage.getState();
        if (saved) {
          PreferencesStore.dispatch("hydrate", saved);
        }
      } catch (e) {
        console.warn("Failed to load preferences:", e);
      }
    }

    initializePreferences();

    // Component
    class PreferencesPanel extends ReactiveElement {
      template() {
        const { theme, fontSize, notifications } = PreferencesStore.getState();

        return html`
          <div>
            <h2>Preferences</h2>

            <label>
              Theme:
              <select @change=${(e) => PreferencesStore.dispatch("setTheme", e.target.value)}>
                <option value="light" ?selected=${theme === "light"}>Light</option>
                <option value="dark" ?selected=${theme === "dark"}>Dark</option>
              </select>
            </label>

            <label>
              Font Size:
              <input
                type="range"
                min="12"
                max="24"
                .value=${fontSize}
                @input=${(e) => PreferencesStore.dispatch("setFontSize", Number(e.target.value))}
              />
              ${fontSize}px
            </label>

            <label>
              <input
                type="checkbox"
                ?checked=${notifications}
                @change=${(e) => PreferencesStore.dispatch("setNotifications", e.target.checked)}
              />
              Enable notifications
            </label>

            <p><em>Settings are saved automatically.</em></p>
          </div>
        `;
      }
    }

    customElements.define("preferences-panel", PreferencesPanel);
    ```

---

## IndexedDB

For larger datasets or more complex storage needs, use IndexedDB.

### `createIdbPromise(config)`

Creates an IndexedDB adapter:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { createIdbPromise } from "cami";
    const db = await createIdbPromise({
        name: "my-app-db", // Database name
        version: 1, // Schema version
        storeName: "todos", // Object store name
        keyPath: "id", // Primary key
        indexName: "createdAt", // Index for queries
    });
    ```

=== "TypeScript"

    ```typescript
    import { createIdbPromise } from "cami";

    const db = await createIdbPromise({
      name: "my-app-db",      // Database name
      version: 1,             // Schema version
      storeName: "todos",     // Object store name
      keyPath: "id",          // Primary key
      indexName: "createdAt", // Index for queries
    });
    ```

### `persistToIdbThunk(config)`

Creates a hook that syncs a state key to IndexedDB:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { store, createIdbPromise, persistToIdbThunk } from "cami";
    const TodoStore = store({
        name: "TodoStore",
        state: { todos: [] },
    });
    // Create IDB store
    const todosDb = await createIdbPromise({
        name: "todo-app",
        version: 1,
        storeName: "todos",
        keyPath: "id",
        indexName: "createdAt",
    });
    // Sync the "todos" key to IDB
    TodoStore.afterHook(persistToIdbThunk({
        fromStateKey: "todos",
        toIDBStore: todosDb,
    }));
    ```

=== "TypeScript"

    ```typescript
    import { store, createIdbPromise, persistToIdbThunk } from "cami";

    const TodoStore = store({
      name: "TodoStore",
      state: { todos: [] },
    });

    // Create IDB store
    const todosDb = await createIdbPromise({
      name: "todo-app",
      version: 1,
      storeName: "todos",
      keyPath: "id",
      indexName: "createdAt",
    });

    // Sync the "todos" key to IDB
    TodoStore.afterHook(persistToIdbThunk({
      fromStateKey: "todos",
      toIDBStore: todosDb,
    }));
    ```

### Full IndexedDB Example

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { store, createIdbPromise, persistToIdbThunk, html, ReactiveElement } from "cami";
    // Create store
    const TodoStore = store({
        name: "TodoStore",
        state: {
            todos: [],
            filter: "all",
        },
    });
    // Actions
    TodoStore.defineAction("setTodos", ({ state, payload }) => {
        state.todos = payload;
    });
    TodoStore.defineAction("addTodo", ({ state, payload }) => {
        state.todos.push({
            id: crypto.randomUUID(),
            text: payload.text,
            done: false,
            createdAt: new Date().toISOString(),
        });
    });
    TodoStore.defineAction("toggleTodo", ({ state, payload }) => {
        const todo = state.todos.find(t => t.id === payload.id);
        if (todo) {
            todo.done = !todo.done;
        }
    });
    TodoStore.defineAction("removeTodo", ({ state, payload }) => {
        state.todos = state.todos.filter(t => t.id !== payload.id);
    });
    TodoStore.defineAction("setFilter", ({ state, payload }) => {
        state.filter = payload;
    });
    // Memos
    TodoStore.defineMemo("filteredTodos", ({ state }) => {
        switch (state.filter) {
            case "active": return state.todos.filter(t => !t.done);
            case "completed": return state.todos.filter(t => t.done);
            default: return state.todos;
        }
    });
    // Initialize with IDB persistence
    async function initializeTodos() {
        // Create IDB store
        const todosDb = await createIdbPromise({
            name: "todo-app",
            version: 1,
            storeName: "todos",
            keyPath: "id",
            indexName: "createdAt",
        });
        // Load existing todos
        const savedTodos = await todosDb.getState({ type: "all" });
        if (savedTodos && savedTodos.length > 0) {
            TodoStore.dispatch("setTodos", savedTodos);
        }
        // Set up persistence (only syncs "todos" key, not "filter")
        TodoStore.afterHook(persistToIdbThunk({
            fromStateKey: "todos",
            toIDBStore: todosDb,
        }));
    }
    initializeTodos();
    // Component
    class TodoApp extends ReactiveElement {
        template() {
            const { filter } = TodoStore.getState();
            const todos = TodoStore.memo("filteredTodos");
            return html `
          <div>
            <h1>Todos (Persisted to IndexedDB)</h1>

            <form @submit=${this.handleAdd}>
              <input type="text" name="text" placeholder="Add todo..." />
              <button type="submit">Add</button>
            </form>

            <div>
              ${["all", "active", "completed"].map(f => html `
                <button
                  @click=${() => TodoStore.dispatch("setFilter", f)}
                  ?disabled=${filter === f}>
                  ${f}
                </button>
              `)}
            </div>

            <ul>
              ${todos.map(todo => html `
                <li>
                  <input
                    type="checkbox"
                    ?checked=${todo.done}
                    @change=${() => TodoStore.dispatch("toggleTodo", { id: todo.id })}
                  />
                  <span style=${todo.done ? "text-decoration: line-through" : ""}>
                    ${todo.text}
                  </span>
                  <button @click=${() => TodoStore.dispatch("removeTodo", { id: todo.id })}>
                    ×
                  </button>
                </li>
              `)}
            </ul>

            <p><em>Todos persist across page refreshes.</em></p>
          </div>
        `;
        }
        handleAdd(e) {
            e.preventDefault();
            const input = e.target.elements.text;
            if (input.value.trim()) {
                TodoStore.dispatch("addTodo", { text: input.value.trim() });
                input.value = "";
            }
        }
    }
    customElements.define("todo-app", TodoApp);
    ```

=== "TypeScript"

    ```typescript
    import {
      store,
      createIdbPromise,
      persistToIdbThunk,
      html,
      ReactiveElement
    } from "cami";

    // Create store
    const TodoStore = store({
      name: "TodoStore",
      state: {
        todos: [],
        filter: "all",
      },
    });

    // Actions
    TodoStore.defineAction("setTodos", ({ state, payload }) => {
      state.todos = payload;
    });

    TodoStore.defineAction("addTodo", ({ state, payload }) => {
      state.todos.push({
        id: crypto.randomUUID(),
        text: payload.text,
        done: false,
        createdAt: new Date().toISOString(),
      });
    });

    TodoStore.defineAction("toggleTodo", ({ state, payload }) => {
      const todo = state.todos.find(t => t.id === payload.id);
      if (todo) {
        todo.done = !todo.done;
      }
    });

    TodoStore.defineAction("removeTodo", ({ state, payload }) => {
      state.todos = state.todos.filter(t => t.id !== payload.id);
    });

    TodoStore.defineAction("setFilter", ({ state, payload }) => {
      state.filter = payload;
    });

    // Memos
    TodoStore.defineMemo("filteredTodos", ({ state }) => {
      switch (state.filter) {
        case "active": return state.todos.filter(t => !t.done);
        case "completed": return state.todos.filter(t => t.done);
        default: return state.todos;
      }
    });

    // Initialize with IDB persistence
    async function initializeTodos() {
      // Create IDB store
      const todosDb = await createIdbPromise({
        name: "todo-app",
        version: 1,
        storeName: "todos",
        keyPath: "id",
        indexName: "createdAt",
      });

      // Load existing todos
      const savedTodos = await todosDb.getState({ type: "all" });
      if (savedTodos && savedTodos.length > 0) {
        TodoStore.dispatch("setTodos", savedTodos);
      }

      // Set up persistence (only syncs "todos" key, not "filter")
      TodoStore.afterHook(persistToIdbThunk({
        fromStateKey: "todos",
        toIDBStore: todosDb,
      }));
    }

    initializeTodos();

    // Component
    class TodoApp extends ReactiveElement {
      template() {
        const { filter } = TodoStore.getState();
        const todos = TodoStore.memo("filteredTodos");

        return html`
          <div>
            <h1>Todos (Persisted to IndexedDB)</h1>

            <form @submit=${this.handleAdd}>
              <input type="text" name="text" placeholder="Add todo..." />
              <button type="submit">Add</button>
            </form>

            <div>
              ${["all", "active", "completed"].map(f => html`
                <button
                  @click=${() => TodoStore.dispatch("setFilter", f)}
                  ?disabled=${filter === f}>
                  ${f}
                </button>
              `)}
            </div>

            <ul>
              ${todos.map(todo => html`
                <li>
                  <input
                    type="checkbox"
                    ?checked=${todo.done}
                    @change=${() => TodoStore.dispatch("toggleTodo", { id: todo.id })}
                  />
                  <span style=${todo.done ? "text-decoration: line-through" : ""}>
                    ${todo.text}
                  </span>
                  <button @click=${() => TodoStore.dispatch("removeTodo", { id: todo.id })}>
                    ×
                  </button>
                </li>
              `)}
            </ul>

            <p><em>Todos persist across page refreshes.</em></p>
          </div>
        `;
      }

      handleAdd(e) {
        e.preventDefault();
        const input = e.target.elements.text;
        if (input.value.trim()) {
          TodoStore.dispatch("addTodo", { text: input.value.trim() });
          input.value = "";
        }
      }
    }

    customElements.define("todo-app", TodoApp);
    ```

---

## IndexedDB Queries

The IDB adapter supports various query types:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const db = await createIdbPromise(idbConfig);
    // Get all records
    const all = await db.getState({ type: "all" });
    // Get by primary key
    const one = await db.getState({ type: "key", key: "todo-123" });
    // Get by index value
    const byDate = await db.getState({
        type: "index",
        index: "createdAt",
        value: "2024-01-01"
    });
    // Range query
    const range = await db.getState({
        type: "range",
        index: "createdAt",
        lower: "2024-01-01",
        upper: "2024-12-31",
    });
    // Cursor query (for iteration)
    const cursor = await db.getState({
        type: "cursor",
        direction: "prev", // Reverse order
    });
    // Count records
    const count = await db.getState({ type: "count" });
    // Get keys only
    const keys = await db.getState({ type: "keys" });
    // Get unique values from index
    const unique = await db.getState({
        type: "unique",
        index: "category",
        limit: 10,
    });
    ```

=== "TypeScript"

    ```typescript
    const db = await createIdbPromise(idbConfig);

    // Get all records
    const all = await db.getState({ type: "all" });

    // Get by primary key
    const one = await db.getState({ type: "key", key: "todo-123" });

    // Get by index value
    const byDate = await db.getState({
      type: "index",
      index: "createdAt",
      value: "2024-01-01"
    });

    // Range query
    const range = await db.getState({
      type: "range",
      index: "createdAt",
      lower: "2024-01-01",
      upper: "2024-12-31",
    });

    // Cursor query (for iteration)
    const cursor = await db.getState({
      type: "cursor",
      direction: "prev",  // Reverse order
    });

    // Count records
    const count = await db.getState({ type: "count" });

    // Get keys only
    const keys = await db.getState({ type: "keys" });

    // Get unique values from index
    const unique = await db.getState({
      type: "unique",
      index: "category",
      limit: 10,
    });
    ```

---

## Selective Persistence

You can persist only specific parts of state:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Only persist certain keys via manual hook
    AppStore.afterHook(({ state, patches }) => {
        // Only save if user or preferences changed
        const relevantPatches = patches.filter(p => p.path[0] === "user" || p.path[0] === "preferences");
        if (relevantPatches.length > 0) {
            localStorage.setItem("app-state", JSON.stringify({
                user: state.user,
                preferences: state.preferences,
            }));
        }
    });
    ```

=== "TypeScript"

    ```typescript
    // Only persist certain keys via manual hook
    AppStore.afterHook(({ state, patches }) => {
      // Only save if user or preferences changed
      const relevantPatches = patches.filter(p =>
        p.path[0] === "user" || p.path[0] === "preferences"
      );

      if (relevantPatches.length > 0) {
        localStorage.setItem("app-state", JSON.stringify({
          user: state.user,
          preferences: state.preferences,
        }));
      }
    });
    ```

---

## Migration Strategies

### LocalStorage Version Migration

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const storage = createLocalStorage({
        name: "app",
        version: 2, // Increment for schema changes
    });
    // Manual migration check
    async function migrateIfNeeded() {
        const saved = await storage.getState();
        if (saved && saved._version === 1) {
            // Migrate from v1 to v2
            const migrated = {
                ...saved,
                // Transform old schema to new
                preferences: {
                    theme: saved.theme || "light",
                    ...saved.preferences,
                },
                _version: 2,
            };
            await storage.setState(migrated);
            return migrated;
        }
        return saved;
    }
    ```

=== "TypeScript"

    ```typescript
    const storage = createLocalStorage({
      name: "app",
      version: 2,  // Increment for schema changes
    });

    // Manual migration check
    async function migrateIfNeeded() {
      const saved = await storage.getState();

      if (saved && saved._version === 1) {
        // Migrate from v1 to v2
        const migrated = {
          ...saved,
          // Transform old schema to new
          preferences: {
            theme: saved.theme || "light",
            ...saved.preferences,
          },
          _version: 2,
        };

        await storage.setState(migrated);
        return migrated;
      }

      return saved;
    }
    ```

### IndexedDB Version Migration

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // IDB handles migrations via version numbers
    // Increment version to trigger onupgradeneeded
    const db = await createIdbPromise({
        name: "my-app",
        version: 2, // Up from 1
        storeName: "todos",
        keyPath: "id",
        indexName: "createdAt",
    });
    // The adapter recreates the store on version change
    ```

=== "TypeScript"

    ```typescript
    // IDB handles migrations via version numbers
    // Increment version to trigger onupgradeneeded

    const db = await createIdbPromise({
      name: "my-app",
      version: 2,  // Up from 1
      storeName: "todos",
      keyPath: "id",
      indexName: "createdAt",
    });

    // The adapter recreates the store on version change
    ```

---

## API Reference

### LocalStorage

| Function | Description |
|----------|-------------|
| `createLocalStorage({ name, version })` | Create localStorage adapter |
| `persistToLocalStorageThunk(adapter)` | Create persistence hook |

**LocalStorage Adapter Methods:**

| Method | Description |
|--------|-------------|
| `adapter.getState()` | Load state from storage |
| `adapter.setState(state)` | Save state to storage |

### IndexedDB

| Function | Description |
|----------|-------------|
| `createIdbPromise(config)` | Create IndexedDB adapter |
| `persistToIdbThunk({ fromStateKey, toIDBStore })` | Create persistence hook |

**IDB Config:**

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Database name |
| `version` | `number` | Schema version |
| `storeName` | `string` | Object store name |
| `keyPath` | `string` | Primary key property |
| `indexName` | `string` | Index name |

**IDB Query Types:**

| Type | Description |
|------|-------------|
| `"all"` | Get all records |
| `"key"` | Get by primary key |
| `"index"` | Get by index value |
| `"range"` | Get records in range |
| `"cursor"` | Iterate with cursor |
| `"count"` | Count records |
| `"keys"` | Get keys only |
| `"unique"` | Get unique index values |
