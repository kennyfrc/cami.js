import { Draft, produce } from 'immer'

import { __config } from '../config'
import { getRenderPhaseContext } from '../render-phase'
import { __trace } from '../trace'
import { _deepEqual } from '../utils'
import {
  Subscriber as BaseSubscriber,
  Subscription as BaseSubscription,
  Observable,
} from './observable'

// Type definitions
type ObserverFunction<T> = (value: T) => void
type ObserverObject<T> = {
  next: (value: T) => void
  complete?: () => void
}
type ObserverOrNext<T> = ObserverFunction<T> | ObserverObject<T>

type Dependency = {
  store: ObservableState<any> | { _uid?: string }
  property?: string
}

type UpdaterFunction<T> = (draft: Draft<T>) => void

type EffectCleanup = void | (() => void)

// Use Subscription from observable.ts

interface DeriveResult<T> {
  value: T
  dispose: () => void
}

/**
 * High-performance dependency tracking implementation
 * inspired by signals and other reactive libraries
 */
class DependencyTracker {
  // Shared static context for tracking the current computation
  static current: DependencyTracker | null = null

  // For small dependency sets, arrays are faster than Sets in V8
  // When dependency count grows large, we can switch to a Set
  dependencies: Dependency[] = []

  // For fast lookup to avoid duplicates (O(1) vs O(n))
  private _depsMap: Map<string, Dependency> = new Map()

  /**
   * Track dependencies used during the execution of an effect function
   * @param {Function} effectFn - Function to track
   * @returns {Set} Set of dependencies
   */
  static track<T>(effectFn: () => T): Dependency[] {
    // Save previous context to support nested tracking
    const previousTracker = DependencyTracker.current

    // Create new tracker for this computation
    const tracker = new DependencyTracker()
    DependencyTracker.current = tracker

    try {
      // Execute the function to track dependencies
      effectFn()
      return tracker.dependencies
    } finally {
      // Restore previous context
      DependencyTracker.current = previousTracker
    }
  }

  /**
   * Add a dependency to the current tracker
   * @param {Object} store - The store to track
   * @param {string} [property] - Optional property to track
   */
  addDependency(store: ObservableState<any> | { _uid?: string }, property?: string): void {
    // Create a unique key for the dependency
    const key = property ? `${store._uid || 'store'}.${property}` : store._uid || 'store'

    // Only add if not already tracked (O(1) lookup)
    if (!this._depsMap.has(key)) {
      // Create dependency object with minimal properties
      const dep: Dependency = {
        store,
        ...(property && { property }),
      }

      // Track in array for ordered iteration
      this.dependencies.push(dep)

      // Track in map for fast existence checks
      this._depsMap.set(key, dep)
    }
  }
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
class ObservableState<T = any> extends Observable<T> {
  private __value: T
  private __pendingUpdates: UpdaterFunction<T>[] = []
  private __updateScheduled: boolean = false
  private __name: string | null
  private __isUpdating: boolean = false
  private __updateStack: string[] = []
  protected override __observers: BaseSubscriber<T>[] = []
  protected __lastObserver: ObserverOrNext<T> | null = null
  // Add _uid property to match the dependency tracking
  _uid?: string

  /**
   * @constructor
   * @param {any} initialValue - The initial value of the observable
   * @param {Subscriber} subscriber - The subscriber to the observable
   * @param {Object} options - Additional options for the observable
   * @param {boolean} options.last - Whether the subscriber is the last observer
   * @example
   * const observable = new ObservableState(10);
   */
  constructor(
    initialValue: T = null as T,
    subscriber: ObserverOrNext<T> | null = null,
    { last = false, name = null }: { last?: boolean; name?: string | null } = {}
  ) {
    super()
    if (subscriber) {
      if (last) {
        this.__lastObserver = subscriber
      } else {
        const sub = new BaseSubscriber(subscriber)
        this.__observers.push(sub)
      }
    }
    this.__value = produce(initialValue, _draft => {}) as T
    this.__name = name
  }

