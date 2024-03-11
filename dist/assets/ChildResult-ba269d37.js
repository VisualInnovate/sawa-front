import{_ as S,z as f,E as c,a7 as I,j as M,l as b,o as h,e as y,t as s,q as m,h as r,x as i,y as d,I as v,i as g,Z as P,f as C,V as N,a9 as k,a3 as R,ac as U,Y as A,ag as Y,n as D,W as E,P as W,Q as X}from"./main-d9195fcd.js";import{C as x}from"./auto-1f697c56.js";import{s as F}from"./calendar.esm-c01d8aca.js";import{V as B}from"./VForm-ae144aa8.js";const $={data(){return{search:"",headers:[],result:[],alert_text:null,ctx:null,created_at:[],latePercenteges:[],growAge:[],diffAge:[],date1:"",from:"",to:"",date2:"",myCahrt:"",selectX:null,selectY:null,visible:!1,examDate:"",NameRules:[t=>t?!0:"This field is required"],examId:"",loading:!0,side_profileName:""}},methods:{getResults(){f.post(`/api/evaluations/${this.$route.params.child_id}/${this.$route.params.sideProfile_id}/${this.$route.params.evaluation_id}/result`,{date1:this.from,date2:this.to}).then(t=>{this.result=t.data.resultEvaluation,this.loading=!1,console.log(this.result),this.created_at=[],this.latePercenteges=[],this.growAge=[],this.diffAge=[],this.result.forEach(e=>{this.created_at.push(c(e.result_created_at).format("MM-DD-YYYY")),this.latePercenteges.push(e.late_percentage),this.growAge.push(e.grow_age),this.diffAge.push(e.diff_age)}),console.log(this.latePercenteges),this.ctx=document.getElementById("myChart").getContext("2d"),this.myCahrt=new x(this.ctx,{type:"bar",data:{datasets:[{label:"late percentages ",data:this.latePercenteges,borderWidth:1,backgroundColor:"#A9AB7F",barPercentage:.5,categoryPercentage:.2},{label:"Different_ages",data:this.diffAge,borderWidth:1,backgroundColor:"#4c9499",barPercentage:.5,categoryPercentage:.2},{label:"grow Age  ",data:this.growAge,borderWidth:1,backgroundColor:"#135C65",barPercentage:.5,categoryPercentage:.2}]},options:{align:"start",scales:{y:{beginAtZero:!0},x:{grid:{drawOnChartArea:!1},type:"category",labels:this.created_at}},grid:{top:"6",right:"0",bottom:"17",left:"25"},animation:{duration:2e3}}}),console.log(this.latePercenteges)})},formateDate(t){return c(t).format("DD-MM-YYYY HH:mm")},print(){console.log(this.from,this.to),this.from!=""&&this.to!=""?(console.log("find"),this.$router.push({name:"printChildResult",params:{child_id:this.$route.params.child_id,sideProfile_id:this.$route.params.sideProfile_id,evaluation_id:this.$route.params.evaluation_id,start:this.from,end:this.to}})):this.$router.push({name:"printChildResultfilter",params:{child_id:this.$route.params.child_id,sideProfile_id:this.$route.params.sideProfile_id,evaluation_id:this.$route.params.evaluation_id}})},serch(){},getSideprofile(){f.get(`api/side-profiles/${this.$route.params.sideProfile_id}`).then(t=>{this.side_profileName=t.data.sideProfile.title,console.log(t.data.sideProfile)})},filter(){this.from=c(this.from).format("YYYY-MM-DD"),this.to=c(this.to).format("YYYY-MM-DD"),f.post(`/api/filter/resultr/${this.$route.params.child_id}/${this.$route.params.sideProfile_id}/${this.$route.params.evaluation_id}`,{startdate:this.from,enddate:this.to}).then(t=>{this.result=t.data.evaluation_results,console.log(this.result),this.created_at=[],this.latePercenteges=[],this.growAge=[],this.diffAge=[],this.result.forEach(e=>{this.created_at.push(c(e.result_created_at).format("DD-MM-YYYY")),this.latePercenteges.push(e.late_percentage),this.growAge.push(e.grow_age),this.diffAge.push(e.diff_age)}),console.log(this.latePercenteges),this.ctx=document.getElementById("myChart"),this.myCahrt.destroy(),this.myCahrt=new x(this.ctx,{type:"bar",data:{datasets:[{label:"late percentages ",data:this.latePercenteges,borderWidth:1,backgroundColor:"#A9AB7F",barPercentage:.5,categoryPercentage:.2},{label:"Different ages ",data:this.diffAge,borderWidth:1,backgroundColor:"#4c9499",barPercentage:.5,categoryPercentage:.2},{label:"grow Age  ",data:this.growAge,borderWidth:1,backgroundColor:"#135C65",barPercentage:.5,categoryPercentage:.2}]},options:{align:"start",scales:{y:{beginAtZero:!0},x:{grid:{drawOnChartArea:!1},type:"category",labels:this.created_at}},grid:{top:"6",right:"0",bottom:"17",left:"25"},animation:{duration:2e3}}}),console.log(this.latePercenteges)})},editChart(){let t=[{title:this.$t("grow_age"),value:this.growAge},{title:this.$t("diff_age"),value:this.diffAge},{title:this.$t("late_percentage"),value:this.latePercenteges}];this.myCahrt.destroy(),this.myCahrt=new x(this.ctx,{type:"bar",data:{datasets:[{label:t[this.selectY].title,data:t[this.selectY].value,borderWidth:1,backgroundColor:"#135C65",barPercentage:.5,categoryPercentage:.2}]},options:{align:"start",scales:{y:{beginAtZero:!0},x:{grid:{drawOnChartArea:!1},type:"category",labels:t[this.selectX].value}},grid:{top:"6",right:"0",bottom:"17",left:"25"},animation:{duration:2e3}}})},editItem(t,e){this.visible=!0,this.examDate=t,this.examId=e},async submit(t){console.log(t);const{valid:e}=await this.$refs.form.validate();e&&f.post(`/api/evaluations/${this.examId}`,{date:this.examDate}).then(u=>{this.alert_text="evaluation edited successfully  ",this.visible=!1,this.type="success",this.getResults()}).catch(u=>{this.alert_text=u.response.data.message,this.type="error",this.visible=!1})},goBack(){this.$router.go(-1)}},components:{Dialog:I,Button:M,Calendar:F},mounted(){this.getResults(),this.getSideprofile()},computed:{locale(){return this.$i18n.locale},header(){return this.headers=[{title:"id"},{key:"therapist_name",title:this.$t("therapist_name")},{key:"child_age",title:this.$t("child_age")},{key:"grow_age",title:this.$t("grow_age")},{key:"diff_age",title:this.$t("diff_age")},{key:"basal_age",title:this.$t("basal_age")},{key:"late_percentage",title:this.$t("late_percentage")},{key:"result_created_at",title:this.$t("created_at")},{title:this.$t("operation")}]},firstSelectBoxComputed(){return[{title:this.$t("grow_age"),value:0},{title:this.$t("diff_age"),value:1},{title:this.$t("late_percentage"),value:2}].filter(u=>u.value!=this.selectY)},secondSelectBoxComputed(){return[{title:this.$t("grow_age",this.locale),value:0},{title:this.$t("diff_age"),value:1},{title:this.$t("late_percentage"),value:2}].filter(u=>u.value!=this.selectX)}},watch:{selectX(t){this.selectX!=null&&this.selectY!=null&&this.editChart()},selectY(t){this.selectX!=null&&this.selectY!=null&&this.editChart()}}},T=t=>(W("data-v-a055c758"),t=t(),X(),t),Z={key:0,class:"my-5"},O={key:1,class:"my-5"},j={class:"v-row mb-5 mt-5"},q=T(()=>r("canvas",{id:"myChart",style:{"max-height":"400px"}},null,-1)),H={class:"text-center"},z={class:"card flex justify-content-center"},L={class:"text-center"};function Q(t,e,u,G,l,o){const p=b("Calendar"),w=b("Dialog"),V=b("v-data-table");return h(),y("div",null,[l.result[0]&&l.side_profileName&&o.locale=="en"?(h(),y("div",Z,s(l.result[0].child_name)+"/"+s(l.side_profileName)+"/"+s(l.result[0].evaluation_title),1)):m("",!0),l.result[0]&&l.side_profileName&&o.locale=="ar"?(h(),y("div",O,s(l.result[0].evaluation_title)+" \\"+s(l.side_profileName)+"\\"+s(l.result[0].child_name),1)):m("",!0),r("div",null,[i(P,{height:"45",class:"mb-5 text-white",color:"#135C65",onClick:o.goBack},{default:d(()=>[i(v,{start:"",icon:"mdi-arrow-left"}),g(" "+s(t.$t("back")),1)]),_:1},8,["onClick"]),l.alert_text!=null?(h(),C(N,{key:0,type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":t.$t("close"),text:l.alert_text,class:"mb-8"},null,8,["close-label","text"])):m("",!0),r("div",j,[i(k,{class:"mx-9",label:t.$t("xAxis"),modelValue:l.selectX,"onUpdate:modelValue":e[0]||(e[0]=a=>l.selectX=a),items:o.firstSelectBoxComputed},null,8,["label","modelValue","items"]),i(k,{class:"mx-9",label:t.$t("yAxis"),modelValue:l.selectY,"onUpdate:modelValue":e[1]||(e[1]=a=>l.selectY=a),items:o.secondSelectBoxComputed},null,8,["label","modelValue","items"])]),q,i(E,null,{default:d(()=>[i(R,null,{default:d(()=>[g(" Results "),i(U),i(A,{modelValue:l.search,"onUpdate:modelValue":e[2]||(e[2]=a=>l.search=a),"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},null,8,["modelValue"])]),_:1}),i(P,{style:{color:"rgb(255, 255, 255)"},text:"print",color:"#ACAE84",height:"45",class:"mb-5 mt-5",onClick:o.print},{default:d(()=>[g(s(t.$t("print")),1)]),_:1},8,["onClick"]),i(p,{style:{padding:"0px 8px 0px 8px"},modelValue:l.to,"onUpdate:modelValue":[e[3]||(e[3]=a=>l.to=a),o.filter],placeholder:t.$t("from"),dateFormat:"dd/mm/yy"},null,8,["modelValue","onUpdate:modelValue","placeholder"]),i(p,{style:{padding:"0px 8px 0px 8px"},modelValue:l.from,"onUpdate:modelValue":[e[4]||(e[4]=a=>l.from=a),o.filter],placeholder:t.$t("to"),dateFormat:"dd/mm/yy"},null,8,["modelValue","onUpdate:modelValue","placeholder"]),i(V,{headers:o.header,items:l.result,search:l.search},{top:d(()=>[l.loading?(h(),C(Y,{key:0,slot:"progress",style:{color:"#135c65"},indeterminate:""})):m("",!0)]),item:d(({item:a,index:_})=>[r("tr",null,[r("td",null,s(_+1),1),r("td",null,s(a.columns.therapist_name),1),r("td",null,s(a.columns.child_age)+" months",1),r("td",null,s(a.columns.grow_age),1),r("td",null,s(a.columns.diff_age),1),r("td",null,s(a.columns.basal_age)+" months",1),r("td",null,s(Math.round(a.columns.late_percentage))+" %",1),r("td",null,s(o.formateDate(a.columns.result_created_at)),1),r("td",H,[i(v,{small:"",color:"primary",class:"mr-2",onClick:n=>o.editItem(a.raw.result_created_at,a.raw.id)},{default:d(()=>[g(" mdi-pencil ")]),_:2},1032,["onClick"]),i(w,{visible:l.visible,"onUpdate:visible":e[8]||(e[8]=n=>l.visible=n),modal:"",header:" ",style:{width:"50vw"}},{default:d(()=>[i(B,{"fast-fail":"",onSubmit:e[7]||(e[7]=D(()=>{},["prevent"])),ref:"form"},{default:d(()=>[r("div",z,[i(p,{style:{width:"100%",margin:"10px"},modelValue:l.examDate,"onUpdate:modelValue":e[5]||(e[5]=n=>l.examDate=n),rules:l.NameRules,placeholder:"dd/mm/yy",dateFormat:"dd/mm/yy"},null,8,["modelValue","rules"])]),r("button",{class:"bg-blue pa-3 rounded",onClick:e[6]||(e[6]=(...n)=>o.submit&&o.submit(...n))},s(t.$t("submit")),1)]),_:1},512)]),_:1},8,["visible"])])])]),_:1},8,["headers","items","search"])]),_:1}),i(V,{class:"hidden-table",headers:o.header,items:l.result,search:l.search,id:"print","hide-default-footer":"","disable-pagination":""},{top:d(()=>[l.loading?(h(),C(Y,{key:0,slot:"progress",style:{color:"#135c65"},indeterminate:""})):m("",!0)]),item:d(({item:a,index:_})=>[r("tr",null,[r("td",null,s(_+1),1),r("td",null,s(a.columns.therapist_name),1),r("td",null,s(a.columns.grow_age),1),r("td",null,s(a.columns.diff_age),1),r("td",null,s(Math.round(a.columns.late_percentage))+" %",1),r("td",null,s(a.columns.basal_age)+" months",1),r("td",null,s(a.columns.child_age)+" months",1),r("td",null,s(o.formateDate(a.columns.result_created_at)),1),r("td",L,[i(v,{small:"",color:"primary",class:"mr-2",onClick:n=>o.editItem(a.raw.result_created_at,a.raw.id)},{default:d(()=>[g(" mdi-pencil ")]),_:2},1032,["onClick"]),i(w,{visible:l.visible,modal:"",header:" ",style:{width:"50vw"}},{default:d(()=>[i(B,{"fast-fail":"",onSubmit:e[11]||(e[11]=D(()=>{},["prevent"])),ref:"form"},{default:d(()=>[i(A,{modelValue:l.examDate,"onUpdate:modelValue":e[9]||(e[9]=n=>l.examDate=n),rules:l.NameRules,label:t.$t("examDate"),type:"datetime-local"},null,8,["modelValue","rules","label"]),r("button",{class:"bg-blue pa-3 rounded",onClick:e[10]||(e[10]=(...n)=>o.submit&&o.submit(...n))},s(t.$t("submit")),1)]),_:1},512)]),_:1},8,["visible"])])])]),bottom:d(()=>[]),_:1},8,["headers","items","search"])])])}const le=S($,[["render",Q],["__scopeId","data-v-a055c758"]]);export{le as default};
