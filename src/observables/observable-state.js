import { Observable } from './observable.js';
import { ObservableStream } from './observable-stream.js';
import { produce } from '../produce.js';
import { __config } from '../config.js';
import { __trace } from '../trace.js';

/**
 * @private
 * @class
 * @description DependencyTracker is an object that holds the current dependency.
 * It is used to track dependencies between observables.
 * @type {Object}
 */
const DependencyTracker = {
  current: null
};

/**
 * @class
 * @extends Observable
 * @description This class extends the Observable class and adds methods for updating the value of the observable.
 * @example
 * import { ObservableState } from 'cami-js';
 * const observable = new ObservableState(10);
 * console.log(observable.value); // 10
 */
class ObservableState extends Observable {
  /**
   * @constructor
   * @param {any} initialValue - The initial value of the observable
   * @param {Subscriber} subscriber - The subscriber to the observable
   * @param {Object} options - Additional options for the observable
   * @param {boolean} options.last - Whether the subscriber is the last observer
   * @example
   * const observable = new ObservableState(10);
   */
  constructor(initialValue = null, subscriber = null, {last = false, name = null} = {}) {
    super();
    if (last) {
      this.__lastObserver = subscriber;
    } else {
      this.__observers.push(subscriber);
    }
    this.__value = produce(initialValue, draft => {});
    this.__pendingUpdates = [];
    this.__updateScheduled = false;
    this.__name = name;
  }

  /**
   * @method
   * @returns {any} The current value of the observable
   * @example
   * const value = observable.value;
   */
  get value() {
    if (DependencyTracker.current != null) {
      DependencyTracker.current.addDependency(this);
    }
    return this.__value;
  }

  /**
   * @method
   * @param {any} newValue - The new value to set for the observable
   * @description This method sets a new value for the observable by calling the update method with the new value.
   * @example
   * observable.value = 20;
   */
  set value(newValue) {
    this.update(() => newValue);
  }

  /**
   * @method
   * @description Merges properties from the provided object into the observable's value
   * @param {Object} obj - The object whose properties to merge
   * @example
   * observable.assign({ key: 'value' });
   */
  assign(obj) {
    if (typeof this.__value !== 'object' || this.__value === null) {
      throw new Error('[Cami.js] Observable value is not an object');
    }
    this.update(value => Object.assign(value, obj));
  }

  /**
   * @method
   * @description Sets a new value for a specific key in the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.
   * @param {string} key - The key to set the new value for
   * @param {any} value - The new value to set
   * @throws Will throw an error if the observable's value is not an object
   * @example
   * observable.set('key.subkey', 'new value');
   */
  set(key, value) {
    if (typeof this.__value !== 'object' || this.__value === null) {
      throw new Error('[Cami.js] Observable value is not an object');
    }
    this.update(state => {
      const keys = key.split('.');
      let current = state;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    });
  }

  /**
   * @method
   * @description Deletes a specific key from the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.
   * @param {string} key - The key to delete
   * @throws Will throw an error if the observable's value is not an object
   * @example
   * observable.delete('key.subkey');
   */
  delete(key) {
    if (typeof this.__value !== 'object' || this.__value === null) {
      throw new Error('[Cami.js] Observable value is not an object');
    }
    this.update(state => {
      const keys = key.split('.');
      let current = state;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      delete current[keys[keys.length - 1]];
    });
  }

  /**
   * @method
   * @description Removes all key/value pairs from the observable's value
   * @example
   * observable.clear();
   */
  clear() {
    this.update(() => ({}));
  }

