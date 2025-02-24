import{_ as U,L as F,a as L,bp as B,c as h,r,o as m,d as v,f as n,g as y,e as l,H as A,j as _,w as k,t as p,n as c,F as D,l as I,Y as G,p as W,m as Y}from"./main-670dbb9a.js";import{h as C}from"./moment-fbc5633a.js";import{F as H,i as N,a as P,b as j,c as q,l as z}from"./index-ef0849a7.js";import"./flowbite-vue-3cfcf28b.js";const R={components:{FullCalendar:H,Calendar:F,InputText:L},data(){return{filter:{},repeat:!1,days_week:[{name:"Sunday",value:0},{name:"Monday",value:1},{name:"Tuesday",value:2},{name:"Thursday",value:4},{name:"Wednesday",value:3},{name:"Friday",value:5},{name:"Saturday",value:6}],event_types:[{name:"تقييمات",id:1},{name:"اجتماعات",id:2},{name:"استشارات",id:3}],repeat_types:[{name:"تكرار ايام ",type:"single",dateFormat:"DD MM yy ",id:1},{name:"تكرار اسبوعي ",type:"single",dateFormat:"DD MM yy ",id:2},{name:"تكرار الشهور",type:"month",dateFormat:" MM yy ",id:3},{name:"تكرار السنوات",type:"year",dateFormat:"  yy ",id:4}],users:[],business_hours:[],langStore:B(),visible:!1,updateevent:!1,event:{color:"87ceeb",repeate:[{type:"",days:"",end_of_repeat:""}]},submitted:!1,employees:[],days:[0,1,2,3,4,5,6],doctorshow:"",create_visible:!1,event_id:null,opts:{plugins:[N,P,j,q],initialView:"dayGridMonth",locale:null,slotDuration:"00:30:00",slotLabelInterval:"00:30:00",hiddenDays:[],slotMinTime:"00:00:00",slotMaxTime:"00:00:00",selectable:!0,editable:!0,validRange:{start:new Date},headerToolbar:{left:"title",center:"prev next today",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},selectAllow:e=>{const a=this.$refs.fullCalendar.getApi().getEvents();for(let d of a)if(C(e.start).isSame(d.start,"day")&&(e.start>=d.start&&e.start<d.end||e.end>d.start&&e.end<=d.end))return!1;return!0},eventClick:this.handleEventClick.bind(this),dateClick:this.handleDateClick,datesSet:this.handleDatesSet.bind(this),select:this.handleSelect.bind(this)}}},methods:{goBack(){this.$router.go(-1)},fetchEmployees(){h.get("api/employees").then(e=>{this.employees=e.data.data}).catch(e=>console.error("Error retrieving doctors:",e))},handleDatesSet(e){if(this.business_hours.length>=1){const t=new Date(e.startStr);this.opts.slotMinTime=this.business_hours.find(a=>a.day===t.getDay()).start,this.opts.slotMaxTime=this.business_hours.find(a=>a.day===t.getDay()).end}},updateEvents(){h.get(`/api/event-calendar?employee_id=${this.event.employee_id}`).then(e=>{this.opts.events=e.data.data.map(t=>({title:t.title,start:t.start,end:t.end,type:t.type,col:t.color,id:t.id,backgroundColor:"#"+t.color}))})},getTimes(e){h.get(`api/employees/get/with/shift-days/${e}`).then(t=>{this.business_hours=t.data.data.days,this.updateEvents()})},handleEventClick(e){console.log(e),this.event_id=e.event.id,this.event.title=e.event.title,this.event.color="#"+e.event.color,this.event.start=e.event.start,this.event.end=e.event.end,this.event.type=e.event.extendedProps.type,this.event.color=e.event.extendedProps.col,this.updateevent=!0},handleSelect(e){const t=new Date(e.startStr);this.opts.slotMinTime=this.business_hours.find(a=>a.day===t.getDay()).start,this.opts.slotMaxTime=this.business_hours.find(a=>a.day===t.getDay()).end,e.view.type=="dayGridMonth"?this.$refs.fullCalendar.getApi().changeView("timeGridDay",e.startStr):(this.event.start=e.startStr,this.event.end=e.endStr,this.visible=!0)},createEvent(){var e,t;this.event.repeate[0].type=(t=(e=this.event)==null?void 0:e.repeat_type)==null?void 0:t.id,this.event.repeate[0].days=this.event.day,this.event.repeate[0].end_of_repeat=C(this.event.end_of_repeat).format(" YYYY-MM-DD"),console.log(typeof this.event.repeate),h.post("/api/event-calendar",{employee_id:this.event.employee_id,title:this.event.title,type:this.event.type,start:this.event.start,end:this.event.end,color:this.event.color,repeat:this.event.repeate}).then(()=>{this.updateEvents(),this.visible=!1,this.$toast.add({severity:"success",summary:this.$t("success_message"),detail:`${this.$t("element_add_success")}`,life:3e3})}).catch(a=>{this.$toast.add({severity:"error",summary:this.$t("error"),detail:`${a.response.data.message}`,life:3e3})})},updateEvent(){this.repeat?this.repeat=1:this.repeat=0,h.put(`/api/event-calendar/${this.event_id}`,{color:this.event.color,repeat:this.repeat,title:this.event.title,employee_id:this.event.employee_id,start:this.event.start,type:this.event.type,end:this.event.end}).then(()=>{this.updateevent=!1,this.updateEvents()})},deleteEvent(){this.repeat?this.repeat=1:this.repeat=0,h.delete(`/api/event-calendar/${this.event_id}?repeat=${this.repeat}`).then(()=>{this.updateevent=!1,this.updateEvents()})},resetModal(){this.visible=!1,this.updateevent=!1,this.event={color:"87ceeb"}}},watch:{business_hours(e,t){const a=e.map(d=>d.day);this.opts.hiddenDays=this.days.filter(d=>!a.includes(d)),this.days_week=this.days_week.filter(d=>!this.opts.hiddenDays.includes(d.value))}},mounted(){this.fetchEmployees(),this.doctorshow=localStorage.getItem("type"),this.opts.locale=localStorage.appLang==="en"?null:z,this.updateEvents()}},J=e=>(W("data-v-b32d0986"),e=e(),Y(),e),K={class:"my-2"},O={class:"flex flex-column"},Q={class:"text-right"},X={class:"flex flex-column gap-2"},Z={class:"w-full text-right",for:"username"},$={class:"flex gap-2 my-2"},ee={class:"px-2"},te={key:0,class:"flex flex-column gap-2 py-1"},se={class:"flex text-center m-auto"},le={class:"text-right text-base my-auto"},ne=J(()=>l("label",{class:"text-right text-base my-auto"},"في الايام",-1)),ie={class:"text-right my-auto",for:"username"},oe={key:1,class:"flex flex-column gap-2"},ae={class:"text-right"},de={key:2,class:"flex flex-column gap-2"},re={class:"text-right"},pe={class:"flex flex-column"},ue={class:"text-right"},me={class:"flex flex-column gap-2"},he={class:"text-right"},ve={class:"flex gap-2 my-2"},ce={class:"px-2 text-yellow-300"},ye={class:"flex"};function _e(e,t,a,d,s,u){const g=r("Dropdown"),S=r("Toolbar"),M=r("FullCalendar"),x=r("InputText"),f=r("MultiSelect"),V=r("InputSwitch"),E=r("Calendar"),b=r("Button"),w=r("Dialog"),T=r("Toast");return m(),v(D,null,[n(G,{class:"p-[1%] bg-slate-50"},{default:y(()=>[n(S,{class:"mb-4 shadow-md"},{start:y(()=>[l("div",K,[n(g,{"onUpdate:modelValue":[u.getTimes,t[0]||(t[0]=i=>s.event.employee_id=i)],placeholder:e.$t("employee_name"),id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:s.event.employee_id,"option-value":"id",filter:"",options:s.employees,optionLabel:"name"},null,8,["onUpdate:modelValue","placeholder","modelValue","options"])])]),end:y(()=>[]),_:1}),s.event.employee_id?(m(),A(M,{key:0,options:s.opts,ref:"fullCalendar"},null,8,["options"])):_("",!0),n(w,{visible:s.visible,"onUpdate:visible":t[9]||(t[9]=i=>s.visible=i),id:"modal",modal:"",header:e.$t("submit"),style:{width:"40vw"}},{default:y(()=>{var i;return[l("form",{onSubmit:t[8]||(t[8]=k((...o)=>u.createEvent&&u.createEvent(...o),["prevent"]))},[l("div",null,[l("div",O,[l("label",Q,p(e.$t("title")),1),n(x,{modelValue:s.event.title,"onUpdate:modelValue":t[1]||(t[1]=o=>s.event.title=o),class:c({"p-invalid":s.submitted&&!s.event.title})},null,8,["modelValue","class"])]),l("div",X,[l("label",Z,p(e.$t("evalute_type")),1),n(f,{modelValue:s.event.type,"onUpdate:modelValue":t[2]||(t[2]=o=>s.event.type=o),options:s.event_types,optionLabel:"name",optionValue:"id",class:c({"p-invalid":s.submitted&&!s.event.user_id})},null,8,["modelValue","options","class"])]),l("div",$,[n(V,{modelValue:s.event.sub,"onUpdate:modelValue":t[3]||(t[3]=o=>s.event.sub=o)},null,8,["modelValue"]),l("span",ee,p(e.$t("هل تريد تكرار الحدث")),1)]),s.event.sub?(m(),v("div",te,[l("div",se,[(m(!0),v(D,null,I(s.days_week,o=>(m(),v("label",le,p(o.name+","),1))),256)),ne,l("label",ie,p(e.$t(" التكرار")),1)]),n(g,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:s.event.repeat_type,"onUpdate:modelValue":t[4]||(t[4]=o=>s.event.repeat_type=o),options:s.repeat_types,optionLabel:"name",class:c(["w-full",{"p-invalid":s.submitted&&!s.event.repeat_type}])},null,8,["modelValue","options","class"])])):_("",!0),((i=s.event.repeat_type)==null?void 0:i.id)==2?(m(),v("div",oe,[l("label",ae,p(e.$t("اختر ايام التكرار")),1),n(f,{modelValue:s.event.day,"onUpdate:modelValue":t[5]||(t[5]=o=>s.event.day=o),options:s.days_week,optionLabel:"name",optionValue:"value",class:c({"p-invalid":s.submitted&&!s.event.days})},null,8,["modelValue","options","class"])])):_("",!0),s.event.repeat_type?(m(),v("div",de,[l("label",re,p(e.$t(" تاريخ نهاية التكرار")),1),n(E,{showButtonBar:"",modelValue:s.event.end_of_repeat,"onUpdate:modelValue":t[6]||(t[6]=o=>s.event.end_of_repeat=o),modelModifiers:{number:!0},showIcon:""},null,8,["modelValue"])])):_("",!0),n(b,{type:"submit",class:"create mt-3",label:e.$t("submit"),onClick:t[7]||(t[7]=o=>s.submitted=!0)},null,8,["label"])])],32)]}),_:1},8,["visible","header"]),n(w,{visible:s.updateevent,"onUpdate:visible":t[14]||(t[14]=i=>s.updateevent=i),id:"modal",modal:"",header:e.modal_text,style:{width:"40vw"}},{default:y(()=>[l("form",{onSubmit:t[13]||(t[13]=k((...i)=>u.updateEvent&&u.updateEvent(...i),["prevent"]))},[l("div",null,[l("div",pe,[l("label",ue,p(e.$t("title")),1),n(x,{modelValue:s.event.title,"onUpdate:modelValue":t[10]||(t[10]=i=>s.event.title=i),class:c({"p-invalid":s.submitted&&!s.event.title})},null,8,["modelValue","class"])]),l("div",me,[l("label",he,p(e.$t("doctor")),1),n(f,{modelValue:s.event.type,"onUpdate:modelValue":t[11]||(t[11]=i=>s.event.type=i),options:s.event_types,optionLabel:"name",optionValue:"id",class:c({"p-invalid":s.submitted&&!s.event.user_id})},null,8,["modelValue","options","class"])]),l("div",ve,[n(V,{modelValue:s.repeat,"onUpdate:modelValue":t[12]||(t[12]=i=>s.repeat=i)},null,8,["modelValue"]),l("span",ce,p(e.$t("انتبة سوف يتم حذف او تعديل جميع الاحداث المكررة")),1)]),l("div",ye,[n(b,{type:"submit",class:"bg-[green] mt-3",icon:"pi pi-pencil",onClick:u.updateEvent},null,8,["onClick"]),n(b,{type:"submit",class:"delete mt-3",icon:"pi pi-trash",onClick:u.deleteEvent},null,8,["onClick"])])])],32)]),_:1},8,["visible","header"])]),_:1}),n(T)],64)}const Ve=U(R,[["render",_e],["__scopeId","data-v-b32d0986"]]);export{Ve as default};
