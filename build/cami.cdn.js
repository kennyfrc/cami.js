var cami = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/cami.js
  var cami_exports = {};
  __export(cami_exports, {
    Model: () => Model,
    Observable: () => Observable,
    ObservableState: () => ObservableState,
    ObservableStore: () => ObservableStore,
    ReactiveElement: () => ReactiveElement,
    Type: () => Type,
    debug: () => debug,
    effect: () => effect,
    events: () => events,
    html: () => html,
    store: () => store,
    svg: () => svg,
    useValidationHook: () => useValidationHook,
    useValidationThunk: () => useValidationThunk
  });

  // src/html.js
  var global = globalThis;
  var wrap = (node) => node;
  var trustedTypes = global.trustedTypes;
  var policy = trustedTypes ? trustedTypes.createPolicy("cami-html", {
    createHTML: (s) => s
  }) : void 0;
  var boundAttributeSuffix = "$cami$";
  var marker = `cami$${String(Math.random()).slice(9)}$`;
  var markerMatch = "?" + marker;
  var nodeMarker = `<${markerMatch}>`;
  var d = document;
  var createMarker = () => d.createComment("");
  var isPrimitive = (value) => value === null || typeof value != "object" && typeof value != "function";
  var isArray = Array.isArray;
  var isIterable = (value) => isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof (value == null ? void 0 : value[Symbol.iterator]) === "function";
  var SPACE_CHAR = `[ 	
\f\r]`;
  var ATTR_VALUE_CHAR = `[^ 	
\f\r"'\`<>=]`;
  var NAME_CHAR = `[^\\s"'>=/]`;
  var textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var COMMENT_START = 1;
  var TAG_NAME = 2;
  var DYNAMIC_TAG_NAME = 3;
  var commentEndRegex = /-->/g;
  var comment2EndRegex = />/g;
  var tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, "g");
  var ENTIRE_MATCH = 0;
  var ATTRIBUTE_NAME = 1;
  var SPACES_AND_EQUALS = 2;
  var QUOTE_CHAR = 3;
  var singleQuoteAttrEndRegex = /'/g;
  var doubleQuoteAttrEndRegex = /"/g;
  var rawTextElement = /^(?:script|style|textarea|title)$/i;
  var HTML_RESULT = 1;
  var SVG_RESULT = 2;
  var ATTRIBUTE_PART = 1;
  var CHILD_PART = 2;
  var PROPERTY_PART = 3;
  var BOOLEAN_ATTRIBUTE_PART = 4;
  var EVENT_PART = 5;
  var ELEMENT_PART = 6;
  var COMMENT_PART = 7;
  var tag = (type) => (strings, ...values) => {
    return {
      // This property needs to remain unminified.
      ["_$camiType$"]: type,
      strings,
      values
    };
  };
  var html = tag(HTML_RESULT);
  var svg = tag(SVG_RESULT);
  var noChange = Symbol.for("cami-noChange");
  var nothing = Symbol.for("cami-nothing");
  var templateCache = /* @__PURE__ */ new WeakMap();
  var walker = d.createTreeWalker(
    d,
    129
    /* NodeFilter.SHOW_{ELEMENT|COMMENT} */
  );
  function trustFromTemplateString(tsa, stringFromTSA) {
    return policy !== void 0 ? policy.createHTML(stringFromTSA) : stringFromTSA;
  }
  var getTemplateHtml = (strings, type) => {
    const l = strings.length - 1;
    const attrNames = [];
    let html2 = type === SVG_RESULT ? "<svg>" : "";
    let rawTextEndRegex;
    let regex = textEndRegex;
    for (let i = 0; i < l; i++) {
      const s = strings[i];
      let attrNameEndIndex = -1;
      let attrName;
      let lastIndex = 0;
      let match;
      while (lastIndex < s.length) {
        regex.lastIndex = lastIndex;
        match = regex.exec(s);
        if (match === null) {
          break;
        }
        lastIndex = regex.lastIndex;
        if (regex === textEndRegex) {
          if (match[COMMENT_START] === "!--") {
            regex = commentEndRegex;
          } else if (match[COMMENT_START] !== void 0) {
            regex = comment2EndRegex;
          } else if (match[TAG_NAME] !== void 0) {
            if (rawTextElement.test(match[TAG_NAME])) {
              rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, "g");
            }
            regex = tagEndRegex;
          } else if (match[DYNAMIC_TAG_NAME] !== void 0) {
            regex = tagEndRegex;
          }
        } else if (regex === tagEndRegex) {
          if (match[ENTIRE_MATCH] === ">") {
            regex = rawTextEndRegex != null ? rawTextEndRegex : textEndRegex;
            attrNameEndIndex = -1;
          } else if (match[ATTRIBUTE_NAME] === void 0) {
            attrNameEndIndex = -2;
          } else {
            attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
            attrName = match[ATTRIBUTE_NAME];
            regex = match[QUOTE_CHAR] === void 0 ? tagEndRegex : match[QUOTE_CHAR] === '"' ? doubleQuoteAttrEndRegex : singleQuoteAttrEndRegex;
          }
        } else if (regex === doubleQuoteAttrEndRegex || regex === singleQuoteAttrEndRegex) {
          regex = tagEndRegex;
        } else if (regex === commentEndRegex || regex === comment2EndRegex) {
          regex = textEndRegex;
        } else {
          regex = tagEndRegex;
          rawTextEndRegex = void 0;
        }
      }
      const end = regex === tagEndRegex && strings[i + 1].startsWith("/>") ? " " : "";
      html2 += regex === textEndRegex ? s + nodeMarker : attrNameEndIndex >= 0 ? (attrNames.push(attrName), s.slice(0, attrNameEndIndex) + boundAttributeSuffix + s.slice(attrNameEndIndex)) + marker + end : s + marker + (attrNameEndIndex === -2 ? i : end);
    }
    const htmlResult = html2 + (strings[l] || "<?>") + (type === SVG_RESULT ? "</svg>" : "");
    return [trustFromTemplateString(strings, htmlResult), attrNames];
  };
  var Template = class _Template {
    constructor({ strings, ["_$camiType$"]: type }, options) {
      this.parts = [];
      let node;
      let nodeIndex = 0;
      let attrNameIndex = 0;
      const partCount = strings.length - 1;
      const parts = this.parts;
      const [html2, attrNames] = getTemplateHtml(strings, type);
      this.el = _Template.createElement(html2, options);
      walker.currentNode = this.el.content;
      if (type === SVG_RESULT) {
        const svgElement = this.el.content.firstChild;
        svgElement.replaceWith(...svgElement.childNodes);
      }
      while ((node = walker.nextNode()) !== null && parts.length < partCount) {
        if (node.nodeType === 1) {
          if (node.hasAttributes()) {
            for (const name of node.getAttributeNames()) {
              if (name.endsWith(boundAttributeSuffix)) {
                const realName = attrNames[attrNameIndex++];
                const value = node.getAttribute(name);
                const statics = value.split(marker);
                const m = /([.?@])?(.*)/.exec(realName);
                parts.push({
                  type: ATTRIBUTE_PART,
                  index: nodeIndex,
                  name: m[2],
                  strings: statics,
                  ctor: m[1] === "." ? PropertyPart : m[1] === "?" ? BooleanAttributePart : m[1] === "@" ? EventPart : AttributePart
                });
                node.removeAttribute(name);
              } else if (name.startsWith(marker)) {
                parts.push({
                  type: ELEMENT_PART,
                  index: nodeIndex
                });
                node.removeAttribute(name);
              }
            }
          }
          if (rawTextElement.test(node.tagName)) {
            const strings2 = node.textContent.split(marker);
            const lastIndex = strings2.length - 1;
            if (lastIndex > 0) {
              node.textContent = trustedTypes ? trustedTypes.emptyScript : "";
              for (let i = 0; i < lastIndex; i++) {
                node.append(strings2[i], createMarker());
                walker.nextNode();
                parts.push({ type: CHILD_PART, index: ++nodeIndex });
              }
              node.append(strings2[lastIndex], createMarker());
            }
          }
        } else if (node.nodeType === 8) {
          const data = node.data;
          if (data === markerMatch) {
            parts.push({ type: CHILD_PART, index: nodeIndex });
          } else {
            let i = -1;
            while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
              parts.push({ type: COMMENT_PART, index: nodeIndex });
              i += marker.length - 1;
            }
          }
        }
        nodeIndex++;
      }
    }
    // Overridden via `camiHtmlPolyfillSupport` to provide platform support.
    /** @nocollapse */
    static createElement(html2, _options) {
      const el = d.createElement("template");
      el.innerHTML = html2;
      return el;
    }
  };
  function resolveDirective(part, value, parent = part, attributeIndex) {
    var _a, _b, _c;
    if (value === noChange) {
      return value;
    }
    let currentDirective = attributeIndex !== void 0 ? (_a = parent.__directives) == null ? void 0 : _a[attributeIndex] : parent.__directive;
    const nextDirectiveConstructor = isPrimitive(value) ? void 0 : (
      // This property needs to remain unminified.
      value["_$camiDirective$"]
    );
    if ((currentDirective == null ? void 0 : currentDirective.constructor) !== nextDirectiveConstructor) {
      (_b = currentDirective == null ? void 0 : currentDirective["_$notifyDirectiveConnectionChanged"]) == null ? void 0 : _b.call(currentDirective, false);
      if (nextDirectiveConstructor === void 0) {
        currentDirective = void 0;
      } else {
        currentDirective = new nextDirectiveConstructor(part);
        currentDirective._$initialize(part, parent, attributeIndex);
      }
      if (attributeIndex !== void 0) {
        ((_c = parent.__directives) != null ? _c : parent.__directives = [])[attributeIndex] = currentDirective;
      } else {
        parent.__directive = currentDirective;
      }
    }
    if (currentDirective !== void 0) {
      value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
    }
    return value;
  }
  var TemplateInstance = class {
    constructor(template, parent) {
      this._$parts = [];
      this._$disconnectableChildren = void 0;
      this._$template = template;
      this._$parent = parent;
    }
    // Called by ChildPart parentNode getter
    get parentNode() {
      return this._$parent.parentNode;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
      return this._$parent._$isConnected;
    }
    // This method is separate from the constructor because we need to return a
    // DocumentFragment and we don't want to hold onto it with an instance field.
    _clone(options) {
      var _a;
      const { el: { content }, parts } = this._$template;
      const fragment = ((_a = options == null ? void 0 : options.creationScope) != null ? _a : d).importNode(content, true);
      walker.currentNode = fragment;
      let node = walker.nextNode();
      let nodeIndex = 0;
      let partIndex = 0;
      let templatePart = parts[0];
      while (templatePart !== void 0) {
        if (nodeIndex === templatePart.index) {
          let part;
          if (templatePart.type === CHILD_PART) {
            part = new ChildPart(node, node.nextSibling, this, options);
          } else if (templatePart.type === ATTRIBUTE_PART) {
            part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
          } else if (templatePart.type === ELEMENT_PART) {
            part = new ElementPart(node, this, options);
          }
          this._$parts.push(part);
          templatePart = parts[++partIndex];
        }
        if (nodeIndex !== (templatePart == null ? void 0 : templatePart.index)) {
          node = walker.nextNode();
          nodeIndex++;
        }
      }
      walker.currentNode = d;
      return fragment;
    }
    _update(values) {
      let i = 0;
      for (const part of this._$parts) {
        if (part !== void 0) {
          if (part.strings !== void 0) {
            part._$setValue(values, part, i);
            i += part.strings.length - 2;
          } else {
            part._$setValue(values[i]);
          }
        }
        i++;
      }
    }
  };
  var ChildPart = class _ChildPart {
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
      var _a, _b;
      return (_b = (_a = this._$parent) == null ? void 0 : _a._$isConnected) != null ? _b : this.__isConnected;
    }
    constructor(startNode, endNode, parent, options) {
      var _a;
      this.type = CHILD_PART;
      this._$committedValue = nothing;
      this._$disconnectableChildren = void 0;
      this._$startNode = startNode;
      this._$endNode = endNode;
      this._$parent = parent;
      this.options = options;
      this.__isConnected = (_a = options == null ? void 0 : options.isConnected) != null ? _a : true;
    }
    /**
     * The parent node into which the part renders its content.
     *
     * A ChildPart's content consists of a range of adjacent child nodes of
     * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
     * `.endNode`).
     *
     * - If both `.startNode` and `.endNode` are non-null, then the part's content
     * consists of all siblings between `.startNode` and `.endNode`, exclusively.
     *
     * - If `.startNode` is non-null but `.endNode` is null, then the part's
     * content consists of all siblings following `.startNode`, up to and
     * including the last child of `.parentNode`. If `.endNode` is non-null, then
     * `.startNode` will always be non-null.
     *
     * - If both `.endNode` and `.startNode` are null, then the part's content
     * consists of all child nodes of `.parentNode`.
     */
    get parentNode() {
      let parentNode = wrap(this._$startNode).parentNode;
      const parent = this._$parent;
      if (parent !== void 0 && (parentNode == null ? void 0 : parentNode.nodeType) === 11) {
        parentNode = parent.parentNode;
      }
      return parentNode;
    }
    /**
     * The part's leading marker node, if any. See `.parentNode` for more
     * information.
     */
    get startNode() {
      return this._$startNode;
    }
    /**
     * The part's trailing marker node, if any. See `.parentNode` for more
     * information.
     */
    get endNode() {
      return this._$endNode;
    }
    _$setValue(value, directiveParent = this) {
      value = resolveDirective(this, value, directiveParent);
      if (isPrimitive(value)) {
        if (value === nothing || value == null || value === "") {
          if (this._$committedValue !== nothing) {
            this._$clear();
          }
          this._$committedValue = nothing;
        } else if (value !== this._$committedValue && value !== noChange) {
          this._commitText(value);
        }
      } else if (value["_$camiType$"] !== void 0) {
        this._commitTemplateResult(value);
      } else if (value.nodeType !== void 0) {
        this._commitNode(value);
      } else if (isIterable(value)) {
        this._commitIterable(value);
      } else {
        this._commitText(value);
      }
    }
    _insert(node) {
      return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
    }
    _commitNode(value) {
      if (this._$committedValue !== value) {
        this._$clear();
        this._$committedValue = this._insert(value);
      }
    }
    _commitText(value) {
      if (this._$committedValue !== nothing && isPrimitive(this._$committedValue)) {
        const node = wrap(this._$startNode).nextSibling;
        node.data = value;
      } else {
        {
          this._commitNode(d.createTextNode(value));
        }
      }
      this._$committedValue = value;
    }
    _commitTemplateResult(result) {
      var _a;
      const { values, ["_$camiType$"]: type } = result;
      const template = typeof type === "number" ? this._$getTemplate(result) : (type.el === void 0 && (type.el = Template.createElement(trustFromTemplateString(type.h, type.h[0]), this.options)), type);
      if (((_a = this._$committedValue) == null ? void 0 : _a._$template) === template) {
        this._$committedValue._update(values);
      } else {
        const instance = new TemplateInstance(template, this);
        const fragment = instance._clone(this.options);
        instance._update(values);
        this._commitNode(fragment);
        this._$committedValue = instance;
      }
    }
    // Overridden via `camiHtmlPolyfillSupport` to provide platform support.
    /** @internal */
    _$getTemplate(result) {
      let template = templateCache.get(result.strings);
      if (template === void 0) {
        templateCache.set(result.strings, template = new Template(result));
      }
      return template;
    }
    _commitIterable(value) {
      if (!isArray(this._$committedValue)) {
        this._$committedValue = [];
        this._$clear();
      }
      const itemParts = this._$committedValue;
      let partIndex = 0;
      let itemPart;
      for (const item of value) {
        if (partIndex === itemParts.length) {
          itemParts.push(itemPart = new _ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options));
        } else {
          itemPart = itemParts[partIndex];
        }
        itemPart._$setValue(item);
        partIndex++;
      }
      if (partIndex < itemParts.length) {
        this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
        itemParts.length = partIndex;
      }
    }
    /**
     * Removes the nodes contained within this Part from the DOM.
     *
     * @param start Start node to clear from, for clearing a subset of the part's
     *     DOM (used when truncating iterables)
     * @param from  When `start` is specified, the index within the iterable from
     *     which ChildParts are being removed, used for disconnecting directives in
     *     those Parts.
     *
     * @internal
     */
    _$clear(start = wrap(this._$startNode).nextSibling, from) {
      var _a;
      (_a = this._$notifyConnectionChanged) == null ? void 0 : _a.call(this, false, true, from);
      while (start && start !== this._$endNode) {
        const n = wrap(start).nextSibling;
        wrap(start).remove();
        start = n;
      }
    }
    /**
     * Implementation of RootPart's `isConnected`. Note that this metod
     * should only be called on `RootPart`s (the `ChildPart` returned from a
     * top-level `render()` call). It has no effect on non-root ChildParts.
     * @param isConnected Whether to set
     * @internal
     */
    setConnected(isConnected) {
      var _a;
      if (this._$parent === void 0) {
        this.__isConnected = isConnected;
        (_a = this._$notifyConnectionChanged) == null ? void 0 : _a.call(this, isConnected);
      }
    }
  };
  var AttributePart = class {
    get tagName() {
      return this.element.tagName;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
      return this._$parent._$isConnected;
    }
    constructor(element, name, strings, parent, options) {
      this.type = ATTRIBUTE_PART;
      this._$committedValue = nothing;
      this._$disconnectableChildren = void 0;
      this.element = element;
      this.name = name;
      this._$parent = parent;
      this.options = options;
      if (strings.length > 2 || strings[0] !== "" || strings[1] !== "") {
        this._$committedValue = new Array(strings.length - 1).fill(new String());
        this.strings = strings;
      } else {
        this._$committedValue = nothing;
      }
    }
    /**
     * Sets the value of this part by resolving the value from possibly multiple
     * values and static strings and committing it to the DOM.
     * If this part is single-valued, `this._strings` will be undefined, and the
     * method will be called with a single value argument. If this part is
     * multi-value, `this._strings` will be defined, and the method is called
     * with the value array of the part's owning TemplateInstance, and an offset
     * into the value array from which the values should be read.
     * This method is overloaded this way to eliminate short-lived array slices
     * of the template instance values, and allow a fast-path for single-valued
     * parts.
     *
     * @param value The part value, or an array of values for multi-valued parts
     * @param valueIndex the index to start reading values from. `undefined` for
     *   single-valued parts
     * @param noCommit causes the part to not commit its value to the DOM. Used
     *   in hydration to prime attribute parts with their first-rendered value,
     *   but not set the attribute, and in SSR to no-op the DOM operation and
     *   capture the value for serialization.
     *
     * @internal
     */
    _$setValue(value, directiveParent = this, valueIndex, noCommit) {
      const strings = this.strings;
      let change = false;
      if (strings === void 0) {
        value = resolveDirective(this, value, directiveParent, 0);
        change = !isPrimitive(value) || value !== this._$committedValue && value !== noChange;
        if (change) {
          this._$committedValue = value;
        }
      } else {
        const values = value;
        value = strings[0];
        let i, v;
        for (i = 0; i < strings.length - 1; i++) {
          v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
          if (v === noChange) {
            v = this._$committedValue[i];
          }
          change || (change = !isPrimitive(v) || v !== this._$committedValue[i]);
          if (v === nothing) {
            value = nothing;
          } else if (value !== nothing) {
            value += (v != null ? v : "") + strings[i + 1];
          }
          this._$committedValue[i] = v;
        }
      }
      if (change && !noCommit) {
        this._commitValue(value);
      }
    }
    /** @internal */
    _commitValue(value) {
      if (value === nothing) {
        wrap(this.element).removeAttribute(this.name);
      } else {
        wrap(this.element).setAttribute(this.name, value != null ? value : "");
      }
    }
  };
  var PropertyPart = class extends AttributePart {
    constructor() {
      super(...arguments);
      this.type = PROPERTY_PART;
    }
    /** @internal */
    _commitValue(value) {
      this.element[this.name] = value === nothing ? void 0 : value;
    }
  };
  var BooleanAttributePart = class extends AttributePart {
    constructor() {
      super(...arguments);
      this.type = BOOLEAN_ATTRIBUTE_PART;
    }
    /** @internal */
    _commitValue(value) {
      wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
    }
  };
  var EventPart = class extends AttributePart {
    constructor(element, name, strings, parent, options) {
      super(element, name, strings, parent, options);
      this.type = EVENT_PART;
    }
    // EventPart does not use the base _$setValue/_resolveValue implementation
    // since the dirty checking is more complex
    /** @internal */
    _$setValue(newListener, directiveParent = this) {
      var _a;
      newListener = (_a = resolveDirective(this, newListener, directiveParent, 0)) != null ? _a : nothing;
      if (newListener === noChange) {
        return;
      }
      const oldListener = this._$committedValue;
      const shouldRemoveListener = newListener === nothing && oldListener !== nothing || newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive;
      const shouldAddListener = newListener !== nothing && (oldListener === nothing || shouldRemoveListener);
      if (shouldRemoveListener) {
        this.element.removeEventListener(this.name, this, oldListener);
      }
      if (shouldAddListener) {
        this.element.addEventListener(this.name, this, newListener);
      }
      this._$committedValue = newListener;
    }
    handleEvent(event) {
      var _a, _b;
      if (typeof this._$committedValue === "function") {
        this._$committedValue.call((_b = (_a = this.options) == null ? void 0 : _a.host) != null ? _b : this.element, event);
      } else {
        this._$committedValue.handleEvent(event);
      }
    }
  };
  var ElementPart = class {
    constructor(element, parent, options) {
      this.element = element;
      this.type = ELEMENT_PART;
      this._$disconnectableChildren = void 0;
      this._$parent = parent;
      this.options = options;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
      return this._$parent._$isConnected;
    }
    _$setValue(value) {
      resolveDirective(this, value);
    }
  };
  var render = (value, container, options) => {
    var _a, _b;
    const partOwnerNode = (_a = options == null ? void 0 : options.renderBefore) != null ? _a : container;
    let part = partOwnerNode["_$camiPart$"];
    if (part === void 0) {
      const endNode = (_b = options == null ? void 0 : options.renderBefore) != null ? _b : null;
      partOwnerNode["_$camiPart$"] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, void 0, options != null ? options : {});
    }
    part._$setValue(value);
    return part;
  };

  // node_modules/immer/dist/immer.mjs
  var NOTHING = Symbol.for("immer-nothing");
  var DRAFTABLE = Symbol.for("immer-draftable");
  var DRAFT_STATE = Symbol.for("immer-state");
  var errors = true ? [
    // All error codes, starting by 0:
    function(plugin) {
      return `The plugin for '${plugin}' has not been loaded into Immer. To enable the plugin, import and call \`enable${plugin}()\` when initializing your application.`;
    },
    function(thing) {
      return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${thing}'`;
    },
    "This object has been frozen and should not be mutated",
    function(data) {
      return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
    },
    "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
    "Immer forbids circular references",
    "The first or second argument to `produce` must be a function",
    "The third argument to `produce` must be a function or undefined",
    "First argument to `createDraft` must be a plain object, an array, or an immerable object",
    "First argument to `finishDraft` must be a draft returned by `createDraft`",
    function(thing) {
      return `'current' expects a draft, got: ${thing}`;
    },
    "Object.defineProperty() cannot be used on an Immer draft",
    "Object.setPrototypeOf() cannot be used on an Immer draft",
    "Immer only supports deleting array indices",
    "Immer only supports setting array indices and the 'length' property",
    function(thing) {
      return `'original' expects a draft, got: ${thing}`;
    }
    // Note: if more errors are added, the errorOffset in Patches.ts should be increased
    // See Patches.ts for additional errors
  ] : [];
  function die(error, ...args) {
    if (true) {
      const e = errors[error];
      const msg = typeof e === "function" ? e.apply(null, args) : e;
      throw new Error(`[Immer] ${msg}`);
    }
    throw new Error(
      `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
    );
  }
  var getPrototypeOf = Object.getPrototypeOf;
  function isDraft(value) {
    return !!value && !!value[DRAFT_STATE];
  }
  function isDraftable(value) {
    var _a;
    if (!value)
      return false;
    return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_a = value.constructor) == null ? void 0 : _a[DRAFTABLE]) || isMap(value) || isSet(value);
  }
  var objectCtorString = Object.prototype.constructor.toString();
  function isPlainObject(value) {
    if (!value || typeof value !== "object")
      return false;
    const proto = getPrototypeOf(value);
    if (proto === null) {
      return true;
    }
    const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    if (Ctor === Object)
      return true;
    return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
  }
  function each(obj, iter) {
    if (getArchtype(obj) === 0) {
      Reflect.ownKeys(obj).forEach((key) => {
        iter(key, obj[key], obj);
      });
    } else {
      obj.forEach((entry, index) => iter(index, entry, obj));
    }
  }
  function getArchtype(thing) {
    const state = thing[DRAFT_STATE];
    return state ? state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
  }
  function has(thing, prop) {
    return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
  }
  function get(thing, prop) {
    return getArchtype(thing) === 2 ? thing.get(prop) : thing[prop];
  }
  function set(thing, propOrOldValue, value) {
    const t = getArchtype(thing);
    if (t === 2)
      thing.set(propOrOldValue, value);
    else if (t === 3) {
      thing.add(value);
    } else
      thing[propOrOldValue] = value;
  }
  function is(x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }
  function isMap(target) {
    return target instanceof Map;
  }
  function isSet(target) {
    return target instanceof Set;
  }
  function latest(state) {
    return state.copy_ || state.base_;
  }
  function shallowCopy(base, strict) {
    if (isMap(base)) {
      return new Map(base);
    }
    if (isSet(base)) {
      return new Set(base);
    }
    if (Array.isArray(base))
      return Array.prototype.slice.call(base);
    const isPlain = isPlainObject(base);
    if (strict === true || strict === "class_only" && !isPlain) {
      const descriptors = Object.getOwnPropertyDescriptors(base);
      delete descriptors[DRAFT_STATE];
      let keys = Reflect.ownKeys(descriptors);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const desc = descriptors[key];
        if (desc.writable === false) {
          desc.writable = true;
          desc.configurable = true;
        }
        if (desc.get || desc.set)
          descriptors[key] = {
            configurable: true,
            writable: true,
            // could live with !!desc.set as well here...
            enumerable: desc.enumerable,
            value: base[key]
          };
      }
      return Object.create(getPrototypeOf(base), descriptors);
    } else {
      const proto = getPrototypeOf(base);
      if (proto !== null && isPlain) {
        return __spreadValues({}, base);
      }
      const obj = Object.create(proto);
      return Object.assign(obj, base);
    }
  }
  function freeze(obj, deep = false) {
    if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
      return obj;
    if (getArchtype(obj) > 1) {
      obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
    }
    Object.freeze(obj);
    if (deep)
      Object.entries(obj).forEach(([key, value]) => freeze(value, true));
    return obj;
  }
  function dontMutateFrozenCollections() {
    die(2);
  }
  function isFrozen(obj) {
    return Object.isFrozen(obj);
  }
  var plugins = {};
  function getPlugin(pluginKey) {
    const plugin = plugins[pluginKey];
    if (!plugin) {
      die(0, pluginKey);
    }
    return plugin;
  }
  function loadPlugin(pluginKey, implementation) {
    if (!plugins[pluginKey])
      plugins[pluginKey] = implementation;
  }
  var currentScope;
  function getCurrentScope() {
    return currentScope;
  }
  function createScope(parent_, immer_) {
    return {
      drafts_: [],
      parent_,
      immer_,
      // Whenever the modified draft contains a draft from another scope, we
      // need to prevent auto-freezing so the unowned draft can be finalized.
      canAutoFreeze_: true,
      unfinalizedDrafts_: 0
    };
  }
  function usePatchesInScope(scope, patchListener) {
    if (patchListener) {
      getPlugin("Patches");
      scope.patches_ = [];
      scope.inversePatches_ = [];
      scope.patchListener_ = patchListener;
    }
  }
  function revokeScope(scope) {
    leaveScope(scope);
    scope.drafts_.forEach(revokeDraft);
    scope.drafts_ = null;
  }
  function leaveScope(scope) {
    if (scope === currentScope) {
      currentScope = scope.parent_;
    }
  }
  function enterScope(immer2) {
    return currentScope = createScope(currentScope, immer2);
  }
  function revokeDraft(draft) {
    const state = draft[DRAFT_STATE];
    if (state.type_ === 0 || state.type_ === 1)
      state.revoke_();
    else
      state.revoked_ = true;
  }
  function processResult(result, scope) {
    scope.unfinalizedDrafts_ = scope.drafts_.length;
    const baseDraft = scope.drafts_[0];
    const isReplaced = result !== void 0 && result !== baseDraft;
    if (isReplaced) {
      if (baseDraft[DRAFT_STATE].modified_) {
        revokeScope(scope);
        die(4);
      }
      if (isDraftable(result)) {
        result = finalize(scope, result);
        if (!scope.parent_)
          maybeFreeze(scope, result);
      }
      if (scope.patches_) {
        getPlugin("Patches").generateReplacementPatches_(
          baseDraft[DRAFT_STATE].base_,
          result,
          scope.patches_,
          scope.inversePatches_
        );
      }
    } else {
      result = finalize(scope, baseDraft, []);
    }
    revokeScope(scope);
    if (scope.patches_) {
      scope.patchListener_(scope.patches_, scope.inversePatches_);
    }
    return result !== NOTHING ? result : void 0;
  }
  function finalize(rootScope, value, path) {
    if (isFrozen(value))
      return value;
    const state = value[DRAFT_STATE];
    if (!state) {
      each(
        value,
        (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path)
      );
      return value;
    }
    if (state.scope_ !== rootScope)
      return value;
    if (!state.modified_) {
      maybeFreeze(rootScope, state.base_, true);
      return state.base_;
    }
    if (!state.finalized_) {
      state.finalized_ = true;
      state.scope_.unfinalizedDrafts_--;
      const result = state.copy_;
      let resultEach = result;
      let isSet2 = false;
      if (state.type_ === 3) {
        resultEach = new Set(result);
        result.clear();
        isSet2 = true;
      }
      each(
        resultEach,
        (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet2)
      );
      maybeFreeze(rootScope, result, false);
      if (path && rootScope.patches_) {
        getPlugin("Patches").generatePatches_(
          state,
          path,
          rootScope.patches_,
          rootScope.inversePatches_
        );
      }
    }
    return state.copy_;
  }
  function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
    if (childValue === targetObject)
      die(5);
    if (isDraft(childValue)) {
      const path = rootPath && parentState && parentState.type_ !== 3 && // Set objects are atomic since they have no keys.
      !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
      const res = finalize(rootScope, childValue, path);
      set(targetObject, prop, res);
      if (isDraft(res)) {
        rootScope.canAutoFreeze_ = false;
      } else
        return;
    } else if (targetIsSet) {
      targetObject.add(childValue);
    }
    if (isDraftable(childValue) && !isFrozen(childValue)) {
      if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
        return;
      }
      finalize(rootScope, childValue);
      if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && Object.prototype.propertyIsEnumerable.call(targetObject, prop))
        maybeFreeze(rootScope, childValue);
    }
  }
  function maybeFreeze(scope, value, deep = false) {
    if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
      freeze(value, deep);
    }
  }
  function createProxyProxy(base, parent) {
    const isArray2 = Array.isArray(base);
    const state = {
      type_: isArray2 ? 1 : 0,
      // Track which produce call this is associated with.
      scope_: parent ? parent.scope_ : getCurrentScope(),
      // True for both shallow and deep changes.
      modified_: false,
      // Used during finalization.
      finalized_: false,
      // Track which properties have been assigned (true) or deleted (false).
      assigned_: {},
      // The parent draft state.
      parent_: parent,
      // The base state.
      base_: base,
      // The base proxy.
      draft_: null,
      // set below
      // The base copy with any updated values.
      copy_: null,
      // Called by the `produce` function.
      revoke_: null,
      isManual_: false
    };
    let target = state;
    let traps = objectTraps;
    if (isArray2) {
      target = [state];
      traps = arrayTraps;
    }
    const { revoke, proxy } = Proxy.revocable(target, traps);
    state.draft_ = proxy;
    state.revoke_ = revoke;
    return proxy;
  }
  var objectTraps = {
    get(state, prop) {
      if (prop === DRAFT_STATE)
        return state;
      const source = latest(state);
      if (!has(source, prop)) {
        return readPropFromProto(state, source, prop);
      }
      const value = source[prop];
      if (state.finalized_ || !isDraftable(value)) {
        return value;
      }
      if (value === peek(state.base_, prop)) {
        prepareCopy(state);
        return state.copy_[prop] = createProxy(value, state);
      }
      return value;
    },
    has(state, prop) {
      return prop in latest(state);
    },
    ownKeys(state) {
      return Reflect.ownKeys(latest(state));
    },
    set(state, prop, value) {
      const desc = getDescriptorFromProto(latest(state), prop);
      if (desc == null ? void 0 : desc.set) {
        desc.set.call(state.draft_, value);
        return true;
      }
      if (!state.modified_) {
        const current2 = peek(latest(state), prop);
        const currentState = current2 == null ? void 0 : current2[DRAFT_STATE];
        if (currentState && currentState.base_ === value) {
          state.copy_[prop] = value;
          state.assigned_[prop] = false;
          return true;
        }
        if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
          return true;
        prepareCopy(state);
        markChanged(state);
      }
      if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
      (value !== void 0 || prop in state.copy_) || // special case: NaN
      Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
        return true;
      state.copy_[prop] = value;
      state.assigned_[prop] = true;
      return true;
    },
    deleteProperty(state, prop) {
      if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
        state.assigned_[prop] = false;
        prepareCopy(state);
        markChanged(state);
      } else {
        delete state.assigned_[prop];
      }
      if (state.copy_) {
        delete state.copy_[prop];
      }
      return true;
    },
    // Note: We never coerce `desc.value` into an Immer draft, because we can't make
    // the same guarantee in ES5 mode.
    getOwnPropertyDescriptor(state, prop) {
      const owner = latest(state);
      const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
      if (!desc)
        return desc;
      return {
        writable: true,
        configurable: state.type_ !== 1 || prop !== "length",
        enumerable: desc.enumerable,
        value: owner[prop]
      };
    },
    defineProperty() {
      die(11);
    },
    getPrototypeOf(state) {
      return getPrototypeOf(state.base_);
    },
    setPrototypeOf() {
      die(12);
    }
  };
  var arrayTraps = {};
  each(objectTraps, (key, fn) => {
    arrayTraps[key] = function() {
      arguments[0] = arguments[0][0];
      return fn.apply(this, arguments);
    };
  });
  arrayTraps.deleteProperty = function(state, prop) {
    if (isNaN(parseInt(prop)))
      die(13);
    return arrayTraps.set.call(this, state, prop, void 0);
  };
  arrayTraps.set = function(state, prop, value) {
    if (prop !== "length" && isNaN(parseInt(prop)))
      die(14);
    return objectTraps.set.call(this, state[0], prop, value, state[0]);
  };
  function peek(draft, prop) {
    const state = draft[DRAFT_STATE];
    const source = state ? latest(state) : draft;
    return source[prop];
  }
  function readPropFromProto(state, source, prop) {
    var _a;
    const desc = getDescriptorFromProto(source, prop);
    return desc ? `value` in desc ? desc.value : (
      // This is a very special case, if the prop is a getter defined by the
      // prototype, we should invoke it with the draft as context!
      (_a = desc.get) == null ? void 0 : _a.call(state.draft_)
    ) : void 0;
  }
  function getDescriptorFromProto(source, prop) {
    if (!(prop in source))
      return void 0;
    let proto = getPrototypeOf(source);
    while (proto) {
      const desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (desc)
        return desc;
      proto = getPrototypeOf(proto);
    }
    return void 0;
  }
  function markChanged(state) {
    if (!state.modified_) {
      state.modified_ = true;
      if (state.parent_) {
        markChanged(state.parent_);
      }
    }
  }
  function prepareCopy(state) {
    if (!state.copy_) {
      state.copy_ = shallowCopy(
        state.base_,
        state.scope_.immer_.useStrictShallowCopy_
      );
    }
  }
  var Immer2 = class {
    constructor(config) {
      this.autoFreeze_ = true;
      this.useStrictShallowCopy_ = false;
      this.produce = (base, recipe, patchListener) => {
        if (typeof base === "function" && typeof recipe !== "function") {
          const defaultBase = recipe;
          recipe = base;
          const self = this;
          return function curriedProduce(base2 = defaultBase, ...args) {
            return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
          };
        }
        if (typeof recipe !== "function")
          die(6);
        if (patchListener !== void 0 && typeof patchListener !== "function")
          die(7);
        let result;
        if (isDraftable(base)) {
          const scope = enterScope(this);
          const proxy = createProxy(base, void 0);
          let hasError = true;
          try {
            result = recipe(proxy);
            hasError = false;
          } finally {
            if (hasError)
              revokeScope(scope);
            else
              leaveScope(scope);
          }
          usePatchesInScope(scope, patchListener);
          return processResult(result, scope);
        } else if (!base || typeof base !== "object") {
          result = recipe(base);
          if (result === void 0)
            result = base;
          if (result === NOTHING)
            result = void 0;
          if (this.autoFreeze_)
            freeze(result, true);
          if (patchListener) {
            const p = [];
            const ip = [];
            getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
            patchListener(p, ip);
          }
          return result;
        } else
          die(1, base);
      };
      this.produceWithPatches = (base, recipe) => {
        if (typeof base === "function") {
          return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
        }
        let patches, inversePatches;
        const result = this.produce(base, recipe, (p, ip) => {
          patches = p;
          inversePatches = ip;
        });
        return [result, patches, inversePatches];
      };
      if (typeof (config == null ? void 0 : config.autoFreeze) === "boolean")
        this.setAutoFreeze(config.autoFreeze);
      if (typeof (config == null ? void 0 : config.useStrictShallowCopy) === "boolean")
        this.setUseStrictShallowCopy(config.useStrictShallowCopy);
    }
    createDraft(base) {
      if (!isDraftable(base))
        die(8);
      if (isDraft(base))
        base = current(base);
      const scope = enterScope(this);
      const proxy = createProxy(base, void 0);
      proxy[DRAFT_STATE].isManual_ = true;
      leaveScope(scope);
      return proxy;
    }
    finishDraft(draft, patchListener) {
      const state = draft && draft[DRAFT_STATE];
      if (!state || !state.isManual_)
        die(9);
      const { scope_: scope } = state;
      usePatchesInScope(scope, patchListener);
      return processResult(void 0, scope);
    }
    /**
     * Pass true to automatically freeze all copies created by Immer.
     *
     * By default, auto-freezing is enabled.
     */
    setAutoFreeze(value) {
      this.autoFreeze_ = value;
    }
    /**
     * Pass true to enable strict shallow copy.
     *
     * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
     */
    setUseStrictShallowCopy(value) {
      this.useStrictShallowCopy_ = value;
    }
    applyPatches(base, patches) {
      let i;
      for (i = patches.length - 1; i >= 0; i--) {
        const patch = patches[i];
        if (patch.path.length === 0 && patch.op === "replace") {
          base = patch.value;
          break;
        }
      }
      if (i > -1) {
        patches = patches.slice(i + 1);
      }
      const applyPatchesImpl = getPlugin("Patches").applyPatches_;
      if (isDraft(base)) {
        return applyPatchesImpl(base, patches);
      }
      return this.produce(
        base,
        (draft) => applyPatchesImpl(draft, patches)
      );
    }
  };
  function createProxy(value, parent) {
    const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
    const scope = parent ? parent.scope_ : getCurrentScope();
    scope.drafts_.push(draft);
    return draft;
  }
  function current(value) {
    if (!isDraft(value))
      die(10, value);
    return currentImpl(value);
  }
  function currentImpl(value) {
    if (!isDraftable(value) || isFrozen(value))
      return value;
    const state = value[DRAFT_STATE];
    let copy;
    if (state) {
      if (!state.modified_)
        return state.base_;
      state.finalized_ = true;
      copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    } else {
      copy = shallowCopy(value, true);
    }
    each(copy, (key, childValue) => {
      set(copy, key, currentImpl(childValue));
    });
    if (state) {
      state.finalized_ = false;
    }
    return copy;
  }
  function enablePatches() {
    const errorOffset = 16;
    if (true) {
      errors.push(
        'Sets cannot have "replace" patches.',
        function(op) {
          return "Unsupported patch operation: " + op;
        },
        function(path) {
          return "Cannot apply patch, path doesn't resolve: " + path;
        },
        "Patching reserved attributes like __proto__, prototype and constructor is not allowed"
      );
    }
    const REPLACE = "replace";
    const ADD = "add";
    const REMOVE = "remove";
    function generatePatches_(state, basePath, patches, inversePatches) {
      switch (state.type_) {
        case 0:
        case 2:
          return generatePatchesFromAssigned(
            state,
            basePath,
            patches,
            inversePatches
          );
        case 1:
          return generateArrayPatches(state, basePath, patches, inversePatches);
        case 3:
          return generateSetPatches(
            state,
            basePath,
            patches,
            inversePatches
          );
      }
    }
    function generateArrayPatches(state, basePath, patches, inversePatches) {
      let { base_, assigned_ } = state;
      let copy_ = state.copy_;
      if (copy_.length < base_.length) {
        ;
        [base_, copy_] = [copy_, base_];
        [patches, inversePatches] = [inversePatches, patches];
      }
      for (let i = 0; i < base_.length; i++) {
        if (assigned_[i] && copy_[i] !== base_[i]) {
          const path = basePath.concat([i]);
          patches.push({
            op: REPLACE,
            path,
            // Need to maybe clone it, as it can in fact be the original value
            // due to the base/copy inversion at the start of this function
            value: clonePatchValueIfNeeded(copy_[i])
          });
          inversePatches.push({
            op: REPLACE,
            path,
            value: clonePatchValueIfNeeded(base_[i])
          });
        }
      }
      for (let i = base_.length; i < copy_.length; i++) {
        const path = basePath.concat([i]);
        patches.push({
          op: ADD,
          path,
          // Need to maybe clone it, as it can in fact be the original value
          // due to the base/copy inversion at the start of this function
          value: clonePatchValueIfNeeded(copy_[i])
        });
      }
      for (let i = copy_.length - 1; base_.length <= i; --i) {
        const path = basePath.concat([i]);
        inversePatches.push({
          op: REMOVE,
          path
        });
      }
    }
    function generatePatchesFromAssigned(state, basePath, patches, inversePatches) {
      const { base_, copy_ } = state;
      each(state.assigned_, (key, assignedValue) => {
        const origValue = get(base_, key);
        const value = get(copy_, key);
        const op = !assignedValue ? REMOVE : has(base_, key) ? REPLACE : ADD;
        if (origValue === value && op === REPLACE)
          return;
        const path = basePath.concat(key);
        patches.push(op === REMOVE ? { op, path } : { op, path, value });
        inversePatches.push(
          op === ADD ? { op: REMOVE, path } : op === REMOVE ? { op: ADD, path, value: clonePatchValueIfNeeded(origValue) } : { op: REPLACE, path, value: clonePatchValueIfNeeded(origValue) }
        );
      });
    }
    function generateSetPatches(state, basePath, patches, inversePatches) {
      let { base_, copy_ } = state;
      let i = 0;
      base_.forEach((value) => {
        if (!copy_.has(value)) {
          const path = basePath.concat([i]);
          patches.push({
            op: REMOVE,
            path,
            value
          });
          inversePatches.unshift({
            op: ADD,
            path,
            value
          });
        }
        i++;
      });
      i = 0;
      copy_.forEach((value) => {
        if (!base_.has(value)) {
          const path = basePath.concat([i]);
          patches.push({
            op: ADD,
            path,
            value
          });
          inversePatches.unshift({
            op: REMOVE,
            path,
            value
          });
        }
        i++;
      });
    }
    function generateReplacementPatches_(baseValue, replacement, patches, inversePatches) {
      patches.push({
        op: REPLACE,
        path: [],
        value: replacement === NOTHING ? void 0 : replacement
      });
      inversePatches.push({
        op: REPLACE,
        path: [],
        value: baseValue
      });
    }
    function applyPatches_(draft, patches) {
      patches.forEach((patch) => {
        const { path, op } = patch;
        let base = draft;
        for (let i = 0; i < path.length - 1; i++) {
          const parentType = getArchtype(base);
          let p = path[i];
          if (typeof p !== "string" && typeof p !== "number") {
            p = "" + p;
          }
          if ((parentType === 0 || parentType === 1) && (p === "__proto__" || p === "constructor"))
            die(errorOffset + 3);
          if (typeof base === "function" && p === "prototype")
            die(errorOffset + 3);
          base = get(base, p);
          if (typeof base !== "object")
            die(errorOffset + 2, path.join("/"));
        }
        const type = getArchtype(base);
        const value = deepClonePatchValue(patch.value);
        const key = path[path.length - 1];
        switch (op) {
          case REPLACE:
            switch (type) {
              case 2:
                return base.set(key, value);
              case 3:
                die(errorOffset);
              default:
                return base[key] = value;
            }
          case ADD:
            switch (type) {
              case 1:
                return key === "-" ? base.push(value) : base.splice(key, 0, value);
              case 2:
                return base.set(key, value);
              case 3:
                return base.add(value);
              default:
                return base[key] = value;
            }
          case REMOVE:
            switch (type) {
              case 1:
                return base.splice(key, 1);
              case 2:
                return base.delete(key);
              case 3:
                return base.delete(patch.value);
              default:
                return delete base[key];
            }
          default:
            die(errorOffset + 1, op);
        }
      });
      return draft;
    }
    function deepClonePatchValue(obj) {
      if (!isDraftable(obj))
        return obj;
      if (Array.isArray(obj))
        return obj.map(deepClonePatchValue);
      if (isMap(obj))
        return new Map(
          Array.from(obj.entries()).map(([k, v]) => [k, deepClonePatchValue(v)])
        );
      if (isSet(obj))
        return new Set(Array.from(obj).map(deepClonePatchValue));
      const cloned = Object.create(getPrototypeOf(obj));
      for (const key in obj)
        cloned[key] = deepClonePatchValue(obj[key]);
      if (has(obj, DRAFTABLE))
        cloned[DRAFTABLE] = obj[DRAFTABLE];
      return cloned;
    }
    function clonePatchValueIfNeeded(obj) {
      if (isDraft(obj)) {
        return deepClonePatchValue(obj);
      } else
        return obj;
    }
    loadPlugin("Patches", {
      applyPatches_,
      generatePatches_,
      generateReplacementPatches_
    });
  }
  var immer = new Immer2();
  var produce = immer.produce;
  var produceWithPatches = immer.produceWithPatches.bind(
    immer
  );
  var setAutoFreeze = immer.setAutoFreeze.bind(immer);
  var setUseStrictShallowCopy = immer.setUseStrictShallowCopy.bind(immer);
  var applyPatches = immer.applyPatches.bind(immer);
  var createDraft = immer.createDraft.bind(immer);
  var finishDraft = immer.finishDraft.bind(immer);

  // src/observables/observable.js
  var Subscriber = class {
    /**
     * @constructor
     * @description Creates a new Subscriber instance.
     * @param {Observer|Function} observer - The observer object or function.
     */
    constructor(observer) {
      if (typeof observer === "function") {
        this.observer = { next: observer };
      } else {
        this.observer = observer;
      }
      this.teardowns = [];
      if (typeof AbortController !== "undefined") {
        this.controller = new AbortController();
        this.signal = this.controller.signal;
      }
      this.isUnsubscribed = false;
    }
    /**
     * @method
     * @description Notifies the observer of a new value.
     * @param {any} result - The result to pass to the observer's next method.
     * @example
     * subscriber.next('Hello, world!');
     */
    next(result) {
      if (!this.isUnsubscribed && this.observer.next) {
        this.observer.next(result);
      }
    }
    /**
     * @method
     * @description Notifies the observer that the observable has completed and no more data will be emitted.
     * @example
     * subscriber.complete();
     */
    complete() {
      if (!this.isUnsubscribed) {
        if (this.observer.complete) {
          this.observer.complete();
        }
        this.unsubscribe();
      }
    }
    /**
     * @method
     * @description Notifies the observer that an error has occurred.
     * @param {Error} error - The error to pass to the observer's error method.
     * @example
     * subscriber.error(new Error('Something went wrong'));
     */
    error(error) {
      if (!this.isUnsubscribed) {
        if (this.observer.error) {
          this.observer.error(error);
        }
        this.unsubscribe();
      }
    }
    /**
     * @method
     * @description Adds a teardown function to the teardowns array.
     * @param {Function} teardown - The teardown function to add to the teardowns array.
     */
    addTeardown(teardown) {
      this.teardowns.push(teardown);
    }
    /**
     * @method
     * @description Unsubscribes from the observable, preventing any further notifications to the observer and triggering any teardown logic.
     * @example
     * subscriber.unsubscribe();
     */
    unsubscribe() {
      if (!this.isUnsubscribed) {
        this.isUnsubscribed = true;
        if (this.controller) {
          this.controller.abort();
        }
        this.teardowns.forEach((teardown) => {
          if (typeof teardown !== "function") {
            throw new Error("[Cami.js] Teardown must be a function. Please implement a teardown function in your subscriber.");
          }
          teardown();
        });
      }
    }
  };
  var Observable = class {
    /**
     * @constructor
     * @description Creates a new Observable instance.
     * @param {Function} subscribeCallback - The callback function to call when a new observer subscribes.
     */
    constructor(subscribeCallback = () => () => {
    }) {
      this.__observers = [];
      this.subscribeCallback = subscribeCallback;
    }
    /**
     * @method
     * @description Subscribes an observer to the observable.
     * @param {Observer|Function} observerOrNext - The observer to subscribe or the next function. Default is an empty function.
     * @param {Function} error - The error function. Default is an empty function.
     * @param {Function} complete - The complete function. Default is an empty function.
     * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
     * @example
     * const observable = new Observable();
     * const subscription = observable.subscribe({
     *   next: value => console.log(value),
     *   error: err => console.error(err),
     *   complete: () => console.log('Completed'),
     * });
     */
    subscribe(observerOrNext = () => {
    }, error = () => {
    }, complete = () => {
    }) {
      let observer;
      if (typeof observerOrNext === "function") {
        observer = {
          next: observerOrNext,
          error,
          complete
        };
      } else if (typeof observerOrNext === "object") {
        observer = observerOrNext;
      } else {
        throw new Error("[Cami.js] First argument to subscribe must be a next callback or an observer object");
      }
      const subscriber = new Subscriber(observer);
      let teardown = () => {
      };
      try {
        teardown = this.subscribeCallback(subscriber);
      } catch (error2) {
        if (subscriber.error) {
          subscriber.error(error2);
        } else {
          console.error("[Cami.js] Error in Subscriber:", error2);
        }
        return;
      }
      subscriber.addTeardown(teardown);
      this.__observers.push(subscriber);
      return {
        unsubscribe: () => subscriber.unsubscribe(),
        complete: () => subscriber.complete(),
        error: (err) => subscriber.error(err)
      };
    }
    /**
     * @method
     * @description Passes a value to the observer's next method.
     * @param {*} value - The value to be passed to the observer's next method.
     * @example
     * const observable = new Observable();
     * observable.next('Hello, world!');
     */
    next(value) {
      this.__observers.forEach((observer) => {
        observer.next(value);
      });
    }
    /**
     * @method
     * @description Passes an error to the observer's error method.
     * @param {*} error - The error to be passed to the observer's error method.
     * @example
     * const observable = new Observable();
     * observable.error(new Error('Something went wrong'));
     */
    error(error) {
      this.__observers.forEach((observer) => {
        observer.error(error);
      });
    }
    /**
     * @method
     * @description Calls the complete method on all observers.
     * @example
     * const observable = new Observable();
     * observable.complete();
     */
    complete() {
      this.__observers.forEach((observer) => {
        observer.complete();
      });
    }
    /**
     * @method
     * @description Subscribes an observer with a next function to the observable.
     * @param {Function} callbackFn - The callback function to call when a new value is emitted.
     * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
     * @example
     * const observable = new Observable();
     * const subscription = observable.onValue(value => console.log(value));
     */
    onValue(callbackFn) {
      return this.subscribe({
        next: callbackFn
      });
    }
    /**
     * @method
     * @description Subscribes an observer with an error function to the observable.
     * @param {Function} callbackFn - The callback function to call when an error is emitted.
     * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
     * @example
     * const observable = new Observable();
     * const subscription = observable.onError(err => console.error(err));
     */
    onError(callbackFn) {
      return this.subscribe({
        error: callbackFn
      });
    }
    /**
     * @method
     * @description Subscribes an observer with a complete function to the observable.
     * @param {Function} callbackFn - The callback function to call when the observable completes.
     * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
     * @example
     * const observable = new Observable();
     * const subscription = observable.onEnd(() => console.log('Completed'));
     */
    onEnd(callbackFn) {
      return this.subscribe({
        complete: callbackFn
      });
    }
    /**
     * @method
     * @description Returns an AsyncIterator which allows asynchronous iteration over emitted values.
     * @returns {AsyncIterator} An object that conforms to the AsyncIterator protocol.
     * @example
     * const observable = new Observable();
     * for await (const value of observable) {
     *   console.log(value);
     * }
     */
    [Symbol.asyncIterator]() {
      let observer;
      let resolve;
      let promise = new Promise((r) => resolve = r);
      observer = {
        next: (value) => {
          resolve({ value, done: false });
          promise = new Promise((r) => resolve = r);
        },
        complete: () => {
          resolve({ done: true });
        },
        error: (err) => {
          throw err;
        }
      };
      this.subscribe(observer);
      return {
        next: () => promise
      };
    }
  };

  // src/utils.js
  var _deepEqual = (obj1, obj2) => {
    if (obj1 === obj2)
      return true;
    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
      return false;
    }
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length)
        return false;
      for (let i = 0; i < obj1.length; i++) {
        if (!_deepEqual(obj1[i], obj2[i])) {
          return false;
        }
      }
      return true;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length)
      return false;
    for (let key of keys1) {
      if (!obj2.hasOwnProperty(key) || !_deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  };
  var _deepClone = (value) => {
    if (value === null || typeof value !== "object") {
      return value;
    }
    if (value instanceof Date) {
      return new Date(value.getTime());
    }
    if (Array.isArray(value)) {
      return value.map(_deepClone);
    }
    if (value instanceof Set) {
      return new Set([...value].map(_deepClone));
    }
    if (value instanceof Map) {
      return new Map([...value].map(([k, v]) => [_deepClone(k), _deepClone(v)]));
    }
    const clonedObj = Object.create(Object.getPrototypeOf(value));
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        clonedObj[key] = _deepClone(value[key]);
      }
    }
    return clonedObj;
  };

  // src/config.js
  var __config = {
    events: {
      __state: true,
      get isEnabled() {
        return this.__state;
      },
      enable: function() {
        this.__state = true;
      },
      disable: function() {
        this.__state = false;
      }
    },
    debug: {
      __state: false,
      get isEnabled() {
        return this.__state;
      },
      enable: function() {
        console.log("Cami.js debug mode enabled");
        this.__state = true;
      },
      disable: function() {
        this.__state = false;
      }
    }
  };

  // src/trace.js
  function __trace(functionName, ...messages) {
    if (__config.debug.isEnabled) {
      const formattedMessages = messages.join("\n");
      if (functionName === "cami:elem:state:change") {
        console.groupCollapsed(`%c[${functionName}]`, "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;", `Changed property state: ${messages[0]}`);
        console.log(`oldValue:`, messages[1]);
        console.log(`newValue:`, messages[2]);
      } else if (functionName === "cami:store:state:change") {
        console.groupCollapsed(`%c[${functionName}]`, "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;", `Changed store state: ${messages[0]}`);
        console.log(`oldValue of ${messages[1][0].path.join(".")}:`, messages[1][0].value);
        console.log(`newValue of ${messages[2][0].path.join(".")}:`, messages[2][0].value);
      } else {
        console.groupCollapsed(`%c[${functionName}]`, "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;", formattedMessages);
      }
      console.trace();
      console.groupEnd();
    }
  }

  // src/observables/observable-state.js
  var _DependencyTracker = class _DependencyTracker {
    static track(effectFn) {
      const tracker = new _DependencyTracker();
      _DependencyTracker.current = tracker;
      effectFn();
      _DependencyTracker.current = null;
      return tracker.dependencies;
    }
    constructor() {
      this.dependencies = /* @__PURE__ */ new Set();
    }
    addDependency(observable) {
      this.dependencies.add(observable);
      if (!_DependencyTracker.dependencyGraph.has(observable)) {
        _DependencyTracker.dependencyGraph.set(observable, /* @__PURE__ */ new Set());
      }
      _DependencyTracker.dependencyGraph.get(observable).add(this);
    }
    static detectCycles() {
      const visited = /* @__PURE__ */ new Set();
      const recursionStack = /* @__PURE__ */ new Set();
      const cyclePath = [];
      function dfs(node) {
        visited.add(node);
        recursionStack.add(node);
        cyclePath.push(node);
        const neighbors = _DependencyTracker.dependencyGraph.get(node) || /* @__PURE__ */ new Set();
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            if (dfs(neighbor))
              return true;
          } else if (recursionStack.has(neighbor)) {
            const cycleStart = cyclePath.indexOf(neighbor);
            const cycle = cyclePath.slice(cycleStart);
            console.warn(`Cyclic dependency detected: ${cycle.map((n) => n.__name || "unnamed").join(" -> ")}`);
          }
        }
        recursionStack.delete(node);
        cyclePath.pop();
        return false;
      }
      for (const node of _DependencyTracker.dependencyGraph.keys()) {
        if (!visited.has(node)) {
          try {
            if (dfs(node))
              return true;
          } catch (error) {
            if (error.message.startsWith("Cyclic dependency detected:")) {
              console.warn(error.message);
            } else {
              throw error;
            }
          }
        }
      }
      return false;
    }
    static clearGraph() {
      _DependencyTracker.dependencyGraph.clear();
    }
  };
  __publicField(_DependencyTracker, "current", null);
  __publicField(_DependencyTracker, "dependencyGraph", /* @__PURE__ */ new Map());
  var DependencyTracker = _DependencyTracker;
  var ObservableState = class extends Observable {
    /**
     * @constructor
     * @param {any} initialValue - The initial value of the observable
     * @param {Subscriber} subscriber - The subscriber to the observable
     * @param {Object} options - Additional options for the observable
     * @param {boolean} options.last - Whether the subscriber is the last observer
     * @example
     * const observable = new ObservableState(10);
     */
    constructor(initialValue = null, subscriber = null, { last = false, name = null } = {}) {
      super();
      if (last) {
        this.__lastObserver = subscriber;
      } else {
        this.__observers.push(subscriber);
      }
      this.__value = produce(initialValue, (draft) => {
      });
      this.__pendingUpdates = [];
      this.__updateScheduled = false;
      this.__name = name;
      this.__isUpdating = false;
      this.__updateStack = [];
    }
    /**
     * @method
     * @returns {any} The current value of the observable
     * @example
     * const value = observable.value;
     */
    get value() {
      if (DependencyTracker.current != null) {
        DependencyTracker.current.addDependency(this);
      }
      return this.__value;
    }
    /**
     * @method
     * @param {any} newValue - The new value to set for the observable
     * @description This method sets a new value for the observable by calling the update method with the new value.
     * @example
     * observable.value = 20;
     */
    set value(newValue) {
      if (this.__isUpdating) {
        const cycle = [...this.__updateStack, this.__name].join(" -> ");
        console.warn(`[Cami.js] Cyclic dependency detected: ${cycle}`);
      }
      this.__isUpdating = true;
      this.__updateStack.push(this.__name);
      try {
        if (!_deepEqual(newValue, this.__value)) {
          this.__value = newValue;
          this.__notifyObservers();
        }
      } finally {
        this.__updateStack.pop();
        this.__isUpdating = false;
      }
    }
    /**
     * @method
     * @description Merges properties from the provided object into the observable's value
     * @param {Object} obj - The object whose properties to merge
     * @example
     * observable.assign({ key: 'value' });
     */
    assign(obj) {
      if (typeof this.__value !== "object" || this.__value === null) {
        throw new Error("[Cami.js] Observable value is not an object");
      }
      this.update((value) => Object.assign(value, obj));
    }
    /**
     * @method
     * @description Sets a new value for a specific key in the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.
     * @param {string} key - The key to set the new value for
     * @param {any} value - The new value to set
     * @throws Will throw an error if the observable's value is not an object
     * @example
     * observable.set('key.subkey', 'new value');
     */
    set(key, value) {
      if (typeof this.__value !== "object" || this.__value === null) {
        throw new Error("[Cami.js] Observable value is not an object");
      }
      this.update((state) => {
        const keys = key.split(".");
        let current2 = state;
        for (let i = 0; i < keys.length - 1; i++) {
          current2 = current2[keys[i]];
        }
        current2[keys[keys.length - 1]] = value;
      });
    }
    /**
     * @method
     * @description Deletes a specific key from the observable's value. If the key is nested, it should be provided as a string with keys separated by dots.
     * @param {string} key - The key to delete
     * @throws Will throw an error if the observable's value is not an object
     * @example
     * observable.delete('key.subkey');
     */
    delete(key) {
      if (typeof this.__value !== "object" || this.__value === null) {
        throw new Error("[Cami.js] Observable value is not an object");
      }
      this.update((state) => {
        const keys = key.split(".");
        let current2 = state;
        for (let i = 0; i < keys.length - 1; i++) {
          current2 = current2[keys[i]];
        }
        delete current2[keys[keys.length - 1]];
      });
    }
    /**
     * @method
     * @description Removes all key/value pairs from the observable's value
     * @example
     * observable.clear();
     */
    clear() {
      this.update(() => ({}));
    }
    /**
     * @method
     * @description Adds one or more elements to the end of the observable's value
     * @param {...any} elements - The elements to add
     * @example
     * observable.push(1, 2, 3);
     */
    push(...elements) {
      if (!Array.isArray(this.__value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((value) => {
        value.push(...elements);
      });
    }
    /**
     * @method
     * @description Removes the last element from the observable's value
     * @example
     * observable.pop();
     */
    pop() {
      if (!Array.isArray(this.__value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((value) => {
        value.pop();
      });
    }
    /**
     * @method
     * @description Removes the first element from the observable's value
     * @example
     * observable.shift();
     */
    shift() {
      if (!Array.isArray(this.__value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((value) => {
        value.shift();
      });
    }
    /**
     * @method
     * @description Changes the contents of the observable's value by removing, replacing, or adding elements
     * @param {number} start - The index at which to start changing the array
     * @param {number} deleteCount - The number of elements to remove
     * @param {...any} items - The elements to add to the array
     * @example
     * observable.splice(0, 1, 'newElement');
     */
    splice(start, deleteCount, ...items) {
      if (!Array.isArray(this.__value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((arr) => {
        arr.splice(start, deleteCount, ...items);
      });
    }
    /**
     * @method
     * @description Adds one or more elements to the beginning of the observable's value
     * @param {...any} elements - The elements to add
     * @example
     * observable.unshift('newElement');
     */
    unshift(...elements) {
      if (!Array.isArray(this.__value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((value) => {
        value.unshift(...elements);
      });
    }
    /**
     * @method
     * @description Reverses the order of the elements in the observable's value
     * @example
     * observable.reverse();
     */
    reverse() {
      if (!Array.isArray(this.__value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((value) => {
        value.reverse();
      });
    }
    /**
     * @method
     * @description Sorts the elements in the observable's value
     * @param {Function} [compareFunction] - The function used to determine the order of the elements
     * @example
     * observable.sort((a, b) => a - b);
     */
    sort(compareFunction) {
      if (!Array.isArray(this.__value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((value) => {
        value.sort(compareFunction);
      });
    }
    /**
     * @method
     * @description Changes all elements in the observable's value to a static value
     * @param {any} value - The value to fill the array with
     * @param {number} [start=0] - The index to start filling at
     * @param {number} [end=this.__value.length] - The index to stop filling at
     * @example
     * observable.fill('newElement', 0, 2);
     */
    fill(value, start = 0, end = this.__value.length) {
      if (!Array.isArray(this.__value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((arr) => {
        arr.fill(value, start, end);
      });
    }
    /**
     * @method
     * @description Shallow copies part of the observable's value to another location in the same array
     * @param {number} target - The index to copy the elements to
     * @param {number} start - The start index to begin copying elements from
     * @param {number} [end=this.__value.length] - The end index to stop copying elements from
     * @example
     * observable.copyWithin(0, 1, 2);
     */
    copyWithin(target, start, end = this.__value.length) {
      if (!Array.isArray(this.__value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((arr) => {
        arr.copyWithin(target, start, end);
      });
    }
    /**
     * @method
     * @param {Function} updater - The function to update the value
     * @description This method adds the updater function to the pending updates queue.
     * It uses a synchronous approach to schedule the updates, ensuring the whole state is consistent at each tick.
     * This is done to batch multiple updates together and avoid unnecessary re-renders.
     * @example
     * observable.update(value => value + 1);
     */
    update(updater) {
      if (this.__isUpdating) {
        const cycle = [...this.__updateStack, this.__name].join(" -> ");
        console.warn(`[Cami.js] Cyclic dependency detected: ${cycle}`);
      }
      this.__isUpdating = true;
      this.__updateStack.push(this.__name);
      try {
        this.__pendingUpdates.push(updater);
        this.__scheduleupdate();
      } finally {
        this.__updateStack.pop();
        this.__isUpdating = false;
      }
    }
    __scheduleupdate() {
      if (!this.__updateScheduled) {
        this.__updateScheduled = true;
        this.__applyUpdates();
      }
    }
    /**
     * @private
     * @method
     * @description This method notifies all observers of the observable with the current value.
     * It first creates a list of observers by combining the regular observers and the last observer.
     * Then, it iterates over this list and calls each observer with the current value.
     * If the observer is a function, it is called directly.
     * If the observer is an object with a 'next' method, the 'next' method is called.
     */
    __notifyObservers() {
      const observersWithLast = [...this.__observers, this.__lastObserver];
      observersWithLast.forEach((observer) => {
        if (observer && typeof observer === "function") {
          observer(this.__value);
        } else if (observer && observer.next) {
          observer.next(this.__value);
        }
      });
    }
    /**
     * @method
     * @private
     * @description This method applies all the pending updates to the value.
     * It then notifies all the observers with the updated value.
     */
    __applyUpdates() {
      let oldValue = this.__value;
      while (this.__pendingUpdates.length > 0) {
        const updater = this.__pendingUpdates.shift();
        if (typeof this.__value === "object" && this.__value !== null && this.__value.constructor === Object || Array.isArray(this.__value)) {
          this.__value = produce(this.__value, updater);
        } else {
          this.__value = updater(this.__value);
        }
      }
      if (!_deepEqual(oldValue, this.__value)) {
        this.__notifyObservers();
        if (__config.events.isEnabled && typeof window !== "undefined") {
          const event = new CustomEvent("cami:elem:state:change", {
            detail: {
              name: this.__name,
              oldValue,
              newValue: this.__value
            }
          });
          window.dispatchEvent(event);
        }
        __trace("cami:elem:state:change", this.__name, oldValue, this.__value);
      }
      this.__updateScheduled = false;
    }
    /**
     * @method
     * @description Calls the complete method of all observers.
     * @example
     * observable.complete();
     */
    complete() {
      this.__observers.forEach((observer) => {
        if (observer && typeof observer.complete === "function") {
          observer.complete();
        }
      });
    }
  };
  var effect = function(effectFn) {
    let cleanup = () => {
    };
    let dependencies = /* @__PURE__ */ new Set();
    let subscriptions = /* @__PURE__ */ new Map();
    const tracker = {
      addDependency: (observable) => {
        if (!dependencies.has(observable)) {
          const subscription = observable.onValue(_runEffect);
          dependencies.add(observable);
          subscriptions.set(observable, subscription);
        }
      }
    };
    const _runEffect = () => {
      cleanup();
      DependencyTracker.current = tracker;
      try {
        cleanup = effectFn() || (() => {
        });
      } catch (error) {
        console.warn(error.message);
      } finally {
        DependencyTracker.current = null;
      }
      try {
        DependencyTracker.detectCycles();
      } catch (error) {
        console.warn(error.message);
      }
    };
    if (typeof window !== "undefined") {
      requestAnimationFrame(_runEffect);
    } else {
      queueMicrotask(_runEffect);
    }
    const dispose = () => {
      subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      cleanup();
      DependencyTracker.clearGraph();
    };
    return dispose;
  };
  var derive = function(deriveFn) {
    let dependencies = /* @__PURE__ */ new Set();
    let subscriptions = /* @__PURE__ */ new Map();
    let currentValue;
    const tracker = {
      addDependency: (observable) => {
        if (!dependencies.has(observable)) {
          const subscription = observable.onChange(_computeDerivedValue);
          dependencies.add(observable);
          subscriptions.set(observable, subscription);
        }
      }
    };
    const _computeDerivedValue = () => {
      DependencyTracker.current = tracker;
      try {
        currentValue = deriveFn();
      } catch (error) {
        console.warn("[Cami.js] Error in derive function:", error.message);
      } finally {
        DependencyTracker.current = null;
      }
      try {
        DependencyTracker.detectCycles();
      } catch (error) {
        console.warn(error.message);
      }
    };
    _computeDerivedValue();
    const dispose = () => {
      subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      subscriptions.clear();
      dependencies.clear();
    };
    return { value: currentValue, dispose };
  };

  // src/invariant.js
  var isProduction = function() {
    var hostname = typeof window !== "undefined" && window.location && window.location.hostname || "";
    return hostname.indexOf("localhost") === -1 && hostname !== "0.0.0.0";
  }();
  var alwaysEnabled = false;
  function captureStackTrace(error) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, invariant);
    } else {
      error.stack = new Error().stack;
    }
  }
  var InvariantViolationError = class extends Error {
    constructor(message) {
      super(message);
      this.name = "InvariantViolationError";
      captureStackTrace(this);
    }
  };
  function invariant(message, callback) {
    if (!alwaysEnabled && isProduction)
      return;
    if (!callback()) {
      var error = new InvariantViolationError("Invariant Violation: " + message);
      if (!isProduction) {
        captureStackTrace(error);
      }
      throw error;
    }
  }
  invariant.config = function(config) {
    var development = config.development;
    var production = config.production;
    if (typeof development === "function" && typeof production === "function") {
      var isDev = development();
      var isProd = production();
      isProduction = isProd && !isDev;
      alwaysEnabled = false;
    } else if (config.hasOwnProperty("alwaysEnabled")) {
      alwaysEnabled = config.alwaysEnabled;
    }
  };

  // src/observables/observable-model.js
  var Model = class {
    constructor(name, properties) {
      this.name = name;
      this.schema = properties;
    }
    create(config) {
      const { state, actions = {}, asyncActions = {}, machines = {}, queries = {}, mutations = {}, specs = {}, memos = {}, options = {} } = config;
      this._validateState(state);
      const modelStore = store(__spreadValues({
        state,
        name: this.name,
        schema: this.schema
      }, options));
      Object.entries(actions).forEach(([actionName, actionFn]) => {
        modelStore.defineAction(actionName, (context) => {
          actionFn(context);
          this._validateState(context.state);
        });
      });
      Object.entries(asyncActions).forEach(([thunkName, thunkFn]) => {
        modelStore.defineAsyncAction(thunkName, (context) => __async(this, null, function* () {
          yield thunkFn(context);
          this._validateState(context.state);
        }));
      });
      Object.entries(machines).forEach(([machineName, machineDefinition]) => {
        modelStore.defineMachine(machineName, machineDefinition);
      });
      Object.entries(queries).forEach(([queryName, queryConfig]) => {
        modelStore.defineQuery(queryName, {
          queryKey: queryConfig.queryKey,
          queryFn: queryConfig.queryFn,
          onFetch: queryConfig.onFetch,
          onError: queryConfig.onError,
          onSuccess: queryConfig.onSuccess,
          onSettled: queryConfig.onSettled
        });
      });
      Object.entries(mutations).forEach(([mutationName, mutationConfig]) => {
        modelStore.defineMutation(mutationName, {
          mutationFn: mutationConfig.mutationFn,
          onMutate: mutationConfig.onMutate,
          onSuccess: mutationConfig.onSuccess,
          onError: mutationConfig.onError,
          onSettled: mutationConfig.onSettled
        });
      });
      Object.entries(specs).forEach(([actionName, spec]) => {
        modelStore.defineSpec(actionName, spec);
      });
      Object.entries(memos).forEach(([memoName, memoFn]) => {
        modelStore.defineMemo(memoName, memoFn);
      });
      return modelStore;
    }
    _validateState(state) {
      Object.entries(this.schema).forEach(([key, type]) => {
        try {
          if (Array.isArray(state[key])) {
            state[key].forEach((item, index) => {
              this._validateItem(item, type.itemType, [key, index], state);
            });
          } else {
            this._validateItem(state[key], type, [key], state);
          }
        } catch (error) {
          throw new Error(`Validation error in ${this.name}: ${error.message}`);
        }
      });
    }
    _validateItem(value, type, path, rootState) {
      if (type.type === "reference") {
        if (typeof value !== "number") {
          throw new Error(`Expected reference ID (number), got ${typeof value} at ${path.join(".")}`);
        }
      } else {
        validateType(value, type, path, rootState);
      }
    }
  };

  // src/types.js
  var Type = {
    String: "string",
    Float: "float",
    Number: "float",
    Integer: "integer",
    Natural: "natural",
    Boolean: "boolean",
    BigInt: "bigint",
    Symbol: "symbol",
    Null: "null",
    Object: (schema) => ({ type: "object", schema }),
    Array: (itemType) => ({ type: "array", itemType }),
    Sum: (...types) => ({ type: "sum", types }),
    Product: (fields) => ({ type: "product", fields }),
    Any: { type: "any" },
    Enum: (...values) => ({ type: "enum", values }),
    Optional: (type) => ({ type: "optional", optional: type }),
    Refinement: (baseType, refinementFn) => ({ type: "refinement", baseType, refinementFn }),
    DependentPair: (fstType, sndTypeFn) => ({
      type: "dependentPair",
      fstType,
      sndTypeFn
    }),
    DependentRecord: (fields, validateFn) => ({
      type: "dependentRecord",
      fields,
      validateFn
    }),
    Date: { type: "date" },
    Vect: (length, elemType) => ({ type: "vect", length, elemType }),
    Tree: (valueType) => ({ type: "tree", valueType }),
    RoseTree: (valueType) => ({ type: "roseTree", valueType }),
    Literal: (value) => ({ type: "literal", value }),
    Function: (paramTypes, returnType) => ({ type: "function", paramTypes, returnType }),
    Void: { type: "void" },
    DependentFunction: (paramTypes, returnTypeFn) => ({
      type: "dependentFunction",
      paramTypes,
      returnTypeFn
    }),
    DependentArray: (lengthFn, itemTypeFn) => ({
      type: "dependentArray",
      lengthFn,
      itemTypeFn
    }),
    DependentSum: (discriminantFn, typesFn) => ({
      type: "dependentSum",
      discriminantFn,
      typesFn
    }),
    Model: (name, properties) => new Model(name, properties),
    Reference: (modelName) => ({
      type: "reference",
      modelName
    })
  };
  var typeValidators = {
    string: (value, type, path) => {
      if (typeof value !== type)
        throw new Error(`Expected ${type}, got ${typeof value} at ${path.join(".")}`);
    },
    object: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null)
        throw new Error(`Expected object, got ${value === null ? "null" : typeof value} at ${path.join(".")}`);
      Object.entries(type.schema).forEach(([key, subType]) => {
        if (!(key in value))
          throw new Error(`Missing required property ${key} at ${path.join(".")}`);
        validateType2(value[key], subType, [...path, key], rootState);
      });
    },
    array: (value, type, path, rootState, validateType2) => {
      if (!Array.isArray(value))
        throw new Error(`Expected array, got ${typeof value} at ${path.join(".")}`);
      if (value.length > 0) {
        value.forEach((item, index) => {
          try {
            validateType2(item, type.itemType, [...path, index], rootState);
          } catch (error) {
            throw new Error(`Invalid item at index ${index}: ${error.message}`);
          }
        });
      }
    },
    any: () => {
    },
    enum: (value, type, path) => {
      if (!type.values.includes(value))
        throw new Error(`Expected one of ${type.values.join(", ")}, got ${value} at ${path.join(".")}`);
    },
    sum: (value, type, path, rootState, validateType2) => {
      const errors2 = [];
      if (!type.types.some((subType) => {
        try {
          validateType2(value, subType, path, rootState);
          return true;
        } catch (e) {
          errors2.push(e.message);
          return false;
        }
      })) {
        throw new Error(`Sum type validation failed at ${path.join(".")}. Value: ${JSON.stringify(value)}. Errors: ${errors2.join("; ")}`);
      }
    },
    product: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null)
        throw new Error(`Expected object, got ${typeof value} at ${path.join(".")}`);
      Object.entries(type.fields).forEach(([key, subType]) => {
        if (!(key in value))
          throw new Error(`Missing required property ${key} at ${path.join(".")}`);
        validateType2(value[key], subType, [...path, key], rootState);
      });
    },
    optional: (value, type, path, rootState, validateType2) => {
      if (value !== void 0 && value !== null)
        validateType2(value, type.optional, path, rootState);
    },
    null: (value, type, path) => {
      if (value !== null)
        throw new Error(`Expected null, got ${typeof value} at ${path.join(".")}`);
    },
    refinement: (value, type, path, rootState, validateType2) => {
      validateType2(value, type.baseType, path, rootState);
      if (!type.refinementFn(value)) {
        throw new Error(`Refinement predicate failed at ${path.join(".")}`);
      }
    },
    dependentPair: (value, type, path, rootState, validateType2) => {
      if (!Array.isArray(value) || value.length !== 2) {
        throw new Error(`Expected dependent pair at ${path.join(".")}`);
      }
      validateType2(value[0], type.fstType, [...path, 0], rootState);
      const sndType = type.sndTypeFn(value[0]);
      validateType2(value[1], sndType, [...path, 1], rootState);
    },
    date: (value, type, path) => {
      if (!(value instanceof Date))
        throw new Error(`Expected Date, got ${typeof value} at ${path.join(".")}`);
    },
    float: (value, type, path) => {
      if (typeof value !== "number") {
        throw new Error(`Expected float, got ${typeof value} at ${path.join(".")}`);
      }
      if (Number.isNaN(value)) {
        throw new Error(`Expected float, got NaN at ${path.join(".")}`);
      }
    },
    integer: (value, type, path) => {
      if (!Number.isInteger(value)) {
        throw new Error(`Expected integer, got ${typeof value === "number" ? "float" : typeof value} at ${path.join(".")}`);
      }
    },
    natural: (value, type, path) => {
      if (!Number.isInteger(value) || value < 0) {
        throw new Error(`Expected natural number, got ${value} at ${path.join(".")}`);
      }
    },
    vect: (value, type, path, rootState, validateType2) => {
      if (!Array.isArray(value) || value.length !== type.length) {
        throw new Error(`Expected Vect of length ${type.length}, got ${value.length} at ${path.join(".")}`);
      }
      value.forEach((item, index) => {
        validateType2(item, type.elemType, [...path, index], rootState);
      });
    },
    tree: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null)
        throw new Error(`Expected tree, got ${typeof value} at ${path.join(".")}`);
      if (!("value" in value))
        throw new Error(`Invalid tree structure: missing 'value' at ${path.join(".")}`);
      validateType2(value.value, type.valueType, [...path, "value"], rootState);
      if ("left" in value)
        validateType2(value.left, type, [...path, "left"], rootState);
      if ("right" in value)
        validateType2(value.right, type, [...path, "right"], rootState);
    },
    roseTree: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null)
        throw new Error(`Expected rose tree, got ${typeof value} at ${path.join(".")}`);
      if (!("value" in value) || !("children" in value))
        throw new Error(`Invalid rose tree structure at ${path.join(".")}`);
      validateType2(value.value, type.valueType, [...path, "value"], rootState);
      if (!Array.isArray(value.children))
        throw new Error(`Expected array of children, got ${typeof value.children} at ${path.join(".")}.children`);
      value.children.forEach((child, index) => {
        validateType2(child, type, [...path, "children", index], rootState);
      });
    },
    dependentRecord: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null)
        throw new Error(`Expected object, got ${typeof value} at ${path.join(".")}`);
      Object.entries(type.fields).forEach(([key, fieldType]) => {
        if (!(key in value))
          throw new Error(`Missing required property ${key} at ${path.join(".")}`);
        const resolvedType = typeof fieldType === "function" ? fieldType(value) : fieldType;
        validateType2(value[key], resolvedType, [...path, key], rootState);
      });
      if (typeof type.validateFn === "function") {
        const result = type.validateFn(value, rootState);
        if (result !== true) {
          throw new Error(`Validation failed for dependent record at ${path.join(".")}: ${result}`);
        }
      }
    },
    dependentFunction: (value, type, path) => {
      if (typeof value !== "function") {
        throw new Error(`Expected function, got ${typeof value} at ${path.join(".")}`);
      }
    },
    dependentArray: (value, type, path, rootState, validateType2) => {
      if (!Array.isArray(value)) {
        throw new Error(`Expected array, got ${typeof value} at ${path.join(".")}`);
      }
      const expectedLength = type.lengthFn(value);
      if (value.length !== expectedLength) {
        throw new Error(`Expected array of length ${expectedLength}, got ${value.length} at ${path.join(".")}`);
      }
      value.forEach((item, index) => {
        const itemType = type.itemTypeFn(index, value);
        validateType2(item, itemType, [...path, index], rootState);
      });
    },
    dependentSum: (value, type, path, rootState, validateType2) => {
      const discriminant = type.discriminantFn(value);
      const possibleTypes = type.typesFn(discriminant);
      const errors2 = [];
      for (const subType of possibleTypes) {
        try {
          validateType2(value, subType, path, rootState);
          break;
        } catch (e) {
          errors2.push(e.message);
        }
      }
      if (possibleTypes.length === errors2.length) {
        throw new Error(`Dependent sum type validation failed at ${path.join(".")}. Errors: ${errors2.join("; ")}`);
      }
    },
    literal: (value, type, path) => {
      if (value !== type.value) {
        throw new Error(`Expected ${type.value}, got ${value} at ${path.join(".")}`);
      }
    },
    boolean: (value, type, path) => {
      if (typeof value !== "boolean")
        throw new Error(`Expected boolean, got ${typeof value} at ${path.join(".")}`);
    },
    bigint: (value, type, path) => {
      if (typeof value !== "bigint")
        throw new Error(`Expected bigint, got ${typeof value} at ${path.join(".")}`);
    },
    symbol: (value, type, path) => {
      if (typeof value !== "symbol")
        throw new Error(`Expected symbol, got ${typeof value} at ${path.join(".")}`);
    },
    function: (value, type, path) => {
      if (typeof value !== "function") {
        throw new Error(`Expected function, got ${typeof value} at ${path.join(".")}`);
      }
    },
    void: () => {
    },
    reference: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "number") {
        throw new Error(`Expected reference ID (number), got ${typeof value} at ${path.join(".")}`);
      }
    },
    model: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null) {
        throw new Error(`Expected model object, got ${typeof value} at ${path.join(".")}`);
      }
      Object.entries(type.schema).forEach(([key, fieldType]) => {
        if (!(key in value)) {
          throw new Error(`Missing required property ${key} in model at ${path.join(".")}`);
        }
        validateType2(value[key], fieldType, [...path, key], rootState);
      });
    }
  };
  var validateType = (value, type, path = [], rootState = {}) => {
    if (value === null && type.type !== "null" && type.type !== "optional") {
      throw new Error(`Expected non-null value, got null at ${path.join(".")}`);
    }
    if (value === void 0 && type.type !== "optional") {
      throw new Error(`Missing required property at ${path.join(".")}`);
    }
    if (type instanceof Model) {
      return typeValidators.model(value, type, path, rootState, validateType);
    }
    const validator = typeof type === "string" ? typeValidators[type] : typeValidators[type.type];
    if (validator) {
      validator(value, type, path, rootState, validateType);
    } else {
      throw new Error(`Unknown type ${JSON.stringify(type)} at ${path.join(".")}`);
    }
  };
  var useValidationHook = (schema) => {
    return (state) => {
      const clonedState = _deepClone(state);
      if (schema.type === "dependentRecord") {
        validateType(clonedState, schema, [], clonedState);
      } else {
        Object.entries(schema).forEach(([key, type]) => {
          validateType(clonedState[key], type, [key], clonedState);
        });
      }
    };
  };
  var useValidationThunk = (schema) => {
    return (state) => {
      const clonedState = _deepClone(state);
      if (schema.type === "dependentRecord") {
        validateType(clonedState, schema, [], clonedState);
      } else {
        Object.entries(schema).forEach(([key, type]) => {
          try {
            validateType(clonedState[key], type, [key], clonedState);
          } catch (error) {
            throw error;
          }
        });
      }
    };
  };

  // src/observables/observable-store.js
  enablePatches();
  var ObservableStore = class extends Observable {
    constructor(initialState, options = {}) {
      super((subscriber) => {
        this.__subscriber = subscriber;
        return () => {
          this.__subscriber = null;
        };
      });
      this.name = options.name || "cami-store";
      this.schema = options.schema || {};
      this._state = this._createProxy(createDraft(initialState));
      this.previousState = _deepClone(initialState);
      this.reducers = {};
      this.actions = {};
      this.devTools = this.__connectToDevTools();
      this.dispatchQueue = [];
      this.isDispatching = false;
      this.currentDispatchPromise = null;
      this.queryCache = /* @__PURE__ */ new Map();
      this.queryFunctions = /* @__PURE__ */ new Map();
      this.queries = {};
      this.intervals = /* @__PURE__ */ new Map();
      this.focusHandlers = /* @__PURE__ */ new Map();
      this.reconnectHandlers = /* @__PURE__ */ new Map();
      this.gcTimeouts = /* @__PURE__ */ new Map();
      this.mutationFunctions = /* @__PURE__ */ new Map();
      this.mutations = {};
      this.patchListeners = /* @__PURE__ */ new Map();
      this.machines = {};
      this.memos = {};
      this.memoCache = /* @__PURE__ */ new Map();
      this.thunks = {};
      this.beforeHooks = [];
      this.afterHooks = [];
      this.specs = /* @__PURE__ */ new Map();
      this.dispatch = this.dispatch.bind(this);
      this.query = this.query.bind(this);
      this.mutate = this.mutate.bind(this);
      this.subscribe = this.subscribe.bind(this);
      this.trigger = this.trigger.bind(this);
      this.memo = this.memo.bind(this);
      this.invalidateQueries = this.invalidateQueries.bind(this);
      this.dispatchAsync = this.dispatchAsync.bind(this);
      this._persistState = () => {
        if (this.storage) {
          const currentTime = /* @__PURE__ */ new Date();
          const expiryTime = new Date(currentTime.getTime() + this.expiry);
          this.storage.setItem(this.name, JSON.stringify(this._state));
          this.storage.setItem(`${this.name}-expiry`, expiryTime.getTime().toString());
        }
      };
      Object.keys(initialState).forEach((key) => {
        if (typeof initialState[key] === "function") {
          this.defineAction(key, initialState[key]);
        } else {
          this._state[key] = initialState[key];
        }
      });
      this.__isDispatching = false;
      this.__dispatchStack = [];
      this._validateState(this._state);
    }
    get state() {
      if (DependencyTracker.current) {
        DependencyTracker.current.addDependency(this);
      }
      return deepFreeze(this._state);
    }
    getState() {
      if (DependencyTracker.current) {
        DependencyTracker.current.addDependency(this);
      }
      return deepFreeze(this._state);
    }
    _createProxy(target) {
      return new Proxy(target, {
        get: (target2, prop) => {
          if (DependencyTracker.current) {
            DependencyTracker.current.addDependency(this, prop);
          }
          return target2[prop];
        },
        set: (target2, prop, value) => {
          target2[prop] = value;
          if (!(prop in this)) {
            this._reProxy();
          }
          this._notifyObservers();
          return true;
        }
      });
    }
    _reProxy() {
      Object.keys(this._state).forEach((key) => {
        if (!(key in this)) {
          Object.defineProperty(this, key, {
            get: () => this._state[key],
            set: (value) => {
              this._state[key] = value;
              this._notifyObservers();
            },
            enumerable: true,
            configurable: true
          });
        }
      });
    }
    _notifyObservers() {
      if (!_deepEqual(this._state, this.previousState)) {
        this.memoCache.clear();
        this.__observers.forEach((observer) => observer.next(this._state));
        if (this.__subscriber && typeof this.__subscriber.next === "function") {
          this.__subscriber.next(this._state);
        }
        this.previousState = _deepClone(this._state);
        const dependencies = DependencyTracker.dependencyGraph.get(this);
        if (dependencies) {
          dependencies.forEach((dep) => {
            if (typeof dep.update === "function") {
              dep.update();
            }
          });
        }
      }
    }
    _createDeepSchema(state) {
      const inferType = (value) => {
        if (Array.isArray(value))
          return "array";
        if (value === null)
          return "null";
        if (value === void 0)
          return "undefined";
        if (typeof value === "object")
          return this._createDeepSchema(value);
        return typeof value;
      };
      return Object.keys(state).reduce((acc, key) => {
        acc[key] = inferType(state[key]);
        return acc;
      }, {});
    }
    _validateDeepState(schema, state, path = []) {
      Object.keys(schema).forEach((key) => {
        const expectedType = schema[key];
        const actualValue = state[key];
        const currentPath = [...path, key];
        const actualType = this._inferType(actualValue);
        if (actualType === "function") {
        }
        if (typeof expectedType === "object" && expectedType !== null) {
          if (typeof actualValue !== "object" || actualValue === null) {
            throw new TypeError(`Invalid type at ${currentPath.join(".")}. Expected object, got ${typeof actualValue}`);
          }
          this._validateDeepState(expectedType, actualValue, currentPath);
        } else {
          if (expectedType === "null") {
          } else if (expectedType === "undefined") {
          } else if (actualType !== expectedType) {
            throw new TypeError(`Invalid type at ${currentPath.join(".")}. Expected ${expectedType}, got ${actualType}`);
          }
        }
      });
    }
    _inferType(value) {
      if (Array.isArray(value))
        return "array";
      if (value === null)
        return "null";
      if (value === void 0)
        return "undefined";
      return typeof value;
    }
    _processDispatchQueue() {
      this.isDispatching = true;
      const processNext = () => {
        if (this.dispatchQueue.length > 0) {
          const { action, payload } = this.dispatchQueue.shift();
          try {
            this._dispatch(action, payload);
          } catch (error) {
            this.isDispatching = false;
            throw error;
          }
          processNext();
        } else {
          this.isDispatching = false;
        }
      };
      processNext();
    }
    dispatch(action, payload) {
      return this._dispatch(action, payload);
    }
    _dispatch(action, payload) {
      var _a;
      if (this.__isDispatching) {
        const cycle = [...this.__dispatchStack, action].join(" -> ");
        console.warn(`[Cami.js] Cyclic dispatch detected: ${cycle}`);
      }
      this.__isDispatching = true;
      this.__dispatchStack.push(action);
      try {
        if (action === void 0) {
          const currentAction = this.__dispatchStack[this.__dispatchStack.length - 2];
          if (currentAction) {
            throw new Error(`[Cami.js] Attempted to dispatch undefined action. This is likely invoked in action "${currentAction}".`);
          } else {
            throw new Error(`[Cami.js] Attempted to dispatch undefined action in the global namespace.`);
          }
        }
        if (typeof action !== "string") {
          throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof action}`);
        }
        const reducer = this.reducers[action];
        const spec = (_a = this.specs) == null ? void 0 : _a.get(action);
        if (!reducer) {
          console.warn(`No reducer found for action ${action}`);
          return _deepClone(this._state);
        }
        if (spec && spec.precondition) {
          const isPreconditionMet = spec.precondition({ state: this._state, payload, action });
          if (!isPreconditionMet) {
            throw new Error(`Precondition not met for action ${action}`);
          }
        }
        this.__applyHooks("before", { action, payload, state: this._state });
        const [nextState, patches, inversePatches] = produceWithPatches(this._state, (draft) => {
          reducer({
            state: draft,
            payload,
            dispatch: this.dispatch.bind(this),
            query: this.query.bind(this),
            mutate: this.mutate.bind(this),
            invalidateQueries: this.invalidateQueries.bind(this),
            memo: this.memo.bind(this),
            trigger: this.trigger.bind(this)
          });
        });
        if (spec && spec.postcondition) {
          const isPostconditionMet = spec.postcondition({ state: nextState, payload, action, previousState: _deepClone(this._state) });
          if (!isPostconditionMet) {
            throw new Error(`Postcondition not met for action ${action}`);
          }
        }
        this.__applyHooks("after", { action, payload, state: nextState, previousState: this._state, patches, inversePatches, dispatch: this.dispatch.bind(this) });
        const hasChanged = patches.length > 0;
        if (hasChanged) {
          const stateHasChanged = !_deepEqual(this._state, nextState);
          if (stateHasChanged) {
            Object.keys(nextState).forEach((key) => {
              this._state[key] = nextState[key];
            });
            this._notifyPatchListeners(patches);
            if (this.devTools) {
              this.devTools.send(action, this._state);
            }
            __trace("cami:store:state:change", `Changed store state via action: ${action}`, inversePatches, patches);
            if (__config.events.isEnabled && typeof window !== "undefined") {
              const event = new CustomEvent("cami:store:state:change", {
                detail: {
                  action,
                  patches,
                  inversePatches
                }
              });
              window.dispatchEvent(event);
            }
          }
        }
        this._validateState(this._state);
        return _deepClone(this._state);
      } finally {
        this.__dispatchStack.pop();
        this.__isDispatching = false;
      }
    }
    beforeHook(hook) {
      this.beforeHooks.push(hook);
    }
    afterHook(hook) {
      this.afterHooks.push(hook);
    }
    __applyHooks(type, context) {
      const hooks = type === "before" ? this.beforeHooks : this.afterHooks;
      for (const hook of hooks) {
        hook(context);
      }
    }
    _notifyPatchListeners(patches) {
      patches.forEach((patch) => {
        const key = patch.path[0];
        const listeners = this.patchListeners.get(key);
        if (listeners) {
          listeners.forEach((callback) => callback(patch));
        }
      });
    }
    /**
     * @private
     * @method _connectToDevTools
     * @returns {Object|null} - Returns the devTools object if available, else null
     * @description This method connects the store to the Redux DevTools extension if it is available.
     */
    __connectToDevTools() {
      if (typeof window !== "undefined" && window["__REDUX_DEVTOOLS_EXTENSION__"]) {
        const devTools = window["__REDUX_DEVTOOLS_EXTENSION__"].connect();
        devTools.init(this._state);
        return devTools;
      }
      return null;
    }
    /**
     * @method register
     * @memberof ObservableStore
     * @param {string} action - The action type
     * @param {Function} reducer - The reducer function for the action
     * @throws {Error} - Throws an error if the action type is already registered
     * @description This method registers a reducer function for a given action type. Useful if you like redux-style reducers.
     * @example
     * ```javascript
     * // Creating a store with initial state and registering actions
     * const CartStore = cami.store({
     *   cartItems: [],
     * });
     *
     * CartStore.defineAction('add', (state, product) => {
     *   const cartItem = { ...product, cartItemId: Date.now() };
     *   state.cartItems.push(cartItem);
     * });
     *
     * CartStore.defineAction('remove', (state, product) => {
     *   state.cartItems = state.cartItems.filter(item => item.cartItemId !== product.cartItemId);
     * });
     *
     * ```
     */
    defineAction(action, reducer) {
      if (this.reducers[action]) {
        throw new Error(`[Cami.js] Action '${action}' is already defined.`);
      }
      this.reducers[action] = (context) => {
        const storeContext = __spreadProps(__spreadValues({}, context), {
          dispatch: this.dispatch.bind(this),
          query: this.query.bind(this),
          mutate: this.mutate.bind(this),
          memo: this.memo.bind(this),
          trigger: this.trigger.bind(this),
          invalidateQueries: this.invalidateQueries.bind(this),
          dispatchAsync: this.dispatchAsync.bind(this)
        });
        return reducer(storeContext);
      };
      this.actions[action] = (...args) => {
        return this.dispatch(action, ...args);
      };
    }
    defineSpec(actionName, spec) {
      if (!this.specs) {
        this.specs = /* @__PURE__ */ new Map();
      }
      this.specs.set(actionName, spec);
    }
    /**
     * @method defineAsyncAction
     * @param {string} thunkName - The name of the thunk
     * @param {Function} asyncCallback - The async function to be executed
     * @description Defines a new thunk for the store
     */
    defineAsyncAction(thunkName, asyncCallback) {
      if (this.thunks[thunkName]) {
        throw new Error(`[Cami.js] Thunk '${thunkName}' is already defined.`);
      }
      this.thunks[thunkName] = asyncCallback;
    }
    /**
     * @method dispatchAsync
     * @param {string} thunkName - The name of the thunk to dispatch
     * @param {*} payload - The payload for the thunk
     * @returns {Promise} A promise that resolves with the result of the thunk
     * @description Dispatches an async thunk
     */
    dispatchAsync(thunkName, payload) {
      return __async(this, null, function* () {
        const thunk = this.thunks[thunkName];
        if (!thunk) {
          throw new Error(`[Cami.js] No thunk found for name: ${thunkName}`);
        }
        const context = {
          state: deepFreeze(this._state),
          dispatch: this.dispatch.bind(this),
          dispatchAsync: this.dispatchAsync.bind(this),
          trigger: this.trigger.bind(this),
          query: this.query.bind(this),
          mutate: this.mutate.bind(this),
          invalidateQueries: this.invalidateQueries.bind(this),
          payload
        };
        try {
          return yield thunk(context, payload);
        } catch (error) {
          console.error(`Error in thunk ${thunkName}:`, error);
          throw error;
        }
      });
    }
    query(queryName, payload) {
      return __async(this, null, function* () {
        const query = this.queryFunctions.get(queryName);
        if (!query) {
          throw new Error(`[Cami.js] No query found for name: ${queryName}`);
        }
        try {
          return yield this._executeQuery(queryName, payload, query);
        } catch (error) {
          console.error(`Error in query ${queryName}:`, error);
          throw error;
        }
      });
    }
    mutate(mutationName, payload) {
      return __async(this, null, function* () {
        const mutation = this.mutationFunctions.get(mutationName);
        if (!mutation) {
          throw new Error(`[Cami.js] No mutation found for name: ${mutationName}`);
        }
        try {
          return yield this._executeMutation(mutationName, payload, mutation);
        } catch (error) {
          console.error(`Error in mutation ${mutationName}:`, error);
          throw error;
        }
      });
    }
    defineMemo(memoName, memoFn) {
      if (typeof memoName !== "string") {
        throw new Error("Memo name must be a string");
      }
      if (typeof memoFn !== "function") {
        throw new Error(`Memo '${memoName}' must be a function`);
      }
      this.memos[memoName] = memoFn;
      this.memoCache.set(memoName, /* @__PURE__ */ new Map());
    }
    /**
     * @method onPatch
     * @memberof ObservableStore
     * @param {string} key - The state key to listen for patches.
     * @param {Function} callback - The callback to invoke when patches are applied.
     * @description Registers a callback to be invoked whenever patches are applied to the specified state key.
     * @example
     * ```javascript
     * appStore.onPatch('posts', (patch) => {
     *   console.log('Patch applied:', patch);
     * });
     * ```
     */
    onPatch(key, callback) {
      if (!this.patchListeners.has(key)) {
        this.patchListeners.set(key, []);
      }
      this.patchListeners.get(key).push(callback);
      return () => {
        const listeners = this.patchListeners.get(key);
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    }
    /**
     * @method applyPatch
     * @memberof ObservableStore
     * @param {Array} patches - The patches to apply to the state.
     * @description Applies the given patches to the store's state.
     * @example
     * ```javascript
     * const patches = [{ op: 'replace', path: ['posts', 0, 'title'], value: 'New Title' }];
     * appStore.applyPatch(patches);
     * ```
     */
    applyPatch(patches) {
      this._state = applyPatches(this._state, patches);
      this.__observers.forEach((observer) => observer.next(this._state));
    }
    /**
      * @method query
      * @memberof ObservableStore
      * @param {string} queryName - The name of the query to register.
      * @param {Object} config - The configuration object for the query.
      * @param {string|Array|Function} config.queryKey - The unique key for the query or a function to generate the key.
      * @param {Function} config.queryFn - The function to fetch data for the query.
      * @param {number} [config.staleTime=0] - The time in milliseconds before the query is considered stale.
      * @param {boolean} [config.refetchOnWindowFocus=false] - Whether to refetch the query on window focus.
      * @param {number|null} [config.refetchInterval=null] - The interval in milliseconds to refetch the query.
      * @param {boolean} [config.refetchOnReconnect=true] - Whether to refetch the query on reconnect.
      * @param {number} [config.gcTime=300000] - The time in milliseconds before garbage collecting the query.
      * @param {number} [config.retry=1] - The number of retry attempts for the query.
      * @param {Function} [config.retryDelay] - The function to calculate the delay between retries.
      * @param {Function} [config.onSuccess] - The callback function to execute when the query succeeds. Receives a context object with `result`, `state`, `actions`, `mutations`, and `invalidateQueries`.
      * @param {Function} [config.onError] - The callback function to execute when the query fails. Receives a context object with `error`, `state`, `actions`, `mutations`, and `invalidateQueries`.
      * @param {Object} [config.actions=this.actions] - The actions available in the store.
      * @description Registers a query with the given configuration. This method sets up the query with the provided options and handles refetching based on various triggers like window focus, reconnect, and intervals.
      * @example
      * ```javascript
      * appStore.defineAction('setPosts', (state, posts) => {
      *   state.posts = posts;
      * });
      *
      * appStore.defineQuery('fetchPosts', {
      *   queryKey: (args) => ['posts', ...args],
      *   queryFn: () => fetch('https://api.camijs.com/posts').then(res => res.json()),
      *   onSuccess: (ctx) => {
      *     ctx.actions.setPosts(ctx.result);
      *   },
      *   onError: (ctx) => {
      *     // console.error('Query failed:', ctx.error);
      *   }
      * });
      * ```
      */
    defineQuery(queryName, config) {
      if (this.queryFunctions.has(queryName)) {
        throw new Error(`[Cami.js] Query with name ${queryName} has already been defined.`);
      }
      this.queryFunctions.set(queryName, config);
      this.queries[queryName] = (...args) => this.query(queryName, ...args);
    }
    _executeQuery(queryName, payload, query) {
      const { queryFn, queryKey, staleTime, retry, retryDelay, onFetch, onSuccess, onError, onSettled } = query;
      const cacheKey = typeof queryKey === "function" ? queryKey(payload).join(":") : Array.isArray(queryKey) ? queryKey.join(":") : queryKey;
      const cachedData = this.queryCache.get(cacheKey);
      const storeContext = {
        state: this._state,
        payload,
        dispatch: this.dispatch.bind(this),
        trigger: this.trigger.bind(this),
        memo: this.memo.bind(this),
        query: this.query.bind(this),
        mutate: this.mutate.bind(this),
        invalidateQueries: this.invalidateQueries.bind(this),
        dispatchAsync: this.dispatchAsync.bind(this)
      };
      __trace(`_executeQuery`, `Checking cache for key: ${cacheKey}, exists: ${!!cachedData}`);
      if (cachedData && !this._isStale(cachedData, staleTime)) {
        __trace(`query`, `Returning cached data for: ${queryName} with cacheKey: ${cacheKey}`);
        return this._handleQueryResult(queryName, cachedData.data, null, storeContext, { onSuccess, onSettled });
      }
      __trace(`query`, `Data is stale or not cached, fetching new data for: ${queryName}`);
      if (onFetch) {
        __trace(`query`, `onFetch callback invoked for: ${queryName}`);
        onFetch(storeContext);
      }
      return this._fetchWithRetry(() => queryFn(payload), retry, retryDelay).then((data) => {
        this.queryCache.set(cacheKey, { data, timestamp: Date.now(), isStale: false });
        return this._handleQueryResult(queryName, data, null, storeContext, { onSuccess, onSettled });
      }).catch((error) => {
        return this._handleQueryResult(queryName, null, error, storeContext, { onError, onSettled });
      });
    }
    _handleQueryResult(queryName, data, error, storeContext, callbacks) {
      const { onSuccess, onError, onSettled } = callbacks;
      const context = __spreadProps(__spreadValues({}, storeContext), { data, error });
      if (error) {
        __trace(`query`, `Fetch failed: ${queryName}`);
        if (onError)
          onError(context);
      } else {
        __trace(`query`, `Fetch success: ${queryName}`);
        if (onSuccess)
          onSuccess(context);
      }
      if (onSettled) {
        __trace(`query`, `Fetch settled: ${queryName}`);
        onSettled(context);
      }
      if (error)
        throw error;
      return data;
    }
    /**
     * @method invalidateQueries
     * @memberof ObservableStore
     * @param {Object} options - The options for invalidating queries.
     * @param {string[]} [options.queryKey] - The query key to invalidate.
     * @param {Function} [options.predicate] - A predicate function to match queries to invalidate.
     * @description Invalidates the cache and any associated intervals or event listeners for the given queries.
     * @throws {Error} Throws an error if neither queryKey nor predicate is provided.
     */
    invalidateQueries({ queryKey, predicate }) {
      if (!queryKey && !predicate) {
        throw new Error(`[Cami.js] invalidateQueries expects either a queryKey or a predicate.`);
      }
      const queriesToInvalidate = Array.from(this.queryFunctions.keys()).filter((queryName) => {
        if (queryKey) {
          const storedQueryKey = this.queryFunctions.get(queryName).queryKey;
          if (typeof storedQueryKey === "function") {
            try {
              const generatedKey = storedQueryKey({});
              return JSON.stringify(generatedKey) === JSON.stringify(queryKey);
            } catch (error) {
              __trace(`invalidateQueries`, `Error generating key for ${queryName}: ${error.message}`);
              return false;
            }
          } else if (Array.isArray(storedQueryKey)) {
            return JSON.stringify(storedQueryKey) === JSON.stringify(queryKey);
          } else {
            return storedQueryKey === queryKey[0];
          }
        }
        if (predicate) {
          return predicate(this.queryFunctions.get(queryName));
        }
        return false;
      });
      queriesToInvalidate.forEach((queryName) => {
        const query = this.queryFunctions.get(queryName);
        if (!query)
          return;
        let cacheKey;
        if (typeof query.queryKey === "function") {
          cacheKey = query.queryKey().join(":");
        } else if (Array.isArray(query.queryKey)) {
          cacheKey = query.queryKey.join(":");
        } else {
          cacheKey = query.queryKey;
        }
        __trace(`invalidateQueries`, `Invalidating query with key: ${queryName}, cacheKey: ${cacheKey}`);
        if (this.queryCache.has(cacheKey)) {
          const cachedData = this.queryCache.get(cacheKey);
          cachedData.isStale = true;
          cachedData.timestamp = 0;
          this.queryCache.set(cacheKey, cachedData);
        }
        if (this.intervals.has(queryName)) {
          clearInterval(this.intervals.get(queryName));
          this.intervals.delete(queryName);
        }
        if (this.focusHandlers.has(queryName)) {
          window.removeEventListener("focus", this.focusHandlers.get(queryName));
          this.focusHandlers.delete(queryName);
        }
        if (this.reconnectHandlers.has(queryName)) {
          window.removeEventListener("online", this.reconnectHandlers.get(queryName));
          this.reconnectHandlers.delete(queryName);
        }
        if (this.gcTimeouts.has(queryName)) {
          clearTimeout(this.gcTimeouts.get(queryName));
          this.gcTimeouts.delete(queryName);
        }
        __trace(`invalidateQueries`, `Cache entry removed for key: ${cacheKey}`);
      });
    }
    /**
     * @private
     * @method fetchWithRetry
     * @param {Function} queryFn - The query function to execute.
     * @param {Array} args - The arguments to pass to the query function.
     * @param {number} retries - The number of retries remaining.
     * @param {Function} retryDelay - A function that returns the delay in milliseconds for each retry attempt.
     * @returns {Promise} A promise that resolves to the query result.
     * @description Executes the query function with retries and exponential backoff.
     */
    _fetchWithRetry(queryFnWithContext, retry, retryDelay) {
      let attempts = 0;
      const executeFetch = () => {
        return queryFnWithContext().catch((error) => {
          if (attempts < retry) {
            attempts++;
            const delay = typeof retryDelay === "function" ? retryDelay(attempts) : retryDelay;
            return new Promise((resolve) => setTimeout(resolve, delay)).then(executeFetch);
          }
          throw error;
        });
      };
      return executeFetch();
    }
    /**
     * @private
     * @method _isStale
     * @param {Object} cachedData - The cached data object.
     * @param {number} staleTime - The stale time in milliseconds.
     * @returns {boolean} True if the cached data is stale, false otherwise.
     * @description Checks if the cached data is stale based on the stale time.
     */
    _isStale(cachedData, staleTime) {
      const currentTime = Date.now();
      const timeSinceLastUpdate = currentTime - cachedData.timestamp;
      const isDataStale = !cachedData.timestamp || timeSinceLastUpdate > staleTime;
      const isManuallyInvalidated = cachedData.isStale === true;
      __trace(`_isStale`, `
      isDataStale: ${isDataStale}
      isManuallyInvalidated: ${isManuallyInvalidated}
      Current Time: ${currentTime}
      Data Timestamp: ${cachedData.timestamp}
      Time Since Last Update: ${timeSinceLastUpdate}ms
      Stale Time: ${staleTime}ms
    `);
      return isDataStale || isManuallyInvalidated;
    }
    /**
     * @method mutation
     * @memberof ObservableStore
     * @param {string} mutationName - The name of the mutation to register.
     * @param {Object} config - The configuration object for the mutation.
     * @param {Function} config.mutationFn - The function to perform the mutation.
     * @param {Function} [config.onMutate] - The function to be called before the mutation is performed.
     * @param {Function} [config.onError] - The function to be called if the mutation encounters an error.
     * @param {Function} [config.onSuccess] - The function to be called if the mutation is successful.
     * @param {Function} [config.onSettled] - The function to be called after the mutation has either succeeded or failed.
     * @param {Object} [config.actions=this.actions] - The actions available in the store.
     * @param {Object} [config.queries=this.queryFunctions] - The queries available in the store.
     * @description Registers a mutation with the given configuration. This method sets up the mutation with the provided options and handles the mutation lifecycle.
     * @example
     * ```javascript
     * appStore.defineMutation('deletePost', {
     *   mutationFn: (id) => fetch(`https://api.camijs.com/posts/${id}`, { method: 'DELETE' }).then(res => res.json()),
     *   onMutate: (context) => {
     *     context.actions.setPosts(context.state.posts.filter(post => post.id !== context.args[0]));
     *   },
     *   onError: (context) => {
     *     context.actions.setPosts(context.previousState.posts);
     *   },
     *   onSuccess: (context) => {
     *     console.log('Mutation successful:', context);
     *   },
     *   onSettled: (context) => {
     *     console.log('Mutation settled');
     *     context.invalidateQueries('posts');
     *   }
     * });
     *
     * appStore.mutate('deletePost', id);
     * ```
     */
    defineMutation(mutationName, config) {
      if (this.mutationFunctions.has(mutationName)) {
        throw new Error(`[Cami.js] Mutation with name ${mutationName} is already registered.`);
      }
      this.mutationFunctions.set(mutationName, config);
      this.mutations[mutationName] = (...args) => this.mutate(mutationName, ...args);
    }
    _executeMutation(mutationName, payload, mutation) {
      const { mutationFn, onMutate, onError, onSuccess, onSettled } = mutation;
      const previousState = _deepClone(this._state);
      const storeContext = {
        state: this._state,
        payload,
        dispatch: this.dispatch.bind(this),
        trigger: this.trigger.bind(this),
        memo: this.memo.bind(this),
        query: this.query.bind(this),
        mutate: this.mutate.bind(this),
        previousState,
        invalidateQueries: this.invalidateQueries.bind(this),
        dispatchAsync: this.dispatchAsync.bind(this)
      };
      let optimisticUpdate;
      if (onMutate) {
        optimisticUpdate = onMutate(storeContext);
      }
      let result;
      let error;
      return Promise.resolve(mutationFn(payload)).then((data) => {
        result = data;
        if (onSuccess) {
          onSuccess(__spreadProps(__spreadValues({}, storeContext), { data }));
        }
        return data;
      }).catch((err) => {
        error = err;
        if (onError) {
          onError(__spreadProps(__spreadValues({}, storeContext), { error: err }));
        }
        throw err;
      }).finally(() => {
        if (onSettled) {
          onSettled(__spreadProps(__spreadValues({}, storeContext), {
            data: result || error
          }));
        }
      });
    }
    /**
     * @method defineMachine
     * @param {string} machineName - The name of the machine
     * @param {Object} machineDefinition - The state machine definition
     * @description Defines or updates a state machine for the store
     */
    defineMachine(machineName, machineDefinition) {
      const validateMachine = (machine) => {
        if (typeof machine !== "object" || machine === null) {
          throw new Error("Machine definition must be an object");
        }
        Object.entries(machine).forEach(([eventName, event]) => {
          if (typeof event !== "object" || event === null) {
            throw new Error(`Event '${eventName}' must be an object`);
          }
          if (!event.to || typeof event.to !== "function" && typeof event.to !== "object") {
            throw new Error(`Event '${eventName}' must have a 'to' property that is an object or a function returning an object`);
          }
          if (event.guard && typeof event.guard !== "function") {
            throw new Error(`Guard for event '${eventName}' must be a function`);
          }
          if (event.onTransition && typeof event.onTransition !== "function") {
            throw new Error(`onTransition for event '${eventName}' must be a function`);
          }
          if (event.onEntry && typeof event.onEntry !== "function") {
            throw new Error(`onEntry for event '${eventName}' must be a function`);
          }
          if (event.onExit && typeof event.onExit !== "function") {
            throw new Error(`onExit for event '${eventName}' must be a function`);
          }
        });
      };
      validateMachine(machineDefinition);
      if (!this.machines[machineName]) {
        this.machines[machineName] = {};
      }
      this.machines[machineName] = __spreadValues(__spreadValues({}, this.machines[machineName]), machineDefinition);
      Object.keys(machineDefinition).forEach((eventName) => {
        const fullEventName = `${machineName}:${eventName}`;
        this.defineAction(fullEventName, ({ state, payload }) => {
          const event = this.machines[machineName][eventName];
          const currentState = __spreadValues({}, state);
          const storeContext = {
            state,
            payload,
            dispatch: this.dispatch.bind(this),
            query: this.query.bind(this),
            mutate: this.mutate.bind(this),
            trigger: this.trigger.bind(this),
            memo: this.memo.bind(this),
            dispatchAsync: this.dispatchAsync.bind(this)
          };
          if (this.isValidTransition(event.from, currentState)) {
            const applyTransition = (to) => {
              this.validateToShape(event.from, to);
              this.executeHandler(event.onExit, __spreadProps(__spreadValues({}, storeContext), { state: currentState }));
              Object.entries(to).forEach(([key, value]) => {
                state[key] = value;
              });
              this.executeHandler(event.onEntry, storeContext);
            };
            const newState = typeof event.to === "function" ? event.to({ state: currentState, payload }) : event.to;
            applyTransition(newState);
            this.executeHandler(event.onTransition, __spreadProps(__spreadValues({}, storeContext), {
              from: currentState,
              to: newState,
              data: event.data
            }));
          } else {
            const actual = {};
            if (Array.isArray(event.from) && event.from.length > 0 && typeof event.from[0] === "object") {
              Object.keys(event.from[0]).forEach((key) => {
                actual[key] = currentState[key];
              });
            }
            __trace(
              "cami:state-machine:ignored-transition",
              `Ignored transition '${fullEventName}' event. Actual: ${JSON.stringify(actual)}. Expected: Any of ${JSON.stringify(event.from)}`
            );
          }
        });
      });
    }
    /**
     * @method trigger
     * @param {string} fullEventName - The full name of the event to trigger (machineName/eventName)
     * @param {*} payload - The payload for the event
     * @returns {Promise} A promise that resolves when the event is processed
     * @description Triggers a state machine event
     */
    trigger(fullEventName, payload) {
      const [machineName, eventName] = fullEventName.split(":");
      if (!this.machines[machineName] || !this.machines[machineName][eventName]) {
        throw new Error(`Event '${fullEventName}' not found in any state machine.`);
      }
      return this.dispatch(fullEventName, payload);
    }
    /**
     * @method memo
     * @param {string} memoName - The name of the memo to compute
     * @param {*} [payload] - Optional payload for the memo
     * @returns {*} The computed value of the memo
     * @description Computes and returns the value of a memoized property
     */
    memo(memoName, payload) {
      const memoFn = this.memos[memoName];
      if (!memoFn) {
        throw new Error(`Memo '${memoName}' not found.`);
      }
      let cache = this.memoCache.get(memoName);
      if (!cache) {
        cache = /* @__PURE__ */ new Map();
        this.memoCache.set(memoName, cache);
      }
      const cacheKey = JSON.stringify(payload);
      if (cache.has(cacheKey)) {
        const { result: result2, dependencies: dependencies2 } = cache.get(cacheKey);
        if (this._areDependenciesUnchanged(dependencies2)) {
          return result2;
        }
      }
      const dependencies = /* @__PURE__ */ new Set();
      const trackingProxy = new Proxy(this._state, {
        get: (target, prop) => {
          dependencies.add(prop);
          return target[prop];
        }
      });
      const storeContext = {
        state: trackingProxy,
        payload,
        dispatch: this.dispatch.bind(this),
        trigger: this.trigger.bind(this),
        memo: this.memo.bind(this),
        query: this.query.bind(this),
        mutate: this.mutate.bind(this),
        dispatchAsync: this.dispatchAsync.bind(this)
      };
      const result = memoFn(storeContext);
      cache.set(cacheKey, { result, dependencies });
      return result;
    }
    _areDependenciesUnchanged(dependencies) {
      return Array.from(dependencies).every(
        (dep) => this._state[dep] === this.previousState[dep]
      );
    }
    // Helper methods for the state machine
    isValidTransition(from, currentState) {
      if (from === void 0) {
        return true;
      }
      const checkState = (fromState, currentStateSlice) => {
        if (typeof fromState !== "object" || fromState === null) {
          return fromState === currentStateSlice;
        }
        return Object.entries(fromState).every(([key, value]) => {
          if (!(key in currentStateSlice)) {
            return false;
          }
          if (Array.isArray(value)) {
            return value.includes(currentStateSlice[key]);
          }
          if (typeof value === "object" && value !== null) {
            return checkState(value, currentStateSlice[key]);
          }
          return currentStateSlice[key] === value;
        });
      };
      if (Array.isArray(from)) {
        return from.some((state) => checkState(state, currentState));
      }
      return checkState(from, currentState);
    }
    validateToShape(from, to) {
      if (from === void 0) {
        return;
      }
      const getShapeDescription = (obj) => {
        if (typeof obj !== "object" || obj === null) {
          return typeof obj;
        }
        return Object.entries(obj).reduce((acc, [key, value]) => {
          if (typeof value === "object" && value !== null) {
            acc[key] = getShapeDescription(value);
          } else if (Array.isArray(value)) {
            acc[key] = `Array<${typeof value[0]}>`;
          } else {
            acc[key] = typeof value;
          }
          return acc;
        }, {});
      };
      const findMismatchedKeys = (expected, actual, prefix = "") => {
        const mismatched = [];
        Object.keys(expected).forEach((key) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (!(key in actual)) {
            mismatched.push(`${fullKey} (missing)`);
          } else if (typeof expected[key] !== typeof actual[key]) {
            mismatched.push(`${fullKey} (expected ${typeof expected[key]}, got ${typeof actual[key]})`);
          } else if (typeof expected[key] === "object" && expected[key] !== null) {
            mismatched.push(...findMismatchedKeys(expected[key], actual[key], fullKey));
          }
        });
        return mismatched;
      };
      const fromShape = Array.isArray(from) ? from[0] : from;
      if (typeof to !== "object" || to === null) {
        const expectedShape = getShapeDescription(fromShape);
        throw new Error(`Invalid 'to' state: must be an object.

Expected key-value pairs:
${JSON.stringify(expectedShape, null, 2)}`);
      }
      const mismatchedKeys = findMismatchedKeys(fromShape, to);
      if (mismatchedKeys.length > 0) {
        const expectedShape = getShapeDescription(fromShape);
        throw new Error(`Invalid 'to' state shape.

Expected key-value pairs:
${JSON.stringify(expectedShape, null, 2)}

Mismatched keys: ${mismatchedKeys.join(", ")}`);
      }
    }
    executeHandler(handler, context) {
      if (typeof handler === "function") {
        handler(context);
      }
    }
    _validateState(state) {
      Object.entries(this.schema).forEach(([key, type]) => {
        try {
          validateType(state[key], type, [key], state);
        } catch (error) {
          throw new Error(`Validation error in ${this.name}: ${error.message}`);
        }
      });
    }
  };
  var deepFreeze = (value, deep = true) => {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(freeze(value, true), {
      set(target, prop, val) {
        throw new Error(`Attempted to modify frozen state. Cannot set property '${prop}' on immutable object.`);
      },
      deleteProperty(target, prop) {
        throw new Error(`Attempted to modify frozen state. Cannot delete property '${prop}' from immutable object.`);
      }
    });
  };
  var StorageInterface = {
    getItem: (key) => {
    },
    setItem: (key, value) => {
    },
    removeItem: (key) => {
    },
    clear: () => {
    }
  };
  var StorageValidator = class {
    /**
     * @method validateAdapter
     * @memberof StorageValidator
     * @param {Object} adapter - The storage adapter to validate.
     * @throws {Error} If the adapter is missing required methods or has invalid method signatures.
     */
    static validateAdapter(adapter) {
      const requiredMethods = Object.keys(StorageInterface);
      const missingMethods = requiredMethods.filter((method) => {
        return !(method in adapter) || typeof adapter[method] !== "function" || adapter[method].length !== StorageInterface[method].length;
      });
      if (missingMethods.length > 0) {
        throw new Error(`Invalid storage adapter: missing or invalid methods: ${missingMethods.join(", ")}`);
      }
    }
  };
  var MemoryStorage = class {
    constructor() {
      this.storage = /* @__PURE__ */ new Map();
      StorageValidator.validateAdapter(this);
    }
    /**
     * @method getItem
     * @memberof MemoryStorage
     * @param {string} key - The key of the item to retrieve.
     * @returns {string|null} The value associated with the key, or null if the key does not exist.
     */
    getItem(key) {
      return this.storage.get(key) || null;
    }
    /**
     * @method setItem
     * @memberof MemoryStorage
     * @param {string} key - The key of the item to set.
     * @param {string} value - The value to set.
     */
    setItem(key, value) {
      this.storage.set(key, value);
    }
    /**
     * @method removeItem
     * @memberof MemoryStorage
     * @param {string} key - The key of the item to remove.
     */
    removeItem(key) {
      this.storage.delete(key);
    }
    /**
     * @method clear
     * @memberof MemoryStorage
     * @description Clears all items from the storage.
     */
    clear() {
      this.storage.clear();
    }
  };
  var LocalStorageAdapter = class {
    constructor() {
      StorageValidator.validateAdapter(this);
    }
    /**
     * @method getItem
     * @memberof LocalStorageAdapter
     * @param {string} key - The key of the item to retrieve.
     * @returns {string|null} The value associated with the key, or null if the key does not exist.
     */
    getItem(key) {
      return localStorage.getItem(key);
    }
    /**
     * @method setItem
     * @memberof LocalStorageAdapter
     * @param {string} key - The key of the item to set.
     * @param {string} value - The value to set.
     */
    setItem(key, value) {
      localStorage.setItem(key, value);
    }
    /**
     * @method removeItem
     * @memberof LocalStorageAdapter
     * @param {string} key - The key of the item to remove.
     */
    removeItem(key) {
      localStorage.removeItem(key);
    }
    /**
     * @method clear
     * @memberof LocalStorageAdapter
     * @description Clears all items from the storage.
     */
    clear() {
      localStorage.clear();
    }
  };
  var isValidValidationRules = (rules) => {
    if (!rules || typeof rules !== "object")
      return false;
    const hasPresence = "presence" in rules;
    const hasServer = "server" in rules;
    if (!hasPresence && !hasServer)
      return false;
    if (hasPresence) {
      if (typeof rules.presence !== "object")
        return false;
      if ("keys" in rules.presence && !Array.isArray(rules.presence.keys))
        return false;
      if ("values" in rules.presence) {
        if (!Array.isArray(rules.presence.values))
          return false;
        if (!rules.presence.values.every((v) => typeof v === "object"))
          return false;
      }
    }
    if (hasServer) {
      if (typeof rules.server !== "object")
        return false;
      if (typeof rules.server.fetchFn !== "function")
        return false;
    }
    return true;
  };
  var validateState = (storedState, validationRules, context) => {
    const { type, name } = context;
    if (!validationRules || !validationRules.presence) {
      __trace(`cami:${type}`, `No validation rules specified for ${type} ${name}. Using initial state.`);
      return false;
    }
    const { keys, values } = validationRules.presence;
    if (keys) {
      for (const key of keys) {
        if (!(key in storedState)) {
          __trace(`cami:${type}`, `${type.charAt(0).toUpperCase() + type.slice(1)} Invalidated: Key '${key}' is missing in stored state for ${type} ${name}.`);
          return false;
        }
      }
    }
    if (values) {
      for (const valueObj of values) {
        for (const [key, value] of Object.entries(valueObj)) {
          if (storedState[key] !== value) {
            __trace(`cami:${type}`, `${type.charAt(0).toUpperCase() + type.slice(1)} Invalidated: Value mismatch for key '${key}' in ${type} ${name}. Expected ${value}, got ${storedState[key]}.`);
            return false;
          }
        }
      }
    }
    __trace(`cami:${type}`, `No validation rules violated for ${type} ${name}.`);
    return true;
  };
  var _storageEnhancer = (StoreClass) => {
    return (initialState, options) => {
      const storeName = (options == null ? void 0 : options.name) || "default-store";
      const shouldLoad = (options == null ? void 0 : options.load) !== false;
      const defaultExpiry = 24 * 60 * 60 * 1e3;
      const expiry = (options == null ? void 0 : options.expiry) !== void 0 ? options.expiry : defaultExpiry;
      const storage = options.storageAdapter;
      const adapterType = options.adapterType;
      const compareObjects = (obj1, obj2) => {
        console.assert(obj1 !== null && obj2 !== null, "Both objects must be non-null");
        console.assert(typeof obj1 === "object" && typeof obj2 === "object", "Both arguments must be objects");
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        console.assert(Array.isArray(keys1) && Array.isArray(keys2), "Object.keys should always return arrays");
        if (keys1.length !== keys2.length) {
          return false;
        }
        for (let key of keys1) {
          console.assert(typeof key === "string", "Object keys should always be strings");
          if (!(key in obj2)) {
            return false;
          }
          if (typeof obj1[key] === "object" && obj1[key] !== null) {
            if (typeof obj2[key] !== "object" || obj2[key] === null) {
              return false;
            }
            if (!compareObjects(obj1[key], obj2[key])) {
              return false;
            }
          }
        }
        return true;
      };
      const loadState = () => {
        if (shouldLoad) {
          const storedState = storage.getItem(storeName);
          const storedExpiry = storage.getItem(`${storeName}-expiry`);
          const currentTime = /* @__PURE__ */ new Date();
          __trace("cami:storage", `Identified ${adapterType} storage: ${storeName}.`);
          if (storedState && storedExpiry) {
            const isExpired = currentTime.getTime() >= parseInt(storedExpiry, 10);
            __trace("cami:storage", `Checked expiry status for ${adapterType} storage: ${isExpired ? "Has Expired" : "Still Valid"}`);
            if (!isExpired) {
              const loadedState = JSON.parse(storedState);
              if (!compareObjects(initialState, loadedState)) {
                __trace("cami:storage", `Stored state structure doesn't match initial state for ${storeName}. Resetting to initial state.`);
                storage.setItem(storeName, JSON.stringify(initialState));
                storage.setItem(`${storeName}-expiry`, (currentTime.getTime() + expiry).toString());
                return initialState;
              }
              if (options.validationRules) {
                if (!isValidValidationRules(options.validationRules)) {
                  throw new Error(`Invalid validation rules structure for store ${storeName}.`);
                }
                if (!validateState(loadedState, options.validationRules, { type: "store", name: storeName })) {
                  __trace("cami:storage", `Stored state failed validation for ${storeName}. Using initial state.`);
                  return initialState;
                }
                if (options.validationRules && options.validationRules.server) {
                  const { fetchFn, onFetch, onSuccess, onError, onSettled } = options.validationRules.server;
                  if (onFetch)
                    onFetch();
                  __trace("cami:store", `Performing server-side validation for store ${storeName}.`);
                  fetchFn().then((data) => {
                    if (onSuccess)
                      onSuccess(data);
                    let shouldInvalidate = false;
                    if (onSettled) {
                      onSettled({
                        data,
                        // Changed from 'response' to 'data'
                        state: loadedState,
                        invalidate: () => {
                          shouldInvalidate = true;
                        }
                      });
                    }
                    if (shouldInvalidate) {
                      __trace("cami:store", `Server-side validation invalidated stored state for store ${storeName}. Using initial state.`);
                      return initialState;
                    }
                  }).catch((error) => {
                    if (onError)
                      onError(error);
                    __trace("cami:store", `Server-side validation failed for store ${storeName}. Using initial state.`, error);
                    return initialState;
                  });
                }
              } else {
                __trace("cami:storage", `No validation rules defined for ${storeName}. Using stored state.`);
              }
              __trace("cami:storage", `Loaded state from ${adapterType} storage`);
              return loadedState;
            }
          }
        }
        __trace("cami:storage", `Using initial state for ${adapterType} storage:`, initialState);
        return initialState;
      };
      const initialLoadedState = loadState();
      const store2 = new StoreClass(initialLoadedState);
      store2.name = storeName;
      store2.storage = storage;
      store2.expiry = expiry;
      store2._persistState = () => {
        const currentTime = /* @__PURE__ */ new Date();
        const expiryTime = new Date(currentTime.getTime() + expiry);
        storage.setItem(storeName, JSON.stringify(store2.state));
        storage.setItem(`${storeName}-expiry`, expiryTime.getTime().toString());
      };
      store2.reset = () => {
        storage.removeItem(storeName);
        storage.removeItem(`${storeName}-expiry`);
        store2.state = store2._createProxy(createDraft(initialState));
        __trace("cami:storage", `Reset store state of ${storeName} in ${adapterType} storage to:`, store2.state);
        store2.__observers.forEach((observer) => observer.next(store2.state));
        store2._persistState();
      };
      store2.subscribe((state) => {
        store2._persistState();
      });
      return store2;
    };
  };
  var storeInstances = /* @__PURE__ */ new Map();
  var ADAPTERS = {
    memory: MemoryStorage,
    localStorage: LocalStorageAdapter
  };
  var store = (config = {}) => {
    const defaultConfig = {
      state: {},
      adapter: "localStorage",
      name: "cami-store",
      expiry: 864e5,
      // 24 hours
      validationRules: null
    };
    const finalConfig = __spreadValues(__spreadValues({}, defaultConfig), config);
    if (storeInstances.has(finalConfig.name)) {
      return storeInstances.get(finalConfig.name);
    }
    const AdapterClass = ADAPTERS[finalConfig.adapter];
    if (!AdapterClass) {
      throw new Error(`Invalid adapter: ${finalConfig.adapter}. Available adapters are: ${Object.keys(ADAPTERS).join(", ")}`);
    }
    if (finalConfig.validationRules && !isValidValidationRules(finalConfig.validationRules)) {
      throw new Error(`Invalid validation rules structure for store ${finalConfig.name}.`);
    }
    const storageAdapter = new AdapterClass();
    const storeInstance = _storageEnhancer(ObservableStore)(finalConfig.state, __spreadProps(__spreadValues({}, finalConfig), {
      storageAdapter,
      adapterType: finalConfig.adapter
    }));
    const methods = ["memo", "query", "trigger", "dispatch", "mutate"];
    methods.forEach((method) => {
      if (typeof storeInstance[method] !== "function") {
        console.warn(`Method ${method} is not available on the store instance.`);
      }
    });
    storeInstances.set(finalConfig.name, storeInstance);
    return storeInstance;
  };

  // src/observables/observable-proxy.js
  var ObservableProxy = class {
    constructor(observable) {
      if (!(observable instanceof ObservableState)) {
        throw new TypeError("Expected observable to be an instance of ObservableState");
      }
      return new Proxy(observable, {
        get: (target, property) => {
          if (typeof target[property] === "function") {
            return target[property].bind(target);
          } else if (property in target) {
            return _deepClone(target[property]);
          } else if (typeof target.value[property] === "function") {
            return (...args) => target.value[property](...args);
          } else {
            return _deepClone(target.value[property]);
          }
        },
        set: (target, property, value) => {
          target[property] = value;
          target.update(() => target.value);
          return true;
        }
      });
    }
  };

  // src/reactive-element.js
  var ReactiveElement = class extends HTMLElement {
    /**
     * @constructor
     * @description Constructs a new instance of ReactiveElement.
     */
    constructor() {
      super();
      this.onCreate();
      this.__unsubscribers = /* @__PURE__ */ new Map();
      this.effect = effect.bind(this);
      this.derive = this.__derive.bind(this);
    }
    /**
     * @method
     * @description Creates ObservableProperty or ObservableProxy instances for all properties in the provided object.
     * @param {Object} attributes - An object with attribute names as keys and optional parsing functions as values.
     * @example
     * // In _009_dataFromProps.html, the todos attribute is parsed as JSON and the data property is extracted:
     * this.observableAttributes({
     *   todos: (v) => JSON.parse(v).data
     * });
     * @returns {void}
     */
    observableAttributes(attributes) {
      Object.entries(attributes).forEach(([attrName, parseFn]) => {
        let attrValue = this.getAttribute(attrName);
        const transformFn = typeof parseFn === "function" ? parseFn : (v) => v;
        attrValue = produce(attrValue, transformFn);
        const observable = this.__observable(attrValue, attrName);
        if (this.__isObjectOrArray(observable.value)) {
          this.__createObservablePropertyForObjOrArr(this, attrName, observable, true);
        } else {
          this.__createObservablePropertyForPrimitive(this, attrName, observable, true);
        }
      });
    }
    /**
     * @method
     * @description Creates an effect and registers its dispose function. The effect is used to perform side effects in response to state changes.
     * This method is useful when working with ObservableProperties or ObservableProxies because it triggers the effect whenever the value of the underlying ObservableState changes.
     * @example
     * // Assuming `this.count` is an ObservableProperty
     * this.effect(() => {
     *   console.log(`The count is now: ${this.count}`);
     * });
     * // The console will log the current count whenever `this.count` changes
     *
     * @param {Function} effectFn - The function to create the effect
     * @returns {void}
     */
    effect(effectFn) {
      const dispose = super.effect(effectFn);
      this.__unsubscribers.set(effectFn, dispose);
    }
    /**
     * @method
     * @description Creates a derived value that updates when its dependencies change.
     * @param {Function} deriveFn - The function to compute the derived value
     * @returns {any} The derived value
     * @example
     * // Assuming `this.count` is an ObservableProperty
     * this.doubleCount = this.derive(() => this.count * 2);
     * console.log(this.doubleCount); // If this.count is 5, this will log 10
     */
    __derive(deriveFn) {
      const { value, dispose } = derive(deriveFn);
      this.__unsubscribers.set(deriveFn, dispose);
      return value;
    }
    /**
     * @method
     * @description Called when the component is created. Can be overridden by subclasses to add initialization logic.
     * This method is a hook for the connectedCallback, which is invoked each time the custom element is appended into a document-connected element.
     * @returns {void}
     */
    onCreate() {
    }
    /**
     * @method
     * @description Invoked when the custom element is appended into a document-connected element. Sets up initial state and triggers initial rendering.
     * This is typically used to initialize component state, fetch data, and set up event listeners.
     *
     * @example
     * // In a TodoList component
     * connectedCallback() {
     *   super.connectedCallback();
     *   this.fetchTodos(); // Fetch todos when the component is added to the DOM
     * }
     * @returns {void}
     */
    connectedCallback() {
      this.__setup({ infer: true });
      this.effect(() => this.render());
      this.render();
      this.onConnect();
    }
    /**
     * @method
     * @description Invoked when the custom element is connected to the document's DOM.
     * @returns {void}
     * Subclasses can override this to add initialization logic when the component is added to the DOM.
     *
     * @example
     * // In a UserCard component
     * onConnect() {
     *   this.showUserDetails(); // Display user details when the component is connected
     * }
     */
    onConnect() {
    }
    /**
     * @method
     * @description Invoked when the custom element is disconnected from the document's DOM.
     * This is a good place to remove event listeners, cancel any ongoing network requests, or clean up any resources.
     * @returns {void}
     * @example
     * // In a Modal component
     * disconnectedCallback() {
     *   super.disconnectedCallback();
     *   this.close(); // Close the modal when it's disconnected from the DOM
     * }
     * @returns {void}
     */
    disconnectedCallback() {
      this.onDisconnect();
      this.__unsubscribers.forEach((unsubscribe) => unsubscribe());
    }
    /**
     * @method
     * @description Invoked when the custom element is disconnected from the document's DOM.
     * Subclasses can override this to add cleanup logic when the component is removed from the DOM.
     * @returns {void}
     *
     * @example
     * // In a VideoPlayer component
     * onDisconnect() {
     *   this.stopPlayback(); // Stop video playback when the component is removed
     * }
     **/
    onDisconnect() {
    }
    /**
     * @method
     * @description Invoked when an attribute of the custom element is added, removed, updated, or replaced.
     * This can be used to react to attribute changes, such as updating the component state or modifying its appearance.
     *
     * @example
     * // In a ThemeSwitcher component
     * attributeChangedCallback(name, oldValue, newValue) {
     *   super.attributeChangedCallback(name, oldValue, newValue);
     *   if (name === 'theme') {
     *     this.updateTheme(newValue); // Update the theme when the `theme` attribute changes
     *   }
     * }
     * @param {string} name - The name of the attribute that changed
     * @param {string} oldValue - The old value of the attribute
     * @param {string} newValue - The new value of the attribute
     * @returns {void}
     */
    attributeChangedCallback(name, oldValue, newValue) {
      this.onAttributeChange(name, oldValue, newValue);
    }
    /**
     * @method
     * @description Invoked when an attribute of the custom element is added, removed, updated, or replaced.
     * @returns {void}
     * Subclasses can override this to add logic that should run when an attribute changes.
     *
     * @example
     * // In a CollapsiblePanel component
     * onAttributeChange(name, oldValue, newValue) {
     *   if (name === 'collapsed') {
     *     this.toggleCollapse(newValue === 'true'); // Toggle collapse when the `collapsed` attribute changes
     *   }
     * }
     **/
    onAttributeChange(name, oldValue, newValue) {
    }
    /**
     * @method
     * @description Invoked when the custom element is moved to a new document.
     * This can be used to update bindings or perform re-initialization as needed when the component is adopted into a new DOM context.
     * @returns {void}
     * @example
     * // In a DragDropContainer component
     * adoptedCallback() {
     *   super.adoptedCallback();
     *   this.updateDragDropContext(); // Update context when the component is moved to a new document
     * }
     * @returns {void}
     */
    adoptedCallback() {
      this.onAdopt();
    }
    /**
     * @method
     * @description Invoked when the custom element is moved to a new document.
     * Subclasses can override this to add logic that should run when the component is moved to a new document.
     * @returns {void}
     * @example
     * // In a DataGrid component
     * onAdopt() {
     *   this.refreshData(); // Refresh data when the component is adopted into a new document
     * }
     **/
    onAdopt() {
    }
    /**
     * @private
     * @method
     * @description Checks if the provided value is an object or an array.
     * @param {any} value - The value to check.
     * @returns {boolean} True if the value is an object or an array, false otherwise.
     */
    __isObjectOrArray(value) {
      return value !== null && (typeof value === "object" || Array.isArray(value));
    }
    /**
     * @private
     * @method
     * @description Private method. Creates an ObservableProperty for the provided key in the given context when the provided value is an object or an array.
     * @param {Object} context - The context in which the property is defined.
     * @param {string} key - The property key.
     * @param {ObservableState} observable - The observable to bind to the property.
     * @param {boolean} [isAttribute=false] - Whether the property is an attribute.
     * @throws {TypeError} If observable is not an instance of ObservableState.
     * @returns {void}
     */
    __createObservablePropertyForObjOrArr(context, key, observable, isAttribute = false) {
      if (!(observable instanceof ObservableState)) {
        throw new TypeError("Expected observable to be an instance of ObservableState");
      }
      const proxy = this.__observableProxy(observable);
      Object.defineProperty(context, key, {
        get: () => proxy,
        set: (newValue) => {
          observable.update(() => newValue);
          if (isAttribute) {
            this.setAttribute(key, newValue);
          }
        }
      });
    }
    /**
     * @private
     * @method
     * @description Private method. Handles the case when the provided value is not an object or an array.
     * This method creates an ObservableProperty for the provided key in the given context.
     * An ObservableProperty is a special type of property that can notify about changes in its state.
     * This is achieved by defining a getter and a setter for the property using Object.defineProperty.
     * The getter simply returns the current value of the observable.
     * The setter updates the observable with the new value and, if the property is an attribute, also updates the attribute.
     * @param {Object} context - The context in which the property is defined.
     * @param {string} key - The property key.
     * @param {ObservableState} observable - The observable to bind to the property.
     * @param {boolean} [isAttribute=false] - Whether the property is an attribute.
     * @throws {TypeError} If observable is not an instance of ObservableState.
     * @returns {void}
     */
    __createObservablePropertyForPrimitive(context, key, observable, isAttribute = false) {
      if (!(observable instanceof ObservableState)) {
        throw new TypeError("Expected observable to be an instance of ObservableState");
      }
      Object.defineProperty(context, key, {
        get: () => observable.value,
        set: (newValue) => {
          observable.update(() => newValue);
          if (isAttribute) {
            this.setAttribute(key, newValue);
          }
        }
      });
    }
    /**
     * @private
     * @method
     * @description Creates a proxy for the observable.
     * @param {ObservableState} observable - The observable for which a proxy is to be created.
     * @throws {TypeError} If observable is not an instance of ObservableState.
     * @returns {ObservableProxy} The created proxy.
     */
    __observableProxy(observable) {
      return new ObservableProxy(observable);
    }
    /**
     * @private
     * @method
     * @description Defines the observables, effects, and attributes for the element.
     * @param {Object} config - The configuration object.
     * @returns {void}
     */
    __setup(config) {
      if (config.infer === true) {
        Object.keys(this).forEach((key) => {
          if (typeof this[key] !== "function" && !key.startsWith("__")) {
            if (this[key] instanceof Observable) {
              return;
            } else {
              const observable = this.__observable(this[key], key);
              if (this.__isObjectOrArray(observable.value)) {
                this.__createObservablePropertyForObjOrArr(this, key, observable);
              } else {
                this.__createObservablePropertyForPrimitive(this, key, observable);
              }
            }
          }
        });
      }
    }
    /**
     * @private
     * @method
     * @description Creates an observable with an initial value.
     * @param {any} initialValue - The initial value for the observable.
     * @param {string} [name] - The name of the observable.
     * @throws {Error} If the type of initialValue is not allowed in observables.
     * @returns {ObservableState} The created observable state.
     */
    __observable(initialValue, _name) {
      if (!this.__isAllowedType(initialValue)) {
        const type = Object.prototype.toString.call(initialValue);
        throw new Error(`[Cami.js] The value of type ${type} is not allowed in observables. Only primitive values, arrays, and plain objects are allowed.`);
      }
      const observable = new ObservableState(initialValue, null, { name: _name });
      this.__registerObservables(observable);
      return observable;
    }
    /**
     * @private
     * @method
     * @description Checks if the provided value is of an allowed type
     * @param {any} value - The value to check
     * @returns {boolean} True if the value is of an allowed type, false otherwise
     */
    __isAllowedType(value) {
      const allowedTypes = ["number", "string", "boolean", "object", "undefined"];
      const valueType = typeof value;
      if (valueType === "object") {
        return value === null || Array.isArray(value) || this.__isPlainObject(value);
      }
      return allowedTypes.includes(valueType);
    }
    /**
     * @private
     * @method
     * @description Checks if the provided value is a plain object
     * @param {any} value - The value to check
     * @returns {boolean} True if the value is a plain object, false otherwise
     */
    __isPlainObject(value) {
      if (Object.prototype.toString.call(value) !== "[object Object]") {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return prototype === null || prototype === Object.prototype;
    }
    /**
      * @private
      * @method
      * @description Registers an observable state to the list of unsubscribers
      * @param {ObservableState} observableState - The observable state to register
      * @returns {void}
      */
    __registerObservables(observableState) {
      if (!(observableState instanceof ObservableState)) {
        throw new TypeError("Expected observableState to be an instance of ObservableState");
      }
      this.__unsubscribers.set(observableState, () => {
        if (typeof observableState.dispose === "function") {
          observableState.dispose();
        }
      });
    }
    /**
     * @method
     * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
     * @returns {void}
     */
    render() {
      if (typeof this.template === "function") {
        const template = this.template();
        render(template, this);
      }
    }
  };

  // src/cami.js
  var { debug, events } = __config;
  return __toCommonJS(cami_exports);
})();
/**
 * @license
 * lit-html
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * cami.js
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */
//# sourceMappingURL=cami.cdn.js.map
