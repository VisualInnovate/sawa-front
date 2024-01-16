import{a4 as R,Q as d,a8 as N,$ as S,o as i,e as u,q as s,x as t,G as $,i as m,X as c,R as n,f as b,V as _,h as x,t as f,p as k,F as y,z as F,a1 as T,l as A,W as E,a6 as M,a3 as U,w as q,Y as P,v as z,T as D}from"./main-285b2e68.js";import{u as I}from"./Users-8758676d.js";import{V as j}from"./VForm-3d6e6b0f.js";import{a as G,V as g}from"./VRow-4cd903df.js";const L=["value"],Q={key:1,class:"d-block"},K={__name:"Edit",setup(W){const p=R(),l=I(),r=d({role_id:null,name:"",permissions:[]}),w=function(){this.$router.go(-1)},v=d(!1),C=d({name:[e=>e?!0:"Name is required",e=>(e==null?void 0:e.length)>=4?!0:"Name must be less than 4 charcters"]}),h=async e=>{await l.updateRole(e)},{getRoleById:B}=N(l);return S(async()=>{await l.fetchPermissions(),await l.fetchRoles();const e=B.value(p.params.id);r.value.role_id=p.params.id,r.value.name=e.name,r.value.permissions=e.permissions}),(e,o)=>(i(),u(y,null,[s(c,{height:"45",class:"mb-5 text-white",color:"#A9AB7F",onClick:w},{default:t(()=>[s($,{start:"",icon:"mdi-arrow-left"}),m(" Back ")]),_:1}),s(D,{class:"mx-auto pa-12 pb-8",elevation:"8"},{default:t(()=>[n(l).successMsg?(i(),b(_,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close")},{default:t(()=>[x("small",null,f(n(l).successMsg),1)]),_:1},8,["close-label"])):k("",!0),n(l).errors.length!==0?(i(),b(_,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close")},{default:t(()=>[typeof n(l).errors=="object"?(i(!0),u(y,{key:0},F(n(l).errors,(a,V)=>(i(),u("small",{class:"d-block",value:V,key:V},f(a),9,L))),128)):(i(),u("small",Q,f(n(l).errors),1))]),_:1},8,["close-label"])):k("",!0),s(T,{class:"mb-2"},{default:t(()=>[m(" Edit Role ")]),_:1}),s(j,{modelValue:v.value,"onUpdate:modelValue":o[3]||(o[3]=a=>v.value=a),onSubmit:o[4]||(o[4]=A(a=>h(r.value),["prevent"]))},{default:t(()=>[s(G,null,{default:t(()=>[s(g,{cols:"12",md:"4"},{default:t(()=>[s(E,{modelValue:r.value.name,"onUpdate:modelValue":o[0]||(o[0]=a=>r.value.name=a),rules:C.value.name,counter:4,label:"Name",variant:"solo",required:""},null,8,["modelValue","rules"])]),_:1}),s(g,{cols:"12",md:"4"},{default:t(()=>[s(M,{modelValue:r.value.permissions,"onUpdate:modelValue":o[1]||(o[1]=a=>r.value.permissions=a),items:n(l).permissions,label:"Permissions",variant:"solo","item-title":a=>a.name,"item-value":a=>a.id,"item-disabled":!1,multiple:""},null,8,["modelValue","items","item-title","item-value"])]),_:1})]),_:1}),s(U,null,{default:t(()=>[s(c,{color:"error",variant:"elevated",onClick:o[2]||(o[2]=a=>e.$router.go(-1))},{default:t(()=>[m("Cancel")]),_:1}),s(c,{type:"submit",color:"success",variant:"elevated"},{default:t(()=>[q(s(P,{indeterminate:"",color:"white",class:"mx-3",size:"25"},null,512),[[z,n(l).loading]]),m(" Save ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})],64))}};export{K as default};
