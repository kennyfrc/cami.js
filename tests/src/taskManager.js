  const { html, ReactiveElement } = cami;

  class TaskManagerElement extends ReactiveElement {
    tasks = [];
    filter = 'all';

    addTask(task) {
      this.tasks.push({ name: task, completed: false });
    }

    removeTask(index) {
      this.tasks.splice(index, 1);
    }

    toggleTask(index) {
      this.tasks.update(tasks => {
        tasks[index].completed = !tasks[index].completed;
      });
    }

    setFilter(filter) {
      this.filter = filter;
    }

    getFilteredTasks() {
      switch (this.filter) {
        case 'completed':
          return this.tasks.filter(task => task.completed);
        case 'active':
          return this.tasks.filter(task => !task.completed);
        default:
          return this.tasks;
      }
    }

    template() {
      return html`
        <input id="taskInput" type="text" placeholder="Enter task name">
        <button @click=${() => {
          this.addTask(document.getElementById('taskInput').value);
          document.getElementById('taskInput').value = '';
        }}>Add Task</button>
        <button @click=${() => this.setFilter('all')}>All</button>
        <button @click=${() => this.setFilter('active')}>Active</button>
        <button @click=${() => this.setFilter('completed')}>Completed</button>
        <ul>
          ${this.getFilteredTasks().map((task, index) => html`
            <li>
              <input type="checkbox" .checked=${task.completed} @click=${() => this.toggleTask(index)}>
              ${task.name}
              <a @click=${() => this.removeTask(index)}>Remove</a>
            </li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('task-manager-component', TaskManagerElement);
