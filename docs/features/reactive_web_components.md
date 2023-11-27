Let's take the example of creating a counter component. In contrast to other frameworks where you might need to define a counter with something like `count = signal(0)` or `count = ref(0)`, and then retrieve the value with `count()` or `count.value`, Cami.js simplifies this process significantly.

You can directly define `count = 0` within your `CounterElement` class and access it just like a regular JavaScript variable.

Define a `CounterElement` class that extends `ReactiveElement` and define a `count` property initialized to 0:

```js
class CounterElement extends ReactiveElement {
  count = 0;
  // ...
}
```

Then define a `template` method that returns an HTML template using the `html` function:

```js
template() {
  return html`
    <button @click=${() => this.count--}>-</button>
    <button @click=${() => this.count++}>+</button>
    <div>Count: ${this.count}</div>
  `;
}
```

Finally, register your custom element.

```js
customElements.define('counter-component', CounterElement);
```

Add the element to your HTML file:

```html
<counter-component></counter-component>
```

This is how everything comes together:

```html
<counter-component></counter-component>
<script type="module">
  const { html, ReactiveElement } = cami;

  class CounterElement extends ReactiveElement {
    count = 0;
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

#### Live Demo of Reactive Web Components (Simple Counter)

Now, when you load your HTML file, you will see a counter with two buttons to increment and decrement the count. The count is displayed and updated in real-time as you click the buttons.

<hr>

<article>
  <counter-component
  ></counter-component>
</article>
<script type="module">
  const { html, ReactiveElement } = cami;

  class CounterElement extends ReactiveElement {
    count = 0

    template() {
      return html`
        <button class="md-button md-button--primary"
        @click=${() => this.count--}>-</button>
        <button class="md-button md-button--primary"
        @click=${() => this.count++}>+</button>
        <p>Count: ${this.count}</p>
      `;
    }
  }

  customElements.define('counter-component', CounterElement);
</script>

<hr>


