import{_ as Q,m as X,a1 as Y,q as l,aj as Z,a2 as ee,ak as te,r,al as P,o as $,d as B,e as o,f as t,g as n,t as c,i as d,L as oe,h as b,j as se,c as x,y as ae,z as le}from"./main-db013b89.js";const S=h=>(ae("data-v-5ad07265"),h=h(),le(),h),ne={class:"grid"},ie={class:"col-12"},re={class:"card p-4 shadow-2 border-round"},ce={class:"text-2xl font-bold"},de={class:"flex gap-2"},pe={class:"card shadow-1 surface-0"},ue={class:"flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3"},me={class:"m-0"},he={class:"flex gap-2"},ve={class:"p-input-icon-left"},fe=S(()=>o("i",{class:"pi pi-search"},null,-1)),_e={class:"font-medium"},ge={class:"flex gap-1 justify-content-center"},be=S(()=>o("div",{class:"text-center py-4"},[o("i",{class:"pi pi-exclamation-circle text-2xl mb-2"}),o("p",{class:"text-xl"},"No records found")],-1)),xe={class:"flex justify-content-center align-items-center py-4"},ye={class:"flex align-items-center justify-content-center"},we=S(()=>o("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem",color:"var(--red-500)"}},null,-1)),ke={key:0},Ce={__name:"Index",setup(h){const V=X(),D=Y(),M=l({}),v=l(!0),T=l({});l("");const y=l(null),p=l(!1),L=l(""),R=l(null),I=l(null),f=l({});l(!1),l({name:"",permissions:[]}),l(!1);const w=l(!1),k=l(!1);Z(()=>{G()});const _=()=>{v.value=!0,x.post("/api/roles").then(e=>{y.value=e.data.roles.data,console.log(y.value)}),x.get("/api/permissions").then(e=>{M.value=e.data.permissions,v.value=!1})};ee(()=>{_()});const j=e=>{D.push({name:"ShowRole",params:{id:e}})},A=()=>{D.push({name:"CreateRole"})},z=e=>{console.log(e),p.value=!0,L.value=e},q=()=>{x.delete(`/api/roles/${L.value}/delete`).then(e=>{console.log(e.data),p.value=!1,_(),V.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},E=e=>{v.value=!0,x.get(`/api/permissions/copy/${e}`).then(i=>{_()}).catch(()=>{})},F=()=>{w.value=!0,I.value.exportCSV(),setTimeout(()=>{w.value=!1},1e3)},U=()=>{k.value=!0;const e=document.querySelector(".p-datatable-wrapper").cloneNode(!0);document.body.innerHTML,e.querySelectorAll(".p-button").forEach(C=>C.remove());const a=window.open("","_blank");a.document.write(`
    <html>
      <head>
        <title>Roles Report</title>
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
        <h1>Roles Report</h1>
        ${e.innerHTML}
        <div style="text-align: center; margin-top: 20px; font-size: 12px;">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
    </html>
  `),a.document.close(),a.focus(),setTimeout(()=>{a.print(),a.close(),k.value=!1},500)},G=()=>{f.value={global:{value:null,matchMode:te.CONTAINS}}};return(e,i)=>{const a=r("Button"),C=r("Toolbar"),H=r("Toast"),W=r("InputText"),u=r("Column"),O=r("ProgressSpinner"),J=r("DataTable"),K=r("Dialog"),m=P("can"),g=P("tooltip");return $(),B("div",ne,[o("div",ie,[o("div",re,[t(C,{class:"mb-4"},{start:n(()=>[o("h2",ce,c(e.$t("Roles Management")),1)]),end:n(()=>[o("div",de,[t(a,{label:e.$t("print"),icon:"pi pi-print",class:"p-button-help no-print",loading:k.value,onClick:U},null,8,["label","loading"]),d(t(a,{label:e.$t("export"),icon:"pi pi-download",class:"p-button-info no-print",loading:w.value,onClick:F},null,8,["label","loading"]),[[m,"roles list"]]),t(a,{label:e.$t("create_role"),icon:"pi pi-plus",class:"p-button-success",onClick:A},null,8,["label"])])]),_:1}),t(H),o("div",pe,[d(($(),oe(J,{ref_key:"dt",ref:I,selection:R.value,"onUpdate:selection":i[1]||(i[1]=s=>R.value=s),value:y.value,loading:v.value,"data-key":"id",paginator:!0,rows:10,filters:f.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25,50,100],"current-page-report-template":"Showing {first} to {last} of {totalRecords} records","responsive-layout":"scroll",scrollable:"","scroll-height":"flex",stripedRows:"",showGridlines:"",class:"p-datatable-sm"},{header:n(()=>[o("div",ue,[o("h3",me,c(e.$t("Roles List")),1),o("div",he,[o("span",ve,[fe,t(W,{modelValue:f.value.global.value,"onUpdate:modelValue":i[0]||(i[0]=s=>f.value.global.value=s),placeholder:e.$t("search"),class:"w-full"},null,8,["modelValue","placeholder"])]),d(t(a,{icon:"pi pi-refresh",class:"p-button-text",onClick:_},null,512),[[g,"Refresh data",void 0,{top:!0}]])])])]),empty:n(()=>[be]),loading:n(()=>[o("div",xe,[t(O,{style:{width:"50px",height:"50px"},strokeWidth:"4"})])]),default:n(()=>[t(u,{"selection-mode":"multiple","header-style":"width: 3rem"}),t(u,{field:"id",header:e.$t("ID"),sortable:!0},{body:n(s=>[o("span",_e,c(s.data.id),1)]),_:1},8,["header"]),t(u,{field:"name",header:e.$t("Name"),sortable:!0},{body:n(s=>[b(c(s.data.name),1)]),_:1},8,["header"]),t(u,{field:"created_at",header:e.$t("Created At"),sortable:!0},{body:n(s=>[b(c(new Date(s.data.created_at).toLocaleDateString()),1)]),_:1},8,["header"]),t(u,{exportable:!1,"header-style":"width: 10rem","body-class":"text-center"},{body:n(s=>[o("div",ge,[d(t(a,{icon:"pi pi-pencil",class:"p-button-rounded p-button-text p-button-success",onClick:N=>j(s.data.id)},null,8,["onClick"]),[[m,"roles edit"],[g,"Edit",void 0,{top:!0}]]),d(t(a,{icon:"pi pi-trash",class:"p-button-rounded p-button-text p-button-danger",onClick:N=>z(s.data.id)},null,8,["onClick"]),[[m,"roles delete"],[g,"Delete",void 0,{top:!0}]]),d(t(a,{icon:"pi pi-copy",class:"p-button-rounded p-button-text p-button-info",onClick:N=>E(s.data.id)},null,8,["onClick"]),[[m,"roles create"],[g,"Copy",void 0,{top:!0}]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[m,"roles list"]])]),t(K,{visible:p.value,"onUpdate:visible":i[3]||(i[3]=s=>p.value=s),style:{width:"450px"},header:e.$t("confirm"),modal:!0},{footer:n(()=>[t(a,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:i[2]||(i[2]=s=>p.value=!1)},null,8,["label"]),t(a,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text p-button-danger",onClick:q},null,8,["label"])]),default:n(()=>[o("div",ye,[we,T.value?($(),B("span",ke,[b(c(e.$t("remove_item"))+" ",1),o("b",null,c(T.value.first_name),1),b("? ")])):se("",!0)])]),_:1},8,["visible","header"])])])])}}},Se=Q(Ce,[["__scopeId","data-v-5ad07265"]]);export{Se as default};
