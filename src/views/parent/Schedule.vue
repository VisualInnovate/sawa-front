<template>
  <div class="pp-page">
  <PageHead :title="$t('sch.parent_title')" :lead="$t('sch.parent_hint')" :kicker="$t('pp.brand')" icon="pi pi-calendar" />
  <div class="parent-schedule w-full">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4 no-print">
      <SelectButton v-if="children.length > 1" v-model="childId" :options="children" optionLabel="name" optionValue="id" :allowEmpty="false"
        :aria-label="$t('sp_student')" />
      <WeekNav v-model="week" :loading="loading" @refresh="load" @print="print" />
    </div>

    <div class="report-head">
      <img :src="$siteLogo(sawaLogo)" alt="" class="report-logo" />
      <div class="text-center">
        <div class="text-lg font-bold">{{ $t("sch.parent_title") }}<template v-if="child"> — {{ child.name }}</template></div>
        <div class="text-sm">{{ range.from }} – {{ range.to }}</div>
      </div>
      <span />
    </div>

    <div v-if="loading && !children.length" class="py-10 text-center"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <div v-else-if="!children.length" class="empty-state bg-white rounded-xl border p-6 text-center text-slate-500"><i class="pi pi-calendar" /> {{ $t("sch.parent_no_children") }}</div>
    <template v-else-if="child">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div v-for="card in cards" :key="card.key" class="ps-card" :style="{ '--card': card.color }">
          <i :class="card.icon" aria-hidden="true" />
          <div><div class="ps-card-value">{{ card.value }}</div><div class="ps-card-label">{{ $t(`sch.parent_count_${card.key}`) }}</div></div>
        </div>
      </div>
      <div v-if="next" class="ps-next mb-4">
        <i class="pi pi-bell" aria-hidden="true" />
        <span>{{ $t("sch.parent_next") }}: <b>{{ dayLabel($t, moment(next.date).day()) }} {{ moment(next.date).format("DD/MM") }}<template v-if="next.start"> · <span dir="ltr">{{ next.start }}</span></template></b>
          — {{ nextWords }}</span>
      </div>
      <ScheduleLegend :types="['session', 'inclusion', 'evaluation', 'consultation']" :staffMarks="false" class="mb-3" />
      <WeekGrid :days="days" :items="child.items" :holidays="holidays" :now="now" showStaff :showShift="false" ownChild :hourHeight="88" />
      <div class="mt-5">
        <h2 class="text-xl font-bold text-bp-135c65 mb-3">{{ $t("sch.tab_list") }}</h2>
        <ScheduleList :items="child.items" showStaff :showFlags="false" :loading="loading" />
      </div>
    </template>
  </div>
  </div>
</template>

<script setup>
// The parents' portal: the weekly schedule of each of the parent's children — program sessions, inclusion time,
// evaluations and consultations, with the therapist and the room — week by week, printable.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import PageHead from "@/components/parent/PageHead.vue";
import ScheduleLegend from "@/components/schedules/ScheduleLegend.vue";
import ScheduleList from "@/components/schedules/ScheduleList.vue";
import WeekGrid from "@/components/schedules/WeekGrid.vue";
import WeekNav from "@/components/schedules/WeekNav.vue";
import { daysOf, weekRange, weekStart } from "@/utils/schedules";
import { dayLabel } from "@/utils/studentPrograms";

const { t } = useI18n();
const week = ref(weekStart());
const children = ref([]);
const childId = ref(null);
const holidays = ref([]);
const now = ref(null);
const loading = ref(false);

const range = computed(() => weekRange(week.value));
const days = computed(() => daysOf(range.value.from, range.value.to));
const child = computed(() => children.value.find((row) => row.id === childId.value) ?? null);
const cards = computed(() => {
  const items = child.value?.items ?? [];
  return [
    { key: "sessions", icon: "pi pi-users", value: items.filter((item) => ["session", "inclusion"].includes(item.type)).length, color: "rgb(var(--bp-135c65))" },
    { key: "evaluations", icon: "pi pi-clipboard", value: items.filter((item) => item.type === "evaluation").length, color: "#d9822b" },
    { key: "consultations", icon: "pi pi-comments", value: items.filter((item) => ["consultation", "meeting"].includes(item.type)).length, color: "#2f6fcf" },
    { key: "therapists", icon: "pi pi-user", value: new Set(items.map((item) => item.staff).filter(Boolean)).size, color: "#6a3fb5" },
  ];
});
// The next thing on the child's schedule from now.
const next = computed(() => {
  const current = now.value ?? moment().format("YYYY-MM-DD HH:mm");
  return (child.value?.items ?? []).find((item) => `${item.date} ${item.start ?? "23:59"}` >= current && item.status !== "missed") ?? null;
});
// "جلسة برنامج (تعديل سلوك) مع أ. سارة · غرفة 2" — built in script so the words keep their spaces.
const nextWords = computed(() => {
  if (!next.value) return "";
  const parts = [t(`sch.type_${next.value.type}`)];
  if (next.value.treatment) parts.push(`(${next.value.treatment})`);
  if (next.value.staff) parts.push(`${t("sch.with")} ${next.value.staff}`);
  const words = parts.join(" ");
  return next.value.room ? `${words} · ${next.value.room}` : words;
});

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("/api/parent/schedule", { params: range.value });
    children.value = data.data ?? [];
    holidays.value = data.holidays ?? [];
    now.value = data.now;
    if (!children.value.some((row) => row.id === childId.value)) childId.value = children.value[0]?.id ?? null;
  } catch {
    children.value = [];
  } finally {
    loading.value = false;
  }
}

watch(week, load);
const print = () => window.print();
onMounted(load);
</script>

<style scoped>
.ps-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem;
  border-radius: 0.9rem;
  background: #fff;
  border: 1px solid rgb(var(--bp-e5eef0));
  box-shadow: 0 2px 6px rgb(var(--bp-135c65) / 0.06);
}
.ps-card > i {
  font-size: 1.2rem;
  color: #fff;
  background: var(--card);
  padding: 0.6rem;
  border-radius: 0.7rem;
}
.ps-card-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.1;
}
.ps-card-label {
  font-size: 0.8rem;
  color: #6b7280;
}
.ps-next {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 0.8rem;
  background: linear-gradient(90deg, #fff7d6, #fffdf3);
  border: 1px solid #ffe08a;
  color: #5b4a12;
}
.ps-next > i {
  color: #e0a800;
}
.report-head {
  display: none;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgb(var(--bp-135c65));
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.report-logo { height: 3rem; }
@media print {
  :global(body *) { visibility: hidden; }
  .parent-schedule, .parent-schedule * { visibility: visible; }
  .parent-schedule { position: absolute; inset: 0 auto auto 0; width: 100%; }
  .report-head { display: flex; }
  :global(.no-print) { display: none !important; }
  .ps-card, .ps-next { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: landscape; margin: 8mm; }
}
</style>
