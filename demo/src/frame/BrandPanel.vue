<script setup lang="ts">
// لوحة التخصيص: شعار العميل وألوانه الأساسية تُطبَّق فوراً على الشِّل وعلى الهاتف والحاسوب (التطبيق الحقيقي داخلهما).
import { computed, ref } from "vue";
import { useBrand } from "@demo/engine/useBrand";

const emit = defineEmits<{ close: [] }>();
const { brand, setLogo, setColors, reset, isDefault } = useBrand();
const busy = ref(false);
const error = ref("");
const fileInput = ref<HTMLInputElement | null>(null);

const presets = [
  { name: "سوا (الأصلي)", primary: "#135c65", secondary: "#b21553" },
  { name: "أزرق", primary: "#1f4e9c", secondary: "#e4572e" },
  { name: "أخضر", primary: "#1e7a4c", secondary: "#d9a21b" },
  { name: "بنفسجي", primary: "#5b3fa3", secondary: "#e0457b" },
  { name: "كحلي", primary: "#0a2540", secondary: "#fdb01a" },
];
const activePreset = computed(() => presets.find((p) => p.primary.toLowerCase() === brand.value.primary.toLowerCase() && p.secondary.toLowerCase() === brand.value.secondary.toLowerCase())?.name);

async function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  error.value = "";
  if (!file.type.startsWith("image/")) { error.value = "اختر ملف صورة (PNG أو SVG أو JPG)."; return; }
  busy.value = true;
  try { await setLogo(file); }
  catch (err) { error.value = (err as Error).message || "تعذّر قراءة الصورة."; }
  finally { busy.value = false; if (fileInput.value) fileInput.value.value = ""; }
}
function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0];
  if (file && fileInput.value) { const dt = new DataTransfer(); dt.items.add(file); fileInput.value.files = dt.files; fileInput.value.dispatchEvent(new Event("change")); }
}
const hexOk = (v: string) => /^#[0-9a-f]{6}$/i.test(v);
function onHex(key: "primary" | "secondary", v: string) {
  const s = v.trim().startsWith("#") ? v.trim() : `#${v.trim()}`;
  if (hexOk(s)) setColors({ [key]: s.toLowerCase() });
}
</script>

<template>
  <aside class="brand-panel" @dragover.prevent @drop.prevent="onDrop">
    <header>
      <b>تخصيص الديمو</b>
      <button class="x" @click="emit('close')" aria-label="إغلاق">×</button>
    </header>
    <p class="hint">يُطبَّق فوراً على الشِّل وعلى شاشتَي الهاتف والحاسوب، ويبقى محفوظاً في هذا المتصفح.</p>

    <section>
      <h4>الشعار</h4>
      <div class="logo-row">
        <div class="logo-preview" :class="{ empty: !brand.logo }">
          <img v-if="brand.logo" :src="brand.logo" alt="" />
          <span v-else>شعار النظام الافتراضي</span>
        </div>
        <div class="logo-actions">
          <label class="btn btn-navy">
            {{ busy ? "جارٍ…" : brand.logo ? "تغيير الشعار" : "رفع شعار" }}
            <input ref="fileInput" type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" hidden :disabled="busy" @change="onFile" />
          </label>
          <button v-if="brand.logo" class="btn btn-soft" @click="setLogo(null)">إزالة</button>
          <small>PNG بخلفية شفافة أو SVG؛ يمكن سحب الملف إلى هنا.</small>
        </div>
      </div>
      <p v-if="error" class="err">{{ error }}</p>
    </section>

    <section>
      <h4>الألوان الأساسية</h4>
      <div class="color-row">
        <label>الأساسي <small>(لوحة التحكم والأزرار)</small></label>
        <input type="color" :value="brand.primary" @input="setColors({ primary: ($event.target as HTMLInputElement).value })" />
        <input class="hex ltr" :value="brand.primary" maxlength="7" spellcheck="false" @change="onHex('primary', ($event.target as HTMLInputElement).value)" />
      </div>
      <div class="color-row">
        <label>الثانوي <small>(بوابة الأهل)</small></label>
        <input type="color" :value="brand.secondary" @input="setColors({ secondary: ($event.target as HTMLInputElement).value })" />
        <input class="hex ltr" :value="brand.secondary" maxlength="7" spellcheck="false" @change="onHex('secondary', ($event.target as HTMLInputElement).value)" />
      </div>
      <div class="presets">
        <button v-for="p in presets" :key="p.name" class="preset" :class="{ on: activePreset === p.name }" :title="p.name" @click="setColors({ primary: p.primary, secondary: p.secondary })">
          <i :style="{ background: p.primary }" /><i :style="{ background: p.secondary }" />
          <span>{{ p.name }}</span>
        </button>
      </div>
    </section>

    <footer>
      <button class="btn btn-soft" :disabled="isDefault" @click="reset">استعادة الافتراضي</button>
      <button class="btn btn-primary" @click="emit('close')">تم</button>
    </footer>
  </aside>
