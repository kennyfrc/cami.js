# Model

The `Model` class provides a way to define typed, validated stores with schemas. It combines the Type system with ObservableStore for robust state management.

## Overview

Models let you:

- Define state schemas for type safety
- Automatically validate state on every action
- Create stores with all features pre-configured
- Reference other models for relational data

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { Type } from "cami";
    // Define a model with schema
    const TodoModel = Type.Model("Todo", {
        id: Type.String,
        text: Type.String,
        done: Type.Boolean,
        priority: Type.Enum(["low", "medium", "high"]),
    });
    // Create a store from the model
    const todoStore = TodoModel.create({
        state: {
            id: "",
            text: "",
            done: false,
            priority: "medium",
        },
        actions: {
            setText: ({ state, payload }) => {
                state.text = payload;
            },
            toggle: ({ state }) => {
                state.done = !state.done;
            },
        },
    });
    ```

=== "TypeScript"

    ```typescript
    import { Type, type InferModelState } from "cami";

    // Define a model with schema
    const TodoModel = Type.Model("Todo", {
      id: Type.String,
      text: Type.String,
      done: Type.Boolean,
      priority: Type.Enum(["low", "medium", "high"]),
    });

    type TodoState = InferModelState<typeof TodoModel.schema>;

    // Create a store from the model
    const todoStore = TodoModel.create({
      state: {
        id: "",
        text: "",
        done: false,
        priority: "medium",
      } satisfies TodoState,
      actions: {
        setText: ({ state, payload }) => {
          state.text = payload as string;
        },
        toggle: ({ state }) => {
          state.done = !state.done;
        },
      },
    });
    ```

---

## Creating Models

### Using `Type.Model()`

The recommended way to create a model:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const UserModel = Type.Model("User", {
        id: Type.Integer,
        name: Type.String,
        email: Type.String,
        role: Type.Enum(["admin", "user", "guest"]),
        createdAt: Type.Date,
    });
    ```

=== "TypeScript"

    ```typescript
    import { Type, type InferModelState } from "cami";

    const UserModel = Type.Model("User", {
      id: Type.Integer,
      name: Type.String,
      email: Type.String,
      role: Type.Enum(["admin", "user", "guest"]),
      createdAt: Type.Date,
    });

    type User = InferModelState<typeof UserModel.schema>;
    ```

### Using the Model Class Directly

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { Model, Type } from "cami";
    const userModel = new Model({
        name: "User",
        properties: {
            id: Type.Integer,
            name: Type.String,
            email: Type.String,
        },
    });
    ```

=== "TypeScript"

    ```typescript
    import { Model, Type, type InferModelState } from "cami";

    const userModel = new Model({
      name: "User",
      properties: {
        id: Type.Integer,
        name: Type.String,
        email: Type.String,
      },
    });

    type User = InferModelState<typeof userModel.schema>;
    ```

---

## Creating Stores from Models

### `model.create(config)`

Creates an ObservableStore with automatic validation:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const UserModel = Type.Model("User", {
        id: Type.Integer,
        name: Type.String,
        email: Type.Optional(Type.String),
    });
    const userStore = UserModel.create({
        state: {
            id: 0,
            name: "",
            email: null,
        },
        actions: {
            setName: ({ state, payload }) => {
                state.name = payload;
            },
            setEmail: ({ state, payload }) => {
                state.email = payload;
            },
        },
    });
    // Use like any other store
    userStore.dispatch("setName", "John");
    userStore.dispatch("setEmail", "john@example.com");
    ```

=== "TypeScript"

    ```typescript
    const UserModel = Type.Model("User", {
      id: Type.Integer,
      name: Type.String,
      email: Type.Optional(Type.String),
    });

    const userStore = UserModel.create({
      state: {
        id: 0,
        name: "",
        email: null,
      },
      actions: {
        setName: ({ state, payload }) => {
          state.name = payload;
        },
        setEmail: ({ state, payload }) => {
          state.email = payload;
        },
      },
    });

    // Use like any other store
    userStore.dispatch("setName", "John");
    userStore.dispatch("setEmail", "john@example.com");
    ```

