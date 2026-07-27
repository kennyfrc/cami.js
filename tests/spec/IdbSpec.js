import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const { store, Type, createIdbPromise, persistToIdbThunk } = cami

describe('IndexedDB Adapter', function () {
  let TodoModel
  let todoIDB
  let todoStore

  beforeAll(async function () {
    todoIDB = await createIdbPromise({
      name: 'TestTodoDB',
      version: 1,
      storeName: 'testTodos',
      keyPath: 'id',
      indexName: 'id',
    })

    TodoModel = Type.Model('TodoModel', {
      todos: Type.Array(
        Type.Product({
          id: Type.Integer,
          title: Type.String,
          completed: Type.Boolean,
        })
      ),
      todoStatus: Type.Enum('idle', 'pending', 'success', 'error'),
      todoError: Type.Optional(Type.String),
      newTodoTitle: Type.String,
      editingTodoId: Type.Optional(Type.Integer),
    })

    todoStore = TodoModel.create({
      state: {
        todos: [],
        todoStatus: 'idle',
        todoError: null,
        newTodoTitle: '',
        editingTodoId: null,
      },
      actions: {
        addTodo: ({ state, payload }) => {
          state.todos.push({
            id: payload.id,
            title: payload.title,
            completed: payload.completed || false,
          })
        },
        removeTodo: ({ state, payload }) => {
          state.todos = state.todos.filter(todo => todo.id !== payload.id)
        },
        updateTodoTitle: ({ state, payload }) => {
          const todo = state.todos.find(todo => todo.id === payload.id)
          if (todo) {
            todo.title = payload.title
          }
        },
        clearTodos: ({ state }) => {
          state.todos = []
        },
      },
    })

    todoStore.afterHook(
      persistToIdbThunk({
        fromStateKey: 'todos',
        toIDBStore: todoIDB,
      })
    )
  })

  beforeEach(async function () {
    // Clear the todos before each test
    todoStore.dispatch('clearTodos')
    await todoIDB.getState() // Wait for the state to be updated in IDB
  })

  afterAll(async function () {
    // Clear the IndexedDB store after all tests
    const tx = todoIDB.transaction('readwrite')
    const store = tx.objectStore(todoIDB.storeName)
    await new Promise(resolve => {
      const request = store.clear()
      request.onsuccess = resolve
    })
  })

  it('should persist todo additions to IndexedDB', async function () {
    todoStore.dispatch('addTodo', {
      id: 1,
      title: 'Test Todo',
      completed: false,
    })

    // Wait for the state to be updated in IDB
    await todoIDB.getState()

    // Create a new store instance to test persistence
    const newTodoStore = TodoModel.create({
      state: {
        todos: (await todoIDB.getState()) || [],
        todoStatus: 'idle',
        todoError: null,
        newTodoTitle: '',
        editingTodoId: null,
      },
    })

    expect(newTodoStore.getState().todos).toEqual([{ id: 1, title: 'Test Todo', completed: false }])
  })

  it('should handle todo removals in IndexedDB', async function () {
    todoStore.dispatch('addTodo', {
      id: 1,
      title: 'Todo 1',
      completed: false,
    })
    todoStore.dispatch('addTodo', {
      id: 2,
      title: 'Todo 2',
      completed: false,
    })
    todoStore.dispatch('removeTodo', { id: 1 })

    // Wait for the state to be updated in IDB
    await todoIDB.getState()

    // Create a new store instance to test persistence
    const newTodoStore = TodoModel.create({
      state: {
        todos: (await todoIDB.getState()) || [],
        todoStatus: 'idle',
        todoError: null,
        newTodoTitle: '',
        editingTodoId: null,
      },
    })

    expect(newTodoStore.getState().todos).toEqual([{ id: 2, title: 'Todo 2', completed: false }])
  })

  it('should persist todo updates to IndexedDB', async function () {
    todoStore.dispatch('addTodo', {
      id: 1,
      title: 'Original Title',
      completed: false,
    })
    todoStore.dispatch('updateTodoTitle', {
      id: 1,
      title: 'Updated Title',
    })

    // Wait for the state to be updated in IDB
    await todoIDB.getState()

    // Create a new store instance to test persistence
    const newTodoStore = TodoModel.create({
      state: {
        todos: (await todoIDB.getState()) || [],
        todoStatus: 'idle',
        todoError: null,
        newTodoTitle: '',
        editingTodoId: null,
      },
    })

    expect(newTodoStore.getState().todos).toEqual([
      { id: 1, title: 'Updated Title', completed: false },
    ])
  })

  it('should maintain state consistency across multiple operations', async function () {
    todoStore.dispatch('addTodo', {
      id: 1,
      title: 'Todo 1',
      completed: false,
    })
    todoStore.dispatch('addTodo', {
      id: 2,
      title: 'Todo 2',
      completed: true,
    })
    todoStore.dispatch('updateTodoTitle', {
      id: 1,
      title: 'Updated Todo 1',
    })
    todoStore.dispatch('removeTodo', { id: 2 })

    // Wait for the state to be updated in IDB
    await todoIDB.getState()

    // Create a new store instance to test persistence
    const newTodoStore = TodoModel.create({
      state: {
        todos: (await todoIDB.getState()) || [],
        todoStatus: 'idle',
        todoError: null,
        newTodoTitle: '',
        editingTodoId: null,
      },
    })

    expect(newTodoStore.getState().todos).toEqual([
      { id: 1, title: 'Updated Todo 1', completed: false },
    ])
  })
})
