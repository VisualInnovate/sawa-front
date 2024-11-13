import{_ as T,c as x,a1 as P,r as g,o,d as i,f as d,w as U,e as t,F as _,z as f,t as l,g as u,ac as Y}from"./main-eedf56aa.js";import{S as z}from"./Stimulu-dfedd188.js";const G={components:{Stimulu:z},data(){return{error:{},count:0,evalate_type:"",stimulus_id:"",countlength:1,originalArray:["A","B","C","D","E"],history:[["A","B","C","D","E"]],stimul:" ",pair:{result:[],values:[]},filterarr:[],result:{},childs:[],charset:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",stimulus:[],items:[],arr:[[]],pairs:[]}},methods:{selectItem(e,r){if(this.pair.result[r]=e,console.log(this.pair.result),r===this.arr.length-1){const a=this.arr[r].filter(c=>c!==e);this.arr.push(a)}},deletearray(){this.items.length>0&&(this.items.length--,this.arr[0].length--,this.count--,this.pusharr(),this.getchilde())},gosession(){this.$router.push({name:"sessions-update",params:{id:this.$route.params.id}})},addarray(){if(this.stimul!==" "){console.log(this.stimul!==""),this.items.push({name:`${this.charset[this.count]}`,value:`${this.stimul}`}),this.arr[0].push(this.charset[this.count]),this.count++,this.stimul=" ",this.pusharr();const e=this.items.map(r=>r.value);this.stimulus=this.stimulus.filter(r=>!e.includes(r.name))}},getanswer(e,r,a){this.countlength++,this.filterarr[a]=r,console.log(this.items)},getchilde(){x.get("api/child").then(e=>{this.childs=e.data.children,this.pair.child_id=parseInt(localStorage.getItem("child_id"))}),x.get("api/stimulus").then(e=>{this.stimulus=e.data.data;const r=this.items.map(a=>a.value);this.stimulus=this.stimulus.filter(a=>!r.includes(a.name))})},createevalation(){this.pair.date=P(this.pair.date).format("Y-MM-DD"),this.pair.specialist_id=localStorage.getItem("user_id"),this.pair.session_id=this.$route.params.id,this.pair.type=2,this.pair.values=this.items,x.post("api/stimulus-test",this.pair).then(e=>{console.log(e.data.data),this.result=e.data.data,this.stimulus_id=e.data.data.id}).catch(e=>{this.error=e.response.data.errors})},generatePairs(){const e=r=>{let a=[];for(let c=0;c<r.length;c++)for(let s=c+1;s<r.length;s++)a.push([r[c],r[s]]);return a};this.pairs=e(this.arr)},pusharr(){this.arrays=[];for(let e=0;e<1;e++)this.arrays.push([...this.arr])}},mounted(){this.getchilde(),this.evalate_type=localStorage.getItem("evalate_type")}},H={class:"m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-3"},J={class:"bg-white p-2 flex justify-between rounded-sm"},K={class:"flex"},O={class:"my-auto font-bold"},Q={class:"font-bold text-sm my-auto text-green-600",style:{"word-wrap":"unset"}},R={class:"flex"},W={class:"my-auto font-bold"},X={class:"font-bold my-auto text-green-600"},Z={class:"m-auto my-5 bg-slate-50 p-[2%] shadow-md grid grid-cols-1 gap-2 lg:grid-cols-2"},q={class:"shadow-md bg-[#FFFFFF] rounded-sm p-2 min-h-[250px]"},$={class:"flex justify-between py-2"},tt={class:"flex"},et={class:"font-bold px-1"},st={key:0,class:"font-bold text-[green]"},lt={class:"flex"},rt={class:"text-xl"},ot={key:0,class:"m-auto text-xl text-[green] font-bold"},it={class:"flex justify-between py-2"},at={class:"flex"},nt={class:"font-bold px-1"},dt={key:0,class:"font-bold text-[green]"},ct={class:"flex"},ht={class:"text-xl"},ut={key:0,class:"m-auto text-xl text-[green] font-bold"},pt={class:"flex justify-between py-2"},_t={class:"flex"},mt={class:"font-bold px-1"},gt={key:0,class:"font-bold text-[green]"},ft={class:"flex"},yt={class:"text-xl"},xt={key:0,class:"m-auto text-xl text-[green] font-bold"},bt={class:"w-full h-full rounded-md shadow-md text-sm text-left m-auto rtl:text-right text-gray-500 dark:text-gray-400"},vt={class:"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"},wt={scope:"col",class:"px-6 py-3"},kt={scope:"col",class:"px-6 py-3"},Ct={class:"bg-white border-b dark:bg-gray-800 dark:border-gray-700"},Ft={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},St={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},Bt=["disabled","onClick","name","value"],Dt={key:0},It={key:1},Vt={key:0,class:"mt-1 mb-5 w-full text-center text-red-500"};function jt(e,r,a,c,s,p){const E=g("Stimulu"),m=g("Button"),N=g("Dropdown"),L=g("toast");return o(),i(_,null,[d(E),d(Y,{class:"p-[2%]"},{default:U(()=>{var b,v,w,k,C,F,S,B,D,I,V,j,A;return[d(m,{icon:"pi pi-angle-left",onClick:p.gosession,class:"my-4 m-auto create",label:e.$t("العودة للجلسة")},null,8,["onClick","label"]),t("div",H,[t("div",null,[d(m,{onClick:p.addarray,class:"create m-auto",icon:"pi pi-plus"},null,8,["onClick"]),d(m,{disabled:s.count<=0,onClick:p.deletearray,class:"delete m-auto",icon:"pi pi-minus"},null,8,["disabled","onClick"]),d(N,{modelValue:s.stimul,"onUpdate:modelValue":r[0]||(r[0]=h=>s.stimul=h),class:"hover:ring-0 w-52 mx-2","option-value":"name",filter:"",options:s.stimulus,optionLabel:"name",placeholder:"select item"},null,8,["modelValue","options"])]),(o(!0),i(_,null,f(s.items,(h,n)=>(o(),i("div",J,[t("div",K,[t("h3",O,l(e.$t("name"))+" :",1),t("p",Q,l(h.value),1)]),t("div",R,[t("h3",W,l(e.$t("ترتيب المعزز"))+" :",1),t("p",X,l(h.name),1)])]))),256))]),t("div",Z,[t("div",q,[t("div",$,[t("div",tt,[t("h2",et,l(e.$t("highest_preferred"))+" :",1),(b=s.result)!=null&&b.highest_preferred?(o(),i("span",st,l((v=s.result)==null?void 0:v.highest_preferred[0].letter),1)):u("",!0)]),t("div",lt,[t("h4",rt,l(e.$t("percentage"))+" :",1),(w=s.result)!=null&&w.highest_preferred?(o(),i("span",ot,l((k=s.result)==null?void 0:k.highest_preferred[0].percentage),1)):u("",!0)])]),t("div",it,[t("div",at,[t("h2",nt,l(e.$t("moderately_preferred"))+" :",1),(C=s.result)!=null&&C.moderately_preferred?(o(),i("span",dt,l((F=s.result)==null?void 0:F.moderately_preferred[0].letter),1)):u("",!0)]),t("div",ct,[t("h4",ht,l(e.$t("percentage"))+" :",1),(S=s.result)!=null&&S.moderately_preferred?(o(),i("span",ut,l((B=s.result)==null?void 0:B.moderately_preferred[0].percentage),1)):u("",!0)])]),t("div",pt,[t("div",_t,[t("h2",mt,l(e.$t("latest_preferred"))+" :",1),(D=s.result)!=null&&D.lowest_preferred?(o(),i("span",gt,l((I=s.result)==null?void 0:I.lowest_preferred[0].letter),1)):u("",!0)]),t("div",ft,[t("h4",yt,l(e.$t("percentage"))+" :",1),(V=s.result)!=null&&V.lowest_preferred?(o(),i("span",xt,l((j=s.result)==null?void 0:j.lowest_preferred[0].percentage),1)):u("",!0)])]),d(m,{onClick:p.createevalation,class:"mt-4 m-auto create w-full",label:e.$t("submit")},null,8,["onClick","label"])]),t("div",null,[t("table",bt,[t("thead",vt,[t("tr",null,[t("th",wt,l(e.$t("index")),1),t("th",kt,l(e.$t("Selected_item")),1)])]),t("tbody",null,[t("tr",Ct,[t("th",Ft,[(o(!0),i(_,null,f(s.arr.length-1,(h,n)=>(o(),i("div",null,l(n+1),1))),256))]),t("th",St,[(o(!0),i(_,null,f(s.arr,(h,n)=>(o(),i("div",{key:n},[(o(!0),i(_,null,f(h,(y,M)=>(o(),i("span",{key:M},[t("input",{disabled:n!=s.arr.length-1,onClick:At=>p.selectItem(y,n),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:n,value:s.pair[0]},null,8,Bt),n===s.arr.length-1?(o(),i("button",Dt,l(y),1)):(o(),i("button",It,l(y),1))]))),128))]))),128))])]),(A=s.error)!=null&&A.result?(o(),i("div",Vt,l(s.error.result[0]),1)):u("",!0)])])])]),d(L)]}),_:1})],64)}const Lt=T(G,[["render",jt],["__scopeId","data-v-8921209d"]]);export{Lt as default};
