const { html, ReactiveElement } = cami
class MyComponent extends ReactiveElement {
    todos = [];
    onConnect() {
        this.observableAttributes({
            todos: (value) => JSON.parse(value).data,
        });
    }
    addTodo(todo) {
        this.todos = [...this.todos, todo];
    }
    deleteTodo(todo) {
        this.todos = this.todos.filter((candidate) => candidate !== todo);
    }
    template() {
        return html `
      <input id="newTodo" type="text" placeholder="Enter todo title" />
      <button @click=${() => {
            const input = this.querySelector('#newTodo');
            if (!input?.value.trim())
                return;
            this.addTodo(input.value.trim());
            input.value = '';
        }}>Add Todo</button>
      <ul>
        ${this.todos.map((todo) => html `
          <li>${todo} <button @click=${() => this.deleteTodo(todo)}>Remove</button></li>
        `)}
      </ul>
    `;
    }
}
customElements.define('cami-todo-list-from-attributes', MyComponent);
