import { validateType } from '../types.js';
import { __trace } from '../trace.js';

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
        getState: async (options = {}) => {
          return new Promise((resolveQuery, rejectQuery) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            let request;

            if (options.key) {
              request = store.get(options.key);
            } else if (options.index && options.value) {
              const index = store.index(options.index);
              request = index.getAll(options.value);
            } else {
              request = store.getAll();
            }

            request.onsuccess = (event) => resolveQuery(event.target.result);
            request.onerror = (event) => rejectQuery(event.target.error);
          });
        },
        transaction: (mode) => db.transaction(storeName, mode),
        storeName: storeName, // Add this line to include the storeName
      });
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (event.oldVersion < version) {
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
        }
      }
      const store = db.createObjectStore(storeName, { keyPath, autoIncrement: true });
      store.createIndex(indexName, indexName, { unique: false });
    };
  });
}

function unproxify(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(unproxify);
  }
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = unproxify(obj[key]);
    }
  }
  return result;
}

function updateDeep(obj, path, value) {
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...obj, [head]: value };
  }
  return {
    ...obj,
    [head]: updateDeep(obj[head] || {}, rest, value)
  };
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
      const updates = [];

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
        for (const patch of relevantPatches) {
          const pathArray = Array.isArray(patch.path) ? patch.path : patch.path.split('/').filter(Boolean);
          const relativePath = pathArray.slice(fromStateKey.split('.').length);

          state = await getState();

          switch (patch.op) {
            case 'add':
            case 'replace':
              if (relativePath.length === 0) {
                updates.push(`replaced entire data array with ${patch.value.length} items`);
                state = unproxify(patch.value);
              } else {
                const index = parseInt(relativePath[0], 10);
                if (isNaN(index)) {
                  console.warn('Invalid index:', relativePath[0]);
                  continue;
                }
                if (relativePath.length === 1) {
                  updates.push(`${patch.op === 'add' ? 'added' : 'replaced'} item at index ${index}`);
                  state = [
                    ...state.slice(0, index),
                    unproxify(patch.value),
                    ...state.slice(index + 1)
                  ];
                } else {
                  updates.push(`updated ${relativePath.join('.')} of item at index ${index}`);
                  state = [
                    ...state.slice(0, index),
                    updateDeep(state[index], relativePath.slice(1), unproxify(patch.value)),
                    ...state.slice(index + 1)
                  ];
                }
              }
              break;
            case 'remove':
              if (relativePath.length === 0) {
                updates.push('removed all items');
                state = [];
              } else {
                const index = parseInt(relativePath[0], 10);
                if (isNaN(index)) {
                  console.warn('Invalid index:', relativePath[0]);
                  continue;
                }
                if (relativePath.length === 1) {
                  updates.push(`removed item at index ${index}`);
                  state = [...state.slice(0, index), ...state.slice(index + 1)];
                } else {
                  updates.push(`removed ${relativePath.slice(1).join('.')} from item at index ${index}`);
                  const newItem = { ...state[index] };
                  let current = newItem;
                  for (let i = 1; i < relativePath.length - 1; i++) {
                    if (!current[relativePath[i]]) break;
                    current[relativePath[i]] = { ...current[relativePath[i]] };
                    current = current[relativePath[i]];
                  }
                  delete current[relativePath[relativePath.length - 1]];
                  state = [
                    ...state.slice(0, index),
                    newItem,
                    ...state.slice(index + 1)
                  ];
                }
              }
              break;
            default:
              console.warn('Unsupported operation:', patch.op);
          }
        }

        // Clear the store and add all items
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
          const updateSummary = updates.join(', ');
          __trace(`indexdb:oncomplete`, `Mutated ${toIDBStore.storeName} object store with ${updateSummary}`);
          resolve();
        };
      }).catch(reject);

      tx.onerror = (event) => reject(event.target.error);
    });
  };
}
