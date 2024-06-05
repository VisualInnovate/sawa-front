import{_ as N,c as C,D as U,r as x,o as l,d as r,f as n,w as B,e as t,t as o,g as c,F as b,z as y,X as S,x as E,Q as L,R as M}from"./main-7cb3d64d.js";import{S as P}from"./Stimulu-7b941bf3.js";const T={components:{Stimulu:P},data(){return{error:{},count:2,pair:{result:[],values:[]},namesToCheck:[],result:{},childs:[],charset:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",stimulus:[],items:[{name:"A",value:" "},{name:"B",value:" "}],arr:["A","B"],pairs:[]}},methods:{getdatafilter(s){this.namesToCheck.push(s),this.missingNames()},missingNames(){this.stimulus=this.stimulus.filter(s=>!this.namesToCheck.includes(s.id))},deletearray(){this.items.length>2&&(this.items.length--,this.arr.length--,this.count--,this.generatePairs())},addarray(){this.items.push({name:`${this.charset[this.count]}`,value:" "}),this.arr.push(this.charset[this.count]),this.generatePairs(),this.count++},getanswer(s,i){console.log(i),this.pair.result[s]=i,console.log(this.items)},getchilde(){C.get("api/child").then(s=>{this.childs=s.data.children}),C.get("api/stimulus").then(s=>{this.stimulus=s.data.data})},createevalation(){this.pair.date=U(this.pair.date).format("Y-MM-DD"),this.pair.specialist_id=localStorage.getItem("user_id"),this.pair.type=1,this.pair.values=this.items,C.post("api/stimulus-test",this.pair).then(s=>{console.log(s.data.data),this.result=s.data.data}).catch(s=>{this.error=s.response.data.errors})},generatePairs(){const s=i=>{let w=[];for(let h=0;h<i.length;h++)for(let e=h+1;e<i.length;e++)w.push([i[h],i[e]]);return w};this.pairs=s(this.arr)}},mounted(){this.getchilde()}},u=s=>(L("data-v-f8b2635e"),s=s(),M(),s),A={class:"m-auto"},F={class:"flex justify-between flex-column gap-2"},j={for:"username"},Q={key:0,class:"mt-1 mb-5 text-red-500"},R={class:"flex flex-column gap-2"},X={for:"username"},Y={key:0,class:"mt-1 mb-5 text-red-500"},q={class:"lg:col-span-2 m-auto"},z={class:"flex"},G={class:"flex border-b-2 border-black"},H={class:"my-auto w-16"},J={key:0,class:"mt-1 mb-5 w-full text-center text-red-500"},K={class:"relative overflow-x-auto"},O={class:"min-w-3xl text-sm text-left m-auto rtl:text-right text-gray-500 dark:text-gray-400"},W=u(()=>t("thead",{class:"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"},[t("tr",null,[t("th",{scope:"col",class:"px-6 py-3"}," الرقم "),t("th",{scope:"col",class:"px-6 py-3"}," العنصر المختار ")])],-1)),Z={class:"bg-white border-b dark:bg-gray-800 dark:border-gray-700"},$={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},ee={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},te={class:"flex"},se=["onChange","name","value"],le=u(()=>t("span",null,null,-1)),re={key:0,class:"mt-1 mb-5 w-full text-center text-red-500"},oe=u(()=>t("div",null,null,-1)),ie={class:"flex py-2"},ae=u(()=>t("h2",{class:"font-bold px-1"},"highest preferred :",-1)),ne={key:0},de=u(()=>t("span",null,null,-1)),ce={key:1},ue={class:"flex py-2"},he=u(()=>t("h2",{class:"font-bold px-1"},"moderately preferred :",-1)),pe={class:"flex py-2"},_e=u(()=>t("h2",{class:"font-bold px-1"},"lowest preferred :",-1));function me(s,i,w,h,e,v){const D=x("Stimulu"),V=x("Dropdown"),I=x("Calendar"),k=x("Button");return l(),r(b,null,[n(D),n(S,{class:"grid grid-cols-1 lg:grid-cols-4 gap-4"},{default:B(()=>{var p,_,m,g;return[t("div",A,[t("div",F,[t("label",j,o(s.$t("child_name")),1),n(V,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:e.pair.child_id,"onUpdate:modelValue":i[0]||(i[0]=a=>e.pair.child_id=a),"option-value":"id",options:e.childs,optionLabel:"name",placeholder:s.$t("child_name"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(p=e.error)!=null&&p.child_id?(l(),r("div",Q,o(e.error.child_id[0]),1)):c("",!0)]),t("div",R,[t("label",X,o(s.$t("Evaluation_date")),1),n(I,{style:{width:"100%"},showButtonBar:"",modelValue:e.pair.date,"onUpdate:modelValue":i[1]||(i[1]=a=>e.pair.date=a),modelModifiers:{number:!0},showIcon:"",placeholder:s.$t("Evaluation_date")},null,8,["modelValue","placeholder"]),(_=e.error)!=null&&_.date?(l(),r("div",Y,o(e.error.date[0]),1)):c("",!0)])]),t("div",q,[t("div",z,[n(k,{disabled:e.count<=2,onClick:v.deletearray,class:"delete m-auto",icon:"pi pi-minus",label:"ازالة عنصر"},null,8,["disabled","onClick"]),n(k,{onClick:v.addarray,class:"create m-auto",icon:"pi pi-plus",label:"اضافة عنصر"},null,8,["onClick"])]),(l(!0),r(b,null,y(e.items,(a,d)=>(l(),r("div",G,[n(V,{modelValue:e.items[d].value,"onUpdate:modelValue":f=>e.items[d].value=f,class:"hover:ring-0 w-52","option-value":"id",options:e.stimulus,optionLabel:"name",placeholder:" select  "+a.name},null,8,["modelValue","onUpdate:modelValue","options","placeholder"]),t("p",H," item : "+o(a.name),1)]))),256)),(m=e.error)!=null&&m.result?(l(),r("div",J,o(e.error.result[0]),1)):c("",!0)]),t("div",K,[t("table",O,[W,t("tbody",null,[t("tr",Z,[t("th",$,[(l(!0),r(b,null,y(e.arr,(a,d)=>(l(),r("div",null,o(d+1),1))),256))]),t("th",ee,[(l(!0),r(b,null,y(e.arr.length,(a,d)=>(l(),r("span",null,[t("div",te,[(l(!0),r(b,null,y(e.arr,(f,ge)=>(l(),r("span",null,[t("span",null,o(f),1),t("input",{onChange:fe=>v.getanswer(d,f),style:{border:"1px solid black"},class:"mx-2",type:"radio",name:d,value:f[1]},null,40,se)]))),256)),le])]))),256))])]),(g=e.error)!=null&&g.result?(l(),r("div",re,o(e.error.result[0]),1)):c("",!0)])])]),oe,n(k,{onClick:v.createevalation,class:"col-span-2 mb-2 create m-auto w-full",label:s.$t("submit")},null,8,["onClick","label"])]}),_:1}),e.result?(l(),E(S,{key:0,class:"my-[2%] py-[2%]"},{default:B(()=>{var p,_,m,g;return[t("div",ie,[ae,(p=e.result)!=null&&p.highest_preferred?(l(),r("span",ne,"letter: "+o((_=e.result)==null?void 0:_.highest_preferred[0].letter),1)):c("",!0),de,(m=e.result)!=null&&m.highest_preferred?(l(),r("span",ce," percentage "+o((g=e.result)==null?void 0:g.highest_preferred[0].percentage),1)):c("",!0)]),t("div",ue,[he,t("p",null,o(e.result.moderately_preferred),1)]),t("div",pe,[_e,t("p",null,o(e.result.lowest_preferred),1)])]}),_:1})):c("",!0)],64)}const xe=N(T,[["render",me],["__scopeId","data-v-f8b2635e"]]);export{xe as default};
