var st=Object.defineProperty;var Se=Object.getOwnPropertySymbols;var nt=Object.prototype.hasOwnProperty;var it=Object.prototype.propertyIsEnumerable;var Ee=(t,e,r)=>e in t?st(t,e,{enumerable:true,configurable:true,writable:true,value:r}):t[e]=r;var Pe=(t,e)=>{for(var r in e||(e={}))if(nt.call(e,r))Ee(t,r,e[r]);if(Se)for(var r of Se(e)){if(it.call(e,r))Ee(t,r,e[r])}return t};var ie=(t,e,r)=>{return new Promise((s,n)=>{var i=c=>{try{a(r.next(c))}catch(h){n(h)}};var o=c=>{try{a(r.throw(c))}catch(h){n(h)}};var a=c=>c.done?s(c.value):Promise.resolve(c.value).then(i,o);a((r=r.apply(t,e)).next())})};var I=globalThis;var K=I.trustedTypes;var Ce=K?K.createPolicy("lit-html",{createHTML:t=>t}):void 0;var He="$lit$";var $=`lit$${(Math.random()+"").slice(9)}$`;var Fe="?"+$;var ot=`<${Fe}>`;var w=document;var U=()=>w.createComment("");var R=t=>null===t||"object"!=typeof t&&"function"!=typeof t;var Ie=Array.isArray;var ct=t=>Ie(t)||"function"==typeof(t==null?void 0:t[Symbol.iterator]);var oe="[ 	\n\f\r]";var F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;var Ne=/-->/g;var Oe=/>/g;var b=RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g");var De=/'/g;var ze=/"/g;var Ue=/^(?:script|style|textarea|title)$/i;var Re=t=>(e,...r)=>({_$litType$:t,strings:e,values:r});var at=Re(1);var wt=Re(2);var k=Symbol.for("lit-noChange");var d=Symbol.for("lit-nothing");var Me=new WeakMap;var v=w.createTreeWalker(w,129);function ke(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==Ce?Ce.createHTML(e):e}var ut=(t,e)=>{const r=t.length-1,s=[];let n,i=2===e?"<svg>":"",o=F;for(let a=0;a<r;a++){const c=t[a];let h,l,u=-1,m=0;for(;m<c.length&&(o.lastIndex=m,l=o.exec(c),null!==l);)m=o.lastIndex,o===F?"!--"===l[1]?o=Ne:void 0!==l[1]?o=Oe:void 0!==l[2]?(Ue.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=b):void 0!==l[3]&&(o=b):o===b?">"===l[0]?(o=n!=null?n:F,u=-1):void 0===l[1]?u=-2:(u=o.lastIndex-l[2].length,h=l[1],o=void 0===l[3]?b:'"'===l[3]?ze:De):o===ze||o===De?o=b:o===Ne||o===Oe?o=F:(o=b,n=void 0);const A=o===b&&t[a+1].startsWith("/>")?" ":"";i+=o===F?c+ot:u>=0?(s.push(h),c.slice(0,u)+He+c.slice(u)+$+A):c+$+(-2===u?a:A)}return[ke(t,i+(t[r]||"<?>")+(2===e?"</svg>":"")),s]};var W=class t{constructor({strings:e,_$litType$:r},s){let n;this.parts=[];let i=0,o=0;const a=e.length-1,c=this.parts,[h,l]=ut(e,r);if(this.el=t.createElement(h,s),v.currentNode=this.el.content,2===r){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;null!==(n=v.nextNode())&&c.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(He)){const m=l[o++],A=n.getAttribute(u).split($),C=/([.?@])?(.*)/.exec(m);c.push({type:1,index:i,name:C[2],strings:A,ctor:"."===C[1]?ue:"?"===C[1]?he:"@"===C[1]?le:O}),n.removeAttribute(u)}else u.startsWith($)&&(c.push({type:6,index:i}),n.removeAttribute(u));if(Ue.test(n.tagName)){const u=n.textContent.split($),m=u.length-1;if(m>0){n.textContent=K?K.emptyScript:"";for(let A=0;A<m;A++)n.append(u[A],U()),v.nextNode(),c.push({type:2,index:++i});n.append(u[m],U())}}}else if(8===n.nodeType)if(n.data===Fe)c.push({type:2,index:i});else{let u=-1;for(;-1!==(u=n.data.indexOf($,u+1));)c.push({type:7,index:i}),u+=$.length-1}i++}}static createElement(e,r){const s=w.createElement("template");return s.innerHTML=e,s}};function N(t,e,r=t,s){var o,a,c;if(e===k)return e;let n=void 0!==s?(o=r._$Co)==null?void 0:o[s]:r._$Cl;const i=R(e)?void 0:e._$litDirective$;return(n==null?void 0:n.constructor)!==i&&((a=n==null?void 0:n._$AO)==null?void 0:a.call(n,false),void 0===i?n=void 0:(n=new i(t),n._$AT(t,r,s)),void 0!==s?((c=r._$Co)!=null?c:r._$Co=[])[s]=n:r._$Cl=n),void 0!==n&&(e=N(t,n._$AS(t,e.values),n,s)),e}var ae=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var h;const{el:{content:r},parts:s}=this._$AD,n=((h=e==null?void 0:e.creationScope)!=null?h:w).importNode(r,true);v.currentNode=n;let i=v.nextNode(),o=0,a=0,c=s[0];for(;void 0!==c;){if(o===c.index){let l;2===c.type?l=new B(i,i.nextSibling,this,e):1===c.type?l=new c.ctor(i,c.name,c.strings,this,e):6===c.type&&(l=new fe(i,this,e)),this._$AV.push(l),c=s[++a]}o!==(c==null?void 0:c.index)&&(i=v.nextNode(),o++)}return v.currentNode=w,n}p(e){let r=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,r),r+=s.strings.length-2):s._$AI(e[r])),r++}};var B=class t{get _$AU(){var e,r;return(r=(e=this._$AM)==null?void 0:e._$AU)!=null?r:this._$Cv}constructor(e,r,s,n){var i;this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=s,this.options=n,this._$Cv=(i=n==null?void 0:n.isConnected)!=null?i:true}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return void 0!==r&&11===(e==null?void 0:e.nodeType)&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=N(this,e,r),R(e)?e===d||null==e||""===e?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==k&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):ct(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==d&&R(this._$AH)?this._$AA.nextSibling.data=e:this.$(w.createTextNode(e)),this._$AH=e}g(e){var i;const{values:r,_$litType$:s}=e,n="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=W.createElement(ke(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===n)this._$AH.p(r);else{const o=new ae(n,this),a=o.u(this.options);o.p(r),this.$(a),this._$AH=o}}_$AC(e){let r=Me.get(e.strings);return void 0===r&&Me.set(e.strings,r=new W(e)),r}T(e){Ie(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let s,n=0;for(const i of e)n===r.length?r.push(s=new t(this.k(U()),this.k(U()),this,this.options)):s=r[n],s._$AI(i),n++;n<r.length&&(this._$AR(s&&s._$AB.nextSibling,n),r.length=n)}_$AR(e=this._$AA.nextSibling,r){var s;for((s=this._$AP)==null?void 0:s.call(this,false,true,r);e&&e!==this._$AB;){const n=e.nextSibling;e.remove(),e=n}}setConnected(e){var r;void 0===this._$AM&&(this._$Cv=e,(r=this._$AP)==null?void 0:r.call(this,e))}};var O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,s,n,i){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=r,this._$AM=n,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,r=this,s,n){const i=this.strings;let o=false;if(void 0===i)e=N(this,e,r,0),o=!R(e)||e!==this._$AH&&e!==k,o&&(this._$AH=e);else{const a=e;let c,h;for(e=i[0],c=0;c<i.length-1;c++)h=N(this,a[s+c],r,c),h===k&&(h=this._$AH[c]),o||(o=!R(h)||h!==this._$AH[c]),h===d?e=d:e!==d&&(e+=(h!=null?h:"")+i[c+1]),this._$AH[c]=h}o&&!n&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}};var ue=class extends O{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}};var he=class extends O{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}};var le=class extends O{constructor(e,r,s,n,i){super(e,r,s,n,i),this.type=5}_$AI(e,r=this){var o;if((e=(o=N(this,e,r,0))!=null?o:d)===k)return;const s=this._$AH,n=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==d&&(s===d||n);n&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r,s;"function"==typeof this._$AH?this._$AH.call((s=(r=this.options)==null?void 0:r.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}};var fe=class{constructor(e,r,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}};var ce=I.litHtmlPolyfillSupport;var Te;ce==null?void 0:ce(W,B),((Te=I.litHtmlVersions)!=null?Te:I.litHtmlVersions=[]).push("3.0.0");var We=(t,e,r)=>{var i,o;const s=(i=r==null?void 0:r.renderBefore)!=null?i:e;let n=s._$litPart$;if(void 0===n){const a=(o=r==null?void 0:r.renderBefore)!=null?o:null;s._$litPart$=n=new B(e.insertBefore(U(),a),a,void 0,r!=null?r:{})}return n._$AI(t),n};var Qe=Symbol.for("immer-nothing");var Be=Symbol.for("immer-draftable");var _=Symbol.for("immer-state");var ht=true?[function(t){return`The plugin for '${t}' has not been loaded into Immer. To enable the plugin, import and call \`enable${t}()\` when initializing your application.`},function(t){return`produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${t}'`},"This object has been frozen and should not be mutated",function(t){return"Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+t},"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.","Immer forbids circular references","The first or second argument to `produce` must be a function","The third argument to `produce` must be a function or undefined","First argument to `createDraft` must be a plain object, an array, or an immerable object","First argument to `finishDraft` must be a draft returned by `createDraft`",function(t){return`'current' expects a draft, got: ${t}`},"Object.defineProperty() cannot be used on an Immer draft","Object.setPrototypeOf() cannot be used on an Immer draft","Immer only supports deleting array indices","Immer only supports setting array indices and the 'length' property",function(t){return`'original' expects a draft, got: ${t}`}]:[];function p(t,...e){if(true){const r=ht[t];const s=typeof r==="function"?r.apply(null,e):r;throw new Error(`[Immer] ${s}`)}throw new Error(`[Immer] minified error nr: ${t}. Full error at: https://bit.ly/3cXEKWf`)}var D=Object.getPrototypeOf;function z(t){return!!t&&!!t[_]}function S(t){var e;if(!t)return false;return Ge(t)||Array.isArray(t)||!!t[Be]||!!((e=t.constructor)==null?void 0:e[Be])||Z(t)||ee(t)}var lt=Object.prototype.constructor.toString();function Ge(t){if(!t||typeof t!=="object")return false;const e=D(t);if(e===null){return true}const r=Object.hasOwnProperty.call(e,"constructor")&&e.constructor;if(r===Object)return true;return typeof r=="function"&&Function.toString.call(r)===lt}function V(t,e){if(Y(t)===0){Object.entries(t).forEach(([r,s])=>{e(r,s,t)})}else{t.forEach((r,s)=>e(s,r,t))}}function Y(t){const e=t[_];return e?e.type_:Array.isArray(t)?1:Z(t)?2:ee(t)?3:0}function _e(t,e){return Y(t)===2?t.has(e):Object.prototype.hasOwnProperty.call(t,e)}function Ke(t,e,r){const s=Y(t);if(s===2)t.set(e,r);else if(s===3){t.add(r)}else t[e]=r}function ft(t,e){if(t===e){return t!==0||1/t===1/e}else{return t!==t&&e!==e}}function Z(t){return t instanceof Map}function ee(t){return t instanceof Set}function x(t){return t.copy_||t.base_}function ye(t,e){if(Z(t)){return new Map(t)}if(ee(t)){return new Set(t)}if(Array.isArray(t))return Array.prototype.slice.call(t);if(!e&&Ge(t)){if(!D(t)){const n=Object.create(null);return Object.assign(n,t)}return Pe({},t)}const r=Object.getOwnPropertyDescriptors(t);delete r[_];let s=Reflect.ownKeys(r);for(let n=0;n<s.length;n++){const i=s[n];const o=r[i];if(o.writable===false){o.writable=true;o.configurable=true}if(o.get||o.set)r[i]={configurable:true,writable:true,enumerable:o.enumerable,value:t[i]}}return Object.create(D(t),r)}function be(t,e=false){if(te(t)||z(t)||!S(t))return t;if(Y(t)>1){t.set=t.add=t.clear=t.delete=dt}Object.freeze(t);if(e)V(t,(r,s)=>be(s,true),true);return t}function dt(){p(2)}function te(t){return Object.isFrozen(t)}var pt={};function E(t){const e=pt[t];if(!e){p(0,t)}return e}var L;function qe(){return L}function _t(t,e){return{drafts_:[],parent_:t,immer_:e,canAutoFreeze_:true,unfinalizedDrafts_:0}}function Ve(t,e){if(e){E("Patches");t.patches_=[];t.inversePatches_=[];t.patchListener_=e}}function me(t){ge(t);t.drafts_.forEach(yt);t.drafts_=null}function ge(t){if(t===L){L=t.parent_}}function Le(t){return L=_t(L,t)}function yt(t){const e=t[_];if(e.type_===0||e.type_===1)e.revoke_();else e.revoked_=true}function je(t,e){e.unfinalizedDrafts_=e.drafts_.length;const r=e.drafts_[0];const s=t!==void 0&&t!==r;if(s){if(r[_].modified_){me(e);p(4)}if(S(t)){t=q(e,t);if(!e.parent_)J(e,t)}if(e.patches_){E("Patches").generateReplacementPatches_(r[_].base_,t,e.patches_,e.inversePatches_)}}else{t=q(e,r,[])}me(e);if(e.patches_){e.patchListener_(e.patches_,e.inversePatches_)}return t!==Qe?t:void 0}function q(t,e,r){if(te(e))return e;const s=e[_];if(!s){V(e,(n,i)=>Xe(t,s,e,n,i,r),true);return e}if(s.scope_!==t)return e;if(!s.modified_){J(t,s.base_,true);return s.base_}if(!s.finalized_){s.finalized_=true;s.scope_.unfinalizedDrafts_--;const n=s.copy_;let i=n;let o=false;if(s.type_===3){i=new Set(n);n.clear();o=true}V(i,(a,c)=>Xe(t,s,n,a,c,r,o));J(t,n,false);if(r&&t.patches_){E("Patches").generatePatches_(s,r,t.patches_,t.inversePatches_)}}return s.copy_}function Xe(t,e,r,s,n,i,o){if(n===r)p(5);if(z(n)){const a=i&&e&&e.type_!==3&&!_e(e.assigned_,s)?i.concat(s):void 0;const c=q(t,n,a);Ke(r,s,c);if(z(c)){t.canAutoFreeze_=false}else return}else if(o){r.add(n)}if(S(n)&&!te(n)){if(!t.immer_.autoFreeze_&&t.unfinalizedDrafts_<1){return}q(t,n);if(!e||!e.scope_.parent_)J(t,n)}}function J(t,e,r=false){if(!t.parent_&&t.immer_.autoFreeze_&&t.canAutoFreeze_){be(e,r)}}function mt(t,e){const r=Array.isArray(t);const s={type_:r?1:0,scope_:e?e.scope_:qe(),modified_:false,finalized_:false,assigned_:{},parent_:e,base_:t,draft_:null,copy_:null,revoke_:null,isManual_:false};let n=s;let i=ve;if(r){n=[s];i=j}const{revoke:o,proxy:a}=Proxy.revocable(n,i);s.draft_=a;s.revoke_=o;return a}var ve={get(t,e){if(e===_)return t;const r=x(t);if(!_e(r,e)){return gt(t,r,e)}const s=r[e];if(t.finalized_||!S(s)){return s}if(s===de(t.base_,e)){pe(t);return t.copy_[e]=$e(s,t)}return s},has(t,e){return e in x(t)},ownKeys(t){return Reflect.ownKeys(x(t))},set(t,e,r){const s=Je(x(t),e);if(s==null?void 0:s.set){s.set.call(t.draft_,r);return true}if(!t.modified_){const n=de(x(t),e);const i=n==null?void 0:n[_];if(i&&i.base_===r){t.copy_[e]=r;t.assigned_[e]=false;return true}if(ft(r,n)&&(r!==void 0||_e(t.base_,e)))return true;pe(t);Ae(t)}if(t.copy_[e]===r&&(r!==void 0||e in t.copy_)||Number.isNaN(r)&&Number.isNaN(t.copy_[e]))return true;t.copy_[e]=r;t.assigned_[e]=true;return true},deleteProperty(t,e){if(de(t.base_,e)!==void 0||e in t.base_){t.assigned_[e]=false;pe(t);Ae(t)}else{delete t.assigned_[e]}if(t.copy_){delete t.copy_[e]}return true},getOwnPropertyDescriptor(t,e){const r=x(t);const s=Reflect.getOwnPropertyDescriptor(r,e);if(!s)return s;return{writable:true,configurable:t.type_!==1||e!=="length",enumerable:s.enumerable,value:r[e]}},defineProperty(){p(11)},getPrototypeOf(t){return D(t.base_)},setPrototypeOf(){p(12)}};var j={};V(ve,(t,e)=>{j[t]=function(){arguments[0]=arguments[0][0];return e.apply(this,arguments)}});j.deleteProperty=function(t,e){if(isNaN(parseInt(e)))p(13);return j.set.call(this,t,e,void 0)};j.set=function(t,e,r){if(e!=="length"&&isNaN(parseInt(e)))p(14);return ve.set.call(this,t[0],e,r,t[0])};function de(t,e){const r=t[_];const s=r?x(r):t;return s[e]}function gt(t,e,r){var n;const s=Je(e,r);return s?`value`in s?s.value:(n=s.get)==null?void 0:n.call(t.draft_):void 0}function Je(t,e){if(!(e in t))return void 0;let r=D(t);while(r){const s=Object.getOwnPropertyDescriptor(r,e);if(s)return s;r=D(r)}return void 0}function Ae(t){if(!t.modified_){t.modified_=true;if(t.parent_){Ae(t.parent_)}}}function pe(t){if(!t.copy_){t.copy_=ye(t.base_,t.scope_.immer_.useStrictShallowCopy_)}}var At=class{constructor(t){this.autoFreeze_=true;this.useStrictShallowCopy_=false;this.produce=(e,r,s)=>{if(typeof e==="function"&&typeof r!=="function"){const i=r;r=e;const o=this;return function a(c=i,...h){return o.produce(c,l=>r.call(this,l,...h))}}if(typeof r!=="function")p(6);if(s!==void 0&&typeof s!=="function")p(7);let n;if(S(e)){const i=Le(this);const o=$e(e,void 0);let a=true;try{n=r(o);a=false}finally{if(a)me(i);else ge(i)}Ve(i,s);return je(n,i)}else if(!e||typeof e!=="object"){n=r(e);if(n===void 0)n=e;if(n===Qe)n=void 0;if(this.autoFreeze_)be(n,true);if(s){const i=[];const o=[];E("Patches").generateReplacementPatches_(e,n,i,o);s(i,o)}return n}else p(1,e)};this.produceWithPatches=(e,r)=>{if(typeof e==="function"){return(o,...a)=>this.produceWithPatches(o,c=>e(c,...a))}let s,n;const i=this.produce(e,r,(o,a)=>{s=o;n=a});return[i,s,n]};if(typeof(t==null?void 0:t.autoFreeze)==="boolean")this.setAutoFreeze(t.autoFreeze);if(typeof(t==null?void 0:t.useStrictShallowCopy)==="boolean")this.setUseStrictShallowCopy(t.useStrictShallowCopy)}createDraft(t){if(!S(t))p(8);if(z(t))t=$t(t);const e=Le(this);const r=$e(t,void 0);r[_].isManual_=true;ge(e);return r}finishDraft(t,e){const r=t&&t[_];if(!r||!r.isManual_)p(9);const{scope_:s}=r;Ve(s,e);return je(void 0,s)}setAutoFreeze(t){this.autoFreeze_=t}setUseStrictShallowCopy(t){this.useStrictShallowCopy_=t}applyPatches(t,e){let r;for(r=e.length-1;r>=0;r--){const n=e[r];if(n.path.length===0&&n.op==="replace"){t=n.value;break}}if(r>-1){e=e.slice(r+1)}const s=E("Patches").applyPatches_;if(z(t)){return s(t,e)}return this.produce(t,n=>s(n,e))}};function $e(t,e){const r=Z(t)?E("MapSet").proxyMap_(t,e):ee(t)?E("MapSet").proxySet_(t,e):mt(t,e);const s=e?e.scope_:qe();s.drafts_.push(r);return r}function $t(t){if(!z(t))p(10,t);return Ye(t)}function Ye(t){if(!S(t)||te(t))return t;const e=t[_];let r;if(e){if(!e.modified_)return e.base_;e.finalized_=true;r=ye(t,e.scope_.immer_.useStrictShallowCopy_)}else{r=ye(t,true)}V(r,(s,n)=>{Ke(r,s,Ye(n))});if(e){e.finalized_=false}return r}var y=new At;var P=y.produce;var St=y.produceWithPatches.bind(y);var Et=y.setAutoFreeze.bind(y);var Pt=y.setUseStrictShallowCopy.bind(y);var Ct=y.applyPatches.bind(y);var Nt=y.createDraft.bind(y);var Ot=y.finishDraft.bind(y);var we=class{constructor(e){if(typeof e==="function"){this.observer={next:e}}else{this.observer=e}this.teardowns=[];if(typeof AbortController!=="undefined"){this.controller=new AbortController;this.signal=this.controller.signal}}next(e){if(this.observer.next){this.observer.next(e)}}complete(){if(this.observer.complete){this.observer.complete()}else if(typeof this.observer.next==="function"){this.observer.next({complete:true})}this.unsubscribe()}error(e){if(this.observer.error){this.observer.error(e)}else if(typeof this.observer.next==="function"){this.observer.next({error:e})}this.unsubscribe()}addTeardown(e){this.teardowns.push(e)}unsubscribe(){if(this.controller){this.controller.abort()}this.teardowns.forEach(e=>e())}};var xe=class{constructor(e){this._observers=[];this.subscribeCallback=e}subscribe(e=()=>{}){const r=new we(e);const s=this.subscribeCallback(r);r.addTeardown(s);this._observers.push(r);return{unsubscribe:()=>r.unsubscribe()}}};var X=class extends xe{constructor(e=null,r=null,{last:s=false}={}){super(n=>{return()=>{}});if(s){this._lastObserver=r}else{this._observers.push(r)}this._value=P(e,n=>{});this._pendingUpdates=[];this._updateScheduled=false}get value(){if(Q.isComputing!=null){Q.isComputing.addDependency(this)}return this._value}update(e){this._pendingUpdates.push(e);if(!this._updateScheduled){this._updateScheduled=true;requestAnimationFrame(this._applyUpdates.bind(this))}}notifyObservers(){const e=[...this._observers,this._lastObserver];e.forEach(r=>{if(r&&typeof r==="function"){r(this._value)}else if(r&&r.next){r.next(this._value)}})}_applyUpdates(){let e=this._value;while(this._pendingUpdates.length>0){const r=this._pendingUpdates.shift();this._value=P(this._value,r)}if(e!==this._value){this.notifyObservers()}this._updateScheduled=false}};var Q=class t extends X{constructor(e,r){super(null);this.computeFn=e;this.context=r;this.dependencies=new Set;this.children=new Set;this.subscriptions=new Map;this.compute()}get value(){t.isComputing=this;const e=this.computeFn.call(this.context);t.isComputing=null;return e}compute(){this.notifyChildren();this._value=this.computeFn.call(this.context);this.notifyObservers()}addDependency(e){if(!this.dependencies.has(e)){const r=e.subscribe(()=>this.compute());this.dependencies.add(e);this.subscriptions.set(e,r);if(e instanceof t){e.addChild(this)}}}dispose(){this.notifyChildren();this.dependencies.forEach(e=>{const r=this.subscriptions.get(e);if(r){r.unsubscribe()}this.dependencies.delete(e);this.subscriptions.delete(e);if(e instanceof t){e.removeChild(this)}})}addChild(e){this.children.add(e)}removeChild(e){this.children.delete(e)}notifyChildren(){this.children.forEach(e=>{e.dispose()});this.children.clear()}};var Ze=function(t){return new Q(t,this)};var et=function(t){this._isWithinBatch=true;Promise.resolve().then(t).finally(()=>{this._isWithinBatch=false;this.react()})};var tt=function(t){let e=()=>{};const r=()=>{e();e=t.call(this)||(()=>{})};this._effects.push({effectFn:r,cleanup:e})};var re=null;var bt=t=>{if(re){return re}let e=t;let r=[];let s={};let n=[];let i=[];let o=false;const a=window["__REDUX_DEVTOOLS_EXTENSION__"]&&window["__REDUX_DEVTOOLS_EXTENSION__"].connect();const c=f=>{n.push(f)};const h=f=>{r.push(f);return()=>{const g=r.indexOf(f);if(g>-1){r.splice(g,1)}}};const l=(f,g)=>{if(s[f]){throw new Error(`Action type ${f} is already registered.`)}s[f]=g};const u=()=>ie(void 0,null,function*(){if(i.length===0){o=false;return}o=true;const{action:f,payload:g}=i.shift();const M=s[f];if(!M){console.warn(`No reducer found for action ${f}`);return}const T={getState:()=>e,dispatch:(H,ne)=>m(H,ne)};const se=n.map(H=>H(T));const G=se.reduce((H,ne)=>ne(H),A);yield G(f,g);u()});const m=(f,g)=>{i.push({action:f,payload:g});if(!o){u()}};const A=(f,g)=>ie(void 0,null,function*(){let M;let T=null;M=P(e,se=>{const G=s[f](se,g);if(G instanceof Promise){T=G;return}});if(T){yield T}e=M;C(f);return M});const C=f=>{for(const g of r){g(e,f)}a&&a.send(f,e)};re={state:e,subscribe:h,register:l,dispatch:m,use:c};return re};var rt=class extends HTMLElement{constructor(){super();this._unsubscribers=new Map;this.store=null;this._effects=[];this._isWithinBatch=false;this.computed=Ze.bind(this);this.batch=et.bind(this);this.effect=tt.bind(this)}observable(e){const r=new X(e,{next:this.react.bind(this),complete:this.react.bind(this),error:this.react.bind(this)},{last:true});return r}observableAttr(e,r=s=>s){let s=this.getAttribute(e);s=P(s,r);return this.observable(s)}setObservables(e){Object.keys(e).forEach(r=>{if(this[r]instanceof Observable){this[r].next(e[r])}})}subscribe(e,r){this.store=e;const s=this.observable(e.state[r]);const n=e.subscribe(i=>{this[r].update(()=>i[r])});this._unsubscribers.set(r,n);return s}dispatch(e,r){this.store.dispatch(e,r)}connectedCallback(){this.react()}disconnectedCallback(){this._unsubscribers.forEach(e=>e());this._effects.forEach(({cleanup:e})=>e&&e())}react(){if(!this._isWithinBatch){const e=this.template();We(e,this);this._effects.forEach(({effectFn:r})=>r.call(this))}}template(){throw new Error("You have to implement the method template()!")}};function Vt(t,e){if(!customElements.get(t)){customElements.define(t,e)}}export{rt as ReactiveElement,Vt as define,at as html,bt as store};
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
