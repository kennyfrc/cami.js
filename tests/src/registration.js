const { html, ReactiveElement, model } = cami;

export const RegistrationModel = model("RegistrationModel", {
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
    RegistrationModel.setEmailError(emailError);
    RegistrationModel.setEmailIsValid(isEmailValid);
    RegistrationModel.setEmail(email);
    RegistrationModel.checkEmailAvailability(email);
  }

  handlePasswordInput(e) {
    const { isValid, password } = this.validatePassword(e.target.value);
    RegistrationModel.setPasswordError(isValid ? '' : 'Password must be at least 8 characters long.');
    RegistrationModel.setPassword(password);
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
    if (RegistrationModel.email === '') {
      return '';
    } else if (RegistrationModel.emailIsValid && RegistrationModel.isEmailAvailable) {
      return false;
    } else {
      return true;
    }
  }

  getPasswordInputState() {
    if (RegistrationModel.password === '') {
      return '';
    } else if (RegistrationModel.passwordError === '') {
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
            @input=${(e) => this.handleEmailInput(e)} value=${RegistrationModel.email}>
            <span id="email-available"
            >${RegistrationModel.isEmailAvailable === false && RegistrationModel.emailError === '' ? 'Email is already taken.' : ''}</span>
          <span id="email-error">${RegistrationModel.emailError}</span>
        </label>
        <label>
          Password:
          <input type="password" @input=${(e) => this.handlePasswordInput(e)}
            value=${RegistrationModel.password}
            aria-invalid=${this.getPasswordInputState()}>
          <span id="password-error"
          >${RegistrationModel.passwordError}</span>
        </label>
        <input type="submit" value="Submit" ?disabled=${RegistrationModel.emailError !== '' || RegistrationModel.passwordError !== '' || RegistrationModel.email === '' || RegistrationModel.password === ''}>
      </form>
    `;
  }
}

customElements.define('registration-test', RegistrationFormElement);
