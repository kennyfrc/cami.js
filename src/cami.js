/**
 * @license
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */
/**
 * @module cami
 * @requires 'lit-html'
 * @requires 'immer'
 */
import { html, render } from 'lit-html';
import { produce } from "immer"
import { ObservableStore } from './observables/observable-store.js';
import { Observable } from './observables/observable.js';
import { ObservableState, computed, effect } from './observables/observable-state.js';
import { ObservableStream } from './observables/observable-stream.js';
import { ObservableElement } from './observables/observable-element.js';
import { _config } from './config.js';
import { _trace } from './trace.js';
import { http } from './http.js';


const QueryCache = new Map();

/**
 * @typedef {Object} State
 * @property {any} [property] - Any property of the state
 */

/**
 * @class
 * @extends {HTMLElement}
 * This class is needed to create reactive web components that can automatically update their view when their state changes.
 */
class ReactiveElement extends HTMLElement {
  /**
   * @constructor
   */
  constructor() {
    super();
    /** @type {Map<string, Function>} */
    this._unsubscribers = new Map();
    /** @type {Array<Function>} */
    this._effects = [];

    /**
     * @method
     * @description This method binds the computed function from observable.js to the current context
     * @returns {ComputedObservable} A new instance of ComputedObservable
     */
    this.computed = computed.bind(this);

    /**
     * @method
     * @description This method binds the effect function from observable.js to the current context
     * @returns {void}
     */
    this.effect = effect.bind(this);

    this._queryFunctions = new Map();
    this._pendingObservableUpdates = new Set();
  }
  /**
   * @method
   * @description Checks if the provided value is an object or an array
   * @param {any} value - The value to check
   * @returns {boolean} True if the value is an object or an array, false otherwise
   */
  _isObjectOrArray(value) {
    return value !== null && (typeof value === 'object' || Array.isArray(value));
  }

  /**
   * @method
   * @description Handles the case when the provided value is an object or an array
   * @param {Object} context - The context in which the property is defined
   * @param {string} key - The property key
   * @param {Observable} observable - The observable to bind to the property
   * @param {boolean} [isAttribute=false] - Whether the property is an attribute
   * @returns {void}
   */
  _handleObjectOrArray(context, key, observable, isAttribute = false) {
    if (!(observable instanceof ObservableState)) {
      throw new TypeError('Expected observable to be an instance of ObservableState');
    }

    const proxy = this._observableProxy(observable);
    Object.defineProperty(context, key, {
      get: () => proxy,
      set: newValue => {
        observable.update(() => newValue);
        if (isAttribute) {
          this.setAttribute(key, newValue);
        }
      }
    });
  }

  /**
   * @method
   * @description Handles the case when the provided value is not an object or an array
   * @param {Object} context - The context in which the property is defined
   * @param {string} key - The property key
   * @param {Observable} observable - The observable to bind to the property
   * @param {boolean} [isAttribute=false] - Whether the property is an attribute
   * @returns {void}
   */
  _handleNonObject(context, key, observable, isAttribute = false) {
    if (!(observable instanceof ObservableState)) {
      throw new TypeError('Expected observable to be an instance of ObservableState');
    }

    Object.defineProperty(context, key, {
      get: () => observable.value,
      set: newValue => {
        observable.update(() => newValue);
        if (isAttribute) {
          this.setAttribute(key, newValue);
        }
      }
    });
  }

