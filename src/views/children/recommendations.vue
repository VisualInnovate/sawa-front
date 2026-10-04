<script setup>
// The home recommendations given to the selected child.
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import ChildTaps from "../../components/ChildTaps.vue";
import ChildRecommendationsDialog from "../../components/children/ChildRecommendationsDialog.vue";
import { can } from "@/utils/permissions";
import { printRecommendations } from "@/utils/printRecommendations";

const { t } = useI18n();
const toast = useToast();
const childId = Number(localStorage.getItem("child_id"));
const child = ref(null);
const items = ref([]);
const loading = ref(true);
const dialog = ref(false);
const deleteId = ref(null);
const deleting = ref(false);

const canAdd = computed(() => can("child recommendations create"));
const canEdit = computed(() => can("child recommendations edit"));
const canDelete = computed(() => can("child recommendations delete"));
// {{name}} (any {{...}}) is the child's name.
const withName = (text) => String(text ?? "").replace(/\{\{.*?\}\}/g, child.value?.name.split(" ")[0] ?? "");

// The order set in the consultation settings (the API already sends them so; kept here for older responses).
// A recommendation since removed from the settings has no order and goes last.
const inDisplayOrder = (list) =>
  [...list].sort((a, b) => (a.display_order ?? Infinity) - (b.display_order ?? Infinity));

function print() {
  const d = new Date();
  const today = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  printRecommendations({ texts: items.value.map((item) => withName(item.text)), childName: child.value?.name, date: today, t });
}

async function load() {
  loading.value = true;
  try {
    const [childRes, listRes] = await Promise.all([
      // Same source as the child details tab: { id, name, gender, ... } at the top level.
      axios.get(`api/child/${childId}/get/evaluations`).catch(() => ({ data: null })),
      axios.get(`api/child-recommendations/${childId}`),
    ]);
    const data = childRes.data;
    child.value = data?.id ? { id: data.id, name: data.name, gender: data.gender } : { id: childId, name: "" };
    items.value = inDisplayOrder(listRes.data?.data ?? []);
  } catch {
    items.value = [];
    toast.add({ severity: "error", summary: t("error"), detail: t("request_failed_retry"), life: 4000 });
  } finally {
    loading.value = false;
  }
}

async function remove() {
  if (!deleteId.value || deleting.value) return;
  deleting.value = true;
  try {
    const { data } = await axios.delete(`api/child-recommendations/${childId}/${deleteId.value}`);
    items.value = inDisplayOrder(data?.data ?? items.value.filter((item) => item.id !== deleteId.value));
    deleteId.value = null;
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("request_failed_retry"), life: 4000 });
  } finally {
    deleting.value = false;
  }
}

const formatDate = (value) => (value ? String(value).slice(0, 10) : "—");

// Editing one given recommendation, either by rewriting its own text or by replacing it with another one from
// the consultation settings list; the API keeps the replaced text in the row's history (shown as an edit).
const editing = ref(null); // { id, mode: "text" | "replace", text, original, current, picked }
const savingEdit = ref(false);
const editError = ref("");
const openedHistory = ref({}); // row id -> all earlier texts shown
const settingsList = ref([]);
const settingsLoading = ref(false);

// The list's recommendations in display order, in the child's gender wording with the name filled in.
const replacementOptions = computed(() => {
  const gender = String(child.value?.gender) === "1" ? "female" : "male";
  return [...settingsList.value]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.id - b.id)
    .map((row) => ({ id: row.id, order: row.display_order, text: withName(row[gender] ?? row.value) }));
});

const editModes = computed(() => [
  { label: t("recommendation_edit_text"), value: "text" },
  { label: t("recommendation_replace"), value: "replace" },
]);
const canSaveEdit = computed(() => {
  const edit = editing.value;
  if (!edit) return false;
  if (edit.mode === "text") return edit.text.trim() !== "" && edit.text.trim() !== edit.original.trim();
  return !!edit.picked && edit.picked !== edit.current;
});

async function startEdit(item) {
  editError.value = "";
  // The text as it reads (the child's name filled in), ready to rewrite.
  const text = withName(item.text);
  editing.value = { id: item.id, mode: "text", text, original: text, current: item.recommendation_id, picked: item.recommendation_id };
  if (settingsList.value.length) return;
  settingsLoading.value = true;
  try {
    const { data } = await axios.get("api/consultation-settings");
    settingsList.value = data?.data?.recommendations ?? [];
  } catch {
    editError.value = t("request_failed_retry");
  } finally {
    settingsLoading.value = false;
  }
}

