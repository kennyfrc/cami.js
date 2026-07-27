const { html, ReactiveElement } = cami
class FlightBookerElement extends ReactiveElement {
    flightType = 'one-way flight';
    startDate = new Date().toISOString().split('T')[0];
    endDate = new Date().toISOString().split('T')[0];
    isButtonDisabled = false;
    updateFlightType(event) {
        this.flightType = event.currentTarget.value;
        this.checkButtonState();
    }
    updateStartDate(event) {
        this.startDate = event.currentTarget.value;
        this.checkButtonState();
    }
    updateEndDate(event) {
        this.endDate = event.currentTarget.value;
        this.checkButtonState();
    }
    checkButtonState() {
        this.isButtonDisabled = this.flightType === 'return flight'
            && new Date(this.startDate) > new Date(this.endDate);
    }
    bookFlight() {
        let message = `You have booked a ${this.flightType} on ${this.startDate}.`;
        if (this.flightType === 'return flight') {
            message += ` Return on ${this.endDate}.`;
        }
        alert(message);
    }
    template() {
        return html `
      <select .value=${this.flightType} @change=${(event) => this.updateFlightType(event)}>
        <option>one-way flight</option>
        <option>return flight</option>
      </select>
      <input type="date" .value=${this.startDate} @input=${(event) => this.updateStartDate(event)}>
      <input type="date" .value=${this.endDate} @input=${(event) => this.updateEndDate(event)} ?disabled=${this.flightType === 'one-way flight'}>
      <button @click=${() => this.bookFlight()} ?disabled=${this.isButtonDisabled}>Book</button>
    `;
    }
}
customElements.define('flight-booker', FlightBookerElement);
