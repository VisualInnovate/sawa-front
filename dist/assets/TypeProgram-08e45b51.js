import{_ as B,o as S,f as O,x as l,q as e,T as p,a1 as g,i,t as r,Z as y,a3 as v,X as d,b6 as R,bj as q,bk as $,aK as K,aN as j,aM as z,bu as G,b7 as Q,aO as W,bp as X,bq as Y,b9 as Z,aR as H,bK as J,br as ee,Q as te,bb as A,$ as le,az as ae,bc as oe,bL as se,bd as ie,m as U,be as re,aA as ne,y as f,k as P,e as x,h as m,W as F,G as b,p as de,L as ue,O as me}from"./main-201c6ce7.js";import{V as _}from"./VDialog-72b0fd61.js";import{V as ce}from"./VRow-9bf03622.js";import{V as T}from"./VCol-cc86538b.js";const fe={data(){return{dialog:!1,title:"Confirmation",message:"Are you sure you want to perform this action?"}},methods:{openDialog({title:t="Confirmation",message:a=""}={}){this.title=t,this.message=a,this.dialog=!0},confirm(){this.$emit("confirmed"),this.dialog=!1}}};function pe(t,a,u,c,o,n){return S(),O(_,{modelValue:o.dialog,"onUpdate:modelValue":a[1]||(a[1]=h=>o.dialog=h),"max-width":"400"},{default:l(()=>[e(p,null,{default:l(()=>[e(g,{class:"headline"},{default:l(()=>[i(r(o.title),1)]),_:1}),e(y,null,{default:l(()=>[i(r(o.message),1)]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:a[0]||(a[0]=h=>o.dialog=!1),color:"primary",outlined:""},{default:l(()=>[i(" Cancel ")]),_:1}),e(d,{onClick:n.confirm,color:"error"},{default:l(()=>[i(" Confirm ")]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"])}const ge=B(fe,[["render",pe],["__scopeId","data-v-ecdfc456"]]);const he=R()({name:"VSnackbar",props:{multiLine:Boolean,timeout:{type:[Number,String],default:5e3},vertical:Boolean,...q({location:"bottom"}),...$(),...K(),...j(),...z(),...G(Q({transition:"v-snackbar-transition"}),["persistent","noClickAnimation","scrim","scrollStrategy"])},emits:{"update:modelValue":t=>!0},setup(t,a){let{slots:u}=a;const c=W(t,"modelValue"),{locationStyles:o}=X(t),{positionClasses:n}=Y(t),{scopeId:h}=Z(),{themeClasses:w}=H(t),{colorClasses:D,colorStyles:s,variantClasses:V}=J(t),{roundedClasses:M}=ee(t),E=te();A(c,k),A(()=>t.timeout,k),le(()=>{c.value&&k()});let I=-1;function k(){window.clearTimeout(I);const C=Number(t.timeout);!c.value||C===-1||(I=window.setTimeout(()=>{c.value=!1},C))}function N(){window.clearTimeout(I)}return ae(()=>{const[C]=oe(t);return e(re,U({ref:E,class:["v-snackbar",{"v-snackbar--active":c.value,"v-snackbar--multi-line":t.multiLine&&!t.vertical,"v-snackbar--vertical":t.vertical},n.value]},C,{modelValue:c.value,"onUpdate:modelValue":L=>c.value=L,contentProps:U({style:o.value},C.contentProps),persistent:!0,noClickAnimation:!0,scrim:!1,scrollStrategy:"none"},h),{default:()=>[e("div",{class:["v-snackbar__wrapper",w.value,D.value,M.value,V.value],style:[s.value],onPointerenter:N,onPointerleave:k},[se(!1,"v-snackbar"),u.default&&e("div",{class:"v-snackbar__content",role:"status","aria-live":"polite"},[u.default()]),u.actions&&e(ie,{defaults:{VBtn:{variant:"text",ripple:!1}}},{default:()=>[e("div",{class:"v-snackbar__actions"},[u.actions()])]})])],activator:u.activator})}),ne({},E)}}),ye={components:{ConfirmDialog:ge},data(){return{search:"",dialog:!1,showdata:"",itemDetails:{},successMessage:"",readDate:!1,alert:{show:!1,type:"success",message:""},title:"Confirmation",headers:[{key:"id",title:this.$t("index")},{key:"title",title:this.$t("title")}],programtype:[],loading:!0,showDialog:!1,isEditing:!1,editFormData:{title:""},formData:{title:""}}},methods:{getprogramtype(){f.get("/api/programtypes").then(t=>{this.programtype=t.data.programtype,this.loading=!1})},openForm(){this.showDialog=!0},closeEditFormedit(){this.readDate=!1},closeForm(){this.showDialog=!1,this.formData={title:""}},saveItem(){f.post("/api/programtypes",this.formData).then(t=>{console.log("Item saved successfully"),this.closeForm(),this.setSuccessMessage("Item deleted successfully!"),this.getprogramtype()}).catch(t=>{console.error("Error saving item:",t)})},openDialog(){this.dialog=!0},confirm(){this.$emit("confirmed"),this.dialog=!1},async deleteItem(t){try{this.showdata&&(this.showAlert({type:"warning",message:"Your custom alert message here"}),this.dialog=!1),await f.delete(`/api/programtypes/${t}`),console.log("Item deleted successfully"),this.showAlert({type:"success",message:"Item deleted successfully"}),this.getprogramtype()}catch(a){this.showAlert({type:"error",message:`Error deleting item: ${a.message}`}),console.error("Error deleting item:",a)}},showAlert({type:t,message:a}){this.alert.type=t,this.alert.message=a,this.alert.show=!0},async detailsItem(t){try{this.showdata=`${t}`,this.dialog=!0,await f.get(`/api/programtypes/${t}`),console.log(t)}catch{}},async showItem(t){try{const a=await f.get(`/api/programtypes/${t}`);this.editFormData=a.data.program_type,this.readDate=!0}catch(a){console.error("Error fetching item details:",a)}},hideDialog(){this.showDialog=!1},async editItem(t){const a=await f.get(`/api/programtypes/${t}`);console.log(a),this.editFormData=a.data.program_type,this.isEditing=!0},updateItem(t){const a={title:this.editFormData.title};f.put(`/api/programtypes/${t}`,a).then(u=>{console.log("Item updated successfully"),this.editdialog=!1,this.getprogramtype()}).catch(u=>{console.error("Error updating item:",u.response.data.message),console.log("Full response:",u.response),this.showAlert({type:"error",message:`Failed to update item. ${u.response.data.message}`})})},closeEditForm(){this.editFormData={id:null,title:""},this.isEditing=!1},setSuccessMessage(t){console.log("Setting success message:",t),this.successMessage=t,setTimeout(()=>{console.log("Clearing success message"),this.successMessage=""},3e3)}},computed:{header(){return this.headers=[{key:"id",title:this.$t("index")},{key:"title",title:this.$t("title")}]}},mounted(){this.getprogramtype()}},ve=t=>(ue("data-v-18f06806"),t=t(),me(),t),_e=ve(()=>m("div",null,null,-1)),Ce={class:"mb-1"},Ve={class:"mb-1"},ke={key:0},be={class:"mb-1"},we={class:"mb-1"};function De(t,a,u,c,o,n){const h=P("confirm-dialog"),w=P("router-link"),D=P("v-data-table");return S(),x("div",null,[_e,e(he,{modelValue:o.alert.show,"onUpdate:modelValue":a[0]||(a[0]=s=>o.alert.show=s),color:o.alert.type,style:{top:"0"}},{default:l(()=>[i(r(o.alert.message),1)]),_:1},8,["modelValue","color"]),e(p,null,{default:l(()=>[e(h,{onConfirmed:n.deleteItem,ref:"confirmDialog"},null,8,["onConfirmed"]),e(g,null,{default:l(()=>[m("h2",Ce,r(t.$t("ProgramType")),1),e(ce,{class:"mb-3"},{default:l(()=>[e(T,{cols:"12",sm:"6",md:"4"},{default:l(()=>[e(F,{modelValue:o.search,"onUpdate:modelValue":a[1]||(a[1]=s=>o.search=s),label:"Search",outlined:"","hide-details":""},null,8,["modelValue"])]),_:1}),e(T,{cols:"12",sm:"6",md:"4"},{default:l(()=>[e(d,{onClick:n.openForm,style:{"background-color":"#4caf50",color:"white","font-weight":"bold"}},{default:l(()=>[i(r(t.$t("addProgramType")),1)]),_:1},8,["onClick"])]),_:1}),e(T,{cols:"12",sm:"6",md:"4"},{default:l(()=>[e(w,{to:{name:"CreateUser"}},{default:l(()=>[e(b,{color:"success"},{default:l(()=>[i("mdi-plus")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(_,{modelValue:o.showDialog,"onUpdate:modelValue":a[3]||(a[3]=s=>o.showDialog=s),class:"form-adds","max-width":"600"},{default:l(()=>[e(p,{class:"form-all",style:{"border-radius":"15px"}},{default:l(()=>[e(g,null,{default:l(()=>[m("h2",Ve,r(t.$t("addProgramType")),1)]),_:1}),e(y,null,{default:l(()=>[e(F,{modelValue:o.formData.title,"onUpdate:modelValue":a[2]||(a[2]=s=>o.formData.title=s),label:t.$t("title"),outlined:"",required:""},null,8,["modelValue","label"])]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:n.saveItem,class:"submit-button",elevation:"2"},{default:l(()=>[i(r(t.$t("submit")),1)]),_:1},8,["onClick"]),e(d,{onClick:n.closeForm,class:"",elevation:"2"},{default:l(()=>[i(r(t.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(D,{headers:n.header,items:o.programtype,search:o.search},{item:l(({item:s})=>[s.columns?(S(),x("tr",ke,[m("td",null,r(s.columns.id),1),m("td",null,r(s.columns.title),1),m("td",null,[e(b,{small:"",color:"primary",class:"mx-3",onClick:V=>n.showItem(s.columns.id)},{default:l(()=>[i(" mdi-plus-box ")]),_:2},1032,["onClick"]),e(b,{small:"",color:"primary",class:"mx-3",onClick:V=>n.editItem(s.columns.id)},{default:l(()=>[i("mdi-pencil")]),_:2},1032,["onClick"]),e(b,{small:"",color:"error mx-3",onClick:V=>n.detailsItem(s.columns.id)},{default:l(()=>[i("mdi-delete")]),_:2},1032,["onClick"])])])):de("",!0)]),_:1},8,["headers","items","search"])]),_:1}),m("template",null,[e(_,{modelValue:o.dialog,"onUpdate:modelValue":a[6]||(a[6]=s=>o.dialog=s),"max-width":"400"},{default:l(()=>[e(p,null,{default:l(()=>[e(g,{class:"headline"},{default:l(()=>[i("Confirmation")]),_:1}),e(y,null,{default:l(()=>[i(" Are you sure you want to delete this item? "+r(o.showdata),1)]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:a[4]||(a[4]=s=>o.dialog=!1),color:"primary"},{default:l(()=>[i(" Cancel ")]),_:1}),e(d,{onClick:a[5]||(a[5]=s=>n.deleteItem(o.showdata)),color:"error"},{default:l(()=>[i(" Confirm ")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(_,{modelValue:t.editdialog,"onUpdate:modelValue":a[9]||(a[9]=s=>t.editdialog=s),"max-width":"400"},{default:l(()=>[e(p,null,{default:l(()=>[e(g,{class:"headline"},{default:l(()=>[i("Confirmation")]),_:1}),e(y,null,{default:l(()=>[i(" Are you sure you want to edit this item? "+r(t.editdata),1)]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:a[7]||(a[7]=s=>t.editdialog=!1),color:"primary"},{default:l(()=>[i(" Cancel ")]),_:1}),e(d,{onClick:a[8]||(a[8]=s=>n.editItem(t.editdata)),color:"error"},{default:l(()=>[i(" Confirm ")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(_,{modelValue:o.readDate,"onUpdate:modelValue":a[11]||(a[11]=s=>o.readDate=s),"max-width":"600","max-height":"400"},{default:l(()=>[e(p,null,{default:l(()=>[e(g,null,{default:l(()=>[m("h2",be,r(t.$t("editProgramType")),1)]),_:1}),e(y,null,{default:l(()=>[m("h2",null,r(t.$t("title"))+" : "+r(o.editFormData.title),1),m("h3",null,r(o.editFormData.created_at),1)]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:a[10]||(a[10]=s=>n.updateItem(o.editFormData.id)),class:"submit-button",elevation:"2"},{default:l(()=>[i(r(t.$t("update")),1)]),_:1}),e(d,{onClick:n.closeEditFormedit,class:"cancel-button",elevation:"2"},{default:l(()=>[i(r(t.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(_,{modelValue:o.isEditing,"onUpdate:modelValue":a[14]||(a[14]=s=>o.isEditing=s),"max-width":"600"},{default:l(()=>[e(p,null,{default:l(()=>[e(g,null,{default:l(()=>[m("h2",we,r(t.$t("editProgramType")),1)]),_:1}),e(y,null,{default:l(()=>[e(F,{modelValue:o.editFormData.title,"onUpdate:modelValue":a[12]||(a[12]=s=>o.editFormData.title=s),label:t.$t("title"),outlined:"",required:""},null,8,["modelValue","label"])]),_:1}),e(v,null,{default:l(()=>[e(d,{onClick:a[13]||(a[13]=s=>n.updateItem(o.editFormData.id)),class:"submit-button",elevation:"2"},{default:l(()=>[i(r(t.$t("update")),1)]),_:1}),e(d,{onClick:n.closeEditForm,class:"cancel-button",elevation:"2"},{default:l(()=>[i(r(t.$t("Cancel")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"])])])}const Se=B(ye,[["render",De],["__scopeId","data-v-18f06806"]]);export{Se as default};
