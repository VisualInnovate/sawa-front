import{m as E,W as F,q as s,ac as I,X as N,ad as S,r as m,ae as U,i as A,o as n,d as c,e as t,t as d,f as i,g as v,F as w,x as k,a0 as j,c as h}from"./main-bc2568df.js";import"./editor.esm-11b3b755.js";import{V as q}from"./VTextarea-163b0a1b.js";const L={class:"grid",style:{"max-height":"90vh !important","overflow-y":"scroll"}},O={class:"flex w-full pb-4 px-4 justify-between align-items-center"},R={class:"m-0 my-auto"},W={class:"block mt-2 md:mt-0 p-input-icon-left"},X=t("i",{class:"pi pi-search"},null,-1),z={class:"col-12"},G={class:"grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1"},H={class:"font-bold text-lg text-slate-800"},J={class:""},K=["onClick"],P={class:""},Q={class:"flex flex-column gap-2"},Y={class:"w-full text-right",for:"username"},oe={__name:"Index",setup(Z){E(),F();const _=s(!0),f=s({}),r=s(""),u=s(null),o=s(!1);s(!1),s(""),s(null),s(null);const y=s({});s(!1),s({}),s(!1),I(()=>{D()});const g=e=>{h.get("/api/permissions").then(l=>{_.value=!1,u.value=l.data.permissions})},$=e=>{h.get(`/api/permissions?search=${e}`).then(l=>{_.value=!1,u.value=l.data.permissions})},C=()=>{h.put(`/api/permissions/${f.value.id}/edit`,{description:r.value}).then(e=>{g(),o.value=!o.value})};N(()=>{g()});const V=e=>{o.value=!o.value,r.value=e.description,f.value=e},D=()=>{y.value={global:{value:null,matchMode:S.CONTAINS}}};return(e,l)=>{const B=m("InputText"),x=m("Button"),M=m("Dialog"),T=U("can");return A((n(),c("div",L,[t("div",O,[t("h5",R,d(e.$t("permissions")),1),t("div",null,[t("span",W,[X,i(B,{"onUpdate:modelValue":$,placeholder:e.$t("search")},null,8,["placeholder"])])])]),t("div",z,[i(j,{class:"card shadow-md"},{default:v(()=>[t("div",G,[(n(!0),c(w,null,k(u.value,(a,b)=>(n(),c("div",{class:"p-4",key:b},[t("h3",H,d(b),1),(n(!0),c(w,null,k(a,p=>(n(),c("div",{class:"flex py-[1px]",key:p.id},[t("p",J,d(p.name),1),t("i",{onClick:ee=>V(p),class:"pi pi-arrow-left px-4 my-auto text-base text-[#135C65]"},null,8,K)]))),128))]))),128))]),i(M,{visible:o.value,"onUpdate:visible":l[2]||(l[2]=a=>o.value=a),style:{width:"550px"},header:e.$t("submit"),modal:!0},{footer:v(()=>[i(x,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[1]||(l[1]=a=>o.value=!1)},null,8,["label"]),i(x,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:C},null,8,["label"])]),default:v(()=>[t("div",P,[t("div",Q,[t("label",Y,d(e.$t("description")),1),i(q,{"bg-color":"#EAE8E9",rows:"3",modelValue:r.value,"onUpdate:modelValue":l[0]||(l[0]=a=>r.value=a)},null,8,["modelValue"])])])]),_:1},8,["visible","header"])]),_:1})])])),[[T,"permissions list"]])}}};export{oe as default};
