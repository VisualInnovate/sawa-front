import{_ as i,a as p,L as c,aa as m,c as a,r as o,o as _,H as f,g,e as s,t as b,f as l,Y as h}from"./main-21be89f2.js";import"./moment-fbc5633a.js";const $={components:{InputText:p,Calendar:c},data:()=>({pasrents:{},submitted:!1,toast:m(),data:{},modules:[],custom:{}}),methods:{goBack(){this.$router.go(-1)},get_request(t){a.get(`/api/attributes/${t}/${localStorage.getItem("appLang")}`).then(e=>{console.log(e.data.countries),this.data=e.data.data})},getModules(){a.get("/api/all-modules").then(t=>{console.log(t.data.countries),this.modules=t.data.data})}},mounted(){this.getModules()}},V={class:"flex flex-column gap-2"},w={class:"w-full",for:"username"};function y(t,e,v,x,B,n){const d=o("Dropdown"),r=o("Toast");return _(),f(h,{class:"p-[1%]"},{default:g(()=>[s("div",V,[s("label",w,b(t.$t("attributable_type")),1),l(d,{"onUpdate:modelValue":[n.get_request,e[0]||(e[0]=u=>t.custom.attributable_type=u)],filter:"",required:"",id:"pv_id_1",style:{direction:"ltr !important"},modelValue:t.custom.attributable_type,"option-value":"name",options:t.modules,optionLabel:"name",class:"w-full bg-[#f7f5f5]"},null,8,["onUpdate:modelValue","modelValue","options"])]),l(r)]),_:1})}const k=i($,[["render",y]]);export{k as default};
