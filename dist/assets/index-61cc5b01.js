import{aa as W,ab as X,T as o,ac as Y,a3 as Z,ad as ee,r as c,ae as te,o as v,d as h,e as s,f as a,w as d,i as w,x as le,t as i,h as N,g as k,c as g}from"./main-7ae9188e.js";import{V as M}from"./VTextarea-616f9c4a.js";const ae={class:"grid"},se={class:"col-12"},oe={class:"my-2"},ne={style:{},class:"shadow-xl"},ie={class:"flex w-full justify-between align-items-center"},de={class:"m-0 my-auto"},ue={class:"block mt-2 md:mt-0 p-input-icon-left"},re=s("i",{class:"pi pi-search"},null,-1),ce={class:"flex align-items-center justify-content-center"},pe=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),me={key:0},ve={class:"flex flex-column gap-2"},fe={class:"w-full text-right",for:"username"},be={key:0,class:"mt-1 mb-5 text-red-500"},he={class:"flex flex-column gap-2"},ge={class:"w-full text-right",for:"username"},_e={key:0,class:"mt-1 mb-5 text-red-500"},ye={class:"w-full text-center"},we={class:"flex flex-column gap-2"},ke={class:"w-full text-right",for:"username"},xe={key:0,class:"mt-1 mb-5 text-red-500"},$e={class:"flex flex-column gap-2"},Ve={class:"w-full text-right",for:"username"},Ce={key:0,class:"mt-1 mb-5 text-red-500"},Te={class:"w-full text-center"},Ue={__name:"index",setup(De){const C=W();X();const A=o({}),T=o(!0),B=o({}),u=o(""),D=o(null);o(!1);const _=o(!1),x=o(""),E=o(null),L=o(null),$=o({}),f=o(!1),n=o({}),b=o(!1);Y(()=>{G()});const V=()=>{g.get("/api/department").then(e=>{T.value=!1,D.value=e.data.data,console.log(D.value)}),g.get("/api/employees").then(e=>{A.value=e.data.data})};Z(()=>{V()});const R=e=>{g.get(`/api/department/${e}`).then(t=>{T.value=!1,n.value=t.data.data}),x.value=e,b.value=!b.value},j=()=>{g.put(`/api/department/${x.value}`,n.value).then(e=>{console.log(e.data),V(),b.value=!b.value,C.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),n.value=o({})}).catch(e=>{u.value=e.response.data.errors})},F=()=>{f.value=!f.value,payroll.value={}},I=e=>{console.log(e),_.value=!0,x.value=e},q=()=>{g.post("/api/department",n.value).then(e=>{console.log(e.data),V(),f.value=!f.value,C.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),n.value=o({})}).catch(e=>{u.value=e.response.data.errors})},z=()=>{g.delete(`/api/department/${x.value}`).then(e=>{console.log(e.data),_.value=!1,V(),C.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},O=()=>{L.value.exportCSV()},G=()=>{$.value={global:{value:null,matchMode:ee.CONTAINS}}};return(e,t)=>{const r=c("Button"),H=c("Toolbar"),J=c("Toast"),S=c("InputText"),P=c("Column"),K=c("DataTable"),U=c("Dialog"),Q=c("va-card"),y=te("can");return v(),h("div",ae,[s("div",se,[a(Q,{class:"card"},{default:d(()=>[a(H,{class:"mb-4 shadow-md"},{start:d(()=>[s("div",oe,[w(a(r,{label:e.$t("department_add"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:F},null,8,["label"]),[[y,"department create"]])])]),end:d(()=>[w(a(r,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=l=>O(l))},null,8,["label"]),[[y,"department list"]])]),_:1}),a(J),s("div",ne,[w((v(),le(K,{ref_key:"dt",ref:L,selection:E.value,"onUpdate:selection":t[2]||(t[2]=l=>E.value=l),value:D.value,loading:T.value,"data-key":"id",paginator:!0,rows:10,filters:$.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:d(()=>[s("div",ie,[s("h5",de,i(e.$t("departments")),1),s("div",null,[s("span",ue,[re,a(S,{modelValue:$.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=l=>$.value.global.value=l),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:d(()=>[a(P,{"selection-mode":"multiple","header-style":"width: 3rem"}),a(P,{field:"title",header:e.$t("title"),sortable:!0,"header-style":"width:20%; min-width:10rem;",class:"ltr:text-justify"},{body:d(l=>[N(i(l.data.title),1)]),_:1},8,["header"]),a(P,{"header-style":"min-width:10rem;"},{body:d(l=>[s("div",null,[w(a(r,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:p=>R(l.data.id)},null,8,["onClick"]),[[y,"department edit"]]),w(a(r,{icon:"pi pi-trash",class:"delete mt-2",onClick:p=>I(l.data.id)},null,8,["onClick"]),[[y,"department delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[y,"department list"]]),a(U,{visible:_.value,"onUpdate:visible":t[4]||(t[4]=l=>_.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:d(()=>[a(r,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=l=>_.value=!1)},null,8,["label"]),a(r,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:z},null,8,["label"])]),default:d(()=>[s("div",ce,[pe,B.value?(v(),h("span",me,[N(i(e.$t("remove_item"))+" ",1),s("b",null,i(B.value.first_name),1),N("?")])):k("",!0)])]),_:1},8,["visible","header"]),a(U,{visible:f.value,"onUpdate:visible":t[7]||(t[7]=l=>f.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:d(()=>{var l,p;return[s("div",ve,[s("label",fe,i(e.$t("title")),1),a(S,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:n.value.title,"onUpdate:modelValue":t[5]||(t[5]=m=>n.value.title=m),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(l=u.value)!=null&&l.title?(v(),h("div",be,i(u.value.title[0]),1)):k("",!0)]),s("div",he,[s("label",ge,i(e.$t("title")),1),a(M,{"bg-color":"#EAE8E9",rows:"3",modelValue:n.value.description,"onUpdate:modelValue":t[6]||(t[6]=m=>n.value.description=m)},null,8,["modelValue"]),(p=u.value)!=null&&p.description?(v(),h("div",_e,i(u.value.description[0]),1)):k("",!0)]),s("div",ye,[a(r,{onClick:q,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),a(U,{visible:b.value,"onUpdate:visible":t[10]||(t[10]=l=>b.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:d(()=>{var l,p;return[s("div",we,[s("label",ke,i(e.$t("title")),1),a(S,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:n.value.title,"onUpdate:modelValue":t[8]||(t[8]=m=>n.value.title=m),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(l=u.value)!=null&&l.title?(v(),h("div",xe,i(u.value.title[0]),1)):k("",!0)]),s("div",$e,[s("label",Ve,i(e.$t("title")),1),a(M,{"bg-color":"#EAE8E9",rows:"3",modelValue:n.value.description,"onUpdate:modelValue":t[9]||(t[9]=m=>n.value.description=m)},null,8,["modelValue"]),(p=u.value)!=null&&p.description?(v(),h("div",Ce,i(u.value.description[0]),1)):k("",!0)]),s("div",Te,[a(r,{onClick:j,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Ue as default};
