import{a4 as y,P as C,Q as n,o as r,f as p,x as a,a0 as P,q as e,T as b,a1 as x,i as V,Z as w,R as d,V as k,e as _,z as R,t as g,F as T,p as q,l as B,W as v,a2 as F,a3 as N,X as S}from"./main-4fe28c25.js";import{V as A,a as U}from"./VRow-aa20c205.js";import{V as D}from"./VForm-a5885756.js";const M={__name:"ResetPassword",setup($){const i=y(),u=C(),l=n({token:i.params.token,email:i.query.email,password:"",password_confirmation:""}),m=n(!1),f=n({password:[t=>!!t||"Password is required"],password_confirmation:[t=>!!t||"Password Confirmation is required"]});return(t,s)=>(r(),p(P,null,{default:a(()=>[e(U,null,{default:a(()=>[e(A,{class:"v-col-sm-12 v-col-md-6 offset-md-3 mx-auto"},{default:a(()=>[e(b,{elevation:"4",light:"",tag:"section"},{default:a(()=>[e(x,null,{default:a(()=>[V(" Reset Password ")]),_:1}),e(w,null,{default:a(()=>[d(u).errors.length!==0?(r(),p(k,{key:0,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close")},{default:a(()=>[(r(!0),_(T,null,R(d(u).errors,(o,c)=>(r(),_("div",{key:c},g(o[0]),1))),128))]),_:1},8,["close-label"])):q("",!0)]),_:1}),e(D,{onSubmit:s[2]||(s[2]=B(o=>d(u).resetPassword(l.value),["prevent"])),modelValue:m.value,"onUpdate:modelValue":s[3]||(s[3]=o=>m.value=o)},{default:a(()=>[e(w,null,{default:a(()=>[e(v,{outline:"",label:"New Password",type:"password",modelValue:l.value.password,"onUpdate:modelValue":s[0]||(s[0]=o=>l.value.password=o),rules:f.value.password},null,8,["modelValue","rules"]),e(v,{outline:"",label:"Confirm Password",type:"password",modelValue:l.value.password_confirmation,"onUpdate:modelValue":s[1]||(s[1]=o=>l.value.password_confirmation=o),rules:f.value.password_confirmation},null,8,["modelValue","rules"])]),_:1}),e(F),e(N,null,{default:a(()=>[e(S,{color:"info",type:"submit"},{default:a(()=>[V(" Reset ")]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1}))}};export{M as default};