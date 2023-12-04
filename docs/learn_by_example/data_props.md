# Task Manager (Attribute Data)

If you somehow need to define data in the web components attribute (perhaps its easier in your server-side templating language), you can do so with `observableAttributes`. You can pass a parsing function to that.

```html
<task-manager-props-be
    todos='{"data": ["Buy milk", "Buy eggs", "Buy bread"]}'
  ></task-manager-props-be>
```

<hr>

<article>
<task-manager-props-be
    todos='{"data": ["Buy milk", "Buy eggs", "Buy bread"]}'
  ></task-manager-props-be>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class MyComponent extends ReactiveElement {
    todos = []

    onConnect() {
      this.observableAttributes({
        todos: (v) => JSON.parse(v).data
      });
    }

    addTodo (todo) {
      this.todos.push(todo);
    }

    deleteTodo (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    }

    template() {
      return html`
        <input id="newTodo" type="text" class="md-input" placeholder="Add Task" />
        <button class="md-button" @click=${() => {
          this.addTodo(document.getElementById('newTodo').value); document.getElementById('newTodo').value = ''; }}
        >Add</button>
        <ul class="md-list">
          ${this.todos.map(todo => html`
            <li class="md-list-item">
              ${todo}
              <button class="md-button md-small" @click=${() => this.deleteTodo(todo)
              }>Delete</button>
            </li>
          `)}
        </ul>
      `;
    }

  }

  customElements.define('task-manager-props-be', MyComponent);

</script>

## JS Fiddle:

[https://jsfiddle.net/kennyfrc12/fmqag6rw/3/](https://jsfiddle.net/kennyfrc12/fmqag6rw/3/)

## HTML:

```html
<article>
<task-manager-props-be
    todos='{"data": ["Buy milk", "Buy eggs", "Buy bread"]}'
  ></task-manager-props-be>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class MyComponent extends ReactiveElement {
    todos = []

    onConnect() {
      this.observableAttributes({
        todos: (v) => JSON.parse(v).data
      });
    }

    addTodo (todo) {
      this.todos.push(todo);
    }

    deleteTodo (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    }

    template() {
      return html`
        <input id="newTodo" type="text" class="md-input" placeholder="Add Task" />
        <button class="md-button" @click=${() => {
          this.addTodo(document.getElementById('newTodo').value); document.getElementById('newTodo').value = ''; }}
        >Add</button>
        <ul class="md-list">
          ${this.todos.map(todo => html`
            <li class="md-list-item">
              ${todo}
              <button class="md-button md-small" @click=${() => this.deleteTodo(todo)
              }>Delete</button>
            </li>
          `)}
        </ul>
      `;
    }

  }

  customElements.define('task-manager-props-be', MyComponent);

</script>
```
