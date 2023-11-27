import { Observable } from './observable.js';
import { ObservableState } from './observable-state.js';

/**
 * @class ObservableStream
 * @description ObservableStream class that extends Observable and provides additional methods for data transformation
 * @extends Observable
 */
class ObservableStream extends Observable {
  /**
   * @method
   * @static
   * @param {any} value - The value to create an Observable from
   * @returns {ObservableStream} A new ObservableStream that emits the values from the value
   *
   * @example
   * // Example 1: Creating an ObservableStream from a user event stream
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event));
   * });
   * const observableStream = ObservableStream.from(clickStream);
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
   *
   * @example
   * // Example 1: Transforming an API data stream
   * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
   * const observableStream = ObservableStream.from(apiDataStream);
   * const transformedStream = observableStream.map(data => data.map(item => item * 2));
   *
   * // Example 2: Transforming a user event stream
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event));
   * });
   * const observableStream = ObservableStream.from(clickStream);
   * const transformedStream = observableStream.map(event => ({ x: event.clientX, y: event.clientY }));
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
   *
   * @example
   * // Example 1: Filtering an API data stream
   * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
   * const observableStream = ObservableStream.from(apiDataStream);
   * const filteredStream = observableStream.filter(data => data.someProperty === 'someValue');
   *
   * // Example 2: Filtering a user event stream
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event));
   * });
   * const observableStream = ObservableStream.from(clickStream);
   * const filteredStream = observableStream.filter(event => event.target.id === 'someId');
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
   *
   * @example
   * // Example 1: Reducing an API data stream
   * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
   * const observableStream = ObservableStream.from(apiDataStream);
   * const reducedValuePromise = observableStream.reduce((acc, data) => acc + data.someProperty, 0);
   *
   * // Example 2: Reducing a user event stream
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event));
   * });
   * const observableStream = ObservableStream.from(clickStream);
   * const reducedValuePromise = observableStream.reduce((acc, event) => acc + 1, 0);
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
   *
   * @example
   * // Example 1: Completing an API data stream when another stream emits
   * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
   * const observableStream = ObservableStream.from(apiDataStream);
   * const notifierStream = new ObservableStream(subscriber => {
   *   setTimeout(() => subscriber.next(), 5000);
   * });
   * const completedStream = observableStream.takeUntil(notifierStream);
   *
   * // Example 2: Completing a user event stream when another stream emits
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event));
   * });
   * const observableStream = ObservableStream.from(clickStream);
   * const notifierStream = new ObservableStream(subscriber => {
   *   setTimeout(() => subscriber.next(), 5000);
   * });
   * const completedStream = observableStream.takeUntil(notifierStream);
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
   *
   * @example
   * // Example 1: Taking a certain number of values from an API data stream
   * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
   * const observableStream = ObservableStream.from(apiDataStream);
   * const takenStream = observableStream.take(5);
   *
   * // Example 2: Taking a certain number of values from a user event stream
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event));
   * });
   * const observableStream = ObservableStream.from(clickStream);
   * const takenStream = observableStream.take(5);
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
   *
   * @example
   * // Example 1: Dropping a certain number of values from an API data stream
   * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
   * const observableStream = ObservableStream.from(apiDataStream);
   * const droppedStream = observableStream.drop(5);
   *
   * // Example 2: Dropping a certain number of values from a user event stream
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event));
   * });
   * const observableStream = ObservableStream.from(clickStream);
   * const droppedStream = observableStream.drop(5);
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
   *
   * @example
   * // Example 1: Transforming an API data stream into inner Observables
   * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
   * const observableStream = ObservableStream.from(apiDataStream);
   * const flatMappedStream = observableStream.flatMap(data => ObservableStream.from(fetch(`https://api.example.com/data/${data.id}`).then(response => response.json())));
   *
   * // Example 2: Transforming a user event stream into inner Observables
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event));
   * });
   * const positionStream = clickStream.flatMap(event => ObservableStream.from({ x: event.clientX, y: event.clientY }));
   *
   * // Example 3: Transforming a stream of search terms into a stream of search results
   * const searchTerms = new ObservableStream(subscriber => {
   *   const input = document.querySelector('#search-input');
   *   input.addEventListener('input', event => subscriber.next(event.target.value));
   * });
   * const searchResults = searchTerms.debounce(300).flatMap(term => ObservableStream.from(fetch(`https://api.example.com/search?q=${term}`).then(response => response.json())));
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
   * @example
   * // Example 1: Transforming click events into Observables
   * const clickStream = new ObservableStream();
   * document.addEventListener('click', (event) => clickStream.push(event));
   * const positionStream = clickStream.switchMap((event) => {
   *   return new ObservableStream((subscriber) => {
   *     subscriber.push({ x: event.clientX, y: event.clientY });
   *     subscriber.complete();
   *   });
   * });
   * positionStream.subscribe({
   *   next: (position) => console.log(`Clicked at position: ${position.x}, ${position.y}`),
   *   error: (err) => console.error(err),
   * });
   *
   * // Example 2: Transforming API responses into Observables
   * const apiStream = new ObservableStream();
   * fetch('https://api.example.com/data')
   *   .then((response) => response.json())
   *   .then((data) => apiStream.push(data))
   *   .catch((error) => apiStream.error(error));
   * const transformedStream = apiStream.switchMap((data) => {
   *   return new ObservableStream((subscriber) => {
   *     subscriber.push(transformData(data));
   *     subscriber.complete();
   *   });
   * });
   * transformedStream.subscribe({
   *   next: (transformedData) => console.log(transformedData),
   *   error: (err) => console.error(err),
   * });
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
   * @example
   * // Example: Collecting all emitted values from an ObservableStream
   * const numberStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   numberStream.push(i);
   * }
   * numberStream.end();
   * numberStream.toArray().then((values) => console.log(values)); // Logs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
   * @example
   * // Example: Logging each value emitted by an ObservableStream
   * const numberStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   numberStream.push(i);
   * }
   * numberStream.end();
   * numberStream.forEach((value) => console.log(value)); // Logs each number from 0 to 9
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
   * @example
   * // Example: Checking if all emitted values are even
   * const numberStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   numberStream.push(i);
   * }
   * numberStream.end();
   * numberStream.every((value) => value % 2 === 0).then((allEven) => console.log(allEven)); // Logs: false
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
   * @example
   * // Example: Finding the first emitted value that is greater than 5
   * const numberStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   numberStream.push(i);
   * }
   * numberStream.end();
   * numberStream.find((value) => value > 5).then((value) => console.log(value)); // Logs: 6
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
   * @example
   * // Example: Checking if any emitted values are greater than 5
   * const numberStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   numberStream.push(i);
   * }
   * numberStream.end();
   * numberStream.some((value) => value > 5).then((anyGreaterThan5) => console.log(anyGreaterThan5)); // Logs: true
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
   * @example
   * // Example: Logging a message when the ObservableStream completes
   * const numberStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   numberStream.push(i);
   * }
   * numberStream.end();
   * const finalStream = numberStream.finally(() => console.log('Stream completed'));
   * finalStream.subscribe({
   *   next: (value) => console.log(value),
   *   error: (err) => console.error(err),
   * }); // Logs each number from 0 to 9, then logs 'Stream completed'
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
   * @example
   * // Example: Converting an ObservableStream to an ObservableState
   * const numberStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   numberStream.push(i);
   * }
   * numberStream.end();
   * const numberState = numberStream.toState();
   * numberState.subscribe({
   *   next: (value) => console.log(value),
   *   error: (err) => console.error(err),
   * }); // Logs each number from 0 to 9
   */
  toState(initialValue = null) {
    const state = new ObservableState(initialValue, null, { name: 'ObservableStream' });
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
   * @example
   * // Example 1: Pushing values from an Observable
   * const sourceStream = new ObservableStream();
   * const targetStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   sourceStream.push(i);
   * }
   * sourceStream.end();
   * targetStream.push(sourceStream);
   * targetStream.subscribe({
   *   next: (value) => console.log(value),
   *   error: (err) => console.error(err),
   * }); // Logs each number from 0 to 9
   *
   * // Example 2: Pushing values from a Promise
   * const promiseStream = new ObservableStream();
   * const promise = new Promise((resolve) => {
   *   setTimeout(() => resolve('Hello, world!'), 1000);
   * });
   * promiseStream.push(promise);
   * promiseStream.subscribe({
   *   next: (value) => console.log(value),
   *   error: (err) => console.error(err),
   * }); // Logs 'Hello, world!' after 1 second
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
   * @example
   * // Example: Plugging one ObservableStream into another
   * const sourceStream = new ObservableStream();
   * const targetStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   sourceStream.push(i);
   * }
   * sourceStream.end();
   * targetStream.plug(sourceStream);
   * targetStream.subscribe({
   *   next: (value) => console.log(value),
   *   error: (err) => console.error(err),
   * }); // Logs each number from 0 to 9
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
   * @example
   * // Example: Ending an ObservableStream
   * const numberStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   numberStream.push(i);
   * }
   * numberStream.end();
   * numberStream.subscribe({
   *   next: (value) => console.log(value),
   *   error: (err) => console.error(err),
   *   complete: () => console.log('Stream completed'),
   * }); // Logs each number from 0 to 9, then logs 'Stream completed'
   */
  end() {
    this._observers.forEach(observer => {
      if (observer && typeof observer.complete === 'function') {
        observer.complete();
      }
    });
  }

  /**
   * @method
   * @description Catches errors on the ObservableStream and replaces them with a new stream.
   * @param {Function} fn - A function that receives the error and returns a new ObservableStream.
   * @returns {ObservableStream} - Returns a new ObservableStream that replaces the original stream when an error occurs.
   * @example
   * // Example: Catching and handling errors in an ObservableStream
   * const numberStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   if (i === 5) {
   *     numberStream.error(new Error('Something went wrong'));
   *   } else {
   *     numberStream.push(i);
   *   }
   * }
   * numberStream.end();
   * const errorHandledStream = numberStream.catchError((error) => {
   *   console.error(error);
   *   return new ObservableStream((subscriber) => {
   *     subscriber.push('Error handled');
   *     subscriber.complete();
   *   });
   * });
   * errorHandledStream.subscribe({
   *   next: (value) => console.log(value),
   *   error: (err) => console.error(err),
   * }); // Logs each number from 0 to 4, logs the error, then logs 'Error handled'
   */
  catchError(fn) {
    return new ObservableStream(subscriber => {
      const subscription = this.subscribe({
        next: value => subscriber.next(value),
        error: err => {
          const newStream = fn(err);
          newStream.subscribe({
            next: value => subscriber.next(value),
            error: err => subscriber.error(err),
            complete: () => subscriber.complete(),
          });
        },
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * @method
   * @param {number} delay - The debounce delay in milliseconds
   * @returns {ObservableStream} A new ObservableStream that emits the latest value after the debounce delay
   * @example
   * // Example: Debouncing an ObservableStream of click events
   * const clickStream = new ObservableStream();
   * document.addEventListener('click', (event) => clickStream.push(event));
   * const debouncedStream = clickStream.debounce(500);
   * debouncedStream.subscribe({
   *   next: (event) => console.log(`Clicked at position: ${event.clientX}, ${event.clientY}`),
   *   error: (err) => console.error(err),
   * }); // Logs the position of the last click event that occurred at least 500 milliseconds after the previous click event
   */
  debounce(delay) {
    return new ObservableStream(subscriber => {
      let timeoutId = null;
      const subscription = this.subscribe({
        next: value => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            subscriber.next(value);
          }, delay);
        },
        error: err => subscriber.error(err),
        complete: () => {
          clearTimeout(timeoutId);
          subscriber.complete();
        },
      });

      return () => {
        clearTimeout(timeoutId);
        subscription.unsubscribe();
      };
    });
  }

  /**
   * @method
   * @param {Function} sideEffectFn - The function to perform side effect
   * @returns {ObservableStream} A new ObservableStream that is identical to the source
   * @example
   * // Example: Logging each value emitted by an ObservableStream
   * const numberStream = new ObservableStream();
   * for (let i = 0; i < 10; i++) {
   *   numberStream.push(i);
   * }
   * numberStream.end();
   * const loggedStream = numberStream.tap((value) => console.log(value));
   * loggedStream.subscribe({
   *   next: (value) => {},
   *   error: (err) => console.error(err),
   * }); // Logs each number from 0 to 9
   */
  tap(sideEffectFn) {
    return new ObservableStream(subscriber => {
      const subscription = this.subscribe({
        next: value => {
          sideEffectFn(value);
          subscriber.next(value);
        },
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * @method
   * @param {number} duration - The throttle duration in milliseconds
   * @returns {ObservableStream} A new ObservableStream that emits a value then ignores subsequent source values for duration milliseconds, then repeats this process.
   * @example
   * // Example 1: Throttling scroll events
   * const scrollStream = new ObservableStream(subscriber => {
   *   window.addEventListener('scroll', event => subscriber.next(event));
   * });
   * const throttledScrollStream = scrollStream.throttle(200);
   * throttledScrollStream.subscribe({
   *   next: (event) => console.log('Scroll event:', event),
   *   error: (err) => console.error(err),
   * });
   *
   * // Example 2: Throttling search input for autocomplete
   * const searchInput = document.querySelector('#search-input');
   * const searchStream = new ObservableStream(subscriber => {
   *   searchInput.addEventListener('input', event => subscriber.next(event.target.value));
   * });
   * const throttledSearchStream = searchStream.throttle(300);
   * throttledSearchStream.subscribe({
   *   next: (searchTerm) => console.log('Search term:', searchTerm),
   *   error: (err) => console.error(err),
   * });
   */
  throttle(duration) {
    return new ObservableStream(subscriber => {
      let lastEmitTime = 0;
      const subscription = this.subscribe({
        next: value => {
          const currentTime = Date.now();
          if (currentTime - lastEmitTime > duration) {
            lastEmitTime = currentTime;
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
   * @returns {ObservableStream} A new ObservableStream that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
   * @example
   * // Example 1: Filtering out consecutive duplicate search terms
   * const searchInput = document.querySelector('#search-input');
   * const searchStream = new ObservableStream(subscriber => {
   *   searchInput.addEventListener('input', event => subscriber.next(event.target.value));
   * });
   * const distinctSearchStream = searchStream.distinctUntilChanged();
   * distinctSearchStream.subscribe({
   *   next: (searchTerm) => console.log('Search term:', searchTerm),
   *   error: (err) => console.error(err),
   * });
   *
   * // Example 2: Filtering out consecutive duplicate API responses
   * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
   * const observableStream = ObservableStream.from(apiDataStream);
   * const distinctDataStream = observableStream.distinctUntilChanged();
   * distinctDataStream.subscribe({
   *   next: (data) => console.log('API data:', data),
   *   error: (err) => console.error(err),
   * });
   */
  distinctUntilChanged() {
    return new ObservableStream(subscriber => {
      let lastValue;
      let isFirstValue = true;
      const subscription = this.subscribe({
        next: value => {
          if (isFirstValue || value !== lastValue) {
            isFirstValue = false;
            lastValue = value;
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
   * @param {function} transformFn - The function to transform each value in the source ObservableStream
   * @returns {ObservableStream} A new ObservableStream that emits the results of applying a given transform function to each value emitted by the source ObservableStream, sequentially.
   * @example
   * // Example 1: Transforming a stream of search terms into a stream of search results
   * const searchInput = document.querySelector('#search-input');
   * const searchStream = new ObservableStream(subscriber => {
   *   searchInput.addEventListener('input', event => subscriber.next(event.target.value));
   * });
   * const resultsStream = searchStream.concatMap(searchTerm =>
   *   ObservableStream.from(fetch(`https://api.example.com/search?query=${searchTerm}`).then(response => response.json()))
   * );
   * resultsStream.subscribe({
   *   next: (results) => console.log('Search results:', results),
   *   error: (err) => console.error(err),
   * });
   *
   * // Example 2: Transforming a stream of click events into a stream of clicked elements
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event.target));
   * });
   * const elementsStream = clickStream.concatMap(target =>
   *   ObservableStream.from(Promise.resolve(target))
   * );
   * elementsStream.subscribe({
   *   next: (element) => console.log('Clicked element:', element),
   *   error: (err) => console.error(err),
   * });
   */
  concatMap(transformFn) {
    return new ObservableStream(subscriber => {
      let innerSubscription = null;
      let waiting = false;
      const sourceValues = [];

      const sourceSubscription = this.subscribe({
        next: value => {
          if (!waiting) {
            waiting = true;
            const innerObservable = transformFn(value);
            innerSubscription = innerObservable.subscribe({
              next: innerValue => subscriber.next(innerValue),
              error: err => subscriber.error(err),
              complete: () => {
                if (sourceValues.length > 0) {
                  const nextValue = sourceValues.shift();
                  const nextInnerObservable = transformFn(nextValue);
                  innerSubscription = nextInnerObservable.subscribe({
                    next: innerValue => subscriber.next(innerValue),
                    error: err => subscriber.error(err),
                    complete: () => waiting = false,
                  });
                } else {
                  waiting = false;
                }
              },
            });
          } else {
            sourceValues.push(value);
          }
        },
        error: err => subscriber.error(err),
        complete: () => {
          if (!waiting) {
            subscriber.complete();
          }
        },
      });

      return () => {
        sourceSubscription.unsubscribe();
        if (innerSubscription) {
          innerSubscription.unsubscribe();
        }
      };
    });
  }

  /**
   * @method
   * @param {...ObservableStream} observables - The source ObservableStreams
   * @returns {ObservableStream} A new ObservableStream that emits an array with the latest values from each source ObservableStream, whenever any source ObservableStream emits.
   * @example
   * // Example 1: Combining multiple API data streams
   * const apiDataStream1 = fetch('https://api.example.com/data1').then(response => response.json());
   * const apiDataStream2 = fetch('https://api.example.com/data2').then(response => response.json());
   * const observableStream1 = ObservableStream.from(apiDataStream1);
   * const observableStream2 = ObservableStream.from(apiDataStream2);
   * const combinedStream = observableStream1.combineLatest(observableStream2);
   * combinedStream.subscribe({
   *   next: ([data1, data2]) => console.log('API data:', data1, data2),
   *   error: (err) => console.error(err),
   * });
   *
   * // Example 2: Combining multiple user event streams
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event));
   * });
   * const scrollStream = new ObservableStream(subscriber => {
   *   window.addEventListener('scroll', event => subscriber.next(event));
   * });
   * const combinedStream = clickStream.combineLatest(scrollStream);
   * combinedStream.subscribe({
   *   next: ([clickEvent, scrollEvent]) => console.log('User events:', clickEvent, scrollEvent),
   *   error: (err) => console.error(err),
   * });
   */
  combineLatest(...observables) {
    return new ObservableStream(subscriber => {
      const values = new Array(observables.length).fill(undefined);
      const subscriptions = observables.map((observable, i) =>
        observable.subscribe({
          next: value => {
            values[i] = value;
            if (!values.includes(undefined)) {
              subscriber.next([...values]);
            }
          },
          error: err => subscriber.error(err),
          complete: () => {},
        })
      );

      return () => subscriptions.forEach(subscription => subscription.unsubscribe());
    });
  }

  /**
   * @method
   * @param {...any} initialValues - The initial values to start with
   * @returns {ObservableStream} A new ObservableStream that emits the specified initial values, followed by all values emitted by the source ObservableStream.
   * @example
   * // Example 1: Prepending an API data stream with a loading state
   * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
   * const observableStream = ObservableStream.from(apiDataStream);
   * const loadingStream = observableStream.startWith('loading');
   * loadingStream.subscribe({
   *   next: (state) => console.log('State:', state),
   *   error: (err) => console.error(err),
   * });
   *
   * // Example 2: Prepending a user event stream with an initial event
   * const clickStream = new ObservableStream(subscriber => {
   *   document.addEventListener('click', event => subscriber.next(event));
   * });
   * const initialEvent = { type: 'initial' };
   * const eventStream = clickStream.startWith(initialEvent);
   * eventStream.subscribe({
   *   next: (event) => console.log('Event:', event),
   *   error: (err) => console.error(err),
   * });
   */
  startWith(...initialValues) {
    return new ObservableStream(subscriber => {
      initialValues.forEach(value => subscriber.next(value));
      const subscription = this.subscribe({
        next: value => subscriber.next(value),
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => subscription.unsubscribe();
    });
  }
}

export { ObservableStream };
