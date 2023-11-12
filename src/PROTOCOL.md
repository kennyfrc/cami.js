# ReactiveElement Protocol

The `ReactiveElement` class interacts with `Observable`, `Observer` and `Store` objects. To ensure compatibility, these objects should adhere to the following protocols:

## Observable Protocol

An `Observable` is an object that holds a value and allows updates to it. It should implement the following methods:

- `update(updater)`: This method accepts a function (`updater`) as an argument. The `updater` function is called with the current value and should return the new value. After the `updater` function is called, the `Observable` should call all observer functions.

- `value`: This is a getter that returns the current value of the `Observable`.

- `register(next, error, complete, signal)`: This method subscribes a new observer to the observable and returns an unsubscribe function.

For asynchronous operations, the `Observable` should implement the iterator pattern methods. This pattern closely follows a subset of the [WICG proposal](https://github.com/WICG/observable). It effectively handles data dispatch over time, solving the problem of managing asynchronous data flows:

- `next(value)`: Dispatches the new value to the observers, akin to moving to and returning the next item in the iterator pattern.

- `error(error)`: Dispatches an error to the observers, similar to exception handling in the iterator pattern.

- `complete()`: Notifies observers of job completion, signaling the end of an iteration in the iterator pattern.

## Observer Protocol

An `Observer` is a plain javascript object that listens to an `Observable`. It should implement the following methods:

- `next(value)`: This method is called by the `Observable` with the new value.

- `error(error)`: This method is called by the `Observable` with an error.

- `complete()`: This method is called by the `Observable` when it is complete.

## Store Protocol

A `Store` is an object that holds the application state and provides methods to interact with it. It should implement the following methods:

- `subscribe(listener)`: This method accepts a function (`listener`) as an argument. The `listener` function is called with the new state whenever the state changes. The `subscribe` method should return an `unsubscribe` function that removes the `listener` when called.

- `dispatch(action, payload)`: This method accepts an `action` (string) and a `payload` (any). It should update the state based on the `action` and `payload`, and notify all listeners of the new state.

- `state`: This is a getter that returns the current state of the `Store`.

- `register(action, reducer)`: This method adds a reducer to the store.

- `use(middleware)`: This method adds a middleware to the store.

