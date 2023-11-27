# Counter with Interval

For formulas (e.g. doubling), it's best to use getter methods. If you're familiar with `computeds`, I'd say that this functions in a similar way, where the `doubleCount` variable is updated lazily.

This also demonstrates effects, which you can see in the console.

<hr>

<article>
  <counter-interval-be></counter-interval-be>
</article>
<script type="module">
  const { html, ReactiveElement } = cami;

class CounterElement extends ReactiveElement {
  count = 0;

  get doubleCount() {
    return this.count * 2;
  }

  onConnect() {
    setInterval(() => this.count++, 1000);
    this.effect(() => {
      console.log(`Count: ${this.count}`);
    });
    this.effect(() => {
      console.log(`Double Count: ${this.doubleCount}`);
    });
  }

  template() {
    return html`
      <div>Double Count: ${this.doubleCount}</div>
    `;
  }
}

customElements.define('counter-interval-be', CounterElement);
</script>


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
    this.effect(() => {
      console.log(`Count: ${this.count}`);
    });
    this.effect(() => {
      console.log(`Double Count: ${this.doubleCount}`);
    });
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
