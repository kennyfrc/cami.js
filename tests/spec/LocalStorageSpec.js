const { store, Type, createLocalStorage, persistToLocalStorageThunk } = cami;

describe("LocalStorage Adapter", function () {
  let TodoModel;
  let todoLocalStorage;
  let todoStore;
  const localStorageKey = "test-todo-local-storage";

  beforeAll(async function () {
    todoLocalStorage = createLocalStorage({
      name: localStorageKey,
      version: 1,
    });
    TodoModel = Type.Model("TodoModel", {
      todos: Type.Array(
        Type.Product({
          id: Type.Integer,
          title: Type.String,
          completed: Type.Boolean,
        })
      ),
      todoStatus: Type.Enum("idle", "pending", "success", "error"),
      todoError: Type.Optional(Type.String),
      newTodoTitle: Type.String,
      editingTodoId: Type.Optional(Type.Integer),
    });

    todoStore = TodoModel.create({
      state: {
        todos: [],
        todoStatus: "idle",
        todoError: null,
        newTodoTitle: "",
        editingTodoId: null,
      },
      actions: {
        createTodoItem: ({ state, payload }) => {
          state.todos.push({
            id: payload.id,
            title: payload.title,
            completed: payload.completed || false,
          });
        },
        deleteTodoItem: ({ state, payload }) => {
          state.todos = state.todos.filter((todo) => todo.id !== payload.id);
        },
        modifyTodoTitle: ({ state, payload }) => {
          const todo = state.todos.find((todo) => todo.id === payload.id);
          if (todo) {
            todo.title = payload.title;
          }
        },
        resetTodos: ({ state }) => {
          state.todos = [];
        },
      },
    });

    todoStore.afterHook(persistToLocalStorageThunk(todoLocalStorage));
  });

  beforeEach(async function () {
    localStorage.clear();
    await todoStore.dispatch("resetTodos");
  });

  afterAll(function () {
    localStorage.clear();
  });

  async function createNewTodoStore() {
    const storedState = await todoLocalStorage.getState();
    return TodoModel.create({
      state: storedState || {
        todos: [],
        todoStatus: "idle",
        todoError: null,
        newTodoTitle: "",
        editingTodoId: null,
      },
    });
  }

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
    const keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => deepEqual(a[key], b[key]));
  }

  it("should persist todo additions to localStorage", async function () {
    await todoStore.dispatch("createTodoItem", {
      id: 1,
      title: "Test Todo",
      completed: false,
    });

    const newTodoStore = await createNewTodoStore();

    expect(deepEqual(newTodoStore.getState().todos, [
      { id: 1, title: "Test Todo", completed: false },
    ])).toBe(true);
  });

  it("should handle todo removals in localStorage", async function () {
    await todoStore.dispatch("createTodoItem", {
      id: 1,
      title: "Todo 1",
      completed: false,
    });
    await todoStore.dispatch("createTodoItem", {
      id: 2,
      title: "Todo 2",
      completed: false,
    });
    await todoStore.dispatch("deleteTodoItem", { id: 1 });

    const newTodoStore = await createNewTodoStore();

    expect(deepEqual(newTodoStore.getState().todos, [
      { id: 2, title: "Todo 2", completed: false },
    ])).toBe(true);
  });

  it("should persist todo updates to localStorage", async function () {
    await todoStore.dispatch("createTodoItem", {
      id: 1,
      title: "Original Title",
      completed: false,
    });
    await todoStore.dispatch("modifyTodoTitle", { id: 1, title: "Updated Title" });

    const newTodoStore = await createNewTodoStore();

    expect(deepEqual(newTodoStore.getState().todos, [
      { id: 1, title: "Updated Title", completed: false },
    ])).toBe(true);
  });

  it("should maintain state consistency across multiple operations", async function () {
    await todoStore.dispatch("createTodoItem", {
      id: 1,
      title: "Todo 1",
      completed: false,
    });
    await todoStore.dispatch("createTodoItem", {
      id: 2,
      title: "Todo 2",
      completed: true,
    });
    await todoStore.dispatch("modifyTodoTitle", { id: 1, title: "Updated Todo 1" });
    await todoStore.dispatch("deleteTodoItem", { id: 2 });

    const newTodoStore = await createNewTodoStore();

    expect(deepEqual(newTodoStore.getState().todos, [
      { id: 1, title: "Updated Todo 1", completed: false },
    ])).toBe(true);
  });
});
