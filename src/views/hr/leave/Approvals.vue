<script setup>
// «الموافقات»: leaves, advances and overtime requests waiting for the signed-in head / HR (or the ones they decided).
// A leave opens its review page (items and substitutes); an advance or overtime request is decided here.
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { loadApprover } from "../../../utils/approver";

const router = useRouter();
const { t } = useI18n();
const toast = useToast();
const tab = ref("waiting");
const type = ref("all");
const rows = ref([]);
const loading = ref(true);
const busy = ref(null);
const rejecting = ref(null);
const reason = ref("");
const reasonError = ref("");

const load = async () => {
  loading.value = true;
  try {
    rows.value = (await axios.get("/api/approvals", { params: { tab: tab.value, type: type.value === "all" ? undefined : type.value } })).data.data.items;
  } finally {
    loading.value = false;
  }
};
onMounted(load);

const period = (l) => (l.start_date
  ? `${l.start_date}${l.end_date !== l.start_date ? " → " + l.end_date : ""}`
  : `${l.off_date} ${l.start_time?.slice(0, 5)}–${l.end_time?.slice(0, 5)}`);
const stageSeverity = (stage) => ({ approved: "success", rejected: "danger" }[stage] ?? "warn");
const open = (row) => row.type === "leave" && router.push({ name: "leave-review", params: { id: row.id } });

const decide = async (row, decision, note = null) => {
  busy.value = `${row.type}-${row.id}`;
  try {
    await axios.post(`/api/approvals/${row.type}/${row.id}/${decision}`, { note });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 2500 });
    rejecting.value = null;
    await load();
    loadApprover(true);
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 5000 });
  } finally {
    busy.value = null;
  }
};
const askReject = (row) => {
  rejecting.value = row;
  reason.value = "";
  reasonError.value = "";
};
const confirmReject = () => {
  if (!reason.value.trim()) return (reasonError.value = t("lflow.reject_reason"));
  decide(rejecting.value, "reject", reason.value);
};
</script>

<template>
  <div class="page">
    <Toast />
    <div class="page-header flex-wrap gap-2">
      <h1 class="page-title">{{ $t("lflow.approvals") }}</h1>
      <div class="flex gap-2 flex-wrap">
        <SelectButton v-model="type" :options="['all', 'leave', 'advance', 'overtime']" :optionLabel="(o) => $t(`lflow.kind_${o}`)" :allowEmpty="false" @change="load" />
        <SelectButton v-model="tab" :options="['waiting', 'done']" :optionLabel="(o) => $t(`lflow.${o}`)" :allowEmpty="false" @change="load" />
      </div>
    </div>
    <div v-if="loading" class="flex justify-center py-10"><ProgressSpinner style="width: 48px; height: 48px" /></div>
    <p v-else-if="!rows.length" class="text-muted-color">{{ $t("lflow.empty_waiting") }}</p>
    <div v-else class="approvals-list">
      <div v-for="row in rows" :key="`${row.type}-${row.id}`" class="card approval-row" :class="{ clickable: row.type === 'leave' }" @click="open(row)">
        <Avatar :label="row.employee.name?.charAt(0)" shape="circle" />
        <span class="flex flex-col flex-1 text-start">
          <b>{{ row.employee.name }} <small class="text-muted-color">· {{ row.employee.department }}</small></b>
          <span v-if="row.type === 'leave'">{{ row.leave_setup.title }} · <span dir="ltr">{{ period(row) }}</span></span>
          <span v-else>{{ $t(`lflow.kind_${row.type}`) }} · {{ row.summary }}</span>
          <small v-if="row.note" class="text-muted-color">{{ row.note }}</small>
          <span class="flex gap-1 flex-wrap mt-1">
            <Tag v-for="b in row.badges" :key="b" :value="$t(`lflow.badge_${b}`)" severity="danger" />
            <Tag v-if="row.leave_setup?.deduct_from === 'salary'" :value="$t('lflow.unpaid')" severity="secondary" />
          </span>
        </span>
        <Tag :value="$t(`lflow.stage_${row.stage}`)" :severity="stageSeverity(row.stage)" />
        <template v-if="row.type !== 'leave' && tab === 'waiting'">
          <Button :label="$t('accept')" icon="pi pi-check" size="small" :loading="busy === `${row.type}-${row.id}`" @click.stop="decide(row, 'approve')" />
          <Button :label="$t('reject')" icon="pi pi-times" size="small" severity="danger" variant="outlined" :disabled="!!busy" @click.stop="askReject(row)" />
        </template>
        <i v-else-if="row.type === 'leave'" class="pi pi-angle-left text-muted-color" />
      </div>
    </div>

    <Dialog :visible="!!rejecting" modal :header="$t('lflow.reject')" :style="{ width: '420px' }" @update:visible="(v) => !v && (rejecting = null)">
      <div class="flex flex-col gap-2">
        <label for="appr-reason" class="font-semibold">{{ $t("lflow.reject_reason") }}</label>
        <Textarea id="appr-reason" v-model="reason" rows="3" autoResize fluid />
        <small v-if="reasonError" class="text-red-600">{{ reasonError }}</small>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" variant="text" severity="secondary" @click="rejecting = null" />
        <Button :label="$t('lflow.reject')" severity="danger" :loading="!!busy" @click="confirmReject" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.approvals-list { display: flex; flex-direction: column; gap: .6rem; }
.approval-row { display: flex; align-items: center; gap: .8rem; margin: 0; border: 1px solid var(--p-content-border-color); flex-wrap: wrap; }
.approval-row.clickable { cursor: pointer; }
.approval-row.clickable:hover { border-color: var(--p-primary-color); }
</style>
