# Interactive Registration

This example shows async form validation with debounced input—checking email availability against an API as the user types.

Email lookups use `https://cami-api.exe.xyz`. Try `user1@example.com` to exercise the existing-user path.

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="form"></cami-demo-island></div>
</div>

## Page shell

```html
<article>
  <small>Try entering an email that is already taken, such as user1@example.com</small>
  <registration-form></registration-form>
</article>

<script src="https://unpkg.com/cami@0.3.23/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/form_validation.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/form_validation.ts"
    ```
