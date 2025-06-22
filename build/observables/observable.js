/**
 * High-performance Subscriber implementation
 */
export class Subscriber {
    next;
    error;
    complete;
    teardowns;
    isUnsubscribed;
    /**
     * Creates a new Subscriber instance with optimized memory layout
     * @param observer - The observer object or function
     */
    constructor(observer) {
        // Fast path for the common case: just a function (>90% of cases)
        if (typeof observer === "function") {
            this.next = observer;
            this.error = null;
            this.complete = null;
        }
        else if (observer && typeof observer === "object") {
            // Avoid unnecessary binding for performance
            if (observer.next) {
                this.next = typeof observer.next === "function" ?
                    (observer.next.bind ? observer.next.bind(observer) : observer.next) :
                    null;
            }
            else {
                this.next = null;
            }
            // Only create these properties if they exist
            if (observer.error) {
                this.error = typeof observer.error === "function" ?
                    (observer.error.bind ? observer.error.bind(observer) : observer.error) :
                    null;
            }
            else {
                this.error = null;
            }
            if (observer.complete) {
                this.complete = typeof observer.complete === "function" ?
                    (observer.complete.bind ? observer.complete.bind(observer) : observer.complete) :
                    null;
            }
            else {
                this.complete = null;
            }
        }
        else {
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
     * Notifies the observer that the observable has completed
     */
    notifyComplete() {
        if (!this.isUnsubscribed && this.complete) {
            this.complete();
            this.unsubscribe();
        }
    }
    /**
     * Notifies the observer that an error has occurred
     * @param err - The error to pass to the observer's error method
     */
    notifyError(err) {
        if (!this.isUnsubscribed && this.error) {
            this.error(err);
            this.unsubscribe();
        }
    }
    /**
     * Adds a teardown function to be executed when unsubscribing
     * @param teardown - The teardown function
     */
    addTeardown(teardown) {
        if (!this.teardowns) {
            // Initialize only when needed
            this.teardowns = [teardown];
        }
        else {
            this.teardowns.push(teardown);
        }
    }
    /**
     * Unsubscribes from the observable, preventing any further notifications
     */
    unsubscribe() {
        if (this.isUnsubscribed)
            return;
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
 * High-performance Observable implementation
 */
export class Observable {
    __observers;
    subscribeCallback;
    /**
     * Protected method to check if there are any observers
     * @returns true if there are observers, false otherwise
     */
    get hasObservers() {
        return this.__observers.length > 0;
    }
    /**
     * Protected method to get observer count
     * @returns number of observers
     */
    get observerCount() {
        return this.__observers.length;
    }
    /**
     * Protected method to notify all observers
     * @param value - The value to emit to observers
     */
    notifyObservers(value) {
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
    constructor(subscribeCallback) {
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
        }
        catch (err) {
            if (subscriber.error) {
                subscriber.error(err);
            }
            return { unsubscribe: () => { }, complete: () => { }, error: () => { } };
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
     * Creates a subscription object with minimal properties
     * @param subscriber - The subscriber
     * @returns A subscription object
     */
    __createSubscription(subscriber) {
        return {
            unsubscribe: () => subscriber.unsubscribe(),
            // Only add these methods if needed in the future:
            complete: () => subscriber.notifyComplete(),
            error: (err) => subscriber.notifyError(err),
        };
    }
    /**
     * Passes a value to all observers with maximum efficiency
     * @param value - The value to emit
     */
    next(value) {
        const observers = this.__observers;
        const len = observers.length;
        // Highly optimized loop with minimal checks
        if (len === 0)
            return;
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
     * Notifies all observers that the Observable has completed
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
     * Simplified method to subscribe to value emissions only
     * @param callbackFn - The callback for each value
     * @returns Subscription object with unsubscribe method
     */
    onValue(callbackFn) {
        return this.subscribe(callbackFn);
    }
    /**
     * Simplified method to subscribe to errors only
     * @param callbackFn - The callback for errors
     * @returns Subscription object with unsubscribe method
     */
    onError(callbackFn) {
        return this.subscribe(null, callbackFn);
    }
    /**
     * Simplified method to subscribe to completion only
     * @param callbackFn - The callback for completion
     * @returns Subscription object with unsubscribe method
     */
    onEnd(callbackFn) {
        return this.subscribe(null, null, callbackFn);
    }
    /**
     * Returns an AsyncIterator for asynchronous iteration
     * @returns AsyncIterator implementation
     */
    async *[Symbol.asyncIterator]() {
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
        (value) => {
            resolve({ value, done: false });
            promise = new Promise(r => resolve = r);
        }, 
        // Error handler
        (err) => {
            cleanup();
            throw err;
        }, 
        // Complete handler
        () => {
            cleanup();
            resolve({ done: true });
        });
        try {
            while (true) {
                const result = await promise;
                if (result.done)
                    break;
                yield result.value;
            }
        }
        finally {
            cleanup();
        }
    }
}
//# sourceMappingURL=observable.js.map