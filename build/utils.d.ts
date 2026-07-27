declare global {
    var Buffer: {
        isBuffer(obj: any): obj is Buffer;
        from(source: any): Buffer;
    } | undefined;
}
declare const _deepEqual: (a: any, b: any) => boolean;
/**
 * Deep equality implementation WITH circular reference support.
 * Use this when you need to handle circular references safely.
 */
declare const _deepEqualCircular: (a: any, b: any, visited?: Set<any>) => boolean;
/**
 * @private
 * @function _deepMerge
 * @param target - The target object to merge into.
 * @param source - The source object to merge from.
 * @returns The merged object.
 * @description Deeply merges two objects, giving priority to the source object's values.
 *              Handles circular references, special objects, and is optimized for performance.
 *              Supports Maps, Sets, and TypedArrays.
 */
declare const _deepMerge: (target: any, source: any) => any;
/**
 * @function _deepClone
 * @param value - The value to clone.
 * @param cache - Internal cache for circular references.
 * @returns A deep clone of the input value.
 * @description Creates a deep clone of the provided value. This function is optimized for performance and handles various types including objects, arrays, dates, regex, Maps, Sets, and TypedArrays.
 */
declare const _deepClone: (value: any, cache?: WeakMap<object, any>) => any;
declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
export { _deepEqual, _deepEqualCircular, _deepMerge, _deepClone, debounce };
//# sourceMappingURL=utils.d.ts.map