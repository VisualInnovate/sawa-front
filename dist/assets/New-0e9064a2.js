import{_ as f,o as n,e as r,h as t,t as s,i as d,M as v,A as w,y,k as i,q as l,F as p,z as $,f as k,B}from"./main-0ea29110.js";import{S as N}from"./Sidbar-7a860fcc.js";const A="/assets/Group463-7309cd5b.png",S={props:["date","notification"]},V={class:"rounded-lg py-2 shadow-md px-4 max-w-full mb-4 min-w-min bg-gray-100"},C={class:"pt-4 font-bold rounded flex justify-between"},E={class:"flex"},F=t("div",null,[t("img",{src:A})],-1),M={class:"text-xl m-auto p-2 pb-0 text-right font-semibold"},z={class:"my-auto text-right font-semibold text-lg text-[#148A98]"},G={class:"rounded text-right font-semibold text-lg"},j={class:"block py-2"},H={class:"block py-2"},R={style:{color:"#135c65"}},J={class:"block py-2"},T={style:{color:"#135c65"}},q={class:"block py-2"},D={style:{color:"#135c65"}};function L(o,a,e,m,c,_){return n(),r("div",V,[t("div",C,[t("div",E,[F,t("p",M,s(o.$t("Sawa_Academy_for_Special_Education")),1)]),t("div",z,s(e.notification.data.data.event_date),1)]),t("div",G,[t("p",j,s(e.notification.data.message),1),t("p",H,[d(s(o.$t("Jurisdiction_name"))+" : ",1),t("span",R,s(e.notification.data.data.doctor_name),1)]),t("p",J,[d(s(o.$t("Jurisdiction"))+" : ",1),t("span",T,s(e.notification.data.data.doctor_title),1)]),t("p",q,[d(s(o.$t("Consultation_date"))+" : ",1),t("span",D,s(e.notification.data.data.event_start),1)])])])}const P=f(S,[["render",L]]),I={components:{Map:v,NewAcorrding:P,Sidbar:N,About:w},data(){return{showsider:!1,notifications:[]}},methods:{toggle(){this.showsider=!this.showsider},getNotifications(){y.get("/api/parent/notification").then(o=>{this.notifications=o.data.notifications,console.log(o)}).catch(o=>{console.log(o)})}},mounted(){this.getNotifications()}},K={class:"flex justify-between border-b-2 p-2 border-x-cyan-950 border-solid"},O=B('<svg fill="#000000" width="44px" height="44px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M.5 7.42h15v1.25H.5zm0 3.6h15v1.25H.5zm0-7.29h15v1.25H.5z"></path></g></svg>',1),Q=[O],U={class:"m-auto w-full"},W={class:"w-full p-2 font-bold text-center text-2xl text-[#6EB7BF]"},X={class:"relative max-w-full max-h-screen flex"},Y={class:"flex-1 py-9 my-6"},Z={class:"top-0 bg-white absolute text-2xl w-full text-[#6EB7BF] p-2 shadow mb-6"},tt={class:"bg-white text-3xl py-2 text-[#6EB7BF] font-bold"},ot={class:"overflow-auto",style:{height:"67vh"}};function st(o,a,e,m,c,_){const u=i("Map"),g=i("sidbar"),x=i("NewAcorrding"),b=i("About");return n(),r(p,null,[l(u),t("div",K,[t("div",{class:"col-span-1 text-right m-auto visible md:invisible",onClick:a[0]||(a[0]=h=>_.toggle())},Q),t("div",U,[t("p",W,s(o.$t("Profile_personly")),1)])]),t("div",X,[l(g,{sole:c.showsider},null,8,["sole"]),t("div",Y,[t("div",Z,[t("p",tt,s(o.$t("The_latest_developments")),1)]),t("div",ot,[(n(!0),r(p,null,$(c.notifications,h=>(n(),k(x,{class:"mx-4",date:"15 مايو",notification:h},null,8,["notification"]))),256))])])]),l(b)],64)}const nt=f(I,[["render",st]]);export{nt as default};
