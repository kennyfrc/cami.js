import { produce } from 'immer'

import { TemplateResult, render as __litRender } from './html'
import { Observable } from './observables/observable'
import { ObservableProxy } from './observables/observable-proxy'
import { ObservableState, derive, effect, DependencyTracker } from './observables/observable-state'
import { enterRenderPhase, exitRenderPhase } from './render-phase'
import type { Resource, ResourceOptions } from './resources/resource'
import { __trace } from './trace'
import { _deepEqual } from './utils'
import { enqueueSettle, dequeueSettle, type SettleReaction } from './scheduler'

// Cache for merged nonReactiveProperties sets (per class constructor)
const nonReactiveCache = new WeakMap<Function, Set<string>>()

// Type definitions for ReactiveElement
type AttributeParser = (value: string) => any

interface ObservableAttributes {
  [attrName: string]: AttributeParser
}

interface SetupConfig {
  infer?: boolean
}

type EffectFunction = () => void
type DeriveFunction<T = any> = () => T
type UnsubscribeFunction = () => void
type AfterRenderFunction = () => void | (() => void)

interface AfterRenderEntry {
  fn: AfterRenderFunction
  deps: unknown[] | undefined
}

/**
 * Module-level toggle for the afterRender test seam.
 * When set to false, __scheduleAfterRender() is a no-op.
 * Restore with setAfterRenderEnabled(true) in afterEach.
 */
let __afterRenderEnabled = true

/**
 * Test seam: globally enable/disable afterRender effects.
 * Usage in tests:
 *   import { setAfterRenderEnabled } from '../../lib/cami/src/reactive-element'
 *   beforeEach(() => setAfterRenderEnabled(false))
 *   afterEach(() => setAfterRenderEnabled(true))
 *
 * Note: the flag is checked in __scheduleAfterRender() at schedule time.
 * Tests should typically remove elements in afterEach to ensure pending
 * microtasks are invalidated via generation bump in disconnectedCallback.
 */
export function setAfterRenderEnabled(enabled: boolean): void {
  __afterRenderEnabled = enabled
}

/**
 * Test seam: manually flush pending afterRender effects for an element.
 * Invalidates any pending microtask to prevent double-execution. (P2 fix)
 */
export function flushAfterRender(el: ReactiveElement): void {
  // Record the generation that was manually flushed. The stale microtask
  // will only skip if its generation matches — a newer render (different
  // generation) will correctly reschedule. (P2 fix from review)
  el.__afterRenderManualFlushGen = el.__afterRenderGeneration
  el.__flushAfterRender()
}

interface DeriveResult<T> {
  value: T
  dispose: UnsubscribeFunction
}

interface ResourceEntry<T> {
  state: ObservableState<Resource<T>>
  requestId: number
  abortController?: AbortController
  lastStartMs?: number
}

interface EphemeralEntry<T> {
  state: ObservableState<T>
  expiresAt?: number
  resetOnDisconnect: boolean
}

/**
 * ObservableProperty interface
 * A property that provides reactive getter/setter behavior
 */
interface ObservableProperty<T = any> {
  /** A getter function that returns the current value of the property */
  get(): T
  /** A setter function that updates the value of the property */
  set(value: T): void
}

/**
 * This class is needed to create reactive web components that can automatically update their view when their state changes.
 * All properties are automatically converted to observables. This is achieved by using creating an ObservableProperty,
 * which provides a getter and setter for the property. The getter returns the current value of the property,
 * and the setter updates the value of the property and triggers a re-render of the component.
 *
 * @example
 * ```typescript
 * const { html, ReactiveElement } = cami;
 *
 * class CounterElement extends ReactiveElement {
 *   // Here, 'count' is automatically initialized as an ObservableProperty.
 *   // This means that any changes to 'count' will automatically trigger a re-render of the component.
 *   count = 0
 *
 *   template() {
 *     return html`
 *       <button @click=${() => this.count--}>-</button>
 *       <button @click=${() => this.count++}>+</button>
 *       <div>Count: ${this.count}</div>
 *     `;
 *   }
 * }
 *
 * customElements.define('counter-component', CounterElement);
 * ```
 */
