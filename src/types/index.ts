import { _deepClone, _deepMerge } from "../utils";
import { Model } from "../observables/observable-model.js";

// Type definitions for the type system
export type PrimitiveTypeName = 
  | "string" 
  | "float" 
  | "integer" 
  | "natural" 
  | "boolean" 
  | "bigint" 
  | "symbol" 
  | "null";

export interface ObjectType<T extends Record<string, any> = Record<string, any>> {
  type: "object";
  schema: T;
}

export interface ArrayType<T = any> {
  type: "array";
  itemType: TypeDefinition<T>;
  allowEmpty: boolean;
}

export interface SumType<T = any> {
  type: "sum";
  types: TypeDefinition<T>[];
}

export interface ProductType<T extends Record<string, any> = Record<string, any>> {
  type: "product";
  fields: T;
}

export interface AnyType {
  type: "any";
}

export interface EnumType<T = any> {
  type: "enum";
  values: T[];
}

export interface OptionalType<T = any> {
  type: "optional";
  optional: TypeDefinition<T>;
}

export interface RefinementType<T = any> {
  type: "refinement";
  baseType: TypeDefinition<T>;
  refinementFn: (value: T) => boolean;
}

export interface DependentPairType<F = any, S = any> {
  type: "dependentPair";
  fstType: TypeDefinition<F>;
  sndTypeFn: (fst: F) => TypeDefinition<S>;
}

export interface DependentRecordType<T extends Record<string, any> = Record<string, any>> {
  type: "dependentRecord";
  fields: T;
  validateFn?: (value: any, rootState: any) => boolean | string;
}

export interface DateType {
  type: "date";
}

export interface VectType<T = any> {
  type: "vect";
  length: number;
  elemType: TypeDefinition<T>;
}

export interface TreeType<T = any> {
  type: "tree";
  valueType: TypeDefinition<T>;
}

export interface RoseTreeType<T = any> {
  type: "roseTree";
  valueType: TypeDefinition<T>;
}

export interface LiteralType<T = any> {
  type: "literal";
  value: T;
}

export interface FunctionType<P extends any[] = any[], R = any> {
  type: "function";
  paramTypes: TypeDefinition<P>[];
  returnType: TypeDefinition<R>;
}

export interface VoidType {
  type: "void";
}

export interface DependentFunctionType<P extends any[] = any[], R = any> {
  type: "dependentFunction";
  paramTypes: TypeDefinition<P>[];
  returnTypeFn: (...params: P) => TypeDefinition<R>;
}

export interface DependentArrayType<T = any> {
  type: "dependentArray";
  lengthFn: (value: T[]) => number;
  itemTypeFn: (index: number, array: T[]) => TypeDefinition<T>;
}

export interface DependentSumType<T = any> {
  type: "dependentSum";
  discriminantFn: (value: T) => any;
  typesFn: (discriminant: any) => TypeDefinition<T>[];
}

export interface ReferenceType {
  type: "reference";
  modelName: string;
}

export type ComplexType<T = any> = 
  | ObjectType<T extends Record<string, any> ? T : Record<string, any>>
  | ArrayType<T>
  | SumType<T>
  | ProductType<T extends Record<string, any> ? T : Record<string, any>>
  | AnyType
  | EnumType<T>
  | OptionalType<T>
  | RefinementType<T>
  | DependentPairType
  | DependentRecordType<T extends Record<string, any> ? T : Record<string, any>>
  | DateType
  | VectType<T>
  | TreeType<T>
  | RoseTreeType<T>
  | LiteralType<T>
  | FunctionType
  | VoidType
  | DependentFunctionType
  | DependentArrayType<T>
  | DependentSumType<T>
  | ReferenceType;

export type TypeDefinition<T = any> = PrimitiveTypeName | ComplexType<T> | Model;

