import{a7 as X,a8 as Y,Q as o,a9 as Z,a0 as ee,aa as te,r as n,ab as le,o as c,d as p,e as a,f as l,w as i,i as h,x as se,t as u,h as x,F as ae,z as oe,g as V,c as y}from"./main-9add86e5.js";const ie={class:"grid"},ne={class:"col-12"},ue={class:"my-2"},re={style:{},class:"shadow-xl"},de={class:"flex w-full justify-between align-items-center"},ce={class:"m-0 my-auto"},pe={class:"block mt-2 md:mt-0 p-input-icon-left"},me=a("i",{class:"pi pi-search"},null,-1),ve={class:"flex align-items-center justify-content-center"},fe=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),he={key:0},be={class:"flex flex-column gap-2"},_e={class:"w-full text-right",for:"username"},ge={key:0,class:"mt-1 mb-5 text-red-500"},ye={class:"w-full text-center"},we={class:"flex flex-column gap-2"},ke={class:"w-full text-right",for:"username"},$e={key:0,class:"mt-1 mb-5 text-red-500"},Ce={class:"w-full text-center"},De={__name:"index",setup(xe){const D=X(),S=Y(),T=o([]),P=o(!0),L=o({}),m=o(""),w=o(null);o(!1);const v=o(!1),N=o(""),B=o(null),M=o(null),b=o({}),_=o(!1),U=o({}),k=o({}),F=o(!1);Z(()=>{Q()});const R=()=>{y.post("/api/users").then(e=>{T.value=e.data.users.data})},$=()=>{y.get("/api/shifts").then(e=>{P.value=!1,w.value=e.data.data,console.log(w.value)})};ee(()=>{$(),R()});const I=e=>{S.push({name:"shift-update",params:{id:e}})},q=()=>{S.push({name:"shift-create"})},z=e=>{console.log(e),v.value=!0,N.value=e},A=()=>{y.post("/api/employees/import/users",k.value).then(e=>{console.log(e.data),$(),_.value=!_.value,D.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=o({})}).catch(e=>{m.value=e.response.data.errors})},E=()=>{y.delete(`/api/shifts/${N.value}`).then(e=>{console.log(e.data),v.value=!1,$(),D.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},O=()=>{M.value.exportCSV()},Q=()=>{b.value={global:{value:null,matchMode:te.CONTAINS}}};return(e,s)=>{const r=n("Button"),G=n("Toolbar"),H=n("Toast"),j=n("InputText"),g=n("Column"),J=n("DataTable"),C=n("Dialog"),K=n("MultiSelect"),W=n("va-card"),f=le("can");return c(),p("div",ie,[a("div",ne,[l(W,{class:"card"},{default:i(()=>[l(G,{class:"mb-4 shadow-md"},{start:i(()=>[a("div",ue,[h(l(r,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:q},null,8,["label"]),[[f,"shifts create"]])])]),end:i(()=>[h(l(r,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:s[0]||(s[0]=t=>O(t))},null,8,["label"]),[[f,"shifts list"]])]),_:1}),l(H),a("div",re,[h((c(),se(J,{ref_key:"dt",ref:M,selection:B.value,"onUpdate:selection":s[2]||(s[2]=t=>B.value=t),value:w.value,loading:P.value,"data-key":"id",paginator:!0,rows:10,filters:b.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:i(()=>[a("div",de,[a("h5",ce,u(e.$t("shift")),1),a("div",null,[a("span",pe,[me,l(j,{modelValue:b.value.global.value,"onUpdate:modelValue":s[1]||(s[1]=t=>b.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:i(()=>[l(g,{"selection-mode":"multiple","header-style":"width: 3rem"}),l(g,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:i(t=>[x(u(t.data.title),1)]),_:1},8,["header"]),l(g,{field:"shift_days",header:e.$t("shift_days"),sortable:!0,"header-style":"width:14%; min-width:15rem;",class:"ltr:text-justify"},{body:i(t=>[(c(!0),p(ae,null,oe(t.data.shift_days,d=>(c(),p("span",null,u(d.day+" &"),1))),256))]),_:1},8,["header"]),l(g,{"header-style":"min-width:10rem;"},{body:i(t=>[a("div",null,[h(l(r,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:d=>I(t.data.id)},null,8,["onClick"]),[[f,"shifts edit"]]),h(l(r,{icon:"pi pi-trash",class:"delete mt-2",onClick:d=>z(t.data.id)},null,8,["onClick"]),[[f,"shifts delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[f,"shifts list"]]),l(C,{visible:v.value,"onUpdate:visible":s[4]||(s[4]=t=>v.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:i(()=>[l(r,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:s[3]||(s[3]=t=>v.value=!1)},null,8,["label"]),l(r,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:E},null,8,["label"])]),default:i(()=>[a("div",ve,[fe,L.value?(c(),p("span",he,[x(u(e.$t("remove_item"))+" ",1),a("b",null,u(L.value.first_name),1),x("?")])):V("",!0)])]),_:1},8,["visible","header"]),l(C,{visible:_.value,"onUpdate:visible":s[6]||(s[6]=t=>_.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:i(()=>{var t;return[a("div",be,[a("label",_e,u(e.$t("users")),1),l(K,{modelValue:k.value.users_ids,"onUpdate:modelValue":s[5]||(s[5]=d=>k.value.users_ids=d),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:T.value,optionLabel:"name",placeholder:e.$t("users"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(t=m.value)!=null&&t.name?(c(),p("div",ge,u(m.value.name[0]),1)):V("",!0)]),a("div",ye,[l(r,{onClick:A,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),l(C,{visible:F.value,"onUpdate:visible":s[8]||(s[8]=t=>F.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:i(()=>{var t;return[a("div",we,[a("label",ke,u(e.$t("title")),1),l(j,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:U.value.title,"onUpdate:modelValue":s[7]||(s[7]=d=>U.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(t=m.value)!=null&&t.title?(c(),p("div",$e,u(m.value.name[0]),1)):V("",!0)]),a("div",Ce,[l(r,{onClick:e.editescrud,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["onClick","label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{De as default};
