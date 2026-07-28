# Tutorial: build your first interactive island

In this tutorial, you will add a self-contained counter to an otherwise static page. You will learn the three ideas used by every Cami component: a custom element, reactive fields, and an `html` template.

## 1. Create an HTML page

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cami counter</title>
  </head>
  <body>
    <main>
      <h1>Dashboard</h1>
      <cami-counter></cami-counter>
    </main>

    <script src="https://unpkg.com/cami@0.4.1/build/cami.cdn.js"></script>
    <script src="./counter.js"></script>
  </body>
</html>
```

The `<cami-counter>` tag is valid before its class is registered. The browser upgrades it after `counter.js` runs.

## 2. Define the component

Create `counter.js`:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const { html, ReactiveElement } = cami

    class CamiCounter extends ReactiveElement {
      count = 0

      template() {
        return html`
          <section aria-labelledby="counter-title">
            <h2 id="counter-title">Counter</h2>
            <button @click=${() => this.count--}>Decrease</button>
            <output aria-live="polite">${this.count}</output>
            <button @click=${() => this.count++}>Increase</button>
          </section>
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
          <section aria-labelledby="counter-title">
            <h2 id="counter-title">Counter</h2>
            <button @click=${() => this.count--}>Decrease</button>
            <output aria-live="polite">${this.count}</output>
            <button @click=${() => this.count++}>Increase</button>
          </section>
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

Open the page through a local web server. For example:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`, then use both buttons. The output changes without replacing the rest of the page.

## 3. Add derived UI

Add a label inside the template:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    <p>${this.count === 0 ? 'Start counting' : `Changed ${Math.abs(this.count)} times`}</p>
    ```

=== "TypeScript"

    ```typescript
    <p>${this.count === 0 ? 'Start counting' : `Changed ${Math.abs(this.count)} times`}</p>
    ```

Templates use standard tagged template literals in both JavaScript and TypeScript. Derive display values while rendering; do not duplicate them in state.

## What you learned

- A Cami island is a standards-based custom element.
- Fields assigned on the component become reactive.
- Event bindings use lit-html syntax such as `@click=${handler}`.
- `template()` should read state and return UI, not perform side effects.

Next, [share state between two islands](shared-state.md).
