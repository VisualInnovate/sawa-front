<script setup>
// A manual fee for a child: a kind from the settings (its default price, editable) or «أخرى» with a description;
// one installment on its date, or several.
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText, isoDate, today } from "@/utils/accounting";
import InstallmentsEditor from "@/components/accounting/InstallmentsEditor.vue";

const props = defineProps({ childId: { type: [Number, String], default: null } });
const visible = defineModel("visible", { type: Boolean, default: false });
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const children = ref([]);
const types = ref([]);
const form = ref({});
const split = ref(false);
const rows = ref([]);
const saving = ref(false);

// "other" (not null): the Select shows nothing for a null value.
const typeOptions = computed(() => [...types.value, { id: "other", name: t("acc.fee_other") }]);
const sumOk = computed(() => !split.value || Math.abs(rows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0) - Number(form.value.amount || 0)) < 0.01);
const isOther = computed(() => form.value.fee_type_id === "other");
const ready = computed(() => form.value.child_id && Number(form.value.amount) > 0 && (!isOther.value || form.value.description?.trim()) && sumOk.value);

watch(visible, async (open) => {
  if (!open) return;
  form.value = { child_id: props.childId ? Number(props.childId) : null, fee_type_id: "other", description: "", amount: null, due_date: new Date() };
  split.value = false;
  rows.value = [];
  const requests = [axios.get("api/accounting/settings")];
  if (!props.childId && !children.value.length) requests.push(axios.get("api/child"));
  const [settings, childList] = await Promise.all(requests);
  types.value = settings.data.data.fee_types;
  if (childList) children.value = childList.data.children ?? [];
});

function pickType(id) {
  const type = types.value.find((row) => row.id === id);
  if (type) form.value.amount = type.default_price;
}

async function save() {
  saving.value = true;
  try {
    await axios.post("api/accounting/charges", {
      child_id: form.value.child_id, fee_type_id: isOther.value ? null : form.value.fee_type_id, description: isOther.value ? form.value.description : null,
      amount: form.value.amount, due_date: isoDate(form.value.due_date) ?? today(), installments: split.value ? rows.value : null,
    });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("acc.saved"), life: 2500 });
    visible.value = false;
    emit("saved");
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="$t('acc.add_fee')" :style="{ width: '40rem' }" :breakpoints="{ '768px': '95vw' }">
    <div class="flex flex-column gap-3">
      <div v-if="!childId" class="flex flex-column gap-1">
        <label for="fee-child">{{ $t("acc.child") }}</label>
        <Select v-model="form.child_id" inputId="fee-child" :options="children" optionLabel="name" optionValue="id" filter :placeholder="$t('acc.search_child')" />
      </div>
      <div class="flex flex-column gap-1">
        <label for="fee-type">{{ $t("acc.fee_type") }}</label>
        <Select v-model="form.fee_type_id" inputId="fee-type" :options="typeOptions" optionLabel="name" optionValue="id" @change="(e) => pickType(e.value)" />
      </div>
      <div v-if="isOther" class="flex flex-column gap-1">
        <label for="fee-desc">{{ $t("acc.description") }}</label>
        <InputText v-model="form.description" id="fee-desc" />
      </div>
      <div class="flex flex-wrap gap-3">
        <div class="flex flex-column gap-1">
          <label for="fee-amount">{{ $t("acc.amount") }}</label>
          <InputNumber v-model="form.amount" inputId="fee-amount" :min="0" :maxFractionDigits="2" />
        </div>
        <div v-if="!split" class="flex flex-column gap-1">
          <label for="fee-due">{{ $t("acc.due_date") }}</label>
          <DatePicker v-model="form.due_date" inputId="fee-due" dateFormat="yy-mm-dd" showIcon />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <ToggleSwitch v-model="split" inputId="fee-split" />
        <label for="fee-split">{{ $t("acc.installments") }}</label>
      </div>
      <InstallmentsEditor v-if="split" v-model="rows" :owed="Number(form.amount || 0)" />
    </div>
    <template #footer>
      <Button :label="$t('acc.cancel')" severity="secondary" variant="outlined" @click="visible = false" />
      <Button icon="pi pi-check" :label="$t('acc.save')" :loading="saving" :disabled="!ready" @click="save" />
    </template>
  </Dialog>
</template>
