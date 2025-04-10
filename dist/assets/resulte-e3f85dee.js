import{_ as f,c as x,o as r,d as s,e as t,h as u,t as a,F as d,x as p,W as y,n as k,j as w}from"./main-db2c6e29.js";const S={name:"SquareGrid",data(){return{mainSquares:[],table_resulte:[]}},methods:{getresulte(){x.get(`api/mileston-levels/flow-chart/${this.$route.params.id}`).then(n=>{this.mainSquares=n.data.data}).catch(n=>{console.error("Error retrieving data:",n)}),x.get(`api/evaluations/report/${this.$route.params.evla_id}`).then(n=>{this.table_resulte=n.data}).catch(n=>{console.error("Error retrieving evaluation data:",n)})},printReport(){const n=document.createElement("style");n.innerHTML=`
        @page {
          size: auto;
          margin: 10mm;
        }
        body {
          padding: 0 !important;
          margin: 0 !important;
          background: white !important;
        }
        .sidebar {
          display: none !important;
        }
        .container {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .pageNumber:after {
          content: counter(page);
        }
        .print\\:break-inside-avoid {
          break-inside: avoid;
        }
      `,document.head.appendChild(n),window.print(),setTimeout(()=>{document.head.removeChild(n)},1e3)}},mounted(){this.getresulte()}},E={class:"p-6 bg-gray-50 min-h-screen container mx-auto print:p-0 print:w-full print:max-w-full print:mx-0"},C={class:"flex justify-between items-center mb-8 print:hidden"},j=t("h1",{class:"text-3xl font-bold text-gray-800"},"Evaluation Report",-1),R=t("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-5 w-5",viewBox:"0 0 20 20",fill:"currentColor"},[t("path",{"fill-rule":"evenodd",d:"M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z","clip-rule":"evenodd"})],-1),V={class:"hidden print:block py-4 border-b border-gray-200 mb-4"},z=t("h1",{class:"text-3xl font-bold text-gray-800 text-center"},"Evaluation Report",-1),L={class:"text-center text-gray-600 mt-2"},D={class:"space-y-12 print:space-y-6"},H={class:"bg-gradient-to-r from-blue-500 to-blue-600 p-4 print:bg-blue-600"},N={class:"w-full py-2 text-2xl font-bold text-center text-white"},$={class:"p-4 print:p-2"},B={class:"grid grid-cols-10 border border-gray-200 rounded-lg overflow-hidden print:text-sm"},T={class:"grid grid-cols-1 bg-gray-100"},G=t("div",{class:"w-20 h-16 text-center flex items-center justify-center bg-gray-200 font-medium print:w-16 print:h-12"},null,-1),F={class:"grid grid-cols-1"},M={class:"w-20 h-20 text-center flex items-center justify-center bg-gray-100 border-l border-gray-200 p-2 text-sm font-medium print:w-16 print:h-16 print:text-xs"},P={class:"mt-12 bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:border print:break-inside-avoid print:mt-8"},W=t("div",{class:"bg-gradient-to-r from-blue-500 to-blue-600 p-4 print:bg-blue-600"},[t("h2",{class:"text-xl font-bold text-white"},"Evaluation Summary")],-1),A={class:"relative overflow-x-auto print:overflow-x-visible"},J={class:"w-full text-sm text-left text-gray-700 print:text-xs"},K=t("thead",{class:"text-xs text-white uppercase bg-blue-500 print:bg-blue-600"},[t("tr",null,[t("th",{scope:"col",class:"px-6 py-3 print:px-3 print:py-2"},"#"),t("th",{scope:"col",class:"px-6 py-3 print:px-3 print:py-2"},"Strengths"),t("th",{scope:"col",class:"px-6 py-3 print:px-3 print:py-2"},"Weaknesses"),t("th",{scope:"col",class:"px-6 py-3 print:px-3 print:py-2"},"Status"),t("th",{scope:"col",class:"px-6 py-3 print:px-3 print:py-2"},"Target Symbol")])],-1),O={class:"px-6 py-4 font-medium print:px-3 print:py-2"},Q={class:"px-6 py-4 print:px-3 print:py-2"},U={key:0},X={class:"px-6 py-4 print:px-3 print:py-2"},Y={key:0},Z={class:"px-6 py-4 print:px-3 print:py-2"},I={class:"px-6 py-4 font-medium print:px-3 print:py-2"},q={class:"hidden print:block mt-8 pt-4 border-t border-gray-200 text-xs text-gray-600"},tt={class:"flex justify-between"},et=t("div",null,[u("Page "),t("span",{class:"pageNumber"})],-1);function rt(n,_,st,nt,b,m){return r(),s("div",E,[t("div",C,[j,t("button",{onClick:_[0]||(_[0]=(...e)=>m.printReport&&m.printReport(...e)),class:"px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"},[R,u(" Print Report ")])]),t("div",V,[z,t("div",L," Generated on: "+a(new Date().toLocaleDateString()),1)]),t("div",D,[(r(!0),s(d,null,p(b.mainSquares,(e,c)=>{var l;return r(),s("div",{key:c,class:"bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:border print:break-inside-avoid"},[t("div",H,[t("h1",N,"LEVEL "+a(c+1),1)]),t("div",$,[t("div",B,[t("div",T,[G,(r(!0),s(d,null,p(e==null?void 0:e.subtests[0].questions,(i,h)=>(r(),s("div",{class:"w-20 h-16 m-auto text-center flex items-center justify-center border-t border-gray-200 font-medium print:w-16 print:h-12",key:h},a(h+1),1))),128))]),(r(!0),s(d,null,p((l=b.mainSquares[0])==null?void 0:l.subtests,(i,h)=>{var g;return r(),s("div",F,[t("div",M,a((g=e==null?void 0:e.subtests[h])==null?void 0:g.subtest_name),1),(r(!0),s(d,null,p(e==null?void 0:e.subtests[h].questions,(o,v)=>(r(),s("div",{class:"w-20 h-16 border-t border-l border-gray-200 flex flex-col justify-between print:w-16 print:h-12",key:v},[t("div",{class:"h-1/2 border-b border-gray-200",style:y({backgroundColor:o.answer_score==1?`#${o.answer_color}`:"",border:"1px dotted #d1d5db"})},null,4),t("div",{class:"h-1/2",style:y({backgroundColor:(o==null?void 0:o.answer_score)==1||(o==null?void 0:o.answer_score)==.5?`#${o==null?void 0:o.answer_color}`:"",border:"1px dotted #d1d5db"})},null,4)]))),128))])}),256))])])])}),128))]),t("div",P,[W,t("div",A,[t("table",J,[K,t("tbody",null,[(r(!0),s(d,null,p(b.table_resulte,(e,c)=>(r(),s("tr",{key:c,class:k(["border-b border-gray-200 hover:bg-gray-50 print:hover:bg-transparent",{"bg-gray-50":c%2===0}])},[t("td",O,a(e.index),1),t("td",Q,[(r(!0),s(d,null,p(e.strength,(l,i)=>(r(),s("span",{key:i},[u(a(l),1),i<e.strength.length-1?(r(),s("span",U,", ")):w("",!0)]))),128))]),t("td",X,[(r(!0),s(d,null,p(e.weak,(l,i)=>(r(),s("span",{key:i},[u(a(l),1),i<e.weak.length-1?(r(),s("span",Y,", ")):w("",!0)]))),128))]),t("td",Z,a(e.status),1),t("td",I,a(e.symbol),1)],2))),128))])])])]),t("div",q,[t("div",tt,[t("div",null,"Evaluation Report - Generated on: "+a(new Date().toLocaleDateString()),1),et])])])}const at=f(S,[["render",rt]]);export{at as default};
