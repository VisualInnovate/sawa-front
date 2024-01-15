import{_ as p,y as u,o as r,e as c,q as l,x as s,G as f,i as d,t as n,X as m,f as h,V,p as b,l as g,W as y,h as i,a6 as v}from"./main-201c6ce7.js";import{V as k}from"./VForm-a597863c.js";import{V as q}from"./VSheet-318d2768.js";const H={data:()=>({NameRules:[e=>(e==null?void 0:e.length)>=3?!0:" name must be at least 3 characters."],questionHeader:{title:"",from:"",to:""},fromSelect:[{title:"0",value:0},{title:"سته اشهر ",value:.5},{title:"سنة",value:1},{title:"سنة و نصف",value:1.5},{title:"سنتين",value:2},{title:"سنتين و نصف",value:2.5},{title:"3 سنين",value:3},{title:"3 سنين و نصف",value:3.5},{title:"4 سنين",value:4},{title:"4 سنين و نصف",value:4.5},{title:"5 سنين",value:5},{title:"5 سنين و نصف",value:5.5},{title:"6 سنين",value:6},{title:"6 سنين و نصف",value:6.5},{title:"7 سنين",value:7},{title:"7 سنين و نصف",value:7.5},{title:"8 سنين",value:8},{title:"8 سنين و نصف",value:8.5},{title:"9 سنين",value:9},{title:"9 سنين و نصف",value:9.5},{title:"10 سنين",value:10},{title:"10 سنين و نصف",value:10.5},{title:"11 سنه",value:11},{title:"11 سنين و نصف",value:11.5}],toSelect:[{title:"سته اشهر ",value:.5},{title:"سنة",value:1},{title:"سنة و نصف",value:1.5},{title:"سنتين",value:2},{title:"سنتين و نصف",value:2.5},{title:"3 سنين",value:3},{title:"3 سنين و نصف",value:3.5},{title:"4 سنين",value:4},{title:"4 سنين و نصف",value:4.5},{title:"5 سنين",value:5},{title:"5 سنين و نصف",value:5.5},{title:"6 سنين",value:6},{title:"6 سنين و نصف",value:6.5},{title:"7 سنين",value:7},{title:"7 سنين و نصف",value:7.5},{title:"8 سنين",value:8},{title:"8 سنين و نصف",value:8.5},{title:"9 سنين",value:9},{title:"9 سنين و نصف",value:9.5},{title:"10 سنين",value:10},{title:"10 سنين و نصف",value:10.5},{title:"11 سنين",value:11},{title:"11 سنين و نصف",value:11.5}],alert_text:null,alert_type:"success"}),methods:{goBack(){this.$router.go(-1)},submit(){u.post(`/api/evaluationheaders/${this.$route.params.id}/update`,this.questionHeader).then(e=>{if(e.data.status==200){this.alert_text="question header updated successfully ";let t=e.data.header;t.from=t.min_age/12,t.to=(t.min_age+t.type)/12,this.questionHeader=t,this.alert_type="success",this.alert_text=e.data.message}else this.alert_type="error",this.alert_text=e.data.message})},getQuestionHeader(){u.get(`/api/evaluationheaders/${this.$route.params.id}`).then(e=>{let t=e.data.header;t.from=t.min_age/12,t.to=(t.min_age+t.type)/12,this.questionHeader=t,console.log(t)})}},mounted(){this.getQuestionHeader()}},$={class:"v-container"},_={class:"v-row"},S={class:"v-col-6"},B={class:"v-col-6"};function C(e,t,w,N,T,o){return r(),c("div",null,[l(m,{height:"45",class:"mb-5 text-white",color:"#135C65",onClick:o.goBack},{default:s(()=>[l(f,{start:"",icon:"mdi-arrow-left"}),d(" "+n(e.$t("back")),1)]),_:1},8,["onClick"]),l(q,{"max-width":"1200",class:"mx-auto"},{default:s(()=>[e.alert_text!=null?(r(),h(V,{key:0,type:e.alert_type,variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close"),text:e.alert_text,class:"mb-8"},null,8,["type","close-label","text"])):b("",!0),l(k,{"fast-fail":"",onSubmit:t[3]||(t[3]=g(()=>{},["prevent"])),class:"py-4"},{default:s(()=>[l(y,{modelValue:e.questionHeader.title,"onUpdate:modelValue":t[0]||(t[0]=a=>e.questionHeader.title=a),label:"Title",rules:e.NameRules},null,8,["modelValue","rules"]),i("div",null,[i("div",$,[i("div",_,[i("div",S,[l(v,{label:e.$t("from"),modelValue:e.questionHeader.from,"onUpdate:modelValue":t[1]||(t[1]=a=>e.questionHeader.from=a),items:e.fromSelect},null,8,["label","modelValue","items"])]),i("div",B,[l(v,{label:e.$t("to"),modelValue:e.questionHeader.to,"onUpdate:modelValue":t[2]||(t[2]=a=>e.questionHeader.to=a),items:e.toSelect},null,8,["label","modelValue","items"])])])])]),l(m,{type:"submit",onClick:o.submit,block:"",class:"mt-2"},{default:s(()=>[d(n(e.$t("submit")),1)]),_:1},8,["onClick"])]),_:1})]),_:1})])}const F=p(H,[["render",C]]);export{F as default};
