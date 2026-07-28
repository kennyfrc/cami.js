# Cart with Server & Client State

This example shows how to build a shopping cart that fetches products from an API, manages cart state across components, and uses middleware for logging.

Product data comes from the public Cami mock API at `https://cami-api.exe.xyz`.

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="cart"></cami-demo-island></div>
</div>

## Page shell

```html
<article>
  <h2>Products</h2>
  <product-list-component></product-list-component>
</article>
<article>
  <h2>Cart</h2>
  <cart-component></cart-component>
</article>

<script src="https://unpkg.com/cami@0.4.1/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/cart.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/cart.ts"
    ```
