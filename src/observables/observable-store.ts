import {
  Draft,
  Patch,
  applyPatches,
  createDraft,
  enableMapSet,
  enablePatches,
  freeze,
  produceWithPatches,
  setAutoFreeze,
} from 'immer'

import { __config } from '../config.js'
import { getRenderPhaseContext } from '../render-phase'
import { __trace } from '../trace.js'
import { validateType } from '../types/index.js'
import { _deepClone, _deepEqual } from '../utils'
import { DependencyTracker } from './observable-state.js'
import { Observable } from './observable.js'

// Enable immer patches and Map/Set support for our store implementation
enablePatches()
enableMapSet()

// Disable auto-freeze to prevent immer from freezing objects passed to actions
setAutoFreeze(false)

// =============================================================================
// Core Type Definitions
// =============================================================================

export interface StoreConfig<_TState = any> {
  name?: string
  schema?: Record<string, any>
  enableLogging?: boolean
  enableDevtools?: boolean
}

export interface ReducerContext<TState = any> {
  state: Draft<TState>
  payload: any
  dispatch: (action: string, payload?: any) => any
  query: (queryName: string, payload?: any) => Promise<any>
  mutate: (mutationName: string, payload?: any) => Promise<any>
  invalidateQueries: (options: InvalidateQueriesOptions) => void
  memo: (memoName: string, payload?: any) => any
  trigger: (eventName: string, payload?: any) => Promise<TState>
  dispatchAsync?: (thunkName: string, payload?: any) => Promise<any>
}

export interface ActionHandler<TState = any> {
  (context: ReducerContext<TState>): void
}

export interface QueryConfig<TArgs = any, TResult = any> {
  queryKey: string | string[] | ((args: TArgs) => string[])
  queryFn: (args: TArgs) => Promise<TResult>
  staleTime?: number
  refetchOnWindowFocus?: boolean
  refetchInterval?: number | null
  refetchOnReconnect?: boolean
  gcTime?: number
  retry?: number
  retryDelay?: number | ((attempt: number) => number)
  onFetch?: (context: QueryContext<TArgs>) => void
  onSuccess?: (context: QuerySuccessContext<TArgs, TResult>) => void
  onError?: (context: QueryErrorContext<TArgs>) => void
  onSettled?: (context: QuerySettledContext<TArgs, TResult>) => void
}

export interface QueryContext<TArgs = any> {
  state: any
  payload: TArgs
  dispatch: (action: string, payload?: any) => any
  trigger: (eventName: string, payload?: any) => Promise<any>
  memo: (memoName: string, payload?: any) => any
  query: (queryName: string, payload?: any) => Promise<any>
  mutate: (mutationName: string, payload?: any) => Promise<any>
  invalidateQueries: (options: InvalidateQueriesOptions) => void
  dispatchAsync: (thunkName: string, payload?: any) => Promise<any>
}

export interface QuerySuccessContext<TArgs = any, TResult = any> extends QueryContext<TArgs> {
  data: TResult
  result?: TResult
}

export interface QueryErrorContext<TArgs = any> extends QueryContext<TArgs> {
  error: Error
}

export interface QuerySettledContext<TArgs = any, TResult = any> extends QueryContext<TArgs> {
  data?: TResult
  error?: Error
}

export interface CachedQueryData<TResult = any> {
  data: TResult
  timestamp: number
  isStale: boolean
}

export interface MutationConfig<TArgs = any, TResult = any> {
  mutationFn: (args: TArgs) => Promise<TResult>
  onMutate?: (context: MutationContext<TArgs>) => any
  onError?: (context: MutationErrorContext<TArgs>) => void
  onSuccess?: (context: MutationSuccessContext<TArgs, TResult>) => void
  onSettled?: (context: MutationSettledContext<TArgs, TResult>) => void
}

export interface MutationContext<TArgs = any> {
  state: any
  payload: TArgs
  dispatch: (action: string, payload?: any) => any
  trigger: (eventName: string, payload?: any) => Promise<any>
  memo: (memoName: string, payload?: any) => any
  query: (queryName: string, payload?: any) => Promise<any>
  mutate: (mutationName: string, payload?: any) => Promise<any>
  previousState: any
  invalidateQueries: (options: InvalidateQueriesOptions) => void
  dispatchAsync: (thunkName: string, payload?: any) => Promise<any>
}

export interface MutationSuccessContext<TArgs = any, TResult = any> extends MutationContext<TArgs> {
  data: TResult
}

export interface MutationErrorContext<TArgs = any> extends MutationContext<TArgs> {
  error: Error
}

export interface MutationSettledContext<TArgs = any, TResult = any> extends MutationContext<TArgs> {
  data?: TResult
  error?: Error
}

export interface InvalidateQueriesOptions {
  queryKey?: string[]
  predicate?: (query: QueryConfig) => boolean
}

export interface AsyncActionContext<TState = any> {
  state: Readonly<TState>
  dispatch: (action: string, payload?: any) => any
  dispatchAsync: (thunkName: string, payload?: any) => Promise<any>
  trigger: (eventName: string, payload?: any) => Promise<TState>
  query: (queryName: string, payload?: any) => Promise<any>
  mutate: (mutationName: string, payload?: any) => Promise<any>
  invalidateQueries: (options: InvalidateQueriesOptions) => void
  payload: any
}

export interface AsyncActionHandler<TState = any, TResult = any> {
  (context: AsyncActionContext<TState>, payload?: any): Promise<TResult>
}

export interface MemoContext<TState = any> {
  state: TState
  payload: any
  dispatch: (action: string, payload?: any) => any
  trigger: (eventName: string, payload?: any) => Promise<TState>
  memo: (memoName: string, payload?: any) => any
  query: (queryName: string, payload?: any) => Promise<any>
  mutate: (mutationName: string, payload?: any) => Promise<any>
  dispatchAsync: (thunkName: string, payload?: any) => Promise<any>
}

export interface MemoHandler<TState = any, TResult = any> {
  (context: MemoContext<TState>): TResult
}

export interface CachedMemoData<TResult = any> {
  result: TResult
  dependencies: Set<string>
  stateVersion: number
}

export interface HookContext<TState = any> {
  action: string
  payload: any
  state: TState
  previousState?: TState
  patches?: Patch[]
  inversePatches?: Patch[]
  dispatch?: (action: string, payload?: any) => any
}

export interface Hook<TState = any> {
  (context: HookContext<TState>): void
}

export interface StateMachineEvent<TState = any> {
  from?: TState | TState[] | ((state: TState) => boolean)
  to: Partial<TState> | ((context: { state: TState; payload: any }) => Partial<TState>)
  guard?: (context: { state: TState; payload: any; action: string }) => boolean
  onTransition?: (context: { from: TState; to: TState; payload: any; data?: any }) => void
  onEntry?: (context: { state: TState; previousState: TState; payload: any }) => void
  onExit?: (context: { state: TState; payload: any }) => void
  data?: any
}

export interface StateMachineDefinition<TState = any> {
  [eventName: string]: StateMachineEvent<TState>
}

export interface ActionSpec<TState = any> {
  precondition?: (context: { state: TState; payload: any; action: string }) => boolean
  postcondition?: (context: {
    state: TState
    payload: any
    action: string
    previousState: TState
  }) => boolean
}

export interface PatchListener {
  (patches: Patch[]): void
}

// =============================================================================
// Main ObservableStore Class
// =============================================================================

/**
 * @class ObservableStore
 * @extends {Observable}
 * @description This class is used to create a store that can be observed for changes. It supports registering actions and middleware, making it flexible for various use cases.
 * @example
 * ```typescript
 * // Creating a store with initial state and registering actions
 * interface CartState {
 *   cartItems: Array<{ id: string; name: string; price: number }>;
 * }
 *
 * const CartStore = store<CartState>({
 *   state: { cartItems: [] },
 * });
 *
 * CartStore.defineAction('add', ({ state, payload }) => {
 *   const cartItem = { ...payload, cartItemId: Date.now().toString() };
 *   state.cartItems.push(cartItem);
 * });
 *
 * CartStore.defineAction('remove', ({ state, payload }) => {
 *   state.cartItems = state.cartItems.filter(item => item.cartItemId !== payload.cartItemId);
 * });
 * ```
 */
