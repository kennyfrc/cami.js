const { html, ReactiveElement } = cami
class TemperatureConverterElement extends ReactiveElement {
    celsius = '';
    fahrenheit = '';
    convertToFahrenheit(celsius) {
        const value = Number(celsius);
        if (celsius !== '' && Number.isFinite(value)) {
            this.fahrenheit = String(value * (9 / 5) + 32);
        }
    }
    convertToCelsius(fahrenheit) {
        const value = Number(fahrenheit);
        if (fahrenheit !== '' && Number.isFinite(value)) {
            this.celsius = String((value - 32) * (5 / 9));
        }
    }
    template() {
        return html `
      <label>
        Celsius:
        <input type="number" .value=${this.celsius} @input=${(event) => this.convertToFahrenheit(event.currentTarget.value)}>
      </label>
      <label>
        Fahrenheit:
        <input type="number" .value=${this.fahrenheit} @input=${(event) => this.convertToCelsius(event.currentTarget.value)}>
      </label>
    `;
    }
}
customElements.define('temperature-converter', TemperatureConverterElement);
