import{_ as y,c as h,r as v,o as p,d as C,f as i,w as o,J as n,h as d,$ as V,x as f,V as b,g,a5 as w,t as a,ai as x,Z as F,bp as P,e as t,X as B}from"./main-ff5bcd5f.js";const N={data(){return{search:"",headers:[{key:"evaluation_title",title:"Evaluation Title"},{title:this.$t("operation")}],sideProfile:[],alert_text:null,groupBy:[{key:"side_profile_title"}],loading:!0,childName:""}},methods:{showside(e){this.$router.push({name:"resulte",params:{child_id:this.$route.params.id,sideProfile_id:e}})},goBack(){this.$router.go(-1)},getSideProfile(){h.get(`api/child/${this.$route.params.id}/show-side-profiles`).then(e=>{this.sideProfile=e.data.sideProfile,this.loading=!1,console.log(e.data.sideProfile)})},getChildrenName(){h.get(`api/child/${this.$route.params.id}`).then(e=>{this.childName=e.data.child.name})},editItem(e){this.$router.push({name:"EditSideProfiles",params:{id:e}})},deleteItem(e){console.log(e),h.delete(`/api/side-profiles/${e}/delete`).then(r=>{r.data.status==200&&(this.alert_text="side profile deleted successfully ",this.sideProfile=r.data.sideProfile)})},showItem(e,r){console.log(e),this.$router.push({name:"showChildResult",params:{child_id:this.$route.params.id,sideProfile_id:r,evaluation_id:e}})}},mounted(){this.getSideProfile(),this.getChildrenName()}},$=["onClick"],S=["onClick"],I={style:{"background-color":"#F6F6F6"}};function T(e,r,E,A,l,c){const k=v("v-data-table");return p(),C("div",null,[i(V,{height:"45",class:"mb-5 text-white",color:"#135c65",onClick:c.goBack},{default:o(()=>[i(n,{start:"",icon:"mdi-arrow-left"}),d(" Back ")]),_:1},8,["onClick"]),l.alert_text!=null?(p(),f(b,{key:0,type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close"),text:l.alert_text,class:"mb-8"},null,8,["close-label","text"])):g("",!0),i(B,null,{default:o(()=>[i(w,null,{default:o(()=>[d(a(l.childName)+" ",1),i(x),i(F,{modelValue:l.search,"onUpdate:modelValue":r[0]||(r[0]=s=>l.search=s),"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},null,8,["modelValue"])]),_:1}),i(k,{headers:l.headers,items:l.sideProfile,search:l.search,"group-by":l.groupBy,style:{padding:"15px"}},{top:o(()=>[l.loading?(p(),f(P,{key:0,slot:"progress",style:{color:"#F6F6F6"},indeterminate:""})):g("",!0)]),"group-header":o(({item:s,isGroupOpen:m,toggleGroup:u,columns:D,props:J})=>[t("tr",null,[t("td",{onClick:_=>u(s),style:{cursor:"pointer","background-color":"#F6F6F6"}},[i(n,null,{default:o(()=>[d(a(m(s)?"mdi-chevron-down":"mdi-chevron-right"),1)]),_:2},1024),d(" "+a(s.value),1)],8,$),t("td",{onClick:_=>u(s),style:{"background-color":"#F6F6F6",cursor:"pointer"}},null,8,S),t("td",I,[i(n,{small:"",color:"primary",class:"mx-3",onClick:_=>c.showside(s.items[0].raw.side_profile_id)},{default:o(()=>[d("mdi-eye ")]),_:2},1032,["onClick"])])])]),headers:o(()=>[t("tr",null,[t("td",null,a(e.$t("evaluation_type")),1),t("td",null,a(l.headers[0].title),1),t("td",null,a(l.headers[1].title),1)])]),item:o(({item:s,index:m})=>[t("tr",null,[t("td",null,a(e.colgroup),1),t("td",null,a(s.columns.evaluation_title),1),t("td",null,[i(n,{small:"",color:"primary",class:"mr-2",onClick:u=>c.showItem(s.raw.evaluations_id,s.raw.side_profile_id)},{default:o(()=>[d("mdi-eye ")]),_:2},1032,["onClick"])])])]),_:1},8,["headers","items","search","group-by"])]),_:1})])}const R=y(N,[["render",T]]);export{R as default};