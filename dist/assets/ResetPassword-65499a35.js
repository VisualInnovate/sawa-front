import{am as y,a8 as C,I as d,o as r,x as p,w as a,ai as b,f as e,aa as g,aj as k,h as V,ag as w,L as n,a1 as x,d as _,z as P,t as R,F as B,g as F,a2 as N,ac as c,ak as S,al as T,ad as q}from"./main-91c6b099.js";import{V as A,a as U}from"./VRow-54c6b1f0.js";import{V as D}from"./VForm-ab9a8bc4.js";const E={__name:"ResetPassword",setup(L){const i=y(),u=C(),l=d({token:i.params.token,email:i.query.email,password:"",password_confirmation:""}),m=d(!1),f=d({password:[t=>!!t||"Password is required"],password_confirmation:[t=>!!t||"Password Confirmation is required"]});return(t,s)=>(r(),p(b,null,{default:a(()=>[e(U,null,{default:a(()=>[e(A,{class:"v-col-sm-12 v-col-md-6 offset-md-3 mx-auto"},{default:a(()=>[e(g,{elevation:"4",light:"",tag:"section"},{default:a(()=>[e(k,null,{default:a(()=>[V(" Reset Password ")]),_:1}),e(w,null,{default:a(()=>[n(u).errors.length!==0?(r(),p(x,{key:0,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close")},{default:a(()=>[(r(!0),_(B,null,P(n(u).errors,(o,v)=>(r(),_("div",{key:v},R(o[0]),1))),128))]),_:1},8,["close-label"])):F("",!0)]),_:1}),e(D,{onSubmit:s[2]||(s[2]=N(o=>n(u).resetPassword(l.value),["prevent"])),modelValue:m.value,"onUpdate:modelValue":s[3]||(s[3]=o=>m.value=o)},{default:a(()=>[e(w,null,{default:a(()=>[e(c,{outline:"",label:"New Password",type:"password",modelValue:l.value.password,"onUpdate:modelValue":s[0]||(s[0]=o=>l.value.password=o),rules:f.value.password},null,8,["modelValue","rules"]),e(c,{outline:"",label:"Confirm Password",type:"password",modelValue:l.value.password_confirmation,"onUpdate:modelValue":s[1]||(s[1]=o=>l.value.password_confirmation=o),rules:f.value.password_confirmation},null,8,["modelValue","rules"])]),_:1}),e(S),e(T,null,{default:a(()=>[e(q,{color:"info",type:"submit"},{default:a(()=>[V(" Reset ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}))}};export{E as default};