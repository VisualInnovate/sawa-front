import{_,c as d,o as e,x as m,w as p,e as s,d as t,z as i,t as c,F as n,O as g,P as h,g as f,X as x}from"./main-0ef3d56d.js";const w={name:"SquareGrid",data(){return{colums:2,color:"bg-[red]",mainSquares:[],table_resulte:[]}},methods:{getresulte(){d.get(`api/able-category/flow-chart/${this.$route.params.id}`).then(r=>{this.mainSquares=r.data.data}),d.get(`api/api/evaluations/report/${this.$route.params.id}`).then(r=>{this.mainSquares=r.data.data})}},beforeMount(){this.getresulte()}},y={class:"grid grid-cols-7 gap-4"},v={class:"shadow-md py-2"},S={class:"m-auto text-center w-full py-2"},$={class:""},k={class:"flex"},q={class:"px-2"};function C(r,b,B,z,l,V){return e(),m(x,null,{default:p(()=>[s("div",y,[l.mainSquares?(e(!0),t(n,{key:0},i(l.mainSquares,o=>(e(),t("div",v,[s("p",S,c(o==null?void 0:o.category),1),s("div",null,[(e(!0),t(n,null,i(o.missions,a=>(e(),t("div",$,[s("div",k,[s("p",q,c(a.mission_key),1),s("div",{class:g(["bg-white grid w-[100px]",[`grid-cols-${a.mission_degree.length-1}`]])},[(e(!0),t(n,null,i(a.mission_degree.length-1,(F,u)=>(e(),t("div",{class:"w-full flex items-center justify-center",style:h({border:"1px solid black",backgroundColor:u<a.answer_score?`#${a.answer_color}`:""})},null,4))),256))],2)])]))),256))])]))),256)):f("",!0)])]),_:1})}const j=_(w,[["render",C]]);export{j as default};
