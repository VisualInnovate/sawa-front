<script setup>
// Write a contract template: its details, the text in the editor, and {{variables}} from the panel beside it.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { printHtml } from "@/utils/printHtml";
import ContractEditor from "@/components/contracts/ContractEditor.vue";
import VariablesPanel from "@/components/contracts/VariablesPanel.vue";
import { clauseCount, contractDocument, usedVariables } from "@/components/contracts/contractDocument";

const { t, locale } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const DEFAULT_HEADER = "أكاديمية سوا للتربية الخاصة\nالإدارة العامة\nعقد مع أهالي الطلبة";
const blank = () => ({ name: "", kind: null, header: DEFAULT_HEADER, title: "", body: "", approval_note: "", active: true });

const id = computed(() => route.params.id || null);
const form = ref(blank());
const saved = ref(JSON.stringify(blank()));
const meta = ref({ version: null });
const variables = ref([]);
const groups = ref({});
const kinds = ref([]);
const loading = ref(true);
const saving = ref(false);
const errors = ref({});
const editor = ref(null);
const preview = ref({ open: false, html: "" });

const known = computed(() => new Set(variables.value.map((v) => v.name)));
const labels = computed(() => Object.fromEntries(variables.value.map((v) => [v.name, locale.value === "ar" ? v.label_ar : v.label_en])));
const used = computed(() => usedVariables(`${form.value.header}\n${form.value.title}\n${form.value.approval_note}\n${form.value.body}`));
const unknown = computed(() => used.value.filter((name) => !known.value.has(name)));
const clauses = computed(() => clauseCount(form.value.body));
const dirty = computed(() => JSON.stringify(form.value) !== saved.value);
const kindOptions = computed(() => kinds.value.map((k) => ({ value: k, label: t("ct.kind_" + k) })));

const take = (data) => {
  form.value = { name: data.name, kind: data.kind, header: data.header || "", title: data.title || "", body: data.body || "", approval_note: data.approval_note || "", active: data.active };
  saved.value = JSON.stringify(form.value);
  meta.value = { version: data.version };
};

onMounted(async () => {
  try {
    const list = (await axios.get("api/contract-templates")).data;
    variables.value = list.variables;
    groups.value = list.groups;
    kinds.value = list.kinds;
    if (id.value) take((await axios.get(`api/contract-templates/${id.value}`)).data.data);
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    loading.value = false;
  }
});

onBeforeRouteLeave(() => saving.value || !dirty.value || window.confirm(t("ct.leave_unsaved")));

