# Popover

This inherits from the [Modal](modal.md) component, so it has all the same features, but it's a bit more complex as it has to position itself relative to the element that triggered it.

This also demonstrates how you'd want to build & reuse components. The `DemoPopoverElement` defines just the properties you'd want: the reference element, the placement, and the template.

It inherits from `ReactivePopoverElement`, which has all the logic for positioning the popover relative to the reference element. And this inherits from `ReactiveModalElement`, which has all the logic for the modal behavior & accessibility.

Note that if you want a background click to close the popover, you'll need to define a backdrop `div` and add a click handler to it that calls `this.closeDialog()`. See the [Modal](modal.md) component for an example.

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="popover"></cami-demo-island></div>
</div>

## Page shell

```html
<h1>Popover</h1>
<p>When you click on either the top / bottom / left / right buttons, a popover will appear in the corresponding position against the reference element.</p>
<cami-popover></cami-popover>
<style>
  h1, p {
    text-align: center;
  }
  .popover__backdrop { // unused in this example
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popover__backdrop--hidden { // unused in this example
    display: none;
  }
</style>
<!--  --><script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<script src="https://unpkg.com/cami@0.3.5/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/popover.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/popover.ts"
    ```
