var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
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
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e4) {
        reject(e4);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e4) {
        reject(e4);
      }
    };
    var step = (x2) => x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/lit-html/lit-html.js
var t = globalThis;
var i = t.trustedTypes;
var s = i ? i.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
var e = "$lit$";
var h = `lit$${Math.random().toFixed(9).slice(2)}$`;
var o = "?" + h;
var n = `<${o}>`;
var r = document;
var l = () => r.createComment("");
var c = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
var a = Array.isArray;
var u = (t4) => a(t4) || "function" == typeof (t4 == null ? void 0 : t4[Symbol.iterator]);
var d = "[ 	\n\f\r]";
var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var p = /'/g;
var g = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var y = (t4) => (i4, ...s3) => ({ _$litType$: t4, strings: i4, values: s3 });
var x = y(1);
var b = y(2);
var w = y(3);
var T = Symbol.for("lit-noChange");
var E = Symbol.for("lit-nothing");
var A = /* @__PURE__ */ new WeakMap();
var C = r.createTreeWalker(r, 129);
function P(t4, i4) {
  if (!a(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s ? s.createHTML(i4) : i4;
}
var V = (t4, i4) => {
  const s3 = t4.length - 1, o3 = [];
  let r3, l2 = 2 === i4 ? "<svg>" : 3 === i4 ? "<math>" : "", c3 = f;
  for (let i5 = 0; i5 < s3; i5++) {
    const s4 = t4[i5];
    let a2, u4, d2 = -1, y2 = 0;
    for (; y2 < s4.length && (c3.lastIndex = y2, u4 = c3.exec(s4), null !== u4); ) y2 = c3.lastIndex, c3 === f ? "!--" === u4[1] ? c3 = v : void 0 !== u4[1] ? c3 = _ : void 0 !== u4[2] ? ($.test(u4[2]) && (r3 = RegExp("</" + u4[2], "g")), c3 = m) : void 0 !== u4[3] && (c3 = m) : c3 === m ? ">" === u4[0] ? (c3 = r3 != null ? r3 : f, d2 = -1) : void 0 === u4[1] ? d2 = -2 : (d2 = c3.lastIndex - u4[2].length, a2 = u4[1], c3 = void 0 === u4[3] ? m : '"' === u4[3] ? g : p) : c3 === g || c3 === p ? c3 = m : c3 === v || c3 === _ ? c3 = f : (c3 = m, r3 = void 0);
    const x2 = c3 === m && t4[i5 + 1].startsWith("/>") ? " " : "";
    l2 += c3 === f ? s4 + n : d2 >= 0 ? (o3.push(a2), s4.slice(0, d2) + e + s4.slice(d2) + h + x2) : s4 + h + (-2 === d2 ? i5 : x2);
  }
  return [P(t4, l2 + (t4[s3] || "<?>") + (2 === i4 ? "</svg>" : 3 === i4 ? "</math>" : "")), o3];
};
var N = class _N {
  constructor({ strings: t4, _$litType$: s3 }, n2) {
    let r3;
    this.parts = [];
    let c3 = 0, a2 = 0;
    const u4 = t4.length - 1, d2 = this.parts, [f2, v3] = V(t4, s3);
    if (this.el = _N.createElement(f2, n2), C.currentNode = this.el.content, 2 === s3 || 3 === s3) {
      const t5 = this.el.content.firstChild;
      t5.replaceWith(...t5.childNodes);
    }
    for (; null !== (r3 = C.nextNode()) && d2.length < u4; ) {
      if (1 === r3.nodeType) {
        if (r3.hasAttributes()) for (const t5 of r3.getAttributeNames()) if (t5.endsWith(e)) {
          const i4 = v3[a2++], s4 = r3.getAttribute(t5).split(h), e4 = /([.?@])?(.*)/.exec(i4);
          d2.push({ type: 1, index: c3, name: e4[2], strings: s4, ctor: "." === e4[1] ? H : "?" === e4[1] ? I : "@" === e4[1] ? L : k }), r3.removeAttribute(t5);
        } else t5.startsWith(h) && (d2.push({ type: 6, index: c3 }), r3.removeAttribute(t5));
        if ($.test(r3.tagName)) {
          const t5 = r3.textContent.split(h), s4 = t5.length - 1;
          if (s4 > 0) {
            r3.textContent = i ? i.emptyScript : "";
            for (let i4 = 0; i4 < s4; i4++) r3.append(t5[i4], l()), C.nextNode(), d2.push({ type: 2, index: ++c3 });
            r3.append(t5[s4], l());
          }
        }
      } else if (8 === r3.nodeType) if (r3.data === o) d2.push({ type: 2, index: c3 });
      else {
        let t5 = -1;
        for (; -1 !== (t5 = r3.data.indexOf(h, t5 + 1)); ) d2.push({ type: 7, index: c3 }), t5 += h.length - 1;
      }
      c3++;
    }
  }
  static createElement(t4, i4) {
    const s3 = r.createElement("template");
    return s3.innerHTML = t4, s3;
  }
};
function S(t4, i4, s3 = t4, e4) {
  var _a2, _b, _c;
  if (i4 === T) return i4;
  let h2 = void 0 !== e4 ? (_a2 = s3._$Co) == null ? void 0 : _a2[e4] : s3._$Cl;
  const o3 = c(i4) ? void 0 : i4._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o3 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o3 ? h2 = void 0 : (h2 = new o3(t4), h2._$AT(t4, s3, e4)), void 0 !== e4 ? ((_c = s3._$Co) != null ? _c : s3._$Co = [])[e4] = h2 : s3._$Cl = h2), void 0 !== h2 && (i4 = S(t4, h2._$AS(t4, i4.values), h2, e4)), i4;
}
var M = class {
  constructor(t4, i4) {
    this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i4;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t4) {
    var _a2;
    const { el: { content: i4 }, parts: s3 } = this._$AD, e4 = ((_a2 = t4 == null ? void 0 : t4.creationScope) != null ? _a2 : r).importNode(i4, true);
    C.currentNode = e4;
    let h2 = C.nextNode(), o3 = 0, n2 = 0, l2 = s3[0];
    for (; void 0 !== l2; ) {
      if (o3 === l2.index) {
        let i5;
        2 === l2.type ? i5 = new R(h2, h2.nextSibling, this, t4) : 1 === l2.type ? i5 = new l2.ctor(h2, l2.name, l2.strings, this, t4) : 6 === l2.type && (i5 = new z(h2, this, t4)), this._$AV.push(i5), l2 = s3[++n2];
      }
      o3 !== (l2 == null ? void 0 : l2.index) && (h2 = C.nextNode(), o3++);
    }
    return C.currentNode = r, e4;
  }
  p(t4) {
    let i4 = 0;
    for (const s3 of this._$AV) void 0 !== s3 && (void 0 !== s3.strings ? (s3._$AI(t4, s3, i4), i4 += s3.strings.length - 2) : s3._$AI(t4[i4])), i4++;
  }
};
var R = class _R {
  get _$AU() {
    var _a2, _b;
    return (_b = (_a2 = this._$AM) == null ? void 0 : _a2._$AU) != null ? _b : this._$Cv;
  }
  constructor(t4, i4, s3, e4) {
    var _a2;
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t4, this._$AB = i4, this._$AM = s3, this.options = e4, this._$Cv = (_a2 = e4 == null ? void 0 : e4.isConnected) != null ? _a2 : true;
  }
  get parentNode() {
    let t4 = this._$AA.parentNode;
    const i4 = this._$AM;
    return void 0 !== i4 && 11 === (t4 == null ? void 0 : t4.nodeType) && (t4 = i4.parentNode), t4;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t4, i4 = this) {
    t4 = S(this, t4, i4), c(t4) ? t4 === E || null == t4 || "" === t4 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t4 !== this._$AH && t4 !== T && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : u(t4) ? this.k(t4) : this._(t4);
  }
  O(t4) {
    return this._$AA.parentNode.insertBefore(t4, this._$AB);
  }
  T(t4) {
    this._$AH !== t4 && (this._$AR(), this._$AH = this.O(t4));
  }
  _(t4) {
    this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(r.createTextNode(t4)), this._$AH = t4;
  }
  $(t4) {
    var _a2;
    const { values: i4, _$litType$: s3 } = t4, e4 = "number" == typeof s3 ? this._$AC(t4) : (void 0 === s3.el && (s3.el = N.createElement(P(s3.h, s3.h[0]), this.options)), s3);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e4) this._$AH.p(i4);
    else {
      const t5 = new M(e4, this), s4 = t5.u(this.options);
      t5.p(i4), this.T(s4), this._$AH = t5;
    }
  }
  _$AC(t4) {
    let i4 = A.get(t4.strings);
    return void 0 === i4 && A.set(t4.strings, i4 = new N(t4)), i4;
  }
  k(t4) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i4 = this._$AH;
    let s3, e4 = 0;
    for (const h2 of t4) e4 === i4.length ? i4.push(s3 = new _R(this.O(l()), this.O(l()), this, this.options)) : s3 = i4[e4], s3._$AI(h2), e4++;
    e4 < i4.length && (this._$AR(s3 && s3._$AB.nextSibling, e4), i4.length = e4);
  }
  _$AR(t4 = this._$AA.nextSibling, i4) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i4); t4 && t4 !== this._$AB; ) {
      const i5 = t4.nextSibling;
      t4.remove(), t4 = i5;
    }
  }
  setConnected(t4) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t4, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t4));
  }
};
var k = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t4, i4, s3, e4, h2) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t4, this.name = i4, this._$AM = e4, this.options = h2, s3.length > 2 || "" !== s3[0] || "" !== s3[1] ? (this._$AH = Array(s3.length - 1).fill(new String()), this.strings = s3) : this._$AH = E;
  }
  _$AI(t4, i4 = this, s3, e4) {
    const h2 = this.strings;
    let o3 = false;
    if (void 0 === h2) t4 = S(this, t4, i4, 0), o3 = !c(t4) || t4 !== this._$AH && t4 !== T, o3 && (this._$AH = t4);
    else {
      const e5 = t4;
      let n2, r3;
      for (t4 = h2[0], n2 = 0; n2 < h2.length - 1; n2++) r3 = S(this, e5[s3 + n2], i4, n2), r3 === T && (r3 = this._$AH[n2]), o3 || (o3 = !c(r3) || r3 !== this._$AH[n2]), r3 === E ? t4 = E : t4 !== E && (t4 += (r3 != null ? r3 : "") + h2[n2 + 1]), this._$AH[n2] = r3;
    }
    o3 && !e4 && this.j(t4);
  }
  j(t4) {
    t4 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 != null ? t4 : "");
  }
};
var H = class extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t4) {
    this.element[this.name] = t4 === E ? void 0 : t4;
  }
};
var I = class extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t4) {
    this.element.toggleAttribute(this.name, !!t4 && t4 !== E);
  }
};
var L = class extends k {
  constructor(t4, i4, s3, e4, h2) {
    super(t4, i4, s3, e4, h2), this.type = 5;
  }
  _$AI(t4, i4 = this) {
    var _a2;
    if ((t4 = (_a2 = S(this, t4, i4, 0)) != null ? _a2 : E) === T) return;
    const s3 = this._$AH, e4 = t4 === E && s3 !== E || t4.capture !== s3.capture || t4.once !== s3.once || t4.passive !== s3.passive, h2 = t4 !== E && (s3 === E || e4);
    e4 && this.element.removeEventListener(this.name, this, s3), h2 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
  }
  handleEvent(t4) {
    var _a2, _b;
    "function" == typeof this._$AH ? this._$AH.call((_b = (_a2 = this.options) == null ? void 0 : _a2.host) != null ? _b : this.element, t4) : this._$AH.handleEvent(t4);
  }
};
var z = class {
  constructor(t4, i4, s3) {
    this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s3;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t4) {
    S(this, t4);
  }
};
var Z = { M: e, P: h, A: o, C: 1, L: V, R: M, D: u, V: S, I: R, H: k, N: I, U: L, B: H, F: z };
var j = t.litHtmlPolyfillSupport;
var _a;
j == null ? void 0 : j(N, R), ((_a = t.litHtmlVersions) != null ? _a : t.litHtmlVersions = []).push("3.3.0");
var B = (t4, i4, s3) => {
  var _a2, _b;
  const e4 = (_a2 = s3 == null ? void 0 : s3.renderBefore) != null ? _a2 : i4;
  let h2 = e4._$litPart$;
  if (void 0 === h2) {
    const t5 = (_b = s3 == null ? void 0 : s3.renderBefore) != null ? _b : null;
    e4._$litPart$ = h2 = new R(i4.insertBefore(l(), t5), t5, void 0, s3 != null ? s3 : {});
  }
  return h2._$AI(t4), h2;
};

