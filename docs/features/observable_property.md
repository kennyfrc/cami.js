# Core Concepts: Observable Properties, Observable State, and Observable Proxy

Observable Properties are a fundamental concept in Cami. They are properties of a ReactiveElement instance that are automatically observed for changes. When a change occurs, the ReactiveElement instance is notified and re-renders the return value of the `template()` method. The `template()` method is a method that returns a template literal that is then rendered to the DOM. If you're familiar with React, tagged template literals are similar to JSX, and our version of `render()` is done automatically by the ReactiveElement instance upon a change to an Observable Property.

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
  filter = 'all';

  // ...other methods...

  template() {
    // ...template code...
  }
}
```

In this example, `tasks` is an Observable Property that is an array. Any changes to the `tasks` array or any of its elements will automatically trigger a re-render of the component.

<hr>

<article>
  <h5>Simple Task Manager Demo (In-Memory Data)</h5>
  <task-manager-component-f1></task-manager-component-f1>
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
        <div class="md-form-group">
          <input id="taskInput" class="md-input" type="text" placeholder="Enter task name">
          <button class="md-button" @click=${() => {
            this.addTask(document.getElementById('taskInput').value);
            document.getElementById('taskInput').value = '';
          }}>Add Task</button>
        </div>
        <div class="md-button-group">
          <button class="md-button" @click=${() => this.setFilter('all')}>All</button>
          <button class="md-button" @click=${() => this.setFilter('active')}>Active</button>
          <button class="md-button" @click=${() => this.setFilter('completed')}>Completed</button>
        </div>
        <ul class="md-list">
          ${this.getFilteredTasks().map((task, index) => html`
            <li class="md-list-item">
              <input class="md-checkbox" type="checkbox" .checked=${task.completed} @click=${() => this.toggleTask(index)}>
              <span class="md-text">${task.name}</span>
              <a class="md-link" @click=${() => this.removeTask(index)}>Remove</a>
            </li>
          `)}
        </ul>
      `;
    }
  }

  customElements.define('task-manager-component-f1', TaskManagerElement);
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
// Primitive value example from _001_counter.html
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

// Non-primitive value example from _003_todo.html
// this.query returns an ObservableProperty / ObservableProxy
// this.todos is an ObservableProxy, where if you get the value, it returns the current value of the property, and if you set the value, it updates the property with the new value
// We use Proxy instead of Object.defineProperty because it allows us to handle nested properties
class TodoListElement extends ReactiveElement {
  todos = this.query({
    queryKey: ['todos'],
    queryFn: () => {
      return fetch("https://mockend.com/api/kennyfrc/cami-mock-api/todos?limit=5").then(res => res.json())
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  template() {
    // ...template code...
  }
}

// Array value example from _010_taskmgmt.html
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
| value | <code>any</code> | The current value of the observable state. This is the value that is returned when accessing a primitive property on a ReactiveElement instance. |
| update | <code>function</code> | A function that updates the value of the observable state. It takes an updater function that receives the current value and returns the new value. This is used when assigning a new value to a primitive property on a ReactiveElement instance. |
| [dispose] | <code>function</code> | An optional function that cleans up the observable state when it is no longer needed. This is used internally by ReactiveElement to manage memory. |

<a name="ObservableProxy"></a>

## ObservableProxy
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| get | <code>function</code> | A getter function that returns the current value of the property. If the property is a primitive value, this will return the value directly from the ObservableState instance. If the property is a non-primitive value, this will return an ObservableProxy that wraps the ObservableState instance. This getter is used when accessing a non-primitive property on a ReactiveElement instance. We use Proxy instead of Object.defineProperty because it allows us to handle nested properties. |
| set | <code>function</code> | A setter function that updates the value of the property. It updates the ObservableState instance with the new value. This setter is used when assigning a new value to a non-primitive property on a ReactiveElement instance. |
