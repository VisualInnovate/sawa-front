import{_ as T,u as S,c as V,r as B,o as a,d as r,f as w,w as D,e as s,t as o,g as l,X as E}from"./main-6a6d012d.js";import{C as I}from"./ChildTaps-232cd7c3.js";const P={components:{ChildTaps:I},data(){return{child_id:S("child_id",Number),maxDate:new Date,details:{}}},methods:{getusers(){V.get(`api/program/programFor/${localStorage.getItem("child_id")}`).then(t=>{console.log(t.data.data),this.details=t.data.data}).catch(t=>{console.error("Error retrieving Appointment Types:",t)})}},mounted(){this.getusers(),this.child_id=localStorage.getItem("child_id")}},A={class:"grid grid-cols-1 lg:grid-cols-1 gap-4 p-4"},F={class:"shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-1"},X={class:"w-full"},j={class:"flex py-2"},q={class:"my-auto font-bold"},z={class:"text-xl px-1 my-auto"},G={class:"flex py-2"},H={class:"my-auto font-bold"},J={key:0,class:"text-xl px-1 my-auto"},K={key:1,class:"text-xl px-1 my-auto"},L={key:2,class:"text-xl px-1 my-auto"},M={class:"flex py-2"},O={class:"my-auto font-bold"},Q={class:"text-xl px-1 my-auto"},R={class:"flex py-2"},U={class:"my-auto font-bold"},W={class:"text-xl px-1 my-auto"},Y={class:"flex py-2"},Z={class:"my-auto font-bold"},ss={class:"text-xl px-1 my-auto"},ts={class:"flex py-2"},os={class:"my-auto font-bold"},es={class:"text-xl px-1 my-auto"};function as(t,rs,ls,ds,e,is){const N=B("ChildTaps");return a(),r("div",null,[w(N),w(E,null,{default:D(()=>{var d,i,n,c,p,_,m,h,u,g,y,x,f,v,b,C,$,k;return[s("div",A,[s("div",F,[s("div",X,[s("div",j,[s("h3",q,o(t.$t("child_name"))+" :",1),s("p",z,o((d=e.details)==null?void 0:d.name),1)]),s("div",G,[s("h3",H,o(t.$t("ProgramType"))+" :",1),((n=(i=e.details)==null?void 0:i.student_program)==null?void 0:n.program.program_type)==0?(a(),r("p",J,o(t.$t("diurnal")),1)):l("",!0),((p=(c=e.details)==null?void 0:c.student_program)==null?void 0:p.program.program_type)==1?(a(),r("p",K,o(t.$t("Clinics")),1)):l("",!0),((m=(_=e.details)==null?void 0:_.student_program)==null?void 0:m.program.program_type)==2?(a(),r("p",L,o(t.$t("house")),1)):l("",!0)]),s("div",M,[s("h3",O,o(t.$t("ProgramName"))+" :",1),s("p",Q,o((u=(h=e.details)==null?void 0:h.student_program)==null?void 0:u.program.name),1)]),s("div",R,[s("h3",U,o(t.$t("price"))+" :",1),s("p",W,o((x=(y=(g=e.details)==null?void 0:g.student_program)==null?void 0:y.program)==null?void 0:x.price),1)]),s("div",Y,[s("h3",Z,o(t.$t("number_sessaion"))+" :",1),s("p",ss,o((b=(v=(f=e.details)==null?void 0:f.student_program)==null?void 0:v.program)==null?void 0:b.individual_sessions),1)]),s("div",ts,[s("h3",os,o(t.$t("gruop_sessaion"))+" :",1),s("p",es,o((k=($=(C=e.details)==null?void 0:C.student_program)==null?void 0:$.program)==null?void 0:k.collective_sessions),1)])])])])]}),_:1})])}const ps=T(P,[["render",as]]);export{ps as default};
