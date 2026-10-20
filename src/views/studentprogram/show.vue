<script setup>
// One student program: its details, its week as a timetable and its saved price.
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { money } from "@/utils/programFees";
import { dayLabel, programName, sessionKindLabel, timeRange } from "@/utils/studentPrograms";
import WeekTimetable from "@/components/studentPrograms/WeekTimetable.vue";
import ProgramPrice from "@/components/studentPrograms/ProgramPrice.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const program = ref(null);

onMounted(async () => {
  const { data } = await axios.get(`api/student-program/${route.params.id}`);
  program.value = data.data;
});
</script>

<template>
  <div v-if="!program" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
  <div v-else class="flex flex-column gap-3">
    <div class="flex flex-wrap items-center justify-between gap-2 px-2">
      <p class="text-xl text-[#135C65] font-bold">{{ program.student?.name }} — {{ programName(t, program) }}</p>
      <Button v-can="'student program edit'" icon="pi pi-pencil" :label="$t('edit')" variant="outlined"
        @click="router.push({ name: 'update-studentprograme', params: { id: program.id } })" />
    </div>

    <div class="sawa-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div><span class="text-color-secondary">{{ $t("sp_therapist") }}:</span> {{ program.therapist?.name }}</div>
      <div><span class="text-color-secondary">{{ $t("sp_period") }}:</span> <span class="whitespace-nowrap">{{ program.start_date }} → {{ program.end_date }}</span></div>
      <div v-if="program.weekly_sessions"><span class="text-color-secondary">{{ $t("sp_weekly_sessions") }}:</span> {{ program.weekly_sessions }}</div>
      <div><span class="text-color-secondary">{{ $t("fees_price") }}:</span> <span class="font-semibold">{{ money(program.price) }} JD</span></div>
      <div><span class="text-color-secondary">{{ $t("sp_sessions_count") }}:</span> {{ program.sessions_count }}</div>
      <div v-if="program.next_session"><span class="text-color-secondary">{{ $t("sp_next_session") }}:</span> <span class="whitespace-nowrap">{{ program.next_session.starts_at.slice(0, 16) }}</span></div>
      <div v-if="program.student_program_details?.length" class="md:col-span-3 flex flex-wrap gap-2">
        <Tag v-for="row in program.student_program_details" :key="row.id" severity="secondary"
          :value="[row.treatment?.name, sessionKindLabel(t, row.session_kind), row.sessions_numbers].filter(Boolean).join(' · ')" />
      </div>
      <div v-if="program.inclusion_hours?.length" class="md:col-span-3 flex flex-wrap gap-3 text-sm">
        <span v-for="row in program.inclusion_hours" :key="row.day">{{ dayLabel(t, row.day) }}: {{ timeRange(row.start, row.end) }}</span>
      </div>
    </div>

    <div class="sawa-card p-4 flex flex-column gap-2">
      <span class="font-semibold">{{ $t("sp_week_title") }}</span>
      <WeekTimetable :slots="program.week" />
    </div>

    <div class="sawa-card p-4 flex flex-column gap-2">
      <span class="font-semibold">{{ $t("sp_price") }}</span>
      <ProgramPrice :price="program.price_details" />
    </div>
  </div>
</template>
