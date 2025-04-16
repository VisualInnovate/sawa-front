import{_ as te,m as ae,a1 as le,q as n,aj as oe,a2 as se,ak as ne,r as u,al as z,o as d,d as c,e as l,f as a,g as o,t as r,i as D,L as ie,h as I,j as N,c as k,y as de,z as re}from"./main-df225a0a.js";const B=_=>(de("data-v-3fd1aa02"),_=_(),re(),_),ce={class:"grid"},ue={class:"col-12"},pe={class:"card p-4 shadow-2 border-round"},me={class:"text-2xl font-bold"},ve={class:"flex gap-2"},_e={class:"card shadow-1 surface-0"},fe={class:"flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3"},he={class:"flex gap-2"},ge={class:"p-input-icon-left"},ye=B(()=>l("i",{class:"pi pi-search"},null,-1)),be={class:"font-medium"},ke={key:0},xe={key:1},we={key:0,class:"text-red-500 font-medium"},$e={key:1},Ce={key:0,class:"text-orange-500 font-medium"},Se={key:1},Te={key:2},Le=B(()=>l("div",{class:"text-center py-4"},[l("i",{class:"pi pi-exclamation-circle text-2xl mb-2"}),l("p",{class:"text-xl"},"No records found")],-1)),Ve={class:"flex justify-content-center align-items-center py-4"},De={class:"flex align-items-center justify-content-center"},Ie=B(()=>l("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem",color:"var(--red-500)"}},null,-1)),Ne={key:0},Be={class:"flex flex-column gap-2"},Me={class:"w-full text-right",for:"username"},Re={key:0,class:"mt-1 mb-5 text-red-500"},Ee={class:"w-full text-center"},Fe={class:"flex flex-column gap-2"},Ue={class:"w-full text-right",for:"username"},je={key:0,class:"mt-1 mb-5 text-red-500"},qe={class:"w-full text-center"},Ae={__name:"daily_attendance",setup(_){const x=ae();le();const M=n([]),f=n(!0),R=n({}),v=n(""),w=n(null),h=n(!1),P=n(""),E=n(null),F=n(null),g=n({}),y=n(!1),U=n({}),$=n({}),j=n(!1),C=n(!1),S=n(!1);oe(()=>{K()});const H=()=>{k.post("/api/users").then(t=>{M.value=t.data.users.data})},b=()=>{f.value=!0,k.get("/api/employees/get/today/clockIn").then(t=>{f.value=!1,w.value=t.data.data,console.log(w.value)}).catch(()=>{f.value=!1,x.add({severity:"error",summary:"Error",detail:"Failed to load data",life:3e3})})};se(()=>{b(),H()});const G=()=>{k.post("/api/employees/import/users",$.value).then(t=>{console.log(t.data),b(),y.value=!y.value,x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=n({})}).catch(t=>{v.value=t.response.data.errors})},O=()=>{k.delete(`/api/employees/${P.value}`).then(t=>{console.log(t.data),h.value=!1,b(),x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},W=()=>{C.value=!0,F.value.exportCSV(),setTimeout(()=>{C.value=!1},1e3)},J=()=>{S.value=!0;const t=document.querySelector(".p-datatable-wrapper").cloneNode(!0);document.body.innerHTML,t.querySelectorAll(".p-button").forEach(T=>T.remove());const i=window.open("","_blank");i.document.write(`
    <html>
      <head>
        <title>Employee Clock-In Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f5f5f5; text-align: left; padding: 8px; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          @page { size: auto; margin: 5mm; }
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <h1>Employee Clock-In Report</h1>
        ${t.innerHTML}
        <div style="text-align: center; margin-top: 20px; font-size: 12px;">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
    </html>
  `),i.document.close(),i.focus(),setTimeout(()=>{i.print(),i.close(),S.value=!1},500)},K=()=>{g.value={global:{value:null,matchMode:ne.CONTAINS}}};return(t,s)=>{const i=u("Button"),T=u("Toolbar"),Q=u("Toast"),q=u("InputText"),p=u("Column"),L=u("Tag"),X=u("ProgressSpinner"),Y=u("DataTable"),V=u("Dialog"),Z=u("MultiSelect"),A=z("can"),ee=z("tooltip");return d(),c("div",ce,[l("div",ue,[l("div",pe,[a(T,{class:"mb-4"},{start:o(()=>[l("h2",me,r(t.$t("تقرير الحضور اليومي ")),1)]),end:o(()=>[l("div",ve,[a(i,{label:t.$t("print"),icon:"pi pi-print",class:"p-button-help no-print",loading:S.value,onClick:J},null,8,["label","loading"]),D(a(i,{label:t.$t("export"),icon:"pi pi-download",class:"p-button-info no-print",loading:C.value,onClick:W},null,8,["label","loading"]),[[A,"employees list"]])])]),_:1}),a(Q),l("div",_e,[D((d(),ie(Y,{ref_key:"dt",ref:F,selection:E.value,"onUpdate:selection":s[1]||(s[1]=e=>E.value=e),value:w.value,loading:f.value,"data-key":"id",paginator:!0,rows:10,filters:g.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25,50,100],"current-page-report-template":"Showing {first} to {last} of {totalRecords} records","responsive-layout":"scroll",scrollable:"","scroll-height":"flex",stripedRows:"",showGridlines:"",class:"p-datatable-sm"},{header:o(()=>[l("div",fe,[l("div",he,[l("span",ge,[ye,a(q,{modelValue:g.value.global.value,"onUpdate:modelValue":s[0]||(s[0]=e=>g.value.global.value=e),placeholder:t.$t("search"),class:"w-full"},null,8,["modelValue","placeholder"])]),D(a(i,{icon:"pi pi-refresh",class:"p-button-text",onClick:b},null,512),[[ee,"Refresh data",void 0,{top:!0}]])])])]),empty:o(()=>[Le]),loading:o(()=>[l("div",Ve,[a(X,{style:{width:"50px",height:"50px"},strokeWidth:"4"})])]),default:o(()=>[a(p,{"selection-mode":"multiple","header-style":"width: 3rem"}),a(p,{field:"employee.name",header:t.$t("Employee"),sortable:!0},{body:o(e=>{var m;return[l("span",be,r(((m=e.data.employee)==null?void 0:m.name)||"N/A"),1)]}),_:1},8,["header"]),a(p,{field:"date",header:t.$t("Date"),sortable:!0},{body:o(e=>[I(r(e.data.date),1)]),_:1},8,["header"]),a(p,{field:"clock_in",header:t.$t("Clock In"),sortable:!0},{body:o(e=>[a(L,{value:e.data.clock_in,severity:e.data.late>0?"danger":"success"},null,8,["value","severity"])]),_:1},8,["header"]),a(p,{field:"clock_out",header:t.$t("Clock Out"),sortable:!0},{body:o(e=>[a(L,{value:e.data.clock_out||"--:--:--",severity:e.data.clock_out?e.data.early_leave>0?"warning":"info":"danger"},null,8,["value","severity"])]),_:1},8,["header"]),a(p,{field:"status",header:t.$t("Status"),sortable:!0},{body:o(e=>[a(L,{value:e.data.status,severity:{clocked_in:"info",attend:"success",absent:"danger"}[e.data.status]||"warning"},null,8,["value","severity"])]),_:1},8,["header"]),a(p,{field:"working_hours",header:t.$t("Hours"),sortable:!0},{body:o(e=>[e.data.working_hours!==null?(d(),c("span",ke,r(e.data.working_hours.toFixed(2))+"h ",1)):(d(),c("span",xe,"--"))]),_:1},8,["header"]),a(p,{field:"late",header:t.$t("Late (h)"),sortable:!0},{body:o(e=>[e.data.late>0?(d(),c("span",we,r(e.data.late.toFixed(2)),1)):(d(),c("span",$e,"0"))]),_:1},8,["header"]),a(p,{field:"early_leave",header:t.$t("Early Leave (h)"),sortable:!0},{body:o(e=>[e.data.early_leave>0?(d(),c("span",Ce,r(e.data.early_leave.toFixed(2)),1)):e.data.early_leave===null?(d(),c("span",Se,"--")):(d(),c("span",Te,"0"))]),_:1},8,["header"])]),_:1},8,["selection","value","loading","filters"])),[[A,"employees list"]])]),a(V,{visible:h.value,"onUpdate:visible":s[3]||(s[3]=e=>h.value=e),style:{width:"450px"},header:t.$t("confirm"),modal:!0},{footer:o(()=>[a(i,{label:t.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:s[2]||(s[2]=e=>h.value=!1)},null,8,["label"]),a(i,{label:t.$t("yes"),icon:"pi pi-check",class:"p-button-text p-button-danger",onClick:O},null,8,["label"])]),default:o(()=>[l("div",De,[Ie,R.value?(d(),c("span",Ne,[I(r(t.$t("remove_item"))+" ",1),l("b",null,r(R.value.first_name),1),I("? ")])):N("",!0)])]),_:1},8,["visible","header"]),a(V,{visible:y.value,"onUpdate:visible":s[5]||(s[5]=e=>y.value=e),style:{width:"450px"},header:t.$t("create_employee"),modal:!0},{default:o(()=>{var e;return[l("div",Be,[l("label",Me,r(t.$t("users")),1),a(Z,{modelValue:$.value.users_ids,"onUpdate:modelValue":s[4]||(s[4]=m=>$.value.users_ids=m),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:M.value,optionLabel:"name",placeholder:t.$t("users"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(e=v.value)!=null&&e.name?(d(),c("div",Re,r(v.value.name[0]),1)):N("",!0)]),l("div",Ee,[a(i,{onClick:G,class:"p-button-success m-auto w-[50%] my-4",label:t.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),a(V,{visible:j.value,"onUpdate:visible":s[7]||(s[7]=e=>j.value=e),style:{width:"450px"},header:t.$t("update_employee"),modal:!0},{default:o(()=>{var e;return[l("div",Fe,[l("label",Ue,r(t.$t("title")),1),a(q,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:U.value.title,"onUpdate:modelValue":s[6]||(s[6]=m=>U.value.title=m),placeholder:t.$t("title")},null,8,["modelValue","placeholder"]),(e=v.value)!=null&&e.title?(d(),c("div",je,r(v.value.name[0]),1)):N("",!0)]),l("div",qe,[a(i,{onClick:t.editescrud,class:"p-button-success m-auto w-[50%] my-4",label:t.$t("submit")},null,8,["onClick","label"])])]}),_:1},8,["visible","header"])])])])}}},Pe=te(Ae,[["__scopeId","data-v-3fd1aa02"]]);export{Pe as default};
