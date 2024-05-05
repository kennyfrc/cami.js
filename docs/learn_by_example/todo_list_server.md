# Todo List (Server State)

This demonstrates how you can retrieve data from the server asynchronously and then use it in your element. Notice that loading, error, and success states are handled automatically for you.

<iframe width="100%" height="600" src="//jsfiddle.net/kennyfrc12/wLzanrsf/241/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## HTML:

```html
<article>
  <cami-todo-list-server></cami-todo-list-server>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement, http } = cami;

  class TodoListElement extends ReactiveElement {
    todos = this.query({
      queryKey: ['todos'],
      queryFn: () => {
        return fetch("https://api.camijs.com/todos?_limit=5").then(res => res.json())
      },
      staleTime: 1000 * 60 * 5
    })

    addTodo = this.mutation({
      mutationFn: (newTodo) => {
        return fetch("https://api.camijs.com/todos", {
          method: "POST",
          body: JSON.stringify(newTodo),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then(res => {
          document.querySelector('.note').innerHTML = 'Todo was dispatched to the server. Since we are using a mock API in this demo, this wont work. In your development environment, you would need to persist the changes to your database. Once you do that, query() will refetch the data from the server and will update the task list as you would expect.';
          return res.json();
        })
      }
    });

    deleteTodo = this.mutation({
      mutationFn: (todo) => {
        return fetch(`https://api.camijs.com/todos/${todo.id}`, {
          method: "DELETE"
        }).then(res => {
          document.querySelector('.note').innerHTML = 'Todo was deleted from the server. Since we are using a mock API in this demo, this wont work. In your development environment, you would need to persist the changes to your database. Once you do that, query() will refetch the data from the server and will update the task list as you would expect.';
          return res.json();
        })
      }
    });

    template() {
      if (this.addTodo.status === "pending") {
        return html`
          <li class="md-opacity-50">
            Adding new todo...
          </li>
        `;
      }

      if (this.deleteTodo.status === "pending") {
        return html`
          <li class="md-opacity-50">
            Deleting todo...
          </li>
        `;
      }

      if (this.todos.data) {
        return html`
          <input class="newTodo md-input" type="text" />
          <button class="md-button" @click=${() => {
            const input = document.querySelector('.newTodo');
            const newTodoTitle = input.value;
            input.value = ''; // Clear the input after getting the value
            this.addTodo.mutate({
              title: newTodoTitle,
              completed: false
            })
          }}>Add</button>
          <ul>
            ${this.todos.data.slice().reverse().map(todo => html`
              <li class="md-list-item">
                ${todo.title}
                <button class="md-button" @click=${() => this.deleteTodo.mutate(todo)}>Delete</button>
              </li>
            `)}
          </ul>
        `;
      }

      if (this.todos.status === "pending") {
        return html`<div class="md-loading">Loading...</div>`;
      }

      if (this.todos.status === "error") {
        return html`<div class="md-error">Error: ${this.todos.errorDetails}</div>`;
      }

      if (this.addTodo.status === "error") {
        return html`<div class="md-error">Error: ${this.addTodo.errorDetails}</div>`;
      }
    }
  }

  customElements.define('cami-todo-list-server', TodoListElement);
</script>

```
