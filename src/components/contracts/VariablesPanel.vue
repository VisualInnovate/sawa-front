<script setup>
// «قائمة المتغيرات المتاحة»: click a variable to put {{name}} where the cursor is in the contract text.
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  variables: { type: Array, default: () => [] },
  groups: { type: Object, default: () => ({}) },
  used: { type: Array, default: () => [] },
});
const emit = defineEmits(["pick"]);
const { t, locale } = useI18n();

const search = ref("");
const label = (v) => (locale.value === "ar" ? v.label_ar : v.label_en);
const usedSet = computed(() => new Set(props.used));
const grouped = computed(() => {
  const q = search.value.trim().toLowerCase();
  const list = props.variables.filter((v) => !q || v.name.includes(q) || v.label_ar.includes(q) || v.label_en.toLowerCase().includes(q));
  return Object.keys(props.groups).map((key) => ({ key, label: locale.value === "ar" ? props.groups[key].ar : props.groups[key].en, items: list.filter((v) => v.group === key) })).filter((g) => g.items.length);
});
</script>

<template>
  <aside class="vp">
    <p class="vp-title">{{ t("ct.vars_title") }}</p>
    <p class="vp-hint">{{ t("ct.vars_hint") }}</p>
    <IconField class="mb-2">
      <InputIcon class="pi pi-search" />
      <InputText v-model="search" class="w-full" size="small" :placeholder="t('ct.vars_search')" :aria-label="t('ct.vars_search')" />
    </IconField>
    <div class="vp-list">
      <section v-for="g in grouped" :key="g.key">
        <p class="vp-group">{{ g.label }}</p>
        <button v-for="v in g.items" :key="v.name" type="button" class="vp-item" :class="{ used: usedSet.has(v.name) }" :title="t('ct.source_' + v.source)" @mousedown.prevent @click="emit('pick', v.name)">
          <span class="vp-label">
            <span>{{ label(v) }}<i v-if="usedSet.has(v.name)" class="pi pi-check vp-check" :aria-label="t('ct.used')" /></span>
            <small>{{ t("ct.source_" + v.source) }}</small>
          </span>
          <code class="vp-token">{{ "{" + "{ " + v.name + " }" + "}" }}</code>
        </button>
      </section>
      <p v-if="!grouped.length" class="vp-hint text-center">{{ t("ct.vars_none") }}</p>
    </div>
  </aside>
</template>

<style scoped>
.vp { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; display: flex; flex-direction: column; max-height: 70vh; }
@media (min-width: 1101px) { .vp { max-height: calc(100vh - 140px); position: sticky; top: 80px; } }
.vp-title { font-weight: 800; font-size: 1.05rem; margin: 0 0 .25rem; }
.vp-hint { color: #64748b; font-size: .82rem; margin: 0 0 .75rem; line-height: 1.6; }
.vp-list { overflow-y: auto; display: grid; gap: .4rem; padding-inline-end: 4px; }
.vp-group { font-size: .78rem; font-weight: 800; color: rgb(var(--bp-135c65)); margin: .5rem 0 .2rem; }
.vp-item { width: 100%; display: flex; flex-direction: column; align-items: stretch; gap: .25rem; text-align: start; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: .5rem .65rem; cursor: pointer; margin-bottom: .35rem; font: inherit; color: inherit; }
.vp-item:hover, .vp-item:focus-visible { border-color: rgb(var(--bp-135c65)); background: #f0fdfa; outline: none; }
.vp-item.used { border-color: #99d5cc; }
.vp-label { display: grid; font-weight: 700; font-size: .88rem; }
.vp-label small { color: #94a3b8; font-weight: 500; font-size: .72rem; }
.vp-check { color: #0f766e; font-size: .7rem; margin-inline-start: .35rem; }
.vp-token { direction: rtl; color: #0f766e; font-size: .78rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: end; }
</style>
