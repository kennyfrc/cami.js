interface Patch {
    path: string | string[];
    value: any;
    op?: string;
}
interface UnproxifyTarget {
    [key: string]: any;
}
interface IDBStoreConfig {
    name: string;
    version: number;
    storeName: string;
    keyPath: string;
    indexName: string;
}
interface QueryOptions {
    type?: 'key' | 'index' | 'all' | 'range' | 'cursor' | 'count' | 'keys' | 'unique';
    key?: any;
    index?: string;
    value?: any;
    lower?: any;
    upper?: any;
    lowerOpen?: boolean;
    upperOpen?: boolean;
    range?: IDBKeyRange;
    direction?: IDBCursorDirection;
    limit?: number;
}
interface IDBPromiseStore {
    getState(options?: QueryOptions): Promise<any>;
    transaction(mode: IDBTransactionMode): IDBTransaction;
    storeName: string;
}
interface PersistToIdbConfig {
    fromStateKey: string;
    toIDBStore: IDBPromiseStore;
}
interface ThunkParams {
    action: any;
    patches: Patch[];
    state?: any;
    previousState?: any;
}
interface LocalStorageConfig {
    name: string;
    version: number;
}
interface LocalStorageAdapter {
    getState(): Promise<any>;
    setState(state: any): Promise<void>;
    name: string;
    version: number;
}
export declare function removeDeep(obj: UnproxifyTarget, path: string[]): UnproxifyTarget;
export declare function createIdbPromise({ name, version, storeName, keyPath, indexName }: IDBStoreConfig): Promise<IDBPromiseStore>;
export declare function persistToIdbThunk({ fromStateKey, toIDBStore }: PersistToIdbConfig): ({ action: _action, patches }: ThunkParams) => Promise<void>;
export declare function createLocalStorage({ name, version, }: LocalStorageConfig): LocalStorageAdapter;
export declare function persistToLocalStorageThunk(toLocalStorage: LocalStorageAdapter): ({ action: _action, state, previousState }: ThunkParams) => Promise<void>;
export {};
//# sourceMappingURL=adapters.d.ts.map