  /**
   * @method
   * @description Adds one or more elements to the end of the observable's value
   * @param {...any} elements - The elements to add
   * @example
   * observable.push(1, 2, 3);
   */
  push(...elements) {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.push(...elements);
    });
  }

  /**
   * @method
   * @description Removes the last element from the observable's value
   * @example
   * observable.pop();
   */
  pop() {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.pop();
    });
  }

  /**
   * @method
   * @description Removes the first element from the observable's value
   * @example
   * observable.shift();
   */
  shift() {
    if (!Array.isArray(this.__value)) {
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
   * @example
   * observable.splice(0, 1, 'newElement');
   */
  splice(start, deleteCount, ...items) {
    if (!Array.isArray(this.__value)) {
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
   * @example
   * observable.unshift('newElement');
   */
  unshift(...elements) {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.unshift(...elements);
    });
  }

  /**
   * @method
   * @description Reverses the order of the elements in the observable's value
   * @example
   * observable.reverse();
   */
  reverse() {
    if (!Array.isArray(this.__value)) {
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
   * @example
   * observable.sort((a, b) => a - b);
   */
  sort(compareFunction) {
    if (!Array.isArray(this.__value)) {
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
   * @param {number} [end=this.__value.length] - The index to stop filling at
   * @example
   * observable.fill('newElement', 0, 2);
   */
  fill(value, start = 0, end = this.__value.length) {
    if (!Array.isArray(this.__value)) {
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
   * @param {number} [end=this.__value.length] - The end index to stop copying elements from
   * @example
   * observable.copyWithin(0, 1, 2);
   */
  copyWithin(target, start, end = this.__value.length) {
    if (!Array.isArray(this.__value)) {
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
   * @example
   * observable.update(value => value + 1);
   */
  update(updater) {
    this.__pendingUpdates.push(updater);
    this.__scheduleupdate();
  }

  __scheduleupdate() {
    if (!this.__updateScheduled) {
      this.__updateScheduled = true;
      this.__applyUpdates();
    }
  }

  /**
   * @private
   * @method
   * @description This method notifies all observers of the observable with the current value.
   * It first creates a list of observers by combining the regular observers and the last observer.
   * Then, it iterates over this list and calls each observer with the current value.
   * If the observer is a function, it is called directly.
   * If the observer is an object with a 'next' method, the 'next' method is called.
   */
  __notifyObservers() {
    const observersWithLast = [...this.__observers, this.__lastObserver];
    observersWithLast.forEach(observer => {
      if (observer && typeof observer === 'function') {
        observer(this.__value);
      } else if (observer && observer.next) {
        observer.next(this.__value);
      }
    });
  }

  /**
   * @method
   * @private
   * @description This method applies all the pending updates to the value.
   * It then notifies all the observers with the updated value.
   */
  __applyUpdates() {
    let oldValue = this.__value;
    while (this.__pendingUpdates.length > 0) {
      const updater = this.__pendingUpdates.shift();
      if ((typeof this.__value === 'object' && this.__value !== null && this.__value.constructor === Object) || Array.isArray(this.__value)) {
        this.__value = produce(this.__value, updater);
      } else {
        this.__value = updater(this.__value);
      }
    }
    if (oldValue !== this.__value) {
      this.__notifyObservers();

      if (__config.events.isEnabled && typeof window !== 'undefined') {
        const event = new CustomEvent('cami:state:change', {
          detail: {
            name: this.__name,
            oldValue: oldValue,
            newValue: this.__value
          }
        });
        window.dispatchEvent(event);
      }

      __trace('cami:state:change', this.__name, oldValue, this.__value);
    }
    this.__updateScheduled = false;
  }

  /**
   * @method
   * @description Converts the ObservableState to an ObservableStream.
   * @returns {ObservableStream} The ObservableStream that emits the same values as the ObservableState.
   * @example
   * const stream = observable.toStream();
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
   * @example
   * observable.complete();
   */
  complete() {
    this.__observers.forEach(observer => {
      if (observer && typeof observer.complete === 'function') {
        observer.complete();
      }
    });
  }
}

/**
 * @class
 * @extends ObservableState
 * @description ComputedState class that extends ObservableState and holds additional methods for computed observables
 */
class ComputedState extends ObservableState {
  /**
   * @constructor
   * @param {Function} computeFn - The function to compute the value of the observable
   * @example
   * const computedState = new ComputedState(() => observable.value * 2);
   */
  constructor(computeFn) {
    super(null);
    this.computeFn = computeFn;
    this.dependencies = new Set();
    this.subscriptions = new Map();
    this.__compute();
  }

  /**
   * @method
   * @returns {any} The current value of the observable
   * @example
   * const value = computedState.value;
   */
  get value() {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this);
    }
    return this.__value;
  }

  /**
   * @private
   * @method
   * @description Computes the new value of the observable and notifies observers if it has changed
   */
  __compute() {
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
          const subscription = observable.onValue(() => this.__compute());
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

    if (newValue !== this.__value) {
      this.__value = newValue;
      this.__notifyObservers();
    }
  }

  /**
   * @method
   * @description Unsubscribes from all dependencies
   * @example
   * // Assuming `obs` is an instance of ObservableState
   * obs.dispose(); // This will unsubscribe obs from all its dependencies
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
 * @example
 * // Assuming `computeFn` is a function that computes the value of the observable
 * const computedValue = computed(computeFn);
 */
const computed = function(computeFn) {
  return new ComputedState(computeFn);
};

/**
 * @function
 * @param {Function} effectFn - The function to call for the effect
 * @returns {Function} A function that when called, unsubscribes from all dependencies and runs cleanup function
 * @description This function sets up an effect that is run when the observable changes
 * @example
 * // Assuming `effectFn` is a function that is called when the observable changes
 * const effectFunction = effect(effectFn);
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
        const subscription = observable.onValue(_runEffect);
        dependencies.add(observable);
        subscriptions.set(observable, subscription);
      }
    }
  };

  /**
   * The _runEffect function is responsible for running the effect function and managing its dependencies.
   * Before the effect function is run, any cleanup from the previous run is performed and the current tracker
   * is set to this tracker. This allows the effect function to add dependencies via the tracker while it is running.
   * After the effect function has run, the current tracker is set back to null to prevent further dependencies
   * from being added outside of the effect function.
   * The effect function is expected to return a cleanup function, which is saved for the next run.
   * The cleanup function, initially empty, is replaced by the one returned from effectFn (run by the observable) before each new run and on effect disposal.
   */
  const _runEffect = () => {
    cleanup();
    DependencyTracker.current = tracker;
    cleanup = effectFn() || (() => {});
    DependencyTracker.current = null;
  };

  if (typeof window !== 'undefined') {
    requestAnimationFrame(_runEffect);
  } else {
    setTimeout(_runEffect, 0);
  }

  /**
   * @method
   * @description Unsubscribes from all dependencies and runs cleanup function
   * @returns {void}
   * @example
   * // Assuming `dispose` is the function returned by `effect`
   * dispose(); // This will unsubscribe from all dependencies and run cleanup function
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
