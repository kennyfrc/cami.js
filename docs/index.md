# Cami

Cami.js is a minimalist yet powerful toolkit to build reactive web components in web applications. No build step required.

While minimalist, it has features you'd expect from a modern web framework, such as reactive web components, async state management, streams, and cross-component state management, ideal for creating internal tools, dashboards, and other web applications.

## Getting Started

In any HTML file, just add the CDN link:

```html
<script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script>
```

Then in your JavaScript file, import `html` and `ReactiveElement`. `html` is for creating HTML templates and `ReactiveElement` is an extension of `HTMLElement` that automatically defines observables without any boilerplate.

```html
<script type="module">
  const { html, ReactiveElement } = cami;
  <!-- ... -->
</script>
```

To create a simple counter, extend `ReactiveElement` and define a `count` property:

```js
  class CounterElement extends ReactiveElement {
    count = 0
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

Register your custom element.

```js
customElements.define('counter-component', CounterElement);
```

Finally, add the element to your HTML file:

```html
<counter-component></counter-component>
```

This is how everything comes together:

```html
<script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script>
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

## Demo

And here's how it would look like:

<article>
  <h4>Counter</h4>
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
        <p>Count: ${this.count}</p
      `;
    }
  }

  customElements.define('counter-component', CounterElement);
</script>
