var ct=Object.defineProperty;var Ee=Object.getOwnPropertySymbols;var at=Object.prototype.hasOwnProperty;var ut=Object.prototype.propertyIsEnumerable;var Ce=(t,e)=>{if(e=Symbol[t])return e;throw Error("Symbol."+t+" is not defined")};var Ne=(t,e,r)=>e in t?ct(t,e,{enumerable:true,configurable:true,writable:true,value:r}):t[e]=r;var De=(t,e)=>{for(var r in e||(e={}))if(at.call(e,r))Ne(t,r,e[r]);if(Ee)for(var r of Ee(e)){if(ut.call(e,r))Ne(t,r,e[r])}return t};var F=(t,e,r)=>{return new Promise((n,s)=>{var i=c=>{try{a(r.next(c))}catch(u){s(u)}};var o=c=>{try{a(r.throw(c))}catch(u){s(u)}};var a=c=>c.done?n(c.value):Promise.resolve(c.value).then(i,o);a((r=r.apply(t,e)).next())})};var ze=(t,e,r)=>(e=t[Ce("asyncIterator")])?e.call(t):(t=t[Ce("iterator")](),e={},r=(n,s)=>(s=t[n])&&(e[n]=i=>new Promise((o,a,c)=>(i=s.call(t,i),c=i.done,Promise.resolve(i.value).then(u=>o({value:u,done:c}),a)))),r("next"),r("return"),e);var k=globalThis;var Y=k.trustedTypes;var Oe=Y?Y.createPolicy("lit-html",{createHTML:t=>t}):void 0;var ke="$lit$";var A=`lit$${(Math.random()+"").slice(9)}$`;var Re="?"+A;var lt=`<${Re}>`;var w=document;var R=()=>w.createComment("");var W=t=>null===t||"object"!=typeof t&&"function"!=typeof t;var We=Array.isArray;var ft=t=>We(t)||"function"==typeof(t==null?void 0:t[Symbol.iterator]);var ae="[ 	\n\f\r]";var U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;var Me=/-->/g;var Te=/>/g;var $=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g");var Ie=/'/g;var He=/"/g;var Be=/^(?:script|style|textarea|title)$/i;var Le=t=>(e,...r)=>({_$litType$:t,strings:e,values:r});var ht=Le(1);var Et=Le(2);var B=Symbol.for("lit-noChange");var d=Symbol.for("lit-nothing");var Fe=new WeakMap;var v=w.createTreeWalker(w,129);function Ve(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==Oe?Oe.createHTML(e):e}var dt=(t,e)=>{const r=t.length-1,n=[];let s,i=2===e?"<svg>":"",o=U;for(let a=0;a<r;a++){const c=t[a];let u,f,l=-1,y=0;for(;y<c.length&&(o.lastIndex=y,f=o.exec(c),null!==f);)y=o.lastIndex,o===U?"!--"===f[1]?o=Me:void 0!==f[1]?o=Te:void 0!==f[2]?(Be.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=$):void 0!==f[3]&&(o=$):o===$?">"===f[0]?(o=s!=null?s:U,l=-1):void 0===f[1]?l=-2:(l=o.lastIndex-f[2].length,u=f[1],o=void 0===f[3]?$:'"'===f[3]?He:Ie):o===He||o===Ie?o=$:o===Me||o===Te?o=U:(o=$,s=void 0);const g=o===$&&t[a+1].startsWith("/>")?" ":"";i+=o===U?c+lt:l>=0?(n.push(u),c.slice(0,l)+ke+c.slice(l)+A+g):c+A+(-2===l?a:g)}return[Ve(t,i+(t[r]||"<?>")+(2===e?"</svg>":"")),n]};var L=class t{constructor({strings:e,_$litType$:r},n){let s;this.parts=[];let i=0,o=0;const a=e.length-1,c=this.parts,[u,f]=dt(e,r);if(this.el=t.createElement(u,n),v.currentNode=this.el.content,2===r){const l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;null!==(s=v.nextNode())&&c.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const l of s.getAttributeNames())if(l.endsWith(ke)){const y=f[o++],g=s.getAttribute(l).split(A),N=/([.?@])?(.*)/.exec(y);c.push({type:1,index:i,name:N[2],strings:g,ctor:"."===N[1]?fe:"?"===N[1]?he:"@"===N[1]?de:z}),s.removeAttribute(l)}else l.startsWith(A)&&(c.push({type:6,index:i}),s.removeAttribute(l));if(Be.test(s.tagName)){const l=s.textContent.split(A),y=l.length-1;if(y>0){s.textContent=Y?Y.emptyScript:"";for(let g=0;g<y;g++)s.append(l[g],R()),v.nextNode(),c.push({type:2,index:++i});s.append(l[y],R())}}}else if(8===s.nodeType)if(s.data===Re)c.push({type:2,index:i});else{let l=-1;for(;-1!==(l=s.data.indexOf(A,l+1));)c.push({type:7,index:i}),l+=A.length-1}i++}}static createElement(e,r){const n=w.createElement("template");return n.innerHTML=e,n}};function D(t,e,r=t,n){var o,a,c;if(e===B)return e;let s=void 0!==n?(o=r._$Co)==null?void 0:o[n]:r._$Cl;const i=W(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((a=s==null?void 0:s._$AO)==null?void 0:a.call(s,false),void 0===i?s=void 0:(s=new i(t),s._$AT(t,r,n)),void 0!==n?((c=r._$Co)!=null?c:r._$Co=[])[n]=s:r._$Cl=s),void 0!==s&&(e=D(t,s._$AS(t,e.values),s,n)),e}var le=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var u;const{el:{content:r},parts:n}=this._$AD,s=((u=e==null?void 0:e.creationScope)!=null?u:w).importNode(r,true);v.currentNode=s;let i=v.nextNode(),o=0,a=0,c=n[0];for(;void 0!==c;){if(o===c.index){let f;2===c.type?f=new V(i,i.nextSibling,this,e):1===c.type?f=new c.ctor(i,c.name,c.strings,this,e):6===c.type&&(f=new pe(i,this,e)),this._$AV.push(f),c=n[++a]}o!==(c==null?void 0:c.index)&&(i=v.nextNode(),o++)}return v.currentNode=w,s}p(e){let r=0;for(const n of this._$AV)void 0!==n&&(void 0!==n.strings?(n._$AI(e,n,r),r+=n.strings.length-2):n._$AI(e[r])),r++}};var V=class t{get _$AU(){var e,r;return(r=(e=this._$AM)==null?void 0:e._$AU)!=null?r:this._$Cv}constructor(e,r,n,s){var i;this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=n,this.options=s,this._$Cv=(i=s==null?void 0:s.isConnected)!=null?i:true}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return void 0!==r&&11===(e==null?void 0:e.nodeType)&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=D(this,e,r),W(e)?e===d||null==e||""===e?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):ft(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==d&&W(this._$AH)?this._$AA.nextSibling.data=e:this.$(w.createTextNode(e)),this._$AH=e}g(e){var i;const{values:r,_$litType$:n}=e,s="number"==typeof n?this._$AC(e):(void 0===n.el&&(n.el=L.createElement(Ve(n.h,n.h[0]),this.options)),n);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(r);else{const o=new le(s,this),a=o.u(this.options);o.p(r),this.$(a),this._$AH=o}}_$AC(e){let r=Fe.get(e.strings);return void 0===r&&Fe.set(e.strings,r=new L(e)),r}T(e){We(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let n,s=0;for(const i of e)s===r.length?r.push(n=new t(this.k(R()),this.k(R()),this,this.options)):n=r[s],n._$AI(i),s++;s<r.length&&(this._$AR(n&&n._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,r){var n;for((n=this._$AP)==null?void 0:n.call(this,false,true,r);e&&e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var r;void 0===this._$AM&&(this._$Cv=e,(r=this._$AP)==null?void 0:r.call(this,e))}};var z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,n,s,i){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=r,this._$AM=s,this.options=i,n.length>2||""!==n[0]||""!==n[1]?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=d}_$AI(e,r=this,n,s){const i=this.strings;let o=false;if(void 0===i)e=D(this,e,r,0),o=!W(e)||e!==this._$AH&&e!==B,o&&(this._$AH=e);else{const a=e;let c,u;for(e=i[0],c=0;c<i.length-1;c++)u=D(this,a[n+c],r,c),u===B&&(u=this._$AH[c]),o||(o=!W(u)||u!==this._$AH[c]),u===d?e=d:e!==d&&(e+=(u!=null?u:"")+i[c+1]),this._$AH[c]=u}o&&!s&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}};var fe=class extends z{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}};var he=class extends z{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}};var de=class extends z{constructor(e,r,n,s,i){super(e,r,n,s,i),this.type=5}_$AI(e,r=this){var o;if((e=(o=D(this,e,r,0))!=null?o:d)===B)return;const n=this._$AH,s=e===d&&n!==d||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==d&&(n===d||s);s&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r,n;"function"==typeof this._$AH?this._$AH.call((n=(r=this.options)==null?void 0:r.host)!=null?n:this.element,e):this._$AH.handleEvent(e)}};var pe=class{constructor(e,r,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){D(this,e)}};var ue=k.litHtmlPolyfillSupport;var Ue;ue==null?void 0:ue(L,V),((Ue=k.litHtmlVersions)!=null?Ue:k.litHtmlVersions=[]).push("3.0.0");var je=(t,e,r)=>{var i,o;const n=(i=r==null?void 0:r.renderBefore)!=null?i:e;let s=n._$litPart$;if(void 0===s){const a=(o=r==null?void 0:r.renderBefore)!=null?o:null;n._$litPart$=s=new V(e.insertBefore(R(),a),a,void 0,r!=null?r:{})}return s._$AI(t),s};var Je=Symbol.for("immer-nothing");var Xe=Symbol.for("immer-draftable");var _=Symbol.for("immer-state");var pt=true?[function(t){return`The plugin for '${t}' has not been loaded into Immer. To enable the plugin, import and call \`enable${t}()\` when initializing your application.`},function(t){return`produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${t}'`},"This object has been frozen and should not be mutated",function(t){return"Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+t},"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.","Immer forbids circular references","The first or second argument to `produce` must be a function","The third argument to `produce` must be a function or undefined","First argument to `createDraft` must be a plain object, an array, or an immerable object","First argument to `finishDraft` must be a draft returned by `createDraft`",function(t){return`'current' expects a draft, got: ${t}`},"Object.defineProperty() cannot be used on an Immer draft","Object.setPrototypeOf() cannot be used on an Immer draft","Immer only supports deleting array indices","Immer only supports setting array indices and the 'length' property",function(t){return`'original' expects a draft, got: ${t}`}]:[];function p(t,...e){if(true){const r=pt[t];const n=typeof r==="function"?r.apply(null,e):r;throw new Error(`[Immer] ${n}`)}throw new Error(`[Immer] minified error nr: ${t}. Full error at: https://bit.ly/3cXEKWf`)}var O=Object.getPrototypeOf;function M(t){return!!t&&!!t[_]}function S(t){var e;if(!t)return false;return Ye(t)||Array.isArray(t)||!!t[Xe]||!!((e=t.constructor)==null?void 0:e[Xe])||re(t)||ne(t)}var _t=Object.prototype.constructor.toString();function Ye(t){if(!t||typeof t!=="object")return false;const e=O(t);if(e===null){return true}const r=Object.hasOwnProperty.call(e,"constructor")&&e.constructor;if(r===Object)return true;return typeof r=="function"&&Function.toString.call(r)===_t}function j(t,e){if(te(t)===0){Object.entries(t).forEach(([r,n])=>{e(r,n,t)})}else{t.forEach((r,n)=>e(n,r,t))}}function te(t){const e=t[_];return e?e.type_:Array.isArray(t)?1:re(t)?2:ne(t)?3:0}function ye(t,e){return te(t)===2?t.has(e):Object.prototype.hasOwnProperty.call(t,e)}function Ze(t,e,r){const n=te(t);if(n===2)t.set(e,r);else if(n===3){t.add(r)}else t[e]=r}function mt(t,e){if(t===e){return t!==0||1/t===1/e}else{return t!==t&&e!==e}}function re(t){return t instanceof Map}function ne(t){return t instanceof Set}function x(t){return t.copy_||t.base_}function be(t,e){if(re(t)){return new Map(t)}if(ne(t)){return new Set(t)}if(Array.isArray(t))return Array.prototype.slice.call(t);if(!e&&Ye(t)){if(!O(t)){const s=Object.create(null);return Object.assign(s,t)}return De({},t)}const r=Object.getOwnPropertyDescriptors(t);delete r[_];let n=Reflect.ownKeys(r);for(let s=0;s<n.length;s++){const i=n[s];const o=r[i];if(o.writable===false){o.writable=true;o.configurable=true}if(o.get||o.set)r[i]={configurable:true,writable:true,enumerable:o.enumerable,value:t[i]}}return Object.create(O(t),r)}function we(t,e=false){if(se(t)||M(t)||!S(t))return t;if(te(t)>1){t.set=t.add=t.clear=t.delete=yt}Object.freeze(t);if(e)j(t,(r,n)=>we(n,true),true);return t}function yt(){p(2)}function se(t){return Object.isFrozen(t)}var bt={};function P(t){const e=bt[t];if(!e){p(0,t)}return e}var X;function et(){return X}function gt(t,e){return{drafts_:[],parent_:t,immer_:e,canAutoFreeze_:true,unfinalizedDrafts_:0}}function qe(t,e){if(e){P("Patches");t.patches_=[];t.inversePatches_=[];t.patchListener_=e}}function ge(t){Ae(t);t.drafts_.forEach(At);t.drafts_=null}function Ae(t){if(t===X){X=t.parent_}}function Qe(t){return X=gt(X,t)}function At(t){const e=t[_];if(e.type_===0||e.type_===1)e.revoke_();else e.revoked_=true}function Ge(t,e){e.unfinalizedDrafts_=e.drafts_.length;const r=e.drafts_[0];const n=t!==void 0&&t!==r;if(n){if(r[_].modified_){ge(e);p(4)}if(S(t)){t=Z(e,t);if(!e.parent_)ee(e,t)}if(e.patches_){P("Patches").generateReplacementPatches_(r[_].base_,t,e.patches_,e.inversePatches_)}}else{t=Z(e,r,[])}ge(e);if(e.patches_){e.patchListener_(e.patches_,e.inversePatches_)}return t!==Je?t:void 0}function Z(t,e,r){if(se(e))return e;const n=e[_];if(!n){j(e,(s,i)=>Ke(t,n,e,s,i,r),true);return e}if(n.scope_!==t)return e;if(!n.modified_){ee(t,n.base_,true);return n.base_}if(!n.finalized_){n.finalized_=true;n.scope_.unfinalizedDrafts_--;const s=n.copy_;let i=s;let o=false;if(n.type_===3){i=new Set(s);s.clear();o=true}j(i,(a,c)=>Ke(t,n,s,a,c,r,o));ee(t,s,false);if(r&&t.patches_){P("Patches").generatePatches_(n,r,t.patches_,t.inversePatches_)}}return n.copy_}function Ke(t,e,r,n,s,i,o){if(s===r)p(5);if(M(s)){const a=i&&e&&e.type_!==3&&!ye(e.assigned_,n)?i.concat(n):void 0;const c=Z(t,s,a);Ze(r,n,c);if(M(c)){t.canAutoFreeze_=false}else return}else if(o){r.add(s)}if(S(s)&&!se(s)){if(!t.immer_.autoFreeze_&&t.unfinalizedDrafts_<1){return}Z(t,s);if(!e||!e.scope_.parent_)ee(t,s)}}function ee(t,e,r=false){if(!t.parent_&&t.immer_.autoFreeze_&&t.canAutoFreeze_){we(e,r)}}function $t(t,e){const r=Array.isArray(t);const n={type_:r?1:0,scope_:e?e.scope_:et(),modified_:false,finalized_:false,assigned_:{},parent_:e,base_:t,draft_:null,copy_:null,revoke_:null,isManual_:false};let s=n;let i=xe;if(r){s=[n];i=q}const{revoke:o,proxy:a}=Proxy.revocable(s,i);n.draft_=a;n.revoke_=o;return a}var xe={get(t,e){if(e===_)return t;const r=x(t);if(!ye(r,e)){return vt(t,r,e)}const n=r[e];if(t.finalized_||!S(n)){return n}if(n===_e(t.base_,e)){me(t);return t.copy_[e]=ve(n,t)}return n},has(t,e){return e in x(t)},ownKeys(t){return Reflect.ownKeys(x(t))},set(t,e,r){const n=tt(x(t),e);if(n==null?void 0:n.set){n.set.call(t.draft_,r);return true}if(!t.modified_){const s=_e(x(t),e);const i=s==null?void 0:s[_];if(i&&i.base_===r){t.copy_[e]=r;t.assigned_[e]=false;return true}if(mt(r,s)&&(r!==void 0||ye(t.base_,e)))return true;me(t);$e(t)}if(t.copy_[e]===r&&(r!==void 0||e in t.copy_)||Number.isNaN(r)&&Number.isNaN(t.copy_[e]))return true;t.copy_[e]=r;t.assigned_[e]=true;return true},deleteProperty(t,e){if(_e(t.base_,e)!==void 0||e in t.base_){t.assigned_[e]=false;me(t);$e(t)}else{delete t.assigned_[e]}if(t.copy_){delete t.copy_[e]}return true},getOwnPropertyDescriptor(t,e){const r=x(t);const n=Reflect.getOwnPropertyDescriptor(r,e);if(!n)return n;return{writable:true,configurable:t.type_!==1||e!=="length",enumerable:n.enumerable,value:r[e]}},defineProperty(){p(11)},getPrototypeOf(t){return O(t.base_)},setPrototypeOf(){p(12)}};var q={};j(xe,(t,e)=>{q[t]=function(){arguments[0]=arguments[0][0];return e.apply(this,arguments)}});q.deleteProperty=function(t,e){if(isNaN(parseInt(e)))p(13);return q.set.call(this,t,e,void 0)};q.set=function(t,e,r){if(e!=="length"&&isNaN(parseInt(e)))p(14);return xe.set.call(this,t[0],e,r,t[0])};function _e(t,e){const r=t[_];const n=r?x(r):t;return n[e]}function vt(t,e,r){var s;const n=tt(e,r);return n?`value`in n?n.value:(s=n.get)==null?void 0:s.call(t.draft_):void 0}function tt(t,e){if(!(e in t))return void 0;let r=O(t);while(r){const n=Object.getOwnPropertyDescriptor(r,e);if(n)return n;r=O(r)}return void 0}function $e(t){if(!t.modified_){t.modified_=true;if(t.parent_){$e(t.parent_)}}}function me(t){if(!t.copy_){t.copy_=be(t.base_,t.scope_.immer_.useStrictShallowCopy_)}}var wt=class{constructor(t){this.autoFreeze_=true;this.useStrictShallowCopy_=false;this.produce=(e,r,n)=>{if(typeof e==="function"&&typeof r!=="function"){const i=r;r=e;const o=this;return function a(c=i,...u){return o.produce(c,f=>r.call(this,f,...u))}}if(typeof r!=="function")p(6);if(n!==void 0&&typeof n!=="function")p(7);let s;if(S(e)){const i=Qe(this);const o=ve(e,void 0);let a=true;try{s=r(o);a=false}finally{if(a)ge(i);else Ae(i)}qe(i,n);return Ge(s,i)}else if(!e||typeof e!=="object"){s=r(e);if(s===void 0)s=e;if(s===Je)s=void 0;if(this.autoFreeze_)we(s,true);if(n){const i=[];const o=[];P("Patches").generateReplacementPatches_(e,s,i,o);n(i,o)}return s}else p(1,e)};this.produceWithPatches=(e,r)=>{if(typeof e==="function"){return(o,...a)=>this.produceWithPatches(o,c=>e(c,...a))}let n,s;const i=this.produce(e,r,(o,a)=>{n=o;s=a});return[i,n,s]};if(typeof(t==null?void 0:t.autoFreeze)==="boolean")this.setAutoFreeze(t.autoFreeze);if(typeof(t==null?void 0:t.useStrictShallowCopy)==="boolean")this.setUseStrictShallowCopy(t.useStrictShallowCopy)}createDraft(t){if(!S(t))p(8);if(M(t))t=xt(t);const e=Qe(this);const r=ve(t,void 0);r[_].isManual_=true;Ae(e);return r}finishDraft(t,e){const r=t&&t[_];if(!r||!r.isManual_)p(9);const{scope_:n}=r;qe(n,e);return Ge(void 0,n)}setAutoFreeze(t){this.autoFreeze_=t}setUseStrictShallowCopy(t){this.useStrictShallowCopy_=t}applyPatches(t,e){let r;for(r=e.length-1;r>=0;r--){const s=e[r];if(s.path.length===0&&s.op==="replace"){t=s.value;break}}if(r>-1){e=e.slice(r+1)}const n=P("Patches").applyPatches_;if(M(t)){return n(t,e)}return this.produce(t,s=>n(s,e))}};function ve(t,e){const r=re(t)?P("MapSet").proxyMap_(t,e):ne(t)?P("MapSet").proxySet_(t,e):$t(t,e);const n=e?e.scope_:et();n.drafts_.push(r);return r}function xt(t){if(!M(t))p(10,t);return rt(t)}function rt(t){if(!S(t)||se(t))return t;const e=t[_];let r;if(e){if(!e.modified_)return e.base_;e.finalized_=true;r=be(t,e.scope_.immer_.useStrictShallowCopy_)}else{r=be(t,true)}j(r,(n,s)=>{Ze(r,n,rt(s))});if(e){e.finalized_=false}return r}var m=new wt;var E=m.produce;var Nt=m.produceWithPatches.bind(m);var Dt=m.setAutoFreeze.bind(m);var zt=m.setUseStrictShallowCopy.bind(m);var Ot=m.applyPatches.bind(m);var Mt=m.createDraft.bind(m);var Tt=m.finishDraft.bind(m);var Se=class{constructor(e){if(typeof e==="function"){this.observer={next:e}}else{this.observer=e}this.teardowns=[];if(typeof AbortController!=="undefined"){this.controller=new AbortController;this.signal=this.controller.signal}}next(e){if(this.observer.next){this.observer.next(e)}}complete(){if(this.observer.complete){this.observer.complete()}else if(typeof this.observer.next==="function"){this.observer.next({complete:true})}this.unsubscribe()}error(e){if(this.observer.error){this.observer.error(e)}else if(typeof this.observer.next==="function"){this.observer.next({error:e})}this.unsubscribe()}addTeardown(e){this.teardowns.push(e)}unsubscribe(){if(this.controller){this.controller.abort()}this.teardowns.forEach(e=>e())}};var C=class{constructor(e){this._observers=[];this.subscribeCallback=e}subscribe(e=()=>{}){const r=new Se(e);const n=this.subscribeCallback(r);r.addTeardown(n);this._observers.push(r);return{unsubscribe:()=>r.unsubscribe(),complete:()=>r.complete(),error:s=>r.error(s)}}};var Q=class t extends C{static from(e){if(e instanceof C){return new t(r=>{const n=e.subscribe({next:s=>r.next(s),error:s=>r.error(s),complete:()=>r.complete()});return()=>{if(!n.closed){n.unsubscribe()}}})}else if(e[Symbol.asyncIterator]){return new t(r=>{let n=false;(()=>F(this,null,function*(){try{try{for(var s=ze(e),i,o,a;i=!(o=yield s.next()).done;i=false){const c=o.value;if(n)return;r.next(c)}}catch(o){a=[o]}finally{try{i&&(o=s.return)&&(yield o.call(s))}finally{if(a)throw a[0]}}r.complete()}catch(c){r.error(c)}}))();return()=>{n=true}})}else if(e[Symbol.iterator]){return new t(r=>{try{for(const n of e){r.next(n)}r.complete()}catch(n){r.error(n)}return()=>{if(!subscription.closed){subscription.unsubscribe()}}})}else if(e instanceof Promise){return new t(r=>{e.then(n=>{r.next(n);r.complete()},n=>r.error(n));return()=>{}})}else{throw new TypeError("ObservableStream.from requires an Observable, AsyncIterable, Iterable, or Promise")}}map(e){return new t(r=>{const n=this.subscribe({next:s=>r.next(e(s)),error:s=>r.error(s),complete:()=>r.complete()});return()=>n.unsubscribe()})}filter(e){return new t(r=>{const n=this.subscribe({next:s=>{if(e(s)){r.next(s)}},error:s=>r.error(s),complete:()=>r.complete()});return()=>n.unsubscribe()})}reduce(e,r){return new Promise((n,s)=>{let i=r;const o=this.subscribe({next:a=>{i=e(i,a)},error:a=>s(a),complete:()=>n(i)});return()=>o.unsubscribe()})}takeUntil(e){return new t(r=>{const n=this.subscribe({next:i=>r.next(i),error:i=>r.error(i),complete:()=>r.complete()});const s=e.subscribe({next:()=>{r.complete();n.unsubscribe();s.unsubscribe()},error:i=>r.error(i)});return()=>{n.unsubscribe();s.unsubscribe()}})}take(e){return new t(r=>{let n=0;const s=this.subscribe({next:i=>{if(n++<e){r.next(i)}else{r.complete();s.unsubscribe()}},error:i=>r.error(i),complete:()=>r.complete()});return()=>s.unsubscribe()})}drop(e){return new t(r=>{let n=0;const s=this.subscribe({next:i=>{if(n++>=e){r.next(i)}},error:i=>r.error(i),complete:()=>r.complete()});return()=>s.unsubscribe()})}flatMap(e){return new t(r=>{const n=new Set;const s=this.subscribe({next:i=>{const o=e(i);const a=o.subscribe({next:c=>r.next(c),error:c=>r.error(c),complete:()=>{n.delete(a);if(n.size===0){r.complete()}}});n.add(a)},error:i=>r.error(i),complete:()=>{if(n.size===0){r.complete()}}});return()=>{s.unsubscribe();n.forEach(i=>i.unsubscribe())}})}switchMap(e){return new t(r=>{let n=null;const s=this.subscribe({next:i=>{if(n){n.unsubscribe()}const o=e(i);n=o.subscribe({next:a=>r.next(a),error:a=>r.error(a),complete:()=>{if(n){n.unsubscribe();n=null}}})},error:i=>r.error(i),complete:()=>{if(n){n.unsubscribe()}r.complete()}});return()=>{s.unsubscribe();if(n){n.unsubscribe()}}})}toArray(){return new Promise((e,r)=>{const n=[];this.subscribe({next:s=>n.push(s),error:s=>r(s),complete:()=>e(n)})})}forEach(e){return new Promise((r,n)=>{this.subscribe({next:s=>e(s),error:s=>n(s),complete:()=>r()})})}every(e){return new Promise((r,n)=>{let s=true;this.subscribe({next:i=>{if(!e(i)){s=false;r(false)}},error:i=>n(i),complete:()=>r(s)})})}find(e){return new Promise((r,n)=>{const s=this.subscribe({next:i=>{if(e(i)){r(i);s.unsubscribe()}},error:i=>n(i),complete:()=>r(void 0)})})}some(e){return new Promise((r,n)=>{const s=this.subscribe({next:i=>{if(e(i)){r(true);s.unsubscribe()}},error:i=>n(i),complete:()=>r(false)})})}finally(e){return new t(r=>{const n=this.subscribe({next:s=>r.next(s),error:s=>{e();r.error(s)},complete:()=>{e();r.complete()}});return()=>{n.unsubscribe()}})}};var Pe=class extends Q{constructor(e){super();if(typeof e==="string"){this.element=document.querySelector(e);if(!this.element){throw new Error(`Element not found for selector: ${e}`)}}else if(e instanceof Element||e instanceof Document){this.element=e}else{throw new Error(`Invalid argument: ${e}`)}}on(e,r={}){return new Q(n=>{const s=i=>{n.next(i)};this.element.addEventListener(e,s,r);return()=>{this.element.removeEventListener(e,s,r)}})}};var G=class extends C{constructor(e=null,r=null,{last:n=false}={}){super(s=>{return()=>{}});if(n){this._lastObserver=r}else{this._observers.push(r)}this._value=E(e,s=>{});this._pendingUpdates=[];this._updateScheduled=false}get value(){if(K.isComputing!=null){K.isComputing.addDependency(this)}return this._value}update(e){this._pendingUpdates.push(e);if(!this._updateScheduled){this._updateScheduled=true;requestAnimationFrame(this._applyUpdates.bind(this))}}notifyObservers(){const e=[...this._observers,this._lastObserver];e.forEach(r=>{if(r&&typeof r==="function"){r(this._value)}else if(r&&r.next){r.next(this._value)}})}_applyUpdates(){let e=this._value;while(this._pendingUpdates.length>0){const r=this._pendingUpdates.shift();this._value=E(this._value,r)}if(e!==this._value){this.notifyObservers()}this._updateScheduled=false}};var K=class t extends G{constructor(e,r){super(null);this.computeFn=e;this.context=r;this.dependencies=new Set;this.children=new Set;this.subscriptions=new Map;this.compute()}get value(){t.isComputing=this;const e=this.computeFn.call(this.context);t.isComputing=null;return e}compute(){this.notifyChildren();this._value=this.computeFn.call(this.context);this.notifyObservers()}addDependency(e){if(!this.dependencies.has(e)){const r=e.subscribe(()=>this.compute());this.dependencies.add(e);this.subscriptions.set(e,r);if(e instanceof t){e.addChild(this)}}}dispose(){this.notifyChildren();this.dependencies.forEach(e=>{const r=this.subscriptions.get(e);if(r){r.unsubscribe()}this.dependencies.delete(e);this.subscriptions.delete(e);if(e instanceof t){e.removeChild(this)}})}addChild(e){this.children.add(e)}removeChild(e){this.children.delete(e)}notifyChildren(){this.children.forEach(e=>{e.dispose()});this.children.clear()}};var nt=function(t){return new K(t,this)};var st=function(t){this._isWithinBatch=true;Promise.resolve().then(t).finally(()=>{this._isWithinBatch=false;this.react()})};var it=function(t){let e=()=>{};const r=()=>{e();e=t.call(this)||(()=>{})};this._effects.push({effectFn:r,cleanup:e})};var ie=null;var St=t=>{if(ie){return ie}let e=t;let r=[];let n={};let s=[];let i=[];let o=false;const a=window["__REDUX_DEVTOOLS_EXTENSION__"]&&window["__REDUX_DEVTOOLS_EXTENSION__"].connect();const c=h=>{s.push(h)};const u=h=>{r.push(h);return()=>{const b=r.indexOf(h);if(b>-1){r.splice(b,1)}}};const f=(h,b)=>{if(n[h]){throw new Error(`Action type ${h} is already registered.`)}n[h]=b};const l=()=>F(void 0,null,function*(){if(i.length===0){o=false;return}o=true;const{action:h,payload:b}=i.shift();const T=n[h];if(!T){console.warn(`No reducer found for action ${h}`);return}const I={getState:()=>e,dispatch:(H,ce)=>y(H,ce)};const oe=s.map(H=>H(I));const J=oe.reduce((H,ce)=>ce(H),g);yield J(h,b);l()});const y=(h,b)=>{i.push({action:h,payload:b});if(!o){l()}};const g=(h,b)=>F(void 0,null,function*(){let T;let I=null;T=E(e,oe=>{const J=n[h](oe,b);if(J instanceof Promise){I=J;return}});if(I){yield I}e=T;N(h);return T});const N=h=>{for(const b of r){b(e,h)}a&&a.send(h,e)};ie={state:e,subscribe:u,register:f,dispatch:y,use:c};return ie};var ot=class extends HTMLElement{constructor(){super();this._unsubscribers=new Map;this.store=null;this._effects=[];this._isWithinBatch=false;this.computed=nt.bind(this);this.batch=st.bind(this);this.effect=it.bind(this)}observable(e){const r=new G(e,{next:this.react.bind(this),complete:this.react.bind(this),error:this.react.bind(this)},{last:true});return r}observableAttr(e,r=n=>n){let n=this.getAttribute(e);n=E(n,r);return this.observable(n)}setObservables(e){Object.keys(e).forEach(r=>{if(this[r]instanceof C){this[r].next(e[r])}})}subscribe(e,r){this.store=e;const n=this.observable(e.state[r]);const s=e.subscribe(i=>{this[r].update(()=>i[r])});this._unsubscribers.set(r,s);return n}dispatch(e,r){this.store.dispatch(e,r)}connectedCallback(){this.react()}disconnectedCallback(){this._unsubscribers.forEach(e=>e());this._effects.forEach(({cleanup:e})=>e&&e())}react(){if(!this._isWithinBatch){const e=this.template();je(e,this);this._effects.forEach(({effectFn:r})=>r.call(this))}}template(){throw new Error("You have to implement the method template()!")}};function Qt(t,e){if(!customElements.get(t)){customElements.define(t,e)}}export{C as Observable,Pe as ObservableElement,G as ObservableState,Q as ObservableStream,ot as ReactiveElement,Qt as define,ht as html,St as store};
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
