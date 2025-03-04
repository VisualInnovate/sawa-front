import{_ as u,c,r as n,o as a,d,e as t,t as s,f as l,g as i,F as m,x as b,L as f,a0 as x}from"./main-bc2568df.js";const k={data(){return{bookings:[],booking_result:"",booking_id:null,show_result_modal:!1}},methods:{getBookings(){c.get("/api/calender/bookings").then(e=>{this.bookings=e.data.bookings,console.log(e)}).catch(e=>{console.log(e)})},bookingDetailes(e){this.$router.push({name:"BookingDetails",params:{id:e}})},openModal(e){this.show_result_modal=!0,this.booking_id=e},addNote(){c.patch(`/api/calender/bookings/${this.booking_id}`,{booking_result:this.booking_result}).then(e=>{this.show_result_modal=!1,console.log(e)}).catch(e=>{console.log(e)})}},mounted(){this.getBookings()}},v={class:"mt-6 p-6"},w={class:"border-b-2 border-green-800 text-3xl w-full md:w-1/2 uppercase text-green-800 py-4 font-bold"},B={class:"p-6"},y={class:"grid grid-cols-1 md:grid-cols-2 gap-6"},$={class:"space-y-4"},A={class:"flex items-center"},C={class:"text-lg font-bold text-green-800"},D={class:"ml-3 text-base text-gray-700"},I={class:"flex items-center"},N={class:"text-lg font-bold text-green-800"},S={class:"ml-3 text-base text-gray-700"},V={class:"flex items-center"},F={class:"text-lg font-bold text-green-800"},L={class:"ml-3 text-base text-gray-700"},T={class:"flex justify-end items-center"};function j(e,q,E,M,r,_){const h=n("Button"),p=n("AccordionTab"),g=n("Accordion");return a(),d("div",v,[t("h1",w,s(e.$t("bookings")),1),l(x,{class:"mt-6 shadow-lg rounded-lg overflow-hidden"},{default:i(()=>[t("div",B,[(a(!0),d(m,null,b(r.bookings,o=>(a(),f(g,{key:o.id,activeIndex:1,expandIcon:"pi pi-plus",collapseIcon:"pi pi-minus"},{default:i(()=>[l(p,{header:o.child_name,class:"mb-4"},{default:i(()=>[t("div",y,[t("div",$,[t("div",A,[t("p",C,s(e.$t("child_age"))+":",1),t("p",D,s(o.child_age),1)]),t("div",I,[t("p",N,s(e.$t("parent.phone"))+":",1),t("p",S,s(o.details.requester_phone),1)]),t("div",V,[t("p",F,s(e.$t("موعد الاستشارة"))+":",1),t("p",L,s(o.event_date||"N/A"),1)])]),t("div",T,[l(h,{onClick:z=>_.bookingDetailes(o.id),icon:"pi pi-arrow-right",class:"p-button-success p-button-outlined",label:e.$t("متابعة التفاصيل")},null,8,["onClick","label"])])])]),_:2},1032,["header"])]),_:2},1024))),128))])]),_:1})])}const H=u(k,[["render",j],["__scopeId","data-v-4a1f12f6"]]);export{H as default};
