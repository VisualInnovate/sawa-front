import{a9 as ue,aa as re,T as c,ai as me,ab as ce,a2 as pe,ac as ve,l as h,ad as fe,o as u,e as r,h as a,x as i,y as v,w as L,f as he,t as s,i as T,q as m,aj as X,z as y}from"./main-fa6873cf.js";const ge={class:"grid",style:{"max-height":"90vh !important",overflow:"scroll"}},ye={class:"col-12"},_e={class:"my-2"},be={class:"shadow-xl"},we={class:"flex w-full justify-between align-items-center"},ke={class:"m-0 my-auto"},xe={class:"block mt-2 md:mt-0 p-input-icon-left"},$e=a("i",{class:"pi pi-search"},null,-1),Ve=["src"],Ce={class:"flex align-items-center justify-content-center"},Ue=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),De={key:0},Se={class:""},qe=["src"],Le={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:X},Te={key:2,class:"mt-1 mb-5 text-red-500"},Be={class:"flex flex-column gap-2 py-1"},Ie={class:"w-full text-right",for:"username"},Pe={key:0,class:"mt-1 mb-5 text-red-500"},Ne={class:"flex flex-column gap-2 py-1"},je={class:"w-full text-right",for:"username"},Fe={key:0,class:"mt-1 mb-5 text-red-500"},Me={key:0,class:"flex flex-column gap-2"},Ee={class:"w-full text-right",for:"username"},Re={key:0,class:"mt-1 mb-5 text-red-500"},Ae={class:"flex flex-column gap-2 py-1"},ze={class:"w-full text-right",for:"username"},Oe={key:0,class:"mt-1 mb-5 text-red-500"},Ge={class:"flex flex-column gap-2 py-1"},He={class:"w-full text-right",for:"username"},Je={key:0,class:"mt-1 mb-5 text-red-500"},Ke={class:"flex flex-column gap-2 py-1"},Qe={class:"w-full text-right",for:"username"},We={key:0,class:"mt-1 mb-5 text-red-500"},Xe={class:"flex flex-column gap-2 py-1"},Ye={class:"w-full text-right",for:"username"},Ze={key:0,class:"mt-1 mb-5 text-red-500"},el={class:"flex-column gap-2 py-1 hidden"},ll={class:"w-full text-right",for:"username"},tl={key:0,class:"mt-1 mb-5 text-red-500"},al={class:"w-full text-center"},sl={class:""},ol=["src"],il={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:X},nl={key:2,class:"mt-1 mb-5 text-red-500"},dl={class:"flex flex-column gap-2 py-1"},ul={class:"w-full text-right",for:"username"},rl={key:0,class:"mt-1 mb-5 text-red-500"},ml={class:"flex flex-column gap-2 py-1"},cl={class:"w-full text-right",for:"username"},pl={key:0,class:"mt-1 mb-5 text-red-500"},vl={key:0,class:"flex flex-column gap-2"},fl={class:"w-full text-right",for:"username"},hl={key:0,class:"mt-1 mb-5 text-red-500"},gl={class:"flex flex-column gap-2 py-1"},yl={class:"w-full text-right",for:"username"},_l={key:0,class:"mt-1 mb-5 text-red-500"},bl={class:"flex flex-column gap-2 py-1"},wl={class:"w-full text-right",for:"username"},kl={key:0,class:"mt-1 mb-5 text-red-500"},xl={class:"flex flex-column gap-2 py-1"},$l={class:"w-full text-right",for:"username"},Vl={key:0,class:"mt-1 mb-5 text-red-500"},Cl={class:"flex flex-column gap-2 py-1"},Ul={class:"w-full text-right",for:"username"},Dl={key:0,class:"mt-1 mb-5 text-red-500"},Sl={class:"flex-column gap-2 py-1 hidden"},ql={class:"w-full text-right",for:"username"},Ll={key:0,class:"mt-1 mb-5 text-red-500"},Tl={class:"w-full text-center"},Pl={__name:"Index",setup(Bl){const M=ue();re();const l=c({}),{t:E}=me(),R=c([]),A=c([]),G=()=>[{name:E("driver"),id:1},{name:E("doctor"),id:2},{name:E("Evaluator"),id:5}],B=c(!0),H=c({}),o=c(""),I=c(null);c(!1);const k=c(!1),P=c(""),J=c(null),K=c(null),N=c({}),_=c(!1),b=c(!1);ce(()=>{oe()});const j=()=>{y.post("/api/users").then(e=>{I.value=e.data.users.data,B.value=!1}),y.post("/api/roles").then(e=>{B.value=!1,R.value=e.data.roles.data,console.log(I.value)}),y.get("/api/skills").then(e=>{A.value=e.data.data})};pe(()=>{j()});const Y=e=>{y.get(`/api/users/${e}`).then(t=>{B.value=!1,l.value=t.data.user,l.value.role=t.data.user.roles.id,l.value.type=t.data.user.type;for(let p=0;p<t.data.role.permissions.length;p++)t.data.role.permissions[p].id,role.value.permissions.push(t.data.role.permissions[p].id);console.log(I.value)}),P.value=e,b.value=!b.value},Z=()=>{const e=new FormData;console.log(l.value.name),e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),l.value.skills&&e.append("skills",l.value.skills),e.append("type",l.value.type),y.post(`/api/users/${P.value}/edit`,e).then(t=>{console.log(t.data),j(),b.value=!b.value,M.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=c({})}).catch(t=>{o.value=t.response.data.errors})},ee=()=>{l.value=c({}),_.value=!_.value},le=e=>{console.log(e),k.value=!0,P.value=e},Q=e=>{const t=e.target.files[0],p=new FileReader;p.readAsDataURL(t),p.onload=z=>{l.value.image=z.target.result,l.value.file=t,console.log(this.imageSrc)}},te=()=>{const e=new FormData;console.log(l.value.name),e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),l.value.skills&&e.append("skills",l.value.skills),e.append("type",l.value.type),y.post("/api/users/create",e).then(t=>{console.log(t.data),j(),_.value=!_.value,M.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=c({})}).catch(t=>{o.value=t.response.data.errors})},ae=()=>{y.delete(`/api/users/${P.value}/delete`).then(e=>{console.log(e.data),k.value=!1,j(),M.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},se=()=>{K.value.exportCSV()},oe=()=>{N.value={global:{value:null,matchMode:ve.CONTAINS}}};return(e,t)=>{const p=h("Button"),z=h("Toolbar"),ie=h("Toast"),f=h("InputText"),w=h("Column"),ne=h("DataTable"),O=h("Dialog"),F=h("Dropdown"),W=h("MultiSelect"),de=h("va-card"),x=fe("can");return u(),r("div",ge,[a("div",ye,[i(de,{class:"card"},{default:v(()=>[i(z,{class:"mb-4 shadow-md"},{start:v(()=>[a("div",_e,[L(i(p,{label:e.$t("user_add"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:ee},null,8,["label"]),[[x,"create user"]])])]),end:v(()=>[L(i(p,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=n=>se(n))},null,8,["label"]),[[x,"show user"]])]),_:1}),i(ie),a("div",be,[L((u(),he(ne,{ref_key:"dt",ref:K,selection:J.value,"onUpdate:selection":t[2]||(t[2]=n=>J.value=n),value:I.value,loading:B.value,"data-key":"id",paginator:!0,rows:5,filters:N.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:v(()=>[a("div",we,[a("h5",ke,s(e.$t("users")),1),a("div",null,[a("span",xe,[$e,i(f,{modelValue:N.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=n=>N.value.global.value=n),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:v(()=>[i(w,{"selection-mode":"multiple","header-style":"width: 3rem"}),i(w,{field:"index",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:v(n=>[T(s(n.data.id),1)]),_:1},8,["header"]),i(w,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:v(n=>[T(s(n.data.name),1)]),_:1},8,["header"]),i(w,{field:"image",header:e.$t("personal_image"),sortable:!0,"header-style":"width:10%; min-width:12rem;",class:"ltr:text-justify"},{body:v(n=>[a("img",{class:"m-auto rounded-full",style:{width:"100px",height:"100px"},src:n.data.image},null,8,Ve)]),_:1},8,["header"]),i(w,{field:"email",header:e.$t("email"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:v(n=>[T(s(n.data.email),1)]),_:1},8,["header"]),i(w,{"header-style":"min-width:10rem;"},{body:v(n=>[a("div",null,[L(i(p,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:g=>Y(n.data.id)},null,8,["onClick"]),[[x,"update user"]]),L(i(p,{icon:"pi pi-trash",class:"delete mt-2",onClick:g=>le(n.data.id)},null,8,["onClick"]),[[x,"create user"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[x,"show user"]]),i(O,{visible:k.value,"onUpdate:visible":t[4]||(t[4]=n=>k.value=n),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:v(()=>[i(p,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=n=>k.value=!1)},null,8,["label"]),i(p,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:ae},null,8,["label"])]),default:v(()=>[a("div",Ce,[Ue,H.value?(u(),r("span",De,[T(s(e.$t("remove_item"))+" ",1),a("b",null,s(H.value.first_name),1),T("?")])):m("",!0)])]),_:1},8,["visible","header"]),i(O,{visible:_.value,"onUpdate:visible":t[12]||(t[12]=n=>_.value=n),style:{width:"450px"},header:e.$t("users"),modal:!0},{default:v(()=>{var n,g,$,V,C,U,D,S,q;return[a("div",Se,[a("div",null,[l.value.image?(u(),r("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,qe)):(u(),r("img",Le)),(n=o.value)!=null&&n.image?(u(),r("div",Te,s(o.value.image[0]),1)):m("",!0)])]),a("div",Be,[a("label",Ie,s(e.$t("name")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[5]||(t[5]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=o.value)!=null&&g.name?(u(),r("div",Pe,s(o.value.name[0]),1)):m("",!0)]),a("div",Ne,[a("label",je,s(e.$t("type")),1),i(F,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[6]||(t[6]=d=>l.value.type=d),"option-value":"id",filter:"",options:G(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),($=o.value)!=null&&$.type?(u(),r("div",Fe,s(o.value.type[0]),1)):m("",!0)]),l.value.type==0||l.value.type==2?(u(),r("div",Me,[a("label",Ee,s(e.$t("skill_name")),1),i(W,{modelValue:l.value.skills,"onUpdate:modelValue":t[7]||(t[7]=d=>l.value.skills=d),filter:"","option-value":"id",options:A.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(V=o.value)!=null&&V.permissions?(u(),r("div",Re,s(o.value.permissions[0]),1)):m("",!0)])):m("",!0),a("div",Ae,[a("label",ze,s(e.$t("email")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[8]||(t[8]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.email?(u(),r("div",Oe,s(o.value.email[0]),1)):m("",!0)]),a("div",Ge,[a("label",He,s(e.$t("title")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[9]||(t[9]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.title?(u(),r("div",Je,s(o.value.title[0]),1)):m("",!0)]),a("div",Ke,[a("label",Qe,s(e.$t("password")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[10]||(t[10]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(D=o.value)!=null&&D.password?(u(),r("div",We,s(o.value.password[0]),1)):m("",!0)]),a("div",Xe,[a("label",Ye,s(e.$t("roles")),1),i(F,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[11]||(t[11]=d=>l.value.role=d),"option-value":"id",filter:"",options:R.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(S=o.value)!=null&&S.role?(u(),r("div",Ze,s(o.value.role[0]),1)):m("",!0)]),a("div",el,[a("label",ll,s(e.$t("personal_image")),1),i(f,{name:"file",ref:"file",onChange:Q,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(q=o.value)!=null&&q.image?(u(),r("div",tl,s(o.value.image[0]),1)):m("",!0)]),a("div",al,[i(p,{onClick:te,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),i(O,{visible:b.value,"onUpdate:visible":t[20]||(t[20]=n=>b.value=n),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:v(()=>{var n,g,$,V,C,U,D,S,q;return[a("div",sl,[a("div",null,[l.value.image?(u(),r("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,ol)):(u(),r("img",il)),(n=o.value)!=null&&n.image?(u(),r("div",nl,s(o.value.image[0]),1)):m("",!0)])]),a("div",dl,[a("label",ul,s(e.$t("name")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[13]||(t[13]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=o.value)!=null&&g.name?(u(),r("div",rl,s(o.value.name[0]),1)):m("",!0)]),a("div",ml,[a("label",cl,s(e.$t("type")),1),i(F,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[14]||(t[14]=d=>l.value.type=d),"option-value":"id",filter:"",options:G(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),($=o.value)!=null&&$.type?(u(),r("div",pl,s(o.value.type[0]),1)):m("",!0)]),l.value.type==0||l.value.type==2?(u(),r("div",vl,[a("label",fl,s(e.$t("skill_name")),1),i(W,{modelValue:l.value.skills,"onUpdate:modelValue":t[15]||(t[15]=d=>l.value.skills=d),filter:"","option-value":"id",options:A.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(V=o.value)!=null&&V.permissions?(u(),r("div",hl,s(o.value.permissions[0]),1)):m("",!0)])):m("",!0),a("div",gl,[a("label",yl,s(e.$t("email")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[16]||(t[16]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.email?(u(),r("div",_l,s(o.value.email[0]),1)):m("",!0)]),a("div",bl,[a("label",wl,s(e.$t("title")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[17]||(t[17]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.title?(u(),r("div",kl,s(o.value.title[0]),1)):m("",!0)]),a("div",xl,[a("label",$l,s(e.$t("password")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[18]||(t[18]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(D=o.value)!=null&&D.password?(u(),r("div",Vl,s(o.value.password[0]),1)):m("",!0)]),a("div",Cl,[a("label",Ul,s(e.$t("roles")),1),i(F,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[19]||(t[19]=d=>l.value.role=d),"option-value":"id",filter:"",options:R.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(S=o.value)!=null&&S.role?(u(),r("div",Dl,s(o.value.role[0]),1)):m("",!0)]),a("div",Sl,[a("label",ql,s(e.$t("personal_image")),1),i(f,{name:"file",ref:"file",onChange:Q,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(q=o.value)!=null&&q.image?(u(),r("div",Ll,s(o.value.image[0]),1)):m("",!0)]),a("div",Tl,[i(p,{onClick:Z,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Pl as default};
