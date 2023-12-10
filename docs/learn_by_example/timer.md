# Timer

<iframe width="100%" height="600" src="//jsfiddle.net/kennyfrc12/8far6vqm/19/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## HTML

```html
<timer-element></timer-element>

<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class TimerElement extends ReactiveElement {
    elapsedTime = 0;
    duration = 15;
    timer = null;

    onConnect() {
      this.startTimer();
    }

    startTimer() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.elapsedTime < this.duration) {
          this.elapsedTime += 0.1;
          if (this.elapsedTime > this.duration) {
            this.elapsedTime = this.duration;
          }
        }
        if (this.elapsedTime >= this.duration) {
          clearInterval(this.timer);
        }
      }, 100);
    }

    updateDuration(e) {
      this.duration = Number(e.target.value);
      if (this.elapsedTime < this.duration) {
        this.startTimer();
      } else {
        clearInterval(this.timer);
      }
    }

    resetTimer() {
      clearInterval(this.timer);
      this.elapsedTime = 0;
      this.startTimer();
    }

    template() {
      return html`
        <label>Elapsed Time: ${this.elapsedTime.toFixed(1)} seconds</label>
        <progress value=${this.elapsedTime} max=${this.duration}></progress>
        <label>Max Duration: ${this.duration} seconds</label>
        <input type="range" min="0" max="30" .value=${this.duration} @input=${(e) => this.updateDuration(e)}>
        <button @click=${() => this.resetTimer()}>Reset</button>
      `;
    }
  }

  customElements.define('timer-element', TimerElement);
</script>

```
