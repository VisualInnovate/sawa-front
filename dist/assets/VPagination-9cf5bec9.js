import{I as R,aS as W,aB as q,aT as x,aU as K,aV as U,aW as X,aX as G,aY as H,aH as O,aZ as Y,a_ as Z,a$ as j,b0 as J,b1 as Q,b2 as aa,b3 as ea,b4 as A,b5 as ta,P as b,b6 as f,aE as ia,f as o,af as L,q as h,b7 as k,b8 as $,N as B}from"./main-eedf56aa.js";function la(){const a=R([]);W(()=>a.value=[]);function _(n,V){a.value[V]=n}return{refs:a,updateRef:_}}const sa=q({name:"VPagination",props:{activeColor:String,start:{type:[Number,String],default:1},modelValue:{type:Number,default:a=>a.start},disabled:Boolean,length:{type:[Number,String],default:1,validator:a=>a%1===0},totalVisible:[Number,String],firstIcon:{type:x,default:"$first"},prevIcon:{type:x,default:"$prev"},nextIcon:{type:x,default:"$next"},lastIcon:{type:x,default:"$last"},ariaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.root"},pageAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.page"},currentPageAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.currentPage"},firstAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.first"},previousAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.previous"},nextAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.next"},lastAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.last"},ellipsis:{type:String,default:"..."},showFirstLastPage:Boolean,...K(),...U(),...X(),...G(),...H(),...O({tag:"nav"}),...Y(),...Z({variant:"text"})},emits:{"update:modelValue":a=>!0,first:a=>!0,prev:a=>!0,next:a=>!0,last:a=>!0},setup(a,_){let{slots:n,emit:V}=_;const l=j(a,"modelValue"),{t:g,n:C}=J(),{isRtl:P}=Q(),{themeClasses:w}=aa(a),{width:D}=ea(),I=R(-1);A(void 0,{scoped:!0});const{resizeRef:F}=ta(e=>{if(!e.length)return;const{target:t,contentRect:i}=e[0],r=t.querySelector(".v-pagination__list > *");if(!r)return;const v=i.width,m=r.offsetWidth+parseFloat(getComputedStyle(r).marginRight)*2;I.value=S(v,m)}),s=b(()=>parseInt(a.length,10)),u=b(()=>parseInt(a.start,10)),c=b(()=>a.totalVisible?parseInt(a.totalVisible,10):I.value>=0?I.value:S(D.value,58));function S(e,t){const i=a.showFirstLastPage?5:3;return Math.max(0,Math.floor(+((e-t*i)/t).toFixed(2)))}const N=b(()=>{if(s.value<=0||isNaN(s.value)||s.value>Number.MAX_SAFE_INTEGER)return[];if(c.value<=1)return[l.value];if(s.value<=c.value)return k(s.value,u.value);const e=c.value%2===0,t=e?c.value/2:Math.floor(c.value/2),i=e?t:t+1,r=s.value-t;if(i-l.value>=0)return[...k(Math.max(1,c.value-1),u.value),a.ellipsis,s.value];if(l.value-r>=(e?1:0)){const v=c.value-1,m=s.value-v+u.value;return[u.value,a.ellipsis,...k(v,m)]}else{const v=Math.max(1,c.value-3),m=v===1?l.value:l.value-Math.ceil(v/2)+u.value;return[u.value,a.ellipsis,...k(v,m),a.ellipsis,s.value]}});function y(e,t,i){e.preventDefault(),l.value=t,i&&V(i,t)}const{refs:M,updateRef:T}=la();A({VPaginationBtn:{color:f(a,"color"),border:f(a,"border"),density:f(a,"density"),size:f(a,"size"),variant:f(a,"variant"),rounded:f(a,"rounded"),elevation:f(a,"elevation")}});const z=b(()=>N.value.map((e,t)=>{const i=r=>T(r,t);if(typeof e=="string")return{isActive:!1,key:`ellipsis-${t}`,page:e,props:{ref:i,ellipsis:!0,icon:!0,disabled:!0}};{const r=e===l.value;return{isActive:r,key:e,page:C(e),props:{ref:i,ellipsis:!1,icon:!0,disabled:!!a.disabled||a.length<2,color:r?a.activeColor:a.color,ariaCurrent:r,ariaLabel:g(r?a.currentPageAriaLabel:a.pageAriaLabel,t+1),onClick:v=>y(v,e)}}}})),d=b(()=>{const e=!!a.disabled||l.value<=u.value,t=!!a.disabled||l.value>=u.value+s.value-1;return{first:a.showFirstLastPage?{icon:P.value?a.lastIcon:a.firstIcon,onClick:i=>y(i,u.value,"first"),disabled:e,ariaLabel:g(a.firstAriaLabel),ariaDisabled:e}:void 0,prev:{icon:P.value?a.nextIcon:a.prevIcon,onClick:i=>y(i,l.value-1,"prev"),disabled:e,ariaLabel:g(a.previousAriaLabel),ariaDisabled:e},next:{icon:P.value?a.prevIcon:a.nextIcon,onClick:i=>y(i,l.value+1,"next"),disabled:t,ariaLabel:g(a.nextAriaLabel),ariaDisabled:t},last:a.showFirstLastPage?{icon:P.value?a.firstIcon:a.lastIcon,onClick:i=>y(i,u.value+s.value-1,"last"),disabled:t,ariaLabel:g(a.lastAriaLabel),ariaDisabled:t}:void 0}});function p(){var e;const t=l.value-u.value;(e=M.value[t])==null||e.$el.focus()}function E(e){e.key===$.left&&!a.disabled&&l.value>a.start?(l.value=l.value-1,B(p)):e.key===$.right&&!a.disabled&&l.value<u.value+s.value-1&&(l.value=l.value+1,B(p))}return ia(()=>o(a.tag,{ref:F,class:["v-pagination",w.value],role:"navigation","aria-label":g(a.ariaLabel),onKeydown:E,"data-test":"v-pagination-root"},{default:()=>[o("ul",{class:"v-pagination__list"},[a.showFirstLastPage&&o("li",{key:"first",class:"v-pagination__first","data-test":"v-pagination-first"},[n.first?n.first(d.value.first):o(L,h({_as:"VPaginationBtn"},d.value.first),null)]),o("li",{key:"prev",class:"v-pagination__prev","data-test":"v-pagination-prev"},[n.prev?n.prev(d.value.prev):o(L,h({_as:"VPaginationBtn"},d.value.prev),null)]),z.value.map((e,t)=>o("li",{key:e.key,class:["v-pagination__item",{"v-pagination__item--is-active":e.isActive}],"data-test":"v-pagination-item"},[n.item?n.item(e):o(L,h({_as:"VPaginationBtn"},e.props),{default:()=>[e.page]})])),o("li",{key:"next",class:"v-pagination__next","data-test":"v-pagination-next"},[n.next?n.next(d.value.next):o(L,h({_as:"VPaginationBtn"},d.value.next),null)]),a.showFirstLastPage&&o("li",{key:"last",class:"v-pagination__last","data-test":"v-pagination-last"},[n.last?n.last(d.value.last):o(L,h({_as:"VPaginationBtn"},d.value.last),null)])])]})),{}}});export{sa as V};
