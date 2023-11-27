import { ObservableStream } from './observable-stream.js';

/**
 * @class
 * @description Observable class that wraps a DOM element and allows observing its events.
 * @example
 * ```javascript
 * const { ObservableElement } = cami;
 * const draggableElement = new ObservableElement(".draggable");
 * draggableElement.on('mousedown').subscribe({
 *   next: event => console.log('drag event', event),
 *   error: err => console.error(err),
 * });
 * ```
 */
class ObservableElement extends ObservableStream {
  /**
   * @constructor
   * @param {string|Element} selectorOrElement - The CSS selector of the element to observe or the DOM element itself
   * @throws {Error} If no element matches the provided selector or the provided DOM element is null
   * @example
   * ```javascript
   * const { ObservableElement } = cami;
   * const draggableElement = new ObservableElement(".draggable");
   * ```
   */
  constructor(selectorOrElement) {
    super();
    /** @type {Element} */
    if (typeof selectorOrElement === 'string') {
      this.element = document.querySelector(selectorOrElement);
      if (!this.element) {
        throw new Error(`[Cami.js] Element not found for selector: ${selectorOrElement}`);
      }
    } else if (selectorOrElement instanceof Element || selectorOrElement instanceof Document) {
      this.element = selectorOrElement;
    } else {
      throw new Error(`[Cami.js] Invalid argument: ${selectorOrElement}`);
    }
  }

  /**
   * @method
   * @param {string} eventType - The type of the event to observe
   * @param {Object} options - The options to pass to addEventListener
   * @returns {ObservableStream} An ObservableStream that emits the observed events
   * @example
   * ```javascript
   * const { ObservableElement } = cami;
   * const draggableElement = new ObservableElement(".draggable");
   * draggableElement.on('mousedown').subscribe({
   *   next: event => console.log('drag event', event),
   *   error: err => console.error(err),
   * });
   * ```
   */
  on(eventType, options = {}) {
    return new ObservableStream(subscriber => {
      const eventListener = event => {
        subscriber.next(event);
      };

      this.element.addEventListener(eventType, eventListener, options);

      return () => {
        this.element.removeEventListener(eventType, eventListener, options);
      };
    });
  }
}

export { ObservableElement };
