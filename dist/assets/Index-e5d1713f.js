import{a5 as z,Q as c,$ as B,o as m,f as N,x as l,q as e,W as P,R as r,X as T,i,a6 as U,T as $,a1 as F,a7 as A,h as n,e as p,F as g,z as x,t as f,G as y}from"./main-201c6ce7.js";import{u as D}from"./Users-f2efad25.js";import{V as u}from"./VCol-cc86538b.js";import{V as _}from"./VRow-9bf03622.js";import{V as E}from"./VPagination-ac983fb6.js";const W={__name:"Index",setup(q){const t=D(),v=z(),V=c([]),C=c([{text:"Id",value:"id",sortable:!1},{text:"Name",align:"start",sortable:!1,value:"name"},{text:"Actions",value:"actions",sortable:!1}]),k=c([5,10,20]),d=async()=>{await t.fetchRoles(),V.value=t.roles.map(R)},b=s=>{t.params.page=s,d()},I=s=>{t.params.size=s,t.params.page=1,d()},R=s=>({id:s.id,name:s.name,module:s.module}),h=s=>{v.push({name:"EditRole",params:{id:s}})},S=s=>{confirm("Are you sure you want to delete?")&&(t.deleteRole(s),d())};return B(()=>{d()}),(s,o)=>(m(),N(_,{align:"center",class:"list px-3 mx-auto"},{default:l(()=>[e(u,{cols:"12",sm:"8"},{default:l(()=>[e(P,{modelValue:r(t).params.keyword,"onUpdate:modelValue":o[0]||(o[0]=a=>r(t).params.keyword=a),label:"Search by Name",onKeyup:o[1]||(o[1]=a=>{s.page=1,d()})},null,8,["modelValue"])]),_:1}),e(u,{cols:"12",sm:"4"},{default:l(()=>[e(T,{color:"success",to:{name:"CreateRole"}},{default:l(()=>[i(" Create ")]),_:1})]),_:1}),e(u,{cols:"12",sm:"12"},{default:l(()=>[e(_,null,{default:l(()=>[e(u,{cols:"4",sm:"3"},{default:l(()=>[e(U,{modelValue:r(t).params.size,"onUpdate:modelValue":[o[2]||(o[2]=a=>r(t).params.size=a),I],items:k.value,label:"Items per Page"},null,8,["modelValue","items"])]),_:1}),e(u,{cols:"12",sm:"9"},{default:l(()=>[e(E,{rounded:"circle",modelValue:r(t).params.page,"onUpdate:modelValue":[o[3]||(o[3]=a=>r(t).params.page=a),b],length:r(t).params.totalPages,"total-visible":"7","next-icon":"mdi-menu-right","prev-icon":"mdi-menu-left"},null,8,["modelValue","length"])]),_:1})]),_:1})]),_:1}),e(u,{cols:"12",sm:"12"},{default:l(()=>[e($,{class:"mx-auto",tile:""},{default:l(()=>[e(F,null,{default:l(()=>[i("Roles")]),_:1}),e(A,null,{default:l(()=>[n("thead",null,[n("tr",null,[(m(!0),p(g,null,x(C.value,a=>(m(),p("th",{key:a.id},f(a.text),1))),128))])]),n("tbody",null,[(m(!0),p(g,null,x(V.value,a=>(m(),p("tr",{key:a.id},[n("td",null,f(a.id),1),n("td",null,f(a.name),1),n("td",null,[e(y,{small:"",color:"primary",class:"mr-2",onClick:w=>h(a.id)},{default:l(()=>[i("mdi-pencil")]),_:2},1032,["onClick"]),e(y,{small:"",color:"error",onClick:w=>S(a.id)},{default:l(()=>[i("mdi-delete")]),_:2},1032,["onClick"])])]))),128))])]),_:1})]),_:1})]),_:1})]),_:1}))}};export{W as default};
