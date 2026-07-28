import { html, ReactiveElement } from 'cami'

interface TodoPayload {
  data: string[]
}

class MyComponent extends ReactiveElement {
  todos: string[] = []

  onConnect(): void {
    this.observableAttributes({
      todos: (value: string): string[] => (JSON.parse(value) as TodoPayload).data,
    })
  }

  addTodo(todo: string): void {
    this.todos = [...this.todos, todo]
  }

  deleteTodo(todo: string): void {
    this.todos = this.todos.filter((candidate) => candidate !== todo)
  }

  template(): ReturnType<typeof html> {
    return html`
      <input id="newTodo" type="text" placeholder="Enter todo title" />
      <button @click=${() => {
        const input = this.querySelector<HTMLInputElement>('#newTodo')
        if (!input?.value.trim()) return
        this.addTodo(input.value.trim())
        input.value = ''
      }}>Add Todo</button>
      <ul>
        ${this.todos.map((todo: string) => html`
          <li>${todo} <button @click=${() => this.deleteTodo(todo)}>Remove</button></li>
        `)}
      </ul>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cami-todo-list-from-attributes': MyComponent
  }
}

customElements.define('cami-todo-list-from-attributes', MyComponent)
