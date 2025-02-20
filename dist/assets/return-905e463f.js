import{_ as L,c as x,r as y,o as i,d as r,f as n,w as M,e,F as _,k as g,t as l,g as d,Y,p as E,l as U}from"./main-0eeefd6e.js";import{h as A}from"./moment-fbc5633a.js";import{S as G}from"./Stimulu-9a8b31be.js";const H={components:{Stimulu:G},data(){return{error:{},count:0,pair:{result:[],values:[]},namesToCheck:[],result:{},childs:[],charset:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",stimulus:[],stimul:" ",items:[],arr:[],pairs:[]}},methods:{getdatafilter(t){this.namesToCheck.push(t),this.missingNames()},missingNames(){this.stimulus=this.stimulus.filter(t=>!this.namesToCheck.includes(t.id))},deletearray(){this.items.length>0&&(this.items.length--,this.arr.length--,this.count--,this.generatePairs(),this.getchilde())},addarray(){if(this.stimul!==" "){this.items.push({name:`${this.charset[this.count]}`,value:`${this.stimul}`}),this.arr.push(this.charset[this.count]),this.generatePairs(),this.count++,this.stimul=" ";const t=this.items.map(o=>o.value);this.stimulus=this.stimulus.filter(o=>!t.includes(o.name))}},getanswer(t,o){console.log(o),this.pair.result[t]=o,console.log(this.items)},getchilde(){x.get("api/child").then(t=>{this.childs=t.data.children,this.pair.child_id=parseInt(localStorage.getItem("child_id"))}),x.get("api/stimulus").then(t=>{this.stimulus=t.data.data;const o=this.items.map(a=>a.value);this.stimulus=this.stimulus.filter(a=>!o.includes(a.name))})},gosession(){this.$router.push({name:"sessions-update",params:{id:this.$route.params.id}})},createevalation(){this.pair.date=A(this.pair.date).format("Y-MM-DD"),this.pair.session_id=this.$route.params.id,this.pair.type=1,this.pair.values=this.items,x.post("api/stimulus-test",this.pair).then(t=>{console.log(t.data.data),this.result=t.data.data,this.stimulus_id=t.data.data.id}).catch(t=>{this.error=t.response.data.errors})},generatePairs(){const t=o=>{let a=[];for(let u=0;u<o.length;u++)for(let s=u+1;s<o.length;s++)a.push([o[u],o[s]]);return a};this.pairs=t(this.arr)}},mounted(){this.getchilde()}},J=t=>(E("data-v-09c25cb8"),t=t(),U(),t),K={class:"m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-3"},O={class:"bg-white p-2 flex justify-between rounded-sm"},Q={class:"flex"},R={class:"my-auto font-bold"},W={class:"font-bold text-sm my-auto text-green-600",style:{"word-wrap":"unset"}},X={class:"flex"},Z={class:"my-auto font-bold"},q={class:"font-bold my-auto text-green-600"},z={class:"m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-2"},$={class:"shadow-md bg-[#FFFFFF] rounded-sm p-2 min-h-[250px]"},ee={class:"flex justify-between py-2"},te={class:"flex"},se={class:"font-bold px-1"},le={key:0,class:"font-bold text-[green]"},oe={class:"flex"},ie={class:"text-xl"},re={key:0,class:"m-auto text-xl text-[green] font-bold"},ae={class:"flex justify-between py-2"},ne={class:"flex"},de={class:"font-bold px-1"},ce={key:0,class:"font-bold text-[green]"},ue={class:"flex"},he={class:"text-xl"},pe={key:0,class:"m-auto text-xl text-[green] font-bold"},_e={class:"flex justify-between py-2"},me={class:"flex"},ge={class:"font-bold px-1"},fe={key:0,class:"font-bold text-[green]"},xe={class:"flex"},ye={class:"text-xl"},be={key:0,class:"m-auto text-xl text-[green] font-bold"},ve={class:"w-full h-full rounded-md shadow-md text-sm text-left m-auto rtl:text-right text-gray-500 dark:text-gray-400"},we={class:"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"},ke={scope:"col",class:"px-6 py-3"},Ce={scope:"col",class:"px-6 py-3"},Fe={class:"bg-white border-b dark:bg-gray-800 dark:border-gray-700"},Se={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},Ve={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},Ie={class:"w-full text-center"},Be={class:"w-full text-center"},De={class:"flex"},Ne=["onChange","name","value"],Te=J(()=>e("span",null,null,-1)),je={key:0,class:"mt-1 mb-5 w-full text-center text-red-500"};function Pe(t,o,a,u,s,h){const j=y("Stimulu"),m=y("Button"),P=y("Dropdown");return i(),r(_,null,[n(j),n(m,{icon:"pi pi-angle-left",onClick:h.gosession,class:"my-4 m-auto create",label:t.$t("العودة للجلسة")},null,8,["onClick","label"]),n(Y,{class:"p-[2%]"},{default:M(()=>{var b,v,w,k,C,F,S,V,I,B,D,N,T;return[e("div",K,[e("div",null,[n(m,{onClick:h.addarray,class:"create m-auto",icon:"pi pi-plus"},null,8,["onClick"]),n(m,{disabled:s.count<=0,onClick:h.deletearray,class:"delete m-auto",icon:"pi pi-minus"},null,8,["disabled","onClick"]),n(P,{modelValue:s.stimul,"onUpdate:modelValue":o[0]||(o[0]=c=>s.stimul=c),class:"hover:ring-0 w-52 mx-2",filter:"","option-value":"name",options:s.stimulus,optionLabel:"name",placeholder:"select item"},null,8,["modelValue","options"])]),(i(!0),r(_,null,g(s.items,(c,p)=>(i(),r("div",O,[e("div",Q,[e("h3",R,l(t.$t("name"))+" :",1),e("p",W,l(c.value),1)]),e("div",X,[e("h3",Z,l(t.$t("ترتيب المعزز"))+" :",1),e("p",q,l(c.name),1)])]))),256))]),e("div",z,[e("div",$,[e("div",ee,[e("div",te,[e("h2",se,l(t.$t("highest_preferred"))+" :",1),(b=s.result)!=null&&b.highest_preferred?(i(),r("span",le,l((v=s.result)==null?void 0:v.highest_preferred[0].letter),1)):d("",!0)]),e("div",oe,[e("h4",ie,l(t.$t("percentage"))+" :",1),(w=s.result)!=null&&w.highest_preferred?(i(),r("span",re,l((k=s.result)==null?void 0:k.highest_preferred[0].percentage),1)):d("",!0)])]),e("div",ae,[e("div",ne,[e("h2",de,l(t.$t("moderately_preferred"))+" :",1),(C=s.result)!=null&&C.moderately_preferred?(i(),r("span",ce,l((F=s.result)==null?void 0:F.moderately_preferred[0].letter),1)):d("",!0)]),e("div",ue,[e("h4",he,l(t.$t("percentage"))+" :",1),(S=s.result)!=null&&S.moderately_preferred?(i(),r("span",pe,l((V=s.result)==null?void 0:V.moderately_preferred[0].percentage),1)):d("",!0)])]),e("div",_e,[e("div",me,[e("h2",ge,l(t.$t("latest_preferred"))+" :",1),(I=s.result)!=null&&I.lowest_preferred?(i(),r("span",fe,l((B=s.result)==null?void 0:B.lowest_preferred[0].letter),1)):d("",!0)]),e("div",xe,[e("h4",ye,l(t.$t("percentage"))+" :",1),(D=s.result)!=null&&D.lowest_preferred?(i(),r("span",be,l((N=s.result)==null?void 0:N.lowest_preferred[0].percentage),1)):d("",!0)])]),n(m,{onClick:h.createevalation,class:"mt-4 m-auto create w-full",label:t.$t("submit")},null,8,["onClick","label"])]),e("div",null,[e("table",ve,[e("thead",we,[e("tr",null,[e("th",ke,l(t.$t("index")),1),e("th",Ce,l(t.$t("Selected_item")),1)])]),e("tbody",null,[e("tr",Fe,[e("th",Se,[(i(!0),r(_,null,g(s.arr,(c,p)=>(i(),r("div",null,l(p+1),1))),256))]),e("th",Ve,[e("div",Ie,[(i(!0),r(_,null,g(s.arr.length,(c,p)=>(i(),r("span",Be,[e("div",De,[(i(!0),r(_,null,g(s.arr,(f,Le)=>(i(),r("span",null,[e("span",null,l(f),1),e("input",{onChange:Me=>h.getanswer(p,f),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:p,value:f[1]},null,40,Ne)]))),256)),Te])]))),256))])])]),(T=s.error)!=null&&T.result?(i(),r("div",je,l(s.error.result[0]),1)):d("",!0)])])])])]}),_:1})],64)}const Ae=L(H,[["render",Pe],["__scopeId","data-v-09c25cb8"]]);export{Ae as default};