// node_modules/lit-html/directive.js
var t2 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e2 = (t4) => (...e4) => ({ _$litDirective$: t4, values: e4 });
var i2 = class {
  constructor(t4) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t4, e4, i4) {
    this._$Ct = t4, this._$AM = e4, this._$Ci = i4;
  }
  _$AS(t4, e4) {
    return this.update(t4, e4);
  }
  update(t4, e4) {
    return this.render(...e4);
  }
};

// node_modules/lit-html/directives/unsafe-html.js
var e3 = class extends i2 {
  constructor(i4) {
    if (super(i4), this.it = E, i4.type !== t2.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r3) {
    if (r3 === E || null == r3) return this._t = void 0, this.it = r3;
    if (r3 === T) return r3;
    if ("string" != typeof r3) throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r3 === this.it) return this._t;
    this.it = r3;
    const s3 = [r3];
    return s3.raw = s3, this._t = { _$litType$: this.constructor.resultType, strings: s3, values: [] };
  }
};
e3.directiveName = "unsafeHTML", e3.resultType = 1;
var o2 = e2(e3);

// node_modules/lit-html/directive-helpers.js
var { I: t3 } = Z;
var s2 = () => document.createComment("");
var r2 = (o3, i4, n2) => {
  var _a2;
  const e4 = o3._$AA.parentNode, l2 = void 0 === i4 ? o3._$AB : i4._$AA;
  if (void 0 === n2) {
    const i5 = e4.insertBefore(s2(), l2), c3 = e4.insertBefore(s2(), l2);
    n2 = new t3(i5, c3, o3, o3.options);
  } else {
    const t4 = n2._$AB.nextSibling, i5 = n2._$AM, c3 = i5 !== o3;
    if (c3) {
      let t5;
      (_a2 = n2._$AQ) == null ? void 0 : _a2.call(n2, o3), n2._$AM = o3, void 0 !== n2._$AP && (t5 = o3._$AU) !== i5._$AU && n2._$AP(t5);
    }
    if (t4 !== l2 || c3) {
      let o4 = n2._$AA;
      for (; o4 !== t4; ) {
        const t5 = o4.nextSibling;
        e4.insertBefore(o4, l2), o4 = t5;
      }
    }
  }
  return n2;
};
var v2 = (o3, t4, i4 = o3) => (o3._$AI(t4, i4), o3);
var u2 = {};
var m2 = (o3, t4 = u2) => o3._$AH = t4;
var p2 = (o3) => o3._$AH;
var M2 = (o3) => {
  var _a2;
  (_a2 = o3._$AP) == null ? void 0 : _a2.call(o3, false, true);
  let t4 = o3._$AA;
  const i4 = o3._$AB.nextSibling;
  for (; t4 !== i4; ) {
    const o4 = t4.nextSibling;
    t4.remove(), t4 = o4;
  }
};

// node_modules/lit-html/directives/keyed.js
var i3 = e2(class extends i2 {
  constructor() {
    super(...arguments), this.key = E;
  }
  render(r3, t4) {
    return this.key = r3, t4;
  }
  update(r3, [t4, e4]) {
    return t4 !== this.key && (m2(r3), this.key = t4), e4;
  }
});

