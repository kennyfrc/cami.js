import { Observable } from "./observable.js";
import { produce } from "immer";
<<<<<<< HEAD
import { _deepEqual } from "../utils.js";
=======
import { _deepEqual } from "../utils";
>>>>>>> session/vitest
import { __config } from "../config.js";
import { __trace } from "../trace.js";

/**
 * High-performance dependency tracking implementation
 * inspired by signals and other reactive libraries
 */
class DependencyTracker {
<<<<<<< HEAD
  static current = null;
  static dependencyGraph = new Map();

  static track(effectFn) {
    const tracker = new DependencyTracker();
    DependencyTracker.current = tracker;
    effectFn();
    DependencyTracker.current = null;
    return tracker.dependencies;
  }

  constructor() {
    this.dependencies = new Set();
  }

  addDependency(observable) {
    this.dependencies.add(observable);
    if (!DependencyTracker.dependencyGraph.has(observable)) {
      DependencyTracker.dependencyGraph.set(observable, new Set());
    }
    DependencyTracker.dependencyGraph.get(observable).add(this);
  }

  static detectCycles() {
    const visited = new Set();
    const recursionStack = new Set();
    const cyclePath = [];

    const getNeighborType = (neighbor, visited, recursionStack) => {
      if (!visited.has(neighbor)) return "unvisited";
      if (recursionStack.has(neighbor)) return "cyclic";
      return "visited";
    };

    const getNodeType = (node, visited) => {
      if (!visited.has(node)) return "unvisited";
      return "visited";
    };

    const processDependencyNode = (node, visited) => {
      const nodeType = getNodeType(node, visited);

      switch (nodeType) {
        case "unvisited":
          try {
            if (dfs(node)) return "cycle-detected";
          } catch (error) {
            if (error.message.startsWith("Cyclic dependency detected:")) {
              console.warn(error.message);
              return "cycle-warned";
            } else {
              throw error; // Re-throw other errors
            }
          }
          return "processed";

        case "visited":
          return "skipped";

        default:
          console.warn(`Unexpected node type: ${nodeType}`);
          return "unknown";
      }
    };

    function dfs(node) {
      visited.add(node);
      recursionStack.add(node);
      cyclePath.push(node);

      const neighbors =
        DependencyTracker.dependencyGraph.get(node) || new Set();
      for (const neighbor of neighbors) {
        const neighborType = getNeighborType(neighbor, visited, recursionStack);

        switch (neighborType) {
          case "unvisited":
            if (dfs(neighbor)) return true;
            break;
          case "cyclic":
            // We've found a cycle, capture the cycle path
            const cycleStart = cyclePath.indexOf(neighbor);
            const cycle = cyclePath.slice(cycleStart);
            console.warn(
              `Cyclic dependency detected: ${cycle
                .map((n) => n.__name || "unnamed")
                .join(" -> ")}`
            );
            break;
          case "visited":
            // Do nothing for already visited nodes that are not in the recursion stack
            break;
          default:
            console.warn(`Unexpected neighbor type: ${neighborType}`);
        }
      }

      recursionStack.delete(node);
      cyclePath.pop();
      return false;
    }

    // Main loop
    for (const node of DependencyTracker.dependencyGraph.keys()) {
      const result = processDependencyNode(node, visited);
      switch (result) {
        case "cycle-detected":
          return true;
        case "cycle-warned":
        case "processed":
        case "skipped":
          break;
        case "unknown":
          console.warn(`Unknown result for node processing`);
          break;
        default:
          console.warn(`Unexpected result: ${result}`);
      }
    }

    return false;
  }

