import { ObservableState } from "./observable-state.js";
import { _deepClone } from "../utils.js";

/**
 * @typedef ObservableProxy
 * @property {function(): any} get - A getter function that returns a copy of the current value of the property. If the property is a primitive value, this will return the value directly from the ObservableState instance. If the property is a non-primitive value, this will return a deep clone of the value. This getter is used when accessing a non-primitive property on a ReactiveElement instance. We use Proxy instead of Object.defineProperty because it allows us to handle nested properties.
 * @property {function(any): void} set - A setter function that updates the value of the property. It updates the ObservableState instance with the new value. This setter is used when assigning a new value to a non-primitive property on a ReactiveElement instance.
 */
class ObservableProxy {
  constructor(observable) {
    if (!(observable instanceof ObservableState)) {
      throw new TypeError(
        "Expected observable to be an instance of ObservableState"
      );
    }

    return new Proxy(observable, {
      get: (target, property) => {
        const getPropertyType = (target, property) => {
          if (typeof target[property] === "function") return "targetFunction";
          if (property in target) return "targetProperty";
          if (typeof target.value[property] === "function")
            return "valueFunction";
          return "valueProperty";
        };

        const propertyType = getPropertyType(target, property);

        switch (propertyType) {
          case "targetFunction":
            // If the property is a function on the target (ObservableState instance),
            // we bind it to the target to ensure correct 'this' context when called.
            // This allows methods on ObservableState to be called correctly.
            return target[property].bind(target);

          case "targetProperty":
            // If the property exists directly on the target (ObservableState instance),
            // we return a deep clone of it. This prevents accidental mutations of
            // internal ObservableState properties.
            return _deepClone(target[property]);

          case "valueFunction":
            // If the property is a function on the target's value (the actual data),
            // we return a new function that calls the original function with the correct context.
            // This allows methods on the stored data to be called while maintaining reactivity.
            return (...args) => target.value[property](...args);

          case "valueProperty":
            // If the property is on the target's value (the actual data),
            // we return a deep clone of it. This ensures that nested objects and arrays
            // can be safely modified without affecting the original data until explicitly updated.
            return _deepClone(target.value[property]);

          default:
            // If we encounter an unexpected property type, we log a warning and return undefined.
            // This helps with debugging if the getPropertyType function is modified or if
            // there's an unexpected scenario we haven't accounted for.
            console.warn(`Unexpected property type: ${propertyType}`);
            return undefined;
        }
      },
      set: (target, property, value) => {
        target[property] = value;
        target.update(() => target.value);
        return true;
      },
    });
  }
}

export { ObservableProxy };
