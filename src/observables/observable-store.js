import { Observable } from './observable.js';
import { produce } from "../produce.js";
import { __config } from '../config.js';
import { __trace } from '../trace.js';

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
 * CartStore.register('add', (state, product) => {
 *   const cartItem = { ...product, cartItemId: Date.now() };
 *   state.cartItems.push(cartItem);
 * });
 *
 * CartStore.register('remove', (state, product) => {
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

    this.state = new Proxy(initialState, {
      get: (target, property) => {
        return target[property];
      },
      set: (target, property, value) => {
        target[property] = value;
        this.__observers.forEach(observer => observer.next(this.state));
        if (this.devTools) {
          this.devTools.send(property, this.state);
        }
        return true;
      }
    });

    this.reducers = {};
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

    Object.keys(initialState).forEach(key => {
      if (typeof initialState[key] === 'function') {
        this.register(key, initialState[key]);
      } else {
        this.state[key] = initialState[key];
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
   * CartStore.register('add', (state, product) => {
   *   const cartItem = { ...product, cartItemId: Date.now() };
   *   state.cartItems.push(cartItem);
   * });
   *
   * CartStore.register('remove', (state, product) => {
   *   state.cartItems = state.cartItems.filter(item => item.cartItemId !== product.cartItemId);
   * });
   *
   * ```
   */
  register(action, reducer) {
    if (this.reducers[action]) {
      throw new Error(`[Cami.js] Action type ${action} is already registered.`);
    }
    this.reducers[action] = reducer;

    this[action] = (...args) => {
      this.dispatch(action, ...args);
    };
  }

  /**
   * @method query
   * @memberof ObservableStore
   * @param {string} queryName - The name of the query.
   * @param {Object} config - The configuration object for the query, containing the following properties:
   * @param {string} config.queryKey - The unique key for the query.
   * @param {Function} config.queryFn - The asynchronous query function that returns a promise.
   * @param {number} [config.staleTime=0] - Optional. The time in milliseconds after which the query is considered stale. Defaults to 0.
   * @param {boolean} [config.refetchOnWindowFocus=true] - Optional. Whether to refetch the query when the window regains focus. Defaults to true.
   * @param {boolean} [config.refetchOnReconnect=true] - Optional. Whether to refetch the query when the network reconnects. Defaults to true.
   * @param {number|null} [config.refetchInterval=null] - Optional. The interval in milliseconds at which to refetch the query. Defaults to null.
   * @param {number} [config.gcTime=300000] - Optional. The time in milliseconds after which the query is garbage collected. Defaults to 300000 (5 minutes).
   * @param {number} [config.retry=3] - Optional. The number of times to retry the query on error. Defaults to 3.
   * @param {Function} [config.retryDelay=(attempt) => Math.pow(2, attempt) * 1000] - Optional. A function that returns the delay in milliseconds for each retry attempt. Defaults to a function that calculates an exponential backoff based on the attempt number.
   * @description Registers an asynchronous query with the specified configuration.
   * @example
   * ```javascript
   * // Register a query to fetch posts
   * appStore.query('posts/fetchAll', {
   *   queryKey: 'posts/fetchAll',
   *   queryFn: () => fetch('https://api.camijs.com/posts').then(res => res.json()),
   *   refetchOnWindowFocus: true,
   * });
   *
   * // Register actions for pending, success, and error states of the query
   * appStore.register('posts/fetchAll/pending', (state, payload) => {
   *   state.isLoading = true;
   *   state.posts = [];
   *   state.error = null;
   * });
   *
   * appStore.register('posts/fetchAll/success', (state, payload) => {
   *   state.posts = payload;
   *   state.isLoading = false;
   *   state.error = null;
   * });
   *
   * appStore.register('posts/fetchAll/error', (state, payload) => {
   *   state.error = payload;
   *   state.isLoading = false;
   *   state.posts = [];
   * });
   *
   * // Fetch all posts
   * appStore.fetch('posts/fetchAll');
   *
   * // Subscribe to updates
   * appStore.subscribe(newState => {
   *   console.log('New state:', newState);
   * });
   * ```
   */
  query(queryName, config) {
    const {
      queryKey,
      queryFn,
      staleTime = 0,
      refetchOnWindowFocus = true,
      refetchInterval = null,
      refetchOnReconnect = true,
      gcTime = 1000 * 60 * 5,
      retry = 3,
      retryDelay = (attempt) => Math.pow(2, attempt) * 1000,
    } = config;

    // Register the query with minimal configuration
    this.queries[queryName] = {
      queryKey,
      queryFn,
      staleTime,
      refetchOnWindowFocus,
      refetchInterval,
      refetchOnReconnect,
      gcTime,
      retry,
      retryDelay,
    };

    this.queryFunctions.set(queryKey, queryFn);

    __trace(`query`, `Starting query with key: ${queryName}`);

    if (refetchInterval !== null) {
      const intervalId = setInterval(() => {
        __trace(`query`, `Interval expired, refetching query: ${queryName}`);
        this.fetch(queryName).catch(error => console.error(`Error refetching query ${queryName}:`, error));
      }, refetchInterval);
      this.intervals[queryName] = intervalId;
    }

    if (refetchOnWindowFocus) {
      const focusHandler = () => {
        __trace(`query`, `Window focus detected, refetching query: ${queryName}`);
        this.fetch(queryName).catch(error => console.error(`Error refetching query ${queryName} on window focus:`, error));
      };
      window.addEventListener('focus', focusHandler);
      this.focusHandlers[queryName] = focusHandler;
    }

    if (refetchOnReconnect) {
      const reconnectHandler = () => {
        __trace(`query`, `Reconnect detected, refetching query: ${queryName}`);
        this.fetch(queryName).catch(error => console.error(`Error refetching query ${queryName} on reconnect:`, error));
      };
      window.addEventListener('online', reconnectHandler);
      this.reconnectHandlers[queryName] = reconnectHandler;
    }

    const gcTimeout = setTimeout(() => {
      __trace(`query`, `Garbage collection timeout expired, refetching query: ${queryName}`);
      this.fetch(queryName).catch(error => console.error(`Error refetching query ${queryName} on gc timeout:`, error));
    }, gcTime);

    this.gcTimeouts[queryName] = gcTimeout;

    this[queryName] = (...args) => {
        return this.fetch(queryName, ...args);
    };
  }

  /**
   * @method fetch
   * @memberof ObservableStore
   * @param {string} queryName - The name of the query to fetch data for.
   * @param {...any} args - Arguments to pass to the query function.
   * @returns {Promise<any>} A promise that resolves with the fetched data.
   * @description Fetches data for a given query name, utilizing cache if available and not stale.
   * If data is stale or not in cache, it fetches new data using the query function.
   * @example
   * ```javascript
   * // Register a query to fetch posts
   * appStore.query('posts/fetchAll', {
   *   queryKey: 'posts/fetchAll',
   *   queryFn: () => fetch('https://api.camijs.com/posts').then(res => res.json()),
   *   refetchOnWindowFocus: true,
   * });
   *
   * // Register actions for pending, success, and error states of the query
   * appStore.register('posts/fetchAll/pending', (state, payload) => {
   *   state.isLoading = true;
   *   state.posts = [];
   *   state.error = null;
   * });
   *
   * appStore.register('posts/fetchAll/success', (state, payload) => {
   *   state.posts = payload;
   *   state.isLoading = false;
   *   state.error = null;
   * });
   *
   * appStore.register('posts/fetchAll/error', (state, payload) => {
   *   state.error = payload;
   *   state.isLoading = false;
   *   state.posts = [];
   * });
   *
   * // Fetch all posts
   * appStore.fetch('posts/fetchAll');
   *
   * // Subscribe to updates
   * appStore.subscribe(newState => {
   *   console.log('New state:', newState);
   * });
   * ```
   */
  fetch(queryName, ...args) {
    const query = this.queries[queryName];
    if (!query) {
        throw new Error(`[Cami.js] No query found for name: ${queryName}`);
    }

    const { queryKey, queryFn, staleTime, retry, retryDelay } = query;
    const cacheKey = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
    const cachedData = this.queryCache.get(cacheKey);

    if (cachedData && !this._isStale(cachedData, staleTime)) {
      __trace(`fetch`, `Returning cached data for: ${queryName} with cacheKey: ${cacheKey}`);
      return Promise.resolve(cachedData.data);
    }

    __trace(`fetch`, `Data is stale or not cached, fetching new data for: ${queryName}`);
    this.dispatch(`${queryName}/pending`);
    return this._fetchWithRetry(queryFn, args, retry, retryDelay)
      .then((data) => {
        this.queryCache.set(cacheKey, { data, timestamp: Date.now() });
        this.dispatch(`${queryName}/success`, data);
        return data;
      })
      .catch((error) => {
        this.dispatch(`${queryName}/error`, error);
        throw error;
      });
  }

  /**
   * @method invalidateQueries
   * @memberof ObservableStore
   * @param {string} queryName - The name of the query to invalidate.
   * @description Invalidates the cache and any associated intervals or event listeners for a given query name.
   */
  invalidateQueries(queryName) {
    const query = this.queries[queryName];
    if (!query) return;

    const cacheKey = Array.isArray(query.queryKey) ? query.queryKey.join(':') : query.queryKey;

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

    this.queryCache.delete(cacheKey);
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
  _fetchWithRetry(queryFn, args, retries, retryDelay) {
    return queryFn(...args).catch((error) => {
      if (retries === 0) {
        throw error;
      }
      const delay = retryDelay(retries);
      return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
        __trace(`fetchWithRetry`, `Retrying query with key: ${queryName}`),
        this._fetchWithRetry(queryFn, args, retries - 1, retryDelay)
      );
    });
  }

  /**
   * @private
   * @method isStale
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
   * Dispatches an action or a function to the store, updating its state accordingly.
   * This method is central to the store's operation, allowing for state changes in response to actions.
   *
   * @method dispatch
   * @memberof ObservableStore
   * @param {string|Function} action - The action type as a string or a function that performs custom dispatch logic.
   * @param {Object} payload - The data to be passed along with the action.
   * @throws {Error} If the action type is not a string when expected.
   * @description Use this method to dispatch redux-style actions or flux actions, triggering state updates.
   * @example
   * ```javascript
   * // Dispatching an action with a payload
   * CartStore.dispatch('add', { id: 1, name: 'Product 1', quantity: 2 });
   * ```
   */
  dispatch(action, payload) {
    this.dispatchQueue.push({ action, payload });
    if (!this.isDispatching) {
      this._processDispatchQueue();
    }
  }

  /**
   * Processes the dispatch queue, executing each action in sequence.
   * This method ensures that actions are dispatched one at a time, in the order they were called.
   *
   * @private
   */
  _processDispatchQueue() {
    while (this.dispatchQueue.length > 0) {
      const { action, payload } = this.dispatchQueue.shift();
      this.isDispatching = true;
      this._dispatch(action, payload);
      this.isDispatching = false;
    }
  }

  /**
   * Performs the actual dispatch of an action, invoking the corresponding reducer and updating the state.
   * This method supports both string actions and function actions, allowing for flexible dispatch mechanisms.
   *
   * @private
   * @param {string|Function} action - The action to dispatch.
   * @param {Object} payload - The payload associated with the action.
   * @throws {Error} If the action type is not a string or a function.
   */
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
    const newState = produce(this.state, draft => {
      reducer(draft, payload);
    });

    this.state = newState;
    this.__observers.forEach(observer => observer.next(this.state));

    if (this.devTools) {
      this.devTools.send(action, this.state);
    }

    // Custom event dispatching and tracing
    if (oldState !== newState) {
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

      __trace('cami:store:state:change', action, oldState, newState);
    }
  }
}

/**
 * @function slice
 * @param {Object} store - The main store instance.
 * @param {Object} options - The options for creating the slice.
 * @param {string} options.name - The name of the slice.
 * @param {Object} options.state - The initial state of the slice.
 * @param {Object} options.actions - The actions for the slice.
 * @returns {Object} - An object containing the action methods for the slice.
 * @description Creates a slice of the store with its own state and actions, namespaced to avoid conflicts.
 * @example
 * ```javascript
 * const userSlice = slice(appStore, {
 *   name: 'user',
 *   state: {
 *     userInfo: null,
 *     isLoggedIn: false,
 *   },
 *   actions: {
 *     login(state, userInfo) {
 *       state.userInfo = userInfo;
 *       state.isLoggedIn = true;
 *     },
 *     logout(state) {
 *       state.userInfo = null;
 *       state.isLoggedIn = false;
 *     },
 *   }
 * });
 * ```
 */
const slice = (store, { name, state, actions }) => {
  if (store.slices && store.slices[name]) {
    throw new Error(`[Cami.js] Slice name ${name} is already in use.`);
  }

  // Initialize slices if not already done
  if (!store.slices) {
    store.slices = {};
  }

  store.slices[name] = true; // Mark the slice as registered
  store.state[name] = state;

  const sliceActions = {};

  Object.keys(actions).forEach(actionKey => {
    const namespacedAction = `${name}/${actionKey}`;
    store.register(namespacedAction, (state, payload) => {
      actions[actionKey](state[name], payload);
    });

    sliceActions[actionKey] = (...args) => {
      store.dispatch(namespacedAction, ...args);
    };
  });

  return sliceActions;
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

  const _deepMerge = function(target, source) {
    if (typeof target !== 'object' || target === null) {
      return source;
    }

    Object.keys(source).forEach(key => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        // For arrays, you might want to replace the target array with the source array
        // to prioritize the loadedState. Alternatively, you could concatenate them as shown here.
        target[key] = [...targetValue, ...sourceValue];
      } else if (typeof targetValue === 'object' && targetValue !== null && typeof sourceValue === 'object' && sourceValue !== null) {
        // When both values are objects, merge them recursively
        target[key] = _deepMerge({ ...targetValue }, sourceValue);
      } else {
        // If there's a conflict (or the key exists only in source), prioritize the source value
        target[key] = sourceValue;
      }
    });

    Object.keys(target).forEach(key => {
      if (!source.hasOwnProperty(key)) {
        target[key] = target[key];
      }
    });

    return target;
  };

  const _localStorageEnhancer = (StoreClass) => {
    return (initialState, options) => {
      const storeName = options?.name || 'default-store';
      const shouldLoad = options?.load !== false;
      const defaultExpiry = 24 * 60 * 60 * 1000;
      const expiry = options?.expiry !== undefined ? options.expiry : defaultExpiry;
      const store = new StoreClass(initialState);

      store.init = () => {
        if (shouldLoad) {
          const storedState = localStorage.getItem(storeName);
          const storedExpiry = localStorage.getItem(`${storeName}-expiry`);
          const currentTime = new Date().getTime();

          if (storedState && storedExpiry) {
            const isExpired = currentTime >= parseInt(storedExpiry, 10);
            if (!isExpired) {
              const loadedState = JSON.parse(storedState);
              store.state = _deepMerge(initialState, loadedState);
            } else {
              localStorage.removeItem(storeName);
              localStorage.removeItem(`${storeName}-expiry`);
            }
          }
        }
      };

      store.init();

      store.reset = () => {
        localStorage.removeItem(storeName);
        localStorage.removeItem(`${storeName}-expiry`);

        store.state = initialState;

        store.__observers.forEach(observer => observer.next(store.state));
      };

      store.subscribe((state) => {
        const currentTime = new Date().getTime();
        const expiryTime = currentTime + expiry;

        localStorage.setItem(storeName, JSON.stringify(state));
        localStorage.setItem(`${storeName}-expiry`, expiryTime.toString());
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
