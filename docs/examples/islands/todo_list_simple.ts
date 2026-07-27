import { html, ReactiveElement } from 'cami'

interface Task {
  name: string
  completed: boolean
}

class TaskManagerElement extends ReactiveElement {
  tasks: Task[] = []

  addTask(name: string): void {
    this.tasks = [...this.tasks, { name, completed: false }]
  }

  removeTask(index: number): void {
    this.tasks = this.tasks.filter((_task, taskIndex) => taskIndex !== index)
  }

  template(): ReturnType<typeof html> {
    return html`
      <input id="taskInput" type="text" placeholder="Enter task name">
      <button @click=${() => {
        const input = this.querySelector<HTMLInputElement>('#taskInput')
        if (!input?.value.trim()) return
        this.addTask(input.value.trim())
        input.value = ''
      }}>Add Task</button>
      <ul>
        ${this.tasks.map((task: Task, index: number) => html`
          <li>
            ${task.name}
            <button @click=${() => this.removeTask(index)}>Remove</button>
          </li>
        `)}
      </ul>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cami-todo-list-simple': TaskManagerElement
  }
}

customElements.define('cami-todo-list-simple', TaskManagerElement)
