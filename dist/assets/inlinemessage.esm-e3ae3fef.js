import{j as c,k as p,l as d,m,n as u,o as r,d as f,p as o,e as y,q as a,x as h,y as g,h as v}from"./main-e6ca79c6.js";var C={name:"InlineMessage",extends:c,props:{severity:{type:String,default:"error"},icon:{type:String,default:void 0}},timeout:null,data(){return{visible:!0}},mounted(){this.sticky||setTimeout(()=>{this.visible=!1},this.life)},computed:{containerClass(){return["p-inline-message p-component p-inline-message-"+this.severity,{"p-inline-message-icon-only":!this.$slots.default}]},iconComponent(){return{info:p,success:d,warn:m,error:u}[this.severity]}}};function x(e,s,i,t,n,l){return r(),f("div",a({"aria-live":"polite",class:l.containerClass},e.ptm("root")),[o(e.$slots,"icon",{},()=>[(r(),h(g(i.icon?"span":l.iconComponent),a({class:["p-inline-message-icon",i.icon]},e.ptm("icon")),null,16,["class"]))]),y("span",a({class:"p-inline-message-text"},e.ptm("text")),[o(e.$slots,"default",{},()=>[v(" ")])],16)],16)}function $(e,s){s===void 0&&(s={});var i=s.insertAt;if(!(!e||typeof document>"u")){var t=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css",i==="top"&&t.firstChild?t.insertBefore(n,t.firstChild):t.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}}var B=`
.p-inline-message {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: top;
}
.p-inline-message-icon-only .p-inline-message-text {
    visibility: hidden;
    width: 0;
}
.p-fluid .p-inline-message {
    display: flex;
}
`;$(B);C.render=x;export{C as s};
