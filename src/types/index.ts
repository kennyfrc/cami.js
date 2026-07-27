import { Model } from '../observables/observable-model.js'
import { _deepClone, _deepMerge } from '../utils'

// Type definitions for the type system
export type PrimitiveTypeName =
  | 'string'
  | 'float'
  | 'integer'
  | 'natural'
  | 'boolean'
  | 'bigint'
  | 'symbol'
  | 'null'

export interface ObjectType<T extends Record<string, any> = Record<string, any>> {
  type: 'object'
  schema: T
}

export interface ArrayType<T = any> {
  type: 'array'
  itemType: TypeDefinition<T>
  allowEmpty: boolean
}

export interface SumType<T = any> {
  type: 'sum'
  types: TypeDefinition<T>[]
}

export interface ProductType<T extends Record<string, any> = Record<string, any>> {
  type: 'product'
  fields: T
}

export interface AnyType {
  type: 'any'
}

export interface EnumType<T = any> {
  type: 'enum'
  values: T[]
}

export interface OptionalType<T = any> {
  type: 'optional'
  optional: TypeDefinition<T>
}

export interface RefinementType<T = any> {
  type: 'refinement'
  baseType: TypeDefinition<T>
  refinementFn: (value: T) => boolean
}

export interface DependentPairType<F = any, S = any> {
  type: 'dependentPair'
  fstType: TypeDefinition<F>
  sndTypeFn: (fst: F) => TypeDefinition<S>
}

export interface DependentRecordType<T extends Record<string, any> = Record<string, any>> {
  type: 'dependentRecord'
  fields: T
  validateFn?: (value: unknown, rootState: unknown) => boolean | string
}

export interface DateType {
  type: 'date'
}

export interface VectType<T = any> {
  type: 'vect'
  length: number
  elemType: TypeDefinition<T>
}

export interface TreeType<T = any> {
  type: 'tree'
  valueType: TypeDefinition<T>
}

export interface RoseTreeType<T = any> {
  type: 'roseTree'
  valueType: TypeDefinition<T>
}

export interface LiteralType<T = any> {
  type: 'literal'
  value: T
}

export interface FunctionType<P extends any[] = any[], R = any> {
  type: 'function'
  paramTypes: TypeDefinition<P>[]
  returnType: TypeDefinition<R>
}

export interface VoidType {
  type: 'void'
}

export interface DependentFunctionType<P extends any[] = any[], R = any> {
  type: 'dependentFunction'
  paramTypes: TypeDefinition<P>[]
  returnTypeFn: (...params: P) => TypeDefinition<R>
}

export interface DependentArrayType<T = any> {
  type: 'dependentArray'
  lengthFn: (value: T[]) => number
  itemTypeFn: (index: number, array: T[]) => TypeDefinition<T>
}

export interface DependentSumType<T = any> {
  type: 'dependentSum'
  discriminantFn: (value: T) => any
  typesFn: (discriminant: unknown) => TypeDefinition<T>[]
}

