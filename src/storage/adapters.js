import { validateType } from '../types.js';
import { __trace } from '../trace.js';

function unproxify(obj) {
  const getType = (value) => {
    if (typeof value !== 'object' || value === null) return 'primitive';
    if (Array.isArray(value)) return 'array';
    return 'object';
  };

  switch (getType(obj)) {
    case 'primitive':
      return obj;
    case 'array':
      return obj.map(unproxify);
    case 'object':
      const result = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = unproxify(obj[key]);
        }
      }
      return result;
    default:
      throw new Error(`Unsupported type: ${getType(obj)}`);
  }
}

function updateDeep(obj, path, value) {
  const [head, ...rest] = path;
  const type = rest.length === 0 ? 'terminal' : 'recursive';

  switch (type) {
    case 'terminal':
      return { ...obj, [head]: value };
    case 'recursive':
      return {
        ...obj,
        [head]: updateDeep(obj[head] || {}, rest, value)
      };
    default:
      throw new Error(`Unsupported path type: ${type}`);
  }
}

function removeDeep(obj, path) {
  const [head, ...rest] = path;
  if (rest.length === 0) {
    const { [head]: _, ...newObj } = obj;
    return newObj;
  }
  return {
    ...obj,
    [head]: removeDeep(obj[head] || {}, rest)
  };
}


