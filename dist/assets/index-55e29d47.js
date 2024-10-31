import{aa as Q,ab as W,T as o,ac as X,a3 as Y,ad as Z,r as i,o as c,d as p,e as a,f as l,w as n,t as u,h as $,F as ee,z as te,g as C,c as _}from"./main-7ae9188e.js";const le={class:"grid"},se={class:"col-12"},ae={class:"my-2"},oe={style:{},class:"shadow-xl"},ne={class:"flex w-full justify-between align-items-center"},ie={class:"m-0 my-auto"},ue={class:"block mt-2 md:mt-0 p-input-icon-left"},de=a("i",{class:"pi pi-search"},null,-1),re={class:"flex align-items-center justify-content-center"},ce=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),pe={key:0},me={class:"flex flex-column gap-2"},ve={class:"w-full text-right",for:"username"},fe={key:0,class:"mt-1 mb-5 text-red-500"},he={class:"w-full text-center"},be={class:"flex flex-column gap-2"},_e={class:"w-full text-right",for:"username"},ge={key:0,class:"mt-1 mb-5 text-red-500"},ye={class:"w-full text-center"},$e={__name:"index",setup(we){const x=Q(),V=W(),T=o([]),S=o(!0),D=o({}),m=o(""),g=o(null);o(!1);const v=o(!1),P=o(""),L=o(null),N=o(null),f=o({}),h=o(!1),M=o({}),y=o({}),U=o(!1);X(()=>{E()});const F=()=>{_.post("/api/users").then(e=>{T.value=e.data.users.data})},w=()=>{_.get("/api/shifts").then(e=>{S.value=!1,g.value=e.data.data,console.log(g.value)})};Y(()=>{w(),F()});const j=e=>{V.push({name:"shift-update",params:{id:e}})},R=()=>{V.push({name:"shift-create"})},I=e=>{console.log(e),v.value=!0,P.value=e},q=()=>{_.post("/api/employees/import/users",y.value).then(e=>{console.log(e.data),w(),h.value=!h.value,x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=o({})}).catch(e=>{m.value=e.response.data.errors})},z=()=>{_.delete(`/api/shifts/${P.value}`).then(e=>{console.log(e.data),v.value=!1,w(),x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},A=()=>{N.value.exportCSV()},E=()=>{f.value={global:{value:null,matchMode:Z.CONTAINS}}};return(e,s)=>{const d=i("Button"),O=i("Toolbar"),G=i("Toast"),B=i("InputText"),b=i("Column"),H=i("DataTable"),k=i("Dialog"),J=i("MultiSelect"),K=i("va-card");return c(),p("div",le,[a("div",se,[l(K,{class:"card"},{default:n(()=>[l(O,{class:"mb-4 shadow-md"},{start:n(()=>[a("div",ae,[l(d,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:R},null,8,["label"])])]),end:n(()=>[l(d,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:s[0]||(s[0]=t=>A(t))},null,8,["label"])]),_:1}),l(G),a("div",oe,[l(H,{ref_key:"dt",ref:N,selection:L.value,"onUpdate:selection":s[2]||(s[2]=t=>L.value=t),value:g.value,loading:S.value,"data-key":"id",paginator:!0,rows:10,filters:f.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:n(()=>[a("div",ne,[a("h5",ie,u(e.$t("shift")),1),a("div",null,[a("span",ue,[de,l(B,{modelValue:f.value.global.value,"onUpdate:modelValue":s[1]||(s[1]=t=>f.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:n(()=>[l(b,{"selection-mode":"multiple","header-style":"width: 3rem"}),l(b,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(t=>[$(u(t.data.title),1)]),_:1},8,["header"]),l(b,{field:"shift_days",header:e.$t("shift_days"),sortable:!0,"header-style":"width:14%; min-width:15rem;",class:"ltr:text-justify"},{body:n(t=>[(c(!0),p(ee,null,te(t.data.shift_days,r=>(c(),p("span",null,u(r.day+" &"),1))),256))]),_:1},8,["header"]),l(b,{"header-style":"min-width:10rem;"},{body:n(t=>[a("div",null,[l(d,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:r=>j(t.data.id)},null,8,["onClick"]),l(d,{icon:"pi pi-trash",class:"delete mt-2",onClick:r=>I(t.data.id)},null,8,["onClick"])])]),_:1})]),_:1},8,["selection","value","loading","filters"]),l(k,{visible:v.value,"onUpdate:visible":s[4]||(s[4]=t=>v.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:n(()=>[l(d,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:s[3]||(s[3]=t=>v.value=!1)},null,8,["label"]),l(d,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:z},null,8,["label"])]),default:n(()=>[a("div",re,[ce,D.value?(c(),p("span",pe,[$(u(e.$t("remove_item"))+" ",1),a("b",null,u(D.value.first_name),1),$("?")])):C("",!0)])]),_:1},8,["visible","header"]),l(k,{visible:h.value,"onUpdate:visible":s[6]||(s[6]=t=>h.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var t;return[a("div",me,[a("label",ve,u(e.$t("users")),1),l(J,{modelValue:y.value.users_ids,"onUpdate:modelValue":s[5]||(s[5]=r=>y.value.users_ids=r),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:T.value,optionLabel:"name",placeholder:e.$t("users"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(t=m.value)!=null&&t.name?(c(),p("div",fe,u(m.value.name[0]),1)):C("",!0)]),a("div",he,[l(d,{onClick:q,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),l(k,{visible:U.value,"onUpdate:visible":s[8]||(s[8]=t=>U.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var t;return[a("div",be,[a("label",_e,u(e.$t("title")),1),l(B,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:M.value.title,"onUpdate:modelValue":s[7]||(s[7]=r=>M.value.title=r),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(t=m.value)!=null&&t.title?(c(),p("div",ge,u(m.value.name[0]),1)):C("",!0)]),a("div",ye,[l(d,{onClick:e.editescrud,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["onClick","label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{$e as default};
