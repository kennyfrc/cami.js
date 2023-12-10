import { html, render as _litRender } from 'lit-html';
import { produce } from "immer"
import { Observable } from './observables/observable.js';
import { ObservableStore } from './observables/observable-store.js';
import { ObservableState, computed, effect } from './observables/observable-state.js';
import { ObservableStream } from './observables/observable-stream.js';
import { _trace } from './trace.js';

/**
 * @typedef ObservableProperty
 * @property {function(): any} get - A getter function that returns the current value of the property. If the property is a primitive value, this will return the value directly from the ObservableState instance. If the property is a non-primitive value, this will return an ObservableProxy that wraps the ObservableState instance. This getter is used when accessing the property on a ReactiveElement instance. This polymorphic behavior allows the ObservableProperty to handle both primitive and non-primitive values, and handle nested properties (only proxies can handle nested properties, whereas getters/setter traps cannot)
 * @property {function(any): void} set - A setter function that updates the value of the property. It updates the ObservableState instance with the new value. This setter is used when assigning a new value to the property on a ReactiveElement instance.
 * @example
 * // Primitive value example from _001_counter.html
 * // this.count is an ObservableProperty, where if you get the value, it returns the current value of the property, and if you set the value, it updates the property with the new value
 * // ObservableProperty is just Object.defineProperty with a getter and setter, where the Object is the ReactiveElement instance
 * class CounterElement extends ReactiveElement {
 *   count = 0
 *
 *   template() {
 *     return html`
 *       <button @click=${() => this.count--}>-</button>
 *       <button @click=${() => this.count++}>+</button>
 *       <div>Count: ${this.count}</div>
 *     `;
 *   }
 * }
 *
 * // Non-primitive value example from _003_todo.html
 * // this.query returns an ObservableProperty / ObservableProxy
 * // this.todos is an ObservableProxy, where if you get the value, it returns the current value of the property, and if you set the value, it updates the property with the new value
 * // We use Proxy instead of Object.defineProperty because it allows us to handle nested properties
 * class TodoListElement extends ReactiveElement {
 *   todos = this.query({
 *     queryKey: ['todos'],
 *     queryFn: () => {
 *       return fetch("https://api.camijs.com/todos?_limit=5").then(res => res.json())
 *     },
 *     staleTime: 1000 * 60 * 5 // 5 minutes
 *   })
 *
 *   template() {
 *     // ...template code...
 *   }
 * }
 *
 * // Array value example from _010_taskmgmt.html
 * // this.tasks is an ObservableProxy, where if you get the value, it returns the current value of the property, and if you set the value, it updates the property with the new value
 * // We use Proxy instead of Object.defineProperty because it allows us to handle nested properties
 * class TaskManagerElement extends ReactiveElement {
 *   tasks = [];
 *   filter = 'all';
 *
 *   // ...other methods...
 *
 *   template() {
 *     // ...template code...
 *   }
 * }
 */

/**
 * @typedef ObservableState
 * @property {any} value - The current value of the observable state. This is the value that is returned when accessing a primitive property on a ReactiveElement instance. It can also be used to set a new value for the observable state.
 * @property {function(function(any): any): void} update - A function that updates the value of the observable state. It takes an updater function that receives the current value and returns the new value. This is used when assigning a new value to a primitive property on a ReactiveElement instance. It allows deeply nested updates.
 * @property {function(): void} [dispose] - An optional function that cleans up the observable state when it is no longer needed. This is used internally by ReactiveElement to manage memory.
 */

/**
 * @typedef ObservableProxy
 * @property {function(): any} get - A getter function that returns the current value of the property. If the property is a primitive value, this will return the value directly from the ObservableState instance. If the property is a non-primitive value, this will return an ObservableProxy that wraps the ObservableState instance. This getter is used when accessing a non-primitive property on a ReactiveElement instance. We use Proxy instead of Object.defineProperty because it allows us to handle nested properties.
 * @property {function(any): void} set - A setter function that updates the value of the property. It updates the ObservableState instance with the new value. This setter is used when assigning a new value to a non-primitive property on a ReactiveElement instance.
 */

/**
 * @private
 * @description A cache for storing the results of queries.
 * @type {Map<string, any>}
 */
const QueryCache = new Map();

