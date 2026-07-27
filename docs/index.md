# Add rich interactions without giving up server-rendered HTML

Cami.js is a small drop-in toolkit for **interactive islands**. Add its CDN bundle to a server-rendered multi-page application without adopting an SPA or build step. The same API also ships as an ES module with strong TypeScript support for compiled applications.

Use it with Rails, FastAPI, Django, Laravel, or plain HTML. Cami enhances only the parts that need to react. JavaScript and TypeScript use the same runtime API.

!!! info "Current in-use version"
    These docs cover the current `0.4.0` source snapshot. The public entry point is `src/cami.ts`. APIs may change before 1.0.

## Pick a starting point

| Goal | Start here |
| --- | --- |
| Learn Cami by building something | [Your first interactive island](tutorials/first-island.md) |
| Add Cami to an existing project | [Install and load Cami](how-to/installation.md) |
| Look up a class or function | [Public API reference](api/index.md) |
| Understand the architecture | [Cami's mental model](explanation/mental-model.md) |

## A complete island

```html
<cami-counter></cami-counter>
<script src="https://unpkg.com/cami@0.3.23/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

### Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const { html, ReactiveElement } = cami

      class CamiCounter extends ReactiveElement {
        count = 0

        template() {
          return html`
            <button @click=${() => this.count--} aria-label="Decrease">−</button>
            <output>${this.count}</output>
            <button @click=${() => this.count++} aria-label="Increase">+</button>
          `
        }
      }

      customElements.define('cami-counter', CamiCounter)
    ```

=== "TypeScript"

    ```typescript
    import { html, ReactiveElement } from 'cami'

    class CamiCounter extends ReactiveElement {
      count: number = 0

      template(): ReturnType<typeof html> {
          return html`
            <button @click=${() => this.count--} aria-label="Decrease">−</button>
            <output>${this.count}</output>
            <button @click=${() => this.count++} aria-label="Increase">+</button>
          `
      }
    }

    declare global {
      interface HTMLElementTagNameMap {
        'cami-counter': CamiCounter
      }
    }

    customElements.define('cami-counter', CamiCounter)
    ```

Class fields become reactive after the element connects. Updating `count` schedules a render. The `html` template updates only the changed DOM parts.

## What is in the current shape?

- **Reactive UI:** `ReactiveElement`, `html`, `svg`, lifecycle hooks, commit-phase effects, and post-settle reactions.
- **Shared and server state:** `store`, `ObservableStore`, actions, memos, queries, mutations, hooks, and state machines.
- **Browser integration:** `repeat`, `keyed`, `unsafeHTML`, `useImage`, component resources, localStorage, and `URLStore`.
- **MPA-friendly delivery:** load the prebuilt CDN bundle directly in server-rendered or static pages.

- **Compiled application support:** install the ES module in JavaScript or TypeScript projects, including SPAs.

## Next step

Follow the [first-island tutorial](tutorials/first-island.md). You can also compare loading styles in [Install and load Cami](how-to/installation.md).