### Full Configuration

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const todoStore = TodoModel.create({
        // Initial state (validated against schema)
        state: {
            todos: [],
            filter: "all",
        },
        // Synchronous actions
        actions: {
            add: ({ state, payload }) => {
                state.todos.push(payload);
            },
            remove: ({ state, payload }) => {
                state.todos = state.todos.filter(t => t.id !== payload.id);
            },
        },
        // Async actions (thunks)
        asyncActions: {
            loadTodos: async ({ dispatch, query }) => {
                await query("fetchTodos");
            },
        },
        // State machines
        machines: {
            filter: {
                showAll: { from: { filter: "active" }, to: { filter: "all" } },
                showActive: { from: { filter: "all" }, to: { filter: "active" } },
            },
        },
        // Queries
        queries: {
            fetchTodos: {
                queryKey: ["todos"],
                queryFn: () => fetch("/api/todos").then(r => r.json()),
                onSuccess: ({ data, dispatch }) => {
                    dispatch("setTodos", data);
                },
            },
        },
        // Mutations
        mutations: {
            createTodo: {
                mutationFn: (todo) => fetch("/api/todos", {
                    method: "POST",
                    body: JSON.stringify(todo),
                }).then(r => r.json()),
                onSuccess: ({ invalidateQueries }) => {
                    invalidateQueries({ queryKey: ["todos"] });
                },
            },
        },
        // Action specifications
        specs: {
            add: {
                precondition: ({ payload }) => {
                    return payload?.text?.length > 0;
                },
            },
        },
        // Memoized values
        memos: {
            activeTodos: ({ state }) => {
                return state.todos.filter(t => !t.done);
            },
            completedCount: ({ state }) => {
                return state.todos.filter(t => t.done).length;
            },
        },
        // Store options
        options: {
            enableLogging: true,
        },
    });
    ```

=== "TypeScript"

    ```typescript
    const todoStore = TodoModel.create({
      // Initial state (validated against schema)
      state: {
        todos: [],
        filter: "all",
      },

      // Synchronous actions
      actions: {
        add: ({ state, payload }) => {
          state.todos.push(payload);
        },
        remove: ({ state, payload }) => {
          state.todos = state.todos.filter(t => t.id !== payload.id);
        },
      },

      // Async actions (thunks)
      asyncActions: {
        loadTodos: async ({ dispatch, query }) => {
          await query("fetchTodos");
        },
      },

      // State machines
      machines: {
        filter: {
          showAll: { from: { filter: "active" }, to: { filter: "all" } },
          showActive: { from: { filter: "all" }, to: { filter: "active" } },
        },
      },

      // Queries
      queries: {
        fetchTodos: {
          queryKey: ["todos"],
          queryFn: () => fetch("/api/todos").then(r => r.json()),
          onSuccess: ({ data, dispatch }) => {
            dispatch("setTodos", data);
          },
        },
      },

      // Mutations
      mutations: {
        createTodo: {
          mutationFn: (todo) => fetch("/api/todos", {
            method: "POST",
            body: JSON.stringify(todo),
          }).then(r => r.json()),
          onSuccess: ({ invalidateQueries }) => {
            invalidateQueries({ queryKey: ["todos"] });
          },
        },
      },

      // Action specifications
      specs: {
        add: {
          precondition: ({ payload }) => {
            return payload?.text?.length > 0;
          },
        },
      },

      // Memoized values
      memos: {
        activeTodos: ({ state }) => {
          return state.todos.filter(t => !t.done);
        },
        completedCount: ({ state }) => {
          return state.todos.filter(t => t.done).length;
        },
      },

      // Store options
      options: {
        enableLogging: true,
      },
    });
    ```

---

## Validation

### Automatic State Validation

When you use `model.create()`, state is validated:

1. **Initial state** is validated against the schema
2. **After each action**, state is re-validated
3. **Async actions** validate state after completion

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const CounterModel = Type.Model("Counter", {
        count: Type.Natural, // Must be >= 0
    });
    const counterStore = CounterModel.create({
        state: { count: 0 },
        actions: {
            decrement: ({ state }) => {
                state.count -= 1; // Will throw if count becomes negative!
            },
        },
    });
    counterStore.dispatch("decrement"); // count = -1 → ValidationError!
    ```

