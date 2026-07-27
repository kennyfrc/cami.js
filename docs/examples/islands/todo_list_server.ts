import { html, ReactiveElement, store } from 'cami'

type RequestStatus = 'idle' | 'pending' | 'success' | 'error'

interface Todo {
  id: number
  title: string
  completed: boolean
}

type NewTodo = Omit<Todo, 'id'>

interface TodoState {
  todos: { status: RequestStatus; data: Todo[]; error: string | null }
  mutation: { status: RequestStatus; error: string | null }
}

const TodoStore = store<TodoState>({
  name: 'TodoStore',
  state: {
    todos: { status: 'idle', data: [], error: null },
    mutation: { status: 'idle', error: null },
  },
})

TodoStore.defineAction('todos:setPending', ({ state }) => {
  state.todos.status = 'pending'
  state.todos.error = null
})

TodoStore.defineAction('todos:setSuccess', ({ state, payload }) => {
  state.todos = { status: 'success', data: payload as Todo[], error: null }
})

TodoStore.defineAction('todos:setError', ({ state, payload }) => {
  state.todos.status = 'error'
  state.todos.error = payload instanceof Error ? payload.message : String(payload)
})

TodoStore.defineAction('mutation:set', ({ state, payload }) => {
  state.mutation = payload as TodoState['mutation']
})

TodoStore.defineQuery<void, Todo[]>('todos:fetch', {
  queryKey: ['todos'],
  queryFn: async (): Promise<Todo[]> => {
    const response = await fetch('https://cami-api.exe.xyz/todos?_limit=5')
    if (!response.ok) throw new Error(`Todos request failed: ${response.status}`)
    return await response.json() as Todo[]
  },
  staleTime: 5 * 60_000,
  onFetch: ({ dispatch }) => dispatch('todos:setPending'),
  onSuccess: ({ data, dispatch }) => dispatch('todos:setSuccess', data),
  onError: ({ error, dispatch }) => dispatch('todos:setError', error),
})

TodoStore.defineMutation<NewTodo, Todo>('todos:create', {
  mutationFn: async (newTodo: NewTodo): Promise<Todo> => {
    const response = await fetch('https://cami-api.exe.xyz/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error(`Create request failed: ${response.status}`)
    return await response.json() as Todo
  },
  onMutate: ({ dispatch }) => dispatch('mutation:set', { status: 'pending', error: null }),
  onError: ({ error, dispatch }) => dispatch('mutation:set', { status: 'error', error: error.message }),
  onSuccess: ({ dispatch }) => dispatch('mutation:set', { status: 'success', error: null }),
  onSettled: ({ invalidateQueries }) => invalidateQueries({ queryKey: ['todos'] }),
})

TodoStore.defineMutation<Todo, void>('todos:delete', {
  mutationFn: async (todo: Todo): Promise<void> => {
    const response = await fetch(`https://cami-api.exe.xyz/todos/${todo.id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error(`Delete request failed: ${response.status}`)
  },
  onMutate: ({ dispatch }) => dispatch('mutation:set', { status: 'pending', error: null }),
  onError: ({ error, dispatch }) => dispatch('mutation:set', { status: 'error', error: error.message }),
  onSuccess: ({ dispatch }) => dispatch('mutation:set', { status: 'success', error: null }),
  onSettled: ({ invalidateQueries }) => invalidateQueries({ queryKey: ['todos'] }),
})

void TodoStore.query<Todo[]>('todos:fetch')

class TodoListElement extends ReactiveElement {
  handleAddTodo(): void {
    const input = this.querySelector<HTMLInputElement>('.newTodo')
    const title = input?.value.trim() ?? ''
    if (!input || !title) return
    void TodoStore.mutate<Todo>('todos:create', { title, completed: false } satisfies NewTodo)
    input.value = ''
  }

  handleDeleteTodo(todo: Todo): void {
    void TodoStore.mutate<void>('todos:delete', todo)
  }

  template(): ReturnType<typeof html> {
    const { todos, mutation } = TodoStore.getState()
    if (todos.status === 'pending') return html`<p>Loading…</p>`
    if (todos.error) return html`<p role="alert">${todos.error}</p>`

    return html`
      <input class="newTodo" placeholder="Add a todo">
      <button @click=${() => this.handleAddTodo()} ?disabled=${mutation.status === 'pending'}>Add</button>
      ${mutation.error ? html`<p role="alert">${mutation.error}</p>` : ''}
      <ul>${todos.data.slice().reverse().map((todo: Todo) => html`
        <li>${todo.title} <button @click=${() => this.handleDeleteTodo(todo)}>Delete</button></li>
      `)}</ul>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-list-server': TodoListElement
  }
}

customElements.define('todo-list-server', TodoListElement)
