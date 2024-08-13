const { html, ReactiveElement, store } = cami;

const registrationStore = store({
  state: {
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    emailIsValid: false,
    isEmailAvailable: false,
  },
  name: "registration-store",
  adapter: "memory",
});

registrationStore.defineAction(
  "processEmailInput",
  ({ state, payload, query }) => {
    const { isEmailValid, emailError } = validateEmail(payload);
    state.email = payload;
    state.emailError = emailError;
    state.emailIsValid = isEmailValid;
    query("checkEmailAvailability", payload);
  }
);

registrationStore.defineAction("processPasswordInput", ({ state, payload }) => {
  const { isValid } = validatePassword(payload);
  state.password = payload;
  state.passwordError = isValid
    ? ""
    : "Password must be at least 8 characters long.";
});

registrationStore.defineAction(
  "updateEmailAvailability",
  ({ state, payload }) => {
    state.isEmailAvailable = payload;
  }
);

registrationStore.defineQuery("checkEmailAvailability", {
  queryKey: (email) => ["Email", email],
  queryFn: (email) =>
    fetch(`https://api.camijs.com/users?email=${email}`).then((res) =>
      res.json()
    ),
  onSuccess: ({ state, data, dispatch }) => {
    dispatch("updateEmailAvailability", data.length === 0);
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
});

registrationStore.defineMemo("getEmailInputState", ({ state }) => {
  if (state.email === "") {
    return "";
  }
  return state.emailIsValid && state.isEmailAvailable === true ? false : true;
});

registrationStore.defineMemo("getPasswordInputState", ({ state }) => {
  if (state.password === "") {
    return "";
  }
  return state.passwordError === "" ? false : true;
});

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let emailError = "";
  let isEmailValid = null;
  if (email === "") {
    emailError = "";
    isEmailValid = null;
  } else if (!emailRegex.test(email)) {
    emailError = "Please enter a valid email address.";
    isEmailValid = false;
  } else {
    emailError = "";
    isEmailValid = true;
  }
  return { isEmailValid, emailError };
}

function validatePassword(password) {
  let isValid = false;
  if (password === "") {
    isValid = null;
  } else if (password?.length >= 8) {
    isValid = true;
  }
  return { isValid };
}

customElements.define(
  "registration-test",
  class extends ReactiveElement {
    template() {
      const {
        email,
        password,
        emailError,
        passwordError,
        emailIsValid,
        isEmailAvailable,
      } = registrationStore.state;
      const { dispatch, memo } = registrationStore;
      const getEmailInputState = memo("getEmailInputState");
      const getPasswordInputState = memo("getPasswordInputState");

      return html`
        <form action="/submit" method="POST">
          <label>
            Email:
            <input
              type="email"
              aria-invalid=${getEmailInputState}
              @input=${(e) => dispatch("processEmailInput", e.target.value)}
              value=${email}
            />
            <span id="email-available"
              >${isEmailAvailable === false && emailError === ""
                ? "Email is already taken."
                : ""}</span
            >
            <span id="email-error">${emailError}</span>
          </label>
          <label>
            Password:
            <input
              type="password"
              @input=${(e) => dispatch("processPasswordInput", e.target.value)}
              value=${password}
              aria-invalid=${getPasswordInputState}
            />
            <span id="password-error">${passwordError}</span>
          </label>
          <input
            type="submit"
            value="Submit"
            ?disabled=${emailError !== "" ||
            passwordError !== "" ||
            email === "" ||
            password === ""}
          />
        </form>
      `;
    }
  }
);

export { registrationStore };
