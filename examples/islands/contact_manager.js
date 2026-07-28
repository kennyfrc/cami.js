const { html, ReactiveElement } = cami
class NameManagerElement extends ReactiveElement {
    names = [
        { firstName: 'Hans', lastName: 'Zimmermann' },
        { firstName: 'Ruth', lastName: 'Huber' },
        { firstName: 'Heidi', lastName: 'Müller' },
    ];
    prefix = '';
    selectedName = null;
    firstName = '';
    lastName = '';
    validationError = '';
    get filteredNames() {
        const prefix = this.prefix.toLocaleLowerCase();
        return this.names.filter((contact) => contact.firstName.toLocaleLowerCase().startsWith(prefix)
            || contact.lastName.toLocaleLowerCase().startsWith(prefix));
    }
    validateName() {
        if (!this.firstName.trim() || !this.lastName.trim()) {
            this.validationError = 'Both first name and last name must be provided.';
            return false;
        }
        this.validationError = '';
        return true;
    }
    currentDraft() {
        return { firstName: this.firstName.trim(), lastName: this.lastName.trim() };
    }
    clearDraft() {
        this.firstName = '';
        this.lastName = '';
    }
    addName() {
        if (!this.validateName())
            return;
        this.names = [...this.names, this.currentDraft()];
        this.clearDraft();
    }
    updateName() {
        if (!this.selectedName || !this.validateName())
            return;
        const selected = this.selectedName;
        const replacement = this.currentDraft();
        this.names = this.names.map((contact) => contact === selected ? replacement : contact);
        this.selectedName = replacement;
        this.clearDraft();
    }
    deleteName() {
        if (!this.selectedName)
            return;
        this.names = this.names.filter((contact) => contact !== this.selectedName);
        this.selectedName = null;
    }
    selectName(contact) {
        this.selectedName = contact;
        this.firstName = this.selectedName?.firstName ?? '';
        this.lastName = this.selectedName?.lastName ?? '';
    }
    template() {
        return html `
      <div class="container">
        <label>Filter prefix:
          <input @input=${(event) => {
            this.prefix = event.currentTarget.value;
        }}>
        </label>
        <span>Contacts:</span>
        <div class="contact-list" role="listbox" aria-label="Contacts">
          ${this.filteredNames.map((contact) => html `
            <button
              type="button"
              role="option"
              aria-selected=${contact === this.selectedName}
              @click=${() => this.selectName(contact)}
            >${contact.firstName} ${contact.lastName}</button>
          `)}
        </div>
        <label>First Name:
          <input .value=${this.firstName} @input=${(event) => {
            this.firstName = event.currentTarget.value;
        }}>
        </label>
        <label>Last Name:
          <input .value=${this.lastName} @input=${(event) => {
            this.lastName = event.currentTarget.value;
        }}>
        </label>
        <div class="button-group">
          <button @click=${() => this.addName()}>Create</button>
          <button @click=${() => this.updateName()} ?disabled=${!this.selectedName}>Update</button>
          <button @click=${() => this.deleteName()} ?disabled=${!this.selectedName}>Delete</button>
        </div>
        ${this.validationError ? html `<p role="alert">${this.validationError}</p>` : ''}
      </div>
    `;
    }
}
customElements.define('contact-manager', NameManagerElement);
