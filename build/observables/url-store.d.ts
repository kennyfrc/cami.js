import { Observable } from './observable.js';
interface URLState {
    params: Record<string, string>;
    hashPaths: string[];
    hashParams: Record<string, string>;
    routeParams?: Record<string, string>;
}
interface RouteConfig {
    params?: Record<string, {
        persist?: boolean;
    }>;
    resources?: string[];
    onEnter?: (context: RouteEnterContext) => Promise<void> | void;
    onLeave?: (context: RouteLeaveContext) => Promise<void> | void;
}
interface RouteEnterContext {
    state: URLState;
    params: Record<string, string>;
}
interface RouteLeaveContext {
    from: URLState;
    to: URLState;
}
interface NavigationHookContext {
    from: URLState;
    to: URLState;
    route: RouteDefinition | null;
}
interface ResourceLoaderContext {
    route: RouteDefinition;
    params: Record<string, string>;
    url: string;
    signal?: AbortSignal;
}
interface RouteDefinition {
    pattern: string;
    segments: string[];
    paramNames: string[];
    resources: string[];
    params: Record<string, {
        persist?: boolean;
    }>;
    onEnter?: (context: RouteEnterContext) => Promise<void> | void;
    onLeave?: (context: RouteLeaveContext) => Promise<void> | void;
    extractedParams?: Record<string, string>;
}
interface NavigationState {
    isPending: boolean;
    isLoading: boolean;
}
interface NavigateOptions {
    path?: string;
    params?: Record<string, string | null | undefined>;
    hashParams?: Record<string, string | null | undefined>;
    focusSelector?: string;
    pageTitle?: string;
    announcement?: string;
    updateCurrentPage?: boolean;
    fullReplace?: boolean;
    /**
     * If true, use history.replaceState instead of pushState.
     * Useful for repairing/normalizing URLs without polluting back-button history.
     */
    replace?: boolean;
    shallow?: boolean;
}
interface URLStoreOptions {
    onInit?: (state: URLState) => Promise<void> | void;
    onChange?: (state: URLState) => void;
}
type NavigationHook = (context: NavigationHookContext) => Promise<void> | void;
type ResourceLoader = (context: ResourceLoaderContext) => Promise<void> | void;
/**
 * Enhanced URLStore with resource-aware routing
 * Solves race conditions by defining route dependencies and loading resources before navigation completes
 */
declare class URLStore extends Observable<URLState> {
    private _state;
    private __onChange;
    _uid?: string;
    private __routes;
    private __resourceLoaders;
    private __activeRoute;
    private __navigationState;
    private __persistentParams;
    private __beforeNavigateHooks;
    private __afterNavigateHooks;
    private __bootstrapFn;
    private __bootstrapPromise;
    private __navigationController;
    private __initialized;
    private __firstRouteProcessed;
    constructor({ onInit, onChange }?: URLStoreOptions);
    /**
     * Register a route with associated resource dependencies
     */
    registerRoute(pattern: string, options?: RouteConfig): URLStore;
    /**
     * Register a resource loader function
     */
    registerResourceLoader(resourceName: string, loaderFn: ResourceLoader): URLStore;
    /**
     * Add a hook to be executed before navigation
     */
    beforeNavigate(hookFn: NavigationHook): URLStore;
    /**
     * Add a hook to be executed after navigation
     */
    afterNavigate(hookFn: NavigationHook): URLStore;
    /**
     * Register a bootstrap function that will run once before the first route
     */
    bootstrap(loaderFn: () => Promise<void>): URLStore;
    /**
     * Initialize the store, run bootstrap, and start listening for URL changes
     */
    initialize(): Promise<void>;
    private __parseURL;
    /**
     * Find a matching route for the given path segments
     */
    private __findMatchingRoute;
    __updateStore(): Promise<void>;
    /**
     * Load resources required by a route
     */
    private __loadResources;
    getState(): URLState;
    /**
     * Check if currently in a loading state
     */
    isLoading(): boolean;
    /**
     * Navigate to a URL
     */
    navigate(options?: NavigateOptions): void;
    matches(stateSlice: Partial<URLState>): boolean;
    isEmpty(): boolean;
    private _isArrayPrefix;
}
/**
 * Creates or returns the singleton instance of URLStore
 */
declare const createURLStore: (options?: URLStoreOptions) => URLStore;
export { URLStore };
export type { URLState, RouteConfig, RouteEnterContext, RouteLeaveContext, NavigationHookContext, ResourceLoaderContext, RouteDefinition, NavigationState, NavigateOptions, URLStoreOptions, NavigationHook, ResourceLoader, };
export { createURLStore };
//# sourceMappingURL=url-store.d.ts.map