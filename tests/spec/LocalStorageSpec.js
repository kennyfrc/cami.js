const { store, Type, createLocalStorage, persistToLocalStorageThunk } = cami;

describe("LocalStorage Adapter", function() {
  let TodoModel;
  let todoLocalStorage;
  let todoStore;
  const localStorageKey = 'test-todo-local-storage';

  beforeAll(function() {
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

  beforeEach(async function() {
    // Clear the todos before each test
    localStorage.clear();
    todoStore.dispatch('resetTodos');
  });

  afterAll(function() {
    // Clear the localStorage after all tests
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

  it("should persist todo additions to localStorage", async function() {
    todoStore.dispatch('createTodoItem', { id: 1, title: "Test Todo", completed: false });

    const newTodoStore = await createNewTodoStore();

    expect(newTodoStore.getState().todos).toEqual([
      { id: 1, title: "Test Todo", completed: false }
    ]);
  });

  it("should handle todo removals in localStorage", async function() {
    todoStore.dispatch('createTodoItem', { id: 1, title: "Todo 1", completed: false });
    todoStore.dispatch('createTodoItem', { id: 2, title: "Todo 2", completed: false });
    todoStore.dispatch('deleteTodoItem', { id: 1 });

    const newTodoStore = await createNewTodoStore();

    expect(newTodoStore.getState().todos).toEqual([
      { id: 2, title: "Todo 2", completed: false }
    ]);
  });

  it("should persist todo updates to localStorage", async function() {
    todoStore.dispatch('createTodoItem', { id: 1, title: "Original Title", completed: false });
    todoStore.dispatch('modifyTodoTitle', { id: 1, title: "Updated Title" });

    const newTodoStore = await createNewTodoStore();

    expect(newTodoStore.getState().todos).toEqual([
      { id: 1, title: "Updated Title", completed: false }
    ]);
  });

  it("should maintain state consistency across multiple operations", async function() {
    todoStore.dispatch('createTodoItem', { id: 1, title: "Todo 1", completed: false });
    todoStore.dispatch('createTodoItem', { id: 2, title: "Todo 2", completed: true });
    todoStore.dispatch('modifyTodoTitle', { id: 1, title: "Updated Todo 1" });
    todoStore.dispatch('deleteTodoItem', { id: 2 });

    const newTodoStore = await createNewTodoStore();

    expect(newTodoStore.getState().todos).toEqual([
      { id: 1, title: "Updated Todo 1", completed: false }
    ]);
  });
});
