/**
 * @license
 * cami.js
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */

/**
 * @module cami
 */
import { html, render, svg } from './html.js';
import { produce } from "immer";
import { ReactiveElement } from './reactive-element.js';
import { ObservableStore, store } from './observables/observable-store.js';
import { Observable } from './observables/observable.js';
import { ObservableState, effect } from './observables/observable-state.js';
import { __config } from './config.js';
import { __trace } from './trace.js';
import { Type, useValidationThunk } from './types.js';

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
export { store, html, svg, ReactiveElement, Observable, ObservableState, ObservableStore, debug, events, effect, Type, useValidationThunk };
