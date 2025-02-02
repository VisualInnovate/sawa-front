import{_ as Y}from"./Ellipse2-b0842d90.js";import{a9 as re,Q as ue,R as p,ah as me,aa as pe,S as ce,ab as ve,r as h,ac as fe,o as n,d as r,e as s,f as i,w as c,i as q,x as he,t as a,h as D,g as m,c as X}from"./main-d5d5ddd5.js";const ge={class:"grid",style:{"max-height":"90vh !important",overflow:"scroll"}},be={class:"col-12"},_e={class:"my-2"},ye={class:"shadow-xl"},we={class:"flex w-full justify-between align-items-center"},ke={class:"m-0 my-auto"},xe={class:"block mt-2 md:mt-0 p-input-icon-left"},Ve=s("i",{class:"pi pi-search"},null,-1),$e=["src"],Ue={class:"flex align-items-center justify-content-center"},Ce=s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),Le={key:0},Se={class:""},qe=["src"],De={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:Y},Be={key:2,class:"mt-1 mb-5 text-red-500"},Te={class:"flex flex-column gap-2 py-1"},Ie={class:"w-full text-right",for:"username"},Pe={key:0,class:"mt-1 mb-5 text-red-500"},Ne={class:"flex flex-column gap-2 py-1"},Me={class:"w-full text-right",for:"username"},Re={key:0,class:"mt-1 mb-5 text-red-500"},je={key:0,class:"flex flex-column gap-2"},Ee={class:"w-full text-right",for:"username"},Fe={key:0,class:"mt-1 mb-5 text-red-500"},Ae={key:1,class:"flex flex-column gap-2"},ze={class:"w-full text-right",for:"username"},Oe={key:0,class:"mt-1 mb-5 text-red-500"},Qe={key:2,class:"flex flex-column gap-2"},Ge={class:"w-full text-right",for:"username"},He={key:0,class:"mt-1 mb-5 text-red-500"},Je={class:"flex flex-column gap-2 py-1"},Ke={class:"w-full text-right",for:"username"},We={key:0,class:"mt-1 mb-5 text-red-500"},Xe={class:"flex flex-column gap-2 py-1"},Ye={class:"w-full text-right",for:"username"},Ze={key:0,class:"mt-1 mb-5 text-red-500"},el={class:"flex flex-column gap-2 py-1"},ll={class:"w-full text-right",for:"username"},tl={key:0,class:"mt-1 mb-5 text-red-500"},sl={class:"flex flex-column gap-2 py-1"},al={class:"w-full text-right",for:"username"},ol={key:0,class:"mt-1 mb-5 text-red-500"},il={class:"flex-column gap-2 py-1 hidden"},dl={class:"w-full text-right",for:"username"},nl={key:0,class:"mt-1 mb-5 text-red-500"},rl={class:"w-full text-center"},ul={class:""},ml=["src"],pl={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:Y},cl={key:2,class:"mt-1 mb-5 text-red-500"},vl={class:"flex flex-column gap-2 py-1"},fl={class:"w-full text-right",for:"username"},hl={key:0,class:"mt-1 mb-5 text-red-500"},gl={class:"flex flex-column gap-2 py-1"},bl={class:"w-full text-right",for:"username"},_l={key:0,class:"mt-1 mb-5 text-red-500"},yl={key:0,class:"flex flex-column gap-2"},wl={class:"w-full text-right",for:"username"},kl={key:0,class:"mt-1 mb-5 text-red-500"},xl={key:1,class:"flex flex-column gap-2"},Vl={class:"w-full text-right",for:"username"},$l={key:0,class:"mt-1 mb-5 text-red-500"},Ul={key:2,class:"flex flex-column gap-2"},Cl={class:"w-full text-right",for:"username"},Ll={key:0,class:"mt-1 mb-5 text-red-500"},Sl={class:"flex flex-column gap-2 py-1"},ql={class:"w-full text-right",for:"username"},Dl={key:0,class:"mt-1 mb-5 text-red-500"},Bl={class:"flex flex-column gap-2 py-1"},Tl={class:"w-full text-right",for:"username"},Il={key:0,class:"mt-1 mb-5 text-red-500"},Pl={class:"flex flex-column gap-2 py-1"},Nl={class:"w-full text-right",for:"username"},Ml={key:0,class:"mt-1 mb-5 text-red-500"},Rl={class:"flex flex-column gap-2 py-1"},jl={class:"w-full text-right",for:"username"},El={key:0,class:"mt-1 mb-5 text-red-500"},Fl={class:"flex-column gap-2 py-1 hidden"},Al={class:"w-full text-right",for:"username"},zl={key:0,class:"mt-1 mb-5 text-red-500"},Ol={class:"w-full text-center"},Jl={__name:"Index",setup(Ql){const Z=re(),M=ue(),l=p({skills:[],department:[]});me();const R=p([]),j=p([]),E=p({}),F=p(!0),A=p({}),o=p(""),z=p(null);p(!1);const _=p(!1),O=p(""),Q=p(null),G=p(null),B=p({}),H=p(!1),J=p(!1);pe(()=>{oe()});const K=()=>{X.post("/api/users").then(e=>{z.value=e.data.users.data,F.value=!1})};ce(()=>{K()});const ee=e=>{M.push({name:"user-update",params:{id:e}})},le=()=>{M.push({name:"CreateUser"})},te=e=>{console.log(e),_.value=!0,O.value=e},W=e=>{const t=e.target.files[0],f=new FileReader;f.readAsDataURL(t),f.onload=P=>{l.value.image=P.target.result,l.value.file=t,console.log(this.imageSrc)}},se=()=>{X.delete(`/api/users/${O.value}/delete`).then(e=>{console.log(e.data),_.value=!1,K(),Z.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},ae=()=>{G.value.exportCSV()},oe=()=>{B.value={global:{value:null,matchMode:ve.CONTAINS}}};return(e,t)=>{const f=h("Button"),P=h("Toolbar"),ie=h("Toast"),v=h("InputText"),b=h("Column"),de=h("DataTable"),N=h("Dialog"),T=h("Dropdown"),I=h("MultiSelect"),ne=h("va-card"),y=fe("can");return n(),r("div",ge,[s("div",be,[i(ne,{class:"card"},{default:c(()=>[i(P,{class:"mb-4 shadow-md"},{start:c(()=>[s("div",_e,[q(i(f,{label:e.$t("user_add"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:le},null,8,["label"]),[[y,"create user"]])])]),end:c(()=>[q(i(f,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[0]||(t[0]=u=>ae(u))},null,8,["label"]),[[y,"show user"]])]),_:1}),i(ie),s("div",ye,[q((n(),he(de,{ref_key:"dt",ref:G,selection:Q.value,"onUpdate:selection":t[2]||(t[2]=u=>Q.value=u),value:z.value,loading:F.value,"data-key":"id",paginator:!0,rows:5,filters:B.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:c(()=>[s("div",we,[s("h5",ke,a(e.$t("users")),1),s("div",null,[s("span",xe,[Ve,i(v,{modelValue:B.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=u=>B.value.global.value=u),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:c(()=>[i(b,{"selection-mode":"multiple","header-style":"width: 3rem"}),i(b,{field:"index",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:c(u=>[D(a(u.data.id),1)]),_:1},8,["header"]),i(b,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:c(u=>[D(a(u.data.name),1)]),_:1},8,["header"]),i(b,{field:"image",header:e.$t("personal_image"),sortable:!0,"header-style":"width:10%; min-width:12rem;",class:"ltr:text-justify"},{body:c(u=>[s("img",{class:"m-auto rounded-full",style:{width:"100px",height:"100px"},src:u.data.image},null,8,$e)]),_:1},8,["header"]),i(b,{field:"email",header:e.$t("email"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:c(u=>[D(a(u.data.email),1)]),_:1},8,["header"]),i(b,{"header-style":"min-width:10rem;"},{body:c(u=>[s("div",null,[q(i(f,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:g=>ee(u.data.id)},null,8,["onClick"]),[[y,"update user"]]),q(i(f,{icon:"pi pi-trash",class:"delete mt-2",onClick:g=>te(u.data.id)},null,8,["onClick"]),[[y,"create user"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[y,"user list"]]),i(N,{visible:_.value,"onUpdate:visible":t[4]||(t[4]=u=>_.value=u),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:c(()=>[i(f,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:t[3]||(t[3]=u=>_.value=!1)},null,8,["label"]),i(f,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:se},null,8,["label"])]),default:c(()=>[s("div",Ue,[Ce,A.value?(n(),r("span",Le,[D(a(e.$t("remove_item"))+" ",1),s("b",null,a(A.value.first_name),1),D("?")])):m("",!0)])]),_:1},8,["visible","header"]),i(N,{visible:H.value,"onUpdate:visible":t[14]||(t[14]=u=>H.value=u),style:{width:"450px"},header:e.$t("users"),modal:!0},{default:c(()=>{var u,g,w,k,x,V,$,U,C,L,S;return[s("div",Se,[s("div",null,[l.value.image?(n(),r("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,qe)):(n(),r("img",De)),(u=o.value)!=null&&u.image?(n(),r("div",Be,a(o.value.image[0]),1)):m("",!0)])]),s("div",Te,[s("label",Ie,a(e.$t("name")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[5]||(t[5]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=o.value)!=null&&g.name?(n(),r("div",Pe,a(o.value.name[0]),1)):m("",!0)]),s("div",Ne,[s("label",Me,a(e.$t("type")),1),i(T,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[6]||(t[6]=d=>l.value.type=d),"option-value":"id",filter:"",options:e.tpes(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(w=o.value)!=null&&w.type?(n(),r("div",Re,a(o.value.type[0]),1)):m("",!0)]),l.value.type==0||l.value.type==2?(n(),r("div",je,[s("label",Ee,a(e.$t("skill_name")),1),i(I,{modelValue:l.value.skills,"onUpdate:modelValue":t[7]||(t[7]=d=>l.value.skills=d),filter:"","option-value":"id",options:j.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(k=o.value)!=null&&k.permissions?(n(),r("div",Fe,a(o.value.permissions[0]),1)):m("",!0)])):m("",!0),l.value.type==0||l.value.type==2?(n(),r("div",Ae,[s("label",ze,a(e.$t("department")),1),i(I,{modelValue:l.value.department,"onUpdate:modelValue":t[8]||(t[8]=d=>l.value.department=d),filter:"","option-value":"id",options:E.value,optionLabel:"title",placeholder:e.$t("department"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(x=o.value)!=null&&x.permissions?(n(),r("div",Oe,a(o.value.permissions[0]),1)):m("",!0)])):m("",!0),l.value.type==0||l.value.type==2?(n(),r("div",Qe,[s("label",Ge,a(e.$t("Spotter")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.spotter,"onUpdate:modelValue":t[9]||(t[9]=d=>l.value.spotter=d),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),(V=o.value)!=null&&V.permissions?(n(),r("div",He,a(o.value.permissions[0]),1)):m("",!0)])):m("",!0),s("div",Je,[s("label",Ke,a(e.$t("email")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[10]||(t[10]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),($=o.value)!=null&&$.email?(n(),r("div",We,a(o.value.email[0]),1)):m("",!0)]),s("div",Xe,[s("label",Ye,a(e.$t("title")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[11]||(t[11]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.title?(n(),r("div",Ze,a(o.value.title[0]),1)):m("",!0)]),s("div",el,[s("label",ll,a(e.$t("password")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[12]||(t[12]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.password?(n(),r("div",tl,a(o.value.password[0]),1)):m("",!0)]),s("div",sl,[s("label",al,a(e.$t("roles")),1),i(T,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[13]||(t[13]=d=>l.value.role=d),"option-value":"id",filter:"",options:R.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(L=o.value)!=null&&L.role?(n(),r("div",ol,a(o.value.role[0]),1)):m("",!0)]),s("div",il,[s("label",dl,a(e.$t("personal_image")),1),i(v,{name:"file",ref:"file",onChange:W,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(S=o.value)!=null&&S.image?(n(),r("div",nl,a(o.value.image[0]),1)):m("",!0)]),s("div",rl,[i(f,{onClick:e.createuser,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["onClick","label"])])]}),_:1},8,["visible","header"]),i(N,{visible:J.value,"onUpdate:visible":t[24]||(t[24]=u=>J.value=u),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:c(()=>{var u,g,w,k,x,V,$,U,C,L,S;return[s("div",ul,[s("div",null,[l.value.image?(n(),r("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:l.value.image},null,8,ml)):(n(),r("img",pl)),(u=o.value)!=null&&u.image?(n(),r("div",cl,a(o.value.image[0]),1)):m("",!0)])]),s("div",vl,[s("label",fl,a(e.$t("name")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.name,"onUpdate:modelValue":t[15]||(t[15]=d=>l.value.name=d),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(g=o.value)!=null&&g.name?(n(),r("div",hl,a(o.value.name[0]),1)):m("",!0)]),s("div",gl,[s("label",bl,a(e.$t("type")),1),i(T,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.type,"onUpdate:modelValue":t[16]||(t[16]=d=>l.value.type=d),"option-value":"id",filter:"",options:e.tpes(),optionLabel:"name",placeholder:e.$t("type"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(w=o.value)!=null&&w.type?(n(),r("div",_l,a(o.value.type[0]),1)):m("",!0)]),l.value.type==0||l.value.type==2?(n(),r("div",yl,[s("label",wl,a(e.$t("skill_name")),1),i(I,{modelValue:l.value.skills,"onUpdate:modelValue":t[17]||(t[17]=d=>l.value.skills=d),filter:"","option-value":"id",options:j.value,optionLabel:"name",placeholder:e.$t("skill_name"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(k=o.value)!=null&&k.skills?(n(),r("div",kl,a(o.value.skills[0]),1)):m("",!0)])):m("",!0),l.value.type==0||l.value.type==2?(n(),r("div",xl,[s("label",Vl,a(e.$t("department")),1),i(I,{modelValue:l.value.department,"onUpdate:modelValue":t[18]||(t[18]=d=>l.value.department=d),filter:"","option-value":"id",options:E.value,optionLabel:"title",placeholder:e.$t("department"),class:"w-full bg-[#f7f5f5] md:w-20rem"},null,8,["modelValue","options","placeholder"]),(x=o.value)!=null&&x.permissions?(n(),r("div",$l,a(o.value.permissions[0]),1)):m("",!0)])):m("",!0),l.value.type==0||l.value.type==2?(n(),r("div",Ul,[s("label",Cl,a(e.$t("Spotter")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.spotter,"onUpdate:modelValue":t[19]||(t[19]=d=>l.value.spotter=d),placeholder:e.$t("Spotter")},null,8,["modelValue","placeholder"]),(V=o.value)!=null&&V.permissions?(n(),r("div",Ll,a(o.value.permissions[0]),1)):m("",!0)])):m("",!0),s("div",Sl,[s("label",ql,a(e.$t("email")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.email,"onUpdate:modelValue":t[20]||(t[20]=d=>l.value.email=d),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),($=o.value)!=null&&$.email?(n(),r("div",Dl,a(o.value.email[0]),1)):m("",!0)]),s("div",Bl,[s("label",Tl,a(e.$t("title")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.title,"onUpdate:modelValue":t[21]||(t[21]=d=>l.value.title=d),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(U=o.value)!=null&&U.title?(n(),r("div",Il,a(o.value.title[0]),1)):m("",!0)]),s("div",Pl,[s("label",Nl,a(e.$t("password")),1),i(v,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:l.value.password,"onUpdate:modelValue":t[22]||(t[22]=d=>l.value.password=d),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(C=o.value)!=null&&C.password?(n(),r("div",Ml,a(o.value.password[0]),1)):m("",!0)]),s("div",Rl,[s("label",jl,a(e.$t("roles")),1),i(T,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:l.value.role,"onUpdate:modelValue":t[23]||(t[23]=d=>l.value.role=d),"option-value":"id",filter:"",options:R.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(L=o.value)!=null&&L.role?(n(),r("div",El,a(o.value.role[0]),1)):m("",!0)]),s("div",Fl,[s("label",Al,a(e.$t("personal_image")),1),i(v,{name:"file",ref:"file",onChange:W,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(S=o.value)!=null&&S.image?(n(),r("div",zl,a(o.value.image[0]),1)):m("",!0)]),s("div",Ol,[i(f,{onClick:e.editesuser,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["onClick","label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{Jl as default};
