import { ObservableState } from "./observable-state";
import { _deepClone, _deepEqual } from "../utils";

// Type definitions for ObservableProxy functionality
type PropertyType = "targetFunction" | "targetProperty" | "valueFunction" | "valueProperty";

type ConversionMethods<T> = {
  valueOf(): T;
  toString(): string;
  toJSON(): T;
  [Symbol.toPrimitive](hint: 'number' | 'string' | 'default'): T | string | number;
};

// Type for the proxy handler get trap
type ProxyGetHandler<T> = (
  target: ObservableState<T>,
  property: string | symbol,
  receiver: any
) => any;

// Type for the proxy handler set trap
type ProxySetHandler<T> = (
  target: ObservableState<T>,
  property: string | symbol,
  value: any,
  receiver: any
) => boolean;

// Type for the proxy handler deleteProperty trap
type ProxyDeleteHandler<T> = (
  target: ObservableState<T>,
  property: string | symbol
) => boolean;

// Interface for ObservableProxy - represents the proxy instance
interface IObservableProxy<T> extends ObservableState<T> {
  // Inherit all ObservableState methods and properties
  // The proxy will delegate to these or to the underlying value
}

/**
 * ObservableProxy class that creates a proxy wrapper around ObservableState
 * to enable direct property access and modification with reactive updates.
 * 
 * @template T The type of the observable value
 */
class ObservableProxy<T = any> {
  constructor(observable: ObservableState<T>) {
    if (!(observable instanceof ObservableState)) {
      throw new TypeError(
        "Expected observable to be an instance of ObservableState"
      );
    }

    const conversionMethods: ConversionMethods<T> = {
      valueOf(): T {
        return observable.value;
      },
      toString(): string {
        return String(observable.value);
      },
      toJSON(): T {
        return observable.value;
      },
      [Symbol.toPrimitive](hint: 'number' | 'string' | 'default'): T | string | number {
        if (hint === 'number') {
          return Number(observable.value);
        }
        if (hint === 'string') {
          return String(observable.value);
        }
        return observable.value;
      }
    };

    const proxyGetHandler: ProxyGetHandler<T> = (
      target: ObservableState<T>,
      property: string | symbol,
      receiver: any
    ): any => {
      // Handle conversion methods first
      if (property === 'valueOf' ||
          property === 'toString' ||
          property === 'toJSON' ||
          property === Symbol.toPrimitive) {
        return conversionMethods[property as keyof ConversionMethods<T>];
      }

      // Inline property type check for better performance
      let propertyType: PropertyType;
      const propKey = property as keyof ObservableState<T>;
      
      if (typeof target[propKey] === "function") {
        propertyType = "targetFunction";
      } else if (property in target) {
        propertyType = "targetProperty";
      } else if (target.value && typeof (target.value as any)[property] === "function") {
        propertyType = "valueFunction";
      } else {
        propertyType = "valueProperty";
      }

      switch (propertyType) {
        case "targetFunction":
          return (target[propKey] as Function).bind(target);
        case "targetProperty":
          return _deepClone(target[propKey]);
        case "valueFunction":
          return (...args: any[]) => (target.value as any)[property](...args);
        case "valueProperty":
          return _deepClone((target.value as any)[property]);
        default:
          console.warn(`Unexpected property type: ${propertyType}`);
          return undefined;
      }
    };

    const proxySetHandler: ProxySetHandler<T> = (
      target: ObservableState<T>,
      property: string | symbol,
      value: any,
      receiver: any
    ): boolean => {
      const propKey = property as keyof ObservableState<T>;
      
      if (property in target) {
        // Check if the value is actually different before updating
        if (typeof target[propKey] === 'object' && target[propKey] !== null && 
            typeof value === 'object' && value !== null) {
          // Deep equality check for objects
          if (_deepEqual(target[propKey], value)) {
            return true; // Skip update if they're equal
          }
        } else if (target[propKey] === value) {
          return true; // Skip update if primitive values are equal
        }
        
        (target as any)[property] = value;
      } else {
        // For properties on target.value
        const oldValue = (target.value as any)[property];
        
        // Check if the value is actually different before updating
        if (typeof oldValue === 'object' && oldValue !== null && 
            typeof value === 'object' && value !== null) {
          // Deep equality check for objects
          if (_deepEqual(oldValue, value)) {
            return true; // Skip update if they're equal
          }
        } else if (oldValue === value) {
          return true; // Skip update if primitive values are equal
        }
        
        (target.value as any)[property] = value;
      }
      
      target.update(() => target.value);
      return true;
    };

    const proxyDeleteHandler: ProxyDeleteHandler<T> = (
      target: ObservableState<T>,
      property: string | symbol
    ): boolean => {
      if (property in (target.value as any)) {
        delete (target.value as any)[property];
        target.update(() => target.value);
        return true;
      }
      return false;
    };

    return new Proxy(observable, {
      get: proxyGetHandler,
      set: proxySetHandler,
      deleteProperty: proxyDeleteHandler,
      ownKeys: (target: ObservableState<T>): ArrayLike<string | symbol> => {
        return Reflect.ownKeys(target.value as object);
      },
      has: (target: ObservableState<T>, property: string | symbol): boolean => {
        return property in (target.value as any) || property in target;
      },
      defineProperty: (
        target: ObservableState<T>,
        property: string | symbol,
        descriptor: PropertyDescriptor
      ): boolean => {
        if (property in target) {
          return Reflect.defineProperty(target, property, descriptor);
        } else {
          const result = Reflect.defineProperty(target.value as object, property, descriptor);
          if (result) {
            target.update(() => target.value);
          }
          return result;
        }
      },
      getOwnPropertyDescriptor: (
        target: ObservableState<T>,
        property: string | symbol
      ): PropertyDescriptor | undefined => {
        if (property in target) {
          return Reflect.getOwnPropertyDescriptor(target, property);
        }
        return Reflect.getOwnPropertyDescriptor(target.value as object, property);
      }
    }) as IObservableProxy<T>;
  }
}

// Export types for external use
export type {
  IObservableProxy,
  ConversionMethods,
  PropertyType,
  ProxyGetHandler,
  ProxySetHandler,
  ProxyDeleteHandler
};

export { ObservableProxy };