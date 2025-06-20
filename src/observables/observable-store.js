import { Observable } from "./observable.js";
import { DependencyTracker } from "./observable-state.js";
import {
  current,
  createDraft,
  finishDraft,
  original,
  produce,
  produceWithPatches,
  applyPatches,
  enablePatches,
  freeze,
} from "immer";
import { _deepMerge, _deepClone, _deepEqual, debounce } from "../utils";
import { __config } from "../config.js";
import { __trace } from "../trace.js";
import invariant from "../invariant.js";
import { validateType } from "../types.js";
// Enable immer patches for our store implementation
enablePatches();

/**
 * @class ObservableStore
 * @extends {Observable}
 * @description This class is used to create a store that can be observed for changes. It supports registering actions and middleware, making it flexible for various use cases.
 * @example
 * ```javascript
 * // Creating a store with initial state and registering actions
 * const CartStore = cami.store({
 *   cartItems: [],
 * });
 *
 * CartStore.defineAction('add', (state, product) => {
 *   const cartItem = { ...product, cartItemId: Date.now() };
 *   state.cartItems.push(cartItem);
 * });
 *
 * CartStore.defineAction('remove', (state, product) => {
 *   state.cartItems = state.cartItems.filter(item => item.cartItemId !== product.cartItemId);
 * });
 *
 * // Using middleware for logging
 * const loggerMiddleware = (context) => {
 *   console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
 * };
 * CartStore.use(loggerMiddleware);
 * ```
 */
/**
 * ObservableStore - A high-performance state management implementation that uses
 * proxies and immer for efficient state updates with immutability guarantees.
 * Optimized for speed while maintaining compatibility with the original API.
 */
class ObservableStore extends Observable {
  constructor(initialState, options = {}) {
    super((subscriber) => {
      this.__subscriber = subscriber;
      return () => {
        this.__subscriber = null;
      };
    });

    this.name = options.name || "cami-store";
    this.schema = options.schema || {};

    // Use immer's draft for immutable state tracking with efficient updates
    this._state = createDraft(initialState);
    
    // Keep a frozen snapshot of current state for reads
    // We don't deep clone to avoid unnecessary object creation
    this._frozenState = null;
    
    // Track whether state has changed to avoid unnecessary notifications
    this._isDirty = false;
    
    // State version for internal tracking of changes (not in state object)
    this._stateVersion = 0;
    
    // Create the proxy for state access tracking
    this._proxy = this._createProxy(this._state);
    
    // Store original state for change detection
    this.previousState = initialState;

    // Core data structures for store functionality
    this.reducers = {};
    this.actions = {};
    this.dispatchQueue = [];
    this.isDispatching = false;
    this.currentDispatchPromise = null;
    
    // Cache structures
    this.queryCache = new Map();
    this.queryFunctions = new Map();
    this.queries = {};
    this.memoCache = new Map();
    
    // Resource management
    this.intervals = new Map();
    this.focusHandlers = new Map();
    this.reconnectHandlers = new Map();
    this.gcTimeouts = new Map();
    
    // Advanced features
    this.mutationFunctions = new Map();
    this.mutations = {};
    this.patchListeners = new Map();
    this.machines = {};
    this.memos = {};
    this.thunks = {};
    this.specs = new Map();
    
    // Hooks for middleware-like functionality
    this.beforeHooks = [];
    this.afterHooks = [];
    this.throttledAfterHooks = this.__executeAfterHooks.bind(this);

    // Dispatch tracking to prevent infinite loops
    this.__isDispatching = false;
    this.__dispatchStack = [];

    // Bind methods to ensure consistent this context
    this.dispatch = this.dispatch.bind(this);
    this.query = this.query.bind(this);
    this.mutate = this.mutate.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.trigger = this.trigger.bind(this);
    this.memo = this.memo.bind(this);
    this.invalidateQueries = this.invalidateQueries.bind(this);
    this.dispatchAsync = this.dispatchAsync.bind(this);
    
    // Add hook to update state version after changes
    this.afterHook(() => {
      this._stateVersion++;
    });

    // Validate initial state against schema if provided
    if (Object.keys(this.schema).length > 0) {
      this._validateState(this._state);
    }
  }

