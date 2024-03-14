import{_ as w,z as f,l as c,o as a,e as i,h as t,t as l,q as u,x as r,y as m,W as T,a3 as x,i as h,a0 as S,a5 as D,Z as I,n as N,F as q,P as F,Q as U}from"./main-4f5f25f0.js";import{V as B}from"./VDialog-2140d988.js";import{V as M}from"./VForm-329aba46.js";const P={data(){return{treatments:{},error:{},isSubmitting:!1,programe_type:{}}},methods:{Therapeutic(){this.$router.push({name:"AllTherapeutic"})},arr(){return this.roomType=[{name:this.$t("single_sesation"),value:0},{name:this.$t("multi_sesation"),value:1},{name:this.$t("Group_individual_sessions"),value:2}]},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},getTreatmentTypes(){f.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getprograme(){f.get("api/treatmentcounts").then(e=>{console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},createtreatment(){f.post("/api/program",this.treatments).then(e=>{}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1}},mounted(){this.getprograme()}},g=e=>(F("data-v-3b2abf06"),e=e(),U(),e),A={key:0,class:"loader"},O={class:"flex flex-column gap-2"},E={for:"username"},L={key:0,class:"mt-1 mb-5 text-red-500"},z={class:"flex flex-column gap-2"},G={for:"username"},K={key:0,class:"mt-1 mb-5 text-red-500"},Q={class:"flex flex-column gap-2"},W={for:"username"},Z={key:0,class:"mt-1 mb-5 text-red-500"},$={class:"flex flex-column gap-2"},j={for:"username"},H={key:0,class:"mt-1 mb-5 text-red-500"},J={key:0,class:"flex flex-column gap-2"},R={for:"username"},X=g(()=>t("small",{id:"username-help"},null,-1)),Y={key:1,class:"flex flex-column gap-2"},ee={for:"username"},se=g(()=>t("small",{id:"username-help"},null,-1)),te={class:"flex flex-column gap-2 w-full"},oe={style:{visibility:"hidden"},for:"username"},le=g(()=>t("small",{id:"username-help"},null,-1));function re(e,o,ne,ae,s,p){const k=c("InputText"),_=c("InputNumber"),v=c("Dropdown"),C=c("Button");return a(),i(q,null,[t("div",null,[t("div",null,[t("p",{class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold",onClick:o[0]||(o[0]=d=>p.Therapeutic())},l(e.$t("addTherapeutic")),1)]),e.loading?(a(),i("div",A)):u("",!0)]),r(T,null,{default:m(()=>[t("div",null,[r(B,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":o[1]||(o[1]=d=>e.isSuccessModalOpen=d),"max-width":"400px"},{default:m(()=>[r(T,null,{default:m(()=>[r(x,null,{default:m(()=>[h(l(e.$t("Success!")),1)]),_:1}),r(S,null,{default:m(()=>[h(l(e.$t("Data seeded successfully!")),1)]),_:1}),r(D,null,{default:m(()=>[r(I,{onClick:p.closeSuccessModal,color:"success"},{default:m(()=>[h(l(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),r(M,{class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:N(e.seedData,["prevent"])},{default:m(()=>{var d,y,b,V;return[t("div",O,[t("label",E,l(e.$t("ProgramName")),1),r(k,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.name,"onUpdate:modelValue":o[2]||(o[2]=n=>s.treatments.name=n),placeholder:e.$t("ProgramName")},null,8,["modelValue","placeholder"]),(d=s.error)!=null&&d.name?(a(),i("div",L,l(s.error.name[0]),1)):u("",!0)]),t("div",z,[t("label",G,l(e.$t("price")),1),r(_,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.price,"onUpdate:modelValue":o[3]||(o[3]=n=>s.treatments.price=n),placeholder:e.$t("price")},null,8,["modelValue","placeholder"]),(y=s.error)!=null&&y.price?(a(),i("div",K,l(s.error.price[0]),1)):u("",!0)]),t("div",Q,[t("label",W,l(e.$t("typesessaion")),1),r(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.treatments.session_type,"onUpdate:modelValue":o[4]||(o[4]=n=>s.treatments.session_type=n),"option-value":"value",options:p.arr(),optionLabel:"name",placeholder:e.$t("typesessaion"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(b=s.error)!=null&&b.session_type?(a(),i("div",Z,l(s.error.session_type[0]),1)):u("",!0)]),t("div",$,[t("label",j,l(e.$t("ProgramType")),1),r(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.treatments.program_type,"onUpdate:modelValue":o[5]||(o[5]=n=>s.treatments.program_type=n),"option-value":"value",options:p.programetype(),optionLabel:"name",placeholder:e.$t("ProgramType"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(V=s.error)!=null&&V.program_type?(a(),i("div",H,l(s.error.program_type[0]),1)):u("",!0)]),s.treatments.session_type==0||s.treatments.session_type==2?(a(),i("div",J,[t("label",R,l(e.$t("number_sessaion")),1),r(_,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.individual_sessions,"onUpdate:modelValue":o[6]||(o[6]=n=>s.treatments.individual_sessions=n),placeholder:e.$t("number_sessaion")},null,8,["modelValue","placeholder"]),X])):u("",!0),s.treatments.session_type==1||s.treatments.session_type==2?(a(),i("div",Y,[t("label",ee,l(e.$t("gruop_sessaion")),1),r(_,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.collective_sessions,"onUpdate:modelValue":o[7]||(o[7]=n=>s.treatments.collective_sessions=n),placeholder:e.$t("gruop_sessaion")},null,8,["modelValue","placeholder"]),se])):u("",!0),t("div",te,[t("label",oe,l(e.$t("gruop_sessaion")),1),r(C,{onClick:p.createtreatment,class:"create m-auto w-full",label:e.$t("submit")},null,8,["onClick","label"]),le])]}),_:1},8,["onSubmit"])])]),_:1})],64)}const pe=w(P,[["render",re],["__scopeId","data-v-3b2abf06"]]);export{pe as default};
