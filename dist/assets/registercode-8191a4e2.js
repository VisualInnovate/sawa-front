import{_ as x,M as g,s as h,a as f,u as w,b,c as v,r as u,o as y,d as k,f as r,e,t as a,w as c,i as l,v as i,F as V,h as p}from"./main-d5d5ddd5.js";import{s as B}from"./inlinemessage.esm-5c275211.js";const C={components:{Map:g,Button:h,InputText:f,InlineMessage:B},data(){return{email_parent:w("email_parent"),alert:{},alert_text:null,alert:{},errors:{},parentStore:b(),parent:{}}},methods:{createtreatment(){v.post("/api/parent/register",this.parent).then(n=>{this.email_parent=this.parent.email,this.$router.push({name:"register-code"})}).catch(n=>{this.errors=n.response.data.errors})}}},M={class:"py-16 animate__animated animate__bounceInRight"},S={class:"flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl"},U={class:"w-full p-8 lg:w-1/2"},j={class:"text-2xl text-gray-600 text-center"},q={class:"mt-4 flex items-center justify-between"},I=e("span",{class:"border-b w-1/5 lg:w-1/4"},null,-1),N={class:"text-xl py-2"},R=e("span",{class:"border-b w-1/5 lg:w-1/4"},null,-1),T={class:"flex justify-center gap-2 py-6"},$={class:"flex flex-column gap-2 w-full"},D={style:{visibility:"hidden"},for:"username"},E=e("small",{id:"username-help"},null,-1),F={class:"mt-2 flex items-center justify-between"},z={class:"text-xl w-full text-center"},P=e("div",{class:"hidden bg-[url('../image/childern.jpg')] lg:block lg:w-1/2 bg-cover",style:{"background-position":"center","background-size":"cover"}},null,-1);function A(n,t,G,H,s,J){const m=u("Map"),d=u("router-link"),_=u("Button");return y(),k(V,null,[r(m),e("div",M,[e("div",S,[e("div",U,[e("p",j,a(n.$t("Enter_the_activation_code")),1),e("div",q,[I,e("p",N,[r(d,{to:{name:"SingUp"},class:"text-xl text-[#135C65] uppercase"},{default:c(()=>[p(a(n.$t("Create_an_account")),1)]),_:1})]),R]),e("div",T,[l(e("input",{"onUpdate:modelValue":t[0]||(t[0]=o=>s.parent.num1=o),class:"w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500",type:"text",maxlength:"1",pattern:"[0-9]",inputmode:"numeric",autocomplete:"one-time-code",required:""},null,512),[[i,s.parent.num1]]),l(e("input",{"onUpdate:modelValue":t[1]||(t[1]=o=>s.parent.num2=o),class:"w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500",type:"text",maxlength:"1",pattern:"[0-9]",inputmode:"numeric",autocomplete:"one-time-code",required:""},null,512),[[i,s.parent.num2]]),l(e("input",{"onUpdate:modelValue":t[2]||(t[2]=o=>s.parent.num3=o),class:"w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500",type:"text",maxlength:"1",pattern:"[0-9]",inputmode:"numeric",autocomplete:"one-time-code",required:""},null,512),[[i,s.parent.num3]]),l(e("input",{"onUpdate:modelValue":t[3]||(t[3]=o=>s.parent.num4=o),class:"w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500",type:"text",maxlength:"1",pattern:"[0-9]",inputmode:"numeric",autocomplete:"one-time-code",required:""},null,512),[[i,s.parent.num4]])]),e("div",$,[e("label",D,a(n.$t("gruop_sessaion")),1),r(_,{onClick:t[4]||(t[4]=o=>s.parentStore.register(s.parent)),class:"create m-auto w-full",label:n.$t("Register_now")},null,8,["label"]),E]),e("div",F,[e("p",z,[r(d,{to:{name:"forgetpassword"},class:"text-xl text-[#135C65] uppercase"},{default:c(()=>[p(a(n.$t("Resend_the_code")),1)]),_:1})])])]),P])])],64)}const O=x(C,[["render",A]]);export{O as default};
