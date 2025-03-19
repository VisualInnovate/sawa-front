import{m as J,a1 as K,q as o,aj as Q,a2 as W,ak as X,r as d,al as Y,o as h,d as C,e as a,f as s,g as n,i as _,L as Z,t as c,h as P,j as N,c as k}from"./main-489d0086.js";const ee={class:"grid"},le={class:"col-12"},te={class:"my-2"},se={style:{},class:"shadow-xl"},ae={class:"flex w-full justify-between align-items-center"},oe={class:"m-0 my-auto"},ne={class:"block mt-2 md:mt-0 p-input-icon-left"},ie=a("i",{class:"pi pi-search"},null,-1),ue={class:"flex align-items-center justify-content-center"},de=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),ce={key:0},re={class:"flex flex-column gap-2"},me={class:"w-full text-right",for:"username"},ve={key:0,class:"mt-1 mb-5 text-red-500"},pe={class:"w-full text-center"},fe={class:"flex flex-column gap-2"},be={class:"w-full text-right",for:"username"},he={key:0,class:"mt-1 mb-5 text-red-500"},_e={class:"w-full text-center"},ye={__name:"index",setup(ke){const x=J();K();const V=o(!0),B=o({}),r=o(""),g=o(null);o(!1);const p=o(!1),y=o(""),L=o(null),U=o(null),w=o({}),m=o(!1),i=o({}),v=o(!1);Q(()=>{z()});const $=()=>{k.get("/api/skills").then(e=>{V.value=!1,g.value=e.data.data,console.log(g.value)})};W(()=>{$()});const j=e=>{k.get(`/api/skills/${e}`).then(t=>{V.value=!1,i.value=t.data.data,console.log(g.value)}),y.value=e,v.value=!v.value},M=()=>{k.put(`/api/skills/${y.value}`,i.value).then(e=>{console.log(e.data),$(),v.value=!v.value,x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),i.value=o({})}).catch(e=>{r.value=e.response.data.errors})},R=()=>{m.value=!m.value,i.value={}},q=e=>{console.log(e),p.value=!0,y.value=e},F=()=>{k.post("/api/skills",i.value).then(e=>{console.log(e.data),$(),m.value=!m.value,x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),i.value=o({})}).catch(e=>{r.value=e.response.data.errors})},I=()=>{k.delete(`/api/skills/${y.value}`).then(e=>{console.log(e.data),p.value=!1,$(),x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},A=()=>{U.value.exportCSV()},z=()=>{w.value={global:{value:null,matchMode:X.CONTAINS}}};return(e,t)=>{const u=d("Button"),E=d("Toolbar"),O=d("Toast"),D=d("InputText"),S=d("Column"),G=d("DataTable"),T=d("Dialog"),H=d("va-card"),f=Y("can");return h(),C("div",ee,[a("div",le,[s(H,{class:"card"},{default:n(()=>[s(E,{class:"mb-4 shadow-md"},{start:n(()=>[a("div",te,[_(s(u,{label:e.$t("skill_add"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:R},null,8,["label"]),[[f,"skills create"]])])]),end:n(()=>[_(s(u,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=l=>A(l))},null,8,["label"]),[[f,"skills list"]])]),_:1}),s(O),a("div",se,[_((h(),Z(G,{ref_key:"dt",ref:U,selection:L.value,"onUpdate:selection":t[2]||(t[2]=l=>L.value=l),value:g.value,loading:V.value,"data-key":"id",paginator:!0,rows:10,filters:w.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:n(()=>[a("div",ae,[a("h5",oe,c(e.$t("skills")),1),a("div",null,[a("span",ne,[ie,s(D,{modelValue:w.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=l=>w.value.global.value=l),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:n(()=>[s(S,{"selection-mode":"multiple","header-style":"width: 3rem"}),s(S,{field:"name",header:e.$t("skill_name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(l=>[P(c(l.data.name),1)]),_:1},8,["header"]),s(S,{"header-style":"min-width:10rem;"},{body:n(l=>[a("div",null,[_(s(u,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:b=>j(l.data.id)},null,8,["onClick"]),[[f,"skills edit"]]),_(s(u,{icon:"pi pi-trash",class:"delete mt-2",onClick:b=>q(l.data.id)},null,8,["onClick"]),[[f,"skills delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[f,"skills list"]]),s(T,{visible:p.value,"onUpdate:visible":t[4]||(t[4]=l=>p.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:n(()=>[s(u,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=l=>p.value=!1)},null,8,["label"]),s(u,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:I},null,8,["label"])]),default:n(()=>[a("div",ue,[de,B.value?(h(),C("span",ce,[P(c(e.$t("remove_item"))+" ",1),a("b",null,c(B.value.first_name),1),P("?")])):N("",!0)])]),_:1},8,["visible","header"]),s(T,{visible:m.value,"onUpdate:visible":t[6]||(t[6]=l=>m.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var l;return[a("div",re,[a("label",me,c(e.$t("skill_name")),1),s(D,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.name,"onUpdate:modelValue":t[5]||(t[5]=b=>i.value.name=b),placeholder:e.$t("skill_name")},null,8,["modelValue","placeholder"]),(l=r.value)!=null&&l.name?(h(),C("div",ve,c(r.value.name[0]),1)):N("",!0)]),a("div",pe,[s(u,{onClick:F,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),s(T,{visible:v.value,"onUpdate:visible":t[8]||(t[8]=l=>v.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var l;return[a("div",fe,[a("label",be,c(e.$t("skill_name")),1),s(D,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.name,"onUpdate:modelValue":t[7]||(t[7]=b=>i.value.name=b),placeholder:e.$t("skill_name")},null,8,["modelValue","placeholder"]),(l=r.value)!=null&&l.name?(h(),C("div",he,c(r.value.name[0]),1)):N("",!0)]),a("div",_e,[s(u,{onClick:M,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{ye as default};
