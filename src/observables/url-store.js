import { Observable } from './observable.js';
import { DependencyTracker } from './observable-state.js';

class URLStore extends Observable {
  constructor() {
    super();
    this._state = this.__parseURL();
    this.__name = 'URLStore';

    window.addEventListener('load', () => this.__updateStore());
    window.addEventListener('hashchange', () => this.__updateStore());
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

  __updateStore() {
    const newState = this.__parseURL();
    if (JSON.stringify(this._state) !== JSON.stringify(newState)) {
      this._state = newState;
      this.next(this._state);
    }
  }

  getState() {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this);
    }
    return this._state;
  }

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

    let newUrl = new URL(window.location.href);
    let newHash = '#';

    // Preserve existing hashPaths if path is not provided
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
      document.querySelectorAll('[aria-current="page"]').forEach(el => el.removeAttribute('aria-current'));
      const currentPageLink = document.querySelector(`a[href="#/${path}"]`);
      if (currentPageLink) {
        currentPageLink.setAttribute('aria-current', 'page');
      }
    }
  }

  matches(stateSlice) {
    const currentState = this.getState();

    for (const key in stateSlice) {
      if (stateSlice.hasOwnProperty(key)) {
        if (key === 'hashPaths') {
          // For hashPaths, check if the provided array is a prefix of the current hashPaths
          if (!this._isArrayPrefix(currentState.hashPaths, stateSlice.hashPaths)) {
            return false;
          }
        } else if (['params', 'hashParams'].includes(key)) {
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
            return false;
          }
        }
      }
    }

    return true;
  }

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

    return (
      hashPaths.length === 0 &&
      Object.keys(params).length === 0 &&
      Object.keys(hashParams).length === 0 &&
      !hashPaths.some(path => path.trim() !== '')
    );
  }

  _isArrayPrefix(arr, prefix) {
    if (prefix.length > arr.length) {
      return false;
    }
    return prefix.every((value, index) => value === arr[index]);
  }
}

const createURLStore = () => new URLStore();

export { createURLStore };