async function saveEdit() {
  if (!canSaveEdit.value || savingEdit.value) return;
  savingEdit.value = true;
  try {
    const edit = editing.value;
    const { data } = await axios.put(`api/child-recommendations/${childId}/${edit.id}`,
      edit.mode === "text" ? { text: edit.text.trim() } : { recommendation_id: edit.picked });
    items.value = inDisplayOrder(data?.data ?? items.value);
    editing.value = null;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("recommendation_updated"), life: 3000 });
  } catch (error) {
    const errors = error.response?.data?.errors ?? {};
    editError.value = errors.text?.[0] ?? errors.recommendation_id?.[0] ?? t("request_failed_retry");
  } finally {
    savingEdit.value = false;
  }
}

// Earlier texts, newest first.
const earlier = (item) => [...(item.history ?? [])].reverse();

onMounted(load);
</script>

<template>
  <div>
    <ChildTaps />

    <div class="sawa-card recommendations-page">
      <header class="page-head">
        <div>
          <h2>{{ $t("child_recommendations") }}</h2>
          <p v-if="child?.name">{{ child.name }}</p>
        </div>
        <div class="page-actions">
          <Button v-if="items.length" icon="pi pi-print" :label="$t('print')" severity="secondary" variant="outlined"
            data-no-request-spinner @click="print" />
          <Button v-if="canAdd" icon="pi pi-plus" :label="$t('add_recommendations')" @click="dialog = true" />
        </div>
      </header>

      <div v-if="loading" class="page-state"><i class="pi pi-spin pi-spinner" aria-hidden="true"></i><p>{{ $t("loading") }}</p></div>

      <ol v-else-if="items.length" class="recommendation-list">
        <li v-for="(item, index) in items" :key="item.id" class="recommendation-item">
          <span class="recommendation-number">{{ index + 1 }}</span>
          <div class="recommendation-body">
            <p>{{ withName(item.text) }}</p>
            <small>
              <i class="pi pi-calendar" aria-hidden="true"></i> <span dir="ltr">{{ formatDate(item.created_at) }}</span>
              <template v-if="item.added_by?.name"> · <i class="pi pi-user" aria-hidden="true"></i> {{ item.added_by.name }}</template>
            </small>

            <!-- Edited: the text it replaced (all earlier texts on demand) -->
            <div v-if="item.history?.length" class="recommendation-edited">
              <p class="edited-head">
                <i class="pi pi-pencil" aria-hidden="true"></i>
                {{ $t("recommendation_edited") }}
                <span dir="ltr">{{ formatDate(item.edited_at) }}</span>
                <template v-if="item.edited_by?.name"> · {{ item.edited_by.name }}</template>
              </p>
              <div v-for="(old, i) in openedHistory[item.id] ? earlier(item) : earlier(item).slice(0, 1)" :key="i" class="edited-old">
                <span class="edited-label">{{ $t("recommendation_previous_text") }}</span>
                <p>{{ withName(old.text) }}</p>
                <small v-if="openedHistory[item.id] && old.replaced_at">
                  <span dir="ltr">{{ formatDate(old.replaced_at) }}</span><template v-if="old.replaced_by"> · {{ old.replaced_by }}</template>
                </small>
              </div>
              <Button v-if="item.history.length > 1" variant="link" size="small" class="edited-toggle"
                :label="openedHistory[item.id] ? $t('recommendation_hide_edits') : $t('recommendation_all_edits', { n: item.history.length })"
                @click="openedHistory = { ...openedHistory, [item.id]: !openedHistory[item.id] }" />
            </div>
          </div>
          <div class="recommendation-actions">
            <Button v-if="canEdit" icon="pi pi-pencil" severity="info" variant="outlined" rounded
              v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="startEdit(item)" />
            <Button v-if="canDelete" icon="pi pi-trash" severity="danger" variant="outlined" rounded
              v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="deleteId = item.id" />
          </div>
        </li>
      </ol>

      <div v-else class="page-state">
        <i class="pi pi-inbox" aria-hidden="true"></i>
        <p>{{ $t("no_child_recommendations") }}</p>
      </div>
    </div>

    <ChildRecommendationsDialog v-model:visible="dialog" :child="child" @saved="items = inDisplayOrder($event)" />

    <Dialog :visible="editing !== null" @update:visible="editing = null" modal :header="$t('edit_recommendation')"
      :style="{ width: '40rem', maxWidth: '95vw' }">
      <div v-if="editing" class="edit-form">
        <SelectButton v-model="editing.mode" :options="editModes" optionLabel="label" optionValue="value" :allowEmpty="false"
          class="edit-modes" @update:modelValue="editError = ''" />

        <!-- Rewrite this recommendation's own text -->
        <template v-if="editing.mode === 'text'">
          <label for="edit-recommendation-text">{{ $t("recommendation_text") }}</label>
          <Textarea id="edit-recommendation-text" v-model="editing.text" rows="5" autoResize maxlength="5000"
            :invalid="!!editError" fluid />
          <small v-if="editError" class="field-error">{{ editError }}</small>
          <small v-else class="edit-note">{{ $t("recommendation_edit_text_note") }}</small>
        </template>

        <div v-else-if="settingsLoading" class="edit-state"><i class="pi pi-spin pi-spinner" aria-hidden="true"></i> {{ $t("loading") }}</div>
        <template v-else>
          <label for="edit-recommendation">{{ $t("recommendation_replace_with") }}</label>
          <Select
            v-model="editing.picked"
            inputId="edit-recommendation"
            :options="replacementOptions"
            optionLabel="text"
            optionValue="id"
            filter
            :filterPlaceholder="$t('search')"
            :invalid="!!editError"
            overlayClass="recommendations-overlay"
            fluid
          >
            <template #option="{ option }">
              <span class="recommendation-option">
                {{ option.text }}
                <small v-if="option.id === editing.current" class="recommendation-given">({{ $t("recommendation_current") }})</small>
              </span>
            </template>
          </Select>
          <p v-if="editing.picked" class="edit-preview">{{ replacementOptions.find((option) => option.id === editing.picked)?.text }}</p>
          <small v-if="editError" class="field-error">{{ editError }}</small>
          <small v-else class="edit-note">{{ $t("recommendation_edit_note") }}</small>
        </template>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" variant="text" severity="secondary" @click="editing = null" />
        <Button :label="$t('save')" icon="pi pi-check" :loading="savingEdit" data-no-request-spinner
          :disabled="!canSaveEdit" @click="saveEdit" />
      </template>
    </Dialog>

    <Dialog :visible="deleteId !== null" @update:visible="deleteId = null" modal :header="$t('confirm')" :style="{ width: '28rem', maxWidth: '95vw' }">
      <p>{{ $t("confirm_delete_recommendation") }}</p>
      <template #footer>
        <Button :label="$t('no')" variant="text" severity="secondary" @click="deleteId = null" />
        <Button :label="$t('yes')" severity="danger" :loading="deleting" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.recommendations-page { padding: 1.25rem; }
