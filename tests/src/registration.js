const { html, ReactiveElement, model } = cami;

export const RegistrationModel = model("RegistrationModel", {
  store: "registration-store",
  adapter: "memory",
  state: {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    emailIsValid: false,
    isEmailAvailable: false
  },
  actions: {
    setEmail: ({ state, payload }) => {
      state.email = payload;
    },
    setPassword: ({ state, payload }) => {
      state.password = payload;
    },
    setEmailError: ({ state, payload }) => {
      state.emailError = payload;
    },
    setPasswordError: ({ state, payload }) => {
      state.passwordError = payload;
    },
    setEmailIsValid: ({ state, payload }) => {
      state.emailIsValid = payload;
    },
    setIsEmailAvailable: ({ state, payload }) => {
      state.isEmailAvailable = payload;
    },
    processEmailInput: ({ dispatch, query, payload }) => {
      const { isEmailValid, emailError } = validateEmail(payload);
      dispatch('setEmailError', emailError);
      dispatch('setEmailIsValid', isEmailValid);
      dispatch('setEmail', payload);
      query('checkEmailAvailability', payload);
    },
    processPasswordInput: ({ dispatch, payload }) => {
      const { isValid } = validatePassword(payload);
      dispatch('setPasswordError', isValid ? '' : 'Password must be at least 8 characters long.');
      dispatch('setPassword', payload);
    }
  },
  queries: {
    checkEmailAvailability: {
      queryKey: (email) => ['Email', email],
      queryFn: (email) => fetch(`https://api.camijs.com/users?email=${email}`).then(res => res.json()),
      onSuccess: ({ dispatch, data }) => {
        dispatch('setIsEmailAvailable', data.length === 0);
      },
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  }
});

function validateEmail(email) {
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
  return { isEmailValid, emailError };
}

function validatePassword(password) {
  let isValid = false;
  if (password === '') {
    isValid = null;
  } else if (password?.length >= 8) {
    isValid = true;
  }
  return { isValid };
}

export class RegistrationFormElement extends ReactiveElement {
  template() {
    const { email, password, emailError, passwordError, emailIsValid, isEmailAvailable, dispatch } = RegistrationModel;

    const getEmailInputState = () => {
      if (email === '') {
        return '';
      }
      return (emailIsValid && isEmailAvailable === true) ? false : true;
    };

    const getPasswordInputState = () => {
      if (password === '') {
        return '';
      }
      return passwordError === '' ? false : true;
    };

    return html`
      <form action="/submit" method="POST">
        <label>
          Email:
          <input type="email"
            aria-invalid=${getEmailInputState()}
            @input=${(e) => dispatch('processEmailInput', e.target.value)}
            value=${email}>
          <span id="email-available">${isEmailAvailable === false && emailError === '' ? 'Email is already taken.' : ''}</span>
          <span id="email-error">${emailError}</span>
        </label>
        <label>
          Password:
          <input type="password"
            @input=${(e) => dispatch('processPasswordInput', e.target.value)}
            value=${password}
            aria-invalid=${getPasswordInputState()}>
          <span id="password-error">${passwordError}</span>
        </label>
        <input type="submit" value="Submit" ?disabled=${emailError !== '' || passwordError !== '' || email === '' || password === ''}>
      </form>
    `;
  }
}

customElements.define('registration-test', RegistrationFormElement);
