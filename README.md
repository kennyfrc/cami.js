# 🏝️ Cami, a minimalist & flexible toolkit for interactive islands & state management in web applications

## Key Features:

- No Build Step: Reduce complexity in your projects. Just import the module and start using it.
- Reactive Web Components (Light DOM): Create interactive islands in web applications, and doesn't take over your frontend. Based on Web Standards. No Shadow DOM.
- Lit-HTML Templates: Declarative & powerful templates with directives like `@click`, attribute binding, composability, caching, custom directives, and more.
- Singleton Store: When you have multiple islands, you can use a singleton store to share state between them, and it acts as a single source of truth for your application state, allowing for time-travel debugging with its Redux DevTools integration.
- Middleware: You can use middleware to add functionality like logging.
- Backend Agnostic: You don't have to turn everything into a javascript project. You can use Cami with any backend technology. It's just a module that you can import into your project.
- Minimalist: It's lightweight and simple, focusing on core functionality.

## Philosophy

- **[Hypermedia-friendly Scripting](https://htmx.org/essays/hypermedia-friendly-scripting/)**: Most applications are best driven by the server, with views mostly consisting of HTML & CSS templates. The server should generally be the source of truth. For highly interactive areas such as chat, text editors, and calculators, you can then use Cami to help you build those interactive islands.
- **[Islands Architecture](https://www.patterns.dev/posts/islands-architecture)**: Using any backend technology you like (ruby, haskell, rust, etc), you first serve your pages with HTML & CSS templates. When your application needs more interactivity, you can use Hypermedia-friendly libraries like HTMX and Unpoly. And when you really need to build highly interactive islands, you can use Cami. Just because you have a requirement, it should not mean a whole rewrite of your frontend with a heavy javascript framework.
- **Portable & Flexible Tools**: You can import Cami into any javascript project. If you like our state management (`createStore()`), you can use it with React, Vue, or any other framework. If you like our reactive web component (`ReactiveElement`), you can use them with any other state management library.

## Usage

### Example 1: Simple Counter App, just uses ReactiveElement

```html
<todo-list-component></todo-list-component>
<script type="module">
  import { html, ReactiveElement } from './cami.module.js';

  class CounterElement extends ReactiveElement {
    state = { count: 0 };

    increment() {
      this.setState({ count: this.state.count + 1 });
    }

    decrement() {
      this.setState({ count: this.state.count - 1 });
    }

    template(state) {
      return html`
        <button @click=${() => this.decrement()}>-</button>
        <span>${state.count}</span>
        <button @click=${() => this.increment()}>+</button>
      `;
    }
  }

  customElements.define('counter-component', CounterElement);
</script>
```

### Example 2: Todo List App, uses ReactiveElement & createStore

```html
<todo-list-component></todo-list-component>
<script type="module">
  import { createStore, html, ReactiveElement } from './cami.module.js';

  // Step 1: Define the initial state of our store
  const todoStore = createStore({
    todos: [],
  });

  // Step 2: Register reducers for adding and removing todo items
  todoStore.register('add', (draftStore, payload) => {
    draftStore.todos.push(payload);
  });

  todoStore.register('delete', (draftStore, payload) => {
    draftStore.todos = draftStore.todos.filter(todo => todo !== payload);
  });

  const loggingMiddleware = ({ getState, dispatch }) => next => (action, payload) => {
    console.log('Before dispatching:', getState());
    const result = next(action, payload);
    console.log('After dispatching:', getState());
    return result;
  };

  todoStore.use(loggingMiddleware);

  // Define the native Web Component
  class TodoListElement extends ReactiveElement {
    state = { todos: [] };

    connectedCallback() {
      super.connectedCallback();
      todoStore.subscribe((draftStore) => {
        this.setState({ todos: draftStore.todos });
      });
    }

    template(state) {
      return html`
        <input id="newTodo" type="text" />
        <button @click=${() => {
          const newTodo = document.getElementById('newTodo').value;
          todoStore.dispatch("add", newTodo);
        }}>Add</button>
        <ul>
          ${state.todos.map(todo => html`
            <li>
              ${todo}
              <button @click=${() => todoStore.dispatch("delete", todo)}>Delete</button>
            </li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('todo-list-component', TodoListElement);
</script>
```

## Roadmap

- Tests
- Schema Setup: We plan to add support for setting up a schema for your state.
- Automatic Schema Validation: We plan to add automatic schema validation to ensure your state always matches the defined schema.

## Prior Art

- Immer
- Redux
