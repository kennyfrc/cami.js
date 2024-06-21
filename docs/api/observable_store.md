## Classes

<dl>
<dt><a href="#ObservableStore">ObservableStore</a> ⇐ <code>Observable</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#slice">slice(store, options)</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a slice of the store with its own state and actions, namespaced to avoid conflicts.</p>
</dd>
<dt><a href="#store">store(initialState, [options])</a> ⇒ <code><a href="#ObservableStore">ObservableStore</a></code></dt>
<dd><p>This function creates a new instance of ObservableStore with the provided initial state and enhances it with localStorage support if enabled. The store&#39;s state will be automatically persisted to and loaded from localStorage, using the provided name as the key. The <code>localStorage</code> option enables this behavior and can be toggled off if persistence is not needed.</p>
</dd>
</dl>

<a name="ObservableStore"></a>

## ObservableStore ⇐ <code>Observable</code>
**Kind**: global class  
**Extends**: <code>Observable</code>  

* [ObservableStore](#ObservableStore) ⇐ <code>Observable</code>
    * [new ObservableStore()](#new_ObservableStore_new)
    * _instance_
        * [.dispatch(action, [payload])](#ObservableStore+dispatch)
    * _static_
        * [.use(middleware)](#ObservableStore.use)
        * [.getState()](#ObservableStore.getState) ⇒ <code>Object</code>
        * [.register(action, reducer)](#ObservableStore.register)
        * [.onPatch(key, callback)](#ObservableStore.onPatch)
        * [.applyPatch(patches)](#ObservableStore.applyPatch)
        * [.query(queryName, config)](#ObservableStore.query)
        * [.fetch(queryName, ...args)](#ObservableStore.fetch) ⇒ <code>Promise</code>
        * [.invalidateQueries(queryName)](#ObservableStore.invalidateQueries)
        * [.mutation(mutationName, config)](#ObservableStore.mutation)
        * [.mutate(mutationName, ...args)](#ObservableStore.mutate) ⇒ <code>Promise</code>

<a name="new_ObservableStore_new"></a>

### new ObservableStore()
This class is used to create a store that can be observed for changes. It supports registering actions and middleware, making it flexible for various use cases.

**Example**  
```javascript
// Creating a store with initial state and registering actions
const CartStore = cami.store({
  cartItems: [],
});

CartStore.register('add', (state, product) => {
  const cartItem = { ...product, cartItemId: Date.now() };
  state.cartItems.push(cartItem);
});

CartStore.register('remove', (state, product) => {
  state.cartItems = state.cartItems.filter(item => item.cartItemId !== product.cartItemId);
});

// Using middleware for logging
const loggerMiddleware = (context) => {
  console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
};
CartStore.use(loggerMiddleware);
```
<a name="ObservableStore+dispatch"></a>

### observableStore.dispatch(action, [payload])
Dispatches an action to update the store's state.

**Kind**: instance method of [<code>ObservableStore</code>](#ObservableStore)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>string</code> \| <code>function</code> | The action type (string) or action creator (function). |
| [payload] | <code>any</code> | The optional payload object to pass to the reducer. |

**Example**  
```js
// Dispatching a simple action
store.dispatch('increment');

// Dispatching an action with payload
store.dispatch('addItem', { id: 1, name: 'New Item' });
```
<a name="ObservableStore.use"></a>

### ObservableStore.use(middleware)
This method registers a middleware function to be used with the store. Useful if you like redux-style middleware.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  

| Param | Type | Description |
| --- | --- | --- |
| middleware | <code>function</code> | The middleware function to use |

**Example**  
```javascript
const loggerMiddleware = (context) => {
  console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
};
CartStore.use(loggerMiddleware);
```
<a name="ObservableStore.getState"></a>

### ObservableStore.getState() ⇒ <code>Object</code>
Retrieves the current state of the store. This method is crucial in asynchronous operations or event-driven environments to ensure the most current state is accessed, as the state might change frequently due to user interactions or other asynchronous updates.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  
**Returns**: <code>Object</code> - - The current state of the store.  
<a name="ObservableStore.register"></a>

### ObservableStore.register(action, reducer)
This method registers a reducer function for a given action type. Useful if you like redux-style reducers.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  
**Throws**:

- <code>Error</code> - Throws an error if the action type is already registered


| Param | Type | Description |
| --- | --- | --- |
| action | <code>string</code> | The action type |
| reducer | <code>function</code> | The reducer function for the action |

**Example**  
```javascript
// Creating a store with initial state and registering actions
const CartStore = cami.store({
  cartItems: [],
});

CartStore.register('add', (state, product) => {
  const cartItem = { ...product, cartItemId: Date.now() };
  state.cartItems.push(cartItem);
});

CartStore.register('remove', (state, product) => {
  state.cartItems = state.cartItems.filter(item => item.cartItemId !== product.cartItemId);
});

```
<a name="ObservableStore.onPatch"></a>

### ObservableStore.onPatch(key, callback)
Registers a callback to be invoked whenever patches are applied to the specified state key.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The state key to listen for patches. |
| callback | <code>function</code> | The callback to invoke when patches are applied. |

**Example**  
```javascript
appStore.onPatch('posts', (patch) => {
  console.log('Patch applied:', patch);
});
```
<a name="ObservableStore.applyPatch"></a>

### ObservableStore.applyPatch(patches)
Applies the given patches to the store's state.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  

| Param | Type | Description |
| --- | --- | --- |
| patches | <code>Array</code> | The patches to apply to the state. |

**Example**  
```javascript
const patches = [{ op: 'replace', path: ['posts', 0, 'title'], value: 'New Title' }];
appStore.applyPatch(patches);
```
<a name="ObservableStore.query"></a>

### ObservableStore.query(queryName, config)
Registers a query with the given configuration. This method sets up the query with the provided options and handles refetching based on various triggers like window focus, reconnect, and intervals.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>string</code> |  | The name of the query to register. |
| config | <code>Object</code> |  | The configuration object for the query. |
| config.queryKey | <code>string</code> \| <code>Array</code> |  | The unique key for the query. |
| config.queryFn | <code>function</code> |  | The function to fetch data for the query. |
| [config.staleTime] | <code>number</code> | <code>0</code> | The time in milliseconds before the query is considered stale. |
| [config.refetchOnWindowFocus] | <code>boolean</code> | <code>false</code> | Whether to refetch the query on window focus. |
| [config.refetchInterval] | <code>number</code> \| <code>null</code> | <code></code> | The interval in milliseconds to refetch the query. |
| [config.refetchOnReconnect] | <code>boolean</code> | <code>true</code> | Whether to refetch the query on reconnect. |
| [config.gcTime] | <code>number</code> | <code>300000</code> | The time in milliseconds before garbage collecting the query. |
| [config.retry] | <code>number</code> | <code>1</code> | The number of retry attempts for the query. |
| [config.retryDelay] | <code>function</code> |  | The function to calculate the delay between retries. |
| [config.onSuccess] | <code>function</code> |  | The callback function to execute when the query succeeds. Receives a context object with `result`, `state`, `actions`, `mutations`, and `invalidateQueries`. |
| [config.onError] | <code>function</code> |  | The callback function to execute when the query fails. Receives a context object with `error`, `state`, `actions`, `mutations`, and `invalidateQueries`. |
| [config.actions] | <code>Object</code> | <code>this.actions</code> | The actions available in the store. |

**Example**  
```javascript
appStore.register('setPosts', (state, posts) => {
  state.posts = posts;
});

appStore.query('fetchPosts', {
  queryKey: 'posts',
  queryFn: () => fetch('https://api.camijs.com/posts').then(res => res.json()),
  onSuccess: (ctx) => {
    ctx.actions.setPosts(ctx.result);
  },
  onError: (ctx) => {
    // console.error('Query failed:', ctx.error);
  }
});
```
<a name="ObservableStore.fetch"></a>

### ObservableStore.fetch(queryName, ...args) ⇒ <code>Promise</code>
Fetches data for the given query name. If the data is cached and not stale, it returns the cached data.
Otherwise, it fetches new data using the query function. Supports retry logic and calls lifecycle hooks.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  
**Returns**: <code>Promise</code> - A promise that resolves to the query result.  

| Param | Type | Description |
| --- | --- | --- |
| queryName | <code>string</code> | The name of the query to fetch. |
| ...args | <code>any</code> | The arguments to pass to the query function. |

**Example**  
```js
// Fetching data for a query named 'fetchPosts'
appStore.fetch('fetchPosts')
```
<a name="ObservableStore.invalidateQueries"></a>

### ObservableStore.invalidateQueries(queryName)
Invalidates the cache and any associated intervals or event listeners for a given query name.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  

| Param | Type | Description |
| --- | --- | --- |
| queryName | <code>string</code> | The name of the query to invalidate. |

<a name="ObservableStore.mutation"></a>

### ObservableStore.mutation(mutationName, config)
Registers a mutation with the given configuration. This method sets up the mutation with the provided options and handles the mutation lifecycle.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| mutationName | <code>string</code> |  | The name of the mutation to register. |
| config | <code>Object</code> |  | The configuration object for the mutation. |
| config.mutationFn | <code>function</code> |  | The function to perform the mutation. |
| [config.onMutate] | <code>function</code> |  | The function to be called before the mutation is performed. |
| [config.onError] | <code>function</code> |  | The function to be called if the mutation encounters an error. |
| [config.onSuccess] | <code>function</code> |  | The function to be called if the mutation is successful. |
| [config.onSettled] | <code>function</code> |  | The function to be called after the mutation has either succeeded or failed. |
| [config.actions] | <code>Object</code> | <code>this.actions</code> | The actions available in the store. |
| [config.queries] | <code>Object</code> | <code>this.queries</code> | The queries available in the store. |

**Example**  
```javascript
appStore.mutation('deletePost', {
  mutationFn: (id) => fetch(`https://api.camijs.com/posts/${id}`, { method: 'DELETE' }).then(res => res.json()),
  onMutate: (context) => {
    context.actions.setPosts(context.state.posts.filter(post => post.id !== context.args[0]));
  },
  onError: (context) => {
    context.actions.setPosts(context.previousState.posts);
  },
  onSuccess: (context) => {
    console.log('Mutation successful:', context);
  },
  onSettled: (context) => {
    console.log('Mutation settled');
    context.invalidateQueries('posts');
  }
});

appStore.mutate('deletePost', id);
```
<a name="ObservableStore.mutate"></a>

### ObservableStore.mutate(mutationName, ...args) ⇒ <code>Promise</code>
Performs the mutation with the given name and arguments. This method handles the mutation lifecycle, including optimistic updates, success handling, and error handling.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  
**Returns**: <code>Promise</code> - A promise that resolves to the mutation result.  

| Param | Type | Description |
| --- | --- | --- |
| mutationName | <code>string</code> | The name of the mutation to perform. |
| ...args | <code>any</code> | The arguments to pass to the mutation function. |

**Example**  
```javascript
// Define a mutation named 'deletePost'
appStore.mutation('deletePost', {
  // The function that performs the actual mutation logic
  mutationFn: (id) => fetch(`https://api.camijs.com/posts/${id}`, { method: 'DELETE' }).then(res => res.json()),
  // Optional: Optimistically update the state before the mutation
  onMutate: (context) => {
    context.actions.setPosts(context.state.posts.filter(post => post.id !== context.args[0]));
  },
  // Optional: Handle errors during mutation
  onError: (context) => {
    context.actions.setPosts(context.previousState.posts);
  },
  // Optional: Perform actions after a successful mutation
  onSuccess: (context) => {
    console.log('Mutation successful:', context);
  },
  // Optional: Perform actions after the mutation is settled (success or error)
  onSettled: (context) => {
    console.log('Mutation settled');
    context.invalidateQueries('posts');
  }
});

// Execute the 'deletePost' mutation with a post ID
appStore.mutate('deletePost', 1);
```
<a name="slice"></a>

## slice(store, options) ⇒ <code>Object</code>
Creates a slice of the store with its own state and actions, namespaced to avoid conflicts.

**Kind**: global function  
**Returns**: <code>Object</code> - - An object containing the action methods for the slice, including getState, actions, queries, mutations, and subscribe methods.  

| Param | Type | Description |
| --- | --- | --- |
| store | <code>Object</code> | The main store instance. |
| options | <code>Object</code> | The options for creating the slice. |
| options.name | <code>string</code> | The name of the slice. |
| options.state | <code>Object</code> | The initial state of the slice. |
| options.actions | <code>Object</code> | The actions for the slice. |
| [options.queries] | <code>Object</code> | The queries for the slice. |
| [options.mutations] | <code>Object</code> | The mutations for the slice. |

**Example**  
```js
const appStore = store({
  // Initial state for other parts of the application
});

const postsSlice = slice(appStore, {
  name: 'posts',
  state: [
    { id: 1, title: 'First Post' },
    { id: 2, title: 'Second Post' }
  ],
  actions: {
    updatePost: (state, { id, title }) => {
      const postIndex = state.findIndex(post => post.id === id);
      if (postIndex !== -1) {
        state[postIndex].title = title;
      }
    }
  }
});

// Accessing the slice's state
postsSlice.getState();

// Dispatching actions
postsSlice.actions.updatePost({ id: 1, title: 'Updated Title' });

// Subscribing to state changes
const unsubscribe = postsSlice.subscribe(state => {
  console.log('Posts slice state changed:', state);
});

// Unsubscribe when no longer needed
unsubscribe();
```
<a name="store"></a>

## store(initialState, [options]) ⇒ [<code>ObservableStore</code>](#ObservableStore)
This function creates a new instance of ObservableStore with the provided initial state and enhances it with localStorage support if enabled. The store's state will be automatically persisted to and loaded from localStorage, using the provided name as the key. The `localStorage` option enables this behavior and can be toggled off if persistence is not needed.

**Kind**: global function  
**Returns**: [<code>ObservableStore</code>](#ObservableStore) - A new instance of ObservableStore with the provided initial state, enhanced with localStorage if enabled.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| initialState | <code>Object</code> |  | The initial state of the store. |
| [options] | <code>Object</code> |  | Configuration options for the store. |
| [options.localStorage] | <code>boolean</code> | <code>true</code> | Whether to use localStorage for state persistence. |
| [options.name] | <code>string</code> | <code>&quot;&#x27;cami-store&#x27;&quot;</code> | The name of the store to use as the key in localStorage. |
| [options.expiry] | <code>number</code> | <code>86400000</code> | The time in milliseconds until the stored state expires (default is 24 hours). |

**Example**  
```javascript
// Create a store with default localStorage support
const CartStore = store({ cartItems: [] });

// Create a store without localStorage support
const NonPersistentStore = store({ items: [] }, { localStorage: false });
```
