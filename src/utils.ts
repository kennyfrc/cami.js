// Conditional Buffer type declaration for environments that have it
declare global {
  var Buffer: {
    isBuffer(obj: any): obj is Buffer;
    from(source: any): Buffer;
  } | undefined;
}

/**
 * High-performance deep equality implementation WITHOUT circular reference support.
 * Optimized for maximum performance in reactivity libraries where circular references are rare.
 * 
 * Key features:
 * - Fast-equals inspired optimizations
 * - Type detection ordered by commonality
 * - No circular reference detection for maximum speed
 * - React property optimizations
 * 
 * @function _deepEqual
 * @param a - First value to compare.
 * @param b - Second value to compare.
 * @returns True if the values are deeply equal, false otherwise.
 * @warning Does not handle circular references - will cause stack overflow
 */

// Cache frequently used functions at module level (fast-equals pattern)
const objectKeys = Object.keys;
const arrayIsArray = Array.isArray;
const hasOwnProperty = Object.prototype.hasOwnProperty;

// Observable internal property lookup object (faster than if-else chain)
// These properties should be skipped during comparison for performance
const INTERNAL_PROPS = {
  '__observers': true,
  '__onChange': true,
  '__routes': true,
  '__resourceLoaders': true,
  '__activeRoute': true,
  '__navigationState': true,
  '__persistentParams': true,
  '__beforeNavigateHooks': true,
  '__afterNavigateHooks': true,
  '_state': true,
  '_frozenState': true,
  '_isDirty': true,
  '_stateVersion': true,
  '_stateTrapStore': true,
  '_uid': true,
  'constructor': true,
  'toJSON': true
};

// Helper function to check if an object is a string record (all values are strings)
const isStringRecord = (obj: any): boolean => {
  if (typeof obj !== 'object' || obj === null) return false;
  const keys = objectKeys(obj);
  let i = keys.length;
  while (i--) {
    if (typeof obj[keys[i]] !== 'string') return false;
  }
  return true;
};

// Fast comparison for string record objects
const compareStringRecords = (a: Record<string, string>, b: Record<string, string>): boolean => {
  const aKeys = objectKeys(a);
  const aLength = aKeys.length;
  
  if (objectKeys(b).length !== aLength) return false;
  
  let i = aLength;
  while (i--) {
    const key = aKeys[i];
    if (a[key] !== b[key]) return false;
  }
  
  return true;
};

