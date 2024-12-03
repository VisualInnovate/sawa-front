import{_ as x,c as d,r as m,o as h,d as r,e as t,t as o,g as y,f as a,w as b,D as V,E as n,T as k,F as D,L as B,O as M}from"./main-f9d3afa8.js";const A={data(){return{employee:{},users:{},submitted:!1,childs:{},cities:{},positions:{},shifts:{},skills:[],roles:[],departments:{},qustions:{},error:{},maxDate:new Date}},methods:{tpes(){return[{name:this.$t("driver"),id:1},{name:this.$t("doctor"),id:2},{name:this.$t("Evaluator"),id:5}]},getoneanswer(){d.get(`api/employees/${this.$route.params.id}`).then(e=>{console.log(e.data.data),this.employee.name=e.data.data.name,this.employee.user_id=e.data.data.user_id,this.employee.position_id=e.data.data.position_id,this.employee.basic_salary=e.data.data.basic_salary,this.employee.shift_id=e.data.data.shift_id,this.employee.department_id=e.data.data.department_id,this.employee.type=e.data.data.user.type,this.employee.image=e.data.data.user.image,this.employee.title=e.data.data.user.title,this.employee.role=e.data.data.user.roles[0].id,this.employee.national_id=parseInt(e.data.data.national_id),this.employee.skills=[];for(let s=0;s<e.data.data.user.skills.length;s++)this.employee.skills.push(e.data.data.user.skills[s].id);this.employee.department=[];for(let s=0;s<e.data.data.user.departments.length;s++)this.employee.department.push(e.data.data.user.departments[s].id)})},getusers(){d.post("api/users").then(e=>{this.users=e.data.users.data,this.getoneanswer()}),d.get("api/shifts").then(e=>{this.shifts=e.data.data}),d.get("api/position").then(e=>{this.positions=e.data.data}),d.post("/api/roles").then(e=>{this.roles=e.data.roles.data}),d.get("/api/skills").then(e=>{this.skills=e.data.data}),d.get("api/department").then(e=>{this.departments=e.data.data}),d.get(`/api/countries/${localStorage.getItem("appLang")}`).then(e=>{this.cities=e.data.countries,this.getoneanswer()})},update(){const e=new FormData;this.employee.name&&e.append("name",this.employee.name),this.employee.title&&e.append("title",this.employee.title),this.employee.email&&e.append("email",this.employee.email),this.employee.password&&e.append("password",this.employee.password),this.employee.shift_id&&e.append("shift_id",this.employee.shift_id),this.employee.position_id&&e.append("position_id",this.employee.position_id),this.employee.national_id&&e.append("national_id",this.employee.national_id),this.employee.basic_salary&&e.append("basic_salary",this.employee.basic_salary),this.employee.type&&e.append("type",this.employee.type),this.employee.role&&e.append("role",this.employee.role),this.employee.skills&&e.append("skills",this.employee.skills),this.employee.department&&e.append("department_id",this.employee.department),this.employee.file&&e.append("file",this.employee.file),d.post(`/api/employees/${this.$route.params.id}`,e).then(s=>{this.$toast.add({severity:"success",summary:this.$t("success_message"),detail:this.$t("element_update_success"),life:3e3})}).catch(s=>{this.$toast.add({severity:"error",summary:this.$t("error"),detail:`${s.response.data.message}`,life:3e3})})}},mounted(){this.getusers()}},p=e=>(B("data-v-b55da71e"),e=e(),M(),e),H={class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold"},I={key:0,class:"loader"},U={class:"col-span-2"},Z=["src"],C={class:"flex flex-column gap-2 py-1"},F={class:"flex"},S={class:"text-right"},E=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),q={class:"flex flex-column gap-2 py-1"},N={class:"flex"},T={class:"text-right"},j=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),z={class:"flex flex-column gap-2 py-1"},O={class:"flex"},G={class:"text-right"},J=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),K={class:"flex flex-column gap-2 py-1"},P={class:"flex"},Q={class:"text-right"},R=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),W={class:"flex flex-column gap-2"},X={class:"flex"},Y={class:"text-right"},$=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),ee={class:"flex flex-column gap-2"},te={class:"flex"},le={class:"text-right"},se=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),ie={class:"flex flex-column gap-2"},oe={class:"flex"},ae={class:"text-right"},ne=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),pe={class:"flex flex-column gap-2"},de={class:"flex"},me={class:"text-right"},he=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),re={class:"flex flex-column gap-2 py-1"},ue={class:"flex"},ce={class:"text-right"},Le=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),ye={key:0,class:"flex flex-column gap-2"},_e={class:"flex"},fe={class:"text-right"},ge=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),ve={class:"flex flex-column gap-2"},we={class:"flex"},xe={class:"text-right"},be=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),Ve={class:"flex flex-column gap-2 py-1"},ke={class:"flex"},De={class:"text-right"},Be=p(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),Me={class:"flex-column gap-2 py-1 hidden"},Ae={class:"w-full",for:"username"},He={key:0,class:"mt-1 mb-5 text-red-500"},Ie={class:"flex flex-column gap-2 w-full"},Ue={style:{visibility:"hidden"},for:"username"},Ze=p(()=>t("small",{id:"username-help"},null,-1));function Ce(e,s,Fe,Se,l,L){const u=m("InputText"),c=m("Dropdown"),_=m("InputNumber"),f=m("MultiSelect"),v=m("Button"),w=m("toast");return h(),r(D,null,[t("div",null,[t("div",null,[t("p",H,o(e.$t("Employees")),1)]),e.loading?(h(),r("div",I)):y("",!0)]),a(k,null,{default:b(()=>{var g;return[t("div",null,[t("form",{class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:s[13]||(s[13]=V((...i)=>L.update&&L.update(...i),["prevent"]))},[t("div",U,[t("div",null,[l.employee.image?(h(),r("img",{key:0,onclick:"document.getElementById('filr').click()",class:n(["m-auto rounded-full",{"p-invalid":l.submitted&&!l.employee.image}]),style:{width:"150px",height:"150px"},src:l.employee.image},null,10,Z)):(h(),r("img",{key:1,onclick:"document.getElementById('filr').click()",class:n(["m-auto rounded-full",{"p-invalid":l.submitted&&!l.employee.image}]),style:{width:"150px",height:"150px"},src:"https://sys.sawa.sawa.academy/public/default.jpg"},null,2))])]),t("div",C,[t("div",F,[t("label",S,o(e.$t("employee_name")),1),E]),a(u,{class:n(["bg-[#f7f5f5] text-center",{"p-invalid":l.submitted&&!l.employee.name}]),modelValue:l.employee.name,"onUpdate:modelValue":s[0]||(s[0]=i=>l.employee.name=i)},null,8,["modelValue","class"])]),t("div",q,[t("div",N,[t("label",T,o(e.$t("email")),1),j]),a(u,{type:"email",class:n(["bg-[#f7f5f5] text-center",{"p-invalid":l.submitted&&!l.employee.email}]),modelValue:l.employee.email,"onUpdate:modelValue":s[1]||(s[1]=i=>l.employee.email=i)},null,8,["modelValue","class"])]),t("div",z,[t("div",O,[t("label",G,o(e.$t("password")),1),J]),a(u,{type:"password",class:n(["bg-[#f7f5f5] text-center",{"p-invalid":l.submitted&&!l.employee.password}]),modelValue:l.employee.password,"onUpdate:modelValue":s[2]||(s[2]=i=>l.employee.password=i)},null,8,["modelValue","class"])]),t("div",K,[t("div",P,[t("label",Q,o(e.$t("title")),1),R]),a(u,{class:n(["bg-[#f7f5f5] text-center",{"p-invalid":l.submitted&&!l.employee.title}]),modelValue:l.employee.title,"onUpdate:modelValue":s[3]||(s[3]=i=>l.employee.title=i)},null,8,["modelValue","class"])]),t("div",W,[t("div",X,[t("label",Y,o(e.$t("shift_name")),1),$]),a(c,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:l.employee.shift_id,"onUpdate:modelValue":s[4]||(s[4]=i=>l.employee.shift_id=i),"option-value":"id",options:l.shifts,optionLabel:"title",placeholder:e.$t("shift_name"),class:n(["w-full",{"p-invalid":l.submitted&&!l.employee.shift_id}])},null,8,["modelValue","options","placeholder","class"])]),t("div",ee,[t("div",te,[t("label",le,o(e.$t("position_name")),1),se]),a(c,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:l.employee.position_id,"onUpdate:modelValue":s[5]||(s[5]=i=>l.employee.position_id=i),"option-value":"id",options:l.positions,optionLabel:"title",placeholder:e.$t("position_name"),class:n(["w-full",{"p-invalid":l.submitted&&!l.employee.position_id}])},null,8,["modelValue","options","placeholder","class"])]),t("div",ie,[t("div",oe,[t("label",ae,o(e.$t("national_id")),1),ne]),a(_,{required:"",class:n(["bg-[#f7f5f5]",{"p-invalid":l.submitted&&!l.employee.national_id}]),modelValue:l.employee.national_id,"onUpdate:modelValue":s[6]||(s[6]=i=>l.employee.national_id=i),placeholder:e.$t("national_id")},null,8,["modelValue","placeholder","class"])]),t("div",pe,[t("div",de,[t("label",me,o(e.$t("basic_salary")),1),he]),a(_,{required:"",class:n(["bg-[#f7f5f5]",{"p-invalid":l.submitted&&!l.employee.basic_salary}]),modelValue:l.employee.basic_salary,"onUpdate:modelValue":s[7]||(s[7]=i=>l.employee.basic_salary=i),placeholder:e.$t("basic_salary")},null,8,["modelValue","placeholder","class"])]),t("div",re,[t("div",ue,[t("label",ce,o(e.$t("type")),1),Le]),a(c,{id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.employee.type,"onUpdate:modelValue":s[8]||(s[8]=i=>l.employee.type=i),"option-value":"id",filter:"",options:L.tpes(),optionLabel:"name",class:n({"p-invalid":l.submitted&&!l.employee.type})},null,8,["modelValue","options","class"])]),l.employee.type==0||l.employee.type==2?(h(),r("div",ye,[t("div",_e,[t("label",fe,o(e.$t("skill_name")),1),ge]),a(f,{modelValue:l.employee.skills,"onUpdate:modelValue":s[9]||(s[9]=i=>l.employee.skills=i),filter:"","option-value":"id",options:l.skills,optionLabel:"name",class:n({"p-invalid":l.submitted&&!l.employee.skills})},null,8,["modelValue","options","class"])])):y("",!0),t("div",ve,[t("div",we,[t("label",xe,o(e.$t("department")),1),be]),a(f,{modelValue:l.employee.department,"onUpdate:modelValue":s[10]||(s[10]=i=>l.employee.department=i),filter:"","option-value":"id",options:l.departments,optionLabel:"title",class:n({"p-invalid":l.submitted&&!l.employee.department})},null,8,["modelValue","options","class"])]),t("div",Ve,[t("div",ke,[t("label",De,o(e.$t("roles")),1),Be]),a(c,{id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.employee.role,"onUpdate:modelValue":s[11]||(s[11]=i=>l.employee.role=i),"option-value":"id",filter:"",options:l.roles,optionLabel:"name",class:n({"p-invalid":l.submitted&&!l.employee.role})},null,8,["modelValue","options","class"])]),t("div",Me,[t("label",Ae,o(e.$t("personal_image")),1),a(u,{name:"file",ref:"file",onChange:e.uploadFile,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,8,["onChange"]),(g=l.error)!=null&&g.image?(h(),r("div",He,o(l.error.image[0]),1)):y("",!0)]),t("div",Ie,[t("label",Ue,o(e.$t("gruop_sessaion")),1),a(v,{onClick:s[12]||(s[12]=i=>l.submitted=!0),type:"submit",class:"create m-auto w-full",label:e.$t("submit")},null,8,["label"]),Ze])],544),a(w)])]}),_:1})],64)}const qe=x(A,[["render",Ce],["__scopeId","data-v-b55da71e"]]);export{qe as default};
