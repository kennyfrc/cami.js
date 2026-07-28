# Counter (Interval)

This interval counter demonstrates how you might want to use formulas and effects. Here, we have a `count` variable that is then used to define a `doubleCount` getter method. If you're coming from other frameworks, this is similar to a computed property.

Similarly, we have two effects that are run whenever `count` changes. An `effect` is a method that is run whenever an observed property is changed. In this case, we have two effects that are run whenever `count` changes. The first effect logs the `count` value, and the second effect logs the `doubleCount` value.

`Effects` are observer methods, which track the changes in the observed properties. If you're coming from other frameworks, this is similar to a `watcher` or `autorun`. Under the hood, Cami uses `effect` to render the template whenever the observed properties in the `template` method change.

<div class="cami-live-example">
  <div class="cami-live-example__header"><span class="cami-live-example__label">Live island</span><span class="cami-live-example__note">Runs locally in this page</span></div>
  <div class="cami-live-example__stage"><cami-demo-island kind="counter-interval"></cami-demo-island></div>
</div>

## Page shell

```html
<article>
  <h1>Counter with Interval</h1>
  <counter-component></counter-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@0.4/build/cami.cdn.js"></script> -->
<script type="module" src="./island.js"></script>
```

## Island source

<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    --8<-- "docs/examples/islands/counter_interval.js"
    ```

=== "TypeScript"

    ```typescript
    --8<-- "docs/examples/islands/counter_interval.ts"
    ```
