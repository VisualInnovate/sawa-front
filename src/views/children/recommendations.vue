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
          </div>
          <Button v-if="canDelete" icon="pi pi-trash" severity="danger" variant="outlined" rounded
            v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="deleteId = item.id" />
        </li>
      </ol>

      <div v-else class="page-state">
        <i class="pi pi-inbox" aria-hidden="true"></i>
        <p>{{ $t("no_child_recommendations") }}</p>
      </div>
    </div>

    <ChildRecommendationsDialog v-model:visible="dialog" :child="child" @saved="items = inDisplayOrder($event)" />

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
.page-state { display: grid; justify-items: center; gap: 0.6rem; padding: 3rem 1rem; color: #64748b; }
.page-state i { font-size: 2.25rem; color: #94a3b8; }
</style>
