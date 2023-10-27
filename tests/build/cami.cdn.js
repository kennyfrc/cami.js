var cami = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
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
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
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

  // src/cami.js
  var cami_exports = {};
  __export(cami_exports, {
    ReactiveElement: () => ReactiveElement,
    createStore: () => createStore,
    html: () => x
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

  // src/cami.js
  var _state;
  var ReactiveElement = class extends HTMLElement {
    /**
     * @constructor
     */
    constructor() {
      super();
      /**
       * @type {State}
       * The internal state object for reactive behavior.
       */
      __privateAdd(this, _state, {});
    }
    /**
     * @method
     * @param {State} newState - The new state object
     */
    setState(newState) {
      __privateSet(this, _state, __spreadValues(__spreadValues({}, __privateGet(this, _state)), newState));
      this.updateView();
    }
    /**
     * @method
     * @returns {State} The current state
     */
    getState() {
      return __spreadValues({}, __privateGet(this, _state));
    }
    /**
     * @method
     * Invoked when the custom element is appended into a document-connected element. Sets up initial state and triggers initial rendering.
     */
    connectedCallback() {
      this.updateView();
    }
    /**
     * @method
     * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
     */
    updateView() {
      const template = this.template(__privateGet(this, _state));
      j(template, this);
    }
    /**
     * @method
     * @param {State} state - The current state
     * @throws {Error} If the method template() is not implemented
     */
    template(state) {
      throw new Error("You have to implement the method template()!");
    }
  };
  _state = new WeakMap();
  var produce = (base, recipe) => {
    if (typeof recipe !== "function") {
      throw new Error("Recipe should be a function");
    }
    const isDraftable = (value) => value && typeof value === "object" && !Object.isFrozen(value);
    const drafts = /* @__PURE__ */ new WeakMap();
    const createDraft = (target) => {
      if (!isDraftable(target))
        return target;
      if (drafts.has(target)) {
        return drafts.get(target);
      }
      const draft2 = Array.isArray(target) ? target.slice() : __spreadValues({}, target);
      drafts.set(target, draft2);
      return new Proxy(draft2, {
        get(target2, prop, receiver) {
          return createDraft(Reflect.get(target2, prop, receiver));
        },
        set(target2, prop, value, receiver) {
          return Reflect.set(target2, prop, value, receiver);
        }
      });
    };
    const draft = createDraft(base);
    recipe(draft);
    return draft;
  };
  var instance = null;
  var createStore = (initialState) => {
    if (instance) {
      return instance;
    }
    let state = initialState;
    let listeners = [];
    let reducers = {};
    let middlewares = [];
    let dispatchQueue = [];
    let isProcessingQueue = false;
    const devTools = window["__REDUX_DEVTOOLS_EXTENSION__"] && window["__REDUX_DEVTOOLS_EXTENSION__"].connect();
    const use = (middleware) => {
      middlewares.push(middleware);
    };
    const subscribe = (listener) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    };
    const register = (action, reducer) => {
      if (reducers[action]) {
        throw new Error(`Action type ${action} is already registered.`);
      }
      reducers[action] = reducer;
    };
    const processQueue = () => __async(void 0, null, function* () {
      if (dispatchQueue.length === 0) {
        isProcessingQueue = false;
        return;
      }
      isProcessingQueue = true;
      const { action, payload } = dispatchQueue.shift();
      const reducer = reducers[action];
      if (!reducer) {
        console.warn(`No reducer found for action ${action}`);
        return;
      }
      const middlewareAPI = {
        getState: () => state,
        dispatch: (action2, payload2) => dispatch(action2, payload2)
      };
      const chain = middlewares.map((middleware) => middleware(middlewareAPI));
      const dispatchWithMiddleware = chain.reduce((next, middleware) => middleware(next), baseDispatch);
      yield dispatchWithMiddleware(action, payload);
      processQueue();
    });
    const dispatch = (action, payload) => {
      dispatchQueue.push({ action, payload });
      if (!isProcessingQueue) {
        processQueue();
      }
    };
    const baseDispatch = (action, payload) => __async(void 0, null, function* () {
      let newState;
      let asyncTask = null;
      newState = produce(state, (draft) => {
        const result = reducers[action](draft, payload);
        if (result instanceof Promise) {
          asyncTask = result;
          return;
        }
      });
      if (asyncTask) {
        yield asyncTask;
      }
      state = newState;
      notify(action);
      return newState;
    });
    const notify = (action) => {
      for (const listener of listeners) {
        listener(state, action);
      }
      devTools && devTools.send(action, state);
    };
    instance = {
      state,
      subscribe,
      register,
      dispatch,
      use
    };
    return instance;
  };
  return __toCommonJS(cami_exports);
})();
/*! Bundled license information:

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=cami.cdn.js.map
