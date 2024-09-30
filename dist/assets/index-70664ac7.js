import{aa as ee,ab as ae,T as s,ac as le,a3 as te,ad as oe,r as c,ae as se,o as g,d as _,e as o,f as t,w as r,i as $,x as ne,t as i,h as T,g as x,c as p}from"./main-a8302db8.js";const ie={class:"grid"},re={class:"col-12"},ue={class:"my-2"},de={style:{},class:"shadow-xl"},ce={class:"flex w-full justify-between align-items-center"},me={class:"m-0 my-auto"},pe={class:"block mt-2 md:mt-0 p-input-icon-left"},ve=o("i",{class:"pi pi-search"},null,-1),fe={class:"flex align-items-center justify-content-center"},ge=o("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),he={key:0},be={class:"flex flex-column gap-2 py-1"},_e={class:"w-full text-right",for:"username"},ye={key:0,class:"mt-1 mb-5 text-red-500"},we={class:"flex flex-column gap-2 py-1"},ke={class:"w-full text-right",for:"username"},$e={key:0,class:"mt-1 mb-5 text-red-500"},xe={class:"w-full text-center"},Ve={class:"flex flex-column gap-2 py-1"},Ce={class:"w-full text-right",for:"username"},De={key:0,class:"mt-1 mb-5 text-red-500"},Se={class:"flex flex-column gap-2 py-1"},Te={class:"w-full text-right",for:"username"},Le={key:0,class:"mt-1 mb-5 text-red-500"},Pe={class:"w-full text-center"},Be={__name:"index",setup(Ue){const L=ee();ae();const P=s([{name:" ",code:" "}]),y=s([{name:" ",code:" "}]),U=s(!0),j=s({}),u=s(""),N=s(null);s(!1);const w=s(!1),V=s(""),R=s(null),A=s(null),C=s({}),h=s(!1),d=s([]),m=s(""),b=s(!1);le(()=>{Q()});const D=()=>{p.get("/api/region").then(e=>{N.value=e.data.data,console.log(N.value)}),p.post("/api/region/Allregion").then(e=>{P.value=e.data.regions.map(a=>({name:a})),U.value=!1})};te(()=>{D()});const E=e=>{m.value="",d.value=[],p.get(`/api/region/getareabyregion/${e}`).then(a=>{U.value=!1,p.post("/api/region/getareabyregion",{region_name:a.data.data.region_name}).then(n=>{y.value=n.data.areas.map(B=>({name:B}))}),m.value=a.data.data.region_name;for(let n=0;n<a.data.data.areas.length;n++)console.log(a.data.data.areas[0]),d.value.push(a.data.data.areas[n].area_name)}),console.log(d.value),V.value=e,b.value=!b.value},F=e=>{console.log(e),p.post("/api/region/getareabyregion",{region_name:e}).then(a=>{y.value=a.data.areas.map(n=>({name:n}))})},O=()=>{p.post(`/api/region/update/region/${V.value}`,{region_name:m.value,areas:d.value}).then(e=>{console.log(e.data),D(),b.value=!b.value,L.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=s({})}).catch(e=>{u.value=e.response.data.errors})},q=()=>{y.value=[],m.value="",d.value=[],h.value=!h.value},G=e=>{console.log(e),w.value=!0,V.value=e},H=()=>{p.post("/api/region/create-region-with-areas",{region_name:m.value,areas:d.value}).then(e=>{console.log(e.data),D(),h.value=!h.value,L.add({severity:"success",summary:"Successful",detail:" Successful",life:3e3}),role.value=s({})}).catch(e=>{u.value=e.response.data.errors})},J=()=>{p.delete(`/api/region/${V.value}`).then(e=>{console.log(e.data),D(),w.value=!1,L.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},K=()=>{A.value.exportCSV()},Q=()=>{C.value={global:{value:null,matchMode:oe.CONTAINS}}};return(e,a)=>{const n=c("Button"),B=c("Toolbar"),W=c("Toast"),X=c("InputText"),S=c("Column"),Y=c("DataTable"),M=c("Dialog"),I=c("Dropdown"),z=c("MultiSelect"),Z=c("va-card"),k=se("can");return g(),_("div",ie,[o("div",re,[t(Z,{class:"card"},{default:r(()=>[t(B,{class:"mb-4 shadow-md"},{start:r(()=>[o("div",ue,[$(t(n,{label:e.$t("area"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:q},null,8,["label"]),[[k,"region show"]])])]),end:r(()=>[$(t(n,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:a[0]||(a[0]=l=>K(l))},null,8,["label"]),[[k,"region show"]])]),_:1}),t(W),o("div",de,[$((g(),ne(Y,{ref_key:"dt",ref:A,selection:R.value,"onUpdate:selection":a[2]||(a[2]=l=>R.value=l),value:N.value,loading:U.value,"data-key":"id",paginator:!0,rows:10,filters:C.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:r(()=>[o("div",ce,[o("h5",me,i(e.$t("area")),1),o("div",null,[o("span",pe,[ve,t(X,{modelValue:C.value.global.value,"onUpdate:modelValue":a[1]||(a[1]=l=>C.value.global.value=l),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:r(()=>[t(S,{"selection-mode":"multiple","header-style":"width: 3rem"}),t(S,{field:"index",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:r(l=>[T(i(l.data.id),1)]),_:1},8,["header"]),t(S,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:r(l=>[T(i(l.data.name),1)]),_:1},8,["header"]),t(S,{"header-style":"min-width:10rem;"},{body:r(l=>[o("div",null,[$(t(n,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:v=>E(l.data.id)},null,8,["onClick"]),[[k,"roles edit"]]),$(t(n,{icon:"pi pi-trash",class:"delete mt-2",onClick:v=>G(l.data.id)},null,8,["onClick"]),[[k,"roles delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[k,"region show"]]),t(M,{visible:w.value,"onUpdate:visible":a[4]||(a[4]=l=>w.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:r(()=>[t(n,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:a[3]||(a[3]=l=>w.value=!1)},null,8,["label"]),t(n,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:J},null,8,["label"])]),default:r(()=>[o("div",fe,[ge,j.value?(g(),_("span",he,[T(i(e.$t("remove_item"))+" ",1),o("b",null,i(j.value.first_name),1),T("?")])):x("",!0)])]),_:1},8,["visible","header"]),t(M,{visible:h.value,"onUpdate:visible":a[7]||(a[7]=l=>h.value=l),style:{width:"550px"},header:e.$t("area"),modal:!0},{default:r(()=>{var l,v;return[o("div",be,[o("label",_e,i(e.$t("name")),1),t(I,{modelValue:m.value,"onUpdate:modelValue":[a[5]||(a[5]=f=>m.value=f),F],editable:"",options:P.value,optionLabel:"name",placeholder:e.$t("name"),"option-value":"name",class:"bg-[#f7f5f5] text-center"},null,8,["modelValue","options","placeholder"]),(l=u.value)!=null&&l.name?(g(),_("div",ye,i(u.value.name[0]),1)):x("",!0)]),o("div",we,[o("label",ke,i(e.$t("area_name")),1),t(z,{modelValue:d.value,"onUpdate:modelValue":a[6]||(a[6]=f=>d.value=f),filter:"","option-value":"name",options:y.value,optionLabel:"name",placeholder:e.$t("area_name"),class:"w-full md:w-20rem"},null,8,["modelValue","options","placeholder"]),(v=u.value)!=null&&v.name?(g(),_("div",$e,i(u.value.name[0]),1)):x("",!0)]),o("div",xe,[t(n,{onClick:H,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),t(M,{visible:b.value,"onUpdate:visible":a[10]||(a[10]=l=>b.value=l),style:{width:"550px"},header:e.$t("area"),modal:!0},{default:r(()=>{var l,v;return[o("div",Ve,[o("label",Ce,i(e.$t("name")),1),t(I,{modelValue:m.value,"onUpdate:modelValue":[a[8]||(a[8]=f=>m.value=f),F],editable:"",options:P.value,optionLabel:"name",placeholder:e.$t("name"),"option-value":"name",class:"bg-[#f7f5f5] text-center"},null,8,["modelValue","options","placeholder"]),(l=u.value)!=null&&l.name?(g(),_("div",De,i(u.value.name[0]),1)):x("",!0)]),o("div",Se,[o("label",Te,i(e.$t("area_name")),1),t(z,{modelValue:d.value,"onUpdate:modelValue":a[9]||(a[9]=f=>d.value=f),filter:"","option-value":"name",options:y.value,optionLabel:"name",placeholder:e.$t("area_name"),class:"w-full md:w-20rem"},null,8,["modelValue","options","placeholder"]),(v=u.value)!=null&&v.name?(g(),_("div",Le,i(u.value.name[0]),1)):x("",!0)]),o("div",Pe,[t(n,{onClick:O,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Be as default};