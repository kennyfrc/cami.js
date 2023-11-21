/**
 * @license
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */

// Axios-like HTTP client
/**
 * @function http
 * @param {Object|string} config - The configuration object or URL string
 * @returns {Promise} - Returns a Promise that resolves to the response data
 * @example
 * // GET request
 * http('https://jsonplaceholder.typicode.com/posts')
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 *
 * // POST request
 * http({
 *   method: 'POST',
 *   url: 'https://jsonplaceholder.typicode.com/posts',
 *   data: { title: 'foo', body: 'bar', userId: 1 },
 *   headers: { 'Content-type': 'application/json; charset=UTF-8' }
 * })
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
const http = (config) => {
  if (typeof config === 'string') {
    return http.get(config);
  }

  return new Promise((resolve, reject) => {
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
      resolve(response);
    };

    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(config.data ? JSON.stringify(config.data) : null);
  });
};

/**
 * @function http.get
 * @param {string} url - The URL to send the GET request to
 * @param {Object} [config={}] - Optional configuration object
 * @returns {Promise} - Returns a Promise that resolves to the response data
 * @example
 * // GET request
 * http.get('https://jsonplaceholder.typicode.com/posts')
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
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
 * @returns {Promise} - Returns a Promise that resolves to the response data
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
 * @returns {Promise} - Returns a Promise that resolves to the response data
 * @example
 * // PUT request
 * http.put('https://jsonplaceholder.typicode.com/posts/1', { id: 1, title: 'foo', body: 'bar', userId: 1 })
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
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
 * @returns {Promise} - Returns a Promise that resolves to the response data
 * @example
 * // PATCH request
 * http.patch('https://jsonplaceholder.typicode.com/posts/1', { title: 'foo' })
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
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
 * @returns {Promise} - Returns a Promise that resolves to the response data
 * @example
 * // DELETE request
 * http.delete('https://jsonplaceholder.typicode.com/posts/1')
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
http.delete = (url, config = {}) => {
  config.url = url;
  config.method = 'DELETE';
  return http(config);
};

export { http };
