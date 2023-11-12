let instance = null;

/**
 * @typedef {Object} Store
 * @property {State} state - The current state of the store
 * @property {Function} subscribe - Function to subscribe a listener to the store
 * @property {Function} register - Function to register a reducer to the store
 * @property {Function} dispatch - Function to dispatch an action to the store
 * @property {Function} use - Function to add a middleware to the store
 */

import { produce } from "immer";

/**
 * @function
 * @param {State} initialState - The initial state of the store
 * @returns {Store} The store singleton
 */
const store = (initialState) => {
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

export { store };
