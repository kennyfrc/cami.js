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
  var __spreadValues = (a3, b3) => {
    for (var prop in b3 || (b3 = {}))
      if (__hasOwnProp.call(b3, prop))
        __defNormalProp(a3, prop, b3[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b3)) {
        if (__propIsEnum.call(b3, prop))
          __defNormalProp(a3, prop, b3[prop]);
      }
    return a3;
  };
  var __spreadProps = (a3, b3) => __defProps(a3, __getOwnPropDescs(b3));
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
        } catch (e5) {
          reject(e5);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e5) {
          reject(e5);
        }
      };
      var step = (x3) => x3.done ? resolve(x3.value) : Promise.resolve(x3.value).then(fulfilled, rejected);
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
    createIdbPromise: () => createIdbPromise,
    createLocalStorage: () => createLocalStorage,
    createURLStore: () => createURLStore,
    debug: () => debug,
    effect: () => effect,
    events: () => events,
    html: () => x,
    keyed: () => i3,
    persistToIdbThunk: () => persistToIdbThunk,
    persistToLocalStorageThunk: () => persistToLocalStorageThunk,
    repeat: () => c2,
    store: () => store,
    svg: () => b,
    unsafeHTML: () => o2,
    useValidationHook: () => useValidationHook,
    useValidationThunk: () => useValidationThunk
  });

  // ../../../../../../../node_modules/lit-html/lit-html.js
  var t = globalThis;
  var i = t.trustedTypes;
  var s = i ? i.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
  var e = "$lit$";
  var h = `lit$${(Math.random() + "").slice(9)}$`;
  var o = "?" + h;
  var n = `<${o}>`;
  var r = document;
  var l = () => r.createComment("");
  var c = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
  var a = Array.isArray;
  var u = (t5) => a(t5) || "function" == typeof (t5 == null ? void 0 : t5[Symbol.iterator]);
  var d = "[ 	\n\f\r]";
  var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var _ = />/g;
  var m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p = /'/g;
  var g = /"/g;
  var $ = /^(?:script|style|textarea|title)$/i;
  var y = (t5) => (i5, ...s4) => ({ _$litType$: t5, strings: i5, values: s4 });
  var x = y(1);
  var b = y(2);
  var w = Symbol.for("lit-noChange");
  var T = Symbol.for("lit-nothing");
  var A = /* @__PURE__ */ new WeakMap();
  var E = r.createTreeWalker(r, 129);
  function C(t5, i5) {
    if (!Array.isArray(t5) || !t5.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return void 0 !== s ? s.createHTML(i5) : i5;
  }
  var P = (t5, i5) => {
    const s4 = t5.length - 1, o4 = [];
    let r4, l3 = 2 === i5 ? "<svg>" : "", c4 = f;
    for (let i6 = 0; i6 < s4; i6++) {
      const s5 = t5[i6];
      let a3, u5, d3 = -1, y3 = 0;
      for (; y3 < s5.length && (c4.lastIndex = y3, u5 = c4.exec(s5), null !== u5); )
        y3 = c4.lastIndex, c4 === f ? "!--" === u5[1] ? c4 = v : void 0 !== u5[1] ? c4 = _ : void 0 !== u5[2] ? ($.test(u5[2]) && (r4 = RegExp("</" + u5[2], "g")), c4 = m) : void 0 !== u5[3] && (c4 = m) : c4 === m ? ">" === u5[0] ? (c4 = r4 != null ? r4 : f, d3 = -1) : void 0 === u5[1] ? d3 = -2 : (d3 = c4.lastIndex - u5[2].length, a3 = u5[1], c4 = void 0 === u5[3] ? m : '"' === u5[3] ? g : p) : c4 === g || c4 === p ? c4 = m : c4 === v || c4 === _ ? c4 = f : (c4 = m, r4 = void 0);
      const x3 = c4 === m && t5[i6 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === f ? s5 + n : d3 >= 0 ? (o4.push(a3), s5.slice(0, d3) + e + s5.slice(d3) + h + x3) : s5 + h + (-2 === d3 ? i6 : x3);
    }
    return [C(t5, l3 + (t5[s4] || "<?>") + (2 === i5 ? "</svg>" : "")), o4];
  };
  var V = class _V {
    constructor({ strings: t5, _$litType$: s4 }, n3) {
      let r4;
      this.parts = [];
      let c4 = 0, a3 = 0;
      const u5 = t5.length - 1, d3 = this.parts, [f3, v4] = P(t5, s4);
      if (this.el = _V.createElement(f3, n3), E.currentNode = this.el.content, 2 === s4) {
        const t6 = this.el.content.firstChild;
        t6.replaceWith(...t6.childNodes);
      }
      for (; null !== (r4 = E.nextNode()) && d3.length < u5; ) {
        if (1 === r4.nodeType) {
          if (r4.hasAttributes())
            for (const t6 of r4.getAttributeNames())
              if (t6.endsWith(e)) {
                const i5 = v4[a3++], s5 = r4.getAttribute(t6).split(h), e5 = /([.?@])?(.*)/.exec(i5);
                d3.push({ type: 1, index: c4, name: e5[2], strings: s5, ctor: "." === e5[1] ? k : "?" === e5[1] ? H : "@" === e5[1] ? I : R }), r4.removeAttribute(t6);
              } else
                t6.startsWith(h) && (d3.push({ type: 6, index: c4 }), r4.removeAttribute(t6));
          if ($.test(r4.tagName)) {
            const t6 = r4.textContent.split(h), s5 = t6.length - 1;
            if (s5 > 0) {
              r4.textContent = i ? i.emptyScript : "";
              for (let i5 = 0; i5 < s5; i5++)
                r4.append(t6[i5], l()), E.nextNode(), d3.push({ type: 2, index: ++c4 });
              r4.append(t6[s5], l());
            }
          }
        } else if (8 === r4.nodeType)
          if (r4.data === o)
            d3.push({ type: 2, index: c4 });
          else {
            let t6 = -1;
            for (; -1 !== (t6 = r4.data.indexOf(h, t6 + 1)); )
              d3.push({ type: 7, index: c4 }), t6 += h.length - 1;
          }
        c4++;
      }
    }
    static createElement(t5, i5) {
      const s4 = r.createElement("template");
      return s4.innerHTML = t5, s4;
    }
  };
  function N(t5, i5, s4 = t5, e5) {
    var _a3, _b, _c;
    if (i5 === w)
      return i5;
    let h4 = void 0 !== e5 ? (_a3 = s4._$Co) == null ? void 0 : _a3[e5] : s4._$Cl;
    const o4 = c(i5) ? void 0 : i5._$litDirective$;
    return (h4 == null ? void 0 : h4.constructor) !== o4 && ((_b = h4 == null ? void 0 : h4._$AO) == null ? void 0 : _b.call(h4, false), void 0 === o4 ? h4 = void 0 : (h4 = new o4(t5), h4._$AT(t5, s4, e5)), void 0 !== e5 ? ((_c = s4._$Co) != null ? _c : s4._$Co = [])[e5] = h4 : s4._$Cl = h4), void 0 !== h4 && (i5 = N(t5, h4._$AS(t5, i5.values), h4, e5)), i5;
  }
  var S = class {
    constructor(t5, i5) {
      this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i5;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t5) {
      var _a3;
      const { el: { content: i5 }, parts: s4 } = this._$AD, e5 = ((_a3 = t5 == null ? void 0 : t5.creationScope) != null ? _a3 : r).importNode(i5, true);
      E.currentNode = e5;
      let h4 = E.nextNode(), o4 = 0, n3 = 0, l3 = s4[0];
      for (; void 0 !== l3; ) {
        if (o4 === l3.index) {
          let i6;
          2 === l3.type ? i6 = new M(h4, h4.nextSibling, this, t5) : 1 === l3.type ? i6 = new l3.ctor(h4, l3.name, l3.strings, this, t5) : 6 === l3.type && (i6 = new L(h4, this, t5)), this._$AV.push(i6), l3 = s4[++n3];
        }
        o4 !== (l3 == null ? void 0 : l3.index) && (h4 = E.nextNode(), o4++);
      }
      return E.currentNode = r, e5;
    }
    p(t5) {
      let i5 = 0;
      for (const s4 of this._$AV)
        void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t5, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t5[i5])), i5++;
    }
  };
  var M = class _M {
    get _$AU() {
      var _a3, _b;
      return (_b = (_a3 = this._$AM) == null ? void 0 : _a3._$AU) != null ? _b : this._$Cv;
    }
    constructor(t5, i5, s4, e5) {
      var _a3;
      this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t5, this._$AB = i5, this._$AM = s4, this.options = e5, this._$Cv = (_a3 = e5 == null ? void 0 : e5.isConnected) != null ? _a3 : true;
    }
    get parentNode() {
      let t5 = this._$AA.parentNode;
      const i5 = this._$AM;
      return void 0 !== i5 && 11 === (t5 == null ? void 0 : t5.nodeType) && (t5 = i5.parentNode), t5;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t5, i5 = this) {
      t5 = N(this, t5, i5), c(t5) ? t5 === T || null == t5 || "" === t5 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t5 !== this._$AH && t5 !== w && this._(t5) : void 0 !== t5._$litType$ ? this.g(t5) : void 0 !== t5.nodeType ? this.$(t5) : u(t5) ? this.T(t5) : this._(t5);
    }
    k(t5) {
      return this._$AA.parentNode.insertBefore(t5, this._$AB);
    }
    $(t5) {
      this._$AH !== t5 && (this._$AR(), this._$AH = this.k(t5));
    }
    _(t5) {
      this._$AH !== T && c(this._$AH) ? this._$AA.nextSibling.data = t5 : this.$(r.createTextNode(t5)), this._$AH = t5;
    }
    g(t5) {
      var _a3;
      const { values: i5, _$litType$: s4 } = t5, e5 = "number" == typeof s4 ? this._$AC(t5) : (void 0 === s4.el && (s4.el = V.createElement(C(s4.h, s4.h[0]), this.options)), s4);
      if (((_a3 = this._$AH) == null ? void 0 : _a3._$AD) === e5)
        this._$AH.p(i5);
      else {
        const t6 = new S(e5, this), s5 = t6.u(this.options);
        t6.p(i5), this.$(s5), this._$AH = t6;
      }
    }
    _$AC(t5) {
      let i5 = A.get(t5.strings);
      return void 0 === i5 && A.set(t5.strings, i5 = new V(t5)), i5;
    }
    T(t5) {
      a(this._$AH) || (this._$AH = [], this._$AR());
      const i5 = this._$AH;
      let s4, e5 = 0;
      for (const h4 of t5)
        e5 === i5.length ? i5.push(s4 = new _M(this.k(l()), this.k(l()), this, this.options)) : s4 = i5[e5], s4._$AI(h4), e5++;
      e5 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i5.length = e5);
    }
    _$AR(t5 = this._$AA.nextSibling, i5) {
      var _a3;
      for ((_a3 = this._$AP) == null ? void 0 : _a3.call(this, false, true, i5); t5 && t5 !== this._$AB; ) {
        const i6 = t5.nextSibling;
        t5.remove(), t5 = i6;
      }
    }
    setConnected(t5) {
      var _a3;
      void 0 === this._$AM && (this._$Cv = t5, (_a3 = this._$AP) == null ? void 0 : _a3.call(this, t5));
    }
  };
  var R = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t5, i5, s4, e5, h4) {
      this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t5, this.name = i5, this._$AM = e5, this.options = h4, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = T;
    }
    _$AI(t5, i5 = this, s4, e5) {
      const h4 = this.strings;
      let o4 = false;
      if (void 0 === h4)
        t5 = N(this, t5, i5, 0), o4 = !c(t5) || t5 !== this._$AH && t5 !== w, o4 && (this._$AH = t5);
      else {
        const e6 = t5;
        let n3, r4;
        for (t5 = h4[0], n3 = 0; n3 < h4.length - 1; n3++)
          r4 = N(this, e6[s4 + n3], i5, n3), r4 === w && (r4 = this._$AH[n3]), o4 || (o4 = !c(r4) || r4 !== this._$AH[n3]), r4 === T ? t5 = T : t5 !== T && (t5 += (r4 != null ? r4 : "") + h4[n3 + 1]), this._$AH[n3] = r4;
      }
      o4 && !e5 && this.j(t5);
    }
    j(t5) {
      t5 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 != null ? t5 : "");
    }
  };
  var k = class extends R {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t5) {
      this.element[this.name] = t5 === T ? void 0 : t5;
    }
  };
  var H = class extends R {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t5) {
      this.element.toggleAttribute(this.name, !!t5 && t5 !== T);
    }
  };
  var I = class extends R {
    constructor(t5, i5, s4, e5, h4) {
      super(t5, i5, s4, e5, h4), this.type = 5;
    }
    _$AI(t5, i5 = this) {
      var _a3;
      if ((t5 = (_a3 = N(this, t5, i5, 0)) != null ? _a3 : T) === w)
        return;
      const s4 = this._$AH, e5 = t5 === T && s4 !== T || t5.capture !== s4.capture || t5.once !== s4.once || t5.passive !== s4.passive, h4 = t5 !== T && (s4 === T || e5);
      e5 && this.element.removeEventListener(this.name, this, s4), h4 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
    }
    handleEvent(t5) {
      var _a3, _b;
      "function" == typeof this._$AH ? this._$AH.call((_b = (_a3 = this.options) == null ? void 0 : _a3.host) != null ? _b : this.element, t5) : this._$AH.handleEvent(t5);
    }
  };
  var L = class {
    constructor(t5, i5, s4) {
      this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t5) {
      N(this, t5);
    }
  };
  var z = { S: e, A: h, P: o, C: 1, M: P, L: S, R: u, V: N, D: M, I: R, H, N: I, U: k, B: L };
  var Z = t.litHtmlPolyfillSupport;
  var _a;
  Z == null ? void 0 : Z(V, M), ((_a = t.litHtmlVersions) != null ? _a : t.litHtmlVersions = []).push("3.0.0");

  // ../../../../../../../node_modules/lit-html/directive.js
  var t2 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
  var e2 = (t5) => (...e5) => ({ _$litDirective$: t5, values: e5 });
  var i2 = class {
    constructor(t5) {
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t5, e5, i5) {
      this._$Ct = t5, this._$AM = e5, this._$Ci = i5;
    }
    _$AS(t5, e5) {
      return this.update(t5, e5);
    }
    update(t5, e5) {
      return this.render(...e5);
    }
  };

  // ../../../../../../../node_modules/lit-html/directives/unsafe-html.js
  var e3 = class extends i2 {
    constructor(i5) {
      if (super(i5), this.et = T, i5.type !== t2.CHILD)
        throw Error(this.constructor.directiveName + "() can only be used in child bindings");
    }
    render(r4) {
      if (r4 === T || null == r4)
        return this.vt = void 0, this.et = r4;
      if (r4 === w)
        return r4;
      if ("string" != typeof r4)
        throw Error(this.constructor.directiveName + "() called with a non-string value");
      if (r4 === this.et)
        return this.vt;
      this.et = r4;
      const s4 = [r4];
      return s4.raw = s4, this.vt = { _$litType$: this.constructor.resultType, strings: s4, values: [] };
    }
  };
  e3.directiveName = "unsafeHTML", e3.resultType = 1;
  var o2 = e2(e3);

  // ../../../../../../../node_modules/lit-html/directive-helpers.js
  var { D: t3 } = z;
  var s2 = () => document.createComment("");
  var r2 = (o4, i5, n3) => {
    var _a3;
    const e5 = o4._$AA.parentNode, l3 = void 0 === i5 ? o4._$AB : i5._$AA;
    if (void 0 === n3) {
      const i6 = e5.insertBefore(s2(), l3), c4 = e5.insertBefore(s2(), l3);
      n3 = new t3(i6, c4, o4, o4.options);
    } else {
      const t5 = n3._$AB.nextSibling, i6 = n3._$AM, c4 = i6 !== o4;
      if (c4) {
        let t6;
        (_a3 = n3._$AQ) == null ? void 0 : _a3.call(n3, o4), n3._$AM = o4, void 0 !== n3._$AP && (t6 = o4._$AU) !== i6._$AU && n3._$AP(t6);
      }
      if (t5 !== l3 || c4) {
        let o5 = n3._$AA;
        for (; o5 !== t5; ) {
          const t6 = o5.nextSibling;
          e5.insertBefore(o5, l3), o5 = t6;
        }
      }
    }
    return n3;
  };
  var v2 = (o4, t5, i5 = o4) => (o4._$AI(t5, i5), o4);
  var u2 = {};
  var m2 = (o4, t5 = u2) => o4._$AH = t5;
  var p2 = (o4) => o4._$AH;
  var h2 = (o4) => {
    var _a3;
    (_a3 = o4._$AP) == null ? void 0 : _a3.call(o4, false, true);
    let t5 = o4._$AA;
    const i5 = o4._$AB.nextSibling;
    for (; t5 !== i5; ) {
      const o5 = t5.nextSibling;
      t5.remove(), t5 = o5;
    }
  };

  // ../../../../../../../node_modules/lit-html/directives/keyed.js
  var i3 = e2(class extends i2 {
    constructor() {
      super(...arguments), this.key = T;
    }
    render(r4, t5) {
      return this.key = r4, t5;
    }
    update(r4, [t5, e5]) {
      return t5 !== this.key && (m2(r4), this.key = t5), e5;
    }
  });

  // ../../../../../../../node_modules/lit-html/directives/repeat.js
  var u3 = (e5, s4, t5) => {
    const r4 = /* @__PURE__ */ new Map();
    for (let l3 = s4; l3 <= t5; l3++)
      r4.set(e5[l3], l3);
    return r4;
  };
  var c2 = e2(class extends i2 {
    constructor(e5) {
      if (super(e5), e5.type !== t2.CHILD)
        throw Error("repeat() can only be used in text expressions");
    }
    ht(e5, s4, t5) {
      let r4;
      void 0 === t5 ? t5 = s4 : void 0 !== s4 && (r4 = s4);
      const l3 = [], o4 = [];
      let i5 = 0;
      for (const s5 of e5)
        l3[i5] = r4 ? r4(s5, i5) : i5, o4[i5] = t5(s5, i5), i5++;
      return { values: o4, keys: l3 };
    }
    render(e5, s4, t5) {
      return this.ht(e5, s4, t5).values;
    }
    update(s4, [t5, r4, c4]) {
      var _a3;
      const d3 = p2(s4), { values: p4, keys: a3 } = this.ht(t5, r4, c4);
      if (!Array.isArray(d3))
        return this.dt = a3, p4;
      const h4 = (_a3 = this.dt) != null ? _a3 : this.dt = [], v4 = [];
      let m4, y3, x3 = 0, j2 = d3.length - 1, k3 = 0, w3 = p4.length - 1;
      for (; x3 <= j2 && k3 <= w3; )
        if (null === d3[x3])
          x3++;
        else if (null === d3[j2])
          j2--;
        else if (h4[x3] === a3[k3])
          v4[k3] = v2(d3[x3], p4[k3]), x3++, k3++;
        else if (h4[j2] === a3[w3])
          v4[w3] = v2(d3[j2], p4[w3]), j2--, w3--;
        else if (h4[x3] === a3[w3])
          v4[w3] = v2(d3[x3], p4[w3]), r2(s4, v4[w3 + 1], d3[x3]), x3++, w3--;
        else if (h4[j2] === a3[k3])
          v4[k3] = v2(d3[j2], p4[k3]), r2(s4, d3[x3], d3[j2]), j2--, k3++;
        else if (void 0 === m4 && (m4 = u3(a3, k3, w3), y3 = u3(h4, x3, j2)), m4.has(h4[x3]))
          if (m4.has(h4[j2])) {
            const e5 = y3.get(a3[k3]), t6 = void 0 !== e5 ? d3[e5] : null;
            if (null === t6) {
              const e6 = r2(s4, d3[x3]);
              v2(e6, p4[k3]), v4[k3] = e6;
            } else
              v4[k3] = v2(t6, p4[k3]), r2(s4, d3[x3], t6), d3[e5] = null;
            k3++;
          } else
            h2(d3[j2]), j2--;
        else
          h2(d3[x3]), x3++;
      for (; k3 <= w3; ) {
        const e5 = r2(s4, v4[w3 + 1]);
        v2(e5, p4[k3]), v4[k3++] = e5;
      }
      for (; x3 <= j2; ) {
        const e5 = d3[x3++];
        null !== e5 && h2(e5);
      }
      return this.dt = a3, m2(s4, v4), w;
    }
  });

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
      const e5 = errors[error];
      const msg = typeof e5 === "function" ? e5.apply(null, args) : e5;
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
    var _a3;
    if (!value)
      return false;
    return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_a3 = value.constructor) == null ? void 0 : _a3[DRAFTABLE]) || isMap(value) || isSet(value);
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
    const t5 = getArchtype(thing);
    if (t5 === 2)
      thing.set(propOrOldValue, value);
    else if (t5 === 3) {
      thing.add(value);
    } else
      thing[propOrOldValue] = value;
  }
  function is(x3, y3) {
    if (x3 === y3) {
      return x3 !== 0 || 1 / x3 === 1 / y3;
    } else {
      return x3 !== x3 && y3 !== y3;
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
      for (let i5 = 0; i5 < keys.length; i5++) {
        const key = keys[i5];
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
    var _a3;
    const desc = getDescriptorFromProto(source, prop);
    return desc ? `value` in desc ? desc.value : (
      // This is a very special case, if the prop is a getter defined by the
      // prototype, we should invoke it with the draft as context!
      (_a3 = desc.get) == null ? void 0 : _a3.call(state.draft_)
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
            const p4 = [];
            const ip = [];
            getPlugin("Patches").generateReplacementPatches_(base, result, p4, ip);
            patchListener(p4, ip);
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
        const result = this.produce(base, recipe, (p4, ip) => {
          patches = p4;
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
      let i5;
      for (i5 = patches.length - 1; i5 >= 0; i5--) {
        const patch = patches[i5];
        if (patch.path.length === 0 && patch.op === "replace") {
          base = patch.value;
          break;
        }
      }
      if (i5 > -1) {
        patches = patches.slice(i5 + 1);
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
      for (let i5 = 0; i5 < base_.length; i5++) {
        if (assigned_[i5] && copy_[i5] !== base_[i5]) {
          const path = basePath.concat([i5]);
          patches.push({
            op: REPLACE,
            path,
            // Need to maybe clone it, as it can in fact be the original value
            // due to the base/copy inversion at the start of this function
            value: clonePatchValueIfNeeded(copy_[i5])
          });
          inversePatches.push({
            op: REPLACE,
            path,
            value: clonePatchValueIfNeeded(base_[i5])
          });
        }
      }
      for (let i5 = base_.length; i5 < copy_.length; i5++) {
        const path = basePath.concat([i5]);
        patches.push({
          op: ADD,
          path,
          // Need to maybe clone it, as it can in fact be the original value
          // due to the base/copy inversion at the start of this function
          value: clonePatchValueIfNeeded(copy_[i5])
        });
      }
      for (let i5 = copy_.length - 1; base_.length <= i5; --i5) {
        const path = basePath.concat([i5]);
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
      let i5 = 0;
      base_.forEach((value) => {
        if (!copy_.has(value)) {
          const path = basePath.concat([i5]);
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
        i5++;
      });
      i5 = 0;
      copy_.forEach((value) => {
        if (!base_.has(value)) {
          const path = basePath.concat([i5]);
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
        i5++;
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
        for (let i5 = 0; i5 < path.length - 1; i5++) {
          const parentType = getArchtype(base);
          let p4 = path[i5];
          if (typeof p4 !== "string" && typeof p4 !== "number") {
            p4 = "" + p4;
          }
          if ((parentType === 0 || parentType === 1) && (p4 === "__proto__" || p4 === "constructor"))
            die(errorOffset + 3);
          if (typeof base === "function" && p4 === "prototype")
            die(errorOffset + 3);
          base = get(base, p4);
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
          Array.from(obj.entries()).map(([k3, v4]) => [k3, deepClonePatchValue(v4)])
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
  function enableMapSet() {
    class DraftMap extends Map {
      constructor(target, parent) {
        super();
        this[DRAFT_STATE] = {
          type_: 2,
          parent_: parent,
          scope_: parent ? parent.scope_ : getCurrentScope(),
          modified_: false,
          finalized_: false,
          copy_: void 0,
          assigned_: void 0,
          base_: target,
          draft_: this,
          isManual_: false,
          revoked_: false
        };
      }
      get size() {
        return latest(this[DRAFT_STATE]).size;
      }
      has(key) {
        return latest(this[DRAFT_STATE]).has(key);
      }
      set(key, value) {
        const state = this[DRAFT_STATE];
        assertUnrevoked(state);
        if (!latest(state).has(key) || latest(state).get(key) !== value) {
          prepareMapCopy(state);
          markChanged(state);
          state.assigned_.set(key, true);
          state.copy_.set(key, value);
          state.assigned_.set(key, true);
        }
        return this;
      }
      delete(key) {
        if (!this.has(key)) {
          return false;
        }
        const state = this[DRAFT_STATE];
        assertUnrevoked(state);
        prepareMapCopy(state);
        markChanged(state);
        if (state.base_.has(key)) {
          state.assigned_.set(key, false);
        } else {
          state.assigned_.delete(key);
        }
        state.copy_.delete(key);
        return true;
      }
      clear() {
        const state = this[DRAFT_STATE];
        assertUnrevoked(state);
        if (latest(state).size) {
          prepareMapCopy(state);
          markChanged(state);
          state.assigned_ = /* @__PURE__ */ new Map();
          each(state.base_, (key) => {
            state.assigned_.set(key, false);
          });
          state.copy_.clear();
        }
      }
      forEach(cb, thisArg) {
        const state = this[DRAFT_STATE];
        latest(state).forEach((_value, key, _map) => {
          cb.call(thisArg, this.get(key), key, this);
        });
      }
      get(key) {
        const state = this[DRAFT_STATE];
        assertUnrevoked(state);
        const value = latest(state).get(key);
        if (state.finalized_ || !isDraftable(value)) {
          return value;
        }
        if (value !== state.base_.get(key)) {
          return value;
        }
        const draft = createProxy(value, state);
        prepareMapCopy(state);
        state.copy_.set(key, draft);
        return draft;
      }
      keys() {
        return latest(this[DRAFT_STATE]).keys();
      }
      values() {
        const iterator = this.keys();
        return {
          [Symbol.iterator]: () => this.values(),
          next: () => {
            const r4 = iterator.next();
            if (r4.done)
              return r4;
            const value = this.get(r4.value);
            return {
              done: false,
              value
            };
          }
        };
      }
      entries() {
        const iterator = this.keys();
        return {
          [Symbol.iterator]: () => this.entries(),
          next: () => {
            const r4 = iterator.next();
            if (r4.done)
              return r4;
            const value = this.get(r4.value);
            return {
              done: false,
              value: [r4.value, value]
            };
          }
        };
      }
      [(DRAFT_STATE, Symbol.iterator)]() {
        return this.entries();
      }
    }
    function proxyMap_(target, parent) {
      return new DraftMap(target, parent);
    }
    function prepareMapCopy(state) {
      if (!state.copy_) {
        state.assigned_ = /* @__PURE__ */ new Map();
        state.copy_ = new Map(state.base_);
      }
    }
    class DraftSet extends Set {
      constructor(target, parent) {
        super();
        this[DRAFT_STATE] = {
          type_: 3,
          parent_: parent,
          scope_: parent ? parent.scope_ : getCurrentScope(),
          modified_: false,
          finalized_: false,
          copy_: void 0,
          base_: target,
          draft_: this,
          drafts_: /* @__PURE__ */ new Map(),
          revoked_: false,
          isManual_: false
        };
      }
      get size() {
        return latest(this[DRAFT_STATE]).size;
      }
      has(value) {
        const state = this[DRAFT_STATE];
        assertUnrevoked(state);
        if (!state.copy_) {
          return state.base_.has(value);
        }
        if (state.copy_.has(value))
          return true;
        if (state.drafts_.has(value) && state.copy_.has(state.drafts_.get(value)))
          return true;
        return false;
      }
      add(value) {
        const state = this[DRAFT_STATE];
        assertUnrevoked(state);
        if (!this.has(value)) {
          prepareSetCopy(state);
          markChanged(state);
          state.copy_.add(value);
        }
        return this;
      }
      delete(value) {
        if (!this.has(value)) {
          return false;
        }
        const state = this[DRAFT_STATE];
        assertUnrevoked(state);
        prepareSetCopy(state);
        markChanged(state);
        return state.copy_.delete(value) || (state.drafts_.has(value) ? state.copy_.delete(state.drafts_.get(value)) : (
          /* istanbul ignore next */
          false
        ));
      }
      clear() {
        const state = this[DRAFT_STATE];
        assertUnrevoked(state);
        if (latest(state).size) {
          prepareSetCopy(state);
          markChanged(state);
          state.copy_.clear();
        }
      }
      values() {
        const state = this[DRAFT_STATE];
        assertUnrevoked(state);
        prepareSetCopy(state);
        return state.copy_.values();
      }
      entries() {
        const state = this[DRAFT_STATE];
        assertUnrevoked(state);
        prepareSetCopy(state);
        return state.copy_.entries();
      }
      keys() {
        return this.values();
      }
      [(DRAFT_STATE, Symbol.iterator)]() {
        return this.values();
      }
      forEach(cb, thisArg) {
        const iterator = this.values();
        let result = iterator.next();
        while (!result.done) {
          cb.call(thisArg, result.value, result.value, this);
          result = iterator.next();
        }
      }
    }
    function proxySet_(target, parent) {
      return new DraftSet(target, parent);
    }
    function prepareSetCopy(state) {
      if (!state.copy_) {
        state.copy_ = /* @__PURE__ */ new Set();
        state.base_.forEach((value) => {
          if (isDraftable(value)) {
            const draft = createProxy(value, state);
            state.drafts_.set(value, draft);
            state.copy_.add(draft);
          } else {
            state.copy_.add(value);
          }
        });
      }
    }
    function assertUnrevoked(state) {
      if (state.revoked_)
        die(3, JSON.stringify(latest(state)));
    }
    loadPlugin("MapSet", { proxyMap_, proxySet_ });
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

  // src/html.js
  var t4 = globalThis;
  var i4 = t4.trustedTypes;
  var s3 = i4 ? i4.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
  var e4 = "$lit$";
  var h3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var o3 = "?" + h3;
  var n2 = `<${o3}>`;
  var r3 = document;
  var l2 = () => r3.createComment("");
  var c3 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
  var a2 = Array.isArray;
  var u4 = (t5) => a2(t5) || "function" == typeof (t5 == null ? void 0 : t5[Symbol.iterator]);
  var d2 = "[ 	\n\f\r]";
  var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v3 = /-->/g;
  var _2 = />/g;
  var m3 = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p3 = /'/g;
  var g2 = /"/g;
  var $2 = /^(?:script|style|textarea|title)$/i;
  var y2 = (t5) => (i5, ...s4) => ({ _$litType$: t5, strings: i5, values: s4 });
  var x2 = y2(1);
  var b2 = y2(2);
  var w2 = y2(3);
  var T2 = Symbol.for("lit-noChange");
  var E2 = Symbol.for("lit-nothing");
  var A2 = /* @__PURE__ */ new WeakMap();
  var C2 = r3.createTreeWalker(r3, 129);
  function P2(t5, i5) {
    if (!a2(t5) || !t5.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return void 0 !== s3 ? s3.createHTML(i5) : i5;
  }
  var V2 = (t5, i5) => {
    const s4 = t5.length - 1, o4 = [];
    let r4, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = f2;
    for (let i6 = 0; i6 < s4; i6++) {
      const s5 = t5[i6];
      let a3, u5, d3 = -1, y3 = 0;
      for (; y3 < s5.length && (c4.lastIndex = y3, u5 = c4.exec(s5), null !== u5); )
        y3 = c4.lastIndex, c4 === f2 ? "!--" === u5[1] ? c4 = v3 : void 0 !== u5[1] ? c4 = _2 : void 0 !== u5[2] ? ($2.test(u5[2]) && (r4 = RegExp("</" + u5[2], "g")), c4 = m3) : void 0 !== u5[3] && (c4 = m3) : c4 === m3 ? ">" === u5[0] ? (c4 = r4 != null ? r4 : f2, d3 = -1) : void 0 === u5[1] ? d3 = -2 : (d3 = c4.lastIndex - u5[2].length, a3 = u5[1], c4 = void 0 === u5[3] ? m3 : '"' === u5[3] ? g2 : p3) : c4 === g2 || c4 === p3 ? c4 = m3 : c4 === v3 || c4 === _2 ? c4 = f2 : (c4 = m3, r4 = void 0);
      const x3 = c4 === m3 && t5[i6 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === f2 ? s5 + n2 : d3 >= 0 ? (o4.push(a3), s5.slice(0, d3) + e4 + s5.slice(d3) + h3 + x3) : s5 + h3 + (-2 === d3 ? i6 : x3);
    }
    return [P2(t5, l3 + (t5[s4] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), o4];
  };
  var N2 = class _N {
    constructor({ strings: t5, _$litType$: s4 }, n3) {
      let r4;
      this.parts = [];
      let c4 = 0, a3 = 0;
      const u5 = t5.length - 1, d3 = this.parts, [f3, v4] = V2(t5, s4);
      if (this.el = _N.createElement(f3, n3), C2.currentNode = this.el.content, 2 === s4 || 3 === s4) {
        const t6 = this.el.content.firstChild;
        t6.replaceWith(...t6.childNodes);
      }
      for (; null !== (r4 = C2.nextNode()) && d3.length < u5; ) {
        if (1 === r4.nodeType) {
          if (r4.hasAttributes())
            for (const t6 of r4.getAttributeNames())
              if (t6.endsWith(e4)) {
                const i5 = v4[a3++], s5 = r4.getAttribute(t6).split(h3), e5 = /([.?@])?(.*)/.exec(i5);
                d3.push({ type: 1, index: c4, name: e5[2], strings: s5, ctor: "." === e5[1] ? H2 : "?" === e5[1] ? I2 : "@" === e5[1] ? L2 : k2 }), r4.removeAttribute(t6);
              } else
                t6.startsWith(h3) && (d3.push({ type: 6, index: c4 }), r4.removeAttribute(t6));
          if ($2.test(r4.tagName)) {
            const t6 = r4.textContent.split(h3), s5 = t6.length - 1;
            if (s5 > 0) {
              r4.textContent = i4 ? i4.emptyScript : "";
              for (let i5 = 0; i5 < s5; i5++)
                r4.append(t6[i5], l2()), C2.nextNode(), d3.push({ type: 2, index: ++c4 });
              r4.append(t6[s5], l2());
            }
          }
        } else if (8 === r4.nodeType)
          if (r4.data === o3)
            d3.push({ type: 2, index: c4 });
          else {
            let t6 = -1;
            for (; -1 !== (t6 = r4.data.indexOf(h3, t6 + 1)); )
              d3.push({ type: 7, index: c4 }), t6 += h3.length - 1;
          }
        c4++;
      }
    }
    static createElement(t5, i5) {
      const s4 = r3.createElement("template");
      return s4.innerHTML = t5, s4;
    }
  };
  function S2(t5, i5, s4 = t5, e5) {
    var _a3, _b, _c;
    if (i5 === T2)
      return i5;
    let h4 = void 0 !== e5 ? (_a3 = s4._$Co) == null ? void 0 : _a3[e5] : s4._$Cl;
    const o4 = c3(i5) ? void 0 : i5._$litDirective$;
    return (h4 == null ? void 0 : h4.constructor) !== o4 && ((_b = h4 == null ? void 0 : h4._$AO) == null ? void 0 : _b.call(h4, false), void 0 === o4 ? h4 = void 0 : (h4 = new o4(t5), h4._$AT(t5, s4, e5)), void 0 !== e5 ? ((_c = s4._$Co) != null ? _c : s4._$Co = [])[e5] = h4 : s4._$Cl = h4), void 0 !== h4 && (i5 = S2(t5, h4._$AS(t5, i5.values), h4, e5)), i5;
  }
  var M2 = class {
    constructor(t5, i5) {
      this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i5;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t5) {
      var _a3;
      const { el: { content: i5 }, parts: s4 } = this._$AD, e5 = ((_a3 = t5 == null ? void 0 : t5.creationScope) != null ? _a3 : r3).importNode(i5, true);
      C2.currentNode = e5;
      let h4 = C2.nextNode(), o4 = 0, n3 = 0, l3 = s4[0];
      for (; void 0 !== l3; ) {
        if (o4 === l3.index) {
          let i6;
          2 === l3.type ? i6 = new R2(h4, h4.nextSibling, this, t5) : 1 === l3.type ? i6 = new l3.ctor(h4, l3.name, l3.strings, this, t5) : 6 === l3.type && (i6 = new z2(h4, this, t5)), this._$AV.push(i6), l3 = s4[++n3];
        }
        o4 !== (l3 == null ? void 0 : l3.index) && (h4 = C2.nextNode(), o4++);
      }
      return C2.currentNode = r3, e5;
    }
    p(t5) {
      let i5 = 0;
      for (const s4 of this._$AV)
        void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t5, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t5[i5])), i5++;
    }
  };
  var R2 = class _R {
    get _$AU() {
      var _a3, _b;
      return (_b = (_a3 = this._$AM) == null ? void 0 : _a3._$AU) != null ? _b : this._$Cv;
    }
    constructor(t5, i5, s4, e5) {
      var _a3;
      this.type = 2, this._$AH = E2, this._$AN = void 0, this._$AA = t5, this._$AB = i5, this._$AM = s4, this.options = e5, this._$Cv = (_a3 = e5 == null ? void 0 : e5.isConnected) != null ? _a3 : true;
    }
    get parentNode() {
      let t5 = this._$AA.parentNode;
      const i5 = this._$AM;
      return void 0 !== i5 && 11 === (t5 == null ? void 0 : t5.nodeType) && (t5 = i5.parentNode), t5;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t5, i5 = this) {
      t5 = S2(this, t5, i5), c3(t5) ? t5 === E2 || null == t5 || "" === t5 ? (this._$AH !== E2 && this._$AR(), this._$AH = E2) : t5 !== this._$AH && t5 !== T2 && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : u4(t5) ? this.k(t5) : this._(t5);
    }
    O(t5) {
      return this._$AA.parentNode.insertBefore(t5, this._$AB);
    }
    T(t5) {
      this._$AH !== t5 && (this._$AR(), this._$AH = this.O(t5));
    }
    _(t5) {
      this._$AH !== E2 && c3(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(r3.createTextNode(t5)), this._$AH = t5;
    }
    $(t5) {
      var _a3;
      const { values: i5, _$litType$: s4 } = t5, e5 = "number" == typeof s4 ? this._$AC(t5) : (void 0 === s4.el && (s4.el = N2.createElement(P2(s4.h, s4.h[0]), this.options)), s4);
      if (((_a3 = this._$AH) == null ? void 0 : _a3._$AD) === e5)
        this._$AH.p(i5);
      else {
        const t6 = new M2(e5, this), s5 = t6.u(this.options);
        t6.p(i5), this.T(s5), this._$AH = t6;
      }
    }
    _$AC(t5) {
      let i5 = A2.get(t5.strings);
      return void 0 === i5 && A2.set(t5.strings, i5 = new N2(t5)), i5;
    }
    k(t5) {
      a2(this._$AH) || (this._$AH = [], this._$AR());
      const i5 = this._$AH;
      let s4, e5 = 0;
      for (const h4 of t5)
        e5 === i5.length ? i5.push(s4 = new _R(this.O(l2()), this.O(l2()), this, this.options)) : s4 = i5[e5], s4._$AI(h4), e5++;
      e5 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i5.length = e5);
    }
    _$AR(t5 = this._$AA.nextSibling, i5) {
      var _a3;
      for ((_a3 = this._$AP) == null ? void 0 : _a3.call(this, false, true, i5); t5 && t5 !== this._$AB; ) {
        const i6 = t5.nextSibling;
        t5.remove(), t5 = i6;
      }
    }
    setConnected(t5) {
      var _a3;
      void 0 === this._$AM && (this._$Cv = t5, (_a3 = this._$AP) == null ? void 0 : _a3.call(this, t5));
    }
  };
  var k2 = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t5, i5, s4, e5, h4) {
      this.type = 1, this._$AH = E2, this._$AN = void 0, this.element = t5, this.name = i5, this._$AM = e5, this.options = h4, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = E2;
    }
    _$AI(t5, i5 = this, s4, e5) {
      const h4 = this.strings;
      let o4 = false;
      if (void 0 === h4)
        t5 = S2(this, t5, i5, 0), o4 = !c3(t5) || t5 !== this._$AH && t5 !== T2, o4 && (this._$AH = t5);
      else {
        const e6 = t5;
        let n3, r4;
        for (t5 = h4[0], n3 = 0; n3 < h4.length - 1; n3++)
          r4 = S2(this, e6[s4 + n3], i5, n3), r4 === T2 && (r4 = this._$AH[n3]), o4 || (o4 = !c3(r4) || r4 !== this._$AH[n3]), r4 === E2 ? t5 = E2 : t5 !== E2 && (t5 += (r4 != null ? r4 : "") + h4[n3 + 1]), this._$AH[n3] = r4;
      }
      o4 && !e5 && this.j(t5);
    }
    j(t5) {
      t5 === E2 ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 != null ? t5 : "");
    }
  };
  var H2 = class extends k2 {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t5) {
      this.element[this.name] = t5 === E2 ? void 0 : t5;
    }
  };
  var I2 = class extends k2 {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t5) {
      this.element.toggleAttribute(this.name, !!t5 && t5 !== E2);
    }
  };
  var L2 = class extends k2 {
    constructor(t5, i5, s4, e5, h4) {
      super(t5, i5, s4, e5, h4), this.type = 5;
    }
    _$AI(t5, i5 = this) {
      var _a3;
      if ((t5 = (_a3 = S2(this, t5, i5, 0)) != null ? _a3 : E2) === T2)
        return;
      const s4 = this._$AH, e5 = t5 === E2 && s4 !== E2 || t5.capture !== s4.capture || t5.once !== s4.once || t5.passive !== s4.passive, h4 = t5 !== E2 && (s4 === E2 || e5);
      e5 && this.element.removeEventListener(this.name, this, s4), h4 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
    }
    handleEvent(t5) {
      var _a3, _b;
      "function" == typeof this._$AH ? this._$AH.call((_b = (_a3 = this.options) == null ? void 0 : _a3.host) != null ? _b : this.element, t5) : this._$AH.handleEvent(t5);
    }
  };
  var z2 = class {
    constructor(t5, i5, s4) {
      this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t5) {
      S2(this, t5);
    }
  };
  var j = t4.litHtmlPolyfillSupport;
  var _a2;
  j == null ? void 0 : j(N2, R2), ((_a2 = t4.litHtmlVersions) != null ? _a2 : t4.litHtmlVersions = []).push("3.2.1");
  var B = (t5, i5, s4) => {
    var _a3, _b;
    const e5 = (_a3 = s4 == null ? void 0 : s4.renderBefore) != null ? _a3 : i5;
    let h4 = e5._$litPart$;
    if (void 0 === h4) {
      const t6 = (_b = s4 == null ? void 0 : s4.renderBefore) != null ? _b : null;
      e5._$litPart$ = h4 = new R2(i5.insertBefore(l2(), t6), t6, void 0, s4 != null ? s4 : {});
    }
    return h4._$AI(t5), h4;
  };

  // src/observables/observable.js
  var Subscriber = class {
    /**
     * @constructor
     * @description Creates a new Subscriber instance with optimized memory layout.
     * @param {Observer|Function} observer - The observer object or function.
     */
    constructor(observer) {
      if (typeof observer === "function") {
        this.next = observer;
        this.error = null;
        this.complete = null;
      } else if (observer && typeof observer === "object") {
        if (observer.next) {
          this.next = typeof observer.next === "function" ? observer.next.bind ? observer.next.bind(observer) : observer.next : null;
        } else {
          this.next = null;
        }
        if (observer.error) {
          this.error = typeof observer.error === "function" ? observer.error.bind ? observer.error.bind(observer) : observer.error : null;
        } else {
          this.error = null;
        }
        if (observer.complete) {
          this.complete = typeof observer.complete === "function" ? observer.complete.bind ? observer.complete.bind(observer) : observer.complete : null;
        } else {
          this.complete = null;
        }
      } else {
        this.next = null;
        this.error = null;
        this.complete = null;
      }
      this.teardowns = null;
      this.isUnsubscribed = false;
    }
    /**
     * @method
     * @description Notifies the observer that the observable has completed.
     */
    complete() {
      if (!this.isUnsubscribed && this.complete) {
        this.complete();
        this.unsubscribe();
      }
    }
    /**
     * @method
     * @description Notifies the observer that an error has occurred.
     * @param {Error} error - The error to pass to the observer's error method.
     */
    error(error) {
      if (!this.isUnsubscribed && this.error) {
        this.error(error);
        this.unsubscribe();
      }
    }
    /**
     * @method
     * @description Adds a teardown function to be executed when unsubscribing.
     * @param {Function} teardown - The teardown function.
     */
    addTeardown(teardown) {
      if (!this.teardowns) {
        this.teardowns = [teardown];
      } else {
        this.teardowns.push(teardown);
      }
    }
    /**
     * @method
     * @description Unsubscribes from the observable, preventing any further notifications.
     */
    unsubscribe() {
      if (this.isUnsubscribed)
        return;
      this.isUnsubscribed = true;
      if (!this.teardowns) {
        this.next = null;
        this.error = null;
        this.complete = null;
        return;
      }
      const teardowns = this.teardowns;
      let i5 = teardowns.length;
      while (i5--) {
        const teardown = teardowns[i5];
        if (typeof teardown === "function") {
          teardown();
        }
      }
      this.teardowns = null;
      this.next = null;
      this.error = null;
      this.complete = null;
    }
  };
  var Observable = class {
    /**
     * @constructor
     * @description Creates a new Observable instance with optimized internal structure.
     * @param {Function} subscribeCallback - The callback function to call when a new observer subscribes.
     */
    constructor(subscribeCallback = null) {
      this.__observers = [];
      if (subscribeCallback) {
        this.subscribeCallback = subscribeCallback;
      }
    }
    /**
     * @method
     * @description Subscribes an observer to the observable with optimized paths.
     * @param {Observer|Function} observerOrNext - The observer to subscribe or the next function.
     * @param {Function} error - The error function. Default is null.
     * @param {Function} complete - The complete function. Default is null.
     * @returns {Object} An object containing methods to manage the subscription.
     */
    subscribe(observerOrNext, error, complete) {
      const subscriber = typeof observerOrNext === "function" ? new Subscriber(observerOrNext) : new Subscriber({ next: observerOrNext, error, complete });
      if (!this.subscribeCallback) {
        this.__observers.push(subscriber);
        subscriber.addTeardown(this.__createRemoveTeardown(subscriber));
        return this.__createSubscription(subscriber);
      }
      let teardown;
      try {
        teardown = this.subscribeCallback(subscriber);
      } catch (err) {
        if (subscriber.error) {
          subscriber.error(err);
        }
        return { unsubscribe: () => {
        } };
      }
      if (teardown) {
        subscriber.addTeardown(teardown);
      }
      if (!subscriber.isUnsubscribed) {
        this.__observers.push(subscriber);
        subscriber.addTeardown(this.__createRemoveTeardown(subscriber));
      }
      return this.__createSubscription(subscriber);
    }
    /**
     * @private
     * @method __createRemoveTeardown
     * @description Creates a teardown function that removes a subscriber from the observers array
     * @param {Subscriber} subscriber - The subscriber to remove
     * @returns {Function} A function that removes the subscriber when called
     */
    __createRemoveTeardown(subscriber) {
      return () => {
        const observers = this.__observers;
        const index = observers.indexOf(subscriber);
        if (index !== -1) {
          const lastIndex = observers.length - 1;
          if (index < lastIndex) {
            observers[index] = observers[lastIndex];
          }
          observers.pop();
        }
      };
    }
    /**
     * @private
     * @method __createSubscription
     * @description Creates a subscription object with minimal properties
     * @param {Subscriber} subscriber - The subscriber
     * @returns {Object} A subscription object
     */
    __createSubscription(subscriber) {
      return {
        unsubscribe: () => subscriber.unsubscribe(),
        // Only add these methods if needed in the future:
        complete: () => subscriber.complete(),
        error: (err) => subscriber.error(err)
      };
    }
    /**
     * @method
     * @description Passes a value to all observers with maximum efficiency.
     * @param {*} value - The value to emit.
     */
    next(value) {
      const observers = this.__observers;
      const len = observers.length;
      if (len === 0)
        return;
      if (len === 1) {
        const observer = observers[0];
        if (!observer.isUnsubscribed && observer.next) {
          observer.next(value);
        }
        return;
      }
      let i5 = len;
      while (i5--) {
        const observer = observers[i5];
        if (!observer.isUnsubscribed && observer.next) {
          observer.next(value);
        }
      }
    }
    /**
     * @method
     * @description Passes an error to all observers and terminates the stream.
     * @param {*} error - The error to emit.
     */
    error(error) {
      const observers = this.__observers.slice();
      const len = observers.length;
      for (let i5 = 0; i5 < len; i5++) {
        const observer = observers[i5];
        if (!observer.isUnsubscribed && observer.error) {
          observer.error(error);
        }
      }
      this.__observers.length = 0;
    }
    /**
     * @method
     * @description Notifies all observers that the Observable has completed.
     */
    complete() {
      const observers = this.__observers.slice();
      const len = observers.length;
      for (let i5 = 0; i5 < len; i5++) {
        const observer = observers[i5];
        if (!observer.isUnsubscribed && observer.complete) {
          observer.complete();
        }
      }
      this.__observers.length = 0;
    }
    /**
     * @method
     * @description Simplified method to subscribe to value emissions only.
     * @param {Function} callbackFn - The callback for each value.
     * @returns {Object} Subscription object with unsubscribe method.
     */
    onValue(callbackFn) {
      return this.subscribe(callbackFn);
    }
    /**
     * @method
     * @description Simplified method to subscribe to errors only.
     * @param {Function} callbackFn - The callback for errors.
     * @returns {Object} Subscription object with unsubscribe method.
     */
    onError(callbackFn) {
      return this.subscribe(null, callbackFn);
    }
    /**
     * @method
     * @description Simplified method to subscribe to completion only.
     * @param {Function} callbackFn - The callback for completion.
     * @returns {Object} Subscription object with unsubscribe method.
     */
    onEnd(callbackFn) {
      return this.subscribe(null, null, callbackFn);
    }
    /**
     * @method
     * @description Returns an AsyncIterator for asynchronous iteration.
     * @returns {AsyncIterator} AsyncIterator implementation.
     */
    [Symbol.asyncIterator]() {
      let resolve;
      let promise = new Promise((r4) => resolve = r4);
      let subscription;
      const cleanup = () => {
        if (subscription) {
          subscription.unsubscribe();
          subscription = null;
        }
      };
      subscription = this.subscribe(
        // Next handler
        (value) => {
          resolve({ value, done: false });
          promise = new Promise((r4) => resolve = r4);
        },
        // Error handler
        (err) => {
          cleanup();
          throw err;
        },
        // Complete handler
        () => {
          cleanup();
          resolve({ done: true });
        }
      );
      return {
        next: () => promise,
        return: () => {
          cleanup();
          return Promise.resolve({ done: true });
        },
        throw: (err) => {
          cleanup();
          return Promise.reject(err);
        }
      };
    }
  };

  // src/utils.js
  var _deepEqual = (a3, b3) => {
    if (a3 === b3)
      return true;
    if (a3 !== a3)
      return b3 !== b3;
    if (a3 == null || b3 == null)
      return false;
    if (typeof a3 !== "object" || typeof b3 !== "object")
      return false;
    if (Array.isArray(a3)) {
      if (!Array.isArray(b3) || a3.length !== b3.length)
        return false;
      for (let i5 = 0; i5 < a3.length; i5++) {
        if (!_deepEqual(a3[i5], b3[i5]))
          return false;
      }
      return true;
    }
    if (Array.isArray(b3))
      return false;
    if (a3 instanceof Date) {
      return b3 instanceof Date && a3.getTime() === b3.getTime();
    }
    if (a3 instanceof RegExp) {
      return b3 instanceof RegExp && a3.source === b3.source && a3.flags === b3.flags;
    }
    if (a3 instanceof Map) {
      if (!(b3 instanceof Map) || a3.size !== b3.size)
        return false;
      for (const [key, val] of a3.entries()) {
        if (!b3.has(key) || !_deepEqual(val, b3.get(key)))
          return false;
      }
      return true;
    }
    if (a3 instanceof Set) {
      if (!(b3 instanceof Set) || a3.size !== b3.size)
        return false;
      const aValues = Array.from(a3);
      const bValues = Array.from(b3);
      for (let i5 = 0; i5 < aValues.length; i5++) {
        let found = false;
        for (let j2 = 0; j2 < bValues.length; j2++) {
          if (_deepEqual(aValues[i5], bValues[j2])) {
            found = true;
            break;
          }
        }
        if (!found)
          return false;
      }
      return true;
    }
    if (ArrayBuffer.isView(a3) && !(a3 instanceof DataView)) {
      if (!ArrayBuffer.isView(b3) || a3.length !== b3.length || a3.constructor !== b3.constructor) {
        return false;
      }
      for (let i5 = 0; i5 < a3.length; i5++) {
        if (a3[i5] !== b3[i5])
          return false;
      }
      return true;
    }
    if (a3.constructor !== b3.constructor)
      return false;
    const keys = Object.keys(a3);
    if (keys.length !== Object.keys(b3).length)
      return false;
    const hasOwn = Object.prototype.hasOwnProperty;
    for (let i5 = 0; i5 < keys.length; i5++) {
      const key = keys[i5];
      if (!hasOwn.call(b3, key) || !_deepEqual(a3[key], b3[key])) {
        return false;
      }
    }
    return true;
  };
  var _deepMerge = (target, source) => {
    const seen = /* @__PURE__ */ new WeakMap();
    function merge(target2, source2) {
      if (source2 === void 0)
        return target2;
      if (source2 === null)
        return null;
      if (typeof source2 !== "object")
        return source2;
      if (target2 === null || typeof target2 !== "object") {
        if (Array.isArray(source2)) {
          const length = source2.length;
          const result2 = new Array(length);
          for (let i6 = 0; i6 < length; i6++) {
            const item = source2[i6];
            result2[i6] = item === null || typeof item !== "object" ? item : merge(void 0, item);
          }
          return result2;
        }
        return source2.constructor === Object ? __spreadValues({}, source2) : _deepClone(source2);
      }
      if (seen.has(source2)) {
        return seen.get(source2);
      }
      if (Array.isArray(source2)) {
        const length = source2.length;
        const result2 = new Array(length);
        seen.set(source2, result2);
        for (let i6 = 0; i6 < length; i6++) {
          const item = source2[i6];
          result2[i6] = item === null || typeof item !== "object" ? item : merge(void 0, item);
        }
        return result2;
      }
      if (source2 instanceof Map) {
        const result2 = new Map(target2 instanceof Map ? target2 : void 0);
        seen.set(source2, result2);
        for (const [key, val] of source2.entries()) {
          const keyClone = key === null || typeof key !== "object" ? key : merge(void 0, key);
          const targetValue = target2 instanceof Map ? target2.get(key) : void 0;
          const valueClone = val === null || typeof val !== "object" ? val : merge(targetValue, val);
          result2.set(keyClone, valueClone);
        }
        return result2;
      }
      if (source2 instanceof Set) {
        const result2 = new Set(target2 instanceof Set ? target2 : void 0);
        seen.set(source2, result2);
        for (const item of source2) {
          result2.add(item === null || typeof item !== "object" ? item : merge(void 0, item));
        }
        return result2;
      }
      if (source2.constructor !== Object) {
        if (source2 instanceof Date)
          return new Date(source2.getTime());
        if (source2 instanceof RegExp)
          return new RegExp(source2.source, source2.flags);
        if (ArrayBuffer.isView(source2) && !(source2 instanceof DataView)) {
          if (typeof Buffer !== "undefined" && source2 instanceof Buffer) {
            return Buffer.from(source2);
          }
          return new source2.constructor(
            source2.buffer.slice(0),
            source2.byteOffset,
            source2.length
          );
        }
        return _deepClone(source2);
      }
      const result = Object.create(Object.getPrototypeOf(target2));
      const targetKeys = Object.keys(target2);
      let i5 = targetKeys.length;
      while (i5--) {
        const key = targetKeys[i5];
        result[key] = target2[key];
      }
      seen.set(source2, result);
      for (const key in source2) {
        if (!Object.prototype.hasOwnProperty.call(source2, key))
          continue;
        if (key === "__proto__" || key === "constructor")
          continue;
        const sourceValue = source2[key];
        if (sourceValue === void 0)
          continue;
        if (sourceValue === null || typeof sourceValue !== "object") {
          result[key] = sourceValue;
          continue;
        }
        if (sourceValue instanceof Date) {
          result[key] = new Date(sourceValue.getTime());
          continue;
        }
        if (sourceValue instanceof RegExp) {
          result[key] = new RegExp(sourceValue.source, sourceValue.flags);
          continue;
        }
        const targetValue = target2[key];
        if (targetValue !== null && typeof targetValue === "object" && !Array.isArray(targetValue) && sourceValue.constructor === Object) {
          result[key] = merge(targetValue, sourceValue);
        } else {
          result[key] = merge(void 0, sourceValue);
        }
      }
      return result;
    }
    return merge(target, source);
  };
  var _deepClone = (value, cache = /* @__PURE__ */ new WeakMap()) => {
    if (value === null || typeof value !== "object")
      return value;
    if (cache.has(value))
      return cache.get(value);
    if (Array.isArray(value)) {
      const length = value.length;
      const result2 = new Array(length);
      cache.set(value, result2);
      for (let i5 = 0; i5 < length; i5++) {
        const item = value[i5];
        result2[i5] = item === null || typeof item !== "object" ? item : _deepClone(item, cache);
      }
      return result2;
    }
    if (value instanceof Date) {
      return new Date(value.getTime());
    }
    if (value instanceof RegExp) {
      return new RegExp(value.source, value.flags);
    }
    if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
      if (typeof Buffer !== "undefined" && value instanceof Buffer) {
        return Buffer.from(value);
      }
      return new value.constructor(
        value.buffer.slice(0),
        value.byteOffset,
        value.length
      );
    }
    if (value instanceof Set) {
      const result2 = /* @__PURE__ */ new Set();
      cache.set(value, result2);
      for (const item of value) {
        result2.add(item === null || typeof item !== "object" ? item : _deepClone(item, cache));
      }
      return result2;
    }
    if (value instanceof Map) {
      const result2 = /* @__PURE__ */ new Map();
      cache.set(value, result2);
      for (const [key, val] of value.entries()) {
        const keyClone = key === null || typeof key !== "object" ? key : _deepClone(key, cache);
        const valClone = val === null || typeof val !== "object" ? val : _deepClone(val, cache);
        result2.set(keyClone, valClone);
      }
      return result2;
    }
    const proto = Object.getPrototypeOf(value);
    const result = Object.create(proto);
    cache.set(value, result);
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const val = value[key];
        result[key] = val === null || typeof val !== "object" ? val : _deepClone(val, cache);
      }
    }
    return result;
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
        console.groupCollapsed(
          `%c[${functionName}]`,
          "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;",
          `Changed property state: ${messages[0]}`
        );
        console.log(`oldValue:`, messages[1]);
        console.log(`newValue:`, messages[2]);
      } else if (functionName === "cami:store:state:change") {
        console.groupCollapsed(
          `%c[${functionName}]`,
          "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;",
          `Changed store state: ${messages[0]}`
        );
        console.log(
          `oldValue of ${messages[1][0].path.join(".")}:`,
          messages[1][0].value
        );
        console.log(
          `newValue of ${messages[2][0].path.join(".")}:`,
          messages[2][0].value
        );
      } else {
        console.groupCollapsed(
          `%c[${functionName}]`,
          "color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block;",
          formattedMessages
        );
      }
      console.trace();
      console.groupEnd();
    }
  }

  // src/observables/observable-state.js
  var _DependencyTracker = class _DependencyTracker {
    /**
     * Track dependencies used during the execution of an effect function
     * @param {Function} effectFn - Function to track
     * @returns {Set} Set of dependencies
     */
    static track(effectFn) {
      const previousTracker = _DependencyTracker.current;
      const tracker = new _DependencyTracker();
      _DependencyTracker.current = tracker;
      try {
        effectFn();
        return tracker.dependencies;
      } finally {
        _DependencyTracker.current = previousTracker;
      }
    }
    constructor() {
      this.dependencies = [];
      this._depsMap = /* @__PURE__ */ new Map();
    }
    /**
     * Add a dependency to the current tracker
     * @param {Object} store - The store to track
     * @param {string} [property] - Optional property to track
     */
    addDependency(store2, property) {
      const key = property ? `${store2._uid || "store"}.${property}` : store2._uid || "store";
      if (!this._depsMap.has(key)) {
        const dep = { store: store2, property };
        this.dependencies.push(dep);
        this._depsMap.set(key, dep);
      }
    }
  };
  // Shared static context for tracking the current computation
  __publicField(_DependencyTracker, "current", null);
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
     * @param {Function} callback - Callback function to be notified on value changes
     * @returns {Object} A subscription object with an unsubscribe method
     * @description High-performance subscription method with O(1) unsubscribe
     */
    onValue(callback) {
      const index = this.__observers.length;
      this.__observers.push(callback);
      return {
        unsubscribe: () => {
          if (this.__observers[index] === callback) {
            const lastIndex = this.__observers.length - 1;
            if (index < lastIndex) {
              this.__observers[index] = this.__observers[lastIndex];
            }
            this.__observers.pop();
          } else {
            this.__observers = this.__observers.filter((obs) => obs !== callback);
          }
        }
      };
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
        for (let i5 = 0; i5 < keys.length - 1; i5++) {
          current2 = current2[keys[i5]];
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
        for (let i5 = 0; i5 < keys.length - 1; i5++) {
          current2 = current2[keys[i5]];
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
    /**
     * High-performance notification method with optimized code paths
     * @private
     */
    __notifyObservers() {
      if (this.__observers.length === 0 && !this.__lastObserver) {
        return;
      }
      const value = this.__value;
      const observers = this.__observers;
      const len = observers.length;
      if (len === 1 && !this.__lastObserver) {
        const observer = observers[0];
        if (observer) {
          if (typeof observer === "function") {
            observer(value);
          } else if (observer.next) {
            observer.next(value);
          }
        }
        return;
      }
      let i5 = len;
      while (i5--) {
        const observer = observers[i5];
        if (observer) {
          if (typeof observer === "function") {
            observer(value);
          } else if (observer.next) {
            observer.next(value);
          }
        }
      }
      if (this.__lastObserver) {
        if (typeof this.__lastObserver === "function") {
          this.__lastObserver(value);
        } else if (this.__lastObserver && this.__lastObserver.next) {
          this.__lastObserver.next(value);
        }
      }
    }
    /**
     * @method
     * @private
     * @description This method applies all the pending updates to the value.
     * It then notifies all the observers with the updated value.
     */
    /**
     * Optimized update application with fast paths for common cases
     * @private
     */
    __applyUpdates() {
      let hasChanged = false;
      const needsEventOrTrace = __config.events.isEnabled || __trace.isEnabled;
      const oldValue = needsEventOrTrace ? this.__value : void 0;
      const updates = this.__pendingUpdates;
      const updateCount = updates.length;
      if (updateCount === 0) {
        this.__updateScheduled = false;
        return;
      }
      const isComplexValue = typeof this.__value === "object" && this.__value !== null && (this.__value.constructor === Object || Array.isArray(this.__value));
      if (isComplexValue) {
        if (updateCount === 1) {
          const updater = updates[0];
          const newValue = produce(this.__value, updater);
          if (newValue !== this.__value) {
            if (typeof newValue === "object" && newValue !== null && typeof this.__value === "object" && this.__value !== null) {
              if (!_deepEqual(newValue, this.__value)) {
                hasChanged = true;
                this.__value = newValue;
              }
            } else {
              hasChanged = true;
              this.__value = newValue;
            }
          }
        } else {
          let currentValue = this.__value;
          for (let i5 = 0; i5 < updateCount; i5++) {
            const updater = updates[i5];
            const newValue = produce(currentValue, updater);
            if (newValue !== currentValue) {
              if (typeof newValue === "object" && newValue !== null && typeof currentValue === "object" && currentValue !== null) {
                if (!_deepEqual(newValue, currentValue)) {
                  hasChanged = true;
                  currentValue = newValue;
                }
              } else {
                hasChanged = true;
                currentValue = newValue;
              }
            }
          }
          if (hasChanged) {
            this.__value = currentValue;
          }
        }
      } else {
        let currentValue = this.__value;
        for (let i5 = 0; i5 < updateCount; i5++) {
          const updater = updates[i5];
          const newValue = updater(currentValue);
          if (newValue !== currentValue) {
            if (typeof newValue === "object" && newValue !== null && typeof currentValue === "object" && currentValue !== null) {
              if (!_deepEqual(newValue, currentValue)) {
                hasChanged = true;
                currentValue = newValue;
              }
            } else {
              hasChanged = true;
              currentValue = newValue;
            }
          }
        }
        if (hasChanged) {
          this.__value = currentValue;
        }
      }
      updates.length = 0;
      if (hasChanged) {
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
        if (needsEventOrTrace) {
          __trace("cami:elem:state:change", this.__name, oldValue, this.__value);
        }
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
    const _runEffect = () => {
      cleanup();
      DependencyTracker.current = { addDependency };
      function addDependency(observable) {
        if (!dependencies.has(observable)) {
          dependencies.add(observable);
          observable.onValue(_runEffect);
        }
      }
      try {
        cleanup = effectFn() || (() => {
        });
      } finally {
        DependencyTracker.current = null;
      }
    };
    _runEffect();
    return () => {
      cleanup();
      dependencies.forEach((dep) => dep.__observers = dep.__observers.filter((obs) => obs !== _runEffect));
      dependencies.clear();
    };
  };
  var derive = function(deriveFn) {
    let dependencies = /* @__PURE__ */ new Set();
    let subscriptions = /* @__PURE__ */ new Map();
    let currentValue;
    const tracker = {
      addDependency: (observable) => {
        if (!dependencies.has(observable)) {
          const subscription = observable.onValue(_computeDerivedValue);
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
    } else if (Object.hasOwn(config, "alwaysEnabled")) {
      alwaysEnabled = config.alwaysEnabled;
    }
  };

  // src/observables/observable-model.js
  function generateRandomName() {
    return "model_" + Math.random().toString(36).substr(2, 9);
  }
  var Model = class {
    constructor({ name = generateRandomName(), properties = {} } = {}) {
      this.name = name;
      this.schema = properties;
    }
    create(config) {
      const {
        state,
        actions = {},
        asyncActions = {},
        machines = {},
        queries = {},
        mutations = {},
        specs = {},
        memos = {},
        options = {}
      } = config;
      this.validateState(state);
      const modelStore = store(__spreadValues({
        state,
        name: this.name,
        schema: this.schema
      }, options));
      Object.entries(actions).forEach(([actionName, actionFn]) => {
        modelStore.defineAction(actionName, (context) => {
          actionFn(context);
          this.validateState(context.state);
        });
      });
      Object.entries(asyncActions).forEach(([thunkName, thunkFn]) => {
        modelStore.defineAsyncAction(thunkName, (context) => __async(this, null, function* () {
          yield thunkFn(context);
          this.validateState(context.state);
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
    validateState(state) {
      const errors2 = [];
      Object.entries(this.schema).forEach(([key, type]) => {
        if (!(key in state)) {
          const expectedType = this.__getExpectedTypeString(type);
          errors2.push(`Missing property: ${key}
Expected type: ${expectedType}`);
        } else {
          try {
            this.validateItem(state[key], type, [key], state);
          } catch (error) {
            errors2.push(error.message);
          }
        }
      });
      if (errors2.length > 0) {
        throw new Error(
          `Validation error in ${this.name}:

${errors2.join("\n\n")}`
        );
      }
    }
    validateItem(value, type, path, rootState) {
      const getTypeCategory = (type2, value2) => {
        if (type2.type === "optional")
          return "optional";
        if (type2.type === "object" && typeof value2 === "object")
          return "object";
        return "other";
      };
      try {
        const typeCategory = getTypeCategory(type, value);
        switch (typeCategory) {
          case "optional":
            if (value === void 0 || value === null)
              return;
            return this.validateItem(value, type.optional, path, rootState);
          case "object":
            Object.entries(type.schema).forEach(([key, subType]) => {
              if (subType.type !== "optional" && !(key in value)) {
                throw new Error(
                  `Missing required property: ${[...path, key].join(".")}`
                );
              }
              if (key in value) {
                this.validateItem(value[key], subType, [...path, key], rootState);
              }
            });
            break;
          case "other":
            validateType(value, type, path, rootState);
            break;
          default:
            throw new Error(`Unexpected type category: ${typeCategory}`);
        }
      } catch (error) {
        const expectedType = this.__getExpectedTypeString(type);
        const actualType = this.__getActualTypeString(value);
        throw new Error(
          `Property: ${path.join(".")}
Error: ${error.message}`
        );
      }
    }
    // Below are just helper functions to express types when there are validation errors
    __getExpectedTypeString(type) {
      const getTypeCategory = (type2) => {
        if (typeof type2 === "string")
          return "string";
        if (typeof type2 === "object") {
          if (type2.type) {
            if (type2.type === "object" && type2.schema)
              return "objectWithSchema";
            if (type2.type === "array" && type2.itemType)
              return "array";
            if (type2.type === "enum" && type2.values)
              return "enum";
            return "simpleType";
          }
          return "typeConstructor";
        }
        return "unknown";
      };
      const typeCategory = getTypeCategory(type);
      switch (typeCategory) {
        case "string":
          return type;
        case "objectWithSchema":
          return `Object(${Object.entries(type.schema).map(([k3, v4]) => `${k3}: ${this.__getExpectedTypeString(v4)}`).join(", ")})`;
        case "array":
          return `Array(${this.__getExpectedTypeString(type.itemType)})`;
        case "enum":
          return `Enum(${type.values.join(" | ")})`;
        case "simpleType":
          return type.type;
        case "typeConstructor":
          for (const [key, value] of Object.entries(Type)) {
            if (value === type || typeof value === "function" && type instanceof value) {
              return key;
            }
          }
          return "Unknown";
        case "unknown":
        default:
          return "Unknown";
      }
    }
    __getActualTypeString(value) {
      const getValueType = (value2) => {
        if (value2 === null)
          return "null";
        if (Array.isArray(value2))
          return "array";
        if (value2 instanceof Date)
          return "date";
        if (typeof value2 === "object")
          return "object";
        return typeof value2;
      };
      const valueType = getValueType(value);
      switch (valueType) {
        case "null":
          return "null";
        case "array":
          return "Array";
        case "date":
          return "Date";
        case "object":
          const constructor = value.constructor.name;
          return constructor !== "Object" ? constructor : "object";
        default:
          return valueType;
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
    Array: (itemType, options = {}) => ({
      type: "array",
      itemType,
      allowEmpty: options.allowEmpty !== false
      // Default to true
    }),
    Sum: (...types) => ({ type: "sum", types }),
    Product: (fields) => ({ type: "product", fields }),
    Any: { type: "any" },
    Enum: (...values) => ({ type: "enum", values }),
    Optional: (type) => ({ type: "optional", optional: type }),
    Refinement: (baseType, refinementFn) => ({
      type: "refinement",
      baseType,
      refinementFn
    }),
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
    Function: (paramTypes, returnType) => ({
      type: "function",
      paramTypes,
      returnType
    }),
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
    Model: (name, properties) => new Model({ name, properties }),
    Reference: (modelName) => ({
      type: "reference",
      modelName
    })
  };
  var typeValidators = {
    string: (value, type, path) => {
      if (typeof value !== type)
        throw new Error(
          `Expected ${type}, got ${typeof value} at ${path.join(".")}`
        );
    },
    object: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null)
        throw new Error(
          `Expected object, got ${value === null ? "null" : typeof value} at ${path.join(".")}`
        );
      Object.entries(type.schema).forEach(([key, subType]) => {
        if (!(key in value))
          throw new Error(
            `Missing required property ${key} at ${path.join(".")}`
          );
        validateType2(value[key], subType, [...path, key], rootState);
      });
    },
    array: (value, type, path, rootState, validateType2) => {
      if (!Array.isArray(value)) {
        throw new Error(
          `Expected array, got ${typeof value} at ${path.join(".")}`
        );
      }
      if (value.length === 0) {
        return;
      }
      value.forEach((item, index) => {
        if (item === void 0 || item === null) {
          if (type.itemType.type === "optional") {
            return;
          }
          throw new Error(
            `Unexpected ${item === null ? "null" : "undefined"} value at index ${index} at ${path.join(".")}`
          );
        }
        try {
          const itemTypeToValidate = type.itemType.type === "optional" ? type.itemType.optional : type.itemType;
          validateType2(item, itemTypeToValidate, [...path, index], rootState);
        } catch (error) {
          throw new Error(`Invalid item at index ${index}: ${error.message}`);
        }
      });
    },
    any: () => {
    },
    enum: (value, type, path) => {
      if (!type.values.includes(value))
        throw new Error(
          `Expected one of ${type.values.join(", ")}, got ${value} at ${path.join(
            "."
          )}`
        );
    },
    sum: (value, type, path, rootState, validateType2) => {
      const errors2 = [];
      if (!type.types.some((subType) => {
        try {
          validateType2(value, subType, path, rootState);
          return true;
        } catch (e5) {
          errors2.push(e5.message);
          return false;
        }
      })) {
        throw new Error(
          `Sum type validation failed at ${path.join(
            "."
          )}. Value: ${JSON.stringify(value)}. Errors: ${errors2.join("; ")}`
        );
      }
    },
    product: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null) {
        throw new Error(
          `Expected object for Product type, got ${typeof value} at ${path.join(
            "."
          )}`
        );
      }
      let existingObject = path.reduce((obj, key) => obj[key], rootState);
      if (existingObject === void 0) {
        existingObject = {};
      }
      const mergedValue = _deepMerge({}, existingObject, value);
      Object.entries(type.fields).forEach(([key, fieldType]) => {
        if (key in mergedValue) {
          validateType2(mergedValue[key], fieldType, [...path, key], rootState, key);
        }
      });
      let currentObj = rootState;
      for (let i5 = 0; i5 < path.length - 1; i5++) {
        if (currentObj[path[i5]] === void 0) {
          currentObj[path[i5]] = {};
        }
        currentObj = currentObj[path[i5]];
      }
      currentObj[path[path.length - 1]] = mergedValue;
      return mergedValue;
    },
    optional: (value, type, path, rootState, validateType2) => {
      if (value === void 0 || value === null) {
        return null;
      }
      return validateType2(value, type.optional, path, rootState);
    },
    null: (value, type, path) => {
      if (value !== null)
        throw new Error(
          `Expected null, got ${typeof value} at ${path.join(".")}`
        );
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
        throw new Error(
          `Expected Date, got ${typeof value} at ${path.join(".")}`
        );
    },
    float: (value, type, path) => {
      if (typeof value !== "number") {
        throw new Error(
          `Expected float, got ${typeof value} at ${path.join(".")}`
        );
      }
      if (Number.isNaN(value)) {
        throw new Error(`Expected float, got NaN at ${path.join(".")}`);
      }
    },
    integer: (value, type, path) => {
      if (!Number.isInteger(value)) {
        throw new Error(
          `Expected integer, got ${typeof value === "number" ? "float" : typeof value} at ${path.join(".")}`
        );
      }
    },
    natural: (value, type, path) => {
      if (!Number.isInteger(value) || value < 0) {
        throw new Error(
          `Expected natural number, got ${value} at ${path.join(".")}`
        );
      }
    },
    vect: (value, type, path, rootState, validateType2) => {
      if (!Array.isArray(value) || value.length !== type.length) {
        throw new Error(
          `Expected Vect of length ${type.length}, got ${value.length} at ${path.join(".")}`
        );
      }
      value.forEach((item, index) => {
        validateType2(item, type.elemType, [...path, index], rootState);
      });
    },
    tree: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null)
        throw new Error(
          `Expected tree, got ${typeof value} at ${path.join(".")}`
        );
      if (!("value" in value))
        throw new Error(
          `Invalid tree structure: missing 'value' at ${path.join(".")}`
        );
      validateType2(value.value, type.valueType, [...path, "value"], rootState);
      if ("left" in value)
        validateType2(value.left, type, [...path, "left"], rootState);
      if ("right" in value)
        validateType2(value.right, type, [...path, "right"], rootState);
    },
    roseTree: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null)
        throw new Error(
          `Expected rose tree, got ${typeof value} at ${path.join(".")}`
        );
      if (!("value" in value) || !("children" in value))
        throw new Error(`Invalid rose tree structure at ${path.join(".")}`);
      validateType2(value.value, type.valueType, [...path, "value"], rootState);
      if (!Array.isArray(value.children))
        throw new Error(
          `Expected array of children, got ${typeof value.children} at ${path.join(
            "."
          )}.children`
        );
      value.children.forEach((child, index) => {
        validateType2(child, type, [...path, "children", index], rootState);
      });
    },
    dependentRecord: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null)
        throw new Error(
          `Expected object, got ${typeof value} at ${path.join(".")}`
        );
      Object.entries(type.fields).forEach(([key, fieldType]) => {
        if (!(key in value))
          throw new Error(
            `Missing required property ${key} at ${path.join(".")}`
          );
        const resolvedType = typeof fieldType === "function" ? fieldType(value) : fieldType;
        validateType2(value[key], resolvedType, [...path, key], rootState);
      });
      if (typeof type.validateFn === "function") {
        const result = type.validateFn(value, rootState);
        if (result !== true) {
          throw new Error(
            `Validation failed for dependent record at ${path.join(
              "."
            )}: ${result}`
          );
        }
      }
    },
    dependentFunction: (value, type, path) => {
      if (typeof value !== "function") {
        throw new Error(
          `Expected function, got ${typeof value} at ${path.join(".")}`
        );
      }
    },
    dependentArray: (value, type, path, rootState, validateType2) => {
      if (!Array.isArray(value)) {
        throw new Error(
          `Expected array, got ${typeof value} at ${path.join(".")}`
        );
      }
      const expectedLength = type.lengthFn(value);
      if (value.length !== expectedLength) {
        throw new Error(
          `Expected array of length ${expectedLength}, got ${value.length} at ${path.join(".")}`
        );
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
        } catch (e5) {
          errors2.push(e5.message);
        }
      }
      if (possibleTypes.length === errors2.length) {
        throw new Error(
          `Dependent sum type validation failed at ${path.join(
            "."
          )}. Errors: ${errors2.join("; ")}`
        );
      }
    },
    literal: (value, type, path) => {
      if (value !== type.value) {
        throw new Error(
          `Expected ${type.value}, got ${value} at ${path.join(".")}`
        );
      }
    },
    boolean: (value, type, path) => {
      if (typeof value !== "boolean")
        throw new Error(
          `Expected boolean, got ${typeof value} at ${path.join(".")}`
        );
    },
    bigint: (value, type, path) => {
      if (typeof value !== "bigint")
        throw new Error(
          `Expected bigint, got ${typeof value} at ${path.join(".")}`
        );
    },
    symbol: (value, type, path) => {
      if (typeof value !== "symbol")
        throw new Error(
          `Expected symbol, got ${typeof value} at ${path.join(".")}`
        );
    },
    function: (value, type, path) => {
      if (typeof value !== "function") {
        throw new Error(
          `Expected function, got ${typeof value} at ${path.join(".")}`
        );
      }
    },
    void: () => {
    },
    reference: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "number") {
        throw new Error(
          `Expected reference ID (number), got ${typeof value} at ${path.join(
            "."
          )}`
        );
      }
    },
    model: (value, type, path, rootState, validateType2) => {
      if (typeof value !== "object" || value === null) {
        throw new Error(
          `Expected model object, got ${typeof value} at ${path.join(".")}`
        );
      }
      Object.entries(type.schema).forEach(([key, fieldType]) => {
        if (!(key in value)) {
          throw new Error(
            `Missing required property ${key} in model at ${path.join(".")}`
          );
        }
        validateType2(value[key], fieldType, [...path, key], rootState, key);
      });
    }
  };
  var validateType = (value, type, path = [], rootState = {}, currentKey = "") => {
    if (type === void 0) {
      throw new Error(
        `Invalid type definition for key "${currentKey}" at ${path.join(".")}`
      );
    }
    if (type.type === "optional") {
      if (value === void 0 || value === null) {
        return;
      }
      return validateType(value, type.optional, path, rootState, currentKey);
    }
    if (value === void 0) {
      throw new Error(
        `Missing required property "${currentKey}" at ${path.join(".")}`
      );
    }
    if (value === null && type !== "null") {
      throw new Error(
        `Expected non-null value for "${currentKey}", got null at ${path.join(
          "."
        )}`
      );
    }
    if (type instanceof Model) {
      return typeValidators.model(
        value,
        type,
        path,
        rootState,
        (v4, t5, p4, r4, k3) => validateType(v4, t5, p4, r4, k3)
      );
    }
    if (typeof type === "string") {
      const validator2 = typeValidators[type];
      if (validator2) {
        return validator2(
          value,
          type,
          path,
          rootState,
          (v4, t5, p4, r4, k3) => validateType(v4, t5, p4, r4, k3)
        );
      } else {
        throw new Error(
          `Unknown primitive type ${type} for "${currentKey}" at ${path.join(
            "."
          )}`
        );
      }
    }
    const validator = typeValidators[type.type];
    if (validator) {
      return validator(
        value,
        type,
        path,
        rootState,
        (v4, t5, p4, r4, k3) => validateType(v4, t5, p4, r4, k3)
      );
    } else {
      throw new Error(
        `Unknown type ${JSON.stringify(type)} for "${currentKey}" at ${path.join(
          "."
        )}`
      );
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
      if (schema.type === "product") {
        try {
          validateType(clonedState, schema, [], clonedState, "root");
        } catch (error) {
          console.error("Validation error:", error);
          throw error;
        }
      } else {
        throw new Error("Root schema must be a Product type");
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
      this._state = createDraft(initialState);
      this._frozenState = null;
      this._isDirty = false;
      this._stateVersion = 0;
      this._proxy = this._createProxy(this._state);
      this.previousState = initialState;
      this.reducers = {};
      this.actions = {};
      this.dispatchQueue = [];
      this.isDispatching = false;
      this.currentDispatchPromise = null;
      this.queryCache = /* @__PURE__ */ new Map();
      this.queryFunctions = /* @__PURE__ */ new Map();
      this.queries = {};
      this.memoCache = /* @__PURE__ */ new Map();
      this.intervals = /* @__PURE__ */ new Map();
      this.focusHandlers = /* @__PURE__ */ new Map();
      this.reconnectHandlers = /* @__PURE__ */ new Map();
      this.gcTimeouts = /* @__PURE__ */ new Map();
      this.mutationFunctions = /* @__PURE__ */ new Map();
      this.mutations = {};
      this.patchListeners = /* @__PURE__ */ new Map();
      this.machines = {};
      this.memos = {};
      this.thunks = {};
      this.specs = /* @__PURE__ */ new Map();
      this.beforeHooks = [];
      this.afterHooks = [];
      this.throttledAfterHooks = this.__executeAfterHooks.bind(this);
      this.__isDispatching = false;
      this.__dispatchStack = [];
      this.dispatch = this.dispatch.bind(this);
      this.query = this.query.bind(this);
      this.mutate = this.mutate.bind(this);
      this.subscribe = this.subscribe.bind(this);
      this.trigger = this.trigger.bind(this);
      this.memo = this.memo.bind(this);
      this.invalidateQueries = this.invalidateQueries.bind(this);
      this.dispatchAsync = this.dispatchAsync.bind(this);
      this.afterHook(() => {
        this._stateVersion++;
      });
      if (Object.keys(this.schema).length > 0) {
        this._validateState(this._state);
      }
    }
    /**
     * Returns a frozen snapshot of the current state
     * Automatically tracks dependencies for reactive computations
     */
    get state() {
      if (DependencyTracker.current) {
        DependencyTracker.current.addDependency(this);
      }
      if (!this._frozenState) {
        this._frozenState = deepFreeze(this._state);
      }
      return this._frozenState;
    }
    /**
     * Alternative to 'state' getter that follows standard getState pattern
     * Used by many libraries and compatible with redux-like interfaces
     */
    getState() {
      if (DependencyTracker.current) {
        DependencyTracker.current.addDependency(this);
      }
      if (!this._frozenState) {
        this._frozenState = deepFreeze(this._state);
      }
      return this._frozenState;
    }
    /**
     * Creates a proxy that tracks property access for dependency tracking
     * and automatically schedules updates when properties change
     * 
     * This is a critical path for performance optimization
     */
    _createProxy(target) {
      const STATE_TRAP = Symbol("state-trap");
      const SKIP_PROPS = /* @__PURE__ */ new Set(["constructor", "toJSON"]);
      if (!target[STATE_TRAP]) {
        target[STATE_TRAP] = /* @__PURE__ */ new Map();
      }
      return new Proxy(target, {
        get: (target2, prop, receiver) => {
          if (typeof prop === "symbol" || SKIP_PROPS.has(prop) || prop === STATE_TRAP) {
            return Reflect.get(target2, prop, receiver);
          }
          if (DependencyTracker.current) {
            DependencyTracker.current.addDependency(this, prop);
          }
          const value = Reflect.get(target2, prop, receiver);
          if (typeof value !== "function") {
            return value;
          }
          if (!Object.getOwnPropertyDescriptor(target2, prop)) {
            const trapMap = target2[STATE_TRAP];
            if (!trapMap.has(prop)) {
              trapMap.set(prop, value.bind(target2));
            }
            return trapMap.get(prop);
          }
          return value;
        },
        set: (target2, prop, value, receiver) => {
          if (typeof prop === "symbol" || SKIP_PROPS.has(prop)) {
            return Reflect.set(target2, prop, value, receiver);
          }
          const oldValue = target2[prop];
          if (oldValue === value) {
            return true;
          }
          if (typeof value === "object" && value !== null && typeof oldValue === "object" && oldValue !== null) {
            if (_deepEqual(oldValue, value)) {
              return true;
            }
          }
          const result = Reflect.set(target2, prop, value, receiver);
          this._isDirty = true;
          this._frozenState = null;
          if (typeof prop === "string" && !(prop in this)) {
            this._addProxyProperty(prop);
          }
          return result;
        },
        deleteProperty: (target2, prop) => {
          if (prop in target2) {
            const result = Reflect.deleteProperty(target2, prop);
            this._isDirty = true;
            this._frozenState = null;
            return result;
          }
          return true;
        },
        // These traps are less frequently used but still important for correctness
        ownKeys: (target2) => {
          if (DependencyTracker.current) {
            DependencyTracker.current.addDependency(this);
          }
          return Reflect.ownKeys(target2);
        },
        has: (target2, prop) => {
          if (DependencyTracker.current) {
            DependencyTracker.current.addDependency(this, prop);
          }
          return Reflect.has(target2, prop);
        },
        defineProperty: (target2, prop, descriptor) => {
          const result = Reflect.defineProperty(target2, prop, descriptor);
          if (result) {
            this._isDirty = true;
            this._frozenState = null;
            if (typeof prop === "string" && !(prop in this)) {
              this._addProxyProperty(prop);
            }
          }
          return result;
        },
        getOwnPropertyDescriptor: (target2, prop) => {
          if (DependencyTracker.current) {
            DependencyTracker.current.addDependency(this, prop);
          }
          return Reflect.getOwnPropertyDescriptor(target2, prop);
        }
      });
    }
    /**
     * Adds a property from the state to the store instance for direct access
     * Only used for properties not already defined on the store
     */
    _addProxyProperty(key) {
      if (typeof key === "string" && !key.startsWith("_") && !key.startsWith("__") && !(key in this) && !["dispatch", "getState", "subscribe"].includes(key)) {
        Object.defineProperty(this, key, {
          get: () => this._state[key],
          set: (value) => {
            this._state[key] = value;
            this._isDirty = true;
            this._frozenState = null;
          },
          enumerable: true,
          configurable: true
        });
      }
    }
    /**
     * Efficiently notifies observers of state changes
     * Only triggers if state has changed and batches notifications
     */
    _notifyObservers() {
      if (!this._isDirty)
        return;
      if (this.__observers.length === 0 && !this.__subscriber) {
        this._isDirty = false;
        return;
      }
      if (this.previousState && _deepEqual(this._state, this.previousState)) {
        this._isDirty = false;
        return;
      }
      this.memoCache.clear();
      this._frozenState = null;
      const stateToEmit = deepFreeze(_deepClone(this._state));
      const observerCount = this.__observers.length;
      if (observerCount > 0) {
        let i5 = observerCount;
        while (i5--) {
          const observer = this.__observers[i5];
          if (observer && typeof observer.next === "function") {
            observer.next(stateToEmit);
          }
        }
      }
      if (this.__subscriber && typeof this.__subscriber.next === "function") {
        this.__subscriber.next(stateToEmit);
      }
      this.previousState = _deepClone(this._state);
      this._isDirty = false;
      if (__config.events.isEnabled && typeof window !== "undefined") {
        const event = new CustomEvent("cami:store:state:change", {
          detail: {
            store: this.name,
            state: stateToEmit
          }
        });
        window.dispatchEvent(event);
      }
    }
    /**
     * Creates a schema definition for type validation
     */
    _createDeepSchema(state) {
      const typeCache = /* @__PURE__ */ new Map();
      const inferType = (value) => {
        if (value === null)
          return "null";
        if (value === void 0)
          return "undefined";
        if (typeCache.has(value)) {
          return typeCache.get(value);
        }
        let type;
        if (Array.isArray(value)) {
          type = "array";
        } else if (typeof value === "object") {
          type = this._createDeepSchema(value);
        } else {
          type = typeof value;
        }
        if (typeof value === "object" && value !== null) {
          typeCache.set(value, type);
        }
        return type;
      };
      return Object.keys(state).reduce((acc, key) => {
        acc[key] = inferType(state[key]);
        return acc;
      }, {});
    }
    /**
     * Validates a state object against a schema
     */
    _validateDeepState(schema, state, path = []) {
      if (!schema || Object.keys(schema).length === 0)
        return;
      Object.keys(schema).forEach((key) => {
        const expectedType = schema[key];
        const actualValue = state[key];
        const currentPath = [...path, key];
        const actualType = this._inferType(actualValue);
        if (actualType === "function")
          return;
        if (typeof expectedType === "object" && expectedType !== null) {
          if (typeof actualValue !== "object" || actualValue === null) {
            throw new TypeError(
              `Invalid type at ${currentPath.join(".")}. Expected object, got ${typeof actualValue}`
            );
          }
          this._validateDeepState(expectedType, actualValue, currentPath);
        } else {
          if (expectedType === "null" || expectedType === "undefined") {
            return;
          } else if (actualType !== expectedType) {
            throw new TypeError(
              `Invalid type at ${currentPath.join(".")}. Expected ${expectedType}, got ${actualType}`
            );
          }
        }
      });
    }
    /**
     * Determine the type of a value
     */
    _inferType(value) {
      if (Array.isArray(value))
        return "array";
      if (value === null)
        return "null";
      if (value === void 0)
        return "undefined";
      return typeof value;
    }
    /**
     * Process the queue of actions to be dispatched
     */
    _processDispatchQueue() {
      if (this.isDispatching)
        return;
      this.isDispatching = true;
      try {
        const queue = this.dispatchQueue;
        if (queue.length === 1) {
          const { action, payload } = queue.shift();
          this._dispatch(action, payload);
          this.isDispatching = false;
          return;
        }
        while (queue.length > 0) {
          const { action, payload } = queue.shift();
          this._dispatch(action, payload);
        }
      } catch (error) {
        console.error(`[Cami.js] Error in dispatch queue:`, error);
        throw error;
      } finally {
        this.isDispatching = false;
      }
    }
    /**
     * Public API for dispatching actions
     */
    dispatch(action, payload) {
      return this._dispatch(action, payload);
    }
    /**
     * Main implementation of action dispatch
     * Critical performance path - heavily optimized
     */
    _dispatch(action, payload) {
      var _a3;
      if (this.__isDispatching) {
        const cycle = [...this.__dispatchStack, action].join(" -> ");
        console.warn(`[Cami.js] Cyclic dispatch detected: ${cycle}`);
      }
      this.__isDispatching = true;
      this.__dispatchStack.push(action);
      if (action === void 0) {
        const currentAction = this.__dispatchStack[this.__dispatchStack.length - 2];
        this.__dispatchStack.pop();
        this.__isDispatching = false;
        throw new Error(
          currentAction ? `[Cami.js] Attempted to dispatch undefined action. This is likely invoked in action "${currentAction}".` : `[Cami.js] Attempted to dispatch undefined action in the global namespace.`
        );
      }
      if (typeof action !== "string") {
        this.__dispatchStack.pop();
        this.__isDispatching = false;
        throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof action}`);
      }
      const reducer = this.reducers[action];
      if (!reducer) {
        this.__dispatchStack.pop();
        this.__isDispatching = false;
        __trace("cami:store:warn", `No reducer found for action ${action}`);
        console.warn(`No reducer found for action ${action}`);
        return this.getState();
      }
      const originalState = _deepClone(this._state);
      try {
        const spec = (_a3 = this.specs) == null ? void 0 : _a3.get(action);
        if (spec == null ? void 0 : spec.precondition) {
          const isPreconditionMet = spec.precondition({
            state: this._state,
            payload,
            action
          });
          if (!isPreconditionMet) {
            throw new Error(`Precondition not met for action ${action}`);
          }
        }
        if (this.beforeHooks.length > 0) {
          this.__applyHooks("before", { action, payload, state: this._state });
        }
        const reducerContext = {
          state: this._state,
          payload,
          dispatch: this.dispatch,
          query: this.query,
          mutate: this.mutate,
          invalidateQueries: this.invalidateQueries,
          memo: this.memo,
          trigger: this.trigger
        };
        try {
          const [nextState, patches, inversePatches] = produceWithPatches(
            this._state,
            (draft) => {
              reducer(reducerContext);
            }
          );
          if (spec == null ? void 0 : spec.postcondition) {
            const isPostconditionMet = spec.postcondition({
              state: nextState,
              payload,
              action,
              previousState: this._state
            });
            if (!isPostconditionMet) {
              throw new Error(`Postcondition not met for action ${action}`);
            }
          }
          this._isDirty = true;
          this._frozenState = null;
          const hasPatches = patches.length > 0;
          if (hasPatches) {
            for (const key in nextState) {
              if (Object.prototype.hasOwnProperty.call(nextState, key)) {
                this._state[key] = nextState[key];
              }
            }
            if (this.patchListeners.size > 0) {
              this._notifyPatchListeners(patches);
            }
            __trace(
              "cami:store:state:change",
              `Changed store state via action: ${action}`,
              inversePatches,
              patches
            );
            if (this.afterHooks.length > 0) {
              this.__applyHooks("after", {
                action,
                payload,
                state: nextState,
                previousState: originalState,
                patches,
                inversePatches,
                dispatch: this.dispatch
              });
            }
            if (Object.keys(this.schema).length > 0) {
              this._validateState(this._state);
            }
          }
          this._notifyObservers();
        } catch (error) {
          this._state = createDraft(_deepClone(originalState));
          this._isDirty = true;
          this._frozenState = null;
          this.memoCache.clear();
          throw error;
        }
        return this.getState();
      } finally {
        this.__dispatchStack.pop();
        this.__isDispatching = false;
      }
    }
    /**
     * Add a hook to run before actions
     */
    beforeHook(hook) {
      if (typeof hook !== "function") {
        throw new Error("[Cami.js] Hook must be a function");
      }
      this.beforeHooks.push(hook);
      return () => {
        const hooks = this.beforeHooks;
        const index = hooks.indexOf(hook);
        if (index !== -1) {
          const lastIndex = hooks.length - 1;
          if (index < lastIndex) {
            hooks[index] = hooks[lastIndex];
          }
          hooks.pop();
        }
      };
    }
    /**
     * Add a hook to run after actions
     */
    afterHook(hook) {
      if (typeof hook !== "function") {
        throw new Error("[Cami.js] Hook must be a function");
      }
      this.afterHooks.push(hook);
      return () => {
        const hooks = this.afterHooks;
        const index = hooks.indexOf(hook);
        if (index !== -1) {
          const lastIndex = hooks.length - 1;
          if (index < lastIndex) {
            hooks[index] = hooks[lastIndex];
          }
          hooks.pop();
        }
      };
    }
    /**
     * Run hooks of a specific type
     * Optimized to skip empty hook arrays
     */
    __applyHooks(type, context) {
      if (type === "before") {
        const hooks = this.beforeHooks;
        const len = hooks.length;
        if (len === 0)
          return;
        let i5 = len;
        while (i5--) {
          hooks[i5](context);
        }
      } else if (type === "after") {
        if (this.afterHooks.length === 0)
          return;
        this.throttledAfterHooks(context);
      }
    }
    /**
     * Execute after hooks with current context
     */
    __executeAfterHooks(context) {
      const hooks = this.afterHooks;
      const len = hooks.length;
      if (len === 0)
        return;
      let i5 = len;
      while (i5--) {
        try {
          hooks[i5](context);
        } catch (error) {
          console.error(`[Cami.js] Error in afterHook[${i5}]:`, error);
        }
      }
    }
    /**
     * Notify patch listeners of changes
     * Optimized for performance with key-based targeting
     */
    _notifyPatchListeners(patches) {
      if (this.patchListeners.size === 0)
        return;
      const patchesByKey = /* @__PURE__ */ new Map();
      const patchesLen = patches.length;
      let i5 = patchesLen;
      while (i5--) {
        const patch = patches[i5];
        const key = patch.path[0];
        if (!this.patchListeners.has(key))
          continue;
        let keyPatches = patchesByKey.get(key);
        if (!keyPatches) {
          keyPatches = [];
          patchesByKey.set(key, keyPatches);
        }
        keyPatches.push(patch);
      }
      for (const [key, keyPatches] of patchesByKey) {
        const listeners = this.patchListeners.get(key);
        if (!listeners || listeners.length === 0)
          continue;
        const listenersLen = listeners.length;
        let j2 = listenersLen;
        while (j2--) {
          try {
            listeners[j2](keyPatches);
          } catch (error) {
            console.error(`[Cami.js] Error in patch listener for key "${key}":`, error);
          }
        }
      }
    }
    /**
     * @method defineAction
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
     * CartStore.defineAction('add', ({ state, product }) => { 
     *   const cartItem = { ...product, cartItemId: Date.now() };
     *   state.cartItems.push(cartItem);
     * });
     *
     * CartStore.defineAction('remove', ({ state, payload }) => {
     *   state.cartItems = state.cartItems.filter(item => item.cartItemId !== payload.cartItemId);
     * });
     * ```
     */
    defineAction(action, reducer) {
      if (typeof action !== "string") {
        throw new Error(`[Cami.js] Action name must be a string, got: ${typeof action}`);
      }
      if (typeof reducer !== "function") {
        throw new Error(`[Cami.js] Reducer must be a function, got: ${typeof reducer}`);
      }
      if (this.reducers[action]) {
        throw new Error(`[Cami.js] Action '${action}' is already defined in store '${this.name}'.`);
      }
      const baseContext = {
        dispatch: this.dispatch,
        query: this.query,
        mutate: this.mutate,
        memo: this.memo,
        trigger: this.trigger,
        invalidateQueries: this.invalidateQueries,
        dispatchAsync: this.dispatchAsync
      };
      this.reducers[action] = (context) => {
        const storeContext = Object.assign({}, baseContext, context);
        return reducer(storeContext);
      };
      this.actions[action] = (payload) => this.dispatch(action, payload);
      return this;
    }
    /**
     * Define a spec for an action
     * Specs can include preconditions and postconditions
     */
    defineSpec(actionName, spec) {
      if (typeof actionName !== "string") {
        throw new Error(`[Cami.js] Action name must be a string, got: ${typeof actionName}`);
      }
      if (!spec || typeof spec !== "object") {
        throw new Error(`[Cami.js] Spec must be an object, got: ${typeof spec}`);
      }
      if (!this.specs) {
        this.specs = /* @__PURE__ */ new Map();
      }
      if (spec.precondition && typeof spec.precondition !== "function") {
        throw new Error(`[Cami.js] Precondition must be a function, got: ${typeof spec.precondition}`);
      }
      if (spec.postcondition && typeof spec.postcondition !== "function") {
        throw new Error(`[Cami.js] Postcondition must be a function, got: ${typeof spec.postcondition}`);
      }
      this.specs.set(actionName, spec);
      return this;
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
          const lastIndex = listeners.length - 1;
          if (index < lastIndex) {
            listeners[index] = listeners[lastIndex];
          }
          listeners.pop();
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
        throw new Error(
          `[Cami.js] Query with name ${queryName} has already been defined.`
        );
      }
      this.queryFunctions.set(queryName, config);
      this.queries[queryName] = (...args) => this.query(queryName, ...args);
    }
    _executeQuery(queryName, payload, query) {
      const {
        queryFn,
        queryKey,
        staleTime,
        retry,
        retryDelay,
        onFetch,
        onSuccess,
        onError,
        onSettled
      } = query;
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
      __trace(
        `_executeQuery`,
        `Checking cache for key: ${cacheKey}, exists: ${!!cachedData}`
      );
      if (cachedData && !this._isStale(cachedData, staleTime)) {
        __trace(
          `query`,
          `Returning cached data for: ${queryName} with cacheKey: ${cacheKey}`
        );
        return this._handleQueryResult(
          queryName,
          cachedData.data,
          null,
          storeContext,
          { onSuccess, onSettled }
        );
      }
      __trace(
        `query`,
        `Data is stale or not cached, fetching new data for: ${queryName}`
      );
      if (onFetch) {
        __trace(`query`, `onFetch callback invoked for: ${queryName}`);
        onFetch(storeContext);
      }
      return this._fetchWithRetry(() => queryFn(payload), retry, retryDelay).then((data) => {
        this.queryCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          isStale: false
        });
        return this._handleQueryResult(queryName, data, null, storeContext, {
          onSuccess,
          onSettled
        });
      }).catch((error) => {
        return this._handleQueryResult(queryName, null, error, storeContext, {
          onError,
          onSettled
        });
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
        throw new Error(
          `[Cami.js] invalidateQueries expects either a queryKey or a predicate.`
        );
      }
      const queriesToInvalidate = Array.from(this.queryFunctions.keys()).filter(
        (queryName) => {
          if (queryKey) {
            const storedQueryKey = this.queryFunctions.get(queryName).queryKey;
            if (typeof storedQueryKey === "function") {
              try {
                const generatedKey = storedQueryKey({});
                return JSON.stringify(generatedKey) === JSON.stringify(queryKey);
              } catch (error) {
                __trace(
                  `invalidateQueries`,
                  `Error generating key for ${queryName}: ${error.message}`
                );
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
        }
      );
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
        __trace(
          `invalidateQueries`,
          `Invalidating query with key: ${queryName}, cacheKey: ${cacheKey}`
        );
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
          window.removeEventListener(
            "online",
            this.reconnectHandlers.get(queryName)
          );
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
            return new Promise((resolve) => setTimeout(resolve, delay)).then(
              executeFetch
            );
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
      __trace(
        `_isStale`,
        `
      isDataStale: ${isDataStale}
      isManuallyInvalidated: ${isManuallyInvalidated}
      Current Time: ${currentTime}
      Data Timestamp: ${cachedData.timestamp}
      Time Since Last Update: ${timeSinceLastUpdate}ms
      Stale Time: ${staleTime}ms
    `
      );
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
        throw new Error(
          `[Cami.js] Mutation with name ${mutationName} is already registered.`
        );
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
            throw new Error(
              `Event '${eventName}' must have a 'to' property that is an object or a function returning an object`
            );
          }
          if (event.guard && typeof event.guard !== "function") {
            throw new Error(`Guard for event '${eventName}' must be a function`);
          }
          if (event.onTransition && typeof event.onTransition !== "function") {
            throw new Error(
              `onTransition for event '${eventName}' must be a function`
            );
          }
          if (event.onEntry && typeof event.onEntry !== "function") {
            throw new Error(
              `onEntry for event '${eventName}' must be a function`
            );
          }
          if (event.onExit && typeof event.onExit !== "function") {
            throw new Error(`onExit for event '${eventName}' must be a function`);
          }
        });
      };
      validateMachine(machineDefinition);
      this.machines[machineName] = machineDefinition;
      Object.entries(machineDefinition).forEach(([eventName, event]) => {
        const fullEventName = `${machineName}:${eventName}`;
        this.defineAction(fullEventName, ({ state, payload }) => {
          if (this.isValidTransition(event.from, state)) {
            const newState = typeof event.to === "function" ? event.to({ state, payload }) : event.to;
            Object.entries(newState).forEach(([key, value]) => {
              if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                state[key] = __spreadValues(__spreadValues({}, state[key]), value);
              } else {
                state[key] = value;
              }
            });
            if (event.onEntry) {
              event.onEntry({ state, previousState: this._state, payload });
            }
          } else {
            console.warn(`Ignored transition '${fullEventName}' event. Current state does not match 'from' condition.`);
          }
        });
      });
    }
    /**
     * @method trigger
     * @param {string} fullEventName - The full name of the event to trigger (machineName:eventName)
     * @param {*} payload - The payload for the event
     * @returns {Promise} A promise that resolves when the event is processed
     * @description Triggers a state machine event
     */
    trigger(fullEventName, payload) {
      const [machineName, eventName] = fullEventName.split(":");
      if (!this.machines[machineName] || !this.machines[machineName][eventName]) {
        throw new Error(
          `Event '${fullEventName}' not found in any state machine.`
        );
      }
      const event = this.machines[machineName][eventName];
      const currentState = __spreadValues({}, this._state);
      if (event.onExit) {
        event.onExit({ state: currentState, payload });
      }
      this.dispatch(fullEventName, payload);
      if (event.onTransition) {
        event.onTransition({
          from: currentState,
          to: this._state,
          payload,
          data: event.data
        });
      }
      return Promise.resolve(this._state);
    }
    /**
     * @method memo
     * @param {string} memoName - The name of the memo to compute
     * @param {*} [payload] - Optional payload for the memo
     * @returns {*} The computed value of the memo
     * @description Computes and returns the value of a memoized property with efficient caching
     */
    memo(memoName, payload) {
      if (typeof memoName !== "string") {
        throw new Error(`[Cami.js] Memo name must be a string, got: ${typeof memoName}`);
      }
      const memoFn = this.memos[memoName];
      if (!memoFn) {
        throw new Error(`[Cami.js] Memo '${memoName}' not found.`);
      }
      let cache = this.memoCache.get(memoName);
      if (!cache) {
        cache = /* @__PURE__ */ new Map();
        this.memoCache.set(memoName, cache);
      }
      let cacheKey;
      if (payload === void 0 || payload === null) {
        cacheKey = "__undefined__";
      } else if (typeof payload !== "object") {
        cacheKey = payload;
      } else {
        cacheKey = JSON.stringify(payload);
      }
      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (cached.stateVersion === this._stateVersion) {
          return cached.result;
        }
        if (this._areDependenciesUnchanged(cached.dependencies)) {
          return cached.result;
        }
      }
      const dependencies = /* @__PURE__ */ new Set();
      const trackingProxy = new Proxy(this._state, {
        get: (target, prop) => {
          if (typeof prop === "string" && !prop.startsWith("_")) {
            dependencies.add(prop);
          }
          return target[prop];
        }
      });
      const storeContext = {
        state: trackingProxy,
        payload,
        dispatch: this.dispatch,
        trigger: this.trigger,
        memo: this.memo,
        query: this.query,
        mutate: this.mutate,
        dispatchAsync: this.dispatchAsync
      };
      let result;
      try {
        result = memoFn(storeContext);
      } catch (error) {
        console.error(`[Cami.js] Error in memo '${memoName}':`, error);
        throw error;
      }
      cache.set(cacheKey, {
        result,
        dependencies,
        stateVersion: this._stateVersion
      });
      return result;
    }
    /**
     * Check if all dependencies remain unchanged since last state update
     * @private
     */
    _areDependenciesUnchanged(dependencies) {
      if (!dependencies || dependencies.size === 0) {
        return true;
      }
      if (!this.previousState) {
        return false;
      }
      if (dependencies.size <= 8) {
        for (const dep of dependencies) {
          if (this._state[dep] !== this.previousState[dep]) {
            if (typeof this._state[dep] === "object" && this._state[dep] !== null && typeof this.previousState[dep] === "object" && this.previousState[dep] !== null) {
              if (!_deepEqual(this._state[dep], this.previousState[dep])) {
                return false;
              }
            } else {
              return false;
            }
          }
        }
        return true;
      }
      const deps = Array.from(dependencies);
      const len = deps.length;
      for (let i5 = 0; i5 < len; i5++) {
        const dep = deps[i5];
        if (this._state[dep] !== this.previousState[dep]) {
          if (typeof this._state[dep] === "object" && this._state[dep] !== null && typeof this.previousState[dep] === "object" && this.previousState[dep] !== null) {
            if (!_deepEqual(this._state[dep], this.previousState[dep])) {
              return false;
            }
          } else {
            return false;
          }
        }
      }
      return true;
    }
    /**
     * Define a memo function for the store
     * @param {string} memoName - Name of the memo
     * @param {Function} memoFn - Function that computes the memo value
     */
    defineMemo(memoName, memoFn) {
      if (typeof memoName !== "string") {
        throw new Error("[Cami.js] Memo name must be a string");
      }
      if (typeof memoFn !== "function") {
        throw new Error(`[Cami.js] Memo '${memoName}' must be a function`);
      }
      this.memos[memoName] = memoFn;
      if (!this.memoCache.has(memoName)) {
        this.memoCache.set(memoName, /* @__PURE__ */ new Map());
      }
      return this;
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
            mismatched.push(
              `${fullKey} (expected ${typeof expected[key]}, got ${typeof actual[key]})`
            );
          } else if (typeof expected[key] === "object" && expected[key] !== null && typeof actual[key] === "object" && actual[key] !== null) {
            mismatched.push(
              ...findMismatchedKeys(expected[key], actual[key], fullKey)
            );
          }
        });
        return mismatched;
      };
      const fromShape = Array.isArray(from) ? from[0] : from;
      if (typeof to !== "object" || to === null) {
        const expectedShape = getShapeDescription(fromShape);
        throw new Error(
          `Invalid 'to' state: must be an object.

Expected key-value pairs:
${JSON.stringify(
            expectedShape,
            null,
            2
          )}`
        );
      }
      const mismatchedKeys = findMismatchedKeys(to, fromShape);
      if (mismatchedKeys.length > 0) {
        const expectedShape = getShapeDescription(fromShape);
        throw new Error(
          `Invalid 'to' state shape.

Expected key-value pairs:
${JSON.stringify(
            expectedShape,
            null,
            2
          )}

Mismatched keys: ${mismatchedKeys.join(", ")}`
        );
      }
    }
    executeHandler(handler, context) {
      if (typeof handler === "function") {
        handler(context);
      }
    }
    hasAction(actionName) {
      return actionName in this.reducers;
    }
    hasAsyncAction(actionName) {
      return actionName in this.thunks;
    }
    _validateState(state) {
      Object.entries(this.schema).forEach(([key, type]) => {
        try {
          if (type.type === "optional" && (state[key] === void 0 || state[key] === null)) {
            return;
          }
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
        throw new Error(
          `Attempted to modify frozen state. Cannot set property '${prop}' on immutable object.`
        );
      },
      deleteProperty(target, prop) {
        throw new Error(
          `Attempted to modify frozen state. Cannot delete property '${prop}' from immutable object.`
        );
      }
    });
  };
  var storeInstances = /* @__PURE__ */ new Map();
  var store = (config = {}) => {
    const defaultConfig = {
      state: {},
      name: "cami-store",
      schema: {},
      enableLogging: false,
      enableDevtools: false
    };
    const finalConfig = __spreadValues(__spreadValues({}, defaultConfig), config);
    if (storeInstances.has(finalConfig.name)) {
      return storeInstances.get(finalConfig.name);
    }
    const storeInstance = new ObservableStore(finalConfig.state, finalConfig);
    const requiredMethods = ["memo", "query", "trigger", "dispatch", "mutate", "subscribe"];
    const missingMethods = requiredMethods.filter((method) => typeof storeInstance[method] !== "function");
    if (missingMethods.length > 0) {
      console.warn(`[Cami.js] Store missing required methods: ${missingMethods.join(", ")}`);
    }
    storeInstances.set(finalConfig.name, storeInstance);
    if (finalConfig.enableLogging) {
      __trace("cami:store:create", `Created store: ${finalConfig.name}`);
    }
    return storeInstance;
  };

  // src/observables/observable-proxy.js
  var ObservableProxy = class {
    constructor(observable) {
      if (!(observable instanceof ObservableState)) {
        throw new TypeError(
          "Expected observable to be an instance of ObservableState"
        );
      }
      const conversionMethods = {
        valueOf() {
          return observable.value;
        },
        toString() {
          return String(observable.value);
        },
        toJSON() {
          return observable.value;
        },
        [Symbol.toPrimitive](hint) {
          if (hint === "number") {
            return Number(observable.value);
          }
          if (hint === "string") {
            return String(observable.value);
          }
          return observable.value;
        }
      };
      return new Proxy(observable, {
        get: (target, property, receiver) => {
          if (property === "valueOf" || property === "toString" || property === "toJSON" || property === Symbol.toPrimitive) {
            return conversionMethods[property];
          }
          let propertyType;
          if (typeof target[property] === "function") {
            propertyType = "targetFunction";
          } else if (property in target) {
            propertyType = "targetProperty";
          } else if (typeof target.value[property] === "function") {
            propertyType = "valueFunction";
          } else {
            propertyType = "valueProperty";
          }
          switch (propertyType) {
            case "targetFunction":
              return target[property].bind(target);
            case "targetProperty":
              return _deepClone(target[property]);
            case "valueFunction":
              return (...args) => target.value[property](...args);
            case "valueProperty":
              return _deepClone(target.value[property]);
            default:
              console.warn(`Unexpected property type: ${propertyType}`);
              return void 0;
          }
        },
        set: (target, property, value, receiver) => {
          if (property in target) {
            if (typeof target[property] === "object" && target[property] !== null && typeof value === "object" && value !== null) {
              if (_deepEqual(target[property], value)) {
                return true;
              }
            } else if (target[property] === value) {
              return true;
            }
            target[property] = value;
          } else {
            const oldValue = target.value[property];
            if (typeof oldValue === "object" && oldValue !== null && typeof value === "object" && value !== null) {
              if (_deepEqual(oldValue, value)) {
                return true;
              }
            } else if (oldValue === value) {
              return true;
            }
            target.value[property] = value;
          }
          target.update(() => target.value);
          return true;
        },
        deleteProperty: (target, property) => {
          if (property in target.value) {
            delete target.value[property];
            target.update(() => target.value);
            return true;
          }
          return false;
        },
        ownKeys: (target) => {
          return Reflect.ownKeys(target.value);
        },
        has: (target, property) => {
          return property in target.value || property in target;
        },
        defineProperty: (target, property, descriptor) => {
          if (property in target) {
            return Reflect.defineProperty(target, property, descriptor);
          } else {
            const result = Reflect.defineProperty(target.value, property, descriptor);
            if (result) {
              target.update(() => target.value);
            }
            return result;
          }
        },
        getOwnPropertyDescriptor: (target, property) => {
          if (property in target) {
            return Reflect.getOwnPropertyDescriptor(target, property);
          }
          return Reflect.getOwnPropertyDescriptor(target.value, property);
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
        const transformFn = typeof parseFn === "function" ? parseFn : (v4) => v4;
        attrValue = produce(attrValue, transformFn);
        const observable = this.__observable(attrValue, attrName);
        if (this.__isObjectOrArray(observable.value)) {
          this.__createObservablePropertyForObjOrArr(
            this,
            attrName,
            observable,
            true
          );
        } else {
          this.__createObservablePropertyForPrimitive(
            this,
            attrName,
            observable,
            true
          );
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
      this.effect(() => {
        this.render();
      });
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
        throw new TypeError(
          "Expected observable to be an instance of ObservableState"
        );
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
        throw new TypeError(
          "Expected observable to be an instance of ObservableState"
        );
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
        const keys = Object.keys(this);
        const keysLen = keys.length;
        for (let i5 = 0; i5 < keysLen; i5++) {
          const key = keys[i5];
          const value = this[key];
          if (typeof value !== "function" && !key.startsWith("__")) {
            if (value instanceof Observable) {
              continue;
            } else {
              const observable = this.__observable(value, key);
              if (this.__isObjectOrArray(observable.value)) {
                this.__createObservablePropertyForObjOrArr(this, key, observable);
              } else {
                this.__createObservablePropertyForPrimitive(
                  this,
                  key,
                  observable
                );
              }
            }
          }
        }
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
        throw new Error(
          `[Cami.js] The value of type ${type} is not allowed in observables. Only primitive values, arrays, and plain objects are allowed.`
        );
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
        throw new TypeError(
          "Expected observableState to be an instance of ObservableState"
        );
      }
      this.__unsubscribers.set(observableState, () => {
        const dispose = observableState.dispose;
        if (typeof dispose === "function") {
          dispose.call(observableState);
        }
      });
    }
    afterRender() {
    }
    /**
     * @method
     * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
     * Uses memoization to avoid unnecessary rendering when the template result hasn't changed.
     * @returns {void}
     */
    render() {
      if (typeof this.template === "function") {
        const template = this.template();
        if (this.__prevTemplate === template)
          return;
        if (this.__prevTemplate && _deepEqual(this.__prevTemplate, template)) {
          return;
        }
        this.__prevTemplate = template;
        B(template, this);
        this.afterRender();
      }
    }
    warnIfMissingProperties(properties) {
      const missingProperties = properties.filter((prop) => !(prop in this));
      if (missingProperties.length > 0) {
        console.warn(`Missing required properties: ${missingProperties.join(", ")}`);
      }
    }
  };

  // src/observables/url-store.js
  var URLStore = class extends Observable {
    constructor({ onInit = null, onChange = null } = {}) {
      super();
      this._state = this.__parseURL();
      this.__name = "URLStore";
      this.__onChange = onChange;
      this.__routes = /* @__PURE__ */ new Map();
      this.__resourceLoaders = /* @__PURE__ */ new Map();
      this.__activeRoute = null;
      this.__navigationState = {
        isPending: false,
        isLoading: false
      };
      this.__persistentParams = /* @__PURE__ */ new Set();
      this.__beforeNavigateHooks = [];
      this.__afterNavigateHooks = [];
      this.__initialize(onInit).then(() => {
        if (this.__onChange) {
          this.subscribe(this.__onChange);
          this.__onChange(this._state);
        }
        window.addEventListener("load", () => this.__updateStore());
        window.addEventListener("hashchange", () => this.__updateStore());
      });
    }
    /**
     * Register a route with associated resource dependencies
     */
    registerRoute(pattern, options = {}) {
      const { resources = [], params = {}, onEnter, onLeave } = options;
      const segments = pattern.split("/").filter(Boolean);
      const paramNames = segments.filter((segment) => segment.startsWith(":")).map((segment) => segment.substring(1));
      if (params) {
        Object.entries(params).forEach(([paramName, paramConfig]) => {
          if (paramConfig.persist) {
            this.__persistentParams.add(paramName);
          }
        });
      }
      this.__routes.set(pattern, {
        pattern,
        segments,
        paramNames,
        resources,
        params,
        onEnter,
        onLeave
      });
      return this;
    }
    /**
     * Register a resource loader function
     */
    registerResourceLoader(resourceName, loaderFn) {
      this.__resourceLoaders.set(resourceName, loaderFn);
      return this;
    }
    /**
     * Add a hook to be executed before navigation
     */
    beforeNavigate(hookFn) {
      this.__beforeNavigateHooks.push(hookFn);
      return this;
    }
    /**
     * Add a hook to be executed after navigation
     */
    afterNavigate(hookFn) {
      this.__afterNavigateHooks.push(hookFn);
      return this;
    }
    __initialize(onInit) {
      return __async(this, null, function* () {
        if (onInit) {
          try {
            yield onInit(this._state);
          } catch (error) {
            console.error("Error in URLStore initialization:", error);
          }
        }
      });
    }
    __parseURL() {
      const hash = window.location.hash.slice(1);
      const [hashPathAndParams, hashParamsString] = hash.split("#");
      const [hashPath, queryString] = hashPathAndParams.split("?");
      const hashPaths = hashPath.split("/").filter(Boolean);
      const params = {};
      const hashParams = {};
      if (queryString) {
        new URLSearchParams(queryString).forEach((value, key) => {
          params[key] = value;
        });
      }
      if (hashParamsString) {
        new URLSearchParams(hashParamsString).forEach((value, key) => {
          hashParams[key] = value;
        });
      }
      return { params, hashPaths, hashParams };
    }
    /**
     * Find a matching route for the given path segments
     */
    __findMatchingRoute(pathSegments) {
      for (const [pattern, route] of this.__routes.entries()) {
        if (route.segments.length !== pathSegments.length)
          continue;
        let isMatch = true;
        const extractedParams = {};
        for (let i5 = 0; i5 < route.segments.length; i5++) {
          const routeSegment = route.segments[i5];
          const pathSegment = pathSegments[i5];
          if (routeSegment.startsWith(":")) {
            const paramName = routeSegment.substring(1);
            extractedParams[paramName] = pathSegment;
          } else if (routeSegment !== pathSegment) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          return __spreadProps(__spreadValues({}, route), { extractedParams });
        }
      }
      return null;
    }
    __updateStore() {
      return __async(this, null, function* () {
        var _a3, _b;
        if (this.__navigationState.isPending)
          return;
        const urlState = this.__parseURL();
        if (_deepEqual(this._state, urlState))
          return;
        this.__navigationState.isPending = true;
        try {
          const matchingRoute = this.__findMatchingRoute(urlState.hashPaths);
          for (const hook of this.__beforeNavigateHooks) {
            yield hook({
              from: this._state,
              to: urlState,
              route: matchingRoute
            });
          }
          if (((_a3 = matchingRoute == null ? void 0 : matchingRoute.resources) == null ? void 0 : _a3.length) > 0) {
            this.__navigationState.isLoading = true;
            urlState.routeParams = __spreadValues({}, matchingRoute.extractedParams);
            this._state = __spreadValues({}, urlState);
            this.next(this._state);
            yield this.__loadResources(matchingRoute, urlState);
          }
          if ((_b = this.__activeRoute) == null ? void 0 : _b.onLeave) {
            yield this.__activeRoute.onLeave({
              from: this._state,
              to: urlState
            });
          }
          this.__activeRoute = matchingRoute;
          this._state = urlState;
          this.next(urlState);
          if (matchingRoute == null ? void 0 : matchingRoute.onEnter) {
            yield matchingRoute.onEnter({
              state: urlState,
              params: matchingRoute.extractedParams
            });
          }
          for (const hook of this.__afterNavigateHooks) {
            yield hook({
              from: this._state,
              to: urlState,
              route: matchingRoute
            });
          }
        } catch (error) {
          console.error("Error in navigation:", error);
        } finally {
          this.__navigationState.isPending = false;
          this.__navigationState.isLoading = false;
        }
      });
    }
    /**
     * Load resources required by a route
     */
    __loadResources(route, urlState) {
      return __async(this, null, function* () {
        if (!route.resources || route.resources.length === 0)
          return;
        const context = {
          route,
          params: __spreadValues(__spreadValues({}, urlState.params), urlState.routeParams),
          url: window.location.hash
        };
        yield Promise.all(
          route.resources.map((resourceName) => __async(this, null, function* () {
            const loader = this.__resourceLoaders.get(resourceName);
            if (!loader)
              return;
            try {
              yield loader(context);
            } catch (error) {
              console.error(`Error loading resource ${resourceName}:`, error);
              throw error;
            }
          }))
        );
      });
    }
    getState() {
      if (DependencyTracker.current) {
        DependencyTracker.current.addDependency(this);
      }
      return this._state;
    }
    /**
     * Check if currently in a loading state
     */
    isLoading() {
      return this.__navigationState.isLoading;
    }
    /**
     * Navigate to a URL
     */
    navigate(options = {}) {
      const {
        path,
        params = {},
        hashParams = {},
        focusSelector,
        pageTitle,
        announcement,
        updateCurrentPage = true,
        fullReplace = false
      } = options;
      if (this.__navigationState.isPending) {
        setTimeout(() => this.navigate(options), 100);
        return;
      }
      let newUrl = new URL(window.location.href);
      let newHash = "#";
      const currentState = this.getState();
      const hashPaths = path !== void 0 ? path.split("/").filter(Boolean) : currentState.hashPaths;
      newHash += hashPaths.join("/");
      const searchParams = new URLSearchParams();
      const hashSearchParams = new URLSearchParams();
      if (!fullReplace) {
        Object.entries(currentState.params).forEach(([key, value]) => searchParams.set(key, value));
        Object.entries(currentState.hashParams).forEach(([key, value]) => hashSearchParams.set(key, value));
      }
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === void 0) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, value);
        }
      });
      Object.entries(hashParams).forEach(([key, value]) => {
        if (value === null || value === void 0) {
          hashSearchParams.delete(key);
        } else {
          hashSearchParams.set(key, value);
        }
      });
      const searchString = searchParams.toString();
      const hashSearchString = hashSearchParams.toString();
      if (searchString) {
        newHash += "?" + searchString;
      }
      if (hashSearchString) {
        newHash += "#" + hashSearchString;
      }
      if (newUrl.hash === newHash)
        return;
      newUrl.hash = newHash;
      window.history.pushState(null, "", newUrl.toString());
      this.__updateStore();
      if (focusSelector) {
        setTimeout(() => {
          const targetElement = document.querySelector(focusSelector);
          if (targetElement)
            targetElement.focus();
        }, 0);
      }
      if (pageTitle) {
        document.title = pageTitle;
      } else if (path) {
        const domain = window.location.hostname;
        const formattedDomain = domain.split(".").map(
          (segment) => segment.charAt(0).toUpperCase() + segment.slice(1)
        ).join(".");
        const pathSegments = path.split("/").filter(Boolean);
        const formattedPath = pathSegments.map(
          (segment) => segment.charAt(0).toUpperCase() + segment.slice(1)
        ).join(" - ");
        document.title = `${formattedDomain} | ${formattedPath}`;
      }
      if (announcement) {
        const liveRegion = document.getElementById("liveRegion");
        if (liveRegion) {
          liveRegion.textContent = announcement;
        }
      } else if (path) {
        const pathSegments = path.split("/").filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1] || "home page";
        const liveRegion = document.getElementById("liveRegion");
        if (liveRegion) {
          liveRegion.textContent = `Navigated to ${lastSegment}`;
        }
      }
      if (updateCurrentPage) {
        document.querySelectorAll('[aria-current="page"]').forEach((el) => el.removeAttribute("aria-current"));
        const currentPageLink = document.querySelector(`a[href="#/${path}"]`);
        if (currentPageLink) {
          currentPageLink.setAttribute("aria-current", "page");
        }
      }
    }
    matches(stateSlice) {
      const currentState = this.getState();
      for (const key in stateSlice) {
        if (Object.hasOwn(stateSlice, key)) {
          if (key === "hashPaths") {
            if (!this._isArrayPrefix(currentState.hashPaths, stateSlice.hashPaths)) {
              return false;
            }
          } else if (["params", "hashParams"].includes(key)) {
            for (const paramKey in stateSlice[key]) {
              const currentValue = currentState[key][paramKey];
              const sliceValue = stateSlice[key][paramKey];
              if (typeof currentValue === "object" && currentValue !== null && typeof sliceValue === "object" && sliceValue !== null) {
                if (!_deepEqual(currentValue, sliceValue)) {
                  return false;
                }
              } else if (currentValue !== sliceValue) {
                return false;
              }
            }
          } else {
            const currentValue = currentState[key];
            const sliceValue = stateSlice[key];
            if (typeof currentValue === "object" && currentValue !== null && typeof sliceValue === "object" && sliceValue !== null) {
              if (!_deepEqual(currentValue, sliceValue)) {
                return false;
              }
            } else if (currentValue !== sliceValue) {
              return false;
            }
          }
        }
      }
      return true;
    }
    isEmpty() {
      const { hashPaths, params, hashParams } = this.getState();
      return hashPaths.length === 0 && Object.keys(params).length === 0 && Object.keys(hashParams).length === 0 && !hashPaths.some((path) => path.trim() !== "");
    }
    _isArrayPrefix(arr, prefix) {
      if (prefix.length > arr.length)
        return false;
      return prefix.every((value, index) => value === arr[index]);
    }
  };
  var urlStoreInstance = null;
  var createURLStore = (options = {}) => {
    if (!urlStoreInstance) {
      urlStoreInstance = new URLStore(options);
    } else if (options.onChange) {
      urlStoreInstance.subscribe(options.onChange);
    }
    return urlStoreInstance;
  };

  // src/storage/adapters.js
  function unproxify(obj) {
    const getType = (value) => {
      if (typeof value !== "object" || value === null)
        return "primitive";
      if (Array.isArray(value))
        return "array";
      return "object";
    };
    switch (getType(obj)) {
      case "primitive":
        return obj;
      case "array":
        return obj.map(unproxify);
      case "object":
        const result = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = unproxify(obj[key]);
          }
        }
        return result;
      default:
        throw new Error(`Unsupported type: ${getType(obj)}`);
    }
  }
  function updateDeep(obj, path, value) {
    const [head, ...rest] = path;
    const type = rest.length === 0 ? "terminal" : "recursive";
    switch (type) {
      case "terminal":
        return __spreadProps(__spreadValues({}, obj), { [head]: value });
      case "recursive":
        return __spreadProps(__spreadValues({}, obj), {
          [head]: updateDeep(obj[head] || {}, rest, value)
        });
      default:
        throw new Error(`Unsupported path type: ${type}`);
    }
  }
  function createIdbPromise({
    name,
    version,
    storeName,
    keyPath,
    indexName
  }) {
    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("name must be a non-empty string");
    }
    if (!Number.isInteger(version) || version <= 0) {
      throw new Error("version must be a positive integer");
    }
    if (typeof storeName !== "string" || storeName.trim() === "") {
      throw new Error("storeName must be a non-empty string");
    }
    if (typeof keyPath !== "string" || keyPath.trim() === "") {
      throw new Error("keyPath must be a non-empty string");
    }
    if (typeof indexName !== "string" || indexName.trim() === "") {
      throw new Error("indexName must be a non-empty string");
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onerror = (event) => reject("IndexedDB error: " + event.target.error);
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve({
          /**
           * Retrieves data from the IndexedDB store based on the provided options.
           * @param {Object} [options={}] - Query options for retrieving data.
           * @param {string} [options.type='all'] - The type of query to perform. Can be one of:
           *   'key', 'index', 'all', 'range', 'cursor', 'count', 'keys', or 'unique'.
           * @param {*} [options.key] - The key to retrieve when type is 'key'.
           *   Example: { type: 'key', key: 123 }
           * @param {string} [options.index] - The name of the index to use for 'index', 'range', 'cursor', 'count', 'keys', or 'unique' queries.
           *   Example: { type: 'index', index: 'nameIndex', value: 'John' }
           * @param {*} [options.value] - The value to search for in an index query.
           *   Example: { type: 'index', index: 'ageIndex', value: 30 }
           * @param {*} [options.lower] - The lower bound for a range query.
           *   Example: { type: 'range', index: 'dateIndex', lower: '2023-01-01', upper: '2023-12-31' }
           * @param {*} [options.upper] - The upper bound for a range query.
           *   Example: { type: 'range', index: 'priceIndex', lower: 10, upper: 100 }
           * @param {boolean} [options.lowerOpen] - Whether the lower bound is open in a range query.
           *   Example: { type: 'range', index: 'scoreIndex', lower: 50, upper: 100, lowerOpen: true }
           * @param {boolean} [options.upperOpen] - Whether the upper bound is open in a range query.
           *   Example: { type: 'range', index: 'scoreIndex', lower: 50, upper: 100, upperOpen: true }
           * @param {IDBKeyRange} [options.range] - The key range for cursor, count, or keys queries.
           *   Example: { type: 'cursor', range: IDBKeyRange.bound(50, 100) }
           * @param {IDBCursorDirection} [options.direction] - The direction for a cursor query.
           *   Example: { type: 'cursor', range: IDBKeyRange.lowerBound(50), direction: 'prev' }
           * @param {number} [options.limit] - The maximum number of results to return for a unique query.
           *   Example: { type: 'unique', index: 'categoryIndex', limit: 5 }
           * @returns {Promise<*>} A promise that resolves with the query results.
           *
           * Examples:
           * - Get all records: { type: 'all' }
           * - Count records: { type: 'count', range: IDBKeyRange.lowerBound(18) }
           * - Get keys: { type: 'keys', index: 'dateIndex', range: IDBKeyRange.bound('2023-01-01', '2023-12-31') }
           */
          getState: (..._0) => __async(this, [..._0], function* (options = { type: "all" }) {
            const buildIdbRequest = ({ store: store2, options: options2 }) => {
              switch (options2.type) {
                case "key":
                  if (typeof options2.key === "undefined") {
                    throw new Error("Key must be provided for key-based query");
                  }
                  return store2.get(options2.key);
                case "index":
                  if (typeof options2.index === "undefined" || typeof options2.value === "undefined") {
                    throw new Error("Index and value must be provided for index-based query");
                  }
                  const index = store2.index(options2.index);
                  return index.getAll(options2.value);
                case "all":
                  return store2.getAll();
                case "range":
                  const range = IDBKeyRange.bound(options2.lower, options2.upper, options2.lowerOpen, options2.upperOpen);
                  return options2.index ? store2.index(options2.index).getAll(range) : store2.getAll(range);
                case "cursor":
                  const cursorRequest = options2.index ? store2.index(options2.index).openCursor(options2.range, options2.direction) : store2.openCursor(options2.range, options2.direction);
                  return new Promise((resolve2, reject2) => {
                    const results = [];
                    cursorRequest.onsuccess = (event2) => {
                      const cursor = event2.target.result;
                      if (cursor) {
                        results.push(cursor.value);
                        cursor.continue();
                      } else {
                        resolve2(results);
                      }
                    };
                    cursorRequest.onerror = reject2;
                  });
                case "count":
                  return options2.index ? store2.index(options2.index).count(options2.range) : store2.count(options2.range);
                case "keys":
                  return options2.index ? store2.index(options2.index).getAllKeys(options2.range) : store2.getAllKeys(options2.range);
                case "unique":
                  if (!options2.index)
                    throw new Error("Index must be specified for unique query");
                  return store2.index(options2.index).getAll(options2.range, options2.limit);
                default:
                  throw new Error(`Unsupported query type: ${options2.type}`);
              }
            };
            return new Promise((resolveQuery, rejectQuery) => {
              const tx = db.transaction(storeName, "readonly");
              const store2 = tx.objectStore(storeName);
              const request2 = buildIdbRequest({ store: store2, options });
              request2.onsuccess = (event2) => resolveQuery(event2.target.result);
              request2.onerror = (event2) => rejectQuery(event2.target.error);
            });
          }),
          transaction: (mode) => db.transaction(storeName, mode),
          storeName
        });
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const oldVersion = event.oldVersion;
        const upgradeType = (() => {
          if (oldVersion === 0)
            return "create";
          if (oldVersion < version)
            return "recreate";
          return "update";
        })();
        switch (upgradeType) {
          case "create":
            const store2 = db.createObjectStore(storeName, { keyPath, autoIncrement: true });
            store2.createIndex(indexName, indexName, { unique: false });
            break;
          case "recreate":
            db.deleteObjectStore(storeName);
            upgradeActions.create();
            break;
          case "update":
            console.log("Database is up to date");
            break;
          default:
            throw new Error(`Unsupported upgrade type: ${upgradeType}`);
        }
      };
    });
  }
  function persistToIdbThunk({
    fromStateKey,
    toIDBStore
  }) {
    return (_0) => __async(this, [_0], function* ({ action, patches }) {
      if (!Array.isArray(patches)) {
        throw new Error("patches must be an array");
      }
      return new Promise((resolve, reject) => {
        const tx = toIDBStore.transaction("readwrite");
        const store2 = tx.objectStore(toIDBStore.storeName);
        const updateLogs = [];
        const relevantPatches = patches.filter((patch) => {
          const pathArray = Array.isArray(patch.path) ? patch.path : patch.path.split("/").filter(Boolean);
          return pathArray.join(".").startsWith(fromStateKey);
        });
        if (relevantPatches.length === 0) {
          resolve();
          return;
        }
        let state = null;
        const getState = () => {
          if (state === null) {
            return new Promise((resolveState) => {
              store2.getAll().onsuccess = (event) => {
                state = event.target.result;
                resolveState(state);
              };
            });
          }
          return Promise.resolve(state);
        };
        const applyPatches2 = () => __async(this, null, function* () {
          const getOperationType = (patch, relativePath) => {
            if (relativePath.length === 0)
              return patch.op === "remove" ? "removeAll" : "replaceAll";
            const index = parseInt(relativePath[0], 10);
            if (isNaN(index))
              return "invalid";
            if (relativePath.length === 1)
              return patch.op === "remove" ? "removeAtIndex" : "modifyAtIndex";
            return "modifyNested";
          };
          for (const patch of relevantPatches) {
            const pathArray = Array.isArray(patch.path) ? patch.path : patch.path.split("/").filter(Boolean);
            const relativePath = pathArray.slice(fromStateKey.split(".").length);
            state = yield getState();
            const operationType = getOperationType(patch, relativePath);
            const index = parseInt(relativePath[0], 10);
            switch (operationType) {
              case "replaceAll":
                updateLogs.push(`replaced entire data array with ${patch.value.length} items`);
                state = unproxify(patch.value);
                break;
              case "removeAll":
                updateLogs.push("removed all items");
                state = [];
                break;
              case "modifyAtIndex":
                updateLogs.push(`${patch.op === "add" ? "added" : "replaced"} item at index ${index}`);
                state = [
                  ...state.slice(0, index),
                  unproxify(patch.value),
                  ...state.slice(index + 1)
                ];
                break;
              case "removeAtIndex":
                updateLogs.push(`removed item at index ${index}`);
                state = [
                  ...state.slice(0, index),
                  ...state.slice(index + 1)
                ];
                break;
              case "modifyNested":
                updateLogs.push(`updated ${relativePath.join(".")} of item at index ${index}`);
                state = [
                  ...state.slice(0, index),
                  updateDeep(state[index], relativePath.slice(1), unproxify(patch.value)),
                  ...state.slice(index + 1)
                ];
                break;
              case "invalid":
                console.warn("Invalid index:", relativePath[0]);
                break;
              default:
                console.warn("Unsupported operation:", patch.op);
            }
          }
          yield new Promise((resolveDelete) => {
            const deleteRequest = store2.clear();
            deleteRequest.onsuccess = resolveDelete;
          });
          for (const item of state) {
            yield new Promise((resolvePut) => {
              const putRequest = store2.put(item);
              putRequest.onsuccess = resolvePut;
            });
          }
        });
        applyPatches2().then(() => {
          tx.oncomplete = () => {
            const updateLogsSummary = updateLogs.join(", ");
            __trace(`indexdb:oncomplete`, `Mutated ${toIDBStore.storeName} object store with ${updateLogsSummary}`);
            resolve();
          };
        }).catch(reject);
        tx.onerror = (event) => reject(event.target.error);
      });
    });
  }
  var VERSION_KEY_PREFIX = "__cami_ls_version_";
  function createLocalStorage({
    name,
    version
  }) {
    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("name must be a non-empty string");
    }
    if (!Number.isInteger(version) || version <= 0) {
      throw new Error("version must be a positive integer");
    }
    const versionKey = `${VERSION_KEY_PREFIX}${name}`;
    const checkVersion = () => {
      const storedVersion = localStorage.getItem(versionKey);
      if (storedVersion === null) {
        localStorage.setItem(versionKey, version.toString());
        return "create";
      }
      if (parseInt(storedVersion, 10) < version) {
        localStorage.setItem(versionKey, version.toString());
        return "update";
      }
      return "current";
    };
    const versionStatus = checkVersion();
    if (versionStatus === "update") {
      localStorage.removeItem(name);
      __trace(`localStorage:version`, `Updated ${name} from version ${localStorage.getItem(versionKey)} to ${version}`);
    } else if (versionStatus === "create") {
      __trace(`localStorage:version`, `Created ${name} with version ${version}`);
    }
    return {
      getState: () => __async(this, null, function* () {
        return new Promise((resolve) => {
          const data = localStorage.getItem(name);
          resolve(data ? JSON.parse(data) : null);
        });
      }),
      setState: (state) => __async(this, null, function* () {
        return new Promise((resolve) => {
          localStorage.setItem(name, JSON.stringify(state));
          resolve();
        });
      }),
      name,
      version
    };
  }
  function persistToLocalStorageThunk(toLocalStorage) {
    return (_0) => __async(this, [_0], function* ({ action, state, previousState }) {
      if (state !== previousState) {
        yield toLocalStorage.setState(state);
        __trace(`localStorage:update`, `Updated ${toLocalStorage.name} with entire state`);
      }
    });
  }

  // src/cami.js
  enableMapSet();
  var { debug, events } = __config;
  return __toCommonJS(cami_exports);
})();
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * cami.js
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

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/keyed.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=cami.cdn.js.map
