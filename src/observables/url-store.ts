import { Observable } from './observable.js';
import { DependencyTracker } from './observable-state.js';
import { _deepEqual } from '../utils';

// Type definitions for URLStore
interface URLState {
  params: Record<string, string>;
  hashPaths: string[];
  hashParams: Record<string, string>;
  routeParams?: Record<string, string>;
}

interface RouteConfig {
  params?: Record<string, { persist?: boolean }>;
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
}

interface RouteDefinition {
  pattern: string;
  segments: string[];
  paramNames: string[];
  resources: string[];
  params: Record<string, { persist?: boolean }>;
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
class URLStore extends Observable<URLState> {
  private _state: URLState;
  private __onChange: ((state: URLState) => void) | null | undefined;
  public _uid?: string;
  private __routes: Map<string, RouteDefinition>;
  private __resourceLoaders: Map<string, ResourceLoader>;
  private __activeRoute: RouteDefinition | null;
  private __navigationState: NavigationState;
  private __persistentParams: Set<string>;
  private __beforeNavigateHooks: NavigationHook[];
  private __afterNavigateHooks: NavigationHook[];

  constructor({ onInit = undefined, onChange = undefined }: URLStoreOptions = {}) {
    super();
    this._state = this.__parseURL();
    this._uid = 'URLStore';
    this.__onChange = onChange;
    this.__routes = new Map<string, RouteDefinition>();
    this.__resourceLoaders = new Map<string, ResourceLoader>();
    this.__activeRoute = null;
    this.__navigationState = {
      isPending: false,
      isLoading: false
    };
    this.__persistentParams = new Set<string>();
    this.__beforeNavigateHooks = [];
    this.__afterNavigateHooks = [];

    this.__initialize(onInit).then(() => {
      if (this.__onChange) {
        this.subscribe(this.__onChange);
        this.__onChange(this._state);
      }

      window.addEventListener('load', () => this.__updateStore());
      window.addEventListener('hashchange', () => this.__updateStore());
    });
  }

  /**
   * Register a route with associated resource dependencies
   */
  registerRoute(pattern: string, options: RouteConfig = {}): URLStore {
    const { resources = [], params = {}, onEnter, onLeave } = options;
    
    // Parse pattern to get segments and param names
    const segments = pattern.split('/').filter(Boolean);
    const paramNames = segments
      .filter(segment => segment.startsWith(':'))
      .map(segment => segment.substring(1));
    
    // Mark persistent params
    if (params) {
      Object.entries(params).forEach(([paramName, paramConfig]) => {
        if (paramConfig.persist) {
          this.__persistentParams.add(paramName);
        }
      });
    }
    
    this.__routes.set(pattern, {
      pattern,
      segments,
      paramNames,
      resources,
      params,
      onEnter,
      onLeave
    });
    
    return this;
  }

  /**
   * Register a resource loader function
   */
  registerResourceLoader(resourceName: string, loaderFn: ResourceLoader): URLStore {
    this.__resourceLoaders.set(resourceName, loaderFn);
    return this;
  }

  /**
   * Add a hook to be executed before navigation
   */
  beforeNavigate(hookFn: NavigationHook): URLStore {
    this.__beforeNavigateHooks.push(hookFn);
    return this;
  }

  /**
   * Add a hook to be executed after navigation
   */
  afterNavigate(hookFn: NavigationHook): URLStore {
    this.__afterNavigateHooks.push(hookFn);
    return this;
  }

  private async __initialize(onInit: URLStoreOptions['onInit']): Promise<void> {
    if (onInit) {
      try {
        await onInit(this._state);
      } catch (error) {
        console.error('Error in URLStore initialization:', error);
      }
    }
  }

  private __parseURL(): URLState {
    const hash = window.location.hash.slice(1);
    const [hashPathAndParams, hashParamsString] = hash.split('#');
    const [hashPath, queryString] = hashPathAndParams.split('?');
    const hashPaths = hashPath.split('/').filter(Boolean);

    const params: Record<string, string> = {};
    const hashParams: Record<string, string> = {};

    if (queryString) {
      new URLSearchParams(queryString).forEach((value, key) => {
        params[key] = value;
      });
    }

    if (hashParamsString) {
      new URLSearchParams(hashParamsString).forEach((value, key) => {
        hashParams[key] = value;
      });
    }

    return { params, hashPaths, hashParams };
  }

