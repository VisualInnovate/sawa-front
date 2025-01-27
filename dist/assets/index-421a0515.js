import{a9 as X,P as Y,Q as o,aa as Z,R as ee,ab as te,r,ac as le,o as h,d as g,e as a,f as l,w as i,i as b,x as se,t as n,h as c,g as V,c as w}from"./main-ddc1ad81.js";const ae={class:"grid"},oe={class:"col-12"},ie={class:"my-2"},ne={style:{},class:"shadow-xl"},re={class:"flex w-full justify-between align-items-center"},de={class:"m-0 my-auto"},ue={class:"block mt-2 md:mt-0 p-input-icon-left"},ce=a("i",{class:"pi pi-search"},null,-1),me={class:"flex align-items-center justify-content-center"},pe=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),ve={key:0},fe={class:"flex flex-column gap-2"},he={class:"w-full text-right",for:"username"},be={key:0,class:"mt-1 mb-5 text-red-500"},ye={class:"w-full text-center"},_e={class:"flex flex-column gap-2"},ge={class:"w-full text-right",for:"username"},we={key:0,class:"mt-1 mb-5 text-red-500"},ke={class:"w-full text-center"},xe={__name:"index",setup($e){const D=X(),S=Y(),T=o([]),P=o(!0),N=o({}),m=o(""),k=o(null),p=o(!1),B=o(""),L=o(null),M=o(null),y=o({}),_=o(!1),U=o({}),$=o({}),j=o(!1);Z(()=>{Q()});const E=()=>{w.post("/api/users").then(e=>{T.value=e.data.users.data})},C=()=>{w.get("/api/employees").then(e=>{P.value=!1,k.value=e.data.data,console.log(k.value)})};ee(()=>{C(),E()});const F=e=>{S.push({name:"Employee-update",params:{id:e}})},I=()=>{S.push({name:"Employees-create"})},q=e=>{console.log(e),p.value=!0,B.value=e},A=()=>{w.post("/api/employees/import/users",$.value).then(e=>{console.log(e.data),C(),_.value=!_.value,D.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=o({})}).catch(e=>{m.value=e.response.data.errors})},z=()=>{w.delete(`/api/employees/${B.value}`).then(e=>{console.log(e.data),p.value=!1,C(),D.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},O=()=>{M.value.exportCSV()},Q=()=>{y.value={global:{value:null,matchMode:te.CONTAINS}}};return(e,s)=>{const d=r("Button"),G=r("Toolbar"),H=r("Toast"),R=r("InputText"),u=r("Column"),J=r("DataTable"),x=r("Dialog"),K=r("MultiSelect"),W=r("va-card"),v=le("can");return h(),g("div",ae,[a("div",oe,[l(W,{class:"card"},{default:i(()=>[l(G,{class:"mb-4 shadow-md"},{start:i(()=>[a("div",ie,[b(l(d,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:I},null,8,["label"]),[[v,"employees create"]])])]),end:i(()=>[b(l(d,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:s[0]||(s[0]=t=>O(t))},null,8,["label"]),[[v,"employees list"]])]),_:1}),l(H),a("div",ne,[b((h(),se(J,{ref_key:"dt",ref:M,selection:L.value,"onUpdate:selection":s[2]||(s[2]=t=>L.value=t),value:k.value,loading:P.value,"data-key":"id",paginator:!0,rows:10,filters:y.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:i(()=>[a("div",re,[a("h5",de,n(e.$t("Employees")),1),a("div",null,[a("span",ue,[ce,l(R,{modelValue:y.value.global.value,"onUpdate:modelValue":s[1]||(s[1]=t=>y.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:i(()=>[l(u,{"selection-mode":"multiple","header-style":"width: 3rem"}),l(u,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:i(t=>[c(n(t.data.name),1)]),_:1},8,["header"]),l(u,{field:"email",header:e.$t("email"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:i(t=>[c(n(t.data.email),1)]),_:1},8,["header"]),l(u,{field:"basic_salary",header:e.$t("basic_salary"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:i(t=>[c(n(t.data.basic_salary),1)]),_:1},8,["header"]),l(u,{field:"shift.title",header:e.$t("shift_title"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:i(t=>[c(n(t.data.shift.title),1)]),_:1},8,["header"]),l(u,{"header-style":"min-width:10rem;"},{body:i(t=>[a("div",null,[b(l(d,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:f=>F(t.data.user.id)},null,8,["onClick"]),[[v,"employees edit"]]),b(l(d,{icon:"pi pi-trash",class:"delete mt-2",onClick:f=>q(t.data.id)},null,8,["onClick"]),[[v,"employees delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[v,"employees list"]]),l(x,{visible:p.value,"onUpdate:visible":s[4]||(s[4]=t=>p.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:i(()=>[l(d,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:s[3]||(s[3]=t=>p.value=!1)},null,8,["label"]),l(d,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:z},null,8,["label"])]),default:i(()=>[a("div",me,[pe,N.value?(h(),g("span",ve,[c(n(e.$t("remove_item"))+" ",1),a("b",null,n(N.value.first_name),1),c("?")])):V("",!0)])]),_:1},8,["visible","header"]),l(x,{visible:_.value,"onUpdate:visible":s[6]||(s[6]=t=>_.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:i(()=>{var t;return[a("div",fe,[a("label",he,n(e.$t("users")),1),l(K,{modelValue:$.value.users_ids,"onUpdate:modelValue":s[5]||(s[5]=f=>$.value.users_ids=f),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:T.value,optionLabel:"name",placeholder:e.$t("users"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(t=m.value)!=null&&t.name?(h(),g("div",be,n(m.value.name[0]),1)):V("",!0)]),a("div",ye,[l(d,{onClick:A,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),l(x,{visible:j.value,"onUpdate:visible":s[8]||(s[8]=t=>j.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:i(()=>{var t;return[a("div",_e,[a("label",ge,n(e.$t("title")),1),l(R,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:U.value.title,"onUpdate:modelValue":s[7]||(s[7]=f=>U.value.title=f),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(t=m.value)!=null&&t.title?(h(),g("div",we,n(m.value.name[0]),1)):V("",!0)]),a("div",ke,[l(d,{onClick:e.editescrud,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["onClick","label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{xe as default};
