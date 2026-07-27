export type Resource<T> = {
    status: 'idle' | 'loading' | 'refreshing';
    data?: T;
    error?: undefined;
    requestId: number;
} | {
    status: 'success';
    data: T;
    error?: undefined;
    requestId: number;
} | {
    status: 'error';
    data?: T;
    error: unknown;
    requestId: number;
};
export type ResourceOptions = {
    keepPrevious?: boolean;
    dedupeMs?: number;
    race?: 'latest' | 'first';
};
//# sourceMappingURL=resource.d.ts.map