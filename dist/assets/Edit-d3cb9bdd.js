import{_ as A,a5 as q,aq as N,bs as G,I as M,c as m,a1 as _,r as h,o as n,d as u,e as s,t as l,g as r,f as a,w as c,ac as Y,al as O,h as y,ai as R,an as H,af as W,a3 as $,i as F,v as I,x as b,F as j,E as z,G as K}from"./main-eedf56aa.js";import{F as J,i as P,a as Q,b as X,c as Z,l as w}from"./ar-5fb599f2.js";import{V as ee}from"./VDialog-f5e38033.js";import{V as te}from"./VForm-a1fea73f.js";const oe={components:{FullCalendar:J,Calendar:q},data(){return{rooms:{},error:{},doctors:{},isSubmitting:!1,programe_type:{},toast:N(),room_id:"",slot_id:"",buttomaddcal:!0,timeshow:!1,FullCalendarshow:!1,langStore:G(),visible:!1,create_visible:!1,event_id:null,creat_event:M(!1),updat_event:M(!1),event_title:"",start_event:"",end_event:"",loading:!1,modal_text:"",time_start:"",time_end:"",opts:{eventTimeFormat:{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1},plugins:[P,Q,X,Z],initialView:"dayGridMonth",footerToolbar:!0,valid:!1,buttonIcons:!1,locale:null,validRange:{start:new Date},selectable:!0,droppable:!1,editable:!0,selectHelper:!0,validRange:{start:new Date},headerToolbar:{center:"prev next today",left:"title",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},eventsTimeFormat:{hour:"2-digit",minute:"2-digit",second:"2-digit"},eventDrop:function(e){console.log(e.event.id),m.post(`/api/calender/${e.event.id}/update`,{start:e.event.start,end:e.event.end}).then(o=>{console.log(o.data.k)})},eventDrop:(function(e){const o=new Date(e.event.start),V=String(o.getHours()).padStart(2,"0"),k=String(o.getMinutes()).padStart(2,"0"),t=new Date(e.event.end),d=String(t.getHours()).padStart(2,"0"),g=String(t.getMinutes()).padStart(2,"0");m.post("/api/slot",{title:e.event.title,from:V+":"+k,to:d+":"+g,room_id:this.$route.params.id,start_event:_(e.event.start),end_event:_(e.event.end)}).then(v=>{this.update(),console.log(v.data.k)})}).bind(this),eventClick:(function(e){this.event_id=e.event.id,this.event_title=e.event.title,this.modal_text=this.$t("update_event"),this.creat_event=!1,this.updat_event=!0,this.getslotid(),this.visible=!0,this.start_event=_(e.event.start).format("YYYY-MM-DD"),this.end_event=_(e.event.end).format("YYYY-MM-DD"),console.log(e.event._def.publicId)}).bind(this),select:(function(e){console.log(e),this.event_title="",this.modal_text=this.$t("create_event"),this.creat_event=!0,this.updat_event=!1,this.visible=!0,console.log(e);const o=new Date(e.end);o.setDate(o.getDate()-1),this.start_event=_(e.start).format("YYYY-MM-DD"),this.end_event=_(o.toISOString().split("T")[0]).format("YYYY-MM-DD"),console.log(e.backgroundColor)}).bind(this)}}},methods:{Therapeutic(){this.$router.push({name:"Rooms"})},arr2(){return this.roomType=[{name:this.$t("Administrative"),value:0},{name:this.$t("social"),value:1},{name:this.$t("Consultation_evaluation"),value:2}]},arr(){return this.roomType=[{name:this.$t("typeroom2"),value:0},{name:this.$t("typeroom1"),value:1},{name:this.$t("typeroom3"),value:2}]},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},getTreatmentTypes(){m.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getprograme(){m.get("api/treatmentcounts").then(e=>{console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getAllDoctor(){m.get("api/doctors").then(e=>{this.doctors=e.data.doctors,console.log(this.doctors),this.update()}).catch(e=>{console.error("Error retrieving doctors:",e)})},createtreatment(){m.put(`/api/room/${this.$route.params.id}`,this.rooms).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1},highlightSelectedDay(e){this.$store.state.calendar.selectedDay===e.dateStr&&e.el.classList.add("selected-day")},loo(){localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=w},goBack(){this.$router.go(-1)},deletevent(e){console.log(e),m.delete(`/api/slot/${this.event_id}`).then(o=>{this.update(),this.visible=!1}),setTimeout(()=>{this.event_title=null,this.loading=!1},700)},updateevent(){m.put(`/api/slot/${this.event_id}`,{start_event:this.start_event,end_event:this.end_event,from:this.time_start,to:this.time_end,room_id:this.$route.params.id}).then(e=>{this.update(),this.visible=!1}),setTimeout(()=>{this.event_title=null,this.event_id=null,this.loading=!1},700)},createvent(){this.loading=!0,m.post("/api/slot",{title:this.event_title,end_event:this.end_event,start_event:this.start_event,date:this.start_event,from:this.time_start,to:this.time_end,room_id:this.$route.params.id}).then(e=>{this.slot_id=e.data.data.id,this.visible=!1,e.status!=200&&(this.valid=!0),this.update()}),setTimeout(()=>{this.event_title=null,this.start_event=null,this.end_event=null,this.create_visible=!1,this.loading=!1},2e3)},update(){m.get(`/api/room/${this.$route.params.id}`).then(e=>{console.log(e.data.data),this.rooms.name=e.data.data.name,this.rooms.capacity=e.data.data.capacity,this.rooms.type=e.data.data.type,this.rooms.admin_id=e.data.data.admin_id,this.rooms.type_tow=e.data.data.type_tow,this.opts.events=e.data.data.slots.map(o=>({title:o.start_event+"T"+o.to,start:o.start_event+"T"+o.from,end:o.end_event+"T"+o.to,id:o.id,from:o.from}))})},getslotid(){m.get(`/api/slot/${this.event_id}`).then(e=>{this.time_start=e.data.data.from,this.time_end=e.data.data.to}).catch(e=>{console.error("Error retrieving doctors:",e)})},refreshEvents(){this.$refs.calendar.$emit("refetch-events")}},mounted(){this.getAllDoctor(),localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=w,console.log(localStorage.appLang),console.log(this.opts)},watch:{"langStore.appLang"(e){e=="en"?this.opts.locale="":this.opts.locale=w,this.update()}}},se=e=>(z("data-v-4015b438"),e=e(),K(),e),le={class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold"},ae={key:0,class:"loader"},ie={class:"flex flex-column gap-2"},ne={for:"username"},re={key:0,class:"mt-1 mb-5 text-red-500"},de={class:"flex flex-column gap-2"},me={for:"username"},ue={key:0,class:"mt-1 mb-5 text-red-500"},pe={class:"flex flex-column gap-2"},ce={for:"username"},he={key:0,class:"mt-1 mb-5 text-red-500"},_e={key:0,class:"flex flex-column gap-2"},ve={for:"username"},fe={key:0,class:"mt-1 mb-5 text-red-500"},ge={key:1,class:"flex flex-column gap-2"},ye={for:"username"},be={key:0,class:"mt-1 mb-5 text-red-500"},we={class:"px-4"},Ve={class:"card flex justify-content-center"},ke={key:0,class:"py-3"},De={for:"time_start"},Ce={key:1,class:"py-3"},Se={for:"time_start"},Te={for:"time_start"},xe={for:"time_end"},Me={class:"flex flex-column gap-2 w-full"},Ye={style:{visibility:"hidden"},for:"username"},Fe=se(()=>s("small",{id:"username-help"},null,-1));function Ie(e,o,V,k,t,d){const g=h("InputText"),v=h("Dropdown"),B=h("InputNumber"),U=h("Toast"),E=h("FullCalendar"),D=h("Calendar"),f=h("Button"),L=h("Dialog");return n(),u(j,null,[s("div",null,[s("div",null,[s("p",le,l(e.$t("room")),1)]),t.loading?(n(),u("div",ae)):r("",!0)]),a(Y,null,{default:c(()=>[s("div",null,[a(ee,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":o[0]||(o[0]=i=>e.isSuccessModalOpen=i),"max-width":"400px"},{default:c(()=>[a(Y,null,{default:c(()=>[a(O,null,{default:c(()=>[y(l(e.$t("Success!")),1)]),_:1}),a(R,null,{default:c(()=>[y(l(e.$t("Data seeded successfully!")),1)]),_:1}),a(H,null,{default:c(()=>[a(W,{onClick:d.closeSuccessModal,color:"success"},{default:c(()=>[y(l(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),a(te,{class:"animate__animated animate__zoomIn p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:$(e.seedData,["prevent"])},{default:c(()=>{var i,C,S,T,x;return[s("div",ie,[s("label",ne,l(e.$t("roomnumber")),1),a(g,{required:"",class:"bg-[#f7f5f5]",modelValue:t.rooms.name,"onUpdate:modelValue":o[1]||(o[1]=p=>t.rooms.name=p),placeholder:e.$t("roomnumber")},null,8,["modelValue","placeholder"]),(i=t.error)!=null&&i.name?(n(),u("div",re,l(t.error.name[0]),1)):r("",!0)]),s("div",de,[s("label",me,l(e.$t("roomdoctor")),1),a(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.admin_id,"onUpdate:modelValue":o[2]||(o[2]=p=>t.rooms.admin_id=p),"option-value":"id",filter:"",options:t.doctors,optionLabel:"name",placeholder:e.$t("roomdoctor"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(C=t.error)!=null&&C.admin_id?(n(),u("div",ue,l(t.error.admin_id[0]),1)):r("",!0)]),s("div",pe,[s("label",ce,l(e.$t("typeroom")),1),a(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.type_tow,"onUpdate:modelValue":o[3]||(o[3]=p=>t.rooms.type_tow=p),"option-value":"value",options:d.arr2(),optionLabel:"name",placeholder:e.$t("typeroom"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(S=t.error)!=null&&S.type_tow?(n(),u("div",he,l(t.error.type_tow[0]),1)):r("",!0)]),t.rooms.type_tow==2?(n(),u("div",_e,[s("label",ve,l(e.$t("typeroom")),1),a(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.type,"onUpdate:modelValue":o[4]||(o[4]=p=>t.rooms.type=p),"option-value":"value",options:d.arr(),optionLabel:"name",placeholder:e.$t("typeroom"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(T=t.error)!=null&&T.type?(n(),u("div",fe,l(t.error.type[0]),1)):r("",!0)])):r("",!0),t.rooms.type_tow!=0&&t.rooms.type_tow?(n(),u("div",ge,[s("label",ye,l(e.$t("roomsnumber")+" "),1),a(B,{required:"",class:"bg-[#f7f5f5]",modelValue:t.rooms.capacity,"onUpdate:modelValue":o[5]||(o[5]=p=>t.rooms.capacity=p),placeholder:e.$t("roomsnumber")},null,8,["modelValue","placeholder"]),(x=t.error)!=null&&x.capacity?(n(),u("div",be,l(t.error.capacity[0]),1)):r("",!0)])):r("",!0)]}),_:1},8,["onSubmit"]),a(U),s("div",we,[a(E,{style:{"max-height":"70vh"},options:t.opts,onChange:o[6]||(o[6]=i=>d.refreshEvents()),ref:"fullCalendar",dayRender:d.highlightSelectedDay},null,8,["options","dayRender"]),s("div",Ve,[a(L,{visible:t.visible,"onUpdate:visible":o[11]||(o[11]=i=>t.visible=i),id:"modal",modal:"",header:t.modal_text,style:{width:"40vw"}},{default:c(()=>[s("form",null,[s("div",null,[t.updat_event?(n(),u("div",ke,[s("label",De,l(e.$t("start_date")),1),a(D,{style:{width:"100%"},showButtonBar:"",modelValue:t.start_event,"onUpdate:modelValue":o[7]||(o[7]=i=>t.start_event=i),modelModifiers:{number:!0},showIcon:"",placeholder:"dd/mm/yy"},null,8,["modelValue"])])):r("",!0),t.updat_event?(n(),u("div",Ce,[s("label",Se,l(e.$t("end_date")),1),a(D,{style:{width:"100%"},showButtonBar:"",modelValue:t.end_event,"onUpdate:modelValue":o[8]||(o[8]=i=>t.end_event=i),modelModifiers:{number:!0},showIcon:"",placeholder:"dd/mm/yy"},null,8,["modelValue"])])):r("",!0),s("div",null,[s("label",Te,l(e.$t("from")),1),F(s("input",{class:"cal",type:"time",name:"time_start",id:"time_start","onUpdate:modelValue":o[9]||(o[9]=i=>t.time_start=i),style:{"border-radius":"5px"}},null,512),[[I,t.time_start]])]),s("div",null,[s("label",xe,l(e.$t("to")),1),F(s("input",{class:"cal",type:"time",name:"time_end",id:"time_end","onUpdate:modelValue":o[10]||(o[10]=i=>t.time_end=i),style:{"border-radius":"5px"}},null,512),[[I,t.time_end]])]),t.creat_event?(n(),b(f,{key:2,style:{"background-color":"rgb(4, 171, 4)",border:"0"},label:"Create ",loading:t.loading,onClick:d.createvent},null,8,["loading","onClick"])):r("",!0),t.updat_event?(n(),b(f,{key:3,icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",loading:t.loading,onClick:d.updateevent},null,8,["loading","onClick"])):r("",!0),t.updat_event?(n(),b(f,{key:4,icon:"pi pi-trash",class:"delete mt-2",loading:t.loading,onClick:d.deletevent},null,8,["loading","onClick"])):r("",!0)])])]),_:1},8,["visible","header"]),s("div",Me,[s("label",Ye,l(e.$t("gruop_sessaion")),1),a(f,{onClick:d.createtreatment,class:"create m-auto w-full lg:w-[50%]",label:e.$t("submit")},null,8,["onClick","label"]),Fe])])])])]),_:1})],64)}const Ae=A(oe,[["render",Ie],["__scopeId","data-v-4015b438"]]);export{Ae as default};
