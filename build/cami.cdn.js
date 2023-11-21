var cami=(()=>{var K=Object.defineProperty;var lt=Object.getOwnPropertyDescriptor;var ht=Object.getOwnPropertyNames;var Te=Object.getOwnPropertySymbols;var Me=Object.prototype.hasOwnProperty;var ft=Object.prototype.propertyIsEnumerable;var Ne=(r,e)=>{if(e=Symbol[r])return e;throw Error("Symbol."+r+" is not defined")};var De=(r,e,t)=>e in r?K(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t;var ze=(r,e)=>{for(var t in e||(e={}))if(Me.call(e,t))De(r,t,e[t]);if(Te)for(var t of Te(e)){if(ft.call(e,t))De(r,t,e[t])}return r};var pt=(r,e)=>{for(var t in e)K(r,t,{get:e[t],enumerable:true})};var dt=(r,e,t,s)=>{if(e&&typeof e==="object"||typeof e==="function"){for(let n of ht(e))if(!Me.call(r,n)&&n!==t)K(r,n,{get:()=>e[n],enumerable:!(s=lt(e,n))||s.enumerable})}return r};var _t=r=>dt(K({},"__esModule",{value:true}),r);var z=(r,e,t)=>{return new Promise((s,n)=>{var i=c=>{try{a(t.next(c))}catch(l){n(l)}};var o=c=>{try{a(t.throw(c))}catch(l){n(l)}};var a=c=>c.done?s(c.value):Promise.resolve(c.value).then(i,o);a((t=t.apply(r,e)).next())})};var ue=(r,e,t)=>(e=r[Ne("asyncIterator")])?e.call(r):(r=r[Ne("iterator")](),e={},t=(s,n)=>(n=r[s])&&(e[s]=i=>new Promise((o,a,c)=>(i=n.call(r,i),c=i.done,Promise.resolve(i.value).then(l=>o({value:l,done:c}),a)))),t("next"),t("return"),e);var Dt={};pt(Dt,{Observable:()=>_,ObservableElement:()=>ae,ObservableState:()=>w,ObservableStore:()=>R,ObservableStream:()=>g,ReactiveElement:()=>je,camiConfig:()=>Z,config:()=>Nt,define:()=>Ct,html:()=>ke,http:()=>v,store:()=>Tt});var L=globalThis;var ee=L.trustedTypes;var Ie=ee?ee.createPolicy("lit-html",{createHTML:r=>r}):void 0;var Be="$lit$";var E=`lit$${(Math.random()+"").slice(9)}$`;var Ve="?"+E;var bt=`<${Ve}>`;var j=document;var B=()=>j.createComment("");var V=r=>null===r||"object"!=typeof r&&"function"!=typeof r;var Xe=Array.isArray;var mt=r=>Xe(r)||"function"==typeof(r==null?void 0:r[Symbol.iterator]);var le="[ 	\n\f\r]";var W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;var He=/-->/g;var Ue=/>/g;var P=RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g");var Fe=/'/g;var Re=/"/g;var Ge=/^(?:script|style|textarea|title)$/i;var Je=r=>(e,...t)=>({_$litType$:r,strings:e,values:t});var ke=Je(1);var zt=Je(2);var X=Symbol.for("lit-noChange");var f=Symbol.for("lit-nothing");var We=new WeakMap;var S=j.createTreeWalker(j,129);function Qe(r,e){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==Ie?Ie.createHTML(e):e}var yt=(r,e)=>{const t=r.length-1,s=[];let n,i=2===e?"<svg>":"",o=W;for(let a=0;a<t;a++){const c=r[a];let l,h,u=-1,p=0;for(;p<c.length&&(o.lastIndex=p,h=o.exec(c),null!==h);)p=o.lastIndex,o===W?"!--"===h[1]?o=He:void 0!==h[1]?o=Ue:void 0!==h[2]?(Ge.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=P):void 0!==h[3]&&(o=P):o===P?">"===h[0]?(o=n!=null?n:W,u=-1):void 0===h[1]?u=-2:(u=o.lastIndex-h[2].length,l=h[1],o=void 0===h[3]?P:'"'===h[3]?Re:Fe):o===Re||o===Fe?o=P:o===He||o===Ue?o=W:(o=P,n=void 0);const d=o===P&&r[a+1].startsWith("/>")?" ":"";i+=o===W?c+bt:u>=0?(s.push(l),c.slice(0,u)+Be+c.slice(u)+E+d):c+E+(-2===u?a:d)}return[Qe(r,i+(r[t]||"<?>")+(2===e?"</svg>":"")),s]};var G=class r{constructor({strings:e,_$litType$:t},s){let n;this.parts=[];let i=0,o=0;const a=e.length-1,c=this.parts,[l,h]=yt(e,t);if(this.el=r.createElement(l,s),S.currentNode=this.el.content,2===t){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;null!==(n=S.nextNode())&&c.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(Be)){const p=h[o++],d=n.getAttribute(u).split(E),M=/([.?@])?(.*)/.exec(p);c.push({type:1,index:i,name:M[2],strings:d,ctor:"."===M[1]?pe:"?"===M[1]?de:"@"===M[1]?_e:H}),n.removeAttribute(u)}else u.startsWith(E)&&(c.push({type:6,index:i}),n.removeAttribute(u));if(Ge.test(n.tagName)){const u=n.textContent.split(E),p=u.length-1;if(p>0){n.textContent=ee?ee.emptyScript:"";for(let d=0;d<p;d++)n.append(u[d],B()),S.nextNode(),c.push({type:2,index:++i});n.append(u[p],B())}}}else if(8===n.nodeType)if(n.data===Ve)c.push({type:2,index:i});else{let u=-1;for(;-1!==(u=n.data.indexOf(E,u+1));)c.push({type:7,index:i}),u+=E.length-1}i++}}static createElement(e,t){const s=j.createElement("template");return s.innerHTML=e,s}};function I(r,e,t=r,s){var o,a,c;if(e===X)return e;let n=void 0!==s?(o=t._$Co)==null?void 0:o[s]:t._$Cl;const i=V(e)?void 0:e._$litDirective$;return(n==null?void 0:n.constructor)!==i&&((a=n==null?void 0:n._$AO)==null?void 0:a.call(n,false),void 0===i?n=void 0:(n=new i(r),n._$AT(r,t,s)),void 0!==s?((c=t._$Co)!=null?c:t._$Co=[])[s]=n:t._$Cl=n),void 0!==n&&(e=I(r,n._$AS(r,e.values),n,s)),e}var fe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var l;const{el:{content:t},parts:s}=this._$AD,n=((l=e==null?void 0:e.creationScope)!=null?l:j).importNode(t,true);S.currentNode=n;let i=S.nextNode(),o=0,a=0,c=s[0];for(;void 0!==c;){if(o===c.index){let h;2===c.type?h=new J(i,i.nextSibling,this,e):1===c.type?h=new c.ctor(i,c.name,c.strings,this,e):6===c.type&&(h=new be(i,this,e)),this._$AV.push(h),c=s[++a]}o!==(c==null?void 0:c.index)&&(i=S.nextNode(),o++)}return S.currentNode=j,n}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}};var J=class r{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,s,n){var i;this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=n,this._$Cv=(i=n==null?void 0:n.isConnected)!=null?i:true}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===(e==null?void 0:e.nodeType)&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=I(this,e,t),V(e)?e===f||null==e||""===e?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==X&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):mt(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==f&&V(this._$AH)?this._$AA.nextSibling.data=e:this.$(j.createTextNode(e)),this._$AH=e}g(e){var i;const{values:t,_$litType$:s}=e,n="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=G.createElement(Qe(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===n)this._$AH.p(t);else{const o=new fe(n,this),a=o.u(this.options);o.p(t),this.$(a),this._$AH=o}}_$AC(e){let t=We.get(e.strings);return void 0===t&&We.set(e.strings,t=new G(e)),t}T(e){Xe(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,n=0;for(const i of e)n===t.length?t.push(s=new r(this.k(B()),this.k(B()),this,this.options)):s=t[n],s._$AI(i),n++;n<t.length&&(this._$AR(s&&s._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,false,true,t);e&&e!==this._$AB;){const n=e.nextSibling;e.remove(),e=n}}setConnected(e){var t;void 0===this._$AM&&(this._$Cv=e,(t=this._$AP)==null?void 0:t.call(this,e))}};var H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,n,i){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=f}_$AI(e,t=this,s,n){const i=this.strings;let o=false;if(void 0===i)e=I(this,e,t,0),o=!V(e)||e!==this._$AH&&e!==X,o&&(this._$AH=e);else{const a=e;let c,l;for(e=i[0],c=0;c<i.length-1;c++)l=I(this,a[s+c],t,c),l===X&&(l=this._$AH[c]),o||(o=!V(l)||l!==this._$AH[c]),l===f?e=f:e!==f&&(e+=(l!=null?l:"")+i[c+1]),this._$AH[c]=l}o&&!n&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}};var pe=class extends H{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}};var de=class extends H{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==f)}};var _e=class extends H{constructor(e,t,s,n,i){super(e,t,s,n,i),this.type=5}_$AI(e,t=this){var o;if((e=(o=I(this,e,t,0))!=null?o:f)===X)return;const s=this._$AH,n=e===f&&s!==f||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==f&&(s===f||n);n&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;"function"==typeof this._$AH?this._$AH.call((s=(t=this.options)==null?void 0:t.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}};var be=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){I(this,e)}};var he=L.litHtmlPolyfillSupport;var Le;he==null?void 0:he(G,J),((Le=L.litHtmlVersions)!=null?Le:L.litHtmlVersions=[]).push("3.0.0");var Ye=(r,e,t)=>{var i,o;const s=(i=t==null?void 0:t.renderBefore)!=null?i:e;let n=s._$litPart$;if(void 0===n){const a=(o=t==null?void 0:t.renderBefore)!=null?o:null;s._$litPart$=n=new J(e.insertBefore(B(),a),a,void 0,t!=null?t:{})}return n._$AI(r),n};var rt=Symbol.for("immer-nothing");var Ze=Symbol.for("immer-draftable");var m=Symbol.for("immer-state");var vt=true?[function(r){return`The plugin for '${r}' has not been loaded into Immer. To enable the plugin, import and call \`enable${r}()\` when initializing your application.`},function(r){return`produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${r}'`},"This object has been frozen and should not be mutated",function(r){return"Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+r},"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.","Immer forbids circular references","The first or second argument to `produce` must be a function","The third argument to `produce` must be a function or undefined","First argument to `createDraft` must be a plain object, an array, or an immerable object","First argument to `finishDraft` must be a draft returned by `createDraft`",function(r){return`'current' expects a draft, got: ${r}`},"Object.defineProperty() cannot be used on an Immer draft","Object.setPrototypeOf() cannot be used on an Immer draft","Immer only supports deleting array indices","Immer only supports setting array indices and the 'length' property",function(r){return`'original' expects a draft, got: ${r}`}]:[];function b(r,...e){if(true){const t=vt[r];const s=typeof t==="function"?t.apply(null,e):t;throw new Error(`[Immer] ${s}`)}throw new Error(`[Immer] minified error nr: ${r}. Full error at: https://bit.ly/3cXEKWf`)}var U=Object.getPrototypeOf;function F(r){return!!r&&!!r[m]}function T(r){var e;if(!r)return false;return st(r)||Array.isArray(r)||!!r[Ze]||!!((e=r.constructor)==null?void 0:e[Ze])||ne(r)||ie(r)}var wt=Object.prototype.constructor.toString();function st(r){if(!r||typeof r!=="object")return false;const e=U(r);if(e===null){return true}const t=Object.hasOwnProperty.call(e,"constructor")&&e.constructor;if(t===Object)return true;return typeof t=="function"&&Function.toString.call(t)===wt}function k(r,e){if(se(r)===0){Object.entries(r).forEach(([t,s])=>{e(t,s,r)})}else{r.forEach((t,s)=>e(s,t,r))}}function se(r){const e=r[m];return e?e.type_:Array.isArray(r)?1:ne(r)?2:ie(r)?3:0}function ve(r,e){return se(r)===2?r.has(e):Object.prototype.hasOwnProperty.call(r,e)}function nt(r,e,t){const s=se(r);if(s===2)r.set(e,t);else if(s===3){r.add(t)}else r[e]=t}function At(r,e){if(r===e){return r!==0||1/r===1/e}else{return r!==r&&e!==e}}function ne(r){return r instanceof Map}function ie(r){return r instanceof Set}function C(r){return r.copy_||r.base_}function we(r,e){if(ne(r)){return new Map(r)}if(ie(r)){return new Set(r)}if(Array.isArray(r))return Array.prototype.slice.call(r);if(!e&&st(r)){if(!U(r)){const n=Object.create(null);return Object.assign(n,r)}return ze({},r)}const t=Object.getOwnPropertyDescriptors(r);delete t[m];let s=Reflect.ownKeys(t);for(let n=0;n<s.length;n++){const i=s[n];const o=t[i];if(o.writable===false){o.writable=true;o.configurable=true}if(o.get||o.set)t[i]={configurable:true,writable:true,enumerable:o.enumerable,value:r[i]}}return Object.create(U(r),t)}function Ee(r,e=false){if(oe(r)||F(r)||!T(r))return r;if(se(r)>1){r.set=r.add=r.clear=r.delete=gt}Object.freeze(r);if(e)k(r,(t,s)=>Ee(s,true),true);return r}function gt(){b(2)}function oe(r){return Object.isFrozen(r)}var $t={};function N(r){const e=$t[r];if(!e){b(0,r)}return e}var Q;function it(){return Q}function xt(r,e){return{drafts_:[],parent_:r,immer_:e,canAutoFreeze_:true,unfinalizedDrafts_:0}}function qe(r,e){if(e){N("Patches");r.patches_=[];r.inversePatches_=[];r.patchListener_=e}}function Ae(r){ge(r);r.drafts_.forEach(Et);r.drafts_=null}function ge(r){if(r===Q){Q=r.parent_}}function Ke(r){return Q=xt(Q,r)}function Et(r){const e=r[m];if(e.type_===0||e.type_===1)e.revoke_();else e.revoked_=true}function et(r,e){e.unfinalizedDrafts_=e.drafts_.length;const t=e.drafts_[0];const s=r!==void 0&&r!==t;if(s){if(t[m].modified_){Ae(e);b(4)}if(T(r)){r=te(e,r);if(!e.parent_)re(e,r)}if(e.patches_){N("Patches").generateReplacementPatches_(t[m].base_,r,e.patches_,e.inversePatches_)}}else{r=te(e,t,[])}Ae(e);if(e.patches_){e.patchListener_(e.patches_,e.inversePatches_)}return r!==rt?r:void 0}function te(r,e,t){if(oe(e))return e;const s=e[m];if(!s){k(e,(n,i)=>tt(r,s,e,n,i,t),true);return e}if(s.scope_!==r)return e;if(!s.modified_){re(r,s.base_,true);return s.base_}if(!s.finalized_){s.finalized_=true;s.scope_.unfinalizedDrafts_--;const n=s.copy_;let i=n;let o=false;if(s.type_===3){i=new Set(n);n.clear();o=true}k(i,(a,c)=>tt(r,s,n,a,c,t,o));re(r,n,false);if(t&&r.patches_){N("Patches").generatePatches_(s,t,r.patches_,r.inversePatches_)}}return s.copy_}function tt(r,e,t,s,n,i,o){if(n===t)b(5);if(F(n)){const a=i&&e&&e.type_!==3&&!ve(e.assigned_,s)?i.concat(s):void 0;const c=te(r,n,a);nt(t,s,c);if(F(c)){r.canAutoFreeze_=false}else return}else if(o){t.add(n)}if(T(n)&&!oe(n)){if(!r.immer_.autoFreeze_&&r.unfinalizedDrafts_<1){return}te(r,n);if(!e||!e.scope_.parent_)re(r,n)}}function re(r,e,t=false){if(!r.parent_&&r.immer_.autoFreeze_&&r.canAutoFreeze_){Ee(e,t)}}function Ot(r,e){const t=Array.isArray(r);const s={type_:t?1:0,scope_:e?e.scope_:it(),modified_:false,finalized_:false,assigned_:{},parent_:e,base_:r,draft_:null,copy_:null,revoke_:null,isManual_:false};let n=s;let i=Oe;if(t){n=[s];i=Y}const{revoke:o,proxy:a}=Proxy.revocable(n,i);s.draft_=a;s.revoke_=o;return a}var Oe={get(r,e){if(e===m)return r;const t=C(r);if(!ve(t,e)){return Pt(r,t,e)}const s=t[e];if(r.finalized_||!T(s)){return s}if(s===me(r.base_,e)){ye(r);return r.copy_[e]=xe(s,r)}return s},has(r,e){return e in C(r)},ownKeys(r){return Reflect.ownKeys(C(r))},set(r,e,t){const s=ot(C(r),e);if(s==null?void 0:s.set){s.set.call(r.draft_,t);return true}if(!r.modified_){const n=me(C(r),e);const i=n==null?void 0:n[m];if(i&&i.base_===t){r.copy_[e]=t;r.assigned_[e]=false;return true}if(At(t,n)&&(t!==void 0||ve(r.base_,e)))return true;ye(r);$e(r)}if(r.copy_[e]===t&&(t!==void 0||e in r.copy_)||Number.isNaN(t)&&Number.isNaN(r.copy_[e]))return true;r.copy_[e]=t;r.assigned_[e]=true;return true},deleteProperty(r,e){if(me(r.base_,e)!==void 0||e in r.base_){r.assigned_[e]=false;ye(r);$e(r)}else{delete r.assigned_[e]}if(r.copy_){delete r.copy_[e]}return true},getOwnPropertyDescriptor(r,e){const t=C(r);const s=Reflect.getOwnPropertyDescriptor(t,e);if(!s)return s;return{writable:true,configurable:r.type_!==1||e!=="length",enumerable:s.enumerable,value:t[e]}},defineProperty(){b(11)},getPrototypeOf(r){return U(r.base_)},setPrototypeOf(){b(12)}};var Y={};k(Oe,(r,e)=>{Y[r]=function(){arguments[0]=arguments[0][0];return e.apply(this,arguments)}});Y.deleteProperty=function(r,e){if(isNaN(parseInt(e)))b(13);return Y.set.call(this,r,e,void 0)};Y.set=function(r,e,t){if(e!=="length"&&isNaN(parseInt(e)))b(14);return Oe.set.call(this,r[0],e,t,r[0])};function me(r,e){const t=r[m];const s=t?C(t):r;return s[e]}function Pt(r,e,t){var n;const s=ot(e,t);return s?`value`in s?s.value:(n=s.get)==null?void 0:n.call(r.draft_):void 0}function ot(r,e){if(!(e in r))return void 0;let t=U(r);while(t){const s=Object.getOwnPropertyDescriptor(t,e);if(s)return s;t=U(t)}return void 0}function $e(r){if(!r.modified_){r.modified_=true;if(r.parent_){$e(r.parent_)}}}function ye(r){if(!r.copy_){r.copy_=we(r.base_,r.scope_.immer_.useStrictShallowCopy_)}}var St=class{constructor(r){this.autoFreeze_=true;this.useStrictShallowCopy_=false;this.produce=(e,t,s)=>{if(typeof e==="function"&&typeof t!=="function"){const i=t;t=e;const o=this;return function a(c=i,...l){return o.produce(c,h=>t.call(this,h,...l))}}if(typeof t!=="function")b(6);if(s!==void 0&&typeof s!=="function")b(7);let n;if(T(e)){const i=Ke(this);const o=xe(e,void 0);let a=true;try{n=t(o);a=false}finally{if(a)Ae(i);else ge(i)}qe(i,s);return et(n,i)}else if(!e||typeof e!=="object"){n=t(e);if(n===void 0)n=e;if(n===rt)n=void 0;if(this.autoFreeze_)Ee(n,true);if(s){const i=[];const o=[];N("Patches").generateReplacementPatches_(e,n,i,o);s(i,o)}return n}else b(1,e)};this.produceWithPatches=(e,t)=>{if(typeof e==="function"){return(o,...a)=>this.produceWithPatches(o,c=>e(c,...a))}let s,n;const i=this.produce(e,t,(o,a)=>{s=o;n=a});return[i,s,n]};if(typeof(r==null?void 0:r.autoFreeze)==="boolean")this.setAutoFreeze(r.autoFreeze);if(typeof(r==null?void 0:r.useStrictShallowCopy)==="boolean")this.setUseStrictShallowCopy(r.useStrictShallowCopy)}createDraft(r){if(!T(r))b(8);if(F(r))r=jt(r);const e=Ke(this);const t=xe(r,void 0);t[m].isManual_=true;ge(e);return t}finishDraft(r,e){const t=r&&r[m];if(!t||!t.isManual_)b(9);const{scope_:s}=t;qe(s,e);return et(void 0,s)}setAutoFreeze(r){this.autoFreeze_=r}setUseStrictShallowCopy(r){this.useStrictShallowCopy_=r}applyPatches(r,e){let t;for(t=e.length-1;t>=0;t--){const n=e[t];if(n.path.length===0&&n.op==="replace"){r=n.value;break}}if(t>-1){e=e.slice(t+1)}const s=N("Patches").applyPatches_;if(F(r)){return s(r,e)}return this.produce(r,n=>s(n,e))}};function xe(r,e){const t=ne(r)?N("MapSet").proxyMap_(r,e):ie(r)?N("MapSet").proxySet_(r,e):Ot(r,e);const s=e?e.scope_:it();s.drafts_.push(t);return t}function jt(r){if(!F(r))b(10,r);return at(r)}function at(r){if(!T(r)||oe(r))return r;const e=r[m];let t;if(e){if(!e.modified_)return e.base_;e.finalized_=true;t=we(r,e.scope_.immer_.useStrictShallowCopy_)}else{t=we(r,true)}k(t,(s,n)=>{nt(t,s,at(n))});if(e){e.finalized_=false}return t}var y=new St;var D=y.produce;var Ht=y.produceWithPatches.bind(y);var Ut=y.setAutoFreeze.bind(y);var Ft=y.setUseStrictShallowCopy.bind(y);var Rt=y.applyPatches.bind(y);var Wt=y.createDraft.bind(y);var Lt=y.finishDraft.bind(y);var Pe=class{constructor(e){if(typeof e==="function"){this.observer={next:e}}else{this.observer=e}this.teardowns=[];if(typeof AbortController!=="undefined"){this.controller=new AbortController;this.signal=this.controller.signal}this.isUnsubscribed=false}next(e){if(!this.isUnsubscribed&&this.observer.next){this.observer.next(e)}}complete(){if(!this.isUnsubscribed){if(this.observer.complete){this.observer.complete()}this.unsubscribe()}}error(e){if(!this.isUnsubscribed){if(this.observer.error){this.observer.error(e)}this.unsubscribe()}}addTeardown(e){this.teardowns.push(e)}unsubscribe(){if(!this.isUnsubscribed){this.isUnsubscribed=true;if(this.controller){this.controller.abort()}this.teardowns.forEach(e=>{if(typeof e!=="function"){throw new Error("[Cami.js] Teardown must be a function. Please implement a teardown function in your subscriber.")}e()})}}};var _=class{constructor(e=()=>()=>{}){this._observers=[];this.subscribeCallback=e}subscribe(e=()=>{},t=()=>{},s=()=>{}){let n;if(typeof e==="function"){n={next:e,error:t,complete:s}}else if(typeof e==="object"){n=e}else{throw new Error("[Cami.js] First argument to subscribe must be a next callback or an observer object")}const i=new Pe(n);let o=()=>{};try{o=this.subscribeCallback(i)}catch(a){if(i.error){i.error(a)}else{console.error("[Cami.js] Error in Subscriber:",a)}return}i.addTeardown(o);this._observers.push(i);return{unsubscribe:()=>i.unsubscribe(),complete:()=>i.complete(),error:a=>i.error(a)}}onValue(e){return this.subscribe({next:e})}onError(e){return this.subscribe({error:e})}onEnd(e){return this.subscribe({complete:e})}[Symbol.asyncIterator](){let e;let t;let s=new Promise(n=>t=n);e={next:n=>{t({value:n,done:false});s=new Promise(i=>t=i)},complete:()=>{t({done:true})},error:n=>{throw n}};this.subscribe(e);return{next:()=>s}}};var R=class extends _{constructor(e){if(typeof e!=="object"||e===null){throw new TypeError("[Cami.js] initialState must be an object")}super(t=>{this._subscriber=t;return()=>{this._subscriber=null}});this.state=new Proxy(e,{get:(t,s)=>{return t[s]},set:(t,s,n)=>{t[s]=n;this._observers.forEach(i=>i.next(this.state));if(this.devTools){this.devTools.send(s,this.state)}return true}});this.reducers={};this.middlewares=[];this.devTools=this.connectToDevTools();Object.keys(e).forEach(t=>{if(typeof e[t]==="function"){this.register(t,e[t])}else{this.state[t]=e[t]}})}_applyMiddleware(e,...t){const s={state:this.state,action:e,payload:t};for(const n of this.middlewares){n(s)}}connectToDevTools(){if(typeof window!=="undefined"&&window["__REDUX_DEVTOOLS_EXTENSION__"]){const e=window["__REDUX_DEVTOOLS_EXTENSION__"].connect();e.init(this.state);return e}return null}use(e){this.middlewares.push(e)}register(e,t){if(this.reducers[e]){throw new Error(`[Cami.js] Action type ${e} is already registered.`)}this.reducers[e]=t;this[e]=(...s)=>{this.dispatch(e,...s)}}dispatch(e,t){if(typeof e==="function"){return e(this.dispatch.bind(this),()=>this.state)}if(typeof e!=="string"){throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof e}`)}const s=this.reducers[e];if(!s){console.warn(`No reducer found for action ${e}`);return}this._applyMiddleware(e,t);this.state=D(this.state,n=>{s(n,t)});this._observers.forEach(n=>n.next(this.state));if(this.devTools){this.devTools.send(e,this.state)}}};var g=class r extends _{static from(e){if(e instanceof _){return new r(t=>{const s=e.subscribe({next:n=>t.next(n),error:n=>t.error(n),complete:()=>t.complete()});return()=>{if(!s.closed){s.unsubscribe()}}})}else if(e[Symbol.asyncIterator]){return new r(t=>{let s=false;(()=>z(this,null,function*(){try{try{for(var n=ue(e),i,o,a;i=!(o=yield n.next()).done;i=false){const c=o.value;if(s)return;t.next(c)}}catch(o){a=[o]}finally{try{i&&(o=n.return)&&(yield o.call(n))}finally{if(a)throw a[0]}}t.complete()}catch(c){t.error(c)}}))();return()=>{s=true}})}else if(e[Symbol.iterator]){return new r(t=>{try{for(const s of e){t.next(s)}t.complete()}catch(s){t.error(s)}return()=>{if(!subscription.closed){subscription.unsubscribe()}}})}else if(e instanceof Promise){return new r(t=>{e.then(s=>{t.next(s);t.complete()},s=>t.error(s));return()=>{}})}else{throw new TypeError("[Cami.js] ObservableStream.from requires an Observable, AsyncIterable, Iterable, or Promise")}}map(e){return new r(t=>{const s=this.subscribe({next:n=>t.next(e(n)),error:n=>t.error(n),complete:()=>t.complete()});return()=>s.unsubscribe()})}filter(e){return new r(t=>{const s=this.subscribe({next:n=>{if(e(n)){t.next(n)}},error:n=>t.error(n),complete:()=>t.complete()});return()=>s.unsubscribe()})}reduce(e,t){return new Promise((s,n)=>{let i=t;const o=this.subscribe({next:a=>{i=e(i,a)},error:a=>n(a),complete:()=>s(i)});return()=>o.unsubscribe()})}takeUntil(e){return new r(t=>{const s=this.subscribe({next:i=>t.next(i),error:i=>t.error(i),complete:()=>t.complete()});const n=e.subscribe({next:()=>{t.complete();s.unsubscribe();n.unsubscribe()},error:i=>t.error(i)});return()=>{s.unsubscribe();n.unsubscribe()}})}take(e){return new r(t=>{let s=0;const n=this.subscribe({next:i=>{if(s++<e){t.next(i)}else{t.complete();n.unsubscribe()}},error:i=>t.error(i),complete:()=>t.complete()});return()=>n.unsubscribe()})}drop(e){return new r(t=>{let s=0;const n=this.subscribe({next:i=>{if(s++>=e){t.next(i)}},error:i=>t.error(i),complete:()=>t.complete()});return()=>n.unsubscribe()})}flatMap(e){return new r(t=>{const s=new Set;const n=this.subscribe({next:i=>{const o=e(i);const a=o.subscribe({next:c=>t.next(c),error:c=>t.error(c),complete:()=>{s.delete(a);if(s.size===0){t.complete()}}});s.add(a)},error:i=>t.error(i),complete:()=>{if(s.size===0){t.complete()}}});return()=>{n.unsubscribe();s.forEach(i=>i.unsubscribe())}})}switchMap(e){return new r(t=>{let s=null;const n=this.subscribe({next:i=>{if(s){s.unsubscribe()}const o=e(i);s=o.subscribe({next:a=>t.next(a),error:a=>t.error(a),complete:()=>{if(s){s.unsubscribe();s=null}}})},error:i=>t.error(i),complete:()=>{if(s){s.unsubscribe()}t.complete()}});return()=>{n.unsubscribe();if(s){s.unsubscribe()}}})}toArray(){return new Promise((e,t)=>{const s=[];this.subscribe({next:n=>s.push(n),error:n=>t(n),complete:()=>e(s)})})}forEach(e){return new Promise((t,s)=>{this.subscribe({next:n=>e(n),error:n=>s(n),complete:()=>t()})})}every(e){return new Promise((t,s)=>{let n=true;this.subscribe({next:i=>{if(!e(i)){n=false;t(false)}},error:i=>s(i),complete:()=>t(n)})})}find(e){return new Promise((t,s)=>{const n=this.subscribe({next:i=>{if(e(i)){t(i);n.unsubscribe()}},error:i=>s(i),complete:()=>t(void 0)})})}some(e){return new Promise((t,s)=>{const n=this.subscribe({next:i=>{if(e(i)){t(true);n.unsubscribe()}},error:i=>s(i),complete:()=>t(false)})})}finally(e){return new r(t=>{const s=this.subscribe({next:n=>t.next(n),error:n=>{e();t.error(n)},complete:()=>{e();t.complete()}});return()=>{s.unsubscribe()}})}toState(e=null){const t=new w(e);this.subscribe({next:s=>t.update(()=>s),error:s=>t.error(s),complete:()=>t.complete()});return t}push(e){if(e instanceof _){const t=e.subscribe({next:s=>this._observers.forEach(n=>n.next(s)),error:s=>this._observers.forEach(n=>n.error(s)),complete:()=>this._observers.forEach(s=>s.complete())})}else if(e[Symbol.asyncIterator]){(()=>z(this,null,function*(){try{try{for(var t=ue(e),s,n,i;s=!(n=yield t.next()).done;s=false){const o=n.value;this._observers.forEach(a=>a.next(o))}}catch(n){i=[n]}finally{try{s&&(n=t.return)&&(yield n.call(t))}finally{if(i)throw i[0]}}this._observers.forEach(o=>o.complete())}catch(o){this._observers.forEach(a=>a.error(o))}}))()}else if(e[Symbol.iterator]){try{for(const t of e){this._observers.forEach(s=>s.next(t))}this._observers.forEach(t=>t.complete())}catch(t){this._observers.forEach(s=>s.error(t))}}else if(e instanceof Promise){e.then(t=>{this._observers.forEach(s=>s.next(t));this._observers.forEach(s=>s.complete())},t=>this._observers.forEach(s=>s.error(t)))}else{this._observers.forEach(t=>t.next(e))}}plug(e){e.subscribe({next:t=>this.push(t),error:t=>this._observers.forEach(s=>s.error(t)),complete:()=>this._observers.forEach(t=>t.complete())})}end(){this._observers.forEach(e=>{if(e&&typeof e.complete==="function"){e.complete()}})}};var Z={events:true};var O={current:null};var w=class extends _{constructor(e=null,t=null,{last:s=false,name:n=null}={}){super();if(s){this._lastObserver=t}else{this._observers.push(t)}this._value=D(e,i=>{});this._pendingUpdates=[];this._updateScheduled=false;this._name=n}get value(){if(O.current!=null){O.current.addDependency(this)}return this._value}set value(e){this.update(()=>e)}assign(e){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(t=>Object.assign(t,e))}set(e,t){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(s=>{s[e]=t})}delete(e){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(t=>{delete t[e]})}clear(){this.update(()=>({}))}push(...e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(t=>{t.push(...e)})}pop(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.pop()})}shift(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.shift()})}splice(e,t,...s){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.splice(e,t,...s)})}unshift(...e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(t=>{t.unshift(...e)})}reverse(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.reverse()})}sort(e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(t=>{t.sort(e)})}fill(e,t=0,s=this._value.length){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.fill(e,t,s)})}copyWithin(e,t,s=this._value.length){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.copyWithin(e,t,s)})}update(e){this._pendingUpdates.push(e);if(!this._updateScheduled){this._updateScheduled=true;if(typeof window!=="undefined"){requestAnimationFrame(this._applyUpdates.bind(this))}else{this._applyUpdates()}}}notifyObservers(){const e=[...this._observers,this._lastObserver];e.forEach(t=>{if(t&&typeof t==="function"){t(this._value)}else if(t&&t.next){t.next(this._value)}})}_applyUpdates(){let e=this._value;while(this._pendingUpdates.length>0){const t=this._pendingUpdates.shift();this._value=D(this._value,t)}if(e!==this._value){this.notifyObservers();if(Z.events&&typeof window!=="undefined"){const t=new CustomEvent("cami:state:change",{detail:{name:this._name,oldValue:e,newValue:this._value}});window.dispatchEvent(t)}}this._updateScheduled=false}toStream(){const e=new g;this.subscribe({next:t=>e.emit(t),error:t=>e.error(t),complete:()=>e.end()});return e}complete(){this._observers.forEach(e=>{if(e&&typeof e.complete==="function"){e.complete()}})}};var Se=class extends w{constructor(e){super(null);this.computeFn=e;this.dependencies=new Set;this.subscriptions=new Map;this.compute()}get value(){if(O.current){O.current.addDependency(this)}return this._value}compute(){const e={addDependency:s=>{if(!this.dependencies.has(s)){const n=s.onValue(()=>this.compute());this.dependencies.add(s);this.subscriptions.set(s,n)}}};O.current=e;const t=this.computeFn();O.current=null;if(t!==this._value){this._value=t;this.notifyObservers()}}dispose(){this.subscriptions.forEach(e=>{e.unsubscribe()})}};var ct=function(r){return new Se(r)};var ut=function(r){let e=()=>{};let t=new Set;let s=new Map;const n={addDependency:a=>{if(!t.has(a)){const c=a.onValue(i);t.add(a);s.set(a,c)}}};const i=()=>{e();O.current=n;e=r()||(()=>{});O.current=null};if(typeof window!=="undefined"){requestAnimationFrame(i)}else{setTimeout(i,0)}const o=()=>{s.forEach(a=>{a.unsubscribe()});e()};return o};var ae=class extends g{constructor(e){super();if(typeof e==="string"){this.element=document.querySelector(e);if(!this.element){throw new Error(`[Cami.js] Element not found for selector: ${e}`)}}else if(e instanceof Element||e instanceof Document){this.element=e}else{throw new Error(`[Cami.js] Invalid argument: ${e}`)}}on(e,t={}){return new g(s=>{const n=i=>{s.next(i)};this.element.addEventListener(e,n,t);return()=>{this.element.removeEventListener(e,n,t)}})}};var v=r=>{if(typeof r==="string"){return v.get(r)}return new Promise((e,t)=>{const s=new XMLHttpRequest;s.open(r.method||"GET",r.url);if(r.headers){Object.keys(r.headers).forEach(n=>{s.setRequestHeader(n,r.headers[n])})}s.onload=()=>{let n=s.responseText;const i=r.transformResponse||(o=>{try{return JSON.parse(o)}catch(a){return o}});n=i(n);e(n)};s.onerror=()=>t(s.statusText);s.send(r.data?JSON.stringify(r.data):null)})};v.get=(r,e={})=>{e.url=r;e.method="GET";return v(e)};v.post=(r,e={},t={})=>{t.url=r;t.data=e;t.method="POST";return v(t)};v.put=(r,e={},t={})=>{t.url=r;t.data=e;t.method="PUT";return v(t)};v.patch=(r,e={},t={})=>{t.url=r;t.data=e;t.method="PATCH";return v(t)};v.delete=(r,e={})=>{e.url=r;e.method="DELETE";return v(e)};var q=new Map;var je=class extends HTMLElement{constructor(){super();this._unsubscribers=new Map;this._effects=[];this._isWithinBatch=false;this.computed=ct.bind(this);this.effect=ut.bind(this)}_isObjectOrArray(e){return e!==null&&(typeof e==="object"||Array.isArray(e))}_handleObjectOrArray(e,t,s,n=false){if(!(s instanceof w)){throw new TypeError("Expected observable to be an instance of ObservableState")}const i=this._observableProxy(s);Object.defineProperty(e,t,{get:()=>i,set:o=>{s.update(()=>o);if(n){this.setAttribute(t,o)}}})}_handleNonObject(e,t,s,n=false){if(!(s instanceof w)){throw new TypeError("Expected observable to be an instance of ObservableState")}Object.defineProperty(e,t,{get:()=>s.value,set:i=>{s.update(()=>i);if(n){this.setAttribute(t,i)}}})}_observableProxy(e){if(!(e instanceof w)){throw new TypeError("Expected observable to be an instance of ObservableState")}return new Proxy(e,{get:(t,s)=>{if(typeof t[s]==="function"){return t[s].bind(t)}else if(s in t){return t[s]}else if(typeof t.value[s]==="function"){return(...n)=>t.value[s](...n)}else{return t.value[s]}},set:(t,s,n)=>{t[s]=n;t.update(()=>t.value);return true}})}setup(e){if(e.infer===true){e.infer=["observables","computed"]}if(e.infer){e.infer.forEach(t=>{if(t==="observables"){Object.keys(this).forEach(s=>{if(typeof this[s]!=="function"&&!s.startsWith("_")){if(this[s]instanceof _){return}else{const n=this.observable(this[s],s);if(this._isObjectOrArray(n.value)){this._handleObjectOrArray(this,s,n)}else{this._handleNonObject(this,s,n)}}}})}else if(t==="computed"){Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(s=>{const n=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this),s);return n&&typeof n.get==="function"}).forEach(s=>{const n=Object.getOwnPropertyDescriptor(this,s);if(n&&typeof n.get==="function"){Object.defineProperty(this,s,{get:()=>this.computed(n.get).value})}})}})}if(e.observables){e.observables.forEach(t=>{if(this[t]instanceof _){return}const s=this.observable(this[t],t);if(this._isObjectOrArray(s.value)){this._handleObjectOrArray(this,t,s)}else{this._handleNonObject(this,t,s)}})}if(e.computed){e.computed.forEach(t=>{if(typeof t==="string"){const s=Object.getOwnPropertyDescriptor(this,t);if(s&&typeof s.get==="function"){Object.defineProperty(this,t,{get:()=>this.computed(s.get).value})}}else if(typeof t==="object"&&typeof t.get==="function"){Object.defineProperty(this,t.name,{get:()=>this.computed(t.get).value})}})}if(e.effects){e.effects.forEach(t=>{this.effect(t)})}if(e.attributes){Object.entries(e.attributes).forEach(([t,s])=>{const n=typeof s==="function"?this.observableAttr(t,s):this.observableAttr(t);if(this._isObjectOrArray(n.value)){this._handleObjectOrArray(this,t,n,true)}else{this._handleNonObject(this,t,n,true)}})}}observable(e,t=null){if(!this._isAllowedType(e)){const n=Object.prototype.toString.call(e);throw new Error(`[Cami.js] The type ${n} of initialValue is not allowed in observables.`)}const s=new w(e,n=>this.react.bind(this)(),{last:true,name:t});this.registerObservables(s);return s}query({queryKey:e,queryFn:t,staleTime:s=0,refetchOnWindowFocus:n=true,refetchOnMount:i=true,refetchOnReconnect:o=true,refetchInterval:a=null,gcTime:c=1e3*60*5,retry:l=3,retryDelay:h=u=>Math.pow(2,u)*1e3}){const u=this.observable({data:null,status:"pending",fetchStatus:"idle",error:null,lastUpdated:q.has(e)?q.get(e).lastUpdated:null},e.join(":"));const p=this._observableProxy(u);const d=($=0)=>z(this,null,function*(){const Ce=Date.now();const ce=q.get(e);if(ce&&Ce-ce.lastUpdated<s){u.update(x=>{x.data=ce.data;x.status="success";x.fetchStatus="idle"})}else{try{u.update(A=>{A.status="pending";A.fetchStatus="fetching"});const x=yield t();q.set(e,{data:x,lastUpdated:Ce});u.update(A=>{A.data=x;A.status="success";A.fetchStatus="idle"})}catch(x){if($<l){setTimeout(()=>d($+1),h($))}else{u.update(A=>{A.error={message:x.message};A.status="error";A.fetchStatus="idle"})}}}});if(i){d()}if(n){const $=()=>d();window.addEventListener("focus",$);this._unsubscribers.set(`focus:${e.join(":")}`,()=>window.removeEventListener("focus",$))}if(o){window.addEventListener("online",d);this._unsubscribers.set(`online:${e.join(":")}`,()=>window.removeEventListener("online",d))}if(a){const $=setInterval(d,a);this._unsubscribers.set(`interval:${e.join(":")}`,()=>clearInterval($))}const M=setTimeout(()=>{q.delete(e)},c);this._unsubscribers.set(`gc:${e.join(":")}`,()=>clearTimeout(M));return p}mutation({mutationFn:e,onMutate:t,onError:s,onSuccess:n,onSettled:i}){const o=this.observable({data:null,status:"idle",error:null});const a=this._observableProxy(o);const c=l=>z(this,null,function*(){let h;if(t){h=t(l)}o.update(u=>{u.status="pending";u.error=null});try{const u=yield e(l);o.update(p=>{p.data=u;p.status="success"});if(n){n(u,l,h)}}catch(u){o.update(p=>{p.error={message:u.message};p.status="error"});if(s){s(u,l,h)}}finally{if(i){i(o.get().data,o.get().error,l,h)}}});a.mutate=c;return a}_isAllowedType(e){const t=["number","string","boolean","object","undefined"];const s=typeof e;if(s==="object"){return e===null||Array.isArray(e)||this._isPlainObject(e)}return t.includes(s)}_isPlainObject(e){if(Object.prototype.toString.call(e)!=="[object Object]"){return false}const t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}observableAttr(e,t=s=>s){let s=this.getAttribute(e);s=D(s,t);return this.observable(s,e)}setObservables(e){Object.keys(e).forEach(t=>{if(this[t]instanceof _){this[t].next(e[t])}})}registerObservables(e){if(!(e instanceof w)){throw new TypeError("Expected observableState to be an instance of ObservableState")}this._unsubscribers.set(e,()=>e.dispose())}computed(e){const t=super.computed(e);this.registerObservables(t);return t}effect(e){const t=super.effect(e);this._unsubscribers.set(e,t)}connect(e,t){if(!(e instanceof R)){throw new TypeError("Expected store to be an instance of ObservableStore")}const s=this.observable(e.state[t],t);const n=e.subscribe(i=>{s.update(()=>i[t])});this._unsubscribers.set(t,n);if(this._isObjectOrArray(s.value)){return this._observableProxy(s)}else{return new Proxy(s,{get:()=>s.value,set:(i,o,a)=>{if(o==="value"){s.update(()=>a)}else{i[o]=a}return true}})}}connectedCallback(){this.react()}disconnectedCallback(){this._unsubscribers.forEach(e=>e());this._effects.forEach(({cleanup:e})=>e&&e())}react(){if(!this._isWithinBatch){const e=this.template();Ye(e,this);this._effects.forEach(({effectFn:t})=>t.call(this))}}template(){throw new Error("[Cami.js] You have to implement the method template()!")}batch(e){this._isWithinBatch=true;Promise.resolve().then(e).finally(()=>{this._isWithinBatch=false})}};function Ct(r,e){if(!customElements.get(r)){customElements.define(r,e)}}function Tt(r){return new R(r)}function Nt(r){Object.assign(Z,r)}return _t(Dt);})();
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
