import{az as C,aH as P,aI as v,aJ as I,aK as A,ai as B,aC as g,aL as y,aM as F,aN as N,f as a,aO as R,q as t,aP as _}from"./main-d5d5ddd5.js";const D=C({name:"VCheckbox",inheritAttrs:!1,props:{...P(),...v()},emits:{"update:focused":e=>!0},setup(e,o){let{attrs:r,slots:s}=o;const{isFocused:c,focus:u,blur:n}=I(e),d=A(),i=B(()=>e.id||`checkbox-${d}`);return g(()=>{const[l,p]=y(r),[b,$]=F(e),[f,q]=N(e);return a(_,t({class:"v-checkbox"},l,b,{id:i.value,focused:c.value}),{...s,default:k=>{let{id:h,messagesId:m,isDisabled:x,isReadonly:V}=k;return a(R,t(f,{id:h.value,"aria-describedby":m.value,disabled:x.value,readonly:V.value},p,{onFocus:u,onBlur:n}),s)}})}),{}}});export{D as V};
