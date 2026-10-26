<script setup>
// «جدولي»: the signed-in employee's week (no permission needed — only their own sessions, inclusion time,
// evaluations, consultations and calendar, over their shift). Printable.
import axios from "axios";
import moment from "moment";
import { onMounted, ref, watch } from "vue";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import { weekRange, weekStart } from "@/utils/schedules";
import EmployeeSchedule from "@/components/schedules/EmployeeSchedule.vue";
import WeekNav from "@/components/schedules/WeekNav.vue";

const week = ref(weekStart());
const schedule = ref(null);
const holidays = ref([]);
const now = ref(null);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/my-schedule", { params: weekRange(week.value) });
    schedule.value = data.data;
    holidays.value = data.holidays;
    now.value = data.now;
  } finally {
    loading.value = false;
  }
}

watch(week, load);
const print = () => window.print();
onMounted(load);
</script>

<template>
  <div class="sawa-card p-3 my-schedule">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3 no-print">
      <div>
        <p class="text-xl text-[#135C65] font-bold m-0">{{ $t("sch.my_title") }}</p>
        <p class="text-sm text-color-secondary m-0">{{ $t("sch.my_subtitle") }}</p>
      </div>
      <WeekNav v-model="week" :loading="loading" @refresh="load" @print="print" />
    </div>
    <div class="report-head">
      <img :src="sawaLogo" alt="" class="report-logo" />
      <div class="text-center">
        <div class="text-lg font-bold">{{ $t("sch.my_title") }}<template v-if="schedule"> — {{ schedule.user.name }}</template></div>
        <div class="text-sm">{{ weekRange(week).from }} – {{ weekRange(week).to }}</div>
      </div>
      <div class="text-xs">{{ moment().format("YYYY-MM-DD HH:mm") }}</div>
    </div>
    <EmployeeSchedule v-if="schedule" :schedule="schedule" :holidays="holidays" :now="now" :loading="loading" />
    <div v-else class="flex justify-center py-8"><ProgressSpinner style="width: 2.5rem; height: 2.5rem" /></div>
  </div>
</template>

<style scoped>
.report-head {
  display: none;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #135c65;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
.report-logo { height: 3rem; }
@media print {
  :global(body *) { visibility: hidden; }
  .my-schedule, .my-schedule * { visibility: visible; }
  .my-schedule { position: absolute; inset: 0 auto auto 0; width: 100%; box-shadow: none; border: none; }
  .report-head { display: flex; }
  :global(.no-print) { display: none !important; }
  @page { size: landscape; margin: 8mm; }
}
</style>
