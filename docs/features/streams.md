# Streams - WIP

In Cami.js, streams are a fundamental part of the library. They provide a way to handle asynchronous events in a reactive manner. This means you can write code that responds to events as they happen, rather than checking for them at regular intervals.

A stream in Cami.js is essentially a sequence of asynchronous events. You can think of it as an array that populates over time. Each event in the stream represents a change in state.

Here's an example of how you might use a stream in a Cami.js component:

```javascript
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
  // ...
}
```

In this example, `inputValidation$` and `passwordValidation$` are streams. They are created using the `this.stream()` method provided by Cami.js. The `$` at the end of the variable name is a convention in the reactive programming world to indicate that the variable is a stream.

The `map` method is used to transform the events in the stream. In this case, it's used to validate the email and password inputs. The `debounce` method is used to limit the rate at which events are processed. This is useful in cases where events can be fired rapidly, such as user input. The `subscribe` method is used to specify what should happen when an event occurs. In this case, it's used to update the component's state.


