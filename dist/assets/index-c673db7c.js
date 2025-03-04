import{m as J,W as K,q as o,ac as Q,X as Z,ad as ee,r,ae as le,o as m,d as h,e as s,f as t,g as u,i as $,L as te,t as n,h as P,j as V,Y as ae,br as se,c as x}from"./main-bc2568df.js";import{L as oe}from"./LeavesNave-71655e54.js";const ne={class:"grid",style:{"overflow-x":"scroll"}},ie={class:"col-12"},ue={style:{},class:"shadow-xl"},de={class:"flex w-full justify-between align-items-center"},re={class:"m-0 my-auto"},ce={class:"block mt-2 md:mt-0 p-input-icon-left"},pe=s("i",{class:"pi pi-search"},null,-1),me={class:"flex align-items-center justify-content-center"},ve=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),fe={key:0},be={class:"flex flex-column gap-2"},he={class:"w-full text-right",for:"username"},_e={key:0,class:"mt-1 mb-5 text-red-500"},ge={class:"flex flex-column gap-2"},ye={class:"w-full text-right",for:"username"},ke={key:0,class:"mt-1 mb-5 text-red-500"},we={class:"w-full text-center"},$e={class:"flex flex-column gap-2"},Ve={class:"w-full text-right",for:"username"},xe={key:0,class:"mt-1 mb-5 text-red-500"},Ce={class:"w-full text-center"},Pe={__name:"index",setup(De){const C=J(),S=K(),T=o([]),U=o(!0),B=o({}),d=o(""),q=o(null);o(!1);const v=o(!1),D=o(""),M=o(null),F=o(null),_=o({}),g=o(!1),f=o({}),p=o({}),y=o(!1);Q(()=>{X()});const k=()=>{x.get("/api/leave-balance").then(e=>{U.value=!1,q.value=e.data.data})};Z(()=>{k()});const I=e=>{S.push({name:"balance-update",params:{id:e}})},A=()=>{x.post(`/api/mileston-levels/${D.value}`,p.value).then(e=>{console.log(e.data),k(),y.value=!y.value,C.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),f.value=o({})}).catch(e=>{d.value=e.response.data.errors})},z=()=>{S.push({name:"balance-create"})},E=e=>{console.log(e),v.value=!0,D.value=e},O=()=>{x.post("/api/leave-balance",p.value).then(e=>{console.log(e.data),k(),g.value=!g.value,C.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=o({})}).catch(e=>{d.value=e.response.data.errors})},W=()=>{x.delete(`/api/leave-balance/${D.value}`).then(e=>{console.log(e.data),v.value=!1,k(),C.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},X=()=>{_.value={global:{value:null,matchMode:ee.CONTAINS}}};return(e,a)=>{const Y=r("Toast"),c=r("Button"),j=r("InputText"),L=r("Column"),G=r("DataTable"),N=r("Dialog"),R=r("Dropdown"),H=r("va-card"),w=le("can");return m(),h("div",ne,[s("div",ie,[t(H,{class:"card"},{default:u(()=>[t(oe),t(Y),s("div",ue,[$((m(),te(G,{ref_key:"dt",ref:F,selection:M.value,"onUpdate:selection":a[1]||(a[1]=l=>M.value=l),value:q.value,loading:U.value,"data-key":"id",paginator:!0,rows:10,filters:_.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:u(()=>[s("div",de,[$(t(c,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:z},null,8,["label"]),[[w,"skills create"]]),s("h5",re,n(e.$t("leave_balance")),1),s("div",null,[s("span",ce,[pe,t(j,{modelValue:_.value.global.value,"onUpdate:modelValue":a[0]||(a[0]=l=>_.value.global.value=l),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:u(()=>[t(L,{"selection-mode":"multiple","header-style":"width: 3rem"}),t(L,{field:"type",header:e.$t("employee_name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:u(l=>{var i;return[P(n((i=l.data)==null?void 0:i.employee.name),1)]}),_:1},8,["header"]),t(L,{"header-style":"min-width:10rem;"},{body:u(l=>[s("div",null,[$(t(c,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:i=>I(l.data.id)},null,8,["onClick"]),[[w,"skills edit"]]),$(t(c,{icon:"pi pi-trash",class:"delete mt-2",onClick:i=>E(l.data.id)},null,8,["onClick"]),[[w,"skills delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[w,"skills list"]]),t(N,{visible:v.value,"onUpdate:visible":a[3]||(a[3]=l=>v.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:u(()=>[t(c,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:a[2]||(a[2]=l=>v.value=!1)},null,8,["label"]),t(c,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:W},null,8,["label"])]),default:u(()=>[s("div",me,[ve,B.value?(m(),h("span",fe,[P(n(e.$t("remove_item"))+" ",1),s("b",null,n(B.value.first_name),1),P("?")])):V("",!0)])]),_:1},8,["visible","header"]),t(N,{visible:g.value,"onUpdate:visible":a[7]||(a[7]=l=>g.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:u(()=>{var l,i;return[s("div",be,[s("label",he,n(e.$t("users")),1),t(R,{modelValue:p.value.employee_id,"onUpdate:modelValue":a[4]||(a[4]=b=>p.value.employee_id=b),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:T.value,optionLabel:"name",placeholder:e.$t("users"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(l=d.value)!=null&&l.name?(m(),h("div",_e,n(d.value.name[0]),1)):V("",!0)]),s("div",ge,[s("label",ye,n(e.$t("users")),1),t(R,{modelValue:p.value.employee_id,"onUpdate:modelValue":a[5]||(a[5]=b=>p.value.employee_id=b),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:T.value,optionLabel:"name",placeholder:e.$t("users"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),t(ae(se),{required:"",class:"bg-[#f7f5f5] text-center",modelValue:f.value.title,"onUpdate:modelValue":a[6]||(a[6]=b=>f.value.title=b),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(i=d.value)!=null&&i.name?(m(),h("div",ke,n(d.value.name[0]),1)):V("",!0)]),s("div",we,[t(c,{onClick:O,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),t(N,{visible:y.value,"onUpdate:visible":a[9]||(a[9]=l=>y.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:u(()=>{var l;return[s("div",$e,[s("label",Ve,n(e.$t("title")),1),t(j,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:f.value.title,"onUpdate:modelValue":a[8]||(a[8]=i=>f.value.title=i),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(l=d.value)!=null&&l.title?(m(),h("div",xe,n(d.value.name[0]),1)):V("",!0)]),s("div",Ce,[t(c,{onClick:A,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Pe as default};
