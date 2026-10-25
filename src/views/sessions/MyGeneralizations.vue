<script setup>
// «طلبات التعميم الواردة»: goals other therapists asked me to generalize (people). Each opens the goal in the milestone
// DTT form (its MT sheets as saved, read-only); I confirm or reject it with the reason.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import DecisionDialog from "@/components/sessions/DecisionDialog.vue";
import { refreshPendingCounts } from "@/utils/pendingCounts";
import DttSheet from "@/components/sessions/DttSheet.vue";

const { t } = useI18n();
const toast = useToast();
const rows = ref([]);
const loading = ref(false);
const viewing = ref(null); // the request whose DTT form is open
const step = ref(1);
const answering = ref(null);
const deciding = ref(false);
const SEVERITY = { pending: "warn", approved: "success", rejected: "danger" };
const pending = computed(() => rows.value.filter((row) => row.status === "pending").length);

// The sheet of an MT step (null when the step was not done: an empty form).
const sheetOf = (row, n) => row.goal?.dtt?.find((sheet) => sheet.step === n) ?? null;
const open = (row) => {
  viewing.value = row;
  step.value = row.goal?.dtt?.length ? row.goal.dtt[row.goal.dtt.length - 1].step : 1;
};

async function load() {
  loading.value = true;
  try {
    rows.value = (await axios.get("api/my-goal-generalizations")).data.data;
  } finally {
    loading.value = false;
  }
}
async function decide(answer) {
  deciding.value = true;
  try {
    await axios.post(`api/my-goal-generalizations/${answering.value.id}/decide`, answer);
    toast.add({ severity: "success", summary: t("success_message"), detail: answer.approved ? t("gen_approved_done") : t("gen_rejected_done"), life: 2500 });
    answering.value = null;
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
      <p class="text-xl text-[#135C65] font-bold">
        <i class="pi pi-inbox" aria-hidden="true" /> {{ $t("gen_inbox_title") }}
        <Badge v-if="pending" :value="pending" severity="warn" class="ms-1" />
      </p>
      <Button icon="pi pi-refresh" variant="outlined" :loading="loading" :aria-label="$t('refresh')" @click="load" />
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows paginator :rows="20" responsiveLayout="scroll">
      <template #empty><p class="text-center text-slate-500 py-6">{{ $t("gen_inbox_empty") }}</p></template>
      <Column :header="$t('child')"><template #body="{ data }"><b>{{ data.child?.name }}</b></template></Column>
      <Column :header="$t('ereport.tracking_short_goals')">
        <template #body="{ data }">
          <div class="max-w-[28rem]">
            <small class="text-slate-500">{{ data.goal?.domain }} · {{ data.goal?.general_goal }}</small>
            <p class="m-0">{{ data.goal?.goal }}</p>
          </div>
        </template>
      </Column>
      <Column :header="$t('gen_requested_by')"><template #body="{ data }">{{ data.requester }}<br /><small class="ltr text-slate-500">{{ data.created_at }}</small></template></Column>
      <Column :header="$t('status')">
        <template #body="{ data }">
          <Tag :severity="SEVERITY[data.status]" :value="$t(`gen_status_${data.status}`)" />
          <small v-if="data.status === 'rejected' && data.note" class="block text-red-700 mt-1">{{ data.note }}</small>
        </template>
      </Column>
      <Column style="width: 13rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button size="small" icon="pi pi-eye" :label="$t('gen_view_dtt')" variant="outlined" @click="open(data)" />
            <Button v-if="data.status === 'pending'" size="small" icon="pi pi-check-square" :label="$t('decision_answer')" @click="answering = data" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- the goal in the milestone DTT form -->
    <Dialog :visible="!!viewing" modal :header="viewing ? `${viewing.child?.name} · DTT` : ''" :style="{ width: '72rem' }" :breakpoints="{ '1100px': '96vw' }"
      @update:visible="viewing = null">
      <template v-if="viewing">
        <div class="flex gap-2 mb-2">
          <Button v-for="n in [1, 2, 3]" :key="n" size="small" :label="`MT${n}`" :variant="step === n ? undefined : 'outlined'"
            :severity="sheetOf(viewing, n) ? undefined : 'secondary'" @click="step = n" />
        </div>
        <DttSheet :key="`${viewing.id}-${step}`" :goal="{ ...viewing.goal, code: viewing.goal?.symbol || '' }" :step="step"
          :preset="sheetOf(viewing, step)" forceMilestone @close="viewing = null" />
      </template>
      <template #footer>
        <Button v-if="viewing?.status === 'pending'" icon="pi pi-check-square" :label="$t('decision_answer')" @click="answering = viewing" />
      </template>
    </Dialog>

    <DecisionDialog :visible="!!answering" :title="$t('gen_people_decide')" :loading="deciding" @update:visible="answering = null" @decide="decide">
      <template v-if="answering">
        <p class="m-0"><b>{{ answering.child?.name }}</b> · {{ answering.goal?.domain }}</p>
        <p class="mt-2 mb-0 text-slate-600">{{ answering.goal?.goal }}</p>
      </template>
    </DecisionDialog>
  </div>
</template>
