import { Observable } from './observable.js';
import { DependencyTracker } from './observable-state.js'
import { current, createDraft, finishDraft, original, produce, produceWithPatches, applyPatches, enablePatches, freeze } from 'immer';
import { _deepMerge, _deepClone, _deepEqual } from '../utils.js';
import { __config } from '../config.js';
import { __trace } from '../trace.js';
import invariant from '../invariant.js';
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
  constructor(initialState) {
    if (typeof initialState !== 'object' || initialState === null) {
      throw new TypeError('[Cami.js] initialState must be an object');
    }

    super(subscriber => {
      this.__subscriber = subscriber;
      return () => { this.__subscriber = null; };
    });

    this._state = this._createProxy(createDraft(initialState));
    this.previousState = _deepClone(initialState);
    this.schema = this._createDeepSchema(initialState);

    this.reducers = {};
    this.actions = {};
    this.middlewares = [];
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

    // destructurable methods
    this.dispatch = this.dispatch.bind(this);
    this.query = this.query.bind(this);
    this.mutate = this.mutate.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.trigger = this.trigger.bind(this);
    this.memo = this.memo.bind(this);
    this.invalidateQueries = this.invalidateQueries.bind(this);
    this.dispatchAsync = this.dispatchAsync.bind(this);

    this._persistState = () => {
      if (this.storage) {
        const currentTime = new Date();
        const expiryTime = new Date(currentTime.getTime() + this.expiry);

        this.storage.setItem(this.name, JSON.stringify(this._state));
        this.storage.setItem(`${this.name}-expiry`, expiryTime.getTime().toString());
      }
    };

    Object.keys(initialState).forEach(key => {
      if (typeof initialState[key] === 'function') {
        this.defineAction(key, initialState[key]);
      } else {
        this._state[key] = initialState[key];
      }
    });
  }

  get state() {
    return deepFreeze(this._state);
  }

  getState() {
    return deepFreeze(this._state);
  }

  _createProxy(target) {
    return new Proxy(target, {
      get: (target, prop) => {
        if (DependencyTracker.current) {
          const propertyKey = typeof prop === 'symbol' ? Symbol.keyFor(prop) || prop.toString() : prop;
          DependencyTracker.current.addDependency(this, propertyKey);
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
      }
    });
  }

  _reProxy() {
    Object.keys(this._state).forEach(key => {
      if (!(key in this)) {
        Object.defineProperty(this, key, {
          get: () => this._state[key],
          set: (value) => {
            this._state[key] = value;
            this._notifyObservers();
          },
          enumerable: true,
          configurable: true
        });
      }
    });
  }

  _notifyObservers() {
    if (!_deepEqual(this._state, this.previousState)) {
      this.memoCache.clear();
      this.__observers.forEach(observer => observer.next(this._state));
      if (this.__subscriber && typeof this.__subscriber.next === 'function') {
        this.__subscriber.next(this._state);
      }
      this.previousState = _deepClone(this._state);
    }
  }

  _createDeepSchema(state) {
    const inferType = (value) => {
      if (Array.isArray(value)) return 'array';
      if (value === null) return 'maybeNull';
      if (value === undefined) return 'maybeUndefined';
      if (typeof value === 'object') return this._createDeepSchema(value);
      return typeof value;
    };

    return Object.keys(state).reduce((acc, key) => {
      acc[key] = inferType(state[key]);
      return acc;
    }, {});
  }

  _validateDeepState(schema, state, path = []) {
    Object.keys(schema).forEach(key => {
      const expectedType = schema[key];
      const actualValue = state[key];
      const currentPath = [...path, key];

      const actualType = this._inferType(actualValue);
      if (actualType === 'function') {
      }

      if (typeof expectedType === 'object' && expectedType !== null) {
        if (typeof actualValue !== 'object' || actualValue === null) {
          throw new TypeError(`Invalid type at ${currentPath.join('.')}. Expected object, got ${typeof actualValue}`);
        }
        this._validateDeepState(expectedType, actualValue, currentPath);
      } else {
        if (expectedType === 'maybeNull') {
          // Allow any type for maybeNull
        } else if (expectedType === 'maybeUndefined') {
          // Allow any type for maybeUndefined
        } else if (actualType !== expectedType) {
          throw new TypeError(`Invalid type at ${currentPath.join('.')}. Expected ${expectedType}, got ${actualType}`);
        }
      }
    });
  }

  _inferType(value) {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'maybeNull';
    if (value === undefined) return 'maybeUndefined';
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

  _dispatch(action, payload) {
    if (typeof action !== 'string') {
      throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof action}`);
    }

    const reducer = this.reducers[action];

    if (!reducer) {
      console.warn(`No reducer found for action ${action}`);
      return;
    }

    this.__applyMiddleware(action, payload);

    const [nextState, patches, inversePatches] = produceWithPatches(this._state, draft => {
      reducer({
        state: draft,
        payload: payload,
        dispatch: this.dispatch.bind(this),
        query: this.query.bind(this),
        mutate: this.mutate.bind(this),
        invalidateQueries: this.invalidateQueries.bind(this),
        memo: this.memo.bind(this),
        trigger: this.trigger.bind(this)
      });
    });

    try {
      this._validateDeepState(this.schema, nextState);
    } catch (error) {
      throw new Error(`[Cami.js] Type validation failed for action ${action}: ${error.message}`);
    }

    const hasChanged = patches.length > 0;
    if (hasChanged) {
      Object.keys(nextState).forEach(key => {
        this._state[key] = nextState[key];
      });

      this._notifyPatchListeners(patches);
      if (this.devTools) {
        this.devTools.send(action, this._state);
      }

      __trace('cami:store:state:change', `Changed store state via action: ${action}`, inversePatches, patches);

      if (__config.events.isEnabled && typeof window !== 'undefined') {
        const event = new CustomEvent('cami:store:state:change', {
          detail: {
            action: action,
            patches: patches,
            inversePatches: inversePatches
          }
        });
        window.dispatchEvent(event);
      }
    }

    return _deepClone(this._state);
  }

  _notifyPatchListeners(patches) {
    patches.forEach(patch => {
      const key = patch.path[0];
      const listeners = this.patchListeners.get(key);
      if (listeners) {
        listeners.forEach(callback => callback(patch));
      }
    });
  }

  /**
   * @private
   * @method _applyMiddleware
   * @param {string} action - The action type
   * @param {...any} args - The arguments to pass to the action
   * @returns {void}
   * @description This method applies all registered middlewares to the given action and arguments.
   */
  __applyMiddleware(action, ...args) {
    const context = {
      state: deepFreeze(this._state),
      action,
      payload: args,
    };

    for (const middleware of this.middlewares) {
      middleware(context);
    }
  }

  /**
   * @private
   * @method _connectToDevTools
   * @returns {Object|null} - Returns the devTools object if available, else null
   * @description This method connects the store to the Redux DevTools extension if it is available.
   */
  __connectToDevTools() {
    if (typeof window !== 'undefined' && window['__REDUX_DEVTOOLS_EXTENSION__']) {
      const devTools = window['__REDUX_DEVTOOLS_EXTENSION__'].connect();
      devTools.init(this._state);
      return devTools;
    }
    return null;
  }

  /**
   * @method use
   * @memberof ObservableStore
   * @param {Function} middleware - The middleware function to use
   * @description This method registers a middleware function to be used with the store. Useful if you like redux-style middleware.
   * @example
   * ```javascript
   * const loggerMiddleware = (context) => {
   *   console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
   * };
   * CartStore.use(loggerMiddleware);
   * ```
   */
  use(middleware) {
    this.middlewares.push(middleware);
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
   * CartStore.defineAction('remove', ({ state, product }) => { // Updated parameter format
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
        dispatchAsync: this.dispatchAsync.bind(this)
      };
      return reducer(storeContext);
    };

    this.actions[action] = (...args) => {
      return this.dispatch(action, ...args);
    };
  }

  dispatch(action, payload) {
    this.dispatchQueue.push({ action, payload });
    if (!this.isDispatching) {
      this._processDispatchQueue();
    }
  }

  /**
   * @method defineThunk
   * @param {string} thunkName - The name of the thunk
   * @param {Function} asyncCallback - The async function to be executed
   * @description Defines a new thunk for the store
   */
  defineThunk(thunkName, asyncCallback) {
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
      payload: payload
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
    if (typeof memoName !== 'string') {
      throw new Error('Memo name must be a string');
    }
    if (typeof memoFn !== 'function') {
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
    this.__observers.forEach(observer => observer.next(this._state));
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
      throw new Error(`[Cami.js] Query with name ${queryName} has already been defined.`);
    }

    this.queryFunctions.set(queryName, config);
    this.queries[queryName] = (...args) => this.query(queryName, ...args);
  }

  _executeQuery(queryName, payload, query) {
    const { queryFn, queryKey, staleTime, retry, retryDelay, onFetch, onSuccess, onError, onSettled } = query;

    const cacheKey = typeof queryKey === 'function' ? queryKey(payload).join(':') : Array.isArray(queryKey) ? queryKey.join(':') : queryKey;

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
      dispatchAsync: this.dispatchAsync.bind(this)
    };

    __trace(`_executeQuery`, `Checking cache for key: ${cacheKey}, exists: ${!!cachedData}`);

    if (cachedData && !this._isStale(cachedData, staleTime)) {
      __trace(`query`, `Returning cached data for: ${queryName} with cacheKey: ${cacheKey}`);
      return Promise.resolve(cachedData.data);
    }

    __trace(`query`, `Data is stale or not cached, fetching new data for: ${queryName}`);

    if (onFetch) {
      __trace(`query`, `onFetch callback invoked for: ${queryName}`);
      onFetch(storeContext);
    }

    let resultData;
    let resultError;

    return this._fetchWithRetry(() => queryFn(payload), retry, retryDelay)
      .then((data) => {
        this.queryCache.set(cacheKey, { data, timestamp: Date.now(), isStale: false });
        resultData = data;
        if (onSuccess) {
          __trace(`query`, `Fetch success: ${queryName}`);
          onSuccess({ ...storeContext, data: resultData });
        }
        return data;
      })
      .catch((error) => {
        resultError = error;
        if (onError) {
          __trace(`query`, `Fetch failed: ${queryName}`);
          onError({ ...storeContext, error });
        }
        throw error;
      })
      .finally(() => {
        if (onSettled) {
          __trace(`query`, `Fetch settled: ${queryName}`);
          onSettled({ ...storeContext, data: resultData || resultError });
        }
      });
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
      throw new Error(`[Cami.js] invalidateQueries expects either a queryKey or a predicate.`);
    }

    const queriesToInvalidate = Array.from(this.queryFunctions.keys()).filter(queryName => {
      if (queryKey) {
        const storedQueryKey = this.queryFunctions.get(queryName).queryKey;

        if (typeof storedQueryKey === 'function') {
          // If storedQueryKey is a function, we need to call it and compare the result
          // Pass an empty object as default argument to prevent destructuring errors
          try {
            const generatedKey = storedQueryKey({});
            return JSON.stringify(generatedKey) === JSON.stringify(queryKey);
          } catch (error) {
            __trace(`invalidateQueries`, `Error generating key for ${queryName}: ${error.message}`);
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
    });

    queriesToInvalidate.forEach(queryName => {
      const query = this.queryFunctions.get(queryName);
      if (!query) return;

      let cacheKey;
      if (typeof query.queryKey === 'function') {
        cacheKey = query.queryKey().join(':');
      } else if (Array.isArray(query.queryKey)) {
        cacheKey = query.queryKey.join(':');
      } else {
        cacheKey = query.queryKey;
      }

      __trace(`invalidateQueries`, `Invalidating query with key: ${queryName}, cacheKey: ${cacheKey}`);

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
        window.removeEventListener('focus', this.focusHandlers.get(queryName));
        this.focusHandlers.delete(queryName);
      }

      if (this.reconnectHandlers.has(queryName)) {
        window.removeEventListener('online', this.reconnectHandlers.get(queryName));
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
          const delay = typeof retryDelay === 'function' ? retryDelay(attempts) : retryDelay;
          return new Promise((resolve) => setTimeout(resolve, delay)).then(executeFetch);
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
    const isDataStale = !cachedData.timestamp || timeSinceLastUpdate > staleTime;
    const isManuallyInvalidated = cachedData.isStale === true;

    __trace(`_isStale`, `
      isDataStale: ${isDataStale}
      isManuallyInvalidated: ${isManuallyInvalidated}
      Current Time: ${currentTime}
      Data Timestamp: ${cachedData.timestamp}
      Time Since Last Update: ${timeSinceLastUpdate}ms
      Stale Time: ${staleTime}ms
    `);

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
      throw new Error(`[Cami.js] Mutation with name ${mutationName} is already registered.`);
    }

    this.mutationFunctions.set(mutationName, config);
    this.mutations[mutationName] = (...args) => this.mutate(mutationName, ...args);
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
      dispatchAsync: this.dispatchAsync.bind(this)
    };

    let optimisticUpdate;
    if (onMutate) {
      optimisticUpdate = onMutate(storeContext);
    }

    let result;
    let error;

    return Promise.resolve(mutationFn(payload))
      .then(data => {
        result = data;
        if (onSuccess) {
          onSuccess({ ...storeContext, data });
        }
        return data;
      })
      .catch(err => {
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
      if (typeof machine !== 'object' || machine === null) {
        throw new Error('Machine definition must be an object');
      }

      Object.entries(machine).forEach(([eventName, event]) => {
        if (typeof event !== 'object' || event === null) {
          throw new Error(`Event '${eventName}' must be an object`);
        }

        if (!event.to || (typeof event.to !== 'function' && typeof event.to !== 'object')) {
          throw new Error(`Event '${eventName}' must have a 'to' property that is an object or a function returning an object`);
        }

        if (event.guard && typeof event.guard !== 'function') {
          throw new Error(`Guard for event '${eventName}' must be a function`);
        }

        if (event.onTransition && typeof event.onTransition !== 'function') {
          throw new Error(`onTransition for event '${eventName}' must be a function`);
        }

        if (event.onEntry && typeof event.onEntry !== 'function') {
          throw new Error(`onEntry for event '${eventName}' must be a function`);
        }

        if (event.onExit && typeof event.onExit !== 'function') {
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
    this.machines[machineName] = { ...this.machines[machineName], ...machineDefinition };

    // Define actions for the new or updated events
    Object.keys(machineDefinition).forEach(eventName => {
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
          dispatchAsync: this.dispatchAsync.bind(this)
        };

        if (this.isValidTransition(event.from, currentState)) {
          const applyTransition = (to) => {
            this.validateToShape(event.from, to);

            // Execute onExit for the current state
            this.executeHandler(event.onExit, { ...storeContext, state: currentState });

            Object.entries(to).forEach(([key, value]) => {
              state[key] = value;
            });

            // Execute onEntry for the new state
            this.executeHandler(event.onEntry, storeContext);
          };

          const newState = typeof event.to === 'function'
            ? event.to({ state: currentState, payload })
            : event.to;

          applyTransition(newState);

          // Execute onTransition
          this.executeHandler(event.onTransition, {
            ...storeContext,
            from: currentState,
            to: newState,
            data: event.data
          });
        } else {
          __trace('cami:state-machine:ignored-transition',
            `Ignored transition '${fullEventName}' event from the current state.\n\n`,
            `Current state:\n\n${JSON.stringify(currentState)}\n\n`,
            `The '${fullEventName}' event expected any of these 'from' states:\n`,
            ...(Array.isArray(event.from)
              ? event.from.map((validState, index) => `  ${index + 1}. ${JSON.stringify(validState)}`)
              : [`  ${JSON.stringify(event.from)}`]
            ),
            "\n\nA key or element of the current state must match one of the 'from' states to trigger the state transition. If you intended to transition, either the 'from' state or current state is incorrect.\n"
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
    const [machineName, eventName] = fullEventName.split(':');
    if (!this.machines[machineName] || !this.machines[machineName][eventName]) {
      throw new Error(`Event '${fullEventName}' not found in any state machine.`);
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
      }
    });

    const storeContext = {
      state: trackingProxy,
      payload,
      dispatch: this.dispatch.bind(this),
      trigger: this.trigger.bind(this),
      memo: this.memo.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      dispatchAsync: this.dispatchAsync.bind(this)
    };

    const result = memoFn(storeContext);
    cache.set(cacheKey, { result, dependencies });

    return result;
  }

  _areDependenciesUnchanged(dependencies) {
    return Array.from(dependencies).every(dep =>
      this._state[dep] === this.previousState[dep]
    );
  }

  // Helper methods for the state machine
  isValidTransition(from, currentState) {
    if (from === undefined) {
      return true;
    }

    const checkState = (fromState, currentStateSlice) => {
      if (typeof fromState !== 'object' || fromState === null) {
        return fromState === currentStateSlice;
      }
      return Object.entries(fromState).every(([key, value]) => {
        if (!(key in currentStateSlice)) {
          return false;
        }
        if (Array.isArray(value)) {
          return value.includes(currentStateSlice[key]);
        }
        if (typeof value === 'object' && value !== null) {
          return checkState(value, currentStateSlice[key]);
        }
        return currentStateSlice[key] === value;
      });
    };

    if (Array.isArray(from)) {
      return from.some(state => checkState(state, currentState));
    }
    return checkState(from, currentState);
  }

  validateToShape(from, to) {
    if (from === undefined) {
      return;
    }

    const getShapeDescription = (obj) => {
      if (typeof obj !== 'object' || obj === null) {
        return typeof obj;
      }

      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (typeof value === 'object' && value !== null) {
          acc[key] = getShapeDescription(value);
        } else if (Array.isArray(value)) {
          acc[key] = `Array<${typeof value[0]}>`;
        } else {
          acc[key] = typeof value;
        }
        return acc;
      }, {});
    };

    const findMismatchedKeys = (expected, actual, prefix = '') => {
      const mismatched = [];
      Object.keys(expected).forEach(key => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (!(key in actual)) {
          mismatched.push(`${fullKey} (missing)`);
        } else if (typeof expected[key] !== typeof actual[key]) {
          mismatched.push(`${fullKey} (expected ${typeof expected[key]}, got ${typeof actual[key]})`);
        } else if (typeof expected[key] === 'object' && expected[key] !== null) {
          mismatched.push(...findMismatchedKeys(expected[key], actual[key], fullKey));
        }
      });
      return mismatched;
    };

    const fromShape = Array.isArray(from) ? from[0] : from;
    if (typeof to !== 'object' || to === null) {
      const expectedShape = getShapeDescription(fromShape);
      throw new Error(`Invalid 'to' state: must be an object.\n\nExpected key-value pairs:\n${JSON.stringify(expectedShape, null, 2)}`);
    }
    const mismatchedKeys = findMismatchedKeys(fromShape, to);
    if (mismatchedKeys.length > 0) {
      const expectedShape = getShapeDescription(fromShape);
      throw new Error(`Invalid 'to' state shape.\n\nExpected key-value pairs:\n${JSON.stringify(expectedShape, null, 2)}\n\nMismatched keys: ${mismatchedKeys.join(', ')}`);
    }
  }

  executeHandler(handler, context) {
    if (typeof handler === 'function') {
      handler(context);
    }
  }
}

const deepFreeze = (value, deep = true) => {
  if (typeof value !== 'object' || value === null) {
    return value; // Return primitives as-is
  }
  return new Proxy(freeze(value, true), {
    set(target, prop, val) {
      throw new Error(`Attempted to modify frozen state. Cannot set property '${prop}' on immutable object.`);
    },
    deleteProperty(target, prop) {
      throw new Error(`Attempted to modify frozen state. Cannot delete property '${prop}' from immutable object.`);
    }
  });
}

/**
 * @interface StorageInterface
 * @description Defines the required methods for a storage adapter.
 */
const StorageInterface = {
  getItem: (key) => {},
  setItem: (key, value) => {},
  removeItem: (key) => {},
  clear: () => {},
};

/**
 * @class StorageValidator
 * @description Validates that a storage adapter implements the required methods.
 */
class StorageValidator {
  /**
   * @method validateAdapter
   * @memberof StorageValidator
   * @param {Object} adapter - The storage adapter to validate.
   * @throws {Error} If the adapter is missing required methods or has invalid method signatures.
   */
  static validateAdapter(adapter) {
    const requiredMethods = Object.keys(StorageInterface);
    const missingMethods = requiredMethods.filter(method => {
      return !(method in adapter) ||
             typeof adapter[method] !== 'function' ||
             adapter[method].length !== StorageInterface[method].length;
    });

    if (missingMethods.length > 0) {
      throw new Error(`Invalid storage adapter: missing or invalid methods: ${missingMethods.join(', ')}`);
    }
  }
}

/**
 * @class MemoryStorage
 * @description An in-memory storage adapter implementing the StorageInterface.
 */
class MemoryStorage {
  constructor() {
    this.storage = new Map();
    StorageValidator.validateAdapter(this);
  }

  /**
   * @method getItem
   * @memberof MemoryStorage
   * @param {string} key - The key of the item to retrieve.
   * @returns {string|null} The value associated with the key, or null if the key does not exist.
   */
  getItem(key) {
    return this.storage.get(key) || null;
  }

  /**
   * @method setItem
   * @memberof MemoryStorage
   * @param {string} key - The key of the item to set.
   * @param {string} value - The value to set.
   */
  setItem(key, value) {
    this.storage.set(key, value);
  }

  /**
   * @method removeItem
   * @memberof MemoryStorage
   * @param {string} key - The key of the item to remove.
   */
  removeItem(key) {
    this.storage.delete(key);
  }

  /**
   * @method clear
   * @memberof MemoryStorage
   * @description Clears all items from the storage.
   */
  clear() {
    this.storage.clear();
  }
}

/**
 * @class LocalStorageAdapter
 * @description A localStorage adapter implementing the StorageInterface.
 */
class LocalStorageAdapter {
  constructor() {
    StorageValidator.validateAdapter(this);
  }

  /**
   * @method getItem
   * @memberof LocalStorageAdapter
   * @param {string} key - The key of the item to retrieve.
   * @returns {string|null} The value associated with the key, or null if the key does not exist.
   */
  getItem(key) {
    return localStorage.getItem(key);
  }

  /**
   * @method setItem
   * @memberof LocalStorageAdapter
   * @param {string} key - The key of the item to set.
   * @param {string} value - The value to set.
   */
  setItem(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * @method removeItem
   * @memberof LocalStorageAdapter
   * @param {string} key - The key of the item to remove.
   */
  removeItem(key) {
    localStorage.removeItem(key);
  }

  /**
   * @method clear
   * @memberof LocalStorageAdapter
   * @description Clears all items from the storage.
   */
  clear() {
    localStorage.clear();
  }
}

const isValidValidationRules = (rules) => {
  if (!rules || typeof rules !== 'object') return false;

  const hasPresence = 'presence' in rules;
  const hasServer = 'server' in rules;

  if (!hasPresence && !hasServer) return false;

  if (hasPresence) {
    if (typeof rules.presence !== 'object') return false;
    if ('keys' in rules.presence && !Array.isArray(rules.presence.keys)) return false;
    if ('values' in rules.presence) {
      if (!Array.isArray(rules.presence.values)) return false;
      if (!rules.presence.values.every(v => typeof v === 'object')) return false;
    }
  }

  if (hasServer) {
    if (typeof rules.server !== 'object') return false;
    if (typeof rules.server.fetchFn !== 'function') return false;
  }

  return true;
};

const validateState = (storedState, validationRules, context) => {
  const { type, name } = context;

  if (!validationRules || !validationRules.presence) {
    __trace(`cami:${type}`, `No validation rules specified for ${type} ${name}. Using initial state.`);
    return false; // Invalidate by default if no rules are defined
  }

  const { keys, values } = validationRules.presence;

  if (keys) {
    for (const key of keys) {
      if (!(key in storedState)) {
        __trace(`cami:${type}`, `${type.charAt(0).toUpperCase() + type.slice(1)} Invalidated: Key '${key}' is missing in stored state for ${type} ${name}.`);
        return false;
      }
    }
  }

  if (values) {
    for (const valueObj of values) {
      for (const [key, value] of Object.entries(valueObj)) {
        if (storedState[key] !== value) {
          __trace(`cami:${type}`, `${type.charAt(0).toUpperCase() + type.slice(1)} Invalidated: Value mismatch for key '${key}' in ${type} ${name}. Expected ${value}, got ${storedState[key]}.`);
          return false;
        }
      }
    }
  }

  __trace(`cami:${type}`, `No validation rules violated for ${type} ${name}.`);
  return true;
};

/**
 * @private
 * @function _localStorageEnhancer
 * @param {Function} StoreClass - The class of the store to enhance.
 * @param {Object} initialState - The initial state for the new store instance.
 * @param {Object} options - Configuration options for the store.
 * @param {string} [options.name='default-store'] - The name of the store to use as the key in localStorage.
 * @param {number} [options.expiry=86400000] - The time in milliseconds until the stored state expires (default is 24 hours).
 * @returns {Function} A function that takes initialState and options, and returns an enhanced store instance with localStorage support.
 * @description This enhancer adds the ability to persist the store's state in localStorage. It returns a function that, when called with initialState and options, creates a new store instance with localStorage support. The state of the store is automatically saved to localStorage whenever it changes, and it is rehydrated from localStorage when the store is created. The enhanced store also includes a `reset()` method for resetting the store's state.
 * @example
 * ```javascript
 * // Enhance the ObservableStore with localStorage capabilities
 * const enhancedCreateStore = _localStorageEnhancer(ObservableStore);
 * // Create a store instance with initialState and provide a name to be used as the localStorage key
 * const storeWithLocalStorage = enhancedCreateStore({ items: [] }, { name: 'my-store', expiry: 1000 * 60 * 60 * 24 });
 * // Initialize or reset the store's state as needed
 * storeWithLocalStorage.reset();
 * ```
 */
  const _storageEnhancer = (StoreClass) => {
    return (initialState, options) => {
      const storeName = options?.name || 'default-store';
      const shouldLoad = options?.load !== false;
      const defaultExpiry = 24 * 60 * 60 * 1000;
      const expiry = options?.expiry !== undefined ? options.expiry : defaultExpiry;
      const storage = options.storageAdapter;
      const adapterType = options.adapterType;

      const compareObjects = (obj1, obj2) => {
        console.assert(obj1 !== null && obj2 !== null, 'Both objects must be non-null');
        console.assert(typeof obj1 === 'object' && typeof obj2 === 'object', 'Both arguments must be objects');

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        console.assert(Array.isArray(keys1) && Array.isArray(keys2), 'Object.keys should always return arrays');

        if (keys1.length !== keys2.length) {
          return false;
        }

        for (let key of keys1) {
          console.assert(typeof key === 'string', 'Object keys should always be strings');

          if (!(key in obj2)) {
            return false;
          }

          if (typeof obj1[key] === 'object' && obj1[key] !== null) {
            if (typeof obj2[key] !== 'object' || obj2[key] === null) {
              return false;
            }

            if (!compareObjects(obj1[key], obj2[key])) {
              return false;
            }
          }
        }

        return true;
      };

      const loadState = () => {
        if (shouldLoad) {
          const storedState = storage.getItem(storeName);
          const storedExpiry = storage.getItem(`${storeName}-expiry`);
          const currentTime = new Date();

          __trace('cami:storage', `Identified ${adapterType} storage: ${storeName}.`);

          if (storedState && storedExpiry) {
            const isExpired = currentTime.getTime() >= parseInt(storedExpiry, 10);
            __trace('cami:storage', `Checked expiry status for ${adapterType} storage: ${isExpired ? 'Has Expired' : 'Still Valid'}`);

            if (!isExpired) {
              const loadedState = JSON.parse(storedState);

              if (!compareObjects(initialState, loadedState)) {
                __trace('cami:storage', `Stored state structure doesn't match initial state for ${storeName}. Resetting to initial state.`);
                storage.setItem(storeName, JSON.stringify(initialState));
                storage.setItem(`${storeName}-expiry`, (currentTime.getTime() + expiry).toString());
                return initialState;
              }

              if (options.validationRules) {
                if (!isValidValidationRules(options.validationRules)) {
                  throw new Error(`Invalid validation rules structure for store ${storeName}.`);
                }

                if (!validateState(loadedState, options.validationRules, { type: 'store', name: storeName })) {
                  __trace('cami:storage', `Stored state failed validation for ${storeName}. Using initial state.`);
                  return initialState;
                }

                if (options.validationRules && options.validationRules.server) {
                  const { fetchFn, onFetch, onSuccess, onError, onSettled } = options.validationRules.server;

                  if (onFetch) onFetch();
                  __trace('cami:store', `Performing server-side validation for store ${storeName}.`);
                  fetchFn().then(data => {
                    if (onSuccess) onSuccess(data);

                    let shouldInvalidate = false;
                    if (onSettled) {
                      onSettled({
                        data, // Changed from 'response' to 'data'
                        state: loadedState,
                        invalidate: () => { shouldInvalidate = true; }
                      });
                    }

                    if (shouldInvalidate) {
                      __trace('cami:store', `Server-side validation invalidated stored state for store ${storeName}. Using initial state.`);
                      return initialState;
                    }
                  }).catch(error => {
                    if (onError) onError(error);
                    __trace('cami:store', `Server-side validation failed for store ${storeName}. Using initial state.`, error);
                    return initialState;
                  });
                }

            } else {
              __trace('cami:storage', `No validation rules defined for ${storeName}. Using stored state.`);
            }

            __trace('cami:storage', `Loaded state from ${adapterType} storage`);
            return loadedState;
          }
        }
      }

      __trace('cami:storage', `Using initial state for ${adapterType} storage:`, initialState);
      return initialState;
    };

    const initialLoadedState = loadState();
    const store = new StoreClass(initialLoadedState);
    store.name = storeName;
    store.storage = storage;
    store.expiry = expiry;

    store._persistState = () => {
      const currentTime = new Date();
      const expiryTime = new Date(currentTime.getTime() + expiry);

      storage.setItem(storeName, JSON.stringify(store.state));
      storage.setItem(`${storeName}-expiry`, expiryTime.getTime().toString());
    };

    store.reset = () => {
      storage.removeItem(storeName);
      storage.removeItem(`${storeName}-expiry`);

      store.state = store._createProxy(createDraft(initialState));
      __trace('cami:storage', `Reset store state of ${storeName} in ${adapterType} storage to:`, store.state);

      store.__observers.forEach(observer => observer.next(store.state));
      store._persistState();
    };

    store.subscribe((state) => {
      store._persistState();
    });

    return store;
  };
};

