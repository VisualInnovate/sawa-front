import{aw as v,aZ as C,a_ as P,a$ as I,b0 as A,aD as B,az as g,b1 as y,b2 as F,b3 as _,x as t,b4 as $,m as a,b5 as D}from"./main-d9195fcd.js";const N=v({name:"VCheckbox",inheritAttrs:!1,props:{...C(),...P()},emits:{"update:focused":e=>!0},setup(e,o){let{attrs:r,slots:s}=o;const{isFocused:c,focus:u,blur:n}=I(e),d=A(),i=B(()=>e.id||`checkbox-${d}`);return g(()=>{const[l,b]=y(r),[p,R]=F(e),[f,w]=_(e);return t(D,a({class:"v-checkbox"},l,p,{id:i.value,focused:c.value}),{...s,default:k=>{let{id:m,messagesId:x,isDisabled:h,isReadonly:V}=k;return t($,a(f,{id:m.value,"aria-describedby":x.value,disabled:h.value,readonly:V.value},b,{onFocus:u,onBlur:n}),s)}})}),{}}});export{N as V};
