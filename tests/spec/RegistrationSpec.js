import { RegistrationSlice, RegistrationFormElement } from '../src/registration.js';

describe('Strings are Observable - RegistrationFormElement', () => {
  let regForm;

  beforeEach(async () => {
    regForm = new RegistrationFormElement();
    document.body.appendChild(regForm);
    await regForm.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  afterEach(() => {
    document.body.removeChild(regForm);
  });

  it('should validate email input in real-time', async () => {
    const emailInput = regForm.querySelector('input[type="email"]');
    emailInput.value = 'invalid email';
    emailInput.dispatchEvent(new Event('input'));
    await regForm.updateComplete;
    const emailError = regForm.querySelector('#email-error').textContent;
    expect(emailError).toBe('Please enter a valid email address.');
  });

  it('should validate password input in real-time', async () => {
    const passwordInput = regForm.querySelector('input[type="password"]');
    passwordInput.value = 'short';
    passwordInput.dispatchEvent(new Event('input'));
    await regForm.updateComplete;
    const passwordError = regForm.querySelector('#password-error').textContent;
    expect(passwordError).toBe('Password must be at least 8 characters long.');
  });
});
