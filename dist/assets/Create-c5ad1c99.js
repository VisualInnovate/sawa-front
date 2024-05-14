import{_ as E,H as q,a9 as N,b5 as R,T as M,z as m,E as _,l as h,o as n,e as u,h as s,t as l,q as a,x as i,y as c,X as F,a4 as O,i as b,a1 as G,a6 as H,$ as W,n as j,f,w as Y,p as B,F as z,Q as K,R as Q}from"./main-dfa15806.js";import{F as X,i as J,a as P,b as Z,c as $,l as w}from"./ar-cbd97986.js";import{V as ee}from"./VDialog-fd75764c.js";import{V as te}from"./VForm-1064c9f9.js";const oe={components:{FullCalendar:X,Calendar:q},data(){return{rooms:{},error:{},doctors:{},isSubmitting:!1,programe_type:{},toast:N(),room_id:"",slot_id:"",buttomaddcal:!0,timeshow:!1,FullCalendarshow:!1,langStore:R(),visible:!1,create_visible:!1,event_id:null,creat_event:M(!1),updat_event:M(!1),event_title:"",start_event:"",end_event:"",loading:!1,modal_text:"",time_start:"",time_end:"",opts:{plugins:[J,P,Z,$],initialView:"dayGridMonth",footerToolbar:!0,valid:!1,buttonIcons:!1,locale:null,validRange:{start:new Date},selectable:!0,droppable:!0,editable:!0,selectHelper:!0,validRange:{start:new Date},headerToolbar:{center:"prev next today",left:"title",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},eventsTimeFormat:{hour:"2-digit",minute:"2-digit",second:"2-digit"},eventDrop:function(e){console.log(e.event.id),m.post(`/api/calender/${e.event.id}/update`,{start:e.event.start,end:e.event.end}).then(o=>{console.log(o.data.k)})},eventDrop:(function(e){console.log(this.room_id);const o=new Date(e.event.start),k=String(o.getHours()).padStart(2,"0"),V=String(o.getMinutes()).padStart(2,"0"),t=new Date(e.event.end),d=String(t.getHours()).padStart(2,"0"),y=String(t.getMinutes()).padStart(2,"0");m.post("/api/slot",{title:e.event.title,from:k+":"+V,to:d+":"+y,room_id:this.room_id,start_event:_(e.event.start),end_event:_(e.event.end)}).then(v=>{this.update(),console.log(v.data.k)})}).bind(this),eventClick:(function(e){this.event_id=e.event.id,this.event_title=e.event.title,this.modal_text=this.$t("update_event"),this.creat_event=!1,this.updat_event=!0,this.getslotid(),this.visible=!0,this.start_event=_(e.event.start).format("YYYY-MM-DD"),this.end_event=_(e.event.end).format("YYYY-MM-DD"),console.log(this.start_event)}).bind(this),select:(function(e){console.log(e),this.event_title="",this.modal_text=this.$t("create_event"),this.creat_event=!0,this.updat_event=!1,this.visible=!0,console.log(e);const o=new Date(e.end);o.setDate(o.getDate()),this.start_event=_(e.start).format("YYYY-MM-DD"),this.end_event=_(o.toISOString().split("T")[0]).format("YYYY-MM-DD"),console.log(e.backgroundColor)}).bind(this)}}},methods:{Therapeutic(){this.$router.push({name:"Rooms"})},arr2(){return this.roomType=[{name:this.$t("Administrative"),value:0},{name:this.$t("social"),value:1},{name:this.$t("Consultation_evaluation"),value:2}]},getslotid(){m.get(`/api/slot/${this.event_id}`).then(e=>{this.time_start=e.data.data.from,this.time_end=e.data.data.to,this.room_id=e.data.data.room_id}).catch(e=>{console.error("Error retrieving doctors:",e)})},arr(){return this.roomType=[{name:this.$t("typeroom2"),value:0},{name:this.$t("typeroom1"),value:1},{name:this.$t("typeroom3"),value:2}]},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},getTreatmentTypes(){m.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getprograme(){m.get("api/treatmentcounts").then(e=>{console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getAllDoctor(){m.get("api/doctors").then(e=>{this.doctors=e.data.doctors,console.log(this.doctors)}).catch(e=>{console.error("Error retrieving doctors:",e)})},createtreatment(){this.timeshow=!this.timeshow,m.post("/api/room",this.rooms).then(e=>{this.room_id=e.data.data.id,this.timeshow=!this.timeshow,this.FullCalendarshow=!this.FullCalendarshow,this.buttomaddcal=!this.buttomaddcal}).catch(e=>{this.timeshow=!this.timeshow,console.log(e.response.data.errors.name),this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1},highlightSelectedDay(e){this.$store.state.calendar.selectedDay===e.dateStr&&e.el.classList.add("selected-day")},loo(){localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=w},goBack(){this.$router.go(-1)},deletevent(e){console.log(e),m.delete(`/api/slot/${this.event_id}`).then(o=>{this.update(),this.visible=!1}),setTimeout(()=>{this.event_title=null,this.loading=!1},700)},updateevent(){m.put(`/api/slot/${this.event_id}`,{start_event:this.start_event,end_event:this.end_event,from:this.time_start,to:this.time_end,room_id:this.room_id}).then(e=>{this.update(),this.visible=!1}),setTimeout(()=>{this.event_title=null,this.event_id=null,this.loading=!1},700)},createvent(){this.loading=!0,m.post("/api/slot",{title:this.event_title,end_event:this.end_event,start_event:this.start_event,date:this.start_event,from:this.time_start,to:this.time_end,room_id:this.room_id}).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3}),this.visible=!1,e.status!=200&&(this.valid=!0)}).catch(e=>{this.error=e.response.data.errors}),setTimeout(()=>{this.update(),this.event_title=null,this.start_event=null,this.end_event=null,this.create_visible=!1,this.loading=!1},2e3)},update(){m.get(`/api/room/${this.room_id}`).then(e=>{console.log(e.data.data.id),this.room_id=e.data.data.id,this.opts.events=e.data.data.slots.map(o=>({title:o.start_event+"T"+o.to,start:o.start_event+"T"+o.from,end:o.end_event+"T"+o.to,id:o.id,from:o.from}))})},refreshEvents(){this.$refs.calendar.$emit("refetch-events")}},mounted(){localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=w,console.log(localStorage.appLang),console.log(this.opts),this.getAllDoctor()},watch:{"langStore.appLang"(e){e=="en"?this.opts.locale="":this.opts.locale=w,this.update()}}},se=e=>(K("data-v-1c195dbb"),e=e(),Q(),e),le={class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold"},ie={key:0,class:"loader"},ne={class:"flex flex-column gap-2"},re={for:"username"},ae={key:0,class:"mt-1 mb-5 text-red-500"},de={class:"flex flex-column gap-2"},me={for:"username"},ue={key:0,class:"mt-1 mb-5 text-red-500"},pe={class:"flex flex-column gap-2"},ce={for:"username"},he={key:0,class:"mt-1 mb-5 text-red-500"},_e={key:0,class:"flex flex-column gap-2"},ve={for:"username"},fe={key:0,class:"mt-1 mb-5 text-red-500"},ge={key:1,class:"flex flex-column gap-2"},ye={for:"username"},be={key:0,class:"mt-1 mb-5 text-red-500"},we={class:"flex flex-column gap-2 w-full"},ke={style:{visibility:"hidden"},for:"username"},Ve=se(()=>s("small",{id:"username-help"},null,-1)),Ce={class:"px-4"},De={class:"card flex justify-content-center"},Se={key:0,class:"py-3"},Te={for:"time_start"},xe={key:1,class:"py-3"},Me={for:"time_start"},Fe={for:"time_start"},Ye={for:"time_end"};function Be(e,o,k,V,t,d){const y=h("InputText"),v=h("Dropdown"),I=h("InputNumber"),g=h("Button"),U=h("Toast"),L=h("FullCalendar"),C=h("Calendar"),A=h("Dialog");return n(),u(z,null,[s("div",null,[s("div",null,[s("p",le,l(e.$t("room")),1)]),t.loading?(n(),u("div",ie)):a("",!0)]),i(F,null,{default:c(()=>[s("div",null,[i(ee,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":o[0]||(o[0]=r=>e.isSuccessModalOpen=r),"max-width":"400px"},{default:c(()=>[i(F,null,{default:c(()=>[i(O,null,{default:c(()=>[b(l(e.$t("Success!")),1)]),_:1}),i(G,null,{default:c(()=>[b(l(e.$t("Data seeded successfully!")),1)]),_:1}),i(H,null,{default:c(()=>[i(W,{onClick:d.closeSuccessModal,color:"success"},{default:c(()=>[b(l(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),i(te,{class:"p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:j(e.seedData,["prevent"])},{default:c(()=>{var r,D,S,T,x;return[s("div",ne,[s("label",re,l(e.$t("roomnumber")),1),i(y,{required:"",class:"bg-[#f7f5f5]",modelValue:t.rooms.name,"onUpdate:modelValue":o[1]||(o[1]=p=>t.rooms.name=p),placeholder:e.$t("roomnumber")},null,8,["modelValue","placeholder"]),(r=t.error)!=null&&r.name?(n(),u("div",ae,l(t.error.name[0]),1)):a("",!0)]),s("div",de,[s("label",me,l(e.$t("roomdoctor")),1),i(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.admin_id,"onUpdate:modelValue":o[2]||(o[2]=p=>t.rooms.admin_id=p),"option-value":"id",filter:"",options:t.doctors,optionLabel:"name",placeholder:e.$t("roomdoctor"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(D=t.error)!=null&&D.admin_id?(n(),u("div",ue,l(t.error.admin_id[0]),1)):a("",!0)]),s("div",pe,[s("label",ce,l(e.$t("typeroom")),1),i(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.type_tow,"onUpdate:modelValue":o[3]||(o[3]=p=>t.rooms.type_tow=p),"option-value":"value",options:d.arr2(),optionLabel:"name",placeholder:e.$t("typeroom"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(S=t.error)!=null&&S.type_tow?(n(),u("div",he,l(t.error.type_tow[0]),1)):a("",!0)]),t.rooms.type_tow==2?(n(),u("div",_e,[s("label",ve,l(e.$t("typeroom")),1),i(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.type,"onUpdate:modelValue":o[4]||(o[4]=p=>t.rooms.type=p),"option-value":"value",options:d.arr(),optionLabel:"name",placeholder:e.$t("typeroom"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(T=t.error)!=null&&T.type?(n(),u("div",fe,l(t.error.type[0]),1)):a("",!0)])):a("",!0),t.rooms.type_tow!=0&&t.rooms.type!=0&&t.rooms.type_tow?(n(),u("div",ge,[s("label",ye,l(e.$t("roomsnumber")+" "),1),i(I,{required:"",class:"bg-[#f7f5f5]",modelValue:t.rooms.capacity,"onUpdate:modelValue":o[5]||(o[5]=p=>t.rooms.capacity=p),placeholder:e.$t("roomsnumber")},null,8,["modelValue","placeholder"]),(x=t.error)!=null&&x.capacity?(n(),u("div",be,l(t.error.capacity[0]),1)):a("",!0)])):a("",!0),s("div",we,[s("label",ke,l(e.$t("gruop_sessaion")),1),t.buttomaddcal?(n(),f(g,{key:0,onClick:d.createtreatment,loading:t.timeshow,class:"create m-auto w-full lg:w-[50%]",icon:"pi pi-plus",label:e.$t("Add_appointment")},null,8,["onClick","loading","label"])):a("",!0),Ve])]}),_:1},8,["onSubmit"]),i(U),s("div",Ce,[t.FullCalendarshow?(n(),f(L,{key:0,options:t.opts,onChange:o[6]||(o[6]=r=>d.refreshEvents()),ref:"fullCalendar",dayRender:d.highlightSelectedDay},null,8,["options","dayRender"])):a("",!0),s("div",De,[i(A,{visible:t.visible,"onUpdate:visible":o[11]||(o[11]=r=>t.visible=r),id:"modal",modal:"",header:t.modal_text,style:{width:"40vw"}},{default:c(()=>[s("form",null,[s("div",null,[t.updat_event?(n(),u("div",Se,[s("label",Te,l(e.$t("start_date")),1),i(C,{style:{width:"100%"},showButtonBar:"",modelValue:t.start_event,"onUpdate:modelValue":o[7]||(o[7]=r=>t.start_event=r),modelModifiers:{number:!0},showIcon:"",placeholder:"dd/mm/yy"},null,8,["modelValue"])])):a("",!0),t.updat_event?(n(),u("div",xe,[s("label",Me,l(e.$t("end_date")),1),i(C,{style:{width:"100%"},showButtonBar:"",modelValue:t.end_event,"onUpdate:modelValue":o[8]||(o[8]=r=>t.end_event=r),modelModifiers:{number:!0},showIcon:"",placeholder:"dd/mm/yy"},null,8,["modelValue"])])):a("",!0),s("div",null,[s("label",Fe,l(e.$t("from")),1),Y(s("input",{class:"cal",type:"time",name:"time_start",id:"time_start","onUpdate:modelValue":o[9]||(o[9]=r=>t.time_start=r),style:{"border-radius":"5px"}},null,512),[[B,t.time_start]])]),s("div",null,[s("label",Ye,l(e.$t("to")),1),Y(s("input",{class:"cal",type:"time",name:"time_end",id:"time_end","onUpdate:modelValue":o[10]||(o[10]=r=>t.time_end=r),style:{"border-radius":"5px"}},null,512),[[B,t.time_end]])]),t.creat_event?(n(),f(g,{key:2,style:{"background-color":"rgb(4, 171, 4)",border:"0"},label:"Create ",loading:t.loading,onClick:d.createvent},null,8,["loading","onClick"])):a("",!0),t.updat_event?(n(),f(g,{key:3,icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",loading:t.loading,onClick:d.updateevent},null,8,["loading","onClick"])):a("",!0),t.updat_event?(n(),f(g,{key:4,icon:"pi pi-trash",class:"delete mt-2",loading:t.loading,onClick:d.deletevent},null,8,["loading","onClick"])):a("",!0)])])]),_:1},8,["visible","header"])])])])]),_:1})],64)}const Ee=E(oe,[["render",Be],["__scopeId","data-v-1c195dbb"]]);export{Ee as default};
