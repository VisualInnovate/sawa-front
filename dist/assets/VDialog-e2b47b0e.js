import{bh as h,bi as y,bj as E,aJ as x,bk as P,S,bl as D,aL as f,aC as w,bm as A,f as m,bn as B,E as b,bo as I,aD as O,an as R}from"./main-0eeefd6e.js";const $=h()({name:"VDialog",props:{fullscreen:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,...y({origin:"center center",scrollStrategy:"block",transition:{component:E},zIndex:2400})},emits:{"update:modelValue":n=>!0},setup(n,g){let{slots:i}=g;const r=x(n,"modelValue"),{scopeId:p}=P(),a=S();function c(t){var e,l;const s=t.relatedTarget,o=t.target;if(s!==o&&(e=a.value)!=null&&e.contentEl&&(l=a.value)!=null&&l.globalTop&&![document,a.value.contentEl].includes(o)&&!a.value.contentEl.contains(o)){const u=[...a.value.contentEl.querySelectorAll('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(v=>!v.hasAttribute("disabled")&&!v.matches('[tabindex="-1"]'));if(!u.length)return;const d=u[0],V=u[u.length-1];s===d?V.focus():d.focus()}}return D&&f(()=>r.value&&n.retainFocus,t=>{t?document.addEventListener("focusin",c):document.removeEventListener("focusin",c)},{immediate:!0}),f(r,async t=>{if(await R(),t){var e;(e=a.value.contentEl)==null||e.focus({preventScroll:!0})}else{var l;(l=a.value.activatorEl)==null||l.focus({preventScroll:!0})}}),w(()=>{const[t]=A(n);return m(I,b({ref:a,class:["v-dialog",{"v-dialog--fullscreen":n.fullscreen,"v-dialog--scrollable":n.scrollable}]},t,{modelValue:r.value,"onUpdate:modelValue":e=>r.value=e,"aria-role":"dialog","aria-modal":"true",activatorProps:b({"aria-haspopup":"dialog","aria-expanded":String(r.value)},n.activatorProps)},p),{activator:i.activator,default:function(){for(var e,l=arguments.length,s=new Array(l),o=0;o<l;o++)s[o]=arguments[o];return m(B,{root:!0},{default:()=>[(e=i.default)==null?void 0:e.call(i,...s)]})}})}),O({},a)}});export{$ as V};
