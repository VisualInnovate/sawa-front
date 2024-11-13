import{_ as x,aq as C,c as V,r as p,o as a,d as i,e as t,t as l,g as d,f as o,w as m,ac as T,al as D,h,ai as F,an as I,af as U,a3 as N,F as q,E as B,G as M}from"./main-eedf56aa.js";import{V as O}from"./VDialog-f5e38033.js";import{V as P}from"./VForm-a1fea73f.js";const A={data(){return{treatments:{},error:{},isSubmitting:!1,programe_type:{},toast:C()}},methods:{Therapeutic(){this.$router.push({name:"AllTherapeutic"})},arr(){return this.roomType=[{name:this.$t("single_sesation"),value:0},{name:this.$t("multi_sesation"),value:1},{name:this.$t("Group_individual_sessions"),value:2}]},sparte(){console.log("csacsa"),this.treatments.collective_sessions&&this.treatments.individual_sessions&&(this.treatments.Spotter=this.treatments.collective_sessions+this.treatments.individual_sessions),this.treatments.collective_sessions&&(this.treatments.Spotter=this.treatments.collective_sessions),this.treatments.individual_sessions&&(this.treatments.Spotter=this.treatments.individual_sessions)},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},getTreatmentTypes(){V.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{})},createtreatment(){this.treatments.individual_sessions&&this.treatments.collective_sessions&&(this.treatments.sessions_number=this.treatments.collective_sessions+this.treatments.individual_sessions),this.treatments.collective_sessions==null&&(this.treatments.sessions_number=this.treatments.individual_sessions),this.treatments.individual_sessions==null&&(this.treatments.sessions_number=this.treatments.collective_sessions),V.post("/api/program",this.treatments).then(e=>{this.$router.push({name:"AllTherapeutic"})}).catch(e=>{this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1}},mounted(){}},f=e=>(B("data-v-87bc8927"),e=e(),M(),e),E={class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold"},G={key:0,class:"loader"},L={class:"flex flex-column gap-2"},K={for:"username"},j={key:0,class:"mt-1 mb-5 text-red-500"},z={class:"flex flex-column gap-2"},H={for:"username"},J={key:0,class:"mt-1 mb-5 text-red-500"},Q={class:"flex flex-column gap-2"},R={for:"username"},W={key:0,class:"mt-1 mb-5 text-red-500"},X={class:"flex flex-column gap-2"},Y={for:"username"},Z={key:0,class:"mt-1 mb-5 text-red-500"},$={key:0,class:"flex flex-column gap-2"},ee={for:"username"},se=f(()=>t("small",{id:"username-help"},null,-1)),te={key:1,class:"flex flex-column gap-2"},oe={for:"username"},le=f(()=>t("small",{id:"username-help"},null,-1)),ne={class:"flex flex-column gap-2 w-full"},re={style:{visibility:"hidden"},for:"username"},ae=f(()=>t("small",{id:"username-help"},null,-1));function ie(e,n,me,de,s,u){const S=p("InputText"),_=p("InputNumber"),v=p("Dropdown"),k=p("Button"),w=p("toast");return a(),i(q,null,[t("div",null,[t("div",null,[t("p",E,l(e.$t("addTherapeutic")),1)]),e.loading?(a(),i("div",G)):d("",!0)]),o(T,null,{default:m(()=>[t("div",null,[o(O,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":n[0]||(n[0]=c=>e.isSuccessModalOpen=c),"max-width":"400px"},{default:m(()=>[o(T,null,{default:m(()=>[o(D,null,{default:m(()=>[h(l(e.$t("Success!")),1)]),_:1}),o(F,null,{default:m(()=>[h(l(e.$t("Data seeded successfully!")),1)]),_:1}),o(I,null,{default:m(()=>[o(U,{onClick:u.closeSuccessModal,color:"success"},{default:m(()=>[h(l(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),o(P,{class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:N(e.seedData,["prevent"])},{default:m(()=>{var c,g,b,y;return[t("div",L,[t("label",K,l(e.$t("ProgramName")),1),o(S,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.name,"onUpdate:modelValue":n[1]||(n[1]=r=>s.treatments.name=r),placeholder:e.$t("ProgramName")},null,8,["modelValue","placeholder"]),(c=s.error)!=null&&c.name?(a(),i("div",j,l(s.error.name[0]),1)):d("",!0)]),t("div",z,[t("label",H,l(e.$t("price")),1),o(_,{inputId:"minmaxfraction",minFractionDigits:2,maxFractionDigits:5,required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.price,"onUpdate:modelValue":n[2]||(n[2]=r=>s.treatments.price=r),placeholder:e.$t("price")},null,8,["modelValue","placeholder"]),(g=s.error)!=null&&g.price?(a(),i("div",J,l(s.error.price[0]),1)):d("",!0)]),t("div",Q,[t("label",R,l(e.$t("typesessaion")),1),o(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.treatments.session_type,"onUpdate:modelValue":n[3]||(n[3]=r=>s.treatments.session_type=r),"option-value":"value",options:u.arr(),optionLabel:"name",placeholder:e.$t("typesessaion"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(b=s.error)!=null&&b.session_type?(a(),i("div",W,l(s.error.session_type[0]),1)):d("",!0)]),t("div",X,[t("label",Y,l(e.$t("ProgramType")),1),o(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.treatments.program_type,"onUpdate:modelValue":n[4]||(n[4]=r=>s.treatments.program_type=r),"option-value":"value",options:u.programetype(),optionLabel:"name",placeholder:e.$t("ProgramType"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(y=s.error)!=null&&y.program_type?(a(),i("div",Z,l(s.error.program_type[0]),1)):d("",!0)]),s.treatments.session_type==0||s.treatments.session_type==2?(a(),i("div",$,[t("label",ee,l(e.$t("number_sessaion")),1),o(_,{required:"",class:"bg-[#f7f5f5]","onUpdate:modelValue":[u.sparte,n[5]||(n[5]=r=>s.treatments.individual_sessions=r)],modelValue:s.treatments.individual_sessions,placeholder:e.$t("number_sessaion")},null,8,["onUpdate:modelValue","modelValue","placeholder"]),se])):d("",!0),s.treatments.session_type==1||s.treatments.session_type==2?(a(),i("div",te,[t("label",oe,l(e.$t("gruop_sessaion")),1),o(_,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.collective_sessions,"onUpdate:modelValue":[n[6]||(n[6]=r=>s.treatments.collective_sessions=r),u.sparte],placeholder:e.$t("gruop_sessaion")},null,8,["modelValue","onUpdate:modelValue","placeholder"]),le])):d("",!0),t("div",ne,[t("label",re,l(e.$t("gruop_sessaion")),1),o(k,{onClick:u.createtreatment,class:"create m-auto w-full",label:e.$t("submit")},null,8,["onClick","label"]),ae])]}),_:1},8,["onSubmit"]),o(w)])]),_:1})],64)}const _e=x(A,[["render",ie],["__scopeId","data-v-87bc8927"]]);export{_e as default};
