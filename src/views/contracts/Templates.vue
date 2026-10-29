<script setup>
// «قوالب العقود»: the parents' contract templates — open one to write it, copy it, preview or print it as a blank form.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { can } from "@/utils/permissions";
import { printHtml } from "@/utils/printHtml";
import { contractDocument } from "@/components/contracts/contractDocument";

const { t, locale } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

const rows = ref([]);
const variables = ref([]);
const loading = ref(true);
const busy = ref(null);
const preview = ref({ open: false, html: "", name: "" });

const labels = computed(() => Object.fromEntries(variables.value.map((v) => [v.name, locale.value === "ar" ? v.label_ar : v.label_en])));
const dateTime = (iso) => (iso ? new Date(iso).toLocaleString(locale.value === "ar" ? "ar-JO" : "en-GB", { dateStyle: "medium", timeStyle: "short" }) : "");

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/contract-templates");
    rows.value = data.data;
    variables.value = data.variables;
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const fail = (e) => toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 4000 });

async function documentOf(row) {
  const { data } = await axios.get(`api/contract-templates/${row.id}`);
  return contractDocument(data.data, { labels: labels.value });
}

async function openPreview(row) {
  busy.value = row.id;
  try {
    preview.value = { open: true, html: await documentOf(row), name: row.name };
  } catch (e) {
    fail(e);
  } finally {
    busy.value = null;
  }
}

async function duplicate(row) {
  busy.value = row.id;
  try {
    const { data } = await axios.post(`api/contract-templates/${row.id}/duplicate`);
    toast.add({ severity: "success", summary: t("ct.copied"), life: 2500 });
    router.push({ name: "contract-template-edit", params: { id: data.data.id } });
  } catch (e) {
    fail(e);
  } finally {
    busy.value = null;
  }
}

function remove(row) {
  confirm.require({
    message: t("ct.confirm_delete", { name: row.name }),
    header: t("ct.delete"),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await axios.delete(`api/contract-templates/${row.id}`);
        toast.add({ severity: "success", summary: t("ct.deleted"), life: 2500 });
        load();
      } catch (e) {
        fail(e);
      }
    },
  });
}
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <p class="text-xl text-bp-135c65 font-bold mb-1"><i class="pi pi-file-edit" aria-hidden="true" /> {{ t("ct.menu") }}</p>
        <p class="text-color-secondary m-0">{{ t("ct.hint") }}</p>
      </div>
      <Button v-if="can('contract templates create')" icon="pi pi-plus" :label="t('ct.new')" @click="router.push({ name: 'contract-template-new' })" />
    </div>

    <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else class="ct-grid">
      <article v-for="row in rows" :key="row.id" class="ct-card" :class="{ off: !row.active }">
        <div class="flex items-start justify-between gap-2">
          <h3 class="ct-name">{{ row.name }}</h3>
          <Tag :severity="row.active ? 'success' : 'secondary'" :value="row.active ? t('ct.active') : t('ct.inactive')" />
        </div>
        <div class="ct-meta">
          <span v-if="row.kind"><i class="pi pi-tag" aria-hidden="true" /> {{ t("ct.kind_" + row.kind) }}</span>
          <span><i class="pi pi-list" aria-hidden="true" /> {{ t("ct.clauses_n", { n: row.clauses }) }}</span>
          <span><i class="pi pi-history" aria-hidden="true" /> {{ t("ct.version_n", { n: row.version }) }}</span>
        </div>
        <p v-if="row.approval_note" class="ct-note">{{ row.approval_note }}</p>
        <p v-if="row.unknown.length" class="ct-bad"><i class="pi pi-exclamation-circle" aria-hidden="true" /> {{ t("ct.unknown_n", { n: row.unknown.length }) }}</p>
        <p class="ct-updated">{{ t("ct.updated", { at: dateTime(row.updated_at) }) }}<template v-if="row.updated_by"> — {{ row.updated_by }}</template></p>
        <div class="ct-actions">
          <Button v-if="can('contract templates edit')" icon="pi pi-pencil" :label="t('ct.edit')" size="small" @click="router.push({ name: 'contract-template-edit', params: { id: row.id } })" />
          <Button icon="pi pi-eye" :label="t('ct.preview')" size="small" severity="secondary" outlined :loading="busy === row.id" @click="openPreview(row)" />
          <Button v-if="can('contract templates create')" icon="pi pi-copy" size="small" severity="secondary" text :aria-label="t('ct.copy')" v-tooltip.top="t('ct.copy')" :disabled="busy !== null" @click="duplicate(row)" />
          <Button v-if="can('contract templates delete')" icon="pi pi-trash" size="small" severity="danger" text :aria-label="t('ct.delete')" v-tooltip.top="t('ct.delete')" @click="remove(row)" />
        </div>
      </article>
      <p v-if="!rows.length" class="text-color-secondary">{{ t("ct.empty") }}</p>
    </div>

    <Dialog v-model:visible="preview.open" modal :header="preview.name" :style="{ width: '900px', maxWidth: '96vw' }">
      <iframe class="ct-frame" :srcdoc="preview.html" :title="preview.name" />
      <template #footer>
        <Button icon="pi pi-print" :label="t('ct.print_blank')" @click="printHtml(preview.html)" />
      </template>
    </Dialog>
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<style scoped>
.ct-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
.ct-card { display: flex; flex-direction: column; gap: .5rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 14px; background: #fff; }
.ct-card.off { background: #f8fafc; }
.ct-name { font-size: 1.05rem; font-weight: 800; color: rgb(var(--bp-135c65)); margin: 0; }
.ct-meta { display: flex; flex-wrap: wrap; gap: .4rem 1rem; color: #475569; font-size: .85rem; }
.ct-note { margin: 0; font-size: .8rem; color: #64748b; }
.ct-bad { margin: 0; font-size: .82rem; color: #b91c1c; font-weight: 700; }
.ct-updated { margin: 0; font-size: .78rem; color: #94a3b8; }
.ct-actions { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: auto; padding-top: .4rem; }
.ct-frame { width: 100%; height: 70vh; border: 0; border-radius: 8px; background: #f1f5f9; }
</style>
