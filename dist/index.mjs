var P=(()=>{let p=new Map([[1,"This object has been frozen and should not be mutated"],[2,"baseState and producer are incompatibles"],[3,"Cannot merge these types, because they are different types"]]),a=e=>()=>console.log(p.get(e)),y=(...e)=>t=>e.reduce((n,s)=>s(n),t),u=e=>Object.fromEntries(e),d=e=>Reflect.ownKeys(e),i=e=>(e.add=a(1),e.delete=a(1),e.clear=a(1),e),b=e=>(e.set=a(1),e.delete=a(1),e.clear=a(1),e),T=e=>t=>Object.setPrototypeOf(t,e),S=e=>Object.getPrototypeOf(e),c=e=>{let t=Reflect.apply(Object.prototype.toString,e,[]);return t.substring(t.indexOf(" ")+1,t.indexOf("]")).toLowerCase()},w=e=>c(e)==="function",l=e=>c(e)==="undefined",f=e=>Object.freeze(e),r=e=>{switch(c(e)){case"object":return y(u,T(S(e)),f)(d(e).map(t=>[t,r(e[t])]));case"array":return f(e.map(r));case"set":return i(e);case"map":{let t=new Map;return e.forEach((n,s)=>{t.set(s,r(n))}),b(t)}default:return e}};function j(e,t){let n=o(e);if(l(t))return r(n);if(w(t))return t(n),r(n);throw new Error(p.get(3))}let O=e=>e.map(o),x=e=>{let t=Object.getPrototypeOf(e);return y(u,T(t))(d(e).map(n=>[n,o(e[n])]))},g=e=>{let t=new Map;return e.forEach((n,s)=>{t.set(s,o(n))}),t},h=e=>{let t=new Set;return e.forEach(n=>t.add(o(n))),t},o=e=>{switch(c(e)){case"object":return x(e);case"array":return O(e);case"map":return g(e);case"set":return h(e);default:return e}};return{produce:j,deepClone:o,deepFreeze:r}})();export{P as si};
//# sourceMappingURL=index.mjs.map