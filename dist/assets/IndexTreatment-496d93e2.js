import{a9 as q,aa as E,T as n,ab as O,a2 as G,ac as H,l as r,ad as J,o as u,e as h,h as s,x as a,y as o,w as v,f as K,t as i,i as _,q as g,z as x}from"./main-b594ff1a.js";const Q={class:"grid"},W={class:"col-12"},X={class:"my-2"},Y={style:{},class:"shadow-xl"},Z={class:"flex w-full justify-between align-items-center"},ee={class:"m-0 my-auto"},te={class:"block mt-2 md:mt-0 p-input-icon-left"},ae=s("i",{class:"pi pi-search"},null,-1),oe={key:0},se={key:1},le={key:2},ne={class:"flex align-items-center justify-content-center"},ie=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),re={key:0},ue={__name:"IndexTreatment",setup(de){const P=q(),b=E(),k=n(!0),w=n({});n("");const y=n(null);n(!1);const p=n(!1),$=n(""),C=n(null),T=n(null),f=n({});O(()=>{L()});const D=()=>{x.get("/api/program").then(e=>{k.value=!1,y.value=e.data.data,console.log(y.value)})};G(()=>{D()});const S=e=>{b.push({name:"therapeutic-update",params:{id:e}})},V=()=>{b.push({name:"Therapeutic"})},N=e=>{console.log(e),p.value=!0,$.value=e},B=()=>{x.delete(`/api/program/${$.value}`).then(e=>{console.log(e.data),p.value=!1,D(),P.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},j=()=>{T.value.exportCSV()},L=()=>{f.value={global:{value:null,matchMode:H.CONTAINS}}};return(e,l)=>{const d=r("Button"),M=r("Toolbar"),I=r("Toast"),R=r("InputText"),c=r("Column"),F=r("DataTable"),U=r("Dialog"),z=r("va-card"),m=J("can");return u(),h("div",Q,[s("div",W,[a(z,{class:"card"},{default:o(()=>[a(M,{class:"mb-4 shadow-md"},{start:o(()=>[s("div",X,[v(a(d,{label:e.$t("addProgramType"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:V},null,8,["label"]),[[m,"program create"]])])]),end:o(()=>[v(a(d,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:l[0]||(l[0]=t=>j(t))},null,8,["label"]),[[m,"program list"]])]),_:1}),a(I),s("div",Y,[v((u(),K(F,{ref_key:"dt",ref:T,selection:C.value,"onUpdate:selection":l[2]||(l[2]=t=>C.value=t),value:y.value,loading:k.value,"data-key":"id",paginator:!0,rows:10,filters:f.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:o(()=>[s("div",Z,[s("h5",ee,i(e.$t("addTherapeutic")),1),s("div",null,[s("span",te,[ae,a(R,{modelValue:f.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=t=>f.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:o(()=>[a(c,{"selection-mode":"multiple","header-style":"width: 3rem"}),a(c,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:o(t=>[_(i(t.data.name),1)]),_:1},8,["header"]),a(c,{field:"price",header:e.$t("price"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:o(t=>[_(i(t.data.price),1)]),_:1},8,["header"]),a(c,{field:"Spotter",header:e.$t("Spotter"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:o(t=>[_(i(t.data.sessions_number),1)]),_:1},8,["header"]),a(c,{field:"program_type",header:e.$t("ProgramType"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:o(t=>[t.data.program_type==0?(u(),h("p",oe,i(e.$t("diurnal")),1)):g("",!0),t.data.program_type==1?(u(),h("p",se,i(e.$t("Clinics")),1)):g("",!0),t.data.program_type==2?(u(),h("p",le,i(e.$t("house")),1)):g("",!0)]),_:1},8,["header"]),a(c,{"header-style":"min-width:10rem;"},{body:o(t=>[s("div",null,[v(a(d,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:A=>S(t.data.id)},null,8,["onClick"]),[[m,"program edit"]]),v(a(d,{icon:"pi pi-trash",class:"delete mt-2",onClick:A=>N(t.data.id)},null,8,["onClick"]),[[m,"program delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[m,"program list"]]),a(U,{visible:p.value,"onUpdate:visible":l[4]||(l[4]=t=>p.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:o(()=>[a(d,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[3]||(l[3]=t=>p.value=!1)},null,8,["label"]),a(d,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:B},null,8,["label"])]),default:o(()=>[s("div",ne,[ie,w.value?(u(),h("span",re,[_(i(e.$t("remove_item"))+" ",1),s("b",null,i(w.value.first_name),1),_("?")])):g("",!0)])]),_:1},8,["visible","header"])])]),_:1})])])}}};export{ue as default};
