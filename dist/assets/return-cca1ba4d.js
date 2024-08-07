import{_ as E,c as x,D as Q,r as y,o,d as r,f as d,w as L,e,t as l,g as a,F as _,z as g,X as M,x as R,Q as X,R as Y}from"./main-4fb7f812.js";import{S as q}from"./Stimulu-e3856a42.js";const z={components:{Stimulu:q},data(){return{error:{},count:0,evalate_type:"",pair:{result:[],values:[]},namesToCheck:[],result:{},childs:[],charset:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",stimulus:[],stimul:" ",stimulus_id:"",items:[],arr:[],pairs:[]}},methods:{getdatafilter(t){this.namesToCheck.push(t),this.missingNames()},missingNames(){this.stimulus=this.stimulus.filter(t=>!this.namesToCheck.includes(t.id))},deletearray(){this.items.length>0&&(this.items.length--,this.arr.length--,this.count--,this.generatePairs(),this.getchilde())},addarray(){if(this.stimul!==" "){this.items.push({name:`${this.charset[this.count]}`,value:`${this.stimul}`}),this.arr.push(this.charset[this.count]),this.generatePairs(),this.count++,this.stimul=" ";const t=this.items.map(i=>i.value);this.stimulus=this.stimulus.filter(i=>!t.includes(i.name))}},goevalute(){this.evalate_type==1&&this.$router.push({name:"ShowSideProfiles",params:{id:this.stimulus_id}}),this.evalate_type==2&&this.$router.push({name:"milestone-evaluation",params:{id:this.stimulus_id}}),this.evalate_type==3&&this.$router.push({name:"barrier-evaluation",params:{id:this.stimulus_id}}),this.evalate_type==4&&this.$router.push({name:"mission-test",params:{id:this.stimulus_id}}),this.evalate_type==5&&this.$router.push({name:"carolina-test",params:{id:this.stimulus_id}})},getanswer(t,i){console.log(i),this.pair.result[t]=i,console.log(this.items)},getchilde(){x.get("api/child").then(t=>{this.childs=t.data.children,this.pair.child_id=parseInt(localStorage.getItem("child_id"))}),x.get("api/stimulus").then(t=>{this.stimulus=t.data.data;const i=this.items.map(u=>u.value);this.stimulus=this.stimulus.filter(u=>!i.includes(u.name))})},createevalation(){this.pair.date=Q(this.pair.date).format("Y-MM-DD"),this.pair.specialist_id=localStorage.getItem("user_id"),this.pair.type=1,this.pair.values=this.items,x.post("api/stimulus-test",this.pair).then(t=>{console.log(t.data.data),this.result=t.data.data,this.stimulus_id=t.data.data.id}).catch(t=>{this.error=t.response.data.errors})},generatePairs(){const t=i=>{let u=[];for(let c=0;c<i.length;c++)for(let s=c+1;s<i.length;s++)u.push([i[c],i[s]]);return u};this.pairs=t(this.arr)}},mounted(){this.getchilde(),this.evalate_type=localStorage.getItem("evalate_type")}},A=t=>(X("data-v-147562e0"),t=t(),Y(),t),G={class:"m-auto bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-4 lg:grid-cols-2"},H={class:"flex flex-column gap-2"},J={for:"username"},K={key:0,class:"mt-1 mb-5 text-red-500"},O={class:"m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-3"},W={class:"bg-white p-2 flex justify-between rounded-sm"},Z={class:"flex"},$={class:"my-auto font-bold"},ee={class:"font-bold text-sm my-auto text-green-600",style:{"word-wrap":"unset"}},te={class:"flex"},se={class:"my-auto font-bold"},le={class:"font-bold my-auto text-green-600"},ie={class:"m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-2"},oe={class:"shadow-md bg-[#FFFFFF] rounded-sm p-2 min-h-[250px]"},re={class:"flex justify-between py-2"},ae={class:"flex"},ne={class:"font-bold px-1"},de={key:0,class:"font-bold text-[green]"},ue={class:"flex"},ce={class:"text-xl"},he={key:0,class:"m-auto text-xl text-[green] font-bold"},pe={class:"flex justify-between py-2"},_e={class:"flex"},me={class:"font-bold px-1"},ge={key:0,class:"font-bold text-[green]"},fe={class:"flex"},xe={class:"text-xl"},ye={key:0,class:"m-auto text-xl text-[green] font-bold"},ve={class:"flex justify-between py-2"},be={class:"flex"},we={class:"font-bold px-1"},ke={key:0,class:"font-bold text-[green]"},Ce={class:"flex"},Se={class:"text-xl"},Fe={key:0,class:"m-auto text-xl text-[green] font-bold"},Ve={class:"w-full h-full rounded-md shadow-md text-sm text-left m-auto rtl:text-right text-gray-500 dark:text-gray-400"},Ie={class:"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"},Be={scope:"col",class:"px-6 py-3"},De={scope:"col",class:"px-6 py-3"},Ne={class:"bg-white border-b dark:bg-gray-800 dark:border-gray-700"},Te={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},je={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},Pe={class:"w-full text-center"},Le={class:"w-full text-center"},Me={class:"flex"},Ue=["onChange","name","value"],Ee=A(()=>e("span",null,null,-1)),Qe={key:0,class:"mt-1 mb-5 w-full text-center text-red-500"};function Re(t,i,u,c,s,h){const U=y("Stimulu"),v=y("Dropdown"),m=y("Button");return o(),r(_,null,[d(U),d(M,{class:"p-[2%]"},{default:L(()=>{var b,w,k,C,S,F,V,I,B,D,N,T,j,P;return[e("div",G,[e("div",H,[e("label",J,l(t.$t("child_name")),1),d(v,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:s.pair.child_id,"onUpdate:modelValue":i[0]||(i[0]=n=>s.pair.child_id=n),disabled:"","option-value":"id",options:s.childs,optionLabel:"name",placeholder:t.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(b=s.error)!=null&&b.child_id?(o(),r("div",K,l(s.error.child_id[0]),1)):a("",!0)])]),e("div",O,[e("div",null,[d(m,{onClick:h.addarray,class:"create m-auto",icon:"pi pi-plus"},null,8,["onClick"]),d(m,{disabled:s.count<=0,onClick:h.deletearray,class:"delete m-auto",icon:"pi pi-minus"},null,8,["disabled","onClick"]),d(v,{modelValue:s.stimul,"onUpdate:modelValue":i[1]||(i[1]=n=>s.stimul=n),class:"hover:ring-0 w-52 mx-2",filter:"","option-value":"name",options:s.stimulus,optionLabel:"name",placeholder:"select item"},null,8,["modelValue","options"])]),(o(!0),r(_,null,g(s.items,(n,p)=>(o(),r("div",W,[e("div",Z,[e("h3",$,l(t.$t("name"))+" :",1),e("p",ee,l(n.value),1)]),e("div",te,[e("h3",se,l(t.$t("ترتيب المعزز"))+" :",1),e("p",le,l(n.name),1)])]))),256))]),e("div",ie,[e("div",oe,[e("div",re,[e("div",ae,[e("h2",ne,l(t.$t("highest_preferred"))+" :",1),(w=s.result)!=null&&w.highest_preferred?(o(),r("span",de,l((k=s.result)==null?void 0:k.highest_preferred[0].letter),1)):a("",!0)]),e("div",ue,[e("h4",ce,l(t.$t("percentage"))+" :",1),(C=s.result)!=null&&C.highest_preferred?(o(),r("span",he,l((S=s.result)==null?void 0:S.highest_preferred[0].percentage),1)):a("",!0)])]),e("div",pe,[e("div",_e,[e("h2",me,l(t.$t("moderately_preferred"))+" :",1),(F=s.result)!=null&&F.moderately_preferred?(o(),r("span",ge,l((V=s.result)==null?void 0:V.moderately_preferred[0].letter),1)):a("",!0)]),e("div",fe,[e("h4",xe,l(t.$t("percentage"))+" :",1),(I=s.result)!=null&&I.moderately_preferred?(o(),r("span",ye,l((B=s.result)==null?void 0:B.moderately_preferred[0].percentage),1)):a("",!0)])]),e("div",ve,[e("div",be,[e("h2",we,l(t.$t("latest_preferred"))+" :",1),(D=s.result)!=null&&D.lowest_preferred?(o(),r("span",ke,l((N=s.result)==null?void 0:N.lowest_preferred[0].letter),1)):a("",!0)]),e("div",Ce,[e("h4",Se,l(t.$t("percentage"))+" :",1),(T=s.result)!=null&&T.lowest_preferred?(o(),r("span",Fe,l((j=s.result)==null?void 0:j.lowest_preferred[0].percentage),1)):a("",!0)])]),d(m,{onClick:h.createevalation,class:"mt-4 m-auto create w-full",label:t.$t("submit")},null,8,["onClick","label"])]),e("div",null,[e("table",Ve,[e("thead",Ie,[e("tr",null,[e("th",Be,l(t.$t("index")),1),e("th",De,l(t.$t("Selected_item")),1)])]),e("tbody",null,[e("tr",Ne,[e("th",Te,[(o(!0),r(_,null,g(s.arr,(n,p)=>(o(),r("div",null,l(p+1),1))),256))]),e("th",je,[e("div",Pe,[(o(!0),r(_,null,g(s.arr.length,(n,p)=>(o(),r("span",Le,[e("div",Me,[(o(!0),r(_,null,g(s.arr,(f,Xe)=>(o(),r("span",null,[e("span",null,l(f),1),e("input",{onChange:Ye=>h.getanswer(p,f),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:p,value:f[1]},null,40,Ue)]))),256)),Ee])]))),256))])])]),(P=s.error)!=null&&P.result?(o(),r("div",Qe,l(s.error.result[0]),1)):a("",!0)])])]),d(M,{class:"w-full text-center col-span-2"},{default:L(()=>[s.stimulus_id?(o(),R(m,{key:0,icon:"pi pi-arrow-right",onClick:h.goevalute,class:"m-4 m-auto create w-44",label:t.$t("مرحله التقييم")},null,8,["onClick","label"])):a("",!0)]),_:1})])]}),_:1})],64)}const Ae=E(z,[["render",Re],["__scopeId","data-v-147562e0"]]);export{Ae as default};