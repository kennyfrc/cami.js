import { ObservableState } from "./observable-state";
import { _deepClone, _deepEqual } from "../utils";
/**
 * ObservableProxy class that creates a proxy wrapper around ObservableState
 * to enable direct property access and modification with reactive updates.
 *
 * @template T The type of the observable value
 */
class ObservableProxy {
    constructor(observable) {
        if (!(observable instanceof ObservableState)) {
            throw new TypeError("Expected observable to be an instance of ObservableState");
        }
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
        const proxyGetHandler = (target, property, _receiver) => {
            // Handle conversion methods first
            if (property === 'valueOf' ||
                property === 'toString' ||
                property === 'toJSON' ||
                property === Symbol.toPrimitive) {
                return conversionMethods[property];
            }
            // Inline property type check for better performance
            let propertyType;
            const propKey = property;
            if (typeof target[propKey] === "function") {
                propertyType = "targetFunction";
            }
            else if (property in target) {
                propertyType = "targetProperty";
            }
            else if (target.value && typeof target.value[property] === "function") {
                propertyType = "valueFunction";
            }
            else {
                propertyType = "valueProperty";
            }
            switch (propertyType) {
                case "targetFunction":
                    return target[propKey].bind(target);
                case "targetProperty":
                    return _deepClone(target[propKey]);
                case "valueFunction":
                    return (...args) => target.value[property](...args);
                case "valueProperty":
                    return _deepClone(target.value[property]);
                default:
                    console.warn(`Unexpected property type: ${propertyType}`);
                    return undefined;
            }
        };
        const proxySetHandler = (target, property, value, _receiver) => {
            const propKey = property;
            if (property in target) {
                // Check if the value is actually different before updating
                if (typeof target[propKey] === 'object' && target[propKey] !== null &&
                    typeof value === 'object' && value !== null) {
                    // Deep equality check for objects
                    if (_deepEqual(target[propKey], value)) {
                        return true; // Skip update if they're equal
                    }
                }
                else if (target[propKey] === value) {
                    return true; // Skip update if primitive values are equal
                }
                target[property] = value;
            }
            else {
                // For properties on target.value
                const oldValue = target.value[property];
                // Check if the value is actually different before updating
                if (typeof oldValue === 'object' && oldValue !== null &&
                    typeof value === 'object' && value !== null) {
                    // Deep equality check for objects
                    if (_deepEqual(oldValue, value)) {
                        return true; // Skip update if they're equal
                    }
                }
                else if (oldValue === value) {
                    return true; // Skip update if primitive values are equal
                }
                target.value[property] = value;
            }
            target.update(() => target.value);
            return true;
        };
        const proxyDeleteHandler = (target, property) => {
            if (property in target.value) {
                delete target.value[property];
                target.update(() => target.value);
                return true;
            }
            return false;
        };
        return new Proxy(observable, {
            get: proxyGetHandler,
            set: proxySetHandler,
            deleteProperty: proxyDeleteHandler,
            ownKeys: (target) => {
                return Reflect.ownKeys(target.value);
            },
            has: (target, property) => {
                return property in target.value || property in target;
            },
            defineProperty: (target, property, descriptor) => {
                if (property in target) {
                    return Reflect.defineProperty(target, property, descriptor);
                }
                else {
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
    }
}
export { ObservableProxy };
//# sourceMappingURL=observable-proxy.js.map