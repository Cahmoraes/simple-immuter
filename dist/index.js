"use strict";var p=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var q=Object.getOwnPropertyNames;var G=Object.prototype.hasOwnProperty;var H=(s,a)=>{for(var i in a)p(s,i,{get:a[i],enumerable:!0})},J=(s,a,i,f)=>{if(a&&typeof a=="object"||typeof a=="function")for(let y of q(a))!G.call(s,y)&&y!==i&&p(s,y,{get:()=>a[y],enumerable:!(f=U(a,y))||f.enumerable});return s};var N=s=>J(p({},"__esModule",{value:!0}),s);var X={};H(X,{default:()=>W});module.exports=N(X);var Q=(()=>{let s=new Map([[1,"This object has been frozen and should not be mutated"],[2,"baseState and producer are incompatibles"],[3,"Cannot merge these types, because they are different types"]]),a=t=>()=>console.log(s.get(t)),i=(...t)=>n=>t.reduce((r,e)=>e(r),n),f=(t,n=1/0)=>o(t)!=="array"?t:n>0?t.reduce((r,e)=>r.concat(f(e,--n)),[]):t,y=t=>Object.fromEntries(t),b=t=>Reflect.ownKeys(t),l=t=>(t.add=a(1),t.delete=a(1),t.clear=a(1),t),P=t=>(t.set=a(1),t.delete=a(1),t.clear=a(1),t),w=t=>n=>Object.setPrototypeOf(n,t),S=t=>Object.getPrototypeOf(t),o=t=>{let n=Reflect.apply(Object.prototype.toString,t,[]);return n.substring(n.indexOf(" ")+1,n.indexOf("]")).toLowerCase()},k=t=>o(t)==="array",A=t=>o(t)==="object",T=t=>o(t)==="function",E=t=>o(t)==="promise",j=t=>o(t)==="undefined",M=(...t)=>{for(let n=0,r=n+1;r<t.length;r=n+1,n++)if(o(t[n])!==o(t[r]))return!0;return!1},v=t=>t.every(k),K=t=>t.every(A),d=t=>(...n)=>n.every(r=>o(r)===t),O=d("object"),g=d("array"),h=t=>Object.freeze(t),D=(t,n,r)=>{if(O(t,n)&&K(r))try{return c(Object.assign(t,n,...r))}catch{throw new Error(s.get(2))}if(g(t,n)&&v(r))try{return c([...t,...n,...f(r,1)])}catch{throw new Error(s.get(2))}throw new Error(s.get(3))},c=t=>{switch(o(t)){case"object":return i(y,w(S(t)),h)(b(t).map(n=>[n,c(t[n])]));case"array":return h(t.map(c));case"set":return l(t);case"map":{let n=new Map;return t.forEach((r,e)=>{n.set(e,c(r))}),P(n)}default:return t}},x=async(t,n)=>{try{let r=await t;if(j(n))return c(r);if(T(n))return n(r),c(r)}catch(r){return new Error(r)}},R=(t,n,...r)=>{if(E(t))return x(t,n);let e=u(t);if(j(n))return c(e);if(T(n))return n(e),c(e);if(r.length>0)return D(e,n,r);if(O(e,n))return c(Object.assign(e,n));if(g(e,n)&&Array.isArray(n))return c([...e,...n]);throw M(e,n)?new Error(s.get(2)):new Error(s.get(3))},V=t=>t.map(u),B=t=>{let n=Object.getPrototypeOf(t);return i(y,w(n))(b(t).map(r=>[r,u(t[r])]))},C=t=>{let n=new Map;return t.forEach((r,e)=>{n.set(e,u(r))}),n},L=t=>{let n=new Set;return t.forEach(r=>n.add(u(r))),n},u=t=>{switch(o(t)){case"object":return B(t);case"array":return V(t);case"map":return C(t);case"set":return L(t);default:return t}};return{produce:R}})(),W=Q;0&&(module.exports={});
//# sourceMappingURL=index.js.map