import{_ as k,c as u,o as p,d as g,f as s,w as a,aa as f,aj as y,e as i,t as o,ag as v,ac as C,al as V,ad as c,h as n,i as w,v as E,a6 as h,F as I,z as P,a2 as A,ai as $,E as T,G as U}from"./main-91c6b099.js";import{P as Q,S as b}from"./Pagination-177be8f0.js";import{V as _}from"./VDialog-a08bb4b6.js";import{V as R,a as z}from"./VRow-54c6b1f0.js";import{V as B}from"./VPagination-24a796aa.js";const M={components:{Pagination:Q},data(){return{currentPage:5,currentPage:1,pageSize:10,items:[],readDate:!1,searchQuery:"",rooms:[],programsystems:[],showDialog:!1,showModal:!1,id:"",formData:{title:""},isEditing:!1,editFormData:{title:""}}},computed:{roomss(){return` ${this.this.programsystems}`},roomssearchQuery(){return this.programsystems.filter(e=>e.title.match(this.searchQuery))}},methods:{editData(e){this.isEditing=!0,u.get(`api/program-system/${e}`).then(t=>{this.editFormData=t.data.programsystems,this.editFormData=t.data.programsystems,this.isEditing=!0,console.log(this.editFormData.title)}).catch(t=>{console.error("Error fetching session type:",t)})},deleteItem(e){u.delete(`/api/program-system/${e}`,this.formData).then(t=>{console.log("Item deleted successfully:",t.data),b.fire("تم الحذف بنجاح!","تم حذف نظام البرنامج بنجاح.","success");const d=this.programsystems.findIndex(D=>D.id===e);d!==-1&&this.programsystems.splice(d,1)}).catch(t=>{console.error("There was an error deleting the treatment: ",t),b.fire("Error!","There was a problem deleting your treatment.","error")})},getOneSession(e){u.get(`api/program-system/${e}`).then(t=>{this.formData.title=t.data.programsystems.title,this.id=t.data.programsystems.id}).catch(t=>{console.error("Error fetching session type:",t)})},closeEditForm(){this.isEditing=!1},getAllRoom(){u.get("api/program-system").then(e=>{this.programsystems=e.data.programsystems,this.items=Array.from({length:50},(t,d)=>({id:d+1,name:`Item ${d+1}`})),console.log(this.programsystems)})},handlePageChange(e){this.currentPage=e},openForm(){this.showDialog=!0},closeForm(){this.showDialog=!1,this.formData={title:""}},updateItem(e){const t={title:this.editFormData.title};u.put(`/api/program-system/${e}`,t).then(d=>{console.log("Item updated successfully"),this.editdialog=!1,this.getAllRoom(),this.isEditing=!1}).catch(d=>{console.error("Error updating item:",d.response.data.message),console.log("Full response:",d.response),this.showAlert({type:"error",message:`Failed to update item. ${d.response.data.message}`})})},saveItem(){u.post("/api/program-system",this.formData).then(e=>{console.log("Item saved successfully"),this.closeForm(),this.getAllRoom(),this.validationErrors={},this.showAlert({type:"success",message:"Item saved successfully."})}).catch(e=>{e.response&&e.response.status===422?this.validationErrors=e.response.data.errors:(console.error("Error saving item:",e),this.showAlert({type:"error",message:"Failed to save item. Please try again."}))})}},mounted(){const e=this.$route.params.id;this.getOneSession(e),this.getAllRoom()}},N=e=>(T("data-v-89fe20bb"),e=e(),U(),e),j={class:"container"},q={class:"mb-1"},O={class:"mb-1"},G={class:"mb-1"},L={class:"header"},x={class:"paragraph"},H={class:"search-section"},J={class:"add-data"},K={class:"first-div"},W=N(()=>i("i",{class:"fas fa-user"},null,-1)),X={class:"third-div"};function Y(e,t,d,D,r,m){return p(),g("div",j,[s(_,{modelValue:r.isEditing,"onUpdate:modelValue":t[2]||(t[2]=l=>r.isEditing=l),"max-width":"600"},{default:a(()=>[s(f,null,{default:a(()=>[s(y,null,{default:a(()=>[i("h2",q,o(e.$t("editSystemSystem")),1)]),_:1}),s(v,null,{default:a(()=>[s(C,{modelValue:r.editFormData.title,"onUpdate:modelValue":t[0]||(t[0]=l=>r.editFormData.title=l),label:e.$t("title"),outlined:"",required:""},null,8,["modelValue","label"])]),_:1}),s(V,null,{default:a(()=>[s(c,{onClick:t[1]||(t[1]=l=>m.updateItem(r.editFormData.id)),class:"submit-button",elevation:"2"},{default:a(()=>[n(o(e.$t("edit")),1)]),_:1}),s(c,{onClick:m.closeEditForm,class:"cancel-button",elevation:"2"},{default:a(()=>[n(o(e.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),s(_,{modelValue:r.showDialog,"onUpdate:modelValue":t[4]||(t[4]=l=>r.showDialog=l),class:"form-adds","max-width":"600"},{default:a(()=>[s(f,{class:"form-all",style:{"border-radius":"15px"}},{default:a(()=>[s(y,null,{default:a(()=>[i("h2",O,o(e.$t("SystemProgram")),1)]),_:1}),s(v,null,{default:a(()=>[s(C,{modelValue:r.formData.title,"onUpdate:modelValue":t[3]||(t[3]=l=>r.formData.title=l),label:e.$t("title"),outlined:"",required:""},null,8,["modelValue","label"])]),_:1}),s(V,null,{default:a(()=>[s(c,{onClick:m.saveItem,class:"submit-button",elevation:"2"},{default:a(()=>[n(o(e.$t("submit")),1)]),_:1},8,["onClick"]),s(c,{onClick:m.closeForm,class:"",elevation:"2"},{default:a(()=>[n(o(e.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),s(_,{modelValue:r.readDate,"onUpdate:modelValue":t[6]||(t[6]=l=>r.readDate=l),"max-width":"600","max-height":"400"},{default:a(()=>[s(f,null,{default:a(()=>[s(y,null,{default:a(()=>[i("h2",G,o(e.$t("editSystemSystem")),1)]),_:1}),s(v,null,{default:a(()=>[i("h2",null,o(e.$t("title"))+" : "+o(r.editFormData.title),1),i("h3",null,o(r.editFormData.created_at),1)]),_:1}),s(V,null,{default:a(()=>[s(c,{onClick:t[5]||(t[5]=l=>e.editItem(r.editFormData.id)),class:"submit-button",elevation:"2"},{default:a(()=>[n(o(e.$t("update")),1)]),_:1}),s(c,{onClick:m.closeEditForm,class:"cancel-button",elevation:"2"},{default:a(()=>[n(o(e.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),i("div",L,[i("div",x,[i("h2",null,o(e.$t("SystemProgram")),1),i("p",null,o(e.$t("listSystemProgram")),1)]),i("div",H,[w(i("input",{type:"text","onUpdate:modelValue":t[7]||(t[7]=l=>r.searchQuery=l),placeholder:"Search...",class:"search-input"},null,512),[[E,r.searchQuery]]),s(h,{color:"success",size:"40",onClick:t[8]||(t[8]=l=>e.performSearch()),class:"icon-border"},{default:a(()=>[n("mdi-magnify")]),_:1})]),i("div",J,[s(R,{cols:"12",sm:"6",md:"4",class:"create-user-link",onClick:m.openForm},{default:a(()=>[s(h,{color:"success",size:"40",class:"icon-border"},{default:a(()=>[n("mdi-plus")]),_:1}),i("p",null,o(e.$t("AddSystemProgram")),1)]),_:1},8,["onClick"])])]),(p(!0),g(I,null,P(m.roomssearchQuery,(l,F)=>(p(),g("div",{class:"content",key:F},[i("div",K,[W,i("h5",null,o(e.$t("namelistSystemProgram"))+" :"+o(l.title),1)]),i("div",X,[s(h,{small:"",color:"primary",class:"mx-3",onClick:S=>m.editData(l.id)},{default:a(()=>[n("mdi-pencil")]),_:2},1032,["onClick"]),s(h,{small:"",color:"error mx-3",onClick:A(S=>m.deleteItem(l.id),["prevent"])},{default:a(()=>[n("mdi-delete")]),_:2},1032,["onClick"])])]))),128)),s($,null,{default:a(()=>[s(z,{justify:"center"},{default:a(()=>[s(B,{modelValue:e.page,"onUpdate:modelValue":t[9]||(t[9]=l=>e.page=l),length:"5",color:"blue"},null,8,["modelValue"])]),_:1})]),_:1})])}const le=k(M,[["render",Y],["__scopeId","data-v-89fe20bb"]]);export{le as default};