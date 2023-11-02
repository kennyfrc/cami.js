/**
 * @license
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */
/**
 * @module cami
 * @requires 'lit-html'
 */
import { html, render } from 'lit-html';

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
  constructor() {
    super();
    this._observables = new Map();
  }

  observable(key, initialValue) {
    if (this._observables.has(key)) {
      throw new Error(`Observable "${key}" is already defined`);
    }
    let value = Array.isArray(initialValue) ? [...initialValue] : initialValue;
    if (Array.isArray(value)) {
      value = new Proxy(value, {
        set: (target, prop, newValue) => {
          target[prop] = newValue;
          this.updateView();
          return true;
        }
      });
    }
    Object.defineProperty(this, key, {
      get: () => value,
      set: newValue => {
        value = newValue;
        this.updateView();
      },
    });
    this._observables.set(key, value);
  }

  bindStore(key, store) {
    this.observable(key, store.state[key]);
    store.subscribe(newState => {
      this[key] = newState[key];
    });
  }

  /**
   * @method
   * Invoked when the custom element is appended into a document-connected element. Sets up initial state and triggers initial rendering.
   */
  connectedCallback() {
    this.updateView();
  }

  /**
   * @method
   * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
   */
  updateView() {
    const template = this.template(this.state);
    render(template, this);
  }

  /**
   * @method
   * @param {State} state - The current state
   * @throws {Error} If the method template() is not implemented
   */
  template(state) {
    throw new Error('You have to implement the method template()!');
  }
}

/**
 * @function
 * @param {Object} base - The base object
 * @param {Function} recipe - The function to produce the new state
 * @returns {Object} The new state, which is a Proxy that intercepts get and set operations on the draft object
 */
const produce = (base, recipe) => {
    if (typeof recipe !== "function") {
        throw new Error("Recipe should be a function");
    }

    const isDraftable = value => value && typeof value === "object" && !Object.isFrozen(value);

    // Drafts Storage: WeakMap is used to store drafts for automatic garbage collection of unused drafts
    const drafts = new WeakMap();

    const createDraft = target => {
        if (!isDraftable(target)) return target;

        if (drafts.has(target)) {
            return drafts.get(target);
        }

        const draft = Array.isArray(target) ? target.slice() : { ...target };

        drafts.set(target, draft);

        return new Proxy(draft, {
            get(target, prop, receiver) {
                return createDraft(Reflect.get(target, prop, receiver));
            },
            set(target, prop, value, receiver) {
                return Reflect.set(target, prop, value, receiver);
            }
        });
    };

    const draft = createDraft(base);
    recipe(draft);

    return draft;
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