class ReactiveElement extends HTMLElement {
  [key: string]: unknown
  private __unsubscribers: Map<any, UnsubscribeFunction>
  private __prevTemplate?: TemplateResult
  private __afterRenderRegistry: Map<string, AfterRenderEntry>
  private __afterRenderDraft: Map<string, AfterRenderEntry>
  private __afterRenderCleanups: Map<string, () => void>
  private __afterRenderPrevDeps: Map<string, unknown[] | undefined>
  __afterRenderScheduled: boolean
  __afterRenderGeneration: number
  __afterRenderManualFlushGen: number
  private __camiResourceEntries: Map<string, ResourceEntry<any>>
  private __camiEphemeralEntries: Map<string, EphemeralEntry<any>>
  private __settleReactions: SettleReaction<any>[]
  private __renderInProgress: boolean

  // Public effect and derive methods (bound in constructor)
  public effect: (effectFn: EffectFunction) => void
  public derive: <T>(deriveFn: DeriveFunction<T>) => T

  /**
   * Properties listed here will NOT be converted to observables.
   * Subclasses inherit parent non-reactive properties automatically.
   * Treat as immutable after class definition.
   * @example
   * ```typescript
   * class MyElement extends ReactiveElement {
   *   static nonReactiveProperties = ['_handler', '_cache'];
   *   private _handler: Function | null = null;
   * }
   * ```
   */
  static nonReactiveProperties: readonly string[] = []

  /**
   * Gets the merged set of non-reactive property names for a class,
   * walking the prototype chain to inherit parent declarations.
   * Results are cached per class constructor.
   */
  private static __getNonReactiveSet(ctor: Function): Set<string> {
    // Check cache first
    const cached = nonReactiveCache.get(ctor)
    if (cached) return cached

    // Walk prototype chain, collect all nonReactiveProperties arrays
    const merged = new Set<string>()
    let current: Function | null = ctor

    while (current) {
      const props = (current as typeof ReactiveElement).nonReactiveProperties
      if (Array.isArray(props)) {
        for (const key of props) merged.add(key)
      }
      current = Object.getPrototypeOf(current)
    }

    // Cache and return
    nonReactiveCache.set(ctor, merged)
    return merged
  }

  /**
   * Constructs a new instance of ReactiveElement.
   */
  constructor() {
    super()
    this.onCreate()
    this.__unsubscribers = new Map<any, UnsubscribeFunction>()
    this.__afterRenderRegistry = new Map()
    this.__afterRenderDraft = new Map()
    this.__afterRenderCleanups = new Map()
    this.__afterRenderPrevDeps = new Map()
    this.__afterRenderScheduled = false
    this.__afterRenderGeneration = 0
    this.__afterRenderManualFlushGen = -1
    this.__camiResourceEntries = new Map()
    this.__camiEphemeralEntries = new Map()
    this.__settleReactions = []
    this.__renderInProgress = false
    this.effect = this.__effect.bind(this)
    this.derive = this.__derive.bind(this)
  }

  /**
   * Creates ObservableProperty or ObservableProxy instances for all properties in the provided object.
   * @param attributes - An object with attribute names as keys and optional parsing functions as values.
   * @example
   * // In _009_dataFromProps.html, the todos attribute is parsed as JSON and the data property is extracted:
   * this.observableAttributes({
   *   todos: (v) => JSON.parse(v).data
   * });
   */
  observableAttributes(attributes: ObservableAttributes): void {
    Object.entries(attributes).forEach(([attrName, parseFn]) => {
      // Retrieve the attribute value and apply the transformation function if provided
      let attrValue: string | null = this.getAttribute(attrName)
      const transformFn: AttributeParser =
        typeof parseFn === 'function' ? parseFn : (v: string) => v
      const transformedValue = produce(attrValue, transformFn)

      // Create an ObservableProperty or ObservableProxy for the attribute
      const observable = this.__observable(transformedValue, attrName)
      if (this.__isObjectOrArray(observable.value)) {
        this.__createObservablePropertyForObjOrArr(this, attrName, observable, true)
      } else {
        this.__createObservablePropertyForPrimitive(this, attrName, observable, true)
      }
    })
  }

