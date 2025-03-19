import{_ as E,Q as T,a as F,bw as U,c as u,r,o as v,d as c,f as i,g as f,e as l,t as p,n as h,j as b,w,a7 as A,F as B}from"./main-489d0086.js";import{h as x}from"./moment-fbc5633a.js";import{F as L,i as G,a as I,b as Y,c as N,l as W}from"./index-15ed0783.js";import"./flowbite-vue-6c041ea8.js";const j={components:{FullCalendar:L,Calendar:T,InputText:F},data(){return{filter:{},days_week:[{name:"Sunday",value:0},{name:"Monday",value:1},{name:"Tuesday",value:2},{name:"Thursday",value:3},{name:"Wednesday",value:4},{name:"Friday",value:5},{name:"Saturday",value:6}],event_types:[{name:"تقيممات",id:1},{name:"اجتماعات",id:2},{name:"استشارات",id:3}],repeat_types:[{name:"تكرار ايام ",type:"single",dateFormat:"DD MM yy ",id:1},{name:"تكرار اسبوعي ",type:"single",dateFormat:"DD MM yy ",id:2},{name:"تكرار الشهور",type:"month",dateFormat:" MM yy ",id:3},{name:"تكرار السنوات",type:"year",dateFormat:"  yy ",id:4}],users:[],business_hours:[],langStore:U(),visible:!1,updateevent:!1,event:{color:"87ceeb",repeate:[{type:"",days:"",end_of_repeat:""}]},submitted:!1,employees:[],days:[0,1,2,3,4,5,6],doctorshow:"",create_visible:!1,event_id:null,opts:{plugins:[G,I,Y,N],initialView:"dayGridMonth",locale:null,slotDuration:"00:30:00",slotLabelInterval:"00:30:00",hiddenDays:[],slotMinTime:"00:00:00",slotMaxTime:"00:00:00",selectable:!0,editable:!0,validRange:{start:new Date},headerToolbar:{left:"title",center:"prev next today",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},selectAllow:s=>{const n=this.$refs.fullCalendar.getApi().getEvents();for(let o of n)if(x(s.start).isSame(o.start,"day")&&(s.start>=o.start&&s.start<o.end||s.end>o.start&&s.end<=o.end))return!1;return!0},eventClick:this.handleEventClick.bind(this),dateClick:this.handleDateClick,datesSet:this.handleDatesSet.bind(this),select:this.handleSelect.bind(this)}}},methods:{goBack(){this.$router.go(-1)},fetchTimes(){u.get(`api/times/student/${this.$route.params.id}/${this.$route.params.program_id}`).then(s=>{this.opts.events=s.data.data.map(e=>({title:e.title,start:e.start,end:e.end,type:e.type,col:e.color,id:e.id,backgroundColor:"#"+e.color}))}).catch(s=>console.error("Error retrieving doctors:",s))},handleDatesSet(s){if(this.business_hours.length>=1){const e=new Date(s.startStr);this.opts.slotMinTime=this.business_hours.find(n=>n.day===e.getDay()).start,this.opts.slotMaxTime=this.business_hours.find(n=>n.day===e.getDay()).end}},updateEvents(){u.get(`/api/event-calendar?employee_id=${this.event.employee_id}`).then(s=>{this.opts.events=s.data.data.map(e=>({title:e.title,start:e.start,end:e.end,type:e.type,col:e.color,id:e.id,backgroundColor:"#"+e.color}))})},getTimes(s){u.get(`api/employees/get/with/shift-days/${s}`).then(e=>{this.business_hours=e.data.data.days,this.updateEvents()})},handleEventClick(s){u.get(`api/slot/updete/statas/${s.event.id}`).then(()=>{this.$router.push({name:"without",params:{id:this.$route.params.id}})})},handleSelect(s){const e=new Date(s.startStr);this.opts.slotMinTime=this.business_hours.find(n=>n.day===e.getDay()).start,this.opts.slotMaxTime=this.business_hours.find(n=>n.day===e.getDay()).end,s.view.type=="dayGridMonth"?this.$refs.fullCalendar.getApi().changeView("timeGridDay",s.startStr):(this.event.start=s.startStr,this.event.end=s.endStr,this.visible=!0)},createEvent(){var s,e;this.event.repeate[0].type=(e=(s=this.event)==null?void 0:s.repeat_type)==null?void 0:e.id,this.event.repeate[0].days=this.event.day,this.event.repeate[0].end_of_repeat=x(this.event.end_of_repeat).format(" YYYY-MM-DD"),console.log(typeof this.event.repeate),u.post("/api/event-calendar",{employee_id:this.event.employee_id,title:this.event.title,type:this.event.type,start:this.event.start,end:this.event.end,color:this.event.color,repeat:this.event.repeate}).then(()=>{this.updateEvents(),this.visible=!1,this.$toast.add({severity:"success",summary:this.$t("success_message"),detail:`${this.$t("element_add_success")}`,life:3e3})}).catch(n=>{this.$toast.add({severity:"error",summary:this.$t("error"),detail:`${n.response.data.message}`,life:3e3})})},updateEvent(){u.put(`/api/event-calendar/${this.event_id}`,this.event).then(()=>{this.updateevent=!1,this.updateEvents()})},deleteEvent(){u.delete(`/api/event-calendar/${this.event_id}`).then(()=>{this.updateevent=!1,this.updateEvents()})},resetModal(){this.visible=!1,this.updateevent=!1,this.event={color:"87ceeb"}}},watch:{business_hours(s,e){const n=s.map(o=>o.day);this.opts.hiddenDays=this.days.filter(o=>!n.includes(o)),this.days_week=this.days_week.filter(o=>!this.opts.hiddenDays.includes(o.value))}},mounted(){this.fetchTimes(),this.doctorshow=localStorage.getItem("type"),this.opts.locale=localStorage.appLang==="en"?null:W}},q={class:"flex flex-column"},z={class:"text-right"},Q={class:"flex flex-column gap-2"},R={class:"text-right"},H={class:"flex gap-2 my-2"},J={class:"px-2"},K={key:0,class:"flex flex-column gap-2 py-1"},O={class:"w-full text-right",for:"username"},P={key:1,class:"flex flex-column gap-2"},X={class:"text-right"},Z={key:2,class:"flex flex-column gap-2"},$={class:"text-right"},ee={class:"flex flex-column"},te={class:"text-right"},se={class:"flex flex-column gap-2"},le={class:"text-right"},ie={class:"flex"};function ne(s,e,n,o,t,m){const D=r("FullCalendar"),g=r("InputText"),y=r("MultiSelect"),C=r("InputSwitch"),k=r("Dropdown"),S=r("Calendar"),_=r("Button"),V=r("Dialog"),M=r("Toast");return v(),c(B,null,[i(A,{class:"p-[1%] bg-slate-50"},{default:f(()=>[i(D,{options:t.opts,ref:"fullCalendar"},null,8,["options"]),i(V,{visible:t.visible,"onUpdate:visible":e[8]||(e[8]=d=>t.visible=d),id:"modal",modal:"",header:s.$t("submit"),style:{width:"40vw"}},{default:f(()=>{var d;return[l("form",{onSubmit:e[7]||(e[7]=w((...a)=>m.createEvent&&m.createEvent(...a),["prevent"]))},[l("div",null,[l("div",q,[l("label",z,p(s.$t("title")),1),i(g,{modelValue:t.event.title,"onUpdate:modelValue":e[0]||(e[0]=a=>t.event.title=a),class:h({"p-invalid":t.submitted&&!t.event.title})},null,8,["modelValue","class"])]),l("div",Q,[l("label",R,p(s.$t("نوع التكرار")),1),i(y,{modelValue:t.event.type,"onUpdate:modelValue":e[1]||(e[1]=a=>t.event.type=a),options:t.event_types,optionLabel:"name",optionValue:"id",class:h({"p-invalid":t.submitted&&!t.event.user_id})},null,8,["modelValue","options","class"])]),l("div",H,[i(C,{modelValue:t.event.sub,"onUpdate:modelValue":e[2]||(e[2]=a=>t.event.sub=a)},null,8,["modelValue"]),l("span",J,p(s.$t("هل تريد تكرار الحدث")),1)]),t.event.sub?(v(),c("div",K,[l("label",O,p(s.$t("evalute_type")),1),i(k,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:t.event.repeat_type,"onUpdate:modelValue":e[3]||(e[3]=a=>t.event.repeat_type=a),options:t.repeat_types,optionLabel:"name",class:h(["w-full",{"p-invalid":t.submitted&&!t.event.repeat_type}])},null,8,["modelValue","options","class"])])):b("",!0),((d=t.event.repeat_type)==null?void 0:d.id)==2?(v(),c("div",P,[l("label",X,p(s.$t("اختر ايام التكرار")),1),i(y,{modelValue:t.event.day,"onUpdate:modelValue":e[4]||(e[4]=a=>t.event.day=a),options:t.days_week,optionLabel:"name",optionValue:"value",class:h({"p-invalid":t.submitted&&!t.event.days})},null,8,["modelValue","options","class"])])):b("",!0),t.event.repeat_type?(v(),c("div",Z,[l("label",$,p(s.$t(" تاريخ نهاية التكرار")),1),i(S,{showButtonBar:"",modelValue:t.event.end_of_repeat,"onUpdate:modelValue":e[5]||(e[5]=a=>t.event.end_of_repeat=a),modelModifiers:{number:!0},showIcon:""},null,8,["modelValue"])])):b("",!0),i(_,{type:"submit",class:"create mt-3",label:s.$t("submit"),onClick:e[6]||(e[6]=a=>t.submitted=!0)},null,8,["label"])])],32)]}),_:1},8,["visible","header"]),i(V,{visible:t.updateevent,"onUpdate:visible":e[12]||(e[12]=d=>t.updateevent=d),id:"modal",modal:"",header:s.modal_text,style:{width:"40vw"}},{default:f(()=>[l("form",{onSubmit:e[11]||(e[11]=w((...d)=>m.updateEvent&&m.updateEvent(...d),["prevent"]))},[l("div",null,[l("div",ee,[l("label",te,p(s.$t("title")),1),i(g,{modelValue:t.event.title,"onUpdate:modelValue":e[9]||(e[9]=d=>t.event.title=d),class:h({"p-invalid":t.submitted&&!t.event.title})},null,8,["modelValue","class"])]),l("div",se,[l("label",le,p(s.$t("doctor")),1),i(y,{modelValue:t.event.type,"onUpdate:modelValue":e[10]||(e[10]=d=>t.event.type=d),options:t.event_types,optionLabel:"name",optionValue:"id",class:h({"p-invalid":t.submitted&&!t.event.user_id})},null,8,["modelValue","options","class"])]),l("div",ie,[i(_,{type:"submit",class:"bg-[green] mt-3",icon:"pi pi-pencil",onClick:m.updateEvent},null,8,["onClick"]),i(_,{type:"submit",class:"delete mt-3",icon:"pi pi-trash",onClick:m.deleteEvent},null,8,["onClick"])])])],32)]),_:1},8,["visible","header"])]),_:1}),i(M)],64)}const pe=E(j,[["render",ne],["__scopeId","data-v-d654240c"]]);export{pe as default};
