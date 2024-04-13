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

    if (oldState !== newState) {
      if (__config.events.isEnabled && typeof window !== 'undefined') {
        const event = new CustomEvent('cami:store:change', {
          detail: {
            action: action,
            oldValue: oldState,
            newValue: newState
          }
        });
        window.dispatchEvent(event);
      }

      __trace('cami:store:change', action, oldState, newState);
    }
  }
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

export { ObservableStore, store };
