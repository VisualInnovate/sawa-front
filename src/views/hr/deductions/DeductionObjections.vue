<script setup>
// «اعتراضات الخصومات»: what employees wrote about a deduction (from the «دوامي» app) and HR's answer; HR may cancel
// the deduction while it is not paid yet. The employee is told of the answer.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

const { t } = useI18n();
const toast = useToast();
const rows = ref([]);
const loading = ref(true);
const status = ref("open");
const current = ref(null);
const reply = ref("");
const cancelDeduction = ref(false);
const saving = ref(false);
const error = ref("");

const load = async () => {
  loading.value = true;
  try {
    rows.value = (await axios.get("/api/deduction-objections", { params: { status: status.value === "all" ? undefined : status.value } })).data.data;
  } finally {
    loading.value = false;
  }
};
onMounted(load);

const open = (row) => {
  current.value = row;
  reply.value = row.reply ?? "";
  cancelDeduction.value = false;
  error.value = "";
};
const visible = computed({ get: () => !!current.value, set: (v) => { if (!v) current.value = null; } });
const save = async () => {
  if (!reply.value.trim()) return (error.value = t("dobj.reply_required"));
  saving.value = true;
  try {
    await axios.post(`/api/deduction-objections/${current.value.id}/reply`, { reply: reply.value, reject_deduction: cancelDeduction.value });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 3000 });
    current.value = null;
    load();
  } catch (e) {
    error.value = e.response?.data?.message || t("mission_error");
  } finally {
    saving.value = false;
  }
};
const statusSeverity = (s) => ({ 1: "success", 0: "warn", "-1": "danger" }[s] ?? "secondary");
const statusLabel = (s) => ({ 1: t("Accepted"), 0: t("Pending"), "-1": t("Rejected") }[s] ?? s);
</script>

<template>
  <div class="page">
    <Toast />
    <div class="page-header">
      <h1 class="page-title">{{ $t("dobj.title") }}</h1>
      <SelectButton v-model="status" :options="['open', 'answered', 'all']" :optionLabel="(o) => $t(`dobj.status_${o}`)" :allowEmpty="false" @change="load" />
    </div>
    <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows class="p-datatable-sm">
      <Column :header="$t('employee_name')"><template #body="{ data }">{{ data.deduction?.employee?.name }}</template></Column>
      <Column :header="$t('dobj.deduction')">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span>{{ data.deduction?.deduction_type?.title ?? data.deduction?.reason }} · <span dir="ltr">{{ data.deduction?.date }}</span></span>
            <small class="text-muted-color">{{ data.deduction?.amount }}</small>
          </div>
        </template>
      </Column>
      <Column :header="$t('Status')"><template #body="{ data }"><Tag :value="statusLabel(data.deduction?.status)" :severity="statusSeverity(data.deduction?.status)" /></template></Column>
      <Column field="text" :header="$t('dobj.text')" />
      <Column :header="$t('dobj.reply')">
        <template #body="{ data }">
          <span v-if="data.reply">{{ data.reply }} <small class="text-muted-color">— {{ data.replier?.name }}</small></span>
          <Tag v-else :value="$t('dobj.status_open')" severity="warn" />
        </template>
      </Column>
      <Column header-style="width: 8rem">
        <template #body="{ data }">
          <Button :label="data.status === 'open' ? $t('dobj.answer') : $t('edit')" size="small" :severity="data.status === 'open' ? 'warn' : 'secondary'" variant="outlined" @click="open(data)" />
        </template>
      </Column>
      <template #empty><p class="text-center text-muted-color py-4">{{ $t("no_records_found") }}</p></template>
    </DataTable>

    <Dialog v-model:visible="visible" modal :header="$t('dobj.answer')" :style="{ width: '480px' }">
      <div v-if="current" class="flex flex-col gap-3">
        <div class="p-3 rounded-lg bg-surface-100">
          <b>{{ current.deduction?.employee?.name }}</b>
          <p class="m-0 mt-1">«{{ current.text }}»</p>
        </div>
        <label for="dobj-reply" class="font-semibold">{{ $t("dobj.reply") }}</label>
        <Textarea id="dobj-reply" v-model="reply" rows="3" autoResize fluid />
        <label class="flex items-center gap-2"><Checkbox v-model="cancelDeduction" binary inputId="dobj-cancel" /> {{ $t("dobj.cancel_deduction") }}</label>
        <small v-if="error" class="text-red-600">{{ error }}</small>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" variant="text" severity="secondary" @click="current = null" />
        <Button :label="$t('save')" icon="pi pi-check" :loading="saving" @click="save" />
      </template>
    </Dialog>
  </div>
</template>
