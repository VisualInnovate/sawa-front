<script setup>
// «أوقاتي للمقابلات»: the weekly times a department head is free for interviews. Each day may have several periods;
// they are cut into interviews of the length set in the HR settings, and a booked time is not offered again.
// HR may edit another person's times (userId).
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { hrError, weekdayName } from "@/utils/interviewer";

const props = defineProps({ userId: { type: Number, default: null } });
const emit = defineEmits(["saved"]);

const { t, locale } = useI18n();
const toast = useToast();
const days = ref([[], [], [], [], [], [], []]);
const minutes = ref(30);
const loading = ref(false);
const saving = ref(false);
const error = ref("");

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/candidate-reviews/hours", { params: { user_id: props.userId || undefined } });
    const next = [[], [], [], [], [], [], []];
    data.data.forEach((row) => next[row.weekday].push({ from: row.from, to: row.to }));
    days.value = next;
    minutes.value = data.interview_minutes;
  } finally {
    loading.value = false;
  }
}
watch(() => props.userId, load, { immediate: true });

const add = (day) => days.value[day].push({ from: "09:00", to: "12:00" });
const remove = (day, i) => days.value[day].splice(i, 1);

// A period ends after it starts and does not overlap another one on the same day.
const problems = computed(() =>
  days.value.map((periods) =>
    periods.map((p, i) => {
      if (!p.from || !p.to || p.to <= p.from) return t("crv.hours_order");
      if (periods.some((q, j) => j !== i && q.from < p.to && p.from < q.to)) return t("crv.err.hours_overlap");
      return "";
    }),
  ),
);
const invalid = computed(() => problems.value.flat().some(Boolean));
const slotsOf = (p) => (p.from && p.to && p.to > p.from ? Math.floor((toMin(p.to) - toMin(p.from)) / minutes.value) : 0);
const toMin = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

async function save() {
  if (invalid.value) return;
  saving.value = true;
  error.value = "";
  try {
    const rows = days.value.flatMap((periods, weekday) => periods.map((p) => ({ weekday, from: p.from, to: p.to })));
    await axios.put("api/candidate-reviews/hours", { user_id: props.userId || undefined, rows });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("crv.hours_saved"), life: 2500 });
    emit("saved");
  } catch (e) {
    error.value = hrError(t, errorText(e));
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="flex flex-column gap-3" :class="{ 'opacity-60': loading }">
    <p class="m-0 text-color-secondary">{{ $t("crv.hours_hint", { n: minutes }) }}</p>
    <div class="ih-days">
      <div v-for="(periods, day) in days" :key="day" class="ih-day">
        <div class="flex items-center justify-between gap-2">
          <strong>{{ weekdayName(day, locale) }}</strong>
          <Button icon="pi pi-plus" :label="$t('crv.add_period')" size="small" text @click="add(day)" />
        </div>
        <div v-for="(p, i) in periods" :key="i" class="flex flex-column gap-1">
          <div class="flex flex-wrap items-center gap-2">
            <label class="sr-only" :for="`ih-${day}-${i}-from`">{{ $t("crv.from") }}</label>
            <input :id="`ih-${day}-${i}-from`" v-model="p.from" type="time" class="p-inputtext p-component ih-time" :class="{ 'p-invalid': problems[day][i] }" />
            <span>→</span>
            <label class="sr-only" :for="`ih-${day}-${i}-to`">{{ $t("crv.to") }}</label>
            <input :id="`ih-${day}-${i}-to`" v-model="p.to" type="time" class="p-inputtext p-component ih-time" :class="{ 'p-invalid': problems[day][i] }" />
            <small class="text-color-secondary">{{ $t("crv.slots_count", { n: slotsOf(p) }) }}</small>
            <Button icon="pi pi-trash" text rounded severity="danger" size="small" :aria-label="$t('delete')" @click="remove(day, i)" />
          </div>
          <small v-if="problems[day][i]" class="text-red-500">{{ problems[day][i] }}</small>
        </div>
        <small v-if="!periods.length" class="text-color-secondary">{{ $t("crv.day_off") }}</small>
      </div>
    </div>
    <small v-if="error" class="text-red-500">{{ error }}</small>
    <div class="flex justify-end">
      <Button icon="pi pi-check" :label="$t('save')" :loading="saving" :disabled="invalid" @click="save" />
    </div>
  </div>
</template>

<style scoped>
.ih-days { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 0.75rem; }
.ih-day { border: 1px solid var(--p-content-border-color); border-radius: 14px; padding: 0.75rem; display: grid; gap: 0.5rem; align-content: start; }
.ih-time { width: 8.5rem; direction: ltr; }
</style>