  static clearGraph() {
    DependencyTracker.dependencyGraph.clear();
=======
  // Shared static context for tracking the current computation
  static current = null;

  /**
   * Track dependencies used during the execution of an effect function
   * @param {Function} effectFn - Function to track
   * @returns {Set} Set of dependencies
   */
  static track(effectFn) {
    // Save previous context to support nested tracking
    const previousTracker = DependencyTracker.current;
    
    // Create new tracker for this computation
    const tracker = new DependencyTracker();
    DependencyTracker.current = tracker;
    
    try {
      // Execute the function to track dependencies
      effectFn();
      return tracker.dependencies;
    } finally {
      // Restore previous context
      DependencyTracker.current = previousTracker;
    }
  }

  constructor() {
    // For small dependency sets, arrays are faster than Sets in V8
    // When dependency count grows large, we can switch to a Set
    this.dependencies = [];
    
    // For fast lookup to avoid duplicates (O(1) vs O(n))
    this._depsMap = new Map();
  }

  /**
   * Add a dependency to the current tracker
   * @param {Object} store - The store to track
   * @param {string} [property] - Optional property to track
   */
  addDependency(store, property) {
    // Create a unique key for the dependency
    const key = property ? `${store._uid || 'store'}.${property}` : (store._uid || 'store');
    
    // Only add if not already tracked (O(1) lookup)
    if (!this._depsMap.has(key)) {
      // Create dependency object with minimal properties
      const dep = { store, property };
      
      // Track in array for ordered iteration
      this.dependencies.push(dep);
      
      // Track in map for fast existence checks
      this._depsMap.set(key, dep);
    }
>>>>>>> session/vitest
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
class ObservableState extends Observable {
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
    initialValue = null,
    subscriber = null,
    { last = false, name = null } = {}
  ) {
    super();
    if (last) {
      this.__lastObserver = subscriber;
    } else {
      this.__observers.push(subscriber);
    }
    this.__value = produce(initialValue, (draft) => {});
    this.__pendingUpdates = [];
    this.__updateScheduled = false;
    this.__name = name;
    this.__isUpdating = false;
    this.__updateStack = [];
<<<<<<< HEAD
=======
  }

  /**
   * @method
   * @param {Function} callback - Callback function to be notified on value changes
   * @returns {Object} A subscription object with an unsubscribe method
   * @description High-performance subscription method with O(1) unsubscribe
   */
  onValue(callback) {
    // Add observer to array - O(1) operation
    const index = this.__observers.length;
    this.__observers.push(callback);
    
    // Return subscription with direct index removal for O(1) unsubscribe when possible
    return {
      unsubscribe: () => {
        // Fast path: if the callback is still at the original index, use direct removal
        if (this.__observers[index] === callback) {
          // Fast removal by swapping with last element and popping - O(1)
          const lastIndex = this.__observers.length - 1;
          if (index < lastIndex) {
            this.__observers[index] = this.__observers[lastIndex];
          }
          this.__observers.pop();
        } else {
          // Fallback to filter only when needed - O(n)
          this.__observers = this.__observers.filter(obs => obs !== callback);
        }
      }
    };
>>>>>>> session/vitest
  }

  /**
   * @method
   * @returns {any} The current value of the observable
   * @example
   * const value = observable.value;
   */
  get value() {
    if (DependencyTracker.current != null) {
      DependencyTracker.current.addDependency(this);
    }
    return this.__value;
  }

  /**
   * @method
   * @param {any} newValue - The new value to set for the observable
   * @description This method sets a new value for the observable by calling the update method with the new value.
   * @example
   * observable.value = 20;
   */
  set value(newValue) {
    if (this.__isUpdating) {
      const cycle = [...this.__updateStack, this.__name].join(" -> ");
      console.warn(`[Cami.js] Cyclic dependency detected: ${cycle}`);
      // Optionally, return here to prevent the update
      // return;
    }

    this.__isUpdating = true;
    this.__updateStack.push(this.__name);

    try {
      if (!_deepEqual(newValue, this.__value)) {
        this.__value = newValue;
        this.__notifyObservers();
      }
    } finally {
      this.__updateStack.pop();
      this.__isUpdating = false;
    }
  }

  /**
   * @method
   * @description Merges properties from the provided object into the observable's value
   * @param {Object} obj - The object whose properties to merge
   * @example
   * observable.assign({ key: 'value' });
   */
  assign(obj) {
    if (typeof this.__value !== "object" || this.__value === null) {
      throw new Error("[Cami.js] Observable value is not an object");
    }
    this.update((value) => Object.assign(value, obj));
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
  set(key, value) {
    if (typeof this.__value !== "object" || this.__value === null) {
      throw new Error("[Cami.js] Observable value is not an object");
    }
    this.update((state) => {
      const keys = key.split(".");
      let current = state;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    });
  }

  /**
   * @method
   * @description Deletes a specific key from the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.
   * @param {string} key - The key to delete
   * @throws Will throw an error if the observable's value is not an object
   * @example
   * observable.delete('key.subkey');
   */
  delete(key) {
    if (typeof this.__value !== "object" || this.__value === null) {
      throw new Error("[Cami.js] Observable value is not an object");
    }
    this.update((state) => {
      const keys = key.split(".");
      let current = state;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      delete current[keys[keys.length - 1]];
    });
  }

  /**
   * @method
   * @description Removes all key/value pairs from the observable's value
   * @example
   * observable.clear();
   */
  clear() {
    this.update(() => ({}));
  }

  /**
   * @method
   * @description Adds one or more elements to the end of the observable's value
   * @param {...any} elements - The elements to add
   * @example
   * observable.push(1, 2, 3);
   */
  push(...elements) {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    this.update((value) => {
      value.push(...elements);
    });
  }

  /**
   * @method
   * @description Removes the last element from the observable's value
   * @example
   * observable.pop();
   */
  pop() {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    this.update((value) => {
      value.pop();
    });
  }

  /**
   * @method
   * @description Removes the first element from the observable's value
   * @example
   * observable.shift();
   */
  shift() {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    this.update((value) => {
      value.shift();
    });
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
  splice(start, deleteCount, ...items) {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    this.update((arr) => {
      arr.splice(start, deleteCount, ...items);
    });
  }

  /**
   * @method
   * @description Adds one or more elements to the beginning of the observable's value
   * @param {...any} elements - The elements to add
   * @example
   * observable.unshift('newElement');
   */
  unshift(...elements) {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    this.update((value) => {
      value.unshift(...elements);
    });
  }

  /**
   * @method
   * @description Reverses the order of the elements in the observable's value
   * @example
   * observable.reverse();
   */
  reverse() {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    this.update((value) => {
      value.reverse();
    });
  }

  /**
   * @method
   * @description Sorts the elements in the observable's value
   * @param {Function} [compareFunction] - The function used to determine the order of the elements
   * @example
   * observable.sort((a, b) => a - b);
   */
  sort(compareFunction) {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    this.update((value) => {
      value.sort(compareFunction);
    });
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
  fill(value, start = 0, end = this.__value.length) {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    this.update((arr) => {
      arr.fill(value, start, end);
    });
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
  copyWithin(target, start, end = this.__value.length) {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    this.update((arr) => {
      arr.copyWithin(target, start, end);
    });
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
  update(updater) {
    if (this.__isUpdating) {
      const cycle = [...this.__updateStack, this.__name].join(" -> ");
      console.warn(`[Cami.js] Cyclic dependency detected: ${cycle}`);
      // Optionally, return here to prevent the update
      // return;
    }

    this.__isUpdating = true;
    this.__updateStack.push(this.__name);

    try {
      this.__pendingUpdates.push(updater);
      this.__scheduleupdate();
    } finally {
      this.__updateStack.pop();
      this.__isUpdating = false;
    }
  }

  __scheduleupdate() {
    if (!this.__updateScheduled) {
      this.__updateScheduled = true;
      this.__applyUpdates();
    }
  }

  /**
   * @private
   * @method
   * @description This method notifies all observers of the observable with the current value.
   * It first creates a list of observers by combining the regular observers and the last observer.
   * Then, it iterates over this list and calls each observer with the current value.
   * If the observer is a function, it is called directly.
   * If the observer is an object with a 'next' method, the 'next' method is called.
   */
  /**
   * High-performance notification method with optimized code paths
   * @private
   */
  __notifyObservers() {
<<<<<<< HEAD
    const observersWithLast = [...this.__observers, this.__lastObserver];
    observersWithLast.forEach((observer) => {
      if (observer && typeof observer === "function") {
        observer(this.__value);
      } else if (observer && observer.next) {
        observer.next(this.__value);
=======
    // Fast path: no observers
    if (this.__observers.length === 0 && !this.__lastObserver) {
      return;
    }
    
    // Cache the current value for consistent notifications
    const value = this.__value;
    
    // Use direct array access with for-loop instead of creating a new array and using forEach
    const observers = this.__observers;
    const len = observers.length;
    
    // Highly optimized path for single observer (common case)
    if (len === 1 && !this.__lastObserver) {
      const observer = observers[0];
      if (observer) {
        if (typeof observer === "function") {
          observer(value);
        } else if (observer.next) {
          observer.next(value);
        }
>>>>>>> session/vitest
      }
      return;
    }
    
    // Handle multiple observers with faster while-loop counting down
    let i = len;
    while (i--) {
      const observer = observers[i];
      if (observer) {
        if (typeof observer === "function") {
          observer(value);
        } else if (observer.next) {
          observer.next(value);
        }
      }
    }
    
    // Handle the last observer separately (if exists)
    if (this.__lastObserver) {
      if (typeof this.__lastObserver === "function") {
        this.__lastObserver(value);
      } else if (this.__lastObserver && this.__lastObserver.next) {
        this.__lastObserver.next(value);
      }
    }
  }

  /**
   * @method
   * @private
   * @description This method applies all the pending updates to the value.
   * It then notifies all the observers with the updated value.
   */
  /**
   * Optimized update application with fast paths for common cases
   * @private
   */
  __applyUpdates() {
<<<<<<< HEAD
    let oldValue = this.__value;
    while (this.__pendingUpdates.length > 0) {
      const updater = this.__pendingUpdates.shift();
      if (
        (typeof this.__value === "object" &&
          this.__value !== null &&
          this.__value.constructor === Object) ||
        Array.isArray(this.__value)
      ) {
        this.__value = produce(this.__value, updater);
=======
    // Skip the expensive _deepEqual check by tracking changes explicitly
    let hasChanged = false;
    
    // Cache the old value only if needed for event emission
    const needsEventOrTrace = __config.events.isEnabled || __trace.isEnabled;
    const oldValue = needsEventOrTrace ? this.__value : undefined;
    
    // Process all pending updates at once
    const updates = this.__pendingUpdates;
    const updateCount = updates.length;
    
    if (updateCount === 0) {
      // No updates, nothing to do
      this.__updateScheduled = false;
      return;
    }
    
    // Fast path for simple values (not objects or arrays)
    const isComplexValue = (typeof this.__value === "object" && 
                           this.__value !== null && 
                           (this.__value.constructor === Object || Array.isArray(this.__value)));
    
    if (isComplexValue) {
      // For objects/arrays, use immer's produce
      // Apply all updates in a batch
      if (updateCount === 1) {
        // Fast path for single update (common case)
        const updater = updates[0];
        const newValue = produce(this.__value, updater);
        
        // First try reference equality (fast)
        if (newValue !== this.__value) {
          // For objects/arrays, do deep equality check to avoid unnecessary updates
          if (typeof newValue === 'object' && newValue !== null &&
              typeof this.__value === 'object' && this.__value !== null) {
            if (!_deepEqual(newValue, this.__value)) {
              hasChanged = true;
              this.__value = newValue;
            }
          } else {
            hasChanged = true;
            this.__value = newValue;
          }
        }
>>>>>>> session/vitest
      } else {
        // When multiple updates exist, apply them in sequence
        let currentValue = this.__value;
        for (let i = 0; i < updateCount; i++) {
          const updater = updates[i];
          const newValue = produce(currentValue, updater);
          // First try reference equality (fast)
          if (newValue !== currentValue) {
            // For objects/arrays, do deep equality check to avoid unnecessary updates
            if (typeof newValue === 'object' && newValue !== null &&
                typeof currentValue === 'object' && currentValue !== null) {
              if (!_deepEqual(newValue, currentValue)) {
                hasChanged = true;
                currentValue = newValue;
              }
            } else {
              hasChanged = true;
              currentValue = newValue;
            }
          }
        }
        
        if (hasChanged) {
          this.__value = currentValue;
        }
      }
    } else {
      // For primitive values, apply updaters directly in sequence
      let currentValue = this.__value;
      for (let i = 0; i < updateCount; i++) {
        const updater = updates[i];
        const newValue = updater(currentValue);
        // First try reference equality (fast)
        if (newValue !== currentValue) {
          // For objects/arrays, do deep equality check to avoid unnecessary updates
          if (typeof newValue === 'object' && newValue !== null &&
              typeof currentValue === 'object' && currentValue !== null) {
            if (!_deepEqual(newValue, currentValue)) {
              hasChanged = true;
              currentValue = newValue;
            }
          } else {
            hasChanged = true;
            currentValue = newValue;
          }
        }
      }
      
      if (hasChanged) {
        this.__value = currentValue;
      }
    }
<<<<<<< HEAD
    if (!_deepEqual(oldValue, this.__value)) {
      this.__notifyObservers();

=======
    
    // Clear the update queue - faster than multiple shift() calls
    updates.length = 0;
    
    // Only notify observers if the value actually changed
    if (hasChanged) {
      this.__notifyObservers();
      
      // Only emit events if necessary and configured
>>>>>>> session/vitest
      if (__config.events.isEnabled && typeof window !== "undefined") {
        const event = new CustomEvent("cami:elem:state:change", {
          detail: {
            name: this.__name,
            oldValue: oldValue,
            newValue: this.__value,
          },
        });
        window.dispatchEvent(event);
      }
<<<<<<< HEAD

      __trace("cami:elem:state:change", this.__name, oldValue, this.__value);
=======
      
      // Only trace if enabled
      if (needsEventOrTrace) {
        __trace("cami:elem:state:change", this.__name, oldValue, this.__value);
      }
>>>>>>> session/vitest
    }
    
    this.__updateScheduled = false;
  }

  /**
   * @method
   * @description Calls the complete method of all observers.
   * @example
   * observable.complete();
   */
  complete() {
    this.__observers.forEach((observer) => {
      if (observer && typeof observer.complete === "function") {
        observer.complete();
      }
    });
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
const effect = function (effectFn) {
  let cleanup = () => {};
  let dependencies = new Set();

  const _runEffect = () => {
    // Clean up previous effect
    cleanup();

    // Track dependencies with optimized object allocation
    DependencyTracker.current = { addDependency };  // Reuse the same function reference
    
    function addDependency(observable) {
      if (!dependencies.has(observable)) {
        dependencies.add(observable);
        observable.onValue(_runEffect);
      }
<<<<<<< HEAD
    },
=======
    }

    // Run the effect
    try {
      cleanup = effectFn() || (() => {});
    } finally {
      DependencyTracker.current = null;
    }
>>>>>>> session/vitest
  };

  // Initial run
  _runEffect();

  // Return dispose function
  return () => {
    cleanup();
<<<<<<< HEAD
    DependencyTracker.current = tracker;
    try {
      cleanup = effectFn() || (() => {});
    } catch (error) {
      console.warn(error.message);
      // Optionally, you can add more detailed logging here
    } finally {
      DependencyTracker.current = null;
    }

    try {
      DependencyTracker.detectCycles();
    } catch (error) {
      console.warn(error.message);
    }
  };

  if (typeof window !== "undefined") {
    requestAnimationFrame(_runEffect);
  } else {
    queueMicrotask(_runEffect);
  }
=======
    dependencies.forEach(dep => dep.__observers = dep.__observers.filter(obs => obs !== _runEffect));
    dependencies.clear();
  };
};

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
const derive = function (deriveFn) {
  let dependencies = new Set();
  let subscriptions = new Map();
  let currentValue;

  const tracker = {
    addDependency: (observable) => {
      if (!dependencies.has(observable)) {
        const subscription = observable.onValue(_computeDerivedValue);
        dependencies.add(observable);
        subscriptions.set(observable, subscription);
      }
    },
  };

  const _computeDerivedValue = () => {
    DependencyTracker.current = tracker;
    try {
      currentValue = deriveFn();
    } catch (error) {
      console.warn("[Cami.js] Error in derive function:", error.message);
    } finally {
      DependencyTracker.current = null;
    }

    try {
      DependencyTracker.detectCycles();
    } catch (error) {
      console.warn(error.message);
    }
  };

  _computeDerivedValue();
>>>>>>> session/vitest

  const dispose = () => {
    subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
<<<<<<< HEAD
    cleanup();
    DependencyTracker.clearGraph();
=======
    subscriptions.clear();
    dependencies.clear();
>>>>>>> session/vitest
  };

  return { value: currentValue, dispose };
};

<<<<<<< HEAD
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
const derive = function (deriveFn) {
  let dependencies = new Set();
  let subscriptions = new Map();
  let currentValue;

  const tracker = {
    addDependency: (observable) => {
      if (!dependencies.has(observable)) {
        const subscription = observable.onValue(_computeDerivedValue);
        dependencies.add(observable);
        subscriptions.set(observable, subscription);
      }
    },
  };

  const _computeDerivedValue = () => {
    DependencyTracker.current = tracker;
    try {
      currentValue = deriveFn();
    } catch (error) {
      console.warn("[Cami.js] Error in derive function:", error.message);
    } finally {
      DependencyTracker.current = null;
    }

    try {
      DependencyTracker.detectCycles();
    } catch (error) {
      console.warn(error.message);
    }
  };

  _computeDerivedValue();

  const dispose = () => {
    subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    subscriptions.clear();
    dependencies.clear();
  };

  return { value: currentValue, dispose };
};

=======
>>>>>>> session/vitest
export { ObservableState, effect, derive, DependencyTracker };
