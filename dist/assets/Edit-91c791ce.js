import{_ as I,H as $,a9 as B,b5 as L,T as V,z as r,E as h,l as p,o as d,e as _,h as s,t as a,q as u,x as l,y as m,X as x,a4 as U,i as v,a1 as A,a6 as N,$ as R,n as q,w as T,p as S,f as g,F as G,Q as O,R as H}from"./main-bdf9978d.js";import{F as W,i as j,a as z,b as K,c as Q,l as b}from"./ar-f815b28e.js";import{V as X}from"./VDialog-7acaa3ef.js";import{V as J}from"./VForm-6e1ba28a.js";const P={components:{FullCalendar:W,Calendar:$},data(){return{rooms:{},error:{},doctors:{},isSubmitting:!1,programe_type:{},toast:B(),room_id:"",slot_id:"",buttomaddcal:!0,timeshow:!1,FullCalendarshow:!1,langStore:L(),visible:!1,create_visible:!1,event_id:null,creat_event:V(!1),updat_event:V(!1),event_title:"",start_event:"",end_event:"",loading:!1,modal_text:"",time_start:"",time_end:"",opts:{plugins:[j,z,K,Q],initialView:"dayGridMonth",footerToolbar:!0,valid:!1,buttonIcons:!1,locale:null,validRange:{start:new Date},selectable:!0,droppable:!1,editable:!0,selectHelper:!0,validRange:{start:new Date},headerToolbar:{center:"prev next today",left:"title",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},eventsTimeFormat:{hour:"2-digit",minute:"2-digit",second:"2-digit"},eventDrop:function(e){console.log(e.event.id),r.post(`/api/calender/${e.event.id}/update`,{start:e.event.start,end:e.event.end}).then(o=>{console.log(o.data.k)})},eventDrop:function(e){r.post(`/api/calender/${e.event.id}/update`,{title:e.event.title,start:h(e.event.start).format("00:00:00 YYYY-MM-d"),end:h(e.event.end).format("00:00:00 YYYY-MM-d")}).then(o=>{console.log(o.data.k)})},eventClick:(function(e){this.event_id=e.event.id,this.event_title=e.event.title,this.modal_text=this.$t("update_event"),this.creat_event=!1,this.updat_event=!0,this.getslotid(),this.visible=!0,this.start_event=h(e.event.start).format("YYYY-MM-DD"),this.end_event=h(e.event.end).format("YYYY-MM-DD"),console.log(e.event._def.publicId)}).bind(this),select:(function(e){console.log(e),this.event_title="",this.time_start="",this.time_end="",this.modal_text=this.$t("create_event"),this.creat_event=!0,this.updat_event=!1,this.visible=!0,console.log(e),this.start_event=h(e.start).format("YYYY-MM-DD"),this.end_event=h(e.end).format("YYYY-MM-DD"),console.log(e.backgroundColor)}).bind(this)}}},methods:{Therapeutic(){this.$router.push({name:"Rooms"})},arr(){return this.roomType=[{name:this.$t("typeroom2"),value:0},{name:this.$t("typeroom1"),value:1},{name:this.$t("typeroom3"),value:2}]},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},getTreatmentTypes(){r.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getprograme(){r.get("api/treatmentcounts").then(e=>{console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getAllDoctor(){r.get("api/doctors").then(e=>{this.doctors=e.data.doctors,console.log(this.doctors),this.update()}).catch(e=>{console.error("Error retrieving doctors:",e)})},createtreatment(){r.put(`/api/room/${this.$route.params.id}`,this.rooms).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{console.log(e.response.data.errors.name),this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1},highlightSelectedDay(e){this.$store.state.calendar.selectedDay===e.dateStr&&e.el.classList.add("selected-day")},loo(){localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=b},goBack(){this.$router.go(-1)},deletevent(e){console.log(e),r.delete(`/api/slot/${this.event_id}`).then(o=>{this.update(),this.visible=!1}),setTimeout(()=>{this.event_title=null,this.loading=!1},700)},updateevent(){r.put(`/api/slot/${this.event_id}`,{date:this.start_event,from:this.time_start,to:this.time_end,room_id:this.$route.params.id}).then(e=>{this.update(),this.visible=!1}),setTimeout(()=>{this.event_title=null,this.event_id=null,this.loading=!1},700)},createvent(){this.loading=!0,r.post("/api/slot",{title:this.event_title,date:this.start_event,from:this.time_start,to:this.time_end,room_id:this.$route.params.id}).then(e=>{this.slot_id=e.data.data.id,this.visible=!1,e.status!=200&&(this.valid=!0)}),setTimeout(()=>{this.update(),this.event_title=null,this.start_event=null,this.end_event=null,this.create_visible=!1,this.loading=!1},2e3)},update(){r.get(`/api/room/${this.$route.params.id}`).then(e=>{console.log(e.data.data),this.rooms.name=e.data.data.name,this.rooms.capacity=e.data.data.capacity,this.rooms.type=e.data.data.type,this.rooms.admin_id=e.data.data.admin_id,this.opts.events=e.data.data.slots.map(o=>({title:o.date,start:o.date,end:o.date,id:o.id}))})},getslotid(){r.get(`/api/slot/${this.event_id}`).then(e=>{this.time_start=e.data.data.from,this.time_end=e.data.data.to}).catch(e=>{console.error("Error retrieving doctors:",e)})},refreshEvents(){this.$refs.calendar.$emit("refetch-events")}},mounted(){this.getAllDoctor(),localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=b,console.log(localStorage.appLang),console.log(this.opts)},watch:{"langStore.appLang"(e){e=="en"?this.opts.locale="":this.opts.locale=b,this.update()}}},Z=e=>(O("data-v-62fd929e"),e=e(),H(),e),ee={key:0,class:"loader"},te={class:"flex flex-column gap-2"},oe={for:"username"},se={key:0,class:"mt-1 mb-5 text-red-500"},le={class:"flex flex-column gap-2"},ae={for:"username"},ie={key:0,class:"mt-1 mb-5 text-red-500"},re={class:"flex flex-column gap-2"},ne={for:"username"},de={key:0,class:"mt-1 mb-5 text-red-500"},me={class:"flex flex-column gap-2"},ue={for:"username"},ce={key:0,class:"mt-1 mb-5 text-red-500"},pe={class:"px-4"},he={class:"card flex justify-content-center"},_e={for:"time_start"},fe={for:"time_end"},ve={class:"flex flex-column gap-2 w-full"},ge={style:{visibility:"hidden"},for:"username"},be=Z(()=>s("small",{id:"username-help"},null,-1));function ye(e,o,ke,Ce,t,n){const Y=p("InputText"),y=p("Dropdown"),w=p("InputNumber"),M=p("Toast"),F=p("FullCalendar"),f=p("Button"),E=p("Dialog");return d(),_(G,null,[s("div",null,[s("div",null,[s("p",{class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold",onClick:o[0]||(o[0]=i=>n.Therapeutic())},a(e.$t("room")),1)]),t.loading?(d(),_("div",ee)):u("",!0)]),l(x,null,{default:m(()=>[s("div",null,[l(X,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":o[1]||(o[1]=i=>e.isSuccessModalOpen=i),"max-width":"400px"},{default:m(()=>[l(x,null,{default:m(()=>[l(U,null,{default:m(()=>[v(a(e.$t("Success!")),1)]),_:1}),l(A,null,{default:m(()=>[v(a(e.$t("Data seeded successfully!")),1)]),_:1}),l(N,null,{default:m(()=>[l(R,{onClick:n.closeSuccessModal,color:"success"},{default:m(()=>[v(a(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),l(J,{class:"p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:q(e.seedData,["prevent"])},{default:m(()=>{var i,k,C,D;return[s("div",te,[s("label",oe,a(e.$t("roomnumber")),1),l(Y,{required:"",class:"bg-[#f7f5f5]",modelValue:t.rooms.name,"onUpdate:modelValue":o[2]||(o[2]=c=>t.rooms.name=c),placeholder:e.$t("roomnumber")},null,8,["modelValue","placeholder"]),(i=t.error)!=null&&i.name?(d(),_("div",se,a(t.error.name[0]),1)):u("",!0)]),s("div",le,[s("label",ae,a(e.$t("roomdoctor")),1),l(y,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.admin_id,"onUpdate:modelValue":o[3]||(o[3]=c=>t.rooms.admin_id=c),"option-value":"id",filter:"",options:t.doctors,optionLabel:"name",placeholder:e.$t("roomdoctor"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(k=t.error)!=null&&k.admin_id?(d(),_("div",ie,a(t.error.admin_id[0]),1)):u("",!0)]),s("div",re,[s("label",ne,a(e.$t("typeroom")),1),l(y,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.rooms.type,"onUpdate:modelValue":o[4]||(o[4]=c=>t.rooms.type=c),"option-value":"value",options:n.arr(),optionLabel:"name",placeholder:e.$t("typeroom"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(C=t.error)!=null&&C.type?(d(),_("div",de,a(t.error.type[0]),1)):u("",!0)]),s("div",me,[s("label",ue,a(e.$t("roomsnumber")),1),l(w,{required:"",class:"bg-[#f7f5f5]",modelValue:t.rooms.capacity,"onUpdate:modelValue":o[5]||(o[5]=c=>t.rooms.capacity=c),placeholder:e.$t("roomsnumber")},null,8,["modelValue","placeholder"]),(D=t.error)!=null&&D.capacity?(d(),_("div",ce,a(t.error.capacity[0]),1)):u("",!0)])]}),_:1},8,["onSubmit"]),l(M),s("div",pe,[l(F,{style:{"max-height":"70vh"},options:t.opts,onChange:o[6]||(o[6]=i=>n.refreshEvents()),ref:"fullCalendar",dayRender:n.highlightSelectedDay},null,8,["options","dayRender"]),s("div",he,[l(E,{visible:t.visible,"onUpdate:visible":o[9]||(o[9]=i=>t.visible=i),id:"modal",modal:"",header:t.modal_text,style:{width:"40vw"}},{default:m(()=>[s("form",null,[s("div",null,[s("div",null,[s("label",_e,a(e.$t("from")),1),T(s("input",{class:"cal",type:"time",name:"time_start",id:"time_start","onUpdate:modelValue":o[7]||(o[7]=i=>t.time_start=i),style:{"border-radius":"5px"}},null,512),[[S,t.time_start]])]),s("div",null,[s("label",fe,a(e.$t("to")),1),T(s("input",{class:"cal",type:"time",name:"time_end",id:"time_end","onUpdate:modelValue":o[8]||(o[8]=i=>t.time_end=i),style:{"border-radius":"5px"}},null,512),[[S,t.time_end]])]),t.creat_event?(d(),g(f,{key:0,style:{"background-color":"rgb(4, 171, 4)",border:"0"},label:"Create ",loading:t.loading,onClick:n.createvent},null,8,["loading","onClick"])):u("",!0),t.updat_event?(d(),g(f,{key:1,style:{"background-color":"#6241f1","margin-left":"10px","margin-right":"10px",border:"0"},label:"update ",loading:t.loading,onClick:n.updateevent},null,8,["loading","onClick"])):u("",!0),t.updat_event?(d(),g(f,{key:2,style:{"background-color":"#b00020",border:"0"},label:"Delet ",loading:t.loading,onClick:n.deletevent},null,8,["loading","onClick"])):u("",!0)])])]),_:1},8,["visible","header"]),s("div",ve,[s("label",ge,a(e.$t("gruop_sessaion")),1),l(f,{onClick:n.createtreatment,class:"create m-auto w-full lg:w-[50%]",label:e.$t("submit")},null,8,["onClick","label"]),be])])])])]),_:1})],64)}const Se=I(P,[["render",ye],["__scopeId","data-v-62fd929e"]]);export{Se as default};
