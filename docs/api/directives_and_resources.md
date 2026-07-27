# Directives and resources

## `repeat(items, key, render)`

Renders a collection while preserving DOM identity by item key.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    repeat(rows, row => row.id, row => html`<tr><td>${row.name}</td></tr>`)
    ```

=== "TypeScript"

    ```typescript
    repeat(rows, (row: Row) => row.id, (row: Row) => html`<tr><td>${row.name}</td></tr>`)
    ```

## `keyed(key, template)`

Forces one template region to be replaced when its key changes. Use it when a new identity must reset DOM state.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    keyed(activeDocumentId, html`<document-editor .document=${document}></document-editor>`)
    ```

=== "TypeScript"

    ```typescript
    keyed(activeDocumentId, html`<document-editor .document=${document}></document-editor>`)
    ```

## `unsafeHTML(value)`

Renders a string as HTML. Only pass content that your application has already trusted or sanitized. Cami does not sanitize it.

## `useImage(element, src)`

Loads and decodes an image through the owning element's resource lifecycle.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const avatar = useImage(this, '/avatar.webp')
    ```

=== "TypeScript"

    ```typescript
    const avatar = useImage(this, '/avatar.webp')
    ```

It returns `Resource<ImageResource>`. Successful data contains `src`, `width`, and `height`. Cami cancels stale work when the owner disconnects or the request changes.

## `Resource<T>`

`Resource<T>` is a discriminated union keyed by `status`:

- `idle`, `loading`, or `refreshing` may contain previous data;
- `success` contains data;
- `error` contains an error and may contain previous data.

Use store queries for server data shared by several islands. Use a component resource for work owned by one element.
