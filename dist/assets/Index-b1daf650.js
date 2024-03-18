import{a8 as le,a9 as te,S as r,aa as ae,a1 as se,ab as oe,l as b,ag as ie,o as n,e as u,h as t,x as s,y as c,w as de,f as ne,t as i,i as w,q as m,ah as re,z as $}from"./main-1c1efb5f.js";const ue={class:"grid"},ce={class:"col-12"},me={class:"my-2"},pe={class:"shadow-xl"},ve={class:"flex w-full justify-between align-items-center"},fe={class:"m-0 my-auto"},he={class:"block mt-2 md:mt-0 p-input-icon-left"},ge=t("i",{class:"pi pi-search"},null,-1),be=["src"],_e={class:"flex align-items-center justify-content-center"},ye=t("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),we={key:0},xe={class:""},ke=["src"],$e={key:1,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:re},Ve={key:2,class:"mt-1 mb-5 text-red-500"},Ce={class:"flex flex-column gap-2 py-1"},De={class:"w-full text-right",for:"username"},Ue={key:0,class:"mt-1 mb-5 text-red-500"},Se={class:"flex flex-column gap-2 py-1"},qe={class:"w-full text-right",for:"username"},Te={key:0,class:"mt-1 mb-5 text-red-500"},Be={class:"flex flex-column gap-2 py-1"},Le={class:"w-full text-right",for:"username"},Pe={key:0,class:"mt-1 mb-5 text-red-500"},je={class:"flex flex-column gap-2 py-1"},Ne={class:"w-full text-right",for:"username"},Fe={key:0,class:"mt-1 mb-5 text-red-500"},Ie={class:"flex flex-column gap-2 py-1"},Re={class:"w-full text-right",for:"username"},Me={key:0,class:"mt-1 mb-5 text-red-500"},Ee={class:"flex-column gap-2 py-1 hidden"},Ae={class:"w-full text-right",for:"username"},ze={key:0,class:"mt-1 mb-5 text-red-500"},Oe={class:"w-full text-center"},Ge={class:""},He={class:""},Je=["src"],Ke={class:"flex flex-column gap-2 py-1"},Qe={class:"w-full text-right",for:"username"},We={key:0,class:"mt-1 mb-5 text-red-500"},Xe={class:"flex flex-column gap-2 py-1"},Ye={class:"w-full text-right",for:"username"},Ze={key:0,class:"mt-1 mb-5 text-red-500"},el={class:"flex flex-column gap-2 py-1"},ll={class:"w-full text-right",for:"username"},tl={key:0,class:"mt-1 mb-5 text-red-500"},al={class:"flex flex-column gap-2 py-1"},sl={class:"w-full text-right",for:"username"},ol={key:0,class:"mt-1 mb-5 text-red-500"},il={class:"flex flex-column gap-2 py-1"},dl={class:"w-full text-right",for:"username"},nl={key:0,class:"mt-1 mb-5 text-red-500"},rl={class:"flex-column gap-2 py-1 hidden"},ul={class:"w-full text-right",for:"username"},cl={key:0,class:"mt-1 mb-5 text-red-500"},ml={class:"w-full text-center"},fl={__name:"Index",setup(pl){const P=le();te();const a=r({name:"",email:"",title:"",password:"",file:"",role:""}),j=r([]),S=r(!0),I=r({}),d=r(""),q=r(null);r(!1);const V=r(!1),T=r(""),R=r(null),M=r(null),B=r({}),x=r(!1),k=r(!1);ae(()=>{W()});const L=()=>{$.post("/api/users").then(e=>{q.value=e.data.users.data,S.value=!1}),$.post("/api/roles").then(e=>{S.value=!1,j.value=e.data.roles.data,console.log(q.value)})};se(()=>{L()});const z=e=>{$.get(`/api/users/${e}`).then(l=>{S.value=!1,a.value=l.data.user,a.value.role=l.data.user.roles.id,console.log(q.value)}),T.value=e,k.value=!k.value},O=()=>{const e=new FormData;e.append("name",a.value.name),e.append("email",a.value.email),e.append("title",a.value.title),e.append("password",a.value.password),e.append("image",a.value.file),e.append("role",a.value.role),$.post(`/api/users/${T.value}/edit`,e).then(l=>{console.log(l.data),L(),k.value=!k.value,P.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=r({})}).catch(l=>{d.value=l.response.data.errors})},G=()=>{a.value=r({}),x.value=!x.value},H=e=>{console.log(e),V.value=!0,T.value=e},E=e=>{const l=e.target.files[0],v=new FileReader;v.readAsDataURL(l),v.onload=N=>{a.value.image=N.target.result,a.value.file=l,console.log(this.imageSrc)}},J=()=>{const e=new FormData;e.append("name",a.value.name),e.append("email",a.value.email),e.append("title",a.value.title),e.append("password",a.value.password),e.append("image",a.value.file),e.append("role",a.value.role),$.post("/api/users/create",e).then(l=>{console.log(l.data),L(),x.value=!x.value,P.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3}),skill.value=r({})}).catch(l=>{d.value=l.response.data.errors})},K=()=>{$.delete(`/api/users/${T.value}/delete`).then(e=>{console.log(e.data),V.value=!1,L(),P.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},Q=()=>{M.value.exportCSV()},W=()=>{B.value={global:{value:null,matchMode:oe.CONTAINS}}};return(e,l)=>{const v=b("Button"),N=b("Toolbar"),X=b("Toast"),f=b("InputText"),_=b("Column"),Y=b("DataTable"),F=b("Dialog"),A=b("Dropdown"),Z=b("va-card"),ee=ie("can");return n(),u("div",ue,[t("div",ce,[s(Z,{class:"card"},{default:c(()=>[s(N,{class:"mb-4 shadow-md"},{start:c(()=>[t("div",me,[s(v,{label:e.$t("user_add"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:G},null,8,["label"])])]),end:c(()=>[s(v,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:l[0]||(l[0]=o=>Q(o))},null,8,["label"])]),_:1}),s(X),t("div",pe,[de((n(),ne(Y,{ref_key:"dt",ref:M,selection:R.value,"onUpdate:selection":l[2]||(l[2]=o=>R.value=o),value:q.value,loading:S.value,"data-key":"id",paginator:!0,rows:5,filters:B.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:c(()=>[t("div",ve,[t("h5",fe,i(e.$t("users")),1),t("div",null,[t("span",he,[ge,s(f,{modelValue:B.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=o=>B.value.global.value=o),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:c(()=>[s(_,{"selection-mode":"multiple","header-style":"width: 3rem"}),s(_,{field:"index",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:c(o=>[w(i(o.data.id),1)]),_:1},8,["header"]),s(_,{field:"name",header:e.$t("name"),sortable:!0,"header-style":"width:14%; min-width:12rem;",class:"ltr:text-justify"},{body:c(o=>[w(i(o.data.name),1)]),_:1},8,["header"]),s(_,{field:"image",header:e.$t("personal_image"),sortable:!0,"header-style":"width:10%; min-width:12rem;",class:"ltr:text-justify"},{body:c(o=>[t("img",{class:"m-auto rounded-full",style:{width:"100px",height:"100px"},src:o.data.image},null,8,be)]),_:1},8,["header"]),s(_,{field:"email",header:e.$t("email"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:c(o=>[w(i(o.data.email),1)]),_:1},8,["header"]),s(_,{field:"title",header:e.$t("title"),sortable:!0,"header-style":"width:14%; min-width:11rem;",class:"ltr:text-justify"},{body:c(o=>[w(i(o.data.title),1)]),_:1},8,["header"]),s(_,{field:"title",header:e.$t("roles"),sortable:!0,"header-style":"width:14%; min-width:11rem;",class:"ltr:text-justify"},{body:c(o=>{var h,y;return[w(i((y=(h=o.data)==null?void 0:h.roles[0])==null?void 0:y.name),1)]}),_:1},8,["header"]),s(_,{"header-style":"min-width:10rem;"},{body:c(o=>[t("div",null,[s(v,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:h=>z(o.data.id)},null,8,["onClick"]),s(v,{icon:"pi pi-trash",class:"delete mt-2",onClick:h=>H(o.data.id)},null,8,["onClick"])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[ee,"assessment-types.index"]]),s(F,{visible:V.value,"onUpdate:visible":l[4]||(l[4]=o=>V.value=o),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:c(()=>[s(v,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:l[3]||(l[3]=o=>V.value=!1)},null,8,["label"]),s(v,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:K},null,8,["label"])]),default:c(()=>[t("div",_e,[ye,I.value?(n(),u("span",we,[w(i(e.$t("remove_item"))+" ",1),t("b",null,i(I.value.first_name),1),w("?")])):m("",!0)])]),_:1},8,["visible","header"]),s(F,{visible:x.value,"onUpdate:visible":l[10]||(l[10]=o=>x.value=o),style:{width:"450px"},header:e.$t("users"),modal:!0},{default:c(()=>{var o,h,y,C,D,U,p;return[t("div",xe,[t("div",null,[a.value.image?(n(),u("img",{key:0,onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:a.value.image},null,8,ke)):(n(),u("img",$e)),(o=d.value)!=null&&o.image?(n(),u("div",Ve,i(d.value.image[0]),1)):m("",!0)])]),t("div",Ce,[t("label",De,i(e.$t("name")),1),s(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:a.value.name,"onUpdate:modelValue":l[5]||(l[5]=g=>a.value.name=g),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(h=d.value)!=null&&h.name?(n(),u("div",Ue,i(d.value.name[0]),1)):m("",!0)]),t("div",Se,[t("label",qe,i(e.$t("email")),1),s(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:a.value.email,"onUpdate:modelValue":l[6]||(l[6]=g=>a.value.email=g),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(y=d.value)!=null&&y.email?(n(),u("div",Te,i(d.value.email[0]),1)):m("",!0)]),t("div",Be,[t("label",Le,i(e.$t("title")),1),s(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:a.value.title,"onUpdate:modelValue":l[7]||(l[7]=g=>a.value.title=g),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(C=d.value)!=null&&C.title?(n(),u("div",Pe,i(d.value.title[0]),1)):m("",!0)]),t("div",je,[t("label",Ne,i(e.$t("password")),1),s(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:a.value.password,"onUpdate:modelValue":l[8]||(l[8]=g=>a.value.password=g),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(D=d.value)!=null&&D.password?(n(),u("div",Fe,i(d.value.password[0]),1)):m("",!0)]),t("div",Ie,[t("label",Re,i(e.$t("roles")),1),s(A,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:a.value.role,"onUpdate:modelValue":l[9]||(l[9]=g=>a.value.role=g),"option-value":"id",filter:"",options:j.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(U=d.value)!=null&&U.role?(n(),u("div",Me,i(d.value.role[0]),1)):m("",!0)]),t("div",Ee,[t("label",Ae,i(e.$t("personal_image")),1),s(f,{name:"file",ref:"file",onChange:E,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(p=d.value)!=null&&p.image?(n(),u("div",ze,i(d.value.image[0]),1)):m("",!0)]),t("div",Oe,[s(v,{onClick:J,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"]),s(F,{visible:k.value,"onUpdate:visible":l[16]||(l[16]=o=>k.value=o),style:{width:"450px"},header:e.$t("submit"),modal:!0},{default:c(()=>{var o,h,y,C,D,U;return[t("div",Ge,[t("div",He,[t("img",{onclick:"document.getElementById('filr').click()",class:"m-auto rounded-full",style:{width:"150px",height:"150px"},src:a.value.image},null,8,Je)])]),t("div",Ke,[t("label",Qe,i(e.$t("name")),1),s(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:a.value.name,"onUpdate:modelValue":l[11]||(l[11]=p=>a.value.name=p),placeholder:e.$t("name")},null,8,["modelValue","placeholder"]),(o=d.value)!=null&&o.name?(n(),u("div",We,i(d.value.name[0]),1)):m("",!0)]),t("div",Xe,[t("label",Ye,i(e.$t("email")),1),s(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:a.value.email,"onUpdate:modelValue":l[12]||(l[12]=p=>a.value.email=p),placeholder:e.$t("email")},null,8,["modelValue","placeholder"]),(h=d.value)!=null&&h.email?(n(),u("div",Ze,i(d.value.email[0]),1)):m("",!0)]),t("div",el,[t("label",ll,i(e.$t("title")),1),s(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:a.value.title,"onUpdate:modelValue":l[13]||(l[13]=p=>a.value.title=p),placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(y=d.value)!=null&&y.title?(n(),u("div",tl,i(d.value.title[0]),1)):m("",!0)]),t("div",al,[t("label",sl,i(e.$t("password")),1),s(f,{required:"",class:"bg-[#f7f5f5] text-center",modelValue:a.value.password,"onUpdate:modelValue":l[14]||(l[14]=p=>a.value.password=p),placeholder:e.$t("password")},null,8,["modelValue","placeholder"]),(C=d.value)!=null&&C.password?(n(),u("div",ol,i(d.value.password[0]),1)):m("",!0)]),t("div",il,[t("label",dl,i(e.$t("roles")),1),s(A,{required:"",id:"pv_id_1",style:{direction:"ltr !important","text-align":"center !important"},modelValue:a.value.role,"onUpdate:modelValue":l[15]||(l[15]=p=>a.value.role=p),"option-value":"id",filter:"",options:j.value,optionLabel:"name",placeholder:e.$t("roles"),class:"w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"]),(D=d.value)!=null&&D.role?(n(),u("div",nl,i(d.value.role[0]),1)):m("",!0)]),t("div",rl,[t("label",ul,i(e.$t("personal_image")),1),s(f,{name:"file",ref:"file",onChange:E,accept:"image/*",id:"filr",type:"file",class:"w-full"},null,512),(U=d.value)!=null&&U.image?(n(),u("div",cl,i(d.value.image[0]),1)):m("",!0)]),t("div",ml,[s(v,{onClick:O,class:"create m-auto w-[50%] my-4",label:e.$t("submit")},null,8,["label"])])]}),_:1},8,["visible","header"])])]),_:1})])])}}};export{fl as default};
