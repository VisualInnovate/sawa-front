import{_ as v,c,o as d,d as n,e as t,t as r,F as u,B as V,f as s,w as a,X as y,a4 as w,a2 as b,i as g,v as m,a6 as k,af as C,$ as h,h as f}from"./main-11f2bc19.js";import{V as P}from"./VDialog-3338c358.js";import{a as x,V as B}from"./VRow-aa01ec70.js";const M={data(){return{pages:[],page_model_id:null,page_model_title:null,page_model_description:null,update_modal:!1}},methods:{getPages(){c.get("/api/site/pages").then(e=>{console.log(e),e.data.pages!=null&&(this.pages=e.data.pages)}).catch(e=>{console.log(e)})},updatePage(){c.post(`/api/site/pages/${this.page_model_id}`,{title:this.page_model_title,description:this.page_model_description}).then(e=>{console.log(e);const l=this.pages.findIndex(p=>p.id==e.data.pages.id);this.pages[l]=e.data.pages,this.update_modal=!1}).catch(e=>{console.log(e)})},openModal(e){this.page_model_id=e.id,this.page_model_title=e.title,this.page_model_description=e.description,this.update_modal=!0}},mounted(){this.getPages()}},T={class:"",style:{padding:"1rem 1.5rem"}},A={class:"text-2xl font-bold"},D={class:"text-lg",style:{color:"#42a5f5",padding:"0.5rem 0"}},L={class:"px-6 py-2 mt-2 mb-12 rounded-lg shadow-sm cursor-pointer item flex justify-between bg-gray-50"},U={class:"relative flex flex-col items-center mx-4"},j={class:"text-sm"},N=["onClick"],S=t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"},null,-1),F=[S],H={class:"flex flex-col items-end"},z={class:"text-xl py-1"},E={class:"text-base py-1 px-2"},I=t("span",{class:"text-h5"},"Update Page",-1),R={class:"mb-6"},X=t("label",{for:"page_title"},"Title",-1),q={class:""},G=t("label",{for:"page_description"},"Description",-1);function J(e,l,p,K,i,_){return d(),n(u,null,[t("div",T,[t("h2",A,r(e.$t("Pages")),1),t("p",D,r(e.$t("Pages_menu")),1)]),(d(!0),n(u,null,V(i.pages,o=>(d(),n("div",L,[t("div",U,[t("p",j,[(d(),n("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6",onClick:O=>_.openModal(o)},F,8,N))])]),t("div",H,[t("p",z,r(o.title),1),t("p",E,r(o.description),1)])]))),256)),t("div",null,[s(x,{justify:"center"},{default:a(()=>[s(P,{modelValue:i.update_modal,"onUpdate:modelValue":l[3]||(l[3]=o=>i.update_modal=o),persistent:"",width:"1024"},{default:a(()=>[s(y,{class:"pa-5",style:{"border-radius":"12px"}},{default:a(()=>[s(w,null,{default:a(()=>[I]),_:1}),s(b,null,{default:a(()=>[s(x,null,{default:a(()=>[s(B,{cols:"12"},{default:a(()=>[t("div",R,[X,g(t("input",{name:"page_title",id:"page_title",type:"text","onUpdate:modelValue":l[0]||(l[0]=o=>i.page_model_title=o),style:{width:"100%",border:"2px solid gray"},class:"focus:ring-gray-400"},null,512),[[m,i.page_model_title]])]),t("div",q,[G,g(t("textarea",{name:"page_description",id:"page_description","onUpdate:modelValue":l[1]||(l[1]=o=>i.page_model_description=o),style:{width:"100%",border:"2px solid gray"},class:"focus:ring-gray-400",rows:"5"},null,512),[[m,i.page_model_description]])])]),_:1})]),_:1})]),_:1}),s(k,null,{default:a(()=>[s(C),s(h,{color:"blue-darken-1",variant:"text",onClick:l[2]||(l[2]=o=>i.update_modal=!1)},{default:a(()=>[f(" Close ")]),_:1}),s(h,{color:"blue-darken-1",variant:"text",onClick:_.updatePage},{default:a(()=>[f(" Save ")]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})])],64)}const Z=v(M,[["render",J]]);export{Z as default};
