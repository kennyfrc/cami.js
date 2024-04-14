## Classes

<dl>
<dt><a href="#ObservableStore">ObservableStore</a> ⇐ <code>Observable</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#query">query(queryName, config)</a></dt>
<dd><p>Registers an async query with the specified configuration.</p>
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
    * [.register(action, reducer)](#ObservableStore.register)
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
<a name="query"></a>

## query(queryName, config)
Registers an async query with the specified configuration.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>string</code> |  | The name of the query. |
| config | <code>Object</code> |  | The configuration object for the query. |
| config.queryKey | <code>string</code> |  | The unique key for the query. |
| config.queryFn | <code>function</code> |  | The async query function that returns a promise. |
| [config.staleTime] | <code>number</code> | <code>0</code> | The time in milliseconds after which the query is considered stale. |
| [config.refetchOnWindowFocus] | <code>boolean</code> | <code>true</code> | Whether to refetch the query when the window regains focus. |
| [config.refetchOnReconnect] | <code>boolean</code> | <code>true</code> | Whether to refetch the query when the network reconnects. |
| [config.refetchInterval] | <code>number</code> \| <code>null</code> | <code></code> | The interval in milliseconds at which to refetch the query. |
| [config.gcTime] | <code>number</code> | <code>300000</code> | The time in milliseconds after which the query is garbage collected. |
| [config.retry] | <code>number</code> | <code>3</code> | The number of times to retry the query on error. |
| [config.retryDelay] | <code>function</code> | <code>(attempt) &#x3D;&gt; Math.pow(2, attempt) * 1000</code> | A function that returns the delay in milliseconds for each retry attempt. |

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
