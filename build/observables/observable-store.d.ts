import { Observable } from "./observable.js";
import { Draft, Patch } from "immer";
export interface StoreConfig<_TState = any> {
    name?: string;
    schema?: Record<string, any>;
    enableLogging?: boolean;
    enableDevtools?: boolean;
}
export interface ReducerContext<TState = any> {
    state: Draft<TState>;
    payload: any;
    dispatch: (action: string, payload?: any) => any;
    query: (queryName: string, payload?: any) => Promise<any>;
    mutate: (mutationName: string, payload?: any) => Promise<any>;
    invalidateQueries: (options: InvalidateQueriesOptions) => void;
    memo: (memoName: string, payload?: any) => any;
    trigger: (eventName: string, payload?: any) => Promise<TState>;
    dispatchAsync?: (thunkName: string, payload?: any) => Promise<any>;
}
export interface ActionHandler<TState = any> {
    (context: ReducerContext<TState>): void;
}
export interface QueryConfig<TArgs = any, TResult = any> {
    queryKey: string | string[] | ((args: TArgs) => string[]);
    queryFn: (args: TArgs) => Promise<TResult>;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchInterval?: number | null;
    refetchOnReconnect?: boolean;
    gcTime?: number;
    retry?: number;
    retryDelay?: number | ((attempt: number) => number);
    onFetch?: (context: QueryContext<TArgs>) => void;
    onSuccess?: (context: QuerySuccessContext<TArgs, TResult>) => void;
    onError?: (context: QueryErrorContext<TArgs>) => void;
    onSettled?: (context: QuerySettledContext<TArgs, TResult>) => void;
}
export interface QueryContext<TArgs = any> {
    state: any;
    payload: TArgs;
    dispatch: (action: string, payload?: any) => any;
    trigger: (eventName: string, payload?: any) => Promise<any>;
    memo: (memoName: string, payload?: any) => any;
    query: (queryName: string, payload?: any) => Promise<any>;
    mutate: (mutationName: string, payload?: any) => Promise<any>;
    invalidateQueries: (options: InvalidateQueriesOptions) => void;
    dispatchAsync: (thunkName: string, payload?: any) => Promise<any>;
}
export interface QuerySuccessContext<TArgs = any, TResult = any> extends QueryContext<TArgs> {
    data: TResult;
    result?: TResult;
}
export interface QueryErrorContext<TArgs = any> extends QueryContext<TArgs> {
    error: Error;
}
export interface QuerySettledContext<TArgs = any, TResult = any> extends QueryContext<TArgs> {
    data?: TResult;
    error?: Error;
}
export interface CachedQueryData<TResult = any> {
    data: TResult;
    timestamp: number;
    isStale: boolean;
}
export interface MutationConfig<TArgs = any, TResult = any> {
    mutationFn: (args: TArgs) => Promise<TResult>;
    onMutate?: (context: MutationContext<TArgs>) => any;
    onError?: (context: MutationErrorContext<TArgs>) => void;
    onSuccess?: (context: MutationSuccessContext<TArgs, TResult>) => void;
    onSettled?: (context: MutationSettledContext<TArgs, TResult>) => void;
}
export interface MutationContext<TArgs = any> {
    state: any;
    payload: TArgs;
    dispatch: (action: string, payload?: any) => any;
    trigger: (eventName: string, payload?: any) => Promise<any>;
    memo: (memoName: string, payload?: any) => any;
    query: (queryName: string, payload?: any) => Promise<any>;
    mutate: (mutationName: string, payload?: any) => Promise<any>;
    previousState: any;
    invalidateQueries: (options: InvalidateQueriesOptions) => void;
    dispatchAsync: (thunkName: string, payload?: any) => Promise<any>;
}
export interface MutationSuccessContext<TArgs = any, TResult = any> extends MutationContext<TArgs> {
    data: TResult;
}
export interface MutationErrorContext<TArgs = any> extends MutationContext<TArgs> {
    error: Error;
}
export interface MutationSettledContext<TArgs = any, TResult = any> extends MutationContext<TArgs> {
    data?: TResult;
    error?: Error;
}
export interface InvalidateQueriesOptions {
    queryKey?: string[];
    predicate?: (query: QueryConfig) => boolean;
}
export interface AsyncActionContext<TState = any> {
    state: Readonly<TState>;
    dispatch: (action: string, payload?: any) => any;
    dispatchAsync: (thunkName: string, payload?: any) => Promise<any>;
    trigger: (eventName: string, payload?: any) => Promise<TState>;
    query: (queryName: string, payload?: any) => Promise<any>;
    mutate: (mutationName: string, payload?: any) => Promise<any>;
    invalidateQueries: (options: InvalidateQueriesOptions) => void;
    payload: any;
}
export interface AsyncActionHandler<TState = any, TResult = any> {
    (context: AsyncActionContext<TState>, payload?: any): Promise<TResult>;
}
export interface MemoContext<TState = any> {
    state: TState;
    payload: any;
    dispatch: (action: string, payload?: any) => any;
    trigger: (eventName: string, payload?: any) => Promise<TState>;
    memo: (memoName: string, payload?: any) => any;
    query: (queryName: string, payload?: any) => Promise<any>;
    mutate: (mutationName: string, payload?: any) => Promise<any>;
    dispatchAsync: (thunkName: string, payload?: any) => Promise<any>;
}
export interface MemoHandler<TState = any, TResult = any> {
    (context: MemoContext<TState>): TResult;
}
export interface CachedMemoData<TResult = any> {
    result: TResult;
    dependencies: Set<string>;
    stateVersion: number;
}
export interface HookContext<TState = any> {
    action: string;
    payload: any;
    state: TState;
    previousState?: TState;
    patches?: Patch[];
    inversePatches?: Patch[];
    dispatch?: (action: string, payload?: any) => any;
}
export interface Hook<TState = any> {
    (context: HookContext<TState>): void;
}
export interface StateMachineEvent<TState = any> {
    from?: TState | TState[] | ((state: TState) => boolean);
    to: Partial<TState> | ((context: {
        state: TState;
        payload: any;
    }) => Partial<TState>);
    guard?: (context: {
        state: TState;
        payload: any;
        action: string;
    }) => boolean;
    onTransition?: (context: {
        from: TState;
        to: TState;
        payload: any;
        data?: any;
    }) => void;
    onEntry?: (context: {
        state: TState;
        previousState: TState;
        payload: any;
    }) => void;
    onExit?: (context: {
        state: TState;
        payload: any;
    }) => void;
    data?: any;
}
export interface StateMachineDefinition<TState = any> {
    [eventName: string]: StateMachineEvent<TState>;
}
export interface ActionSpec<TState = any> {
    precondition?: (context: {
        state: TState;
        payload: any;
        action: string;
    }) => boolean;
    postcondition?: (context: {
        state: TState;
        payload: any;
        action: string;
        previousState: TState;
    }) => boolean;
}
export interface PatchListener {
    (patches: Patch[]): void;
}
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
export declare class ObservableStore<TState = any> extends Observable<TState> {
    readonly name: string;
    readonly schema: Record<string, any>;
    _uid?: string;
    private _state;
    private _frozenState;
    private _isDirty;
    private _stateVersion;
    private _proxy;
    previousState: TState;
    readonly reducers: Record<string, ActionHandler<TState>>;
    readonly actions: Record<string, (payload?: any) => any>;
    readonly dispatchQueue: Array<{
        action: string;
        payload: any;
    }>;
    isDispatching: boolean;
    currentDispatchPromise: Promise<any> | null;
    readonly queryCache: Map<string, CachedQueryData<any>>;
    readonly queryFunctions: Map<string, QueryConfig<any, any>>;
    readonly queries: Record<string, (...args: any[]) => Promise<any>>;
    readonly memoCache: Map<string, Map<any, CachedMemoData<any>>>;
    readonly intervals: Map<string, number>;
    readonly focusHandlers: Map<string, () => void>;
    readonly reconnectHandlers: Map<string, () => void>;
    readonly gcTimeouts: Map<string, number>;
    readonly mutationFunctions: Map<string, MutationConfig<any, any>>;
    readonly mutations: Record<string, (...args: any[]) => Promise<any>>;
    readonly patchListeners: Map<string, PatchListener[]>;
    readonly machines: Record<string, StateMachineDefinition<TState>>;
    readonly memos: Record<string, MemoHandler<TState>>;
    readonly thunks: Record<string, AsyncActionHandler<TState>>;
    readonly specs: Map<string, ActionSpec<TState>>;
    readonly beforeHooks: Hook<TState>[];
    readonly afterHooks: Hook<TState>[];
    private readonly throttledAfterHooks;
    private __isDispatching;
    private __dispatchStack;
    private _stateTrapStore?;
    private __subscriber;
    constructor(initialState: TState, options?: StoreConfig<TState>);
    /**
     * Returns a snapshot of the current state
     * Automatically tracks dependencies for reactive computations
     */
    get state(): TState;
    /**
     * Alternative to 'state' getter that follows standard getState pattern
     * Used by many libraries and compatible with redux-like interfaces
     */
    getState(): TState;
    /**
     * Creates a proxy that tracks property access for dependency tracking
     * and automatically schedules updates when properties change
     *
     * This is a critical path for performance optimization
     */
    private _createProxy;
    /**
     * Adds a property from the state to the store instance for direct access
     * Only used for properties not already defined on the store
     */
    private _addProxyProperty;
    /**
     * Efficiently notifies observers of state changes
     * Only triggers if state has changed and batches notifications
     */
    private _notifyObservers;
    /**
     * Creates a schema definition for type validation
     */
    private _createDeepSchema;
    /**
     * Validates a state object against a schema
     */
    private _validateDeepState;
    /**
     * Determine the type of a value
     */
    private _inferType;
    /**
     * Public API for dispatching actions
     */
    dispatch(action: string, payload?: any): TState;
    /**
     * Main implementation of action dispatch
     * Critical performance path - heavily optimized
     */
    private _dispatch;
    /**
     * Add a hook to run before actions
     */
    beforeHook(hook: Hook<TState>): () => void;
    /**
     * Add a hook to run after actions
     */
    afterHook(hook: Hook<TState>): () => void;
    /**
     * Run hooks of a specific type
     * Optimized to skip empty hook arrays
     */
    private __applyHooks;
    /**
     * Execute after hooks with current context
     */
    private __executeAfterHooks;
    /**
     * Notify patch listeners of changes
     * Optimized for performance with key-based targeting
     */
    private _notifyPatchListeners;
    /**
     * @method defineAction
     * @param {string} action - The action type
     * @param {ActionHandler} reducer - The reducer function for the action
     * @throws {Error} - Throws an error if the action type is already registered
     * @description This method registers a reducer function for a given action type. Useful if you like redux-style reducers.
     */
    defineAction(action: string, reducer: ActionHandler<TState>): this;
    /**
     * Define a spec for an action
     * Specs can include preconditions and postconditions
     */
    defineSpec(actionName: string, spec: ActionSpec<TState>): this;
    /**
     * @method defineAsyncAction
     * @param {string} thunkName - The name of the thunk
     * @param {AsyncActionHandler} asyncCallback - The async function to be executed
     * @description Defines a new thunk for the store
     */
    defineAsyncAction(thunkName: string, asyncCallback: AsyncActionHandler<TState>): void;
    /**
     * @method dispatchAsync
     * @param {string} thunkName - The name of the thunk to dispatch
     * @param {*} payload - The payload for the thunk
     * @returns {Promise} A promise that resolves with the result of the thunk
     * @description Dispatches an async thunk
     */
    dispatchAsync(thunkName: string, payload?: any): Promise<any>;
    query<TResult = any>(queryName: string, payload?: any): Promise<TResult>;
    mutate<TResult = any>(mutationName: string, payload?: any): Promise<TResult>;
    defineMemo<TResult = any>(memoName: string, memoFn: MemoHandler<TState, TResult>): void;
    /**
     * @method onPatch
     * @param {string} key - The state key to listen for patches.
     * @param {PatchListener} callback - The callback to invoke when patches are applied.
     * @description Registers a callback to be invoked whenever patches are applied to the specified state key.
     */
    onPatch(key: string, callback: PatchListener): () => void;
    /**
     * @method applyPatch
     * @param {Patch[]} patches - The patches to apply to the state.
     * @description Applies the given patches to the store's state.
     */
    applyPatch(patches: Patch[]): void;
    /**
     * @method defineQuery
     * @param {string} queryName - The name of the query to register.
     * @param {QueryConfig} config - The configuration object for the query.
     * @description Registers a query with the given configuration.
     */
    defineQuery<TArgs = any, TResult = any>(queryName: string, config: QueryConfig<TArgs, TResult>): void;
    private _executeQuery;
    private _handleQueryResult;
    /**
     * @method invalidateQueries
     * @param {InvalidateQueriesOptions} options - The options for invalidating queries.
     * @description Invalidates the cache and any associated intervals or event listeners for the given queries.
     */
    invalidateQueries({ queryKey, predicate }: InvalidateQueriesOptions): void;
    /**
     * @private
     * @method fetchWithRetry
     * @param {Function} queryFn - The query function to execute.
     * @param {number} retry - The number of retries remaining.
     * @param {number | Function} retryDelay - The delay or function that returns the delay in milliseconds for each retry attempt.
     * @returns {Promise} A promise that resolves to the query result.
     * @description Executes the query function with retries and exponential backoff.
     */
    private _fetchWithRetry;
    /**
     * @private
     * @method _isStale
     * @param {CachedQueryData} cachedData - The cached data object.
     * @param {number} staleTime - The stale time in milliseconds.
     * @returns {boolean} True if the cached data is stale, false otherwise.
     * @description Checks if the cached data is stale based on the stale time.
     */
    private _isStale;
    /**
     * @method defineMutation
     * @param {string} mutationName - The name of the mutation to register.
     * @param {MutationConfig} config - The configuration object for the mutation.
     * @description Registers a mutation with the given configuration.
     */
    defineMutation<TArgs = any, TResult = any>(mutationName: string, config: MutationConfig<TArgs, TResult>): void;
    private _executeMutation;
    /**
     * @method defineMachine
     * @param {string} machineName - The name of the machine
     * @param {StateMachineDefinition} machineDefinition - The state machine definition
     * @description Defines or updates a state machine for the store
     */
    defineMachine(machineName: string, machineDefinition: StateMachineDefinition<TState>): void;
    /**
     * @method trigger
     * @param {string} fullEventName - The full name of the event to trigger (machineName:eventName)
     * @param {*} payload - The payload for the event
     * @returns {Promise} A promise that resolves when the event is processed
     * @description Triggers a state machine event
     */
    trigger(fullEventName: string, payload?: any): Promise<TState>;
    /**
     * @method memo
     * @param {string} memoName - The name of the memo to compute
     * @param {*} [payload] - Optional payload for the memo
     * @returns {*} The computed value of the memo
     * @description Computes and returns the value of a memoized property with efficient caching
     */
    memo<TResult = any>(memoName: string, payload?: any): TResult;
    /**
     * Check if all dependencies remain unchanged since last state update
     * @private
     */
    private _areDependenciesUnchanged;
    isValidTransition(from: any, currentState: TState): boolean;
    validateToShape(from: any, to: any): void;
    executeHandler(handler: Function, context: any): void;
    hasAction(actionName: string): boolean;
    hasAsyncAction(actionName: string): boolean;
    private _validateState;
}
export interface StoreFactoryConfig<TState = any> extends StoreConfig<TState> {
    state?: TState;
}
/**
 * Creates a new ObservableStore instance or returns an existing one with the same name
 *
 * @param config - Configuration options
 * @returns Store instance
 */
export declare const store: <TState = any>(config?: StoreFactoryConfig<TState>) => ObservableStore<TState>;
/**
 * Clear all cached store instances (useful for testing)
 * @internal
 */
export declare const clearStoreCache: () => void;
//# sourceMappingURL=observable-store.d.ts.map