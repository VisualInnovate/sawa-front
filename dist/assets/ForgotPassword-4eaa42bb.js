import{q as d,Z as y,X as w,o as r,L as i,g as e,a7 as x,f as a,a0 as C,a8 as k,h as m,a6 as f,Y as u,V,t as v,j as _,d as p,x as F,F as S,w as A,a2 as B,a9 as E,aa as M,a3 as P}from"./main-bc2568df.js";import{V as T,a as h}from"./VRow-142e57ec.js";import{V as L}from"./VForm-5da8c2df.js";const U={__name:"ForgotPassword",setup(N){const n=d({email:""}),c=d(!1),g=d({email:[t=>!!t||"E-mail is required",t=>/.+@.+/.test(t)||"E-mail must be valid"]}),l=y();return w(()=>{l.resetAuthStore()}),(t,s)=>(r(),i(x,null,{default:e(()=>[a(h,null,{default:e(()=>[a(T,{class:"v-col-sm-12 v-col-md-6 offset-md-3 mx-auto"},{default:e(()=>[a(C,{elevation:"4",light:"",tag:"section"},{default:e(()=>[a(k,null,{default:e(()=>[m(" Forgot Password ")]),_:1}),a(f,null,{default:e(()=>[u(l).successMsg?(r(),i(V,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close")},{default:e(()=>[m(v(u(l).successMsg),1)]),_:1},8,["close-label"])):_("",!0),u(l).errors.length!==0?(r(),i(V,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close")},{default:e(()=>[(r(!0),p(S,null,F(u(l).errors,(o,b)=>(r(),p("div",{key:b},v(o[0]),1))),128))]),_:1},8,["close-label"])):_("",!0)]),_:1}),a(L,{onSubmit:s[1]||(s[1]=A(o=>u(l).forgotPassword(n.value),["prevent"])),modelValue:c.value,"onUpdate:modelValue":s[2]||(s[2]=o=>c.value=o)},{default:e(()=>[a(f,null,{default:e(()=>[a(B,{outline:"",label:"Email",type:"text",modelValue:n.value.email,"onUpdate:modelValue":s[0]||(s[0]=o=>n.value.email=o),rules:g.value.email},null,8,["modelValue","rules"])]),_:1}),a(E),a(M,null,{default:e(()=>[a(P,{color:"info",type:"submit"},{default:e(()=>[m(" Send Link ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}))}};export{U as default};
