# Todo List (Server State)

This shows how to fetch and update data on a server. Loading, error, and success states are handled automatically.

The example uses shared tutorial data from `https://cami-api.exe.xyz`.

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="todos-server"></cami-demo-island></div>
</div>

## Page shell

```html
<article>
  <todo-list-server></todo-list-server>
</article>

<script src="https://unpkg.com/cami@0.4/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/todo_list_server.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/todo_list_server.ts"
    ```
