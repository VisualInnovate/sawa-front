import{_ as v,y as c,k as y,o as n,e as r,h as t,t as s,q as _,F as x,z as w,x as b,i as p,G as T,L as $,O as I}from"./main-4fe28c25.js";import{S as u}from"./sweetalert2.all-5e0a548f.js";import{s as V}from"./inputtext.esm-34638ead.js";const S={components:{InputText:V},props:{treatment:{type:Object,required:!0}},computed:{formatDayInArabic(){if(this.treatment&&this.treatments.created_at){const e=new Date(this.treatments.created_at),o={weekday:"long"};return new Intl.DateTimeFormat("ar-EG",o).format(e)}else return"N/A"}},data(){return{dayName:"",searchQuery:"",createdAt:"",editData:!1,treatments:{},oneTreatment:[]}},methods:{editItem(e){this.$router.push({name:"EditTreatment",params:{id:e}})},addtherapeutic(){this.$router.push({name:"Therapeutic"})},performSearch(){console.log("Searching for:",this.searchQuery)},getTreatments(){c.get("api/treatments").then(e=>{console.log(e.data.treatments),this.treatments=e.data.treatments})},getOneTreatment(e){c.get(`api/treatments/${e}`).then(o=>{this.oneTreatment=o.data.oneTreatment,console.log(this.oneTreatment)})},deleteOneTreatment(e){c.delete(`api/treatments/${e}`).then(o=>{console.log(o),u.fire("تم الحذف بنجاح!","Your treatment has been deleted.","success");const l=this.treatments.findIndex(h=>h.id===e);l!==-1&&this.treatments.splice(l,1)}).catch(o=>{console.error("There was an error deleting the treatment: ",o),u.fire("Error!","There was a problem deleting your treatment.","error")})},openAddDataModal(){console.log("Opening add data modal")},openEditDataForm(){this.editData=!0}},mounted(){this.getTreatments(),this.getOneTreatment()}},g=e=>($("data-v-36c8e875"),e=e(),I(),e),k={class:"container relative"},A={class:"grid grid-cols-1 gap-8 lg:grid-cols-3 shadow p-4"},C={class:"paragraph text-2xl"},D={class:"relative"},F={style:{margin:"auto",border:"2px solid #135C65"},class:"py-2 rounded-full w-[50%] h-[50%]"},O={style:{margin:"auto"},xmlns:"http://www.w3.org/2000/svg",width:"23.391",height:"26.316",viewBox:"0 0 23.391 26.316"},B=g(()=>t("path",{id:"plus",d:"M17.495,19.12V29.354a1.388,1.388,0,0,1-1.3,1.462,1.388,1.388,0,0,1-1.3-1.462V19.12H5.8a1.472,1.472,0,0,1,0-2.924h9.1V5.962A1.388,1.388,0,0,1,16.2,4.5a1.388,1.388,0,0,1,1.3,1.462V16.2h9.1a1.472,1.472,0,0,1,0,2.924Z",transform:"translate(-4.5 -4.5)",fill:"#148a98","fill-rule":"evenodd"},null,-1)),E=[B],N={class:"m-auto cursor-pointer text-xl w-full"},M={style:{height:"70vh","overflow-y":"scroll"},class:"over"},Q={class:"shadow bg-slate-100 pt-[5%] hover:bg-[#dbebf5] rounded-md py-5 my-2 bg-[#F8F8F8]"},L={style:{"border-bottom":"1px solid black"},class:"px-[1%]"},Z={class:"font-bold text-[#135C65]"},q={class:"flex py-1"},G={class:"font-bold"},H={class:"flex py-1"},j={class:"font-bold"},z={class:"flex py-1"},P={class:"font-bold"},U={class:"flex py-1"},Y={class:"font-bold"},J={class:"flex py-1"},K={class:"font-bold"},R={class:"grid grid-cols-2"},W={class:"px-[1%] py-1"},X={class:"flex"},tt={class:"font-bold px-2"},et={class:"px-1"},st={class:"flex py-2"},ot=g(()=>t("svg",{class:"my-auto px-1",xmlns:"http://www.w3.org/2000/svg",width:"19.65",height:"19.641",viewBox:"0 0 9.65 9.641"},[p(" ``````"),t("path",{id:"price",d:"M9.513,6.408,6.45,9.471a.6.6,0,0,1-.839,0L.2,4.062a1.115,1.115,0,0,1-.17-.745V.6A.575.575,0,0,1,.211.174.587.587,0,0,1,.635,0H3.349A1.134,1.134,0,0,1,4.1.17l5.409,5.4a.6.6,0,0,1,.17.424.564.564,0,0,1-.17.415ZM2.445,1.2a1.163,1.163,0,0,0-.853.353,1.161,1.161,0,0,0-.353.853,1.164,1.164,0,0,0,.353.853,1.162,1.162,0,0,0,.853.353A1.162,1.162,0,0,0,3.3,3.256,1.164,1.164,0,0,0,3.651,2.4,1.161,1.161,0,0,0,3.3,1.55,1.163,1.163,0,0,0,2.445,1.2Z",transform:"translate(-0.032)",fill:"#148a98"}),p(" ````````")],-1)),at={class:"font-bold text-[#135C65]"},nt={class:"px-1"},rt={class:"m-auto"};function lt(e,o,l,h,i,d){const f=y("InputText");return n(),r("div",k,[t("div",A,[t("div",C,[t("h2",null,s(e.$t("addTherapeutic")),1),t("p",null,s(e.$t("listaddTherapeutic")),1)]),t("div",D,[t("i",{class:"pi pi-search absolute top-[20%] right-[5%] font-bold cursor-pointer",onClick:o[0]||(o[0]=a=>d.performSearch())}),_(f,{style:{"text-align":"center"},class:"lg:w-full",modelValue:i.searchQuery,"onUpdate:modelValue":o[1]||(o[1]=a=>i.searchQuery=a),placeholder:"Search"},null,8,["modelValue"])]),t("div",{onClick:o[2]||(o[2]=a=>d.addtherapeutic()),class:"m-auto"},[t("div",F,[(n(),r("svg",O,E))]),t("p",N,s(e.$t("addtype")),1)])]),t("div",M,[(n(!0),r(x,null,w(i.treatments,a=>{var m;return n(),r("div",Q,[t("div",L,[t("h2",Z,s(e.$t("merge")),1),t("div",q,[t("p",G,s(e.$t("Appointment_type"))+" :",1),t("p",null,s(a.appointment.title),1)]),t("div",H,[t("p",j,s(e.$t("typesessaion"))+" :",1),t("p",null,s(a.session_types.title),1)]),t("div",z,[t("p",P,s(e.$t("Typetreatment"))+" :",1),t("p",null,s(a.treatment_type.title),1)]),t("div",U,[t("p",Y,s(e.$t("ProgramType"))+" :",1),t("p",null,s(a.program_system.title),1)]),t("div",J,[t("p",K,s(e.$t("roomnumber"))+" :",1),t("p",null,s(a.rooms.title),1)])]),t("div",R,[t("div",W,[t("div",X,[t("p",tt,s(e.$t("doctord"))+" :",1),t("p",et,s((m=a.user)==null?void 0:m.title),1)]),t("div",st,[ot,t("p",at,s(e.$t("price"))+" : ",1),t("p",nt,s(a.price),1)])]),t("div",rt,[_(T,{small:"",color:"primary",class:"mr-2",onClick:it=>d.editItem(a.id)},{default:b(()=>[p("mdi-pencil")]),_:2},1032,["onClick"])])])])}),256))])])}const ht=v(S,[["render",lt],["__scopeId","data-v-36c8e875"]]);export{ht as default};