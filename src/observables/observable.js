/**
 * @typedef {Object} Observer
 * @description The observer object or function.
 * @property {Function} next - Function to handle new values.
 * @property {Function} error - Function to handle errors.
 * @property {Function} complete - Function to handle completion.
 */

/**
 * @class
 * @description High-performance Subscriber implementation.
 */
class Subscriber {
  /**
   * @constructor
   * @description Creates a new Subscriber instance with optimized memory layout.
   * @param {Observer|Function} observer - The observer object or function.
   */
  constructor(observer) {
    // Fast path for the common case: just a function (>90% of cases)
    if (typeof observer === "function") {
      this.next = observer;
      this.error = null;
      this.complete = null;
    } else if (observer && typeof observer === "object") {
      // Avoid unnecessary binding for performance
      if (observer.next) {
        this.next = typeof observer.next === "function" ? 
          (observer.next.bind ? observer.next.bind(observer) : observer.next) : 
          null;
      } else {
        this.next = null;
      }
      
      // Only create these properties if they exist
      if (observer.error) {
        this.error = typeof observer.error === "function" ? 
          (observer.error.bind ? observer.error.bind(observer) : observer.error) : 
          null;
      } else {
        this.error = null;
      }
      
      if (observer.complete) {
        this.complete = typeof observer.complete === "function" ? 
          (observer.complete.bind ? observer.complete.bind(observer) : observer.complete) : 
          null;
      } else {
        this.complete = null;
      }
    } else {
      // Handle edge case - null or primitive
      this.next = null;
      this.error = null;
      this.complete = null;
    }
    
    // Most subscribers won't have teardowns, so initialize on first use
    this.teardowns = null;
    this.isUnsubscribed = false;
  }

  /**
   * @method
   * @description Notifies the observer that the observable has completed.
   */
  complete() {
    if (!this.isUnsubscribed && this.complete) {
      this.complete();
      this.unsubscribe();
    }
  }

  /**
   * @method
   * @description Notifies the observer that an error has occurred.
   * @param {Error} error - The error to pass to the observer's error method.
   */
  error(error) {
    if (!this.isUnsubscribed && this.error) {
      this.error(error);
      this.unsubscribe();
    }
  }

  /**
   * @method
   * @description Adds a teardown function to be executed when unsubscribing.
   * @param {Function} teardown - The teardown function.
   */
  addTeardown(teardown) {
    if (!this.teardowns) {
      // Initialize only when needed
      this.teardowns = [teardown];
    } else {
      this.teardowns.push(teardown);
    }
  }

  /**
   * @method
   * @description Unsubscribes from the observable, preventing any further notifications.
   */
  unsubscribe() {
    if (this.isUnsubscribed) return;
    
    this.isUnsubscribed = true;
    
    // Fast path if no teardowns
    if (!this.teardowns) {
      // Clear references to aid GC
      this.next = null;
      this.error = null;
      this.complete = null;
      return;
    }
    
    // Execute teardowns with optimized while loop
    const teardowns = this.teardowns;
    let i = teardowns.length;
    while (i--) {
      const teardown = teardowns[i];
      if (typeof teardown === "function") {
        teardown();
      }
    }
    
    // Clear references to aid garbage collection
    this.teardowns = null;
    this.next = null;
    this.error = null;
    this.complete = null;
  }
}

/**
 * @class
 * @description High-performance Observable implementation.
 */
class Observable {
  /**
   * @constructor
   * @description Creates a new Observable instance with optimized internal structure.
   * @param {Function} subscribeCallback - The callback function to call when a new observer subscribes.
   */
  constructor(subscribeCallback = null) {
    // Use array for better performance than linked lists or sets
    this.__observers = [];
    // Only create this property if provided
    if (subscribeCallback) {
      this.subscribeCallback = subscribeCallback;
    }
  }

  /**
   * @method
   * @description Subscribes an observer to the observable with optimized paths.
   * @param {Observer|Function} observerOrNext - The observer to subscribe or the next function.
   * @param {Function} error - The error function. Default is null.
   * @param {Function} complete - The complete function. Default is null.
   * @returns {Object} An object containing methods to manage the subscription.
   */
  subscribe(observerOrNext, error, complete) {
    // Fast path for function observer (most common case)
    const subscriber = typeof observerOrNext === "function" 
      ? new Subscriber(observerOrNext)
      : new Subscriber({ next: observerOrNext, error, complete });
    
    // Fast path for no subscribeCallback (common case)
    if (!this.subscribeCallback) {
      this.__observers.push(subscriber);
      
      // Add teardown to remove from observers array - this is allocated only once per subscriber
      subscriber.addTeardown(this.__createRemoveTeardown(subscriber));
      
      return this.__createSubscription(subscriber);
    }
    
    // Path for subscribeCallback
    let teardown;
    try {
      teardown = this.subscribeCallback(subscriber);
    } catch (err) {
      if (subscriber.error) {
        subscriber.error(err);
      }
      return { unsubscribe: () => {} };
    }
    
    if (teardown) {
      subscriber.addTeardown(teardown);
    }
    
    // Only add to observers if not immediately unsubscribed
    if (!subscriber.isUnsubscribed) {
      this.__observers.push(subscriber);
      subscriber.addTeardown(this.__createRemoveTeardown(subscriber));
    }
    
    return this.__createSubscription(subscriber);
  }
  
