/**
 * @license
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */

import { ObservableStream } from './observables/observable-stream.js';

/**
 * @class HTTPStream
 * @extends ObservableStream
 * @description A class that extends ObservableStream and provides additional methods for handling HTTP requests.
 */
class HTTPStream extends ObservableStream {
  _handlers = {};

  /**
   * @method toJson
   * @memberof HTTPStream
   * @description Converts the response data to JSON.
   * @returns {Promise} A promise that resolves to the JSON data.
   * @example
   * http('https://api.example.com/data')
   *   .toJson()
   *   .then(data => console.log(data))
   *   .catch(error => console.error(error));
   */
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

  /**
   * @method on
   * @memberof HTTPStream
   * @description Registers an event handler for a specified event.
   * @param {string} event - The event to register the handler for.
   * @param {function} handler - The handler function.
   * @returns {HTTPStream} The HTTPStream instance.
   */
  on(event, handler) {
    if (!this._handlers[event]) {
      this._handlers[event] = [];
    }
    this._handlers[event].push(handler);
    return this;
  }
}

/**
 * @function http
 * @description Sends an HTTP request.
 * @param {Object|string} config - The configuration object or URL string.
 * @returns {HTTPStream} An HTTPStream that resolves to the response data.
 * @example
 * http('https://api.example.com/data')
 *   .tap(data => console.log(data))
 *   .catchError(error => console.error(error));
 **/
const http = (config) => {
  if (typeof config === 'string') {
    return http.get(config);
  }

  return new HTTPStream((observer) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method || 'GET', config.url);

    if (config.headers) {
      Object.keys(config.headers).forEach((key) => {
        xhr.setRequestHeader(key, config.headers[key]);
      });
    }

    xhr.onload = () => {
      let response = xhr.responseText;
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

    return () => {
      xhr.abort();
    };
  });
};

/**
 * @function http.get
 * @description Sends a GET request.
 * @param {string} url - The URL to send the GET request to.
 * @param {Object} [config={}] - Optional configuration object.
 * @returns {HTTPStream} An HTTPStream that resolves to the response data.
 * @example
 * http.get('https://api.example.com/data')
 *   .tap(data => console.log(data))
 *   .catchError(error => console.error(error));
 */
http.get = (url, config = {}) => {
  config.url = url;
  config.method = 'GET';
  return http(config);
};

/**
 * @function http.post
 * @description Sends a POST request.
 * @param {string} url - The URL to send the POST request to.
 * @param {Object} [data={}] - The data to send in the body of the POST request.
 * @param {Object} [config={}] - Optional configuration object.
 * @returns {HTTPStream} An HTTPStream that resolves to the response data.
 * @example
 * http.post('https://jsonplaceholder.typicode.com/posts', { title: 'foo', body: 'bar', userId: 1 })
 *   .tap(data => console.log(data))
 *   .catchError(error => console.error(error));
 */
http.post = (url, data = {}, config = {}) => {
  config.url = url;
  config.data = data;
  config.method = 'POST';
  return http(config);
};

/**
 * @function http.put
 * @description Sends a PUT request.
 * @param {string} url - The URL to send the PUT request to.
 * @param {Object} [data={}] - The data to send in the body of the PUT request.
 * @param {Object} [config={}] - Optional configuration object.
 * @returns {HTTPStream} An HTTPStream that resolves to the response data.
 * @example
 * http.put('https://jsonplaceholder.typicode.com/posts/1', { id: 1, title: 'foo', body: 'bar', userId: 1 })
 *   .tap(data => console.log(data))
 *   .catchError(error => console.error(error));
 */
http.put = (url, data = {}, config = {}) => {
  config.url = url;
  config.data = data;
  config.method = 'PUT';
  return http(config);
};

/**
 * @function http.patch
 * @description Sends a PATCH request.
 * @param {string} url - The URL to send the PATCH request to.
 * @param {Object} [data={}] - The data to send in the body of the PATCH request.
 * @param {Object} [config={}] - Optional configuration object.
 * @returns {HTTPStream} An HTTPStream that resolves to the response data.
 * @example
 * http.patch('https://jsonplaceholder.typicode.com/posts/1', { title: 'foo' })
 *   .tap(data => console.log(data))
 *   .catchError(error => console.error(error));
 */
http.patch = (url, data = {}, config = {}) => {
  config.url = url;
  config.data = data;
  config.method = 'PATCH';
  return http(config);
};

/**
 * @function http.delete
 * @description Sends a DELETE request.
 * @param {string} url - The URL to send the DELETE request to.
 * @param {Object} [config={}] - Optional configuration object.
 * @returns {HTTPStream} An HTTPStream that resolves to the response data.
 * @example
 * http.delete('https://jsonplaceholder.typicode.com/posts/1')
 *   .tap(data => console.log(data))
 *   .catchError(error => console.error(error));
 */
http.delete = (url, config = {}) => {
  config.url = url;
  config.method = 'DELETE';
  return http(config);
};

/**
 * @function http.sse
 * @description Establishes a Server-Sent Events connection.
 * @param {string} url - The URL to establish a Server-Sent Events connection.
 * @param {Object} [config={}] - Optional configuration object.
 * @returns {HTTPStream} An HTTPStream with methods to register event handlers, handle errors, and close the connection.
 * @example
 * const stream = http.sse('https://api.example.com/events');
 * stream.on('message', event => console.log(event.data));
 * stream.catchError(error => console.error(error));
 */
http.sse = (url, config = {}) => {
  const stream = new HTTPStream((observer) => {
    const source = new EventSource(url, config);

    source.onmessage = (event) => {
      if (stream._handlers[event.type]) {
        stream._handlers[event.type].forEach(handler => handler(event));
      }
      observer.next(event);
    };
    source.onerror = (error) => observer.error(error);

    return () => {
      source.close();
    };
  });

  return stream;
};

export { http };
