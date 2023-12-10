# Temperature Converter

<iframe width="100%" height="500" src="//jsfiddle.net/kennyfrc12/q9ajzdu7/5/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## HTML

```html
<article>
  <h1>Temperature Converter</h1>
  <temperature-converter></temperature-converter>
</article>
<script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script>
<script type="module">
  const { html, ReactiveElement } = cami;

  class TemperatureConverterElement extends ReactiveElement {
    celsius = '';
    fahrenheit = '';

    convertToFahrenheit(celsius) {
      if (!isNaN(celsius) && celsius !== '') {
        this.fahrenheit = celsius * (9/5) + 32;
      }
    }

    convertToCelsius(fahrenheit) {
      if (!isNaN(fahrenheit) && fahrenheit !== '') {
        this.celsius = (fahrenheit - 32) * (5/9);
      }
    }

    template() {
      return html`
        <label>
          Celsius:
          <input type="number" .value=${this.celsius} @input=${(e) => this.convertToFahrenheit(e.target.value)}>
        </label>
        <label>
          Fahrenheit:
          <input type="number" .value=${this.fahrenheit} @input=${(e) => this.convertToCelsius(e.target.value)}>
        </label>
      `;
    }
  }

  customElements.define('temperature-converter', TemperatureConverterElement);
</script>

```
