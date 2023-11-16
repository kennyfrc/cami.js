import { Observable } from './observable.js';
import { produce } from 'immer';

/**
 * @class
 * @description Observable class that holds a value and allows updates to it.
 * It uses the Immer library to handle immutable updates.
 */
class ObservableState extends Observable {
  /**
   * @constructor
   * @param {any} initialValue - The initial value of the observable
   * @param {Subscriber} subscriber - The subscriber to the observable
   * @param {Object} options - Additional options for the observable
   * @param {boolean} options.last - Whether the subscriber is the last observer
   */
  constructor(initialValue = null, subscriber = null, {last = false} = {}) {
    super();
    if (last) {
      /** @type {Subscriber} */
      this._lastObserver = subscriber;
    } else {
      this._observers.push(subscriber);
    }
    /** @type {any} */
    this._value = produce(initialValue, draft => {});
    /** @type {Array<Function>} */
    this._pendingUpdates = [];
    /** @type {boolean} */
    this._updateScheduled = false;
  }

  /**
   * @method
   * @returns {any} The current value of the observable
   */
  get value() {
    if (ComputedState.isComputing != null) {
      ComputedState.isComputing.addDependency(this);
    }
    return this._value;
  }

  /**
   * @method
   * @param {any} newValue - The new value to set for the observable
   * @description This method sets a new value for the observable by calling the update method with the new value.
   */
  set value(newValue) {
    this.update(() => newValue);
  }

  /**
   * @method
   * @description Merges properties from the provided object into the observable's value
   * @param {Object} obj - The object whose properties to merge
   */
  assign(obj) {
    if (typeof this._value !== 'object' || this._value === null) {
      throw new Error('[Cami.js] Observable value is not an object');
    }
    this.update(value => Object.assign(value, obj));
  }

  /**
   * @method
   * @description Sets a new key/value pair in the observable's value
   * @param {any} key - The key to set
   * @param {any} value - The value to set
   */
  set(key, value) {
    if (typeof this._value !== 'object' || this._value === null) {
      throw new Error('[Cami.js] Observable value is not an object');
    }
    this.update(state => {
      state[key] = value;
    });
  }

  /**
   * @method
   * @description Removes a key/value pair from the observable's value
   * @param {any} key - The key to remove
   */
  delete(key) {
    if (typeof this._value !== 'object' || this._value === null) {
      throw new Error('[Cami.js] Observable value is not an object');
    }
    this.update(state => {
      delete state[key];
    });
  }

  /**
   * @method
   * @description Removes all key/value pairs from the observable's value
   */
  clear() {
    this.update(() => ({}));
  }

  /**
   * @method
   * @description Adds one or more elements to the end of the observable's value
   * @param {...any} elements - The elements to add
   */
  push(...elements) {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.push(...elements);
    });
  }

  /**
   * @method
   * @description Removes the last element from the observable's value
   */
  pop() {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.pop();
    });
  }

  /**
   * @method
   * @description Removes the first element from the observable's value
   */
  shift() {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.shift();
    });
  }

  /**
   * @method
   * @description Changes the contents of the observable's value by removing, replacing, or adding elements
   * @param {number} start - The index at which to start changing the array
   * @param {number} deleteCount - The number of elements to remove
   * @param {...any} items - The elements to add to the array
   */
  splice(start, deleteCount, ...items) {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(arr => {
      arr.splice(start, deleteCount, ...items);
    });
  }

  /**
   * @method
   * @description Adds one or more elements to the beginning of the observable's value
   * @param {...any} elements - The elements to add
   */
  unshift(...elements) {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.unshift(...elements);
    });
  }

  /**
   * @method
   * @description Reverses the order of the elements in the observable's value
   */
  reverse() {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.reverse();
    });
  }

  /**
   * @method
   * @description Sorts the elements in the observable's value
   * @param {Function} [compareFunction] - The function used to determine the order of the elements
   */
  sort(compareFunction) {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.sort(compareFunction);
    });
  }

  /**
   * @method
   * @description Changes all elements in the observable's value to a static value
   * @param {any} value - The value to fill the array with
   * @param {number} [start=0] - The index to start filling at
   * @param {number} [end=this._value.length] - The index to stop filling at
   */
  fill(value, start = 0, end = this._value.length) {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(arr => {
      arr.fill(value, start, end);
    });
  }

  /**
   * @method
   * @description Shallow copies part of the observable's value to another location in the same array
   * @param {number} target - The index to copy the elements to
   * @param {number} start - The start index to begin copying elements from
   * @param {number} [end=this._value.length] - The end index to stop copying elements from
   */
  copyWithin(target, start, end = this._value.length) {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(arr => {
      arr.copyWithin(target, start, end);
    });
  }

  /**
   * @method
   * @param {Function} updater - The function to update the value
   * @description This method adds the updater function to the pending updates queue.
   * It uses a synchronous approach to schedule the updates, ensuring the whole state is consistent at each tick.
   * This is done to batch multiple updates together and avoid unnecessary re-renders.
   */
  update(updater) {
    this._pendingUpdates.push(updater);
    if (!this._updateScheduled) {
      this._updateScheduled = true;
      if (typeof window !== 'undefined') {
        requestAnimationFrame(this._applyUpdates.bind(this));
      } else {
        Promise.resolve().then(this._applyUpdates.bind(this));
      }
    }
  }

  /**
   * @method
   * @description This method notifies all observers of the observable with the current value.
   * It first creates a list of observers by combining the regular observers and the last observer.
   * Then, it iterates over this list and calls each observer with the current value.
   * If the observer is a function, it is called directly.
   * If the observer is an object with a 'next' method, the 'next' method is called.
   */
  notifyObservers() {
    const observersWithLast = [...this._observers, this._lastObserver];
    observersWithLast.forEach(observer => {
      if (observer && typeof observer === 'function') {
        observer(this._value);
      } else if (observer && observer.next) {
        observer.next(this._value);
      }
    });
  }

  /**
   * @method
   * @private
   * @description This method applies all the pending updates to the value.
   * It then notifies all the observers with the updated value.
   */
  _applyUpdates() {
    let oldValue = this._value;
    while (this._pendingUpdates.length > 0) {
      const updater = this._pendingUpdates.shift();
      this._value = produce(this._value, updater);
    }
    if (oldValue !== this._value) {
      this.notifyObservers();
    }
    this._updateScheduled = false;
  }
}

