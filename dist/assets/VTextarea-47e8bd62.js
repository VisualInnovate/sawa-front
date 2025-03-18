import{an as Q,ao as W,ap as X,aq as Y,ar as Z,as as ee,at as V,q as f,a0 as te,au as v,av as ae,aw as ne,ax as le,ay as _,az as oe,aA as ue,aB as ie,aC as re,f as a,aD as se,K as P,F as I,i as N,aj as ce,v as de,aE as fe,aF as ve,aG as xe,aH as ge}from"./main-8a344e1a.js";const he=Q({name:"VTextarea",directives:{Intersect:W},inheritAttrs:!1,props:{autoGrow:Boolean,autofocus:Boolean,counter:[Boolean,Number,String],counterValue:Function,hint:String,persistentHint:Boolean,prefix:String,placeholder:String,persistentPlaceholder:Boolean,persistentCounter:Boolean,noResize:Boolean,rows:{type:[Number,String],default:5,validator:e=>!isNaN(parseFloat(e))},maxRows:{type:[Number,String],validator:e=>!isNaN(parseFloat(e))},suffix:String,...X(),...Y()},emits:{"click:control":e=>!0,"update:focused":e=>!0,"update:modelValue":e=>!0},setup(e,z){let{attrs:y,emit:$,slots:u}=z;const n=Z(e,"modelValue"),{isFocused:c,focus:p,blur:A}=ee(e),D=V(()=>typeof e.counterValue=="function"?e.counterValue(n.value):(n.value||"").toString().length),G=V(()=>{if(y.maxlength)return y.maxlength;if(!(!e.counter||typeof e.counter!="number"&&typeof e.counter!="string"))return e.counter});function T(t,l){var o,s;!e.autofocus||!t||(o=l[0].target)==null||(s=o.focus)==null||s.call(o)}const b=f(),x=f(),R=f(""),g=f(),S=V(()=>c.value||e.persistentPlaceholder),M=V(()=>e.messages.length?e.messages:S.value||e.persistentHint?e.hint:"");function C(){if(g.value!==document.activeElement){var t;(t=g.value)==null||t.focus()}c.value||p()}function U(t){C(),$("click:control",t)}function E(t){t.stopPropagation(),C(),_(()=>{n.value="",xe(e["onClick:clear"],t)})}function q(t){n.value=t.target.value}const i=f();function r(){e.autoGrow&&_(()=>{if(!i.value||!x.value)return;const t=getComputedStyle(i.value),l=getComputedStyle(x.value.$el),o=parseFloat(t.getPropertyValue("--v-field-padding-top"))+parseFloat(t.getPropertyValue("--v-input-padding-top"))+parseFloat(t.getPropertyValue("--v-field-padding-bottom")),s=i.value.scrollHeight,F=parseFloat(t.lineHeight),w=Math.max(parseFloat(e.rows)*F+o,parseFloat(l.getPropertyValue("--v-input-control-height"))),k=parseFloat(e.maxRows)*F+o||1/0;R.value=oe(ge(s??0,w,k))})}te(r),v(n,r),v(()=>e.rows,r),v(()=>e.maxRows,r),v(()=>e.density,r);let m;return v(i,t=>{if(t)m=new ResizeObserver(r),m.observe(i.value);else{var l;(l=m)==null||l.disconnect()}}),ae(()=>{var t;(t=m)==null||t.disconnect()}),ne(()=>{const t=!!(u.counter||e.counter||e.counterValue),l=!!(t||u.details),[o,s]=ue(y),[{modelValue:F,...w}]=ie(e),[k]=re(e);return a(ve,P({ref:b,modelValue:n.value,"onUpdate:modelValue":d=>n.value=d,class:["v-textarea v-text-field",{"v-textarea--prefixed":e.prefix,"v-textarea--suffixed":e.suffix,"v-text-field--prefixed":e.prefix,"v-text-field--suffixed":e.suffix,"v-textarea--auto-grow":e.autoGrow,"v-textarea--no-resize":e.noResize||e.autoGrow,"v-text-field--flush-details":["plain","underlined"].includes(e.variant)}],"onClick:prepend":e["onClick:prepend"],"onClick:append":e["onClick:append"]},o,w,{focused:c.value,messages:M.value}),{...u,default:d=>{let{isDisabled:h,isDirty:B,isReadonly:j,isValid:K}=d;return a(se,P({ref:x,style:{"--v-textarea-control-height":R.value},"onClick:control":U,"onClick:clear":E,"onClick:prependInner":e["onClick:prependInner"],"onClick:appendInner":e["onClick:appendInner"],role:"textbox"},k,{active:S.value||B.value,dirty:B.value||e.dirty,focused:c.value,error:K.value===!1}),{...u,default:O=>{let{props:{class:H,...J}}=O;return a(I,null,[e.prefix&&a("span",{class:"v-text-field__prefix"},[e.prefix]),N(a("textarea",P({ref:g,class:H,value:n.value,onInput:q,autofocus:e.autofocus,readonly:j.value,disabled:h.value,placeholder:e.placeholder,rows:e.rows,name:e.name,onFocus:C,onBlur:A},J,s),null),[[ce("intersect"),{handler:T},null,{once:!0}]]),e.autoGrow&&N(a("textarea",{class:[H,"v-textarea__sizer"],"onUpdate:modelValue":L=>n.value=L,ref:i,readonly:!0,"aria-hidden":"true"},null),[[de,n.value]]),e.suffix&&a("span",{class:"v-text-field__suffix"},[e.suffix])])}})},details:l?d=>{var h;return a(I,null,[(h=u.details)==null?void 0:h.call(u,d),t&&a(I,null,[a("span",null,null),a(fe,{active:e.persistentCounter||c.value,value:D.value,max:G.value},u.counter)])])}:void 0})}),le({},b,x,g)}});export{he as V};
