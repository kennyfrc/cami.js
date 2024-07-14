const { html, ReactiveElement } = cami;

class TaskManagerElement extends ReactiveElement {
  constructor() {
    super();
    this.tasks = [];
  }

  addTask(task) {
    this.tasks = [...this.tasks, task];
  }

  removeFirstTask() {
    this.tasks = this.tasks.slice(1);
  }

  removeLastTask() {
    this.tasks = this.tasks.slice(0, -1);
  }

  addTaskToFront(task) {
    this.tasks = [task, ...this.tasks];
  }

  removeTask(index) {
    this.tasks = [...this.tasks.slice(0, index), ...this.tasks.slice(index + 1)];
  }

  replaceTask(index, task) {
    this.tasks = [...this.tasks.slice(0, index), task, ...this.tasks.slice(index + 1)];
  }

  sortTasks() {
    this.tasks = [...this.tasks].sort();
  }

  reverseTasks() {
    this.tasks = [...this.tasks].reverse();
  }

  fillTasks(task) {
    this.tasks = this.tasks.map(() => task);
  }

  copyWithinTasks(target, start, end) {
    const newTasks = [...this.tasks];
    newTasks.copyWithin(target, start, end);
    this.tasks = newTasks;
  }

  template() {
    return html`
      <input id="taskInput" type="text" placeholder="Enter task name">
      <button @click=${() => this.addTask(document.getElementById('taskInput').value)}>Add Task</button>
      <button @click=${() => this.removeFirstTask()}>Remove First Task</button>
      <button @click=${() => this.removeLastTask()}>Remove Last Task</button>
      <button @click=${() => this.addTaskToFront(document.getElementById('taskInput').value)}>Add Task to Front</button>
      <button @click=${() => this.replaceTask(1, document.getElementById('taskInput').value)}>Replace Second Task</button>
      <button @click=${() => this.sortTasks()}>Sort Tasks</button>
      <button @click=${() => this.reverseTasks()}>Reverse Tasks</button>
      <button @click=${() => this.fillTasks(document.getElementById('taskInput').value)}>Fill Tasks</button>
      <button @click=${() => this.copyWithinTasks(0, 1, 2)}>Copy Within Tasks by Index from 0 to 1</button>
      <ul>
        ${this.tasks.map((task, index) => html`
          <li>
            ${task}
            <a @click=${() => this.removeTask(index)}>Remove</a>
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('task-manager-component', TaskManagerElement);