</template>

<style scoped>
.brand-panel { position: fixed; inset-inline-end: 1rem; top: 4.6rem; width: 400px; max-height: calc(100vh - 10rem); overflow: auto; background: var(--surface-raised); color: var(--ink); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem 1.2rem; z-index: 60; box-shadow: 0 24px 50px -24px rgb(10 37 64 / .5); display: grid; gap: .8rem; }
header { display: flex; justify-content: space-between; align-items: center; }
header b { font-size: 1.05rem; }
.x { background: none; border: 0; color: inherit; font-size: 1.5rem; line-height: 1; }
.hint { margin: 0; color: var(--ink-muted); font-size: .8rem; line-height: 1.5; }
section { display: grid; gap: .5rem; padding-top: .6rem; border-top: 1px solid var(--border); }
h4 { font-size: .9rem; color: var(--ink-accent); }
.logo-row { display: flex; gap: .8rem; align-items: center; }
.logo-preview { flex: none; width: 120px; height: 72px; border-radius: 12px; border: 1px dashed var(--border); background: repeating-conic-gradient(#f1f4f7 0 25%, #fff 0 50%) 0 0 / 16px 16px; display: grid; place-items: center; overflow: hidden; }
.logo-preview img { max-width: 100%; max-height: 100%; object-fit: contain; }
.logo-preview.empty span { font-size: .7rem; color: var(--ink-muted); text-align: center; padding: .3rem; }
.logo-actions { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center; }
.logo-actions small { flex-basis: 100%; color: var(--ink-muted); font-size: .72rem; }
.logo-actions .btn { padding: .35rem .9rem; font-size: .85rem; }
.err { margin: 0; color: #b42318; font-size: .8rem; }
.color-row { display: grid; grid-template-columns: 1fr auto 92px; gap: .6rem; align-items: center; font-size: .85rem; font-weight: 600; }
.color-row small { display: block; font-weight: 400; color: var(--ink-muted); font-size: .72rem; }
input[type="color"] { width: 44px; height: 32px; border: 1px solid var(--border); border-radius: 8px; padding: 2px; background: #fff; cursor: pointer; }
.hex { width: 100%; border: 1px solid var(--border); border-radius: 8px; padding: .25rem .5rem; font: inherit; font-size: .85rem; text-align: center; }
.presets { display: flex; flex-wrap: wrap; gap: .4rem; }
.preset { display: inline-flex; align-items: center; gap: .3rem; border: 1px solid var(--border); background: #fff; border-radius: 999px; padding: .15rem .6rem .15rem .4rem; font-size: .75rem; font-weight: 600; color: var(--ink-muted); }
.preset.on { border-color: var(--brand-blue); color: var(--ink); }
.preset i { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }
footer { display: flex; justify-content: space-between; gap: .5rem; padding-top: .6rem; border-top: 1px solid var(--border); }
.btn:disabled { opacity: .5; cursor: default; }
</style>
