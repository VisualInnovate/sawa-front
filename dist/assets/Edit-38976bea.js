import{a8 as R,T as d,af as N,a3 as S,o as i,d as u,f as a,w as t,J as $,h as m,$ as c,U as n,x as b,V as _,e as x,t as f,g,F as k,z as E,a5 as F,E as T,Z as U,ag as A,a7 as M,i as P,a1 as q,a0 as z,X as D}from"./main-bd32886b.js";import{u as I}from"./Users-be2432b2.js";import{V as j}from"./VForm-050025bb.js";import{a as J,V as y}from"./VRow-40375a88.js";const L=["value"],X={key:1,class:"d-block"},Q={__name:"Edit",setup(Z){const p=R(),l=I(),r=d({role_id:null,name:"",permissions:[]}),w=function(){this.$router.go(-1)},v=d(!1),C=d({name:[e=>e?!0:"Name is required",e=>(e==null?void 0:e.length)>=4?!0:"Name must be less than 4 charcters"]}),h=async e=>{await l.updateRole(e)},{getRoleById:B}=N(l);return S(async()=>{await l.fetchPermissions(),await l.fetchRoles();const e=B.value(p.params.id);r.value.role_id=p.params.id,r.value.name=e.name,r.value.permissions=e.permissions}),(e,o)=>(i(),u(k,null,[a(c,{height:"45",class:"mb-5 text-white",color:"#A9AB7F",onClick:w},{default:t(()=>[a($,{start:"",icon:"mdi-arrow-left"}),m(" Back ")]),_:1}),a(D,{class:"mx-auto pa-12 pb-8",elevation:"8"},{default:t(()=>[n(l).successMsg?(i(),b(_,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close")},{default:t(()=>[x("small",null,f(n(l).successMsg),1)]),_:1},8,["close-label"])):g("",!0),n(l).errors.length!==0?(i(),b(_,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close")},{default:t(()=>[typeof n(l).errors=="object"?(i(!0),u(k,{key:0},E(n(l).errors,(s,V)=>(i(),u("small",{class:"d-block",value:V,key:V},f(s),9,L))),128)):(i(),u("small",X,f(n(l).errors),1))]),_:1},8,["close-label"])):g("",!0),a(F,{class:"mb-2"},{default:t(()=>[m(" Edit Role ")]),_:1}),a(j,{modelValue:v.value,"onUpdate:modelValue":o[3]||(o[3]=s=>v.value=s),onSubmit:o[4]||(o[4]=T(s=>h(r.value),["prevent"]))},{default:t(()=>[a(J,null,{default:t(()=>[a(y,{cols:"12",md:"4"},{default:t(()=>[a(U,{modelValue:r.value.name,"onUpdate:modelValue":o[0]||(o[0]=s=>r.value.name=s),rules:C.value.name,counter:4,label:"Name",variant:"solo",required:""},null,8,["modelValue","rules"])]),_:1}),a(y,{cols:"12",md:"4"},{default:t(()=>[a(A,{modelValue:r.value.permissions,"onUpdate:modelValue":o[1]||(o[1]=s=>r.value.permissions=s),items:n(l).permissions,label:"Permissions",variant:"solo","item-title":s=>s.name,"item-value":s=>s.id,"item-disabled":!1,multiple:""},null,8,["modelValue","items","item-title","item-value"])]),_:1})]),_:1}),a(M,null,{default:t(()=>[a(c,{color:"error",variant:"elevated",onClick:o[2]||(o[2]=s=>e.$router.go(-1))},{default:t(()=>[m("Cancel")]),_:1}),a(c,{type:"submit",color:"success",variant:"elevated"},{default:t(()=>[P(a(q,{indeterminate:"",color:"white",class:"mx-3",size:"25"},null,512),[[z,n(l).loading]]),m(" Save ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})],64))}};export{Q as default};
