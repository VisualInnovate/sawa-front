import{_ as F,c,r as u,o as a,d as r,f as n,w as V,e as l,E as U,t as i,g as d,P as N,F as _,z as g,X as E,Q as M,R as T}from"./main-e06dad9b.js";import{E as P}from"./EvaluationType-60316af3.js";import{V as z}from"./VForm-39e78798.js";const L={components:{EvaluationType:P},data(){return{answers:[],alltypes:[],strart_evaluate:!1,answer:{color:"00a2ff"},score:"",allquestion:[],childs:{},qustions:{},error:{},maxDate:new Date,notanswer:[]}},methods:{Therapeutic(){this.$router.push({name:"answer"})},createevalutae(e){console.log(e),c.post("api/evaluations/create",{type:3,title:this.answer.title,child_id:this.answer.child_id,specialist_id:localStorage.getItem("user_id"),date:this.answer.date}).then(s=>{this.answer.evaluation_id=s.data.evaluation.id,this.strart_evaluate=!this.strart_evaluate})},submit(){},anserdata(e,s){console.log(e),console.log(s)},getcolor(e){this.answer.color=e.target.value},getscore(e){this.score=e},getage(){c.post("api/milestone-answers/get-age-child",{date:this.answer.date,child_id:this.answer.child_id}).then(e=>{this.answer.child_age=e.data})},getallquestion(){c.get("api/barrier-subtest").then(e=>{console.log(e.data.data),this.allquestion=e.data.data})},getalltypeanswer(){c.get("api/barrier-answer-type").then(e=>{console.log(e.data.data),this.alltypes=e.data.data})},getanswer(e){this.answer.subtest_id=e,this.answer.score=this.score,c.post("/api/barrier-answer",this.answer).then(s=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(s=>{console.log(s.response.data.errors.name),this.error=s.response.data.errors})},getusers(){c.get("api/child").then(e=>{this.childs=e.data.children,this.answer.child_id=parseInt(this.$route.params.id),this.answer.evaluation_id=parseInt(this.$route.params.evaluation)}),c.get("api/mileston-levels").then(e=>{console.log(e.data.data),this.qustions=e.data.data})},createtreatment(){c.post("api/barrier-question/check/answers",{child_id:this.answer.child_id,level_id:this.answer.level_id}).then(e=>{console.log(e.data.data),this.notanswer=e.data.data,this.notanswer==""&&this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.getusers(),this.getallquestion(),this.getalltypeanswer()}},Q=e=>(M("data-v-e6f2fa2e"),e=e(),T(),e),R=Q(()=>l("div",null,null,-1)),X={class:"flex flex-column gap-2"},j={for:"username"},A={key:0,class:"mt-1 mb-5 text-red-500"},G={class:"flex flex-column gap-2"},H={for:"username"},J={key:0,class:"mt-1 mb-5 text-red-500"},K={key:0,class:"flex flex-column gap-2"},O={for:"username"},W={key:0,class:"mt-1 mb-5 text-red-500"},Y={key:1,class:"flex flex-column gap-2"},Z={for:"username"},$={key:0,class:"mt-1 mb-5 text-red-500"},ee={key:2,class:"flex flex-column gap-2"},te={for:"username"},se={class:"flex"},le={key:0,class:"mt-1 mb-5 text-red-500"},oe={class:"col-span-2"},ae={class:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"},re=["href"],ie={class:"col-span-2 flex flex-column gap-2"},ne=["id"],de={style:{border:"1px solid black","border-radius":"5px"}},ce={class:"flex"},ue=["onChange","value"],he={class:"py-1"},_e={class:"w-full text-center"};function me(e,s,pe,ge,t,h){const C=u("InputText"),q=u("Dropdown"),I=u("Calendar"),S=u("InputNumber"),D=u("ColorPicker"),f=u("Button"),B=u("toast");return a(),r(_,null,[R,n(E,null,{default:V(()=>[l("div",null,[n(z,{style:{"max-height":"80vh","overflow-y":"scroll"},"fast-fail":"",ref:"form",onSubmit:U(h.submit,["prevent"]),class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"},{default:V(()=>{var w,v,b,y,x;return[l("div",X,[l("label",j,i(e.$t("evaluation_name")),1),n(C,{required:"",class:"bg-[#f7f5f5]",modelValue:t.answer.title,"onUpdate:modelValue":s[0]||(s[0]=o=>t.answer.title=o),placeholder:e.$t("evaluation_name")},null,8,["modelValue","placeholder"]),(w=t.error)!=null&&w.title?(a(),r("div",A,i(t.error.title[0]),1)):d("",!0)]),l("div",G,[l("label",H,i(e.$t("child_name")),1),n(q,{filter:"",required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.answer.child_id,"onUpdate:modelValue":s[1]||(s[1]=o=>t.answer.child_id=o),"option-value":"id",options:t.childs,optionLabel:"name",placeholder:e.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(v=t.error)!=null&&v.child_id?(a(),r("div",J,i(t.error.child_id[0]),1)):d("",!0)]),t.answer.child_id?(a(),r("div",K,[l("label",O,i(e.$t("date")),1),n(I,{"onUpdate:modelValue":[h.getage,s[2]||(s[2]=o=>t.answer.date=o)],style:{width:"100%"},showButtonBar:"",modelValue:t.answer.date,modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("date"),maxDate:t.maxDate},null,8,["onUpdate:modelValue","modelValue","placeholder","maxDate"]),(b=t.error)!=null&&b.child_age?(a(),r("div",W,i(t.error.child_age[0]),1)):d("",!0)])):d("",!0),t.answer.date?(a(),r("div",Y,[l("label",Z,i(e.$t("age")),1),n(S,{readonly:"",required:"",class:"bg-[#f7f5f5]",modelValue:t.answer.child_age,"onUpdate:modelValue":s[3]||(s[3]=o=>t.answer.child_age=o),placeholder:e.$t("age")},null,8,["modelValue","placeholder"]),(y=t.error)!=null&&y.child_age?(a(),r("div",$,i(t.error.child_age[0]),1)):d("",!0)])):d("",!0),t.answer.child_id?(a(),r("div",ee,[l("label",te,i(e.$t("color")),1),l("div",se,[n(D,{style:N({"background-color":"#"+t.answer.color}),class:"w-full h-[50px]",modelValue:t.answer.color,"onUpdate:modelValue":s[4]||(s[4]=o=>t.answer.color=o)},null,8,["style","modelValue"]),n(f,{onClick:h.createevalutae,class:"create m-auto w-full h-[50px]",label:e.$t("strart_evaluate")},null,8,["onClick","label"])]),(x=t.error)!=null&&x.color?(a(),r("div",le,i(t.error.color[0]),1)):d("",!0)])):d("",!0),l("div",oe,[l("div",ae,[t.strart_evaluate?(a(!0),r(_,{key:0},g(t.allquestion,(o,m)=>(a(),r("a",{style:{color:"blue"},href:"#"+m},i(o.title.substring(0,30)+"..."),9,re))),256)):d("",!0)]),t.strart_evaluate?(a(!0),r(_,{key:0},g(t.allquestion,(o,m)=>(a(),r("div",ie,[l("a",{id:m,class:"text-[black] font-bold"},i(o.title),9,ne),l("div",de,[(a(!0),r(_,null,g(o.barriers_questiont,(k,p)=>(a(),r("div",{style:{"border-radius":"5px",padding:"1%"},class:"my-2",key:p},[l("div",ce,[l("input",{onChange:fe=>h.getscore(p),type:"checkbox",style:{border:"1px solid black"},class:"p-1 mx-2 my-auto",value:p+1},null,40,ue),l("p",he,i(k.title)+":",1)])]))),128)),l("div",_e,[n(f,{onClick:k=>h.getanswer(o.id),class:"create lg:w-44 m-auto my-2",label:e.$t("send_answer")},null,8,["onClick","label"])])])]))),256)):d("",!0)])]}),_:1},8,["onSubmit"]),n(B)])]),_:1})],64)}const ye=F(L,[["render",me],["__scopeId","data-v-e6f2fa2e"]]);export{ye as default};
