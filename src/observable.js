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

  complete() {
    if (this.observer.complete) {
      this.observer.complete();
    } else if (typeof this.observer.next === 'function') {
      this.observer.next({ complete: true });
    }
    this.unsubscribe();
  }

  error(error) {
    if (this.observer.error) {
      this.observer.error(error);
    } else if (typeof this.observer.next === 'function') {
      this.observer.next({ error: error });
    }
    this.unsubscribe();
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
  constructor(subscribeCallback) {
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
  subscribe(observer = () => {}) {
    const subscriber = new Subscriber(observer);
    const teardown = this.subscribeCallback(subscriber);
    subscriber.addTeardown(teardown);
    this._observers.push(subscriber);
    return {
      unsubscribe: () => subscriber.unsubscribe(),
      complete: () => subscriber.complete(),
      error: (err) => subscriber.error(err),
    };
  }
}

/**
 * @class
 * @description ObservableStream class that extends Observable and provides additional methods for data transformation
 * @extends Observable
 */
class ObservableStream extends Observable {
  /**
   * @method
   * @static
   * @param {any} value - The value to create an Observable from
   * @returns {ObservableStream} A new ObservableStream that emits the values from the value
   */
  static from(value) {
    if (value instanceof Observable) {
      return new ObservableStream(subscriber => {
        const subscription = value.subscribe({
          next: v => subscriber.next(v),
          error: err => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
        return () => {
          if (!subscription.closed) {
            subscription.unsubscribe();
          }
        };
      });
    } else if (value[Symbol.asyncIterator]) {
      return new ObservableStream(subscriber => {
        let isCancelled = false;
        (async () => {
          try {
            for await (const v of value) {
              if (isCancelled) return;
              subscriber.next(v);
            }
            subscriber.complete();
          } catch (err) {
            subscriber.error(err);
          }
        })();
        return () => {
          isCancelled = true;
        };
      });
    } else if (value[Symbol.iterator]) {
      return new ObservableStream(subscriber => {
        try {
          for (const v of value) {
            subscriber.next(v);
          }
          subscriber.complete();
        } catch (err) {
          subscriber.error(err);
        }
        return () => {
          if (!subscription.closed) {
            subscription.unsubscribe();
          }
        };
      });
    } else if (value instanceof Promise) {
      return new ObservableStream(subscriber => {
        value.then(
          v => {
            subscriber.next(v);
            subscriber.complete();
          },
          err => subscriber.error(err)
        );
        return () => {}; // No need to unsubscribe from a Promise
      });
    } else {
      throw new TypeError('ObservableStream.from requires an Observable, AsyncIterable, Iterable, or Promise');
    }
  }

  /**
   * @method
   * @param {Function} transformFn - The function to transform the data
   * @returns {ObservableStream} A new ObservableStream instance with transformed data
   */
  map(transformFn) {
    return new ObservableStream(subscriber => {
      const subscription = this.subscribe({
        next: value => subscriber.next(transformFn(value)),
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * @method
   * @param {Function} predicateFn - The function to filter the data
   * @returns {ObservableStream} A new ObservableStream instance with filtered data
   */
  filter(predicateFn) {
    return new ObservableStream(subscriber => {
      const subscription = this.subscribe({
        next: value => {
          if (predicateFn(value)) {
            subscriber.next(value);
          }
        },
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * @method
   * @param {Function} reducerFn - The function to reduce the data
   * @param {any} initialValue - The initial value for the reducer
   * @returns {Promise} A promise that resolves with the reduced value
   */
  reduce(reducerFn, initialValue) {
    return new Promise((resolve, reject) => {
      let accumulator = initialValue;
      const subscription = this.subscribe({
        next: value => {
          accumulator = reducerFn(accumulator, value);
        },
        error: err => reject(err),
        complete: () => resolve(accumulator),
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * @method
   * @param {Observable} notifier - The Observable that will complete this Observable
   * @returns {ObservableStream} A new ObservableStream that completes when the notifier emits
   */
  takeUntil(notifier) {
    return new ObservableStream(subscriber => {
      const sourceSubscription = this.subscribe({
        next: value => subscriber.next(value),
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      const notifierSubscription = notifier.subscribe({
        next: () => {
          subscriber.complete();
          sourceSubscription.unsubscribe();
          notifierSubscription.unsubscribe();
        },
        error: err => subscriber.error(err),
      });

      return () => {
        sourceSubscription.unsubscribe();
        notifierSubscription.unsubscribe();
      };
    });
  }

  /**
   * @method
   * @param {number} n - The number of values to take
   * @returns {ObservableStream} A new ObservableStream that completes after emitting n values
   */
  take(n) {
    return new ObservableStream(subscriber => {
      let i = 0;
      const subscription = this.subscribe({
        next: value => {
          if (i++ < n) {
            subscriber.next(value);
          } else {
            subscriber.complete();
            subscription.unsubscribe();
          }
        },
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * @method
   * @param {number} n - The number of values to drop
   * @returns {ObservableStream} A new ObservableStream that starts emitting after n values have been emitted
   */
  drop(n) {
    return new ObservableStream(subscriber => {
      let i = 0;
      const subscription = this.subscribe({
        next: value => {
          if (i++ >= n) {
            subscriber.next(value);
          }
        },
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * @method
   * @param {Function} transformFn - The function to transform the data into Observables
   * @returns {ObservableStream} A new ObservableStream that emits the values from the inner Observables
   */
  flatMap(transformFn) {
    return new ObservableStream(subscriber => {
      const subscriptions = new Set();

      const sourceSubscription = this.subscribe({
        next: value => {
          const innerObservable = transformFn(value);
          const innerSubscription = innerObservable.subscribe({
            next: innerValue => subscriber.next(innerValue),
            error: err => subscriber.error(err),
            complete: () => {
              subscriptions.delete(innerSubscription);
              if (subscriptions.size === 0) {
                subscriber.complete();
              }
            },
          });
          subscriptions.add(innerSubscription);
        },
        error: err => subscriber.error(err),
        complete: () => {
          if (subscriptions.size === 0) {
            subscriber.complete();
          }
        },
      });

      return () => {
        sourceSubscription.unsubscribe();
        subscriptions.forEach(subscription => subscription.unsubscribe());
      };
    });
  }

  /**
   * @method
   * @returns {Promise} A promise that resolves with an array of all values emitted by the Observable
   */
  toArray() {
    return new Promise((resolve, reject) => {
      const values = [];
      this.subscribe({
        next: value => values.push(value),
        error: err => reject(err),
        complete: () => resolve(values),
      });
    });
  }

  /**
   * @method
   * @param {Function} callback - The function to call for each value emitted by the Observable
   * @returns {Promise} A promise that resolves when the Observable completes
   */
  forEach(callback) {
    return new Promise((resolve, reject) => {
      this.subscribe({
        next: value => callback(value),
        error: err => reject(err),
        complete: () => resolve(),
      });
    });
  }

  /**
   * @method
   * @param {Function} predicate - The function to test each value
   * @returns {Promise} A promise that resolves with a boolean indicating whether every value satisfies the predicate
   */
  every(predicate) {
    return new Promise((resolve, reject) => {
      let every = true;
      this.subscribe({
        next: value => {
          if (!predicate(value)) {
            every = false;
            resolve(false);
          }
        },
        error: err => reject(err),
        complete: () => resolve(every),
      });
    });
  }

  /**
   * @method
   * @param {Function} predicate - The function to test each value
   * @returns {Promise} A promise that resolves with the first value that satisfies the predicate
   */
  find(predicate) {
    return new Promise((resolve, reject) => {
      const subscription = this.subscribe({
        next: value => {
          if (predicate(value)) {
            resolve(value);
            subscription.unsubscribe();
          }
        },
        error: err => reject(err),
        complete: () => resolve(undefined),
      });
    });
  }

  /**
   * @method
   * @param {Function} predicate - The function to test each value
   * @returns {Promise} A promise that resolves with a boolean indicating whether some value satisfies the predicate
   */
  some(predicate) {
    return new Promise((resolve, reject) => {
      const subscription = this.subscribe({
        next: value => {
          if (predicate(value)) {
            resolve(true);
            subscription.unsubscribe();
          }
        },
        error: err => reject(err),
        complete: () => resolve(false),
      });
    });
  }

  /**
   * @method
   * @param {Function} callback - The function to call when the Observable completes
   * @returns {ObservableStream} A new ObservableStream that calls the callback when it completes
   */
  finally(callback) {
    return new ObservableStream(subscriber => {
      const subscription = this.subscribe({
        next: value => subscriber.next(value),
        error: err => {
          callback();
          subscriber.error(err);
        },
        complete: () => {
          callback();
          subscriber.complete();
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });
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
   * @param {any} initialValue - The initial value of the observable
   * @param {Subscriber} subscriber - The subscriber to the observable
   * @param {Object} options - Additional options for the observable
   * @param {boolean} options.last - Whether the subscriber is the last observer
   */
  constructor(initialValue = null, subscriber = null, {last = false} = {}) {
    super((innerSubscriber) => {
      return () => {};
    });
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
    if (ComputedObservable.isComputing != null) {
      ComputedObservable.isComputing.addDependency(this);
    }
    return this._value;
  }

  /**
   * @method
   * @param {Function} updater - The function to update the value
   * @description This method adds the updater function to the pending updates queue.
   * It uses requestAnimationFrame (rAF) to schedule the updates in the next animation frame.
   * This is done to batch multiple updates together and avoid unnecessary re-renders.
   */
  update(updater) {
    this._pendingUpdates.push(updater);
    if (!this._updateScheduled) {
      this._updateScheduled = true;
      requestAnimationFrame(this._applyUpdates.bind(this));
    }
  }

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
 * @description ComputedObservable class that extends ObservableState and holds additional methods for computed observables
 */
class ComputedObservable extends ObservableState {
  constructor(computeFn, context) {
    super(null);
    /** @type {Function} */
    this.computeFn = computeFn;
    /** @type {Object} */
    this.context = context;
    /** @type {Set<ObservableState>} */
    this.dependencies = new Set();
    /** @type {Set<ComputedObservable>} */
    this.children = new Set();
    /** @type {Map<ObservableState, Object>} */
    this.subscriptions = new Map();
    this.compute();
  }

  get value() {
    ComputedObservable.isComputing = this;
    const value = this.computeFn.call(this.context);
    ComputedObservable.isComputing = null;
    return value;
  }

  compute() {
    this.notifyChildren();
    this._value = this.computeFn.call(this.context);
    this.notifyObservers();
  }

  addDependency(observable) {
    if (!this.dependencies.has(observable)) {
      const subscription = observable.subscribe(() => this.compute());
      this.dependencies.add(observable);
      this.subscriptions.set(observable, subscription);
      if (observable instanceof ComputedObservable) {
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
      if (observable instanceof ComputedObservable) {
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
 * @returns {ComputedObservable} A new instance of ComputedObservable
 */
const computed = function(computeFn) {
  return new ComputedObservable(computeFn, this);
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

export { ObservableState, ObservableStream, Observable, computed, batch, effect };
