import { Observable } from './observable.js';
import { DependencyTracker } from './observable-state.js'
import { current, createDraft, finishDraft, original, produce, produceWithPatches, applyPatches, enablePatches, freeze } from 'immer';
import { _deepMerge, _deepClone } from '../utils.js';
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
 * CartStore.action('add', (state, product) => {
 *   const cartItem = { ...product, cartItemId: Date.now() };
 *   state.cartItems.push(cartItem);
 * });
 *
 * CartStore.action('remove', (state, product) => {
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

    Object.keys(initialState).forEach(key => {
      if (typeof initialState[key] === 'function') {
        this.action(key, initialState[key]);
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
        this._notifyObservers();
        return true;
      }
    });
  }

  _notifyObservers() {
    this.__observers.forEach(observer => observer.next(this.state));
    if (this.__subscriber && typeof this.__subscriber.next === 'function') {
      this.__subscriber.next(this.state);
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

      if (typeof expectedType === 'object' && expectedType !== null) {
        if (typeof actualValue !== 'object' || actualValue === null) {
          throw new TypeError(`Invalid type at ${currentPath.join('.')}. Expected object, got ${typeof actualValue}`);
        }
        this._validateDeepState(expectedType, actualValue, currentPath);
      } else {
        const actualType = this._inferType(actualValue);
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

  /**
   * Dispatches an action to update the store's state.
   * @param {string|function} action - The action type (string) or action creator (function).
   * @param {any} [payload] - The optional payload object to pass to the reducer.
   * @example
   * // Dispatching a simple action
   * store.dispatch('increment');
   *
   * // Dispatching an action with payload
   * store.dispatch('addItem', { id: 1, name: 'New Item' });
   *
   */
  dispatch(action, payload) {
    this.dispatchQueue.push({ action, payload });
    if (!this.isDispatching) {
      this._processDispatchQueue();
    }
    return this.currentDispatchPromise;
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
      return action(this._dispatch.bind(this), () => this.state);
    }

    if (typeof action !== 'string') {
      throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof action}`);
    }

    const reducer = this.reducers[action];
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
      state: this.state,
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
   * CartStore.action('add', ({ state, product }) => { // Updated parameter format
   *   const cartItem = { ...product, cartItemId: Date.now() };
   *   state.cartItems.push(cartItem);
   * });
   *
   * CartStore.action('remove', ({ state, product }) => { // Updated parameter format
   *   state.cartItems = state.cartItems.filter(item => item.cartItemId !== product.cartItemId);
   * });
   *
   * ```
   */
  action(action, reducer) {
    if (this.reducers[action]) {
      console.warn(`[Cami.js] Action type ${action} is already registered. Overwriting.`);
    }

    this.reducers[action] = ({ state, payload }) => {
      const result = reducer({ state, payload });
      this._validateDeepState(this.schema, state);
      return result;
    };

    this.actions[action] = (...args) => {
      return this.dispatch(action, ...args);
    };

    if (this[action] && typeof this[action] !== 'function') {
      console.warn(`[Cami.js] Property ${action} already exists on the store. Skipping method creation.`);
    } else {
      this[action] = (...args) => {
        return this.dispatch(action, ...args);
      };
    }
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
   * appStore.action('setPosts', (state, posts) => {
   *   state.posts = posts;
   * });
   *
   * appStore.query('fetchPosts', {
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
  query(queryName, config) {
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
      return this.fetch(queryName, ...args);
    }

    if (this[queryName]) {
      throw new Error(`[Cami.js] Method with name ${queryName} has already been defined.`);
    }

    this[queryName] = (...args) => {
      return this.fetch(queryName, ...args);
    }
  }

  /**
   * @method fetch
   * @memberof ObservableStore
   * @param {string} queryName - The name of the query to fetch.
   * @param {...any} args - The arguments to pass to the query function.
   * @returns {Promise} A promise that resolves to the query result.
   * @description Fetches data for the given query name. If the data is cached and not stale, it returns the cached data.
   * Otherwise, it fetches new data using the query function. Supports retry logic and calls lifecycle hooks.
   * @example
   * // Fetching data for a query named 'fetchPosts'
   * appStore.fetch('fetchPosts', 'someId')
   */
  fetch(queryName, ...args) {
    const query = this.queryFunctions[queryName];
    if (!query) {
      throw new Error(`[Cami.js] No query found for name: ${queryName}`);
    }

    const { queryKey, queryFn, staleTime, retry, retryDelay, onFetch, onSuccess, onError, onSettled, actions, mutations } = query;

    const context = {
      state: this.state,
      actions,
      queries: this.queryFunctions,
      mutations: mutations,
      invalidateQueries: this.invalidateQueries.bind(this)
    };

    const cacheKey = typeof queryKey === 'function' ? queryKey(args).join(':') : Array.isArray(queryKey) ? queryKey.join(':') : queryKey;

    const cachedData = this.queryCache.get(cacheKey);

    if (cachedData && !cachedData.isStale && !this._isStale(cachedData, staleTime)) {
      __trace(`fetch`, `Returning cached data for: ${queryName} with cacheKey: ${cacheKey}`);
      return Promise.resolve(cachedData.data);
    }

    __trace(`fetch`, `Data is stale or not cached, fetching new data for: ${queryName}`);

    if (onFetch) {
      __trace(`fetch`, `onFetch callback invoked for: ${queryName}`);
      onFetch(context);
    }

    let resultData;
    let resultError;

    return this._fetchWithRetry(queryFn, args, retry, retryDelay)
      .then((data) => {
        this.queryCache.set(cacheKey, { data, timestamp: Date.now(), isStale: false });
        resultData = data;
        if (onSuccess) {
          __trace(`fetch`, `Fetch success: ${queryName}`);
          onSuccess({ response: resultData, ...context });
        }
        return data;
      })
      .catch((error) => {
        resultError = error;
        if (onError) {
          __trace(`fetch`, `Fetch failed: ${queryName}`);
          onError({ response: resultError, ...context });
        }
        throw error;
      })
      .finally(() => {
        if (onSettled) {
          __trace(`fetch`, `Fetch settled: ${queryName}`);
          onSettled({ response: resultData, error: resultError, ...context });
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

    const _queryKey = queryKey.filter(Boolean).join(':');

    const queriesToInvalidate = Object.keys(this.queryFunctions).filter(queryName => {
      if (_queryKey === queryName)
        return true;

      if (predicate)
        return predicate(query);

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

      const cachedData = this.queryCache.get(cacheKey);

      if (cachedData) {
        cachedData.isStale = true;
      }

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
  _fetchWithRetry(queryFn, args, retry, retryDelay) {
    let attempts = 0;

    const executeFetch = () => {
      return queryFn(...args).catch((error) => {
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
   * appStore.mutation('deletePost', {
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
  mutation(mutationName, config) {
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

    if (this[mutationName]) {
      throw new Error(`[Cami.js] Method with name ${mutationName} has already been defined.`);
    }

    this[mutationName] = (...args) => {
      return this.mutate(mutationName, ...args);
    };
  }

  /**
   * @method mutate
   * @memberof ObservableStore
   * @param {string} mutationName - The name of the mutation to perform.
   * @param {...any} args - The arguments to pass to the mutation function.
   * @returns {Promise} A promise that resolves to the mutation result.
   * @description Performs the mutation with the given name and arguments. This method handles the mutation lifecycle, including optimistic updates, success handling, and error handling.
   * @example
   * ```javascript
   * // Define a mutation named 'deletePost'
   * appStore.mutation('deletePost', {
   *   // The function that performs the actual mutation logic
   *   mutationFn: (id) => fetch(`https://api.camijs.com/posts/${id}`, { method: 'DELETE' }).then(res => res.json()),
   *   // Optional: Optimistically update the state before the mutation
   *   onMutate: (context) => {
   *     context.actions.setPosts(context.state.posts.filter(post => post.id !== context.args[0]));
   *   },
   *   // Optional: Handle errors during mutation
   *   onError: (context) => {
   *     context.actions.setPosts(context.previousState.posts);
   *   },
   *   // Optional: Perform actions after a successful mutation
   *   onSuccess: (context) => {
   *     console.log('Mutation successful:', context);
   *   },
   *   // Optional: Perform actions after the mutation is settled (success or error)
   *   onSettled: (context) => {
   *     console.log('Mutation settled');
   *     context.invalidateQueries('posts');
   *   }
   * });
   *
   * // Execute the 'deletePost' mutation with a post ID
   * appStore.mutate('deletePost', 1);
   * ```
   */
  mutate(mutationName, ...args) {
    const mutation = this.mutationFunctions[mutationName];
    if (!mutation) {
      throw new Error(`[Cami.js] No mutation found for name: ${mutationName}`);
    }

    const { mutationFn, onMutate, onError, onSuccess, onSettled, actions, queries } = mutation;
    const context = {
      state: this.state,
      previousState: this.state,
      actions,
      queries,
      mutations: this.mutationFunctions,
      invalidateQueries: this.invalidateQueries.bind(this)
    };

    if (onMutate) {
      __trace(`mutate`, `Mutation in-progress: ${mutationName}`);
      onMutate({ ...context, args: args });
    }

    let resultData;
    let resultError;

    return mutationFn(...args)
      .then(data => {
        resultData = data;
        if (onSuccess) {
          __trace(`mutate`, `Mutation successful: ${mutationName}`);
          onSuccess({ response: resultData, ...context });
        }
        return resultData;
      })
      .catch(error => {
        resultError = error;
        if (onError) {
          __trace(`mutate`, `Mutation failed: ${mutationName}`);
          onError({ response: resultError, ...context });
        }
        throw resultError;
      })
      .finally(() => {
        if (onSettled) {
          __trace(`mutate`, `Mutation settled: ${mutationName}`);
          onSettled({ response: resultData || resultError, ...context });
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
 * Creates a slice of the store with its own state and actions, namespaced to avoid conflicts.
 *
 * @function slice
 * @param {string} sliceName - The name of the slice.
 * @param {Object} options - The options for creating the slice.
 * @param {string} [options.store='cami-store'] - The name of the store to use or create.
 * @param {Object} options.state - The initial state of the slice.
 * @param {Object} options.actions - The actions for the slice.
 * @param {Object} [options.queries] - The queries for the slice.
 * @param {Object} [options.mutations] - The mutations for the slice.
 * @returns {Object} - An object containing the action methods for the slice, including getState, actions, queries, mutations, and subscribe methods.
 *
 * @example
 * const navigationSlice = slice("Navigation", {
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
 * // Accessing the slice's state
 * navigationSlice.getState();
 *
 * // Dispatching actions
 * navigationSlice.toggle();
 *
 * // Subscribing to state changes
 * const unsubscribe = navigationSlice.subscribe(state => {
 *   console.log('Navigation slice state changed:', state);
 * });
 *
 * // Unsubscribe when no longer needed
 * unsubscribe();
 */
const slice = (sliceName, { store: storeName = 'cami-store', state, actions, queries, mutations }) => {
  let storeInstance = store({
    state: { [sliceName]: state },
    name: storeName
  });

  if (storeInstance.slices && storeInstance.slices[sliceName]) {
    throw new Error(`[Cami.js] Slice name ${sliceName} is already in use in store ${storeName}.`);
  }

  if (!storeInstance.slices) {
    storeInstance.slices = {};
  }

  storeInstance.slices[sliceName] = true;

  const sliceObject = {
    subscribe: (callback) => {
      return storeInstance.subscribe(state => callback(state[sliceName]));
    }
  };

  // Expose state values as immutable properties
  Object.keys(state).forEach(key => {
    Object.defineProperty(sliceObject, key, {
      get: () => storeInstance.state[sliceName][key],
      enumerable: true,
      configurable: false
    });
  });

  // Define a function to infer types from the initial state
  const inferType = (value) => {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'maybeNull';
    if (value === undefined) return 'maybeUndefined';
    if (typeof value === 'object') return createDeepSchema(value);
    return typeof value;
  };

  // Create a deep schema based on the initial state
  const createDeepSchema = (state) => {
    return Object.keys(state).reduce((acc, key) => {
      acc[key] = inferType(state[key]);
      return acc;
    }, {});
  };

  const schema = createDeepSchema(state);


  // Function to validate state against schema
  const validateDeepState = (schema, newState, path = []) => {
    Object.keys(schema).forEach(key => {
      const expectedType = schema[key];
      const actualValue = newState[key];
      const currentPath = [...path, key];

      if (typeof expectedType === 'object' && expectedType !== null) {
        if (typeof actualValue !== 'object' || actualValue === null) {
          throw new TypeError(`Invalid type at ${currentPath.join('.')}. Expected object, got ${typeof actualValue}`);
        }
        validateDeepState(expectedType, actualValue, currentPath);
      } else {
        const actualType = inferType(actualValue);
        if (expectedType === 'maybeNull') {
          // Allow any type for maybeNull
        } else if (expectedType === 'maybeUndefined') {
          // Allow any type for maybeUndefined
        } else if (actualType !== expectedType) {
          throw new TypeError(`Invalid type at ${currentPath.join('.')}. Expected ${expectedType}, got ${actualType}`);
        }
      }
    });
  };

  // Wrap actions to operate on the slice's state directly
  const wrappedActions = Object.keys(actions).reduce((acc, actionKey) => {
    acc[actionKey] = ({ state, payload }) => {
      try {
        const newState = produce(state, draft => {
          actions[actionKey]({ state: draft, payload });
        });
        validateDeepState(schema, newState);
        return newState;
      } catch (error) {
        throw error;
      }
    };
    return acc;
  }, {});

  // Register actions
  Object.keys(wrappedActions).forEach(actionKey => {
    const namespacedAction = `${sliceName}/${actionKey}`;
    storeInstance.action(namespacedAction, ({ state, payload }) => {
      state[sliceName] = wrappedActions[actionKey]({ state: state[sliceName], payload });
    });

    sliceObject[actionKey] = (...args) => {
      return storeInstance.dispatch(namespacedAction, ...args);
    };
  });

  // Register queries
  if (queries) {
    Object.keys(queries).forEach(queryKey => {
      const namespacedQuery = `${sliceName}/${queryKey}`;
      const queryConfig = {
        ...queries[queryKey],
        actions: sliceObject,
        onSuccess: (ctx) => {
          if (queries[queryKey].onSuccess) {
            queries[queryKey].onSuccess({
              ...ctx,
              state: ctx.state[sliceName]
            });
          }
        }
      };

      storeInstance.query(namespacedQuery, queryConfig);

      sliceObject[queryKey] = (...args) => {
        return storeInstance.fetch(namespacedQuery, ...args);
      };
    });
  }

  // Register mutations
  if (mutations) {
    Object.keys(mutations).forEach(mutationKey => {
      const namespacedMutation = `${sliceName}/${mutationKey}`;
      const mutationConfig = {
        ...mutations[mutationKey],
        actions: sliceObject,
        queries: sliceObject,
        onMutate: (ctx) => {
          if (mutations[mutationKey].onMutate) {
            return mutations[mutationKey].onMutate({
              ...ctx,
              state: ctx.state[sliceName]
            });
          }
        },
        onSuccess: (ctx) => {
          if (mutations[mutationKey].onSuccess) {
            mutations[mutationKey].onSuccess({
              ...ctx,
              state: ctx.state[sliceName]
            });
          }
        },
        onError: (ctx) => {
          if (mutations[mutationKey].onError) {
            mutations[mutationKey].onError({
              ...ctx,
              state: ctx.state[sliceName]
            });
          }
        }
      };

      storeInstance.mutation(namespacedMutation, mutationConfig);

      sliceObject[mutationKey] = (...args) => {
        return storeInstance.mutate(namespacedMutation, ...args);
      };
    });
  }

  return new Proxy(sliceObject, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }
      // If the property doesn't exist on the sliceObject, check if it exists on the state
      if (prop in storeInstance.state[sliceName]) {
        return storeInstance.state[sliceName][prop];
      }
      return undefined;
    }
  });
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
const _localStorageEnhancer = (StoreClass) => {
  return (initialState, options) => {
    const storeName = options?.name || 'default-store';
    const shouldLoad = options?.load !== false;
    const defaultExpiry = 24 * 60 * 60 * 1000;
    const expiry = options?.expiry !== undefined ? options.expiry : defaultExpiry;
    const localInitialState = _deepClone(initialState);
    const store = new StoreClass(initialState);

    store.name = storeName;

    const validateSchema = (loadedState, initialState) => {
      const initialKeys = Object.keys(initialState);
      const loadedKeys = Object.keys(loadedState);
      const allInitialKeysPresent = initialKeys.every(key => loadedKeys.includes(key));
      const allLoadedKeysValid = loadedKeys.every(key => initialKeys.includes(key));

      return allInitialKeysPresent && allLoadedKeysValid;
    };

    store.init = () => {
      if (shouldLoad) {
        const storedState = localStorage.getItem(storeName);
        const storedExpiry = localStorage.getItem(`${storeName}-expiry`);
        const currentTime = new Date();

        __trace('cami:localStorage', `Identified localStorage: ${storeName}.`);

        if (storedState && storedExpiry) {
          const isExpired = currentTime.getTime() >= parseInt(storedExpiry, 10);
          __trace('cami:localStorage', `Confirmed expiry status: ${isExpired ? 'Has Expired' : 'Still Valid'}`);

          if (!isExpired) {
            const loadedState = JSON.parse(storedState);
            __trace('cami:localStorage', `Loaded state from localStorage. See Chrome Devtools > Storage > Local Storage`);

            if (validateSchema(loadedState, localInitialState)) {
              // Create a proxy from the merged state
              store.state = store._createProxy(createDraft(_deepMerge(loadedState, localInitialState)));
            } else {
              __trace('cami:localStorage', `Loaded state does not match the schema. Resetting localStorage and using initial state.`);
              localStorage.removeItem(storeName);
              localStorage.removeItem(`${storeName}-expiry`);
              store.state = store._createProxy(createDraft(localInitialState));
            }
          } else {
            // Handle expired state
            __trace('cami:localStorage', `Stored state has expired. Removing from localStorage and using initial state.`);
            localStorage.removeItem(storeName);
            localStorage.removeItem(`${storeName}-expiry`);
            store.state = store._createProxy(createDraft(localInitialState));
          }
        } else {
          // No stored state found
          __trace('cami:localStorage', `No stored state found in localStorage. Using initial state.`);
          store.state = store._createProxy(createDraft(localInitialState));
        }
      }
    };

    store.init();

    store.reset = () => {
      localStorage.removeItem(storeName);
      localStorage.removeItem(`${storeName}-expiry`);

      store.state = store._createProxy(createDraft(initialState));
      __trace('cami:localStorage', `Resetted store state of ${storeName}`);

      store.__observers.forEach(observer => observer.next(store.state));
    };

    store.subscribe((state) => {
      const currentTime = new Date();
      const expiryTime = new Date(currentTime.getTime() + expiry);

      localStorage.setItem(storeName, JSON.stringify(state));
      localStorage.setItem(`${storeName}-expiry`, expiryTime.getTime().toString());
    });

    return store;
  };
};

const storeInstances = new Map();

/**
 * @function store
 * @param {Object} config - Configuration object for the store.
 * @param {Object} config.state - The initial state of the store.
 * @param {boolean} [config.localStorage=true] - Whether to use localStorage for state persistence.
 * @param {string} [config.name='cami-store'] - The name of the store to use as the key in localStorage.
 * @param {number} [config.expiry=86400000] - The time in milliseconds until the stored state expires (default is 24 hours).
 * @returns {ObservableStore} A new instance of ObservableStore with the provided initial state, enhanced with localStorage if enabled.
 * @description This function creates a new instance of ObservableStore with the provided initial state and enhances it with localStorage support if enabled. The store's state will be automatically persisted to and loaded from localStorage, using the provided name as the key. The `localStorage` option enables this behavior and can be toggled off if persistence is not needed.
 * @example
 * ```javascript
 * // Create a store with default localStorage support
 * const CartStore = store({
 *   state: { cartItems: [] },
 *   name: 'cart-store'
 * });
 *
 * // Create a store without localStorage support
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
    localStorage: true,
    name: 'cami-store',
    expiry: 86400000, // 24 hours
  };

  const finalConfig = { ...defaultConfig, ...config };

  if (storeInstances.has(finalConfig.name)) {
    return storeInstances.get(finalConfig.name);
  }

  let storeInstance;
  if (finalConfig.localStorage) {
    storeInstance = _localStorageEnhancer(ObservableStore)(finalConfig.state, finalConfig);
  } else {
    storeInstance = new ObservableStore(finalConfig.state);
  }

  storeInstances.set(finalConfig.name, storeInstance);

  return storeInstance;
};

export { ObservableStore, store, slice };