  /**
   * Find a matching route for the given path segments
   */
  private __findMatchingRoute(pathSegments: string[]): RouteDefinition | null {
    for (const [, route] of this.__routes.entries()) {
      // Quick length check
      if (route.segments.length !== pathSegments.length) continue;
      
      let isMatch = true;
      const extractedParams: Record<string, string> = {};
      
      for (let i = 0; i < route.segments.length; i++) {
        const routeSegment = route.segments[i];
        const pathSegment = pathSegments[i];
        
        if (routeSegment.startsWith(':')) {
          // Parameter segment - extract value
          const paramName = routeSegment.substring(1);
          extractedParams[paramName] = pathSegment;
        } else if (routeSegment !== pathSegment) {
          // Static segment - must match exactly
          isMatch = false;
          break;
        }
      }
      
      if (isMatch) {
        return { ...route, extractedParams };
      }
    }
    
    return null;
  }

  private async __updateStore(): Promise<void> {
    // Don't process if already navigating
    if (this.__navigationState.isPending) return;
    
    // Parse the current URL
    const urlState = this.__parseURL();
    
    // Skip if URL hasn't changed - use proper deep equality check
    if (_deepEqual(this._state, urlState)) return;
    
    // Set navigation state
    this.__navigationState.isPending = true;
    
    try {
      // Find matching route
      const matchingRoute = this.__findMatchingRoute(urlState.hashPaths);
      
      // Execute before navigate hooks
      for (const hook of this.__beforeNavigateHooks) {
        await hook({
          from: this._state,
          to: urlState,
          route: matchingRoute
        });
      }
      
      // If there's a matching route with resources, load them
      if (matchingRoute && matchingRoute.resources && matchingRoute.resources.length > 0) {
        this.__navigationState.isLoading = true;
        
        // Update URL state with extracted params
        urlState.routeParams = { ...(matchingRoute.extractedParams || {}) };
        
        // Set preliminary state to show loading indicators
        this._state = { ...urlState };
        this.next(this._state);
        
        // Load resources
        await this.__loadResources(matchingRoute!, urlState);
      }
      
      // Handle route change - execute onLeave for old route
      if (this.__activeRoute?.onLeave) {
        await this.__activeRoute.onLeave({
          from: this._state,
          to: urlState
        });
      }
      
      // Update active route
      this.__activeRoute = matchingRoute;
      
      // Update state
      this._state = urlState;
      this.next(urlState);
      
      // Execute onEnter for new route
      if (matchingRoute?.onEnter) {
        await matchingRoute.onEnter({
          state: urlState,
          params: matchingRoute.extractedParams || {}
        });
      }
      
      // Execute after navigate hooks
      for (const hook of this.__afterNavigateHooks) {
        await hook({
          from: this._state,
          to: urlState,
          route: matchingRoute
        });
      }
    } catch (error) {
      console.error('Error in navigation:', error);
    } finally {
      // Reset navigation state
      this.__navigationState.isPending = false;
      this.__navigationState.isLoading = false;
    }
  }

  /**
   * Load resources required by a route
   */
  private async __loadResources(route: RouteDefinition, urlState: URLState): Promise<void> {
    if (!route.resources || route.resources.length === 0) return;
    
    // Build context
    const context: ResourceLoaderContext = {
      route,
      params: { ...urlState.params, ...urlState.routeParams },
      url: window.location.hash
    };
    
    // Load all required resources in parallel
    await Promise.all(
      route.resources.map(async (resourceName) => {
        const loader = this.__resourceLoaders.get(resourceName);
        if (!loader) return;
        
        try {
          await loader(context);
        } catch (error) {
          console.error(`Error loading resource ${resourceName}:`, error);
          throw error;
        }
      })
    );
  }