/**
 * @class
 * @description This class is needed to create reactive web components that can automatically update their view when their state changes. All properties are automatically converted to observables. This is achieved by using creating an ObservableProperty, which provides a getter and setter for the property. The getter returns the current value of the property, and the setter updates the value of the property and triggers a re-render of the component.
 * @example
 * ```javascript
 * const { html, ReactiveElement } = cami;
 *
 * class CounterElement extends ReactiveElement {
 *   // Here, 'count' is automatically initialized as an ObservableProperty.
 *   // This means that any changes to 'count' will automatically trigger a re-render of the component.
 *   count = 0
 *
 *   template() {
 *     return html`
 *       <button @click=${() => this.count--}>-</button>
 *       <button @click=${() => this.count++}>+</button>
 *       <div>Count: ${this.count}</div>
 *     `;
 *   }
 * }
 *
 * customElements.define('counter-component', CounterElement);
 * ```
 */
class ReactiveElement extends HTMLElement {
  /**
   * @constructor
   * @description Constructs a new instance of ReactiveElement.
   */
  constructor() {
    super();
    this.onCreate();
    this._unsubscribers = new Map();
    this._computed = computed.bind(this);
    this.effect = effect.bind(this);
    this._queryFunctions = new Map();
  }

  /**
   * @method
   * @description Creates ObservableProperty or ObservableProxy instances for all properties in the provided object.
   * @param {Object} attributes - An object with attribute names as keys and optional parsing functions as values.
   * @example
   * // In _009_dataFromProps.html, the todos attribute is parsed as JSON and the data property is extracted:
   * this.observableAttributes({
   *   todos: (v) => JSON.parse(v).data
   * });
   * @returns {void}
   */
  observableAttributes(attributes) {
    Object.entries(attributes).forEach(([attrName, parseFn]) => {
      // Retrieve the attribute value and apply the transformation function if provided
      let attrValue = this.getAttribute(attrName);
      const transformFn = typeof parseFn === 'function' ? parseFn : (v) => v;
      attrValue = produce(attrValue, transformFn);

      // Create an ObservableProperty or ObservableProxy for the attribute
      const observable = this._observable(attrValue, attrName);
      if (this._isObjectOrArray(observable.value)) {
        this._createObservablePropertyForObjOrArr(this, attrName, observable, true);
      } else {
        this._createObservablePropertyForPrimitive(this, attrName, observable, true);
      }
    });
  }

  /**
   * @private
   * @method
   * @description Creates a computed observable state and registers it. The computed state is recalculated whenever
   * one of its dependencies changes. This is useful for creating derived state that automatically updates.
   *
   * @example
   * // Assuming `this.count` is an observable
   * const countSquared = this._computed(() => this.count * this.count);
   * // `countSquared` will automatically update when `this.count` changes
   *
   * @param {Function} computeFn - The function to compute the state
   * @returns {ObservableState} The computed observable state
   */
  _computed(computeFn) {
    const observableState = super._computed(computeFn);
    console.log(observableState);
    this._registerObservables(observableState);
    return observableState;
  }

  /**
   * @method
   * @description Creates an effect and registers its dispose function. The effect is used to perform side effects in response to state changes.
   * This method is useful when working with ObservableProperties or ObservableProxies because it triggers the effect whenever the value of the underlying ObservableState changes.
   * @example
   * // Assuming `this.count` is an ObservableProperty
   * this.effect(() => {
   *   console.log(`The count is now: ${this.count}`);
   * });
   * // The console will log the current count whenever `this.count` changes
   *
   * @param {Function} effectFn - The function to create the effect
   * @returns {void}
   */
  effect(effectFn) {
    const dispose = super.effect(effectFn);
    this._unsubscribers.set(effectFn, dispose);
  }

