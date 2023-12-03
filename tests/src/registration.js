const { html, ReactiveElement } = cami;

class RegistrationFormElement extends ReactiveElement {
  emailError = ''
  passwordError = ''
  email = '';
  password = '';
  emailIsValid = null;
  isEmailAvailable = null;

  inputValidation$ = this.stream();
  passwordValidation$ = this.stream();

  onConnect() {
    this.inputValidation$
      .map(e => this.validateEmail(e.target.value))
      .debounce(300)
      .subscribe(({ isEmailValid, emailError, email }) => {
        this.emailError = emailError;
        this.isEmailValid = isEmailValid;
        this.email = email;
        this.isEmailAvailable = this.queryEmail(this.email)
      });

    this.passwordValidation$
      .map(e => this.validatePassword(e.target.value))
      .debounce(300)
      .subscribe(({ isValid, password }) => {
        this.passwordError = isValid ? '' : 'Password must be at least 8 characters long.';
        this.password = password;
      });
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailError = '';
    let isEmailValid = null;
    if (email === '') {
      emailError = '';
      isEmailValid = null;
    } else if (!emailRegex.test(email)) {
      emailError = 'Please enter a valid email address.';
      isEmailValid = false;
    } else {
      emailError = '';
      isEmailValid = true;
    }
    return { isEmailValid, emailError, email };
  }

  validatePassword(password) {
    let isValid = false;
    if (password === '') {
      isValid = null;
    } else if (password?.length >= 8) {
      isValid = true;
    }

    return { isValid, password }
  }

  queryEmail(email) {
    return this.query({
      queryKey: ['Email', email],
      queryFn: () => {
        return fetch(`https://api.camijs.com/users?email=${email}`).then(res => res.json())
      },
      staleTime: 1000 * 60 * 5
    })
  }

  getEmailInputState() {
    if (this.email === '') {
      return '';
    } else if (this.isEmailValid && this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  getPasswordInputState() {
    if (this.password === '') {
      return '';
    } else if (this.passwordError === '') {
      return false;
    } else {
      return true;
    }
  }

  template() {
    return html`
      <form action="/submit" method="POST">
        <label>
          Email:
          <input type="email"
            aria-invalid=${this.getEmailInputState()}
            @input=${(e) => this.inputValidation$.next(e) } value=${this.email}>
            <span id="email-available"
            >${this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length > 0 && this.emailError === '' ? 'Email is already taken.' : ''}</span>
          <span id="email-error">${this.emailError}</span>
        </label>
        <label>
          Password:
          <input type="password" @input=${(e) => this.passwordValidation$.next(e) }
            value=${this.password}
            aria-invalid=${this.getPasswordInputState()}>
          <span id="password-error"
          >${this.passwordError}</span>
        </label>
        <input type="submit" value="Submit" ?disabled=${this.emailError !== '' || this.passwordError !== '' || this.email === '' || this.password === ''}>
      </form>
    `;
  }
}

customElements.define('registration-test', RegistrationFormElement);
