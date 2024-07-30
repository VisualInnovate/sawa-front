import{_ as M,c as h,r as m,o,d as a,f as d,w as q,e as t,E as z,t as r,g as i,P as L,F as w,z as f,h as g,X as P,Q as j,R as Q}from"./main-8ca42423.js";import{E as R}from"./EvaluationType-fbac90ab.js";import{V as X}from"./VForm-a77aeffc.js";const A={components:{EvaluationType:R},data(){return{strart_evaluate:!1,answers:[],type:2,answer:{color:"00a2ff"},allquestion:[],childs:{},qustions:{},error:{},maxDate:new Date,notanswer:[]}},methods:{Therapeutic(){this.$router.push({name:"answer"})},submit(){},createevalutae(e){console.log(e),h.post("api/evaluations/create",{type:this.type,title:this.answer.title,child_id:this.answer.child_id,specialist_id:localStorage.getItem("user_id"),date:this.answer.date,stimulus_test_id:parseInt(this.$route.params.id)}).then(l=>{this.answer.evaluation_id=l.data.evaluation.id,this.strart_evaluate=!this.strart_evaluate})},anserdata(e,l){console.log(e),console.log(l)},getcolor(e){this.answer.color=e.target.value},getquation(e){h.get(`api/mileston-levels/get-all-by-subtest/${e}`).then(l=>{console.log(l.data[0].subtests),this.allquestion=l.data[0].subtests})},getage(){h.post("api/milestone-answers/get-age-child",{date:this.answer.date,child_id:this.answer.child_id}).then(e=>{this.answer.child_age=e.data})},getanswer(e,l,D){console.log(e.target.value),this.answer.score=e.target.value,this.answer.question_id=l,h.post("/api/milestone-answers",this.answer).then(v=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(v=>{console.log(v.response.data.errors.name),this.error=v.response.data.errors})},getusers(){h.get("api/child").then(e=>{console.log(localStorage.getItem("child_id")),this.childs=e.data.children,this.answer.child_id=parseInt(localStorage.getItem("child_id")),this.answer.evaluation_id=parseInt(this.$route.params.evaluation)}),h.get("api/mileston-levels").then(e=>{console.log(e.data.data),this.qustions=e.data.data})},createtreatment(){h.post("/api/milestone-answers/check/answers",{child_id:this.answer.child_id,level_id:this.answer.level_id}).then(e=>{console.log(e.data.data),this.notanswer=e.data.data,this.notanswer==""&&this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.getusers()}},p=e=>(j("data-v-dc5b4970"),e=e(),Q(),e),G=p(()=>t("div",null,null,-1)),H={class:"flex flex-column gap-2"},J={for:"username"},K={key:0,class:"mt-1 mb-5 text-red-500"},O={class:"flex flex-column gap-2"},W={for:"username"},Y={key:0,class:"mt-1 mb-5 text-red-500"},Z={key:0,class:"flex flex-column gap-2"},$={for:"username"},ee={key:0,class:"mt-1 mb-5 text-red-500"},se={key:1,class:"flex flex-column gap-2"},te={for:"username"},le={key:0,class:"mt-1 mb-5 text-red-500"},oe={class:"flex flex-column gap-2"},ae={for:"username"},re={key:0,class:"mt-1 mb-5 text-red-500"},ne={key:2,class:"flex flex-column gap-2"},ie={for:"username"},de={class:"flex"},ce={key:0,class:"mt-1 mb-5 text-red-500"},ue={class:"col-span-2 flex flex-column gap-2"},_e={class:"text-[black] font-bold"},he={style:{border:"1px solid black","border-radius":"5px",padding:"1%"}},me={style:{"border-bottom":"1px solid black !important"},class:"py-1 text-[black] font-bold",for:"username"},pe={class:"py-1"},ge=p(()=>t("div",null,null,-1)),ve={class:"grid grid-cols-1 lg:grid-cols-2 gap-4"},we=["onChange","name"],fe=p(()=>t("label",{for:"html"},"0",-1)),be=p(()=>t("br",null,null,-1)),ye=["onChange","name"],xe=p(()=>t("label",{for:"css"},"0.5",-1)),ke=p(()=>t("br",null,null,-1)),Ve=["onChange","name"],Ce=p(()=>t("label",{for:"javascript"},"1",-1)),Ie={key:0,class:"mt-1 mb-5 text-red-500"};function Se(e,l,D,v,s,u){const U=m("InputText"),b=m("Dropdown"),B=m("Calendar"),F=m("InputNumber"),N=m("ColorPicker"),T=m("Button"),E=m("toast");return o(),a(w,null,[G,d(P,null,{default:q(()=>[t("div",null,[d(X,{style:{"max-height":"80vh","overflow-y":"scroll"},"fast-fail":"",ref:"form",onSubmit:z(u.submit,["prevent"]),class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"},{default:q(()=>{var y,x,k,V,C,I;return[t("div",H,[t("label",J,r(e.$t("evaluation_name")),1),d(U,{required:"",class:"bg-[#f7f5f5]",modelValue:s.answer.title,"onUpdate:modelValue":l[0]||(l[0]=n=>s.answer.title=n),placeholder:e.$t("evaluation_name")},null,8,["modelValue","placeholder"]),(y=s.error)!=null&&y.title?(o(),a("div",K,r(s.error.title[0]),1)):i("",!0)]),t("div",O,[t("label",W,r(e.$t("child_name")),1),d(b,{filter:"",required:"",id:"pv_id_1",disabled:"",style:{direction:"ltr !important"},modelValue:s.answer.child_id,"onUpdate:modelValue":l[1]||(l[1]=n=>s.answer.child_id=n),"option-value":"id",options:s.childs,optionLabel:"name",placeholder:e.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(x=s.error)!=null&&x.child_id?(o(),a("div",Y,r(s.error.child_id[0]),1)):i("",!0)]),s.answer.child_id?(o(),a("div",Z,[t("label",$,r(e.$t("date")),1),d(B,{"onUpdate:modelValue":[u.getage,l[2]||(l[2]=n=>s.answer.date=n)],style:{width:"100%"},showButtonBar:"",modelValue:s.answer.date,modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("date"),maxDate:s.maxDate},null,8,["onUpdate:modelValue","modelValue","placeholder","maxDate"]),(k=s.error)!=null&&k.child_age?(o(),a("div",ee,r(s.error.child_age[0]),1)):i("",!0)])):i("",!0),s.answer.date?(o(),a("div",se,[t("label",te,r(e.$t("age")),1),d(F,{readonly:"",required:"",class:"bg-[#f7f5f5]",modelValue:s.answer.child_age,"onUpdate:modelValue":l[3]||(l[3]=n=>s.answer.child_age=n),placeholder:e.$t("age")},null,8,["modelValue","placeholder"]),(V=s.error)!=null&&V.child_age?(o(),a("div",le,r(s.error.child_age[0]),1)):i("",!0)])):i("",!0),t("div",oe,[t("label",ae,r(e.$t("level_id")),1),d(b,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},"onUpdate:modelValue":[u.getquation,l[4]||(l[4]=n=>s.answer.level_id=n)],modelValue:s.answer.level_id,"option-value":"id",options:s.qustions,optionLabel:"title",placeholder:e.$t("level_id"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["onUpdate:modelValue","modelValue","options","placeholder"]),(C=s.error)!=null&&C.level_id?(o(),a("div",re,r(s.error.level_id[0]),1)):i("",!0)]),s.answer.child_id&&s.answer.child_age&&s.answer.level_id?(o(),a("div",ne,[t("label",ie,r(e.$t("color")),1),t("div",de,[d(N,{style:L({"background-color":"#"+s.answer.color}),class:"w-full h-[50px]",modelValue:s.answer.color,"onUpdate:modelValue":l[5]||(l[5]=n=>s.answer.color=n)},null,8,["style","modelValue"]),d(T,{onClick:u.createevalutae,class:"create m-auto w-full h-[50px]",label:e.$t("strart_evaluate")},null,8,["onClick","label"])]),(I=s.error)!=null&&I.color?(o(),a("div",ce,r(s.error.color[0]),1)):i("",!0)])):i("",!0),s.strart_evaluate?(o(!0),a(w,{key:3},f(s.allquestion,n=>(o(),a("div",ue,[t("h1",_e,r(n.title),1),t("div",he,[t("h2",me,r(n.head_question),1),(o(!0),a(w,null,f(n.questions,(c,S)=>(o(),a("div",{style:{"border-radius":"5px",padding:"1%"},class:"my-2",key:S},[t("p",pe,r(S+1)+" - "+r(c.title)+":",1),ge,t("div",ve,[t("div",null,[t("input",{required:"",onChange:_=>u.getanswer(_,c.id,s.answer.level_id),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:c.id,value:"0"},null,40,we),g("   "),fe,be,g("   "),t("input",{required:"",onChange:_=>u.getanswer(_,c.id,s.answer.level_id),style:{border:"1px solid black"},type:"radio",name:c.id,value:".5"},null,40,ye),g("   "),xe,ke,g("   "),t("input",{required:"",onChange:_=>u.getanswer(_,c.id,s.answer.level_id),style:{border:"1px solid black"},type:"radio",name:c.id,value:"1"},null,40,Ve),g("   "),Ce]),(o(!0),a(w,null,f(s.notanswer,_=>(o(),a("div",null,[_==c.id?(o(),a("div",Ie,"please answer this qustions")):i("",!0)]))),256))])]))),128))])]))),256)):i("",!0)]}),_:1},8,["onSubmit"]),d(E)])]),_:1})],64)}const Be=M(A,[["render",Se],["__scopeId","data-v-dc5b4970"]]);export{Be as default};