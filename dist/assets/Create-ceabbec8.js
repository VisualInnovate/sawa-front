import{_ as u,D as y,k as _,z as n,l as p,o as f,e as h,h as r,t as m,x as l,y as c,Z as v,i as g,n as D}from"./main-d9195fcd.js";import{V}from"./VForm-ae144aa8.js";const b={components:{Dropdown:y,InputText:_},data(){return{selectedCity:null,selectedValue:"",sessionTypes:[],treatmentTypes:[],doctors:[],roomType:[],formData:{title:"",capacity:15,room_type_id:"",session:"",user_id:"",treatment_id:""}}},computed:{locale(){return this.$i18n.locale}},methods:{arr(){return this.roomType=[{name:this.$t("typeroom2"),value:2},{name:this.$t("typeroom1"),value:1}]},getAllDoctor(){n.get("api/all/doctors").then(e=>{this.doctors=e.data.doctors,console.log(this.doctors)}).catch(e=>{console.error("Error retrieving doctors:",e)})},getTypesesstion(){n.get("api/session-types").then(e=>{this.sessionTypes=e.data.sessionTypes,console.log(this.sessionTypes)}).catch(e=>{console.error("Error retrieving doctors:",e)})},getTreatmentTypes(){n.get("api/treatment-types").then(e=>{this.treatmentTypes=e.data.treatmentTypes,console.log(this.treatmentTypes)}).catch(e=>{console.error("Error retrieving Appointment Types:",e)})},roompage(){this.$router.push({name:"Rooms"})},createRoom(){const e={title:this.formData.title,user_id:this.formData.user_id,capacity:this.formData.capacity,sessation_id:this.formData.session,room_type_id:this.formData.room_type_id,treatment_id:this.formData.treatment_id};n.post("/api/store_room",e).then(t=>{console.log("this add data is sussec:",t),this.$router.push({name:"Rooms"})}).catch(t=>{console.error("Error seeding data:",t)})}},mounted(){this.getTypesesstion(),this.getAllDoctor(),this.getTreatmentTypes()}},T={class:"name-input"},w={class:"py-4"},x={class:"card py-4 flex justify-content-center"},k={class:"card py-4 flex justify-content-center"},C={class:"card py-4 flex justify-content-center"},U={class:"card py-4 flex justify-content-center"},E={class:"py-4"};function j(e,t,B,I,o,i){const d=p("InputText"),a=p("Dropdown");return f(),h("div",null,[r("div",null,[r("p",{class:"text-xl p-4 text-[#135C65] cursor-pointer font-bold",onClick:t[0]||(t[0]=s=>i.roompage())},m(e.$t("room")),1)]),l(V,{onSubmit:D(i.createRoom,["prevent"])},{default:c(()=>[r("div",T,[r("div",w,[l(d,{style:{margin:"auto","text-align":"center","background-color":"#e7e7e7",border:"none","border-bottom":"2px solid black"},placeholder:e.$t("numberroom"),class:"w-full",type:"number",modelValue:o.formData.title,"onUpdate:modelValue":t[1]||(t[1]=s=>o.formData.title=s)},null,8,["placeholder","modelValue"])]),r("div",x,[l(a,{id:"pv_id_1",style:{direction:"ltr !important"},modelValue:o.formData.session,"onUpdate:modelValue":t[2]||(t[2]=s=>o.formData.session=s),"option-value":"id",options:o.sessionTypes,optionLabel:"title",placeholder:e.$t("typesessaion"),class:"w-full [&>div>div>span]:bg-black md:w-14rem"},null,8,["modelValue","options","placeholder"])]),r("div",k,[l(a,{id:"pv_id_1",style:{direction:"ltr !important"},modelValue:o.formData.treatment_id,"onUpdate:modelValue":t[3]||(t[3]=s=>o.formData.treatment_id=s),"option-value":"id",options:o.treatmentTypes,optionLabel:"title",placeholder:e.$t("Typetreatment"),class:"w-full md:w-14rem"},null,8,["modelValue","options","placeholder"])]),r("div",C,[l(a,{id:"pv_id_1",style:{direction:"ltr !important"},modelValue:o.formData.user_id,"onUpdate:modelValue":t[4]||(t[4]=s=>o.formData.user_id=s),"option-value":"id",options:o.doctors,optionLabel:"name",placeholder:e.$t("roomdoctor"),class:"w-full md:w-14rem"},null,8,["modelValue","options","placeholder"])]),r("div",U,[l(a,{id:"pv_id_1",style:{direction:"ltr !important"},modelValue:o.formData.room_type_id,"onUpdate:modelValue":t[5]||(t[5]=s=>o.formData.room_type_id=s),"option-value":"value",options:i.arr(),optionLabel:"name",placeholder:e.$t("typeroom"),class:"w-full md:w-14rem"},null,8,["modelValue","options","placeholder"])]),r("div",E,[l(d,{style:{margin:"auto","text-align":"center","background-color":"#e7e7e7",border:"none","border-bottom":"2px solid black"},class:"w-full",type:"number",modelValue:o.formData.capacity,"onUpdate:modelValue":t[6]||(t[6]=s=>o.formData.capacity=s)},null,8,["modelValue"])])]),l(v,{type:"submit",class:"mt-5 seed m-auto",style:{width:"606px"}},{default:c(()=>[g(m(e.$t("submit")),1)]),_:1})]),_:1},8,["onSubmit"])])}const S=u(b,[["render",j],["__scopeId","data-v-2c6166c4"]]);export{S as default};
