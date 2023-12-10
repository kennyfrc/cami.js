# Contact Manager (In-Memory State)

<iframe width="100%" height="1000" src="//jsfiddle.net/kennyfrc12/p94uz03n/36/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## HTML

```html
<article>
  <contact-manager></contact-manager>
</article>
<script src="./build/cami.cdn.js"></script>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 330px;
    margin: auto;
  }
  .input-group {
    margin-bottom: 10px;
  }
  .list-container {
    margin-bottom: 10px;
    height: 150px;
    overflow: auto;
    border: 1px solid gray;
  }
  select {
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
  }

  select::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .validation-error {
    border: 1px solid red;
    padding: 10px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .close-btn {
    cursor: pointer;
  }
</style>
<script type="module">
  const { html, ReactiveElement } = cami;

  class NameManagerElement extends ReactiveElement {
    names = [{
      firstName: "Hans",
      lastName: "Zimmermann"
    }, {
      firstName: "Ruth",
      lastName: "Huber"
    }, {
      firstName: "Heidi",
      lastName: "Müller"
    }]
    prefix = '';
    selectedName = null;
    firstName = '';
    lastName = '';
    filteredNames = [];
    validationError = '';
    fadeOutClass = '';

    validateName() {
      if (!this.firstName || !this.lastName) {
        this.validationError = 'Both first name and last name must be provided.';
        return false;
      }
      this.validationError = '';
      return true;
    }

    addName() {
      if (!this.validateName()) {
        return;
      }
      this.names.push({ firstName: this.firstName, lastName: this.lastName });
      this.firstName = '';
      this.lastName = '';
    }

    updateName() {
      if (!this.validateName()) {
        return;
      }
      const index = this.names.findIndex(name => name.firstName === this.selectedName.firstName && name.lastName === this.selectedName.lastName);
      if (index !== -1) {
        this.names.splice(index, 1, { firstName: this.firstName, lastName: this.lastName });
        this.firstName = '';
        this.lastName = '';
      }
    }

    deleteName() {
      const index = this.names.findIndex(name => name === this.selectedName);
      if (index !== -1) {
        this.names.splice(index, 1);
        this.selectedName = null;
      }
    }

    get filterNames() {
      return this.names.filter(name => name.firstName.startsWith(this.prefix) || name.lastName.startsWith(this.prefix));
    }

    template() {
      return html`
        <div class="container">
          <div class="input-group">
            <label>Filter prefix:</label>
            <input type="text" @input=${(e) => { this.prefix = e.target.value; }} />
          </div>
          <label>Contacts:</label>
          <div class="list-container">
            <select size="8"
                    @change=${(e) => { this.selectedName = this.filterNames[e.target.selectedIndex]; }}
            >
              ${this.filterNames.map(name => html`<option>${name.firstName} ${name.lastName}</option>`)}
            </select>
          </div>
          <div class="input-group">
            <label>First Name:</label>
            <input type="text" .value=${this.firstName} @input=${(e) => { this.firstName = e.target.value; }} />
          </div>
          <div class="input-group">
            <label>Last Name:</label>
            <input type="text" .value=${this.lastName} @input=${(e) => { this.lastName = e.target.value; }} />
          </div>
          <div class="button-group">
            <button @click=${() => this.addName()}>Create</button>
            <button @click=${() => this.updateName()} ?disabled=${!this.selectedName}>Update</button>
            <button @click=${() => this.deleteName()} ?disabled=${!this.selectedName}>Delete</button>
          </div>
          ${this.validationError ? html`
            <div class="validation-error">
              <span>Notice: ${this.validationError}</span>
              <span class="close-btn" @click=${() => this.validationError = ''}>X</span>
            </div>
          ` : ''}
        </div>
      `;
    }
  }

  customElements.define('contact-manager', NameManagerElement);
</script>

```
