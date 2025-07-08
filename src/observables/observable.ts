/**
 * Observer interface for handling observable emissions
 */
export interface Observer<T> {
  next?: (value: T) => void;
  error?: (error: any) => void;
  complete?: () => void;
}

/**
 * Subscription interface for managing observable subscriptions
 */
export interface Subscription {
  unsubscribe(): void;
  complete(): void;
  error(err: any): void;
}

/**
 * Teardown function type
 */
export type TeardownFn = () => void;

/**
 * Subscribe callback function type
 */
export type SubscribeCallback<T> = (subscriber: Subscriber<T>) => TeardownFn | void;

/**
 * Observer or next function type
 */
export type ObserverOrNext<T> = Observer<T> | ((value: T) => void);

/**
 * High-performance Subscriber implementation
 */
export class Subscriber<T> implements Observer<T> {
  public next: ((value: T) => void) | undefined;
  public error: ((error: any) => void) | undefined;
  public complete: (() => void) | undefined;
  private teardowns: TeardownFn[] | null;
  public isUnsubscribed: boolean;

  /**
   * Creates a new Subscriber instance with optimized memory layout
   * @param observer - The observer object or function
   */
  constructor(observer: ObserverOrNext<T>) {
    // Fast path for the common case: just a function (>90% of cases)
    if (typeof observer === "function") {
      this.next = observer;
      this.error = undefined;
      this.complete = undefined;
    } else if (observer && typeof observer === "object") {
      // Avoid unnecessary binding for performance
      if (observer.next) {
        this.next = typeof observer.next === "function" ? 
          (observer.next.bind ? observer.next.bind(observer) : observer.next) : 
          undefined;
      } else {
        this.next = undefined;
      }
      
      // Only create these properties if they exist
      if (observer.error) {
        this.error = typeof observer.error === "function" ? 
          (observer.error.bind ? observer.error.bind(observer) : observer.error) : 
          undefined;
      } else {
        this.error = undefined;
      }
      
      if (observer.complete) {
        this.complete = typeof observer.complete === "function" ? 
          (observer.complete.bind ? observer.complete.bind(observer) : observer.complete) : 
          undefined;
      } else {
        this.complete = undefined;
      }
    } else {
      // Handle edge case - null or primitive
      this.next = undefined;
      this.error = undefined;
      this.complete = undefined;
    }
    
    // Most subscribers won't have teardowns, so initialize on first use
    this.teardowns = null;
    this.isUnsubscribed = false;
  }


  /**
   * Adds a teardown function to be executed when unsubscribing
   * @param teardown - The teardown function
   */
  addTeardown(teardown: TeardownFn): void {
    if (!this.teardowns) {
      // Initialize only when needed
      this.teardowns = [teardown];
    } else {
      this.teardowns.push(teardown);
    }
  }


  /**
   * Unsubscribes from the observable, preventing any further notifications
   */
  unsubscribe(): void {
    if (this.isUnsubscribed) return;
    
    this.isUnsubscribed = true;
    
    // Fast path if no teardowns
    if (!this.teardowns) {
      // Clear references to aid GC
      this.next = undefined;
      this.error = undefined;
      this.complete = undefined;
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
    this.next = undefined;
    this.error = undefined;
    this.complete = undefined;
  }
}

/**
 * High-performance Observable implementation
 */
export class Observable<T> {
  protected __observers: Subscriber<T>[];
  private subscribeCallback?: SubscribeCallback<T>;

  /**
   * Protected method to check if there are any observers
   * @returns true if there are observers, false otherwise
   */
  protected get hasObservers(): boolean {
    return this.__observers.length > 0;
  }

  /**
   * Protected method to get observer count
   * @returns number of observers
   */
  protected get observerCount(): number {
    return this.__observers.length;
  }

  /**
   * Protected method to notify all observers
   * @param value - The value to emit to observers
   */
  protected notifyObservers(value: T): void {
    const observers = this.__observers;
    const length = observers.length;
    for (let i = 0; i < length; i++) {
      const observer = observers[i];
      if (observer.next && !observer.isUnsubscribed) {
        observer.next(value);
      }
    }
  }

  /**
   * Creates a new Observable instance with optimized internal structure
   * @param subscribeCallback - The callback function to call when a new observer subscribes
   */
  constructor(subscribeCallback?: SubscribeCallback<T> | null) {
    // Use array for better performance than linked lists or sets
    this.__observers = [];
    // Only create this property if provided
    if (subscribeCallback) {
      this.subscribeCallback = subscribeCallback;
    }
  }

