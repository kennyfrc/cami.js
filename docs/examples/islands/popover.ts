import { html, ReactiveElement } from 'cami'

type Placement = 'top' | 'right' | 'bottom' | 'left'

class ReactiveModalElement extends ReactiveElement {
  isOpen: boolean = false
  private lastFocusedElement: HTMLElement | null = null

  openDialog(): void {
    this.lastFocusedElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    this.isOpen = true
  }

  closeDialog(): void {
    this.isOpen = false
    this.lastFocusedElement?.focus()
  }

  onConnect(): void {
    this.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') this.closeDialog()
    })
  }
}

class ReactivePopoverElement extends ReactiveModalElement {
  placement: Placement = 'top'
  anchor: HTMLElement | null = null

  openAt(anchor: HTMLElement, placement: Placement): void {
    this.anchor = anchor
    this.placement = placement
    this.openDialog()
  }

  get positionStyle(): string {
    if (!this.anchor) return ''
    const anchor = this.anchor.getBoundingClientRect()
    const gap = 8
    const positions: Record<Placement, { left: number; top: number; transform: string }> = {
      top: { left: anchor.left + anchor.width / 2, top: anchor.top - gap, transform: 'translate(-50%, -100%)' },
      right: { left: anchor.right + gap, top: anchor.top + anchor.height / 2, transform: 'translateY(-50%)' },
      bottom: { left: anchor.left + anchor.width / 2, top: anchor.bottom + gap, transform: 'translateX(-50%)' },
      left: { left: anchor.left - gap, top: anchor.top + anchor.height / 2, transform: 'translate(-100%, -50%)' },
    }
    const position = positions[this.placement]
    return `position:fixed;left:${position.left}px;top:${position.top}px;transform:${position.transform}`
  }
}

class DemoPopoverElement extends ReactivePopoverElement {
  show(event: MouseEvent, placement: Placement): void {
    this.openAt(event.currentTarget as HTMLButtonElement, placement)
  }

  template(): ReturnType<typeof html> {
    return html`
      <div class="popover-controls">
        ${(['top', 'right', 'bottom', 'left'] as const).map((placement: Placement) => html`
          <button @click=${(event: MouseEvent) => this.show(event, placement)}>${placement}</button>
        `)}
      </div>
      ${this.isOpen ? html`
        <aside class="popover" role="dialog" style=${this.positionStyle}>
          <p>Placed ${this.placement}</p>
          <button @click=${() => this.closeDialog()}>Close</button>
        </aside>
      ` : ''}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cami-popover': DemoPopoverElement
  }
}

customElements.define('cami-popover', DemoPopoverElement)
