# Simple Counter

<article>
  <counter-component-be
  ></counter-component-be>
</article>
<script type="module">
  const { html, ReactiveElement } = cami;

  class CounterElement extends ReactiveElement {
    count = 0

    template() {
      return html`
        <button class="md-button" @click=${() => this.count--}>-</button>
        <button class="md-button" @click=${() => this.count++}>+</button>
        <div>Count: ${this.count}</div>
      `;
    }
  }

  customElements.define('counter-component-be', CounterElement);
</script>

### HTML

```html
<article>
  <h1>Counter</h1>
  <counter-component-be
  ></counter-component-be>
</article>
<script type="module">
  const { html, ReactiveElement } = cami;

  class CounterElement extends ReactiveElement {
    count = 0

    template() {
      return html`
        <button class="md-button" @click=${() => this.count--}>-</button>
        <button class="md-button" @click=${() => this.count++}>+</button>
        <div>Count: ${this.count}</div>
      `;
    }
  }

  customElements.define('counter-component-be', CounterElement);
</script>

```
