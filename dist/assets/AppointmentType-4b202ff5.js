import{_ as V,y as p,o as u,e as h,q as t,x as o,T,a1 as C,h as a,t as i,Z as w,W as I,a3 as b,X as y,i as m,w as k,n as D,G as c,F as A,z as S,l as F,a0 as $,L as P,O as x}from"./main-285b2e68.js";import{S as g}from"./sweetalert2.all-0febef39.js";import{P as E}from"./Pagination-e5934ee5.js";import{V as Q}from"./VDialog-fae9f1b0.js";import{V as R,a as z}from"./VRow-4cd903df.js";import{V as B}from"./VPagination-5342ed2f.js";const U={components:{Pagination:E},data(){return{currentPage:5,currentPage:1,pageSize:10,items:[],searchQuery:"",rooms:[],sessionTypes:[],showDialog:!1,showModal:!1,id:"",formData:{title:""}}},computed:{roomss(){return` ${this.this.sessionTypes}`},roomssearchQuery(){return this.sessionTypes.filter(e=>e.title.match(this.searchQuery))}},methods:{deleteItem(e){p.delete(`/api/appointmenttypes/${e}`,this.formData).then(s=>{console.log("Item deleted successfully:",s.data),g.fire("تم الحذف بنجاح!","Your treatment has been deleted.","success");const r=this.sessionTypes.findIndex(f=>f.id===e);r!==-1&&this.sessionTypes.splice(r,1)}).catch(s=>{console.error("There was an error deleting the treatment: ",s),g.fire("Error!","There was a problem deleting your treatment.","error")})},getOneSession(e){p.get(`api/appointmenttypes/${e}`).then(s=>{this.formData.title=s.data.appointmentTypes.title,this.id=s.data.appointmentTypes.id}).catch(s=>{console.error("Error fetching session type:",s)})},getAllRoom(){p.get("api/appointmenttypes").then(e=>{this.sessionTypes=e.data.appointmentTypes,this.items=Array.from({length:50},(s,r)=>({id:r+1,name:`Item ${r+1}`})),console.log(this.sessionTypes)})},editItem(e){this.$router.push({name:"EditRoom",params:{id:e}})},handlePageChange(e){this.currentPage=e},openForm(){this.showDialog=!0},closeForm(){this.showDialog=!1,this.formData={title:""}},saveItem(){p.post("/api/appointmenttypes",this.formData).then(e=>{console.log("Item saved successfully"),this.closeForm(),this.getAllRoom(),this.validationErrors={},this.showAlert({type:"success",message:"Item saved successfully."})}).catch(e=>{e.response&&e.response.status===422?this.validationErrors=e.response.data.errors:(console.error("Error saving item:",e),this.showAlert({type:"error",message:"Failed to save item. Please try again."}))})}},mounted(){const e=this.$route.params.id;this.getOneSession(e),this.getAllRoom()}},M=e=>(P("data-v-bc8f0676"),e=e(),x(),e),N={class:"container"},O={class:"mb-1"},q={class:"header"},L={class:"paragraph"},j={class:"search-section"},G={class:"add-data"},W={class:"first-div"},X=M(()=>a("i",{class:"fas fa-user"},null,-1)),Y={class:"third-div"};function Z(e,s,r,f,n,d){return u(),h("div",N,[t(Q,{modelValue:n.showDialog,"onUpdate:modelValue":s[1]||(s[1]=l=>n.showDialog=l),class:"form-adds","max-width":"600"},{default:o(()=>[t(T,{class:"form-all",style:{"border-radius":"15px"}},{default:o(()=>[t(C,null,{default:o(()=>[a("h2",O,i(e.$t("AppointmentType")),1)]),_:1}),t(w,null,{default:o(()=>[t(I,{modelValue:n.formData.title,"onUpdate:modelValue":s[0]||(s[0]=l=>n.formData.title=l),label:e.$t("title"),outlined:"",required:""},null,8,["modelValue","label"])]),_:1}),t(b,null,{default:o(()=>[t(y,{onClick:d.saveItem,class:"submit-button",elevation:"2"},{default:o(()=>[m(i(e.$t("submit")),1)]),_:1},8,["onClick"]),t(y,{onClick:d.closeForm,class:"",elevation:"2"},{default:o(()=>[m(i(e.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),a("div",q,[a("div",L,[a("h2",null,i(e.$t("AppointmentType")),1),a("p",null,i(e.$t("listAppointmentType")),1)]),a("div",j,[k(a("input",{type:"text","onUpdate:modelValue":s[2]||(s[2]=l=>n.searchQuery=l),placeholder:"Search...",class:"search-input"},null,512),[[D,n.searchQuery]]),t(c,{color:"success",size:"40",onClick:s[3]||(s[3]=l=>e.performSearch()),class:"icon-border"},{default:o(()=>[m("mdi-magnify")]),_:1})]),a("div",G,[t(R,{cols:"12",sm:"6",md:"4",class:"create-user-link",onClick:d.openForm},{default:o(()=>[t(c,{color:"success",size:"40",class:"icon-border"},{default:o(()=>[m("mdi-plus")]),_:1}),a("p",null,i(e.$t("addtype")),1)]),_:1},8,["onClick"])])]),(u(!0),h(A,null,S(d.roomssearchQuery,(l,_)=>(u(),h("div",{class:"content",key:_},[a("div",W,[X,a("h5",null,i(e.$t("nameAppointmentType"))+" :"+i(l.title),1)]),a("div",Y,[t(c,{small:"",color:"primary",class:"mx-3",onClick:v=>d.openForm(l.id)},{default:o(()=>[m("mdi-pencil")]),_:2},1032,["onClick"]),t(c,{small:"",color:"error mx-3",onClick:F(v=>d.deleteItem(l.id),["prevent"])},{default:o(()=>[m("mdi-delete")]),_:2},1032,["onClick"])])]))),128)),t($,null,{default:o(()=>[t(z,{justify:"center"},{default:o(()=>[t(B,{modelValue:e.page,"onUpdate:modelValue":s[4]||(s[4]=l=>e.page=l),length:"5",color:"blue"},null,8,["modelValue"])]),_:1})]),_:1})])}const oe=V(U,[["render",Z],["__scopeId","data-v-bc8f0676"]]);export{oe as default};
