import{a9 as A,Q as E,R as o,aa as H,S as z,ab as O,r as i,ac as Q,o as _,d as x,e as l,f as a,w as n,i as h,x as q,t as r,h as u,g as G,c as D}from"./main-d5d5ddd5.js";import{S as J}from"./Sideprofiletap-34dc8a85.js";const K={class:"grid"},W={class:"col-12"},X={class:"relative"},Y={style:{},class:"shadow-xl"},Z={class:"flex w-full justify-between align-items-center"},ee={class:"m-0 my-auto"},te={class:"block mt-2 md:mt-0 p-input-icon-left"},ae=l("i",{class:"pi pi-search"},null,-1),le={class:"flex align-items-center justify-content-center"},se=l("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),oe={key:0},de={__name:"Index",setup(ne){const S=A(),b=E(),g=o(!0),y=o({});o("");const f=o(null);o(!1);const p=o(!1),w=o(""),k=o(null),C=o(null),v=o({});H(()=>{j()});const $=()=>{D.get("/api/evaluationheaders").then(e=>{g.value=!1,f.value=e.data.headers,console.log(f.value)})};z(()=>{$()});const P=e=>{b.push({name:"EditHeaders",params:{id:e}})},T=()=>{b.push({name:"CreateHeaders"})},V=e=>{console.log(e),p.value=!0,w.value=e},N=()=>{D.delete(`/api/evaluationheaders/${w.value}/delete`).then(e=>{console.log(e.data),p.value=!1,$(),S.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},B=()=>{C.value.exportCSV()},j=()=>{v.value={global:{value:null,matchMode:O.CONTAINS}}};return(e,s)=>{const d=i("Button"),L=i("Toast"),M=i("InputText"),c=i("Column"),R=i("DataTable"),I=i("Dialog"),F=i("va-card"),m=Q("can");return _(),x("div",K,[l("div",W,[a(F,{class:"card"},{default:n(()=>[l("div",X,[a(J),h(a(d,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2 absolute top-3",onClick:T},null,8,["label"]),[[m,"room create"]]),h(a(d,{label:e.$t("export"),icon:"pi pi-upload",class:"export absolute top-3 ltr:left-[15%] rtl:right-[15%]",onClick:s[0]||(s[0]=t=>B(t))},null,8,["label"]),[[m,"skills list"]])]),a(L),l("div",Y,[h((_(),q(R,{ref_key:"dt",ref:C,selection:k.value,"onUpdate:selection":s[2]||(s[2]=t=>k.value=t),value:f.value,loading:g.value,"data-key":"id",paginator:!0,rows:10,filters:v.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:n(()=>[l("div",Z,[l("h5",ee,r(e.$t("headers")),1),l("div",null,[l("span",te,[ae,a(M,{modelValue:v.value.global.value,"onUpdate:modelValue":s[1]||(s[1]=t=>v.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:n(()=>[a(c,{"selection-mode":"multiple","header-style":"width: 3rem"}),a(c,{field:"id",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:14rem;",class:"ltr:text-justify"},{body:n(t=>[u(r(t.data.id),1)]),_:1},8,["header"]),a(c,{field:"title",header:e.$t("header_title"),sortable:!0,"header-style":"width:18%; min-width:10rem;",class:"ltr:text-justify"},{body:n(t=>[u(r(t.data.title),1)]),_:1},8,["header"]),a(c,{field:"type",header:e.$t("header_type"),sortable:!0,"header-style":"width:14%; min-width:14rem;",class:"ltr:text-justify"},{body:n(t=>[u(r(t.data.type),1)]),_:1},8,["header"]),a(c,{field:"capacity",header:e.$t("min_age"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(t=>[u(" months "+r(" "+t.data.min_age),1)]),_:1},8,["header"]),a(c,{"header-style":"min-width:10rem;"},{body:n(t=>[l("div",null,[h(a(d,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:U=>P(t.data.id)},null,8,["onClick"]),[[m,"room edit"]]),h(a(d,{icon:"pi pi-trash",class:"delete mt-2",onClick:U=>V(t.data.id)},null,8,["onClick"]),[[m,"room delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[m,"room show"]]),a(I,{visible:p.value,"onUpdate:visible":s[4]||(s[4]=t=>p.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:n(()=>[a(d,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:s[3]||(s[3]=t=>p.value=!1)},null,8,["label"]),a(d,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:N},null,8,["label"])]),default:n(()=>[l("div",le,[se,y.value?(_(),x("span",oe,[u(r(e.$t("remove_item"))+" ",1),l("b",null,r(y.value.first_name),1),u("?")])):G("",!0)])]),_:1},8,["visible","header"])])]),_:1})])])}}};export{de as default};
