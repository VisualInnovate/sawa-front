import{_ as N,u as M,c as p,D as A,r as c,o as i,x as P,w as m,f as a,e as l,d as r,t as o,g as d,X as T,z,h as R,F as j,ak as X}from"./main-cabb131e.js";import{E as Y}from"./EvaluationType-74796c7b.js";const G={components:{EvaluationType:Y},data(){return{child_id:M("child_id",Number),maxDate:new Date,user:{skills:[],department:[]},skills:[],roles:[],departments:[],evalate:{},error:{},deleteDialog:!1,delete_id:"",doctors:{},updatedialog:!1,evaluate_types:[{name:"side profile",id:1},{name:"milestone",id:2},{name:"barrier",id:3}]}},methods:{opennew(){this.updatedialog=!this.updatedialog},tpes(){return[{name:this.$t("driver"),id:1},{name:this.$t("doctor"),id:2},{name:this.$t("Evaluator"),id:3}]},deleteAction(){p.delete(`api/evaluation-request/${this.delete_id}`).then(e=>{this.getusers(),this.deleteDialog=!this.deleteDialog})},deleteevalution(e){this.delete_id=e,this.deleteDialog=!this.deleteDialog},go_evaluate(e,s){console.log(e,s),s==1&&this.$router.push({name:"ShowSideProfiles",params:{id:e}}),s==2&&this.$router.push({name:"milestone-evaluation",params:{id:e}}),s==3&&this.$router.push({name:"barrier-evaluation",params:{id:e}}),s==4&&this.$router.push({name:"mission-test",params:{id:e}}),s==5&&this.$router.push({name:"carolina-test",params:{id:e}})},serchdata(e){p.get(`api/users/${localStorage.getItem("doctor_id")}/search/evaluations?search=${e}`).then(s=>{this.details=s.data.evaluation_requests})},createevaluate(){p.post("api/evaluation-request",{child_id:localStorage.getItem("child_id"),consultant_id:localStorage.getItem("user_id"),evaluation_type:this.evalate.evaluation_type,date:A(this.evalate.datet).format("Y-MM-DD"),specialist_id:this.evalate.specialist_id}).then(e=>{this.updatedialog=!this.updatedialog,this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})},getusers(){p.post("/api/roles").then(e=>{this.roles=e.data.roles.data,console.log(users.value)}),p.get("/api/skills").then(e=>{this.skills=e.data.data}),p.get("/api/department").then(e=>{this.departments=e.data.data}),p.get(`api/users/${localStorage.getItem("user_id")}`).then(e=>{console.log(e.data.evaluation_requests),this.user.type=e.data.type,this.user.email=e.data.email,this.user.name=e.data.name,this.user.spotter=e.data.spotter,this.user.title=e.data.title,this.user.image=e.data.image,this.user.role=e.data.roles[0].id,this.user.evaluation_requests=e.data.evaluation_requests;for(let s=0;s<e.data.skills.length;s++)this.user.skills.push(e.data.skills[s].id);for(let s=0;s<e.data.departments.length;s++)this.user.department.push(e.data.departments[s].id)})},editesuser(){const e=new FormData;e.append("name",this.user.name),e.append("email",this.user.email),e.append("title",this.user.title),e.append("password",this.user.password),e.append("image",this.user.file),e.append("role",this.user.role),this.user.spotter&&e.append("spotter",this.user.spotter),this.user.skills&&e.append("skills",this.user.skills),this.user.department&&e.append("department_id",this.user.department),e.append("type",this.user.type),p.post(`/api/users/${localStorage.getItem("user_id")}/edit`,e).then(s=>{console.log(s.data),fetchData()}).catch(s=>{error.value=s.response.data.errors})},uploadFile(e){const s=e.target.files[0],b=new FileReader;b.readAsDataURL(s),b.onload=k=>{this.user.image=k.target.result,this.user.file=s},console.log(this.user.image)},getdoctors(){p.get("api/doctors").then(e=>{this.doctors=e.data.doctors}).catch(e=>{})}},mounted(){this.getusers(),this.getdoctors(),this.child_id=localStorage.getItem("child_id")}},H={class:"grid grid-cols-2 gap-4"},J={class:"col-span-2"},K=["src"],O={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:X},Q={key:2,class:"mt-1 mb-5 text-red-500"},W={class:"flex flex-column gap-2 py-1"},Z={class:"w-full text-right",for:"username"},$={key:0,class:"mt-1 mb-5 text-red-500"},ee={class:"flex flex-column gap-2 py-1"},te={class:"w-full text-right",for:"username"},se={key:0,class:"mt-1 mb-5 text-red-500"},le={key:0,class:"flex flex-column gap-2"},oe={class:"w-full text-right",for:"username"},ie={key:0,class:"mt-1 mb-5 text-red-500"},re={key:1,class:"flex flex-column gap-2"},ae={class:"w-full text-right",for:"username"},ne={key:0,class:"mt-1 mb-5 text-red-500"},de={key:2,class:"flex flex-column gap-2"},ue={class:"w-full text-right",for:"username"},pe={key:0,class:"mt-1 mb-5 text-red-500"},me={class:"flex flex-column gap-2 py-1"},ce={class:"w-full text-right",for:"username"},he={key:0,class:"mt-1 mb-5 text-red-500"},fe={class:"flex flex-column gap-2 py-1"},_e={class:"w-full text-right",for:"username"},ge={key:0,class:"mt-1 mb-5 text-red-500"},ye={class:"flex flex-column gap-2 py-1"},ve={class:"w-full text-right",for:"username"},be={key:0,class:"mt-1 mb-5 text-red-500"},xe={class:"flex flex-column gap-2 py-1"},ke={class:"w-full text-right",for:"username"},we={key:0,class:"mt-1 mb-5 text-red-500"},Ve={class:"flex-column gap-2 py-1 hidden"},qe={class:"w-full text-right",for:"username"},De={key:0,class:"mt-1 mb-5 text-red-500"},Ce={class:"w-full text-center"},Se={class:"grid grid-cols-1 lg:grid-cols-2 gap-4 p-4"},Ie={class:"shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-3"},Ue={class:"col-span-2"},Be={class:"flex py-2"},Te={class:"my-auto font-bold"},Ee={key:0,class:"text-xl px-1 my-auto"},Fe={key:1,class:"text-xl px-1 my-auto"},Le={key:2,class:"text-xl px-1 my-auto"},Ne={key:3,class:"text-xl px-1 my-auto"},Me={key:4,class:"text-xl px-1 my-auto"},Ae={class:"flex py-2"},Pe={class:"my-auto font-bold"},ze={class:"text-xl px-1 my-auto"},Re={class:"flex py-2"},je={class:"my-auto font-bold"},Xe={class:"text-xl px-1 my-auto"},Ye={class:"flex py-2"},Ge={class:"my-auto font-bold"},He={class:"text-xl px-1 my-auto"},Je={class:"text-center"},Ke={class:"flex align-items-center justify-content-center"},Oe=l("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),Qe=l("p",{class:"m-0"}," At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus. ",-1);function We(e,s,b,k,t,h){const f=c("InputText"),w=c("Dropdown"),V=c("MultiSelect"),_=c("Button"),x=c("TabPanel"),E=c("Dialog"),F=c("toast"),L=c("TabView");return i(),P(T,{class:"card"},{default:m(()=>[a(L,{activeIndex:e.active,"onUpdate:activeIndex":s[11]||(s[11]=n=>e.active=n)},{default:m(()=>[a(x,{header:e.$t("student_details")},{default:m(()=>{var n,g,y,v,q,D,C,S,I,U,B;return[l("div",H,[l("div",J,[l("div",null,[t.user.image?(i(),r("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:"https://sawa.sawa.academy/"+t.user.image},null,8,K)):(i(),r("img",O)),(n=t.error)!=null&&n.image?(i(),r("div",Q,o(t.error.image[0]),1)):d("",!0)])]),l("div",W,[l("label",Z,o(e.$t("name")),1),a(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:t.user.name,"onUpdate:modelValue":s[0]||(s[0]=u=>t.user.name=u),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=t.error)!=null&&g.name?(i(),r("div",$,o(t.error.name[0]),1)):d("",!0)]),l("div",ee,[l("label",te,o(e.$t("type")),1),a(w,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:t.user.type,"onUpdate:modelValue":s[1]||(s[1]=u=>t.user.type=u),"option-value":"id",filter:"",options:h.tpes(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(y=t.error)!=null&&y.type?(i(),r("div",se,o(t.error.type[0]),1)):d("",!0)]),t.user.type==0||t.user.type==2?(i(),r("div",le,[l("label",oe,o(e.$t("skill_name")),1),a(V,{modelValue:t.user.skills,"onUpdate:modelValue":s[2]||(s[2]=u=>t.user.skills=u),filter:"","option-value":"id",options:t.skills,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(v=t.error)!=null&&v.skills?(i(),r("div",ie,o(t.error.skills[0]),1)):d("",!0)])):d("",!0),t.user.type==0||t.user.type==2?(i(),r("div",re,[l("label",ae,o(e.$t("department")),1),a(V,{modelValue:t.user.department,"onUpdate:modelValue":s[3]||(s[3]=u=>t.user.department=u),filter:"","option-value":"id",options:t.departments,optionLabel:"title",placeholder:e.$t("department"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(q=t.error)!=null&&q.permissions?(i(),r("div",ne,o(t.error.permissions[0]),1)):d("",!0)])):d("",!0),t.user.type==0||t.user.type==2?(i(),r("div",de,[l("label",ue,o(e.$t("Spotter")),1),a(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:t.user.spotter,"onUpdate:modelValue":s[4]||(s[4]=u=>t.user.spotter=u),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),(D=t.error)!=null&&D.permissions?(i(),r("div",pe,o(t.error.permissions[0]),1)):d("",!0)])):d("",!0),l("div",me,[l("label",ce,o(e.$t("email")),1),a(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:t.user.email,"onUpdate:modelValue":s[5]||(s[5]=u=>t.user.email=u),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(C=t.error)!=null&&C.email?(i(),r("div",he,o(t.error.email[0]),1)):d("",!0)]),l("div",fe,[l("label",_e,o(e.$t("title")),1),a(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:t.user.title,"onUpdate:modelValue":s[6]||(s[6]=u=>t.user.title=u),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(S=t.error)!=null&&S.title?(i(),r("div",ge,o(t.error.title[0]),1)):d("",!0)]),l("div",ye,[l("label",ve,o(e.$t("password")),1),a(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:t.user.password,"onUpdate:modelValue":s[7]||(s[7]=u=>t.user.password=u),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(I=t.error)!=null&&I.password?(i(),r("div",be,o(t.error.password[0]),1)):d("",!0)]),l("div",xe,[l("label",ke,o(e.$t("roles")),1),a(w,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:t.user.role,"onUpdate:modelValue":s[8]||(s[8]=u=>t.user.role=u),"option-value":"id",filter:"",options:t.roles,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(U=t.error)!=null&&U.role?(i(),r("div",we,o(t.error.role[0]),1)):d("",!0)]),l("div",Ve,[l("label",qe,o(e.$t("personal_image")),1),a(f,{name:"file",ref:"file",onChange:h.uploadFile,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,8,["onChange"]),(B=t.error)!=null&&B.image?(i(),r("div",De,o(t.error.image[0]),1)):d("",!0)]),l("div",Ce,[a(_,{onClick:h.editesuser,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["onClick","label"])])])]}),_:1},8,["header"]),a(x,{header:e.$t("Consultations_evaluations")},{default:m(()=>[l("div",null,[a(T,null,{default:m(()=>[l("div",Se,[(i(!0),r(j,null,z(t.user.evaluation_requests,n=>{var g,y;return i(),r("div",Ie,[l("div",Ue,[l("div",Be,[l("h3",Te,o(e.$t("اسم التقييم"))+" :",1),n.evaluation_type==2?(i(),r("p",Ee,"milestone")):d("",!0),n.evaluation_type==1?(i(),r("p",Fe,"side profile")):d("",!0),n.evaluation_type==3?(i(),r("p",Le,"Barrier")):d("",!0),n.evaluation_type==4?(i(),r("p",Ne,"ablls")):d("",!0),n.evaluation_type==5?(i(),r("p",Me,"carolina")):d("",!0)]),l("div",Ae,[l("h3",Pe,o(e.$t("تاريخ التقييم"))+" :",1),l("p",ze,o(n.date),1)]),l("div",Re,[l("h3",je,o(e.$t("اسم المقييم"))+" :",1),l("p",Xe,o((g=n.specialist)==null?void 0:g.name),1)]),l("div",Ye,[l("h3",Ge,o(e.$t("child_name"))+" :",1),l("p",He,o((y=n.child)==null?void 0:y.name),1)])]),l("div",Je,[a(_,{onClick:v=>h.go_evaluate(n.child.id,n.evaluation_type),class:"details m-auto"},{default:m(()=>[R(o(e.$t("strart_evaluate")),1)]),_:2},1032,["onClick"]),a(_,{icon:"pi pi-trash",onClick:v=>h.deleteevalution(n.id),class:"delete m-auto"},null,8,["onClick"])])])}),256))])]),_:1}),l("div",null,[a(E,{visible:t.deleteDialog,"onUpdate:visible":s[10]||(s[10]=n=>t.deleteDialog=n),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:m(()=>[a(_,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:s[9]||(s[9]=n=>t.deleteDialog=!1)},null,8,["label"]),a(_,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:h.deleteAction},null,8,["label","onClick"])]),default:m(()=>[l("div",Ke,[Oe,l("span",null,o(e.$t("هل انت متاكد من ازالة هذا العنصر"))+" >?",1)])]),_:1},8,["visible","header"])]),a(F)])]),_:1},8,["header"]),a(x,{header:e.$t("children")},{default:m(()=>[Qe]),_:1},8,["header"])]),_:1},8,["activeIndex"])]),_:1})}const et=N(G,[["render",We]]);export{et as default};
