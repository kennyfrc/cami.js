# Counter (Simple)

This demonstrates a simple counter component. It has two buttons, one to increment the count and one to decrement the count. The count is displayed in the middle.

When defining actions, you use the `@` symbol to denote an event listener. For example, `@click=${() => this.count++}` is an event listener that listens for a click event on the button, and increments the count. You will need to pass a callback function to the event listener.

If you don't use a callback (like `@click=${this.count++}`), then the event listener will be called immediately when the component is rendered, which is not what you want.

If you only want to display values, then you don't need to use a callback. For example, `Count: ${this.count}` will display the count value.

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="counter"></cami-demo-island></div>
</div>

## Page shell

```html
<article>
  <h1>Counter</h1>
  <cami-counter
  ></cami-counter>
</article>
<script type="module" src="./island.js"></script>

```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/counter.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/counter.ts"
    ```
