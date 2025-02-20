import{_ as p,c as m,r as _,o as h,d as f,E as x,V as C,g as V,f as t,w as s,h as n,t as i,$ as k,a4 as g,af as b,Z as y,e as u,N as c,X as E,F as I}from"./main-fd0aa1f8.js";const w={data(){return{search:"",headers:[{key:"id",title:"id"},{key:"title",title:"Title"}],evaluations:[],alert_text:null}},methods:{getEvaluations(){m.get("/api/evaluations").then(e=>{this.evaluations=e.data.evaluations,console.log(e.data.evaluations)})},editItem(e){this.$router.push({name:"EditEvaluations",params:{id:e}})},deleteItem(e){console.log(e),m.delete(`/api/evaluations/${e}/delete`).then(o=>{o.data.status==200&&(this.alert_text="evaluation deleted successfully ",this.evaluations=o.data.evaluations)})},create(){this.$router.push({name:"CreateEvaluations"})},showItem(e){this.$router.push({name:"ShowEvaluations",params:{id:e}})}},mounted(){this.getEvaluations()}};function B(e,o,N,S,a,r){const v=_("v-data-table");return h(),f(I,null,[a.alert_text!=null?(h(),x(C,{key:0,type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close"),text:a.alert_text,class:"mb-8"},null,8,["close-label","text"])):V("",!0),t(k,{text:"Create",color:"green",height:"45",class:"mb-5 mt-5",onClick:r.create},{default:s(()=>[n(i(e.$t("create_button")),1)]),_:1},8,["onClick"]),t(E,null,{default:s(()=>[t(g,null,{default:s(()=>[n(i(e.$t("evaluation"))+" ",1),t(b),t(y,{modelValue:a.search,"onUpdate:modelValue":o[0]||(o[0]=l=>a.search=l),"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},null,8,["modelValue"])]),_:1}),t(v,{headers:a.headers,items:a.evaluations,search:a.search},{item:s(({item:l})=>[u("tr",null,[u("td",null,i(l.columns.id),1),u("td",null,i(l.columns.title),1),u("td",null,[t(c,{small:"",color:"primary",class:"mx-3",onClick:d=>r.showItem(l.columns.id)},{default:s(()=>[n("mdi-plus-box")]),_:2},1032,["onClick"]),t(c,{small:"",color:"primary",class:"mx-3",onClick:d=>r.editItem(l.columns.id)},{default:s(()=>[n("mdi-pencil")]),_:2},1032,["onClick"]),t(c,{small:"",color:"error mx-3",onClick:d=>r.deleteItem(l.columns.id)},{default:s(()=>[n("mdi-delete")]),_:2},1032,["onClick"])])])]),_:1},8,["headers","items","search"])]),_:1})],64)}const $=p(w,[["render",B]]);export{$ as default};
