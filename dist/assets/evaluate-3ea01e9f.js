import{_ as m,u as x,c as g,r,o as a,d,f as l,w as i,e as t,h as _,F as f,z as y,t as e,g as h,X as v}from"./main-8cb28508.js";import{C}from"./ChildTaps-d6dc6444.js";const $={components:{ChildTaps:C},data(){return{child_id:x("child_id",Number),maxDate:new Date,details:[]}},methods:{getusers(){g.get(`api/child/${localStorage.getItem("child_id")}/get/evaluations`).then(s=>{this.details=s.data.evaluations}).catch(s=>{console.error("Error retrieving Appointment Types:",s)})}},mounted(){this.getusers(),this.child_id=localStorage.getItem("child_id")}},b={class:"my-2"},B={class:"grid grid-cols-1 lg:grid-cols-2 gap-4 p-4"},N={class:"shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-2"},T={class:"flex py-2"},V={class:"my-auto font-bold"},k={class:"text-xl px-1 my-auto"},w={class:"flex py-2"},S={class:"my-auto font-bold"},D={class:"text-xl px-1 my-auto"},E={class:"flex py-2"},F={class:"my-auto font-bold"},I={class:"text-xl px-1 my-auto"},z={class:"flex py-2"},A={class:"my-auto font-bold"},L={key:0,class:"text-xl px-1 my-auto"},X={key:1,class:"text-xl px-1 my-auto"},j={class:"text-center"};function q(s,G,H,J,p,K){const u=r("ChildTaps"),c=r("Button");return a(),d("div",null,[l(u),l(v,null,{default:i(()=>[t("div",b,[l(c,{class:"details m-auto"},{default:i(()=>[_(" اضافة تقييم")]),_:1})]),t("div",B,[(a(!0),d(f,null,y(p.details,o=>{var n;return a(),d("div",N,[t("div",null,[t("div",T,[t("h3",V,e(s.$t("اسم التقييم"))+" :",1),t("p",k,e(o.title),1)]),t("div",w,[t("h3",S,e(s.$t("تاريخ التقييم"))+" :",1),t("p",D,e(o.date),1)]),t("div",E,[t("h3",F,e(s.$t("اسم المقييم"))+" :",1),t("p",I,e((n=o.specialist)==null?void 0:n.name),1)]),t("div",z,[t("h3",A,e(s.$t(" حالة التقييم"))+" :",1),o.status==1?(a(),d("p",L," منتهي")):h("",!0),o.status==0?(a(),d("p",X," تحت التقييم ")):h("",!0)])]),t("div",j,[l(c,{class:"details m-auto"},{default:i(()=>[_(" نتائج التقييم")]),_:1})])])}),256))])]),_:1})])}const P=m($,[["render",q]]);export{P as default};
