// Conditional Buffer type declaration for environments that have it
declare global {
  var Buffer:
    | {
        isBuffer(obj: any): obj is Buffer
        from(source: any): Buffer
      }
    | undefined
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
const objectKeys = Object.keys
const hasOwnProperty = Object.prototype.hasOwnProperty

// Observable internal property lookup object (faster than if-else chain)
// These properties should be skipped during comparison for performance
const INTERNAL_PROPS: { [key: string]: boolean } = {
  __observers: true,
  __onChange: true,
  __routes: true,
  __resourceLoaders: true,
  __activeRoute: true,
  __navigationState: true,
  __persistentParams: true,
  __beforeNavigateHooks: true,
  __afterNavigateHooks: true,
  _state: true,
  _frozenState: true,
  _isDirty: true,
  _stateVersion: true,
  _stateTrapStore: true,
  _uid: true,
  constructor: true,
  toJSON: true,
}

type TypedArrayView = Exclude<ArrayBufferView, DataView> & {
  length: number
  [index: number]: unknown
}

const isTypedArrayView = (value: unknown): value is TypedArrayView =>
  ArrayBuffer.isView(value) && !(value instanceof DataView)

const _deepEqual = (a: any, b: any): boolean => {
  // 1. Strict equality check (fastest path)
  if (a === b) return true

  // 2. NaN handling (sameValueZero semantics)
  // a !== a is the fastest NaN check (~40% faster than Number.isNaN in microbenchmarks)
  if (a !== a) return b !== b // a is NaN, so b must also be NaN

  // 3. Null/undefined and primitive check
  // Get types once for reuse
  const typeA = typeof a
  const typeB = typeof b

  // If either is primitive or null, and they're not === (checked above), they're not equal
  if (typeA !== 'object' || a == null || typeB !== 'object' || b == null) return false

  // 4. Constructor check for type safety and fast pathing
  // This also handles cases like a.constructor !== b.constructor implicitly
  const ctor = a.constructor
  if (ctor !== b.constructor) return false

  // --- Type-specific comparisons in order of frequency in typical JS apps ---

  // Most common: Plain objects (inlined for maximum speed)
  // Check for Object constructor first as it's the most common in data structures
  if (ctor === Object) {
    // High-perf: get keys once and compare lengths early
    const aKeys = objectKeys(a)
    const aLength = aKeys.length
    if (objectKeys(b).length !== aLength) return false

    // High-perf: decrementing while loop (2-3x faster than for-of in V8)
    let i = aLength
    while (i--) {
      const key = aKeys[i]

      // Skip Cami internal props (fast object lookup)
      if (INTERNAL_PROPS[key]) continue

      // Check existence AND value in one go for better cache locality
      if (!hasOwnProperty.call(b, key) || !_deepEqual(a[key], b[key])) {
        return false
      }
    }
    return true
  }

  // Second most common: Arrays (inlined)
  if (ctor === Array) {
    const len = a.length
    if (b.length !== len) return false

    // High-perf: decrementing loop with local variable access
    let i = len
    while (i--) {
      if (!_deepEqual(a[i], b[i])) return false
    }
    return true
  }

  // Third: TypedArrays (common in binary data, graphics)
  // Check constructor equality above ensures b is same TypedArray type
  if (isTypedArrayView(a) && isTypedArrayView(b)) {
    const len = a.length
    if (b.length !== len) return false

    // For TypedArrays, direct element access is faster than buffer comparison
    // as it avoids creating new TypedArray views
    let i = len
    while (i--) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  // Fourth: Date objects (common in state management)
  if (ctor === Date) {
    // getTime() is the fastest way to compare dates
    return a.getTime() === b.getTime()
  }

  // Fifth: Maps (optimized O(n) for primitive keys)
  if (ctor === Map) {
    const mapA = a as Map<unknown, unknown>
    const mapB = b as Map<unknown, unknown>
    const sizeA = mapA.size
    if (sizeA !== mapB.size) return false
    if (sizeA === 0) return true

    // Optimization: If keys are likely primitives (strings, numbers), use direct lookup
    // This is O(n) instead of O(n²) for the primitive case
    const aEntries: [unknown, unknown][] = Array.from(mapA)
    for (let i = 0; i < aEntries.length; i++) {
      const [key, val] = aEntries[i]

      // Try fast path for primitive keys
      // TypeScript ensures a instanceof Map, so b.has is safe
      if ((typeof key === 'string' || typeof key === 'number') && mapB.has(key)) {
        if (!_deepEqual(val, mapB.get(key))) return false
      } else {
        // Fallback for object keys - needs O(n) search
        // This is the slow path, but object keys in Maps are rare
        let found = false
        for (const [bKey, bVal] of mapB) {
          if (_deepEqual(key, bKey)) {
            if (!_deepEqual(val, bVal)) return false
            found = true
            break
          }
        }
        if (!found) return false
      }
    }
    return true
  }

  // Sixth: Sets (optimized O(n) for primitive values)
  if (ctor === Set) {
    const sizeA = a.size
    if (sizeA !== b.size) return false
    if (sizeA === 0) return true

    // Optimization: For Sets with primitives, we can use a two-pass approach
    // First pass: create a lookup for primitives, fallback to O(n²) for objects

    // Check for any object values - if none, we can use O(n) algorithm
    const aArray = Array.from(a)
    const hasObjectValues = aArray.some(val => val !== null && typeof val === 'object')

    if (!hasObjectValues) {
      // Fast O(n) path for primitive-only sets
      const bSet = new Set(b)
      for (let i = 0; i < aArray.length; i++) {
        if (!bSet.has(aArray[i])) return false
      }
      return true
    }

    // Slow O(n²) path for sets containing objects
    // This is necessary because object equality requires deep comparison
    const bArray = Array.from(b)
    const matched = new Array(bArray.length).fill(false)

    for (let i = 0; i < aArray.length; i++) {
      let found = false
      for (let j = 0; j < bArray.length; j++) {
        if (!matched[j] && _deepEqual(aArray[i], bArray[j])) {
          matched[j] = true
          found = true
          break
        }
      }
      if (!found) return false
    }
    return true
  }

  // Seventh: RegExp objects
  if (ctor === RegExp) {
    // Compare source and flags - equivalent to .toString() but faster
    return a.source === b.source && a.flags === b.flags
  }

  // Eighth: Function comparison (rare in data structures, but handle it)
  // Functions are compared by reference only, not by code/content
  if (ctor === Function) {
    return a === b // Already checked === above, so this will be false for different function instances
  }

  // Fallback: Generic object comparison
  // This handles custom class instances, objects with exotic prototypes, etc.
  const aKeys = objectKeys(a)
  const aLength = aKeys.length
  if (objectKeys(b).length !== aLength) return false

  // Use decrementing loop for better V8 optimization
  let i = aLength
  while (i--) {
    const key = aKeys[i]

    // Skip Cami internal props (fast object lookup)
    if (INTERNAL_PROPS[key]) continue

    // hasOwnProperty check ensures we don't compare inherited properties
    if (!hasOwnProperty.call(b, key) || !_deepEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}

// All helper functions removed - logic inlined for maximum performance

/**
 * Deep equality implementation WITH circular reference support.
 * Use this when you need to handle circular references safely.
 */
const _deepEqualCircular = (a: any, b: any, visited?: Set<any>): boolean => {
  // Quick reference check (handles primitives and identical objects)
  if (a === b) return true

  // Handle NaN equality (sameValueZero semantics)
  if (a !== a) return b !== b

  // Handle null/undefined - at this point we know they're not ===
  if (a == null || b == null) return false

  // Both must be objects at this point
  if (typeof a !== 'object' || typeof b !== 'object') return false

  // Initialize visited Set for circular reference detection
  if (!visited) visited = new Set()

  // Check for circular references
  if (visited.has(a) || visited.has(b)) {
    return true // Assume equal for circular structures
  }

  // Mark objects as visited
  visited.add(a)
  visited.add(b)

  // Fast path for arrays - most common use case after primitives
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      visited.delete(a)
      visited.delete(b)
      return false
    }

    // Use decrementing while loop for better performance
    let index = a.length
    while (index-- > 0) {
      if (!_deepEqualCircular(a[index], b[index], visited)) {
        visited.delete(a)
        visited.delete(b)
        return false
      }
    }
    visited.delete(a)
    visited.delete(b)
    return true
  }

  // If only one is an array, they're not equal
  if (Array.isArray(b)) {
    visited.delete(a)
    visited.delete(b)
    return false
  }

  // Date comparison - convert to primitive for speed
  if (a instanceof Date) {
    const result = b instanceof Date && a.getTime() === b.getTime()
    visited.delete(a)
    visited.delete(b)
    return result
  }

  // RegExp comparison - compare properties directly
  if (a instanceof RegExp) {
    const result = b instanceof RegExp && a.source === b.source && a.flags === b.flags
    visited.delete(a)
    visited.delete(b)
    return result
  }

  // Map comparison
  if (a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) {
      visited.delete(a)
      visited.delete(b)
      return false
    }

    for (const [key, val] of a.entries()) {
      // Maps require a lookup and then a deep comparison
      if (!b.has(key) || !_deepEqualCircular(val, b.get(key), visited)) {
        visited.delete(a)
        visited.delete(b)
        return false
      }
    }
    visited.delete(a)
    visited.delete(b)
    return true
  }

  // Optimized Set comparison
  if (a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) {
      visited.delete(a)
      visited.delete(b)
      return false
    }

    // If both sets are empty, they're equal
    if (a.size === 0) {
      visited.delete(a)
      visited.delete(b)
      return true
    }

    // For primitive values, we can use a more efficient approach
    const aValues = Array.from(a)
    const bValues = Array.from(b)

    // Track which values in b have been matched
    const matched = new Array(bValues.length).fill(false)

    for (let i = 0; i < aValues.length; i++) {
      let found = false
      for (let j = 0; j < bValues.length; j++) {
        if (!matched[j] && _deepEqualCircular(aValues[i], bValues[j], visited)) {
          matched[j] = true
          found = true
          break
        }
      }
      if (!found) {
        visited.delete(a)
        visited.delete(b)
        return false
      }
    }
    visited.delete(a)
    visited.delete(b)
    return true
  }

  // TypedArray comparison (Int8Array, Uint8Array, etc.)
  if (ArrayBuffer.isView(a) && !(a instanceof DataView)) {
    const typedA = a as Uint8Array
    const typedB = b as Uint8Array
    if (
      !ArrayBuffer.isView(b) ||
      typedA.length !== typedB.length ||
      a.constructor !== b.constructor
    ) {
      visited.delete(a)
      visited.delete(b)
      return false
    }

    // Fast direct comparison of TypedArray values using decrementing loop
    let index = typedA.length
    while (index-- > 0) {
      if (typedA[index] !== typedB[index]) {
        visited.delete(a)
        visited.delete(b)
        return false
      }
    }
    visited.delete(a)
    visited.delete(b)
    return true
  }

  // Different constructors mean different types
  if (a.constructor !== b.constructor) {
    visited.delete(a)
    visited.delete(b)
    return false
  }

  // Get keys and compare lengths - this quickly detects differences
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) {
    visited.delete(a)
    visited.delete(b)
    return false
  }

  // Use direct property access and single iteration for maximum speed
  const hasOwn = Object.prototype.hasOwnProperty

  // Check key/value pairs using decrementing loop
  let index = keys.length
  while (index-- > 0) {
    const key = keys[index]

    // First check if property exists, then compare values
    if (!hasOwn.call(b, key) || !_deepEqualCircular(a[key], b[key], visited)) {
      visited.delete(a)
      visited.delete(b)
      return false
    }
  }

  visited.delete(a)
  visited.delete(b)
  return true
}

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
  const seen = new WeakMap()

  function merge(target: any, source: any): any {
    // Handle base cases - fast exit for primitives
    if (source === undefined) return target
    if (source === null) return null
    if (typeof source !== 'object') return source

    // Handle null or non-object target
    if (target === null || typeof target !== 'object') {
      // Fast path for arrays
      if (Array.isArray(source)) {
        const length = source.length
        const result = new Array(length)
        for (let i = 0; i < length; i++) {
          const item = source[i]
          result[i] = item === null || typeof item !== 'object' ? item : merge(undefined, item)
        }
        return result
      }

      // Fast path for objects with direct construction
      return source.constructor === Object ? { ...source } : _deepClone(source)
    }

    // Check for circular references
    if (seen.has(source)) {
      return seen.get(source)
    }

    // Handle arrays directly - overwrite completely for simplicity
    if (Array.isArray(source)) {
      const length = source.length
      const result = new Array(length)
      seen.set(source, result)

      for (let i = 0; i < length; i++) {
        const item = source[i]
        result[i] = item === null || typeof item !== 'object' ? item : merge(undefined, item)
      }
      return result
    }

    // Handle Map objects
    if (source instanceof Map) {
      const result = new Map(target instanceof Map ? target : undefined)
      seen.set(source, result)

      for (const [key, val] of source.entries()) {
        const keyClone = key === null || typeof key !== 'object' ? key : merge(undefined, key)

        const targetValue = target instanceof Map ? target.get(key) : undefined
        const valueClone = val === null || typeof val !== 'object' ? val : merge(targetValue, val)

        result.set(keyClone, valueClone)
      }
      return result
    }

    // Handle Set objects
    if (source instanceof Set) {
      const result = new Set(target instanceof Set ? target : undefined)
      seen.set(source, result)

      for (const item of source) {
        result.add(item === null || typeof item !== 'object' ? item : merge(undefined, item))
      }
      return result
    }

    // Handle special objects with constructor check (faster than instanceof)
    if (source.constructor !== Object) {
      if (source instanceof Date) return new Date(source.getTime())
      if (source instanceof RegExp) return new RegExp(source.source, source.flags)

      // TypedArrays and Buffers
      if (ArrayBuffer.isView(source) && !(source instanceof DataView)) {
        if (typeof Buffer !== 'undefined' && Buffer?.isBuffer?.(source)) {
          return Buffer.from(source)
        }

        return new (source.constructor as any)(
          source.buffer.slice(0),
          (source as any).byteOffset,
          (source as any).length
        )
      }

      // For other special objects, just clone them
      return _deepClone(source)
    }

    // Regular object case - start with target properties
    // Use Object.create for better performance than spread
    const result = Object.create(Object.getPrototypeOf(target))

    // Copy properties from target - direct property access is faster
    const targetKeys = Object.keys(target)
    let i = targetKeys.length
    while (i--) {
      const key = targetKeys[i]
      result[key] = target[key]
    }

    // Track for circular references
    seen.set(source, result)

    // Fast in-place merge of source properties
    // Use for-in instead of Object.keys for faster iteration
    for (const key in source) {
      // Only process own properties, not inherited ones
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue

      // Skip __proto__ and constructor for security
      if (key === '__proto__' || key === 'constructor') continue

      const sourceValue = source[key]

      // Skip undefined values
      if (sourceValue === undefined) continue

      // Fast path for primitive values
      if (sourceValue === null || typeof sourceValue !== 'object') {
        result[key] = sourceValue
        continue
      }

      // Handle special objects with fast instanceof checks
      if (sourceValue instanceof Date) {
        result[key] = new Date(sourceValue.getTime())
        continue
      }

      if (sourceValue instanceof RegExp) {
        result[key] = new RegExp(sourceValue.source, sourceValue.flags)
        continue
      }

      // Handle nested objects with recursive merge
      const targetValue = target[key]

      // Recursive merge only if both are objects (not arrays or null)
      if (
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue) &&
        sourceValue.constructor === Object
      ) {
        result[key] = merge(targetValue, sourceValue)
      } else {
        // Otherwise create a new nested object/array/etc.
        result[key] = merge(undefined, sourceValue)
      }
    }

    return result
  }

  return merge(target, source)
}

