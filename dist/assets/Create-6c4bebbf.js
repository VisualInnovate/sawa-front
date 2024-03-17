import{_ as k,ag as w,z as f,l as u,o as i,e as d,h as t,t as r,q as c,x as s,y as a,W as b,a3 as x,i as h,a0 as D,a5 as I,Z as F,n as M,F as B,P as N,Q as $}from"./main-9d9218df.js";import{V as q}from"./VDialog-95bf6239.js";import{V as A}from"./VForm-54342155.js";const U={data(){return{rooms:{},error:{},doctors:{},isSubmitting:!1,programe_type:{},toast:w()}},methods:{Therapeutic(){this.$router.push({name:"Rooms"})},arr(){return this.roomType=[{name:this.$t("typeroom2"),value:0},{name:this.$t("typeroom1"),value:1},{name:this.$t("typeroom3"),value:2}]},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},getTreatmentTypes(){f.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getprograme(){f.get("api/treatmentcounts").then(e=>{console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getAllDoctor(){f.get("api/doctors").then(e=>{this.doctors=e.data.doctors,console.log(this.doctors)}).catch(e=>{console.error("Error retrieving doctors:",e)})},createtreatment(){f.post("/api/room",this.rooms).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1}},mounted(){this.getAllDoctor()}},E=e=>(N("data-v-91c91635"),e=e(),$(),e),O={key:0,class:"loader"},L={class:"flex flex-column gap-2"},z={for:"username"},K={key:0,class:"mt-1 mb-5 text-red-500"},P={class:"flex flex-column gap-2"},Q={for:"username"},R={key:0,class:"mt-1 mb-5 text-red-500"},W={class:"flex flex-column gap-2"},Z={for:"username"},j={key:0,class:"mt-1 mb-5 text-red-500"},G={class:"flex flex-column gap-2"},H={for:"username"},J={key:0,class:"mt-1 mb-5 text-red-500"},X={class:"flex flex-column gap-2 w-full"},Y={style:{visibility:"hidden"},for:"username"},ee=E(()=>t("small",{id:"username-help"},null,-1));function oe(e,l,te,se,o,p){const V=u("InputText"),_=u("Dropdown"),T=u("InputNumber"),C=u("Button"),S=u("Toast");return i(),d(B,null,[t("div",null,[t("div",null,[t("p",{class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold",onClick:l[0]||(l[0]=m=>p.Therapeutic())},r(e.$t("room")),1)]),e.loading?(i(),d("div",O)):c("",!0)]),s(b,null,{default:a(()=>[t("div",null,[s(q,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":l[1]||(l[1]=m=>e.isSuccessModalOpen=m),"max-width":"400px"},{default:a(()=>[s(b,null,{default:a(()=>[s(x,null,{default:a(()=>[h(r(e.$t("Success!")),1)]),_:1}),s(D,null,{default:a(()=>[h(r(e.$t("Data seeded successfully!")),1)]),_:1}),s(I,null,{default:a(()=>[s(F,{onClick:p.closeSuccessModal,color:"success"},{default:a(()=>[h(r(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),s(A,{class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:M(e.seedData,["prevent"])},{default:a(()=>{var m,g,y,v;return[t("div",L,[t("label",z,r(e.$t("roomnumber")),1),s(V,{required:"",class:"bg-[#f7f5f5]",modelValue:o.rooms.name,"onUpdate:modelValue":l[2]||(l[2]=n=>o.rooms.name=n),placeholder:e.$t("roomnumber")},null,8,["modelValue","placeholder"]),(m=o.error)!=null&&m.name?(i(),d("div",K,r(o.error.name[0]),1)):c("",!0)]),t("div",P,[t("label",Q,r(e.$t("roomdoctor")),1),s(_,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:o.rooms.admin_id,"onUpdate:modelValue":l[3]||(l[3]=n=>o.rooms.admin_id=n),"option-value":"id",filter:"",options:o.doctors,optionLabel:"name",placeholder:e.$t("roomdoctor"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(g=o.error)!=null&&g.admin_id?(i(),d("div",R,r(o.error.admin_id[0]),1)):c("",!0)]),t("div",W,[t("label",Z,r(e.$t("typeroom")),1),s(_,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:o.rooms.type,"onUpdate:modelValue":l[4]||(l[4]=n=>o.rooms.type=n),"option-value":"value",options:p.arr(),optionLabel:"name",placeholder:e.$t("typeroom"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(y=o.error)!=null&&y.type?(i(),d("div",j,r(o.error.type[0]),1)):c("",!0)]),t("div",G,[t("label",H,r(e.$t("roomsnumber")),1),s(T,{required:"",class:"bg-[#f7f5f5]",modelValue:o.rooms.capacity,"onUpdate:modelValue":l[5]||(l[5]=n=>o.rooms.capacity=n),placeholder:e.$t("roomsnumber")},null,8,["modelValue","placeholder"]),(v=o.error)!=null&&v.capacity?(i(),d("div",J,r(o.error.capacity[0]),1)):c("",!0)]),t("div",X,[t("label",Y,r(e.$t("gruop_sessaion")),1),s(C,{onClick:p.createtreatment,class:"create m-auto w-full",label:e.$t("submit")},null,8,["onClick","label"]),ee])]}),_:1},8,["onSubmit"]),s(S)])]),_:1})],64)}const ne=k(U,[["render",oe],["__scopeId","data-v-91c91635"]]);export{ne as default};