const storeInstances = new Map();

const ADAPTERS = {
  memory: MemoryStorage,
  localStorage: LocalStorageAdapter
};

/**
 * @function store
 * @param {Object} config - Configuration object for the store.
 * @param {Object} config.state - The initial state of the store.
 * @param {boolean} [config.localStorage=true] - Whether to use localStorage for state persistence.
 * @param {string} [config.name='cami-store'] - The name of the store to use as the key in storage.
 * @param {number} [config.expiry=86400000] - The time in milliseconds until the stored state expires (default is 24 hours).
 * @returns {ObservableStore} A new instance of ObservableStore with the provided initial state, enhanced with storage if enabled.
 * @description This function creates a new instance of ObservableStore with the provided initial state and enhances it with storage support. The store's state will be automatically persisted to and loaded from the chosen storage, using the provided name as the key. The `localStorage` option determines whether to use localStorage or in-memory storage.
 * @example
 * ```javascript
 * // Create a store with localStorage support
 * const CartStore = store({
 *   state: { cartItems: [] },
 *   name: 'cart-store'
 * });
 *
 * // Create a store with in-memory storage
 * const NonPersistentStore = store({
 *   state: { items: [] },
 *   localStorage: false,
 *   name: 'non-persistent-store'
 * });
 * ```
 */
