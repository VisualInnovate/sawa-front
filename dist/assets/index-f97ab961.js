import{m as W,$ as X,q as s,ah as Y,a0 as Z,ai as ee,r,aj as te,o as d,d as u,e as o,f as a,g as n,i as v,L as ae,t as c,h as w,j as _,n as C,c as L}from"./main-8a344e1a.js";const le={class:"grid"},se={class:"col-12"},oe={class:"my-2"},ne={style:{},class:"shadow-xl"},ie={class:"flex w-full justify-between align-items-center"},re={class:"m-0 my-auto"},de={class:"block mt-2 md:mt-0 p-input-icon-left"},ue=o("i",{class:"pi pi-search"},null,-1),ce=["href"],pe={key:0},me={key:1},ve={key:0},_e={key:1},he={key:2},be={class:"line-container m-auto w-full"},fe={class:"flex align-items-center justify-content-center"},ye=o("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),ge={key:0},Ce={__name:"index",setup(ke){const M=W(),$=X();s(Array.from({length:3},(t,l)=>({title:`Tab ${l+1}`,content:`Tab ${l+1} Content`})));const x=s(!0),T=s({});s("");const g=s(null);s(!1);const h=s(!1),D=s(""),S=s(null),V=s(null),b=s({}),f=s(!1),k=s(!1),j=s(!1),y=s(!1),P=()=>{k.value=!0,j.value=!1,y.value=!1},R=()=>{y.value=!0,j.value=!0,k.value=!0},U=()=>{f.value=!f.value};Y(()=>{O()});const N=()=>{L.get("/api/student-transportation").then(t=>{x.value=!1,g.value=t.data.data,console.log(g.value)})};Z(()=>{N()});const E=t=>{$.push({name:"student-transportation-update",params:{id:t}})},F=()=>{$.push({name:"student-transportation-create"})},I=t=>{console.log(t),h.value=!0,D.value=t},z=()=>{L.delete(`/api/student-transportation/${D.value}`).then(t=>{console.log(t.data),h.value=!1,N(),M.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},q=()=>{V.value.exportCSV()},O=()=>{b.value={global:{value:null,matchMode:ee.CONTAINS}}};return(t,l)=>{const i=r("Button"),G=r("Toolbar"),H=r("Toast"),J=r("InputText"),p=r("Column"),K=r("DataTable"),A=r("Dialog"),Q=r("va-card"),m=te("can");return d(),u("div",le,[o("div",se,[a(Q,{class:"card"},{default:n(()=>[a(G,{class:"mb-4 shadow-md"},{start:n(()=>[o("div",oe,[v(a(i,{label:t.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:F},null,8,["label"]),[[m,"program create"]])])]),end:n(()=>[v(a(i,{label:t.$t("export"),icon:"pi pi-upload",class:"export",onClick:l[0]||(l[0]=e=>q(e))},null,8,["label"]),[[m,"program list"]])]),_:1}),a(H),o("div",ne,[v((d(),ae(K,{ref_key:"dt",ref:V,selection:S.value,"onUpdate:selection":l[2]||(l[2]=e=>S.value=e),value:g.value,loading:x.value,"data-key":"id",paginator:!0,rows:10,filters:b.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:n(()=>[o("div",ie,[o("h5",re,c(t.$t("student_tans")),1),o("div",null,[o("span",de,[ue,a(J,{modelValue:b.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=e=>b.value.global.value=e),placeholder:t.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:n(()=>[a(p,{"selection-mode":"multiple","header-style":"width: 3rem"}),a(p,{field:"plate_number",header:t.$t("area_name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(e=>[w(c(e.data.region.name),1)]),_:1},8,["header"]),a(p,{field:"plate_number",header:t.$t("student_location"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(e=>[o("a",{style:{color:"blue"},target:"_blank",href:e.data.location_url},c(e.data.location_url.substring(0,20)),9,ce)]),_:1},8,["header"]),a(p,{field:"license_exp_date",header:t.$t("trip_type"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(e=>[e.data.trip_type==0?(d(),u("p",pe,c(t.$t("one_way")),1)):_("",!0),e.data.trip_type==1?(d(),u("p",me,c(t.$t("tow_way")),1)):_("",!0)]),_:1},8,["header"]),a(p,{field:"type",header:t.$t("vecile_type"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(e=>[e.data.type==0?(d(),u("p",ve," angel car ")):_("",!0),e.data.type==1?(d(),u("p",_e," bus ")):_("",!0),e.data.type==2?(d(),u("p",he," Minibus ")):_("",!0)]),_:1},8,["header"]),a(p,{"header-style":"min-width:10rem;"},{body:n(e=>[o("div",null,[v(a(i,{icon:"pi pi-car",class:"p-button-rounded p-button-success details mr-2",onClick:B=>U(e.data.id)},null,8,["onClick"]),[[m,"program edit"]]),v(a(i,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:B=>E(e.data.id)},null,8,["onClick"]),[[m,"program edit"]]),v(a(i,{icon:"pi pi-trash",class:"delete mt-2",onClick:B=>I(e.data.id)},null,8,["onClick"]),[[m,"program delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[m,"program list"]]),a(A,{visible:f.value,"onUpdate:visible":l[3]||(l[3]=e=>f.value=e),style:{width:"450px"},header:t.$t("submit"),modal:!0},{default:n(()=>[o("div",be,[a(i,{label:"start",class:C(["p-button-rounded p-button-success mr-2",["dot",{active:k.value}]]),onClick:P},null,8,["class"]),o("div",{class:C(["line",{endActive:y.value}])},null,2),a(i,{label:"end",class:C(["p-button-rounded p-button-success mr-2",["dot",{active:y.value}]]),onClick:R},null,8,["class"])])]),_:1},8,["visible","header"]),a(A,{visible:h.value,"onUpdate:visible":l[5]||(l[5]=e=>h.value=e),style:{width:"450px"},header:t.$t("submit"),modal:!0},{footer:n(()=>[a(i,{label:t.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[4]||(l[4]=e=>h.value=!1)},null,8,["label"]),a(i,{label:t.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:z},null,8,["label"])]),default:n(()=>[o("div",fe,[ye,T.value?(d(),u("span",ge,[w(c(t.$t("remove_item"))+" ",1),o("b",null,c(T.value.first_name),1),w("?")])):_("",!0)])]),_:1},8,["visible","header"])])]),_:1})])])}}};export{Ce as default};
