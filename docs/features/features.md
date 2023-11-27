# Feature Overview

* **Reactive Web Components**: Simplify your web development with `ReactiveElement`, which extends the standard `HTMLElement`. It automatically sets up reactive properties, so you don't have to write the usual boilerplate code. This feature supports complex scenarios like deep updates, array changes, and reactive attributes, making it easier to manage dynamic content.
* **Async State Management**: Easily manage server data with our async tools. Use the `query` method to fetch and cache data, with options to control how often it refreshes. The `mutation` method lets you update data and immediately reflect those changes in the UI, providing a smooth experience without waiting for server responses.
* **Streams & Functional Reactive Programming (FRP)**: Handle asynchronous events gracefully with Observable Streams. They offer powerful functions like `map`, `filter`, and `debounce` to process events in a sophisticated yet manageable way, perfect for writing clean, reactive code.
* **Cross-component State Management with a Singleton Store**: Share state across different components with ease using a single store. This approach is compatible with Redux DevTools, giving you powerful debugging capabilities.


<h2>Internals that You Don't Need to Worry About</h2>

* **Dependency Tracking**: Keep your app's data in sync automatically. Our dependency tracker observes the relationships between your data and updates them as needed, so you can focus on writing the logic that matters.
* **Automatic Disposal & Garbage Collection**: **: Avoid memory leaks with automatic disposal. Our library automatically disposes of streams, dependencies, computeds, and effects when they are no longer needed, so you don't have to worry about it.
