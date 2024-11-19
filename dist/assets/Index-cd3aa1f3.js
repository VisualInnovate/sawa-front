import{F as M,i as V,a as I,b as S,c as T,l as v}from"./ar-0bd07fcc.js";import{_ as B,a4 as F,bp as L,I as b,c as n,r as h,o as a,d as _,e as l,f as d,w as Y,a6 as U,h as E,t as r,ad as G,g as c,i as k,v as y,x as f}from"./main-91c6b099.js";import{h as s}from"./moment-fbc5633a.js";const N={components:{FullCalendar:M,Calendar:F},data(){return{langStore:L(),visible:!1,doctorshow:"",doctors:{},user_type:"",create_visible:!1,event_id:null,creat_event:b(!1),updat_event:b(!1),event_title:"",start_event:"",end_event:"",loading:!1,modal_text:"",time_start:"",time_end:"",opts:{plugins:[V,I,S,T],initialView:"dayGridMonth",footerToolbar:!0,valid:!1,buttonIcons:!1,locale:null,validRange:{start:new Date},selectable:!0,droppable:!1,editable:!0,selectHelper:!0,validRange:{start:new Date},headerToolbar:{center:"prev next today",left:"title",right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"},eventsTimeFormat:{hour:"2-digit",minute:"2-digit",second:"2-digit"},eventDrop:function(e){console.log(e.event.id),n.post(`/api/calender/${e.event.id}/update`,{start:e.event.start,end:e.event.end}).then(o=>{console.log(o.data.k)})},eventDrop:function(e){n.post(`/api/calender/${e.event.id}/update`,{title:e.event.title,start:s(e.event.start).format("00:00:00 YYYY-MM-d"),end:s(e.event.end).format("00:00:00 YYYY-MM-d")}).then(o=>{console.log(o.data.k)})},eventClick:(function(e){this.event_id=e.event.id,this.event_title=e.event.title,this.modal_text=this.$t("update_event"),this.creat_event=!1,this.updat_event=!0,this.visible=!0,this.start_event=s(e.event.start).format("YYYY-MM-DD"),this.end_event=s(e.event.end).format("YYYY-MM-DD"),console.log(this.start_event)}).bind(this),select:(function(e){console.log(e),this.event_title="",this.modal_text=this.$t("create_event"),this.creat_event=!0,this.updat_event=!1,this.visible=!0,console.log(e),this.start_event=s(e.start).format("YYYY-MM-DD"),this.end_event=s(e.end).format("YYYY-MM-DD"),console.log(e.backgroundColor)}).bind(this)}}},methods:{loo(){localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=v},goBack(){this.$router.go(-1)},deletevent(e){console.log(e),n.delete(`/api/calender/${this.event_id}/delete`).then(o=>{this.loading=!1,this.update()}),setTimeout(()=>{this.visible=!1,this.event_title=null,this.loading=!1},700)},updateevent(){n.post(`/api/calender/${this.event_id}/update`,{title:this.event_title,start:s(this.start_event).format(" YYYY-MM-d"),end:s(this.end_event).format(" YYYY-MM-d")}).then(e=>{}),this.update(),setTimeout(()=>{this.visible=!1,this.event_title=null,this.event_id=null,this.loading=!1},700)},createvent(){this.loading=!0,localStorage.getItem("type")==2&&(this.user_type=localStorage.getItem("user_id")),n.post("/api/calender/create",{user_id:this.user_type,title:this.event_title,start:this.start_event,end:this.end_event,time_start:this.time_start,time_end:this.time_end}).then(e=>{this.visible=!1,this.loading=!1,e.status!=200&&(this.valid=!0),this.update()}),setTimeout(()=>{this.event_title=null,this.start_event=null,this.end_event=null,this.create_visible=!1},700)},update(){n.post("/api/calender").then(e=>{this.opts.events=e.data.calender})},refreshEvents(){this.$refs.calendar.$emit("refetch-events")},fetchdoctor(){n.get("api/doctors").then(e=>{this.doctors=e.data.doctors,console.log(this.doctors)}).catch(e=>{console.error("Error retrieving doctors:",e)})}},mounted(){this.fetchdoctor(),this.doctorshow=localStorage.getItem("type"),localStorage.appLang=="en"?console.log("ascasc"):this.opts.locale=v,console.log(localStorage.appLang),this.update(),console.log(this.opts)},watch:{"localStorage.appLang"(e){e=="en"?this.opts.locale="":this.opts.locale=v,this.update()}}},q={class:"mb-5 text-white"},R={class:"card flex justify-content-center"},W={class:"flex flex-column gap-2"},j={for:"username"},A={key:0,class:"mt-1 mb-5 text-red-500"},H={key:0,class:"flex flex-column gap-2"},z={for:"username"},J={key:0,class:"mt-1 mb-5 text-red-500"},K={for:"time_start"},O={for:"time_end"};function P(e,o,Q,X,t,u){const x=h("FullCalendar"),C=h("InputText"),D=h("Dropdown"),m=h("Button"),w=h("Dialog");return a(),_("div",null,[l("div",q,[d(G,{height:"45",class:"mx-5 text-white",color:"#135c65",onClick:u.goBack},{default:Y(()=>[d(U,{start:"",icon:"mdi-arrow-left"}),E(" "+r(e.$t("back")),1)]),_:1},8,["onClick"])]),d(x,{options:t.opts,onChange:o[0]||(o[0]=p=>u.refreshEvents()),ref:"fullCalendar"},null,8,["options"]),l("div",R,[d(w,{visible:t.visible,"onUpdate:visible":o[5]||(o[5]=p=>t.visible=p),id:"modal",modal:"",header:t.modal_text,style:{width:"60vw"}},{default:Y(()=>{var p,g;return[l("form",null,[l("div",null,[l("div",W,[l("label",j,r(e.$t("title")),1),d(C,{required:"",class:"bg-[#f7f5f5]",modelValue:t.event_title,"onUpdate:modelValue":o[1]||(o[1]=i=>t.event_title=i),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(p=e.error)!=null&&p.title?(a(),_("div",A,r(e.error.title[0]),1)):c("",!0)]),t.doctorshow!=2?(a(),_("div",H,[l("label",z,r(e.$t("doctor")),1),d(D,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.user_type,"onUpdate:modelValue":o[2]||(o[2]=i=>t.user_type=i),"option-value":"id",filter:"",options:t.doctors,optionLabel:"name",placeholder:e.$t("doctor"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(g=e.error)!=null&&g.admin_id?(a(),_("div",J,r(e.error.admin_id[0]),1)):c("",!0)])):c("",!0),l("div",null,[l("label",K,r(e.$t("from")),1),k(l("input",{type:"time",name:"time_start",id:"time_start","onUpdate:modelValue":o[3]||(o[3]=i=>t.time_start=i),style:{"border-radius":"5px"}},null,512),[[y,t.time_start]])]),l("div",null,[l("label",O,r(e.$t("to")),1),k(l("input",{type:"time",name:"time_end",id:"time_end","onUpdate:modelValue":o[4]||(o[4]=i=>t.time_end=i),style:{"border-radius":"5px"}},null,512),[[y,t.time_end]])]),t.creat_event?(a(),f(m,{key:1,style:{"background-color":"rgb(4, 171, 4)",border:"0"},label:"Create ",loading:t.loading,onClick:u.createvent},null,8,["loading","onClick"])):c("",!0),t.updat_event?(a(),f(m,{key:2,style:{"background-color":"#6241f1","margin-left":"10px","margin-right":"10px",border:"0"},label:"update ",loading:t.loading,onClick:u.updateevent},null,8,["loading","onClick"])):c("",!0),t.updat_event?(a(),f(m,{key:3,style:{"background-color":"#b00020",border:"0"},label:"Delet ",loading:t.loading,onClick:u.deletevent},null,8,["loading","onClick"])):c("",!0)])])]}),_:1},8,["visible","header"])])])}const te=B(N,[["render",P],["__scopeId","data-v-00812a2d"]]);export{te as default};