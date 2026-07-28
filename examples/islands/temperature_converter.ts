import { html, ReactiveElement } from 'cami'

class TemperatureConverterElement extends ReactiveElement {
  celsius: string = ''
  fahrenheit: string = ''

  convertToFahrenheit(celsius: string): void {
    const value = Number(celsius)
    if (celsius !== '' && Number.isFinite(value)) {
      this.fahrenheit = String(value * (9 / 5) + 32)
    }
  }

  convertToCelsius(fahrenheit: string): void {
    const value = Number(fahrenheit)
    if (fahrenheit !== '' && Number.isFinite(value)) {
      this.celsius = String((value - 32) * (5 / 9))
    }
  }

  template(): ReturnType<typeof html> {
    return html`
      <label>
        Celsius:
        <input type="number" .value=${this.celsius} @input=${(event: InputEvent) =>
          this.convertToFahrenheit((event.currentTarget as HTMLInputElement).value)}>
      </label>
      <label>
        Fahrenheit:
        <input type="number" .value=${this.fahrenheit} @input=${(event: InputEvent) =>
          this.convertToCelsius((event.currentTarget as HTMLInputElement).value)}>
      </label>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'temperature-converter': TemperatureConverterElement
  }
}

customElements.define('temperature-converter', TemperatureConverterElement)
