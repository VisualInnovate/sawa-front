import{_ as m,c as g,a2 as f,s as v,r as x,o as d,d as b,L as y,a7 as k,j as $,e as t,t as s,f as _,g as r,a5 as w,F as C,y as D,z as B,a6 as I}from"./main-8a344e1a.js";import"./auto-6ae9f919.js";import{h as V}from"./moment-fbc5633a.js";const Y={data(){return{search:"",headers:[],result:[],print_results:[],alert_text:null,ctx:null,created_at:[],latePercenteges:[],growAge:[],diffAge:[],date1:"",date2:"",myCahrt:"",selectX:null,selectY:null,visible:!1,examDate:"",NameRules:[e=>e?!0:"This field is required"],examId:"",loading:!0}},methods:{goBack(){this.$router.go(-1)},async print(){await g.post(`/api/filter/resultr/${this.$route.params.child_id}/${this.$route.params.sideProfile_id}/${this.$route.params.evaluation_id}`,{startdate:this.$route.params.start,enddate:this.$route.params.end}).then(e=>{console.log(e),this.print_results=e.data.evaluation_results}),setTimeout(()=>{window.print()},500)},formateDate(e){return V(e).format("DD-MM-YYYY HH:mm")}},components:{Dialog:f,Button:v},beforeMount(){this.print()},computed:{locale(){return this.$i18n.locale},header(){return this.headers=[{title:"id"},{key:"therapist_name",title:this.$t("therapist_name")},{key:"child_age",title:this.$t("child_age")},{key:"grow_age",title:this.$t("grow_age")},{key:"diff_age",title:this.$t("diff_age")},{key:"basal_age",title:this.$t("basal_age")},{key:"late_percentage",title:this.$t("late_percentage")},{key:"result_created_at",title:this.$t("created_at")}]}},computedResult(){return this.result}},u=e=>(D("data-v-f77f1e1a"),e=e(),B(),e),M={class:"back-back"},N={class:"back"},P=u(()=>t("div",{class:"text-center"},[t("img",{src:I,style:{width:"130px"}})],-1)),R={class:"w-[100%] text-h4 text-center ma-4"},S={class:"w-[100%] text-right ma-4"},A={class:"w-[100%] text-right ma-4"},F=u(()=>t("canvas",{id:"myChart",style:{height:"70vh !important","margin-bottom":"30px"}},null,-1));function H(e,T,j,q,a,i){var o,n,c;const h=x("v-data-table");return d(),b(C,null,[a.alert_text!=null?(d(),y(k,{key:0,type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close"),text:a.alert_text,class:"mb-8"},null,8,["close-label","text"])):$("",!0),t("div",M,[t("div",N,[P,t("div",null,[t("p",R,s((o=a.print_results[0])==null?void 0:o.evaluation_title),1)]),t("div",null,[t("p",S,s((n=a.print_results[0])==null?void 0:n.child_name),1),t("p",A,s((c=a.print_results[0])==null?void 0:c.birth_date),1)]),F,_(w,null,{default:r(()=>[_(h,{class:"hidden-table",headers:i.header,items:a.print_results,search:a.search},{item:r(({item:l,index:p})=>[t("tr",null,[t("td",null,s(p+1),1),t("td",null,s(l.columns.therapist_name),1),t("td",null,s(l.columns.child_age)+" months",1),t("td",null,s(l.columns.grow_age),1),t("td",null,s(l.columns.diff_age),1),t("td",null,s(l.columns.basal_age)+" months",1),t("td",null,s(Math.round(l.columns.late_percentage))+" %",1),t("td",null,s(i.formateDate(l.columns.result_created_at)),1)])]),bottom:r(()=>[]),_:1},8,["headers","items","search"])]),_:1})])])],64)}const X=m(Y,[["render",H],["__scopeId","data-v-f77f1e1a"]]);export{X as default};