const _deepEqual = (a: any, b: any): boolean => {
  // 1. Strict equality check (fastest path)
  if (a === b) return true;
  
  // 2. Early type check
  const typeA = typeof a;
  if (typeA !== typeof b) return false;
  
  // 3. Handle primitives with NaN support
  if (typeA !== 'object') {
    // Handle NaN equality (sameValueZero semantics)
    return typeA === 'number' ? (a !== a && b !== b) : false;
  }
  
  // 4. Handle null/undefined
  if (a == null || b == null) return false;
  
  // 5. Constructor checks ordered by commonality (high-perf: if-else chain)
  const constructor = a.constructor;
  
  // Most common case first: Plain objects (inlined for performance)
  if (constructor === Object && b.constructor === Object) {
    // Fast path for URLState-like objects (very common in our codebase)
    if (a.params && a.hashPaths && a.hashParams && 
        b.params && b.hashPaths && b.hashParams) {
      // Optimized comparison for URL state objects
      return _deepEqual(a.params, b.params) &&
             _deepEqual(a.hashPaths, b.hashPaths) &&
             _deepEqual(a.hashParams, b.hashParams) &&
             _deepEqual(a.routeParams, b.routeParams);
    }
    
    // Fast path for small dependency objects (store + property)
    if (a.store && typeof a.property === 'string' &&
        b.store && typeof b.property === 'string' &&
        Object.keys(a).length === 2 && Object.keys(b).length === 2) {
      return a.store === b.store && a.property === b.property;
    }
    
    // Fast path for string record objects (params, hashParams)
    if (isStringRecord(a) && isStringRecord(b)) {
      return compareStringRecords(a, b);
    }
    
    // Inlined object comparison (eliminates function call overhead)
    const aKeys = objectKeys(a);
    const aLength = aKeys.length;
    
    if (objectKeys(b).length !== aLength) return false;
    
    // High-perf: while loop counting down (7x faster than forEach)
    let i = aLength;
    while (i--) {
      const key = aKeys[i];
      
      // High-perf: object lookup for internal props (3x faster than Map)
      // Skip Observable internal props
      if (INTERNAL_PROPS[key]) {
        continue;
      }
      
      if (!hasOwnProperty.call(b, key) || !_deepEqual(a[key], b[key])) {
        return false;
      }
    }
    
    return true;
  }
  
  // Second most common: Arrays (inlined for performance)
  if (arrayIsArray(a)) {
    if (!arrayIsArray(b) || a.length !== b.length) return false;
    
    // High-perf: while loop counting down
    let i = a.length;
    while (i--) {
      if (!_deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  if (arrayIsArray(b)) return false;
  
  // Constructor equality check
  if (constructor !== b.constructor) return false;
  
  // Third: Date objects (inlined)
  if (constructor === Date) {
    return a.getTime() === b.getTime();
  }
  
  // Fourth: RegExp (inlined)
  if (constructor === RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }
  
  // Fifth: TypedArrays (inlined for performance)
  // High-perf: direct constructor check instead of string operations
  if (constructor === Int8Array || constructor === Uint8Array || 
      constructor === Int16Array || constructor === Uint16Array ||
      constructor === Int32Array || constructor === Uint32Array ||
      constructor === Float32Array || constructor === Float64Array ||
      constructor === BigInt64Array || constructor === BigUint64Array) {
    
    if (a.length !== b.length) return false;
    
    // High-perf: while loop counting down
    let i = a.length;
    while (i--) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  
  // Sixth: Map comparison (inlined)
  if (constructor === Map) {
    if (a.size !== b.size) return false;
    if (a.size === 0) return true;
    
    // High-perf: for-of loop (better than iterator pattern)
    for (const [key, val] of a) {
      let found = false;
      for (const [bKey, bVal] of b) {
        if (_deepEqual(key, bKey)) {
          if (!_deepEqual(val, bVal)) return false;
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }
  
  // Seventh: Set comparison (inlined with pre-sized arrays)
  if (constructor === Set) {
    if (a.size !== b.size) return false;
    if (a.size === 0) return true;
    
    // High-perf: pre-size arrays (4.2ms vs 9.5ms for array literal)
    const aSize = a.size;
    const aValues = new Array(aSize);
    const bValues = new Array(aSize);
    const matched = new Array(aSize);
    
    // Fill arrays using while loop (faster than Array.from)
    let idx = 0;
    for (const val of a) {
      aValues[idx++] = val;
    }
    
    idx = 0;
    for (const val of b) {
      bValues[idx] = val;
      matched[idx] = false;
      idx++;
    }
    
    // High-perf: while loop counting down
    let aIndex = aSize;
    while (aIndex--) {
      let found = false;
      let bIndex = aSize;
      while (bIndex--) {
        if (!matched[bIndex] && _deepEqual(aValues[aIndex], bValues[bIndex])) {
          matched[bIndex] = true;
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }
  
  // Fallback: treat as object (inlined)
  const aKeys = objectKeys(a);
  const aLength = aKeys.length;
  
  if (objectKeys(b).length !== aLength) return false;
  
  // High-perf: while loop counting down
  let i = aLength;
  while (i--) {
    const key = aKeys[i];
    
    // High-perf: object lookup for internal props
    // Skip Observable internal props
    if (INTERNAL_PROPS[key]) {
      continue;
    }
    
    if (!hasOwnProperty.call(b, key) || !_deepEqual(a[key], b[key])) {
      return false;
    }
  }
  
  return true;
};

// All helper functions removed - logic inlined for maximum performance

/**
 * Deep equality implementation WITH circular reference support.
 * Use this when you need to handle circular references safely.
 */
const _deepEqualCircular = (a: any, b: any, visited?: Set<any>): boolean => {
  // Quick reference check (handles primitives and identical objects)
  if (a === b) return true;
  
  // Handle NaN equality (sameValueZero semantics)
  if (a !== a) return b !== b;
  
  // Handle null/undefined - at this point we know they're not ===
  if (a == null || b == null) return false;
  
  // Both must be objects at this point
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  // Initialize visited Set for circular reference detection
  if (!visited) visited = new Set();
  
  // Check for circular references
  if (visited.has(a) || visited.has(b)) {
    return true; // Assume equal for circular structures
  }
  
  // Mark objects as visited
  visited.add(a);
  visited.add(b);

  // Fast path for arrays - most common use case after primitives
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      visited.delete(a);
      visited.delete(b);
      return false;
    }
    
    // Use decrementing while loop for better performance
    let index = a.length;
    while (index-- > 0) {
      if (!_deepEqualCircular(a[index], b[index], visited)) {
        visited.delete(a);
        visited.delete(b);
        return false;
      }
    }
    visited.delete(a);
    visited.delete(b);
    return true;
  }
  
  // If only one is an array, they're not equal
  if (Array.isArray(b)) {
    visited.delete(a);
    visited.delete(b);
    return false;
  }
  
  // Date comparison - convert to primitive for speed
  if (a instanceof Date) {
    const result = b instanceof Date && a.getTime() === b.getTime();
    visited.delete(a);
    visited.delete(b);
    return result;
  }
  
  // RegExp comparison - compare properties directly
  if (a instanceof RegExp) {
    const result = b instanceof RegExp && a.source === b.source && a.flags === b.flags;
    visited.delete(a);
    visited.delete(b);
    return result;
  }
  
  // Map comparison
  if (a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) {
      visited.delete(a);
      visited.delete(b);
      return false;
    }
    
    for (const [key, val] of a.entries()) {
      // Maps require a lookup and then a deep comparison
      if (!b.has(key) || !_deepEqualCircular(val, b.get(key), visited)) {
        visited.delete(a);
        visited.delete(b);
        return false;
      }
    }
    visited.delete(a);
    visited.delete(b);
    return true;
  }
  
  // Optimized Set comparison
  if (a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) {
      visited.delete(a);
      visited.delete(b);
      return false;
    }
    
    // If both sets are empty, they're equal
    if (a.size === 0) {
      visited.delete(a);
      visited.delete(b);
      return true;
    }
    
    // For primitive values, we can use a more efficient approach
    const aValues = Array.from(a);
    const bValues = Array.from(b);
    
    // Track which values in b have been matched
    const matched = new Array(bValues.length).fill(false);
    
    for (let i = 0; i < aValues.length; i++) {
      let found = false;
      for (let j = 0; j < bValues.length; j++) {
        if (!matched[j] && _deepEqualCircular(aValues[i], bValues[j], visited)) {
          matched[j] = true;
          found = true;
          break;
        }
      }
      if (!found) {
        visited.delete(a);
        visited.delete(b);
        return false;
      }
    }
    visited.delete(a);
    visited.delete(b);
    return true;
  }
  
  // TypedArray comparison (Int8Array, Uint8Array, etc.)
  if (ArrayBuffer.isView(a) && !(a instanceof DataView)) {
    const typedA = a as Uint8Array;
    const typedB = b as Uint8Array;
    if (!ArrayBuffer.isView(b) || typedA.length !== typedB.length || a.constructor !== b.constructor) {
      visited.delete(a);
      visited.delete(b);
      return false;
    }
    
    // Fast direct comparison of TypedArray values using decrementing loop
    let index = typedA.length;
    while (index-- > 0) {
      if (typedA[index] !== typedB[index]) {
        visited.delete(a);
        visited.delete(b);
        return false;
      }
    }
    visited.delete(a);
    visited.delete(b);
    return true;
  }
  
  // Different constructors mean different types
  if (a.constructor !== b.constructor) {
    visited.delete(a);
    visited.delete(b);
    return false;
  }
  
  // Get keys and compare lengths - this quickly detects differences
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    visited.delete(a);
    visited.delete(b);
    return false;
  }
  
  // Use direct property access and single iteration for maximum speed
  const hasOwn = Object.prototype.hasOwnProperty;
  
  // Check key/value pairs using decrementing loop
  let index = keys.length;
  while (index-- > 0) {
    const key = keys[index];
    
    // First check if property exists, then compare values
    if (!hasOwn.call(b, key) || !_deepEqualCircular(a[key], b[key], visited)) {
      visited.delete(a);
      visited.delete(b);
      return false;
    }
  }
  
  visited.delete(a);
  visited.delete(b);
  return true;
};

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
const _deepMerge = (target: any, source: any): any => {
  // Use WeakMap for circular reference detection
  const seen = new WeakMap();
  
  function merge(target: any, source: any): any {
    // Handle base cases - fast exit for primitives
    if (source === undefined) return target;
    if (source === null) return null;
    if (typeof source !== 'object') return source;
    
    // Handle null or non-object target
    if (target === null || typeof target !== 'object') {
      // Fast path for arrays
      if (Array.isArray(source)) {
        const length = source.length;
        const result = new Array(length);
        for (let i = 0; i < length; i++) {
          const item = source[i];
          result[i] = (item === null || typeof item !== 'object') 
            ? item 
            : merge(undefined, item);
        }
        return result;
      }
      
      // Fast path for objects with direct construction
      return source.constructor === Object 
        ? { ...source } 
        : _deepClone(source);
    }
    
    // Check for circular references
    if (seen.has(source)) {
      return seen.get(source);
    }
    
    // Handle arrays directly - overwrite completely for simplicity
    if (Array.isArray(source)) {
      const length = source.length;
      const result = new Array(length);
      seen.set(source, result);
      
      for (let i = 0; i < length; i++) {
        const item = source[i];
        result[i] = (item === null || typeof item !== 'object') 
          ? item 
          : merge(undefined, item);
      }
      return result;
    }
    
    // Handle Map objects
    if (source instanceof Map) {
      const result = new Map(target instanceof Map ? target : undefined);
      seen.set(source, result);
      
      for (const [key, val] of source.entries()) {
        const keyClone = (key === null || typeof key !== 'object')
          ? key
          : merge(undefined, key);
          
        const targetValue = target instanceof Map ? target.get(key) : undefined;
        const valueClone = (val === null || typeof val !== 'object')
          ? val
          : merge(targetValue, val);
          
        result.set(keyClone, valueClone);
      }
      return result;
    }
    
    // Handle Set objects
    if (source instanceof Set) {
      const result = new Set(target instanceof Set ? target : undefined);
      seen.set(source, result);
      
      for (const item of source) {
        result.add((item === null || typeof item !== 'object')
          ? item
          : merge(undefined, item));
      }
      return result;
    }
    
    // Handle special objects with constructor check (faster than instanceof)
    if (source.constructor !== Object) {
      if (source instanceof Date) return new Date(source.getTime());
      if (source instanceof RegExp) return new RegExp(source.source, source.flags);
      
      // TypedArrays and Buffers
      if (ArrayBuffer.isView(source) && !(source instanceof DataView)) {
        if (typeof Buffer !== 'undefined' && Buffer?.isBuffer?.(source)) {
          return Buffer.from(source);
        }
        
        return new (source.constructor as any)(
          source.buffer.slice(0), 
          (source as any).byteOffset, 
          (source as any).length
        );
      }
      
      // For other special objects, just clone them
      return _deepClone(source);
    }
    
    // Regular object case - start with target properties
    // Use Object.create for better performance than spread
    const result = Object.create(Object.getPrototypeOf(target));
    
    // Copy properties from target - direct property access is faster
    const targetKeys = Object.keys(target);
    let i = targetKeys.length;
    while (i--) {
      const key = targetKeys[i];
      result[key] = target[key];
    }
    
    // Track for circular references
    seen.set(source, result);
    
    // Fast in-place merge of source properties
    // Use for-in instead of Object.keys for faster iteration
    for (const key in source) {
      // Only process own properties, not inherited ones
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      
      // Skip __proto__ and constructor for security
      if (key === '__proto__' || key === 'constructor') continue;
      
      const sourceValue = source[key];
      
      // Skip undefined values
      if (sourceValue === undefined) continue;
      
      // Fast path for primitive values
      if (sourceValue === null || typeof sourceValue !== 'object') {
        result[key] = sourceValue;
        continue;
      }
      
      // Handle special objects with fast instanceof checks
      if (sourceValue instanceof Date) {
        result[key] = new Date(sourceValue.getTime());
        continue;
      }
      
      if (sourceValue instanceof RegExp) {
        result[key] = new RegExp(sourceValue.source, sourceValue.flags);
        continue;
      }
      
      // Handle nested objects with recursive merge
      const targetValue = target[key];
      
      // Recursive merge only if both are objects (not arrays or null)
      if (targetValue !== null && 
          typeof targetValue === 'object' && 
          !Array.isArray(targetValue) && 
          sourceValue.constructor === Object) {
        result[key] = merge(targetValue, sourceValue);
      } else {
        // Otherwise create a new nested object/array/etc.
        result[key] = merge(undefined, sourceValue);
      }
    }
    
    return result;
  }
  
  return merge(target, source);
};

/**
 * @function _deepClone
 * @param value - The value to clone.
 * @param cache - Internal cache for circular references.
 * @returns A deep clone of the input value.
 * @description Creates a deep clone of the provided value. This function is optimized for performance and handles various types including objects, arrays, dates, regex, Maps, Sets, and TypedArrays.
 */
const _deepClone = (value: any, cache: WeakMap<object, any> = new WeakMap()): any => {
  // Direct return primitives (most common case)
  if (value === null || typeof value !== "object") return value;
  
  // Check cache for circular references
  if (cache.has(value)) return cache.get(value);
  
  // Handle special types - optimize for common cases in order of likelihood
  
  // Arrays - create with exact length and use direct indexing
  if (Array.isArray(value)) {
    const length = value.length;
    const result = new Array(length);
    
    // Cache immediately to handle circular refs
    cache.set(value, result);
    
    for (let i = 0; i < length; i++) {
      const item = value[i];
      // Fast path for primitives
      result[i] = (item === null || typeof item !== 'object') 
        ? item 
        : _deepClone(item, cache);
    }
    return result;
  }
  
  // Date objects - very common in data handling
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  
  // RegExp objects - no need to check properties
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }
  
  // TypedArrays and Buffers (optimized path)
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    // For Buffer in Node.js
    if (typeof Buffer !== 'undefined' && Buffer?.isBuffer?.(value)) {
      return Buffer.from(value);
    }
    
    // For typed arrays (Int8Array, Float32Array, etc.)
    return new (value.constructor as any)(
      value.buffer.slice(0), 
      (value as any).byteOffset, 
      (value as any).length
    );
  }
  
  // Set objects - less common but important for some use cases
  if (value instanceof Set) {
    const result = new Set();
    cache.set(value, result);
    
    // Micro-optimization: avoid using forEach
    for (const item of value) {
      // Fast path for primitives
      result.add((item === null || typeof item !== 'object')
        ? item
        : _deepClone(item, cache));
    }
    return result;
  }
  
  // Map objects - less common but important for some use cases
  if (value instanceof Map) {
    const result = new Map();
    cache.set(value, result);
    
    // Micro-optimization: avoid using forEach
    for (const [key, val] of value.entries()) {
      // Fast path for primitive keys/values
      const keyClone = (key === null || typeof key !== 'object')
        ? key
        : _deepClone(key, cache);
        
      const valClone = (val === null || typeof val !== 'object')
        ? val
        : _deepClone(val, cache);
        
      result.set(keyClone, valClone);
    }
    return result;
  }
  
  // Handle regular objects including their prototype
  const proto = Object.getPrototypeOf(value);
  const result = Object.create(proto);
  
  // Cache immediately to handle circular refs
  cache.set(value, result);
  
  // Get all enumerable own properties
  // Use for-in instead of Object.keys() + iteration for slight performance gain
  // This avoids an extra array allocation and iteration
  for (const key in value) {
    // Only clone own properties, not inherited ones, and exclude symbols
    if (typeof key !== 'symbol' && Object.prototype.hasOwnProperty.call(value, key)) {
      const val = value[key];
      
      // Fast path for primitives
      result[key] = (val === null || typeof val !== 'object')
        ? val
        : _deepClone(val, cache);
    }
  }
  
  return result;
};

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export { _deepEqual, _deepEqualCircular, _deepMerge, _deepClone, debounce };