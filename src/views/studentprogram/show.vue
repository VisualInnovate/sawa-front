<script setup>
// One student program: its details, its week as a timetable, its saved price and (with its permission) its change log.
import { amount, formatDateTime, programStatusSeverity } from "@/utils/accounting";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { money } from "@/utils/programFees";
import { dayLabel, programName, sessionKindLabel, timeRange } from "@/utils/studentPrograms";
import WeekTimetable from "@/components/studentPrograms/WeekTimetable.vue";
import ProgramPrice from "@/components/studentPrograms/ProgramPrice.vue";
import ProgramChangeLog from "@/components/studentPrograms/ProgramChangeLog.vue";
import ProgramAccountDialog from "@/components/accounting/ProgramAccountDialog.vue";
import { can } from "@/utils/permissions";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const program = ref(null);
const logs = ref(null);
const showingAccount = ref(false);
const formatAt = formatDateTime;

async function reload() {
  program.value = (await axios.get(`api/student-program/${route.params.id}`)).data.data;
}

onMounted(async () => {
  const { data } = await axios.get(`api/student-program/${route.params.id}`);
  program.value = data.data;
  if (can("student program log list")) {
    logs.value = (await axios.get(`api/student-program/${route.params.id}/logs`)).data.data;
  }
});
</script>

<template>
  <div v-if="!program" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
  <div v-else class="flex flex-column gap-3">
    <div class="flex flex-wrap items-center justify-between gap-2 px-2">
      <p class="text-xl text-[#135C65] font-bold">{{ program.student?.name }} — {{ programName(t, program) }}</p>
      <div class="flex flex-wrap gap-2">
        <Button v-if="can('accounting list')" icon="pi pi-wallet" :label="$t('acc.program_account')" severity="secondary" variant="outlined" @click="showingAccount = true" />
        <Button v-if="program.accounting_status !== 'stopped'" v-can="'student program edit'" icon="pi pi-pencil" :label="$t('edit')" variant="outlined"
          @click="router.push({ name: 'update-studentprograme', params: { id: program.id } })" />
      </div>
    </div>

    <!-- «المحاسبة»: tentative for two days, then unconfirmed (times released) until assigned again. -->
    <div class="sawa-card p-4 flex flex-wrap items-center gap-3">
      <Tag :severity="programStatusSeverity[program.accounting_status]" :value="$t(`acc.program_status.${program.accounting_status}`)" />
      <span v-if="program.accounting_status === 'tentative' && program.tentative_until" class="text-sm text-orange-700">
        {{ $t("acc.tentative_until", { at: formatAt(program.tentative_until) }) }}
      </span>
      <Tag v-if="program.sessions_suspended_at" severity="danger" icon="pi pi-pause" :value="$t('acc.suspended')" />
      <template v-if="program.charge">
        <span class="text-sm">{{ $t("acc.owed") }}: <strong>{{ amount(program.charge.amount) }}</strong></span>
        <span class="text-sm">{{ $t("acc.paid") }}: <strong class="text-green-700">{{ amount(program.charge.paid) }}</strong></span>
        <span class="text-sm">{{ $t("acc.remaining") }}: <strong>{{ amount(program.charge.remaining) }}</strong></span>
        <span v-if="program.charge.late > 0" class="text-sm text-red-600">{{ $t("acc.late") }}: <strong>{{ amount(program.charge.late) }}</strong></span>
      </template>
      <div v-if="program.accounting_status === 'unconfirmed'" class="w-full flex flex-wrap items-center justify-between gap-2">
        <Message severity="error" size="small" class="flex-1">{{ $t("acc.unconfirmed_hint") }}</Message>
        <Button v-can="'student program edit'" icon="pi pi-refresh" :label="$t('acc.reassign')" severity="danger"
          @click="router.push({ name: 'update-studentprograme', params: { id: program.id } })" />
      </div>
    </div>

    <div class="sawa-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div><span class="text-color-secondary">{{ $t("sp_therapist") }}:</span> {{ program.therapist?.name }}</div>
      <div><span class="text-color-secondary">{{ $t("sp_period") }}:</span> <span class="whitespace-nowrap">{{ program.start_date }} → {{ program.end_date }}</span></div>
      <div v-if="program.weekly_sessions"><span class="text-color-secondary">{{ $t("sp_weekly_sessions") }}:</span> {{ program.weekly_sessions }}</div>
      <div><span class="text-color-secondary">{{ $t("acc.price") }}:</span> <span class="font-semibold">{{ amount(program.price) }}</span></div>
      <div><span class="text-color-secondary">{{ $t("sp_sessions_count") }}:</span> {{ program.sessions_count }}</div>
      <div v-if="program.next_session"><span class="text-color-secondary">{{ $t("sp_next_session") }}:</span> <span class="whitespace-nowrap">{{ program.next_session.starts_at.slice(0, 16) }}</span></div>
      <div v-if="program.student_program_details?.length" class="md:col-span-3 flex flex-wrap gap-2">
        <Tag v-for="row in program.student_program_details" :key="row.id" severity="secondary"
          :value="[row.treatment?.name, sessionKindLabel(t, row.session_kind), row.sessions].filter(Boolean).join(' · ')" />
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

    <div v-if="logs" class="sawa-card p-4 flex flex-column gap-2">
      <span class="font-semibold"><i class="pi pi-history" aria-hidden="true" /> {{ $t("program_log_title") }}</span>
      <ProgramChangeLog :logs="logs" />
    </div>
    <ProgramAccountDialog v-model:visible="showingAccount" :programId="program.id" @changed="reload" />
    <Toast />
  </div>
</template>
