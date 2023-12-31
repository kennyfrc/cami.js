# How it Works: Observable Properties, Observable State, and Observable Proxy

## Foundational Concepts

Before we do a deep dive on how Cami works, we need to understand a few foundational ideas first. I suggest reading the following links before continuing:

- [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- [Observer Pattern](https://refactoring.guru/design-patterns/observer)

## Observable Properties

Observable Properties are a key idea in Cami, building upon the foundational concepts mentioned above. These properties belong to instances of the ReactiveElement class and are automatically monitored for any changes.

When a change is detected in an Observable Property (e.g. `this.count++`), the ReactiveElement instance is informed and triggers a re-rendering of the `template()` method's return value. This template method returns a template literal (e.g. `<p>Count: ${this.count}</p>`), which is then parsed then rendered to the DOM.

If you're familiar with React, you can think of tagged template literals as similar to JSX. The rendering process, akin to React's `render()` method, is automatically handled by the ReactiveElement instance when an Observable Property changes. This automatic re-rendering is a manifestation of the Observer Pattern, where the ReactiveElement instance acts as the observer, reacting to changes in the Observable Properties.

## Counter Example (Observable Properties & Primitive Values)

Here is an example of an Observable Property in a ReactiveElement class:
```js
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
```

<hr>

<article>
  <h5>Counter Demo</h5>
  <counter-component-f1
  ></counter-component-f1>
</article>
<script type="module">
  const { html, ReactiveElement } = cami;

  class CounterElement extends ReactiveElement {
    count = 0

    template() {
      return html`
        <button class="md-button" @click=${() => this.count--}>-</button>
        <button class="md-button" @click=${() => this.count++}>+</button>
        <div>Count: ${this.count}</div>
      `;
    }
  }

  customElements.define('counter-component-f1', CounterElement);
</script>

<hr>

## How it works

Under the hood, the Observable Property is created using `Object.defineProperty` with a getter and setter. The getter function returns the current value of the property. If the property is a primitive value, this will return the value directly from the [ObservableState](#observablestate) instance. If the property is a non-primitive value, this will return an [ObservableProxy](#observableproxy) that wraps the ObservableState instance. This polymorphic behavior allows the ObservableProperty to handle both primitive and non-primitive values, and handle nested properties.

The setter function updates the value of the property. It updates the ObservableState instance with the new value. This setter is used when assigning a new value to the property on a ReactiveElement instance. When the setter is called, it triggers a re-render of the component.

In our example earlier, `count` is an Observable Property. Any changes to `count` will automatically trigger a re-render of the component.

## How it works (More Intuitively)

That's a lot of abstractions, but you can think of it this way:

- For a given primitive (e.g. number, string, boolean), this gets converted into an ObservableState instance. ObservableState instances are wrapper objects with `.value` getters/setters. And to make it easier to use, we wrap the ObservableState instance with an ObservableProperty, which is just an `Object.defineProperty` with a getter and setter, you can then just call `this.count` to get the value, and `this.count = 1` to set the value.
- For a given non-primitive (e.g. object, array), this gets converted into an ObservableState instance. ObservableState instances are wrapper objects with `.value` getters/setters. And to make it easier to use, we wrap the ObservableState instance with an ObservableProxy, which is just a Proxy object with a getter and setter, you can then just call `this.todos` to get the value, and `this.todos = []` to set the value. The reason we use Proxy instead of Object.defineProperty is because Proxy allows us to handle nested properties.

## Task Manager Example (Observable Properties & Non-Primitive Values)

Observable Properties can also handle non-primitive values and nested properties. This is achieved by returning an ObservableProxy instead of the value directly. The ObservableProxy wraps the ObservableState instance and allows for nested properties to be observed. Here is an example:
```js
class TaskManagerElement extends ReactiveElement {
  tasks = [];

  // ...other methods...

  template() {
    // ...template code...
  }
}
```

In this example, `tasks` is an Observable Property that is an array. Any changes to the `tasks` array or any of its elements will automatically trigger a re-render of the component.

<hr>
<article>
  <h5>Todo List (In-Memory State)</h5>
  <cami-todo-list-simple-demo></cami-todo-list-simple-demo>
</article>

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

    template() {
      return html`
        <input class="md-input" id="taskInput" type="text" placeholder="Enter task name">
        <button class="md-button" @click=${() => {
          this.addTask(document.getElementById('taskInput').value);
          document.getElementById('taskInput').value = '';
        }}>Add Task</button>
        <ul>
          ${this.tasks.map((task, index) => html`
            <li>
              ${task.name}
              <a @click=${() => this.removeTask(index)}>Remove</a>
            </li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('cami-todo-list-simple-demo', TaskManagerElement);
</script>

<hr>

Below is the API Reference for Observable Properties. Updated version is at the [API Reference](../api/reactive_element.md).

## ObservableProperty
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| get | <code>function</code> | A getter function that returns the current value of the property. If the property is a primitive value, this will return the value directly from the ObservableState instance. If the property is a non-primitive value, this will return an ObservableProxy that wraps the ObservableState instance. This getter is used when accessing the property on a ReactiveElement instance. This polymorphic behavior allows the ObservableProperty to handle both primitive and non-primitive values, and handle nested properties (only proxies can handle nested properties, whereas getters/setter traps cannot) |
| set | <code>function</code> | A setter function that updates the value of the property. It updates the ObservableState instance with the new value. This setter is used when assigning a new value to the property on a ReactiveElement instance. |

**Example**
```js
// this.count is an ObservableProperty, where if you get the value, it returns the current value of the property, and if you set the value, it updates the property with the new value
// ObservableProperty is just Object.defineProperty with a getter and setter, where the Object is the ReactiveElement instance
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

// this.query returns an ObservableProperty / ObservableProxy
// this.todos is an ObservableProxy, where if you get the value, it returns the current value of the property, and if you set the value, it updates the property with the new value
// We use Proxy instead of Object.defineProperty because it allows us to handle nested properties
class TodoListElement extends ReactiveElement {
  todos = this.query({
    queryKey: ['todos'],
    queryFn: () => {
      return fetch("https://api.camijs.com/todos?_limit=5").then(res => res.json())
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  template() {
    // ...template code...
  }
}

// this.tasks is an ObservableProxy, where if you get the value, it returns the current value of the property, and if you set the value, it updates the property with the new value
// We use Proxy instead of Object.defineProperty because it allows us to handle nested properties
class TaskManagerElement extends ReactiveElement {
  tasks = [];
  filter = 'all';

  // ...other methods...

  template() {
    // ...template code...
  }
}
```
<a name="ObservableState"></a>

## ObservableState
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The current value of the observable state. This is the value that is returned when accessing a primitive property on a ReactiveElement instance. It can also be used to set a new value for the observable state. |
| update | <code>function</code> | A function that updates the value of the observable state. It takes an updater function that receives the current value and returns the new value. This is used when assigning a new value to a primitive property on a ReactiveElement instance. It allows deeply nested updates. |
| [dispose] | <code>function</code> | An optional function that cleans up the observable state when it is no longer needed. This is used internally by ReactiveElement to manage memory. |

<a name="ObservableProxy"></a>

## ObservableProxy
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| get | <code>function</code> | A getter function that returns the current value of the property. If the property is a primitive value, this will return the value directly from the ObservableState instance. If the property is a non-primitive value, this will return an ObservableProxy that wraps the ObservableState instance. This getter is used when accessing a non-primitive property on a ReactiveElement instance. We use Proxy instead of Object.defineProperty because it allows us to handle nested properties. |
| set | <code>function</code> | A setter function that updates the value of the property. It updates the ObservableState instance with the new value. This setter is used when assigning a new value to a non-primitive property on a ReactiveElement instance. |
