  const { html, ReactiveElement } = cami;

  class UserFormElement extends ReactiveElement {
    user = {};

    onConnect() {
      this.initialUser =  { name: 'Kenn', age: 34, email: 'kenn@example.com' };
      this.user.assign(this.initialUser);
    }

    handleInput(event, key) {
      this.user.assign({ [key]: event.target.value });
    }

    resetForm() {
      this.user = this.initialUser;
    }

    template() {
      return html`
        <form>
          <label>
            Name: ${this.user.name}
            <input type="text" .value=${this.user.name} @input=${(e) => this.handleInput(e, 'name')} />
          </label>
          <label>
            Age: ${this.user.age}
            <input type="number" .value=${this.user.age} @input=${(e) => this.handleInput(e, 'age')} />
          </label>
          <label>
            Email: ${this.user.email}
            <input type="email" .value=${this.user.email} @input=${(e) => this.handleInput(e, 'email')} />
          </label>
          <button type="button" @click=${this.resetForm.bind(this)}>Reset</button>
        </form>
      `;
    }
  }

  customElements.define('nested-form-component', UserFormElement);
