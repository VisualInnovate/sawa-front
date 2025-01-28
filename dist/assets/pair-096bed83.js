import{_ as L,c as g,r as f,o as r,d as a,f as c,w as M,e,F as m,B as y,t as l,g as h,X as E,O,P as U}from"./main-fc77a027.js";import{h as X}from"./moment-fbc5633a.js";import{S as Y}from"./Stimulu-6672d506.js";const A={components:{Stimulu:Y},data(){return{error:{},count:0,pair:{result:[],values:[]},stimul:" ",evalate_type:"",namesToCheck:[],result:{},childs:[],charset:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",stimulus:[],items:[],arr:[],pairs:[]}},methods:{getdatafilter(t){this.namesToCheck.push(t),this.missingNames()},missingNames(){this.stimulus=this.stimulus.filter(t=>!this.namesToCheck.includes(t.id))},deletearray(){this.items.length>0&&(this.items.length--,this.arr.length--,this.count--,this.generatePairs(),this.getchilde())},gosession(){this.$router.push({name:"sessions-update",params:{id:this.$route.params.id}})},addarray(){if(this.stimul!==" "){this.items.push({name:`${this.charset[this.count]}`,value:`${this.stimul}`}),this.arr.push(this.charset[this.count]),this.generatePairs(),this.count++,this.stimul=" ";const t=this.items.map(o=>o.value);this.stimulus=this.stimulus.filter(o=>!t.includes(o.name))}},getanswer(t,o){this.pair.result[t]=o,console.log(this.items)},getchilde(){g.get("api/child").then(t=>{this.childs=t.data.children,this.pair.child_id=parseInt(localStorage.getItem("child_id"))}),g.get("api/stimulus").then(t=>{this.stimulus=t.data.data;const o=this.items.map(n=>n.value);this.stimulus=this.stimulus.filter(n=>!o.includes(n.name))})},createevalation(){this.pair.date=X(this.pair.date).format("Y-MM-DD"),this.pair.specialist_id=localStorage.getItem("user_id"),this.pair.type=0,this.pair.values=this.items,this.pair.session_id=this.$route.params.id,g.post("api/stimulus-test",this.pair).then(t=>{console.log(t.data.data),this.result=t.data.data}).catch(t=>{this.error=t.response.data.errors})},generatePairs(){const t=o=>{let n=[];for(let p=0;p<o.length;p++)for(let s=p+1;s<o.length;s++)n.push([o[p],o[s]]);return n};this.pairs=t(this.arr)}},mounted(){this.generatePairs(),this.getchilde(),this.evalate_type=localStorage.getItem("evalate_type")}},G=t=>(O("data-v-9a4fc228"),t=t(),U(),t),H={class:"m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-3"},J={class:"bg-white p-2 flex justify-between rounded-sm"},K={class:"flex"},Q={class:"my-auto font-bold"},R={class:"font-bold text-sm my-auto text-green-600",style:{"word-wrap":"unset"}},W={class:"flex"},Z={class:"my-auto font-bold"},q={class:"font-bold my-auto text-green-600"},z={class:"m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-2"},$={class:"shadow-md bg-[#FFFFFF] rounded-sm p-2 min-h-[250px]"},ee={class:"flex justify-between py-2"},te={class:"flex"},se={class:"font-bold px-1"},le={key:0,class:"font-bold text-[green]"},oe={class:"flex"},ie={class:"text-xl"},re={key:0,class:"m-auto text-xl text-[green] font-bold"},ae={class:"flex justify-between py-2"},ne={class:"flex"},de={class:"font-bold px-1"},ce={key:0,class:"font-bold text-[green]"},he={class:"flex"},ue={class:"text-xl"},pe={key:0,class:"m-auto text-xl text-[green] font-bold"},_e={class:"flex justify-between py-2"},me={class:"flex"},ge={class:"font-bold px-1"},fe={key:0,class:"font-bold text-[green]"},ye={class:"flex"},xe={class:"text-xl"},ve={key:0,class:"m-auto text-xl text-[green] font-bold"},be={class:"w-full h-full rounded-md shadow-md text-sm text-left m-auto rtl:text-right text-gray-500 dark:text-gray-400"},we={class:"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"},ke={scope:"col",class:"px-6 py-3"},Ce={scope:"col",class:"px-6 py-3"},Se={class:"bg-white border-b dark:bg-gray-800 dark:border-gray-700"},Fe={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},Ie={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},Ve={class:"flex"},je=["onChange","name","value"],Be=G(()=>e("span",null,null,-1)),De={class:"px-[1%]"},Ne=["onChange","name","value"],Pe={key:0,class:"mt-1 mb-5 w-full text-center text-red-500"};function Te(t,o,n,p,s,u){const N=f("Stimulu"),_=f("Button"),P=f("Dropdown");return r(),a(m,null,[c(N),c(_,{icon:"pi pi-angle-left",onClick:u.gosession,class:"my-4 m-auto create",label:t.$t("العودة للجلسة")},null,8,["onClick","label"]),c(E,{class:"p-[2%]"},{default:M(()=>{var x,v,b,w,k,C,S,F,I,V,j,B,D;return[e("div",H,[e("div",null,[c(_,{onClick:u.addarray,class:"create m-auto",icon:"pi pi-plus"},null,8,["onClick"]),c(_,{disabled:s.count<=0,onClick:u.deletearray,class:"delete m-auto",icon:"pi pi-minus"},null,8,["disabled","onClick"]),c(P,{modelValue:s.stimul,"onUpdate:modelValue":o[0]||(o[0]=i=>s.stimul=i),class:"hover:ring-0 w-52 mx-2","option-value":"name",filter:"",options:s.stimulus,optionLabel:"name",placeholder:"select item"},null,8,["modelValue","options"])]),(r(!0),a(m,null,y(s.items,(i,d)=>(r(),a("div",J,[e("div",K,[e("h3",Q,l(t.$t("name"))+" :",1),e("p",R,l(i.value),1)]),e("div",W,[e("h3",Z,l(t.$t("ترتيب المعزز"))+" :",1),e("p",q,l(i.name),1)])]))),256))]),e("div",z,[e("div",$,[e("div",ee,[e("div",te,[e("h2",se,l(t.$t("highest_preferred"))+" :",1),(x=s.result)!=null&&x.highest_preferred?(r(),a("span",le,l((v=s.result)==null?void 0:v.highest_preferred[0].letter),1)):h("",!0)]),e("div",oe,[e("h4",ie,l(t.$t("percentage"))+" :",1),(b=s.result)!=null&&b.highest_preferred?(r(),a("span",re,l((w=s.result)==null?void 0:w.highest_preferred[0].percentage),1)):h("",!0)])]),e("div",ae,[e("div",ne,[e("h2",de,l(t.$t("moderately_preferred"))+" :",1),(k=s.result)!=null&&k.moderately_preferred?(r(),a("span",ce,l((C=s.result)==null?void 0:C.moderately_preferred[0].letter),1)):h("",!0)]),e("div",he,[e("h4",ue,l(t.$t("percentage"))+" :",1),(S=s.result)!=null&&S.moderately_preferred?(r(),a("span",pe,l((F=s.result)==null?void 0:F.moderately_preferred[0].percentage),1)):h("",!0)])]),e("div",_e,[e("div",me,[e("h2",ge,l(t.$t("latest_preferred"))+" :",1),(I=s.result)!=null&&I.lowest_preferred?(r(),a("span",fe,l((V=s.result)==null?void 0:V.lowest_preferred[0].letter),1)):h("",!0)]),e("div",ye,[e("h4",xe,l(t.$t("percentage"))+" :",1),(j=s.result)!=null&&j.lowest_preferred?(r(),a("span",ve,l((B=s.result)==null?void 0:B.lowest_preferred[0].percentage),1)):h("",!0)])]),c(_,{onClick:u.createevalation,class:"mt-4 m-auto create w-full",label:t.$t("submit")},null,8,["onClick","label"])]),e("div",null,[e("table",be,[e("thead",we,[e("tr",null,[e("th",ke,l(t.$t("index")),1),e("th",Ce,l(t.$t("Selected_item")),1)])]),e("tbody",null,[e("tr",Se,[e("th",Fe,[(r(!0),a(m,null,y(s.pairs,(i,d)=>(r(),a("div",{key:i.join("-")},l(d+1),1))),128))]),e("th",Ie,[(r(!0),a(m,null,y(s.pairs,(i,d)=>(r(),a("div",{class:"lg:rtl:pr-28",key:i.join("-")},[e("div",Ve,[e("div",null,[e("span",null,l(i[1]),1),e("input",{onChange:T=>u.getanswer(d,i[1]),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:d,value:i[1]},null,40,je)]),Be,e("div",De,[e("span",null,l(i[0]),1),e("input",{onChange:T=>u.getanswer(d,i[0]),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:d,value:i[0]},null,40,Ne)])])]))),128))])]),(D=s.error)!=null&&D.result?(r(),a("div",Pe,l(s.error.result[0]),1)):h("",!0)])])])])]}),_:1})],64)}const Oe=L(A,[["render",Te],["__scopeId","data-v-9a4fc228"]]);export{Oe as default};
