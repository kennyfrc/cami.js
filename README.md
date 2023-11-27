# 🏝️ Cami.js

⚠️ Expect API changes until v1.0.0 ⚠️

Current version: 0.3.1. Follows [semver](https://semver.org/).

Bundle Size: 14kb minified & gzipped.

A minimalist yet powerful toolkit for interactive islands in web applications.

## Features include:

* **Reactive Web Components**: Offers `ReactiveElement`, an extension of `HTMLElement` that automatically defines observables without any boilerplate. It also supports deeply nested updates, array manipulations, and observable attributes.
* **Async State Management**: It allows you to fetch, cache, and update data from APIs with ease. The `query` method enables fetching data and caching it with configurable options such as stale time and refetch intervals. The `mutation` method offers a way to perform data mutations and optimistically update the UI for a seamless user experience.
* **Streams & Functional Reactive Programming (FRP)**: Uses Observable Streams for managing asynchronous events, enabling complex event processing with methods like `map`, `filter`, `debounce`, and more. This allows for elegant composition of asynchronous logic.
* **Cross-component State Management with a Singleton Store**: Uses a singleton store to share state between components. Redux DevTools compatible.
* **Dependency Tracking**: Uses a dependency tracker to track dependencies between observables and automatically update them when their dependencies change.

Below covers three examples: a simple counter component to get you started, a shopping cart component to demonstrate server & client state management, and a registration form that demonstrates streams & functional reactive programming.

## Counter Component

Notice that you don't have to define observables or effects. You can just directly mutate the state, and the component will automatically update its view.

```html
<!-- Just copy & paste this into an HTML file, and open it in your browser. -->
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

## Shopping Cart Component

Notice that product data is fetched through a query (server state), and the cart data is managed through a shared store (client state). Loading, error, and stale states are handled automatically.

```html
<!-- Just copy & paste this into an HTML file, and open it in your browser. -->
<article>
  <h2>Products</h2>
  <p>This fetches the products from an API, and uses a client-side store to manage the cart.</p>
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
    add: (store, product) => {
      const cartItem = { ...product, cartItemId: Date.now() };
      store.cartItems.push(cartItem);
    },
    remove: (store, product) => {
      store.cartItems = store.cartItems.filter(item => item.cartItemId !== product.cartItemId);
    }
  });

  const loggerMiddleware = (context) => {
    console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
  };

  CartStore.use(loggerMiddleware);

  class ProductListElement extends ReactiveElement {
    cartItems = this.connect(CartStore, 'cartItems');
    products = this.query({
      queryKey: ['products'],
      queryFn: () => {
        return fetch("https://mockend.com/api/kennyfrc/cami-mock-api/products?limit=3").then(res => res.json())
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    });

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
      if (this.products.status === "pending") {
        return html`<div>Loading...</div>`;
      }

      if (this.products.status === "error") {
        return html`<div>Error: ${this.products.error.message}</div>`;
      }

      if (this.products.data) {
        return html`
          <ul>
            ${this.products.data.map(product => html`
              <li>
                ${product.name} - $${(product.price / 100).toFixed(2)}
                <button @click=${() => this.addToCart(product)} ?disabled=${this.isOutOfStock(product)}>
                  Add to cart
                </button>
              </li>
            `)}
          </ul>
        `;
      }
    }
  }

  customElements.define('product-list-component', ProductListElement);

  class CartElement extends ReactiveElement {
    cartItems = this.connect(CartStore, 'cartItems');

    get cartValue() {
      return this.cartItems.reduce((acc, item) => acc + item.price, 0);
    }

    removeFromCart(product) {
      CartStore.remove(product);
    }

    template() {
      return html`
        <p>Cart value: $${(this.cartValue / 100).toFixed(2)}</p>
        <ul>
          ${this.cartItems.map(item => html`
            <li>${item.name} - $${(item.price / 100).toFixed(2)} <button @click=${() => this.removeFromCart(item)}>Remove</button></li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('cart-component', CartElement);
</script>
```

## Registration Form Component

Notice that the email input is debounced. This is to prevent unnecessary API calls. Loading states are also handled automatically.

```html
<!-- Just copy & paste this into an HTML file, and open it in your browser. -->
<article>
  <h1>Registration Form</h1>
  <form-component></form-component>
</article>
<small>
<p>Try entering an email that is already taken, such as geovanniheaney@block.info (mock email)</p>
</small>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class FormElement extends ReactiveElement {
    emailError = ''
    passwordError = ''
    email = '';
    password = '';
    emailIsValid = null;
    isEmailAvailable = null;

    inputValidation$ = this.stream();
    passwordValidation$ = this.stream();

    onConnect() {
      this.inputValidation$
        .map(e => this.validateEmail(e.target.value))
        .debounce(300)
        .subscribe(({ isEmailValid, emailError, email }) => {
          this.emailError = emailError;
          this.isEmailValid = isEmailValid;
          this.email = email;
          this.isEmailAvailable = this.queryEmail(this.email)
        });

      this.passwordValidation$
        .map(e => this.validatePassword(e.target.value))
        .debounce(300)
        .subscribe(({ isValid, password }) => {
          this.passwordError = isValid ? '' : 'Password must be at least 8 characters long.';
          this.password = password;
        });
    }

    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let emailError = '';
      let isEmailValid = null;
      if (email === '') {
        emailError = '';
        isEmailValid = null;
      } else if (!emailRegex.test(email)) {
        emailError = 'Please enter a valid email address.';
        isEmailValid = false;
      } else {
        emailError = '';
        isEmailValid = true;
      }
      return { isEmailValid, emailError, email };
    }

    validatePassword(password) {
      let isValid = false;
      if (password === '') {
        isValid = null;
      } else if (password?.length >= 8) {
        isValid = true;
      }

      return { isValid, password }
    }

    queryEmail(email) {
      return this.query({
        queryKey: ['Email', email],
        queryFn: () => {
          return fetch(`https://mockend.com/api/kennyfrc/cami-mock-api/users?email_eq=${email}`).then(res => res.json())
        },
        staleTime: 1000 * 60 * 5
      })
    }

    getEmailInputState() {
      if (this.email === '') {
        return '';
      } else if (this.isEmailValid && this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length === 0) {
        return false;
      } else {
        return true;
      }
    }

    getPasswordInputState() {
      if (this.password === '') {
        return '';
      } else if (this.passwordError === '') {
        return false;
      } else {
        return true;
      }
    }

    template() {
      return html`
        <form action="/submit" method="POST">
          <label>
            Email:
            <input type="email"
              aria-invalid=${this.getEmailInputState()}
              @input=${(e) => this.inputValidation$.next(e) } value=${this.email}>
              <span>${this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length > 0 && this.emailError === '' ? 'Email is already taken.' : ''}</span>
            <span>${this.emailError}</span>
          </label>
          <label>
            Password:
            <input type="password" @input=${(e) => this.passwordValidation$.next(e) }
              value=${this.password}
              aria-invalid=${this.getPasswordInputState()}>
            <span>${this.passwordError}</span>
          </label>
          <input type="submit" value="Submit" ?disabled=${this.emailError !== '' || this.passwordError !== '' || this.email === '' || this.password === ''}>
        </form>
      `;
    }
  }

  customElements.define('form-component', FormElement);
</script>
```

## Motivation

I wanted a minimalist javascript library that has no build steps, great debuggability, and didn't take over my front-end.

My workflow is simple: I want to start any application with normal HTML/CSS, and if there were fragments or islands that needed to be interactive (such as dashboards & calculators), I needed a powerful enough library that I could easily drop in without rewriting my whole front-end. Unfortunately, the latter is the case for the majority of javascript libraries out there.

That said, I like the idea of declarative templates, uni-directional data flow, time-travel debugging, and fine-grained reactivity. But I wanted no build steps (or at least make 'no build' the default). So I created Cami.

## Who is this for?

- **Lean Teams or Solo Devs**: If you're building a small to medium-sized application, I built Cami with that in mind. You can start with `ReactiveElement`, and once you need to share state between components, you can add our store. It's a great choice for rich data tables, dashboards, calculators, and other interactive islands. If you're working with large applications with large teams, you may want to consider other frameworks.
- **Developers of Multi-Page Applications**: For folks who have an existing server-rendered application, you can use Cami to add interactivity to your application.

## Get Started & View Examples

To see some examples, just do the following:

```bash
git clone git@github.com:kennyfrc/cami.js.git
cd cami.js
bun install --global serve
bunx serve
```

Open http://localhost:3000 in your browser, then navigate to the examples folder. In the examples folder, you will find a series of examples that illustrate the key concepts of Cami.js. These examples are numbered & ordered by complexity.

## Learn Cami by Example

In this tutorial, we'll walk through creating a simple Task Manager component using Cami.js. By the end, you'll understand how to create interactive components with Cami's reactive system.

### Step 1: Creating a Basic Component

Let's start by creating a basic structure for our Task Manager component. We'll define the HTML structure and include the necessary scripts to use Cami.js.

```html
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
    // This is where our component's internal state and logic will go

    template() {
      // Here we define the HTML structure of our component using Cami's html tagged template
      return html`
        <input id="taskInput" type="text" placeholder="Enter task name">
        <button>Add Task</button>
        <button>All</button>
        <button>Active</button>
        <button>Completed</button>
        <ul>
          <!-- Tasks will be dynamically inserted here -->
        </ul>
      `;
    }
  }

  // This line registers our component with the browser so it can be used as a custom element
  customElements.define('task-manager-component', TaskManagerElement);
