var cami=(()=>{var Y=Object.defineProperty;var ht=Object.getOwnPropertyDescriptor;var ft=Object.getOwnPropertyNames;var Oe=Object.getOwnPropertySymbols;var ze=Object.prototype.hasOwnProperty;var pt=Object.prototype.propertyIsEnumerable;var Ne=(t,e)=>{if(e=Symbol[t])return e;throw Error("Symbol."+t+" is not defined")};var De=(t,e,r)=>e in t?Y(t,e,{enumerable:true,configurable:true,writable:true,value:r}):t[e]=r;var Me=(t,e)=>{for(var r in e||(e={}))if(ze.call(e,r))De(t,r,e[r]);if(Oe)for(var r of Oe(e)){if(pt.call(e,r))De(t,r,e[r])}return t};var dt=(t,e)=>{for(var r in e)Y(t,r,{get:e[r],enumerable:true})};var _t=(t,e,r,s)=>{if(e&&typeof e==="object"||typeof e==="function"){for(let n of ft(e))if(!ze.call(t,n)&&n!==r)Y(t,n,{get:()=>e[n],enumerable:!(s=ht(e,n))||s.enumerable})}return t};var mt=t=>_t(Y({},"__esModule",{value:true}),t);var U=(t,e,r)=>{return new Promise((s,n)=>{var i=c=>{try{a(r.next(c))}catch(u){n(u)}};var o=c=>{try{a(r.throw(c))}catch(u){n(u)}};var a=c=>c.done?s(c.value):Promise.resolve(c.value).then(i,o);a((r=r.apply(t,e)).next())})};var Te=(t,e,r)=>(e=t[Ne("asyncIterator")])?e.call(t):(t=t[Ne("iterator")](),e={},r=(s,n)=>(n=t[s])&&(e[s]=i=>new Promise((o,a,c)=>(i=n.call(t,i),c=i.done,Promise.resolve(i.value).then(u=>o({value:u,done:c}),a)))),r("next"),r("return"),e);var zt={};dt(zt,{Observable:()=>g,ObservableElement:()=>ce,ObservableState:()=>I,ObservableStream:()=>O,ReactiveElement:()=>Pe,define:()=>Dt,html:()=>qe,store:()=>ct});var R=globalThis;var Z=R.trustedTypes;var Ie=Z?Z.createPolicy("lit-html",{createHTML:t=>t}):void 0;var We="$lit$";var A=`lit$${(Math.random()+"").slice(9)}$`;var Be="?"+A;var yt=`<${Be}>`;var x=document;var W=()=>x.createComment("");var B=t=>null===t||"object"!=typeof t&&"function"!=typeof t;var Ve=Array.isArray;var bt=t=>Ve(t)||"function"==typeof(t==null?void 0:t[Symbol.iterator]);var le="[ 	\n\f\r]";var k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;var He=/-->/g;var Fe=/>/g;var w=RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g");var je=/'/g;var Ue=/"/g;var Le=/^(?:script|style|textarea|title)$/i;var Xe=t=>(e,...r)=>({_$litType$:t,strings:e,values:r});var qe=Xe(1);var Tt=Xe(2);var V=Symbol.for("lit-noChange");var p=Symbol.for("lit-nothing");var ke=new WeakMap;var $=x.createTreeWalker(x,129);function Qe(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==Ie?Ie.createHTML(e):e}var vt=(t,e)=>{const r=t.length-1,s=[];let n,i=2===e?"<svg>":"",o=k;for(let a=0;a<r;a++){const c=t[a];let u,h,l=-1,y=0;for(;y<c.length&&(o.lastIndex=y,h=o.exec(c),null!==h);)y=o.lastIndex,o===k?"!--"===h[1]?o=He:void 0!==h[1]?o=Fe:void 0!==h[2]?(Le.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=w):void 0!==h[3]&&(o=w):o===w?">"===h[0]?(o=n!=null?n:k,l=-1):void 0===h[1]?l=-2:(l=o.lastIndex-h[2].length,u=h[1],o=void 0===h[3]?w:'"'===h[3]?Ue:je):o===Ue||o===je?o=w:o===He||o===Fe?o=k:(o=w,n=void 0);const v=o===w&&t[a+1].startsWith("/>")?" ":"";i+=o===k?c+yt:l>=0?(s.push(u),c.slice(0,l)+We+c.slice(l)+A+v):c+A+(-2===l?a:v)}return[Qe(t,i+(t[r]||"<?>")+(2===e?"</svg>":"")),s]};var L=class t{constructor({strings:e,_$litType$:r},s){let n;this.parts=[];let i=0,o=0;const a=e.length-1,c=this.parts,[u,h]=vt(e,r);if(this.el=t.createElement(u,s),$.currentNode=this.el.content,2===r){const l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;null!==(n=$.nextNode())&&c.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const l of n.getAttributeNames())if(l.endsWith(We)){const y=h[o++],v=n.getAttribute(l).split(A),N=/([.?@])?(.*)/.exec(y);c.push({type:1,index:i,name:N[2],strings:v,ctor:"."===N[1]?pe:"?"===N[1]?de:"@"===N[1]?_e:z}),n.removeAttribute(l)}else l.startsWith(A)&&(c.push({type:6,index:i}),n.removeAttribute(l));if(Le.test(n.tagName)){const l=n.textContent.split(A),y=l.length-1;if(y>0){n.textContent=Z?Z.emptyScript:"";for(let v=0;v<y;v++)n.append(l[v],W()),$.nextNode(),c.push({type:2,index:++i});n.append(l[y],W())}}}else if(8===n.nodeType)if(n.data===Be)c.push({type:2,index:i});else{let l=-1;for(;-1!==(l=n.data.indexOf(A,l+1));)c.push({type:7,index:i}),l+=A.length-1}i++}}static createElement(e,r){const s=x.createElement("template");return s.innerHTML=e,s}};function D(t,e,r=t,s){var o,a,c;if(e===V)return e;let n=void 0!==s?(o=r._$Co)==null?void 0:o[s]:r._$Cl;const i=B(e)?void 0:e._$litDirective$;return(n==null?void 0:n.constructor)!==i&&((a=n==null?void 0:n._$AO)==null?void 0:a.call(n,false),void 0===i?n=void 0:(n=new i(t),n._$AT(t,r,s)),void 0!==s?((c=r._$Co)!=null?c:r._$Co=[])[s]=n:r._$Cl=n),void 0!==n&&(e=D(t,n._$AS(t,e.values),n,s)),e}var fe=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var u;const{el:{content:r},parts:s}=this._$AD,n=((u=e==null?void 0:e.creationScope)!=null?u:x).importNode(r,true);$.currentNode=n;let i=$.nextNode(),o=0,a=0,c=s[0];for(;void 0!==c;){if(o===c.index){let h;2===c.type?h=new X(i,i.nextSibling,this,e):1===c.type?h=new c.ctor(i,c.name,c.strings,this,e):6===c.type&&(h=new me(i,this,e)),this._$AV.push(h),c=s[++a]}o!==(c==null?void 0:c.index)&&(i=$.nextNode(),o++)}return $.currentNode=x,n}p(e){let r=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,r),r+=s.strings.length-2):s._$AI(e[r])),r++}};var X=class t{get _$AU(){var e,r;return(r=(e=this._$AM)==null?void 0:e._$AU)!=null?r:this._$Cv}constructor(e,r,s,n){var i;this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=s,this.options=n,this._$Cv=(i=n==null?void 0:n.isConnected)!=null?i:true}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return void 0!==r&&11===(e==null?void 0:e.nodeType)&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=D(this,e,r),B(e)?e===p||null==e||""===e?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):bt(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==p&&B(this._$AH)?this._$AA.nextSibling.data=e:this.$(x.createTextNode(e)),this._$AH=e}g(e){var i;const{values:r,_$litType$:s}=e,n="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=L.createElement(Qe(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===n)this._$AH.p(r);else{const o=new fe(n,this),a=o.u(this.options);o.p(r),this.$(a),this._$AH=o}}_$AC(e){let r=ke.get(e.strings);return void 0===r&&ke.set(e.strings,r=new L(e)),r}T(e){Ve(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let s,n=0;for(const i of e)n===r.length?r.push(s=new t(this.k(W()),this.k(W()),this,this.options)):s=r[n],s._$AI(i),n++;n<r.length&&(this._$AR(s&&s._$AB.nextSibling,n),r.length=n)}_$AR(e=this._$AA.nextSibling,r){var s;for((s=this._$AP)==null?void 0:s.call(this,false,true,r);e&&e!==this._$AB;){const n=e.nextSibling;e.remove(),e=n}}setConnected(e){var r;void 0===this._$AM&&(this._$Cv=e,(r=this._$AP)==null?void 0:r.call(this,e))}};var z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,s,n,i){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=r,this._$AM=n,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(e,r=this,s,n){const i=this.strings;let o=false;if(void 0===i)e=D(this,e,r,0),o=!B(e)||e!==this._$AH&&e!==V,o&&(this._$AH=e);else{const a=e;let c,u;for(e=i[0],c=0;c<i.length-1;c++)u=D(this,a[s+c],r,c),u===V&&(u=this._$AH[c]),o||(o=!B(u)||u!==this._$AH[c]),u===p?e=p:e!==p&&(e+=(u!=null?u:"")+i[c+1]),this._$AH[c]=u}o&&!n&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}};var pe=class extends z{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}};var de=class extends z{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}};var _e=class extends z{constructor(e,r,s,n,i){super(e,r,s,n,i),this.type=5}_$AI(e,r=this){var o;if((e=(o=D(this,e,r,0))!=null?o:p)===V)return;const s=this._$AH,n=e===p&&s!==p||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==p&&(s===p||n);n&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r,s;"function"==typeof this._$AH?this._$AH.call((s=(r=this.options)==null?void 0:r.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}};var me=class{constructor(e,r,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){D(this,e)}};var he=R.litHtmlPolyfillSupport;var Re;he==null?void 0:he(L,X),((Re=R.litHtmlVersions)!=null?Re:R.litHtmlVersions=[]).push("3.0.0");var Ge=(t,e,r)=>{var i,o;const s=(i=r==null?void 0:r.renderBefore)!=null?i:e;let n=s._$litPart$;if(void 0===n){const a=(o=r==null?void 0:r.renderBefore)!=null?o:null;s._$litPart$=n=new X(e.insertBefore(W(),a),a,void 0,r!=null?r:{})}return n._$AI(t),n};var tt=Symbol.for("immer-nothing");var Ke=Symbol.for("immer-draftable");var _=Symbol.for("immer-state");var gt=true?[function(t){return`The plugin for '${t}' has not been loaded into Immer. To enable the plugin, import and call \`enable${t}()\` when initializing your application.`},function(t){return`produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${t}'`},"This object has been frozen and should not be mutated",function(t){return"Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+t},"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.","Immer forbids circular references","The first or second argument to `produce` must be a function","The third argument to `produce` must be a function or undefined","First argument to `createDraft` must be a plain object, an array, or an immerable object","First argument to `finishDraft` must be a draft returned by `createDraft`",function(t){return`'current' expects a draft, got: ${t}`},"Object.defineProperty() cannot be used on an Immer draft","Object.setPrototypeOf() cannot be used on an Immer draft","Immer only supports deleting array indices","Immer only supports setting array indices and the 'length' property",function(t){return`'original' expects a draft, got: ${t}`}]:[];function d(t,...e){if(true){const r=gt[t];const s=typeof r==="function"?r.apply(null,e):r;throw new Error(`[Immer] ${s}`)}throw new Error(`[Immer] minified error nr: ${t}. Full error at: https://bit.ly/3cXEKWf`)}var M=Object.getPrototypeOf;function T(t){return!!t&&!!t[_]}function S(t){var e;if(!t)return false;return rt(t)||Array.isArray(t)||!!t[Ke]||!!((e=t.constructor)==null?void 0:e[Ke])||se(t)||ne(t)}var At=Object.prototype.constructor.toString();function rt(t){if(!t||typeof t!=="object")return false;const e=M(t);if(e===null){return true}const r=Object.hasOwnProperty.call(e,"constructor")&&e.constructor;if(r===Object)return true;return typeof r=="function"&&Function.toString.call(r)===At}function q(t,e){if(re(t)===0){Object.entries(t).forEach(([r,s])=>{e(r,s,t)})}else{t.forEach((r,s)=>e(s,r,t))}}function re(t){const e=t[_];return e?e.type_:Array.isArray(t)?1:se(t)?2:ne(t)?3:0}function ve(t,e){return re(t)===2?t.has(e):Object.prototype.hasOwnProperty.call(t,e)}function st(t,e,r){const s=re(t);if(s===2)t.set(e,r);else if(s===3){t.add(r)}else t[e]=r}function wt(t,e){if(t===e){return t!==0||1/t===1/e}else{return t!==t&&e!==e}}function se(t){return t instanceof Map}function ne(t){return t instanceof Set}function E(t){return t.copy_||t.base_}function ge(t,e){if(se(t)){return new Map(t)}if(ne(t)){return new Set(t)}if(Array.isArray(t))return Array.prototype.slice.call(t);if(!e&&rt(t)){if(!M(t)){const n=Object.create(null);return Object.assign(n,t)}return Me({},t)}const r=Object.getOwnPropertyDescriptors(t);delete r[_];let s=Reflect.ownKeys(r);for(let n=0;n<s.length;n++){const i=s[n];const o=r[i];if(o.writable===false){o.writable=true;o.configurable=true}if(o.get||o.set)r[i]={configurable:true,writable:true,enumerable:o.enumerable,value:t[i]}}return Object.create(M(t),r)}function Ee(t,e=false){if(ie(t)||T(t)||!S(t))return t;if(re(t)>1){t.set=t.add=t.clear=t.delete=$t}Object.freeze(t);if(e)q(t,(r,s)=>Ee(s,true),true);return t}function $t(){d(2)}function ie(t){return Object.isFrozen(t)}var xt={};function C(t){const e=xt[t];if(!e){d(0,t)}return e}var Q;function nt(){return Q}function Et(t,e){return{drafts_:[],parent_:t,immer_:e,canAutoFreeze_:true,unfinalizedDrafts_:0}}function Je(t,e){if(e){C("Patches");t.patches_=[];t.inversePatches_=[];t.patchListener_=e}}function Ae(t){we(t);t.drafts_.forEach(St);t.drafts_=null}function we(t){if(t===Q){Q=t.parent_}}function Ye(t){return Q=Et(Q,t)}function St(t){const e=t[_];if(e.type_===0||e.type_===1)e.revoke_();else e.revoked_=true}function Ze(t,e){e.unfinalizedDrafts_=e.drafts_.length;const r=e.drafts_[0];const s=t!==void 0&&t!==r;if(s){if(r[_].modified_){Ae(e);d(4)}if(S(t)){t=ee(e,t);if(!e.parent_)te(e,t)}if(e.patches_){C("Patches").generateReplacementPatches_(r[_].base_,t,e.patches_,e.inversePatches_)}}else{t=ee(e,r,[])}Ae(e);if(e.patches_){e.patchListener_(e.patches_,e.inversePatches_)}return t!==tt?t:void 0}function ee(t,e,r){if(ie(e))return e;const s=e[_];if(!s){q(e,(n,i)=>et(t,s,e,n,i,r),true);return e}if(s.scope_!==t)return e;if(!s.modified_){te(t,s.base_,true);return s.base_}if(!s.finalized_){s.finalized_=true;s.scope_.unfinalizedDrafts_--;const n=s.copy_;let i=n;let o=false;if(s.type_===3){i=new Set(n);n.clear();o=true}q(i,(a,c)=>et(t,s,n,a,c,r,o));te(t,n,false);if(r&&t.patches_){C("Patches").generatePatches_(s,r,t.patches_,t.inversePatches_)}}return s.copy_}function et(t,e,r,s,n,i,o){if(n===r)d(5);if(T(n)){const a=i&&e&&e.type_!==3&&!ve(e.assigned_,s)?i.concat(s):void 0;const c=ee(t,n,a);st(r,s,c);if(T(c)){t.canAutoFreeze_=false}else return}else if(o){r.add(n)}if(S(n)&&!ie(n)){if(!t.immer_.autoFreeze_&&t.unfinalizedDrafts_<1){return}ee(t,n);if(!e||!e.scope_.parent_)te(t,n)}}function te(t,e,r=false){if(!t.parent_&&t.immer_.autoFreeze_&&t.canAutoFreeze_){Ee(e,r)}}function Ct(t,e){const r=Array.isArray(t);const s={type_:r?1:0,scope_:e?e.scope_:nt(),modified_:false,finalized_:false,assigned_:{},parent_:e,base_:t,draft_:null,copy_:null,revoke_:null,isManual_:false};let n=s;let i=Se;if(r){n=[s];i=G}const{revoke:o,proxy:a}=Proxy.revocable(n,i);s.draft_=a;s.revoke_=o;return a}var Se={get(t,e){if(e===_)return t;const r=E(t);if(!ve(r,e)){return Pt(t,r,e)}const s=r[e];if(t.finalized_||!S(s)){return s}if(s===ye(t.base_,e)){be(t);return t.copy_[e]=xe(s,t)}return s},has(t,e){return e in E(t)},ownKeys(t){return Reflect.ownKeys(E(t))},set(t,e,r){const s=it(E(t),e);if(s==null?void 0:s.set){s.set.call(t.draft_,r);return true}if(!t.modified_){const n=ye(E(t),e);const i=n==null?void 0:n[_];if(i&&i.base_===r){t.copy_[e]=r;t.assigned_[e]=false;return true}if(wt(r,n)&&(r!==void 0||ve(t.base_,e)))return true;be(t);$e(t)}if(t.copy_[e]===r&&(r!==void 0||e in t.copy_)||Number.isNaN(r)&&Number.isNaN(t.copy_[e]))return true;t.copy_[e]=r;t.assigned_[e]=true;return true},deleteProperty(t,e){if(ye(t.base_,e)!==void 0||e in t.base_){t.assigned_[e]=false;be(t);$e(t)}else{delete t.assigned_[e]}if(t.copy_){delete t.copy_[e]}return true},getOwnPropertyDescriptor(t,e){const r=E(t);const s=Reflect.getOwnPropertyDescriptor(r,e);if(!s)return s;return{writable:true,configurable:t.type_!==1||e!=="length",enumerable:s.enumerable,value:r[e]}},defineProperty(){d(11)},getPrototypeOf(t){return M(t.base_)},setPrototypeOf(){d(12)}};var G={};q(Se,(t,e)=>{G[t]=function(){arguments[0]=arguments[0][0];return e.apply(this,arguments)}});G.deleteProperty=function(t,e){if(isNaN(parseInt(e)))d(13);return G.set.call(this,t,e,void 0)};G.set=function(t,e,r){if(e!=="length"&&isNaN(parseInt(e)))d(14);return Se.set.call(this,t[0],e,r,t[0])};function ye(t,e){const r=t[_];const s=r?E(r):t;return s[e]}function Pt(t,e,r){var n;const s=it(e,r);return s?`value`in s?s.value:(n=s.get)==null?void 0:n.call(t.draft_):void 0}function it(t,e){if(!(e in t))return void 0;let r=M(t);while(r){const s=Object.getOwnPropertyDescriptor(r,e);if(s)return s;r=M(r)}return void 0}function $e(t){if(!t.modified_){t.modified_=true;if(t.parent_){$e(t.parent_)}}}function be(t){if(!t.copy_){t.copy_=ge(t.base_,t.scope_.immer_.useStrictShallowCopy_)}}var Ot=class{constructor(t){this.autoFreeze_=true;this.useStrictShallowCopy_=false;this.produce=(e,r,s)=>{if(typeof e==="function"&&typeof r!=="function"){const i=r;r=e;const o=this;return function a(c=i,...u){return o.produce(c,h=>r.call(this,h,...u))}}if(typeof r!=="function")d(6);if(s!==void 0&&typeof s!=="function")d(7);let n;if(S(e)){const i=Ye(this);const o=xe(e,void 0);let a=true;try{n=r(o);a=false}finally{if(a)Ae(i);else we(i)}Je(i,s);return Ze(n,i)}else if(!e||typeof e!=="object"){n=r(e);if(n===void 0)n=e;if(n===tt)n=void 0;if(this.autoFreeze_)Ee(n,true);if(s){const i=[];const o=[];C("Patches").generateReplacementPatches_(e,n,i,o);s(i,o)}return n}else d(1,e)};this.produceWithPatches=(e,r)=>{if(typeof e==="function"){return(o,...a)=>this.produceWithPatches(o,c=>e(c,...a))}let s,n;const i=this.produce(e,r,(o,a)=>{s=o;n=a});return[i,s,n]};if(typeof(t==null?void 0:t.autoFreeze)==="boolean")this.setAutoFreeze(t.autoFreeze);if(typeof(t==null?void 0:t.useStrictShallowCopy)==="boolean")this.setUseStrictShallowCopy(t.useStrictShallowCopy)}createDraft(t){if(!S(t))d(8);if(T(t))t=Nt(t);const e=Ye(this);const r=xe(t,void 0);r[_].isManual_=true;we(e);return r}finishDraft(t,e){const r=t&&t[_];if(!r||!r.isManual_)d(9);const{scope_:s}=r;Je(s,e);return Ze(void 0,s)}setAutoFreeze(t){this.autoFreeze_=t}setUseStrictShallowCopy(t){this.useStrictShallowCopy_=t}applyPatches(t,e){let r;for(r=e.length-1;r>=0;r--){const n=e[r];if(n.path.length===0&&n.op==="replace"){t=n.value;break}}if(r>-1){e=e.slice(r+1)}const s=C("Patches").applyPatches_;if(T(t)){return s(t,e)}return this.produce(t,n=>s(n,e))}};function xe(t,e){const r=se(t)?C("MapSet").proxyMap_(t,e):ne(t)?C("MapSet").proxySet_(t,e):Ct(t,e);const s=e?e.scope_:nt();s.drafts_.push(r);return r}function Nt(t){if(!T(t))d(10,t);return ot(t)}function ot(t){if(!S(t)||ie(t))return t;const e=t[_];let r;if(e){if(!e.modified_)return e.base_;e.finalized_=true;r=ge(t,e.scope_.immer_.useStrictShallowCopy_)}else{r=ge(t,true)}q(r,(s,n)=>{st(r,s,ot(n))});if(e){e.finalized_=false}return r}var m=new Ot;var P=m.produce;var Ht=m.produceWithPatches.bind(m);var Ft=m.setAutoFreeze.bind(m);var jt=m.setUseStrictShallowCopy.bind(m);var Ut=m.applyPatches.bind(m);var kt=m.createDraft.bind(m);var Rt=m.finishDraft.bind(m);var oe=null;var ct=t=>{if(oe){return oe}let e=t;let r=[];let s={};let n=[];let i=[];let o=false;const a=window["__REDUX_DEVTOOLS_EXTENSION__"]&&window["__REDUX_DEVTOOLS_EXTENSION__"].connect();const c=f=>{n.push(f)};const u=f=>{r.push(f);return()=>{const b=r.indexOf(f);if(b>-1){r.splice(b,1)}}};const h=(f,b)=>{if(s[f]){throw new Error(`Action type ${f} is already registered.`)}s[f]=b};const l=()=>U(void 0,null,function*(){if(i.length===0){o=false;return}o=true;const{action:f,payload:b}=i.shift();const H=s[f];if(!H){console.warn(`No reducer found for action ${f}`);return}const F={getState:()=>e,dispatch:(j,ue)=>y(j,ue)};const ae=n.map(j=>j(F));const J=ae.reduce((j,ue)=>ue(j),v);yield J(f,b);l()});const y=(f,b)=>{i.push({action:f,payload:b});if(!o){l()}};const v=(f,b)=>U(void 0,null,function*(){let H;let F=null;H=P(e,ae=>{const J=s[f](ae,b);if(J instanceof Promise){F=J;return}});if(F){yield F}e=H;N(f);return H});const N=f=>{for(const b of r){b(e,f)}a&&a.send(f,e)};oe={state:e,subscribe:u,register:h,dispatch:y,use:c};return oe};var Ce=class{constructor(e){if(typeof e==="function"){this.observer={next:e}}else{this.observer=e}this.teardowns=[];if(typeof AbortController!=="undefined"){this.controller=new AbortController;this.signal=this.controller.signal}this.isUnsubscribed=false}next(e){if(!this.isUnsubscribed&&this.observer.next){this.observer.next(e)}}complete(){if(!this.isUnsubscribed){if(this.observer.complete){this.observer.complete()}this.unsubscribe()}}error(e){if(!this.isUnsubscribed){if(this.observer.error){this.observer.error(e)}this.unsubscribe()}}addTeardown(e){this.teardowns.push(e)}unsubscribe(){if(!this.isUnsubscribed){this.isUnsubscribed=true;if(this.controller){this.controller.abort()}this.teardowns.forEach(e=>{if(typeof e!=="function"){throw new Error("[Cami.js] Teardown must be a function. Please implement a teardown function in your subscriber.")}e()})}}};var g=class{constructor(e=()=>()=>{}){this._observers=[];this.subscribeCallback=e}subscribe(e=()=>{},r=()=>{},s=()=>{}){let n;if(typeof e==="function"){n={next:e,error:r,complete:s}}else if(typeof e==="object"){n=e}else{throw new Error("[Cami.js] First argument to subscribe must be a next callback or an observer object")}const i=new Ce(n);let o=()=>{};try{o=this.subscribeCallback(i)}catch(a){if(i.error){i.error(a)}else{console.error("[Cami.js] Error in Subscriber:",a)}return}i.addTeardown(o);this._observers.push(i);return{unsubscribe:()=>i.unsubscribe(),complete:()=>i.complete(),error:a=>i.error(a)}}onValue(e){return this.subscribe({next:e})}onError(e){return this.subscribe({error:e})}onEnd(e){return this.subscribe({complete:e})}[Symbol.asyncIterator](){let e;let r;let s=new Promise(n=>r=n);e={next:n=>{r({value:n,done:false});s=new Promise(i=>r=i)},complete:()=>{r({done:true})},error:n=>{throw n}};this.subscribe(e);return{next:()=>s}}};var I=class extends g{constructor(e=null,r=null,{last:s=false}={}){super();if(s){this._lastObserver=r}else{this._observers.push(r)}this._value=P(e,n=>{});this._pendingUpdates=[];this._updateScheduled=false}get value(){if(K.isComputing!=null){K.isComputing.addDependency(this)}return this._value}set value(e){this.update(()=>e)}assign(e){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(r=>Object.assign(r,e))}set(e,r){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(s=>{s[e]=r})}delete(e){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(r=>{delete r[e]})}clear(){this.update(()=>({}))}push(...e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(r=>{r.push(...e)})}pop(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.pop()})}shift(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.shift()})}splice(e,r,...s){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.splice(e,r,...s)})}unshift(...e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(r=>{r.unshift(...e)})}reverse(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.reverse()})}sort(e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(r=>{r.sort(e)})}fill(e,r=0,s=this._value.length){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.fill(e,r,s)})}copyWithin(e,r,s=this._value.length){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.copyWithin(e,r,s)})}update(e){this._pendingUpdates.push(e);if(!this._updateScheduled){this._updateScheduled=true;if(typeof window!=="undefined"){requestAnimationFrame(this._applyUpdates.bind(this))}else{Promise.resolve().then(this._applyUpdates.bind(this))}}}notifyObservers(){const e=[...this._observers,this._lastObserver];e.forEach(r=>{if(r&&typeof r==="function"){r(this._value)}else if(r&&r.next){r.next(this._value)}})}_applyUpdates(){let e=this._value;while(this._pendingUpdates.length>0){const r=this._pendingUpdates.shift();this._value=P(this._value,r)}if(e!==this._value){this.notifyObservers()}this._updateScheduled=false}};var K=class t extends I{constructor(e,r){super(null);this.computeFn=e;this.context=r;this.dependencies=new Set;this.children=new Set;this.subscriptions=new Map;this.compute()}get value(){t.isComputing=this;const e=this.computeFn.call(this.context);t.isComputing=null;return e}compute(){this.notifyChildren();this._value=this.computeFn.call(this.context);this.notifyObservers()}addDependency(e){if(!this.dependencies.has(e)){const r=e.onValue(()=>this.compute());this.dependencies.add(e);this.subscriptions.set(e,r);if(e instanceof t){e.addChild(this)}}}dispose(){this.notifyChildren();this.dependencies.forEach(e=>{const r=this.subscriptions.get(e);if(r){r.unsubscribe()}this.dependencies.delete(e);this.subscriptions.delete(e);if(e instanceof t){e.removeChild(this)}})}addChild(e){this.children.add(e)}removeChild(e){this.children.delete(e)}notifyChildren(){this.children.forEach(e=>{e.dispose()});this.children.clear()}};var at=function(t){return new K(t,this)};var ut=function(t){this._isWithinBatch=true;Promise.resolve().then(t).finally(()=>{this._isWithinBatch=false;this.react()})};var lt=function(t){let e=()=>{};const r=()=>{e();e=t.call(this)||(()=>{})};this._effects.push({effectFn:r,cleanup:e})};var O=class t extends g{static from(e){if(e instanceof g){return new t(r=>{const s=e.subscribe({next:n=>r.next(n),error:n=>r.error(n),complete:()=>r.complete()});return()=>{if(!s.closed){s.unsubscribe()}}})}else if(e[Symbol.asyncIterator]){return new t(r=>{let s=false;(()=>U(this,null,function*(){try{try{for(var n=Te(e),i,o,a;i=!(o=yield n.next()).done;i=false){const c=o.value;if(s)return;r.next(c)}}catch(o){a=[o]}finally{try{i&&(o=n.return)&&(yield o.call(n))}finally{if(a)throw a[0]}}r.complete()}catch(c){r.error(c)}}))();return()=>{s=true}})}else if(e[Symbol.iterator]){return new t(r=>{try{for(const s of e){r.next(s)}r.complete()}catch(s){r.error(s)}return()=>{if(!subscription.closed){subscription.unsubscribe()}}})}else if(e instanceof Promise){return new t(r=>{e.then(s=>{r.next(s);r.complete()},s=>r.error(s));return()=>{}})}else{throw new TypeError("[Cami.js] ObservableStream.from requires an Observable, AsyncIterable, Iterable, or Promise")}}map(e){return new t(r=>{const s=this.subscribe({next:n=>r.next(e(n)),error:n=>r.error(n),complete:()=>r.complete()});return()=>s.unsubscribe()})}filter(e){return new t(r=>{const s=this.subscribe({next:n=>{if(e(n)){r.next(n)}},error:n=>r.error(n),complete:()=>r.complete()});return()=>s.unsubscribe()})}reduce(e,r){return new Promise((s,n)=>{let i=r;const o=this.subscribe({next:a=>{i=e(i,a)},error:a=>n(a),complete:()=>s(i)});return()=>o.unsubscribe()})}takeUntil(e){return new t(r=>{const s=this.subscribe({next:i=>r.next(i),error:i=>r.error(i),complete:()=>r.complete()});const n=e.subscribe({next:()=>{r.complete();s.unsubscribe();n.unsubscribe()},error:i=>r.error(i)});return()=>{s.unsubscribe();n.unsubscribe()}})}take(e){return new t(r=>{let s=0;const n=this.subscribe({next:i=>{if(s++<e){r.next(i)}else{r.complete();n.unsubscribe()}},error:i=>r.error(i),complete:()=>r.complete()});return()=>n.unsubscribe()})}drop(e){return new t(r=>{let s=0;const n=this.subscribe({next:i=>{if(s++>=e){r.next(i)}},error:i=>r.error(i),complete:()=>r.complete()});return()=>n.unsubscribe()})}flatMap(e){return new t(r=>{const s=new Set;const n=this.subscribe({next:i=>{const o=e(i);const a=o.subscribe({next:c=>r.next(c),error:c=>r.error(c),complete:()=>{s.delete(a);if(s.size===0){r.complete()}}});s.add(a)},error:i=>r.error(i),complete:()=>{if(s.size===0){r.complete()}}});return()=>{n.unsubscribe();s.forEach(i=>i.unsubscribe())}})}switchMap(e){return new t(r=>{let s=null;const n=this.subscribe({next:i=>{if(s){s.unsubscribe()}const o=e(i);s=o.subscribe({next:a=>r.next(a),error:a=>r.error(a),complete:()=>{if(s){s.unsubscribe();s=null}}})},error:i=>r.error(i),complete:()=>{if(s){s.unsubscribe()}r.complete()}});return()=>{n.unsubscribe();if(s){s.unsubscribe()}}})}toArray(){return new Promise((e,r)=>{const s=[];this.subscribe({next:n=>s.push(n),error:n=>r(n),complete:()=>e(s)})})}forEach(e){return new Promise((r,s)=>{this.subscribe({next:n=>e(n),error:n=>s(n),complete:()=>r()})})}every(e){return new Promise((r,s)=>{let n=true;this.subscribe({next:i=>{if(!e(i)){n=false;r(false)}},error:i=>s(i),complete:()=>r(n)})})}find(e){return new Promise((r,s)=>{const n=this.subscribe({next:i=>{if(e(i)){r(i);n.unsubscribe()}},error:i=>s(i),complete:()=>r(void 0)})})}some(e){return new Promise((r,s)=>{const n=this.subscribe({next:i=>{if(e(i)){r(true);n.unsubscribe()}},error:i=>s(i),complete:()=>r(false)})})}finally(e){return new t(r=>{const s=this.subscribe({next:n=>r.next(n),error:n=>{e();r.error(n)},complete:()=>{e();r.complete()}});return()=>{s.unsubscribe()}})}toState(e=null){const r=new ObservableState(e);this.onValue(s=>r.update(()=>s));return r}emit(e){this._observers.forEach(r=>r.next(e))}};var ce=class extends O{constructor(e){super();if(typeof e==="string"){this.element=document.querySelector(e);if(!this.element){throw new Error(`Element not found for selector: ${e}`)}}else if(e instanceof Element||e instanceof Document){this.element=e}else{throw new Error(`Invalid argument: ${e}`)}}on(e,r={}){return new O(s=>{const n=i=>{s.next(i)};this.element.addEventListener(e,n,r);return()=>{this.element.removeEventListener(e,n,r)}})}};var Pe=class extends HTMLElement{constructor(){super();this._unsubscribers=new Map;this.store=null;this._effects=[];this._isWithinBatch=false;this.computed=at.bind(this);this.batch=ut.bind(this);this.effect=lt.bind(this)}observable(e){const r=new I(e,s=>this.react.bind(this)(),{last:true});return r}observableAttr(e,r=s=>s){let s=this.getAttribute(e);s=P(s,r);return this.observable(s)}setObservables(e){Object.keys(e).forEach(r=>{if(this[r]instanceof g){this[r].next(e[r])}})}subscribe(e,r){this.store=e;const s=this.observable(e.state[r]);const n=e.subscribe(i=>{this[r].update(()=>i[r])});this._unsubscribers.set(r,n);return s}dispatch(e,r){this.store.dispatch(e,r)}connectedCallback(){this.react()}disconnectedCallback(){this._unsubscribers.forEach(e=>e());this._effects.forEach(({cleanup:e})=>e&&e())}react(){if(!this._isWithinBatch){const e=this.template();Ge(e,this);this._effects.forEach(({effectFn:r})=>r.call(this))}}template(){throw new Error("[Cami.js] You have to implement the method template()!")}};function Dt(t,e){if(!customElements.get(t)){customElements.define(t,e)}}return mt(zt);})();
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
