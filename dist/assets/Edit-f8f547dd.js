import{Q as X,a9 as j,R as i,ag as q,ao as G,S as H,r as V,o as m,E as K,w as P,e as t,I as Y,n as d,t as o,f as n,d as v,g as b,F as Z,k as ee,T as le,X as ae,c as h}from"./main-fd0aa1f8.js";const te=["onSubmit"],se={class:""},oe=["src"],ne={class:"grid grid-cols- gap-4 lg:grid-cols-2"},ue={class:"flex flex-column gap-2 py-1"},de={class:"w-full",for:"username"},ie={class:"flex flex-column gap-2 py-1"},re={class:"w-full t",for:"username"},pe={key:0,class:"flex flex-column gap-2"},me={class:"w-full",for:"username"},ve={key:1,class:"flex flex-column gap-2"},ce={class:"w-full",for:"username"},fe={key:2,class:"flex flex-column gap-2"},ye={class:"w-full",for:"username"},ge={class:"flex flex-column gap-2 py-1"},_e={class:"w-full",for:"username"},be={class:"flex flex-column gap-2 py-1"},Ve={class:"w-full",for:"username"},he={class:"flex flex-column gap-2 py-1"},we={class:"w-full",for:"username"},ke={class:"flex flex-column gap-2 py-1"},$e={class:"w-full",for:"username"},xe={key:0,class:"mt-1 mb-5 text-red-500"},Se={class:"flex-column gap-2 py-1 hidden"},Ue={class:"w-full",for:"username"},Te={key:0,class:"mt-1 mb-5 text-red-500"},Ce={class:"text-2xl font-bold py-2"},Le={class:"item-table w-[70%]"},Fe={__name:"Edit",setup(Be){const $=X(),x=j(),e=i({}),{t:c}=q(),u=i(!1),S=i([]),U=i([]);i([]);const T=i([]),p=i([]),f=i(""),y=i(""),g=i(""),w=i(""),C=i([{name:"side profile",id:1},{name:"milestone",id:2},{name:"barrier",id:3},{name:"ablls",id:4},{name:"carolina",id:5}]),I=i([{name:"Sunday",value:"Sunday"},{name:"Monday",value:"Monday"},{name:"Tuesday",value:"Tuesday"},{name:"Thursday",value:"Thursday"},{name:"Wednesday",value:"Wednesday"},{name:"Friday",value:"Friday"},{name:"Saturday",value:"Saturday"}]),M=l=>{const a=l.target.files[0],r=new FileReader;r.readAsDataURL(a),r.onload=_=>{e.value.image=_.target.result,e.value.file=a,console.log(this.imageSrc)}},R=()=>{const l=new FormData;console.log(e.value.name),l.append("name",e.value.name),l.append("email",e.value.email),l.append("title",e.value.title),l.append("password",e.value.password),e.value.file&&l.append("image",e.value.file),l.append("role",e.value.role),l.append("business_hours",JSON.stringify(p.value)),e.value.spotter&&l.append("spotter",e.value.spotter),e.value.skills&&l.append("skills",e.value.skills),e.value.department&&l.append("department_id",e.value.department),l.append("type",e.value.type),h.post(`/api/users/${$.currentRoute._value.params.id}/edit`,l).then(a=>{x.add({severity:"success",summary:c("success_message"),detail:`${c("element_update_success")}`,life:3e3})}).catch(a=>{x.add({severity:"error",summary:c("error"),detail:`${a.response.data.message}`,life:3e3})})},N=()=>{f.value&&g.value&&y.value&&(p.value.push({day:f.value,start:g.value,end:y.value,evaluation_type:w.value}),f.value="",g.value="",y.value=""),console.log(p.value)},O=G(()=>I.value.filter(l=>!p.value.some(a=>a.day===l.value))),A=l=>{p.value.splice(l,1)},W=()=>[{name:c("driver"),id:1},{name:c("doctor"),id:2},{name:c("Evaluator"),id:5}],z=()=>{h.post("/api/roles").then(l=>{S.value=l.data.roles.data}),h.get("/api/skills").then(l=>{T.value=l.data.data,J()}),h.get("/api/department").then(l=>{U.value=l.data.data})},J=()=>{h.get(`/api/users/${$.currentRoute._value.params.id}`).then(l=>{p.value=l.data.business_hours,e.value.role=l.data.roles.id,e.value.image=l.data.image,e.value.type=l.data.type,e.value.email=l.data.email,e.value.spotter=l.data.spotter,e.value.title=l.data.title,e.value.name=l.data.name,e.value.role=l.data.roles[0].id,e.value.skills=[];for(let a=0;a<l.data.skills.length;a++)e.value.skills.push(l.data.skills[0].id);e.value.department=[];for(let a=0;a<l.data.departments.length;a++)e.value.department.push(l.data.departments[a].id)})};return H(async()=>{z()}),(l,a)=>{const r=V("InputText"),_=V("Dropdown"),L=V("MultiSelect"),k=V("Button"),Q=V("Toast");return m(),K(ae,{class:"mx-auto pa-12 pb-8 bg-slate-50",elevation:"8"},{default:P(()=>{var B,D;return[t("form",{onSubmit:Y(R,["prevent"])},[t("div",se,[t("div",null,[t("img",{onclick:"document.getElementById('filr').click()",class:d(["m-auto rounded-full",{"p-invalid":u.value&&!e.value.image}]),style:{width:"150px",height:"150px"},src:e.value.image},null,10,oe)])]),t("div",ne,[t("div",ue,[t("label",de,o(l.$t("name")),1),n(r,{class:d(["bg-[#f7f5f5] text-center",{"p-invalid":u.value&&!e.value.name}]),modelValue:e.value.name,"onUpdate:modelValue":a[0]||(a[0]=s=>e.value.name=s)},null,8,["modelValue","class"])]),t("div",ie,[t("label",re,o(l.$t("type")),1),n(_,{id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:e.value.type,"onUpdate:modelValue":a[1]||(a[1]=s=>e.value.type=s),"option-value":"id",filter:"",options:W(),optionLabel:"name",class:d({"p-invalid":u.value&&!e.value.name})},null,8,["modelValue","options","class"])]),e.value.type==0||e.value.type==2?(m(),v("div",pe,[t("label",me,o(l.$t("skill_name")),1),n(L,{modelValue:e.value.skills,"onUpdate:modelValue":a[2]||(a[2]=s=>e.value.skills=s),filter:"","option-value":"id",options:T.value,optionLabel:"name",class:d({"p-invalid":u.value&&!e.value.skills})},null,8,["modelValue","options","class"])])):b("",!0),e.value.type==0||e.value.type==2?(m(),v("div",ve,[t("label",ce,o(l.$t("department")),1),n(L,{modelValue:e.value.department,"onUpdate:modelValue":a[3]||(a[3]=s=>e.value.department=s),filter:"","option-value":"id",options:U.value,optionLabel:"title",class:d({"p-invalid":u.value&&!e.value.department})},null,8,["modelValue","options","class"])])):b("",!0),e.value.type==0||e.value.type==2?(m(),v("div",fe,[t("label",ye,o(l.$t("Spotter")),1),n(r,{class:d(["bg-[#f7f5f5] text-center",{"p-invalid":u.value&&!e.value.spotter}]),modelValue:e.value.spotter,"onUpdate:modelValue":a[4]||(a[4]=s=>e.value.spotter=s)},null,8,["modelValue","class"])])):b("",!0),t("div",ge,[t("label",_e,o(l.$t("email")),1),n(r,{type:"email",class:d(["bg-[#f7f5f5] text-center",{"p-invalid":u.value&&!e.value.email}]),modelValue:e.value.email,"onUpdate:modelValue":a[5]||(a[5]=s=>e.value.email=s)},null,8,["modelValue","class"])]),t("div",be,[t("label",Ve,o(l.$t("title")),1),n(r,{class:d(["bg-[#f7f5f5] text-center",{"p-invalid":u.value&&!e.value.title}]),modelValue:e.value.title,"onUpdate:modelValue":a[6]||(a[6]=s=>e.value.title=s)},null,8,["modelValue","class"])]),t("div",he,[t("label",we,o(l.$t("password")),1),n(r,{class:d(["bg-[#f7f5f5] text-center",{"p-invalid":u.value&&!e.value.password}]),modelValue:e.value.password,"onUpdate:modelValue":a[7]||(a[7]=s=>e.value.password=s)},null,8,["modelValue","class"])]),t("div",ke,[t("label",$e,o(l.$t("roles")),1),n(_,{id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:e.value.role,"onUpdate:modelValue":a[8]||(a[8]=s=>e.value.role=s),"option-value":"id",filter:"",options:S.value,optionLabel:"name",class:d({"p-invalid":u.value&&!e.value.role})},null,8,["modelValue","options","class"]),(B=l.error)!=null&&B.role?(m(),v("div",xe,o(l.error.role[0]),1)):b("",!0)]),t("div",Se,[t("label",Ue,o(l.$t("personal_image")),1),n(r,{name:"file",ref:"file",onChange:M,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(D=l.error)!=null&&D.image?(m(),v("div",Te,o(l.error.image[0]),1)):b("",!0)])]),t("p",Ce,o(l.$t("add_Appointment")),1),t("table",Le,[t("thead",null,[t("tr",null,[t("th",null,o(l.$t("day")),1),t("th",null,o(l.$t("evalute_type")),1),t("th",null,o(l.$t("from")),1),t("th",null,o(l.$t("to")),1)])]),t("tbody",null,[p.value.length>=1?(m(!0),v(Z,{key:0},ee(p.value,(s,F)=>(m(),v("tr",{key:F},[t("td",null,o(s.day),1),t("td",null,o(C.value.find(E=>E.id===(s==null?void 0:s.evaluation_type)).name),1),t("td",null,o(s.start),1),t("td",null,o(s.end),1),t("td",null,[n(k,{onClick:E=>A(F),icon:"pi pi-trash",class:"p-button-rounded delete p-button-success m-auto"},null,8,["onClick"])])]))),128)):b("",!0),t("tr",null,[t("td",null,[n(_,{class:d(["w-full",{"p-invalid":u.value&&!f.value}]),style:{direction:"ltr !important"},modelValue:f.value,"onUpdate:modelValue":a[9]||(a[9]=s=>f.value=s),"option-value":"value",options:le(O),optionLabel:"name",placeholder:l.$t("day")},null,8,["modelValue","options","placeholder","class"])]),t("td",null,[n(_,{id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:w.value,"onUpdate:modelValue":a[10]||(a[10]=s=>w.value=s),"option-value":"id",options:C.value,optionLabel:"name",placeholder:l.$t("evalute_type"),class:d(["w-full",{"p-invalid":u.value&&!w.value}])},null,8,["modelValue","options","placeholder","class"])]),t("td",null,[n(r,{type:"time",timeOnly:"",modelValue:g.value,"onUpdate:modelValue":a[11]||(a[11]=s=>g.value=s),class:d(["w-full",{"p-invalid":u.value&&!g.value}]),autofocus:"",placeholder:l.$t("from"),format:"12"},null,8,["modelValue","placeholder","class"])]),t("td",null,[n(r,{type:"time",timeOnly:"",modelValue:y.value,"onUpdate:modelValue":a[12]||(a[12]=s=>y.value=s),class:d(["w-full",{"p-invalid":u.value&&!y.value}]),autofocus:"",placeholder:l.$t("to")},null,8,["modelValue","placeholder","class"])]),t("td",null,[n(k,{onClick:N,class:"create m-auto s",icon:"pi pi-plus"})])])])]),n(k,{onClick:a[13]||(a[13]=s=>u.value=!0),type:"submit",class:"mt-4 m-auto create w-full",label:l.$t("submit")},null,8,["label"])],40,te),n(Q)]}),_:1})}}};export{Fe as default};
