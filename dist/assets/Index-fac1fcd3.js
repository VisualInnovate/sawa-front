import{_ as C,G as k,a as V,bp as T,c as r,r as p,o as f,d as S,f as n,w as u,e as o,x as E,g as M,D as H,t as d,E as v,K as U,T as A,F as B}from"./main-f9d3afa8.js";import{h as m}from"./moment-fbc5633a.js";import{F,i as G,a as L,b as I,c as Y,l as $}from"./index-77742b22.js";import"./flowbite-vue-6bc782d8.js";const q={components:{FullCalendar:F,Calendar:k,InputText:V},data(){return{filter:{},childreen:[],evaluate_types:[{name:"side profile",id:1},{name:"milestone",id:2},{name:"barrier",id:3},{name:"ablls",id:4},{name:"carolina",id:5}],event_types:[{name:"تقيممات",id:1},{name:"اجتماعات",id:2}],users:[],business_hours:[],langStore:T(),visible:!1,updateevent:!1,event:{color:"87ceeb"},submitted:!1,employees:[],days:[0,1,2,3,4,5,6],doctorshow:"",create_visible:!1,event_id:null,opts:{plugins:[G,L,I,Y],initialView:"dayGridMonth",locale:null,slotDuration:"00:30:00",slotLabelInterval:"00:30:00",hiddenDays:[],slotMinTime:"00:00:00",slotMaxTime:"00:00:00",selectable:!0,editable:!0,validRange:{start:new Date},headerToolbar:{left:"title",center:"prev next today",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},selectAllow:e=>{const i=this.$refs.fullCalendar.getApi().getEvents();for(let a of i)if(m(e.start).isSame(a.start,"day")&&(e.start>=a.start&&e.start<a.end||e.end>a.start&&e.end<=a.end))return!1;return!0},eventClick:this.handleEventClick.bind(this),dateClick:this.handleDateClick,datesSet:this.handleDatesSet.bind(this),select:this.handleSelect.bind(this)}}},methods:{goBack(){this.$router.go(-1)},fetchEmployees(){r.get("api/employees").then(e=>{this.employees=e.data.data}).catch(e=>console.error("Error retrieving doctors:",e))},handleDatesSet(e){if(this.business_hours.length>=1){const t=new Date(e.startStr);this.opts.slotMinTime=this.business_hours.find(i=>i.day===t.getDay()).start,this.opts.slotMaxTime=this.business_hours.find(i=>i.day===t.getDay()).end}},getClidreen(){r.get("/api/child").then(e=>{this.childreen=e.data.children})},updateEvents(){r.get(`/api/event-calendar?employee_id=${this.event.employee_id}&type=${this.event.type}`).then(e=>{this.opts.events=e.data.data.map(t=>({title:t.title,start:t.start,end:t.end,type:t.type,col:t.color,id:t.id,backgroundColor:"#"+t.color}))})},create(){r.post("api/evaluation-request",{employee_id:this.event.employee_id,color:this.event.color,title:this.event.title,evaluation_type:this.event.evaluation_type,consultant_id:this.event.employee_id,child_id:this.event.child_id,date:m(this.event.start).format(" YYYY-MM-DD"),start_time:m(this.event.start).format("HH:mm:ss"),end_time:m(this.event.end).format("HH:mm:ss")}).then(e=>{this.visible=!this.visible,this.$toast.add({severity:"success",summary:this.$t("success_message"),detail:`${this.$t("element_add_success")}`,life:3e3}),this.getTimes()}).catch(e=>{this.$toast.add({severity:"error",summary:this.$t("error"),detail:`${this.$t("mission_error")}`,life:3e3})})},getTimes(e){r.get(`api/employees/get/with/calendar/${this.event.employee_id}?type=${e}`).then(t=>{this.business_hours=t.data.data.days.map(i=>({day:new Date(i.start).getDay(),start:m(i.start).format("HH:mm:ss"),end:m(i.end).format("HH:mm:ss")})),this.opts.events=t.data.data.booked.map(i=>({title:i.title,start:i.date+"T"+i.start_time+"+02:00",end:i.date+"T"+i.end_time+"+02:00",backgroundColor:"#"+i.color}))})},handleEventClick(e){console.log(e),this.event_id=e.event.id,this.event.title=e.event.title,this.event.color="#"+e.event.color,this.event.child_id=e.event.child_id,this.event.start_time=m(e.event.start).format("HH:mm:ss"),this.event.end_time=m(e.event.end).format("HH:mm:ss"),this.updateevent=!0},handleSelect(e){const t=new Date(e.startStr);this.opts.slotMinTime=this.business_hours.find(i=>i.day===t.getDay()).start,this.opts.slotMaxTime=this.business_hours.find(i=>i.day===t.getDay()).end,e.view.type=="dayGridMonth"?this.$refs.fullCalendar.getApi().changeView("timeGridDay",e.startStr):(this.event.start=e.startStr,this.event.end=e.endStr,this.visible=!0)},createEvent(){r.post("/api/event-calendar",this.event).then(()=>{this.updateEvents(),this.visible=!1,this.$toast.add({severity:"success",summary:this.$t("success_message"),detail:`${this.$t("element_add_success")}`,life:3e3})}).catch(e=>{this.$toast.add({severity:"error",summary:this.$t("error"),detail:`${e.response.data.message}`,life:3e3})})},updateEvent(){r.put(`/api/event-calendar/${this.event_id}`,this.event).then(()=>{this.updateevent=!1,this.updateEvents()})},deleteEvent(){r.delete("api/evaluations/44/delete").then(e=>{})},resetModal(){this.visible=!1,this.updateevent=!1,this.event={color:"87ceeb"}}},watch:{business_hours(e,t){if(e.length>=1){const i=e.map(a=>a.day);this.opts.hiddenDays=this.days.filter(a=>!i.includes(a))}else this.opts.hiddenDays=[]}},mounted(){this.getClidreen(),this.fetchEmployees(),this.doctorshow=localStorage.getItem("type"),this.opts.locale=localStorage.appLang==="en"?null:$}},N={class:"flex"},z={class:"flex flex-column"},P={class:"text-right"},W={class:"flex flex-column"},K={class:"text-right"},R={class:"flex flex-column gap-2 py-1"},j={class:"w-full text-right",for:"username"},J={class:"flex flex-column gap-2 py-1"},O={class:"w-full text-right",for:"username"},Q={class:"w-full text-center"},X={class:"font-bold text-xl text-center py-1"},Z={class:"font-bold text-lg text-center py-1"};function ee(e,t,i,a,s,h){const c=p("Dropdown"),b=p("Toolbar"),g=p("FullCalendar"),x=p("InputText"),w=p("ColorPicker"),_=p("Button"),y=p("Dialog"),D=p("Toast");return f(),S(B,null,[n(A,{class:"p-[1%] bg-slate-50"},{default:u(()=>[n(b,{class:"mb-4 shadow-md"},{start:u(()=>[o("div",N,[n(c,{"onUpdate:modelValue":[t[0]||(t[0]=l=>s.event.type=""),t[1]||(t[1]=l=>s.event.employee_id=l)],placeholder:e.$t("employee_name"),id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:s.event.employee_id,"option-value":"id",filter:"",options:s.employees,optionLabel:"name",class:"mx-2"},null,8,["placeholder","modelValue","options"]),n(c,{loading:!s.event.employee_id,"onUpdate:modelValue":[h.getTimes,t[2]||(t[2]=l=>s.event.type=l)],placeholder:e.$t("type_work"),id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:s.event.type,"option-value":"id",filter:"",options:s.event_types,optionLabel:"name"},null,8,["loading","onUpdate:modelValue","placeholder","modelValue","options"])])]),end:u(()=>[]),_:1}),s.business_hours.length>=1?(f(),E(g,{key:0,options:s.opts,ref:"fullCalendar"},null,8,["options"])):M("",!0),n(y,{visible:s.visible,"onUpdate:visible":t[9]||(t[9]=l=>s.visible=l),id:"modal",modal:"",header:e.$t("submit"),style:{width:"40vw"}},{default:u(()=>[o("form",{onSubmit:t[8]||(t[8]=H((...l)=>h.create&&h.create(...l),["prevent"])),class:""},[o("div",z,[o("label",P,d(e.$t("title")),1),n(x,{modelValue:s.event.title,"onUpdate:modelValue":t[3]||(t[3]=l=>s.event.title=l),class:v({"p-invalid":s.submitted&&!s.event.title})},null,8,["modelValue","class"])]),o("div",W,[o("label",K,d(e.$t("color")),1),n(w,{style:U({"background-color":"#"+s.event.color}),class:"w-full h-[50px] mb-2",modelValue:s.event.color,"onUpdate:modelValue":t[4]||(t[4]=l=>s.event.color=l)},null,8,["style","modelValue"])]),o("div",R,[o("label",j,d(e.$t("evalute_type")),1),n(c,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:s.event.evaluation_type,"onUpdate:modelValue":t[5]||(t[5]=l=>s.event.evaluation_type=l),"option-value":"id",options:s.evaluate_types,optionLabel:"name",class:v(["w-full",{"p-invalid":s.submitted&&!s.event.evaluation_type}])},null,8,["modelValue","options","class"])]),o("div",J,[o("label",O,d(e.$t("child_name")),1),n(c,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:s.event.child_id,"onUpdate:modelValue":t[6]||(t[6]=l=>s.event.child_id=l),"option-value":"id",filter:"",options:s.childreen,optionLabel:"name",class:v(["w-full",{"p-invalid":s.submitted&&!s.event.child_id}])},null,8,["modelValue","options","class"])]),o("div",Q,[n(_,{type:"submit",onClick:t[7]||(t[7]=l=>s.submitted=!0),class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])],32)]),_:1},8,["visible","header"]),n(y,{visible:s.updateevent,"onUpdate:visible":t[10]||(t[10]=l=>s.updateevent=l),id:"modal",modal:"",header:e.modal_text,style:{width:"40vw"}},{default:u(()=>[o("form",null,[o("h2",X,d(s.event.title),1),o("p",Z,d(e.$t("from"))+" "+d(s.event.start_time)+" "+d(e.$t("to"))+" "+d(s.event.end_time),1),n(_,{class:"delete mt-3",icon:"pi pi-trash",onClick:h.deleteEvent},null,8,["onClick"])])]),_:1},8,["visible","header"])]),_:1}),n(D)],64)}const oe=C(q,[["render",ee],["__scopeId","data-v-27618fa8"]]);export{oe as default};
