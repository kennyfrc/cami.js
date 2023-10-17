//
// Nanodux, a simple state management library.
//
const produce = (base, recipe) => {
    if (typeof recipe !== "function") {
        throw new Error("Recipe should be a function");
    }

    const isDraftable = value => value && typeof value === "object" && !Object.isFrozen(value);

    // We use a WeakMap to keep track of the drafts we create.
    const drafts = new WeakMap();

    const createDraft = target => {
        if (!isDraftable(target)) return target;

        if (drafts.has(target)) {
            return drafts.get(target);
        }

        const draft = Array.isArray(target) ? target.slice() : { ...target };

        drafts.set(target, draft);

        // We return a Proxy for the draft. This allows us to intercept operations on the draft.
        return new Proxy(draft, {
            // When a property is accessed, we return a draft of the property value.
            get(target, prop, receiver) {
                return createDraft(Reflect.get(target, prop, receiver));
            },
            // When a property is set, we simply set the value on the draft.
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

const nanodux = (initialState) => {
    if (instance) {
        return instance;
    }

    let state = initialState;
    let listeners = [];
    let reducers = {};
    let middlewares = [];

    const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__.connect();

    const use = (middleware) => {
      middlewares.push(middleware);
    };

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    };

    const register = (action, reducer) => {
        if (reducers[action]) {
            throw new Error(`Action type ${action} is already registered.`);
        }
        reducers[action] = reducer;
    };

    const dispatch = async (action, payload) => {
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

        return await dispatchWithMiddleware(action, payload);
    };

    let config = {
        domain: 'Please use .config({domain: YOUR_DOMAIN_NAME}) to set the domain.'
    };

    const serverDispatch = async (action, endpoint, payload) => {
        try {
            const response = await fetch(`${domain}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: payload }),
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(action, data);
            }
        } catch (error) {
            console.error("Server Dispatch Error:", error);
        }
    };

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

    const notify = (action) => {
        for (const listener of listeners) {
            listener(state, action);
        }
        devTools && devTools.send(action, state);
    };

    const config = (newConfig) => {
        config = { ...config, ...newConfig };
    };

    if (devTools) {
        devTools.subscribe((message) => {
            if (message.type === 'DISPATCH' && message.state) {
                state = JSON.parse(message.state);
                notify();
            }
        });
    }

    instance = {
        state,
        subscribe,
        register,
        dispatch,
        use,
        serverDispatch,
        config
    };

    return instance;
};

export { nanodux };
