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
  });

  it('should initialize with the correct initial state', () => {
    expect(urlStore.url).toEqual({
      params: {},
      hashPaths: [],
      hashParams: {}
    });
  });

  it('should update state when navigating', () => {
    urlStore.navigate({ path: 'inbox/123', params: { filter: 'unread' } });
    expect(urlStore.url).toEqual({
      params: { filter: 'unread' },
      hashPaths: ['inbox', '123'],
      hashParams: {}
    });
  });

  it('should handle hash parameters', () => {
    urlStore.navigate({ path: 'sent/456', hashParams: { sort: 'date' } });
    expect(urlStore.url).toEqual({
      params: {},
      hashPaths: ['sent', '456'],
      hashParams: { sort: 'date' }
    });
  });

  it('should update watchers when state changes', async () => {
    let callCount = 0;
    const watchPromise = new Promise(resolve => {
      urlStore.watch(() => {
        callCount++;
        if (callCount === 2) {
          resolve();
        }
      });
    });

    urlStore.navigate({ path: 'draft/789' });
    await watchPromise;
  });

  it('should handle full hash replace navigation', () => {
    urlStore.navigate({ path: 'inbox/123', params: { filter: 'unread' } });
    urlStore.navigate({
      path: 'full/replace',
      params: { newParam: 'value' },
      hashParams: { newHashParam: 'value' },
      fullReplace: true
    });

    expect(urlStore.url).toEqual({
      params: { newParam: 'value' },
      hashPaths: ['full', 'replace'],
      hashParams: { newHashParam: 'value' }
    });
  });

  it('should clear all when navigating with empty path and fullReplace', () => {
    urlStore.navigate({ path: 'inbox/123', params: { filter: 'unread' }, hashParams: { sort: 'date' } });
    urlStore.navigate({ path: '', fullReplace: true });

    expect(urlStore.url).toEqual({
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
    expect(document.title).toEqual('Profile | My SPA');
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
});