  /**
   * Creates an effect and registers its dispose function. The effect is used to perform side effects in response to state changes.
   * This method is useful when working with ObservableProperties or ObservableProxies because it triggers the effect whenever the value of the underlying ObservableState changes.
   * @param effectFn - The function to create the effect
   * @example
   * // Assuming `this.count` is an ObservableProperty
   * this.effect(() => {
   *   console.log(`The count is now: ${this.count}`);
   * });
   * // The console will log the current count whenever `this.count` changes
   */
  private __effect(effectFn: EffectFunction): void {
    const dispose = effect(effectFn)
    this.__unsubscribers.set(effectFn, dispose)
  }

  /**
   * Creates a derived value that updates when its dependencies change.
   * @param deriveFn - The function to compute the derived value
   * @returns The derived value
   * @example
   * // Assuming `this.count` is an ObservableProperty
   * this.doubleCount = this.derive(() => this.count * 2);
   * console.log(this.doubleCount); // If this.count is 5, this will log 10
   */
  private __derive<T>(deriveFn: DeriveFunction<T>): T {
    const { value, dispose }: DeriveResult<T> = derive(deriveFn)
    this.__unsubscribers.set(deriveFn, dispose)
    return value
  }

  /**
   * Registers a commit-phase effect keyed by a stable string.
   * Effects run after DOM commit and are cleaned up on disconnect or when the key is removed.
   */
  afterRender(key: string, effectFn: AfterRenderFunction, deps?: unknown[]): void {
    this.__afterRenderDraft.set(key, { fn: effectFn, deps })
  }

  /**
   * Registers a post-settle reaction that watches a reactive source.
   *
   * Unlike `afterRender` (which runs on every re-render of the owning
   * element), `afterSettle` runs whenever its reactive source changes,
   * regardless of whether the owning element re-renders.
   *
   * The callback runs after all renders settle — after afterRender effects
   * have flushed — ensuring it sees a DOM consistent with the latest state.
   *
   * @param source - A reactive getter (e.g., `() => store.getState().value`)
   * @param callback - Called with (newValue, oldValue) after renders settle
   *
   * @example
   * // Watch a store value and react after DOM settles
   * this.afterSettle(
   *   () => myStore.getState().isOpen,
   *   (isOpen) => {
   *     if (isOpen) this.scrollIntoView()
   *   }
   * )
   */
  afterSettle<T>(source: () => T, callback: (value: T, oldValue: T | undefined) => void): void {
    const reaction: SettleReaction<T> = {
      source,
      callback,
      _value: undefined as T | undefined,
      _oldValue: undefined as T | undefined,
      _isDirty: false,
      _dispose: () => {},
    }

    // Use effect() for dependency tracking. When source changes:
    // 1. effect callback runs synchronously
    // 2. Marks reaction dirty
    // 3. Enqueues for settle drain (microtask, after afterRender)
    reaction._dispose = effect(() => {
      const newValue = source()
      if (!Object.is(newValue, reaction._value)) {
        reaction._oldValue = reaction._value
        reaction._value = newValue
        reaction._isDirty = true
        enqueueSettle(reaction as SettleReaction)
      }
    })

    this.__settleReactions.push(reaction as SettleReaction)
  }

  /**
   * Creates or retrieves a resource state machine for async data.
   */
  resource<T>(
    key: string,
    loader: (signal: AbortSignal) => Promise<T>,
    opts: ResourceOptions = {}
  ): Resource<T> {
    let entry = this.__camiResourceEntries.get(key) as ResourceEntry<T> | undefined

    if (!entry) {
      entry = {
        state: new ObservableState<Resource<T>>({
          status: 'idle',
          requestId: 0,
        } as Resource<T>),
        requestId: 0,
      }
      this.__registerObservables(entry.state)
      this.__camiResourceEntries.set(key, entry)
    }

    this.afterRender(`resource:${key}`, () => {
      const now = Date.now()
      const current = entry!.state.value
      const dedupeMs = opts.dedupeMs
      const race = opts.race ?? 'latest'
      const inFlight = current.status === 'loading' || current.status === 'refreshing'
      const needsDedupeWait =
        dedupeMs != null && entry!.lastStartMs != null && now - entry!.lastStartMs < dedupeMs

      if (needsDedupeWait) {
        return
      }

      if (inFlight && (race === 'first' || dedupeMs == null)) {
        return
      }

      if ((current.status === 'success' || current.status === 'error') && dedupeMs == null) {
        return
      }

      if (entry!.abortController && race === 'latest') {
        entry!.abortController.abort()
      }

      entry!.abortController = new AbortController()
      entry!.requestId += 1
      const requestId = entry!.requestId
      entry!.lastStartMs = now
      const previousData = current.data
      const nextStatus = opts.keepPrevious && previousData !== undefined ? 'refreshing' : 'loading'

      entry!.state.value = {
        status: nextStatus,
        data: opts.keepPrevious ? previousData : undefined,
        error: undefined,
        requestId,
      } as Resource<T>

      loader(entry!.abortController.signal)
        .then(data => {
          if (entry!.requestId !== requestId) return
          entry!.state.value = {
            status: 'success',
            data,
            requestId,
          } as Resource<T>
        })
        .catch(error => {
          if (entry!.requestId !== requestId) return
          if (
            error &&
            typeof error === 'object' &&
            'name' in error &&
            (error as { name?: string }).name === 'AbortError'
          ) {
            return
          }
          entry!.state.value = {
            status: 'error',
            data: opts.keepPrevious ? previousData : undefined,
            error,
            requestId,
          } as Resource<T>
        })
    })

    return entry.state.value
  }