async function save() {
  saving.value = true;
  errors.value = {};
  try {
    const { data } = id.value ? await axios.put(`api/contract-templates/${id.value}`, form.value) : await axios.post("api/contract-templates", form.value);
    take(data.data);
    toast.add({ severity: "success", summary: t("ct.saved"), detail: t("ct.version_n", { n: data.data.version }), life: 2500 });
    if (!id.value) router.replace({ name: "contract-template-edit", params: { id: data.data.id } });
  } catch (e) {
    errors.value = e.response?.data?.errors || {};
    toast.add({ severity: "error", summary: t("error"), detail: Object.values(errors.value)[0]?.[0] || e.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    saving.value = false;
  }
}

function openPreview() {
  preview.value = { open: true, html: contractDocument(form.value, { labels: labels.value }) };
}
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-2">
        <Button icon="pi pi-arrow-right" text rounded :aria-label="t('ct.back')" @click="router.push({ name: 'contract-templates' })" />
        <div>
          <p class="text-xl text-bp-135c65 font-bold m-0">{{ id ? t("ct.edit_title") : t("ct.new") }}</p>
          <p v-if="meta.version" class="text-color-secondary text-sm m-0">{{ t("ct.version_n", { n: meta.version }) }} · {{ t("ct.version_hint") }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="dirty" class="text-sm" style="color: #b45309">{{ t("ct.unsaved") }}</span>
        <Button icon="pi pi-eye" :label="t('ct.preview')" severity="secondary" outlined :disabled="loading" @click="openPreview" />
        <Button icon="pi pi-save" :label="t('save')" :loading="saving" :disabled="loading || !dirty" @click="save" />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <template v-else>
      <div class="te-fields">
        <div class="te-field">
          <label for="ct-name">{{ t("ct.name") }}</label>
          <InputText id="ct-name" v-model="form.name" :invalid="!!errors.name" />
          <small v-if="errors.name" class="p-error">{{ errors.name[0] }}</small>
        </div>
        <div class="te-field">
          <label for="ct-kind">{{ t("ct.kind") }}</label>
          <Select input-id="ct-kind" v-model="form.kind" :options="kindOptions" option-label="label" option-value="value" show-clear :placeholder="t('ct.kind_any')" />
        </div>
        <div class="te-field">
          <label for="ct-title">{{ t("ct.doc_title") }}</label>
          <InputText id="ct-title" v-model="form.title" />
        </div>
        <div class="te-field">
          <label for="ct-note">{{ t("ct.approval_note") }}</label>
          <InputText id="ct-note" v-model="form.approval_note" :placeholder="t('ct.approval_note_ph')" />
        </div>
        <div class="te-field te-wide">
          <label for="ct-header">{{ t("ct.header") }}</label>
          <Textarea id="ct-header" v-model="form.header" rows="3" auto-resize />
        </div>
        <div class="te-field te-switch">
          <ToggleSwitch input-id="ct-active" v-model="form.active" />
          <label for="ct-active">{{ t("ct.active_hint") }}</label>
        </div>
      </div>

      <div class="te-main">
        <div class="te-text">
          <div class="te-status">
            <span><i class="pi pi-list" aria-hidden="true" /> {{ t("ct.clauses_n", { n: clauses }) }}</span>
            <span><i class="pi pi-code" aria-hidden="true" /> {{ t("ct.used_n", { n: used.length - unknown.length }) }}</span>
            <span v-if="unknown.length" class="te-bad"><i class="pi pi-exclamation-circle" aria-hidden="true" /> {{ t("ct.unknown_list", { list: unknown.join("، ") }) }}</span>
          </div>
          <p class="te-tip">{{ t("ct.clauses_tip") }}</p>
          <ContractEditor ref="editor" v-model="form.body" :known="known" :placeholder="t('ct.body_ph')" />
          <small v-if="errors.body" class="p-error">{{ errors.body[0] }}</small>
        </div>
        <VariablesPanel :variables="variables" :groups="groups" :used="used" @pick="(name) => editor?.insert(name)" />
      </div>
    </template>

    <Dialog v-model:visible="preview.open" modal :header="form.name || t('ct.preview')" :style="{ width: '900px', maxWidth: '96vw' }">
      <iframe class="te-frame" :srcdoc="preview.html" :title="t('ct.preview')" />
      <template #footer>
        <Button icon="pi pi-print" :label="t('ct.print_blank')" @click="printHtml(preview.html)" />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<style scoped>
.te-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: .9rem 1rem; margin-bottom: 1.25rem; }
.te-field { display: grid; gap: .35rem; align-content: start; }
.te-field label { font-weight: 700; font-size: .88rem; }
.te-wide { grid-column: span 2; }
.te-switch { display: flex; align-items: center; gap: .6rem; }
.te-switch label { font-weight: 500; }
.te-main { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 1rem; align-items: start; }
.te-text { display: grid; gap: .5rem; min-width: 0; }
.te-status { display: flex; flex-wrap: wrap; gap: .4rem 1.2rem; font-size: .85rem; color: #475569; }
.te-bad { color: #b91c1c; font-weight: 700; }
.te-tip { margin: 0; font-size: .8rem; color: #64748b; }
.te-frame { width: 100%; height: 70vh; border: 0; border-radius: 8px; background: #f1f5f9; }
@media (max-width: 1100px) { .te-main { grid-template-columns: 1fr; } }
@media (max-width: 640px) { .te-wide { grid-column: auto; } }
</style>
