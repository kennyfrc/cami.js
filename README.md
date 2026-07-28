# Cami.js

Cami.js is a drop-in toolkit for adding interactive islands to server-rendered or static HTML. Its CDN bundle fits multi-page applications without a build step. Compiled applications can use the same API through an ES module with strong TypeScript declarations.

> **Version 0.4.0:** APIs may change before 1.0.

## Start with a script tag

```html
<cami-counter></cami-counter>
<script src="https://unpkg.com/cami@0.4.0/build/cami.cdn.js"></script>
<script src="./counter.js"></script>
```

<details open>
<summary>JavaScript</summary>

```javascript
const { html, ReactiveElement } = cami

class CamiCounter extends ReactiveElement {
  count = 0

  template() {
    return html`
      <button @click=${() => this.count--}>−</button>
      <output>${this.count}</output>
      <button @click=${() => this.count++}>+</button>
    `
  }
}

customElements.define('cami-counter', CamiCounter)
```

</details>

<details>
<summary>TypeScript</summary>

```typescript
import { html, ReactiveElement } from 'cami'

class CamiCounter extends ReactiveElement {
  count = 0

  template() {
    return html`
      <button @click=${() => this.count--}>−</button>
      <output>${this.count}</output>
      <button @click=${() => this.count++}>+</button>
    `
  }
}

customElements.define('cami-counter', CamiCounter)
```

</details>

## Use JavaScript or TypeScript in a compiled project

```bash
npm install cami@0.4.0
```

The browser-global CDN bundle is the shortest path for an MPA or server-rendered page. The ES module works in JavaScript and TypeScript builds and ships with type declarations.

## Current public surface

- **Components and templates:** `ReactiveElement`, `html`, `svg`, `repeat`, `keyed`, `unsafeHTML`, `useImage`
- **Shared state:** `store`, `ObservableStore`, actions, memos, queries, mutations, hooks, state machines
- **Browser integration:** `URLStore` and versioned localStorage

`Observable`, `ObservableState`, and `effect()` remain available only for Cami 0.3 compatibility. New code should use component fields, stores, and `afterRender()`.

Read the [documentation](https://camijs.com/), start with the [first-island tutorial](https://camijs.com/tutorials/first-island/), or use the [API reference](https://camijs.com/api/).

## Development

Install dependencies:

```bash
npm install
```

Run the main checks:

```bash
npm run type-check
npm test
npm run build
npm run build:docs
```

Serve the documentation locally:

```bash
npm run docs:serve
```

Then open `http://127.0.0.1:8000/`.

## Project status

Cami is pre-1.0. Pin the version in production and review release changes before upgrading.

## License

MIT © Kenn Costales
