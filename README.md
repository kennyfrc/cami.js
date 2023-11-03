# 🏝️ Cami.js

⚠️ Expect API changes until v1.0.0 ⚠️

Current version: 0.0.8

A minimalist & flexible toolkit for interactive islands & state management in web applications.

## Motivation

I wanted a minimalist javascript library that has no build steps, great debuggability, and didn't take over my front-end.

My workflow is simple: I want to start any application with normal HTML/CSS, and if there were fragments or islands that needed to be interactive (such as dashboards & calculators), I needed a powerful enough library that I could easily drop in without rewriting my whole front-end. Unfortunately, the latter is the case for the majority of javascript libraries out there.

That said, I like the idea of declarative templates, uni-directional data flow, time-travel debugging, and fine-grained reactivity. But I wanted no build steps (or at least make 'no build' the default). So I created Cami.

## Key Features:

- No Build Step: Reduce complexity in your projects. Just import the module and start using it.
- Reactive Web Components (Light DOM, Observables): Create interactive islands in web applications, and doesn't take over your frontend. Based on Web Standards. No Shadow DOM. Fine-grained reactivity with observables, computed properties, and effects. For deeply nested objects, you can use `setFields()` to update them.
- Lit-HTML Templates: Declarative & powerful templates with directives like `@click`, attribute binding, composability, caching, custom directives, and more.
- Singleton Store: When you have multiple islands, you can use a singleton store to share state between them, and it acts as a single source of truth for your application state, allowing for time-travel debugging with its Redux DevTools integration.
- Middleware: You can use middleware to add functionality like logging.
- Backend Agnostic: You don't have to turn everything into a javascript project. You can use Cami with any backend technology. It's just a module that you can import into your project.
- Minimalist: It's lightweight and simple, with minimal abstractions.

## Who is this for?

- **Developers of Small to Medium-sized Applications**: If you're building a small to medium-sized application, you can use Cami as your main frontend framework. It's a great choice for dashboards, calculators, and other interactive islands. If you're working in more complex applications, you may need something more componentized with a large ecosystem, so we're not a good fit for that.
- **Developers of Multi-Page Applications**: For folks who have an existing server-rendered application, that's mostly static, you can use Cami to add interactive islands to your application, along with other MPA-oriented libraries like HTMX, Unpoly, Turbo, or TwinSpark.

## Philosophy

