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
    * [.use(middleware)](#ObservableStore.use)
    * [.getState()](#ObservableStore.getState) ⇒ <code>Object</code>
    * [.register(action, reducer)](#ObservableStore.register)
    * [.query(queryName, config)](#ObservableStore.query)
    * [.fetch(queryName, ...args)](#ObservableStore.fetch) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.invalidateQueries(queryName)](#ObservableStore.invalidateQueries)
    * [.dispatch(action, payload)](#ObservableStore.dispatch)

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
<a name="ObservableStore.query"></a>

### ObservableStore.query(queryName, config)
Registers an asynchronous query with the specified configuration.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>string</code> |  | The name of the query. |
| config | <code>Object</code> |  | The configuration object for the query, containing the following properties: |
| config.queryKey | <code>string</code> |  | The unique key for the query. |
| config.queryFn | <code>function</code> |  | The asynchronous query function that returns a promise. |
| [config.staleTime] | <code>number</code> | <code>0</code> | Optional. The time in milliseconds after which the query is considered stale. Defaults to 0. |
| [config.refetchOnWindowFocus] | <code>boolean</code> | <code>true</code> | Optional. Whether to refetch the query when the window regains focus. Defaults to true. |
| [config.refetchOnReconnect] | <code>boolean</code> | <code>true</code> | Optional. Whether to refetch the query when the network reconnects. Defaults to true. |
| [config.refetchInterval] | <code>number</code> \| <code>null</code> | <code></code> | Optional. The interval in milliseconds at which to refetch the query. Defaults to null. |
| [config.gcTime] | <code>number</code> | <code>300000</code> | Optional. The time in milliseconds after which the query is garbage collected. Defaults to 300000 (5 minutes). |
| [config.retry] | <code>number</code> | <code>3</code> | Optional. The number of times to retry the query on error. Defaults to 3. |
| [config.retryDelay] | <code>function</code> | <code>(attempt) &#x3D;&gt; Math.pow(2, attempt) * 1000</code> | Optional. A function that returns the delay in milliseconds for each retry attempt. Defaults to a function that calculates an exponential backoff based on the attempt number. |

**Example**  
```javascript
// Register a query to fetch posts
appStore.query('posts/fetchAll', {
  queryKey: 'posts/fetchAll',
  queryFn: () => fetch('https://api.camijs.com/posts').then(res => res.json()),
  refetchOnWindowFocus: true,
});

// Register actions for pending, success, and error states of the query
appStore.register('posts/fetchAll/pending', (state, payload) => {
  state.isLoading = true;
  state.posts = [];
  state.error = null;
});

appStore.register('posts/fetchAll/success', (state, payload) => {
  state.posts = payload;
  state.isLoading = false;
  state.error = null;
});

appStore.register('posts/fetchAll/error', (state, payload) => {
  state.error = payload;
  state.isLoading = false;
  state.posts = [];
});

// Fetch all posts
appStore.fetch('posts/fetchAll');

// Subscribe to updates
appStore.subscribe(newState => {
  console.log('New state:', newState);
});
```
<a name="ObservableStore.fetch"></a>

### ObservableStore.fetch(queryName, ...args) ⇒ <code>Promise.&lt;any&gt;</code>
Fetches data for a given query name, utilizing cache if available and not stale.
If data is stale or not in cache, it fetches new data using the query function.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  
**Returns**: <code>Promise.&lt;any&gt;</code> - A promise that resolves with the fetched data.  

| Param | Type | Description |
| --- | --- | --- |
| queryName | <code>string</code> | The name of the query to fetch data for. |
| ...args | <code>any</code> | Arguments to pass to the query function. |

**Example**  
```javascript
// Register a query to fetch posts
appStore.query('posts/fetchAll', {
  queryKey: 'posts/fetchAll',
  queryFn: () => fetch('https://api.camijs.com/posts').then(res => res.json()),
  refetchOnWindowFocus: true,
});

// Register actions for pending, success, and error states of the query
appStore.register('posts/fetchAll/pending', (state, payload) => {
  state.isLoading = true;
  state.posts = [];
  state.error = null;
});

appStore.register('posts/fetchAll/success', (state, payload) => {
  state.posts = payload;
  state.isLoading = false;
  state.error = null;
});

appStore.register('posts/fetchAll/error', (state, payload) => {
  state.error = payload;
  state.isLoading = false;
  state.posts = [];
});

// Fetch all posts
appStore.fetch('posts/fetchAll');

// Subscribe to updates
appStore.subscribe(newState => {
  console.log('New state:', newState);
});
```
<a name="ObservableStore.invalidateQueries"></a>

### ObservableStore.invalidateQueries(queryName)
Invalidates the cache and any associated intervals or event listeners for a given query name.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  

| Param | Type | Description |
| --- | --- | --- |
| queryName | <code>string</code> | The name of the query to invalidate. |

<a name="ObservableStore.dispatch"></a>

### ObservableStore.dispatch(action, payload)
Use this method to dispatch redux-style actions or flux actions, triggering state updates.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  
**Throws**:

- <code>Error</code> If the action type is not a string when expected.


| Param | Type | Description |
| --- | --- | --- |
| action | <code>string</code> \| <code>function</code> | The action type as a string or a function that performs custom dispatch logic. |
| payload | <code>Object</code> | The data to be passed along with the action. |

**Example**  
```javascript
// Dispatching an action with a payload
CartStore.dispatch('add', { id: 1, name: 'Product 1', quantity: 2 });
```
<a name="slice"></a>

## slice(store, options) ⇒ <code>Object</code>
Creates a slice of the store with its own state and actions, namespaced to avoid conflicts.

**Kind**: global function  
**Returns**: <code>Object</code> - - An object containing the action methods for the slice, including getState, actions, and subscribe methods.  

| Param | Type | Description |
| --- | --- | --- |
| store | <code>Object</code> | The main store instance. |
| options | <code>Object</code> | The options for creating the slice. |
| options.name | <code>string</code> | The name of the slice. |
| options.state | <code>Object</code> | The initial state of the slice. |
| options.actions | <code>Object</code> | The actions for the slice. |

**Example**  
```js
const cartSlice = slice(appStore, {
  name: 'cart',
  state: {
    cartItems: [],
  },
  actions: {
    add(state, product) {
      const newItem = { ...product, id: Date.now() };
      state.cartItems.push(newItem);
    },
    remove(state, product) {
      state.cartItems = state.cartItems.filter(item => item.id !== product.id);
    },
  }
});

// Dispatching actions
cartSlice.actions.add({ name: 'Product 1', price: 100 });
cartSlice.actions.remove({ id: 123456789 });

// Getting the current state
console.log(cartSlice.getState()); // Logs the current state of the cart slice

// Subscribing to state changes
const unsubscribe = cartSlice.subscribe(newState => {
  console.log('Cart slice state changed:', newState);
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
