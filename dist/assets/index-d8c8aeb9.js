import{_ as M,c as d,r as u,o,d as r,f as c,w as T,e as l,x as E,V as P,g as n,E as A,t as i,N as L,F as p,B as g,X as z,O,P as X}from"./main-fc77a027.js";import{h as Y}from"./moment-fbc5633a.js";import{E as j}from"./EvaluationType-f19713e6.js";const G={components:{EvaluationType:j},data(){return{alert_text:"",answers:[],change:{status:"1"},alltypes:[],strart_evaluate:!1,answer:{color:"00a2ff"},score:[],allquestion:[],childs:{},qustions:{},error:{},maxDate:new Date,notanswer:[]}},methods:{Therapeutic(){this.$router.push({name:"answer"})},createevalutae(e){console.log(e),d.post("api/evaluations/create",{type:3,title:this.answer.title,child_id:this.answer.child_id,specialist_id:localStorage.getItem("user_id"),date:this.answer.date}).then(s=>{this.answer.evaluation_id=s.data.evaluation.id,this.strart_evaluate=!this.strart_evaluate}).catch(s=>{console.log(s.response.data),this.error=s.response.data.errors,console.log(this.error)})},submit(){},anserdata(e,s){console.log(e),console.log(s)},getcolor(e){this.answer.color=e.target.value},getscore(e,s,f,w){this.score[e]={subtest_id:f,question_id:s,question_index:w},console.log(this.score)},getage(){d.post("api/milestone-answers/get-age-child",{date:this.answer.date,child_id:this.answer.child_id}).then(e=>{this.answer.child_age=e.data})},getallquestion(){d.get("api/barrier-subtest").then(e=>{console.log(e.data.data),this.allquestion=e.data.data})},getalltypeanswer(){d.get("api/barrier-answer-type").then(e=>{console.log(e.data.data),this.alltypes=e.data.data})},pushanser(e,s){console.log(s,e),this.answer.date=Y(this.answer.date).format("Y-MM-DD"),console.log(this.answers)},getanswer(){this.answer.scores=this.score,d.post("/api/barrier-answer",this.answer).then(e=>{d.post(`/api/evaluation-request/change-status/${localStorage.getItem("eavl_id")}`,this.change),this.$router.push({name:"barrier-resulte",params:{id:this.answer.child_id}})}).catch(e=>{this.alert_text="please answer all questions",setTimeout(()=>{this.alert_text=""},2500)})},getusers(){d.get("api/child").then(e=>{this.childs=e.data.children,this.answer.child_id=parseInt(localStorage.getItem("child_id"))}),d.get("api/mileston-levels").then(e=>{console.log(e.data.data),this.qustions=e.data.data})},createtreatment(){d.post("api/barrier-question/check/answers",{child_id:this.answer.child_id,level_id:this.answer.level_id}).then(e=>{console.log(e.data.data),this.notanswer=e.data.data,this.notanswer==""&&this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.getusers(),this.getallquestion(),this.getalltypeanswer()}},I=e=>(O("data-v-90f91fe6"),e=e(),X(),e),H=I(()=>l("div",null,null,-1)),J={class:"flex flex-column gap-2"},K={for:"username"},Q={key:0,class:"mt-1 mb-5 text-red-500"},R={class:"flex flex-column gap-2"},W={for:"username"},Z={key:0,class:"mt-1 mb-5 text-red-500"},$={key:0,class:"flex flex-column gap-2"},ee={for:"username"},te={key:0,class:"mt-1 mb-5 text-red-500"},se={key:1,class:"flex flex-column gap-2"},le={for:"username"},oe={key:0,class:"mt-1 mb-5 text-red-500"},ae={key:2,class:"flex flex-column gap-2"},re={for:"username"},ie={class:"flex"},ne={key:0,class:"mt-1 mb-5 text-red-500"},de={class:"col-span-2"},ce={class:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"},ue=["href"],he={class:"col-span-2 flex flex-column gap-2"},_e=["id"],me={style:{border:"1px solid black","border-radius":"5px"}},pe={class:"flex"},ge=["onChange","name","value"],fe={class:"py-1"},we={key:1,class:"mt-1 mb-5 text-red-500"},ve={class:"flex flex-column gap-2 w-full"},be={style:{visibility:"hidden"},for:"username"},ye=I(()=>l("small",{id:"username-help"},null,-1));function xe(e,s,f,w,t,h){const C=u("InputText"),S=u("Dropdown"),B=u("Calendar"),N=u("InputNumber"),U=u("ColorPicker"),v=u("Button"),F=u("toast");return o(),r(p,null,[H,c(z,null,{default:T(()=>{var b,y,x,k,V,q;return[l("div",null,[t.alert_text?(o(),E(P,{key:0,title:"Alert title",text:t.alert_text,closable:"",type:"error",class:"absolute w-full"},null,8,["text"])):n("",!0),l("form",{style:{"max-height":"80vh","overflow-y":"scroll"},"fast-fail":"",ref:"form",onSubmit:s[5]||(s[5]=A((...a)=>h.getanswer&&h.getanswer(...a),["prevent"])),class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"},[l("div",J,[l("label",K,i(e.$t("evaluation_name")),1),c(C,{required:"",class:"bg-[#f7f5f5]",modelValue:t.answer.title,"onUpdate:modelValue":s[0]||(s[0]=a=>t.answer.title=a),placeholder:e.$t("evaluation_name")},null,8,["modelValue","placeholder"]),(b=t.error)!=null&&b.title?(o(),r("div",Q,i(t.error.title[0]),1)):n("",!0)]),l("div",R,[l("label",W,i(e.$t("child_name")),1),c(S,{filter:"",required:"",id:"pv_id_1",disabled:"",style:{direction:"ltr !important"},modelValue:t.answer.child_id,"onUpdate:modelValue":s[1]||(s[1]=a=>t.answer.child_id=a),"option-value":"id",options:t.childs,optionLabel:"name",placeholder:e.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(y=t.error)!=null&&y.child_id?(o(),r("div",Z,i(t.error.child_id[0]),1)):n("",!0)]),t.answer.child_id?(o(),r("div",$,[l("label",ee,i(e.$t("date")),1),c(B,{"onUpdate:modelValue":[h.getage,s[2]||(s[2]=a=>t.answer.date=a)],style:{width:"100%"},showButtonBar:"",modelValue:t.answer.date,modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("date"),minDate:t.maxDate},null,8,["onUpdate:modelValue","modelValue","placeholder","minDate"]),(x=t.error)!=null&&x.child_age?(o(),r("div",te,i(t.error.child_age[0]),1)):n("",!0)])):n("",!0),t.answer.date?(o(),r("div",se,[l("label",le,i(e.$t("age")),1),c(N,{readonly:"",required:"",class:"bg-[#f7f5f5]",modelValue:t.answer.child_age,"onUpdate:modelValue":s[3]||(s[3]=a=>t.answer.child_age=a),placeholder:e.$t("age")},null,8,["modelValue","placeholder"]),(k=t.error)!=null&&k.child_age?(o(),r("div",oe,i(t.error.child_age[0]),1)):n("",!0)])):n("",!0),t.answer.child_id?(o(),r("div",ae,[l("label",re,i(e.$t("color")),1),l("div",ie,[c(U,{style:L({"background-color":"#"+t.answer.color}),class:"w-full h-[50px]",modelValue:t.answer.color,"onUpdate:modelValue":s[4]||(s[4]=a=>t.answer.color=a)},null,8,["style","modelValue"]),c(v,{onClick:h.createevalutae,class:"create m-auto w-full h-[50px]",label:e.$t("strart_evaluate")},null,8,["onClick","label"])]),(V=t.error)!=null&&V.color?(o(),r("div",ne,i(t.error.color[0]),1)):n("",!0)])):n("",!0),l("div",de,[l("div",ce,[t.strart_evaluate?(o(!0),r(p,{key:0},g(t.allquestion,(a,_)=>(o(),r("a",{style:{color:"blue"},href:"#"+_},i(a.title.substring(0,30)+"..."),9,ue))),256)):n("",!0)]),t.strart_evaluate?(o(!0),r(p,{key:0},g(t.allquestion,(a,_)=>(o(),r("div",he,[l("a",{id:_,class:"text-[black] font-bold"},i(a.title),9,_e),l("div",me,[(o(!0),r(p,null,g(a.barriers_questiont,(m,D)=>(o(),r("div",{style:{"border-radius":"5px",padding:"1%"},class:"my-2",key:D},[l("div",pe,[l("input",{onChange:ke=>h.getscore(_,m.id,m.subtest_id,m.index),type:"radio",style:{border:"1px solid black"},class:"p-1 mx-2 my-auto",name:_,value:D},null,40,ge),l("p",fe,i(m.title)+":",1)])]))),128))])]))),256)):n("",!0),(q=t.error)!=null&&q.scores?(o(),r("div",we,i(t.error.scores[0]),1)):n("",!0)]),l("div",ve,[l("label",be,i(e.$t("gruop_sessaion")),1),c(v,{type:"submit",class:"create m-auto w-full",label:e.$t("submit")},null,8,["label"]),ye])],544),c(F)])]}),_:1})],64)}const Ie=M(G,[["render",xe],["__scopeId","data-v-90f91fe6"]]);export{Ie as default};
