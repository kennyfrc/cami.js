import { html, ReactiveElement } from 'cami'

class PackageCounter extends ReactiveElement {
  count: number = 0

  template(): ReturnType<typeof html> {
    return html`
      <button @click=${() => this.count--}>−</button>
      <output>${this.count}</output>
      <button @click=${() => this.count++}>+</button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'package-counter': PackageCounter
  }
}

customElements.define('package-counter', PackageCounter)
