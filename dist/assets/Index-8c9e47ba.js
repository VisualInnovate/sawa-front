import{a9 as ue,aa as re,T as c,ai as me,ab as ce,a2 as pe,ac as ve,l as h,ad as fe,o as u,e as r,h as a,x as i,y as p,w as T,f as he,t as s,i as k,q as m,aj as X,z as y}from"./main-14ffa114.js";const ge={class:"grid",style:{"max-height":"90vh !important",overflow:"scroll"}},be={class:"col-12"},ye={class:"my-2"},_e={class:"shadow-xl"},we={class:"flex w-full justify-between align-items-center"},ke={class:"m-0 my-auto"},xe={class:"block mt-2 md:mt-0 p-input-icon-left"},$e=a("i",{class:"pi pi-search"},null,-1),Ve=["src"],Ce={class:"flex align-items-center justify-content-center"},Ue=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),De={key:0},Se={class:""},qe=["src"],Le={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:X},Te={key:2,class:"mt-1 mb-5 text-red-500"},Be={class:"flex flex-column gap-2 py-1"},Ie={class:"w-full text-right",for:"username"},Pe={key:0,class:"mt-1 mb-5 text-red-500"},je={class:"flex flex-column gap-2 py-1"},Ne={class:"w-full text-right",for:"username"},Fe={key:0,class:"mt-1 mb-5 text-red-500"},Me={key:0,class:"flex flex-column gap-2"},Ee={class:"w-full text-right",for:"username"},Re={key:0,class:"mt-1 mb-5 text-red-500"},Ae={class:"flex flex-column gap-2 py-1"},ze={class:"w-full text-right",for:"username"},Oe={key:0,class:"mt-1 mb-5 text-red-500"},Ge={class:"flex flex-column gap-2 py-1"},He={class:"w-full text-right",for:"username"},Je={key:0,class:"mt-1 mb-5 text-red-500"},Ke={class:"flex flex-column gap-2 py-1"},Qe={class:"w-full text-right",for:"username"},We={key:0,class:"mt-1 mb-5 text-red-500"},Xe={class:"flex flex-column gap-2 py-1"},Ye={class:"w-full text-right",for:"username"},Ze={key:0,class:"mt-1 mb-5 text-red-500"},el={class:"flex-column gap-2 py-1 hidden"},ll={class:"w-full text-right",for:"username"},tl={key:0,class:"mt-1 mb-5 text-red-500"},al={class:"w-full text-center"},sl={class:""},ol=["src"],il={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:X},dl={key:2,class:"mt-1 mb-5 text-red-500"},nl={class:"flex flex-column gap-2 py-1"},ul={class:"w-full text-right",for:"username"},rl={key:0,class:"mt-1 mb-5 text-red-500"},ml={class:"flex flex-column gap-2 py-1"},cl={class:"w-full text-right",for:"username"},pl={key:0,class:"mt-1 mb-5 text-red-500"},vl={key:0,class:"flex flex-column gap-2"},fl={class:"w-full text-right",for:"username"},hl={key:0,class:"mt-1 mb-5 text-red-500"},gl={class:"flex flex-column gap-2 py-1"},bl={class:"w-full text-right",for:"username"},yl={key:0,class:"mt-1 mb-5 text-red-500"},_l={class:"flex flex-column gap-2 py-1"},wl={class:"w-full text-right",for:"username"},kl={key:0,class:"mt-1 mb-5 text-red-500"},xl={class:"flex flex-column gap-2 py-1"},$l={class:"w-full text-right",for:"username"},Vl={key:0,class:"mt-1 mb-5 text-red-500"},Cl={class:"flex flex-column gap-2 py-1"},Ul={class:"w-full text-right",for:"username"},Dl={key:0,class:"mt-1 mb-5 text-red-500"},Sl={class:"flex-column gap-2 py-1 hidden"},ql={class:"w-full text-right",for:"username"},Ll={key:0,class:"mt-1 mb-5 text-red-500"},Tl={class:"w-full text-center"},Pl={__name:"Index",setup(Bl){const E=ue();re();const l=c({}),{t:B}=me(),R=c([]),A=c([]),G=()=>[{name:B("driver"),id:1},{name:B("doctor"),id:2},{name:B("room_admin"),id:4},{name:B("Evaluator"),id:5}],I=c(!0),H=c({}),o=c(""),P=c(null);c(!1);const x=c(!1),j=c(""),J=c(null),K=c(null),N=c({}),_=c(!1),w=c(!1);ce(()=>{oe()});const F=()=>{y.post("/api/users").then(e=>{P.value=e.data.users.data,I.value=!1}),y.post("/api/roles").then(e=>{I.value=!1,R.value=e.data.roles.data,console.log(P.value)}),y.get("/api/skills").then(e=>{A.value=e.data.data})};pe(()=>{F()});const Y=e=>{y.get(`/api/users/${e}`).then(t=>{I.value=!1,l.value=t.data.user,l.value.role=t.data.user.roles.id,l.value.type=t.data.user.type,console.log(P.value)}),j.value=e,w.value=!w.value},Z=()=>{const e=new FormData;console.log(l.value.name),l.value.name&&l.value.email&&l.value.title&&l.value.password&&l.value.file&&l.value.role&&(e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role)),y.post(`/api/users/${j.value}/edit`,e).then(t=>{console.log(t.data),F(),w.value=!w.value,E.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=c({})}).catch(t=>{o.value=t.response.data.errors})},ee=()=>{l.value=c({}),_.value=!_.value},le=e=>{console.log(e),x.value=!0,j.value=e},Q=e=>{const t=e.target.files[0],v=new FileReader;v.readAsDataURL(t),v.onload=z=>{l.value.image=z.target.result,l.value.file=t,console.log(this.imageSrc)}},te=()=>{const e=new FormData;console.log(l.value.name),e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),l.value.skills&&e.append("skills",l.value.skills),e.append("type",l.value.type),y.post("/api/users/create",e).then(t=>{console.log(t.data),F(),_.value=!_.value,E.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=c({})}).catch(t=>{o.value=t.response.data.errors})},ae=()=>{y.delete(`/api/users/${j.value}/delete`).then(e=>{console.log(e.data),x.value=!1,F(),E.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},se=()=>{K.value.exportCSV()},oe=()=>{N.value={global:{value:null,matchMode:ve.CONTAINS}}};return(e,t)=>{const v=h("Button"),z=h("Toolbar"),ie=h("Toast"),f=h("InputText"),g=h("Column"),de=h("DataTable"),O=h("Dialog"),M=h("Dropdown"),W=h("MultiSelect"),ne=h("va-card"),$=fe("can");return u(),r("div",ge,[a("div",be,[i(ne,{class:"card"},{default:p(()=>[i(z,{class:"mb-4 shadow-md"},{start:p(()=>[a("div",ye,[T(i(v,{label:e.$t("user_add"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:ee},null,8,["label"]),[[$,"create user"]])])]),end:p(()=>[T(i(v,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=d=>se(d))},null,8,["label"]),[[$,"show user"]])]),_:1}),i(ie),a("div",_e,[T((u(),he(de,{ref_key:"dt",ref:K,selection:J.value,"onUpdate:selection":t[2]||(t[2]=d=>J.value=d),value:P.value,loading:I.value,"data-key":"id",paginator:!0,rows:5,filters:N.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:p(()=>[a("div",we,[a("h5",ke,s(e.$t("users")),1),a("div",null,[a("span",xe,[$e,i(f,{modelValue:N.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=d=>N.value.global.value=d),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:p(()=>[i(g,{"selection-mode":"multiple","header-style":"width: 3rem"}),i(g,{field:"index",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:p(d=>[k(s(d.data.id),1)]),_:1},8,["header"]),i(g,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:p(d=>[k(s(d.data.name),1)]),_:1},8,["header"]),i(g,{field:"image",header:e.$t("personal_image"),sortable:!0,"header-style":"width:10%; min-width:12rem;",class:"ltr:text-justify"},{body:p(d=>[a("img",{class:"m-auto rounded-full",style:{width:"100px",height:"100px"},src:d.data.image},null,8,Ve)]),_:1},8,["header"]),i(g,{field:"email",header:e.$t("email"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:p(d=>[k(s(d.data.email),1)]),_:1},8,["header"]),i(g,{field:"title",header:e.$t("title"),sortable:!0,"header-style":"width:14%; min-width:11rem;",class:"ltr:text-justify"},{body:p(d=>[k(s(d.data.title),1)]),_:1},8,["header"]),i(g,{"header-style":"min-width:10rem;"},{body:p(d=>[a("div",null,[T(i(v,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:b=>Y(d.data.id)},null,8,["onClick"]),[[$,"update user"]]),T(i(v,{icon:"pi pi-trash",class:"delete mt-2",onClick:b=>le(d.data.id)},null,8,["onClick"]),[[$,"create user"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[$,"show user"]]),i(O,{visible:x.value,"onUpdate:visible":t[4]||(t[4]=d=>x.value=d),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:p(()=>[i(v,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=d=>x.value=!1)},null,8,["label"]),i(v,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:ae},null,8,["label"])]),default:p(()=>[a("div",Ce,[Ue,H.value?(u(),r("span",De,[k(s(e.$t("remove_item"))+" ",1),a("b",null,s(H.value.first_name),1),k("?")])):m("",!0)])]),_:1},8,["visible","header"]),i(O,{visible:_.value,"onUpdate:visible":t[12]||(t[12]=d=>_.value=d),style:{width:"450px"},header:e.$t("users"),modal:!0},{default:p(()=>{var d,b,V,C,U,D,S,q,L;return[a("div",Se,[a("div",null,[l.value.image?(u(),r("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,qe)):(u(),r("img",Le)),(d=o.value)!=null&&d.image?(u(),r("div",Te,s(o.value.image[0]),1)):m("",!0)])]),a("div",Be,[a("label",Ie,s(e.$t("name")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[5]||(t[5]=n=>l.value.name=n),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(b=o.value)!=null&&b.name?(u(),r("div",Pe,s(o.value.name[0]),1)):m("",!0)]),a("div",je,[a("label",Ne,s(e.$t("type")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[6]||(t[6]=n=>l.value.type=n),"option-value":"id",filter:"",options:G(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(V=o.value)!=null&&V.type?(u(),r("div",Fe,s(o.value.type[0]),1)):m("",!0)]),l.value.type==0||l.value.type==2?(u(),r("div",Me,[a("label",Ee,s(e.$t("skill_name")),1),i(W,{modelValue:l.value.skills,"onUpdate:modelValue":t[7]||(t[7]=n=>l.value.skills=n),filter:"","option-value":"id",options:A.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(C=o.value)!=null&&C.permissions?(u(),r("div",Re,s(o.value.permissions[0]),1)):m("",!0)])):m("",!0),a("div",Ae,[a("label",ze,s(e.$t("email")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[8]||(t[8]=n=>l.value.email=n),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.email?(u(),r("div",Oe,s(o.value.email[0]),1)):m("",!0)]),a("div",Ge,[a("label",He,s(e.$t("title")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[9]||(t[9]=n=>l.value.title=n),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(D=o.value)!=null&&D.title?(u(),r("div",Je,s(o.value.title[0]),1)):m("",!0)]),a("div",Ke,[a("label",Qe,s(e.$t("password")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[10]||(t[10]=n=>l.value.password=n),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(S=o.value)!=null&&S.password?(u(),r("div",We,s(o.value.password[0]),1)):m("",!0)]),a("div",Xe,[a("label",Ye,s(e.$t("roles")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[11]||(t[11]=n=>l.value.role=n),"option-value":"id",filter:"",options:R.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(q=o.value)!=null&&q.role?(u(),r("div",Ze,s(o.value.role[0]),1)):m("",!0)]),a("div",el,[a("label",ll,s(e.$t("personal_image")),1),i(f,{name:"file",ref:"file",onChange:Q,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(L=o.value)!=null&&L.image?(u(),r("div",tl,s(o.value.image[0]),1)):m("",!0)]),a("div",al,[i(v,{onClick:te,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),i(O,{visible:w.value,"onUpdate:visible":t[20]||(t[20]=d=>w.value=d),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:p(()=>{var d,b,V,C,U,D,S,q,L;return[a("div",sl,[a("div",null,[l.value.image?(u(),r("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,ol)):(u(),r("img",il)),(d=o.value)!=null&&d.image?(u(),r("div",dl,s(o.value.image[0]),1)):m("",!0)])]),a("div",nl,[a("label",ul,s(e.$t("name")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[13]||(t[13]=n=>l.value.name=n),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(b=o.value)!=null&&b.name?(u(),r("div",rl,s(o.value.name[0]),1)):m("",!0)]),a("div",ml,[a("label",cl,s(e.$t("type")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[14]||(t[14]=n=>l.value.type=n),"option-value":"id",filter:"",options:G(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(V=o.value)!=null&&V.type?(u(),r("div",pl,s(o.value.type[0]),1)):m("",!0)]),l.value.type==0||l.value.type==2?(u(),r("div",vl,[a("label",fl,s(e.$t("skill_name")),1),i(W,{modelValue:l.value.skills,"onUpdate:modelValue":t[15]||(t[15]=n=>l.value.skills=n),filter:"","option-value":"id",options:A.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(C=o.value)!=null&&C.permissions?(u(),r("div",hl,s(o.value.permissions[0]),1)):m("",!0)])):m("",!0),a("div",gl,[a("label",bl,s(e.$t("email")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[16]||(t[16]=n=>l.value.email=n),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.email?(u(),r("div",yl,s(o.value.email[0]),1)):m("",!0)]),a("div",_l,[a("label",wl,s(e.$t("title")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[17]||(t[17]=n=>l.value.title=n),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(D=o.value)!=null&&D.title?(u(),r("div",kl,s(o.value.title[0]),1)):m("",!0)]),a("div",xl,[a("label",$l,s(e.$t("password")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[18]||(t[18]=n=>l.value.password=n),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(S=o.value)!=null&&S.password?(u(),r("div",Vl,s(o.value.password[0]),1)):m("",!0)]),a("div",Cl,[a("label",Ul,s(e.$t("roles")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[19]||(t[19]=n=>l.value.role=n),"option-value":"id",filter:"",options:R.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(q=o.value)!=null&&q.role?(u(),r("div",Dl,s(o.value.role[0]),1)):m("",!0)]),a("div",Sl,[a("label",ql,s(e.$t("personal_image")),1),i(f,{name:"file",ref:"file",onChange:Q,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(L=o.value)!=null&&L.image?(u(),r("div",Ll,s(o.value.image[0]),1)):m("",!0)]),a("div",Tl,[i(v,{onClick:Z,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Pl as default};