- **Built for Any Backend / MPA**: Cami is built for Multi-Page Applications, using any backend technology you like (ruby, haskell, rust, etc). Write HTML/CSS for layouts and static content, and use Cami for interactive islands. You don't have to turn everything into a javascript project. It's just a module that you can import into your project with no build steps. It doesn't have a router as we recommend prefer server-driven navigation. If you don't like full page reloads, you can use HTMX, Unpoly, Turbo, or TwinSpark, and Cami will still work with them.
- **Hypermedia-friendly Scripting**: Most applications are best driven by the server, with views mostly consisting of HTML & CSS templates. The server should generally be the source of truth. For highly interactive areas such as chat, text editors, and calculators, you can then use Cami to help you build those interactive islands.
- **Portable & Flexible Tools**: You can import Cami into any javascript project. If you like our state management (`createStore()`), you can use it with React, Vue, or any other framework. If you like our reactive web component (`ReactiveElement`), you can use it alone.

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
          this.computed('countSquared', () => {
            return this.count * this.count
          });
          this.effect(() => console.log(`Count: ${this.count} & Count Squared: ${this.countSquared}`));
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
            <span>Base: ${this.count}</span>
            <span>Squared: ${this.countSquared}</span>
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
        this.subscribe('todos', todoStore);
      }

      template() {
        return html`
          <input id="newTodo" type="text" />
          <button @click=${() => {
            const newTodo = document.getElementById('newTodo').value;
            this.dispatch("add", newTodo);
            document.getElementById('newTodo').value = '';
          }}>Add</button>
          <ul>
            ${this.todos.map(todo => html`
              <li>
                ${todo}
                <button @click=${() => this.dispatch("delete", todo)}>Delete</button>
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


### Example 3: Nested Objects, uses createStore, ReactiveElement, & html tagged literals

```html
<html>
  <head>
    <!-- ... -->
  </head>
<body>
  <user-list-component></user-list-component>
  <script type="module">
    import { createStore, html, ReactiveElement } from './cami.module.js';
    // Step 1: Define the initial state of our store
    const userStore = createStore({
      users: [
        { id: 1, name: "Alice", status: "Active" },
        { id: 2, name: "Bob", status: "Inactive" },
      ],
    });

    // Step 2: Register a reducer for updating a user's status
    userStore.register('updateStatus', (draftStore, payload) => {
      const user = draftStore.users.find(user => user.id === payload.id);
      if (user) {
        user.status = payload.status;
      }
    });

    // Step 3: Define a custom element that uses the store
    class UserListElement extends ReactiveElement {
      constructor() {
        super();
        this.subscribe('users', userStore);
      }

      template() {
        return html`
          <ul>
            ${this.users.map(user => html`
              <li>
                ${user.name} - ${user.status}
                <button @click=${() => this.dispatch("updateStatus", { id: user.id, status: "Active" })}>Activate</button>
                <button @click=${() => this.dispatch("updateStatus", { id: user.id, status: "Inactive" })}>Deactivate</button>
              </li>
            `)}
          </ul>
        `;
      }
    }

    customElements.define('user-list-component', UserListElement);
  </script>
</body>
</html>
```

### Example 4: Asynchronous Actions

```html
<html>
  <head>
    <!-- ... -->
  </head>
<body>
  <article>
    <h1>Fetch Posts with ReactiveElement and Store</h1>
    <posts-component></posts-component>
  </article>
  <script type="module">
    import { html, ReactiveElement } from './cami.module.js';

    class PostsElement extends ReactiveElement {
      constructor() {
        super();
        this.observable('posts', []);
        this.observable('loading', true);
      }

      async connectedCallback() {
        this.loading = true;
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await response.json();
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(500);
        this.posts = posts.slice(0, 3);
        this.loading = false;
      }

      template() {
        if (this.loading) {
          return html`<div>Loading...</div>`;
        } else {
          return html`
            <ul>
              ${this.posts.map(post => html`<li>${post.title}</li>`)}
            </ul>
          `;
        }
      }
    }

    customElements.define('posts-component', PostsElement);
  </script>
</body>
</html>
```

### Example 5: Deeply Nested Objects

Normally, the reducer functions in the stores would do this well. But if you want to do it in the component, you can do it using `setFields()`.

```html
<html>
  <head>
    <!-- ... -->
  </head>
<body>
  <article>
    <h1>Deeply Nested Objects</h1>
    <nested-observable-element></nested-observable-element>
  </article>
  <script type="module">
    import { html, ReactiveElement } from './cami.module.js';

    class NestedObservableElement extends ReactiveElement {
      constructor() {
        super();
        this.observable('user', {
          name: 'John',
          age: 30,
          address: {
            street: '123 Main St',
            city: 'Anytown',
            country: 'USA',
            postalCode: '12345',
            coordinates: {
              lat: '40.7128',
              long: '74.0060'
            }
          }
        });
      }

      changeUser() {
        this.setFields('user', draftUser => {
          if (draftUser.name == 'John') {
            draftUser.name = 'Jane';
            draftUser.age = 31;
            draftUser.address.street = '456 Elm St';
            draftUser.address.city = 'Othertown';
            draftUser.address.country = 'Canada';
            draftUser.address.postalCode = '67890';
            draftUser.address.coordinates.lat = '51.5074';
            draftUser.address.coordinates.long = '0.1278';
          } else {
            draftUser.name = 'John';
            draftUser.age = 30;
            draftUser.address.street = '123 Main St';
            draftUser.address.city = 'Anytown';
            draftUser.address.country = 'USA';
            draftUser.address.postalCode = '12345';
            draftUser.address.coordinates.lat = '40.7128';
            draftUser.address.coordinates.long = '74.0060';
          }
        });
      }

      changeName() {
        this.setFields('user', draftUser => {
          if (draftUser.name == 'John') draftUser.name = 'Jane';
          else draftUser.name = 'John';
        });
      }

      changeStreet() {
        this.setFields('user', draftUser => {
          if (draftUser.address.street == '123 Main St') draftUser.address.street = '456 Elm St';
          else draftUser.address.street = '123 Main St';
        });
      }

      changeLat() {
        this.setFields('user', draftUser => {
          if (draftUser.address.coordinates.lat == '40.7128') draftUser.address.coordinates.lat = '51.5074';
          else draftUser.address.coordinates.lat = '40.7128';
        });
      }

      template() {
        return html`
          <div>Name: ${this.user.name}</div>
          <div>Street: ${this.user.address.street}</div>
          <div>Latitude: ${this.user.address.coordinates.lat}</div>
          <button @click=${() => this.changeUser()}>Change User</button>
          <button @click=${() => this.changeName()}>Change Name</button>
          <button @click=${() => this.changeStreet()}>Change Street</button>
          <button @click=${() => this.changeLat()}>Change Latitude</button>
        `;
      }
    }


    customElements.define('nested-observable-element', NestedObservableElement);
  </script>
</body>
</html>
```

### Example 6: Reactive Client-side Form Validation

```html
```html
<html>
  <head>
    <!-- ... -->
  </head>
<body>
  <form-component></form-component>
  <script type="module">
    import { html, ReactiveElement } from './cami.module.js';

    class FormElement extends ReactiveElement {
      constructor() {
        super();
        this.observable('email', '');
        this.observable('password', '');
        this.observable('emailError', '');
        this.observable('passwordError', '');
      }

      validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
          this.emailError = 'Please enter a valid email address.';
        } else {
          this.emailError = '';
        }
      }

      validatePassword() {
        if (this.password.length < 8) {
          this.passwordError = 'Password must be at least 8 characters long.';
        } else {
          this.passwordError = '';
        }
      }

      template() {
        return html`
          <form action="/submit" method="POST">
            <label>
              Email:
              <input type="email" @input=${(e) => { this.email = e.target.value; this.validateEmail(); }} value=${this.email}>
              <span>${this.emailError}</span>
            </label>
            <label>
              Password:
              <input type="password" @input=${(e) => { this.password = e.target.value; this.validatePassword(); }} value=${this.password}>
              <span>${this.passwordError}</span>
            </label>
            <input type="submit" value="Submit" ?disabled=${this.emailError || this.passwordError}>
          </form>
        `;
      }
    }

    customElements.define('form-component', FormElement);
  </script>
