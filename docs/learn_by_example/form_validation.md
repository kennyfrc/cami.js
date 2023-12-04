# Interactive Registration Form

<article>
  <small>Try entering an email that is already taken, such as trevinowanda@example.net (this is a mock email in our API)</small>
  <registration-form-cami-example-be></registration-form-cami-example-be>
</article>
<small>

</small>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class FormElement extends ReactiveElement {
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
        return 'valid';
      } else {
        return 'invalid';
      }
    }

    getPasswordInputState() {
      if (this.password === '') {
        return '';
      } else if (this.passwordError === '') {
        return 'valid';
      } else {
        return 'invalid';
      }
    }

    template() {
      return html`
        <style>
          .md-input.invalid {
            border: 2px solid red;
            border-bottom: 2px solid red !important; /* Override Material blue bottom border */
            transition: border-color 0.1s ease-in-out;
          }
          .md-input.valid {
            border: 2px solid green;
            border-bottom: 2px solid green !important; /* Override Material blue bottom border */
            transition: border-color 0.1s ease-in-out;
          }
          .md-input {
            border-bottom: 1px solid #ccc !important; /* Override Material blue bottom border */
            border: 1px solid #ccc;
            transition: border-color 0.1s ease-in-out;
            margin-top: 8px;
            margin-bottom: 8px;
          }
          .md-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transition: opacity 0.1s ease-in-out;
          }
        </style>
        <form action="/submit" method="POST" class="md-form">
          <div class="md-form-group">
            <label>Email:</label>
            <input type="email"
              class="md-input ${this.getEmailInputState()}"
              @input=${(e) => this.inputValidation$.next(e)} value=${this.email}>
            <span>${this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length > 0 && this.emailError === '' ? 'Email is already taken.' : ''}</span>
            <span>${this.emailError}</span>
          </div>
          <div class="md-form-group">
            <label>Password:</label>
            <input type="password"
              class="md-input ${this.getPasswordInputState()}"
              @input=${(e) => this.passwordValidation$.next(e)}
              value=${this.password}>
            <span>${this.passwordError}</span>
          </div>
          <div class="md-form-group">
            <input type="submit" class="md-button md-button--primary" value="Submit"
              style="opacity: ${this.emailError !== '' || this.passwordError !== '' || this.email === '' || this.password === '' ? '0.5' : '1'}">
          </div>
        </form>
      `;
    }
  }

  customElements.define('registration-form-cami-example-be', FormElement);
</script>

## JS Fiddle:

[https://jsfiddle.net/kennyfrc12/1nL0ybj2/7/](https://jsfiddle.net/kennyfrc12/1nL0ybj2/7/)

## HTML:

```html
<article>
  <small>Try entering an email that is already taken, such as trevinowanda@example.net (this is a mock email in our API)</small>
  <registration-form-cami-example-be></registration-form-cami-example-be>
</article>
<small>

</small>
<!-- CDN version below -->
<!-- <script src="https://unpkg.com/cami@latest/build/cami.cdn.js"></script> -->
<script type="module">
  const { html, ReactiveElement } = cami;

  class FormElement extends ReactiveElement {
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
        return 'valid';
      } else {
        return 'invalid';
      }
    }

    getPasswordInputState() {
      if (this.password === '') {
        return '';
      } else if (this.passwordError === '') {
        return 'valid';
      } else {
        return 'invalid';
      }
    }

    template() {
      return html`
        <style>
          .md-input.invalid {
            border: 2px solid red;
            border-bottom: 2px solid red !important; /* Override Material blue bottom border */
            transition: border-color 0.1s ease-in-out;
          }
          .md-input.valid {
            border: 2px solid green;
            border-bottom: 2px solid green !important; /* Override Material blue bottom border */
            transition: border-color 0.1s ease-in-out;
          }
          .md-input {
            border-bottom: 1px solid #ccc !important; /* Override Material blue bottom border */
            border: 1px solid #ccc;
            transition: border-color 0.1s ease-in-out;
            margin-top: 8px;
            margin-bottom: 8px;
          }
          .md-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transition: opacity 0.1s ease-in-out;
          }
        </style>
        <form action="/submit" method="POST" class="md-form">
          <div class="md-form-group">
            <label>Email:</label>
            <input type="email"
              class="md-input ${this.getEmailInputState()}"
              @input=${(e) => this.inputValidation$.next(e)} value=${this.email}>
            <span>${this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length > 0 && this.emailError === '' ? 'Email is already taken.' : ''}</span>
            <span>${this.emailError}</span>
          </div>
          <div class="md-form-group">
            <label>Password:</label>
            <input type="password"
              class="md-input ${this.getPasswordInputState()}"
              @input=${(e) => this.passwordValidation$.next(e)}
              value=${this.password}>
            <span>${this.passwordError}</span>
          </div>
          <div class="md-form-group">
            <input type="submit" class="md-button md-button--primary" value="Submit"
              style="opacity: ${this.emailError !== '' || this.passwordError !== '' || this.email === '' || this.password === '' ? '0.5' : '1'}">
          </div>
        </form>
      `;
    }
  }

  customElements.define('registration-form-cami-example-be', FormElement);
</script>
```
