# Features

Cami enhances server-rendered and static pages with focused interactive islands.

## Components

- reactive public fields on standard custom elements;
- lit-html templates through `html` and `svg`;
- native custom-element lifecycle callbacks;
- keyed `afterRender()` work after DOM commit;
- component-owned resources and ephemeral drafts.

## Shared state

- named typed store modules;
- synchronous actions and dependency-tracked memos;
- cached server queries and mutations;
- optimistic updates and query invalidation;
- async orchestration, hooks, specs, and state machines for advanced workflows.

## Browser integration

- hash navigation and route resources through `URLStore`;
- versioned localStorage persistence;
- stable list rendering with `repeat` and `keyed`;
- explicit trusted HTML with `unsafeHTML`;
- component-owned image loading with `useImage`.

## Delivery

Use the browser-global CDN bundle in an MPA without a build step. Compiled JavaScript and TypeScript projects can import the ES module and declarations.
