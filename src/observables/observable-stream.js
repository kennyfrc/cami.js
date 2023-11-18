import { Observable } from './observable.js';
import { ObservableState } from './observable-state.js';

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
    this.subscribe({
      next: value => state.update(() => value),
      error: err => state.error(err),
      complete: () => state.complete(),
    });
    return state;
  }

  /**
   * @method
   * @description Pushes a value to the observers. The value can be an Observable, an async iterable, an iterable, a Promise, or any other value.
   * @param {any} value - The value to push
   */
  push(value) {
    if (value instanceof Observable) {
      const subscription = value.subscribe({
        next: v => this._observers.forEach(observer => observer.next(v)),
        error: err => this._observers.forEach(observer => observer.error(err)),
        complete: () => this._observers.forEach(observer => observer.complete()),
      });
    } else if (value[Symbol.asyncIterator]) {
      (async () => {
        try {
          for await (const v of value) {
            this._observers.forEach(observer => observer.next(v));
          }
          this._observers.forEach(observer => observer.complete());
        } catch (err) {
          this._observers.forEach(observer => observer.error(err));
        }
      })();
    } else if (value[Symbol.iterator]) {
      try {
        for (const v of value) {
          this._observers.forEach(observer => observer.next(v));
        }
        this._observers.forEach(observer => observer.complete());
      } catch (err) {
        this._observers.forEach(observer => observer.error(err));
      }
    } else if (value instanceof Promise) {
      value.then(
        v => {
          this._observers.forEach(observer => observer.next(v));
          this._observers.forEach(observer => observer.complete());
        },
        err => this._observers.forEach(observer => observer.error(err))
      );
    } else {
      this._observers.forEach(observer => observer.next(value));
    }
  }

  /**
   * @method
   * @description Subscribes to a stream and pushes its values to the observers.
   * @param {ObservableStream} stream - The stream to plug
   */
  plug(stream) {
    stream.subscribe({
      next: value => this.push(value),
      error: err => this._observers.forEach(observer => observer.error(err)),
      complete: () => this._observers.forEach(observer => observer.complete()),
    });
  }

  /**
   * @method
   * @description Ends the stream by calling the complete method of each observer.
   */
  end() {
    this._observers.forEach(observer => {
      if (observer && typeof observer.complete === 'function') {
        observer.complete();
      }
    });
  }
}

export { ObservableStream };
