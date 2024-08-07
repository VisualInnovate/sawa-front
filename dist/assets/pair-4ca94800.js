import{_ as M,c as g,D as U,r as f,o,d as r,f as u,w as E,e,t as i,g as d,F as m,z as v,X as Q,Q as R,R as X}from"./main-4fb7f812.js";import{S as Y}from"./Stimulu-e3856a42.js";const q={components:{Stimulu:Y},data(){return{error:{},count:0,pair:{result:[],values:[]},stimul:" ",evalate_type:"",namesToCheck:[],result:{},childs:[],charset:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",stimulus:[],items:[],arr:[],pairs:[]}},methods:{getdatafilter(t){this.namesToCheck.push(t),this.missingNames()},goevalute(){this.evalate_type==1&&this.$router.push({name:"ShowSideProfiles",params:{id:this.stimulus_id}}),this.evalate_type==2&&this.$router.push({name:"milestone-evaluation",params:{id:this.stimulus_id}}),this.evalate_type==3&&this.$router.push({name:"barrier-evaluation",params:{id:this.stimulus_id}}),this.evalate_type==4&&this.$router.push({name:"mission-test",params:{id:this.stimulus_id}}),this.evalate_type==5&&this.$router.push({name:"carolina-test",params:{id:this.stimulus_id}})},missingNames(){this.stimulus=this.stimulus.filter(t=>!this.namesToCheck.includes(t.id))},deletearray(){this.items.length>0&&(this.items.length--,this.arr.length--,this.count--,this.generatePairs(),this.getchilde())},addarray(){if(this.stimul!==" "){this.items.push({name:`${this.charset[this.count]}`,value:`${this.stimul}`}),this.arr.push(this.charset[this.count]),this.generatePairs(),this.count++,this.stimul=" ";const t=this.items.map(l=>l.value);this.stimulus=this.stimulus.filter(l=>!t.includes(l.name))}},getanswer(t,l){this.pair.result[t]=l,console.log(this.items)},getchilde(){g.get("api/child").then(t=>{this.childs=t.data.children,this.pair.child_id=parseInt(localStorage.getItem("child_id"))}),g.get("api/stimulus").then(t=>{this.stimulus=t.data.data;const l=this.items.map(n=>n.value);this.stimulus=this.stimulus.filter(n=>!l.includes(n.name))})},createevalation(){this.pair.date=U(this.pair.date).format("Y-MM-DD"),this.pair.specialist_id=localStorage.getItem("user_id"),this.pair.type=0,this.pair.values=this.items,g.post("api/stimulus-test",this.pair).then(t=>{console.log(t.data.data),this.result=t.data.data,this.evalate_type==1&&this.$router.push({name:"ShowSideProfiles",params:{id:t.data.data.id}}),this.evalate_type==2&&this.$router.push({name:"milestone-evaluation",params:{id:t.data.data.id}}),this.evalate_type==3&&this.$router.push({name:"barrier-evaluation",params:{id:t.data.data.id}}),this.evalate_type==4&&this.$router.push({name:"mission-test",params:{id:t.data.data.id}}),this.evalate_type==5&&this.$router.push({name:"carolina-test",params:{id:t.data.data.id}})}).catch(t=>{this.error=t.response.data.errors})},generatePairs(){const t=l=>{let n=[];for(let c=0;c<l.length;c++)for(let s=c+1;s<l.length;s++)n.push([l[c],l[s]]);return n};this.pairs=t(this.arr)}},mounted(){this.generatePairs(),this.getchilde(),this.evalate_type=localStorage.getItem("evalate_type")}},z=t=>(R("data-v-8abd2d5c"),t=t(),X(),t),A={class:"m-auto bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-4 lg:grid-cols-2"},G={class:"flex flex-column gap-2"},H={for:"username"},J={key:0,class:"mt-1 mb-5 text-red-500"},K={class:"m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-3"},O={class:"bg-white p-2 flex justify-between rounded-sm"},W={class:"flex"},Z={class:"my-auto font-bold"},$={class:"font-bold text-sm my-auto text-green-600",style:{"word-wrap":"unset"}},ee={class:"flex"},te={class:"my-auto font-bold"},se={class:"font-bold my-auto text-green-600"},ie={class:"m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-2"},le={class:"shadow-md bg-[#FFFFFF] rounded-sm p-2 min-h-[250px]"},ae={class:"flex justify-between py-2"},oe={class:"flex"},re={class:"font-bold px-1"},de={key:0,class:"font-bold text-[green]"},ne={class:"flex"},he={class:"text-xl"},ue={key:0,class:"m-auto text-xl text-[green] font-bold"},ce={class:"flex justify-between py-2"},pe={class:"flex"},me={class:"font-bold px-1"},_e={key:0,class:"font-bold text-[green]"},ge={class:"flex"},fe={class:"text-xl"},ve={key:0,class:"m-auto text-xl text-[green] font-bold"},ye={class:"flex justify-between py-2"},xe={class:"flex"},be={class:"font-bold px-1"},we={key:0,class:"font-bold text-[green]"},ke={class:"flex"},Ce={class:"text-xl"},Se={key:0,class:"m-auto text-xl text-[green] font-bold"},Fe={class:"w-full h-full rounded-md shadow-md text-sm text-left m-auto rtl:text-right text-gray-500 dark:text-gray-400"},Ve={class:"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"},Ie={scope:"col",class:"px-6 py-3"},je={scope:"col",class:"px-6 py-3"},De={class:"bg-white border-b dark:bg-gray-800 dark:border-gray-700"},Pe={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},Be={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},Ne={class:"flex"},Te=["onChange","name","value"],Le=z(()=>e("span",null,null,-1)),Me={class:"px-[1%]"},Ue=["onChange","name","value"],Ee={key:0,class:"mt-1 mb-5 w-full text-center text-red-500"};function Qe(t,l,n,c,s,p){const T=f("Stimulu"),y=f("Dropdown"),_=f("Button");return o(),r(m,null,[u(T),u(Q,{class:"p-[2%]"},{default:E(()=>{var x,b,w,k,C,S,F,V,I,j,D,P,B,N;return[e("div",A,[e("div",G,[e("label",H,i(t.$t("child_name")),1),u(y,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.pair.child_id,"onUpdate:modelValue":l[0]||(l[0]=a=>s.pair.child_id=a),disabled:"","option-value":"id",options:s.childs,optionLabel:"name",placeholder:t.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(x=s.error)!=null&&x.child_id?(o(),r("div",J,i(s.error.child_id[0]),1)):d("",!0)])]),e("div",K,[e("div",null,[u(_,{onClick:p.addarray,class:"create m-auto",icon:"pi pi-plus"},null,8,["onClick"]),u(_,{disabled:s.count<=0,onClick:p.deletearray,class:"delete m-auto",icon:"pi pi-minus"},null,8,["disabled","onClick"]),u(y,{modelValue:s.stimul,"onUpdate:modelValue":l[1]||(l[1]=a=>s.stimul=a),class:"hover:ring-0 w-52 mx-2","option-value":"name",filter:"",options:s.stimulus,optionLabel:"name",placeholder:"select item"},null,8,["modelValue","options"])]),(o(!0),r(m,null,v(s.items,(a,h)=>(o(),r("div",O,[e("div",W,[e("h3",Z,i(t.$t("name"))+" :",1),e("p",$,i(a.value),1)]),e("div",ee,[e("h3",te,i(t.$t("ترتيب المعزز"))+" :",1),e("p",se,i(a.name),1)])]))),256))]),e("div",ie,[e("div",le,[e("div",ae,[e("div",oe,[e("h2",re,i(t.$t("highest_preferred"))+" :",1),(b=s.result)!=null&&b.highest_preferred?(o(),r("span",de,i((w=s.result)==null?void 0:w.highest_preferred[0].letter),1)):d("",!0)]),e("div",ne,[e("h4",he,i(t.$t("percentage"))+" :",1),(k=s.result)!=null&&k.highest_preferred?(o(),r("span",ue,i((C=s.result)==null?void 0:C.highest_preferred[0].percentage),1)):d("",!0)])]),e("div",ce,[e("div",pe,[e("h2",me,i(t.$t("moderately_preferred"))+" :",1),(S=s.result)!=null&&S.moderately_preferred?(o(),r("span",_e,i((F=s.result)==null?void 0:F.moderately_preferred[0].letter),1)):d("",!0)]),e("div",ge,[e("h4",fe,i(t.$t("percentage"))+" :",1),(V=s.result)!=null&&V.moderately_preferred?(o(),r("span",ve,i((I=s.result)==null?void 0:I.moderately_preferred[0].percentage),1)):d("",!0)])]),e("div",ye,[e("div",xe,[e("h2",be,i(t.$t("latest_preferred"))+" :",1),(j=s.result)!=null&&j.lowest_preferred?(o(),r("span",we,i((D=s.result)==null?void 0:D.lowest_preferred[0].letter),1)):d("",!0)]),e("div",ke,[e("h4",Ce,i(t.$t("percentage"))+" :",1),(P=s.result)!=null&&P.lowest_preferred?(o(),r("span",Se,i((B=s.result)==null?void 0:B.lowest_preferred[0].percentage),1)):d("",!0)])]),u(_,{onClick:p.createevalation,class:"mt-4 m-auto create w-full",label:t.$t("submit")},null,8,["onClick","label"])]),e("div",null,[e("table",Fe,[e("thead",Ve,[e("tr",null,[e("th",Ie,i(t.$t("index")),1),e("th",je,i(t.$t("Selected_item")),1)])]),e("tbody",null,[e("tr",De,[e("th",Pe,[(o(!0),r(m,null,v(s.pairs,(a,h)=>(o(),r("div",{key:a.join("-")},i(h+1),1))),128))]),e("th",Be,[(o(!0),r(m,null,v(s.pairs,(a,h)=>(o(),r("div",{class:"lg:rtl:pr-28",key:a.join("-")},[e("div",Ne,[e("div",null,[e("span",null,i(a[1]),1),e("input",{onChange:L=>p.getanswer(h,a[1]),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:h,value:a[1]},null,40,Te)]),Le,e("div",Me,[e("span",null,i(a[0]),1),e("input",{onChange:L=>p.getanswer(h,a[0]),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:h,value:a[0]},null,40,Ue)])])]))),128))])]),(N=s.error)!=null&&N.result?(o(),r("div",Ee,i(s.error.result[0]),1)):d("",!0)])])])])]}),_:1})],64)}const Ye=M(q,[["render",Qe],["__scopeId","data-v-8abd2d5c"]]);export{Ye as default};
