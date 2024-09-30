import{_ as S,aa as F,c as b,r as k,o as u,d as p,e,t as d,f as r,w as f,X as h,g as m,F as y,h as o}from"./main-a8302db8.js";import{V as L}from"./VTextarea-4cc8af69.js";const U={data(){return{imageSrc:null,imageSrcCover:null,toast:F(),error:"",settings:{name:"",number_1:" ",number_2:" ",address:" ",email:" ",logo:" ",cover:" ",description:" ",social_links:[{facebook:""}]}}},methods:{getSettings(){b.get("/api/site/settings").then(s=>{console.log(s),s.data.settings!=null&&(this.settings=s.data.settings,this.imageSrc=this.settings.logo,this.imageSrcCover=this.settings.cover)}).catch(s=>{console.log(s)})},openFile(){this.$refs.fileInput.click()},openCoverFile(){this.$refs.fileInputCover.click()},handleFileUpload(s){const t=s.target.files[0],g=new FileReader;g.readAsDataURL(t),g.onload=C=>{this.imageSrc=C.target.result,this.settings.logo=t}},handleFileUploadCover(s){const t=s.target.files[0],g=new FileReader;g.readAsDataURL(t),g.onload=C=>{this.imageSrcCover=C.target.result,this.settings.cover=t}},updateSettings(){const s=new FormData;s.append("name",this.settings.name),s.append("number_1",this.settings.number_1),s.append("number_2",this.settings.number_2),s.append("address",this.settings.address),s.append("email",this.settings.email),s.append("description",this.settings.description),s.append("social_links",this.settings.social_links),this.$refs.fileInput.files[0]!=null&&s.append("logo",this.$refs.fileInput.files[0]),this.$refs.fileInput.files[0]!=null&&s.append("cover",this.$refs.fileInputCover.files[0]),b.post("/api/site/settings",s).then(t=>{this.$toast.add({severity:"success",summary:"Success Message",detail:"Success",life:3e3})}).catch(t=>{this.error=t.response.data.errors})}},mounted(){this.getSettings()}},R={class:"",style:{padding:"1rem 1.5rem"}},G={class:"text-2xl font-bold"},E={class:"text-lg",style:{color:"#42a5f5",padding:"0.5rem 0"}},B={class:""},I=e("div",{class:"flex"},[e("label",{class:"my-auto",for:"password"},"Twitter "),e("svg",{class:"mx-6",width:"24px",height:"24px",viewBox:"0 -4 48 48",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",fill:"#000000"},[e("g",{id:"SVGRepo_bgCarrier","stroke-width":"0"}),e("g",{id:"SVGRepo_tracerCarrier","stroke-linecap":"round","stroke-linejoin":"round"}),e("g",{id:"SVGRepo_iconCarrier"},[e("title",null,"Twitter-color"),o(),e("desc",null,"Created with Sketch."),o(),e("defs"),o(),e("g",{id:"Icons",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},[e("g",{id:"Color-",transform:"translate(-300.000000, -164.000000)",fill:"#00AAEC"},[e("path",{d:"M348,168.735283 C346.236309,169.538462 344.337383,170.081618 342.345483,170.324305 C344.379644,169.076201 345.940482,167.097147 346.675823,164.739617 C344.771263,165.895269 342.666667,166.736006 340.418384,167.18671 C338.626519,165.224991 336.065504,164 333.231203,164 C327.796443,164 323.387216,168.521488 323.387216,174.097508 C323.387216,174.88913 323.471738,175.657638 323.640782,176.397255 C315.456242,175.975442 308.201444,171.959552 303.341433,165.843265 C302.493397,167.339834 302.008804,169.076201 302.008804,170.925244 C302.008804,174.426869 303.747139,177.518238 306.389857,179.329722 C304.778306,179.280607 303.256911,178.821235 301.9271,178.070061 L301.9271,178.194294 C301.9271,183.08848 305.322064,187.17082 309.8299,188.095341 C309.004402,188.33225 308.133826,188.450704 307.235077,188.450704 C306.601162,188.450704 305.981335,188.390033 305.381229,188.271578 C306.634971,192.28169 310.269414,195.2026 314.580032,195.280607 C311.210424,197.99061 306.961789,199.605634 302.349709,199.605634 C301.555203,199.605634 300.769149,199.559408 300,199.466956 C304.358514,202.327194 309.53689,204 315.095615,204 C333.211481,204 343.114633,188.615385 343.114633,175.270495 C343.114633,174.831347 343.106181,174.392199 343.089276,173.961719 C345.013559,172.537378 346.684275,170.760563 348,168.735283",id:"Twitter"})])])])])],-1),A={class:""},T=e("div",{class:"flex"},[e("label",{class:"my-auto",for:"password"},"facebook "),e("svg",{class:"mx-6",width:"24px",height:"24px",viewBox:"0 0 48 48",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",fill:"#000000"},[e("g",{id:"SVGRepo_bgCarrier","stroke-width":"0"}),e("g",{id:"SVGRepo_tracerCarrier","stroke-linecap":"round","stroke-linejoin":"round"}),e("g",{id:"SVGRepo_iconCarrier"},[e("title",null,"Facebook-color"),o(),e("desc",null,"Created with Sketch."),o(),e("defs"),o(),e("g",{id:"Icons",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},[e("g",{id:"Color-",transform:"translate(-200.000000, -160.000000)",fill:"#4460A0"},[e("path",{d:"M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z",id:"Facebook"})])])])])],-1),M={class:""},j=e("div",{class:"flex"},[e("label",{class:"my-auto",for:"password"},"Instagram "),e("svg",{class:"mx-6",width:"24px",height:"24px",viewBox:"0 0 32 32",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[e("g",{id:"SVGRepo_bgCarrier","stroke-width":"0"}),e("g",{id:"SVGRepo_tracerCarrier","stroke-linecap":"round","stroke-linejoin":"round"}),e("g",{id:"SVGRepo_iconCarrier"},[e("rect",{x:"2",y:"2",width:"28",height:"28",rx:"6",fill:"url(#paint0_radial_87_7153)"}),o(),e("rect",{x:"2",y:"2",width:"28",height:"28",rx:"6",fill:"url(#paint1_radial_87_7153)"}),o(),e("rect",{x:"2",y:"2",width:"28",height:"28",rx:"6",fill:"url(#paint2_radial_87_7153)"}),o(),e("path",{d:"M23 10.5C23 11.3284 22.3284 12 21.5 12C20.6716 12 20 11.3284 20 10.5C20 9.67157 20.6716 9 21.5 9C22.3284 9 23 9.67157 23 10.5Z",fill:"white"}),o(),e("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z",fill:"white"}),o(),e("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M6 15.6C6 12.2397 6 10.5595 6.65396 9.27606C7.2292 8.14708 8.14708 7.2292 9.27606 6.65396C10.5595 6 12.2397 6 15.6 6H16.4C19.7603 6 21.4405 6 22.7239 6.65396C23.8529 7.2292 24.7708 8.14708 25.346 9.27606C26 10.5595 26 12.2397 26 15.6V16.4C26 19.7603 26 21.4405 25.346 22.7239C24.7708 23.8529 23.8529 24.7708 22.7239 25.346C21.4405 26 19.7603 26 16.4 26H15.6C12.2397 26 10.5595 26 9.27606 25.346C8.14708 24.7708 7.2292 23.8529 6.65396 22.7239C6 21.4405 6 19.7603 6 16.4V15.6ZM15.6 8H16.4C18.1132 8 19.2777 8.00156 20.1779 8.0751C21.0548 8.14674 21.5032 8.27659 21.816 8.43597C22.5686 8.81947 23.1805 9.43139 23.564 10.184C23.7234 10.4968 23.8533 10.9452 23.9249 11.8221C23.9984 12.7223 24 13.8868 24 15.6V16.4C24 18.1132 23.9984 19.2777 23.9249 20.1779C23.8533 21.0548 23.7234 21.5032 23.564 21.816C23.1805 22.5686 22.5686 23.1805 21.816 23.564C21.5032 23.7234 21.0548 23.8533 20.1779 23.9249C19.2777 23.9984 18.1132 24 16.4 24H15.6C13.8868 24 12.7223 23.9984 11.8221 23.9249C10.9452 23.8533 10.4968 23.7234 10.184 23.564C9.43139 23.1805 8.81947 22.5686 8.43597 21.816C8.27659 21.5032 8.14674 21.0548 8.0751 20.1779C8.00156 19.2777 8 18.1132 8 16.4V15.6C8 13.8868 8.00156 12.7223 8.0751 11.8221C8.14674 10.9452 8.27659 10.4968 8.43597 10.184C8.81947 9.43139 9.43139 8.81947 10.184 8.43597C10.4968 8.27659 10.9452 8.14674 11.8221 8.0751C12.7223 8.00156 13.8868 8 15.6 8Z",fill:"white"}),o(),e("defs",null,[e("radialGradient",{id:"paint0_radial_87_7153",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(12 23) rotate(-55.3758) scale(25.5196)"},[e("stop",{"stop-color":"#B13589"}),o(),e("stop",{offset:"0.79309","stop-color":"#C62F94"}),o(),e("stop",{offset:"1","stop-color":"#8A3AC8"})]),o(),e("radialGradient",{id:"paint1_radial_87_7153",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(11 31) rotate(-65.1363) scale(22.5942)"},[e("stop",{"stop-color":"#E0E8B7"}),o(),e("stop",{offset:"0.444662","stop-color":"#FB8A2E"}),o(),e("stop",{offset:"0.71474","stop-color":"#E2425C"}),o(),e("stop",{offset:"1","stop-color":"#E2425C","stop-opacity":"0"})]),o(),e("radialGradient",{id:"paint2_radial_87_7153",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(0.500002 3) rotate(-8.1301) scale(38.8909 8.31836)"},[e("stop",{offset:"0.156701","stop-color":"#406ADC"}),o(),e("stop",{offset:"0.467799","stop-color":"#6A45BE"}),o(),e("stop",{offset:"1","stop-color":"#6A45BE","stop-opacity":"0"})])])])])],-1),Z={class:""},z=e("div",{class:"flex"},[e("label",{class:"my-auto",for:"password"},"youtube "),e("svg",{class:"mx-6",width:"24px",height:"24px",viewBox:"0 -7 48 48",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",fill:"#000000"},[e("g",{id:"SVGRepo_bgCarrier","stroke-width":"0"}),e("g",{id:"SVGRepo_tracerCarrier","stroke-linecap":"round","stroke-linejoin":"round"}),e("g",{id:"SVGRepo_iconCarrier"},[e("title",null,"Youtube-color"),o(),e("desc",null,"Created with Sketch."),o(),e("defs"),o(),e("g",{id:"Icons",stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},[e("g",{id:"Color-",transform:"translate(-200.000000, -368.000000)",fill:"#CE1312"},[e("path",{d:"M219.044,391.269916 L219.0425,377.687742 L232.0115,384.502244 L219.044,391.269916 Z M247.52,375.334163 C247.52,375.334163 247.0505,372.003199 245.612,370.536366 C243.7865,368.610299 241.7405,368.601235 240.803,368.489448 C234.086,368 224.0105,368 224.0105,368 L223.9895,368 C223.9895,368 213.914,368 207.197,368.489448 C206.258,368.601235 204.2135,368.610299 202.3865,370.536366 C200.948,372.003199 200.48,375.334163 200.48,375.334163 C200.48,375.334163 200,379.246723 200,383.157773 L200,386.82561 C200,390.73817 200.48,394.64922 200.48,394.64922 C200.48,394.64922 200.948,397.980184 202.3865,399.447016 C204.2135,401.373084 206.612,401.312658 207.68,401.513574 C211.52,401.885191 224,402 224,402 C224,402 234.086,401.984894 240.803,401.495446 C241.7405,401.382148 243.7865,401.373084 245.612,399.447016 C247.0505,397.980184 247.52,394.64922 247.52,394.64922 C247.52,394.64922 248,390.73817 248,386.82561 L248,383.157773 C248,379.246723 247.52,375.334163 247.52,375.334163 L247.52,375.334163 Z",id:"Youtube"})])])])])],-1),D={class:"text-center font-bold grid grid-cols-2"},H=e("label",{for:"",style:{"font-size":"20px"}},"Site Logo",-1),N={class:"relative m-auto"},q=["src"],P=e("g",{id:"SVGRepo_bgCarrier","stroke-width":"0"},null,-1),O=e("g",{id:"SVGRepo_tracerCarrier","stroke-linecap":"round","stroke-linejoin":"round"},null,-1),Y=e("g",{id:"SVGRepo_iconCarrier"},[e("path",{fill:"#29CCFF",d:"M21 3H3C1.35 3 0 4.35 0 6v12c0 1.55 1.19 2.83 2.7 2.98.1.01.2.02.3.02h18c.1 0 .2 0 .29-.02.03 0 .06-.01.09-.01C22.86 20.78 24 19.52 24 18V6c0-1.65-1.35-3-3-3zm1 13.53l-2.21-4.42c-.25-.5-.69-.87-1.22-1.03-.19-.05-.38-.08-.57-.08-.35 0-.7.09-1.01.27l-6.41 3.74-2.46-1.67C7.78 13.11 7.39 13 7 13c-.52 0-1.03.2-1.41.59L2 17.18V6c0-.55.45-1 1-1h18c.55 0 1 .45 1 1v10.53z"}),e("circle",{fill:"#29CCFF",cx:"11",cy:"10",r:"2"})],-1),X=[P,O,Y],J={class:"w-full"},K=e("label",{for:"",style:{padding:"1rem","font-size":"20px"}},"Site Cover",-1),Q={class:"relative m-auto p-2"},W=["src"],$=e("g",{id:"SVGRepo_bgCarrier","stroke-width":"0"},null,-1),ee=e("g",{id:"SVGRepo_tracerCarrier","stroke-linecap":"round","stroke-linejoin":"round"},null,-1),te=e("g",{id:"SVGRepo_iconCarrier"},[e("path",{fill:"#29CCFF",d:"M21 3H3C1.35 3 0 4.35 0 6v12c0 1.55 1.19 2.83 2.7 2.98.1.01.2.02.3.02h18c.1 0 .2 0 .29-.02.03 0 .06-.01.09-.01C22.86 20.78 24 19.52 24 18V6c0-1.65-1.35-3-3-3zm1 13.53l-2.21-4.42c-.25-.5-.69-.87-1.22-1.03-.19-.05-.38-.08-.57-.08-.35 0-.7.09-1.01.27l-6.41 3.74-2.46-1.67C7.78 13.11 7.39 13 7 13c-.52 0-1.03.2-1.41.59L2 17.18V6c0-.55.45-1 1-1h18c.55 0 1 .45 1 1v10.53z"}),e("circle",{fill:"#29CCFF",cx:"11",cy:"10",r:"2"})],-1),se=[$,ee,te],le={class:"flex flex-column gap-2"},oe={for:"username"},ie={key:0,class:"mt-1 mb-5 text-red-500"},re={class:"flex flex-column gap-2"},ne={for:"username"},ae={key:0,class:"mt-1 mb-5 text-red-500"},de={class:"flex flex-column gap-2"},ce={for:"username"},ue={key:0,class:"mt-1 mb-5 text-red-500"},pe={class:"flex flex-column gap-2"},ge={for:"username"},me={key:0,class:"mt-1 mb-5 text-red-500"},Ce={class:"flex flex-column gap-2"},fe={for:"username"},he={key:0,class:"mt-1 mb-5 text-red-500"},_e={class:""},we={for:"username"};function ve(s,t,g,C,l,n){const c=k("InputText"),V=k("Toast");return u(),p(y,null,[e("div",R,[e("h2",G,d(s.$t("Settings")),1),e("p",E,d(s.$t("settings_menu")),1)]),r(h,null,{default:f(()=>[r(h,{class:"bg-slate-50 m-[2%] p-[2%] grid grid-cols-1 gap-4 lg:grid-cols-2"},{default:f(()=>[e("div",B,[I,r(c,{modelValue:l.settings.social_links.twitter,"onUpdate:modelValue":t[0]||(t[0]=i=>l.settings.social_links.twitter=i),class:"mt-3 w-full mb-3"},null,8,["modelValue"])]),e("div",A,[T,r(c,{type:"text",modelValue:l.settings.social_links.facebook,"onUpdate:modelValue":t[1]||(t[1]=i=>l.settings.social_links.facebook=i),class:"mt-3 w-full mb-3"},null,8,["modelValue"])]),e("div",M,[j,r(c,{modelValue:l.settings.social_links.instagram,"onUpdate:modelValue":t[2]||(t[2]=i=>l.settings.social_links.instagram=i),class:"mt-3 w-full mb-3"},null,8,["modelValue"])]),e("div",Z,[z,r(c,{modelValue:l.settings.social_links.youtube,"onUpdate:modelValue":t[3]||(t[3]=i=>l.settings.social_links.youtube=i),class:"mt-3 w-full mb-3"},null,8,["modelValue"])])]),_:1}),r(h,{class:"bg-slate-50 m-[2%] p-[2%]"},{default:f(()=>[e("div",D,[e("div",null,[H,e("div",N,[e("input",{type:"file",ref:"fileInput",name:"image",id:"image",hidden:"",onChange:t[4]||(t[4]=(...i)=>n.handleFileUpload&&n.handleFileUpload(...i))},null,544),e("img",{onClick:t[5]||(t[5]=(...i)=>n.openFile&&n.openFile(...i)),src:l.imageSrc,class:"uploaded-image relative m-auto cursor-pointer object-cover"},null,8,q),(u(),p("svg",{onClick:t[6]||(t[6]=(...i)=>n.openFile&&n.openFile(...i)),class:"cursor-pointer absolute left-[50%] m-auto bottom-0 bg-white rounded-full p-1 h-8 w-8",viewBox:"-2.4 -2.4 28.80 28.80",xmlns:"http://www.w3.org/2000/svg",fill:"#29CCFF",transform:"matrix(-1, 0, 0, 1, 0, 0)"},X))])]),e("div",J,[K,e("div",Q,[e("input",{type:"file",ref:"fileInputCover",name:"image",id:"image",hidden:"",onChange:t[7]||(t[7]=(...i)=>n.handleFileUploadCover&&n.handleFileUploadCover(...i))},null,544),e("img",{onClick:t[8]||(t[8]=(...i)=>n.openCoverFile&&n.openCoverFile(...i)),src:l.imageSrcCover,class:"uploaded-image relative m-auto w-full cursor-pointer object-cover"},null,8,W),(u(),p("svg",{onClick:t[9]||(t[9]=(...i)=>n.openCoverFile&&n.openCoverFile(...i)),class:"cursor-pointer absolute left-[50%] m-auto bottom-0 bg-white rounded-full p-1 h-8 w-8",viewBox:"-2.4 -2.4 28.80 28.80",xmlns:"http://www.w3.org/2000/svg",fill:"#29CCFF",transform:"matrix(-1, 0, 0, 1, 0, 0)"},se))])])])]),_:1}),r(h,{class:"m-[2%] p-[2%] grid grid-cols-1 gap-4 lg:grid-cols-2 bg-slate-50"},{default:f(()=>{var i,_,w,v,x;return[e("div",le,[e("label",oe,d(s.$t("Site Name ")),1),r(c,{required:"",class:"bg-[#f7f5f5]",modelValue:l.settings.name,"onUpdate:modelValue":t[10]||(t[10]=a=>l.settings.name=a),placeholder:s.$t("Site Name ")},null,8,["modelValue","placeholder"]),(i=l.error)!=null&&i.name?(u(),p("div",ie,d(l.error.name[0]),1)):m("",!0)]),e("div",re,[e("label",ne,d(s.$t("Site Phone")),1),r(c,{required:"",class:"bg-[#f7f5f5]",modelValue:l.settings.number_1,"onUpdate:modelValue":t[11]||(t[11]=a=>l.settings.number_1=a),placeholder:s.$t("Site Phone")},null,8,["modelValue","placeholder"]),(_=l.error)!=null&&_.number_1?(u(),p("div",ae,d(l.error.number_1[0]),1)):m("",!0)]),e("div",de,[e("label",ce,d(s.$t("Site Phone")),1),r(c,{required:"",class:"bg-[#f7f5f5]",modelValue:l.settings.number_2,"onUpdate:modelValue":t[12]||(t[12]=a=>l.settings.number_2=a),placeholder:s.$t("Site Phone")},null,8,["modelValue","placeholder"]),(w=l.error)!=null&&w.number_2?(u(),p("div",ue,d(l.error.number_2[0]),1)):m("",!0)]),e("div",pe,[e("label",ge,d(s.$t("address ")),1),r(c,{required:"",class:"bg-[#f7f5f5]",modelValue:l.settings.address,"onUpdate:modelValue":t[13]||(t[13]=a=>l.settings.address=a),placeholder:s.$t("address ")},null,8,["modelValue","placeholder"]),(v=l.error)!=null&&v.address?(u(),p("div",me,d(l.error.address[0]),1)):m("",!0)]),e("div",Ce,[e("label",fe,d(s.$t("Site Email ")),1),r(c,{required:"",class:"bg-[#f7f5f5]",modelValue:l.settings.email,"onUpdate:modelValue":t[14]||(t[14]=a=>l.settings.email=a),placeholder:s.$t("Site Email ")},null,8,["modelValue","placeholder"]),(x=l.error)!=null&&x.email?(u(),p("div",he,d(l.error.email[0]),1)):m("",!0)]),e("div",_e,[e("label",we,d(s.$t("Site description ")),1),r(L,{rows:"2","bg-color":"#EAE8E9",modelValue:l.settings.description,"onUpdate:modelValue":t[15]||(t[15]=a=>l.settings.description=a)},null,8,["modelValue"])]),e("button",{onClick:t[16]||(t[16]=(...a)=>n.updateSettings&&n.updateSettings(...a)),class:"p-4 mt-10 text-center bg-[#148A98] text-white w-full rounded-2xl text-xl"}," حفظ التغيرات")]}),_:1})]),_:1}),r(V)],64)}const ke=S(U,[["render",ve]]);export{ke as default};