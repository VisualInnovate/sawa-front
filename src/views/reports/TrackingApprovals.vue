<script setup>
// «طلبات اعتماد التراكنج»: the trackings sent to the management, pending first. Each opens view-only (its goals as
// the tracking prints them, with prop, MT, EXP, RR, GEN, EF and MF) and is approved — the child's sessions then work on it and
// it is view-only in the report — or rejected with the reason (the report can edit and send it again).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import DecisionDialog from "@/components/sessions/DecisionDialog.vue";
import { refreshPendingCounts } from "@/utils/pendingCounts";
import TrackingDates from "@/components/reports/TrackingDates.vue";
import { TRACKING_COLUMNS, columnDate } from "@/utils/trackingColumns";

const { t } = useI18n();
const toast = useToast();
const rows = ref([]);
const canDecide = ref(false);
const loading = ref(false);
const status = ref("pending");
const viewing = ref(null); // the opened tracking with its groups
const opening = ref(null);
const answering = ref(false);
const deciding = ref(false);
const SEVERITY = { pending: "warn", approved: "success", rejected: "danger" };
const statuses = computed(() => [null, "pending", "approved", "rejected"].map((value) => ({ value, label: value ? t(`ereport.tracking_status_${value}`) : t("sp_all") })));
function genText(goal) {
  const people = goal.gen?.people ?? [];
  const parts = [
    goal.gen?.classes && `${t("gen_classes")}: ${t(`gen_status_${goal.gen.classes.status}`)}`,
    goal.gen?.home && `${t("gen_home")}: ${t(`gen_status_${goal.gen.home.status}`)}`,
    people.length && `${t("gen_people")}: ${people.filter((item) => item.status === "approved").length}/${people.length}`,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : goal.cells?.gen || "";
}

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/tracking-approvals", { params: { status: status.value || undefined } });
    rows.value = data.data;
    canDecide.value = data.can_decide;
  } finally {
    loading.value = false;
  }
}
async function open(row) {
  opening.value = row.id;
  try {
    viewing.value = (await axios.get(`api/tracking-approvals/${row.id}`)).data.data;
  } finally {
    opening.value = null;
  }
}
async function decide(answer) {
  deciding.value = true;
  try {
    await axios.post(`api/tracking-approvals/${viewing.value.id}/decide`, answer);
    toast.add({ severity: "success", summary: t("success_message"), detail: answer.approved ? t("ereport.tracking_approved_done") : t("ereport.tracking_rejected_done"), life: 2500 });
    answering.value = false;
    viewing.value = null;
    await load();
    refreshPendingCounts();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    deciding.value = false;
  }
}
onMounted(load);
</script>

