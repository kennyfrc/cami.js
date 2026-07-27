const { html, ReactiveElement } = cami
class RegistrationForm extends ReactiveElement {
    email = '';
    password = '';
    emailStatus = 'idle';
    submitted = null;
    validationTimer;
    get isPasswordValid() {
        return this.password.length >= 8;
    }
    get canSubmit() {
        return this.emailStatus === 'available' && this.isPasswordValid;
    }
    updateEmail(event) {
        this.email = event.currentTarget.value.trim();
        this.emailStatus = 'idle';
        if (this.validationTimer !== undefined)
            clearTimeout(this.validationTimer);
        this.validationTimer = setTimeout(() => void this.checkEmailAvailability(), 350);
    }
    updatePassword(event) {
        this.password = event.currentTarget.value;
    }
    async checkEmailAvailability() {
        if (!this.email || !HTMLInputElement.prototype.checkValidity.call(Object.assign(document.createElement('input'), { type: 'email', value: this.email })))
            return;
        this.emailStatus = 'checking';
        try {
            const response = await fetch(`https://cami-api.exe.xyz/users?email=${encodeURIComponent(this.email)}`);
            if (!response.ok)
                throw new Error(`Lookup failed: ${response.status}`);
            const users = await response.json();
            this.emailStatus = users.length === 0 ? 'available' : 'taken';
        }
        catch {
            this.emailStatus = 'error';
        }
    }
    submit(event) {
        event.preventDefault();
        if (!this.canSubmit)
            return;
        this.submitted = { email: this.email, password: this.password };
    }
    template() {
        return html `
      <form @submit=${(event) => this.submit(event)}>
        <label>Email
          <input type="email" required .value=${this.email} @input=${(event) => this.updateEmail(event)}>
        </label>
        <small aria-live="polite">
          ${this.emailStatus === 'checking' ? 'Checking…' : ''}
          ${this.emailStatus === 'available' ? 'Email is available.' : ''}
          ${this.emailStatus === 'taken' ? 'Email is already registered.' : ''}
          ${this.emailStatus === 'error' ? 'Could not check the email.' : ''}
        </small>
        <label>Password
          <input type="password" minlength="8" required .value=${this.password} @input=${(event) => this.updatePassword(event)}>
        </label>
        <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
      </form>
      ${this.submitted ? html `<p>Registered ${this.submitted.email} locally.</p>` : ''}
    `;
    }
}
customElements.define('registration-form', RegistrationForm);
