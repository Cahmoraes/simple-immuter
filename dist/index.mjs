var g=(()=>{let d=new Map([[1,"This object has been frozen and should not be mutated"],[2,"baseState and producer are incompatibles"],[3,"Cannot merge these types, because they are different types"]]),a=e=>()=>console.log(d.get(e)),p=(...e)=>t=>e.reduce((n,s)=>s(n),t),u=e=>Object.fromEntries(e),T=e=>Reflect.ownKeys(e),i=e=>(e.add=a(1),e.delete=a(1),e.clear=a(1),y(e)),b=e=>(e.set=a(1),e.delete=a(1),e.clear=a(1),y(e)),f=e=>t=>Object.setPrototypeOf(t,e),l=e=>Object.getPrototypeOf(e),c=e=>{let t=Reflect.apply(Object.prototype.toString,e,[]);return t.substring(t.indexOf(" ")+1,t.indexOf("]")).toLowerCase()},w=e=>c(e)==="function",S=e=>c(e)==="undefined",y=e=>Object.freeze(e),o=e=>{switch(c(e)){case"object":return p(u,f(l(e)),y)(T(e).map(t=>[t,o(e[t])]));case"array":return y(e.map(o));case"set":return i(e);case"map":{let t=new Map;return e.forEach((n,s)=>{t.set(s,o(n))}),b(t)}default:return e}};function j(e,t){let n=r(e);if(S(t))return o(n);if(w(t))return t(n),o(n);throw new Error(d.get(3))}let O=e=>e.map(r),k=e=>{let t=Object.getPrototypeOf(e);return p(u,f(t))(T(e).map(n=>[n,r(e[n])]))},x=e=>{let t=new Map;return e.forEach((n,s)=>{t.set(s,r(n))}),t},R=e=>{let t=new Set;return e.forEach(n=>t.add(r(n))),t},r=e=>{switch(c(e)){case"object":return k(e);case"array":return O(e);case"map":return x(e);case"set":return R(e);default:return e}};return{produce:j,deepClone:r,deepFreeze:o}})();export{g as si};
//# sourceMappingURL=index.mjs.map