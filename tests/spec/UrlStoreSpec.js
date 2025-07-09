import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';

const { createURLStore } = cami;

describe('URL Store', () => {
  let urlStore;
  let testDiv;

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    urlStore = createURLStore();
    urlStore.navigate({ path: '', fullReplace: true });
    testDiv = document.getElementById('url-store-hook-test');
    if (!testDiv) {
      testDiv = document.createElement('div');
      testDiv.id = 'url-store-hook-test';
      document.body.appendChild(testDiv);
    }
    testDiv.innerHTML = `
      <a href="#/inbox">Inbox</a>
      <a href="#/sent">Sent</a>
      <div id="liveRegion" aria-live="polite"></div>
    `;
  });

  afterEach(() => {
    window.onpopstate = null;
    window.onhashchange = null;
    if (testDiv && testDiv.parentNode) {
      testDiv.parentNode.removeChild(testDiv);
    }
    testDiv = null;
    vi.restoreAllMocks();
  });

  it('should initialize with the correct initial state', () => {
    expect(urlStore.getState()).toEqual({
      params: {},
      hashPaths: [],
      hashParams: {}
    });
  });

  it('should update state when navigating', () => {
    urlStore.navigate({ path: 'inbox/123', params: { filter: 'unread' } });
    expect(urlStore.getState()).toEqual({
      params: { filter: 'unread' },
      hashPaths: ['inbox', '123'],
      hashParams: {}
    });
  });

  it('should handle hash parameters', () => {
    urlStore.navigate({ path: 'sent/456', hashParams: { sort: 'date' } });
    expect(urlStore.getState()).toEqual({
      params: {},
      hashPaths: ['sent', '456'],
      hashParams: { sort: 'date' }
    });
  });

  it('should update subscribers when state changes', (done) => {
    let callCount = 0;
    const subscription = urlStore.subscribe(() => {
      callCount++;
      if (callCount === 1) {
        expect(urlStore.getState().hashPaths).toEqual(['draft', '789']);
        subscription.unsubscribe();
      }
    });

    urlStore.navigate({ path: 'draft/789' });
  });

  it('should handle full hash replace navigation', () => {
    urlStore.navigate({ path: 'inbox/123', params: { filter: 'unread' } });
    urlStore.navigate({
      path: 'full/replace',
      params: { newParam: 'value' },
      hashParams: { newHashParam: 'value' },
      fullReplace: true
    });

    expect(urlStore.getState()).toEqual({
      params: { newParam: 'value' },
      hashPaths: ['full', 'replace'],
      hashParams: { newHashParam: 'value' }
    });
  });

  it('should clear all when navigating with empty path and fullReplace', () => {
    urlStore.navigate({ path: 'inbox/123', params: { filter: 'unread' }, hashParams: { sort: 'date' } });
    urlStore.navigate({ path: '', fullReplace: true });

    expect(urlStore.getState()).toEqual({
      params: {},
      hashPaths: [],
      hashParams: {}
    });
  });

  it('should update document title when navigating', () => {
    urlStore.navigate({ path: 'inbox/123', pageTitle: 'Inbox | My App' });
    expect(document.title).toEqual('Inbox | My App');
  });

  it('should set default page title based on path when not provided', () => {
    urlStore.navigate({ path: 'settings/profile' });
    expect(document.title).toEqual('Localhost | Settings - Profile');
  });

  it('should update aria-current attribute for matching links', async () => {
    urlStore.navigate({ path: 'inbox' });
    await new Promise(resolve => setTimeout(resolve, 10)); // Increase the delay
    if (testDiv) {
      const inboxLink = testDiv.querySelector('a[href="#/inbox"]');
      const sentLink = testDiv.querySelector('a[href="#/sent"]');
      expect(inboxLink.getAttribute('aria-current')).toEqual('page');
      expect(sentLink.getAttribute('aria-current')).toBe(null);
    } else {
      throw new Error('Test div not found');
    }
  });

  it('should announce navigation to screen readers', () => {
    urlStore.navigate({ path: 'inbox/123', announcement: 'Navigated to inbox' });
    if (testDiv) {
      expect(testDiv.querySelector('#liveRegion').textContent).toEqual('Navigated to inbox');
    } else {
      throw new Error('Test div not found');
    }
  });

  describe('matches', () => {
    beforeEach(() => {
      urlStore.navigate({
        path: 'users/123',
        params: { filter: 'active' },
        hashParams: { view: 'details' }
      });
    });

    it('should match exact state', () => {
      expect(urlStore.matches({
        hashPaths: ['users', '123'],
        params: { filter: 'active' },
        hashParams: { view: 'details' }
      })).toBe(true);
    });

    it('should match partial hashPaths', () => {
      expect(urlStore.matches({ hashPaths: ['users'] })).toBe(true);
    });

    it('should not match incorrect hashPaths', () => {
      expect(urlStore.matches({ hashPaths: ['posts'] })).toBe(false);
    });

    it('should match partial params', () => {
      expect(urlStore.matches({ params: { filter: 'active' } })).toBe(true);
    });

    it('should not match incorrect params', () => {
      expect(urlStore.matches({ params: { filter: 'inactive' } })).toBe(false);
    });

    it('should match partial hashParams', () => {
      expect(urlStore.matches({ hashParams: { view: 'details' } })).toBe(true);
    });

    it('should not match incorrect hashParams', () => {
      expect(urlStore.matches({ hashParams: { view: 'list' } })).toBe(false);
    });

    it('should match combination of partial state properties', () => {
      expect(urlStore.matches({
        hashPaths: ['users'],
        params: { filter: 'active' }
      })).toBe(true);
    });

    it('should not match if any property does not match', () => {
      expect(urlStore.matches({
        hashPaths: ['users'],
        params: { filter: 'inactive' }
      })).toBe(false);
    });

    it('should match empty state slice', () => {
      expect(urlStore.matches({})).toBe(true);
    });

    it('should not match if hashPaths is longer than current state', () => {
      expect(urlStore.matches({ hashPaths: ['users', '123', 'extra'] })).toBe(false);
    });
  });
  
  describe('URL Store with ObservableStore Integration', () => {
    let urlStore;
    let testDiv;
    
    // Create an app store to test integration at the suite level instead of in beforeEach
    const appStore = cami.store({
      state: {
        currentView: 'home',
        user: {
          isLoggedIn: false,
          profile: null
        },
        params: {}
      },
      name: 'integration-test-store'
    });
    
    // Define app store actions at the suite level to avoid redefining in tests
    appStore.defineAction('setView', ({ state, payload }) => {
      state.currentView = payload.view;
      if (payload.id) {
        state.params.id = payload.id;
      }
    });
    
    appStore.defineAction('syncWithUrl', ({ state, payload }) => {
      state.params = payload.params || {};
      if (payload.hashPaths && payload.hashPaths.length > 0) {
        state.currentView = payload.hashPaths[0];
      }
    });
    
    beforeEach(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
      urlStore = createURLStore();
      urlStore.navigate({ path: '', fullReplace: true });
      
      // Register route handlers
      urlStore.registerRoute('profile/:id', {
        onEnter: ({ state }) => {
          // Update app store based on URL change
          appStore.dispatch('setView', {
            view: 'profile',
            id: state.routeParams.id
          });
        }
      });
      
      // Prepare test div
      testDiv = document.getElementById('url-store-hook-test');
      if (!testDiv) {
        testDiv = document.createElement('div');
        testDiv.id = 'url-store-hook-test';
        document.body.appendChild(testDiv);
      }
    });
    
    afterEach(() => {
      if (testDiv && testDiv.parentNode) {
        testDiv.parentNode.removeChild(testDiv);
      }
      testDiv = null;
    });
    
    it('should synchronize URL changes to store state', (done) => {
      // Set up subscription to detect app store changes
      const subscription = appStore.subscribe(state => {
        if (state.currentView === 'profile' && state.params.id === '123') {
          subscription.unsubscribe();
          done();
        }
      });
      
      // Navigate to trigger the route handler
      urlStore.navigate({ path: 'profile/123' });
    });
    
    it('should handle bi-directional synchronization', (done) => {
      // Create a unique store for this test
      const uniqueStoreName = 'integration-test-store-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
      const testStore = cami.store({
        state: {
          currentView: 'home',
          user: {
            isLoggedIn: false,
            profile: null
          },
          params: {}
        },
        name: uniqueStoreName
      });
      
      // Define custom sync action with unique name for this test
      const syncActionName = 'syncWithUrl_' + Math.random().toString(36).substring(2, 9);
      testStore.defineAction(syncActionName, ({ state, payload }) => {
        state.params = payload.params || {};
        if (payload.hashPaths && payload.hashPaths.length > 0) {
          state.currentView = payload.hashPaths[0];
        }
      });
      
      // Subscribe to URL store changes
      const urlSub = urlStore.subscribe(urlState => {
        if (urlState.hashPaths[0] === 'dashboard') {
          // When URL changes to dashboard, update with our unique action
          testStore.dispatch(syncActionName, urlState);
        }
      });
      
      // Subscribe to test store changes to verify sync worked
      const storeSub = testStore.subscribe(state => {
        if (state.currentView === 'dashboard') {
          // Success case - clean up and resolve test
          urlSub.unsubscribe();
          storeSub.unsubscribe();
          done();
        }
      });
      
      // Navigate to trigger the synchronization
      urlStore.navigate({ path: 'dashboard' });
    });
  });
});

