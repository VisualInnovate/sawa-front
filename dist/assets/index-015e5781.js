import{m as J,$ as K,q as o,ah as Q,a0 as W,ai as X,r as d,aj as Y,o as b,d as C,e as s,f as a,g as n,i as g,L as Z,t as r,h as P,j as N,c as _}from"./main-8a344e1a.js";const ee={class:"grid"},te={class:"col-12"},le={class:"my-2"},ae={style:{},class:"shadow-xl"},se={class:"flex w-full justify-between align-items-center"},oe={class:"m-0 my-auto"},ne={class:"block mt-2 md:mt-0 p-input-icon-left"},ie=s("i",{class:"pi pi-search"},null,-1),ue={class:"flex align-items-center justify-content-center"},de=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),re={key:0},ce={class:"flex flex-column gap-2"},pe={class:"w-full text-right",for:"username"},me={key:0,class:"mt-1 mb-5 text-red-500"},ve={class:"w-full text-center"},fe={class:"flex flex-column gap-2"},he={class:"w-full text-right",for:"username"},be={key:0,class:"mt-1 mb-5 text-red-500"},ge={class:"w-full text-center"},ke={__name:"index",setup(_e){const x=J();K();const V=o(!0),B=o({}),c=o(""),y=o(null);o(!1);const v=o(!1),k=o(""),L=o(null),U=o(null),w=o({}),p=o(!1),i=o({}),m=o(!1);Q(()=>{z()});const $=()=>{_.get("/api/department").then(e=>{V.value=!1,y.value=e.data.data,console.log(y.value)})};W(()=>{$()});const j=e=>{_.get(`/api/department/${e}`).then(l=>{V.value=!1,i.value=l.data.data,console.log(y.value)}),k.value=e,m.value=!m.value},M=()=>{_.post(`/api/department/${k.value}`,i.value).then(e=>{console.log(e.data),$(),m.value=!m.value,x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),i.value=o({})}).catch(e=>{c.value=e.response.data.errors})},R=()=>{p.value=!p.value,i.value={}},q=e=>{console.log(e),v.value=!0,k.value=e},F=()=>{_.post("/api/department",i.value).then(e=>{console.log(e.data),$(),p.value=!p.value,x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=o({})}).catch(e=>{c.value=e.response.data.errors})},I=()=>{_.delete(`/api/department/${k.value}`).then(e=>{console.log(e.data),v.value=!1,$(),x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},A=()=>{U.value.exportCSV()},z=()=>{w.value={global:{value:null,matchMode:X.CONTAINS}}};return(e,l)=>{const u=d("Button"),E=d("Toolbar"),O=d("Toast"),D=d("InputText"),S=d("Column"),G=d("DataTable"),T=d("Dialog"),H=d("va-card"),f=Y("can");return b(),C("div",ee,[s("div",te,[a(H,{class:"card"},{default:n(()=>[a(E,{class:"mb-4 shadow-md"},{start:n(()=>[s("div",le,[g(a(u,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:R},null,8,["label"]),[[f,"department show"]])])]),end:n(()=>[g(a(u,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:l[0]||(l[0]=t=>A(t))},null,8,["label"]),[[f,"department show"]])]),_:1}),a(O),s("div",ae,[g((b(),Z(G,{ref_key:"dt",ref:U,selection:L.value,"onUpdate:selection":l[2]||(l[2]=t=>L.value=t),value:y.value,loading:V.value,"data-key":"id",paginator:!0,rows:10,filters:w.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:n(()=>[s("div",se,[s("h5",oe,r(e.$t("department")),1),s("div",null,[s("span",ne,[ie,a(D,{modelValue:w.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=t=>w.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:n(()=>[a(S,{"selection-mode":"multiple","header-style":"width: 3rem"}),a(S,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(t=>[P(r(t.data.title),1)]),_:1},8,["header"]),a(S,{"header-style":"min-width:10rem;"},{body:n(t=>[s("div",null,[g(a(u,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:h=>j(t.data.id)},null,8,["onClick"]),[[f,"skills edit"]]),g(a(u,{icon:"pi pi-trash",class:"delete mt-2",onClick:h=>q(t.data.id)},null,8,["onClick"]),[[f,"skills delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[f,"department show"]]),a(T,{visible:v.value,"onUpdate:visible":l[4]||(l[4]=t=>v.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:n(()=>[a(u,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[3]||(l[3]=t=>v.value=!1)},null,8,["label"]),a(u,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:I},null,8,["label"])]),default:n(()=>[s("div",ue,[de,B.value?(b(),C("span",re,[P(r(e.$t("remove_item"))+" ",1),s("b",null,r(B.value.first_name),1),P("?")])):N("",!0)])]),_:1},8,["visible","header"]),a(T,{visible:p.value,"onUpdate:visible":l[6]||(l[6]=t=>p.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var t;return[s("div",ce,[s("label",pe,r(e.$t("title")),1),a(D,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.title,"onUpdate:modelValue":l[5]||(l[5]=h=>i.value.title=h),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(t=c.value)!=null&&t.name?(b(),C("div",me,r(c.value.name[0]),1)):N("",!0)]),s("div",ve,[a(u,{onClick:F,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),a(T,{visible:m.value,"onUpdate:visible":l[8]||(l[8]=t=>m.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var t;return[s("div",fe,[s("label",he,r(e.$t("title")),1),a(D,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.title,"onUpdate:modelValue":l[7]||(l[7]=h=>i.value.title=h),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(t=c.value)!=null&&t.title?(b(),C("div",be,r(c.value.name[0]),1)):N("",!0)]),s("div",ge,[a(u,{onClick:M,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{ke as default};