// node_modules/lit-html/directives/repeat.js
var u3 = (e4, s3, t4) => {
  const r3 = /* @__PURE__ */ new Map();
  for (let l2 = s3; l2 <= t4; l2++) r3.set(e4[l2], l2);
  return r3;
};
var c2 = e2(class extends i2 {
  constructor(e4) {
    if (super(e4), e4.type !== t2.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e4, s3, t4) {
    let r3;
    void 0 === t4 ? t4 = s3 : void 0 !== s3 && (r3 = s3);
    const l2 = [], o3 = [];
    let i4 = 0;
    for (const s4 of e4) l2[i4] = r3 ? r3(s4, i4) : i4, o3[i4] = t4(s4, i4), i4++;
    return { values: o3, keys: l2 };
  }
  render(e4, s3, t4) {
    return this.dt(e4, s3, t4).values;
  }
  update(s3, [t4, r3, c3]) {
    var _a2;
    const d2 = p2(s3), { values: p3, keys: a2 } = this.dt(t4, r3, c3);
    if (!Array.isArray(d2)) return this.ut = a2, p3;
    const h2 = (_a2 = this.ut) != null ? _a2 : this.ut = [], v3 = [];
    let m3, y2, x2 = 0, j2 = d2.length - 1, k2 = 0, w2 = p3.length - 1;
    for (; x2 <= j2 && k2 <= w2; ) if (null === d2[x2]) x2++;
    else if (null === d2[j2]) j2--;
    else if (h2[x2] === a2[k2]) v3[k2] = v2(d2[x2], p3[k2]), x2++, k2++;
    else if (h2[j2] === a2[w2]) v3[w2] = v2(d2[j2], p3[w2]), j2--, w2--;
    else if (h2[x2] === a2[w2]) v3[w2] = v2(d2[x2], p3[w2]), r2(s3, v3[w2 + 1], d2[x2]), x2++, w2--;
    else if (h2[j2] === a2[k2]) v3[k2] = v2(d2[j2], p3[k2]), r2(s3, d2[x2], d2[j2]), j2--, k2++;
    else if (void 0 === m3 && (m3 = u3(a2, k2, w2), y2 = u3(h2, x2, j2)), m3.has(h2[x2])) if (m3.has(h2[j2])) {
      const e4 = y2.get(a2[k2]), t5 = void 0 !== e4 ? d2[e4] : null;
      if (null === t5) {
        const e5 = r2(s3, d2[x2]);
        v2(e5, p3[k2]), v3[k2] = e5;
      } else v3[k2] = v2(t5, p3[k2]), r2(s3, d2[x2], t5), d2[e4] = null;
      k2++;
    } else M2(d2[j2]), j2--;
    else M2(d2[x2]), x2++;
    for (; k2 <= w2; ) {
      const e4 = r2(s3, v3[w2 + 1]);
      v2(e4, p3[k2]), v3[k2++] = e4;
    }
    for (; x2 <= j2; ) {
      const e4 = d2[x2++];
      null !== e4 && M2(e4);
    }
    return this.ut = a2, m2(s3, v3), T;
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
    const e4 = errors[error];
    const msg = typeof e4 === "function" ? e4.apply(null, args) : e4;
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
  const t4 = getArchtype(thing);
  if (t4 === 2)
    thing.set(propOrOldValue, value);
  else if (t4 === 3) {
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
  const isPlain = isPlainObject(base);
  if (strict === true || strict === "class_only" && !isPlain) {
    const descriptors = Object.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    let keys = Reflect.ownKeys(descriptors);
    for (let i4 = 0; i4 < keys.length; i4++) {
      const key = keys[i4];
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
          const p3 = [];
          const ip = [];
          getPlugin("Patches").generateReplacementPatches_(base, result, p3, ip);
          patchListener(p3, ip);
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
      const result = this.produce(base, recipe, (p3, ip) => {
        patches = p3;
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
    let i4;
    for (i4 = patches.length - 1; i4 >= 0; i4--) {
      const patch = patches[i4];
      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }
    if (i4 > -1) {
      patches = patches.slice(i4 + 1);
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
    for (let i4 = 0; i4 < base_.length; i4++) {
      if (assigned_[i4] && copy_[i4] !== base_[i4]) {
        const path = basePath.concat([i4]);
        patches.push({
          op: REPLACE,
          path,
          // Need to maybe clone it, as it can in fact be the original value
          // due to the base/copy inversion at the start of this function
          value: clonePatchValueIfNeeded(copy_[i4])
        });
        inversePatches.push({
          op: REPLACE,
          path,
          value: clonePatchValueIfNeeded(base_[i4])
        });
      }
    }
    for (let i4 = base_.length; i4 < copy_.length; i4++) {
      const path = basePath.concat([i4]);
      patches.push({
        op: ADD,
        path,
        // Need to maybe clone it, as it can in fact be the original value
        // due to the base/copy inversion at the start of this function
        value: clonePatchValueIfNeeded(copy_[i4])
      });
    }
    for (let i4 = copy_.length - 1; base_.length <= i4; --i4) {
      const path = basePath.concat([i4]);
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
    let i4 = 0;
    base_.forEach((value) => {
      if (!copy_.has(value)) {
        const path = basePath.concat([i4]);
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
      i4++;
    });
    i4 = 0;
    copy_.forEach((value) => {
      if (!base_.has(value)) {
        const path = basePath.concat([i4]);
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
      i4++;
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
      for (let i4 = 0; i4 < path.length - 1; i4++) {
        const parentType = getArchtype(base);
        let p3 = path[i4];
        if (typeof p3 !== "string" && typeof p3 !== "number") {
          p3 = "" + p3;
        }
        if ((parentType === 0 || parentType === 1) && (p3 === "__proto__" || p3 === "constructor"))
          die(errorOffset + 3);
        if (typeof base === "function" && p3 === "prototype")
          die(errorOffset + 3);
        base = get(base, p3);
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
        Array.from(obj.entries()).map(([k2, v3]) => [k2, deepClonePatchValue(v3)])
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
          const r3 = iterator.next();
          if (r3.done)
            return r3;
          const value = this.get(r3.value);
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
          const r3 = iterator.next();
          if (r3.done)
            return r3;
          const value = this.get(r3.value);
          return {
            done: false,
            value: [r3.value, value]
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

// src/observables/observable.ts
var Subscriber = class {
  /**
   * Creates a new Subscriber instance with optimized memory layout
   * @param observer - The observer object or function
   */
  constructor(observer) {
    __publicField(this, "next");
    __publicField(this, "error");
    __publicField(this, "complete");
    __publicField(this, "teardowns");
    __publicField(this, "isUnsubscribed");
    if (typeof observer === "function") {
      this.next = observer;
      this.error = void 0;
      this.complete = void 0;
    } else if (observer && typeof observer === "object") {
      if (observer.next) {
        this.next = typeof observer.next === "function" ? observer.next.bind ? observer.next.bind(observer) : observer.next : void 0;
      } else {
        this.next = void 0;
      }
      if (observer.error) {
        this.error = typeof observer.error === "function" ? observer.error.bind ? observer.error.bind(observer) : observer.error : void 0;
      } else {
        this.error = void 0;
      }
      if (observer.complete) {
        this.complete = typeof observer.complete === "function" ? observer.complete.bind ? observer.complete.bind(observer) : observer.complete : void 0;
      } else {
        this.complete = void 0;
      }
    } else {
      this.next = void 0;
      this.error = void 0;
      this.complete = void 0;
    }
    this.teardowns = null;
    this.isUnsubscribed = false;
  }
  /**
   * Adds a teardown function to be executed when unsubscribing
   * @param teardown - The teardown function
   */
  addTeardown(teardown) {
    if (!this.teardowns) {
      this.teardowns = [teardown];
    } else {
      this.teardowns.push(teardown);
    }
  }
  /**
   * Unsubscribes from the observable, preventing any further notifications
   */
  unsubscribe() {
    if (this.isUnsubscribed) return;
    this.isUnsubscribed = true;
    if (!this.teardowns) {
      this.next = void 0;
      this.error = void 0;
      this.complete = void 0;
      return;
    }
    const teardowns = this.teardowns;
    let i4 = teardowns.length;
    while (i4--) {
      const teardown = teardowns[i4];
      if (typeof teardown === "function") {
        teardown();
      }
    }
    this.teardowns = null;
    this.next = void 0;
    this.error = void 0;
    this.complete = void 0;
  }
};
var Observable = class {
  /**
   * Creates a new Observable instance with optimized internal structure
   * @param subscribeCallback - The callback function to call when a new observer subscribes
   */
  constructor(subscribeCallback) {
    __publicField(this, "__observers");
    __publicField(this, "subscribeCallback");
    this.__observers = [];
    if (subscribeCallback) {
      this.subscribeCallback = subscribeCallback;
    }
  }
  /**
   * Protected method to check if there are any observers
   * @returns true if there are observers, false otherwise
   */
  get hasObservers() {
    return this.__observers.length > 0;
  }
  /**
   * Protected method to get observer count
   * @returns number of observers
   */
  get observerCount() {
    return this.__observers.length;
  }
  /**
   * Protected method to notify all observers
   * @param value - The value to emit to observers
   */
  notifyObservers(value) {
    const observers = this.__observers;
    const length = observers.length;
    for (let i4 = 0; i4 < length; i4++) {
      const observer = observers[i4];
      if (observer.next && !observer.isUnsubscribed) {
        observer.next(value);
      }
    }
  }
  /**
   * Subscribes an observer to the observable with optimized paths
   * @param observerOrNext - The observer to subscribe or the next function
   * @param error - The error function. Default is null
   * @param complete - The complete function. Default is null
   * @returns An object containing methods to manage the subscription
   */
  subscribe(observerOrNext, error, complete) {
    const subscriber = typeof observerOrNext === "function" ? new Subscriber(observerOrNext) : new Subscriber({
      next: observerOrNext,
      error: error || void 0,
      complete: complete || void 0
    });
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
      }, complete: () => {
      }, error: () => {
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
   * Creates a teardown function that removes a subscriber from the observers array
   * @param subscriber - The subscriber to remove
   * @returns A function that removes the subscriber when called
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
   * Creates a subscription object with minimal properties
   * @param subscriber - The subscriber
   * @returns A subscription object
   */
  __createSubscription(subscriber) {
    return {
      unsubscribe: () => subscriber.unsubscribe(),
      // Only add these methods if needed in the future:
      complete: () => {
        if (!subscriber.isUnsubscribed && subscriber.complete) {
          subscriber.complete();
          subscriber.unsubscribe();
        }
      },
      error: (err) => {
        if (!subscriber.isUnsubscribed && subscriber.error) {
          subscriber.error(err);
          subscriber.unsubscribe();
        }
      }
    };
  }
  /**
   * Passes a value to all observers with maximum efficiency
   * @param value - The value to emit
   */
  next(value) {
    const observers = this.__observers;
    const len = observers.length;
    if (len === 0) return;
    if (len === 1) {
      const observer = observers[0];
      if (!observer.isUnsubscribed && observer.next) {
        observer.next(value);
      }
      return;
    }
    let i4 = len;
    while (i4--) {
      const observer = observers[i4];
      if (!observer.isUnsubscribed && observer.next) {
        observer.next(value);
      }
    }
  }
  /**
   * Passes an error to all observers and terminates the stream
   * @param error - The error to emit
   */
  error(error) {
    const observers = this.__observers.slice();
    const len = observers.length;
    for (let i4 = 0; i4 < len; i4++) {
      const observer = observers[i4];
      if (!observer.isUnsubscribed && observer.error) {
        observer.error(error);
      }
    }
    this.__observers.length = 0;
  }
  /**
   * Notifies all observers that the Observable has completed
   */
  complete() {
    const observers = this.__observers.slice();
    const len = observers.length;
    for (let i4 = 0; i4 < len; i4++) {
      const observer = observers[i4];
      if (!observer.isUnsubscribed && observer.complete) {
        observer.complete();
      }
    }
    this.__observers.length = 0;
  }
  /**
   * Simplified method to subscribe to value emissions only
   * @param callbackFn - The callback for each value
   * @returns Subscription object with unsubscribe method
   */
  onValue(callbackFn) {
    return this.subscribe(callbackFn);
  }
  /**
   * Simplified method to subscribe to errors only
   * @param callbackFn - The callback for errors
   * @returns Subscription object with unsubscribe method
   */
  onError(callbackFn) {
    return this.subscribe(null, callbackFn);
  }
  /**
   * Simplified method to subscribe to completion only
   * @param callbackFn - The callback for completion
   * @returns Subscription object with unsubscribe method
   */
  onEnd(callbackFn) {
    return this.subscribe(null, null, callbackFn);
  }
  /**
   * Returns an AsyncIterator for asynchronous iteration
   * @returns AsyncIterator implementation
   */
  [Symbol.asyncIterator]() {
    let resolve;
    let promise = new Promise((r3) => resolve = r3);
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
        promise = new Promise((r3) => resolve = r3);
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

// src/utils.ts
var _deepEqual = (a2, b2, visited) => {
  if (a2 === b2) return true;
  if (a2 !== a2) return b2 !== b2;
  if (a2 == null || b2 == null) return false;
  if (typeof a2 !== "object" || typeof b2 !== "object") return false;
  if (!visited) visited = /* @__PURE__ */ new Set();
  if (visited.has(a2) || visited.has(b2)) {
    return true;
  }
  visited.add(a2);
  visited.add(b2);
  if (Array.isArray(a2)) {
    if (!Array.isArray(b2) || a2.length !== b2.length) {
      visited.delete(a2);
      visited.delete(b2);
      return false;
    }
    let index2 = a2.length;
    while (index2-- > 0) {
      if (!_deepEqual(a2[index2], b2[index2], visited)) {
        visited.delete(a2);
        visited.delete(b2);
        return false;
      }
    }
    visited.delete(a2);
    visited.delete(b2);
    return true;
  }
  if (Array.isArray(b2)) {
    visited.delete(a2);
    visited.delete(b2);
    return false;
  }
  if (a2 instanceof Date) {
    const result = b2 instanceof Date && a2.getTime() === b2.getTime();
    visited.delete(a2);
    visited.delete(b2);
    return result;
  }
  if (a2 instanceof RegExp) {
    const result = b2 instanceof RegExp && a2.source === b2.source && a2.flags === b2.flags;
    visited.delete(a2);
    visited.delete(b2);
    return result;
  }
  if (a2 instanceof Map) {
    if (!(b2 instanceof Map) || a2.size !== b2.size) {
      visited.delete(a2);
      visited.delete(b2);
      return false;
    }
    for (const [key, val] of a2.entries()) {
      if (!b2.has(key) || !_deepEqual(val, b2.get(key), visited)) {
        visited.delete(a2);
        visited.delete(b2);
        return false;
      }
    }
    visited.delete(a2);
    visited.delete(b2);
    return true;
  }
  if (a2 instanceof Set) {
    if (!(b2 instanceof Set) || a2.size !== b2.size) {
      visited.delete(a2);
      visited.delete(b2);
      return false;
    }
    if (a2.size === 0) {
      visited.delete(a2);
      visited.delete(b2);
      return true;
    }
    const aValues = Array.from(a2);
    const bValues = Array.from(b2);
    const matched = new Array(bValues.length).fill(false);
    for (let i4 = 0; i4 < aValues.length; i4++) {
      let found = false;
      for (let j2 = 0; j2 < bValues.length; j2++) {
        if (!matched[j2] && _deepEqual(aValues[i4], bValues[j2], visited)) {
          matched[j2] = true;
          found = true;
          break;
        }
      }
      if (!found) {
        visited.delete(a2);
        visited.delete(b2);
        return false;
      }
    }
    visited.delete(a2);
    visited.delete(b2);
    return true;
  }
  if (ArrayBuffer.isView(a2) && !(a2 instanceof DataView)) {
    const typedA = a2;
    const typedB = b2;
    if (!ArrayBuffer.isView(b2) || typedA.length !== typedB.length || a2.constructor !== b2.constructor) {
      visited.delete(a2);
      visited.delete(b2);
      return false;
    }
    let index2 = typedA.length;
    while (index2-- > 0) {
      if (typedA[index2] !== typedB[index2]) {
        visited.delete(a2);
        visited.delete(b2);
        return false;
      }
    }
    visited.delete(a2);
    visited.delete(b2);
    return true;
  }
  if (a2.constructor !== b2.constructor) {
    visited.delete(a2);
    visited.delete(b2);
    return false;
  }
  const keys = Object.keys(a2);
  if (keys.length !== Object.keys(b2).length) {
    visited.delete(a2);
    visited.delete(b2);
    return false;
  }
  const hasOwn = Object.prototype.hasOwnProperty;
  let index = keys.length;
  while (index-- > 0) {
    const key = keys[index];
    if (!hasOwn.call(b2, key) || !_deepEqual(a2[key], b2[key], visited)) {
      visited.delete(a2);
      visited.delete(b2);
      return false;
    }
  }
  visited.delete(a2);
  visited.delete(b2);
  return true;
};
var _deepMerge = (target, source) => {
  const seen = /* @__PURE__ */ new WeakMap();
  function merge(target2, source2) {
    var _a2;
    if (source2 === void 0) return target2;
    if (source2 === null) return null;
    if (typeof source2 !== "object") return source2;
    if (target2 === null || typeof target2 !== "object") {
      if (Array.isArray(source2)) {
        const length = source2.length;
        const result2 = new Array(length);
        for (let i5 = 0; i5 < length; i5++) {
          const item = source2[i5];
          result2[i5] = item === null || typeof item !== "object" ? item : merge(void 0, item);
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
      for (let i5 = 0; i5 < length; i5++) {
        const item = source2[i5];
        result2[i5] = item === null || typeof item !== "object" ? item : merge(void 0, item);
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
      if (source2 instanceof Date) return new Date(source2.getTime());
      if (source2 instanceof RegExp) return new RegExp(source2.source, source2.flags);
      if (ArrayBuffer.isView(source2) && !(source2 instanceof DataView)) {
        if (typeof Buffer !== "undefined" && ((_a2 = Buffer == null ? void 0 : Buffer.isBuffer) == null ? void 0 : _a2.call(Buffer, source2))) {
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
    let i4 = targetKeys.length;
    while (i4--) {
      const key = targetKeys[i4];
      result[key] = target2[key];
    }
    seen.set(source2, result);
    for (const key in source2) {
      if (!Object.prototype.hasOwnProperty.call(source2, key)) continue;
      if (key === "__proto__" || key === "constructor") continue;
      const sourceValue = source2[key];
      if (sourceValue === void 0) continue;
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
  var _a2;
  if (value === null || typeof value !== "object") return value;
  if (cache.has(value)) return cache.get(value);
  if (Array.isArray(value)) {
    const length = value.length;
    const result2 = new Array(length);
    cache.set(value, result2);
    for (let i4 = 0; i4 < length; i4++) {
      const item = value[i4];
      result2[i4] = item === null || typeof item !== "object" ? item : _deepClone(item, cache);
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
    if (typeof Buffer !== "undefined" && ((_a2 = Buffer == null ? void 0 : Buffer.isBuffer) == null ? void 0 : _a2.call(Buffer, value))) {
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
    if (typeof key !== "symbol" && Object.prototype.hasOwnProperty.call(value, key)) {
      const val = value[key];
      result[key] = val === null || typeof val !== "object" ? val : _deepClone(val, cache);
    }
  }
  return result;
};

// src/config.ts
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

// src/trace.ts
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
      const oldPatches = messages[1];
      const newPatches = messages[2];
      console.log(
        `oldValue of ${oldPatches[0].path.join(".")}:`,
        oldPatches[0].value
      );
      console.log(
        `newValue of ${newPatches[0].path.join(".")}:`,
        newPatches[0].value
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

// src/observables/observable-state.ts
var _DependencyTracker = class _DependencyTracker {
  constructor() {
    // For small dependency sets, arrays are faster than Sets in V8
    // When dependency count grows large, we can switch to a Set
    __publicField(this, "dependencies", []);
    // For fast lookup to avoid duplicates (O(1) vs O(n))
    __publicField(this, "_depsMap", /* @__PURE__ */ new Map());
  }
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
    __publicField(this, "__value");
    __publicField(this, "__pendingUpdates", []);
    __publicField(this, "__updateScheduled", false);
    __publicField(this, "__name");
    __publicField(this, "__isUpdating", false);
    __publicField(this, "__updateStack", []);
    __publicField(this, "__observers", []);
    __publicField(this, "__lastObserver", null);
    // Add _uid property to match the dependency tracking
    __publicField(this, "_uid");
    if (subscriber) {
      if (last) {
        this.__lastObserver = subscriber;
      } else {
        const sub = new Subscriber(subscriber);
        this.__observers.push(sub);
      }
    }
    this.__value = produce(initialValue, (_draft) => {
    });
    this.__name = name;
  }
  /**
   * @method
   * @param {Function} callback - Callback function to be notified on value changes
   * @returns {Object} A subscription object with an unsubscribe method
   * @description High-performance subscription method with O(1) unsubscribe
   */
  onValue(callback) {
    const subscriber = new Subscriber(callback);
    const index = this.__observers.length;
    this.__observers.push(subscriber);
    return {
      unsubscribe: () => {
        if (this.__observers[index] === subscriber) {
          const lastIndex = this.__observers.length - 1;
          if (index < lastIndex) {
            const lastObserver = this.__observers[lastIndex];
            if (lastObserver !== void 0) {
              this.__observers[index] = lastObserver;
            }
          }
          this.__observers.pop();
        } else {
          this.__observers = this.__observers.filter((obs) => obs !== subscriber);
        }
      },
      complete: () => {
        if (!subscriber.isUnsubscribed && subscriber.complete) {
          subscriber.complete();
          subscriber.unsubscribe();
        }
      },
      error: (err) => {
        if (!subscriber.isUnsubscribed && subscriber.error) {
          subscriber.error(err);
          subscriber.unsubscribe();
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
    this.__updateStack.push(this.__name || "unknown");
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
      for (let i4 = 0; i4 < keys.length - 1; i4++) {
        const key2 = keys[i4];
        if (key2 !== void 0) {
          current2 = current2[key2];
        }
      }
      const lastKey = keys[keys.length - 1];
      if (lastKey !== void 0) {
        current2[lastKey] = value;
      }
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
      for (let i4 = 0; i4 < keys.length - 1; i4++) {
        const key2 = keys[i4];
        if (key2 !== void 0) {
          current2 = current2[key2];
        }
      }
      const lastKey = keys[keys.length - 1];
      if (lastKey !== void 0) {
        delete current2[lastKey];
      }
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
  fill(value, start = 0, end) {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    const arrayEnd = end !== void 0 ? end : this.__value.length;
    this.update((arr) => {
      arr.fill(value, start, arrayEnd);
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
  copyWithin(target, start, end) {
    if (!Array.isArray(this.__value)) {
      throw new Error("[Cami.js] Observable value is not an array");
    }
    const arrayEnd = end !== void 0 ? end : this.__value.length;
    this.update((arr) => {
      arr.copyWithin(target, start, arrayEnd);
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
    this.__updateStack.push(this.__name || "unknown");
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
      if (observer && observer.next && !observer.isUnsubscribed) {
        observer.next(value);
      }
      return;
    }
    let i4 = len;
    while (i4--) {
      const observer = observers[i4];
      if (observer && observer.next && !observer.isUnsubscribed) {
        observer.next(value);
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
   * Optimized update application with fast paths for common cases
   * @private
   */
  __applyUpdates() {
    let hasChanged = false;
    const needsEventOrTrace = __config.events.isEnabled || __config.debug.isEnabled;
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
        if (updater === void 0) {
          return;
        }
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
        for (let i4 = 0; i4 < updateCount; i4++) {
          const updater = updates[i4];
          if (updater === void 0) {
            continue;
          }
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
      for (let i4 = 0; i4 < updateCount; i4++) {
        const updater = updates[i4];
        if (updater === void 0) {
          continue;
        }
        const result = updater(currentValue);
        const newValue = result !== void 0 ? result : currentValue;
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
      if (observer && observer.complete && !observer.isUnsubscribed) {
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
    const tracker = {
      addDependency(observable) {
        if (!dependencies.has(observable)) {
          dependencies.add(observable);
          observable.onValue(_runEffect);
        }
      }
    };
    DependencyTracker.current = tracker;
    try {
      const result = effectFn();
      cleanup = result || (() => {
      });
    } finally {
      DependencyTracker.current = null;
    }
  };
  _runEffect();
  return () => {
    cleanup();
    dependencies.forEach((dep) => {
      dep["__observers"] = dep["__observers"].filter((obs) => obs !== _runEffect);
    });
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

// src/observables/observable-proxy.ts
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
    const proxyGetHandler = (target, property, _receiver) => {
      if (property === "valueOf" || property === "toString" || property === "toJSON" || property === Symbol.toPrimitive) {
        return conversionMethods[property];
      }
      let propertyType;
      const propKey = property;
      if (typeof target[propKey] === "function") {
        propertyType = "targetFunction";
      } else if (property in target) {
        propertyType = "targetProperty";
      } else if (target.value && typeof target.value[property] === "function") {
        propertyType = "valueFunction";
      } else {
        propertyType = "valueProperty";
      }
      switch (propertyType) {
        case "targetFunction":
          return target[propKey].bind(target);
        case "targetProperty":
          return _deepClone(target[propKey]);
        case "valueFunction":
          return (...args) => target.value[property](...args);
        case "valueProperty":
          return _deepClone(target.value[property]);
        default:
          console.warn(`Unexpected property type: ${propertyType}`);
          return void 0;
      }
    };
    const proxySetHandler = (target, property, value, _receiver) => {
      const propKey = property;
      if (property in target) {
        if (typeof target[propKey] === "object" && target[propKey] !== null && typeof value === "object" && value !== null) {
          if (_deepEqual(target[propKey], value)) {
            return true;
          }
        } else if (target[propKey] === value) {
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
    };
    const proxyDeleteHandler = (target, property) => {
      if (property in target.value) {
        delete target.value[property];
        target.update(() => target.value);
        return true;
      }
      return false;
    };
    return new Proxy(observable, {
      get: proxyGetHandler,
      set: proxySetHandler,
      deleteProperty: proxyDeleteHandler,
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

// src/reactive-element.ts
var ReactiveElement = class extends HTMLElement {
  /**
   * Constructs a new instance of ReactiveElement.
   */
  constructor() {
    super();
    __publicField(this, "__unsubscribers");
    __publicField(this, "__prevTemplate");
    // Public effect and derive methods (bound in constructor)
    __publicField(this, "effect");
    __publicField(this, "derive");
    this.onCreate();
    this.__unsubscribers = /* @__PURE__ */ new Map();
    this.effect = this.__effect.bind(this);
    this.derive = this.__derive.bind(this);
  }
  /**
   * Creates ObservableProperty or ObservableProxy instances for all properties in the provided object.
   * @param attributes - An object with attribute names as keys and optional parsing functions as values.
   * @example
   * // In _009_dataFromProps.html, the todos attribute is parsed as JSON and the data property is extracted:
   * this.observableAttributes({
   *   todos: (v) => JSON.parse(v).data
   * });
   */
  observableAttributes(attributes) {
    Object.entries(attributes).forEach(([attrName, parseFn]) => {
      let attrValue = this.getAttribute(attrName);
      const transformFn = typeof parseFn === "function" ? parseFn : (v3) => v3;
      const transformedValue = produce(attrValue, transformFn);
      const observable = this.__observable(transformedValue, attrName);
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
   * Creates an effect and registers its dispose function. The effect is used to perform side effects in response to state changes.
   * This method is useful when working with ObservableProperties or ObservableProxies because it triggers the effect whenever the value of the underlying ObservableState changes.
   * @param effectFn - The function to create the effect
   * @example
   * // Assuming `this.count` is an ObservableProperty
   * this.effect(() => {
   *   console.log(`The count is now: ${this.count}`);
   * });
   * // The console will log the current count whenever `this.count` changes
   */
  __effect(effectFn) {
    const dispose = effect(effectFn);
    this.__unsubscribers.set(effectFn, dispose);
  }
  /**
   * Creates a derived value that updates when its dependencies change.
   * @param deriveFn - The function to compute the derived value
   * @returns The derived value
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
   * Called when the component is created. Can be overridden by subclasses to add initialization logic.
   * This method is a hook for the connectedCallback, which is invoked each time the custom element is appended into a document-connected element.
   */
  onCreate() {
  }
  /**
   * Invoked when the custom element is appended into a document-connected element. Sets up initial state and triggers initial rendering.
   * This is typically used to initialize component state, fetch data, and set up event listeners.
   *
   * @example
   * // In a TodoList component
   * connectedCallback() {
   *   super.connectedCallback();
   *   this.fetchTodos(); // Fetch todos when the component is added to the DOM
   * }
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
   * Invoked when the custom element is connected to the document's DOM.
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
   * Invoked when the custom element is disconnected from the document's DOM.
   * This is a good place to remove event listeners, cancel any ongoing network requests, or clean up any resources.
   * @example
   * // In a Modal component
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   this.close(); // Close the modal when it's disconnected from the DOM
   * }
   */
  disconnectedCallback() {
    this.onDisconnect();
    this.__unsubscribers.forEach((unsubscribe) => unsubscribe());
  }
  /**
   * Invoked when the custom element is disconnected from the document's DOM.
   * Subclasses can override this to add cleanup logic when the component is removed from the DOM.
   *
   * @example
   * // In a VideoPlayer component
   * onDisconnect() {
   *   this.stopPlayback(); // Stop video playback when the component is removed
   * }
   */
  onDisconnect() {
  }
  /**
   * Invoked when an attribute of the custom element is added, removed, updated, or replaced.
   * This can be used to react to attribute changes, such as updating the component state or modifying its appearance.
   *
   * @param name - The name of the attribute that changed
   * @param oldValue - The old value of the attribute
   * @param newValue - The new value of the attribute
   * @example
   * // In a ThemeSwitcher component
   * attributeChangedCallback(name, oldValue, newValue) {
   *   super.attributeChangedCallback(name, oldValue, newValue);
   *   if (name === 'theme') {
   *     this.updateTheme(newValue); // Update the theme when the `theme` attribute changes
   *   }
   * }
   */
  attributeChangedCallback(name, oldValue, newValue) {
    this.onAttributeChange(name, oldValue, newValue);
  }
  /**
   * Invoked when an attribute of the custom element is added, removed, updated, or replaced.
   * Subclasses can override this to add logic that should run when an attribute changes.
   *
   * @param name - The name of the attribute that changed
   * @param oldValue - The old value of the attribute
   * @param newValue - The new value of the attribute
   * @example
   * // In a CollapsiblePanel component
   * onAttributeChange(name, oldValue, newValue) {
   *   if (name === 'collapsed') {
   *     this.toggleCollapse(newValue === 'true'); // Toggle collapse when the `collapsed` attribute changes
   *   }
   * }
   */
  onAttributeChange(_name, _oldValue, _newValue) {
  }
  /**
   * Invoked when the custom element is moved to a new document.
   * This can be used to update bindings or perform re-initialization as needed when the component is adopted into a new DOM context.
   * @example
   * // In a DragDropContainer component
   * adoptedCallback() {
   *   super.adoptedCallback();
   *   this.updateDragDropContext(); // Update context when the component is moved to a new document
   * }
   */
  adoptedCallback() {
    this.onAdopt();
  }
  /**
   * Invoked when the custom element is moved to a new document.
   * Subclasses can override this to add logic that should run when the component is moved to a new document.
   * @example
   * // In a DataGrid component
   * onAdopt() {
   *   this.refreshData(); // Refresh data when the component is adopted into a new document
   * }
   */
  onAdopt() {
  }
  /**
   * Checks if the provided value is an object or an array.
   * @param value - The value to check.
   * @returns True if the value is an object or an array, false otherwise.
   */
  __isObjectOrArray(value) {
    return value !== null && (typeof value === "object" || Array.isArray(value));
  }
  /**
   * Private method. Creates an ObservableProperty for the provided key in the given context when the provided value is an object or an array.
   * @param context - The context in which the property is defined.
   * @param key - The property key.
   * @param observable - The observable to bind to the property.
   * @param isAttribute - Whether the property is an attribute.
   * @throws {TypeError} If observable is not an instance of ObservableState.
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
   * Private method. Handles the case when the provided value is not an object or an array.
   * This method creates an ObservableProperty for the provided key in the given context.
   * An ObservableProperty is a special type of property that can notify about changes in its state.
   * This is achieved by defining a getter and a setter for the property using Object.defineProperty.
   * The getter simply returns the current value of the observable.
   * The setter updates the observable with the new value and, if the property is an attribute, also updates the attribute.
   * @param context - The context in which the property is defined.
   * @param key - The property key.
   * @param observable - The observable to bind to the property.
   * @param isAttribute - Whether the property is an attribute.
   * @throws {TypeError} If observable is not an instance of ObservableState.
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
   * Creates a proxy for the observable.
   * @param observable - The observable for which a proxy is to be created.
   * @throws {TypeError} If observable is not an instance of ObservableState.
   * @returns The created proxy.
   */
  __observableProxy(observable) {
    return new ObservableProxy(observable);
  }
  /**
   * Defines the observables, effects, and attributes for the element.
   * @param config - The configuration object.
   */
  __setup(config) {
    if (config.infer === true) {
      const keys = Object.keys(this);
      const keysLen = keys.length;
      for (let i4 = 0; i4 < keysLen; i4++) {
        const key = keys[i4];
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
   * Creates an observable with an initial value.
   * @param initialValue - The initial value for the observable.
   * @param name - The name of the observable.
   * @throws {Error} If the type of initialValue is not allowed in observables.
   * @returns The created observable state.
   */
  __observable(initialValue, name) {
    if (!this.__isAllowedType(initialValue)) {
      const type = Object.prototype.toString.call(initialValue);
      throw new Error(
        `[Cami.js] The value of type ${type} is not allowed in observables. Only primitive values, arrays, and plain objects are allowed.`
      );
    }
    const observable = new ObservableState(initialValue, null, { name });
    this.__registerObservables(observable);
    return observable;
  }
  /**
   * Checks if the provided value is of an allowed type
   * @param value - The value to check
   * @returns True if the value is of an allowed type, false otherwise
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
   * Checks if the provided value is a plain object
   * @param value - The value to check
   * @returns True if the value is a plain object, false otherwise
   */
  __isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== "[object Object]") {
      return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
  }
  /**
   * Registers an observable state to the list of unsubscribers
   * @param observableState - The observable state to register
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
  /**
   * Hook called after rendering. Can be overridden by subclasses.
   */
  afterRender() {
  }
  /**
   * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
   * Uses memoization to avoid unnecessary rendering when the template result hasn't changed.
   */
  render() {
    if (typeof this.template === "function") {
      const template = this.template();
      if (this.__prevTemplate === template) return;
      if (this.__prevTemplate && _deepEqual(this.__prevTemplate, template)) {
        return;
      }
      this.__prevTemplate = template;
      B(template, this);
      this.afterRender();
    }
  }
  /**
   * Warns if required properties are missing from the component.
   * @param properties - Array of property names to check
   */
  warnIfMissingProperties(properties) {
    const missingProperties = properties.filter((prop) => !(prop in this));
    if (missingProperties.length > 0) {
      console.warn(`Missing required properties: ${missingProperties.join(", ")}`);
    }
  }
};

// src/observables/observable-model.ts
function generateRandomName() {
  return "model_" + Math.random().toString(36).substr(2, 9);
}
var Model = class {
  constructor({ name = generateRandomName(), properties = {} } = {}) {
    __publicField(this, "name");
    __publicField(this, "schema");
    this.name = name;
    this.schema = properties;
  }
  /**
   * Creates an observable store with the given configuration
   * @param config - Configuration object containing state, actions, and other store features
   * @returns An ObservableStore instance configured with this model's schema
   */
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
  /**
   * Validates a state object against this model's schema
   * @param state - The state object to validate
   * @throws {Error} If validation fails
   */
  validateState(state) {
    const errors2 = [];
    Object.entries(this.schema).forEach(([key, type]) => {
      if (!(key in state)) {
        const expectedType = this._getExpectedTypeString(type);
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
  /**
   * Validates a single item against its type definition
   * @param value - The value to validate
   * @param type - The type definition to validate against
   * @param path - The current path in the object for error reporting
   * @param rootState - The root state object for reference validation
   */
  validateItem(value, type, path, rootState) {
    const getTypeCategory = (type2, value2) => {
      if (typeof type2 === "object" && type2 !== null && "type" in type2) {
        if (type2.type === "optional") return "optional";
        if (type2.type === "object" && typeof value2 === "object") return "object";
      }
      return "other";
    };
    try {
      const typeCategory = getTypeCategory(type, value);
      switch (typeCategory) {
        case "optional":
          if (value === void 0 || value === null) return;
          const optionalType = type;
          return this.validateItem(value, optionalType.optional, path, rootState);
        case "object":
          const objectType = type;
          Object.entries(objectType.schema).forEach(([key, subType]) => {
            const isOptional = typeof subType === "object" && subType !== null && "type" in subType && subType.type === "optional";
            if (!isOptional && !(key in value)) {
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
      throw new Error(
        `Property: ${path.join(".")}
Error: ${error.message}`
      );
    }
  }
  /**
   * Helper function to get a human-readable string representation of expected type
   * @param type - The type definition
   * @returns A string representation of the expected type
   */
  _getExpectedTypeString(type) {
    const getTypeCategory = (type2) => {
      if (typeof type2 === "string") return "string";
      if (typeof type2 === "object" && type2 !== null) {
        if ("type" in type2) {
          if (type2.type === "object" && "schema" in type2) return "objectWithSchema";
          if (type2.type === "array" && "itemType" in type2) return "array";
          if (type2.type === "enum" && "values" in type2) return "enum";
          if (type2.type === "optional") return "optional";
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
        const objectType = type;
        return `Object(${Object.entries(objectType.schema).map(([k2, v3]) => `${k2}: ${this._getExpectedTypeString(v3)}`).join(", ")})`;
      case "array":
        const arrayType = type;
        return `Array(${this._getExpectedTypeString(arrayType.itemType)})`;
      case "enum":
        const enumType = type;
        return `Enum(${enumType.values.join(" | ")})`;
      case "optional":
        const optionalType = type;
        return `Optional(${this._getExpectedTypeString(optionalType.optional)})`;
      case "simpleType":
        const simpleType = type;
        return simpleType.type;
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
};

// src/types/index.ts
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
  Object: (schema) => ({
    type: "object",
    schema
  }),
  Array: (itemType, options = {}) => ({
    type: "array",
    itemType,
    allowEmpty: options.allowEmpty !== false
    // Default to true
  }),
  Sum: (...types) => ({
    type: "sum",
    types
  }),
  Product: (fields) => ({
    type: "product",
    fields
  }),
  Any: { type: "any" },
  Enum: (...values) => ({
    type: "enum",
    values
  }),
  Optional: (type) => ({
    type: "optional",
    optional: type
  }),
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
  Vect: (length, elemType) => ({
    type: "vect",
    length,
    elemType
  }),
  Tree: (valueType) => ({
    type: "tree",
    valueType
  }),
  RoseTree: (valueType) => ({
    type: "roseTree",
    valueType
  }),
  Literal: (value) => ({
    type: "literal",
    value
  }),
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
        validateType2(item, itemTypeToValidate, [...path, String(index)], rootState);
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
      } catch (e4) {
        errors2.push(e4.message);
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
    const mergedValue = _deepMerge(_deepMerge({}, existingObject), value);
    Object.entries(type.fields).forEach(([key, fieldType]) => {
      if (key in mergedValue) {
        validateType2(mergedValue[key], fieldType, [...path, key], rootState, key);
      }
    });
    let currentObj = rootState;
    for (let i4 = 0; i4 < path.length - 1; i4++) {
      if (currentObj[path[i4]] === void 0) {
        currentObj[path[i4]] = {};
      }
      currentObj = currentObj[path[i4]];
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
  null: (value, _type, path) => {
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
    validateType2(value[0], type.fstType, [...path, "0"], rootState);
    const sndType = type.sndTypeFn(value[0]);
    validateType2(value[1], sndType, [...path, "1"], rootState);
  },
  date: (value, _type, path) => {
    if (!(value instanceof Date))
      throw new Error(
        `Expected Date, got ${typeof value} at ${path.join(".")}`
      );
  },
  float: (value, _type, path) => {
    if (typeof value !== "number") {
      throw new Error(
        `Expected float, got ${typeof value} at ${path.join(".")}`
      );
    }
    if (Number.isNaN(value)) {
      throw new Error(`Expected float, got NaN at ${path.join(".")}`);
    }
  },
  integer: (value, _type, path) => {
    if (!Number.isInteger(value)) {
      throw new Error(
        `Expected integer, got ${typeof value === "number" ? "float" : typeof value} at ${path.join(".")}`
      );
    }
  },
  natural: (value, _type, path) => {
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
      validateType2(item, type.elemType, [...path, String(index)], rootState);
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
      validateType2(child, type, [...path, "children", String(index)], rootState);
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
  dependentFunction: (value, _type, path) => {
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
      validateType2(item, itemType, [...path, String(index)], rootState);
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
      } catch (e4) {
        errors2.push(e4.message);
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
  boolean: (value, _type, path) => {
    if (typeof value !== "boolean")
      throw new Error(
        `Expected boolean, got ${typeof value} at ${path.join(".")}`
      );
  },
  bigint: (value, _type, path) => {
    if (typeof value !== "bigint")
      throw new Error(
        `Expected bigint, got ${typeof value} at ${path.join(".")}`
      );
  },
  symbol: (value, _type, path) => {
    if (typeof value !== "symbol")
      throw new Error(
        `Expected symbol, got ${typeof value} at ${path.join(".")}`
      );
  },
  function: (value, _type, path) => {
    if (typeof value !== "function") {
      throw new Error(
        `Expected function, got ${typeof value} at ${path.join(".")}`
      );
    }
  },
  void: () => {
  },
  reference: (value, _type, path, _rootState, _validateType) => {
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
  if (typeof type === "object" && type !== null && "type" in type && type.type === "optional") {
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
      (v3, t4, p3, r3, k2) => validateType(v3, t4, p3, r3, k2)
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
        (v3, t4, p3, r3, k2) => validateType(v3, t4, p3, r3, k2)
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
      (v3, t4, p3, r3, k2) => validateType(v3, t4, p3, r3, k2)
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
    if (typeof schema === "object" && "type" in schema && schema.type === "dependentRecord") {
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
    if (typeof schema === "object" && "type" in schema && schema.type === "product") {
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

// src/observables/observable-store.ts
enablePatches();
setAutoFreeze(false);
var ObservableStore = class extends Observable {
  constructor(initialState, options = {}) {
    super((subscriber) => {
      this.__subscriber = subscriber.next ? { next: subscriber.next } : null;
      return () => {
        this.__subscriber = null;
      };
    });
    __publicField(this, "name");
    __publicField(this, "schema");
    __publicField(this, "_uid");
    // State management
    __publicField(this, "_state");
    __publicField(this, "_frozenState", null);
    // Used in proxy handlers
    __publicField(this, "_isDirty", false);
    __publicField(this, "_stateVersion", 0);
    // @ts-expect-error _proxy is used internally for reactive state tracking
    __publicField(this, "_proxy");
    __publicField(this, "previousState");
    // Core data structures
    __publicField(this, "reducers", {});
    __publicField(this, "actions", {});
    __publicField(this, "dispatchQueue", []);
    __publicField(this, "isDispatching", false);
    __publicField(this, "currentDispatchPromise", null);
    // Cache structures
    __publicField(this, "queryCache", /* @__PURE__ */ new Map());
    __publicField(this, "queryFunctions", /* @__PURE__ */ new Map());
    __publicField(this, "queries", {});
    __publicField(this, "memoCache", /* @__PURE__ */ new Map());
    // Resource management
    __publicField(this, "intervals", /* @__PURE__ */ new Map());
    __publicField(this, "focusHandlers", /* @__PURE__ */ new Map());
    __publicField(this, "reconnectHandlers", /* @__PURE__ */ new Map());
    __publicField(this, "gcTimeouts", /* @__PURE__ */ new Map());
    // Advanced features
    __publicField(this, "mutationFunctions", /* @__PURE__ */ new Map());
    __publicField(this, "mutations", {});
    __publicField(this, "patchListeners", /* @__PURE__ */ new Map());
    __publicField(this, "machines", {});
    __publicField(this, "memos", {});
    __publicField(this, "thunks", {});
    __publicField(this, "specs", /* @__PURE__ */ new Map());
    // Hooks for middleware-like functionality
    __publicField(this, "beforeHooks", []);
    __publicField(this, "afterHooks", []);
    __publicField(this, "throttledAfterHooks");
    // Dispatch tracking to prevent infinite loops
    __publicField(this, "__isDispatching", false);
    __publicField(this, "__dispatchStack", []);
    // Internal state management
    __publicField(this, "_stateTrapStore");
    __publicField(this, "__subscriber", null);
    this.name = options.name || "cami-store";
    this.schema = options.schema || {};
    this._uid = this.name;
    this._state = createDraft(initialState);
    this._frozenState = null;
    this._isDirty = false;
    this._stateVersion = 0;
    this._proxy = this._createProxy(this._state);
    this.previousState = initialState;
    this.dispatch = this.dispatch.bind(this);
    this.query = this.query.bind(this);
    this.mutate = this.mutate.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.trigger = this.trigger.bind(this);
    this.memo = this.memo.bind(this);
    this.invalidateQueries = this.invalidateQueries.bind(this);
    this.dispatchAsync = this.dispatchAsync.bind(this);
    this.throttledAfterHooks = this.__executeAfterHooks.bind(this);
    this.afterHook(() => {
      this._stateVersion++;
    });
    if (Object.keys(this.schema).length > 0) {
      this._validateState(this._state);
    }
  }
  /**
   * Returns a snapshot of the current state
   * Automatically tracks dependencies for reactive computations
   */
  get state() {
    if (DependencyTracker.current) {
      DependencyTracker.current.addDependency(this);
    }
    if (!this._frozenState) {
      const cleanState = _deepClone(this._state);
      this._frozenState = deepFreeze(cleanState);
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
      const cleanState = _deepClone(this._state);
      this._frozenState = deepFreeze(cleanState);
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
    const SKIP_PROPS = /* @__PURE__ */ new Set(["constructor", "toJSON"]);
    if (!this._stateTrapStore) {
      this._stateTrapStore = /* @__PURE__ */ new WeakMap();
    }
    if (!this._stateTrapStore.has(target)) {
      this._stateTrapStore.set(target, /* @__PURE__ */ new Map());
    }
    return new Proxy(target, {
      get: (target2, prop, receiver) => {
        if (typeof prop === "symbol" || SKIP_PROPS.has(prop)) {
          if (typeof prop === "symbol") {
            return void 0;
          }
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
          const trapMap = this._stateTrapStore.get(target2);
          if (!trapMap.has(prop)) {
            trapMap.set(prop, value.bind(target2));
          }
          return trapMap.get(prop);
        }
        return value;
      },
      set: (target2, prop, value, receiver) => {
        if (typeof prop === "symbol") {
          return true;
        }
        if (SKIP_PROPS.has(prop)) {
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
        return Reflect.ownKeys(target2).filter((key) => typeof key !== "symbol");
      },
      has: (target2, prop) => {
        if (DependencyTracker.current) {
          DependencyTracker.current.addDependency(this, prop);
        }
        return Reflect.has(target2, prop);
      },
      defineProperty: (target2, prop, descriptor) => {
        if (typeof prop === "symbol") {
          return true;
        }
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
    if (!this._isDirty) return;
    if (!this.hasObservers && !this.__subscriber) {
      this._isDirty = false;
      return;
    }
    if (this.previousState && _deepEqual(this._state, this.previousState)) {
      this._isDirty = false;
      return;
    }
    this.memoCache.clear();
    this._frozenState = null;
    const stateToEmit = _deepClone(this._state);
    const observerCount = this.observerCount;
    if (observerCount > 0) {
      this.notifyObservers(stateToEmit);
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
      if (value === null) return "null";
      if (value === void 0) return "undefined";
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
    if (!schema || Object.keys(schema).length === 0) return;
    Object.keys(schema).forEach((key) => {
      const expectedType = schema[key];
      const actualValue = state[key];
      const currentPath = [...path, key];
      const actualType = this._inferType(actualValue);
      if (actualType === "function") return;
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
    if (Array.isArray(value)) return "array";
    if (value === null) return "null";
    if (value === void 0) return "undefined";
    return typeof value;
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
    var _a2;
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
      throw new Error(`[Cami.js] No reducer found for action: ${action}`);
    }
    const originalState = _deepClone(this._state);
    try {
      const spec = (_a2 = this.specs) == null ? void 0 : _a2.get(action);
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
          (_draft) => {
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
        }
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
          this._validateState(hasPatches ? this._state : nextState);
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
      if (len === 0) return;
      let i4 = len;
      while (i4--) {
        hooks[i4](context);
      }
    } else if (type === "after") {
      if (this.afterHooks.length === 0) return;
      this.throttledAfterHooks(context);
    }
  }
  /**
   * Execute after hooks with current context
   */
  __executeAfterHooks(context) {
    const hooks = this.afterHooks;
    const len = hooks.length;
    if (len === 0) return;
    let i4 = len;
    while (i4--) {
      try {
        hooks[i4](context);
      } catch (error) {
        console.error(`[Cami.js] Error in afterHook[${i4}]:`, error);
        throw error;
      }
    }
  }
  /**
   * Notify patch listeners of changes
   * Optimized for performance with key-based targeting
   */
  _notifyPatchListeners(patches) {
    if (this.patchListeners.size === 0) return;
    const patchesByKey = /* @__PURE__ */ new Map();
    const patchesLen = patches.length;
    let i4 = patchesLen;
    while (i4--) {
      const patch = patches[i4];
      const key = patch.path[0];
      if (!this.patchListeners.has(key)) continue;
      let keyPatches = patchesByKey.get(key);
      if (!keyPatches) {
        keyPatches = [];
        patchesByKey.set(key, keyPatches);
      }
      keyPatches.push(patch);
    }
    for (const [key, keyPatches] of patchesByKey) {
      const listeners = this.patchListeners.get(key);
      if (!listeners || listeners.length === 0) continue;
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
   * @param {string} action - The action type
   * @param {ActionHandler} reducer - The reducer function for the action
   * @throws {Error} - Throws an error if the action type is already registered
   * @description This method registers a reducer function for a given action type. Useful if you like redux-style reducers.
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
   * @param {AsyncActionHandler} asyncCallback - The async function to be executed
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
   * @param {string} key - The state key to listen for patches.
   * @param {PatchListener} callback - The callback to invoke when patches are applied.
   * @description Registers a callback to be invoked whenever patches are applied to the specified state key.
   */
  onPatch(key, callback) {
    if (!this.patchListeners.has(key)) {
      this.patchListeners.set(key, []);
    }
    this.patchListeners.get(key).push(callback);
    return () => {
      const listeners = this.patchListeners.get(key);
      if (!listeners) return;
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
   * @param {Patch[]} patches - The patches to apply to the state.
   * @description Applies the given patches to the store's state.
   */
  applyPatch(patches) {
    this._state = applyPatches(this._state, patches);
    this.notifyObservers(this._state);
  }
  /**
   * @method defineQuery
   * @param {string} queryName - The name of the query to register.
   * @param {QueryConfig} config - The configuration object for the query.
   * @description Registers a query with the given configuration.
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
      staleTime = 0,
      retry = 1,
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
      if (onError) onError(context);
    } else {
      __trace(`query`, `Fetch success: ${queryName}`);
      if (onSuccess) onSuccess(context);
    }
    if (onSettled) {
      __trace(`query`, `Fetch settled: ${queryName}`);
      onSettled(context);
    }
    if (error) throw error;
    return Promise.resolve(data);
  }
  /**
   * @method invalidateQueries
   * @param {InvalidateQueriesOptions} options - The options for invalidating queries.
   * @description Invalidates the cache and any associated intervals or event listeners for the given queries.
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
      if (!query) return;
      let cacheKey;
      if (typeof query.queryKey === "function") {
        cacheKey = query.queryKey({}).join(":");
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
   * @param {number} retry - The number of retries remaining.
   * @param {number | Function} retryDelay - The delay or function that returns the delay in milliseconds for each retry attempt.
   * @returns {Promise} A promise that resolves to the query result.
   * @description Executes the query function with retries and exponential backoff.
   */
  _fetchWithRetry(queryFnWithContext, retry, retryDelay) {
    let attempts = 0;
    const executeFetch = () => {
      return queryFnWithContext().catch((error) => {
        if (attempts < retry) {
          attempts++;
          const delay = typeof retryDelay === "function" ? retryDelay(attempts) : retryDelay || 1e3;
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
   * @param {CachedQueryData} cachedData - The cached data object.
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
   * @method defineMutation
   * @param {string} mutationName - The name of the mutation to register.
   * @param {MutationConfig} config - The configuration object for the mutation.
   * @description Registers a mutation with the given configuration.
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
  _executeMutation(_mutationName, payload, mutation) {
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
    if (onMutate) {
      onMutate(storeContext);
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
   * @param {StateMachineDefinition} machineDefinition - The state machine definition
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
          const previousState = _deepClone(state);
          const newState = typeof event.to === "function" ? event.to({ state, payload }) : event.to;
          Object.entries(newState).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
              state[key] = __spreadValues(__spreadValues({}, state[key]), value);
            } else {
              state[key] = value;
            }
          });
          if (event.onEntry) {
            event.onEntry({ state, previousState, payload });
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
    for (let i4 = 0; i4 < len; i4++) {
      const dep = deps[i4];
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
var deepFreeze = (value, _deep = true) => {
  if (typeof value !== "object" || value === null) {
    return value;
  }
  return new Proxy(freeze(value, true), {
    set(_target, prop, _val) {
      throw new Error(
        `Attempted to modify frozen state. Cannot set property '${String(prop)}' on immutable object.`
      );
    },
    deleteProperty(_target, prop) {
      throw new Error(
        `Attempted to modify frozen state. Cannot delete property '${String(prop)}' from immutable object.`
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

// src/observables/url-store.ts
var URLStore = class extends Observable {
  constructor({ onInit = void 0, onChange = void 0 } = {}) {
    super();
    __publicField(this, "_state");
    __publicField(this, "__onChange");
    __publicField(this, "_uid");
    __publicField(this, "__routes");
    __publicField(this, "__resourceLoaders");
    __publicField(this, "__activeRoute");
    __publicField(this, "__navigationState");
    __publicField(this, "__persistentParams");
    __publicField(this, "__beforeNavigateHooks");
    __publicField(this, "__afterNavigateHooks");
    this._state = this.__parseURL();
    this._uid = "URLStore";
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
    for (const [, route] of this.__routes.entries()) {
      if (route.segments.length !== pathSegments.length) continue;
      let isMatch = true;
      const extractedParams = {};
      for (let i4 = 0; i4 < route.segments.length; i4++) {
        const routeSegment = route.segments[i4];
        const pathSegment = pathSegments[i4];
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
      var _a2;
      if (this.__navigationState.isPending) return;
      const urlState = this.__parseURL();
      if (_deepEqual(this._state, urlState)) return;
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
        if (matchingRoute && matchingRoute.resources && matchingRoute.resources.length > 0) {
          this.__navigationState.isLoading = true;
          urlState.routeParams = __spreadValues({}, matchingRoute.extractedParams || {});
          this._state = __spreadValues({}, urlState);
          this.next(this._state);
          yield this.__loadResources(matchingRoute, urlState);
        }
        if ((_a2 = this.__activeRoute) == null ? void 0 : _a2.onLeave) {
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
            params: matchingRoute.extractedParams || {}
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
      if (!route.resources || route.resources.length === 0) return;
      const context = {
        route,
        params: __spreadValues(__spreadValues({}, urlState.params), urlState.routeParams),
        url: window.location.hash
      };
      yield Promise.all(
        route.resources.map((resourceName) => __async(this, null, function* () {
          const loader = this.__resourceLoaders.get(resourceName);
          if (!loader) return;
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
    if (newUrl.hash === newHash) return;
    newUrl.hash = newHash;
    window.history.pushState(null, "", newUrl.toString());
    this.__updateStore();
    if (focusSelector) {
      setTimeout(() => {
        const targetElement = document.querySelector(focusSelector);
        if (targetElement) targetElement.focus();
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
          const stateSliceKey = key;
          for (const paramKey in stateSlice[stateSliceKey]) {
            const currentValue = currentState[stateSliceKey][paramKey];
            const sliceValue = stateSlice[stateSliceKey][paramKey];
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
    if (prefix.length > arr.length) return false;
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

// src/storage/adapters.ts
function unproxify(obj) {
  const getType = (value) => {
    if (typeof value !== "object" || value === null) return "primitive";
    if (Array.isArray(value)) return "array";
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
         * @param options - Query options for retrieving data.
         * @param options.type - The type of query to perform. Can be one of:
         *   'key', 'index', 'all', 'range', 'cursor', 'count', 'keys', or 'unique'.
         * @param options.key - The key to retrieve when type is 'key'.
         *   Example: { type: 'key', key: 123 }
         * @param options.index - The name of the index to use for 'index', 'range', 'cursor', 'count', 'keys', or 'unique' queries.
         *   Example: { type: 'index', index: 'nameIndex', value: 'John' }
         * @param options.value - The value to search for in an index query.
         *   Example: { type: 'index', index: 'ageIndex', value: 30 }
         * @param options.lower - The lower bound for a range query.
         *   Example: { type: 'range', index: 'dateIndex', lower: '2023-01-01', upper: '2023-12-31' }
         * @param options.upper - The upper bound for a range query.
         *   Example: { type: 'range', index: 'priceIndex', lower: 10, upper: 100 }
         * @param options.lowerOpen - Whether the lower bound is open in a range query.
         *   Example: { type: 'range', index: 'scoreIndex', lower: 50, upper: 100, lowerOpen: true }
         * @param options.upperOpen - Whether the upper bound is open in a range query.
         *   Example: { type: 'range', index: 'scoreIndex', lower: 50, upper: 100, upperOpen: true }
         * @param options.range - The key range for cursor, count, or keys queries.
         *   Example: { type: 'cursor', range: IDBKeyRange.bound(50, 100) }
         * @param options.direction - The direction for a cursor query.
         *   Example: { type: 'cursor', range: IDBKeyRange.lowerBound(50), direction: 'prev' }
         * @param options.limit - The maximum number of results to return for a unique query.
         *   Example: { type: 'unique', index: 'categoryIndex', limit: 5 }
         * @returns A promise that resolves with the query results.
         *
         * Examples:
         * - Get all records: { type: 'all' }
         * - Count records: { type: 'count', range: IDBKeyRange.lowerBound(18) }
         * - Get keys: { type: 'keys', index: 'dateIndex', range: IDBKeyRange.bound('2023-01-01', '2023-12-31') }
         */
        getState: (..._0) => __async(null, [..._0], function* (options = { type: "all" }) {
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
                if (!options2.index) throw new Error("Index must be specified for unique query");
                return store2.index(options2.index).getAll(options2.range, options2.limit);
              default:
                throw new Error(`Unsupported query type: ${options2.type}`);
            }
          };
          return new Promise((resolveQuery, rejectQuery) => {
            const tx = db.transaction(storeName, "readonly");
            const store2 = tx.objectStore(storeName);
            const request2 = buildIdbRequest({ store: store2, options });
            if (request2 instanceof Promise) {
              request2.then(resolveQuery).catch(rejectQuery);
            } else {
              request2.onsuccess = (event2) => resolveQuery(event2.target.result);
              request2.onerror = (event2) => rejectQuery(event2.target.error);
            }
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
        if (oldVersion === 0) return "create";
        if (oldVersion < version) return "recreate";
        return "update";
      })();
      switch (upgradeType) {
        case "create":
          const store2 = db.createObjectStore(storeName, { keyPath, autoIncrement: true });
          store2.createIndex(indexName, indexName, { unique: false });
          break;
        case "recreate":
          db.deleteObjectStore(storeName);
          const recreatedStore = db.createObjectStore(storeName, { keyPath, autoIncrement: true });
          recreatedStore.createIndex(indexName, indexName, { unique: false });
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
  return (_0) => __async(null, [_0], function* ({ action: _action, patches }) {
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
            const getAllRequest = store2.getAll();
            getAllRequest.onsuccess = (event) => {
              state = event.target.result;
              resolveState(state);
            };
          });
        }
        return Promise.resolve(state);
      };
      const applyPatches2 = () => __async(null, null, function* () {
        const getOperationType = (patch, relativePath) => {
          if (relativePath.length === 0) return patch.op === "remove" ? "removeAll" : "replaceAll";
          const index = parseInt(relativePath[0], 10);
          if (isNaN(index)) return "invalid";
          if (relativePath.length === 1) return patch.op === "remove" ? "removeAtIndex" : "modifyAtIndex";
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
          deleteRequest.onsuccess = () => resolveDelete();
        });
        for (const item of state) {
          yield new Promise((resolvePut) => {
            const putRequest = store2.put(item);
            putRequest.onsuccess = () => resolvePut();
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
    getState: () => __async(null, null, function* () {
      return new Promise((resolve) => {
        const data = localStorage.getItem(name);
        resolve(data ? JSON.parse(data) : null);
      });
    }),
    setState: (state) => __async(null, null, function* () {
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
  return (_0) => __async(null, [_0], function* ({ action: _action, state, previousState }) {
    if (state !== previousState) {
      yield toLocalStorage.setState(state);
      __trace(`localStorage:update`, `Updated ${toLocalStorage.name} with entire state`);
    }
  });
}

// src/invariant.ts
var isProduction = function() {
  const hostname = typeof window !== "undefined" && window.location && window.location.hostname || "";
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
  if (!alwaysEnabled && isProduction) return;
  if (!callback()) {
    const error = new InvariantViolationError("Invariant Violation: " + message);
    if (!isProduction) {
      captureStackTrace(error);
    }
    throw error;
  }
}
invariant.config = function(config) {
  const development = config.development;
  const production = config.production;
  if (typeof development === "function" && typeof production === "function") {
    const isDev = development();
    const isProd = production();
    isProduction = isProd && !isDev;
    alwaysEnabled = false;
  } else if (Object.hasOwn(config, "alwaysEnabled")) {
    alwaysEnabled = config.alwaysEnabled;
  }
};
var invariant_default = invariant;

// src/cami.ts
enableMapSet();
var { debug, events } = __config;
export {
  Model,
  Observable,
  ObservableState,
  ObservableStore,
  ReactiveElement,
  Type,
  _deepClone,
  _deepEqual,
  _deepMerge,
  createIdbPromise,
  createLocalStorage,
  createURLStore,
  debug,
  effect,
  events,
  x as html,
  invariant_default as invariant,
  i3 as keyed,
  persistToIdbThunk,
  persistToLocalStorageThunk,
  c2 as repeat,
  store,
  b as svg,
  o2 as unsafeHTML,
  useValidationHook,
  useValidationThunk
};
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
lit-html/directive.js:
lit-html/directives/unsafe-html.js:
lit-html/directives/repeat.js:
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
*/
//# sourceMappingURL=cami.module.js.map
