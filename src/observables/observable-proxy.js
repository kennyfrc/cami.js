import { ObservableState } from "./observable-state.js";
import { _deepClone } from "../utils";

/**
 * @typedef ObservableProxy
 * @property {function(): any} get - A getter function that returns a copy of the current value of the property.
 * @property {function(any): void} set - A setter function that updates the value of the property.
 */
const proxyPropsKey = Symbol('proxyProps');

class ObservableProxy {
  constructor(observable) {
    if (!(observable instanceof ObservableState)) {
      throw new TypeError(
        "Expected observable to be an instance of ObservableState"
      );
    }

    // Create proxy first to use as WeakMap key
     let proxy;
     const conversionMethods = {
       valueOf() {
         return observable.value;
       },
      toString() {
        return String(observable.value);
      },
      toJSON() {
        return observable.value;
      },
      [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
          return Number(observable.value);
        }
        if (hint === 'string') {
          return String(observable.value);
        }
        return observable.value;
      }
    };

    return new Proxy(observable, {
      get: (target, property, receiver) => {
         // Check proxy-specific properties first
         const props = receiver[proxyPropsKey] || {};
          if (property in props) {
            return props[property];
          }
        // Handle conversion methods first
        if (property === 'valueOf' ||
            property === 'toString' ||
            property === 'toJSON' ||
            property === Symbol.toPrimitive) {
          return conversionMethods[property];
        }

        const getPropertyType = (target, property) => {
          if (typeof target[property] === "function") return "targetFunction";
          if (property in target) return "targetProperty";
          if (typeof target.value[property] === "function") return "valueFunction";
          return "valueProperty";
        };

        const propertyType = getPropertyType(target, property);

        switch (propertyType) {
          case "targetFunction":
            return target[property].bind(target);
          case "targetProperty":
            return _deepClone(target[property]);
          case "valueFunction":
            return (...args) => target.value[property](...args);
          case "valueProperty":
            return _deepClone(target.value[property]);
          default:
            console.warn(`Unexpected property type: ${propertyType}`);
            return undefined;
        }
      },
      set: (target, property, value, receiver) => {
       // Handle proxy-specific properties
       if (!(property in target) && !(property in target.value)) {
        const props = receiver[proxyPropsKey] || {};
        props[property] = value;
        receiver[proxyPropsKey] = props;
        return true;
      }

       if (property in target) {
         target[property] = value;
       } else {
         target.value[property] = value;
       }
       target.update(() => target.value);
       return true;
     },
      deleteProperty: (target, property) => {
        if (property in target.value) {
          delete target.value[property];
          target.update(() => target.value);
          return true;
        }
        return false;
      },
      ownKeys: (target) => {
               const props = target[proxyPropsKey] || {};
               return [
                 ...Reflect.ownKeys(target.value),
                 ...Reflect.ownKeys(target),
                 ...Object.keys(props)
               ];
             },
      has: (target, property) => {
               const props = target[proxyPropsKey] || {};
               return property in props ||
                      property in target.value ||
                      property in target;
             },
      defineProperty: (target, property, descriptor) => {
        if (property in target) {
          return Reflect.defineProperty(target, property, descriptor);
        } else {
          const result = Reflect.defineProperty(target.value, property, descriptor);
          if (result) {
            target.update(() => target.value);
          }
          return result;
        }
      },
      getOwnPropertyDescriptor: (target, property) => {
        if (property in target) {
          return Reflect.getOwnPropertyDescriptor(target, property);
        }
        return Reflect.getOwnPropertyDescriptor(target.value, property);
      }
    });

    proxy[proxyPropsKey] = {};
         return proxy;
  }
}

export { ObservableProxy };