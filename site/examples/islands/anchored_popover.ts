import { html, ReactiveElement } from 'cami'

interface Point {
  x: number
  y: number
}

interface VirtualAnchor {
  getBoundingClientRect(): DOMRect
}

class AnchoredPopoverElement extends ReactiveElement {
  isOpen: boolean = false
  point: Point = { x: 0, y: 0 }
  anchor: VirtualAnchor | null = null

  openAt(point: Point): void {
    this.point = point
    this.anchor = {
      getBoundingClientRect: (): DOMRect => new DOMRect(point.x, point.y, 0, 0),
    }
    this.isOpen = true
  }

  close(): void {
    this.isOpen = false
    this.anchor = null
  }

  handlePointerMove(event: PointerEvent): void {
    this.point = { x: event.clientX, y: event.clientY }
  }

  handlePointerDown(event: PointerEvent): void {
    this.openAt({ x: event.clientX, y: event.clientY })
  }

  get positionStyle(): string {
    const rect = this.anchor?.getBoundingClientRect()
    if (!rect) return ''
    return `position:fixed;left:${rect.x}px;top:${rect.y - 8}px;transform:translate(-50%, -100%)`
  }

  template(): ReturnType<typeof html> {
    return html`
      <section
        class="anchor-surface"
        @pointermove=${(event: PointerEvent) => this.handlePointerMove(event)}
        @pointerdown=${(event: PointerEvent) => this.handlePointerDown(event)}
      >
        Click anywhere to anchor the popover. Pointer: ${this.point.x}, ${this.point.y}
      </section>
      ${this.isOpen ? html`
        <aside role="dialog" class="popover" style=${this.positionStyle}>
          <p>Virtual anchor at ${this.point.x}, ${this.point.y}</p>
          <button @click=${() => this.close()}>Close</button>
        </aside>
      ` : ''}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cami-anchored-popover': AnchoredPopoverElement
  }
}

customElements.define('cami-anchored-popover', AnchoredPopoverElement)
