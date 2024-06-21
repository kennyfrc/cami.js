import { Observable } from './observable.js';
import { DependencyTracker } from './observable-state.js'
import { produce, produceWithPatches, applyPatches, enablePatches } from 'immer';
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

    this.state = this._createProxy(initialState);

    this.reducers = {};
    this.actions = {};
    this.middlewares = [];
    this.devTools = this.__connectToDevTools();
    this.dispatchQueue = [];
    this.isDispatching = false;
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

  _createProxy(state) {
    const store = this;
    return new Proxy(state, {
      get(target, property) {
        const value = target[property];
        if (typeof value === 'object' && value !== null) {
          return store._createProxy(value);
        }
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(store, property);
        }
        return Reflect.get(target, property);
      },
      set(target, property, value) {
        target[property] = value;
        store._notifyObservers();
        if (store.devTools) {
          store.devTools.send(property, store.state);
        }
        return true;
      }
    });
  }

  _notifyObservers() {
    this.__observers.forEach(observer => observer.next(this.state));
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
  }

  _processDispatchQueue() {
    while (this.dispatchQueue.length > 0) {
      const { action, payload } = this.dispatchQueue.shift();
      this.isDispatching = true;
      this._dispatch(action, payload);
      this.isDispatching = false;
    }
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

    const oldState = this.state;
    const [newState, patches, inversePatches] = produceWithPatches(this.state, draft => {
      reducer({
        state: draft,
        payload: payload
      });
    });

    __trace('cami:store:state:change', `Changed store state via action: ${action}`);
    if (__config.events.isEnabled && typeof window !== 'undefined') {
      const event = new CustomEvent('cami:store:state:change', {
        detail: {
          action: action,
          oldValue: oldState,
          newValue: newState
        }
      });
      window.dispatchEvent(event);
    }

    this.state = newState;
    this.__observers.forEach(observer => observer.next(this.state));

    if (this.devTools) {
      this.devTools.send(action, this.state);
    }

    // Notify patch listeners
    patches.forEach(patch => {
      const listeners = this.patchListeners.get(patch.path[0]);
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
   * @method getState
   * @memberof ObservableStore
   * @returns {Object} - The current state of the store.
   * @description Retrieves the current state of the store. This method is crucial in asynchronous operations or event-driven environments to ensure the most current state is accessed, as the state might change frequently due to user interactions or other asynchronous updates.
   */
  getState() {
    return this.state;
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
      throw new Error(`[Cami.js] Action type ${action} is already registered.`);
    }
    this.reducers[action] = reducer;

    this.actions[action] = (...args) => {
      this.dispatch(action, ...args);
    };

    if (this[action]) {
      throw new Error(`[Cami.js] Method with name ${action} has already been defined.`);
    }

    this[action] = (...args) => {
      this.dispatch(action, ...args);
    };
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
          onSuccess({ result: resultData, ...context });
        }
        return data;
      })
      .catch((error) => {
        resultError = error;
        if (onError) {
          __trace(`fetch`, `Fetch failed: ${queryName}`);
          onError({ result: resultError, ...context });
        }
        throw error;
      })
      .finally(() => {
        if (onSettled) {
          __trace(`fetch`, `Fetch settled: ${queryName}`);
          onSettled({ result: resultData, error: resultError, ...context });
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
      const query = this.queryFunctions[queryName];
      if (queryKey) {
        const key = typeof query.queryKey === 'function' ? query.queryKey() : query.queryKey;
        return JSON.stringify(key) === JSON.stringify(queryKey);
      }
      if (predicate) {
        return predicate(query);
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
          onSuccess({ result: resultData, ...context });
        }
        return resultData;
      })
      .catch(error => {
        resultError = error;
        if (onError) {
          __trace(`mutate`, `Mutation failed: ${mutationName}`);
          onError({ result: resultError, ...context });
        }
        throw resultError;
      })
      .finally(() => {
        if (onSettled) {
          __trace(`mutate`, `Mutation settled: ${mutationName}`);
          onSettled({ result: resultData || resultError, ...context });
        }
      });
  }
}


  /**
   * Creates a slice of the store with its own state and actions, namespaced to avoid conflicts.
   *
   * @function slice
   * @param {Object} store - The main store instance.
   * @param {Object} options - The options for creating the slice.
   * @param {string} options.name - The name of the slice.
   * @param {Object} options.state - The initial state of the slice.
   * @param {Object} options.actions - The actions for the slice.
   * @param {Object} [options.queries] - The queries for the slice.
   * @param {Object} [options.mutations] - The mutations for the slice.
   * @returns {Object} - An object containing the action methods for the slice, including getState, actions, queries, mutations, and subscribe methods.
   *
   * @example
   * const appStore = store({
   *   // Initial state for other parts of the application
   * });
   *
   * const postsSlice = slice(appStore, {
   *   name: 'posts',
   *   state: [
   *     { id: 1, title: 'First Post' },
   *     { id: 2, title: 'Second Post' }
   *   ],
   *   actions: {
   *     updatePost: (state, { id, title }) => {
   *       const postIndex = state.findIndex(post => post.id === id);
   *       if (postIndex !== -1) {
   *         state[postIndex].title = title;
   *       }
   *     }
   *   }
   * });
   *
   * // Accessing the slice's state
   * postsSlice.getState();
   *
   * // Dispatching actions
   * postsSlice.actions.updatePost({ id: 1, title: 'Updated Title' });
   *
   * // Subscribing to state changes
   * const unsubscribe = postsSlice.subscribe(state => {
   *   console.log('Posts slice state changed:', state);
   * });
   *
   * // Unsubscribe when no longer needed
   * unsubscribe();
   */
  const slice = (store, { name, state, actions, queries, mutations }) => {
    if (store.slices && store.slices[name]) {
      throw new Error(`[Cami.js] Slice name ${name} is already in use.`);
    }

    if (!store.slices) {
      store.slices = {};
    }

    const _storedState = JSON.parse(localStorage.getItem(`${store.name}`));

    // if length is zero, then it's falsy
    const storedState = _storedState && Object.keys(_storedState).length ? _storedState[name] : {};
    const initialState = _deepMerge(state, storedState);

    store.slices[name] = true;
    store.state[name] = initialState;

    const sliceActions = {};
    const sliceQueries = {};
    const sliceMutations = {};
    const sliceSubscribers = [];

    // Create a proxy for the slice state to ensure reactivity
    const sliceState = new Proxy(store.state[name], {
      get(target, property) {
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(store, `${name}.${property}`);
        }
        return target[property];
      },
      set(target, property, value) {
        target[property] = value;
        store._notifyObservers();
        if (store.devTools) {
          store.devTools.send(`${name}.${property}`, store.state);
        }
        return true;
      }
    });

    // Register actions with namespacing
    Object.keys(actions).forEach(actionKey => {
      const namespacedAction = `${name}/${actionKey}`;
      store.action(namespacedAction, ({ state, payload }) => {
        state[name] = produce(state[name], draft => {
          actions[actionKey]({ state: draft, payload });
        });
      });

      sliceActions[actionKey] = (...args) => {
        store.dispatch(namespacedAction, ...args);
      };
    });

    // Register queries with namespacing
    if (queries) {
      Object.keys(queries).forEach(queryKey => {
        const namespacedQuery = `${name}/${queryKey}`;
        const queryConfig = { ...queries[queryKey], actions: sliceActions, queries: sliceQueries };

        if (queryConfig.onSuccess) {
          const originalOnSuccess = queryConfig.onSuccess;
          queryConfig.onSuccess = (context) => {
            store.dispatch(() => originalOnSuccess(context));
          };
        }

        if (queryConfig.onError) {
          const originalOnError = queryConfig.onError;
          queryConfig.onError = (context) => {
            store.dispatch(() => originalOnError(context));
          };
        }

        if (queryConfig.onSettled) {
          const originalOnSettled = queryConfig.onSettled;
          queryConfig.onSettled = (context) => {
            store.dispatch(() => originalOnSettled(context));
          };
        }

        store.query(namespacedQuery, queryConfig);

        sliceQueries[queryKey] = (...args) => {
          return store.fetch(namespacedQuery, ...args);
        };
      });
    }

    // Register mutations with namespacing
    if (mutations) {
      Object.keys(mutations).forEach(mutationKey => {
        const namespacedMutation = `${name}/${mutationKey}`;
        const mutationConfig = { ...mutations[mutationKey], actions: sliceActions, queries: sliceQueries, invalidateQueries: store.invalidateQueries.bind(store) };
        store.mutation(namespacedMutation, mutationConfig);

        sliceMutations[mutationKey] = (...args) => {
          return store.mutate(namespacedMutation, ...args);
        };
      });
    }

    const subscribe = (callback) => {
      sliceSubscribers.push(callback);
      return () => {
        const index = sliceSubscribers.indexOf(callback);
        if (index > -1) {
          sliceSubscribers.splice(index, 1);
        }
      };
    };

    store.subscribe((newState) => {
      const sliceState = newState[name];
      sliceSubscribers.forEach(callback => callback(sliceState));
    });

    const sliceObject = { state: sliceState, subscribe };

    Object.keys(sliceActions).forEach(actionKey => {
      sliceObject[actionKey] = sliceActions[actionKey];
    });

    Object.keys(sliceQueries).forEach(queryKey => {
      sliceObject[queryKey] = sliceQueries[queryKey];
    });

    Object.keys(sliceMutations).forEach(mutationKey => {
      sliceObject[mutationKey] = sliceMutations[mutationKey];
    });

    return sliceObject;
  }

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
              store.state = store._createProxy(_deepMerge(loadedState, localInitialState));
            } else {
              __trace('cami:localStorage', `Stored state has expired. Removing from localStorage.`);
              localStorage.removeItem(storeName);
              localStorage.removeItem(`${storeName}-expiry`);
            }
          } else {
            __trace('cami:localStorage', `No stored state found in localStorage.`);
          }
        }
      };

      store.init();

      store.reset = () => {
        localStorage.removeItem(storeName);
        localStorage.removeItem(`${storeName}-expiry`);

        store.state = store._createProxy(initialState);
        __trace('cami:localStorage', `Resetted store state of ${storeName}`);

        store.__observers.forEach(observer => observer.next(store.state));
      };

      store.subscribe((state) => {
        const currentTime = new Date();
        const expiryTime = new Date(currentTime.getTime() + expiry);

        localStorage.setItem(storeName, JSON.stringify(state));
        localStorage.setItem(`${storeName}-expiry`, expiryTime.getTime().toString());

        __trace('cami:localStorage:state:change', `Synced localStorage state with in-memory store. Expiry time: ${expiryTime.toLocaleString()}`);
      });

      return store;
    };
  };

