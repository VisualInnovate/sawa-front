import{ao as Z,I as d,aq as ee,ah as te,ar as le,r as f,as as ae,o as r,d as c,i as w,x as R,w as u,e as l,t as i,f as s,g,a2 as A,aa as se,h as P,F as oe,c as D}from"./main-a0d75a22.js";const ie=["onSubmit"],de={class:"grid grid-cols-1 lg:grid-cols-2 gap-4"},ne={class:""},re={for:"password"},ce={key:0,class:"mt-1 mb-5 text-red-500"},ue={class:""},me={for:"password"},ve={key:0,class:"mt-1 mb-5 text-red-500"},pe={class:"hidden flex-column gap-2 py-1"},ge={class:"w-full my-2",for:"username"},he={key:0,class:"mt-1 mb-5 text-red-500"},fe={class:"py-1"},_e={class:"text-center"},ye=["src"],be={key:1,onclick:"document.getElementById('filr').click()",src:"https://farfallahc.com/public/assets/back-end/img/image-place-holder.png",alt:"Image",class:"m-auto lg:w-[40%] h-[180px] cursor-pointer",preview:""},we={key:2,class:"mt-1 mb-5 text-red-500"},ke={class:"grid"},$e={class:"col-12",style:{"overflow-y":"scroll"}},xe={class:"flex w-full justify-between align-items-center"},Ce={class:"m-0 my-auto"},Ve={class:"block mt-2 md:mt-0 p-input-icon-left"},De=l("i",{class:"pi pi-search"},null,-1),Ie={class:"flex align-items-center justify-content-center"},Se=l("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),Be={key:0},Pe=["onSubmit"],Fe={class:"grid grid-cols-1 lg:grid-cols-1 gap-4"},Ne={class:""},Te={for:"password"},Ue={key:0,class:"mt-1 mb-5 text-red-500"},Le={class:""},Me={for:"password"},qe={key:0,class:"mt-1 mb-5 text-red-500"},Ee={class:"hidden flex-column gap-2 py-1"},Re={class:"w-full my-2",for:"username"},Ae={key:0,class:"mt-1 mb-5 text-red-500"},je={class:"py-1"},ze={class:"text-center"},Oe=["src"],Ye=["src"],Ge={key:2,class:"mt-1 mb-5 text-red-500"},Ke={__name:"index",setup(He){const B=Z(),o=d({}),F=d(!0),h=d({}),N=d([]),n=d({}),k=d(!1),T=d(!1);d(!1);const $=d(!1),j=d({}),U=d(null),L=d(null),I=d({});d(!1),d([]);const x=d(Number);d([{name:"1",code:1},{name:"2",code:2},{name:"3",code:3},{name:"4",code:4},{name:"5",code:5},{name:"6",code:6}]),ee(()=>{J()});const S=()=>{D.get("/api/events").then(e=>{F.value=!1,N.value=e.data.data})};te(()=>{S()});const M=e=>{const t=e.target.files[0],m=new FileReader;m.readAsDataURL(t),m.onload=v=>{n.value.image=v.target.result,n.value.file=t}},q=()=>{const e=new FormData;n.value.file&&(e.append("image",n.value.file),e.append("body",n.value.body),e.append("title",n.value.title)),D.post("api/events",e).then(t=>{S(),T.value=!T.value,category.value={},B.add({severity:"success",summary:"Successful",detail:"category create",life:3e3})}).catch(t=>{o.value=t.response.data.errors})},z=()=>{const e=new FormData;n.value.file&&e.append("image",n.value.file),e.append("body",h.value.body),e.append("title",h.value.title),D.post(`api/events/${x.value}`,e).then(t=>{S(),k.value=!k.value,category.value={},B.add({severity:"success",summary:"Successful",detail:"category create",life:3e3})}).catch(t=>{o.value=t.response.data.errors})},O=e=>{x.value=e,o.value={},k.value=!0,D.get(`/api/events/${e}`).then(t=>{h.value=t.data.data})},Y=e=>{x.value=e,$.value=!0},G=()=>{L.value.exportCSV()},H=()=>{D.delete(`api/events/${x.value.id}`).then(e=>{S(),$.value=!1,B.add({severity:"success",summary:"Successful",detail:"category Deleted",life:3e3})})},J=()=>{I.value={global:{value:null,matchMode:le.CONTAINS}}};return(e,t)=>{const m=f("InputText"),v=f("Button"),K=f("Toast"),y=f("Column"),Q=f("Image"),W=f("DataTable"),E=f("Dialog"),X=f("va-card"),b=ae("can");return r(),c(oe,null,[w((r(),R(se,{class:"card mb-5 p-4 shadow-md bg-slate-50"},{default:u(()=>{var a,_,C,V;return[l("form",{onSubmit:A(q,["prevent"])},[l("div",de,[l("div",null,[l("div",ne,[l("label",re,i(e.$t("title")),1),s(m,{required:"",modelValue:n.value.title,"onUpdate:modelValue":t[0]||(t[0]=p=>n.value.title=p),type:"text",class:"mt-3 w-full mb-3",placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(a=o.value)!=null&&a.title?(r(),c("div",ce,i(o.value.title[0]),1)):g("",!0)]),l("div",ue,[l("label",me,i(e.$t("body_event")),1),s(m,{required:"",modelValue:n.value.body,"onUpdate:modelValue":t[1]||(t[1]=p=>n.value.body=p),type:"text",class:"mt-3 w-full mb-3",placeholder:e.$t("body_event")},null,8,["modelValue","placeholder"]),(_=o.value)!=null&&_.body?(r(),c("div",ve,i(o.value.body[0]),1)):g("",!0)]),l("div",pe,[l("label",ge,i(e.$t("image")),1),s(m,{name:"file",ref:"file",onChange:M,accept:"image/*",id:"filr",type:"file",class:"w-full my-2"},null,512),(C=o.value)!=null&&C.image?(r(),c("div",he,i(o.value.image[0]),1)):g("",!0)])]),l("div",fe,[l("div",_e,[n.value.image?(r(),c("img",{key:0,onclick:"document.getElementById('filr').click()",src:n.value.image,alt:"Image",class:"m-auto lg:w-[40%] h-[160px] cursor-pointer",preview:""},null,8,ye)):(r(),c("img",be)),(V=o.value)!=null&&V.image?(r(),c("div",we,i(o.value.image[0]),1)):g("",!0)])])]),w(s(v,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:t[2]||(t[2]=p=>G(p))},null,8,["label"]),[[b,"events list"]]),w(s(v,{type:"submit",label:e.$t("create_button"),icon:"pi pi-plus",class:"p-button-success mr-2"},null,8,["label"]),[[b,"create event"]])],40,ie)]}),_:1})),[[b,"create event"]]),l("div",ke,[l("div",$e,[s(X,{class:"card shadow-md"},{default:u(()=>[s(K),w((r(),R(W,{ref_key:"dt",ref:L,selection:U.value,"onUpdate:selection":t[4]||(t[4]=a=>U.value=a),value:N.value,loading:F.value,"data-key":"id",paginator:!0,rows:10,filters:I.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:u(()=>[l("div",xe,[l("h5",Ce,i(e.$t("events")),1),l("div",null,[l("span",Ve,[De,s(m,{modelValue:I.value.global.value,"onUpdate:modelValue":t[3]||(t[3]=a=>I.value.global.value=a),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:u(()=>[s(y,{"selection-mode":"multiple","header-style":"width: 3rem"}),s(y,{field:"id",header:e.$t("index"),sortable:!0,"header-style":"width:14%; min-width:10rem;"},{body:u(a=>[P(i(a.data.id),1)]),_:1},8,["header"]),s(y,{field:"body",header:e.$t("body_event"),sortable:!0,"header-style":"width:14%; min-width:10rem;"},{body:u(a=>[P(i(a.data.body),1)]),_:1},8,["header"]),s(y,{field:"title",header:e.$t("title"),sortable:!0,"header-style":"width:14%; min-width:10rem;"},{body:u(a=>[P(i(a.data.title),1)]),_:1},8,["header"]),s(y,{field:"image",header:e.$t("image"),sortable:!0,"header-style":"width:14%; min-width:10rem;"},{body:u(a=>[s(Q,{src:a.data.image,alt:"Image",class:"w-24",preview:""},null,8,["src"])]),_:1},8,["header"]),s(y,{"header-style":"min-width:10rem;"},{body:u(a=>[w(s(v,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:_=>O(a.data.id)},null,8,["onClick"]),[[b,"update event"]]),w(s(v,{icon:"pi pi-trash",class:"delete mt-2",onClick:_=>Y(a.data)},null,8,["onClick"]),[[b,"delete event"]])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[b,"events list"]]),s(E,{visible:$.value,"onUpdate:visible":t[6]||(t[6]=a=>$.value=a),style:{width:"450px"},header:"Confirm",modal:!0},{footer:u(()=>[s(v,{label:"No",icon:"pi pi-times",class:"p-button-text",onClick:t[5]||(t[5]=a=>$.value=!1)}),s(v,{label:"Yes",icon:"pi pi-check",class:"p-button-text",onClick:H})]),default:u(()=>[l("div",Ie,[Se,j.value?(r(),c("span",Be,"Are you sure you want to delete the "+i(x.value.name)+" ?",1)):g("",!0)])]),_:1},8,["visible"]),s(E,{visible:k.value,"onUpdate:visible":t[9]||(t[9]=a=>k.value=a),style:{width:"450px"},header:"Confirm",modal:!0},{footer:u(()=>[s(v,{label:"Save",icon:"pi pi-check",class:"p-button-text",onClick:z})]),default:u(()=>{var a,_,C,V;return[l("form",{onSubmit:A(q,["prevent"])},[l("div",Fe,[l("div",null,[l("div",Ne,[l("label",Te,i(e.$t("title")),1),s(m,{required:"",modelValue:h.value.title,"onUpdate:modelValue":t[7]||(t[7]=p=>h.value.title=p),type:"text",class:"mt-3 w-full mb-3",placeholder:e.$t("title")},null,8,["modelValue","placeholder"]),(a=o.value)!=null&&a.title?(r(),c("div",Ue,i(o.value.title[0]),1)):g("",!0)]),l("div",Le,[l("label",Me,i(e.$t("body_event")),1),s(m,{required:"",modelValue:h.value.body,"onUpdate:modelValue":t[8]||(t[8]=p=>h.value.body=p),type:"text",class:"mt-3 w-full mb-3",placeholder:e.$t("body_event")},null,8,["modelValue","placeholder"]),(_=o.value)!=null&&_.body?(r(),c("div",qe,i(o.value.body[0]),1)):g("",!0)]),l("div",Ee,[l("label",Re,i(e.$t("image")),1),s(m,{name:"file",ref:"file",onChange:M,accept:"image/*",id:"filr",type:"file",class:"w-full my-2"},null,512),(C=o.value)!=null&&C.image?(r(),c("div",Ae,i(o.value.image[0]),1)):g("",!0)])]),l("div",je,[l("div",ze,[n.value.image?(r(),c("img",{key:0,onclick:"document.getElementById('filr').click()",src:n.value.image,alt:"Image",class:"m-auto w-[70%]",preview:""},null,8,Oe)):(r(),c("img",{key:1,onclick:"document.getElementById('filr').click()",src:h.value.image,alt:"Image",class:"m-auto w-[70%]",preview:""},null,8,Ye)),(V=o.value)!=null&&V.image?(r(),c("div",Ge,i(o.value.image[0]),1)):g("",!0)])])])],40,Pe)]}),_:1},8,["visible"])]),_:1})])])],64)}}};export{Ke as default};
