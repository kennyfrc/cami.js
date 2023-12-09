# Cami

Cami.js is a simple yet powerful toolkit for interactive islands in web applications. No build step required.

It has features you'd expect from a modern UI framework, such as reactive web components, async state management, streams, and cross-component state management.

Note that Cami specializes in bringing rich interactivity to your web application. As such, it's meant to be used alongside a backend framework such as FastAPI, Rails, Sinatra, or any server really that responds with HTML. Just paste in Cami's CDN link (or import the bundle) and you'll get the power of many modern UI frameworks without it taking over your workflow. Just progressively enhance your HTML with Cami web components.

## Getting Started

In any HTML file, just add the CDN link:

```html
<script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script>
```

## Key Concepts:

### ReactiveElement & HTML Tagged Template Literals

When you first create a web component, you'll need to subclass `ReactiveElement`. This is an extension of [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) that turns all of your properties into observable properties. These properties are observed for changes, which then triggers a re-render of `template()`.

The `template()` method returns [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates:~:text=This%20is%20useful%20for%20many%20tools%20which%20give%20special%20treatment%20to%20literals%20tagged%20by%20a%20particular%20name) tagged with the html tag. The html tag is a function and you pass it a tagged template literal. It looks strange at first as it's not wrapped in parentheses, but it's just a function call with a special syntax for passing in a template literal.

This template literal is a special type of string that allows you to embed javascript expressions in it using normal string interpolation `${}`. Events are handled using `@` (event listeners), such as `@click`, `@input`, `@change`, etc. Just prepend [any event](https://developer.mozilla.org/en-US/docs/Web/Events#:~:text=wheel%20event-,Element,-animationcancel%20event) with `@` and you can handle it by passing a function, such as `@click=${() => alert('clicked')}`.

Below, we create a `CounterElement` that has a `count` property. When we mutate `count`, the component will re-render `template()`.

To use it, you'll need to create a custom element and register it with `customElements.define`. Then you can use it in your HTML file by adding the tag `<counter-component></counter-component>` like any other HTML tag.

```html
<script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script>
<article>
  <h1>Counter</h1>
  <counter-component
  ></counter-component>
</article>
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

## Next Steps

I hope you see how easy it is to create interactive components with Cami. You can use it to progressively enhance your HTML with interactive components. And you can also use it to create a complex web application with many components that share server and client state.

Below, there are two next steps: either to learn from examples or to read the documentation.

### Learn By Example

* [Counter](https://camijs.com/learn_by_example/counter/)
* [Interactive Registration Form](https://camijs.com/learn_by_example/form_validation/)
* [Todo List with Server State Management](https://camijs.com/learn_by_example/todo_list_server/)
* [Cart with Client & Server State Management](https://camijs.com/learn_by_example/cart/)
* [Blog with Optimistic UI](https://camijs.com/learn_by_example/blog/)
* [Nested Key Updates](https://camijs.com/learn_by_example/nested_updates/)
* [WAI-ARIA Compliant Modal](https://camijs.com/learn_by_example/modal/)

### Documentation

* [API Reference](https://camijs.com/api/)
* [How it Works](https://camijs.com/features/observable_property/)