const store = (config = {}) => {
  const defaultConfig = {
    state: {},
    adapter: 'localStorage',
    name: 'cami-store',
    expiry: 86400000, // 24 hours
    validationRules: null
  };

  const finalConfig = { ...defaultConfig, ...config };

  if (storeInstances.has(finalConfig.name)) {
    return storeInstances.get(finalConfig.name);
  }

  const AdapterClass = ADAPTERS[finalConfig.adapter];
  if (!AdapterClass) {
    throw new Error(`Invalid adapter: ${finalConfig.adapter}. Available adapters are: ${Object.keys(ADAPTERS).join(', ')}`);
  }

  if (finalConfig.validationRules && !isValidValidationRules(finalConfig.validationRules)) {
    throw new Error(`Invalid validation rules structure for store ${finalConfig.name}.`);
  }

  const storageAdapter = new AdapterClass();
  const storeInstance = _storageEnhancer(ObservableStore)(finalConfig.state, {
    ...finalConfig,
    storageAdapter,
    adapterType: finalConfig.adapter,
  });

  // Ensure all necessary methods are available on the store instance
  const methods = ['memo', 'query', 'trigger', 'dispatch', 'mutate'];
  methods.forEach(method => {
    if (typeof storeInstance[method] !== 'function') {
      console.warn(`Method ${method} is not available on the store instance.`);
    }
  });

  storeInstances.set(finalConfig.name, storeInstance);

  return storeInstance;
};

export { ObservableStore, store };
