import { html, ReactiveElement } from 'cami'

interface UserRecord {
  id: number
  email: string
}

interface RegistrationData {
  email: string
  password: string
}

type EmailStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error'

class RegistrationForm extends ReactiveElement {
  email: string = ''
  password: string = ''
  emailStatus: EmailStatus = 'idle'
  submitted: RegistrationData | null = null
  private validationTimer: ReturnType<typeof setTimeout> | undefined

  get isPasswordValid(): boolean {
    return this.password.length >= 8
  }

  get canSubmit(): boolean {
    return this.emailStatus === 'available' && this.isPasswordValid
  }

  updateEmail(event: InputEvent): void {
    this.email = (event.currentTarget as HTMLInputElement).value.trim()
    this.emailStatus = 'idle'
    if (this.validationTimer !== undefined) clearTimeout(this.validationTimer)
    this.validationTimer = setTimeout(() => void this.checkEmailAvailability(), 350)
  }

  updatePassword(event: InputEvent): void {
    this.password = (event.currentTarget as HTMLInputElement).value
  }

  async checkEmailAvailability(): Promise<void> {
    if (!this.email || !HTMLInputElement.prototype.checkValidity.call(
      Object.assign(document.createElement('input'), { type: 'email', value: this.email }),
    )) return

    this.emailStatus = 'checking'
    try {
      const response = await fetch(`https://cami-api.exe.xyz/users?email=${encodeURIComponent(this.email)}`)
      if (!response.ok) throw new Error(`Lookup failed: ${response.status}`)
      const users = await response.json() as UserRecord[]
      this.emailStatus = users.length === 0 ? 'available' : 'taken'
    } catch {
      this.emailStatus = 'error'
    }
  }

  submit(event: SubmitEvent): void {
    event.preventDefault()
    if (!this.canSubmit) return
    this.submitted = { email: this.email, password: this.password }
  }

  template(): ReturnType<typeof html> {
    return html`
      <form @submit=${(event: SubmitEvent) => this.submit(event)}>
        <label>Email
          <input type="email" required .value=${this.email} @input=${(event: InputEvent) => this.updateEmail(event)}>
        </label>
        <small aria-live="polite">
          ${this.emailStatus === 'checking' ? 'Checking…' : ''}
          ${this.emailStatus === 'available' ? 'Email is available.' : ''}
          ${this.emailStatus === 'taken' ? 'Email is already registered.' : ''}
          ${this.emailStatus === 'error' ? 'Could not check the email.' : ''}
        </small>
        <label>Password
          <input type="password" minlength="8" required .value=${this.password} @input=${(event: InputEvent) => this.updatePassword(event)}>
        </label>
        <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
      </form>
      ${this.submitted ? html`<p>Registered ${this.submitted.email} locally.</p>` : ''}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'registration-form': RegistrationForm
  }
}

customElements.define('registration-form', RegistrationForm)
