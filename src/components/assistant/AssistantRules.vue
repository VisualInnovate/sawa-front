<script setup>
// The evaluation suggestion rules: an evaluation is suggested when one of its concerns matches and the age fits.
import axios from "axios";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

const props = defineProps({
  rules: { type: Array, default: () => [] },
  concerns: { type: Array, default: () => [] },
  evaluationTypes: { type: Array, default: () => [] },
  canEdit: Boolean,
});
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const blank = () => ({ evaluation_type: null, concerns: [], from_months: null, to_months: null, reason: "", active: true });
const rows = ref([]);
const draft = ref(blank());
watch(() => props.rules, (list) => (rows.value = list.map((r) => ({ ...r, concerns: [...r.concerns] }))), { immediate: true });

const body = (row) => ({
  evaluation_type: row.evaluation_type, concerns: row.concerns, from_months: row.from_months, to_months: row.to_months,
  reason: row.reason, sort: row.sort, active: row.active,
});

function failed(error) {
  const errors = error.response?.data?.errors;
  toast.add({ severity: "error", summary: t("error"), detail: errors ? Object.values(errors).flat()[0] : error.response?.data?.message, life: 4000 });
}

async function save(row) {
  try {
    await axios.put(`api/assistant-settings/parent/rules/${row.id}`, body(row));
    toast.add({ severity: "success", summary: t("ai.saved"), life: 2000 });
    emit("saved");
  } catch (error) {
    failed(error);
  }
}

async function add() {
  try {
    await axios.post("api/assistant-settings/parent/rules", body(draft.value));
    draft.value = blank();
    emit("saved");
  } catch (error) {
    failed(error);
  }
}

function remove(row) {
  confirm.require({
    message: t("ai.confirm_delete"),
    accept: async () => {
      await axios.delete(`api/assistant-settings/parent/rules/${row.id}`);
      toast.add({ severity: "success", summary: t("ai.deleted"), life: 2000 });
      emit("saved");
    },
  });
}
</script>

<template>
  <Message severity="info" size="small" class="mb-3">{{ $t("ai.rules_hint") }}</Message>
  <div class="flex flex-col gap-3">
    <div v-for="row in [...rows, ...(canEdit ? [draft] : [])]" :key="row.id ?? 'new'" class="ai-rule" :class="{ 'ai-rule--new': !row.id }">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
        <div class="flex flex-col gap-1 md:col-span-3">
          <label>{{ $t("ai.rule_evaluation") }}</label>
          <Select v-model="row.evaluation_type" :options="evaluationTypes" optionLabel="name" optionValue="type" :disabled="!canEdit" />
        </div>
        <div class="flex flex-col gap-1 md:col-span-4">
          <label>{{ $t("ai.rule_concerns") }}</label>
          <MultiSelect v-model="row.concerns" :options="concerns" optionLabel="label" optionValue="key" display="chip" :disabled="!canEdit" />
        </div>
        <div class="flex flex-col gap-1 md:col-span-3">
          <label>{{ $t("ai.rule_age") }}</label>
          <div class="flex items-center gap-1">
            <InputNumber v-model="row.from_months" :min="0" :max="300" :placeholder="$t('ai.from_months')" inputClass="w-20" :disabled="!canEdit" />
            <span>–</span>
            <InputNumber v-model="row.to_months" :min="0" :max="300" :placeholder="$t('ai.to_months')" inputClass="w-20" :disabled="!canEdit" />
          </div>
          <small v-if="row.from_months == null && row.to_months == null" class="text-gray-500">{{ $t("ai.age_any") }}</small>
        </div>
        <div class="flex items-center gap-2 md:col-span-2">
          <ToggleSwitch v-model="row.active" :disabled="!canEdit" />
          <span>{{ $t("ai.active") }}</span>
        </div>
        <div class="flex flex-col gap-1 md:col-span-10">
          <label>{{ $t("ai.rule_reason") }}</label>
          <Textarea v-model="row.reason" rows="1" autoResize :disabled="!canEdit" />
        </div>
        <div v-if="canEdit" class="flex gap-1 md:col-span-2 justify-end">
          <template v-if="row.id">
            <Button icon="pi pi-check" size="small" text :aria-label="$t('submit')" @click="save(row)" />
            <Button icon="pi pi-trash" size="small" text severity="danger" :aria-label="$t('delete')" @click="remove(row)" />
          </template>
          <Button v-else icon="pi pi-plus" size="small" :label="$t('ai.add_rule')"
            :disabled="!row.evaluation_type || !row.concerns.length || !row.reason" @click="add" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-rule {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}
.ai-rule--new {
  border-style: dashed;
  background: #f9fafb;
}
</style>
