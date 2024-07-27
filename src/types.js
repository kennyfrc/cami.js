const Type = {
  String: 'string',
  Number: 'number',
  Boolean: 'boolean',
  BigInt: 'bigint',
  Symbol: 'symbol',
  Undefined: 'undefined',
  Null: 'object',

  Object: (schema) => ({ type: 'object', schema }),
  Array: (itemType) => ({ type: 'array', itemType }),
  Function: 'function',

  Sum: (...types) => ({ type: 'sum', types }),

  Product: (fields) => ({ type: 'product', fields }),

  Exponential: (inputType, outputType) => ({ type: 'exponential', inputType, outputType }),

  Any: { type: 'any' },
  Enum: (...values) => ({ type: 'enum', values }),
  Optional: (type) => ({ type: 'optional', optional: type }),
  Nullable: (type) => ({ type: 'nullable', nullable: type }),

  Refinement: (baseType, refinementFn) => ({ type: 'refinement', baseType, refinementFn }),
  Dependent: (baseType, dependencyFn) => ({ type: 'dependent', baseType, dependencyFn }),

  Map: (keyType, valueType) => ({ type: 'map', keyType, valueType }),
  Set: (itemType) => ({ type: 'set', itemType }),

  Date: { type: 'date' },
  RegExp: { type: 'regexp' },
};

const useValidationThunk = (schema) => {
  const typeValidators = {
    string: (value, type, path) => {
      if (typeof value !== type) throw new Error(`Expected ${type}, got ${typeof value} at ${path.join('.')}`);
    },
    object: (value, type, path, fullState, validateType) => {
      if (typeof value !== 'object' || value === null) throw new Error(`Expected object, got ${typeof value} at ${path.join('.')}`);
      Object.entries(type.schema).forEach(([key, subType]) => {
        if (!(key in value)) throw new Error(`Missing required property ${key} at ${path.join('.')}`);
        validateType(value[key], subType, [...path, key], fullState);
      });
    },
    array: (value, type, path, fullState, validateType) => {
      if (!Array.isArray(value)) throw new Error(`Expected array, got ${typeof value} at ${path.join('.')}`);
      value.forEach((item, index) => {
        try {
          validateType(item, type.itemType, [...path, index], fullState);
        } catch (error) {
          throw new Error(`Invalid item at index ${index}: ${error.message}`);
        }
      });
    },
    any: () => {},
    enum: (value, type, path) => {
      if (!type.values.includes(value)) throw new Error(`Expected one of ${type.values.join(', ')}, got ${value} at ${path.join('.')}`);
    },
    sum: (value, type, path, fullState, validateType) => {
      const errors = [];
      if (!type.types.some(subType => {
        try {
          validateType(value, subType, path, fullState);
          return true;
        } catch (e) {
          errors.push(e.message);
          return false;
        }
      })) {
        throw new Error(`Sum type validation failed at ${path.join('.')}. Errors: ${errors.join('; ')}`);
      }
    },
    product: (value, type, path, fullState, validateType) => {
      if (typeof value !== 'object' || value === null) throw new Error(`Expected object, got ${typeof value} at ${path.join('.')}`);
      Object.entries(type.fields).forEach(([key, subType]) => {
        if (!(key in value)) throw new Error(`Missing required property ${key} at ${path.join('.')}`);
        validateType(value[key], subType, [...path, key], fullState);
      });
    },
    exponential: (value, type, path) => {
      if (typeof value !== 'function') throw new Error(`Expected function, got ${typeof value} at ${path.join('.')}`);
    },
    optional: (value, type, path, fullState, validateType) => {
      if (value !== undefined) validateType(value, type.optional, path, fullState);
    },
    nullable: (value, type, path, fullState, validateType) => {
      if (value !== null) validateType(value, type.nullable, path, fullState);
    },
    refinement: (value, type, path, fullState, validateType) => {
      validateType(value, type.baseType, path, fullState);
      if (!type.refinementFn(value)) throw new Error(`Refinement check failed at ${path.join('.')}`);
    },
    dependent: (value, type, path, fullState, validateType) => {
      validateType(value, type.baseType, path, fullState);
      type.dependencyFn(value, fullState);
    },
    map: (value, type, path, fullState, validateType) => {
      if (!(value instanceof Map)) throw new Error(`Expected Map, got ${typeof value} at ${path.join('.')}`);
      value.forEach((val, key) => {
        validateType(key, type.keyType, [...path, 'key'], fullState);
        validateType(val, type.valueType, [...path, 'value'], fullState);
      });
    },
    set: (value, type, path, fullState, validateType) => {
      if (!(value instanceof Set)) throw new Error(`Expected Set, got ${typeof value} at ${path.join('.')}`);
      value.forEach(item => validateType(item, type.itemType, [...path, 'item'], fullState));
    },
    date: (value, type, path) => {
      if (!(value instanceof Date)) throw new Error(`Expected Date, got ${typeof value} at ${path.join('.')}`);
    },
    regexp: (value, type, path) => {
      if (!(value instanceof RegExp)) throw new Error(`Expected RegExp, got ${typeof value} at ${path.join('.')}`);
    },
    number: (value, type, path) => {
      if (typeof value !== 'number') throw new Error(`Expected number, got ${typeof value} at ${path.join('.')}`);
    },
  };

  return ({ state }) => {
    const validateType = (value, type, path = [], fullState) => {
      if (value === undefined && type.type !== 'optional') {
        throw new Error(`Missing required property at ${path.join('.')}`);
      }

      const validator = typeof type === 'string' ? typeValidators[type] : typeValidators[type.type];
      if (validator) {
        validator(value, type, path, fullState, validateType);
      }
    };

    Object.entries(schema).forEach(([key, type]) => {
      if (!(key in state)) {
        throw new Error(`Missing required property ${key} in state`);
      }
      validateType(state[key], type, [key], state);
    });
  };
};

export { Type, useValidationThunk };
