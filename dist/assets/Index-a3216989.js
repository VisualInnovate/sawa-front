import{_ as y,c as m,r as v,o as h,d as E,x as f,V as b,g as k,e as l,f as i,i as x,b_ as V,w as a,h as o,t as r,X as w,a2 as S,af as P,W as F,bv as B,I as u,T as I,F as $}from"./main-f9d3afa8.js";import{S as N}from"./Sideprofiletap-e7581017.js";const T={components:{Sideprofiletap:N},data(){return{search:"",headers:[],sideProfile:[],alert_text:null,loading:!0,groupBy:[{key:"side_profile_title"}],active:!1}},methods:{getSideProfile(){m.get("/api/side-profiles/all-evaluations").then(e=>{this.sideProfile=e.data.evaluations,console.log(this.sideProfile),this.loading=!1})},editItem(e){this.$router.push({name:"EditSideProfiles",params:{id:e}})},deleteItem(e){console.log(e),m.delete(`/api/side-profiles/${e}/delete`).then(d=>{d.data.status==200&&(this.alert_text="side profile deleted successfully ",this.sideProfile=d.data.sideProfile)})},create(){this.$router.push({name:"CreateSideProfiles"})},showItem(e){this.$router.push({name:"ShowSideProfiles",params:{id:e}})},onClickOutside(){this.active=!1},editEvaluation(e){this.$router.push({name:"EditEvaluations",params:{id:e}})},deleteEvaluation(e){console.log(e),m.delete(`/api/evaluations/${e}/delete`).then(d=>{d.data.status==200&&(this.alert_text="evaluation deleted successfully ",this.getSideProfile())})},createEvaluation(e){this.$router.push({name:"CreateEvaluations",params:{sideProfile_id:e}})},showEvaluation(e){this.$router.push({name:"ShowEvaluations",params:{id:e}})}},mounted(){this.getSideProfile()},computed:{header(){return this.headers=[{key:"evaluation_title",title:this.$t("evaluation_title")},{title:this.$t("operation")}]}}},O={class:"relative"},D=["onClick"],A=["onClick"],L={style:{"background-color":"#EFEFEF"}};function U(e,d,W,X,s,n){const g=v("Sideprofiletap"),C=v("v-data-table");return h(),E($,null,[s.alert_text!=null?(h(),f(b,{key:0,type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close"),text:s.alert_text,class:"mb-8"},null,8,["close-label","text"])):k("",!0),l("div",O,[i(g),x((h(),f(w,{text:"Create",color:"green",height:"45",class:"p-button-success mr-2 absolute top-3",onClick:n.create},{default:a(()=>[o(r(e.$t("create_button")),1)]),_:1},8,["onClick"])),[[V,n.onClickOutside]])]),i(I,null,{default:a(()=>[i(S,null,{default:a(()=>[o(r(e.$t("side_profile"))+" ",1),i(P),i(F,{modelValue:s.search,"onUpdate:modelValue":d[0]||(d[0]=t=>s.search=t),"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},null,8,["modelValue"])]),_:1}),i(C,{headers:n.header,items:s.sideProfile,search:s.search,loading:!0,"group-by":s.groupBy,"item-key":"name","show-group-by":""},{top:a(()=>[s.loading?(h(),f(B,{key:0,slot:"progress",style:{color:"#135c65"},indeterminate:""})):k("",!0)]),headers:a(()=>[l("tr",null,[l("td",null,r(e.$t("evaluation_type")),1),l("td",null,r(s.headers[0].title),1),l("td",null,r(s.headers[1].title),1)])]),"group-header":a(({item:t,isGroupOpen:_,toggleGroup:c,columns:j,props:q})=>[l("tr",null,[l("td",{onClick:p=>c(t),style:{cursor:"pointer","background-color":"#EFEFEF"}},[i(u,null,{default:a(()=>[o(r(_(t)?"mdi-chevron-down":"mdi-chevron-right"),1)]),_:2},1024),o(" "+r(t.value),1)],8,D),l("td",{onClick:p=>c(t),style:{cursor:"pointer","background-color":"#EFEFEF"}},null,8,A),l("td",L,[i(u,{small:"",color:"primary",class:"mx-3",onClick:p=>n.createEvaluation(t.items[0].raw.side_profile_id)},{default:a(()=>[o("mdi-plus-box")]),_:2},1032,["onClick"]),i(u,{small:"",color:"primary",class:"mx-3",onClick:p=>n.editItem(t.items[0].raw.side_profile_id)},{default:a(()=>[o("mdi-pencil")]),_:2},1032,["onClick"])])])]),item:a(({item:t,index:_})=>[l("tr",null,[l("td",null,r(e.colgroup),1),l("td",null,r(t.columns.evaluation_title),1),l("td",null,[i(u,{small:"",color:"primary",class:"mx-3",onClick:c=>n.showEvaluation(t.raw.evaluation_id)},{default:a(()=>[o("mdi-eye")]),_:2},1032,["onClick"]),i(u,{small:"",color:"primary",class:"mx-3",onClick:c=>n.editEvaluation(t.raw.evaluation_id)},{default:a(()=>[o("mdi-pencil")]),_:2},1032,["onClick"]),i(u,{small:"",color:"error mx-3",onClick:c=>n.deleteEvaluation(t.raw.evaluation_id)},{default:a(()=>[o("mdi-delete")]),_:2},1032,["onClick"])])])]),_:1},8,["headers","items","search","group-by"])]),_:1})],64)}const J=y(T,[["render",U]]);export{J as default};
