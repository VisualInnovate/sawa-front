import{_ as e,c as s}from"./main-8e58ac1b.js";const r={data:()=>({NameRules:[t=>(t==null?void 0:t.length)>=3?!0:" name must be at least 3 characters."],sideProfile:{title:""},type:"success",alert_text:null}),methods:{submit(){s.post(`/api/side-profiles/${this.$route.params.id}/update`,this.sideProfile).then(t=>{t.data.status==200&&(this.sideProfile=[],this.alert_text="side profile added successfully ",this.type="success")}).catch(t=>{this.alert_text=t.response.data.message,this.type="error"})}},mounted(){}};function i(t,a,o,c,d,n){return null}const u=e(r,[["render",i]]);export{u as default};