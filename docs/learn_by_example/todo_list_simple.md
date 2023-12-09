# Todo List (In-Memory State)

A simple example to help you get the basics. In practice, you'd want to persist the data. See [Todo List - Server State](todo_list_server.md) for an example of how to retrieve from & mutate to a server.

<iframe width="100%" height="600" src="//jsfiddle.net/kennyfrc12/ak7xh153/29/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## HTML:

```html
<article>
  <cami-todo-list-simple></cami-todo-list-simple>
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
      this.setFilter(this.filter);
    }

    setFilter(filter) {
      this.filter = filter;
    }

    getFilteredTasks() {
      switch (this.filter) {
        case 'completed':
          return this.tasks.filter(task => task.completed);
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

  customElements.define('cami-todo-list-simple', TaskManagerElement);
</script>
```