  /**
   * @method
   * @param {Function} callback - Callback function to be notified on value changes
   * @returns {Object} A subscription object with an unsubscribe method
   * @description High-performance subscription method with O(1) unsubscribe
   */
  override onValue(callback: (value: T) => void): BaseSubscription {
    // Add observer to array - O(1) operation
    const subscriber = new BaseSubscriber(callback)
    const index = this.__observers.length
    this.__observers.push(subscriber)

    // Return subscription with direct index removal for O(1) unsubscribe when possible
    return {
      unsubscribe: () => {
        // Fast path: if the subscriber is still at the original index, use direct removal
        if (this.__observers[index] === subscriber) {
          // Fast removal by swapping with last element and popping - O(1)
          const lastIndex = this.__observers.length - 1
          if (index < lastIndex) {
            const lastObserver = this.__observers[lastIndex]
            if (lastObserver !== undefined) {
              this.__observers[index] = lastObserver
            }
          }
          this.__observers.pop()
        } else {
          // Fallback to filter only when needed - O(n)
          this.__observers = this.__observers.filter(obs => obs !== subscriber)
        }
      },
      complete: () => {
        if (!subscriber.isUnsubscribed && subscriber.complete) {
          subscriber.complete()
          subscriber.unsubscribe()
        }
      },
      error: (err: unknown) => {
        if (!subscriber.isUnsubscribed && subscriber.error) {
          subscriber.error(err)
          subscriber.unsubscribe()
        }
      },
    }
  }

  /**
   * @method
   * @returns {any} The current value of the observable
   * @example
   * const value = observable.value;
   */
  get value(): T {
    if (DependencyTracker.current != null) {
      DependencyTracker.current.addDependency(this)
    }
    return this.__value
  }

  /**
   * @method
   * @param {any} newValue - The new value to set for the observable
   * @description This method sets a new value for the observable by calling the update method with the new value.
   * @example
   * observable.value = 20;
   */
  set value(newValue: T) {
    this.__assertMutationOutsideRenderPhase()

    if (this.__isUpdating) {
      const cycle = [...this.__updateStack, this.__name].join(' -> ')
      console.warn(`[Cami.js] Cyclic dependency detected: ${cycle}`)
      // Optionally, return here to prevent the update
      // return;
    }

    this.__isUpdating = true
    this.__updateStack.push(this.__name || 'unknown')

    try {
      if (!_deepEqual(newValue, this.__value)) {
        this.__value = newValue
        this.__notifyObservers()
      }
    } finally {
      this.__updateStack.pop()
      this.__isUpdating = false
    }
  }

  /**
   * @method
   * @description Merges properties from the provided object into the observable's value
   * @param {Object} obj - The object whose properties to merge
   * @example
   * observable.assign({ key: 'value' });
   */
  assign(obj: Partial<T>): void {
    if (typeof this.__value !== 'object' || this.__value === null) {
      throw new Error('[Cami.js] Observable value is not an object')
    }
    this.update(value => Object.assign(value as Record<string, unknown>, obj))
  }

  /**
   * @method
   * @description Sets a new value for a specific key in the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.
   * @param {string} key - The key to set the new value for
   * @param {any} value - The new value to set
   * @throws Will throw an error if the observable's value is not an object
   * @example
   * observable.set('key.subkey', 'new value');
   */
  set(key: string, value: unknown): void {
    if (typeof this.__value !== 'object' || this.__value === null) {
      throw new Error('[Cami.js] Observable value is not an object')
    }
    this.update(state => {
      const keys = key.split('.')
      let current: unknown = state
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (key !== undefined && typeof current === 'object' && current !== null) {
          current = (current as Record<string, unknown>)[key]
        }
      }
      const lastKey = keys[keys.length - 1]
      if (lastKey !== undefined) {
        ;(current as Record<string, unknown>)[lastKey] = value
      }
    })
  }

