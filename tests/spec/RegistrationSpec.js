describe('RegistrationFormElement', () => {
  let regForm;

  beforeEach(async () => {
    regForm = document.createElement('registration-test');
    document.body.appendChild(regForm);
    await window.customElements.whenDefined('registration-test');
    await regForm.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  afterEach(() => {
    document.body.removeChild(regForm);
  });

  it('should validate email input in real-time', (done) => {
    const emailInput = regForm.querySelector('input[type="email"]');
    emailInput.value = 'invalid email';
    emailInput.dispatchEvent(new Event('input'));
    setTimeout(() => {
      const emailError = regForm.querySelector('#email-error').textContent;
      expect(emailError).toBe('Please enter a valid email address.');
      done();
    }, 300);
  });

  it('should validate password input in real-time', (done) => {
    const passwordInput = regForm.querySelector('input[type="password"]');
    passwordInput.value = 'short';
    passwordInput.dispatchEvent(new Event('input'));
    setTimeout(() => {
      const passwordError = regForm.querySelector('#password-error').textContent;
      expect(passwordError).toBe('Password must be at least 8 characters long.');
      done();
    }, 300);
  });

  it('should disable the submit button if the email or password is invalid', () => {
    regForm.emailError = 'Invalid email';
    regForm.passwordError = '';
    const submitButton = regForm.querySelector('input[type="submit"]');
    expect(submitButton.disabled).toBe(true);
    regForm.emailError = '';
    regForm.passwordError = 'Invalid password';
    expect(submitButton.disabled).toBe(true);
  });

  it('should disable the submit button if the email or password is empty', () => {
    regForm.email = '';
    regForm.password = 'validpassword';
    const submitButton = regForm.querySelector('input[type="submit"]');
    expect(submitButton.disabled).toBe(true);
    regForm.email = 'validemail@example.com';
    regForm.password = '';
    expect(submitButton.disabled).toBe(true);
  });

  it('should enable the submit button if both email and password are valid', () => {
    regForm.email = 'validemail@example.com';
    regForm.emailError = '';
    regForm.password = 'validpassword';
    regForm.passwordError = '';
    const submitButton = regForm.querySelector('input[type="submit"]');
    expect(submitButton.disabled).toBe(false);
  });
});
