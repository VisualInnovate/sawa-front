<script setup>
// The dashboard's period filter: today, this week, this month, last month or two chosen dates; each figure against
// the period of the same length just before it, and a link to the page that lists it. The choice is kept.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { amount } from "@/utils/accounting";
import { canVisit } from "@/utils/permissions";

const { t, locale } = useI18n();
const router = useRouter();
const KEY = "dashboard-period";
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function rangeOf(preset) {
  const now = new Date();
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (preset === "today") return [day, day];
  if (preset === "week") {
    const start = new Date(day);
    start.setDate(day.getDate() - day.getDay()); // the week starts on Sunday
    return [start, day];
  }
  if (preset === "month") return [new Date(day.getFullYear(), day.getMonth(), 1), day];
  if (preset === "last_month") return [new Date(day.getFullYear(), day.getMonth() - 1, 1), new Date(day.getFullYear(), day.getMonth(), 0)];
  return null;
}

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
})();
const preset = ref(saved?.preset ?? "week");
const custom = ref(saved?.custom ? saved.custom.map((d) => new Date(`${d}T00:00:00`)) : null);
const data = ref(null);
const loading = ref(false);
const open = ref(saved?.open ?? true);

const range = computed(() => (preset.value === "custom" ? (custom.value?.[0] && custom.value?.[1] ? custom.value : null) : rangeOf(preset.value)));

async function load() {
  if (!range.value) return;
  loading.value = true;
  try {
    data.value = (await axios.get("api/dashboard/period", { params: { from: iso(range.value[0]), to: iso(range.value[1]) } })).data.data;
  } catch {
    data.value = null;
  } finally {
    loading.value = false;
  }
}
watch([preset, custom, open], () => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ preset: preset.value, open: open.value, custom: custom.value?.[0] && custom.value?.[1] ? custom.value.map(iso) : null }));
  } catch {
    // this visit only
  }
});
watch(range, (r, old) => {
  if (r && (!old || iso(r[0]) !== iso(old[0]) || iso(r[1]) !== iso(old[1]))) load();
});
onMounted(load);

const presets = ["today", "week", "month", "last_month", "custom"];
const GROUPS = ["sessions", "children", "evaluations", "consultations", "finance", "hr"];
const groups = computed(() =>
  GROUPS.map((g) => ({ key: g, items: (data.value?.figures ?? []).filter((f) => f.group === g) })).filter((g) => g.items.length),
);
const fmtDate = (d) => new Date(`${d}T00:00:00`).toLocaleDateString(locale.value === "ar" ? "ar" : "en", { day: "numeric", month: "short" });
const value = (f) => (f.unit === "money" ? amount(f.value) : f.unit === "%" ? `${f.value}%` : Number(f.value).toLocaleString(locale.value === "ar" ? "ar" : "en"));
// Up is good except for missed sessions and leave days.
const GOOD_DOWN = ["sessions_missed", "leave_days", "programs_stopped"];
const tone = (f) => (f.change === null || f.change === 0 ? "flat" : (f.change > 0) !== GOOD_DOWN.includes(f.key) ? "up" : "down");
const linkOf = (f) => {
  if (!f.link || !data.value) return null;
  const route = { name: f.link.name, query: { from: data.value.from, to: data.value.to } };
  try {
    return canVisit(router.resolve(route).matched.at(-1)) ? route : null;
  } catch {
    return null;
  }
};
</script>

