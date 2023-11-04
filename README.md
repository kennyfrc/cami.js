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

- **Hypermedia-driven API**: We recommend using a hypermedia-driven API, or in other words, never return JSON responses. Instead, return HTML. The purpose of Cami is to add interactivity to your application.
- **Built for Any Backend / MPA**: Cami is built for Multi-Page Applications, using any backend technology you like (ruby, haskell, rust, etc). Write HTML/CSS for layouts and static content, and use Cami for interactive islands. You don't have to turn everything into a javascript project. It's just a module that you can import into your project with no build steps. It doesn't have a router as we recommend prefer server-driven navigation. If you don't like full page reloads, you can use HTMX, Unpoly, Turbo, or TwinSpark, and Cami will still work with them.
- **Portable & Flexible Tools**: You can import Cami into any javascript project. If you like our state management (`createStore()`), you can use it with React, Vue, or any other framework. If you like our reactive web component (`ReactiveElement`), you can use it alone.

## API

### `ReactiveElement` (`class`)

A class that extends `HTMLElement` to create reactive web components that can automatically update their view when their state changes. It uses observables to track changes in state and provides a set of methods to interact with these observables and the component's lifecycle.

**Methods:**

- `observable(initialValue)`: Defines an observable property with an initial value. Returns an object with `value` property and `update` method.
- `subscribe(key, store)`: Subscribes to a store and links it to an observable property. Returns the observable.
- `computed(computeFn)`: Defines a computed property that depends on other observables. Returns an object with a `value` getter.
- `effect(effectFn)`: Defines an effect that is triggered when an observable changes. The effect function can optionally return a cleanup function.
- `dispatch(action, payload)`: Dispatches an action to the store.
- `template()`: A method that should be implemented to return the template to be rendered.
- `connectedCallback()`: Lifecycle method called each time the element is added to the document. Sets up initial state and triggers initial rendering.
- `disconnectedCallback()`: Lifecycle method called each time the element is removed from the document. Cleans up listeners and effects.

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

## Examples

To try the examples, just go to the project root and run:

```bash
bun install --global serve
bunx serve
```

Then open http://localhost:3000 in your browser, then navigate to the examples folder.

It's recommended to view these examples through localhost (see above).

