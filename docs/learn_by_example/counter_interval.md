# Counter (Interval)

This interval counter demonstrates how you might want to use formulas and effects. Here, we have a `count` variable that is then used to define a `doubleCount` getter method. If you're coming from other frameworks, this is similar to a computed property.

Similarly, we have two effects that are run whenever `count` changes. An `effect` is a method that is run whenever an observed property is changed. In this case, we have two effects that are run whenever `count` changes. The first effect logs the `count` value, and the second effect logs the `doubleCount` value.

`Effects` are observer methods, which track the changes in the observed properties. If you're coming from other frameworks, this is similar to a `watcher` or `autorun`. Under the hood, Cami uses `effect` to render the template whenever the observed properties in the `template` method change.

<iframe width="100%" height="200" src="//jsfiddle.net/kennyfrc12/cdzhtpLf/7/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## HTML:

```html
<article>
  <h1>Counter with Interval</h1>
  <counter-component></counter-component>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

class CounterElement extends ReactiveElement {
  count = 0;

  get doubleCount() {
    return this.count * 2;
  }

  onConnect() {
    setInterval(() => this.count++, 1000);
    this.effect(() => console.log(`Count: ${this.count}`));
    this.effect(() => console.log(`Double Count: ${this.doubleCount}`));
  }

  template() {
    return html`
      <div>Double Count: ${this.doubleCount}</div>
    `;
  }
}

customElements.define('counter-component', CounterElement);
</script>
```
