<script setup>
// Step 2 of the careers application: the documents the candidate is asked for (by the labour system, and for
// non-citizens or specialists when they are one). Each card shows what was uploaded (images as a preview) and
// lets them upload, replace or remove it; «Send» checks everything and sends the application.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { careersApi, serverMessage } from "@/utils/careers";

const props = defineProps({ payload: { type: Object, required: true } });
const emit = defineEmits(["saved", "back", "sent"]);
const { t, te, locale } = useI18n();

const MAX = 5 * 1024 * 1024;
const ar = computed(() => locale.value === "ar");
const types = computed(() => props.payload.document_types);
const filesOf = (typeId) => props.payload.documents.filter((d) => d.lookup_id === typeId);
const flaggedDocs = computed(() => new Set(props.payload.return_note?.data?.documents ?? []));

const busy = ref({});
const errors = ref({});
const sending = ref(false);
const sendError = ref("");
const previews = ref({});

// Image previews come through the API with the candidate's token.
async function loadPreviews() {
  for (const doc of props.payload.documents) {
    if (previews.value[doc.id] || !doc.mime?.startsWith("image/")) continue;
    try {
      const { data } = await careersApi("get", `me/documents/${doc.id}`, undefined, { responseType: "blob" });
      previews.value[doc.id] = URL.createObjectURL(data);
    } catch {
      // the card shows the file name instead
    }
  }
}
onMounted(loadPreviews);
watch(() => props.payload.documents, loadPreviews);
onBeforeUnmount(() => Object.values(previews.value).forEach((url) => URL.revokeObjectURL(url)));

async function open(doc) {
  const { data } = await careersApi("get", `me/documents/${doc.id}`, undefined, { responseType: "blob" });
  window.open(URL.createObjectURL(data), "_blank", "noopener");
}

function accept(type) {
  return type.accept === "image" ? "image/png,image/jpeg,image/webp" : "image/png,image/jpeg,image/webp,application/pdf";
}

async function upload(type, event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  const okType = type.accept === "image" ? /^image\/(png|jpe?g|webp)$/.test(file.type) : /^(image\/(png|jpe?g|webp)|application\/pdf)$/.test(file.type);
  if (!okType) {
    errors.value[type.id] = t(type.accept === "image" ? "careers.err.file_image" : "careers.err.file_type");
    return;
  }
  if (file.size > MAX) {
    errors.value[type.id] = t("careers.err.file_size");
    return;
  }
  delete errors.value[type.id];
  busy.value[type.id] = true;
  const body = new FormData();
  body.append("lookup_id", type.id);
  body.append("file", file);
  try {
    const { data } = await careersApi("post", "me/documents", body);
    emit("saved", data.data);
  } catch (err) {
    const first = Object.values(err.response?.data?.errors ?? {})[0]?.[0];
    errors.value[type.id] = serverMessage(t, te, first ?? err.response?.data?.message);
  } finally {
    busy.value[type.id] = false;
  }
}

async function remove(type, doc) {
  busy.value[type.id] = true;
  try {
    const { data } = await careersApi("delete", `me/documents/${doc.id}`);
    emit("saved", data.data);
  } finally {
    busy.value[type.id] = false;
  }
}

const missing = computed(() => types.value.filter((type) => type.required && !filesOf(type.id).length));

async function send() {
  sendError.value = "";
  if (missing.value.length) {
    missing.value.forEach((type) => (errors.value[type.id] = t("careers.err.document_required")));
    sendError.value = t("careers.err.documents_missing");
    return;
  }
  sending.value = true;
  try {
    const { data } = await careersApi("post", "me/submit");
    emit("sent", data.data);
  } catch (err) {
    const fieldErrors = Object.keys(err.response?.data?.errors ?? {}).filter((k) => !k.startsWith("documents"));
    sendError.value = fieldErrors.length ? t("careers.err.step1_incomplete") : serverMessage(t, te, err.response?.data?.message ?? Object.values(err.response?.data?.errors ?? {})[0]?.[0]);
    Object.keys(err.response?.data?.errors ?? {}).filter((k) => /^documents\.\d+$/.test(k)).forEach((k) => (errors.value[Number(k.split(".")[1])] = t("careers.err.document_required")));
  } finally {
    sending.value = false;
  }
}

const size = (bytes) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
</script>

<template>
  <div class="cr-step pp-stack">
    <section class="pp-card pp-card--pad cr-section">
      <h2 class="pp-h3 cr-section__title"><i class="pi pi-folder-open" /> {{ $t("careers.documents") }}</h2>
      <p class="help m-0">{{ $t("careers.documents_hint") }}</p>
      <div class="cr-docs">
        <div v-for="type in types" :key="type.id" class="cr-doc" :class="{ 'cr-invalid': errors[type.id], 'cr-flag': flaggedDocs.has(type.id) }">
          <div class="cr-doc__head">
            <span class="cr-doc__name">{{ ar ? type.name_ar : type.name_en || type.name_ar }}</span>
            <span class="pp-tag" :class="type.required ? 'pp-tag--magenta' : 'pp-tag--info'">{{ type.required ? $t("careers.required") : $t("careers.optional") }}</span>
          </div>
          <div class="cr-doc__files">
            <div v-for="doc in filesOf(type.id)" :key="doc.id" class="cr-doc__file">
              <button type="button" class="cr-doc__thumb" :aria-label="$t('careers.open_file', { name: doc.original_name })" @click="open(doc)">
                <img v-if="previews[doc.id]" :src="previews[doc.id]" alt="" />
                <i v-else :class="doc.mime === 'application/pdf' ? 'pi pi-file-pdf' : 'pi pi-file'" />
              </button>
              <div class="cr-doc__meta">
                <span class="cr-doc__filename" :title="doc.original_name">{{ doc.original_name }}</span>
                <small class="help text-start" dir="ltr">{{ size(doc.size) }}</small>
              </div>
              <Button type="button" icon="pi pi-times" text rounded severity="danger" size="small" :aria-label="$t('careers.remove_file')" :disabled="busy[type.id]" @click="remove(type, doc)" />
            </div>
            <div v-if="!filesOf(type.id).length" class="cr-doc__empty"><i class="pi pi-cloud-upload" /> {{ $t("careers.no_file") }}</div>
          </div>
          <label class="cr-doc__upload p-button p-component" :class="{ 'p-disabled': busy[type.id] }">
            <i :class="busy[type.id] ? 'pi pi-spin pi-spinner' : 'pi pi-upload'" />
            <span>{{ filesOf(type.id).length && !type.multiple ? $t("careers.replace_file") : type.multiple && filesOf(type.id).length ? $t("careers.add_file") : $t("careers.upload_file") }}</span>
            <input type="file" class="sr-only" :accept="accept(type)" :disabled="busy[type.id]" @change="upload(type, $event)" />
          </label>
          <small class="help">{{ type.accept === "image" ? $t("careers.accept_image") : $t("careers.accept_any") }}</small>
          <small v-if="errors[type.id]" class="error">{{ errors[type.id] }}</small>
        </div>
      </div>
    </section>

    <Message v-if="sendError" severity="error" :closable="false">{{ sendError }}</Message>
    <div class="cr-actions cr-actions--split">
      <Button type="button" :label="$t('careers.previous')" icon="pi pi-arrow-right" severity="secondary" outlined @click="emit('back')" />
      <Button type="button" :label="$t('careers.send')" icon="pi pi-send" size="large" :loading="sending" @click="send" />
    </div>
  </div>
</template>
