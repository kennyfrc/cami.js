# Streams

In Cami.js, streams provide a way to handle asynchronous events in a reactive manner. This means you can write code that responds to events as they happen, rather than checking for them at regular intervals.

A stream in Cami.js is essentially a sequence of asynchronous events. You can think of it as an array that populates over time. Each event in the stream represents a change in state.

Here's an example of how you might use a stream in a Cami.js component. Let's say we want to create an interactive registration from that:

* Validates the email input as the user types
* Checks if the email is available
* Validates the password input as the user types
* Displays an error message if the password is too short
* Displays an error message if the email is not available
* Disables the submit button if the form is invalid
* Enables the submit button if the form is valid

Here's how that registration form might look like. The button is disabled by default, and will enable if email & password are valid.

<hr>

### Demo - Registration Form

<article>
  <small>Try entering an email that is already taken, such as geovanniheaney@block.info (this is a mock email in our API)</small>
  <registration-form-cami-example></registration-form-cami-example>
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
          return fetch(`https://mockend.com/api/kennyfrc/cami-mock-api/users?email_eq=${email}`).then(res => res.json())
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
              ?disabled=${this.emailError !== '' || this.passwordError !== '' || this.email === '' || this.password === ''}>
          </div>
        </form>
      `;
    }
  }

  customElements.define('registration-form-cami-example', FormElement);
</script>

Hope the example is motivating :) As the code can be a bit of a doozy. Explanation is right after the code.

```html
<article>
  <h1>Registration Form</h1>
  <form-component></form-component>
</article>
<small>
<p>Try entering an email that is already taken, such as geovanniheaney@block.info (mock email)</p>
</small>
<script src="./build/cami.cdn.js"></script>
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
          return fetch(`https://mockend.com/api/kennyfrc/cami-mock-api/users?email_eq=${email}`).then(res => res.json())
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
              <span>${this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length > 0 && this.emailError === '' ? 'Email is already taken.' : ''}</span>
            <span>${this.emailError}</span>
          </label>
          <label>
            Password:
            <input type="password" @input=${(e) => this.passwordValidation$.next(e) }
              value=${this.password}
              aria-invalid=${this.getPasswordInputState()}>
            <span>${this.passwordError}</span>
          </label>
          <input type="submit" value="Submit" ?disabled=${this.emailError !== '' || this.passwordError !== '' || this.email === '' || this.password === ''}>
        </form>
      `;
    }
  }

  customElements.define('form-component', FormElement);
</script>
```

## Explanation

This section provides a detailed explanation of the form component's code structure and functionality. Here's a step-by-step breakdown:

### Starting with Basic HTML Structure

The initial template is a simple HTML form with placeholders for dynamic content:

```js
template() {
  return html`
    <form action="/submit" method="POST">
      <label>
        Email:
        <input type="email" aria-invalid="" value="">
        <span></span> <!-- Placeholder for email availability message -->
        <span></span> <!-- Placeholder for email error message -->
      </label>
      <label>
        Password:
        <input type="password" value="" aria-invalid="">
        <span></span> <!-- Placeholder for password error message -->
      </label>
      <input type="submit" value="Submit" disabled>
    </form>
  `;
}
```

### Integrating Observables

Observables are used to manage the state of the form, including error messages and input values:

```javascript
const { html, ReactiveElement } = cami;

class FormElement extends ReactiveElement {
  emailError = '';
  passwordError = '';
  email = '';
  password = '';
  emailIsValid = null;
  isEmailAvailable = null;
  // ...
}
```

### Enhancing the Template with Observables

The template is updated to bind the form inputs and error messages to the observables:

```javascript

template() {
  return html`
    <form action="/submit" method="POST">
      <label>
        Email:
        <input type="email"
          aria-invalid=""
          value=${this.email}>
        <span></span> <!-- Placeholder for email availability message -->
        <span>${this.emailError}</span>
      </label>
      <label>
        Password:
        <input type="password"
          value=${this.password}
          aria-invalid="">
        <span>${this.passwordError}</span>
      </label>
      <input type="submit" value="Submit" disabled>
    </form>
  `;
}

```

### Handling User Input with Streams

Streams are a powerful abstraction for handling a sequence of asynchronous events or data. They represent a set of steps that data passes through, allowing for operations such as mapping, filtering, and debouncing to be applied to the data as it flows through these steps.

Here, we initialize two streams to handle user input events for email and password fields. When `next(value)` is invoked on a stream, the provided value is sent through the defined steps: first to `map`, then `debounce`, and finally to `subscribe` where the actual side effects occur based on the processed data.

