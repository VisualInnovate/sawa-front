import{_ as N,c as d,r as h,o,d as r,f as c,w as T,e as l,x as U,a1 as F,g as i,a2 as E,t as n,W as z,F as k,z as M,h as p,aa as A,E as L,G as P}from"./main-91c6b099.js";import{E as j}from"./EvaluationType-32fd13dc.js";const G={components:{EvaluationType:j},data(){return{change:{status:"1"},strart_evaluate:!1,alert_text:"",answers:{answers:[]},type:2,answer:{color:"00a2ff"},allquestion:[],childs:{},qustions:{},error:{},maxDate:new Date,notanswer:[]}},methods:{Therapeutic(){this.$router.push({name:"answer"})},submit(){},createevalutae(e){console.log(e),d.post("api/evaluations/create",{type:this.type,title:this.answer.title,child_id:this.answer.child_id,specialist_id:localStorage.getItem("user_id"),date:this.answer.date}).then(s=>{this.answer.evaluation_id=s.data.evaluation.id,this.strart_evaluate=!this.strart_evaluate}).catch(s=>{console.log(s.response.data.errors.name),this.error=s.response.data.errors})},anserdata(e,s){console.log(e),console.log(s)},getcolor(e){this.answer.color=e.target.value},getquation(e){d.get(`api/milestone-answers/question/${localStorage.getItem("child_id")}`).then(s=>{console.log(s.data[0].subtests),this.allquestion=s.data})},getage(){d.post("api/milestone-answers/get-age-child",{date:this.answer.date,child_id:this.answer.child_id}).then(e=>{this.answer.child_age=e.data,d.get(`api/milestone-answers/question/${e.data}`).then(s=>{console.log(s.data[0].subtests),this.allquestion=s.data})})},collectanswer(e,s){this.answers.answers[s]={question_id:s,score:e.target.value,color:this.answer.color,child_id:this.answer.child_id,date:this.answer.date,child_age:this.answer.child_age,evaluation_id:this.answer.evaluation_id},console.log(this.answers.answers)},getanswer(e,s,V){d.post("/api/milestone-answers",this.answers).then(g=>{d.post(`/api/evaluation-request/change-status/${localStorage.getItem("eavl_id")}`,this.change),this.$router.push({name:"milestone-resulte",params:{id:this.answer.child_id,evla_id:this.answer.evaluation_id}})}).catch(g=>{this.alert_text="please answer all questions",setTimeout(()=>{this.alert_text=""},2500)})},getusers(){d.get("api/child").then(e=>{console.log(localStorage.getItem("child_id")),this.childs=e.data.children,this.answer.child_id=parseInt(localStorage.getItem("child_id")),this.answer.evaluation_id=parseInt(this.$route.params.evaluation)}),d.get("api/mileston-levels").then(e=>{console.log(e.data.data),this.qustions=e.data.data})},createtreatment(){d.post("/api/milestone-answers/check/answers",{child_id:this.answer.child_id,level_id:this.answer.level_id}).then(e=>{console.log(e.data.data),this.notanswer=e.data.data,this.notanswer==""&&this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.getusers()}},_=e=>(L("data-v-acf7758e"),e=e(),P(),e),W=_(()=>l("div",null,null,-1)),H={class:"flex flex-column gap-2"},J={for:"username"},K={key:0,class:"mt-1 mb-5 text-red-500"},O={class:"flex flex-column gap-2"},Q={for:"username"},R={key:0,class:"mt-1 mb-5 text-red-500"},X={key:0,class:"flex flex-column gap-2"},Y={for:"username"},Z={key:0,class:"mt-1 mb-5 text-red-500"},$={key:1,class:"flex flex-column gap-2"},ee={for:"username"},te={key:0,class:"mt-1 mb-5 text-red-500"},se={key:2,class:"flex flex-column gap-2"},le={for:"username"},ae={class:"flex"},oe={key:0,class:"mt-1 mb-5 text-red-500"},re={class:"col-span-2 flex flex-column gap-2"},ne={style:{border:"1px solid black","border-radius":"5px",padding:"1%"}},ie={class:"text-[black] font-bold"},de=["onChange","name"],ce=_(()=>l("label",{for:"html"},"0",-1)),ue=_(()=>l("br",null,null,-1)),he=["onChange","name"],_e=_(()=>l("label",{for:"css"},"0.5",-1)),me=_(()=>l("br",null,null,-1)),pe=["onChange","name"],ge=_(()=>l("label",{for:"javascript"},"1",-1)),we={key:4,class:"flex flex-column gap-2 w-full"},fe={style:{visibility:"hidden"},for:"username"},ve=_(()=>l("small",{id:"username-help"},null,-1));function be(e,s,V,g,t,u){const q=h("InputText"),C=h("Dropdown"),I=h("Calendar"),S=h("InputNumber"),D=h("ColorPicker"),w=h("Button"),B=h("toast");return o(),r(k,null,[W,c(A,null,{default:T(()=>{var f,v,b,x,y;return[l("div",null,[t.alert_text?(o(),U(F,{key:0,title:"Alert title",text:t.alert_text,closable:"",type:"error",class:"absolute w-full"},null,8,["text"])):i("",!0),l("form",{style:{"max-height":"80vh","overflow-y":"scroll"},"fast-fail":"",ref:"form",onSubmit:s[5]||(s[5]=E((...a)=>u.getanswer&&u.getanswer(...a),["prevent"])),class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"},[l("div",H,[l("label",J,n(e.$t("evaluation_name")),1),c(q,{required:"",class:"bg-[#f7f5f5]",modelValue:t.answer.title,"onUpdate:modelValue":s[0]||(s[0]=a=>t.answer.title=a),placeholder:e.$t("evaluation_name")},null,8,["modelValue","placeholder"]),(f=t.error)!=null&&f.title?(o(),r("div",K,n(t.error.title[0]),1)):i("",!0)]),l("div",O,[l("label",Q,n(e.$t("child_name")),1),c(C,{filter:"",required:"",id:"pv_id_1",disabled:"",style:{direction:"ltr !important"},modelValue:t.answer.child_id,"onUpdate:modelValue":s[1]||(s[1]=a=>t.answer.child_id=a),"option-value":"id",options:t.childs,optionLabel:"name",placeholder:e.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(v=t.error)!=null&&v.child_id?(o(),r("div",R,n(t.error.child_id[0]),1)):i("",!0)]),t.answer.child_id?(o(),r("div",X,[l("label",Y,n(e.$t("date")),1),c(I,{"onUpdate:modelValue":[u.getage,s[2]||(s[2]=a=>t.answer.date=a)],style:{width:"100%"},showButtonBar:"",modelValue:t.answer.date,modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("date"),minDate:t.maxDate},null,8,["onUpdate:modelValue","modelValue","placeholder","minDate"]),(b=t.error)!=null&&b.child_age?(o(),r("div",Z,n(t.error.child_age[0]),1)):i("",!0)])):i("",!0),t.answer.date?(o(),r("div",$,[l("label",ee,n(e.$t("age")),1),c(S,{readonly:"",required:"",class:"bg-[#f7f5f5]",modelValue:t.answer.child_age,"onUpdate:modelValue":s[3]||(s[3]=a=>t.answer.child_age=a),placeholder:e.$t("age")},null,8,["modelValue","placeholder"]),(x=t.error)!=null&&x.child_age?(o(),r("div",te,n(t.error.child_age[0]),1)):i("",!0)])):i("",!0),t.answer.child_id&&t.answer.child_age?(o(),r("div",se,[l("label",le,n(e.$t("color")),1),l("div",ae,[c(D,{style:z({"background-color":"#"+t.answer.color}),class:"w-full h-[50px]",modelValue:t.answer.color,"onUpdate:modelValue":s[4]||(s[4]=a=>t.answer.color=a)},null,8,["style","modelValue"]),c(w,{onClick:u.createevalutae,class:"create m-auto w-full h-[50px]",label:e.$t("strart_evaluate")},null,8,["onClick","label"])]),(y=t.error)!=null&&y.color?(o(),r("div",oe,n(t.error.color[0]),1)):i("",!0)])):i("",!0),t.strart_evaluate?(o(!0),r(k,{key:3},M(t.allquestion,a=>(o(),r("div",re,[l("div",ne,[l("h1",ie,n(a.title),1),l("div",null,[l("input",{required:"",onChange:m=>u.collectanswer(m,a.id),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:a.id,value:"0"},null,40,de),p("   "),ce,ue,p("   "),l("input",{required:"",onChange:m=>u.collectanswer(m,a.id),style:{border:"1px solid black"},type:"radio",name:a.id,value:".5"},null,40,he),p("   "),_e,me,p("   "),l("input",{required:"",onChange:m=>u.collectanswer(m,a.id),style:{border:"1px solid black"},type:"radio",name:a.id,value:"1"},null,40,pe),p("   "),ge])])]))),256)):i("",!0),t.strart_evaluate?(o(),r("div",we,[l("label",fe,n(e.$t("gruop_sessaion")),1),c(w,{type:"submit",class:"create m-auto w-full",label:e.$t("submit")},null,8,["label"]),ve])):i("",!0)],544),c(B)])]}),_:1})],64)}const ke=N(G,[["render",be],["__scopeId","data-v-acf7758e"]]);export{ke as default};