</body>
</html>
```

### Example 7: Nested Comopnents and Async Fetching

```html
<html>
  <head>
    <!-- ... -->
  </head>
<body>
  <blog-component></blog-component>
  <script type="module">
    import { html, ReactiveElement } from './cami.module.js';

    class PostElement extends ReactiveElement {
      constructor() {
        super();
        this.observable('title', '');
        this.observable('body', '');
      }

      template() {
        return html`
          <article>
            <h2>${this.title}</h2>
            <p>${this.body}</p>
          </article>
        `;
      }
    }

    customElements.define('post-component', PostElement);

    class BlogElement extends ReactiveElement {
      constructor() {
        super();
        this.observable('posts', []);
      }

      connectedCallback() {
        super.connectedCallback();
        this.fetchPosts();
      }

      async fetchPosts() {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await response.json();
        this.posts = posts;
      }

      template() {
        return html`
          <section>
            ${this.posts.map(post => html`
              <post-component .title=${post.title} .body=${post.body}></post-component>
            `)}
          </section>
        `;
      }
    }

    customElements.define('blog-component', BlogElement);
  </script>
</body>
</html>
```

### Example 8: Shared Store Between Components

```html
<html>
  <head>
    <!-- ... -->
  </head>
<body>
  <article>
    <h2>Products</h2>
    <product-list-component></product-list-component>
  </article>
  <article>
    <h2>Cart</h2>
    <cart-component></cart-component>
  </article>

  <script type="module">
    import { html, ReactiveElement } from './cami.module.js';

      const cartStore = createStore({
        cartItems: [],
        products: [
          { id: 1, name: 'Product 1', price: 100, disabled: false, stock: 10 },
          { id: 2, name: 'Product 2', price: 200, disabled: false, stock: 5 },
          { id: 3, name: 'Product 3', price: 300, disabled: false, stock: 2 },
        ]
      });

      cartStore.register('add', (state, product) => {
        const cartItem = { ...product, cartItemId: Date.now() };
        state.cartItems.push(cartItem);
        state.products = state.products.map(p => {
          if (p.id === product.id) {
            p.stock--;
          }
          return p;
        });
      });
      cartStore.register('remove', (state, product) => {
        state.cartItems = state.cartItems.filter(item => item.cartItemId !== product.cartItemId);
        state.products = state.products.map(p => {
          if (p.id === product.id) {
            p.stock++;
          }
          return p;
        });
      });

      class ProductListElement extends ReactiveElement {
        constructor() {
          super();
          this.subscribe('cartItems', cartStore);
          this.subscribe('products', cartStore);
        }

        addToCart(product) {
          this.dispatch('add', product);
        }

        isProductInCart(product) {
          return this.cartItems ? this.cartItems.some(item => item.id === product.id) : false;
        }

        isOutOfStock(product) {
          return product.stock === 0;
        }

        template() {
          return html`
            <ul>
              ${this.products.map(product => html`
                <li>
                  ${product.name} - ${product.price} | Stock: ${product.stock}
                  <button @click=${() => this.addToCart(product)} ?disabled=${this.isOutOfStock(product)}>
                    Add to cart
                  </button>
                </li>
              `)}
            </ul>
          `;
        }
      }

      customElements.define('product-list-component', ProductListElement);

      class CartElement extends ReactiveElement {
        constructor() {
          super();
          this.subscribe('cartItems', cartStore);
          this.computed('cartValue', () => {
            return this.cartItems.reduce((acc, item) => acc + item.price, 0);
          });
        }

        removeFromCart(product) {
          this.dispatch('remove', product);
        }

        template() {
          return html`
            <p>Cart value: ${this.cartValue}</p>
            <ul>
              ${this.cartItems.map(item => html`
                <li>${item.name} - ${item.price}</li><button @click=${() => this.removeFromCart(item)}>Remove</button>
              `)}
            </ul>
          `;
        }
      }

      customElements.define('cart-component', CartElement);
    </script>
  </body>
