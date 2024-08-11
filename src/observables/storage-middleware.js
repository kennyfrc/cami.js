import { openDB } from 'idb';

const createStorageMiddleware = (type, options = {}) => {
  const { name = 'cami-store', storeName = 'state' } = options;

  let storage;

  if (type === 'indexedDB') {
    const dbPromise = openDB(name, 1, {
      upgrade(db) {
        db.createObjectStore(storeName);
      },
    });

    storage = {
      getItem: async (key) => {
        const db = await dbPromise;
        return db.get(storeName, key);
      },
      setItem: async (key, value) => {
        const db = await dbPromise;
        return db.put(storeName, value, key);
      },
      removeItem: async (key) => {
        const db = await dbPromise;
        return db.delete(storeName, key);
      },
    };
  } else if (type === 'localStorage') {
    storage = {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
      removeItem: (key) => localStorage.removeItem(key),
    };
  } else {
    throw new Error(`Unsupported storage type: ${type}`);
  }

  return (store) => {
    store.storage = storage;
    store.storageName = storeName;
    return store;
  };
};

export const indexedDBMiddleware = (options) => createStorageMiddleware('indexedDB', options);
export const localStorageMiddleware = (options) => createStorageMiddleware('localStorage', options);