// Type inference helpers
type InferPrimitive<T extends PrimitiveTypeName> = 
  T extends "string" ? string :
  T extends "float" | "integer" | "natural" ? number :
  T extends "boolean" ? boolean :
  T extends "bigint" ? bigint :
  T extends "symbol" ? symbol :
  T extends "null" ? null :
  never;

type InferType<T extends TypeDefinition> = 
  T extends PrimitiveTypeName ? InferPrimitive<T> :
  T extends ObjectType<infer S> ? { [K in keyof S]: InferType<S[K]> } :
  T extends ArrayType<infer E> ? E extends TypeDefinition ? InferType<E>[] : any[] :
  T extends SumType<infer U> ? U extends TypeDefinition ? InferType<U> : any :
  T extends ProductType<infer F> ? { [K in keyof F]: F[K] extends TypeDefinition ? InferType<F[K]> : any } :
  T extends AnyType ? any :
  T extends EnumType<infer V> ? V :
  T extends OptionalType<infer O> ? O extends TypeDefinition ? InferType<O> | undefined | null : any :
  T extends RefinementType<infer R> ? R extends TypeDefinition ? InferType<R> : any :
  T extends DependentPairType<infer F, infer S> ? F extends TypeDefinition ? [InferType<F>, S] : [any, S] :
  T extends DateType ? Date :
  T extends VectType<infer E> ? E extends TypeDefinition ? InferType<E>[] : any[] :
  T extends TreeType<infer V> ? V extends TypeDefinition ? TreeNode<InferType<V>> : TreeNode<any> :
  T extends RoseTreeType<infer V> ? V extends TypeDefinition ? RoseTreeNode<InferType<V>> : RoseTreeNode<any> :
  T extends LiteralType<infer L> ? L :
  T extends FunctionType<infer P, infer R> ? (...args: P) => R :
  T extends VoidType ? void :
  T extends ReferenceType ? number :
  T extends Model ? any :
  any;

// Tree structures
interface TreeNode<T> {
  value: T;
  left?: TreeNode<T>;
  right?: TreeNode<T>;
}

interface RoseTreeNode<T> {
  value: T;
  children: RoseTreeNode<T>[];
}

