import{a9 as E,Q as F,R as s,aa as I,S as N,ab as S,r as m,ac as U,i as A,o as n,d as c,e as t,t as d,f as i,w as v,F as w,k,X as R,c as h}from"./main-fd0aa1f8.js";import"./editor.esm-11b3b755.js";import{V as j}from"./VTextarea-8e983afa.js";const L={class:"grid",style:{"max-height":"90vh !important","overflow-y":"scroll"}},O={class:"flex w-full pb-4 px-4 justify-between align-items-center"},Q={class:"m-0 my-auto"},X={class:"block mt-2 md:mt-0 p-input-icon-left"},q=t("i",{class:"pi pi-search"},null,-1),z={class:"col-12"},G={class:"grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1"},H={class:"font-bold text-lg text-slate-800"},J={class:""},K=["onClick"],P={class:""},W={class:"flex flex-column gap-2"},Y={class:"w-full text-right",for:"username"},ae={__name:"Index",setup(Z){E(),F();const _=s(!0),f=s({}),r=s(""),u=s(null),a=s(!1);s(!1),s(""),s(null),s(null);const y=s({});s(!1),s({}),s(!1),I(()=>{D()});const b=e=>{h.get("/api/permissions").then(l=>{_.value=!1,u.value=l.data.permissions})},$=e=>{h.get(`/api/permissions?search=${e}`).then(l=>{_.value=!1,u.value=l.data.permissions})},C=()=>{h.put(`/api/permissions/${f.value.id}/edit`,{description:r.value}).then(e=>{b(),a.value=!a.value})};N(()=>{b()});const V=e=>{a.value=!a.value,r.value=e.description,f.value=e},D=()=>{y.value={global:{value:null,matchMode:S.CONTAINS}}};return(e,l)=>{const B=m("InputText"),g=m("Button"),M=m("Dialog"),T=U("can");return A((n(),c("div",L,[t("div",O,[t("h5",Q,d(e.$t("permissions")),1),t("div",null,[t("span",X,[q,i(B,{"onUpdate:modelValue":$,placeholder:e.$t("search")},null,8,["placeholder"])])])]),t("div",z,[i(R,{class:"card shadow-md"},{default:v(()=>[t("div",G,[(n(!0),c(w,null,k(u.value,(o,x)=>(n(),c("div",{class:"p-4",key:x},[t("h3",H,d(x),1),(n(!0),c(w,null,k(o,p=>(n(),c("div",{class:"flex py-[1px]",key:p.id},[t("p",J,d(p.name),1),t("i",{onClick:ee=>V(p),class:"pi pi-arrow-left px-4 my-auto text-base text-[#135C65]"},null,8,K)]))),128))]))),128))]),i(M,{visible:a.value,"onUpdate:visible":l[2]||(l[2]=o=>a.value=o),style:{width:"550px"},header:e.$t("submit"),modal:!0},{footer:v(()=>[i(g,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[1]||(l[1]=o=>a.value=!1)},null,8,["label"]),i(g,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:C},null,8,["label"])]),default:v(()=>[t("div",P,[t("div",W,[t("label",Y,d(e.$t("description")),1),i(j,{"bg-color":"#EAE8E9",rows:"3",modelValue:r.value,"onUpdate:modelValue":l[0]||(l[0]=o=>r.value=o)},null,8,["modelValue"])])])]),_:1},8,["visible","header"])]),_:1})])])),[[T,"permissions list"]])}}};export{ae as default};
