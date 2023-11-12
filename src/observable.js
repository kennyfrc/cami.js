/**
 * @module observable
 * @description This module exports the Observable class
 * @requires immer
 */

import { produce } from "immer";

/**
 * @typedef {Object} Observable
 * @property {any} _value - The current value of the observable
 * @property {Array} _observers - The list of observers subscribed to the observable
 * @property {Object} _lastObserver - The last observer to be notified
 */

/**
 * @class
 * @description Observable class that holds a value and allows updates to it.
 * It uses the Immer library to handle immutable updates.
 */
class Observable {
  /**
   * @constructor
   * @param {any} initialValue - The initial value for the observable
   * @param {Object} lastObserver - The last observer to be notified. Useful for rendering the template last
   * @param {Object} options - Options for the observable
   * @param {boolean} options.last - If true, the last observer will be notified last
   */
  constructor(initialValue = null, lastObserver = null, {last = false} = {}) {
    this._value = produce(initialValue, draft => {});
    this._observers = [];
    this._lastObserver = lastObserver;
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
    const observersWithLast = [...this._observers, this._lastObserver];
    observersWithLast.forEach(observer => {
      observer.next(this._value);
    });
  }

  /**
   * @method
   * @param {Object|Function} next - The observer object to be subscribed to the observable or a function to be called when the observable updates
   * @param {Function} error - Function to be called when an error occurs
   * @param {Function} complete - Function to be called when the observable completes
   * @param {AbortSignal} signal - Signal to abort the observer
   * @returns {Function} A function that when called, will unsubscribe the observer from the observable
   * @description This method subscribes a new observer to the observable and returns an unsubscribe function
   */
  register(next, error, complete, signal) {
    let observer;

    if (typeof next === 'function') {
      observer = { next, error, complete };
    } else if (typeof next === 'object' && next !== null) {
      observer = next;
    } else {
      throw new TypeError('Expected the observer to be an object or a function');
    }

    this._observers.push(observer);

    const unsubscribe = () => {
      const index = this._observers.indexOf(observer);
      if (index !== -1) {
        this._observers.splice(index, 1);
      }
      if (observer.teardown) {
        observer.teardown();
      }
    };

    if (signal) {
      signal.addEventListener('abort', unsubscribe);
    }

    return unsubscribe;
  }

  /**
   * @method
   * @param {any} value - The new value for the observable
   * @returns {void}
   * @description This method updates the value of the observable and notifies all observers
   */
  next(value) {
    this.update(() => value);
  }

  /**
   * @method
   * @param {any} error - The error to notify all observers about
   * @returns {void}
   * @description This method notifies all observers about an error
   */
  error(error) {
    this._observers.forEach(observer => {
      if (observer.error) {
        observer.error(error);
      }
    });
  }

  /**
   * @method
   * @returns {void}
   * @description This method notifies all observers that the observable is complete
   */
  complete() {
    this._observers.forEach(observer => {
      if (observer.complete) {
        observer.complete();
      }
    });
    // Clear the list of observers since the observable is complete
    this._observers = [];
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

export { Observable, observableMixin }
