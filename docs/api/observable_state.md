## Classes

<dl>
<dt><a href="#ObservableState">ObservableState</a> ⇐ <code>Observable</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
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
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    import { ObservableState } from 'cami';
    const observable = new ObservableState(10);
    console.log(observable.value); // 10
    ```

=== "TypeScript"

    ```typescript
    import { ObservableState } from 'cami';
    const observable = new ObservableState<number>(10);
    console.log(observable.value); // 10
    ```
<a name="ObservableState+value"></a>

### observableState.value() ⇒ <code>any</code>
**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)
**Returns**: <code>any</code> - The current value of the observable
**Example**
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    const value = observable.value;
    ```

=== "TypeScript"

    ```typescript
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
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.value = 20;
    ```

=== "TypeScript"

    ```typescript
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
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.assign({ key: 'value' });
    ```

=== "TypeScript"

    ```typescript
    observable.assign({ key: 'value' });
    ```
<a name="ObservableState+set"></a>

### observableState.set(key, value)
Sets a new value for a specific key in the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)
**Throws**:

- Will throw an error if the observable's value is not an object


| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to set the new value for |
| value | <code>any</code> | The new value to set |

**Example**
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.set('key.subkey', 'new value');
    ```

=== "TypeScript"

    ```typescript
    observable.set('key.subkey', 'new value');
    ```
<a name="ObservableState+delete"></a>

### observableState.delete(key)
Deletes a specific key from the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)
**Throws**:

- Will throw an error if the observable's value is not an object


| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to delete |

**Example**
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.delete('key.subkey');
    ```

=== "TypeScript"

    ```typescript
    observable.delete('key.subkey');
    ```
<a name="ObservableState+clear"></a>

### observableState.clear()
Removes all key/value pairs from the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)
**Example**
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.clear();
    ```

=== "TypeScript"

    ```typescript
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
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.push(1, 2, 3);
    ```

=== "TypeScript"

    ```typescript
    observable.push(1, 2, 3);
    ```
<a name="ObservableState+pop"></a>

### observableState.pop()
Removes the last element from the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)
**Example**
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.pop();
    ```

=== "TypeScript"

    ```typescript
    observable.pop();
    ```
<a name="ObservableState+shift"></a>

### observableState.shift()
Removes the first element from the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)
**Example**
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.shift();
    ```

=== "TypeScript"

    ```typescript
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
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.splice(0, 1, 'newElement');
    ```

=== "TypeScript"

    ```typescript
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
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.unshift('newElement');
    ```

=== "TypeScript"

    ```typescript
    observable.unshift('newElement');
    ```
<a name="ObservableState+reverse"></a>

### observableState.reverse()
Reverses the order of the elements in the observable's value

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)
**Example**
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.reverse();
    ```

=== "TypeScript"

    ```typescript
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
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.sort((a, b) => a - b);
    ```

=== "TypeScript"

    ```typescript
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
| [end] | <code>number</code> | <code>this.__value.length</code> | The index to stop filling at |

**Example**
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.fill('newElement', 0, 2);
    ```

=== "TypeScript"

    ```typescript
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
| [end] | <code>number</code> | <code>this.__value.length</code> | The end index to stop copying elements from |

**Example**
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.copyWithin(0, 1, 2);
    ```

=== "TypeScript"

    ```typescript
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
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.update(value => value + 1);
    ```

=== "TypeScript"

    ```typescript
    observable.update(value => value + 1);
    ```
<a name="ObservableState+complete"></a>

### observableState.complete()
Calls the complete method of all observers.

**Kind**: instance method of [<code>ObservableState</code>](#ObservableState)
**Example**
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    observable.complete();
    ```

=== "TypeScript"

    ```typescript
    observable.complete();
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
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Assuming `effectFn` is a function that is called when the observable changes
    const effectFunction = effect(effectFn);
    ```

=== "TypeScript"

    ```typescript
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
<!-- cami-language-pair -->
=== "JavaScript"

    ```javascript
    // Assuming `dispose` is the function returned by `effect`
    dispose(); // This will unsubscribe from all dependencies and run cleanup function
    ```

=== "TypeScript"

    ```typescript
    // Assuming `dispose` is the function returned by `effect`
    dispose(); // This will unsubscribe from all dependencies and run cleanup function
    ```
