import{ab as u}from"./main-6Vws8vNG.js";const e=n=>String(n??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s]),y=n=>e(n).replace(/\{\{.*?\}\}/g,'<span class="blank"></span>');function $({texts:n,genderLabel:s=null,childName:r=null,date:c=null,t}){const b=document.documentElement.dir||"rtl",g=document.documentElement.lang||"ar",f=new URL(u,window.location.href).href,h=n.map((a,p)=>`<li class="item"><span class="num">${p+1}</span><p>${y(a)}</p></li>`).join(""),x=`<!doctype html>
<html lang="${e(g)}" dir="${b}">
<head>
<meta charset="utf-8">
<title>${e(t("rec_print.title"))}${r?" - "+e(r):""}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 14mm 14mm 16mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    font-family: "Cairo", "Segoe UI", Tahoma, sans-serif;
    color: #1e293b;
    font-size: 13pt;
    line-height: 1.85;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 3px solid #135c65;
  }
  .head img { height: 64px; }
  .academy { font-size: 12pt; font-weight: 700; color: #135c65; }
  .academy small { display: block; font-weight: 400; color: #64748b; font-size: 10pt; }
  h1 { margin: 20px 0 14px; text-align: center; font-size: 20pt; font-weight: 800; color: #135c65; }
  .meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 28px;
    margin-bottom: 18px;
    padding: 10px 16px;
    border: 1px solid #d5e6e8;
    border-radius: 10px;
    background: #f3f9fa;
    font-size: 11.5pt;
  }
  .meta b { color: #135c65; margin-inline-end: 6px; }
  .line { display: inline-block; min-width: 150px; border-bottom: 1px dotted #64748b; }
  ol { list-style: none; margin: 0; padding: 0; }
  .item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 9px 4px;
    border-bottom: 1px dashed #cbd5e1;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .item:last-child { border-bottom: 0; }
  .num {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin-top: 3px;
    border-radius: 50%;
    background: #135c65;
    color: #fff;
    font-weight: 700;
    font-size: 11pt;
  }
  .item p { margin: 0; white-space: pre-line; overflow-wrap: anywhere; }
  .ltr { direction: ltr; unicode-bidi: isolate; }
  .blank { display: inline-block; min-width: 90px; border-bottom: 1px dotted #64748b; }
  .foot {
    margin-top: 26px;
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
    text-align: center;
    color: #64748b;
    font-size: 10pt;
  }
</style>
</head>
<body>
  <header class="head">
    <div class="academy">${e(t("academy_name"))}<small>${e(t("rec_print.subtitle"))}</small></div>
    <img src="${f}" alt="Sawa">
  </header>
  <h1>${e(t("rec_print.title"))}</h1>
  <div class="meta">
    <span><b>${e(t("child_name"))}:</b>${r?`<strong>${e(r)}</strong>`:'<span class="line"></span>'}</span>
    <span><b>${e(t("rec_print.date"))}:</b>${c?`<span class="ltr">${e(c)}</span>`:'<span class="line"></span>'}</span>
    ${s?`<span><b>${e(t("rec_print.wording"))}:</b>${e(s)}</span>`:`<span><b>${e(t("rec_print.count"))}:</b>${n.length}</span>`}
  </div>
  <ol>${h}</ol>
  <div class="foot">${e(t("rec_print.footer"))}</div>
</body>
</html>`,o=document.createElement("iframe");o.setAttribute("aria-hidden","true"),o.style.cssText="position:fixed;width:0;height:0;border:0;right:0;bottom:0;visibility:hidden",document.body.appendChild(o);const i=o.contentDocument;i.open(),i.write(x),i.close();const l=o.contentWindow,m=async()=>{var p;const a=i.querySelector("img");await Promise.race([Promise.all([(p=i.fonts)==null?void 0:p.ready,a&&!a.complete?new Promise(d=>{a.onload=a.onerror=d}):null]),new Promise(d=>setTimeout(d,2500))]),l.addEventListener("afterprint",()=>setTimeout(()=>o.remove(),1e3),{once:!0}),l.focus(),l.print()};i.readyState==="complete"?m():l.addEventListener("load",m,{once:!0})}export{$ as p};
