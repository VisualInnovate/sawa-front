import{a9 as H,P as J,Q as o,aa as K,R as W,ab as X,r as u,ac as Y,o as w,d as $,e as s,f as l,w as n,i as C,t as r,h as P,g as N,c as b}from"./main-ddc1ad81.js";const Z={class:"grid"},ee={class:"col-12"},te={class:"my-2"},le={style:{},class:"shadow-xl"},ae={class:"flex w-full justify-between align-items-center"},se={class:"m-0 my-auto"},oe={class:"block mt-2 md:mt-0 p-input-icon-left"},ne=s("i",{class:"pi pi-search"},null,-1),ie={class:"flex align-items-center justify-content-center"},ue=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),re={key:0},de={class:"flex flex-column gap-2"},ce={class:"w-full text-right",for:"username"},me={key:0,class:"mt-1 mb-5 text-red-500"},ve={class:"w-full text-center"},pe={class:"flex flex-column gap-2"},fe={class:"w-full text-right",for:"username"},be={key:0,class:"mt-1 mb-5 text-red-500"},he={class:"w-full text-center"},ye={__name:"index",setup(ge){const x=H();J();const V=o(!0),U=o({}),c=o(""),h=o(null);o(!1);const p=o(!1),g=o(""),B=o(null),L=o(null),_=o({}),m=o(!1),d=o({}),v=o(!1);K(()=>{z()});const y=()=>{b.get("/api/treatment/all").then(e=>{V.value=!1,h.value=e.data.data,console.log(h.value)})};W(()=>{y()});const M=e=>{console.log(e),b.get(`/api/treatment/${e}`).then(a=>{V.value=!1,d.value=a.data.data,console.log(h.value)}),g.value=e,v.value=!v.value},R=()=>{b.put(`/api/treatment/${g.value}`,d.value).then(e=>{console.log(e.data),y(),v.value=!v.value,x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=o({})}).catch(e=>{c.value=e.response.data.errors})},j=()=>{m.value=!m.value},F=e=>{console.log(e),p.value=!0,g.value=e},I=()=>{b.post("/api/treatment",d.value).then(e=>{console.log(e.data),y(),m.value=!m.value,x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=o({})}).catch(e=>{c.value=e.response.data.errors})},q=()=>{b.delete(`/api/treatment/${g.value}`).then(e=>{console.log(e.data),p.value=!1,y(),x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},A=()=>{L.value.exportCSV()},z=()=>{_.value={global:{value:null,matchMode:X.CONTAINS}}};return(e,a)=>{const i=u("Button"),E=u("Toolbar"),O=u("Toast"),D=u("InputText"),S=u("Column"),Q=u("DataTable"),T=u("Dialog"),G=u("va-card"),k=Y("can");return w(),$("div",Z,[s("div",ee,[l(G,{class:"card"},{default:n(()=>[l(E,{class:"mb-4 shadow-md"},{start:n(()=>[s("div",te,[C(l(i,{label:e.$t("treatementname"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:j},null,8,["label"]),[[k,"treatment create"]])])]),end:n(()=>[C(l(i,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:a[0]||(a[0]=t=>A(t))},null,8,["label"]),[[k,"treatment list"]])]),_:1}),l(O),s("div",le,[l(Q,{ref_key:"dt",ref:L,selection:B.value,"onUpdate:selection":a[2]||(a[2]=t=>B.value=t),value:h.value,loading:V.value,"data-key":"id",paginator:!0,rows:10,filters:_.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:n(()=>[s("div",ae,[s("h5",se,r(e.$t("treatementname")),1),s("div",null,[s("span",oe,[ne,l(D,{modelValue:_.value.global.value,"onUpdate:modelValue":a[1]||(a[1]=t=>_.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:n(()=>[l(S,{"selection-mode":"multiple","header-style":"width: 3rem"}),l(S,{field:"name",header:e.$t("treatementname"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(t=>[P(r(t.data.name),1)]),_:1},8,["header"]),l(S,{"header-style":"min-width:10rem;"},{body:n(t=>[s("div",null,[C(l(i,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:f=>M(t.data.id)},null,8,["onClick"]),[[k,"skills edit"]]),C(l(i,{icon:"pi pi-trash",class:"delete mt-2",onClick:f=>F(t.data.id)},null,8,["onClick"]),[[k,"skills delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"]),l(T,{visible:p.value,"onUpdate:visible":a[4]||(a[4]=t=>p.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:n(()=>[l(i,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:a[3]||(a[3]=t=>p.value=!1)},null,8,["label"]),l(i,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:q},null,8,["label"])]),default:n(()=>[s("div",ie,[ue,U.value?(w(),$("span",re,[P(r(e.$t("remove_item"))+" ",1),s("b",null,r(U.value.first_name),1),P("?")])):N("",!0)])]),_:1},8,["visible","header"]),l(T,{visible:m.value,"onUpdate:visible":a[6]||(a[6]=t=>m.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var t;return[s("div",de,[s("label",ce,r(e.$t("treatementname")),1),l(D,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:d.value.name,"onUpdate:modelValue":a[5]||(a[5]=f=>d.value.name=f),placeholder:e.$t("treatementname")},null,8,["modelValue","placeholder"]),(t=c.value)!=null&&t.name?(w(),$("div",me,r(c.value.name[0]),1)):N("",!0)]),s("div",ve,[l(i,{onClick:I,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),l(T,{visible:v.value,"onUpdate:visible":a[8]||(a[8]=t=>v.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>{var t;return[s("div",pe,[s("label",fe,r(e.$t("treatementname")),1),l(D,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:d.value.name,"onUpdate:modelValue":a[7]||(a[7]=f=>d.value.name=f),placeholder:e.$t("treatementname")},null,8,["modelValue","placeholder"]),(t=c.value)!=null&&t.name?(w(),$("div",be,r(c.value.name[0]),1)):N("",!0)]),s("div",he,[l(i,{onClick:R,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{ye as default};