describe('URL Store Resource Loading', () => {
  let urlStore;
  let testDiv;
  let resourceLoadedFlag;

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    urlStore = createURLStore();
    urlStore.navigate({ path: '', fullReplace: true });
    
    // Reset resource loading flag
    resourceLoadedFlag = false;
    
    // Setup test div
    testDiv = document.getElementById('url-store-hook-test');
    if (!testDiv) {
      testDiv = document.createElement('div');
      testDiv.id = 'url-store-hook-test';
      document.body.appendChild(testDiv);
    }
    testDiv.innerHTML = `
      <a href="#/dashboard">Dashboard</a>
      <a href="#/profile">Profile</a>
      <div id="liveRegion" aria-live="polite"></div>
      <div id="content"></div>
    `;
  });

  afterEach(() => {
    window.onpopstate = null;
    window.onhashchange = null;
    if (testDiv && testDiv.parentNode) {
      testDiv.parentNode.removeChild(testDiv);
    }
    testDiv = null;
    vi.restoreAllMocks();
  });

  it('should load resources before completing navigation', (done) => {
    // Setup a mock resource loader that sets a flag when completed
    const mockResourceLoader = async () => {
      // Simulate async resource loading
      await new Promise(resolve => setTimeout(resolve, 100));
      resourceLoadedFlag = true;
      return { success: true };
    };

    // Register the resource loader
    urlStore.registerResourceLoader('testResource', mockResourceLoader);

    // Register a route that requires this resource
    urlStore.registerRoute('dashboard', {
      resources: ['testResource'],
      onEnter: ({ state }) => {
        // This should only be called after resource loading
        expect(resourceLoadedFlag).toBe(true);
        
        // Update the content area to verify navigation completed
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
          contentDiv.textContent = 'Dashboard Loaded';
        }
        
        // Signal that the test is complete
        done();
      }
    });

    // Add a hook to verify resources aren't loaded yet when navigation starts
    urlStore.beforeNavigate(() => {
      expect(resourceLoadedFlag).toBe(false);
    });

    // Track navigation state
    let navigationCompleted = false;
    urlStore.afterNavigate(() => {
      navigationCompleted = true;
      // Resource should be loaded by this point
      expect(resourceLoadedFlag).toBe(true);
    });

    // Start navigation
    urlStore.navigate({ path: 'dashboard' });
    
    // Resource should not be loaded immediately
    expect(resourceLoadedFlag).toBe(false);
    
    // Navigation should eventually complete
    setTimeout(() => {
      expect(navigationCompleted).toBe(true);
      expect(resourceLoadedFlag).toBe(true);
      expect(document.getElementById('content').textContent).toBe('Dashboard Loaded');
      done();
    }, 150);
  });

  it('should handle multiple resources loading in parallel', (done) => {
    // Setup counters to track loading sequence
    let resource1Loaded = false;
    let resource2Loaded = false;
    
    // Create resource loaders with different timings
    const mockResource1Loader = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      resource1Loaded = true;
      return { id: 'resource1' };
    };
    
    const mockResource2Loader = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      resource2Loaded = true;
      return { id: 'resource2' };
    };

    // Register the resource loaders
    urlStore.registerResourceLoader('resource1', mockResource1Loader);
    urlStore.registerResourceLoader('resource2', mockResource2Loader);

    // Register a route requiring both resources
    urlStore.registerRoute('profile', {
      resources: ['resource1', 'resource2'],
      onEnter: ({ state }) => {
        // Both resources should be loaded by now
        expect(resource1Loaded).toBe(true);
        expect(resource2Loaded).toBe(true);
        
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
          contentDiv.textContent = 'Profile Loaded';
        }
        
        done();
      }
    });

    // Start navigation
    urlStore.navigate({ path: 'profile' });
    
    // Initially no resources should be loaded
    expect(resource1Loaded).toBe(false);
    expect(resource2Loaded).toBe(false);
    
    // After 75ms, resource1 should be loaded but not resource2
    setTimeout(() => {
      expect(resource1Loaded).toBe(true);
      expect(resource2Loaded).toBe(false);
      expect(document.getElementById('content').textContent).not.toBe('Profile Loaded');
    }, 75);
    
    // After 150ms, both resources should be loaded and navigation completed
    setTimeout(() => {
      expect(resource1Loaded).toBe(true);
      expect(resource2Loaded).toBe(true);
      expect(document.getElementById('content').textContent).toBe('Profile Loaded');
      done();
    }, 150);
  });

  it('should update navigation state correctly during resource loading', (done) => {
    // Create a slow resource loader
    const slowResourceLoader = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return { data: 'loaded' };
    };
    
    // Register resource and route
    urlStore.registerResourceLoader('slowResource', slowResourceLoader);
    urlStore.registerRoute('dashboard', {
      resources: ['slowResource']
    });
    
    // Start navigation and check loading state
    urlStore.navigate({ path: 'dashboard' });
    
    // Should be in loading state immediately after navigation
    expect(urlStore.isLoading()).toBe(true);
    
    // After resource loads, should no longer be in loading state
    setTimeout(() => {
      expect(urlStore.isLoading()).toBe(false);
      done();
    }, 150);
  });

  it('should handle errors in resource loading', (done) => {
    // Create a resource loader that fails
    const failingResourceLoader = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      throw new Error('Resource loading failed');
    };
    
    // Spy on console.error to catch the error
    vi.spyOn(console, 'error');
    
    // Register resource and route
    urlStore.registerResourceLoader('failingResource', failingResourceLoader);
    urlStore.registerRoute('error-route', {
      resources: ['failingResource']
    });
    
    // Add an afterNavigate hook to check state
    urlStore.afterNavigate(() => {
      // Should have logged an error
      expect(console.error).toHaveBeenCalled();
      done();
    });
    
    // Start navigation
    urlStore.navigate({ path: 'error-route' });
  });
});