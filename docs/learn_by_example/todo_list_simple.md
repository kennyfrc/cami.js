# Todo List (In-Memory State)

A simple example to help you get the basics. In practice, you'd want to persist the data. See [Todo List - Server State](todo_list_server.md) for an example of how to retrieve from & mutate to a server.

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="todos"></cami-demo-island></div>
</div>

## Page shell

```html
<article>
  <cami-todo-list-simple></cami-todo-list-simple>
</article>
<script type="module" src="./island.js"></script>

```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/todo_list_simple.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/todo_list_simple.ts"
    ```