/**
 * @class
 * @description ComputedState class that extends ObservableState and holds additional methods for computed observables
 */
class ComputedState extends ObservableState {
  constructor(computeFn, context) {
    super(null);
    /** @type {Function} */
    this.computeFn = computeFn;
    /** @type {Object} */
    this.context = context;
    /** @type {Set<ObservableState>} */
    this.dependencies = new Set();
    /** @type {Set<ComputedState>} */
    this.children = new Set();
    /** @type {Map<ObservableState, Object>} */
    this.subscriptions = new Map();
    this.compute();
  }

  get value() {
    ComputedState.isComputing = this;
    const value = this.computeFn.call(this.context);
    ComputedState.isComputing = null;
    return value;
  }

  compute() {
    this.notifyChildren();
    this._value = this.computeFn.call(this.context);
    this.notifyObservers();
  }

  addDependency(observable) {
    if (!this.dependencies.has(observable)) {
      const subscription = observable.onValue(() => this.compute());
      this.dependencies.add(observable);
      this.subscriptions.set(observable, subscription);
      if (observable instanceof ComputedState) {
        observable.addChild(this);
      }
    }
  }

  dispose() {
    this.notifyChildren();
    this.dependencies.forEach((observable) => {
      const subscription = this.subscriptions.get(observable);
      if (subscription) {
        subscription.unsubscribe();
      }
      this.dependencies.delete(observable);
      this.subscriptions.delete(observable);
      if (observable instanceof ComputedState) {
        observable.removeChild(this);
      }
    });
  }

  addChild(child) {
    this.children.add(child);
  }

  removeChild(child) {
    this.children.delete(child);
  }

  notifyChildren() {
    this.children.forEach(child => {
      child.dispose();
    });
    this.children.clear();
  }
}

/**
 * @function
 * @param {Function} computeFn - The function to compute the value of the observable
 * @returns {ComputedState} A new instance of ComputedState
 */
const computed = function(computeFn) {
  return new ComputedState(computeFn, this);
};

/**
 * @function
 * @param {Function} callback - The function to call in a batch update
 * @returns {void}
 * @description This function sets the _isWithinBatch flag, calls the callback, then resets the flag and calls react
 * Note: only works with update()
 */
const batch = function(callback) {
  this._isWithinBatch = true;
  Promise.resolve().then(callback).finally(() => {
    this._isWithinBatch = false;
    this.react();
  });
};

/**
 * @function
 * @param {Function} effectFn - The function to call for the effect
 * @returns {void}
 * @description This function sets up an effect that is run when the observable changes
 */
const effect = function(effectFn) {
  let cleanup = () => {};
  const runEffect = () => {
    cleanup();
    cleanup = effectFn.call(this) || (() => {});
  };
  this._effects.push({ effectFn: runEffect, cleanup });
};

export { ObservableState, computed, batch, effect };
