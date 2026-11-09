<script setup>
// «أقسام التقييمات»: one or more departments per evaluation type, one of them the default. An evaluation goes to the
// department asked for when it is one of them, else the evaluator's, else the default; a type with none keeps the old rule.
import axios from "axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";

const { t } = useI18n();
const toast = useToast();
const rows = ref([]);
const departments = ref([]);
const loading = ref(true);
const saving = ref(false);

const fromServer = (data) => data.map((row) => ({ type: row.type, department_ids: [...(row.department_ids ?? [])], default_id: row.default_id ?? null }));

onMounted(async () => {
  try {
    const [types, list] = await Promise.all([axios.get("api/evaluation-type-departments"), axios.get("api/department")]);
    rows.value = fromServer(types.data.data);
    departments.value = (list.data.data ?? []).map((d) => ({ id: d.id, title: d.title }));
  } finally {
    loading.value = false;
  }
});

const chosen = (row) => departments.value.filter((d) => row.department_ids.includes(d.id));

// The default stays one of the chosen departments: the first when it is removed (or none chosen yet).
function departmentsChanged(row) {
  if (!row.department_ids.includes(row.default_id)) row.default_id = row.department_ids[0] ?? null;
}

async function save() {
  saving.value = true;
  try {
    const { data } = await axios.put("api/evaluation-type-departments", { types: rows.value });
    rows.value = fromServer(data.data);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("eval_dept.saved"), life: 2500 });
    if (data.moved) toast.add({ severity: "info", summary: t("eval_dept.page"), detail: t("eval_dept.moved", { n: data.moved }), life: 5000 });
    if (data.kept) toast.add({ severity: "warn", summary: t("eval_dept.page"), detail: t("eval_dept.kept", { n: data.kept }), life: 6000 });
  } catch (e) {
    const errors = e.response?.data?.errors;
    toast.add({ severity: "error", summary: t("error"), detail: (errors && Object.values(errors)[0]?.[0]) || e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
      <p class="text-xl text-bp-135c65 font-bold"><i class="pi pi-sitemap" aria-hidden="true" /> {{ $t("eval_dept.page") }}</p>
      <Button icon="pi pi-save" :label="$t('save')" :loading="saving" :disabled="loading" @click="save" />
    </div>
    <p class="text-color-secondary mb-4">{{ $t("eval_dept.hint") }}</p>
    <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else class="ed-grid">
      <div v-for="row in rows" :key="row.type" class="ed-row">
        <strong>{{ getEvaluationTypeLabel(row.type, $t) }}</strong>
        <div class="flex flex-column gap-1">
          <label :for="`ed-deps-${row.type}`" class="text-sm text-color-secondary">{{ $t("eval_dept.departments") }}</label>
          <MultiSelect v-model="row.department_ids" :inputId="`ed-deps-${row.type}`" :options="departments" optionLabel="title" optionValue="id"
            filter display="chip" :placeholder="$t('eval_dept.none')" class="w-full" @change="departmentsChanged(row)" />
        </div>
        <div class="flex flex-column gap-1">
          <label :for="`ed-default-${row.type}`" class="text-sm text-color-secondary">{{ $t("eval_dept.default") }}</label>
          <Select v-model="row.default_id" :inputId="`ed-default-${row.type}`" :options="chosen(row)" optionLabel="title" optionValue="id"
            :disabled="row.department_ids.length < 2" :placeholder="$t('eval_dept.pick_default')" class="w-full" />
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<style scoped>
.ed-grid { display: grid; gap: .75rem; }
.ed-row { display: grid; grid-template-columns: minmax(10rem, 14rem) 2fr 1fr; align-items: end; gap: 1rem; padding: .75rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }
.ed-row > strong { align-self: center; }
@media (max-width: 768px) { .ed-row { grid-template-columns: 1fr; } }
</style>
