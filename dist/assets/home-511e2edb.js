import{_ as h,c,r as p,o as g,d as w,e as t,h as r,t as o,f,F as u,B as a}from"./main-c55d0017.js";const k={data(){return{chartData:null,chartOptions:null,lang:"",totla:{}}},mounted(){c.get("api/total/users").then(e=>{this.totla=e.data,this.chartData.datasets[0].data[0]=e.data.TotalUsers,this.chartData.datasets[0].data[1]=e.data.TotalDrivers,this.chartData.datasets[0].data[2]=e.data.TotalChild,this.chartData.datasets[0].data[3]=e.data.TotalRoom,this.chartData.datasets[0].data[3]=e.data.TotalRoom}).catch(e=>{console.error("Error retrieving doctors:",e)}),this.chartData=this.setChartData(),this.chartOptions=this.setChartOptions()},watch:{"localStorage.appLang"(e){console.log("csac")}},methods:{setChartData(){return{labels:[this.$t("users"),this.$t("driver"),this.$t("children"),this.$t("room")],datasets:[{label:this.$t("total"),data:[],backgroundColor:["rgba(249, 115, 22, 0.2)","rgba(6, 182, 212, 0.2)","rgb(107, 114, 128, 0.2)","rgba(139, 92, 246, 0.2)"],borderColor:["rgb(249, 115, 22)","rgb(6, 182, 212)","rgb(107, 114, 128)","rgb(139, 92, 246)"],borderWidth:1}]}},setChartOptions(){const e=getComputedStyle(document.documentElement),l=e.getPropertyValue("--text-color"),i=e.getPropertyValue("--text-color-secondary"),d=e.getPropertyValue("--surface-border");return{plugins:{legend:{labels:{color:l}}},scales:{x:{ticks:{color:i},grid:{color:d}},y:{beginAtZero:!0,ticks:{color:i},grid:{color:d}}}}}}},m={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 px-1"},_={class:"px-3"},C={class:"element w-full shadow-md bg-[#EC477C] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"},x=t("i",{class:"pi pi-car w-16 h-10 fill-current mr-4",style:{"font-size":"2.5rem"}},null,-1),b={class:"text-white"},v={class:"font-semibold text-3xl"},V={class:"px-3"},M={class:"element w-full shadow-md bg-[#135B64] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"},y=t("i",{class:"pi pi-user w-16 h-10 fill-current mr-4",style:{"font-size":"2.5rem"}},null,-1),S={class:"text-white"},L={class:"font-semibold text-3xl"},R={class:"px-3"},D={class:"element w-full shadow-md bg-[#C8CAAE] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"},G=t("i",{class:"pi pi-bell w-16 h-10 fill-current mr-4",style:{"font-size":"2.5rem"}},null,-1),B={class:"text-white"},T={class:"font-semibold text-3xl"},E={class:"px-3"},O={class:"element w-full shadow-md bg-[green] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"},Z=a('<svg class="p-3" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M22 22L2 22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15.5 5.5V3.5C15.5 3.22386 15.7239 3 16 3H18.5C18.7761 3 19 3.22386 19 3.5V8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#ffffff" stroke-width="1.5"></path> <path d="M14 9.5C14 10.6046 13.1046 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5Z" stroke="#ffffff" stroke-width="1.5"></path></g></svg>',1),$={class:"text-white"},j={class:"font-semibold text-3xl"},z={class:"px-3"},H={class:"element w-full shadow-md bg-[#EBCB53] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"},N=a('<svg class="p-3" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M22 22L2 22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15.5 5.5V3.5C15.5 3.22386 15.7239 3 16 3H18.5C18.7761 3 19 3.22386 19 3.5V8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#ffffff" stroke-width="1.5"></path> <path d="M14 9.5C14 10.6046 13.1046 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5Z" stroke="#ffffff" stroke-width="1.5"></path></g></svg>',1),A={class:"text-white"},P=t("p",{class:"font-semibold text-3xl"},"27",-1),F={class:"px-3"},U={class:"element w-full shadow-md bg-[#9253eb] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"},K=a('<svg class="p-3" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M22 22L2 22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15.5 5.5V3.5C15.5 3.22386 15.7239 3 16 3H18.5C18.7761 3 19 3.22386 19 3.5V8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#ffffff" stroke-width="1.5"></path> <path d="M14 9.5C14 10.6046 13.1046 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5Z" stroke="#ffffff" stroke-width="1.5"></path></g></svg>',1),W={class:"text-white"},Y={class:"font-semibold text-3xl"},q={class:"px-3"},I={class:"element w-full shadow-md bg-[#30a6aa] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"},J=a('<svg class="p-3" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M22 22L2 22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15.5 5.5V3.5C15.5 3.22386 15.7239 3 16 3H18.5C18.7761 3 19 3.22386 19 3.5V8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#ffffff" stroke-width="1.5"></path> <path d="M14 9.5C14 10.6046 13.1046 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5Z" stroke="#ffffff" stroke-width="1.5"></path></g></svg>',1),Q={class:"text-white"},X={class:"font-semibold text-3xl"},tt={class:"card w-full m-auto text-center shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-4"},et=t("div",{class:"mt-4 p-2 shadow-lg"},[t("iframe",{class:"w-full",src:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3492525.6382319154!2d39.76398280242961!3d31.25756942295812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15006f476664de99%3A0x8d285b0751264e99!2z2KfZhNij2LHYr9mG!5e0!3m2!1sar!2seg!4v1726127614071!5m2!1sar!2seg",width:"600",height:"450",style:{border:"0"},allowfullscreen:"",loading:"lazy",referrerpolicy:"no-referrer-when-downgrade"})],-1);function ot(e,l,i,d,s,st){const n=p("Chart");return g(),w(u,null,[t("div",null,[t("div",m,[t("div",_,[t("div",C,[x,r(),t("div",b,[t("p",v,o(s.totla.TotalDrivers),1),t("p",null,o(e.$t("driver")),1)])])]),t("div",V,[t("div",M,[y,t("div",S,[t("p",L,o(s.totla.TotalUsers),1),t("p",null,o(e.$t("users")),1)])])]),t("div",R,[t("div",D,[G,t("div",B,[t("p",T,o(s.totla.TotalChild),1),t("p",null,o(e.$t("children")),1)])])]),t("div",E,[t("div",O,[Z,r(),t("div",$,[t("p",j,o(s.totla.TotalRoom),1),t("p",null,o(e.$t("room")),1)])])]),t("div",z,[t("div",H,[N,r(),t("div",A,[P,t("p",null,o(e.$t("roles")),1)])])]),t("div",F,[t("div",U,[K,r(),t("div",W,[t("p",Y,o(s.totla.session),1),t("p",null,o(e.$t("sessions")),1)])])]),t("div",q,[t("div",I,[J,r(),t("div",Q,[t("p",X,o(s.totla.program),1),t("p",null,o(e.$t("addTherapeutic")),1)])])])]),t("div",tt,[f(n,{class:"card w-full m-auto text-center shadow-yellow-100",type:"bar",data:s.chartData,options:s.chartOptions},null,8,["data","options"]),f(n,{class:"card w-full m-auto text-center",type:"line",data:s.chartData,options:s.chartOptions},null,8,["data","options"])])]),et],64)}const at=h(k,[["render",ot]]);export{at as default};
