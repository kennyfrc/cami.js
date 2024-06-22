const { html, ReactiveElement, slice } = cami;

export const RegistrationSlice = slice("RegistrationSlice", {
  store: "registration-store",
  state: {
    emailError: '',
    passwordError: '',
    email: '',
    password: '',
    emailIsValid: null,
    isEmailAvailable: null
  },
  actions: {
    setEmailError: ({ state, payload }) => { state.emailError = payload; },
    setPasswordError: ({ state, payload }) => { state.passwordError = payload; },
    setEmail: ({ state, payload }) => { state.email = payload; },
    setPassword: ({ state, payload }) => { state.password = payload; },
    setEmailIsValid: ({ state, payload }) => { state.emailIsValid = payload; },
    setIsEmailAvailable: ({ state, payload }) => { state.isEmailAvailable = payload; }
  },
  queries: {
    checkEmailAvailability: {
      queryKey: ['Email'],
      queryFn: (email) => fetch(`https://api.camijs.com/users?email=${email}`).then(res => res.json()),
      staleTime: 1000 * 60 * 5,
      onSuccess: (ctx) => {
        ctx.actions.setIsEmailAvailable(ctx.response.length === 0);
      }
    }
  }
});

export class RegistrationFormElement extends ReactiveElement {
  handleEmailInput(e) {
    const { isEmailValid, emailError, email } = this.validateEmail(e.target.value);
    RegistrationSlice.setEmailError(emailError);
    RegistrationSlice.setEmailIsValid(isEmailValid);
    RegistrationSlice.setEmail(email);
    RegistrationSlice.checkEmailAvailability(email);
  }

  handlePasswordInput(e) {
    const { isValid, password } = this.validatePassword(e.target.value);
    RegistrationSlice.setPasswordError(isValid ? '' : 'Password must be at least 8 characters long.');
    RegistrationSlice.setPassword(password);
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

  getEmailInputState() {
    if (RegistrationSlice.email === '') {
      return '';
    } else if (RegistrationSlice.emailIsValid && RegistrationSlice.isEmailAvailable) {
      return false;
    } else {
      return true;
    }
  }

  getPasswordInputState() {
    if (RegistrationSlice.password === '') {
      return '';
    } else if (RegistrationSlice.passwordError === '') {
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
            @input=${(e) => this.handleEmailInput(e)} value=${RegistrationSlice.email}>
            <span id="email-available"
            >${RegistrationSlice.isEmailAvailable === false && RegistrationSlice.emailError === '' ? 'Email is already taken.' : ''}</span>
          <span id="email-error">${RegistrationSlice.emailError}</span>
        </label>
        <label>
          Password:
          <input type="password" @input=${(e) => this.handlePasswordInput(e)}
            value=${RegistrationSlice.password}
            aria-invalid=${this.getPasswordInputState()}>
          <span id="password-error"
          >${RegistrationSlice.passwordError}</span>
        </label>
        <input type="submit" value="Submit" ?disabled=${RegistrationSlice.emailError !== '' || RegistrationSlice.passwordError !== '' || RegistrationSlice.email === '' || RegistrationSlice.password === ''}>
      </form>
    `;
  }
}

customElements.define('registration-test', RegistrationFormElement);
