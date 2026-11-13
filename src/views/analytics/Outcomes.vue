<script setup>
// «تحليل النتائج»: what the approved evaluations say across the academy (aggregates only, no names): VB-MAPP by
// domain and the progress between evaluations, the barriers, the side profile's delay, the plans' goals, and how
// complete the data is. Filters: diagnosis, gender, age band at the evaluation.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const data = ref(null);
const loading = ref(false);
const filters = ref({ diagnosis: null, gender: null, age: null });
const DX = ["asd", "adhd", "gdd", "id", "down", "speech", "cp", "ld", "sensory", "hearing", "visual", "other", "under_assessment", "none"];
const dxOptions = computed(() => DX.map((v) => ({ value: v, label: t(`cp.dx_${v}`) })));
const genderOptions = computed(() => [{ value: "0", label: t("oa.gender_0") }, { value: "1", label: t("oa.gender_1") }]);
const ageOptions = computed(() => ["lt48", "48_71", "72_95", "96p"].map((v) => ({ value: v, label: t(`oa.age_${v}`) })));

async function load() {
  loading.value = true;
  try {
    const params = Object.fromEntries(Object.entries(filters.value).filter(([, v]) => v !== null && v !== ""));
    data.value = (await axios.get("api/outcomes-analysis", { params })).data.data;
  } finally {
    loading.value = false;
  }
}
watch(filters, load, { deep: true });
onMounted(load);

const ms = computed(() => data.value?.milestones);
const levels = computed(() => {
  const by = {};
  for (const d of ms.value?.domains ?? []) (by[d.level] ??= { title: d.level_title, items: [] }).items.push(d);
  return Object.values(by);
});
// The server may send 1.8000000000000000444: shown with one decimal at most.
const n1 = (v) => (v === null || v === undefined || v === "" ? "—" : Math.round(Number(v) * 10) / 10);
const bar = (v, max) => `${Math.max(0, Math.min(100, (Number(v) / max) * 100))}%`;
const tone = (v, max) => (v / max >= 0.7 ? "good" : v / max >= 0.4 ? "mid" : "low");
const STAGES = ["not_started", "mt", "exp", "rr", "ef", "mf", "achieved"];
const goalStages = computed(() => STAGES.map((s) => ({ key: s, n: data.value?.goals?.stages?.[s] ?? 0 })));
const quality = computed(() => {
  const q = data.value?.quality ?? {};
  return [
    ["sessions_recorded", q.sessions_recorded], ["goals_tracked", q.goals_tracked], ["diagnosis", q.diagnosis], ["consent", q.consent], ["evaluated", q.evaluated],
  ].map(([k, v]) => ({ key: k, v: v ?? 0 }));
});
</script>