// Type constructors
const Type = {
  String: "string" as const,
  Float: "float" as const,
  Number: "float" as const,
  Integer: "integer" as const,
  Natural: "natural" as const,
  Boolean: "boolean" as const,
  BigInt: "bigint" as const,
  Symbol: "symbol" as const,
  Null: "null" as const,
  Object: <T extends Record<string, TypeDefinition>>(schema: T): ObjectType<T> => ({ 
    type: "object", 
    schema 
  }),
  Array: <T>(itemType: TypeDefinition<T>, options: { allowEmpty?: boolean } = {}): ArrayType<T> => ({
    type: "array",
    itemType,
    allowEmpty: options.allowEmpty !== false, // Default to true
  }),
  Sum: <T>(...types: TypeDefinition<T>[]): SumType<T> => ({ 
    type: "sum", 
    types 
  }),
  Product: <T extends Record<string, TypeDefinition>>(fields: T): ProductType<T> => ({ 
    type: "product", 
    fields 
  }),
  Any: { type: "any" } as AnyType,
  Enum: <T>(...values: T[]): EnumType<T> => ({ 
    type: "enum", 
    values 
  }),
  Optional: <T>(type: TypeDefinition<T>): OptionalType<T> => ({ 
    type: "optional", 
    optional: type 
  }),
  Refinement: <T>(baseType: TypeDefinition<T>, refinementFn: (value: T) => boolean): RefinementType<T> => ({
    type: "refinement",
    baseType,
    refinementFn,
  }),
  DependentPair: <F, S>(
    fstType: TypeDefinition<F>, 
    sndTypeFn: (fst: F) => TypeDefinition<S>
  ): DependentPairType<F, S> => ({
    type: "dependentPair",
    fstType,
    sndTypeFn,
  }),
  DependentRecord: <T extends Record<string, TypeDefinition>>(
    fields: T, 
    validateFn?: (value: any, rootState: any) => boolean | string
  ): DependentRecordType<T> => ({
    type: "dependentRecord",
    fields,
    validateFn,
  }),
  Date: { type: "date" } as DateType,
  Vect: <T>(length: number, elemType: TypeDefinition<T>): VectType<T> => ({ 
    type: "vect", 
    length, 
    elemType 
  }),
  Tree: <T>(valueType: TypeDefinition<T>): TreeType<T> => ({ 
    type: "tree", 
    valueType 
  }),
  RoseTree: <T>(valueType: TypeDefinition<T>): RoseTreeType<T> => ({ 
    type: "roseTree", 
    valueType 
  }),
  Literal: <T>(value: T): LiteralType<T> => ({ 
    type: "literal", 
    value 
  }),
  Function: <P extends any[], R>(
    paramTypes: TypeDefinition<P>[], 
    returnType: TypeDefinition<R>
  ): FunctionType<P, R> => ({
    type: "function",
    paramTypes,
    returnType,
  }),
  Void: { type: "void" } as VoidType,
  DependentFunction: <P extends any[], R>(
    paramTypes: TypeDefinition<P>[], 
    returnTypeFn: (...params: P) => TypeDefinition<R>
  ): DependentFunctionType<P, R> => ({
    type: "dependentFunction",
    paramTypes,
    returnTypeFn,
  }),
  DependentArray: <T>(
    lengthFn: (value: T[]) => number, 
    itemTypeFn: (index: number, array: T[]) => TypeDefinition<T>
  ): DependentArrayType<T> => ({
    type: "dependentArray",
    lengthFn,
    itemTypeFn,
  }),
  DependentSum: <T>(
    discriminantFn: (value: T) => any, 
    typesFn: (discriminant: any) => TypeDefinition<T>[]
  ): DependentSumType<T> => ({
    type: "dependentSum",
    discriminantFn,
    typesFn,
  }),
  Model: (name: string, properties: Record<string, TypeDefinition>) => new Model({ name, properties }),
  Reference: (modelName: string): ReferenceType => ({
    type: "reference",
    modelName,
  }),
};

// Validator function type
type ValidatorFn = (
  value: any, 
  type: any, 
  path: string[], 
  rootState?: any, 
  validateType?: ValidateTypeFn
) => any;

type ValidateTypeFn = (
  value: any,
  type: TypeDefinition,
  path: string[],
  rootState: any,
  currentKey?: string
) => any;

