<script setup>
// «طلبات تعميم الأهداف»: the requests therapists sent to generalize a goal in the classes (day programs). The
// management approves or rejects each (with the reason); the therapist sees the answer in the session.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import DecisionDialog from "@/components/sessions/DecisionDialog.vue";
import { refreshPendingCounts } from "@/utils/pendingCounts";

const { t } = useI18n();
const toast = useToast();
const rows = ref([]);
const canDecide = ref(false);
const loading = ref(false);
const status = ref("pending");
const current = ref(null);
const deciding = ref(false);
const SEVERITY = { pending: "warn", approved: "success", rejected: "danger" };
const statuses = computed(() => [null, "pending", "approved", "rejected"].map((value) => ({ value, label: value ? t(`gen_status_${value}`) : t("sp_all") })));

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/goal-generalizations", { params: { status: status.value || undefined } });
    rows.value = data.data;
    canDecide.value = data.can_decide;
  } finally {
    loading.value = false;
  }
}
async function decide(answer) {
  deciding.value = true;
  try {
    await axios.post(`api/goal-generalizations/${current.value.id}/decide`, answer);
    toast.add({ severity: "success", summary: t("success_message"), detail: answer.approved ? t("gen_approved_done") : t("gen_rejected_done"), life: 2500 });
    current.value = null;
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
      <p class="text-xl text-[#135C65] font-bold"><i class="pi pi-share-alt" aria-hidden="true" /> {{ $t("gen_requests_title") }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <SelectButton v-model="status" :options="statuses" optionLabel="label" optionValue="value" :allowEmpty="false" @change="load" />
        <Button icon="pi pi-refresh" variant="outlined" :loading="loading" :aria-label="$t('refresh')" @click="load" />
      </div>
    </div>

    <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows paginator :rows="20" responsiveLayout="scroll">
      <template #empty><p class="text-center text-slate-500 py-6">{{ $t("gen_requests_empty") }}</p></template>
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
          <small v-if="data.decider" class="block text-slate-500 mt-1">{{ data.decider }} · <span class="ltr">{{ data.decided_at }}</span></small>
        </template>
      </Column>
      <Column v-if="canDecide" style="width: 9rem">
        <template #body="{ data }">
          <Button v-if="data.status === 'pending'" size="small" icon="pi pi-check-square" :label="$t('decision_answer')" @click="current = data" />
        </template>
      </Column>
    </DataTable>

    <DecisionDialog :visible="!!current" :title="$t('gen_classes_decide')" :loading="deciding" @update:visible="current = null" @decide="decide">
      <template v-if="current">
        <p class="m-0"><b>{{ current.child?.name }}</b> · {{ current.goal?.domain }}</p>
        <p class="mt-2 mb-0 text-slate-600">{{ current.goal?.goal }}</p>
      </template>
    </DecisionDialog>
  </div>
</template>
