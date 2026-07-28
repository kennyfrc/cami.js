# Install and load Cami

Cami ships an IIFE bundle for direct browser use and an ES module for compiled projects. Pick one loading style per page.

Executable examples throughout these docs use linked **JavaScript** and **TypeScript** tabs. JavaScript appears first because a script tag is Cami's shortest path into an MPA. Select TypeScript once and every linked example switches with it.

The TypeScript worked examples are source files compiled with `strict: true`. They use concrete state interfaces and typed DOM events. They also type query results, mutation payloads, nullable values, and custom-element tag maps. A short expression can still match its JavaScript form when TypeScript infers the type.

## Package-based projects

Install the latest published package:

```bash
npm install cami@0.4.1
```

!!! note "Source and published versions"
    These docs follow the in-use `0.4.0` source snapshot. The latest package and CDN release is `0.3.23`. The source snapshot adds TypeScript declarations and newer APIs that will ship in a later release. To compile against this exact checkout, install it by local path in your application: `npm install /path/to/cami`.

<!-- cami-language-pair -->
=== "JavaScript"

    JavaScript uses the same ES module entry point without type annotations.

    ```javascript
    --8<-- "docs/examples/package-counter.js"
    ```

=== "TypeScript"

    TypeScript consumes Cami's exported declarations while your compiler or bundler emits browser JavaScript.

    ```typescript
    --8<-- "docs/examples/package-counter.ts"
    ```

Your HTML only needs the registered custom element:

```html
<package-counter></package-counter>
<script type="module" src="/assets/counter.js"></script>
```

The exact output path depends on your compiler or bundler.

## Direct CDN use

Use a pinned version in production. `@latest` can change behavior without a source change in your application.

=== "Global bundle"

    The IIFE bundle creates `window.cami`. This is the shortest no-build setup.

    ```html
    --8<-- "docs/examples/cdn-global-counter.html"
    ```

=== "ES module from CDN"

    Import the prebuilt module directly when you prefer standard module syntax.

    ```html
    --8<-- "docs/examples/cdn-module-counter.html"
    ```

Browsers do not execute TypeScript directly. A TypeScript project must compile its `.ts` source, even if the runtime dependency comes from a CDN or import map. The JavaScript emitted by that build uses the same Cami API shown above.

## Choose a bundle

| File | Format | Typical use |
| --- | --- | --- |
| `build/cami.module.js` | ES module | Bundlers, native module imports, CDN module imports |
| `build/cami.cdn.js` | IIFE global named `cami` | Plain script tags and no-build pages |

## Verify the load

In browser developer tools, check:

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    typeof customElements === 'object'
    typeof cami?.ReactiveElement === 'function' // global bundle only
    ```

=== "TypeScript"

    ```typescript
    typeof customElements === 'object'
    typeof cami?.ReactiveElement === 'function' // global bundle only
    ```

For an ES module import, a failed URL or export produces a console error before your component is registered.
