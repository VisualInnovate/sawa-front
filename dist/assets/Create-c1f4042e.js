import{_ as N,a4 as q,ao as G,bp as O,I as F,c as m,r as _,o as a,d as u,e as s,t as l,g as r,f as i,w as h,aa as Y,aj as R,h as w,ag as H,al as j,ad as W,a2 as K,x as g,i as I,v as B,F as z,E as J,G as P}from"./main-91c6b099.js";import{F as Q,i as X,a as Z,b as $,c as ee,l as k}from"./ar-0bd07fcc.js";import{h as v}from"./moment-fbc5633a.js";import{V as te}from"./VDialog-a08bb4b6.js";import{V as oe}from"./VForm-ab9a8bc4.js";const se={components:{FullCalendar:Q,Calendar:q},data(){return{rooms:{},error:{},doctors:{},isSubmitting:!1,programe_type:{},toast:G(),room_id:"",slot_id:"",buttomaddcal:!0,timeshow:!1,FullCalendarshow:!1,langStore:O(),visible:!1,create_visible:!1,event_id:null,creat_event:F(!1),updat_event:F(!1),event_title:"",start_event:"",end_event:"",loading:!1,modal_text:"",time_start:"",time_end:"",opts:{plugins:[X,Z,$,ee],initialView:"dayGridMonth",footerToolbar:!0,valid:!1,buttonIcons:!1,locale:null,validRange:{start:new Date},selectable:!0,droppable:!0,editable:!0,selectHelper:!1,validRange:{start:new Date},headerToolbar:{center:"prev next today",left:"title",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},eventsTimeFormat:{hour:"2-digit",minute:"2-digit",second:"2-digit"},eventDrop:function(e){console.log(e.event.id),m.post(`/api/calender/${e.event.id}/update`,{start:e.event.start,end:e.event.end}).then(o=>{console.log(o.data.k)})},eventDrop:(function(e){console.log(this.room_id);const o=new Date(e.event.start),V=String(o.getHours()).padStart(2,"0"),C=String(o.getMinutes()).padStart(2,"0"),t=new Date(e.event.end),d=String(t.getHours()).padStart(2,"0"),b=String(t.getMinutes()).padStart(2,"0");m.post("/api/slot",{title:e.event.title,from:V+":"+C,to:d+":"+b,room_id:this.room_id,start_event:v(e.event.start),end_event:v(e.event.start)}).then(f=>{this.update(),console.log(f.data.k)})}).bind(this),eventClick:(function(e){this.event_id=e.event.id,this.event_title=e.event.title,this.modal_text=this.$t("update_event"),this.creat_event=!1,this.updat_event=!0,this.getslotid(),this.visible=!0,this.start_event=v(e.event.start).format("YYYY-MM-DD"),this.end_event=v(e.event.end).format("YYYY-MM-DD"),console.log(this.start_event)}).bind(this),select:(function(e){console.log(e),this.event_title="",this.modal_text=this.$t("create_event"),this.creat_event=!0,this.updat_event=!1,this.visible=!0,console.log(e);const o=new Date(e.end);o.setDate(o.getDate()-1),this.start_event=v(e.start).format("YYYY-MM-DD"),this.end_event=v(o.toISOString().split("T")[0]).format("YYYY-MM-DD"),console.log(e.backgroundColor)}).bind(this)}}},methods:{Therapeutic(){this.$router.push({name:"Rooms"})},arr2(){return this.roomType=[{name:this.$t("Administrative"),value:0},{name:this.$t("social"),value:1},{name:this.$t("Consultation_evaluation"),value:2}]},getslotid(){m.get(`/api/slot/${this.event_id}`).then(e=>{this.time_start=e.data.data.from,this.time_end=e.data.data.to,this.room_id=e.data.data.room_id}).catch(e=>{console.error("Error retrieving doctors:",e)})},arr(){return this.roomType=[{name:this.$t("typeroom2"),value:0},{name:this.$t("typeroom1"),value:1},{name:this.$t("typeroom3"),value:2}]},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},getTreatmentTypes(){m.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getprograme(){m.get("api/treatmentcounts").then(e=>{console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getAllDoctor(){m.get("api/doctors").then(e=>{this.doctors=e.data.doctors,console.log(this.doctors)}).catch(e=>{console.error("Error retrieving doctors:",e)})},createtreatment(){this.timeshow=!this.timeshow,m.post("/api/room",this.rooms).then(e=>{this.room_id=e.data.data.id,this.timeshow=!this.timeshow,this.FullCalendarshow=!this.FullCalendarshow,this.buttomaddcal=!this.buttomaddcal}).catch(e=>{this.timeshow=!this.timeshow,console.log(e.response.data.errors.name),this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1},highlightSelectedDay(e){this.$store.state.calendar.selectedDay===e.dateStr&&e.el.classList.add("selected-day")},loo(){localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=k},goBack(){this.$router.go(-1)},deletevent(e){console.log(e),m.delete(`/api/slot/${this.event_id}`).then(o=>{this.update(),this.visible=!1}),setTimeout(()=>{this.event_title=null,this.loading=!1},700)},updateevent(){m.put(`/api/slot/${this.event_id}`,{start_event:this.start_event,end_event:this.end_event,from:this.time_start,to:this.time_end,room_id:this.room_id}).then(e=>{this.update(),this.visible=!1}),setTimeout(()=>{this.event_title=null,this.event_id=null,this.loading=!1},700)},createvent(){this.loading=!0,m.post("/api/slot",{title:this.event_title,end_event:this.end_event,start_event:this.start_event,date:this.start_event,from:this.time_start,to:this.time_end,room_id:this.room_id}).then(e=>{c,this.visible=!1,e.status!=200&&(this.valid=!0)}).catch(e=>{this.error=e.response.data.errors}),setTimeout(()=>{this.update(),this.event_title=null,this.start_event=null,this.end_event=null,this.create_visible=!1,this.loading=!1},2e3)},update(){m.get(`/api/room/${this.room_id}`).then(e=>{console.log(e.data.data.id),this.room_id=e.data.data.id,this.opts.events=e.data.data.slots.map(o=>({title:o.start_event+"T"+o.to,start:o.start_event+"T"+o.from,end:o.end_event+"T"+o.to,id:o.id,from:o.from}))})},refreshEvents(){this.$refs.calendar.$emit("refetch-events")}},mounted(){localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=k,console.log(localStorage.appLang),console.log(this.opts),this.getAllDoctor()},watch:{"langStore.appLang"(e){e=="en"?this.opts.locale="":this.opts.locale=k,this.update()}}},le=e=>(J("data-v-4ca0ade2"),e=e(),P(),e),ie={class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold"},ae={key:0,class:"loader"},ne={class:"flex flex-column gap-2"},re={for:"username"},de={key:0,class:"mt-1 mb-5 text-red-500"},me={class:"flex flex-column gap-2"},ue={for:"username"},pe={key:0,class:"mt-1 mb-5 text-red-500"},ce={class:"flex flex-column gap-2"},he={for:"username"},_e={key:0,class:"mt-1 mb-5 text-red-500"},ve={key:0,class:"flex flex-column gap-2"},fe={for:"username"},ge={key:0,class:"mt-1 mb-5 text-red-500"},ye={key:1,class:"flex flex-column gap-2"},be={for:"username"},we={key:0,class:"mt-1 mb-5 text-red-500"},ke={class:"flex flex-column gap-2 w-full"},Ve={style:{visibility:"hidden"},for:"username"},Ce=le(()=>s("small",{id:"username-help"},null,-1)),De={class:"px-4"},Se={class:"card flex justify-content-center"},Te={key:0,class:"py-3"},xe={for:"time_start"},Me={key:1,class:"py-3"},Fe={for:"time_start"},Ye={for:"time_start"},Ie={for:"time_end"};function Be(e,o,V,C,t,d){const b=_("InputText"),f=_("Dropdown"),U=_("InputNumber"),y=_("Button"),L=_("Toast"),A=_("FullCalendar"),D=_("Calendar"),E=_("Dialog");return a(),u(z,null,[s("div",null,[s("div",null,[s("p",ie,l(e.$t("room")),1)]),t.loading?(a(),u("div",ae)):r("",!0)]),i(Y,null,{default:h(()=>[s("div",null,[i(te,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":o[0]||(o[0]=n=>e.isSuccessModalOpen=n),"max-width":"400px"},{default:h(()=>[i(Y,null,{default:h(()=>[i(R,null,{default:h(()=>[w(l(e.$t("Success!")),1)]),_:1}),i(H,null,{default:h(()=>[w(l(e.$t("Data seeded successfully!")),1)]),_:1}),i(j,null,{default:h(()=>[i(W,{onClick:d.closeSuccessModal,color:"success"},{default:h(()=>[w(l(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),i(oe,{class:"p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:K(e.seedData,["prevent"])},{default:h(()=>{var n,S,T,x,M;return[s("div",ne,[s("label",re,l(e.$t("roomnumber")),1),i(b,{required:"",class:"bg-[#f7f5f5]",modelValue:t.rooms.name,"onUpdate:modelValue":o[1]||(o[1]=p=>t.rooms.name=p),placeholder:e.$t("roomnumber")},null,8,["modelValue","placeholder"]),(n=t.error)!=null&&n.name?(a(),u("div",de,l(t.error.name[0]),1)):r("",!0)]),s("div",me,[s("label",ue,l(e.$t("roomdoctor")),1),i(f,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.admin_id,"onUpdate:modelValue":o[2]||(o[2]=p=>t.rooms.admin_id=p),"option-value":"id",filter:"",options:t.doctors,optionLabel:"name",placeholder:e.$t("roomdoctor"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(S=t.error)!=null&&S.admin_id?(a(),u("div",pe,l(t.error.admin_id[0]),1)):r("",!0)]),s("div",ce,[s("label",he,l(e.$t("typeroom")),1),i(f,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.type_tow,"onUpdate:modelValue":o[3]||(o[3]=p=>t.rooms.type_tow=p),"option-value":"value",options:d.arr2(),optionLabel:"name",placeholder:e.$t("typeroom"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(T=t.error)!=null&&T.type_tow?(a(),u("div",_e,l(t.error.type_tow[0]),1)):r("",!0)]),t.rooms.type_tow==2?(a(),u("div",ve,[s("label",fe,l(e.$t("typeroom")),1),i(f,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.type,"onUpdate:modelValue":o[4]||(o[4]=p=>t.rooms.type=p),"option-value":"value",options:d.arr(),optionLabel:"name",placeholder:e.$t("typeroom"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(x=t.error)!=null&&x.type?(a(),u("div",ge,l(t.error.type[0]),1)):r("",!0)])):r("",!0),t.rooms.type_tow!=0&&t.rooms.type!=0&&t.rooms.type_tow?(a(),u("div",ye,[s("label",be,l(e.$t("roomsnumber")+" "),1),i(U,{required:"",class:"bg-[#f7f5f5]",modelValue:t.rooms.capacity,"onUpdate:modelValue":o[5]||(o[5]=p=>t.rooms.capacity=p),placeholder:e.$t("roomsnumber")},null,8,["modelValue","placeholder"]),(M=t.error)!=null&&M.capacity?(a(),u("div",we,l(t.error.capacity[0]),1)):r("",!0)])):r("",!0),s("div",ke,[s("label",Ve,l(e.$t("gruop_sessaion")),1),t.buttomaddcal?(a(),g(y,{key:0,onClick:d.createtreatment,loading:t.timeshow,class:"create m-auto w-full lg:w-[50%]",icon:"pi pi-plus",label:e.$t("Add_appointment")},null,8,["onClick","loading","label"])):r("",!0),Ce])]}),_:1},8,["onSubmit"]),i(L),s("div",De,[t.FullCalendarshow?(a(),g(A,{key:0,options:t.opts,onChange:o[6]||(o[6]=n=>d.refreshEvents()),ref:"fullCalendar",dayRender:d.highlightSelectedDay},null,8,["options","dayRender"])):r("",!0),s("div",Se,[i(E,{visible:t.visible,"onUpdate:visible":o[11]||(o[11]=n=>t.visible=n),id:"modal",modal:"",header:t.modal_text,style:{width:"40vw"}},{default:h(()=>[s("form",null,[s("div",null,[t.updat_event?(a(),u("div",Te,[s("label",xe,l(e.$t("start_date")),1),i(D,{style:{width:"100%"},showButtonBar:"",modelValue:t.start_event,"onUpdate:modelValue":o[7]||(o[7]=n=>t.start_event=n),modelModifiers:{number:!0},showIcon:"",placeholder:"dd/mm/yy"},null,8,["modelValue"])])):r("",!0),t.updat_event?(a(),u("div",Me,[s("label",Fe,l(e.$t("end_date")),1),i(D,{style:{width:"100%"},showButtonBar:"",modelValue:t.end_event,"onUpdate:modelValue":o[8]||(o[8]=n=>t.end_event=n),modelModifiers:{number:!0},showIcon:"",placeholder:"dd/mm/yy"},null,8,["modelValue"])])):r("",!0),s("div",null,[s("label",Ye,l(e.$t("from")),1),I(s("input",{class:"cal",type:"time",name:"time_start",id:"time_start","onUpdate:modelValue":o[9]||(o[9]=n=>t.time_start=n),style:{"border-radius":"5px"}},null,512),[[B,t.time_start]])]),s("div",null,[s("label",Ie,l(e.$t("to")),1),I(s("input",{class:"cal",type:"time",name:"time_end",id:"time_end","onUpdate:modelValue":o[10]||(o[10]=n=>t.time_end=n),style:{"border-radius":"5px"}},null,512),[[B,t.time_end]])]),t.creat_event?(a(),g(y,{key:2,style:{"background-color":"rgb(4, 171, 4)",border:"0"},label:"Create ",loading:t.loading,onClick:d.createvent},null,8,["loading","onClick"])):r("",!0),t.updat_event?(a(),g(y,{key:3,icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",loading:t.loading,onClick:d.updateevent},null,8,["loading","onClick"])):r("",!0),t.updat_event?(a(),g(y,{key:4,icon:"pi pi-trash",class:"delete mt-2",loading:t.loading,onClick:d.deletevent},null,8,["loading","onClick"])):r("",!0)])])]),_:1},8,["visible","header"])])])])]),_:1})],64)}const qe=N(se,[["render",Be],["__scopeId","data-v-4ca0ade2"]]);export{qe as default};