  /**
   * Returns ephemeral UI state stored per element instance.
   */
  ephemeral<T>(
    key: string,
    init: () => T,
    opts: { ttlMs?: number; resetOnDisconnect?: boolean } = {}
  ): T {
    const now = Date.now()
    const existing = this.__camiEphemeralEntries.get(key) as EphemeralEntry<T> | undefined

    if (existing && existing.expiresAt != null && now > existing.expiresAt) {
      this.__camiEphemeralEntries.delete(key)
    }

    let entry = this.__camiEphemeralEntries.get(key) as EphemeralEntry<T> | undefined

    if (!entry) {
      entry = {
        state: new ObservableState<T>(init()),
        ...(opts.ttlMs != null ? { expiresAt: now + opts.ttlMs } : {}),
        resetOnDisconnect: opts.resetOnDisconnect ?? true,
      }
      this.__registerObservables(entry.state)
      this.__camiEphemeralEntries.set(key, entry)
    }

    return entry.state.value
  }

  /**
   * Updates ephemeral UI state by key.
   */
  setEphemeral<T>(key: string, value: T): void {
    const entry = this.__camiEphemeralEntries.get(key) as EphemeralEntry<T> | undefined

    if (entry) {
      entry.state.value = value
      return
    }

    const created: EphemeralEntry<T> = {
      state: new ObservableState<T>(value),
      resetOnDisconnect: true,
    }
    this.__registerObservables(created.state)
    this.__camiEphemeralEntries.set(key, created)
  }

  /**
   * Called when the component is created. Can be overridden by subclasses to add initialization logic.
   * This method is a hook for the connectedCallback, which is invoked each time the custom element is appended into a document-connected element.
   */
  onCreate(): void {
    // Default implementation does nothing.
    // Subclasses can override this to add initialization logic.
  }

  /**
   * Invoked when the custom element is appended into a document-connected element. Sets up initial state and triggers initial rendering.
   * This is typically used to initialize component state, fetch data, and set up event listeners.
   *
   * @example
   * // In a TodoList component
   * connectedCallback() {
   *   super.connectedCallback();
   *   this.fetchTodos(); // Fetch todos when the component is added to the DOM
   * }
   */
  connectedCallback(): void {
    this.__setup({ infer: true })
    this.effect(() => {
      this.render()
    })
    this.onConnect()
  }

  /**
   * Invoked when the custom element is connected to the document's DOM.
   * Subclasses can override this to add initialization logic when the component is added to the DOM.
   *
   * @deprecated Override `connectedCallback()` and call `super.connectedCallback()` instead. This
   * wrapper remains for v0.3 compatibility.
   *
   * @example
   * // In a UserCard component
   * onConnect() {
   *   this.showUserDetails(); // Display user details when the component is connected
   * }
   */
  onConnect(): void {
    // Default implementation does nothing.
  }

  /**
   * Invoked when the custom element is disconnected from the document's DOM.
   * This is a good place to remove event listeners, cancel any ongoing network requests, or clean up any resources.
   * @example
   * // In a Modal component
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   this.close(); // Close the modal when it's disconnected from the DOM
   * }
   */
  disconnectedCallback(): void {
    this.onDisconnect()
    this.__afterRenderGeneration++ // invalidate pending microtask (Bug 4)
    this.__cleanupAfterRender()
    this.__cleanupSettleReactions()
    this.__cleanupResources()
    this.__cleanupEphemeralState()
    this.__unsubscribers.forEach(unsubscribe => unsubscribe())
  }

