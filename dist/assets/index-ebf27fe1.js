import{aa as z,ab as E,T as n,ac as O,a3 as q,ad as G,r as i,ae as H,o as f,d as x,e as a,f as s,w as o,i as v,x as J,t as d,h as p,g as K,c as T}from"./main-f45ea8b8.js";const Q={class:"grid",style:{"max-height":"90vh !important","overflow-y":"scroll"}},W={class:"col-12"},X={class:"my-2"},Y={style:{},class:"shadow-xl"},Z={class:"flex w-full justify-between align-items-center"},ee={class:"m-0 my-auto"},te={class:"block mt-2 md:mt-0 p-input-icon-left"},se=a("i",{class:"pi pi-search"},null,-1),ae={class:"flex align-items-center justify-content-center"},oe=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),le={key:0},re={__name:"index",setup(ne){const D=z(),_=E(),b=n(!0),g=n({});n("");const y=n(null);n(!1);const c=n(!1),w=n(""),k=n(null),C=n(null),m=n({});O(()=>{L()});const $=()=>{T.get("/api/session").then(e=>{b.value=!1,y.value=e.data.data})};q(()=>{$()});const P=e=>{_.push({name:"sessions-update",params:{id:e}})},V=()=>{_.push({name:"sessions-create"})},N=e=>{console.log(e),c.value=!0,w.value=e},B=()=>{T.delete(`/api/session/${w.value}`).then(e=>{console.log(e.data),c.value=!1,$(),D.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},S=()=>{C.value.exportCSV()},L=()=>{m.value={global:{value:null,matchMode:G.CONTAINS}}};return(e,l)=>{const r=i("Button"),j=i("Toolbar"),M=i("Toast"),R=i("InputText"),u=i("Column"),F=i("DataTable"),I=i("Dialog"),U=i("va-card"),h=H("can");return f(),x("div",Q,[a("div",W,[s(U,{class:"card"},{default:o(()=>[s(j,{class:"mb-4 shadow-md"},{start:o(()=>[a("div",X,[v(s(r,{label:e.$t("add_session"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:V},null,8,["label"]),[[h,"room create"]])])]),end:o(()=>[s(r,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:l[0]||(l[0]=t=>S(t))},null,8,["label"])]),_:1}),s(M),a("div",Y,[v((f(),J(F,{ref_key:"dt",ref:C,selection:k.value,"onUpdate:selection":l[2]||(l[2]=t=>k.value=t),value:y.value,loading:b.value,"data-key":"id",paginator:!0,rows:10,filters:m.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:o(()=>[a("div",Z,[a("h5",ee,d(e.$t("sessions")),1),a("div",null,[a("span",te,[se,s(R,{modelValue:m.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=t=>m.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:o(()=>[s(u,{"selection-mode":"multiple","header-style":"width: 3rem"}),s(u,{field:"child.name",header:e.$t("roomdoctor"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:o(t=>[p(d(t.data.specialists.name),1)]),_:1},8,["header"]),s(u,{field:"child.name",header:e.$t("child_name"),sortable:!0,"header-style":"width:14%; min-width:14rem;",class:"ltr:text-justify"},{body:o(t=>[p(d(t.data.child.name),1)]),_:1},8,["header"]),s(u,{field:"date",header:e.$t("sesion_date"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:o(t=>[p(d(t.data.date),1)]),_:1},8,["header"]),s(u,{"header-style":"min-width:10rem;"},{body:o(t=>[a("div",null,[v(s(r,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:A=>P(t.data.id)},null,8,["onClick"]),[[h,"room edit"]]),v(s(r,{icon:"pi pi-trash",class:"delete mt-2",onClick:A=>N(t.data.id)},null,8,["onClick"]),[[h,"room delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[h,"room show"]]),s(I,{visible:c.value,"onUpdate:visible":l[4]||(l[4]=t=>c.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:o(()=>[s(r,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[3]||(l[3]=t=>c.value=!1)},null,8,["label"]),s(r,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:B},null,8,["label"])]),default:o(()=>[a("div",ae,[oe,g.value?(f(),x("span",le,[p(d(e.$t("remove_item"))+" ",1),a("b",null,d(g.value.first_name),1),p("?")])):K("",!0)])]),_:1},8,["visible","header"])])]),_:1})])])}}};export{re as default};
