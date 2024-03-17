import{ag as z,a8 as A,S as n,ah as E,a1 as q,ai as O,l as r,o as m,e as p,h as l,x as o,y as a,t as i,i as h,q as y,z as T}from"./main-9d9218df.js";const G={class:"grid"},H={class:"col-12"},J={class:"my-2"},K={style:{},class:"shadow-xl"},Q={class:"flex w-full justify-between align-items-center"},W={class:"m-0 my-auto"},X={class:"block mt-2 md:mt-0 p-input-icon-left"},Y=l("i",{class:"pi pi-search"},null,-1),Z={key:0},ee={key:1},te={key:2},oe={class:"flex align-items-center justify-content-center"},ae=l("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1),le={key:0},ie={__name:"Index",setup(se){const x=z(),_=A(),b=n(!0),g=n({});n("");const f=n(null);n(!1);const u=n(!1),k=n(""),w=n(null),$=n(null),v=n({});E(()=>{R()});const C=()=>{T.get("/api/room").then(e=>{b.value=!1,f.value=e.data.data,console.log(f.value)})};q(()=>{C()});const D=e=>{_.push({name:"EditRoom",params:{id:e}})},V=()=>{_.push({name:"CreateRoom"})},N=e=>{console.log(e),u.value=!0,k.value=e},S=()=>{T.delete(`/api/room/${k.value}`).then(e=>{console.log(e.data),u.value=!1,C(),x.add({severity:"success",summary:"Successful",detail:"Successful",life:3e3})}).catch(()=>{})},P=()=>{$.value.exportCSV()},R=()=>{v.value={global:{value:null,matchMode:O.CONTAINS}}};return(e,s)=>{const d=r("Button"),j=r("Toolbar"),B=r("Toast"),L=r("InputText"),c=r("Column"),M=r("DataTable"),I=r("Dialog"),F=r("va-card");return m(),p("div",G,[l("div",H,[o(F,{class:"card"},{default:a(()=>[o(j,{class:"mb-4 shadow-md"},{start:a(()=>[l("div",J,[o(d,{label:e.$t("addRoom"),icon:"pi pi-plus",class:"p-button-success mr-2",onClick:V},null,8,["label"])])]),end:a(()=>[o(d,{label:e.$t("export"),icon:"pi pi-upload",class:"export",onClick:s[0]||(s[0]=t=>P(t))},null,8,["label"])]),_:1}),o(B),l("div",K,[o(M,{ref_key:"dt",ref:$,selection:w.value,"onUpdate:selection":s[2]||(s[2]=t=>w.value=t),value:f.value,loading:b.value,"data-key":"id",paginator:!0,rows:10,filters:v.value,"paginator-template":"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown","rows-per-page-options":[5,10,25],"current-page-report-template":"Showing {first} to {last} of {totalRecords} products","responsive-layout":"scroll"},{header:a(()=>[l("div",Q,[l("h5",W,i(e.$t("room")),1),l("div",null,[l("span",X,[Y,o(L,{modelValue:v.value.global.value,"onUpdate:modelValue":s[1]||(s[1]=t=>v.value.global.value=t),placeholder:e.$t("search")},null,8,["modelValue","placeholder"])])])])]),default:a(()=>[o(c,{"selection-mode":"multiple","header-style":"width: 3rem"}),o(c,{field:"name",header:e.$t("roomnumber"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:a(t=>[h(i(t.data.name),1)]),_:1},8,["header"]),o(c,{field:"admin.name",header:e.$t("roomdoctor"),sortable:!0,"header-style":"width:14%; min-width:14rem;",class:"ltr:text-justify"},{body:a(t=>[h(i(t.data.admin.name),1)]),_:1},8,["header"]),o(c,{field:"type",header:e.$t("typeroom"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:a(t=>[t.data.type==0?(m(),p("p",Z,i(e.$t("typeroom2")),1)):y("",!0),t.data.type==1?(m(),p("p",ee,i(e.$t("typeroom1")),1)):y("",!0),t.data.type==2?(m(),p("p",te,i(e.$t("typeroom3")),1)):y("",!0)]),_:1},8,["header"]),o(c,{field:"capacity",header:e.$t("roomsnumber"),sortable:!0,"header-style":"width:14%; min-width:10rem;",class:"ltr:text-justify"},{body:a(t=>[h(i(t.data.capacity),1)]),_:1},8,["header"]),o(c,{"header-style":"min-width:10rem;"},{body:a(t=>[l("div",null,[o(d,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:U=>D(t.data.id)},null,8,["onClick"]),o(d,{icon:"pi pi-trash",class:"delete mt-2",onClick:U=>N(t.data.id)},null,8,["onClick"])])]),_:1})]),_:1},8,["selection","value","loading","filters"]),o(I,{visible:u.value,"onUpdate:visible":s[4]||(s[4]=t=>u.value=t),style:{width:"450px"},header:e.$t("submit"),modal:!0},{footer:a(()=>[o(d,{label:e.$t("no"),icon:"pi pi-times",class:"p-button-text",onClick:s[3]||(s[3]=t=>u.value=!1)},null,8,["label"]),o(d,{label:e.$t("yes"),icon:"pi pi-check",class:"p-button-text",onClick:S},null,8,["label"])]),default:a(()=>[l("div",oe,[ae,g.value?(m(),p("span",le,[h(i(e.$t("remove_item"))+" ",1),l("b",null,i(g.value.first_name),1),h("?")])):y("",!0)])]),_:1},8,["visible","header"])])]),_:1})])])}}};export{ie as default};
