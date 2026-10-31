<script setup>
// «ملاحظاتي»: the parent writes a note, complaint, suggestion or question to the management (about one of their
// children or in general, with one file), and reads the management's answer here.
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import { fmtDateTime, fmtRelative } from "@/utils/parentPortal";
import { ATTACHMENT_ACCEPT, ATTACHMENT_MAX_MB, FEEDBACK_ICONS, FEEDBACK_TYPES, STATUS_SEVERITY, openAttachment } from "@/utils/parentFeedback";

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const rows = ref([]);
const children = ref([]);
const loading = ref(true);
const sending = ref(false);
const errors = ref({});
const fileInput = ref(null);
const highlight = ref(Number(route.query.id) || null);
const blank = () => ({ type: "note", child_id: 0, subject: "", message: "", attachment: null });
const form = ref(blank());

const childOptions = computed(() => [{ id: 0, name: t("pfb.general") }, ...children.value]);
const typeOptions = computed(() => FEEDBACK_TYPES.map((value) => ({ value, label: t(`pfb.type_${value}`), icon: FEEDBACK_ICONS[value] })));

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("/api/parent/feedback");
    rows.value = data.data?.items ?? [];
    children.value = data.data?.children ?? [];
  } catch {
    rows.value = [];
  } finally {
    loading.value = false;
  }
}
onMounted(load);

function pickFile(event) {
  const file = event.target.files?.[0] ?? null;
  if (file && file.size > ATTACHMENT_MAX_MB * 1024 * 1024) {
    errors.value = { ...errors.value, attachment: [t("pfb.file_too_big", { mb: ATTACHMENT_MAX_MB })] };
    event.target.value = "";
    return;
  }
  errors.value = { ...errors.value, attachment: null };
  form.value.attachment = file;
}
function clearFile() {
  form.value.attachment = null;
  if (fileInput.value) fileInput.value.value = "";
}

async function submit() {
  if (sending.value) return;
  errors.value = {};
  if (!form.value.subject.trim()) errors.value.subject = [t("pfb.subject_required")];
  if (!form.value.message.trim()) errors.value.message = [t("pfb.message_required")];
  if (Object.keys(errors.value).length) return;

  const body = new FormData();
  body.append("type", form.value.type);
  if (form.value.child_id) body.append("child_id", form.value.child_id);
  body.append("subject", form.value.subject.trim());
  body.append("message", form.value.message.trim());
  if (form.value.attachment) body.append("attachment", form.value.attachment);

  sending.value = true;
  try {
    const { data } = await axios.post("/api/parent/feedback", body);
    rows.value = [data.data, ...rows.value];
    highlight.value = data.data.id;
    form.value = blank();
    clearFile();
    toast.add({ severity: "success", summary: t("success_message"), detail: t("pfb.sent"), life: 3000 });
  } catch (error) {
    errors.value = error.response?.data?.errors ?? {};
    if (!Object.keys(errors.value).length) {
      toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message ?? t("request_failed_retry"), life: 3500 });
    }
  } finally {
    sending.value = false;
  }
}

async function open(row) {
  try {
    await openAttachment(`/api/parent/feedback/${row.id}/attachment`);
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("request_failed_retry"), life: 3000 });
  }
}
</script>

