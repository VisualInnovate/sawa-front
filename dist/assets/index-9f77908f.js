import{aa as ve,ab as fe,T as c,aj as he,u as ge,ac as ye,a3 as _e,ad as be,r as h,ae as we,o as n,d as u,e as a,f as i,w as v,i as E,x as ke,t as s,h as q,g as p,ak as ee,c as y}from"./main-721a6e74.js";const xe={class:"grid",style:{"max-height":"90vh !important",overflow:"scroll"}},Ve={class:"col-12"},$e=a("div",{class:"my-2"},null,-1),Ue={class:"shadow-xl"},Ce={class:"flex w-full justify-between align-items-center"},Se={class:"m-0 my-auto"},De={class:"block mt-2 md:mt-0 p-input-icon-left"},Le=a("i",{class:"pi pi-search"},null,-1),qe=["src"],Te={class:"flex align-items-center justify-content-center"},Be=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),Ie={key:0},Ne={class:""},Pe=["src"],je={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:ee},Fe={key:2,class:"mt-1 mb-5 text-red-500"},Me={class:"flex flex-column gap-2 py-1"},Ee={class:"w-full text-right",for:"username"},Re={key:0,class:"mt-1 mb-5 text-red-500"},Ae={class:"flex flex-column gap-2 py-1"},ze={class:"w-full text-right",for:"username"},Oe={key:0,class:"mt-1 mb-5 text-red-500"},Ge={key:0,class:"flex flex-column gap-2"},He={class:"w-full text-right",for:"username"},Je={key:0,class:"mt-1 mb-5 text-red-500"},Ke={key:1,class:"flex flex-column gap-2"},Qe={class:"w-full text-right",for:"username"},We={key:0,class:"mt-1 mb-5 text-red-500"},Xe={key:2,class:"flex flex-column gap-2"},Ye={class:"w-full text-right",for:"username"},Ze={key:0,class:"mt-1 mb-5 text-red-500"},el={class:"flex flex-column gap-2 py-1"},ll={class:"w-full text-right",for:"username"},tl={key:0,class:"mt-1 mb-5 text-red-500"},al={class:"flex flex-column gap-2 py-1"},sl={class:"w-full text-right",for:"username"},ol={key:0,class:"mt-1 mb-5 text-red-500"},il={class:"flex flex-column gap-2 py-1"},dl={class:"w-full text-right",for:"username"},nl={key:0,class:"mt-1 mb-5 text-red-500"},ul={class:"flex flex-column gap-2 py-1"},rl={class:"w-full text-right",for:"username"},pl={key:0,class:"mt-1 mb-5 text-red-500"},ml={class:"flex-column gap-2 py-1 hidden"},cl={class:"w-full text-right",for:"username"},vl={key:0,class:"mt-1 mb-5 text-red-500"},fl={class:"w-full text-center"},hl={class:""},gl=["src"],yl={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:ee},_l={key:2,class:"mt-1 mb-5 text-red-500"},bl={class:"flex flex-column gap-2 py-1"},wl={class:"w-full text-right",for:"username"},kl={key:0,class:"mt-1 mb-5 text-red-500"},xl={class:"flex flex-column gap-2 py-1"},Vl={class:"w-full text-right",for:"username"},$l={key:0,class:"mt-1 mb-5 text-red-500"},Ul={key:0,class:"flex flex-column gap-2"},Cl={class:"w-full text-right",for:"username"},Sl={key:0,class:"mt-1 mb-5 text-red-500"},Dl={key:1,class:"flex flex-column gap-2"},Ll={class:"w-full text-right",for:"username"},ql={key:0,class:"mt-1 mb-5 text-red-500"},Tl={key:2,class:"flex flex-column gap-2"},Bl={class:"w-full text-right",for:"username"},Il={key:0,class:"mt-1 mb-5 text-red-500"},Nl={class:"flex flex-column gap-2 py-1"},Pl={class:"w-full text-right",for:"username"},jl={key:0,class:"mt-1 mb-5 text-red-500"},Fl={class:"flex flex-column gap-2 py-1"},Ml={class:"w-full text-right",for:"username"},El={key:0,class:"mt-1 mb-5 text-red-500"},Rl={class:"flex flex-column gap-2 py-1"},Al={class:"w-full text-right",for:"username"},zl={key:0,class:"mt-1 mb-5 text-red-500"},Ol={class:"flex flex-column gap-2 py-1"},Gl={class:"w-full text-right",for:"username"},Hl={key:0,class:"mt-1 mb-5 text-red-500"},Jl={class:"flex-column gap-2 py-1 hidden"},Kl={class:"w-full text-right",for:"username"},Ql={key:0,class:"mt-1 mb-5 text-red-500"},Wl={class:"w-full text-center"},Zl={__name:"index",setup(Xl){const R=ve(),le=fe(),l=c({skills:[],department:[]}),{t:A}=he(),z=c([]),O=c([]),Q=()=>[{name:A("driver"),id:1},{name:A("doctor"),id:2},{name:A("Evaluator"),id:5}],te=ge("doctor_id",Number),G=c({}),T=c(!0),W=c({}),o=c(""),H=c(null);c(!1);const w=c(!1),B=c(""),X=c(null),Y=c(null),I=c({}),N=c(!1),_=c(!1);ye(()=>{re()});const P=()=>{y.get("/api/doctors").then(e=>{H.value=e.data.doctors,T.value=!1}),y.post("/api/roles").then(e=>{T.value=!1,z.value=e.data.roles.data,console.log(H.value)}),y.get("/api/skills").then(e=>{O.value=e.data.data}),y.get("/api/department").then(e=>{G.value=e.data.data})},ae=e=>{te.value=e,le.push({name:"doctors-show"})};_e(()=>{P()});const se=e=>{l.value.skills=[],l.value.department=[],y.get(`/api/users/${e}`).then(t=>{T.value=!1,l.value.role=t.data.user.roles.id,l.value.type=t.data.user.type,l.value.image=t.data.user.image,l.value.email=t.data.user.email,l.value.spotter=t.data.user.spotter,l.value.title=t.data.user.title,l.value.name=t.data.user.name;for(let m=0;m<t.data.user.skills.length;m++)t.data.user.skills[m].id&&l.value.skills.push(t.data.user.skills[m].id);for(let m=0;m<t.data.user.departments.length;m++)t.data.user.departments[m].id&&l.value.department.push(t.data.user.departments[m].id)}),console.log(l.value.skills),B.value=e,_.value=!_.value},oe=()=>{const e=new FormData;console.log(l.value.name),e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),l.value.spotter&&e.append("spotter",l.value.spotter),l.value.skills&&e.append("skills",l.value.skills),l.value.department&&e.append("department_id",l.value.department),e.append("type",l.value.type),y.post(`/api/users/${B.value}/edit`,e).then(t=>{console.log(t.data),P(),_.value=!_.value,R.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=c({})}).catch(t=>{o.value=t.response.data.errors})},ie=e=>{console.log(e),w.value=!0,B.value=e},Z=e=>{const t=e.target.files[0],m=new FileReader;m.readAsDataURL(t),m.onload=J=>{l.value.image=J.target.result,l.value.file=t,console.log(this.imageSrc)}},de=()=>{const e=new FormData;console.log(l.value.name),e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),l.value.spotter&&e.append("spotter",l.value.spotter),l.value.skills&&e.append("skills",l.value.skills),l.value.department&&e.append("department_id",l.value.department),e.append("type",l.value.type),y.post("/api/users/create",e).then(t=>{console.log(t.data),P(),N.value=!N.value,R.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=c({})}).catch(t=>{o.value=t.response.data.errors})},ne=()=>{y.delete(`/api/users/${B.value}/delete`).then(e=>{console.log(e.data),w.value=!1,P(),R.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},ue=()=>{Y.value.exportCSV()},re=()=>{I.value={global:{value:null,matchMode:be.CONTAINS}}};return(e,t)=>{const m=h("Button"),J=h("Toolbar"),pe=h("Toast"),f=h("InputText"),b=h("Column"),me=h("DataTable"),K=h("Dialog"),j=h("Dropdown"),F=h("MultiSelect"),ce=h("va-card"),M=we("can");return n(),u("div",xe,[a("div",Ve,[i(ce,{class:"card"},{default:v(()=>[i(J,{class:"mb-4 shadow-md"},{start:v(()=>[$e]),end:v(()=>[E(i(m,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=r=>ue(r))},null,8,["label"]),[[M,"show user"]])]),_:1}),i(pe),a("div",Ue,[E((n(),ke(me,{ref_key:"dt",ref:Y,selection:X.value,"onUpdate:selection":t[2]||(t[2]=r=>X.value=r),value:H.value,loading:T.value,"data-key":"id",paginator:!0,rows:5,filters:I.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:v(()=>[a("div",Ce,[a("h5",Se,s(e.$t("doctors")),1),a("div",null,[a("span",De,[Le,i(f,{modelValue:I.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=r=>I.value.global.value=r),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:v(()=>[i(b,{"selection-mode":"multiple","header-style":"width: 3rem"}),i(b,{field:"index",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:v(r=>[q(s(r.data.id),1)]),_:1},8,["header"]),i(b,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:v(r=>[q(s(r.data.name),1)]),_:1},8,["header"]),i(b,{field:"image",header:e.$t("personal_image"),sortable:!0,"header-style":"width:10%; min-width:12rem;",class:"ltr:text-justify"},{body:v(r=>[a("img",{class:"m-auto rounded-full",style:{width:"100px",height:"100px"},src:r.data.image},null,8,qe)]),_:1},8,["header"]),i(b,{field:"email",header:e.$t("email"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:v(r=>[q(s(r.data.email),1)]),_:1},8,["header"]),i(b,{"header-style":"min-width:10rem;"},{body:v(r=>[a("div",null,[E(i(m,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:g=>se(r.data.id)},null,8,["onClick"]),[[M,"update user"]]),E(i(m,{icon:"pi pi-trash",class:"delete mt-2",onClick:g=>ie(r.data.id)},null,8,["onClick"]),[[M,"create user"]]),i(m,{icon:"pi pi-user",class:"show mt-2",onClick:g=>ae(r.data.id)},null,8,["onClick"])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[M,"show user"]]),i(K,{visible:w.value,"onUpdate:visible":t[4]||(t[4]=r=>w.value=r),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:v(()=>[i(m,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=r=>w.value=!1)},null,8,["label"]),i(m,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:ne},null,8,["label"])]),default:v(()=>[a("div",Te,[Be,W.value?(n(),u("span",Ie,[q(s(e.$t("remove_item"))+" ",1),a("b",null,s(W.value.first_name),1),q("?")])):p("",!0)])]),_:1},8,["visible","header"]),i(K,{visible:N.value,"onUpdate:visible":t[14]||(t[14]=r=>N.value=r),style:{width:"450px"},header:e.$t("users"),modal:!0},{default:v(()=>{var r,g,k,x,V,$,U,C,S,D,L;return[a("div",Ne,[a("div",null,[l.value.image?(n(),u("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,Pe)):(n(),u("img",je)),(r=o.value)!=null&&r.image?(n(),u("div",Fe,s(o.value.image[0]),1)):p("",!0)])]),a("div",Me,[a("label",Ee,s(e.$t("name")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[5]||(t[5]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=o.value)!=null&&g.name?(n(),u("div",Re,s(o.value.name[0]),1)):p("",!0)]),a("div",Ae,[a("label",ze,s(e.$t("type")),1),i(j,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[6]||(t[6]=d=>l.value.type=d),"option-value":"id",filter:"",options:Q(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(k=o.value)!=null&&k.type?(n(),u("div",Oe,s(o.value.type[0]),1)):p("",!0)]),l.value.type==0||l.value.type==2?(n(),u("div",Ge,[a("label",He,s(e.$t("skill_name")),1),i(F,{modelValue:l.value.skills,"onUpdate:modelValue":t[7]||(t[7]=d=>l.value.skills=d),filter:"","option-value":"id",options:O.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(x=o.value)!=null&&x.permissions?(n(),u("div",Je,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Ke,[a("label",Qe,s(e.$t("department")),1),i(F,{modelValue:l.value.department,"onUpdate:modelValue":t[8]||(t[8]=d=>l.value.department=d),filter:"","option-value":"id",options:G.value,optionLabel:"title",placeholder:e.$t("department"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(V=o.value)!=null&&V.permissions?(n(),u("div",We,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Xe,[a("label",Ye,s(e.$t("Spotter")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.spotter,"onUpdate:modelValue":t[9]||(t[9]=d=>l.value.spotter=d),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),($=o.value)!=null&&$.permissions?(n(),u("div",Ze,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),a("div",el,[a("label",ll,s(e.$t("email")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[10]||(t[10]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.email?(n(),u("div",tl,s(o.value.email[0]),1)):p("",!0)]),a("div",al,[a("label",sl,s(e.$t("title")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[11]||(t[11]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.title?(n(),u("div",ol,s(o.value.title[0]),1)):p("",!0)]),a("div",il,[a("label",dl,s(e.$t("password")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[12]||(t[12]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(S=o.value)!=null&&S.password?(n(),u("div",nl,s(o.value.password[0]),1)):p("",!0)]),a("div",ul,[a("label",rl,s(e.$t("roles")),1),i(j,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[13]||(t[13]=d=>l.value.role=d),"option-value":"id",filter:"",options:z.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(D=o.value)!=null&&D.role?(n(),u("div",pl,s(o.value.role[0]),1)):p("",!0)]),a("div",ml,[a("label",cl,s(e.$t("personal_image")),1),i(f,{name:"file",ref:"file",onChange:Z,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(L=o.value)!=null&&L.image?(n(),u("div",vl,s(o.value.image[0]),1)):p("",!0)]),a("div",fl,[i(m,{onClick:de,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),i(K,{visible:_.value,"onUpdate:visible":t[24]||(t[24]=r=>_.value=r),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:v(()=>{var r,g,k,x,V,$,U,C,S,D,L;return[a("div",hl,[a("div",null,[l.value.image?(n(),u("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,gl)):(n(),u("img",yl)),(r=o.value)!=null&&r.image?(n(),u("div",_l,s(o.value.image[0]),1)):p("",!0)])]),a("div",bl,[a("label",wl,s(e.$t("name")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[15]||(t[15]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=o.value)!=null&&g.name?(n(),u("div",kl,s(o.value.name[0]),1)):p("",!0)]),a("div",xl,[a("label",Vl,s(e.$t("type")),1),i(j,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[16]||(t[16]=d=>l.value.type=d),"option-value":"id",filter:"",options:Q(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(k=o.value)!=null&&k.type?(n(),u("div",$l,s(o.value.type[0]),1)):p("",!0)]),l.value.type==0||l.value.type==2?(n(),u("div",Ul,[a("label",Cl,s(e.$t("skill_name")),1),i(F,{modelValue:l.value.skills,"onUpdate:modelValue":t[17]||(t[17]=d=>l.value.skills=d),filter:"","option-value":"id",options:O.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(x=o.value)!=null&&x.skills?(n(),u("div",Sl,s(o.value.skills[0]),1)):p("",!0)])):p("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Dl,[a("label",Ll,s(e.$t("department")),1),i(F,{modelValue:l.value.department,"onUpdate:modelValue":t[18]||(t[18]=d=>l.value.department=d),filter:"","option-value":"id",options:G.value,optionLabel:"title",placeholder:e.$t("department"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(V=o.value)!=null&&V.permissions?(n(),u("div",ql,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Tl,[a("label",Bl,s(e.$t("Spotter")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.spotter,"onUpdate:modelValue":t[19]||(t[19]=d=>l.value.spotter=d),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),($=o.value)!=null&&$.permissions?(n(),u("div",Il,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),a("div",Nl,[a("label",Pl,s(e.$t("email")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[20]||(t[20]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.email?(n(),u("div",jl,s(o.value.email[0]),1)):p("",!0)]),a("div",Fl,[a("label",Ml,s(e.$t("title")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[21]||(t[21]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.title?(n(),u("div",El,s(o.value.title[0]),1)):p("",!0)]),a("div",Rl,[a("label",Al,s(e.$t("password")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[22]||(t[22]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(S=o.value)!=null&&S.password?(n(),u("div",zl,s(o.value.password[0]),1)):p("",!0)]),a("div",Ol,[a("label",Gl,s(e.$t("roles")),1),i(j,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[23]||(t[23]=d=>l.value.role=d),"option-value":"id",filter:"",options:z.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(D=o.value)!=null&&D.role?(n(),u("div",Hl,s(o.value.role[0]),1)):p("",!0)]),a("div",Jl,[a("label",Kl,s(e.$t("personal_image")),1),i(f,{name:"file",ref:"file",onChange:Z,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(L=o.value)!=null&&L.image?(n(),u("div",Ql,s(o.value.image[0]),1)):p("",!0)]),a("div",Wl,[i(m,{onClick:oe,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Zl as default};
