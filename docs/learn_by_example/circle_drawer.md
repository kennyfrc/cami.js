# Circle Drawer

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="circles"></cami-demo-island></div>
</div>


## Page shell

```html
<article>
  <h1 style="text-align: center; margin-bottom: 5px;"
  >Circle Drawer</h1>
  <circle-drawer></circle-drawer>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@0.3.23/build/cami.cdn.js"></script> -->
<style>
  .circle-drawer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
  }
  .button-group {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .canvas-container {
    width: 500px;
    height: 400px;
    border: 1px solid black;
    position: relative;
  }
</style>
<script type="module" src="./island.js"></script>
```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/circle_drawer.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/circle_drawer.ts"
    ```
