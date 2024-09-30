import{_ as x,a as I,c as p,r as D,o as u,d as c,f as l,w as a,X as _,a5 as v,e as s,t as n,a7 as w,$ as h,h as m,F as A,z as k,J as V,Q as F,R as S}from"./main-a8302db8.js";import{P as $,S as b}from"./Pagination-f9fa2bfa.js";import{V as C}from"./VDialog-20389876.js";const M={components:{Pagination:$,InputText:I},data(){return{currentPage:5,currentPage:1,pageSize:10,items:[],appointmen_id:"",searchQuery:"",rooms:[],sessionTypes:[],showDialog:!1,showModal:!1,id:"",formData:{title:""}}},computed:{roomss(){return` ${this.this.sessionTypes}`},roomssearchQuery(){return this.sessionTypes.filter(e=>e.title.match(this.searchQuery))}},methods:{deleteItem(e){p.delete(`/api/appointmenttypes/${e}`,this.formData).then(t=>{console.log("Item deleted successfully:",t.data),b.fire("تم الحذف بنجاح!","Your treatment has been deleted.","success");const d=this.sessionTypes.findIndex(g=>g.id===e);d!==-1&&this.sessionTypes.splice(d,1)}).catch(t=>{console.error("There was an error deleting the treatment: ",t),b.fire("Error!","There was a problem deleting your treatment.","error")})},getOneSession(e){p.get(`api/appointmenttypes/${e}`).then(t=>{this.formData.title=t.data.appointmentTypes.title,this.id=t.data.appointmentTypes.id}).catch(t=>{console.error("Error fetching session type:",t)})},getAllRoom(){p.get("api/appointmenttypes").then(e=>{this.sessionTypes=e.data.appointmentTypes,this.items=Array.from({length:50},(t,d)=>({id:d+1,name:`Item ${d+1}`})),console.log(this.sessionTypes)})},update(){p.put(`api/appointmenttypes/${this.appointmen_id}`,this.formData).then(()=>{this.getAllRoom(),this.showModal=!1})},editItem(e){this.showModal=!0,this.appointmen_id=e,p.get(`api/appointmenttypes/${e}`).then(t=>{this.formData.title=t.data.program_type.title})},handlePageChange(e){this.currentPage=e},openForm(){this.showDialog=!0},closeForm(){this.showDialog=!1,this.formData={title:""}},saveItem(){p.post("/api/appointmenttypes",this.formData).then(e=>{console.log("Item saved successfully"),this.closeForm(),this.getAllRoom(),this.validationErrors={},this.showAlert({type:"success",message:"Item saved successfully."})}).catch(e=>{e.response&&e.response.status===422?this.validationErrors=e.response.data.errors:(console.error("Error saving item:",e),this.showAlert({type:"error",message:"Failed to save item. Please try again."}))})}},mounted(){const e=this.$route.params.id;this.getOneSession(e),this.getAllRoom()}},P=e=>(F("data-v-ae5992c7"),e=e(),S(),e),Q={class:"lg:w-[80%] m-auto"},E={class:"mb-1"},B={class:"mb-1"},R={class:"grid grid-cols-1 gap-8 lg:grid-cols-3 shadow mb-4 p-4"},U={class:"paragraph text-2xl"},N={class:"relative"},z={style:{margin:"auto",border:"2px solid #135C65"},class:"py-2 rounded-full w-[50%] h-[50%]"},O={style:{margin:"auto"},xmlns:"http://www.w3.org/2000/svg",width:"23.391",height:"26.316",viewBox:"0 0 23.391 26.316"},j=P(()=>s("path",{id:"plus",d:"M17.495,19.12V29.354a1.388,1.388,0,0,1-1.3,1.462,1.388,1.388,0,0,1-1.3-1.462V19.12H5.8a1.472,1.472,0,0,1,0-2.924h9.1V5.962A1.388,1.388,0,0,1,16.2,4.5a1.388,1.388,0,0,1,1.3,1.462V16.2h9.1a1.472,1.472,0,0,1,0,2.924Z",transform:"translate(-4.5 -4.5)",fill:"#148a98","fill-rule":"evenodd"},null,-1)),H=[j],J={class:"m-auto cursor-pointer text-xl w-full"},L={class:"flex justify-between hover:bg-[#dbebf5] rounded-md py-8 my-2 bg-[#F8F8F8]"},X={class:"m-auto flex w-[50%]"},Y={class:"px-3"},Z={class:"text-lg font-bold"},q={class:"font-bold text-[#135C65]"},G={class:"m-auto"};function K(e,t,d,g,i,r){const f=D("InputText");return u(),c("div",Q,[l(C,{modelValue:i.showDialog,"onUpdate:modelValue":t[1]||(t[1]=o=>i.showDialog=o),class:"form-adds","max-width":"600"},{default:a(()=>[l(_,{class:"form-all",style:{"border-radius":"15px"}},{default:a(()=>[l(v,null,{default:a(()=>[s("h2",E,n(e.$t("AppointmentType")),1)]),_:1}),l(f,{class:"w-[90%] m-auto",type:"text",modelValue:i.formData.title,"onUpdate:modelValue":t[0]||(t[0]=o=>i.formData.title=o),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),l(w,null,{default:a(()=>[l(h,{onClick:r.saveItem,class:"submit-button",elevation:"2"},{default:a(()=>[m(n(e.$t("submit")),1)]),_:1},8,["onClick"]),l(h,{onClick:r.closeForm,class:"",elevation:"2"},{default:a(()=>[m(n(e.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),l(C,{modelValue:i.showModal,"onUpdate:modelValue":t[4]||(t[4]=o=>i.showModal=o),class:"form-adds","max-width":"600"},{default:a(()=>[l(_,{class:"form-all",style:{"border-radius":"15px"}},{default:a(()=>[l(v,null,{default:a(()=>[s("h2",B,n(e.$t("AppointmentType")),1)]),_:1}),l(f,{class:"w-[90%] m-auto",type:"text",modelValue:i.formData.title,"onUpdate:modelValue":t[2]||(t[2]=o=>i.formData.title=o),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),l(w,null,{default:a(()=>[l(h,{onClick:r.update,class:"submit-button",elevation:"2"},{default:a(()=>[m(n(e.$t("submit")),1)]),_:1},8,["onClick"]),l(h,{onClick:t[3]||(t[3]=o=>i.showModal=!1),class:"",elevation:"2"},{default:a(()=>[m(n(e.$t("Cancel")),1)]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),s("div",R,[s("div",U,[s("h2",null,n(e.$t("Appointment_type")),1),s("p",null,n(e.$t("AppointmentAc")),1)]),s("div",N,[s("i",{class:"pi pi-search absolute top-[20%] right-[5%] font-bold cursor-pointer",onClick:t[5]||(t[5]=o=>e.performSearch())}),l(f,{style:{"text-align":"center"},class:"lg:w-full",modelValue:i.searchQuery,"onUpdate:modelValue":t[6]||(t[6]=o=>i.searchQuery=o),placeholder:"Search"},null,8,["modelValue"])]),s("div",{onClick:t[7]||(t[7]=o=>r.openForm()),class:"m-auto"},[s("div",z,[(u(),c("svg",O,H))]),s("p",J,n(e.$t("add_Appointment")),1)])]),(u(!0),c(A,null,k(r.roomssearchQuery,o=>{var y;return u(),c("div",L,[s("div",X,[s("div",Y,[s("p",Z,n(o.title),1),s("div",null,[s("p",q,n((y=o.treatment_type)==null?void 0:y.title),1)])])]),s("div",G,[l(V,{small:"",color:"error",onClick:T=>r.deleteItem(o.id)},{default:a(()=>[m("mdi-delete")]),_:2},1032,["onClick"]),l(V,{small:"",color:"primary",class:"mr-2",onClick:T=>r.editItem(o.id)},{default:a(()=>[m("mdi-pencil")]),_:2},1032,["onClick"])])])}),256))])}const se=x(M,[["render",K],["__scopeId","data-v-ae5992c7"]]);export{se as default};