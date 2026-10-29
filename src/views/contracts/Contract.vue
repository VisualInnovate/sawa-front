<script setup>
// One issued contract. While a draft: fill its values and recipient (live preview beside), or edit this contract's own
// text without touching the template. Words, totals, the clause count and the number are worked out on saving.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { can } from "@/utils/permissions";
import { printHtml } from "@/utils/printHtml";
import ContractEditor from "@/components/contracts/ContractEditor.vue";
import VariablesPanel from "@/components/contracts/VariablesPanel.vue";
import SignaturePad from "@/components/contracts/SignaturePad.vue";
import { usedVariables } from "@/components/contracts/contractDocument";
import { contractPage, statusSeverity } from "@/components/contracts/contractStatus";

const { t, locale } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const route = useRoute();
const router = useRouter();

const DATES = ["تاريخ_العقد", "تاريخ_البداية", "تاريخ_النهاية", "تاريخ_ميلاد_الطالب"];
const NUMBERS = ["القسط_الشهري", "التكلفة_الإجمالية", "تكلفة_الإضافات", "عدد_الجلسات_الشهري", "عدد_الجلسات_الفردية", "عدد_الجلسات_الجماعية"];
const TEXT_FIELDS = ["header", "title", "body", "approval_note"];
const RECIPIENT = ["recipient_name", "recipient_phone", "recipient_email"];

const contract = ref(null);
const form = ref(null);
const saved = ref("");
const variables = ref([]);
const groups = ref({});
const computedNames = ref([]);
const loading = ref(true);
const saving = ref(false);
const errors = ref({});
const tab = ref("values");
const editor = ref(null);
const previewHtml = ref("");

const editable = computed(() => contract.value?.status === "draft" && can("parent contracts edit"));
const dirty = computed(() => form.value && JSON.stringify(form.value) !== saved.value);
const labelOf = (v) => (locale.value === "ar" ? v.label_ar : v.label_en);
const used = computed(() => (form.value ? usedVariables(TEXT_FIELDS.map((f) => form.value[f]).join("\n")) : []));
const known = computed(() => new Set(variables.value.map((v) => v.name)));
const missing = computed(() => used.value.filter((n) => known.value.has(n) && !computedNames.value.includes(n) && !String(form.value.values[n] ?? "").trim()));
const sections = computed(() =>
  Object.keys(groups.value)
    .map((key) => ({ key, label: locale.value === "ar" ? groups.value[key].ar : groups.value[key].en, items: variables.value.filter((v) => v.group === key && used.value.includes(v.name)) }))
    .filter((g) => g.items.length),
);

const take = (payload) => {
  contract.value = payload.data;
  variables.value = payload.variables;
  groups.value = payload.groups;
  computedNames.value = payload.computed;
  const d = payload.data;
  form.value = { values: { ...d.values }, header: d.header || "", title: d.title || "", body: d.body || "", approval_note: d.approval_note || "", recipient_name: d.recipient_name || "", recipient_phone: d.recipient_phone || "", recipient_email: d.recipient_email || "" };
  saved.value = JSON.stringify(form.value);
};

const fail = (e) => {
  errors.value = e.response?.data?.errors || {};
  toast.add({ severity: "error", summary: t("error"), detail: Object.values(errors.value)[0]?.[0] || e.response?.data?.message || t("mission_error"), life: 4000 });
};

onMounted(async () => {
  try {
    take((await axios.get(`api/parent-contracts/${route.params.id}`)).data);
  } catch (e) {
    fail(e);
  } finally {
    loading.value = false;
  }
});

onBeforeRouteLeave(() => saving.value || !dirty.value || window.confirm(t("ct.leave_unsaved")));

// The preview follows the form (a moment after typing stops).
let timer = null;
watch(form, () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (form.value) previewHtml.value = contractPage({ ...contract.value, ...form.value }, t);
  }, 300);
}, { deep: true, immediate: true });

