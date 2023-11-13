# ReactiveElement Protocol

The `ReactiveElement` class interacts with `ObservableState`, `Observer` and `Store` objects. To ensure compatibility, these objects should adhere to the following protocols:

## ObservableState Protocol

An `ObservableState` is an object that holds a value and allows updates to it. It should implement the following methods:

- `update(updater)`: This method accepts a function (`updater`) as an argument. The `updater` function is called with the current value and should return the new value. After the `updater` function is called, the `ObservableState` should call all observer functions.

- `value`: This is a getter that returns the current value of the `ObservableState`.

- `subscribe(observer)`: This method subscribes a new observer to the observable and returns an unsubscribe function.

## Observer Protocol

An `Observer` is a plain javascript object that listens to an `ObservableState`. It should implement the following methods:

- `next(value)`: This method is called by the `ObservableState` with the new value.

- `error(error)`: This method is called by the `ObservableState` with an error.

- `complete()`: This method is called by the `ObservableState` when it is complete.

## Store Protocol

A `Store` is an object that holds the application state and provides methods to interact with it. It should implement the following methods:

- `subscribe(listener)`: This method accepts a function (`listener`) as an argument. The `listener` function is called with the new state whenever the state changes. The `subscribe` method should return an `unsubscribe` function that removes the `listener` when called.

- `dispatch(action, payload)`: This method accepts an `action` (string) and a `payload` (any). It should update the state based on the `action` and `payload`, and notify all listeners of the new state.

- `state`: This is a getter that returns the current state of the `Store`.

- `register(action, reducer)`: This method adds a reducer to the store.

- `use(middleware)`: This method adds a middleware to the store.

