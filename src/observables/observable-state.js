import { Observable } from './observable.js';
import { produce } from 'immer';
import { _deepEqual } from '../utils.js';
import { __config } from '../config.js';
import { __trace } from '../trace.js';

/**
 * @private
 * @class
 * @description DependencyTracker is an object that holds the current dependency.
 * It is used to track dependencies between observables.
 * @type {Object}
 */
class DependencyTracker {
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
      if (!visited.has(neighbor)) return 'unvisited';
      if (recursionStack.has(neighbor)) return 'cyclic';
      return 'visited';
    };

    const getNodeType = (node, visited) => {
      if (!visited.has(node)) return 'unvisited';
      return 'visited';
    };

    const processDependencyNode = (node, visited) => {
      const nodeType = getNodeType(node, visited);

      switch (nodeType) {
        case 'unvisited':
          try {
            if (dfs(node)) return 'cycle-detected';
          } catch (error) {
            if (error.message.startsWith('Cyclic dependency detected:')) {
              console.warn(error.message);
              return 'cycle-warned';
            } else {
              throw error; // Re-throw other errors
            }
          }
          return 'processed';

        case 'visited':
          return 'skipped';

        default:
          console.warn(`Unexpected node type: ${nodeType}`);
          return 'unknown';
      }
    };

    function dfs(node) {
      visited.add(node);
      recursionStack.add(node);
      cyclePath.push(node);

      const neighbors = DependencyTracker.dependencyGraph.get(node) || new Set();
      for (const neighbor of neighbors) {
        const neighborType = getNeighborType(neighbor, visited, recursionStack);

        switch (neighborType) {
          case 'unvisited':
            if (dfs(neighbor)) return true;
            break;
          case 'cyclic':
            // We've found a cycle, capture the cycle path
            const cycleStart = cyclePath.indexOf(neighbor);
            const cycle = cyclePath.slice(cycleStart);
            console.warn(`Cyclic dependency detected: ${cycle.map(n => n.__name || 'unnamed').join(' -> ')}`);
            break;
          case 'visited':
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
        case 'cycle-detected':
          return true;
        case 'cycle-warned':
        case 'processed':
        case 'skipped':
          break;
        case 'unknown':
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
  constructor(initialValue = null, subscriber = null, { last = false, name = null } = {}) {
    super();
    if (last) {
      this.__lastObserver = subscriber;
    } else {
      this.__observers.push(subscriber);
    }
    this.__value = produce(initialValue, draft => {});
    this.__pendingUpdates = [];
    this.__updateScheduled = false;
    this.__name = name;
    this.__isUpdating = false;
    this.__updateStack = [];
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
      const cycle = [...this.__updateStack, this.__name].join(' -> ');
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
    if (typeof this.__value !== 'object' || this.__value === null) {
      throw new Error('[Cami.js] Observable value is not an object');
    }
    this.update(value => Object.assign(value, obj));
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
    if (typeof this.__value !== 'object' || this.__value === null) {
      throw new Error('[Cami.js] Observable value is not an object');
    }
    this.update(state => {
      const keys = key.split('.');
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
    if (typeof this.__value !== 'object' || this.__value === null) {
      throw new Error('[Cami.js] Observable value is not an object');
    }
    this.update(state => {
      const keys = key.split('.');
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
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
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
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
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
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
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
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(arr => {
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
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
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
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
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
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(value => {
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
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(arr => {
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
      throw new Error('[Cami.js] Observable value is not an array');
    }
    this.update(arr => {
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
      const cycle = [...this.__updateStack, this.__name].join(' -> ');
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
  __notifyObservers() {
    const observersWithLast = [...this.__observers, this.__lastObserver];
    observersWithLast.forEach(observer => {
      if (observer && typeof observer === 'function') {
        observer(this.__value);
      } else if (observer && observer.next) {
        observer.next(this.__value);
      }
    });
  }

  /**
   * @method
   * @private
   * @description This method applies all the pending updates to the value.
   * It then notifies all the observers with the updated value.
   */
  __applyUpdates() {
    let oldValue = this.__value;
    while (this.__pendingUpdates.length > 0) {
      const updater = this.__pendingUpdates.shift();
      if ((typeof this.__value === 'object' && this.__value !== null && this.__value.constructor === Object) || Array.isArray(this.__value)) {
        this.__value = produce(this.__value, updater);
      } else {
        this.__value = updater(this.__value);
      }
    }
    if (!_deepEqual(oldValue, this.__value)) {
      this.__notifyObservers();

      if (__config.events.isEnabled && typeof window !== 'undefined') {
        const event = new CustomEvent('cami:elem:state:change', {
          detail: {
            name: this.__name,
            oldValue: oldValue,
            newValue: this.__value
          }
        });
        window.dispatchEvent(event);
      }

      __trace('cami:elem:state:change', this.__name, oldValue, this.__value);
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
    this.__observers.forEach(observer => {
      if (observer && typeof observer.complete === 'function') {
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
const effect = function(effectFn) {
  let cleanup = () => {};
  let dependencies = new Set();
  let subscriptions = new Map();

  /**
   * The tracker object is used to keep track of dependencies for the effect function.
   * It provides a method to add a dependency (an observable) to the dependencies set.
   * If the observable is not already a dependency, it is added to the set and a subscription is created
   * to run the effect function whenever the observable's value changes.
   * This mechanism allows the effect function to respond to state changes in its dependencies.
   */
  const tracker = {
    addDependency: (observable) => {
      if (!dependencies.has(observable)) {
        const subscription = observable.onValue(_runEffect);
        dependencies.add(observable);
        subscriptions.set(observable, subscription);
      }
    }
  };

  /**
   * The _runEffect function is responsible for running the effect function and managing its dependencies.
   * Before the effect function is run, any cleanup from the previous run is performed and the current tracker
   * is set to this tracker. This allows the effect function to add dependencies via the tracker while it is running.
   * After the effect function has run, the current tracker is set back to null to prevent further dependencies
   * from being added outside of the effect function.
   * The effect function is expected to return a cleanup function, which is saved for the next run.
   * The cleanup function, initially empty, is replaced by the one returned from effectFn (run by the observable) before each new run and on effect disposal.
   */
  const _runEffect = () => {
    cleanup();
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

  if (typeof window !== 'undefined') {
    requestAnimationFrame(_runEffect);
  } else {
    queueMicrotask(_runEffect);
  }

  /**
   * @method
   * @description Unsubscribes from all dependencies and runs cleanup function
   * @returns {void}
   * @example
   * // Assuming `dispose` is the function returned by `effect`
   * dispose(); // This will unsubscribe from all dependencies and run cleanup function
   */
  const dispose = () => {
    subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    cleanup();
    DependencyTracker.clearGraph();
  };

  return dispose;
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
const derive = function(deriveFn) {
  let dependencies = new Set();
  let subscriptions = new Map();
  let currentValue;

  const tracker = {
    addDependency: (observable) => {
      if (!dependencies.has(observable)) {
        const subscription = observable.onChange(_computeDerivedValue);
        dependencies.add(observable);
        subscriptions.set(observable, subscription);
      }
    }
  };

  const _computeDerivedValue = () => {
    DependencyTracker.current = tracker;
    try {
      currentValue = deriveFn();
    } catch (error) {
      console.warn('[Cami.js] Error in derive function:', error.message);
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

export { ObservableState, effect, derive, DependencyTracker };
