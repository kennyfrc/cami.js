/**
 * @license
 * cami.js
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */
/**
 * @module cami
 */
import { enableMapSet } from 'immer'
import { html, svg } from 'lit-html'
import { keyed } from 'lit-html/directives/keyed.js'
import { repeat } from 'lit-html/directives/repeat.js'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'

import { __config } from './config'
import { Observable } from './observables/observable'
// import { ObservableStore, storeOptimized } from "./observables/observable-store-optimized";

// Replace the standard store with the optimized version
// const store = storeOptimized;
import { ObservableState, effect } from './observables/observable-state'
// Import the optimized store implementation and use it as the default
import { ObservableStore, store } from './observables/observable-store'
import { URLStore, createURLStore } from './observables/url-store'
import { ReactiveElement } from './reactive-element'
import { useImage } from './resources/use-image'
import { createLocalStorage, persistToLocalStorageThunk } from './storage/adapters'
import { __trace } from './trace'

enableMapSet()

const { debug, events } = __config

/**
 * Main exports for the cami.js library with full TypeScript support
 *
 * @exports store - The store function from observable-store.ts. This uses local storage by default.
 * @exports html - The html template literal tag function from lit-html
 * @exports svg - The svg template literal tag function from lit-html
 * @exports ReactiveElement - The ReactiveElement base class for creating reactive web components
 * @exports Observable - The Observable class for creating reactive streams
 * @exports ObservableState - The ObservableState class for reactive state management
 * @exports ObservableStore - The ObservableStore class for complex state management
 * @exports effect - Effect function for reactive side effects
 * @exports createURLStore - URL-based routing store
 * @exports createLocalStorage - LocalStorage adapter
 * @exports debug - Debug configuration
 * @exports events - Events configuration
 * @exports unsafeHTML - lit-html unsafe HTML directive
 * @exports repeat - lit-html repeat directive
 * @exports keyed - lit-html keyed directive
 */
export {
  store,
  // storeOptimized,
  html,
  svg,
  ReactiveElement,
  Observable,
  ObservableState,
  ObservableStore,
  // Export original implementation with different name for compatibility
  // OriginalObservableStore,
  // originalStore,
  debug,
  events,
  effect,
  createLocalStorage,
  persistToLocalStorageThunk,
  createURLStore,
  URLStore,
  unsafeHTML,
  repeat,
  keyed,
  useImage,
}

// Export types for TypeScript users
export type {
  // Observable types
  Observer,
  Subscription,
} from './observables/observable'

export type {
  // Observable State types
  EffectCleanup,
  DependencyTracker,
} from './observables/observable-state'

export type {
  // Observable Store types
  ActionHandler,
  ActionSpec,
  AsyncActionContext,
  AsyncActionHandler,
  Hook,
  HookContext,
  InvalidateQueriesOptions,
  MemoContext,
  MemoHandler,
  MutationConfig,
  MutationContext,
  MutationErrorContext,
  MutationSettledContext,
  MutationSuccessContext,
  QueryConfig,
  QueryContext,
  QueryErrorContext,
  QuerySettledContext,
  QuerySuccessContext,
  ReducerContext,
  StateMachineDefinition,
  StateMachineEvent,
  StoreConfig,
  StoreFactoryConfig,
} from './observables/observable-store'

export type {
  // ReactiveElement types
  ObservableProperty,
  AttributeParser,
  ObservableAttributes,
  SetupConfig,
  EffectFunction,
  DeriveFunction as ReactiveElementDeriveFunction,
  UnsubscribeFunction,
  DeriveResult,
} from './reactive-element'

export type { Resource, ResourceOptions } from './resources/resource'
export type { LocalStorageAdapter } from './storage/adapters'

export type {
  // URL Store types
  URLState,
  RouteConfig,
  RouteEnterContext,
  RouteLeaveContext,
  NavigationHookContext,
  ResourceLoaderContext,
  RouteDefinition,
  NavigationState,
  NavigateOptions,
  URLStoreOptions,
  NavigationHook,
  ResourceLoader,
} from './observables/url-store'
