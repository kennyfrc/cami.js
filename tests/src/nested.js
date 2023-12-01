const { html, ReactiveElement } = cami;

class UserFormElement extends ReactiveElement {
  user = {};

  onConnect() {
    this.initialUser =  {
      name: 'Kenn',
      age: 34,
      email: 'kenn@example.com',
      address: {
        postcode: '12345',
        street: '123 Main St'
      }
    };
    this.user.assign(this.initialUser);
  }

  handleInput(event, key) {
    this.user.assign({ [key]: event.target.value });
  }

  resetForm() {
    this.user.assign(this.initialUser);
  }

  clearForm() {
    this.user.clear();
  }

  template() {
    return html`
      <form>
        <label>
          Name: ${this.user.name}
          <input type="text" name="name" .value=${this.user.name} @input=${(e) => this.handleInput(e, 'name')} />
        </label>
        <label>
          Age: ${this.user.age}
          <input type="number" .value=${this.user.age} @input=${(e) => this.handleInput(e, 'age')} />
        </label>
        <label>
          Email: ${this.user.email}
          <input type="email" .value=${this.user.email} @input=${(e) => this.handleInput(e, 'email')} />
        </label>
        <label>
          Postcode: ${this.user.address ? this.user.address.postcode : ''}
          <input type="text" name="postcode" .value=${this.user.address ? this.user.address.postcode : '' } @input=${(e) => this.handleInput(e, 'address.postcode')} />
        </label>
        <label>
          Street: ${this.user.address ? this.user.address.street : ''}
          <input type="text" name="street" .value=${this.user.address ? this.user.address.street : ''}
          @input=${(e) => this.handleInput(e, 'address.street')} />
        </label>
        <button type="button" @click=${this.resetForm.bind(this)}>Reset</button>
      </form>
    `;
  }
}

customElements.define('nested-form-component', UserFormElement);
