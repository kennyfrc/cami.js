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
    if (symbol = Symbol[name])
      return symbol;
    throw Error("Symbol." + name + " is not defined");
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a2, b2) => {
    for (var prop in b2 || (b2 = {}))
      if (__hasOwnProp.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b2)) {
        if (__propIsEnum.call(b2, prop))
          __defNormalProp(a2, prop, b2[prop]);
      }
    return a2;
  };
  var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
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
        } catch (e2) {
          reject(e2);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var step = (x2) => x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
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
    debug: () => debug,
    events: () => events,
    html: () => x,
    http: () => http,
    store: () => store
  });

  // node_modules/lit-html/lit-html.js
  var t = globalThis;
  var i = t.trustedTypes;
  var s = i ? i.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0;
  var e = "$lit$";
  var h = `lit$${(Math.random() + "").slice(9)}$`;
  var o = "?" + h;
  var n = `<${o}>`;
  var r = document;
  var l = () => r.createComment("");
  var c = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2;
  var a = Array.isArray;
  var u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]);
  var d = "[ 	\n\f\r]";
  var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var _ = />/g;
  var m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p = /'/g;
  var g = /"/g;
  var $ = /^(?:script|style|textarea|title)$/i;
  var y = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 });
  var x = y(1);
  var b = y(2);
  var w = Symbol.for("lit-noChange");
  var T = Symbol.for("lit-nothing");
  var A = /* @__PURE__ */ new WeakMap();
  var E = r.createTreeWalker(r, 129);
  function C(t2, i2) {
    if (!Array.isArray(t2) || !t2.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return void 0 !== s ? s.createHTML(i2) : i2;
  }
  var P = (t2, i2) => {
    const s2 = t2.length - 1, o2 = [];
    let r2, l2 = 2 === i2 ? "<svg>" : "", c2 = f;
    for (let i3 = 0; i3 < s2; i3++) {
      const s3 = t2[i3];
      let a2, u2, d2 = -1, y2 = 0;
      for (; y2 < s3.length && (c2.lastIndex = y2, u2 = c2.exec(s3), null !== u2); )
        y2 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r2 != null ? r2 : f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f : (c2 = m, r2 = void 0);
      const x2 = c2 === m && t2[i3 + 1].startsWith("/>") ? " " : "";
      l2 += c2 === f ? s3 + n : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i3 : x2);
    }
    return [C(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : "")), o2];
  };
  var V = class _V {
    constructor({ strings: t2, _$litType$: s2 }, n2) {
      let r2;
      this.parts = [];
      let c2 = 0, a2 = 0;
      const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = P(t2, s2);
      if (this.el = _V.createElement(f2, n2), E.currentNode = this.el.content, 2 === s2) {
        const t3 = this.el.content.firstChild;
        t3.replaceWith(...t3.childNodes);
      }
      for (; null !== (r2 = E.nextNode()) && d2.length < u2; ) {
        if (1 === r2.nodeType) {
          if (r2.hasAttributes())
            for (const t3 of r2.getAttributeNames())
              if (t3.endsWith(e)) {
                const i2 = v2[a2++], s3 = r2.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i2);
                d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? k : "?" === e2[1] ? H : "@" === e2[1] ? I : R }), r2.removeAttribute(t3);
              } else
                t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
          if ($.test(r2.tagName)) {
            const t3 = r2.textContent.split(h), s3 = t3.length - 1;
            if (s3 > 0) {
              r2.textContent = i ? i.emptyScript : "";
              for (let i2 = 0; i2 < s3; i2++)
                r2.append(t3[i2], l()), E.nextNode(), d2.push({ type: 2, index: ++c2 });
              r2.append(t3[s3], l());
            }
          }
        } else if (8 === r2.nodeType)
          if (r2.data === o)
            d2.push({ type: 2, index: c2 });
          else {
            let t3 = -1;
            for (; -1 !== (t3 = r2.data.indexOf(h, t3 + 1)); )
              d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
          }
        c2++;
      }
    }
    static createElement(t2, i2) {
      const s2 = r.createElement("template");
      return s2.innerHTML = t2, s2;
    }
  };
  function N(t2, i2, s2 = t2, e2) {
    var _a2, _b, _c;
    if (i2 === w)
      return i2;
    let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
    const o2 = c(i2) ? void 0 : i2._$litDirective$;
    return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? ((_c = s2._$Co) != null ? _c : s2._$Co = [])[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = N(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
  }
  var S = class {
    constructor(t2, i2) {
      this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t2) {
      var _a2;
      const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((_a2 = t2 == null ? void 0 : t2.creationScope) != null ? _a2 : r).importNode(i2, true);
      E.currentNode = e2;
      let h2 = E.nextNode(), o2 = 0, n2 = 0, l2 = s2[0];
      for (; void 0 !== l2; ) {
        if (o2 === l2.index) {
          let i3;
          2 === l2.type ? i3 = new M(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new L(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n2];
        }
        o2 !== (l2 == null ? void 0 : l2.index) && (h2 = E.nextNode(), o2++);
      }
      return E.currentNode = r, e2;
    }
    p(t2) {
      let i2 = 0;
      for (const s2 of this._$AV)
        void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
    }
  };
  var M = class _M {
    get _$AU() {
      var _a2, _b;
      return (_b = (_a2 = this._$AM) == null ? void 0 : _a2._$AU) != null ? _b : this._$Cv;
    }
    constructor(t2, i2, s2, e2) {
      var _a2;
      this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (_a2 = e2 == null ? void 0 : e2.isConnected) != null ? _a2 : true;
    }
    get parentNode() {
      let t2 = this._$AA.parentNode;
      const i2 = this._$AM;
      return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t2, i2 = this) {
      t2 = N(this, t2, i2), c(t2) ? t2 === T || null == t2 || "" === t2 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t2 !== this._$AH && t2 !== w && this._(t2) : void 0 !== t2._$litType$ ? this.g(t2) : void 0 !== t2.nodeType ? this.$(t2) : u(t2) ? this.T(t2) : this._(t2);
    }
    k(t2) {
      return this._$AA.parentNode.insertBefore(t2, this._$AB);
    }
    $(t2) {
      this._$AH !== t2 && (this._$AR(), this._$AH = this.k(t2));
    }
    _(t2) {
      this._$AH !== T && c(this._$AH) ? this._$AA.nextSibling.data = t2 : this.$(r.createTextNode(t2)), this._$AH = t2;
    }
    g(t2) {
      var _a2;
      const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = V.createElement(C(s2.h, s2.h[0]), this.options)), s2);
      if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2)
        this._$AH.p(i2);
      else {
        const t3 = new S(e2, this), s3 = t3.u(this.options);
        t3.p(i2), this.$(s3), this._$AH = t3;
      }
    }
    _$AC(t2) {
      let i2 = A.get(t2.strings);
      return void 0 === i2 && A.set(t2.strings, i2 = new V(t2)), i2;
    }
    T(t2) {
      a(this._$AH) || (this._$AH = [], this._$AR());
      const i2 = this._$AH;
      let s2, e2 = 0;
      for (const h2 of t2)
        e2 === i2.length ? i2.push(s2 = new _M(this.k(l()), this.k(l()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
      e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
    }
    _$AR(t2 = this._$AA.nextSibling, i2) {
      var _a2;
      for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i2); t2 && t2 !== this._$AB; ) {
        const i3 = t2.nextSibling;
        t2.remove(), t2 = i3;
      }
    }
    setConnected(t2) {
      var _a2;
      void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
    }
  };
  var R = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t2, i2, s2, e2, h2) {
      this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = T;
    }
    _$AI(t2, i2 = this, s2, e2) {
      const h2 = this.strings;
      let o2 = false;
      if (void 0 === h2)
        t2 = N(this, t2, i2, 0), o2 = !c(t2) || t2 !== this._$AH && t2 !== w, o2 && (this._$AH = t2);
      else {
        const e3 = t2;
        let n2, r2;
        for (t2 = h2[0], n2 = 0; n2 < h2.length - 1; n2++)
          r2 = N(this, e3[s2 + n2], i2, n2), r2 === w && (r2 = this._$AH[n2]), o2 || (o2 = !c(r2) || r2 !== this._$AH[n2]), r2 === T ? t2 = T : t2 !== T && (t2 += (r2 != null ? r2 : "") + h2[n2 + 1]), this._$AH[n2] = r2;
      }
      o2 && !e2 && this.j(t2);
    }
    j(t2) {
      t2 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 != null ? t2 : "");
    }
  };
  var k = class extends R {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t2) {
      this.element[this.name] = t2 === T ? void 0 : t2;
    }
  };
  var H = class extends R {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t2) {
      this.element.toggleAttribute(this.name, !!t2 && t2 !== T);
    }
  };
  var I = class extends R {
    constructor(t2, i2, s2, e2, h2) {
      super(t2, i2, s2, e2, h2), this.type = 5;
    }
    _$AI(t2, i2 = this) {
      var _a2;
      if ((t2 = (_a2 = N(this, t2, i2, 0)) != null ? _a2 : T) === w)
        return;
      const s2 = this._$AH, e2 = t2 === T && s2 !== T || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== T && (s2 === T || e2);
      e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
    }
    handleEvent(t2) {
      var _a2, _b;
      "function" == typeof this._$AH ? this._$AH.call((_b = (_a2 = this.options) == null ? void 0 : _a2.host) != null ? _b : this.element, t2) : this._$AH.handleEvent(t2);
    }
  };
  var L = class {
    constructor(t2, i2, s2) {
      this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t2) {
      N(this, t2);
    }
  };
  var Z = t.litHtmlPolyfillSupport;
  var _a;
  Z == null ? void 0 : Z(V, M), ((_a = t.litHtmlVersions) != null ? _a : t.litHtmlVersions = []).push("3.0.0");
  var j = (t2, i2, s2) => {
    var _a2, _b;
    const e2 = (_a2 = s2 == null ? void 0 : s2.renderBefore) != null ? _a2 : i2;
    let h2 = e2._$litPart$;
    if (void 0 === h2) {
      const t3 = (_b = s2 == null ? void 0 : s2.renderBefore) != null ? _b : null;
      e2._$litPart$ = h2 = new M(i2.insertBefore(l(), t3), t3, void 0, s2 != null ? s2 : {});
    }
    return h2._$AI(t2), h2;
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
      const e2 = errors[error];
      const msg = typeof e2 === "function" ? e2.apply(null, args) : e2;
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
    var _a2;
    if (!value)
      return false;
    return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_a2 = value.constructor) == null ? void 0 : _a2[DRAFTABLE]) || isMap(value) || isSet(value);
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
    const t2 = getArchtype(thing);
    if (t2 === 2)
      thing.set(propOrOldValue, value);
    else if (t2 === 3) {
      thing.add(value);
    } else
      thing[propOrOldValue] = value;
  }
  function is(x2, y2) {
    if (x2 === y2) {
      return x2 !== 0 || 1 / x2 === 1 / y2;
    } else {
      return x2 !== x2 && y2 !== y2;
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
    for (let i2 = 0; i2 < keys.length; i2++) {
      const key = keys[i2];
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
    const isArray = Array.isArray(base);
    const state = {
      type_: isArray ? 1 : 0,
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
    if (isArray) {
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
    var _a2;
    const desc = getDescriptorFromProto(source, prop);
    return desc ? `value` in desc ? desc.value : (
      // This is a very special case, if the prop is a getter defined by the
      // prototype, we should invoke it with the draft as context!
      (_a2 = desc.get) == null ? void 0 : _a2.call(state.draft_)
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
            const p2 = [];
            const ip = [];
            getPlugin("Patches").generateReplacementPatches_(base, result, p2, ip);
            patchListener(p2, ip);
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
        const result = this.produce(base, recipe, (p2, ip) => {
          patches = p2;
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
      let i2;
      for (i2 = patches.length - 1; i2 >= 0; i2--) {
        const patch = patches[i2];
        if (patch.path.length === 0 && patch.op === "replace") {
          base = patch.value;
          break;
        }
      }
      if (i2 > -1) {
        patches = patches.slice(i2 + 1);
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
     * @param {Object|Function} observer - The observer object or function
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
     */
    next(result) {
      if (!this.isUnsubscribed && this.observer.next) {
        this.observer.next(result);
      }
    }
    /**
     * @method
     * @description Notifies the observer that the observable has completed and no more data will be emitted.
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
     * @param {Function} teardown - The teardown function to add to the teardowns array
     */
    addTeardown(teardown) {
      this.teardowns.push(teardown);
    }
    /**
     * @method
     * @description Unsubscribes from the observable, preventing any further notifications to the observer and triggering any teardown logic.
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
     * @param {Function} subscribeCallback - The callback function to call when a new observer subscribes
     * @property {Array<Subscriber>} _observers - The list of observers
     * @property {Function} subscribeCallback - The callback function to call when a new observer subscribes
     */
    constructor(subscribeCallback = () => () => {
    }) {
      this._observers = [];
      this.subscribeCallback = subscribeCallback;
    }
    /**
     * @method
     * @param {Object} observer - The observer to subscribe. Default is an empty function.
     * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
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
      this._observers.push(subscriber);
      return {
        unsubscribe: () => subscriber.unsubscribe(),
        complete: () => subscriber.complete(),
        error: (err) => subscriber.error(err)
      };
    }
    /**
     * @method
     * @param {*} value - The value to be passed to the observer's next method.
     */
    next(value) {
      this._observers.forEach((observer) => {
        observer.next(value);
      });
    }
    /**
     * @method
     * @param {*} error - The error to be passed to the observer's error method.
     */
    error(error) {
      this._observers.forEach((observer) => {
        observer.error(error);
      });
    }
    /**
     * @method
     * Calls the complete method on all observers.
     */
    complete() {
      this._observers.forEach((observer) => {
        observer.complete();
      });
    }
    /**
     * @method
     * @param {Function} callbackFn - The callback function to call when a new value is emitted.
     * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
     */
    onValue(callbackFn) {
      return this.subscribe({
        next: callbackFn
      });
    }
    /**
     * @method
     * @param {Function} callbackFn - The callback function to call when an error is emitted.
     * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
     */
    onError(callbackFn) {
      return this.subscribe({
        error: callbackFn
      });
    }
    /**
     * @method
     * @param {Function} callbackFn - The callback function to call when the observable completes.
     * @returns {Object} An object containing an unsubscribe method to stop receiving updates.
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
     */
    [Symbol.asyncIterator]() {
      let observer;
      let resolve;
      let promise = new Promise((r2) => resolve = r2);
      observer = {
        next: (value) => {
          resolve({ value, done: false });
          promise = new Promise((r2) => resolve = r2);
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

  // src/observables/observable-store.js
  var ObservableStore = class extends Observable {
    /**
     * @constructor
     * @param {Object} initialState - The initial state of the store
     */
    constructor(initialState) {
      if (typeof initialState !== "object" || initialState === null) {
        throw new TypeError("[Cami.js] initialState must be an object");
      }
      super((subscriber) => {
        this._subscriber = subscriber;
        return () => {
          this._subscriber = null;
        };
      });
      this.state = new Proxy(initialState, {
        get: (target, property) => {
          return target[property];
        },
        set: (target, property, value) => {
          target[property] = value;
          this._observers.forEach((observer) => observer.next(this.state));
          if (this.devTools) {
            this.devTools.send(property, this.state);
          }
          return true;
        }
      });
      this.reducers = {};
      this.middlewares = [];
      this.devTools = this.connectToDevTools();
      Object.keys(initialState).forEach((key) => {
        if (typeof initialState[key] === "function") {
          this.register(key, initialState[key]);
        } else {
          this.state[key] = initialState[key];
        }
      });
    }
    /**
     * Applies all registered middlewares to the given action and arguments.
     *
     * @param {string} action - The action type
     * @param {...any} args - The arguments to pass to the action
     * @returns {void}
     */
    _applyMiddleware(action, ...args) {
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
     * @method connectToDevTools
     * @returns {Object|null} - Returns the devTools object if available, else null
     */
    connectToDevTools() {
      if (typeof window !== "undefined" && window["__REDUX_DEVTOOLS_EXTENSION__"]) {
        const devTools = window["__REDUX_DEVTOOLS_EXTENSION__"].connect();
        devTools.init(this.state);
        return devTools;
      }
      return null;
    }
    /**
     * @method use
     * @param {Function} middleware - The middleware function to use
     */
    use(middleware) {
      this.middlewares.push(middleware);
    }
    /**
     * @method register
     * @param {string} action - The action type
     * @param {Function} reducer - The reducer function for the action
     * @throws {Error} - Throws an error if the action type is already registered
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
     * @method dispatch
     * @param {string|Function} action - The action type or a function
     * @param {Object} payload - The payload for the action
     * @throws {Error} - Throws an error if the action type is not a string
     */
    dispatch(action, payload) {
      if (typeof action === "function") {
        return action(this.dispatch.bind(this), () => this.state);
      }
      if (typeof action !== "string") {
        throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof action}`);
      }
      const reducer = this.reducers[action];
      if (!reducer) {
        console.warn(`No reducer found for action ${action}`);
        return;
      }
      this._applyMiddleware(action, payload);
      this.state = produce(this.state, (draft) => {
        reducer(draft, payload);
      });
      this._observers.forEach((observer) => observer.next(this.state));
      if (this.devTools) {
        this.devTools.send(action, this.state);
      }
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
     * // Example 1: Creating an ObservableStream from an API data stream
     * const apiDataStream = fetch('https://api.example.com/data').then(response => response.json());
     * const observableStream = ObservableStream.from(apiDataStream);
     *
     * // Example 2: Creating an ObservableStream from a user event stream
     * const clickStream = new ObservableStream(subscriber => {
     *   document.addEventListener('click', event => subscriber.next(event));
     * });
     * const observableStream = ObservableStream.from(clickStream);
     */
    static from(value) {
      if (value instanceof Observable) {
        return new _ObservableStream((subscriber) => {
          const subscription2 = value.subscribe({
            next: (v2) => subscriber.next(v2),
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
                  const v2 = temp.value;
                  if (isCancelled)
                    return;
                  subscriber.next(v2);
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
            for (const v2 of value) {
              subscriber.next(v2);
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
            (v2) => {
              subscriber.next(v2);
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
    take(n2) {
      return new _ObservableStream((subscriber) => {
        let i2 = 0;
        const subscription2 = this.subscribe({
          next: (value) => {
            if (i2++ < n2) {
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
    drop(n2) {
      return new _ObservableStream((subscriber) => {
        let i2 = 0;
        const subscription2 = this.subscribe({
          next: (value) => {
            if (i2++ >= n2) {
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
          next: (v2) => this._observers.forEach((observer) => observer.next(v2)),
          error: (err) => this._observers.forEach((observer) => observer.error(err)),
          complete: () => this._observers.forEach((observer) => observer.complete())
        });
      } else if (value[Symbol.asyncIterator]) {
        (() => __async(this, null, function* () {
          try {
            try {
              for (var iter = __forAwait(value), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
                const v2 = temp.value;
                this._observers.forEach((observer) => observer.next(v2));
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
            this._observers.forEach((observer) => observer.complete());
          } catch (err) {
            this._observers.forEach((observer) => observer.error(err));
          }
        }))();
      } else if (value[Symbol.iterator]) {
        try {
          for (const v2 of value) {
            this._observers.forEach((observer) => observer.next(v2));
          }
          this._observers.forEach((observer) => observer.complete());
        } catch (err) {
          this._observers.forEach((observer) => observer.error(err));
        }
      } else if (value instanceof Promise) {
        value.then(
          (v2) => {
            this._observers.forEach((observer) => observer.next(v2));
            this._observers.forEach((observer) => observer.complete());
          },
          (err) => this._observers.forEach((observer) => observer.error(err))
        );
      } else {
        this._observers.forEach((observer) => observer.next(value));
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
        error: (err) => this._observers.forEach((observer) => observer.error(err)),
        complete: () => this._observers.forEach((observer) => observer.complete())
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
      this._observers.forEach((observer) => {
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
          (observable, i2) => observable.subscribe({
            next: (value) => {
              values[i2] = value;
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

  // src/config.js
  var _config = {
    events: {
      _state: true,
      get isEnabled() {
        return this._state;
      },
      enable: function() {
        this._state = true;
      },
      disable: function() {
        this._state = false;
      }
    },
    debug: {
      _state: false,
      get isEnabled() {
        return this._state;
      },
      enable: function() {
        console.log("Cami.js debug mode enabled");
        this._state = true;
      },
      disable: function() {
        this._state = false;
      }
    }
  };

  // src/trace.js
  function _trace(functionName, ...messages) {
    if (_config.debug.isEnabled) {
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
     */
    constructor(initialValue = null, subscriber = null, { last = false, name = null } = {}) {
      super();
      if (last) {
        this._lastObserver = subscriber;
      } else {
        this._observers.push(subscriber);
      }
      this._value = produce(initialValue, (draft) => {
      });
      this._pendingUpdates = [];
      this._updateScheduled = false;
      this._name = name;
    }
    /**
     * @method
     * @returns {any} The current value of the observable
     */
    get value() {
      if (DependencyTracker.current != null) {
        DependencyTracker.current.addDependency(this);
      }
      return this._value;
    }
    /**
     * @method
     * @param {any} newValue - The new value to set for the observable
     * @description This method sets a new value for the observable by calling the update method with the new value.
     */
    set value(newValue) {
      this.update(() => newValue);
    }
    /**
     * @method
     * @description Merges properties from the provided object into the observable's value
     * @param {Object} obj - The object whose properties to merge
     */
    assign(obj) {
      if (typeof this._value !== "object" || this._value === null) {
        throw new Error("[Cami.js] Observable value is not an object");
      }
      this.update((value) => Object.assign(value, obj));
    }
    /**
     * @method
     * @description Sets a new key/value pair in the observable's value
     * @param {any} key - The key to set
     * @param {any} value - The value to set
     */
    set(key, value) {
      if (typeof this._value !== "object" || this._value === null) {
        throw new Error("[Cami.js] Observable value is not an object");
      }
      this.update((state) => {
        state[key] = value;
      });
    }
    /**
     * @method
     * @description Removes a key/value pair from the observable's value
     * @param {any} key - The key to remove
     */
    delete(key) {
      if (typeof this._value !== "object" || this._value === null) {
        throw new Error("[Cami.js] Observable value is not an object");
      }
      this.update((state) => {
        delete state[key];
      });
    }
    /**
     * @method
     * @description Removes all key/value pairs from the observable's value
     */
    clear() {
      this.update(() => ({}));
    }
    /**
     * @method
     * @description Adds one or more elements to the end of the observable's value
     * @param {...any} elements - The elements to add
     */
    push(...elements) {
      if (!Array.isArray(this._value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((value) => {
        value.push(...elements);
      });
    }
    /**
     * @method
     * @description Removes the last element from the observable's value
     */
    pop() {
      if (!Array.isArray(this._value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((value) => {
        value.pop();
      });
    }
    /**
     * @method
     * @description Removes the first element from the observable's value
     */
    shift() {
      if (!Array.isArray(this._value)) {
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
     */
    splice(start, deleteCount, ...items) {
      if (!Array.isArray(this._value)) {
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
     */
    unshift(...elements) {
      if (!Array.isArray(this._value)) {
        throw new Error("[Cami.js] Observable value is not an array");
      }
      this.update((value) => {
        value.unshift(...elements);
      });
    }
    /**
     * @method
     * @description Reverses the order of the elements in the observable's value
     */
    reverse() {
      if (!Array.isArray(this._value)) {
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
     */
    sort(compareFunction) {
      if (!Array.isArray(this._value)) {
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
     * @param {number} [end=this._value.length] - The index to stop filling at
     */
    fill(value, start = 0, end = this._value.length) {
      if (!Array.isArray(this._value)) {
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
     * @param {number} [end=this._value.length] - The end index to stop copying elements from
     */
    copyWithin(target, start, end = this._value.length) {
      if (!Array.isArray(this._value)) {
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
     */
    update(updater) {
      this._pendingUpdates.push(updater);
      this._scheduleupdate();
    }
    _scheduleupdate() {
      if (!this._updateScheduled) {
        this._updateScheduled = true;
        this._applyUpdates();
      }
    }
    /**
     * @method
     * @description This method notifies all observers of the observable with the current value.
     * It first creates a list of observers by combining the regular observers and the last observer.
     * Then, it iterates over this list and calls each observer with the current value.
     * If the observer is a function, it is called directly.
     * If the observer is an object with a 'next' method, the 'next' method is called.
     */
    _notifyObservers() {
      const observersWithLast = [...this._observers, this._lastObserver];
      observersWithLast.forEach((observer) => {
        if (observer && typeof observer === "function") {
          observer(this._value);
        } else if (observer && observer.next) {
          observer.next(this._value);
        }
      });
    }
    /**
     * @method
     * @private
     * @description This method applies all the pending updates to the value.
     * It then notifies all the observers with the updated value.
     */
    _applyUpdates() {
      let oldValue = this._value;
      while (this._pendingUpdates.length > 0) {
        const updater = this._pendingUpdates.shift();
        if (typeof this._value === "object" && this._value !== null && this._value.constructor === Object || Array.isArray(this._value)) {
          this._value = produce(this._value, updater);
        } else {
          this._value = updater(this._value);
        }
      }
      if (oldValue !== this._value) {
        this._notifyObservers();
        if (_config.events.isEnabled && typeof window !== "undefined") {
          const event = new CustomEvent("cami:state:change", {
            detail: {
              name: this._name,
              oldValue,
              newValue: this._value
            }
          });
          window.dispatchEvent(event);
        }
        _trace("cami:state:change", this._name, oldValue, this._value);
      }
      this._updateScheduled = false;
    }
    /**
     * @method
     * @description Converts the ObservableState to an ObservableStream.
     * @returns {ObservableStream} The ObservableStream that emits the same values as the ObservableState.
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
     */
    complete() {
      this._observers.forEach((observer) => {
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
     */
    constructor(computeFn) {
      super(null);
      this.computeFn = computeFn;
      this.dependencies = /* @__PURE__ */ new Set();
      this.subscriptions = /* @__PURE__ */ new Map();
      this.compute();
    }
    /**
     * @method
     * @returns {any} The current value of the observable
     */
    get value() {
      if (DependencyTracker.current) {
        DependencyTracker.current.addDependency(this);
      }
      return this._value;
    }
    /**
     * @method
     * @description Computes the new value of the observable and notifies observers if it has changed
     */
    compute() {
      const tracker = {
        addDependency: (observable) => {
          if (!this.dependencies.has(observable)) {
            const subscription2 = observable.onValue(() => this.compute());
            this.dependencies.add(observable);
            this.subscriptions.set(observable, subscription2);
          }
        }
      };
      DependencyTracker.current = tracker;
      const newValue = this.computeFn();
      DependencyTracker.current = null;
      if (newValue !== this._value) {
        this._value = newValue;
        this._notifyObservers();
      }
    }
    /**
     * @method
     * @description Unsubscribes from all dependencies
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
          const subscription2 = observable.onValue(runEffect);
          dependencies.add(observable);
          subscriptions.set(observable, subscription2);
        }
      }
    };
    const runEffect = () => {
      cleanup();
      DependencyTracker.current = tracker;
      cleanup = effectFn() || (() => {
      });
      DependencyTracker.current = null;
    };
    if (typeof window !== "undefined") {
      requestAnimationFrame(runEffect);
    } else {
      setTimeout(runEffect, 0);
    }
    const dispose = () => {
      subscriptions.forEach((subscription2) => {
        subscription2.unsubscribe();
      });
      cleanup();
    };
    return dispose;
  };

  // src/observables/observable-element.js
  var ObservableElement = class extends ObservableStream {
    /**
     * @constructor
     * @param {string|Element} selectorOrElement - The CSS selector of the element to observe or the DOM element itself
     * @throws {Error} If no element matches the provided selector or the provided DOM element is null
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
      __publicField(this, "_handlers", {});
    }
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
    on(event, handler) {
      if (!this._handlers[event]) {
        this._handlers[event] = [];
      }
      this._handlers[event].push(handler);
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
          } catch (e2) {
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
        if (stream._handlers[event.type]) {
          stream._handlers[event.type].forEach((handler) => handler(event));
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
  var QueryCache = /* @__PURE__ */ new Map();
  var ReactiveElement = class extends HTMLElement {
    /**
     * @constructor
     * Constructs a new instance of ReactiveElement.
     */
    constructor() {
      super();
      this.onCreate();
      this._unsubscribers = /* @__PURE__ */ new Map();
      this._effects = [];
      this.computed = computed.bind(this);
      this.effect = effect.bind(this);
      this._queryFunctions = /* @__PURE__ */ new Map();
    }
    /**
     * @method
     * @description Called when the component is created. Can be overridden by subclasses to add initialization logic.
     */
    onCreate() {
    }
    /**
     * @method
     * @description Checks if the provided value is an object or an array
     * @param {any} value - The value to check
     * @returns {boolean} True if the value is an object or an array, false otherwise
     */
    _isObjectOrArray(value) {
      return value !== null && (typeof value === "object" || Array.isArray(value));
    }
    /**
     * @method
     * @description Handles the case when the provided value is an object or an array
     * @param {Object} context - The context in which the property is defined
     * @param {string} key - The property key
     * @param {ObservableState} observable - The observable to bind to the property
     * @param {boolean} [isAttribute=false] - Whether the property is an attribute
     * @throws {TypeError} If observable is not an instance of ObservableState
     * @returns {void}
     */
    _handleObjectOrArray(context, key, observable, isAttribute = false) {
      if (!(observable instanceof ObservableState)) {
        throw new TypeError("Expected observable to be an instance of ObservableState");
      }
      const proxy = this._observableProxy(observable);
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
     * @method
     * @description Handles the case when the provided value is not an object or an array
     * @param {Object} context - The context in which the property is defined
     * @param {string} key - The property key
     * @param {ObservableState} observable - The observable to bind to the property
     * @param {boolean} [isAttribute=false] - Whether the property is an attribute
     * @throws {TypeError} If observable is not an instance of ObservableState
     * @returns {void}
     */
    _handleNonObject(context, key, observable, isAttribute = false) {
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
     * @method
     * @description Creates a proxy for the observable
     * @param {ObservableState} observable - The observable to create a proxy for
     * @throws {TypeError} If observable is not an instance of ObservableState
     * @returns {Proxy} The created proxy
     */
    _observableProxy(observable) {
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
    /**
     * @method
     * @description Defines the observables, computed properties, effects, and attributes for the element
     * @param {Object} config - The configuration object
     * @returns {void}
     */
    _setup(config) {
      if (config.infer === true) {
        Object.keys(this).forEach((key) => {
          if (typeof this[key] !== "function" && !key.startsWith("_")) {
            if (this[key] instanceof Observable) {
              return;
            } else {
              const observable = this._observable(this[key], key);
              if (this._isObjectOrArray(observable.value)) {
                this._handleObjectOrArray(this, key, observable);
              } else {
                this._handleNonObject(this, key, observable);
              }
            }
          }
        });
      }
    }
    /**
     * @method
     * @description Creates observables from attributes and applies optional transformation functions.
     * @param {Object} attributes - An object with attribute names as keys and optional parsing functions as values.
     * @returns {void}
     */
    observableAttributes(attributes) {
      Object.entries(attributes).forEach(([attrName, parseFn]) => {
        let attrValue = this.getAttribute(attrName);
        const transformFn = typeof parseFn === "function" ? parseFn : (v2) => v2;
        attrValue = produce(attrValue, transformFn);
        const observable = this._observable(attrValue, attrName);
        if (this._isObjectOrArray(observable.value)) {
          this._handleObjectOrArray(this, attrName, observable, true);
        } else {
          this._handleNonObject(this, attrName, observable, true);
        }
      });
    }
    /**
     * @method
     * @description Creates an observable with an initial value
     * @param {any} initialValue - The initial value for the observable
     * @param {string} [name] - The name of the observable
     * @throws {Error} If the type of initialValue is not allowed in observables
     * @returns {ObservableState} The observable
     */
    _observable(initialValue, name = null) {
      if (!this._isAllowedType(initialValue)) {
        const type = Object.prototype.toString.call(initialValue);
        throw new Error(`[Cami.js] The type ${type} of initialValue is not allowed in observables.`);
      }
      const observable = new ObservableState(initialValue);
      this._registerObservables(observable);
      return observable;
    }
    /**
     * @method
     * @description Fetches data from an API and caches it. This method is based on the TanStack Query defaults: https://tanstack.com/query/latest/docs/react/guides/important-defaults
     * @param {Object} options - The options for the query
     * @param {Array|string} options.queryKey - The key for the query
     * @param {Function} options.queryFn - The function to fetch data
     * @param {number} [options.staleTime=0] - The stale time for the query
     * @param {boolean} [options.refetchOnWindowFocus=true] - Whether to refetch on window focus
     * @param {boolean} [options.refetchOnMount=true] - Whether to refetch on mount
     * @param {boolean} [options.refetchOnReconnect=true] - Whether to refetch on network reconnect
     * @param {number} [options.refetchInterval=null] - The interval to refetch data
     * @param {number} [options.gcTime=1000 * 60 * 5] - The garbage collection time for the query
     * @param {number} [options.retry=3] - The number of retry attempts
     * @param {Function} [options.retryDelay=(attempt) => Math.pow(2, attempt) * 1000] - The delay before retrying a failed query
     * @returns {Proxy} A proxy that contains the state of the query
     */
    query({ queryKey, queryFn, staleTime = 0, refetchOnWindowFocus = true, refetchOnMount = true, refetchOnReconnect = true, refetchInterval = null, gcTime = 1e3 * 60 * 5, retry = 3, retryDelay = (attempt) => Math.pow(2, attempt) * 1e3 }) {
      const key = Array.isArray(queryKey) ? queryKey.map((k2) => typeof k2 === "object" ? JSON.stringify(k2) : k2).join(":") : queryKey;
      this._queryFunctions.set(key, queryFn);
      _trace("query", "Starting query with key:", key);
      const queryState = this._observable({
        data: null,
        status: "pending",
        fetchStatus: "idle",
        error: null,
        lastUpdated: QueryCache.has(key) ? QueryCache.get(key).lastUpdated : null
      }, key);
      const queryProxy = this._observableProxy(queryState);
      const fetchData = (attempt = 0) => __async(this, null, function* () {
        const now = Date.now();
        const cacheEntry = QueryCache.get(key);
        if (cacheEntry && now - cacheEntry.lastUpdated < staleTime) {
          _trace("fetchData (if)", "Using cached data for key:", key);
          queryState.update((state) => {
            state.data = cacheEntry.data;
            state.status = "success";
            state.fetchStatus = "idle";
          });
        } else {
          _trace("fetchData (else)", "Fetching data for key:", key);
          try {
            queryState.update((state) => {
              state.status = "pending";
              state.fetchStatus = "fetching";
            });
            const data = yield queryFn();
            QueryCache.set(key, { data, lastUpdated: now });
            queryState.update((state) => {
              state.data = data;
              state.status = "success";
              state.fetchStatus = "idle";
            });
          } catch (error) {
            _trace("fetchData (catch)", "Fetch error for key:", key, error);
            if (attempt < retry) {
              setTimeout(() => fetchData(attempt + 1), retryDelay(attempt));
            } else {
              queryState.update((state) => {
                state.error = { message: error.message };
                state.status = "error";
                state.fetchStatus = "idle";
              });
            }
          }
        }
      });
      if (refetchOnMount) {
        _trace("query", "Setting up refetch on mount for key:", key);
        fetchData();
      }
      if (refetchOnWindowFocus) {
        _trace("query", "Setting up refetch on window focus for key:", key);
        const refetchOnFocus = () => fetchData();
        window.addEventListener("focus", refetchOnFocus);
        this._unsubscribers.set(`focus:${key}`, () => window.removeEventListener("focus", refetchOnFocus));
      }
      if (refetchOnReconnect) {
        _trace("query", "Setting up refetch on reconnect for key:", key);
        window.addEventListener("online", fetchData);
        this._unsubscribers.set(`online:${key}`, () => window.removeEventListener("online", fetchData));
      }
      if (refetchInterval) {
        _trace("query", "Setting up refetch interval for key:", key);
        const intervalId = setInterval(fetchData, refetchInterval);
        this._unsubscribers.set(`interval:${key}`, () => clearInterval(intervalId));
      }
      const gcTimeout = setTimeout(() => {
        QueryCache.delete(key);
      }, gcTime);
      this._unsubscribers.set(`gc:${key}`, () => clearTimeout(gcTimeout));
      return queryProxy;
    }
    /**
     * @method
     * @description Performs a mutation and returns an observable proxy. This method is inspired by the TanStack Query mutate method: https://tanstack.com/query/latest/docs/react/guides/mutations
     * @param {Object} options - The options for the mutation
     * @param {Function} options.mutationFn - The function to perform the mutation
     * @param {Function} [options.onMutate] - The function to be called before the mutation is performed
     * @param {Function} [options.onError] - The function to be called if the mutation encounters an error
     * @param {Function} [options.onSuccess] - The function to be called if the mutation is successful
     * @param {Function} [options.onSettled] - The function to be called after the mutation has either succeeded or failed
     * @returns {Proxy} A proxy that contains the state of the mutation
     */
    mutation({ mutationFn, onMutate, onError, onSuccess, onSettled }) {
      const mutationState = this._observable({
        data: null,
        status: "idle",
        error: null,
        isSettled: false
      }, "mutation");
      const mutationProxy = this._observableProxy(mutationState);
      const performMutation = (variables) => __async(this, null, function* () {
        _trace("mutation", "Starting mutation for variables:", variables);
        let context;
        const previousState = mutationState.value;
        if (onMutate) {
          _trace("mutation", "Performing optimistic update for variables:", variables);
          context = onMutate(variables, previousState);
          mutationState.update((state) => {
            state.data = context.optimisticData;
            state.status = "pending";
            state.error = null;
          });
        } else {
          _trace("mutation", "Performing mutation without optimistic update for variables:", variables);
          mutationState.update((state) => {
            state.status = "pending";
            state.error = null;
          });
        }
        try {
          const data = yield mutationFn(variables);
          mutationState.update((state) => {
            state.data = data;
            state.status = "success";
          });
          if (onSuccess) {
            onSuccess(data, variables, context);
          }
          _trace("mutation", "Mutation successful for variables:", variables, data);
        } catch (error) {
          _trace("mutation", "Mutation error for variables:", variables, error);
          mutationState.update((state) => {
            state.error = { message: error.message };
            state.status = "error";
            if (!onError && context && context.rollback) {
              _trace("mutation", "Rolling back mutation for variables:", variables);
              context.rollback();
            }
          });
          if (onError) {
            onError(error, variables, context);
          }
        } finally {
          if (!mutationState.value.isSettled) {
            mutationState.update((state) => {
              state.isSettled = true;
            });
            if (onSettled) {
              _trace("mutation", "Calling onSettled for variables:", variables);
              onSettled(mutationState.value.data, mutationState.value.error, variables, context);
            }
          }
        }
      });
      mutationProxy.mutate = performMutation;
      mutationProxy.reset = () => {
        mutationState.update((state) => {
          state.data = null;
          state.status = "idle";
          state.error = null;
          state.isSettled = false;
        });
      };
      return mutationProxy;
    }
    /**
     * Invalidates the queries with the given key, causing them to refetch if needed.
     * @param {Array|string} queryKey - The key for the query to invalidate.
     * @returns {void}
     */
    invalidateQueries(queryKey) {
      const key = Array.isArray(queryKey) ? queryKey.join(":") : queryKey;
      _trace("invalidateQueries", "Invalidating query with key:", key);
      QueryCache.delete(key);
      this.refetchQuery(key);
    }
    /**
     * Refetches the data for the given query key.
     * @param {string} key - The key for the query to refetch.
     * @returns {void}
     */
    refetchQuery(key) {
      _trace("refetchQuery", "Refetching query with key:", key);
      const queryFn = this._queryFunctions.get(key);
      if (queryFn) {
        _trace("refetchQuery", "Found query function for key:", key);
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
          _trace("refetchQuery", "Refetch successful for key:", key, data);
        }).catch((error) => {
          if (previousState.data !== void 0) {
            _trace("refetchQuery", "Rolling back refetch for key:", key);
            QueryCache.set(key, previousState);
          }
          QueryCache.set(key, __spreadProps(__spreadValues({}, previousState), {
            status: "error",
            error
          }));
        }).finally(() => {
          this.query({ queryKey: key, queryFn });
          _trace("refetchQuery", "Refetch complete for key:", key);
        });
      }
    }
    /**
     * @method
     * @description Checks if the provided value is of an allowed type
     * @param {any} value - The value to check
     * @returns {boolean} True if the value is of an allowed type, false otherwise
     */
    _isAllowedType(value) {
      const allowedTypes = ["number", "string", "boolean", "object", "undefined"];
      const valueType = typeof value;
      if (valueType === "object") {
        return value === null || Array.isArray(value) || this._isPlainObject(value);
      }
      return allowedTypes.includes(valueType);
    }
    /**
     * @method
     * @description Checks if the provided value is a plain object
     * @param {any} value - The value to check
     * @returns {boolean} True if the value is a plain object, false otherwise
     */
    _isPlainObject(value) {
      if (Object.prototype.toString.call(value) !== "[object Object]") {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return prototype === null || prototype === Object.prototype;
    }
    /**
     * @method
     * @description Sets the properties of the object. If the property is an observable, it updates the observable with the new value
     * @param {Object} props - The properties to set
     * @returns {void}
     */
    setObservables(props) {
      Object.keys(props).forEach((key) => {
        if (this[key] instanceof Observable) {
          this[key].next(props[key]);
        }
      });
    }
    /**
     * @method
     * @description Registers an observable state to the list of unsubscribers
     * @param {ObservableState} observableState - The observable state to register
     * @returns {void}
     */
    _registerObservables(observableState) {
      if (!(observableState instanceof ObservableState)) {
        throw new TypeError("Expected observableState to be an instance of ObservableState");
      }
      this._unsubscribers.set(observableState, () => {
        if (typeof observableState.dispose === "function") {
          observableState.dispose();
        }
      });
    }
    /**
     * @method
     * @description Creates a computed observable state and registers it
     * @param {Function} computeFn - The function to compute the state
     * @returns {ObservableState} The computed observable state
     */
    computed(computeFn) {
      const observableState = super.computed(computeFn);
      this._registerObservables(observableState);
      return observableState;
    }
    /**
     * @method
     * @description Creates an effect and registers its dispose function
     * @param {Function} effectFn - The function to create the effect
     * @returns {void}
     */
    effect(effectFn) {
      const dispose = super.effect(effectFn);
      this._unsubscribers.set(effectFn, dispose);
    }
    /**
     * @method
     * @description Subscribes to a store and creates an observable for a specific key in the store
     * @param {Store} store - The store to subscribe to
     * @param {string} key - The key in the store to create an observable for
     * @returns {Observable|Proxy} The observable or a proxy for the observable
     */
    connect(store2, key) {
      if (!(store2 instanceof ObservableStore)) {
        throw new TypeError("Expected store to be an instance of ObservableStore");
      }
      const observable = this._observable(store2.state[key], key);
      const unsubscribe = store2.subscribe((newState) => {
        observable.update(() => newState[key]);
      });
      this._unsubscribers.set(key, unsubscribe);
      if (this._isObjectOrArray(observable.value)) {
        return this._observableProxy(observable);
      } else {
        return new Proxy(observable, {
          get: () => observable.value,
          set: (target, property, value) => {
            if (property === "value") {
              observable.update(() => value);
            } else {
              target[property] = value;
            }
            return true;
          }
        });
      }
    }
    /**
     * @method
     * Invoked when the custom element is appended into a document-connected element. Sets up initial state and triggers initial rendering.
     * @returns {void}
     */
    connectedCallback() {
      this._setup({ infer: true });
      this.effect(() => this._react());
      this.onConnect();
    }
    /**
     * @method
     * Invoked when the custom element is connected to the document's DOM.
     */
    onConnect() {
    }
    /**
     * @method
     * Invoked when the custom element is disconnected from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
      this.onDisconnect();
      this._unsubscribers.forEach((unsubscribe) => unsubscribe());
      this._effects.forEach(({ cleanup }) => cleanup && cleanup());
    }
    /**
     * @method
     * Invoked when the custom element is disconnected from the document's DOM.
     **/
    onDisconnect() {
    }
    /**
     * @method
     * Invoked when the custom element is moved to a new document.
     **/
    attributeChangedCallback(name, oldValue, newValue) {
      this.onAttributeChange(name, oldValue, newValue);
    }
    /**
     * @method
     * Invoked when the custom element is moved to a new document.
     **/
    onAttributeChange(name, oldValue, newValue) {
    }
    /**
     * @method
     * Invoked when the custom element is moved to a new document.
     **/
    adoptedCallback() {
      this.onAdopt();
    }
    /**
     * @method
     * Invoked when the custom element is moved to a new document.
     **/
    onAdopt() {
    }
    /**
     * @method
     * Creates an ObservableStream from a subscription function.
     * @param {Function} subscribeFn - The subscription function.
     * @returns {ObservableStream} An ObservableStream that emits values produced by the subscription function.
     */
    stream(subscribeFn) {
      return new ObservableStream(subscribeFn);
    }
    /**
     * @method
     * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
     * This also triggers all effects.
     * @returns {void}
     */
    _react() {
      const template = this.template();
      j(template, this);
      this._effects.forEach(({ effectFn }) => effectFn.call(this));
    }
    /**
     * @method
     * @throws {Error} If the method template() is not implemented
     * @returns {void}
     */
    template() {
      throw new Error("[Cami.js] You have to implement the method template()!");
    }
  };
  var store = (initialState) => new ObservableStore(initialState);
  var { debug, events } = _config;
  return __toCommonJS(cami_exports);
})();
/**
 * @license
 * Copyright (c) 2023 Kenn Costales
 * MIT License
 */
/*! Bundled license information:

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