.page-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
.page-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.page-head h2 { margin: 0; color: #0f172a; font-size: 1.3rem; font-weight: 700; }
.page-head p { margin: 0.2rem 0 0; color: #64748b; }
.recommendation-list { display: grid; gap: 0.75rem; margin: 0; padding: 0; list-style: none; }
.recommendation-item { display: flex; align-items: flex-start; gap: 0.9rem; padding: 1rem 1.1rem; border: 1px solid #e2e8f0; border-inline-start: 4px solid var(--sawa-primary, #135c65); border-radius: 0.75rem; background: #fff; }
.recommendation-number { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 50%; background: #e6f4f3; color: var(--sawa-primary, #135c65); font-weight: 700; }
.recommendation-body { flex: 1; min-width: 0; }
.recommendation-body p { margin: 0 0 0.35rem; color: #1e293b; line-height: 1.8; white-space: pre-line; overflow-wrap: anywhere; }
.recommendation-body small { color: #94a3b8; }
.recommendation-actions { display: flex; flex-shrink: 0; gap: 0.4rem; }
.recommendation-edited { margin-top: 0.7rem; padding: 0.6rem 0.8rem; border-radius: 0.6rem; background: #fffbeb; border: 1px dashed #fcd34d; }
.recommendation-edited .edited-head { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; margin: 0 0 0.35rem; color: #b45309; font-size: 0.82rem; font-weight: 600; line-height: 1.5; }
.edited-old + .edited-old { margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed #fde68a; }
.edited-old .edited-label { color: #92400e; font-size: 0.78rem; font-weight: 600; }
.recommendation-body .edited-old p { margin: 0.1rem 0 0; color: #78716c; text-decoration: line-through; text-decoration-color: #d6d3d1; }
.edited-toggle { padding: 0; margin-top: 0.3rem; }
.edit-form { display: grid; gap: 0.5rem; }
.edit-form label { font-weight: 600; color: #334155; }
.edit-modes { margin-bottom: 0.5rem; }
.edit-note { color: #64748b; }
.edit-state { padding: 1rem 0; text-align: center; color: #64748b; }
.edit-preview { margin: 0; padding: 0.6rem 0.8rem; border-radius: 0.5rem; background: #f8fafc; line-height: 1.8; white-space: pre-line; }
.page-state { display: grid; justify-items: center; gap: 0.6rem; padding: 3rem 1rem; color: #64748b; }
.page-state i { font-size: 2.25rem; color: #94a3b8; }
</style>