async function save() {
  saving.value = true;
  errors.value = {};
  try {
    const textChanged = TEXT_FIELDS.some((f) => form.value[f] !== (contract.value[f] || ""));
    const payload = { values: form.value.values, ...Object.fromEntries(RECIPIENT.map((f) => [f, form.value[f]])) };
    if (textChanged) TEXT_FIELDS.forEach((f) => (payload[f] = form.value[f]));
    take((await axios.put(`api/parent-contracts/${contract.value.id}`, payload)).data);
    toast.add({ severity: "success", summary: t("con.saved"), life: 2500 });
  } catch (e) {
    fail(e);
  } finally {
    saving.value = false;
  }
}

function resetText() {
  confirm.require({
    header: t("con.reset_text"),
    message: t("con.confirm_reset_text"),
    icon: "pi pi-refresh",
    accept: async () => {
      try {
        take((await axios.post(`api/parent-contracts/${contract.value.id}/reset-text`)).data);
        toast.add({ severity: "success", summary: t("con.text_reset"), life: 2500 });
      } catch (e) {
        fail(e);
      }
    },
  });
}

function cancelContract() {
  confirm.require({
    header: t("con.cancel"),
    message: t("con.confirm_cancel", { number: contract.value.number }),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        take((await axios.post(`api/parent-contracts/${contract.value.id}/cancel`)).data);
        toast.add({ severity: "success", summary: t("con.cancelled"), life: 2500 });
      } catch (e) {
        fail(e);
      }
    },
  });
}

const print = () => printHtml(contractPage({ ...contract.value, ...form.value }, t));

// Sign for the academy and send: the employee's own signature (saved, or drawn now), then the link's life.
const DAYS = [1, 2, 3, 5, 7, 14, 30];
const send = ref({ open: false, saved: null, useSaved: true, signature: null, keep: true, days: 3, busy: false, loading: false });
const link = ref({ open: false, url: "", expires: "" });
const extendDays = ref(7);

async function openSend() {
  if (dirty.value) await save();
  if (missing.value.length) {
    toast.add({ severity: "warn", summary: t("con.complete_first"), life: 3500 });
    return;
  }
  send.value = { open: true, saved: null, useSaved: true, signature: null, keep: true, days: 3, busy: false, loading: true };
  try {
    send.value.saved = (await axios.get("api/my-signature")).data.data.image;
  } finally {
    send.value.loading = false;
  }
}

const showLink = (payload) => {
  take(payload);
  link.value = { open: true, url: `${window.location.origin}/sign/${payload.token}`, expires: payload.data.link_expires_at };
};

async function submitSend() {
  send.value.busy = true;
  try {
    const drawn = !send.value.saved || !send.value.useSaved;
    const body = { days: send.value.days, ...(drawn ? { signature: send.value.signature, save_signature: send.value.keep } : {}) };
    showLink((await axios.post(`api/parent-contracts/${contract.value.id}/send`, body)).data);
    send.value.open = false;
  } catch (e) {
    fail(e);
  } finally {
    send.value.busy = false;
  }
}

async function renewLink() {
  try {
    showLink((await axios.post(`api/parent-contracts/${contract.value.id}/renew-link`, { days: extendDays.value })).data);
  } catch (e) {
    fail(e);
  }
}

async function extendLink() {
  try {
    take((await axios.post(`api/parent-contracts/${contract.value.id}/extend-link`, { days: extendDays.value })).data);
    toast.add({ severity: "success", summary: t("con.link_extended"), life: 2500 });
  } catch (e) {
    fail(e);
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(link.value.url);
    toast.add({ severity: "success", summary: t("con.link_copied"), life: 2000 });
  } catch {
    toast.add({ severity: "warn", summary: t("con.copy_manually"), life: 3000 });
  }
}

