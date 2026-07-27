import { html, ReactiveElement } from 'cami'

class TimerElement extends ReactiveElement {
  elapsedTime: number = 0
  duration: number = 15
  private timer: ReturnType<typeof setInterval> | undefined

  onConnect(): void {
    this.startTimer()
  }

  onDisconnect(): void {
    if (this.timer !== undefined) clearInterval(this.timer)
  }

  startTimer(): void {
    if (this.timer !== undefined) clearInterval(this.timer)
    this.timer = setInterval(() => {
      if (this.elapsedTime < this.duration) {
        this.elapsedTime = Math.min(this.elapsedTime + 0.1, this.duration)
      }
      if (this.elapsedTime >= this.duration && this.timer !== undefined) {
        clearInterval(this.timer)
        this.timer = undefined
      }
    }, 100)
  }

  updateDuration(event: InputEvent): void {
    this.duration = Number((event.currentTarget as HTMLInputElement).value)
    if (this.elapsedTime < this.duration) {
      this.startTimer()
    } else if (this.timer !== undefined) {
      clearInterval(this.timer)
      this.timer = undefined
    }
  }

  resetTimer(): void {
    this.elapsedTime = 0
    this.startTimer()
  }

  template(): ReturnType<typeof html> {
    return html`
      <label>Elapsed Time: ${this.elapsedTime.toFixed(1)} seconds</label>
      <progress value=${this.elapsedTime} max=${this.duration}></progress>
      <label>Max Duration: ${this.duration} seconds</label>
      <input type="range" min="0" max="30" .value=${String(this.duration)} @input=${(event: InputEvent) => this.updateDuration(event)}>
      <button @click=${() => this.resetTimer()}>Reset</button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'timer-element': TimerElement
  }
}

customElements.define('timer-element', TimerElement)
