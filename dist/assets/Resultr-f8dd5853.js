import{_,c as h,r as g,o as p,d as f,f as r,w as d,K as m,h as n,t as e,a0 as c,e as s}from"./main-4124a381.js";import{h as k}from"./moment-fbc5633a.js";const y={data(){return{sortBy:[{key:"evaluation_title",order:"asc"}],headers:[],desserts:[]}},computed:{locale(){return this.$i18n.locale},header(){return this.headers=[{title:this.$t("id"),key:"id"},{title:this.$t("side_profile_title"),key:"side_profile_title"},{title:this.$t("evaluation_title"),key:"evaluation_title"},{title:this.$t("child_age"),key:"child_age"},{title:this.$t("diff_age"),key:"diff_age"},{title:this.$t("grow_age"),key:"grow_age"},{title:this.$t("late_percentage"),key:"late_percentage"},{title:this.$t("result_created_at"),key:"result_created_at"}]}},methods:{async getruslte(){await h.post("/api/child/results",{sideprofile_id:this.$route.params.sideProfile_id,child_id:this.$route.params.child_id}).then(a=>{console.log(a.data.evaluation_results),this.desserts=a.data.evaluation_results});for(var l=0;l<this.desserts.length;l++)this.desserts[l].result_created_at=k(this.desserts[l].result_created_at).format("DD-MM-yy ")},goBack(){this.$router.go(-1)},goprint(){this.$router.push({name:"ResultPrint"})}},mounted(){this.getruslte()}};function v(l,a,$,B,o,i){const u=g("v-data-table");return p(),f("div",null,[r(c,{height:"45",class:"mb-5 text-white",color:"#135c65",onClick:i.goBack},{default:d(()=>[r(m,{start:"",icon:"mdi-arrow-left"}),n(" "+e(l.$t("back")),1)]),_:1},8,["onClick"]),s("div",null,[r(c,{height:"45",class:"mb-5 text-white",color:"#A9AB7F",onClick:i.goprint},{default:d(()=>[n(e(l.$t("print")),1)]),_:1},8,["onClick"])]),r(u,{"sort-by":o.sortBy,"onUpdate:sortBy":a[0]||(a[0]=t=>o.sortBy=t),headers:i.header,items:o.desserts,class:"elevation-1"},{item:d(({item:t})=>[s("tr",null,[s("td",null,e(t.columns.id),1),s("td",null,e(t.columns.evaluation_title),1),s("td",null,e(t.columns.side_profile_title),1),s("td",null,e(t.columns.child_age),1),s("td",null,e(t.columns.diff_age),1),s("td",null,e(t.columns.grow_age),1),s("td",null,e(Math.round(t.columns.late_percentage))+" %",1),s("td",null,e(t.columns.result_created_at),1)])]),_:1},8,["sort-by","headers","items"])])}const x=_(y,[["render",v]]);export{x as default};
