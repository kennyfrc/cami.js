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

    template() {
      return html`
        <input id="taskInput" type="text" placeholder="Enter task name">
        <button @click=${() => {
          this.addTask(document.getElementById('taskInput').value);
          document.getElementById('taskInput').value = '';
        }}>Add Task</button>
        <ul>
          ${this.tasks.map((task, index) => html`
            <li>
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
