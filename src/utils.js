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
 * @param {Object} obj - The object to clone.
 * @returns {Object} A deep clone of the input object.
 * @description Creates a deep clone of the provided object. This ensures that the reset functionality uses the correct initial state, preventing unintended mutations.
 */
const _deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export { _deepEqual, _deepMerge, _deepClone };
