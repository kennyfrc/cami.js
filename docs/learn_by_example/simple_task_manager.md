# Simple Task Manager

Just in-memory state. Good example for learning the basic workings of cami.

<hr>

<article>
  <task-manager-component-be></task-manager-component-be>
</article>
<script type="module">
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
        <div class="md-form-group">
          <input id="taskInput" class="md-input" type="text" placeholder="Enter task name">
          <button class="md-button" @click=${() => {
            this.addTask(document.getElementById('taskInput').value);
            document.getElementById('taskInput').value = '';
          }}>Add Task</button>
        </div>
        <div class="md-button-group">
          <button class="md-button" @click=${() => this.setFilter('all')}>All</button>
          <button class="md-button" @click=${() => this.setFilter('active')}>Active</button>
          <button class="md-button" @click=${() => this.setFilter('completed')}>Completed</button>
        </div>
        <ul class="md-list">
          ${this.getFilteredTasks().map((task, index) => html`
            <li class="md-list-item">
              <input class="md-checkbox" type="checkbox" .checked=${task.completed} @click=${() => this.toggleTask(index)}>
              <span class="md-text">${task.name}</span>
              <a class="md-link" @click=${() => this.removeTask(index)}>Remove</a>
            </li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('task-manager-component-be', TaskManagerElement);
</script>


HTML:

```html
<article>
  <task-manager-component-be></task-manager-component-be>
</article>
<script type="module">
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
        <div class="md-form-group">
          <input id="taskInput" class="md-input" type="text" placeholder="Enter task name">
          <button class="md-button" @click=${() => {
            this.addTask(document.getElementById('taskInput').value);
            document.getElementById('taskInput').value = '';
          }}>Add Task</button>
        </div>
        <div class="md-button-group">
          <button class="md-button" @click=${() => this.setFilter('all')}>All</button>
          <button class="md-button" @click=${() => this.setFilter('active')}>Active</button>
          <button class="md-button" @click=${() => this.setFilter('completed')}>Completed</button>
        </div>
        <ul class="md-list">
          ${this.getFilteredTasks().map((task, index) => html`
            <li class="md-list-item">
              <input class="md-checkbox" type="checkbox" .checked=${task.completed} @click=${() => this.toggleTask(index)}>
              <span class="md-text">${task.name}</span>
              <a class="md-link" @click=${() => this.removeTask(index)}>Remove</a>
            </li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('task-manager-component-be', TaskManagerElement);
</script>

```
