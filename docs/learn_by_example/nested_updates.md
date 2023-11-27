# Nested Updates

For deeply nested data, you can use the `update` method to update the data. This is useful for when you want to update a deeply nested property, but don't want to have to reassign the entire object.

<hr>

<article>
  <h5>User Info with Deeply Nested Data</h5>
  <nested-data-be></nested-data-be>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class NestedObservableElement extends ReactiveElement {
    user = {
      name: 'John',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        country: 'USA',
        postalCode: '12345',
        coordinates: {
          lat: '40.7128',
          long: '74.0060'
        }
      }
    };

    changeUser() {
      const john = {
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Anytown',
          country: 'USA',
          postalCode: '12345',
          coordinates: {
            lat: '40.7128',
            long: '74.0060'
          }
        }
      };

      const jane = {
        name: 'Jane',
        age: 31,
        address: {
          street: '456 Elm St',
          city: 'Othertown',
          country: 'Canada',
          postalCode: '67890',
          coordinates: {
            lat: '51.5074',
            long: '0.1278'
          }
        }
      };

      this.user = (this.user.name == 'John') ? jane : john;
    }

    changeName() {
      this.user.update(user => {
        user.name = (user.name == 'John') ? 'Jane' : 'John';
      });
    }

    changeStreet() {
      this.user.update(user => {
        user.address.street = (user.address.street == '123 Main St') ? '456 Elm St' : '123 Main St';
      });
    }

    changeLat() {
      this.user.update(user => {
        user.address.coordinates.lat = (user.address.coordinates.lat == '40.7128') ? '51.5074' : '40.7128';
      });
    }

    template() {
      return html`
        <div class="md-typography--body1">Name: ${this.user.name}</div>
        <div class="md-typography--body1">Street: ${this.user.address.street}</div>
        <div class="md-typography--body1">Latitude: ${this.user.address.coordinates.lat}</div>
        <button class="md-button" @click=${() => this.changeUser()}>Change User</button>
        <button class="md-button" @click=${() => this.changeName()}>Change Name</button>
        <button class="md-button" @click=${() => this.changeStreet()}>Change Street</button>
        <button class="md-button" @click=${() => this.changeLat()}>Change Latitude</button>
      `;
    }
  }

  customElements.define('nested-data-be', NestedObservableElement);
</script>


HTML:

```html
<article>
  <h5>User Info with Deeply Nested Data</h5>
  <nested-data-be></nested-data-be>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class NestedObservableElement extends ReactiveElement {
    user = {
      name: 'John',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        country: 'USA',
        postalCode: '12345',
        coordinates: {
          lat: '40.7128',
          long: '74.0060'
        }
      }
    };

    changeUser() {
      const john = {
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Anytown',
          country: 'USA',
          postalCode: '12345',
          coordinates: {
            lat: '40.7128',
            long: '74.0060'
          }
        }
      };

      const jane = {
        name: 'Jane',
        age: 31,
        address: {
          street: '456 Elm St',
          city: 'Othertown',
          country: 'Canada',
          postalCode: '67890',
          coordinates: {
            lat: '51.5074',
            long: '0.1278'
          }
        }
      };

      this.user = (this.user.name == 'John') ? jane : john;
    }

    changeName() {
      this.user.update(user => {
        user.name = (user.name == 'John') ? 'Jane' : 'John';
      });
    }

    changeStreet() {
      this.user.update(user => {
        user.address.street = (user.address.street == '123 Main St') ? '456 Elm St' : '123 Main St';
      });
    }

    changeLat() {
      this.user.update(user => {
        user.address.coordinates.lat = (user.address.coordinates.lat == '40.7128') ? '51.5074' : '40.7128';
      });
    }

    template() {
      return html`
        <div class="md-typography--body1">Name: ${this.user.name}</div>
        <div class="md-typography--body1">Street: ${this.user.address.street}</div>
        <div class="md-typography--body1">Latitude: ${this.user.address.coordinates.lat}</div>
        <button class="md-button" @click=${() => this.changeUser()}>Change User</button>
        <button class="md-button" @click=${() => this.changeName()}>Change Name</button>
        <button class="md-button" @click=${() => this.changeStreet()}>Change Street</button>
        <button class="md-button" @click=${() => this.changeLat()}>Change Latitude</button>
      `;
    }
  }

  customElements.define('nested-data-be', NestedObservableElement);
</script>

```
