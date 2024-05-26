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
import { produce } from "./produce.js"
import { ReactiveElement } from './reactive-element.js';
import { ObservableStore, store, slice } from './observables/observable-store.js';
import { Observable } from './observables/observable.js';
import { ObservableState, computed, effect } from './observables/observable-state.js';
import { ObservableStream } from './observables/observable-stream.js';
import { ObservableElement } from './observables/observable-element.js';
import { __config } from './config.js';
import { __trace } from './trace.js';
import { http } from './http.js';

const { debug, events } = __config;

/**
 * @exports store - The store object from observable-store.js. This uses local storage by default.
 * @exports slice - The slice function from observable-store.js. This allows creating slices of the store.
 * @exports html - The html function from html.js
 * @exports svg - The svg function from html.js
 * @exports ReactiveElement - The ReactiveElement class from reactive_element.js
 * @exports ObservableStream - The ObservableStream class from observable-stream.js
 * @exports ObservableElement - The ObservableElement class from observable-element.js
 * @exports Observable - The Observable class from observable.js
 * @exports ObservableState - The ObservableState class from observable-state.js
 * @exports ObservableStore - The ObservableStore class from observable-store.js
 * @exports http - The http function from http.js
 * @exports debug - The debug property from __config
 * @exports events - The events property from __config
 */
export { store, slice, html, svg, ReactiveElement, ObservableStream, ObservableElement, Observable, ObservableState, ObservableStore, http, debug, events, computed, effect };
