import{aa as Q,ab as W,T as o,ac as X,a3 as Y,ad as Z,r as d,ae as ee,o as p,d as h,e as s,f as a,w as r,i as D,x as le,t as n,h as N,g as y,c as _}from"./main-f97c0d36.js";import{B as te}from"./Barrier-50346204.js";const ae={class:"grid"},se={class:"col-12"},oe={style:{},class:"shadow-xl"},ne={class:"flex w-full justify-between align-items-center"},ie={class:"m-0 my-auto"},ue={class:"block mt-2 md:mt-0 p-input-icon-left"},re=s("i",{class:"pi pi-search"},null,-1),de={class:"flex align-items-center justify-content-center"},ce=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),ve={key:0},me={class:"flex flex-column gap-2"},pe={class:"w-full text-right",for:"username"},fe={key:0,class:"mt-1 mb-5 text-red-500"},be={class:"flex flex-column gap-2"},he={class:"w-full text-right",for:"username"},_e={key:0,class:"mt-1 mb-5 text-red-500"},ge={class:"w-full text-center"},ye={class:"flex flex-column gap-2"},we={class:"w-full text-right",for:"username"},ke={key:0,class:"mt-1 mb-5 text-red-500"},xe={class:"flex flex-column gap-2"},$e={class:"w-full text-right",for:"username"},Ve={key:0,class:"mt-1 mb-5 text-red-500"},Ce={class:"w-full text-center"},qe={__name:"index",setup(De){const T=Q();W();const q=o(!0),S=o({}),u=o(""),w=o(null);o(!1);const g=o(!1),k=o(""),U=o(null),I=o(null),x=o({}),f=o(!1),i=o({}),b=o(!1),M=o([]);X(()=>{G()});const $=()=>{_.get("/api/barrier-answer-type").then(e=>{q.value=!1,w.value=e.data.data,console.log(w.value)})},j=()=>{_.get("/api/barrier-subtest").then(e=>{M.value=e.data.data})};Y(()=>{$(),j()});const R=e=>{_.get(`/api/barrier-answer-type/${e}`).then(t=>{q.value=!1,i.value=t.data.data,console.log(w.value)}),k.value=e,b.value=!b.value},F=()=>{_.post(`/api/barrier-answer-type/${k.value}`,i.value).then(e=>{console.log(e.data),$(),b.value=!b.value,T.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),i.value=o({})}).catch(e=>{u.value=e.response.data.errors})},A=()=>{f.value=!f.value},z=e=>{console.log(e),g.value=!0,k.value=e},E=()=>{_.post("/api/barrier-answer-type",i.value).then(e=>{console.log(e.data),$(),f.value=!f.value,T.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=o({})}).catch(e=>{u.value=e.response.data.errors})},O=()=>{_.delete(`/api/barrier-answer-type/${k.value}`).then(e=>{console.log(e.data),g.value=!1,$(),T.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},G=()=>{x.value={global:{value:null,matchMode:Z.CONTAINS}}};return(e,t)=>{const H=d("Toast"),c=d("Button"),B=d("InputText"),V=d("Column"),J=d("DataTable"),P=d("Dialog"),L=d("InputNumber"),K=d("va-card"),C=ee("can");return p(),h("div",ae,[s("div",se,[a(K,{class:"card"},{default:r(()=>[a(te),a(H),s("div",oe,[D((p(),le(J,{ref_key:"dt",ref:I,selection:U.value,"onUpdate:selection":t[1]||(t[1]=l=>U.value=l),value:w.value,loading:q.value,"data-key":"id",paginator:!0,rows:10,filters:x.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:r(()=>[s("div",ne,[D(a(c,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:A},null,8,["label"]),[[C,"skills create"]]),s("h5",ie,n(e.$t("answer_type")),1),s("div",null,[s("span",ue,[re,a(B,{modelValue:x.value.global.value,"onUpdate:modelValue":t[0]||(t[0]=l=>x.value.global.value=l),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:r(()=>[a(V,{"selection-mode":"multiple","header-style":"width: 3rem"}),a(V,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:r(l=>[N(n(l.data.title),1)]),_:1},8,["header"]),a(V,{field:"index",header:e.$t("question_number"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:r(l=>[N(n(l.data.index),1)]),_:1},8,["header"]),a(V,{"header-style":"min-width:10rem;"},{body:r(l=>[s("div",null,[D(a(c,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:v=>R(l.data.id)},null,8,["onClick"]),[[C,"skills edit"]]),D(a(c,{icon:"pi pi-trash",class:"delete mt-2",onClick:v=>z(l.data.id)},null,8,["onClick"]),[[C,"skills delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[C,"skills list"]]),a(P,{visible:g.value,"onUpdate:visible":t[3]||(t[3]=l=>g.value=l),style:{width:"550px"},header:e.$t("submit"),modal:!0},{footer:r(()=>[a(c,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[2]||(t[2]=l=>g.value=!1)},null,8,["label"]),a(c,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:O},null,8,["label"])]),default:r(()=>[s("div",de,[ce,S.value?(p(),h("span",ve,[N(n(e.$t("remove_item"))+" ",1),s("b",null,n(S.value.first_name),1),N("?")])):y("",!0)])]),_:1},8,["visible","header"]),a(P,{visible:f.value,"onUpdate:visible":t[6]||(t[6]=l=>f.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:r(()=>{var l,v;return[s("div",me,[s("label",pe,n(e.$t("title")),1),a(B,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.title,"onUpdate:modelValue":t[4]||(t[4]=m=>i.value.title=m),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(l=u.value)!=null&&l.title?(p(),h("div",fe,n(u.value.title[0]),1)):y("",!0)]),s("div",be,[s("label",he,n(e.$t("question_number")),1),a(L,{required:"",class:"bg-[#f7f5f5]",modelValue:i.value.index,"onUpdate:modelValue":t[5]||(t[5]=m=>i.value.index=m),placeholder:e.$t("question_number")},null,8,["modelValue","placeholder"]),(v=u.value)!=null&&v.index?(p(),h("div",_e,n(u.value.index[0]),1)):y("",!0)]),s("div",ge,[a(c,{onClick:E,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),a(P,{visible:b.value,"onUpdate:visible":t[9]||(t[9]=l=>b.value=l),style:{width:"550px"},header:e.$t("submit"),modal:!0},{default:r(()=>{var l,v;return[s("div",ye,[s("label",we,n(e.$t("title")),1),a(B,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.title,"onUpdate:modelValue":t[7]||(t[7]=m=>i.value.title=m),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(l=u.value)!=null&&l.title?(p(),h("div",ke,n(u.value.title[0]),1)):y("",!0)]),s("div",xe,[s("label",$e,n(e.$t("question_number")),1),a(L,{required:"",class:"bg-[#f7f5f5]",modelValue:i.value.index,"onUpdate:modelValue":t[8]||(t[8]=m=>i.value.index=m),placeholder:e.$t("question_number")},null,8,["modelValue","placeholder"]),(v=u.value)!=null&&v.index?(p(),h("div",Ve,n(u.value.index[0]),1)):y("",!0)]),s("div",Ce,[a(c,{onClick:F,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{qe as default};