  /**
   * Subscribes an observer to the observable with optimized paths
   * @param observerOrNext - The observer to subscribe or the next function
   * @param error - The error function. Default is null
   * @param complete - The complete function. Default is null
   * @returns An object containing methods to manage the subscription
   */
  subscribe(observerOrNext: ObserverOrNext<T>, error?: ((error: any) => void) | null, complete?: (() => void) | null): Subscription {
    // Fast path for function observer (most common case)
    const subscriber = typeof observerOrNext === "function" 
      ? new Subscriber<T>(observerOrNext)
      : new Subscriber<T>({ 
          next: observerOrNext as any, 
          error: error || undefined, 
          complete: complete || undefined 
        });
    
    // Fast path for no subscribeCallback (common case)
    if (!this.subscribeCallback) {
      this.__observers.push(subscriber);
      
      // Add teardown to remove from observers array - this is allocated only once per subscriber
      subscriber.addTeardown(this.__createRemoveTeardown(subscriber));
      
      return this.__createSubscription(subscriber);
    }
    
    // Path for subscribeCallback
    let teardown: TeardownFn | void;
    try {
      teardown = this.subscribeCallback(subscriber);
    } catch (err) {
      if (subscriber.error) {
        subscriber.error(err);
      }
      return { unsubscribe: () => {}, complete: () => {}, error: () => {} };
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
   * Creates a teardown function that removes a subscriber from the observers array
   * @param subscriber - The subscriber to remove
   * @returns A function that removes the subscriber when called
   */
  private __createRemoveTeardown(subscriber: Subscriber<T>): TeardownFn {
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
   * Creates a subscription object with minimal properties
   * @param subscriber - The subscriber
   * @returns A subscription object
   */
  private __createSubscription(subscriber: Subscriber<T>): Subscription {
    return {
      unsubscribe: () => subscriber.unsubscribe(),
      // Only add these methods if needed in the future:
      complete: () => {
        if (!subscriber.isUnsubscribed && subscriber.complete) {
          subscriber.complete();
          subscriber.unsubscribe();
        }
      },
      error: (err: any) => {
        if (!subscriber.isUnsubscribed && subscriber.error) {
          subscriber.error(err);
          subscriber.unsubscribe();
        }
      },
    };
  }

  /**
   * Passes a value to all observers with maximum efficiency
   * @param value - The value to emit
   */
  next(value: T): void {
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
   * Passes an error to all observers and terminates the stream
   * @param error - The error to emit
   */
  error(error: any): void {
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
   * Notifies all observers that the Observable has completed
   */
  complete(): void {
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
   * Simplified method to subscribe to value emissions only
   * @param callbackFn - The callback for each value
   * @returns Subscription object with unsubscribe method
   */
  onValue(callbackFn: (value: T) => void): Subscription {
    return this.subscribe(callbackFn);
  }

  /**
   * Simplified method to subscribe to errors only
   * @param callbackFn - The callback for errors
   * @returns Subscription object with unsubscribe method
   */
  onError(callbackFn: (error: any) => void): Subscription {
    return this.subscribe(null as any, callbackFn);
  }

  /**
   * Simplified method to subscribe to completion only
   * @param callbackFn - The callback for completion
   * @returns Subscription object with unsubscribe method
   */
  onEnd(callbackFn: () => void): Subscription {
    return this.subscribe(null as any, null, callbackFn);
  }

  /**
   * Returns an AsyncIterator for asynchronous iteration
   * @returns AsyncIterator implementation
   */
  [Symbol.asyncIterator](): AsyncIterator<T> {
    let resolve: (value: IteratorResult<T>) => void;
    let promise = new Promise<IteratorResult<T>>(r => resolve = r);
    let subscription: Subscription | null;
    
    const cleanup = () => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    };
    
    subscription = this.subscribe(
      // Next handler
      (value: T) => {
        resolve({ value, done: false });
        promise = new Promise<IteratorResult<T>>(r => resolve = r);
      },
      // Error handler
      (err: any) => {
        cleanup();
        throw err;
      },
      // Complete handler
      () => {
        cleanup();
        resolve({ done: true } as IteratorResult<T>);
      }
    );
    
    return {
      next: () => promise,
      return: () => {
        cleanup();
        return Promise.resolve({ done: true } as IteratorResult<T>);
      },
      throw: (err: any) => {
        cleanup();
        return Promise.reject(err);
      }
    };
  }
}