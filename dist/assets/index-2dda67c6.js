import{_ as P,c as m,r as p,o,d as a,f as d,w as S,e as s,E,t as r,g as i,P as M,F as f,z as w,h as g,X as z,Q as L,R as T}from"./main-6a6d012d.js";import{E as j}from"./EvaluationType-5c2d7f7e.js";import{V as A}from"./VForm-de52d7c3.js";const Q={components:{EvaluationType:j},data(){return{strart_evaluate:!1,answers:[],type:2,answer:{color:"00a2ff"},allquestion:[],childs:{},qustions:{},error:{},maxDate:new Date,notanswer:[]}},methods:{Therapeutic(){this.$router.push({name:"answer"})},submit(){},createevalutae(e){console.log(e),m.post("api/evaluations/create",{type:this.type,title:"VB-MAPP تقييم",child_id:this.answer.child_id,specialist_id:localStorage.getItem("user_id")}).then(t=>{this.answer.evaluation_id=t.data.evaluation.id,this.strart_evaluate=!this.strart_evaluate})},anserdata(e,t){console.log(e),console.log(t)},getcolor(e){this.answer.color=e.target.value},getquation(e){m.get(`api/mileston-levels/get-all-by-subtest/${e}`).then(t=>{console.log(t.data[0].subtests),this.allquestion=t.data[0].subtests})},getage(){m.post("api/milestone-answers/get-age-child",{date:this.answer.date,child_id:this.answer.child_id}).then(e=>{this.answer.child_age=e.data})},getanswer(e,t,q){console.log(e.target.value),this.answer.score=e.target.value,this.answer.question_id=t,m.post("/api/milestone-answers",this.answer).then(v=>{}).catch(v=>{console.log(v.response.data.errors.name),this.error=v.response.data.errors})},getusers(){m.get("api/child").then(e=>{this.childs=e.data.children,this.answer.child_id=parseInt(this.$route.params.id),this.answer.evaluation_id=parseInt(this.$route.params.evaluation)}),m.get("api/mileston-levels").then(e=>{console.log(e.data.data),this.qustions=e.data.data})},createtreatment(){m.post("/api/milestone-answers/check/answers",{child_id:this.answer.child_id,level_id:this.answer.level_id}).then(e=>{console.log(e.data.data),this.notanswer=e.data.data,this.notanswer==""&&this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.getusers()}},_=e=>(L("data-v-28dba8f9"),e=e(),T(),e),R=_(()=>s("div",null,null,-1)),X={class:"flex flex-column gap-2"},G={for:"username"},H={key:0,class:"mt-1 mb-5 text-red-500"},J={key:0,class:"flex flex-column gap-2"},K={for:"username"},O={key:0,class:"mt-1 mb-5 text-red-500"},W={key:1,class:"flex flex-column gap-2"},Y={for:"username"},Z={key:0,class:"mt-1 mb-5 text-red-500"},$={class:"flex flex-column gap-2"},ee={for:"username"},le={key:0,class:"mt-1 mb-5 text-red-500"},se={key:2,class:"flex flex-column gap-2"},te={for:"username"},oe={class:"flex"},ae={key:0,class:"mt-1 mb-5 text-red-500"},re={class:"col-span-2 flex flex-column gap-2"},ne={class:"text-[black] font-bold"},ie={style:{border:"1px solid black","border-radius":"5px",padding:"1%"}},de={style:{"border-bottom":"1px solid black !important"},class:"py-1 text-[black] font-bold",for:"username"},ce={class:"py-1"},ue=_(()=>s("div",null,null,-1)),_e={class:"grid grid-cols-1 lg:grid-cols-2 gap-4"},he=["onChange","name"],me=_(()=>s("label",{for:"html"},"0",-1)),pe=_(()=>s("br",null,null,-1)),ge=["onChange","name"],ve=_(()=>s("label",{for:"css"},"0.5",-1)),fe=_(()=>s("br",null,null,-1)),we=["onChange","name"],be=_(()=>s("label",{for:"javascript"},"1",-1)),ye={key:0,class:"mt-1 mb-5 text-red-500"},xe={key:4,class:"flex flex-column gap-2 w-full"},ke={style:{visibility:"hidden"},for:"username"},Ve=_(()=>s("small",{id:"username-help"},null,-1));function Ce(e,t,q,v,l,c){const b=p("Dropdown"),B=p("Calendar"),U=p("InputNumber"),F=p("ColorPicker"),y=p("Button"),N=p("toast");return o(),a(f,null,[R,d(z,null,{default:S(()=>[s("div",null,[d(A,{style:{"max-height":"80vh","overflow-y":"scroll"},"fast-fail":"",ref:"form",onSubmit:E(c.submit,["prevent"]),class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"},{default:S(()=>{var x,k,V,C,D;return[s("div",X,[s("label",G,r(e.$t("child_name")),1),d(b,{filter:"",required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:l.answer.child_id,"onUpdate:modelValue":t[0]||(t[0]=n=>l.answer.child_id=n),"option-value":"id",options:l.childs,optionLabel:"name",placeholder:e.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(x=l.error)!=null&&x.child_id?(o(),a("div",H,r(l.error.child_id[0]),1)):i("",!0)]),l.answer.child_id?(o(),a("div",J,[s("label",K,r(e.$t("date")),1),d(B,{"onUpdate:modelValue":[c.getage,t[1]||(t[1]=n=>l.answer.date=n)],style:{width:"100%"},showButtonBar:"",modelValue:l.answer.date,modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("date"),maxDate:l.maxDate},null,8,["onUpdate:modelValue","modelValue","placeholder","maxDate"]),(k=l.error)!=null&&k.child_age?(o(),a("div",O,r(l.error.child_age[0]),1)):i("",!0)])):i("",!0),l.answer.date?(o(),a("div",W,[s("label",Y,r(e.$t("age")),1),d(U,{readonly:"",required:"",class:"bg-[#f7f5f5]",modelValue:l.answer.child_age,"onUpdate:modelValue":t[2]||(t[2]=n=>l.answer.child_age=n),placeholder:e.$t("age")},null,8,["modelValue","placeholder"]),(V=l.error)!=null&&V.child_age?(o(),a("div",Z,r(l.error.child_age[0]),1)):i("",!0)])):i("",!0),s("div",$,[s("label",ee,r(e.$t("level_id")),1),d(b,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},"onUpdate:modelValue":[c.getquation,t[3]||(t[3]=n=>l.answer.level_id=n)],modelValue:l.answer.level_id,"option-value":"id",options:l.qustions,optionLabel:"title",placeholder:e.$t("level_id"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["onUpdate:modelValue","modelValue","options","placeholder"]),(C=l.error)!=null&&C.level_id?(o(),a("div",le,r(l.error.level_id[0]),1)):i("",!0)]),l.answer.child_id&&l.answer.child_age&&l.answer.level_id?(o(),a("div",se,[s("label",te,r(e.$t("color")),1),s("div",oe,[d(F,{style:M({"background-color":"#"+l.answer.color}),class:"w-full h-[50px]",modelValue:l.answer.color,"onUpdate:modelValue":t[4]||(t[4]=n=>l.answer.color=n)},null,8,["style","modelValue"]),d(y,{onClick:c.createevalutae,class:"create m-auto w-full h-[50px]",label:e.$t("strart_evaluate")},null,8,["onClick","label"])]),(D=l.error)!=null&&D.color?(o(),a("div",ae,r(l.error.color[0]),1)):i("",!0)])):i("",!0),l.strart_evaluate?(o(!0),a(f,{key:3},w(l.allquestion,n=>(o(),a("div",re,[s("h1",ne,r(n.title),1),s("div",ie,[s("h2",de,r(n.head_question),1),(o(!0),a(f,null,w(n.questions,(u,I)=>(o(),a("div",{style:{"border-radius":"5px",padding:"1%"},class:"my-2",key:I},[s("p",ce,r(I+1)+" - "+r(u.title)+":",1),ue,s("div",_e,[s("div",null,[s("input",{onChange:h=>c.getanswer(h,u.id,l.answer.level_id),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:u.id,value:"0"},null,40,he),g("   "),me,pe,g("   "),s("input",{onChange:h=>c.getanswer(h,u.id,l.answer.level_id),style:{border:"1px solid black"},type:"radio",name:u.id,value:".5"},null,40,ge),g("   "),ve,fe,g("   "),s("input",{onChange:h=>c.getanswer(h,u.id,l.answer.level_id),style:{border:"1px solid black"},type:"radio",name:u.id,value:"1"},null,40,we),g("   "),be]),(o(!0),a(f,null,w(l.notanswer,h=>(o(),a("div",null,[h==u.id?(o(),a("div",ye,"please answer this qustions")):i("",!0)]))),256))])]))),128))])]))),256)):i("",!0),l.strart_evaluate?(o(),a("div",xe,[s("label",ke,r(e.$t("gruop_sessaion")),1),d(y,{onClick:c.createtreatment,class:"create m-auto w-full",label:e.$t("submit")},null,8,["onClick","label"]),Ve])):i("",!0)]}),_:1},8,["onSubmit"]),d(N)])]),_:1})],64)}const qe=P(Q,[["render",Ce],["__scopeId","data-v-28dba8f9"]]);export{qe as default};