```html
./examples/_cart.html
<article>
  <h2>Products</h2>
  <product-list-component></product-list-component>
</article>
<article>
  <h2>Cart</h2>
  <cart-component></cart-component>
</article>

<script type="module">
  import { createStore, html, ReactiveElement } from './build/cami.module.js';

  const cartStore = createStore({
    cartItems: [],
    products: [
      { id: 1, name: 'Product 1', price: 100, disabled: false, stock: 10 },
      { id: 2, name: 'Product 2', price: 200, disabled: false, stock: 5 },
      { id: 3, name: 'Product 3', price: 300, disabled: false, stock: 2 },
    ]
  });

  cartStore.register('add', (store, product) => {
    const cartItem = { ...product, cartItemId: Date.now() };
    store.cartItems.push(cartItem);
    store.products = store.products.map(p => {
      if (p.id === product.id) {
        p.stock--;
      }
      return p;
    });
  });
  cartStore.register('remove', (store, product) => {
    store.cartItems = store.cartItems.filter(item => item.cartItemId !== product.cartItemId);
    store.products = store.products.map(p => {
      if (p.id === product.id) {
        p.stock++;
      }
      return p;
    });
  });

  class ProductListElement extends ReactiveElement {
    constructor() {
      super();
      this.cartItems = this.subscribe(cartStore, 'cartItems');
      this.products = this.subscribe(cartStore, 'products');
    }

    addToCart(product) {
      this.dispatch('add', product);
    }

    isProductInCart(product) {
      return this.cartItems.value ? this.cartItems.value.some(item => item.id === product.id) : false;
    }

    isOutOfStock(product) {
      return product.stock === 0;
    }

    template() {
      return html`
        <ul>
          ${this.products.value.map(product => html`
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
      this.cartItems = this.subscribe(cartStore, 'cartItems');
      this.cartValue = this.computed(() => {
        return this.cartItems.value.reduce((acc, item) => acc + item.price, 0);
      });
    }

    removeFromCart(product) {
      this.dispatch('remove', product);
    }

    template() {
      return html`
        <p>Cart value: ${this.cartValue.value}</p>
        <ul>
          ${this.cartItems.value.map(item => html`
            <li>${item.name} - ${item.price}</li><button @click=${() => this.removeFromCart(item)}>Remove</button>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('cart-component', CartElement);
</script>
```

```html
./examples/_counter.html
<article>
  <h1>Counter</h1>
  <counter-component count="5"></counter-component>
</article>
<script type="module">
  import { createStore, html, ReactiveElement } from './build/cami.module.js';
  class CounterElement extends ReactiveElement {
    constructor() {
      super();
      this.count = this.observable(0);
      this.countSquared = this.computed(() => this.count.value * this.count.value);
      this.effect(() => console.log(`Count: ${this.count.value} & Count Squared: ${this.countSquared.value}`));
    }

    increment() {
      this.count.update(value => value + 1);
    }

    decrement() {
      this.count.update(value => value - 1);
    }

    template() {
      return html`
        <button @click=${() => this.decrement()}>-</button>
        <span>Base: ${this.count.value}</span>
        <span>Squared: ${this.countSquared.value}</span>
        <button @click=${() => this.increment()}>+</button>
      `;
    }
  }

  customElements.define('counter-component', CounterElement);
</script>

```

```html
./examples/_formval.html
<article>
  <h1>Form Validation</h1>
  <form-component></form-component>
</article>
<script type="module">
  import { html, ReactiveElement } from './build/cami.module.js';

  class FormElement extends ReactiveElement {
    constructor() {
      super();
      this.email = this.observable('');
      this.password = this.observable('');
      this.emailError = this.observable('');
      this.passwordError = this.observable('');
    }

    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email.value)) {
        this.emailError.update(() => 'Please enter a valid email address.');
      } else {
        this.emailError.update(() => '');
      }
    }

    validatePassword() {
      if (this.password.value.length < 8) {
        this.passwordError.update(() => 'Password must be at least 8 characters long.');
      } else {
        this.passwordError.update(() => '');
      }
    }

    template() {
      return html`
        <form action="/submit" method="POST">
          <label>
            Email:
            <input type="email" @input=${(e) => { this.email.update(() => e.target.value); this.validateEmail(); }} value=${this.email.value}>
            <span>${this.emailError.value}</span>
          </label>
          <label>
            Password:
            <input type="password" @input=${(e) => { this.password.update(() => e.target.value); this.validatePassword(); }} value=${this.password.value}>
            <span>${this.passwordError.value}</span>
          </label>
          <input type="submit" value="Submit" ?disabled=${this.emailError.value || this.passwordError.value}>
        </form>
      `;
    }
  }

  customElements.define('form-component', FormElement);
</script>
```

```html
./examples/_nested1.html
<article>
  <h1>User Form (1 Layer Nested)</h1>
  <user-form-component></user-form-component>
</article>
<script type="module">
  import { createStore, html, ReactiveElement } from './build/cami.module.js';

  class UserFormElement extends ReactiveElement {
    constructor() {
      super();
      this.user = this.observable({ name: 'Kenn', age: 34 });
    }

    handleInput(event, key) {
      this.user.update(value => {
        value[key] = event.target.value;
      });
    }

    template() {
      return html`
        <form>
          <label>
            Name: ${this.user.value.name}
            <input type="text" .value=${this.user.value.name} @input=${(e) => this.handleInput(e, 'name')} />
          </label>
          <label>
            Age: ${this.user.value.age}
            <input type="number" .value=${this.user.value.age} @input=${(e) => this.handleInput(e, 'age')} />
          </label>
        </form>
      `;
    }
  }

  customElements.define('user-form-component', UserFormElement);
</script>
```

```html
./examples/_nested2.html
<article>
  <h1>User Update Page (Nested Observable)</h1>
  <user-list-component></user-list-component>
</article>
<script type="module">
  import { createStore, html, ReactiveElement } from './build/cami.module.js';
class NestedObservableElement extends ReactiveElement {
    constructor() {
      super();
      this.user = this.observable({
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
      this.user.update(value => {
        if (value.name == 'John') {
          value.name = 'Jane';
          value.age = 31;
          value.address.street = '456 Elm St';
          value.address.city = 'Othertown';
          value.address.country = 'Canada';
          value.address.postalCode = '67890';
          value.address.coordinates.lat = '51.5074';
          value.address.coordinates.long = '0.1278';
        } else {
          value.name = 'John';
          value.age = 30;
          value.address.street = '123 Main St';
          value.address.city = 'Anytown';
          value.address.country = 'USA';
          value.address.postalCode = '12345';
          value.address.coordinates.lat = '40.7128';
          value.address.coordinates.long = '74.0060';
        }
      });
    }

    changeName() {
      this.user.update(value => {
        if (value.name == 'John') value.name = 'Jane';
        else value.name = 'John';
      });
    }

    changeStreet() {
      this.user.update(value => {
        if (value.address.street == '123 Main St') value.address.street = '456 Elm St';
        else value.address.street = '123 Main St';
      });
    }

    changeLat() {
      this.user.update(value => {
        if (value.address.coordinates.lat == '40.7128') value.address.coordinates.lat = '51.5074';
        else value.address.coordinates.lat = '40.7128';
      });
    }

    template() {
      return html`
        <div>Name: ${this.user.value.name}</div>
        <div>Street: ${this.user.value.address.street}</div>
        <div>Latitude: ${this.user.value.address.coordinates.lat}</div>
        <button @click=${() => this.changeUser()}>Change User</button>
        <button @click=${() => this.changeName()}>Change Name</button>
        <button @click=${() => this.changeStreet()}>Change Street</button>
        <button @click=${() => this.changeLat()}>Change Latitude</button>
      `;
    }
  }

  customElements.define('nested-observable-element', NestedObservableElement);
</script>
```

```html
./examples/_nested3.html
<article>
  <h1>User Update Page (Nested Store)</h1>
  <user-list-component></user-list-component>
</article>
<script type="module">
  import { createStore, html, ReactiveElement } from './build/cami.module.js';
  // Step 1: Define the initial state of our store
  const userStore = createStore({
    users: [
      {
        id: 1,
        name: "Alice",
        status: "Active",
        address: {
          street: '123 Main St',
          city: 'Anytown',
          coordinates: {
            lat: '40.7128',
            long: '74.0060'
          }
        }
      },
      {
        id: 2,
        name: "Bob",
        status: "Inactive",
        address: {
          street: '456 Elm St',
          city: 'Othertown',
          coordinates: {
            lat: '51.5074',
            long: '0.1278'
          }
        }
      },
    ],
  });

  // Step 2: Register a reducer for updating a user's status
  userStore.register('updateStatus', (store, payload) => {
    const user = store.users.find(user => user.id === payload.id);
    if (user) {
      user.status = payload.status;
    }
  });
  userStore.register('updateStreet', (store, payload) => {
    const user = store.users.find(user => user.id === payload.id);
    if (user) {
      user.address.street = payload.street;
    }
  });
  userStore.register('updateLat', (store, payload) => {
    const user = store.users.find(user => user.id === payload.id);
    if (user) {
      user.address.coordinates.lat = payload.lat;
    }
  });

  // Step 3: Define a custom element that uses the store
  class UserListElement extends ReactiveElement {
    constructor() {
      super();
      this.users = this.subscribe(userStore, 'users');
    }

    template() {
      return html`
        <ul>
          ${this.users.value.map(user => html`
            <li>
              ${user.name} - ${user.status}<br />
              ${user.address.street} - ${user.address.coordinates.lat}
              <button @click=${() => this.dispatch("updateStatus", { id: user.id, status: "Active" })}>Activate</button>
              <button @click=${() => this.dispatch("updateStatus", { id: user.id, status: "Inactive" })}>Deactivate</button>
              <button @click=${() => this.dispatch("updateStreet", { id: user.id, street: "999 Main St" })}>Change Street</button>
              <button @click=${() => this.dispatch("updateLat", { id: user.id, lat: "99.9999" })}>Change Latitude</button>
            </li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('user-list-component', UserListElement);
</script>
```

```html
./examples/_todo.html
<article>
  <h1>Todo List</h1>
  <todo-list-component></todo-list-component>
</article>
<script type="module">
  import { createStore, html, ReactiveElement } from './build/cami.module.js';
  // Step 1: Define the initial state of our store
  const todoStore = createStore({
    todos: [],
  });

  // Step 2: Register reducers for adding and removing todo items
  todoStore.register('add', (store, payload) => {
    store.todos.push(payload);
  });

  todoStore.register('delete', (store, payload) => {
    store.todos = store.todos.filter(todo => todo !== payload);
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
      this.todos = this.subscribe(todoStore, 'todos');
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
          ${this.todos.value.map(todo => html`
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
```


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
- [ ] Middleware usage Example
- [ ] Real-time Updates Example
- [ ] Own devtools