</script>
```

### Step 2: Adding Observables

Now, let's add some reactivity to our component. We'll use observables to manage the tasks and the current filter state.

```javascript
class TaskManagerElement extends ReactiveElement {
  tasks = []; // This observable array will hold our tasks
  filter = 'all'; // This observable string will control the current filter

  // ... rest of the component

  getFilteredTasks() {
    // This method will filter tasks based on the current filter state
    switch (this.filter) {
      case 'completed':
        return this.tasks.filter(task => task.completed);
      case 'active':
        return this.tasks.filter(task => !task.completed);
      default:
        return this.tasks;
    }
  }

  // ... rest of the component
}
```

### Step 3: Adding Behavior

Finally, we'll implement the methods to add, remove, and toggle tasks, as well as to change the filter. We'll also update the template to bind these methods to the respective buttons and inputs.

```javascript
class TaskManagerElement extends ReactiveElement {
  // ... observables from Step 2

  addTask(task) {
    this.tasks.push({ name: task, completed: false });
  }

  removeTask(index) {
    this.tasks.splice(index, 1);
  }

  toggleTask(index) {
    this.tasks[index].completed = !this.tasks[index].completed;
  }

  setFilter(filter) {
    this.filter = filter;
  }

  template() {
    return html`
      <input id="taskInput" type="text" placeholder="Enter task name">
      <button @click=${() => {
        const taskName = document.getElementById('taskInput').value;
        this.addTask(taskName);
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
            <button @click=${() => this.removeTask(index)}>Remove</button>
          </li>
        `)}
      </ul>
    `;
  }
}
```

