import{a9 as re,aa as pe,T as m,ai as me,ab as ce,a2 as ve,ac as fe,l as h,ad as he,o as n,e as u,h as a,x as i,y as v,w as T,f as ge,t as s,i as B,q as p,aj as Y,z as y}from"./main-89cf62a0.js";const ye={class:"grid",style:{"max-height":"90vh !important",overflow:"scroll"}},be={class:"col-12"},_e={class:"my-2"},we={class:"shadow-xl"},ke={class:"flex w-full justify-between align-items-center"},xe={class:"m-0 my-auto"},Ve={class:"block mt-2 md:mt-0 p-input-icon-left"},$e=a("i",{class:"pi pi-search"},null,-1),Ue=["src"],Ce={class:"flex align-items-center justify-content-center"},Se=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),De={key:0},qe={class:""},Le=["src"],Te={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:Y},Be={key:2,class:"mt-1 mb-5 text-red-500"},Ie={class:"flex flex-column gap-2 py-1"},Pe={class:"w-full text-right",for:"username"},Ne={key:0,class:"mt-1 mb-5 text-red-500"},je={class:"flex flex-column gap-2 py-1"},Fe={class:"w-full text-right",for:"username"},Me={key:0,class:"mt-1 mb-5 text-red-500"},Ee={key:0,class:"flex flex-column gap-2"},Re={class:"w-full text-right",for:"username"},Ae={key:0,class:"mt-1 mb-5 text-red-500"},ze={key:1,class:"flex flex-column gap-2"},Oe={class:"w-full text-right",for:"username"},Ge={key:0,class:"mt-1 mb-5 text-red-500"},He={class:"flex flex-column gap-2 py-1"},Je={class:"w-full text-right",for:"username"},Ke={key:0,class:"mt-1 mb-5 text-red-500"},Qe={class:"flex flex-column gap-2 py-1"},We={class:"w-full text-right",for:"username"},Xe={key:0,class:"mt-1 mb-5 text-red-500"},Ye={class:"flex flex-column gap-2 py-1"},Ze={class:"w-full text-right",for:"username"},el={key:0,class:"mt-1 mb-5 text-red-500"},ll={class:"flex flex-column gap-2 py-1"},tl={class:"w-full text-right",for:"username"},al={key:0,class:"mt-1 mb-5 text-red-500"},sl={class:"flex-column gap-2 py-1 hidden"},ol={class:"w-full text-right",for:"username"},il={key:0,class:"mt-1 mb-5 text-red-500"},dl={class:"w-full text-center"},nl={class:""},ul=["src"],rl={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:Y},pl={key:2,class:"mt-1 mb-5 text-red-500"},ml={class:"flex flex-column gap-2 py-1"},cl={class:"w-full text-right",for:"username"},vl={key:0,class:"mt-1 mb-5 text-red-500"},fl={class:"flex flex-column gap-2 py-1"},hl={class:"w-full text-right",for:"username"},gl={key:0,class:"mt-1 mb-5 text-red-500"},yl={key:0,class:"flex flex-column gap-2"},bl={class:"w-full text-right",for:"username"},_l={key:0,class:"mt-1 mb-5 text-red-500"},wl={key:1,class:"flex flex-column gap-2"},kl={class:"w-full text-right",for:"username"},xl={key:0,class:"mt-1 mb-5 text-red-500"},Vl={class:"flex flex-column gap-2 py-1"},$l={class:"w-full text-right",for:"username"},Ul={key:0,class:"mt-1 mb-5 text-red-500"},Cl={class:"flex flex-column gap-2 py-1"},Sl={class:"w-full text-right",for:"username"},Dl={key:0,class:"mt-1 mb-5 text-red-500"},ql={class:"flex flex-column gap-2 py-1"},Ll={class:"w-full text-right",for:"username"},Tl={key:0,class:"mt-1 mb-5 text-red-500"},Bl={class:"flex flex-column gap-2 py-1"},Il={class:"w-full text-right",for:"username"},Pl={key:0,class:"mt-1 mb-5 text-red-500"},Nl={class:"flex-column gap-2 py-1 hidden"},jl={class:"w-full text-right",for:"username"},Fl={key:0,class:"mt-1 mb-5 text-red-500"},Ml={class:"w-full text-center"},Al={__name:"Index",setup(El){const E=re();pe();const l=m({}),{t:R}=me(),A=m([]),z=m([]),H=()=>[{name:R("driver"),id:1},{name:R("doctor"),id:2},{name:R("Evaluator"),id:5}],I=m(!0),J=m({}),o=m(""),P=m(null);m(!1);const k=m(!1),N=m(""),K=m(null),Q=m(null),j=m({}),b=m(!1),_=m(!1);ce(()=>{ie()});const F=()=>{y.post("/api/users").then(e=>{P.value=e.data.users.data,I.value=!1}),y.post("/api/roles").then(e=>{I.value=!1,A.value=e.data.roles.data,console.log(P.value)}),y.get("/api/skills").then(e=>{z.value=e.data.data})};ve(()=>{F()});const Z=e=>{y.get(`/api/users/${e}`).then(t=>{I.value=!1,l.value=t.data.user,l.value.role=t.data.user.roles.id,l.value.type=t.data.user.type;for(let c=0;c<t.data.user.skills.length;c++)l.value.skills.push(t.data.user.skills[c].id);console.log(P.value)}),N.value=e,_.value=!_.value},ee=()=>{const e=new FormData;console.log(l.value.name),e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),e.append("spotter",l.value.spotter),l.value.skills&&e.append("skills",l.value.skills),e.append("type",l.value.type),y.post(`/api/users/${N.value}/edit`,e).then(t=>{console.log(t.data),F(),_.value=!_.value,E.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=m({})}).catch(t=>{o.value=t.response.data.errors})},le=()=>{l.value=m({}),b.value=!b.value},te=e=>{console.log(e),k.value=!0,N.value=e},W=e=>{const t=e.target.files[0],c=new FileReader;c.readAsDataURL(t),c.onload=O=>{l.value.image=O.target.result,l.value.file=t,console.log(this.imageSrc)}},ae=()=>{const e=new FormData;console.log(l.value.name),e.append("name",l.value.name),e.append("email",l.value.email),e.append("title",l.value.title),e.append("password",l.value.password),e.append("image",l.value.file),e.append("role",l.value.role),e.append("spotter",l.value.spotter),l.value.skills&&e.append("skills",l.value.skills),e.append("type",l.value.type),y.post("/api/users/create",e).then(t=>{console.log(t.data),F(),b.value=!b.value,E.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=m({})}).catch(t=>{o.value=t.response.data.errors})},se=()=>{y.delete(`/api/users/${N.value}/delete`).then(e=>{console.log(e.data),k.value=!1,F(),E.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},oe=()=>{Q.value.exportCSV()},ie=()=>{j.value={global:{value:null,matchMode:fe.CONTAINS}}};return(e,t)=>{const c=h("Button"),O=h("Toolbar"),de=h("Toast"),f=h("InputText"),w=h("Column"),ne=h("DataTable"),G=h("Dialog"),M=h("Dropdown"),X=h("MultiSelect"),ue=h("va-card"),x=he("can");return n(),u("div",ye,[a("div",be,[i(ue,{class:"card"},{default:v(()=>[i(O,{class:"mb-4 shadow-md"},{start:v(()=>[a("div",_e,[T(i(c,{label:e.$t("user_add"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:le},null,8,["label"]),[[x,"create user"]])])]),end:v(()=>[T(i(c,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=r=>oe(r))},null,8,["label"]),[[x,"show user"]])]),_:1}),i(de),a("div",we,[T((n(),ge(ne,{ref_key:"dt",ref:Q,selection:K.value,"onUpdate:selection":t[2]||(t[2]=r=>K.value=r),value:P.value,loading:I.value,"data-key":"id",paginator:!0,rows:5,filters:j.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:v(()=>[a("div",ke,[a("h5",xe,s(e.$t("users")),1),a("div",null,[a("span",Ve,[$e,i(f,{modelValue:j.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=r=>j.value.global.value=r),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:v(()=>[i(w,{"selection-mode":"multiple","header-style":"width: 3rem"}),i(w,{field:"index",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:v(r=>[B(s(r.data.id),1)]),_:1},8,["header"]),i(w,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:v(r=>[B(s(r.data.name),1)]),_:1},8,["header"]),i(w,{field:"image",header:e.$t("personal_image"),sortable:!0,"header-style":"width:10%; min-width:12rem;",class:"ltr:text-justify"},{body:v(r=>[a("img",{class:"m-auto rounded-full",style:{width:"100px",height:"100px"},src:r.data.image},null,8,Ue)]),_:1},8,["header"]),i(w,{field:"email",header:e.$t("email"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:v(r=>[B(s(r.data.email),1)]),_:1},8,["header"]),i(w,{"header-style":"min-width:10rem;"},{body:v(r=>[a("div",null,[T(i(c,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:g=>Z(r.data.id)},null,8,["onClick"]),[[x,"update user"]]),T(i(c,{icon:"pi pi-trash",class:"delete mt-2",onClick:g=>te(r.data.id)},null,8,["onClick"]),[[x,"create user"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[x,"show user"]]),i(G,{visible:k.value,"onUpdate:visible":t[4]||(t[4]=r=>k.value=r),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:v(()=>[i(c,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=r=>k.value=!1)},null,8,["label"]),i(c,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:se},null,8,["label"])]),default:v(()=>[a("div",Ce,[Se,J.value?(n(),u("span",De,[B(s(e.$t("remove_item"))+" ",1),a("b",null,s(J.value.first_name),1),B("?")])):p("",!0)])]),_:1},8,["visible","header"]),i(G,{visible:b.value,"onUpdate:visible":t[13]||(t[13]=r=>b.value=r),style:{width:"450px"},header:e.$t("users"),modal:!0},{default:v(()=>{var r,g,V,$,U,C,S,D,q,L;return[a("div",qe,[a("div",null,[l.value.image?(n(),u("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,Le)):(n(),u("img",Te)),(r=o.value)!=null&&r.image?(n(),u("div",Be,s(o.value.image[0]),1)):p("",!0)])]),a("div",Ie,[a("label",Pe,s(e.$t("name")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[5]||(t[5]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=o.value)!=null&&g.name?(n(),u("div",Ne,s(o.value.name[0]),1)):p("",!0)]),a("div",je,[a("label",Fe,s(e.$t("type")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[6]||(t[6]=d=>l.value.type=d),"option-value":"id",filter:"",options:H(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(V=o.value)!=null&&V.type?(n(),u("div",Me,s(o.value.type[0]),1)):p("",!0)]),l.value.type==0||l.value.type==2?(n(),u("div",Ee,[a("label",Re,s(e.$t("skill_name")),1),i(X,{modelValue:l.value.skills,"onUpdate:modelValue":t[7]||(t[7]=d=>l.value.skills=d),filter:"","option-value":"id",options:z.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),($=o.value)!=null&&$.permissions?(n(),u("div",Ae,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),l.value.type==0||l.value.type==2?(n(),u("div",ze,[a("label",Oe,s(e.$t("Spotter")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.spotter,"onUpdate:modelValue":t[8]||(t[8]=d=>l.value.spotter=d),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.permissions?(n(),u("div",Ge,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),a("div",He,[a("label",Je,s(e.$t("email")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[9]||(t[9]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.email?(n(),u("div",Ke,s(o.value.email[0]),1)):p("",!0)]),a("div",Qe,[a("label",We,s(e.$t("title")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[10]||(t[10]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(S=o.value)!=null&&S.title?(n(),u("div",Xe,s(o.value.title[0]),1)):p("",!0)]),a("div",Ye,[a("label",Ze,s(e.$t("password")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[11]||(t[11]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(D=o.value)!=null&&D.password?(n(),u("div",el,s(o.value.password[0]),1)):p("",!0)]),a("div",ll,[a("label",tl,s(e.$t("roles")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[12]||(t[12]=d=>l.value.role=d),"option-value":"id",filter:"",options:A.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(q=o.value)!=null&&q.role?(n(),u("div",al,s(o.value.role[0]),1)):p("",!0)]),a("div",sl,[a("label",ol,s(e.$t("personal_image")),1),i(f,{name:"file",ref:"file",onChange:W,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(L=o.value)!=null&&L.image?(n(),u("div",il,s(o.value.image[0]),1)):p("",!0)]),a("div",dl,[i(c,{onClick:ae,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),i(G,{visible:_.value,"onUpdate:visible":t[22]||(t[22]=r=>_.value=r),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:v(()=>{var r,g,V,$,U,C,S,D,q,L;return[a("div",nl,[a("div",null,[l.value.image?(n(),u("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,ul)):(n(),u("img",rl)),(r=o.value)!=null&&r.image?(n(),u("div",pl,s(o.value.image[0]),1)):p("",!0)])]),a("div",ml,[a("label",cl,s(e.$t("name")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[14]||(t[14]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=o.value)!=null&&g.name?(n(),u("div",vl,s(o.value.name[0]),1)):p("",!0)]),a("div",fl,[a("label",hl,s(e.$t("type")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[15]||(t[15]=d=>l.value.type=d),"option-value":"id",filter:"",options:H(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(V=o.value)!=null&&V.type?(n(),u("div",gl,s(o.value.type[0]),1)):p("",!0)]),l.value.type==0||l.value.type==2?(n(),u("div",yl,[a("label",bl,s(e.$t("skill_name")),1),i(X,{modelValue:l.value.skills,"onUpdate:modelValue":t[16]||(t[16]=d=>l.value.skills=d),filter:"","option-value":"id",options:z.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),($=o.value)!=null&&$.permissions?(n(),u("div",_l,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),l.value.type==0||l.value.type==2?(n(),u("div",wl,[a("label",kl,s(e.$t("Spotter")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.spotter,"onUpdate:modelValue":t[17]||(t[17]=d=>l.value.spotter=d),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.permissions?(n(),u("div",xl,s(o.value.permissions[0]),1)):p("",!0)])):p("",!0),a("div",Vl,[a("label",$l,s(e.$t("email")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[18]||(t[18]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.email?(n(),u("div",Ul,s(o.value.email[0]),1)):p("",!0)]),a("div",Cl,[a("label",Sl,s(e.$t("title")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[19]||(t[19]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(S=o.value)!=null&&S.title?(n(),u("div",Dl,s(o.value.title[0]),1)):p("",!0)]),a("div",ql,[a("label",Ll,s(e.$t("password")),1),i(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[20]||(t[20]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(D=o.value)!=null&&D.password?(n(),u("div",Tl,s(o.value.password[0]),1)):p("",!0)]),a("div",Bl,[a("label",Il,s(e.$t("roles")),1),i(M,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[21]||(t[21]=d=>l.value.role=d),"option-value":"id",filter:"",options:A.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(q=o.value)!=null&&q.role?(n(),u("div",Pl,s(o.value.role[0]),1)):p("",!0)]),a("div",Nl,[a("label",jl,s(e.$t("personal_image")),1),i(f,{name:"file",ref:"file",onChange:W,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(L=o.value)!=null&&L.image?(n(),u("div",Fl,s(o.value.image[0]),1)):p("",!0)]),a("div",Ml,[i(c,{onClick:ee,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Al as default};
