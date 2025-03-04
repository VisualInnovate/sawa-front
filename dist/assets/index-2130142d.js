import{l as K,m as Q,W as Z,q as i,ac as ee,X as te,ad as le,r,ae,o as T,d as N,e as s,f as o,g as n,i as g,L as se,t as u,h as w,j as oe,w as L,n as _,c as $}from"./main-bc2568df.js";import{h as D}from"./moment-fbc5633a.js";const ie={class:"grid"},ne={class:"col-12"},de={class:"my-2"},ue={style:{},class:"shadow-xl"},re={class:"flex w-full justify-between align-items-center"},ce={class:"m-0 my-auto"},me={class:"block mt-2 md:mt-0 p-input-icon-left"},ve=s("i",{class:"pi pi-search"},null,-1),pe={class:"flex align-items-center justify-content-center"},fe=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),_e={key:0},he=["onSubmit"],be={class:"flex flex-column gap-2"},ye={class:"w-full text-right",for:"username"},ge={class:"flex flex-column gap-2"},we={style:{"text-align":"right !important"},for:"username"},$e={class:"flex flex-column gap-2"},Ve={style:{"text-align":"right !important"},for:"username"},xe={class:"w-full text-center"},ke=["onSubmit"],Ce={class:"flex flex-column gap-2"},De={class:"w-full text-right",for:"username"},Me={class:"flex flex-column gap-2"},Ye={style:{"text-align":"right !important"},for:"username"},Be={class:"flex flex-column gap-2"},Te={style:{"text-align":"right !important"},for:"username"},Ue={class:"w-full text-center"},Ne={__name:"index",setup(Pe){const{t:d}=K(),v=Q();Z();const c=i(!1),U=i(!0),P=i({}),M=i(null),h=i(!1),V=i(""),S=i(null),I=i(null),x=i({}),p=i(!1),a=i({}),f=i(!1);ee(()=>{O()});const k=()=>{$.get("/api/holidays").then(e=>{U.value=!1,M.value=e.data.data,console.log(M.value)})};te(()=>{k()});const j=e=>{$.get(`/api/holidays/${e}`).then(l=>{a.value=l.data.data}),V.value=e,f.value=!f.value},R=()=>{a.value.end_date=D(a.value.end_date).format("YYYY-MM-DD"),a.value.start_date=D(a.value.start_date).format("YYYY-MM-DD"),$.put(`/api/holidays/${V.value}`,a.value).then(e=>{console.log(e.data),k(),f.value=!f.value,v.add({severity:"success",summary:d("success_message"),detail:`${d("element_update_success")}`,life:3e3}),a.value=i({})}).catch(e=>{v.add({severity:"error",summary:d("error"),detail:`${d("mission_error")}`,life:3e3})})},q=()=>{p.value=!p.value,skill.value={}},F=e=>{console.log(e),h.value=!0,V.value=e},z=()=>{a.value.end_date=D(a.value.end_date).format("YYYY-MM-DD"),a.value.start_date=D(a.value.start_date).format("YYYY-MM-DD"),$.post("/api/holidays",a.value).then(e=>{console.log(e.data),k(),p.value=!p.value,v.add({severity:"success",summary:d("success_message"),detail:`${d("element_add_success")}`,life:3e3}),a.value=i({})}).catch(e=>{v.add({severity:"error",summary:d("error"),detail:`${d("mission_error")}`,life:3e3})})},A=()=>{$.delete(`/api/holidays/${V.value}`).then(e=>{console.log(e.data),h.value=!1,k(),v.add({severity:"success",summary:d("success_message"),detail:`${d("element_delete_success")}`,life:3e3})}).catch(()=>{v.add({severity:"error",summary:d("error"),detail:`${d("mission_error")}`,life:3e3})})},E=()=>{I.value.exportCSV()},O=()=>{x.value={global:{value:null,matchMode:le.CONTAINS}}};return(e,l)=>{const m=r("Button"),W=r("Toolbar"),X=r("Toast"),Y=r("InputText"),b=r("Column"),G=r("DataTable"),B=r("Dialog"),C=r("Calendar"),H=r("va-card"),y=ae("can");return T(),N("div",ie,[s("div",ne,[o(H,{class:"card"},{default:n(()=>[o(W,{class:"mb-4 shadow-md"},{start:n(()=>[s("div",de,[g(o(m,{label:e.$t("holiday_add"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:q},null,8,["label"]),[[y,"holidays create"]])])]),end:n(()=>[g(o(m,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:l[0]||(l[0]=t=>E(t))},null,8,["label"]),[[y,"holidays list"]])]),_:1}),o(X),s("div",ue,[g((T(),se(G,{ref_key:"dt",ref:I,selection:S.value,"onUpdate:selection":l[2]||(l[2]=t=>S.value=t),value:M.value,loading:U.value,"data-key":"id",paginator:!0,rows:10,filters:x.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:n(()=>[s("div",re,[s("h5",ce,u(e.$t("holidays")),1),s("div",null,[s("span",me,[ve,o(Y,{modelValue:x.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=t=>x.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:n(()=>[o(b,{"selection-mode":"multiple","header-style":"width: 3rem"}),o(b,{field:"title",header:e.$t("title"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(t=>[w(u(t.data.title),1)]),_:1},8,["header"]),o(b,{field:"start_date",header:e.$t("start_date"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(t=>[w(u(t.data.start_date),1)]),_:1},8,["header"]),o(b,{field:"end_date",header:e.$t("end_date"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:n(t=>[w(u(t.data.end_date),1)]),_:1},8,["header"]),o(b,{"header-style":"min-width:10rem;"},{body:n(t=>[s("div",null,[g(o(m,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:J=>j(t.data.id)},null,8,["onClick"]),[[y,"holidays edit"]]),g(o(m,{icon:"pi pi-trash",class:"delete mt-2",onClick:J=>F(t.data.id)},null,8,["onClick"]),[[y,"holidays delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[y,"holidays list"]]),o(B,{visible:h.value,"onUpdate:visible":l[4]||(l[4]=t=>h.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:n(()=>[o(m,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[3]||(l[3]=t=>h.value=!1)},null,8,["label"]),o(m,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:A},null,8,["label"])]),default:n(()=>[s("div",pe,[fe,P.value?(T(),N("span",_e,[w(u(e.$t("remove_item"))+" ",1),s("b",null,u(P.value.first_name),1),w("?")])):oe("",!0)])]),_:1},8,["visible","header"]),o(B,{visible:p.value,"onUpdate:visible":l[9]||(l[9]=t=>p.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>[s("form",{onSubmit:L(z,["prevent"])},[s("div",be,[s("label",ye,u(e.$t("title")),1),o(Y,{required:"",class:_(["bg-[#f7f5f5] text-center",{"p-invalid":c.value&&!a.value.title}]),modelValue:a.value.title,"onUpdate:modelValue":l[5]||(l[5]=t=>a.value.title=t)},null,8,["modelValue","class"])]),s("div",ge,[s("label",we,u(e.$t("start_date")),1),o(C,{style:{width:"100%"},showButtonBar:"",modelValue:a.value.start_date,"onUpdate:modelValue":l[6]||(l[6]=t=>a.value.start_date=t),modelModifiers:{number:!0},showIcon:"",class:_({"p-invalid":c.value&&!a.value.start_date})},null,8,["modelValue","class"])]),s("div",$e,[s("label",Ve,u(e.$t("end_date")),1),o(C,{style:{width:"100%"},showButtonBar:"",modelValue:a.value.end_date,"onUpdate:modelValue":l[7]||(l[7]=t=>a.value.end_date=t),modelModifiers:{number:!0},showIcon:"",class:_({"p-invalid":c.value&&!a.value.end_date})},null,8,["modelValue","class"])]),s("div",xe,[o(m,{type:"submit",onClick:l[8]||(l[8]=t=>c.value=!0),class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])],40,he)]),_:1},8,["visible","header"]),o(B,{visible:f.value,"onUpdate:visible":l[14]||(l[14]=t=>f.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:n(()=>[s("form",{onSubmit:L(R,["prevent"])},[s("div",Ce,[s("label",De,u(e.$t("title")),1),o(Y,{required:"",class:_(["bg-[#f7f5f5] text-center",{"p-invalid":c.value&&!a.value.title}]),modelValue:a.value.title,"onUpdate:modelValue":l[10]||(l[10]=t=>a.value.title=t)},null,8,["modelValue","class"])]),s("div",Me,[s("label",Ye,u(e.$t("start_date")),1),o(C,{style:{width:"100%"},showButtonBar:"",modelValue:a.value.start_date,"onUpdate:modelValue":l[11]||(l[11]=t=>a.value.start_date=t),modelModifiers:{number:!0},showIcon:"",class:_({"p-invalid":c.value&&!a.value.start_date})},null,8,["modelValue","class"])]),s("div",Be,[s("label",Te,u(e.$t("end_date")),1),o(C,{style:{width:"100%"},showButtonBar:"",modelValue:a.value.end_date,"onUpdate:modelValue":l[12]||(l[12]=t=>a.value.end_date=t),modelModifiers:{number:!0},showIcon:"",class:_({"p-invalid":c.value&&!a.value.end_date})},null,8,["modelValue","class"])]),s("div",Ue,[o(m,{type:"submit",onClick:l[13]||(l[13]=t=>c.value=!0),class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])],40,ke)]),_:1},8,["visible","header"])])]),_:1})])])}}};export{Ne as default};
