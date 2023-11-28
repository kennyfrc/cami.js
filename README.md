# 🏝️ Cami.js

⚠️ Expect API changes until v1.0.0 ⚠️

Current version: 0.3.3.

Bundle Size: 14kb minified & gzipped.

A minimalist yet powerful toolkit for interactive islands in web applications. No build step required.

It has features you'd expect from a modern UI framework, such as reactive web components, async state management, streams, and cross-component state management.

Note that Cami specializes in bringing rich interactivity to your web application. As such, it's meant to be used alongside a backend framework such as FastAPI, Rails, Sinatra, or any server really that responds with HTML. Just paste in Cami's CDN link (or import the bundle) and you'll get the power of many modern UI frameworks without it taking over your workflow. Just progressively enhance your HTML with Cami web components.

[Documentation](https://camijs.com/) | [API Reference](https://camijs.com/api/) | [CDN Link](https://unpkg.com/cami@latest/build/cami.cdn.js)

## Features include:

* **Reactive Web Components**: Simplifies front-end web development with `ReactiveElement`. This is done through [Observable Properties](https://camijs.com/features/observable_property). They are properties of a `ReactiveElement` instance that are automatically observed for changes. When a change occurs, the `ReactiveElement` instance is notified and can react accordingly by re-rendering the component. Observable properties support deep updates, array changes, and reactive attributes, making it easier to manage dynamic content. Lastly, this removes the boilerplate of `signal()`, `setState()`, or `reactive()` that you might find in other libraries.
* **Async State Management**: Easily manage server data. Our library provides a simple API for fetching and updating data with [`query` and `mutation`](https://camijs.com/features/async_state_management). Use the `query` method to fetch and cache data, with options to control how often it refreshes. The `mutation` method lets you update data and immediately reflect those changes in the UI, providing a smooth experience without waiting for server responses.
* **Cross-component State Management with  Stores**: Share state across different components with ease using a single store using [`cami.store`](https://camijs.com/features/client_state_management). By default, this uses `localStorage` to persist state across page refreshes. This is useful for storing user preferences, authentication tokens, and other data that needs to be shared across components. This is also useful for storing data that needs to be shared across tabs.
* **Streams & Functional Reactive Programming (FRP)**: Handle asynchronous events gracefully with [Observable Streams](https://camijs.com/features/streams/). They offer powerful functions like `map`, `filter`, `flatMap`, and `debounce` to process events in a sophisticated yet manageable way, for clean & declarative code.

Visit Our [Documentation](https://camijs.com/)or [API Reference](https://camijs.com/api/) to learn more.

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

TBD

## Prior Art

- Immer (immutable state)
- Redux / Zustand (client state management)
- React Query (server state management)
- MobX (observable state)
- lit-html (declarative templates)

## Why "Cami"?

It's short for [Camiguin](https://www.google.com/search?q=camiguin&sca_esv=576910264&tbm=isch&source=lnms&sa=X&sqi=2&ved=2ahUKEwjM_6rOp5SCAxV-9zgGHSW6CjYQ_AUoAnoECAMQBA&biw=1920&bih=944&dpr=1), a pretty nice island.
