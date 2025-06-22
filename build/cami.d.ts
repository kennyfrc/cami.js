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
import { ReactiveElement } from "./reactive-element.js";
import { ObservableStore, store } from "./observables/observable-store.js";
import { Model } from "./observables/observable-model.js";
import { Observable } from "./observables/observable.js";
import { ObservableState, effect } from "./observables/observable-state.js";
import { Type, useValidationHook, useValidationThunk } from "./types/index.js";
import { createURLStore } from "./observables/url-store.js";
import { createIdbPromise, persistToIdbThunk, createLocalStorage, persistToLocalStorageThunk } from "./storage/adapters.js";
declare const debug: import("./config.js").ConfigItem, events: import("./config.js").ConfigItem;
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
export { store, html, svg, ReactiveElement, Observable, ObservableState, ObservableStore, debug, events, effect, Type, useValidationHook, useValidationThunk, Model, createIdbPromise, persistToIdbThunk, createLocalStorage, persistToLocalStorageThunk, createURLStore, unsafeHTML, repeat, keyed };
export type { Observer, ObservableOptions, SubscribeFunction, Subscription } from "./observables/observable.js";
export type { StateUpdater, EffectFunction as StateEffectFunction, DeriveFunction, EffectCleanup, DependencyTracker as StateDependencyTracker } from "./observables/observable-state.js";
export type { StoreConfig, StoreState, ActionFunction, QueryFunction, AsyncActionFunction, MutationFunction, StateMachineConfig, CacheConfig, PersistenceThunk, ValidationThunk, LoggingThunk, DebounceThunk, OptimisticUpdateThunk, CacheInvalidationThunk, CompressionThunk, SerializationThunk, OfflineThunk, EventThunk } from "./observables/observable-store.js";
export type { ModelConfig, ModelSchema, InferModelState } from "./observables/observable-model.js";
export type { ObservableProperty, AttributeParser, ObservableAttributes, SetupConfig, EffectFunction, DeriveFunction as ReactiveElementDeriveFunction, UnsubscribeFunction, DeriveResult } from "./reactive-element.js";
export type { PrimitiveTypeName, TypeDefinition, InferType, ComplexType, ObjectType, ArrayType, SumType, ProductType, AnyType, EnumType, OptionalType, RefinementType, DependentPairType, DependentRecordType, DateType, VectType, TreeType, RoseTreeType, LiteralType, FunctionType, VoidType, DependentFunctionType, DependentArrayType, DependentSumType, ReferenceType } from "./types/index.js";
export type { URLState, RouteConfig, RouteEnterContext, RouteLeaveContext, NavigationHookContext, ResourceLoaderContext, RouteDefinition, NavigationState, NavigateOptions, URLStoreOptions, NavigationHook, ResourceLoader } from "./observables/url-store.js";
export type { IDBStoreConfig, QueryOptions, IDBPromiseStore, PersistToIdbConfig, ThunkParams, LocalStorageConfig, LocalStorageAdapter } from "./storage/adapters.js";
export type { TemplateResult, SVGTemplateResult } from "lit-html";
//# sourceMappingURL=cami.d.ts.map