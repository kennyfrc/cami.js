import { ObservableState } from './observable-state.js';
/**
 * @typedef ObservableProxy
 * @property {function(): any} get - A getter function that returns the current value of the property. If the property is a primitive value, this will return the value directly from the ObservableState instance. If the property is a non-primitive value, this will return an ObservableProxy that wraps the ObservableState instance. This getter is used when accessing a non-primitive property on a ReactiveElement instance. We use Proxy instead of Object.defineProperty because it allows us to handle nested properties.
 * @property {function(any): void} set - A setter function that updates the value of the property. It updates the ObservableState instance with the new value. This setter is used when assigning a new value to a non-primitive property on a ReactiveElement instance.
 */
class ObservableProxy {
  constructor(observable) {
    if (!(observable instanceof ObservableState)) {
      throw new TypeError('Expected observable to be an instance of ObservableState');
    }

    return new Proxy(observable, {
      get: (target, property) => {
        if (typeof target[property] === 'function') {
          return target[property].bind(target);
        } else if (property in target) {
          return target[property];
        } else if (typeof target.value[property] === 'function') {
          return (...args) => target.value[property](...args);
        } else {
          return target.value[property];
        }
      },
      set: (target, property, value) => {
        target[property] = value;
        target.update(() => target.value);
        return true;
      }
    });
  }
}

export { ObservableProxy };
