import{Q as u,a5 as z,a8 as R,a7 as W,a0 as Q,r as b,o as i,d as c,f as a,e as l,w as T,t as O,E as w,F as D,z as M,i as j,bt as A,D as G,h as H,T as J,g as f,x as K,c as k}from"./main-f9d3afa8.js";import"./moment-fbc5633a.js";const P={class:"card"},X={class:"w-full m-5"},Y={class:"",for:"name"},ee={class:"flex align-items-center mb-2"},le={class:"field mx-5"},te=["onUpdate:modelValue","onClick"],ae={class:"field mr-7 w-20"},oe={key:0,class:"field mx-5"},se=l("label",{class:"mx-5"},"Clock In",-1),ne={key:1,class:"field mr-5"},de=l("label",{class:"mx-5"},"Clock In",-1),ue={key:2,class:"field"},ie=l("label",{class:"mx-2.5 w-10"},"Clock Out",-1),me={key:3,class:"field"},ce=l("label",{class:"mx-5"},"Clock Out",-1),re={key:0,class:"card mt-4"},pe={style:{display:"grid !important","grid-template-columns":"repeat(2, minmax(0, 1fr))",gap:"8px",padding:"10px"}},_e={class:"flex flex-column gap-2"},ve=l("label",{for:"username"},"Name",-1),fe={style:{visibility:"hidden"},class:"flex flex-column gap-2"},ye=l("label",{for:"username"},"Name",-1),he={style:{display:"grid !important","grid-template-columns":"repeat(2, minmax(0, 1fr))",gap:"8px","padding-bottom":"10px !important",padding:"10px !important","border-bottom":"2px solid black"},class:"m-auto w-[90%]"},Ve={class:"flex flex-column gap-2"},xe=l("label",{for:"username"},"start Day",-1),be={class:"flex flex-column gap-2"},ke=l("label",{for:"username"},"Start Time",-1),ge={class:"flex flex-column gap-2"},Ue=l("label",{for:"username"},"End Day",-1),we={class:"flex flex-column gap-2"},Ce=l("label",{for:"username"},"End Time",-1),Se={key:1,style:{display:"grid !important","grid-template-columns":"repeat(2, minmax(0, 1fr))",gap:"8px","padding-bottom":"10px !important",padding:"10px !important","border-bottom":"2px solid black"},class:"m-auto w-[90%]"},Te={class:"flex flex-column gap-2"},Oe=l("label",{for:"username"},"start Day",-1),De={class:"flex flex-column gap-2"},Me=l("label",{for:"username"},"Start Time",-1),Ee={class:"flex flex-column gap-2"},Fe=l("label",{for:"username"},"End Day",-1),Ne={class:"flex flex-column gap-2"},qe=l("label",{for:"username"},"End Time",-1),Ie={class:"flex gap-2",style:{display:"grid !important","grid-template-columns":"repeat(2, minmax(0, 1fr))",gap:"8px",padding:"10px"}},Be={class:"flex flex-column gap-2"},Le={key:1,class:"card mt-4"},Ze={class:"lg:w-6 w-full"},$e={class:"flex flex-column gap-2"},ze=l("label",{for:"username"},"Name",-1),Re={class:"flex flex-column gap-2"},We=l("label",{for:"username"},"Clock In",-1),Qe={class:"flex flex-column gap-2"},je=l("label",{for:"username"},"Clock Out",-1),Je={__name:"update",setup(Ae){const _=u(""),g=u(!0);u(1);const m=u({}),d=u({title:null,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,days:[]}),y=u(!1),E=z(),U=R(),h=W(),r=u([]),p=u({}),V=u([{name:"Sunday",value:"Sunday"},{name:"Monday",value:"Monday"},{name:"Tuesday",value:"Tuesday"},{name:"Thursday",value:"Thursday"},{name:"Wednesday",value:"Wednesday"},{name:"Friday",value:"Friday"},{name:"Saturday",value:"Saturday"}]),C=u();u([{name:"Normal Shift",value:"1"},{name:"24 Shift",value:"2"},{name:"directorate shift",value:"3"}]);const F=()=>{r.value.push(m.value),m.value=u({}),console.log(r.value),g.value=!0},N=()=>{r.value.length=r.value.length-1},q=()=>{k.post("/dashboard/directorate/shift",p.value).then(s=>{h.add({severity:"success",summary:"Success",detail:"created Successfully",life:3e3}),U.go(-1)}).catch(s=>{console.error(s)})},I=()=>{r.value.push(m.value),g.value=!1,m.value=u({}),k.post("/dashboard/custom/shift",{name:_.value,days:r.value}).then(s=>{h.add({severity:"success",summary:"Success",detail:"created Successfully",life:3e3}),U.go(-1)}).catch(s=>{console.error(s)})},B=()=>{y.value=!0;let s=0;d.value.title||s++,d.value.days.forEach(t=>{t.week_end&&(!t.clock_out||!t.clock_in)&&s++}),!s&&(k.post("/api/shifts",d.value).then(t=>{h.add({severity:"success",summary:"Success",detail:"created Successfully",life:3e3}),U.go(-1),console.log(d.value)}).catch(t=>{h.add({severity:"error",summary:"Success",detail:t,life:3e3})}),console.log(d))},L=()=>{k.get(`/api/shifts/${E.params.id}`).then(s=>{d.value=s.data.data,d.value.timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone})};Q(()=>{L()});const Z=s=>{d.value.days[s].clock_in=null,d.value.days[s].clock_out=null};return(s,t)=>{const $=b("Toast"),n=b("InputText"),v=b("Button"),x=b("Dropdown");return i(),c("div",null,[a($),l("form",null,[a(J,{style:{"overflow-x":"scroll"}},{default:T(()=>[l("div",P,[l("div",X,[l("p",Y,O(s.$t("title")),1),a(n,{modelValue:d.value.title,"onUpdate:modelValue":t[0]||(t[0]=e=>d.value.title=e),id:"name",required:"",class:w({"p-invalid":y.value&&!d.value.title})},null,8,["modelValue","class"])]),(i(!0),c(D,null,M(d.value.days,(e,S)=>(i(),c("div",ee,[l("div",le,[j(l("input",{type:"checkbox",style:{border:"1px solid black"},"onUpdate:modelValue":o=>e.week_end=o,binary:!0,onClick:o=>Z(S)},null,8,te),[[A,e.week_end]])]),l("div",ae,O(e.day),1),e.week_end?(i(),c("div",ne,[de,a(n,{type:"time",modelValue:e.clock_in,"onUpdate:modelValue":o=>e.clock_in=o,modelModifiers:{trim:!0},required:"",timeOnly:"",autofocus:"",hourFormat:"12",class:w({"p-invalid":y.value&&!e.clock_out})},null,8,["modelValue","onUpdate:modelValue","class"])])):(i(),c("div",oe,[se,a(n,{type:"time",modelValue:e.clock_in,"onUpdate:modelValue":o=>e.clock_in=o,modelModifiers:{trim:!0},timeOnly:"",disabled:"",autofocus:""},null,8,["modelValue","onUpdate:modelValue"])])),e.week_end?(i(),c("div",me,[ce,a(n,{type:"time",modelValue:e.clock_out,"onUpdate:modelValue":o=>e.clock_out=o,modelModifiers:{trim:!0},timeOnly:"",class:w(["w-28",{"p-invalid":y.value&&!e.clock_out}]),required:"",hourFormat:"12",autofocus:""},null,8,["modelValue","onUpdate:modelValue","class"])])):(i(),c("div",ue,[ie,a(n,{class:"w-28",type:"time",modelValue:e.clock_out,"onUpdate:modelValue":o=>e.clock_out=o,modelModifiers:{trim:!0},timeOnly:"",disabled:"",autofocus:""},null,8,["modelValue","onUpdate:modelValue"])]))]))),256)),a(v,{class:"create m-5",type:"submit",onClick:t[1]||(t[1]=G(e=>B(),["prevent"]))},{default:T(()=>[H("Submit")]),_:1})])]),_:1})]),C.value==2?(i(),c("div",re,[l("div",pe,[l("div",_e,[ve,a(n,{id:"username",modelValue:_.value,"onUpdate:modelValue":t[2]||(t[2]=e=>_.value=e),"aria-describedby":"username-help"},null,8,["modelValue"])]),l("div",fe,[ye,a(n,{id:"username",modelValue:_.value,"onUpdate:modelValue":t[3]||(t[3]=e=>_.value=e),"aria-describedby":"username-help"},null,8,["modelValue"])])]),r.value?(i(!0),c(D,{key:0},M(r.value,(e,S)=>(i(),c("div",he,[l("div",Ve,[xe,a(x,{required:"",modelValue:e.start_day,"onUpdate:modelValue":o=>e.start_day=o,editable:"",options:V.value,optionLabel:"name","option-value":"value"},null,8,["modelValue","onUpdate:modelValue","options"])]),l("div",be,[ke,a(n,{type:"time",timeOnly:"",modelValue:e.start_time,"onUpdate:modelValue":o=>e.start_time=o,autofocus:""},null,8,["modelValue","onUpdate:modelValue"])]),l("div",ge,[Ue,a(x,{required:"",modelValue:e.end_day,"onUpdate:modelValue":o=>e.end_day=o,editable:"",options:V.value,optionLabel:"name","option-value":"value"},null,8,["modelValue","onUpdate:modelValue","options"])]),l("div",we,[Ce,a(n,{type:"time",timeOnly:"",modelValue:e.end_time,"onUpdate:modelValue":o=>e.end_time=o,autofocus:""},null,8,["modelValue","onUpdate:modelValue"])])]))),256)):f("",!0),g.value?(i(),c("div",Se,[l("div",Te,[Oe,a(x,{required:"",modelValue:m.value.start_day,"onUpdate:modelValue":t[4]||(t[4]=e=>m.value.start_day=e),editable:"",options:V.value,optionLabel:"name","option-value":"value"},null,8,["modelValue","options"])]),l("div",De,[Me,a(n,{type:"time",timeOnly:"",modelValue:m.value.start_time,"onUpdate:modelValue":t[5]||(t[5]=e=>m.value.start_time=e),autofocus:""},null,8,["modelValue"])]),l("div",Ee,[Fe,a(x,{required:"",modelValue:m.value.end_day,"onUpdate:modelValue":t[6]||(t[6]=e=>m.value.end_day=e),editable:"",options:V.value,optionLabel:"name","option-value":"value"},null,8,["modelValue","options"])]),l("div",Ne,[qe,a(n,{type:"time",timeOnly:"",modelValue:m.value.end_time,"onUpdate:modelValue":t[7]||(t[7]=e=>m.value.end_time=e),autofocus:""},null,8,["modelValue"])])])):f("",!0),l("div",Ie,[l("div",null,[a(v,{style:{"background-color":"#22C55E"},icon:"pi pi-plus",onClick:F}),r.value.length!=0?(i(),K(v,{key:0,severity:"danger",icon:"pi pi-minus",class:"mx-4",onClick:N})):f("",!0)]),l("div",Be,[a(v,{label:"create shift",class:"w-full",onClick:I})])])])):f("",!0),C.value==3?(i(),c("div",Le,[l("div",Ze,[l("div",$e,[ze,a(n,{id:"username",modelValue:p.value.name,"onUpdate:modelValue":t[8]||(t[8]=e=>p.value.name=e),"aria-describedby":"username-help"},null,8,["modelValue"])]),l("div",Re,[We,a(n,{type:"time",timeOnly:"",modelValue:p.value.clock_in,"onUpdate:modelValue":t[9]||(t[9]=e=>p.value.clock_in=e),autofocus:""},null,8,["modelValue"])]),l("div",Qe,[je,a(n,{type:"time",timeOnly:"",modelValue:p.value.clock_out,"onUpdate:modelValue":t[10]||(t[10]=e=>p.value.clock_out=e),autofocus:""},null,8,["modelValue"])]),a(v,{label:"create shift",class:"w-full my-4",onClick:q})])])):f("",!0)])}}};export{Je as default};
