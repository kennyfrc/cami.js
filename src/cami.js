/**
 * @license
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */

/**
 * @module cami
 */
import { html, render, svg } from 'lit-html';
import { css } from 'goober';
import { produce } from "immer"
import { ReactiveElement } from './reactive-element.js';
import { ObservableStore, store } from './observables/observable-store.js';
import { Observable } from './observables/observable.js';
import { ObservableState, computed, effect } from './observables/observable-state.js';
import { ObservableStream } from './observables/observable-stream.js';
import { ObservableElement } from './observables/observable-element.js';
import { _config } from './config.js';
import { _trace } from './trace.js';
import { http } from './http.js';

const { debug, events } = _config;

/**
 * @exports store - The store object from observable-store.js. This uses local storage by default.
 * @exports html - The html function from 'lit-html'
 * @exports svg - The svg function from 'lit-html'
 * @exports css - The css function from 'goober'
 * @exports ReactiveElement - The ReactiveElement class from reactive_element.js
 * @exports ObservableStream - The ObservableStream class from observable-stream.js
 * @exports ObservableElement - The ObservableElement class from observable-element.js
 * @exports Observable - The Observable class from observable.js
 * @exports ObservableState - The ObservableState class from observable-state.js
 * @exports ObservableStore - The ObservableStore class from observable-store.js
 * @exports http - The http function from http.js
 * @exports debug - The debug property from _config
 * @exports events - The events property from _config
 */
export { store, html, svg, css, ReactiveElement, ObservableStream, ObservableElement, Observable, ObservableState, ObservableStore, http, debug, events, computed, effect };
