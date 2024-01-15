import { produce } from "../produce.js";

/**
 * @typedef {Object} Observer
 * @description The observer object or function.
 * @property {Function} next - Function to handle new values.
 * @property {Function} error - Function to handle errors.
 * @property {Function} complete - Function to handle completion.
 */

/**
 * @class
 * @description Class representing a Subscriber.
 */
class Subscriber {
  /**
   * @constructor
   * @description Creates a new Subscriber instance.
   * @param {Observer|Function} observer - The observer object or function.
   */
  constructor(observer) {
    if (typeof observer === 'function') {
      this.observer = { next: observer };
    } else {
      this.observer = observer;
    }
    this.teardowns = [];
    if (typeof AbortController !== 'undefined') {
      this.controller = new AbortController();
      this.signal = this.controller.signal;
    }
    this.isUnsubscribed = false;
  }

  /**
   * @method
   * @description Notifies the observer of a new value.
   * @param {any} result - The result to pass to the observer's next method.
   * @example
   * subscriber.next('Hello, world!');
   */
  next(result) {
    if (!this.isUnsubscribed && this.observer.next) {
      this.observer.next(result);
    }
  }

  /**
   * @method
   * @description Notifies the observer that the observable has completed and no more data will be emitted.
   * @example
   * subscriber.complete();
   */
  complete() {
    if (!this.isUnsubscribed) {
      if (this.observer.complete) {
        this.observer.complete();
      }
      this.unsubscribe();
    }
  }

  /**
   * @method
   * @description Notifies the observer that an error has occurred.
   * @param {Error} error - The error to pass to the observer's error method.
   * @example
   * subscriber.error(new Error('Something went wrong'));
   */
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
   * @description Adds a teardown function to the teardowns array.
   * @param {Function} teardown - The teardown function to add to the teardowns array.
   */
  addTeardown(teardown) {
    this.teardowns.push(teardown);
  }

  /**
   * @method
   * @description Unsubscribes from the observable, preventing any further notifications to the observer and triggering any teardown logic.
   * @example
   * subscriber.unsubscribe();
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
 * @description Class representing an Observable.
 */
class Observable {
  /**
   * @constructor
   * @description Creates a new Observable instance.
   * @param {Function} subscribeCallback - The callback function to call when a new observer subscribes.
   */
  constructor(subscribeCallback = () => () => {}) {
    this.__observers = [];
    this.subscribeCallback = subscribeCallback;
  }

  /**
   * @method
   * @description Subscribes an observer to the observable.
   * @param {Observer|Function} observerOrNext - The observer to subscribe or the next function. Default is an empty function.
   * @param {Function} error - The error function. Default is an empty function.
   * @param {Function} complete - The complete function. Default is an empty function.
   * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
   * @example
   * const observable = new Observable();
   * const subscription = observable.subscribe({
   *   next: value => console.log(value),
   *   error: err => console.error(err),
   *   complete: () => console.log('Completed'),
   * });
   */
  subscribe(observerOrNext = () => {}, error = () => {}, complete = () => {}) {
    let observer;

    if (typeof observerOrNext === 'function') {
      observer = {
        next: observerOrNext,
        error,
        complete,
      };
    } else if (typeof observerOrNext === 'object') {
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
    this.__observers.push(subscriber);

    return {
      unsubscribe: () => subscriber.unsubscribe(),
      complete: () => subscriber.complete(),
      error: (err) => subscriber.error(err),
    };
  }

  /**
   * @method
   * @description Passes a value to the observer's next method.
   * @param {*} value - The value to be passed to the observer's next method.
   * @example
   * const observable = new Observable();
   * observable.next('Hello, world!');
   */
  next(value) {
    this.__observers.forEach(observer => {
      observer.next(value);
    });
  }

  /**
   * @method
   * @description Passes an error to the observer's error method.
   * @param {*} error - The error to be passed to the observer's error method.
   * @example
   * const observable = new Observable();
   * observable.error(new Error('Something went wrong'));
   */
  error(error) {
    this.__observers.forEach(observer => {
      observer.error(error);
    });
  }

  /**
   * @method
   * @description Calls the complete method on all observers.
   * @example
   * const observable = new Observable();
   * observable.complete();
   */
  complete() {
    this.__observers.forEach(observer => {
      observer.complete();
    });
  }

  /**
   * @method
   * @description Subscribes an observer with a next function to the observable.
   * @param {Function} callbackFn - The callback function to call when a new value is emitted.
   * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
   * @example
   * const observable = new Observable();
   * const subscription = observable.onValue(value => console.log(value));
   */
  onValue(callbackFn) {
    return this.subscribe({
      next: callbackFn
    });
  }

  /**
   * @method
   * @description Subscribes an observer with an error function to the observable.
   * @param {Function} callbackFn - The callback function to call when an error is emitted.
   * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
   * @example
   * const observable = new Observable();
   * const subscription = observable.onError(err => console.error(err));
   */
  onError(callbackFn) {
    return this.subscribe({
      error: callbackFn
    });
  }

  /**
   * @method
   * @description Subscribes an observer with a complete function to the observable.
   * @param {Function} callbackFn - The callback function to call when the observable completes.
   * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
   * @example
   * const observable = new Observable();
   * const subscription = observable.onEnd(() => console.log('Completed'));
   */
  onEnd(callbackFn) {
    return this.subscribe({
      complete: callbackFn
    });
  }

  /**
   * @method
   * @description Returns an AsyncIterator which allows asynchronous iteration over emitted values.
   * @returns {AsyncIterator} An object that conforms to the AsyncIterator protocol.
   * @example
   * const observable = new Observable();
   * for await (const value of observable) {
   *   console.log(value);
   * }
   */
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
