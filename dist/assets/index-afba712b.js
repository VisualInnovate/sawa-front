import{aa as Q,ab as W,T as o,ac as X,a3 as Y,ad as Z,r,ae as ee,o as g,d as x,e as s,f as t,w as i,i as w,x as le,t as n,h as y,g as L,c as f}from"./main-5d394928.js";const te={class:"grid"},ae={class:"col-12"},se={class:"my-2"},oe={style:{},class:"shadow-xl"},ie={class:"flex w-full justify-between align-items-center"},ne={class:"m-0 my-auto"},de={class:"block mt-2 md:mt-0 p-input-icon-left"},re=s("i",{class:"pi pi-search"},null,-1),ue={class:"flex align-items-center justify-content-center"},ce=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),pe={key:0},me={class:"flex flex-column gap-2"},ve={class:"w-full text-right",for:"username"},ye={key:0,class:"mt-1 mb-5 text-red-500"},fe={class:"w-full text-center"},be={class:"flex flex-column gap-2"},he={class:"w-full text-right",for:"username"},_e={key:0,class:"mt-1 mb-5 text-red-500"},ge={class:"w-full text-center"},$e={__name:"index",setup(we){const V=Q();W();const S=o({}),T=o(!0),N=o({}),c=o(""),D=o(null);o(!1);const b=o(!1),k=o(""),B=o(null),M=o(null),$=o({}),p=o(!1),d=o({}),m=o(!1);X(()=>{E()});const C=()=>{f.get("/api/payroll").then(e=>{T.value=!1,D.value=e.data.data,console.log(D.value)}),f.get("/api/employees").then(e=>{S.value=e.data.data})};Y(()=>{C()});const j=e=>{f.get(`/api/payroll/${e}`).then(a=>{T.value=!1,d.value=a.data.data}),k.value=e,m.value=!m.value},R=()=>{f.put(`/api/payroll/${k.value}`,d.value).then(e=>{console.log(e.data),C(),m.value=!m.value,V.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),d.value=o({})}).catch(e=>{c.value=e.response.data.errors})},F=()=>{p.value=!p.value,d.value={}},I=e=>{console.log(e),b.value=!0,k.value=e},q=()=>{f.post("/api/payroll",d.value).then(e=>{console.log(e.data),C(),p.value=!p.value,V.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),d.value=o({})}).catch(e=>{c.value=e.response.data.errors})},A=()=>{f.delete(`/api/payroll/${k.value}`).then(e=>{console.log(e.data),b.value=!1,C(),V.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},z=()=>{M.value.exportCSV()},E=()=>{$.value={global:{value:null,matchMode:Z.CONTAINS}}};return(e,a)=>{const u=r("Button"),O=r("Toolbar"),G=r("Toast"),H=r("InputText"),v=r("Column"),J=r("DataTable"),P=r("Dialog"),U=r("MultiSelect"),K=r("va-card"),h=ee("can");return g(),x("div",te,[s("div",ae,[t(K,{class:"card"},{default:i(()=>[t(O,{class:"mb-4 shadow-md"},{start:i(()=>[s("div",se,[w(t(u,{label:e.$t("payroll"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:F},null,8,["label"]),[[h,"payroll create"]])])]),end:i(()=>[w(t(u,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:a[0]||(a[0]=l=>z(l))},null,8,["label"]),[[h,"payroll list"]])]),_:1}),t(G),s("div",oe,[w((g(),le(J,{ref_key:"dt",ref:M,selection:B.value,"onUpdate:selection":a[2]||(a[2]=l=>B.value=l),value:D.value,loading:T.value,"data-key":"id",paginator:!0,rows:10,filters:$.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:i(()=>[s("div",ie,[s("h5",ne,n(e.$t("payroll")),1),s("div",null,[s("span",de,[re,t(H,{modelValue:$.value.global.value,"onUpdate:modelValue":a[1]||(a[1]=l=>$.value.global.value=l),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:i(()=>[t(v,{"selection-mode":"multiple","header-style":"width: 3rem"}),t(v,{field:"employee.name ",header:e.$t("employee_payroll"),sortable:!0,"header-style":"width:20%; min-width:12rem;",class:"ltr:text-justify"},{body:i(l=>[y(n(l.data.employee.name),1)]),_:1},8,["header"]),t(v,{field:"base_salary",header:e.$t("basic_salary"),sortable:!0,"header-style":"width:20%; min-width:10rem;",class:"ltr:text-justify"},{body:i(l=>[y(n(l.data.base_salary),1)]),_:1},8,["header"]),t(v,{field:"deduction",header:e.$t("deduction_mount"),sortable:!0,"header-style":"width:20%; min-width:10rem;",class:"ltr:text-justify"},{body:i(l=>[y(n(l.data.deduction),1)]),_:1},8,["header"]),t(v,{field:"bonus",header:e.$t("bonus"),sortable:!0,"header-style":"width:20%; min-width:10rem;",class:"ltr:text-justify"},{body:i(l=>[y(n(l.data.bonus),1)]),_:1},8,["header"]),t(v,{"header-style":"min-width:10rem;"},{body:i(l=>[s("div",null,[w(t(u,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:_=>j(l.data.id)},null,8,["onClick"]),[[h,"payroll edit"]]),w(t(u,{icon:"pi pi-trash",class:"delete mt-2",onClick:_=>I(l.data.id)},null,8,["onClick"]),[[h,"payroll delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[h,"payroll list"]]),t(P,{visible:b.value,"onUpdate:visible":a[4]||(a[4]=l=>b.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:i(()=>[t(u,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:a[3]||(a[3]=l=>b.value=!1)},null,8,["label"]),t(u,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:A},null,8,["label"])]),default:i(()=>[s("div",ue,[ce,N.value?(g(),x("span",pe,[y(n(e.$t("remove_item"))+" ",1),s("b",null,n(N.value.first_name),1),y("?")])):L("",!0)])]),_:1},8,["visible","header"]),t(P,{visible:p.value,"onUpdate:visible":a[6]||(a[6]=l=>p.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:i(()=>{var l;return[s("div",me,[s("label",ve,n(e.$t("employee_payroll")),1),t(U,{modelValue:d.value.employees_ids,"onUpdate:modelValue":a[5]||(a[5]=_=>d.value.employees_ids=_),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:S.value,optionLabel:"name",placeholder:e.$t("employee_payroll"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(l=c.value)!=null&&l.employees_ids?(g(),x("div",ye,n(c.value.employees_ids[0]),1)):L("",!0)]),s("div",fe,[t(u,{onClick:q,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),t(P,{visible:m.value,"onUpdate:visible":a[8]||(a[8]=l=>m.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:i(()=>{var l;return[s("div",be,[s("label",he,n(e.$t("employee_payroll")),1),t(U,{modelValue:d.value.employees_ids,"onUpdate:modelValue":a[7]||(a[7]=_=>d.value.employees_ids=_),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:S.value,optionLabel:"name",placeholder:e.$t("employee_payroll"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(l=c.value)!=null&&l.employees_ids?(g(),x("div",_e,n(c.value.employees_ids[0]),1)):L("",!0)]),s("div",ge,[t(u,{onClick:R,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{$e as default};
