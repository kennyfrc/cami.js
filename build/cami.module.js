var rt=Object.defineProperty;var Pe=Object.getOwnPropertySymbols;var nt=Object.prototype.hasOwnProperty;var st=Object.prototype.propertyIsEnumerable;var oe=(t,e,r)=>e in t?rt(t,e,{enumerable:true,configurable:true,writable:true,value:r}):t[e]=r;var Ce=(t,e)=>{for(var r in e||(e={}))if(nt.call(e,r))oe(t,r,e[r]);if(Pe)for(var r of Pe(e)){if(st.call(e,r))oe(t,r,e[r])}return t};var K=(t,e,r)=>{oe(t,typeof e!=="symbol"?e+"":e,r);return r};var ce=(t,e,r)=>{return new Promise((n,s)=>{var i=c=>{try{a(r.next(c))}catch(h){s(h)}};var o=c=>{try{a(r.throw(c))}catch(h){s(h)}};var a=c=>c.done?n(c.value):Promise.resolve(c.value).then(i,o);a((r=r.apply(t,e)).next())})};var I=globalThis;var q=I.trustedTypes;var Ne=q?q.createPolicy("lit-html",{createHTML:t=>t}):void 0;var Fe="$lit$";var $=`lit$${(Math.random()+"").slice(9)}$`;var Ie="?"+$;var it=`<${Ie}>`;var w=document;var U=()=>w.createComment("");var R=t=>null===t||"object"!=typeof t&&"function"!=typeof t;var Ue=Array.isArray;var ot=t=>Ue(t)||"function"==typeof(t==null?void 0:t[Symbol.iterator]);var ae="[ 	\n\f\r]";var F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;var Oe=/-->/g;var De=/>/g;var b=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g");var Me=/'/g;var ze=/"/g;var Re=/^(?:script|style|textarea|title)$/i;var ke=t=>(e,...r)=>({_$litType$:t,strings:e,values:r});var ct=ke(1);var St=ke(2);var k=Symbol.for("lit-noChange");var d=Symbol.for("lit-nothing");var Te=new WeakMap;var v=w.createTreeWalker(w,129);function We(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==Ne?Ne.createHTML(e):e}var at=(t,e)=>{const r=t.length-1,n=[];let s,i=2===e?"<svg>":"",o=F;for(let a=0;a<r;a++){const c=t[a];let h,l,u=-1,m=0;for(;m<c.length&&(o.lastIndex=m,l=o.exec(c),null!==l);)m=o.lastIndex,o===F?"!--"===l[1]?o=Oe:void 0!==l[1]?o=De:void 0!==l[2]?(Re.test(l[2])&&(s=RegExp("</"+l[2],"g")),o=b):void 0!==l[3]&&(o=b):o===b?">"===l[0]?(o=s!=null?s:F,u=-1):void 0===l[1]?u=-2:(u=o.lastIndex-l[2].length,h=l[1],o=void 0===l[3]?b:'"'===l[3]?ze:Me):o===ze||o===Me?o=b:o===Oe||o===De?o=F:(o=b,s=void 0);const A=o===b&&t[a+1].startsWith("/>")?" ":"";i+=o===F?c+it:u>=0?(n.push(h),c.slice(0,u)+Fe+c.slice(u)+$+A):c+$+(-2===u?a:A)}return[We(t,i+(t[r]||"<?>")+(2===e?"</svg>":"")),n]};var W=class t{constructor({strings:e,_$litType$:r},n){let s;this.parts=[];let i=0,o=0;const a=e.length-1,c=this.parts,[h,l]=at(e,r);if(this.el=t.createElement(h,n),v.currentNode=this.el.content,2===r){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;null!==(s=v.nextNode())&&c.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Fe)){const m=l[o++],A=s.getAttribute(u).split($),C=/([.?@])?(.*)/.exec(m);c.push({type:1,index:i,name:C[2],strings:A,ctor:"."===C[1]?le:"?"===C[1]?fe:"@"===C[1]?de:O}),s.removeAttribute(u)}else u.startsWith($)&&(c.push({type:6,index:i}),s.removeAttribute(u));if(Re.test(s.tagName)){const u=s.textContent.split($),m=u.length-1;if(m>0){s.textContent=q?q.emptyScript:"";for(let A=0;A<m;A++)s.append(u[A],U()),v.nextNode(),c.push({type:2,index:++i});s.append(u[m],U())}}}else if(8===s.nodeType)if(s.data===Ie)c.push({type:2,index:i});else{let u=-1;for(;-1!==(u=s.data.indexOf($,u+1));)c.push({type:7,index:i}),u+=$.length-1}i++}}static createElement(e,r){const n=w.createElement("template");return n.innerHTML=e,n}};function N(t,e,r=t,n){var o,a,c;if(e===k)return e;let s=void 0!==n?(o=r._$Co)==null?void 0:o[n]:r._$Cl;const i=R(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((a=s==null?void 0:s._$AO)==null?void 0:a.call(s,false),void 0===i?s=void 0:(s=new i(t),s._$AT(t,r,n)),void 0!==n?((c=r._$Co)!=null?c:r._$Co=[])[n]=s:r._$Cl=s),void 0!==s&&(e=N(t,s._$AS(t,e.values),s,n)),e}var he=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var h;const{el:{content:r},parts:n}=this._$AD,s=((h=e==null?void 0:e.creationScope)!=null?h:w).importNode(r,true);v.currentNode=s;let i=v.nextNode(),o=0,a=0,c=n[0];for(;void 0!==c;){if(o===c.index){let l;2===c.type?l=new B(i,i.nextSibling,this,e):1===c.type?l=new c.ctor(i,c.name,c.strings,this,e):6===c.type&&(l=new pe(i,this,e)),this._$AV.push(l),c=n[++a]}o!==(c==null?void 0:c.index)&&(i=v.nextNode(),o++)}return v.currentNode=w,s}p(e){let r=0;for(const n of this._$AV)void 0!==n&&(void 0!==n.strings?(n._$AI(e,n,r),r+=n.strings.length-2):n._$AI(e[r])),r++}};var B=class t{get _$AU(){var e,r;return(r=(e=this._$AM)==null?void 0:e._$AU)!=null?r:this._$Cv}constructor(e,r,n,s){var i;this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=n,this.options=s,this._$Cv=(i=s==null?void 0:s.isConnected)!=null?i:true}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return void 0!==r&&11===(e==null?void 0:e.nodeType)&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=N(this,e,r),R(e)?e===d||null==e||""===e?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==k&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):ot(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==d&&R(this._$AH)?this._$AA.nextSibling.data=e:this.$(w.createTextNode(e)),this._$AH=e}g(e){var i;const{values:r,_$litType$:n}=e,s="number"==typeof n?this._$AC(e):(void 0===n.el&&(n.el=W.createElement(We(n.h,n.h[0]),this.options)),n);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(r);else{const o=new he(s,this),a=o.u(this.options);o.p(r),this.$(a),this._$AH=o}}_$AC(e){let r=Te.get(e.strings);return void 0===r&&Te.set(e.strings,r=new W(e)),r}T(e){Ue(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let n,s=0;for(const i of e)s===r.length?r.push(n=new t(this.k(U()),this.k(U()),this,this.options)):n=r[s],n._$AI(i),s++;s<r.length&&(this._$AR(n&&n._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,r){var n;for((n=this._$AP)==null?void 0:n.call(this,false,true,r);e&&e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var r;void 0===this._$AM&&(this._$Cv=e,(r=this._$AP)==null?void 0:r.call(this,e))}};var O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,n,s,i){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=r,this._$AM=s,this.options=i,n.length>2||""!==n[0]||""!==n[1]?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=d}_$AI(e,r=this,n,s){const i=this.strings;let o=false;if(void 0===i)e=N(this,e,r,0),o=!R(e)||e!==this._$AH&&e!==k,o&&(this._$AH=e);else{const a=e;let c,h;for(e=i[0],c=0;c<i.length-1;c++)h=N(this,a[n+c],r,c),h===k&&(h=this._$AH[c]),o||(o=!R(h)||h!==this._$AH[c]),h===d?e=d:e!==d&&(e+=(h!=null?h:"")+i[c+1]),this._$AH[c]=h}o&&!s&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}};var le=class extends O{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}};var fe=class extends O{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}};var de=class extends O{constructor(e,r,n,s,i){super(e,r,n,s,i),this.type=5}_$AI(e,r=this){var o;if((e=(o=N(this,e,r,0))!=null?o:d)===k)return;const n=this._$AH,s=e===d&&n!==d||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==d&&(n===d||s);s&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r,n;"function"==typeof this._$AH?this._$AH.call((n=(r=this.options)==null?void 0:r.host)!=null?n:this.element,e):this._$AH.handleEvent(e)}};var pe=class{constructor(e,r,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}};var ue=I.litHtmlPolyfillSupport;var He;ue==null?void 0:ue(W,B),((He=I.litHtmlVersions)!=null?He:I.litHtmlVersions=[]).push("3.0.0");var Be=(t,e,r)=>{var i,o;const n=(i=r==null?void 0:r.renderBefore)!=null?i:e;let s=n._$litPart$;if(void 0===s){const a=(o=r==null?void 0:r.renderBefore)!=null?o:null;n._$litPart$=s=new B(e.insertBefore(U(),a),a,void 0,r!=null?r:{})}return s._$AI(t),s};var Ge=Symbol.for("immer-nothing");var Le=Symbol.for("immer-draftable");var _=Symbol.for("immer-state");var ut=true?[function(t){return`The plugin for '${t}' has not been loaded into Immer. To enable the plugin, import and call \`enable${t}()\` when initializing your application.`},function(t){return`produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${t}'`},"This object has been frozen and should not be mutated",function(t){return"Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+t},"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.","Immer forbids circular references","The first or second argument to `produce` must be a function","The third argument to `produce` must be a function or undefined","First argument to `createDraft` must be a plain object, an array, or an immerable object","First argument to `finishDraft` must be a draft returned by `createDraft`",function(t){return`'current' expects a draft, got: ${t}`},"Object.defineProperty() cannot be used on an Immer draft","Object.setPrototypeOf() cannot be used on an Immer draft","Immer only supports deleting array indices","Immer only supports setting array indices and the 'length' property",function(t){return`'original' expects a draft, got: ${t}`}]:[];function p(t,...e){if(true){const r=ut[t];const n=typeof r==="function"?r.apply(null,e):r;throw new Error(`[Immer] ${n}`)}throw new Error(`[Immer] minified error nr: ${t}. Full error at: https://bit.ly/3cXEKWf`)}var D=Object.getPrototypeOf;function M(t){return!!t&&!!t[_]}function S(t){var e;if(!t)return false;return Ke(t)||Array.isArray(t)||!!t[Le]||!!((e=t.constructor)==null?void 0:e[Le])||ee(t)||te(t)}var ht=Object.prototype.constructor.toString();function Ke(t){if(!t||typeof t!=="object")return false;const e=D(t);if(e===null){return true}const r=Object.hasOwnProperty.call(e,"constructor")&&e.constructor;if(r===Object)return true;return typeof r=="function"&&Function.toString.call(r)===ht}function L(t,e){if(Z(t)===0){Object.entries(t).forEach(([r,n])=>{e(r,n,t)})}else{t.forEach((r,n)=>e(n,r,t))}}function Z(t){const e=t[_];return e?e.type_:Array.isArray(t)?1:ee(t)?2:te(t)?3:0}function me(t,e){return Z(t)===2?t.has(e):Object.prototype.hasOwnProperty.call(t,e)}function qe(t,e,r){const n=Z(t);if(n===2)t.set(e,r);else if(n===3){t.add(r)}else t[e]=r}function lt(t,e){if(t===e){return t!==0||1/t===1/e}else{return t!==t&&e!==e}}function ee(t){return t instanceof Map}function te(t){return t instanceof Set}function x(t){return t.copy_||t.base_}function ge(t,e){if(ee(t)){return new Map(t)}if(te(t)){return new Set(t)}if(Array.isArray(t))return Array.prototype.slice.call(t);if(!e&&Ke(t)){if(!D(t)){const s=Object.create(null);return Object.assign(s,t)}return Ce({},t)}const r=Object.getOwnPropertyDescriptors(t);delete r[_];let n=Reflect.ownKeys(r);for(let s=0;s<n.length;s++){const i=n[s];const o=r[i];if(o.writable===false){o.writable=true;o.configurable=true}if(o.get||o.set)r[i]={configurable:true,writable:true,enumerable:o.enumerable,value:t[i]}}return Object.create(D(t),r)}function we(t,e=false){if(re(t)||M(t)||!S(t))return t;if(Z(t)>1){t.set=t.add=t.clear=t.delete=ft}Object.freeze(t);if(e)L(t,(r,n)=>we(n,true),true);return t}function ft(){p(2)}function re(t){return Object.isFrozen(t)}var dt={};function E(t){const e=dt[t];if(!e){p(0,t)}return e}var V;function Je(){return V}function pt(t,e){return{drafts_:[],parent_:t,immer_:e,canAutoFreeze_:true,unfinalizedDrafts_:0}}function Ve(t,e){if(e){E("Patches");t.patches_=[];t.inversePatches_=[];t.patchListener_=e}}function Ae(t){$e(t);t.drafts_.forEach(_t);t.drafts_=null}function $e(t){if(t===V){V=t.parent_}}function je(t){return V=pt(V,t)}function _t(t){const e=t[_];if(e.type_===0||e.type_===1)e.revoke_();else e.revoked_=true}function Xe(t,e){e.unfinalizedDrafts_=e.drafts_.length;const r=e.drafts_[0];const n=t!==void 0&&t!==r;if(n){if(r[_].modified_){Ae(e);p(4)}if(S(t)){t=J(e,t);if(!e.parent_)Y(e,t)}if(e.patches_){E("Patches").generateReplacementPatches_(r[_].base_,t,e.patches_,e.inversePatches_)}}else{t=J(e,r,[])}Ae(e);if(e.patches_){e.patchListener_(e.patches_,e.inversePatches_)}return t!==Ge?t:void 0}function J(t,e,r){if(re(e))return e;const n=e[_];if(!n){L(e,(s,i)=>Qe(t,n,e,s,i,r),true);return e}if(n.scope_!==t)return e;if(!n.modified_){Y(t,n.base_,true);return n.base_}if(!n.finalized_){n.finalized_=true;n.scope_.unfinalizedDrafts_--;const s=n.copy_;let i=s;let o=false;if(n.type_===3){i=new Set(s);s.clear();o=true}L(i,(a,c)=>Qe(t,n,s,a,c,r,o));Y(t,s,false);if(r&&t.patches_){E("Patches").generatePatches_(n,r,t.patches_,t.inversePatches_)}}return n.copy_}function Qe(t,e,r,n,s,i,o){if(s===r)p(5);if(M(s)){const a=i&&e&&e.type_!==3&&!me(e.assigned_,n)?i.concat(n):void 0;const c=J(t,s,a);qe(r,n,c);if(M(c)){t.canAutoFreeze_=false}else return}else if(o){r.add(s)}if(S(s)&&!re(s)){if(!t.immer_.autoFreeze_&&t.unfinalizedDrafts_<1){return}J(t,s);if(!e||!e.scope_.parent_)Y(t,s)}}function Y(t,e,r=false){if(!t.parent_&&t.immer_.autoFreeze_&&t.canAutoFreeze_){we(e,r)}}function yt(t,e){const r=Array.isArray(t);const n={type_:r?1:0,scope_:e?e.scope_:Je(),modified_:false,finalized_:false,assigned_:{},parent_:e,base_:t,draft_:null,copy_:null,revoke_:null,isManual_:false};let s=n;let i=xe;if(r){s=[n];i=j}const{revoke:o,proxy:a}=Proxy.revocable(s,i);n.draft_=a;n.revoke_=o;return a}var xe={get(t,e){if(e===_)return t;const r=x(t);if(!me(r,e)){return mt(t,r,e)}const n=r[e];if(t.finalized_||!S(n)){return n}if(n===_e(t.base_,e)){ye(t);return t.copy_[e]=ve(n,t)}return n},has(t,e){return e in x(t)},ownKeys(t){return Reflect.ownKeys(x(t))},set(t,e,r){const n=Ye(x(t),e);if(n==null?void 0:n.set){n.set.call(t.draft_,r);return true}if(!t.modified_){const s=_e(x(t),e);const i=s==null?void 0:s[_];if(i&&i.base_===r){t.copy_[e]=r;t.assigned_[e]=false;return true}if(lt(r,s)&&(r!==void 0||me(t.base_,e)))return true;ye(t);be(t)}if(t.copy_[e]===r&&(r!==void 0||e in t.copy_)||Number.isNaN(r)&&Number.isNaN(t.copy_[e]))return true;t.copy_[e]=r;t.assigned_[e]=true;return true},deleteProperty(t,e){if(_e(t.base_,e)!==void 0||e in t.base_){t.assigned_[e]=false;ye(t);be(t)}else{delete t.assigned_[e]}if(t.copy_){delete t.copy_[e]}return true},getOwnPropertyDescriptor(t,e){const r=x(t);const n=Reflect.getOwnPropertyDescriptor(r,e);if(!n)return n;return{writable:true,configurable:t.type_!==1||e!=="length",enumerable:n.enumerable,value:r[e]}},defineProperty(){p(11)},getPrototypeOf(t){return D(t.base_)},setPrototypeOf(){p(12)}};var j={};L(xe,(t,e)=>{j[t]=function(){arguments[0]=arguments[0][0];return e.apply(this,arguments)}});j.deleteProperty=function(t,e){if(isNaN(parseInt(e)))p(13);return j.set.call(this,t,e,void 0)};j.set=function(t,e,r){if(e!=="length"&&isNaN(parseInt(e)))p(14);return xe.set.call(this,t[0],e,r,t[0])};function _e(t,e){const r=t[_];const n=r?x(r):t;return n[e]}function mt(t,e,r){var s;const n=Ye(e,r);return n?`value`in n?n.value:(s=n.get)==null?void 0:s.call(t.draft_):void 0}function Ye(t,e){if(!(e in t))return void 0;let r=D(t);while(r){const n=Object.getOwnPropertyDescriptor(r,e);if(n)return n;r=D(r)}return void 0}function be(t){if(!t.modified_){t.modified_=true;if(t.parent_){be(t.parent_)}}}function ye(t){if(!t.copy_){t.copy_=ge(t.base_,t.scope_.immer_.useStrictShallowCopy_)}}var gt=class{constructor(t){this.autoFreeze_=true;this.useStrictShallowCopy_=false;this.produce=(e,r,n)=>{if(typeof e==="function"&&typeof r!=="function"){const i=r;r=e;const o=this;return function a(c=i,...h){return o.produce(c,l=>r.call(this,l,...h))}}if(typeof r!=="function")p(6);if(n!==void 0&&typeof n!=="function")p(7);let s;if(S(e)){const i=je(this);const o=ve(e,void 0);let a=true;try{s=r(o);a=false}finally{if(a)Ae(i);else $e(i)}Ve(i,n);return Xe(s,i)}else if(!e||typeof e!=="object"){s=r(e);if(s===void 0)s=e;if(s===Ge)s=void 0;if(this.autoFreeze_)we(s,true);if(n){const i=[];const o=[];E("Patches").generateReplacementPatches_(e,s,i,o);n(i,o)}return s}else p(1,e)};this.produceWithPatches=(e,r)=>{if(typeof e==="function"){return(o,...a)=>this.produceWithPatches(o,c=>e(c,...a))}let n,s;const i=this.produce(e,r,(o,a)=>{n=o;s=a});return[i,n,s]};if(typeof(t==null?void 0:t.autoFreeze)==="boolean")this.setAutoFreeze(t.autoFreeze);if(typeof(t==null?void 0:t.useStrictShallowCopy)==="boolean")this.setUseStrictShallowCopy(t.useStrictShallowCopy)}createDraft(t){if(!S(t))p(8);if(M(t))t=At(t);const e=je(this);const r=ve(t,void 0);r[_].isManual_=true;$e(e);return r}finishDraft(t,e){const r=t&&t[_];if(!r||!r.isManual_)p(9);const{scope_:n}=r;Ve(n,e);return Xe(void 0,n)}setAutoFreeze(t){this.autoFreeze_=t}setUseStrictShallowCopy(t){this.useStrictShallowCopy_=t}applyPatches(t,e){let r;for(r=e.length-1;r>=0;r--){const s=e[r];if(s.path.length===0&&s.op==="replace"){t=s.value;break}}if(r>-1){e=e.slice(r+1)}const n=E("Patches").applyPatches_;if(M(t)){return n(t,e)}return this.produce(t,s=>n(s,e))}};function ve(t,e){const r=ee(t)?E("MapSet").proxyMap_(t,e):te(t)?E("MapSet").proxySet_(t,e):yt(t,e);const n=e?e.scope_:Je();n.drafts_.push(r);return r}function At(t){if(!M(t))p(10,t);return Ze(t)}function Ze(t){if(!S(t)||re(t))return t;const e=t[_];let r;if(e){if(!e.modified_)return e.base_;e.finalized_=true;r=ge(t,e.scope_.immer_.useStrictShallowCopy_)}else{r=ge(t,true)}L(r,(n,s)=>{qe(r,n,Ze(s))});if(e){e.finalized_=false}return r}var y=new gt;var P=y.produce;var Pt=y.produceWithPatches.bind(y);var Ct=y.setAutoFreeze.bind(y);var Nt=y.setUseStrictShallowCopy.bind(y);var Ot=y.applyPatches.bind(y);var Dt=y.createDraft.bind(y);var Mt=y.finishDraft.bind(y);var Se=class{constructor(e){this.observer=e;this.teardowns=[];if(typeof AbortController!=="undefined"){this.controller=new AbortController;this.signal=this.controller.signal}}next(e){if(this.observer.next){this.observer.next(e)}}complete(){if(this.observer.complete){this.observer.complete();this.unsubscribe()}}error(e){if(this.observer.error){this.observer.error(e);this.unsubscribe()}}addTeardown(e){this.teardowns.push(e)}unsubscribe(){if(this.controller){this.controller.abort()}this.teardowns.forEach(e=>e())}};var Ee=class{constructor(e){this._observers=[];this.subscribeCallback=e}subscribe(e={}){const r=new Se(e);const n=this.subscribeCallback(r);r.addTeardown(n);this._observers.push(r);return{unsubscribe:()=>r.unsubscribe()}}};var X=class extends Ee{constructor(e=null,r=null,{last:n=false}={}){super(s=>{return()=>{}});if(n){this._lastObserver=r}else{this._observers.push(r)}this._value=P(e,s=>{});this._pendingUpdates=[];this._updateScheduled=false}get value(){if(Q.isComputing!=null){Q.isComputing.addDependency(this)}return this._value}update(e){this._pendingUpdates.push(e);if(!this._updateScheduled){this._updateScheduled=true;requestAnimationFrame(this._applyUpdates.bind(this))}}notifyObservers(){const e=[...this._observers,this._lastObserver];e.forEach(r=>{if(r&&typeof r==="function"){r(this._value)}else if(r&&r.next){r.next(this._value)}})}_applyUpdates(){while(this._pendingUpdates.length>0){const e=this._pendingUpdates.shift();this._value=P(this._value,e)}this.notifyObservers();this._updateScheduled=false}};var Q=class t extends X{constructor(e,r){super(null);this.computeFn=e;this.context=r;this.dependencies=new Set;this.children=new Set;this.subscriptions=new Map;this.compute()}get value(){t.isComputing=this;const e=this.computeFn.call(this.context);t.isComputing=null;return e}compute(){this.notifyChildren();this._value=this.computeFn.call(this.context);this.notifyObservers()}addDependency(e){if(!this.dependencies.has(e)){const r=e.subscribe(()=>this.compute());this.dependencies.add(e);this.subscriptions.set(e,r);if(e instanceof t){e.addChild(this)}}}dispose(){this.notifyChildren();this.dependencies.forEach(e=>{const r=this.subscriptions.get(e);if(r){r.unsubscribe()}this.dependencies.delete(e);this.subscriptions.delete(e);if(e instanceof t){e.removeChild(this)}})}addChild(e){this.children.add(e)}removeChild(e){this.children.delete(e)}notifyChildren(){this.children.forEach(e=>{e.dispose()});this.children.clear()}};var $t=function(t){return new Q(t,this)};var bt=function(t){this._isWithinBatch=true;Promise.resolve().then(t).finally(()=>{this._isWithinBatch=false;this.react()})};var vt=function(t){let e=()=>{};const r=()=>{e();e=t.call(this)||(()=>{})};this._effects.push({effectFn:r,cleanup:e})};var et=function(t){return class extends t{constructor(){super(...arguments);K(this,"computed",$t);K(this,"batch",bt);K(this,"effect",vt)}}};var ne=null;var wt=t=>{if(ne){return ne}let e=t;let r=[];let n={};let s=[];let i=[];let o=false;const a=window["__REDUX_DEVTOOLS_EXTENSION__"]&&window["__REDUX_DEVTOOLS_EXTENSION__"].connect();const c=f=>{s.push(f)};const h=f=>{r.push(f);return()=>{const g=r.indexOf(f);if(g>-1){r.splice(g,1)}}};const l=(f,g)=>{if(n[f]){throw new Error(`Action type ${f} is already registered.`)}n[f]=g};const u=()=>ce(void 0,null,function*(){if(i.length===0){o=false;return}o=true;const{action:f,payload:g}=i.shift();const z=n[f];if(!z){console.warn(`No reducer found for action ${f}`);return}const T={getState:()=>e,dispatch:(H,ie)=>m(H,ie)};const se=s.map(H=>H(T));const G=se.reduce((H,ie)=>ie(H),A);yield G(f,g);u()});const m=(f,g)=>{i.push({action:f,payload:g});if(!o){u()}};const A=(f,g)=>ce(void 0,null,function*(){let z;let T=null;z=P(e,se=>{const G=n[f](se,g);if(G instanceof Promise){T=G;return}});if(T){yield T}e=z;C(f);return z});const C=f=>{for(const g of r){g(e,f)}a&&a.send(f,e)};ne={state:e,subscribe:h,register:l,dispatch:m,use:c};return ne};var tt=class extends et(HTMLElement){constructor(){super();this._unsubscribers=new Map;this.store=null;this._effects=[];this._isWithinBatch=false}observable(e){const r=new X(e,{next:this.react.bind(this),complete:this.react.bind(this),error:this.react.bind(this)},{last:true});return r}observableAttr(e,r=n=>n){let n=this.getAttribute(e);n=P(n,r);return this.observable(n)}setObservables(e){Object.keys(e).forEach(r=>{if(this[r]instanceof Observable){this[r].next(e[r])}})}subscribe(e,r){this.store=e;const n=this.observable(e.state[r]);const s=e.subscribe(i=>{this[r].update(()=>i[r])});this._unsubscribers.set(r,s);return n}dispatch(e,r){this.store.dispatch(e,r)}connectedCallback(){this.react()}disconnectedCallback(){this._unsubscribers.forEach(e=>e());this._effects.forEach(({cleanup:e})=>e&&e())}react(){if(!this._isWithinBatch){const e=this.template();Be(e,this);this._effects.forEach(({effectFn:r})=>r.call(this))}}template(){throw new Error("You have to implement the method template()!")}};function Qt(t,e){if(!customElements.get(t)){customElements.define(t,e)}}export{tt as ReactiveElement,Qt as define,ct as html,wt as store};
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
