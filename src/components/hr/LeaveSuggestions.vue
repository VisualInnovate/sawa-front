<script setup>
// The leave types the current labour system provides for: HR ticks the ones to add; the ones already there are
// greyed out. The days are each law's usual minimums, editable afterwards.
import axios from "axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";

const emit = defineEmits(["added"]);
const { t } = useI18n();
const toast = useToast();

const open = ref(false);
const rows = ref([]);
const picked = ref([]);
const saving = ref(false);

async function show() {
  open.value = true;
  rows.value = (await axios.get("api/leave-setup/suggestions")).data.data;
  picked.value = rows.value.filter((r) => !r.exists).map((r) => r.key);
}
async function add() {
  saving.value = true;
  try {
    const { data } = await axios.post("api/leave-setup/suggestions", { keys: picked.value });
    toast.add({ severity: "success", summary: t("lvt.added", { n: data.data.added }), life: 3000 });
    open.value = false;
    emit("added");
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Button icon="pi pi-sparkles" :label="$t('lvt.suggestions')" outlined class="no-print" @click="show" />
  <Dialog v-model:visible="open" modal :header="$t('lvt.suggestions')" :style="{ width: '520px' }" :breakpoints="{ '560px': '95vw' }">
    <p class="mt-0 text-color-secondary">{{ $t("lvt.suggestions_hint") }}</p>
    <div class="flex flex-column gap-2">
      <label v-for="r in rows" :key="r.key" class="lvt-row" :class="{ 'opacity-50': r.exists }">
        <Checkbox v-model="picked" :value="r.key" :disabled="r.exists" />
        <span class="flex-1 font-medium">{{ r.title }}</span>
        <small class="text-color-secondary">
          {{ $t("lvt.n_days", { n: r.days }) }}<template v-if="r.more_after_years"> · {{ $t("lvt.more_short", { years: r.more_after_years, days: r.more_days }) }}</template>
          <template v-if="r.once_per_service"> · {{ $t("lvt.once_short") }}</template>
        </small>
        <Tag v-if="r.exists" severity="secondary" :value="$t('lvt.exists')" />
      </label>
    </div>
    <template #footer>
      <Button :label="$t('cancel')" text severity="secondary" @click="open = false" />
      <Button icon="pi pi-plus" :label="$t('lvt.add_picked')" :disabled="!picked.length" :loading="saving" @click="add" />
    </template>
  </Dialog>
</template>

<style scoped>
.lvt-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.8rem; border: 1px solid var(--p-content-border-color); border-radius: 10px; cursor: pointer; }
</style>
