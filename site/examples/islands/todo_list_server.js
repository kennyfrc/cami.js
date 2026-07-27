const { html, ReactiveElement, store } = cami
const TodoStore = store({
    name: 'TodoStore',
    state: {
        todos: { status: 'idle', data: [], error: null },
        mutation: { status: 'idle', error: null },
    },
});
TodoStore.defineAction('todos:setPending', ({ state }) => {
    state.todos.status = 'pending';
    state.todos.error = null;
});
TodoStore.defineAction('todos:setSuccess', ({ state, payload }) => {
    state.todos = { status: 'success', data: payload, error: null };
});
TodoStore.defineAction('todos:setError', ({ state, payload }) => {
    state.todos.status = 'error';
    state.todos.error = payload instanceof Error ? payload.message : String(payload);
});
TodoStore.defineAction('mutation:set', ({ state, payload }) => {
    state.mutation = payload;
});
TodoStore.defineQuery('todos:fetch', {
    queryKey: ['todos'],
    queryFn: async () => {
        const response = await fetch('https://cami-api.exe.xyz/todos?_limit=5');
        if (!response.ok)
            throw new Error(`Todos request failed: ${response.status}`);
        return await response.json();
    },
    staleTime: 5 * 60_000,
    onFetch: ({ dispatch }) => dispatch('todos:setPending'),
    onSuccess: ({ data, dispatch }) => dispatch('todos:setSuccess', data),
    onError: ({ error, dispatch }) => dispatch('todos:setError', error),
});
TodoStore.defineMutation('todos:create', {
    mutationFn: async (newTodo) => {
        const response = await fetch('https://cami-api.exe.xyz/todos', {
            method: 'POST',
            body: JSON.stringify(newTodo),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok)
            throw new Error(`Create request failed: ${response.status}`);
        return await response.json();
    },
    onMutate: ({ dispatch }) => dispatch('mutation:set', { status: 'pending', error: null }),
    onError: ({ error, dispatch }) => dispatch('mutation:set', { status: 'error', error: error.message }),
    onSuccess: ({ dispatch }) => dispatch('mutation:set', { status: 'success', error: null }),
    onSettled: ({ invalidateQueries }) => invalidateQueries({ queryKey: ['todos'] }),
});
TodoStore.defineMutation('todos:delete', {
    mutationFn: async (todo) => {
        const response = await fetch(`https://cami-api.exe.xyz/todos/${todo.id}`, { method: 'DELETE' });
        if (!response.ok)
            throw new Error(`Delete request failed: ${response.status}`);
    },
    onMutate: ({ dispatch }) => dispatch('mutation:set', { status: 'pending', error: null }),
    onError: ({ error, dispatch }) => dispatch('mutation:set', { status: 'error', error: error.message }),
    onSuccess: ({ dispatch }) => dispatch('mutation:set', { status: 'success', error: null }),
    onSettled: ({ invalidateQueries }) => invalidateQueries({ queryKey: ['todos'] }),
});
void TodoStore.query('todos:fetch');
class TodoListElement extends ReactiveElement {
    handleAddTodo() {
        const input = this.querySelector('.newTodo');
        const title = input?.value.trim() ?? '';
        if (!input || !title)
            return;
        void TodoStore.mutate('todos:create', { title, completed: false });
        input.value = '';
    }
    handleDeleteTodo(todo) {
        void TodoStore.mutate('todos:delete', todo);
    }
    template() {
        const { todos, mutation } = TodoStore.getState();
        if (todos.status === 'pending')
            return html `<p>Loading…</p>`;
        if (todos.error)
            return html `<p role="alert">${todos.error}</p>`;
        return html `
      <input class="newTodo" placeholder="Add a todo">
      <button @click=${() => this.handleAddTodo()} ?disabled=${mutation.status === 'pending'}>Add</button>
      ${mutation.error ? html `<p role="alert">${mutation.error}</p>` : ''}
      <ul>${todos.data.slice().reverse().map((todo) => html `
        <li>${todo.title} <button @click=${() => this.handleDeleteTodo(todo)}>Delete</button></li>
      `)}</ul>
    `;
    }
}
customElements.define('todo-list-server', TodoListElement);
