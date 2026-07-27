import * as Signals from '@preact/signals-core'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { action, autorun, configure, makeObservable, observable, reaction } from 'mobx'
import { applySnapshot, flow, getSnapshot, onSnapshot, types } from 'mobx-state-tree'
import { createStore } from 'redux'
import { Observable as RxObservable, Subject } from 'rxjs'
import { proxy, subscribe, useSnapshot } from 'valtio'
import { effect, reactive } from 'vue'
import { create } from 'zustand'

import { ObservableState } from './src/observables/observable-state.js'
import { store } from './src/observables/observable-store.js'
import { Observable } from './src/observables/observable.js'

// Configure MobX to not use strict mode for our benchmarks
configure({ enforceActions: 'never' })

// Utility function to measure time
function measureTime(fn, iterations = 1) {
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    fn(i) // Pass the iteration index to the function
  }
  return performance.now() - start
}

// Utility function to format the results
function formatResult(name, time, iterations, category = null) {
  return {
    name,
    category,
    totalTime: time.toFixed(2) + 'ms',
    timePerOp: (time / iterations).toFixed(4) + 'ms',
    opsPerSec: Math.round(iterations / (time / 1000)),
  }
}

// Benchmark 1: Basic creation and subscription
function benchmarkCreationAndSubscription(iterations = 10000) {
  console.log('\n--- Benchmark: Creation and Subscription ---')

  const results = []

  // CATEGORY: Observables
  // Cami Observable
  results.push(
    formatResult(
      'Cami Observable',
      measureTime(i => {
        const observable = new Observable()
        const subs = observable.subscribe(() => {})
        subs.unsubscribe()
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // RxJS Observable
  results.push(
    formatResult(
      'RxJS Observable',
      measureTime(i => {
        const subject = new Subject()
        const subscription = subject.subscribe(() => {})
        subscription.unsubscribe()
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // Preact Signals
  results.push(
    formatResult(
      'Preact Signals',
      measureTime(i => {
        const signal = Signals.signal(0)
        const dispose = signal.subscribe(() => {})
        dispose()
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // CATEGORY: State Management
  // Cami ObservableState
  results.push(
    formatResult(
      'Cami ObservableState',
      measureTime(i => {
        const state = new ObservableState(0)
        const subs = state.onValue(() => {})
        subs.unsubscribe()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // MobX
  results.push(
    formatResult(
      'MobX',
      measureTime(i => {
        class Store {
          constructor() {
            this.value = 0
            makeObservable(this, {
              value: observable,
            })
          }
        }
        const store = new Store()
        const dispose = autorun(() => store.value)
        dispose()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // Vue Reactivity
  results.push(
    formatResult(
      'Vue Reactivity',
      measureTime(i => {
        const state = reactive({ value: 0 })
        const stop = effect(() => state.value)
        stop()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // CATEGORY: Store Libraries
  // Cami ObservableStore
  results.push(
    formatResult(
      'Cami ObservableStore',
      measureTime(i => {
        const testStore = store({
          state: { count: 0 },
          name: `test-creation-${i}-${Math.random().toString(36).substring(2, 10)}`,
        })
        const subs = testStore.subscribe(() => {})
        subs.unsubscribe()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux Toolkit
  results.push(
    formatResult(
      'Redux Toolkit',
      measureTime(i => {
        const counterSlice = createSlice({
          name: 'counter',
          initialState: { count: 0 },
          reducers: {},
        })

        const store = configureStore({
          reducer: counterSlice.reducer,
        })

        const unsubscribe = store.subscribe(() => {})
        unsubscribe()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // MobX-State-Tree
  results.push(
    formatResult(
      'MobX-State-Tree',
      measureTime(i => {
        const CounterModel = types.model('Counter', {
          count: types.number,
        })

        const store = CounterModel.create({ count: 0 })
        const dispose = autorun(() => store.count)
        dispose()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux
  results.push(
    formatResult(
      'Redux',
      measureTime(i => {
        const initialState = { count: 0 }

        const reducer = (state = initialState, action) => {
          return state
        }

        const reduxStore = createStore(reducer)
        const unsubscribe = reduxStore.subscribe(() => {})
        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Zustand
  results.push(
    formatResult(
      'Zustand',
      measureTime(i => {
        const useStore = create(() => ({ count: 0 }))
        const unsubscribe = useStore.subscribe(() => {})
        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Valtio
  results.push(
    formatResult(
      'Valtio',
      measureTime(i => {
        const state = proxy({ count: 0 })
        const unsubscribe = subscribe(state, () => {})
        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Sort results by category and then by name
  results.sort((a, b) => {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name)
    }
    return a.category.localeCompare(b.category)
  })

  console.table(results)
}

// Benchmark 2: Value updates
function benchmarkValueUpdates(iterations = 10000) {
  console.log('\n--- Benchmark: Value Updates ---')

  const results = []

  // CATEGORY: Observables
  // Cami Observable
  results.push(
    formatResult(
      'Cami Observable',
      measureTime(i => {
        const observable = new Observable()
        let called = 0
        const subscription = observable.subscribe(() => called++)
        observable.next(1)
        subscription.unsubscribe()
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // RxJS Subject
  results.push(
    formatResult(
      'RxJS Subject',
      measureTime(i => {
        const subject = new Subject()
        let called = 0
        const subscription = subject.subscribe(() => called++)
        subject.next(1)
        subscription.unsubscribe()
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // Preact Signals
  results.push(
    formatResult(
      'Preact Signals',
      measureTime(i => {
        const signal = Signals.signal(0)
        let called = 0
        const dispose = signal.subscribe(() => called++)
        signal.value = 1
        dispose()
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // CATEGORY: State Management
  // Cami ObservableState
  results.push(
    formatResult(
      'Cami ObservableState',
      measureTime(i => {
        const state = new ObservableState(0)
        let called = 0
        const subscription = state.onValue(() => called++)
        state.value = 1
        subscription.unsubscribe()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // MobX
  results.push(
    formatResult(
      'MobX',
      measureTime(i => {
        class Store {
          constructor() {
            this.value = 0
            makeObservable(this, {
              value: observable,
            })
          }
        }
        const store = new Store()
        let called = 0
        const dispose = autorun(() => {
          store.value
          called++
        })
        store.value = 1
        dispose()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // Vue Reactivity
  results.push(
    formatResult(
      'Vue Reactivity',
      measureTime(i => {
        const state = reactive({ value: 0 })
        let called = 0
        const stop = effect(() => {
          state.value
          called++
        })
        state.value = 1
        stop()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // CATEGORY: Store Libraries
  // Cami ObservableStore
  results.push(
    formatResult(
      'Cami ObservableStore',
      measureTime(i => {
        const testStore = store({
          state: { count: 0 },
          name: `test-update-${i}-${Math.random().toString(36).substring(2, 10)}`,
        })

        let called = 0
        const subscription = testStore.subscribe(() => called++)

        // Use a unique action name for each iteration
        const actionName = `increment-update-${i}-${Math.random().toString(36).substring(2, 10)}`
        testStore.defineAction(actionName, ({ state }) => {
          state.count = 1
        })

        testStore.dispatch(actionName)
        subscription.unsubscribe()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux Toolkit
  results.push(
    formatResult(
      'Redux Toolkit',
      measureTime(i => {
        const counterSlice = createSlice({
          name: 'counter',
          initialState: { count: 0 },
          reducers: {
            increment: (state, action) => {
              state.count = action.payload
            },
          },
        })

        const store = configureStore({
          reducer: counterSlice.reducer,
        })

        let called = 0
        const unsubscribe = store.subscribe(() => called++)

        store.dispatch(counterSlice.actions.increment(1))

        unsubscribe()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // MobX-State-Tree
  results.push(
    formatResult(
      'MobX-State-Tree',
      measureTime(i => {
        const CounterModel = types
          .model('Counter', {
            count: types.number,
          })
          .actions(self => ({
            setCount(value) {
              self.count = value
            },
          }))

        const store = CounterModel.create({ count: 0 })

        let called = 0
        const dispose = autorun(() => {
          store.count
          called++
        })

        store.setCount(1)
        dispose()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux
  results.push(
    formatResult(
      'Redux',
      measureTime(i => {
        const initialState = { count: 0 }

        const reducer = (state = initialState, action) => {
          if (action.type === 'INCREMENT') {
            return { ...state, count: action.payload }
          }
          return state
        }

        const reduxStore = createStore(reducer)

        let called = 0
        const unsubscribe = reduxStore.subscribe(() => called++)

        reduxStore.dispatch({ type: 'INCREMENT', payload: 1 })

        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Zustand
  results.push(
    formatResult(
      'Zustand',
      measureTime(i => {
        const useStore = create(set => ({
          count: 0,
          increment: value => set({ count: value }),
        }))

        let called = 0
        const unsubscribe = useStore.subscribe(state => {
          state.count
          called++
        })

        useStore.getState().increment(1)
        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Valtio
  results.push(
    formatResult(
      'Valtio',
      measureTime(i => {
        const state = proxy({ count: 0 })

        let called = 0
        const unsubscribe = subscribe(state, () => called++)

        state.count = 1
        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Sort results by category and then by name
  results.sort((a, b) => {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name)
    }
    return a.category.localeCompare(b.category)
  })

  console.table(results)
}

// Benchmark 3: Multiple subscribers
function benchmarkMultipleSubscribers(iterations = 1000, subscribers = 10) {
  console.log('\n--- Benchmark: Multiple Subscribers ---')

  const results = []

  // CATEGORY: Observables
  // Cami Observable
  results.push(
    formatResult(
      `Cami Observable (${subscribers} subscribers)`,
      measureTime(idx => {
        const observable = new Observable()
        const subscriptions = []
        for (let i = 0; i < subscribers; i++) {
          subscriptions.push(observable.subscribe(() => {}))
        }
        observable.next(1)
        subscriptions.forEach(sub => sub.unsubscribe())
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // RxJS Subject
  results.push(
    formatResult(
      `RxJS Subject (${subscribers} subscribers)`,
      measureTime(idx => {
        const subject = new Subject()
        const subscriptions = []
        for (let i = 0; i < subscribers; i++) {
          subscriptions.push(subject.subscribe(() => {}))
        }
        subject.next(1)
        subscriptions.forEach(sub => sub.unsubscribe())
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // Preact Signals
  results.push(
    formatResult(
      `Preact Signals (${subscribers} subscribers)`,
      measureTime(idx => {
        const signal = Signals.signal(0)
        const disposers = []
        for (let i = 0; i < subscribers; i++) {
          disposers.push(signal.subscribe(() => {}))
        }
        signal.value = 1
        disposers.forEach(dispose => dispose())
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // CATEGORY: State Management
  // Cami ObservableState
  results.push(
    formatResult(
      `Cami ObservableState (${subscribers} subscribers)`,
      measureTime(idx => {
        const state = new ObservableState(0)
        const subscriptions = []
        for (let i = 0; i < subscribers; i++) {
          subscriptions.push(state.onValue(() => {}))
        }
        state.value = 1
        subscriptions.forEach(sub => sub.unsubscribe())
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // MobX
  results.push(
    formatResult(
      `MobX (${subscribers} subscribers)`,
      measureTime(idx => {
        class Store {
          constructor() {
            this.value = 0
            makeObservable(this, {
              value: observable,
            })
          }
        }
        const store = new Store()
        const disposers = []
        for (let i = 0; i < subscribers; i++) {
          disposers.push(autorun(() => store.value))
        }
        store.value = 1
        disposers.forEach(dispose => dispose())
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // Vue Reactivity
  results.push(
    formatResult(
      `Vue Reactivity (${subscribers} subscribers)`,
      measureTime(idx => {
        const state = reactive({ value: 0 })
        const stoppers = []
        for (let i = 0; i < subscribers; i++) {
          stoppers.push(effect(() => state.value))
        }
        state.value = 1
        stoppers.forEach(stop => stop())
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // CATEGORY: Store Libraries
  // Cami ObservableStore
  results.push(
    formatResult(
      `Cami ObservableStore (${subscribers} subscribers)`,
      measureTime(idx => {
        const testStore = store({
          state: { count: 0 },
          name: `test-multi-${idx}-${Math.random().toString(36).substring(2, 10)}`,
        })

        const subscriptions = []
        for (let i = 0; i < subscribers; i++) {
          subscriptions.push(testStore.subscribe(() => {}))
        }

        // Ensure unique action name with random suffix
        const actionName = `increment-multi-${idx}-${Math.random().toString(36).substring(2, 10)}`
        testStore.defineAction(actionName, ({ state }) => {
          state.count = 1
        })

        testStore.dispatch(actionName)
        subscriptions.forEach(sub => sub.unsubscribe())
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux Toolkit
  results.push(
    formatResult(
      `Redux Toolkit (${subscribers} subscribers)`,
      measureTime(idx => {
        const counterSlice = createSlice({
          name: 'counter',
          initialState: { count: 0 },
          reducers: {
            increment: (state, action) => {
              state.count = action.payload
            },
          },
        })

        const store = configureStore({
          reducer: counterSlice.reducer,
        })

        const unsubscribers = []
        for (let i = 0; i < subscribers; i++) {
          unsubscribers.push(store.subscribe(() => {}))
        }

        store.dispatch(counterSlice.actions.increment(1))

        unsubscribers.forEach(unsubscribe => unsubscribe())
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // MobX-State-Tree
  results.push(
    formatResult(
      `MobX-State-Tree (${subscribers} subscribers)`,
      measureTime(idx => {
        const CounterModel = types
          .model('Counter', {
            count: types.number,
          })
          .actions(self => ({
            setCount(value) {
              self.count = value
            },
          }))

        const store = CounterModel.create({ count: 0 })

        const disposers = []
        for (let i = 0; i < subscribers; i++) {
          disposers.push(autorun(() => store.count))
        }

        store.setCount(1)
        disposers.forEach(dispose => dispose())
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux
  results.push(
    formatResult(
      `Redux (${subscribers} subscribers)`,
      measureTime(idx => {
        const initialState = { count: 0 }

        const reducer = (state = initialState, action) => {
          if (action.type === 'INCREMENT') {
            return { ...state, count: action.payload }
          }
          return state
        }

        const reduxStore = createStore(reducer)

        const unsubscribers = []
        for (let i = 0; i < subscribers; i++) {
          unsubscribers.push(reduxStore.subscribe(() => {}))
        }

        reduxStore.dispatch({ type: 'INCREMENT', payload: 1 })

        unsubscribers.forEach(unsubscribe => unsubscribe())
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Zustand
  results.push(
    formatResult(
      `Zustand (${subscribers} subscribers)`,
      measureTime(idx => {
        const useStore = create(set => ({
          count: 0,
          increment: value => set({ count: value }),
        }))

        const unsubscribers = []
        for (let i = 0; i < subscribers; i++) {
          unsubscribers.push(useStore.subscribe(() => {}))
        }

        useStore.getState().increment(1)

        unsubscribers.forEach(unsubscribe => unsubscribe())
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Valtio
  results.push(
    formatResult(
      `Valtio (${subscribers} subscribers)`,
      measureTime(idx => {
        const state = proxy({ count: 0 })

        const unsubscribers = []
        for (let i = 0; i < subscribers; i++) {
          unsubscribers.push(subscribe(state, () => {}))
        }

        state.count = 1

        unsubscribers.forEach(unsubscribe => unsubscribe())
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Sort results by category and then by name
  results.sort((a, b) => {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name)
    }
    return a.category.localeCompare(b.category)
  })

  console.table(results)
}

// Benchmark 4: Deep object updates
function benchmarkDeepObjectUpdates(iterations = 1000) {
  console.log('\n--- Benchmark: Deep Object Updates ---')

  const results = []

  // CATEGORY: State Management
  // Cami ObservableState
  results.push(
    formatResult(
      'Cami ObservableState',
      measureTime(idx => {
        const state = new ObservableState({
          user: { profile: { name: 'John', age: 30 } },
        })
        let called = 0
        const subscription = state.onValue(() => called++)
        state.set('user.profile.age', 31)
        subscription.unsubscribe()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // MobX
  results.push(
    formatResult(
      'MobX',
      measureTime(idx => {
        class Store {
          constructor() {
            this.user = { profile: { name: 'John', age: 30 } }
            makeObservable(this, {
              user: observable,
            })
          }
        }
        const store = new Store()
        let called = 0
        const dispose = autorun(() => {
          store.user.profile.age
          called++
        })
        store.user.profile.age = 31
        dispose()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // Vue Reactivity
  results.push(
    formatResult(
      'Vue Reactivity',
      measureTime(idx => {
        const state = reactive({
          user: { profile: { name: 'John', age: 30 } },
        })
        let called = 0
        const stop = effect(() => {
          state.user.profile.age
          called++
        })
        state.user.profile.age = 31
        stop()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // CATEGORY: Store Libraries
  // Cami Store
  results.push(
    formatResult(
      'Cami Store',
      measureTime(i => {
        // Create unique identifiers for this test iteration
        const uniqueId = `${i}-${Math.random().toString(36).substring(2, 10)}`
        const actionName = `updateAge_${uniqueId}`
        const storeName = `app-store-deep-${uniqueId}`

        const appStore = store({
          state: {
            user: { profile: { name: 'John', age: 30 } },
          },
          name: storeName,
        })

        let called = 0
        const subscription = appStore.subscribe(() => called++)

        appStore.defineAction(actionName, ({ state, payload }) => {
          state.user.profile.age = payload
        })

        appStore.dispatch(actionName, 31)
        subscription.unsubscribe()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux Toolkit
  results.push(
    formatResult(
      'Redux Toolkit',
      measureTime(idx => {
        const userSlice = createSlice({
          name: 'user',
          initialState: {
            user: { profile: { name: 'John', age: 30 } },
          },
          reducers: {
            updateAge: (state, action) => {
              state.user.profile.age = action.payload
            },
          },
        })

        const store = configureStore({
          reducer: userSlice.reducer,
        })

        let called = 0
        const unsubscribe = store.subscribe(() => called++)

        store.dispatch(userSlice.actions.updateAge(31))

        unsubscribe()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // MobX-State-Tree
  results.push(
    formatResult(
      'MobX-State-Tree',
      measureTime(idx => {
        const ProfileModel = types
          .model('Profile', {
            name: types.string,
            age: types.number,
          })
          .actions(self => ({
            setAge(age) {
              self.age = age
            },
          }))

        const UserModel = types.model('User', {
          profile: ProfileModel,
        })

        const RootStore = types.model('RootStore', {
          user: UserModel,
        })

        const store = RootStore.create({
          user: {
            profile: {
              name: 'John',
              age: 30,
            },
          },
        })

        let called = 0
        const dispose = autorun(() => {
          store.user.profile.age
          called++
        })

        store.user.profile.setAge(31)
        dispose()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux
  results.push(
    formatResult(
      'Redux',
      measureTime(idx => {
        // Redux: Define initial state & reducer
        const initialState = {
          user: { profile: { name: 'John', age: 30 } },
        }

        const reducer = (state = initialState, action) => {
          if (action.type === 'UPDATE_AGE') {
            return {
              ...state,
              user: {
                ...state.user,
                profile: {
                  ...state.user.profile,
                  age: action.payload,
                },
              },
            }
          }
          return state
        }

        // Create the store
        const reduxStore = createStore(reducer)

        let called = 0
        const unsubscribe = reduxStore.subscribe(() => called++)

        // Dispatch an action
        reduxStore.dispatch({ type: 'UPDATE_AGE', payload: 31 })

        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Zustand
  results.push(
    formatResult(
      'Zustand',
      measureTime(idx => {
        // Create Zustand store
        const useStore = create(set => ({
          user: {
            profile: {
              name: 'John',
              age: 30,
            },
          },
          updateAge: age =>
            set(state => ({
              user: {
                ...state.user,
                profile: {
                  ...state.user.profile,
                  age,
                },
              },
            })),
        }))

        let called = 0
        const unsubscribe = useStore.subscribe(state => {
          state.user.profile.age
          called++
        })

        useStore.getState().updateAge(31)
        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Valtio
  results.push(
    formatResult(
      'Valtio',
      measureTime(idx => {
        // Create Valtio store
        const state = proxy({
          user: {
            profile: {
              name: 'John',
              age: 30,
            },
          },
        })

        let called = 0
        const unsubscribe = subscribe(state, () => called++)

        state.user.profile.age = 31
        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Sort results by category and then by name
  results.sort((a, b) => {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name)
    }
    return a.category.localeCompare(b.category)
  })

  console.table(results)
}

// Benchmark 5: Computed values
function benchmarkComputedValues(iterations = 1000) {
  console.log('\n--- Benchmark: Computed Values ---')

  const results = []

  // CATEGORY: Observables
  // Cami Observable (State approach)
  results.push(
    formatResult(
      'Cami ObservableState Computed',
      measureTime(idx => {
        const state = new ObservableState(0)
        let value

        // Simulate a computed property using our API
        const valueSubscription = state.onValue(count => {
          value = count * 2
        })

        state.value = 5
        valueSubscription.unsubscribe()
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // Preact Signals Computed
  results.push(
    formatResult(
      'Preact Signals Computed',
      measureTime(idx => {
        const count = Signals.signal(0)
        const doubled = Signals.computed(() => count.value * 2)
        let value

        const dispose = doubled.subscribe(v => {
          value = v
        })

        count.value = 5
        dispose()
      }, iterations),
      iterations,
      'Observables'
    )
  )

  // CATEGORY: State Management
  // Vue Computed
  results.push(
    formatResult(
      'Vue Computed',
      measureTime(idx => {
        const state = reactive({ count: 0 })
        let value

        const stop = effect(() => {
          value = state.count * 2
        })

        state.count = 5
        stop()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // MobX Computed
  results.push(
    formatResult(
      'MobX Computed',
      measureTime(idx => {
        class Store {
          constructor() {
            this.count = 0
            makeObservable(this, {
              count: observable,
            })
          }

          get doubled() {
            return this.count * 2
          }
        }

        const store = new Store()
        let value

        const dispose = reaction(
          () => store.doubled,
          doubled => {
            value = doubled
          }
        )

        store.count = 5
        dispose()
      }, iterations),
      iterations,
      'State Management'
    )
  )

  // CATEGORY: Store Libraries
  // Cami Store Memo
  results.push(
    formatResult(
      'Cami Store Memo',
      measureTime(idx => {
        const uniqueId = `memo-${idx}`
        const counterStore = store({
          state: { count: 0 },
          name: `counter-memo-${uniqueId}`,
        })

        // Define a memo function
        counterStore.defineMemo(`doubled-${uniqueId}`, ({ state }) => {
          return state.count * 2
        })

        // Define an action to update the count
        counterStore.defineAction(`increment-${uniqueId}`, ({ state }) => {
          state.count = 5
        })

        // Get the initial memo value to establish dependency tracking
        let result = counterStore.memo(`doubled-${uniqueId}`)

        // Dispatch the action to update state
        counterStore.dispatch(`increment-${uniqueId}`)

        // Get the updated memo value
        result = counterStore.memo(`doubled-${uniqueId}`)
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // MobX-State-Tree Computed
  results.push(
    formatResult(
      'MobX-State-Tree Computed',
      measureTime(idx => {
        const CounterModel = types
          .model('Counter', {
            count: types.number,
          })
          .actions(self => ({
            setCount(value) {
              self.count = value
            },
          }))
          .views(self => ({
            get doubled() {
              return self.count * 2
            },
          }))

        const store = CounterModel.create({ count: 0 })
        let value

        const dispose = reaction(
          () => store.doubled,
          doubled => {
            value = doubled
          }
        )

        store.setCount(5)
        dispose()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux Toolkit (with selector)
  results.push(
    formatResult(
      'Redux Toolkit with selector',
      measureTime(idx => {
        const counterSlice = createSlice({
          name: 'counter',
          initialState: { count: 0 },
          reducers: {
            setCount: (state, action) => {
              state.count = action.payload
            },
          },
        })

        const store = configureStore({
          reducer: counterSlice.reducer,
        })

        // Selector function
        const getDoubledCount = state => state.count * 2

        let value
        let prevValue

        const unsubscribe = store.subscribe(() => {
          const state = store.getState()
          const newValue = getDoubledCount(state)

          if (newValue !== prevValue) {
            value = newValue
            prevValue = newValue
          }
        })

        store.dispatch(counterSlice.actions.setCount(5))

        unsubscribe()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux (with selector)
  results.push(
    formatResult(
      'Redux with selector',
      measureTime(idx => {
        const initialState = { count: 0 }

        const reducer = (state = initialState, action) => {
          if (action.type === 'SET_COUNT') {
            return { ...state, count: action.payload }
          }
          return state
        }

        const reduxStore = createStore(reducer)

        // Selector function (similar to a computed)
        const getDoubledCount = state => state.count * 2

        let value
        let prevValue

        const unsubscribe = reduxStore.subscribe(() => {
          const state = reduxStore.getState()
          const newValue = getDoubledCount(state)

          if (newValue !== prevValue) {
            value = newValue
            prevValue = newValue
          }
        })

        reduxStore.dispatch({ type: 'SET_COUNT', payload: 5 })

        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Zustand (with selector)
  results.push(
    formatResult(
      'Zustand with selector',
      measureTime(idx => {
        const useStore = create(set => ({
          count: 0,
          setCount: value => set({ count: value }),
        }))

        // Selector function
        const getDoubledCount = state => state.count * 2

        let value
        let prevValue

        const unsubscribe = useStore.subscribe(
          state => getDoubledCount(state),
          doubledCount => {
            value = doubledCount
          }
        )

        useStore.getState().setCount(5)

        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Valtio (with derived state)
  results.push(
    formatResult(
      'Valtio with derived state',
      measureTime(idx => {
        const state = proxy({ count: 0 })

        // Derived state
        let value

        const unsubscribe = subscribe(state, () => {
          value = state.count * 2
        })

        state.count = 5

        unsubscribe()
      }, iterations),
      iterations,
      'Small Stores'
    )
  )

  // Sort results by category and then by name
  results.sort((a, b) => {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name)
    }
    return a.category.localeCompare(b.category)
  })

  console.table(results)
}

// Benchmark 6: Store Operations
function benchmarkStoreOperations(iterations = 1000) {
  console.log('\n--- Benchmark: Store Operations ---')

  const results = []

  // Define a more complex state structure for realistic testing
  const createComplexState = () => ({
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      preferences: {
        theme: 'dark',
        notifications: {
          email: true,
          push: false,
          sms: true,
        },
      },
    },
    posts: [
      { id: 1, title: 'First Post', body: 'Content 1', tags: ['tech'] },
      { id: 2, title: 'Second Post', body: 'Content 2', tags: ['news'] },
    ],
    ui: {
      sidebar: {
        visible: true,
        width: 250,
      },
      header: {
        height: 60,
        fixed: true,
      },
    },
    stats: {
      visits: 1000,
      likes: 50,
      comments: 25,
    },
  })

  // CATEGORY: Store Libraries
  // Cami Store - Action Dispatch (Mutation)
  results.push(
    formatResult(
      'Cami Store (Mutation)',
      measureTime(i => {
        const uniqueId = `a${i}`
        const testStore = store({
          state: createComplexState(),
          name: `store-complex-${uniqueId}`,
        })

        testStore.defineAction(`updatePreferences-${uniqueId}`, ({ state }) => {
          state.user.preferences.theme = 'light'
          state.user.preferences.notifications.push = true
          state.ui.sidebar.width = 300
        })

        testStore.dispatch(`updatePreferences-${uniqueId}`)
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Cami Store - API Call (Query)
  results.push(
    formatResult(
      'Cami Store (Query)',
      measureTime(i => {
        const uniqueId = `d${i}`
        const testStore = store({
          state: {
            ...createComplexState(),
            loading: false,
            error: null,
            data: null,
          },
          name: `store-query-${uniqueId}`,
        })

        testStore.defineAction(`fetchUser-${uniqueId}`, ({ state }) => {
          // Simulate API fetch start
          state.loading = true

          // Simulate API response
          state.data = {
            id: 123,
            name: 'API User',
            email: 'api@camijs.com',
          }
          state.loading = false
        })

        testStore.dispatch(`fetchUser-${uniqueId}`)
        const result = testStore.getState()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Cami Store - Multiple Actions
  results.push(
    formatResult(
      'Cami Store (Multiple Actions)',
      measureTime(i => {
        const uniqueId = `b${i}`
        const testStore = store({
          state: createComplexState(),
          name: `store-multi-${uniqueId}`,
        })

        testStore.defineAction(`updateTheme-${uniqueId}`, ({ state }) => {
          state.user.preferences.theme = 'light'
        })

        testStore.defineAction(`updateNotifications-${uniqueId}`, ({ state }) => {
          state.user.preferences.notifications.push = true
        })

        testStore.defineAction(`updateSidebar-${uniqueId}`, ({ state }) => {
          state.ui.sidebar.width = 300
        })

        testStore.dispatch(`updateTheme-${uniqueId}`)
        testStore.dispatch(`updateNotifications-${uniqueId}`)
        testStore.dispatch(`updateSidebar-${uniqueId}`)
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Cami Store - Memoization
  results.push(
    formatResult(
      'Cami Store (Complex Memo)',
      measureTime(i => {
        const uniqueId = `c${i}`
        const testStore = store({
          state: {
            ...createComplexState(),
            count: i,
          },
          name: `store-memo-${uniqueId}`,
        })

        testStore.defineMemo(`userStats-${uniqueId}`, ({ state }) => {
          return {
            totalPosts: state.posts.length,
            totalTags: state.posts.reduce((acc, post) => acc + post.tags.length, 0),
            preferences: {
              ...state.user.preferences,
            },
            uiSettings: {
              sidebarWidth: state.ui.sidebar.width,
              headerFixed: state.ui.header.fixed,
            },
          }
        })

        // Compute the memo value
        const stats = testStore.memo(`userStats-${uniqueId}`)

        // Update state
        testStore.defineAction(`update-${uniqueId}`, ({ state }) => {
          state.user.preferences.theme = 'light'
        })
        testStore.dispatch(`update-${uniqueId}`)

        // Compute again after update
        const updatedStats = testStore.memo(`userStats-${uniqueId}`)
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux Toolkit - Mutation
  results.push(
    formatResult(
      'Redux Toolkit (Mutation)',
      measureTime(i => {
        const userSlice = createSlice({
          name: 'user',
          initialState: createComplexState(),
          reducers: {
            updatePreferences: state => {
              state.user.preferences.theme = 'light'
              state.user.preferences.notifications.push = true
              state.ui.sidebar.width = 300
            },
          },
        })

        const store = configureStore({
          reducer: userSlice.reducer,
        })

        store.dispatch(userSlice.actions.updatePreferences())
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux Toolkit - Query
  results.push(
    formatResult(
      'Redux Toolkit (Query)',
      measureTime(i => {
        const apiSlice = createSlice({
          name: 'api',
          initialState: {
            ...createComplexState(),
            loading: false,
            error: null,
            data: null,
          },
          reducers: {
            fetchStarted: state => {
              state.loading = true
            },
            fetchSuccess: (state, action) => {
              state.loading = false
              state.data = action.payload
              state.error = null
            },
          },
        })

        const store = configureStore({
          reducer: apiSlice.reducer,
        })

        store.dispatch(apiSlice.actions.fetchStarted())
        store.dispatch(
          apiSlice.actions.fetchSuccess({
            id: 123,
            name: 'API User',
            email: 'api@camijs.com',
          })
        )

        const state = store.getState()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // MobX-State-Tree - Mutation
  results.push(
    formatResult(
      'MobX-State-Tree (Mutation)',
      measureTime(i => {
        const NotificationsModel = types
          .model('Notifications', {
            email: types.boolean,
            push: types.boolean,
            sms: types.boolean,
          })
          .actions(self => ({
            setPush(value) {
              self.push = value
            },
          }))

        const PreferencesModel = types
          .model('Preferences', {
            theme: types.string,
            notifications: NotificationsModel,
          })
          .actions(self => ({
            setTheme(value) {
              self.theme = value
            },
          }))

        const SidebarModel = types
          .model('Sidebar', {
            visible: types.boolean,
            width: types.number,
          })
          .actions(self => ({
            setWidth(value) {
              self.width = value
            },
          }))

        const UIModel = types.model('UI', {
          sidebar: SidebarModel,
          header: types.model({
            height: types.number,
            fixed: types.boolean,
          }),
        })

        const UserModel = types.model('User', {
          id: types.number,
          name: types.string,
          email: types.string,
          preferences: PreferencesModel,
        })

        const RootStore = types
          .model('Root', {
            user: UserModel,
            ui: UIModel,
            posts: types.array(types.frozen()),
            stats: types.frozen(),
          })
          .actions(self => ({
            updatePreferences() {
              self.user.preferences.setTheme('light')
              self.user.preferences.notifications.setPush(true)
              self.ui.sidebar.setWidth(300)
            },
          }))

        const rootStore = RootStore.create({
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            preferences: {
              theme: 'dark',
              notifications: {
                email: true,
                push: false,
                sms: true,
              },
            },
          },
          ui: {
            sidebar: {
              visible: true,
              width: 250,
            },
            header: {
              height: 60,
              fixed: true,
            },
          },
          posts: [
            {
              id: 1,
              title: 'First Post',
              body: 'Content 1',
              tags: ['tech'],
            },
            {
              id: 2,
              title: 'Second Post',
              body: 'Content 2',
              tags: ['news'],
            },
          ],
          stats: {
            visits: 1000,
            likes: 50,
            comments: 25,
          },
        })

        rootStore.updatePreferences()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // MobX-State-Tree - Query
  results.push(
    formatResult(
      'MobX-State-Tree (Query)',
      measureTime(i => {
        const ApiModel = types
          .model('Api', {
            loading: types.boolean,
            error: types.maybeNull(types.string),
            data: types.maybeNull(
              types.model({
                id: types.number,
                name: types.string,
                email: types.string,
              })
            ),
          })
          .actions(self => ({
            fetchStarted() {
              self.loading = true
            },
            fetchSuccess(data) {
              self.data = data
              self.loading = false
              self.error = null
            },
          }))

        const store = ApiModel.create({
          loading: false,
          error: null,
          data: null,
        })

        store.fetchStarted()
        store.fetchSuccess({
          id: 123,
          name: 'API User',
          email: 'api@camijs.com',
        })

        const result = { loading: store.loading, data: store.data }
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux Toolkit - Multiple Actions
  results.push(
    formatResult(
      'Redux Toolkit (Multiple Actions)',
      measureTime(i => {
        const userSlice = createSlice({
          name: 'user',
          initialState: createComplexState(),
          reducers: {
            updateTheme: state => {
              state.user.preferences.theme = 'light'
            },
            updateNotifications: state => {
              state.user.preferences.notifications.push = true
            },
            updateSidebar: state => {
              state.ui.sidebar.width = 300
            },
          },
        })

        const store = configureStore({
          reducer: userSlice.reducer,
        })

        store.dispatch(userSlice.actions.updateTheme())
        store.dispatch(userSlice.actions.updateNotifications())
        store.dispatch(userSlice.actions.updateSidebar())
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Redux Toolkit - Complex Memo (selector)
  results.push(
    formatResult(
      'Redux Toolkit (Complex Memo)',
      measureTime(i => {
        const userSlice = createSlice({
          name: 'user',
          initialState: {
            ...createComplexState(),
            count: i,
          },
          reducers: {
            updateTheme: state => {
              state.user.preferences.theme = 'light'
            },
          },
        })

        const store = configureStore({
          reducer: userSlice.reducer,
        })

        // Create a complex selector (memo equivalent)
        const getUserStats = state => ({
          totalPosts: state.posts.length,
          totalTags: state.posts.reduce((acc, post) => acc + post.tags.length, 0),
          preferences: {
            ...state.user.preferences,
          },
          uiSettings: {
            sidebarWidth: state.ui.sidebar.width,
            headerFixed: state.ui.header.fixed,
          },
        })

        // Get initial memo value
        let stats = getUserStats(store.getState())

        // Update state
        store.dispatch(userSlice.actions.updateTheme())

        // Get updated memo value
        stats = getUserStats(store.getState())
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // MobX-State-Tree - Multiple Actions
  results.push(
    formatResult(
      'MobX-State-Tree (Multiple Actions)',
      measureTime(i => {
        const NotificationsModel = types
          .model('Notifications', {
            email: types.boolean,
            push: types.boolean,
            sms: types.boolean,
          })
          .actions(self => ({
            setPush(value) {
              self.push = value
            },
          }))

        const PreferencesModel = types
          .model('Preferences', {
            theme: types.string,
            notifications: NotificationsModel,
          })
          .actions(self => ({
            setTheme(value) {
              self.theme = value
            },
          }))

        const SidebarModel = types
          .model('Sidebar', {
            visible: types.boolean,
            width: types.number,
          })
          .actions(self => ({
            setWidth(value) {
              self.width = value
            },
          }))

        const UIModel = types.model('UI', {
          sidebar: SidebarModel,
          header: types.model({
            height: types.number,
            fixed: types.boolean,
          }),
        })

        const UserModel = types.model('User', {
          id: types.number,
          name: types.string,
          email: types.string,
          preferences: PreferencesModel,
        })

        const RootStore = types.model('Root', {
          user: UserModel,
          ui: UIModel,
          posts: types.array(types.frozen()),
          stats: types.frozen(),
        })

        const rootStore = RootStore.create({
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            preferences: {
              theme: 'dark',
              notifications: {
                email: true,
                push: false,
                sms: true,
              },
            },
          },
          ui: {
            sidebar: {
              visible: true,
              width: 250,
            },
            header: {
              height: 60,
              fixed: true,
            },
          },
          posts: [
            {
              id: 1,
              title: 'First Post',
              body: 'Content 1',
              tags: ['tech'],
            },
            {
              id: 2,
              title: 'Second Post',
              body: 'Content 2',
              tags: ['news'],
            },
          ],
          stats: {
            visits: 1000,
            likes: 50,
            comments: 25,
          },
        })

        // Execute multiple separate actions
        rootStore.user.preferences.setTheme('light')
        rootStore.user.preferences.notifications.setPush(true)
        rootStore.ui.sidebar.setWidth(300)
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // MobX-State-Tree - Complex Memo (view)
  results.push(
    formatResult(
      'MobX-State-Tree (Complex Memo)',
      measureTime(i => {
        const NotificationsModel = types.model('Notifications', {
          email: types.boolean,
          push: types.boolean,
          sms: types.boolean,
        })

        const PreferencesModel = types
          .model('Preferences', {
            theme: types.string,
            notifications: NotificationsModel,
          })
          .actions(self => ({
            setTheme(value) {
              self.theme = value
            },
          }))

        const SidebarModel = types.model('Sidebar', {
          visible: types.boolean,
          width: types.number,
        })

        const UIModel = types.model('UI', {
          sidebar: SidebarModel,
          header: types.model({
            height: types.number,
            fixed: types.boolean,
          }),
        })

        const UserModel = types.model('User', {
          id: types.number,
          name: types.string,
          email: types.string,
          preferences: PreferencesModel,
        })

        const RootStore = types
          .model('Root', {
            user: UserModel,
            ui: UIModel,
            posts: types.array(types.frozen()),
            stats: types.frozen(),
            count: types.number,
          })
          .views(self => ({
            get userStats() {
              return {
                totalPosts: self.posts.length,
                totalTags: self.posts.reduce(
                  (acc, post) => (acc.tags?.length ? acc + post.tags.length : acc),
                  0
                ),
                preferences: {
                  theme: self.user.preferences.theme,
                  notifications: {
                    push: self.user.preferences.notifications.push,
                  },
                },
                uiSettings: {
                  sidebarWidth: self.ui.sidebar.width,
                  headerFixed: self.ui.header.fixed,
                },
              }
            },
          }))
          .actions(self => ({
            updateTheme(theme) {
              self.user.preferences.setTheme(theme)
            },
          }))

        const rootStore = RootStore.create({
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            preferences: {
              theme: 'dark',
              notifications: {
                email: true,
                push: false,
                sms: true,
              },
            },
          },
          ui: {
            sidebar: {
              visible: true,
              width: 250,
            },
            header: {
              height: 60,
              fixed: true,
            },
          },
          posts: [
            {
              id: 1,
              title: 'First Post',
              body: 'Content 1',
              tags: ['tech'],
            },
            {
              id: 2,
              title: 'Second Post',
              body: 'Content 2',
              tags: ['news'],
            },
          ],
          stats: {
            visits: 1000,
            likes: 50,
            comments: 25,
          },
          count: i,
        })

        // Access the computed view (memo)
        let stats = rootStore.userStats

        // Update state
        rootStore.updateTheme('light')

        // Access the updated computed view
        stats = rootStore.userStats
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Sort results by category and then by name
  results.sort((a, b) => {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name)
    }
    return a.category.localeCompare(b.category)
  })

  console.table(results)
}

// Benchmark 7: URL Store Integration
function benchmarkUrlStoreIntegration(iterations = 500) {
  console.log('\n--- Benchmark: URL Store Integration ---')

  const results = []

  // CATEGORY: Store Libraries
  // Cami Store with URL Navigation
  results.push(
    formatResult(
      'URL Store Integration',
      measureTime(i => {
        const uniqueId = `url${i}`
        // Mock window and location for testing
        const mockWindow = {
          location: { hash: `#/profile/${i}` },
          addEventListener: () => {},
          history: { pushState: () => {} },
        }

        // Create stores
        const appStore = store({
          state: {
            currentRoute: '',
            params: {},
            user: { id: null, name: '' },
          },
          name: `app-store-${uniqueId}`,
        })

        // Define actions
        appStore.defineAction(`syncRoute-${uniqueId}`, ({ state, payload }) => {
          state.currentRoute = payload.route
          state.params = payload.params
          if (payload.route === 'profile') {
            state.user.id = payload.params.id
          }
        })

        // Simulate URL parsing and store update
        const hash = mockWindow.location.hash.slice(1)
        const segments = hash.split('/').filter(Boolean)
        const route = segments[0]
        const params = segments[1] ? { id: segments[1] } : {}

        appStore.dispatch(`syncRoute-${uniqueId}`, { route, params })

        // Get and use state
        const state = appStore.getState()
      }, iterations),
      iterations,
      'Store Libraries'
    )
  )

  // Sort results by category and then by name
  results.sort((a, b) => {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name)
    }
    return a.category.localeCompare(b.category)
  })

  console.table(results)
}

// Run all benchmarks
function runAllBenchmarks() {
  console.log('=== Starting Reactive Library Benchmarks ===')
  benchmarkCreationAndSubscription()
  benchmarkValueUpdates()
  benchmarkMultipleSubscribers()
  benchmarkDeepObjectUpdates()
  benchmarkComputedValues()
  benchmarkStoreOperations()
  benchmarkUrlStoreIntegration()
  console.log('=== Completed Reactive Library Benchmarks ===')
}

runAllBenchmarks()
