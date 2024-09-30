import{_ as B,c,r as m,o as l,d as n,e as o,t as i,g as d,f as a,w as u,X as k,a5 as E,h as _,a2 as I,a7 as N,$ as O,E as q,i as C,v as F,F as A}from"./main-a8302db8.js";import{E as L,S as G}from"./index-27357387.js";import{V as K}from"./VDialog-20389876.js";const W={components:{GoogleMap:L,Circle:G},data(){return{center:{lat:37.09,lng:8.712},cities:{chicago:{center:{lat:41.878,lng:45.629},population:5e3}},circles:{},student:{is_active:!0},drivers:{},vehicle:{},areas:{},error:{},studenttransportation:{},maxDate:new Date}},computed:{computedCircles(){const e={};for(const s in this.cities)e[s]={center:this.cities[s].center,radius:Math.sqrt(this.cities[s].population)*100,strokeColor:"#FF0000",strokeOpacity:.8,strokeWeight:2,fillColor:"#FF0000",fillOpacity:.35};return e}},methods:{setupCircles(){this.circles=this.computedCircles},Therapeutic(){this.$router.push({name:"transportation-schedule"})},getonetrip(){c.get(`api/transportation-schedule/${this.$route.params.id}`).then(e=>{console.log(e.data.data),this.student.driver_id=e.data.data.driver_id,this.student.vehicle_id=e.data.data.vehicle_id,this.student.available_seats=e.data.data.available_seats,this.student.student_transportation_id=e.data.data.student_transportation_id,this.student.from=e.data.data.from,this.student.to=e.data.data.to,this.student.date=e.data.data.date,e.data.data.is_active==1&&(this.student.is_active=!0),e.data.data.is_active==0&&(this.student.is_active=!1)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getDrivers(){c.get("api/driver").then(e=>{console.log(e.data.data),this.drivers=e.data.driver,this.getonetrip()})},getareas(){c.get("api/region").then(e=>{console.log(e.data.data),this.areas=e.data.data}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getareas(){c.get("api/student-transportation").then(e=>{console.log(e.data.data),this.studenttransportation=e.data.data,this.getonetrip()}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getvehicle(){c.get("api/vehicle").then(e=>{console.log(e.data.data),this.vehicle=e.data.data}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},arr(){return this.roomType=[{name:"angel car",value:0},{name:"bus",value:1},{name:"Minibus",value:2}]},trip(){return this.roomType=[{name:this.$t("One_way"),value:0},{name:this.$t("tow_way"),value:1}]},submitForm(){this.student.is_active==!0&&(this.student.is_active=1),this.student.is_active==!1&&(this.student.is_active=0),c.post(`/api/transportation-schedule/${this.$route.params.id}`,this.student).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})}},mounted(){this.setupCircles(),this.getvehicle(),this.getareas(),this.getDrivers()}},X={class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold"},j={key:0,class:"loader"},z={class:"flex flex-column gap-2"},H={for:"username"},J={key:0,class:"mt-1 mb-5 text-red-500"},P={class:"flex flex-column gap-2"},Q={for:"username"},R={key:0,class:"mt-1 mb-5 text-red-500"},Y={class:"flex flex-column gap-2"},Z={for:"username"},$={key:0,class:"mt-1 mb-5 text-red-500"},ee={class:"flex flex-column gap-2"},te={for:"username"},se={key:0,class:"mt-1 mb-5 text-red-500"},oe={class:"flex flex-column gap-2"},ie={for:"username"},re={key:0,class:"mt-1 mb-5 text-red-500"},ae={class:"flex flex-column gap-2"},le={for:"username"},ne={key:0,class:"mt-1 mb-5 text-red-500"},de={class:"flex flex-column gap-2"},ue={for:"username"},ce={key:0,class:"mt-1 mb-5 text-red-500"},me={class:"flex flex-column gap-2 w-[70%]"},pe={style:{visibility:"hidden"},for:"username"},_e={class:"flex"},he={key:0,class:"mt-1 mb-5 text-red-500"};function ve(e,s,fe,ge,t,h){const p=m("Dropdown"),D=m("Calendar"),S=m("InputNumber"),T=m("InputSwitch"),M=m("Button"),U=m("toast");return l(),n(A,null,[o("div",null,[o("div",null,[o("p",X,i(e.$t("transportation_schedule")),1)]),e.loading?(l(),n("div",j)):d("",!0)]),a(k,null,{default:u(()=>{var v,f,g,b,y,V,w,x;return[o("div",null,[a(K,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":s[0]||(s[0]=r=>e.isSuccessModalOpen=r),"max-width":"400px"},{default:u(()=>[a(k,null,{default:u(()=>[a(E,null,{default:u(()=>[_(i(e.$t("Success!")),1)]),_:1}),a(I,null,{default:u(()=>[_(i(e.$t("Data seeded successfully!")),1)]),_:1}),a(N,null,{default:u(()=>[a(O,{onClick:e.closeSuccessModal,color:"success"},{default:u(()=>[_(i(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),o("form",{class:"p-[2%] c shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:s[9]||(s[9]=q((...r)=>h.submitForm&&h.submitForm(...r),["prevent"]))},[o("div",z,[o("label",H,i(e.$t("driver_name")),1),a(p,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.driver_id,"onUpdate:modelValue":s[1]||(s[1]=r=>t.student.driver_id=r),"option-value":"id",options:t.drivers,optionLabel:"name",placeholder:e.$t("driver_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(v=t.error)!=null&&v.driver_id?(l(),n("div",J,i(t.error.driver_id[0]),1)):d("",!0)]),o("div",P,[o("label",Q,i(e.$t("vecile_type")),1),a(p,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.vehicle_id,"onUpdate:modelValue":s[2]||(s[2]=r=>t.student.vehicle_id=r),"option-value":"id",options:t.vehicle,optionLabel:"plate_number",placeholder:e.$t("vecile_type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(f=t.error)!=null&&f.vehicle_id?(l(),n("div",R,i(t.error.vehicle_id[0]),1)):d("",!0)]),o("div",Y,[o("label",Z,i(e.$t("student_tans")),1),a(p,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.student_transportation_id,"onUpdate:modelValue":s[3]||(s[3]=r=>t.student.student_transportation_id=r),"option-value":"id",options:t.studenttransportation,optionLabel:"location_url",placeholder:e.$t("student_tans"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(g=t.error)!=null&&g.student_transportation_id?(l(),n("div",$,i(t.error.student_transportation_id[0]),1)):d("",!0)]),o("div",ee,[o("label",te,i(e.$t("start_date")),1),a(D,{style:{width:"100%"},showButtonBar:"",modelValue:t.student.date,"onUpdate:modelValue":s[4]||(s[4]=r=>t.student.date=r),modelModifiers:{number:!0},showIcon:"",placeholder:e.$t("start_date"),minDate:t.maxDate},null,8,["modelValue","placeholder","minDate"]),(b=t.error)!=null&&b.date?(l(),n("div",se,i(t.error.date[0]),1)):d("",!0)]),o("div",oe,[o("label",ie,i(e.$t("seats_number")),1),a(S,{required:"",class:"bg-[#f7f5f5]",modelValue:t.student.available_seats,"onUpdate:modelValue":s[5]||(s[5]=r=>t.student.available_seats=r),placeholder:e.$t("seats_number")},null,8,["modelValue","placeholder"]),(y=t.error)!=null&&y.available_seats?(l(),n("div",re,i(t.error.available_seats[0]),1)):d("",!0)]),o("div",ae,[o("label",le,i(e.$t("from")),1),C(o("input",{class:"bg-[#F7F5F5] py-2",type:"time",name:"time_end",id:"time_end","onUpdate:modelValue":s[6]||(s[6]=r=>t.student.from=r),style:{"border-radius":"5px"}},null,512),[[F,t.student.from]]),(V=t.error)!=null&&V.from?(l(),n("div",ne,i(t.error.from[0]),1)):d("",!0)]),o("div",de,[o("label",ue,i(e.$t("to")),1),C(o("input",{class:"bg-[#F7F5F5] py-2",type:"time",name:"time_end",id:"pv_id_1","onUpdate:modelValue":s[7]||(s[7]=r=>t.student.to=r)},null,512),[[F,t.student.to]]),(w=t.error)!=null&&w.to?(l(),n("div",ce,i(t.error.to[0]),1)):d("",!0)]),o("div",me,[o("label",pe,i(e.$t("gruop_sessaion")),1),o("div",_e,[a(T,{class:"m-auto px-3",modelValue:t.student.is_active,"onUpdate:modelValue":s[8]||(s[8]=r=>t.student.is_active=r)},null,8,["modelValue"]),a(M,{type:"submit",class:"create m-auto w-full",label:e.$t("submit")},null,8,["label"])]),(x=t.error)!=null&&x.is_active?(l(),n("div",he,i(t.error.is_active[0]),1)):d("",!0)])],544),a(U)])]}),_:1})],64)}const we=B(W,[["render",ve],["__scopeId","data-v-3f6ef67b"]]);export{we as default};
