# Anchored Popover

Similar to the [Popover](popover.md) component, but this one is anchored to a virtual reference element. This is used in features such as floating toolbars.

Here, you'll need to create a virtual element because text selection and mouse coordinates don't have a DOM element associated with them. So you'll need to create a virtual element that responds to `getBoundingClientRect()`, retrieve the coordinates of the selection or mouse coordinates, and then position the popover relative to that.

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="anchored-popover"></cami-demo-island></div>
</div>

## Page shell

```html
<h1>Anchored Popover</h1>
<p>An anchored popover relative to any coordinate. In this example, we're usign the mouse position as the reference element.</p>
<cami-anchored-popover></cami-anchored-popover>
<style>
  h1, p {
    text-align: center;
  }
  .popover__backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popover__backdrop--hidden {
    display: none;
  }
</style>
<!-- <script src="./build/cami.cdn.js"></script> -->
<!-- CDN version below -->
<script src="https://unpkg.com/cami@0.4.1/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/anchored_popover.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/anchored_popover.ts"
    ```
