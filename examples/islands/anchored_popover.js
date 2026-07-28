const { html, ReactiveElement } = cami
class AnchoredPopoverElement extends ReactiveElement {
    isOpen = false;
    point = { x: 0, y: 0 };
    anchor = null;
    openAt(point) {
        this.point = point;
        this.anchor = {
            getBoundingClientRect: () => new DOMRect(point.x, point.y, 0, 0),
        };
        this.isOpen = true;
    }
    close() {
        this.isOpen = false;
        this.anchor = null;
    }
    handlePointerMove(event) {
        this.point = { x: event.clientX, y: event.clientY };
    }
    handlePointerDown(event) {
        this.openAt({ x: event.clientX, y: event.clientY });
    }
    get positionStyle() {
        const rect = this.anchor?.getBoundingClientRect();
        if (!rect)
            return '';
        return `position:fixed;left:${rect.x}px;top:${rect.y - 8}px;transform:translate(-50%, -100%)`;
    }
    template() {
        return html `
      <section
        class="anchor-surface"
        @pointermove=${(event) => this.handlePointerMove(event)}
        @pointerdown=${(event) => this.handlePointerDown(event)}
      >
        Click anywhere to anchor the popover. Pointer: ${this.point.x}, ${this.point.y}
      </section>
      ${this.isOpen ? html `
        <aside role="dialog" class="popover" style=${this.positionStyle}>
          <p>Virtual anchor at ${this.point.x}, ${this.point.y}</p>
          <button @click=${() => this.close()}>Close</button>
        </aside>
      ` : ''}
    `;
    }
}
customElements.define('cami-anchored-popover', AnchoredPopoverElement);
