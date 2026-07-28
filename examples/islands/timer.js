const { html, ReactiveElement } = cami
class TimerElement extends ReactiveElement {
    elapsedTime = 0;
    duration = 15;
    timer;
    onConnect() {
        this.startTimer();
    }
    onDisconnect() {
        if (this.timer !== undefined)
            clearInterval(this.timer);
    }
    startTimer() {
        if (this.timer !== undefined)
            clearInterval(this.timer);
        this.timer = setInterval(() => {
            if (this.elapsedTime < this.duration) {
                this.elapsedTime = Math.min(this.elapsedTime + 0.1, this.duration);
            }
            if (this.elapsedTime >= this.duration && this.timer !== undefined) {
                clearInterval(this.timer);
                this.timer = undefined;
            }
        }, 100);
    }
    updateDuration(event) {
        this.duration = Number(event.currentTarget.value);
        if (this.elapsedTime < this.duration) {
            this.startTimer();
        }
        else if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
    resetTimer() {
        this.elapsedTime = 0;
        this.startTimer();
    }
    template() {
        return html `
      <label>Elapsed Time: ${this.elapsedTime.toFixed(1)} seconds</label>
      <progress value=${this.elapsedTime} max=${this.duration}></progress>
      <label>Max Duration: ${this.duration} seconds</label>
      <input type="range" min="0" max="30" .value=${String(this.duration)} @input=${(event) => this.updateDuration(event)}>
      <button @click=${() => this.resetTimer()}>Reset</button>
    `;
    }
}
customElements.define('timer-element', TimerElement);