=== "TypeScript"

    ```typescript
    const CounterModel = Type.Model("Counter", {
      count: Type.Natural,  // Must be >= 0
    });

    const counterStore = CounterModel.create({
      state: { count: 0 },
      actions: {
        decrement: ({ state }) => {
          state.count -= 1;  // Will throw if count becomes negative!
        },
      },
    });

    counterStore.dispatch("decrement");  // count = -1 → ValidationError!
    ```

### Manual Validation

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const userModel = new Model({
        name: "User",
        properties: {
            name: Type.String,
            age: Type.Natural,
        },
    });
    // Validate arbitrary data
    userModel.validateState({ name: "John", age: 30 }); // OK
    userModel.validateState({ name: "John", age: -5 }); // Throws!
    ```

=== "TypeScript"

    ```typescript
    const userModel = new Model({
      name: "User",
      properties: {
        name: Type.String,
        age: Type.Natural,
      },
    });

    // Validate arbitrary data
    userModel.validateState({ name: "John", age: 30 });  // OK
    userModel.validateState({ name: "John", age: -5 });  // Throws!
    ```

---

## Model References

Models can reference other models for relational data:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Define related models
    const DepartmentModel = Type.Model("Department", {
        id: Type.Integer,
        name: Type.String,
    });
    const EmployeeModel = Type.Model("Employee", {
        id: Type.Integer,
        name: Type.String,
        departmentId: Type.Reference("Department"), // Stores department ID (validated as number)
    });
    // Root store with both
    const RootModel = Type.Model("Root", {
        departments: Type.Array(DepartmentModel),
        employees: Type.Array(EmployeeModel),
    });
    const rootStore = RootModel.create({
        state: {
            departments: [],
            employees: [],
        },
        actions: {
            addDepartment: ({ state, payload }) => {
                state.departments.push(payload);
            },
            addEmployee: ({ state, payload }) => {
                // Note: Type.Reference validates that departmentId is a number,
                // but does NOT validate that the referenced department exists.
                // Add your own validation if referential integrity is required.
                state.employees.push(payload);
            },
        },
    });
    // Add data
    rootStore.dispatch("addDepartment", { id: 1, name: "Engineering" });
    rootStore.dispatch("addEmployee", {
        id: 1,
        name: "John",
        departmentId: 1, // References Engineering by ID
    });
    ```

=== "TypeScript"

    ```typescript
    // Define related models
    const DepartmentModel = Type.Model("Department", {
      id: Type.Integer,
      name: Type.String,
    });

    const EmployeeModel = Type.Model("Employee", {
      id: Type.Integer,
      name: Type.String,
      departmentId: Type.Reference("Department"),  // Stores department ID (validated as number)
    });

    // Root store with both
    const RootModel = Type.Model("Root", {
      departments: Type.Array(DepartmentModel),
      employees: Type.Array(EmployeeModel),
    });

    const rootStore = RootModel.create({
      state: {
        departments: [],
        employees: [],
      },
      actions: {
        addDepartment: ({ state, payload }) => {
          state.departments.push(payload);
        },
        addEmployee: ({ state, payload }) => {
          // Note: Type.Reference validates that departmentId is a number,
          // but does NOT validate that the referenced department exists.
          // Add your own validation if referential integrity is required.
          state.employees.push(payload);
        },
      },
    });

    // Add data
    rootStore.dispatch("addDepartment", { id: 1, name: "Engineering" });
    rootStore.dispatch("addEmployee", {
      id: 1,
      name: "John",
      departmentId: 1,  // References Engineering by ID
    });
    ```

---

## Nested Models

