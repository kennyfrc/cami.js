/**
 * @module observable
 * @description This module exports the Observable class
 * @requires immer
 */

import { produce } from "immer";

/**
 * @typedef {Object} Observable
 * @property {any} _value - The current value of the observable
 * @property {Array<Subscriber>} _observers - The list of observers subscribed to the observable
 * @property {Subscriber} _lastObserver - The last observer to be notified
 */

class Subscriber {
  /**
   * @constructor
   * @param {Object} observer - The observer object
   */
  constructor(observer) {
    this.observer = observer;
    this.teardowns = [];
    if (typeof AbortController !== 'undefined') {
      this.controller = new AbortController();
      this.signal = this.controller.signal;
    }
  }

  /**
   * @method
   * @param {any} result - The result to pass to the observer's next method
   */
  next(result) {
    if (this.observer.next) {
      this.observer.next(result);
    }
  }

  /**
   * @method
   */
  complete() {
    if (this.observer.complete) {
      this.observer.complete();
      this.unsubscribe();
    }
  }

  /**
   * @method
   * @param {Error} error - The error to pass to the observer's error method
   */
  error(error) {
    if (this.observer.error) {
      this.observer.error(error);
      this.unsubscribe();
    }
  }

  /**
   * @method
   * @param {Function} teardown - The teardown function to add to the teardowns array
   */
  addTeardown(teardown) {
    this.teardowns.push(teardown);
  }

  /**
   * @method
   */
  unsubscribe() {
    if (this.controller) {
      this.controller.abort();
    }
    this.teardowns.forEach(teardown => teardown());
  }
}

class Observable {
  /**
   * @constructor
   * @param {Function} subscribeCallback - The callback function to call when a new observer subscribes
   */
  constructor(subscribeCallback) {
    this._observers = [];
    this.subscribeCallback = subscribeCallback;
  }

  /**
   * @method
   * @param {Object} observer - The observer to subscribe
   * @returns {Object} An object with an unsubscribe method
   */
  subscribe(observer = {}) {
    const subscriber = new Subscriber(observer);
    const teardown = this.subscribeCallback(subscriber);
    subscriber.addTeardown(teardown);
    this._observers.push(subscriber);
    return {
      unsubscribe: () => subscriber.unsubscribe(),
    };
  }
}


/**
 * @class
 * @description Observable class that holds a value and allows updates to it.
 * It uses the Immer library to handle immutable updates.
 */
class ObservableState extends Observable {
  /**
   * @constructor
   * @param {any} initialValue - The initial value for the observable
   * @param {Object} subscriber - The subscriber to be notified. Useful for rendering the template last
   * @param {Object} options - Options for the observable
   * @param {boolean} options.last - If true, the subscriber will be notified last
   */
  constructor(initialValue = null, subscriber = null, {last = false} = {}) {
    super((innerSubscriber) => {
      // This function will be called when subscribe is called on the ObservableState instance
      // Does nothing as we don't need a setup function
      return () => {}; // Teardown logic can be added here
    });
    if (last) {
      this._lastObserver = subscriber;
    } else {
      this._observers.push(subscriber);
    }
    this._value = produce(initialValue, draft => {});
  }
  /**
   * @method
   * @returns {any} The current value of the observable
   */
  get value() {
    return this._value;
  }

  /**
   * @method
   * @param {Function} updater - The function to produce the new value
   * @returns {void}
   * @description This method updates the value of the observable and calls all observer functions
   */
  update(updater) {
    this._value = produce(this._value, updater);
    requestAnimationFrame(() => {
      const observersWithLast = [...this._observers, this._lastObserver];
      observersWithLast.forEach(observer => {
        if (observer && observer.next) {
          observer.next(this._value);
        }
      });
    });
  }
}

/**
 * @function
 * @param {Function} computeFn - The function to compute the value
 * @returns {Object} An object with a getter for the computed value
 */
const computed = function(computeFn) {
  return {
    get value() {
      return computeFn.call(this);
    },
  };
};

/**
 * @function
 * @param {Function} callback - The function to call in a batch update
 * @returns {void}
 * @description This function sets the _isWithinBatch flag, calls the callback, then resets the flag and calls react
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
 * @description This function calls the effect function, stores the cleanup function, and adds the effect to the _effects array
 */
const effect = function(effectFn) {
  const cleanup = effectFn.call(this) || (() => {});
  this._effects.push({ effectFn, cleanup });
};

/**
 * @function
 * @param {Class} BaseClass - The base class to extend
 * @returns {Class} A class that extends the base class with computed, batch, and effect methods
 */
const observableMixin = function(BaseClass) {
  return class extends BaseClass {
    computed = computed;
    batch = batch;
    effect = effect;
  };
}

export { ObservableState, observableMixin }
