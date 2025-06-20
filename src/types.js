<<<<<<< HEAD
import { _deepClone, _deepMerge } from "./utils.js";
=======
import { _deepClone, _deepMerge } from "./utils";
>>>>>>> session/vitest
import { Model } from "./observables/observable-model.js";

const Type = {
  String: "string",
  Float: "float",
  Number: "float",
  Integer: "integer",
  Natural: "natural",
  Boolean: "boolean",
  BigInt: "bigint",
  Symbol: "symbol",
  Null: "null",
  Object: (schema) => ({ type: "object", schema }),
  Array: (itemType, options = {}) => ({
    type: "array",
    itemType,
    allowEmpty: options.allowEmpty !== false, // Default to true
  }),
  Sum: (...types) => ({ type: "sum", types }),
  Product: (fields) => ({ type: "product", fields }),
  Any: { type: "any" },
  Enum: (...values) => ({ type: "enum", values }),
  Optional: (type) => ({ type: "optional", optional: type }),
  Refinement: (baseType, refinementFn) => ({
    type: "refinement",
    baseType,
    refinementFn,
  }),
  DependentPair: (fstType, sndTypeFn) => ({
    type: "dependentPair",
    fstType,
    sndTypeFn,
  }),
  DependentRecord: (fields, validateFn) => ({
    type: "dependentRecord",
    fields,
    validateFn,
  }),
  Date: { type: "date" },
  Vect: (length, elemType) => ({ type: "vect", length, elemType }),
  Tree: (valueType) => ({ type: "tree", valueType }),
  RoseTree: (valueType) => ({ type: "roseTree", valueType }),
  Literal: (value) => ({ type: "literal", value }),
  Function: (paramTypes, returnType) => ({
    type: "function",
    paramTypes,
    returnType,
  }),
  Void: { type: "void" },
  DependentFunction: (paramTypes, returnTypeFn) => ({
    type: "dependentFunction",
    paramTypes,
    returnTypeFn,
  }),
  DependentArray: (lengthFn, itemTypeFn) => ({
    type: "dependentArray",
    lengthFn,
    itemTypeFn,
  }),
  DependentSum: (discriminantFn, typesFn) => ({
    type: "dependentSum",
    discriminantFn,
    typesFn,
  }),
<<<<<<< HEAD
  Model: (name, properties) => new Model(name, properties),
=======
  Model: (name, properties) => new Model({ name: name, properties: properties }),
>>>>>>> session/vitest
  Reference: (modelName) => ({
    type: "reference",
    modelName,
  }),
};

