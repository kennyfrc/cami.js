# Todo List (Attribute Data)

This is useful when you render an HTML page using a server template engine like Handlebars, ERB, or Jinja. You can pass data from the server to the client using attributes upon page load. Alternatively, you can also pass data asynchronously (see Todo List - Server State).

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="todos-attributes"></cami-demo-island></div>
</div>

## Page shell

```html
<cami-todo-list-from-attributes
    todos='{"data": ["Buy milk", "Buy eggs", "Buy bread"]}'
  ></cami-todo-list-from-attributes>
</article>
<!-- <script src="./build/cami.cdn.js"></script> -->
<!-- CDN version below -->
<script src="https://unpkg.com/cami@0.4.1/build/cami.cdn.js"></script>
<script type="module" src="./island.js"></script>
```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/todo_list_attributes.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/todo_list_attributes.ts"
    ```
