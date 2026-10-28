<script setup>
// «وصف التقييمات»: one written description per evaluation type, each saved by its own button. A report prints it
// (editable there) on the page before that evaluation's chart.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { typeLabel } from "@/components/reports/reportUtils";

const { t } = useI18n();
const toast = useToast();
// [{ type, description, saved }]: `saved` is the text on the server, to tell what changed.
const rows = ref([]);
const loading = ref(true);
const saving = ref(null);

const apply = (data) => {
  const typed = new Map(rows.value.map((row) => [row.type, row.description]));
  rows.value = data.map((row) => ({ ...row, saved: row.description, description: saving.value === row.type ? row.description : typed.get(row.type) ?? row.description }));
};
const dirty = computed(() => new Set(rows.value.filter((row) => row.description !== row.saved).map((row) => row.type)));

onMounted(async () => {
  try {
    apply((await axios.get("api/evaluation-type-descriptions")).data.data);
  } finally {
    loading.value = false;
  }
});

async function save(row) {
  saving.value = row.type;
  try {
    apply((await axios.put(`api/evaluation-type-descriptions/${row.type}`, { description: row.description })).data.data);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("eval_desc.saved"), life: 2500 });
  } catch (e) {
    const errors = e.response?.data?.errors;
    toast.add({ severity: "error", summary: t("error"), detail: (errors && Object.values(errors)[0]?.[0]) || e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    saving.value = null;
  }
}
</script>

<template>
  <div class="sawa-card p-3">
    <p class="text-xl text-[#135C65] font-bold mb-2"><i class="pi pi-align-right" aria-hidden="true" /> {{ $t("eval_desc.page") }}</p>
    <p class="text-color-secondary mb-4">{{ $t("eval_desc.hint") }}</p>
    <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else class="ed-grid">
      <section v-for="row in rows" :key="row.type" class="ed-card">
        <label :for="'ed-' + row.type" class="ed-title">{{ typeLabel(row.type, $t) }}</label>
        <Textarea :id="'ed-' + row.type" v-model="row.description" auto-resize rows="5" class="w-full" :placeholder="$t('eval_desc.placeholder')" />
        <div class="ed-actions">
          <span v-if="dirty.has(row.type)" class="ed-unsaved">{{ $t("eval_desc.unsaved") }}</span>
          <Button icon="pi pi-save" :label="$t('save')" :loading="saving === row.type" :disabled="saving !== null || !dirty.has(row.type)" @click="save(row)" />
        </div>
      </section>
    </div>
    <Toast />
  </div>
</template>

<style scoped>
.ed-grid { display: grid; gap: 1rem; }
.ed-card { display: grid; gap: .6rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }
.ed-title { font-weight: 800; color: #135c65; }
.ed-actions { display: flex; align-items: center; justify-content: flex-end; gap: .75rem; }
.ed-unsaved { color: #b45309; font-size: .85rem; }
</style>
