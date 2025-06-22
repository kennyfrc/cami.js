import { Observable } from "./observable";
import { Draft } from "immer";
type Subscriber<T> = ((value: T) => void) | {
    next: (value: T) => void;
    complete?: () => void;
};
type Dependency = {
    store: ObservableState<any>;
    property?: string;
};
type UpdaterFunction<T> = (draft: Draft<T>) => void | T;
type EffectCleanup = void | (() => void);
interface Subscription {
    unsubscribe: () => void;
}
interface DeriveResult<T> {
    value: T;
    dispose: () => void;
}
/**
 * High-performance dependency tracking implementation
 * inspired by signals and other reactive libraries
 */
declare class DependencyTracker {
    static current: DependencyTracker | null;
    dependencies: Dependency[];
    private _depsMap;
    /**
     * Track dependencies used during the execution of an effect function
     * @param {Function} effectFn - Function to track
     * @returns {Set} Set of dependencies
     */
    static track<T>(effectFn: () => T): Dependency[];
    /**
     * Add a dependency to the current tracker
     * @param {Object} store - The store to track
     * @param {string} [property] - Optional property to track
     */
    addDependency(store: ObservableState<any>, property?: string): void;
}
/**
 * @class
 * @extends Observable
 * @description This class extends the Observable class and adds methods for updating the value of the observable.
 * @example
 * import { ObservableState } from 'cami-js';
 * const observable = new ObservableState(10);
 * console.log(observable.value); // 10
 */
