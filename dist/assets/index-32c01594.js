import{a9 as Y,Q as Z,R as s,aa as ee,S as le,ab as ae,r as i,ac as te,o as k,d as x,e as o,f as t,w as n,i as b,x as se,t as d,h as _,g as P,c as h}from"./main-273050ca.js";const oe={class:"grid overflow-x-scroll"},ne={class:"col-12"},ie={class:"my-2"},de={style:{},class:"shadow-xl"},re={class:"flex w-full justify-between align-items-center"},ue={class:"m-0 my-auto"},ce={class:"block mt-2 md:mt-0 p-input-icon-left"},pe=o("i",{class:"pi pi-search"},null,-1),me={class:"flex align-items-center justify-content-center"},ve=o("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),ye={key:0},fe={class:"flex flex-column gap-2"},be={class:"w-full text-right",for:"username"},_e={key:0,class:"mt-1 mb-5 text-red-500"},he={class:"w-full text-center"},ge={class:"flex flex-column gap-2"},we={class:"w-full text-right",for:"username"},$e={key:0,class:"mt-1 mb-5 text-red-500"},ke={class:"w-full text-center"},xe={__name:"index",setup(Ve){const S=Y();Z();const D=s({}),T=s(!0),c=s({base_salary:""}),L=s({}),p=s(""),N=s(null);s(!1);const g=s(!1),V=s(""),B=s(null),M=s(null),C=s({}),m=s(!1),r=s({}),v=s(!1);s(""),ee(()=>{G()});const w=()=>{var e;h.get(`/api/payroll?base_salary=${(e=c.value)==null?void 0:e.base_salary}`).then(a=>{T.value=!1,N.value=a.data.data,console.log(N.value)}),h.get("/api/employees").then(a=>{D.value=a.data.data})};le(()=>{w()});const F=e=>{h.get(`/api/payroll/${e}`).then(a=>{T.value=!1,r.value=a.data.data}),V.value=e,v.value=!v.value},q=()=>{h.put(`/api/payroll/${V.value}`,r.value).then(e=>{console.log(e.data),w(),v.value=!v.value,S.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),r.value=s({})}).catch(e=>{p.value=e.response.data.errors})},A=()=>{m.value=!m.value,r.value={}},z=e=>{console.log(e),g.value=!0,V.value=e},E=()=>{h.post("/api/payroll",r.value).then(e=>{console.log(e.data),w(),m.value=!m.value,S.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),r.value=s({})}).catch(e=>{p.value=e.response.data.errors})},O=()=>{h.delete(`/api/payroll/${V.value}`).then(e=>{console.log(e.data),g.value=!1,w(),S.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},Q=()=>{M.value.exportCSV()},G=()=>{C.value={global:{value:null,matchMode:ae.CONTAINS}}};return(e,a)=>{const u=i("Button"),j=i("Toolbar"),H=i("Toast"),I=i("Calendar"),J=i("InputNumber"),K=i("InputText"),y=i("Column"),W=i("DataTable"),U=i("Dialog"),R=i("MultiSelect"),X=i("va-card"),f=te("can");return k(),x("div",oe,[o("div",ne,[t(X,{class:"card"},{default:n(()=>[t(j,{class:"mb-4 shadow-md"},{start:n(()=>[o("div",ie,[b(t(u,{label:e.$t("payroll"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:A},null,8,["label"]),[[f,"payroll create"]])])]),end:n(()=>[b(t(u,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:a[0]||(a[0]=l=>Q(l))},null,8,["label"]),[[f,"payroll list"]])]),_:1}),t(H),t(j,{class:"mb-4 shadow-md overflow-x-scroll"},{start:n(()=>[t(I,{modelValue:c.value.start_date,"onUpdate:modelValue":a[1]||(a[1]=l=>c.value.start_date=l),placeholder:e.$t("from")},null,8,["modelValue","placeholder"]),t(I,{modelValue:c.value.end_date,"onUpdate:modelValue":a[2]||(a[2]=l=>c.value.end_date=l),placeholder:e.$t("to"),class:"mx-2"},null,8,["modelValue","placeholder"]),t(J,{required:"",class:"bg-[#f7f5f5]",modelValue:c.value.base_salary,"onUpdate:modelValue":a[3]||(a[3]=l=>c.value.base_salary=l),placeholder:e.$t("basic_salary")},null,8,["modelValue","placeholder"])]),end:n(()=>[b(t(u,{icon:"pi pi-search",class:"create",onClick:w},null,512),[[f,"payroll list"]])]),_:1}),o("div",de,[b((k(),se(W,{ref_key:"dt",ref:M,selection:B.value,"onUpdate:selection":a[5]||(a[5]=l=>B.value=l),value:N.value,loading:T.value,"data-key":"id",paginator:!0,rows:10,filters:C.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:n(()=>[o("div",re,[o("h5",ue,d(e.$t("payroll")),1),o("div",null,[o("span",ce,[pe,t(K,{modelValue:C.value.global.value,"onUpdate:modelValue":a[4]||(a[4]=l=>C.value.global.value=l),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:n(()=>[t(y,{"selection-mode":"multiple","header-style":"width: 3rem"}),t(y,{field:"employee.name ",header:e.$t("employee_payroll"),sortable:!0,"header-style":"width:20%; min-width:12rem;",class:"ltr:text-justify"},{body:n(l=>[_(d(l.data.employee.name),1)]),_:1},8,["header"]),t(y,{field:"base_salary",header:e.$t("basic_salary"),sortable:!0,"header-style":"width:20%; min-width:10rem;",class:"ltr:text-justify"},{body:n(l=>[_(d(l.data.base_salary),1)]),_:1},8,["header"]),t(y,{field:"deduction",header:e.$t("deduction_mount"),sortable:!0,"header-style":"width:20%; min-width:10rem;",class:"ltr:text-justify"},{body:n(l=>[_(d(l.data.deduction),1)]),_:1},8,["header"]),t(y,{field:"bonus",header:e.$t("bonus"),sortable:!0,"header-style":"width:20%; min-width:10rem;",class:"ltr:text-justify"},{body:n(l=>[_(d(l.data.bonus),1)]),_:1},8,["header"]),t(y,{"header-style":"min-width:10rem;"},{body:n(l=>[o("div",null,[b(t(u,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:$=>F(l.data.id)},null,8,["onClick"]),[[f,"payroll edit"]]),b(t(u,{icon:"pi pi-trash",class:"delete mt-2",onClick:$=>z(l.data.id)},null,8,["onClick"]),[[f,"payroll delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[f,"payroll list"]]),t(U,{visible:g.value,"onUpdate:visible":a[7]||(a[7]=l=>g.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:n(()=>[t(u,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:a[6]||(a[6]=l=>g.value=!1)},null,8,["label"]),t(u,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:O},null,8,["label"])]),default:n(()=>[o("div",me,[ve,L.value?(k(),x("span",ye,[_(d(e.$t("remove_item"))+" ",1),o("b",null,d(L.value.first_name),1),_("?")])):P("",!0)])]),_:1},8,["visible","header"]),t(U,{visible:m.value,"onUpdate:visible":a[9]||(a[9]=l=>m.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var l;return[o("div",fe,[o("label",be,d(e.$t("employee_payroll")),1),t(R,{modelValue:r.value.employees_ids,"onUpdate:modelValue":a[8]||(a[8]=$=>r.value.employees_ids=$),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:D.value,optionLabel:"name",placeholder:e.$t("employee_payroll"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(l=p.value)!=null&&l.employees_ids?(k(),x("div",_e,d(p.value.employees_ids[0]),1)):P("",!0)]),o("div",he,[t(u,{onClick:E,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),t(U,{visible:v.value,"onUpdate:visible":a[11]||(a[11]=l=>v.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var l;return[o("div",ge,[o("label",we,d(e.$t("employee_payroll")),1),t(R,{modelValue:r.value.employees_ids,"onUpdate:modelValue":a[10]||(a[10]=$=>r.value.employees_ids=$),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:D.value,optionLabel:"name",placeholder:e.$t("employee_payroll"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(l=p.value)!=null&&l.employees_ids?(k(),x("div",$e,d(p.value.employees_ids[0]),1)):P("",!0)]),o("div",ke,[t(u,{onClick:q,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{xe as default};