<template>
  <div class="pp-page">
    <Toast />
    <PageHead :title="$t('pfb.my_title')" :lead="$t('pfb.my_lead')" :kicker="$t('pp.brand')" icon="pi pi-comment" />

    <div class="pp-grid pfb-grid">
      <form class="pp-card pp-card--pad pp-stack pp-in" novalidate data-no-request-spinner @submit.prevent="submit">
        <h2 class="pp-h2">{{ $t("pfb.new_title") }}</h2>

        <div class="pp-field is-required">
          <label id="pfb-type-label">{{ $t("pfb.type") }}</label>
          <SelectButton v-model="form.type" :options="typeOptions" optionLabel="label" optionValue="value" :allowEmpty="false" aria-labelledby="pfb-type-label" class="pfb-types">
            <template #option="{ option }"><i :class="option.icon" aria-hidden="true" /> <span>{{ option.label }}</span></template>
          </SelectButton>
        </div>

        <div class="pp-field">
          <label for="pfb-child">{{ $t("pfb.about") }}</label>
          <Select inputId="pfb-child" v-model="form.child_id" :options="childOptions" optionLabel="name" optionValue="id" fluid />
          <small v-if="errors.child_id" class="pfb-error">{{ errors.child_id[0] }}</small>
        </div>

        <div class="pp-field is-required">
          <label for="pfb-subject">{{ $t("pfb.subject") }}</label>
          <InputText id="pfb-subject" v-model="form.subject" maxlength="150" :invalid="!!errors.subject" fluid />
          <small v-if="errors.subject" class="pfb-error">{{ errors.subject[0] }}</small>
        </div>

        <div class="pp-field is-required">
          <label for="pfb-message">{{ $t("pfb.message") }}</label>
          <Textarea id="pfb-message" v-model="form.message" rows="5" maxlength="5000" autoResize :invalid="!!errors.message" fluid />
          <small v-if="errors.message" class="pfb-error">{{ errors.message[0] }}</small>
        </div>

        <div class="pp-field">
          <span class="pfb-label">{{ $t("pfb.attachment") }}</span>
          <div class="pp-row">
            <input id="pfb-file" ref="fileInput" type="file" :accept="ATTACHMENT_ACCEPT" class="sr-only" @change="pickFile" />
            <label for="pfb-file" class="pp-btn pp-btn--soft pp-btn--sm pfb-pick"><i class="pi pi-paperclip" /> {{ form.attachment ? form.attachment.name : $t("pfb.choose_file") }}</label>
            <button v-if="form.attachment" type="button" class="pp-btn pp-btn--ghost pp-btn--sm" @click="clearFile"><i class="pi pi-times" /> {{ $t("pfb.remove_file") }}</button>
          </div>
          <small class="pp-muted">{{ $t("pfb.attachment_hint", { mb: ATTACHMENT_MAX_MB }) }}</small>
          <small v-if="errors.attachment" class="pfb-error">{{ errors.attachment[0] }}</small>
        </div>

        <Button type="submit" :label="$t('pfb.send')" icon="pi pi-send" :loading="sending" size="large" />
      </form>

      <section class="pp-stack" :aria-label="$t('pfb.sent_list')">
        <h2 class="pp-h2">{{ $t("pfb.sent_list") }}</h2>
        <div v-if="loading" class="pp-stack"><div v-for="i in 3" :key="i" class="pp-skeleton" style="height: 120px" /></div>
        <EmptyState v-else-if="!rows.length" icon="pi pi-comment" :text="$t('pfb.empty')" />
        <article v-for="(row, i) in rows" v-else :key="row.id" class="pp-card pp-card--pad pp-stack pp-in" :class="{ 'pfb-highlight': row.id === highlight }" :style="{ '--i': Math.min(i, 8) + 1 }">
          <div class="pp-row pp-between">
            <span class="pp-tag pp-tag--magenta"><i :class="FEEDBACK_ICONS[row.type]" aria-hidden="true" /> {{ $t(`pfb.type_${row.type}`) }}</span>
            <span class="pp-tag" :class="`pp-tag--${STATUS_SEVERITY[row.status]}`">{{ $t(`pfb.status_${row.status}`) }}</span>
          </div>
          <p class="m-0 text-lg font-semibold">{{ row.subject }}</p>
          <p class="pp-item__meta m-0">
            {{ row.child || $t("pfb.general") }} · <span :title="fmtDateTime(row.created_at)">{{ fmtRelative(row.created_at) }}</span>
          </p>
          <p class="m-0 leading-7 whitespace-pre-line">{{ row.message }}</p>
          <button v-if="row.has_attachment" type="button" class="pp-link pfb-attach" @click="open(row)"><i class="pi pi-paperclip" /> {{ row.attachment_name || $t("pfb.attachment") }}</button>
          <div v-if="row.reply" class="pfb-reply">
            <p class="m-0 font-semibold"><i class="pi pi-reply" aria-hidden="true" /> {{ $t("pfb.reply_from_management") }}</p>
            <p class="m-0 leading-7 whitespace-pre-line">{{ row.reply }}</p>
            <small class="pp-muted">{{ fmtDateTime(row.replied_at) }}</small>
          </div>
          <small v-else class="pp-muted">{{ $t("pfb.no_reply_yet") }}</small>
        </article>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pfb-grid {
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}
@media (min-width: 960px) {
  .pfb-grid {
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  }
}
.pfb-types {
  flex-wrap: wrap;
}
.pfb-error {
  color: var(--pp-danger);
}
.pfb-label {
  font-weight: 800;
  font-size: 0.9rem;
  color: var(--pp-ink);
}
.pfb-pick {
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#pfb-file:focus-visible + .pfb-pick {
  outline: 2px solid rgb(var(--bp-135c65));
  outline-offset: 2px;
}
.pfb-attach {
  align-self: flex-start;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.pfb-reply {
  display: grid;
  gap: 0.35rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: rgb(var(--bp-135c65) / 0.07);
  border-inline-start: 4px solid rgb(var(--bp-135c65));
}
.pfb-highlight {
  border-color: rgb(var(--bs-b21553) / 0.45);
}
</style>
