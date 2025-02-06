import{aa as Q,Q as q,R as n,u as G,ab as H,S as J,ac as K,r as d,T as W,o as g,d as T,e as a,f as l,w as s,i as r,x as X,t as u,h as v,g as Y,c as D}from"./main-4124a381.js";const Z={class:"grid",style:{"max-height":"90vh !important","overflow-y":"scroll"}},ee={class:"col-12"},te={class:"my-2"},le={style:{},class:"shadow-xl"},ae={class:"flex w-full justify-between align-items-center"},se={class:"m-0 my-auto"},oe={class:"block mt-2 md:mt-0 p-input-icon-left"},ne=a("i",{class:"pi pi-search"},null,-1),ie={class:"flex align-items-center justify-content-center"},de=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),ce={key:0},pe={__name:"Index",setup(re){const S=Q(),p=q(),y=n(!0),w=n({});n("");const f=n(null);n(!1);const h=n(!1),k=n(""),C=n(null),$=n(null),_=n({}),V=G("child_id",Number);H(()=>{M()});const x=()=>{console.log(p.currentRoute._rawValue.fullPath),D.get("/api/child").then(e=>{y.value=!1,f.value=e.data.children,console.log(f.value)})};J(()=>{x()});const N=e=>{p.push({name:"EditChildren",params:{id:e}})},P=e=>{p.push({name:"ShowChildren",params:{id:e}})},B=()=>{p.push({name:"CreateChildren"})},L=e=>{V.value=e,p.push({name:"children-detailes"})},R=e=>{console.log(e),h.value=!0,k.value=e},j=()=>{D.delete(`/api/child/${k.value}/delete`).then(e=>{console.log(e.data),h.value=!1,x(),S.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},I=()=>{$.value.exportCSV()},M=()=>{_.value={global:{value:null,matchMode:K.CONTAINS}}};return(e,o)=>{const i=d("Button"),A=d("Toolbar"),E=d("Toast"),F=d("InputText"),m=d("Column"),U=d("DataTable"),z=d("Dialog"),O=d("va-card"),c=W("can");return g(),T("div",Z,[a("div",ee,[l(O,{class:"card"},{default:s(()=>[l(A,{class:"mb-4 shadow-md"},{start:s(()=>[a("div",te,[r(l(i,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:B},null,8,["label"]),[[c,"child create"]])])]),end:s(()=>[r(l(i,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:o[0]||(o[0]=t=>I(t))},null,8,["label"]),[[c,"child list"]])]),_:1}),l(E),a("div",le,[r((g(),X(U,{ref_key:"dt",ref:$,selection:C.value,"onUpdate:selection":o[2]||(o[2]=t=>C.value=t),value:f.value,loading:y.value,"data-key":"id",paginator:!0,rows:10,filters:_.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:s(()=>[a("div",ae,[a("h5",se,u(e.$t("children")),1),a("div",null,[a("span",oe,[ne,l(F,{modelValue:_.value.global.value,"onUpdate:modelValue":o[1]||(o[1]=t=>_.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:s(()=>[l(m,{"selection-mode":"multiple","header-style":"width: 3rem"}),l(m,{field:"id",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:s(t=>[v(u(t.data.id),1)]),_:1},8,["header"]),l(m,{field:"name",header:e.$t("child_name"),sortable:!0,"header-style":"width:17%; min-width:10rem;",class:"ltr:text-justify"},{body:s(t=>[v(u(t.data.name),1)]),_:1},8,["header"]),l(m,{field:"birth_date",header:e.$t("birth_date"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:s(t=>[v(u(t.data.birth_date),1)]),_:1},8,["header"]),l(m,{"header-style":"min-width:10rem;"},{body:s(t=>[a("div",null,[r(l(i,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:b=>N(t.data.id)},null,8,["onClick"]),[[c,"child edit"]]),r(l(i,{icon:"pi pi-eye",class:"details mt-2",onClick:b=>P(t.data.id)},null,8,["onClick"]),[[c,"child And Evaluation"]]),r(l(i,{icon:"pi pi-trash",class:"delete mt-2",onClick:b=>R(t.data.id)},null,8,["onClick"]),[[c,"child delete"]]),l(i,{icon:"pi pi-user",class:"show mt-2",onClick:b=>L(t.data.id)},null,8,["onClick"])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[c,"child list"]]),l(z,{visible:h.value,"onUpdate:visible":o[4]||(o[4]=t=>h.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:s(()=>[l(i,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:o[3]||(o[3]=t=>h.value=!1)},null,8,["label"]),l(i,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:j},null,8,["label"])]),default:s(()=>[a("div",ie,[de,w.value?(g(),T("span",ce,[v(u(e.$t("remove_item"))+" ",1),a("b",null,u(w.value.first_name),1),v("?")])):Y("",!0)])]),_:1},8,["visible","header"])])]),_:1})])])}}};export{pe as default};
