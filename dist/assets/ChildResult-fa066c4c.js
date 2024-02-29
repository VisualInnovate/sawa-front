import{_ as S,y as f,C as c,j as I,k as b,o as h,e as y,t as s,p as m,h as r,q as i,x as d,G as v,i as g,X as k,f as C,V as M,a6 as P,a1 as N,a9 as R,W as A,ad as Y,l as D,T as U,L as X,O as W}from"./main-9e20a77a.js";import{C as x}from"./auto-1f697c56.js";import{s as E}from"./dialog.esm-b0c27179.js";import{s as F}from"./calendar.esm-efc921b5.js";import{V as B}from"./VForm-072a86c4.js";import"./focustrap.esm-58f87258.js";import"./portal.esm-a48f8386.js";import"./index.esm-05e11139.js";import"./overlayeventbus.esm-9b9b20c2.js";const T={data(){return{search:"",headers:[],result:[],alert_text:null,ctx:null,created_at:[],latePercenteges:[],growAge:[],diffAge:[],date1:"",from:"",to:"",date2:"",myCahrt:"",selectX:null,selectY:null,visible:!1,examDate:"",NameRules:[l=>l?!0:"This field is required"],examId:"",loading:!0,side_profileName:""}},methods:{getResults(){f.post(`/api/evaluations/${this.$route.params.child_id}/${this.$route.params.sideProfile_id}/${this.$route.params.evaluation_id}/result`,{date1:this.from,date2:this.to}).then(l=>{this.result=l.data.resultEvaluation,this.loading=!1,console.log(this.result),this.created_at=[],this.latePercenteges=[],this.growAge=[],this.diffAge=[],this.result.forEach(e=>{this.created_at.push(c(e.result_created_at).format("MM-DD-YYYY")),this.latePercenteges.push(e.late_percentage),this.growAge.push(e.grow_age),this.diffAge.push(e.diff_age)}),console.log(this.latePercenteges),this.ctx=document.getElementById("myChart").getContext("2d"),this.myCahrt=new x(this.ctx,{type:"bar",data:{datasets:[{label:"late percentages ",data:this.latePercenteges,borderWidth:1,backgroundColor:"#A9AB7F",barPercentage:.5,categoryPercentage:.2},{label:"Different_ages",data:this.diffAge,borderWidth:1,backgroundColor:"#4c9499",barPercentage:.5,categoryPercentage:.2},{label:"grow Age  ",data:this.growAge,borderWidth:1,backgroundColor:"#135C65",barPercentage:.5,categoryPercentage:.2}]},options:{align:"start",scales:{y:{beginAtZero:!0},x:{grid:{drawOnChartArea:!1},type:"category",labels:this.created_at}},grid:{top:"6",right:"0",bottom:"17",left:"25"},animation:{duration:2e3}}}),console.log(this.latePercenteges)})},formateDate(l){return c(l).format("DD-MM-YYYY HH:mm")},print(){console.log(this.from,this.to),this.from!=""&&this.to!=""?(console.log("find"),this.$router.push({name:"printChildResult",params:{child_id:this.$route.params.child_id,sideProfile_id:this.$route.params.sideProfile_id,evaluation_id:this.$route.params.evaluation_id,start:this.from,end:this.to}})):this.$router.push({name:"printChildResultfilter",params:{child_id:this.$route.params.child_id,sideProfile_id:this.$route.params.sideProfile_id,evaluation_id:this.$route.params.evaluation_id}})},serch(){},getSideprofile(){f.get(`api/side-profiles/${this.$route.params.sideProfile_id}`).then(l=>{this.side_profileName=l.data.sideProfile.title,console.log(l.data.sideProfile)})},filter(){this.from=c(this.from).format("YYYY-MM-DD"),this.to=c(this.to).format("YYYY-MM-DD"),f.post(`/api/filter/resultr/${this.$route.params.child_id}/${this.$route.params.sideProfile_id}/${this.$route.params.evaluation_id}`,{startdate:this.from,enddate:this.to}).then(l=>{this.result=l.data.evaluation_results,console.log(this.result),this.created_at=[],this.latePercenteges=[],this.growAge=[],this.diffAge=[],this.result.forEach(e=>{this.created_at.push(c(e.result_created_at).format("DD-MM-YYYY")),this.latePercenteges.push(e.late_percentage),this.growAge.push(e.grow_age),this.diffAge.push(e.diff_age)}),console.log(this.latePercenteges),this.ctx=document.getElementById("myChart"),this.myCahrt.destroy(),this.myCahrt=new x(this.ctx,{type:"bar",data:{datasets:[{label:"late percentages ",data:this.latePercenteges,borderWidth:1,backgroundColor:"#A9AB7F",barPercentage:.5,categoryPercentage:.2},{label:"Different ages ",data:this.diffAge,borderWidth:1,backgroundColor:"#4c9499",barPercentage:.5,categoryPercentage:.2},{label:"grow Age  ",data:this.growAge,borderWidth:1,backgroundColor:"#135C65",barPercentage:.5,categoryPercentage:.2}]},options:{align:"start",scales:{y:{beginAtZero:!0},x:{grid:{drawOnChartArea:!1},type:"category",labels:this.created_at}},grid:{top:"6",right:"0",bottom:"17",left:"25"},animation:{duration:2e3}}}),console.log(this.latePercenteges)})},editChart(){let l=[{title:this.$t("grow_age"),value:this.growAge},{title:this.$t("diff_age"),value:this.diffAge},{title:this.$t("late_percentage"),value:this.latePercenteges}];this.myCahrt.destroy(),this.myCahrt=new x(this.ctx,{type:"bar",data:{datasets:[{label:l[this.selectY].title,data:l[this.selectY].value,borderWidth:1,backgroundColor:"#135C65",barPercentage:.5,categoryPercentage:.2}]},options:{align:"start",scales:{y:{beginAtZero:!0},x:{grid:{drawOnChartArea:!1},type:"category",labels:l[this.selectX].value}},grid:{top:"6",right:"0",bottom:"17",left:"25"},animation:{duration:2e3}}})},editItem(l,e){this.visible=!0,this.examDate=l,this.examId=e},async submit(l){console.log(l);const{valid:e}=await this.$refs.form.validate();e&&f.post(`/api/evaluations/${this.examId}`,{date:this.examDate}).then(u=>{this.alert_text="evaluation edited successfully  ",this.visible=!1,this.type="success",this.getResults()}).catch(u=>{this.alert_text=u.response.data.message,this.type="error",this.visible=!1})},goBack(){this.$router.go(-1)}},components:{Dialog:E,Button:I,Calendar:F},mounted(){this.getResults(),this.getSideprofile()},computed:{locale(){return this.$i18n.locale},header(){return this.headers=[{title:"id"},{key:"therapist_name",title:this.$t("therapist_name")},{key:"child_age",title:this.$t("child_age")},{key:"grow_age",title:this.$t("grow_age")},{key:"diff_age",title:this.$t("diff_age")},{key:"basal_age",title:this.$t("basal_age")},{key:"late_percentage",title:this.$t("late_percentage")},{key:"result_created_at",title:this.$t("created_at")},{title:this.$t("operation")}]},firstSelectBoxComputed(){return[{title:this.$t("grow_age"),value:0},{title:this.$t("diff_age"),value:1},{title:this.$t("late_percentage"),value:2}].filter(u=>u.value!=this.selectY)},secondSelectBoxComputed(){return[{title:this.$t("grow_age",this.locale),value:0},{title:this.$t("diff_age"),value:1},{title:this.$t("late_percentage"),value:2}].filter(u=>u.value!=this.selectX)}},watch:{selectX(l){this.selectX!=null&&this.selectY!=null&&this.editChart()},selectY(l){this.selectX!=null&&this.selectY!=null&&this.editChart()}}},O=l=>(X("data-v-6cf6b600"),l=l(),W(),l),$={key:0,class:"my-5"},Z={key:1,class:"my-5"},j={class:"v-row mb-5 mt-5"},q=O(()=>r("canvas",{id:"myChart",style:{"max-height":"400px"}},null,-1)),H={class:"text-center"},L={class:"card flex justify-content-center"},G={class:"text-center"};function z(l,e,u,J,t,o){const p=b("Calendar"),w=b("Dialog"),V=b("v-data-table");return h(),y("div",null,[t.result[0]&&t.side_profileName&&o.locale=="en"?(h(),y("div",$,s(t.result[0].child_name)+"/"+s(t.side_profileName)+"/"+s(t.result[0].evaluation_title),1)):m("",!0),t.result[0]&&t.side_profileName&&o.locale=="ar"?(h(),y("div",Z,s(t.result[0].evaluation_title)+" \\"+s(t.side_profileName)+"\\"+s(t.result[0].child_name),1)):m("",!0),r("div",null,[i(k,{height:"45",class:"mb-5 text-white",color:"#135C65",onClick:o.goBack},{default:d(()=>[i(v,{start:"",icon:"mdi-arrow-left"}),g(" "+s(l.$t("back")),1)]),_:1},8,["onClick"]),t.alert_text!=null?(h(),C(M,{key:0,type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close"),text:t.alert_text,class:"mb-8"},null,8,["close-label","text"])):m("",!0),r("div",j,[i(P,{class:"mx-9",label:l.$t("xAxis"),modelValue:t.selectX,"onUpdate:modelValue":e[0]||(e[0]=a=>t.selectX=a),items:o.firstSelectBoxComputed},null,8,["label","modelValue","items"]),i(P,{class:"mx-9",label:l.$t("yAxis"),modelValue:t.selectY,"onUpdate:modelValue":e[1]||(e[1]=a=>t.selectY=a),items:o.secondSelectBoxComputed},null,8,["label","modelValue","items"])]),q,i(U,null,{default:d(()=>[i(N,null,{default:d(()=>[g(" Results "),i(R),i(A,{modelValue:t.search,"onUpdate:modelValue":e[2]||(e[2]=a=>t.search=a),"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},null,8,["modelValue"])]),_:1}),i(k,{style:{color:"rgb(255, 255, 255)"},text:"print",color:"#ACAE84",height:"45",class:"mb-5 mt-5",onClick:o.print},{default:d(()=>[g(s(l.$t("print")),1)]),_:1},8,["onClick"]),i(p,{style:{padding:"0px 8px 0px 8px"},modelValue:t.from,"onUpdate:modelValue":[e[3]||(e[3]=a=>t.from=a),o.filter],placeholder:"to",dateFormat:"dd/mm/yy"},null,8,["modelValue","onUpdate:modelValue"]),i(p,{style:{padding:"0px 8px 0px 8px"},modelValue:t.to,"onUpdate:modelValue":[e[4]||(e[4]=a=>t.to=a),o.filter],placeholder:"from",dateFormat:"dd/mm/yy"},null,8,["modelValue","onUpdate:modelValue"]),i(V,{headers:o.header,items:t.result,search:t.search},{top:d(()=>[t.loading?(h(),C(Y,{key:0,slot:"progress",style:{color:"#135c65"},indeterminate:""})):m("",!0)]),item:d(({item:a,index:_})=>[r("tr",null,[r("td",null,s(_+1),1),r("td",null,s(a.columns.therapist_name),1),r("td",null,s(a.columns.child_age)+" months",1),r("td",null,s(a.columns.grow_age),1),r("td",null,s(a.columns.diff_age),1),r("td",null,s(a.columns.basal_age)+" months",1),r("td",null,s(Math.round(a.columns.late_percentage))+" %",1),r("td",null,s(o.formateDate(a.columns.result_created_at)),1),r("td",H,[i(v,{small:"",color:"primary",class:"mr-2",onClick:n=>o.editItem(a.raw.result_created_at,a.raw.id)},{default:d(()=>[g(" mdi-pencil ")]),_:2},1032,["onClick"]),i(w,{visible:t.visible,"onUpdate:visible":e[8]||(e[8]=n=>t.visible=n),modal:"",header:" ",style:{width:"50vw"}},{default:d(()=>[i(B,{"fast-fail":"",onSubmit:e[7]||(e[7]=D(()=>{},["prevent"])),ref:"form"},{default:d(()=>[r("div",L,[i(p,{style:{width:"100%",margin:"10px"},modelValue:t.examDate,"onUpdate:modelValue":e[5]||(e[5]=n=>t.examDate=n),rules:t.NameRules,placeholder:"dd/mm/yy",dateFormat:"dd/mm/yy"},null,8,["modelValue","rules"])]),r("button",{class:"bg-blue pa-3 rounded",onClick:e[6]||(e[6]=(...n)=>o.submit&&o.submit(...n))},s(l.$t("submit")),1)]),_:1},512)]),_:1},8,["visible"])])])]),_:1},8,["headers","items","search"])]),_:1}),i(V,{class:"hidden-table",headers:o.header,items:t.result,search:t.search,id:"print","hide-default-footer":"","disable-pagination":""},{top:d(()=>[t.loading?(h(),C(Y,{key:0,slot:"progress",style:{color:"#135c65"},indeterminate:""})):m("",!0)]),item:d(({item:a,index:_})=>[r("tr",null,[r("td",null,s(_+1),1),r("td",null,s(a.columns.therapist_name),1),r("td",null,s(a.columns.grow_age),1),r("td",null,s(a.columns.diff_age),1),r("td",null,s(Math.round(a.columns.late_percentage))+" %",1),r("td",null,s(a.columns.basal_age)+" months",1),r("td",null,s(a.columns.child_age)+" months",1),r("td",null,s(o.formateDate(a.columns.result_created_at)),1),r("td",G,[i(v,{small:"",color:"primary",class:"mr-2",onClick:n=>o.editItem(a.raw.result_created_at,a.raw.id)},{default:d(()=>[g(" mdi-pencil ")]),_:2},1032,["onClick"]),i(w,{visible:t.visible,modal:"",header:" ",style:{width:"50vw"}},{default:d(()=>[i(B,{"fast-fail":"",onSubmit:e[11]||(e[11]=D(()=>{},["prevent"])),ref:"form"},{default:d(()=>[i(A,{modelValue:t.examDate,"onUpdate:modelValue":e[9]||(e[9]=n=>t.examDate=n),rules:t.NameRules,label:l.$t("examDate"),type:"datetime-local"},null,8,["modelValue","rules","label"]),r("button",{class:"bg-blue pa-3 rounded",onClick:e[10]||(e[10]=(...n)=>o.submit&&o.submit(...n))},s(l.$t("submit")),1)]),_:1},512)]),_:1},8,["visible"])])])]),bottom:d(()=>[]),_:1},8,["headers","items","search"])])])}const oe=S(T,[["render",z],["__scopeId","data-v-6cf6b600"]]);export{oe as default};
