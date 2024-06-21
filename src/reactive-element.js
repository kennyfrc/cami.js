import { html, render as __litRender } from './html.js';
import { produce } from "immer";
import { Observable } from './observables/observable.js';
import { ObservableStore } from './observables/observable-store.js';
import { ObservableState, effect } from './observables/observable-state.js';
import { ObservableProxy } from './observables/observable-proxy.js';
import { __trace } from './trace.js';

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
    this.__unsubscribers = new Map();
    this.effect = effect.bind(this);
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
      const observable = this.__observable(attrValue, attrName);
      if (this.__isObjectOrArray(observable.value)) {
        this.__createObservablePropertyForObjOrArr(this, attrName, observable, true);
      } else {
        this.__createObservablePropertyForPrimitive(this, attrName, observable, true);
      }
    });
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
    this.__unsubscribers.set(effectFn, dispose);
  }

  /**
   * @method
   * @description Called when the component is created. Can be overridden by subclasses to add initialization logic.
   * This method is a hook for the connectedCallback, which is invoked each time the custom element is appended into a document-connected element.
   * @returns {void}
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
    this.__setup({ infer: true });
    this.effect(() => this.render());
    this.render();
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
    this.__unsubscribers.forEach(unsubscribe => unsubscribe());
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
  __isObjectOrArray(value) {
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
  __createObservablePropertyForObjOrArr(context, key, observable, isAttribute = false) {
    if (!(observable instanceof ObservableState)) {
      throw new TypeError('Expected observable to be an instance of ObservableState');
    }

    const proxy = this.__observableProxy(observable);
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
  __createObservablePropertyForPrimitive(context, key, observable, isAttribute = false) {
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
  __observableProxy(observable) {
    return new ObservableProxy(observable);
  }

  /**
   * @private
   * @method
   * @description Defines the observables, effects, and attributes for the element.
   * @param {Object} config - The configuration object.
   * @returns {void}
   */
  __setup(config) {
    if (config.infer === true) {
      Object.keys(this).forEach(key => {
        if (typeof this[key] !== 'function' && !key.startsWith('__')) {
          if (this[key] instanceof Observable) {
            return;
          } else {
            const observable = this.__observable(this[key], key);
            if (this.__isObjectOrArray(observable.value)) {
              this.__createObservablePropertyForObjOrArr(this, key, observable);
            } else {
              this.__createObservablePropertyForPrimitive(this, key, observable);
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
  __observable(initialValue, _name) {
    if (!this.__isAllowedType(initialValue)) {
      const type = Object.prototype.toString.call(initialValue);
      throw new Error(`[Cami.js] The value of type ${type} is not allowed in observables. Only primitive values, arrays, and plain objects are allowed.`);
    }

    const observable = new ObservableState(initialValue, null, { name: _name });

    this.__registerObservables(observable);
    return observable;
  }

  /**
   * @private
   * @method
   * @description Checks if the provided value is of an allowed type
   * @param {any} value - The value to check
   * @returns {boolean} True if the value is of an allowed type, false otherwise
   */
  __isAllowedType(value) {
    const allowedTypes = ['number', 'string', 'boolean', 'object', 'undefined'];
    const valueType = typeof value;

    if (valueType === 'object') {
      return value === null || Array.isArray(value) || this.__isPlainObject(value);
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
  __isPlainObject(value) {
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
  __registerObservables(observableState) {
    if (!(observableState instanceof ObservableState)) {
      throw new TypeError('Expected observableState to be an instance of ObservableState');
    }

    // Only effects have a dispose method
    this.__unsubscribers.set(observableState, () => {
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
    if (typeof this.template === 'function') {
      const template = this.template();
      __litRender(template, this);
    }
  }
}

export { ReactiveElement };

