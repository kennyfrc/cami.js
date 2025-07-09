import { Model } from "../observables/observable-model.js";
export type PrimitiveTypeName = "string" | "float" | "integer" | "natural" | "boolean" | "bigint" | "symbol" | "null";
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
export type ComplexType<T = any> = ObjectType<T extends Record<string, any> ? T : Record<string, any>> | ArrayType<T> | SumType<T> | ProductType<T extends Record<string, any> ? T : Record<string, any>> | AnyType | EnumType<T> | OptionalType<T> | RefinementType<T> | DependentPairType | DependentRecordType<T extends Record<string, any> ? T : Record<string, any>> | DateType | VectType<T> | TreeType<T> | RoseTreeType<T> | LiteralType<T> | FunctionType | VoidType | DependentFunctionType | DependentArrayType<T> | DependentSumType<T> | ReferenceType;
export type TypeDefinition<T = any> = PrimitiveTypeName | ComplexType<T> | Model;
type InferPrimitive<T extends PrimitiveTypeName> = T extends "string" ? string : T extends "float" | "integer" | "natural" ? number : T extends "boolean" ? boolean : T extends "bigint" ? bigint : T extends "symbol" ? symbol : T extends "null" ? null : never;
type InferType<T extends TypeDefinition> = T extends PrimitiveTypeName ? InferPrimitive<T> : T extends ObjectType<infer S> ? {
    [K in keyof S]: InferType<S[K]>;
} : T extends ArrayType<infer E> ? E extends TypeDefinition ? InferType<E>[] : any[] : T extends SumType<infer U> ? U extends TypeDefinition ? InferType<U> : any : T extends ProductType<infer F> ? {
    [K in keyof F]: F[K] extends TypeDefinition ? InferType<F[K]> : any;
} : T extends AnyType ? any : T extends EnumType<infer V> ? V : T extends OptionalType<infer O> ? O extends TypeDefinition ? InferType<O> | undefined | null : any : T extends RefinementType<infer R> ? R extends TypeDefinition ? InferType<R> : any : T extends DependentPairType<infer F, infer S> ? F extends TypeDefinition ? [InferType<F>, S] : [any, S] : T extends DateType ? Date : T extends VectType<infer E> ? E extends TypeDefinition ? InferType<E>[] : any[] : T extends TreeType<infer V> ? V extends TypeDefinition ? TreeNode<InferType<V>> : TreeNode<any> : T extends RoseTreeType<infer V> ? V extends TypeDefinition ? RoseTreeNode<InferType<V>> : RoseTreeNode<any> : T extends LiteralType<infer L> ? L : T extends FunctionType<infer P, infer R> ? (...args: P) => R : T extends VoidType ? void : T extends ReferenceType ? number : T extends Model ? any : any;
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
    Object: <T extends Record<string, TypeDefinition<any>>>(schema: T) => ObjectType<T>;
    Array: <T_1>(itemType: TypeDefinition<T_1>, options?: {
        allowEmpty?: boolean;
    }) => ArrayType<T_1>;
    Sum: <T_2>(...types: TypeDefinition<T_2>[]) => SumType<T_2>;
    Product: <T_3 extends Record<string, TypeDefinition<any>>>(fields: T_3) => ProductType<T_3>;
    Any: AnyType;
    Enum: <T_4>(...values: T_4[]) => EnumType<T_4>;
    Optional: <T_5>(type: TypeDefinition<T_5>) => OptionalType<T_5>;
    Refinement: <T_6>(baseType: TypeDefinition<T_6>, refinementFn: (value: T_6) => boolean) => RefinementType<T_6>;
    DependentPair: <F, S>(fstType: TypeDefinition<F>, sndTypeFn: (fst: F) => TypeDefinition<S>) => DependentPairType<F, S>;
    DependentRecord: <T_7 extends Record<string, TypeDefinition<any>>>(fields: T_7, validateFn?: ((value: any, rootState: any) => boolean | string) | undefined) => DependentRecordType<T_7>;
    Date: DateType;
    Vect: <T_8>(length: number, elemType: TypeDefinition<T_8>) => VectType<T_8>;
    Tree: <T_9>(valueType: TypeDefinition<T_9>) => TreeType<T_9>;
    RoseTree: <T_10>(valueType: TypeDefinition<T_10>) => RoseTreeType<T_10>;
    Literal: <T_11>(value: T_11) => LiteralType<T_11>;
    Function: <P extends any[], R>(paramTypes: TypeDefinition<P>[], returnType: TypeDefinition<R>) => FunctionType<P, R>;
    Void: VoidType;
    DependentFunction: <P_1 extends any[], R_1>(paramTypes: TypeDefinition<P_1>[], returnTypeFn: (...params: P_1) => TypeDefinition<R_1>) => DependentFunctionType<P_1, R_1>;
    DependentArray: <T_12>(lengthFn: (value: T_12[]) => number, itemTypeFn: (index: number, array: T_12[]) => TypeDefinition<T_12>) => DependentArrayType<T_12>;
    DependentSum: <T_13>(discriminantFn: (value: T_13) => any, typesFn: (discriminant: any) => TypeDefinition<T_13>[]) => DependentSumType<T_13>;
    Model: (name: string, properties: Record<string, TypeDefinition>) => Model<Record<string, TypeDefinition<any>>>;
    Reference: (modelName: string) => ReferenceType;
};
type ValidateTypeFn = (value: any, type: TypeDefinition, path: string[], rootState: any, currentKey?: string) => any;
declare const validateType: ValidateTypeFn;
declare const useValidationHook: (schema: Record<string, TypeDefinition> | DependentRecordType) => (state: any) => void;
declare const useValidationThunk: (schema: ProductType | ComplexType) => (state: any) => void;
export { Type, useValidationThunk, useValidationHook, validateType };
export type { InferType };
//# sourceMappingURL=index.d.ts.map