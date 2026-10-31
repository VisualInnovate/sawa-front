<script setup>
// A candidate's file as HR and the department head read it: the data they filled in, their experience and their
// documents (images previewed, a click opens the file). `base` is the API path the documents are read from.
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  detail: { type: Object, required: true },
  base: { type: String, required: true },
});

const { t, locale } = useI18n();
const ar = computed(() => locale.value === "ar");
const c = computed(() => props.detail.candidate);
const previews = ref({});

watch(
  () => c.value?.id,
  () => {
    for (const doc of c.value?.documents ?? []) {
      if (!doc.mime?.startsWith("image/") || previews.value[doc.id]) continue;
      axios.get(`${props.base}/documents/${doc.id}`, { responseType: "blob" }).then(({ data }) => (previews.value[doc.id] = URL.createObjectURL(data))).catch(() => {});
    }
  },
  { immediate: true },
);

async function openDoc(doc) {
  const { data } = await axios.get(`${props.base}/documents/${doc.id}`, { responseType: "blob" });
  window.open(URL.createObjectURL(data), "_blank", "noopener");
}

const vacancyTitle = (v) => (v ? (ar.value ? v.title_ar : v.title_en || v.title_ar) : t("cand.no_vacancy"));
const facts = computed(() => {
  const yes = (v) => (v === null || v === undefined ? "—" : v ? t("careers.yes") : t("careers.no"));
  const look = (row) => (row ? (ar.value ? row.name_ar : row.name_en || row.name_ar) : "—");
  const p = props.detail.profile;
  return [
    ["vacancy_id", t("careers.vacancy"), vacancyTitle(c.value.vacancy)],
    ["name_ar", t("careers.name_ar"), c.value.name_ar],
    ["citizen", t("careers.citizenship"), c.value.citizen === null ? "—" : c.value.citizen ? (ar.value ? p.citizen_ar : p.citizen_en) : `${t("careers.resident")}${c.value.nationality ? ` (${c.value.nationality})` : ""}`],
    ["national_id", t("cand.national_id"), c.value.national_id, true],
    ["birth_date", t("careers.birth_date"), c.value.birth_date, true],
    ["gender", t("careers.gender"), c.value.gender ? t(`careers.${c.value.gender}`) : "—"],
    ["marital_status", t("careers.marital_status"), c.value.marital_status ? t(`careers.${c.value.marital_status}`) : "—"],
    ["has_disability", t("careers.has_disability"), `${yes(c.value.has_disability)}${c.value.disability_details ? ` — ${c.value.disability_details}` : ""}`],
    ["email", t("careers.email"), c.value.email, true],
    ["phone", t("careers.phone"), c.value.phone, true],
    ...(c.value.country === "SA" ? [["national_address", t("careers.national_address"), c.value.national_address, true]] : []),
    ["address", t("careers.address"), c.value.address],
    ["bank_id", t("careers.bank_name"), look(c.value.bank)],
    ["iban", t("careers.iban"), c.value.iban, true],
    ["qualification_id", t("careers.qualification"), look(c.value.qualification)],
    ["specialty_id", t("careers.specialty"), look(c.value.specialty)],
    ["has_experience", t("careers.has_experience"), yes(c.value.has_experience)],
  ];
});
const docsOf = (typeId) => c.value.documents.filter((d) => d.lookup_id === typeId);
const typeName = (type) => (ar.value ? type.name_ar : type.name_en || type.name_ar);
</script>

<template>
  <div class="flex flex-column gap-4">
    <section>
      <h3 class="cf-h">{{ $t("cand.file") }}</h3>
      <dl class="cf-facts">
        <template v-for="[key, label, value, ltr] in facts" :key="key">
          <dt>{{ label }}</dt>
          <dd><bdi :dir="ltr ? 'ltr' : undefined">{{ value || "—" }}</bdi></dd>
        </template>
      </dl>
      <div v-if="c.has_experience && c.experience?.length" class="flex flex-column gap-2 mt-2">
        <div v-for="(job, i) in c.experience" :key="i" class="cf-job">
          <strong>{{ job.title }}</strong> — {{ job.employer }}
          <small dir="ltr" class="block text-start">{{ job.from }} → {{ job.current ? $t("careers.current_job") : job.to || "—" }}</small>
        </div>
      </div>
    </section>

    <section>
      <h3 class="cf-h">{{ $t("careers.documents") }}</h3>
      <div class="flex flex-column gap-2">
        <div v-for="type in detail.document_types" :key="type.id" class="cf-doc" :class="{ 'is-missing': detail.missing_documents.includes(type.id) }">
          <div class="flex items-center justify-between gap-2">
            <strong class="text-sm">{{ typeName(type) }}</strong>
            <Tag v-if="detail.missing_documents.includes(type.id)" severity="danger" :value="$t('cand.missing')" />
            <Tag v-else-if="!type.required" severity="secondary" :value="$t('careers.optional')" />
          </div>
          <div class="flex flex-wrap gap-2 mt-1">
            <button v-for="doc in docsOf(type.id)" :key="doc.id" type="button" class="cf-file" :title="doc.original_name" @click="openDoc(doc)">
              <img v-if="previews[doc.id]" :src="previews[doc.id]" alt="" />
              <i v-else :class="doc.mime === 'application/pdf' ? 'pi pi-file-pdf' : 'pi pi-file'" />
              <span>{{ doc.original_name }}</span>
            </button>
            <small v-if="!docsOf(type.id).length" class="text-color-secondary">{{ $t("careers.no_file") }}</small>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cf-h { font-size: 1rem; font-weight: 800; margin: 0 0 0.5rem; }
.cf-facts { display: grid; grid-template-columns: minmax(110px, 40%) 1fr; gap: 0.35rem 0.75rem; margin: 0; font-size: 0.9rem; }
.cf-facts dt { color: var(--p-text-muted-color); }
.cf-facts dd { margin: 0; font-weight: 600; word-break: break-word; }
.cf-job { background: var(--p-surface-100, #f1f5f9); border-radius: 10px; padding: 0.5rem 0.75rem; font-size: 0.9rem; }
.cf-doc { border: 1px solid var(--p-content-border-color); border-radius: 12px; padding: 0.6rem; }
.cf-doc.is-missing { border-color: #fca5a5; background: #fef2f2; }
.cf-file { display: inline-flex; align-items: center; gap: 0.4rem; max-width: 100%; border: 1px solid var(--p-content-border-color); border-radius: 10px; padding: 0.25rem 0.5rem 0.25rem 0.25rem; background: var(--p-content-background, #fff); cursor: pointer; }
.cf-file img { width: 40px; height: 40px; object-fit: cover; border-radius: 8px; }
.cf-file i { font-size: 1.3rem; color: var(--p-primary-color); padding: 0.4rem; }
.cf-file span { font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 160px; }
</style>
