import{m as X,$ as Y,q as n,ah as Z,a0 as ee,ai as le,r as c,aj as te,o as v,d as m,e as t,f as s,g as r,i as D,L as se,t as o,h as S,j as b,c as g}from"./main-8a344e1a.js";import{B as ae}from"./Barrier-17199e22.js";const oe={class:"grid"},ie={class:"col-12"},ne={style:{},class:"shadow-xl"},ue={class:"flex w-full justify-between align-items-center"},de={class:"m-0 my-auto"},re={class:"block mt-2 md:mt-0 p-input-icon-left"},ce=t("i",{class:"pi pi-search"},null,-1),ve={class:"flex align-items-center justify-content-center"},me=t("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),pe={key:0},fe={class:"flex flex-column gap-2"},be={class:"w-full text-right",for:"username"},_e={key:0,class:"mt-1 mb-5 text-red-500"},he={class:"flex flex-column gap-2"},ge={class:"w-full text-right",for:"username"},ye={key:0,class:"mt-1 mb-5 text-red-500"},we={class:"flex flex-column gap-2"},ke={class:"w-full text-right",for:"username"},xe={key:0,class:"mt-1 mb-5 text-red-500"},$e={class:"w-full text-center"},Ve={class:"flex flex-column gap-2"},qe={class:"w-full text-right",for:"username"},Ce={key:0,class:"mt-1 mb-5 text-red-500"},De={class:"flex flex-column gap-2"},Se={class:"w-full text-right",for:"username"},Ue={key:0,class:"mt-1 mb-5 text-red-500"},Ne={class:"flex flex-column gap-2"},Be={class:"w-full text-right",for:"username"},Le={key:0,class:"mt-1 mb-5 text-red-500"},Pe={class:"w-full text-center"},Me={__name:"index",setup(Te){const U=X();Y();const N=n(!0),T=n({}),u=n(""),k=n(null);n(!1);const y=n(!1),x=n(""),j=n(null),R=n(null),$=n({}),_=n(!1),i=n({}),h=n(!1),B=n([]);Z(()=>{J()});const V=()=>{g.get("/api/barrier-question").then(e=>{N.value=!1,k.value=e.data.data,console.log(k.value)})},F=()=>{g.get("/api/barrier-subtest").then(e=>{B.value=e.data.data})};ee(()=>{V(),F()});const A=e=>{g.get(`/api/barrier-question/${e}`).then(l=>{N.value=!1,i.value=l.data.data,console.log(k.value)}),x.value=e,h.value=!h.value},z=()=>{g.post(`/api/barrier-question/${x.value}`,i.value).then(e=>{console.log(e.data),V(),h.value=!h.value,U.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),i.value=n({})}).catch(e=>{u.value=e.response.data.errors})},E=()=>{_.value=!_.value},O=e=>{console.log(e),y.value=!0,x.value=e},G=()=>{g.post("/api/barrier-question",i.value).then(e=>{console.log(e.data),V(),_.value=!_.value,U.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=n({})}).catch(e=>{u.value=e.response.data.errors})},H=()=>{g.delete(`/api/barrier-question/${x.value}`).then(e=>{console.log(e.data),y.value=!1,V(),U.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},J=()=>{$.value={global:{value:null,matchMode:le.CONTAINS}}};return(e,l)=>{const K=c("Toast"),p=c("Button"),L=c("InputText"),q=c("Column"),Q=c("DataTable"),P=c("Dialog"),I=c("Dropdown"),M=c("InputNumber"),W=c("va-card"),C=te("can");return v(),m("div",oe,[t("div",ie,[s(W,{class:"card"},{default:r(()=>[s(ae),s(K),t("div",ne,[D((v(),se(Q,{ref_key:"dt",ref:R,selection:j.value,"onUpdate:selection":l[1]||(l[1]=a=>j.value=a),value:k.value,loading:N.value,"data-key":"id",paginator:!0,rows:10,filters:$.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:r(()=>[t("div",ue,[D(s(p,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:E},null,8,["label"]),[[C,"skills create"]]),t("h5",de,o(e.$t("questions")),1),t("div",null,[t("span",re,[ce,s(L,{modelValue:$.value.global.value,"onUpdate:modelValue":l[0]||(l[0]=a=>$.value.global.value=a),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:r(()=>[s(q,{"selection-mode":"multiple","header-style":"width: 3rem"}),s(q,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:r(a=>[S(o(a.data.title),1)]),_:1},8,["header"]),s(q,{field:"index",header:e.$t("question_number"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:r(a=>[S(o(a.data.index),1)]),_:1},8,["header"]),s(q,{"header-style":"min-width:10rem;"},{body:r(a=>[t("div",null,[D(s(p,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:f=>A(a.data.id)},null,8,["onClick"]),[[C,"skills edit"]]),D(s(p,{icon:"pi pi-trash",class:"delete mt-2",onClick:f=>O(a.data.id)},null,8,["onClick"]),[[C,"skills delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[C,"skills list"]]),s(P,{visible:y.value,"onUpdate:visible":l[3]||(l[3]=a=>y.value=a),style:{width:"550px"},header:e.$t("submit"),modal:!0},{footer:r(()=>[s(p,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[2]||(l[2]=a=>y.value=!1)},null,8,["label"]),s(p,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:H},null,8,["label"])]),default:r(()=>[t("div",ve,[me,T.value?(v(),m("span",pe,[S(o(e.$t("remove_item"))+" ",1),t("b",null,o(T.value.first_name),1),S("?")])):b("",!0)])]),_:1},8,["visible","header"]),s(P,{visible:_.value,"onUpdate:visible":l[7]||(l[7]=a=>_.value=a),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:r(()=>{var a,f,w;return[t("div",fe,[t("label",be,o(e.$t("title")),1),s(L,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.title,"onUpdate:modelValue":l[4]||(l[4]=d=>i.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(a=u.value)!=null&&a.title?(v(),m("div",_e,o(u.value.title[0]),1)):b("",!0)]),t("div",he,[t("label",ge,o(e.$t("Subtest_id")),1),s(I,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:i.value.subtest_id,"onUpdate:modelValue":l[5]||(l[5]=d=>i.value.subtest_id=d),"option-value":"id",filter:"",options:B.value,optionLabel:"title",placeholder:e.$t("Subtest_id"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(f=u.value)!=null&&f.subtest_id?(v(),m("div",ye,o(u.value.subtest_id[0]),1)):b("",!0)]),t("div",we,[t("label",ke,o(e.$t("question_number")),1),s(M,{required:"",class:"bg-[#f7f5f5]",modelValue:i.value.index,"onUpdate:modelValue":l[6]||(l[6]=d=>i.value.index=d),placeholder:e.$t("question_number")},null,8,["modelValue","placeholder"]),(w=u.value)!=null&&w.index?(v(),m("div",xe,o(u.value.index[0]),1)):b("",!0)]),t("div",$e,[s(p,{onClick:G,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),s(P,{visible:h.value,"onUpdate:visible":l[11]||(l[11]=a=>h.value=a),style:{width:"550px"},header:e.$t("submit"),modal:!0},{default:r(()=>{var a,f,w;return[t("div",Ve,[t("label",qe,o(e.$t("title")),1),s(L,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:i.value.title,"onUpdate:modelValue":l[8]||(l[8]=d=>i.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(a=u.value)!=null&&a.title?(v(),m("div",Ce,o(u.value.title[0]),1)):b("",!0)]),t("div",De,[t("label",Se,o(e.$t("Subtest_id")),1),s(I,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:i.value.subtest_id,"onUpdate:modelValue":l[9]||(l[9]=d=>i.value.subtest_id=d),"option-value":"id",filter:"",options:B.value,optionLabel:"title",placeholder:e.$t("Subtest_id"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(f=u.value)!=null&&f.subtest_id?(v(),m("div",Ue,o(u.value.subtest_id[0]),1)):b("",!0)]),t("div",Ne,[t("label",Be,o(e.$t("question_number")),1),s(M,{required:"",class:"bg-[#f7f5f5]",modelValue:i.value.index,"onUpdate:modelValue":l[10]||(l[10]=d=>i.value.index=d),placeholder:e.$t("question_number")},null,8,["modelValue","placeholder"]),(w=u.value)!=null&&w.index?(v(),m("div",Le,o(u.value.index[0]),1)):b("",!0)]),t("div",Pe,[s(p,{onClick:z,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Me as default};
