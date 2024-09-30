import{_ as T,c,D as E,r as u,o,d as a,f as d,w as D,e as l,x as P,V as z,g as n,E as A,t as r,P as L,F as p,z as g,X as Q,Q as R,R as X}from"./main-a8302db8.js";import{E as Y}from"./EvaluationType-1db735df.js";import{V as j}from"./VForm-d3935222.js";const G={components:{EvaluationType:Y},data(){return{alert_text:"",answers:[],change:{status:"1"},alltypes:[],strart_evaluate:!1,answer:{color:"00a2ff"},score:[],allquestion:[],childs:{},qustions:{},error:{},maxDate:new Date,notanswer:[]}},methods:{Therapeutic(){this.$router.push({name:"answer"})},createevalutae(e){console.log(e),c.post("api/evaluations/create",{type:3,title:this.answer.title,child_id:this.answer.child_id,specialist_id:localStorage.getItem("user_id"),date:this.answer.date,stimulus_test_id:parseInt(this.$route.params.id)}).then(s=>{this.answer.evaluation_id=s.data.evaluation.id,this.strart_evaluate=!this.strart_evaluate}).catch(s=>{console.log(s.response.data),this.error=s.response.data.errors,console.log(this.error)})},submit(){},anserdata(e,s){console.log(e),console.log(s)},getcolor(e){this.answer.color=e.target.value},getscore(e,s,f,w){this.score[e]={subtest_id:f,question_id:s,question_index:w},console.log(this.score)},getage(){c.post("api/milestone-answers/get-age-child",{date:this.answer.date,child_id:this.answer.child_id}).then(e=>{this.answer.child_age=e.data})},getallquestion(){c.get("api/barrier-subtest").then(e=>{console.log(e.data.data),this.allquestion=e.data.data})},getalltypeanswer(){c.get("api/barrier-answer-type").then(e=>{console.log(e.data.data),this.alltypes=e.data.data})},pushanser(e,s){console.log(s,e),this.answer.date=E(this.answer.date).format("Y-MM-DD"),console.log(this.answers)},getanswer(){this.answer.scores=this.score,c.post("/api/barrier-answer",this.answer).then(e=>{c.post(`/api/evaluation-request/change-status/${localStorage.getItem("eavl_id")}`,this.change),this.$router.push({name:"barrier-resulte",params:{id:this.answer.child_id}})}).catch(e=>{this.alert_text="please answer all questions",setTimeout(()=>{this.alert_text=""},2500)})},getusers(){c.get("api/child").then(e=>{this.childs=e.data.children,this.answer.child_id=parseInt(localStorage.getItem("child_id"))}),c.get("api/mileston-levels").then(e=>{console.log(e.data.data),this.qustions=e.data.data})},createtreatment(){c.post("api/barrier-question/check/answers",{child_id:this.answer.child_id,level_id:this.answer.level_id}).then(e=>{console.log(e.data.data),this.notanswer=e.data.data,this.notanswer==""&&this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.getusers(),this.getallquestion(),this.getalltypeanswer()}},I=e=>(R("data-v-cd6ef7f4"),e=e(),X(),e),H=I(()=>l("div",null,null,-1)),J={class:"flex flex-column gap-2"},K={for:"username"},O={key:0,class:"mt-1 mb-5 text-red-500"},W={class:"flex flex-column gap-2"},Z={for:"username"},$={key:0,class:"mt-1 mb-5 text-red-500"},ee={key:0,class:"flex flex-column gap-2"},te={for:"username"},se={key:0,class:"mt-1 mb-5 text-red-500"},le={key:1,class:"flex flex-column gap-2"},oe={for:"username"},ae={key:0,class:"mt-1 mb-5 text-red-500"},re={key:2,class:"flex flex-column gap-2"},ie={for:"username"},ne={class:"flex"},de={key:0,class:"mt-1 mb-5 text-red-500"},ce={class:"col-span-2"},ue={class:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"},he=["href"],_e={class:"col-span-2 flex flex-column gap-2"},me=["id"],pe={style:{border:"1px solid black","border-radius":"5px"}},ge={class:"flex"},fe=["onChange","name","value"],we={class:"py-1"},ve={key:1,class:"mt-1 mb-5 text-red-500"},be={class:"flex flex-column gap-2 w-full"},ye={style:{visibility:"hidden"},for:"username"},xe=I(()=>l("small",{id:"username-help"},null,-1));function ke(e,s,f,w,t,h){const S=u("InputText"),B=u("Dropdown"),F=u("Calendar"),U=u("InputNumber"),M=u("ColorPicker"),v=u("Button"),N=u("toast");return o(),a(p,null,[H,d(Q,null,{default:D(()=>[l("div",null,[t.alert_text?(o(),P(z,{key:0,title:"Alert title",text:t.alert_text,closable:"",type:"error",class:"absolute w-full"},null,8,["text"])):n("",!0),d(j,{style:{"max-height":"80vh","overflow-y":"scroll"},"fast-fail":"",ref:"form",onSubmit:A(h.submit,["prevent"]),class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"},{default:D(()=>{var b,y,x,k,V,q;return[l("div",J,[l("label",K,r(e.$t("evaluation_name")),1),d(S,{required:"",class:"bg-[#f7f5f5]",modelValue:t.answer.title,"onUpdate:modelValue":s[0]||(s[0]=i=>t.answer.title=i),placeholder:e.$t("evaluation_name")},null,8,["modelValue","placeholder"]),(b=t.error)!=null&&b.title?(o(),a("div",O,r(t.error.title[0]),1)):n("",!0)]),l("div",W,[l("label",Z,r(e.$t("child_name")),1),d(B,{filter:"",required:"",id:"pv_id_1",disabled:"",style:{direction:"ltr !important"},modelValue:t.answer.child_id,"onUpdate:modelValue":s[1]||(s[1]=i=>t.answer.child_id=i),"option-value":"id",options:t.childs,optionLabel:"name",placeholder:e.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(y=t.error)!=null&&y.child_id?(o(),a("div",$,r(t.error.child_id[0]),1)):n("",!0)]),t.answer.child_id?(o(),a("div",ee,[l("label",te,r(e.$t("date")),1),d(F,{"onUpdate:modelValue":[h.getage,s[2]||(s[2]=i=>t.answer.date=i)],style:{width:"100%"},showButtonBar:"",modelValue:t.answer.date,modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("date"),minDate:t.maxDate},null,8,["onUpdate:modelValue","modelValue","placeholder","minDate"]),(x=t.error)!=null&&x.child_age?(o(),a("div",se,r(t.error.child_age[0]),1)):n("",!0)])):n("",!0),t.answer.date?(o(),a("div",le,[l("label",oe,r(e.$t("age")),1),d(U,{readonly:"",required:"",class:"bg-[#f7f5f5]",modelValue:t.answer.child_age,"onUpdate:modelValue":s[3]||(s[3]=i=>t.answer.child_age=i),placeholder:e.$t("age")},null,8,["modelValue","placeholder"]),(k=t.error)!=null&&k.child_age?(o(),a("div",ae,r(t.error.child_age[0]),1)):n("",!0)])):n("",!0),t.answer.child_id?(o(),a("div",re,[l("label",ie,r(e.$t("color")),1),l("div",ne,[d(M,{style:L({"background-color":"#"+t.answer.color}),class:"w-full h-[50px]",modelValue:t.answer.color,"onUpdate:modelValue":s[4]||(s[4]=i=>t.answer.color=i)},null,8,["style","modelValue"]),d(v,{onClick:h.createevalutae,class:"create m-auto w-full h-[50px]",label:e.$t("strart_evaluate")},null,8,["onClick","label"])]),(V=t.error)!=null&&V.color?(o(),a("div",de,r(t.error.color[0]),1)):n("",!0)])):n("",!0),l("div",ce,[l("div",ue,[t.strart_evaluate?(o(!0),a(p,{key:0},g(t.allquestion,(i,_)=>(o(),a("a",{style:{color:"blue"},href:"#"+_},r(i.title.substring(0,30)+"..."),9,he))),256)):n("",!0)]),t.strart_evaluate?(o(!0),a(p,{key:0},g(t.allquestion,(i,_)=>(o(),a("div",_e,[l("a",{id:_,class:"text-[black] font-bold"},r(i.title),9,me),l("div",pe,[(o(!0),a(p,null,g(i.barriers_questiont,(m,C)=>(o(),a("div",{style:{"border-radius":"5px",padding:"1%"},class:"my-2",key:C},[l("div",ge,[l("input",{onChange:Ve=>h.getscore(_,m.id,m.subtest_id,m.index),type:"radio",style:{border:"1px solid black"},class:"p-1 mx-2 my-auto",name:_,value:C},null,40,fe),l("p",we,r(m.title)+":",1)])]))),128))])]))),256)):n("",!0),(q=t.error)!=null&&q.scores?(o(),a("div",ve,r(t.error.scores[0]),1)):n("",!0)]),l("div",be,[l("label",ye,r(e.$t("gruop_sessaion")),1),d(v,{onClick:h.getanswer,class:"create m-auto w-full",label:e.$t("submit")},null,8,["onClick","label"]),xe])]}),_:1},8,["onSubmit"]),d(N)])]),_:1})],64)}const Ie=T(G,[["render",ke],["__scopeId","data-v-cd6ef7f4"]]);export{Ie as default};