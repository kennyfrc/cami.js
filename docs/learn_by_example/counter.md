# Counter (Simple)

This demonstrates a simple counter component. It has two buttons, one to increment the count and one to decrement the count. The count is displayed in the middle.

When defining actions, you use the `@` symbol to denote an event listener. For example, `@click=${() => this.count++}` is an event listener that listens for a click event on the button, and increments the count. You will need to pass a callback function to the event listener.

If you don't use a callback (like `@click=${this.count++}`), then the event listener will be called immediately when the component is rendered, which is not what you want.

If you only want to display values, then you don't need to use a callback. For example, `Count: ${this.count}` will display the count value.

<iframe width="100%" height="500" src="//jsfiddle.net/kennyfrc12/69w128vd/13/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## HTML

```html
<article>
  <h1>Counter</h1>
  <cami-counter
  ></cami-counter>
</article>
<script type="module">
  const { html, ReactiveElement } = cami;

  class CounterElement extends ReactiveElement {
    count = 0

    template() {
      return html`
        <button @click=${() => this.count--}>-</button>
        <button @click=${() => this.count++}>+</button>
        <div>Count: ${this.count}</div>
      `;
    }
  }

  customElements.define('cami-counter', CounterElement);
</script>

```
