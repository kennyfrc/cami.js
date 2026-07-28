import { html, ReactiveElement } from 'cami'

class PackageCounter extends ReactiveElement {
  count = 0

  template() {
    return html`
      <button @click=${() => this.count--}>−</button>
      <output>${this.count}</output>
      <button @click=${() => this.count++}>+</button>
    `
  }
}

customElements.define('package-counter', PackageCounter)
