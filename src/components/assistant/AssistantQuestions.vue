<script setup>
// The questions the parent assistant asks about a child before suggesting evaluations (editable rows).
import axios from "axios";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

const props = defineProps({ questions: { type: Array, default: () => [] }, canEdit: Boolean });
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const rows = ref([]);
const draft = ref({ key: "", question: "" });
watch(() => props.questions, (list) => (rows.value = list.map((q) => ({ ...q }))), { immediate: true });

function failed(error) {
  const errors = error.response?.data?.errors;
  toast.add({ severity: "error", summary: t("error"), detail: errors ? Object.values(errors).flat()[0] : error.response?.data?.message, life: 4000 });
}

async function save(row) {
  try {
    await axios.put(`api/assistant-settings/parent/questions/${row.id}`, { key: row.key, question: row.question, sort: row.sort, active: row.active });
    toast.add({ severity: "success", summary: t("ai.saved"), life: 2000 });
    emit("saved");
  } catch (error) {
    failed(error);
  }
}

async function add() {
  try {
    await axios.post("api/assistant-settings/parent/questions", draft.value);
    draft.value = { key: "", question: "" };
    emit("saved");
  } catch (error) {
    failed(error);
  }
}

function remove(row) {
  confirm.require({
    message: t("ai.confirm_delete"),
    accept: async () => {
      await axios.delete(`api/assistant-settings/parent/questions/${row.id}`);
      toast.add({ severity: "success", summary: t("ai.deleted"), life: 2000 });
      emit("saved");
    },
  });
}
</script>

<template>
  <Message severity="info" size="small" class="mb-3">{{ $t("ai.questions_hint") }}</Message>
  <DataTable :value="rows" dataKey="id" size="small" stripedRows>
    <Column :header="$t('ai.sort')" style="width: 90px">
      <template #body="{ data }"><InputNumber v-model="data.sort" :min="0" inputClass="w-16" :disabled="!canEdit" /></template>
    </Column>
    <Column :header="$t('ai.question_key')" style="width: 170px">
      <template #body="{ data }"><InputText v-model="data.key" class="w-full" dir="ltr" :disabled="!canEdit" /></template>
    </Column>
    <Column :header="$t('ai.question_text')">
      <template #body="{ data }"><Textarea v-model="data.question" rows="1" autoResize class="w-full" :disabled="!canEdit" /></template>
    </Column>
    <Column :header="$t('ai.active')" style="width: 80px">
      <template #body="{ data }"><ToggleSwitch v-model="data.active" :disabled="!canEdit" /></template>
    </Column>
    <Column v-if="canEdit" style="width: 110px">
      <template #body="{ data }">
        <div class="flex gap-1">
          <Button icon="pi pi-check" size="small" text :aria-label="$t('submit')" @click="save(data)" />
          <Button icon="pi pi-trash" size="small" text severity="danger" :aria-label="$t('delete')" @click="remove(data)" />
        </div>
      </template>
    </Column>
  </DataTable>
  <div v-if="canEdit" class="flex flex-wrap items-end gap-2 mt-4">
    <div class="flex flex-col gap-1">
      <label for="ai-q-key">{{ $t("ai.question_key") }}</label>
      <InputText v-model="draft.key" id="ai-q-key" dir="ltr" placeholder="sleep" />
    </div>
    <div class="flex flex-col gap-1 grow">
      <label for="ai-q-text">{{ $t("ai.question_text") }}</label>
      <InputText v-model="draft.question" id="ai-q-text" class="w-full" />
    </div>
    <Button icon="pi pi-plus" :label="$t('ai.add_question')" :disabled="!draft.key || !draft.question" @click="add" />
  </div>
</template>
