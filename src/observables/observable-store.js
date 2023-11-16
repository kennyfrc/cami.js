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
    super(subscriber => {
      this._subscriber = subscriber;
      return () => { this._subscriber = null; };
    });

    this.state = initialState;
    this.reducers = {};
    this.middlewares = [];
    this.devTools = this.connectToDevTools();
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
      throw new Error(`Action type ${action} is already registered.`);
    }
    this.reducers[action] = reducer;
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
      throw new Error(`Action type must be a string. Got: ${typeof action}`);
    }

    const reducer = this.reducers[action];
    if (!reducer) {
      console.warn(`No reducer found for action ${action}`);
      return;
    }

    const context = {
      state: this.state,
      action,
      payload,
    };

    for (const middleware of this.middlewares) {
      middleware(context);
    }

    this.state = produce(this.state, draft => {
      reducer(draft, context.payload);
    });

    this._observers.forEach(observer => observer.next(this.state));

    if (this.devTools) {
      this.devTools.send(action, this.state);
    }
  }
}

export { ObservableStore };