/**
 * Observer interface for handling observable emissions
 */
export interface Observer<T> {
    next?: (value: T) => void;
    error?: (error: unknown) => void;
    complete?: () => void;
}
/**
 * Subscription interface for managing observable subscriptions
 */
export interface Subscription {
    unsubscribe(): void;
    complete(): void;
    error(err: unknown): void;
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
export declare class Subscriber<T> implements Observer<T> {
    next?: (value: T) => void;
    error?: (error: unknown) => void;
    complete?: () => void;
    private teardowns;
    isUnsubscribed: boolean;
    /**
     * Creates a new Subscriber instance with optimized memory layout
     * @param observer - The observer object or function
     */
    constructor(observer: ObserverOrNext<T>);
    /**
     * Adds a teardown function to be executed when unsubscribing
     * @param teardown - The teardown function
     */
    addTeardown(teardown: TeardownFn): void;
    /**
     * Unsubscribes from the observable, preventing any further notifications
     */
    unsubscribe(): void;
}
/**
 * High-performance Observable implementation
 *
 * @deprecated Prefer `store()` for application state and queries. `Observable` remains exported
 * for v0.3 compatibility and as an internal base class.
 */
export declare class Observable<T> {
    protected __observers: Subscriber<T>[];
    private subscribeCallback?;
    /**
     * Protected method to check if there are any observers
     * @returns true if there are observers, false otherwise
     */
    protected get hasObservers(): boolean;
    /**
     * Protected method to get observer count
     * @returns number of observers
     */
    protected get observerCount(): number;
    /**
     * Protected method to notify all observers
     * @param value - The value to emit to observers
     */
    protected notifyObservers(value: T): void;
    /**
     * Creates a new Observable instance with optimized internal structure
     * @param subscribeCallback - The callback function to call when a new observer subscribes
     */
    constructor(subscribeCallback?: SubscribeCallback<T> | null);
    /**
     * Subscribes an observer to the observable with optimized paths
     * @param observerOrNext - The observer to subscribe or the next function
     * @param error - The error function. Default is null
     * @param complete - The complete function. Default is null
     * @returns An object containing methods to manage the subscription
     */
    subscribe(observerOrNext: ObserverOrNext<T>, error?: ((error: unknown) => void) | null, complete?: (() => void) | null): Subscription;
    /**
     * Creates a teardown function that removes a subscriber from the observers array
     * @param subscriber - The subscriber to remove
     * @returns A function that removes the subscriber when called
     */
    private __createRemoveTeardown;
    /**
     * Creates a subscription object with minimal properties
     * @param subscriber - The subscriber
     * @returns A subscription object
     */
    private __createSubscription;
    /**
     * Passes a value to all observers with maximum efficiency
     * @param value - The value to emit
     */
    next(value: T): void;
    /**
     * Passes an error to all observers and terminates the stream
     * @param error - The error to emit
     */
    error(error: unknown): void;
    /**
     * Notifies all observers that the Observable has completed
     */
    complete(): void;
    /**
     * Simplified method to subscribe to value emissions only
     * @param callbackFn - The callback for each value
     * @returns Subscription object with unsubscribe method
     */
    onValue(callbackFn: (value: T) => void): Subscription;
    /**
     * Simplified method to subscribe to errors only
     * @param callbackFn - The callback for errors
     * @returns Subscription object with unsubscribe method
     */
    onError(callbackFn: (error: unknown) => void): Subscription;
    /**
     * Simplified method to subscribe to completion only
     * @param callbackFn - The callback for completion
     * @returns Subscription object with unsubscribe method
     */
    onEnd(callbackFn: () => void): Subscription;
    /**
     * Returns an AsyncIterator for asynchronous iteration
     * @returns AsyncIterator implementation
     */
    [Symbol.asyncIterator](): AsyncIterator<T>;
}
//# sourceMappingURL=observable.d.ts.map