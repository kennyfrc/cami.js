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

    this.state = this._createProxy(createDraft(initialState));
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

    this._persistState = () => {
      if (this.storage) {
        const currentTime = new Date();
        const expiryTime = new Date(currentTime.getTime() + this.expiry);

        this.storage.setItem(this.name, JSON.stringify(this.state));
        this.storage.setItem(`${this.name}-expiry`, expiryTime.getTime().toString());
      }
    };

    Object.keys(initialState).forEach(key => {
      if (typeof initialState[key] === 'function') {
        this.defineAction(key, initialState[key]);
      } else {
        this.state[key] = initialState[key];
      }
    });
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
    Object.keys(this.state).forEach(key => {
      if (!(key in this)) {
        Object.defineProperty(this, key, {
          get: () => this.state[key],
          set: (value) => {
            this.state[key] = value;
            this._notifyObservers();
          },
          enumerable: true,
          configurable: true
        });
      }
    });
  }

  _notifyObservers() {
    if (!_deepEqual(this.state, this.previousState)) {
      this.__observers.forEach(observer => observer.next(this.state));
      if (this.__subscriber && typeof this.__subscriber.next === 'function') {
        this.__subscriber.next(this.state);
      }
      this.previousState = _deepClone(this.state);
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
        debugger;
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

    while (this.dispatchQueue.length > 0) {
      const { action, payload } = this.dispatchQueue.shift();
      this._dispatch(action, payload);
    }

    this.isDispatching = false;
  }

  _dispatch(action, payload) {
    if (typeof action === 'function') {
      return defineAction(this._dispatch.bind(this), () => this.state);
    }

    if (typeof action !== 'string') {
      throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof action}`);
    }

    const [modelName, actionName] = action.split('/');
    let reducer;

    if (actionName) {
      // Model-level action
      reducer = this.reducers[modelName] && this.reducers[modelName][actionName];
    } else {
      // Store-level action
      reducer = this.reducers[action];
    }

    if (!reducer) {
      console.warn(`No reducer found for action ${action}`);
      return;
    }

    this.__applyMiddleware(action, payload);

    const oldValue = this.state;
    const [nextState, patches, inversePatches] = produceWithPatches(this.state, draft => {
        reducer({
          state: draft,
          payload: payload
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
        this.state[key] = nextState[key];
      });

      this._notifyPatchListeners(patches);
      if (this.devTools) {
        this.devTools.send(action, this.state);
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
      state: deepFreeze(this.state),
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
      devTools.init(this.state);
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
    const [modelName, actionName] = action.split('/');

    if (actionName) {
      // This is a model-level action
      if (!this.reducers[modelName]) {
        this.reducers[modelName] = {};
      }
      this.reducers[modelName][actionName] = (context) => {
        return reducer(context);
      };
    } else {
      // This is a store-level action
      this.reducers[action] = (context) => {
        return reducer(context);
      };
    }

    this.actions[action] = (...args) => {
      return this.dispatch(action, ...args);
    };
  }

  dispatch(action, payload) {
    this.dispatchQueue.push({ action, payload });
    if (!this.isDispatching) {
      this._processDispatchQueue();
    }
    return this.currentDispatchPromise;
  }

  _modelDispatch(action, payload) {
    const [modelName, actionName] = action.split('/');
    return this.dispatch(`${modelName}/${actionName}`, payload);
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
    this.state = applyPatches(this.state, patches);
    this.__observers.forEach(observer => observer.next(this.state));
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
    if (this.queryFunctions[queryName]) {
      throw new Error(`[Cami.js] Query with name ${queryName} has already been defined.`);
    }

    const {
      queryKey,
      queryFn,
      staleTime = 0,
      refetchOnWindowFocus = false,
      refetchInterval = null,
      refetchOnReconnect = true,
      gcTime = 1000 * 60 * 5,
      retry = 1,
      retryDelay = (attempt) => Math.pow(2, attempt) * 1000,
      onFetch,
      onSuccess,
      onError,
      actions = this.actions,
      mutations = this.mutationFunctions,
      onSettled
    } = config;

    this.queryFunctions[queryName] = {
      queryKey,
      queryFn,
      staleTime,
      refetchOnWindowFocus,
      refetchInterval,
      refetchOnReconnect,
      gcTime,
      retry,
      retryDelay,
      onFetch,
      onSuccess,
      onError,
      actions,
      onSettled
    };

    this.queries[queryName] = (...args) => {
      return this.query(queryName, ...args);
    }
  }

  query(queryName, payload) {
    if (typeof queryName !== 'string') {
      throw new TypeError(`[Cami.js] queryName must be a string. Received: ${typeof queryName}`);
    }

    if (queryName.includes('/')) {
      return this._modelQuery(queryName, payload);
    } else {
      return this._storeQuery(queryName, payload);
    }
  }

  _storeQuery(queryName, payload) {
    const query = this.queryFunctions[queryName];
    if (!query) {
      throw new Error(`[Cami.js] No query found for name: ${queryName}`);
    }

    const { queryFn, queryKey, staleTime, retry, retryDelay, onFetch, onSuccess, onError, onSettled } = query;

    const storeContext = {
      state: deepFreeze(this.state),
      dispatch: this.dispatch.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      invalidateQueries: this.invalidateQueries.bind(this),
    };

    const context = query.createContext ? query.createContext(storeContext, payload) : storeContext;

    return this._executeQuery(queryName, payload, query, context);
  }

  _modelQuery(queryName, payload) {
    const [modelName, modelQueryName] = queryName.split('/');
    const query = this.queryFunctions[queryName];
    if (!query) {
      throw new Error(`[Cami.js] No query found for name: ${queryName}`);
    }

    const { queryFn, queryKey, staleTime, retry, retryDelay, onFetch, onSuccess, onError, onSettled } = query;

    const storeContext = {
      state: deepFreeze(this.state[modelName]),
      dispatch: (action, actionPayload) => this._modelDispatch(`${modelName}/${action}`, actionPayload),
      query: (query, queryArgs) => this._modelQuery(`${modelName}/${query}`, queryArgs),
      mutate: (mutation, mutationArgs) => this._modelMutate(`${modelName}/${mutation}`, mutationArgs),
      invalidateQueries: this.invalidateQueries.bind(this),
    };

    const context = query.createContext ? query.createContext(storeContext, payload) : storeContext;

    return this._executeQuery(queryName, payload, query, context);
  }

  _executeQuery(queryName, payload, query, context) {
    const { queryFn, queryKey, staleTime, retry, retryDelay, onFetch, onSuccess, onError, onSettled } = query;

    const cacheKey = typeof queryKey === 'function' ? queryKey(payload).join(':') : Array.isArray(queryKey) ? queryKey.join(':') : queryKey;

    const cachedData = this.queryCache.get(cacheKey);

    if (cachedData && !cachedData.isStale && !this._isStale(cachedData, staleTime)) {
      __trace(`query`, `Returning cached data for: ${queryName} with cacheKey: ${cacheKey}`);
      return Promise.resolve(cachedData.data);
    }

    __trace(`query`, `Data is stale or not cached, fetching new data for: ${queryName}`);

    if (onFetch) {
      __trace(`query`, `onFetch callback invoked for: ${queryName}`);
      onFetch(context);
    }

    let resultData;
    let resultError;

    return this._fetchWithRetry(() => queryFn(payload), retry, retryDelay)
      .then((data) => {
        this.queryCache.set(cacheKey, { data, timestamp: Date.now(), isStale: false });
        resultData = data;
        if (onSuccess) {
          __trace(`query`, `Fetch success: ${queryName}`);
          onSuccess({ ...context, data: resultData });
        }
        return data;
      })
      .catch((error) => {
        resultError = error;
        if (onError) {
          __trace(`query`, `Fetch failed: ${queryName}`);
          onError({ ...context, data: error });
        }
        throw error;
      })
      .finally(() => {
        if (onSettled) {
          __trace(`query`, `Fetch settled: ${queryName}`);
          onSettled({ ...context, data: resultData || resultError });
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

    const queriesToInvalidate = Object.keys(this.queryFunctions).filter(queryName => {
      if (queryKey) {
        const storedQueryKey = this.queryFunctions[queryName].queryKey;
        if (Array.isArray(storedQueryKey)) {
          return JSON.stringify(storedQueryKey) === JSON.stringify(queryKey);
        } else {
          return storedQueryKey === queryKey[0];
        }
      }

      if (predicate) {
        return predicate(this.queryFunctions[queryName]);
      }

      return false;
    });

    queriesToInvalidate.forEach(queryName => {
      const query = this.queryFunctions[queryName];
      if (!query) return;

      let cacheKey;
      if (typeof query.queryKey === 'function') {
        cacheKey = query.queryKey().join(':');
      } else if (Array.isArray(query.queryKey)) {
        cacheKey = query.queryKey.join(':');
      } else {
        cacheKey = query.queryKey;
      }

      __trace(`invalidateQueries`, `Invalidating query with key: ${queryName}`);

      if (this.intervals[queryName]) {
        clearInterval(this.intervals[queryName]);
        delete this.intervals[queryName];
      }

      if (this.focusHandlers[queryName]) {
        window.removeEventListener('focus', this.focusHandlers[queryName]);
        delete this.focusHandlers[queryName];
      }

      if (this.reconnectHandlers[queryName]) {
        window.removeEventListener('online', this.reconnectHandlers[queryName]);
        delete this.reconnectHandlers[queryName];
      }

      if (this.gcTimeouts[queryName]) {
        clearTimeout(this.gcTimeouts[queryName]);
        delete this.gcTimeouts[queryName];
      }

      // If the query hasn't been executed yet, we create a placeholder in the cache
      if (!this.queryCache.has(cacheKey)) {
        this.queryCache.set(cacheKey, { isStale: true, data: undefined });
      } else {
        const cachedData = this.queryCache.get(cacheKey);
        cachedData.isStale = true;
      }

      const cachedData = this.queryCache.get(cacheKey);
      invariant("Cached data should always exist if there's a query with that key", () => cachedData !== undefined);
      invariant("isStale is always true if there's a cached data", () => cachedData.isStale === true);
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
    const isDataStale = Date.now() - cachedData.timestamp > staleTime;
    __trace(`isStale`, `isDataStale: ${isDataStale} (Current Time: ${Date.now()}, Data Timestamp: ${cachedData.timestamp}, Stale Time: ${staleTime})`);
    return isDataStale;
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
    if (this.mutationFunctions[mutationName]) {
      throw new Error(`[Cami.js] Mutation with name ${mutationName} is already registered.`);
    }

    const {
      mutationFn,
      onMutate,
      onError,
      onSuccess,
      onSettled,
      actions = this.actions,
      queries = this.queryFunctions
    } = config;

    this.mutationFunctions[mutationName] = {
      mutationFn,
      onMutate,
      onError,
      onSuccess,
      onSettled,
      actions,
      queries
    };

    this.mutations[mutationName] = (...args) => {
      return this.mutate(mutationName, ...args);
    };
  }

  mutate(mutationName, payload) {
    if (mutationName.includes('/')) {
      return this._modelMutate(mutationName, payload);
    } else {
      return this._storeMutate(mutationName, payload);
    }
  }

  _storeMutate(mutationName, payload) {
    const mutation = this.mutationFunctions[mutationName];
    if (!mutation) {
      throw new Error(`[Cami.js] No mutation found for name: ${mutationName}`);
    }

    const { mutationFn, onMutate, onError, onSuccess, onSettled } = mutation;

    const context = {
      state: deepFreeze(this.state),
      previousState: deepFreeze(this.state),
      dispatch: this.dispatch.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      invalidateQueries: this.invalidateQueries.bind(this),
      payload
    };

    return this._executeMutation(mutationName, payload, mutation, context);
  }

  _modelMutate(mutationName, payload) {
    const [modelName, actualMutationName] = mutationName.split('/');
    const mutation = this.mutationFunctions[mutationName];
    if (!mutation) {
      throw new Error(`[Cami.js] No mutation found for name: ${mutationName}`);
    }

    const { mutationFn, onMutate, onError, onSuccess, onSettled } = mutation;

    const context = {
      state: deepFreeze(this.state[modelName]),
      previousState: deepFreeze(this.state[modelName]),
      dispatch: (action, actionPayload) => this._modelDispatch(`${modelName}/${action}`, actionPayload),
      query: (query, queryArgs) => this._modelQuery(`${modelName}/${query}`, queryArgs),
      mutate: (mutation, mutationArgs) => this._modelMutate(`${modelName}/${mutation}`, mutationArgs),
      invalidateQueries: this.invalidateQueries.bind(this),
      payload
    };

    return this._executeMutation(mutationName, payload, mutation, context);
  }

  _executeMutation(mutationName, payload, mutation, context) {
    const { mutationFn, onMutate, onError, onSuccess, onSettled } = mutation;

    let optimisticUpdate;
    if (onMutate) {
      optimisticUpdate = onMutate(context);
    }

    return Promise.resolve(mutationFn(payload))
      .then(data => {
        if (onSuccess) {
          onSuccess({ ...context, data });
        }
        return data;
      })
      .catch(error => {
        if (onError) {
          onError({ ...context, error });
        }
        throw error;
      })
      .finally(() => {
        if (onSettled) {
          onSettled(context);
        }
      });
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
 * Creates a model of the store with its own state and actions, namespaced to avoid conflicts.
 *
 * @function model
 * @param {string} modelName - The name of the model.
 * @param {Object} options - The options for creating the model.
 * @param {string} [options.store='cami-store'] - The name of the store to use or create.
 * @param {Object} options.state - The initial state of the model.
 * @param {Object} options.actions - The actions for the model.
 * @param {Object} [options.queries] - The queries for the model.
 * @param {Object} [options.mutations] - The mutations for the model.
 * @returns {Object} - An object containing the action methods for the model, including getState, actions, queries, mutations, and subscribe methods.
 *
 * @example
 * const navigationModel = model("Navigation", {
 *   store: "cami-store",
 *   state: {
 *     status: 'menu',
 *     count: 0
 *   },
 *   actions: {
 *     toggle: ({ state }) => {
 *       const transitions = {
 *         'menu': 'settings',
 *         'settings': 'profile',
 *         'profile': 'menu'
 *       };
 *       state.status = transitions[state.status];
 *       state.count += 1;
 *     },
 *     invalidAction: ({ state }) => {
 *       state.status = 123;
 *     }
 *   }
 * });
 *
 * // Accessing the model's state
 * navigationModel.getState();
 *
 * // Dispatching actions
 * navigationModel.toggle();
 *
 * // Subscribing to state changes
 * const unsubscribe = navigationModel.subscribe(state => {
 *   console.log('Navigation model state changed:', state);
 * });
 *
 * // Unsubscribe when no longer needed
 * unsubscribe();
 */
const model = (modelName, { store: storeName = 'cami-store', state, actions = {}, queries = {}, mutations = {}, computed = {}, machine, validationRules }) => {
  let storeInstance = store({
    state: { [modelName]: state },
    name: storeName
  });

  if (storeInstance.models && storeInstance.models[modelName]) {
    throw new Error(`[Cami.js] Model name ${modelName} is already in use in store ${storeName}.`);
  }

  if (!storeInstance.models) {
    storeInstance.models = {};
  }

  storeInstance.models[modelName] = true;

  const validateState = (storedState) => {
    if (!validationRules || !validationRules.presence) {
      __trace('cami:model', `No validation rules specified for model ${modelName}. Using state in model definition.`);
      return false;
    }

    const { keys, values } = validationRules.presence;

    if (keys) {
      for (const key of keys) {
        if (!(key in storedState)) {
          __trace('cami:model', `Store Invalidated: Key '${key}' is missing in stored state for model ${modelName}.`);
          return false;
        }
      }
    }

    if (values) {
      for (const valueObj of values) {
        for (const [key, value] of Object.entries(valueObj)) {
          if (storedState[key] !== value) {
            __trace('cami:model', `Store Invalidated: Value mismatch for key '${key}' in model ${modelName}. Expected ${value}, got ${storedState[key]}.`);
            return false;
          }
        }
      }
    }

    __trace('cami:model', `No validation rules violated for model ${modelName}.`);
    return true;
  };

  const isValidValidationRules = (rules) => {
    if (!rules) return true; // Allow undefined or null validation rules

    if (typeof rules !== 'object') return false;

    const hasPresence = 'presence' in rules;
    const hasServer = 'server' in rules;

    if (!hasPresence && !hasServer) return true; // Allow empty validation rules object

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

  const loadState = async () => {
    const storedState = storeInstance.storage.getItem(storeName);
    if (!storedState) {
      __trace('cami:model', `No stored state found for model ${modelName}. Using state in model definition.`);
      return state;
    }

    const parsedState = JSON.parse(storedState);
    const modelState = parsedState[modelName];

    if (!isValidValidationRules(validationRules)) {
      throw new Error(`Invalid validation rules structure for model ${modelName}.`);
    }

    if (!validateState(modelState, validationRules, { type: 'model', name: modelName })) {
      return state;
    }

    if (validationRules && validationRules.server) {
      const { fetchFn, onFetch, onSuccess, onError, onSettled } = validationRules.server;

      try {
        if (onFetch) onFetch();
        __trace('cami:model', `Performing server-side validation for model ${modelName}.`);
        const data = await fetchFn(); // Changed from 'response' to 'data'
        if (onSuccess) onSuccess(data);

        let shouldInvalidate = false;
        if (onSettled) {
          onSettled({
            data, // Changed from 'response' to 'data'
            state: modelState,
            invalidate: () => { shouldInvalidate = true; }
          });
        }

        if (shouldInvalidate) {
          __trace('cami:model', `Server-side validation invalidated stored state for model ${modelName}. Using state in model definition.`);
          return state;
        }
      } catch (error) {
        if (onError) onError(error);
        __trace('cami:model', `Server-side validation failed for model ${modelName}. Using state in model definition.`, error);
        return state;
      }
    }

    return modelState;
  };

  loadState().then(loadedState => {
    storeInstance.state[modelName] = loadedState;
    storeInstance._persistState();
  });

  const modelObject = {
    subscribe: (callback) => {
      return storeInstance.subscribe(state => callback(state[modelName]));
    },
    dispatch: (actionName, payload) => {
      const action = modelObject.actions[actionName];
      if (!action) throw new Error(`[Cami.js] Action '${actionName}' not found in model '${modelName}'.`);
      return storeInstance.dispatch(`${modelName}/${actionName}`, payload);
    },
    query: (queryName, ...args) => storeInstance._modelQuery(`${modelName}/${queryName}`, ...args),
    mutate: (mutationName, payload) => {
      const mutation = modelObject.mutations[mutationName];
      if (!mutation) throw new Error(`[Cami.js] Mutation '${mutationName}' not found in model '${modelName}'.`);
      return storeInstance.mutate(`${modelName}/${mutationName}`, payload);
    },
    trigger: (eventName, payload) => {
      if (!modelObject.machine || !modelObject.machine[eventName]) {
        throw new Error(`[Cami.js] Event '${eventName}' not found in model '${modelName}' state machine.`);
      }
      return storeInstance.dispatch(`${modelName}/${eventName}`, payload);
    },
    compute: (computedName, payload) => {
      const computedFn = modelObject.computed[computedName];
      if (!computedFn) throw new Error(`[Cami.js] Computed property '${computedName}' not found in model '${modelName}'.`);
      return computedFn({ state: storeInstance.state[modelName], payload });
    },
    actions: {},
    queries: {},
    mutations: {},
    computed: {},
    machine: null
  };

  Object.keys(state).forEach(key => {
    Object.defineProperty(modelObject, key, {
      get: () => {
        return storeInstance.state[modelName][key]
      },
      enumerable: true,
      configurable: false
    });
  });

  const registerComponents = ({ actions = {}, queries = {}, mutations = {}, computed = {}, machine }) => {
    // Register actions
    Object.keys(actions).forEach(actionKey => {
      const namespacedAction = `${modelName}/${actionKey}`;
      storeInstance.defineAction(namespacedAction, (context) => {
        const wrappedContext = {
          ...context,
          state: context.state[modelName],
          dispatch: (action, payload) => storeInstance._modelDispatch(`${modelName}/${action}`, payload),
          query: (query, args) => storeInstance._modelQuery(`${modelName}/${query}`, args),
          mutate: (mutation, args) => storeInstance._modelMutate(`${modelName}/${mutation}`, args),
          trigger: modelObject.trigger,
          compute: modelObject.compute
        };
        return actions[actionKey](wrappedContext);
      });
      modelObject.actions[actionKey] = (...args) => storeInstance.dispatch(namespacedAction, ...args);
    });

    // Register queries
    Object.keys(queries).forEach(queryKey => {
      const namespacedQuery = `${modelName}/${queryKey}`;
      const queryConfig = {
        ...queries[queryKey],
        queryFn: (payload) => {
          return queries[queryKey].queryFn(payload);
        },
        onSuccess: (context) => {
          const wrappedContext = {
            ...context,
            state: storeInstance.state[modelName],
            dispatch: (action, actionPayload) => storeInstance._modelDispatch(`${modelName}/${action}`, actionPayload),
            query: (query, queryArgs) => storeInstance._modelQuery(`${modelName}/${query}`, queryArgs),
            mutate: (mutation, mutationArgs) => storeInstance._modelMutate(`${modelName}/${mutation}`, mutationArgs),
            trigger: modelObject.trigger,
            compute: modelObject.compute,
            data: context.data
          };
          return queries[queryKey].onSuccess(wrappedContext);
        },
      };
      storeInstance.defineQuery(namespacedQuery, queryConfig);
      modelObject.queries[queryKey] = (payload) => storeInstance.query(namespacedQuery, payload);
    });

    // Register mutations
    Object.keys(mutations).forEach(mutationKey => {
      const namespacedMutation = `${modelName}/${mutationKey}`;
      const mutationConfig = {
        ...mutations[mutationKey],
        mutationFn: (payload) => {
          return mutations[mutationKey].mutationFn(payload);
        },
        onMutate: (context) => {
          const wrappedContext = {
            ...context,
            state: storeInstance.state[modelName],
            dispatch: (action, payload) => storeInstance._modelDispatch(`${modelName}/${action}`, payload),
            query: (query, args) => storeInstance._modelQuery(`${modelName}/${query}`, args),
            mutate: (mutation, args) => storeInstance._modelMutate(`${modelName}/${mutation}`, args),
            trigger: modelObject.trigger,
            compute: modelObject.compute
          };
          return mutations[mutationKey].onMutate(wrappedContext);
        },
        onSuccess: (context) => {
          const wrappedContext = {
            ...context,
            state: storeInstance.state[modelName],
            dispatch: (action, payload) => storeInstance._modelDispatch(`${modelName}/${action}`, payload),
            query: (query, args) => storeInstance._modelQuery(`${modelName}/${query}`, args),
            mutate: (mutation, args) => storeInstance._modelMutate(`${modelName}/${mutation}`, args),
            trigger: modelObject.trigger,
            compute: modelObject.compute,
            data: context.data
          };
          const result = mutations[mutationKey].onSuccess(wrappedContext);
          // Ensure the store's state is updated
          storeInstance.state[modelName] = { ...storeInstance.state[modelName], ...wrappedContext.state };
          return result;
        },
      };
      storeInstance.defineMutation(namespacedMutation, mutationConfig);
      modelObject.mutations[mutationKey] = (payload) => storeInstance.mutate(namespacedMutation, payload);
    });

    // Register computed properties
    Object.keys(computed).forEach(computedKey => {
      modelObject.computed[computedKey] = computed[computedKey];
    });

     // Register machine
    if (machine) {
      const validateMachine = (machineDefinition) => {
        if (typeof machineDefinition !== 'object' || machineDefinition === null) {
          throw new Error('Machine definition must be an object');
        }

        Object.entries(machineDefinition).forEach(([eventName, event]) => {
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

          if (event.onTransition && typeof event.onTransition !== 'function') {
            throw new Error(`onTransition for event '${eventName}' must be a function`);
          }
        });
      };

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

      const validateToShape = (from, to) => {
        if (from === undefined) {
          return;
        }

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
      };

      const executeHandler = (handler, context) => {
        if (typeof handler === 'function') {
          handler(context);
        }
      };

      validateMachine(machine);
      modelObject.machine = machine;

      const isValidTransition = (from, currentState) => {
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
      };

      Object.keys(modelObject.machine).forEach(eventName => {
        const namespacedAction = `${modelName}/${eventName}`;
        storeInstance.defineAction(namespacedAction, ({ state, payload }) => {
          const currentState = { ...state[modelName] };
          const event = modelObject.machine[eventName];

          if (isValidTransition(event.from, currentState)) {
            const applyTransition = (to) => {
              try {
                validateToShape(event.from, to);
              } catch (error) {
                console.error(`[Cami.js] State transition error for event '${eventName}':`, error.message);
                return;
              }

              // Execute onExit for the current state
              executeHandler(event.onExit, {
                state: currentState,
                dispatch: modelObject.dispatch,
                query: modelObject.query,
                mutate: modelObject.mutate,
                trigger: modelObject.trigger,
                compute: modelObject.compute,
                payload
              });

              Object.entries(to).forEach(([key, value]) => {
                state[modelName][key] = value;
              });

              // Execute onEntry for the new state
              executeHandler(event.onEntry, {
                state: state[modelName],
                dispatch: modelObject.dispatch,
                query: modelObject.query,
                mutate: modelObject.mutate,
                trigger: modelObject.trigger,
                compute: modelObject.compute,
                payload
              });
            };

            const newState = typeof event.to === 'function'
              ? event.to({ state: currentState, payload })
              : event.to;

            applyTransition(newState);

            // Execute onTransition
            executeHandler(event.onTransition, {
              state: state[modelName],
              dispatch: modelObject.dispatch,
              query: modelObject.query,
              mutate: modelObject.mutate,
              trigger: modelObject.trigger,
              compute: modelObject.compute,
              from: currentState,
              to: newState,
              payload,
              data: event.data
            });
          } else {
            __trace('cami:state-machine:ignored-transition',
              `Ignored transition '${eventName}' event from the current state.\n\n`,
              `Current state:\n\n${JSON.stringify(currentState)}\n\n`,
              `The '${eventName}' event expected any of these 'from' states:\n`,
              ...(Array.isArray(event.from)
                ? event.from.map((validState, index) => `  ${index + 1}. ${JSON.stringify(validState)}`)
                : [`  ${JSON.stringify(event.from)}`]
              ),
              "\n\nA key or element of the current state must match one of the 'from' states to trigger the state transition. If you intended to transition, either the 'from' state or current state is incorrect.\n"
            );
          }
        });
      });

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

      modelObject.canTransition = (eventName) => {
        const currentState = storeInstance.state[modelName];
        const event = modelObject.machine[eventName];
        if (!event) return false;

        return isValidTransition(event.from, currentState);
      };

      Object.defineProperty(modelObject, 'state', {
        get: () => storeInstance.state[modelName],
        enumerable: true,
        configurable: false
      });
    }
  }

  registerComponents({ actions, queries, mutations, computed, machine });

  modelObject.register = (components) => {
    registerComponents(components);
  };

  return new Proxy(modelObject, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }
      if (prop in storeInstance.state[modelName]) {
        return storeInstance.state[modelName][prop];
      }
      if (target.computed && prop in target.computed) {
        return target.compute(prop);
      }
      return undefined;
    }
  });
};

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

  storeInstances.set(finalConfig.name, storeInstance);

  return storeInstance;
};

export { ObservableStore, store, model };
