import { ObservableState } from './observable-state';
type PropertyType = 'targetFunction' | 'targetProperty' | 'valueFunction' | 'valueProperty';
type ConversionMethods<T> = {
    valueOf(): T;
    toString(): string;
    toJSON(): T;
    [Symbol.toPrimitive](hint: 'number' | 'string' | 'default'): T | string | number;
};
type ProxyGetHandler<T> = (target: ObservableState<T>, property: string | symbol, receiver: any) => any;
type ProxySetHandler<T> = (target: ObservableState<T>, property: string | symbol, value: any, receiver: any) => boolean;
type ProxyDeleteHandler<T> = (target: ObservableState<T>, property: string | symbol) => boolean;
interface IObservableProxy<T> extends ObservableState<T> {
}
/**
 * ObservableProxy class that creates a proxy wrapper around ObservableState
 * to enable direct property access and modification with reactive updates.
 *
 * @template T The type of the observable value
 */
declare class ObservableProxy<T = any> {
    constructor(observable: ObservableState<T>);
}
export type { IObservableProxy, ConversionMethods, PropertyType, ProxyGetHandler, ProxySetHandler, ProxyDeleteHandler, };
export { ObservableProxy };
//# sourceMappingURL=observable-proxy.d.ts.map