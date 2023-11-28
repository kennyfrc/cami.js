describe('CounterElement', () => {
  let counter;

  beforeEach(async () => {
    counter = document.createElement('counter-test');
    document.body.appendChild(counter);
    await window.customElements.whenDefined('counter-test');
    await counter.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  afterEach(() => {
    document.body.removeChild(counter);
  });

  it('increments count', () => {
    const incrementButton = counter.querySelector('button:nth-child(2)');
    incrementButton.click();
    incrementButton.click();
    const countDiv = counter.querySelector('div');
    expect(countDiv.textContent).toEqual(`Count: 2`);
  });

  it('decrements count', () => {
    const decrementButton = counter.querySelector('button:nth-child(1)');
    decrementButton.click();
    decrementButton.click();
    const countDiv = counter.querySelector('div');
    expect(countDiv.textContent).toEqual(`Count: -2`);
  });

  it('renders count correctly', () => {
    const countDiv = counter.querySelector('div');
    expect(countDiv.textContent).toEqual(`Count: ${counter.count}`);
  });
});
