import{_ as v,c as b,r as y,o as e,d as s,F as n,B as l,f as F,w as k,h as w,t as d,e as o,N,g as B}from"./main-fc77a027.js";const C={name:"SquareGrid",data(){return{color:"bg-[red]",mainSquares:[],table_resulte:[]}},methods:{getresulte(){b.get(`api/barrier-subtest/result/${this.$route.params.id}`).then(_=>{this.mainSquares=_.data;for(let a=0;a<this.mainSquares.length;a++)for(let i=0;i<5;i++)this.mainSquares[a].questions[i]||(this.mainSquares[a].questions[i]={score:0,color:"FFFFFF"});console.log(this.mainSquares),this.mainSquares[0].questions.slice().reverse()})}},mounted(){this.getresulte(),localStorage.getItem("child_id")}},V={class:"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-y-4"},P={class:""},z={key:0,class:"flex",style:{border:"1px 1px 0px 0px solid black"}},D={class:"grid grid-cols-1"},E={class:"h-full text-center"},G={class:"grid grid-cols-1"},I={class:"grid grid-cols-1 m-auto text-center"},L={class:"text-center pt-"};function T(_,a,i,j,t,A){const q=y("P");return e(),s("div",V,[(e(!0),s(n,null,l(t.mainSquares,(S,c)=>{var m;return e(),s("div",P,[F(q,{class:"font-bold w-full h-20 text-center py-1"},{default:k(()=>[w(d(S.subtest),1)]),_:2},1024),t.mainSquares?(e(),s("div",z,[o("div",D,[(e(!0),s(n,null,l((m=t.mainSquares[0])==null?void 0:m.questions.slice().reverse(),(x,r)=>{var u;return e(),s("div",{class:"w-20 h-16 m-auto text-center",key:r},[o("p",E,d(((u=t.mainSquares[0])==null?void 0:u.questions.length)-r),1)])}),128))]),(e(),s(n,null,l(5,(x,r)=>o("div",G,[(e(),s(n,null,l(5,(u,f)=>{var h,g,p;return o("div",I,[o("p",{class:"text-center pt-7 w-16 h-16",style:N([{border:"1px solid black"},{backgroundColor:((h=t.mainSquares[c])==null?void 0:h.questions[r].score)>=((g=t.mainSquares[c])==null?void 0:g.questions.length)-f?`#${(p=t.mainSquares[c])==null?void 0:p.questions[r].color}`:""}])},null,4)])}),64)),o("p",L,d(r+1),1)])),64))])):B("",!0)])}),256))])}const J=v(C,[["render",T]]);export{J as default};
