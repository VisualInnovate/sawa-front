import{I as d,aa as y,aj as k,o as r,x as i,w as e,ak as w,f as a,ac as x,al as C,h as m,ai as f,L as u,a2 as V,t as v,g as _,d as p,z as F,F as S,a3 as A,ae as B,am as E,an as M,af as P}from"./main-eedf56aa.js";import{V as T,a as h}from"./VRow-4e0e285f.js";import{V as L}from"./VForm-a1fea73f.js";const j={__name:"ForgotPassword",setup(N){const n=d({email:""}),c=d(!1),g=d({email:[t=>!!t||"E-mail is required",t=>/.+@.+/.test(t)||"E-mail must be valid"]}),l=y();return k(()=>{l.resetAuthStore()}),(t,s)=>(r(),i(w,null,{default:e(()=>[a(h,null,{default:e(()=>[a(T,{class:"v-col-sm-12 v-col-md-6 offset-md-3 mx-auto"},{default:e(()=>[a(x,{elevation:"4",light:"",tag:"section"},{default:e(()=>[a(C,null,{default:e(()=>[m(" Forgot Password ")]),_:1}),a(f,null,{default:e(()=>[u(l).successMsg?(r(),i(V,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close")},{default:e(()=>[m(v(u(l).successMsg),1)]),_:1},8,["close-label"])):_("",!0),u(l).errors.length!==0?(r(),i(V,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close")},{default:e(()=>[(r(!0),p(S,null,F(u(l).errors,(o,b)=>(r(),p("div",{key:b},v(o[0]),1))),128))]),_:1},8,["close-label"])):_("",!0)]),_:1}),a(L,{onSubmit:s[1]||(s[1]=A(o=>u(l).forgotPassword(n.value),["prevent"])),modelValue:c.value,"onUpdate:modelValue":s[2]||(s[2]=o=>c.value=o)},{default:e(()=>[a(f,null,{default:e(()=>[a(B,{outline:"",label:"Email",type:"text",modelValue:n.value.email,"onUpdate:modelValue":s[0]||(s[0]=o=>n.value.email=o),rules:g.value.email},null,8,["modelValue","rules"])]),_:1}),a(E),a(M,null,{default:e(()=>[a(P,{color:"info",type:"submit"},{default:e(()=>[m(" Send Link ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}))}};export{j as default};
