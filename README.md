# Nanodux

Nanodux is a simple, no-build, framework-agnostic state management library. It is designed with a focus on simplicity and ease of use, while still providing powerful features like built-in support for async functions, Redux DevTools integration, and an immer-like produce function for immutability.

## Motivation

Nanodux was created with the following objectives in mind:

- No Build: It doesn't require a build step, making it easy to integrate into any project.
- Async Support: It has built-in support for async functions like fetch, simplifying asynchronous state management.
- Singleton Store: It uses a singleton store, making state management straightforward and consistent.
- Redux DevTools Integration: It integrates with Redux DevTools for easy debugging.
- Immer-like Produce Function: Reduce boilerplate & get automatic immutability with the built-in produce function, which acts as a replacement for the reducer.
- Framework-Agnostic: It doesn't tie you to a specific framework, giving you the flexibility to use it in any JavaScript project.
- Server Dispatches: It has built-in support for server dispatches, reducing boilerplate and simplifying server-side state management.

## Usage

### For client-side usage:


TODO

### For server-side usage:

TODO

## Roadmap

- Schema Setup: We plan to add support for setting up a schema for your state.
- Automatic Schema Validation: We plan to add automatic schema validation to ensure your state always matches the defined schema.
- Async queue: We plan to add support for an async queue, which will allow you to dispatch async functions in a queue, ensuring they are executed in order with no overwrites.