```js
// ...
class FormElement extends ReactiveElement {

// ... other observable definitions

this.inputValidation$ = this.stream(); // start or root of the stream
this.passwordValidation$ = this.stream(); // start or root of the stream

onConnect() {
  // Define the stream for email input validation
  this.inputValidation$
    .map(e => this.validateEmail(e.target.value)) // Transform the event to validation result
    .debounce(300) // Wait for 300ms of inactivity before passing the result down the stream
    .subscribe(({ isEmailValid, emailError, email }) => {
      // Update the component state with the validation results
      this.emailError = emailError;
      this.isEmailValid = isEmailValid;
      this.email = email;
      // Perform an API query to check email availability
      this.isEmailAvailable = this.queryEmail(this.email);
    });

  // Define the stream for password input validation
  this.passwordValidation$
    .map(e => this.validatePassword(e.target.value)) // Transform the event to validation result
    .debounce(300) // Wait for 300ms of inactivity before passing the result down the stream
    .subscribe(({ isValid, password }) => {
      // Update the component state with the validation results
      this.passwordError = isValid ? '' : 'Password must be at least 8 characters long.';
      this.password = password;
    });
}
```

To pass values to the streams, we use the `next` method provided by the stream (example: `this.inputValidation$.next(e)`). This next method is called whenever an input event occurs, passing the event into the stream.

Below is how we attach the `next` method to the input event handlers in the template.

```js
template() {
  return html`
    <form action="/submit" method="POST">
      <label>
        Email:
        <input type="email"
          aria-invalid=${this.getEmailInputState()}
          @input=${(e) => this.inputValidation$.next(e) } value=${this.email}>
          <span>${this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length > 0 && this.emailError === '' ? 'Email is already taken.' : ''}</span>
        <span>${this.emailError}</span>
      </label>
      <label>
        Password:
        <input type="password" @input=${(e) => this.passwordValidation$.next(e) }
          value=${this.password}
          aria-invalid=${this.getPasswordInputState()}>
        <span>${this.passwordError}</span>
      </label>
      <input type="submit" value="Submit" ?disabled=${this.emailError !== '' || this.passwordError !== '' || this.email === '' || this.password === ''}>
    </form>
  `;
}
```

### Validating Email and Password

The component includes methods to validate the email and password against specific criteria:

```js
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
```

### Querying Email Availability

An API query is performed to check if the entered email is already in use. The `query` method is part of Cami's asynchronous state management system, which is detailed in [async state management](/features/async_state_management). It allows the component to declare a data dependency that is fetched asynchronously, and the component's UI can react to the data, loading, and error states of the query.

```js
queryEmail(email) {
  // Define a query with a unique key and a function to fetch the data
  return this.query({
    queryKey: ['Email', email], // The queryKey uniquely identifies this query
    queryFn: () => {
      // Perform a fetch request to check if the email is already in use
      return fetch(`https://mockend.com/api/kennyfrc/cami-mock-api/users?email_eq=${email}`)
        .then(res => res.json());
    },
    staleTime: 1000 * 60 * 5 // Data is considered fresh for 5 minutes
  })
}
```

### Updating the Form with Validation and API Query Results

The form is further enhanced to reflect the validation states and API query results, with methods to determine the visual feedback for input fields.

There are three states: the base state, the invalid state, and valid state. Let's create methods for those: `getEmailInputState()` and `getPasswordInputState()`

```js
template() {
  return html`
    <form action="/submit" method="POST">
      <label>
        Email:
        <input type="email"
          aria-invalid=${this.getEmailInputState()}
          @input=${(e) => this.inputValidation$.next(e) } value=${this.email}>
          <span>${this.isEmailAvailable?.status === 'success' && this.isEmailAvailable?.data?.length > 0 && this.emailError === '' ? 'Email is already taken.' : ''}</span>
        <span>${this.emailError}</span>
      </label>
      <label>
        Password:
        <input type="password" @input=${(e) => this.passwordValidation$.next(e) }
          value=${this.password}
          aria-invalid=${this.getPasswordInputState()}>
        <span>${this.passwordError}</span>
      </label>
      <input type="submit" value="Submit" ?disabled=${this.emailError !== '' || this.passwordError !== '' || this.email === '' || this.password === ''}>
    </form>
  `;
}
```

Let's define those here.

```js
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
```

Each step incrementally builds upon the previous one, resulting in a dynamic and responsive form that provides real-time feedback to the user.

To review the form again, [go here](/features/streams/#demo-registration-form).
