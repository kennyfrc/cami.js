import { html, ReactiveElement } from 'cami'

type FlightType = 'one-way flight' | 'return flight'

class FlightBookerElement extends ReactiveElement {
  flightType: FlightType = 'one-way flight'
  startDate: string = new Date().toISOString().split('T')[0]
  endDate: string = new Date().toISOString().split('T')[0]
  isButtonDisabled: boolean = false

  updateFlightType(event: Event): void {
    this.flightType = (event.currentTarget as HTMLSelectElement).value as FlightType
    this.checkButtonState()
  }

  updateStartDate(event: InputEvent): void {
    this.startDate = (event.currentTarget as HTMLInputElement).value
    this.checkButtonState()
  }

  updateEndDate(event: InputEvent): void {
    this.endDate = (event.currentTarget as HTMLInputElement).value
    this.checkButtonState()
  }

  checkButtonState(): void {
    this.isButtonDisabled = this.flightType === 'return flight'
      && new Date(this.startDate) > new Date(this.endDate)
  }

  bookFlight(): void {
    let message = `You have booked a ${this.flightType} on ${this.startDate}.`
    if (this.flightType === 'return flight') {
      message += ` Return on ${this.endDate}.`
    }
    alert(message)
  }

  template(): ReturnType<typeof html> {
    return html`
      <select .value=${this.flightType} @change=${(event: Event) => this.updateFlightType(event)}>
        <option>one-way flight</option>
        <option>return flight</option>
      </select>
      <input type="date" .value=${this.startDate} @input=${(event: InputEvent) => this.updateStartDate(event)}>
      <input type="date" .value=${this.endDate} @input=${(event: InputEvent) => this.updateEndDate(event)} ?disabled=${this.flightType === 'one-way flight'}>
      <button @click=${() => this.bookFlight()} ?disabled=${this.isButtonDisabled}>Book</button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'flight-booker': FlightBookerElement
  }
}

customElements.define('flight-booker', FlightBookerElement)
