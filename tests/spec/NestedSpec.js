describe('Objects are - Observable UserFormElement', () => {
  let userFormElement;

  beforeEach(async () => {
    userFormElement = document.createElement('nested-form-component');
    document.body.appendChild(userFormElement);
    await window.customElements.whenDefined('nested-form-component');
    await userFormElement.updateComplete;
    await new Promise(resolve => setTimeout(resolve,50));
  });

  afterEach(() => {
    document.body.removeChild(userFormElement);
  });

  it('should initialize with default user data', () => {
    expect(userFormElement.user.name).toBe('Kenn');
    expect(userFormElement.user.age).toBe(34);
    expect(userFormElement.user.email).toBe('kenn@example.com');
    const nameInput = userFormElement.querySelector('input[type="text"]');
    expect(nameInput.value).toBe('Kenn');
  });

  it('should update user data and input field when input changes', async () => {
    const inputElement = userFormElement.querySelector('input[type="text"]');
    inputElement.value = 'New Name';
    inputElement.dispatchEvent(new Event('input'));
    await userFormElement.updateComplete;
    expect(userFormElement.user.name).toBe('New Name');
    expect(inputElement.value).toBe('New Name');
  });

  it('should reset user data and input field when reset button is clicked', async () => {
    const inputElement = userFormElement.querySelector('input[type="text"]');
    inputElement.value = 'New Name';
    inputElement.dispatchEvent(new Event('input'));
    const resetButton = userFormElement.querySelector('button');
    resetButton.dispatchEvent(new Event('click'));
    await userFormElement.updateComplete;
    expect(userFormElement.user.name).toBe('Kenn');
    expect(inputElement.value).toBe('Kenn');
    expect(userFormElement.user.age).toBe(34);
    expect(userFormElement.user.email).toBe('kenn@example.com');
  });

  it('should assign new user data correctly', async () => {
    userFormElement.user.assign({ name: 'New Name', age: 35, email: 'new@example.com' });
    await userFormElement.updateComplete;
    expect(userFormElement.user.name).toBe('New Name');
    expect(userFormElement.user.age).toBe(35);
    expect(userFormElement.user.email).toBe('new@example.com');
    const nameInput = userFormElement.querySelector('input[type="text"]');
    expect(nameInput.value).toBe('New Name');
  });

  it('should set new user name correctly', async () => {
    userFormElement.user.set('name', 'New Name');
    await userFormElement.updateComplete;
    expect(userFormElement.user.name).toBe('New Name');
    const nameInput = userFormElement.querySelector('input[type="text"]');
    expect(nameInput.value).toBe('New Name');
  });

  it('should delete user name correctly', async () => {
    userFormElement.user.set('name', 'New Name');
    await userFormElement.updateComplete;
    userFormElement.user.delete('name');
    await userFormElement.updateComplete;
    expect(userFormElement.user.value.name).toBeUndefined();
    const nameInput = userFormElement.querySelector('input[type="text"]');
    expect(nameInput.value).toBe('undefined');
  });

  it('should set new user name correctly', async () => {
    userFormElement.user.set('name', 'New Name');
    await userFormElement.updateComplete;
    expect(userFormElement.user.value.name).toBe('New Name');
    const nameInput = userFormElement.querySelector('input[type="text"]');
    expect(nameInput.value).toBe('New Name');
  });

  it('should clear user data correctly', async () => {
    userFormElement.user.set('name', 'New Name');
    userFormElement.user.clear();
    await userFormElement.updateComplete;
    const nameInput = userFormElement.querySelector('input[type="text"]');
    expect(nameInput.value).toBe('undefined');
  });
});
