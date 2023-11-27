# Console Functions

The following functions can be invoked in the developer tools console. When you import from the IIFE bundle, these functions are available on the global `cami` object. When you import from the ESM bundle, these functions are available on the `cami` object.


## Functions

<dl>
<dt><a href="#debug.enable">cami.debug.enable()</a> ⇒ <code>void</code></dt></dt>
<dd><p>This function enables logging.</p></dd>

<dt><a href="#debug.disable">cami.debug.disable()</a> ⇒ <code>void</code></dt>
<dd><p>This function disables logging. This is the default setting.</p></dd>

<dt><a href="#events.enable">cami.events.enable()</a> ⇒ <code>void</code></dt>
<dd><p>This function enables event emissions. This emits the `cami:state:change` event. One can then attach an eventListener to the window to capture this event. This is the default setting.</p></dd>

<dt><a href="#events.disable">cami.events.disable()</a> ⇒ <code>void</code></dt>
<dd><p>This function disables event emissions.</p></dd>
</dl>

<a name="debug.enable"></a>

### cami.debug.enable()
This function enables logging.

**Example**
```javascript
cami.debug.enable();
```

<a name="debug.disable"></a>

### cami.debug.disable()
This function disables logging. This is the default setting.

**Example**
```javascript
cami.debug.disable();
```

<a name="events.enable"></a>

### cami.events.enable()
This function enables event emissions. This emits the `cami:state:change` event. One can then attach an eventListener to the window to capture this event. This is the default setting.

**Example**
```javascript
cami.events.enable();
window.addEventListener('cami:state:change', function(e) {
  console.log('State changed:', e.detail);
});
```

<a name="events.disable"></a>

### cami.events.disable()
This function disables event emissions.

**Example**
```javascript
cami.events.disable();
```
