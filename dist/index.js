"use strict";var i=Object.defineProperty;var M=Object.getOwnPropertyDescriptor;var j=Object.getOwnPropertyNames;var O=Object.prototype.hasOwnProperty;var P=(a,t)=>{for(var u in t)i(a,u,{get:t[u],enumerable:!0})},B=(a,t,u,T)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of j(t))!O.call(a,o)&&o!==u&&i(a,o,{get:()=>t[o],enumerable:!(T=M(t,o))||T.enumerable});return a};var K=a=>B(i({},"__esModule",{value:!0}),a);var v={};P(v,{si:()=>S});module.exports=K(v);var S=(()=>{let a=new Map([[1,"This object has been frozen and should not be mutated"],[2,"baseState and producer are incompatibles"],[3,"Cannot merge these types, because they are different types"]]),t=e=>()=>console.log(a.get(e)),u=e=>(e.add=t(1),e.delete=t(1),e.clear=t(1),p(e)),T=e=>(e.set=t(1),e.delete=t(1),e.clear=t(1),p(e)),o=e=>{let n=Reflect.apply(Object.prototype.toString,e,[]);return n.substring(n.indexOf(" ")+1,n.indexOf("]")).toLowerCase()},b=e=>o(e)==="function",k=e=>o(e)==="undefined",p=e=>Object.freeze(e),c=e=>{switch(o(e)){case"object":return p(l(e,c));case"date":return p(w(e));case"array":return p(e.map(c));case"set":return u(e);case"map":{let n=new Map;return e.forEach((r,s)=>{n.set(s,c(r))}),T(n)}default:return e}};function R(e,n){let r=d(e);if(k(n))return c(r);if(b(n)){let s=n(r);return c(s||r)}throw new Error(a.get(3))}let l=(e,n)=>{let r=Object.getOwnPropertyDescriptors(e),s=Object.create(Object.getPrototypeOf(e),r);for(let y of Reflect.ownKeys(r))!C(y)||(s[y]=n(Reflect.get(e,y)));return s;function C(y){return r[String(y)]&&Reflect.has(r[String(y)],"value")}},g=e=>e.map(d),x=e=>l(e,d),w=e=>new Date(e),D=e=>{let n=new Map;return e.forEach((r,s)=>{n.set(s,d(r))}),n},h=e=>{let n=new Set;return e.forEach(r=>n.add(d(r))),n};function f(e,n){if(o(e)!==n)throw new Error(`element is not type of [${n}]`)}let d=e=>{switch(o(e)){case"object":return x(e);case"array":return f(e,"array"),g(e);case"map":return f(e,"map"),D(e);case"set":return f(e,"set"),h(e);case"date":return f(e,"date"),w(e);default:return e}};return{produce:R,cloneDeep:d,freezeDeep:c}})();0&&(module.exports={si});
//# sourceMappingURL=index.js.map