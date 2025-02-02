import{a9 as ee,Q as le,R as d,aa as te,S as ae,ab as oe,r,ac as se,o as c,d as m,e as t,f as o,w as i,i as V,x as ne,t as n,h as C,g as b,c as g}from"./main-d5d5ddd5.js";import{h as ue}from"./moment-fbc5633a.js";const de={class:"grid"},ie={class:"col-12"},re={class:"my-2"},ce={style:{},class:"shadow-xl"},me={class:"flex w-full justify-between align-items-center"},pe={class:"m-0 my-auto"},ve={class:"block mt-2 md:mt-0 p-input-icon-left"},be=t("i",{class:"pi pi-search"},null,-1),fe={class:"flex align-items-center justify-content-center"},he=t("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),_e={key:0},ye={class:"flex flex-column gap-2"},ge={class:"w-full text-right",for:"username"},we={key:0,class:"mt-1 mb-5 text-red-500"},$e={class:"flex flex-column gap-2"},ke={class:"w-full text-right",for:"username"},xe={key:0,class:"mt-1 mb-5 text-red-500"},Ve={class:"flex flex-column gap-2"},Ce={style:{"text-align":"right !important"},for:"username"},Se={key:0,class:"mt-1 mb-5 text-red-500"},De={class:"flex flex-column gap-2"},Ue={class:"w-full text-right",for:"username"},Be={key:0,class:"mt-1 mb-5 text-red-500"},Me={class:"w-full text-center"},Te={class:"flex flex-column gap-2"},Ne={class:"w-full text-right",for:"username"},Pe={key:0,class:"mt-1 mb-5 text-red-500"},Ie={class:"flex flex-column gap-2"},Le={class:"w-full text-right",for:"username"},je={key:0,class:"mt-1 mb-5 text-red-500"},qe={class:"flex flex-column gap-2"},Ee={style:{"text-align":"right !important"},for:"username"},Re={key:0,class:"mt-1 mb-5 text-red-500"},Ye={class:"w-full text-center"},Oe={__name:"index",setup(Ae){const B=ee();le();const I=d({}),M=d(!0),L=d({}),u=d(""),T=d(null);d(!1);const w=d(!1),S=d(""),j=d(null),q=d(null),D=d({}),_=d(!1),s=d({}),y=d(!1);te(()=>{H()});const U=()=>{g.get("/api/bonus").then(e=>{M.value=!1,T.value=e.data.data,console.log(T.value)}),g.get("/api/employees").then(e=>{I.value=e.data.data})};ae(()=>{U()});const Y=e=>{g.get(`/api/bonus/${e}`).then(l=>{M.value=!1,s.value=l.data.data}),S.value=e,y.value=!y.value},A=()=>{g.put(`/api/bonus/${S.value}`,s.value).then(e=>{console.log(e.data),U(),y.value=!y.value,B.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),payroll.value=d({})}).catch(e=>{u.value=e.response.data.errors})},F=()=>{_.value=!_.value,s.value={}},z=e=>{console.log(e),w.value=!0,S.value=e},O=()=>{s.value.date=ue(s.value.dat).format("YYYY-MM-DD"),g.post("/api/bonus",s.value).then(e=>{console.log(e.data),U(),_.value=!_.value,B.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),s.value=d({})}).catch(e=>{u.value=e.response.data.errors})},Q=()=>{g.delete(`/api/bonus/${S.value}`).then(e=>{console.log(e.data),w.value=!1,U(),B.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},G=()=>{q.value.exportCSV()},H=()=>{D.value={global:{value:null,matchMode:oe.CONTAINS}}};return(e,l)=>{const p=r("Button"),J=r("Toolbar"),K=r("Toast"),N=r("InputText"),$=r("Column"),W=r("DataTable"),P=r("Dialog"),E=r("InputNumber"),R=r("Calendar"),X=r("MultiSelect"),Z=r("va-card"),k=se("can");return c(),m("div",de,[t("div",ie,[o(Z,{class:"card"},{default:i(()=>[o(J,{class:"mb-4 shadow-md"},{start:i(()=>[t("div",re,[V(o(p,{label:e.$t("Adding_bonus_employee"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:F},null,8,["label"]),[[k,"bonus create"]])])]),end:i(()=>[V(o(p,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:l[0]||(l[0]=a=>G(a))},null,8,["label"]),[[k,"bonus list"]])]),_:1}),o(K),t("div",ce,[V((c(),ne(W,{ref_key:"dt",ref:q,selection:j.value,"onUpdate:selection":l[2]||(l[2]=a=>j.value=a),value:T.value,loading:M.value,"data-key":"id",paginator:!0,rows:10,filters:D.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:i(()=>[t("div",me,[t("h5",pe,n(e.$t("bonus")),1),t("div",null,[t("span",ve,[be,o(N,{modelValue:D.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=a=>D.value.global.value=a),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:i(()=>[o($,{"selection-mode":"multiple","header-style":"width: 3rem"}),o($,{field:"Employees",header:e.$t("Employees"),sortable:!0,"header-style":"width:20%; min-width:10rem;",class:"ltr:text-justify"},{body:i(a=>[C(n(a.data.employee.name),1)]),_:1},8,["header"]),o($,{field:"amount",header:e.$t("bouns_amount"),sortable:!0,"header-style":"width:20%; min-width:10rem;",class:"ltr:text-justify"},{body:i(a=>[C(n(a.data.amount),1)]),_:1},8,["header"]),o($,{field:"date",header:e.$t("bouns_date"),sortable:!0,"header-style":"width:20%; min-width:10rem;",class:"ltr:text-justify"},{body:i(a=>[C(n(a.data.date),1)]),_:1},8,["header"]),o($,{"header-style":"min-width:10rem;"},{body:i(a=>[t("div",null,[V(o(p,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:f=>Y(a.data.id)},null,8,["onClick"]),[[k,"bonus edit"]]),V(o(p,{icon:"pi pi-trash",class:"delete mt-2",onClick:f=>z(a.data.id)},null,8,["onClick"]),[[k,"bonus delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[k,"bonus list"]]),o(P,{visible:w.value,"onUpdate:visible":l[4]||(l[4]=a=>w.value=a),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:i(()=>[o(p,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[3]||(l[3]=a=>w.value=!1)},null,8,["label"]),o(p,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:Q},null,8,["label"])]),default:i(()=>[t("div",fe,[he,L.value?(c(),m("span",_e,[C(n(e.$t("remove_item"))+" ",1),t("b",null,n(L.value.first_name),1),C("?")])):b("",!0)])]),_:1},8,["visible","header"]),o(P,{visible:_.value,"onUpdate:visible":l[9]||(l[9]=a=>_.value=a),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:i(()=>{var a,f,x,v;return[t("div",ye,[t("label",ge,n(e.$t("bouns_reason")),1),o(N,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:s.value.reason,"onUpdate:modelValue":l[5]||(l[5]=h=>s.value.reason=h),placeholder:e.$t("bouns_reason")},null,8,["modelValue","placeholder"]),(a=u.value)!=null&&a.reason?(c(),m("div",we,n(u.value.reason[0]),1)):b("",!0)]),t("div",$e,[t("label",ke,n(e.$t("bouns_amount")),1),o(E,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:s.value.amount,"onUpdate:modelValue":l[6]||(l[6]=h=>s.value.amount=h),placeholder:e.$t("bouns_amount")},null,8,["modelValue","placeholder"]),(f=u.value)!=null&&f.amount?(c(),m("div",xe,n(u.value.amount[0]),1)):b("",!0)]),t("div",Ve,[t("label",Ce,n(e.$t("bouns_date")),1),o(R,{style:{width:"100%"},showButtonBar:"",modelValue:s.value.date,"onUpdate:modelValue":l[7]||(l[7]=h=>s.value.date=h),modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("holiday_date")},null,8,["modelValue","placeholder"]),(x=u.value)!=null&&x.date?(c(),m("div",Se,n(u.value.date[0]),1)):b("",!0)]),t("div",De,[t("label",Ue,n(e.$t("Employees")),1),o(X,{modelValue:s.value.employees,"onUpdate:modelValue":l[8]||(l[8]=h=>s.value.employees=h),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:I.value,optionLabel:"name",placeholder:e.$t("Employees"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(v=u.value)!=null&&v.employees?(c(),m("div",Be,n(u.value.employees[0]),1)):b("",!0)]),t("div",Me,[o(p,{onClick:O,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),o(P,{visible:y.value,"onUpdate:visible":l[13]||(l[13]=a=>y.value=a),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:i(()=>{var a,f,x;return[t("div",Te,[t("label",Ne,n(e.$t("bouns_reason")),1),o(N,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:s.value.reason,"onUpdate:modelValue":l[10]||(l[10]=v=>s.value.reason=v),placeholder:e.$t("bouns_reason")},null,8,["modelValue","placeholder"]),(a=u.value)!=null&&a.reason?(c(),m("div",Pe,n(u.value.reason[0]),1)):b("",!0)]),t("div",Ie,[t("label",Le,n(e.$t("bouns_amount")),1),o(E,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:s.value.amount,"onUpdate:modelValue":l[11]||(l[11]=v=>s.value.amount=v),placeholder:e.$t("bouns_amount")},null,8,["modelValue","placeholder"]),(f=u.value)!=null&&f.amount?(c(),m("div",je,n(u.value.amount[0]),1)):b("",!0)]),t("div",qe,[t("label",Ee,n(e.$t("bouns_date")),1),o(R,{style:{width:"100%"},showButtonBar:"",modelValue:s.value.date,"onUpdate:modelValue":l[12]||(l[12]=v=>s.value.date=v),modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("bouns_date")},null,8,["modelValue","placeholder"]),(x=u.value)!=null&&x.date?(c(),m("div",Re,n(u.value.date[0]),1)):b("",!0)]),t("div",Ye,[o(p,{onClick:A,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Oe as default};
