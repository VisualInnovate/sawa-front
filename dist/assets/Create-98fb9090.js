import{Q as c,$ as g,o as n,e as u,q as e,x as s,G as w,i as m,X as d,R as o,f as p,V as b,h,t as f,p as _,F as B,z as N,a1 as S,l as x,W as F,a6 as A,a3 as M,w as R,Y as T,v as U,T as $}from"./main-201c6ce7.js";import{u as q}from"./Users-f2efad25.js";import{V as P}from"./VForm-a597863c.js";import{V as z}from"./VRow-9bf03622.js";import{V as k}from"./VCol-cc86538b.js";const D=["value"],j={key:1,class:"d-block"},X={__name:"Create",setup(E){const t=q(),i=c({name:"",permissions:[]}),v=c(!1),y=c({name:[l=>l?!0:"Name is required",l=>(l==null?void 0:l.length)>=4?!0:"Name must be less than 4 charcters"]}),C=async l=>{await t.addRole(l)};return g(async()=>{t.fetchPermissions()}),(l,r)=>(n(),u("div",null,[e(d,{height:"45",class:"mb-5 text-white",color:"#A9AB7F",onClick:l.goBack},{default:s(()=>[e(w,{start:"",icon:"mdi-arrow-left"}),m(" Back ")]),_:1},8,["onClick"]),e($,{class:"mx-auto pa-12 pb-8",elevation:"8"},{default:s(()=>[o(t).successMsg?(n(),p(b,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close")},{default:s(()=>[h("small",null,f(o(t).successMsg),1)]),_:1},8,["close-label"])):_("",!0),o(t).errors.length!==0?(n(),p(b,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close")},{default:s(()=>[typeof o(t).errors=="object"?(n(!0),u(B,{key:0},N(o(t).errors,(a,V)=>(n(),u("small",{class:"d-block",value:V,key:V},f(a),9,D))),128)):(n(),u("small",j,f(o(t).errors),1))]),_:1},8,["close-label"])):_("",!0),e(S,{class:"mb-2"},{default:s(()=>[m(" Create Role ")]),_:1}),e(P,{modelValue:v.value,"onUpdate:modelValue":r[2]||(r[2]=a=>v.value=a),onSubmit:r[3]||(r[3]=x(a=>C(i.value),["prevent"]))},{default:s(()=>[e(z,null,{default:s(()=>[e(k,{cols:"12",md:"4"},{default:s(()=>[e(F,{modelValue:i.value.name,"onUpdate:modelValue":r[0]||(r[0]=a=>i.value.name=a),rules:y.value.name,counter:4,label:"Name",variant:"solo",required:""},null,8,["modelValue","rules"])]),_:1}),e(k,{cols:"12",md:"4"},{default:s(()=>[e(A,{modelValue:i.value.permissions,"onUpdate:modelValue":r[1]||(r[1]=a=>i.value.permissions=a),items:o(t).permissions,label:"Permissions",variant:"solo","item-title":a=>a.name,"item-value":a=>a.id,"item-disabled":!1,multiple:""},null,8,["modelValue","items","item-title","item-value"])]),_:1})]),_:1}),e(M,null,{default:s(()=>[e(d,{color:"error",variant:"elevated"},{default:s(()=>[m("Cancel")]),_:1}),e(d,{type:"submit",color:"success",variant:"elevated"},{default:s(()=>[R(e(T,{indeterminate:"",color:"white",class:"mx-3",size:"25"},null,512),[[U,o(t).loading]]),m(" Save ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]))}};export{X as default};
