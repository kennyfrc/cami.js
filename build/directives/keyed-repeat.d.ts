type KeyedRepeatOptions = {
    devAssertStable?: boolean;
};
export declare function keyedRepeat<T>(items: readonly T[], key: (item: T, index: number) => string, render: (item: T, index: number) => unknown, opts?: KeyedRepeatOptions): unknown;
export type { KeyedRepeatOptions };
//# sourceMappingURL=keyed-repeat.d.ts.map