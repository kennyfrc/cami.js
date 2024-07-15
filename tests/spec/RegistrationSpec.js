import { registrationStore } from '../src/registration.js';

describe("RegistrationFormElement - In Memory Storage", () => {
  describe('Strings are Observable - RegistrationFormElement', () => {
    let regForm;

    beforeEach(async () => {
      regForm = document.createElement('registration-test');
      document.body.appendChild(regForm);
      await customElements.whenDefined('registration-test');
      await regForm.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    afterEach(() => {
      document.body.removeChild(regForm);
      registrationStore.reset(); // Reset the store state after each test
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

    it('should update store state when email input changes', async () => {
      const emailInput = regForm.querySelector('input[type="email"]');
      emailInput.value = 'test@example.com';
      emailInput.dispatchEvent(new Event('input'));
      await regForm.updateComplete;
      expect(registrationStore.state.email).toBe('test@example.com');
    });

    it('should update store state when password input changes', async () => {
      const passwordInput = regForm.querySelector('input[type="password"]');
      passwordInput.value = 'validpassword';
      passwordInput.dispatchEvent(new Event('input'));
      await regForm.updateComplete;
      expect(registrationStore.state.password).toBe('validpassword');
    });
  });
});
