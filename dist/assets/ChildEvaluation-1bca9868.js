import{_,c as p,r as v,o as d,d as f,f as e,w as l,K as c,h as r,a0 as V,x as g,V as x,g as C,a5 as k,af as b,$ as B,e as o,t as u,Y as $}from"./main-4124a381.js";const w={data(){return{search:"",headers:[],evaluations:[],alert_text:null,tableCounter:1}},methods:{goBack(){this.$router.go(-1)},getResults(){p.get(`/api/evaluations/${this.$route.params.child_id}/${this.$route.params.sideProfile_id}/evaluations-child`).then(t=>{this.evaluations=t.data.evaluations,console.log(this.evaluations)})},showItem(t){console.log(t),this.$router.push({name:"showChildResult",params:{child_id:this.$route.params.child_id,sideProfile_id:this.$route.params.sideProfile_id,evaluation_id:t}})}},mounted(){this.getResults()},computed:{locale(){return this.$i18n.locale},header(){return this.headers=[{title:"id"},{key:"evaluation_title",title:this.$t("evaluation_title")}]}}};function y(t,n,N,E,a,i){const h=v("v-data-table");return d(),f("div",null,[e(V,{height:"45",class:"mb-5",color:"red",onClick:i.goBack},{default:l(()=>[e(c,{start:"",icon:"mdi-arrow-left"}),r(" Back ")]),_:1},8,["onClick"]),a.alert_text!=null?(d(),g(x,{key:0,type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close"),text:a.alert_text,class:"mb-8"},null,8,["close-label","text"])):C("",!0),e($,null,{default:l(()=>[e(k,null,{default:l(()=>[r(" Evaluation "),e(b),e(B,{modelValue:a.search,"onUpdate:modelValue":n[0]||(n[0]=s=>a.search=s),"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},null,8,["modelValue"])]),_:1}),e(h,{headers:i.header,items:a.evaluations,search:a.search},{item:l(({item:s,index:m})=>[o("tr",null,[o("td",null,u(m+1),1),o("td",null,u(s.columns.evaluation_title),1),o("td",null,[e(c,{small:"",color:"#135C65",class:"mx-3",onClick:I=>i.showItem(s.raw.id)},{default:l(()=>[r(" mdi-eye")]),_:2},1032,["onClick"])])])]),_:1},8,["headers","items","search"])]),_:1})])}const R=_(w,[["render",y]]);export{R as default};