export interface ReferenceType {
  type: 'reference'
  modelName: string
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
  | ReferenceType

export type TypeDefinition<T = any> = PrimitiveTypeName | ComplexType<T> | Model

// Type inference helpers
type InferPrimitive<T extends PrimitiveTypeName> = T extends 'string'
  ? string
  : T extends 'float' | 'integer' | 'natural'
    ? number
    : T extends 'boolean'
      ? boolean
      : T extends 'bigint'
        ? bigint
        : T extends 'symbol'
          ? symbol
          : T extends 'null'
            ? null
            : never

type InferType<T extends TypeDefinition> = T extends PrimitiveTypeName
  ? InferPrimitive<T>
  : T extends ObjectType<infer S>
    ? { [K in keyof S]: InferType<S[K]> }
    : T extends ArrayType<infer E>
      ? E extends TypeDefinition
        ? InferType<E>[]
        : unknown[]
      : T extends SumType<infer U>
        ? U extends TypeDefinition
          ? InferType<U>
          : unknown
        : T extends ProductType<infer F>
          ? {
              [K in keyof F]: F[K] extends TypeDefinition ? InferType<F[K]> : unknown
            }
          : T extends AnyType
            ? any
            : T extends EnumType<infer V>
              ? V
              : T extends OptionalType<infer O>
                ? O extends TypeDefinition
                  ? InferType<O> | undefined | null
                  : unknown
                : T extends RefinementType<infer R>
                  ? R extends TypeDefinition
                    ? InferType<R>
                    : unknown
                  : T extends DependentPairType<infer F, infer S>
                    ? F extends TypeDefinition
                      ? [InferType<F>, S]
                      : [any, S]
                    : T extends DateType
                      ? Date
                      : T extends VectType<infer E>
                        ? E extends TypeDefinition
                          ? InferType<E>[]
                          : unknown[]
                        : T extends TreeType<infer V>
                          ? V extends TypeDefinition
                            ? TreeNode<InferType<V>>
                            : TreeNode<any>
                          : T extends RoseTreeType<infer V>
                            ? V extends TypeDefinition
                              ? RoseTreeNode<InferType<V>>
                              : RoseTreeNode<any>
                            : T extends LiteralType<infer L>
                              ? L
                              : T extends FunctionType<infer P, infer R>
                                ? (...args: P) => R
                                : T extends VoidType
                                  ? void
                                  : T extends ReferenceType
                                    ? number
                                    : T extends Model
                                      ? any
                                      : unknown

// Tree structures
interface TreeNode<T> {
  value: T
  left?: TreeNode<T>
  right?: TreeNode<T>
}

interface RoseTreeNode<T> {
  value: T
  children: RoseTreeNode<T>[]
}

// Type constructors
const Type = {
  String: 'string' as const,
  Float: 'float' as const,
  Number: 'float' as const,
  Integer: 'integer' as const,
  Natural: 'natural' as const,
  Boolean: 'boolean' as const,
  BigInt: 'bigint' as const,
  Symbol: 'symbol' as const,
  Null: 'null' as const,
  Object: <T extends Record<string, TypeDefinition>>(schema: T): ObjectType<T> => ({
    type: 'object',
    schema,
  }),
  Array: <T>(
    itemType: TypeDefinition<T>,
    options: { allowEmpty?: boolean } = {}
  ): ArrayType<T> => ({
    type: 'array',
    itemType,
    allowEmpty: options.allowEmpty !== false, // Default to true
  }),
  Sum: <T>(...types: TypeDefinition<T>[]): SumType<T> => ({
    type: 'sum',
    types,
  }),
  Product: <T extends Record<string, TypeDefinition>>(fields: T): ProductType<T> => ({
    type: 'product',
    fields,
  }),
  Any: { type: 'any' } as AnyType,
  Enum: <T>(...values: T[]): EnumType<T> => ({
    type: 'enum',
    values,
  }),
  Optional: <T>(type: TypeDefinition<T>): OptionalType<T> => ({
    type: 'optional',
    optional: type,
  }),
  Refinement: <T>(
    baseType: TypeDefinition<T>,
    refinementFn: (value: T) => boolean
  ): RefinementType<T> => ({
    type: 'refinement',
    baseType,
    refinementFn,
  }),
  DependentPair: <F, S>(
    fstType: TypeDefinition<F>,
    sndTypeFn: (fst: F) => TypeDefinition<S>
  ): DependentPairType<F, S> => ({
    type: 'dependentPair',
    fstType,
    sndTypeFn,
  }),
  DependentRecord: <T extends Record<string, TypeDefinition>>(
    fields: T,
    validateFn?: (value: unknown, rootState: unknown) => boolean | string
  ): DependentRecordType<T> => ({
    type: 'dependentRecord',
    fields,
    ...(validateFn && { validateFn }),
  }),
  Date: { type: 'date' } as DateType,
  Vect: <T>(length: number, elemType: TypeDefinition<T>): VectType<T> => ({
    type: 'vect',
    length,
    elemType,
  }),
  Tree: <T>(valueType: TypeDefinition<T>): TreeType<T> => ({
    type: 'tree',
    valueType,
  }),
  RoseTree: <T>(valueType: TypeDefinition<T>): RoseTreeType<T> => ({
    type: 'roseTree',
    valueType,
  }),
  Literal: <T>(value: T): LiteralType<T> => ({
    type: 'literal',
    value,
  }),
  Function: <P extends any[], R>(
    paramTypes: TypeDefinition<P>[],
    returnType: TypeDefinition<R>
  ): FunctionType<P, R> => ({
    type: 'function',
    paramTypes,
    returnType,
  }),
  Void: { type: 'void' } as VoidType,
  DependentFunction: <P extends any[], R>(
    paramTypes: TypeDefinition<P>[],
    returnTypeFn: (...params: P) => TypeDefinition<R>
  ): DependentFunctionType<P, R> => ({
    type: 'dependentFunction',
    paramTypes,
    returnTypeFn,
  }),
  DependentArray: <T>(
    lengthFn: (value: T[]) => number,
    itemTypeFn: (index: number, array: T[]) => TypeDefinition<T>
  ): DependentArrayType<T> => ({
    type: 'dependentArray',
    lengthFn,
    itemTypeFn,
  }),
  DependentSum: <T>(
    discriminantFn: (value: T) => any,
    typesFn: (discriminant: unknown) => TypeDefinition<T>[]
  ): DependentSumType<T> => ({
    type: 'dependentSum',
    discriminantFn,
    typesFn,
  }),
  Model: (name: string, properties: Record<string, TypeDefinition>) =>
    new Model({ name, properties }),
  Reference: (modelName: string): ReferenceType => ({
    type: 'reference',
    modelName,
  }),
}

// Validator function type
type ValidatorFn = (
  value: unknown,
  type: TypeDefinition,
  path: string[],
  rootState?: unknown,
  validateType?: ValidateTypeFn
) => any

type ValidateTypeFn = (
  value: unknown,
  type: TypeDefinition,
  path: string[],
  rootState: unknown,
  currentKey?: string
) => any

// Type validators
const typeValidators: Record<string, ValidatorFn> = {
  string: (value, type, path) => {
    if (typeof value !== type)
      throw new Error(`Expected ${type}, got ${typeof value} at ${path.join('.')}`)
  },
  object: (value, type, path, rootState, validateType) => {
    const objectType = type as ObjectType
    if (typeof value !== 'object' || value === null)
      throw new Error(
        `Expected object, got ${value === null ? 'null' : typeof value} at ${path.join('.')}`
      )
    const objectValue = value as Record<string, unknown>
    Object.entries(objectType.schema).forEach(([key, subType]) => {
      if (!(key in objectValue))
        throw new Error(`Missing required property ${key} at ${path.join('.')}`)
      validateType!(objectValue[key], subType, [...path, key], rootState)
    })
  },
  array: (value, type, path, rootState, validateType) => {
    const arrayType = type as ArrayType
    if (!Array.isArray(value)) {
      throw new Error(`Expected array, got ${typeof value} at ${path.join('.')}`)
    }

    // If the array is empty, it's valid
    if (value.length === 0) {
      return
    }

    value.forEach((item, index) => {
      if (item === undefined || item === null) {
        // If the item type is optional, this is valid
        if (
          typeof arrayType.itemType === 'object' &&
          'type' in arrayType.itemType &&
          arrayType.itemType.type === 'optional'
        ) {
          return
        }
        throw new Error(
          `Unexpected ${
            item === null ? 'null' : 'undefined'
          } value at index ${index} at ${path.join('.')}`
        )
      }

      try {
        const itemTypeToValidate =
          typeof arrayType.itemType === 'object' &&
          'type' in arrayType.itemType &&
          arrayType.itemType.type === 'optional'
            ? (arrayType.itemType as OptionalType).optional
            : arrayType.itemType
        validateType!(item, itemTypeToValidate, [...path, String(index)], rootState)
      } catch (error: unknown) {
        throw new Error(
          `Invalid item at index ${index}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    })
  },
  any: () => {},
  enum: (value, type, path) => {
    const enumType = type as EnumType
    if (!enumType.values.includes(value))
      throw new Error(
        `Expected one of ${enumType.values.join(', ')}, got ${value} at ${path.join('.')}`
      )
  },
  sum: (value, type, path, rootState, validateType) => {
    const sumType = type as SumType
    const errors: string[] = []
    if (
      !sumType.types.some(subType => {
        try {
          validateType!(value, subType, path, rootState)
          return true
        } catch (e: unknown) {
          if (e instanceof Error) {
            errors.push(e.message)
          } else {
            errors.push(String(e))
          }
          return false
        }
      })
    ) {
      throw new Error(
        `Sum type validation failed at ${path.join(
          '.'
        )}. Value: ${JSON.stringify(value)}. Errors: ${errors.join('; ')}`
      )
    }
  },
  product: (value, type, path, rootState, validateType) => {
    if (typeof value !== 'object' || value === null) {
      throw new Error(`Expected object for Product type, got ${typeof value} at ${path.join('.')}`)
    }

    // Get the existing object from the rootState
    let existingObject = path.reduce(
      (obj: unknown, key) => (obj as Record<string, unknown>)?.[key],
      rootState
    )
    if (existingObject === undefined) {
      existingObject = {}
    }

    // Merge the new value with the existing object
    const mergedValue = _deepMerge(_deepMerge({}, existingObject), value)

    // Validate each field defined in the Product type
    if (
      typeof type === 'object' &&
      type !== null &&
      'type' in type &&
      type.type === 'product' &&
      'fields' in type
    ) {
      Object.entries(type.fields).forEach(([key, fieldType]) => {
        if (key in mergedValue) {
          // Validate the field
          validateType!(
            mergedValue[key],
            fieldType as TypeDefinition<any>,
            [...path, key],
            rootState,
            key
          )
        }
      })
    }

    // Update the rootState with the merged value
    let currentObj = rootState as Record<string, unknown>
    for (let i = 0; i < path.length - 1; i++) {
      if (currentObj[path[i]] === undefined) {
        currentObj[path[i]] = {}
      }
      currentObj = currentObj[path[i]] as Record<string, unknown>
    }
    currentObj[path[path.length - 1]] = mergedValue

    return mergedValue
  },
  optional: (value, type, path, rootState, validateType) => {
    if (value === undefined || value === null) {
      return null
    }
    if (
      typeof type === 'object' &&
      type !== null &&
      'type' in type &&
      type.type === 'optional' &&
      'optional' in type
    ) {
      return validateType!(value, type.optional, path, rootState)
    }
    throw new Error(`Expected OptionalType, but got something else at ${path.join('.')}`)
  },
  null: (value, _type, path) => {
    if (value !== null) throw new Error(`Expected null, got ${typeof value} at ${path.join('.')}`)
  },
  refinement: (value, type, path, rootState, validateType) => {
    const refinementType = type as RefinementType
    validateType!(value, refinementType.baseType, path, rootState)
    if (!refinementType.refinementFn(value)) {
      throw new Error(`Refinement predicate failed at ${path.join('.')}`)
    }
  },
  dependentPair: (value, type, path, rootState, validateType) => {
    const pairType = type as DependentPairType
    if (!Array.isArray(value) || value.length !== 2) {
      throw new Error(`Expected dependent pair at ${path.join('.')}`)
    }
    validateType!(value[0], pairType.fstType, [...path, '0'], rootState)
    const sndType = pairType.sndTypeFn(value[0])
    validateType!(value[1], sndType, [...path, '1'], rootState)
  },
  date: (value, _type, path) => {
    if (!(value instanceof Date))
      throw new Error(`Expected Date, got ${typeof value} at ${path.join('.')}`)
  },
  float: (value, _type, path) => {
    if (typeof value !== 'number') {
      throw new Error(`Expected float, got ${typeof value} at ${path.join('.')}`)
    }
    if (Number.isNaN(value)) {
      throw new Error(`Expected float, got NaN at ${path.join('.')}`)
    }
  },
  integer: (value, _type, path) => {
    if (!Number.isInteger(value)) {
      throw new Error(
        `Expected integer, got ${
          typeof value === 'number' ? 'float' : typeof value
        } at ${path.join('.')}`
      )
    }
  },
  natural: (value, _type, path) => {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      throw new Error(`Expected natural number, got ${value} at ${path.join('.')}`)
    }
  },
  vect: (value, type, path, rootState, validateType) => {
    if (
      typeof type === 'object' &&
      type !== null &&
      'type' in type &&
      type.type === 'vect' &&
      'length' in type &&
      'elemType' in type
    ) {
      if (!Array.isArray(value) || value.length !== type.length) {
        throw new Error(
          `Expected Vect of length ${type.length}, got ${
            Array.isArray(value) ? value.length : 'non-array'
          } at ${path.join('.')}`
        )
      }
      value.forEach((item, index) => {
        validateType!(item, type.elemType, [...path, String(index)], rootState)
      })
    } else {
      throw new Error(`Expected VectType at ${path.join('.')}`)
    }
  },
  tree: (value, type, path, rootState, validateType) => {
    if (typeof value !== 'object' || value === null)
      throw new Error(`Expected tree, got ${typeof value} at ${path.join('.')}`)
    if (!('value' in value))
      throw new Error(`Invalid tree structure: missing 'value' at ${path.join('.')}`)
    if (
      typeof type === 'object' &&
      type !== null &&
      'type' in type &&
      type.type === 'tree' &&
      'valueType' in type
    ) {
      validateType!(value.value, type.valueType, [...path, 'value'], rootState)
    } else {
      throw new Error(`Expected TreeType at ${path.join('.')}`)
    }
    if ('left' in value) validateType!(value.left, type, [...path, 'left'], rootState)
    if ('right' in value) validateType!(value.right, type, [...path, 'right'], rootState)
  },
  roseTree: (value, type, path, rootState, validateType) => {
    if (typeof value !== 'object' || value === null)
      throw new Error(`Expected rose tree, got ${typeof value} at ${path.join('.')}`)
    if (!('value' in value) || !('children' in value))
      throw new Error(`Invalid rose tree structure at ${path.join('.')}`)
    if (
      typeof type === 'object' &&
      type !== null &&
      'type' in type &&
      type.type === 'roseTree' &&
      'valueType' in type
    ) {
      validateType!(value.value, type.valueType, [...path, 'value'], rootState)
    } else {
      throw new Error(`Expected RoseTreeType at ${path.join('.')}`)
    }
    if (!Array.isArray(value.children))
      throw new Error(
        `Expected array of children, got ${typeof value.children} at ${path.join('.')}.children`
      )
    value.children.forEach((child: unknown, index: number) => {
      validateType!(child, type, [...path, 'children', String(index)], rootState)
    })
  },
  dependentRecord: (value, type, path, rootState, validateType) => {
    const recordType = type as DependentRecordType
    if (typeof value !== 'object' || value === null)
      throw new Error(`Expected object, got ${typeof value} at ${path.join('.')}`)
    const objectValue = value as Record<string, unknown>

    Object.entries(recordType.fields).forEach(([key, fieldType]) => {
      if (!(key in objectValue))
        throw new Error(`Missing required property ${key} at ${path.join('.')}`)

      const resolvedType = typeof fieldType === 'function' ? fieldType(value) : fieldType

      validateType!(objectValue[key], resolvedType, [...path, key], rootState)
    })

    if (typeof recordType.validateFn === 'function') {
      const result = recordType.validateFn(value, rootState)
      if (result !== true) {
        throw new Error(`Validation failed for dependent record at ${path.join('.')}: ${result}`)
      }
    }
  },
  dependentFunction: (value, _type, path) => {
    if (typeof value !== 'function') {
      throw new Error(`Expected function, got ${typeof value} at ${path.join('.')}`)
    }
  },
  dependentArray: (value, type, path, rootState, validateType) => {
    const arrayType = type as DependentArrayType
    if (!Array.isArray(value)) {
      throw new Error(`Expected array, got ${typeof value} at ${path.join('.')}`)
    }
    const expectedLength = arrayType.lengthFn(value)
    if (value.length !== expectedLength) {
      throw new Error(
        `Expected array of length ${expectedLength}, got ${value.length} at ${path.join('.')}`
      )
    }
    value.forEach((item, index) => {
      const itemType = arrayType.itemTypeFn(index, value)
      validateType!(item, itemType, [...path, String(index)], rootState)
    })
  },
  dependentSum: (value, type, path, rootState, validateType) => {
    const sumType = type as DependentSumType
    const discriminant = sumType.discriminantFn(value)
    const possibleTypes = sumType.typesFn(discriminant)
    const errors: string[] = []

    for (const subType of possibleTypes) {
      try {
        validateType!(value, subType, path, rootState)
        break
      } catch (e: unknown) {
        if (e instanceof Error) {
          errors.push(e.message)
        } else {
          errors.push(String(e))
        }
      }
    }

    if (possibleTypes.length === errors.length) {
      throw new Error(
        `Dependent sum type validation failed at ${path.join('.')}. Errors: ${errors.join('; ')}`
      )
    }
  },
  literal: (value, type, path) => {
    if (
      typeof type === 'object' &&
      type !== null &&
      'type' in type &&
      type.type === 'literal' &&
      'value' in type
    ) {
      if (value !== type.value) {
        throw new Error(`Expected ${type.value}, got ${value} at ${path.join('.')}`)
      }
    } else {
      throw new Error(`Expected LiteralType at ${path.join('.')}`)
    }
  },
  boolean: (value, _type, path) => {
    if (typeof value !== 'boolean')
      throw new Error(`Expected boolean, got ${typeof value} at ${path.join('.')}`)
  },
  bigint: (value, _type, path) => {
    if (typeof value !== 'bigint')
      throw new Error(`Expected bigint, got ${typeof value} at ${path.join('.')}`)
  },
  symbol: (value, _type, path) => {
    if (typeof value !== 'symbol')
      throw new Error(`Expected symbol, got ${typeof value} at ${path.join('.')}`)
  },
  function: (value, _type, path) => {
    if (typeof value !== 'function') {
      throw new Error(`Expected function, got ${typeof value} at ${path.join('.')}`)
    }
  },
  void: () => {
    // No validation needed for void type
  },
  reference: (value, _type, path, _rootState, _validateType) => {
    if (typeof value !== 'number') {
      throw new Error(`Expected reference ID (number), got ${typeof value} at ${path.join('.')}`)
    }
    // We don't validate the actual referenced object here, as it might not be loaded yet
  },

  model: (value, type, path, rootState, validateType) => {
    const modelType = type as Model
    if (typeof value !== 'object' || value === null) {
      throw new Error(`Expected model object, got ${typeof value} at ${path.join('.')}`)
    }
    const objectValue = value as Record<string, unknown>
    // Validate each field of the model
    Object.entries(modelType.schema).forEach(([key, fieldType]) => {
      if (!(key in objectValue)) {
        throw new Error(`Missing required property ${key} in model at ${path.join('.')}`)
      }
      validateType!(objectValue[key], fieldType as TypeDefinition, [...path, key], rootState, key)
    })
  },
}

const validateType: ValidateTypeFn = (value, type, path = [], rootState = {}, currentKey = '') => {
  if (type === undefined) {
    throw new Error(`Invalid type definition for key "${currentKey}" at ${path.join('.')}`)
  }

  // Handle optional types
  if (typeof type === 'object' && type !== null && 'type' in type && type.type === 'optional') {
    if (value === undefined || value === null) {
      return // Optional field is allowed to be undefined or null
    }
    return validateType(value, (type as OptionalType).optional, path, rootState, currentKey)
  }

  // Check for undefined required fields
  if (value === undefined) {
    throw new Error(`Missing required property "${currentKey}" at ${path.join('.')}`)
  }

  // Handle null values
  if (value === null && type !== 'null') {
    throw new Error(`Expected non-null value for "${currentKey}", got null at ${path.join('.')}`)
  }

  // Handle Model instances
  if (type instanceof Model) {
    return typeValidators.model(value, type, path, rootState, (v, t, p, r, k) =>
      validateType(v, t, p, r, k)
    )
  }

  // Handle primitive types
  if (typeof type === 'string') {
    const validator = typeValidators[type]
    if (validator) {
      return validator(value, type, path, rootState, (v, t, p, r, k) => validateType(v, t, p, r, k))
    } else {
      throw new Error(`Unknown primitive type ${type} for "${currentKey}" at ${path.join('.')}`)
    }
  }

  // Handle complex types (including Product)
  const validator = typeValidators[(type as ComplexType).type]
  if (validator) {
    return validator(value, type, path, rootState, (v, t, p, r, k) => validateType(v, t, p, r, k))
  } else {
    throw new Error(`Unknown type ${JSON.stringify(type)} for "${currentKey}" at ${path.join('.')}`)
  }
}

const useValidationHook = (schema: Record<string, TypeDefinition> | DependentRecordType) => {
  return (state: unknown) => {
    const clonedState = _deepClone(state)
    if (typeof schema === 'object' && 'type' in schema && schema.type === 'dependentRecord') {
      validateType(clonedState, schema as TypeDefinition, [], clonedState)
    } else {
      Object.entries(schema).forEach(([key, type]) => {
        validateType(clonedState[key], type as TypeDefinition, [key], clonedState)
      })
    }
  }
}

const useValidationThunk = (schema: ProductType | ComplexType) => {
  return (state: unknown) => {
    const clonedState = _deepClone(state)
    if (typeof schema === 'object' && 'type' in schema && schema.type === 'product') {
      try {
        validateType(clonedState, schema, [], clonedState, 'root')
      } catch (error) {
        console.error('Validation error:', error)
        throw error
      }
    } else {
      throw new Error('Root schema must be a Product type')
    }
  }
}

export { Type, useValidationThunk, useValidationHook, validateType }
export type { InferType }
