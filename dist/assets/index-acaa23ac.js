import{ah as ae,a9 as te,R as n,aa as le,S as se,ab as oe,r as c,ac as ne,o as L,d as F,e as s,f as l,w as d,i as w,x as ie,t as u,h as k,N as de,g as ue,E as P,G as D,T as q,br as E,c as p}from"./main-d5d5ddd5.js";import"./moment-fbc5633a.js";const re={class:"grid"},ce={class:"col-12"},me={class:"my-2"},pe={style:{},class:"shadow-xl"},ve={class:"flex w-full justify-between align-items-center"},fe={class:"m-0 my-auto"},_e={class:"block mt-2 md:mt-0 p-input-icon-left"},he=s("i",{class:"pi pi-search"},null,-1),be={class:"flex align-items-center justify-content-center"},ye=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),ge={key:0},$e=["onSubmit"],we={class:"flex flex-column gap-2"},ke={class:"text-right"},Ve={class:"flex flex-column gap-2"},xe={class:"w-full text-right",for:"username"},Ce={class:"w-full text-center"},De=["onSubmit"],Se={class:"flex flex-column gap-2"},Te={class:"text-right"},Ue={class:"flex flex-column gap-2"},Be={class:"w-full text-right",for:"username"},Le={class:"w-full text-center"},Fe={__name:"index",setup(Ne){const{t:i}=ae(),v=te(),m=n(!1),V=n(!0),S=n([]),N=n({}),T=n(null),b=n(!1),x=n(""),j=n(null),M=n(null),C=n({}),f=n(!1),o=n({}),_=n(!1),I=n([{name:i("Pending"),code:0},{name:i("Accept"),code:1},{name:i("Cancell"),code:-1}]);le(()=>{Q()});const y=()=>{p.get("/api/financial-advance").then(e=>{V.value=!1,T.value=e.data.data,console.log(T.value)}),p.get("/api/employees").then(e=>{S.value=e.data.data})},R=(e,t)=>{V.value=!0,p.get(`/api/financial-advance/change-status/${e}?status=${t}`).then(r=>{V.value=!1,y()})};se(()=>{y()});const z=e=>{p.get(`/api/financial-advance/${e}`).then(t=>{o.value=t.data.data}),x.value=e,_.value=!_.value},A=()=>{p.put(`/api/financial-advance/${x.value}`,o.value).then(e=>{console.log(e.data),y(),_.value=!_.value,v.add({severity:"success",summary:i("success_message"),detail:`${i("element_update_success")}`,life:3e3}),o.value=n({})}).catch(e=>{v.add({severity:"error",summary:i("error"),detail:`${i("mission_error")}`,life:3e3})})},G=()=>{m.value=!m.value,f.value=!f.value,skill.value={}},O=e=>{console.log(e),b.value=!0,x.value=e},H=()=>{p.post("/api/financial-advance",o.value).then(e=>{console.log(e.data),y(),f.value=!f.value,v.add({severity:"success",summary:i("success_message"),detail:`${i("element_add_success")}`,life:3e3}),o.value=n({})}).catch(e=>{v.add({severity:"error",summary:i("error"),detail:`${i("mission_error")}`,life:3e3})})},J=()=>{p.delete(`/api/financial-advance/${x.value}`).then(e=>{console.log(e.data),b.value=!1,y(),v.add({severity:"success",summary:i("success_message"),detail:`${i("element_delete_success")}`,life:3e3})}).catch(()=>{v.add({severity:"error",summary:i("error"),detail:`${i("mission_error")}`,life:3e3})})},K=()=>{M.value.exportCSV()},Q=()=>{C.value={global:{value:null,matchMode:oe.CONTAINS}}};return(e,t)=>{const r=c("Button"),W=c("Toolbar"),X=c("Toast"),Y=c("InputText"),h=c("Column"),U=c("Dropdown"),Z=c("DataTable"),B=c("Dialog"),ee=c("va-card"),g=ne("can");return L(),F("div",re,[s("div",ce,[l(ee,{class:"card"},{default:d(()=>[l(W,{class:"mb-4 shadow-md"},{start:d(()=>[s("div",me,[w(l(r,{label:e.$t("advance"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:G},null,8,["label"]),[[g,"holidays create"]])])]),end:d(()=>[w(l(r,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=a=>K(a))},null,8,["label"]),[[g,"holidays list"]])]),_:1}),l(X),s("div",pe,[w((L(),ie(Z,{ref_key:"dt",ref:M,selection:j.value,"onUpdate:selection":t[2]||(t[2]=a=>j.value=a),value:T.value,loading:V.value,"data-key":"id",paginator:!0,rows:10,filters:C.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:d(()=>[s("div",ve,[s("h5",fe,u(e.$t("advances")),1),s("div",null,[s("span",_e,[he,l(Y,{modelValue:C.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=a=>C.value.global.value=a),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:d(()=>[l(h,{"selection-mode":"multiple","header-style":"width: 3rem"}),l(h,{field:"employee.name",header:e.$t("employee_name"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:d(a=>[k(u(a.data.employee.name),1)]),_:1},8,["header"]),l(h,{field:"amount",header:e.$t("advance_mount"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:d(a=>[k(u(a.data.amount),1)]),_:1},8,["header"]),l(h,{field:"date",header:e.$t("advance_date"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:d(a=>[k(u(a.data.date),1)]),_:1},8,["header"]),l(h,{field:"status",header:e.$t("status"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:d(a=>[l(U,{"onUpdate:modelValue":[$=>R(a.data.id,$),$=>a.data.status=$],style:de([{backgroundColor:a.data.status==1?"#10B981":a.data.status==-1?"#EF4444":a.data.status==0?"#F59E0B":"transparent"},{direction:"ltr !important","text-align":"center !important"}]),id:"pv_id_1",modelValue:a.data.status,"option-value":"code",options:I.value,optionLabel:"name"},null,8,["onUpdate:modelValue","style","modelValue","options"])]),_:1},8,["header"]),l(h,{"header-style":"min-width:10rem;"},{body:d(a=>[s("div",null,[w(l(r,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:$=>z(a.data.id)},null,8,["onClick"]),[[g,"holidays edit"]]),w(l(r,{icon:"pi pi-trash",class:"delete mt-2",onClick:$=>O(a.data.id)},null,8,["onClick"]),[[g,"holidays delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[g,"holidays list"]]),l(B,{visible:b.value,"onUpdate:visible":t[4]||(t[4]=a=>b.value=a),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:d(()=>[l(r,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=a=>b.value=!1)},null,8,["label"]),l(r,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:J},null,8,["label"])]),default:d(()=>[s("div",be,[ye,N.value?(L(),F("span",ge,[k(u(e.$t("remove_item"))+" ",1),s("b",null,u(N.value.first_name),1),k("?")])):ue("",!0)])]),_:1},8,["visible","header"]),l(B,{visible:f.value,"onUpdate:visible":t[8]||(t[8]=a=>f.value=a),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:d(()=>[s("form",{onSubmit:P(H,["prevent"])},[s("div",we,[s("label",ke,u(e.$t("employee_name")),1),l(U,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:o.value.employee_id,"onUpdate:modelValue":t[5]||(t[5]=a=>o.value.employee_id=a),"option-value":"id",options:S.value,optionLabel:"name",placeholder:e.$t("employee_name"),class:D(["w-full",{"p-invalid":m.value&&!o.value.employee_id}])},null,8,["modelValue","options","placeholder","class"])]),s("div",Ve,[s("label",xe,u(e.$t("advance_mount")),1),l(q(E),{required:"",class:D(["bg-[#f7f5f5] text-center",{"p-invalid":m.value&&!o.value.amount}]),modelValue:o.value.amount,"onUpdate:modelValue":t[6]||(t[6]=a=>o.value.amount=a)},null,8,["modelValue","class"])]),s("div",Ce,[l(r,{type:"submit",onClick:t[7]||(t[7]=a=>m.value=!0),class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])],40,$e)]),_:1},8,["visible","header"]),l(B,{visible:_.value,"onUpdate:visible":t[12]||(t[12]=a=>_.value=a),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:d(()=>[s("form",{onSubmit:P(A,["prevent"])},[s("div",Se,[s("label",Te,u(e.$t("employee_name")),1),l(U,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:o.value.employee_id,"onUpdate:modelValue":t[9]||(t[9]=a=>o.value.employee_id=a),"option-value":"id",options:S.value,optionLabel:"name",placeholder:e.$t("employee_name"),class:D(["w-full",{"p-invalid":m.value&&!o.value.employee_id}])},null,8,["modelValue","options","placeholder","class"])]),s("div",Ue,[s("label",Be,u(e.$t("advance_mount")),1),l(q(E),{required:"",class:D(["bg-[#f7f5f5] text-center",{"p-invalid":m.value&&!o.value.amount}]),modelValue:o.value.amount,"onUpdate:modelValue":t[10]||(t[10]=a=>o.value.amount=a)},null,8,["modelValue","class"])]),s("div",Le,[l(r,{type:"submit",onClick:t[11]||(t[11]=a=>m.value=!0),class:"bg-[green] m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])],40,De)]),_:1},8,["visible","header"])])]),_:1})])])}}};export{Fe as default};
