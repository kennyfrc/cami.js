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
      path = '',
      params = {},
      hashParams = {},
      focusSelector,
      pageTitle,
      announcement,
      updateCurrentPage = true,
      fullReplace = false
    } = options;

    let newUrl = new URL(window.location.href);

    if (fullReplace && path === '') {
      // Clear the hash entirely
      newUrl.hash = '';
    } else {
      let newHash = '#';

      if (path !== '' || !fullReplace) {
        const hashPaths = path.split('/').filter(Boolean);
        newHash += hashPaths.join('/');
      }

      const searchParams = new URLSearchParams();
      const hashSearchParams = new URLSearchParams();

      if (!fullReplace) {
        Object.entries(this._state.params).forEach(([key, value]) => searchParams.set(key, value));
        Object.entries(this._state.hashParams).forEach(([key, value]) => hashSearchParams.set(key, value));
      }

      Object.entries(params).forEach(([key, value]) => searchParams.set(key, value));
      Object.entries(hashParams).forEach(([key, value]) => hashSearchParams.set(key, value));

      const searchString = searchParams.toString();
      const hashSearchString = hashSearchParams.toString();

      if (searchString) {
        newHash += '?' + searchString;
      }
      if (hashSearchString) {
        newHash += '#' + hashSearchString;
      }

      newUrl.hash = newHash;
    }

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
      const pathSegments = path.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1] || 'Home';
      document.title = `${lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)} | My SPA`;
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
}

const createURLStore = () => new URLStore();

export { createURLStore };
