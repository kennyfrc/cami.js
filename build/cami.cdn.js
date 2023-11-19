var cami=(()=>{var Z=Object.defineProperty;var ut=Object.getOwnPropertyDescriptor;var lt=Object.getOwnPropertyNames;var Ce=Object.getOwnPropertySymbols;var De=Object.prototype.hasOwnProperty;var ft=Object.prototype.propertyIsEnumerable;var Te=(r,e)=>{if(e=Symbol[r])return e;throw Error("Symbol."+r+" is not defined")};var Ne=(r,e,t)=>e in r?Z(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t;var Me=(r,e)=>{for(var t in e||(e={}))if(De.call(e,t))Ne(r,t,e[t]);if(Ce)for(var t of Ce(e)){if(ft.call(e,t))Ne(r,t,e[t])}return r};var ht=(r,e)=>{for(var t in e)Z(r,t,{get:e[t],enumerable:true})};var dt=(r,e,t,s)=>{if(e&&typeof e==="object"||typeof e==="function"){for(let n of lt(e))if(!De.call(r,n)&&n!==t)Z(r,n,{get:()=>e[n],enumerable:!(s=ut(e,n))||s.enumerable})}return r};var pt=r=>dt(Z({},"__esModule",{value:true}),r);var U=(r,e,t)=>{return new Promise((s,n)=>{var i=a=>{try{c(t.next(a))}catch(l){n(l)}};var o=a=>{try{c(t.throw(a))}catch(l){n(l)}};var c=a=>a.done?s(a.value):Promise.resolve(a.value).then(i,o);c((t=t.apply(r,e)).next())})};var ae=(r,e,t)=>(e=r[Te("asyncIterator")])?e.call(r):(r=r[Te("iterator")](),e={},t=(s,n)=>(n=r[s])&&(e[s]=i=>new Promise((o,c,a)=>(i=n.call(r,i),a=i.done,Promise.resolve(i.value).then(l=>o({value:l,done:a}),c)))),t("next"),t("return"),e);var Nt={};ht(Nt,{Observable:()=>m,ObservableElement:()=>oe,ObservableState:()=>g,ObservableStore:()=>Q,ObservableStream:()=>v,ReactiveElement:()=>Se,camiConfig:()=>ie,config:()=>Tt,define:()=>jt,html:()=>Ge,store:()=>Ct});var L=globalThis;var q=L.trustedTypes;var ze=q?q.createPolicy("lit-html",{createHTML:r=>r}):void 0;var We="$lit$";var A=`lit$${(Math.random()+"").slice(9)}$`;var Be="?"+A;var _t=`<${Be}>`;var P=document;var R=()=>P.createComment("");var W=r=>null===r||"object"!=typeof r&&"function"!=typeof r;var Ve=Array.isArray;var bt=r=>Ve(r)||"function"==typeof(r==null?void 0:r[Symbol.iterator]);var ue="[ 	\n\f\r]";var F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;var Ie=/-->/g;var He=/>/g;var E=RegExp(`>|${ue}(?:([^\\s"'>=/]+)(${ue}*=${ue}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g");var Ue=/'/g;var Fe=/"/g;var ke=/^(?:script|style|textarea|title)$/i;var Xe=r=>(e,...t)=>({_$litType$:r,strings:e,values:t});var Ge=Xe(1);var Mt=Xe(2);var B=Symbol.for("lit-noChange");var h=Symbol.for("lit-nothing");var Le=new WeakMap;var O=P.createTreeWalker(P,129);function Je(r,e){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==ze?ze.createHTML(e):e}var mt=(r,e)=>{const t=r.length-1,s=[];let n,i=2===e?"<svg>":"",o=F;for(let c=0;c<t;c++){const a=r[c];let l,f,u=-1,y=0;for(;y<a.length&&(o.lastIndex=y,f=o.exec(a),null!==f);)y=o.lastIndex,o===F?"!--"===f[1]?o=Ie:void 0!==f[1]?o=He:void 0!==f[2]?(ke.test(f[2])&&(n=RegExp("</"+f[2],"g")),o=E):void 0!==f[3]&&(o=E):o===E?">"===f[0]?(o=n!=null?n:F,u=-1):void 0===f[1]?u=-2:(u=o.lastIndex-f[2].length,l=f[1],o=void 0===f[3]?E:'"'===f[3]?Fe:Ue):o===Fe||o===Ue?o=E:o===Ie||o===He?o=F:(o=E,n=void 0);const d=o===E&&r[c+1].startsWith("/>")?" ":"";i+=o===F?a+_t:u>=0?(s.push(l),a.slice(0,u)+We+a.slice(u)+A+d):a+A+(-2===u?c:d)}return[Je(r,i+(r[t]||"<?>")+(2===e?"</svg>":"")),s]};var V=class r{constructor({strings:e,_$litType$:t},s){let n;this.parts=[];let i=0,o=0;const c=e.length-1,a=this.parts,[l,f]=mt(e,t);if(this.el=r.createElement(l,s),O.currentNode=this.el.content,2===t){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;null!==(n=O.nextNode())&&a.length<c;){if(1===n.nodeType){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(We)){const y=f[o++],d=n.getAttribute(u).split(A),N=/([.?@])?(.*)/.exec(y);a.push({type:1,index:i,name:N[2],strings:d,ctor:"."===N[1]?he:"?"===N[1]?de:"@"===N[1]?pe:M}),n.removeAttribute(u)}else u.startsWith(A)&&(a.push({type:6,index:i}),n.removeAttribute(u));if(ke.test(n.tagName)){const u=n.textContent.split(A),y=u.length-1;if(y>0){n.textContent=q?q.emptyScript:"";for(let d=0;d<y;d++)n.append(u[d],R()),O.nextNode(),a.push({type:2,index:++i});n.append(u[y],R())}}}else if(8===n.nodeType)if(n.data===Be)a.push({type:2,index:i});else{let u=-1;for(;-1!==(u=n.data.indexOf(A,u+1));)a.push({type:7,index:i}),u+=A.length-1}i++}}static createElement(e,t){const s=P.createElement("template");return s.innerHTML=e,s}};function D(r,e,t=r,s){var o,c,a;if(e===B)return e;let n=void 0!==s?(o=t._$Co)==null?void 0:o[s]:t._$Cl;const i=W(e)?void 0:e._$litDirective$;return(n==null?void 0:n.constructor)!==i&&((c=n==null?void 0:n._$AO)==null?void 0:c.call(n,false),void 0===i?n=void 0:(n=new i(r),n._$AT(r,t,s)),void 0!==s?((a=t._$Co)!=null?a:t._$Co=[])[s]=n:t._$Cl=n),void 0!==n&&(e=D(r,n._$AS(r,e.values),n,s)),e}var fe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var l;const{el:{content:t},parts:s}=this._$AD,n=((l=e==null?void 0:e.creationScope)!=null?l:P).importNode(t,true);O.currentNode=n;let i=O.nextNode(),o=0,c=0,a=s[0];for(;void 0!==a;){if(o===a.index){let f;2===a.type?f=new k(i,i.nextSibling,this,e):1===a.type?f=new a.ctor(i,a.name,a.strings,this,e):6===a.type&&(f=new _e(i,this,e)),this._$AV.push(f),a=s[++c]}o!==(a==null?void 0:a.index)&&(i=O.nextNode(),o++)}return O.currentNode=P,n}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}};var k=class r{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,s,n){var i;this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=n,this._$Cv=(i=n==null?void 0:n.isConnected)!=null?i:true}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===(e==null?void 0:e.nodeType)&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=D(this,e,t),W(e)?e===h||null==e||""===e?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):bt(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==h&&W(this._$AH)?this._$AA.nextSibling.data=e:this.$(P.createTextNode(e)),this._$AH=e}g(e){var i;const{values:t,_$litType$:s}=e,n="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=V.createElement(Je(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===n)this._$AH.p(t);else{const o=new fe(n,this),c=o.u(this.options);o.p(t),this.$(c),this._$AH=o}}_$AC(e){let t=Le.get(e.strings);return void 0===t&&Le.set(e.strings,t=new V(e)),t}T(e){Ve(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,n=0;for(const i of e)n===t.length?t.push(s=new r(this.k(R()),this.k(R()),this,this.options)):s=t[n],s._$AI(i),n++;n<t.length&&(this._$AR(s&&s._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,false,true,t);e&&e!==this._$AB;){const n=e.nextSibling;e.remove(),e=n}}setConnected(e){var t;void 0===this._$AM&&(this._$Cv=e,(t=this._$AP)==null?void 0:t.call(this,e))}};var M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,n,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(e,t=this,s,n){const i=this.strings;let o=false;if(void 0===i)e=D(this,e,t,0),o=!W(e)||e!==this._$AH&&e!==B,o&&(this._$AH=e);else{const c=e;let a,l;for(e=i[0],a=0;a<i.length-1;a++)l=D(this,c[s+a],t,a),l===B&&(l=this._$AH[a]),o||(o=!W(l)||l!==this._$AH[a]),l===h?e=h:e!==h&&(e+=(l!=null?l:"")+i[a+1]),this._$AH[a]=l}o&&!n&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}};var he=class extends M{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}};var de=class extends M{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}};var pe=class extends M{constructor(e,t,s,n,i){super(e,t,s,n,i),this.type=5}_$AI(e,t=this){var o;if((e=(o=D(this,e,t,0))!=null?o:h)===B)return;const s=this._$AH,n=e===h&&s!==h||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==h&&(s===h||n);n&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;"function"==typeof this._$AH?this._$AH.call((s=(t=this.options)==null?void 0:t.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}};var _e=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){D(this,e)}};var le=L.litHtmlPolyfillSupport;var Re;le==null?void 0:le(V,k),((Re=L.litHtmlVersions)!=null?Re:L.litHtmlVersions=[]).push("3.0.0");var Qe=(r,e,t)=>{var i,o;const s=(i=t==null?void 0:t.renderBefore)!=null?i:e;let n=s._$litPart$;if(void 0===n){const c=(o=t==null?void 0:t.renderBefore)!=null?o:null;s._$litPart$=n=new k(e.insertBefore(R(),c),c,void 0,t!=null?t:{})}return n._$AI(r),n};var tt=Symbol.for("immer-nothing");var Ye=Symbol.for("immer-draftable");var _=Symbol.for("immer-state");var yt=true?[function(r){return`The plugin for '${r}' has not been loaded into Immer. To enable the plugin, import and call \`enable${r}()\` when initializing your application.`},function(r){return`produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${r}'`},"This object has been frozen and should not be mutated",function(r){return"Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+r},"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.","Immer forbids circular references","The first or second argument to `produce` must be a function","The third argument to `produce` must be a function or undefined","First argument to `createDraft` must be a plain object, an array, or an immerable object","First argument to `finishDraft` must be a draft returned by `createDraft`",function(r){return`'current' expects a draft, got: ${r}`},"Object.defineProperty() cannot be used on an Immer draft","Object.setPrototypeOf() cannot be used on an Immer draft","Immer only supports deleting array indices","Immer only supports setting array indices and the 'length' property",function(r){return`'original' expects a draft, got: ${r}`}]:[];function p(r,...e){if(true){const t=yt[r];const s=typeof t==="function"?t.apply(null,e):t;throw new Error(`[Immer] ${s}`)}throw new Error(`[Immer] minified error nr: ${r}. Full error at: https://bit.ly/3cXEKWf`)}var z=Object.getPrototypeOf;function I(r){return!!r&&!!r[_]}function j(r){var e;if(!r)return false;return rt(r)||Array.isArray(r)||!!r[Ye]||!!((e=r.constructor)==null?void 0:e[Ye])||re(r)||se(r)}var vt=Object.prototype.constructor.toString();function rt(r){if(!r||typeof r!=="object")return false;const e=z(r);if(e===null){return true}const t=Object.hasOwnProperty.call(e,"constructor")&&e.constructor;if(t===Object)return true;return typeof t=="function"&&Function.toString.call(t)===vt}function X(r,e){if(te(r)===0){Object.entries(r).forEach(([t,s])=>{e(t,s,r)})}else{r.forEach((t,s)=>e(s,t,r))}}function te(r){const e=r[_];return e?e.type_:Array.isArray(r)?1:re(r)?2:se(r)?3:0}function ye(r,e){return te(r)===2?r.has(e):Object.prototype.hasOwnProperty.call(r,e)}function st(r,e,t){const s=te(r);if(s===2)r.set(e,t);else if(s===3){r.add(t)}else r[e]=t}function wt(r,e){if(r===e){return r!==0||1/r===1/e}else{return r!==r&&e!==e}}function re(r){return r instanceof Map}function se(r){return r instanceof Set}function S(r){return r.copy_||r.base_}function ve(r,e){if(re(r)){return new Map(r)}if(se(r)){return new Set(r)}if(Array.isArray(r))return Array.prototype.slice.call(r);if(!e&&rt(r)){if(!z(r)){const n=Object.create(null);return Object.assign(n,r)}return Me({},r)}const t=Object.getOwnPropertyDescriptors(r);delete t[_];let s=Reflect.ownKeys(t);for(let n=0;n<s.length;n++){const i=s[n];const o=t[i];if(o.writable===false){o.writable=true;o.configurable=true}if(o.get||o.set)t[i]={configurable:true,writable:true,enumerable:o.enumerable,value:r[i]}}return Object.create(z(r),t)}function xe(r,e=false){if(ne(r)||I(r)||!j(r))return r;if(te(r)>1){r.set=r.add=r.clear=r.delete=At}Object.freeze(r);if(e)X(r,(t,s)=>xe(s,true),true);return r}function At(){p(2)}function ne(r){return Object.isFrozen(r)}var gt={};function C(r){const e=gt[r];if(!e){p(0,r)}return e}var G;function nt(){return G}function $t(r,e){return{drafts_:[],parent_:r,immer_:e,canAutoFreeze_:true,unfinalizedDrafts_:0}}function Ze(r,e){if(e){C("Patches");r.patches_=[];r.inversePatches_=[];r.patchListener_=e}}function we(r){Ae(r);r.drafts_.forEach(xt);r.drafts_=null}function Ae(r){if(r===G){G=r.parent_}}function qe(r){return G=$t(G,r)}function xt(r){const e=r[_];if(e.type_===0||e.type_===1)e.revoke_();else e.revoked_=true}function Ke(r,e){e.unfinalizedDrafts_=e.drafts_.length;const t=e.drafts_[0];const s=r!==void 0&&r!==t;if(s){if(t[_].modified_){we(e);p(4)}if(j(r)){r=K(e,r);if(!e.parent_)ee(e,r)}if(e.patches_){C("Patches").generateReplacementPatches_(t[_].base_,r,e.patches_,e.inversePatches_)}}else{r=K(e,t,[])}we(e);if(e.patches_){e.patchListener_(e.patches_,e.inversePatches_)}return r!==tt?r:void 0}function K(r,e,t){if(ne(e))return e;const s=e[_];if(!s){X(e,(n,i)=>et(r,s,e,n,i,t),true);return e}if(s.scope_!==r)return e;if(!s.modified_){ee(r,s.base_,true);return s.base_}if(!s.finalized_){s.finalized_=true;s.scope_.unfinalizedDrafts_--;const n=s.copy_;let i=n;let o=false;if(s.type_===3){i=new Set(n);n.clear();o=true}X(i,(c,a)=>et(r,s,n,c,a,t,o));ee(r,n,false);if(t&&r.patches_){C("Patches").generatePatches_(s,t,r.patches_,r.inversePatches_)}}return s.copy_}function et(r,e,t,s,n,i,o){if(n===t)p(5);if(I(n)){const c=i&&e&&e.type_!==3&&!ye(e.assigned_,s)?i.concat(s):void 0;const a=K(r,n,c);st(t,s,a);if(I(a)){r.canAutoFreeze_=false}else return}else if(o){t.add(n)}if(j(n)&&!ne(n)){if(!r.immer_.autoFreeze_&&r.unfinalizedDrafts_<1){return}K(r,n);if(!e||!e.scope_.parent_)ee(r,n)}}function ee(r,e,t=false){if(!r.parent_&&r.immer_.autoFreeze_&&r.canAutoFreeze_){xe(e,t)}}function Et(r,e){const t=Array.isArray(r);const s={type_:t?1:0,scope_:e?e.scope_:nt(),modified_:false,finalized_:false,assigned_:{},parent_:e,base_:r,draft_:null,copy_:null,revoke_:null,isManual_:false};let n=s;let i=Ee;if(t){n=[s];i=J}const{revoke:o,proxy:c}=Proxy.revocable(n,i);s.draft_=c;s.revoke_=o;return c}var Ee={get(r,e){if(e===_)return r;const t=S(r);if(!ye(t,e)){return Ot(r,t,e)}const s=t[e];if(r.finalized_||!j(s)){return s}if(s===be(r.base_,e)){me(r);return r.copy_[e]=$e(s,r)}return s},has(r,e){return e in S(r)},ownKeys(r){return Reflect.ownKeys(S(r))},set(r,e,t){const s=it(S(r),e);if(s==null?void 0:s.set){s.set.call(r.draft_,t);return true}if(!r.modified_){const n=be(S(r),e);const i=n==null?void 0:n[_];if(i&&i.base_===t){r.copy_[e]=t;r.assigned_[e]=false;return true}if(wt(t,n)&&(t!==void 0||ye(r.base_,e)))return true;me(r);ge(r)}if(r.copy_[e]===t&&(t!==void 0||e in r.copy_)||Number.isNaN(t)&&Number.isNaN(r.copy_[e]))return true;r.copy_[e]=t;r.assigned_[e]=true;return true},deleteProperty(r,e){if(be(r.base_,e)!==void 0||e in r.base_){r.assigned_[e]=false;me(r);ge(r)}else{delete r.assigned_[e]}if(r.copy_){delete r.copy_[e]}return true},getOwnPropertyDescriptor(r,e){const t=S(r);const s=Reflect.getOwnPropertyDescriptor(t,e);if(!s)return s;return{writable:true,configurable:r.type_!==1||e!=="length",enumerable:s.enumerable,value:t[e]}},defineProperty(){p(11)},getPrototypeOf(r){return z(r.base_)},setPrototypeOf(){p(12)}};var J={};X(Ee,(r,e)=>{J[r]=function(){arguments[0]=arguments[0][0];return e.apply(this,arguments)}});J.deleteProperty=function(r,e){if(isNaN(parseInt(e)))p(13);return J.set.call(this,r,e,void 0)};J.set=function(r,e,t){if(e!=="length"&&isNaN(parseInt(e)))p(14);return Ee.set.call(this,r[0],e,t,r[0])};function be(r,e){const t=r[_];const s=t?S(t):r;return s[e]}function Ot(r,e,t){var n;const s=it(e,t);return s?`value`in s?s.value:(n=s.get)==null?void 0:n.call(r.draft_):void 0}function it(r,e){if(!(e in r))return void 0;let t=z(r);while(t){const s=Object.getOwnPropertyDescriptor(t,e);if(s)return s;t=z(t)}return void 0}function ge(r){if(!r.modified_){r.modified_=true;if(r.parent_){ge(r.parent_)}}}function me(r){if(!r.copy_){r.copy_=ve(r.base_,r.scope_.immer_.useStrictShallowCopy_)}}var Pt=class{constructor(r){this.autoFreeze_=true;this.useStrictShallowCopy_=false;this.produce=(e,t,s)=>{if(typeof e==="function"&&typeof t!=="function"){const i=t;t=e;const o=this;return function c(a=i,...l){return o.produce(a,f=>t.call(this,f,...l))}}if(typeof t!=="function")p(6);if(s!==void 0&&typeof s!=="function")p(7);let n;if(j(e)){const i=qe(this);const o=$e(e,void 0);let c=true;try{n=t(o);c=false}finally{if(c)we(i);else Ae(i)}Ze(i,s);return Ke(n,i)}else if(!e||typeof e!=="object"){n=t(e);if(n===void 0)n=e;if(n===tt)n=void 0;if(this.autoFreeze_)xe(n,true);if(s){const i=[];const o=[];C("Patches").generateReplacementPatches_(e,n,i,o);s(i,o)}return n}else p(1,e)};this.produceWithPatches=(e,t)=>{if(typeof e==="function"){return(o,...c)=>this.produceWithPatches(o,a=>e(a,...c))}let s,n;const i=this.produce(e,t,(o,c)=>{s=o;n=c});return[i,s,n]};if(typeof(r==null?void 0:r.autoFreeze)==="boolean")this.setAutoFreeze(r.autoFreeze);if(typeof(r==null?void 0:r.useStrictShallowCopy)==="boolean")this.setUseStrictShallowCopy(r.useStrictShallowCopy)}createDraft(r){if(!j(r))p(8);if(I(r))r=St(r);const e=qe(this);const t=$e(r,void 0);t[_].isManual_=true;Ae(e);return t}finishDraft(r,e){const t=r&&r[_];if(!t||!t.isManual_)p(9);const{scope_:s}=t;Ze(s,e);return Ke(void 0,s)}setAutoFreeze(r){this.autoFreeze_=r}setUseStrictShallowCopy(r){this.useStrictShallowCopy_=r}applyPatches(r,e){let t;for(t=e.length-1;t>=0;t--){const n=e[t];if(n.path.length===0&&n.op==="replace"){r=n.value;break}}if(t>-1){e=e.slice(t+1)}const s=C("Patches").applyPatches_;if(I(r)){return s(r,e)}return this.produce(r,n=>s(n,e))}};function $e(r,e){const t=re(r)?C("MapSet").proxyMap_(r,e):se(r)?C("MapSet").proxySet_(r,e):Et(r,e);const s=e?e.scope_:nt();s.drafts_.push(t);return t}function St(r){if(!I(r))p(10,r);return ot(r)}function ot(r){if(!j(r)||ne(r))return r;const e=r[_];let t;if(e){if(!e.modified_)return e.base_;e.finalized_=true;t=ve(r,e.scope_.immer_.useStrictShallowCopy_)}else{t=ve(r,true)}X(t,(s,n)=>{st(t,s,ot(n))});if(e){e.finalized_=false}return t}var b=new Pt;var T=b.produce;var It=b.produceWithPatches.bind(b);var Ht=b.setAutoFreeze.bind(b);var Ut=b.setUseStrictShallowCopy.bind(b);var Ft=b.applyPatches.bind(b);var Lt=b.createDraft.bind(b);var Rt=b.finishDraft.bind(b);var Oe=class{constructor(e){if(typeof e==="function"){this.observer={next:e}}else{this.observer=e}this.teardowns=[];if(typeof AbortController!=="undefined"){this.controller=new AbortController;this.signal=this.controller.signal}this.isUnsubscribed=false}next(e){if(!this.isUnsubscribed&&this.observer.next){this.observer.next(e)}}complete(){if(!this.isUnsubscribed){if(this.observer.complete){this.observer.complete()}this.unsubscribe()}}error(e){if(!this.isUnsubscribed){if(this.observer.error){this.observer.error(e)}this.unsubscribe()}}addTeardown(e){this.teardowns.push(e)}unsubscribe(){if(!this.isUnsubscribed){this.isUnsubscribed=true;if(this.controller){this.controller.abort()}this.teardowns.forEach(e=>{if(typeof e!=="function"){throw new Error("[Cami.js] Teardown must be a function. Please implement a teardown function in your subscriber.")}e()})}}};var m=class{constructor(e=()=>()=>{}){this._observers=[];this.subscribeCallback=e}subscribe(e=()=>{},t=()=>{},s=()=>{}){let n;if(typeof e==="function"){n={next:e,error:t,complete:s}}else if(typeof e==="object"){n=e}else{throw new Error("[Cami.js] First argument to subscribe must be a next callback or an observer object")}const i=new Oe(n);let o=()=>{};try{o=this.subscribeCallback(i)}catch(c){if(i.error){i.error(c)}else{console.error("[Cami.js] Error in Subscriber:",c)}return}i.addTeardown(o);this._observers.push(i);return{unsubscribe:()=>i.unsubscribe(),complete:()=>i.complete(),error:c=>i.error(c)}}onValue(e){return this.subscribe({next:e})}onError(e){return this.subscribe({error:e})}onEnd(e){return this.subscribe({complete:e})}[Symbol.asyncIterator](){let e;let t;let s=new Promise(n=>t=n);e={next:n=>{t({value:n,done:false});s=new Promise(i=>t=i)},complete:()=>{t({done:true})},error:n=>{throw n}};this.subscribe(e);return{next:()=>s}}};var Q=class extends m{constructor(e){if(typeof e!=="object"||e===null){throw new TypeError("[Cami.js] initialState must be an object")}super(t=>{this._subscriber=t;return()=>{this._subscriber=null}});this.state=new Proxy(e,{get:(t,s)=>{return t[s]},set:(t,s,n)=>{t[s]=n;this._observers.forEach(i=>i.next(this.state));if(this.devTools){this.devTools.send(s,this.state)}return true}});this.reducers={};this.middlewares=[];this.devTools=this.connectToDevTools()}connectToDevTools(){if(typeof window!=="undefined"&&window["__REDUX_DEVTOOLS_EXTENSION__"]){const e=window["__REDUX_DEVTOOLS_EXTENSION__"].connect();e.init(this.state);return e}return null}use(e){this.middlewares.push(e)}register(e,t){if(this.reducers[e]){throw new Error(`[Cami.js] Action type ${e} is already registered.`)}this.reducers[e]=t}dispatch(e,t){if(typeof e==="function"){return e(this.dispatch.bind(this),()=>this.state)}if(typeof e!=="string"){throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof e}`)}const s=this.reducers[e];if(!s){console.warn(`No reducer found for action ${e}`);return}const n={state:this.state,action:e,payload:t};for(const i of this.middlewares){i(n)}this.state=T(this.state,i=>{s(i,n.payload)});this._observers.forEach(i=>i.next(this.state));if(this.devTools){this.devTools.send(e,this.state)}}};var v=class r extends m{static from(e){if(e instanceof m){return new r(t=>{const s=e.subscribe({next:n=>t.next(n),error:n=>t.error(n),complete:()=>t.complete()});return()=>{if(!s.closed){s.unsubscribe()}}})}else if(e[Symbol.asyncIterator]){return new r(t=>{let s=false;(()=>U(this,null,function*(){try{try{for(var n=ae(e),i,o,c;i=!(o=yield n.next()).done;i=false){const a=o.value;if(s)return;t.next(a)}}catch(o){c=[o]}finally{try{i&&(o=n.return)&&(yield o.call(n))}finally{if(c)throw c[0]}}t.complete()}catch(a){t.error(a)}}))();return()=>{s=true}})}else if(e[Symbol.iterator]){return new r(t=>{try{for(const s of e){t.next(s)}t.complete()}catch(s){t.error(s)}return()=>{if(!subscription.closed){subscription.unsubscribe()}}})}else if(e instanceof Promise){return new r(t=>{e.then(s=>{t.next(s);t.complete()},s=>t.error(s));return()=>{}})}else{throw new TypeError("[Cami.js] ObservableStream.from requires an Observable, AsyncIterable, Iterable, or Promise")}}map(e){return new r(t=>{const s=this.subscribe({next:n=>t.next(e(n)),error:n=>t.error(n),complete:()=>t.complete()});return()=>s.unsubscribe()})}filter(e){return new r(t=>{const s=this.subscribe({next:n=>{if(e(n)){t.next(n)}},error:n=>t.error(n),complete:()=>t.complete()});return()=>s.unsubscribe()})}reduce(e,t){return new Promise((s,n)=>{let i=t;const o=this.subscribe({next:c=>{i=e(i,c)},error:c=>n(c),complete:()=>s(i)});return()=>o.unsubscribe()})}takeUntil(e){return new r(t=>{const s=this.subscribe({next:i=>t.next(i),error:i=>t.error(i),complete:()=>t.complete()});const n=e.subscribe({next:()=>{t.complete();s.unsubscribe();n.unsubscribe()},error:i=>t.error(i)});return()=>{s.unsubscribe();n.unsubscribe()}})}take(e){return new r(t=>{let s=0;const n=this.subscribe({next:i=>{if(s++<e){t.next(i)}else{t.complete();n.unsubscribe()}},error:i=>t.error(i),complete:()=>t.complete()});return()=>n.unsubscribe()})}drop(e){return new r(t=>{let s=0;const n=this.subscribe({next:i=>{if(s++>=e){t.next(i)}},error:i=>t.error(i),complete:()=>t.complete()});return()=>n.unsubscribe()})}flatMap(e){return new r(t=>{const s=new Set;const n=this.subscribe({next:i=>{const o=e(i);const c=o.subscribe({next:a=>t.next(a),error:a=>t.error(a),complete:()=>{s.delete(c);if(s.size===0){t.complete()}}});s.add(c)},error:i=>t.error(i),complete:()=>{if(s.size===0){t.complete()}}});return()=>{n.unsubscribe();s.forEach(i=>i.unsubscribe())}})}switchMap(e){return new r(t=>{let s=null;const n=this.subscribe({next:i=>{if(s){s.unsubscribe()}const o=e(i);s=o.subscribe({next:c=>t.next(c),error:c=>t.error(c),complete:()=>{if(s){s.unsubscribe();s=null}}})},error:i=>t.error(i),complete:()=>{if(s){s.unsubscribe()}t.complete()}});return()=>{n.unsubscribe();if(s){s.unsubscribe()}}})}toArray(){return new Promise((e,t)=>{const s=[];this.subscribe({next:n=>s.push(n),error:n=>t(n),complete:()=>e(s)})})}forEach(e){return new Promise((t,s)=>{this.subscribe({next:n=>e(n),error:n=>s(n),complete:()=>t()})})}every(e){return new Promise((t,s)=>{let n=true;this.subscribe({next:i=>{if(!e(i)){n=false;t(false)}},error:i=>s(i),complete:()=>t(n)})})}find(e){return new Promise((t,s)=>{const n=this.subscribe({next:i=>{if(e(i)){t(i);n.unsubscribe()}},error:i=>s(i),complete:()=>t(void 0)})})}some(e){return new Promise((t,s)=>{const n=this.subscribe({next:i=>{if(e(i)){t(true);n.unsubscribe()}},error:i=>s(i),complete:()=>t(false)})})}finally(e){return new r(t=>{const s=this.subscribe({next:n=>t.next(n),error:n=>{e();t.error(n)},complete:()=>{e();t.complete()}});return()=>{s.unsubscribe()}})}toState(e=null){const t=new g(e);this.subscribe({next:s=>t.update(()=>s),error:s=>t.error(s),complete:()=>t.complete()});return t}push(e){if(e instanceof m){const t=e.subscribe({next:s=>this._observers.forEach(n=>n.next(s)),error:s=>this._observers.forEach(n=>n.error(s)),complete:()=>this._observers.forEach(s=>s.complete())})}else if(e[Symbol.asyncIterator]){(()=>U(this,null,function*(){try{try{for(var t=ae(e),s,n,i;s=!(n=yield t.next()).done;s=false){const o=n.value;this._observers.forEach(c=>c.next(o))}}catch(n){i=[n]}finally{try{s&&(n=t.return)&&(yield n.call(t))}finally{if(i)throw i[0]}}this._observers.forEach(o=>o.complete())}catch(o){this._observers.forEach(c=>c.error(o))}}))()}else if(e[Symbol.iterator]){try{for(const t of e){this._observers.forEach(s=>s.next(t))}this._observers.forEach(t=>t.complete())}catch(t){this._observers.forEach(s=>s.error(t))}}else if(e instanceof Promise){e.then(t=>{this._observers.forEach(s=>s.next(t));this._observers.forEach(s=>s.complete())},t=>this._observers.forEach(s=>s.error(t)))}else{this._observers.forEach(t=>t.next(e))}}plug(e){e.subscribe({next:t=>this.push(t),error:t=>this._observers.forEach(s=>s.error(t)),complete:()=>this._observers.forEach(t=>t.complete())})}end(){this._observers.forEach(e=>{if(e&&typeof e.complete==="function"){e.complete()}})}};var $={current:null};var g=class extends m{constructor(e=null,t=null,{last:s=false,name:n=null}={}){super();if(s){this._lastObserver=t}else{this._observers.push(t)}this._value=T(e,i=>{});this._pendingUpdates=[];this._updateScheduled=false;this._name=n}get value(){if($.current!=null){$.current.addDependency(this)}return this._value}set value(e){this.update(()=>e)}assign(e){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(t=>Object.assign(t,e))}set(e,t){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(s=>{s[e]=t})}delete(e){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(t=>{delete t[e]})}clear(){this.update(()=>({}))}push(...e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(t=>{t.push(...e)})}pop(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.pop()})}shift(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.shift()})}splice(e,t,...s){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.splice(e,t,...s)})}unshift(...e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(t=>{t.unshift(...e)})}reverse(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.reverse()})}sort(e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(t=>{t.sort(e)})}fill(e,t=0,s=this._value.length){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.fill(e,t,s)})}copyWithin(e,t,s=this._value.length){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.copyWithin(e,t,s)})}update(e){this._pendingUpdates.push(e);if(!this._updateScheduled){this._updateScheduled=true;if(typeof window!=="undefined"){requestAnimationFrame(this._applyUpdates.bind(this))}else{this._applyUpdates()}}}notifyObservers(){const e=[...this._observers,this._lastObserver];e.forEach(t=>{if(t&&typeof t==="function"){t(this._value)}else if(t&&t.next){t.next(this._value)}})}_applyUpdates(){let e=this._value;while(this._pendingUpdates.length>0){const t=this._pendingUpdates.shift();this._value=T(this._value,t)}if(e!==this._value){this.notifyObservers();if(ie.events&&typeof window!=="undefined"){const t=new CustomEvent("cami:state:change",{detail:{name:this._name,oldValue:e,newValue:this._value}});window.dispatchEvent(t)}}this._updateScheduled=false}toStream(){const e=new v;this.subscribe({next:t=>e.emit(t),error:t=>e.error(t),complete:()=>e.end()});return e}complete(){this._observers.forEach(e=>{if(e&&typeof e.complete==="function"){e.complete()}})}};var Pe=class extends g{constructor(e){super(null);this.computeFn=e;this.dependencies=new Set;this.subscriptions=new Map;this.compute()}get value(){if($.current){$.current.addDependency(this)}return this._value}compute(){const e={addDependency:s=>{if(!this.dependencies.has(s)){const n=s.onValue(()=>this.compute());this.dependencies.add(s);this.subscriptions.set(s,n)}}};$.current=e;const t=this.computeFn();$.current=null;if(t!==this._value){this._value=t;this.notifyObservers()}}dispose(){this.subscriptions.forEach(e=>{e.unsubscribe()})}};var ct=function(r){return new Pe(r)};var at=function(r){let e=()=>{};let t=new Set;let s=new Map;const n={addDependency:c=>{if(!t.has(c)){const a=c.onValue(i);t.add(c);s.set(c,a)}}};const i=()=>{e();$.current=n;e=r()||(()=>{});$.current=null};if(typeof window!=="undefined"){requestAnimationFrame(i)}else{setTimeout(i,0)}const o=()=>{s.forEach(c=>{c.unsubscribe()});e()};return o};var oe=class extends v{constructor(e){super();if(typeof e==="string"){this.element=document.querySelector(e);if(!this.element){throw new Error(`[Cami.js] Element not found for selector: ${e}`)}}else if(e instanceof Element||e instanceof Document){this.element=e}else{throw new Error(`[Cami.js] Invalid argument: ${e}`)}}on(e,t={}){return new v(s=>{const n=i=>{s.next(i)};this.element.addEventListener(e,n,t);return()=>{this.element.removeEventListener(e,n,t)}})}};var Y=new Map;var Se=class extends HTMLElement{constructor(){super();this._unsubscribers=new Map;this.store=null;this._effects=[];this._isWithinBatch=false;this.computed=ct.bind(this);this.effect=at.bind(this)}_isObjectOrArray(e){return e!==null&&(typeof e==="object"||Array.isArray(e))}_handleObjectOrArray(e,t,s,n=false){const i=this._observableProxy(s);Object.defineProperty(e,t,{get:()=>i,set:o=>{s.update(()=>o);if(n){this.setAttribute(t,o)}}})}_handleNonObject(e,t,s,n=false){Object.defineProperty(e,t,{get:()=>s.value,set:i=>{s.update(()=>i);if(n){this.setAttribute(t,i)}}})}_observableProxy(e){return new Proxy(e,{get:(t,s)=>{if(typeof t[s]==="function"){return t[s].bind(t)}else if(s in t){return t[s]}else if(typeof t.value[s]==="function"){return(...n)=>t.value[s](...n)}else{return t.value[s]}},set:(t,s,n)=>{t[s]=n;t.update(()=>t.value);return true}})}define(e){if(e.observables){e.observables.forEach(t=>{const s=this.observable(this[t],t);if(this._isObjectOrArray(s.value)){this._handleObjectOrArray(this,t,s)}else{this._handleNonObject(this,t,s)}})}if(e.computed){e.computed.forEach(t=>{if(typeof t==="string"){const s=Object.getOwnPropertyDescriptor(this,t);if(s&&typeof s.get==="function"){Object.defineProperty(this,t,{get:()=>this.computed(s.get).value})}}else if(typeof t==="object"&&typeof t.get==="function"){Object.defineProperty(this,t.name,{get:()=>this.computed(t.get).value})}})}if(e.effects){e.effects.forEach(t=>{this.effect(t)})}if(e.attributes){e.attributes.forEach(t=>{if(typeof t==="string"){const s=this.observableAttr(t);if(this._isObjectOrArray(s.value)){this._handleObjectOrArray(this,t,s,true)}else{this._handleNonObject(this,t,s,true)}}else if(typeof t==="object"&&t.name&&typeof t.parseFn==="function"){const s=this.observableAttr(t.name,t.parseFn);if(this._isObjectOrArray(s.value)){this._handleObjectOrArray(this,t.name,s,true)}else{this._handleNonObject(this,t.name,s,true)}}})}}observable(e,t=null){if(!this._isAllowedType(e)){const n=Object.prototype.toString.call(e);throw new Error(`[Cami.js] The type ${n} of initialValue is not allowed in observables.`)}const s=new g(e,n=>this.react.bind(this)(),{last:true,name:t});this.registerObservables(s);return s}query({queryKey:e,queryFn:t,staleTime:s=0,refetchOnWindowFocus:n=true,refetchOnMount:i=true,refetchOnReconnect:o=true,refetchInterval:c=null,gcTime:a=1e3*60*5,retry:l=3,retryDelay:f=u=>Math.pow(2,u)*1e3}){const u=this.observable({data:null,isLoading:true,error:null,lastUpdated:Y.has(e)?Y.get(e).lastUpdated:null},e.join(":"));const y=this._observableProxy(u);const d=(w=0)=>U(this,null,function*(){const je=Date.now();const ce=Y.get(e);if(ce&&je-ce.lastUpdated<s){u.update(x=>{x.data=ce.data;x.isLoading=false})}else{try{const x=yield t();Y.set(e,{data:x,lastUpdated:je});u.update(H=>{H.data=x;H.isLoading=false})}catch(x){if(w<l){setTimeout(()=>d(w+1),f(w))}else{u.update(H=>{H.error=x;H.isLoading=false})}}}});if(i){d()}if(n){const w=()=>d();window.addEventListener("focus",w);this._unsubscribers.set(`focus:${e.join(":")}`,()=>window.removeEventListener("focus",w))}if(o){window.addEventListener("online",d);this._unsubscribers.set(`online:${e.join(":")}`,()=>window.removeEventListener("online",d))}if(c){const w=setInterval(d,c);this._unsubscribers.set(`interval:${e.join(":")}`,()=>clearInterval(w))}const N=setTimeout(()=>{Y.delete(e)},a);this._unsubscribers.set(`gc:${e.join(":")}`,()=>clearTimeout(N));return y}_isAllowedType(e){const t=["number","string","boolean","object","undefined"];const s=typeof e;if(s==="object"){return e===null||Array.isArray(e)||this._isPlainObject(e)}return t.includes(s)}_isPlainObject(e){if(Object.prototype.toString.call(e)!=="[object Object]"){return false}const t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}observableAttr(e,t=s=>s){let s=this.getAttribute(e);s=T(s,t);return this.observable(s,e)}setObservables(e){Object.keys(e).forEach(t=>{if(this[t]instanceof m){this[t].next(e[t])}})}registerObservables(e){this._unsubscribers.set(e,()=>e.dispose())}computed(e){const t=super.computed(e);this.registerObservables(t);return t}effect(e){const t=super.effect(e);this._unsubscribers.set(e,t)}subscribe(e,t){const s=this.observable(e.state[t],t);const n=e.subscribe(i=>{s.update(()=>i[t])});this._unsubscribers.set(t,n);if(this._isObjectOrArray(s.value)){return this._observableProxy(s)}else{return new Proxy(s,{get:()=>s.value,set:(i,o,c)=>{if(o==="value"){s.update(()=>c)}else{i[o]=c}return true}})}}connectedCallback(){this.react()}disconnectedCallback(){this._unsubscribers.forEach(e=>e());this._effects.forEach(({cleanup:e})=>e&&e())}react(){if(!this._isWithinBatch){const e=this.template();Qe(e,this);this._effects.forEach(({effectFn:t})=>t.call(this))}}template(){throw new Error("[Cami.js] You have to implement the method template()!")}batch(e){this._isWithinBatch=true;Promise.resolve().then(e).finally(()=>{this._isWithinBatch=false})}};function jt(r,e){if(!customElements.get(r)){customElements.define(r,e)}}function Ct(r){return new Q(r)}var ie={events:false};function Tt(r){Object.assign(ie,r)}return pt(Nt);})();
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
//# sourceMappingURL=cami.cdn.js.map
