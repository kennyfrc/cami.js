import { html, ReactiveElement } from 'cami'

interface Contact {
  firstName: string
  lastName: string
}

class NameManagerElement extends ReactiveElement {
  names: Contact[] = [
    { firstName: 'Hans', lastName: 'Zimmermann' },
    { firstName: 'Ruth', lastName: 'Huber' },
    { firstName: 'Heidi', lastName: 'Müller' },
  ]
  prefix: string = ''
  selectedName: Contact | null = null
  firstName: string = ''
  lastName: string = ''
  validationError: string = ''

  get filteredNames(): Contact[] {
    const prefix = this.prefix.toLocaleLowerCase()
    return this.names.filter((contact: Contact) =>
      contact.firstName.toLocaleLowerCase().startsWith(prefix)
      || contact.lastName.toLocaleLowerCase().startsWith(prefix),
    )
  }

  validateName(): boolean {
    if (!this.firstName.trim() || !this.lastName.trim()) {
      this.validationError = 'Both first name and last name must be provided.'
      return false
    }
    this.validationError = ''
    return true
  }

  currentDraft(): Contact {
    return { firstName: this.firstName.trim(), lastName: this.lastName.trim() }
  }

  clearDraft(): void {
    this.firstName = ''
    this.lastName = ''
  }

  addName(): void {
    if (!this.validateName()) return
    this.names = [...this.names, this.currentDraft()]
    this.clearDraft()
  }

  updateName(): void {
    if (!this.selectedName || !this.validateName()) return
    const selected = this.selectedName
    const replacement = this.currentDraft()
    this.names = this.names.map((contact: Contact) => contact === selected ? replacement : contact)
    this.selectedName = replacement
    this.clearDraft()
  }

  deleteName(): void {
    if (!this.selectedName) return
    this.names = this.names.filter((contact: Contact) => contact !== this.selectedName)
    this.selectedName = null
  }

  selectName(contact: Contact): void {
    this.selectedName = contact
    this.firstName = this.selectedName?.firstName ?? ''
    this.lastName = this.selectedName?.lastName ?? ''
  }

  template(): ReturnType<typeof html> {
    return html`
      <div class="container">
        <label>Filter prefix:
          <input @input=${(event: InputEvent) => {
            this.prefix = (event.currentTarget as HTMLInputElement).value
          }}>
        </label>
        <span>Contacts:</span>
        <div class="contact-list" role="listbox" aria-label="Contacts">
          ${this.filteredNames.map((contact: Contact) => html`
            <button
              type="button"
              role="option"
              aria-selected=${contact === this.selectedName}
              @click=${() => this.selectName(contact)}
            >${contact.firstName} ${contact.lastName}</button>
          `)}
        </div>
        <label>First Name:
          <input .value=${this.firstName} @input=${(event: InputEvent) => {
            this.firstName = (event.currentTarget as HTMLInputElement).value
          }}>
        </label>
        <label>Last Name:
          <input .value=${this.lastName} @input=${(event: InputEvent) => {
            this.lastName = (event.currentTarget as HTMLInputElement).value
          }}>
        </label>
        <div class="button-group">
          <button @click=${() => this.addName()}>Create</button>
          <button @click=${() => this.updateName()} ?disabled=${!this.selectedName}>Update</button>
          <button @click=${() => this.deleteName()} ?disabled=${!this.selectedName}>Delete</button>
        </div>
        ${this.validationError ? html`<p role="alert">${this.validationError}</p>` : ''}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'contact-manager': NameManagerElement
  }
}

customElements.define('contact-manager', NameManagerElement)
