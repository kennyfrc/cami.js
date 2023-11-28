# Cami

Cami.js is a minimalist yet powerful toolkit for interactive islands in web applications. No build step required.

It has features you'd expect from a modern UI framework, such as reactive web components, async state management, streams, and cross-component state management.

Note that Cami specializes in bringing rich interactivity to your web application. As such, it's meant to be used alongside a backend framework such as FastAPI, Rails, Sinatra, or any server really that responds with HTML. Just paste in Cami's CDN link (or import the bundle) and you'll get the power of many modern UI frameworks without it taking over your workflow. Just progressively enhance your HTML with Cami web components.

Core concepts are explained [here](./features/observable_property.md). Learn by example [here](./learn_by_example/counter.md). API Reference is available [here](./api/index.md).

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
