import{_ as s,bh as c,y as n,k as _,o as r,e as d,h as a,q as l,x as p,F as h,L as m,O as i}from"./main-4fe28c25.js";const u={components:{Home:c},data(){return{searchQuery:"",headers:[5],rooms:[],page:1,showModal:!1}},mounted(){this.fetchData()},methods:{fetchData(){n.get("https://example.com/api/data").then(e=>{this.rooms=e.data}).catch(e=>{console.error("Error fetching data:",e)})}}},t=e=>(m("data-v-35271acc"),e=e(),i(),e),f=t(()=>a("h1",null,"Sample Heading",-1)),x=t(()=>a("div",null,null,-1));function v(e,g,$,y,H,I){const o=_("Home");return r(),d(h,null,[a("div",null,[l(o,null,{default:p(()=>[f]),_:1})]),x],64)}const k=s(u,[["render",v],["__scopeId","data-v-35271acc"]]);export{k as default};