  /**
   * @method
   * @description Deletes a specific key from the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.
   * @param {string} key - The key to delete
   * @throws Will throw an error if the observable's value is not an object
   * @example
   * observable.delete('key.subkey');
   */
  delete(key: string): void {
    if (typeof this.__value !== 'object' || this.__value === null) {
      throw new Error('[Cami.js] Observable value is not an object')
    }
    this.update(state => {
      const keys = key.split('.')
      let current: unknown = state
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (key !== undefined && typeof current === 'object' && current !== null) {
          current = (current as Record<string, unknown>)[key]
        }
      }
      const lastKey = keys[keys.length - 1]
      if (lastKey !== undefined) {
        delete (current as Record<string, unknown>)[lastKey]
      }
    })
  }

  /**
   * @method
   * @description Removes all key/value pairs from the observable's value
   * @example
   * observable.clear();
   */
  clear(): void {
    this.update(() => ({}) as T)
  }

  /**
   * @method
   * @description Adds one or more elements to the end of the observable's value
   * @param {...any} elements - The elements to add
   * @example
   * observable.push(1, 2, 3);
   */
  push(...elements: T extends Array<infer U> ? U[] : never): void {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array')
    }
    this.update(value => {
      ;(value as unknown[]).push(...elements)
    })
  }

  /**
   * @method
   * @description Removes the last element from the observable's value
   * @example
   * observable.pop();
   */
  pop(): void {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array')
    }
    this.update(value => {
      ;(value as unknown[]).pop()
    })
  }

  /**
   * @method
   * @description Removes the first element from the observable's value
   * @example
   * observable.shift();
   */
  shift(): void {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array')
    }
    this.update(value => {
      ;(value as unknown[]).shift()
    })
  }

  /**
   * @method
   * @description Changes the contents of the observable's value by removing, replacing, or adding elements
   * @param {number} start - The index at which to start changing the array
   * @param {number} deleteCount - The number of elements to remove
   * @param {...any} items - The elements to add to the array
   * @example
   * observable.splice(0, 1, 'newElement');
   */
  splice(
    start: number,
    deleteCount?: number,
    ...items: T extends Array<infer U> ? U[] : never
  ): void {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array')
    }
    this.update(arr => {
      ;(arr as unknown[]).splice(start, deleteCount ?? 0, ...items)
    })
  }

  /**
   * @method
   * @description Adds one or more elements to the beginning of the observable's value
   * @param {...any} elements - The elements to add
   * @example
   * observable.unshift('newElement');
   */
  unshift(...elements: T extends Array<infer U> ? U[] : never): void {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array')
    }
    this.update(value => {
      ;(value as unknown[]).unshift(...elements)
    })
  }

  /**
   * @method
   * @description Reverses the order of the elements in the observable's value
   * @example
   * observable.reverse();
   */
  reverse(): void {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array')
    }
    this.update(value => {
      ;(value as unknown[]).reverse()
    })
  }

  /**
   * @method
   * @description Sorts the elements in the observable's value
   * @param {Function} [compareFunction] - The function used to determine the order of the elements
   * @example
   * observable.sort((a, b) => a - b);
   */
  sort(compareFunction?: (a: unknown, b: unknown) => number): void {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array')
    }
    this.update(value => {
      ;(value as unknown[]).sort(compareFunction)
    })
  }

  /**
   * @method
   * @description Changes all elements in the observable's value to a static value
   * @param {any} value - The value to fill the array with
   * @param {number} [start=0] - The index to start filling at
   * @param {number} [end=this.__value.length] - The index to stop filling at
   * @example
   * observable.fill('newElement', 0, 2);
   */
  fill(value: T extends Array<infer U> ? U : never, start: number = 0, end?: number): void {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array')
    }
    const arrayEnd = end !== undefined ? end : (this.__value as unknown[]).length
    this.update(arr => {
      ;(arr as unknown[]).fill(value, start, arrayEnd)
    })
  }

  /**
   * @method
   * @description Shallow copies part of the observable's value to another location in the same array
   * @param {number} target - The index to copy the elements to
   * @param {number} start - The start index to begin copying elements from
   * @param {number} [end=this.__value.length] - The end index to stop copying elements from
   * @example
   * observable.copyWithin(0, 1, 2);
   */
  copyWithin(target: number, start: number, end?: number): void {
    if (!Array.isArray(this.__value)) {
      throw new Error('[Cami.js] Observable value is not an array')
    }
    const arrayEnd = end !== undefined ? end : (this.__value as unknown[]).length
    this.update(arr => {
      ;(arr as unknown[]).copyWithin(target, start, arrayEnd)
    })
  }

  /**
   * @method
   * @param {Function} updater - The function to update the value
   * @description This method adds the updater function to the pending updates queue.
   * It uses a synchronous approach to schedule the updates, ensuring the whole state is consistent at each tick.
   * This is done to batch multiple updates together and avoid unnecessary re-renders.
   * @example
   * observable.update(value => value + 1);
   */
  update(updater: UpdaterFunction<T>): void {
    this.__assertMutationOutsideRenderPhase()

    if (this.__isUpdating) {
      const cycle = [...this.__updateStack, this.__name].join(' -> ')
      console.warn(`[Cami.js] Cyclic dependency detected: ${cycle}`)
      // Optionally, return here to prevent the update
      // return;
    }

    this.__isUpdating = true
    this.__updateStack.push(this.__name || 'unknown')

    try {
      this.__pendingUpdates.push(updater)
      this.__scheduleupdate()
    } finally {
      this.__updateStack.pop()
      this.__isUpdating = false
    }
  }

  private __assertMutationOutsideRenderPhase(): void {
    const renderContext = getRenderPhaseContext()
    if (!renderContext.inRenderPhase) return

    const activeElementTagName = renderContext.activeElementTagName || 'unknown'
    throw new Error(
      `[Cami.js] Observable state mutation is not allowed during render phase (element: <${activeElementTagName}>). Keep templates pure and move writes into actions, event handlers, or afterRender().`
    )
  }

  private __scheduleupdate(): void {
    if (!this.__updateScheduled) {
      this.__updateScheduled = true
      this.__applyUpdates()
    }
  }

  /**
   * High-performance notification method with optimized code paths
   * @private
   */
  private __notifyObservers(): void {
    // Fast path: no observers
    if (this.__observers.length === 0 && !this.__lastObserver) {
      return
    }

    // Cache the current value for consistent notifications
    const value = this.__value

    // Use direct array access with for-loop instead of creating a new array and using forEach
    const observers = this.__observers
    const len = observers.length

    // Highly optimized path for single observer (common case)
    if (len === 1 && !this.__lastObserver) {
      const observer = observers[0]
      if (observer && observer.next && !observer.isUnsubscribed) {
        try {
          observer.next(value)
        } catch (err) {
          console.error('[Cami.js] Error in observer notification:', err)
        }
      }
      return
    }

    // Handle multiple observers with faster while-loop counting down.
    // Each observer is isolated so one throwing observer cannot prevent
    // remaining observers from being notified.
    let i = len
    while (i--) {
      const observer = observers[i]
      if (observer && observer.next && !observer.isUnsubscribed) {
        try {
          observer.next(value)
        } catch (err) {
          console.error('[Cami.js] Error in observer notification:', err)
        }
      }
    }

    // Handle the last observer separately (if exists)
    if (this.__lastObserver) {
      try {
        if (typeof this.__lastObserver === 'function') {
          this.__lastObserver(value)
        } else if (this.__lastObserver && this.__lastObserver.next) {
          this.__lastObserver.next(value)
        }
      } catch (err) {
        console.error('[Cami.js] Error in observer notification:', err)
      }
    }
  }

  /**
   * Optimized update application with fast paths for common cases
   * @private
   */
  private __applyUpdates(): void {
    // Skip the expensive _deepEqual check by tracking changes explicitly
    let hasChanged = false

    // Cache the old value only if needed for event emission
    const needsEventOrTrace = __config.events.isEnabled || __config.debug.isEnabled
    const oldValue = needsEventOrTrace ? this.__value : undefined

    // Process all pending updates at once
    const updates = this.__pendingUpdates
    const updateCount = updates.length

    if (updateCount === 0) {
      // No updates, nothing to do
      this.__updateScheduled = false
      return
    }

    // Fast path for simple values (not objects or arrays)
    const isComplexValue =
      typeof this.__value === 'object' &&
      this.__value !== null &&
      ((this.__value as Record<string, unknown>).constructor === Object ||
        Array.isArray(this.__value))

    if (isComplexValue) {
      // For objects/arrays, use immer's produce
      // Apply all updates in a batch
      if (updateCount === 1) {
        // Fast path for single update (common case)
        const updater = updates[0]
        if (updater === undefined) {
          return
        }
        const newValue = produce(this.__value, updater) as T

        // First try reference equality (fast)
        if (newValue !== this.__value) {
          // For objects/arrays, do deep equality check to avoid unnecessary updates
          if (
            typeof newValue === 'object' &&
            newValue !== null &&
            typeof this.__value === 'object' &&
            this.__value !== null
          ) {
            if (!_deepEqual(newValue, this.__value)) {
              hasChanged = true
              this.__value = newValue
            }
          } else {
            hasChanged = true
            this.__value = newValue
          }
        }
      } else {
        // When multiple updates exist, apply them in sequence
        let currentValue = this.__value
        for (let i = 0; i < updateCount; i++) {
          const updater = updates[i]
          if (updater === undefined) {
            continue
          }
          const newValue = produce(currentValue, updater) as T
          // First try reference equality (fast)
          if (newValue !== currentValue) {
            // For objects/arrays, do deep equality check to avoid unnecessary updates
            if (
              typeof newValue === 'object' &&
              newValue !== null &&
              typeof currentValue === 'object' &&
              currentValue !== null
            ) {
              if (!_deepEqual(newValue, currentValue)) {
                hasChanged = true
                currentValue = newValue
              }
            } else {
              hasChanged = true
              currentValue = newValue
            }
          }
        }

        if (hasChanged) {
          this.__value = currentValue
        }
      }
    } else {
      // For primitive values, apply updaters directly in sequence
      let currentValue = this.__value
      for (let i = 0; i < updateCount; i++) {
        const updater = updates[i]
        if (updater === undefined) {
          continue
        }
        const result = updater(currentValue as Draft<T>)
        const newValue = (result !== undefined ? result : currentValue) as T
        // First try reference equality (fast)
        if (newValue !== currentValue) {
          // For objects/arrays, do deep equality check to avoid unnecessary updates
          if (
            typeof newValue === 'object' &&
            newValue !== null &&
            typeof currentValue === 'object' &&
            currentValue !== null
          ) {
            if (!_deepEqual(newValue, currentValue)) {
              hasChanged = true
              currentValue = newValue
            }
          } else {
            hasChanged = true
            currentValue = newValue
          }
        }
      }

      if (hasChanged) {
        this.__value = currentValue
      }
    }

    // Clear the update queue - faster than multiple shift() calls
    updates.length = 0

    try {
      // Only notify observers if the value actually changed
      if (hasChanged) {
        this.__notifyObservers()

        // Only emit events if necessary and configured
        if (__config.events.isEnabled && typeof window !== 'undefined') {
          const event = new CustomEvent('cami:elem:state:change', {
            detail: {
              name: this.__name,
              oldValue: oldValue,
              newValue: this.__value,
            },
          })
          window.dispatchEvent(event)
        }

        // Only trace if enabled
        if (needsEventOrTrace) {
          __trace('cami:elem:state:change', this.__name, oldValue, this.__value)
        }
      }
    } finally {
      this.__updateScheduled = false
    }
  }

  /**
   * @method
   * @description Calls the complete method of all observers.
   * @example
   * observable.complete();
   */
  override complete(): void {
    this.__observers.forEach(observer => {
      if (observer && observer.complete && !observer.isUnsubscribed) {
        observer.complete()
      }
    })
  }
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
const effect = function (effectFn: () => EffectCleanup): () => void {
  let cleanup: () => void = () => {}
  let dependencies = new Set<ObservableState<any>>()
  const subscriptions = new Map<ObservableState<any>, BaseSubscription>()

  const _runEffect = () => {
    // Clean up previous effect
    cleanup()

    // Create a custom tracker for this effect
    const tracker = {
      dependencies: [],
      _depsMap: new Map(),
      addDependency(observable: ObservableState<any>) {
        if (!dependencies.has(observable)) {
          dependencies.add(observable)
          const subscription = observable.onValue(_runEffect)
          subscriptions.set(observable, subscription)
        }
      },
    }

    // Track dependencies
    DependencyTracker.current = tracker as unknown as DependencyTracker

    // Run the effect
    try {
      const result = effectFn()
      cleanup = result || (() => {})
    } finally {
      DependencyTracker.current = null
    }
  }

  // Initial run
  _runEffect()

  // Return dispose function
  return () => {
    cleanup()
    subscriptions.forEach(subscription => subscription.unsubscribe())
    subscriptions.clear()
    dependencies.clear()
  }
}

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
const derive = function <T>(deriveFn: () => T): DeriveResult<T> {
  let dependencies = new Set<ObservableState<any>>()
  let subscriptions = new Map<ObservableState<any>, BaseSubscription>()
  let currentValue: T

  const tracker = {
    addDependency: (observable: ObservableState<any>) => {
      if (!dependencies.has(observable)) {
        const subscription = observable.onValue(_computeDerivedValue)
        dependencies.add(observable)
        subscriptions.set(observable, subscription)
      }
    },
  }

  const _computeDerivedValue = () => {
    DependencyTracker.current = tracker as unknown as DependencyTracker
    try {
      currentValue = deriveFn()
    } catch (error: unknown) {
      console.warn(
        '[Cami.js] Error in derive function:',
        error instanceof Error ? error.message : String(error)
      )
    } finally {
      DependencyTracker.current = null
    }
  }

  _computeDerivedValue()

  const dispose = () => {
    subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
    subscriptions.clear()
    dependencies.clear()
  }

  return { value: currentValue!, dispose }
}

export { ObservableState, effect, derive, DependencyTracker }
export type {
  ObserverOrNext as Subscriber,
  Dependency,
  UpdaterFunction,
  EffectCleanup,
  BaseSubscription as Subscription,
  DeriveResult,
}
