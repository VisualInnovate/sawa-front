import{aa as Z,ab as ee,T as i,ac as le,a3 as te,ad as se,r,ae,o as c,d as v,e as a,f as s,w as u,i as U,x as oe,t as o,h as $,g as h,c as g}from"./main-bd32886b.js";import{L as ie}from"./LeavesNave-ad782c57.js";const ne={class:"grid",style:{"overflow-x":"scroll"}},de={class:"col-12"},ue={style:{},class:"shadow-xl"},re={class:"flex w-full justify-between align-items-center"},ce={class:"m-0 my-auto"},ve={class:"block mt-2 md:mt-0 p-input-icon-left"},me=a("i",{class:"pi pi-search"},null,-1),pe={class:"flex align-items-center justify-content-center"},fe=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),he={key:0},be={class:"flex flex-column gap-2"},ye={class:"w-full text-right",for:"username"},_e={key:0,class:"mt-1 mb-5 text-red-500"},ge={class:"flex flex-column gap-2"},ke={class:"w-full text-right",for:"username"},we={key:0,class:"mt-1 mb-5 text-red-500"},$e={class:"flex flex-column gap-2"},Ve={for:"username"},xe={key:0,class:"mt-1 mb-5 text-red-500"},Ce={class:"flex flex-column gap-2"},De={for:"username"},Ne={key:0,class:"mt-1 mb-5 text-red-500"},Se={class:"w-full text-center"},Ue={class:"flex flex-column gap-2"},Te={class:"w-full text-right",for:"username"},Le={key:0,class:"mt-1 mb-5 text-red-500"},Pe={class:"flex flex-column gap-2"},Be={for:"username"},Me={key:0,class:"mt-1 mb-5 text-red-500"},qe={class:"w-full text-center"},Fe={__name:"index",setup(je){const T=Z();ee();const q=i([]),L=i(!0),j=i({}),n=i(""),V=i(null);i(!1);const k=i(!1),x=i(""),I=i(null),F=i(null),C=i({}),b=i(!1),D=i({}),d=i({}),y=i(!1);le(()=>{K()});const A=()=>{g.post("/api/users").then(e=>{q.value=e.data.users.data})},N=()=>{g.get("/api/leave-setup").then(e=>{L.value=!1,V.value=e.data.data,console.log(V.value)})};te(()=>{N(),A()});const z=e=>{g.get(`/api/mileston-levels/${e}`).then(l=>{L.value=!1,D.value=l.data.data,console.log(V.value)}),x.value=e,y.value=!y.value},E=()=>{g.post(`/api/mileston-levels/${x.value}`,d.value).then(e=>{console.log(e.data),N(),y.value=!y.value,T.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),D.value=i({})}).catch(e=>{n.value=e.response.data.errors})},O=()=>{b.value=!b.value},G=e=>{console.log(e),k.value=!0,x.value=e},H=()=>{g.post("/api/leave-setup",d.value).then(e=>{console.log(e.data),N(),b.value=!b.value,T.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=i({})}).catch(e=>{n.value=e.response.data.errors})},J=()=>{g.delete(`/api/leave-setup/${x.value}`).then(e=>{console.log(e.data),k.value=!1,N(),T.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},K=()=>{C.value={global:{value:null,matchMode:se.CONTAINS}}};return(e,l)=>{const Q=r("Toast"),m=r("Button"),P=r("InputText"),w=r("Column"),W=r("DataTable"),B=r("Dialog"),X=r("MultiSelect"),M=r("InputNumber"),Y=r("va-card"),S=ae("can");return c(),v("div",ne,[a("div",de,[s(Y,{class:"card"},{default:u(()=>[s(ie),s(Q),a("div",ue,[U((c(),oe(W,{ref_key:"dt",ref:F,selection:I.value,"onUpdate:selection":l[1]||(l[1]=t=>I.value=t),value:V.value,loading:L.value,"data-key":"id",paginator:!0,rows:10,filters:C.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:u(()=>[a("div",re,[U(s(m,{label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:O},null,8,["label"]),[[S,"skills create"]]),a("h5",ce,o(e.$t("levels")),1),a("div",null,[a("span",ve,[me,s(P,{modelValue:C.value.global.value,"onUpdate:modelValue":l[0]||(l[0]=t=>C.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:u(()=>[s(w,{"selection-mode":"multiple","header-style":"width: 3rem"}),s(w,{field:"type",header:e.$t("type"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:u(t=>[$(o(t.data.type),1)]),_:1},8,["header"]),s(w,{field:"title",header:e.$t("title"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:u(t=>[$(o(t.data.title),1)]),_:1},8,["header"]),s(w,{field:"days",header:e.$t("days"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:u(t=>[$(o(t.data.days),1)]),_:1},8,["header"]),s(w,{"header-style":"min-width:10rem;"},{body:u(t=>[a("div",null,[U(s(m,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:p=>z(t.data.id)},null,8,["onClick"]),[[S,"skills edit"]]),U(s(m,{icon:"pi pi-trash",class:"delete mt-2",onClick:p=>G(t.data.id)},null,8,["onClick"]),[[S,"skills delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[S,"skills list"]]),s(B,{visible:k.value,"onUpdate:visible":l[3]||(l[3]=t=>k.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:u(()=>[s(m,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[2]||(l[2]=t=>k.value=!1)},null,8,["label"]),s(m,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:J},null,8,["label"])]),default:u(()=>[a("div",pe,[fe,j.value?(c(),v("span",he,[$(o(e.$t("remove_item"))+" ",1),a("b",null,o(j.value.first_name),1),$("?")])):h("",!0)])]),_:1},8,["visible","header"]),s(B,{visible:b.value,"onUpdate:visible":l[8]||(l[8]=t=>b.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:u(()=>{var t,p,_,R;return[a("div",be,[a("label",ye,o(e.$t("users")),1),s(X,{modelValue:d.value.users_ids,"onUpdate:modelValue":l[4]||(l[4]=f=>d.value.users_ids=f),required:"",id:"pv_id_1",style:{direction:"ltr !important"},"option-value":"id",filter:"",options:q.value,optionLabel:"name",placeholder:e.$t("users"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(t=n.value)!=null&&t.name?(c(),v("div",_e,o(n.value.name[0]),1)):h("",!0)]),a("div",ge,[a("label",ke,o(e.$t("title")),1),s(P,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:d.value.title,"onUpdate:modelValue":l[5]||(l[5]=f=>d.value.title=f),placeholder:e.$t("skill_name")},null,8,["modelValue","placeholder"]),(p=n.value)!=null&&p.title?(c(),v("div",we,o(n.value.title[0]),1)):h("",!0)]),a("div",$e,[a("label",Ve,o(e.$t("days")),1),s(M,{required:"",class:"bg-[#f7f5f5]",modelValue:d.value.days,"onUpdate:modelValue":l[6]||(l[6]=f=>d.value.days=f),placeholder:e.$t("days")},null,8,["modelValue","placeholder"]),(_=n.value)!=null&&_.days?(c(),v("div",xe,o(n.value.days[0]),1)):h("",!0)]),a("div",Ce,[a("label",De,o(e.$t("days")),1),s(M,{required:"",class:"bg-[#f7f5f5]",modelValue:d.value.days,"onUpdate:modelValue":l[7]||(l[7]=f=>d.value.days=f),placeholder:e.$t("days")},null,8,["modelValue","placeholder"]),(R=n.value)!=null&&R.days?(c(),v("div",Ne,o(n.value.days[0]),1)):h("",!0)]),a("div",Se,[s(m,{onClick:H,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),s(B,{visible:y.value,"onUpdate:visible":l[11]||(l[11]=t=>y.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:u(()=>{var t,p;return[a("div",Ue,[a("label",Te,o(e.$t("title")),1),s(P,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:D.value.title,"onUpdate:modelValue":l[9]||(l[9]=_=>D.value.title=_),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(t=n.value)!=null&&t.title?(c(),v("div",Le,o(n.value.name[0]),1)):h("",!0)]),a("div",Pe,[a("label",Be,o(e.$t("days")),1),s(M,{required:"",class:"bg-[#f7f5f5]",modelValue:d.value.days,"onUpdate:modelValue":l[10]||(l[10]=_=>d.value.days=_),placeholder:e.$t("days")},null,8,["modelValue","placeholder"]),(p=n.value)!=null&&p.days?(c(),v("div",Me,o(n.value.days[0]),1)):h("",!0)]),a("div",qe,[s(m,{onClick:E,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Fe as default};