export function createIdbPromise({
  name,
  version,
  storeName,
  keyPath,
  indexName
}) {
  // Guard clauses
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('name must be a non-empty string');
  }
  if (!Number.isInteger(version) || version <= 0) {
    throw new Error('version must be a positive integer');
  }
  if (typeof storeName !== 'string' || storeName.trim() === '') {
    throw new Error('storeName must be a non-empty string');
  }
  if (typeof keyPath !== 'string' || keyPath.trim() === '') {
    throw new Error('keyPath must be a non-empty string');
  }
  if (typeof indexName !== 'string' || indexName.trim() === '') {
    throw new Error('indexName must be a non-empty string');
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onerror = (event) => reject("IndexedDB error: " + event.target.error);
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve({
        /**
         * Retrieves data from the IndexedDB store based on the provided options.
         * @param {Object} [options={}] - Query options for retrieving data.
         * @param {string} [options.type='all'] - The type of query to perform. Can be one of:
         *   'key', 'index', 'all', 'range', 'cursor', 'count', 'keys', or 'unique'.
         * @param {*} [options.key] - The key to retrieve when type is 'key'.
         *   Example: { type: 'key', key: 123 }
         * @param {string} [options.index] - The name of the index to use for 'index', 'range', 'cursor', 'count', 'keys', or 'unique' queries.
         *   Example: { type: 'index', index: 'nameIndex', value: 'John' }
         * @param {*} [options.value] - The value to search for in an index query.
         *   Example: { type: 'index', index: 'ageIndex', value: 30 }
         * @param {*} [options.lower] - The lower bound for a range query.
         *   Example: { type: 'range', index: 'dateIndex', lower: '2023-01-01', upper: '2023-12-31' }
         * @param {*} [options.upper] - The upper bound for a range query.
         *   Example: { type: 'range', index: 'priceIndex', lower: 10, upper: 100 }
         * @param {boolean} [options.lowerOpen] - Whether the lower bound is open in a range query.
         *   Example: { type: 'range', index: 'scoreIndex', lower: 50, upper: 100, lowerOpen: true }
         * @param {boolean} [options.upperOpen] - Whether the upper bound is open in a range query.
         *   Example: { type: 'range', index: 'scoreIndex', lower: 50, upper: 100, upperOpen: true }
         * @param {IDBKeyRange} [options.range] - The key range for cursor, count, or keys queries.
         *   Example: { type: 'cursor', range: IDBKeyRange.bound(50, 100) }
         * @param {IDBCursorDirection} [options.direction] - The direction for a cursor query.
         *   Example: { type: 'cursor', range: IDBKeyRange.lowerBound(50), direction: 'prev' }
         * @param {number} [options.limit] - The maximum number of results to return for a unique query.
         *   Example: { type: 'unique', index: 'categoryIndex', limit: 5 }
         * @returns {Promise<*>} A promise that resolves with the query results.
         *
         * Examples:
         * - Get all records: { type: 'all' }
         * - Count records: { type: 'count', range: IDBKeyRange.lowerBound(18) }
         * - Get keys: { type: 'keys', index: 'dateIndex', range: IDBKeyRange.bound('2023-01-01', '2023-12-31') }
         */
        getState: async (options = { type: 'all' }) => {
          /**
           * Builds and executes an IndexedDB request based on the provided options.
           * @param {Object} params - The parameters for building the request.
           * @param {IDBObjectStore} params.store - The IndexedDB object store to query.
           * @param {Object} params.options - The query options (same as getState options).
           * @returns {IDBRequest|Promise<Array>} The IndexedDB request or a Promise for cursor queries.
           */
          const buildIdbRequest = ({ store, options }) => {
            switch (options.type) {
              case 'key':
                if (typeof options.key === 'undefined') {
                  throw new Error('Key must be provided for key-based query');
                }
                return store.get(options.key);

              case 'index':
                if (typeof options.index === 'undefined' || typeof options.value === 'undefined') {
                  throw new Error('Index and value must be provided for index-based query');
                }
                const index = store.index(options.index);
                return index.getAll(options.value);

              case 'all':
                return store.getAll();

              case 'range':
                const range = IDBKeyRange.bound(options.lower, options.upper, options.lowerOpen, options.upperOpen);
                return options.index
                  ? store.index(options.index).getAll(range)
                  : store.getAll(range);

              case 'cursor':
                const cursorRequest = options.index
                  ? store.index(options.index).openCursor(options.range, options.direction)
                  : store.openCursor(options.range, options.direction);
                return new Promise((resolve, reject) => {
                  const results = [];
                  cursorRequest.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                      results.push(cursor.value);
                      cursor.continue();
                    } else {
                      resolve(results);
                    }
                  };
                  cursorRequest.onerror = reject;
                });

              case 'count':
                return options.index
                  ? store.index(options.index).count(options.range)
                  : store.count(options.range);

              case 'keys':
                return options.index
                  ? store.index(options.index).getAllKeys(options.range)
                  : store.getAllKeys(options.range);

              case 'unique':
                if (!options.index) throw new Error('Index must be specified for unique query');
                return store.index(options.index).getAll(options.range, options.limit);

              default:
                throw new Error(`Unsupported query type: ${options.type}`);
            }
          };

          return new Promise((resolveQuery, rejectQuery) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = buildIdbRequest({ store, options });

            request.onsuccess = (event) => resolveQuery(event.target.result);
            request.onerror = (event) => rejectQuery(event.target.error);
          });
        },
        transaction: (mode) => db.transaction(storeName, mode),
        storeName: storeName,
      });
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const oldVersion = event.oldVersion;

      const upgradeType = (() => {
        if (oldVersion === 0) return 'create';
        if (oldVersion < version) return 'recreate';
        return 'update';
      })();

      switch (upgradeType) {
        case 'create':
          const store = db.createObjectStore(storeName, { keyPath, autoIncrement: true });
          store.createIndex(indexName, indexName, { unique: false });
          break;
        case 'recreate':
          db.deleteObjectStore(storeName);
          upgradeActions.create();
          break;
        case 'update':
          console.log('Database is up to date');
          break;
        default:
          throw new Error(`Unsupported upgrade type: ${upgradeType}`);
      }
    };
  });
}

