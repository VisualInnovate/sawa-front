import{Q as d,P as y,a0 as w,o as r,x as i,w as e,a1 as x,f as a,T as C,a2 as k,h as m,$ as f,R as u,V,t as v,g as _,d as p,z as F,F as S,D as P,W as T,a3 as A,a4 as B,X as E}from"./main-f9d3afa8.js";import{V as M,a as $}from"./VRow-0e96e2b3.js";import{V as h}from"./VForm-767e27b2.js";const U={__name:"ForgotPassword",setup(D){const n=d({email:""}),c=d(!1),g=d({email:[t=>!!t||"E-mail is required",t=>/.+@.+/.test(t)||"E-mail must be valid"]}),l=y();return w(()=>{l.resetAuthStore()}),(t,s)=>(r(),i(x,null,{default:e(()=>[a($,null,{default:e(()=>[a(M,{class:"v-col-sm-12 v-col-md-6 offset-md-3 mx-auto"},{default:e(()=>[a(C,{elevation:"4",light:"",tag:"section"},{default:e(()=>[a(k,null,{default:e(()=>[m(" Forgot Password ")]),_:1}),a(f,null,{default:e(()=>[u(l).successMsg?(r(),i(V,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close")},{default:e(()=>[m(v(u(l).successMsg),1)]),_:1},8,["close-label"])):_("",!0),u(l).errors.length!==0?(r(),i(V,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close")},{default:e(()=>[(r(!0),p(S,null,F(u(l).errors,(o,b)=>(r(),p("div",{key:b},v(o[0]),1))),128))]),_:1},8,["close-label"])):_("",!0)]),_:1}),a(h,{onSubmit:s[1]||(s[1]=P(o=>u(l).forgotPassword(n.value),["prevent"])),modelValue:c.value,"onUpdate:modelValue":s[2]||(s[2]=o=>c.value=o)},{default:e(()=>[a(f,null,{default:e(()=>[a(T,{outline:"",label:"Email",type:"text",modelValue:n.value.email,"onUpdate:modelValue":s[0]||(s[0]=o=>n.value.email=o),rules:g.value.email},null,8,["modelValue","rules"])]),_:1}),a(A),a(B,null,{default:e(()=>[a(E,{color:"info",type:"submit"},{default:e(()=>[m(" Send Link ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}))}};export{U as default};
