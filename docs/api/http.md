## Classes

<dl>
<dt><a href="#HTTPStream">HTTPStream</a> ⇐ <code>ObservableStream</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#http">http(config)</a> ⇒ <code><a href="#HTTPStream">HTTPStream</a></code></dt>
<dd><p>Sends an HTTP request.</p>
</dd>
</dl>

<a name="HTTPStream"></a>

## HTTPStream ⇐ <code>ObservableStream</code>
**Kind**: global class  
**Extends**: <code>ObservableStream</code>  

* [HTTPStream](#HTTPStream) ⇐ <code>ObservableStream</code>
    * [new HTTPStream()](#new_HTTPStream_new)
    * [.toJson()](#HTTPStream.toJson) ⇒ <code>Promise</code>
    * [.on(event, handler)](#HTTPStream.on) ⇒ [<code>HTTPStream</code>](#HTTPStream)

<a name="new_HTTPStream_new"></a>

### new HTTPStream()
A class that extends ObservableStream and provides additional methods for handling HTTP requests.

<a name="HTTPStream.toJson"></a>

### HTTPStream.toJson() ⇒ <code>Promise</code>
Converts the response data to JSON.

**Kind**: static method of [<code>HTTPStream</code>](#HTTPStream)  
**Returns**: <code>Promise</code> - A promise that resolves to the JSON data.  
**Example**  
```js
http('https://api.example.com/data')
  .toJson()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```
<a name="HTTPStream.on"></a>

### HTTPStream.on(event, handler) ⇒ [<code>HTTPStream</code>](#HTTPStream)
Registers an event handler for a specified event.

**Kind**: static method of [<code>HTTPStream</code>](#HTTPStream)  
**Returns**: [<code>HTTPStream</code>](#HTTPStream) - The HTTPStream instance.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event to register the handler for. |
| handler | <code>function</code> | The handler function. |

<a name="http"></a>

## http(config) ⇒ [<code>HTTPStream</code>](#HTTPStream)
Sends an HTTP request.

**Kind**: global function  
**Returns**: [<code>HTTPStream</code>](#HTTPStream) - An HTTPStream that resolves to the response data.  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> \| <code>string</code> | The configuration object or URL string. |

**Example**  
```js
http('https://api.example.com/data')
  .tap(data => console.log(data))
  .catchError(error => console.error(error));
```

* [http(config)](#http) ⇒ [<code>HTTPStream</code>](#HTTPStream)
    * [.get(url, [config])](#http.get) ⇒ [<code>HTTPStream</code>](#HTTPStream)
    * [.post(url, [data], [config])](#http.post) ⇒ [<code>HTTPStream</code>](#HTTPStream)
    * [.put(url, [data], [config])](#http.put) ⇒ [<code>HTTPStream</code>](#HTTPStream)
    * [.patch(url, [data], [config])](#http.patch) ⇒ [<code>HTTPStream</code>](#HTTPStream)
    * [.delete(url, [config])](#http.delete) ⇒ [<code>HTTPStream</code>](#HTTPStream)
    * [.sse(url, [config])](#http.sse) ⇒ [<code>HTTPStream</code>](#HTTPStream)

<a name="http.get"></a>

### http.get(url, [config]) ⇒ [<code>HTTPStream</code>](#HTTPStream)
Sends a GET request.

**Kind**: static method of [<code>http</code>](#http)  
**Returns**: [<code>HTTPStream</code>](#HTTPStream) - An HTTPStream that resolves to the response data.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | The URL to send the GET request to. |
| [config] | <code>Object</code> | <code>{}</code> | Optional configuration object. |

**Example**  
```js
http.get('https://api.example.com/data')
  .tap(data => console.log(data))
  .catchError(error => console.error(error));
```
<a name="http.post"></a>

### http.post(url, [data], [config]) ⇒ [<code>HTTPStream</code>](#HTTPStream)
Sends a POST request.

**Kind**: static method of [<code>http</code>](#http)  
**Returns**: [<code>HTTPStream</code>](#HTTPStream) - An HTTPStream that resolves to the response data.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | The URL to send the POST request to. |
| [data] | <code>Object</code> | <code>{}</code> | The data to send in the body of the POST request. |
| [config] | <code>Object</code> | <code>{}</code> | Optional configuration object. |

**Example**  
```js
http.post('https://jsonplaceholder.typicode.com/posts', { title: 'foo', body: 'bar', userId: 1 })
  .tap(data => console.log(data))
  .catchError(error => console.error(error));
```
<a name="http.put"></a>

### http.put(url, [data], [config]) ⇒ [<code>HTTPStream</code>](#HTTPStream)
Sends a PUT request.

**Kind**: static method of [<code>http</code>](#http)  
**Returns**: [<code>HTTPStream</code>](#HTTPStream) - An HTTPStream that resolves to the response data.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | The URL to send the PUT request to. |
| [data] | <code>Object</code> | <code>{}</code> | The data to send in the body of the PUT request. |
| [config] | <code>Object</code> | <code>{}</code> | Optional configuration object. |

**Example**  
```js
http.put('https://jsonplaceholder.typicode.com/posts/1', { id: 1, title: 'foo', body: 'bar', userId: 1 })
  .tap(data => console.log(data))
  .catchError(error => console.error(error));
```
<a name="http.patch"></a>

### http.patch(url, [data], [config]) ⇒ [<code>HTTPStream</code>](#HTTPStream)
Sends a PATCH request.

**Kind**: static method of [<code>http</code>](#http)  
**Returns**: [<code>HTTPStream</code>](#HTTPStream) - An HTTPStream that resolves to the response data.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | The URL to send the PATCH request to. |
| [data] | <code>Object</code> | <code>{}</code> | The data to send in the body of the PATCH request. |
| [config] | <code>Object</code> | <code>{}</code> | Optional configuration object. |

**Example**  
```js
http.patch('https://jsonplaceholder.typicode.com/posts/1', { title: 'foo' })
  .tap(data => console.log(data))
  .catchError(error => console.error(error));
```
<a name="http.delete"></a>

### http.delete(url, [config]) ⇒ [<code>HTTPStream</code>](#HTTPStream)
Sends a DELETE request.

**Kind**: static method of [<code>http</code>](#http)  
**Returns**: [<code>HTTPStream</code>](#HTTPStream) - An HTTPStream that resolves to the response data.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | The URL to send the DELETE request to. |
| [config] | <code>Object</code> | <code>{}</code> | Optional configuration object. |

**Example**  
```js
http.delete('https://jsonplaceholder.typicode.com/posts/1')
  .tap(data => console.log(data))
  .catchError(error => console.error(error));
```
<a name="http.sse"></a>

### http.sse(url, [config]) ⇒ [<code>HTTPStream</code>](#HTTPStream)
Establishes a Server-Sent Events connection.

**Kind**: static method of [<code>http</code>](#http)  
**Returns**: [<code>HTTPStream</code>](#HTTPStream) - An HTTPStream with methods to register event handlers, handle errors, and close the connection.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | The URL to establish a Server-Sent Events connection. |
| [config] | <code>Object</code> | <code>{}</code> | Optional configuration object. |

**Example**  
```js
const stream = http.sse('https://api.example.com/events');
stream.on('message', event => console.log(event.data));
stream.catchError(error => console.error(error));
```