export function persistToIdbThunk({
  fromStateKey,
  toIDBStore
}) {
  return async ({ action, patches }) => {
    if (!Array.isArray(patches)) {
      throw new Error('patches must be an array');
    }

    return new Promise((resolve, reject) => {
      const tx = toIDBStore.transaction("readwrite");
      const store = tx.objectStore(toIDBStore.storeName);
      const updateLogs = [];

      const relevantPatches = patches.filter(patch => {
        const pathArray = Array.isArray(patch.path) ? patch.path : patch.path.split('/').filter(Boolean);
        return pathArray.join('.').startsWith(fromStateKey);
      });

      if (relevantPatches.length === 0) {
        resolve();
        return;
      }

      let state = null;
      const getState = () => {
        if (state === null) {
          return new Promise((resolveState) => {
            store.getAll().onsuccess = (event) => {
              state = event.target.result;
              resolveState(state);
            };
          });
        }
        return Promise.resolve(state);
      };

      const applyPatches = async () => {
        const getOperationType = (patch, relativePath) => {
          if (relativePath.length === 0) return patch.op === 'remove' ? 'removeAll' : 'replaceAll';
          const index = parseInt(relativePath[0], 10);
          if (isNaN(index)) return 'invalid';
          if (relativePath.length === 1) return patch.op === 'remove' ? 'removeAtIndex' : 'modifyAtIndex';
          return 'modifyNested';
        };

        for (const patch of relevantPatches) {
          const pathArray = Array.isArray(patch.path) ? patch.path : patch.path.split('/').filter(Boolean);
          const relativePath = pathArray.slice(fromStateKey.split('.').length);

          state = await getState();

          const operationType = getOperationType(patch, relativePath);
          const index = parseInt(relativePath[0], 10);

          switch (operationType) {
            case 'replaceAll':
              updateLogs.push(`replaced entire data array with ${patch.value.length} items`);
              state = unproxify(patch.value);
              break;
            case 'removeAll':
              updateLogs.push('removed all items');
              state = [];
              break;
            case 'modifyAtIndex':
              updateLogs.push(`${patch.op === 'add' ? 'added' : 'replaced'} item at index ${index}`);
              state = [
                ...state.slice(0, index),
                unproxify(patch.value),
                ...state.slice(index + 1)
              ];
              break;
            case 'removeAtIndex':
              updateLogs.push(`removed item at index ${index}`);
              state = [
                ...state.slice(0, index),
                ...state.slice(index + 1)
              ];
              break;
            case 'modifyNested':
              updateLogs.push(`updated ${relativePath.join('.')} of item at index ${index}`);
              state = [
                ...state.slice(0, index),
                updateDeep(state[index], relativePath.slice(1), unproxify(patch.value)),
                ...state.slice(index + 1)
              ];
              break;
            case 'invalid':
              console.warn('Invalid index:', relativePath[0]);
              break;
            default:
              console.warn('Unsupported operation:', patch.op);
          }
        }

        await new Promise((resolveDelete) => {
          const deleteRequest = store.clear();
          deleteRequest.onsuccess = resolveDelete;
        });

        for (const item of state) {
          await new Promise((resolvePut) => {
            const putRequest = store.put(item);
            putRequest.onsuccess = resolvePut;
          });
        }
      };

      applyPatches().then(() => {
        tx.oncomplete = () => {
          const updateLogsSummary = updateLogs.join(', ');
          __trace(`indexdb:oncomplete`, `Mutated ${toIDBStore.storeName} object store with ${updateLogsSummary}`);
          resolve();
        };
      }).catch(reject);

      tx.onerror = (event) => reject(event.target.error);
    });
  };
}

const VERSION_KEY_PREFIX = '__cami_ls_version_';

export function createLocalStorage({
  name,
  version,
}) {
  // Guard clauses
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('name must be a non-empty string');
  }
  if (!Number.isInteger(version) || version <= 0) {
    throw new Error('version must be a positive integer');
  }

  const versionKey = `${VERSION_KEY_PREFIX}${name}`;

  const checkVersion = () => {
    const storedVersion = localStorage.getItem(versionKey);
    if (storedVersion === null) {
      localStorage.setItem(versionKey, version.toString());
      return 'create';
    }
    if (parseInt(storedVersion, 10) < version) {
      localStorage.setItem(versionKey, version.toString());
      return 'update';
    }
    return 'current';
  };

  const versionStatus = checkVersion();
  if (versionStatus === 'update') {
    localStorage.removeItem(name);
    __trace(`localStorage:version`, `Updated ${name} from version ${localStorage.getItem(versionKey)} to ${version}`);
  } else if (versionStatus === 'create') {
    __trace(`localStorage:version`, `Created ${name} with version ${version}`);
  }

  return {
    getState: async () => {
      return new Promise((resolve) => {
        const data = localStorage.getItem(name);
        resolve(data ? JSON.parse(data) : null);
      });
    },

    setState: async (state) => {
      return new Promise((resolve) => {
        localStorage.setItem(name, JSON.stringify(state));
        resolve();
      });
    },

    name,
    version,
  };
}

export function persistToLocalStorageThunk(toLocalStorage) {
  return async ({ action, state, previousState }) => {
    if (state !== previousState) {
      await toLocalStorage.setState(state);
      __trace(`localStorage:update`, `Updated ${toLocalStorage.name} with entire state`);
    }
  };
}
