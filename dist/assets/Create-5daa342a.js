import{_ as V,o as i,d as u,f as s,w as o,e as h,t as r,F as d,B as _,x as m,$ as b,a0 as p,c as f,r as y,K as $,h as q,V as g,g as N,E as x,a4 as B}from"./main-4124a381.js";import{V as I,a as Q,b as w,c as E}from"./VExpansionPanel-85f8af6c.js";import{V as F}from"./VForm-486ee07d.js";import{V as P}from"./VCheckbox-1789753b.js";import{V as T}from"./VSheet-ecbbfd8c.js";const R={name:"question",props:["header"],emits:["question-inputs"],data:()=>({NameRules:[e=>e?!0:" Field is required."],headers:[],questionsNumbers:[1,2],questionCounter:2,questionInputs:[],color:"success",icon:"mdi-plus"}),methods:{addQuestion(){this.questionCounter<3?(this.questionsNumbers.push(++this.questionCounter),this.color="red",this.icon="mdi-minus"):(--this.questionCounter,this.questionsNumbers.splice(-1),this.questionInputs.splice(-1,1),this.color="success",this.icon="mdi-plus")},returnparent(){this.$emit("question-inputs",this.header.id,this.questionInputs)}},mounted(){}},U={class:"pa-4 header-question"},A={class:"d-flex justify-end"};function K(e,t,l,v,C,n){return i(),u(d,null,[s(I,{"expand-icon":"mdi-plus","collapse-icon":"mdi-minus"},{default:o(()=>[h("div",U,r(l.header.title),1)]),_:1}),s(Q,null,{default:o(()=>[(i(!0),u(d,null,_(e.questionsNumbers,(c,a)=>(i(),m(b,{rules:e.NameRules,label:e.$t("question"),modelValue:e.questionInputs[a],"onUpdate:modelValue":k=>e.questionInputs[a]=k,onKeyup:n.returnparent,"aria-required":"true"},null,8,["rules","label","modelValue","onUpdate:modelValue","onKeyup"]))),256)),h("div",A,[s(p,{class:"btn-question",icon:e.icon,color:e.color,onClick:n.addQuestion},null,8,["icon","color","onClick"])])]),_:1})],64)}const S=V(R,[["render",K],["__scopeId","data-v-b223202d"]]),H={data:()=>({NameRules:[e=>e?!0:"This field is required"],isFormValid:!1,evaluation:{title:"",side_profile_id:"",six_month:!0,questions:[]},alert_text:null,type:"success",snackbar:!0,selected:[],headers:[],questions:[],sideProfile:[]}),components:{questionComponent:S},methods:{goBack(){this.$router.go(-1)},async submit(){const{valid:e}=await this.$refs.form.validate();e&&(this.evaluation.questions=[],this.questions.forEach((t,l)=>{this.evaluation.questions.push({headerId:l,questions:t})}),this.evaluation.side_profile_id=this.$route.params.sideProfile_id,f.post("/api/evaluations/create",this.evaluation).then(t=>{t.data.status==200&&(this.evaluation={},this.evaluation.six_month=!0,this.alert_text="evaluation added successfully ",this.type="success")}).catch(t=>{this.alert_text=t.response.data.message,this.type="error"}))},getQuestionHeaders(){f.get("/api/evaluationheaders").then(e=>{this.headers=e.data.headers,console.log(this.headers)})},addQuestion(e,t){this.questions[e]=t,console.log(this.questions)}},mounted(){this.getQuestionHeaders()}};function j(e,t,l,v,C,n){const c=y("questionComponent");return i(),u("div",null,[s(p,{height:"45",class:"mb-5 text-white",color:"#A9AB7F",onClick:n.goBack},{default:o(()=>[s($,{start:"",icon:"mdi-arrow-left"}),q(" "+r(e.$t("back")),1)]),_:1},8,["onClick"]),s(T,{"max-width":"1200",class:"mx-auto"},{default:o(()=>[e.alert_text!=null?(i(),m(g,{key:0,type:e.type,variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close"),text:e.alert_text,class:"mb-8"},null,8,["type","close-label","text"])):N("",!0),s(F,{"fast-fail":"",onSubmit:t[2]||(t[2]=x(()=>{},["prevent"])),ref:"form"},{default:o(()=>[s(b,{modelValue:e.evaluation.title,"onUpdate:modelValue":t[0]||(t[0]=a=>e.evaluation.title=a),label:e.$t("evaluation_title"),rules:e.NameRules},null,8,["modelValue","label","rules"]),s(P,{modelValue:e.evaluation.six_month,"onUpdate:modelValue":t[1]||(t[1]=a=>e.evaluation.six_month=a),label:e.$t("evaluation_exception")},null,8,["modelValue","label"]),s(B,{fluid:""},{default:o(()=>[s(w,null,{default:o(()=>[(i(!0),u(d,null,_(e.headers,a=>(i(),m(E,{key:a.id},{default:o(()=>[s(c,{header:a,onQuestionInputs:n.addQuestion},null,8,["header","onQuestionInputs"])]),_:2},1024))),128))]),_:1})]),_:1}),s(p,{type:"submit",onClick:n.submit,block:"",class:"mt-2"},{default:o(()=>[q(r(e.$t("submit")),1)]),_:1},8,["onClick"])]),_:1},512)]),_:1})])}const J=V(H,[["render",j]]);export{J as default};
