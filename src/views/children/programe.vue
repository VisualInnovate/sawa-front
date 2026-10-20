<script setup>
// The child profile's «البرامج» tab: the child's student programs (inclusion / day / clinics), newest first,
// each with its details, its week as a timetable and the milestone plan goals attached to it.
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ChildTaps from "@/components/ChildTaps.vue";
import WeekTimetable from "@/components/studentPrograms/WeekTimetable.vue";
import { money } from "@/utils/programFees";
import { dayLabel, programName, sessionKindLabel, timeRange } from "@/utils/studentPrograms";

const { t } = useI18n();
const router = useRouter();
const programs = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await axios.get(`api/student-program/child/${localStorage.getItem("child_id")}`);
    programs.value = data.data ?? [];
  } catch {
    programs.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <ChildTaps />
    <div v-if="loading" class="sawa-card flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else-if="!programs.length" class="sawa-card p-6 text-center text-gray-600">{{ $t("session_no_student_programs") }}</div>
    <div v-else class="flex flex-column gap-3">
      <div v-for="program in programs" :key="program.id" class="sawa-card p-4 flex flex-column gap-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-lg font-bold text-[#135C65]">{{ programName(t, program) }}</span>
          <Button v-can="'student program list'" icon="pi pi-eye" size="small" variant="outlined" :label="$t('sp_details')"
            @click="router.push({ name: 'show-studentprograme', params: { id: program.id } })" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div><span class="text-color-secondary">{{ $t("sp_therapist") }}:</span> {{ program.therapist?.name }}</div>
          <div><span class="text-color-secondary">{{ $t("sp_period") }}:</span> <span class="whitespace-nowrap">{{ program.start_date }} → {{ program.end_date }}</span></div>
          <div><span class="text-color-secondary">{{ $t("fees_price") }}:</span> <span class="font-semibold">{{ money(program.price) }} JD</span></div>
          <div v-if="program.weekly_sessions"><span class="text-color-secondary">{{ $t("sp_weekly_sessions") }}:</span> {{ program.weekly_sessions }}</div>
          <div v-if="program.next_session"><span class="text-color-secondary">{{ $t("sp_next_session") }}:</span> <span class="whitespace-nowrap">{{ program.next_session.starts_at.slice(0, 16) }}</span></div>
        </div>

        <div v-if="program.student_program_details?.length" class="flex flex-wrap gap-2">
          <Tag v-for="row in program.student_program_details" :key="row.id" severity="secondary"
            :value="[row.treatment?.name, sessionKindLabel(t, row.session_kind), row.sessions_numbers].filter(Boolean).join(' · ')" />
        </div>
        <div v-if="program.inclusion_hours?.length" class="flex flex-wrap gap-3 text-sm">
          <span v-for="row in program.inclusion_hours" :key="row.day">{{ dayLabel(t, row.day) }}: {{ timeRange(row.start, row.end) }}</span>
        </div>

        <WeekTimetable v-if="program.week?.length" :slots="program.week" />

        <div v-if="program.plan_goals?.length">
          <h3 class="font-semibold mb-2">{{ $t("milestone_plan_goals") }}</h3>
          <ul class="list-disc ps-5 space-y-1">
            <li v-for="goal in program.plan_goals" :key="goal.id">{{ goal.body }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
