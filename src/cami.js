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
    /** @type {Object} */
    this.store = null;
    /** @type {Array<Function>} */
    this._effects = [];
    /** @type {boolean} */
    this._isWithinBatch = false;

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
  define(config) {
    if (config.observables) {
      config.observables.forEach(key => {
        const observable = this.observable(this[key]);
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
      config.attributes.forEach(attr => {
        if (typeof attr === 'string') {
          const observableAttr = this.observableAttr(attr);
          if (this._isObjectOrArray(observableAttr.value)) {
            this._handleObjectOrArray(this, attr, observableAttr, true);
          } else {
            this._handleNonObject(this, attr, observableAttr, true);
          }
        } else if (typeof attr === 'object' && attr.name && typeof attr.parseFn === 'function') {
          const observableAttr = this.observableAttr(attr.name, attr.parseFn);
          if (this._isObjectOrArray(observableAttr.value)) {
            this._handleObjectOrArray(this, attr.name, observableAttr, true);
          } else {
            this._handleNonObject(this, attr.name, observableAttr, true);
          }
        }
      });
    }
  }

  /**
   * @method
   * @description Creates an observable with an initial value
   * @param {any} initialValue - The initial value for the observable
   * @returns {Observable} The observable
   */
  observable(initialValue) {
    if (!this._isAllowedType(initialValue)) {
      const type = Object.prototype.toString.call(initialValue);
      throw new Error(`The type ${type} of initialValue is not allowed in observables.`);
    }

    const observable = new ObservableState(initialValue, (value) => this.react.bind(this)(), { last: true });
    this.registerObservables(observable);
    return observable;
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
    return this.observable(attrValue);
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
  subscribe(store, key) {
    this.store = store;
    const observable = this.observable(this.store.state[key]);
    const unsubscribe = this.store.subscribe(newState => {
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
   * @param {string} action - The action to dispatch
   * @param {any} payload - The payload for the action
   * @returns {void}
   */
  dispatch(action, payload) {
    this.store.dispatch(action, payload);
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

  /**
   * @method
   * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
   * This also triggers all effects.
   * @returns {void}
   */
  react() {
    if (!this._isWithinBatch) {
      const template = this.template();
      render(template, this);
      this._effects.forEach(({ effectFn }) => effectFn.call(this));
    }
  }

  /**
   * @method
   * @throws {Error} If the method template() is not implemented
   * @returns {void}
   */
  template() {
    throw new Error('[Cami.js] You have to implement the method template()!');
  }


  /**
   * @function
   * @param {Function} callback - The function to call in a batch update
   * @returns {void}
   * @description This function sets the _isWithinBatch flag, calls the callback, then resets the flag and calls react
   * Note: only works with update() and for non-primitives such as objects and arrays
   */
  batch(callback) {
    this._isWithinBatch = true;
    Promise.resolve().then(callback).finally(() => {
      this._isWithinBatch = false;
    });
  };
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
export { store, html, ReactiveElement, define, ObservableStream, ObservableElement, Observable, ObservableState, ObservableStore };
