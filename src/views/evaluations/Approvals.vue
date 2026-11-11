<script setup>
import { blockedText } from "@/utils/approvalReason";
// «طلبات اعتماد التقييمات»: every evaluation whose result waits for approval, pending first. With the approval flow
// (phase 4) each row shows its status of the nine; «بانتظاري» shows only what the flow waits from me. Its result page
// opens in a new tab (with the same answer box on it); approve it, or reject it with the reason; send it to the parents.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import DecisionDialog from "@/components/sessions/DecisionDialog.vue";
import { refreshPendingCounts } from "@/utils/pendingCounts";
import { APPROVAL_SEVERITY, resultRoute } from "@/utils/evaluationResults";
import { typeLabel } from "@/components/reports/reportUtils";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const rows = ref([]);
const canDecide = ref(false);
const loading = ref(false);
const status = ref("pending");
const search = ref("");
const answering = ref(null);
const deciding = ref(false);
const statuses = computed(() => [null, "mine", "pending", "approved", "rejected"].map((value) => ({ value, label: value ? (value === "mine" ? t("ewf.waiting_me") : t(`ea_status_${value}`)) : t("sp_all") })));
const shown = computed(() => {
  const q = search.value.trim().toLowerCase();
  const list = status.value === "mine" ? rows.value.filter((row) => row.can_act) : rows.value;
  return q ? list.filter((row) => [row.child?.name, row.specialist, row.title].some((value) => String(value ?? "").toLowerCase().includes(q))) : list;
});
const WF_SEVERITY = { pending_first: "warn", first_rejected: "danger", first_approved: "info", second_rejected: "danger", final_approved: "success", sent: "success", auto_sent: "success" };
const sending = ref(null);
async function send(row) {
  sending.value = row.key;
  try {
    await axios.post(`api/evaluation-approvals/${row.key}/send`);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("ewf.sent_done"), life: 2500 });
    await load();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("mission_error"), life: 3000 });
  } finally {
    sending.value = null;
  }
}
const typeName = (row) => (row.type === 1 ? row.title || "Side profile" : typeLabel(row.type, t));

function openResult(row) {
  const route = resultRoute({ type: row.type, id: row.id, childId: row.child?.id, sideProfileId: row.side_profile_id, evaluationId: row.evaluation_id });
  if (route) window.open(router.resolve(route).href, "_blank", "noopener");
}

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/evaluation-approvals", { params: { status: status.value === "mine" ? "pending" : status.value || undefined } });
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
// «ما ينتظرك» and the notifications link here with ?key=e12 / s3: open that evaluation's result page (its approval box
// is there). The list stays behind it without the key, so going back does not open it again.
async function openFromLink() {
  const key = String(route.query.key ?? "");
  if (!key) return;
  let row = rows.value.find((r) => r.key === key);
  if (!row && status.value) {
    status.value = null;
    await load();
    row = rows.value.find((r) => r.key === key);
  }
  await router.replace({ query: {} });
  const target = row && resultRoute({ type: row.type, id: row.id, childId: row.child?.id, sideProfileId: row.side_profile_id, evaluationId: row.evaluation_id });
  if (target) router.push(target);
  else toast.add({ severity: "warn", summary: t("ea_title"), detail: t("ea_link_missing"), life: 4000 });
}
onMounted(async () => {
  await load();
  await openFromLink();
});
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
          <Tag v-if="data.workflow_status" :severity="WF_SEVERITY[data.workflow_status] ?? 'secondary'" :value="$t(`ewf.status_${data.workflow_status}`)" />
          <Tag v-else :severity="APPROVAL_SEVERITY[data.status]" :value="$t(`ea_status_${data.status}`)" />
          <Tag v-if="data.optional_stage" severity="secondary" class="ms-1" :value="$t('ewf.optional_stage', { stage: data.optional_stage })" />
          <small v-if="data.status === 'rejected' && data.note" class="block text-red-700 mt-1">{{ data.note }}</small>
          <small v-else-if="data.requested_at" class="block text-slate-500 mt-1 ltr">{{ data.requested_at }}</small>
        </template>
      </Column>
      <Column style="width: 15rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button size="small" icon="pi pi-external-link" :label="$t('ea_open_result')" variant="outlined" @click="openResult(data)" />
            <Button v-if="data.can_act ?? (canDecide && data.status === 'pending')" size="small" icon="pi pi-check-square" :label="$t('decision_answer')" @click="answering = data" />
            <!-- A waiting evaluation the user cannot approve: why, on hover (and for the keyboard / a tap). -->
            <span v-else-if="data.blocked" class="ea-blocked" tabindex="0" role="img" :aria-label="blockedText($t, data.blocked)"
              v-tooltip.top="{ value: blockedText($t, data.blocked), pt: { root: { style: 'max-width: 22rem' } } }">
              <i class="pi pi-exclamation-circle" aria-hidden="true" />
            </span>
            <Button v-if="data.workflow_status === 'final_approved'" size="small" icon="pi pi-send" severity="success" :label="$t('ewf.send')"
              :loading="sending === data.key" @click="send(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <DecisionDialog :visible="!!answering" :title="$t('ea_decide')" :loading="deciding" @update:visible="answering = null" @decide="decide">
      <p v-if="answering" class="m-0"><b>{{ answering.child?.name }}</b> · {{ typeName(answering) }} · <span class="ltr">{{ answering.date }}</span></p>
    </DecisionDialog>
  </div>
</template>

<style scoped>
.ea-blocked {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  color: #b45309;
  background: #fef3c7;
  cursor: help;
}
.ea-blocked:focus-visible {
  outline: 2px solid #b45309;
  outline-offset: 2px;
}
</style>
