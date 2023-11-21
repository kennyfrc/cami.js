# 🏝️ Cami.js

⚠️ Expect API changes until v1.0.0 ⚠️

Current version: 0.2.0. Follows [semver](https://semver.org/).

Bundle Size: 11kb minified & gzipped.

A minimalist & flexible toolkit for interactive islands & state management in hypermedia-driven web applications.

## Table of Contents

- [Motivation](#motivation)
- [Key Features](#key-features)
- [Who is this for?](#who-is-this-for)
- [Philosophy](#philosophy)
- [Get Started](#get-started--view-examples)
- [Key Concepts / API](#key-concepts--api)
  - [ReactiveElement Class, Observable Objects, and HTML Tagged Templates](#reactiveelement-class-observable-objects-and-html-tagged-templates)
  - [Basics of Observables & Templates](#basics-of-observables--templates)
  - [Basics of Computed Properties & Effects](#basics-of-computed-properties--effects)
  - [cami.store(initialState)](#camistoreinitialstate)
  - [html](#html)
- [Examples](#examples)
- [Dev Usage](#dev-usage)

## Motivation

I wanted a minimalist javascript library that has no build steps, great debuggability, and didn't take over my front-end.

My workflow is simple: I want to start any application with normal HTML/CSS, and if there were fragments or islands that needed to be interactive (such as dashboards & calculators), I needed a powerful enough library that I could easily drop in without rewriting my whole front-end. Unfortunately, the latter is the case for the majority of javascript libraries out there.

That said, I like the idea of declarative templates, uni-directional data flow, time-travel debugging, and fine-grained reactivity. But I wanted no build steps (or at least make 'no build' the default). So I created Cami.

## Key Features:

- Reactive Web Components: We suggest to start any web application with normal HTML/CSS, then add interactive islands with Cami's reactive web components. Uses fine-grained reactivity with observables, computed properties, and effects. Also supports for deeply nested updates. Uses the Light DOM instead of Shadow DOM.
- Tagged Templates: Declarative templates with lit-html. Supports event handling, attribute binding, composability, caching, and expressions.
- Store / State Management: When you have multiple islands, you can use a singleton store to share state between them, and it acts as a single source of truth for your application state. Redux DevTools compatible.
- Easy Immutable Updates: Uses Immer under the hood, so you can update your state immutably without excessive boilerplate.
- Anti-Features: You can't be everything to everybody. So we made some hard choices: No Build Steps, No Client-Side Router, No JSX, No Shadow DOM. We want you to build an MPA, with mainly HTML/CSS, and return HTML responses instead of JSON. Then add interactivity as needed.

## Who is this for?

- **Lean Teams or Solo Devs**: If you're building a small to medium-sized application, I built Cami with that in mind. You can start with `ReactiveElement`, and once you need to share state between components, you can add our store. It's a great choice for rich data tables, dashboards, calculators, and other interactive islands. If you're working with large applications with large teams, you may want to consider other frameworks.
- **Developers of Multi-Page Applications**: For folks who have an existing server-rendered application, you can use Cami to add interactivity to your application, along with other MPA-oriented libraries like HTMX, Unpoly, Turbo, or TwinSpark.

## Philosophy

- **Less Code is Better**: In any organization, large or small, team shifts are inevitable. It's important that the codebase is easy to understand and maintain. This allows any enterprising developer to jump in, and expand the codebase that fits their specific problems.

## Get Started & View Examples

To see some examples, just do the following:

```bash
git clone git@github.com:kennyfrc/cami.js.git
cd cami.js
bun install --global serve
bunx serve
```

Open http://localhost:3000 in your browser, then navigate to the examples folder. In the examples folder, you will find a series of examples that illustrate the key concepts of Cami.js. These examples are numbered & ordered by complexity.

## Key Concepts / API

### `ReactiveElement Class`, `Observable` Objects, and `HTML Tagged Templates`

`ReactiveElement` is a class that extends `HTMLElement` to create reactive web components. These components can automatically update their view (the `template`) when their state changes.

Automatic updates are done by observables. An observable is an object that can be observed for state changes, and when it changes, it triggers an effect (a function that runs in response to changes in observables).

Cami's observables have the following characteristics:

* They can be accessed and mutated like any other data structure. The difference is that observables, upon mutation, notify observers.
* The observer in the `ReactiveElement` case is the `html tagged template` or the `template()` method to be specific.

When you mutate the value of an observable, it will automatically trigger a re-render of the component's `html tagged template`. This is what makes the component reactive.

Let's illustrate these three concepts with an example. Here's a simple counter component:

```html
<article>
  <h1>Counter</h1>
  <counter-component
  ></counter-component>
</article>
<!-- <script src="./build/cami.cdn.js"></script> -->
<!-- CDN version below -->
<script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script>
<script type="module">
  const { html, ReactiveElement } = cami;
  class CounterElement extends ReactiveElement {
    count = 0

    constructor() {
      super();
      this.setup({
        observables: ['count'],
      })
    }

    template() {
      return html`
        <button @click=${() => this.count--}>-</button>
        <button @click=${() => this.count++}>+</button>
        <div>Count: ${this.count}</div>
      `;
    }
  }

  customElements.define('counter-component', CounterElement);
</script>
```

In this example, `CounterElement` is a reactive web component that maintains an internal state (`count`) and updates its view whenever the state changes.

### Basics of Observables & Templates

**Creating an Observable:**

In the context of a `ReactiveElement`, you can create an observable using the `this.setup()` method. For example, to create an observable `count` with an initial value of `0`, you would do:

```javascript
// ...
count = 0

constructor() {
  super();
  this.setup({
    observables: ['count'],
  })
}
// ...
```

**Getting the Value:**

You can get the current value of an observable by directly accessing it. For example, you can get the value of `count` like this:

```javascript
this.count;
```

**Setting the Value:**

To update the value of an observable, you can just directly mutate it, and it will automatically trigger a re-render of the component's template. For example, to increment the count, you can do:

```javascript
this.count++
```

**Deeply Nested Updates and Array Manipulation:**

Cami's observables support deeply nested updates. This means that if your observable's value is an object, you can update deeply nested properties within that object. Additionally, if the observable's value is an array, you can perform various array manipulations such as push, pop, shift, unshift, splice, sort, reverse, and more. These operations will trigger a re-render of the component's template. Here are some examples:

```javascript
// Updating deeply nested properties
// ...
user = {
  name: {
    first: 'John',
    last: 'Doe',
  },
  age: 30,
}

constructor() {
  super();
  this.setup({
    observables: ['user'],
  })
}

user.update(value => {
  value.name.first = 'Jane';
});
// ...
```

```javascript
// Array manipulations
// ...

playlist = ['Song 1', 'Song 2', 'Song 3'];

constructor() {
  super();
  this.setup({
    observables: ['playlist'],
  })
}

// Adding a song to the playlist
playlist.push('Song 4');

// Removing the first song from the playlist
playlist.shift();

// Reversing the order of the playlist
playlist.reverse();
// ...
```

In the first example, only the `first` property of the `name` object is updated. The rest of the `user` object remains the same. In the second example, various array manipulations are performed on the `playlist` observable.

**Template Rendering:**

Cami.js uses lit-html for its template rendering. This allows you to write HTML templates in JavaScript using tagged template literals. Think of it as fancy string interpolation.

Here's the example from above:

```javascript
  template() {
    return html`
      <button @click=${this.count++}>Increment</button>
      <p>Count: ${this.count}</p>
    `;
  }
```

In this example, `html` is a function that gets called with the template literal. It processes the template literal and creates a template instance that can be efficiently updated and rendered.

The `${}` syntax inside the template literal is used to embed JavaScript expressions. These expressions can be variables, properties, or even functions. In the example above, `${this.count}` will be replaced with the current value of the `count` observable, and `${this.count++}` is a function that increments the count when the button is clicked.

The `@click` syntax is used to attach event listeners to elements. In this case, a click event listener is attached to the button element.

### Basics of Computed Properties, Effects, Observable Attributes, and Queries

**Computed Properties:**

Computed properties are a powerful feature in Cami.js that allow you to create properties that are derived from other observables. These properties automatically update whenever their dependencies change. This is particularly useful for calculations that depend on one or more parts of the state.

Here is an example of a computed property `countSquared` which is defined as the square of the `count` observable:

```javascript
count = 0

constructor() {
  super();
  this.setup({
    observables: ['count'],
    computed: ['countSquared'],
  })
}

get countSquared() {
  return this.count ** 2;
}
```

In this case, `countSquared` will always hold the square of the current count value, and will automatically update whenever `count` changes.

**Effects:**

Effects in Cami.js are functions that run in response to changes in observable properties. They are a great way to handle side effects in your application, such as integrating with non-reactive components, emitting custom events, or logging/debugging.

Here is an example of an effect that logs the current count and its square whenever either of them changes:

```javascript
this.effect(() => console.log(`Count: ${this.count} & Count Squared: ${this.countSquared}`));
```

This effect will run whenever `count` or `countSquared` changes, logging the new values to the console.

**Observable Attributes:**

Observable attributes in Cami.js are attributes that are observed for changes. When an attribute changes, the component's state is updated and the component is re-rendered.

Here is an example of an observable attribute `todos` which is parsed from a JSON string:

```javascript
todos = []

constructor() {
  super();
  this.setup({
    observables: ['todos'],
    attributes: {
      todos: (v) => JSON.parse(v).data
    }
  });
}
```

In this case, `todos` will be updated whenever the `todos` attribute of the element changes.

**Queries:**

Queries in Cami.js are a way to fetch data asynchronously and update the component's state when the data is available. The state is automatically updated with the loading status, the data, and any error that might occur.

Here is an example of a query that fetches posts from a JSON placeholder API:

```javascript
posts = {}

constructor() {
  super();
  this.setup({
    observables: ['posts'],
  });
}

connectedCallback() {
  super.connectedCallback();
  this.posts = this.query({
    queryKey: ["posts"],
    queryFn: () => fetch("https://jsonplaceholder.typicode.com/posts").then(posts => posts.json())
  });
}
```

In this case, `posts` will be updated with the loading status, the fetched data, and any error that might occur.


### `cami.store(initialState)`

The `cami.store` function is a core part of Cami.js. It creates a new store with the provided initial state. The store is a singleton, meaning that if it has already been created, the existing instance will be returned. This store is a central place where all the state of your application lives. It's like a data warehouse where different components of your application can communicate and share data.

This concept is particularly useful in scenarios where multiple components need to share and manipulate the same state. A classic example of this is a shopping cart in an e-commerce application, where various components like product listing, cart summary, and checkout need access to the same cart state.

The store follows a flavor of the Flux architecture, which promotes unidirectional data flow. The cycle goes as follows: call a function -> update the store -> reflect changes in the view -> call another function. In addition, as we adhere to many of Redux's principles, our store is compatible with the Redux DevTools Chrome extension, which allows for time-travel debugging.

**Parameters:**

- `initialState` (Object): The initial state of the store. This is the starting point of your application state and can be any valid JavaScript object.

**Example:**

```javascript
const CartStore = cami.store({
  cartItems: [],
  products: [
    { id: 1, name: 'Product 1', price: 100, disabled: false, stock: 10 },
    { id: 2, name: 'Product 2', price: 200, disabled: false, stock: 5 },
    { id: 3, name: 'Product 3', price: 300, disabled: false, stock: 2 },
  ],
  add: (store, product) => {
    const cartItem = { ...product, cartItemId: Date.now() };
    store.cartItems.push(cartItem);
    store.products = store.products.map(p => {
      if (p.id === product.id) {
        p.stock--;
      }
      return p;
    });
  },
  remove: (store, product) => {
    store.cartItems = store.cartItems.filter(item => item.cartItemId !== product.cartItemId);
    store.products = store.products.map(p => {
      if (p.id === product.id) {
        p.stock++;
      }
      return p;
    });
  }
});

class CartElement extends ReactiveElement {
  cartItems = this.connect(CartStore, 'cartItems');

  constructor() {
    super();
    this.setup({
      observables: ['cartItems'],
      computed: ['cartValue'],
    })
  }

  get cartValue() {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  removeFromCart(product) {
    CartStore.remove(product);
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
```

In this example, `CartStore` is a store that holds the state of a shopping cart. It has two methods, `add` and `remove`, which can be used to add and remove items from the cart. The `CartElement` is a custom element that connects to the `CartStore` and updates its view whenever the `cartItems` state changes. It also provides a method `removeFromCart` that removes an item from the cart when a button is clicked.

### `html`

The `html` function in Cami.js is a tagged template literal, based on lit-html, that allows for the creation of declarative templates. It provides several powerful features that make it effective in the context of Cami.js:

1. **Event Handling**: It supports event handling with directives like `@click`, which can be used to bind DOM events to methods in your components. For example:
```javascript
html`<button @click=${this.increment}>Increment</button>`
```
In this example, the `increment` method is called when the button is clicked.

2. **Attribute Binding**: It allows for attribute binding, which means you can dynamically set the attributes of your HTML elements based on your component's state. For example:
```javascript
html`<div class=${this.isActive ? 'active' : 'inactive'}></div>`
```
In this example, the class of the div is dynamically set based on the `isActive` property of the component.

3. **Caching**: It caches templates, which means that if you render the same template multiple times, it will only update the parts of the DOM that have changed. This makes rendering more efficient.


4. **Expressions**: It allows for the use of JavaScript expressions inside your templates, which means you can include complex logic in your templates. For example:
```javascript
html`<div>${this.items.length > 0 ? this.renderItems() : 'No items'}</div>`
```
In this example, the template conditionally renders a list of items or a message saying 'No items' based on the length of the `items` array.

For more detailed information, refer to the lit-html documentation: [docs](https://lit.dev/docs/templates/overview/)

## Examples

To see some examples, just do the following:

```bash
git clone git@github.com:kennyfrc/cami.js.git
cd cami.js
bun install --global serve
bunx serve
```

Open http://localhost:3000 in your browser, then navigate to the examples folder. In the examples folder, you will find a series of examples that illustrate the key concepts of Cami.js. These examples are numbered & ordered by complexity.

They are also listed below:

```html
<!-- ./examples/_001_counter.html -->
<article>
  <h1>Counter</h1>
  <counter-component
  ></counter-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class CounterElement extends ReactiveElement {
    count = 0

    constructor() {
      super();
      this.setup({
        observables: ['count']
      })
    }

    template() {
      return html`
        <button @click=${() => this.count--}>-</button>
        <button @click=${() => this.count++}>+</button>
        <div>Count: ${this.count}</div>
      `;
    }
  }

  customElements.define('counter-component', CounterElement);
</script>

```

```html
<!-- ./examples/_002_formval.html -->
<article>
  <h1>Form Validation</h1>
  <form-component></form-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class FormElement extends ReactiveElement {
    email = '';
    password = '';
    emailError = '';
    passwordError = '';

    constructor() {
      super();
      this.setup({
        observables: ['email', 'password', 'emailError', 'passwordError']
      })
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
```

```html
<!-- ./examples/_003_todo.html -->
<article>
  <h1>Todo List</h1>
  <todo-list-component></todo-list-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  // Step 1: Define the initial state of our store and the actions
  const TodoStore = cami.store({
    todos: [],
    add: (store, todo) => {
      store.todos.push(todo);
    },
    delete: (store, todo) => {
      const index = store.todos.indexOf(todo);
      if (index > -1) {
        store.todos.splice(index, 1);
      }
    }
  });

  // Define a middleware function
  const loggerMiddleware = (context) => {
    console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
  };

  // Use the middleware function with the initialState
  TodoStore.use(loggerMiddleware);

  class TodoListElement extends ReactiveElement {
    todos = this.connect(TodoStore, 'todos');

    constructor() {
      super();
      this.setup({
        observables: ['todos']
      })
    }

    template() {
      return html`
        <input id="newTodo" type="text" />
        <button @click=${() => {
          const newTodo = document.getElementById('newTodo').value;
          TodoStore.add(newTodo);
          document.getElementById('newTodo').value = '';
        }}>Add</button>
        <ul>
          ${this.todos.map(todo => html`
            <li>
              ${todo}
              <button @click=${() => TodoStore.delete(todo)}>Delete</button>
            </li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('todo-list-component', TodoListElement);
</script>
```

```html
<!-- ./examples/_004_cart.html -->
  <article>
  <h2>Products</h2>
  <product-list-component></product-list-component>
</article>
<article>
  <h2>Cart</h2>
  <cart-component></cart-component>
</article>

<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  const CartStore = cami.store({
    cartItems: [],
    products: [
      { id: 1, name: 'Product 1', price: 100, disabled: false, stock: 10 },
      { id: 2, name: 'Product 2', price: 200, disabled: false, stock: 5 },
      { id: 3, name: 'Product 3', price: 300, disabled: false, stock: 2 },
    ],
    add: (store, product) => {
      const cartItem = { ...product, cartItemId: Date.now() };
      store.cartItems.push(cartItem);
      store.products = store.products.map(p => {
        if (p.id === product.id) {
          p.stock--;
        }
        return p;
      });
    },
    remove: (store, product) => {
      store.cartItems = store.cartItems.filter(item => item.cartItemId !== product.cartItemId);
      store.products = store.products.map(p => {
        if (p.id === product.id) {
          p.stock++;
        }
        return p;
      });
    }
  });


  // Define a middleware function
  const loggerMiddleware = (context) => {
    console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
  };

  // Use the middleware function with the initialState
  CartStore.use(loggerMiddleware);

  class ProductListElement extends ReactiveElement {
    cartItems = this.connect(CartStore, 'cartItems');
    products = this.connect(CartStore, 'products');

    constructor() {
      super();
    }

    addToCart(product) {
      CartStore.add(product);
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
    cartItems = this.connect(CartStore, 'cartItems');

    constructor() {
      super();
    }

    get cartValue() {
      return this.cartItems.reduce((acc, item) => acc + item.price, 0);
    }

    removeFromCart(product) {
      CartStore.remove(product);
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
```

```html
<!-- ./examples/_005_nested1.html -->
<article>
  <h1>Label Updates from Input Forms (Nested Observable)</h1>
  <simple-input-component></simple-input-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class UserFormElement extends ReactiveElement {
    user = { name: 'Kenn', age: 34, email: 'kenn@example.com' };

    constructor() {
      super();
      this.initialUser = { name: 'Kenn', age: 34, email: 'kenn@example.com' };
      this.setup({
        observables: ['user']
      });
      this.user.assign(this.initialUser);
    }

    handleInput(event, key) {
      this.user.assign({ [key]: event.target.value });
    }

    resetForm() {
      this.user = this.initialUser;
    }

    template() {
      return html`
        <form>
          <label>
            Name: ${this.user.name}
            <input type="text" .value=${this.user.name} @input=${(e) => this.handleInput(e, 'name')} />
          </label>
          <label>
            Age: ${this.user.age}
            <input type="number" .value=${this.user.age} @input=${(e) => this.handleInput(e, 'age')} />
          </label>
          <label>
            Email: ${this.user.email}
            <input type="email" .value=${this.user.email} @input=${(e) => this.handleInput(e, 'email')} />
          </label>
          <button type="button" @click=${this.resetForm.bind(this)}>Reset</button>
        </form>
      `;
    }
  }

  customElements.define('simple-input-component', UserFormElement);
</script>
```

```html
<!-- ./examples/_006_nested2.html -->
  <article>
  <h1>User Update Page (Nested Observable)</h1>
  <nested-observable-element></nested-observable-element>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class NestedObservableElement extends ReactiveElement {
    user = {
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
    };

    constructor() {
      super();
      this.setup({
        observables: ['user']
      });
    }

    changeUser() {
      const john = {
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
      };

      const jane = {
        name: 'Jane',
        age: 31,
        address: {
          street: '456 Elm St',
          city: 'Othertown',
          country: 'Canada',
          postalCode: '67890',
          coordinates: {
            lat: '51.5074',
            long: '0.1278'
          }
        }
      };

      this.user = (this.user.name == 'John') ? jane : john;
    }

    changeName() {
      this.user.update(user => {
        user.name = (user.name == 'John') ? 'Jane' : 'John';
      });
    }

    changeStreet() {
      this.user.update(user => {
        user.address.street = (user.address.street == '123 Main St') ? '456 Elm St' : '123 Main St';
      });
    }

    changeLat() {
      this.user.update(user => {
        user.address.coordinates.lat = (user.address.coordinates.lat == '40.7128') ? '51.5074' : '40.7128';
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
```

```html
<!-- ./examples/_007_nested3.html -->
<article>
  <h1>User Update Page (Nested Store)</h1>
  <user-list-component></user-list-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  // Step 1: Define the initial state of our store
  const userStore = cami.store({
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
    updateStatus: (store, payload) => {
      const user = store.users.find(user => user.id === payload.id);
      if (user) {
        user.status = payload.status;
      }
    },
    updateStreet: (store, payload) => {
      const user = store.users.find(user => user.id === payload.id);
      if (user) {
        user.address.street = payload.street;
      }
    },
    updateLat: (store, payload) => {
      const user = store.users.find(user => user.id === payload.id);
      if (user) {
        user.address.coordinates.lat = payload.lat;
      }
    },
  });

  // Step 3: Define a custom element that uses the store
  class UserListElement extends ReactiveElement {
    users = this.connect(userStore, 'users');

    constructor() {
      super();
    }

    template() {
      return html`
        <ul>
          ${this.users.map(user => html`
            <li>
              ${user.name} - ${user.status}<br />
              ${user.address.street} - ${user.address.coordinates.lat}
              <button @click=${() => userStore.updateStatus({ id: user.id, status: "Active" })}>Activate</button>
              <button @click=${() => userStore.updateStatus({ id: user.id, status: "Inactive" })}>Deactivate</button>
              <button @click=${() => userStore.updateStreet({ id: user.id, street: "999 Main St" })}>Change Street</button>
              <button @click=${() => userStore.updateLat({ id: user.id, lat: "99.9999" })}>Change Latitude</button>
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
<!-- ./examples/_008_nested4.html -->
<article>
  <h1>Team Management</h1>
  <team-management-component></team-management-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class TeamManagementElement extends ReactiveElement {
    teams = [
      { id: 1, name: "Team Alpha", members: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]},
      { id: 2, name: "Team Beta", members: [{ id: 3, name: "Charlie" }, { id: 4, name: "Dave" }]}
    ];
    editing = { isEditing: false, memberId: null };

    constructor() {
      super();
      this.setup({
        observables: ['teams', 'editing'],
      });
    }

    updateTeam(teamId, updateFunc) {
      this.teams.update(teams => {
        const team = teams.find(team => team.id === teamId);
        if (team) updateFunc(team);
      });
    }

    addMember(teamId, name) {
      this.updateTeam(teamId, team => team.members.push({ id: Date.now(), name }));
    }

    removeMember(teamId, memberId) {
      this.updateTeam(teamId, team => team.members = team.members.filter(member => member.id !== memberId));
    }

    editMember(teamId, memberId, newName) {
      this.updateTeam(teamId, team => {
        const member = team.members.find(member => member.id === memberId);
        if (member) member.name = newName;
      });
      this.editing.update(() => ({ isEditing: false, memberId: null }));
    }

    startEditing(memberId) {
      this.editing.update(() => ({ isEditing: true, memberId }));
    }

    template() {
      return html`
        <ul>
          ${this.teams.map(team => html`
            <li>
              ${team.name}
              <ul>
                ${team.members.map(member => html`
                  <li>
                    ${this.editing.isEditing && this.editing.memberId === member.id ? html`
                      <input id="editMemberName${member.id}" type="text" value="${member.name}">
                      <button @click=${() => { this.editMember(team.id, member.id, document.getElementById('editMemberName' + member.id).value); }}>Save</button>
                    ` : html`
                      <span>${member.name}</span>
                      <a @click=${() => this.startEditing(member.id)}>Edit</a>
                      <a @click=${() => this.removeMember(team.id, member.id)}>Remove</a>
                    `}
                  </li>
                `)}
              </ul>
              <input id="newMemberName${team.id}" type="text" placeholder="New member name">
              <button @click=${() => {
                this.addMember(team.id, document.getElementById('newMemberName' + team.id).value);
                document.getElementById('newMemberName' + team.id).value = '';
              }}>Add Member</button>
            </li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('team-management-component', TeamManagementElement);
</script>
```

```html
<!-- ./examples/_009_dataFromProps.html -->
<article>
<my-component
    todos='{"data": ["Buy milk", "Buy eggs", "Buy bread"]}'
  ></my-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class MyComponent extends ReactiveElement {
    todos = []

    constructor() {
      super();
      this.setup({
        observables: ['todos'],
        attributes: {
          todos: (v) => JSON.parse(v).data
        }
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
        <input id="newTodo" type="text" />
        <button @click=${() => {
          this.addTodo(document.getElementById('newTodo').value); document.getElementById('newTodo').value = ''; }}
        >Add</button>
        <ul>
          ${this.todos.map(todo => html`
            <li>
              ${todo}
              <button @click=${() => this.deleteTodo(todo)
              }>Delete</button>
            </li>
          `)}
        </ul>
      `;
    }

  }

  customElements.define('my-component', MyComponent);

</script>
```

```html
<!-- ./examples/_010_taskmgmt.html -->
<article>
  <h1>Task Manager</h1>
  <task-manager-component></task-manager-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class TaskManagerElement extends ReactiveElement {
    tasks = [];
    filter = 'all';

    constructor() {
      super();
      this.setup({
        observables: ['tasks', 'filter'],
      });
    }

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
    }

    setFilter(filter) {
      this.filter = filter;
    }

    getFilteredTasks() {
      switch (this.filter) {
        case 'completed':
          return this.tasks.filter(task => task.completed);
        case 'active':
          return this.tasks.filter(task => !task.completed);
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
        <button @click=${() => this.setFilter('active')}>Active</button>
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

  customElements.define('task-manager-component', TaskManagerElement);
</script>
```

```html
<!-- ./examples/_011_playlist.html -->
<article>
  <h1>Playlist Manager</h1>
  <playlist-component></playlist-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class PlaylistElement extends ReactiveElement {
    playlist = [];

    constructor() {
      super();
      this.setup({
        observables: ['playlist'],
      })
    }

    addSong(song) {
      this.playlist.push(song);
    }

    removeSong(index) {
      this.playlist.splice(index, 1);
    }

    moveSongUp(index) {
      if (index > 0) {
        const songToMoveUp = this.playlist[index];
        const songAbove = this.playlist[index - 1];
        this.playlist.splice(index - 1, 2, songToMoveUp, songAbove);
      }
    }

    moveSongDown(index) {
      if (index < this.playlist.length - 1) {
        const songToMoveDown = this.playlist[index];
        const songBelow = this.playlist[index + 1];
        this.playlist.splice(index, 2, songBelow, songToMoveDown);
      }
    }

    sortSongs() {
      this.playlist.sort();
    }

    reverseSongs() {
      this.playlist.reverse();
    }

    template() {
      return html`
        <input id="songInput" type="text" placeholder="Enter song name">
        <button @click=${() => this.addSong(document.getElementById('songInput').value)}>Add Song</button>
        <button @click=${() => this.sortSongs()}>Sort Songs</button>
        <button @click=${() => this.reverseSongs()}>Reverse Songs</button>
        <ul>
          ${this.playlist.map((song, index) => html`
            <li>
              ${song}
              <a @click=${() => this.moveSongUp(index)}>Move Up</a>
              <a @click=${() => this.moveSongDown(index)}>Move Down</a>
              <a @click=${() => this.removeSong(index)}>Remove</a>
            </li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('playlist-component', PlaylistElement);
</script>
```

```html
<!-- ./examples/_012_blog.html -->
<article>
  <h1>Blog</h1>
  <blog-component></blog-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class BlogComponent extends ReactiveElement {
    posts = {}

    constructor() {
      super();
      this.setup({
        observables: ['posts'],
      });
    }

    connectedCallback() {
      super.connectedCallback();
      this.posts = this.query({
        queryKey: ["posts"],
        queryFn: () => fetch("https://jsonplaceholder.typicode.com/posts").then(posts => posts.json())
      });
    }

    template() {
      if (this.posts.isLoading) {
        return html`<div>Loading...</div>`;
      }

      if (this.posts.error) {
        return html`<div>Error: ${this.posts.error.message}</div>`;
      }

      if (this.posts.data) {
        return html`
          <ul>
            ${this.posts.data.map(post => html`
              <li>
                <h2>${post.title}</h2>
                <p>${post.body}</p>
              </li>
            `)}
          </ul>
        `;
      }
    }
  }

  customElements.define('blog-component', BlogComponent);
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
- Zustand
- MobX
- lit-html

## Why "Cami"?

It's short for [Camiguin](https://www.google.com/search?q=camiguin&sca_esv=576910264&tbm=isch&source=lnms&sa=X&sqi=2&ved=2ahUKEwjM_6rOp5SCAxV-9zgGHSW6CjYQ_AUoAnoECAMQBA&biw=1920&bih=944&dpr=1), a pretty nice island.


## Roadmap

- [ ] Add Tests
- [ ] Middleware usage Example
- [ ] Real-time Updates Example
- [ ] Own devtools

