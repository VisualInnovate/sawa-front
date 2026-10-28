<script setup>
// «طلبات اعتماد التقييمات»: every evaluation whose result waits for the management, pending first. Its result page
// opens in a new tab (with the same answer box on it); approve it, or reject it with the reason for the therapist.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import DecisionDialog from "@/components/sessions/DecisionDialog.vue";
import { refreshPendingCounts } from "@/utils/pendingCounts";
import { APPROVAL_SEVERITY, resultRoute } from "@/utils/evaluationResults";
import { typeLabel } from "@/components/reports/reportUtils";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const rows = ref([]);
const canDecide = ref(false);
const loading = ref(false);
const status = ref("pending");
const search = ref("");
const answering = ref(null);
const deciding = ref(false);
const statuses = computed(() => [null, "pending", "approved", "rejected"].map((value) => ({ value, label: value ? t(`ea_status_${value}`) : t("sp_all") })));
const shown = computed(() => {
  const q = search.value.trim().toLowerCase();
  return q ? rows.value.filter((row) => [row.child?.name, row.specialist, row.title].some((value) => String(value ?? "").toLowerCase().includes(q))) : rows.value;
});
const typeName = (row) => (row.type === 1 ? row.title || "Side profile" : typeLabel(row.type, t));

function openResult(row) {
  const route = resultRoute({ type: row.type, id: row.id, childId: row.child?.id, sideProfileId: row.side_profile_id, evaluationId: row.evaluation_id });
  if (route) window.open(router.resolve(route).href, "_blank", "noopener");
}

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/evaluation-approvals", { params: { status: status.value || undefined } });
    rows.value = data.data;
    canDecide.value = data.can_decide;
  } finally {
    loading.value = false;
  }
}
async function decide(answer) {
  deciding.value = true;
  try {
    await axios.post(`api/evaluation-approvals/${answering.value.key}/decide`, answer);
    toast.add({ severity: "success", summary: t("success_message"), detail: answer.approved ? t("ea_approved_done") : t("ea_rejected_done"), life: 2500 });
    answering.value = null;
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
      <p class="text-xl text-bp-135c65 font-bold"><i class="pi pi-verified" aria-hidden="true" /> {{ $t("ea_title") }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" :placeholder="$t('ea_search')" />
        </IconField>
        <SelectButton v-model="status" :options="statuses" optionLabel="label" optionValue="value" :allowEmpty="false" @change="load" />
        <Button icon="pi pi-refresh" variant="outlined" :loading="loading" :aria-label="$t('refresh')" @click="load" />
      </div>
    </div>

    <DataTable :value="shown" :loading="loading" dataKey="key" stripedRows paginator :rows="20" responsiveLayout="scroll">
      <template #empty><p class="text-center text-slate-500 py-6">{{ $t("ea_empty") }}</p></template>
      <Column :header="$t('child')"><template #body="{ data }"><b>{{ data.child?.name }}</b></template></Column>
      <Column :header="$t('ea_type')">
        <template #body="{ data }">
          {{ typeName(data) }}
          <Tag v-if="data.extension" severity="info" :value="$t('ea_extension')" class="ms-1" />
        </template>
      </Column>
      <Column :header="$t('ea_specialist')"><template #body="{ data }">{{ data.specialist || "—" }}</template></Column>
      <Column :header="$t('evaluation_date')"><template #body="{ data }"><span class="ltr">{{ data.date }}</span></template></Column>
      <Column :header="$t('status')">
        <template #body="{ data }">
          <Tag :severity="APPROVAL_SEVERITY[data.status]" :value="$t(`ea_status_${data.status}`)" />
          <small v-if="data.status === 'rejected' && data.note" class="block text-red-700 mt-1">{{ data.note }}</small>
          <small v-else-if="data.requested_at" class="block text-slate-500 mt-1 ltr">{{ data.requested_at }}</small>
        </template>
      </Column>
      <Column style="width: 15rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button size="small" icon="pi pi-external-link" :label="$t('ea_open_result')" variant="outlined" @click="openResult(data)" />
            <Button v-if="canDecide && data.status === 'pending'" size="small" icon="pi pi-check-square" :label="$t('decision_answer')" @click="answering = data" />
          </div>
        </template>
      </Column>
    </DataTable>

    <DecisionDialog :visible="!!answering" :title="$t('ea_decide')" :loading="deciding" @update:visible="answering = null" @decide="decide">
      <p v-if="answering" class="m-0"><b>{{ answering.child?.name }}</b> · {{ typeName(answering) }} · <span class="ltr">{{ answering.date }}</span></p>
    </DecisionDialog>
  </div>
</template>
