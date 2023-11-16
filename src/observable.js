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
        return () => {};
      });
    } else {
      throw new TypeError('[Cami.js] ObservableStream.from requires an Observable, AsyncIterable, Iterable, or Promise');
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
   * @param {Function} transformFn - The function to transform the data into Observables
   * @returns {ObservableStream} A new ObservableStream that emits the values from the inner Observables
   */
  switchMap(transformFn) {
    return new ObservableStream(subscriber => {
      let innerSubscription = null;

      const sourceSubscription = this.subscribe({
        next: value => {
          if (innerSubscription) {
            innerSubscription.unsubscribe();
          }

          const innerObservable = transformFn(value);
          innerSubscription = innerObservable.subscribe({
            next: innerValue => subscriber.next(innerValue),
            error: err => subscriber.error(err),
            complete: () => {
              if (innerSubscription) {
                innerSubscription.unsubscribe();
                innerSubscription = null;
              }
            },
          });
        },
        error: err => subscriber.error(err),
        complete: () => {
          if (innerSubscription) {
            innerSubscription.unsubscribe();
          }
          subscriber.complete();
        },
      });

      return () => {
        sourceSubscription.unsubscribe();
        if (innerSubscription) {
          innerSubscription.unsubscribe();
        }
      };
    });
  };

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

  /**
   * @method
   * @description Converts the ObservableStream to an ObservableState
   * @returns {ObservableState} A new ObservableState that represents the current value of the stream
   */
  toState(initialValue = null) {
    const state = new ObservableState(initialValue);
    this.onValue(value => state.update(() => value));
    return state;
  }

  /**
   * @method
   * @description Emits a new value to the stream
   * @param {any} value - The value to emit
   */
  emit(value) {
    this._observers.forEach(observer => observer.next(value));
  }
}

/**
 * @class
 * @description Observable class that wraps a DOM element and allows observing its events.
 */
class ObservableElement extends ObservableStream {
  /**
   * @constructor
   * @param {string|Element} selectorOrElement - The CSS selector of the element to observe or the DOM element itself
   * @throws {Error} If no element matches the provided selector or the provided DOM element is null
   */
  constructor(selectorOrElement) {
    super();
    /** @type {Element} */
    if (typeof selectorOrElement === 'string') {
      this.element = document.querySelector(selectorOrElement);
      if (!this.element) {
        throw new Error(`Element not found for selector: ${selectorOrElement}`);
      }
    } else if (selectorOrElement instanceof Element || selectorOrElement instanceof Document) {
      this.element = selectorOrElement;
    } else {
      throw new Error(`Invalid argument: ${selectorOrElement}`);
    }
  }

  /**
   * @method
   * @param {string} eventType - The type of the event to observe
   * @param {Object} options - The options to pass to addEventListener
   * @returns {ObservableStream} An ObservableStream that emits the observed events
   */
  on(eventType, options = {}) {
    return new ObservableStream(subscriber => {
      const eventListener = event => {
        subscriber.next(event);
      };

      this.element.addEventListener(eventType, eventListener, options);

      return () => {
        this.element.removeEventListener(eventType, eventListener, options);
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
   * @description Adds an element to the end of the observable's value
   * @param {any} element - The element to add
   */
  push(element) {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.push(element);
    });
  }

  /**
   * @method
   * @description Removes an element from the end of the observable's value
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
   * @description Adds, removes, or replaces elements in the observable's value
   * @param {number} start - The index at which to start changing the array
   * @param {number} deleteCount - The number of elements to remove
   * @param {...any} items - The elements to add to the array
   */
  splice(start, deleteCount, ...items) {
    if (!Array.isArray(this._value)) {
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
      value.splice(start, deleteCount, ...items);
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

export { ObservableState, ObservableStream, ObservableElement, Observable, computed, batch, effect };
