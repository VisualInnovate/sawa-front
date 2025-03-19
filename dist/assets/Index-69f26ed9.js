import{m as q,a1 as z,q as n,aj as O,a2 as G,ak as H,r,al as J,o as u,d as p,e as l,f as o,g as a,i as y,L as K,t as i,h,j as _,c as x}from"./main-489d0086.js";const Q={class:"grid",style:{"max-height":"90vh !important","overflow-y":"scroll"}},W={class:"col-12"},X={class:"my-2"},Y={style:{},class:"shadow-xl"},Z={class:"flex w-full justify-between align-items-center"},ee={class:"m-0 my-auto"},te={class:"block mt-2 md:mt-0 p-input-icon-left"},oe=l("i",{class:"pi pi-search"},null,-1),ae={key:0},le={key:1},se={key:2},ne={class:"flex align-items-center justify-content-center"},ie=l("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),re={key:0},ue={__name:"Index",setup(de){const V=q(),g=z(),k=n(!0),w=n({});n("");const b=n(null);n(!1);const m=n(!1),$=n(""),C=n(null),D=n(null),v=n({});O(()=>{R()});const T=()=>{x.get("/api/room").then(e=>{k.value=!1,b.value=e.data.data,console.log(b.value)})};G(()=>{T()});const j=e=>{g.push({name:"EditRoom",params:{id:e}})},N=()=>{g.push({name:"CreateRoom"})},B=e=>{console.log(e),m.value=!0,$.value=e},L=()=>{x.delete(`/api/room/${$.value}`).then(e=>{console.log(e.data),m.value=!1,T(),V.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},P=()=>{D.value.exportCSV()},R=()=>{v.value={global:{value:null,matchMode:H.CONTAINS}}};return(e,s)=>{const d=r("Button"),S=r("Toolbar"),M=r("Toast"),I=r("InputText"),c=r("Column"),F=r("DataTable"),U=r("Dialog"),A=r("va-card"),f=J("can");return u(),p("div",Q,[l("div",W,[o(A,{class:"card"},{default:a(()=>[o(S,{class:"mb-4 shadow-md"},{start:a(()=>[l("div",X,[y(o(d,{label:e.$t("addRoom"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:N},null,8,["label"]),[[f,"room create"]])])]),end:a(()=>[o(d,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:s[0]||(s[0]=t=>P(t))},null,8,["label"])]),_:1}),o(M),l("div",Y,[y((u(),K(F,{ref_key:"dt",ref:D,selection:C.value,"onUpdate:selection":s[2]||(s[2]=t=>C.value=t),value:b.value,loading:k.value,"data-key":"id",paginator:!0,rows:10,filters:v.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:a(()=>[l("div",Z,[l("h5",ee,i(e.$t("room")),1),l("div",null,[l("span",te,[oe,o(I,{modelValue:v.value.global.value,"onUpdate:modelValue":s[1]||(s[1]=t=>v.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:a(()=>[o(c,{"selection-mode":"multiple","header-style":"width: 3rem"}),o(c,{field:"name",header:e.$t("roomnumber"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:a(t=>[h(i(t.data.name),1)]),_:1},8,["header"]),o(c,{field:"admin.name",header:e.$t("roomdoctor"),sortable:!0,"header-style":"width:14%; min-width:14rem;",class:"ltr:text-justify"},{body:a(t=>[h(i(t.data.admin.name),1)]),_:1},8,["header"]),o(c,{field:"type",header:e.$t("typeroom"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:a(t=>[t.data.type==0?(u(),p("p",ae,i(e.$t("typeroom2")),1)):_("",!0),t.data.type==1?(u(),p("p",le,i(e.$t("typeroom1")),1)):_("",!0),t.data.type==2?(u(),p("p",se,i(e.$t("typeroom3")),1)):_("",!0)]),_:1},8,["header"]),o(c,{field:"capacity",header:e.$t("roomsnumber"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:a(t=>[h(i(t.data.capacity),1)]),_:1},8,["header"]),o(c,{"header-style":"min-width:10rem;"},{body:a(t=>[l("div",null,[y(o(d,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:E=>j(t.data.id)},null,8,["onClick"]),[[f,"room edit"]]),y(o(d,{icon:"pi pi-trash",class:"delete mt-2",onClick:E=>B(t.data.id)},null,8,["onClick"]),[[f,"room delete"]])])]),_:1})]),_:1},8,["selection","value","loading","filters"])),[[f,"room list"]]),o(U,{visible:m.value,"onUpdate:visible":s[4]||(s[4]=t=>m.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:a(()=>[o(d,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:s[3]||(s[3]=t=>m.value=!1)},null,8,["label"]),o(d,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:L},null,8,["label"])]),default:a(()=>[l("div",ne,[ie,w.value?(u(),p("span",re,[h(i(e.$t("remove_item"))+" ",1),l("b",null,i(w.value.first_name),1),h("?")])):_("",!0)])]),_:1},8,["visible","header"])])]),_:1})])])}}};export{ue as default};
