import{_ as N,H as j,a9 as q,b5 as I,T as w,z as c,E as _,l as v,o as i,e as n,h as o,t as l,q as r,x as a,y as p,X as M,a4 as R,i as x,a1 as A,a6 as G,$ as O,n as P,F as T,B as H,w as F,p as U,f as y,Q as W,R as z}from"./main-8edbc651.js";import{F as K,i as Q,a as X,b as J,c as Z,l as C}from"./ar-6afb5a4e.js";import{V as $}from"./VDialog-856a43a2.js";import{V as ee}from"./VForm-c151f62f.js";const te={components:{FullCalendar:K,Calendar:j},data(){return{setiontype:"",programes:{},child:{},rooms:{},error:{},doctors:{},isSubmitting:!1,programe_type:{},toast:q(),room_id:"",slot_id:"",student:{},capasityboj:{},capasity:[],maxcapsity:"",treaments:{},time_sloteobj:{},time_slots:[],time_slotename:[],buttomaddcal:!0,timeshow:!1,FullCalendarshow:!1,langStore:I(),visible:!1,create_visible:!1,event_id:null,creat_event:w(!1),updat_event:w(!1),event_title:"",start_event:"",end_event:"",loading:!1,modal_text:"",time_start:"",time_end:"",opts:{plugins:[Q,X,J,Z],initialView:"dayGridMonth",footerToolbar:!0,valid:!1,buttonIcons:!1,locale:null,validRange:{start:new Date},selectable:!0,droppable:!1,editable:!0,selectHelper:!0,validRange:{start:new Date},headerToolbar:{center:"prev next today",left:"title",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},eventsTimeFormat:{hour:"2-digit",minute:"2-digit",second:"2-digit"},eventDrop:function(e){console.log(e.event.id),c.post(`/api/calender/${e.event.id}/update`,{start:e.event.start,end:e.event.end}).then(s=>{console.log(s.data.k)})},eventDrop:function(e){c.post(`/api/calender/${e.event.id}/update`,{title:e.event.title,start:_(e.event.start).format("00:00:00 YYYY-MM-d"),end:_(e.event.end).format("00:00:00 YYYY-MM-d")}).then(s=>{console.log(s.data.k)})},eventClick:(function(e){this.event_id=e.event.id,this.event_title=e.event.title,this.modal_text=this.$t("update_event"),this.creat_event=!1,this.updat_event=!0,this.handleEventClick(e),this.time_slotename.push(e.event.title),console.log(this.time_slotename),this.pushtimeslot(),this.start_event=_(e.event.start).format("YYYY-MM-DD"),this.end_event=_(e.event.end).format("YYYY-MM-DD"),console.log(this.start_event)}).bind(this),select:(function(e){console.log(e),this.event_title="",this.modal_text=this.$t("create_event"),this.creat_event=!0,this.updat_event=!1,this.visible=!0,console.log(e),this.start_event=_(e.start).format("YYYY-MM-DD"),this.end_event=_(e.end).format("YYYY-MM-DD"),console.log(e.backgroundColor)}).bind(this)}}},methods:{handleEventClick(e){console.log(e);const s=e.event;console.log(s),s.setProp("backgroundColor","green"),s.setProp("visibility","hidden")},Therapeutic(){this.$router.push({name:"student-programe"})},programetype(){return this.roomType=[{name:this.$t("diurnal"),value:0},{name:this.$t("Clinics"),value:1},{name:this.$t("house"),value:2}]},deletearray(){this.capasity.length=this.capasity.length-1},addarray(){c.get(`/api/treatment/${this.student.Type}`).then(e=>{this.capasityboj={treatment_id:this.student.Type,sessions_number:this.student.sessions_number,name:e.data.data.name},this.capasity.push(this.capasityboj),this.maxcapsity=this.maxcapsity-this.student.sessions_number}),console.log(this.capasity)},getprograme(e){this.capasity=[],c.get(`/api/program/${this.student.program_id}`).then(s=>{this.maxcapsity=s.data.data.sessions_number,this.setiontype=s.data.data.session_type})},getalltreatement(){c.get("api/treatment/all").then(e=>{this.treaments=e.data.data,console.log(this.doctors)}).catch(e=>{console.error("Error retrieving doctors:",e)})},getallchild(){c.get("api/child").then(e=>{this.child=e.data.children,console.log(this.doctors)}).catch(e=>{console.error("Error retrieving doctors:",e)})},pushtimeslot(){this.time_sloteobj={time_slot_id:this.event_id},this.time_slots.push(this.time_sloteobj),console.log(this.time_slots)},getallprogrames(){c.get("api/program").then(e=>{this.programes=e.data.data,console.log(this.doctors)}).catch(e=>{console.error("Error retrieving doctors:",e)})},getAllDoctor(){c.get(`api/student-program/auto_assign/${this.student.student_id}`).then(e=>{this.doctors=e.data.doctors,console.log(this.doctors)}).catch(e=>{console.error("Error retrieving doctors:",e)})},createtreatment(){c.post("/api/student-program",{program_id:this.student.program_id,student_id:this.student.student_id,details:this.capasity,time_slots:this.time_slots}).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{this.timeshow=!this.timeshow,console.log(e.response.data.errors.name),this.error=e.response.data.errors})},closeSuccessModal(){this.isSuccessModalOpen=!1},highlightSelectedDay(e){this.$store.state.calendar.selectedDay===e.dateStr&&e.el.classList.add("selected-day")},loo(){localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=C},goBack(){this.$router.go(-1)},deletevent(e){console.log(e),c.delete(`/api/calender/${this.event_id}/delete`).then(s=>{}),this.update(),setTimeout(()=>{this.visible=!1,this.event_title=null,this.loading=!1},700)},updateevent(){c.post(`/api/calender/${this.event_id}/update`,{title:this.event_title,start:_(this.start_event).format(" YYYY-MM-d"),end:_(this.end_event).format(" YYYY-MM-d")}).then(e=>{}),setTimeout(()=>{this.visible=!1,this.event_title=null,this.event_id=null,this.loading=!1},700)},createvent(){this.loading=!0,c.post("/api/slot",{title:this.event_title,date:this.start_event,from:this.time_start,to:this.time_end,room_id:this.room_id}).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3}),this.visible=!1,e.status!=200&&(this.valid=!0)}).catch(e=>{this.error=e.response.data.errors}),setTimeout(()=>{this.update(),this.event_title=null,this.start_event=null,this.end_event=null,this.create_visible=!1,this.loading=!1},2e3)},update(){c.get("/api/slot").then(e=>{console.log(e.data.data),this.opts.events=e.data.data.map(s=>({title:"from "+s.from+" to "+s.to,start:s.date,end:s.date,id:s.id}))})},refreshEvents(){this.$refs.calendar.$emit("refetch-events")}},mounted(){this.update(),this.getallprogrames(),this.getallchild(),this.getalltreatement(),localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=C,console.log(localStorage.appLang),console.log(this.opts)},watch:{"langStore.appLang"(e){e=="en"?this.opts.locale="":this.opts.locale=C,this.update()}}},se=e=>(W("data-v-5fafd96c"),e=e(),z(),e),oe={key:0,class:"loader"},le={class:"flex flex-column gap-2"},ie={for:"username"},ae={key:0,class:"mt-1 mb-5 text-red-500"},re={class:"flex flex-column gap-2"},ne={for:"username"},de={key:0,class:"mt-1 mb-5 text-red-500"},ce={class:"flex flex-column gap-2"},ue={for:"username"},me={key:0,class:"mt-1 mb-5 text-red-500"},pe={class:"flex flex-column gap-2 invisible"},he={for:"username"},_e={key:0,class:"mt-1 mb-5 text-red-500"},ge={key:0,class:"flex flex-column gap-2"},fe={for:"username"},ve={key:0,class:"mt-1 mb-5 text-red-500"},be={key:1,class:"flex flex-column gap-2"},ye={for:"username"},ke={class:"flex"},xe={key:0,class:"mt-1 mb-5 text-red-500"},Ce={class:"p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-1 gap-4"},Ve={class:"px-[2%] py-1 flex"},De={class:"px-4"},Ye={key:0,class:"mt-1 mb-5 text-red-500"},Se={class:"card flex justify-content-center"},we={for:"time_start"},Me={key:0,class:"mt-1 mb-5 text-red-500"},Te={for:"time_end"},Fe={key:0,class:"mt-1 mb-5 text-red-500"},Ue={class:"flex flex-column gap-2 w-full"},Ee=se(()=>o("small",{id:"username-help"},null,-1));function Le(e,s,Be,Ne,t,u){const b=v("Dropdown"),V=v("InputNumber"),g=v("Button"),E=v("Toast"),L=v("FullCalendar"),B=v("Dialog");return i(),n(T,null,[o("div",null,[o("div",null,[o("p",{class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold",onClick:s[0]||(s[0]=k=>u.Therapeutic())},l(e.$t("add_sp")),1)]),t.loading?(i(),n("div",oe)):r("",!0)]),a(M,null,{default:p(()=>{var k;return[o("div",null,[a($,{modelValue:e.isSuccessModalOpen,"onUpdate:modelValue":s[1]||(s[1]=d=>e.isSuccessModalOpen=d),"max-width":"400px"},{default:p(()=>[a(M,null,{default:p(()=>[a(R,null,{default:p(()=>[x(l(e.$t("Success!")),1)]),_:1}),a(A,null,{default:p(()=>[x(l(e.$t("Data seeded successfully!")),1)]),_:1}),a(G,null,{default:p(()=>[a(O,{onClick:u.closeSuccessModal,color:"success"},{default:p(()=>[x(l(e.$t("OK")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),a(ee,{class:"p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:P(e.seedData,["prevent"])},{default:p(()=>{var d,h,f,D,Y,S;return[o("div",le,[o("label",ie,l(e.$t("ProgramName")),1),a(b,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.program_id,"onUpdate:modelValue":[s[2]||(s[2]=m=>t.student.program_id=m),u.getprograme],"option-value":"id",filter:"",options:t.programes,optionLabel:"name",placeholder:e.$t("ProgramName"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","onUpdate:modelValue","options","placeholder"]),(d=t.error)!=null&&d.program_id?(i(),n("div",ae,l(t.error.program_id[0]),1)):r("",!0)]),o("div",re,[o("label",ne,l(e.$t("child_name")),1),a(b,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.student_id,"onUpdate:modelValue":[s[3]||(s[3]=m=>t.student.student_id=m),u.getAllDoctor],"option-value":"id",filter:"",options:t.child,optionLabel:"name",placeholder:e.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","onUpdate:modelValue","options","placeholder"]),(h=t.error)!=null&&h.student_id?(i(),n("div",de,l(t.error.student_id[0]),1)):r("",!0)]),o("div",ce,[o("label",ue,l(e.$t("roomdoctor")),1),a(b,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.roomdoctor,"onUpdate:modelValue":s[4]||(s[4]=m=>t.student.roomdoctor=m),"option-value":"id",filter:"",options:t.doctors,optionLabel:"name",placeholder:e.$t("roomdoctor"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(f=t.error)!=null&&f.admin_id?(i(),n("div",me,l(t.error.admin_id[0]),1)):r("",!0)]),o("div",pe,[o("label",he,l(e.$t("Sn")),1),a(V,{required:"",class:"bg-[#f7f5f5]",modelValue:t.student.capacity,"onUpdate:modelValue":s[5]||(s[5]=m=>t.student.capacity=m),placeholder:e.$t("Sn")},null,8,["modelValue","placeholder"]),(D=t.error)!=null&&D.capacity?(i(),n("div",_e,l(t.error.capacity[0]),1)):r("",!0)]),t.student.program_id&&t.maxcapsity>0&&t.setiontype!=1?(i(),n("div",ge,[o("label",fe,l(e.$t("Typetreatment"))+"-",1),a(b,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.Type,"onUpdate:modelValue":s[6]||(s[6]=m=>t.student.Type=m),"option-value":"id",filter:"",options:t.treaments,optionLabel:"name",placeholder:e.$t("Typetreatment"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(Y=t.error)!=null&&Y.details?(i(),n("div",ve,l(t.error.details[0]),1)):r("",!0)])):r("",!0),t.student.program_id&&t.maxcapsity>0&&t.setiontype!=1?(i(),n("div",be,[o("label",ye,l(e.$t("Sn"))+" ("+l(t.maxcapsity)+")",1),o("div",ke,[a(V,{max:t.maxcapsity,min:1,required:"",class:"bg-[#f7f5f5] w-[90%]",modelValue:t.student.sessions_number,"onUpdate:modelValue":s[7]||(s[7]=m=>t.student.sessions_number=m),placeholder:e.$t("Sn")},null,8,["max","modelValue","placeholder"]),a(g,{onClick:u.addarray,class:"create m-auto s",icon:"pi pi-plus"},null,8,["onClick"]),a(g,{onClick:u.deletearray,class:"delete m-auto s",icon:"pi pi-minus"},null,8,["onClick"])]),(S=t.error)!=null&&S.details?(i(),n("div",xe,l(t.error.details[0]),1)):r("",!0)])):r("",!0)]}),_:1},8,["onSubmit"]),o("div",Ce,[o("div",Ve,[o("ol",null,[(i(!0),n(T,null,H(t.capasity,(d,h)=>(i(),n("li",{key:h},l(h+1)+" - "+l(d.name)+" - "+l(e.$t("Sn"))+" - "+l(d.sessions_number),1))),128))])])]),a(E),o("div",De,[a(L,{options:t.opts,onChange:s[8]||(s[8]=d=>u.refreshEvents()),ref:"fullCalendar",dayRender:u.highlightSelectedDay},null,8,["options","dayRender"]),(k=t.error)!=null&&k.time_slots?(i(),n("div",Ye,l(t.error.time_slots[0]),1)):r("",!0),o("div",Se,[a(B,{visible:t.visible,"onUpdate:visible":s[11]||(s[11]=d=>t.visible=d),id:"modal",modal:"",header:t.modal_text,style:{width:"40vw"}},{default:p(()=>{var d,h;return[o("form",null,[o("div",null,[o("div",null,[o("label",we,l(e.$t("from")),1),F(o("input",{class:"cal",type:"time",name:"time_start",id:"time_start","onUpdate:modelValue":s[9]||(s[9]=f=>t.time_start=f),style:{"border-radius":"5px"}},null,512),[[U,t.time_start]]),(d=t.error)!=null&&d.from?(i(),n("div",Me,l(t.error.from[0]),1)):r("",!0)]),o("div",null,[o("label",Te,l(e.$t("to")),1),F(o("input",{class:"cal",type:"time",name:"time_end",id:"time_end","onUpdate:modelValue":s[10]||(s[10]=f=>t.time_end=f),style:{"border-radius":"5px"}},null,512),[[U,t.time_end]]),(h=t.error)!=null&&h.to?(i(),n("div",Fe,l(t.error.to[0]),1)):r("",!0)]),t.creat_event?(i(),y(g,{key:0,style:{"background-color":"rgb(4, 171, 4)",border:"0"},label:"Create ",loading:t.loading,onClick:u.createvent},null,8,["loading","onClick"])):r("",!0),t.updat_event?(i(),y(g,{key:1,style:{"background-color":"#6241f1","margin-left":"10px","margin-right":"10px",border:"0"},label:"update ",loading:t.loading,onClick:u.updateevent},null,8,["loading","onClick"])):r("",!0),t.updat_event?(i(),y(g,{key:2,style:{"background-color":"#b00020",border:"0"},label:"Delet ",loading:t.loading,onClick:u.deletevent},null,8,["loading","onClick"])):r("",!0)])])]}),_:1},8,["visible","header"])]),o("div",Ue,[t.buttomaddcal?(i(),y(g,{key:0,onClick:u.createtreatment,class:"create m-auto w-full lg:w-[50%]",label:e.$t("submit")},null,8,["onClick","label"])):r("",!0),Ee])])])]}),_:1})],64)}const Ae=N(te,[["render",Le],["__scopeId","data-v-5fafd96c"]]);export{Ae as default};