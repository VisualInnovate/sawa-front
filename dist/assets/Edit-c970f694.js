import{_ as $,k as y,H as g,a9 as k,z as p,l,o as r,e as i,x as t,y as d,J as C,i as x,t as s,$ as w,f as B,V as v,q as m,n as T,h as o}from"./main-8edbc651.js";import{V as D}from"./VForm-c151f62f.js";import{V as I}from"./VSheet-af1ebb81.js";const N={components:{InputText:y,Calendar:g},data:()=>({maxDate:new Date,toast:k(),NameRules:[e=>(e==null?void 0:e.length)>=3?!0:" name must be at least 3 characters."],child:{name:"",birth_date:""},alert_text:null}),methods:{goBack(){this.$router.go(-1)},submit(){p.post(`/api/child/${this.$route.params.id}/update`,this.child).then(e=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(e=>{})},getChild(){p.get(`/api/child/${this.$route.params.id}`).then(e=>{this.child=e.data.child})}},mounted(){this.getChild()}},S={class:"flex flex-column gap-2 py-2"},M={for:"username"},q={key:0,class:"mt-1 mb-5 text-red-500"},E={class:"flex flex-column gap-2 py-2"},U={for:"username"},z={key:0,class:"mt-1 mb-5 text-red-500"},A={class:"card text-center py-3"};function F(e,a,H,J,R,c){const f=l("InputText"),b=l("Calendar"),_=l("Button"),V=l("Toast");return r(),i("div",null,[t(w,{height:"45",class:"mb-5 text-white",color:"#135C65",onClick:c.goBack},{default:d(()=>[t(C,{start:"",icon:"mdi-arrow-left"}),x(" "+s(e.$t("back")),1)]),_:1},8,["onClick"]),t(I,{"max-width":"1200",class:"mx-auto"},{default:d(()=>[e.alert_text!=null?(r(),B(v,{key:0,type:"success",variant:"tonal",border:"start",elevation:"2",closable:"","close-label":e.$t("close"),text:e.alert_text,class:"mb-8"},null,8,["close-label","text"])):m("",!0),t(D,{"fast-fail":"",onSubmit:a[2]||(a[2]=T(()=>{},["prevent"]))},{default:d(()=>{var u,h;return[o("div",S,[o("label",M,s(e.$t("child_name")),1),t(f,{required:"",class:"bg-[#f7f5f5]",modelValue:e.child.name,"onUpdate:modelValue":a[0]||(a[0]=n=>e.child.name=n),placeholder:e.$t("child_name")},null,8,["modelValue","placeholder"]),(u=e.error)!=null&&u.name?(r(),i("div",q,s(e.error.name[0]),1)):m("",!0)]),o("div",E,[o("label",U,s(e.$t("birth_date")),1),t(b,{style:{width:"100%"},showButtonBar:"",modelValue:e.child.birth_date,"onUpdate:modelValue":a[1]||(a[1]=n=>e.child.birth_date=n),modelModifiers:{number:!0},showIcon:"",placeholder:"dd/mm/yy",maxDate:e.maxDate},null,8,["modelValue","maxDate"]),(h=e.error)!=null&&h.name?(r(),i("div",z,s(e.error.name[0]),1)):m("",!0)]),o("div",A,[t(_,{type:"submit",onClick:c.submit,label:e.$t("submit"),class:"create w-[90%] lg:w-[50%]"},null,8,["onClick","label"])])]}),_:1}),t(V)]),_:1})])}const L=$(N,[["render",F]]);export{L as default};