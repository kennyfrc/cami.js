import { html, ReactiveElement } from 'cami'

class CounterElement extends ReactiveElement {
  count: number = 0

  template(): ReturnType<typeof html> {
    return html`
      <button @click=${() => this.count--}>-</button>
      <button @click=${() => this.count++}>+</button>
      <div>Count: ${this.count}</div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cami-counter': CounterElement
  }
}

customElements.define('cami-counter', CounterElement)
