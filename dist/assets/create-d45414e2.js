import{_ as b,c as p,r,o as c,d as m,e as l,t as n,g as y,f as i,w as V,E as C,G as a,X as w,F as x}from"./main-d5d5ddd5.js";import{E as F,S as k}from"./index-211985c9.js";const D={components:{GoogleMap:F,Circle:k},data(){return{submitted:!1,center:{lat:37.09,lng:8.712},cities:{chicago:{center:{lat:41.878,lng:45.629},population:5e3}},circles:{},student:{},children:{},areas:{},error:{},maxDate:new Date}},computed:{computedCircles(){const e={};for(const s in this.cities)e[s]={center:this.cities[s].center,radius:Math.sqrt(this.cities[s].population)*100,strokeColor:"#FF0000",strokeOpacity:.8,strokeWeight:2,fillColor:"#FF0000",fillOpacity:.35};return e}},methods:{setupCircles(){this.circles=this.computedCircles},Therapeutic(){this.$router.push({name:"student-transportation"})},arr(){return this.roomType=[{name:"angel car",value:0},{name:"bus",value:1},{name:"Minibus",value:2}]},trip(){return this.roomType=[{name:this.$t("One_way"),value:0},{name:this.$t("tow_way"),value:1}]},getareas(){p.get("api/region").then(e=>{console.log(e.data.data),this.areas=e.data.data}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},getusers(){p.get("api/child").then(e=>{console.log(e.data.data),this.children=e.data.children}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},createtreatment(){p.post("/api/student-transportation",this.student).then(e=>{this.$toast.add({severity:"success",summary:this.$t("success_message"),detail:`${this.$t("element_add_success")}`,life:3e3})}).catch(e=>{this.$toast.add({severity:"error",summary:this.$t("error"),detail:`${e.response.data.message}`,life:3e3})})}},mounted(){this.setupCircles(),this.getusers(),this.getareas()}},q={class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold"},T={key:0,class:"loader"},E={class:"flex flex-column gap-2"},M={for:"username"},S={class:"flex flex-column gap-2"},U={for:"username"},B={class:"flex flex-column gap-2"},N={for:"username"},I={class:"flex flex-column gap-2"},L={for:"username"},O={class:"flex flex-column gap-2"},A={for:"username"},G={class:"flex flex-column gap-2"},z={for:"username"},W={class:"flex flex-column gap-2 w-full"},X={style:{visibility:"hidden"},for:"username"},j=l("small",{id:"username-help"},null,-1);function H(e,s,J,K,t,d){const h=r("MultiSelect"),u=r("Dropdown"),_=r("InputNumber"),f=r("InputText"),g=r("Button"),v=r("toast");return c(),m(x,null,[l("div",null,[l("div",null,[l("p",q,n(e.$t("student_tans")),1)]),e.loading?(c(),m("div",T)):y("",!0)]),i(w,null,{default:V(()=>[l("div",null,[l("form",{class:"p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4",ref:"myForm",onSubmit:s[7]||(s[7]=C((...o)=>d.createtreatment&&d.createtreatment(...o),["prevent"]))},[l("div",E,[l("label",M,n(e.$t("child_name")),1),i(h,{filter:"",required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.child_ids,"onUpdate:modelValue":s[0]||(s[0]=o=>t.student.child_ids=o),"option-value":"id",options:t.children,optionLabel:"name",placeholder:e.$t("child_name"),class:a({"p-invalid":t.submitted&&!t.student.child_ids})},null,8,["modelValue","options","placeholder","class"])]),l("div",S,[l("label",U,n(e.$t("area_name")),1),i(u,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.region_id,"onUpdate:modelValue":s[1]||(s[1]=o=>t.student.region_id=o),"option-value":"id",options:t.areas,optionLabel:"name",placeholder:e.$t("area_name"),class:a({"p-invalid":t.submitted&&!t.student.region_id})},null,8,["modelValue","options","placeholder","class"])]),l("div",B,[l("label",N,n(e.$t("vecile_type")),1),i(u,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.type,"onUpdate:modelValue":s[2]||(s[2]=o=>t.student.type=o),"option-value":"value",options:d.arr(),optionLabel:"name",placeholder:e.$t("vecile_type"),class:a({"p-invalid":t.submitted&&!t.student.type})},null,8,["modelValue","options","placeholder","class"])]),l("div",I,[l("label",L,n(e.$t("trip_type")),1),i(u,{required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.student.trip_type,"onUpdate:modelValue":s[3]||(s[3]=o=>t.student.trip_type=o),"option-value":"value",options:d.trip(),optionLabel:"name",placeholder:e.$t("trip_type"),class:a({"p-invalid":t.submitted&&!t.student.trip_type})},null,8,["modelValue","options","placeholder","class"])]),l("div",O,[l("label",A,n(e.$t("price")),1),i(_,{required:"",class:a(["bg-[#f7f5f5]",{"p-invalid":t.submitted&&!t.student.price}]),modelValue:t.student.price,"onUpdate:modelValue":s[4]||(s[4]=o=>t.student.price=o),placeholder:e.$t("price")},null,8,["modelValue","placeholder","class"])]),l("div",G,[l("label",z,n(e.$t("student_location")),1),i(f,{required:"",class:a(["bg-[#f7f5f5]",{"p-invalid":t.submitted&&!t.student.location_url}]),modelValue:t.student.location_url,"onUpdate:modelValue":s[5]||(s[5]=o=>t.student.location_url=o),placeholder:e.$t("student_location")},null,8,["modelValue","placeholder","class"])]),l("div",W,[l("label",X,n(e.$t("gruop_sessaion")),1),i(g,{type:"submit",class:"create m-auto w-full",onClick:s[6]||(s[6]=o=>t.submitted=!0),label:e.$t("submit")},null,8,["label"]),j])],544),i(v)])]),_:1})],64)}const R=b(D,[["render",H]]);export{R as default};
