import{_ as C,a9 as w,z as h,l as c,o as a,e as i,h as t,t as r,q as u,x as l,y as m,X as T,a4 as D,i as f,a1 as F,a6 as I,$ as N,n as q,F as M,Q as U,R as B}from"./main-8edbc651.js";import{V as A}from"./VDialog-856a43a2.js";import{V as O}from"./VForm-c151f62f.js";const P={data(){return{treatments:{},error:{},isSubmitting:!1,programe_type:{},toast:w()}},methods:{Therapeutic(){this.$router.push({name:"AllTherapeutic"})},arr(){return this.roomType=[{name:this.$t("single_sesation"),value:0},{name:this.$t("multi_sesation"),value:1},{name:this.$t("Group_individual_sessions"),value:2}]},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},getTreatmentTypes(){h.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getprograme(){h.get("api/treatmentcounts").then(e=>{console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},createtreatment(){this.treatments.individual_sessions&&this.treatments.collective_sessions&&(this.treatments.sessions_number=this.treatments.collective_sessions+this.treatments.individual_sessions),this.treatments.collective_sessions==null&&(this.treatments.sessions_number=this.treatments.individual_sessions),this.treatments.individual_sessions==null&&(this.treatments.sessions_number=this.treatments.collective_sessions),h.post("/api/program",this.treatments).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1}},mounted(){this.getprograme()}},g=e=>(U("data-v-35959a8c"),e=e(),B(),e),E={key:0,class:"loader"},$={class:"flex flex-column gap-2"},L={for:"username"},z={key:0,class:"mt-1 mb-5 text-red-500"},G={class:"flex flex-column gap-2"},K={for:"username"},Q={key:0,class:"mt-1 mb-5 text-red-500"},R={class:"flex flex-column gap-2"},X={for:"username"},j={key:0,class:"mt-1 mb-5 text-red-500"},H={class:"flex flex-column gap-2"},J={for:"username"},W={key:0,class:"mt-1 mb-5 text-red-500"},Y={key:0,class:"flex flex-column gap-2"},Z={for:"username"},ee=g(()=>t("small",{id:"username-help"},null,-1)),se={key:1,class:"flex flex-column gap-2"},te={for:"username"},oe=g(()=>t("small",{id:"username-help"},null,-1)),le={class:"flex flex-column gap-2 w-full"},re={style:{visibility:"hidden"},for:"username"},ne=g(()=>t("small",{id:"username-help"},null,-1));function ae(e,o,ie,me,s,d){const k=c("InputText"),_=c("InputNumber"),v=c("Dropdown"),x=c("Button"),S=c("toast");return a(),i(M,null,[t("div",null,[t("div",null,[t("p",{class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold",onClick:o[0]||(o[0]=p=>d.Therapeutic())},r(e.$t("addTherapeutic")),1)]),e.loading?(a(),i("div",E)):u("",!0)]),l(T,null,{default:m(()=>[t("div",null,[l(A,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":o[1]||(o[1]=p=>e.isSuccessModalOpen=p),"max-width":"400px"},{default:m(()=>[l(T,null,{default:m(()=>[l(D,null,{default:m(()=>[f(r(e.$t("Success!")),1)]),_:1}),l(F,null,{default:m(()=>[f(r(e.$t("Data seeded successfully!")),1)]),_:1}),l(I,null,{default:m(()=>[l(N,{onClick:d.closeSuccessModal,color:"success"},{default:m(()=>[f(r(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),l(O,{class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:q(e.seedData,["prevent"])},{default:m(()=>{var p,y,b,V;return[t("div",$,[t("label",L,r(e.$t("ProgramName")),1),l(k,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.name,"onUpdate:modelValue":o[2]||(o[2]=n=>s.treatments.name=n),placeholder:e.$t("ProgramName")},null,8,["modelValue","placeholder"]),(p=s.error)!=null&&p.name?(a(),i("div",z,r(s.error.name[0]),1)):u("",!0)]),t("div",G,[t("label",K,r(e.$t("price")),1),l(_,{inputId:"minmaxfraction",minFractionDigits:2,maxFractionDigits:5,required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.price,"onUpdate:modelValue":o[3]||(o[3]=n=>s.treatments.price=n),placeholder:e.$t("price")},null,8,["modelValue","placeholder"]),(y=s.error)!=null&&y.price?(a(),i("div",Q,r(s.error.price[0]),1)):u("",!0)]),t("div",R,[t("label",X,r(e.$t("typesessaion")),1),l(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.treatments.session_type,"onUpdate:modelValue":o[4]||(o[4]=n=>s.treatments.session_type=n),"option-value":"value",options:d.arr(),optionLabel:"name",placeholder:e.$t("typesessaion"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(b=s.error)!=null&&b.session_type?(a(),i("div",j,r(s.error.session_type[0]),1)):u("",!0)]),t("div",H,[t("label",J,r(e.$t("ProgramType")),1),l(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.treatments.program_type,"onUpdate:modelValue":o[5]||(o[5]=n=>s.treatments.program_type=n),"option-value":"value",options:d.programetype(),optionLabel:"name",placeholder:e.$t("ProgramType"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(V=s.error)!=null&&V.program_type?(a(),i("div",W,r(s.error.program_type[0]),1)):u("",!0)]),s.treatments.session_type==0||s.treatments.session_type==2?(a(),i("div",Y,[t("label",Z,r(e.$t("number_sessaion")),1),l(_,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.individual_sessions,"onUpdate:modelValue":o[6]||(o[6]=n=>s.treatments.individual_sessions=n),placeholder:e.$t("number_sessaion")},null,8,["modelValue","placeholder"]),ee])):u("",!0),s.treatments.session_type==1||s.treatments.session_type==2?(a(),i("div",se,[t("label",te,r(e.$t("gruop_sessaion")),1),l(_,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.collective_sessions,"onUpdate:modelValue":o[7]||(o[7]=n=>s.treatments.collective_sessions=n),placeholder:e.$t("gruop_sessaion")},null,8,["modelValue","placeholder"]),oe])):u("",!0),t("div",le,[t("label",re,r(e.$t("gruop_sessaion")),1),l(x,{onClick:d.createtreatment,class:"create m-auto w-full",label:e.$t("submit")},null,8,["onClick","label"]),ne])]}),_:1},8,["onSubmit"]),l(S)])]),_:1})],64)}const ce=C(P,[["render",ae],["__scopeId","data-v-35959a8c"]]);export{ce as default};