<template>
  <section class="dp">
    <header class="dp-head">
      <button type="button" class="dp-title" :aria-expanded="open" @click="open = !open">
        <i :class="open ? 'pi pi-chevron-down' : 'pi pi-chevron-left'" aria-hidden="true" />
        <i class="pi pi-calendar" aria-hidden="true" /> {{ $t("dp.title") }}
        <small v-if="data">{{ fmtDate(data.from) }}<template v-if="data.to !== data.from"> – {{ fmtDate(data.to) }}</template></small>
      </button>
      <div v-show="open" class="dp-presets">
        <button v-for="p in presets" :key="p" type="button" :class="{ on: preset === p }" @click="preset = p">{{ $t(`dp.${p}`) }}</button>
        <DatePicker v-if="preset === 'custom'" v-model="custom" selectionMode="range" :manualInput="false" dateFormat="yy-mm-dd" showIcon :placeholder="$t('dp.pick')" class="dp-picker" />
        <i v-if="loading" class="pi pi-spin pi-spinner" aria-hidden="true" />
      </div>
    </header>

    <div v-show="open && data" class="dp-body">
      <p v-if="data" class="dp-compare">{{ $t("dp.compared", { from: fmtDate(data.previous.from), to: fmtDate(data.previous.to) }) }}</p>
      <div v-for="g in groups" :key="g.key" class="dp-group">
        <h3>{{ $t(`dp.g_${g.key}`) }}</h3>
        <div class="dp-cards">
          <component :is="linkOf(f) ? 'router-link' : 'div'" v-for="f in g.items" :key="f.key" :to="linkOf(f) ?? undefined" class="dp-card" :class="{ 'is-link': linkOf(f) }">
            <span class="dp-label">{{ $t(`dp.${f.key}`) }}</span>
            <b class="dp-value">{{ value(f) }}</b>
            <span class="dp-change" :class="`is-${tone(f)}`">
              <template v-if="f.change !== null">
                <i :class="f.change > 0 ? 'pi pi-arrow-up' : f.change < 0 ? 'pi pi-arrow-down' : 'pi pi-minus'" aria-hidden="true" />
                {{ Math.abs(f.change) }}%
              </template>
              <span class="dp-prev">{{ $t("dp.before", { v: value({ ...f, value: f.previous }) }) }}</span>
            </span>
          </component>
        </div>
      </div>
      <p v-if="data && !groups.length" class="dp-empty">{{ $t("dp.none") }}</p>
    </div>
  </section>
</template>

<style scoped>
.dp { background: #fff; border: 1px solid rgb(var(--bp-135c65) / 0.14); border-radius: 18px; box-shadow: 0 8px 24px rgb(var(--bp-135c65) / 0.07); padding: 1rem 1.25rem; margin-bottom: 1rem; }
.dp-head { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between; }
.dp-title { display: flex; gap: 0.5rem; align-items: center; font-size: 1.1rem; font-weight: 700; color: rgb(var(--bp-135c65)); }
.dp-title small { color: #64748b; font-weight: 500; font-size: 0.9rem; }
.dp-presets { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
.dp-presets > button { padding: 0.35rem 0.85rem; border-radius: 999px; border: 1px solid #cbd5e1; background: #fff; font-size: 0.85rem; }
.dp-presets > button.on { background: rgb(var(--bp-135c65)); border-color: rgb(var(--bp-135c65)); color: #fff; }
.dp-picker { width: 15rem; }
.dp-compare { color: #64748b; font-size: 0.85rem; margin: 0.75rem 0 0.25rem; }
.dp-group h3 { font-size: 0.95rem; font-weight: 700; margin: 0.9rem 0 0.5rem; color: #334155; }
.dp-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 0.6rem; }
.dp-card { border: 1px solid #e5e7eb; border-radius: 14px; padding: 0.7rem 0.9rem; display: flex; flex-direction: column; gap: 0.2rem; color: inherit; text-decoration: none; }
.dp-card.is-link:hover { border-color: rgb(var(--bp-135c65) / 0.5); box-shadow: 0 4px 12px rgb(var(--bp-135c65) / 0.1); }
.dp-label { color: #64748b; font-size: 0.85rem; }
.dp-value { font-size: 1.5rem; line-height: 1.2; }
.dp-change { display: flex; gap: 0.35rem; align-items: center; font-size: 0.8rem; font-weight: 600; }
.dp-change.is-up { color: #16a34a; }
.dp-change.is-down { color: #dc2626; }
.dp-change.is-flat { color: #64748b; }
.dp-prev { color: #94a3b8; font-weight: 400; }
.dp-empty { color: #94a3b8; }
</style>