  /**
   * Invoked when the custom element is disconnected from the document's DOM.
   * Subclasses can override this to add cleanup logic when the component is removed from the DOM.
   *
   * @deprecated Override `disconnectedCallback()` and call `super.disconnectedCallback()` instead.
   * This wrapper remains for v0.3 compatibility.
   *
   * @example
   * // In a VideoPlayer component
   * onDisconnect() {
   *   this.stopPlayback(); // Stop video playback when the component is removed
   * }
   */
  onDisconnect(): void {
    // Default implementation does nothing.
  }

  /**
   * Invoked when an attribute of the custom element is added, removed, updated, or replaced.
   * This can be used to react to attribute changes, such as updating the component state or modifying its appearance.
   *
   * @param name - The name of the attribute that changed
   * @param oldValue - The old value of the attribute
   * @param newValue - The new value of the attribute
   * @example
   * // In a ThemeSwitcher component
   * attributeChangedCallback(name, oldValue, newValue) {
   *   super.attributeChangedCallback(name, oldValue, newValue);
   *   if (name === 'theme') {
   *     this.updateTheme(newValue); // Update the theme when the `theme` attribute changes
   *   }
   * }
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    this.onAttributeChange(name, oldValue, newValue)
  }

  /**
   * Invoked when an attribute of the custom element is added, removed, updated, or replaced.
   * Subclasses can override this to add logic that should run when an attribute changes.
   *
   * @param name - The name of the attribute that changed
   * @param oldValue - The old value of the attribute
   * @param newValue - The new value of the attribute
   * @example
   * // In a CollapsiblePanel component
   * onAttributeChange(name, oldValue, newValue) {
   *   if (name === 'collapsed') {
   *     this.toggleCollapse(newValue === 'true'); // Toggle collapse when the `collapsed` attribute changes
   *   }
   * }
   */
  onAttributeChange(_name: string, _oldValue: string | null, _newValue: string | null): void {
    // Default implementation does nothing.
  }

  /**
   * Invoked when the custom element is moved to a new document.
   * This can be used to update bindings or perform re-initialization as needed when the component is adopted into a new DOM context.
   * @example
   * // In a DragDropContainer component
   * adoptedCallback() {
   *   super.adoptedCallback();
   *   this.updateDragDropContext(); // Update context when the component is moved to a new document
   * }
   */
  adoptedCallback(): void {
    this.onAdopt()
  }

  /**
   * Invoked when the custom element is moved to a new document.
   * Subclasses can override this to add logic that should run when the component is moved to a new document.
   * @example
   * // In a DataGrid component
   * onAdopt() {
   *   this.refreshData(); // Refresh data when the component is adopted into a new document
   * }
   */
  onAdopt(): void {
    // Default implementation does nothing.
  }

  /**
   * Checks if the provided value is an object or an array.
   * @param value - The value to check.
   * @returns True if the value is an object or an array, false otherwise.
   */
  private __isObjectOrArray(value: unknown): value is object | unknown[] {
    return value !== null && (typeof value === 'object' || Array.isArray(value))
  }

  /**
   * Private method. Creates an ObservableProperty for the provided key in the given context when the provided value is an object or an array.
   * @param context - The context in which the property is defined.
   * @param key - The property key.
   * @param observable - The observable to bind to the property.
   * @param isAttribute - Whether the property is an attribute.
   * @throws {TypeError} If observable is not an instance of ObservableState.
   */
  private __createObservablePropertyForObjOrArr(
    context: Record<string, unknown>,
    key: string,
    observable: ObservableState<any>,
    isAttribute: boolean = false
  ): void {
    if (!(observable instanceof ObservableState)) {
      throw new TypeError('Expected observable to be an instance of ObservableState')
    }

    const proxy = this.__observableProxy(observable)
    Object.defineProperty(context, key, {
      get: () => proxy,
      set: (newValue: unknown) => {
        observable.update(() => newValue)
        if (isAttribute) {
          this.setAttribute(key, String(newValue))
        }
      },
    })
  }

