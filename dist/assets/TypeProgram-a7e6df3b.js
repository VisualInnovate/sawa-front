import{_ as B,o as E,x as R,w as l,f as e,ac as p,al as g,h as i,t as r,ai as y,an as v,af as d,bk as q,bA as O,bB as $,aX as G,a_ as j,aZ as H,bL as X,bl as Y,a$ as Z,bG as z,bH as J,bn as K,b2 as Q,b$ as W,bI as ee,I as te,bc as A,aj as le,aE as ae,bp as se,c0 as oe,bq as ie,q as U,br as re,aF as ne,c as f,r as F,d as x,e as m,ae as P,a7 as b,g as de,E as ue,G as me}from"./main-eedf56aa.js";import{V as _}from"./VDialog-f5e38033.js";import{a as ce,V as T}from"./VRow-4e0e285f.js";const fe={data(){return{dialog:!1,title:"Confirmation",message:"Are you sure you want to perform this action?"}},methods:{openDialog({title:t="Confirmation",message:a=""}={}){this.title=t,this.message=a,this.dialog=!0},confirm(){this.$emit("confirmed"),this.dialog=!1}}};function pe(t,a,u,c,s,n){return E(),R(_,{modelValue:s.dialog,"onUpdate:modelValue":a[1]||(a[1]=h=>s.dialog=h),"max-width":"400"},{default:l(()=>[e(p,null,{default:l(()=>[e(g,{class:"headline"},{default:l(()=>[i(r(s.title),1)]),_:1}),e(y,null,{default:l(()=>[i(r(s.message),1)]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:a[0]||(a[0]=h=>s.dialog=!1),color:"primary",outlined:""},{default:l(()=>[i(" Cancel ")]),_:1}),e(d,{onClick:n.confirm,color:"error"},{default:l(()=>[i(" Confirm ")]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"])}const ge=B(fe,[["render",pe],["__scopeId","data-v-ecdfc456"]]);const he=q()({name:"VSnackbar",props:{multiLine:Boolean,timeout:{type:[Number,String],default:5e3},vertical:Boolean,...O({location:"bottom"}),...$(),...G(),...j(),...H(),...X(Y({transition:"v-snackbar-transition"}),["persistent","noClickAnimation","scrim","scrollStrategy"])},emits:{"update:modelValue":t=>!0},setup(t,a){let{slots:u}=a;const c=Z(t,"modelValue"),{locationStyles:s}=z(t),{positionClasses:n}=J(t),{scopeId:h}=K(),{themeClasses:w}=Q(t),{colorClasses:D,colorStyles:o,variantClasses:V}=W(t),{roundedClasses:M}=ee(t),S=te();A(c,k),A(()=>t.timeout,k),le(()=>{c.value&&k()});let I=-1;function k(){window.clearTimeout(I);const C=Number(t.timeout);!c.value||C===-1||(I=window.setTimeout(()=>{c.value=!1},C))}function N(){window.clearTimeout(I)}return ae(()=>{const[C]=se(t);return e(re,U({ref:S,class:["v-snackbar",{"v-snackbar--active":c.value,"v-snackbar--multi-line":t.multiLine&&!t.vertical,"v-snackbar--vertical":t.vertical},n.value]},C,{modelValue:c.value,"onUpdate:modelValue":L=>c.value=L,contentProps:U({style:s.value},C.contentProps),persistent:!0,noClickAnimation:!0,scrim:!1,scrollStrategy:"none"},h),{default:()=>[e("div",{class:["v-snackbar__wrapper",w.value,D.value,M.value,V.value],style:[o.value],onPointerenter:N,onPointerleave:k},[oe(!1,"v-snackbar"),u.default&&e("div",{class:"v-snackbar__content",role:"status","aria-live":"polite"},[u.default()]),u.actions&&e(ie,{defaults:{VBtn:{variant:"text",ripple:!1}}},{default:()=>[e("div",{class:"v-snackbar__actions"},[u.actions()])]})])],activator:u.activator})}),ne({},S)}}),ye={components:{ConfirmDialog:ge},data(){return{search:"",dialog:!1,showdata:"",itemDetails:{},successMessage:"",readDate:!1,alert:{show:!1,type:"success",message:""},title:"Confirmation",headers:[{key:"id",title:this.$t("index")},{key:"title",title:this.$t("title")}],programtype:[],loading:!0,showDialog:!1,isEditing:!1,editFormData:{title:""},formData:{title:""}}},methods:{getprogramtype(){f.get("/api/programtypes").then(t=>{this.programtype=t.data.programtype,this.loading=!1})},openForm(){this.showDialog=!0},closeEditFormedit(){this.readDate=!1},closeForm(){this.showDialog=!1,this.formData={title:""}},saveItem(){f.post("/api/programtypes",this.formData).then(t=>{console.log("Item saved successfully"),this.closeForm(),this.setSuccessMessage("Item deleted successfully!"),this.getprogramtype()}).catch(t=>{console.error("Error saving item:",t)})},openDialog(){this.dialog=!0},confirm(){this.$emit("confirmed"),this.dialog=!1},async deleteItem(t){try{this.showdata&&(this.showAlert({type:"warning",message:"Your custom alert message here"}),this.dialog=!1),await f.delete(`/api/programtypes/${t}`),console.log("Item deleted successfully"),this.showAlert({type:"success",message:"Item deleted successfully"}),this.getprogramtype()}catch(a){this.showAlert({type:"error",message:`Error deleting item: ${a.message}`}),console.error("Error deleting item:",a)}},showAlert({type:t,message:a}){this.alert.type=t,this.alert.message=a,this.alert.show=!0},async detailsItem(t){try{this.showdata=`${t}`,this.dialog=!0,await f.get(`/api/programtypes/${t}`),console.log(t)}catch{}},async showItem(t){try{const a=await f.get(`/api/programtypes/${t}`);this.editFormData=a.data.program_type,this.readDate=!0}catch(a){console.error("Error fetching item details:",a)}},hideDialog(){this.showDialog=!1},async editItem(t){const a=await f.get(`/api/programtypes/${t}`);console.log(a),this.editFormData=a.data.program_type,this.isEditing=!0},updateItem(t){const a={title:this.editFormData.title};f.put(`/api/programtypes/${t}`,a).then(u=>{console.log("Item updated successfully"),this.editdialog=!1,this.getprogramtype()}).catch(u=>{console.error("Error updating item:",u.response.data.message),console.log("Full response:",u.response),this.showAlert({type:"error",message:`Failed to update item. ${u.response.data.message}`})})},closeEditForm(){this.editFormData={id:null,title:""},this.isEditing=!1},setSuccessMessage(t){console.log("Setting success message:",t),this.successMessage=t,setTimeout(()=>{console.log("Clearing success message"),this.successMessage=""},3e3)}},computed:{header(){return this.headers=[{key:"id",title:this.$t("index")},{key:"title",title:this.$t("title")}]}},mounted(){this.getprogramtype()}},ve=t=>(ue("data-v-18f06806"),t=t(),me(),t),_e=ve(()=>m("div",null,null,-1)),Ce={class:"mb-1"},Ve={class:"mb-1"},ke={key:0},be={class:"mb-1"},we={class:"mb-1"};function De(t,a,u,c,s,n){const h=F("confirm-dialog"),w=F("router-link"),D=F("v-data-table");return E(),x("div",null,[_e,e(he,{modelValue:s.alert.show,"onUpdate:modelValue":a[0]||(a[0]=o=>s.alert.show=o),color:s.alert.type,style:{top:"0"}},{default:l(()=>[i(r(s.alert.message),1)]),_:1},8,["modelValue","color"]),e(p,null,{default:l(()=>[e(h,{onConfirmed:n.deleteItem,ref:"confirmDialog"},null,8,["onConfirmed"]),e(g,null,{default:l(()=>[m("h2",Ce,r(t.$t("ProgramType")),1),e(ce,{class:"mb-3"},{default:l(()=>[e(T,{cols:"12",sm:"6",md:"4"},{default:l(()=>[e(P,{modelValue:s.search,"onUpdate:modelValue":a[1]||(a[1]=o=>s.search=o),label:"Search",outlined:"","hide-details":""},null,8,["modelValue"])]),_:1}),e(T,{cols:"12",sm:"6",md:"4"},{default:l(()=>[e(d,{onClick:n.openForm,style:{"background-color":"#4caf50",color:"white","font-weight":"bold"}},{default:l(()=>[i(r(t.$t("addProgramType")),1)]),_:1},8,["onClick"])]),_:1}),e(T,{cols:"12",sm:"6",md:"4"},{default:l(()=>[e(w,{to:{name:"CreateUser"}},{default:l(()=>[e(b,{color:"success"},{default:l(()=>[i("mdi-plus")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(_,{modelValue:s.showDialog,"onUpdate:modelValue":a[3]||(a[3]=o=>s.showDialog=o),class:"form-adds","max-width":"600"},{default:l(()=>[e(p,{class:"form-all",style:{"border-radius":"15px"}},{default:l(()=>[e(g,null,{default:l(()=>[m("h2",Ve,r(t.$t("addProgramType")),1)]),_:1}),e(y,null,{default:l(()=>[e(P,{modelValue:s.formData.title,"onUpdate:modelValue":a[2]||(a[2]=o=>s.formData.title=o),label:t.$t("title"),outlined:"",required:""},null,8,["modelValue","label"])]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:n.saveItem,class:"submit-button",elevation:"2"},{default:l(()=>[i(r(t.$t("submit")),1)]),_:1},8,["onClick"]),e(d,{onClick:n.closeForm,class:"",elevation:"2"},{default:l(()=>[i(r(t.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(D,{headers:n.header,items:s.programtype,search:s.search},{item:l(({item:o})=>[o.columns?(E(),x("tr",ke,[m("td",null,r(o.columns.id),1),m("td",null,r(o.columns.title),1),m("td",null,[e(b,{small:"",color:"primary",class:"mx-3",onClick:V=>n.showItem(o.columns.id)},{default:l(()=>[i(" mdi-plus-box ")]),_:2},1032,["onClick"]),e(b,{small:"",color:"primary",class:"mx-3",onClick:V=>n.editItem(o.columns.id)},{default:l(()=>[i("mdi-pencil")]),_:2},1032,["onClick"]),e(b,{small:"",color:"error mx-3",onClick:V=>n.detailsItem(o.columns.id)},{default:l(()=>[i("mdi-delete")]),_:2},1032,["onClick"])])])):de("",!0)]),_:1},8,["headers","items","search"])]),_:1}),m("template",null,[e(_,{modelValue:s.dialog,"onUpdate:modelValue":a[6]||(a[6]=o=>s.dialog=o),"max-width":"400"},{default:l(()=>[e(p,null,{default:l(()=>[e(g,{class:"headline"},{default:l(()=>[i("Confirmation")]),_:1}),e(y,null,{default:l(()=>[i(" Are you sure you want to delete this item? "+r(s.showdata),1)]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:a[4]||(a[4]=o=>s.dialog=!1),color:"primary"},{default:l(()=>[i(" Cancel ")]),_:1}),e(d,{onClick:a[5]||(a[5]=o=>n.deleteItem(s.showdata)),color:"error"},{default:l(()=>[i(" Confirm ")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(_,{modelValue:t.editdialog,"onUpdate:modelValue":a[9]||(a[9]=o=>t.editdialog=o),"max-width":"400"},{default:l(()=>[e(p,null,{default:l(()=>[e(g,{class:"headline"},{default:l(()=>[i("Confirmation")]),_:1}),e(y,null,{default:l(()=>[i(" Are you sure you want to edit this item? "+r(t.editdata),1)]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:a[7]||(a[7]=o=>t.editdialog=!1),color:"primary"},{default:l(()=>[i(" Cancel ")]),_:1}),e(d,{onClick:a[8]||(a[8]=o=>n.editItem(t.editdata)),color:"error"},{default:l(()=>[i(" Confirm ")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(_,{modelValue:s.readDate,"onUpdate:modelValue":a[11]||(a[11]=o=>s.readDate=o),"max-width":"600","max-height":"400"},{default:l(()=>[e(p,null,{default:l(()=>[e(g,null,{default:l(()=>[m("h2",be,r(t.$t("editProgramType")),1)]),_:1}),e(y,null,{default:l(()=>[m("h2",null,r(t.$t("title"))+" : "+r(s.editFormData.title),1),m("h3",null,r(s.editFormData.created_at),1)]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:a[10]||(a[10]=o=>n.updateItem(s.editFormData.id)),class:"submit-button",elevation:"2"},{default:l(()=>[i(r(t.$t("update")),1)]),_:1}),e(d,{onClick:n.closeEditFormedit,class:"cancel-button",elevation:"2"},{default:l(()=>[i(r(t.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(_,{modelValue:s.isEditing,"onUpdate:modelValue":a[14]||(a[14]=o=>s.isEditing=o),"max-width":"600"},{default:l(()=>[e(p,null,{default:l(()=>[e(g,null,{default:l(()=>[m("h2",we,r(t.$t("editProgramType")),1)]),_:1}),e(y,null,{default:l(()=>[e(P,{modelValue:s.editFormData.title,"onUpdate:modelValue":a[12]||(a[12]=o=>s.editFormData.title=o),label:t.$t("title"),outlined:"",required:""},null,8,["modelValue","label"])]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:a[13]||(a[13]=o=>n.updateItem(s.editFormData.id)),class:"submit-button",elevation:"2"},{default:l(()=>[i(r(t.$t("update")),1)]),_:1}),e(d,{onClick:n.closeEditForm,class:"cancel-button",elevation:"2"},{default:l(()=>[i(r(t.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"])])])}const Te=B(ye,[["render",De],["__scopeId","data-v-18f06806"]]);export{Te as default};
