// يعمل داخل كل إطار (يُستدعى من demo/mock/install.js الملحق بـsrc/axios.js وقت البناء): يطبّق تخصيص الديمو
// على التطبيق الحقيقي دون المسّ بكوده —
// - الشعار: كل <img> مصدرها شعار النظام تُبدَّل بالشعار المرفوع (وتُسترجع عند الإزالة)، وكذلك أيقونة التبويب.
// - الألوان: نمشي على قواعد CSS المحمَّلة (CSSOM، الأصل نفسه) ونبدّل كل لون من عائلتَي النظام بما يقابله من ألوان
//   التخصيص، مع حفظ القيمة الأصلية حتى يصح تغيير اللون مرة بعد مرة أو الرجوع عنه. الأنماط التي تُحمَّل لاحقاً
//   (CSS الصفحات الكسولة، أنماط PrimeVue المحقونة) تُلتقط بمراقب على الشجرة، وكذلك style/fill/stroke المضمّنة.
//   رسوم Chart.js على canvas تبقى بألوانها (مرسومة من الكود لا من CSS).
import { BRAND_KEY, containsBrandColor, hasCustomColors, isLogoSrc, readBrand, remapColor } from "./brand.js";

export function installBranding() {
  if (typeof window === "undefined" || window.__demoBrandInstalled) return;
  window.__demoBrandInstalled = true;

  let brand = readBrand();
  const colorsOn = () => hasCustomColors(brand);

  // ---- أوراق الأنماط ----
  /** كل خاصية فيها لون من العائلتَين: القاعدة والخاصية وقيمتها الأصلية وأولويتها. */
  const records = [];
  const seenSheets = new WeakSet();
  const written = new WeakMap(); // عنصر → {سمة: آخر قيمة كتبناها} حتى لا نعالج كتابتنا نحن

  function applyRecords(list) {
    const on = colorsOn();
    for (const r of list) {
      try { r.st.setProperty(r.p, on ? remapColor(r.v, brand) : r.v, r.pr); } catch { /* قاعدة أُزيلت */ }
    }
  }
  function walk(rules) {
    for (const rule of rules) {
      let inner = null;
      try { inner = rule.cssRules; } catch { inner = null; }
      if (inner && inner.length) walk(inner);
      const st = rule.style;
      if (!st) continue;
      for (let i = 0; i < st.length; i++) {
        const p = st[i];
        const v = st.getPropertyValue(p);
        if (containsBrandColor(v)) records.push({ st, p, v, pr: st.getPropertyPriority(p) });
      }
    }
  }
  function collect(sheet) {
    let rules;
    try { rules = sheet.cssRules; } catch { return; } // ورقة من أصل آخر (خطوط Google)
    seenSheets.add(sheet);
    const start = records.length;
    walk(rules);
    if (records.length > start) applyRecords(records.slice(start));
  }
  function scanSheets() {
    for (const s of document.styleSheets) if (!seenSheets.has(s)) collect(s);
  }

  // ---- العناصر ----
  function setAttr(el, a, v) {
    let m = written.get(el);
    if (!m) written.set(el, (m = {}));
    m[a] = v;
    el.setAttribute(a, v);
  }
  const ours = (el, a, cur) => written.get(el)?.[a] === cur;

  function swapLogo(img) {
    const src = img.getAttribute("src");
    if (src == null || ours(img, "src", src)) return;
    if (brand.logo) {
      if (isLogoSrc(src)) { img.dataset.demoOSrc = src; setAttr(img, "src", brand.logo); }
    } else if (img.dataset.demoOSrc !== undefined) {
      const o = img.dataset.demoOSrc; delete img.dataset.demoOSrc; setAttr(img, "src", o);
    }
  }
  function swapIcon(link) {
    if (!/\bicon\b/i.test(link.getAttribute("rel") ?? "")) return;
    const href = link.getAttribute("href");
    if (href == null || ours(link, "href", href)) return;
    if (brand.logo) {
      if (isLogoSrc(href)) { link.dataset.demoOHref = href; setAttr(link, "href", brand.logo); }
    } else if (link.dataset.demoOHref !== undefined) {
      const o = link.dataset.demoOHref; delete link.dataset.demoOHref; setAttr(link, "href", o);
    }
  }
  const dsKey = (a) => "demoO" + a[0].toUpperCase() + a.slice(1);
  function recolorAttr(el, a) {
    const cur = el.getAttribute(a);
    if (cur == null || ours(el, a, cur)) return;
    const key = dsKey(a);
    if (colorsOn() && containsBrandColor(cur)) { el.dataset[key] = cur; setAttr(el, a, remapColor(cur, brand)); }
    else if (el.dataset[key] !== undefined) delete el.dataset[key]; // القيمة تغيّرت من التطبيق إلى ما لا يخصّنا
  }
  const ATTRS = ["style", "fill", "stroke"];
  function handleEl(el) {
    if (el.tagName === "IMG") swapLogo(el);
    else if (el.tagName === "LINK") swapIcon(el);
    for (const a of ATTRS) if (el.hasAttribute(a)) recolorAttr(el, a);
  }
  function processTree(root) {
    if (root.nodeType !== 1) return;
    handleEl(root);
    root.querySelectorAll("img,link,[style],[fill],[stroke]").forEach(handleEl);
  }

  /** بعد تغيير التخصيص: الأوراق من قيمها الأصلية، والعناصر المبدَّلة من أصولها، ثم مسح الشجرة لما لم يُبدَّل بعد. */
  function reapply() {
    applyRecords(records);
    const on = colorsOn();
    document.querySelectorAll("[data-demo-o-style],[data-demo-o-fill],[data-demo-o-stroke]").forEach((el) => {
      for (const a of ATTRS) {
        const o = el.dataset[dsKey(a)];
        if (o === undefined) continue;
        if (on) setAttr(el, a, remapColor(o, brand));
        else { setAttr(el, a, o); delete el.dataset[dsKey(a)]; }
      }
    });
    document.querySelectorAll("img[data-demo-o-src]").forEach((img) => {
      if (brand.logo) setAttr(img, "src", brand.logo);
      else { const o = img.dataset.demoOSrc; delete img.dataset.demoOSrc; setAttr(img, "src", o); }
    });
    document.querySelectorAll("link[data-demo-o-href]").forEach((link) => {
      if (brand.logo) setAttr(link, "href", brand.logo);
      else { const o = link.dataset.demoOHref; delete link.dataset.demoOHref; setAttr(link, "href", o); }
    });
    processTree(document.documentElement);
  }

  // ---- المراقبة ----
  let sheetScan = 0;
  const scheduleScan = () => { if (!sheetScan) sheetScan = setTimeout(() => { sheetScan = 0; scanSheets(); }, 0); };
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "attributes") {
        const el = m.target;
        if (m.attributeName === "src") { if (el.tagName === "IMG") swapLogo(el); }
        else if (m.attributeName === "href") { if (el.tagName === "LINK") swapIcon(el); }
        else recolorAttr(el, m.attributeName);
      } else if (m.type === "childList") {
        if (m.target.tagName === "STYLE") scheduleScan();
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.tagName === "STYLE") scheduleScan();
          else if (n.tagName === "LINK") { n.addEventListener("load", scheduleScan); scheduleScan(); }
          processTree(n);
        });
      } else if (m.type === "characterData" && m.target.parentNode?.tagName === "STYLE") scheduleScan();
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["src", "href", "style", "fill", "stroke"] });

  window.addEventListener("storage", (e) => {
    if (e.key !== null && e.key !== BRAND_KEY) return;
    brand = readBrand();
    reapply();
  });
  window.addEventListener("load", scheduleScan);
  document.querySelectorAll('link[rel="stylesheet"]').forEach((l) => l.addEventListener("load", scheduleScan));

  scanSheets();
  processTree(document.documentElement);
}