<template>
  <div class="sawa-card p-3">
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <p class="text-xl text-[#135C65] font-bold"><i class="pi pi-verified" aria-hidden="true" /> {{ $t("ereport.tracking_approvals") }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <SelectButton v-model="status" :options="statuses" optionLabel="label" optionValue="value" :allowEmpty="false" @change="load" />
        <Button icon="pi pi-refresh" variant="outlined" :loading="loading" :aria-label="$t('refresh')" @click="load" />
      </div>
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows paginator :rows="20" responsiveLayout="scroll">
      <template #empty><p class="text-center text-slate-500 py-6">{{ $t("ereport.tracking_approvals_empty") }}</p></template>
      <Column :header="$t('child')"><template #body="{ data }"><b>{{ data.child?.name }}</b></template></Column>
      <Column :header="$t('ereport.tracking_goals_count')"><template #body="{ data }">{{ data.goal_ids.length }}</template></Column>
      <Column :header="$t('gen_requested_by')"><template #body="{ data }">{{ data.requester || "—" }}<br /><small class="ltr text-slate-500">{{ data.requested_at }}</small></template></Column>
      <Column :header="$t('status')">
        <template #body="{ data }">
          <Tag :severity="SEVERITY[data.status]" :value="$t(`ereport.tracking_status_${data.status}`)" />
          <small v-if="data.status === 'rejected' && data.note" class="block text-red-700 mt-1">{{ data.note }}</small>
          <small v-if="data.approver && data.status !== 'pending'" class="block text-slate-500 mt-1">{{ data.approver }} · <span class="ltr">{{ data.decided_at }}</span></small>
        </template>
      </Column>
      <Column style="width: 8rem">
        <template #body="{ data }">
          <Button size="small" icon="pi pi-eye" :label="$t('view')" variant="outlined" :loading="opening === data.id" @click="open(data)" />
        </template>
      </Column>
    </DataTable>

    <!-- the tracking, view-only -->
    <Dialog :visible="!!viewing" modal :header="viewing ? `${$t('ereport.tracking_title')} · ${viewing.child?.name}` : ''" :style="{ width: '76rem' }"
      :breakpoints="{ '1100px': '96vw' }" @update:visible="viewing = null">
      <template v-if="viewing">
        <p v-if="viewing.status === 'rejected'" class="ta-state is-rejected"><i class="pi pi-times-circle" /> {{ $t("ereport.tracking_rejected_note", { note: viewing.note || "—" }) }}</p>
        <table v-for="group in viewing.groups" :key="group.key" class="ta-table">
          <thead>
            <tr class="ta-domain"><th :colspan="TRACKING_COLUMNS.length + 2">{{ group.domain }} <span class="ltr">{{ group.domain_symbol }}</span></th></tr>
            <tr class="ta-goal"><th :colspan="TRACKING_COLUMNS.length + 2">{{ $t("ereport.tracking_goal") }}: {{ group.general_goal }}</th></tr>
            <tr class="ta-cols">
              <th class="ta-num">{{ $t("ereport.number") }}</th>
              <th>{{ $t("ereport.tracking_short_goals") }}</th>
              <th v-for="column in TRACKING_COLUMNS" :key="column.key">{{ $t(column.title) }}<span class="ta-code ltr">{{ column.code }}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="goal in group.goals" :key="goal.id">
              <td class="ltr"><b>{{ goal.code }}</b></td>
              <td class="ta-text">{{ goal.goal }}</td>
              <td v-for="column in TRACKING_COLUMNS" :key="column.key" :class="{ 'ta-gen': column.key === 'gen' }">
                <template v-if="column.key === 'gen'">{{ genText(goal) }}</template>
                <TrackingDates v-else :start="columnDate(goal, column.key, 'start')" :end="columnDate(goal, column.key, 'end')" />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template #footer>
        <Button :label="$t('close')" variant="text" severity="secondary" @click="viewing = null" />
        <Button v-if="canDecide && viewing?.status === 'pending'" icon="pi pi-check-square" :label="$t('decision_answer')" @click="answering = true" />
      </template>
    </Dialog>

    <DecisionDialog :visible="answering" :title="$t('ereport.tracking_decide')" :loading="deciding" @update:visible="answering = false" @decide="decide">
      <p v-if="viewing" class="m-0"><b>{{ viewing.child?.name }}</b> · {{ $t("ereport.tracking_goals_count") }}: {{ viewing.goal_ids.length }}</p>
    </DecisionDialog>
  </div>
</template>

<style scoped>
.ta-table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: .85rem; table-layout: fixed; }
.ta-table th, .ta-table td { border: 1px solid #cbd5e1; padding: .35rem; text-align: center; }
.ta-cols th { background: #135c65; color: #fff; font-size: .75rem; line-height: 1.25; }
.ta-code { display: block; margin-top: 2px; color: #a7f3d0; font-size: .68rem; font-weight: 600; }
.ta-cols th.ta-num { width: 3.4rem; }
.ta-cols th:nth-child(2) { width: 22%; }
.ta-domain th { background: #c4b5fd; color: #1e293b; font-size: .9rem; text-align: start; }
.ta-goal th { background: #e0f2f1; text-align: start; }
.ta-text { text-align: start !important; line-height: 1.5; }
.ta-gen { font-size: .72rem; }
.ta-state { display: flex; align-items: center; gap: .4rem; padding: .5rem .7rem; border-radius: 10px; font-weight: 700; }
.ta-state.is-rejected { background: #fef2f2; color: #b91c1c; }
</style>
