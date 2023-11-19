import { Observable } from './observable.js';
import { ObservableStream } from './observable-stream.js';
import { produce } from 'immer';
import { camiConfig } from '../cami.js';

/**
 * @type {Object}
 * @description DependencyTracker is an object that holds the current dependency.
 * It is used to track dependencies between observables.
 */
const DependencyTracker = {
  current: null
};

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
  constructor(initialValue = null, subscriber = null, {last = false, name = null} = {}) {
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
    /** @type {string} */
    this._name = name;
  }

  /**
   * @method
   * @returns {any} The current value of the observable
   */
  get value() {
    if (DependencyTracker.current != null) {
      DependencyTracker.current.addDependency(this);
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
        this._applyUpdates();
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

      if (camiConfig.events && typeof window !== 'undefined') {
        const event = new CustomEvent('cami:statechange', {
          detail: {
            name: this._name,
            oldValue: oldValue,
            newValue: this._value
          }
        });
        window.dispatchEvent(event);
      }
    }
    this._updateScheduled = false;
  }

  /**
   * @method
   * @description Converts the ObservableState to an ObservableStream.
   * @returns {ObservableStream} The ObservableStream that emits the same values as the ObservableState.
   */
  toStream() {
    const stream = new ObservableStream();
    this.subscribe({
      next: value => stream.emit(value),
      error: err => stream.error(err),
      complete: () => stream.end(),
    });
    return stream;
  }

  /**
   * @method
   * @description Calls the complete method of all observers.
   */
  complete() {
    this._observers.forEach(observer => {
      if (observer && typeof observer.complete === 'function') {
        observer.complete();
      }
    });
  }
}

/**
 * @class
 * @description ComputedState class that extends ObservableState and holds additional methods for computed observables
 */
class ComputedState extends ObservableState {
  /**
   * @constructor
   * @param {Function} computeFn - The function to compute the value of the observable
   */
  constructor(computeFn) {
    super(null);
    this.computeFn = computeFn;
    this.dependencies = new Set();
    this.subscriptions = new Map();
    this.compute();
  }

  /**
   * @method
   * @returns {any} The current value of the observable
   */
  get value() {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this);
    }
    return this._value;
  }

  /**
   * @method
   * @description Computes the new value of the observable and notifies observers if it has changed
   */
  compute() {
    /**
     * @description The tracker object is used to manage dependencies between observables.
     * It has a method 'addDependency' which takes an observable as an argument.
     * If the observable is not already in the dependencies set, it adds the observable to the set,
     * and sets up a subscription to the observable.
     * The subscription calls the 'compute' method of the ComputedState instance whenever the observable's value changes.
     * This ensures that the ComputedState's value is always up-to-date with its dependencies.
     */
    const tracker = {
      addDependency: (observable) => {
        if (!this.dependencies.has(observable)) {
          const subscription = observable.onValue(() => this.compute());
          this.dependencies.add(observable);
          this.subscriptions.set(observable, subscription);
        }
      }
    };

    /**
     * @description The DependencyTracker is a global object that is used to track dependencies of computed observables.
     * It is set to the current tracker object before the compute function is called.
     * This allows the compute function to add dependencies to the tracker object as it executes.
     * After the compute function has finished executing, the DependencyTracker is set back to null.
     * This is done to prevent further dependencies from being added after the computation is complete.
     * This ensures that the dependencies of the computed observable are accurately tracked and updated.
     */
    DependencyTracker.current = tracker;
    const newValue = this.computeFn();
    DependencyTracker.current = null;

    if (newValue !== this._value) {
      this._value = newValue;
      this.notifyObservers();
    }
  }

  /**
   * @method
   * @description Unsubscribes from all dependencies
   */
  dispose() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}

/**
 * @function
 * @param {Function} computeFn - The function to compute the value of the observable
 * @returns {ComputedState} A new instance of ComputedState
 */
const computed = function(computeFn) {
  return new ComputedState(computeFn);
};

/**
 * @function
 * @param {Function} effectFn - The function to call for the effect
 * @returns {void}
 * @description This function sets up an effect that is run when the observable changes
 */
const effect = function(effectFn) {
  let cleanup = () => {};
  let dependencies = new Set();
  let subscriptions = new Map();

  /**
   * The tracker object is used to keep track of dependencies for the effect function.
   * It provides a method to add a dependency (an observable) to the dependencies set.
   * If the observable is not already a dependency, it is added to the set and a subscription is created
   * to run the effect function whenever the observable's value changes.
   * This mechanism allows the effect function to respond to state changes in its dependencies.
   */
  const tracker = {
    addDependency: (observable) => {
      if (!dependencies.has(observable)) {
        const subscription = observable.onValue(runEffect);
        dependencies.add(observable);
        subscriptions.set(observable, subscription);
      }
    }
  };

  /**
   * The runEffect function is responsible for running the effect function and managing its dependencies.
   * Before the effect function is run, any cleanup from the previous run is performed and the current tracker
   * is set to this tracker. This allows the effect function to add dependencies via the tracker while it is running.
   * After the effect function has run, the current tracker is set back to null to prevent further dependencies
   * from being added outside of the effect function.
   * The effect function is expected to return a cleanup function, which is saved for the next run.
   * The cleanup function, initially empty, is replaced by the one returned from effectFn (run by the observable) before each new run and on effect disposal.
   */
  const runEffect = () => {
    cleanup();
    DependencyTracker.current = tracker;
    cleanup = effectFn() || (() => {});
    DependencyTracker.current = null;
  };

  if (typeof window !== 'undefined') {
    requestAnimationFrame(runEffect);
  } else {
    setTimeout(runEffect, 0);
  }

  /**
   * @method
   * @description Unsubscribes from all dependencies and runs cleanup function
   */
  const dispose = () => {
    subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    cleanup();
  };

  return dispose;
};

export { ObservableState, computed, effect };
