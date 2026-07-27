# Cami's mental model

Cami combines browser standards with a small reactive runtime. The browser owns the document and custom-element lifecycle. Cami observes state reads and writes, then updates lit-html template parts.

## The update loop

1. A user event, action, query, or mutation changes reactive state.
2. Cami marks dependent computations and elements as dirty.
3. Each affected `ReactiveElement` runs its pure `template()` method.
4. lit-html commits the changed template parts to the existing DOM.
5. Keyed `afterRender()` effects run after the commit.
6. `afterSettle()` reactions run after all affected renders settle.

Keep state writes out of `template()`. Put them in event handlers, actions, or post-render work.

## Cami's core interfaces

| Interface | What it manages | Use it for |
| --- | --- | --- |
| Browser APIs | HTML, focus, form behavior, custom-element lifecycle | Semantic page structure and progressive enhancement |
| `ReactiveElement` | One island's reactive fields and rendered DOM | Local interaction state |
| `ObservableStore` | Named shared state and state transitions | Cross-island state, queries, mutations, orchestration |
| `ObservableState` | One reactive value | Small standalone reactive computations |
| `Model` + `Type` | Runtime-validated state shape | Data whose runtime schema matters |
| `URLStore` | URL-derived navigation state | Hash routes and route resources |

## Rendering is declarative

`template()` describes the DOM for the current state. It may read fields and stores. It should not fetch, dispatch, focus an element, or mutate state while rendering. Cami rejects re-entrant renders so the update cycle stays predictable.

Use:

- event handlers for user-driven writes;
- `afterRender(key, effect, deps)` for DOM work after a commit;
- `afterSettle(source, callback)` for reactions after the render batch;
- `resource(key, loader, options)` for component-owned async values;
- store queries and mutations for shared server state.

## Cami does not own the page

Your server can render navigation, forms, and content. Cami can enhance a calculator, cart, editor, or dashboard in place. You choose the islands. Cami does not require client-side routing or a root component.
