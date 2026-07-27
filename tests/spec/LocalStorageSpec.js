import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const { store, createLocalStorage, persistToLocalStorageThunk } = cami

describe('LocalStorage Adapter', function () {
  let todoLocalStorage
  let todoStore
  const localStorageKey = 'test-todo-local-storage'

  beforeAll(async function () {
    todoLocalStorage = createLocalStorage({
      name: localStorageKey,
      version: 1,
    })
    todoStore = store({
      name: `${localStorageKey}-source`,
      state: {
        todos: [],
        todoStatus: 'idle',
        todoError: null,
        newTodoTitle: '',
        editingTodoId: null,
      },
    })

    todoStore.defineAction('createTodoItem', ({ state, payload }) => {
      state.todos.push({
        id: payload.id,
        title: payload.title,
        completed: payload.completed || false,
      })
    })
    todoStore.defineAction('deleteTodoItem', ({ state, payload }) => {
      state.todos = state.todos.filter(todo => todo.id !== payload.id)
    })
    todoStore.defineAction('modifyTodoTitle', ({ state, payload }) => {
      const todo = state.todos.find(todo => todo.id === payload.id)
      if (todo) todo.title = payload.title
    })
    todoStore.defineAction('resetTodos', ({ state }) => {
      state.todos = []
    })

    todoStore.afterHook(persistToLocalStorageThunk(todoLocalStorage))
  })

  beforeEach(async function () {
    localStorage.clear()
    await todoStore.dispatch('resetTodos')
  })

  afterAll(function () {
    localStorage.clear()
  })

  async function createNewTodoStore() {
    const storedState = await todoLocalStorage.getState()
    return store({
      name: `${localStorageKey}-read-${Date.now()}-${Math.random()}`,
      state: storedState || {
        todos: [],
        todoStatus: 'idle',
        todoError: null,
        newTodoTitle: '',
        editingTodoId: null,
      },
    })
  }

  function deepEqual(a, b) {
    if (a === b) return true
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
    const keysA = Object.keys(a),
      keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    return keysA.every(key => deepEqual(a[key], b[key]))
  }

  it('should persist todo additions to localStorage', async function () {
    await todoStore.dispatch('createTodoItem', {
      id: 1,
      title: 'Test Todo',
      completed: false,
    })

    const newTodoStore = await createNewTodoStore()

    expect(
      deepEqual(newTodoStore.getState().todos, [{ id: 1, title: 'Test Todo', completed: false }])
    ).toBe(true)
  })

  it('should handle todo removals in localStorage', async function () {
    await todoStore.dispatch('createTodoItem', {
      id: 1,
      title: 'Todo 1',
      completed: false,
    })
    await todoStore.dispatch('createTodoItem', {
      id: 2,
      title: 'Todo 2',
      completed: false,
    })
    await todoStore.dispatch('deleteTodoItem', { id: 1 })

    const newTodoStore = await createNewTodoStore()

    expect(
      deepEqual(newTodoStore.getState().todos, [{ id: 2, title: 'Todo 2', completed: false }])
    ).toBe(true)
  })

  it('should persist todo updates to localStorage', async function () {
    await todoStore.dispatch('createTodoItem', {
      id: 1,
      title: 'Original Title',
      completed: false,
    })
    await todoStore.dispatch('modifyTodoTitle', {
      id: 1,
      title: 'Updated Title',
    })

    const newTodoStore = await createNewTodoStore()

    expect(
      deepEqual(newTodoStore.getState().todos, [
        { id: 1, title: 'Updated Title', completed: false },
      ])
    ).toBe(true)
  })

  it('should maintain state consistency across multiple operations', async function () {
    await todoStore.dispatch('createTodoItem', {
      id: 1,
      title: 'Todo 1',
      completed: false,
    })
    await todoStore.dispatch('createTodoItem', {
      id: 2,
      title: 'Todo 2',
      completed: true,
    })
    await todoStore.dispatch('modifyTodoTitle', {
      id: 1,
      title: 'Updated Todo 1',
    })
    await todoStore.dispatch('deleteTodoItem', { id: 2 })

    const newTodoStore = await createNewTodoStore()

    expect(
      deepEqual(newTodoStore.getState().todos, [
        { id: 1, title: 'Updated Todo 1', completed: false },
      ])
    ).toBe(true)
  })
})
