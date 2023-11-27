## Classes

<dl>
<dt><a href="#ObservableStore">ObservableStore</a> ⇐ <code>Observable</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#store">store(initialState)</a> ⇒ <code><a href="#ObservableStore">ObservableStore</a></code></dt>
<dd><p>This function creates a new instance of ObservableStore with the provided initial state.</p>
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
This class is used to create a store that can be observed for changes. Adding the actions on the store is recommended.

**Example**  
```javascript
const CartStore = cami.store({
  cartItems: [],
  add: (store, product) => {
    const cartItem = { ...product, cartItemId: Date.now() };
    store.cartItems.push(cartItem);
  },
  remove: (store, product) => {
    store.cartItems = store.cartItems.filter(item => item.cartItemId !== product.cartItemId);
  }
});
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
CartStore.register('add', (store, product) => {
  const cartItem = { ...product, cartItemId: Date.now() };
  store.cartItems.push(cartItem);
});
```
<a name="ObservableStore.dispatch"></a>

### ObservableStore.dispatch(action, payload)
This method dispatches an action to the store. Useful if you like redux-style actions / flux.

**Kind**: static method of [<code>ObservableStore</code>](#ObservableStore)  
**Throws**:

- <code>Error</code> - Throws an error if the action type is not a string


| Param | Type | Description |
| --- | --- | --- |
| action | <code>string</code> \| <code>function</code> | The action type or a function |
| payload | <code>Object</code> | The payload for the action |

**Example**  
```javascript
CartStore.dispatch('add', product);
```
<a name="store"></a>

## store(initialState) ⇒ [<code>ObservableStore</code>](#ObservableStore)
This function creates a new instance of ObservableStore with the provided initial state.

**Kind**: global function  
**Returns**: [<code>ObservableStore</code>](#ObservableStore) - A new instance of ObservableStore with the provided initial state  

| Param | Type | Description |
| --- | --- | --- |
| initialState | <code>Object</code> | The initial state of the store |

**Example**  
```javascript
const CartStore = store({ cartItems: [] });
```
