import{ap as B,I as g,ah as P,o as r,x as V,w as s,f as t,ac as T,L as o,ad as D,h as f,t as n,a1 as _,e as u,g as h,d as m,F as b,z as v,au as F,aa as M,aj as j,av as A,a6 as C}from"./main-91c6b099.js";import{u as E}from"./Users-6c22000b.js";import{V as c,a as x}from"./VRow-54c6b1f0.js";import{V as L}from"./VPagination-24a796aa.js";const K=["value"],q={key:1,class:"d-block"},W={__name:"RolesUsers",setup(G){const a=E(),y=B(),k=g([]),U=g([{text:"Id",value:"id",sortable:!1},{text:"Name",align:"start",sortable:!1,value:"name"},{text:"Email",align:"start",sortable:!1,value:"email"},{text:"Role",align:"start",sortable:!1,value:"roles"},{text:"Actions",value:"actions",sortable:!1}]),I=g([5,10,20]),p=async()=>{await a.fetchUsers(),k.value=a.users.map(z)},S=l=>{a.params.page=l,p()},w=l=>{a.params.size=l,a.params.page=1,p()},z=l=>({id:l.id,name:l.name,email:l.email,role:l.roles[0]}),N=l=>{y.push({name:"UserRole",params:{id:l}})},R=l=>{y.push({name:"UserRoleDelete",params:{id:l}})};return P(()=>{p()}),(l,d)=>(r(),V(x,{align:"center",class:"list px-3 mx-auto"},{default:s(()=>[t(c,{cols:"12",sm:"8"},{default:s(()=>[t(T,{modelValue:o(a).params.keyword,"onUpdate:modelValue":d[0]||(d[0]=e=>o(a).params.keyword=e),label:"Search by Name",onKeyup:d[1]||(d[1]=e=>{l.page=1,p()})},null,8,["modelValue"])]),_:1}),t(c,{cols:"12",sm:"4"},{default:s(()=>[t(D,{color:"success",to:{name:"CreateUser"}},{default:s(()=>[f(n(l.$t("create_button")),1)]),_:1})]),_:1}),t(c,{cols:"12",sm:"12"},{default:s(()=>[o(a).successMsg?(r(),V(_,{key:0,class:"custom-alert-class",type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close")},{default:s(()=>[u("small",null,n(o(a).successMsg),1)]),_:1},8,["close-label"])):h("",!0),o(a).errors.length!==0?(r(),V(_,{key:1,class:"custom-alert-class",type:"error",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":l.$t("close")},{default:s(()=>[typeof o(a).errors=="object"?(r(!0),m(b,{key:0},v(o(a).errors,(e,i)=>(r(),m("small",{class:"d-block",value:i,key:i},n(e),9,K))),128)):(r(),m("small",q,n(o(a).errors),1))]),_:1},8,["close-label"])):h("",!0),t(x,null,{default:s(()=>[t(c,{cols:"4",sm:"3"},{default:s(()=>[t(F,{modelValue:o(a).params.size,"onUpdate:modelValue":[d[2]||(d[2]=e=>o(a).params.size=e),w],items:I.value,label:"Items per Page"},null,8,["modelValue","items"])]),_:1}),t(c,{cols:"12",sm:"9"},{default:s(()=>[t(L,{rounded:"circle",modelValue:o(a).params.page,"onUpdate:modelValue":[d[3]||(d[3]=e=>o(a).params.page=e),S],length:o(a).params.totalPages,"total-visible":"7","next-icon":"mdi-menu-right","prev-icon":"mdi-menu-left"},null,8,["modelValue","length"])]),_:1})]),_:1})]),_:1}),t(c,{cols:"12",sm:"12"},{default:s(()=>[t(M,{class:"mx-auto",tile:""},{default:s(()=>[t(j,null,{default:s(()=>[f("Users")]),_:1}),t(A,null,{default:s(()=>[u("thead",null,[u("tr",null,[(r(!0),m(b,null,v(U.value,e=>(r(),m("th",{key:e.id},n(e.text),1))),128))])]),u("tbody",null,[(r(!0),m(b,null,v(k.value,e=>{var i;return r(),m("tr",{key:e.id},[u("td",null,n(e.id),1),u("td",null,n(e.name),1),u("td",null,n(e.email),1),u("td",null,n((i=e.role)==null?void 0:i.name),1),u("td",null,[t(C,{small:"",color:"primary",class:"mr-2",onClick:$=>N(e.id)},{default:s(()=>[f("mdi-pencil")]),_:2},1032,["onClick"]),t(C,{small:"",color:"error",onClick:$=>R(e.id)},{default:s(()=>[f("mdi-delete")]),_:2},1032,["onClick"])])])}),128))])]),_:1})]),_:1})]),_:1})]),_:1}))}};export{W as default};