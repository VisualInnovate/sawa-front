<script setup>
// «توزيع التقييمات»: the evaluations asked of my department without an appointment («مطلوب»). The head — or the
// deputy — keeps it, or gives it to the deputy or a therapist of the department («مُسند»).
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { typeLabel } from "@/components/reports/reportUtils";
import { errorText } from "@/utils/accounting";

const { t } = useI18n();
const toast = useToast();
const rows = ref([]);
const therapists = ref({});
const loading = ref(false);
const chosen = ref({});
const saving = ref(null);

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/evaluation-request/to-assign");
    rows.value = data.data;
    therapists.value = data.therapists ?? {};
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  } finally {
    loading.value = false;
  }
}

async function assign(row) {
  saving.value = row.id;
  try {
    await axios.post(`api/evaluation-request/${row.id}/assign`, { employee_id: chosen.value[row.id] });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("ewf.assigned"), life: 2500 });
    await load();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  } finally {
    saving.value = null;
  }
}

onMounted(load);
</script>

<template>
  <div class="sawa-card p-3">
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div>
        <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("ewf.distribution") }}</p>
        <small class="text-color-secondary">{{ $t("ewf.distribution_hint") }}</small>
      </div>
      <Button icon="pi pi-refresh" variant="text" :loading="loading" @click="load" :aria-label="$t('refresh_data')" />
    </div>
    <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows size="small">
      <template #empty><p class="text-center text-color-secondary m-0">{{ $t("ewf.nothing_to_assign") }}</p></template>
      <Column :header="$t('child')"><template #body="{ data }"><b>{{ data.child?.name }}</b></template></Column>
      <Column :header="$t('ea_type')"><template #body="{ data }">{{ typeLabel(data.evaluation_type, t) }}</template></Column>
      <Column :header="$t('ewf.department')"><template #body="{ data }">{{ data.department ?? "—" }}</template></Column>
      <Column :header="$t('ewf.requested_by')">
        <template #body="{ data }">
          {{ data.requested_by ?? "—" }}
          <small class="block text-color-secondary"><bdi>{{ data.created_at }}</bdi></small>
          <small v-if="data.notes" class="block">{{ data.notes }}</small>
        </template>
      </Column>
      <Column :header="$t('ewf.assign_to')" style="min-width: 16rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Select v-model="chosen[data.id]" :options="therapists[data.department_id] ?? []" optionLabel="name" optionValue="id" filter
              :placeholder="$t('ewf.pick_therapist')" class="flex-1" :aria-label="$t('ewf.assign_to')" />
            <Button icon="pi pi-check" :disabled="!chosen[data.id]" :loading="saving === data.id" @click="assign(data)" :aria-label="$t('ewf.assign')"
              v-tooltip.top="$t('ewf.assign')" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
