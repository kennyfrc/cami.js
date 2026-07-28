const { html, ReactiveElement } = cami
class CircleDrawerElement extends ReactiveElement {
    circles = [];
    history = [[]];
    historyIndex = 0;
    addCircle(event) {
        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const circle = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            radius: 25,
            color: 'white',
            borderColor: 'black',
        };
        this.circles = [...this.circles, circle];
        this.commitHistory();
    }
    setCircleColor(index, color) {
        this.circles = this.circles.map((circle, circleIndex) => circleIndex === index ? { ...circle, color } : circle);
    }
    commitHistory() {
        this.history = [...this.history.slice(0, this.historyIndex + 1), structuredClone(this.circles)];
        this.historyIndex += 1;
    }
    undo() {
        if (this.historyIndex === 0)
            return;
        this.historyIndex -= 1;
        this.circles = structuredClone(this.history[this.historyIndex]);
    }
    redo() {
        if (this.historyIndex >= this.history.length - 1)
            return;
        this.historyIndex += 1;
        this.circles = structuredClone(this.history[this.historyIndex]);
    }
    template() {
        return html `
      <main class="circle-drawer-container">
        <section class="button-group">
          <button @click=${() => this.undo()} ?disabled=${this.historyIndex === 0}>Undo</button>
          <button @click=${() => this.redo()} ?disabled=${this.historyIndex === this.history.length - 1}>Redo</button>
        </section>
        <section class="canvas-container" @click=${(event) => this.addCircle(event)}>
          ${this.circles.map((circle, index) => html `
            <span
              role="img"
              aria-label="circle"
              style=${`position:absolute;left:${circle.x - circle.radius}px;top:${circle.y - circle.radius}px;width:${circle.radius * 2}px;height:${circle.radius * 2}px;border-radius:50%;background:${circle.color};border:1px solid ${circle.borderColor}`}
              @mouseover=${() => this.setCircleColor(index, 'gray')}
              @mouseout=${() => this.setCircleColor(index, 'white')}
            ></span>
          `)}
        </section>
      </main>
    `;
    }
}
customElements.define('circle-drawer', CircleDrawerElement);