Models can be nested within other models:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const AddressModel = Type.Model("Address", {
        street: Type.String,
        city: Type.String,
        zip: Type.String,
    });
    const PersonModel = Type.Model("Person", {
        name: Type.String,
        address: AddressModel, // Nested model
    });
    const personStore = PersonModel.create({
        state: {
            name: "",
            address: {
                street: "",
                city: "",
                zip: "",
            },
        },
        actions: {
            setAddress: ({ state, payload }) => {
                state.address = payload; // Validated as Address schema
            },
        },
    });
    ```

=== "TypeScript"

    ```typescript
    const AddressModel = Type.Model("Address", {
      street: Type.String,
      city: Type.String,
      zip: Type.String,
    });

    const PersonModel = Type.Model("Person", {
      name: Type.String,
      address: AddressModel,  // Nested model
    });

    const personStore = PersonModel.create({
      state: {
        name: "",
        address: {
          street: "",
          city: "",
          zip: "",
        },
      },
      actions: {
        setAddress: ({ state, payload }) => {
          state.address = payload;  // Validated as Address schema
        },
      },
    });
    ```

---

## Complete Example

Here's a full example of a todo app using models:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { Type, html, ReactiveElement } from "cami";
    // Define the todo item model
    const TodoItemModel = Type.Model("TodoItem", {
        id: Type.String,
        text: Type.String,
        done: Type.Boolean,
        createdAt: Type.Date,
    });
    // Define the todo list model
    const TodoListModel = Type.Model("TodoList", {
        todos: Type.Array(TodoItemModel),
        filter: Type.Enum(["all", "active", "completed"]),
    });
    // Create the store
    const todoStore = TodoListModel.create({
        state: {
            todos: [],
            filter: "all",
        },
        actions: {
            add: ({ state, payload }) => {
                state.todos.push({
                    id: crypto.randomUUID(),
                    text: payload.text,
                    done: false,
                    createdAt: new Date(),
                });
            },
            toggle: ({ state, payload }) => {
                const todo = state.todos.find(t => t.id === payload.id);
                if (todo) {
                    todo.done = !todo.done;
                }
            },
            remove: ({ state, payload }) => {
                state.todos = state.todos.filter(t => t.id !== payload.id);
            },
            setFilter: ({ state, payload }) => {
                state.filter = payload;
            },
            clearCompleted: ({ state }) => {
                state.todos = state.todos.filter(t => !t.done);
            },
        },
        memos: {
            filteredTodos: ({ state }) => {
                switch (state.filter) {
                    case "active":
                        return state.todos.filter(t => !t.done);
                    case "completed":
                        return state.todos.filter(t => t.done);
                    default:
                        return state.todos;
                }
            },
            stats: ({ state }) => ({
                total: state.todos.length,
                active: state.todos.filter(t => !t.done).length,
                completed: state.todos.filter(t => t.done).length,
            }),
        },
        specs: {
            add: {
                precondition: ({ payload }) => {
                    return typeof payload?.text === "string" && payload.text.trim().length > 0;
                },
            },
        },
    });
    // Use in component
    class TodoApp extends ReactiveElement {
        template() {
            const { filter } = todoStore.getState();
            const todos = todoStore.memo("filteredTodos");
            const stats = todoStore.memo("stats");
            return html `
          <div>
            <h1>Todos (${stats.active} remaining)</h1>

            <form @submit=${this.handleAdd}>
              <input type="text" name="text" placeholder="What needs to be done?" />
              <button type="submit">Add</button>
            </form>

            <div>
              ${["all", "active", "completed"].map(f => html `
                <button
                  @click=${() => todoStore.dispatch("setFilter", f)}
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
                    @change=${() => todoStore.dispatch("toggle", { id: todo.id })}
                  />
                  <span style=${todo.done ? "text-decoration: line-through" : ""}>
                    ${todo.text}
                  </span>
                  <button @click=${() => todoStore.dispatch("remove", { id: todo.id })}>
                    ×
                  </button>
                </li>
              `)}
            </ul>

            ${stats.completed > 0 ? html `
              <button @click=${() => todoStore.dispatch("clearCompleted")}>
                Clear completed (${stats.completed})
              </button>
            ` : null}
          </div>
        `;
        }
        handleAdd(e) {
            e.preventDefault();
            const form = e.target;
            const input = form.elements.text;
            if (input.value.trim()) {
                todoStore.dispatch("add", { text: input.value.trim() });
                input.value = "";
            }
        }
    }
    customElements.define("todo-app", TodoApp);
    ```