export class ObservableStore<TState = any> extends Observable<TState> {
  public readonly name: string
  public readonly schema: Record<string, any>
  public _uid?: string

  // State management
  private _state: TState
  private _frozenState: TState | null = null // Used in proxy handlers
  private _isDirty = false
  private _stateVersion = 0
  public previousState: TState

  // Core data structures
  public readonly reducers: Record<string, ActionHandler<TState>> = {}
  public readonly actions: Record<string, (payload?: any) => any> = {}
  public readonly dispatchQueue: Array<{ action: string; payload: any }> = []
  public isDispatching = false
  public currentDispatchPromise: Promise<any> | null = null

  // Cache structures
  public readonly queryCache = new Map<string, CachedQueryData>()
  public readonly queryFunctions = new Map<string, QueryConfig>()
  public readonly queries: Record<string, (...args: any[]) => Promise<any>> = {}
  public readonly memoCache = new Map<string, Map<any, CachedMemoData>>()

  // Resource management
  public readonly intervals = new Map<string, ReturnType<typeof setTimeout>>()
  public readonly focusHandlers = new Map<string, () => void>()
  public readonly reconnectHandlers = new Map<string, () => void>()
  public readonly gcTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

  // Advanced features
  public readonly mutationFunctions = new Map<string, MutationConfig>()
  public readonly mutations: Record<string, (...args: any[]) => Promise<any>> = {}
  public readonly patchListeners = new Map<string, PatchListener[]>()
  public readonly machines: Record<string, StateMachineDefinition<TState>> = {}
  public readonly memos: Record<string, MemoHandler<TState>> = {}
  public readonly thunks: Record<string, AsyncActionHandler<TState>> = {}
  public readonly specs = new Map<string, ActionSpec<TState>>()

  // Hooks for middleware-like functionality
  public readonly beforeHooks: Hook<TState>[] = []
  public readonly afterHooks: Hook<TState>[] = []
  private readonly throttledAfterHooks: (context: HookContext<TState>) => void

  // Dispatch tracking to prevent infinite loops
  private __isDispatching = false
  private __dispatchStack: string[] = []

  // Internal state management
  private _stateTrapStore?: WeakMap<any, Map<string | symbol, any>>
  private __subscriber: { next: (state: TState) => void } | null = null

  constructor(initialState: TState, options: StoreConfig<TState> = {}) {
    super(subscriber => {
      this.__subscriber = subscriber.next ? { next: subscriber.next } : null
      return () => {
        this.__subscriber = null
      }
    })

    this.name = options.name || 'cami-store'
    this.schema = options.schema || {}
    this._uid = this.name

    // Use immer's draft for immutable state tracking with efficient updates
    this._state = createDraft(initialState as any) as TState

    // Keep a frozen snapshot of current state for reads
    this._frozenState = null

    // Track whether state has changed to avoid unnecessary notifications
    this._isDirty = false

    // State version for internal tracking of changes
    this._stateVersion = 0

    // Store original state for change detection
    this.previousState = initialState

    // Bind methods to ensure consistent this context
    this.dispatch = this.dispatch.bind(this)
    this.query = this.query.bind(this)
    this.mutate = this.mutate.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.trigger = this.trigger.bind(this)
    this.memo = this.memo.bind(this)
    this.invalidateQueries = this.invalidateQueries.bind(this)
    this.dispatchAsync = this.dispatchAsync.bind(this)

    // Create throttled after hooks
    this.throttledAfterHooks = this.__executeAfterHooks.bind(this)

    // Add hook to update state version after changes
    this.afterHook(() => {
      this._stateVersion++
    })

    // Validate initial state against schema if provided
    if (Object.keys(this.schema).length > 0) {
      this._validateState(this._state)
    }
  }