const typeValidators = {
  string: (value, type, path) => {
    if (typeof value !== type)
      throw new Error(
        `Expected ${type}, got ${typeof value} at ${path.join(".")}`
      );
  },
  object: (value, type, path, rootState, validateType) => {
    if (typeof value !== "object" || value === null)
      throw new Error(
        `Expected object, got ${
          value === null ? "null" : typeof value
        } at ${path.join(".")}`
      );
    Object.entries(type.schema).forEach(([key, subType]) => {
      if (!(key in value))
        throw new Error(
          `Missing required property ${key} at ${path.join(".")}`
        );
      validateType(value[key], subType, [...path, key], rootState);
    });
  },
  array: (value, type, path, rootState, validateType) => {
    if (!Array.isArray(value)) {
      throw new Error(
        `Expected array, got ${typeof value} at ${path.join(".")}`
      );
    }

    // If the array is empty, it's valid
    if (value.length === 0) {
      return;
    }

    value.forEach((item, index) => {
      if (item === undefined || item === null) {
        // If the item type is optional, this is valid
        if (type.itemType.type === "optional") {
          return;
        }
        throw new Error(
          `Unexpected ${
            item === null ? "null" : "undefined"
          } value at index ${index} at ${path.join(".")}`
        );
      }

      try {
        const itemTypeToValidate =
          type.itemType.type === "optional"
            ? type.itemType.optional
            : type.itemType;
        validateType(item, itemTypeToValidate, [...path, index], rootState);
      } catch (error) {
        throw new Error(`Invalid item at index ${index}: ${error.message}`);
      }
    });
  },
  any: () => {},
  enum: (value, type, path) => {
    if (!type.values.includes(value))
      throw new Error(
        `Expected one of ${type.values.join(", ")}, got ${value} at ${path.join(
          "."
        )}`
      );
  },
  sum: (value, type, path, rootState, validateType) => {
    const errors = [];
    if (
      !type.types.some((subType) => {
        try {
          validateType(value, subType, path, rootState);
          return true;
        } catch (e) {
          errors.push(e.message);
          return false;
        }
      })
    ) {
      throw new Error(
        `Sum type validation failed at ${path.join(
          "."
        )}. Value: ${JSON.stringify(value)}. Errors: ${errors.join("; ")}`
      );
    }
  },
  product: (value, type, path, rootState, validateType) => {
    if (typeof value !== "object" || value === null) {
      throw new Error(
        `Expected object for Product type, got ${typeof value} at ${path.join(
          "."
        )}`
      );
    }

    // Get the existing object from the rootState
    let existingObject = path.reduce((obj, key) => obj[key], rootState);
    if (existingObject === undefined) {
      existingObject = {};
    }

    // Merge the new value with the existing object
    const mergedValue = _deepMerge({}, existingObject, value);

    // Validate each field defined in the Product type
    Object.entries(type.fields).forEach(([key, fieldType]) => {
      if (key in mergedValue) {
        // Validate the field
        validateType(mergedValue[key], fieldType, [...path, key], rootState, key);
      }
    });

    // Update the rootState with the merged value
    let currentObj = rootState;
    for (let i = 0; i < path.length - 1; i++) {
      if (currentObj[path[i]] === undefined) {
        currentObj[path[i]] = {};
      }
      currentObj = currentObj[path[i]];
    }
    currentObj[path[path.length - 1]] = mergedValue;

    return mergedValue;
  },
  optional: (value, type, path, rootState, validateType) => {
    if (value === undefined || value === null) {
      return null;
    }
    return validateType(value, type.optional, path, rootState);
  },
  null: (value, type, path) => {
    if (value !== null)
      throw new Error(
        `Expected null, got ${typeof value} at ${path.join(".")}`
      );
  },
  refinement: (value, type, path, rootState, validateType) => {
    validateType(value, type.baseType, path, rootState);
    if (!type.refinementFn(value)) {
      throw new Error(`Refinement predicate failed at ${path.join(".")}`);
    }
  },
  dependentPair: (value, type, path, rootState, validateType) => {
    if (!Array.isArray(value) || value.length !== 2) {
      throw new Error(`Expected dependent pair at ${path.join(".")}`);
    }
    validateType(value[0], type.fstType, [...path, 0], rootState);
    const sndType = type.sndTypeFn(value[0]);
    validateType(value[1], sndType, [...path, 1], rootState);
  },
  date: (value, type, path) => {
    if (!(value instanceof Date))
      throw new Error(
        `Expected Date, got ${typeof value} at ${path.join(".")}`
      );
  },
  float: (value, type, path) => {
    if (typeof value !== "number") {
      throw new Error(
        `Expected float, got ${typeof value} at ${path.join(".")}`
      );
    }
    if (Number.isNaN(value)) {
      throw new Error(`Expected float, got NaN at ${path.join(".")}`);
    }
  },
  integer: (value, type, path) => {
    if (!Number.isInteger(value)) {
      throw new Error(
        `Expected integer, got ${
          typeof value === "number" ? "float" : typeof value
        } at ${path.join(".")}`
      );
    }
  },
  natural: (value, type, path) => {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(
        `Expected natural number, got ${value} at ${path.join(".")}`
      );
    }
  },
  vect: (value, type, path, rootState, validateType) => {
    if (!Array.isArray(value) || value.length !== type.length) {
      throw new Error(
        `Expected Vect of length ${type.length}, got ${
          value.length
        } at ${path.join(".")}`
      );
    }
    value.forEach((item, index) => {
      validateType(item, type.elemType, [...path, index], rootState);
    });
  },
  tree: (value, type, path, rootState, validateType) => {
    if (typeof value !== "object" || value === null)
      throw new Error(
        `Expected tree, got ${typeof value} at ${path.join(".")}`
      );
    if (!("value" in value))
      throw new Error(
        `Invalid tree structure: missing 'value' at ${path.join(".")}`
      );
    validateType(value.value, type.valueType, [...path, "value"], rootState);
    if ("left" in value)
      validateType(value.left, type, [...path, "left"], rootState);
    if ("right" in value)
      validateType(value.right, type, [...path, "right"], rootState);
  },
  roseTree: (value, type, path, rootState, validateType) => {
    if (typeof value !== "object" || value === null)
      throw new Error(
        `Expected rose tree, got ${typeof value} at ${path.join(".")}`
      );
    if (!("value" in value) || !("children" in value))
      throw new Error(`Invalid rose tree structure at ${path.join(".")}`);
    validateType(value.value, type.valueType, [...path, "value"], rootState);
    if (!Array.isArray(value.children))
      throw new Error(
        `Expected array of children, got ${typeof value.children} at ${path.join(
          "."
        )}.children`
      );
    value.children.forEach((child, index) => {
      validateType(child, type, [...path, "children", index], rootState);
    });
  },
  dependentRecord: (value, type, path, rootState, validateType) => {
    if (typeof value !== "object" || value === null)
      throw new Error(
        `Expected object, got ${typeof value} at ${path.join(".")}`
      );

    Object.entries(type.fields).forEach(([key, fieldType]) => {
      if (!(key in value))
        throw new Error(
          `Missing required property ${key} at ${path.join(".")}`
        );

      const resolvedType =
        typeof fieldType === "function" ? fieldType(value) : fieldType;

      validateType(value[key], resolvedType, [...path, key], rootState);
    });

    if (typeof type.validateFn === "function") {
      const result = type.validateFn(value, rootState);
      if (result !== true) {
        throw new Error(
          `Validation failed for dependent record at ${path.join(
            "."
          )}: ${result}`
        );
      }
    }
  },
  dependentFunction: (value, type, path) => {
    if (typeof value !== "function") {
      throw new Error(
        `Expected function, got ${typeof value} at ${path.join(".")}`
      );
    }
  },
  dependentArray: (value, type, path, rootState, validateType) => {
    if (!Array.isArray(value)) {
      throw new Error(
        `Expected array, got ${typeof value} at ${path.join(".")}`
      );
    }
    const expectedLength = type.lengthFn(value);
    if (value.length !== expectedLength) {
      throw new Error(
        `Expected array of length ${expectedLength}, got ${
          value.length
        } at ${path.join(".")}`
      );
    }
    value.forEach((item, index) => {
      const itemType = type.itemTypeFn(index, value);
      validateType(item, itemType, [...path, index], rootState);
    });
  },
  dependentSum: (value, type, path, rootState, validateType) => {
    const discriminant = type.discriminantFn(value);
    const possibleTypes = type.typesFn(discriminant);
    const errors = [];

    for (const subType of possibleTypes) {
      try {
        validateType(value, subType, path, rootState);
        break;
      } catch (e) {
        errors.push(e.message);
      }
    }

    if (possibleTypes.length === errors.length) {
      throw new Error(
        `Dependent sum type validation failed at ${path.join(
          "."
        )}. Errors: ${errors.join("; ")}`
      );
    }
  },
  literal: (value, type, path) => {
    if (value !== type.value) {
      throw new Error(
        `Expected ${type.value}, got ${value} at ${path.join(".")}`
      );
    }
  },
  boolean: (value, type, path) => {
    if (typeof value !== "boolean")
      throw new Error(
        `Expected boolean, got ${typeof value} at ${path.join(".")}`
      );
  },
  bigint: (value, type, path) => {
    if (typeof value !== "bigint")
      throw new Error(
        `Expected bigint, got ${typeof value} at ${path.join(".")}`
      );
  },
  symbol: (value, type, path) => {
    if (typeof value !== "symbol")
      throw new Error(
        `Expected symbol, got ${typeof value} at ${path.join(".")}`
      );
  },
  function: (value, type, path) => {
    if (typeof value !== "function") {
      throw new Error(
        `Expected function, got ${typeof value} at ${path.join(".")}`
      );
    }
  },
  void: () => {
    // No validation needed for void type
  },
  reference: (value, type, path, rootState, validateType) => {
    if (typeof value !== "number") {
      throw new Error(
        `Expected reference ID (number), got ${typeof value} at ${path.join(
          "."
        )}`
      );
    }
    // We don't validate the actual referenced object here, as it might not be loaded yet
  },

  model: (value, type, path, rootState, validateType) => {
    if (typeof value !== "object" || value === null) {
      throw new Error(
        `Expected model object, got ${typeof value} at ${path.join(".")}`
      );
    }
    // Validate each field of the model
    Object.entries(type.schema).forEach(([key, fieldType]) => {
      if (!(key in value)) {
        throw new Error(
          `Missing required property ${key} in model at ${path.join(".")}`
        );
      }
      validateType(value[key], fieldType, [...path, key], rootState, key);
    });
  },
};

