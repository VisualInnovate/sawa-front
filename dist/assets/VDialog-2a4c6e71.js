import{bh as h,bi as y,bj as x,aZ as E,bk as P,Q as S,bl as D,b9 as f,aC as w,bm as A,f as m,bn as B,q as b,bo as I,aD as O,ao as R}from"./main-f9d3afa8.js";const $=h()({name:"VDialog",props:{fullscreen:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,...y({origin:"center center",scrollStrategy:"block",transition:{component:x},zIndex:2400})},emits:{"update:modelValue":r=>!0},setup(r,g){let{slots:i}=g;const n=E(r,"modelValue"),{scopeId:p}=P(),a=S();function c(t){var e,l;const s=t.relatedTarget,o=t.target;if(s!==o&&(e=a.value)!=null&&e.contentEl&&(l=a.value)!=null&&l.globalTop&&![document,a.value.contentEl].includes(o)&&!a.value.contentEl.contains(o)){const u=[...a.value.contentEl.querySelectorAll('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(v=>!v.hasAttribute("disabled")&&!v.matches('[tabindex="-1"]'));if(!u.length)return;const d=u[0],V=u[u.length-1];s===d?V.focus():d.focus()}}return D&&f(()=>n.value&&r.retainFocus,t=>{t?document.addEventListener("focusin",c):document.removeEventListener("focusin",c)},{immediate:!0}),f(n,async t=>{if(await R(),t){var e;(e=a.value.contentEl)==null||e.focus({preventScroll:!0})}else{var l;(l=a.value.activatorEl)==null||l.focus({preventScroll:!0})}}),w(()=>{const[t]=A(r);return m(I,b({ref:a,class:["v-dialog",{"v-dialog--fullscreen":r.fullscreen,"v-dialog--scrollable":r.scrollable}]},t,{modelValue:n.value,"onUpdate:modelValue":e=>n.value=e,"aria-role":"dialog","aria-modal":"true",activatorProps:b({"aria-haspopup":"dialog","aria-expanded":String(n.value)},r.activatorProps)},p),{activator:i.activator,default:function(){for(var e,l=arguments.length,s=new Array(l),o=0;o<l;o++)s[o]=arguments[o];return m(B,{root:!0},{default:()=>[(e=i.default)==null?void 0:e.call(i,...s)]})}})}),O({},a)}});export{$ as V};
