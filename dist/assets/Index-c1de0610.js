import{a7 as X,a8 as Y,Q as o,a9 as Z,a0 as ee,aa as le,r as c,ab as se,o as v,d as _,e as a,f as t,w as u,i as y,x as te,t as r,h as D,g as $,c as f}from"./main-fba2e8b8.js";const ae={class:"grid",style:{"max-height":"90vh !important","overflow-y":"scroll"}},oe={class:"col-12"},ne={class:"my-2"},ie={style:{},class:"shadow-xl"},re={class:"flex w-full justify-between align-items-center"},ue={class:"m-0 my-auto"},de={class:"block mt-2 md:mt-0 p-input-icon-left"},ce=a("i",{class:"pi pi-search"},null,-1),me={class:"flex align-items-center justify-content-center"},pe=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),ve={key:0},fe={class:"flex flex-column gap-2 py-1"},he={class:"w-full text-right",for:"username"},be={key:0,class:"mt-1 mb-5 text-red-500"},ge={class:"flex flex-column gap-2 py-1"},_e={class:"w-full text-right",for:"username"},ye={key:0,class:"mt-1 mb-5 text-red-500"},we={class:"w-full text-center"},ke={class:"flex flex-column gap-2"},$e={class:"w-full text-right",for:"username"},xe={key:0,class:"mt-1 mb-5 text-red-500"},Ce={class:"flex flex-column gap-2"},Ve={class:"w-full text-right",for:"username"},Se={key:0,class:"mt-1 mb-5 text-red-500"},De={class:"w-full text-center"},Le={__name:"Index",setup(Te){const T=X();Y();const U=o({}),x=o(!0),B=o({}),d=o(""),L=o(null);o(!1);const w=o(!1),C=o(""),M=o(null),j=o(null),V=o({}),h=o(!1),i=o({name:"",permissions:[]}),b=o(!1);Z(()=>{G()});const k=()=>{f.post("/api/roles").then(e=>{L.value=e.data.roles.data,console.log(L.value)}),f.post("/api/permissions").then(e=>{U.value=e.data.permissions,x.value=!1})};ee(()=>{k()});const R=e=>{f.get(`/api/roles/${e}`).then(l=>{x.value=!1,i.value.name=l.data.role.name;for(let n=0;n<l.data.role.permissions.length;n++)l.data.role.permissions[n].id,i.value.permissions.push(l.data.role.permissions[n].id)}),console.log(i.value.permissions),C.value=e,b.value=!b.value},F=()=>{f.put(`/api/roles/${C.value}/edit`,i.value).then(e=>{console.log(e.data),k(),b.value=!b.value,T.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=o({})}).catch(e=>{d.value=e.response.data.errors})},q=()=>{h.value=!h.value},A=e=>{console.log(e),w.value=!0,C.value=e},z=()=>{f.post("/api/roles/create",i.value).then(e=>{console.log(e.data),k(),h.value=!h.value,T.add({severity:"success",summary:"Successful",detail:" Successful",life:3e3}),skill.value=o({})}).catch(e=>{d.value=e.response.data.errors})},E=()=>{f.delete(`/api/roles/${C.value}/delete`).then(e=>{console.log(e.data),k(),w.value=!1,T.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},O=e=>{x.value=!0,f.get(`/api/permissions/copy/${e}`).then(l=>{k()}).catch(()=>{})},Q=()=>{j.value.exportCSV()},G=()=>{V.value={global:{value:null,matchMode:le.CONTAINS}}};return(e,l)=>{const n=c("Button"),H=c("Toolbar"),J=c("Toast"),N=c("InputText"),S=c("Column"),K=c("DataTable"),P=c("Dialog"),I=c("MultiSelect"),W=c("va-card"),g=se("can");return v(),_("div",ae,[a("div",oe,[t(W,{class:"card"},{default:u(()=>[t(H,{class:"mb-4 shadow-md"},{start:u(()=>[a("div",ne,[y(t(n,{label:e.$t("roles"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:q},null,8,["label"]),[[g,"roles create"]])])]),end:u(()=>[y(t(n,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:l[0]||(l[0]=s=>Q(s))},null,8,["label"]),[[g,"roles list"]])]),_:1}),t(J),a("div",ie,[y((v(),te(K,{ref_key:"dt",ref:j,selection:M.value,"onUpdate:selection":l[2]||(l[2]=s=>M.value=s),value:L.value,loading:x.value,"data-key":"id",paginator:!0,rows:10,filters:V.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:u(()=>[a("div",re,[a("h5",ue,r(e.$t("roles")),1),a("div",null,[a("span",de,[ce,t(N,{modelValue:V.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=s=>V.value.global.value=s),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:u(()=>[t(S,{"selection-mode":"multiple","header-style":"width: 3rem"}),t(S,{field:"index",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:u(s=>[D(r(s.data.id),1)]),_:1},8,["header"]),t(S,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:u(s=>[D(r(s.data.name),1)]),_:1},8,["header"]),t(S,{"header-style":"min-width:10rem;"},{body:u(s=>[a("div",null,[y(t(n,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:m=>R(s.data.id)},null,8,["onClick"]),[[g,"roles edit"]]),y(t(n,{icon:"pi pi-trash",class:"delete mt-2",onClick:m=>A(s.data.id)},null,8,["onClick"]),[[g,"roles delete"]]),y(t(n,{icon:"pi pi-wallet",class:"show mt-2",onClick:m=>O(s.data.id)},null,8,["onClick"]),[[g,"roles delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[g,"roles list"]]),t(P,{visible:w.value,"onUpdate:visible":l[4]||(l[4]=s=>w.value=s),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:u(()=>[t(n,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[3]||(l[3]=s=>w.value=!1)},null,8,["label"]),t(n,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:E},null,8,["label"])]),default:u(()=>[a("div",me,[pe,B.value?(v(),_("span",ve,[D(r(e.$t("remove_item"))+" ",1),a("b",null,r(B.value.first_name),1),D("?")])):$("",!0)])]),_:1},8,["visible","header"]),t(P,{visible:h.value,"onUpdate:visible":l[7]||(l[7]=s=>h.value=s),style:{width:"550px"},header:e.$t("roles"),modal:!0},{default:u(()=>{var s,m;return[a("div",fe,[a("label",he,r(e.$t("name")),1),t(N,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.name,"onUpdate:modelValue":l[5]||(l[5]=p=>i.value.name=p),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(s=d.value)!=null&&s.name?(v(),_("div",be,r(d.value.name[0]),1)):$("",!0)]),a("div",ge,[a("label",_e,r(e.$t("permissions")),1),t(I,{modelValue:i.value.permissions,"onUpdate:modelValue":l[6]||(l[6]=p=>i.value.permissions=p),filter:"","option-value":"id",options:U.value,optionLabel:"name",placeholder:e.$t("permissions"),class:"w-full md:w-20rem"},null,8,["modelValue","options","placeholder"]),(m=d.value)!=null&&m.name?(v(),_("div",ye,r(d.value.name[0]),1)):$("",!0)]),a("div",we,[t(n,{onClick:z,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),t(P,{visible:b.value,"onUpdate:visible":l[10]||(l[10]=s=>b.value=s),style:{width:"550px"},header:e.$t("roles"),modal:!0},{default:u(()=>{var s,m;return[a("div",ke,[a("label",$e,r(e.$t("name")),1),t(N,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.name,"onUpdate:modelValue":l[8]||(l[8]=p=>i.value.name=p),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(s=d.value)!=null&&s.name?(v(),_("div",xe,r(d.value.name[0]),1)):$("",!0)]),a("div",Ce,[a("label",Ve,r(e.$t("permissions")),1),t(I,{modelValue:i.value.permissions,"onUpdate:modelValue":l[9]||(l[9]=p=>i.value.permissions=p),filter:"","option-value":"id",options:U.value,optionLabel:"name",placeholder:e.$t("permissions"),class:"w-full md:w-20rem"},null,8,["modelValue","options","placeholder"]),(m=d.value)!=null&&m.permissions?(v(),_("div",Se,r(d.value.permissions[0]),1)):$("",!0)]),a("div",De,[t(n,{onClick:F,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Le as default};