import{P,Q as g,R as z,o as r,x as V,w as s,f as t,Z as T,T as o,$ as D,h as f,t as n,V as _,e as u,g as C,d as m,F as b,B as v,ae as F,X as M,a4 as A,af as E,J as h}from"./main-ddc1ad81.js";import{u as j}from"./Users-c86a6741.js";import{V as c,a as x}from"./VRow-8bba909f.js";import{V as J}from"./VPagination-08dfa456.js";const K=["value"],L={key:1,class:"d-block"},H={__name:"RolesUsers",setup(Q){const a=j(),y=P(),k=g([]),U=g([{text:"Id",value:"id",sortable:!1},{text:"Name",align:"start",sortable:!1,value:"name"},{text:"Email",align:"start",sortable:!1,value:"email"},{text:"Role",align:"start",sortable:!1,value:"roles"},{text:"Actions",value:"actions",sortable:!1}]),I=g([5,10,20]),p=async()=>{await a.fetchUsers(),k.value=a.users.map($)},R=l=>{a.params.page=l,p()},S=l=>{a.params.size=l,a.params.page=1,p()},$=l=>({id:l.id,name:l.name,email:l.email,role:l.roles[0]}),w=l=>{y.push({name:"UserRole",params:{id:l}})},B=l=>{y.push({name:"UserRoleDelete",params:{id:l}})};return z(()=>{p()}),(l,d)=>(r(),V(x,{align:"center",class:"list px-3 mx-auto"},{default:s(()=>[t(c,{cols:"12",sm:"8"},{default:s(()=>[t(T,{modelValue:o(a).params.keyword,"onUpdate:modelValue":d[0]||(d[0]=e=>o(a).params.keyword=e),label:"Search by Name",onKeyup:d[1]||(d[1]=e=>{l.page=1,p()})},null,8,["modelValue"])]),_:1}),t(c,{cols:"12",sm:"4"},{default:s(()=>[t(D,{color:"success",to:{name:"CreateUser"}},{default:s(()=>[f(n(l.$t("create_button")),1)]),_:1})]),_:1}),t(c,{cols:"12",sm:"12"},{default:s(()=>[o(a).successMsg?(r(),V(_,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close")},{default:s(()=>[u("small",null,n(o(a).successMsg),1)]),_:1},8,["close-label"])):C("",!0),o(a).errors.length!==0?(r(),V(_,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close")},{default:s(()=>[typeof o(a).errors=="object"?(r(!0),m(b,{key:0},v(o(a).errors,(e,i)=>(r(),m("small",{class:"d-block",value:i,key:i},n(e),9,K))),128)):(r(),m("small",L,n(o(a).errors),1))]),_:1},8,["close-label"])):C("",!0),t(x,null,{default:s(()=>[t(c,{cols:"4",sm:"3"},{default:s(()=>[t(F,{modelValue:o(a).params.size,"onUpdate:modelValue":[d[2]||(d[2]=e=>o(a).params.size=e),S],items:I.value,label:"Items per Page"},null,8,["modelValue","items"])]),_:1}),t(c,{cols:"12",sm:"9"},{default:s(()=>[t(J,{rounded:"circle",modelValue:o(a).params.page,"onUpdate:modelValue":[d[3]||(d[3]=e=>o(a).params.page=e),R],length:o(a).params.totalPages,"total-visible":"7","next-icon":"mdi-menu-right","prev-icon":"mdi-menu-left"},null,8,["modelValue","length"])]),_:1})]),_:1})]),_:1}),t(c,{cols:"12",sm:"12"},{default:s(()=>[t(M,{class:"mx-auto",tile:""},{default:s(()=>[t(A,null,{default:s(()=>[f("Users")]),_:1}),t(E,null,{default:s(()=>[u("thead",null,[u("tr",null,[(r(!0),m(b,null,v(U.value,e=>(r(),m("th",{key:e.id},n(e.text),1))),128))])]),u("tbody",null,[(r(!0),m(b,null,v(k.value,e=>{var i;return r(),m("tr",{key:e.id},[u("td",null,n(e.id),1),u("td",null,n(e.name),1),u("td",null,n(e.email),1),u("td",null,n((i=e.role)==null?void 0:i.name),1),u("td",null,[t(h,{small:"",color:"primary",class:"mr-2",onClick:N=>w(e.id)},{default:s(()=>[f("mdi-pencil")]),_:2},1032,["onClick"]),t(h,{small:"",color:"error",onClick:N=>B(e.id)},{default:s(()=>[f("mdi-delete")]),_:2},1032,["onClick"])])])}),128))])]),_:1})]),_:1})]),_:1})]),_:1}))}};export{H as default};
