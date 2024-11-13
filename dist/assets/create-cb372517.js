import{_ as q,c as m,r as c,o as n,d as a,e as o,t as l,g as d,f as i,w as u,ac as k,al as B,h as _,ai as I,an as N,af as O,a3 as E,i as C,v as F,F as A}from"./main-eedf56aa.js";import{E as L,S as G}from"./index-9e8ce574.js";import{V as K}from"./VDialog-f5e38033.js";const W={components:{GoogleMap:L,Circle:G},data(){return{center:{lat:37.09,lng:8.712},cities:{chicago:{center:{lat:41.878,lng:45.629},population:5e3}},circles:{},student:{is_active:!0},vehicle:{},drivers:{},areas:{},error:{},studenttransportation:{},maxDate:new Date}},computed:{computedCircles(){const e={};for(const s in this.cities)e[s]={center:this.cities[s].center,radius:Math.sqrt(this.cities[s].population)*100,strokeColor:"#FF0000",strokeOpacity:.8,strokeWeight:2,fillColor:"#FF0000",fillOpacity:.35};return e}},methods:{setupCircles(){this.circles=this.computedCircles},Therapeutic(){this.$router.push({name:"transportation-schedule"})},getareas(){m.get("api/region").then(e=>{console.log(e.data.data),this.areas=e.data.data}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getareas(){m.get("api/student-transportation").then(e=>{console.log(e.data.data),this.studenttransportation=e.data.data}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getvehicle(){m.get("api/vehicle").then(e=>{console.log(e.data.data),this.vehicle=e.data.data}),m.get("api/driver").then(e=>{console.log(e.data.data),this.drivers=e.data.driver})},arr(){return this.roomType=[{name:"angel car",value:0},{name:"bus",value:1},{name:"Minibus",value:2}]},trip(){return this.roomType=[{name:this.$t("One_way"),value:0},{name:this.$t("tow_way"),value:1}]},submitForm(){this.student.is_active==!0&&(this.student.is_active=1),this.student.is_active==!1&&(this.student.is_active=0),m.post("/api/transportation-schedule",this.student).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.setupCircles(),this.getvehicle(),this.getareas()}},j={class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold"},z={key:0,class:"loader"},H={class:"flex flex-column gap-2"},J={for:"username"},P={key:0,class:"mt-1 mb-5 text-red-500"},Q={class:"flex flex-column gap-2"},R={for:"username"},X={key:0,class:"mt-1 mb-5 text-red-500"},Y={class:"flex flex-column gap-2"},Z={for:"username"},$={key:0,class:"mt-1 mb-5 text-red-500"},ee={class:"flex flex-column gap-2"},te={for:"username"},se={key:0,class:"mt-1 mb-5 text-red-500"},oe={class:"flex flex-column gap-2"},le={for:"username"},re={key:0,class:"mt-1 mb-5 text-red-500"},ie={class:"flex flex-column gap-2"},ne={for:"username"},ae={key:0,class:"mt-1 mb-5 text-red-500"},de={class:"flex flex-column gap-2"},ue={for:"username"},ce={key:0,class:"mt-1 mb-5 text-red-500"},me={class:"flex flex-column gap-2 w-[70%]"},pe={style:{visibility:"hidden"},for:"username"},_e={class:"flex"},ve={key:0,class:"mt-1 mb-5 text-red-500"};function he(e,s,fe,be,t,v){const p=c("Dropdown"),S=c("Calendar"),D=c("InputNumber"),M=c("InputSwitch"),T=c("Button"),U=c("toast");return n(),a(A,null,[o("div",null,[o("div",null,[o("p",j,l(e.$t("transportation_schedule")),1)]),e.loading?(n(),a("div",z)):d("",!0)]),i(k,null,{default:u(()=>{var h,f,b,g,y,V,w,x;return[o("div",null,[i(K,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":s[0]||(s[0]=r=>e.isSuccessModalOpen=r),"max-width":"400px"},{default:u(()=>[i(k,null,{default:u(()=>[i(B,null,{default:u(()=>[_(l(e.$t("Success!")),1)]),_:1}),i(I,null,{default:u(()=>[_(l(e.$t("Data seeded successfully!")),1)]),_:1}),i(N,null,{default:u(()=>[i(O,{onClick:e.closeSuccessModal,color:"success"},{default:u(()=>[_(l(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),o("form",{class:"p-[2%] c shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:s[9]||(s[9]=E((...r)=>v.submitForm&&v.submitForm(...r),["prevent"]))},[o("div",H,[o("label",J,l(e.$t("driver_name")),1),i(p,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.driver_id,"onUpdate:modelValue":s[1]||(s[1]=r=>t.student.driver_id=r),"option-value":"id",options:t.drivers,optionLabel:"name",placeholder:e.$t("driver_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(h=t.error)!=null&&h.driver_id?(n(),a("div",P,l(t.error.driver_id[0]),1)):d("",!0)]),o("div",Q,[o("label",R,l(e.$t("vecile_type")),1),i(p,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.vehicle_id,"onUpdate:modelValue":s[2]||(s[2]=r=>t.student.vehicle_id=r),"option-value":"id",options:t.vehicle,optionLabel:"plate_number",placeholder:e.$t("vecile_type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(f=t.error)!=null&&f.vehicle_id?(n(),a("div",X,l(t.error.vehicle_id[0]),1)):d("",!0)]),o("div",Y,[o("label",Z,l(e.$t("student_tans")),1),i(p,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.student_transportation_id,"onUpdate:modelValue":s[3]||(s[3]=r=>t.student.student_transportation_id=r),"option-value":"id",options:t.studenttransportation,optionLabel:"location_url",placeholder:e.$t("student_tans"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(b=t.error)!=null&&b.student_transportation_id?(n(),a("div",$,l(t.error.student_transportation_id[0]),1)):d("",!0)]),o("div",ee,[o("label",te,l(e.$t("start_date")),1),i(S,{required:"",style:{width:"100%"},showButtonBar:"",modelValue:t.student.date,"onUpdate:modelValue":s[4]||(s[4]=r=>t.student.date=r),modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("start_date"),minDate:t.maxDate},null,8,["modelValue","placeholder","minDate"]),(g=t.error)!=null&&g.date?(n(),a("div",se,l(t.error.date[0]),1)):d("",!0)]),o("div",oe,[o("label",le,l(e.$t("seats_number")),1),i(D,{required:"",class:"bg-[#f7f5f5]",modelValue:t.student.available_seats,"onUpdate:modelValue":s[5]||(s[5]=r=>t.student.available_seats=r),placeholder:e.$t("seats_number")},null,8,["modelValue","placeholder"]),(y=t.error)!=null&&y.available_seats?(n(),a("div",re,l(t.error.available_seats[0]),1)):d("",!0)]),o("div",ie,[o("label",ne,l(e.$t("from")),1),C(o("input",{class:"bg-[#F7F5F5] py-2",type:"time",name:"time_end",id:"time_end","onUpdate:modelValue":s[6]||(s[6]=r=>t.student.from=r),style:{"border-radius":"5px"}},null,512),[[F,t.student.from]]),(V=t.error)!=null&&V.from?(n(),a("div",ae,l(t.error.from[0]),1)):d("",!0)]),o("div",de,[o("label",ue,l(e.$t("to")),1),C(o("input",{required:"",class:"bg-[#F7F5F5] py-2",type:"time",name:"time_end",id:"pv_id_1","onUpdate:modelValue":s[7]||(s[7]=r=>t.student.to=r)},null,512),[[F,t.student.to]]),(w=t.error)!=null&&w.to?(n(),a("div",ce,l(t.error.to[0]),1)):d("",!0)]),o("div",me,[o("label",pe,l(e.$t("gruop_sessaion")),1),o("div",_e,[i(M,{required:"",class:"m-auto px-3",modelValue:t.student.is_active,"onUpdate:modelValue":s[8]||(s[8]=r=>t.student.is_active=r)},null,8,["modelValue"]),i(T,{type:"submit",class:"create m-auto w-full",label:e.$t("submit")},null,8,["label"])]),(x=t.error)!=null&&x.is_active?(n(),a("div",ve,l(t.error.is_active[0]),1)):d("",!0)])],544),i(U)])]}),_:1})],64)}const we=q(W,[["render",he],["__scopeId","data-v-875da587"]]);export{we as default};
