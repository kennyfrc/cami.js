# 🏝️ Cami.js

⚠️ Expect API changes until v1.0.0 ⚠️

Current version: 0.0.5

A minimalist & flexible toolkit for interactive islands & state management in web applications.

## Motivation

Another javascript framework, you say? Well hear me out: I wanted a minimalist javascript library that had no build steps, had minimal abstractions, had great debuggability, does not take over my front-end, and is not a way to prime me up to subscribe to a cloud service. I just wanted a simple library that I can import into my applications, and use it to create better user experiences without cruft. I honestly couldn't find one, so I made one :)

## Key Features:

- No Build Step: Reduce complexity in your projects. Just import the module and start using it.
- Reactive Web Components (Light DOM): Create interactive islands in web applications, and doesn't take over your frontend. Based on Web Standards. No Shadow DOM.
- Lit-HTML Templates: Declarative & powerful templates with directives like `@click`, attribute binding, composability, caching, custom directives, and more.
- Singleton Store: When you have multiple islands, you can use a singleton store to share state between them, and it acts as a single source of truth for your application state, allowing for time-travel debugging with its Redux DevTools integration.
- Middleware: You can use middleware to add functionality like logging.
- Backend Agnostic: You don't have to turn everything into a javascript project. You can use Cami with any backend technology. It's just a module that you can import into your project.
- Minimalist: It's lightweight and simple, with minimal abstractions.

## Philosophy

- **Hypermedia-friendly Scripting**: Most applications are best driven by the server, with views mostly consisting of HTML & CSS templates. The server should generally be the source of truth. For highly interactive areas such as chat, text editors, and calculators, you can then use Cami to help you build those interactive islands.
- **Islands Architecture**: Using any backend technology you like (ruby, haskell, rust, etc), you first serve your pages with HTML & CSS templates. When your application needs more interactivity, you can use Hypermedia-friendly libraries like HTMX and Unpoly. And when you really need to build highly interactive islands, you can use Cami. Just because you have a requirement, it should not mean a whole rewrite of your frontend with a heavy javascript framework.
- **Portable & Flexible Tools**: You can import Cami into any javascript project. If you like our state management (`createStore()`), you can use it with React, Vue, or any other framework. If you like our reactive web component (`ReactiveElement`), you can use them with any other state management library.

## Usage

To try the examples, just go to the project root and run:

```bash
bun install --global serve
bunx serve
```

Then open http://localhost:3000 in your browser, then navigate to the examples folder.

### Example 1: Simple Counter App, just uses ReactiveElement & html tagged literals

```html
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <counter-component></counter-component>
    <script type="module">
      import { html, ReactiveElement } from './cami.module.js';

      class CounterElement extends ReactiveElement {
        constructor() {
          super();
          this.observable('count', 0);
        }

        increment() {
          this.count++;
        }

        decrement() {
          this.count--;
        }

        template() {
          return html`
            <button @click=${() => this.decrement()}>-</button>
            <span>${this.count}</span>
            <button @click=${() => this.increment()}>+</button>
          `;
        }
      }

      customElements.define('counter-component', CounterElement);
    </script>
  </body>
</html>
```

### Example 2: Todo List App, uses createStore, ReactiveElement, & html tagged literals

```html
<html>
  <head>
    <!-- ... -->
  </head>
<body>
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

    class TodoListElement extends ReactiveElement {
      constructor() {
        super();
        this.bindStore('todos', todoStore);
      }

      template() {
        return html`
          <input id="newTodo" type="text" />
          <button @click=${() => {
            const newTodo = document.getElementById('newTodo').value;
            todoStore.dispatch("add", newTodo);
          }}>Add</button>
          <ul>
            ${this.todos.map(todo => html`
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
</body>
</html>
```

## API

### `ReactiveElement` (`class`)

A class that extends `HTMLElement` to create reactive web components that can automatically update their view when their state changes.

**Methods:**

- `setState(newState)`: Updates the state and triggers a view update.
- `getState()`: Returns the current state.
- `template(state)`: A method that should be implemented to return the template to be rendered. It receives the current state as a parameter.

- `connectedCallback()`: Called each time the element is added to the document.
- `disconnectedCallback()`: Called each time the element is removed from the document.
- `adoptedCallback()`: Called each time the element is moved to a new document.
- `attributeChangedCallback(name, oldValue, newValue)`: Called when attributes are changed, added, removed, or replaced.

Note: These lifecycle methods are part of the Light DOM. We do not implement the Shadow DOM in this library. While Shadow DOM provides style and markup encapsulation, there are drawbacks if we want this library to [interoperate with other libs](https://stackoverflow.com/questions/45917672/what-are-the-drawbacks-of-using-shadow-dom).


### `createStore(initialState)`

Creates a new store with the provided initial state. The store is a singleton, meaning that if it has already been created, the existing instance will be returned.

**Parameters:**

- `initialState` (Object): The initial state of the store.

**Returns:**

A store object with the following methods:

- `state`: The current state of the store.
- `subscribe(listener)`: Adds a listener to the store and returns an unsubscribe function.
- `register(action, reducer)`: Adds a reducer to the store.
- `dispatch(action, payload)`: Adds an action to the dispatch queue and starts processing if not already doing so.
- `use(middleware)`: Adds a middleware to the store.

### `html`

A template literal tag used to create declarative templates with directives like `@click`, attribute binding, composability, caching, custom directives, and more.

It's based on lit-html, so best to check their docs for more info: [docs](https://lit.dev/docs/templates/overview/)

## Dev Usage

### Install Dependencies

```bash
bun install
```

### Building

```bash
bun run build:module
bun run build:cdn
```

### Typechecking

JSDoc is used for typechecking & documentation.

```bash
bun run type-check
```

### Testing

TBD

```bash
bun run test
```

## Prior Art

- Immer
- Redux

## Why "Cami"?

It's short for [Camiguin](https://www.google.com/search?q=camiguin&sca_esv=576910264&tbm=isch&source=lnms&sa=X&sqi=2&ved=2ahUKEwjM_6rOp5SCAxV-9zgGHSW6CjYQ_AUoAnoECAMQBA&biw=1920&bih=944&dpr=1), a pretty nice island.
