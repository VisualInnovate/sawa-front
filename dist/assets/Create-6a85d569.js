import{S as c,a2 as g,o as n,e as u,n as e,w as s,I as w,i as m,Z as d,T as o,f as p,V as b,h,t as f,p as _,F as B,y as S,a4 as N,D as x,Y as F,af as A,a6 as M,v as T,a0 as U,$,W as D}from"./main-2a1d549c.js";import{u as P}from"./Users-b8985838.js";import{V as R}from"./VForm-9bff48e3.js";import{a as q,V as y}from"./VRow-b2877460.js";const I=["value"],j={key:1,class:"d-block"},Z={__name:"Create",setup(z){const t=P(),i=c({name:"",permissions:[]}),v=c(!1),k=c({name:[l=>l?!0:"Name is required",l=>(l==null?void 0:l.length)>=4?!0:"Name must be less than 4 charcters"]}),C=async l=>{await t.addRole(l)};return g(async()=>{t.fetchPermissions()}),(l,r)=>(n(),u("div",null,[e(d,{height:"45",class:"mb-5 text-white",color:"#A9AB7F",onClick:l.goBack},{default:s(()=>[e(w,{start:"",icon:"mdi-arrow-left"}),m(" Back ")]),_:1},8,["onClick"]),e(D,{class:"mx-auto pa-12 pb-8",elevation:"8"},{default:s(()=>[o(t).successMsg?(n(),p(b,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close")},{default:s(()=>[h("small",null,f(o(t).successMsg),1)]),_:1},8,["close-label"])):_("",!0),o(t).errors.length!==0?(n(),p(b,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close")},{default:s(()=>[typeof o(t).errors=="object"?(n(!0),u(B,{key:0},S(o(t).errors,(a,V)=>(n(),u("small",{class:"d-block",value:V,key:V},f(a),9,I))),128)):(n(),u("small",j,f(o(t).errors),1))]),_:1},8,["close-label"])):_("",!0),e(N,{class:"mb-2"},{default:s(()=>[m(" Create Role ")]),_:1}),e(R,{modelValue:v.value,"onUpdate:modelValue":r[2]||(r[2]=a=>v.value=a),onSubmit:r[3]||(r[3]=x(a=>C(i.value),["prevent"]))},{default:s(()=>[e(q,null,{default:s(()=>[e(y,{cols:"12",md:"4"},{default:s(()=>[e(F,{modelValue:i.value.name,"onUpdate:modelValue":r[0]||(r[0]=a=>i.value.name=a),rules:k.value.name,counter:4,label:"Name",variant:"solo",required:""},null,8,["modelValue","rules"])]),_:1}),e(y,{cols:"12",md:"4"},{default:s(()=>[e(A,{modelValue:i.value.permissions,"onUpdate:modelValue":r[1]||(r[1]=a=>i.value.permissions=a),items:o(t).permissions,label:"Permissions",variant:"solo","item-title":a=>a.name,"item-value":a=>a.id,"item-disabled":!1,multiple:""},null,8,["modelValue","items","item-title","item-value"])]),_:1})]),_:1}),e(M,null,{default:s(()=>[e(d,{color:"error",variant:"elevated"},{default:s(()=>[m("Cancel")]),_:1}),e(d,{type:"submit",color:"success",variant:"elevated"},{default:s(()=>[T(e(U,{indeterminate:"",color:"white",class:"mx-3",size:"25"},null,512),[[$,o(t).loading]]),m(" Save ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]))}};export{Z as default};