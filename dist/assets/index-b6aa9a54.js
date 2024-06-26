import{_ as E,c,r as u,o as l,d as o,f as d,w as C,e as t,E as z,t as a,g as i,P as M,F as h,z as g,h as D,X as P,Q as T,R as L}from"./main-bbe3f3fc.js";import{E as Q}from"./EvaluationType-a11b1a96.js";import{V as R}from"./VForm-a6c4cf3d.js";const X={components:{EvaluationType:Q},data(){return{answers:[],alltypes:[],answer:{color:"00a2ff"},allquestion:[],childs:{},qustions:{},error:{},maxDate:new Date,notanswer:[]}},methods:{Therapeutic(){this.$router.push({name:"answer"})},submit(){},anserdata(e,r){console.log(e),console.log(r)},getcolor(e){this.answer.color=e.target.value},getage(){c.post("api/milestone-answers/get-age-child",{date:this.answer.date,child_id:this.answer.child_id}).then(e=>{this.answer.child_age=e.data})},getallquestion(){c.get("api/barrier-subtest").then(e=>{console.log(e.data.data),this.allquestion=e.data.data})},getalltypeanswer(){c.get("api/barrier-answer-type").then(e=>{console.log(e.data.data),this.alltypes=e.data.data})},getanswer(e,r,q){console.log(e.target.value),this.answer.answer_type_id=e.target.value,this.answer.question_id=r,c.post("/api/barrier-answer",this.answer).then(_=>{}).catch(_=>{console.log(_.response.data.errors.name),this.error=_.response.data.errors})},getusers(){c.get("api/child").then(e=>{console.log(e.data.data),this.childs=e.data.children}),c.get("api/mileston-levels").then(e=>{console.log(e.data.data),this.qustions=e.data.data})},createtreatment(){c.post("api/barrier-question/check/answers",{child_id:this.answer.child_id,level_id:this.answer.level_id}).then(e=>{console.log(e.data.data),this.notanswer=e.data.data,this.notanswer==""&&this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.getusers(),this.getallquestion(),this.getalltypeanswer()}},w=e=>(T("data-v-186c1d9d"),e=e(),L(),e),j=w(()=>t("div",null,null,-1)),A={class:"flex flex-column gap-2"},G={for:"username"},H={key:0,class:"mt-1 mb-5 text-red-500"},J={key:0,class:"flex flex-column gap-2"},K={for:"username"},O={key:0,class:"mt-1 mb-5 text-red-500"},W={key:1,class:"flex flex-column gap-2"},Y={for:"username"},Z={key:0,class:"mt-1 mb-5 text-red-500"},$={key:2,class:"flex flex-column gap-2"},ee={for:"username"},se={key:0,class:"mt-1 mb-5 text-red-500"},te={class:"col-span-2 flex flex-column gap-2"},le={class:"text-[black] font-bold"},oe={style:{border:"1px solid black","border-radius":"5px"}},ae={class:"py-1"},re=w(()=>t("div",null,null,-1)),ne={class:"grid grid-cols-1 lg:grid-cols-2"},ie=["onChange","name","value"],de={for:"html"},ce=w(()=>t("br",null,null,-1)),ue={key:0,class:"mt-1 mb-5 text-red-500"},he={class:"flex flex-column gap-2 w-full"},_e={style:{visibility:"hidden"},for:"username"},me=w(()=>t("small",{id:"username-help"},null,-1));function pe(e,r,q,_,s,m){const S=u("Dropdown"),B=u("Calendar"),I=u("InputNumber"),F=u("ColorPicker"),N=u("Button"),U=u("toast");return l(),o(h,null,[j,d(P,null,{default:C(()=>[t("div",null,[d(R,{style:{"max-height":"80vh","overflow-y":"scroll"},"fast-fail":"",ref:"form",onSubmit:z(m.submit,["prevent"]),class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"},{default:C(()=>{var b,v,y,x;return[t("div",A,[t("label",G,a(e.$t("child_name")),1),d(S,{filter:"",required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.answer.child_id,"onUpdate:modelValue":r[0]||(r[0]=n=>s.answer.child_id=n),"option-value":"id",options:s.childs,optionLabel:"name",placeholder:e.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(b=s.error)!=null&&b.child_id?(l(),o("div",H,a(s.error.child_id[0]),1)):i("",!0)]),s.answer.child_id?(l(),o("div",J,[t("label",K,a(e.$t("date")),1),d(B,{"onUpdate:modelValue":[m.getage,r[1]||(r[1]=n=>s.answer.date=n)],style:{width:"100%"},showButtonBar:"",modelValue:s.answer.date,modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("date"),maxDate:s.maxDate},null,8,["onUpdate:modelValue","modelValue","placeholder","maxDate"]),(v=s.error)!=null&&v.child_age?(l(),o("div",O,a(s.error.child_age[0]),1)):i("",!0)])):i("",!0),s.answer.date?(l(),o("div",W,[t("label",Y,a(e.$t("age")),1),d(I,{readonly:"",required:"",class:"bg-[#f7f5f5]",modelValue:s.answer.child_age,"onUpdate:modelValue":r[2]||(r[2]=n=>s.answer.child_age=n),placeholder:e.$t("age")},null,8,["modelValue","placeholder"]),(y=s.error)!=null&&y.child_age?(l(),o("div",Z,a(s.error.child_age[0]),1)):i("",!0)])):i("",!0),s.answer.child_id?(l(),o("div",$,[t("label",ee,a(e.$t("color")),1),d(F,{style:M({"background-color":"#"+s.answer.color}),class:"w-full h-[50px]",modelValue:s.answer.color,"onUpdate:modelValue":r[3]||(r[3]=n=>s.answer.color=n)},null,8,["style","modelValue"]),(x=s.error)!=null&&x.color?(l(),o("div",se,a(s.error.color[0]),1)):i("",!0)])):i("",!0),s.answer.child_id&&s.answer.child_age?(l(!0),o(h,{key:3},g(s.allquestion,n=>(l(),o("div",te,[t("h1",le,a(n.title),1),t("div",oe,[(l(!0),o(h,null,g(n.barriers_questiont,(p,k)=>(l(),o("div",{style:{"border-radius":"5px",padding:"1%"},class:"my-2",key:k},[t("p",ae,a(k+1)+" - "+a(p.title)+":",1),re,(l(!0),o(h,null,g(s.alltypes,V=>(l(),o("div",ne,[t("div",null,[t("input",{onChange:f=>m.getanswer(f,p.id,s.answer.level_id),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:p.id,value:V.id},null,40,ie),D("   "),t("label",de,a(V.title),1),ce,D("   "),(l(!0),o(h,null,g(s.notanswer,f=>(l(),o("div",null,[f==p.id?(l(),o("div",ue,"please answer this qustions")):i("",!0)]))),256))])]))),256))]))),128))])]))),256)):i("",!0),t("div",he,[t("label",_e,a(e.$t("gruop_sessaion")),1),d(N,{onClick:m.createtreatment,class:"create m-auto w-full",label:e.$t("submit")},null,8,["onClick","label"]),me])]}),_:1},8,["onSubmit"]),d(U)])]),_:1})],64)}const be=E(X,[["render",pe],["__scopeId","data-v-186c1d9d"]]);export{be as default};