var ot=Object.defineProperty;var je=Object.getOwnPropertySymbols;var ct=Object.prototype.hasOwnProperty;var at=Object.prototype.propertyIsEnumerable;var Se=(r,e)=>{if(e=Symbol[r])return e;throw Error("Symbol."+r+" is not defined")};var Ce=(r,e,t)=>e in r?ot(r,e,{enumerable:true,configurable:true,writable:true,value:t}):r[e]=t;var Te=(r,e)=>{for(var t in e||(e={}))if(ct.call(e,t))Ce(r,t,e[t]);if(je)for(var t of je(e)){if(at.call(e,t))Ce(r,t,e[t])}return r};var U=(r,e,t)=>{return new Promise((s,n)=>{var i=a=>{try{c(t.next(a))}catch(l){n(l)}};var o=a=>{try{c(t.throw(a))}catch(l){n(l)}};var c=a=>a.done?s(a.value):Promise.resolve(a.value).then(i,o);c((t=t.apply(r,e)).next())})};var oe=(r,e,t)=>(e=r[Se("asyncIterator")])?e.call(r):(r=r[Se("iterator")](),e={},t=(s,n)=>(n=r[s])&&(e[s]=i=>new Promise((o,c,a)=>(i=n.call(r,i),a=i.done,Promise.resolve(i.value).then(l=>o({value:l,done:a}),c)))),t("next"),t("return"),e);var L=globalThis;var Y=L.trustedTypes;var Ne=Y?Y.createPolicy("lit-html",{createHTML:r=>r}):void 0;var Fe="$lit$";var w=`lit$${(Math.random()+"").slice(9)}$`;var Le="?"+w;var ut=`<${Le}>`;var O=document;var R=()=>O.createComment("");var W=r=>null===r||"object"!=typeof r&&"function"!=typeof r;var Re=Array.isArray;var lt=r=>Re(r)||"function"==typeof(r==null?void 0:r[Symbol.iterator]);var ce="[ 	\n\f\r]";var F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;var De=/-->/g;var Me=/>/g;var x=RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g");var ze=/'/g;var Ie=/"/g;var We=/^(?:script|style|textarea|title)$/i;var Be=r=>(e,...t)=>({_$litType$:r,strings:e,values:t});var ft=Be(1);var Et=Be(2);var B=Symbol.for("lit-noChange");var h=Symbol.for("lit-nothing");var He=new WeakMap;var E=O.createTreeWalker(O,129);function Ve(r,e){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==Ne?Ne.createHTML(e):e}var ht=(r,e)=>{const t=r.length-1,s=[];let n,i=2===e?"<svg>":"",o=F;for(let c=0;c<t;c++){const a=r[c];let l,f,u=-1,y=0;for(;y<a.length&&(o.lastIndex=y,f=o.exec(a),null!==f);)y=o.lastIndex,o===F?"!--"===f[1]?o=De:void 0!==f[1]?o=Me:void 0!==f[2]?(We.test(f[2])&&(n=RegExp("</"+f[2],"g")),o=x):void 0!==f[3]&&(o=x):o===x?">"===f[0]?(o=n!=null?n:F,u=-1):void 0===f[1]?u=-2:(u=o.lastIndex-f[2].length,l=f[1],o=void 0===f[3]?x:'"'===f[3]?Ie:ze):o===Ie||o===ze?o=x:o===De||o===Me?o=F:(o=x,n=void 0);const p=o===x&&r[c+1].startsWith("/>")?" ":"";i+=o===F?a+ut:u>=0?(s.push(l),a.slice(0,u)+Fe+a.slice(u)+w+p):a+w+(-2===u?c:p)}return[Ve(r,i+(r[t]||"<?>")+(2===e?"</svg>":"")),s]};var V=class r{constructor({strings:e,_$litType$:t},s){let n;this.parts=[];let i=0,o=0;const c=e.length-1,a=this.parts,[l,f]=ht(e,t);if(this.el=r.createElement(l,s),E.currentNode=this.el.content,2===t){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;null!==(n=E.nextNode())&&a.length<c;){if(1===n.nodeType){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(Fe)){const y=f[o++],p=n.getAttribute(u).split(w),N=/([.?@])?(.*)/.exec(y);a.push({type:1,index:i,name:N[2],strings:p,ctor:"."===N[1]?le:"?"===N[1]?fe:"@"===N[1]?he:M}),n.removeAttribute(u)}else u.startsWith(w)&&(a.push({type:6,index:i}),n.removeAttribute(u));if(We.test(n.tagName)){const u=n.textContent.split(w),y=u.length-1;if(y>0){n.textContent=Y?Y.emptyScript:"";for(let p=0;p<y;p++)n.append(u[p],R()),E.nextNode(),a.push({type:2,index:++i});n.append(u[y],R())}}}else if(8===n.nodeType)if(n.data===Le)a.push({type:2,index:i});else{let u=-1;for(;-1!==(u=n.data.indexOf(w,u+1));)a.push({type:7,index:i}),u+=w.length-1}i++}}static createElement(e,t){const s=O.createElement("template");return s.innerHTML=e,s}};function D(r,e,t=r,s){var o,c,a;if(e===B)return e;let n=void 0!==s?(o=t._$Co)==null?void 0:o[s]:t._$Cl;const i=W(e)?void 0:e._$litDirective$;return(n==null?void 0:n.constructor)!==i&&((c=n==null?void 0:n._$AO)==null?void 0:c.call(n,false),void 0===i?n=void 0:(n=new i(r),n._$AT(r,t,s)),void 0!==s?((a=t._$Co)!=null?a:t._$Co=[])[s]=n:t._$Cl=n),void 0!==n&&(e=D(r,n._$AS(r,e.values),n,s)),e}var ue=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var l;const{el:{content:t},parts:s}=this._$AD,n=((l=e==null?void 0:e.creationScope)!=null?l:O).importNode(t,true);E.currentNode=n;let i=E.nextNode(),o=0,c=0,a=s[0];for(;void 0!==a;){if(o===a.index){let f;2===a.type?f=new X(i,i.nextSibling,this,e):1===a.type?f=new a.ctor(i,a.name,a.strings,this,e):6===a.type&&(f=new pe(i,this,e)),this._$AV.push(f),a=s[++c]}o!==(a==null?void 0:a.index)&&(i=E.nextNode(),o++)}return E.currentNode=O,n}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}};var X=class r{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,s,n){var i;this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=n,this._$Cv=(i=n==null?void 0:n.isConnected)!=null?i:true}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===(e==null?void 0:e.nodeType)&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=D(this,e,t),W(e)?e===h||null==e||""===e?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):lt(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==h&&W(this._$AH)?this._$AA.nextSibling.data=e:this.$(O.createTextNode(e)),this._$AH=e}g(e){var i;const{values:t,_$litType$:s}=e,n="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=V.createElement(Ve(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===n)this._$AH.p(t);else{const o=new ue(n,this),c=o.u(this.options);o.p(t),this.$(c),this._$AH=o}}_$AC(e){let t=He.get(e.strings);return void 0===t&&He.set(e.strings,t=new V(e)),t}T(e){Re(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,n=0;for(const i of e)n===t.length?t.push(s=new r(this.k(R()),this.k(R()),this,this.options)):s=t[n],s._$AI(i),n++;n<t.length&&(this._$AR(s&&s._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,false,true,t);e&&e!==this._$AB;){const n=e.nextSibling;e.remove(),e=n}}setConnected(e){var t;void 0===this._$AM&&(this._$Cv=e,(t=this._$AP)==null?void 0:t.call(this,e))}};var M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,n,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(e,t=this,s,n){const i=this.strings;let o=false;if(void 0===i)e=D(this,e,t,0),o=!W(e)||e!==this._$AH&&e!==B,o&&(this._$AH=e);else{const c=e;let a,l;for(e=i[0],a=0;a<i.length-1;a++)l=D(this,c[s+a],t,a),l===B&&(l=this._$AH[a]),o||(o=!W(l)||l!==this._$AH[a]),l===h?e=h:e!==h&&(e+=(l!=null?l:"")+i[a+1]),this._$AH[a]=l}o&&!n&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}};var le=class extends M{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}};var fe=class extends M{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}};var he=class extends M{constructor(e,t,s,n,i){super(e,t,s,n,i),this.type=5}_$AI(e,t=this){var o;if((e=(o=D(this,e,t,0))!=null?o:h)===B)return;const s=this._$AH,n=e===h&&s!==h||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==h&&(s===h||n);n&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;"function"==typeof this._$AH?this._$AH.call((s=(t=this.options)==null?void 0:t.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}};var pe=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){D(this,e)}};var ae=L.litHtmlPolyfillSupport;var Ue;ae==null?void 0:ae(V,X),((Ue=L.litHtmlVersions)!=null?Ue:L.litHtmlVersions=[]).push("3.0.0");var Xe=(r,e,t)=>{var i,o;const s=(i=t==null?void 0:t.renderBefore)!=null?i:e;let n=s._$litPart$;if(void 0===n){const c=(o=t==null?void 0:t.renderBefore)!=null?o:null;s._$litPart$=n=new X(e.insertBefore(R(),c),c,void 0,t!=null?t:{})}return n._$AI(r),n};var Ze=Symbol.for("immer-nothing");var Ge=Symbol.for("immer-draftable");var b=Symbol.for("immer-state");var pt=true?[function(r){return`The plugin for '${r}' has not been loaded into Immer. To enable the plugin, import and call \`enable${r}()\` when initializing your application.`},function(r){return`produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${r}'`},"This object has been frozen and should not be mutated",function(r){return"Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+r},"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.","Immer forbids circular references","The first or second argument to `produce` must be a function","The third argument to `produce` must be a function or undefined","First argument to `createDraft` must be a plain object, an array, or an immerable object","First argument to `finishDraft` must be a draft returned by `createDraft`",function(r){return`'current' expects a draft, got: ${r}`},"Object.defineProperty() cannot be used on an Immer draft","Object.setPrototypeOf() cannot be used on an Immer draft","Immer only supports deleting array indices","Immer only supports setting array indices and the 'length' property",function(r){return`'original' expects a draft, got: ${r}`}]:[];function d(r,...e){if(true){const t=pt[r];const s=typeof t==="function"?t.apply(null,e):t;throw new Error(`[Immer] ${s}`)}throw new Error(`[Immer] minified error nr: ${r}. Full error at: https://bit.ly/3cXEKWf`)}var z=Object.getPrototypeOf;function I(r){return!!r&&!!r[b]}function j(r){var e;if(!r)return false;return qe(r)||Array.isArray(r)||!!r[Ge]||!!((e=r.constructor)==null?void 0:e[Ge])||ee(r)||te(r)}var dt=Object.prototype.constructor.toString();function qe(r){if(!r||typeof r!=="object")return false;const e=z(r);if(e===null){return true}const t=Object.hasOwnProperty.call(e,"constructor")&&e.constructor;if(t===Object)return true;return typeof t=="function"&&Function.toString.call(t)===dt}function G(r,e){if(K(r)===0){Object.entries(r).forEach(([t,s])=>{e(t,s,r)})}else{r.forEach((t,s)=>e(s,t,r))}}function K(r){const e=r[b];return e?e.type_:Array.isArray(r)?1:ee(r)?2:te(r)?3:0}function be(r,e){return K(r)===2?r.has(e):Object.prototype.hasOwnProperty.call(r,e)}function Ke(r,e,t){const s=K(r);if(s===2)r.set(e,t);else if(s===3){r.add(t)}else r[e]=t}function _t(r,e){if(r===e){return r!==0||1/r===1/e}else{return r!==r&&e!==e}}function ee(r){return r instanceof Map}function te(r){return r instanceof Set}function P(r){return r.copy_||r.base_}function me(r,e){if(ee(r)){return new Map(r)}if(te(r)){return new Set(r)}if(Array.isArray(r))return Array.prototype.slice.call(r);if(!e&&qe(r)){if(!z(r)){const n=Object.create(null);return Object.assign(n,r)}return Te({},r)}const t=Object.getOwnPropertyDescriptors(r);delete t[b];let s=Reflect.ownKeys(t);for(let n=0;n<s.length;n++){const i=s[n];const o=t[i];if(o.writable===false){o.writable=true;o.configurable=true}if(o.get||o.set)t[i]={configurable:true,writable:true,enumerable:o.enumerable,value:r[i]}}return Object.create(z(r),t)}function Ae(r,e=false){if(re(r)||I(r)||!j(r))return r;if(K(r)>1){r.set=r.add=r.clear=r.delete=bt}Object.freeze(r);if(e)G(r,(t,s)=>Ae(s,true),true);return r}function bt(){d(2)}function re(r){return Object.isFrozen(r)}var mt={};function S(r){const e=mt[r];if(!e){d(0,r)}return e}var k;function et(){return k}function yt(r,e){return{drafts_:[],parent_:r,immer_:e,canAutoFreeze_:true,unfinalizedDrafts_:0}}function ke(r,e){if(e){S("Patches");r.patches_=[];r.inversePatches_=[];r.patchListener_=e}}function ye(r){ve(r);r.drafts_.forEach(vt);r.drafts_=null}function ve(r){if(r===k){k=r.parent_}}function Je(r){return k=yt(k,r)}function vt(r){const e=r[b];if(e.type_===0||e.type_===1)e.revoke_();else e.revoked_=true}function Qe(r,e){e.unfinalizedDrafts_=e.drafts_.length;const t=e.drafts_[0];const s=r!==void 0&&r!==t;if(s){if(t[b].modified_){ye(e);d(4)}if(j(r)){r=Z(e,r);if(!e.parent_)q(e,r)}if(e.patches_){S("Patches").generateReplacementPatches_(t[b].base_,r,e.patches_,e.inversePatches_)}}else{r=Z(e,t,[])}ye(e);if(e.patches_){e.patchListener_(e.patches_,e.inversePatches_)}return r!==Ze?r:void 0}function Z(r,e,t){if(re(e))return e;const s=e[b];if(!s){G(e,(n,i)=>Ye(r,s,e,n,i,t),true);return e}if(s.scope_!==r)return e;if(!s.modified_){q(r,s.base_,true);return s.base_}if(!s.finalized_){s.finalized_=true;s.scope_.unfinalizedDrafts_--;const n=s.copy_;let i=n;let o=false;if(s.type_===3){i=new Set(n);n.clear();o=true}G(i,(c,a)=>Ye(r,s,n,c,a,t,o));q(r,n,false);if(t&&r.patches_){S("Patches").generatePatches_(s,t,r.patches_,r.inversePatches_)}}return s.copy_}function Ye(r,e,t,s,n,i,o){if(n===t)d(5);if(I(n)){const c=i&&e&&e.type_!==3&&!be(e.assigned_,s)?i.concat(s):void 0;const a=Z(r,n,c);Ke(t,s,a);if(I(a)){r.canAutoFreeze_=false}else return}else if(o){t.add(n)}if(j(n)&&!re(n)){if(!r.immer_.autoFreeze_&&r.unfinalizedDrafts_<1){return}Z(r,n);if(!e||!e.scope_.parent_)q(r,n)}}function q(r,e,t=false){if(!r.parent_&&r.immer_.autoFreeze_&&r.canAutoFreeze_){Ae(e,t)}}function wt(r,e){const t=Array.isArray(r);const s={type_:t?1:0,scope_:e?e.scope_:et(),modified_:false,finalized_:false,assigned_:{},parent_:e,base_:r,draft_:null,copy_:null,revoke_:null,isManual_:false};let n=s;let i=$e;if(t){n=[s];i=J}const{revoke:o,proxy:c}=Proxy.revocable(n,i);s.draft_=c;s.revoke_=o;return c}var $e={get(r,e){if(e===b)return r;const t=P(r);if(!be(t,e)){return gt(r,t,e)}const s=t[e];if(r.finalized_||!j(s)){return s}if(s===de(r.base_,e)){_e(r);return r.copy_[e]=ge(s,r)}return s},has(r,e){return e in P(r)},ownKeys(r){return Reflect.ownKeys(P(r))},set(r,e,t){const s=tt(P(r),e);if(s==null?void 0:s.set){s.set.call(r.draft_,t);return true}if(!r.modified_){const n=de(P(r),e);const i=n==null?void 0:n[b];if(i&&i.base_===t){r.copy_[e]=t;r.assigned_[e]=false;return true}if(_t(t,n)&&(t!==void 0||be(r.base_,e)))return true;_e(r);we(r)}if(r.copy_[e]===t&&(t!==void 0||e in r.copy_)||Number.isNaN(t)&&Number.isNaN(r.copy_[e]))return true;r.copy_[e]=t;r.assigned_[e]=true;return true},deleteProperty(r,e){if(de(r.base_,e)!==void 0||e in r.base_){r.assigned_[e]=false;_e(r);we(r)}else{delete r.assigned_[e]}if(r.copy_){delete r.copy_[e]}return true},getOwnPropertyDescriptor(r,e){const t=P(r);const s=Reflect.getOwnPropertyDescriptor(t,e);if(!s)return s;return{writable:true,configurable:r.type_!==1||e!=="length",enumerable:s.enumerable,value:t[e]}},defineProperty(){d(11)},getPrototypeOf(r){return z(r.base_)},setPrototypeOf(){d(12)}};var J={};G($e,(r,e)=>{J[r]=function(){arguments[0]=arguments[0][0];return e.apply(this,arguments)}});J.deleteProperty=function(r,e){if(isNaN(parseInt(e)))d(13);return J.set.call(this,r,e,void 0)};J.set=function(r,e,t){if(e!=="length"&&isNaN(parseInt(e)))d(14);return $e.set.call(this,r[0],e,t,r[0])};function de(r,e){const t=r[b];const s=t?P(t):r;return s[e]}function gt(r,e,t){var n;const s=tt(e,t);return s?`value`in s?s.value:(n=s.get)==null?void 0:n.call(r.draft_):void 0}function tt(r,e){if(!(e in r))return void 0;let t=z(r);while(t){const s=Object.getOwnPropertyDescriptor(t,e);if(s)return s;t=z(t)}return void 0}function we(r){if(!r.modified_){r.modified_=true;if(r.parent_){we(r.parent_)}}}function _e(r){if(!r.copy_){r.copy_=me(r.base_,r.scope_.immer_.useStrictShallowCopy_)}}var At=class{constructor(r){this.autoFreeze_=true;this.useStrictShallowCopy_=false;this.produce=(e,t,s)=>{if(typeof e==="function"&&typeof t!=="function"){const i=t;t=e;const o=this;return function c(a=i,...l){return o.produce(a,f=>t.call(this,f,...l))}}if(typeof t!=="function")d(6);if(s!==void 0&&typeof s!=="function")d(7);let n;if(j(e)){const i=Je(this);const o=ge(e,void 0);let c=true;try{n=t(o);c=false}finally{if(c)ye(i);else ve(i)}ke(i,s);return Qe(n,i)}else if(!e||typeof e!=="object"){n=t(e);if(n===void 0)n=e;if(n===Ze)n=void 0;if(this.autoFreeze_)Ae(n,true);if(s){const i=[];const o=[];S("Patches").generateReplacementPatches_(e,n,i,o);s(i,o)}return n}else d(1,e)};this.produceWithPatches=(e,t)=>{if(typeof e==="function"){return(o,...c)=>this.produceWithPatches(o,a=>e(a,...c))}let s,n;const i=this.produce(e,t,(o,c)=>{s=o;n=c});return[i,s,n]};if(typeof(r==null?void 0:r.autoFreeze)==="boolean")this.setAutoFreeze(r.autoFreeze);if(typeof(r==null?void 0:r.useStrictShallowCopy)==="boolean")this.setUseStrictShallowCopy(r.useStrictShallowCopy)}createDraft(r){if(!j(r))d(8);if(I(r))r=$t(r);const e=Je(this);const t=ge(r,void 0);t[b].isManual_=true;ve(e);return t}finishDraft(r,e){const t=r&&r[b];if(!t||!t.isManual_)d(9);const{scope_:s}=t;ke(s,e);return Qe(void 0,s)}setAutoFreeze(r){this.autoFreeze_=r}setUseStrictShallowCopy(r){this.useStrictShallowCopy_=r}applyPatches(r,e){let t;for(t=e.length-1;t>=0;t--){const n=e[t];if(n.path.length===0&&n.op==="replace"){r=n.value;break}}if(t>-1){e=e.slice(t+1)}const s=S("Patches").applyPatches_;if(I(r)){return s(r,e)}return this.produce(r,n=>s(n,e))}};function ge(r,e){const t=ee(r)?S("MapSet").proxyMap_(r,e):te(r)?S("MapSet").proxySet_(r,e):wt(r,e);const s=e?e.scope_:et();s.drafts_.push(t);return t}function $t(r){if(!I(r))d(10,r);return rt(r)}function rt(r){if(!j(r)||re(r))return r;const e=r[b];let t;if(e){if(!e.modified_)return e.base_;e.finalized_=true;t=me(r,e.scope_.immer_.useStrictShallowCopy_)}else{t=me(r,true)}G(t,(s,n)=>{Ke(t,s,rt(n))});if(e){e.finalized_=false}return t}var m=new At;var C=m.produce;var Pt=m.produceWithPatches.bind(m);var jt=m.setAutoFreeze.bind(m);var St=m.setUseStrictShallowCopy.bind(m);var Ct=m.applyPatches.bind(m);var Tt=m.createDraft.bind(m);var Nt=m.finishDraft.bind(m);var xe=class{constructor(e){if(typeof e==="function"){this.observer={next:e}}else{this.observer=e}this.teardowns=[];if(typeof AbortController!=="undefined"){this.controller=new AbortController;this.signal=this.controller.signal}this.isUnsubscribed=false}next(e){if(!this.isUnsubscribed&&this.observer.next){this.observer.next(e)}}complete(){if(!this.isUnsubscribed){if(this.observer.complete){this.observer.complete()}this.unsubscribe()}}error(e){if(!this.isUnsubscribed){if(this.observer.error){this.observer.error(e)}this.unsubscribe()}}addTeardown(e){this.teardowns.push(e)}unsubscribe(){if(!this.isUnsubscribed){this.isUnsubscribed=true;if(this.controller){this.controller.abort()}this.teardowns.forEach(e=>{if(typeof e!=="function"){throw new Error("[Cami.js] Teardown must be a function. Please implement a teardown function in your subscriber.")}e()})}}};var _=class{constructor(e=()=>()=>{}){this._observers=[];this.subscribeCallback=e}subscribe(e=()=>{},t=()=>{},s=()=>{}){let n;if(typeof e==="function"){n={next:e,error:t,complete:s}}else if(typeof e==="object"){n=e}else{throw new Error("[Cami.js] First argument to subscribe must be a next callback or an observer object")}const i=new xe(n);let o=()=>{};try{o=this.subscribeCallback(i)}catch(c){if(i.error){i.error(c)}else{console.error("[Cami.js] Error in Subscriber:",c)}return}i.addTeardown(o);this._observers.push(i);return{unsubscribe:()=>i.unsubscribe(),complete:()=>i.complete(),error:c=>i.error(c)}}onValue(e){return this.subscribe({next:e})}onError(e){return this.subscribe({error:e})}onEnd(e){return this.subscribe({complete:e})}[Symbol.asyncIterator](){let e;let t;let s=new Promise(n=>t=n);e={next:n=>{t({value:n,done:false});s=new Promise(i=>t=i)},complete:()=>{t({done:true})},error:n=>{throw n}};this.subscribe(e);return{next:()=>s}}};var se=class extends _{constructor(e){if(typeof e!=="object"||e===null){throw new TypeError("[Cami.js] initialState must be an object")}super(t=>{this._subscriber=t;return()=>{this._subscriber=null}});this.state=new Proxy(e,{get:(t,s)=>{return t[s]},set:(t,s,n)=>{t[s]=n;this._observers.forEach(i=>i.next(this.state));if(this.devTools){this.devTools.send(s,this.state)}return true}});this.reducers={};this.middlewares=[];this.devTools=this.connectToDevTools();Object.keys(e).forEach(t=>{if(typeof e[t]==="function"){this.register(t,e[t])}else{this.state[t]=e[t]}})}_applyMiddleware(e,...t){const s={state:this.state,action:e,payload:t};for(const n of this.middlewares){n(s)}}connectToDevTools(){if(typeof window!=="undefined"&&window["__REDUX_DEVTOOLS_EXTENSION__"]){const e=window["__REDUX_DEVTOOLS_EXTENSION__"].connect();e.init(this.state);return e}return null}use(e){this.middlewares.push(e)}register(e,t){if(this.reducers[e]){throw new Error(`[Cami.js] Action type ${e} is already registered.`)}this.reducers[e]=t;this[e]=(...s)=>{this.dispatch(e,...s)}}dispatch(e,t){if(typeof e==="function"){return e(this.dispatch.bind(this),()=>this.state)}if(typeof e!=="string"){throw new Error(`[Cami.js] Action type must be a string. Got: ${typeof e}`)}const s=this.reducers[e];if(!s){console.warn(`No reducer found for action ${e}`);return}this._applyMiddleware(e,t);this.state=C(this.state,n=>{s(n,t)});this._observers.forEach(n=>n.next(this.state));if(this.devTools){this.devTools.send(e,this.state)}}};var g=class r extends _{static from(e){if(e instanceof _){return new r(t=>{const s=e.subscribe({next:n=>t.next(n),error:n=>t.error(n),complete:()=>t.complete()});return()=>{if(!s.closed){s.unsubscribe()}}})}else if(e[Symbol.asyncIterator]){return new r(t=>{let s=false;(()=>U(this,null,function*(){try{try{for(var n=oe(e),i,o,c;i=!(o=yield n.next()).done;i=false){const a=o.value;if(s)return;t.next(a)}}catch(o){c=[o]}finally{try{i&&(o=n.return)&&(yield o.call(n))}finally{if(c)throw c[0]}}t.complete()}catch(a){t.error(a)}}))();return()=>{s=true}})}else if(e[Symbol.iterator]){return new r(t=>{try{for(const s of e){t.next(s)}t.complete()}catch(s){t.error(s)}return()=>{if(!subscription.closed){subscription.unsubscribe()}}})}else if(e instanceof Promise){return new r(t=>{e.then(s=>{t.next(s);t.complete()},s=>t.error(s));return()=>{}})}else{throw new TypeError("[Cami.js] ObservableStream.from requires an Observable, AsyncIterable, Iterable, or Promise")}}map(e){return new r(t=>{const s=this.subscribe({next:n=>t.next(e(n)),error:n=>t.error(n),complete:()=>t.complete()});return()=>s.unsubscribe()})}filter(e){return new r(t=>{const s=this.subscribe({next:n=>{if(e(n)){t.next(n)}},error:n=>t.error(n),complete:()=>t.complete()});return()=>s.unsubscribe()})}reduce(e,t){return new Promise((s,n)=>{let i=t;const o=this.subscribe({next:c=>{i=e(i,c)},error:c=>n(c),complete:()=>s(i)});return()=>o.unsubscribe()})}takeUntil(e){return new r(t=>{const s=this.subscribe({next:i=>t.next(i),error:i=>t.error(i),complete:()=>t.complete()});const n=e.subscribe({next:()=>{t.complete();s.unsubscribe();n.unsubscribe()},error:i=>t.error(i)});return()=>{s.unsubscribe();n.unsubscribe()}})}take(e){return new r(t=>{let s=0;const n=this.subscribe({next:i=>{if(s++<e){t.next(i)}else{t.complete();n.unsubscribe()}},error:i=>t.error(i),complete:()=>t.complete()});return()=>n.unsubscribe()})}drop(e){return new r(t=>{let s=0;const n=this.subscribe({next:i=>{if(s++>=e){t.next(i)}},error:i=>t.error(i),complete:()=>t.complete()});return()=>n.unsubscribe()})}flatMap(e){return new r(t=>{const s=new Set;const n=this.subscribe({next:i=>{const o=e(i);const c=o.subscribe({next:a=>t.next(a),error:a=>t.error(a),complete:()=>{s.delete(c);if(s.size===0){t.complete()}}});s.add(c)},error:i=>t.error(i),complete:()=>{if(s.size===0){t.complete()}}});return()=>{n.unsubscribe();s.forEach(i=>i.unsubscribe())}})}switchMap(e){return new r(t=>{let s=null;const n=this.subscribe({next:i=>{if(s){s.unsubscribe()}const o=e(i);s=o.subscribe({next:c=>t.next(c),error:c=>t.error(c),complete:()=>{if(s){s.unsubscribe();s=null}}})},error:i=>t.error(i),complete:()=>{if(s){s.unsubscribe()}t.complete()}});return()=>{n.unsubscribe();if(s){s.unsubscribe()}}})}toArray(){return new Promise((e,t)=>{const s=[];this.subscribe({next:n=>s.push(n),error:n=>t(n),complete:()=>e(s)})})}forEach(e){return new Promise((t,s)=>{this.subscribe({next:n=>e(n),error:n=>s(n),complete:()=>t()})})}every(e){return new Promise((t,s)=>{let n=true;this.subscribe({next:i=>{if(!e(i)){n=false;t(false)}},error:i=>s(i),complete:()=>t(n)})})}find(e){return new Promise((t,s)=>{const n=this.subscribe({next:i=>{if(e(i)){t(i);n.unsubscribe()}},error:i=>s(i),complete:()=>t(void 0)})})}some(e){return new Promise((t,s)=>{const n=this.subscribe({next:i=>{if(e(i)){t(true);n.unsubscribe()}},error:i=>s(i),complete:()=>t(false)})})}finally(e){return new r(t=>{const s=this.subscribe({next:n=>t.next(n),error:n=>{e();t.error(n)},complete:()=>{e();t.complete()}});return()=>{s.unsubscribe()}})}toState(e=null){const t=new T(e);this.subscribe({next:s=>t.update(()=>s),error:s=>t.error(s),complete:()=>t.complete()});return t}push(e){if(e instanceof _){const t=e.subscribe({next:s=>this._observers.forEach(n=>n.next(s)),error:s=>this._observers.forEach(n=>n.error(s)),complete:()=>this._observers.forEach(s=>s.complete())})}else if(e[Symbol.asyncIterator]){(()=>U(this,null,function*(){try{try{for(var t=oe(e),s,n,i;s=!(n=yield t.next()).done;s=false){const o=n.value;this._observers.forEach(c=>c.next(o))}}catch(n){i=[n]}finally{try{s&&(n=t.return)&&(yield n.call(t))}finally{if(i)throw i[0]}}this._observers.forEach(o=>o.complete())}catch(o){this._observers.forEach(c=>c.error(o))}}))()}else if(e[Symbol.iterator]){try{for(const t of e){this._observers.forEach(s=>s.next(t))}this._observers.forEach(t=>t.complete())}catch(t){this._observers.forEach(s=>s.error(t))}}else if(e instanceof Promise){e.then(t=>{this._observers.forEach(s=>s.next(t));this._observers.forEach(s=>s.complete())},t=>this._observers.forEach(s=>s.error(t)))}else{this._observers.forEach(t=>t.next(e))}}plug(e){e.subscribe({next:t=>this.push(t),error:t=>this._observers.forEach(s=>s.error(t)),complete:()=>this._observers.forEach(t=>t.complete())})}end(){this._observers.forEach(e=>{if(e&&typeof e.complete==="function"){e.complete()}})}};var ne={events:true};var A={current:null};var T=class extends _{constructor(e=null,t=null,{last:s=false,name:n=null}={}){super();if(s){this._lastObserver=t}else{this._observers.push(t)}this._value=C(e,i=>{});this._pendingUpdates=[];this._updateScheduled=false;this._name=n}get value(){if(A.current!=null){A.current.addDependency(this)}return this._value}set value(e){this.update(()=>e)}assign(e){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(t=>Object.assign(t,e))}set(e,t){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(s=>{s[e]=t})}delete(e){if(typeof this._value!=="object"||this._value===null){throw new Error("[Cami.js] Observable value is not an object")}this.update(t=>{delete t[e]})}clear(){this.update(()=>({}))}push(...e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(t=>{t.push(...e)})}pop(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.pop()})}shift(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.shift()})}splice(e,t,...s){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.splice(e,t,...s)})}unshift(...e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(t=>{t.unshift(...e)})}reverse(){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(e=>{e.reverse()})}sort(e){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(t=>{t.sort(e)})}fill(e,t=0,s=this._value.length){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.fill(e,t,s)})}copyWithin(e,t,s=this._value.length){if(!Array.isArray(this._value)){throw new Error("[Cami.js] Observable value is not an array")}this.update(n=>{n.copyWithin(e,t,s)})}update(e){this._pendingUpdates.push(e);if(!this._updateScheduled){this._updateScheduled=true;if(typeof window!=="undefined"){requestAnimationFrame(this._applyUpdates.bind(this))}else{this._applyUpdates()}}}notifyObservers(){const e=[...this._observers,this._lastObserver];e.forEach(t=>{if(t&&typeof t==="function"){t(this._value)}else if(t&&t.next){t.next(this._value)}})}_applyUpdates(){let e=this._value;while(this._pendingUpdates.length>0){const t=this._pendingUpdates.shift();this._value=C(this._value,t)}if(e!==this._value){this.notifyObservers();if(ne.events&&typeof window!=="undefined"){const t=new CustomEvent("cami:state:change",{detail:{name:this._name,oldValue:e,newValue:this._value}});window.dispatchEvent(t)}}this._updateScheduled=false}toStream(){const e=new g;this.subscribe({next:t=>e.emit(t),error:t=>e.error(t),complete:()=>e.end()});return e}complete(){this._observers.forEach(e=>{if(e&&typeof e.complete==="function"){e.complete()}})}};var Ee=class extends T{constructor(e){super(null);this.computeFn=e;this.dependencies=new Set;this.subscriptions=new Map;this.compute()}get value(){if(A.current){A.current.addDependency(this)}return this._value}compute(){const e={addDependency:s=>{if(!this.dependencies.has(s)){const n=s.onValue(()=>this.compute());this.dependencies.add(s);this.subscriptions.set(s,n)}}};A.current=e;const t=this.computeFn();A.current=null;if(t!==this._value){this._value=t;this.notifyObservers()}}dispose(){this.subscriptions.forEach(e=>{e.unsubscribe()})}};var st=function(r){return new Ee(r)};var nt=function(r){let e=()=>{};let t=new Set;let s=new Map;const n={addDependency:c=>{if(!t.has(c)){const a=c.onValue(i);t.add(c);s.set(c,a)}}};const i=()=>{e();A.current=n;e=r()||(()=>{});A.current=null};if(typeof window!=="undefined"){requestAnimationFrame(i)}else{setTimeout(i,0)}const o=()=>{s.forEach(c=>{c.unsubscribe()});e()};return o};var Oe=class extends g{constructor(e){super();if(typeof e==="string"){this.element=document.querySelector(e);if(!this.element){throw new Error(`[Cami.js] Element not found for selector: ${e}`)}}else if(e instanceof Element||e instanceof Document){this.element=e}else{throw new Error(`[Cami.js] Invalid argument: ${e}`)}}on(e,t={}){return new g(s=>{const n=i=>{s.next(i)};this.element.addEventListener(e,n,t);return()=>{this.element.removeEventListener(e,n,t)}})}};var Q=new Map;var it=class extends HTMLElement{constructor(){super();this._unsubscribers=new Map;this._effects=[];this._isWithinBatch=false;this.computed=st.bind(this);this.effect=nt.bind(this)}_isObjectOrArray(e){return e!==null&&(typeof e==="object"||Array.isArray(e))}_handleObjectOrArray(e,t,s,n=false){const i=this._observableProxy(s);Object.defineProperty(e,t,{get:()=>i,set:o=>{s.update(()=>o);if(n){this.setAttribute(t,o)}}})}_handleNonObject(e,t,s,n=false){Object.defineProperty(e,t,{get:()=>s.value,set:i=>{s.update(()=>i);if(n){this.setAttribute(t,i)}}})}_observableProxy(e){return new Proxy(e,{get:(t,s)=>{if(typeof t[s]==="function"){return t[s].bind(t)}else if(s in t){return t[s]}else if(typeof t.value[s]==="function"){return(...n)=>t.value[s](...n)}else{return t.value[s]}},set:(t,s,n)=>{t[s]=n;t.update(()=>t.value);return true}})}setup(e){if(e.infer===true){e.infer=["observables","computed"]}if(e.infer){e.infer.forEach(t=>{if(t==="observables"){Object.keys(this).forEach(s=>{if(typeof this[s]!=="function"&&!s.startsWith("_")){if(this[s]instanceof _){return}else{const n=this.observable(this[s],s);if(this._isObjectOrArray(n.value)){this._handleObjectOrArray(this,s,n)}else{this._handleNonObject(this,s,n)}}}})}else if(t==="computed"){Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(s=>{const n=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this),s);return n&&typeof n.get==="function"}).forEach(s=>{const n=Object.getOwnPropertyDescriptor(this,s);if(n&&typeof n.get==="function"){Object.defineProperty(this,s,{get:()=>this.computed(n.get).value})}})}})}if(e.observables){e.observables.forEach(t=>{if(this[t]instanceof _){return}const s=this.observable(this[t],t);if(this._isObjectOrArray(s.value)){this._handleObjectOrArray(this,t,s)}else{this._handleNonObject(this,t,s)}})}if(e.computed){e.computed.forEach(t=>{if(typeof t==="string"){const s=Object.getOwnPropertyDescriptor(this,t);if(s&&typeof s.get==="function"){Object.defineProperty(this,t,{get:()=>this.computed(s.get).value})}}else if(typeof t==="object"&&typeof t.get==="function"){Object.defineProperty(this,t.name,{get:()=>this.computed(t.get).value})}})}if(e.effects){e.effects.forEach(t=>{this.effect(t)})}if(e.attributes){Object.entries(e.attributes).forEach(([t,s])=>{const n=typeof s==="function"?this.observableAttr(t,s):this.observableAttr(t);if(this._isObjectOrArray(n.value)){this._handleObjectOrArray(this,t,n,true)}else{this._handleNonObject(this,t,n,true)}})}}observable(e,t=null){if(!this._isAllowedType(e)){const n=Object.prototype.toString.call(e);throw new Error(`[Cami.js] The type ${n} of initialValue is not allowed in observables.`)}const s=new T(e,n=>this.react.bind(this)(),{last:true,name:t});this.registerObservables(s);return s}query({queryKey:e,queryFn:t,staleTime:s=0,refetchOnWindowFocus:n=true,refetchOnMount:i=true,refetchOnReconnect:o=true,refetchInterval:c=null,gcTime:a=1e3*60*5,retry:l=3,retryDelay:f=u=>Math.pow(2,u)*1e3}){const u=this.observable({data:null,isLoading:true,error:null,lastUpdated:Q.has(e)?Q.get(e).lastUpdated:null},e.join(":"));const y=this._observableProxy(u);const p=(v=0)=>U(this,null,function*(){const Pe=Date.now();const ie=Q.get(e);if(ie&&Pe-ie.lastUpdated<s){u.update($=>{$.data=ie.data;$.isLoading=false})}else{try{const $=yield t();Q.set(e,{data:$,lastUpdated:Pe});u.update(H=>{H.data=$;H.isLoading=false})}catch($){if(v<l){setTimeout(()=>p(v+1),f(v))}else{u.update(H=>{H.error=$;H.isLoading=false})}}}});if(i){p()}if(n){const v=()=>p();window.addEventListener("focus",v);this._unsubscribers.set(`focus:${e.join(":")}`,()=>window.removeEventListener("focus",v))}if(o){window.addEventListener("online",p);this._unsubscribers.set(`online:${e.join(":")}`,()=>window.removeEventListener("online",p))}if(c){const v=setInterval(p,c);this._unsubscribers.set(`interval:${e.join(":")}`,()=>clearInterval(v))}const N=setTimeout(()=>{Q.delete(e)},a);this._unsubscribers.set(`gc:${e.join(":")}`,()=>clearTimeout(N));return y}_isAllowedType(e){const t=["number","string","boolean","object","undefined"];const s=typeof e;if(s==="object"){return e===null||Array.isArray(e)||this._isPlainObject(e)}return t.includes(s)}_isPlainObject(e){if(Object.prototype.toString.call(e)!=="[object Object]"){return false}const t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}observableAttr(e,t=s=>s){let s=this.getAttribute(e);s=C(s,t);return this.observable(s,e)}setObservables(e){Object.keys(e).forEach(t=>{if(this[t]instanceof _){this[t].next(e[t])}})}registerObservables(e){this._unsubscribers.set(e,()=>e.dispose())}computed(e){const t=super.computed(e);this.registerObservables(t);return t}effect(e){const t=super.effect(e);this._unsubscribers.set(e,t)}connect(e,t){const s=this.observable(e.state[t],t);const n=e.subscribe(i=>{s.update(()=>i[t])});this._unsubscribers.set(t,n);if(this._isObjectOrArray(s.value)){return this._observableProxy(s)}else{return new Proxy(s,{get:()=>s.value,set:(i,o,c)=>{if(o==="value"){s.update(()=>c)}else{i[o]=c}return true}})}}connectedCallback(){this.react()}disconnectedCallback(){this._unsubscribers.forEach(e=>e());this._effects.forEach(({cleanup:e})=>e&&e())}react(){if(!this._isWithinBatch){const e=this.template();Xe(e,this);this._effects.forEach(({effectFn:t})=>t.call(this))}}template(){throw new Error("[Cami.js] You have to implement the method template()!")}batch(e){this._isWithinBatch=true;Promise.resolve().then(e).finally(()=>{this._isWithinBatch=false})}};function or(r,e){if(!customElements.get(r)){customElements.define(r,e)}}function cr(r){return new se(r)}function ar(r){Object.assign(ne,r)}export{_ as Observable,Oe as ObservableElement,T as ObservableState,se as ObservableStore,g as ObservableStream,it as ReactiveElement,ne as camiConfig,ar as config,or as define,ft as html,cr as store};
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
//# sourceMappingURL=cami.module.js.map
