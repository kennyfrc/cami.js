const createURLStore = () => {
    let listeners = new Set();
    let store = parseURL();

    function parseURL() {
        const hash = window.location.hash.slice(1); // Remove the leading '#'
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

    function updateStore() {
        store = parseURL();
        notifyListeners();
    }

    function notifyListeners() {
        listeners.forEach(listener => listener());
    }

    // Handle initial load and hash changes
    window.addEventListener('load', updateStore);
    window.addEventListener('hashchange', updateStore);

    function validateString(value, name) {
        if (typeof value !== 'string') {
            throw new Error(`${name} must be a string`);
        }
    }

    function validateStringArray(value, name) {
        if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
            throw new Error(`${name} must be an array of strings`);
        }
    }

    return {
        get url() {
            return store;
        },
        watch(callback) {
            listeners.add(callback);
            callback();
            return () => listeners.delete(callback);
        },
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

            validateString(path, 'Navigation path');

            let newHash = '#';

            if (path !== '' || !fullReplace) {
                const hashPaths = path.split('/').filter(Boolean);
                newHash += hashPaths.join('/');
            }

            const searchParams = new URLSearchParams();
            const hashSearchParams = new URLSearchParams();

            if (!fullReplace) {
                // Preserve existing params and hashParams if not fullReplace
                Object.entries(store.params).forEach(([key, value]) => searchParams.set(key, value));
                Object.entries(store.hashParams).forEach(([key, value]) => hashSearchParams.set(key, value));
            }

            // Add new params and hashParams
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

            // Preserve the original path and query parameters
            const currentUrl = new URL(window.location.href);
            currentUrl.hash = newHash;
            window.history.pushState(null, '', currentUrl.toString());

            // Update the store after changing the hash
            updateStore();

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
                // Set a default page title based on the path
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
                // Set a default announcement based on the path
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
    };
};

export { createURLStore };