=== "TypeScript"

    ```typescript
    import { Type, html, ReactiveElement } from "cami";

    // Define the todo item model
    const TodoItemModel = Type.Model("TodoItem", {
      id: Type.String,
      text: Type.String,
      done: Type.Boolean,
      createdAt: Type.Date,
    });

    // Define the todo list model
    const TodoListModel = Type.Model("TodoList", {
      todos: Type.Array(TodoItemModel),
      filter: Type.Enum(["all", "active", "completed"]),
    });

    // Create the store
    const todoStore = TodoListModel.create({
      state: {
        todos: [],
        filter: "all",
      },

      actions: {
        add: ({ state, payload }) => {
          state.todos.push({
            id: crypto.randomUUID(),
            text: payload.text,
            done: false,
            createdAt: new Date(),
          });
        },

        toggle: ({ state, payload }) => {
          const todo = state.todos.find(t => t.id === payload.id);
          if (todo) {
            todo.done = !todo.done;
          }
        },

        remove: ({ state, payload }) => {
          state.todos = state.todos.filter(t => t.id !== payload.id);
        },

        setFilter: ({ state, payload }) => {
          state.filter = payload;
        },

        clearCompleted: ({ state }) => {
          state.todos = state.todos.filter(t => !t.done);
        },
      },

      memos: {
        filteredTodos: ({ state }) => {
          switch (state.filter) {
            case "active":
              return state.todos.filter(t => !t.done);
            case "completed":
              return state.todos.filter(t => t.done);
            default:
              return state.todos;
          }
        },

        stats: ({ state }) => ({
          total: state.todos.length,
          active: state.todos.filter(t => !t.done).length,
          completed: state.todos.filter(t => t.done).length,
        }),
      },

      specs: {
        add: {
          precondition: ({ payload }) => {
            return typeof payload?.text === "string" && payload.text.trim().length > 0;
          },
        },
      },
    });

    // Use in component
    class TodoApp extends ReactiveElement {
      template() {
        const { filter } = todoStore.getState();
        const todos = todoStore.memo("filteredTodos");
        const stats = todoStore.memo("stats");

        return html`
          <div>
            <h1>Todos (${stats.active} remaining)</h1>

            <form @submit=${this.handleAdd}>
              <input type="text" name="text" placeholder="What needs to be done?" />
              <button type="submit">Add</button>
            </form>

            <div>
              ${["all", "active", "completed"].map(f => html`
                <button
                  @click=${() => todoStore.dispatch("setFilter", f)}
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
                    @change=${() => todoStore.dispatch("toggle", { id: todo.id })}
                  />
                  <span style=${todo.done ? "text-decoration: line-through" : ""}>
                    ${todo.text}
                  </span>
                  <button @click=${() => todoStore.dispatch("remove", { id: todo.id })}>
                    ×
                  </button>
                </li>
              `)}
            </ul>

            ${stats.completed > 0 ? html`
              <button @click=${() => todoStore.dispatch("clearCompleted")}>
                Clear completed (${stats.completed})
              </button>
            ` : null}
          </div>
        `;
      }

      handleAdd(e) {
        e.preventDefault();
        const form = e.target;
        const input = form.elements.text;
        if (input.value.trim()) {
          todoStore.dispatch("add", { text: input.value.trim() });
          input.value = "";
        }
      }
    }

    customElements.define("todo-app", TodoApp);
    ```

---

## API Reference

### Model Class

| Method | Description |
|--------|-------------|
| `new Model({ name, properties })` | Create a model instance |
| `model.create(config)` | Create a store from the model |
| `model.validateState(state)` | Validate state against schema |

### Type.Model

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const createModel = Type.Model;
    ```

=== "TypeScript"

    ```typescript
    const createModel: (
      name: string,
      properties: Record<string, TypeDefinition>,
    ) => Model = Type.Model
    ```

### model.create() Config

| Option | Type | Description |
|--------|------|-------------|
| `state` | `TState` | Initial state (required) |
| `actions` | `Record<string, ActionHandler>` | Sync actions |
| `asyncActions` | `Record<string, AsyncActionHandler>` | Async actions |
| `machines` | `Record<string, StateMachineDefinition>` | State machines |
| `queries` | `Record<string, QueryConfig>` | Query definitions |
| `mutations` | `Record<string, MutationConfig>` | Mutation definitions |
| `specs` | `Record<string, ActionSpec>` | Action validation |
| `memos` | `Record<string, MemoHandler>` | Memoized values |
| `options` | `StoreConfig` | Store options |
