import{a9 as X,Q as Z,R as s,aa as ee,S as te,ab as le,r as c,ac as ae,o as v,d as f,e as o,f as a,w as u,i as k,x as oe,t as i,h as T,g as _,c as $}from"./main-11f2bc19.js";import{h as R}from"./moment-fbc5633a.js";import{V as se}from"./VTextarea-f83f99f6.js";const ie={class:"grid"},ne={class:"col-12"},de={class:"my-2"},ue={style:{},class:"shadow-xl"},re={class:"flex w-full justify-between align-items-center"},ce={class:"m-0 my-auto"},pe={class:"block mt-2 md:mt-0 p-input-icon-left"},me=o("i",{class:"pi pi-search"},null,-1),ve={class:"flex align-items-center justify-content-center"},fe=o("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),he={key:0},be={class:"flex flex-column gap-2"},_e={class:"w-full text-right",for:"username"},ge={key:0,class:"mt-1 mb-5 text-red-500"},ye={class:"flex flex-column gap-2"},we={class:"w-full text-right",for:"username"},ke={key:0,class:"mt-1 mb-5 text-red-500"},$e={class:"flex flex-column gap-2"},Ve={class:"w-full text-right",for:"username"},xe={key:0,class:"mt-1 mb-5 text-red-500"},Ce={class:"w-full text-center"},De={class:"flex flex-column gap-2"},Se={class:"w-full text-right",for:"username"},Te={key:0,class:"mt-1 mb-5 text-red-500"},Me={class:"flex flex-column gap-2"},Ue={style:{"text-align":"right !important"},for:"username"},Be={key:0,class:"mt-1 mb-5 text-red-500"},Pe={class:"w-full text-center"},je={__name:"index",setup(Ne){const M=X();Z();const P=s(!0),N=s({}),d=s(""),V=s(null);s(!1);const g=s(!1),x=s(""),Y=s(null),L=s(null),C=s({}),h=s(!1),n=s({}),b=s(!1);ee(()=>{O()});const D=()=>{$.get("/api/position").then(e=>{P.value=!1,V.value=e.data.data,console.log(V.value)})};te(()=>{D()});const j=e=>{$.get(`/api/position/${e}`).then(t=>{holiday.value=t.data.data}),x.value=e,b.value=!b.value},E=()=>{n.value.date=R(n.value.dat).format("YYYY-MM-DD"),$.put(`/api/position/${x.value}`,n.value).then(e=>{console.log(e.data),D(),b.value=!b.value,M.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),n.value=s({})}).catch(e=>{d.value=e.response.data.errors})},I=()=>{h.value=!h.value,n.value={}},q=e=>{console.log(e),g.value=!0,x.value=e},A=()=>{n.value.date=R(n.value.dat).format("YYYY-MM-DD"),$.post("/api/position",n.value).then(e=>{console.log(e.data),D(),h.value=!h.value,M.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),holiday.value=s({})}).catch(e=>{d.value=e.response.data.errors})},F=()=>{$.delete(`/api/position/${x.value}`).then(e=>{console.log(e.data),g.value=!1,D(),M.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},z=()=>{L.value.exportCSV()},O=()=>{C.value={global:{value:null,matchMode:le.CONTAINS}}};return(e,t)=>{const m=c("Button"),Q=c("Toolbar"),G=c("Toast"),U=c("InputText"),S=c("Column"),H=c("DataTable"),B=c("Dialog"),J=c("Dropdown"),K=c("Calendar"),W=c("va-card"),y=ae("can");return v(),f("div",ie,[o("div",ne,[a(W,{class:"card"},{default:u(()=>[a(Q,{class:"mb-4 shadow-md"},{start:u(()=>[o("div",de,[k(a(m,{label:e.$t("posttion_add"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:I},null,8,["label"]),[[y,"skills create"]])])]),end:u(()=>[k(a(m,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=l=>z(l))},null,8,["label"]),[[y,"positions list"]])]),_:1}),a(G),o("div",ue,[k((v(),oe(H,{ref_key:"dt",ref:L,selection:Y.value,"onUpdate:selection":t[2]||(t[2]=l=>Y.value=l),value:V.value,loading:P.value,"data-key":"id",paginator:!0,rows:10,filters:C.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:u(()=>[o("div",re,[o("h5",ce,i(e.$t("posttion")),1),o("div",null,[o("span",pe,[me,a(U,{modelValue:C.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=l=>C.value.global.value=l),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:u(()=>[a(S,{"selection-mode":"multiple","header-style":"width: 3rem"}),a(S,{field:"title",header:e.$t("title"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:u(l=>[T(i(l.data.title),1)]),_:1},8,["header"]),a(S,{field:"parent.title",header:e.$t("title"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:u(l=>{var r,p;return[T(i((p=(r=l.data)==null?void 0:r.parent)==null?void 0:p.title),1)]}),_:1},8,["header"]),a(S,{"header-style":"min-width:10rem;"},{body:u(l=>[o("div",null,[k(a(m,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:r=>j(l.data.id)},null,8,["onClick"]),[[y,"positions edit"]]),k(a(m,{icon:"pi pi-trash",class:"delete mt-2",onClick:r=>q(l.data.id)},null,8,["onClick"]),[[y,"positions delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[y,"positions list"]]),a(B,{visible:g.value,"onUpdate:visible":t[4]||(t[4]=l=>g.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:u(()=>[a(m,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=l=>g.value=!1)},null,8,["label"]),a(m,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:F},null,8,["label"])]),default:u(()=>[o("div",ve,[fe,N.value?(v(),f("span",he,[T(i(e.$t("remove_item"))+" ",1),o("b",null,i(N.value.first_name),1),T("?")])):_("",!0)])]),_:1},8,["visible","header"]),a(B,{visible:h.value,"onUpdate:visible":t[8]||(t[8]=l=>h.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:u(()=>{var l,r,p;return[o("div",be,[o("label",_e,i(e.$t("posttion_dgree")),1),a(J,{modelValue:n.value.parent_id,"onUpdate:modelValue":t[5]||(t[5]=w=>n.value.parent_id=w),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:V.value,optionLabel:"title",placeholder:e.$t("posttion_dgree"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(l=d.value)!=null&&l.parent_id?(v(),f("div",ge,i(d.value.parent_id[0]),1)):_("",!0)]),o("div",ye,[o("label",we,i(e.$t("title")),1),a(U,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:n.value.title,"onUpdate:modelValue":t[6]||(t[6]=w=>n.value.title=w),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(r=d.value)!=null&&r.title?(v(),f("div",ke,i(d.value.title[0]),1)):_("",!0)]),o("div",$e,[o("label",Ve,i(e.$t("posttion_description")),1),a(se,{"bg-color":"#EAE8E9",rows:"3",modelValue:n.value.description,"onUpdate:modelValue":t[7]||(t[7]=w=>n.value.description=w)},null,8,["modelValue"]),(p=d.value)!=null&&p.description?(v(),f("div",xe,i(d.value.description[0]),1)):_("",!0)]),o("div",Ce,[a(m,{onClick:A,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),a(B,{visible:b.value,"onUpdate:visible":t[11]||(t[11]=l=>b.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:u(()=>{var l,r;return[o("div",De,[o("label",Se,i(e.$t("title")),1),a(U,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:e.holiday.title,"onUpdate:modelValue":t[9]||(t[9]=p=>e.holiday.title=p),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(l=d.value)!=null&&l.name?(v(),f("div",Te,i(d.value.name[0]),1)):_("",!0)]),o("div",Me,[o("label",Ue,i(e.$t("holiday_date")),1),a(K,{style:{width:"100%"},showButtonBar:"",modelValue:e.holiday.date,"onUpdate:modelValue":t[10]||(t[10]=p=>e.holiday.date=p),modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("holiday_date")},null,8,["modelValue","placeholder"]),(r=d.value)!=null&&r.date?(v(),f("div",Be,i(d.value.date[0]),1)):_("",!0)]),o("div",Pe,[a(m,{onClick:E,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{je as default};
