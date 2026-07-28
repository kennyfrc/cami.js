import { html, ReactiveElement } from 'cami'

interface Coordinates {
  lat: string
  long: string
}

interface Address {
  street: string
  city: string
  country: string
  postalCode: string
  coordinates: Coordinates
}

interface User {
  name: string
  age: number
  address: Address
}

const john: User = {
  name: 'John',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Anytown',
    country: 'USA',
    postalCode: '12345',
    coordinates: { lat: '40.7128', long: '74.0060' },
  },
}

const jane: User = {
  name: 'Jane',
  age: 31,
  address: {
    street: '456 Elm St',
    city: 'Othertown',
    country: 'Canada',
    postalCode: '67890',
    coordinates: { lat: '51.5074', long: '0.1278' },
  },
}

class NestedObservableElement extends ReactiveElement {
  user: User = structuredClone(john)

  changeUser(): void {
    this.user = structuredClone(this.user.name === 'John' ? jane : john)
  }

  changeName(): void {
    this.user = { ...this.user, name: this.user.name === 'John' ? 'Jane' : 'John' }
  }

  changeStreet(): void {
    this.user = {
      ...this.user,
      address: {
        ...this.user.address,
        street: this.user.address.street === '123 Main St' ? '456 Elm St' : '123 Main St',
      },
    }
  }

  changeLatitude(): void {
    this.user = {
      ...this.user,
      address: {
        ...this.user.address,
        coordinates: {
          ...this.user.address.coordinates,
          lat: this.user.address.coordinates.lat === '40.7128' ? '51.5074' : '40.7128',
        },
      },
    }
  }

  template(): ReturnType<typeof html> {
    return html`
      <p>Name: ${this.user.name}</p>
      <p>Street: ${this.user.address.street}</p>
      <p>Latitude: ${this.user.address.coordinates.lat}</p>
      <button @click=${() => this.changeUser()}>Change User</button>
      <button @click=${() => this.changeName()}>Change Name</button>
      <button @click=${() => this.changeStreet()}>Change Street</button>
      <button @click=${() => this.changeLatitude()}>Change Latitude</button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nested-data-be': NestedObservableElement
  }
}

customElements.define('nested-data-be', NestedObservableElement)