  /**
   * @method
   * @description Creates a proxy for the observable
   * @param {Observable} observable - The observable to create a proxy for
   * @returns {Proxy} The created proxy
   */
  _observableProxy(observable) {
    if (!(observable instanceof ObservableState)) {
      throw new TypeError('Expected observable to be an instance of ObservableState');
    }

    return new Proxy(observable, {
      get: (target, property) => {
        // If the property is a function, bind it to the target
        // Example: this.playlist.push(song) in _012_playlist.html
        if (typeof target[property] === 'function') {
          return target[property].bind(target);
        }
        // If the property exists in the target, return it
        // Example: this.user.name in _005_nested1.html
        else if (property in target) {
          return target[property];
        }
        // If the property is a function of the target's value, return it
        // Example: this.playlist.sort() in _012_playlist.html
        else if (typeof target.value[property] === 'function') {
          return (...args) => target.value[property](...args);
        }
        // Otherwise, return the property of the target's value
        // Example: this.user.age in _005_nested1.html
        else {
          return target.value[property];
        }
      },
      set: (target, property, value) => {
        // Set the property value and update the target
        // Example: this.user.assign({ [key]: event.target.value }) in _005_nested1.html
        target[property] = value;
        target.update(() => target.value);
        return true;
      }
    });
  }