  /**
   * Returns a frozen snapshot of the current state
   * Automatically tracks dependencies for reactive computations
   */
  get state() {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this);
    }
    // Create a frozen state only once and cache it until next change
    if (!this._frozenState) {
      // Deep clone the state first to filter out symbols and other internal properties
      const cleanState = _deepClone(this._state);
      this._frozenState = deepFreeze(cleanState);
    }
    return this._frozenState;
  }

  /**
   * Alternative to 'state' getter that follows standard getState pattern
   * Used by many libraries and compatible with redux-like interfaces
   */
  getState() {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this);
    }
    // Reuse the frozen state from the getter
    if (!this._frozenState) {
      // Deep clone the state first to filter out symbols and other internal properties
      const cleanState = _deepClone(this._state);
      this._frozenState = deepFreeze(cleanState);
    }
    return this._frozenState;
  }

  /**
   * Creates a proxy that tracks property access for dependency tracking
   * and automatically schedules updates when properties change
   * 
   * This is a critical path for performance optimization
   */
  _createProxy(target) {
    // Common internal props to skip - precompute for faster checks
    const SKIP_PROPS = new Set(['constructor', 'toJSON']);
    
    // Use WeakMap to store method bindings without modifying the target object
    // This completely prevents Symbol leakage into the state object
    if (!this._stateTrapStore) {
      this._stateTrapStore = new WeakMap();
    }
    if (!this._stateTrapStore.has(target)) {
      this._stateTrapStore.set(target, new Map());
    }
    
    return new Proxy(target, {
      get: (target, prop, receiver) => {
        // Fast path 1: Skip dependency tracking for symbols and internal methods
        // Don't allow any symbols to be accessed from the target
        if (typeof prop === 'symbol' || SKIP_PROPS.has(prop)) {
          // For symbols, return undefined to prevent them from being accessed
          if (typeof prop === 'symbol') {
            return undefined;
          }
          return Reflect.get(target, prop, receiver);
        }
        
        // Fast path 2: Track dependency if in reactive context
        // This is a hot path for reactive components
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(this, prop);
        }
        
        // Get the actual value (this is the most common operation)
        const value = Reflect.get(target, prop, receiver);
        
        // Fast path 3: For non-functions, return directly
        if (typeof value !== 'function') {
          return value;
        }
        
        // Only for functions: ensure correct binding using WeakMap
        // This is less common so it's moved to the end of the function
        if (!Object.getOwnPropertyDescriptor(target, prop)) {
          // Check if we already have a bound method using WeakMap
          const trapMap = this._stateTrapStore.get(target);
          if (!trapMap.has(prop)) {
            trapMap.set(prop, value.bind(target));
          }
          return trapMap.get(prop);
        }
        
        return value;
      },
      
      set: (target, prop, value, receiver) => {
        // Fast path: Prevent symbols from being set on the target
        // This completely prevents symbol leakage into the state object
        if (typeof prop === 'symbol') {
          // Don't allow symbols to be set on the state object at all
          return true; // Return true to indicate "success" without actually setting
        }
        
        // Skip other internal properties
        if (SKIP_PROPS.has(prop)) {
          return Reflect.set(target, prop, value, receiver);
        }
        
        // Performance optimization: Reference equality check before updating
        // This avoids unnecessary updates when the value hasn't changed
        const oldValue = target[prop];
        
        // If the value is the same by reference equality, skip the update
        if (oldValue === value) {
          return true;
        }
        
        // For objects and arrays, use deep equality check
        if (typeof value === 'object' && value !== null && 
            typeof oldValue === 'object' && oldValue !== null) {
          // Import _deepEqual at the top of the file if not already imported
          if (_deepEqual(oldValue, value)) {
            return true;
          }
        }
        
        // Value is different, perform the actual set operation
        const result = Reflect.set(target, prop, value, receiver);
        
        // Mark as dirty and invalidate the frozen state
        this._isDirty = true;
        this._frozenState = null;
        
        // Add property to proxy if it's new
        if (typeof prop === 'string' && !(prop in this)) {
          this._addProxyProperty(prop);
        }
        
        return result;
      },
      
      deleteProperty: (target, prop) => {
        // Only mark dirty if the property actually exists
        if (prop in target) {
          const result = Reflect.deleteProperty(target, prop);
          this._isDirty = true;
          this._frozenState = null;
          return result;
        }
        return true;
      },
      
      // These traps are less frequently used but still important for correctness
      
      ownKeys: (target) => {
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(this);
        }
        // Filter out symbols to prevent internal symbols from leaking into state
        return Reflect.ownKeys(target).filter(key => typeof key !== 'symbol');
      },
      
      has: (target, prop) => {
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(this, prop);
        }
        return Reflect.has(target, prop);
      },
      
      defineProperty: (target, prop, descriptor) => {
        // Prevent symbols from being defined on the target
        if (typeof prop === 'symbol') {
          return true; // Return true to indicate "success" without actually defining
        }
        
        const result = Reflect.defineProperty(target, prop, descriptor);
        if (result) {
          this._isDirty = true;
          this._frozenState = null;
          if (typeof prop === 'string' && !(prop in this)) {
            this._addProxyProperty(prop);
          }
        }
        return result;
      },
      
      getOwnPropertyDescriptor: (target, prop) => {
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(this, prop);
        }
        return Reflect.getOwnPropertyDescriptor(target, prop);
      },
    });
  }

  /**
   * Adds a property from the state to the store instance for direct access
   * Only used for properties not already defined on the store
   */
  _addProxyProperty(key) {
    // Check if the property name is valid and doesn't conflict with existing methods
    if (
      typeof key === 'string' && 
      !key.startsWith('_') && 
      !key.startsWith('__') && 
      !(key in this) &&
      !['dispatch', 'getState', 'subscribe'].includes(key)
    ) {
      Object.defineProperty(this, key, {
        get: () => this._state[key],
        set: (value) => {
          this._state[key] = value;
          this._isDirty = true;
          this._frozenState = null;
        },
        enumerable: true,
        configurable: true,
      });
    }
  }

  /**
   * Efficiently notifies observers of state changes
   * Only triggers if state has changed and batches notifications
   */
  _notifyObservers() {
    // Only proceed if state is marked as dirty
    if (!this._isDirty) return;
    
    // Fast path: If there are no observers and no subscriber
    if (this.__observers.length === 0 && !this.__subscriber) {
      this._isDirty = false;
      return;
    }
    
    // Before proceeding with expensive operations, check if the state actually changed
    // by doing a deeper comparison with the previous state
    if (this.previousState && _deepEqual(this._state, this.previousState)) {
      // State hasn't actually changed in a meaningful way, so don't notify observers
      this._isDirty = false;
      return;
    }
    
    // When using immer, we should always notify upon dispatch completion
    // This ensures consistent behavior with the original implementation
    // and maintains compatibility with tests and existing code
    
    // Clear memo cache for consistent derived calculations
    this.memoCache.clear();
    this._frozenState = null;
    
    // Get a stable snapshot of the current state 
    // Using a frozen state here is critical for maintaining immutability
    // while allowing efficient access to nested properties
    const stateToEmit = deepFreeze(_deepClone(this._state));
    
    // Use a local reference to avoid issues if observers modify the collection
    // And avoid allocating a new array if possible by checking for emptiness first
    const observerCount = this.__observers.length;
    
    // Notify all observers - using a while loop counting down for better performance
    if (observerCount > 0) {
      let i = observerCount;
      while (i--) {
        const observer = this.__observers[i];
        if (observer && typeof observer.next === "function") {
          observer.next(stateToEmit);
        }
      }
    }
    
    // Notify subscriber if exists
    if (this.__subscriber && typeof this.__subscriber.next === "function") {
      this.__subscriber.next(stateToEmit);
    }
    
    // Update previous state for next change detection
    this.previousState = _deepClone(this._state);
    this._isDirty = false;
    
    // Emit web event if enabled - but only if we know it's actually used
    if (__config.events.isEnabled && typeof window !== "undefined") {
      const event = new CustomEvent("cami:store:state:change", {
        detail: {
          store: this.name,
          state: stateToEmit
        }
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * Creates a schema definition for type validation
   */
  _createDeepSchema(state) {
    // Use a cached Map for type inference to improve performance
    const typeCache = new Map();
    
    const inferType = (value) => {
      // Fast path for primitives
      if (value === null) return "null";
      if (value === undefined) return "undefined";
      
      // Use cached type if available
      if (typeCache.has(value)) {
        return typeCache.get(value);
      }
      
      // Determine type for reference types
      let type;
      if (Array.isArray(value)) {
        type = "array";
      } else if (typeof value === "object") {
        type = this._createDeepSchema(value);
      } else {
        type = typeof value;
      }
      
      // Cache and return
      if (typeof value === "object" && value !== null) {
        typeCache.set(value, type);
      }
      
      return type;
    };

    // Process all properties
    return Object.keys(state).reduce((acc, key) => {
      acc[key] = inferType(state[key]);
      return acc;
    }, {});
  }

  /**
   * Validates a state object against a schema
   */
  _validateDeepState(schema, state, path = []) {
    // Fast path if schema is empty
    if (!schema || Object.keys(schema).length === 0) return;
    
    Object.keys(schema).forEach((key) => {
      const expectedType = schema[key];
      const actualValue = state[key];
      const currentPath = [...path, key];
      const actualType = this._inferType(actualValue);
      
      // Skip function validation
      if (actualType === "function") return;
      
      // Handle nested objects recursively
      if (typeof expectedType === "object" && expectedType !== null) {
        if (typeof actualValue !== "object" || actualValue === null) {
          throw new TypeError(
            `Invalid type at ${currentPath.join(".")}. Expected object, got ${typeof actualValue}`
          );
        }
        this._validateDeepState(expectedType, actualValue, currentPath);
      } 
      // Handle primitive types
      else {
        // Special cases for null and undefined (allow any type)
        if (expectedType === "null" || expectedType === "undefined") {
          return;
        } 
        // Type mismatch error
        else if (actualType !== expectedType) {
          throw new TypeError(
            `Invalid type at ${currentPath.join(".")}. Expected ${expectedType}, got ${actualType}`
          );
        }
      }
    });
  }

  /**
   * Determine the type of a value
   */
  _inferType(value) {
    if (Array.isArray(value)) return "array";
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    return typeof value;
  }

  /**
   * Process the queue of actions to be dispatched
   */
  _processDispatchQueue() {
    if (this.isDispatching) return;
    
    this.isDispatching = true;

    try {
      // Fast path: Special case for single queued action (common case)
      const queue = this.dispatchQueue;
      if (queue.length === 1) {
        const { action, payload } = queue.shift();
        this._dispatch(action, payload);
        this.isDispatching = false;
        return;
      }
      
      // Process all items in the queue
      while (queue.length > 0) {
        const { action, payload } = queue.shift();
        this._dispatch(action, payload);
      }
    } catch (error) {
      console.error(`[Cami.js] Error in dispatch queue:`, error);
      throw error;
    } finally {
      this.isDispatching = false;
    }
  }

  /**
   * Public API for dispatching actions
   */
  dispatch(action, payload) {
    return this._dispatch(action, payload);
  }

  /**
   * Main implementation of action dispatch
   * Critical performance path - heavily optimized
   */
  _dispatch(action, payload) {
    // Fast path 1: Cyclic dispatch detection
    if (this.__isDispatching) {
      const cycle = [...this.__dispatchStack, action].join(" -> ");
      console.warn(`[Cami.js] Cyclic dispatch detected: ${cycle}`);
    }

    // Begin dispatch tracking
    this.__isDispatching = true;
    this.__dispatchStack.push(action);

    // Fast path 2: Type validation - fail early
    if (action === undefined) {
      const currentAction = this.__dispatchStack[this.__dispatchStack.length - 2];
      this.__dispatchStack.pop();
      this.__isDispatching = false;
      throw new Error(
        currentAction 
          ? `[Cami.js] Attempted to dispatch undefined action. This is likely invoked in action "${currentAction}".`
          : `[Cami.js] Attempted to dispatch undefined action in the global namespace.`
      );
    }

    if (typeof action !== "string") {
      this.__dispatchStack.pop();
      this.__isDispatching = false;
      throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof action}`);
    }

    // Fast path 3: Handle missing reducer without expensive operations
    const reducer = this.reducers[action];
    if (!reducer) {
      this.__dispatchStack.pop();
      this.__isDispatching = false;
      __trace('cami:store:warn', `No reducer found for action ${action}`);
      throw new Error(`[Cami.js] No reducer found for action: ${action}`);
    }

    // Store original state for potential rollback - only clone when needed
    // This is an expensive operation, so we do it after early-exit checks
    const originalState = _deepClone(this._state);
    
    try {
      // Fast path 4: Skip spec check if no specs defined
      const spec = this.specs?.get(action);
      if (spec?.precondition) {
        const isPreconditionMet = spec.precondition({
          state: this._state,
          payload,
          action,
        });
        
        if (!isPreconditionMet) {
          throw new Error(`Precondition not met for action ${action}`);
        }
      }

      // Fast path 5: Skip before hooks if none defined
      if (this.beforeHooks.length > 0) {
        this.__applyHooks("before", { action, payload, state: this._state });
      }

      // Create reducer context object with consistent shape for V8 optimization
      const reducerContext = {
        state: this._state,
        payload,
        dispatch: this.dispatch,
        query: this.query,
        mutate: this.mutate,
        invalidateQueries: this.invalidateQueries,
        memo: this.memo,
        trigger: this.trigger
      };

      try {
        // Use immer's produceWithPatches for efficient immutable updates
        const [nextState, patches, inversePatches] = produceWithPatches(
          this._state,
          (draft) => {
            reducer(reducerContext);
          }
        );

        // Fast path 6: Skip postcondition if not defined
        if (spec?.postcondition) {
          const isPostconditionMet = spec.postcondition({
            state: nextState,
            payload,
            action,
            previousState: this._state,
          });
          
          if (!isPostconditionMet) {
            throw new Error(`Postcondition not met for action ${action}`);
          }
        }

        // Mark store as dirty and invalidate frozen state - always needed
        this._isDirty = true;
        this._frozenState = null;
        
        // Fast path 7: Only process patches if there are any
        const hasPatches = patches.length > 0;
        
        if (hasPatches) {
          // Update state with nextState values - avoid forEach for better performance
          // Use a fast for-in loop which is optimized for object keys
          for (const key in nextState) {
            if (Object.prototype.hasOwnProperty.call(nextState, key)) {
              this._state[key] = nextState[key];
            }
          }
          
          // Notify patch listeners - only if we have patches
          if (this.patchListeners.size > 0) {
            this._notifyPatchListeners(patches);
          }
          
          // Trace state changes if tracing is enabled (dev mode)
          __trace(
            "cami:store:state:change",
            `Changed store state via action: ${action}`,
            inversePatches, 
            patches
          );
        }
        
        // Fast path 8: Always run after hooks after successful dispatch (regardless of patches)
        if (this.afterHooks.length > 0) {
          this.__applyHooks("after", {
            action,
            payload,
            state: nextState,
            previousState: originalState,
            patches,
            inversePatches,
            dispatch: this.dispatch
          });
        }
        
        // Fast path 9: Skip validation if no schema
        if (Object.keys(this.schema).length > 0) {
          this._validateState(hasPatches ? this._state : nextState);
        }
        
        // Always notify observers to ensure UI updates
        this._notifyObservers();
      } catch (error) {
        // Error recovery - restore original state
        this._state = createDraft(_deepClone(originalState));
        
        // Reset cache and internal tracking
        this._isDirty = true;
        this._frozenState = null;
        this.memoCache.clear();
        
        // Re-throw the error
        throw error;
      }

      // Return current state for any chained operations
      return this.getState();
    } finally {
      // Always clean up dispatch tracking
      this.__dispatchStack.pop();
      this.__isDispatching = false;
    }
  }

  /**
   * Add a hook to run before actions
   */
  beforeHook(hook) {
    if (typeof hook !== 'function') {
      throw new Error('[Cami.js] Hook must be a function');
    }
    this.beforeHooks.push(hook);
    return () => {
      const hooks = this.beforeHooks;
      const index = hooks.indexOf(hook);
      if (index !== -1) {
        // Faster removal by swapping with last element and popping - O(1)
        const lastIndex = hooks.length - 1;
        if (index < lastIndex) {
          hooks[index] = hooks[lastIndex];
        }
        hooks.pop();
      }
    };
  }

  /**
   * Add a hook to run after actions
   */
  afterHook(hook) {
    if (typeof hook !== 'function') {
      throw new Error('[Cami.js] Hook must be a function');
    }
    this.afterHooks.push(hook);
    return () => {
      const hooks = this.afterHooks;
      const index = hooks.indexOf(hook);
      if (index !== -1) {
        // Faster removal by swapping with last element and popping - O(1)
        const lastIndex = hooks.length - 1;
        if (index < lastIndex) {
          hooks[index] = hooks[lastIndex];
        }
        hooks.pop();
      }
    };
  }

  /**
   * Run hooks of a specific type
   * Optimized to skip empty hook arrays
   */
  __applyHooks(type, context) {
    if (type === "before") {
      // Fast path 1: No before hooks registered
      const hooks = this.beforeHooks;
      const len = hooks.length;
      if (len === 0) return;
      
      // Run all before hooks synchronously with while loop counting down
      let i = len;
      while (i--) {
        hooks[i](context);
      }
    } else if (type === "after") {
      // Fast path: no after hooks registered
      if (this.afterHooks.length === 0) return;
      
      // Use throttled hook execution to reduce calls
      this.throttledAfterHooks(context);
    }

    this.__isDispatching = true;
    this.__dispatchStack.push(action);

    try {
      if (action === undefined) {
        const currentAction =
          this.__dispatchStack[this.__dispatchStack.length - 2];
        if (currentAction) {
          throw new Error(
            `[Cami.js] Attempted to dispatch undefined action. This is likely invoked in action "${currentAction}".`
          );
        } else {
          throw new Error(
            `[Cami.js] Attempted to dispatch undefined action in the global namespace.`
          );
        }
      }

      if (typeof action !== "string") {
        throw new Error(
          `[Cami.js] Action type must be a string. Got: ${typeof action}`
        );
      }

      const reducer = this.reducers[action];
      const spec = this.specs?.get(action);

      if (!reducer) {
        console.warn(`No reducer found for action ${action}`);
        return _deepClone(this._state);
      }

      if (spec && spec.precondition) {
        const isPreconditionMet = spec.precondition({
          state: this._state,
          payload,
          action,
        });
        if (!isPreconditionMet) {
          throw new Error(`Precondition not met for action ${action}`);
        }
      }

      this.__applyHooks("before", { action, payload, state: this._state });

      const [nextState, patches, inversePatches] = produceWithPatches(
        this._state,
        (draft) => {
          reducer({
            state: draft,
            payload: payload,
            dispatch: this.dispatch.bind(this),
            query: this.query.bind(this),
            mutate: this.mutate.bind(this),
            invalidateQueries: this.invalidateQueries.bind(this),
            memo: this.memo.bind(this),
            trigger: this.trigger.bind(this),
          });
        }
      );

      if (spec && spec.postcondition) {
        const isPostconditionMet = spec.postcondition({
          state: nextState,
          payload,
          action,
          previousState: _deepClone(this._state),
        });
        if (!isPostconditionMet) {
          throw new Error(`Postcondition not met for action ${action}`);
        }
      }

      this.__applyHooks("after", {
        action,
        payload,
        state: nextState,
        previousState: this._state,
        patches,
        inversePatches,
        dispatch: this.dispatch.bind(this),
      });

      const hasChanged = patches.length > 0;
      if (hasChanged) {
        const stateHasChanged = !_deepEqual(this._state, nextState);

        if (stateHasChanged) {
          Object.keys(nextState).forEach((key) => {
            this._state[key] = nextState[key];
          });

          this._notifyPatchListeners(patches);

          if (this.devTools) {
            this.devTools.send(action, this._state);
          }

          __trace(
            "cami:store:state:change",
            `Changed store state via action: ${action}`,
            inversePatches,
            patches
          );

          if (__config.events.isEnabled && typeof window !== "undefined") {
            const event = new CustomEvent("cami:store:state:change", {
              detail: {
                action: action,
                patches: patches,
                inversePatches: inversePatches,
              },
            });
            window.dispatchEvent(event);
          }
        }
      }

      this._validateState(this._state);

      return _deepClone(this._state);
    } finally {
      this.__dispatchStack.pop();
      this.__isDispatching = false;
    }
  }

  beforeHook(hook) {
    this.beforeHooks.push(hook);
  }

  afterHook(hook) {
    this.afterHooks.push(hook);
  }

  __applyHooks(type, context) {
    const hooks = type === "before" ? this.beforeHooks : this.afterHooks;
    for (const hook of hooks) {
      hook(context);
    }
  }

  _notifyPatchListeners(patches) {
    patches.forEach((patch) => {
      const key = patch.path[0];
      const listeners = this.patchListeners.get(key);
      if (listeners) {
        listeners.forEach((callback) => callback(patch));
      }
    });
  }

  /**
   * Execute after hooks with current context
   */
  __executeAfterHooks(context) {
    // Fast path: no after hooks registered
    const hooks = this.afterHooks;
    const len = hooks.length;
    if (len === 0) return;
    
    // Run all after hooks with optimized loop
    let i = len;
    while (i--) {
      try {
        hooks[i](context);
      } catch (error) {
        console.error(`[Cami.js] Error in afterHook[${i}]:`, error);
        // Re-throw the error so it can be caught by tests and rollback logic
        throw error;
      }
    }
  }

  /**
   * Notify patch listeners of changes
   * Optimized for performance with key-based targeting
   */
  _notifyPatchListeners(patches) {
    // Fast path: no patch listeners
    if (this.patchListeners.size === 0) return;
    
    // Create a map of keys to an array of patches for that key
    // This way we notify each listener only once with all applicable patches
    const patchesByKey = new Map();
    
    // Group patches by key - use while loop counting down for better performance
    const patchesLen = patches.length;
    let i = patchesLen;
    while (i--) {
      const patch = patches[i];
      const key = patch.path[0];  // First segment of path
      
      // Skip if no listeners for this key
      if (!this.patchListeners.has(key)) continue;
      
      // Add to key's patch array - reuse existing arrays when possible
      let keyPatches = patchesByKey.get(key);
      if (!keyPatches) {
        keyPatches = [];
        patchesByKey.set(key, keyPatches);
      }
      keyPatches.push(patch);
    }
    
    // Notify listeners with grouped patches
    // Notify listeners with grouped patches - optimized iteration
    for (const [key, keyPatches] of patchesByKey) {
      const listeners = this.patchListeners.get(key);
      if (!listeners || listeners.length === 0) continue;
      
      // Use direct array access with while loop for better performance
      const listenersLen = listeners.length;
      let j = listenersLen;
      while (j--) {
        try {
          listeners[j](keyPatches);
        } catch (error) {
          console.error(`[Cami.js] Error in patch listener for key "${key}":`, error);
        }
      }
    }
  }

  /**
   * @method defineAction
   * @memberof ObservableStore
   * @param {string} action - The action type
   * @param {Function} reducer - The reducer function for the action
   * @throws {Error} - Throws an error if the action type is already registered
   * @description This method registers a reducer function for a given action type. Useful if you like redux-style reducers.
   * @example
   * ```javascript
   * // Creating a store with initial state and registering actions
   * const CartStore = cami.store({
   *   cartItems: [],
   * });
   *
   * CartStore.defineAction('add', ({ state, product }) => { 
   *   const cartItem = { ...product, cartItemId: Date.now() };
   *   state.cartItems.push(cartItem);
   * });
   *
   * CartStore.defineAction('remove', ({ state, payload }) => {
   *   state.cartItems = state.cartItems.filter(item => item.cartItemId !== payload.cartItemId);
   * });
   * ```
   */
  defineAction(action, reducer) {
    // Validation
    if (typeof action !== 'string') {
      throw new Error(`[Cami.js] Action name must be a string, got: ${typeof action}`);
    }
    
    if (typeof reducer !== 'function') {
      throw new Error(`[Cami.js] Reducer must be a function, got: ${typeof reducer}`);
    }
    
    // Check for existing action in THIS store instance, not globally
    // This fixes the URL Store test which needs to create 
    // multiple stores with same action names
    if (this.reducers[action]) {
      throw new Error(`[Cami.js] Action '${action}' is already defined in store '${this.name}'.`);
    }
    
    // Create context once when defining the action
    // This is more efficient than recreating it on every dispatch
    const baseContext = {
      dispatch: this.dispatch,
      query: this.query,
      mutate: this.mutate,
      memo: this.memo,
      trigger: this.trigger,
      invalidateQueries: this.invalidateQueries,
      dispatchAsync: this.dispatchAsync
    };
    
    // Store the reducer with a wrapper that adds context
    this.reducers[action] = (context) => {
      // Merge provided context with base context
      // This is faster than re-binding methods every time
      const storeContext = Object.assign({}, baseContext, context);
      return reducer(storeContext);
    };
    
    // Create direct action helper method
    this.actions[action] = (payload) => this.dispatch(action, payload);
    
    // For chaining
    return this;
  }

  /**
   * Define a spec for an action
   * Specs can include preconditions and postconditions
   */
  defineSpec(actionName, spec) {
    if (typeof actionName !== 'string') {
      throw new Error(`[Cami.js] Action name must be a string, got: ${typeof actionName}`);
    }
    
    if (!spec || typeof spec !== 'object') {
      throw new Error(`[Cami.js] Spec must be an object, got: ${typeof spec}`);
    }
    
    if (!this.specs) {
      this.specs = new Map();
    }
    
    // Validate spec content
    if (spec.precondition && typeof spec.precondition !== 'function') {
      throw new Error(`[Cami.js] Precondition must be a function, got: ${typeof spec.precondition}`);
    }
    
    if (spec.postcondition && typeof spec.postcondition !== 'function') {
      throw new Error(`[Cami.js] Postcondition must be a function, got: ${typeof spec.postcondition}`);
    }
    
    this.specs.set(actionName, spec);
    
    // For chaining
    return this;
  }

  /**
   * @method defineAsyncAction
   * @param {string} thunkName - The name of the thunk
   * @param {Function} asyncCallback - The async function to be executed
   * @description Defines a new thunk for the store
   */
  defineAsyncAction(thunkName, asyncCallback) {
    if (this.thunks[thunkName]) {
      throw new Error(`[Cami.js] Thunk '${thunkName}' is already defined.`);
    }
    this.thunks[thunkName] = asyncCallback;
  }

  /**
   * @method dispatchAsync
   * @param {string} thunkName - The name of the thunk to dispatch
   * @param {*} payload - The payload for the thunk
   * @returns {Promise} A promise that resolves with the result of the thunk
   * @description Dispatches an async thunk
   */
  async dispatchAsync(thunkName, payload) {
    const thunk = this.thunks[thunkName];
    if (!thunk) {
      throw new Error(`[Cami.js] No thunk found for name: ${thunkName}`);
    }

    const context = {
      state: deepFreeze(this._state),
      dispatch: this.dispatch.bind(this),
      dispatchAsync: this.dispatchAsync.bind(this),
      trigger: this.trigger.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      invalidateQueries: this.invalidateQueries.bind(this),
      payload: payload,
    };

    try {
      return await thunk(context, payload);
    } catch (error) {
      console.error(`Error in thunk ${thunkName}:`, error);
      throw error;
    }
  }

  async query(queryName, payload) {
    const query = this.queryFunctions.get(queryName);
    if (!query) {
      throw new Error(`[Cami.js] No query found for name: ${queryName}`);
    }

    try {
      return await this._executeQuery(queryName, payload, query);
    } catch (error) {
      console.error(`Error in query ${queryName}:`, error);
      throw error;
    }
  }

  async mutate(mutationName, payload) {
    const mutation = this.mutationFunctions.get(mutationName);
    if (!mutation) {
      throw new Error(`[Cami.js] No mutation found for name: ${mutationName}`);
    }

    try {
      return await this._executeMutation(mutationName, payload, mutation);
    } catch (error) {
      console.error(`Error in mutation ${mutationName}:`, error);
      throw error;
    }
  }

  defineMemo(memoName, memoFn) {
    if (typeof memoName !== "string") {
      throw new Error("Memo name must be a string");
    }
    if (typeof memoFn !== "function") {
      throw new Error(`Memo '${memoName}' must be a function`);
    }
    this.memos[memoName] = memoFn;
    this.memoCache.set(memoName, new Map());
  }

  /**
   * @method onPatch
   * @memberof ObservableStore
   * @param {string} key - The state key to listen for patches.
   * @param {Function} callback - The callback to invoke when patches are applied.
   * @description Registers a callback to be invoked whenever patches are applied to the specified state key.
   * @example
   * ```javascript
   * appStore.onPatch('posts', (patch) => {
   *   console.log('Patch applied:', patch);
   * });
   * ```
   */
  onPatch(key, callback) {
    if (!this.patchListeners.has(key)) {
      this.patchListeners.set(key, []);
    }
    this.patchListeners.get(key).push(callback);
    return () => {
      const listeners = this.patchListeners.get(key);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        // Faster removal by swapping with last element and popping - O(1)
        const lastIndex = listeners.length - 1;
        if (index < lastIndex) {
          listeners[index] = listeners[lastIndex];
        }
        listeners.pop();
      }
    };
  }

  /**
   * @method applyPatch
   * @memberof ObservableStore
   * @param {Array} patches - The patches to apply to the state.
   * @description Applies the given patches to the store's state.
   * @example
   * ```javascript
   * const patches = [{ op: 'replace', path: ['posts', 0, 'title'], value: 'New Title' }];
   * appStore.applyPatch(patches);
   * ```
   */
  applyPatch(patches) {
    this._state = applyPatches(this._state, patches);
    this.__observers.forEach((observer) => observer.next(this._state));
  }

  /**
   * @method query
   * @memberof ObservableStore
   * @param {string} queryName - The name of the query to register.
   * @param {Object} config - The configuration object for the query.
   * @param {string|Array|Function} config.queryKey - The unique key for the query or a function to generate the key.
   * @param {Function} config.queryFn - The function to fetch data for the query.
   * @param {number} [config.staleTime=0] - The time in milliseconds before the query is considered stale.
   * @param {boolean} [config.refetchOnWindowFocus=false] - Whether to refetch the query on window focus.
   * @param {number|null} [config.refetchInterval=null] - The interval in milliseconds to refetch the query.
   * @param {boolean} [config.refetchOnReconnect=true] - Whether to refetch the query on reconnect.
   * @param {number} [config.gcTime=300000] - The time in milliseconds before garbage collecting the query.
   * @param {number} [config.retry=1] - The number of retry attempts for the query.
   * @param {Function} [config.retryDelay] - The function to calculate the delay between retries.
   * @param {Function} [config.onSuccess] - The callback function to execute when the query succeeds. Receives a context object with `result`, `state`, `actions`, `mutations`, and `invalidateQueries`.
   * @param {Function} [config.onError] - The callback function to execute when the query fails. Receives a context object with `error`, `state`, `actions`, `mutations`, and `invalidateQueries`.
   * @param {Object} [config.actions=this.actions] - The actions available in the store.
   * @description Registers a query with the given configuration. This method sets up the query with the provided options and handles refetching based on various triggers like window focus, reconnect, and intervals.
   * @example
   * ```javascript
   * appStore.defineAction('setPosts', (state, posts) => {
   *   state.posts = posts;
   * });
   *
   * appStore.defineQuery('fetchPosts', {
   *   queryKey: (args) => ['posts', ...args],
   *   queryFn: () => fetch('https://api.camijs.com/posts').then(res => res.json()),
   *   onSuccess: (ctx) => {
   *     ctx.actions.setPosts(ctx.result);
   *   },
   *   onError: (ctx) => {
   *     // console.error('Query failed:', ctx.error);
   *   }
   * });
   * ```
   */
  defineQuery(queryName, config) {
    if (this.queryFunctions.has(queryName)) {
      throw new Error(
        `[Cami.js] Query with name ${queryName} has already been defined.`
      );
    }

    this.queryFunctions.set(queryName, config);
    this.queries[queryName] = (...args) => this.query(queryName, ...args);
  }

  _executeQuery(queryName, payload, query) {
    const {
      queryFn,
      queryKey,
      staleTime,
      retry,
      retryDelay,
      onFetch,
      onSuccess,
      onError,
      onSettled,
    } = query;

    const cacheKey =
      typeof queryKey === "function"
        ? queryKey(payload).join(":")
        : Array.isArray(queryKey)
        ? queryKey.join(":")
        : queryKey;

    const cachedData = this.queryCache.get(cacheKey);

    const storeContext = {
      state: this._state,
      payload,
      dispatch: this.dispatch.bind(this),
      trigger: this.trigger.bind(this),
      memo: this.memo.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      invalidateQueries: this.invalidateQueries.bind(this),
      dispatchAsync: this.dispatchAsync.bind(this),
    };

    __trace(
      `_executeQuery`,
      `Checking cache for key: ${cacheKey}, exists: ${!!cachedData}`
    );

    if (cachedData && !this._isStale(cachedData, staleTime)) {
      __trace(
        `query`,
        `Returning cached data for: ${queryName} with cacheKey: ${cacheKey}`
      );
      return this._handleQueryResult(
        queryName,
        cachedData.data,
        null,
        storeContext,
        { onSuccess, onSettled }
      );
    }

    __trace(
      `query`,
      `Data is stale or not cached, fetching new data for: ${queryName}`
    );

    if (onFetch) {
      __trace(`query`, `onFetch callback invoked for: ${queryName}`);
      onFetch(storeContext);
    }

    return this._fetchWithRetry(() => queryFn(payload), retry, retryDelay)
      .then((data) => {
        this.queryCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          isStale: false,
        });
        return this._handleQueryResult(queryName, data, null, storeContext, {
          onSuccess,
          onSettled,
        });
      })
      .catch((error) => {
        return this._handleQueryResult(queryName, null, error, storeContext, {
          onError,
          onSettled,
        });
      });
  }

  _handleQueryResult(queryName, data, error, storeContext, callbacks) {
    const { onSuccess, onError, onSettled } = callbacks;
    const context = { ...storeContext, data, error };

    if (error) {
      __trace(`query`, `Fetch failed: ${queryName}`);
      if (onError) onError(context);
    } else {
      __trace(`query`, `Fetch success: ${queryName}`);
      if (onSuccess) onSuccess(context);
    }

    if (onSettled) {
      __trace(`query`, `Fetch settled: ${queryName}`);
      onSettled(context);
    }

    if (error) throw error;
    return data;
  }

  /**
   * @method invalidateQueries
   * @memberof ObservableStore
   * @param {Object} options - The options for invalidating queries.
   * @param {string[]} [options.queryKey] - The query key to invalidate.
   * @param {Function} [options.predicate] - A predicate function to match queries to invalidate.
   * @description Invalidates the cache and any associated intervals or event listeners for the given queries.
   * @throws {Error} Throws an error if neither queryKey nor predicate is provided.
   */
  invalidateQueries({ queryKey, predicate }) {
    if (!queryKey && !predicate) {
      throw new Error(
        `[Cami.js] invalidateQueries expects either a queryKey or a predicate.`
      );
    }

    const queriesToInvalidate = Array.from(this.queryFunctions.keys()).filter(
      (queryName) => {
        if (queryKey) {
          const storedQueryKey = this.queryFunctions.get(queryName).queryKey;

          if (typeof storedQueryKey === "function") {
            // If storedQueryKey is a function, we need to call it and compare the result
            // Pass an empty object as default argument to prevent destructuring errors
            try {
              const generatedKey = storedQueryKey({});
              return JSON.stringify(generatedKey) === JSON.stringify(queryKey);
            } catch (error) {
              __trace(
                `invalidateQueries`,
                `Error generating key for ${queryName}: ${error.message}`
              );
              return false;
            }
          } else if (Array.isArray(storedQueryKey)) {
            return JSON.stringify(storedQueryKey) === JSON.stringify(queryKey);
          } else {
            return storedQueryKey === queryKey[0];
          }
        }

        if (predicate) {
          return predicate(this.queryFunctions.get(queryName));
        }

        return false;
      }
    );

    queriesToInvalidate.forEach((queryName) => {
      const query = this.queryFunctions.get(queryName);
      if (!query) return;

      let cacheKey;
      if (typeof query.queryKey === "function") {
        cacheKey = query.queryKey().join(":");
      } else if (Array.isArray(query.queryKey)) {
        cacheKey = query.queryKey.join(":");
      } else {
        cacheKey = query.queryKey;
      }

      __trace(
        `invalidateQueries`,
        `Invalidating query with key: ${queryName}, cacheKey: ${cacheKey}`
      );

      // Instead of deleting, mark as stale and reset timestamp
      if (this.queryCache.has(cacheKey)) {
        const cachedData = this.queryCache.get(cacheKey);
        cachedData.isStale = true;
        cachedData.timestamp = 0;
        this.queryCache.set(cacheKey, cachedData);
      }

      // Clear any associated intervals or event listeners
      if (this.intervals.has(queryName)) {
        clearInterval(this.intervals.get(queryName));
        this.intervals.delete(queryName);
      }

      if (this.focusHandlers.has(queryName)) {
        window.removeEventListener("focus", this.focusHandlers.get(queryName));
        this.focusHandlers.delete(queryName);
      }

      if (this.reconnectHandlers.has(queryName)) {
        window.removeEventListener(
          "online",
          this.reconnectHandlers.get(queryName)
        );
        this.reconnectHandlers.delete(queryName);
      }

      if (this.gcTimeouts.has(queryName)) {
        clearTimeout(this.gcTimeouts.get(queryName));
        this.gcTimeouts.delete(queryName);
      }

      __trace(`invalidateQueries`, `Cache entry removed for key: ${cacheKey}`);
    });
  }

  /**
   * @private
   * @method fetchWithRetry
   * @param {Function} queryFn - The query function to execute.
   * @param {Array} args - The arguments to pass to the query function.
   * @param {number} retries - The number of retries remaining.
   * @param {Function} retryDelay - A function that returns the delay in milliseconds for each retry attempt.
   * @returns {Promise} A promise that resolves to the query result.
   * @description Executes the query function with retries and exponential backoff.
   */
  _fetchWithRetry(queryFnWithContext, retry, retryDelay) {
    let attempts = 0;

    const executeFetch = () => {
      return queryFnWithContext().catch((error) => {
        if (attempts < retry) {
          attempts++;
          const delay =
            typeof retryDelay === "function"
              ? retryDelay(attempts)
              : retryDelay;
          return new Promise((resolve) => setTimeout(resolve, delay)).then(
            executeFetch
          );
        }
        throw error;
      });
    };

    return executeFetch();
  }

  /**
   * @private
   * @method _isStale
   * @param {Object} cachedData - The cached data object.
   * @param {number} staleTime - The stale time in milliseconds.
   * @returns {boolean} True if the cached data is stale, false otherwise.
   * @description Checks if the cached data is stale based on the stale time.
   */
  _isStale(cachedData, staleTime) {
    const currentTime = Date.now();
    const timeSinceLastUpdate = currentTime - cachedData.timestamp;
    const isDataStale =
      !cachedData.timestamp || timeSinceLastUpdate > staleTime;
    const isManuallyInvalidated = cachedData.isStale === true;

    __trace(
      `_isStale`,
      `
      isDataStale: ${isDataStale}
      isManuallyInvalidated: ${isManuallyInvalidated}
      Current Time: ${currentTime}
      Data Timestamp: ${cachedData.timestamp}
      Time Since Last Update: ${timeSinceLastUpdate}ms
      Stale Time: ${staleTime}ms
    `
    );

    return isDataStale || isManuallyInvalidated;
  }

  /**
   * @method mutation
   * @memberof ObservableStore
   * @param {string} mutationName - The name of the mutation to register.
   * @param {Object} config - The configuration object for the mutation.
   * @param {Function} config.mutationFn - The function to perform the mutation.
   * @param {Function} [config.onMutate] - The function to be called before the mutation is performed.
   * @param {Function} [config.onError] - The function to be called if the mutation encounters an error.
   * @param {Function} [config.onSuccess] - The function to be called if the mutation is successful.
   * @param {Function} [config.onSettled] - The function to be called after the mutation has either succeeded or failed.
   * @param {Object} [config.actions=this.actions] - The actions available in the store.
   * @param {Object} [config.queries=this.queryFunctions] - The queries available in the store.
   * @description Registers a mutation with the given configuration. This method sets up the mutation with the provided options and handles the mutation lifecycle.
   * @example
   * ```javascript
   * appStore.defineMutation('deletePost', {
   *   mutationFn: (id) => fetch(`https://api.camijs.com/posts/${id}`, { method: 'DELETE' }).then(res => res.json()),
   *   onMutate: (context) => {
   *     context.actions.setPosts(context.state.posts.filter(post => post.id !== context.args[0]));
   *   },
   *   onError: (context) => {
   *     context.actions.setPosts(context.previousState.posts);
   *   },
   *   onSuccess: (context) => {
   *     console.log('Mutation successful:', context);
   *   },
   *   onSettled: (context) => {
   *     console.log('Mutation settled');
   *     context.invalidateQueries('posts');
   *   }
   * });
   *
   * appStore.mutate('deletePost', id);
   * ```
   */
  defineMutation(mutationName, config) {
    if (this.mutationFunctions.has(mutationName)) {
      throw new Error(
        `[Cami.js] Mutation with name ${mutationName} is already registered.`
      );
    }

    this.mutationFunctions.set(mutationName, config);
    this.mutations[mutationName] = (...args) =>
      this.mutate(mutationName, ...args);
  }

  _executeMutation(mutationName, payload, mutation) {
    const { mutationFn, onMutate, onError, onSuccess, onSettled } = mutation;

    const previousState = _deepClone(this._state);

    const storeContext = {
      state: this._state,
      payload,
      dispatch: this.dispatch.bind(this),
      trigger: this.trigger.bind(this),
      memo: this.memo.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      previousState,
      invalidateQueries: this.invalidateQueries.bind(this),
      dispatchAsync: this.dispatchAsync.bind(this),
    };

    let optimisticUpdate;
    if (onMutate) {
      optimisticUpdate = onMutate(storeContext);
    }

    let result;
    let error;

    return Promise.resolve(mutationFn(payload))
      .then((data) => {
        result = data;
        if (onSuccess) {
          onSuccess({ ...storeContext, data });
        }
        return data;
      })
      .catch((err) => {
        error = err;
        if (onError) {
          onError({ ...storeContext, error: err });
        }
        throw err;
      })
      .finally(() => {
        if (onSettled) {
          onSettled({
            ...storeContext,
            data: result || error,
          });
        }
      });
  }

  /**
   * @method defineMachine
   * @param {string} machineName - The name of the machine
   * @param {Object} machineDefinition - The state machine definition
   * @description Defines or updates a state machine for the store
   */
  defineMachine(machineName, machineDefinition) {
    const validateMachine = (machine) => {
      if (typeof machine !== "object" || machine === null) {
        throw new Error("Machine definition must be an object");
      }

      Object.entries(machine).forEach(([eventName, event]) => {
        if (typeof event !== "object" || event === null) {
          throw new Error(`Event '${eventName}' must be an object`);
        }

        if (
          !event.to ||
          (typeof event.to !== "function" && typeof event.to !== "object")
        ) {
          throw new Error(
            `Event '${eventName}' must have a 'to' property that is an object or a function returning an object`
          );
        }

        if (event.guard && typeof event.guard !== "function") {
          throw new Error(`Guard for event '${eventName}' must be a function`);
        }

        if (event.onTransition && typeof event.onTransition !== "function") {
          throw new Error(
            `onTransition for event '${eventName}' must be a function`
          );
        }

        if (event.onEntry && typeof event.onEntry !== "function") {
          throw new Error(
            `onEntry for event '${eventName}' must be a function`
          );
        }

        if (event.onExit && typeof event.onExit !== "function") {
          throw new Error(`onExit for event '${eventName}' must be a function`);
        }
      });
    };

    validateMachine(machineDefinition);

    this.machines[machineName] = machineDefinition;

    // Create reducers for each state machine action
    Object.entries(machineDefinition).forEach(([eventName, event]) => {
      const fullEventName = `${machineName}:${eventName}`;
      this.defineAction(fullEventName, ({ state, payload }) => {
        if (this.isValidTransition(event.from, state)) {
          // Capture the previous state before applying the transition
          const previousState = _deepClone(state);
          const newState = typeof event.to === "function"
            ? event.to({ state, payload })
            : event.to;

          // Apply the new state
          Object.entries(newState).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              state[key] = { ...state[key], ...value };
            } else {
              state[key] = value;
            }
          });

          // Execute onEntry
          if (event.onEntry) {
            event.onEntry({ state, previousState, payload });
          }
        } else {
          console.warn(`Ignored transition '${fullEventName}' event. Current state does not match 'from' condition.`);
        }
      });
    });
  }

  /**
   * @method trigger
   * @param {string} fullEventName - The full name of the event to trigger (machineName:eventName)
   * @param {*} payload - The payload for the event
   * @returns {Promise} A promise that resolves when the event is processed
   * @description Triggers a state machine event
   */
  trigger(fullEventName, payload) {
    const [machineName, eventName] = fullEventName.split(":");
    if (!this.machines[machineName] || !this.machines[machineName][eventName]) {
      throw new Error(
        `Event '${fullEventName}' not found in any state machine.`
      );
    }

    const event = this.machines[machineName][eventName];
    const currentState = { ...this._state };

    // Execute onExit
    if (event.onExit) {
      event.onExit({ state: currentState, payload });
    }

    // Dispatch the action
    this.dispatch(fullEventName, payload);

    // Execute onTransition
    if (event.onTransition) {
      event.onTransition({
        from: currentState,
        to: this._state,
        payload,
        data: event.data,
      });
    }

    return Promise.resolve(this._state);
  }

  /**
   * @method memo
   * @param {string} memoName - The name of the memo to compute
   * @param {*} [payload] - Optional payload for the memo
   * @returns {*} The computed value of the memo
   * @description Computes and returns the value of a memoized property with efficient caching
   */
  memo(memoName, payload) {
    // Validation - handle efficiently with early return instead of throwing
    if (typeof memoName !== 'string') {
      throw new Error(`[Cami.js] Memo name must be a string, got: ${typeof memoName}`);
    }
    
    // Fast lookup with direct property access - much faster than function calls in V8
    const memoFn = this.memos[memoName];
    if (!memoFn) {
      throw new Error(`[Cami.js] Memo '${memoName}' not found.`);
    }

    // Fast path for cache lookup - avoid unnecessary Map creation
    let cache = this.memoCache.get(memoName);
    if (!cache) {
      cache = new Map();
      this.memoCache.set(memoName, cache);
    }

    // Generate a more efficient cache key
    // For primitives, use them directly to avoid string conversion overhead
    // For objects, use a faster but still reliable hash function
    let cacheKey;
    if (payload === undefined || payload === null) {
      cacheKey = '__undefined__';
    } else if (typeof payload !== 'object') {
      // Primitive values can be used directly as Map keys
      cacheKey = payload;
    } else {
      // For objects, we still need to stringify but we can optimize this further
      // in the future with a proper hash function if needed
      cacheKey = JSON.stringify(payload);
    }

    // Fast path: return cached result if available and valid
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      
      // State version check is much faster than deep dependency check
      if (cached.stateVersion === this._stateVersion) {
        return cached.result;
      }
      
      // Fall back to dependency check only when needed
      if (this._areDependenciesUnchanged(cached.dependencies)) {
        return cached.result;
      }
    }

    // No valid cache hit, need to calculate
    // Use a Set for O(1) lookup of dependencies
    const dependencies = new Set();
    
    // Optimized tracking proxy that only tracks top-level dependencies
    // This is more efficient than tracking deep property access in most cases
    const trackingProxy = new Proxy(this._state, {
      get: (target, prop) => {
        // Only track string properties that aren't internal
        if (typeof prop === 'string' && !prop.startsWith('_')) {
          dependencies.add(prop);
        }
        return target[prop];
      },
    });

    // Create context for memo function - reuse object shape for V8 optimization
    const storeContext = {
      state: trackingProxy,
      payload,
      dispatch: this.dispatch,
      trigger: this.trigger,
      memo: this.memo,
      query: this.query,
      mutate: this.mutate,
      dispatchAsync: this.dispatchAsync
    };

    // Calculate the result
    let result;
    try {
      result = memoFn(storeContext);
    } catch (error) {
      console.error(`[Cami.js] Error in memo '${memoName}':`, error);
      throw error;
    }
    
    // Cache the result with its dependencies
    cache.set(cacheKey, { 
      result, 
      dependencies,
      stateVersion: this._stateVersion
    });
    return result;
  }

  /**
   * Check if all dependencies remain unchanged since last state update
   * @private
   */
  _areDependenciesUnchanged(dependencies) {
    // Fast path 1: No dependencies means always unchanged
    if (!dependencies || dependencies.size === 0) {
      return true;
    }
    
    // Fast path 2: No previous state means always changed
    if (!this.previousState) {
      return false;
    }
    
    // Fast path 3: For small dependency sets, direct iteration is fastest
    if (dependencies.size <= 8) {
      for (const dep of dependencies) {
        // Reference check first (fast)
        if (this._state[dep] !== this.previousState[dep]) {
          // If objects, do a deep equality check (slower but more accurate)
          if (typeof this._state[dep] === 'object' && this._state[dep] !== null &&
              typeof this.previousState[dep] === 'object' && this.previousState[dep] !== null) {
            if (!_deepEqual(this._state[dep], this.previousState[dep])) {
              return false;
            }
          } else {
            return false;
          }
        }
      }
      return true;
    }
    
    // For larger dependency sets, use a different approach
    // Convert to array and use a basic for loop for better performance
    const deps = Array.from(dependencies);
    const len = deps.length;
    for (let i = 0; i < len; i++) {
      const dep = deps[i];
      // Reference check first (fast)
      if (this._state[dep] !== this.previousState[dep]) {
        // If objects, do a deep equality check (slower but more accurate)
        if (typeof this._state[dep] === 'object' && this._state[dep] !== null &&
            typeof this.previousState[dep] === 'object' && this.previousState[dep] !== null) {
          if (!_deepEqual(this._state[dep], this.previousState[dep])) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Define a memo function for the store
   * @param {string} memoName - Name of the memo
   * @param {Function} memoFn - Function that computes the memo value
   */
  defineMemo(memoName, memoFn) {
    if (typeof memoName !== "string") {
      throw new Error("[Cami.js] Memo name must be a string");
    }
    
    if (typeof memoFn !== "function") {
      throw new Error(`[Cami.js] Memo '${memoName}' must be a function`);
    }
    
    this.memos[memoName] = memoFn;
    
    // Create empty cache for this memo
    if (!this.memoCache.has(memoName)) {
      this.memoCache.set(memoName, new Map());
    }
    
    // For chaining
    return this;
  }

  // Helper methods for the state machine
  isValidTransition(from, currentState) {
    if (from === undefined) {
      return true;
    }

    const checkState = (fromState, currentStateSlice) => {
      if (typeof fromState !== "object" || fromState === null) {
        return fromState === currentStateSlice;
      }
      return Object.entries(fromState).every(([key, value]) => {
        if (!(key in currentStateSlice)) {
          return false;
        }
        if (Array.isArray(value)) {
          return value.includes(currentStateSlice[key]);
        }
        if (typeof value === "object" && value !== null) {
          return checkState(value, currentStateSlice[key]);
        }
        return currentStateSlice[key] === value;
      });
    };

    if (Array.isArray(from)) {
      return from.some((state) => checkState(state, currentState));
    }
    return checkState(from, currentState);
  }

  validateToShape(from, to) {
    if (from === undefined) {
      return;
    }

    const getShapeDescription = (obj) => {
      if (typeof obj !== "object" || obj === null) {
        return typeof obj;
      }

      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (typeof value === "object" && value !== null) {
          acc[key] = getShapeDescription(value);
        } else if (Array.isArray(value)) {
          acc[key] = `Array<${typeof value[0]}>`;
        } else {
          acc[key] = typeof value;
        }
        return acc;
      }, {});
    };

    const findMismatchedKeys = (expected, actual, prefix = "") => {
      const mismatched = [];
      Object.keys(expected).forEach((key) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (!(key in actual)) {
          mismatched.push(`${fullKey} (missing)`);
        } else if (typeof expected[key] !== typeof actual[key]) {
          mismatched.push(
            `${fullKey} (expected ${typeof expected[key]}, got ${typeof actual[
              key
            ]})`
          );
        } else if (
          typeof expected[key] === "object" &&
          expected[key] !== null &&
          typeof actual[key] === "object" &&
          actual[key] !== null
        ) {
          mismatched.push(
            ...findMismatchedKeys(expected[key], actual[key], fullKey)
          );
        }
      });
      return mismatched;
    };

    const fromShape = Array.isArray(from) ? from[0] : from;
    if (typeof to !== "object" || to === null) {
      const expectedShape = getShapeDescription(fromShape);
      throw new Error(
        `Invalid 'to' state: must be an object.\n\nExpected key-value pairs:\n${JSON.stringify(
          expectedShape,
          null,
          2
        )}`
      );
    }
    const mismatchedKeys = findMismatchedKeys(to, fromShape);
    if (mismatchedKeys.length > 0) {
      const expectedShape = getShapeDescription(fromShape);
      throw new Error(
        `Invalid 'to' state shape.\n\nExpected key-value pairs:\n${JSON.stringify(
          expectedShape,
          null,
          2
        )}\n\nMismatched keys: ${mismatchedKeys.join(", ")}`
      );
    }
  }

  executeHandler(handler, context) {
    if (typeof handler === "function") {
      handler(context);
    }
  }

  hasAction(actionName) {
    return actionName in this.reducers;
  }

  hasAsyncAction(actionName) {
    return actionName in this.thunks;
  }

  _validateState(state) {
    Object.entries(this.schema).forEach(([key, type]) => {
      try {
        if (type.type === "optional" && (state[key] === undefined || state[key] === null)) {
          // Skip validation for undefined or null optional fields
          return;
        }
        validateType(state[key], type, [key], state);
      } catch (error) {
        throw new Error(`Validation error in ${this.name}: ${error.message}`);
      }
    });
  }
}

const deepFreeze = (value, deep = true) => {
  if (typeof value !== "object" || value === null) {
    return value; // Return primitives as-is
  }
  return new Proxy(freeze(value, true), {
    set(target, prop, val) {
      throw new Error(
        `Attempted to modify frozen state. Cannot set property '${prop}' on immutable object.`
      );
    },
    deleteProperty(target, prop) {
      throw new Error(
        `Attempted to modify frozen state. Cannot delete property '${prop}' from immutable object.`
      );
    },
  });
};

const validateState = (storedState, validationRules, context) => {
  const { type, name } = context;

  if (!validationRules || !validationRules.presence) {
    __trace(
      `cami:${type}`,
      `No validation rules specified for ${type} ${name}. Using initial state.`
    );
    return false; // Invalidate by default if no rules are defined
  }

  const { keys, values } = validationRules.presence;

  if (keys) {
    for (const key of keys) {
      if (!(key in storedState)) {
        __trace(
          `cami:${type}`,
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } Invalidated: Key '${key}' is missing in stored state for ${type} ${name}.`
        );
        return false;
      }
    }
  }

  if (values) {
    for (const valueObj of values) {
      for (const [key, value] of Object.entries(valueObj)) {
        if (storedState[key] !== value) {
          __trace(
            `cami:${type}`,
            `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } Invalidated: Value mismatch for key '${key}' in ${type} ${name}. Expected ${value}, got ${
              storedState[key]
            }.`
          );
          return false;
        }
      }
    }
  }

  __trace(`cami:${type}`, `No validation rules violated for ${type} ${name}.`);
  return true;
};

