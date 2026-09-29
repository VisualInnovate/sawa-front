<script setup>
// Picks home recommendations (from the consultation settings list) for one child.
// props.child: { id, name, gender }; emits `saved` with the child's full list after saving.
import { computed, ref, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

const props = defineProps({ child: { type: Object, default: null } });
const visible = defineModel("visible", { type: Boolean, default: false });
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const settings = ref([]);
const given = ref([]);
const picked = ref([]);
const loading = ref(false);
const saving = ref(false);

const gender = computed(() => (String(props.child?.gender) === "1" ? "female" : "male"));
// {{name}} (any {{...}}) is the child's name.
const withName = (text) => String(text ?? "").replace(/\{\{.*?\}\}/g, props.child?.name.split(" ")[0] ?? "");
const givenIds = computed(() => new Set(given.value.map((item) => item.recommendation_id)));
// Recommendations the child already has are listed but cannot be picked again.
const options = computed(() => [...settings.value]
  .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.id - b.id)
  .map((row) => ({ id: row.id, text: withName(row[gender.value] ?? row.value), disabled: givenIds.value.has(row.id) })));

watch(visible, async (open) => {
  if (!open || !props.child?.id) return;
  picked.value = [];
  loading.value = true;
  try {
    const [settingsRes, givenRes] = await Promise.all([
      axios.get("api/consultation-settings"),
      axios.get(`api/child-recommendations/${props.child.id}`),
    ]);
    settings.value = settingsRes.data?.data?.recommendations ?? [];
    given.value = givenRes.data?.data ?? [];
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("request_failed_retry"), life: 4000 });
  } finally {
    loading.value = false;
  }
});

async function save() {
  if (!picked.value.length || saving.value) return;
  saving.value = true;
  try {
    const { data } = await axios.post(`api/child-recommendations/${props.child.id}`, { recommendation_ids: picked.value });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("recommendations_added"), life: 3000 });
    emit("saved", data?.data ?? []);
    visible.value = false;
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message || t("request_failed_retry"), life: 4000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="$t('add_recommendations')" :style="{ width: '46rem', maxWidth: '95vw' }">
    <p class="dialog-child">{{ $t("child_name") }}: <strong>{{ child?.name }}</strong></p>

    <div v-if="loading" class="dialog-state"><i class="pi pi-spin pi-spinner" aria-hidden="true"></i> {{ $t("loading") }}</div>
    <p v-else-if="!options.length" class="dialog-state">{{ $t("no_recommendations_in_settings") }}</p>
    <div v-else class="flex flex-column gap-2">
      <label for="child-recommendations">{{ $t("choose_home_recommendations") }}</label>
      <MultiSelect
        inputId="child-recommendations"
        v-model="picked"
        :options="options"
        optionLabel="text"
        optionValue="id"
        optionDisabled="disabled"
        filter
        :maxSelectedLabels="0"
        :selectedItemsLabel="$t('recommendations_selected', ['{0}'])"
        :placeholder="$t('choose_home_recommendations')"
        :filterPlaceholder="$t('search')"
        overlayClass="recommendations-overlay"
        class="w-full"
      >
        <template #option="{ option }">
          <span class="recommendation-option">
            {{ option.text }}
            <small v-if="option.disabled" class="recommendation-given">({{ $t("recommendation_already_given") }})</small>
          </span>
        </template>
      </MultiSelect>

      <ol v-if="picked.length" class="picked-list">
        <li v-for="id in picked" :key="id">{{ options.find((option) => option.id === id)?.text }}</li>
      </ol>
    </div>

    <template #footer>
      <Button :label="$t('cancel')" variant="text" severity="secondary" @click="visible = false" />
      <Button :label="$t('save')" icon="pi pi-check" :loading="saving" :disabled="!picked.length || saving" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-child { margin: 0 0 1rem; color: #475569; }
.dialog-state { padding: 1.5rem 0; text-align: center; color: #64748b; }
.picked-list { display: grid; gap: 0.5rem; margin: 0.75rem 0 0; list-style: decimal; padding: 0.75rem 1.75rem; border-radius: 0.6rem; background: #f8fafc; line-height: 1.7; }
.recommendation-given { color: #94a3b8; margin-inline-start: 0.35rem; }
</style>

<style>
/* The list is teleported to <body>, so it can't use scoped styles. */
.recommendations-overlay { max-width: min(46rem, calc(100vw - 2rem)); }
.recommendations-overlay .p-multiselect-option { align-items: flex-start; gap: 0.75rem; padding: 0.75rem 1rem; border-bottom: 1px solid #eef2f7; }
.recommendations-overlay .p-multiselect-option .p-checkbox { margin-top: 0.2rem; flex-shrink: 0; }
.recommendation-option { white-space: normal; overflow-wrap: anywhere; line-height: 1.7; font-size: 0.9rem; }
</style>
