import{_ as z,c,r as u,o as l,d as r,f as d,w as S,x as A,V as P,g as i,e as a,D as K,t as n,K as O,F as _,z as w,h as q,T as j,L as G,O as H}from"./main-f9d3afa8.js";import{E as J}from"./EvaluationType-96d1a789.js";const Q={components:{EvaluationType:J},data(){return{change:{status:"1"},strart_evaluate:!1,alert_text:"",answers:{answers:[]},type:5,allanswer:{},answer:{color:"00a2ff"},allquestion:[],childs:{},category:{},error:{},maxDate:new Date,notanswer:[]}},methods:{Therapeutic(){this.$router.push({name:"answer"})},getanswerscore(e,s,f){this.answers.answers[s]={answer_type_id:f,test_id:s,color:this.answer.color,child_id:this.answer.child_id,date:this.answer.date,child_age:this.answer.child_age,evaluation_id:this.answer.evaluation_id},console.log(this.answers.answers)},createevalutae(e){console.log(e),c.post("api/evaluations/create",{type:this.type,title:this.answer.title,child_id:this.answer.child_id,specialist_id:localStorage.getItem("user_id"),date:this.answer.date}).then(s=>{this.answer.evaluation_id=s.data.evaluation.id,this.strart_evaluate=!this.strart_evaluate})},anserdata(e,s){console.log(e),console.log(s)},getcolor(e){this.answer.color=e.target.value},getquation(e){c.get(`api/mileston-levels/get-all-by-subtest/${e}`).then(s=>{console.log(s.data[0].subtests),this.allquestion=s.data[0].subtests})},getall(){c.get("api/carolina-answer-type").then(e=>{this.allanswer=e.data.data})},getage(){c.post("api/milestone-answers/get-age-child",{date:this.answer.date,child_id:this.answer.child_id}).then(e=>{this.answer.child_age=e.data})},getanswer(e,s,f){c.post("/api/carolina-answer",this.answers).then(v=>{c.post(`/api/evaluation-request/change-status/${localStorage.getItem("eavl_id")}`,this.change),this.$router.push({name:"carolina-resulte",params:{id:this.answer.evaluation_id}})}).catch(v=>{this.alert_text="please answer all questions",setTimeout(()=>{this.alert_text=""},2500)})},getusers(){c.get("api/child").then(e=>{this.childs=e.data.children,this.answer.child_id=parseInt(localStorage.getItem("child_id")),this.answer.evaluation_id=parseInt(this.$route.params.evaluation)}),c.get("api/carolina-category/list/tests").then(e=>{console.log(e.data.data),this.category=e.data.data})},createtreatment(){c.post("/api/milestone-answers/check/answers",{child_id:this.answer.child_id,level_id:this.answer.level_id}).then(e=>{console.log(e.data.data),this.notanswer=e.data.data,this.notanswer==""&&this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.getusers(),this.getall()}},T=e=>(G("data-v-a76a0565"),e=e(),H(),e),R=T(()=>a("div",null,null,-1)),W={class:"flex flex-column gap-2"},X={for:"username"},Y={key:0,class:"mt-1 mb-5 text-red-500"},Z={class:"flex flex-column gap-2"},$={for:"username"},ee={key:0,class:"mt-1 mb-5 text-red-500"},te={key:0,class:"flex flex-column gap-2"},se={for:"username"},le={key:0,class:"mt-1 mb-5 text-red-500"},ae={key:1,class:"flex flex-column gap-2"},oe={for:"username"},re={key:0,class:"mt-1 mb-5 text-red-500"},ne={key:2,class:"flex flex-column gap-2"},ie={for:"username"},de={class:"flex"},ce={key:0,class:"mt-1 mb-5 text-red-500"},ue={class:"col-span-2 flex flex-column gap-2"},he={class:"text-[black] font-bold"},_e={style:{border:"1px solid black","border-radius":"5px",padding:"1%"}},pe={style:{"border-bottom":"1px solid black !important"},class:"py-1 text-[black] font-bold",for:"username"},me={class:""},ge={class:"flex"},we=["onChange","name"],fe={key:4,class:"flex flex-column gap-2 w-full"},ve={style:{visibility:"hidden"},for:"username"},be=T(()=>a("small",{id:"username-help"},null,-1));function ye(e,s,f,v,t,h){const B=u("InputText"),N=u("Dropdown"),U=u("Calendar"),F=u("InputNumber"),E=u("ColorPicker"),b=u("Button"),L=u("sapn"),M=u("toast");return l(),r(_,null,[R,d(j,null,{default:S(()=>{var y,x,k,V,I;return[t.alert_text?(l(),A(P,{key:0,title:"Alert title",text:t.alert_text,closable:"",type:"error",class:"absolute w-full"},null,8,["text"])):i("",!0),a("div",null,[a("form",{style:{"max-height":"80vh","overflow-y":"scroll"},"fast-fail":"",ref:"form",onSubmit:s[5]||(s[5]=K((...o)=>h.getanswer&&h.getanswer(...o),["prevent"])),class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"},[a("div",W,[a("label",X,n(e.$t("evaluation_name")),1),d(B,{required:"",class:"bg-[#f7f5f5]",modelValue:t.answer.title,"onUpdate:modelValue":s[0]||(s[0]=o=>t.answer.title=o),placeholder:e.$t("evaluation_name")},null,8,["modelValue","placeholder"]),(y=t.error)!=null&&y.title?(l(),r("div",Y,n(t.error.title[0]),1)):i("",!0)]),a("div",Z,[a("label",$,n(e.$t("child_name")),1),d(N,{disabled:"",filter:"",required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.answer.child_id,"onUpdate:modelValue":s[1]||(s[1]=o=>t.answer.child_id=o),"option-value":"id",options:t.childs,optionLabel:"name",placeholder:e.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(x=t.error)!=null&&x.child_id?(l(),r("div",ee,n(t.error.child_id[0]),1)):i("",!0)]),t.answer.child_id?(l(),r("div",te,[a("label",se,n(e.$t("date")),1),d(U,{"onUpdate:modelValue":[h.getage,s[2]||(s[2]=o=>t.answer.date=o)],style:{width:"100%"},showButtonBar:"",modelValue:t.answer.date,modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("date"),minDate:t.maxDate},null,8,["onUpdate:modelValue","modelValue","placeholder","minDate"]),(k=t.error)!=null&&k.child_age?(l(),r("div",le,n(t.error.child_age[0]),1)):i("",!0)])):i("",!0),t.answer.date?(l(),r("div",ae,[a("label",oe,n(e.$t("age")),1),d(F,{readonly:"",required:"",class:"bg-[#f7f5f5]",modelValue:t.answer.child_age,"onUpdate:modelValue":s[3]||(s[3]=o=>t.answer.child_age=o),placeholder:e.$t("age")},null,8,["modelValue","placeholder"]),(V=t.error)!=null&&V.child_age?(l(),r("div",re,n(t.error.child_age[0]),1)):i("",!0)])):i("",!0),t.answer.child_id&&t.answer.child_age?(l(),r("div",ne,[a("label",ie,n(e.$t("color")),1),a("div",de,[d(E,{style:O({"background-color":"#"+t.answer.color}),class:"w-full h-[50px]",modelValue:t.answer.color,"onUpdate:modelValue":s[4]||(s[4]=o=>t.answer.color=o)},null,8,["style","modelValue"]),d(b,{onClick:h.createevalutae,class:"create m-auto w-full h-[50px]",label:e.$t("strart_evaluate")},null,8,["onClick","label"])]),(I=t.error)!=null&&I.color?(l(),r("div",ce,n(t.error.color[0]),1)):i("",!0)])):i("",!0),t.strart_evaluate?(l(!0),r(_,{key:3},w(t.category,(o,xe)=>(l(),r("div",ue,[a("h1",he,n(o.title),1),a("div",_e,[(l(!0),r(_,null,w(o.tests,(ke,p)=>{var C,D;return l(),r("div",null,[a("h2",pe,n((C=o.tests[p])==null?void 0:C.skill),1),(l(!0),r(_,null,w((D=o.tests[p])==null?void 0:D.goals,(m,g)=>(l(),r("div",{style:{"border-radius":"5px",padding:"1%"},class:"",key:g},[a("p",me,n(g+1)+" - "+n(m.body)+":",1)]))),128)),a("div",ge,[(l(!0),r(_,null,w(t.allanswer,m=>(l(),r("div",null,[a("input",{required:"",onChange:g=>h.getanswerscore(g,o.tests[p].id,m.id),style:{border:"1px solid black"},class:"mx-2",name:o.tests[p].id,type:"radio",value:"0"},null,40,we),q("   "),d(L,{for:"html"},{default:S(()=>[q(n(m.name),1)]),_:2},1024)]))),256))])])}),256))])]))),256)):i("",!0),t.strart_evaluate?(l(),r("div",fe,[a("label",ve,n(e.$t("gruop_sessaion")),1),d(b,{type:"submit",class:"create m-auto w-full",label:e.$t("submit")},null,8,["label"]),be])):i("",!0)],544),d(M)])]}),_:1})],64)}const Ce=z(Q,[["render",ye],["__scopeId","data-v-a76a0565"]]);export{Ce as default};
