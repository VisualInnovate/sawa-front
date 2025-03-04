import{_ as le}from"./Ellipse2-b0842d90.js";import{m as ve,W as fe,q as p,l as he,u as ge,ac as ye,X as _e,ad as be,r as h,ae as we,o as n,d as u,e as a,f as i,g as c,i as E,L as ke,t as s,h as L,j as m,c as y}from"./main-bc2568df.js";const xe={class:"grid",style:{"max-height":"90vh !important",overflow:"scroll"}},Ve={class:"col-12"},$e=a("div",{class:"my-2"},null,-1),Ue={class:"shadow-xl"},Ce={class:"flex w-full justify-between align-items-center"},Se={class:"m-0 my-auto"},De={class:"block mt-2 md:mt-0 p-input-icon-left"},Le=a("i",{class:"pi pi-search"},null,-1),qe=["src"],Be={class:"flex align-items-center justify-content-center"},Te=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),Ie={key:0},Ne={class:""},Pe=["src"],je={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:le},Ee={key:2,class:"mt-1 mb-5 text-red-500"},Fe={class:"flex flex-column gap-2 py-1"},Me={class:"w-full text-right",for:"username"},Re={key:0,class:"mt-1 mb-5 text-red-500"},Ae={class:"flex flex-column gap-2 py-1"},ze={class:"w-full text-right",for:"username"},Oe={key:0,class:"mt-1 mb-5 text-red-500"},We={key:0,class:"flex flex-column gap-2"},Xe={class:"w-full text-right",for:"username"},Ge={key:0,class:"mt-1 mb-5 text-red-500"},He={key:1,class:"flex flex-column gap-2"},Je={class:"w-full text-right",for:"username"},Ke={key:0,class:"mt-1 mb-5 text-red-500"},Qe={key:2,class:"flex flex-column gap-2"},Ye={class:"w-full text-right",for:"username"},Ze={key:0,class:"mt-1 mb-5 text-red-500"},el={class:"flex flex-column gap-2 py-1"},ll={class:"w-full text-right",for:"username"},tl={key:0,class:"mt-1 mb-5 text-red-500"},al={class:"flex flex-column gap-2 py-1"},sl={class:"w-full text-right",for:"username"},ol={key:0,class:"mt-1 mb-5 text-red-500"},il={class:"flex flex-column gap-2 py-1"},dl={class:"w-full text-right",for:"username"},nl={key:0,class:"mt-1 mb-5 text-red-500"},ul={class:"flex flex-column gap-2 py-1"},rl={class:"w-full text-right",for:"username"},ml={key:0,class:"mt-1 mb-5 text-red-500"},pl={class:"flex-column gap-2 py-1 hidden"},cl={class:"w-full text-right",for:"username"},vl={key:0,class:"mt-1 mb-5 text-red-500"},fl={class:"w-full text-center"},hl={class:""},gl=["src"],yl={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:le},_l={key:2,class:"mt-1 mb-5 text-red-500"},bl={class:"flex flex-column gap-2 py-1"},wl={class:"w-full text-right",for:"username"},kl={key:0,class:"mt-1 mb-5 text-red-500"},xl={class:"flex flex-column gap-2 py-1"},Vl={class:"w-full text-right",for:"username"},$l={key:0,class:"mt-1 mb-5 text-red-500"},Ul={key:0,class:"flex flex-column gap-2"},Cl={class:"w-full text-right",for:"username"},Sl={key:0,class:"mt-1 mb-5 text-red-500"},Dl={key:1,class:"flex flex-column gap-2"},Ll={class:"w-full text-right",for:"username"},ql={key:0,class:"mt-1 mb-5 text-red-500"},Bl={key:2,class:"flex flex-column gap-2"},Tl={class:"w-full text-right",for:"username"},Il={key:0,class:"mt-1 mb-5 text-red-500"},Nl={class:"flex flex-column gap-2 py-1"},Pl={class:"w-full text-right",for:"username"},jl={key:0,class:"mt-1 mb-5 text-red-500"},El={class:"flex flex-column gap-2 py-1"},Fl={class:"w-full text-right",for:"username"},Ml={key:0,class:"mt-1 mb-5 text-red-500"},Rl={class:"flex flex-column gap-2 py-1"},Al={class:"w-full text-right",for:"username"},zl={key:0,class:"mt-1 mb-5 text-red-500"},Ol={class:"flex flex-column gap-2 py-1"},Wl={class:"w-full text-right",for:"username"},Xl={key:0,class:"mt-1 mb-5 text-red-500"},Gl={class:"flex-column gap-2 py-1 hidden"},Hl={class:"w-full text-right",for:"username"},Jl={key:0,class:"mt-1 mb-5 text-red-500"},Kl={class:"w-full text-center"},et={__name:"index",setup(Ql){const F=ve(),J=fe(),l=p({skills:[],department:[]}),{t:M}=he(),R=p([]),A=p([]),K=()=>[{name:M("driver"),id:1},{name:M("doctor"),id:2},{name:M("Evaluator"),id:5}],te=ge("doctor_id",Number),z=p({}),O=p(!0),Q=p({}),o=p(""),W=p(null);p(!1);const b=p(!1),X=p(""),Y=p(null),Z=p(null),q=p({}),B=p(!1),T=p(!1);ye(()=>{re()});const I=()=>{y.get("/api/doctors").then(e=>{W.value=e.data.doctors,O.value=!1}),y.post("/api/roles").then(e=>{O.value=!1,R.value=e.data.roles.data,console.log(W.value)}),y.get("/api/skills").then(e=>{A.value=e.data.data}),y.get("/api/department").then(e=>{z.value=e.data.data})},ae=e=>{te.value=e,J.push({name:"doctors-show"})};_e(()=>{I()});const se=e=>{J.push({name:"Employee-update",params:{id:e}})},oe=()=>{const e=new FormData;console.log(l.value.name),e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),l.value.spotter&&e.append("spotter",l.value.spotter),l.value.skills&&e.append("skills",l.value.skills),l.value.department&&e.append("department_id",l.value.department),e.append("type",l.value.type),y.post(`/api/users/${X.value}/edit`,e).then(t=>{console.log(t.data),I(),T.value=!T.value,F.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=p({})}).catch(t=>{o.value=t.response.data.errors})},ie=e=>{console.log(e),b.value=!0,X.value=e},ee=e=>{const t=e.target.files[0],f=new FileReader;f.readAsDataURL(t),f.onload=G=>{l.value.image=G.target.result,l.value.file=t,console.log(this.imageSrc)}},de=()=>{const e=new FormData;e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),l.value.spotter&&e.append("spotter",l.value.spotter),l.value.skills&&e.append("skills",l.value.skills),l.value.department&&e.append("department_id",l.value.department),e.append("type",l.value.type),y.post("/api/users/create",e).then(t=>{console.log(t.data),I(),B.value=!B.value,F.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=p({})}).catch(t=>{o.value=t.response.data.errors})},ne=()=>{y.delete(`/api/users/${X.value}/delete`).then(e=>{console.log(e.data),b.value=!1,I(),F.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},ue=()=>{Z.value.exportCSV()},re=()=>{q.value={global:{value:null,matchMode:be.CONTAINS}}};return(e,t)=>{const f=h("Button"),G=h("Toolbar"),me=h("Toast"),v=h("InputText"),_=h("Column"),pe=h("DataTable"),H=h("Dialog"),N=h("Dropdown"),P=h("MultiSelect"),ce=h("va-card"),j=we("can");return n(),u("div",xe,[a("div",Ve,[i(ce,{class:"card"},{default:c(()=>[i(G,{class:"mb-4 shadow-md"},{start:c(()=>[$e]),end:c(()=>[E(i(f,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=r=>ue(r))},null,8,["label"]),[[j,"doctor list"]])]),_:1}),i(me),a("div",Ue,[E((n(),ke(pe,{ref_key:"dt",ref:Z,selection:Y.value,"onUpdate:selection":t[2]||(t[2]=r=>Y.value=r),value:W.value,loading:O.value,"data-key":"id",paginator:!0,rows:5,filters:q.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:c(()=>[a("div",Ce,[a("h5",Se,s(e.$t("doctors")),1),a("div",null,[a("span",De,[Le,i(v,{modelValue:q.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=r=>q.value.global.value=r),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:c(()=>[i(_,{"selection-mode":"multiple","header-style":"width: 3rem"}),i(_,{field:"index",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:c(r=>[L(s(r.data.id),1)]),_:1},8,["header"]),i(_,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:c(r=>[L(s(r.data.name),1)]),_:1},8,["header"]),i(_,{field:"image",header:e.$t("personal_image"),sortable:!0,"header-style":"width:10%; min-width:12rem;",class:"ltr:text-justify"},{body:c(r=>[a("img",{class:"m-auto rounded-full",style:{width:"100px",height:"90px"},src:r.data.image},null,8,qe)]),_:1},8,["header"]),i(_,{field:"email",header:e.$t("email"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:c(r=>[L(s(r.data.email),1)]),_:1},8,["header"]),i(_,{"header-style":"min-width:10rem;"},{body:c(r=>[a("div",null,[E(i(f,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:g=>se(r.data.id)},null,8,["onClick"]),[[j,"user edit"]]),E(i(f,{icon:"pi pi-trash",class:"delete mt-2",onClick:g=>ie(r.data.id)},null,8,["onClick"]),[[j,"user create"]]),i(f,{icon:"pi pi-user",class:"show mt-2",onClick:g=>ae(r.data.id)},null,8,["onClick"])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[j,"doctor list"]]),i(H,{visible:b.value,"onUpdate:visible":t[4]||(t[4]=r=>b.value=r),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:c(()=>[i(f,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=r=>b.value=!1)},null,8,["label"]),i(f,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:ne},null,8,["label"])]),default:c(()=>[a("div",Be,[Te,Q.value?(n(),u("span",Ie,[L(s(e.$t("remove_item"))+" ",1),a("b",null,s(Q.value.first_name),1),L("?")])):m("",!0)])]),_:1},8,["visible","header"]),i(H,{visible:B.value,"onUpdate:visible":t[14]||(t[14]=r=>B.value=r),style:{width:"450px"},header:e.$t("users"),modal:!0},{default:c(()=>{var r,g,w,k,x,V,$,U,C,S,D;return[a("div",Ne,[a("div",null,[l.value.image?(n(),u("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:"https://sawa.sawa.academy/"+l.value.image},null,8,Pe)):(n(),u("img",je)),(r=o.value)!=null&&r.image?(n(),u("div",Ee,s(o.value.image[0]),1)):m("",!0)])]),a("div",Fe,[a("label",Me,s(e.$t("name")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[5]||(t[5]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=o.value)!=null&&g.name?(n(),u("div",Re,s(o.value.name[0]),1)):m("",!0)]),a("div",Ae,[a("label",ze,s(e.$t("type")),1),i(N,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[6]||(t[6]=d=>l.value.type=d),"option-value":"id",filter:"",options:K(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(w=o.value)!=null&&w.type?(n(),u("div",Oe,s(o.value.type[0]),1)):m("",!0)]),l.value.type==0||l.value.type==2?(n(),u("div",We,[a("label",Xe,s(e.$t("skill_name")),1),i(P,{modelValue:l.value.skills,"onUpdate:modelValue":t[7]||(t[7]=d=>l.value.skills=d),filter:"","option-value":"id",options:A.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(k=o.value)!=null&&k.permissions?(n(),u("div",Ge,s(o.value.permissions[0]),1)):m("",!0)])):m("",!0),l.value.type==0||l.value.type==2?(n(),u("div",He,[a("label",Je,s(e.$t("department")),1),i(P,{modelValue:l.value.department,"onUpdate:modelValue":t[8]||(t[8]=d=>l.value.department=d),filter:"","option-value":"id",options:z.value,optionLabel:"title",placeholder:e.$t("department"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(x=o.value)!=null&&x.permissions?(n(),u("div",Ke,s(o.value.permissions[0]),1)):m("",!0)])):m("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Qe,[a("label",Ye,s(e.$t("Spotter")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.spotter,"onUpdate:modelValue":t[9]||(t[9]=d=>l.value.spotter=d),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),(V=o.value)!=null&&V.permissions?(n(),u("div",Ze,s(o.value.permissions[0]),1)):m("",!0)])):m("",!0),a("div",el,[a("label",ll,s(e.$t("email")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[10]||(t[10]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),($=o.value)!=null&&$.email?(n(),u("div",tl,s(o.value.email[0]),1)):m("",!0)]),a("div",al,[a("label",sl,s(e.$t("title")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[11]||(t[11]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.title?(n(),u("div",ol,s(o.value.title[0]),1)):m("",!0)]),a("div",il,[a("label",dl,s(e.$t("password")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[12]||(t[12]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.password?(n(),u("div",nl,s(o.value.password[0]),1)):m("",!0)]),a("div",ul,[a("label",rl,s(e.$t("roles")),1),i(N,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[13]||(t[13]=d=>l.value.role=d),"option-value":"id",filter:"",options:R.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(S=o.value)!=null&&S.role?(n(),u("div",ml,s(o.value.role[0]),1)):m("",!0)]),a("div",pl,[a("label",cl,s(e.$t("personal_image")),1),i(v,{name:"file",ref:"file",onChange:ee,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(D=o.value)!=null&&D.image?(n(),u("div",vl,s(o.value.image[0]),1)):m("",!0)]),a("div",fl,[i(f,{onClick:de,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),i(H,{visible:T.value,"onUpdate:visible":t[24]||(t[24]=r=>T.value=r),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:c(()=>{var r,g,w,k,x,V,$,U,C,S,D;return[a("div",hl,[a("div",null,[l.value.image?(n(),u("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,gl)):(n(),u("img",yl)),(r=o.value)!=null&&r.image?(n(),u("div",_l,s(o.value.image[0]),1)):m("",!0)])]),a("div",bl,[a("label",wl,s(e.$t("name")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[15]||(t[15]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=o.value)!=null&&g.name?(n(),u("div",kl,s(o.value.name[0]),1)):m("",!0)]),a("div",xl,[a("label",Vl,s(e.$t("type")),1),i(N,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[16]||(t[16]=d=>l.value.type=d),"option-value":"id",filter:"",options:K(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(w=o.value)!=null&&w.type?(n(),u("div",$l,s(o.value.type[0]),1)):m("",!0)]),l.value.type==0||l.value.type==2?(n(),u("div",Ul,[a("label",Cl,s(e.$t("skill_name")),1),i(P,{modelValue:l.value.skills,"onUpdate:modelValue":t[17]||(t[17]=d=>l.value.skills=d),filter:"","option-value":"id",options:A.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(k=o.value)!=null&&k.skills?(n(),u("div",Sl,s(o.value.skills[0]),1)):m("",!0)])):m("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Dl,[a("label",Ll,s(e.$t("department")),1),i(P,{modelValue:l.value.department,"onUpdate:modelValue":t[18]||(t[18]=d=>l.value.department=d),filter:"","option-value":"id",options:z.value,optionLabel:"title",placeholder:e.$t("department"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(x=o.value)!=null&&x.permissions?(n(),u("div",ql,s(o.value.permissions[0]),1)):m("",!0)])):m("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Bl,[a("label",Tl,s(e.$t("Spotter")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.spotter,"onUpdate:modelValue":t[19]||(t[19]=d=>l.value.spotter=d),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),(V=o.value)!=null&&V.permissions?(n(),u("div",Il,s(o.value.permissions[0]),1)):m("",!0)])):m("",!0),a("div",Nl,[a("label",Pl,s(e.$t("email")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[20]||(t[20]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),($=o.value)!=null&&$.email?(n(),u("div",jl,s(o.value.email[0]),1)):m("",!0)]),a("div",El,[a("label",Fl,s(e.$t("title")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[21]||(t[21]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.title?(n(),u("div",Ml,s(o.value.title[0]),1)):m("",!0)]),a("div",Rl,[a("label",Al,s(e.$t("password")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[22]||(t[22]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.password?(n(),u("div",zl,s(o.value.password[0]),1)):m("",!0)]),a("div",Ol,[a("label",Wl,s(e.$t("roles")),1),i(N,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[23]||(t[23]=d=>l.value.role=d),"option-value":"id",filter:"",options:R.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(S=o.value)!=null&&S.role?(n(),u("div",Xl,s(o.value.role[0]),1)):m("",!0)]),a("div",Gl,[a("label",Hl,s(e.$t("personal_image")),1),i(v,{name:"file",ref:"file",onChange:ee,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(D=o.value)!=null&&D.image?(n(),u("div",Jl,s(o.value.image[0]),1)):m("",!0)]),a("div",Kl,[i(f,{onClick:oe,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{et as default};
