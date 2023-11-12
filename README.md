# 🏝️ Cami.js

⚠️ Expect API changes until v1.0.0 ⚠️

Current version: 0.0.16. Follows [semver](https://semver.org/).

Bundle Size: 9kb minified & gzipped.

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
- **Developers of Multi-Page Applications**: For folks who have an existing server-rendered application, you can use Cami to add interactivactivity to your application, along with other MPA-oriented libraries like HTMX, Unpoly, Turbo, or TwinSpark.

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

* It has a `value` property that holds the current value of the observable.
* It has an `update` method that allows you to update the value of the observable.

When you update the value of an observable, it will automatically trigger a re-render of the component's `html tagged template`. This is what makes the component reactive.

Let's illustrate these three concepts with an example. Here's a simple counter component:

```html
<counter-element></counter-element>
<script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script>
<script type="module">
 const { html, ReactiveElement } = cami;

class CounterElement extends ReactiveElement {
  constructor() {
    super();
    this.count = this.observable(0); // Defines an observable property 'count' with an initial value of 0
  }

  increment() {
    this.count.update(value => value + 1); // Updates the value of 'count' observable
  }

  template() {
    return html`
      <button @click=${() => this.increment()}>Increment</button>
      <p>Count: ${this.count.value}</p>  // Accesses the current value of 'count' observable
    `;
  }
}

customElements.define('counter-element', CounterElement);
</script>
```

In this example, `CounterElement` is a reactive web component that maintains an internal state (`count`) and updates its view whenever the state changes.

### Basics of Observables & Templates

**Creating an Observable:**

In the context of a `ReactiveElement`, you can create an observable using the `this.observable()` method. For example, to create an observable `count` with an initial value of `0`, you would do:

```javascript
this.count = this.observable(0);
```

**Getting the Value:**

You can get the current value of an observable by accessing its `value` property. For example, you can get the value of `count` like this:

```javascript
this.count.value;
```

**Setting the Value:**

To update the value of an observable, you use the `update` method. This method accepts a function that receives the current value and returns the new value. For example, to increment `count`, you would do:

```javascript
this.count.update(value => value + 1);
```

**Deeply Nested Updates:**

An interesting thing to note (which many libaries don't support with one method/function) is that Cami's observables support deeply nested updates. This means that if your observable's value is an object, you can update deeply nested properties within that object. Example:

```javascript
let user = this.observable({ name: { first: 'John', last: 'Doe' } });
user.update(value => {
  value.name.first = 'Jane';
});
```

Here, only the `first` property of the `name` object is updated. The rest of the `user` object remains the same.

**Template Rendering:**

Cami.js uses lit-html for its template rendering. This allows you to write HTML templates in JavaScript using tagged template literals. Think of it as fancy string interpolation.

Here's the example from above:

```javascript
  template() {
    return html`
      <button @click=${() => this.increment()}>Increment</button>
      <p>Count: ${this.count.value}</p>
    `;
  }
```

In this example, `html` is a function that gets called with the template literal. It processes the template literal and creates a template instance that can be efficiently updated and rendered.

The `${}` syntax inside the template literal is used to embed JavaScript expressions. These expressions can be variables, properties, or even functions. In the example above, `${this.count.value}` will be replaced with the current value of the `count` observable, and `${() => this.count.update(value => value + 1)}` is a function that increments the count when the button is clicked.

The `@click` syntax is used to attach event listeners to elements. In this case, a click event listener is attached to the button element.

### Basics of Computed Properties & Effects

**Computed Properties:**

Computed properties are a powerful feature in Cami.js that allow you to create properties that are derived from other observables. These properties automatically update whenever their dependencies change. This is particularly useful for calculations that depend on one or more parts of the state.

For instance, in the `CounterElement` example from `_001_counter.html`, a computed property `countSquared` is defined as the square of the `count` observable:

```javascript
this.countSquared = this.computed(() => this.count.value * this.count.value);
```

In this case, `countSquared` will always hold the square of the current count value, and will automatically update whenever `count` changes. This is ideal for calculations like this, but can also be used for other derived values such as total price in a shopping cart (based on quantities and individual prices), or a boolean flag indicating if a form is valid (based on individual field validations).

**Effects:**

Effects in Cami.js are functions that run in response to changes in observable properties. They are a great way to handle side effects in your application, such as integrating with non-reactive components, emitting custom events, or logging/debugging.

For example, in the `CounterElement` example, an effect is defined to log the current count and its square whenever either of them changes:

```javascript
this.effect(() => console.log(`Count: ${this.count.value} & Count Squared: ${this.countSquared.value}`));
```

This effect will run whenever `count` or `countSquared` changes, logging the new values to the console. This can be particularly useful for debugging.

Effects can also be used to emit custom events after specific state changes. For instance, you could emit a custom event whenever the count reaches a certain value. Here's a great essay on this topic: [Hypermedia-Friendly Scripting](https://htmx.org/essays/hypermedia-friendly-scripting/#events)

```javascript
this.effect(() => {
  if (this.count.value === 10) {
    this.dispatchEvent(new CustomEvent('count-reached-ten', { detail: this.count.value }));
  }
});
```

In this example, a 'count-reached-ten' event is dispatched whenever the count reaches 10. This can be useful for integrating with non-reactive parts of your application or for triggering specific actions in response to state changes like with

**ReactiveElement Methods:**

- `observable(initialValue)`: This method creates an observable property with an initial value. It returns an object that contains a `value` property and an `update` method.
- `observableAttr(attrName, parseFn = (v) => v)`: This method creates an observable property from an attribute. `attrName` is the attribute's name and `parseFn` is a function that parses the attribute value. If `parseFn` is not provided, it defaults to an identity function.
- `subscribe(store, key)`: This method subscribes to a store and links it to an observable property. It returns the observable.
- `computed(computeFn)`: This method defines a computed property that depends on other observables. It returns an object with a `value` getter.
- `effect(effectFn)`: This method defines an effect that is triggered when an observable changes. The `effectFn` can optionally return a cleanup function.
- `dispatch(action, payload)`: This method dispatches an action to the store.
- `template()`: This method should be implemented to return the template to be rendered.
- `connectedCallback()`: This lifecycle method is called each time the element is added to the document. It sets up the initial state and triggers the initial rendering.
- `disconnectedCallback()`: This lifecycle method is called each time the element is removed from the document. It cleans up listeners and effects.
- `react()`: This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state. This also triggers all effects.
- `setObservables(props)`: This method sets the properties of the object. If the property is an observable, it updates the observable with the new value.

Note: Lifecycle methods are part of the Light DOM. We do not implement the Shadow DOM in this library. While Shadow DOM provides style and markup encapsulation, there are drawbacks if we want this library to [interoperate with other libs](https://stackoverflow.com/questions/45917672/what-are-the-drawbacks-of-using-shadow-dom).


### `cami.store(initialState)`

The `cami.store` function is a fundamental part of Cami.js. It creates a new store with the provided initial state. The store is a singleton, meaning that if it has already been created, the existing instance will be returned. This store is a central place where all the state of your application lives. It's like a data warehouse where different components of your application can communicate and share data.

This concept is particularly useful in scenarios where multiple components need to share and manipulate the same state. A classic example of this is a shopping cart in an e-commerce application, where various components like product listing, cart summary, and checkout need access to the same cart state.

The store follows a flavor of the Flux architecture, which promotes unidirectional data flow. The cycle goes as follows: dispatch an action -> update the store -> reflect changes in the view -> dispatch another action. In addition, as we adhere to many of Redux's principles, our store is compatible with the Redux DevTools Chrome extension, which allows for time-travel debugging.

**Parameters:**

- `initialState` (Object): The initial state of the store. This is the starting point of your application state and can be any valid JavaScript object.

**Returns:**

A store object with the following methods:

- `state`: The current state of the store. It represents the current snapshot of your application state.
- `subscribe(listener)`: Adds a listener to the store. This listener is a function that gets called whenever the state changes. It also returns an unsubscribe function to stop listening to state changes.
- `register(action, reducer)`: Adds a reducer to the store. A reducer is a function that knows how to update the state based on an action.
- `dispatch(action, payload)`: Adds an action to the dispatch queue and starts processing if not already doing so. An action is a description of what happened, and the payload is the data associated with this action.
- `use(middleware)`: Adds a middleware to the store. Middleware is a way to extend the store's capabilities and handle asynchronous actions or side effects.

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

3. **Composability**: It supports composability, which means you can easily include one template inside another. For example:
```javascript
html`${this.headerTemplate()}<div>${this.contentTemplate()}</div>`
```
In this example, `headerTemplate` and `contentTemplate` are methods that return other templates, which are included in the main template.

4. **Caching**: It caches templates, which means that if you render the same template multiple times, it will only update the parts of the DOM that have changed. This makes rendering more efficient.


5. **Expressions**: It allows for the use of JavaScript expressions inside your templates, which means you can include complex logic in your templates. For example:
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
  <counter-component></counter-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
 const { html, ReactiveElement } = cami;
  class CounterElement extends ReactiveElement {
    constructor() {
      super();
      this.count = this.observable(0);
      this.countSquared = this.computed(() => this.count.value * this.count.value);
      this.effect(() => {
        console.log('count', this.count.value);
      });
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
  // Step 1: Define the initial state of our store
  const todoStore = cami.store({
    todos: [],
  });

  // Step 2: Register reducers for adding and removing todo items
  todoStore.register('add', (store, payload) => {
    store.todos.push(payload);
  });

  todoStore.register('delete', (store, payload) => {
    const index = store.todos.indexOf(payload);
    if (index > -1) {
      store.todos.splice(index, 1);
    }
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

  const cartStore = cami.store({
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
<!-- ./examples/_008_dataFromProps.html -->
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
    constructor() {
      super();
      this.todos = this.observableAttr('todos', (todos) => {
        return JSON.parse(todos).data;
      });
    }

    addTodo (todo) {
      this.todos.update(value => {
        value.push(todo);
      });
    }

    deleteTodo (todo) {
      this.todos.update(value => {
        const index = value.indexOf(todo);
        if (index > -1) {
          value.splice(index, 1);
        }
      });
    }

    template() {
      return html`
        <input id="newTodo" type="text" />
        <button @click=${() => {
          this.addTodo(document.getElementById('newTodo').value); document.getElementById('newTodo').value = ''; }}
        >Add</button>
        <ul>
          ${this.todos.value.map(todo => html`
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
<!-- ./examples/_009_batch.html -->
<article>
  <h1>Batch Updates</h1>
  <batch-update-element></batch-update-element>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class BatchUpdateElement extends ReactiveElement {
    constructor() {
      super();
      this.count = this.observable(0);
      this.doubleCount = this.computed(() => this.count.value * 2);
    }

    increment() {
      this.count.update(value => value + 1);
    }

    batchIncrement() {
      this.batch(() => {
        this.count.update(value => value + 1);
        this.count.update(value => value + 1);
      });
    }

    template() {
      return html`
        <button @click=${() => this.increment()}>Increment</button>
        <button @click=${() => this.batchIncrement()}>Batch Increment</button>
        <div>Count: ${this.count.value}</div>
        <div>Double Count: ${this.doubleCount.value}</div>
      `;
    }
  }

  customElements.define('batch-update-element', BatchUpdateElement);
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

