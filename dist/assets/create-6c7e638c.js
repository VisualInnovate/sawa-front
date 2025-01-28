import{R as u,a7 as R,Q as W,a9 as $,r as x,o as d,d as c,f as a,e as l,w as T,t as O,G as w,F as D,B as M,i as Z,bt as z,E as G,h as Q,X,g as f,x as j,c as U}from"./main-fc77a027.js";import"./moment-fbc5633a.js";const A={class:"card"},H={class:"w-full m-5"},J={class:"",for:"name"},K={class:"flex align-items-center mb-2"},P={class:"field mx-5"},Y=["onUpdate:modelValue","onClick"],ee={class:"field mr-7 w-24"},le={key:0,class:"field mx-5"},oe=l("label",{class:"mx-5"},"Clock In",-1),ae={key:1,class:"field mr-5"},te=l("label",{class:"mx-5"},"Clock In",-1),se={key:2,class:"field"},ne=l("label",{class:"mx-2.5 w-10"},"Clock Out",-1),ue={key:3,class:"field"},de=l("label",{class:"mx-5"},"Clock Out",-1),ie={key:0,class:"card mt-4"},ce={style:{display:"grid !important","grid-template-columns":"repeat(2, minmax(0, 1fr))",gap:"8px",padding:"10px"}},me={class:"flex flex-column gap-2"},re=l("label",{for:"username"},"Name",-1),pe={style:{visibility:"hidden"},class:"flex flex-column gap-2"},_e=l("label",{for:"username"},"Name",-1),ve={style:{display:"grid !important","grid-template-columns":"repeat(2, minmax(0, 1fr))",gap:"8px","padding-bottom":"10px !important",padding:"10px !important","border-bottom":"2px solid black"},class:"m-auto w-[90%]"},fe={class:"flex flex-column gap-2"},ye=l("label",{for:"username"},"start Day",-1),ke={class:"flex flex-column gap-2"},he=l("label",{for:"username"},"Start Time",-1),Ve={class:"flex flex-column gap-2"},xe=l("label",{for:"username"},"End Day",-1),be={class:"flex flex-column gap-2"},ge=l("label",{for:"username"},"End Time",-1),we={key:1,style:{display:"grid !important","grid-template-columns":"repeat(2, minmax(0, 1fr))",gap:"8px","padding-bottom":"10px !important",padding:"10px !important","border-bottom":"2px solid black"},class:"m-auto w-[90%]"},Ue={class:"flex flex-column gap-2"},Ce=l("label",{for:"username"},"start Day",-1),Se={class:"flex flex-column gap-2"},Te=l("label",{for:"username"},"Start Time",-1),Oe={class:"flex flex-column gap-2"},De=l("label",{for:"username"},"End Day",-1),Me={class:"flex flex-column gap-2"},Ee=l("label",{for:"username"},"End Time",-1),Fe={class:"flex gap-2",style:{display:"grid !important","grid-template-columns":"repeat(2, minmax(0, 1fr))",gap:"8px",padding:"10px"}},Ne={class:"flex flex-column gap-2"},qe={key:1,class:"card mt-4"},Be={class:"lg:w-6 w-full"},Ie={class:"flex flex-column gap-2"},Le=l("label",{for:"username"},"Name",-1),Re={class:"flex flex-column gap-2"},We=l("label",{for:"username"},"Clock In",-1),$e={class:"flex flex-column gap-2"},Ze=l("label",{for:"username"},"Clock Out",-1),Xe={__name:"create",setup(ze){const _=u(""),b=u(!0);u(1);const i=u({}),m=u({name:null,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,days:[{week_end:!1,clock_in:null,clock_out:null,day:"Saturday"},{week_end:!0,clock_in:null,clock_out:null,day:"Sunday"},{week_end:!0,clock_in:null,clock_out:null,day:"Monday"},{week_end:!0,clock_in:null,clock_out:null,day:"Tuesday"},{week_end:!0,clock_in:null,clock_out:null,day:"Wednesday"},{week_end:!0,clock_in:null,clock_out:null,day:"Thursday"},{week_end:!1,clock_in:null,clock_out:null,day:"Friday"}]}),y=u(!1);R();const g=W(),k=$(),r=u([]),p=u({}),h=u([{name:"Sunday",value:"Sunday"},{name:"Monday",value:"Monday"},{name:"Tuesday",value:"Tuesday"},{name:"Thursday",value:"Thursday"},{name:"Wednesday",value:"Wednesday"},{name:"Friday",value:"Friday"},{name:"Saturday",value:"Saturday"}]),C=u();u([{name:"Normal Shift",value:"1"},{name:"24 Shift",value:"2"},{name:"directorate shift",value:"3"}]);const E=()=>{r.value.push(i.value),i.value=u({}),console.log(r.value),b.value=!0},F=()=>{r.value.length=r.value.length-1},N=()=>{U.post("/dashboard/directorate/shift",p.value).then(s=>{k.add({severity:"success",summary:"Success",detail:"created Successfully",life:3e3}),g.go(-1)}).catch(s=>{console.error(s)})},q=()=>{r.value.push(i.value),b.value=!1,i.value=u({}),U.post("/dashboard/custom/shift",{name:_.value,days:r.value}).then(s=>{k.add({severity:"success",summary:"Success",detail:"created Successfully",life:3e3}),g.go(-1)}).catch(s=>{console.error(s)})},B=()=>{y.value=!0;let s=0;m.value.title||s++,m.value.days.forEach(o=>{o.week_end&&(!o.clock_out||!o.clock_in)&&s++}),!s&&(U.post("/api/shifts",m.value).then(o=>{k.add({severity:"success",summary:"Success",detail:"created Successfully",life:3e3}),g.go(-1),console.log(m.value)}).catch(o=>{k.add({severity:"error",summary:"Success",detail:o,life:3e3})}),console.log(m))},I=s=>{m.value.days[s].clock_in=null,m.value.days[s].clock_out=null};return(s,o)=>{const L=x("Toast"),n=x("InputText"),v=x("Button"),V=x("Dropdown");return d(),c("div",null,[a(L),l("form",null,[a(X,{style:{"overflow-x":"scroll"},class:"bg-slate-50"},{default:T(()=>[l("div",A,[l("div",H,[l("p",J,O(s.$t("title")),1),a(n,{modelValue:m.value.title,"onUpdate:modelValue":o[0]||(o[0]=e=>m.value.title=e),id:"name",required:"",class:w({"p-invalid":y.value&&!m.value.title})},null,8,["modelValue","class"])]),(d(!0),c(D,null,M(m.value.days,(e,S)=>(d(),c("div",K,[l("div",P,[Z(l("input",{type:"checkbox",style:{border:"1px solid black"},"onUpdate:modelValue":t=>e.week_end=t,binary:!0,onClick:t=>I(S)},null,8,Y),[[z,e.week_end]])]),l("div",ee,O(e.day),1),e.week_end?(d(),c("div",ae,[te,a(n,{type:"time",modelValue:e.clock_in,"onUpdate:modelValue":t=>e.clock_in=t,modelModifiers:{trim:!0},required:"",timeOnly:"",autofocus:"",hourFormat:"12",class:w({"p-invalid":y.value&&!e.clock_out})},null,8,["modelValue","onUpdate:modelValue","class"])])):(d(),c("div",le,[oe,a(n,{type:"time",modelValue:e.clock_in,"onUpdate:modelValue":t=>e.clock_in=t,modelModifiers:{trim:!0},timeOnly:"",disabled:"",autofocus:""},null,8,["modelValue","onUpdate:modelValue"])])),e.week_end?(d(),c("div",ue,[de,a(n,{type:"time",modelValue:e.clock_out,"onUpdate:modelValue":t=>e.clock_out=t,modelModifiers:{trim:!0},timeOnly:"",required:"",hourFormat:"12",autofocus:"",class:w({"p-invalid":y.value&&!e.clock_out})},null,8,["modelValue","onUpdate:modelValue","class"])])):(d(),c("div",se,[ne,a(n,{type:"time",modelValue:e.clock_out,"onUpdate:modelValue":t=>e.clock_out=t,modelModifiers:{trim:!0},timeOnly:"",disabled:"",autofocus:""},null,8,["modelValue","onUpdate:modelValue"])]))]))),256)),a(v,{class:"create m-5",type:"submit",onClick:o[1]||(o[1]=G(e=>B(),["prevent"]))},{default:T(()=>[Q("Submit")]),_:1})])]),_:1})]),C.value==2?(d(),c("div",ie,[l("div",ce,[l("div",me,[re,a(n,{id:"username",modelValue:_.value,"onUpdate:modelValue":o[2]||(o[2]=e=>_.value=e),"aria-describedby":"username-help"},null,8,["modelValue"])]),l("div",pe,[_e,a(n,{id:"username",modelValue:_.value,"onUpdate:modelValue":o[3]||(o[3]=e=>_.value=e),"aria-describedby":"username-help"},null,8,["modelValue"])])]),r.value?(d(!0),c(D,{key:0},M(r.value,(e,S)=>(d(),c("div",ve,[l("div",fe,[ye,a(V,{required:"",modelValue:e.start_day,"onUpdate:modelValue":t=>e.start_day=t,editable:"",options:h.value,optionLabel:"name","option-value":"value"},null,8,["modelValue","onUpdate:modelValue","options"])]),l("div",ke,[he,a(n,{type:"time",timeOnly:"",modelValue:e.start_time,"onUpdate:modelValue":t=>e.start_time=t,autofocus:""},null,8,["modelValue","onUpdate:modelValue"])]),l("div",Ve,[xe,a(V,{required:"",modelValue:e.end_day,"onUpdate:modelValue":t=>e.end_day=t,editable:"",options:h.value,optionLabel:"name","option-value":"value"},null,8,["modelValue","onUpdate:modelValue","options"])]),l("div",be,[ge,a(n,{type:"time",timeOnly:"",modelValue:e.end_time,"onUpdate:modelValue":t=>e.end_time=t,autofocus:""},null,8,["modelValue","onUpdate:modelValue"])])]))),256)):f("",!0),b.value?(d(),c("div",we,[l("div",Ue,[Ce,a(V,{required:"",modelValue:i.value.start_day,"onUpdate:modelValue":o[4]||(o[4]=e=>i.value.start_day=e),editable:"",options:h.value,optionLabel:"name","option-value":"value"},null,8,["modelValue","options"])]),l("div",Se,[Te,a(n,{type:"time",timeOnly:"",modelValue:i.value.start_time,"onUpdate:modelValue":o[5]||(o[5]=e=>i.value.start_time=e),autofocus:""},null,8,["modelValue"])]),l("div",Oe,[De,a(V,{required:"",modelValue:i.value.end_day,"onUpdate:modelValue":o[6]||(o[6]=e=>i.value.end_day=e),editable:"",options:h.value,optionLabel:"name","option-value":"value"},null,8,["modelValue","options"])]),l("div",Me,[Ee,a(n,{type:"time",timeOnly:"",modelValue:i.value.end_time,"onUpdate:modelValue":o[7]||(o[7]=e=>i.value.end_time=e),autofocus:""},null,8,["modelValue"])])])):f("",!0),l("div",Fe,[l("div",null,[a(v,{style:{"background-color":"#22C55E"},icon:"pi pi-plus",onClick:E}),r.value.length!=0?(d(),j(v,{key:0,severity:"danger",icon:"pi pi-minus",class:"mx-4",onClick:F})):f("",!0)]),l("div",Ne,[a(v,{label:"create shift",class:"w-full",onClick:q})])])])):f("",!0),C.value==3?(d(),c("div",qe,[l("div",Be,[l("div",Ie,[Le,a(n,{id:"username",modelValue:p.value.name,"onUpdate:modelValue":o[8]||(o[8]=e=>p.value.name=e),"aria-describedby":"username-help"},null,8,["modelValue"])]),l("div",Re,[We,a(n,{type:"time",timeOnly:"",modelValue:p.value.clock_in,"onUpdate:modelValue":o[9]||(o[9]=e=>p.value.clock_in=e),autofocus:""},null,8,["modelValue"])]),l("div",$e,[Ze,a(n,{type:"time",timeOnly:"",modelValue:p.value.clock_out,"onUpdate:modelValue":o[10]||(o[10]=e=>p.value.clock_out=e),autofocus:""},null,8,["modelValue"])]),a(v,{label:"create shift",class:"w-full my-4",onClick:N})])])):f("",!0)])}}};export{Xe as default};
