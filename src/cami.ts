/**
 * @license
 * cami.js
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */

/**
 * @module cami
 */
import { html, svg } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { keyed } from "lit-html/directives/keyed.js";
import { repeat } from "lit-html/directives/repeat.js";
import { enableMapSet } from "immer";
enableMapSet();
import { ReactiveElement } from "./reactive-element";
// Import the optimized store implementation and use it as the default
import { ObservableStore, store } from "./observables/observable-store";
// import { ObservableStore, storeOptimized } from "./observables/observable-store-optimized";

// Replace the standard store with the optimized version
// const store = storeOptimized;
import { Model } from "./observables/observable-model";
import { Observable } from "./observables/observable";
import { ObservableState, effect } from "./observables/observable-state";
import { __config } from "./config";
import { __trace } from "./trace";
import { Type, useValidationHook, useValidationThunk } from "./types/index";
import { createURLStore, URLStore } from "./observables/url-store";
import {
  createIdbPromise,
  persistToIdbThunk,
  createLocalStorage,
  persistToLocalStorageThunk,
} from "./storage/adapters";
import invariant from "./invariant";
import { _deepEqual, _deepMerge, _deepClone } from "./utils";

const { debug, events } = __config;

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
 * @exports Model - The Model class for typed data models with validation
 * @exports Type - Type definitions and validation utilities
 * @exports effect - Effect function for reactive side effects
 * @exports createURLStore - URL-based routing store
 * @exports createIdbPromise - IndexedDB storage adapter
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
  Type,
  useValidationHook,
  useValidationThunk,
  Model,
  createIdbPromise,
  persistToIdbThunk,
  createLocalStorage,
  persistToLocalStorageThunk,
  createURLStore,
  URLStore,
  unsafeHTML,
  repeat,
  keyed,
  invariant,
  _deepEqual,
  _deepMerge,
  _deepClone,
};

// Export types for TypeScript users
export type {
  // Observable types
  Observer,
  Subscription,
} from "./observables/observable";

export type {
  // Observable State types
  EffectCleanup,
  DependencyTracker,
} from "./observables/observable-state";

export type {
  // Observable Store types
  StoreConfig,
  StoreFactoryConfig,
} from "./observables/observable-store";

export type {
  // Model types
  ModelConfig,
  InferModelState,
} from "./observables/observable-model";

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
} from "./reactive-element";

export type {
  // Type system types
  PrimitiveTypeName,
  TypeDefinition,
  InferType,
  ComplexType,
  ObjectType,
  ArrayType,
  SumType,
  ProductType,
  AnyType,
  EnumType,
  OptionalType,
  RefinementType,
  DependentPairType,
  DependentRecordType,
  DateType,
  VectType,
  TreeType,
  RoseTreeType,
  LiteralType,
  FunctionType,
  VoidType,
  DependentFunctionType,
  DependentArrayType,
  DependentSumType,
  ReferenceType,
} from "./types/index";

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
} from "./observables/url-store";