/**
 * @function _deepClone
 * @param value - The value to clone.
 * @param cache - Internal cache for circular references.
 * @returns A deep clone of the input value.
 * @description Creates a deep clone of the provided value. This function is optimized for performance and handles various types including objects, arrays, dates, regex, Maps, Sets, and TypedArrays.
 */
const _deepClone = (value: any, cache: WeakMap<object, any> = new WeakMap()): any => {
  // Handle primitives and null (most common case)
  // Original implementation to avoid Immer issues
  if (value === null || typeof value !== 'object') return value

  // Check cache for circular references
  if (cache.has(value)) return cache.get(value)

  // Handle arrays (most common non-primitive)
  if (Array.isArray(value)) {
    const length = value.length
    const result = new Array(length)
    cache.set(value, result)

    for (let i = 0; i < length; i++) {
      const item = value[i]
      result[i] = item === null || typeof item !== 'object' ? item : _deepClone(item, cache)
    }
    return result
  }

  // Handle TypedArrays and Buffers
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    if (typeof Buffer !== 'undefined' && Buffer?.isBuffer?.(value)) {
      return Buffer.from(value)
    }

    return new (value.constructor as any)(
      value.buffer.slice(0),
      (value as any).byteOffset,
      (value as any).length
    )
  }

  // Handle Date objects
  if (value instanceof Date) {
    return new Date(value.getTime())
  }

  // Handle Set objects
  if (value instanceof Set) {
    const result = new Set()
    cache.set(value, result)

    for (const item of value) {
      result.add(item === null || typeof item !== 'object' ? item : _deepClone(item, cache))
    }
    return result
  }

  // Handle Map objects
  if (value instanceof Map) {
    const result = new Map()
    cache.set(value, result)

    for (const [key, val] of value.entries()) {
      const keyClone = key === null || typeof key !== 'object' ? key : _deepClone(key, cache)

      const valClone = val === null || typeof val !== 'object' ? val : _deepClone(val, cache)

      result.set(keyClone, valClone)
    }
    return result
  }

  // Handle RegExp objects
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags)
  }

  // Handle regular objects including their prototype
  // Use Object.create to preserve prototype chain (important for Immer)
  const proto = Object.getPrototypeOf(value)
  const result = Object.create(proto)
  cache.set(value, result)

  // Clone all enumerable own properties
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      const val = value[key]
      result[key] = val === null || typeof val !== 'object' ? val : _deepClone(val, cache)
    }
  }

  return result
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export { _deepEqual, _deepEqualCircular, _deepMerge, _deepClone, debounce }
