import{_ as k,D as E,a as S,r as F,o as c,x as A,w as a,e as i,d as u,g as h,c as p,f as s,Y as v,a5 as V,t as n,a3 as b,$ as T,a7 as C,a0 as f,h as m,i as P,v as x,K as g,F as B,B as Q,E as R,a4 as U,O as z,P as N}from"./main-4124a381.js";import{P as M,S as D}from"./Pagination-b21e06a5.js";import{V as $}from"./VDialog-1d59592b.js";import{V as O,a as j}from"./VRow-7662c1c2.js";import{V as q}from"./VPagination-145f4291.js";const Y={components:{Dropdown:E,InputText:S},data(){return{tabs:[".$t('typeroom1'"],activeTab:"Singel Room"}},computed:{locale(){return this.$i18n.locale}},methods:{arr(){return this.tabs=[{name:this.$t("typeroom1")},{name:this.$t("typeroom2")},{name:this.$t("typeroom2")},{name:this.$t("typeroom2")},{name:this.$t("typeroom2")}]}}},G={key:0,class:"mt-4"},K={key:1,class:"mt-4"},L={key:2,class:"mt-4"},H={key:3,class:"mt-4"};function J(e,t,r,y,l,d){const _=F("va-card");return c(),A(_,{class:"card"},{default:a(()=>[i("div",null,[l.activeTab==="English"?(c(),u("div",G," Content for Tab 1 ")):h("",!0),l.activeTab==="Arabic"?(c(),u("div",K," Content for Tab 2 ")):h("",!0),l.activeTab==="Azerbaijan"?(c(),u("div",L," Content for Tab 3 ")):h("",!0),l.activeTab==="Georgia"?(c(),u("div",H," Content for Tab 4 ")):h("",!0)])]),_:1})}const W=k(Y,[["render",J],["__scopeId","data-v-7e867ede"]]);const X={components:{Pagination:M,Treat:W},data(){return{currentPage:5,currentPage:1,pageSize:10,items:[],isEditing:!1,editFormData:{title:""},searchQuery:"",rooms:[],sessionTypes:[],showDialog:!1,showModal:!1,id:"",formData:{title:""}}},computed:{roomss(){return` ${this.this.sessionTypes}`},roomssearchQuery(){return this.sessionTypes.filter(e=>e.title.match(this.searchQuery))}},methods:{editData(e){this.isEditing=!0,p.get(`api/treatment-types/${e}`).then(t=>{this.editFormData=t.data.treatmentTypes,this.editFormData=t.data.treatmentTypes,this.isEditing=!0,console.log(this.editFormData.title)}).catch(t=>{console.error("Error fetching session type:",t)})},deleteItem(e){p.delete(`/api/treatment-types/${e}`,this.formData).then(t=>{console.log("Item deleted successfully:",t.data),D.fire("تم الحذف بنجاح!","Your treatment has been deleted.","success");const r=this.sessionTypes.findIndex(y=>y.id===e);r!==-1&&this.sessionTypes.splice(r,1)}).catch(t=>{console.error("There was an error deleting the treatment: ",t),D.fire("Error!","There was a problem deleting your treatment.","error")})},getOneSession(e){p.get(`api/treatment-types/${e}`).then(t=>{this.formData.title=t.data.program_type.title,this.id=t.data.program_type.id}).catch(t=>{console.error("Error fetching session type:",t)})},closeEditForm(){this.isEditing=!1},getAllRoom(){p.get("api/treatment-types").then(e=>{this.sessionTypes=e.data.treatmentTypes,this.items=Array.from({length:50},(t,r)=>({id:r+1,name:`Item ${r+1}`})),console.log(this.sessionTypes)})},editItem(e){this.$router.push({name:"EditRoom",params:{id:e}})},handlePageChange(e){this.currentPage=e},openForm(){this.showDialog=!0},closeForm(){this.showDialog=!1,this.formData={title:""}},saveItem(){p.post("/api/treatment-types",this.formData).then(e=>{console.log("Item saved successfully"),this.closeForm(),this.getprogramtype(),this.validationErrors={},this.showAlert({type:"success",message:"Item saved successfully."})}).catch(e=>{e.response&&e.response.status===422?this.validationErrors=e.response.data.errors:(console.error("Error saving item:",e),this.showAlert({type:"error",message:"Failed to save item. Please try again."}))})},updateItem(e){const t={title:this.editFormData.title};p.put(`/api/treatment-types/${e}`,t).then(r=>{console.log("Item updated successfully"),this.editdialog=!1,this.getAllRoom(),this.isEditing=!1}).catch(r=>{console.error("Error updating item:",r.response.data.message),console.log("Full response:",r.response),this.showAlert({type:"error",message:`Failed to update item. ${r.response.data.message}`})})}},mounted(){const e=this.$route.params.id;this.getOneSession(e),this.getAllRoom()}},Z=e=>(z("data-v-cd15b744"),e=e(),N(),e),ee={class:"container"},te={class:"mb-1"},se={class:"mb-1"},ae={class:"header"},oe={class:"paragraph"},le={class:"search-section"},ie={class:"add-data"},re={class:"first-div"},ne=Z(()=>i("i",{class:"fas fa-user"},null,-1)),de={class:"third-div"};function me(e,t,r,y,l,d){const _=F("Treat");return c(),u("div",ee,[s(_),s($,{modelValue:l.isEditing,"onUpdate:modelValue":t[2]||(t[2]=o=>l.isEditing=o),class:"form-adds","max-width":"600"},{default:a(()=>[s(v,null,{default:a(()=>[s(V,null,{default:a(()=>[i("h2",te,n(e.$t("editTypetreatment")),1)]),_:1}),s(b,null,{default:a(()=>[s(T,{modelValue:l.editFormData.title,"onUpdate:modelValue":t[0]||(t[0]=o=>l.editFormData.title=o),label:e.$t("title"),outlined:"",required:""},null,8,["modelValue","label"])]),_:1}),s(C,null,{default:a(()=>[s(f,{onClick:t[1]||(t[1]=o=>d.updateItem(l.editFormData.id)),class:"submit-button",elevation:"2"},{default:a(()=>[m(n(e.$t("edit")),1)]),_:1}),s(f,{onClick:d.closeEditForm,class:"cancel-button",elevation:"2"},{default:a(()=>[m(n(e.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),s($,{modelValue:l.showDialog,"onUpdate:modelValue":t[4]||(t[4]=o=>l.showDialog=o),class:"form-adds","max-width":"600"},{default:a(()=>[s(v,{class:"form-all",style:{"border-radius":"15px"}},{default:a(()=>[s(V,null,{default:a(()=>[i("h2",se,n(e.$t("addtype")),1)]),_:1}),s(b,null,{default:a(()=>[s(T,{modelValue:l.formData.title,"onUpdate:modelValue":t[3]||(t[3]=o=>l.formData.title=o),label:e.$t("title"),outlined:"",required:""},null,8,["modelValue","label"])]),_:1}),s(C,null,{default:a(()=>[s(f,{onClick:d.saveItem,class:"submit-button",elevation:"2"},{default:a(()=>[m(n(e.$t("submit")),1)]),_:1},8,["onClick"]),s(f,{onClick:d.closeForm,class:"",elevation:"2"},{default:a(()=>[m(n(e.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),i("div",ae,[i("div",oe,[i("h2",null,n(e.$t("addtype")),1),i("p",null,n(e.$t("addtypelist")),1)]),i("div",le,[P(i("input",{type:"text","onUpdate:modelValue":t[5]||(t[5]=o=>l.searchQuery=o),placeholder:"Search...",class:"search-input"},null,512),[[x,l.searchQuery]]),s(g,{color:"success",size:"40",onClick:t[6]||(t[6]=o=>e.performSearch()),class:"icon-border"},{default:a(()=>[m("mdi-magnify")]),_:1})]),i("div",ie,[s(O,{cols:"12",sm:"6",md:"4",class:"create-user-link",onClick:d.openForm},{default:a(()=>[s(g,{color:"success",size:"40",class:"icon-border"},{default:a(()=>[m("mdi-plus")]),_:1}),i("p",null,n(e.$t("addtype")),1)]),_:1},8,["onClick"])])]),(c(!0),u(B,null,Q(d.roomssearchQuery,(o,w)=>(c(),u("div",{class:"content",key:w},[i("div",re,[ne,i("h5",null,n(e.$t("nameaddtypelist"))+" :"+n(o.title),1)]),i("div",de,[s(g,{small:"",color:"primary",class:"mx-3",onClick:I=>d.editData(o.id)},{default:a(()=>[m("mdi-pencil")]),_:2},1032,["onClick"]),s(g,{small:"",color:"error mx-3",onClick:R(I=>d.deleteItem(o.id),["prevent"])},{default:a(()=>[m("mdi-delete")]),_:2},1032,["onClick"])])]))),128)),s(U,null,{default:a(()=>[s(j,{justify:"center"},{default:a(()=>[s(q,{modelValue:e.page,"onUpdate:modelValue":t[7]||(t[7]=o=>e.page=o),length:"5",color:"blue"},null,8,["modelValue"])]),_:1})]),_:1})])}const ge=k(X,[["render",me],["__scopeId","data-v-cd15b744"]]);export{ge as default};
