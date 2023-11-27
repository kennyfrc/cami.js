## Classes

<dl>
<dt><a href="#Subscriber">Subscriber</a></dt>
<dd></dd>
<dt><a href="#Observable">Observable</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Observer">Observer</a> : <code>Object</code></dt>
<dd><p>The observer object or function.</p>
</dd>
</dl>

<a name="Subscriber"></a>

## Subscriber
**Kind**: global class  

* [Subscriber](#Subscriber)
    * [new Subscriber(observer)](#new_Subscriber_new)
    * [.next(result)](#Subscriber+next)
    * [.complete()](#Subscriber+complete)
    * [.error(error)](#Subscriber+error)
    * [.addTeardown(teardown)](#Subscriber+addTeardown)
    * [.unsubscribe()](#Subscriber+unsubscribe)

<a name="new_Subscriber_new"></a>

### new Subscriber(observer)
Class representing a Subscriber.


| Param | Type | Description |
| --- | --- | --- |
| observer | [<code>Observer</code>](#Observer) \| <code>function</code> | The observer object or function. |

<a name="Subscriber+next"></a>

### subscriber.next(result)
Notifies the observer of a new value.

**Kind**: instance method of [<code>Subscriber</code>](#Subscriber)  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>any</code> | The result to pass to the observer's next method. |

**Example**  
```js
subscriber.next('Hello, world!');
```
<a name="Subscriber+complete"></a>

### subscriber.complete()
Notifies the observer that the observable has completed and no more data will be emitted.

**Kind**: instance method of [<code>Subscriber</code>](#Subscriber)  
**Example**  
```js
subscriber.complete();
```
<a name="Subscriber+error"></a>

### subscriber.error(error)
Notifies the observer that an error has occurred.

**Kind**: instance method of [<code>Subscriber</code>](#Subscriber)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Error</code> | The error to pass to the observer's error method. |

**Example**  
```js
subscriber.error(new Error('Something went wrong'));
```
<a name="Subscriber+addTeardown"></a>

### subscriber.addTeardown(teardown)
Adds a teardown function to the teardowns array.

**Kind**: instance method of [<code>Subscriber</code>](#Subscriber)  

| Param | Type | Description |
| --- | --- | --- |
| teardown | <code>function</code> | The teardown function to add to the teardowns array. |

<a name="Subscriber+unsubscribe"></a>

### subscriber.unsubscribe()
Unsubscribes from the observable, preventing any further notifications to the observer and triggering any teardown logic.

**Kind**: instance method of [<code>Subscriber</code>](#Subscriber)  
**Example**  
```js
subscriber.unsubscribe();
```
<a name="Observable"></a>

## Observable
**Kind**: global class  

* [Observable](#Observable)
    * [new Observable(subscribeCallback)](#new_Observable_new)
    * [.subscribe(observerOrNext, error, complete)](#Observable+subscribe) ⇒ <code>Object</code>
    * [.next(value)](#Observable+next)
    * [.error(error)](#Observable+error)
    * [.complete()](#Observable+complete)
    * [.onValue(callbackFn)](#Observable+onValue) ⇒ <code>Object</code>
    * [.onError(callbackFn)](#Observable+onError) ⇒ <code>Object</code>
    * [.onEnd(callbackFn)](#Observable+onEnd) ⇒ <code>Object</code>

<a name="new_Observable_new"></a>

### new Observable(subscribeCallback)
Class representing an Observable.


| Param | Type | Description |
| --- | --- | --- |
| subscribeCallback | <code>function</code> | The callback function to call when a new observer subscribes. |

<a name="Observable+subscribe"></a>

### observable.subscribe(observerOrNext, error, complete) ⇒ <code>Object</code>
Subscribes an observer to the observable.

**Kind**: instance method of [<code>Observable</code>](#Observable)  
**Returns**: <code>Object</code> - An object containing an unsubscribe method to stop receiving updates.  

| Param | Type | Description |
| --- | --- | --- |
| observerOrNext | [<code>Observer</code>](#Observer) \| <code>function</code> | The observer to subscribe or the next function. Default is an empty function. |
| error | <code>function</code> | The error function. Default is an empty function. |
| complete | <code>function</code> | The complete function. Default is an empty function. |

**Example**  
```js
const observable = new Observable();
const subscription = observable.subscribe({
  next: value => console.log(value),
  error: err => console.error(err),
  complete: () => console.log('Completed'),
});
```
<a name="Observable+next"></a>

### observable.next(value)
Passes a value to the observer's next method.

**Kind**: instance method of [<code>Observable</code>](#Observable)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to be passed to the observer's next method. |

**Example**  
```js
const observable = new Observable();
observable.next('Hello, world!');
```
<a name="Observable+error"></a>

### observable.error(error)
Passes an error to the observer's error method.

**Kind**: instance method of [<code>Observable</code>](#Observable)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>\*</code> | The error to be passed to the observer's error method. |

**Example**  
```js
const observable = new Observable();
observable.error(new Error('Something went wrong'));
```
<a name="Observable+complete"></a>

### observable.complete()
Calls the complete method on all observers.

**Kind**: instance method of [<code>Observable</code>](#Observable)  
**Example**  
```js
const observable = new Observable();
observable.complete();
```
<a name="Observable+onValue"></a>

### observable.onValue(callbackFn) ⇒ <code>Object</code>
Subscribes an observer with a next function to the observable.

**Kind**: instance method of [<code>Observable</code>](#Observable)  
**Returns**: <code>Object</code> - An object containing an unsubscribe method to stop receiving updates.  

| Param | Type | Description |
| --- | --- | --- |
| callbackFn | <code>function</code> | The callback function to call when a new value is emitted. |

**Example**  
```js
const observable = new Observable();
const subscription = observable.onValue(value => console.log(value));
```
<a name="Observable+onError"></a>

### observable.onError(callbackFn) ⇒ <code>Object</code>
Subscribes an observer with an error function to the observable.

**Kind**: instance method of [<code>Observable</code>](#Observable)  
**Returns**: <code>Object</code> - An object containing an unsubscribe method to stop receiving updates.  

| Param | Type | Description |
| --- | --- | --- |
| callbackFn | <code>function</code> | The callback function to call when an error is emitted. |

**Example**  
```js
const observable = new Observable();
const subscription = observable.onError(err => console.error(err));
```
<a name="Observable+onEnd"></a>

### observable.onEnd(callbackFn) ⇒ <code>Object</code>
Subscribes an observer with a complete function to the observable.

**Kind**: instance method of [<code>Observable</code>](#Observable)  
**Returns**: <code>Object</code> - An object containing an unsubscribe method to stop receiving updates.  

| Param | Type | Description |
| --- | --- | --- |
| callbackFn | <code>function</code> | The callback function to call when the observable completes. |

**Example**  
```js
const observable = new Observable();
const subscription = observable.onEnd(() => console.log('Completed'));
```
<a name="Observer"></a>

## Observer : <code>Object</code>
The observer object or function.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| next | <code>function</code> | Function to handle new values. |
| error | <code>function</code> | Function to handle errors. |
| complete | <code>function</code> | Function to handle completion. |

