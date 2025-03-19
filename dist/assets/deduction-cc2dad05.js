import{m as oe,l as se,a1 as de,q as u,aj as ne,a2 as ie,ak as ue,r as f,al as re,o as r,d as c,e as a,f as o,g as m,i as B,L as ce,t as d,h as S,W as me,j as v,c as h}from"./main-489d0086.js";import{D as pe}from"./Deduction-d23edce3.js";import{h as ve}from"./moment-fbc5633a.js";/* empty css                                                  */const fe={class:"grid"},_e={class:"col-12"},he={class:"relative"},ye={style:{},class:"shadow-xl"},be={class:"flex w-full justify-between align-items-center"},ge={class:"m-0 my-auto"},we={class:"block mt-2 md:mt-0 p-input-icon-left"},$e=a("i",{class:"pi pi-search"},null,-1),Ve={class:"flex align-items-center justify-content-center"},ke=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),xe={key:0},Ce={class:"flex flex-column gap-2"},De={style:{"text-align":"right !important"},for:"username"},Ue={key:0,class:"mt-1 mb-5 text-red-500"},Be={class:"flex flex-column gap-2"},Se={style:{"text-align":"right !important"},for:"username"},Le={key:0,class:"mt-1 mb-5 text-red-500"},Ne={class:"flex flex-column gap-2"},qe={style:{"text-align":"right !important"},class:"w-full",for:"username"},Me={key:0,class:"mt-1 mb-5 text-red-500"},Te={class:"flex flex-column gap-2"},je={style:{"text-align":"right !important"},for:"username"},Ie={key:0,class:"mt-1 mb-5 text-red-500"},Fe={class:"flex flex-column gap-2"},Pe={style:{"text-align":"right !important"},class:"w-full",for:"username"},Re={key:0,class:"mt-1 mb-5 text-red-500"},Ye={class:"w-full text-center"},Ae={class:"flex flex-column gap-2"},Ee={style:{"text-align":"right !important"},for:"username"},ze={key:0,class:"mt-1 mb-5 text-red-500"},Oe={class:"flex flex-column gap-2"},We={style:{"text-align":"right !important"},for:"username"},Ge={key:0,class:"mt-1 mb-5 text-red-500"},He={class:"flex flex-column gap-2"},Je={style:{"text-align":"right !important"},class:"w-full",for:"username"},Ke={key:0,class:"mt-1 mb-5 text-red-500"},Qe={class:"flex flex-column gap-2"},Xe={style:{"text-align":"right !important"},for:"username"},Ze={key:0,class:"mt-1 mb-5 text-red-500"},et={class:"flex flex-column gap-2"},tt={style:{"text-align":"right !important"},class:"w-full",for:"username"},lt={key:0,class:"mt-1 mb-5 text-red-500"},at={class:"w-full text-center"},ut={__name:"deduction",setup(ot){const q=oe(),{t:M}=se();de();const T=u(""),y=u(!0),P=u({}),n=u(""),j=u(""),R=u(null);u(!1);const $=u(!1),L=u(""),Y=u(null),A=u(null),N=u({}),b=u(!1),s=u({}),g=u(!1),O=u([{name:M("Pending"),code:0},{name:M("Accept"),code:1},{name:M("Cancell"),code:-1}]);ne(()=>{ee()});const V=()=>{h.get("/api/deduction-types").then(e=>{y.value=!1,T.value=e.data.data}),h.get("/api/deductions").then(e=>{y.value=!1,R.value=e.data.data}),h.get("/api/employees").then(e=>{j.value=e.data.data})};ie(()=>{V()});const W=e=>{h.get(`/api/deductions/${e}`).then(t=>{y.value=!1,s.value=t.data.data}),L.value=e,g.value=!g.value},G=()=>{h.put(`/api/deductions/${L.value}`,s.value).then(e=>{console.log(e.data),V(),g.value=!g.value,q.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),s.value=u({})}).catch(e=>{n.value=e.response.data.errors})},H=()=>{b.value=!b.value,s.value={}},J=e=>{console.log(e),$.value=!0,L.value=e},K=(e,t)=>{y.value=!0,h.get(`/api/deductions/change-status/${e}?status=${t}`).then(_=>{y.value=!1,V()})},Q=()=>{s.value.date=ve(s.value.dat).format("YYYY-MM-DD"),h.post("/api/deductions",s.value).then(e=>{console.log(e.data),V(),b.value=!b.value,q.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),s.value=u({})}).catch(e=>{n.value=e.response.data.errors})},X=()=>{h.delete(`/api/deduction-types/${L.value}`).then(e=>{console.log(e.data),$.value=!1,V(),q.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},Z=()=>{A.value.exportCSV()},ee=()=>{N.value={global:{value:null,matchMode:ue.CONTAINS}}};return(e,t)=>{const _=f("Button"),te=f("Toast"),I=f("InputText"),w=f("Column"),k=f("Dropdown"),le=f("DataTable"),F=f("Dialog"),E=f("InputNumber"),z=f("Calendar"),ae=f("va-card"),x=re("can");return r(),c("div",fe,[a("div",_e,[o(ae,{class:"card"},{default:m(()=>[a("div",he,[o(pe),B(o(_,{label:e.$t("deduction_add"),icon:"pi pi-plus",class:"p-button-success mr-2 absolute top-3",onClick:H},null,8,["label"]),[[x,"deduction create"]]),B(o(_,{label:e.$t("export"),icon:"pi pi-upload",class:"export absolute top-3 ltr:left-[15%] rtl:right-[15%]",onClick:t[0]||(t[0]=l=>Z(l))},null,8,["label"]),[[x,"deduction list"]])]),o(te),a("div",ye,[B((r(),ce(le,{ref_key:"dt",ref:A,selection:Y.value,"onUpdate:selection":t[2]||(t[2]=l=>Y.value=l),value:R.value,loading:y.value,"data-key":"id",paginator:!0,rows:10,filters:N.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:m(()=>[a("div",be,[a("h5",ge,d(e.$t("deductions")),1),a("div",null,[a("span",we,[$e,o(I,{modelValue:N.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=l=>N.value.global.value=l),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:m(()=>[o(w,{"selection-mode":"multiple","header-style":"width: 3rem"}),o(w,{field:"employee.name",header:e.$t("employee_name"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:m(l=>[S(d(l.data.employee.name),1)]),_:1},8,["header"]),o(w,{field:"deduction_type.title",header:e.$t("deduction_type"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:m(l=>[S(d(l.data.deduction_type.title),1)]),_:1},8,["header"]),o(w,{field:"amount",header:e.$t("deduction_mount"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:m(l=>[S(d(l.data.amount),1)]),_:1},8,["header"]),o(w,{field:"status",header:e.$t("status"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:m(l=>[o(k,{"onUpdate:modelValue":[p=>K(l.data.id,p),p=>l.data.status=p],style:me([{backgroundColor:l.data.status==1?"#10B981":l.data.status==-1?"#EF4444":l.data.status==0?"#F59E0B":"transparent"},{direction:"ltr !important","text-align":"center !important"}]),id:"pv_id_1",modelValue:l.data.status,"option-value":"code",options:O.value,optionLabel:"name"},null,8,["onUpdate:modelValue","style","modelValue","options"])]),_:1},8,["header"]),o(w,{"header-style":"min-width:10rem;"},{body:m(l=>[a("div",null,[B(o(_,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:p=>W(l.data.id)},null,8,["onClick"]),[[x,"deduction edit"]]),B(o(_,{icon:"pi pi-trash",class:"delete mt-2",onClick:p=>J(l.data.id)},null,8,["onClick"]),[[x,"deduction delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[x,"deduction list"]]),o(F,{visible:$.value,"onUpdate:visible":t[4]||(t[4]=l=>$.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:m(()=>[o(_,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=l=>$.value=!1)},null,8,["label"]),o(_,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:X},null,8,["label"])]),default:m(()=>[a("div",Ve,[ke,P.value?(r(),c("span",xe,[S(d(e.$t("remove_item"))+" ",1),a("b",null,d(P.value.first_name),1),S("?")])):v("",!0)])]),_:1},8,["visible","header"]),o(F,{visible:b.value,"onUpdate:visible":t[10]||(t[10]=l=>b.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:m(()=>{var l,p,C,D,U;return[a("div",Ce,[a("label",De,d(e.$t("employee_name")),1),o(k,{required:"",id:"pv_id_1",modelValue:s.value.employee_id,"onUpdate:modelValue":t[5]||(t[5]=i=>s.value.employee_id=i),"option-value":"id",filter:"",options:j.value,optionLabel:"name",placeholder:e.$t("employee_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(l=n.value)!=null&&l.employee_id?(r(),c("div",Ue,d(n.value.employee_id[0]),1)):v("",!0)]),a("div",Be,[a("label",Se,d(e.$t("deduction_type")),1),o(k,{required:"",id:"pv_id_1",modelValue:s.value.deduction_type_id,"onUpdate:modelValue":t[6]||(t[6]=i=>s.value.deduction_type_id=i),"option-value":"id",filter:"",options:T.value,optionLabel:"title",placeholder:e.$t("deduction_type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(p=n.value)!=null&&p.deduction_type_id?(r(),c("div",Le,d(n.value.deduction_type_id[0]),1)):v("",!0)]),a("div",Ne,[a("label",qe,d(e.$t("deduction_mount")),1),o(E,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:s.value.value,"onUpdate:modelValue":t[7]||(t[7]=i=>s.value.value=i),placeholder:e.$t("deduction_mount")},null,8,["modelValue","placeholder"]),(C=n.value)!=null&&C.value?(r(),c("div",Me,d(n.value.value[0]),1)):v("",!0)]),a("div",Te,[a("label",je,d(e.$t("deduction_date")),1),o(z,{style:{width:"100%"},showButtonBar:"",modelValue:s.value.date,"onUpdate:modelValue":t[8]||(t[8]=i=>s.value.date=i),modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("deduction_date")},null,8,["modelValue","placeholder"]),(D=n.value)!=null&&D.date?(r(),c("div",Ie,d(n.value.date[0]),1)):v("",!0)]),a("div",Fe,[a("label",Pe,d(e.$t("deduction_reason")),1),o(I,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:s.value.reason,"onUpdate:modelValue":t[9]||(t[9]=i=>s.value.reason=i),placeholder:e.$t("deduction_reason")},null,8,["modelValue","placeholder"]),(U=n.value)!=null&&U.reason?(r(),c("div",Re,d(n.value.reason[0]),1)):v("",!0)]),a("div",Ye,[o(_,{onClick:Q,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),o(F,{visible:g.value,"onUpdate:visible":t[16]||(t[16]=l=>g.value=l),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:m(()=>{var l,p,C,D,U;return[a("div",Ae,[a("label",Ee,d(e.$t("employee_name")),1),o(k,{required:"",id:"pv_id_1",modelValue:s.value.employee_id,"onUpdate:modelValue":t[11]||(t[11]=i=>s.value.employee_id=i),"option-value":"id",filter:"",options:j.value,optionLabel:"name",placeholder:e.$t("employee_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(l=n.value)!=null&&l.employee_id?(r(),c("div",ze,d(n.value.employee_id[0]),1)):v("",!0)]),a("div",Oe,[a("label",We,d(e.$t("deduction_type")),1),o(k,{required:"",id:"pv_id_1",modelValue:s.value.deduction_type_id,"onUpdate:modelValue":t[12]||(t[12]=i=>s.value.deduction_type_id=i),"option-value":"id",filter:"",options:T.value,optionLabel:"title",placeholder:e.$t("deduction_type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(p=n.value)!=null&&p.deduction_type_id?(r(),c("div",Ge,d(n.value.deduction_type_id[0]),1)):v("",!0)]),a("div",He,[a("label",Je,d(e.$t("deduction_mount")),1),o(E,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:s.value.value,"onUpdate:modelValue":t[13]||(t[13]=i=>s.value.value=i),placeholder:e.$t("deduction_mount")},null,8,["modelValue","placeholder"]),(C=n.value)!=null&&C.value?(r(),c("div",Ke,d(n.value.value[0]),1)):v("",!0)]),a("div",Qe,[a("label",Xe,d(e.$t("deduction_date")),1),o(z,{style:{width:"100%"},showButtonBar:"",modelValue:s.value.date,"onUpdate:modelValue":t[14]||(t[14]=i=>s.value.date=i),modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("deduction_date")},null,8,["modelValue","placeholder"]),(D=n.value)!=null&&D.date?(r(),c("div",Ze,d(n.value.date[0]),1)):v("",!0)]),a("div",et,[a("label",tt,d(e.$t("deduction_reason")),1),o(I,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:s.value.reason,"onUpdate:modelValue":t[15]||(t[15]=i=>s.value.reason=i),placeholder:e.$t("deduction_reason")},null,8,["modelValue","placeholder"]),(U=n.value)!=null&&U.reason?(r(),c("div",lt,d(n.value.reason[0]),1)):v("",!0)]),a("div",at,[o(_,{onClick:G,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{ut as default};
