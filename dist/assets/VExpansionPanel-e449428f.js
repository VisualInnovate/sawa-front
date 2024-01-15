import{aw as p,bz as T,aC as g,aM as w,bA as _,aR as A,aD as c,aT as B,aV as m,az as x,q as l,bB as G,aG as y,bC as $,bD as P,bl as S,w as V,ao as D,G as R,bE as I,bF as z,v as L,bG as j,aJ as F,bH as J,aK as q,bI as H,bo as K,br as M,bJ as N}from"./main-201c6ce7.js";const r=Symbol.for("vuetify:v-expansion-panel"),O=["default","accordion","inset","popout"],X=p({name:"VExpansionPanels",props:{color:String,variant:{type:String,default:"default",validator:e=>O.includes(e)},readonly:Boolean,...T(),...g(),...w()},emits:{"update:modelValue":e=>!0},setup(e,o){let{slots:n}=o;_(e,r);const{themeClasses:a}=A(e),i=c(()=>e.variant&&`v-expansion-panels--variant-${e.variant}`);return B({VExpansionPanel:{color:m(e,"color")},VExpansionPanelTitle:{readonly:m(e,"readonly")}}),x(()=>l(e.tag,{class:["v-expansion-panels",a.value,i.value]},n)),{}}}),E=G({color:String,expandIcon:{type:y,default:"$expand"},collapseIcon:{type:y,default:"$collapse"},hideActions:Boolean,ripple:{type:[Boolean,Object],default:!1},readonly:Boolean},"v-expansion-panel-title"),Q=p({name:"VExpansionPanelTitle",directives:{Ripple:$},props:{...E()},setup(e,o){let{slots:n}=o;const a=P(r);if(!a)throw new Error("[Vuetify] v-expansion-panel-title needs to be placed inside v-expansion-panel");const{backgroundColorClasses:i,backgroundColorStyles:u}=S(e,"color"),d=c(()=>({collapseIcon:e.collapseIcon,disabled:a.disabled.value,expanded:a.isSelected.value,expandIcon:e.expandIcon,readonly:e.readonly}));return x(()=>{var v;return V(l("button",{class:["v-expansion-panel-title",{"v-expansion-panel-title--active":a.isSelected.value},i.value],style:u.value,type:"button",tabindex:a.disabled.value?-1:void 0,disabled:a.disabled.value,"aria-expanded":a.isSelected.value,onClick:e.readonly?void 0:a.toggle},[l("span",{class:"v-expansion-panel-title__overlay"},null),(v=n.default)==null?void 0:v.call(n,d.value),!e.hideActions&&l("span",{class:"v-expansion-panel-title__icon"},[n.actions?n.actions(d.value):l(R,{icon:a.isSelected.value?e.collapseIcon:e.expandIcon},null)])]),[[D("ripple"),e.ripple]])}),{}}}),U=p({name:"VExpansionPanelText",props:{...I()},setup(e,o){let{slots:n}=o;const a=P(r);if(!a)throw new Error("[Vuetify] v-expansion-panel-text needs to be placed inside v-expansion-panel");const{hasContent:i,onAfterLeave:u}=z(e,a.isSelected);return x(()=>{var d;return l(j,{onAfterLeave:u},{default:()=>[V(l("div",{class:"v-expansion-panel-text"},[n.default&&i.value&&l("div",{class:"v-expansion-panel-text__wrapper"},[(d=n.default)==null?void 0:d.call(n)])]),[[L,a.isSelected.value]])]})}),{}}}),Y=p({name:"VExpansionPanel",props:{title:String,text:String,bgColor:String,...F(),...J(),...I(),...q(),...g(),...E()},emits:{"group:selected":e=>!0},setup(e,o){let{slots:n}=o;const a=H(e,r),{backgroundColorClasses:i,backgroundColorStyles:u}=S(e,"bgColor"),{elevationClasses:d}=K(e),{roundedClasses:v}=M(e),C=c(()=>(a==null?void 0:a.disabled.value)||e.disabled),f=c(()=>a.group.items.value.reduce((s,t,b)=>(a.group.selected.value.includes(t.id)&&s.push(b),s),[])),h=c(()=>{const s=a.group.items.value.findIndex(t=>t.id===a.id);return!a.isSelected.value&&f.value.some(t=>t-s===1)}),k=c(()=>{const s=a.group.items.value.findIndex(t=>t.id===a.id);return!a.isSelected.value&&f.value.some(t=>t-s===-1)});return N(r,a),x(()=>{var s;const t=!!(n.text||e.text),b=!!(n.title||e.title);return l(e.tag,{class:["v-expansion-panel",{"v-expansion-panel--active":a.isSelected.value,"v-expansion-panel--before-active":h.value,"v-expansion-panel--after-active":k.value,"v-expansion-panel--disabled":C.value},v.value,i.value],style:u.value,"aria-expanded":a.isSelected.value},{default:()=>[l("div",{class:["v-expansion-panel__shadow",...d.value]},null),b&&l(Q,{key:"title",collapseIcon:e.collapseIcon,color:e.color,expandIcon:e.expandIcon,hideActions:e.hideActions,ripple:e.ripple},{default:()=>[n.title?n.title():e.title]}),t&&l(U,{key:"text",eager:e.eager},{default:()=>[n.text?n.text():e.text]}),(s=n.default)==null?void 0:s.call(n)]})}),{}}});export{Q as V,U as a,X as b,Y as c};