  /**
   * Private method. Handles the case when the provided value is not an object or an array.
   * This method creates an ObservableProperty for the provided key in the given context.
   * An ObservableProperty is a special type of property that can notify about changes in its state.
   * This is achieved by defining a getter and a setter for the property using Object.defineProperty.
   * The getter simply returns the current value of the observable.
   * The setter updates the observable with the new value and, if the property is an attribute, also updates the attribute.
   * @param context - The context in which the property is defined.
   * @param key - The property key.
   * @param observable - The observable to bind to the property.
   * @param isAttribute - Whether the property is an attribute.
   * @throws {TypeError} If observable is not an instance of ObservableState.
   */
  private __createObservablePropertyForPrimitive(
    context: Record<string, unknown>,
    key: string,
    observable: ObservableState<any>,
    isAttribute: boolean = false
  ): void {
    if (!(observable instanceof ObservableState)) {
      throw new TypeError('Expected observable to be an instance of ObservableState')
    }

    Object.defineProperty(context, key, {
      get: () => observable.value,
      set: (newValue: unknown) => {
        observable.update(() => newValue)
        if (isAttribute) {
          this.setAttribute(key, String(newValue))
        }
      },
    })
  }

  /**
   * Creates a proxy for the observable.
   * @param observable - The observable for which a proxy is to be created.
   * @throws {TypeError} If observable is not an instance of ObservableState.
   * @returns The created proxy.
   */
  private __observableProxy<T>(observable: ObservableState<T>): ObservableProxy<T> {
    return new ObservableProxy(observable)
  }

  /**
   * Defines the observables, effects, and attributes for the element.
   * @param config - The configuration object.
   */
  private __setup(config: SetupConfig): void {
    if (config.infer === true) {
      const keys = Object.keys(this)
      const keysLen = keys.length

      // Get non-reactive set (cached per class, walks prototype chain)
      const nonReactiveSet = ReactiveElement.__getNonReactiveSet(this.constructor)

      // Using direct for loop instead of forEach for better performance
      for (let i = 0; i < keysLen; i++) {
        const key = keys[i]

        // Early exit: key-based skips first (avoids value access)
        if (key.startsWith('__') || nonReactiveSet.has(key)) {
          continue
        }

        const value = (this as Record<string, unknown>)[key]

        if (typeof value !== 'function') {
          if (value instanceof Observable) {
            continue
          } else if (this.__isAllowedType(value)) {
            const observable = this.__observable(value, key)
            if (this.__isObjectOrArray(value)) {
              this.__createObservablePropertyForObjOrArr(this, key, observable)
            } else {
              this.__createObservablePropertyForPrimitive(this, key, observable)
            }
          } else {
            // Skip non-plain objects (class instances, cross-realm objects)
            // instead of throwing. The property remains non-reactive.
            continue
          }
        }
      }
    }
  }

  /**
   * Creates an observable with an initial value.
   * @param initialValue - The initial value for the observable.
   * @param name - The name of the observable.
   * @throws {Error} If the type of initialValue is not allowed in observables.
   * @returns The created observable state.
   */
  private __observable<T>(initialValue: T, name?: string): ObservableState<T> {
    if (!this.__isAllowedType(initialValue)) {
      const type = Object.prototype.toString.call(initialValue)
      throw new Error(
        `[Cami.js] The value of type ${type} is not allowed in observables. Only primitive values, arrays, and plain objects are allowed.`
      )
    }

    const observable = new ObservableState(initialValue, null, name ? { name } : undefined)

    this.__registerObservables(observable)
    return observable
  }

  /**
   * Checks if the provided value is of an allowed type
   * @param value - The value to check
   * @returns True if the value is of an allowed type, false otherwise
   */
  private __isAllowedType(value: unknown): boolean {
    const allowedTypes = ['number', 'string', 'boolean', 'object', 'undefined']
    const valueType = typeof value

    if (valueType === 'object') {
      return value === null || Array.isArray(value) || this.__isPlainObject(value)
    }

    return allowedTypes.includes(valueType)
  }

  /**
   * Checks if the provided value is a plain object
   * @param value - The value to check
   * @returns True if the value is a plain object, false otherwise
   */
  private __isPlainObject(value: unknown): value is Record<string, unknown> {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
      return false
    }

