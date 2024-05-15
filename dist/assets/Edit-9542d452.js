import{a7 as R,T as d,ae as N,a2 as S,o as i,e as u,x as a,y as t,J as $,i as m,$ as c,U as n,f as b,V as _,h as x,t as f,q as y,F as k,B as F,a4 as T,n as U,Z as A,af as E,a6 as M,w as q,a0 as P,v as D,X as I}from"./main-986361a0.js";import{u as j}from"./Users-f821d36d.js";import{V as z}from"./VForm-a8acd557.js";import{a as J,V as g}from"./VRow-de295408.js";const L=["value"],X={key:1,class:"d-block"},Q={__name:"Edit",setup(Z){const v=R(),l=j(),r=d({role_id:null,name:"",permissions:[]}),w=function(){this.$router.go(-1)},p=d(!1),B=d({name:[e=>e?!0:"Name is required",e=>(e==null?void 0:e.length)>=4?!0:"Name must be less than 4 charcters"]}),C=async e=>{await l.updateRole(e)},{getRoleById:h}=N(l);return S(async()=>{await l.fetchPermissions(),await l.fetchRoles();const e=h.value(v.params.id);r.value.role_id=v.params.id,r.value.name=e.name,r.value.permissions=e.permissions}),(e,o)=>(i(),u(k,null,[a(c,{height:"45",class:"mb-5 text-white",color:"#A9AB7F",onClick:w},{default:t(()=>[a($,{start:"",icon:"mdi-arrow-left"}),m(" Back ")]),_:1}),a(I,{class:"mx-auto pa-12 pb-8",elevation:"8"},{default:t(()=>[n(l).successMsg?(i(),b(_,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close")},{default:t(()=>[x("small",null,f(n(l).successMsg),1)]),_:1},8,["close-label"])):y("",!0),n(l).errors.length!==0?(i(),b(_,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close")},{default:t(()=>[typeof n(l).errors=="object"?(i(!0),u(k,{key:0},F(n(l).errors,(s,V)=>(i(),u("small",{class:"d-block",value:V,key:V},f(s),9,L))),128)):(i(),u("small",X,f(n(l).errors),1))]),_:1},8,["close-label"])):y("",!0),a(T,{class:"mb-2"},{default:t(()=>[m(" Edit Role ")]),_:1}),a(z,{modelValue:p.value,"onUpdate:modelValue":o[3]||(o[3]=s=>p.value=s),onSubmit:o[4]||(o[4]=U(s=>C(r.value),["prevent"]))},{default:t(()=>[a(J,null,{default:t(()=>[a(g,{cols:"12",md:"4"},{default:t(()=>[a(A,{modelValue:r.value.name,"onUpdate:modelValue":o[0]||(o[0]=s=>r.value.name=s),rules:B.value.name,counter:4,label:"Name",variant:"solo",required:""},null,8,["modelValue","rules"])]),_:1}),a(g,{cols:"12",md:"4"},{default:t(()=>[a(E,{modelValue:r.value.permissions,"onUpdate:modelValue":o[1]||(o[1]=s=>r.value.permissions=s),items:n(l).permissions,label:"Permissions",variant:"solo","item-title":s=>s.name,"item-value":s=>s.id,"item-disabled":!1,multiple:""},null,8,["modelValue","items","item-title","item-value"])]),_:1})]),_:1}),a(M,null,{default:t(()=>[a(c,{color:"error",variant:"elevated",onClick:o[2]||(o[2]=s=>e.$router.go(-1))},{default:t(()=>[m("Cancel")]),_:1}),a(c,{type:"submit",color:"success",variant:"elevated"},{default:t(()=>[q(a(P,{indeterminate:"",color:"white",class:"mx-3",size:"25"},null,512),[[D,n(l).loading]]),m(" Save ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})],64))}};export{Q as default};