import { html, ReactiveElement } from 'cami'

class CounterElement extends ReactiveElement {
  count: number = 0
  private timer: ReturnType<typeof setInterval> | undefined

  get doubleCount(): number {
    return this.count * 2
  }

  onConnect(): void {
    this.timer = setInterval(() => this.count++, 1000)
    this.effect(() => console.log(`Count: ${this.count}`))
    this.effect(() => console.log(`Double Count: ${this.doubleCount}`))
  }

  onDisconnect(): void {
    if (this.timer !== undefined) clearInterval(this.timer)
  }

  template(): ReturnType<typeof html> {
    return html`<div>Double Count: ${this.doubleCount}</div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'counter-component': CounterElement
  }
}

customElements.define('counter-component', CounterElement)
