import{a9 as me,aa as ce,T as c,ai as ve,ab as fe,a2 as he,ac as ge,l as h,ad as ye,o as n,e as u,h as a,x as i,y as v,w as B,f as be,t as s,i as I,q as p,aj as ee,z as g}from"./main-beddadc6.js";const _e={class:"grid",style:{"max-height":"90vh !important",overflow:"scroll"}},we={class:"col-12"},ke={class:"my-2"},xe={class:"shadow-xl"},Ve={class:"flex w-full justify-between align-items-center"},$e={class:"m-0 my-auto"},Ue={class:"block mt-2 md:mt-0 p-input-icon-left"},Ce=a("i",{class:"pi pi-search"},null,-1),Se=["src"],De={class:"flex align-items-center justify-content-center"},qe=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),Le={key:0},Te={class:""},Be=["src"],Ie={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:ee},Pe={key:2,class:"mt-1 mb-5 text-red-500"},Ne={class:"flex flex-column gap-2 py-1"},je={class:"w-full text-right",for:"username"},Fe={key:0,class:"mt-1 mb-5 text-red-500"},Me={class:"flex flex-column gap-2 py-1"},Ee={class:"w-full text-right",for:"username"},Re={key:0,class:"mt-1 mb-5 text-red-500"},Ae={key:0,class:"flex flex-column gap-2"},ze={class:"w-full text-right",for:"username"},Oe={key:0,class:"mt-1 mb-5 text-red-500"},Ge={key:1,class:"flex flex-column gap-2"},He={class:"w-full text-right",for:"username"},Je={key:0,class:"mt-1 mb-5 text-red-500"},Ke={key:2,class:"flex flex-column gap-2"},Qe={class:"w-full text-right",for:"username"},We={key:0,class:"mt-1 mb-5 text-red-500"},Xe={class:"flex flex-column gap-2 py-1"},Ye={class:"w-full text-right",for:"username"},Ze={key:0,class:"mt-1 mb-5 text-red-500"},el={class:"flex flex-column gap-2 py-1"},ll={class:"w-full text-right",for:"username"},tl={key:0,class:"mt-1 mb-5 text-red-500"},al={class:"flex flex-column gap-2 py-1"},sl={class:"w-full text-right",for:"username"},ol={key:0,class:"mt-1 mb-5 text-red-500"},il={class:"flex flex-column gap-2 py-1"},dl={class:"w-full text-right",for:"username"},nl={key:0,class:"mt-1 mb-5 text-red-500"},ul={class:"flex-column gap-2 py-1 hidden"},rl={class:"w-full text-right",for:"username"},pl={key:0,class:"mt-1 mb-5 text-red-500"},ml={class:"w-full text-center"},cl={class:""},vl=["src"],fl={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:ee},hl={key:2,class:"mt-1 mb-5 text-red-500"},gl={class:"flex flex-column gap-2 py-1"},yl={class:"w-full text-right",for:"username"},bl={key:0,class:"mt-1 mb-5 text-red-500"},_l={class:"flex flex-column gap-2 py-1"},wl={class:"w-full text-right",for:"username"},kl={key:0,class:"mt-1 mb-5 text-red-500"},xl={key:0,class:"flex flex-column gap-2"},Vl={class:"w-full text-right",for:"username"},$l={key:0,class:"mt-1 mb-5 text-red-500"},Ul={key:1,class:"flex flex-column gap-2"},Cl={class:"w-full text-right",for:"username"},Sl={key:0,class:"mt-1 mb-5 text-red-500"},Dl={key:2,class:"flex flex-column gap-2"},ql={class:"w-full text-right",for:"username"},Ll={key:0,class:"mt-1 mb-5 text-red-500"},Tl={class:"flex flex-column gap-2 py-1"},Bl={class:"w-full text-right",for:"username"},Il={key:0,class:"mt-1 mb-5 text-red-500"},Pl={class:"flex flex-column gap-2 py-1"},Nl={class:"w-full text-right",for:"username"},jl={key:0,class:"mt-1 mb-5 text-red-500"},Fl={class:"flex flex-column gap-2 py-1"},Ml={class:"w-full text-right",for:"username"},El={key:0,class:"mt-1 mb-5 text-red-500"},Rl={class:"flex flex-column gap-2 py-1"},Al={class:"w-full text-right",for:"username"},zl={key:0,class:"mt-1 mb-5 text-red-500"},Ol={class:"flex-column gap-2 py-1 hidden"},Gl={class:"w-full text-right",for:"username"},Hl={key:0,class:"mt-1 mb-5 text-red-500"},Jl={class:"w-full text-center"},Wl={__name:"Index",setup(Kl){const R=me();ce();const l=c({skills:[],department:[]}),{t:A}=ve(),z=c([]),O=c([]),Q=()=>[{name:A("driver"),id:1},{name:A("doctor"),id:2},{name:A("Evaluator"),id:5}],G=c({}),P=c(!0),W=c({}),o=c(""),H=c(null);c(!1);const k=c(!1),N=c(""),X=c(null),Y=c(null),j=c({}),b=c(!1),_=c(!1);fe(()=>{ne()});const F=()=>{g.post("/api/users").then(e=>{H.value=e.data.users.data,P.value=!1}),g.post("/api/roles").then(e=>{P.value=!1,z.value=e.data.roles.data,console.log(H.value)}),g.get("/api/skills").then(e=>{O.value=e.data.data}),g.get("/api/department").then(e=>{G.value=e.data.data})};he(()=>{F()});const le=e=>{l.value.skills=[],l.value.department=[],g.get(`/api/users/${e}`).then(t=>{P.value=!1,l.value.role=t.data.user.roles.id,l.value.type=t.data.user.type,l.value.image=t.data.user.image,l.value.email=t.data.user.email,l.value.spotter=t.data.user.spotter,l.value.title=t.data.user.title,l.value.name=t.data.user.name;for(let m=0;m<t.data.user.skills.length;m++)t.data.user.skills[m].id&&l.value.skills.push(t.data.user.skills[m].id);for(let m=0;m<t.data.user.departments.length;m++)t.data.user.departments[m].id&&l.value.department.push(t.data.user.departments[m].id)}),console.log(l.value.skills),N.value=e,_.value=!_.value},te=()=>{const e=new FormData;console.log(l.value.name),e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),e.append("spotter",l.value.spotter),l.value.skills&&e.append("skills",l.value.skills),l.value.department&&e.append("department_id",l.value.department),e.append("type",l.value.type),g.post(`/api/users/${N.value}/edit`,e).then(t=>{console.log(t.data),F(),_.value=!_.value,R.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=c({})}).catch(t=>{o.value=t.response.data.errors})},ae=()=>{l.value=c({}),b.value=!b.value},se=e=>{console.log(e),k.value=!0,N.value=e},Z=e=>{const t=e.target.files[0],m=new FileReader;m.readAsDataURL(t),m.onload=J=>{l.value.image=J.target.result,l.value.file=t,console.log(this.imageSrc)}},oe=()=>{const e=new FormData;console.log(l.value.name),e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),e.append("spotter",l.value.spotter),l.value.skills&&e.append("skills",l.value.skills),l.value.department&&e.append("department_id",l.value.department),e.append("type",l.value.type),g.post("/api/users/create",e).then(t=>{console.log(t.data),F(),b.value=!b.value,R.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=c({})}).catch(t=>{o.value=t.response.data.errors})},ie=()=>{g.delete(`/api/users/${N.value}/delete`).then(e=>{console.log(e.data),k.value=!1,F(),R.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},de=()=>{Y.value.exportCSV()},ne=()=>{j.value={global:{value:null,matchMode:ge.CONTAINS}}};return(e,t)=>{const m=h("Button"),J=h("Toolbar"),ue=h("Toast"),f=h("InputText"),w=h("Column"),re=h("DataTable"),K=h("Dialog"),M=h("Dropdown"),E=h("MultiSelect"),pe=h("va-card"),x=ye("can");return n(),u("div",_e,[a("div",we,[i(pe,{class:"card"},{default:v(()=>[i(J,{class:"mb-4 shadow-md"},{start:v(()=>[a("div",ke,[B(i(m,{label:e.$t("user_add"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:ae},null,8,["label"]),[[x,"create user"]])])]),end:v(()=>[B(i(m,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=r=>de(r))},null,8,["label"]),[[x,"show user"]])]),_:1}),i(ue),a("div",xe,[B((n(),be(re,{ref_key:"dt",ref:Y,selection:X.value,"onUpdate:selection":t[2]||(t[2]=r=>X.value=r),value:H.value,loading:P.value,"data-key":"id",paginator:!0,rows:5,filters:j.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:v(()=>[a("div",Ve,[a("h5",$e,s(e.$t("users")),1),a("div",null,[a("span",Ue,[Ce,i(f,{modelValue:j.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=r=>j.value.global.value=r),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:v(()=>[i(w,{"selection-mode":"multiple","header-style":"width: 3rem"}),i(w,{field:"index",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:v(r=>[I(s(r.data.id),1)]),_:1},8,["header"]),i(w,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:v(r=>[I(s(r.data.name),1)]),_:1},8,["header"]),i(w,{field:"image",header:e.$t("personal_image"),sortable:!0,"header-style":"width:10%; min-width:12rem;",class:"ltr:text-justify"},{body:v(r=>[a("img",{class:"m-auto rounded-full",style:{width:"100px",height:"100px"},src:r.data.image},null,8,Se)]),_:1},8,["header"]),i(w,{field:"email",header:e.$t("email"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:v(r=>[I(s(r.data.email),1)]),_:1},8,["header"]),i(w,{"header-style":"min-width:10rem;"},{body:v(r=>[a("div",null,[B(i(m,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:y=>le(r.data.id)},null,8,["onClick"]),[[x,"update user"]]),B(i(m,{icon:"pi pi-trash",class:"delete mt-2",onClick:y=>se(r.data.id)},null,8,["onClick"]),[[x,"create user"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[x,"show user"]]),i(K,{visible:k.value,"onUpdate:visible":t[4]||(t[4]=r=>k.value=r),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:v(()=>[i(m,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=r=>k.value=!1)},null,8,["label"]),i(m,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:ie},null,8,["label"])]),default:v(()=>[a("div",De,[qe,W.value?(n(),u("span",Le,[I(s(e.$t("remove_item"))+" ",1),a("b",null,s(W.value.first_name),1),I("?")])):p("",!0)])]),_:1},8,["visible","header"]),i(K,{visible:b.value,"onUpdate:visible":t[14]||(t[14]=r=>b.value=r),style:{width:"450px"},header:e.$t("users"),modal:!0},{default:v(()=>{var r,y,V,$,U,C,S,D,q,L,T;return[a("div",Te,[a("div",null,[l.value.image?(n(),u("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,Be)):(n(),u("img",Ie)),(r=o.value)!=null&&r.image?(n(),u("div",Pe,s(o.value.image[0]),1)):p("",!0)])]),a("div",Ne,[a("label",je,s(e.$t("name")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[5]||(t[5]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(y=o.value)!=null&&y.name?(n(),u("div",Fe,s(o.value.name[0]),1)):p("",!0)]),a("div",Me,[a("label",Ee,s(e.$t("type")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[6]||(t[6]=d=>l.value.type=d),"option-value":"id",filter:"",options:Q(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(V=o.value)!=null&&V.type?(n(),u("div",Re,s(o.value.type[0]),1)):p("",!0)]),l.value.type==0||l.value.type==2?(n(),u("div",Ae,[a("label",ze,s(e.$t("skill_name")),1),i(E,{modelValue:l.value.skills,"onUpdate:modelValue":t[7]||(t[7]=d=>l.value.skills=d),filter:"","option-value":"id",options:O.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),($=o.value)!=null&&$.permissions?(n(),u("div",Oe,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Ge,[a("label",He,s(e.$t("department")),1),i(E,{modelValue:l.value.department,"onUpdate:modelValue":t[8]||(t[8]=d=>l.value.department=d),filter:"","option-value":"id",options:G.value,optionLabel:"title",placeholder:e.$t("department"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(U=o.value)!=null&&U.permissions?(n(),u("div",Je,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Ke,[a("label",Qe,s(e.$t("Spotter")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.spotter,"onUpdate:modelValue":t[9]||(t[9]=d=>l.value.spotter=d),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.permissions?(n(),u("div",We,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),a("div",Xe,[a("label",Ye,s(e.$t("email")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[10]||(t[10]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(S=o.value)!=null&&S.email?(n(),u("div",Ze,s(o.value.email[0]),1)):p("",!0)]),a("div",el,[a("label",ll,s(e.$t("title")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[11]||(t[11]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(D=o.value)!=null&&D.title?(n(),u("div",tl,s(o.value.title[0]),1)):p("",!0)]),a("div",al,[a("label",sl,s(e.$t("password")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[12]||(t[12]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(q=o.value)!=null&&q.password?(n(),u("div",ol,s(o.value.password[0]),1)):p("",!0)]),a("div",il,[a("label",dl,s(e.$t("roles")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[13]||(t[13]=d=>l.value.role=d),"option-value":"id",filter:"",options:z.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(L=o.value)!=null&&L.role?(n(),u("div",nl,s(o.value.role[0]),1)):p("",!0)]),a("div",ul,[a("label",rl,s(e.$t("personal_image")),1),i(f,{name:"file",ref:"file",onChange:Z,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(T=o.value)!=null&&T.image?(n(),u("div",pl,s(o.value.image[0]),1)):p("",!0)]),a("div",ml,[i(m,{onClick:oe,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),i(K,{visible:_.value,"onUpdate:visible":t[24]||(t[24]=r=>_.value=r),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:v(()=>{var r,y,V,$,U,C,S,D,q,L,T;return[a("div",cl,[a("div",null,[l.value.image?(n(),u("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,vl)):(n(),u("img",fl)),(r=o.value)!=null&&r.image?(n(),u("div",hl,s(o.value.image[0]),1)):p("",!0)])]),a("div",gl,[a("label",yl,s(e.$t("name")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[15]||(t[15]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(y=o.value)!=null&&y.name?(n(),u("div",bl,s(o.value.name[0]),1)):p("",!0)]),a("div",_l,[a("label",wl,s(e.$t("type")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[16]||(t[16]=d=>l.value.type=d),"option-value":"id",filter:"",options:Q(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(V=o.value)!=null&&V.type?(n(),u("div",kl,s(o.value.type[0]),1)):p("",!0)]),l.value.type==0||l.value.type==2?(n(),u("div",xl,[a("label",Vl,s(e.$t("skill_name")),1),i(E,{modelValue:l.value.skills,"onUpdate:modelValue":t[17]||(t[17]=d=>l.value.skills=d),filter:"","option-value":"id",options:O.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),($=o.value)!=null&&$.skills?(n(),u("div",$l,s(o.value.skills[0]),1)):p("",!0)])):p("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Ul,[a("label",Cl,s(e.$t("department")),1),i(E,{modelValue:l.value.department,"onUpdate:modelValue":t[18]||(t[18]=d=>l.value.department=d),filter:"","option-value":"id",options:G.value,optionLabel:"title",placeholder:e.$t("department"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(U=o.value)!=null&&U.permissions?(n(),u("div",Sl,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),l.value.type==0||l.value.type==2?(n(),u("div",Dl,[a("label",ql,s(e.$t("Spotter")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.spotter,"onUpdate:modelValue":t[19]||(t[19]=d=>l.value.spotter=d),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.permissions?(n(),u("div",Ll,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),a("div",Tl,[a("label",Bl,s(e.$t("email")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[20]||(t[20]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(S=o.value)!=null&&S.email?(n(),u("div",Il,s(o.value.email[0]),1)):p("",!0)]),a("div",Pl,[a("label",Nl,s(e.$t("title")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[21]||(t[21]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(D=o.value)!=null&&D.title?(n(),u("div",jl,s(o.value.title[0]),1)):p("",!0)]),a("div",Fl,[a("label",Ml,s(e.$t("password")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[22]||(t[22]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(q=o.value)!=null&&q.password?(n(),u("div",El,s(o.value.password[0]),1)):p("",!0)]),a("div",Rl,[a("label",Al,s(e.$t("roles")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[23]||(t[23]=d=>l.value.role=d),"option-value":"id",filter:"",options:z.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(L=o.value)!=null&&L.role?(n(),u("div",zl,s(o.value.role[0]),1)):p("",!0)]),a("div",Ol,[a("label",Gl,s(e.$t("personal_image")),1),i(f,{name:"file",ref:"file",onChange:Z,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(T=o.value)!=null&&T.image?(n(),u("div",Hl,s(o.value.image[0]),1)):p("",!0)]),a("div",Jl,[i(m,{onClick:te,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Wl as default};