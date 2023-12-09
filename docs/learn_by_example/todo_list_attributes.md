# Todo List (Attribute Data)

This is useful when you render an HTML page using a server template engine like Handlebars, ERB, or Jinja. You can pass data from the server to the client using attributes upon page load. Alternatively, you can also pass data asynchronously (see Todo List - Server State).

<iframe width="100%" height="500" src="//jsfiddle.net/kennyfrc12/fmqag6rw/13/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## HTML:

```html
<cami-todo-list-from-attributes
    todos='{"data": ["Buy milk", "Buy eggs", "Buy bread"]}'
  ></cami-todo-list-from-attributes>
</article>
<!-- <script src="./build/cami.cdn.js"></script> -->
<!-- CDN version below -->
<script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script>
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
        <input id="newTodo" type="text" placeholder="Enter todo title" />
        <button @click=${() => {
          const input = document.querySelector('#newTodo');
          const newTodoTitle = input.value;
          input.value = ''; // Clear the input after getting the value
          this.addTodo(newTodoTitle);
        }}>Add Todo</button>
        <ul>
          ${this.todos.map((todo, index) => html`
            <li>
              ${todo}
              <a @click=${() => this.deleteTodo(todo)}>Remove</a>
            </li>
          `)}
        </ul>
      `;
    }

  }

  customElements.define('cami-todo-list-from-attributes', MyComponent);
</script>
```
