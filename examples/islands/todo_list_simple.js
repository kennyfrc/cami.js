const { html, ReactiveElement } = cami
class TaskManagerElement extends ReactiveElement {
    tasks = [];
    addTask(name) {
        this.tasks = [...this.tasks, { name, completed: false }];
    }
    removeTask(index) {
        this.tasks = this.tasks.filter((_task, taskIndex) => taskIndex !== index);
    }
    template() {
        return html `
      <input id="taskInput" type="text" placeholder="Enter task name">
      <button @click=${() => {
            const input = this.querySelector('#taskInput');
            if (!input?.value.trim())
                return;
            this.addTask(input.value.trim());
            input.value = '';
        }}>Add Task</button>
      <ul>
        ${this.tasks.map((task, index) => html `
          <li>
            ${task.name}
            <button @click=${() => this.removeTask(index)}>Remove</button>
          </li>
        `)}
      </ul>
    `;
    }
}
customElements.define('cami-todo-list-simple', TaskManagerElement);
