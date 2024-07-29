import{aa as H,ab as J,T as o,ac as K,a3 as Q,ad as W,r as c,ae as X,o as h,d as $,e as a,f as s,w as n,i as _,x as Y,t as d,h as T,g as P,c as g}from"./main-f182b5ba.js";import{D as Z}from"./Deduction-3995fd46.js";const ee={class:"grid"},te={class:"col-12"},le={class:"relative"},se={style:{},class:"shadow-xl"},ae={class:"flex w-full justify-between align-items-center"},oe={class:"m-0 my-auto"},ie={class:"block mt-2 md:mt-0 p-input-icon-left"},ne=a("i",{class:"pi pi-search"},null,-1),ue={class:"flex align-items-center justify-content-center"},de=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),ce={key:0},re={class:"flex flex-column gap-2"},pe={class:"w-full text-right",for:"username"},ve={key:0,class:"mt-1 mb-5 text-red-500"},me={class:"w-full text-center"},fe={class:"flex flex-column gap-2"},be={class:"w-full text-right",for:"username"},he={key:0,class:"mt-1 mb-5 text-red-500"},_e={class:"w-full text-center"},we={__name:"deduction-types",setup(ge){const C=H();J();const x=o(!0),N=o({}),r=o(""),B=o(null);o(!1);const m=o(!1),y=o(""),U=o(null),L=o(null),k=o({}),p=o(!1),i=o({}),v=o(!1);K(()=>{z()});const w=()=>{g.get("/api/deduction-types").then(e=>{x.value=!1,B.value=e.data.data})};Q(()=>{w()});const M=e=>{g.get(`/api/deduction-types/${e}`).then(l=>{x.value=!1,i.value=l.data.data}),y.value=e,v.value=!v.value},R=()=>{g.put(`/api/deduction-types/${y.value}`,i.value).then(e=>{console.log(e.data),w(),v.value=!v.value,C.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),i.value=o({})}).catch(e=>{r.value=e.response.data.errors})},j=()=>{p.value=!p.value,i.value={}},F=e=>{console.log(e),m.value=!0,y.value=e},I=()=>{g.post("/api/deduction-types",i.value).then(e=>{console.log(e.data),w(),p.value=!p.value,C.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),i.value=o({})}).catch(e=>{r.value=e.response.data.errors})},q=()=>{g.delete(`/api/deduction-types/${y.value}`).then(e=>{console.log(e.data),m.value=!1,w(),C.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},A=()=>{L.value.exportCSV()},z=()=>{k.value={global:{value:null,matchMode:W.CONTAINS}}};return(e,l)=>{const u=c("Button"),E=c("Toast"),V=c("InputText"),D=c("Column"),O=c("DataTable"),S=c("Dialog"),G=c("va-card"),f=X("can");return h(),$("div",ee,[a("div",te,[s(G,{class:"card"},{default:n(()=>[a("div",le,[s(Z),_(s(u,{label:e.$t("deduction_add"),icon:"pi pi-plus",class:"p-button-success mr-2 absolute top-3",onClick:j},null,8,["label"]),[[f,"skills create"]]),_(s(u,{label:e.$t("export"),icon:"pi pi-upload",class:"export absolute top-3 ltr:left-[15%] rtl:right-[15%]",onClick:l[0]||(l[0]=t=>A(t))},null,8,["label"]),[[f,"skills list"]])]),s(E),a("div",se,[_((h(),Y(O,{ref_key:"dt",ref:L,selection:U.value,"onUpdate:selection":l[2]||(l[2]=t=>U.value=t),value:B.value,loading:x.value,"data-key":"id",paginator:!0,rows:10,filters:k.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:n(()=>[a("div",ae,[a("h5",oe,d(e.$t("deductions")),1),a("div",null,[a("span",ie,[ne,s(V,{modelValue:k.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=t=>k.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:n(()=>[s(D,{"selection-mode":"multiple","header-style":"width: 3rem"}),s(D,{field:"title",header:e.$t("title"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(t=>[T(d(t.data.title),1)]),_:1},8,["header"]),s(D,{"header-style":"min-width:10rem;"},{body:n(t=>[a("div",null,[_(s(u,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:b=>M(t.data.id)},null,8,["onClick"]),[[f,"skills edit"]]),_(s(u,{icon:"pi pi-trash",class:"delete mt-2",onClick:b=>F(t.data.id)},null,8,["onClick"]),[[f,"skills delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[f,"skills list"]]),s(S,{visible:m.value,"onUpdate:visible":l[4]||(l[4]=t=>m.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:n(()=>[s(u,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[3]||(l[3]=t=>m.value=!1)},null,8,["label"]),s(u,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:q},null,8,["label"])]),default:n(()=>[a("div",ue,[de,N.value?(h(),$("span",ce,[T(d(e.$t("remove_item"))+" ",1),a("b",null,d(N.value.first_name),1),T("?")])):P("",!0)])]),_:1},8,["visible","header"]),s(S,{visible:p.value,"onUpdate:visible":l[6]||(l[6]=t=>p.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var t;return[a("div",re,[a("label",pe,d(e.$t("deduction_title")),1),s(V,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.title,"onUpdate:modelValue":l[5]||(l[5]=b=>i.value.title=b),placeholder:e.$t("deduction_title")},null,8,["modelValue","placeholder"]),(t=r.value)!=null&&t.name?(h(),$("div",ve,d(r.value.name[0]),1)):P("",!0)]),a("div",me,[s(u,{onClick:I,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),s(S,{visible:v.value,"onUpdate:visible":l[8]||(l[8]=t=>v.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var t;return[a("div",fe,[a("label",be,d(e.$t("deduction_title")),1),s(V,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.title,"onUpdate:modelValue":l[7]||(l[7]=b=>i.value.title=b),placeholder:e.$t("deduction_title")},null,8,["modelValue","placeholder"]),(t=r.value)!=null&&t.name?(h(),$("div",he,d(r.value.name[0]),1)):P("",!0)]),a("div",_e,[s(u,{onClick:R,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{we as default};
