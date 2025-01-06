import{_ as k,c as p,r,o as m,x as D,w as B,e as t,d as h,t as a,E as n,f as i,g as L,D as S,T as M,L as A,O as U}from"./main-1e024ca4.js";const H={data(){return{currentStep:0,steps:[{label:"Personal Details"},{label:"Job Details"},{label:"Additional Details"}],employee:{},users:{},submitted:!1,childs:{},cities:{},positions:{},shifts:{},skills:[],roles:[],departments:{},qustions:{},error:{},maxDate:new Date,treatments:[]}},methods:{tpes(){return[{name:this.$t("driver"),id:1},{name:this.$t("doctor"),id:2},{name:this.$t("Evaluator"),id:5},{name:this.$t("أداري"),id:6}]},nextStep(){this.currentStep<this.steps.length-1&&this.currentStep++},previousStep(){this.currentStep>0&&this.currentStep--},navigateToStep(e){this.currentStep=e},uploadFile(e){const s=e.target.files[0];if(!s)return;const y=new FileReader;y.readAsDataURL(s),y.onload=w=>{this.employee.image=w.target.result,this.employee.file=s,console.log(this.employee.image)}},getoneanswer(){p.get(`api/employees/${this.$route.params.id}`).then(e=>{console.log(e.data.data),this.employee.name=e.data.data.name,this.employee.email=e.data.data.email,this.employee.user_id=e.data.data.user_id,this.employee.position_id=e.data.data.position_id,this.employee.basic_salary=e.data.data.basic_salary,this.employee.shift_id=e.data.data.shift_id,this.employee.department_id=e.data.data.department_id,this.employee.type=e.data.data.user.type,this.employee.spotter=e.data.data.user.spotter,this.employee.date_of_enrollment=e.data.data.date_of_enrollment,this.employee.date_of_birth=e.data.data.date_of_birth,this.employee.contract_period=e.data.data.contract_period,this.employee.image=e.data.data.user.image,this.employee.title=e.data.data.user.title,this.employee.role=e.data.data.user.roles[0].id,this.employee.national_id=parseInt(e.data.data.national_id),this.employee.skills=[];for(let s=0;s<e.data.data.user.skills.length;s++)this.employee.skills.push(e.data.data.user.skills[s].id);this.employee.treatments=[];for(let s=0;s<e.data.data.user.treatments.length;s++)this.employee.treatments.push(e.data.data.user.treatments[s].id);this.employee.department=[];for(let s=0;s<e.data.data.user.departments.length;s++)this.employee.department.push(e.data.data.user.departments[s].id)})},getusers(){p.post("api/users").then(e=>{this.users=e.data.users.data,this.getoneanswer()}),p.get("api/shifts").then(e=>{this.shifts=e.data.data}),p.get("api/position").then(e=>{this.positions=e.data.data}),p.get("api/treatment/all").then(e=>{this.treatments=e.data.data}),p.post("/api/roles").then(e=>{this.roles=e.data.roles.data}),p.get("/api/skills").then(e=>{this.skills=e.data.data}),p.get("api/department").then(e=>{this.departments=e.data.data}),p.get(`/api/countries/${localStorage.getItem("appLang")}`).then(e=>{this.cities=e.data.countries,this.getoneanswer()})},update(){const e=new FormData;this.employee.name&&e.append("name",this.employee.name),this.employee.title&&e.append("title",this.employee.title),this.employee.email&&e.append("email",this.employee.email),this.employee.password&&e.append("password",this.employee.password),this.employee.shift_id&&e.append("shift_id",this.employee.shift_id),this.employee.spotter&&e.append("spotter",this.employee.spotter),this.employee.position_id&&e.append("position_id",this.employee.position_id),this.employee.date_of_birth&&e.append("date_of_birth",this.employee.date_of_birth),this.employee.date_of_enrollment&&e.append("date_of_enrollment",this.employee.date_of_enrollment),this.employee.contract_period&&e.append("contract_period",this.employee.contract_period),this.employee.national_id&&e.append("national_id",this.employee.national_id),this.employee.basic_salary&&e.append("basic_salary",this.employee.basic_salary),this.employee.type&&e.append("type",this.employee.type),this.employee.role&&e.append("role",this.employee.role),this.employee.treatments&&e.append("treatments",this.employee.treatments),this.employee.skills&&e.append("skills",this.employee.skills),this.employee.department&&e.append("department_id",this.employee.department),this.employee.file&&e.append("file",this.employee.file),p.post(`/api/employees/${this.$route.params.id}`,e).then(s=>{this.$toast.add({severity:"success",summary:this.$t("success_message"),detail:this.$t("element_add_success"),life:3e3})}).catch(s=>{this.$toast.add({severity:"error",summary:this.$t("error"),detail:`${s.response.data.message}`,life:3e3})})}},mounted(){this.getusers()}},d=e=>(A("data-v-addeec1e"),e=e(),U(),e),Z={key:0},I={class:"text-center text-xl font-bold text-blue-950"},C={class:"p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4"},F={class:"col-span-2"},q=["src"],E={class:"flex flex-column gap-2 py-1"},N={class:"flex"},T={class:"text-right"},j=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),G={class:"flex flex-column gap-2 py-1"},R={class:"flex"},z={class:"text-right"},J=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),O={class:"flex flex-column gap-2 py-1"},P={class:"flex"},K={class:"text-right"},Q=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),W={class:"flex flex-column gap-2 py-1"},X={class:"flex"},Y={class:"text-right"},$=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),ee={class:"flex flex-column gap-2"},te={class:"flex"},le={class:"text-right"},se=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),oe={class:"flex flex-column gap-2"},ie={class:"flex"},ae={class:"text-right"},ne=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),de={class:"flex-column gap-2 py-1 hidden"},pe={class:"w-full",for:"username"},me={key:0,class:"mt-1 mb-5 text-red-500"},re={class:"w-full text-center"},he={key:1},ce={class:"text-center text-xl font-bold text-blue-950"},ue={class:"p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4"},Le={class:"flex flex-column gap-2"},_e={class:"flex"},ye={class:"text-right"},fe=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),ge={class:"flex flex-column gap-2"},ve={class:"flex"},we={class:"text-right"},xe=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),be={class:"flex flex-column gap-2"},Ve={class:"flex"},ke={class:"text-right"},De=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),Be={class:"flex flex-column gap-2"},Se={class:"flex"},Me={class:"text-right"},Ae=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),Ue={class:"flex flex-column gap-2 py-1"},He={class:"flex"},Ze={class:"text-right"},Ie=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),Ce={class:"flex flex-column gap-2"},Fe={class:"flex"},qe={class:"text-right"},Ee=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),Ne={class:"flex flex-column gap-2 py-1"},Te={class:"flex"},je={class:"text-right"},Ge=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),Re={key:0,class:"flex flex-column gap-2"},ze={class:"flex"},Je={class:"text-right"},Oe=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),Pe={key:1,class:"flex flex-column gap-2"},Ke={class:"flex"},Qe={class:"text-right"},We=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),Xe={class:"flex flex-column gap-2"},Ye={class:"flex"},$e={class:"text-right"},et=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),tt={class:"flex flex-column gap-2 py-1"},lt={class:"flex"},st={class:"text-right"},ot=d(()=>t("svg",{class:"my-auto mx-1",width:"7",height:"5",viewBox:"0 0 6 5",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[t("path",{opacity:"0.8",d:"M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z",fill:"#DA1414"})],-1)),it={class:"text-center"};function at(e,s,y,w,l,c){const u=r("InputText"),f=r("InputNumber"),x=r("Calendar"),g=r("Button"),_=r("Dropdown"),v=r("MultiSelect"),V=r("toast");return m(),D(M,{class:"p-[1%]"},{default:B(()=>{var b;return[t("form",{class:"form-container",ref:"myForm",onSubmit:s[18]||(s[18]=S((...o)=>c.update&&c.update(...o),["prevent"]))},[l.currentStep===0?(m(),h("div",Z,[t("h3",I,a(e.$t("student_details")),1),t("div",C,[t("div",F,[t("div",null,[l.employee.image?(m(),h("img",{key:0,onclick:"document.getElementById('filr').click()",class:n(["m-auto rounded-full",{"p-invalid":l.submitted&&!l.employee.image}]),style:{width:"150px",height:"150px"},src:l.employee.image},null,10,q)):(m(),h("img",{key:1,onclick:"document.getElementById('filr').click()",class:n(["m-auto rounded-full",{"p-invalid":l.submitted&&!l.employee.image}]),style:{width:"150px",height:"150px"},src:"https://sys.sawa.sawa.academy/public/default.jpg"},null,2))])]),t("div",E,[t("div",N,[t("label",T,a(e.$t("employee_name")),1),j]),i(u,{class:n(["bg-[#f7f5f5] text-center",{"p-invalid":l.submitted&&!l.employee.name}]),modelValue:l.employee.name,"onUpdate:modelValue":s[0]||(s[0]=o=>l.employee.name=o)},null,8,["modelValue","class"])]),t("div",G,[t("div",R,[t("label",z,a(e.$t("email")),1),J]),i(u,{type:"email",class:n(["bg-[#f7f5f5] text-center",{"p-invalid":l.submitted&&!l.employee.email}]),modelValue:l.employee.email,"onUpdate:modelValue":s[1]||(s[1]=o=>l.employee.email=o)},null,8,["modelValue","class"])]),t("div",O,[t("div",P,[t("label",K,a(e.$t("password")),1),Q]),i(u,{type:"password",class:n(["bg-[#f7f5f5] text-center",{"p-invalid":l.submitted&&!l.employee.password}]),modelValue:l.employee.password,"onUpdate:modelValue":s[2]||(s[2]=o=>l.employee.password=o)},null,8,["modelValue","class"])]),t("div",W,[t("div",X,[t("label",Y,a(e.$t("title")),1),$]),i(u,{class:n(["bg-[#f7f5f5] text-center",{"p-invalid":l.submitted&&!l.employee.title}]),modelValue:l.employee.title,"onUpdate:modelValue":s[3]||(s[3]=o=>l.employee.title=o)},null,8,["modelValue","class"])]),t("div",ee,[t("div",te,[t("label",le,a(e.$t("national_id")),1),se]),i(f,{inputId:"withoutgrouping",useGrouping:!1,fluid:"",required:"",class:n(["bg-[#f7f5f5]",{"p-invalid":l.submitted&&!l.employee.national_id}]),modelValue:l.employee.national_id,"onUpdate:modelValue":s[4]||(s[4]=o=>l.employee.national_id=o)},null,8,["modelValue","class"])]),t("div",oe,[t("div",ie,[t("label",ae,a(e.$t("date_of_birth")),1),ne]),i(x,{showButtonBar:"",modelValue:l.employee.date_of_birth,"onUpdate:modelValue":s[5]||(s[5]=o=>l.employee.date_of_birth=o),modelModifiers:{number:!0},showIcon:"",class:n({"p-invalid":l.submitted&&!l.employee.date_of_birth})},null,8,["modelValue","class"])]),t("div",de,[t("label",pe,a(e.$t("personal_image")),1),i(u,{name:"file",ref:"file",onChange:c.uploadFile,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,8,["onChange"]),(b=l.error)!=null&&b.image?(m(),h("div",me,a(l.error.image[0]),1)):L("",!0)])]),t("div",re,[i(g,{class:"create w-[50%]",label:e.$t("next"),onClick:c.nextStep},null,8,["label","onClick"])])])):L("",!0),l.currentStep===1?(m(),h("div",he,[t("h3",ce,a(e.$t("job_details")),1),t("div",ue,[t("div",Le,[t("div",_e,[t("label",ye,a(e.$t("position_name")),1),fe]),i(_,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:l.employee.position_id,"onUpdate:modelValue":s[6]||(s[6]=o=>l.employee.position_id=o),"option-value":"id",options:l.positions,optionLabel:"title",placeholder:e.$t("position_name"),class:n(["w-full",{"p-invalid":l.submitted&&!l.employee.position_id}])},null,8,["modelValue","options","placeholder","class"])]),t("div",ge,[t("div",ve,[t("label",we,a(e.$t("shift_name")),1),xe]),i(_,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:l.employee.shift_id,"onUpdate:modelValue":s[7]||(s[7]=o=>l.employee.shift_id=o),"option-value":"id",options:l.shifts,optionLabel:"title",placeholder:e.$t("shift_name"),class:n(["w-full",{"p-invalid":l.submitted&&!l.employee.shift_id}])},null,8,["modelValue","options","placeholder","class"])]),t("div",be,[t("div",Ve,[t("label",ke,a(e.$t("basic_salary")),1),De]),i(f,{inputId:"withoutgrouping",useGrouping:!1,fluid:"",required:"",class:n(["bg-[#f7f5f5]",{"p-invalid":l.submitted&&!l.employee.basic_salary}]),modelValue:l.employee.basic_salary,"onUpdate:modelValue":s[8]||(s[8]=o=>l.employee.basic_salary=o),placeholder:e.$t("basic_salary")},null,8,["modelValue","placeholder","class"])]),t("div",Be,[t("div",Se,[t("label",Me,a(e.$t("Spotter")),1),Ae]),i(f,{required:"",class:n(["bg-[#f7f5f5]",{"p-invalid":l.submitted&&!l.employee.Spotter}]),modelValue:l.employee.spotter,"onUpdate:modelValue":s[9]||(s[9]=o=>l.employee.spotter=o),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder","class"])]),t("div",Ue,[t("div",He,[t("label",Ze,a(e.$t("contract_period")),1),Ie]),i(u,{class:n(["bg-[#f7f5f5] text-center",{"p-invalid":l.submitted&&!l.employee.contract_period}]),modelValue:l.employee.contract_period,"onUpdate:modelValue":s[10]||(s[10]=o=>l.employee.contract_period=o)},null,8,["modelValue","class"])]),t("div",Ce,[t("div",Fe,[t("label",qe,a(e.$t("date_of_enrollment")),1),Ee]),i(x,{showButtonBar:"",modelValue:l.employee.date_of_enrollment,"onUpdate:modelValue":s[11]||(s[11]=o=>l.employee.date_of_enrollment=o),modelModifiers:{number:!0},showIcon:"",class:n({"p-invalid":l.submitted&&!l.employee.date_of_enrollment})},null,8,["modelValue","class"])]),t("div",Ne,[t("div",Te,[t("label",je,a(e.$t("type")),1),Ge]),i(_,{id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.employee.type,"onUpdate:modelValue":s[12]||(s[12]=o=>l.employee.type=o),"option-value":"id",filter:"",options:c.tpes(),optionLabel:"name",class:n({"p-invalid":l.submitted&&!l.employee.type})},null,8,["modelValue","options","class"])]),l.employee.type==0||l.employee.type==2?(m(),h("div",Re,[t("div",ze,[t("label",Je,a(e.$t("skill_name")),1),Oe]),i(v,{modelValue:l.employee.skills,"onUpdate:modelValue":s[13]||(s[13]=o=>l.employee.skills=o),filter:"","option-value":"id",options:l.skills,optionLabel:"name",class:n({"p-invalid":l.submitted&&!l.employee.skills})},null,8,["modelValue","options","class"])])):L("",!0),l.employee.type==0||l.employee.type==2?(m(),h("div",Pe,[t("div",Ke,[t("label",Qe,a(e.$t("Typetreatment")),1),We]),i(v,{modelValue:l.employee.treatments,"onUpdate:modelValue":s[14]||(s[14]=o=>l.employee.treatments=o),filter:"","option-value":"id",options:l.treatments,optionLabel:"name",class:n({"p-invalid":l.submitted&&!l.employee.treatments})},null,8,["modelValue","options","class"])])):L("",!0),t("div",Xe,[t("div",Ye,[t("label",$e,a(e.$t("department")),1),et]),i(v,{modelValue:l.employee.department,"onUpdate:modelValue":s[15]||(s[15]=o=>l.employee.department=o),filter:"","option-value":"id",options:l.departments,optionLabel:"title",class:n({"p-invalid":l.submitted&&!l.employee.department})},null,8,["modelValue","options","class"])]),t("div",tt,[t("div",lt,[t("label",st,a(e.$t("roles")),1),ot]),i(_,{id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.employee.role,"onUpdate:modelValue":s[16]||(s[16]=o=>l.employee.role=o),"option-value":"id",filter:"",options:l.roles,optionLabel:"name",class:n({"p-invalid":l.submitted&&!l.employee.role})},null,8,["modelValue","options","class"])])]),t("div",it,[i(g,{onClick:c.previousStep,class:"create",label:e.$t("Back")},null,8,["onClick","label"]),i(g,{type:"submit",onClick:s[17]||(s[17]=o=>l.submitted=!0),class:"create",label:e.$t("submit")},null,8,["label"])])])):L("",!0),i(V)],544)]}),_:1})}const dt=k(H,[["render",at],["__scopeId","data-v-addeec1e"]]);export{dt as default};
