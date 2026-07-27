const { html, ReactiveElement } = cami
class ReactiveModalElement extends ReactiveElement {
    isOpen = false;
    lastFocusedElement = null;
    openDialog() {
        this.lastFocusedElement = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        this.isOpen = true;
    }
    closeDialog() {
        this.isOpen = false;
        this.lastFocusedElement?.focus();
    }
    onConnect() {
        this.addEventListener('keydown', (event) => {
            if (event.key === 'Escape')
                this.closeDialog();
        });
    }
}
class ReactivePopoverElement extends ReactiveModalElement {
    placement = 'top';
    anchor = null;
    openAt(anchor, placement) {
        this.anchor = anchor;
        this.placement = placement;
        this.openDialog();
    }
    get positionStyle() {
        if (!this.anchor)
            return '';
        const anchor = this.anchor.getBoundingClientRect();
        const gap = 8;
        const positions = {
            top: { left: anchor.left + anchor.width / 2, top: anchor.top - gap, transform: 'translate(-50%, -100%)' },
            right: { left: anchor.right + gap, top: anchor.top + anchor.height / 2, transform: 'translateY(-50%)' },
            bottom: { left: anchor.left + anchor.width / 2, top: anchor.bottom + gap, transform: 'translateX(-50%)' },
            left: { left: anchor.left - gap, top: anchor.top + anchor.height / 2, transform: 'translate(-100%, -50%)' },
        };
        const position = positions[this.placement];
        return `position:fixed;left:${position.left}px;top:${position.top}px;transform:${position.transform}`;
    }
}
class DemoPopoverElement extends ReactivePopoverElement {
    show(event, placement) {
        this.openAt(event.currentTarget, placement);
    }
    template() {
        return html `
      <div class="popover-controls">
        ${['top', 'right', 'bottom', 'left'].map((placement) => html `
          <button @click=${(event) => this.show(event, placement)}>${placement}</button>
        `)}
      </div>
      ${this.isOpen ? html `
        <aside class="popover" role="dialog" style=${this.positionStyle}>
          <p>Placed ${this.placement}</p>
          <button @click=${() => this.closeDialog()}>Close</button>
        </aside>
      ` : ''}
    `;
    }
}
customElements.define('cami-popover', DemoPopoverElement);
