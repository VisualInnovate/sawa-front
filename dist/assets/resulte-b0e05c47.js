import{q as r,_ as m,S as h,o as p,e as u,h as c,p as f,P as g,Q as v}from"./main-92f2b8a8.js";const d="YOUR_API_KEY_HERE",s="https://api.pdffiller.com/v1",_={uploadDocument(e){const o=new FormData;return o.append("file",e),r.post(`${s}/document`,o,{headers:{"Content-Type":"multipart/form-data",Authorization:`Bearer ${d}`}})},getDocument(e){return r.get(`${s}/document/${e}`,{headers:{Authorization:`Bearer ${d}`}})},editDocument(e){return r.get(`${s}/document/${e}/edit`,{headers:{Authorization:`Bearer ${d}`}})}};const U={setup(){const e=h(null);return{documentUrl:e,handleFileUpload:async i=>{const t=i.target.files[0];if(t)try{const l=(await _.uploadDocument(t)).data.document_id,n=await _.editDocument(l);e.value=n.data.edit_url}catch(a){console.error("Error uploading or editing document:",a)}}}}},y=e=>(g("data-v-af532be5"),e=e(),v(),e),D={class:"pdf-editor"},$=y(()=>c("h1",null,"PDF Editor",-1)),F={key:0},x=["src"];function B(e,o,i,t,a,l){return p(),u("div",D,[$,c("input",{type:"file",onChange:o[0]||(o[0]=(...n)=>t.handleFileUpload&&t.handleFileUpload(...n))},null,32),t.documentUrl?(p(),u("div",F,[c("iframe",{src:t.documentUrl,width:"100%",height:"500px"},null,8,x)])):f("",!0)])}const I=m(U,[["render",B],["__scopeId","data-v-af532be5"]]);export{I as default};