For a complete example, including observables and behavior, refer to the `examples/010_taskmgmt.html` file in the Cami.js repository.

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
  <h1>Registration Form</h1>
  <form-component></form-component>
</article>
<small>
<p>Try entering an email that is already taken, such as geovanniheaney@block.info (mock email)</p>
</small>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class FormElement extends ReactiveElement {
    emailError = ''
    passwordError = ''
    email = '';
    password = '';
    emailIsValid = null;
    isEmailAvailable = null;

    inputValidation$ = this.stream();
    passwordValidation$ = this.stream();

    onConnect() {
      this.inputValidation$
        .map(e => this.validateEmail(e.target.value))
        .debounce(300)
        .subscribe(({ isEmailValid, emailError, email }) => {
          this.emailError = emailError;
          this.isEmailValid = isEmailValid;
          this.email = email;
          this.isEmailAvailable = this.queryEmail(this.email)
        });

      this.passwordValidation$
        .map(e => this.validatePassword(e.target.value))
        .debounce(300)
        .subscribe(({ isValid, password }) => {
          this.passwordError = isValid ? '' : 'Password must be at least 8 characters long.';
          this.password = password;
        });
    }

    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let emailError = '';
      let isEmailValid = null;
      if (email === '') {
        emailError = '';
        isEmailValid = null;
      } else if (!emailRegex.test(email)) {
        emailError = 'Please enter a valid email address.';
        isEmailValid = false;
      } else {
        emailError = '';
        isEmailValid = true;
      }
      return { isEmailValid, emailError, email };
    }

    validatePassword(password) {
      let isValid = false;
      if (password === '') {
        isValid = null;
      } else if (password?.length >= 8) {
        isValid = true;
      }

      return { isValid, password }
    }

    queryEmail(email) {
      return this.query({
        queryKey: ['Email', email],
        queryFn: () => {
          return fetch(`https://mockend.com/api/kennyfrc/cami-mock-api/users?email_eq=${email}`).then(res => res.json())
        },
        staleTime: 1000 * 60 * 5
      })
    }

    getEmailInputState() {
      if (this.email === '') {
        return '';
      } else if (this.isEmailValid && this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length === 0) {
        return false;
      } else {
        return true;
      }
    }

    getPasswordInputState() {
      if (this.password === '') {
        return '';
      } else if (this.passwordError === '') {
        return false;
      } else {
        return true;
      }
    }

    template() {
      return html`
        <form action="/submit" method="POST">
          <label>
            Email:
            <input type="email"
              aria-invalid=${this.getEmailInputState()}
              @input=${(e) => this.inputValidation$.next(e) } value=${this.email}>
              <span>${this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length > 0 && this.emailError === '' ? 'Email is already taken.' : ''}</span>
            <span>${this.emailError}</span>
          </label>
          <label>
            Password:
            <input type="password" @input=${(e) => this.passwordValidation$.next(e) }
              value=${this.password}
              aria-invalid=${this.getPasswordInputState()}>
            <span>${this.passwordError}</span>
          </label>
          <input type="submit" value="Submit" ?disabled=${this.emailError !== '' || this.passwordError !== '' || this.email === '' || this.password === ''}>
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
  <p><small class="note"></small></p>
  <todo-list-component></todo-list-component>
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
        return fetch("https://mockend.com/api/kennyfrc/cami-mock-api/todos?limit=5").then(res => res.json())
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    })

    addTodo = this.mutation({
      mutationFn: (newTodo) => {
        return fetch("https://mockend.com/api/kennyfrc/cami-mock-api/todos", {
          method: "POST",
          body: JSON.stringify(newTodo),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then(res => {
          document.querySelector('.note').innerHTML = 'Todo was dispatched to the server. Since we are using a mock API, this wont work. In your local environment, you would need to persist the changes to your server database. The query will automatically refetch the data from the server.';
          return res.json();
        })
      }
    });

    deleteTodo = this.mutation({
      mutationFn: (todo) => {
        return fetch(`https://mockend.com/api/kennyfrc/cami-mock-api/todos/${todo.id}`, {
          method: "DELETE"
        }).then(res => {
          document.querySelector('.note').innerHTML = 'Todo was deleted from the server. Since we are using a mock API, this wont work. In your local environment, you would need to persist the changes to your server database. The query will automatically refetch the data from the server.';
          return res.json();
        })
      }
    });

    template() {
      if (this.todos.data) {
        return html`
          <input class="newTodo" type="text" />
          <button @click=${() => {
            this.addTodo.mutate({
              title: document.querySelector('.newTodo').value,
              completed: false
            })
            document.querySelector('.newTodo').value = '';
      }}>Add</button>
          <ul>
            ${this.todos.data.slice().reverse().map(todo => html`
              <li>
                ${todo.title}
                <button @click=${() => this.deleteTodo.mutate(todo)}>Delete</button>
              </li>
            `)}
          </ul>
        `;
      }

      if (this.todos.status === "pending") {
        return html`<div>Loading...</div>`;
      }

      if (this.todos.status === "error") {
        return html`<div>Error: ${this.todos.error.message}</div>`;
      }

      if (this.addTodo.status === "pending") {
        return html`
        ${this.addTodo.status === "pending" ? html`
          <li style="opacity: 0.5;">
            Adding new todo...
          </li>
        ` : ''}
        <div>Adding todo...</div>`;
      }

      if (this.addTodo.status === "error") {
        return html`<div>Error: ${this.addTodo.error.message}</div>`;
      }
    }
  }

  customElements.define('todo-list-component', TodoListElement);