    const prototype = Object.getPrototypeOf(value)
    return prototype === null || prototype === Object.prototype
  }

  /**
   * Registers an observable state to the list of unsubscribers
   * @param observableState - The observable state to register
   */
  private __registerObservables(observableState: ObservableState<any>): void {
    if (!(observableState instanceof ObservableState)) {
      throw new TypeError('Expected observableState to be an instance of ObservableState')
    }

    // Only effects have a dispose method - use direct property access for speed
    this.__unsubscribers.set(observableState, () => {
      if ('dispose' in observableState && typeof observableState.dispose === 'function') {
        observableState.dispose()
      }
    })
  }

  private __scheduleAfterRender(): void {
    if (!__afterRenderEnabled) return
    if (
      this.__afterRenderScheduled ||
      (this.__afterRenderRegistry.size === 0 &&
        this.__afterRenderCleanups.size === 0 &&
        this.__afterRenderPrevDeps.size === 0)
    ) {
      return
    }

    this.__afterRenderScheduled = true
    const gen = this.__afterRenderGeneration
    const schedule =
      typeof queueMicrotask === 'function'
        ? queueMicrotask
        : (callback: () => void) => Promise.resolve().then(callback)

    schedule(() => {
      this.__afterRenderScheduled = false
      // Bug 4: if the element has disconnected, do not flush or re-schedule.
      if (!this.isConnected) return
      if (gen !== this.__afterRenderGeneration) {
        // A newer render occurred. Check if the stale generation was
        // manually flushed — if so, skip (effects already ran). If not,
        // reschedule to flush the newer render's effects.
        // (P2 fix: use generation-specific check so a newer render
        // after a manual flush is NOT suppressed.)
        if (gen === this.__afterRenderManualFlushGen) {
          this.__afterRenderManualFlushGen = -1
          this.__scheduleAfterRender()
          return
        }
        this.__scheduleAfterRender()
        return
      }
      // Generation matches. If this generation was manually flushed, skip.
      if (gen === this.__afterRenderManualFlushGen) {
        this.__afterRenderManualFlushGen = -1
        return
      }
      this.__flushAfterRender()
    })
  }

  __flushAfterRender(): void {
    const registry = this.__afterRenderRegistry
    const cleanups = this.__afterRenderCleanups
    const prevDeps = this.__afterRenderPrevDeps

    // Run cleanups for keys removed from this render (not re-registered).
    // Also clear prevDeps for ALL removed keys — an effect may have deps
    // but no cleanup function, and stale deps would cause incorrect skips
    // if the key is re-added later with the same deps. (P1 fix from review)
    for (const [key, cleanup] of cleanups) {
      if (!registry.has(key)) {
        cleanup()
        cleanups.delete(key)
      }
    }
    // Clear dep history for keys not present in this render's registry
    for (const key of prevDeps.keys()) {
      if (!registry.has(key)) {
        prevDeps.delete(key)
      }
    }

    // Run effects. For keys that re-run (already in cleanups), run the old
    // cleanup first, then store the new one. This prevents leaks (Bug 1 fix).
    for (const [key, entry] of registry) {
      const { fn, deps } = entry

      // Deps-based skip: if deps provided and unchanged, skip this effect
      if (deps !== undefined) {
        const prev = prevDeps.get(key)
        if (
          prev !== undefined &&
          prev.length === deps.length &&
          deps.every((v, i) => Object.is(v, prev[i]))
        ) {
          continue
        }
        prevDeps.set(key, deps.slice())
      } else {
        // Clear dep history when switching to no-deps mode (P2 fix).
        // Otherwise a later switch back to deps=[sameValue] would
        // incorrectly skip because the stale snapshot matches.
        prevDeps.delete(key)
      }

      const oldCleanup = cleanups.get(key)
      if (oldCleanup) {
        oldCleanup()
        cleanups.delete(key)
      }

      const cleanup = fn()
      if (typeof cleanup === 'function') {
        cleanups.set(key, cleanup)
      }
    }
  }

  private __cleanupAfterRender(): void {
    for (const cleanup of this.__afterRenderCleanups.values()) {
      cleanup()
    }
    this.__afterRenderCleanups.clear()
    this.__afterRenderPrevDeps.clear()
  }

  private __cleanupSettleReactions(): void {
    for (const reaction of this.__settleReactions) {
      dequeueSettle(reaction)
      reaction._dispose()
    }
    this.__settleReactions = []
  }

  private __cleanupResources(): void {
    for (const entry of this.__camiResourceEntries.values()) {
      if (entry.abortController) {
        entry.abortController.abort()
      }
    }
    this.__camiResourceEntries.clear()
  }

  private __cleanupEphemeralState(): void {
    for (const [key, entry] of this.__camiEphemeralEntries.entries()) {
      if (entry.resetOnDisconnect) {
        this.__camiEphemeralEntries.delete(key)
      }
    }
  }

  /**
   * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
   * Uses memoization to avoid unnecessary rendering when the template result hasn't changed.
   */
  render(): void {
    if (typeof this.template !== 'function') {
      return
    }

    if (this.__renderInProgress) {
      throw new Error(
        `[Cami.js] Re-entrant render is not allowed in <${this.tagName.toLowerCase()}>. Keep templates pure and move state writes to event handlers, actions, or afterRender().`
      )
    }

    this.__renderInProgress = true

    try {
      this.__renderOnce()
    } finally {
      this.__renderInProgress = false
    }
  }

  private __renderOnce(): void {
    // Bug 5: collect declarations in a render-local draft. Only publish to
    // the active registry after template() succeeds, so a failed render
    // (template throws midway) does not leak partial effect declarations.
    this.__afterRenderDraft = new Map()
    this.__afterRenderGeneration++

    // Call template function and get the result
    enterRenderPhase(this.tagName.toLowerCase())
    let template: TemplateResult
    try {
      template = this.template!()
    } finally {
      exitRenderPhase()
    }

    // Publish draft — template() completed without throwing
    this.__afterRenderRegistry = this.__afterRenderDraft

    // Using reference equality first (faster) before deep equal check
    if (this.__prevTemplate === template) {
      // Even if DOM output is identical, we still need to flush commit-phase effects.
      this.__scheduleAfterRender()
      return
    }

    const prevTemplate = this.__prevTemplate
    const isPrevLitTemplate = this.__isLitTemplateResult(prevTemplate)
    const isNextLitTemplate = this.__isLitTemplateResult(template)

    // Avoid deep-equal on lit TemplateResults; they include runtime fields that can
    // yield false positives and skip required re-renders.
    if (
      prevTemplate &&
      !isPrevLitTemplate &&
      !isNextLitTemplate &&
      _deepEqual(prevTemplate, template)
    ) {
      this.__scheduleAfterRender()
      return
    }

    this.__prevTemplate = template

    // Suspend dependency tracking during DOM commit. __litRender connects and
    // disconnects custom elements synchronously; child lifecycle callbacks
    // (connectedCallback/disconnectedCallback) may dispatch to stores. Without
    // suspending the tracker, those dispatches (or their trailing getState())
    // would register this component's render effect as a subscriber to stores
    // it never intentionally read — causing spurious re-renders and re-entrant
    // render crashes on subsequent commits.
    const __prevTracker = DependencyTracker.current
    DependencyTracker.current = null
    try {
      // Render the template
      __litRender(template, this)
    } finally {
      DependencyTracker.current = __prevTracker
    }
    this.__scheduleAfterRender()
  }

  private __isLitTemplateResult(value: unknown): value is TemplateResult {
    if (!value || typeof value !== 'object') return false
    const candidate = value as {
      strings?: unknown
      values?: unknown
      _$litType$?: unknown
    }
    return (
      Array.isArray(candidate.strings) &&
      Array.isArray(candidate.values) &&
      candidate._$litType$ !== undefined
    )
  }

  /**
   * Template method that should be overridden by subclasses to define the component's template.
   * @returns The template result for rendering
   */
  template?(): TemplateResult

  /**
   * Warns if required properties are missing from the component.
   * @param properties - Array of property names to check
   */
  warnIfMissingProperties(properties: string[]): void {
    const missingProperties = properties.filter(prop => !(prop in this))
    if (missingProperties.length > 0) {
      console.warn(`Missing required properties: ${missingProperties.join(', ')}`)
    }
  }
}

// Export types for external use
export type {
  ObservableProperty,
  AttributeParser,
  ObservableAttributes,
  SetupConfig,
  EffectFunction,
  DeriveFunction,
  UnsubscribeFunction,
  DeriveResult,
}

export { ReactiveElement }
