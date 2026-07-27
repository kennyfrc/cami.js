import { Model } from '../observables/observable-model.js';
export type PrimitiveTypeName = 'string' | 'float' | 'integer' | 'natural' | 'boolean' | 'bigint' | 'symbol' | 'null';
export interface ObjectType<T extends Record<string, any> = Record<string, any>> {
    type: 'object';
    schema: T;
}
export interface ArrayType<T = any> {
    type: 'array';
    itemType: TypeDefinition<T>;
    allowEmpty: boolean;
}
export interface SumType<T = any> {
    type: 'sum';
    types: TypeDefinition<T>[];
}
export interface ProductType<T extends Record<string, any> = Record<string, any>> {
    type: 'product';
    fields: T;
}
export interface AnyType {
    type: 'any';
}
export interface EnumType<T = any> {
    type: 'enum';
    values: T[];
}
export interface OptionalType<T = any> {
    type: 'optional';
    optional: TypeDefinition<T>;
}
export interface RefinementType<T = any> {
    type: 'refinement';
    baseType: TypeDefinition<T>;
    refinementFn: (value: T) => boolean;
}
export interface DependentPairType<F = any, S = any> {
    type: 'dependentPair';
    fstType: TypeDefinition<F>;
    sndTypeFn: (fst: F) => TypeDefinition<S>;
}
export interface DependentRecordType<T extends Record<string, any> = Record<string, any>> {
    type: 'dependentRecord';
    fields: T;
    validateFn?: (value: unknown, rootState: unknown) => boolean | string;
}
export interface DateType {
    type: 'date';
}
export interface VectType<T = any> {
    type: 'vect';
    length: number;
    elemType: TypeDefinition<T>;
}
export interface TreeType<T = any> {
    type: 'tree';
    valueType: TypeDefinition<T>;
}
export interface RoseTreeType<T = any> {
    type: 'roseTree';
    valueType: TypeDefinition<T>;
}
export interface LiteralType<T = any> {
    type: 'literal';
    value: T;
}
export interface FunctionType<P extends any[] = any[], R = any> {
    type: 'function';
    paramTypes: TypeDefinition<P>[];
    returnType: TypeDefinition<R>;
}
export interface VoidType {
    type: 'void';
}
export interface DependentFunctionType<P extends any[] = any[], R = any> {
    type: 'dependentFunction';
    paramTypes: TypeDefinition<P>[];
    returnTypeFn: (...params: P) => TypeDefinition<R>;
}
export interface DependentArrayType<T = any> {
    type: 'dependentArray';
    lengthFn: (value: T[]) => number;
    itemTypeFn: (index: number, array: T[]) => TypeDefinition<T>;
}
export interface DependentSumType<T = any> {
    type: 'dependentSum';
    discriminantFn: (value: T) => any;
    typesFn: (discriminant: unknown) => TypeDefinition<T>[];
}
export interface ReferenceType {
    type: 'reference';
    modelName: string;
}
export type ComplexType<T = any> = ObjectType<T extends Record<string, any> ? T : Record<string, any>> | ArrayType<T> | SumType<T> | ProductType<T extends Record<string, any> ? T : Record<string, any>> | AnyType | EnumType<T> | OptionalType<T> | RefinementType<T> | DependentPairType | DependentRecordType<T extends Record<string, any> ? T : Record<string, any>> | DateType | VectType<T> | TreeType<T> | RoseTreeType<T> | LiteralType<T> | FunctionType | VoidType | DependentFunctionType | DependentArrayType<T> | DependentSumType<T> | ReferenceType;
export type TypeDefinition<T = any> = PrimitiveTypeName | ComplexType<T> | Model;
type InferPrimitive<T extends PrimitiveTypeName> = T extends 'string' ? string : T extends 'float' | 'integer' | 'natural' ? number : T extends 'boolean' ? boolean : T extends 'bigint' ? bigint : T extends 'symbol' ? symbol : T extends 'null' ? null : never;
type InferType<T extends TypeDefinition> = T extends PrimitiveTypeName ? InferPrimitive<T> : T extends ObjectType<infer S> ? {
    [K in keyof S]: InferType<S[K]>;
} : T extends ArrayType<infer E> ? E extends TypeDefinition ? InferType<E>[] : unknown[] : T extends SumType<infer U> ? U extends TypeDefinition ? InferType<U> : unknown : T extends ProductType<infer F> ? {
    [K in keyof F]: F[K] extends TypeDefinition ? InferType<F[K]> : unknown;
} : T extends AnyType ? any : T extends EnumType<infer V> ? V : T extends OptionalType<infer O> ? O extends TypeDefinition ? InferType<O> | undefined | null : unknown : T extends RefinementType<infer R> ? R extends TypeDefinition ? InferType<R> : unknown : T extends DependentPairType<infer F, infer S> ? F extends TypeDefinition ? [InferType<F>, S] : [any, S] : T extends DateType ? Date : T extends VectType<infer E> ? E extends TypeDefinition ? InferType<E>[] : unknown[] : T extends TreeType<infer V> ? V extends TypeDefinition ? TreeNode<InferType<V>> : TreeNode<any> : T extends RoseTreeType<infer V> ? V extends TypeDefinition ? RoseTreeNode<InferType<V>> : RoseTreeNode<any> : T extends LiteralType<infer L> ? L : T extends FunctionType<infer P, infer R> ? (...args: P) => R : T extends VoidType ? void : T extends ReferenceType ? number : T extends Model ? any : unknown;
interface TreeNode<T> {
    value: T;
    left?: TreeNode<T>;
    right?: TreeNode<T>;
}
interface RoseTreeNode<T> {
    value: T;
    children: RoseTreeNode<T>[];
}
declare const Type: {
    String: "string";
    Float: "float";
    Number: "float";
    Integer: "integer";
    Natural: "natural";
    Boolean: "boolean";
    BigInt: "bigint";
    Symbol: "symbol";
    Null: "null";
    Object: <T extends Record<string, TypeDefinition>>(schema: T) => ObjectType<T>;
    Array: <T>(itemType: TypeDefinition<T>, options?: {
        allowEmpty?: boolean;
    }) => ArrayType<T>;
    Sum: <T>(...types: TypeDefinition<T>[]) => SumType<T>;
    Product: <T extends Record<string, TypeDefinition>>(fields: T) => ProductType<T>;
    Any: AnyType;
    Enum: <T>(...values: T[]) => EnumType<T>;
    Optional: <T>(type: TypeDefinition<T>) => OptionalType<T>;
    Refinement: <T>(baseType: TypeDefinition<T>, refinementFn: (value: T) => boolean) => RefinementType<T>;
    DependentPair: <F, S>(fstType: TypeDefinition<F>, sndTypeFn: (fst: F) => TypeDefinition<S>) => DependentPairType<F, S>;
    DependentRecord: <T extends Record<string, TypeDefinition>>(fields: T, validateFn?: (value: unknown, rootState: unknown) => boolean | string) => DependentRecordType<T>;
    Date: DateType;
    Vect: <T>(length: number, elemType: TypeDefinition<T>) => VectType<T>;
    Tree: <T>(valueType: TypeDefinition<T>) => TreeType<T>;
    RoseTree: <T>(valueType: TypeDefinition<T>) => RoseTreeType<T>;
    Literal: <T>(value: T) => LiteralType<T>;
    Function: <P extends any[], R>(paramTypes: TypeDefinition<P>[], returnType: TypeDefinition<R>) => FunctionType<P, R>;
    Void: VoidType;
    DependentFunction: <P extends any[], R>(paramTypes: TypeDefinition<P>[], returnTypeFn: (...params: P) => TypeDefinition<R>) => DependentFunctionType<P, R>;
    DependentArray: <T>(lengthFn: (value: T[]) => number, itemTypeFn: (index: number, array: T[]) => TypeDefinition<T>) => DependentArrayType<T>;
    DependentSum: <T>(discriminantFn: (value: T) => any, typesFn: (discriminant: unknown) => TypeDefinition<T>[]) => DependentSumType<T>;
    Model: (name: string, properties: Record<string, TypeDefinition>) => Model<Record<string, TypeDefinition<any>>>;
    Reference: (modelName: string) => ReferenceType;
};
type ValidateTypeFn = (value: unknown, type: TypeDefinition, path: string[], rootState: unknown, currentKey?: string) => any;
declare const validateType: ValidateTypeFn;
declare const useValidationHook: (schema: Record<string, TypeDefinition> | DependentRecordType) => (state: unknown) => void;
declare const useValidationThunk: (schema: ProductType | ComplexType) => (state: unknown) => void;
export { Type, useValidationThunk, useValidationHook, validateType };
export type { InferType };
//# sourceMappingURL=index.d.ts.map