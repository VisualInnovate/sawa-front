import{a9 as A,Q as e,aa as E,R as O,ab as Q,r as s,ac as z,o as p,d as P,e as n,f as a,w as i,i as S,x as T,t as C,F as G,B as H,h as J,c as m}from"./main-ddc1ad81.js";const K={class:"grid"},W={class:"col-12"},X={class:"my-2 grid lg:grid-cols-5 gap-4 grid-cols-1"},Y={style:{},class:"shadow-xl"},Z={class:"flex w-full justify-between align-items-center"},ee={class:"m-0 my-auto"},te={class:"block mt-2 md:mt-0 p-input-icon-left"},le=n("i",{class:"pi pi-search"},null,-1),ne={__name:"index",setup(oe){A();const f=e([]),v=e(""),_=e([]),r=e(""),h=e([]),d=e([]),b=e(!0),u=e([{name:"mohamed",date:"date",tiem:"tiem",bons:"bons"},{name:"mohamed",date:"date",tiem:"tiem",bons:"bons"}]);e(!1),e(!1),e("");const w=e(null),V=e(null),c=e({});e(!1),e({}),e(!1),E(()=>{M()});const x=()=>{m.get(`/api/report/select-report?lang=${localStorage.getItem("appLang")}`).then(l=>{b.value=!1,f.value=l.data.data,console.log(u.value)})};O(()=>{x()});const D=()=>{m.post(`/api/report/generate-report?lang=${localStorage.getItem("appLang")}`,{model:v.value,columns:d.value,relations:r.value}).then(l=>{u.value=l.data.data})},B=l=>{r.value="",d.value="",m.get(`/api/report/select-relations?lang=${localStorage.getItem("appLang")}&model=${l}`).then(t=>{_.value=t.data.data}),m.get(`/api/report/select-columns?lang=${localStorage.getItem("appLang")}&model=${l}`).then(t=>{h.value=t.data.data})},I=()=>{V.value.exportCSV()},M=()=>{c.value={global:{value:null,matchMode:Q.CONTAINS}}};return(l,t)=>{const N=s("Dropdown"),k=s("MultiSelect"),y=s("Button"),F=s("Toolbar"),U=s("Toast"),R=s("InputText"),g=s("Column"),q=s("DataTable"),j=s("va-card"),L=z("can");return p(),P("div",K,[n("div",W,[a(j,{class:"card"},{default:i(()=>[a(F,{class:"mb-4 shadow-md"},{start:i(()=>[n("div",X,[a(N,{"onUpdate:modelValue":[B,t[0]||(t[0]=o=>v.value=o)],modelValue:v.value,required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",options:f.value,optionLabel:"model",placeholder:l.$t("model_id"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),a(k,{modelValue:r.value,"onUpdate:modelValue":t[1]||(t[1]=o=>r.value=o),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"relation",options:_.value,optionLabel:"value",placeholder:l.$t("relation_id"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),a(k,{modelValue:d.value,"onUpdate:modelValue":t[2]||(t[2]=o=>d.value=o),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"column",options:h.value,optionLabel:"value",placeholder:l.$t("columns_id"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),a(y,{label:l.$t("search"),class:"create",onClick:D},null,8,["label"])])]),end:i(()=>[]),_:1}),a(U),n("div",Y,[S((p(),T(q,{ref_key:"dt",ref:V,selection:w.value,"onUpdate:selection":t[5]||(t[5]=o=>w.value=o),value:u.value,loading:b.value,"data-key":"id",paginator:!0,rows:10,filters:c.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:i(()=>[n("div",Z,[n("h5",ee,C(l.$t("posttion")),1),S(a(y,{label:l.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[3]||(t[3]=o=>I(o))},null,8,["label"]),[[L,"positions list"]]),n("div",null,[n("span",te,[le,a(R,{modelValue:c.value.global.value,"onUpdate:modelValue":t[4]||(t[4]=o=>c.value.global.value=o),placeholder:l.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:i(()=>[a(g,{"selection-mode":"multiple","header-style":"width: 3rem"}),(p(!0),P(G,null,H(u.value,(o,$)=>(p(),T(g,{field:$,header:$,sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:i(ae=>[J(C(o),1)]),_:2},1032,["field","header"]))),256)),a(g,{"header-style":"min-width:10rem;"})]),_:1},8,["selection","value","loading","filters"])),[[L,"positions list"]])])]),_:1})])])}}};export{ne as default};