</html>
```

## API

### `ReactiveElement` (`class`)

A class that extends `HTMLElement` to create reactive web components that can automatically update their view when their state changes. It uses observables to track changes in state.

**Methods:**

- `observable(key, initialValue)`: Defines an observable property. Throws an error if the key is already defined.
- `subscribe(key, store)`: Subscribes to a store and links it to an observable property. Throws an error if the key is already defined.
- `computed(key, fn)`: Defines a computed property. Throws an error if the key is already defined.
- `effect(fn)`: Defines an effect. Throws an error if the key is already defined.
- `dispatch(action, payload)`: Dispatches an action to the store.
- `setFields(key, fn)`: Sets deeply nested fields in an observable property, beyond the first level. Throws an error if the key is not defined.
- `template()`: A method that should be implemented to return the template to be rendered.
- `connectedCallback()`: Called each time the element is added to the document. Sets up initial state and triggers initial rendering.

Note: Lifecycle methods are part of the Light DOM. We do not implement the Shadow DOM in this library. While Shadow DOM provides style and markup encapsulation, there are drawbacks if we want this library to [interoperate with other libs](https://stackoverflow.com/questions/45917672/what-are-the-drawbacks-of-using-shadow-dom).


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

## Prior Art

- Immer
- Redux

## Why "Cami"?

It's short for [Camiguin](https://www.google.com/search?q=camiguin&sca_esv=576910264&tbm=isch&source=lnms&sa=X&sqi=2&ved=2ahUKEwjM_6rOp5SCAxV-9zgGHSW6CjYQ_AUoAnoECAMQBA&biw=1920&bih=944&dpr=1), a pretty nice island.


## Roadmap

- [ ] Add Tests
- [ ] State Sharing Across Components
- [ ] Middleware usage Example
- [ ] Real-time Updates Example