/**
 * @function store
 * @param {Object} initialState - The initial state of the store.
 * @param {Object} [options] - Configuration options for the store.
 * @param {boolean} [options.localStorage=true] - Whether to use localStorage for state persistence.
 * @param {string} [options.name='cami-store'] - The name of the store to use as the key in localStorage.
 * @param {number} [options.expiry=86400000] - The time in milliseconds until the stored state expires (default is 24 hours).
 * @returns {ObservableStore} A new instance of ObservableStore with the provided initial state, enhanced with localStorage if enabled.
 * @description This function creates a new instance of ObservableStore with the provided initial state and enhances it with localStorage support if enabled. The store's state will be automatically persisted to and loaded from localStorage, using the provided name as the key. The `localStorage` option enables this behavior and can be toggled off if persistence is not needed.
 * @example
 * ```javascript
 * // Create a store with default localStorage support
 * const CartStore = store({ cartItems: [] });
 *
 * // Create a store without localStorage support
 * const NonPersistentStore = store({ items: [] }, { localStorage: false });
 * ```
 */
const store = (initialState, options = {}) => {
  const defaultOptions = {
    localStorage: true,
    name: 'cami-store',
    expiry: 86400000, // 24 hours
  };

  const finalOptions = { ...defaultOptions, ...options };

  if (finalOptions.localStorage) {
    const enhancedStore = _localStorageEnhancer(ObservableStore)(initialState, finalOptions);
    return enhancedStore;
  } else {
    return new ObservableStore(initialState);
  }
}

export { ObservableStore, store, slice };
