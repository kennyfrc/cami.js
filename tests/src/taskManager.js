const { html, ReactiveElement } = cami;

class TaskManagerElement extends ReactiveElement {
  tasks = [];

  addTask(task) {
    this.tasks.push(task); // push
  }

  removeFirstTask() {
    this.tasks.shift(); // shift
  }

  removeLastTask() {
    this.tasks.pop(); // pop
  }

  addTaskToFront(task) {
    this.tasks.unshift(task); // unshift
  }

  removeTask(index) {
    this.tasks.splice(index, 1); // splice
  }

  replaceTask(index, task) {
    this.tasks.splice(index, 1, task); // splice for replacement
  }

  sortTasks() {
    this.tasks.sort(); // sort
  }

  reverseTasks() {
    this.tasks.reverse(); // reverse
  }

  fillTasks(task) {
    this.tasks.fill(task); // fill
  }

  copyWithinTasks(target, start, end) {
    this.tasks.copyWithin(target, start, end); // copyWithin
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
