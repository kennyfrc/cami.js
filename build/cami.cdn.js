var cami=(()=>{var R=Object.defineProperty;var mt=Object.getOwnPropertyDescriptor;var yt=Object.getOwnPropertyNames,J=Object.getOwnPropertySymbols;var tt=Object.prototype.hasOwnProperty,vt=Object.prototype.propertyIsEnumerable;var K=(n,t,e)=>t in n?R(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e,T=(n,t)=>{for(var e in t||(t={}))tt.call(t,e)&&K(n,e,t[e]);if(J)for(var e of J(t))vt.call(t,e)&&K(n,e,t[e]);return n};var xt=(n,t)=>{for(var e in t)R(n,e,{get:t[e],enumerable:!0})},wt=(n,t,e,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of yt(t))!tt.call(n,s)&&s!==e&&R(n,s,{get:()=>t[s],enumerable:!(i=mt(t,s))||i.enumerable});return n};var Ht=n=>wt(R({},"__esModule",{value:!0}),n);var et=(n,t,e)=>{if(!t.has(n))throw TypeError("Cannot "+e)};var U=(n,t,e)=>(et(n,t,"read from private field"),e?e.call(n):t.get(n)),st=(n,t,e)=>{if(t.has(n))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(n):t.set(n,e)},it=(n,t,e,i)=>(et(n,t,"write to private field"),i?i.call(n,e):t.set(n,e),e);var j=(n,t,e)=>new Promise((i,s)=>{var h=o=>{try{l(e.next(o))}catch(a){s(a)}},r=o=>{try{l(e.throw(o))}catch(a){s(a)}},l=o=>o.done?i(o.value):Promise.resolve(o.value).then(h,r);l((e=e.apply(n,t)).next())});var Ct={};xt(Ct,{ReactiveElement:()=>q,createStore:()=>St,html:()=>pt});var S=globalThis,B=S.trustedTypes,nt=B?B.createPolicy("lit-html",{createHTML:n=>n}):void 0,dt="$lit$",f=`lit$${(Math.random()+"").slice(9)}$`,$t="?"+f,Nt=`<${$t}>`,y=document,C=()=>y.createComment(""),M=n=>n===null||typeof n!="object"&&typeof n!="function",ut=Array.isArray,bt=n=>ut(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",k=`[ 	
\f\r]`,E=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rt=/-->/g,ot=/>/g,g=RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ht=/'/g,lt=/"/g,_t=/^(?:script|style|textarea|title)$/i,At=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),pt=At(1),It=At(2),I=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),ct=new WeakMap,m=y.createTreeWalker(y,129);function ft(n,t){if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return nt!==void 0?nt.createHTML(t):t}var Tt=(n,t)=>{let e=n.length-1,i=[],s,h=t===2?"<svg>":"",r=E;for(let l=0;l<e;l++){let o=n[l],a,d,c=-1,_=0;for(;_<o.length&&(r.lastIndex=_,d=r.exec(o),d!==null);)_=r.lastIndex,r===E?d[1]==="!--"?r=rt:d[1]!==void 0?r=ot:d[2]!==void 0?(_t.test(d[2])&&(s=RegExp("</"+d[2],"g")),r=g):d[3]!==void 0&&(r=g):r===g?d[0]===">"?(r=s!=null?s:E,c=-1):d[1]===void 0?c=-2:(c=r.lastIndex-d[2].length,a=d[1],r=d[3]===void 0?g:d[3]==='"'?lt:ht):r===lt||r===ht?r=g:r===rt||r===ot?r=E:(r=g,s=void 0);let p=r===g&&n[l+1].startsWith("/>")?" ":"";h+=r===E?o+Nt:c>=0?(i.push(a),o.slice(0,c)+dt+o.slice(c)+f+p):o+f+(c===-2?l:p)}return[ft(n,h+(n[e]||"<?>")+(t===2?"</svg>":"")),i]},P=class n{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let h=0,r=0,l=t.length-1,o=this.parts,[a,d]=Tt(t,e);if(this.el=n.createElement(a,i),m.currentNode=this.el.content,e===2){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=m.nextNode())!==null&&o.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(dt)){let _=d[r++],p=s.getAttribute(c).split(f),x=/([.?@])?(.*)/.exec(_);o.push({type:1,index:h,name:x[2],strings:p,ctor:x[1]==="."?Q:x[1]==="?"?F:x[1]==="@"?Y:H}),s.removeAttribute(c)}else c.startsWith(f)&&(o.push({type:6,index:h}),s.removeAttribute(c));if(_t.test(s.tagName)){let c=s.textContent.split(f),_=c.length-1;if(_>0){s.textContent=B?B.emptyScript:"";for(let p=0;p<_;p++)s.append(c[p],C()),m.nextNode(),o.push({type:2,index:++h});s.append(c[_],C())}}}else if(s.nodeType===8)if(s.data===$t)o.push({type:2,index:h});else{let c=-1;for(;(c=s.data.indexOf(f,c+1))!==-1;)o.push({type:7,index:h}),c+=f.length-1}h++}}static createElement(t,e){let i=y.createElement("template");return i.innerHTML=t,i}};function w(n,t,e=n,i){var r,l,o;if(t===I)return t;let s=i!==void 0?(r=e._$Co)==null?void 0:r[i]:e._$Cl,h=M(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==h&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),h===void 0?s=void 0:(s=new h(n),s._$AT(n,e,i)),i!==void 0?((o=e._$Co)!=null?o:e._$Co=[])[i]=s:e._$Cl=s),s!==void 0&&(t=w(n,s._$AS(n,t.values),s,i)),t}var X=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var a;let{el:{content:e},parts:i}=this._$AD,s=((a=t==null?void 0:t.creationScope)!=null?a:y).importNode(e,!0);m.currentNode=s;let h=m.nextNode(),r=0,l=0,o=i[0];for(;o!==void 0;){if(r===o.index){let d;o.type===2?d=new D(h,h.nextSibling,this,t):o.type===1?d=new o.ctor(h,o.name,o.strings,this,t):o.type===6&&(d=new Z(h,this,t)),this._$AV.push(d),o=i[++l]}r!==(o==null?void 0:o.index)&&(h=m.nextNode(),r++)}return m.currentNode=y,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},D=class n{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,i,s){var h;this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(h=s==null?void 0:s.isConnected)!=null?h:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),M(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==I&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):bt(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==u&&M(this._$AH)?this._$AA.nextSibling.data=t:this.$(y.createTextNode(t)),this._$AH=t}g(t){var h;let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=P.createElement(ft(i.h,i.h[0]),this.options)),i);if(((h=this._$AH)==null?void 0:h._$AD)===s)this._$AH.p(e);else{let r=new X(s,this),l=r.u(this.options);r.p(e),this.$(l),this._$AH=r}}_$AC(t){let e=ct.get(t.strings);return e===void 0&&ct.set(t.strings,e=new P(t)),e}T(t){ut(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let h of t)s===e.length?e.push(i=new n(this.k(C()),this.k(C()),this,this.options)):i=e[s],i._$AI(h),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){let s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,h){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=h,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}_$AI(t,e=this,i,s){let h=this.strings,r=!1;if(h===void 0)t=w(this,t,e,0),r=!M(t)||t!==this._$AH&&t!==I,r&&(this._$AH=t);else{let l=t,o,a;for(t=h[0],o=0;o<h.length-1;o++)a=w(this,l[i+o],e,o),a===I&&(a=this._$AH[o]),r||(r=!M(a)||a!==this._$AH[o]),a===u?t=u:t!==u&&(t+=(a!=null?a:"")+h[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},Q=class extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},F=class extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},Y=class extends H{constructor(t,e,i,s,h){super(t,e,i,s,h),this.type=5}_$AI(t,e=this){var r;if((t=(r=w(this,t,e,0))!=null?r:u)===I)return;let i=this._$AH,s=t===u&&i!==u||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,h=t!==u&&(i===u||s);s&&this.element.removeEventListener(this.name,this,i),h&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;typeof this._$AH=="function"?this._$AH.call((i=(e=this.options)==null?void 0:e.host)!=null?i:this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}};var z=S.litHtmlPolyfillSupport,at;z==null||z(P,D),((at=S.litHtmlVersions)!=null?at:S.litHtmlVersions=[]).push("3.0.0");var gt=(n,t,e)=>{var h,r;let i=(h=e==null?void 0:e.renderBefore)!=null?h:t,s=i._$litPart$;if(s===void 0){let l=(r=e==null?void 0:e.renderBefore)!=null?r:null;i._$litPart$=s=new D(t.insertBefore(C(),l),l,void 0,e!=null?e:{})}return s._$AI(n),s};var v,q=class extends HTMLElement{constructor(){super();st(this,v,{})}setState(e){it(this,v,T(T({},U(this,v)),e)),this.updateView()}getState(){return T({},U(this,v))}connectedCallback(){this.updateView()}updateView(){let e=this.template(U(this,v));gt(e,this)}template(e){throw new Error("You have to implement the method template()!")}};v=new WeakMap;var Et=(n,t)=>{if(typeof t!="function")throw new Error("Recipe should be a function");let e=r=>r&&typeof r=="object"&&!Object.isFrozen(r),i=new WeakMap,s=r=>{if(!e(r))return r;if(i.has(r))return i.get(r);let l=Array.isArray(r)?r.slice():T({},r);return i.set(r,l),new Proxy(l,{get(o,a,d){return s(Reflect.get(o,a,d))},set(o,a,d,c){return Reflect.set(o,a,d,c)}})},h=s(n);return t(h),h},L=null,St=n=>{if(L)return L;let t=n,e=[],i={},s=[],h=[],r=!1,l=window.__REDUX_DEVTOOLS_EXTENSION__&&window.__REDUX_DEVTOOLS_EXTENSION__.connect(),o=$=>{s.push($)},a=$=>(e.push($),()=>{let A=e.indexOf($);A>-1&&e.splice(A,1)}),d=($,A)=>{if(i[$])throw new Error(`Action type ${$} is already registered.`);i[$]=A},c=()=>j(void 0,null,function*(){if(h.length===0){r=!1;return}r=!0;let{action:$,payload:A}=h.shift();if(!i[$]){console.warn(`No reducer found for action ${$}`);return}let N={getState:()=>t,dispatch:(b,W)=>_(b,W)};yield s.map(b=>b(N)).reduce((b,W)=>W(b),p)($,A),c()}),_=($,A)=>{h.push({action:$,payload:A}),r||c()},p=($,A)=>j(void 0,null,function*(){let O,N=null;return O=Et(t,G=>{let V=i[$](G,A);if(V instanceof Promise){N=V;return}}),N&&(yield N),t=O,x($),O}),x=$=>{for(let A of e)A(t,$);l&&l.send($,t)};return L={state:t,subscribe:a,register:d,dispatch:_,use:o},L};return Ht(Ct);})();
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
