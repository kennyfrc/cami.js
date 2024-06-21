/**
 * @function _deepEqual
 * @param {Object|Array} obj1 - The first object or array to compare.
 * @param {Object|Array} obj2 - The second object or array to compare.
 * @returns {boolean} True if the objects or arrays are deeply equal, false otherwise.
 * @description Compares two objects or arrays for deep equality. This function checks if the two inputs are deeply equal by recursively comparing their properties or elements.
 */
const _deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        for (let i = 0; i < obj1.length; i++) {
            if (!_deepEqual(obj1[i], obj2[i])) {
                return false;
            }
        }
        return true;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!obj2.hasOwnProperty(key) || !_deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

/**
 * @private
 * @function _deepMerge
 * @param {Object} target - The target object to merge into.
 * @param {Object} source - The source object to merge from.
 * @returns {Object} The merged object.
 * @description Deeply merges two objects, giving priority to the source object's values. This is needed to prevent duplicate values.
 */
const _deepMerge = (target, source) => {
  if (typeof target !== 'object' || target === null) {
    return source;
  }

  if (typeof source !== 'object' || source === null) {
    return target;
  }

  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      // Replace the target array with the source array
      target[key] = sourceValue;
    } else if (typeof targetValue === 'object' && targetValue !== null && typeof sourceValue === 'object' && sourceValue !== null) {
      // When both values are objects, merge them recursively
      target[key] = _deepMerge({ ...targetValue }, sourceValue);
    } else {
      // If there's a conflict (or the key exists only in source), prioritize the source value
      target[key] = sourceValue;
    }
  });

  return target;
};

/**
 * @private
 * @function _deepClone
 * @param {*} value - The value to clone.
 * @returns {*} A deep clone of the input value.
 * @description Creates a deep clone of the provided value. This function is optimized for performance and handles various types including objects, arrays, dates, and primitive values.
 */
const _deepClone = (value) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    return value.map(_deepClone);
  }

  if (value instanceof Set) {
    return new Set([...value].map(_deepClone));
  }

  if (value instanceof Map) {
    return new Map([...value].map(([k, v]) => [_deepClone(k), _deepClone(v)]));
  }

  const clonedObj = Object.create(Object.getPrototypeOf(value));
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      clonedObj[key] = _deepClone(value[key]);
    }
  }

  return clonedObj;
};

export { _deepEqual, _deepMerge, _deepClone };
