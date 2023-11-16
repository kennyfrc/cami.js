import { ObservableStream } from './observable-stream.js';

/**
 * @class
 * @description Observable class that wraps a DOM element and allows observing its events.
 */
class ObservableElement extends ObservableStream {
  /**
   * @constructor
   * @param {string|Element} selectorOrElement - The CSS selector of the element to observe or the DOM element itself
   * @throws {Error} If no element matches the provided selector or the provided DOM element is null
   */
  constructor(selectorOrElement) {
    super();
    /** @type {Element} */
    if (typeof selectorOrElement === 'string') {
      this.element = document.querySelector(selectorOrElement);
      if (!this.element) {
        throw new Error(`Element not found for selector: ${selectorOrElement}`);
      }
    } else if (selectorOrElement instanceof Element || selectorOrElement instanceof Document) {
      this.element = selectorOrElement;
    } else {
      throw new Error(`Invalid argument: ${selectorOrElement}`);
    }
  }

  /**
   * @method
   * @param {string} eventType - The type of the event to observe
   * @param {Object} options - The options to pass to addEventListener
   * @returns {ObservableStream} An ObservableStream that emits the observed events
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
