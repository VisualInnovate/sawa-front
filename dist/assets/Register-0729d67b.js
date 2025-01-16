import{Q as c,P as _,r as y,o as i,d as u,f as t,R as o,S as x,w as n,T as g,U as k,x as h,F as C,z as S,t as V,V as E,g as N,D as P,W as m,X as U,i as B,Y as R,Z as $,h as w,$ as q,J as F,e as p}from"./main-8ffdd353.js";import{V as I}from"./VForm-37fbc00d.js";const T={class:"py-4"},j=["value"],z={key:1,class:"d-block"},A=p("div",{class:"text-subtitle-1 text-medium-emphasis"},"Name",-1),D=p("div",{class:"text-subtitle-1 text-medium-emphasis"},"Account",-1),L=p("div",{class:"text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"}," Password ",-1),J=p("div",{class:"text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"}," Confirm Password ",-1),X={__name:"Register",setup(M){const l=c({name:"",email:"",password:"",password_confirmation:""}),r=_(),v=c(!1),d=c({name:[s=>!!s||"Name is required"],email:[s=>!!s||"E-mail is required",s=>/.+@.+/.test(s)||"E-mail must be valid"],password:[s=>!!s||"Password is required"],password_confirmation:[s=>!!s||"Password Confirmation is required"]});return(s,e)=>{const b=y("router-link");return i(),u("div",T,[t(x,{class:"mx-auto mb-10","max-width":"228",src:o(k)},null,8,["src"]),t(g,{class:"mx-auto pa-12 pb-8",elevation:"8","max-width":"448",rounded:"lg"},{default:n(()=>[o(r).errors.length!==0?(i(),h(E,{key:0,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":s.$t("close")},{default:n(()=>[typeof o(r).errors=="object"?(i(!0),u(C,{key:0},S(o(r).errors,(a,f)=>(i(),u("small",{class:"d-block",value:f,key:f},V(a),9,j))),128)):(i(),u("small",z,V(o(r).errors),1))]),_:1},8,["close-label"])):N("",!0),t(I,{onSubmit:e[6]||(e[6]=P(a=>o(r).handleRegister(l.value),["prevent"])),modelValue:v.value,"onUpdate:modelValue":e[7]||(e[7]=a=>v.value=a)},{default:n(()=>[A,t(m,{density:"compact",placeholder:"Enter your name","prepend-inner-icon":"mdi-account",variant:"outlined",modelValue:l.value.name,"onUpdate:modelValue":e[0]||(e[0]=a=>l.value.name=a),rules:d.value.name},null,8,["modelValue","rules"]),D,t(m,{density:"compact",placeholder:"Email address","prepend-inner-icon":"mdi-email-outline",variant:"outlined",modelValue:l.value.email,"onUpdate:modelValue":e[1]||(e[1]=a=>l.value.email=a),rules:d.value.email},null,8,["modelValue","rules"]),L,t(m,{type:"password",density:"compact",placeholder:"Enter your password","prepend-inner-icon":"mdi-lock-outline",variant:"outlined","onClick:appendInner":e[2]||(e[2]=a=>s.visible=!s.visible),modelValue:l.value.password,"onUpdate:modelValue":e[3]||(e[3]=a=>l.value.password=a),rules:d.value.password},null,8,["modelValue","rules"]),J,t(m,{type:"password",density:"compact",placeholder:"Retype your password","prepend-inner-icon":"mdi-lock-outline",variant:"outlined","onClick:appendInner":e[4]||(e[4]=a=>s.visible=!s.visible),modelValue:l.value.password_confirmation,"onUpdate:modelValue":e[5]||(e[5]=a=>l.value.password_confirmation=a),rules:d.value.password_confirmation},null,8,["modelValue","rules"]),t(U,{block:"",type:"submit",class:"mb-6 mt-2",color:"blue",size:"large",variant:"tonal"},{default:n(()=>[B(t($,{indeterminate:"",color:"info",class:"mx-3",size:"25"},null,512),[[R,o(r).loading]]),w(" Sign up ")]),_:1})]),_:1},8,["modelValue"]),t(q,{class:"text-center"},{default:n(()=>[t(b,{class:"text-blue text-decoration-none",to:{name:"Login"},rel:"noopener noreferrer"},{default:n(()=>[w(" Login"),t(F,{icon:"mdi-chevron-right"})]),_:1})]),_:1})]),_:1})])}}};export{X as default};