/**
 * Registry for store singletons by name
 * @private
 */
const storeInstances = new Map();

/**
 * Creates a new ObservableStore instance or returns an existing one with the same name
 * 
 * @param {Object} config - Configuration options
 * @param {Object} config.state - Initial state for the store
 * @param {string} config.name - Name of the store (used for singleton lookup)
 * @param {Object} config.schema - Optional schema for type validation
 * @returns {ObservableStore} Store instance
 */
const store = (config = {}) => {
  // Default configuration
  const defaultConfig = {
    state: {},
    name: "cami-store",
    schema: {},
    enableLogging: false,
    enableDevtools: false
  };

  // Merge provided config with defaults
  const finalConfig = { ...defaultConfig, ...config };

  // Return existing instance if available (singleton pattern)
  if (storeInstances.has(finalConfig.name)) {
    return storeInstances.get(finalConfig.name);
  }

  // Create new store instance (don't add _stateVersion to state to maintain compatibility)
  const storeInstance = new ObservableStore(finalConfig.state, finalConfig);

  // Verify required methods are available
  const requiredMethods = ["memo", "query", "trigger", "dispatch", "mutate", "subscribe"];
  const missingMethods = requiredMethods.filter(method => typeof storeInstance[method] !== "function");
  
  if (missingMethods.length > 0) {
    console.warn(`[Cami.js] Store missing required methods: ${missingMethods.join(', ')}`);
  }

  // Register the store instance
  storeInstances.set(finalConfig.name, storeInstance);

  // Log creation if logging enabled
  if (finalConfig.enableLogging) {
    __trace('cami:store:create', `Created store: ${finalConfig.name}`);
  }

  return storeInstance;
};

export { ObservableStore, store };
