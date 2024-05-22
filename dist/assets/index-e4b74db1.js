import{_ as N,q as p,l as m,o,e as a,h as s,n as c,w as C,D as B,t as n,p as h,F as f,y as b,i as g,W as E,P as T,Q as U}from"./main-d23dc7e0.js";import{E as L}from"./EvaluationType-6c246480.js";import{V as M}from"./VForm-31c84fca.js";const j={components:{EvaluationType:L},data(){return{answers:[],answer:{color:"00a2ff"},allquestion:[],childs:{},qustions:{},error:{},maxDate:new Date,notanswer:[]}},methods:{Therapeutic(){this.$router.push({name:"answer"})},submit(){},anserdata(e,t){console.log(e),console.log(t)},getcolor(e){this.answer.color=e.target.value},getquation(e){p.get(`api/mileston-levels/get-all-by-subtest/${e}`).then(t=>{console.log(t.data[0].subtests),this.allquestion=t.data[0].subtests})},getanswer(e,t,D){console.log(e.target.value),this.answer.score=e.target.value,this.answer.question_id=t,p.post("/api/milestone-answers",this.answer).then(v=>{}).catch(v=>{console.log(v.response.data.errors.name),this.error=v.response.data.errors})},getusers(){p.get("api/child").then(e=>{console.log(e.data.data),this.childs=e.data.children}),p.get("api/mileston-levels").then(e=>{console.log(e.data.data),this.qustions=e.data.data})},createtreatment(){p.post("/api/milestone-answers/check/answers",{child_id:this.answer.child_id,level_id:this.answer.level_id}).then(e=>{console.log(e.data.data),this.notanswer=e.data.data,this.notanswer==""&&this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.getusers()}},_=e=>(T("data-v-4a9571b6"),e=e(),U(),e),z={class:"flex flex-column gap-2"},P={for:"username"},Q={key:0,class:"mt-1 mb-5 text-red-500"},W={key:0,class:"flex flex-column gap-2"},A={for:"username"},G={key:0,class:"mt-1 mb-5 text-red-500"},H={class:"flex flex-column gap-2"},J={for:"username"},K={key:0,class:"mt-1 mb-5 text-red-500"},O={class:"col-span-2 flex flex-column gap-2"},R={class:"text-[black] font-bold",for:"username"},X={class:"py-1"},Y=_(()=>s("div",null,null,-1)),Z={class:"grid grid-cols-1 lg:grid-cols-2 gap-4"},$=["onChange","name"],ee=_(()=>s("label",{for:"html"},"0",-1)),se=_(()=>s("br",null,null,-1)),le=["onChange","name"],te=_(()=>s("label",{for:"css"},"0.5",-1)),oe=_(()=>s("br",null,null,-1)),ae=["onChange","name"],ne=_(()=>s("label",{for:"javascript"},"1",-1)),re={class:"flex my-auto gap-2"},ie={for:"username"},de=["id"],ce={key:0,class:"mt-1 mb-5 text-red-500"},ue={class:"flex flex-column gap-2 w-full"},_e={style:{visibility:"hidden"},for:"username"},he=_(()=>s("small",{id:"username-help"},null,-1));function pe(e,t,D,v,l,u){const q=m("EvaluationType"),w=m("Dropdown"),S=m("InputNumber"),F=m("Button"),I=m("toast");return o(),a(f,null,[s("div",null,[c(q)]),c(E,null,{default:C(()=>[s("div",null,[c(M,{style:{"max-height":"80vh","overflow-y":"scroll"},"fast-fail":"",ref:"form",onSubmit:B(u.submit,["prevent"]),class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4"},{default:C(()=>{var y,x,k;return[s("div",z,[s("label",P,n(e.$t("child_name")),1),c(w,{filter:"",required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:l.answer.child_id,"onUpdate:modelValue":t[0]||(t[0]=d=>l.answer.child_id=d),"option-value":"id",options:l.childs,optionLabel:"name",placeholder:e.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(y=l.error)!=null&&y.child_id?(o(),a("div",Q,n(l.error.child_id[0]),1)):h("",!0)]),l.answer.child_id?(o(),a("div",W,[s("label",A,n(e.$t("age")),1),c(S,{required:"",class:"bg-[#f7f5f5]",modelValue:l.answer.child_age,"onUpdate:modelValue":t[1]||(t[1]=d=>l.answer.child_age=d),placeholder:e.$t("age")},null,8,["modelValue","placeholder"]),(x=l.error)!=null&&x.child_age?(o(),a("div",G,n(l.error.child_age[0]),1)):h("",!0)])):h("",!0),s("div",H,[s("label",J,n(e.$t("level_id")),1),c(w,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},"onUpdate:modelValue":[u.getquation,t[2]||(t[2]=d=>l.answer.level_id=d)],modelValue:l.answer.level_id,"option-value":"id",options:l.qustions,optionLabel:"title",placeholder:e.$t("level_id"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["onUpdate:modelValue","modelValue","options","placeholder"]),(k=l.error)!=null&&k.level_id?(o(),a("div",K,n(l.error.level_id[0]),1)):h("",!0)]),l.answer.child_age&&l.answer.child_id?(o(!0),a(f,{key:1},b(l.allquestion,d=>(o(),a("div",O,[s("h2",R,n(d.head_question),1),(o(!0),a(f,null,b(d.questions,(r,V)=>(o(),a("div",{style:{border:"1px solid black","border-radius":"5px",padding:"1%"},key:V},[s("p",X,n(V+1)+" - "+n(r.title)+":",1),Y,s("div",Z,[s("div",null,[s("input",{onChange:i=>u.getanswer(i,r.id,l.answer.level_id),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:r.id,value:"0"},null,40,$),g("   "),ee,se,g("   "),s("input",{onChange:i=>u.getanswer(i,r.id,l.answer.level_id),style:{border:"1px solid black"},type:"radio",name:r.id,value:".5"},null,40,le),g("   "),te,oe,g("   "),s("input",{onChange:i=>u.getanswer(i,r.id,l.answer.level_id),style:{border:"1px solid black"},type:"radio",name:r.id,value:"1"},null,40,ae),g("   "),ne]),s("div",re,[s("label",ie,n(e.$t("color")),1),s("input",{onChange:t[3]||(t[3]=i=>u.getcolor(i)),id:r.id,type:"color",value:"#00a2ff"},null,40,de)]),(o(!0),a(f,null,b(l.notanswer,i=>(o(),a("div",null,[i==r.id?(o(),a("div",ce,"please answer this qustions")):h("",!0)]))),256))])]))),128))]))),256)):h("",!0),s("div",ue,[s("label",_e,n(e.$t("gruop_sessaion")),1),c(F,{onClick:u.createtreatment,class:"create m-auto w-full",label:e.$t("submit")},null,8,["onClick","label"]),he])]}),_:1},8,["onSubmit"]),c(I)])]),_:1})],64)}const fe=N(j,[["render",pe],["__scopeId","data-v-4a9571b6"]]);export{fe as default};
