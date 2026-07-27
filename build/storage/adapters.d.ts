import type { Patch } from 'immer';
export interface ThunkParams {
    action: unknown;
    patches?: Patch[];
    state?: unknown;
    previousState?: unknown;
}
interface LocalStorageConfig {
    name: string;
    version: number;
}
export interface LocalStorageAdapter<T = any> {
    getState(): Promise<T | null>;
    setState(state: T): Promise<void>;
    name: string;
    version: number;
}
export declare function createLocalStorage<T = any>({ name, version, }: LocalStorageConfig): LocalStorageAdapter<T>;
export declare function persistToLocalStorageThunk<T = any>(toLocalStorage: LocalStorageAdapter<T>): ({ action: _action, state, previousState }: ThunkParams) => Promise<void>;
export {};
//# sourceMappingURL=adapters.d.ts.map