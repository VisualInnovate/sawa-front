import{_ as k,c as b,r as g,o as a,d as n,e as o,f as r,w as v,t,g as u,X as x,F as y,B as C}from"./main-d5d5ddd5.js";const w={data(){return{carolina:{groups:[]},drivers:{},error:{},maxDate:new Date}},methods:{Therapeutic(){this.$router.push({name:"transportation"})},getusers(){b.get(`api/carolina-age-range/${this.$route.params.id}`).then(e=>{console.log(e.data.data),this.carolina=e.data.data}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},addarry(){this.carolina.tomonth&&this.carolina.frommonth&&this.carolina.groups.push({from:`${this.carolina.frommonth}`,to:`${this.carolina.tomonth}`})},deletearray(e){this.carolina.groups.splice(e,1)},createtreatment(){b.put(`/api/carolina-age-range/${this.$route.params.id}`,this.carolina).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.getusers()}},B={class:"flex flex-column gap-2"},N={for:"username"},U={key:0,class:"mt-1 mb-5 text-red-500"},q={class:"flex flex-column gap-2"},D={for:"username"},S={key:0,class:"mt-1 mb-5 text-red-500"},$={class:"grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 my-5"},E={class:"flex flex-column gap-2"},F={for:"username"},I={key:0,class:"mt-1 mb-5 text-red-500"},T={class:"flex"},A={class:"flex w-[86%] flex-column gap-2"},L={for:"username"},M={key:0,class:"mt-1 mb-5 text-red-500"},X={class:"flex flex-column gap-2"},j={class:"invisible",for:"username"},z={key:0,class:"mt-1 mb-5 text-red-500"},G={class:"flex flex-col col-span-2 gap-2 mx-5"},H={class:"flex relative bg-slate-200 rounded-md p-4"},J={class:"my-auto"},K={class:"px-1 text-green-500 text-xl"},O={class:"px-1 text-green-500 text-xl"},P={class:"w-full text-center"};function Q(e,l,R,W,s,h){const p=g("InputNumber"),f=g("Button"),V=g("toast");return a(),n(y,null,[o("div",null,[r(x,{class:"grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 bg-slate-100"},{default:v(()=>{var d,m;return[o("div",B,[o("label",N,t(e.$t("from"))+" (years)",1),r(p,{required:"",class:"bg-[#f7f5f5]",modelValue:s.carolina.from,"onUpdate:modelValue":l[0]||(l[0]=i=>s.carolina.from=i),placeholder:e.$t("from")},null,8,["modelValue","placeholder"]),(d=s.error)!=null&&d.seats?(a(),n("div",U,t(s.error.seats[0]),1)):u("",!0)]),o("div",q,[o("label",D,t(e.$t("to"))+" (years)",1),r(p,{required:"",class:"bg-[#f7f5f5]",modelValue:s.carolina.to,"onUpdate:modelValue":l[1]||(l[1]=i=>s.carolina.to=i),placeholder:e.$t("to")},null,8,["modelValue","placeholder"]),(m=s.error)!=null&&m.seats?(a(),n("div",S,t(s.error.seats[0]),1)):u("",!0)])]}),_:1}),r(x,{class:"bg-slate-100 my-5"},{default:v(()=>{var d,m,i;return[o("div",$,[o("div",E,[o("label",F,t(e.$t("from"))+" (month)",1),r(p,{required:"",class:"bg-[#f7f5f5]",modelValue:s.carolina.frommonth,"onUpdate:modelValue":l[2]||(l[2]=c=>s.carolina.frommonth=c),placeholder:e.$t("from")},null,8,["modelValue","placeholder"]),(d=s.error)!=null&&d.seats?(a(),n("div",I,t(s.error.seats[0]),1)):u("",!0)]),o("div",T,[o("div",A,[o("label",L,t(e.$t("to"))+" (month)",1),r(p,{required:"",class:"bg-[#f7f5f5]",modelValue:s.carolina.tomonth,"onUpdate:modelValue":l[3]||(l[3]=c=>s.carolina.tomonth=c),placeholder:e.$t("to")},null,8,["modelValue","placeholder"]),(m=s.error)!=null&&m.seats?(a(),n("div",M,t(s.error.seats[0]),1)):u("",!0)]),o("div",X,[o("label",j,t(e.$t("to"))+" (month)",1),r(f,{onClick:h.addarry,class:"create m-auto",icon:"pi pi-plus"},null,8,["onClick"]),(i=s.error)!=null&&i.seats?(a(),n("div",z,t(s.error.seats[0]),1)):u("",!0)])])]),o("div",G,[(a(!0),n(y,null,C(s.carolina.groups,(c,_)=>(a(),n("div",H,[o("span",J,t(_+1)+" - ",1),o("span",null,t(e.$t("from")),1),o("p",K,t(c.from),1),o("span",null,t(e.$t("to")),1),o("p",O,t(c.to),1),r(f,{onClick:Y=>h.deletearray(_),class:"delete m-auto absolute top-1 ltr:right-2 rtl:left-2",icon:"pi pi-minus"},null,8,["onClick"])]))),256))]),o("div",P,[r(f,{onClick:h.createtreatment,class:"create m-auto w-64 my-4",label:e.$t("submit")},null,8,["onClick","label"])])]}),_:1})]),r(V)],64)}const ee=k(w,[["render",Q]]);export{ee as default};