declare class ObservableState<T = any> extends Observable {
    private __value;
    private __pendingUpdates;
    private __updateScheduled;
    private __name;
    private __isUpdating;
    private __updateStack;
    protected __observers: Subscriber<T>[];
    protected __lastObserver: Subscriber<T> | null;
    _uid?: string;
    /**
     * @constructor
     * @param {any} initialValue - The initial value of the observable
     * @param {Subscriber} subscriber - The subscriber to the observable
     * @param {Object} options - Additional options for the observable
     * @param {boolean} options.last - Whether the subscriber is the last observer
     * @example
     * const observable = new ObservableState(10);
     */
    constructor(initialValue?: T, subscriber?: Subscriber<T> | null, { last, name }?: {
        last?: boolean;
        name?: string | null;
    });
    /**
     * @method
     * @param {Function} callback - Callback function to be notified on value changes
     * @returns {Object} A subscription object with an unsubscribe method
     * @description High-performance subscription method with O(1) unsubscribe
     */
    onValue(callback: Subscriber<T>): Subscription;
    /**
     * @method
     * @returns {any} The current value of the observable
     * @example
     * const value = observable.value;
     */
    get value(): T;
    /**
     * @method
     * @param {any} newValue - The new value to set for the observable
     * @description This method sets a new value for the observable by calling the update method with the new value.
     * @example
     * observable.value = 20;
     */
    set value(newValue: T);
    /**
     * @method
     * @description Merges properties from the provided object into the observable's value
     * @param {Object} obj - The object whose properties to merge
     * @example
     * observable.assign({ key: 'value' });
     */
    assign(obj: Partial<T>): void;
    /**
     * @method
     * @description Sets a new value for a specific key in the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.
     * @param {string} key - The key to set the new value for
     * @param {any} value - The new value to set
     * @throws Will throw an error if the observable's value is not an object
     * @example
     * observable.set('key.subkey', 'new value');
     */
    set(key: string, value: any): void;
    /**
     * @method
     * @description Deletes a specific key from the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.
     * @param {string} key - The key to delete
     * @throws Will throw an error if the observable's value is not an object
     * @example
     * observable.delete('key.subkey');
     */
    delete(key: string): void;
    /**
     * @method
     * @description Removes all key/value pairs from the observable's value
     * @example
     * observable.clear();
     */
    clear(): void;
    /**
     * @method
     * @description Adds one or more elements to the end of the observable's value
     * @param {...any} elements - The elements to add
     * @example
     * observable.push(1, 2, 3);
     */
    push(...elements: T extends Array<infer U> ? U[] : never): void;
    /**
     * @method
     * @description Removes the last element from the observable's value
     * @example
     * observable.pop();
     */
    pop(): void;
    /**
     * @method
     * @description Removes the first element from the observable's value
     * @example
     * observable.shift();
     */
    shift(): void;
    /**
     * @method
     * @description Changes the contents of the observable's value by removing, replacing, or adding elements
     * @param {number} start - The index at which to start changing the array
     * @param {number} deleteCount - The number of elements to remove
     * @param {...any} items - The elements to add to the array
     * @example
     * observable.splice(0, 1, 'newElement');
     */
    splice(start: number, deleteCount?: number, ...items: T extends Array<infer U> ? U[] : never): void;
    /**
     * @method
     * @description Adds one or more elements to the beginning of the observable's value
     * @param {...any} elements - The elements to add
     * @example
     * observable.unshift('newElement');
     */
    unshift(...elements: T extends Array<infer U> ? U[] : never): void;
    /**
     * @method
     * @description Reverses the order of the elements in the observable's value
     * @example
     * observable.reverse();
     */
    reverse(): void;
    /**
     * @method
     * @description Sorts the elements in the observable's value
     * @param {Function} [compareFunction] - The function used to determine the order of the elements
     * @example
     * observable.sort((a, b) => a - b);
     */
    sort(compareFunction?: (a: any, b: any) => number): void;
    /**
     * @method
     * @description Changes all elements in the observable's value to a static value
     * @param {any} value - The value to fill the array with
     * @param {number} [start=0] - The index to start filling at
     * @param {number} [end=this.__value.length] - The index to stop filling at
     * @example
     * observable.fill('newElement', 0, 2);
     */
    fill(value: T extends Array<infer U> ? U : never, start?: number, end?: number): void;
    /**
     * @method
     * @description Shallow copies part of the observable's value to another location in the same array
     * @param {number} target - The index to copy the elements to
     * @param {number} start - The start index to begin copying elements from
     * @param {number} [end=this.__value.length] - The end index to stop copying elements from
     * @example
     * observable.copyWithin(0, 1, 2);
     */
    copyWithin(target: number, start: number, end?: number): void;
    /**
     * @method
     * @param {Function} updater - The function to update the value
     * @description This method adds the updater function to the pending updates queue.
     * It uses a synchronous approach to schedule the updates, ensuring the whole state is consistent at each tick.
     * This is done to batch multiple updates together and avoid unnecessary re-renders.
     * @example
     * observable.update(value => value + 1);
     */
    update(updater: UpdaterFunction<T>): void;
    private __scheduleupdate;
    /**
     * High-performance notification method with optimized code paths
     * @private
     */
    private __notifyObservers;
    /**
     * Optimized update application with fast paths for common cases
     * @private
     */
    private __applyUpdates;
    /**
     * @method
     * @description Calls the complete method of all observers.
     * @example
     * observable.complete();
     */
    complete(): void;
}
/**
 * @function
 * @param {Function} effectFn - The function to call for the effect
 * @returns {Function} A function that when called, unsubscribes from all dependencies and runs cleanup function
 * @description This function sets up an effect that is run when the observable changes
 * @example
 * // Assuming `effectFn` is a function that is called when the observable changes
 * const effectFunction = effect(effectFn);
 */
declare const effect: (effectFn: () => EffectCleanup) => () => void;
/**
 * @function
 * @param {Function} deriveFn - The function to compute the derived value
 * @returns {Object} An object containing the current derived value and a dispose function
 * @description This function creates a derived value that updates when its dependencies change
 * @example
 * const count = new ObservableState(0);
 * const { value: doubleCount, dispose } = derive(() => count.value * 2);
 * console.log(doubleCount); // 0
 * count.value = 5;
 * console.log(doubleCount); // 10
 * dispose(); // Clean up when no longer needed
 */
declare const derive: <T>(deriveFn: () => T) => DeriveResult<T>;
export { ObservableState, effect, derive, DependencyTracker };
export type { Subscriber, Dependency, UpdaterFunction, EffectCleanup, Subscription, DeriveResult };
//# sourceMappingURL=observable-state.d.ts.map