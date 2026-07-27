export type Ref<T extends Element = Element> = {
    current: T | null;
};
type RefCallback<T extends Element = Element> = (value: T | null) => void;
export declare function ref<T extends Element>(target: Ref<T> | RefCallback<T>): unknown;
export {};
//# sourceMappingURL=ref.d.ts.map