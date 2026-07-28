const { html, ReactiveElement } = cami
class DialogElement extends ReactiveElement {
    isOpen = false;
    lastFocusedElement = null;
    focusableElements = [];
    get dialog() {
        const dialog = this.querySelector('dialog');
        if (!dialog)
            throw new Error('Dialog markup has not rendered');
        return dialog;
    }
    openDialog() {
        this.isOpen = true;
        this.dialog.setAttribute('open', '');
        this.lastFocusedElement = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        this.focusFirstElement();
    }
    closeDialog() {
        this.isOpen = false;
        this.dialog.removeAttribute('open');
        this.lastFocusedElement?.focus();
    }
    focusFirstElement() {
        this.focusableElements = Array.from(this.dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        this.focusableElements[0]?.focus();
    }
    template() {
        return html `
      <aside @click=${() => this.closeDialog()} class="dialog__backdrop ${this.isOpen ? '' : 'dialog__backdrop--hidden'}">
        <dialog @click=${(event) => event.stopPropagation()} role="dialog" aria-modal=${this.isOpen} aria-labelledby="dialog-title">
          <article>
            <h2 id="dialog-title">Hi! I'm a Modal</h2>
            <label>Add Label Here <input></label>
            <button @click=${() => this.closeDialog()} aria-label="Close Modal">Close</button>
          </article>
        </dialog>
      </aside>
      <button @click=${() => this.openDialog()}>Show Modal</button>
    `;
    }
    onConnect() {
        this.addEventListener('keydown', (event) => {
            if (event.key === 'Escape')
                this.closeDialog();
            if (event.key !== 'Tab' || this.focusableElements.length === 0)
                return;
            const first = this.focusableElements[0];
            const last = this.focusableElements.at(-1);
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    }
}
customElements.define('cami-modal', DialogElement);