  /**
   * @method
   * @description Defines the observables, computed properties, effects, and attributes for the element
   * @param {Object} config - The configuration object
   * @returns {void}
   */
  setup(config) {
    if (config.infer === true) {
      config.infer = ['observables', 'computed'];
    }

    if (config.infer) {
      config.infer.forEach(type => {
        if (type === 'observables') {
          Object.keys(this).forEach(key => {
            if (typeof this[key] !== 'function' && !key.startsWith('_')) {
              if (this[key] instanceof Observable) {
                return;
              } else {
                const observable = this.observable(this[key], key);
                if (this._isObjectOrArray(observable.value)) {
                  this._handleObjectOrArray(this, key, observable);
                } else {
                  this._handleNonObject(this, key, observable);
                }
              }
            }
          });
        } else if (type === 'computed') {
          Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(key => {
              const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), key);
              return descriptor && typeof descriptor.get === 'function';
            })
            .forEach(key => {
              const descriptor = Object.getOwnPropertyDescriptor(this, key);
              if (descriptor && typeof descriptor.get === 'function') {
                Object.defineProperty(this, key, {
                  get: () => this.computed(descriptor.get).value
                });
              }
            });
        }
      });
    }
    if (config.observables) {
      config.observables.forEach(key => {
        if (this[key] instanceof Observable) {
          return;
        }
        const observable = this.observable(this[key], key);
        if (this._isObjectOrArray(observable.value)) {
          this._handleObjectOrArray(this, key, observable);
        } else {
          this._handleNonObject(this, key, observable);
        }
      });
    }
    if (config.computed) {
      config.computed.forEach(key => {
        if (typeof key === 'string') {
          const descriptor = Object.getOwnPropertyDescriptor(this, key);
          if (descriptor && typeof descriptor.get === 'function') {
            Object.defineProperty(this, key, {
              get: () => this.computed(descriptor.get).value
            });
          }
        } else if (typeof key === 'object' && typeof key.get === 'function') {
          Object.defineProperty(this, key.name, {
            get: () => this.computed(key.get).value
          });
        }
      });
    }
    if (config.effects) {
      config.effects.forEach(effectFn => {
        this.effect(effectFn);
      });
    }
    if (config.attributes) {
      Object.entries(config.attributes).forEach(([attr, parseFn]) => {
        const observableAttr = typeof parseFn === 'function'
          ? this.observableAttr(attr, parseFn)
          : this.observableAttr(attr);

        if (this._isObjectOrArray(observableAttr.value)) {
          this._handleObjectOrArray(this, attr, observableAttr, true);
        } else {
          this._handleNonObject(this, attr, observableAttr, true);
        }
      });
    }
  }

  /**
   * @method
   * @description Creates an observable with an initial value
   * @param {any} initialValue - The initial value for the observable
   * @param {string} [name] - The name of the observable
   * @returns {Observable} The observable
   */
  observable(initialValue, name = null) {
    if (!this._isAllowedType(initialValue)) {
      const type = Object.prototype.toString.call(initialValue);
      throw new Error(`[Cami.js] The type ${type} of initialValue is not allowed in observables.`);
    }

    const observable = new ObservableState(initialValue, (value) => {
      this.scheduleUpdate(observable);
    }, { last: true, name });

    observable.scheduleUpdate = this.scheduleUpdate.bind(this, observable);

    this.registerObservables(observable);
    return observable;
  }

  /**
   * @method
   * @description Fetches data from an API and caches it. This method is based on the TanStack Query defaults: https://tanstack.com/query/latest/docs/react/guides/important-defaults
   * @param {Object} options - The options for the query
   * @param {Array} options.queryKey - The key for the query
   * @param {Function} options.queryFn - The function to fetch data
   * @param {number} [options.staleTime=0] - The stale time for the query
   * @param {boolean} [options.refetchOnWindowFocus=true] - Whether to refetch on window focus
   * @param {boolean} [options.refetchOnMount=true] - Whether to refetch on mount
   * @param {boolean} [options.refetchOnReconnect=true] - Whether to refetch on network reconnect
   * @param {number} [options.refetchInterval=null] - The interval to refetch data
   * @param {number} [options.gcTime=1000 * 60 * 5] - The garbage collection time for the query
   * @param {number} [options.retry=3] - The number of retry attempts
   * @param {Function} [options.retryDelay=(attempt) => Math.pow(2, attempt) * 1000] - The delay before retrying a failed query
   * @returns {Proxy} A proxy that contains the state of the query
   */
  query({ queryKey, queryFn, staleTime = 0, refetchOnWindowFocus = true, refetchOnMount = true, refetchOnReconnect = true, refetchInterval = null, gcTime = 1000 * 60 * 5, retry = 3, retryDelay = (attempt) => Math.pow(2, attempt) * 1000 }) {
    const key = Array.isArray(queryKey)
    ? queryKey.map(k => typeof k === 'object' ? JSON.stringify(k) : k).join(':')
    : queryKey;
    this._queryFunctions.set(key, queryFn);

    _trace('query', 'Starting query with key:', key);

    const queryState = this.observable({
      data: null,
      status: 'pending',
      fetchStatus: 'idle',
      error: null,
      lastUpdated: QueryCache.has(key) ? QueryCache.get(key).lastUpdated : null
    }, key);

    const queryProxy = this._observableProxy(queryState);

    const fetchData = async (attempt = 0) => {
      const now = Date.now();
      const cacheEntry = QueryCache.get(key);

      if (cacheEntry && (now - cacheEntry.lastUpdated) < staleTime) {
        _trace('fetchData (if)', 'Using cached data for key:', key);
        queryState.update(state => {
          state.data = cacheEntry.data;
          state.status = 'success';
          state.fetchStatus = 'idle';
        });
      } else {
        _trace('fetchData (else)', 'Fetching data for key:', key);
        try {
          queryState.update(state => {
            state.status = 'pending';
            state.fetchStatus = 'fetching';
          });
          const data = await queryFn();
          QueryCache.set(key, { data, lastUpdated: now });
          queryState.update(state => {
            state.data = data;
            state.status = 'success';
            state.fetchStatus = 'idle';
          });
        } catch (error) {
          _trace('fetchData (catch)', 'Fetch error for key:', key, error);
          if (attempt < retry) {
            setTimeout(() => fetchData(attempt + 1), retryDelay(attempt));
          } else {
            queryState.update(state => {
              state.error = { message: error.message };
              state.status = 'error';
              state.fetchStatus = 'idle';
            });
          }
        }
      }
    };

    // Refetch data when new instances of the query mount
    if (refetchOnMount) {
      _trace('query', 'Setting up refetch on mount for key:', key);
      fetchData();
    }

    // Refetch data when window is refocused
    if (refetchOnWindowFocus) {
      _trace('query', 'Setting up refetch on window focus for key:', key);
      const refetchOnFocus = () => fetchData();
      window.addEventListener('focus', refetchOnFocus);
      this._unsubscribers.set(`focus:${key}`, () => window.removeEventListener('focus', refetchOnFocus));
    }

    // Refetch data when network is reconnected
    if (refetchOnReconnect) {
      _trace('query', 'Setting up refetch on reconnect for key:', key);
      window.addEventListener('online', fetchData);
      this._unsubscribers.set(`online:${key}`, () => window.removeEventListener('online', fetchData));
    }

    // Refetch data at a specific interval
    if (refetchInterval) {
      _trace('query', 'Setting up refetch interval for key:', key);
      const intervalId = setInterval(fetchData, refetchInterval);
      this._unsubscribers.set(`interval:${key}`, () => clearInterval(intervalId));
    }

    // Garbage collect data after gcTime
    const gcTimeout = setTimeout(() => {
      QueryCache.delete(key);
    }, gcTime);
    this._unsubscribers.set(`gc:${key}`, () => clearTimeout(gcTimeout));

    return queryProxy;
  }

  /**
   * @method
   * @description Performs a mutation and returns an observable proxy. This method is inspired by the TanStack Query mutate method: https://tanstack.com/query/latest/docs/react/guides/mutations
   * @param {Object} options - The options for the mutation
   * @param {Function} options.mutationFn - The function to perform the mutation
   * @param {Function} [options.onMutate] - The function to be called before the mutation is performed
   * @param {Function} [options.onError] - The function to be called if the mutation encounters an error
   * @param {Function} [options.onSuccess] - The function to be called if the mutation is successful
   * @param {Function} [options.onSettled] - The function to be called after the mutation has either succeeded or failed
   * @returns {Proxy} A proxy that contains the state of the mutation
   */
  mutation({ mutationFn, onMutate, onError, onSuccess, onSettled }) {
    const mutationState = this.observable({
      data: null,
      status: 'idle',
      error: null,
      isSettled: false
    }, 'mutation');

    const mutationProxy = this._observableProxy(mutationState);

    const performMutation = async (variables) => {
      _trace('mutation', 'Starting mutation for variables:', variables);
      let context;
      // Capture the current state before the mutation
      const previousState = mutationState.value; // Access the current state directly

      if (onMutate) {
        _trace('mutation', 'Performing optimistic update for variables:', variables);
        // Perform any optimistic updates required and capture rollback context
        context = onMutate(variables, previousState);
        // Update the state optimistically
        mutationState.update(state => {
          state.data = context.optimisticData;
          state.status = 'pending';
          state.error = null;
        });
      }

      try {
        const data = await mutationFn(variables);
        mutationState.update(state => {
          state.data = data;
          state.status = 'success';
        });
        if (onSuccess) {
          onSuccess(data, variables, context);
        }
        _trace('mutation', 'Mutation successful for variables:', variables, data);
      } catch (error) {
        _trace('mutation', 'Mutation error for variables:', variables, error);
        mutationState.update(state => {
          state.error = { message: error.message };
          state.status = 'error';
          // Rollback to previous state if onError is not provided
          if (!onError && context && context.rollback) {
            _trace('mutation', 'Rolling back mutation for variables:', variables);
            context.rollback();
          }
        });
        if (onError) {
          onError(error, variables, context);
        }
      } finally {
        if (!mutationState.value.isSettled) {
          mutationState.update(state => {
            state.isSettled = true; // Set the flag to true
          });
          if (onSettled) {
            _trace('mutation', 'Calling onSettled for variables:', variables);
            onSettled(mutationState.value.data, mutationState.value.error, variables, context);
          }
        }
      }
    };

    mutationProxy.mutate = performMutation;

    return mutationProxy;
  }

  /**
   * Invalidates the queries with the given key, causing them to refetch if needed.
   * @param {Array|string} queryKey - The key for the query to invalidate.
   */
  invalidateQueries(queryKey) {

    // Convert the queryKey to a string if it's an array for consistency with the cache keys
    const key = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
    _trace('invalidateQueries', 'Invalidating query with key:', key);

    // Remove the query from the cache
    QueryCache.delete(key);

    // Trigger a refetch for the invalidated query
    this.refetchQuery(key);
  }

  /**
   * Refetches the data for the given query key.
   * @param {string} key - The key for the query to refetch.
   */
  refetchQuery(key) {
    _trace('refetchQuery', 'Refetching query with key:', key);
    // Find the query function associated with the key
    const queryFn = this._queryFunctions.get(key);

    if (queryFn) {
      _trace('refetchQuery', 'Found query function for key:', key);
      // Snapshot the previous state before the optimistic update
      const previousState = QueryCache.get(key) || { data: undefined, status: 'idle', error: null };

      // Optimistically update the UI assuming the fetch will succeed
      QueryCache.set(key, {
        ...previousState,
        status: 'pending',
        error: null,
      });

      // Trigger the refetch
      queryFn().then(data => {
        // Update the QueryCache with the new data
        QueryCache.set(key, {
          data: data,
          status: 'success',
          error: null,
          lastUpdated: Date.now(),
        });
        cosole.log('refetchQuery', 'Refetch successful for key:', key, data);
      }).catch(error => {
        // Rollback to the previous state in case of an error
        if (previousState.data !== undefined) {
          _trace('refetchQuery', 'Rolling back refetch for key:', key);
          QueryCache.set(key, previousState);
        }

        // Additionally, handle the error state
        QueryCache.set(key, {
          ...previousState,
          status: 'error',
          error: error,
        });
      }).finally(() => {
        // Refetch the data to ensure the UI is in sync with the server state
        this.query({ queryKey: key, queryFn: queryFn });
        _trace('refetchQuery', 'Refetch complete for key:', key);
      });
    }
  }

  /**
   * @method
   * @description Checks if the provided value is of an allowed type
   * @param {any} value - The value to check
   * @returns {boolean} True if the value is of an allowed type, false otherwise
   */
  _isAllowedType(value) {
    const allowedTypes = ['number', 'string', 'boolean', 'object', 'undefined'];
    const valueType = typeof value;

    if (valueType === 'object') {
      return value === null || Array.isArray(value) || this._isPlainObject(value);
    }

    return allowedTypes.includes(valueType);
  }

  /**
   * @method
   * @description Checks if the provided value is a plain object
   * @param {any} value - The value to check
   * @returns {boolean} True if the value is a plain object, false otherwise
   */
  _isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
  }

  /**
   * @method
   * @description Creates an observable property from an attribute
   * @param {string} attrName - The name of the attribute
   * @param {Function} [parseFn=(v) => v] - The function to parse the attribute value
   * @returns {Observable} The observable
   */
  observableAttr(attrName, parseFn = (v) => v) {
    let attrValue = this.getAttribute(attrName);
    attrValue = produce(attrValue, parseFn);
    return this.observable(attrValue, attrName);
  }

  /**
   * @method
   * @description Sets the properties of the object. If the property is an observable, it updates the observable with the new value
   * @param {Object} props - The properties to set
   * @returns {void}
   */
  setObservables(props) {
    Object.keys(props).forEach(key => {
      if (this[key] instanceof Observable) {
        this[key].next(props[key]);
      }
    });
  }

  /**
   * @method
   * @description Registers an observable state to the list of unsubscribers
   * @param {ObservableState} observableState - The observable state to register
   * @returns {void}
   */
  registerObservables(observableState) {
    if (!(observableState instanceof ObservableState)) {
      throw new TypeError('Expected observableState to be an instance of ObservableState');
    }

    this._unsubscribers.set(observableState, () => observableState.dispose());
  }

  /**
   * @method
   * @description Creates a computed observable state and registers it
   * @param {Function} computeFn - The function to compute the state
   * @returns {ObservableState} The computed observable state
   */
  computed(computeFn) {
    const observableState = super.computed(computeFn);
    this.registerObservables(observableState);
    return observableState;
  }

  /**
   * @method
   * @description Creates an effect and registers its dispose function
   * @param {Function} effectFn - The function to create the effect
   * @returns {void}
   */
  effect(effectFn) {
    const dispose = super.effect(effectFn);
    this._unsubscribers.set(effectFn, dispose);
  }

  /**
   * @method
   * @description Subscribes to a store and creates an observable for a specific key in the store
   * @param {Store} store - The store to subscribe to
   * @param {string} key - The key in the store to create an observable for
   * @returns {Observable|Proxy} The observable or a proxy for the observable
   */
  connect(store, key) {
    if (!(store instanceof ObservableStore)) {
      throw new TypeError('Expected store to be an instance of ObservableStore');
    }

    const observable = this.observable(store.state[key], key);
    const unsubscribe = store.subscribe(newState => {
      observable.update(() => newState[key]);
    });
    this._unsubscribers.set(key, unsubscribe);

    if (this._isObjectOrArray(observable.value)) {
      return this._observableProxy(observable);
    } else {
      return new Proxy(observable, {
        get: () => observable.value,
        set: (target, property, value) => {
          if (property === 'value') {
            observable.update(() => value);
          } else {
            target[property] = value;
          }
          return true;
        }
      });
    }
  }

  /**
   * @method
   * Invoked when the custom element is appended into a document-connected element. Sets up initial state and triggers initial rendering.
   * @returns {void}
   */
  connectedCallback() {
    this.react();
  }

  /**
   * @method
   * Invoked when the custom element is disconnected from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    this._unsubscribers.forEach(unsubscribe => unsubscribe());
    this._effects.forEach(({ cleanup }) => cleanup && cleanup());
  }

  _processUpdates() {
    this._pendingObservableUpdates.forEach(observable => observable._applyUpdates());
    this._pendingObservableUpdates.clear();
    this._updateScheduled = false;
    this.react();
  }

  scheduleUpdate(observable) {
    this._pendingObservableUpdates.add(observable);
    if (!this._updateScheduled) {
      this._updateScheduled = true;
      requestAnimationFrame(() => this._processUpdates());
    }
  }

  /**
   * @method
   * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
   * This also triggers all effects.
   * @returns {void}
   */
  react() {
    const template = this.template();
    render(template, this);
    this._effects.forEach(({ effectFn }) => effectFn.call(this));
  }

  /**
   * @method
   * @throws {Error} If the method template() is not implemented
   * @returns {void}
   */
  template() {
    throw new Error('[Cami.js] You have to implement the method template()!');
  }
}

/**
 * @function
 * @param {string} elementName - The name of the custom element
 * @param {class} ElementClass - The class of the custom element
 * @returns {void}
 *
 * This function is necessary to avoid DOMException errors that occur when a custom element is defined more than once (which happens when using AJAX)
 * This is particularly useful when using libraries like HTMX that dynamically inject HTML into the page.
 */
function define(elementName, ElementClass) {
  if (!customElements.get(elementName)) {
    customElements.define(elementName, ElementClass);
  }
}

/**
 * @function
 * @param {Object} initialState - The initial state of the store
 * @returns {ObservableStore} A new instance of ObservableStore with the provided initial state
 * @description This function creates a new instance of ObservableStore with the provided initial state
 */
function store(initialState) {
  return new ObservableStore(initialState);
}

/**
 * @exports store
 * @exports html
 * @exports ReactiveElement
 * @exports define
 * @exports ObservableStream
 * @exports ObservableElement
 * @exports Observable
 * @exports ObservableState
 */
const { debug, events } = _config;
export { store, html, ReactiveElement, define, ObservableStream, ObservableElement, Observable, ObservableState, ObservableStore, http, debug, events };
