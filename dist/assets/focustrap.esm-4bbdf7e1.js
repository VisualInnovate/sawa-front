import{I as n,O as p}from"./main-0ea29110.js";function d(e,t){const{onFocusIn:s,onFocusOut:o}=t.value||{};e.$_pfocustrap_mutationobserver=new MutationObserver(c=>{c.forEach(u=>{if(u.type==="childList"&&!e.contains(document.activeElement)){const r=a=>{const f=n.isFocusableElement(a)?a:n.getFirstFocusableElement(a);return p.isNotEmpty(f)?f:r(a.nextSibling)};n.focus(r(u.nextSibling))}})}),e.$_pfocustrap_mutationobserver.disconnect(),e.$_pfocustrap_mutationobserver.observe(e,{childList:!0}),e.$_pfocustrap_focusinlistener=c=>s&&s(c),e.$_pfocustrap_focusoutlistener=c=>o&&o(c),e.addEventListener("focusin",e.$_pfocustrap_focusinlistener),e.addEventListener("focusout",e.$_pfocustrap_focusoutlistener)}function l(e){e.$_pfocustrap_mutationobserver&&e.$_pfocustrap_mutationobserver.disconnect(),e.$_pfocustrap_focusinlistener&&e.removeEventListener("focusin",e.$_pfocustrap_focusinlistener)&&(e.$_pfocustrap_focusinlistener=null),e.$_pfocustrap_focusoutlistener&&e.removeEventListener("focusout",e.$_pfocustrap_focusoutlistener)&&(e.$_pfocustrap_focusoutlistener=null)}function _(e,t){const{autoFocusSelector:s="",firstFocusableSelector:o="",autoFocus:c=!1}=t.value||{};let u=n.getFirstFocusableElement(e,`[autofocus]:not(.p-hidden-focusable)${s}`);c&&!u&&(u=n.getFirstFocusableElement(e,`:not(.p-hidden-focusable)${o}`)),n.focus(u)}function b(e){const{currentTarget:t,relatedTarget:s}=e,o=s===t.$_pfocustrap_lasthiddenfocusableelement?n.getFirstFocusableElement(t.parentElement,`:not(.p-hidden-focusable)${t.$_pfocustrap_focusableselector}`):t.$_pfocustrap_lasthiddenfocusableelement;n.focus(o)}function m(e){const{currentTarget:t,relatedTarget:s}=e,o=s===t.$_pfocustrap_firsthiddenfocusableelement?n.getLastFocusableElement(t.parentElement,`:not(.p-hidden-focusable)${t.$_pfocustrap_focusableselector}`):t.$_pfocustrap_firsthiddenfocusableelement;n.focus(o)}function $(e,t){const{tabIndex:s=0,firstFocusableSelector:o="",lastFocusableSelector:c=""}=t.value||{},u=f=>{const i=document.createElement("span");return i.classList="p-hidden-accessible p-hidden-focusable",i.tabIndex=s,i.setAttribute("aria-hidden","true"),i.setAttribute("role","presentation"),i.addEventListener("focus",f),i},r=u(b),a=u(m);r.$_pfocustrap_lasthiddenfocusableelement=a,r.$_pfocustrap_focusableselector=o,a.$_pfocustrap_firsthiddenfocusableelement=r,a.$_pfocustrap_focusableselector=c,e.prepend(r),e.append(a)}const F={mounted(e,t){const{disabled:s}=t.value||{};s||($(e,t),d(e,t),_(e,t))},updated(e,t){const{disabled:s}=t.value||{};s&&l(e)},unmounted(e){l(e)}};export{F};