const validateType = (
  value,
  type,
  path = [],
  rootState = {},
  currentKey = ""
) => {
  if (type === undefined) {
    throw new Error(
      `Invalid type definition for key "${currentKey}" at ${path.join(".")}`
    );
  }

  // Handle optional types
  if (type.type === "optional") {
    if (value === undefined || value === null) {
      return; // Optional field is allowed to be undefined or null
    }
    return validateType(value, type.optional, path, rootState, currentKey);
  }

  // Check for undefined required fields
  if (value === undefined) {
    throw new Error(
      `Missing required property "${currentKey}" at ${path.join(".")}`
    );
  }

  // Handle null values
  if (value === null && type !== "null") {
    throw new Error(
      `Expected non-null value for "${currentKey}", got null at ${path.join(
        "."
      )}`
    );
  }

  // Handle Model instances
  if (type instanceof Model) {
    return typeValidators.model(value, type, path, rootState, (v, t, p, r, k) =>
      validateType(v, t, p, r, k)
    );
  }

  // Handle primitive types
  if (typeof type === "string") {
    const validator = typeValidators[type];
    if (validator) {
      return validator(value, type, path, rootState, (v, t, p, r, k) =>
        validateType(v, t, p, r, k)
      );
    } else {
      throw new Error(
        `Unknown primitive type ${type} for "${currentKey}" at ${path.join(
          "."
        )}`
      );
    }
  }

  // Handle complex types (including Product)
  const validator = typeValidators[type.type];
  if (validator) {
    return validator(value, type, path, rootState, (v, t, p, r, k) =>
      validateType(v, t, p, r, k)
    );
  } else {
    throw new Error(
      `Unknown type ${JSON.stringify(type)} for "${currentKey}" at ${path.join(
        "."
      )}`
    );
  }
};

const useValidationHook = (schema) => {
  return (state) => {
    const clonedState = _deepClone(state);
    if (schema.type === "dependentRecord") {
      validateType(clonedState, schema, [], clonedState);
    } else {
      Object.entries(schema).forEach(([key, type]) => {
        validateType(clonedState[key], type, [key], clonedState);
      });
    }
  };
};

const useValidationThunk = (schema) => {
  return (state) => {
    const clonedState = _deepClone(state);
    if (schema.type === "product") {
      try {
        validateType(clonedState, schema, [], clonedState, "root");
      } catch (error) {
        console.error("Validation error:", error);
        throw error;
      }
    } else {
      throw new Error("Root schema must be a Product type");
    }
  };
};

export { Type, useValidationThunk, useValidationHook, validateType };