  getState(): URLState {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this);
    }
    return this._state;
  }

  /**
   * Check if currently in a loading state
   */
  isLoading(): boolean {
    return this.__navigationState.isLoading;
  }

  /**
   * Navigate to a URL
   */
  navigate(options: NavigateOptions = {}): void {
    const {
      path,
      params = {},
      hashParams = {},
      focusSelector,
      pageTitle,
      announcement,
      updateCurrentPage = true,
      fullReplace = false
    } = options;

    // If navigation is pending, defer
    if (this.__navigationState.isPending) {
      setTimeout(() => this.navigate(options), 100);
      return;
    }

    let newUrl = new URL(window.location.href);
    let newHash = '#';

    // Preserve existing hashPaths if path not provided
    const currentState = this.getState();
    const hashPaths = path !== undefined
      ? path.split('/').filter(Boolean)
      : currentState.hashPaths;

    newHash += hashPaths.join('/');

    const searchParams = new URLSearchParams();
    const hashSearchParams = new URLSearchParams();

    if (!fullReplace) {
      Object.entries(currentState.params).forEach(([key, value]) => searchParams.set(key, value));
      Object.entries(currentState.hashParams).forEach(([key, value]) => hashSearchParams.set(key, value));
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    });

    Object.entries(hashParams).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        hashSearchParams.delete(key);
      } else {
        hashSearchParams.set(key, value);
      }
    });

    const searchString = searchParams.toString();
    const hashSearchString = hashSearchParams.toString();

    if (searchString) {
      newHash += '?' + searchString;
    }
    if (hashSearchString) {
      newHash += '#' + hashSearchString;
    }

    // Skip if hash hasn't changed
    if (newUrl.hash === newHash) return;

    newUrl.hash = newHash;
    window.history.pushState(null, '', newUrl.toString());

    // Trigger hash change handling
    this.__updateStore();

    // Handle accessibility
    if (focusSelector) {
      setTimeout(() => {
        const targetElement = document.querySelector(focusSelector);
        if (targetElement) (targetElement as HTMLElement).focus();
      }, 0);
    }

    // Set page title
    if (pageTitle) {
      document.title = pageTitle;
    } else if (path) {
      // Set default page title based on the domain and hash path
      const domain = window.location.hostname;
      const formattedDomain = domain.split('.').map(segment =>
        segment.charAt(0).toUpperCase() + segment.slice(1)
      ).join('.');

      const pathSegments = path.split('/').filter(Boolean);
      const formattedPath = pathSegments.map(segment =>
        segment.charAt(0).toUpperCase() + segment.slice(1)
      ).join(' - ');

      document.title = `${formattedDomain} | ${formattedPath}`;
    }

    // Handle screen reader announcement
    if (announcement) {
      const liveRegion = document.getElementById('liveRegion');
      if (liveRegion) {
        liveRegion.textContent = announcement;
      }
    } else if (path) {
      const pathSegments = path.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1] || 'home page';
      const liveRegion = document.getElementById('liveRegion');
      if (liveRegion) {
        liveRegion.textContent = `Navigated to ${lastSegment}`;
      }
    }

    if (updateCurrentPage) {
      document.querySelectorAll('[aria-current="page"]')
        .forEach(el => el.removeAttribute('aria-current'));
      
      const currentPageLink = document.querySelector(`a[href="#/${path}"]`);
      if (currentPageLink) {
        currentPageLink.setAttribute('aria-current', 'page');
      }
    }
  }

  matches(stateSlice: Partial<URLState>): boolean {
    const currentState = this.getState();

    for (const key in stateSlice) {
      if (Object.hasOwn(stateSlice, key)) {
        if (key === 'hashPaths') {
          if (!this._isArrayPrefix(currentState.hashPaths, stateSlice.hashPaths!)) {
            return false;
          }
        } else if (['params', 'hashParams'].includes(key)) {
          const stateSliceKey = key as 'params' | 'hashParams';
          for (const paramKey in stateSlice[stateSliceKey]) {
            // Get values to compare
            const currentValue = currentState[stateSliceKey][paramKey];
            const sliceValue = stateSlice[stateSliceKey]![paramKey];
            
            // Use deep equality for objects
            if (typeof currentValue === 'object' && currentValue !== null &&
                typeof sliceValue === 'object' && sliceValue !== null) {
              if (!_deepEqual(currentValue, sliceValue)) {
                return false;
              }
            } else if (currentValue !== sliceValue) {
              return false;
            }
          }
        } else {
          // Use deep equality for other object values
          const currentValue = currentState[key as keyof URLState];
          const sliceValue = stateSlice[key as keyof URLState];
          
          if (typeof currentValue === 'object' && currentValue !== null &&
              typeof sliceValue === 'object' && sliceValue !== null) {
            if (!_deepEqual(currentValue, sliceValue)) {
              return false;
            }
          } else if (currentValue !== sliceValue) {
            return false;
          }
        }
      }
    }

    return true;
  }

  isEmpty(): boolean {
    const { hashPaths, params, hashParams } = this.getState();
    return (
      hashPaths.length === 0 &&
      Object.keys(params).length === 0 &&
      Object.keys(hashParams).length === 0 &&
      !hashPaths.some(path => path.trim() !== '')
    );
  }

  private _isArrayPrefix(arr: string[], prefix: string[]): boolean {
    if (prefix.length > arr.length) return false;
    return prefix.every((value, index) => value === arr[index]);
  }
}

// Singleton instance
let urlStoreInstance: URLStore | null = null;

/**
 * Creates or returns the singleton instance of URLStore
 */
const createURLStore = (options: URLStoreOptions = {}): URLStore => {
  if (!urlStoreInstance) {
    urlStoreInstance = new URLStore(options);
  } else if (options.onChange) {
    urlStoreInstance.subscribe(options.onChange);
  }
  return urlStoreInstance;
};

// Export types for external use
export type {
  URLState,
  RouteConfig,
  RouteEnterContext,
  RouteLeaveContext,
  NavigationHookContext,
  ResourceLoaderContext,
  RouteDefinition,
  NavigationState,
  NavigateOptions,
  URLStoreOptions,
  NavigationHook,
  ResourceLoader
};

export { createURLStore };