// Type validators
const typeValidators: Record<string, ValidatorFn> = {
  string: (value, type, path) => {
    if (typeof value !== type)
      throw new Error(
        `Expected ${type}, got ${typeof value} at ${path.join(".")}`
      );
  },
  object: (value, type: ObjectType, path, rootState, validateType) => {
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
      validateType!(value[key], subType, [...path, key], rootState);
    });
  },
  array: (value, type: ArrayType, path, rootState, validateType) => {
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
        if ((type.itemType as any).type === "optional") {
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
          (type.itemType as any).type === "optional"
            ? (type.itemType as OptionalType).optional
            : type.itemType;
        validateType!(item, itemTypeToValidate, [...path, String(index)], rootState);
      } catch (error: any) {
        throw new Error(`Invalid item at index ${index}: ${error.message}`);
      }
    });
  },
  any: () => {},
  enum: (value, type: EnumType, path) => {
    if (!type.values.includes(value))
      throw new Error(
        `Expected one of ${type.values.join(", ")}, got ${value} at ${path.join(
          "."
        )}`
      );
  },
  sum: (value, type: SumType, path, rootState, validateType) => {
    const errors: string[] = [];
    if (
      !type.types.some((subType) => {
        try {
          validateType!(value, subType, path, rootState);
          return true;
        } catch (e: any) {
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
  product: (value, type: ProductType, path, rootState, validateType) => {
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
    const mergedValue = _deepMerge(_deepMerge({}, existingObject), value);

    // Validate each field defined in the Product type
    Object.entries(type.fields).forEach(([key, fieldType]) => {
      if (key in mergedValue) {
        // Validate the field
        validateType!(mergedValue[key], fieldType, [...path, key], rootState, key);
      }
    });

    // Update the rootState with the merged value
    let currentObj: any = rootState;
    for (let i = 0; i < path.length - 1; i++) {
      if (currentObj[path[i]] === undefined) {
        currentObj[path[i]] = {};
      }
      currentObj = currentObj[path[i]];
    }
    currentObj[path[path.length - 1]] = mergedValue;

    return mergedValue;
  },
  optional: (value, type: OptionalType, path, rootState, validateType) => {
    if (value === undefined || value === null) {
      return null;
    }
    return validateType!(value, type.optional, path, rootState);
  },
  null: (value, _type, path) => {
    if (value !== null)
      throw new Error(
        `Expected null, got ${typeof value} at ${path.join(".")}`
      );
  },
  refinement: (value, type: RefinementType, path, rootState, validateType) => {
    validateType!(value, type.baseType, path, rootState);
    if (!type.refinementFn(value)) {
      throw new Error(`Refinement predicate failed at ${path.join(".")}`);
    }
  },
  dependentPair: (value, type: DependentPairType, path, rootState, validateType) => {
    if (!Array.isArray(value) || value.length !== 2) {
      throw new Error(`Expected dependent pair at ${path.join(".")}`);
    }
    validateType!(value[0], type.fstType, [...path, "0"], rootState);
    const sndType = type.sndTypeFn(value[0]);
    validateType!(value[1], sndType, [...path, "1"], rootState);
  },
  date: (value, _type, path) => {
    if (!(value instanceof Date))
      throw new Error(
        `Expected Date, got ${typeof value} at ${path.join(".")}`
      );
  },
  float: (value, _type, path) => {
    if (typeof value !== "number") {
      throw new Error(
        `Expected float, got ${typeof value} at ${path.join(".")}`
      );
    }
    if (Number.isNaN(value)) {
      throw new Error(`Expected float, got NaN at ${path.join(".")}`);
    }
  },
  integer: (value, _type, path) => {
    if (!Number.isInteger(value)) {
      throw new Error(
        `Expected integer, got ${
          typeof value === "number" ? "float" : typeof value
        } at ${path.join(".")}`
      );
    }
  },
  natural: (value, _type, path) => {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(
        `Expected natural number, got ${value} at ${path.join(".")}`
      );
    }
  },
  vect: (value, type: VectType, path, rootState, validateType) => {
    if (!Array.isArray(value) || value.length !== type.length) {
      throw new Error(
        `Expected Vect of length ${type.length}, got ${
          value.length
        } at ${path.join(".")}`
      );
    }
    value.forEach((item, index) => {
      validateType!(item, type.elemType, [...path, String(index)], rootState);
    });
  },
  tree: (value, type: TreeType, path, rootState, validateType) => {
    if (typeof value !== "object" || value === null)
      throw new Error(
        `Expected tree, got ${typeof value} at ${path.join(".")}`
      );
    if (!("value" in value))
      throw new Error(
        `Invalid tree structure: missing 'value' at ${path.join(".")}`
      );
    validateType!(value.value, type.valueType, [...path, "value"], rootState);
    if ("left" in value)
      validateType!(value.left, type, [...path, "left"], rootState);
    if ("right" in value)
      validateType!(value.right, type, [...path, "right"], rootState);
  },
  roseTree: (value, type: RoseTreeType, path, rootState, validateType) => {
    if (typeof value !== "object" || value === null)
      throw new Error(
        `Expected rose tree, got ${typeof value} at ${path.join(".")}`
      );
    if (!("value" in value) || !("children" in value))
      throw new Error(`Invalid rose tree structure at ${path.join(".")}`);
    validateType!(value.value, type.valueType, [...path, "value"], rootState);
    if (!Array.isArray(value.children))
      throw new Error(
        `Expected array of children, got ${typeof value.children} at ${path.join(
          "."
        )}.children`
      );
    value.children.forEach((child: any, index: number) => {
      validateType!(child, type, [...path, "children", String(index)], rootState);
    });
  },
  dependentRecord: (value, type: DependentRecordType, path, rootState, validateType) => {
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

      validateType!(value[key], resolvedType, [...path, key], rootState);
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
  dependentFunction: (value, _type, path) => {
    if (typeof value !== "function") {
      throw new Error(
        `Expected function, got ${typeof value} at ${path.join(".")}`
      );
    }
  },
  dependentArray: (value, type: DependentArrayType, path, rootState, validateType) => {
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
      validateType!(item, itemType, [...path, String(index)], rootState);
    });
  },
  dependentSum: (value, type: DependentSumType, path, rootState, validateType) => {
    const discriminant = type.discriminantFn(value);
    const possibleTypes = type.typesFn(discriminant);
    const errors: string[] = [];

    for (const subType of possibleTypes) {
      try {
        validateType!(value, subType, path, rootState);
        break;
      } catch (e: any) {
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
  literal: (value, type: LiteralType, path) => {
    if (value !== type.value) {
      throw new Error(
        `Expected ${type.value}, got ${value} at ${path.join(".")}`
      );
    }
  },
  boolean: (value, _type, path) => {
    if (typeof value !== "boolean")
      throw new Error(
        `Expected boolean, got ${typeof value} at ${path.join(".")}`
      );
  },
  bigint: (value, _type, path) => {
    if (typeof value !== "bigint")
      throw new Error(
        `Expected bigint, got ${typeof value} at ${path.join(".")}`
      );
  },
  symbol: (value, _type, path) => {
    if (typeof value !== "symbol")
      throw new Error(
        `Expected symbol, got ${typeof value} at ${path.join(".")}`
      );
  },
  function: (value, _type, path) => {
    if (typeof value !== "function") {
      throw new Error(
        `Expected function, got ${typeof value} at ${path.join(".")}`
      );
    }
  },
  void: () => {
    // No validation needed for void type
  },
  reference: (value, _type, path, _rootState, _validateType) => {
    if (typeof value !== "number") {
      throw new Error(
        `Expected reference ID (number), got ${typeof value} at ${path.join(
          "."
        )}`
      );
    }
    // We don't validate the actual referenced object here, as it might not be loaded yet
  },

  model: (value, type: Model, path, rootState, validateType) => {
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
      validateType!(value[key], fieldType as TypeDefinition, [...path, key], rootState, key);
    });
  },
};

const validateType: ValidateTypeFn = (
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
  if (typeof type === "object" && type !== null && "type" in type && type.type === "optional") {
    if (value === undefined || value === null) {
      return; // Optional field is allowed to be undefined or null
    }
    return validateType(value, (type as OptionalType).optional, path, rootState, currentKey);
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
  const validator = typeValidators[(type as ComplexType).type];
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

const useValidationHook = (schema: Record<string, TypeDefinition> | DependentRecordType) => {
  return (state: any) => {
    const clonedState = _deepClone(state);
    if (typeof schema === "object" && "type" in schema && schema.type === "dependentRecord") {
      validateType(clonedState, schema as TypeDefinition, [], clonedState);
    } else {
      Object.entries(schema).forEach(([key, type]) => {
        validateType(clonedState[key], type as TypeDefinition, [key], clonedState);
      });
    }
  };
};

const useValidationThunk = (schema: ProductType | ComplexType) => {
  return (state: any) => {
    const clonedState = _deepClone(state);
    if (typeof schema === "object" && "type" in schema && schema.type === "product") {
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
export type { InferType };