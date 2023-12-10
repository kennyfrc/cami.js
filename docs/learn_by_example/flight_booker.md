# Flight Booker

<iframe width="100%" height="600" src="//jsfiddle.net/kennyfrc12/9sLb6dfu/3/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## HTML

```html
<flight-booker></flight-booker>

<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class FlightBookerElement extends ReactiveElement {
    flightType = 'one-way flight';
    startDate = new Date().toISOString().split('T')[0];
    endDate = new Date().toISOString().split('T')[0];
    isButtonDisabled = false;

    updateFlightType(e) {
      this.flightType = e.target.value;
      this.checkButtonState();
    }

    updateStartDate(e) {
      this.startDate = e.target.value;
      this.checkButtonState();
    }

    updateEndDate(e) {
      this.endDate = e.target.value;
      this.checkButtonState();
    }

    checkButtonState() {
      if (this.flightType === 'return flight' && new Date(this.startDate) > new Date(this.endDate)) {
        this.isButtonDisabled = true;
      } else {
        this.isButtonDisabled = false;
      }
    }

    bookFlight() {
      let message = `You have booked a ${this.flightType} on ${this.startDate}.`;
      if (this.flightType === 'return flight') {
        message += ` Return on ${this.endDate}.`;
      }
      alert(message);
    }

    template() {
      return html`
        <select .value=${this.flightType} @change=${(e) => this.updateFlightType(e)}>
          <option>one-way flight</option>
          <option>return flight</option>
        </select>
        <input type="date" .value=${this.startDate} @input=${(e) => this.updateStartDate(e)}>
        <input type="date" .value=${this.endDate} @input=${(e) => this.updateEndDate(e)} ?disabled=${this.flightType === 'one-way flight'}>
        <button @click=${() => this.bookFlight()} ?disabled=${this.isButtonDisabled}>Book</button>
      `;
    }
  }

  customElements.define('flight-booker', FlightBookerElement);
</script>

```
