import{T as d,a3 as C,o as n,d as u,f as e,w as s,J as w,h as m,$ as c,U as o,x as p,V as b,e as h,t as f,g as _,F as B,z as N,a5 as S,E as x,Z as F,ag as U,a7 as A,i as M,a1 as T,a0 as $,X as P}from"./main-bd32886b.js";import{u as R}from"./Users-be2432b2.js";import{V as q}from"./VForm-050025bb.js";import{a as z,V as k}from"./VRow-40375a88.js";const D=["value"],E={key:1,class:"d-block"},Z={__name:"Create",setup(j){const t=R(),i=d({name:"",permissions:[]}),v=d(!1),y=d({name:[l=>l?!0:"Name is required",l=>(l==null?void 0:l.length)>=4?!0:"Name must be less than 4 charcters"]}),g=async l=>{await t.addRole(l)};return C(async()=>{t.fetchPermissions()}),(l,r)=>(n(),u("div",null,[e(c,{height:"45",class:"mb-5 text-white",color:"#A9AB7F",onClick:l.goBack},{default:s(()=>[e(w,{start:"",icon:"mdi-arrow-left"}),m(" Back ")]),_:1},8,["onClick"]),e(P,{class:"mx-auto pa-12 pb-8",elevation:"8"},{default:s(()=>[o(t).successMsg?(n(),p(b,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close")},{default:s(()=>[h("small",null,f(o(t).successMsg),1)]),_:1},8,["close-label"])):_("",!0),o(t).errors.length!==0?(n(),p(b,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close")},{default:s(()=>[typeof o(t).errors=="object"?(n(!0),u(B,{key:0},N(o(t).errors,(a,V)=>(n(),u("small",{class:"d-block",value:V,key:V},f(a),9,D))),128)):(n(),u("small",E,f(o(t).errors),1))]),_:1},8,["close-label"])):_("",!0),e(S,{class:"mb-2"},{default:s(()=>[m(" Create Role ")]),_:1}),e(q,{modelValue:v.value,"onUpdate:modelValue":r[2]||(r[2]=a=>v.value=a),onSubmit:r[3]||(r[3]=x(a=>g(i.value),["prevent"]))},{default:s(()=>[e(z,null,{default:s(()=>[e(k,{cols:"12",md:"4"},{default:s(()=>[e(F,{modelValue:i.value.name,"onUpdate:modelValue":r[0]||(r[0]=a=>i.value.name=a),rules:y.value.name,counter:4,label:"Name",variant:"solo",required:""},null,8,["modelValue","rules"])]),_:1}),e(k,{cols:"12",md:"4"},{default:s(()=>[e(U,{modelValue:i.value.permissions,"onUpdate:modelValue":r[1]||(r[1]=a=>i.value.permissions=a),items:o(t).permissions,label:"Permissions",variant:"solo","item-title":a=>a.name,"item-value":a=>a.id,"item-disabled":!1,multiple:""},null,8,["modelValue","items","item-title","item-value"])]),_:1})]),_:1}),e(A,null,{default:s(()=>[e(c,{color:"error",variant:"elevated"},{default:s(()=>[m("Cancel")]),_:1}),e(c,{type:"submit",color:"success",variant:"elevated"},{default:s(()=>[M(e(T,{indeterminate:"",color:"white",class:"mx-3",size:"25"},null,512),[[$,o(t).loading]]),m(" Save ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]))}};export{Z as default};
