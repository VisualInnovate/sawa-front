import{a9 as A,aa as E,T as n,ab as H,a2 as q,ac as O,l as i,ad as G,o as f,e as x,h as s,x as a,y as l,w as v,f as J,t as r,i as u,q as K,z as T}from"./main-8edbc651.js";const Q={class:"grid"},W={class:"col-12"},X={class:"my-2"},Y={style:{},class:"shadow-xl"},Z={class:"flex w-full justify-between align-items-center"},ee={class:"m-0 my-auto"},te={class:"block mt-2 md:mt-0 p-input-icon-left"},ae=s("i",{class:"pi pi-search"},null,-1),le={class:"flex align-items-center justify-content-center"},se=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),oe={key:0},re={__name:"Index",setup(ne){const D=A(),b=E(),y=n(!0),g=n({});n("");const _=n(null);n(!1);const p=n(!1),w=n(""),k=n(null),C=n(null),m=n({});H(()=>{j()});const $=()=>{T.get("/api/evaluationheaders").then(e=>{y.value=!1,_.value=e.data.headers,console.log(_.value)})};q(()=>{$()});const P=e=>{b.push({name:"EditHeaders",params:{id:e}})},V=()=>{b.push({name:"CreateHeaders"})},N=e=>{console.log(e),p.value=!0,w.value=e},B=()=>{T.delete(`/api/evaluationheaders/${w.value}/delete`).then(e=>{console.log(e.data),p.value=!1,$(),D.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},S=()=>{C.value.exportCSV()},j=()=>{m.value={global:{value:null,matchMode:O.CONTAINS}}};return(e,o)=>{const d=i("Button"),L=i("Toolbar"),M=i("Toast"),I=i("InputText"),c=i("Column"),R=i("DataTable"),F=i("Dialog"),U=i("va-card"),h=G("can");return f(),x("div",Q,[s("div",W,[a(U,{class:"card"},{default:l(()=>[a(L,{class:"mb-4 shadow-md"},{start:l(()=>[s("div",X,[v(a(d,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:V},null,8,["label"]),[[h,"room create"]])])]),end:l(()=>[a(d,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:o[0]||(o[0]=t=>S(t))},null,8,["label"])]),_:1}),a(M),s("div",Y,[v((f(),J(R,{ref_key:"dt",ref:C,selection:k.value,"onUpdate:selection":o[2]||(o[2]=t=>k.value=t),value:_.value,loading:y.value,"data-key":"id",paginator:!0,rows:10,filters:m.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:l(()=>[s("div",Z,[s("h5",ee,r(e.$t("headers")),1),s("div",null,[s("span",te,[ae,a(I,{modelValue:m.value.global.value,"onUpdate:modelValue":o[1]||(o[1]=t=>m.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:l(()=>[a(c,{"selection-mode":"multiple","header-style":"width: 3rem"}),a(c,{field:"id",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:14rem;",class:"ltr:text-justify"},{body:l(t=>[u(r(t.data.id),1)]),_:1},8,["header"]),a(c,{field:"title",header:e.$t("header_title"),sortable:!0,"header-style":"width:18%; min-width:10rem;",class:"ltr:text-justify"},{body:l(t=>[u(r(t.data.title),1)]),_:1},8,["header"]),a(c,{field:"type",header:e.$t("header_type"),sortable:!0,"header-style":"width:14%; min-width:14rem;",class:"ltr:text-justify"},{body:l(t=>[u(r(t.data.type),1)]),_:1},8,["header"]),a(c,{field:"capacity",header:e.$t("min_age"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:l(t=>[u(" months "+r(" "+t.data.min_age),1)]),_:1},8,["header"]),a(c,{"header-style":"min-width:10rem;"},{body:l(t=>[s("div",null,[v(a(d,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:z=>P(t.data.id)},null,8,["onClick"]),[[h,"room edit"]]),v(a(d,{icon:"pi pi-trash",class:"delete mt-2",onClick:z=>N(t.data.id)},null,8,["onClick"]),[[h,"room delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[h,"room show"]]),a(F,{visible:p.value,"onUpdate:visible":o[4]||(o[4]=t=>p.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:l(()=>[a(d,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:o[3]||(o[3]=t=>p.value=!1)},null,8,["label"]),a(d,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:B},null,8,["label"])]),default:l(()=>[s("div",le,[se,g.value?(f(),x("span",oe,[u(r(e.$t("remove_item"))+" ",1),s("b",null,r(g.value.first_name),1),u("?")])):K("",!0)])]),_:1},8,["visible","header"])])]),_:1})])])}}};export{re as default};