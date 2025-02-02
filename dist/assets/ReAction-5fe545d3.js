import{_ as f,I as x,J as w,D as y,b as V,c as m,r,o as p,d as h,e as l,t as n,f as i,K as C,g as D,E as A,G as a,z as F,A as k,F as B}from"./main-d5d5ddd5.js";import"./moment-fbc5633a.js";import{s as U}from"./textarea.esm-66be2635.js";const q={};function I(s,t){return null}const L=f(q,[["render",I]]),R="/assets/registernobg-01-aa957418.png";const N={components:{Calendar:x,Textarea:U,Message:w,Dropdown:y},data(){return{show:!1,lan:[],selectedCity:null,cities:{},type:[],maxDate:new Date,parentStore:V(),error:{},alert_text:"",show_alert:!1,submitted:!1,child:{}}},computed:{locale(){return this.$i18n.locale}},methods:{arr(){return this.type=[{name:this.$t("male"),value:"0"},{name:this.$t("female"),value:"1"}]},goback(){this.$router.go(-1)},addChild(){this.child.parent_id=localStorage.getItem("parent_id"),m.post("/api/parent/child/create",this.child).then(s=>{this.$router.push({name:"Following"})}).catch(s=>{console.log(s.response.data.errors.name),this.error=s.response.data.errors})},getCountries(){m.get(`/api/countries/${localStorage.getItem("appLang")}`).then(s=>{console.log(s.data.countries),this.cities=s.data.countries,console.log(s)}).catch(s=>{console.log(s)})},getLangs(s){console.log(s),m.get("/api/languages").then(t=>{s=="اخر"?(this.lan=t.data.langs.other,this.lan.push({id:8,lang:"Arabic",id:44,lang:"English"})):(this.lan=t.data.langs.ar_en,this.lan.push({id:0,lang:"اخر"}))}).catch(t=>{console.log(t)})}},mounted(){this.getCountries(),this.getLangs()}},S={class:""},T={class:"flex justify-between"},E=l("div",{style:{width:"25%"},class:"m-auto"},[l("img",{class:"h-56 m-auto",src:R})],-1),M={class:"m-auto text-center w-[50%] space-y-2"},z={class:"text-3xl font-bold text-[#FF2A5B]"},j={class:"text-[#6D9AA0] text-lg"},G={class:"text-[#6D9AA0] text-lg"},J={style:{width:"25%"},class:"relative my-auto"},K={style:{"margin-bottom":"2%"},class:"m-auto w-[95%] lg:w-[45%] shadow-xl p-[2%] rounded-xl relative"},P={key:0,class:"text-center text-xl font-bold tracking-wide",style:{color:"green"}},H={class:"grid grid-cols-1 lg:grid-cols-2 gap-3"},O={class:"lg:col-span-2 flex flex-column gap-2"},Q={class:"w-full font-bold",for:"username"},W={class:"flex flex-column gap-2"},X={class:"font-bold",for:"username"},Y={class:"flex flex-column gap-2"},Z={class:"w-full font-bold",for:"username"},$={class:"flex flex-column gap-2"},ee={class:"w-full font-bold",for:"username"},le={class:"flex flex-column gap-2"},te={class:"w-full font-bold",for:"username"},se={class:"flex flex-column gap-2"},oe={class:"w-full font-bold",for:"username"},ne={class:"flex flex-column gap-2"},ie={class:"w-full font-bold",for:"username"},ae={class:"flex flex-column gap-2"},re={class:"w-full font-bold",for:"username"},de={class:"flex flex-column gap-2 w-full"},ce={style:{visibility:"hidden"},for:"username"},ue=l("small",{id:"username-help"},null,-1);function _e(s,t,g,b,e,d){const c=r("InputText"),_=r("Calendar"),u=r("Dropdown"),v=r("Button");return p(),h("div",S,[l("div",T,[E,l("div",M,[l("h1",z,n(s.$t("Register_your_child")),1),l("h2",j,n(s.$t("From_here_you_can_register_your_child_with_us_to_be_monitored")),1),l("h3",G,n(s.$t("The_extent_to_which_his_mental_and_physical_skill_developed")),1)]),l("div",J,[i(C,{onClick:d.goback,style:{right:"50%"},class:"bg-[#135C65] text-white p-6 absolute rounded-full",start:"",icon:"mdi-arrow-left"},null,8,["onClick"])])]),l("div",K,[e.show_alert?(p(),h("p",P,n(e.alert_text),1)):D("",!0),l("form",{onSubmit:t[10]||(t[10]=A((...o)=>d.addChild&&d.addChild(...o),["prevent"]))},[l("div",H,[l("div",O,[l("label",Q,n(s.$t("Full_Name")),1),i(c,{required:"",class:a(["bg-[#f7f5f5] text-center",{"p-invalid":e.submitted&&!e.child.name}]),modelValue:e.child.name,"onUpdate:modelValue":t[0]||(t[0]=o=>e.child.name=o)},null,8,["modelValue","class"])]),l("div",W,[l("label",X,n(s.$t("date_of_birth")),1),i(_,{style:{width:"100%"},showButtonBar:"",modelValue:e.child.birth_date,"onUpdate:modelValue":t[1]||(t[1]=o=>e.child.birth_date=o),showIcon:"",class:a({"p-invalid":e.submitted&&!e.child.birth_date}),maxDate:e.maxDate},null,8,["modelValue","class","maxDate"])]),l("div",Y,[l("label",Z,n(s.$t("place_of_birth")),1),i(c,{required:"",class:a(["bg-[#f7f5f5] text-center",{"p-invalid":e.submitted&&!e.child.birth_place}]),modelValue:e.child.birth_place,"onUpdate:modelValue":t[2]||(t[2]=o=>e.child.birth_place=o)},null,8,["modelValue","class"])]),l("div",$,[l("label",ee,n(s.$t("address")),1),i(c,{required:"",class:a(["bg-[#f7f5f5] text-center",{"p-invalid":e.submitted&&!e.child.address}]),modelValue:e.child.address,"onUpdate:modelValue":t[3]||(t[3]=o=>e.child.address=o)},null,8,["modelValue","class"])]),l("div",le,[l("label",te,n(s.$t("national_id")),1),i(c,{required:"",class:a(["bg-[#f7f5f5] text-center",{"p-invalid":e.submitted&&!e.child.national_id}]),modelValue:e.child.national_id,"onUpdate:modelValue":t[4]||(t[4]=o=>e.child.national_id=o)},null,8,["modelValue","class"])]),l("div",se,[l("label",oe,n(s.$t("Type")),1),i(u,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:e.child.gender,"onUpdate:modelValue":t[5]||(t[5]=o=>e.child.gender=o),"option-value":"value",options:d.arr(),optionLabel:"name",class:a([{"p-invalid":e.submitted&&!e.child.gender},"w-full"])},null,8,["modelValue","options","class"])]),l("div",ne,[l("label",ie,n(s.$t("Nationality")),1),i(u,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:e.child.nationalty,"onUpdate:modelValue":t[6]||(t[6]=o=>e.child.nationalty=o),filter:"","option-value":"country",options:e.cities,optionLabel:"country",class:a([{"p-invalid":e.submitted&&!e.child.nationalty},"w-full"])},null,8,["modelValue","options","class"])]),l("div",ae,[l("label",re,n(s.$t("primary_language")),1),i(u,{required:"",id:"pv_id_1","onUpdate:modelValue":[t[7]||(t[7]=o=>d.getLangs(o)),t[8]||(t[8]=o=>e.child.lang=o)],filter:"",style:{direction:"ltr !important"},modelValue:e.child.lang,"option-value":"lang",options:e.lan,optionLabel:"lang",class:a([{"p-invalid":e.submitted&&!e.child.lang},"w-full"])},null,8,["modelValue","options","class"])]),l("div",de,[l("label",ce,n(s.$t("gruop_sessaion")),1),i(v,{onClick:t[9]||(t[9]=o=>e.submitted=!0),type:"submit",class:"create m-auto w-full",label:s.$t("Register_now")},null,8,["label"]),ue])])],32)])])}const me=f(N,[["render",_e]]),pe={components:{Map2:L,Nave:F,RForm:me,About:k}};function he(s,t,g,b,e,d){const c=r("nave"),_=r("RForm"),u=r("About");return p(),h(B,null,[i(c,{class:"shadow"}),i(_),i(u)],64)}const ve=f(pe,[["render",he]]);export{ve as default};
