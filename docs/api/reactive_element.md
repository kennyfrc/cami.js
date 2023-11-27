<a name="ReactiveElement"></a>

## ReactiveElement
**Kind**: global class  

* [ReactiveElement](#ReactiveElement)
    * [new ReactiveElement()](#new_ReactiveElement_new)
    * [.observableAttributes(attributes)](#ReactiveElement+observableAttributes) ⇒ <code>void</code>
    * [.effect(effectFn)](#ReactiveElement+effect) ⇒ <code>void</code>
    * [.connect(store, key)](#ReactiveElement+connect) ⇒ <code>Observable</code> \| <code>Proxy</code>
    * [.stream(subscribeFn)](#ReactiveElement+stream) ⇒ <code>ObservableStream</code>
    * [.template()](#ReactiveElement+template) ⇒ <code>void</code>
    * [.query(options)](#ReactiveElement+query) ⇒ <code>Proxy</code>
    * [.mutation(options)](#ReactiveElement+mutation) ⇒ <code>Proxy</code>
    * [.invalidateQueries(queryKey)](#ReactiveElement+invalidateQueries) ⇒ <code>void</code>
    * [.onCreate()](#ReactiveElement+onCreate) ⇒ <code>void</code>
    * [.connectedCallback()](#ReactiveElement+connectedCallback) ⇒ <code>void</code>
    * [.onConnect()](#ReactiveElement+onConnect) ⇒ <code>void</code>
    * [.disconnectedCallback()](#ReactiveElement+disconnectedCallback) ⇒ <code>void</code> \| <code>void</code>
    * [.onDisconnect()](#ReactiveElement+onDisconnect) ⇒ <code>void</code>
    * [.attributeChangedCallback(name, oldValue, newValue)](#ReactiveElement+attributeChangedCallback) ⇒ <code>void</code>
    * [.onAttributeChange()](#ReactiveElement+onAttributeChange) ⇒ <code>void</code>
    * [.adoptedCallback()](#ReactiveElement+adoptedCallback) ⇒ <code>void</code> \| <code>void</code>
    * [.onAdopt()](#ReactiveElement+onAdopt) ⇒ <code>void</code>

<a name="new_ReactiveElement_new"></a>

### new ReactiveElement()
This class is needed to create reactive web components that can automatically update their view when their state changes. All properties are automatically converted to observables.

**Example**  
```javascript
const { html, ReactiveElement } = cami;

class CounterElement extends ReactiveElement {
  count = 0

  template() {
    return html`
      <button @click=${() => this.count--}>-</button>
      <button @click=${() => this.count++}>+</button>
      <div>Count: ${this.count}</div>
    `;
  }
}

customElements.define('counter-component', CounterElement);
```
<a name="ReactiveElement+observableAttributes"></a>

### reactiveElement.observableAttributes(attributes) ⇒ <code>void</code>
Creates observables from attributes and applies optional transformation functions.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  

| Param | Type | Description |
| --- | --- | --- |
| attributes | <code>Object</code> | An object with attribute names as keys and optional parsing functions as values. |

**Example**  
```js
// In _009_dataFromProps.html, the todos attribute is parsed as JSON and the data property is extracted:
this.observableAttributes({
  todos: (v) => JSON.parse(v).data
});
```
<a name="ReactiveElement+effect"></a>

### reactiveElement.effect(effectFn) ⇒ <code>void</code>
Creates an effect and registers its dispose function. The effect is used to perform side effects in response to state changes.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  

| Param | Type | Description |
| --- | --- | --- |
| effectFn | <code>function</code> | The function to create the effect |

**Example**  
```js
// Assuming `this.count` is an observable
this.effect(() => {
  console.log(`The count is now: ${this.count}`);
});
// The console will log the current count whenever `this.count` changes
```
<a name="ReactiveElement+connect"></a>

### reactiveElement.connect(store, key) ⇒ <code>Observable</code> \| <code>Proxy</code>
Subscribes to a store and creates an observable for a specific key in the store. This is useful for
synchronizing the component's state with a global store.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Returns**: <code>Observable</code> \| <code>Proxy</code> - The observable or a proxy for the observable  

| Param | Type | Description |
| --- | --- | --- |
| store | <code>Store</code> | The store to subscribe to |
| key | <code>string</code> | The key in the store to create an observable for |

**Example**  
```js
// Assuming there is a store for cart items
// `cartItems` will be an observable reflecting the current state of cart items in the store
this.cartItems = this.connect(CartStore, 'cartItems');
```
<a name="ReactiveElement+stream"></a>

### reactiveElement.stream(subscribeFn) ⇒ <code>ObservableStream</code>
Creates an ObservableStream from a subscription function.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Returns**: <code>ObservableStream</code> - An ObservableStream that emits values produced by the subscription function.  

| Param | Type | Description |
| --- | --- | --- |
| subscribeFn | <code>function</code> | The subscription function. |

**Example**  
```js
// In a FormElement component
const inputValidation$ = this.stream();
inputValidation$
  .map(e => this.validateEmail(e.target.value))
  .debounce(300)
  .subscribe(({ isEmailValid, emailError, email }) => {
    this.emailError = emailError;
    this.isEmailValid = isEmailValid;
    this.email = email;
    this.isEmailAvailable = this.queryEmail(this.email);
  });
```
<a name="ReactiveElement+template"></a>

### reactiveElement.template() ⇒ <code>void</code>
**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Throws**:

- <code>Error</code> If the method template() is not implemented

**Example**  
```js
// Here's a simple example of a template method implementation
template() {
  return html`<div>Hello World</div>`;
}
```
<a name="ReactiveElement+query"></a>

### reactiveElement.query(options) ⇒ <code>Proxy</code>
Fetches data from an API and caches it. This method is based on the TanStack Query defaults: https://tanstack.com/query/latest/docs/react/guides/important-defaults.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Returns**: <code>Proxy</code> - A proxy that contains the state of the query.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The options for the query. |
| options.queryKey | <code>Array</code> \| <code>string</code> |  | The key for the query. |
| options.queryFn | <code>function</code> |  | The function to fetch data. |
| [options.staleTime] | <code>number</code> | <code>0</code> | The stale time for the query. |
| [options.refetchOnWindowFocus] | <code>boolean</code> | <code>true</code> | Whether to refetch on window focus. |
| [options.refetchOnMount] | <code>boolean</code> | <code>true</code> | Whether to refetch on mount. |
| [options.refetchOnReconnect] | <code>boolean</code> | <code>true</code> | Whether to refetch on network reconnect. |
| [options.refetchInterval] | <code>number</code> | <code></code> | The interval to refetch data. |
| [options.gcTime] | <code>number</code> | <code>1000 * 60 * 5</code> | The garbage collection time for the query. |
| [options.retry] | <code>number</code> | <code>3</code> | The number of retry attempts. |
| [options.retryDelay] | <code>function</code> | <code>(attempt) &#x3D;&gt; Math.pow(2, attempt) * 1000</code> | The delay before retrying a failed query. |

**Example**  
```js
// In _012_blog.html, a query is set up to fetch posts with a stale time of 5 minutes:
const posts = this.query({
  queryKey: ["posts"],
  queryFn: () => fetch("https://jsonplaceholder.typicode.com/posts?_limit=5").then(res => res.json()),
  staleTime: 1000 * 60 * 5
});
```
<a name="ReactiveElement+mutation"></a>

### reactiveElement.mutation(options) ⇒ <code>Proxy</code>
Performs a mutation and returns an observable proxy. This method is inspired by the TanStack Query mutate method: https://tanstack.com/query/latest/docs/react/guides/mutations.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Returns**: <code>Proxy</code> - A proxy that contains the state of the mutation.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options for the mutation. |
| options.mutationFn | <code>function</code> | The function to perform the mutation. |
| [options.onMutate] | <code>function</code> | The function to be called before the mutation is performed. |
| [options.onError] | <code>function</code> | The function to be called if the mutation encounters an error. |
| [options.onSuccess] | <code>function</code> | The function to be called if the mutation is successful. |
| [options.onSettled] | <code>function</code> | The function to be called after the mutation has either succeeded or failed. |

**Example**  
```js
// In _012_blog.html, a mutation is set up to add a new post with optimistic UI updates:
const addPost = this.mutation({
  mutationFn: (newPost) => fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(res => res.json()),
  onMutate: (newPost) => {
    // Snapshot the previous state
    const previousPosts = this.posts.data;
    // Optimistically update to the new value
    this.posts.update(state => {
      state.data.push({ ...newPost, id: Date.now() });
    });
    // Return the rollback function and the new post
    return {
      rollback: () => {
        this.posts.update(state => {
          state.data = previousPosts;
        });
      },
      optimisticPost: newPost
    };
  }
});
```
<a name="ReactiveElement+invalidateQueries"></a>

### reactiveElement.invalidateQueries(queryKey) ⇒ <code>void</code>
Invalidates the queries with the given key, causing them to refetch if needed. This method is particularly useful when used in conjunction with mutations, such as in the `onSettled` callback, to ensure that the UI reflects the latest state.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  

| Param | Type | Description |
| --- | --- | --- |
| queryKey | <code>Array</code> \| <code>string</code> | The key for the query to invalidate. |

**Example**  
```js
// In a mutation's `onSettled` callback within a `BlogComponent`:
this.addPost = this.mutation({
  // ...mutation config...
  onSettled: () => {
    // Invalidate the posts query to refetch the true state
    this.invalidateQueries(['posts']);
  }
});
```
<a name="ReactiveElement+onCreate"></a>

### reactiveElement.onCreate() ⇒ <code>void</code>
Called when the component is created. Can be overridden by subclasses to add initialization logic.
This method is a hook for the connectedCallback, which is invoked each time the custom element is appended into a document-connected element.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Example**  
```js
onCreate() {
  // Example initialization logic here
  this.posts = this.query({
    queryKey: ["posts"],
    queryFn: () => {
      return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
        .then(res => res.json())
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}
```
<a name="ReactiveElement+connectedCallback"></a>

### reactiveElement.connectedCallback() ⇒ <code>void</code>
Invoked when the custom element is appended into a document-connected element. Sets up initial state and triggers initial rendering.
This is typically used to initialize component state, fetch data, and set up event listeners.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Example**  
```js
// In a TodoList component
connectedCallback() {
  super.connectedCallback();
  this.fetchTodos(); // Fetch todos when the component is added to the DOM
}
```
<a name="ReactiveElement+onConnect"></a>

### reactiveElement.onConnect() ⇒ <code>void</code>
Invoked when the custom element is connected to the document's DOM.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Returns**: <code>void</code> - Subclasses can override this to add initialization logic when the component is added to the DOM.  
**Example**  
```js
// In a UserCard component
onConnect() {
  this.showUserDetails(); // Display user details when the component is connected
}
```
<a name="ReactiveElement+disconnectedCallback"></a>

### reactiveElement.disconnectedCallback() ⇒ <code>void</code> \| <code>void</code>
Invoked when the custom element is disconnected from the document's DOM.
This is a good place to remove event listeners, cancel any ongoing network requests, or clean up any resources.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Example**  
```js
// In a Modal component
disconnectedCallback() {
  super.disconnectedCallback();
  this.close(); // Close the modal when it's disconnected from the DOM
}
```
<a name="ReactiveElement+onDisconnect"></a>

### reactiveElement.onDisconnect() ⇒ <code>void</code>
Invoked when the custom element is disconnected from the document's DOM.
Subclasses can override this to add cleanup logic when the component is removed from the DOM.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Example**  
```js
// In a VideoPlayer component
onDisconnect() {
  this.stopPlayback(); // Stop video playback when the component is removed
}
```
<a name="ReactiveElement+attributeChangedCallback"></a>

### reactiveElement.attributeChangedCallback(name, oldValue, newValue) ⇒ <code>void</code>
Invoked when an attribute of the custom element is added, removed, updated, or replaced.
This can be used to react to attribute changes, such as updating the component state or modifying its appearance.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the attribute that changed |
| oldValue | <code>string</code> | The old value of the attribute |
| newValue | <code>string</code> | The new value of the attribute |

**Example**  
```js
// In a ThemeSwitcher component
attributeChangedCallback(name, oldValue, newValue) {
  super.attributeChangedCallback(name, oldValue, newValue);
  if (name === 'theme') {
    this.updateTheme(newValue); // Update the theme when the `theme` attribute changes
  }
}
```
<a name="ReactiveElement+onAttributeChange"></a>

### reactiveElement.onAttributeChange() ⇒ <code>void</code>
Invoked when an attribute of the custom element is added, removed, updated, or replaced.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Returns**: <code>void</code> - Subclasses can override this to add logic that should run when an attribute changes.  
**Example**  
```js
// In a CollapsiblePanel component
onAttributeChange(name, oldValue, newValue) {
  if (name === 'collapsed') {
    this.toggleCollapse(newValue === 'true'); // Toggle collapse when the `collapsed` attribute changes
  }
}
```
<a name="ReactiveElement+adoptedCallback"></a>

### reactiveElement.adoptedCallback() ⇒ <code>void</code> \| <code>void</code>
Invoked when the custom element is moved to a new document.
This can be used to update bindings or perform re-initialization as needed when the component is adopted into a new DOM context.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Example**  
```js
// In a DragDropContainer component
adoptedCallback() {
  super.adoptedCallback();
  this.updateDragDropContext(); // Update context when the component is moved to a new document
}
```
<a name="ReactiveElement+onAdopt"></a>

### reactiveElement.onAdopt() ⇒ <code>void</code>
Invoked when the custom element is moved to a new document.
Subclasses can override this to add logic that should run when the component is moved to a new document.

**Kind**: instance method of [<code>ReactiveElement</code>](#ReactiveElement)  
**Example**  
```js
// In a DataGrid component
onAdopt() {
  this.refreshData(); // Refresh data when the component is adopted into a new document
}
```
