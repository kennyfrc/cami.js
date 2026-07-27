# Contact Manager (In-Memory State)

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="contacts"></cami-demo-island></div>
</div>

## Page shell

```html
<article>
  <contact-manager></contact-manager>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@0.3.23/build/cami.cdn.js"></script> -->
<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 330px;
    margin: auto;
  }
  .input-group {
    margin-bottom: 10px;
  }
  .contact-list {
    display: grid;
    gap: 6px;
    margin-bottom: 10px;
    max-height: 180px;
    overflow: auto;
    border: 1px solid gray;
    padding: 6px;
  }
  .contact-list button[aria-selected="true"] {
    font-weight: 700;
    outline: 2px solid currentColor;
  }
  .button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .validation-error {
    border: 1px solid red;
    padding: 10px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .close-btn {
    cursor: pointer;
  }
</style>
<script type="module" src="./island.js"></script>

```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/contact_manager.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/contact_manager.ts"
    ```
