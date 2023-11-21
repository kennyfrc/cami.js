import { Observable } from './observable.js';
import { produce } from "immer";

/**
 * @class ObservableStore
 * @extends {Observable}
 */
class ObservableStore extends Observable {
  /**
   * @constructor
   * @param {Object} initialState - The initial state of the store
   */
  constructor(initialState) {
    if (typeof initialState !== 'object' || initialState === null) {
      throw new TypeError('[Cami.js] initialState must be an object');
    }

    super(subscriber => {
      this._subscriber = subscriber;
      return () => { this._subscriber = null; };
    });

    this.state = new Proxy(initialState, {
      get: (target, property) => {
        return target[property];
      },
      set: (target, property, value) => {
        target[property] = value;
        this._observers.forEach(observer => observer.next(this.state));
        if (this.devTools) {
          this.devTools.send(property, this.state);
        }
        return true;
      }
    });

    this.reducers = {};
    this.middlewares = [];
    this.devTools = this.connectToDevTools();

    Object.keys(initialState).forEach(key => {
      if (typeof initialState[key] === 'function') {
        this.register(key, initialState[key]);
      } else {
        this.state[key] = initialState[key];
      }
    });
  }

  /**
   * Applies all registered middlewares to the given action and arguments.
   *
   * @param {string} action - The action type
   * @param {...any} args - The arguments to pass to the action
   * @returns {void}
   */
  _applyMiddleware(action, ...args) {
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
   * @method connectToDevTools
   * @returns {Object|null} - Returns the devTools object if available, else null
   */
  connectToDevTools() {
    if (typeof window !== 'undefined' && window['__REDUX_DEVTOOLS_EXTENSION__']) {
      const devTools = window['__REDUX_DEVTOOLS_EXTENSION__'].connect();
      devTools.init(this.state);
      return devTools;
    }
    return null;
  }

  /**
   * @method use
   * @param {Function} middleware - The middleware function to use
   */
  use(middleware) {
    this.middlewares.push(middleware);
  }

  /**
   * @method register
   * @param {string} action - The action type
   * @param {Function} reducer - The reducer function for the action
   * @throws {Error} - Throws an error if the action type is already registered
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
   * @method dispatch
   * @param {string|Function} action - The action type or a function
   * @param {Object} payload - The payload for the action
   * @throws {Error} - Throws an error if the action type is not a string
   */
  dispatch(action, payload) {
    if (typeof action === 'function') {
      return action(this.dispatch.bind(this), () => this.state);
    }

    if (typeof action !== 'string') {
      throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof action}`);
    }

    const reducer = this.reducers[action];
    if (!reducer) {
      console.warn(`No reducer found for action ${action}`);
      return;
    }

    this._applyMiddleware(action, payload);

    this.state = produce(this.state, draft => {
      reducer(draft, payload);
    });

    this._observers.forEach(observer => observer.next(this.state));

    if (this.devTools) {
      this.devTools.send(action, this.state);
    }
  }
}

export { ObservableStore };