// WhatsApp wants the number with its country code (local Jordanian numbers start with 0).
const waPhone = (phone) => {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = "962" + d.slice(1);
  else if (d.length === 9) d = "962" + d;
  return d;
};
function whatsapp() {
  const text = t("con.wa_message", { name: contract.value.recipient_name || "", title: contract.value.template_name, number: contract.value.number, link: link.value.url, date: dateTime(link.value.expires) });
  window.open(`https://wa.me/${waPhone(contract.value.recipient_phone)}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

const dateTime = (iso) => (iso ? new Date(iso).toLocaleString(locale.value === "ar" ? "ar-JO" : "en-GB", { dateStyle: "medium", timeStyle: "short" }) : "");
const canSign = computed(() => can("parent contract signing edit"));
const daysLabel = (n) => (n === 1 ? t("con.days_1") : n === 2 ? t("con.days_2") : n <= 10 ? t("con.days_few", { n }) : t("con.days_many", { n }));
const inputType = (name) => (DATES.includes(name) ? "date" : "text");
</script>

<template>
  <div class="sawa-card p-3">
    <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <template v-else-if="contract">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-2">
          <Button icon="pi pi-arrow-right" text rounded :aria-label="t('con.back')" @click="router.push({ name: 'parent-contracts' })" />
          <div>
            <p class="text-xl text-bp-135c65 font-bold m-0 flex items-center gap-2 flex-wrap">
              {{ t("con.contract") }} <span dir="ltr">{{ contract.number }}</span>
              <Tag :severity="statusSeverity(contract.status)" :value="t('con.status_' + contract.status)" />
              <Tag v-if="contract.customized" severity="warn" :value="t('con.customized')" />
            </p>
            <p class="text-color-secondary text-sm m-0">{{ contract.child_name }} · {{ contract.template_name }} ({{ t("ct.version_n", { n: contract.template_version }) }})</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span v-if="dirty && editable" class="text-sm" style="color: #b45309">{{ t("ct.unsaved") }}</span>
          <Button icon="pi pi-print" :label="t('con.print')" severity="secondary" outlined @click="print" />
          <Button v-if="can('parent contracts edit') && ['draft', 'sent'].includes(contract.status)" icon="pi pi-ban" :label="t('con.cancel')" severity="warn" text @click="cancelContract" />
          <Button v-if="editable" icon="pi pi-save" :label="t('save')" :loading="saving" :disabled="!dirty" severity="secondary" @click="save" />
          <Button v-if="contract.status === 'draft' && canSign" icon="pi pi-send" :label="t('con.sign_send')" @click="openSend" />
        </div>
      </div>

      <Message v-if="contract.template_changed && editable" severity="info" class="mb-3">
        <div class="flex flex-wrap items-center justify-between gap-2 w-full">
          <span>{{ t("con.template_changed") }}</span>
          <Button size="small" :label="t('con.reset_text')" icon="pi pi-refresh" outlined @click="resetText" />
        </div>
      </Message>
      <Message v-if="!editable && contract.status === 'draft'" severity="secondary" class="mb-3">{{ t("con.read_only_perm") }}</Message>
      <Message v-else-if="!editable" severity="secondary" class="mb-3">{{ t("con.read_only") }}</Message>
      <Message v-if="missing.length" severity="warn" class="mb-3">{{ t("con.missing", { list: missing.map((n) => labelOf(variables.find((v) => v.name === n))).join("، ") }) }}</Message>

      <section v-if="contract.status !== 'draft'" class="cv-status" :class="contract.status">
        <div class="cv-status-grid">
          <div v-if="contract.signatures?.academy"><span>{{ t("con.academy_signed") }}</span><b>{{ contract.signatures.academy.name }}</b><small>{{ dateTime(contract.signatures.academy.at) }}</small></div>
          <div v-if="contract.sent_at"><span>{{ t("con.sent_at") }}</span><b>{{ dateTime(contract.sent_at) }}</b><small dir="ltr">{{ contract.recipient_phone }}</small></div>
          <div v-if="contract.status === 'sent'"><span>{{ t("con.link_expires") }}</span><b>{{ dateTime(contract.link_expires_at) }}</b><small>{{ contract.viewed_at ? t("con.viewed_at", { at: dateTime(contract.viewed_at) }) : t("con.not_viewed") }}</small></div>
          <div v-if="contract.decided_at"><span>{{ contract.status === "approved" ? t("con.approved_at") : t("con.rejected_at") }}</span><b>{{ dateTime(contract.decided_at) }}</b><small dir="ltr">{{ contract.signer_ip }}</small></div>
          <div v-if="contract.status === 'approved'"><span>{{ t("con.proof_code") }}</span><b dir="ltr">{{ contract.verify_code }}</b><small>{{ t("con.locked") }}</small></div>
        </div>
        <p v-if="contract.status === 'rejected'" class="cv-reason"><b>{{ t("con.reason") }}:</b> {{ contract.rejection_reason }}</p>
        <div v-if="canSign && ['sent', 'expired'].includes(contract.status)" class="cv-link-actions">
          <label for="cv-days">{{ t("con.days") }}</label>
          <Select input-id="cv-days" v-model="extendDays" :options="DAYS" class="w-28">
            <template #value="{ value }">{{ daysLabel(value) }}</template>
            <template #option="{ option }">{{ daysLabel(option) }}</template>
          </Select>
          <Button size="small" icon="pi pi-link" :label="t('con.new_link')" outlined @click="renewLink" />
          <Button v-if="contract.status === 'sent'" size="small" icon="pi pi-clock" :label="t('con.extend')" text @click="extendLink" />
          <small class="text-color-secondary">{{ t("con.link_once") }}</small>
        </div>
      </section>

      <Tabs v-model:value="tab">
        <TabList>
          <Tab value="values"><i class="pi pi-pencil me-2" aria-hidden="true" />{{ t("con.tab_values") }}</Tab>
          <Tab value="text"><i class="pi pi-file-edit me-2" aria-hidden="true" />{{ t("con.tab_text") }}</Tab>
          <Tab value="log"><i class="pi pi-history me-2" aria-hidden="true" />{{ t("con.tab_log") }}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="values">
            <div class="cv-main">
              <div class="cv-form">
                <section class="cv-card">
                  <p class="cv-title"><i class="pi pi-send" aria-hidden="true" /> {{ t("con.recipient_title") }}</p>
                  <p class="cv-hint">{{ t("con.recipient_hint") }}</p>
                  <div class="cv-grid">
                    <div class="cv-field">
                      <label for="rc-name">{{ t("con.recipient_name") }}</label>
                      <InputText id="rc-name" v-model="form.recipient_name" :disabled="!editable" />
                    </div>
                    <div class="cv-field">
                      <label for="rc-phone">{{ t("con.recipient_phone") }}</label>
                      <InputText id="rc-phone" v-model="form.recipient_phone" dir="ltr" inputmode="tel" :disabled="!editable" />
                    </div>
                    <div class="cv-field">
                      <label for="rc-email">{{ t("con.recipient_email") }}</label>
                      <InputText id="rc-email" v-model="form.recipient_email" dir="ltr" type="email" :disabled="!editable" :invalid="!!errors.recipient_email" />
                    </div>
                  </div>
                </section>

                <section v-for="g in sections" :key="g.key" class="cv-card">
                  <p class="cv-title">{{ g.label }}</p>
                  <div class="cv-grid">
                    <div v-for="v in g.items" :key="v.name" class="cv-field">
                      <label :for="'cv-' + v.name">{{ labelOf(v) }}</label>
                      <InputText v-if="computedNames.includes(v.name)" :id="'cv-' + v.name" :model-value="form.values[v.name] || t('con.on_save')" disabled />
                      <InputText v-else :id="'cv-' + v.name" v-model="form.values[v.name]" :type="inputType(v.name)" :inputmode="NUMBERS.includes(v.name) ? 'decimal' : undefined"
                        :disabled="!editable" :invalid="missing.includes(v.name)" />
                      <small v-if="computedNames.includes(v.name)" class="cv-hint">{{ t("ct.source_computed") }}</small>
                    </div>
                  </div>
                </section>
              </div>
              <div class="cv-preview">
                <p class="cv-title">{{ t("ct.preview") }}</p>
                <iframe :srcdoc="previewHtml" :title="t('ct.preview')" />
              </div>
            </div>
          </TabPanel>
          <TabPanel value="text">
            <p class="cv-hint mb-2">{{ editable ? t("con.text_hint") : t("con.read_only") }}</p>
            <div class="cv-fields">
              <div class="cv-field">
                <label for="cv-title">{{ t("ct.doc_title") }}</label>
                <InputText id="cv-title" v-model="form.title" :disabled="!editable" />
              </div>
              <div class="cv-field">
                <label for="cv-note">{{ t("ct.approval_note") }}</label>
                <InputText id="cv-note" v-model="form.approval_note" :disabled="!editable" />
              </div>
              <div class="cv-field cv-wide">
                <label for="cv-header">{{ t("ct.header") }}</label>
                <Textarea id="cv-header" v-model="form.header" rows="3" auto-resize :disabled="!editable" />
              </div>
            </div>
            <div v-if="editable" class="cv-text">
              <ContractEditor ref="editor" v-model="form.body" :known="known" />
              <VariablesPanel :variables="variables" :groups="groups" :used="used" @pick="(name) => editor?.insert(name)" />
            </div>
            <iframe v-else class="cv-readonly" :srcdoc="previewHtml" :title="t('ct.preview')" />
            <div v-if="editable && contract.customized" class="mt-2">
              <Button size="small" text icon="pi pi-refresh" :label="t('con.reset_text')" @click="resetText" />
            </div>
          </TabPanel>
          <TabPanel value="log">
            <ol class="cv-log">
              <li v-for="(e, i) in contract.events" :key="i">
                <b>{{ t("con.ev_" + e.event) }}</b>
                <span>{{ dateTime(e.at) }}</span>
                <span v-if="e.by">{{ e.by }}</span>
                <span v-if="e.meta?.reason">«{{ e.meta.reason }}»</span>
                <span v-if="e.meta?.days">{{ daysLabel(e.meta.days) }}</span>
                <span v-if="e.ip" dir="ltr" class="text-color-secondary">{{ e.ip }}</span>
              </li>
            </ol>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Dialog v-model:visible="send.open" modal :header="t('con.sign_send')" :style="{ width: '560px', maxWidth: '96vw' }">
        <div v-if="send.loading" class="flex justify-center p-4"><i class="pi pi-spin pi-spinner" /></div>
        <div v-else class="grid gap-3">
          <p class="m-0 text-color-secondary">{{ t("con.send_hint", { name: contract.recipient_name, phone: contract.recipient_phone }) }}</p>
          <div class="grid gap-2">
            <p class="font-bold m-0">{{ t("con.your_signature") }}</p>
            <template v-if="send.saved">
              <div class="flex items-center gap-3">
                <RadioButton v-model="send.useSaved" input-id="sig-saved" :value="true" />
                <label for="sig-saved" class="cv-saved"><img :src="send.saved" :alt="t('con.your_signature')" /></label>
              </div>
              <div class="flex items-center gap-3">
                <RadioButton v-model="send.useSaved" input-id="sig-new" :value="false" />
                <label for="sig-new">{{ t("con.new_signature") }}</label>
              </div>
            </template>
            <template v-if="!send.saved || !send.useSaved">
              <SignaturePad v-model="send.signature" />
              <div class="flex items-center gap-2">
                <Checkbox v-model="send.keep" input-id="sig-keep" binary />
                <label for="sig-keep">{{ t("con.keep_signature") }}</label>
              </div>
            </template>
          </div>
          <div class="grid gap-1">
            <label for="send-days" class="font-bold">{{ t("con.link_life") }}</label>
            <Select input-id="send-days" v-model="send.days" :options="DAYS" class="w-full">
              <template #value="{ value }">{{ daysLabel(value) }}</template>
              <template #option="{ option }">{{ daysLabel(option) }}</template>
            </Select>
          </div>
          <Message severity="info" class="m-0">{{ t("con.send_freezes") }}</Message>
        </div>
        <template #footer>
          <Button :label="t('cancel')" text severity="secondary" @click="send.open = false" />
          <Button icon="pi pi-send" :label="t('con.sign_send')" :loading="send.busy" :disabled="send.loading || ((!send.saved || !send.useSaved) && !send.signature)" @click="submitSend" />
        </template>
      </Dialog>

      <Dialog v-model:visible="link.open" modal :header="t('con.link_ready')" :style="{ width: '560px', maxWidth: '96vw' }">
        <div class="grid gap-3">
          <p class="m-0">{{ t("con.link_ready_hint", { date: dateTime(link.expires) }) }}</p>
          <InputText :model-value="link.url" readonly dir="ltr" class="w-full" :aria-label="t('con.link')" @focus="$event.target.select()" />
          <div class="flex flex-wrap gap-2">
            <Button icon="pi pi-copy" :label="t('con.copy_link')" @click="copyLink" />
            <Button icon="pi pi-whatsapp" :label="t('con.whatsapp')" severity="success" :disabled="!contract.recipient_phone" @click="whatsapp" />
          </div>
          <Message severity="warn" class="m-0">{{ t("con.link_once") }}</Message>
        </div>
      </Dialog>
    </template>
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<style scoped>
.cv-main { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 1rem; align-items: start; }
.cv-form { display: grid; gap: .9rem; }
.cv-card { border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; background: #fff; }
.cv-title { font-weight: 800; color: rgb(var(--bp-135c65)); margin: 0 0 .5rem; }
.cv-hint { color: #64748b; font-size: .8rem; margin: 0 0 .6rem; }
.cv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: .75rem; }
.cv-field { display: grid; gap: .3rem; align-content: start; }
.cv-field label { font-weight: 700; font-size: .85rem; }
.cv-field .cv-hint { margin: 0; }
.cv-preview { position: sticky; top: 80px; }
.cv-preview iframe, .cv-readonly { width: 100%; height: calc(100vh - 180px); min-height: 520px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f1f5f9; }
.cv-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: .8rem 1rem; margin-bottom: 1rem; }
.cv-wide { grid-column: 1 / -1; }
.cv-status { border: 1px solid #e2e8f0; border-radius: 14px; padding: .9rem 1rem; margin-bottom: 1rem; background: #f8fafc; }
.cv-status.approved { background: #f0fdf4; border-color: #bbf7d0; }
.cv-status.rejected { background: #fef2f2; border-color: #fecaca; }
.cv-status.expired, .cv-status.cancelled { background: #fffbeb; border-color: #fde68a; }
.cv-status-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: .75rem 1rem; }
.cv-status-grid div { display: grid; gap: .1rem; }
.cv-status-grid span { font-size: .78rem; color: #64748b; }
.cv-status-grid small { color: #64748b; }
.cv-reason { margin: .75rem 0 0; }
.cv-link-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; margin-top: .9rem; padding-top: .75rem; border-top: 1px solid #e2e8f0; }
.cv-log { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; }
.cv-log li { display: flex; flex-wrap: wrap; gap: .25rem 1rem; padding: .55rem .8rem; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; font-size: .88rem; }
.cv-saved img { max-height: 70px; max-width: 260px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; padding: 4px; }
.cv-text { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 1rem; align-items: start; }
@media (max-width: 1100px) { .cv-main, .cv-text { grid-template-columns: 1fr; } .cv-preview { position: static; } }
</style>
