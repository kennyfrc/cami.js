# Directives and resources

## `keyedRepeat(items, key, render, options?)`

Renders a collection through lit-html's `repeat` directive. `key` must return a stable, non-empty string.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    keyedRepeat(rows, row => row.id, row => html`<tr><td>${row.name}</td></tr>`)
    ```

=== "TypeScript"

    ```typescript
    keyedRepeat(rows, row => row.id, row => html`<tr><td>${row.name}</td></tr>`)
    ```

Set `devAssertStable` to control key warnings. Debug mode enables warnings by default.

## `ref(target)`

Creates a lit-html ref directive. `target` is either `{ current: Element | null }` or a callback that receives the element and later `null`.

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const input = { current: null }
    html`<input ${ref(input)} />`
    ```

=== "TypeScript"

    ```typescript
    const input = { current: null }
    html`<input ${ref(input)} />`
    ```

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

It returns `Resource<ImageResource>`, where successful data contains `src`, `width`, and `height`.

## `Resource<T>`

A discriminated union keyed by `status`:

- `idle`, `loading`, or `refreshing`: optional previous `data`;
- `success`: required `data`;
- `error`: required `error` and optional previous `data`.

Every state also has a numeric `requestId`.

## Re-exported lit-html directives

Cami also exports `keyed`, `repeat`, and `unsafeHTML`. Only pass trusted or sanitized content to `unsafeHTML`.
