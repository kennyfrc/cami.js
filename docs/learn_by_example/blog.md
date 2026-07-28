# Blog with Optimistic UI

This example shows optimistic UI—updating the interface immediately before the server responds, then rolling back if something goes wrong.

The example uses the public Cami mock API at `https://cami-api.exe.xyz`, not a production backend.

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="blog"></cami-demo-island></div>
</div>

## Page shell

```html
<article>
  <blog-component></blog-component>
</article>

<script src="https://unpkg.com/cami@0.4/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/blog.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/blog.ts"
    ```
