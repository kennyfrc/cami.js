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
import { ReactiveElement } from "./reactive-element.js";
// Import the optimized store implementation and use it as the default
import { ObservableStore, store } from "./observables/observable-store.js";
// import { ObservableStore, storeOptimized } from "./observables/observable-store-optimized.js";
// Replace the standard store with the optimized version
// const store = storeOptimized;
import { Model } from "./observables/observable-model.js";
import { Observable } from "./observables/observable.js";
import { ObservableState, effect } from "./observables/observable-state.js";
import { __config } from "./config.js";
import { __trace } from "./trace.js";
import { Type, useValidationHook, useValidationThunk } from "./types/index.js";
import { createURLStore } from "./observables/url-store.js";
import { createIdbPromise, persistToIdbThunk, createLocalStorage, persistToLocalStorageThunk, } from "./storage/adapters.js";
const { debug, events } = __config;
/**
 * @exports store - The store object from observable-store.js. This uses local storage by default.
 * @exports html - The html function from html.js
 * @exports svg - The svg function from html.js
 * @exports ReactiveElement - The ReactiveElement class from reactive_element.js
 * @exports ObservableElement - The ObservableElement class from observable-element.js
 * @exports Observable - The Observable class from observable.js
 * @exports ObservableState - The ObservableState class from observable-state.js
 * @exports ObservableStore - The ObservableStore class from observable-store.js
 * @exports debug - The debug property from __config
 * @exports events - The events property from __config
 */
export { store, 
// storeOptimized,
html, svg, ReactiveElement, Observable, ObservableState, ObservableStore, 
// Export original implementation with different name for compatibility
// OriginalObservableStore,
// originalStore,
debug, events, effect, Type, useValidationHook, useValidationThunk, Model, createIdbPromise, persistToIdbThunk, createLocalStorage, persistToLocalStorageThunk, createURLStore, unsafeHTML, repeat, keyed };
//# sourceMappingURL=cami.js.map