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

/**
 * @class
 * @description Subscriber class that holds observer object and related methods
 */
class Subscriber {
  /**
   * @constructor
   * @param {Object|Function} observer - The observer object or function
   */
  constructor(observer) {
    if (typeof observer === 'function') {
      /** @type {Object} */
      this.observer = { next: observer };
    } else {
      /** @type {Object} */
      this.observer = observer;
    }
    /** @type {Array<Function>} */
    this.teardowns = [];
    if (typeof AbortController !== 'undefined') {
      /** @type {AbortController} */
      this.controller = new AbortController();
      /** @type {AbortSignal} */
      this.signal = this.controller.signal;
    }
    this.isUnsubscribed = false;
  }

  /**
   * @method
   * @param {any} result - The result to pass to the observer's next method
   */
  next(result) {
    if (!this.isUnsubscribed && this.observer.next) {
      this.observer.next(result);
    }
  }

  complete() {
    if (!this.isUnsubscribed) {
      if (this.observer.complete) {
        this.observer.complete();
      }
      this.unsubscribe();
    }
  }

  error(error) {
    if (!this.isUnsubscribed) {
      if (this.observer.error) {
        this.observer.error(error);
      }
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
    if (!this.isUnsubscribed) {
      this.isUnsubscribed = true;
      if (this.controller) {
        this.controller.abort();
      }
      this.teardowns.forEach(teardown => {
        if (typeof teardown !== 'function') {
          throw new Error('[Cami.js] Teardown must be a function. Please implement a teardown function in your subscriber.');
        }
        teardown();
      });
    }
  }
}

/**
 * @class
 * @description Observable class that holds a list of observers and related methods
 */
class Observable {
  /**
   * @constructor
   * @param {Function} subscribeCallback - The callback function to call when a new observer subscribes
   * @property {Array<Subscriber>} _observers - The list of observers
   * @property {Function} subscribeCallback - The callback function to call when a new observer subscribes
   */
  constructor(subscribeCallback = () => () => {}) {
    /** @type {Array<Subscriber>} */
    this._observers = [];
    /** @type {Function} */
    this.subscribeCallback = subscribeCallback;
  }

  /**
   * @method
   * @param {Object} observer - The observer to subscribe. Default is an empty function.
   * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
   */
  subscribe(observerOrNext = () => {}, error = () => {}, complete = () => {}) {
    let observer;

    if (typeof observerOrNext === 'function') {
      // If the first argument is a function, we assume it's the next callback
      observer = {
        next: observerOrNext,
        error,
        complete,
      };
    } else if (typeof observerOrNext === 'object') {
      // If the first argument is an object, we assume it's an observer
      observer = observerOrNext;
    } else {
      throw new Error('[Cami.js] First argument to subscribe must be a next callback or an observer object');
    }

    const subscriber = new Subscriber(observer);
    let teardown = () => {};

    try {
      teardown = this.subscribeCallback(subscriber);
    } catch (error) {
      if (subscriber.error) {
        subscriber.error(error);
      } else {
        console.error('[Cami.js] Error in Subscriber:', error);
      }
      return;
    }

    subscriber.addTeardown(teardown);
    this._observers.push(subscriber);

    return {
      unsubscribe: () => subscriber.unsubscribe(),
      complete: () => subscriber.complete(),
      error: (err) => subscriber.error(err),
    };
  }

  /**
   * @method
   * @param {*} value - The value to be passed to the observer's next method.
   */
  next(value) {
    this._observers.forEach(observer => {
      observer.next(value);
    });
  }

  /**
   * @method
   * @param {*} error - The error to be passed to the observer's error method.
   */
  error(error) {
    this._observers.forEach(observer => {
      observer.error(error);
    });
  }

  /**
   * @method
   * Calls the complete method on all observers.
   */
  complete() {
    this._observers.forEach(observer => {
      observer.complete();
    });
  }

  /**
   * @method
   * @param {Function} callbackFn - The callback function to call when a new value is emitted.
   * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
   */
  onValue(callbackFn) {
    return this.subscribe({
      next: callbackFn
    });
  }

  /**
   * @method
   * @param {Function} callbackFn - The callback function to call when an error is emitted.
   * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
   */
  onError(callbackFn) {
    return this.subscribe({
      error: callbackFn
    });
  }

  /**
   * @method
   * @param {Function} callbackFn - The callback function to call when the observable completes.
   * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
   */
  onEnd(callbackFn) {
    return this.subscribe({
      complete: callbackFn
    });
  }

  [Symbol.asyncIterator]() {
    let observer;
    let resolve;
    let promise = new Promise(r => (resolve = r));

    observer = {
      next: value => {
        resolve({ value, done: false });
        promise = new Promise(r => (resolve = r));
      },
      complete: () => {
        resolve({ done: true });
      },
      error: err => {
        throw err;
      },
    };

    this.subscribe(observer);

    return {
      next: () => promise,
    };
  }
}

export { Observable };