  /**
   * @private
   * @method __createRemoveTeardown
   * @description Creates a teardown function that removes a subscriber from the observers array
   * @param {Subscriber} subscriber - The subscriber to remove
   * @returns {Function} A function that removes the subscriber when called
   */
  __createRemoveTeardown(subscriber) {
    return () => {
      const observers = this.__observers;
      const index = observers.indexOf(subscriber);
      if (index !== -1) {
        // Faster removal by swapping with last element and popping - O(1)
        const lastIndex = observers.length - 1;
        if (index < lastIndex) {
          observers[index] = observers[lastIndex];
        }
        observers.pop();
      }
    };
  }
  
  /**
   * @private
   * @method __createSubscription
   * @description Creates a subscription object with minimal properties
   * @param {Subscriber} subscriber - The subscriber
   * @returns {Object} A subscription object
   */
  __createSubscription(subscriber) {
    return {
      unsubscribe: () => subscriber.unsubscribe(),
      // Only add these methods if needed in the future:
      complete: () => subscriber.complete(),
      error: (err) => subscriber.error(err),
    };
  }

  /**
   * @method
   * @description Passes a value to all observers with maximum efficiency.
   * @param {*} value - The value to emit.
   */
  next(value) {
    const observers = this.__observers;
    const len = observers.length;
    
    // Highly optimized loop with minimal checks
    if (len === 0) return;
    
    // Special case for single observer (common case)
    if (len === 1) {
      const observer = observers[0];
      if (!observer.isUnsubscribed && observer.next) {
        observer.next(value);
      }
      return;
    }
    
    // Using direct array access and while loop counting down for maximum performance
    let i = len;
    while (i--) {
      const observer = observers[i];
      // Minimal condition check
      if (!observer.isUnsubscribed && observer.next) {
        observer.next(value);
      }
    }
  }

  /**
   * @method
   * @description Passes an error to all observers and terminates the stream.
   * @param {*} error - The error to emit.
   */
  error(error) {
    // Create a snapshot to prevent modification during iteration
    const observers = this.__observers.slice();
    const len = observers.length;
    
    for (let i = 0; i < len; i++) {
      const observer = observers[i];
      if (!observer.isUnsubscribed && observer.error) {
        observer.error(error);
      }
    }
    
    // Clear all observers after error
    this.__observers.length = 0;
  }

  /**
   * @method
   * @description Notifies all observers that the Observable has completed.
   */
  complete() {
    // Create a snapshot to prevent modification during iteration
    const observers = this.__observers.slice();
    const len = observers.length;
    
    for (let i = 0; i < len; i++) {
      const observer = observers[i];
      if (!observer.isUnsubscribed && observer.complete) {
        observer.complete();
      }
    }
    
    // Clear all observers after completion
    this.__observers.length = 0;
  }

  /**
   * @method
   * @description Simplified method to subscribe to value emissions only.
   * @param {Function} callbackFn - The callback for each value.
   * @returns {Object} Subscription object with unsubscribe method.
   */
  onValue(callbackFn) {
    return this.subscribe(callbackFn);
  }

  /**
   * @method
   * @description Simplified method to subscribe to errors only.
   * @param {Function} callbackFn - The callback for errors.
   * @returns {Object} Subscription object with unsubscribe method.
   */
  onError(callbackFn) {
    return this.subscribe(null, callbackFn);
  }

  /**
   * @method
   * @description Simplified method to subscribe to completion only.
   * @param {Function} callbackFn - The callback for completion.
   * @returns {Object} Subscription object with unsubscribe method.
   */
  onEnd(callbackFn) {
    return this.subscribe(null, null, callbackFn);
  }

  /**
   * @method
   * @description Returns an AsyncIterator for asynchronous iteration.
   * @returns {AsyncIterator} AsyncIterator implementation.
   */
  [Symbol.asyncIterator]() {
    let resolve;
    let promise = new Promise(r => resolve = r);
    let subscription;
    
    const cleanup = () => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    };
    
    subscription = this.subscribe(
      // Next handler
      value => {
        resolve({ value, done: false });
        promise = new Promise(r => resolve = r);
      },
      // Error handler
      err => {
        cleanup();
        throw err;
      },
      // Complete handler
      () => {
        cleanup();
        resolve({ done: true });
      }
    );
    
    return {
      next: () => promise,
      return: () => {
        cleanup();
        return Promise.resolve({ done: true });
      },
      throw: err => {
        cleanup();
        return Promise.reject(err);
      }
    };
  }
}

export { Observable };
