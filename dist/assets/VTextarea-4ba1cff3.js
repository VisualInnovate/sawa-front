import{az as K,b7 as Q,aH as W,b8 as X,aZ as Y,aJ as ee,ai as V,R as f,S as te,b9 as v,ba as ae,aC as ne,aL as le,aM as oe,bb as ue,f as a,bc as ie,q as k,F as P,i as _,ac as re,v as se,bd as ce,aP as de,aD as fe,ao as N,be as ve,bf as xe,bg as ge}from"./main-d5d5ddd5.js";const he=K({name:"VTextarea",directives:{Intersect:Q},inheritAttrs:!1,props:{autoGrow:Boolean,autofocus:Boolean,counter:[Boolean,Number,String],counterValue:Function,hint:String,persistentHint:Boolean,prefix:String,placeholder:String,persistentPlaceholder:Boolean,persistentCounter:Boolean,noResize:Boolean,rows:{type:[Number,String],default:5,validator:e=>!isNaN(parseFloat(e))},maxRows:{type:[Number,String],validator:e=>!isNaN(parseFloat(e))},suffix:String,...W(),...X()},emits:{"click:control":e=>!0,"update:focused":e=>!0,"update:modelValue":e=>!0},setup(e,z){let{attrs:b,emit:$,slots:u}=z;const n=Y(e,"modelValue"),{isFocused:c,focus:D,blur:T}=ee(e),p=V(()=>typeof e.counterValue=="function"?e.counterValue(n.value):(n.value||"").toString().length),A=V(()=>{if(b.maxlength)return b.maxlength;if(!(!e.counter||typeof e.counter!="number"&&typeof e.counter!="string"))return e.counter});function G(t,l){var o,s;!e.autofocus||!t||(o=l[0].target)==null||(s=o.focus)==null||s.call(o)}const I=f(),x=f(),R=f(""),g=f(),S=V(()=>c.value||e.persistentPlaceholder),M=V(()=>e.messages.length?e.messages:S.value||e.persistentHint?e.hint:"");function C(){if(g.value!==document.activeElement){var t;(t=g.value)==null||t.focus()}c.value||D()}function U(t){C(),$("click:control",t)}function E(t){t.stopPropagation(),C(),N(()=>{n.value="",ve(e["onClick:clear"],t)})}function q(t){n.value=t.target.value}const i=f();function r(){e.autoGrow&&N(()=>{if(!i.value||!x.value)return;const t=getComputedStyle(i.value),l=getComputedStyle(x.value.$el),o=parseFloat(t.getPropertyValue("--v-field-padding-top"))+parseFloat(t.getPropertyValue("--v-input-padding-top"))+parseFloat(t.getPropertyValue("--v-field-padding-bottom")),s=i.value.scrollHeight,y=parseFloat(t.lineHeight),F=Math.max(parseFloat(e.rows)*y+o,parseFloat(l.getPropertyValue("--v-input-control-height"))),w=parseFloat(e.maxRows)*y+o||1/0;R.value=xe(ge(s??0,F,w))})}te(r),v(n,r),v(()=>e.rows,r),v(()=>e.maxRows,r),v(()=>e.density,r);let m;return v(i,t=>{if(t)m=new ResizeObserver(r),m.observe(i.value);else{var l;(l=m)==null||l.disconnect()}}),ae(()=>{var t;(t=m)==null||t.disconnect()}),ne(()=>{const t=!!(u.counter||e.counter||e.counterValue),l=!!(t||u.details),[o,s]=le(b),[{modelValue:y,...F}]=oe(e),[w]=ue(e);return a(de,k({ref:I,modelValue:n.value,"onUpdate:modelValue":d=>n.value=d,class:["v-textarea v-text-field",{"v-textarea--prefixed":e.prefix,"v-textarea--suffixed":e.suffix,"v-text-field--prefixed":e.prefix,"v-text-field--suffixed":e.suffix,"v-textarea--auto-grow":e.autoGrow,"v-textarea--no-resize":e.noResize||e.autoGrow,"v-text-field--flush-details":["plain","underlined"].includes(e.variant)}],"onClick:prepend":e["onClick:prepend"],"onClick:append":e["onClick:append"]},o,F,{focused:c.value,messages:M.value}),{...u,default:d=>{let{isDisabled:h,isDirty:H,isReadonly:J,isValid:L}=d;return a(ie,k({ref:x,style:{"--v-textarea-control-height":R.value},"onClick:control":U,"onClick:clear":E,"onClick:prependInner":e["onClick:prependInner"],"onClick:appendInner":e["onClick:appendInner"],role:"textbox"},w,{active:S.value||H.value,dirty:H.value||e.dirty,focused:c.value,error:L.value===!1}),{...u,default:O=>{let{props:{class:B,...Z}}=O;return a(P,null,[e.prefix&&a("span",{class:"v-text-field__prefix"},[e.prefix]),_(a("textarea",k({ref:g,class:B,value:n.value,onInput:q,autofocus:e.autofocus,readonly:J.value,disabled:h.value,placeholder:e.placeholder,rows:e.rows,name:e.name,onFocus:C,onBlur:T},Z,s),null),[[re("intersect"),{handler:G},null,{once:!0}]]),e.autoGrow&&_(a("textarea",{class:[B,"v-textarea__sizer"],"onUpdate:modelValue":j=>n.value=j,ref:i,readonly:!0,"aria-hidden":"true"},null),[[se,n.value]]),e.suffix&&a("span",{class:"v-text-field__suffix"},[e.suffix])])}})},details:l?d=>{var h;return a(P,null,[(h=u.details)==null?void 0:h.call(u,d),t&&a(P,null,[a("span",null,null),a(ce,{active:e.persistentCounter||c.value,value:p.value,max:A.value},u.counter)])])}:void 0})}),fe({},I,x,g)}});export{he as V};
