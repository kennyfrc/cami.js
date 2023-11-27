## Classes

<dl>
<dt><a href="#ObservableState">ObservableState</a> ⇐ <code>Observable</code></dt>
<dd></dd>
<dt><a href="#ComputedState">ComputedState</a> ⇐ <code><a href="#ObservableState">ObservableState</a></code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#computed">computed(computeFn)</a> ⇒ <code><a href="#ComputedState">ComputedState</a></code></dt>
<dd></dd>
<dt><a href="#effect">effect(effectFn)</a> ⇒ <code>function</code></dt>
<dd><p>This function sets up an effect that is run when the observable changes</p>
</dd>
</dl>

<a name="ObservableState"></a>

## ObservableState ⇐ <code>Observable</code>
**Kind**: global class  
**Extends**: <code>Observable</code>  

* [ObservableState](#ObservableState) ⇐ <code>Observable</code>
    * [new ObservableState(initialValue, subscriber, options)](#new_ObservableState_new)
    * [.value()](#ObservableState+value) ⇒ <code>any</code>
    * [.value(newValue)](#ObservableState+value)
    * [.assign(obj)](#ObservableState+assign)
    * [.set(key, value)](#ObservableState+set)
    * [.delete(key)](#ObservableState+delete)
    * [.clear()](#ObservableState+clear)
    * [.push(...elements)](#ObservableState+push)
    * [.pop()](#ObservableState+pop)
    * [.shift()](#ObservableState+shift)
    * [.splice(start, deleteCount, ...items)](#ObservableState+splice)
    * [.unshift(...elements)](#ObservableState+unshift)
    * [.reverse()](#ObservableState+reverse)
    * [.sort([compareFunction])](#ObservableState+sort)
    * [.fill(value, [start], [end])](#ObservableState+fill)
    * [.copyWithin(target, start, [end])](#ObservableState+copyWithin)
    * [.update(updater)](#ObservableState+update)
    * [.toStream()](#ObservableState+toStream) ⇒ <code>ObservableStream</code>
    * [.complete()](#ObservableState+complete)

<a name="new_ObservableState_new"></a>

### new ObservableState(initialValue, subscriber, options)
This class extends the Observable class and adds methods for updating the value of the observable.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| initialValue | <code>any</code> | <code></code> | The initial value of the observable |
| subscriber | <code>Subscriber</code> | <code></code> | The subscriber to the observable |
| options | <code>Object</code> |  | Additional options for the observable |
| options.last | <code>boolean</code> |  | Whether the subscriber is the last observer |

**Example**  
```js
import { ObservableState } from 'cami-js';
const observable = new ObservableState(10);
console.log(observable.value); // 10
```
<a name="ObservableState+value"></a>

### observableState.value() ⇒ <code>any</code>
**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  
**Returns**: <code>any</code> - The current value of the observable  
**Example**  
```js
const value = observable.value;
```
<a name="ObservableState+value"></a>

### observableState.value(newValue)
This method sets a new value for the observable by calling the update method with the new value.

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>any</code> | The new value to set for the observable |

**Example**  
```js
observable.value = 20;
```
<a name="ObservableState+assign"></a>

### observableState.assign(obj)
Merges properties from the provided object into the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object whose properties to merge |

**Example**  
```js
observable.assign({ key: 'value' });
```
<a name="ObservableState+set"></a>

### observableState.set(key, value)
Sets a new key/value pair in the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to set |
| value | <code>any</code> | The value to set |

**Example**  
```js
observable.set('key', 'value');
```
<a name="ObservableState+delete"></a>

### observableState.delete(key)
Removes a key/value pair from the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to remove |

**Example**  
```js
observable.delete('key');
```
<a name="ObservableState+clear"></a>

### observableState.clear()
Removes all key/value pairs from the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  
**Example**  
```js
observable.clear();
```
<a name="ObservableState+push"></a>

### observableState.push(...elements)
Adds one or more elements to the end of the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Description |
| --- | --- | --- |
| ...elements | <code>any</code> | The elements to add |

**Example**  
```js
observable.push(1, 2, 3);
```
<a name="ObservableState+pop"></a>

### observableState.pop()
Removes the last element from the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  
**Example**  
```js
observable.pop();
```
<a name="ObservableState+shift"></a>

### observableState.shift()
Removes the first element from the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  
**Example**  
```js
observable.shift();
```
<a name="ObservableState+splice"></a>

### observableState.splice(start, deleteCount, ...items)
Changes the contents of the observable's value by removing, replacing, or adding elements

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>number</code> | The index at which to start changing the array |
| deleteCount | <code>number</code> | The number of elements to remove |
| ...items | <code>any</code> | The elements to add to the array |

**Example**  
```js
observable.splice(0, 1, 'newElement');
```
<a name="ObservableState+unshift"></a>

### observableState.unshift(...elements)
Adds one or more elements to the beginning of the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Description |
| --- | --- | --- |
| ...elements | <code>any</code> | The elements to add |

**Example**  
```js
observable.unshift('newElement');
```
<a name="ObservableState+reverse"></a>

### observableState.reverse()
Reverses the order of the elements in the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  
**Example**  
```js
observable.reverse();
```
<a name="ObservableState+sort"></a>

### observableState.sort([compareFunction])
Sorts the elements in the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Description |
| --- | --- | --- |
| [compareFunction] | <code>function</code> | The function used to determine the order of the elements |

**Example**  
```js
observable.sort((a, b) => a - b);
```
<a name="ObservableState+fill"></a>

### observableState.fill(value, [start], [end])
Changes all elements in the observable's value to a static value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | The value to fill the array with |
| [start] | <code>number</code> | <code>0</code> | The index to start filling at |
| [end] | <code>number</code> | <code>this._value.length</code> | The index to stop filling at |

**Example**  
```js
observable.fill('newElement', 0, 2);
```
<a name="ObservableState+copyWithin"></a>

### observableState.copyWithin(target, start, [end])
Shallow copies part of the observable's value to another location in the same array

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| target | <code>number</code> |  | The index to copy the elements to |
| start | <code>number</code> |  | The start index to begin copying elements from |
| [end] | <code>number</code> | <code>this._value.length</code> | The end index to stop copying elements from |

**Example**  
```js
observable.copyWithin(0, 1, 2);
```
<a name="ObservableState+update"></a>

### observableState.update(updater)
This method adds the updater function to the pending updates queue.
It uses a synchronous approach to schedule the updates, ensuring the whole state is consistent at each tick.
This is done to batch multiple updates together and avoid unnecessary re-renders.

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  

| Param | Type | Description |
| --- | --- | --- |
| updater | <code>function</code> | The function to update the value |

**Example**  
```js
observable.update(value => value + 1);
```
<a name="ObservableState+toStream"></a>

### observableState.toStream() ⇒ <code>ObservableStream</code>
Converts the ObservableState to an ObservableStream.

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  
**Returns**: <code>ObservableStream</code> - The ObservableStream that emits the same values as the ObservableState.  
**Example**  
```js
const stream = observable.toStream();
```
<a name="ObservableState+complete"></a>

### observableState.complete()
Calls the complete method of all observers.

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)  
**Example**  
```js
observable.complete();
```
<a name="ComputedState"></a>

## ComputedState ⇐ [<code>ObservableState</code>](#ObservableState)
**Kind**: global class  
**Extends**: [<code>ObservableState</code>](#ObservableState)  

* [ComputedState](#ComputedState) ⇐ [<code>ObservableState</code>](#ObservableState)
    * [new ComputedState(computeFn)](#new_ComputedState_new)
    * [.value()](#ComputedState+value) ⇒ <code>any</code>
    * [.dispose()](#ComputedState+dispose)
    * [.assign(obj)](#ObservableState+assign)
    * [.set(key, value)](#ObservableState+set)
    * [.delete(key)](#ObservableState+delete)
    * [.clear()](#ObservableState+clear)
    * [.push(...elements)](#ObservableState+push)
    * [.pop()](#ObservableState+pop)
    * [.shift()](#ObservableState+shift)
    * [.splice(start, deleteCount, ...items)](#ObservableState+splice)
    * [.unshift(...elements)](#ObservableState+unshift)
    * [.reverse()](#ObservableState+reverse)
    * [.sort([compareFunction])](#ObservableState+sort)
    * [.fill(value, [start], [end])](#ObservableState+fill)
    * [.copyWithin(target, start, [end])](#ObservableState+copyWithin)
    * [.update(updater)](#ObservableState+update)
    * [.toStream()](#ObservableState+toStream) ⇒ <code>ObservableStream</code>
    * [.complete()](#ObservableState+complete)

<a name="new_ComputedState_new"></a>

### new ComputedState(computeFn)
ComputedState class that extends ObservableState and holds additional methods for computed observables


| Param | Type | Description |
| --- | --- | --- |
| computeFn | <code>function</code> | The function to compute the value of the observable |

**Example**  
```js
const computedState = new ComputedState(() => observable.value * 2);
```
<a name="ComputedState+value"></a>

### computedState.value() ⇒ <code>any</code>
**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>value</code>](#ObservableState+value)  
**Returns**: <code>any</code> - The current value of the observable  
**Example**  
```js
const value = computedState.value;
```
<a name="ComputedState+dispose"></a>

### computedState.dispose()
Unsubscribes from all dependencies

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Example**  
```js
// Assuming `obs` is an instance of ObservableState
obs.dispose(); // This will unsubscribe obs from all its dependencies
```
<a name="ObservableState+assign"></a>

### computedState.assign(obj)
Merges properties from the provided object into the observable's value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>assign</code>](#ObservableState+assign)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object whose properties to merge |

**Example**  
```js
observable.assign({ key: 'value' });
```
<a name="ObservableState+set"></a>

### computedState.set(key, value)
Sets a new key/value pair in the observable's value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>set</code>](#ObservableState+set)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to set |
| value | <code>any</code> | The value to set |

**Example**  
```js
observable.set('key', 'value');
```
<a name="ObservableState+delete"></a>

### computedState.delete(key)
Removes a key/value pair from the observable's value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>delete</code>](#ObservableState+delete)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to remove |

**Example**  
```js
observable.delete('key');
```
<a name="ObservableState+clear"></a>

### computedState.clear()
Removes all key/value pairs from the observable's value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>clear</code>](#ObservableState+clear)  
**Example**  
```js
observable.clear();
```
<a name="ObservableState+push"></a>

### computedState.push(...elements)
Adds one or more elements to the end of the observable's value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>push</code>](#ObservableState+push)  

| Param | Type | Description |
| --- | --- | --- |
| ...elements | <code>any</code> | The elements to add |

**Example**  
```js
observable.push(1, 2, 3);
```
<a name="ObservableState+pop"></a>

### computedState.pop()
Removes the last element from the observable's value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>pop</code>](#ObservableState+pop)  
**Example**  
```js
observable.pop();
```
<a name="ObservableState+shift"></a>

### computedState.shift()
Removes the first element from the observable's value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>shift</code>](#ObservableState+shift)  
**Example**  
```js
observable.shift();
```
<a name="ObservableState+splice"></a>

### computedState.splice(start, deleteCount, ...items)
Changes the contents of the observable's value by removing, replacing, or adding elements

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>splice</code>](#ObservableState+splice)  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>number</code> | The index at which to start changing the array |
| deleteCount | <code>number</code> | The number of elements to remove |
| ...items | <code>any</code> | The elements to add to the array |

**Example**  
```js
observable.splice(0, 1, 'newElement');
```
<a name="ObservableState+unshift"></a>

### computedState.unshift(...elements)
Adds one or more elements to the beginning of the observable's value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>unshift</code>](#ObservableState+unshift)  

| Param | Type | Description |
| --- | --- | --- |
| ...elements | <code>any</code> | The elements to add |

**Example**  
```js
observable.unshift('newElement');
```
<a name="ObservableState+reverse"></a>

### computedState.reverse()
Reverses the order of the elements in the observable's value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>reverse</code>](#ObservableState+reverse)  
**Example**  
```js
observable.reverse();
```
<a name="ObservableState+sort"></a>

### computedState.sort([compareFunction])
Sorts the elements in the observable's value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>sort</code>](#ObservableState+sort)  

| Param | Type | Description |
| --- | --- | --- |
| [compareFunction] | <code>function</code> | The function used to determine the order of the elements |

**Example**  
```js
observable.sort((a, b) => a - b);
```
<a name="ObservableState+fill"></a>

### computedState.fill(value, [start], [end])
Changes all elements in the observable's value to a static value

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>fill</code>](#ObservableState+fill)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | The value to fill the array with |
| [start] | <code>number</code> | <code>0</code> | The index to start filling at |
| [end] | <code>number</code> | <code>this._value.length</code> | The index to stop filling at |

**Example**  
```js
observable.fill('newElement', 0, 2);
```
<a name="ObservableState+copyWithin"></a>

### computedState.copyWithin(target, start, [end])
Shallow copies part of the observable's value to another location in the same array

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>copyWithin</code>](#ObservableState+copyWithin)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| target | <code>number</code> |  | The index to copy the elements to |
| start | <code>number</code> |  | The start index to begin copying elements from |
| [end] | <code>number</code> | <code>this._value.length</code> | The end index to stop copying elements from |

**Example**  
```js
observable.copyWithin(0, 1, 2);
```
<a name="ObservableState+update"></a>

### computedState.update(updater)
This method adds the updater function to the pending updates queue.
It uses a synchronous approach to schedule the updates, ensuring the whole state is consistent at each tick.
This is done to batch multiple updates together and avoid unnecessary re-renders.

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>update</code>](#ObservableState+update)  

| Param | Type | Description |
| --- | --- | --- |
| updater | <code>function</code> | The function to update the value |

**Example**  
```js
observable.update(value => value + 1);
```
<a name="ObservableState+toStream"></a>

### computedState.toStream() ⇒ <code>ObservableStream</code>
Converts the ObservableState to an ObservableStream.

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>toStream</code>](#ObservableState+toStream)  
**Returns**: <code>ObservableStream</code> - The ObservableStream that emits the same values as the ObservableState.  
**Example**  
```js
const stream = observable.toStream();
```
<a name="ObservableState+complete"></a>

### computedState.complete()
Calls the complete method of all observers.

**Kind**: instance method of [<code>ComputedState</code>](#ComputedState)  
**Overrides**: [<code>complete</code>](#ObservableState+complete)  
**Example**  
```js
observable.complete();
```
<a name="computed"></a>

## computed(computeFn) ⇒ [<code>ComputedState</code>](#ComputedState)
**Kind**: global function  
**Returns**: [<code>ComputedState</code>](#ComputedState) - A new instance of ComputedState  

| Param | Type | Description |
| --- | --- | --- |
| computeFn | <code>function</code> | The function to compute the value of the observable |

**Example**  
```js
// Assuming `computeFn` is a function that computes the value of the observable
const computedValue = computed(computeFn);
```
<a name="effect"></a>

## effect(effectFn) ⇒ <code>function</code>
This function sets up an effect that is run when the observable changes

**Kind**: global function  
**Returns**: <code>function</code> - A function that when called, unsubscribes from all dependencies and runs cleanup function  

| Param | Type | Description |
| --- | --- | --- |
| effectFn | <code>function</code> | The function to call for the effect |

**Example**  
```js
// Assuming `effectFn` is a function that is called when the observable changes
const effectFunction = effect(effectFn);
```

* [effect(effectFn)](#effect) ⇒ <code>function</code>
    * [~tracker](#effect..tracker)
    * [~_runEffect()](#effect.._runEffect)
    * [~dispose()](#effect..dispose) ⇒ <code>void</code>

<a name="effect..tracker"></a>

### effect~tracker
The tracker object is used to keep track of dependencies for the effect function.
It provides a method to add a dependency (an observable) to the dependencies set.
If the observable is not already a dependency, it is added to the set and a subscription is created
to run the effect function whenever the observable's value changes.
This mechanism allows the effect function to respond to state changes in its dependencies.

**Kind**: inner constant of [<code>effect</code>](#effect)  
<a name="effect.._runEffect"></a>

### effect~\_runEffect()
The _runEffect function is responsible for running the effect function and managing its dependencies.
Before the effect function is run, any cleanup from the previous run is performed and the current tracker
is set to this tracker. This allows the effect function to add dependencies via the tracker while it is running.
After the effect function has run, the current tracker is set back to null to prevent further dependencies
from being added outside of the effect function.
The effect function is expected to return a cleanup function, which is saved for the next run.
The cleanup function, initially empty, is replaced by the one returned from effectFn (run by the observable) before each new run and on effect disposal.

**Kind**: inner method of [<code>effect</code>](#effect)  
<a name="effect..dispose"></a>

### effect~dispose() ⇒ <code>void</code>
Unsubscribes from all dependencies and runs cleanup function

**Kind**: inner method of [<code>effect</code>](#effect)  
**Example**  
```js
// Assuming `dispose` is the function returned by `effect`
dispose(); // This will unsubscribe from all dependencies and run cleanup function
```
