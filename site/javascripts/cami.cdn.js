var cami = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __knownSymbol = (name, symbol) => {
    return (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
  };
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
  var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);

  // src/cami.js
  var cami_exports = {};
  __export(cami_exports, {
    Observable: () => Observable,
    ObservableElement: () => ObservableElement,
    ObservableState: () => ObservableState,
    ObservableStore: () => ObservableStore,
    ObservableStream: () => ObservableStream,
    ReactiveElement: () => ReactiveElement,
    computed: () => computed,
    debug: () => debug,
    effect: () => effect,
    events: () => events,
    html: () => html,
    http: () => http,
    slice: () => slice,
    store: () => store,
    svg: () => svg
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
    if (!Array.isArray(tsa) || !tsa.hasOwnProperty("raw")) {
      let message = "invalid template strings array";
      throw new Error(message);
    }
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

  // src/produce.js
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
    "Cami Observables forbid circular references",
    "The first or second argument to `produce` must be a function",
    "The third argument to `produce` must be a function or undefined",
    "First argument to `createDraft` must be a plain object, an array, or an immerable object",
    "First argument to `finishDraft` must be a draft returned by `createDraft`",
    function(thing) {
      return `'current' expects a draft, got: ${thing}`;
    },
    "Object.defineProperty() cannot be used on a Cami Observable draft",
    "Object.setPrototypeOf() cannot be used on a Cami Observable draft",
    "Cami Observables only support deleting array indices",
    "Cami Observables only support setting array indices and the 'length' property",
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
      throw new Error(`[Cami.js] ${msg}`);
    }
    throw new Error(
      `[Cami.js] minified error nr: ${error}.`
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
      Object.entries(obj).forEach(([key, value]) => {
        iter(key, value, obj);
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
    if (!strict && isPlainObject(base)) {
      if (!getPrototypeOf(base)) {
        const obj = /* @__PURE__ */ Object.create(null);
        return Object.assign(obj, base);
      }
      return __spreadValues({}, base);
    }
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
  }
  function freeze(obj, deep = false) {
    if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
      return obj;
    if (getArchtype(obj) > 1) {
      obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
    }
    Object.freeze(obj);
    if (deep)
      each(obj, (_key, value) => freeze(value, true), true);
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
        (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path),
        true
        // See #590, don't recurse into non-enumerable of non drafted objects
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
      if (!parentState || !parentState.scope_.parent_)
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
  var immer = new Immer2();
  var produce = immer.produce;

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
      if (functionName === "cami:state:change") {
        console.groupCollapsed(`%c[${functionName}]`, "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;", `${messages[0]} changed`);
        console.log(`oldValue:`, messages[1]);
        console.log(`newValue:`, messages[2]);
      } else {
        console.groupCollapsed(`%c[${functionName}]`, "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;", ...messages);
      }
      console.trace();
      console.groupEnd();
    }
  }

  // src/observables/observable-store.js
  var ObservableStore = class extends Observable {
    constructor(initialState) {
      if (typeof initialState !== "object" || initialState === null) {
        throw new TypeError("[Cami.js] initialState must be an object");
      }
      super((subscriber) => {
        this.__subscriber = subscriber;
        return () => {
          this.__subscriber = null;
        };
      });
      this.state = new Proxy(initialState, {
        get: (target, property) => {
          return target[property];
        },
        set: (target, property, value) => {
          target[property] = value;
          this.__observers.forEach((observer) => observer.next(this.state));
          if (this.devTools) {
            this.devTools.send(property, this.state);
          }
          return true;
        }
      });
      this.reducers = {};
      this.middlewares = [];
      this.devTools = this.__connectToDevTools();
      this.dispatchQueue = [];
      this.isDispatching = false;
      this.queryCache = /* @__PURE__ */ new Map();
      this.queryFunctions = /* @__PURE__ */ new Map();
      this.queries = {};
      this.intervals = /* @__PURE__ */ new Map();
      this.focusHandlers = /* @__PURE__ */ new Map();
      this.reconnectHandlers = /* @__PURE__ */ new Map();
      this.gcTimeouts = /* @__PURE__ */ new Map();
      Object.keys(initialState).forEach((key) => {
        if (typeof initialState[key] === "function") {
          this.register(key, initialState[key]);
        } else {
          this.state[key] = initialState[key];
        }
      });
    }
    /**
     * @private
     * @method _applyMiddleware
     * @param {string} action - The action type
     * @param {...any} args - The arguments to pass to the action
     * @returns {void}
     * @description This method applies all registered middlewares to the given action and arguments.
     */
    __applyMiddleware(action, ...args) {
      const context = {
        state: this.state,
        action,
        payload: args
      };
      for (const middleware of this.middlewares) {
        middleware(context);
      }
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
        devTools.init(this.state);
        return devTools;
      }
      return null;
    }
    /**
     * @method use
     * @memberof ObservableStore
     * @param {Function} middleware - The middleware function to use
     * @description This method registers a middleware function to be used with the store. Useful if you like redux-style middleware.
     * @example
     * ```javascript
     * const loggerMiddleware = (context) => {
     *   console.log(`Action ${context.action} was dispatched with payload:`, context.payload);
     * };
     * CartStore.use(loggerMiddleware);
     * ```
     */
    use(middleware) {
      this.middlewares.push(middleware);
    }
    /**
     * @method getState
     * @memberof ObservableStore
     * @returns {Object} - The current state of the store.
     * @description Retrieves the current state of the store. This method is crucial in asynchronous operations or event-driven environments to ensure the most current state is accessed, as the state might change frequently due to user interactions or other asynchronous updates.
     */
    getState() {
      return this.state;
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
     * CartStore.register('add', (state, product) => {
     *   const cartItem = { ...product, cartItemId: Date.now() };
     *   state.cartItems.push(cartItem);
     * });
     *
     * CartStore.register('remove', (state, product) => {
     *   state.cartItems = state.cartItems.filter(item => item.cartItemId !== product.cartItemId);
     * });
     *
     * ```
     */
    register(action, reducer) {
      if (this.reducers[action]) {
        throw new Error(`[Cami.js] Action type ${action} is already registered.`);
      }
      this.reducers[action] = reducer;
      this[action] = (...args) => {
        this.dispatch(action, ...args);
      };
    }
    /**
     * @method query
     * @memberof ObservableStore
     * @param {string} queryName - The name of the query.
     * @param {Object} config - The configuration object for the query, containing the following properties:
     * @param {string} config.queryKey - The unique key for the query.
     * @param {Function} config.queryFn - The asynchronous query function that returns a promise.
     * @param {number} [config.staleTime=0] - Optional. The time in milliseconds after which the query is considered stale. Defaults to 0.
     * @param {boolean} [config.refetchOnWindowFocus=true] - Optional. Whether to refetch the query when the window regains focus. Defaults to true.
     * @param {boolean} [config.refetchOnReconnect=true] - Optional. Whether to refetch the query when the network reconnects. Defaults to true.
     * @param {number|null} [config.refetchInterval=null] - Optional. The interval in milliseconds at which to refetch the query. Defaults to null.
     * @param {number} [config.gcTime=300000] - Optional. The time in milliseconds after which the query is garbage collected. Defaults to 300000 (5 minutes).
     * @param {number} [config.retry=3] - Optional. The number of times to retry the query on error. Defaults to 3.
     * @param {Function} [config.retryDelay=(attempt) => Math.pow(2, attempt) * 1000] - Optional. A function that returns the delay in milliseconds for each retry attempt. Defaults to a function that calculates an exponential backoff based on the attempt number.
     * @description Registers an asynchronous query with the specified configuration.
     * @example
     * ```javascript
     * // Register a query to fetch posts
     * appStore.query('posts/fetchAll', {
     *   queryKey: 'posts/fetchAll',
     *   queryFn: () => fetch('https://api.camijs.com/posts').then(res => res.json()),
     *   refetchOnWindowFocus: true,
     * });
     *
     * // Register actions for pending, success, and error states of the query
     * appStore.register('posts/fetchAll/pending', (state, payload) => {
     *   state.isLoading = true;
     *   state.posts = [];
     *   state.error = null;
     * });
     *
     * appStore.register('posts/fetchAll/success', (state, payload) => {
     *   state.posts = payload;
     *   state.isLoading = false;
     *   state.error = null;
     * });
     *
     * appStore.register('posts/fetchAll/error', (state, payload) => {
     *   state.error = payload;
     *   state.isLoading = false;
     *   state.posts = [];
     * });
     *
     * // Fetch all posts
     * appStore.fetch('posts/fetchAll');
     *
     * // Subscribe to updates
     * appStore.subscribe(newState => {
     *   console.log('New state:', newState);
     * });
     * ```
     */
    query(queryName2, config) {
      const {
        queryKey,
        queryFn,
        staleTime = 0,
        refetchOnWindowFocus = true,
        refetchInterval = null,
        refetchOnReconnect = true,
        gcTime = 1e3 * 60 * 5,
        retry = 3,
        retryDelay = (attempt) => Math.pow(2, attempt) * 1e3
      } = config;
      this.queries[queryName2] = {
        queryKey,
        queryFn,
        staleTime,
        refetchOnWindowFocus,
        refetchInterval,
        refetchOnReconnect,
        gcTime,
        retry,
        retryDelay
      };
      this.queryFunctions.set(queryKey, queryFn);
      __trace(`query`, `Starting query with key: ${queryName2}`);
      if (refetchInterval !== null) {
        const intervalId = setInterval(() => {
          __trace(`query`, `Interval expired, refetching query: ${queryName2}`);
          this.fetch(queryName2).catch((error) => console.error(`Error refetching query ${queryName2}:`, error));
        }, refetchInterval);
        this.intervals[queryName2] = intervalId;
      }
      if (refetchOnWindowFocus) {
        const focusHandler = () => {
          __trace(`query`, `Window focus detected, refetching query: ${queryName2}`);
          this.fetch(queryName2).catch((error) => console.error(`Error refetching query ${queryName2} on window focus:`, error));
        };
        window.addEventListener("focus", focusHandler);
        this.focusHandlers[queryName2] = focusHandler;
      }
      if (refetchOnReconnect) {
        const reconnectHandler = () => {
          __trace(`query`, `Reconnect detected, refetching query: ${queryName2}`);
          this.fetch(queryName2).catch((error) => console.error(`Error refetching query ${queryName2} on reconnect:`, error));
        };
        window.addEventListener("online", reconnectHandler);
        this.reconnectHandlers[queryName2] = reconnectHandler;
      }
      const gcTimeout = setTimeout(() => {
        __trace(`query`, `Garbage collection timeout expired, refetching query: ${queryName2}`);
        this.fetch(queryName2).catch((error) => console.error(`Error refetching query ${queryName2} on gc timeout:`, error));
      }, gcTime);
      this.gcTimeouts[queryName2] = gcTimeout;
      this[queryName2] = (...args) => {
        return this.fetch(queryName2, ...args);
      };
    }
    /**
     * @method fetch
     * @memberof ObservableStore
     * @param {string} queryName - The name of the query to fetch data for.
     * @param {...any} args - Arguments to pass to the query function.
     * @returns {Promise<any>} A promise that resolves with the fetched data.
     * @description Fetches data for a given query name, utilizing cache if available and not stale.
     * If data is stale or not in cache, it fetches new data using the query function.
     * @example
     * ```javascript
     * // Register a query to fetch posts
     * appStore.query('posts/fetchAll', {
     *   queryKey: 'posts/fetchAll',
     *   queryFn: () => fetch('https://api.camijs.com/posts').then(res => res.json()),
     *   refetchOnWindowFocus: true,
     * });
     *
     * // Register actions for pending, success, and error states of the query
     * appStore.register('posts/fetchAll/pending', (state, payload) => {
     *   state.isLoading = true;
     *   state.posts = [];
     *   state.error = null;
     * });
     *
     * appStore.register('posts/fetchAll/success', (state, payload) => {
     *   state.posts = payload;
     *   state.isLoading = false;
     *   state.error = null;
     * });
     *
     * appStore.register('posts/fetchAll/error', (state, payload) => {
     *   state.error = payload;
     *   state.isLoading = false;
     *   state.posts = [];
     * });
     *
     * // Fetch all posts
     * appStore.fetch('posts/fetchAll');
     *
     * // Subscribe to updates
     * appStore.subscribe(newState => {
     *   console.log('New state:', newState);
     * });
     * ```
     */
    fetch(queryName2, ...args) {
      const query = this.queries[queryName2];
      if (!query) {
        throw new Error(`[Cami.js] No query found for name: ${queryName2}`);
      }
      const { queryKey, queryFn, staleTime, retry, retryDelay } = query;
      const cacheKey = Array.isArray(queryKey) ? queryKey.join(":") : queryKey;
      const cachedData = this.queryCache.get(cacheKey);
      if (cachedData && !this._isStale(cachedData, staleTime)) {
        __trace(`fetch`, `Returning cached data for: ${queryName2} with cacheKey: ${cacheKey}`);
        return Promise.resolve(cachedData.data);
      }
      __trace(`fetch`, `Data is stale or not cached, fetching new data for: ${queryName2}`);
      this.dispatch(`${queryName2}/pending`);
      return this._fetchWithRetry(queryFn, args, retry, retryDelay).then((data) => {
        this.queryCache.set(cacheKey, { data, timestamp: Date.now() });
        this.dispatch(`${queryName2}/success`, data);
        return data;
      }).catch((error) => {
        this.dispatch(`${queryName2}/error`, error);
        throw error;
      });
    }
    /**
     * @method invalidateQueries
     * @memberof ObservableStore
     * @param {string} queryName - The name of the query to invalidate.
     * @description Invalidates the cache and any associated intervals or event listeners for a given query name.
     */
    invalidateQueries(queryName2) {
      const query = this.queries[queryName2];
      if (!query)
        return;
      const cacheKey = Array.isArray(query.queryKey) ? query.queryKey.join(":") : query.queryKey;
      __trace(`invalidateQueries`, `Invalidating query with key: ${queryName2}`);
      if (this.intervals[queryName2]) {
        clearInterval(this.intervals[queryName2]);
        delete this.intervals[queryName2];
      }
      if (this.focusHandlers[queryName2]) {
        window.removeEventListener("focus", this.focusHandlers[queryName2]);
        delete this.focusHandlers[queryName2];
      }
      if (this.reconnectHandlers[queryName2]) {
        window.removeEventListener("online", this.reconnectHandlers[queryName2]);
        delete this.reconnectHandlers[queryName2];
      }
      if (this.gcTimeouts[queryName2]) {
        clearTimeout(this.gcTimeouts[queryName2]);
        delete this.gcTimeouts[queryName2];
      }
      this.queryCache.delete(cacheKey);
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
    _fetchWithRetry(queryFn, args, retries, retryDelay) {
      return queryFn(...args).catch((error) => {
        if (retries === 0) {
          throw error;
        }
        const delay = retryDelay(retries);
        return new Promise((resolve) => setTimeout(resolve, delay)).then(
          () => __trace(`fetchWithRetry`, `Retrying query with key: ${queryName}`),
          this._fetchWithRetry(queryFn, args, retries - 1, retryDelay)
        );
      });
    }
    /**
     * @private
     * @method isStale
     * @param {Object} cachedData - The cached data object.
     * @param {number} staleTime - The stale time in milliseconds.
     * @returns {boolean} True if the cached data is stale, false otherwise.
     * @description Checks if the cached data is stale based on the stale time.
     */
    _isStale(cachedData, staleTime) {
      const isDataStale = Date.now() - cachedData.timestamp > staleTime;
      __trace(`isStale`, `isDataStale: ${isDataStale} (Current Time: ${Date.now()}, Data Timestamp: ${cachedData.timestamp}, Stale Time: ${staleTime})`);
      return isDataStale;
    }
    /**
     * Dispatches an action or a function to the store, updating its state accordingly.
     * This method is central to the store's operation, allowing for state changes in response to actions.
     *
     * @method dispatch
     * @memberof ObservableStore
     * @param {string|Function} action - The action type as a string or a function that performs custom dispatch logic.
     * @param {Object} payload - The data to be passed along with the action.
     * @throws {Error} If the action type is not a string when expected.
     * @description Use this method to dispatch redux-style actions or flux actions, triggering state updates.
     * @example
     * ```javascript
     * // Dispatching an action with a payload
     * CartStore.dispatch('add', { id: 1, name: 'Product 1', quantity: 2 });
     * ```
     */
    dispatch(action, payload) {
      this.dispatchQueue.push({ action, payload });
      if (!this.isDispatching) {
        this._processDispatchQueue();
      }
    }
    /**
     * Processes the dispatch queue, executing each action in sequence.
     * This method ensures that actions are dispatched one at a time, in the order they were called.
     *
     * @private
     */
    _processDispatchQueue() {
      while (this.dispatchQueue.length > 0) {
        const { action, payload } = this.dispatchQueue.shift();
        this.isDispatching = true;
        this._dispatch(action, payload);
        this.isDispatching = false;
      }
    }
    /**
     * Performs the actual dispatch of an action, invoking the corresponding reducer and updating the state.
     * This method supports both string actions and function actions, allowing for flexible dispatch mechanisms.
     *
     * @private
     * @param {string|Function} action - The action to dispatch.
     * @param {Object} payload - The payload associated with the action.
     * @throws {Error} If the action type is not a string or a function.
     */
    _dispatch(action, payload) {
      if (typeof action === "function") {
        return action(this._dispatch.bind(this), () => this.state);
      }
      if (typeof action !== "string") {
        throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof action}`);
      }
      const reducer = this.reducers[action];
      if (!reducer) {
        console.warn(`No reducer found for action ${action}`);
        return;
      }
      this.__applyMiddleware(action, payload);
      const oldState = this.state;
      const newState = produce(this.state, (draft) => {
        reducer(draft, payload);
      });
      this.state = newState;
      this.__observers.forEach((observer) => observer.next(this.state));
      if (this.devTools) {
        this.devTools.send(action, this.state);
      }
      if (oldState !== newState) {
        if (__config.events.isEnabled && typeof window !== "undefined") {
          const event = new CustomEvent("cami:store:state:change", {
            detail: {
              action,
              oldValue: oldState,
              newValue: newState
            }
          });
          window.dispatchEvent(event);
        }
        __trace("cami:store:state:change", action, oldState, newState);
      }
    }
  };
  var slice = (store2, { name, state, actions }) => {
    if (store2.slices && store2.slices[name]) {
      throw new Error(`[Cami.js] Slice name ${name} is already in use.`);
    }
    if (!store2.slices) {
      store2.slices = {};
    }
    store2.slices[name] = true;
    store2.state[name] = state;
    const sliceActions = {};
    const sliceSubscribers = [];
    Object.keys(actions).forEach((actionKey) => {
      const namespacedAction = `${name}/${actionKey}`;
      store2.register(namespacedAction, (state2, payload) => {
        actions[actionKey](state2[name], payload);
      });
      sliceActions[actionKey] = (...args) => {
        store2.dispatch(namespacedAction, ...args);
      };
    });
    const subscribe = (callback) => {
      sliceSubscribers.push(callback);
      return () => {
        const index = sliceSubscribers.indexOf(callback);
        if (index > -1) {
          sliceSubscribers.splice(index, 1);
        }
      };
    };
    store2.subscribe((newState) => {
      const sliceState = newState[name];
      sliceSubscribers.forEach((callback) => callback(sliceState));
    });
    const getState = () => {
      return store2.getState()[name];
    };
    return { getState, actions: sliceActions, subscribe };
  };
  var _deepMerge = function(target, source) {
    if (typeof target !== "object" || target === null) {
      return source;
    }
    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = [...targetValue, ...sourceValue];
      } else if (typeof targetValue === "object" && targetValue !== null && typeof sourceValue === "object" && sourceValue !== null) {
        target[key] = _deepMerge(__spreadValues({}, targetValue), sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });
    Object.keys(target).forEach((key) => {
      if (!source.hasOwnProperty(key)) {
        target[key] = target[key];
      }
    });
    return target;
  };
  var _localStorageEnhancer = (StoreClass) => {
    return (initialState, options) => {
      const storeName = (options == null ? void 0 : options.name) || "default-store";
      const shouldLoad = (options == null ? void 0 : options.load) !== false;
      const defaultExpiry = 24 * 60 * 60 * 1e3;
      const expiry = (options == null ? void 0 : options.expiry) !== void 0 ? options.expiry : defaultExpiry;
      const store2 = new StoreClass(initialState);
      store2.init = () => {
        if (shouldLoad) {
          const storedState = localStorage.getItem(storeName);
          const storedExpiry = localStorage.getItem(`${storeName}-expiry`);
          const currentTime = (/* @__PURE__ */ new Date()).getTime();
          if (storedState && storedExpiry) {
            const isExpired = currentTime >= parseInt(storedExpiry, 10);
            if (!isExpired) {
              const loadedState = JSON.parse(storedState);
              store2.state = _deepMerge(initialState, loadedState);
            } else {
              localStorage.removeItem(storeName);
              localStorage.removeItem(`${storeName}-expiry`);
            }
          }
        }
      };
      store2.init();
      store2.reset = () => {
        localStorage.removeItem(storeName);
        localStorage.removeItem(`${storeName}-expiry`);
        store2.state = initialState;
        store2.__observers.forEach((observer) => observer.next(store2.state));
      };
      store2.subscribe((state) => {
        const currentTime = (/* @__PURE__ */ new Date()).getTime();
        const expiryTime = currentTime + expiry;
        localStorage.setItem(storeName, JSON.stringify(state));
        localStorage.setItem(`${storeName}-expiry`, expiryTime.toString());
      });
      return store2;
    };
  };
  var store = (initialState, options = {}) => {
    const defaultOptions = {
      localStorage: true,
      name: "cami-store",
      expiry: 864e5
      // 24 hours
    };
    const finalOptions = __spreadValues(__spreadValues({}, defaultOptions), options);
    if (finalOptions.localStorage) {
      const enhancedStore = _localStorageEnhancer(ObservableStore)(initialState, finalOptions);
      return enhancedStore;
    } else {
      return new ObservableStore(initialState);
    }
  };

  // src/observables/observable-stream.js
  var ObservableStream = class _ObservableStream extends Observable {
    /**
     * @method
     * @static
     * @param {any} value - The value to create an Observable from
     * @returns {ObservableStream} A new ObservableStream that emits the values from the value
     *
     * @example
     * // Example 1: Creating an ObservableStream from a user event stream
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const observableStream = ObservableStream.from(clickStream);
     */
    static from(value) {
      if (value instanceof Observable) {
        return new _ObservableStream((subscriber) => {
          const subscription2 = value.subscribe({
            next: (v) => subscriber.next(v),
            error: (err) => subscriber.error(err),
            complete: () => subscriber.complete()
          });
          return () => {
            if (!subscription2.closed) {
              subscription2.unsubscribe();
            }
          };
        });
      } else if (value[Symbol.asyncIterator]) {
        return new _ObservableStream((subscriber) => {
          let isCancelled = false;
          (() => __async(this, null, function* () {
            try {
              try {
                for (var iter = __forAwait(value), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
                  const v = temp.value;
                  if (isCancelled)
                    return;
                  subscriber.next(v);
                }
              } catch (temp) {
                error = [temp];
              } finally {
                try {
                  more && (temp = iter.return) && (yield temp.call(iter));
                } finally {
                  if (error)
                    throw error[0];
                }
              }
              subscriber.complete();
            } catch (err) {
              subscriber.error(err);
            }
          }))();
          return () => {
            isCancelled = true;
          };
        });
      } else if (value[Symbol.iterator]) {
        return new _ObservableStream((subscriber) => {
          try {
            for (const v of value) {
              subscriber.next(v);
            }
            subscriber.complete();
          } catch (err) {
            subscriber.error(err);
          }
          return () => {
            if (!subscription.closed) {
              subscription.unsubscribe();
            }
          };
        });
      } else if (value instanceof Promise) {
        return new _ObservableStream((subscriber) => {
          value.then(
            (v) => {
              subscriber.next(v);
              subscriber.complete();
            },
            (err) => subscriber.error(err)
          );
          return () => {
          };
        });
      } else {
        throw new TypeError("[Cami.js] ObservableStream.from requires an Observable, AsyncIterable, Iterable, or Promise");
      }
    }
    /**
     * @method
     * @param {Function} transformFn - The function to transform the data
     * @returns {ObservableStream} A new ObservableStream instance with transformed data
     *
     * @example
     * // Example 1: Transforming an API data stream
     * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
     * const observableStream = ObservableStream.from(apiDataStream);
     * const transformedStream = observableStream.map(data => data.map(item => item * 2));
     *
     * // Example 2: Transforming a user event stream
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const observableStream = ObservableStream.from(clickStream);
     * const transformedStream = observableStream.map(event => ({ x: event.clientX, y: event.clientY }));
     */
    map(transformFn) {
      return new _ObservableStream((subscriber) => {
        const subscription2 = this.subscribe({
          next: (value) => subscriber.next(transformFn(value)),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
        return () => subscription2.unsubscribe();
      });
    }
    /**
     * @method
     * @param {Function} predicateFn - The function to filter the data
     * @returns {ObservableStream} A new ObservableStream instance with filtered data
     *
     * @example
     * // Example 1: Filtering an API data stream
     * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
     * const observableStream = ObservableStream.from(apiDataStream);
     * const filteredStream = observableStream.filter(data => data.someProperty === 'someValue');
     *
     * // Example 2: Filtering a user event stream
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const observableStream = ObservableStream.from(clickStream);
     * const filteredStream = observableStream.filter(event => event.target.id === 'someId');
     */
    filter(predicateFn) {
      return new _ObservableStream((subscriber) => {
        const subscription2 = this.subscribe({
          next: (value) => {
            if (predicateFn(value)) {
              subscriber.next(value);
            }
          },
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
        return () => subscription2.unsubscribe();
      });
    }
    /**
     * @method
     * @param {Function} reducerFn - The function to reduce the data
     * @param {any} initialValue - The initial value for the reducer
     * @returns {Promise} A promise that resolves with the reduced value
     *
     * @example
     * // Example 1: Reducing an API data stream
     * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
     * const observableStream = ObservableStream.from(apiDataStream);
     * const reducedValuePromise = observableStream.reduce((acc, data) => acc + data.someProperty, 0);
     *
     * // Example 2: Reducing a user event stream
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const observableStream = ObservableStream.from(clickStream);
     * const reducedValuePromise = observableStream.reduce((acc, event) => acc + 1, 0);
     */
    reduce(reducerFn, initialValue) {
      return new Promise((resolve, reject) => {
        let accumulator = initialValue;
        const subscription2 = this.subscribe({
          next: (value) => {
            accumulator = reducerFn(accumulator, value);
          },
          error: (err) => reject(err),
          complete: () => resolve(accumulator)
        });
        return () => subscription2.unsubscribe();
      });
    }
    /**
     * @method
     * @param {Observable} notifier - The Observable that will complete this Observable
     * @returns {ObservableStream} A new ObservableStream that completes when the notifier emits
     *
     * @example
     * // Example 1: Completing an API data stream when another stream emits
     * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
     * const observableStream = ObservableStream.from(apiDataStream);
     * const notifierStream = new ObservableStream(subscriber => {
     *   setTimeout(() => subscriber.next(), 5000);
     * });
     * const completedStream = observableStream.takeUntil(notifierStream);
     *
     * // Example 2: Completing a user event stream when another stream emits
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const observableStream = ObservableStream.from(clickStream);
     * const notifierStream = new ObservableStream(subscriber => {
     *   setTimeout(() => subscriber.next(), 5000);
     * });
     * const completedStream = observableStream.takeUntil(notifierStream);
     */
    takeUntil(notifier) {
      return new _ObservableStream((subscriber) => {
        const sourceSubscription = this.subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
        const notifierSubscription = notifier.subscribe({
          next: () => {
            subscriber.complete();
            sourceSubscription.unsubscribe();
            notifierSubscription.unsubscribe();
          },
          error: (err) => subscriber.error(err)
        });
        return () => {
          sourceSubscription.unsubscribe();
          notifierSubscription.unsubscribe();
        };
      });
    }
    /**
     * @method
     * @param {number} n - The number of values to take
     * @returns {ObservableStream} A new ObservableStream that completes after emitting n values
     *
     * @example
     * // Example 1: Taking a certain number of values from an API data stream
     * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
     * const observableStream = ObservableStream.from(apiDataStream);
     * const takenStream = observableStream.take(5);
     *
     * // Example 2: Taking a certain number of values from a user event stream
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const observableStream = ObservableStream.from(clickStream);
     * const takenStream = observableStream.take(5);
     */
    take(n) {
      return new _ObservableStream((subscriber) => {
        let i = 0;
        const subscription2 = this.subscribe({
          next: (value) => {
            if (i++ < n) {
              subscriber.next(value);
            } else {
              subscriber.complete();
              subscription2.unsubscribe();
            }
          },
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
        return () => subscription2.unsubscribe();
      });
    }
    /**
     * @method
     * @param {number} n - The number of values to drop
     * @returns {ObservableStream} A new ObservableStream that starts emitting after n values have been emitted
     *
     * @example
     * // Example 1: Dropping a certain number of values from an API data stream
     * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
     * const observableStream = ObservableStream.from(apiDataStream);
     * const droppedStream = observableStream.drop(5);
     *
     * // Example 2: Dropping a certain number of values from a user event stream
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const observableStream = ObservableStream.from(clickStream);
     * const droppedStream = observableStream.drop(5);
     */
    drop(n) {
      return new _ObservableStream((subscriber) => {
        let i = 0;
        const subscription2 = this.subscribe({
          next: (value) => {
            if (i++ >= n) {
              subscriber.next(value);
            }
          },
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
        return () => subscription2.unsubscribe();
      });
    }
    /**
     * @method
     * @param {Function} transformFn - The function to transform the data into Observables
     * @returns {ObservableStream} A new ObservableStream that emits the values from the inner Observables
     *
     * @example
     * // Example 1: Transforming an API data stream into inner Observables
     * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
     * const observableStream = ObservableStream.from(apiDataStream);
     * const flatMappedStream = observableStream.flatMap(data => ObservableStream.from(fetch(`https://api.example.com/data/${data.id}`).then(response => response.json())));
     *
     * // Example 2: Transforming a user event stream into inner Observables
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const positionStream = clickStream.flatMap(event => ObservableStream.from({ x: event.clientX, y: event.clientY }));
     *
     * // Example 3: Transforming a stream of search terms into a stream of search results
     * const searchTerms = new ObservableStream(subscriber => {
     *   const input = document.querySelector('#search-input');
     *   input.addEventListener('input', event => subscriber.next(event.target.value));
     * });
     * const searchResults = searchTerms.debounce(300).flatMap(term => ObservableStream.from(fetch(`https://api.example.com/search?q=${term}`).then(response => response.json())));
     */
    flatMap(transformFn) {
      return new _ObservableStream((subscriber) => {
        const subscriptions = /* @__PURE__ */ new Set();
        const sourceSubscription = this.subscribe({
          next: (value) => {
            const innerObservable = transformFn(value);
            const innerSubscription = innerObservable.subscribe({
              next: (innerValue) => subscriber.next(innerValue),
              error: (err) => subscriber.error(err),
              complete: () => {
                subscriptions.delete(innerSubscription);
                if (subscriptions.size === 0) {
                  subscriber.complete();
                }
              }
            });
            subscriptions.add(innerSubscription);
          },
          error: (err) => subscriber.error(err),
          complete: () => {
            if (subscriptions.size === 0) {
              subscriber.complete();
            }
          }
        });
        return () => {
          sourceSubscription.unsubscribe();
          subscriptions.forEach((subscription2) => subscription2.unsubscribe());
        };
      });
    }
    /**
     * @method
     * @param {Function} transformFn - The function to transform the data into Observables
     * @returns {ObservableStream} A new ObservableStream that emits the values from the inner Observables
     * @example
     * // Example 1: Transforming click events into Observables
     * const clickStream = new ObservableStream();
     * document.addEventListener('click', (event) => clickStream.push(event));
     * const positionStream = clickStream.switchMap((event) => {
     *   return new ObservableStream((subscriber) => {
     *     subscriber.push({ x: event.clientX, y: event.clientY });
     *     subscriber.complete();
     *   });
     * });
     * positionStream.subscribe({
     *   next: (position) => console.log(`Clicked at position: ${position.x}, ${position.y}`),
     *   error: (err) => console.error(err),
     * });
     *
     * // Example 2: Transforming API responses into Observables
     * const apiStream = new ObservableStream();
     * fetch('https://api.example.com/data')
     *   .then((response) => response.json())
     *   .then((data) => apiStream.push(data))
     *   .catch((error) => apiStream.error(error));
     * const transformedStream = apiStream.switchMap((data) => {
     *   return new ObservableStream((subscriber) => {
     *     subscriber.push(transformData(data));
     *     subscriber.complete();
     *   });
     * });
     * transformedStream.subscribe({
     *   next: (transformedData) => console.log(transformedData),
     *   error: (err) => console.error(err),
     * });
     */
    switchMap(transformFn) {
      return new _ObservableStream((subscriber) => {
        let innerSubscription = null;
        const sourceSubscription = this.subscribe({
          next: (value) => {
            if (innerSubscription) {
              innerSubscription.unsubscribe();
            }
            const innerObservable = transformFn(value);
            innerSubscription = innerObservable.subscribe({
              next: (innerValue) => subscriber.next(innerValue),
              error: (err) => subscriber.error(err),
              complete: () => {
                if (innerSubscription) {
                  innerSubscription.unsubscribe();
                  innerSubscription = null;
                }
              }
            });
          },
          error: (err) => subscriber.error(err),
          complete: () => {
            if (innerSubscription) {
              innerSubscription.unsubscribe();
            }
            subscriber.complete();
          }
        });
        return () => {
          sourceSubscription.unsubscribe();
          if (innerSubscription) {
            innerSubscription.unsubscribe();
          }
        };
      });
    }
    /**
     * @method
     * @returns {Promise} A promise that resolves with an array of all values emitted by the Observable
     * @example
     * // Example: Collecting all emitted values from an ObservableStream
     * const numberStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   numberStream.push(i);
     * }
     * numberStream.end();
     * numberStream.toArray().then((values) => console.log(values)); // Logs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     */
    toArray() {
      return new Promise((resolve, reject) => {
        const values = [];
        this.subscribe({
          next: (value) => values.push(value),
          error: (err) => reject(err),
          complete: () => resolve(values)
        });
      });
    }
    /**
     * @method
     * @param {Function} callback - The function to call for each value emitted by the Observable
     * @returns {Promise} A promise that resolves when the Observable completes
     * @example
     * // Example: Logging each value emitted by an ObservableStream
     * const numberStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   numberStream.push(i);
     * }
     * numberStream.end();
     * numberStream.forEach((value) => console.log(value)); // Logs each number from 0 to 9
     */
    forEach(callback) {
      return new Promise((resolve, reject) => {
        this.subscribe({
          next: (value) => callback(value),
          error: (err) => reject(err),
          complete: () => resolve()
        });
      });
    }
    /**
     * @method
     * @param {Function} predicate - The function to test each value
     * @returns {Promise} A promise that resolves with a boolean indicating whether every value satisfies the predicate
     * @example
     * // Example: Checking if all emitted values are even
     * const numberStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   numberStream.push(i);
     * }
     * numberStream.end();
     * numberStream.every((value) => value % 2 === 0).then((allEven) => console.log(allEven)); // Logs: false
     */
    every(predicate) {
      return new Promise((resolve, reject) => {
        let every = true;
        this.subscribe({
          next: (value) => {
            if (!predicate(value)) {
              every = false;
              resolve(false);
            }
          },
          error: (err) => reject(err),
          complete: () => resolve(every)
        });
      });
    }
    /**
     * @method
     * @param {Function} predicate - The function to test each value
     * @returns {Promise} A promise that resolves with the first value that satisfies the predicate
     * @example
     * // Example: Finding the first emitted value that is greater than 5
     * const numberStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   numberStream.push(i);
     * }
     * numberStream.end();
     * numberStream.find((value) => value > 5).then((value) => console.log(value)); // Logs: 6
     */
    find(predicate) {
      return new Promise((resolve, reject) => {
        const subscription2 = this.subscribe({
          next: (value) => {
            if (predicate(value)) {
              resolve(value);
              subscription2.unsubscribe();
            }
          },
          error: (err) => reject(err),
          complete: () => resolve(void 0)
        });
      });
    }
    /**
     * @method
     * @param {Function} predicate - The function to test each value
     * @returns {Promise} A promise that resolves with a boolean indicating whether some value satisfies the predicate
     * @example
     * // Example: Checking if any emitted values are greater than 5
     * const numberStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   numberStream.push(i);
     * }
     * numberStream.end();
     * numberStream.some((value) => value > 5).then((anyGreaterThan5) => console.log(anyGreaterThan5)); // Logs: true
     */
    some(predicate) {
      return new Promise((resolve, reject) => {
        const subscription2 = this.subscribe({
          next: (value) => {
            if (predicate(value)) {
              resolve(true);
              subscription2.unsubscribe();
            }
          },
          error: (err) => reject(err),
          complete: () => resolve(false)
        });
      });
    }
    /**
     * @method
     * @param {Function} callback - The function to call when the Observable completes
     * @returns {ObservableStream} A new ObservableStream that calls the callback when it completes
     * @example
     * // Example: Logging a message when the ObservableStream completes
     * const numberStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   numberStream.push(i);
     * }
     * numberStream.end();
     * const finalStream = numberStream.finally(() => console.log('Stream completed'));
     * finalStream.subscribe({
     *   next: (value) => console.log(value),
     *   error: (err) => console.error(err),
     * }); // Logs each number from 0 to 9, then logs 'Stream completed'
     */
    finally(callback) {
      return new _ObservableStream((subscriber) => {
        const subscription2 = this.subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => {
            callback();
            subscriber.error(err);
          },
          complete: () => {
            callback();
            subscriber.complete();
          }
        });
        return () => {
          subscription2.unsubscribe();
        };
      });
    }
    /**
     * @method
     * @description Converts the ObservableStream to an ObservableState
     * @returns {ObservableState} A new ObservableState that represents the current value of the stream
     * @example
     * // Example: Converting an ObservableStream to an ObservableState
     * const numberStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   numberStream.push(i);
     * }
     * numberStream.end();
     * const numberState = numberStream.toState();
     * numberState.subscribe({
     *   next: (value) => console.log(value),
     *   error: (err) => console.error(err),
     * }); // Logs each number from 0 to 9
     */
    toState(initialValue = null) {
      const state = new ObservableState(initialValue, null, { name: "ObservableStream" });
      this.subscribe({
        next: (value) => state.update(() => value),
        error: (err) => state.error(err),
        complete: () => state.complete()
      });
      return state;
    }
    /**
     * @method
     * @description Pushes a value to the observers. The value can be an Observable, an async iterable, an iterable, a Promise, or any other value.
     * @param {any} value - The value to push
     * @example
     * // Example 1: Pushing values from an Observable
     * const sourceStream = new ObservableStream();
     * const targetStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   sourceStream.push(i);
     * }
     * sourceStream.end();
     * targetStream.push(sourceStream);
     * targetStream.subscribe({
     *   next: (value) => console.log(value),
     *   error: (err) => console.error(err),
     * }); // Logs each number from 0 to 9
     *
     * // Example 2: Pushing values from a Promise
     * const promiseStream = new ObservableStream();
     * const promise = new Promise((resolve) => {
     *   setTimeout(() => resolve('Hello, world!'), 1000);
     * });
     * promiseStream.push(promise);
     * promiseStream.subscribe({
     *   next: (value) => console.log(value),
     *   error: (err) => console.error(err),
     * }); // Logs 'Hello, world!' after 1 second
     */
    push(value) {
      if (value instanceof Observable) {
        const subscription2 = value.subscribe({
          next: (v) => this.__observers.forEach((observer) => observer.next(v)),
          error: (err) => this.__observers.forEach((observer) => observer.error(err)),
          complete: () => this.__observers.forEach((observer) => observer.complete())
        });
      } else if (value[Symbol.asyncIterator]) {
        (() => __async(this, null, function* () {
          try {
            try {
              for (var iter = __forAwait(value), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
                const v = temp.value;
                this.__observers.forEach((observer) => observer.next(v));
              }
            } catch (temp) {
              error = [temp];
            } finally {
              try {
                more && (temp = iter.return) && (yield temp.call(iter));
              } finally {
                if (error)
                  throw error[0];
              }
            }
            this.__observers.forEach((observer) => observer.complete());
          } catch (err) {
            this.__observers.forEach((observer) => observer.error(err));
          }
        }))();
      } else if (value[Symbol.iterator]) {
        try {
          for (const v of value) {
            this.__observers.forEach((observer) => observer.next(v));
          }
          this.__observers.forEach((observer) => observer.complete());
        } catch (err) {
          this.__observers.forEach((observer) => observer.error(err));
        }
      } else if (value instanceof Promise) {
        value.then(
          (v) => {
            this.__observers.forEach((observer) => observer.next(v));
            this.__observers.forEach((observer) => observer.complete());
          },
          (err) => this.__observers.forEach((observer) => observer.error(err))
        );
      } else {
        this.__observers.forEach((observer) => observer.next(value));
      }
    }
    /**
     * @method
     * @description Subscribes to a stream and pushes its values to the observers.
     * @param {ObservableStream} stream - The stream to plug
     * @example
     * // Example: Plugging one ObservableStream into another
     * const sourceStream = new ObservableStream();
     * const targetStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   sourceStream.push(i);
     * }
     * sourceStream.end();
     * targetStream.plug(sourceStream);
     * targetStream.subscribe({
     *   next: (value) => console.log(value),
     *   error: (err) => console.error(err),
     * }); // Logs each number from 0 to 9
     */
    plug(stream) {
      stream.subscribe({
        next: (value) => this.push(value),
        error: (err) => this.__observers.forEach((observer) => observer.error(err)),
        complete: () => this.__observers.forEach((observer) => observer.complete())
      });
    }
    /**
     * @method
     * @description Ends the stream by calling the complete method of each observer.
     * @example
     * // Example: Ending an ObservableStream
     * const numberStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   numberStream.push(i);
     * }
     * numberStream.end();
     * numberStream.subscribe({
     *   next: (value) => console.log(value),
     *   error: (err) => console.error(err),
     *   complete: () => console.log('Stream completed'),
     * }); // Logs each number from 0 to 9, then logs 'Stream completed'
     */
    end() {
      this.__observers.forEach((observer) => {
        if (observer && typeof observer.complete === "function") {
          observer.complete();
        }
      });
    }
    /**
     * @method
     * @description Catches errors on the ObservableStream and replaces them with a new stream.
     * @param {Function} fn - A function that receives the error and returns a new ObservableStream.
     * @returns {ObservableStream} - Returns a new ObservableStream that replaces the original stream when an error occurs.
     * @example
     * // Example: Catching and handling errors in an ObservableStream
     * const numberStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   if (i === 5) {
     *     numberStream.error(new Error('Something went wrong'));
     *   } else {
     *     numberStream.push(i);
     *   }
     * }
     * numberStream.end();
     * const errorHandledStream = numberStream.catchError((error) => {
     *   console.error(error);
     *   return new ObservableStream((subscriber) => {
     *     subscriber.push('Error handled');
     *     subscriber.complete();
     *   });
     * });
     * errorHandledStream.subscribe({
     *   next: (value) => console.log(value),
     *   error: (err) => console.error(err),
     * }); // Logs each number from 0 to 4, logs the error, then logs 'Error handled'
     */
    catchError(fn) {
      return new _ObservableStream((subscriber) => {
        const subscription2 = this.subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => {
            const newStream = fn(err);
            newStream.subscribe({
              next: (value) => subscriber.next(value),
              error: (err2) => subscriber.error(err2),
              complete: () => subscriber.complete()
            });
          },
          complete: () => subscriber.complete()
        });
        return () => subscription2.unsubscribe();
      });
    }
    /**
     * @method
     * @param {number} delay - The debounce delay in milliseconds
     * @returns {ObservableStream} A new ObservableStream that emits the latest value after the debounce delay
     * @example
     * // Example: Debouncing an ObservableStream of click events
     * const clickStream = new ObservableStream();
     * document.addEventListener('click', (event) => clickStream.push(event));
     * const debouncedStream = clickStream.debounce(500);
     * debouncedStream.subscribe({
     *   next: (event) => console.log(`Clicked at position: ${event.clientX}, ${event.clientY}`),
     *   error: (err) => console.error(err),
     * }); // Logs the position of the last click event that occurred at least 500 milliseconds after the previous click event
     */
    debounce(delay) {
      return new _ObservableStream((subscriber) => {
        let timeoutId = null;
        const subscription2 = this.subscribe({
          next: (value) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              subscriber.next(value);
            }, delay);
          },
          error: (err) => subscriber.error(err),
          complete: () => {
            clearTimeout(timeoutId);
            subscriber.complete();
          }
        });
        return () => {
          clearTimeout(timeoutId);
          subscription2.unsubscribe();
        };
      });
    }
    /**
     * @method
     * @param {Function} sideEffectFn - The function to perform side effect
     * @returns {ObservableStream} A new ObservableStream that is identical to the source
     * @example
     * // Example: Logging each value emitted by an ObservableStream
     * const numberStream = new ObservableStream();
     * for (let i = 0; i < 10; i++) {
     *   numberStream.push(i);
     * }
     * numberStream.end();
     * const loggedStream = numberStream.tap((value) => console.log(value));
     * loggedStream.subscribe({
     *   next: (value) => {},
     *   error: (err) => console.error(err),
     * }); // Logs each number from 0 to 9
     */
    tap(sideEffectFn) {
      return new _ObservableStream((subscriber) => {
        const subscription2 = this.subscribe({
          next: (value) => {
            sideEffectFn(value);
            subscriber.next(value);
          },
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
        return () => subscription2.unsubscribe();
      });
    }
    /**
     * @method
     * @param {number} duration - The throttle duration in milliseconds
     * @returns {ObservableStream} A new ObservableStream that emits a value then ignores subsequent source values for duration milliseconds, then repeats this process.
     * @example
     * // Example 1: Throttling scroll events
     * const scrollStream = new ObservableStream(subscriber => {
     *   window.addEventListener('scroll', event => subscriber.next(event));
     * });
     * const throttledScrollStream = scrollStream.throttle(200);
     * throttledScrollStream.subscribe({
     *   next: (event) => console.log('Scroll event:', event),
     *   error: (err) => console.error(err),
     * });
     *
     * // Example 2: Throttling search input for autocomplete
     * const searchInput = document.querySelector('#search-input');
     * const searchStream = new ObservableStream(subscriber => {
     *   searchInput.addEventListener('input', event => subscriber.next(event.target.value));
     * });
     * const throttledSearchStream = searchStream.throttle(300);
     * throttledSearchStream.subscribe({
     *   next: (searchTerm) => console.log('Search term:', searchTerm),
     *   error: (err) => console.error(err),
     * });
     */
    throttle(duration) {
      return new _ObservableStream((subscriber) => {
        let lastEmitTime = 0;
        const subscription2 = this.subscribe({
          next: (value) => {
            const currentTime = Date.now();
            if (currentTime - lastEmitTime > duration) {
              lastEmitTime = currentTime;
              subscriber.next(value);
            }
          },
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
        return () => subscription2.unsubscribe();
      });
    }
    /**
     * @method
     * @returns {ObservableStream} A new ObservableStream that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
     * @example
     * // Example 1: Filtering out consecutive duplicate search terms
     * const searchInput = document.querySelector('#search-input');
     * const searchStream = new ObservableStream(subscriber => {
     *   searchInput.addEventListener('input', event => subscriber.next(event.target.value));
     * });
     * const distinctSearchStream = searchStream.distinctUntilChanged();
     * distinctSearchStream.subscribe({
     *   next: (searchTerm) => console.log('Search term:', searchTerm),
     *   error: (err) => console.error(err),
     * });
     *
     * // Example 2: Filtering out consecutive duplicate API responses
     * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
     * const observableStream = ObservableStream.from(apiDataStream);
     * const distinctDataStream = observableStream.distinctUntilChanged();
     * distinctDataStream.subscribe({
     *   next: (data) => console.log('API data:', data),
     *   error: (err) => console.error(err),
     * });
     */
    distinctUntilChanged() {
      return new _ObservableStream((subscriber) => {
        let lastValue;
        let isFirstValue = true;
        const subscription2 = this.subscribe({
          next: (value) => {
            if (isFirstValue || value !== lastValue) {
              isFirstValue = false;
              lastValue = value;
              subscriber.next(value);
            }
          },
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
        return () => subscription2.unsubscribe();
      });
    }
    /**
     * @method
     * @param {function} transformFn - The function to transform each value in the source ObservableStream
     * @returns {ObservableStream} A new ObservableStream that emits the results of applying a given transform function to each value emitted by the source ObservableStream, sequentially.
     * @example
     * // Example 1: Transforming a stream of search terms into a stream of search results
     * const searchInput = document.querySelector('#search-input');
     * const searchStream = new ObservableStream(subscriber => {
     *   searchInput.addEventListener('input', event => subscriber.next(event.target.value));
     * });
     * const resultsStream = searchStream.concatMap(searchTerm =>
     *   ObservableStream.from(fetch(`https://api.example.com/search?query=${searchTerm}`).then(response => response.json()))
     * );
     * resultsStream.subscribe({
     *   next: (results) => console.log('Search results:', results),
     *   error: (err) => console.error(err),
     * });
     *
     * // Example 2: Transforming a stream of click events into a stream of clicked elements
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event.target));
     * });
     * const elementsStream = clickStream.concatMap(target =>
     *   ObservableStream.from(Promise.resolve(target))
     * );
     * elementsStream.subscribe({
     *   next: (element) => console.log('Clicked element:', element),
     *   error: (err) => console.error(err),
     * });
     */
    concatMap(transformFn) {
      return new _ObservableStream((subscriber) => {
        let innerSubscription = null;
        let waiting = false;
        const sourceValues = [];
        const sourceSubscription = this.subscribe({
          next: (value) => {
            if (!waiting) {
              waiting = true;
              const innerObservable = transformFn(value);
              innerSubscription = innerObservable.subscribe({
                next: (innerValue) => subscriber.next(innerValue),
                error: (err) => subscriber.error(err),
                complete: () => {
                  if (sourceValues.length > 0) {
                    const nextValue = sourceValues.shift();
                    const nextInnerObservable = transformFn(nextValue);
                    innerSubscription = nextInnerObservable.subscribe({
                      next: (innerValue) => subscriber.next(innerValue),
                      error: (err) => subscriber.error(err),
                      complete: () => waiting = false
                    });
                  } else {
                    waiting = false;
                  }
                }
              });
            } else {
              sourceValues.push(value);
            }
          },
          error: (err) => subscriber.error(err),
          complete: () => {
            if (!waiting) {
              subscriber.complete();
            }
          }
        });
        return () => {
          sourceSubscription.unsubscribe();
          if (innerSubscription) {
            innerSubscription.unsubscribe();
          }
        };
      });
    }
    /**
     * @method
     * @param {...ObservableStream} observables - The source ObservableStreams
     * @returns {ObservableStream} A new ObservableStream that emits an array with the latest values from each source ObservableStream, whenever any source ObservableStream emits.
     * @example
     * // Example 1: Combining multiple API data streams
     * const apiDataStream1 = fetch('https://api.example.com/data1').then(response => response.json());
     * const apiDataStream2 = fetch('https://api.example.com/data2').then(response => response.json());
     * const observableStream1 = ObservableStream.from(apiDataStream1);
     * const observableStream2 = ObservableStream.from(apiDataStream2);
     * const combinedStream = observableStream1.combineLatest(observableStream2);
     * combinedStream.subscribe({
     *   next: ([data1, data2]) => console.log('API data:', data1, data2),
     *   error: (err) => console.error(err),
     * });
     *
     * // Example 2: Combining multiple user event streams
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const scrollStream = new ObservableStream(subscriber => {
     *   window.addEventListener('scroll', event => subscriber.next(event));
     * });
     * const combinedStream = clickStream.combineLatest(scrollStream);
     * combinedStream.subscribe({
     *   next: ([clickEvent, scrollEvent]) => console.log('User events:', clickEvent, scrollEvent),
     *   error: (err) => console.error(err),
     * });
     */
    combineLatest(...observables) {
      return new _ObservableStream((subscriber) => {
        const values = new Array(observables.length).fill(void 0);
        const subscriptions = observables.map(
          (observable, i) => observable.subscribe({
            next: (value) => {
              values[i] = value;
              if (!values.includes(void 0)) {
                subscriber.next([...values]);
              }
            },
            error: (err) => subscriber.error(err),
            complete: () => {
            }
          })
        );
        return () => subscriptions.forEach((subscription2) => subscription2.unsubscribe());
      });
    }
    /**
     * @method
     * @param {...any} initialValues - The initial values to start with
     * @returns {ObservableStream} A new ObservableStream that emits the specified initial values, followed by all values emitted by the source ObservableStream.
     * @example
     * // Example 1: Prepending an API data stream with a loading state
     * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
     * const observableStream = ObservableStream.from(apiDataStream);
     * const loadingStream = observableStream.startWith('loading');
     * loadingStream.subscribe({
     *   next: (state) => console.log('State:', state),
     *   error: (err) => console.error(err),
     * });
     *
     * // Example 2: Prepending a user event stream with an initial event
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const initialEvent = { type: 'initial' };
     * const eventStream = clickStream.startWith(initialEvent);
     * eventStream.subscribe({
     *   next: (event) => console.log('Event:', event),
     *   error: (err) => console.error(err),
     * });
     */
    startWith(...initialValues) {
      return new _ObservableStream((subscriber) => {
        initialValues.forEach((value) => subscriber.next(value));
        const subscription2 = this.subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete()
        });
        return () => subscription2.unsubscribe();
      });
    }
  };

  // src/observables/observable-state.js
  var DependencyTracker = {
    current: null
  };
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
      this.update(() => newValue);
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
      this.__pendingUpdates.push(updater);
      this.__scheduleupdate();
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
      if (oldValue !== this.__value) {
        this.__notifyObservers();
        if (__config.events.isEnabled && typeof window !== "undefined") {
          const event = new CustomEvent("cami:state:change", {
            detail: {
              name: this.__name,
              oldValue,
              newValue: this.__value
            }
          });
          window.dispatchEvent(event);
        }
        __trace("cami:state:change", this.__name, oldValue, this.__value);
      }
      this.__updateScheduled = false;
    }
    /**
     * @method
     * @description Converts the ObservableState to an ObservableStream.
     * @returns {ObservableStream} The ObservableStream that emits the same values as the ObservableState.
     * @example
     * const stream = observable.toStream();
     */
    toStream() {
      const stream = new ObservableStream();
      this.subscribe({
        next: (value) => stream.emit(value),
        error: (err) => stream.error(err),
        complete: () => stream.end()
      });
      return stream;
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
  var ComputedState = class extends ObservableState {
    /**
     * @constructor
     * @param {Function} computeFn - The function to compute the value of the observable
     * @example
     * const computedState = new ComputedState(() => observable.value * 2);
     */
    constructor(computeFn) {
      super(null);
      this.computeFn = computeFn;
      this.dependencies = /* @__PURE__ */ new Set();
      this.subscriptions = /* @__PURE__ */ new Map();
      this.__compute();
    }
    /**
     * @method
     * @returns {any} The current value of the observable
     * @example
     * const value = computedState.value;
     */
    get value() {
      if (DependencyTracker.current) {
        DependencyTracker.current.addDependency(this);
      }
      return this.__value;
    }
    /**
     * @private
     * @method
     * @description Computes the new value of the observable and notifies observers if it has changed
     */
    __compute() {
      const tracker = {
        addDependency: (observable) => {
          if (!this.dependencies.has(observable)) {
            const subscription2 = observable.onValue(() => this.__compute());
            this.dependencies.add(observable);
            this.subscriptions.set(observable, subscription2);
          }
        }
      };
      DependencyTracker.current = tracker;
      const newValue = this.computeFn();
      DependencyTracker.current = null;
      if (newValue !== this.__value) {
        this.__value = newValue;
        this.__notifyObservers();
      }
    }
    /**
     * @method
     * @description Unsubscribes from all dependencies
     * @example
     * // Assuming `obs` is an instance of ObservableState
     * obs.dispose(); // This will unsubscribe obs from all its dependencies
     */
    dispose() {
      this.subscriptions.forEach((subscription2) => {
        subscription2.unsubscribe();
      });
    }
  };
  var computed = function(computeFn) {
    return new ComputedState(computeFn);
  };
  var effect = function(effectFn) {
    let cleanup = () => {
    };
    let dependencies = /* @__PURE__ */ new Set();
    let subscriptions = /* @__PURE__ */ new Map();
    const tracker = {
      addDependency: (observable) => {
        if (!dependencies.has(observable)) {
          const subscription2 = observable.onValue(_runEffect);
          dependencies.add(observable);
          subscriptions.set(observable, subscription2);
        }
      }
    };
    const _runEffect = () => {
      cleanup();
      DependencyTracker.current = tracker;
      cleanup = effectFn() || (() => {
      });
      DependencyTracker.current = null;
    };
    if (typeof window !== "undefined") {
      requestAnimationFrame(_runEffect);
    } else {
      setTimeout(_runEffect, 0);
    }
    const dispose = () => {
      subscriptions.forEach((subscription2) => {
        subscription2.unsubscribe();
      });
      cleanup();
    };
    return dispose;
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
            return target[property];
          } else if (typeof target.value[property] === "function") {
            return (...args) => target.value[property](...args);
          } else {
            return target.value[property];
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
  var QueryCache = /* @__PURE__ */ new Map();
  var ReactiveElement = class extends HTMLElement {
    /**
     * @constructor
     * @description Constructs a new instance of ReactiveElement.
     */
    constructor() {
      super();
      this.onCreate();
      this.__unsubscribers = /* @__PURE__ */ new Map();
      this.__computed = computed.bind(this);
      this.effect = effect.bind(this);
      this.__queryFunctions = /* @__PURE__ */ new Map();
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
     * @private
     * @method
     * @description Creates a computed observable state and registers it. The computed state is recalculated whenever
     * one of its dependencies changes. This is useful for creating derived state that automatically updates.
     *
     * @example
     * // Assuming `this.count` is an observable
     * const countSquared = this.__computed(() => this.count * this.count);
     * // `countSquared` will automatically update when `this.count` changes
     *
     * @param {Function} computeFn - The function to compute the state
     * @returns {ObservableState} The computed observable state
     */
    __computed(computeFn) {
      const observableState = super._computed(computeFn);
      console.log(observableState);
      this.__registerObservables(observableState);
      return observableState;
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
     * @description Subscribes to a store and creates an observable for a specific key in the store. This is useful for
     * synchronizing the component's state with a global store.
     *
     * @example
     * // Assuming there is a store for cart items
     * // `cartItems` will be an observable reflecting the current state of cart items in the store
     * this.cartItems = this.connect(CartStore, 'cartItems');
     *
     * @param {ObservableStore} store - The store to subscribe to
     * @param {string} key - The key in the store to create an observable for
     * @returns {ObservableProxy} An observable property or proxy for the store key
     */
    connect(store2, key) {
      if (!(store2 instanceof ObservableStore)) {
        throw new TypeError("Expected store to be an instance of ObservableStore");
      }
      const observable = this.__observable(store2.state[key], key);
      const unsubscribe = store2.subscribe((newState) => {
        observable.update(() => newState[key]);
      });
      this.__unsubscribers.set(key, unsubscribe);
      if (this.__isObjectOrArray(observable.value)) {
        this.__createObservablePropertyForObjOrArr(this, key, observable);
        return this[key];
      } else {
        this.__createObservablePropertyForPrimitive(this, key, observable);
        return this[key];
      }
    }
    /**
     * @method
     * @description Creates an ObservableStream from a subscription function.
     * @param {Function} subscribeFn - The subscription function.
     * @returns {ObservableStream} An ObservableStream that emits values produced by the subscription function.
     * @example
     * // In a FormElement component
     * const inputValidation$ = this.stream();
     * inputValidation$
     *   .map(e => this.validateEmail(e.target.value))
     *   .debounce(300)
     *   .subscribe(({ isEmailValid, emailError, email }) => {
     *     this.emailError = emailError;
     *     this.isEmailValid = isEmailValid;
     *     this.email = email;
     *     this.isEmailAvailable = this.queryEmail(this.email);
     *   });
     */
    stream(subscribeFn) {
      return new ObservableStream(subscribeFn);
    }
    /**
     * @method
     * @throws {Error} If the method template() is not implemented
     * @returns {void}
     * @example
     * // Here's a simple example of a template method implementation
     * template() {
     *   return html`<div>Hello World</div>`;
     * }
     */
    template() {
      throw new Error("[Cami.js] You have to implement the method template()!");
    }
    /**
     * @method
     * @description Fetches data from an API and caches it. This method is based on the TanStack Query defaults: https://tanstack.com/query/latest/docs/react/guides/important-defaults.
     * @param {Object} options - The options for the query.
     * @param {Array|string} options.queryKey - The key for the query.
     * @param {Function} options.queryFn - The function to fetch data.
     * @param {number} [options.staleTime=0] - The stale time for the query.
     * @param {boolean} [options.refetchOnWindowFocus=true] - Whether to refetch on window focus.
     * @param {boolean} [options.refetchOnMount=true] - Whether to refetch on mount.
     * @param {boolean} [options.refetchOnReconnect=true] - Whether to refetch on network reconnect.
     * @param {number} [options.refetchInterval=null] - The interval to refetch data.
     * @param {number} [options.gcTime=1000 * 60 * 5] - The garbage collection time for the query.
     * @param {number} [options.retry=3] - The number of retry attempts.
     * @param {Function} [options.retryDelay=(attempt) => Math.pow(2, attempt) * 1000] - The delay before retrying a failed query.
     * @example
     * // In _012_blog.html, a query is set up to fetch posts with a stale time of 5 minutes:
     * const posts = this.query({
     *   queryKey: ["posts"],
     *   queryFn: () => fetch("https://api.camijs.com/posts?_limit=5").then(res => res.json()),
     *   staleTime: 1000 * 60 * 5
     * });
     * @returns {ObservableProxy} A proxy that contains the state of the query.
     */
    query({ queryKey, queryFn, staleTime = 0, refetchOnWindowFocus = true, refetchOnMount = true, refetchOnReconnect = true, refetchInterval = null, gcTime = 1e3 * 60 * 5, retry = 3, retryDelay = (attempt) => Math.pow(2, attempt) * 1e3 }) {
      const key = Array.isArray(queryKey) ? queryKey.map((k) => typeof k === "object" ? JSON.stringify(k) : k).join(":") : queryKey;
      this.__queryFunctions.set(key, queryFn);
      __trace("query", "Starting query with key:", key);
      const queryState = this.__observable({
        data: null,
        status: "pending",
        fetchStatus: "idle",
        error: null,
        lastUpdated: QueryCache.has(key) ? QueryCache.get(key).lastUpdated : null
      }, key);
      const queryProxy = this.__observableProxy(queryState);
      const fetchData = (attempt = 0) => __async(this, null, function* () {
        const now = Date.now();
        const cacheEntry = QueryCache.get(key);
        if (cacheEntry && now - cacheEntry.lastUpdated < staleTime) {
          __trace("fetchData (if)", "Using cached data for key:", key);
          queryProxy.update((state) => {
            state.data = cacheEntry.data;
            state.status = "success";
            state.fetchStatus = "idle";
          });
        } else {
          __trace("fetchData (else)", "Fetching data for key:", key);
          try {
            queryProxy.update((state) => {
              state.status = "pending";
              state.fetchStatus = "fetching";
            });
            const data = yield queryFn();
            QueryCache.set(key, { data, lastUpdated: now });
            queryProxy.update((state) => {
              state.data = data;
              state.status = "success";
              state.fetchStatus = "idle";
            });
          } catch (error) {
            __trace("fetchData (catch)", "Fetch error for key:", key, error);
            if (attempt < retry) {
              setTimeout(() => fetchData(attempt + 1), retryDelay(attempt));
            } else {
              queryProxy.update((state) => {
                state.errorDetails = { message: error.message, stack: error.stack };
                state.status = "error";
                state.fetchStatus = "idle";
              });
            }
          }
        }
      });
      if (refetchOnMount) {
        __trace("query", "Setting up refetch on mount for key:", key);
        fetchData();
      }
      if (refetchOnWindowFocus) {
        __trace("query", "Setting up refetch on window focus for key:", key);
        const refetchOnFocus = () => fetchData();
        window.addEventListener("focus", refetchOnFocus);
        this.__unsubscribers.set(`focus:${key}`, () => window.removeEventListener("focus", refetchOnFocus));
      }
      if (refetchOnReconnect) {
        __trace("query", "Setting up refetch on reconnect for key:", key);
        window.addEventListener("online", fetchData);
        this.__unsubscribers.set(`online:${key}`, () => window.removeEventListener("online", fetchData));
      }
      if (refetchInterval) {
        __trace("query", "Setting up refetch interval for key:", key);
        const intervalId = setInterval(fetchData, refetchInterval);
        this.__unsubscribers.set(`interval:${key}`, () => clearInterval(intervalId));
      }
      const gcTimeout = setTimeout(() => {
        QueryCache.delete(key);
      }, gcTime);
      this.__unsubscribers.set(`gc:${key}`, () => clearTimeout(gcTimeout));
      return queryProxy;
    }
    /**
     * @method
     * @description Performs a mutation and returns an observable proxy. This method is inspired by the TanStack Query mutate method: https://tanstack.com/query/latest/docs/react/guides/mutations.
     * @param {Object} options - The options for the mutation.
     * @param {Function} options.mutationFn - The function to perform the mutation.
     * @param {Function} [options.onMutate] - The function to be called before the mutation is performed.
     * @param {Function} [options.onError] - The function to be called if the mutation encounters an error.
     * @param {Function} [options.onSuccess] - The function to be called if the mutation is successful.
     * @param {Function} [options.onSettled] - The function to be called after the mutation has either succeeded or failed.
     * @example
     * // In _012_blog.html, a mutation is set up to add a new post with optimistic UI updates:
     * const addPost = this.mutation({
     *   mutationFn: (newPost) => fetch("https://api.camijs.com/posts", {
     *     method: "POST",
     *     body: JSON.stringify(newPost),
     *     headers: {
     *       "Content-type": "application/json; charset=UTF-8"
     *     }
     *   }).then(res => res.json()),
     *   onMutate: (newPost) => {
     *     // Snapshot the previous state
     *     const previousPosts = this.posts.data;
     *     // Optimistically update to the new value
     *     this.posts.update(state => {
     *       state.data.push({ ...newPost, id: Date.now() });
     *     });
     *     // Return the rollback function and the new post
     *     return {
     *       rollback: () => {
     *         this.posts.update(state => {
     *           state.data = previousPosts;
     *         });
     *       },
     *       optimisticPost: newPost
     *     };
     *   }
     * });
     * @returns {ObservableProxy} A proxy that contains the state of the mutation.
     */
    mutation({ mutationFn, onMutate, onError, onSuccess, onSettled }) {
      const mutationState = this.__observable({
        data: null,
        status: "idle",
        error: null,
        isSettled: false
      }, "mutation");
      const mutationProxy = this.__observableProxy(mutationState);
      const performMutation = (variables) => __async(this, null, function* () {
        __trace("mutation", "Starting mutation for variables:", variables);
        let context;
        const previousState = mutationProxy.value;
        if (onMutate) {
          __trace("mutation", "Performing optimistic update for variables:", variables);
          context = onMutate(variables, previousState);
          mutationProxy.update((state) => {
            state.data = context.optimisticData;
            state.status = "pending";
            state.errorDetails = null;
          });
        } else {
          __trace("mutation", "Performing mutation without optimistic update for variables:", variables);
          mutationProxy.update((state) => {
            state.status = "pending";
            state.errorDetails = null;
          });
        }
        try {
          const data = yield mutationFn(variables);
          mutationProxy.update((state) => {
            state.data = data;
            state.status = "success";
          });
          if (onSuccess) {
            onSuccess(data, variables, context);
          }
          __trace("mutation", "Mutation successful for variables:", variables, data);
        } catch (error) {
          __trace("mutation", "Mutation error for variables:", variables, error);
          mutationProxy.update((state) => {
            state.errorDetails = { message: error.message };
            state.status = "error";
            if (!onError && context && context.rollback) {
              __trace("mutation", "Rolling back mutation for variables:", variables);
              context.rollback();
            }
          });
          if (onError) {
            onError(error, variables, context);
          }
        } finally {
          if (!mutationProxy.value.isSettled) {
            mutationProxy.update((state) => {
              state.isSettled = true;
            });
            if (onSettled) {
              __trace("mutation", "Calling onSettled for variables:", variables);
              onSettled(mutationProxy.value.data, mutationProxy.value.error, variables, context);
            }
          }
        }
      });
      mutationProxy.mutate = performMutation;
      mutationProxy.reset = () => {
        mutationProxy.update((state) => {
          state.data = null;
          state.status = "idle";
          state.errorDetails = null;
          state.isSettled = false;
        });
      };
      return mutationProxy;
    }
    /**
     * @method
     * @description Invalidates the queries with the given key by clearing the cache. To reflect the latest state in the UI, one will still need to manually refetch the data after invalidation. This method is particularly useful when used in conjunction with mutations, such as in the `onSettled` callback, to ensure that the UI reflects the latest state.
     *
     * @example
     * // In a mutation's `onSettled` callback within a `BlogComponent`:
     * this.addPost = this.mutation({
     *   // ...mutation config...
     *   onSettled: () => {
     *     // Invalidate the posts query to clear the cache
     *     this.invalidateQueries(['posts']);
     *     // Manually refetch the posts to update the UI with the true state
     *     this.fetchPosts(); // this assumes something like this.posts = this.query({ ... })
     *   }
     * });
     *
     * @param {Array|string} queryKey - The key for the query to invalidate.
     * @returns {void}
     */
    invalidateQueries(queryKey) {
      const key = Array.isArray(queryKey) ? queryKey.join(":") : queryKey;
      __trace("invalidateQueries", "Invalidating query with key:", key);
      QueryCache.delete(key);
      this.__updateCache(key);
    }
    /**
     * @method
     * @description Called when the component is created. Can be overridden by subclasses to add initialization logic.
     * This method is a hook for the connectedCallback, which is invoked each time the custom element is appended into a document-connected element.
     * @returns {void}
     * @example
     * onCreate() {
     *   // Example initialization logic here
     *   this.posts = this.query({
     *     queryKey: ["posts"],
     *     queryFn: () => {
     *       return fetch("https://api.camijs.com/posts?_limit=5")
     *         .then(res => res.json())
     *     },
     *     staleTime: 1000 * 60 * 5 // 5 minutes
     *   });
     * }
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
     * @description Defines the observables, computed properties, effects, and attributes for the element.
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
     * Updates the cache for the given key by refetching the data.
     * @param {string} key - The key for the query to refetch.
     * @returns {void}
     */
    __updateCache(key) {
      __trace("__updateCache", "Invalidating cache with key:", key);
      const queryFn = this.__queryFunctions.get(key);
      if (queryFn) {
        __trace("__updateCache", "Found query function for key:", key);
        const previousState = QueryCache.get(key) || { data: void 0, status: "idle", error: null };
        QueryCache.set(key, __spreadProps(__spreadValues({}, previousState), {
          status: "pending",
          error: null
        }));
        queryFn().then((data) => {
          QueryCache.set(key, {
            data,
            status: "success",
            error: null,
            lastUpdated: Date.now()
          });
          __trace("__updateCache", "Refetch successful for key:", key, data);
        }).catch((error) => {
          if (previousState.data !== void 0) {
            __trace("__updateCache", "Rolling back refetch for key:", key);
            QueryCache.set(key, previousState);
          }
          QueryCache.set(key, __spreadProps(__spreadValues({}, previousState), {
            status: "error",
            error
          }));
        });
      }
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
      const template = this.template();
      render(template, this);
    }
  };

  // src/observables/observable-element.js
  var ObservableElement = class extends ObservableStream {
    /**
     * @constructor
     * @param {string|Element} selectorOrElement - The CSS selector of the element to observe or the DOM element itself
     * @throws {Error} If no element matches the provided selector or the provided DOM element is null
     * @example
     * ```javascript
     * const { ObservableElement } = cami;
     * const draggableElement = new ObservableElement(".draggable");
     * ```
     */
    constructor(selectorOrElement) {
      super();
      if (typeof selectorOrElement === "string") {
        this.element = document.querySelector(selectorOrElement);
        if (!this.element) {
          throw new Error(`[Cami.js] Element not found for selector: ${selectorOrElement}`);
        }
      } else if (selectorOrElement instanceof Element || selectorOrElement instanceof Document) {
        this.element = selectorOrElement;
      } else {
        throw new Error(`[Cami.js] Invalid argument: ${selectorOrElement}`);
      }
    }
    /**
     * @method
     * @param {string} eventType - The type of the event to observe
     * @param {Object} options - The options to pass to addEventListener
     * @returns {ObservableStream} An ObservableStream that emits the observed events
     * @example
     * ```javascript
     * const { ObservableElement } = cami;
     * const draggableElement = new ObservableElement(".draggable");
     * draggableElement.on('click').subscribe({
     *   next: event => console.log('drag event', event),
     *   error: err => console.error(err),
     * });
     * ```
     */
    on(eventType, options = {}) {
      return new ObservableStream((subscriber) => {
        const eventListener = (event) => {
          subscriber.next(event);
        };
        this.element.addEventListener(eventType, eventListener, options);
        return () => {
          this.element.removeEventListener(eventType, eventListener, options);
        };
      });
    }
  };

  // src/http.js
  var HTTPStream = class extends ObservableStream {
    constructor() {
      super(...arguments);
      __publicField(this, "__handlers", {});
    }
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
          next: (data) => {
            try {
              if (typeof data === "object") {
                resolve(data);
              } else {
                resolve(JSON.parse(data));
              }
            } catch (error) {
              reject(error);
            }
          },
          error: (error) => reject(error)
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
      if (!this.__handlers[event]) {
        this.__handlers[event] = [];
      }
      this.__handlers[event].push(handler);
      return this;
    }
  };
  var http = (config) => {
    if (typeof config === "string") {
      return http.get(config);
    }
    return new HTTPStream((observer) => {
      const xhr = new XMLHttpRequest();
      xhr.open(config.method || "GET", config.url);
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
          } catch (e) {
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
  http.get = (url, config = {}) => {
    config.url = url;
    config.method = "GET";
    return http(config);
  };
  http.post = (url, data = {}, config = {}) => {
    config.url = url;
    config.data = data;
    config.method = "POST";
    return http(config);
  };
  http.put = (url, data = {}, config = {}) => {
    config.url = url;
    config.data = data;
    config.method = "PUT";
    return http(config);
  };
  http.patch = (url, data = {}, config = {}) => {
    config.url = url;
    config.data = data;
    config.method = "PATCH";
    return http(config);
  };
  http.delete = (url, config = {}) => {
    config.url = url;
    config.method = "DELETE";
    return http(config);
  };
  http.sse = (url, config = {}) => {
    const stream = new HTTPStream((observer) => {
      const source = new EventSource(url, config);
      source.onmessage = (event) => {
        if (stream.__handlers[event.type]) {
          stream.__handlers[event.type].forEach((handler) => handler(event));
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
 * Immer
 * Copyright (c) 2017 Michel Weststrate
 * MIT License
 */
/**
 * @license
 * http.js
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */
/**
 * @license
 * cami.js
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */
