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
import { _deepMerge, _deepClone, _deepEqual } from "../utils.js";
import { __config } from "../config.js";
import { __trace } from "../trace.js";
import invariant from "../invariant.js";
import { validateType } from "../types.js";
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

    this._state = this._createProxy(createDraft(initialState));
    this.previousState = _deepClone(initialState);

    this.reducers = {};
    this.actions = {};
    this.devTools = this.__connectToDevTools();
    this.dispatchQueue = [];
    this.isDispatching = false;
    this.currentDispatchPromise = null;
    this.queryCache = new Map();
    this.queryFunctions = new Map();
    this.queries = {};
    this.intervals = new Map();
    this.focusHandlers = new Map();
    this.reconnectHandlers = new Map();
    this.gcTimeouts = new Map();
    this.mutationFunctions = new Map();
    this.mutations = {};
    this.patchListeners = new Map();
    this.machines = {};
    this.memos = {};
    this.memoCache = new Map();
    this.thunks = {};
    this.beforeHooks = [];
    this.afterHooks = [];
    this.specs = new Map();

    // destructurable methods
    this.dispatch = this.dispatch.bind(this);
    this.query = this.query.bind(this);
    this.mutate = this.mutate.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.trigger = this.trigger.bind(this);
    this.memo = this.memo.bind(this);
    this.invalidateQueries = this.invalidateQueries.bind(this);
    this.dispatchAsync = this.dispatchAsync.bind(this);

    this.__isDispatching = false;
    this.__dispatchStack = [];

    this._validateState(this._state);
  }

  get state() {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this);
    }
    return deepFreeze(this._state);
  }

  getState() {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this);
    }
    return deepFreeze(this._state);
  }

  _createProxy(target) {
    return new Proxy(target, {
      get: (target, prop) => {
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(this, prop);
        }
        return target[prop];
      },
      set: (target, prop, value) => {
        target[prop] = value;
        if (!(prop in this)) {
          this._reProxy(); // Re-proxy in case new properties are added
        }
        this._notifyObservers();
        return true;
      },
    });
  }

  _reProxy() {
    Object.keys(this._state).forEach((key) => {
      if (!(key in this)) {
        Object.defineProperty(this, key, {
          get: () => this._state[key],
          set: (value) => {
            this._state[key] = value;
            this._notifyObservers();
          },
          enumerable: true,
          configurable: true,
        });
      }
    });
  }

  _notifyObservers() {
    if (!_deepEqual(this._state, this.previousState)) {
      this.memoCache.clear();
      this.__observers.forEach((observer) => observer.next(this._state));
      if (this.__subscriber && typeof this.__subscriber.next === "function") {
        this.__subscriber.next(this._state);
      }
      this.previousState = _deepClone(this._state);

      // Notify dependencies
      const dependencies = DependencyTracker.dependencyGraph.get(this);
      if (dependencies) {
        dependencies.forEach((dep) => {
          if (typeof dep.update === "function") {
            dep.update();
          }
        });
      }
    }
  }

  _createDeepSchema(state) {
    const inferType = (value) => {
      if (Array.isArray(value)) return "array";
      if (value === null) return "null";
      if (value === undefined) return "undefined";
      if (typeof value === "object") return this._createDeepSchema(value);
      return typeof value;
    };

    return Object.keys(state).reduce((acc, key) => {
      acc[key] = inferType(state[key]);
      return acc;
    }, {});
  }

  _validateDeepState(schema, state, path = []) {
    Object.keys(schema).forEach((key) => {
      const expectedType = schema[key];
      const actualValue = state[key];
      const currentPath = [...path, key];

      const actualType = this._inferType(actualValue);
      if (actualType === "function") {
      }

      if (typeof expectedType === "object" && expectedType !== null) {
        if (typeof actualValue !== "object" || actualValue === null) {
          throw new TypeError(
            `Invalid type at ${currentPath.join(
              "."
            )}. Expected object, got ${typeof actualValue}`
          );
        }
        this._validateDeepState(expectedType, actualValue, currentPath);
      } else {
        if (expectedType === "null") {
          // Allow any type for null
        } else if (expectedType === "undefined") {
          // Allow any type for undefined
        } else if (actualType !== expectedType) {
          throw new TypeError(
            `Invalid type at ${currentPath.join(
              "."
            )}. Expected ${expectedType}, got ${actualType}`
          );
        }
      }
    });
  }

  _inferType(value) {
    if (Array.isArray(value)) return "array";
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    return typeof value;
  }

  _processDispatchQueue() {
    this.isDispatching = true;

    const processNext = () => {
      if (this.dispatchQueue.length > 0) {
        const { action, payload } = this.dispatchQueue.shift();
        try {
          this._dispatch(action, payload);
        } catch (error) {
          this.isDispatching = false;
          throw error;
        }
        processNext();
      } else {
        this.isDispatching = false;
      }
    };

    processNext();
  }

  dispatch(action, payload) {
    return this._dispatch(action, payload);
  }

  _dispatch(action, payload) {
    if (this.__isDispatching) {
      const cycle = [...this.__dispatchStack, action].join(" -> ");
      console.warn(`[Cami.js] Cyclic dispatch detected: ${cycle}`);
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
   * @private
   * @method _connectToDevTools
   * @returns {Object|null} - Returns the devTools object if available, else null
   * @description This method connects the store to the Redux DevTools extension if it is available.
   */
  __connectToDevTools() {
    if (
      typeof window !== "undefined" &&
      window["__REDUX_DEVTOOLS_EXTENSION__"]
    ) {
      const devTools = window["__REDUX_DEVTOOLS_EXTENSION__"].connect();
      devTools.init(this._state);
      return devTools;
    }
    return null;
  }

  /**
   * @method register
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
   * CartStore.defineAction('add', ({ state, product }) => { // Updated parameter format
   *   const cartItem = { ...product, cartItemId: Date.now() };
   *   state.cartItems.push(cartItem);
   * });
   *
   * CartStore.defineAction('remove', (state, product) => {
   *   state.cartItems = state.cartItems.filter(item => item.cartItemId !== product.cartItemId);
   * });
   *
   * ```
   */
  defineAction(action, reducer) {
    if (this.reducers[action]) {
      throw new Error(`[Cami.js] Action '${action}' is already defined.`);
    }

    this.reducers[action] = (context) => {
      const storeContext = {
        ...context,
        dispatch: this.dispatch.bind(this),
        query: this.query.bind(this),
        mutate: this.mutate.bind(this),
        memo: this.memo.bind(this),
        trigger: this.trigger.bind(this),
        invalidateQueries: this.invalidateQueries.bind(this),
        dispatchAsync: this.dispatchAsync.bind(this),
      };
      return reducer(storeContext);
    };

    this.actions[action] = (...args) => {
      return this.dispatch(action, ...args);
    };
  }

  defineSpec(actionName, spec) {
    if (!this.specs) {
      this.specs = new Map();
    }
    this.specs.set(actionName, spec);
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
        listeners.splice(index, 1);
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

    // Create or update the machine
    if (!this.machines[machineName]) {
      this.machines[machineName] = {};
    }

    // Merge the new definition with the existing one
    this.machines[machineName] = {
      ...this.machines[machineName],
      ...machineDefinition,
    };

    // Define actions for the new or updated events
    Object.keys(machineDefinition).forEach((eventName) => {
      const fullEventName = `${machineName}:${eventName}`;
      this.defineAction(fullEventName, ({ state, payload }) => {
        const event = this.machines[machineName][eventName];
        const currentState = { ...state };

        const storeContext = {
          state,
          payload,
          dispatch: this.dispatch.bind(this),
          query: this.query.bind(this),
          mutate: this.mutate.bind(this),
          trigger: this.trigger.bind(this),
          memo: this.memo.bind(this),
          dispatchAsync: this.dispatchAsync.bind(this),
        };

        if (this.isValidTransition(event.from, currentState)) {
          const applyTransition = (to) => {
            this.validateToShape(event.from, to);

            // Execute onExit for the current state
            this.executeHandler(event.onExit, {
              ...storeContext,
              state: currentState,
            });

            Object.entries(to).forEach(([key, value]) => {
              state[key] = value;
            });

            // Execute onEntry for the new state
            this.executeHandler(event.onEntry, storeContext);
          };

          const newState =
            typeof event.to === "function"
              ? event.to({ state: currentState, payload })
              : event.to;

          applyTransition(newState);

          // Execute onTransition
          this.executeHandler(event.onTransition, {
            ...storeContext,
            from: currentState,
            to: newState,
            data: event.data,
          });
        } else {
          const actual = {};
          if (
            Array.isArray(event.from) &&
            event.from.length > 0 &&
            typeof event.from[0] === "object"
          ) {
            Object.keys(event.from[0]).forEach((key) => {
              actual[key] = currentState[key];
            });
          }
          __trace(
            "cami:state-machine:ignored-transition",
            `Ignored transition '${fullEventName}' event. Actual: ${JSON.stringify(
              actual
            )}. Expected: Any of ${JSON.stringify(event.from)}`
          );
        }
      });
    });
  }

  /**
   * @method trigger
   * @param {string} fullEventName - The full name of the event to trigger (machineName/eventName)
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
    return this.dispatch(fullEventName, payload);
  }

  /**
   * @method memo
   * @param {string} memoName - The name of the memo to compute
   * @param {*} [payload] - Optional payload for the memo
   * @returns {*} The computed value of the memo
   * @description Computes and returns the value of a memoized property
   */
  memo(memoName, payload) {
    const memoFn = this.memos[memoName];
    if (!memoFn) {
      throw new Error(`Memo '${memoName}' not found.`);
    }

    let cache = this.memoCache.get(memoName);
    if (!cache) {
      cache = new Map();
      this.memoCache.set(memoName, cache);
    }

    const cacheKey = JSON.stringify(payload);

    if (cache.has(cacheKey)) {
      const { result, dependencies } = cache.get(cacheKey);
      if (this._areDependenciesUnchanged(dependencies)) {
        return result;
      }
    }

    const dependencies = new Set();
    const trackingProxy = new Proxy(this._state, {
      get: (target, prop) => {
        dependencies.add(prop);
        return target[prop];
      },
    });

    const storeContext = {
      state: trackingProxy,
      payload,
      dispatch: this.dispatch.bind(this),
      trigger: this.trigger.bind(this),
      memo: this.memo.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      dispatchAsync: this.dispatchAsync.bind(this),
    };

    const result = memoFn(storeContext);
    cache.set(cacheKey, { result, dependencies });

    return result;
  }

  _areDependenciesUnchanged(dependencies) {
    return Array.from(dependencies).every(
      (dep) => this._state[dep] === this.previousState[dep]
    );
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

  _validateState(state) {
    Object.entries(this.schema).forEach(([key, type]) => {
      try {
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

const storeInstances = new Map();

const store = (config = {}) => {
  const defaultConfig = {
    state: {},
    name: "cami-store",
  };

  const finalConfig = { ...defaultConfig, ...config };

  if (storeInstances.has(finalConfig.name)) {
    return storeInstances.get(finalConfig.name);
  }

  const storeInstance = new ObservableStore(finalConfig.state, finalConfig);

  const methods = ["memo", "query", "trigger", "dispatch", "mutate"];
  methods.forEach((method) => {
    if (typeof storeInstance[method] !== "function") {
      console.warn(`Method ${method} is not available on the store instance.`);
    }
  });

  storeInstances.set(finalConfig.name, storeInstance);

  return storeInstance;
};

export { ObservableStore, store };
