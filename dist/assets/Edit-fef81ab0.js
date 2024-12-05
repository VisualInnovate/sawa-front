import{_ as L,G as B,a7 as E,bp as Y,Q as C,c as _,r as d,o as m,d as u,e as s,t as n,g as v,f as i,w as g,D as V,E as p,x as G,T as q,F as N}from"./main-fba2e8b8.js";import{F as R,i as I,a as W,b as j,c as z,l as k}from"./index-f01d0f0a.js";import{h as x}from"./moment-fbc5633a.js";const H={components:{FullCalendar:R,Calendar:B},data(){return{rooms:{},days_week:[{name:"Sunday",value:0},{name:"Monday",value:1},{name:"Tuesday",value:2},{name:"Thursday",value:3},{name:"Wednesday",value:4},{name:"Friday",value:5},{name:"Saturday",value:6}],repeat_types:[{name:"تكرار ايام ",type:"single",dateFormat:"DD MM yy ",id:1},{name:"تكرار اسبوعي ",type:"single",dateFormat:"DD MM yy ",id:2},{name:"تكرار الشهور",type:"month",dateFormat:" MM yy ",id:3},{name:"تكرار السنوات",type:"year",dateFormat:"  yy ",id:4}],error:{},doctors:{},submitted:!1,isSubmitting:!1,updateDialog:!1,programe_type:{},toast:E(),room_id:"",slot_id:"",event:{color:"87ceeb",repeate:[{type:"",days:"",end_of_repeat:""}]},buttomaddcal:!0,FullCalendarshow:!1,langStore:Y(),visible:!1,create_visible:!1,event_id:null,creat_event:C(!1),updat_event:C(!1),event_title:"",start_event:"",end_event:"",loading:!1,modal_text:"",time_start:"",time_end:"",opts:{plugins:[I,W,j,z],initialView:"dayGridMonth",locale:null,slotDuration:"00:30:00",slotLabelInterval:"00:30:00",slotMinTime:"08:00:00",slotMaxTime:"13:00:00",selectable:!0,editable:!0,validRange:{start:new Date},selectAllow:t=>{const c=this.$refs.fullCalendar.getApi().getEvents();for(let h of c)if(x(t.start).isSame(h.start,"day")&&(t.start>=h.start&&t.start<h.end||t.end>h.start&&t.end<=h.end))return!1;return!0},selectable:!0,droppable:!0,editable:!0,selectHelper:!1,validRange:{start:new Date},headerToolbar:{center:"prev next today",left:"title",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},eventsTimeFormat:{hour:"2-digit",minute:"2-digit",second:"2-digit"},eventClick:(function(t){this.updateDialog=!0,this.event.start=t.event.end,this.event.end=t.event.end,this.event.title=t.event.title,this.event_id=t.event.id,this.rooms.room_id=t.event.extendedProps.room_id}).bind(this),select:(function(t){t.view.type=="dayGridMonth"?this.$refs.fullCalendar.getApi().changeView("timeGridDay",t.startStr):(this.event.start=t.startStr,this.event.end=t.endStr,this.visible=!0)}).bind(this)}}},methods:{Therapeutic(){this.$router.push({name:"Rooms"})},arr2(){return this.roomType=[{name:this.$t("Administrative"),value:0},{name:this.$t("social"),value:1},{name:this.$t("Consultation_evaluation"),value:2}]},arr(){return this.roomType=[{name:this.$t("typeroom2"),value:0},{name:this.$t("typeroom1"),value:1},{name:this.$t("typeroom3"),value:2}]},getAllDoctor(){_.get("api/doctors").then(t=>{this.doctors=t.data.doctors,this.update()}).catch(t=>{console.error("Error retrieving doctors:",t)})},createtreatment(){_.post("/api/room",this.rooms).then(t=>{this.rooms.room_id=t.data.data.id}).catch(t=>{})},highlightSelectedDay(t){this.$store.state.calendar.selectedDay===t.dateStr&&t.el.classList.add("selected-day")},goBack(){this.$router.go(-1)},deleteEvent(){_.delete(`/api/slot/${this.event_id}`).then(t=>{this.update(),this.updateDialog=!1})},updateevent(){var t,o;this.event.repeate[0].type=(o=(t=this.event)==null?void 0:t.repeat_type)==null?void 0:o.id,this.event.repeate[0].days=this.event.day,this.event.repeate[0].end_of_repeat=x(this.event.end_of_repeat).format(" YYYY-MM-DD"),_.put(`/api/slot/${this.event_id}`,{title:this.event.title,start:this.event.start,end:this.event.end,color:this.event.color,room_id:this.rooms.room_id,repeat:this.event.repeate}).then(c=>{this.update(),this.updateDialog=!1})},create(){var t,o;this.event.repeate[0].type=(o=(t=this.event)==null?void 0:t.repeat_type)==null?void 0:o.id,this.event.repeate[0].days=this.event.day,this.event.repeate[0].end_of_repeat=x(this.event.end_of_repeat).format(" YYYY-MM-DD"),_.post("/api/slot",{title:this.event.title,start:this.event.start,end:this.event.end,color:this.event.color,room_id:this.rooms.room_id,repeat:this.event.repeate}).then(c=>{this.visible=!1,this.update()}).catch(c=>{this.error=c.response.data.errors})},update(){_.get(`/api/room/${this.$route.params.id}`).then(t=>{console.log(t.data.data.id),this.rooms=t.data.data,this.rooms.room_id=t.data.data.id,this.opts.events=t.data.data.slots.map(o=>({title:o.title,start:o.start,end:o.end,id:o.id,room_id:o.room_id}))})},refreshEvents(){this.$refs.calendar.$emit("refetch-events")}},mounted(){localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=k,console.log(localStorage.appLang),console.log(this.opts),this.getAllDoctor()},watch:{"langStore.appLang"(t){t=="en"?this.opts.locale="":this.opts.locale=k,this.update()}}},P={class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold"},Q={key:0,class:"loader"},J={class:"flex flex-column gap-2"},K={for:"username"},O={key:0,class:"mt-1 mb-5 text-red-500"},X={class:"flex flex-column gap-2"},Z={for:"username"},$={class:"flex flex-column gap-2"},ee={for:"username"},te={key:0,class:"flex flex-column gap-2"},oe={for:"username"},se={key:1,class:"flex flex-column gap-2"},le={for:"username"},ie={class:"flex flex-column gap-2 w-full"},ne={style:{visibility:"hidden"},for:"username"},ae=s("small",{id:"username-help"},null,-1),re={class:"px-4"},de={class:"card flex justify-content-center"},me={class:"flex flex-column"},pe={class:"text-right"},ue={class:"flex gap-2 my-2"},ve={class:"px-2"},ce={key:0,class:"flex flex-column gap-2 py-1"},he={class:"w-full text-right",for:"username"},_e={key:1,class:"flex flex-column gap-2"},fe={class:"text-right"},ye={key:2,class:"flex flex-column gap-2"},be={class:"text-right"},ge={class:"flex flex-column"},Ve={class:"text-right"},xe={class:"flex"};function we(t,o,c,h,e,r){const b=d("InputText"),f=d("Dropdown"),S=d("InputNumber"),y=d("Button"),M=d("Toast"),F=d("FullCalendar"),T=d("InputSwitch"),U=d("MultiSelect"),A=d("Calendar"),w=d("Dialog");return m(),u(N,null,[s("div",null,[s("div",null,[s("p",P,n(t.$t("room")),1)]),e.loading?(m(),u("div",Q)):v("",!0)]),i(q,null,{default:g(()=>{var D;return[s("div",null,[s("form",{class:"p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:o[6]||(o[6]=V((...l)=>r.createtreatment&&r.createtreatment(...l),["prevent"]))},[s("div",J,[s("label",K,n(t.$t("roomnumber")),1),i(b,{required:"",class:p(["bg-[#f7f5f5]",{"p-invalid":e.submitted&&!e.rooms.name}]),modelValue:e.rooms.name,"onUpdate:modelValue":o[0]||(o[0]=l=>e.rooms.name=l)},null,8,["modelValue","class"]),(D=e.error)!=null&&D.name?(m(),u("div",O,n(e.error.name[0]),1)):v("",!0)]),s("div",X,[s("label",Z,n(t.$t("roomdoctor")),1),i(f,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:e.rooms.admin_id,"onUpdate:modelValue":o[1]||(o[1]=l=>e.rooms.admin_id=l),"option-value":"id",filter:"",options:e.doctors,optionLabel:"name",class:p({"p-invalid":e.submitted&&!e.rooms.admin_id})},null,8,["modelValue","options","class"])]),s("div",$,[s("label",ee,n(t.$t("typeroom")),1),i(f,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:e.rooms.type_tow,"onUpdate:modelValue":o[2]||(o[2]=l=>e.rooms.type_tow=l),"option-value":"value",options:r.arr2(),optionLabel:"name",class:p({"p-invalid":e.submitted&&!e.rooms.type_tow})},null,8,["modelValue","options","class"])]),e.rooms.type_tow==2?(m(),u("div",te,[s("label",oe,n(t.$t("typeroom")),1),i(f,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:e.rooms.type,"onUpdate:modelValue":o[3]||(o[3]=l=>e.rooms.type=l),"option-value":"value",options:r.arr(),optionLabel:"name",class:p({"p-invalid":e.submitted&&!e.rooms.type})},null,8,["modelValue","options","class"])])):v("",!0),e.rooms.type_tow!=0&&e.rooms.type!=0&&e.rooms.type_tow?(m(),u("div",se,[s("label",le,n(t.$t("roomsnumber")+" "),1),i(S,{required:"",class:p(["bg-[#f7f5f5]",{"p-invalid":e.submitted&&!e.rooms.capacity}]),modelValue:e.rooms.capacity,"onUpdate:modelValue":o[4]||(o[4]=l=>e.rooms.capacity=l)},null,8,["modelValue","class"])])):v("",!0),s("div",ie,[s("label",ne,n(t.$t("gruop_sessaion")),1),i(y,{type:"submit",onClick:o[5]||(o[5]=l=>e.submitted=!0),class:"create m-auto w-full lg:w-[50%]",icon:"pi pi-plus",label:t.$t("Add_appointment")},null,8,["label"]),ae])],544),i(M),s("div",re,[e.rooms.room_id?(m(),G(F,{key:0,options:e.opts,onChange:o[7]||(o[7]=l=>r.refreshEvents()),ref:"fullCalendar",dayRender:r.highlightSelectedDay},null,8,["options","dayRender"])):v("",!0),s("div",de,[i(w,{visible:e.visible,"onUpdate:visible":o[15]||(o[15]=l=>e.visible=l),id:"modal",modal:"",header:t.$t("submit"),style:{width:"40vw"}},{default:g(()=>{var l;return[s("form",{onSubmit:o[14]||(o[14]=V((...a)=>r.create&&r.create(...a),["prevent"]))},[s("div",null,[s("div",me,[s("label",pe,n(t.$t("title")),1),i(b,{modelValue:e.event.title,"onUpdate:modelValue":o[8]||(o[8]=a=>e.event.title=a),class:p({"p-invalid":e.submitted&&!e.event.title})},null,8,["modelValue","class"])]),s("div",ue,[i(T,{modelValue:e.event.sub,"onUpdate:modelValue":o[9]||(o[9]=a=>e.event.sub=a)},null,8,["modelValue"]),s("span",ve,n(t.$t("هل تريد تكرار الحدث")),1)]),e.event.sub?(m(),u("div",ce,[s("label",he,n(t.$t("نوع التكرار")),1),i(f,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:e.event.repeat_type,"onUpdate:modelValue":o[10]||(o[10]=a=>e.event.repeat_type=a),options:e.repeat_types,optionLabel:"name",class:p(["w-full",{"p-invalid":e.submitted&&!e.event.repeat_type}])},null,8,["modelValue","options","class"])])):v("",!0),((l=e.event.repeat_type)==null?void 0:l.id)==2?(m(),u("div",_e,[s("label",fe,n(t.$t("اختر ايام التكرار")),1),i(U,{modelValue:e.event.day,"onUpdate:modelValue":o[11]||(o[11]=a=>e.event.day=a),options:e.days_week,optionLabel:"name",optionValue:"value",class:p({"p-invalid":e.submitted&&!e.event.days})},null,8,["modelValue","options","class"])])):v("",!0),e.event.repeat_type?(m(),u("div",ye,[s("label",be,n(t.$t(" تاريخ نهاية التكرار")),1),i(A,{showButtonBar:"",modelValue:e.event.end_of_repeat,"onUpdate:modelValue":o[12]||(o[12]=a=>e.event.end_of_repeat=a),modelModifiers:{number:!0},showIcon:""},null,8,["modelValue"])])):v("",!0),i(y,{type:"submit",class:"create mt-3",label:t.$t("submit"),onClick:o[13]||(o[13]=a=>e.submitted=!0)},null,8,["label"])])],32)]}),_:1},8,["visible","header"]),i(w,{visible:e.updateDialog,"onUpdate:visible":o[19]||(o[19]=l=>e.updateDialog=l),id:"modal",modal:"",header:e.modal_text,style:{width:"40vw"}},{default:g(()=>[s("form",{onSubmit:o[18]||(o[18]=V((...l)=>r.updateevent&&r.updateevent(...l),["prevent"]))},[s("div",null,[s("div",ge,[s("label",Ve,n(t.$t("title")),1),i(b,{modelValue:e.event.title,"onUpdate:modelValue":o[16]||(o[16]=l=>e.event.title=l),class:p({"p-invalid":e.submitted&&!e.event.title})},null,8,["modelValue","class"])]),s("div",xe,[i(y,{type:"submit",class:"bg-[green] mt-3",icon:"pi pi-pencil",onClick:o[17]||(o[17]=l=>e.submitted=!0)}),i(y,{type:"submit",class:"delete mt-3",icon:"pi pi-trash",onClick:r.deleteEvent},null,8,["onClick"])])])],32)]),_:1},8,["visible","header"])])])])]}),_:1})],64)}const Se=L(H,[["render",we]]);export{Se as default};