  /**
   * @method
   * @description Subscribes to a store and creates an observable for a specific key in the store. This is useful for
   * synchronizing the component's state with a global store.
   *
   * @example
   * // Assuming there is a store for cart items
   * // `cartItems` will be an observable reflecting the current state of cart items in the store
   * this.cartItems = this.connect(CartStore, 'cartItems');
   *
   * @param {ObservableStore} store - The store to subscribe to
   * @param {string} key - The key in the store to create an observable for
   * @returns {ObservableProxy} An observable property or proxy for the store key
   */
  connect(store, key) {
    if (!(store instanceof ObservableStore)) {
      throw new TypeError('Expected store to be an instance of ObservableStore');
    }

    const observable = this._observable(store.state[key], key);
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
   * @description Creates an ObservableStream from a subscription function.
   * @param {Function} subscribeFn - The subscription function.
   * @returns {ObservableStream} An ObservableStream that emits values produced by the subscription function.
   * @example
   * // In a FormElement component
   * const inputValidation$ = this.stream();
   * inputValidation$
   *   .map(e => this.validateEmail(e.target.value))
   *   .debounce(300)
   *   .subscribe(({ isEmailValid, emailError, email }) => {
   *     this.emailError = emailError;
   *     this.isEmailValid = isEmailValid;
   *     this.email = email;
   *     this.isEmailAvailable = this.queryEmail(this.email);
   *   });
   */
  stream(subscribeFn) {
    return new ObservableStream(subscribeFn);
  }

  /**
   * @method
   * @throws {Error} If the method template() is not implemented
   * @returns {void}
   * @example
   * // Here's a simple example of a template method implementation
   * template() {
   *   return html`<div>Hello World</div>`;
   * }
   */
  template() {
    throw new Error('[Cami.js] You have to implement the method template()!');
  }

  /**
   * @method
   * @description Fetches data from an API and caches it. This method is based on the TanStack Query defaults: https://tanstack.com/query/latest/docs/react/guides/important-defaults.
   * @param {Object} options - The options for the query.
   * @param {Array|string} options.queryKey - The key for the query.
   * @param {Function} options.queryFn - The function to fetch data.
   * @param {number} [options.staleTime=0] - The stale time for the query.
   * @param {boolean} [options.refetchOnWindowFocus=true] - Whether to refetch on window focus.
   * @param {boolean} [options.refetchOnMount=true] - Whether to refetch on mount.
   * @param {boolean} [options.refetchOnReconnect=true] - Whether to refetch on network reconnect.
   * @param {number} [options.refetchInterval=null] - The interval to refetch data.
   * @param {number} [options.gcTime=1000 * 60 * 5] - The garbage collection time for the query.
   * @param {number} [options.retry=3] - The number of retry attempts.
   * @param {Function} [options.retryDelay=(attempt) => Math.pow(2, attempt) * 1000] - The delay before retrying a failed query.
   * @example
   * // In _012_blog.html, a query is set up to fetch posts with a stale time of 5 minutes:
   * const posts = this.query({
   *   queryKey: ["posts"],
   *   queryFn: () => fetch("https://api.camijs.com/posts?_limit=5").then(res => res.json()),
   *   staleTime: 1000 * 60 * 5
   * });
   * @returns {ObservableProxy} A proxy that contains the state of the query.
   */
  query({ queryKey, queryFn, staleTime = 0, refetchOnWindowFocus = true, refetchOnMount = true, refetchOnReconnect = true, refetchInterval = null, gcTime = 1000 * 60 * 5, retry = 3, retryDelay = (attempt) => Math.pow(2, attempt) * 1000 }) {
    const key = Array.isArray(queryKey)
    ? queryKey.map(k => typeof k === 'object' ? JSON.stringify(k) : k).join(':')
    : queryKey;
    this._queryFunctions.set(key, queryFn);

    _trace('query', 'Starting query with key:', key);

    const queryState = this._observable({
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
    }

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
   * @description Performs a mutation and returns an observable proxy. This method is inspired by the TanStack Query mutate method: https://tanstack.com/query/latest/docs/react/guides/mutations.
   * @param {Object} options - The options for the mutation.
   * @param {Function} options.mutationFn - The function to perform the mutation.
   * @param {Function} [options.onMutate] - The function to be called before the mutation is performed.
   * @param {Function} [options.onError] - The function to be called if the mutation encounters an error.
   * @param {Function} [options.onSuccess] - The function to be called if the mutation is successful.
   * @param {Function} [options.onSettled] - The function to be called after the mutation has either succeeded or failed.
   * @example
   * // In _012_blog.html, a mutation is set up to add a new post with optimistic UI updates:
   * const addPost = this.mutation({
   *   mutationFn: (newPost) => fetch("https://api.camijs.com/posts", {
   *     method: "POST",
   *     body: JSON.stringify(newPost),
   *     headers: {
   *       "Content-type": "application/json; charset=UTF-8"
   *     }
   *   }).then(res => res.json()),
   *   onMutate: (newPost) => {
   *     // Snapshot the previous state
   *     const previousPosts = this.posts.data;
   *     // Optimistically update to the new value
   *     this.posts.update(state => {
   *       state.data.push({ ...newPost, id: Date.now() });
   *     });
   *     // Return the rollback function and the new post
   *     return {
   *       rollback: () => {
   *         this.posts.update(state => {
   *           state.data = previousPosts;
   *         });
   *       },
   *       optimisticPost: newPost
   *     };
   *   }
   * });
   * @returns {ObservableProxy} A proxy that contains the state of the mutation.
   */
  mutation({ mutationFn, onMutate, onError, onSuccess, onSettled }) {
    const mutationState = this._observable({
      data: null,
      status: 'idle',
      error: null,
      isSettled: false
    }, 'mutation');

    const mutationProxy = this._observableProxy(mutationState);

    const performMutation = async (variables) => {
      _trace('mutation', 'Starting mutation for variables:', variables);
      let context;
      const previousState = mutationState.value;

      if (onMutate) {
        _trace('mutation', 'Performing optimistic update for variables:', variables);
        context = onMutate(variables, previousState);
        mutationState.update(state => {
          state.data = context.optimisticData;
          state.status = 'pending';
          state.error = null;
        });
      } else {
        _trace('mutation', 'Performing mutation without optimistic update for variables:', variables);
        mutationState.update(state => {
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
            state.isSettled = true
          });
          if (onSettled) {
            _trace('mutation', 'Calling onSettled for variables:', variables);
            onSettled(mutationState.value.data, mutationState.value.error, variables, context);
          }
        }
      }
    };

    mutationProxy.mutate = performMutation;

    mutationProxy.reset = () => {
      mutationState.update(state => {
        state.data = null;
        state.status = 'idle';
        state.error = null;
        state.isSettled = false;
      });
    };

    return mutationProxy;
  }

  /**
   * @method
   * @description Invalidates the queries with the given key, causing them to refetch if needed. This method is particularly useful when used in conjunction with mutations, such as in the `onSettled` callback, to ensure that the UI reflects the latest state.
   *
   * @example
   * // In a mutation's `onSettled` callback within a `BlogComponent`:
   * this.addPost = this.mutation({
   *   // ...mutation config...
   *   onSettled: () => {
   *     // Invalidate the posts query to refetch the true state
   *     this.invalidateQueries(['posts']);
   *   }
   * });
   *
   * @param {Array|string} queryKey - The key for the query to invalidate.
   * @returns {void}
   */
  invalidateQueries(queryKey) {
    // Convert the queryKey to a string if it's an array for consistency with the cache keys
    const key = Array.isArray(queryKey) ? queryKey.join(':') : queryKey;
    _trace('invalidateQueries', 'Invalidating query with key:', key);

    QueryCache.delete(key);

    this._refetchQuery(key);
  }

  /**
   * @method
   * @description Called when the component is created. Can be overridden by subclasses to add initialization logic.
   * This method is a hook for the connectedCallback, which is invoked each time the custom element is appended into a document-connected element.
   * @returns {void}
   * @example
   * onCreate() {
   *   // Example initialization logic here
   *   this.posts = this.query({
   *     queryKey: ["posts"],
   *     queryFn: () => {
   *       return fetch("https://api.camijs.com/posts?_limit=5")
   *         .then(res => res.json())
   *     },
   *     staleTime: 1000 * 60 * 5 // 5 minutes
   *   });
   * }
   */
  onCreate() {
    // Default implementation does nothing.
    // Subclasses can override this to add initialization logic.
  }


  /**
   * @method
   * @description Invoked when the custom element is appended into a document-connected element. Sets up initial state and triggers initial rendering.
   * This is typically used to initialize component state, fetch data, and set up event listeners.
   *
   * @example
   * // In a TodoList component
   * connectedCallback() {
   *   super.connectedCallback();
   *   this.fetchTodos(); // Fetch todos when the component is added to the DOM
   * }
   * @returns {void}
   */
  connectedCallback() {
    this._setup({ infer: true });
    this.effect(() => this.render());
    this.onConnect();
  }

  /**
   * @method
   * @description Invoked when the custom element is connected to the document's DOM.
   * @returns {void}
   * Subclasses can override this to add initialization logic when the component is added to the DOM.
   *
   * @example
   * // In a UserCard component
   * onConnect() {
   *   this.showUserDetails(); // Display user details when the component is connected
   * }
   */
  onConnect() {
    // Default implementation does nothing.
  }

  /**
   * @method
   * @description Invoked when the custom element is disconnected from the document's DOM.
   * This is a good place to remove event listeners, cancel any ongoing network requests, or clean up any resources.
   * @returns {void}
   * @example
   * // In a Modal component
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   this.close(); // Close the modal when it's disconnected from the DOM
   * }
   * @returns {void}
   */
  disconnectedCallback() {
    this.onDisconnect();
    this._unsubscribers.forEach(unsubscribe => unsubscribe());
  }

  /**
   * @method
   * @description Invoked when the custom element is disconnected from the document's DOM.
   * Subclasses can override this to add cleanup logic when the component is removed from the DOM.
   * @returns {void}
   *
   * @example
   * // In a VideoPlayer component
   * onDisconnect() {
   *   this.stopPlayback(); // Stop video playback when the component is removed
   * }
   **/
  onDisconnect() {
    // Default implementation does nothing.
  }

  /**
   * @method
   * @description Invoked when an attribute of the custom element is added, removed, updated, or replaced.
   * This can be used to react to attribute changes, such as updating the component state or modifying its appearance.
   *
   * @example
   * // In a ThemeSwitcher component
   * attributeChangedCallback(name, oldValue, newValue) {
   *   super.attributeChangedCallback(name, oldValue, newValue);
   *   if (name === 'theme') {
   *     this.updateTheme(newValue); // Update the theme when the `theme` attribute changes
   *   }
   * }
   * @param {string} name - The name of the attribute that changed
   * @param {string} oldValue - The old value of the attribute
   * @param {string} newValue - The new value of the attribute
   * @returns {void}
   */
  attributeChangedCallback(name, oldValue, newValue) {
    this.onAttributeChange(name, oldValue, newValue);
  }

  /**
   * @method
   * @description Invoked when an attribute of the custom element is added, removed, updated, or replaced.
   * @returns {void}
   * Subclasses can override this to add logic that should run when an attribute changes.
   *
   * @example
   * // In a CollapsiblePanel component
   * onAttributeChange(name, oldValue, newValue) {
   *   if (name === 'collapsed') {
   *     this.toggleCollapse(newValue === 'true'); // Toggle collapse when the `collapsed` attribute changes
   *   }
   * }
   **/
  onAttributeChange(name, oldValue, newValue) {
    // Default implementation does nothing.
  }

  /**
   * @method
   * @description Invoked when the custom element is moved to a new document.
   * This can be used to update bindings or perform re-initialization as needed when the component is adopted into a new DOM context.
   * @returns {void}
   * @example
   * // In a DragDropContainer component
   * adoptedCallback() {
   *   super.adoptedCallback();
   *   this.updateDragDropContext(); // Update context when the component is moved to a new document
   * }
   * @returns {void}
   */
  adoptedCallback() {
    this.onAdopt();
  }

  /**
   * @method
   * @description Invoked when the custom element is moved to a new document.
   * Subclasses can override this to add logic that should run when the component is moved to a new document.
   * @returns {void}
   * @example
   * // In a DataGrid component
   * onAdopt() {
   *   this.refreshData(); // Refresh data when the component is adopted into a new document
   * }
   **/
  onAdopt() {
    // Default implementation does nothing.
  }

  /**
   * @private
   * @method
   * @description Checks if the provided value is an object or an array.
   * @param {any} value - The value to check.
   * @returns {boolean} True if the value is an object or an array, false otherwise.
   */
  _isObjectOrArray(value) {
    return value !== null && (typeof value === 'object' || Array.isArray(value));
  }

  /**
   * @private
   * @method
   * @description Private method. Creates an ObservableProperty for the provided key in the given context when the provided value is an object or an array.
   * @param {Object} context - The context in which the property is defined.
   * @param {string} key - The property key.
   * @param {ObservableState} observable - The observable to bind to the property.
   * @param {boolean} [isAttribute=false] - Whether the property is an attribute.
   * @throws {TypeError} If observable is not an instance of ObservableState.
   * @returns {void}
   */
  _createObservablePropertyForObjOrArr(context, key, observable, isAttribute = false) {
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
   * @private
   * @method
   * @description Private method. Handles the case when the provided value is not an object or an array.
   * This method creates an ObservableProperty for the provided key in the given context.
   * An ObservableProperty is a special type of property that can notify about changes in its state.
   * This is achieved by defining a getter and a setter for the property using Object.defineProperty.
   * The getter simply returns the current value of the observable.
   * The setter updates the observable with the new value and, if the property is an attribute, also updates the attribute.
   * @param {Object} context - The context in which the property is defined.
   * @param {string} key - The property key.
   * @param {ObservableState} observable - The observable to bind to the property.
   * @param {boolean} [isAttribute=false] - Whether the property is an attribute.
   * @throws {TypeError} If observable is not an instance of ObservableState.
   * @returns {void}
   */
  _createObservablePropertyForPrimitive(context, key, observable, isAttribute = false) {
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
   * @private
   * @method
   * @description Creates a proxy for the observable.
   * @param {ObservableState} observable - The observable for which a proxy is to be created.
   * @throws {TypeError} If observable is not an instance of ObservableState.
   * @returns {ObservableProxy} The created proxy.
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
   * @private
   * @method
   * @description Defines the observables, computed properties, effects, and attributes for the element.
   * @param {Object} config - The configuration object.
   * @returns {void}
   */
  _setup(config) {
    if (config.infer === true) {
      Object.keys(this).forEach(key => {
        if (typeof this[key] !== 'function' && !key.startsWith('_')) {
          if (this[key] instanceof Observable) {
            return;
          } else {
            const observable = this._observable(this[key], key);
            if (this._isObjectOrArray(observable.value)) {
              this._createObservablePropertyForObjOrArr(this, key, observable);
            } else {
              this._createObservablePropertyForPrimitive(this, key, observable);
            }
          }
        }
      })
    }
  }

  /**
   * @private
   * @method
   * @description Creates an observable with an initial value.
   * @param {any} initialValue - The initial value for the observable.
   * @param {string} [name] - The name of the observable.
   * @throws {Error} If the type of initialValue is not allowed in observables.
   * @returns {ObservableState} The created observable state.
   */
  _observable(initialValue, name = null) {
    if (!this._isAllowedType(initialValue)) {
      const type = Object.prototype.toString.call(initialValue);
      throw new Error(`[Cami.js] The type ${type} of initialValue is not allowed in observables.`);
    }

    const observable = new ObservableState(initialValue);

    this._registerObservables(observable);
    return observable;
  }

  /**
   * @private
   * @method
   * Refetches the data for the given query key.
   * @param {string} key - The key for the query to refetch.
   * @returns {void}
   */
  _refetchQuery(key) {
    _trace('_refetchQuery', 'Refetching query with key:', key);
    const queryFn = this._queryFunctions.get(key);

    if (queryFn) {
      _trace('_refetchQuery', 'Found query function for key:', key);
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
        QueryCache.set(key, {
          data: data,
          status: 'success',
          error: null,
          lastUpdated: Date.now(),
        });
        _trace('_refetchQuery', 'Refetch successful for key:', key, data);
      }).catch(error => {
        if (previousState.data !== undefined) {
          _trace('_refetchQuery', 'Rolling back refetch for key:', key);
          QueryCache.set(key, previousState);
        }

        QueryCache.set(key, {
          ...previousState,
          status: 'error',
          error: error,
        });
      }).finally(() => {
        this.query({ queryKey: key, queryFn: queryFn });
        _trace('_refetchQuery', 'Refetch complete for key:', key);
      });
    }
  }

  /**
   * @private
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
   * @private
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
   * @private
   * @method
   * @description Registers an observable state to the list of unsubscribers
   * @param {ObservableState} observableState - The observable state to register
   * @returns {void}
   */
  _registerObservables(observableState) {
    if (!(observableState instanceof ObservableState)) {
      throw new TypeError('Expected observableState to be an instance of ObservableState');
    }

    // Only computeds and effects have a dispose method
    this._unsubscribers.set(observableState, () => {
     if (typeof observableState.dispose === 'function') {
       observableState.dispose();
     }
   });
  }

  /**
   * @method
   * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
   * @returns {void}
   */
  render() {
    const template = this.template();
    _litRender(template, this);
  }
}

export { ReactiveElement };

