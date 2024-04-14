# 🏝️ Cami.js

⚠️ Expect API changes until v1.0.0 ⚠️

Current version: 0.3.15.

Bundle Size: 14kb minified & gzipped.

A simple yet powerful toolkit for interactive islands in web applications. No build step required.

It has features you'd expect from a modern UI framework, such as reactive web components, async state management, streams, and cross-component state management.

Note that Cami specializes in bringing rich interactivity to your web application. As such, it's meant to be used alongside a backend framework such as FastAPI, Rails, Sinatra, or any server really that responds with HTML. Just paste in Cami's CDN link (or import the bundle) and you'll get the power of many modern UI frameworks without it taking over your workflow. Just progressively enhance your HTML with Cami web components.

```html
<!-- The most basic example: the counter -->
<cami-counter></cami-counter>
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

  customElements.define('cami-counter', CounterElement);
</script>
```

[Documentation](https://camijs.com/) | [API Reference](https://camijs.com/api/) | [CDN Link](https://unpkg.com/cami@latest/build/cami.cdn.js) | [Introduction](https://camijs.com/)

## Learn By Example

* [Counter](https://camijs.com/learn_by_example/counter/)
* [Interactive Registration Form](https://camijs.com/learn_by_example/form_validation/)
* [Todo List with Server State Management](https://camijs.com/learn_by_example/todo_list_server/)
* [Cart with Client & Server State Management](https://camijs.com/learn_by_example/cart/)
* [Blog with Optimistic UI](https://camijs.com/learn_by_example/blog/)
* [Nested Key Updates](https://camijs.com/learn_by_example/nested_updates/)
* [WAI-ARIA Compliant Modal](https://camijs.com/learn_by_example/modal/)

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

## Features include:

* **Reactive Web Components**: Simplifies front-end web development with `ReactiveElement`. This is done through [Observable Properties](https://camijs.com/features/observable_property). They are properties of a `ReactiveElement` instance that are automatically observed for changes. When a change occurs, the `ReactiveElement` instance is notified and can react accordingly by re-rendering the component. Observable properties support deep updates, array changes, and reactive attributes, making it easier to manage dynamic content. Lastly, this removes the boilerplate of `signal()`, `setState()`, or `reactive()` that you might find in other libraries.
* **Async State Management**: Easily manage server data. Our library provides a simple API for fetching and updating data with [`query` and `mutation`](https://camijs.com/features/async_state_management). Use the `query` method to fetch and cache data, with options to control how often it refreshes. The `mutation` method lets you update data and immediately reflect those changes in the UI, providing a smooth experience without waiting for server responses.
* **Cross-component State Management with  Stores**: Share state across different components with ease using a single store using [`cami.store`](https://camijs.com/features/client_state_management). By default, this uses `localStorage` to persist state across page refreshes. This is useful for storing user preferences, authentication tokens, and other data that needs to be shared across components. This is also useful for storing data that needs to be shared across tabs.
* **Streams & Functional Reactive Programming (FRP)**: Handle asynchronous events gracefully with [Observable Streams](https://camijs.com/features/streams/). They offer powerful functions like `map`, `filter`, `flatMap`, and `debounce` to process events in a sophisticated yet manageable way, for clean & declarative code.

Please visit our [Documentation](https://camijs.com/), [API Reference](https://camijs.com/api/), [Examples](https://camijs.com/learn_by_example/counter/), or [Core Concepts](https://camijs.com/features/observable_property/) to learn more.

## Motivation

I wanted a minimalist javascript library that has no build steps, great debuggability, and didn't take over my front-end.

My workflow is simple: I want to start any application with normal HTML/CSS, and if there were fragments or islands that needed to be interactive (such as dashboards & calculators), I needed a powerful enough library that I could easily drop in without rewriting my whole front-end. Unfortunately, the latter is the case for the majority of javascript libraries out there.

That said, I like the idea of declarative templates, uni-directional data flow, time-travel debugging, and fine-grained reactivity. But I wanted no build steps (or at least make 'no build' the default). So I created Cami.

## Who is this for?

- **Lean Teams or Solo Devs**: If you're building a small to medium-sized application, I built Cami with that in mind. You can start with `ReactiveElement`, and once you need to share state between components, you can add our store. It's a great choice for rich data tables, dashboards, calculators, and other interactive islands. If you're working with large applications with large teams, you may want to consider other frameworks.
- **Developers of Multi-Page Applications**: For folks who have an existing server-rendered application, you can use Cami to add interactivity to your application.


## Examples

To learn Cami by example, see our [examples](https://camijs.com/learn_by_example/counter/).

## Dev Usage

### Install Dependencies

```bash
bun install
```

### Building

```bash
bun run build:docs
bun run build:minify
```

### How Docs are Built

JSDoc is used to build the API reference. We use Material for MkDocs for the documentation.

To make JSDoc be compatible with MkDocs, we use jsdoc2md to generate markdown files from JSDoc comments. We use then use MkDocs to build the documentation site.


### Testing

We use Jasmine for testing. To run the tests, run:

```bash
bunx serve # serves the test files (it's just html)
```

Then open `http://localhost:8080/test/SpecRunner.html` in your browser.

## Prior Art

- Immer (immutable state)
- Redux / Zustand (client state management)
- React Query (server state management)
- MobX (observable state)
- lit-html (declarative templates)

## Why "Cami"?

It's short for [Camiguin](https://www.google.com/search?q=camiguin&sca_esv=576910264&tbm=isch&source=lnms&sa=X&sqi=2&ved=2ahUKEwjM_6rOp5SCAxV-9zgGHSW6CjYQ_AUoAnoECAMQBA&biw=1920&bih=944&dpr=1), a pretty nice island.
