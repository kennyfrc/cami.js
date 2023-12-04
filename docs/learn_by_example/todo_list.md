# Todo List with Server State

<article>
  <p><small class="note"></small></p>
  <todo-list-component-be></todo-list-component-be>
</article>
<script type="module">
  const { html, ReactiveElement, http } = cami;

  class TodoListElement extends ReactiveElement {
    todos = this.query({
      queryKey: ['todos'],
      queryFn: () => {
        return fetch("https://api.camijs.com/todos?_limit=5").then(res => res.json())
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
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
          document.querySelector('.note').innerHTML = 'Todo was dispatched to the server. Since we are using a mock API, this wont work. In your server environment, you would need to persist the changes to your server database. The query will automatically refetch the data from the server.';
          return res.json();
        })
      }
    });

    deleteTodo = this.mutation({
      mutationFn: (todo) => {
        return fetch(`https://api.camijs.com/todos/${todo.id}`, {
          method: "DELETE"
        }).then(res => {
          document.querySelector('.note').innerHTML = 'Todo was deleted from the server. Since we are using a mock API, this wont work. In your server environment, you would need to persist the changes to your server database. The query will automatically refetch the data from the server.';
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
        return html`<div class="md-error">Error: ${this.todos.error.message}</div>`;
      }

      if (this.addTodo.status === "error") {
        return html`<div class="md-error">Error: ${this.addTodo.error.message}</div>`;
      }
    }
  }

  customElements.define('todo-list-component-be', TodoListElement);
</script>

## JS Fiddle:

[https://jsfiddle.net/kennyfrc12/wLzanrsf/1/](https://jsfiddle.net/kennyfrc12/wLzanrsf/1/)

## HTML:

```html
<article>
  <todo-list-component-be></todo-list-component-be>
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
      staleTime: 1000 * 60 * 5 // 5 minutes
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
          document.querySelector('.note').innerHTML = 'Todo was dispatched to the server. Since we are using a mock API, this wont work. In your server environment, you would need to persist the changes to your server database. The query will automatically refetch the data from the server.';
          return res.json();
        })
      }
    });

    deleteTodo = this.mutation({
      mutationFn: (todo) => {
        return fetch(`https://api.camijs.com/todos/${todo.id}`, {
          method: "DELETE"
        }).then(res => {
          document.querySelector('.note').innerHTML = 'Todo was deleted from the server. Since we are using a mock API, this wont work. In your server environment, you would need to persist the changes to your server database. The query will automatically refetch the data from the server.';
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
        return html`<div class="md-error">Error: ${this.todos.error.message}</div>`;
      }

      if (this.addTodo.status === "error") {
        return html`<div class="md-error">Error: ${this.addTodo.error.message}</div>`;
      }
    }
  }

  customElements.define('todo-list-component-be', TodoListElement);
</script>

```
