import{a9 as q,aa as E,T as n,ab as O,a2 as G,ac as H,l as i,ad as J,o as r,e as u,h as l,x as a,y as s,w as v,f as K,t as d,i as b,q as m,z as D}from"./main-fa6873cf.js";const Q={class:"grid"},W={class:"col-12"},X={class:"my-2"},Y={style:{},class:"shadow-xl"},Z={class:"flex w-full justify-between align-items-center"},ee={class:"m-0 my-auto"},te={class:"block mt-2 md:mt-0 p-input-icon-left"},ae=l("i",{class:"pi pi-search"},null,-1),se=["href"],le={key:0},oe={key:1},ne={key:0},ie={key:1},re={key:2},de={class:"flex align-items-center justify-content-center"},ce=l("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),ue={key:0},_e={__name:"index",setup(pe){const V=q(),g=E(),w=n(!0),k=n({});n("");const f=n(null);n(!1);const _=n(!1),$=n(""),C=n(null),x=n(null),y=n({});O(()=>{M()});const T=()=>{D.get("/api/student-transportation").then(t=>{w.value=!1,f.value=t.data.data,console.log(f.value)})};G(()=>{T()});const N=t=>{g.push({name:"student-transportation-update",params:{id:t}})},j=()=>{g.push({name:"student-transportation-create"})},B=t=>{console.log(t),_.value=!0,$.value=t},S=()=>{D.delete(`/api/student-transportation/${$.value}`).then(t=>{console.log(t.data),_.value=!1,T(),V.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},L=()=>{x.value.exportCSV()},M=()=>{y.value={global:{value:null,matchMode:H.CONTAINS}}};return(t,o)=>{const p=i("Button"),P=i("Toolbar"),R=i("Toast"),F=i("InputText"),c=i("Column"),I=i("DataTable"),U=i("Dialog"),z=i("va-card"),h=J("can");return r(),u("div",Q,[l("div",W,[a(z,{class:"card"},{default:s(()=>[a(P,{class:"mb-4 shadow-md"},{start:s(()=>[l("div",X,[v(a(p,{label:t.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:j},null,8,["label"]),[[h,"program create"]])])]),end:s(()=>[v(a(p,{label:t.$t("export"),icon:"pi pi-upload",class:"export",onClick:o[0]||(o[0]=e=>L(e))},null,8,["label"]),[[h,"program list"]])]),_:1}),a(R),l("div",Y,[v((r(),K(I,{ref_key:"dt",ref:x,selection:C.value,"onUpdate:selection":o[2]||(o[2]=e=>C.value=e),value:f.value,loading:w.value,"data-key":"id",paginator:!0,rows:10,filters:y.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:s(()=>[l("div",Z,[l("h5",ee,d(t.$t("student_tans")),1),l("div",null,[l("span",te,[ae,a(F,{modelValue:y.value.global.value,"onUpdate:modelValue":o[1]||(o[1]=e=>y.value.global.value=e),placeholder:t.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:s(()=>[a(c,{"selection-mode":"multiple","header-style":"width: 3rem"}),a(c,{field:"users.name",header:t.$t("child_name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:s(e=>[b(d(e.data.child.name),1)]),_:1},8,["header"]),a(c,{field:"plate_number",header:t.$t("area_name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:s(e=>[b(d(e.data.region.name),1)]),_:1},8,["header"]),a(c,{field:"plate_number",header:t.$t("student_location"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:s(e=>[l("a",{style:{color:"blue"},target:"_blank",href:e.data.location_url},d(e.data.location_url.substring(0,20)),9,se)]),_:1},8,["header"]),a(c,{field:"license_exp_date",header:t.$t("trip_type"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:s(e=>[e.data.trip_type==0?(r(),u("p",le,d(t.$t("one_way")),1)):m("",!0),e.data.trip_type==1?(r(),u("p",oe,d(t.$t("tow_way")),1)):m("",!0)]),_:1},8,["header"]),a(c,{field:"type",header:t.$t("vecile_type"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:s(e=>[e.data.type==0?(r(),u("p",ne," angel car ")):m("",!0),e.data.type==1?(r(),u("p",ie," bus ")):m("",!0),e.data.type==2?(r(),u("p",re," Minibus ")):m("",!0)]),_:1},8,["header"]),a(c,{"header-style":"min-width:10rem;"},{body:s(e=>[l("div",null,[v(a(p,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:A=>N(e.data.id)},null,8,["onClick"]),[[h,"program edit"]]),v(a(p,{icon:"pi pi-trash",class:"delete mt-2",onClick:A=>B(e.data.id)},null,8,["onClick"]),[[h,"program delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[h,"program list"]]),a(U,{visible:_.value,"onUpdate:visible":o[4]||(o[4]=e=>_.value=e),style:{width:"450px"},header:t.$t("submit"),modal:!0},{footer:s(()=>[a(p,{label:t.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:o[3]||(o[3]=e=>_.value=!1)},null,8,["label"]),a(p,{label:t.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:S},null,8,["label"])]),default:s(()=>[l("div",de,[ce,k.value?(r(),u("span",ue,[b(d(t.$t("remove_item"))+" ",1),l("b",null,d(k.value.first_name),1),b("?")])):m("",!0)])]),_:1},8,["visible","header"])])]),_:1})])])}}};export{_e as default};