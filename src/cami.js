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
import { Observable, observableMixin } from './observable.js';
import { store } from './store.js';

/**
 * @typedef {Object} State
 * @property {any} [property] - Any property of the state
 */

/**
 * @class
 * @extends {HTMLElement}
 * This class is needed to create reactive web components that can automatically update their view when their state changes.
 */
class ReactiveElement extends observableMixin(HTMLElement) {
  /**
   * @constructor
   */
  constructor() {
    super();
    this._unsubscribers = new Map();
    this.store = null;
    this._effects = [];
    this._isWithinBatch = false;
  }


  /**
   * @method
   * @param {any} initialValue - The initial value for the observable
   * @returns {Observable} The observable
   */
  observable(initialValue) {
    const observable = new Observable(initialValue, {
      next: this.react.bind(this),
      complete: this.react.bind(this),
      error: this.react.bind(this) // the view will always include the error message
    }, { last: true });
    return observable;
  }

  /**
   * Creates an observable property from an attribute.
   * @param {string} attrName - The name of the attribute.
   * @param {Function} parseFn - The function to parse the attribute value. Defaults to identity function.
   * @returns {Object} An object with a value property and an update method
   * @description This method creates an observable property from an attribute. It first gets the attribute value, then uses the provided parse function to process the value. The processed value is then used to create an observable. The method finally converts the attribute name to a property name and returns the observable.
   */
  observableAttr(attrName, parseFn = (v) => v) {
    let attrValue = this.getAttribute(attrName);
    attrValue = produce(attrValue, parseFn);
    return this.observable(attrValue);
  }

  /**
   * @method
   * @param {Object} props - The properties to set
   * @description This method sets the properties of the object. If the property is an observable, it updates the observable with the new value.
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
   * @param {Store} store - The store to bind
   * @param {string} key - The key for the store
   * @returns {Object} The observable
   */
  subscribe(store, key) {
    this.store = store;
    const observable = this.observable(store.state[key]);
    const unsubscribe = store.subscribe(newState => {
      this[key].update(() => newState[key]);
    });
    this._unsubscribers.set(key, unsubscribe);
    return observable;
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
    throw new Error('You have to implement the method template()!');
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
 * @exports store
 * @exports html
 * @exports ReactiveElement
 * @exports define
 */
export { store, html, ReactiveElement, define };
