import{_ as C,a9 as w,z as V,l as c,o as r,e as i,h as t,t as n,q as u,x as l,y as m,X as T,a4 as D,i as h,a1 as F,a6 as I,$ as U,n as N,F as q,Q as M,R as B}from"./main-f0211df3.js";import{V as O}from"./VDialog-791b1f98.js";import{V as P}from"./VForm-e7a4e429.js";const A={data(){return{treatments:{},error:{},isSubmitting:!1,programe_type:{},toast:w()}},methods:{Therapeutic(){this.$router.push({name:"AllTherapeutic"})},arr(){return this.roomType=[{name:this.$t("single_sesation"),value:0},{name:this.$t("multi_sesation"),value:1},{name:this.$t("Group_individual_sessions"),value:2}]},sparte(){console.log("csacsa"),this.treatments.collective_sessions&&this.treatments.individual_sessions&&(this.treatments.Spotter=this.treatments.collective_sessions+this.treatments.individual_sessions),this.treatments.collective_sessions&&(this.treatments.Spotter=this.treatments.collective_sessions),this.treatments.individual_sessions&&(this.treatments.Spotter=this.treatments.individual_sessions)},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},getTreatmentTypes(){V.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{})},createtreatment(){this.treatments.individual_sessions&&this.treatments.collective_sessions&&(this.treatments.sessions_number=this.treatments.collective_sessions+this.treatments.individual_sessions),this.treatments.collective_sessions==null&&(this.treatments.sessions_number=this.treatments.individual_sessions),this.treatments.individual_sessions==null&&(this.treatments.sessions_number=this.treatments.collective_sessions),V.post("/api/program",this.treatments).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1}},mounted(){}},f=e=>(M("data-v-e05cc87a"),e=e(),B(),e),L={key:0,class:"loader"},z={class:"flex flex-column gap-2"},E={for:"username"},G={key:0,class:"mt-1 mb-5 text-red-500"},K={class:"flex flex-column gap-2"},Q={for:"username"},R={key:0,class:"mt-1 mb-5 text-red-500"},X={class:"flex flex-column gap-2"},$={for:"username"},j={key:0,class:"mt-1 mb-5 text-red-500"},H={class:"flex flex-column gap-2"},J={for:"username"},W={key:0,class:"mt-1 mb-5 text-red-500"},Y={key:0,class:"flex flex-column gap-2"},Z={for:"username"},ee=f(()=>t("small",{id:"username-help"},null,-1)),se={key:1,class:"flex flex-column gap-2"},te={for:"username"},oe=f(()=>t("small",{id:"username-help"},null,-1)),le={class:"flex flex-column gap-2 w-full"},ne={style:{visibility:"hidden"},for:"username"},ae=f(()=>t("small",{id:"username-help"},null,-1));function re(e,o,ie,me,s,d){const S=c("InputText"),_=c("InputNumber"),v=c("Dropdown"),k=c("Button"),x=c("toast");return r(),i(q,null,[t("div",null,[t("div",null,[t("p",{class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold",onClick:o[0]||(o[0]=p=>d.Therapeutic())},n(e.$t("addTherapeutic")),1)]),e.loading?(r(),i("div",L)):u("",!0)]),l(T,null,{default:m(()=>[t("div",null,[l(O,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":o[1]||(o[1]=p=>e.isSuccessModalOpen=p),"max-width":"400px"},{default:m(()=>[l(T,null,{default:m(()=>[l(D,null,{default:m(()=>[h(n(e.$t("Success!")),1)]),_:1}),l(F,null,{default:m(()=>[h(n(e.$t("Data seeded successfully!")),1)]),_:1}),l(I,null,{default:m(()=>[l(U,{onClick:d.closeSuccessModal,color:"success"},{default:m(()=>[h(n(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),l(P,{class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:N(e.seedData,["prevent"])},{default:m(()=>{var p,g,y,b;return[t("div",z,[t("label",E,n(e.$t("ProgramName")),1),l(S,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.name,"onUpdate:modelValue":o[2]||(o[2]=a=>s.treatments.name=a),placeholder:e.$t("ProgramName")},null,8,["modelValue","placeholder"]),(p=s.error)!=null&&p.name?(r(),i("div",G,n(s.error.name[0]),1)):u("",!0)]),t("div",K,[t("label",Q,n(e.$t("price")),1),l(_,{inputId:"minmaxfraction",minFractionDigits:2,maxFractionDigits:5,required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.price,"onUpdate:modelValue":o[3]||(o[3]=a=>s.treatments.price=a),placeholder:e.$t("price")},null,8,["modelValue","placeholder"]),(g=s.error)!=null&&g.price?(r(),i("div",R,n(s.error.price[0]),1)):u("",!0)]),t("div",X,[t("label",$,n(e.$t("typesessaion")),1),l(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.treatments.session_type,"onUpdate:modelValue":o[4]||(o[4]=a=>s.treatments.session_type=a),"option-value":"value",options:d.arr(),optionLabel:"name",placeholder:e.$t("typesessaion"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(y=s.error)!=null&&y.session_type?(r(),i("div",j,n(s.error.session_type[0]),1)):u("",!0)]),t("div",H,[t("label",J,n(e.$t("ProgramType")),1),l(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.treatments.program_type,"onUpdate:modelValue":o[5]||(o[5]=a=>s.treatments.program_type=a),"option-value":"value",options:d.programetype(),optionLabel:"name",placeholder:e.$t("ProgramType"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(b=s.error)!=null&&b.program_type?(r(),i("div",W,n(s.error.program_type[0]),1)):u("",!0)]),s.treatments.session_type==0||s.treatments.session_type==2?(r(),i("div",Y,[t("label",Z,n(e.$t("number_sessaion")),1),l(_,{required:"",class:"bg-[#f7f5f5]","onUpdate:modelValue":[d.sparte,o[6]||(o[6]=a=>s.treatments.individual_sessions=a)],modelValue:s.treatments.individual_sessions,placeholder:e.$t("number_sessaion")},null,8,["onUpdate:modelValue","modelValue","placeholder"]),ee])):u("",!0),s.treatments.session_type==1||s.treatments.session_type==2?(r(),i("div",se,[t("label",te,n(e.$t("gruop_sessaion")),1),l(_,{required:"",class:"bg-[#f7f5f5]",modelValue:s.treatments.collective_sessions,"onUpdate:modelValue":[o[7]||(o[7]=a=>s.treatments.collective_sessions=a),d.sparte],placeholder:e.$t("gruop_sessaion")},null,8,["modelValue","onUpdate:modelValue","placeholder"]),oe])):u("",!0),t("div",le,[t("label",ne,n(e.$t("gruop_sessaion")),1),l(k,{onClick:d.createtreatment,class:"create m-auto w-full",label:e.$t("submit")},null,8,["onClick","label"]),ae])]}),_:1},8,["onSubmit"]),l(x)])]),_:1})],64)}const ce=C(A,[["render",re],["__scopeId","data-v-e05cc87a"]]);export{ce as default};