</script>
```

```html
<!-- ./examples/_004_cart.html -->
  <article>
  <h2>Products</h2>
  <p>This fetches the products from an API, and uses a client-side store to manage the cart.</p>
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
    add: (store, product) => {
      const cartItem = { ...product, cartItemId: Date.now() };
      store.cartItems.push(cartItem);
    },
    remove: (store, product) => {
      store.cartItems = store.cartItems.filter(item => item.cartItemId !== product.cartItemId);
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
    products = this.query({
      queryKey: ['products'],
      queryFn: () => {
        return fetch("https://mockend.com/api/kennyfrc/cami-mock-api/products?limit=3").then(res => res.json())
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    });

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
      if (this.products.status === "pending") {
        return html`<div>Loading...</div>`;
      }

      if (this.products.status === "error") {
        return html`<div>Error: ${this.products.error.message}</div>`;
      }

      if (this.products.data) {
        return html`
          <ul>
            ${this.products.data.map(product => html`
              <li>
                ${product.name} - $${(product.price / 100).toFixed(2)}
                <button @click=${() => this.addToCart(product)} ?disabled=${this.isOutOfStock(product)}>
                  Add to cart
                </button>
              </li>
            `)}
          </ul>
        `;
      }
    }
  }

  customElements.define('product-list-component', ProductListElement);

  class CartElement extends ReactiveElement {
    cartItems = this.connect(CartStore, 'cartItems');

    get cartValue() {
      return this.cartItems.reduce((acc, item) => acc + item.price, 0);
    }

    removeFromCart(product) {
      CartStore.remove(product);
    }

    template() {
      return html`
        <p>Cart value: $${(this.cartValue / 100).toFixed(2)}</p>
        <ul>
          ${this.cartItems.map(item => html`
            <li>${item.name} - $${(item.price / 100).toFixed(2)} <button @click=${() => this.removeFromCart(item)}>Remove</button></li>
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
    user = {};

    onConnect() {
      this.initialUser =  { name: 'Kenn', age: 34, email: 'kenn@example.com' };
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
  const { html, ReactiveElement, http } = cami;

  class BlogComponent extends ReactiveElement {
    posts = this.query({
      queryKey: ["posts"],
      queryFn: () => {
        return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
          .then(res => res.json())
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    })

    //
    // This uses optimistic UI. To disable optimistic UI, remove the onMutate and onError handlers.
    //
    addPost = this.mutation({
      mutationFn: (newPost) => {
        return fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          body: JSON.stringify(newPost),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then(res => res.json())
      },
      onMutate: (newPost) => {
        // Snapshot the previous state
        const previousPosts = this.posts.data;

        // Optimistically update to the new value
        this.posts.update(state => {
          state.data.push({ ...newPost, id: Date.now() });
        });

        // Return the rollback function and the new post
        return {
          rollback: () => {
            this.posts.update(state => {
              state.data = previousPosts;
            });
          },
          optimisticPost: newPost
        };
      },
      onError: (error, newPost, context) => {
        // Rollback to the previous state
        if (context.rollback) {
          context.rollback();
        }
      },
      onSettled: () => {
        // Invalidate the posts query to refetch the true state
        if (!this.addPost.isSettled) {
          this.invalidateQueries(['posts']);
        }
      }
    });

    template() {
      if (this.posts.data) {
        return html`
          <button @click=${() => this.addPost.mutate({
            title: "New Post",
            body: "This is a new post.",
            userId: 1
          })}>Add Post</button>
          <ul>
            ${this.posts.data.slice().reverse().map(post => html`
              <li>
                <h2>${post.title}</h2>
                <p>${post.body}</p>
              </li>
            `)}
          </ul>
        `;
      }

      if (this.posts.status === "loading") {
        return html`<div>Loading...</div>`;
      }

      if (this.posts.status === "error") {
        return html`<div>Error: ${this.posts.error.message}</div>`;
      }

      if (this.addPost.status === "pending") {
        return html`
        ${this.addPost.status === "pending" ? html`
          <li style="opacity: 0.5;">
            Adding new post...
          </li>
        ` : ''}
        <div>Adding post...</div>`;
      }

      if (this.addPost.status === "error") {
        return html`<div>Error: ${this.addPost.error.message}</div>`;
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
- React Query

## Why "Cami"?

It's short for [Camiguin](https://www.google.com/search?q=camiguin&sca_esv=576910264&tbm=isch&source=lnms&sa=X&sqi=2&ved=2ahUKEwjM_6rOp5SCAxV-9zgGHSW6CjYQ_AUoAnoECAMQBA&biw=1920&bih=944&dpr=1), a pretty nice island.