<template>
  <div class="oa">
    <header class="oa-head">
      <div>
        <h1><i class="pi pi-chart-bar" aria-hidden="true" /> {{ $t("oa.title") }}</h1>
        <p>{{ $t("oa.subtitle") }}</p>
      </div>
      <div class="oa-filters">
        <Select v-model="filters.diagnosis" :options="dxOptions" optionLabel="label" optionValue="value" :placeholder="$t('oa.all_dx')" showClear />
        <Select v-model="filters.gender" :options="genderOptions" optionLabel="label" optionValue="value" :placeholder="$t('oa.all_gender')" showClear />
        <Select v-model="filters.age" :options="ageOptions" optionLabel="label" optionValue="value" :placeholder="$t('oa.all_ages')" showClear />
        <i v-if="loading" class="pi pi-spin pi-spinner" />
      </div>
    </header>

    <template v-if="data">
      <!-- Data quality first: how far the numbers can be trusted -->
      <section class="oa-card">
        <h2>{{ $t("oa.quality") }}</h2>
        <p class="oa-hint">{{ $t("oa.quality_hint") }}</p>
        <div class="oa-quality">
          <div v-for="q in quality" :key="q.key" class="oa-q">
            <span>{{ $t(`oa.q_${q.key}`) }}</span>
            <div class="oa-bar"><i :class="tone(q.v, 100)" :style="{ width: bar(q.v, 100) }" /></div>
            <b>{{ q.v }}%</b>
          </div>
        </div>
        <p v-if="data.quality.bad_dates" class="oa-warn">{{ $t("oa.bad_dates", { n: data.quality.bad_dates }) }}</p>
      </section>

      <div class="oa-kpis">
        <div class="oa-kpi"><b>{{ data.children }}</b><span>{{ $t("oa.k_children") }}</span></div>
        <div class="oa-kpi"><b>{{ ms.children }}</b><span>{{ $t("oa.k_vbmapp") }}</span></div>
        <div class="oa-kpi"><b>{{ n1(ms.total.median) }}<small>/170</small></b><span>{{ $t("oa.k_median") }}</span></div>
        <div class="oa-kpi"><b>{{ n1(ms.progress.per_month) }}</b><span>{{ $t("oa.k_per_month", { n: ms.progress.children }) }}</span></div>
        <div class="oa-kpi"><b>{{ n1(data.side_profile.delay) }}%</b><span>{{ $t("oa.k_delay", { m: n1(data.side_profile.gap_months) }) }}</span></div>
        <div class="oa-kpi"><b>{{ n1(data.barriers.median) }}<small>/96</small></b><span>{{ $t("oa.k_barriers") }}</span></div>
      </div>

      <!-- VB-MAPP domains -->
      <section class="oa-card">
        <h2>{{ $t("oa.domains") }}</h2>
        <p class="oa-hint">{{ $t("oa.domains_hint") }}</p>
        <div v-for="lv in levels" :key="lv.title" class="oa-level">
          <h3>{{ lv.title }}</h3>
          <div v-for="d in lv.items" :key="d.title" class="oa-domain" :title="d.title">
            <span class="oa-sym">{{ d.symbol }}</span>
            <span class="oa-dtitle">{{ d.title }}</span>
            <div class="oa-bar"><i :class="tone(d.mean, d.max)" :style="{ width: bar(d.mean, d.max) }" /></div>
            <b>{{ n1(d.mean) }}</b>
            <span class="oa-gain" :class="{ up: d.gain > 0.9, flat: d.gain !== null && d.gain <= 0.3 }">{{ d.gain === null ? "" : `+${n1(d.gain)}` }}</span>
          </div>
        </div>
      </section>

      <div class="oa-grid">
        <section class="oa-card">
          <h2>{{ $t("oa.progress") }}</h2>
          <p class="oa-hint">{{ $t("oa.progress_hint", { n: ms.progress.children, m: n1(ms.progress.months), g: n1(ms.progress.gain) }) }}</p>
          <div v-for="k in ['none', 'small', 'medium', 'large']" :key="k" class="oa-q">
            <span>{{ $t(`oa.spread_${k}`) }}</span>
            <div class="oa-bar"><i :class="k === 'none' ? 'low' : k === 'small' ? 'mid' : 'good'" :style="{ width: bar(ms.progress.spread[k], Math.max(1, ms.progress.children)) }" /></div>
            <b>{{ ms.progress.spread[k] }}</b>
          </div>
          <h3 class="oa-sub">{{ $t("oa.by_age") }}</h3>
          <div v-for="a in ms.by_age" :key="a.band" class="oa-q">
            <span>{{ $t(`oa.age_${a.band}`) }} ({{ a.children }})</span>
            <div class="oa-bar"><i class="mid" :style="{ width: bar(a.median ?? 0, 170) }" /></div>
            <b>{{ n1(a.median) }}</b>
          </div>
        </section>

        <section class="oa-card">
          <h2>{{ $t("oa.barriers") }}</h2>
          <p class="oa-hint">{{ $t("oa.barriers_hint", { n: data.barriers.repeated, i: data.barriers.improved, w: data.barriers.worse }) }}</p>
          <div v-for="b in data.barriers.top" :key="b.title" class="oa-q">
            <span class="oa-long">{{ b.title }}</span>
            <div class="oa-bar"><i class="low" :style="{ width: bar(b.mean, 4) }" /></div>
            <b>{{ n1(b.mean) }}</b>
          </div>
        </section>

        <section class="oa-card">
          <h2>{{ $t("oa.goals") }}</h2>
          <p class="oa-hint">{{ $t("oa.goals_hint", { p: data.goals.plans, g: data.goals.goals, m: n1(data.goals.per_plan), o: data.goals.plans_over_20 }) }}</p>
          <div v-for="s in goalStages" :key="s.key" class="oa-q">
            <span>{{ $t(`oa.stage_${s.key}`) }}</span>
            <div class="oa-bar"><i :class="s.key === 'not_started' ? 'low' : s.key === 'achieved' ? 'good' : 'mid'" :style="{ width: bar(s.n, Math.max(1, data.goals.goals)) }" /></div>
            <b>{{ s.n }}</b>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.oa { display: flex; flex-direction: column; gap: 1rem; }
.oa-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; align-items: flex-start; }
.oa-head h1 { margin: 0 0 0.25rem; font-size: 1.4rem; font-weight: 700; color: rgb(var(--bp-135c65)); }
.oa-head p { margin: 0; color: #64748b; max-width: 60ch; }
.oa-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
.oa-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1rem 1.25rem; }
.oa-card h2 { font-size: 1.05rem; font-weight: 700; margin: 0 0 0.25rem; }
.oa-sub { font-size: 0.95rem; margin: 1rem 0 0.5rem; }
.oa-hint { color: #64748b; font-size: 0.85rem; margin: 0 0 0.75rem; }
.oa-warn { color: #b45309; font-size: 0.85rem; margin: 0.5rem 0 0; }
.oa-kpis { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
.oa-kpi { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 0.8rem 1rem; display: flex; flex-direction: column; }
.oa-kpi b { font-size: 1.5rem; }
.oa-kpi small { font-size: 0.8rem; color: #94a3b8; }
.oa-kpi span { color: #64748b; font-size: 0.85rem; }
.oa-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem; }
.oa-quality { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.25rem 1.5rem; }
.oa-q { display: grid; grid-template-columns: 11rem 1fr 3rem; gap: 0.6rem; align-items: center; padding: 0.3rem 0; font-size: 0.9rem; }
.oa-q b { text-align: end; }
.oa-long { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.oa-bar { height: 9px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
.oa-bar i { display: block; height: 100%; border-radius: 999px; }
.oa-bar i.good { background: #16a34a; }
.oa-bar i.mid { background: #f59e0b; }
.oa-bar i.low { background: #dc2626; }
.oa-level h3 { font-size: 0.95rem; margin: 0.75rem 0 0.35rem; color: #334155; }
.oa-domain { display: grid; grid-template-columns: 2.5rem minmax(0, 22rem) 1fr 2.5rem 3rem; gap: 0.6rem; align-items: center; padding: 0.25rem 0; font-size: 0.88rem; }
.oa-sym { font-weight: 700; color: rgb(var(--bp-135c65)); }
.oa-dtitle { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #334155; }
.oa-gain { font-size: 0.8rem; color: #64748b; }
.oa-gain.up { color: #16a34a; font-weight: 700; }
.oa-gain.flat { color: #dc2626; }
@media (max-width: 720px) { .oa-domain { grid-template-columns: 2.5rem 1fr 2.5rem 3rem; } .oa-dtitle { display: none; } .oa-q { grid-template-columns: 8rem 1fr 2.5rem; } }
</style>
