<a name="ObservableStream"></a>

## ObservableStream ⇐ <code>Observable</code>
**Kind**: global class  
**Extends**: <code>Observable</code>  

* [ObservableStream](#ObservableStream) ⇐ <code>Observable</code>
    * [new ObservableStream()](#new_ObservableStream_new)
    * _instance_
        * [.map(transformFn)](#ObservableStream+map) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.filter(predicateFn)](#ObservableStream+filter) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.reduce(reducerFn, initialValue)](#ObservableStream+reduce) ⇒ <code>Promise</code>
        * [.takeUntil(notifier)](#ObservableStream+takeUntil) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.take(n)](#ObservableStream+take) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.drop(n)](#ObservableStream+drop) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.flatMap(transformFn)](#ObservableStream+flatMap) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.switchMap(transformFn)](#ObservableStream+switchMap) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.toArray()](#ObservableStream+toArray) ⇒ <code>Promise</code>
        * [.forEach(callback)](#ObservableStream+forEach) ⇒ <code>Promise</code>
        * [.every(predicate)](#ObservableStream+every) ⇒ <code>Promise</code>
        * [.find(predicate)](#ObservableStream+find) ⇒ <code>Promise</code>
        * [.some(predicate)](#ObservableStream+some) ⇒ <code>Promise</code>
        * [.finally(callback)](#ObservableStream+finally) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.toState()](#ObservableStream+toState) ⇒ <code>ObservableState</code>
        * [.push(value)](#ObservableStream+push)
        * [.plug(stream)](#ObservableStream+plug)
        * [.end()](#ObservableStream+end)
        * [.catchError(fn)](#ObservableStream+catchError) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.debounce(delay)](#ObservableStream+debounce) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.tap(sideEffectFn)](#ObservableStream+tap) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.throttle(duration)](#ObservableStream+throttle) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.distinctUntilChanged()](#ObservableStream+distinctUntilChanged) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.concatMap(transformFn)](#ObservableStream+concatMap) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.combineLatest(...observables)](#ObservableStream+combineLatest) ⇒ [<code>ObservableStream</code>](#ObservableStream)
        * [.startWith(...initialValues)](#ObservableStream+startWith) ⇒ [<code>ObservableStream</code>](#ObservableStream)
    * _static_
        * [.from(value)](#ObservableStream.from) ⇒ [<code>ObservableStream</code>](#ObservableStream)

<a name="new_ObservableStream_new"></a>

### new ObservableStream()
ObservableStream class that extends Observable and provides additional methods for data transformation

<a name="ObservableStream+map"></a>

### observableStream.map(transformFn) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream instance with transformed data  

| Param | Type | Description |
| --- | --- | --- |
| transformFn | <code>function</code> | The function to transform the data |

**Example**  
```js
// Example 1: Transforming an API data stream
const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
const observableStream = ObservableStream.from(apiDataStream);
const transformedStream = observableStream.map(data => data.map(item => item * 2));

// Example 2: Transforming a user event stream
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event));
});
const observableStream = ObservableStream.from(clickStream);
const transformedStream = observableStream.map(event => ({ x: event.clientX, y: event.clientY }));
```
<a name="ObservableStream+filter"></a>

### observableStream.filter(predicateFn) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream instance with filtered data  

| Param | Type | Description |
| --- | --- | --- |
| predicateFn | <code>function</code> | The function to filter the data |

**Example**  
```js
// Example 1: Filtering an API data stream
const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
const observableStream = ObservableStream.from(apiDataStream);
const filteredStream = observableStream.filter(data => data.someProperty === 'someValue');

// Example 2: Filtering a user event stream
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event));
});
const observableStream = ObservableStream.from(clickStream);
const filteredStream = observableStream.filter(event => event.target.id === 'someId');
```
<a name="ObservableStream+reduce"></a>

### observableStream.reduce(reducerFn, initialValue) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: <code>Promise</code> - A promise that resolves with the reduced value  

| Param | Type | Description |
| --- | --- | --- |
| reducerFn | <code>function</code> | The function to reduce the data |
| initialValue | <code>any</code> | The initial value for the reducer |

**Example**  
```js
// Example 1: Reducing an API data stream
const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
const observableStream = ObservableStream.from(apiDataStream);
const reducedValuePromise = observableStream.reduce((acc, data) => acc + data.someProperty, 0);

// Example 2: Reducing a user event stream
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event));
});
const observableStream = ObservableStream.from(clickStream);
const reducedValuePromise = observableStream.reduce((acc, event) => acc + 1, 0);
```
<a name="ObservableStream+takeUntil"></a>

### observableStream.takeUntil(notifier) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that completes when the notifier emits  

| Param | Type | Description |
| --- | --- | --- |
| notifier | <code>Observable</code> | The Observable that will complete this Observable |

**Example**  
```js
// Example 1: Completing an API data stream when another stream emits
const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
const observableStream = ObservableStream.from(apiDataStream);
const notifierStream = new ObservableStream(subscriber => {
  setTimeout(() => subscriber.next(), 5000);
});
const completedStream = observableStream.takeUntil(notifierStream);

// Example 2: Completing a user event stream when another stream emits
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event));
});
const observableStream = ObservableStream.from(clickStream);
const notifierStream = new ObservableStream(subscriber => {
  setTimeout(() => subscriber.next(), 5000);
});
const completedStream = observableStream.takeUntil(notifierStream);
```
<a name="ObservableStream+take"></a>

### observableStream.take(n) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that completes after emitting n values  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | The number of values to take |

**Example**  
```js
// Example 1: Taking a certain number of values from an API data stream
const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
const observableStream = ObservableStream.from(apiDataStream);
const takenStream = observableStream.take(5);

// Example 2: Taking a certain number of values from a user event stream
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event));
});
const observableStream = ObservableStream.from(clickStream);
const takenStream = observableStream.take(5);
```
<a name="ObservableStream+drop"></a>

### observableStream.drop(n) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that starts emitting after n values have been emitted  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | The number of values to drop |

**Example**  
```js
// Example 1: Dropping a certain number of values from an API data stream
const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
const observableStream = ObservableStream.from(apiDataStream);
const droppedStream = observableStream.drop(5);

// Example 2: Dropping a certain number of values from a user event stream
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event));
});
const observableStream = ObservableStream.from(clickStream);
const droppedStream = observableStream.drop(5);
```
<a name="ObservableStream+flatMap"></a>

### observableStream.flatMap(transformFn) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that emits the values from the inner Observables  

| Param | Type | Description |
| --- | --- | --- |
| transformFn | <code>function</code> | The function to transform the data into Observables |

**Example**  
```js
// Example 1: Transforming an API data stream into inner Observables
const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
const observableStream = ObservableStream.from(apiDataStream);
const flatMappedStream = observableStream.flatMap(data => ObservableStream.from(fetch(`https://api.example.com/data/${data.id}`).then(response => response.json())));

// Example 2: Transforming a user event stream into inner Observables
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event));
});
const positionStream = clickStream.flatMap(event => ObservableStream.from({ x: event.clientX, y: event.clientY }));

// Example 3: Transforming a stream of search terms into a stream of search results
const searchTerms = new ObservableStream(subscriber => {
  const input = document.querySelector('#search-input');
  input.addEventListener('input', event => subscriber.next(event.target.value));
});
const searchResults = searchTerms.debounce(300).flatMap(term => ObservableStream.from(fetch(`https://api.example.com/search?q=${term}`).then(response => response.json())));
```
<a name="ObservableStream+switchMap"></a>

### observableStream.switchMap(transformFn) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that emits the values from the inner Observables  

| Param | Type | Description |
| --- | --- | --- |
| transformFn | <code>function</code> | The function to transform the data into Observables |

**Example**  
```js
// Example 1: Transforming click events into Observables
const clickStream = new ObservableStream();
document.addEventListener('click', (event) => clickStream.push(event));
const positionStream = clickStream.switchMap((event) => {
  return new ObservableStream((subscriber) => {
    subscriber.push({ x: event.clientX, y: event.clientY });
    subscriber.complete();
  });
});
positionStream.subscribe({
  next: (position) => console.log(`Clicked at position: ${position.x}, ${position.y}`),
  error: (err) => console.error(err),
});

// Example 2: Transforming API responses into Observables
const apiStream = new ObservableStream();
fetch('https://api.example.com/data')
  .then((response) => response.json())
  .then((data) => apiStream.push(data))
  .catch((error) => apiStream.error(error));
const transformedStream = apiStream.switchMap((data) => {
  return new ObservableStream((subscriber) => {
    subscriber.push(transformData(data));
    subscriber.complete();
  });
});
transformedStream.subscribe({
  next: (transformedData) => console.log(transformedData),
  error: (err) => console.error(err),
});
```
<a name="ObservableStream+toArray"></a>

### observableStream.toArray() ⇒ <code>Promise</code>
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: <code>Promise</code> - A promise that resolves with an array of all values emitted by the Observable  
**Example**  
```js
// Example: Collecting all emitted values from an ObservableStream
const numberStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  numberStream.push(i);
}
numberStream.end();
numberStream.toArray().then((values) => console.log(values)); // Logs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```
<a name="ObservableStream+forEach"></a>

### observableStream.forEach(callback) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: <code>Promise</code> - A promise that resolves when the Observable completes  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The function to call for each value emitted by the Observable |

**Example**  
```js
// Example: Logging each value emitted by an ObservableStream
const numberStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  numberStream.push(i);
}
numberStream.end();
numberStream.forEach((value) => console.log(value)); // Logs each number from 0 to 9
```
<a name="ObservableStream+every"></a>

### observableStream.every(predicate) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: <code>Promise</code> - A promise that resolves with a boolean indicating whether every value satisfies the predicate  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | The function to test each value |

**Example**  
```js
// Example: Checking if all emitted values are even
const numberStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  numberStream.push(i);
}
numberStream.end();
numberStream.every((value) => value % 2 === 0).then((allEven) => console.log(allEven)); // Logs: false
```
<a name="ObservableStream+find"></a>

### observableStream.find(predicate) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: <code>Promise</code> - A promise that resolves with the first value that satisfies the predicate  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | The function to test each value |

**Example**  
```js
// Example: Finding the first emitted value that is greater than 5
const numberStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  numberStream.push(i);
}
numberStream.end();
numberStream.find((value) => value > 5).then((value) => console.log(value)); // Logs: 6
```
<a name="ObservableStream+some"></a>

### observableStream.some(predicate) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: <code>Promise</code> - A promise that resolves with a boolean indicating whether some value satisfies the predicate  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | The function to test each value |

**Example**  
```js
// Example: Checking if any emitted values are greater than 5
const numberStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  numberStream.push(i);
}
numberStream.end();
numberStream.some((value) => value > 5).then((anyGreaterThan5) => console.log(anyGreaterThan5)); // Logs: true
```
<a name="ObservableStream+finally"></a>

### observableStream.finally(callback) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that calls the callback when it completes  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The function to call when the Observable completes |

**Example**  
```js
// Example: Logging a message when the ObservableStream completes
const numberStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  numberStream.push(i);
}
numberStream.end();
const finalStream = numberStream.finally(() => console.log('Stream completed'));
finalStream.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
}); // Logs each number from 0 to 9, then logs 'Stream completed'
```
<a name="ObservableStream+toState"></a>

### observableStream.toState() ⇒ <code>ObservableState</code>
Converts the ObservableStream to an ObservableState

**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: <code>ObservableState</code> - A new ObservableState that represents the current value of the stream  
**Example**  
```js
// Example: Converting an ObservableStream to an ObservableState
const numberStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  numberStream.push(i);
}
numberStream.end();
const numberState = numberStream.toState();
numberState.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
}); // Logs each number from 0 to 9
```
<a name="ObservableStream+push"></a>

### observableStream.push(value)
Pushes a value to the observers. The value can be an Observable, an async iterable, an iterable, a Promise, or any other value.

**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to push |

**Example**  
```js
// Example 1: Pushing values from an Observable
const sourceStream = new ObservableStream();
const targetStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  sourceStream.push(i);
}
sourceStream.end();
targetStream.push(sourceStream);
targetStream.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
}); // Logs each number from 0 to 9

// Example 2: Pushing values from a Promise
const promiseStream = new ObservableStream();
const promise = new Promise((resolve) => {
  setTimeout(() => resolve('Hello, world!'), 1000);
});
promiseStream.push(promise);
promiseStream.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
}); // Logs 'Hello, world!' after 1 second
```
<a name="ObservableStream+plug"></a>

### observableStream.plug(stream)
Subscribes to a stream and pushes its values to the observers.

**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  

| Param | Type | Description |
| --- | --- | --- |
| stream | [<code>ObservableStream</code>](#ObservableStream) | The stream to plug |

**Example**  
```js
// Example: Plugging one ObservableStream into another
const sourceStream = new ObservableStream();
const targetStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  sourceStream.push(i);
}
sourceStream.end();
targetStream.plug(sourceStream);
targetStream.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
}); // Logs each number from 0 to 9
```
<a name="ObservableStream+end"></a>

### observableStream.end()
Ends the stream by calling the complete method of each observer.

**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Example**  
```js
// Example: Ending an ObservableStream
const numberStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  numberStream.push(i);
}
numberStream.end();
numberStream.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
  complete: () => console.log('Stream completed'),
}); // Logs each number from 0 to 9, then logs 'Stream completed'
```
<a name="ObservableStream+catchError"></a>

### observableStream.catchError(fn) ⇒ [<code>ObservableStream</code>](#ObservableStream)
Catches errors on the ObservableStream and replaces them with a new stream.

**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - - Returns a new ObservableStream that replaces the original stream when an error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A function that receives the error and returns a new ObservableStream. |

**Example**  
```js
// Example: Catching and handling errors in an ObservableStream
const numberStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    numberStream.error(new Error('Something went wrong'));
  } else {
    numberStream.push(i);
  }
}
numberStream.end();
const errorHandledStream = numberStream.catchError((error) => {
  console.error(error);
  return new ObservableStream((subscriber) => {
    subscriber.push('Error handled');
    subscriber.complete();
  });
});
errorHandledStream.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
}); // Logs each number from 0 to 4, logs the error, then logs 'Error handled'
```
<a name="ObservableStream+debounce"></a>

### observableStream.debounce(delay) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that emits the latest value after the debounce delay  

| Param | Type | Description |
| --- | --- | --- |
| delay | <code>number</code> | The debounce delay in milliseconds |

**Example**  
```js
// Example: Debouncing an ObservableStream of click events
const clickStream = new ObservableStream();
document.addEventListener('click', (event) => clickStream.push(event));
const debouncedStream = clickStream.debounce(500);
debouncedStream.subscribe({
  next: (event) => console.log(`Clicked at position: ${event.clientX}, ${event.clientY}`),
  error: (err) => console.error(err),
}); // Logs the position of the last click event that occurred at least 500 milliseconds after the previous click event
```
<a name="ObservableStream+tap"></a>

### observableStream.tap(sideEffectFn) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that is identical to the source  

| Param | Type | Description |
| --- | --- | --- |
| sideEffectFn | <code>function</code> | The function to perform side effect |

**Example**  
```js
// Example: Logging each value emitted by an ObservableStream
const numberStream = new ObservableStream();
for (let i = 0; i < 10; i++) {
  numberStream.push(i);
}
numberStream.end();
const loggedStream = numberStream.tap((value) => console.log(value));
loggedStream.subscribe({
  next: (value) => {},
  error: (err) => console.error(err),
}); // Logs each number from 0 to 9
```
<a name="ObservableStream+throttle"></a>

### observableStream.throttle(duration) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that emits a value then ignores subsequent source values for duration milliseconds, then repeats this process.  

| Param | Type | Description |
| --- | --- | --- |
| duration | <code>number</code> | The throttle duration in milliseconds |

**Example**  
```js
// Example 1: Throttling scroll events
const scrollStream = new ObservableStream(subscriber => {
  window.addEventListener('scroll', event => subscriber.next(event));
});
const throttledScrollStream = scrollStream.throttle(200);
throttledScrollStream.subscribe({
  next: (event) => console.log('Scroll event:', event),
  error: (err) => console.error(err),
});

// Example 2: Throttling search input for autocomplete
const searchInput = document.querySelector('#search-input');
const searchStream = new ObservableStream(subscriber => {
  searchInput.addEventListener('input', event => subscriber.next(event.target.value));
});
const throttledSearchStream = searchStream.throttle(300);
throttledSearchStream.subscribe({
  next: (searchTerm) => console.log('Search term:', searchTerm),
  error: (err) => console.error(err),
});
```
<a name="ObservableStream+distinctUntilChanged"></a>

### observableStream.distinctUntilChanged() ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that emits all items emitted by the source Observable that are distinct by comparison from the previous item.  
**Example**  
```js
// Example 1: Filtering out consecutive duplicate search terms
const searchInput = document.querySelector('#search-input');
const searchStream = new ObservableStream(subscriber => {
  searchInput.addEventListener('input', event => subscriber.next(event.target.value));
});
const distinctSearchStream = searchStream.distinctUntilChanged();
distinctSearchStream.subscribe({
  next: (searchTerm) => console.log('Search term:', searchTerm),
  error: (err) => console.error(err),
});

// Example 2: Filtering out consecutive duplicate API responses
const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
const observableStream = ObservableStream.from(apiDataStream);
const distinctDataStream = observableStream.distinctUntilChanged();
distinctDataStream.subscribe({
  next: (data) => console.log('API data:', data),
  error: (err) => console.error(err),
});
```
<a name="ObservableStream+concatMap"></a>

### observableStream.concatMap(transformFn) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that emits the results of applying a given transform function to each value emitted by the source ObservableStream, sequentially.  

| Param | Type | Description |
| --- | --- | --- |
| transformFn | <code>function</code> | The function to transform each value in the source ObservableStream |

**Example**  
```js
// Example 1: Transforming a stream of search terms into a stream of search results
const searchInput = document.querySelector('#search-input');
const searchStream = new ObservableStream(subscriber => {
  searchInput.addEventListener('input', event => subscriber.next(event.target.value));
});
const resultsStream = searchStream.concatMap(searchTerm =>
  ObservableStream.from(fetch(`https://api.example.com/search?query=${searchTerm}`).then(response => response.json()))
);
resultsStream.subscribe({
  next: (results) => console.log('Search results:', results),
  error: (err) => console.error(err),
});

// Example 2: Transforming a stream of click events into a stream of clicked elements
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event.target));
});
const elementsStream = clickStream.concatMap(target =>
  ObservableStream.from(Promise.resolve(target))
);
elementsStream.subscribe({
  next: (element) => console.log('Clicked element:', element),
  error: (err) => console.error(err),
});
```
<a name="ObservableStream+combineLatest"></a>

### observableStream.combineLatest(...observables) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that emits an array with the latest values from each source ObservableStream, whenever any source ObservableStream emits.  

| Param | Type | Description |
| --- | --- | --- |
| ...observables | [<code>ObservableStream</code>](#ObservableStream) | The source ObservableStreams |

**Example**  
```js
// Example 1: Combining multiple API data streams
const apiDataStream1 = fetch('https://api.example.com/data1').then(response => response.json());
const apiDataStream2 = fetch('https://api.example.com/data2').then(response => response.json());
const observableStream1 = ObservableStream.from(apiDataStream1);
const observableStream2 = ObservableStream.from(apiDataStream2);
const combinedStream = observableStream1.combineLatest(observableStream2);
combinedStream.subscribe({
  next: ([data1, data2]) => console.log('API data:', data1, data2),
  error: (err) => console.error(err),
});

// Example 2: Combining multiple user event streams
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event));
});
const scrollStream = new ObservableStream(subscriber => {
  window.addEventListener('scroll', event => subscriber.next(event));
});
const combinedStream = clickStream.combineLatest(scrollStream);
combinedStream.subscribe({
  next: ([clickEvent, scrollEvent]) => console.log('User events:', clickEvent, scrollEvent),
  error: (err) => console.error(err),
});
```
<a name="ObservableStream+startWith"></a>

### observableStream.startWith(...initialValues) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: instance method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that emits the specified initial values, followed by all values emitted by the source ObservableStream.  

| Param | Type | Description |
| --- | --- | --- |
| ...initialValues | <code>any</code> | The initial values to start with |

**Example**  
```js
// Example 1: Prepending an API data stream with a loading state
const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
const observableStream = ObservableStream.from(apiDataStream);
const loadingStream = observableStream.startWith('loading');
loadingStream.subscribe({
  next: (state) => console.log('State:', state),
  error: (err) => console.error(err),
});

// Example 2: Prepending a user event stream with an initial event
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event));
});
const initialEvent = { type: 'initial' };
const eventStream = clickStream.startWith(initialEvent);
eventStream.subscribe({
  next: (event) => console.log('Event:', event),
  error: (err) => console.error(err),
});
```
<a name="ObservableStream.from"></a>

### ObservableStream.from(value) ⇒ [<code>ObservableStream</code>](#ObservableStream)
**Kind**: static method of [<code>ObservableStream</code>](#ObservableStream)  
**Returns**: [<code>ObservableStream</code>](#ObservableStream) - A new ObservableStream that emits the values from the value  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to create an Observable from |

**Example**  
```js
// Example 1: Creating an ObservableStream from a user event stream
const clickStream = new ObservableStream(subscriber => {
  document.addEventListener('click', event => subscriber.next(event));
});
const observableStream = ObservableStream.from(clickStream);
```
