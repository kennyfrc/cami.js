/**
 * @license
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */

import { ObservableStream } from './observables/observable-stream.js';

class HTTPStream extends ObservableStream {
  _handlers = {};

  toJson() {
    return new Promise((resolve, reject) => {
      this.subscribe({
        next: data => {
          try {
            if (typeof data === 'object') {
              resolve(data);
            } else {
              resolve(JSON.parse(data));
            }
          } catch (error) {
            reject(error);
          }
        },
        error: error => reject(error)
      });
    });
  }

  on(event, handler) {
    if (!this._handlers[event]) {
      this._handlers[event] = [];
    }
    this._handlers[event].push(handler);
    return this;
  }
}

// Axios-like HTTP client
/**
 * @function http
 * @param {Object|string} config - The configuration object or URL string
 * @returns {HTTPStream} - Returns an HTTPStream that resolves to the response data
 **/
const http = (config) => {
  if (typeof config === 'string') {
    return http.get(config);
  }

  return new HTTPStream((observer) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method || 'GET', config.url);

    // Set headers
    if (config.headers) {
      Object.keys(config.headers).forEach((key) => {
        xhr.setRequestHeader(key, config.headers[key]);
      });
    }

    xhr.onload = () => {
      let response = xhr.responseText;
      // Transform response
      const transformResponse = config.transformResponse || ((data) => {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      });
      response = transformResponse(response);
      observer.next(response);
      observer.complete();
    };

    xhr.onerror = () => observer.error(xhr.statusText);
    xhr.send(config.data ? JSON.stringify(config.data) : null);

    // Return teardown function
    return () => {
      xhr.abort();
    };
  });
};

/**
 * @function http.get
 * @param {string} url - The URL to send the GET request to
 * @param {Object} [config={}] - Optional configuration object
 * @returns {HTTPStream} - Returns an HTTPStream that resolves to the response data
 */
http.get = (url, config = {}) => {
  config.url = url;
  config.method = 'GET';
  return http(config);
};

/**
 * @function http.post
 * @param {string} url - The URL to send the POST request to
 * @param {Object} [data={}] - The data to send in the body of the POST request
 * @param {Object} [config={}] - Optional configuration object
 * @returns {HTTPStream} - Returns an HTTPStream that resolves to the response data
 * @example
 * // POST request
 * http.post('https://jsonplaceholder.typicode.com/posts', { title: 'foo', body: 'bar', userId: 1 })
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
http.post = (url, data = {}, config = {}) => {
  config.url = url;
  config.data = data;
  config.method = 'POST';
  return http(config);
};

/**
 * @function http.put
 * @param {string} url - The URL to send the PUT request to
 * @param {Object} [data={}] - The data to send in the body of the PUT request
 * @param {Object} [config={}] - Optional configuration object
 * @returns {HTTPStream} - Returns an HTTPStream that resolves to the response data
 */
http.put = (url, data = {}, config = {}) => {
  config.url = url;
  config.data = data;
  config.method = 'PUT';
  return http(config);
};

/**
 * @function http.patch
 * @param {string} url - The URL to send the PATCH request to
 * @param {Object} [data={}] - The data to send in the body of the PATCH request
 * @param {Object} [config={}] - Optional configuration object
 * @returns {HTTPStream} - Returns an HTTPStream that resolves to the response data
 */
http.patch = (url, data = {}, config = {}) => {
  config.url = url;
  config.data = data;
  config.method = 'PATCH';
  return http(config);
};

/**
 * @function http.delete
 * @param {string} url - The URL to send the DELETE request to
 * @param {Object} [config={}] - Optional configuration object
 * @returns {HTTPStream} - Returns an HTTPStream that resolves to the response data
 */
http.delete = (url, config = {}) => {
  config.url = url;
  config.method = 'DELETE';
  return http(config);
};

/**
 * @function http.sse
 * @param {string} url - The URL to establish a Server-Sent Events connection
 * @param {Object} [config={}] - Optional configuration object
 * @returns {HTTPStream} - Returns an HTTPStream with methods to register event handlers, handle errors, and close the connection
 */
http.sse = (url, config = {}) => {
  const stream = new HTTPStream((observer) => {
    const source = new EventSource(url, config);

    // Handle events
    source.onmessage = (event) => {
      if (stream._handlers[event.type]) {
        stream._handlers[event.type].forEach(handler => handler(event));
      }
      observer.next(event);
    };
    source.onerror = (error) => observer.error(error);

    // Return teardown function
    return () => {
      source.close();
    };
  });

  return stream;
};

export { http };
