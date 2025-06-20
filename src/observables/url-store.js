import { Observable } from './observable.js';
import { DependencyTracker } from './observable-state.js';
<<<<<<< HEAD

class URLStore extends Observable {
  constructor() {
    super();
    this._state = this.__parseURL();
    this.__name = 'URLStore';

    window.addEventListener('load', () => this.__updateStore());
    window.addEventListener('hashchange', () => this.__updateStore());
=======
import { _deepEqual } from '../utils';

/**
 * Enhanced URLStore with resource-aware routing
 * Solves race conditions by defining route dependencies and loading resources before navigation completes
 */
class URLStore extends Observable {
  constructor({ onInit = null, onChange = null } = {}) {
    super();
    this._state = this.__parseURL();
    this.__name = 'URLStore';
    this.__onChange = onChange;
    this.__routes = new Map();
    this.__resourceLoaders = new Map();
    this.__activeRoute = null;
    this.__navigationState = {
      isPending: false,
      isLoading: false
    };
    this.__persistentParams = new Set();
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
  registerRoute(pattern, options = {}) {
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
  registerResourceLoader(resourceName, loaderFn) {
    this.__resourceLoaders.set(resourceName, loaderFn);
    return this;
  }

  /**
   * Add a hook to be executed before navigation
   */
  beforeNavigate(hookFn) {
    this.__beforeNavigateHooks.push(hookFn);
    return this;
  }

  /**
   * Add a hook to be executed after navigation
   */
  afterNavigate(hookFn) {
    this.__afterNavigateHooks.push(hookFn);
    return this;
  }

  async __initialize(onInit) {
    if (onInit) {
      try {
        await onInit(this._state);
      } catch (error) {
        console.error('Error in URLStore initialization:', error);
      }
    }
>>>>>>> session/vitest
  }

  __parseURL() {
    const hash = window.location.hash.slice(1);
    const [hashPathAndParams, hashParamsString] = hash.split('#');
    const [hashPath, queryString] = hashPathAndParams.split('?');
    const hashPaths = hashPath.split('/').filter(Boolean);

    const params = {};
    const hashParams = {};

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

<<<<<<< HEAD
  __updateStore() {
    const newState = this.__parseURL();
    if (JSON.stringify(this._state) !== JSON.stringify(newState)) {
      this._state = newState;
      this.next(this._state);
    }
=======
  /**
   * Find a matching route for the given path segments
   */
  __findMatchingRoute(pathSegments) {
    for (const [pattern, route] of this.__routes.entries()) {
      // Quick length check
      if (route.segments.length !== pathSegments.length) continue;
      
      let isMatch = true;
      const extractedParams = {};
      
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

  async __updateStore() {
    // Don't process if already navigating
    if (this.__navigationState.isPending) return;
    
    // Parse the current URL
    const urlState = this.__parseURL();
    
    // Skip if URL hasn't changed - use proper deep equality check
    // Import _deepEqual at the top of the file if not already imported
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
      if (matchingRoute?.resources?.length > 0) {
        this.__navigationState.isLoading = true;
        
        // Update URL state with extracted params
        urlState.routeParams = { ...matchingRoute.extractedParams };
        
        // Set preliminary state to show loading indicators
        this._state = { ...urlState };
        this.next(this._state);
        
        // Load resources
        await this.__loadResources(matchingRoute, urlState);
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
          params: matchingRoute.extractedParams
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
  async __loadResources(route, urlState) {
    if (!route.resources || route.resources.length === 0) return;
    
    // Build context
    const context = {
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
>>>>>>> session/vitest
  }

  getState() {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this);
    }
    return this._state;
  }

<<<<<<< HEAD
=======
  /**
   * Check if currently in a loading state
   */
  isLoading() {
    return this.__navigationState.isLoading;
  }

  /**
   * Navigate to a URL
   */
>>>>>>> session/vitest
  navigate(options = {}) {
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

<<<<<<< HEAD
    let newUrl = new URL(window.location.href);
    let newHash = '#';

    // Preserve existing hashPaths if path is not provided
=======
    // If navigation is pending, defer
    if (this.__navigationState.isPending) {
      setTimeout(() => this.navigate(options), 100);
      return;
    }

    let newUrl = new URL(window.location.href);
    let newHash = '#';

    // Preserve existing hashPaths if path not provided
>>>>>>> session/vitest
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

<<<<<<< HEAD
    newUrl.hash = newHash;

    window.history.pushState(null, '', newUrl.toString());

    this.__updateStore();

    // Handle accessibility options
    if (focusSelector) {
      setTimeout(() => {
        const targetElement = document.querySelector(focusSelector);
        if (targetElement) {
          targetElement.focus();
        }
      }, 0);
    }

=======
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
        if (targetElement) targetElement.focus();
      }, 0);
    }

    // Set page title
>>>>>>> session/vitest
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

<<<<<<< HEAD
=======
    // Handle screen reader announcement
>>>>>>> session/vitest
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
<<<<<<< HEAD
      document.querySelectorAll('[aria-current="page"]').forEach(el => el.removeAttribute('aria-current'));
=======
      document.querySelectorAll('[aria-current="page"]')
        .forEach(el => el.removeAttribute('aria-current'));
      
>>>>>>> session/vitest
      const currentPageLink = document.querySelector(`a[href="#/${path}"]`);
      if (currentPageLink) {
        currentPageLink.setAttribute('aria-current', 'page');
      }
    }
  }

  matches(stateSlice) {
    const currentState = this.getState();

    for (const key in stateSlice) {
<<<<<<< HEAD
      if (stateSlice.hasOwnProperty(key)) {
        if (key === 'hashPaths') {
          // For hashPaths, check if the provided array is a prefix of the current hashPaths
=======
      if (Object.hasOwn(stateSlice, key)) {
        if (key === 'hashPaths') {
>>>>>>> session/vitest
          if (!this._isArrayPrefix(currentState.hashPaths, stateSlice.hashPaths)) {
            return false;
          }
        } else if (['params', 'hashParams'].includes(key)) {
<<<<<<< HEAD
          // For params and hashParams, check if all provided key-value pairs match
          for (const paramKey in stateSlice[key]) {
            if (stateSlice[key].hasOwnProperty(paramKey)) {
              if (currentState[key][paramKey] !== stateSlice[key][paramKey]) {
                return false;
              }
            }
          }
        } else {
          // For any other properties, perform a strict equality check
          if (currentState[key] !== stateSlice[key]) {
=======
          for (const paramKey in stateSlice[key]) {
            // Get values to compare
            const currentValue = currentState[key][paramKey];
            const sliceValue = stateSlice[key][paramKey];
            
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
          const currentValue = currentState[key];
          const sliceValue = stateSlice[key];
          
          if (typeof currentValue === 'object' && currentValue !== null &&
              typeof sliceValue === 'object' && sliceValue !== null) {
            if (!_deepEqual(currentValue, sliceValue)) {
              return false;
            }
          } else if (currentValue !== sliceValue) {
>>>>>>> session/vitest
            return false;
          }
        }
      }
    }

    return true;
  }

<<<<<<< HEAD
  /**
   * @method isEmpty
   * @memberof URLStore
   * @returns {boolean} True if the store's state is effectively empty, false otherwise.
   * @description Checks if the internal state is effectively empty by verifying if there's any meaningful content in hashPaths, params, or hashParams.
   * @example
   * ```javascript
   * const urlStore = createURLStore();
   * console.log(urlStore.isEmpty()); // true if the store is effectively empty
   * ```
   */
  isEmpty() {
    const { hashPaths, params, hashParams } = this.getState();

=======
  isEmpty() {
    const { hashPaths, params, hashParams } = this.getState();
>>>>>>> session/vitest
    return (
      hashPaths.length === 0 &&
      Object.keys(params).length === 0 &&
      Object.keys(hashParams).length === 0 &&
      !hashPaths.some(path => path.trim() !== '')
    );
  }

  _isArrayPrefix(arr, prefix) {
<<<<<<< HEAD
    if (prefix.length > arr.length) {
      return false;
    }
=======
    if (prefix.length > arr.length) return false;
>>>>>>> session/vitest
    return prefix.every((value, index) => value === arr[index]);
  }
}

<<<<<<< HEAD
const createURLStore = () => new URLStore();
=======
// Singleton instance
let urlStoreInstance = null;

/**
 * Creates or returns the singleton instance of URLStore
 */
const createURLStore = (options = {}) => {
  if (!urlStoreInstance) {
    urlStoreInstance = new URLStore(options);
  } else if (options.onChange) {
    urlStoreInstance.subscribe(options.onChange);
  }
  return urlStoreInstance;
};
>>>>>>> session/vitest

export { createURLStore };
