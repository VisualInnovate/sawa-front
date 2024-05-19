import{a9 as Y,aa as Z,S as o,ab as ee,a2 as le,ac as te,l as n,ad as se,o as f,e as $,h as a,n as t,w as i,v as b,f as ae,t as u,i as C,p as P,q as h}from"./main-6ad9689e.js";const oe={class:"grid"},ie={class:"col-12"},ne={class:"my-2"},ue={style:{},class:"shadow-xl"},de={class:"flex w-full justify-between align-items-center"},re={class:"m-0 my-auto"},ce={class:"block mt-2 md:mt-0 p-input-icon-left"},pe=a("i",{class:"pi pi-search"},null,-1),me={class:"flex align-items-center justify-content-center"},ve=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),fe={key:0},be={class:"flex flex-column gap-2"},he={class:"w-full text-right",for:"username"},_e={key:0,class:"mt-1 mb-5 text-red-500"},ge={class:"w-full text-center"},ye={class:"flex flex-column gap-2"},ke={class:"w-full text-right",for:"username"},we={key:0,class:"mt-1 mb-5 text-red-500"},$e={class:"w-full text-center"},Ve={__name:"index",setup(Ce){const x=Y(),R=Z(),N=o([]),B=o(!0),L=o({}),r=o(""),V=o(null);o(!1);const p=o(!1),S=o(""),M=o(null),U=o(null),_=o({}),c=o(!1),D=o({}),g=o({}),y=o(!1);ee(()=>{H()});const q=()=>{h.post("/api/users").then(e=>{N.value=e.data.users.data})},k=()=>{h.get("/api/employees").then(e=>{B.value=!1,V.value=e.data.data,console.log(V.value)})};le(()=>{k(),q()});const F=e=>{R.push({name:"Employee-update",params:{id:e}})},I=()=>{h.post(`/api/mileston-levels/${S.value}`,g.value).then(e=>{console.log(e.data),k(),y.value=!y.value,x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),D.value=o({})}).catch(e=>{r.value=e.response.data.errors})},A=()=>{c.value=!c.value},E=e=>{console.log(e),p.value=!0,S.value=e},z=()=>{h.post("/api/employees/import-users",g.value).then(e=>{console.log(e.data),k(),c.value=!c.value,x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=o({})}).catch(e=>{r.value=e.response.data.errors})},O=()=>{h.delete(`/api/employees/${S.value}`).then(e=>{console.log(e.data),p.value=!1,k(),x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},G=()=>{U.value.exportCSV()},H=()=>{_.value={global:{value:null,matchMode:te.CONTAINS}}};return(e,s)=>{const d=n("Button"),J=n("Toolbar"),K=n("Toast"),j=n("InputText"),w=n("Column"),Q=n("DataTable"),T=n("Dialog"),W=n("MultiSelect"),X=n("va-card"),m=se("can");return f(),$("div",oe,[a("div",ie,[t(X,{class:"card"},{default:i(()=>[t(J,{class:"mb-4 shadow-md"},{start:i(()=>[a("div",ne,[b(t(d,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:A},null,8,["label"]),[[m,"skills create"]])])]),end:i(()=>[b(t(d,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:s[0]||(s[0]=l=>G(l))},null,8,["label"]),[[m,"skills list"]])]),_:1}),t(K),a("div",ue,[b((f(),ae(Q,{ref_key:"dt",ref:U,selection:M.value,"onUpdate:selection":s[2]||(s[2]=l=>M.value=l),value:V.value,loading:B.value,"data-key":"id",paginator:!0,rows:10,filters:_.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:i(()=>[a("div",de,[a("h5",re,u(e.$t("levels")),1),a("div",null,[a("span",ce,[pe,t(j,{modelValue:_.value.global.value,"onUpdate:modelValue":s[1]||(s[1]=l=>_.value.global.value=l),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:i(()=>[t(w,{"selection-mode":"multiple","header-style":"width: 3rem"}),t(w,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:i(l=>[C(u(l.data.name),1)]),_:1},8,["header"]),t(w,{field:"email",header:e.$t("email"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:i(l=>[C(u(l.data.email),1)]),_:1},8,["header"]),t(w,{"header-style":"min-width:10rem;"},{body:i(l=>[a("div",null,[b(t(d,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:v=>F(l.data.id)},null,8,["onClick"]),[[m,"skills edit"]]),b(t(d,{icon:"pi pi-trash",class:"delete mt-2",onClick:v=>E(l.data.id)},null,8,["onClick"]),[[m,"skills delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[m,"skills list"]]),t(T,{visible:p.value,"onUpdate:visible":s[4]||(s[4]=l=>p.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:i(()=>[t(d,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:s[3]||(s[3]=l=>p.value=!1)},null,8,["label"]),t(d,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:O},null,8,["label"])]),default:i(()=>[a("div",me,[ve,L.value?(f(),$("span",fe,[C(u(e.$t("remove_item"))+" ",1),a("b",null,u(L.value.first_name),1),C("?")])):P("",!0)])]),_:1},8,["visible","header"]),t(T,{visible:c.value,"onUpdate:visible":s[6]||(s[6]=l=>c.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:i(()=>{var l;return[a("div",be,[a("label",he,u(e.$t("title")),1),t(W,{modelValue:g.value.users_ids,"onUpdate:modelValue":s[5]||(s[5]=v=>g.value.users_ids=v),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:N.value,optionLabel:"name",placeholder:e.$t("level_id"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(l=r.value)!=null&&l.name?(f(),$("div",_e,u(r.value.name[0]),1)):P("",!0)]),a("div",ge,[t(d,{onClick:z,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),t(T,{visible:y.value,"onUpdate:visible":s[8]||(s[8]=l=>y.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:i(()=>{var l;return[a("div",ye,[a("label",ke,u(e.$t("title")),1),t(j,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:D.value.title,"onUpdate:modelValue":s[7]||(s[7]=v=>D.value.title=v),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(l=r.value)!=null&&l.title?(f(),$("div",we,u(r.value.name[0]),1)):P("",!0)]),a("div",$e,[t(d,{onClick:I,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Ve as default};
