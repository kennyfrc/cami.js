# Nested Updates

For deeply nested data, you can use the `update` method to update it. By default, other mutations available in Cami such as `push`, `assign`, setter methods, and others can only update the top level of an object.

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="nested"></cami-demo-island></div>
</div>

## Page shell

```html
<article>
  <h5>User Info with Deeply Nested Data</h5>
  <nested-data-be></nested-data-be>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@0.3.23/build/cami.cdn.js"></script> -->
<script type="module" src="./island.js"></script>

```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/nested_updates.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/nested_updates.ts"
    ```
