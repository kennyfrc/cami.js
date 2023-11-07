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

/**
 * @typedef {Object} State
 * @property {any} [property] - Any property of the state
 */

/**
 * @typedef {Object} Store
 * @property {State} state - The current state of the store
 * @property {Function} subscribe - Function to subscribe a listener to the store
 * @property {Function} register - Function to register a reducer to the store
 * @property {Function} dispatch - Function to dispatch an action to the store
 * @property {Function} use - Function to add a middleware to the store
 */

/**
 * @class
 * @extends {HTMLElement}
 * This class is needed to create reactive web components that can automatically update their view when their state changes.
 */
class ReactiveElement extends HTMLElement {
  static observedAttributesList = [];
  /**
   * @constructor
   */
  constructor() {
    super();
    this._observables = new Map();
    this._unsubscribers = new Map();
    this.store = null;
    this._effects = [];
  }

  /**
   * @method
   * @param {any} initialValue - The initial value for the observable
   * @returns {Object} An object with a value property and an update method
   */
  observable(initialValue) {
    let value = produce(initialValue, draft => {});
    const react = this.react.bind(this);
    return {
      get value() {
        return value;
      },
      update: (function(updater) {
        value = produce(value, updater);
        react();
      }).bind(this),
    };
  }

  /**
   * @method
   * @param {Function} computeFn - The function to compute the value of the property
   * @returns {Object} An object with a value getter
   */
  computed(computeFn) {
    return {
      get value() {
        return computeFn.call(this);
      },
    };
  }

  /**
   * @method
   * @param {Function} effectFn - The function to be called when an observable changes
   * @returns {void}
   */
  effect(effectFn) {
    const cleanup = effectFn.call(this) || (() => {});
    this._effects.push({ effectFn, cleanup });
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
    const observable = this.observable(attrValue);
    return observable;
  }

  /**
   * @method
   * @param {Object} props - The properties to set
   * @description This method sets the properties of the object. If the property is an observable, it updates the observable with the new value.
   * @returns {void}
   */
  setObservables(props) {
    Object.keys(props).forEach(key => {
      if (this[key] && typeof this[key].update === 'function') {
        this[key].update(() => props[key]);
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
    this._observables.set(key, observable);
    const unsubscribe = store.subscribe(newState => {
      this._observables.get(key).update(() => newState[key]);
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
    throw new Error('You have to implement the method template()!');
  }
}

let instance = null;

/**
 * @function
 * @param {State} initialState - The initial state of the store
 * @returns {Store} The store singleton
 */
const createStore = (initialState) => {
    // Singleton pattern: if an instance already exists, return it
    if (instance) {
        return instance;
    }

    let state = initialState;
    let listeners = [];
    let reducers = {};
    let middlewares = [];
    let dispatchQueue = [];
    let isProcessingQueue = false;

    const devTools = window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__'].connect();

    // Middleware registration: adds a middleware to the store
    const use = (middleware) => {
      middlewares.push(middleware);
    };

    // Listener registration: adds a listener to the store and returns an unsubscribe function
    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    };

    // Reducer registration: adds a reducer to the store
    const register = (action, reducer) => {
        if (reducers[action]) {
            throw new Error(`Action type ${action} is already registered.`);
        }
        reducers[action] = reducer;
    };

    // Queue processing: processes the dispatch queue asynchronously
    const processQueue = async () => {
      if (dispatchQueue.length === 0) {
        isProcessingQueue = false;
        return;
      }

      isProcessingQueue = true;
      const { action, payload } = dispatchQueue.shift();

      const reducer = reducers[action];
      if (!reducer) {
        console.warn(`No reducer found for action ${action}`);
        return;
      }

      const middlewareAPI = {
        getState: () => state,
        dispatch: (action, payload) => dispatch(action, payload)
      };
      const chain = middlewares.map(middleware => middleware(middlewareAPI));
      const dispatchWithMiddleware = chain.reduce((next, middleware) => middleware(next), baseDispatch);

      await dispatchWithMiddleware(action, payload);
      processQueue();
    };

    // Dispatch: adds an action to the dispatch queue and starts processing if not already doing so
    const dispatch = (action, payload) => {
      dispatchQueue.push({ action, payload });

      if (!isProcessingQueue) {
        processQueue();
      }
    };

    // Base dispatch: applies the reducer for the action and notifies listeners
    const baseDispatch = async (action, payload) => {
      let newState;
      let asyncTask = null;

      newState = produce(state, draft => {
        const result = reducers[action](draft, payload);
        if (result instanceof Promise) {
          asyncTask = result;
          return;
        }
      });

      if (asyncTask) {
        await asyncTask;
      }

      state = newState;
      notify(action);

      return newState;
    };

    // Notify: notifies all listeners of the new state and sends the state to Redux DevTools
    const notify = (action) => {
        for (const listener of listeners) {
            listener(state, action);
        }
        devTools && devTools.send(action, state);
    };

    // Store instance: contains the current state and methods for interacting with the store
    instance = {
        state,
        subscribe,
        register,
        dispatch,
        use,
    };

    return instance;
};

/**
 * @exports createStore
 * @exports html
 * @exports ReactiveElement
 */
export { createStore, html, ReactiveElement };
