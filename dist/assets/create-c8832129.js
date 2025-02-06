import{_ as V,a9 as T,c as i,r as c,o as d,d as u,e as s,t as o,g as h,f as t,w as a,X as _,a4 as S,h as m,a2 as b,a6 as C,$,E as x,F as k,O as w,P as D}from"./main-11f2bc19.js";import{V as F}from"./VDialog-3338c358.js";import{V as M}from"./VForm-72c8380f.js";const B={data(){return{treatments:{},error:{},isSubmitting:!1,programe_type:{},toast:T()}},methods:{Therapeutic(){this.$router.push({name:"treatments-type"})},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},getTreatmentTypes(){i.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getprograme(){i.get("api/treatmentcounts").then(e=>{console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},createtreatment(){i.post("/api/treatment",this.treatments).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1}},mounted(){this.getprograme()}},I=e=>(w("data-v-ee680972"),e=e(),D(),e),O={class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold"},E={key:0,class:"loader"},N={class:"flex flex-column gap-2"},A={for:"username"},U={key:0,class:"mt-1 mb-5 text-red-500"},q={class:"flex flex-column gap-2 w-full"},K={style:{visibility:"hidden"},for:"username"},P=I(()=>s("small",{id:"username-help"},null,-1));function X(e,r,j,z,l,p){const f=c("InputText"),g=c("Button"),y=c("toast");return d(),u(k,null,[s("div",null,[s("div",null,[s("p",O,o(e.$t("Typetreatment")),1)]),e.loading?(d(),u("div",E)):h("",!0)]),t(_,null,{default:a(()=>[s("div",null,[t(F,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":r[0]||(r[0]=n=>e.isSuccessModalOpen=n),"max-width":"400px"},{default:a(()=>[t(_,null,{default:a(()=>[t(S,null,{default:a(()=>[m(o(e.$t("Success!")),1)]),_:1}),t(b,null,{default:a(()=>[m(o(e.$t("Data seeded successfully!")),1)]),_:1}),t(C,null,{default:a(()=>[t($,{onClick:p.closeSuccessModal,color:"success"},{default:a(()=>[m(o(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),t(M,{class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:x(e.seedData,["prevent"])},{default:a(()=>{var n;return[s("div",N,[s("label",A,o(e.$t("treatementname")),1),t(f,{required:"",class:"bg-[#f7f5f5]",modelValue:l.treatments.name,"onUpdate:modelValue":r[1]||(r[1]=v=>l.treatments.name=v),placeholder:e.$t("treatementname")},null,8,["modelValue","placeholder"]),(n=l.error)!=null&&n.name?(d(),u("div",U,o(l.error.name[0]),1)):h("",!0)]),s("div",q,[s("label",K,o(e.$t("gruop_sessaion")),1),t(g,{onClick:p.createtreatment,class:"create m-auto w-full",label:e.$t("submit")},null,8,["onClick","label"]),P])]}),_:1},8,["onSubmit"]),t(y)])]),_:1})],64)}const L=V(B,[["render",X],["__scopeId","data-v-ee680972"]]);export{L as default};
