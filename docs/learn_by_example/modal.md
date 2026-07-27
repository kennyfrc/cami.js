# Modal

This is a [WAI-ARIA compliant](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) modal. It has the following interactions implemented:

- Escape key closes the modal
- Clicking outside the modal closes the modal
- Focus is trapped within the modal
- Maintains focus on the first focusable element within the modal
- Maintains focus on the modal when it is closed and re-opened

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="modal"></cami-demo-island></div>
</div>

## Page shell

```html
  <style>
    .dialog__backdrop {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black */
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .dialog__backdrop--hidden {
      display: none;
    }
  </style>
<cami-modal></cami-modal>
<!-- <script src="./build/cami.cdn.js"></script> -->
<!-- CDN version below -->
<script src="https://unpkg.com/cami@0.3.23/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/modal.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/modal.ts"
    ```