  /**
   * Returns a snapshot of the current state
   * Automatically tracks dependencies for reactive computations
   */
  get state(): TState {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this)
    }
    // Create a frozen state only once and cache it until next change
    if (!this._frozenState) {
      // Deep clone the state first to filter out symbols and other internal properties
      const cleanState = _deepClone(this._state)
      this._frozenState = deepFreeze(cleanState) as TState
    }
    return this._frozenState
  }

  /**
   * Alternative to 'state' getter that follows standard getState pattern
   * Used by many libraries and compatible with redux-like interfaces
   */
  getState(): TState {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this)
    }
    // Reuse the frozen state from the getter
    if (!this._frozenState) {
      // Deep clone the state first to filter out symbols and other internal properties
      const cleanState = _deepClone(this._state)
      this._frozenState = deepFreeze(cleanState) as TState
    }
    return this._frozenState
  }

  /**
   * Creates a proxy that tracks property access for dependency tracking
   * and automatically schedules updates when properties change
   *
   * This is a critical path for performance optimization
   */
  // @ts-ignore - _createProxy is currently unused but kept for potential future use
  private _createProxy(target: TState): TState {
    // Common internal props to skip - precompute for faster checks
    const SKIP_PROPS = new Set(['constructor', 'toJSON'])

    // Use WeakMap to store method bindings without modifying the target object
    // This completely prevents Symbol leakage into the state object
    if (!this._stateTrapStore) {
      this._stateTrapStore = new WeakMap()
    }
    if (!this._stateTrapStore.has(target)) {
      this._stateTrapStore.set(target, new Map())
    }

    return new Proxy(target as any, {
      get: (target, prop, receiver) => {
        // Fast path 1: Skip dependency tracking for symbols and internal methods
        // Don't allow any symbols to be accessed from the target
        if (typeof prop === 'symbol' || SKIP_PROPS.has(prop as string)) {
          // For symbols, return undefined to prevent them from being accessed
          if (typeof prop === 'symbol') {
            return undefined
          }
          return Reflect.get(target, prop, receiver)
        }

        // Fast path 2: Track dependency if in reactive context
        // This is a hot path for reactive components
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(this, prop as string)
        }

        // Get the actual value (this is the most common operation)
        const value = Reflect.get(target, prop, receiver)

        // Fast path 3: For non-functions, return directly
        if (typeof value !== 'function') {
          return value
        }

        // Only for functions: ensure correct binding using WeakMap
        // This is less common so it's moved to the end of the function
        if (!Object.getOwnPropertyDescriptor(target, prop)) {
          // Check if we already have a bound method using WeakMap
          const trapMap = this._stateTrapStore!.get(target)
          if (!trapMap!.has(prop)) {
            trapMap!.set(prop, value.bind(target))
          }
          return trapMap!.get(prop)
        }

        return value
      },

      set: (target, prop, value, receiver) => {
        // Fast path: Prevent symbols from being set on the target
        // This completely prevents symbol leakage into the state object
        if (typeof prop === 'symbol') {
          // Don't allow symbols to be set on the state object at all
          return true // Return true to indicate "success" without actually setting
        }

        // Skip other internal properties
        if (SKIP_PROPS.has(prop as string)) {
          return Reflect.set(target, prop, value, receiver)
        }

        // Performance optimization: Reference equality check before updating
        // This avoids unnecessary updates when the value hasn't changed
        const oldValue = (target as any)[prop]

        // If the value is the same by reference equality, skip the update
        if (oldValue === value) {
          return true
        }

        // For objects and arrays, use deep equality check
        if (
          typeof value === 'object' &&
          value !== null &&
          typeof oldValue === 'object' &&
          oldValue !== null
        ) {
          if (_deepEqual(oldValue, value)) {
            return true
          }
        }

        // Value is different, perform the actual set operation
        const result = Reflect.set(target, prop, value, receiver)

        // Mark as dirty and invalidate the frozen state
        this._isDirty = true
        this._frozenState = null

        // Add property to proxy if it's new
        if (typeof prop === 'string' && !(prop in this)) {
          this._addProxyProperty(prop)
        }

        return result
      },

      deleteProperty: (target, prop) => {
        // Only mark dirty if the property actually exists
        if (prop in target) {
          const result = Reflect.deleteProperty(target, prop)
          this._isDirty = true
          this._frozenState = null
          return result
        }
        return true
      },

      // These traps are less frequently used but still important for correctness

      ownKeys: target => {
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(this)
        }
        // Filter out symbols to prevent internal symbols from leaking into state
        return Reflect.ownKeys(target).filter(key => typeof key !== 'symbol')
      },

      has: (target, prop) => {
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(this, prop as string)
        }
        return Reflect.has(target, prop)
      },

      defineProperty: (target, prop, descriptor) => {
        // Prevent symbols from being defined on the target
        if (typeof prop === 'symbol') {
          return true // Return true to indicate "success" without actually defining
        }

        const result = Reflect.defineProperty(target, prop, descriptor)
        if (result) {
          this._isDirty = true
          this._frozenState = null
          if (typeof prop === 'string' && !(prop in this)) {
            this._addProxyProperty(prop)
          }
        }
        return result
      },

      getOwnPropertyDescriptor: (target, prop) => {
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(this, prop as string)
        }
        return Reflect.getOwnPropertyDescriptor(target, prop)
      },
    }) as TState
  }

  /**
   * Adds a property from the state to the store instance for direct access
   * Only used for properties not already defined on the store
   */
  private _addProxyProperty(key: string): void {
    // Check if the property name is valid and doesn't conflict with existing methods
    if (
      typeof key === 'string' &&
      !key.startsWith('_') &&
      !key.startsWith('__') &&
      !(key in this) &&
      !['dispatch', 'getState', 'subscribe'].includes(key)
    ) {
      Object.defineProperty(this, key, {
        get: () => (this._state as any)[key],
        set: value => {
          ;(this._state as any)[key] = value
          this._isDirty = true
          this._frozenState = null
        },
        enumerable: true,
        configurable: true,
      })
    }
  }

  /**
   * Efficiently notifies observers of state changes
   * Only triggers if state has changed and batches notifications
   */
  private _notifyObservers(): void {
    // Only proceed if state is marked as dirty
    if (!this._isDirty) return

    // Fast path: If there are no observers and no subscriber
    if (!this.hasObservers && !this.__subscriber) {
      this._isDirty = false
      return
    }

    // Before proceeding with expensive operations, check if the state actually changed
    // by doing a deeper comparison with the previous state
    if (this.previousState && _deepEqual(this._state, this.previousState)) {
      // State hasn't actually changed in a meaningful way, so don't notify observers
      this._isDirty = false
      return
    }

    // Clear memo cache for consistent derived calculations
    this.memoCache.clear()
    this._frozenState = null

    // Get a stable snapshot of the current state
    const stateToEmit = _deepClone(this._state)

    // Use a local reference to avoid issues if observers modify the collection
    const observerCount = this.observerCount

    // Notify all observers
    if (observerCount > 0) {
      this.notifyObservers(stateToEmit)
    }

    // Notify subscriber if exists
    if (this.__subscriber && typeof this.__subscriber.next === 'function') {
      this.__subscriber.next(stateToEmit)
    }

    // Update previous state for next change detection
    this.previousState = _deepClone(this._state)
    this._isDirty = false

    // Emit web event if enabled - but only if we know it's actually used
    if (__config.events.isEnabled && typeof window !== 'undefined') {
      const event = new CustomEvent('cami:store:state:change', {
        detail: {
          store: this.name,
          state: stateToEmit,
        },
      })
      window.dispatchEvent(event)
    }
  }

  /**
   * Creates a schema definition for type validation
   */
  private _createDeepSchema(state: any): Record<string, any> {
    // Use a cached Map for type inference to improve performance
    const typeCache = new Map()

    const inferType = (value: any): any => {
      // Fast path for primitives
      if (value === null) return 'null'
      if (value === undefined) return 'undefined'

      // Use cached type if available
      if (typeCache.has(value)) {
        return typeCache.get(value)
      }

      // Determine type for reference types
      let type: any
      if (Array.isArray(value)) {
        type = 'array'
      } else if (typeof value === 'object') {
        type = this._createDeepSchema(value)
      } else {
        type = typeof value
      }

      // Cache and return
      if (typeof value === 'object' && value !== null) {
        typeCache.set(value, type)
      }

      return type
    }

    // Process all properties
    return Object.keys(state).reduce(
      (acc, key) => {
        acc[key] = inferType(state[key])
        return acc
      },
      {} as Record<string, any>
    )
  }

  /**
   * Validates a state object against a schema
   */
  private _validateDeepState(schema: Record<string, any>, state: any, path: string[] = []): void {
    // Fast path if schema is empty
    if (!schema || Object.keys(schema).length === 0) return

    Object.keys(schema).forEach(key => {
      const expectedType = schema[key]
      const actualValue = state[key]
      const currentPath = [...path, key]
      const actualType = this._inferType(actualValue)

      // Skip function validation
      if (actualType === 'function') return

      // Handle nested objects recursively
      if (typeof expectedType === 'object' && expectedType !== null) {
        if (typeof actualValue !== 'object' || actualValue === null) {
          throw new TypeError(
            `Invalid type at ${currentPath.join('.')}. Expected object, got ${typeof actualValue}`
          )
        }
        this._validateDeepState(expectedType, actualValue, currentPath)
      }
      // Handle primitive types
      else {
        // Special cases for null and undefined (allow any type)
        if (expectedType === 'null' || expectedType === 'undefined') {
          return
        }
        // Type mismatch error
        else if (actualType !== expectedType) {
          throw new TypeError(
            `Invalid type at ${currentPath.join('.')}. Expected ${expectedType}, got ${actualType}`
          )
        }
      }
    })
  }

  /**
   * Determine the type of a value
   */
  private _inferType(value: any): string {
    if (Array.isArray(value)) return 'array'
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    return typeof value
  }

  /**
   * Public API for dispatching actions
   */
  dispatch(action: string, payload?: any): TState {
    return this._dispatch(action, payload)
  }

  /**
   * Main implementation of action dispatch
   * Critical performance path - heavily optimized
   */
  private _dispatch(action: string, payload?: any): TState {
    const renderContext = getRenderPhaseContext()
    if (renderContext.inRenderPhase) {
      const activeElementTagName = renderContext.activeElementTagName || 'unknown'
      throw new Error(
        `[Cami.js] Dispatch \"${String(action)}\" is not allowed during render phase (element: <${activeElementTagName}>). Move this dispatch into an event handler, afterRender(), or an explicit async/query/mutation boundary.`
      )
    }

    // Fast path 1: Cyclic dispatch detection
    if (this.__isDispatching) {
      const cycle = [...this.__dispatchStack, action].join(' -> ')
      console.warn(`[Cami.js] Cyclic dispatch detected: ${cycle}`)
    }

    // Begin dispatch tracking
    this.__isDispatching = true
    this.__dispatchStack.push(action)

    // Fast path 2: Type validation - fail early
    if (action === undefined) {
      const currentAction = this.__dispatchStack[this.__dispatchStack.length - 2]
      this.__dispatchStack.pop()
      this.__isDispatching = false
      throw new Error(
        currentAction
          ? `[Cami.js] Attempted to dispatch undefined action. This is likely invoked in action "${currentAction}".`
          : `[Cami.js] Attempted to dispatch undefined action in the global namespace.`
      )
    }

    if (typeof action !== 'string') {
      this.__dispatchStack.pop()
      this.__isDispatching = false
      throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof action}`)
    }

    // Fast path 3: Handle missing reducer without expensive operations
    const reducer = this.reducers[action]
    if (!reducer) {
      this.__dispatchStack.pop()
      this.__isDispatching = false
      __trace('cami:store:warn', `No reducer found for action ${action}`)
      throw new Error(`[Cami.js] No reducer found for action: ${action}`)
    }

    // Store original state for potential rollback - only clone when needed
    const originalState = _deepClone(this._state)

    try {
      // Fast path 4: Skip spec check if no specs defined
      const spec = this.specs?.get(action)
      if (spec?.precondition) {
        const isPreconditionMet = spec.precondition({
          state: this._state as any,
          payload,
          action,
        })

        if (!isPreconditionMet) {
          throw new Error(`Precondition not met for action ${action}`)
        }
      }

      // Fast path 5: Skip before hooks if none defined
      if (this.beforeHooks.length > 0) {
        this.__applyHooks('before', {
          action,
          payload,
          state: this._state as any,
        })
      }

      // Create reducer context object with consistent shape for V8 optimization
      const reducerContext: ReducerContext<TState> = {
        state: this._state as Draft<TState>,
        payload,
        dispatch: this.dispatch,
        query: this.query,
        mutate: this.mutate,
        invalidateQueries: this.invalidateQueries,
        memo: this.memo,
        trigger: this.trigger,
      }

      try {
        // Use immer's produceWithPatches for efficient immutable updates
        const [nextState, patches, inversePatches] = produceWithPatches(this._state, _draft => {
          // DO NOT set draft to reducerContext.state
          // Doing this also causes subtle bugs that are hard to catch in tests
          reducer(reducerContext)
        })

        // Fast path 6: Skip postcondition if not defined
        if (spec?.postcondition) {
          const isPostconditionMet = spec.postcondition({
            state: nextState as any,
            payload,
            action,
            previousState: this._state as any,
          })

          if (!isPostconditionMet) {
            throw new Error(`Postcondition not met for action ${action}`)
          }
        }

        // Mark store as dirty and invalidate frozen state - always needed
        this._isDirty = true
        this._frozenState = null

        // Fast path 7: Only process patches if there are any
        const hasPatches = patches.length > 0

        if (hasPatches) {
          // Update state with nextState values - avoid forEach for better performance
          // Use a fast for-in loop which is optimized for object keys
          for (const key in nextState) {
            if (Object.prototype.hasOwnProperty.call(nextState, key)) {
              ;(this._state as any)[key] = (nextState as any)[key]
            }
          }

          // Notify patch listeners - only if we have patches
          if (this.patchListeners.size > 0) {
            this._notifyPatchListeners(patches)
          }

          // Trace state changes if tracing is enabled (dev mode)
          __trace(
            'cami:store:state:change',
            `Changed store state via action: ${action}`,
            inversePatches,
            patches
          )
        }

        // Fast path 8: Always run after hooks after successful dispatch (regardless of patches)
        if (this.afterHooks.length > 0) {
          this.__applyHooks('after', {
            action,
            payload,
            state: nextState as any,
            previousState: originalState,
            patches,
            inversePatches,
            dispatch: this.dispatch,
          })
        }

        // Fast path 9: Skip validation if no schema
        if (Object.keys(this.schema).length > 0) {
          this._validateState(hasPatches ? this._state : nextState)
        }

        // Always notify observers to ensure UI updates
        this._notifyObservers()
      } catch (error) {
        // Error recovery - restore original state
        this._state = createDraft(_deepClone(originalState)) as TState

        // Reset cache and internal tracking
        this._isDirty = true
        this._frozenState = null
        this.memoCache.clear()

        // Re-throw the error
        throw error
      }

      // Return current state for any chained operations.
      // The trailing getState() must NOT register a reactive dependency —
      // a dispatch during a component's commit phase (e.g. child
      // disconnectedCallback → store.dispatch) would otherwise subscribe the
      // parent's render effect to this store, causing re-entrant render on
      // the next notification. Suppress dependency tracking for this call.
      const __prevTracker = DependencyTracker.current
      DependencyTracker.current = null
      try {
        return this.getState()
      } finally {
        DependencyTracker.current = __prevTracker
      }
    } finally {
      // Always clean up dispatch tracking
      this.__dispatchStack.pop()
      this.__isDispatching = false
    }
  }

  /**
   * Add a hook to run before actions
   */
  beforeHook(hook: Hook<TState>): () => void {
    if (typeof hook !== 'function') {
      throw new Error('[Cami.js] Hook must be a function')
    }
    this.beforeHooks.push(hook)
    return () => {
      const hooks = this.beforeHooks
      const index = hooks.indexOf(hook)
      if (index !== -1) {
        // Faster removal by swapping with last element and popping - O(1)
        const lastIndex = hooks.length - 1
        if (index < lastIndex) {
          hooks[index] = hooks[lastIndex]
        }
        hooks.pop()
      }
    }
  }

  /**
   * Add a hook to run after actions
   */
  afterHook(hook: Hook<TState>): () => void {
    if (typeof hook !== 'function') {
      throw new Error('[Cami.js] Hook must be a function')
    }
    this.afterHooks.push(hook)
    return () => {
      const hooks = this.afterHooks
      const index = hooks.indexOf(hook)
      if (index !== -1) {
        // Faster removal by swapping with last element and popping - O(1)
        const lastIndex = hooks.length - 1
        if (index < lastIndex) {
          hooks[index] = hooks[lastIndex]
        }
        hooks.pop()
      }
    }
  }

  /**
   * Run hooks of a specific type
   * Optimized to skip empty hook arrays
   */
  private __applyHooks(type: 'before' | 'after', context: HookContext<TState>): void {
    if (type === 'before') {
      // Fast path 1: No before hooks registered
      const hooks = this.beforeHooks
      const len = hooks.length
      if (len === 0) return

      // Run all before hooks synchronously with while loop counting down
      let i = len
      while (i--) {
        hooks[i](context)
      }
    } else if (type === 'after') {
      // Fast path: no after hooks registered
      if (this.afterHooks.length === 0) return

      // Use throttled hook execution to reduce calls
      this.throttledAfterHooks(context)
    }
  }

  /**
   * Execute after hooks with current context
   */
  private __executeAfterHooks(context: HookContext<TState>): void {
    // Fast path: no after hooks registered
    const hooks = this.afterHooks
    const len = hooks.length
    if (len === 0) return

    // Run all after hooks with optimized loop
    let i = len
    while (i--) {
      try {
        hooks[i](context)
      } catch (error) {
        console.error(`[Cami.js] Error in afterHook[${i}]:`, error)
        // Re-throw the error so it can be caught by tests and rollback logic
        throw error
      }
    }
  }

  /**
   * Notify patch listeners of changes
   * Optimized for performance with key-based targeting
   */
  private _notifyPatchListeners(patches: Patch[]): void {
    // Fast path: no patch listeners
    if (this.patchListeners.size === 0) return

    // Create a map of keys to an array of patches for that key
    const patchesByKey = new Map<string, Patch[]>()

    // Group patches by key - use while loop counting down for better performance
    const patchesLen = patches.length
    let i = patchesLen
    while (i--) {
      const patch = patches[i]
      const key = patch.path[0] as string // First segment of path

      // Skip if no listeners for this key
      if (!this.patchListeners.has(key)) continue

      // Add to key's patch array - reuse existing arrays when possible
      let keyPatches = patchesByKey.get(key)
      if (!keyPatches) {
        keyPatches = []
        patchesByKey.set(key, keyPatches)
      }
      keyPatches.push(patch)
    }

    // Notify listeners with grouped patches
    for (const [key, keyPatches] of patchesByKey) {
      const listeners = this.patchListeners.get(key)
      if (!listeners || listeners.length === 0) continue

      // Use direct array access with while loop for better performance
      const listenersLen = listeners.length
      let j = listenersLen
      while (j--) {
        try {
          listeners[j](keyPatches)
        } catch (error) {
          console.error(`[Cami.js] Error in patch listener for key "${key}":`, error)
        }
      }
    }
  }

  /**
   * @method defineAction
   * @param {string} action - The action type
   * @param {ActionHandler} reducer - The reducer function for the action
   * @throws {Error} - Throws an error if the action type is already registered
   * @description This method registers a reducer function for a given action type. Useful if you like redux-style reducers.
   */
  defineAction(action: string, reducer: ActionHandler<TState>): this {
    // Validation
    if (typeof action !== 'string') {
      throw new Error(`[Cami.js] Action name must be a string, got: ${typeof action}`)
    }

    if (typeof reducer !== 'function') {
      throw new Error(`[Cami.js] Reducer must be a function, got: ${typeof reducer}`)
    }

    // Check for existing action in THIS store instance, not globally
    if (this.reducers[action]) {
      throw new Error(`[Cami.js] Action '${action}' is already defined in store '${this.name}'.`)
    }

    // Create context once when defining the action
    const baseContext = {
      dispatch: this.dispatch,
      query: this.query,
      mutate: this.mutate,
      memo: this.memo,
      trigger: this.trigger,
      invalidateQueries: this.invalidateQueries,
      dispatchAsync: this.dispatchAsync,
    }

    // Store the reducer with a wrapper that adds context
    this.reducers[action] = (context: ReducerContext<TState>) => {
      // Merge provided context with base context
      const storeContext = Object.assign({}, baseContext, context)
      return reducer(storeContext)
    }

    // Create direct action helper method
    this.actions[action] = (payload?: any) => this.dispatch(action, payload)

    // For chaining
    return this
  }

  /**
   * Define a spec for an action
   * Specs can include preconditions and postconditions
   */
  defineSpec(actionName: string, spec: ActionSpec<TState>): this {
    if (typeof actionName !== 'string') {
      throw new Error(`[Cami.js] Action name must be a string, got: ${typeof actionName}`)
    }

    if (!spec || typeof spec !== 'object') {
      throw new Error(`[Cami.js] Spec must be an object, got: ${typeof spec}`)
    }

    // Validate spec content
    if (spec.precondition && typeof spec.precondition !== 'function') {
      throw new Error(`[Cami.js] Precondition must be a function, got: ${typeof spec.precondition}`)
    }

    if (spec.postcondition && typeof spec.postcondition !== 'function') {
      throw new Error(
        `[Cami.js] Postcondition must be a function, got: ${typeof spec.postcondition}`
      )
    }

    this.specs.set(actionName, spec)

    // For chaining
    return this
  }

  /**
   * @method defineAsyncAction
   * @param {string} thunkName - The name of the thunk
   * @param {AsyncActionHandler} asyncCallback - The async function to be executed
   * @description Defines a new thunk for the store
   */
  defineAsyncAction(thunkName: string, asyncCallback: AsyncActionHandler<TState>): void {
    if (this.thunks[thunkName]) {
      throw new Error(`[Cami.js] Thunk '${thunkName}' is already defined.`)
    }
    this.thunks[thunkName] = asyncCallback
  }

  /**
   * @method dispatchAsync
   * @param {string} thunkName - The name of the thunk to dispatch
   * @param {*} payload - The payload for the thunk
   * @returns {Promise} A promise that resolves with the result of the thunk
   * @description Dispatches an async thunk
   */
  async dispatchAsync(thunkName: string, payload?: any): Promise<any> {
    const thunk = this.thunks[thunkName]
    if (!thunk) {
      throw new Error(`[Cami.js] No thunk found for name: ${thunkName}`)
    }

    const context: AsyncActionContext<TState> = {
      state: deepFreeze(this._state as any) as Readonly<TState>,
      dispatch: this.dispatch.bind(this),
      dispatchAsync: this.dispatchAsync.bind(this),
      trigger: this.trigger.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      invalidateQueries: this.invalidateQueries.bind(this),
      payload: payload,
    }

    try {
      return await thunk(context, payload)
    } catch (error) {
      console.error(`Error in thunk ${thunkName}:`, error)
      throw error
    }
  }

  async query<TResult = any>(queryName: string, payload?: any): Promise<TResult> {
    const query = this.queryFunctions.get(queryName)
    if (!query) {
      throw new Error(`[Cami.js] No query found for name: ${queryName}`)
    }

    try {
      return await this._executeQuery(queryName, payload, query)
    } catch (error) {
      console.error(`Error in query ${queryName}:`, error)
      throw error
    }
  }

  async mutate<TResult = any>(mutationName: string, payload?: any): Promise<TResult> {
    const mutation = this.mutationFunctions.get(mutationName)
    if (!mutation) {
      throw new Error(`[Cami.js] No mutation found for name: ${mutationName}`)
    }

    try {
      return await this._executeMutation(mutationName, payload, mutation)
    } catch (error) {
      console.error(`Error in mutation ${mutationName}:`, error)
      throw error
    }
  }

  defineMemo<TResult = any>(memoName: string, memoFn: MemoHandler<TState, TResult>): void {
    if (typeof memoName !== 'string') {
      throw new Error('Memo name must be a string')
    }
    if (typeof memoFn !== 'function') {
      throw new Error(`Memo '${memoName}' must be a function`)
    }
    this.memos[memoName] = memoFn
    this.memoCache.set(memoName, new Map())
  }

  /**
   * @method onPatch
   * @param {string} key - The state key to listen for patches.
   * @param {PatchListener} callback - The callback to invoke when patches are applied.
   * @description Registers a callback to be invoked whenever patches are applied to the specified state key.
   */
  onPatch(key: string, callback: PatchListener): () => void {
    if (!this.patchListeners.has(key)) {
      this.patchListeners.set(key, [])
    }
    this.patchListeners.get(key)!.push(callback)
    return () => {
      const listeners = this.patchListeners.get(key)
      if (!listeners) return
      const index = listeners.indexOf(callback)
      if (index > -1) {
        // Faster removal by swapping with last element and popping - O(1)
        const lastIndex = listeners.length - 1
        if (index < lastIndex) {
          listeners[index] = listeners[lastIndex]
        }
        listeners.pop()
      }
    }
  }

  /**
   * @method applyPatch
   * @param {Patch[]} patches - The patches to apply to the state.
   * @description Applies the given patches to the store's state.
   */
  applyPatch(patches: Patch[]): void {
    this._state = applyPatches(this._state as any, patches) as TState
    this.notifyObservers(this._state)
  }

  /**
   * @method defineQuery
   * @param {string} queryName - The name of the query to register.
   * @param {QueryConfig} config - The configuration object for the query.
   * @description Registers a query with the given configuration.
   */
  defineQuery<TArgs = any, TResult = any>(
    queryName: string,
    config: QueryConfig<TArgs, TResult>
  ): void {
    if (this.queryFunctions.has(queryName)) {
      throw new Error(`[Cami.js] Query with name ${queryName} has already been defined.`)
    }

    this.queryFunctions.set(queryName, config)
    this.queries[queryName] = (...args: any[]) => this.query(queryName, ...args)
  }

  private _executeQuery<TArgs = any, TResult = any>(
    queryName: string,
    payload: TArgs,
    query: QueryConfig<TArgs, TResult>
  ): Promise<TResult> {
    const {
      queryFn,
      queryKey,
      staleTime = 0,
      retry = 1,
      retryDelay,
      onFetch,
      onSuccess,
      onError,
      onSettled,
    } = query

    const cacheKey =
      typeof queryKey === 'function'
        ? queryKey(payload).join(':')
        : Array.isArray(queryKey)
          ? queryKey.join(':')
          : queryKey

    const cachedData = this.queryCache.get(cacheKey)

    const storeContext: QueryContext<TArgs> = {
      state: this._state,
      payload,
      dispatch: this.dispatch.bind(this),
      trigger: this.trigger.bind(this),
      memo: this.memo.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      invalidateQueries: this.invalidateQueries.bind(this),
      dispatchAsync: this.dispatchAsync.bind(this),
    }

    __trace(`_executeQuery`, `Checking cache for key: ${cacheKey}, exists: ${!!cachedData}`)

    if (cachedData && !this._isStale(cachedData, staleTime)) {
      __trace(`query`, `Returning cached data for: ${queryName} with cacheKey: ${cacheKey}`)
      return this._handleQueryResult(queryName, cachedData.data, null, storeContext, {
        ...(onSuccess && { onSuccess }),
        ...(onSettled && { onSettled }),
      })
    }

    __trace(`query`, `Data is stale or not cached, fetching new data for: ${queryName}`)

    if (onFetch) {
      __trace(`query`, `onFetch callback invoked for: ${queryName}`)
      onFetch(storeContext)
    }

    return this._fetchWithRetry(() => queryFn(payload), retry, retryDelay)
      .then(data => {
        this.queryCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          isStale: false,
        })
        return this._handleQueryResult(queryName, data, null, storeContext, {
          ...(onSuccess && { onSuccess }),
          ...(onSettled && { onSettled }),
        })
      })
      .catch(error => {
        return this._handleQueryResult(queryName, null, error, storeContext, {
          ...(onError && { onError }),
          ...(onSettled && { onSettled }),
        })
      })
  }

  private _handleQueryResult<TArgs = any, TResult = any>(
    queryName: string,
    data: TResult | null,
    error: Error | null,
    storeContext: QueryContext<TArgs>,
    callbacks: {
      onSuccess?: (context: QuerySuccessContext<TArgs, TResult>) => void
      onError?: (context: QueryErrorContext<TArgs>) => void
      onSettled?: (context: QuerySettledContext<TArgs, TResult>) => void
    }
  ): Promise<TResult> {
    const { onSuccess, onError, onSettled } = callbacks
    const context = { ...storeContext, data, error }

    if (error) {
      __trace(`query`, `Fetch failed: ${queryName}`)
      if (onError) onError(context as QueryErrorContext<TArgs>)
    } else {
      __trace(`query`, `Fetch success: ${queryName}`)
      if (onSuccess) onSuccess(context as QuerySuccessContext<TArgs, TResult>)
    }

    if (onSettled) {
      __trace(`query`, `Fetch settled: ${queryName}`)
      onSettled(context as QuerySettledContext<TArgs, TResult>)
    }

    if (error) throw error
    return Promise.resolve(data as TResult)
  }

  /**
   * @method invalidateQueries
   * @param {InvalidateQueriesOptions} options - The options for invalidating queries.
   * @description Invalidates the cache and any associated intervals or event listeners for the given queries.
   */
  invalidateQueries({ queryKey, predicate }: InvalidateQueriesOptions): void {
    if (!queryKey && !predicate) {
      throw new Error(`[Cami.js] invalidateQueries expects either a queryKey or a predicate.`)
    }

    const queriesToInvalidate = Array.from(this.queryFunctions.keys()).filter(queryName => {
      if (queryKey) {
        const storedQueryKey = this.queryFunctions.get(queryName)!.queryKey

        if (typeof storedQueryKey === 'function') {
          // If storedQueryKey is a function, we need to call it and compare the result
          try {
            const generatedKey = storedQueryKey({} as any)
            return JSON.stringify(generatedKey) === JSON.stringify(queryKey)
          } catch (error) {
            __trace(
              `invalidateQueries`,
              `Error generating key for ${queryName}: ${(error as Error).message}`
            )
            return false
          }
        } else if (Array.isArray(storedQueryKey)) {
          return JSON.stringify(storedQueryKey) === JSON.stringify(queryKey)
        } else {
          return storedQueryKey === queryKey[0]
        }
      }

      if (predicate) {
        return predicate(this.queryFunctions.get(queryName)!)
      }

      return false
    })

    queriesToInvalidate.forEach(queryName => {
      const query = this.queryFunctions.get(queryName)
      if (!query) return

      let cacheKey: string
      if (typeof query.queryKey === 'function') {
        cacheKey = query.queryKey({} as any).join(':')
      } else if (Array.isArray(query.queryKey)) {
        cacheKey = query.queryKey.join(':')
      } else {
        cacheKey = query.queryKey
      }

      __trace(
        `invalidateQueries`,
        `Invalidating query with key: ${queryName}, cacheKey: ${cacheKey}`
      )

      // Instead of deleting, mark as stale and reset timestamp
      if (this.queryCache.has(cacheKey)) {
        const cachedData = this.queryCache.get(cacheKey)!
        cachedData.isStale = true
        cachedData.timestamp = 0
        this.queryCache.set(cacheKey, cachedData)
      }

      // Clear any associated intervals or event listeners
      if (this.intervals.has(queryName)) {
        clearInterval(this.intervals.get(queryName)!)
        this.intervals.delete(queryName)
      }

      if (this.focusHandlers.has(queryName)) {
        window.removeEventListener('focus', this.focusHandlers.get(queryName)!)
        this.focusHandlers.delete(queryName)
      }

      if (this.reconnectHandlers.has(queryName)) {
        window.removeEventListener('online', this.reconnectHandlers.get(queryName)!)
        this.reconnectHandlers.delete(queryName)
      }

      if (this.gcTimeouts.has(queryName)) {
        clearTimeout(this.gcTimeouts.get(queryName)!)
        this.gcTimeouts.delete(queryName)
      }

      __trace(`invalidateQueries`, `Cache entry removed for key: ${cacheKey}`)
    })
  }

  /**
   * @private
   * @method fetchWithRetry
   * @param {Function} queryFn - The query function to execute.
   * @param {number} retry - The number of retries remaining.
   * @param {number | Function} retryDelay - The delay or function that returns the delay in milliseconds for each retry attempt.
   * @returns {Promise} A promise that resolves to the query result.
   * @description Executes the query function with retries and exponential backoff.
   */
  private _fetchWithRetry<TResult = any>(
    queryFnWithContext: () => Promise<TResult>,
    retry: number,
    retryDelay?: number | ((attempt: number) => number)
  ): Promise<TResult> {
    let attempts = 0

    const executeFetch = (): Promise<TResult> => {
      return queryFnWithContext().catch(error => {
        if (attempts < retry) {
          attempts++
          const delay = typeof retryDelay === 'function' ? retryDelay(attempts) : retryDelay || 1000
          return new Promise<TResult>(resolve => setTimeout(resolve, delay)).then(executeFetch)
        }
        throw error
      })
    }

    return executeFetch()
  }

  /**
   * @private
   * @method _isStale
   * @param {CachedQueryData} cachedData - The cached data object.
   * @param {number} staleTime - The stale time in milliseconds.
   * @returns {boolean} True if the cached data is stale, false otherwise.
   * @description Checks if the cached data is stale based on the stale time.
   */
  private _isStale(cachedData: CachedQueryData, staleTime: number): boolean {
    const currentTime = Date.now()
    const timeSinceLastUpdate = currentTime - cachedData.timestamp
    const isDataStale = !cachedData.timestamp || timeSinceLastUpdate > staleTime
    const isManuallyInvalidated = cachedData.isStale === true

    __trace(
      `_isStale`,
      `
      isDataStale: ${isDataStale}
      isManuallyInvalidated: ${isManuallyInvalidated}
      Current Time: ${currentTime}
      Data Timestamp: ${cachedData.timestamp}
      Time Since Last Update: ${timeSinceLastUpdate}ms
      Stale Time: ${staleTime}ms
    `
    )

    return isDataStale || isManuallyInvalidated
  }

  /**
   * @method defineMutation
   * @param {string} mutationName - The name of the mutation to register.
   * @param {MutationConfig} config - The configuration object for the mutation.
   * @description Registers a mutation with the given configuration.
   */
  defineMutation<TArgs = any, TResult = any>(
    mutationName: string,
    config: MutationConfig<TArgs, TResult>
  ): void {
    if (this.mutationFunctions.has(mutationName)) {
      throw new Error(`[Cami.js] Mutation with name ${mutationName} is already registered.`)
    }

    this.mutationFunctions.set(mutationName, config)
    this.mutations[mutationName] = (...args: any[]) => this.mutate(mutationName, ...args)
  }

  private _executeMutation<TArgs = any, TResult = any>(
    _mutationName: string,
    payload: TArgs,
    mutation: MutationConfig<TArgs, TResult>
  ): Promise<TResult> {
    const { mutationFn, onMutate, onError, onSuccess, onSettled } = mutation

    const previousState = _deepClone(this._state)

    const storeContext: MutationContext<TArgs> = {
      state: this._state,
      payload,
      dispatch: this.dispatch.bind(this),
      trigger: this.trigger.bind(this),
      memo: this.memo.bind(this),
      query: this.query.bind(this),
      mutate: this.mutate.bind(this),
      previousState,
      invalidateQueries: this.invalidateQueries.bind(this),
      dispatchAsync: this.dispatchAsync.bind(this),
    }

    if (onMutate) {
      onMutate(storeContext)
    }

    let result: TResult
    let error: Error

    return Promise.resolve(mutationFn(payload))
      .then(data => {
        result = data
        if (onSuccess) {
          onSuccess({
            ...storeContext,
            data,
          } as MutationSuccessContext<TArgs, TResult>)
        }
        return data
      })
      .catch(err => {
        error = err
        if (onError) {
          onError({
            ...storeContext,
            error: err,
          } as MutationErrorContext<TArgs>)
        }
        throw err
      })
      .finally(() => {
        if (onSettled) {
          onSettled({
            ...storeContext,
            data: result || error,
          } as MutationSettledContext<TArgs, TResult>)
        }
      })
  }

  /**
   * @method defineMachine
   * @param {string} machineName - The name of the machine
   * @param {StateMachineDefinition} machineDefinition - The state machine definition
   * @description Defines or updates a state machine for the store
   */
  defineMachine(machineName: string, machineDefinition: StateMachineDefinition<TState>): void {
    const validateMachine = (machine: StateMachineDefinition<TState>): void => {
      if (typeof machine !== 'object' || machine === null) {
        throw new Error('Machine definition must be an object')
      }

      Object.entries(machine).forEach(([eventName, event]) => {
        if (typeof event !== 'object' || event === null) {
          throw new Error(`Event '${eventName}' must be an object`)
        }

        if (!event.to || (typeof event.to !== 'function' && typeof event.to !== 'object')) {
          throw new Error(
            `Event '${eventName}' must have a 'to' property that is an object or a function returning an object`
          )
        }

        if (event.guard && typeof event.guard !== 'function') {
          throw new Error(`Guard for event '${eventName}' must be a function`)
        }

        if (event.onTransition && typeof event.onTransition !== 'function') {
          throw new Error(`onTransition for event '${eventName}' must be a function`)
        }

        if (event.onEntry && typeof event.onEntry !== 'function') {
          throw new Error(`onEntry for event '${eventName}' must be a function`)
        }

        if (event.onExit && typeof event.onExit !== 'function') {
          throw new Error(`onExit for event '${eventName}' must be a function`)
        }
      })
    }

    validateMachine(machineDefinition)

    this.machines[machineName] = machineDefinition

    // Create reducers for each state machine action
    Object.entries(machineDefinition).forEach(([eventName, event]) => {
      const fullEventName = `${machineName}:${eventName}`
      this.defineAction(fullEventName, ({ state, payload }) => {
        if (this.isValidTransition(event.from, state as TState)) {
          // Capture the previous state before applying the transition
          const previousState = _deepClone(state)
          const newState =
            typeof event.to === 'function'
              ? event.to({ state: state as TState, payload })
              : event.to

          // Apply the new state
          Object.entries(newState).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              ;(state as any)[key] = {
                ...(state as any)[key],
                ...value,
              }
            } else {
              ;(state as any)[key] = value
            }
          })

          // Execute onEntry
          if (event.onEntry) {
            event.onEntry({
              state: state as TState,
              previousState,
              payload,
            })
          }
        } else {
          console.warn(
            `Ignored transition '${fullEventName}' event. Current state does not match 'from' condition.`
          )
        }
      })
    })
  }

  /**
   * @method trigger
   * @param {string} fullEventName - The full name of the event to trigger (machineName:eventName)
   * @param {*} payload - The payload for the event
   * @returns {Promise} A promise that resolves when the event is processed
   * @description Triggers a state machine event
   */
  trigger(fullEventName: string, payload?: any): Promise<TState> {
    const [machineName, eventName] = fullEventName.split(':')
    if (!this.machines[machineName] || !this.machines[machineName][eventName]) {
      throw new Error(`Event '${fullEventName}' not found in any state machine.`)
    }

    const event = this.machines[machineName][eventName]
    const currentState = { ...this._state }

    // Execute onExit
    if (event.onExit) {
      event.onExit({ state: currentState, payload })
    }

    // Dispatch the action
    this.dispatch(fullEventName, payload)

    // Execute onTransition
    if (event.onTransition) {
      event.onTransition({
        from: currentState,
        to: this._state,
        payload,
        data: event.data,
      })
    }

    return Promise.resolve(this._state)
  }

  /**
   * @method memo
   * @param {string} memoName - The name of the memo to compute
   * @param {*} [payload] - Optional payload for the memo
   * @returns {*} The computed value of the memo
   * @description Computes and returns the value of a memoized property with efficient caching
   */
  memo<TResult = any>(memoName: string, payload?: any): TResult {
    // Validation - handle efficiently with early return instead of throwing
    if (typeof memoName !== 'string') {
      throw new Error(`[Cami.js] Memo name must be a string, got: ${typeof memoName}`)
    }

    // Register reactive dependency (match `state` / `getState()` behavior)
    // This ensures components re-render when store state changes
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this)
    }

    // Fast lookup with direct property access - much faster than function calls in V8
    const memoFn = this.memos[memoName]
    if (!memoFn) {
      throw new Error(`[Cami.js] Memo '${memoName}' not found.`)
    }

    // Fast path for cache lookup - avoid unnecessary Map creation
    let cache = this.memoCache.get(memoName)
    if (!cache) {
      cache = new Map()
      this.memoCache.set(memoName, cache)
    }

    // Generate a more efficient cache key
    let cacheKey: any
    if (payload === undefined || payload === null) {
      cacheKey = '__undefined__'
    } else if (typeof payload !== 'object') {
      // Primitive values can be used directly as Map keys
      cacheKey = payload
    } else {
      // For objects, we still need to stringify but we can optimize this further
      cacheKey = JSON.stringify(payload)
    }

    // Fast path: return cached result if available and valid
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!

      // State version check is much faster than deep dependency check
      if (cached.stateVersion === this._stateVersion) {
        return cached.result
      }

      // Fall back to dependency check only when needed
      if (this._areDependenciesUnchanged(cached.dependencies)) {
        return cached.result
      }
    }

    // No valid cache hit, need to calculate
    const dependencies = new Set<string>()

    // Optimized tracking proxy that only tracks top-level dependencies
    const trackingProxy = new Proxy(this._state as any, {
      get: (target, prop) => {
        // Only track string properties that aren't internal
        if (typeof prop === 'string' && !prop.startsWith('_')) {
          dependencies.add(prop)
        }
        return (target as any)[prop]
      },
    })

    // Create context for memo function
    const storeContext: MemoContext<TState> = {
      state: trackingProxy as TState,
      payload,
      dispatch: this.dispatch,
      trigger: this.trigger,
      memo: this.memo,
      query: this.query,
      mutate: this.mutate,
      dispatchAsync: this.dispatchAsync,
    }

    // Calculate the result
    let result: TResult
    try {
      result = memoFn(storeContext)
    } catch (error) {
      console.error(`[Cami.js] Error in memo '${memoName}':`, error)
      throw error
    }

    // Cache the result with its dependencies
    cache.set(cacheKey, {
      result,
      dependencies,
      stateVersion: this._stateVersion,
    })
    return result
  }

  /**
   * Check if all dependencies remain unchanged since last state update
   * @private
   */
  private _areDependenciesUnchanged(dependencies: Set<string>): boolean {
    // Fast path 1: No dependencies means always unchanged
    if (!dependencies || dependencies.size === 0) {
      return true
    }

    // Fast path 2: No previous state means always changed
    if (!this.previousState) {
      return false
    }

    // Fast path 3: For small dependency sets, direct iteration is fastest
    if (dependencies.size <= 8) {
      for (const dep of dependencies) {
        // Reference check first (fast)
        if ((this._state as any)[dep] !== (this.previousState as any)[dep]) {
          // If objects, do a deep equality check (slower but more accurate)
          if (
            typeof (this._state as any)[dep] === 'object' &&
            (this._state as any)[dep] !== null &&
            typeof (this.previousState as any)[dep] === 'object' &&
            (this.previousState as any)[dep] !== null
          ) {
            if (!_deepEqual((this._state as any)[dep], (this.previousState as any)[dep])) {
              return false
            }
          } else {
            return false
          }
        }
      }
      return true
    }

    // For larger dependency sets, use a different approach
    const deps = Array.from(dependencies)
    const len = deps.length
    for (let i = 0; i < len; i++) {
      const dep = deps[i]
      // Reference check first (fast)
      if ((this._state as any)[dep] !== (this.previousState as any)[dep]) {
        // If objects, do a deep equality check (slower but more accurate)
        if (
          typeof (this._state as any)[dep] === 'object' &&
          (this._state as any)[dep] !== null &&
          typeof (this.previousState as any)[dep] === 'object' &&
          (this.previousState as any)[dep] !== null
        ) {
          if (!_deepEqual((this._state as any)[dep], (this.previousState as any)[dep])) {
            return false
          }
        } else {
          return false
        }
      }
    }

    return true
  }

  // Helper methods for the state machine
  isValidTransition(from: any, currentState: TState): boolean {
    if (from === undefined) {
      return true
    }

    const checkState = (fromState: any, currentStateSlice: any): boolean => {
      if (typeof fromState !== 'object' || fromState === null) {
        return fromState === currentStateSlice
      }
      return Object.entries(fromState).every(([key, value]) => {
        if (!(key in currentStateSlice)) {
          return false
        }
        if (Array.isArray(value)) {
          return (value as any[]).includes(currentStateSlice[key])
        }
        if (typeof value === 'object' && value !== null) {
          return checkState(value, currentStateSlice[key])
        }
        return currentStateSlice[key] === value
      })
    }

    if (Array.isArray(from)) {
      return from.some(state => checkState(state, currentState))
    }
    return checkState(from, currentState)
  }

  validateToShape(from: any, to: any): void {
    if (from === undefined) {
      return
    }

    const getShapeDescription = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return typeof obj
      }

      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (typeof value === 'object' && value !== null) {
          acc[key] = getShapeDescription(value)
        } else if (Array.isArray(value)) {
          acc[key] = `Array<${typeof value[0]}>`
        } else {
          acc[key] = typeof value
        }
        return acc
      }, {} as any)
    }

    const findMismatchedKeys = (expected: any, actual: any, prefix = ''): string[] => {
      const mismatched: string[] = []
      Object.keys(expected).forEach(key => {
        const fullKey = prefix ? `${prefix}.${key}` : key
        if (!(key in actual)) {
          mismatched.push(`${fullKey} (missing)`)
        } else if (typeof expected[key] !== typeof actual[key]) {
          mismatched.push(
            `${fullKey} (expected ${typeof expected[key]}, got ${typeof actual[key]})`
          )
        } else if (
          typeof expected[key] === 'object' &&
          expected[key] !== null &&
          typeof actual[key] === 'object' &&
          actual[key] !== null
        ) {
          mismatched.push(...findMismatchedKeys(expected[key], actual[key], fullKey))
        }
      })
      return mismatched
    }

    const fromShape = Array.isArray(from) ? from[0] : from
    if (typeof to !== 'object' || to === null) {
      const expectedShape = getShapeDescription(fromShape)
      throw new Error(
        `Invalid 'to' state: must be an object.\n\nExpected key-value pairs:\n${JSON.stringify(
          expectedShape,
          null,
          2
        )}`
      )
    }
    const mismatchedKeys = findMismatchedKeys(to, fromShape)
    if (mismatchedKeys.length > 0) {
      const expectedShape = getShapeDescription(fromShape)
      throw new Error(
        `Invalid 'to' state shape.\n\nExpected key-value pairs:\n${JSON.stringify(
          expectedShape,
          null,
          2
        )}\n\nMismatched keys: ${mismatchedKeys.join(', ')}`
      )
    }
  }

  executeHandler(handler: Function, context: any): void {
    if (typeof handler === 'function') {
      handler(context)
    }
  }

  hasAction(actionName: string): boolean {
    return actionName in this.reducers
  }

  hasAsyncAction(actionName: string): boolean {
    return actionName in this.thunks
  }

  private _validateState(state: any): void {
    Object.entries(this.schema).forEach(([key, type]) => {
      try {
        if (type.type === 'optional' && (state[key] === undefined || state[key] === null)) {
          // Skip validation for undefined or null optional fields
          return
        }
        validateType(state[key], type, [key], state)
      } catch (error) {
        throw new Error(`Validation error in ${this.name}: ${(error as Error).message}`)
      }
    })
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

const deepFreeze = <T>(value: T): T => {
  if (typeof value !== 'object' || value === null) {
    return value // Return primitives as-is
  }
  return new Proxy(freeze(value, true), {
    set(_target, prop, _val) {
      throw new Error(
        `Attempted to modify frozen state. Cannot set property '${String(prop)}' on immutable object.`
      )
    },
    deleteProperty(_target, prop) {
      throw new Error(
        `Attempted to modify frozen state. Cannot delete property '${String(prop)}' from immutable object.`
      )
    },
  }) as T
}

/**
 * Registry for store singletons by name
 * @private
 */
const storeInstances = new Map<string, ObservableStore>()

// =============================================================================
// Store Factory Function
// =============================================================================

export interface StoreFactoryConfig<TState = any> extends StoreConfig<TState> {
  state?: TState
}

/**
 * Creates a new ObservableStore instance or returns an existing one with the same name
 *
 * @param config - Configuration options
 * @returns Store instance
 */
export const store = <TState = any>(
  config: StoreFactoryConfig<TState> = {}
): ObservableStore<TState> => {
  // Default configuration
  const defaultConfig: StoreFactoryConfig<TState> = {
    state: {} as TState,
    name: 'cami-store',
    schema: {},
    enableLogging: false,
    enableDevtools: false,
  }

  // Merge provided config with defaults
  const finalConfig = { ...defaultConfig, ...config }

  // Return existing instance if available (singleton pattern)
  if (storeInstances.has(finalConfig.name!)) {
    return storeInstances.get(finalConfig.name!) as ObservableStore<TState>
  }

  // Create new store instance
  const storeInstance = new ObservableStore<TState>(finalConfig.state!, finalConfig)

  // Verify required methods are available
  const requiredMethods = ['memo', 'query', 'trigger', 'dispatch', 'mutate', 'subscribe']
  const missingMethods = requiredMethods.filter(
    method => typeof (storeInstance as any)[method] !== 'function'
  )

  if (missingMethods.length > 0) {
    console.warn(`[Cami.js] Store missing required methods: ${missingMethods.join(', ')}`)
  }

  // Register the store instance
  storeInstances.set(finalConfig.name!, storeInstance)

  // Log creation if logging enabled
  if (finalConfig.enableLogging) {
    __trace('cami:store:create', `Created store: ${finalConfig.name}`)
  }

  return storeInstance
}

/**
 * Clear all cached store instances (useful for testing)
 * @internal
 */
export const clearStoreCache = (): void => {
  storeInstances.clear()
}

// =============================================================================
// Type Exports
// =============================================================================
// Types are already exported as interfaces above
