import{a7 as y,U as C,R as d,o as r,x as p,w as a,a3 as b,f as e,X as x,a4 as P,h as V,a2 as w,T as n,V as g,d as _,B as k,t as R,F as B,g as T,E as F,Z as v,a5 as N,a6 as S,$ as U}from"./main-11f2bc19.js";import{V as q,a as A}from"./VRow-aa01ec70.js";import{V as $}from"./VForm-72c8380f.js";const X={__name:"ResetPassword",setup(D){const i=y(),u=C(),l=d({token:i.params.token,email:i.query.email,password:"",password_confirmation:""}),m=d(!1),f=d({password:[t=>!!t||"Password is required"],password_confirmation:[t=>!!t||"Password Confirmation is required"]});return(t,s)=>(r(),p(b,null,{default:a(()=>[e(A,null,{default:a(()=>[e(q,{class:"v-col-sm-12 v-col-md-6 offset-md-3 mx-auto"},{default:a(()=>[e(x,{elevation:"4",light:"",tag:"section"},{default:a(()=>[e(P,null,{default:a(()=>[V(" Reset Password ")]),_:1}),e(w,null,{default:a(()=>[n(u).errors.length!==0?(r(),p(g,{key:0,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close")},{default:a(()=>[(r(!0),_(B,null,k(n(u).errors,(o,c)=>(r(),_("div",{key:c},R(o[0]),1))),128))]),_:1},8,["close-label"])):T("",!0)]),_:1}),e($,{onSubmit:s[2]||(s[2]=F(o=>n(u).resetPassword(l.value),["prevent"])),modelValue:m.value,"onUpdate:modelValue":s[3]||(s[3]=o=>m.value=o)},{default:a(()=>[e(w,null,{default:a(()=>[e(v,{outline:"",label:"New Password",type:"password",modelValue:l.value.password,"onUpdate:modelValue":s[0]||(s[0]=o=>l.value.password=o),rules:f.value.password},null,8,["modelValue","rules"]),e(v,{outline:"",label:"Confirm Password",type:"password",modelValue:l.value.password_confirmation,"onUpdate:modelValue":s[1]||(s[1]=o=>l.value.password_confirmation=o),rules:f.value.password_confirmation},null,8,["modelValue","rules"])]),_:1}),e(N),e(S,null,{default:a(()=>[e(U,{color:"info",type:"submit"},{default:a(()=>[V(" Reset ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}))}};export{X as default};
