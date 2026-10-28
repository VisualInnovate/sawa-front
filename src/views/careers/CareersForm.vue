<script setup>
// Step 1 of the careers application: the candidate's data. Every field is checked as it is left (and all of them
// on «Next»), with the message under it; valid answers are saved a moment after typing, so leaving midway loses
// nothing. Saudi system: national address; IBAN, phone code and banks follow the labour system.
import moment from "moment";
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { careersApi, ibanValid, serverMessage } from "@/utils/careers";

const props = defineProps({
  payload: { type: Object, required: true },
  info: { type: Object, required: true },
});
const emit = defineEmits(["saved", "next"]);
const { t, te, locale } = useI18n();

const profile = computed(() => props.payload.profile);
const sa = computed(() => profile.value.code === "SA");
const ar = computed(() => locale.value === "ar");
const name = (row) => (ar.value ? row.name_ar : row.name_en || row.name_ar);

// The form, from what was saved; dates as Date objects for the pickers.
const c = props.payload.candidate;
const form = reactive({
  vacancy_id: c.vacancy_id, name_ar: c.name_ar ?? "", national_id: c.national_id ?? "", citizen: c.citizen, nationality: c.nationality ?? "",
  birth_date: c.birth_date ? new Date(c.birth_date) : null, gender: c.gender, marital_status: c.marital_status,
  has_disability: c.has_disability, disability_details: c.disability_details ?? "", email: c.email ?? "",
  national_address: c.national_address ?? "", address: c.address ?? "", lat: c.lat, long: c.long,
  has_experience: c.has_experience,
  experience: (c.experience ?? []).map((job) => ({ ...job, from: job.from ? moment(job.from, "YYYY-MM").toDate() : null, to: job.to ? moment(job.to, "YYYY-MM").toDate() : null })),
  bank_id: c.bank_id, iban_rest: (c.iban ?? "").replace(/^[A-Z]{2}/, ""), qualification_id: c.qualification_id, specialty_id: c.specialty_id,
});

// The fields HR asked to fix (returned file).
const flagged = computed(() => new Set(props.payload.return_note?.data?.fields ?? []));

// What goes to the server, in its shape.
function serialize() {
  return {
    vacancy_id: form.vacancy_id, name_ar: form.name_ar.trim(), national_id: form.national_id.trim(), citizen: form.citizen,
    nationality: form.citizen === false ? form.nationality.trim() : null,
    birth_date: form.birth_date ? moment(form.birth_date).format("YYYY-MM-DD") : null, gender: form.gender, marital_status: form.marital_status,
    has_disability: form.has_disability, disability_details: form.has_disability ? form.disability_details.trim() : null,
    email: form.email.trim(), ...(sa.value ? { national_address: form.national_address.toUpperCase() } : {}),
    address: form.address.trim(), lat: form.lat, long: form.long, has_experience: form.has_experience,
    experience: form.has_experience
      ? form.experience.map((job) => ({ employer: job.employer?.trim() ?? "", title: job.title?.trim() ?? "", from: job.from ? moment(job.from).format("YYYY-MM") : null,
        to: job.current || !job.to ? null : moment(job.to).format("YYYY-MM"), current: !!job.current }))
      : null,
    bank_id: form.bank_id, iban: form.iban_rest ? profile.value.iban_prefix + form.iban_rest.replace(/\s+/g, "").toUpperCase() : null,
    qualification_id: form.qualification_id, specialty_id: form.specialty_id,
  };
}

// ---- Checks (the same as the server's) ----
const touched = reactive({});
const showAll = ref(false);
const serverErrors = ref({});
const empty = (v) => v === null || v === undefined || v === "";

const clientErrors = computed(() => {
  const d = serialize();
  const e = {};
  const need = (key, msg = t("careers.err.required")) => empty(d[key]) && (e[key] = msg);
  need("vacancy_id", t("careers.err.pick_vacancy"));
  if (empty(d.name_ar)) e.name_ar = t("careers.err.required");
  else if (!/^[؀-ۿ\s]+$/.test(d.name_ar)) e.name_ar = t("careers.err.name_arabic");
  else if (!/\S+\s+\S+/.test(d.name_ar) || d.name_ar.length < 5) e.name_ar = t("careers.err.name_full");
  if (d.citizen === null || d.citizen === undefined) e.citizen = t("careers.err.required");
  if (d.citizen === false && empty(d.nationality)) e.nationality = t("careers.err.required");
  if (empty(d.national_id)) e.national_id = t("careers.err.required");
  else if (sa.value) {
    if (!/^[12]\d{9}$/.test(d.national_id)) e.national_id = t("careers.err.national_id_sa");
    else if (d.citizen === true && d.national_id[0] !== "1") e.national_id = t("careers.err.national_id_sa_citizen");
    else if (d.citizen === false && d.national_id[0] !== "2") e.national_id = t("careers.err.national_id_sa_resident");
  } else if (d.citizen !== false && !/^\d{10}$/.test(d.national_id)) e.national_id = t("careers.err.national_id_jo");
  else if (d.citizen === false && !/^[A-Za-z0-9]{6,20}$/.test(d.national_id)) e.national_id = t("careers.err.national_id_other");
  if (empty(d.birth_date)) e.birth_date = t("careers.err.required");
  else {
    const age = moment().diff(moment(d.birth_date), "years");
    if (age < 18) e.birth_date = t("careers.err.too_young");
    else if (age > 70) e.birth_date = t("careers.err.too_old");
  }
  need("gender");
  need("marital_status");
  if (d.has_disability === null || d.has_disability === undefined) e.has_disability = t("careers.err.required");
  if (empty(d.email)) e.email = t("careers.err.required");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) e.email = t("careers.err.email");
  if (sa.value) {
    if (empty(d.national_address)) e.national_address = t("careers.err.required");
    else if (!/^[A-Z]{4}\d{4}$/.test(d.national_address)) e.national_address = t("careers.err.national_address");
  }
  if (d.has_experience === null || d.has_experience === undefined) e.has_experience = t("careers.err.required");
  if (d.has_experience) {
    if (!d.experience?.length) e.experience = t("careers.err.add_experience");
    d.experience?.forEach((job, i) => {
      if (empty(job.employer)) e[`experience.${i}.employer`] = t("careers.err.required");
      if (empty(job.title)) e[`experience.${i}.title`] = t("careers.err.required");
      if (empty(job.from)) e[`experience.${i}.from`] = t("careers.err.required");
      else if (job.from > moment().format("YYYY-MM")) e[`experience.${i}.from`] = t("careers.err.future");
      if (!job.current && job.to && job.from && job.to < job.from) e[`experience.${i}.to`] = t("careers.err.experience_to");
    });
  }
  need("bank_id", t("careers.err.pick_bank"));
  if (empty(form.iban_rest)) e.iban = t("careers.err.required");
  else if (!ibanValid(d.iban, profile.value.iban_prefix, profile.value.iban_length))
    e.iban = t("careers.err.iban_detail", { prefix: profile.value.iban_prefix, n: profile.value.iban_length });
  need("qualification_id");
  need("specialty_id");
  return e;
});

// Shown: the field was left (or «Next» was pressed) and has a problem, or the server refused it.
const error = (key) => ((showAll.value || touched[key.split(".")[0]] || touched[key]) && clientErrors.value[key]) || serverErrors.value[key] || "";
const touch = (key) => (touched[key] = true);

// ---- Autosave: the valid answers that changed, a moment after typing ----
const status = ref("saved");
let lastSaved = JSON.stringify(serialize());
let timer = null;

async function save() {
  const data = serialize();
  const changed = {};
  const before = JSON.parse(lastSaved);
  for (const [key, value] of Object.entries(data)) {
    const valid = !Object.keys(clientErrors.value).some((k) => k === key || k.startsWith(`${key}.`)) || empty(value);
    if (JSON.stringify(value) !== JSON.stringify(before[key]) && valid) changed[key] = value;
  }
  if (!Object.keys(changed).length) {
    status.value = "saved";
    return;
  }
  status.value = "saving";
  try {
    const { data: res } = await careersApi("put", "me", changed);
    lastSaved = JSON.stringify({ ...before, ...changed });
    for (const key of Object.keys(changed)) delete serverErrors.value[key];
    status.value = "saved";
    emit("saved", res.data);
  } catch (err) {
    status.value = "error";
    const errors = err.response?.data?.errors ?? {};
    serverErrors.value = { ...serverErrors.value, ...Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, serverMessage(t, te, v[0])])) };
  }
}

watch(form, () => {
  status.value = "pending";
  clearTimeout(timer);
  timer = setTimeout(save, 1200);
}, { deep: true });

onBeforeUnmount(() => {
  clearTimeout(timer);
  save();
});

// ---- Helpers for the parts of the form ----
function addJob() {
  form.experience.push({ employer: "", title: "", from: null, to: null, current: false });
}
watch(() => form.has_experience, (v) => {
  if (v && !form.experience.length) addJob();
});

const locating = ref(false);
const locationError = ref("");
function useLocation() {
  locationError.value = "";
  if (!navigator.geolocation) {
    locationError.value = t("careers.location_unsupported");
    return;
  }
  locating.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      form.lat = Number(pos.coords.latitude.toFixed(7));
      form.long = Number(pos.coords.longitude.toFixed(7));
      locating.value = false;
    },
    () => {
      locationError.value = t("careers.location_denied");
      locating.value = false;
    },
    { enableHighAccuracy: true, timeout: 15000 },
  );
}

const yesNo = computed(() => [{ value: true, label: t("careers.yes") }, { value: false, label: t("careers.no") }]);
const genders = computed(() => [{ value: "male", label: t("careers.male") }, { value: "female", label: t("careers.female") }]);
const maritals = computed(() => [{ value: "single", label: t("careers.single") }, { value: "married", label: t("careers.married") }]);
const citizens = computed(() => [
  { value: true, label: ar.value ? profile.value.citizen_ar : profile.value.citizen_en },
  { value: false, label: t("careers.resident") },
]);
const maxBirth = moment().subtract(18, "years").toDate();
const minBirth = moment().subtract(70, "years").toDate();

/** On «Next»: all messages shown; true when step 1 is complete. */
async function next() {
  showAll.value = true;
  clearTimeout(timer);
  await save();
  if (Object.keys(clientErrors.value).length || Object.keys(serverErrors.value).length) {
    document.querySelector(".cr-invalid")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  emit("next");
}

defineExpose({ save });
</script>

<template>
  <div class="cr-step pp-stack">
    <div class="cr-autosave" :class="`is-${status}`" role="status" aria-live="polite">
      <i :class="status === 'saving' || status === 'pending' ? 'pi pi-spin pi-spinner' : status === 'error' ? 'pi pi-exclamation-circle' : 'pi pi-check-circle'" />
      {{ $t(`careers.autosave_${status}`) }}
    </div>

    <!-- The job -->
    <section class="pp-card pp-card--pad cr-section">
      <h2 class="pp-h3 cr-section__title"><i class="pi pi-briefcase" /> {{ $t("careers.job") }}</h2>
      <div class="pp-field is-required" :class="{ 'cr-invalid': error('vacancy_id'), 'cr-flag': flagged.has('vacancy_id') }">
        <label for="cr-vacancy">{{ $t("careers.vacancy") }}</label>
        <Select inputId="cr-vacancy" v-model="form.vacancy_id" :options="info.vacancies" optionValue="id" :optionLabel="(v) => (ar ? v.title_ar : v.title_en || v.title_ar)"
          :placeholder="$t('careers.pick')" filter fluid :invalid="!!error('vacancy_id')" @hide="touch('vacancy_id')" />
        <small v-if="error('vacancy_id')" class="error">{{ error("vacancy_id") }}</small>
      </div>
    </section>

    <!-- Personal data -->
    <section class="pp-card pp-card--pad cr-section">
      <h2 class="pp-h3 cr-section__title"><i class="pi pi-user" /> {{ $t("careers.personal") }}</h2>
      <div class="cr-grid">
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('name_ar'), 'cr-flag': flagged.has('name_ar') }">
          <label for="cr-name">{{ $t("careers.name_ar") }}</label>
          <InputText id="cr-name" v-model="form.name_ar" maxlength="100" autocomplete="name" fluid :invalid="!!error('name_ar')" @blur="touch('name_ar')" />
          <small v-if="error('name_ar')" class="error">{{ error("name_ar") }}</small>
          <small v-else class="help">{{ $t("careers.name_hint") }}</small>
        </div>
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('citizen'), 'cr-flag': flagged.has('citizen') }">
          <label id="cr-citizen-label">{{ $t("careers.citizenship") }}</label>
          <SelectButton v-model="form.citizen" :options="citizens" optionLabel="label" optionValue="value" aria-labelledby="cr-citizen-label" @change="touch('citizen')" />
          <small v-if="error('citizen')" class="error">{{ error("citizen") }}</small>
        </div>
        <div v-if="form.citizen === false" class="pp-field is-required" :class="{ 'cr-invalid': error('nationality'), 'cr-flag': flagged.has('nationality') }">
          <label for="cr-nationality">{{ $t("careers.nationality") }}</label>
          <InputText id="cr-nationality" v-model="form.nationality" maxlength="60" fluid :invalid="!!error('nationality')" @blur="touch('nationality')" />
          <small v-if="error('nationality')" class="error">{{ error("nationality") }}</small>
        </div>
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('national_id'), 'cr-flag': flagged.has('national_id') }">
          <label for="cr-nid">{{ form.citizen === false ? $t(sa ? "careers.iqama" : "careers.residence_or_passport") : $t(sa ? "careers.national_id_sa" : "careers.national_id_jo") }}</label>
          <InputText id="cr-nid" v-model="form.national_id" dir="ltr" maxlength="20" :inputmode="form.citizen === false && !sa ? 'text' : 'numeric'" fluid
            :invalid="!!error('national_id')" @blur="touch('national_id')" />
          <small v-if="error('national_id')" class="error">{{ error("national_id") }}</small>
        </div>
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('birth_date'), 'cr-flag': flagged.has('birth_date') }">
          <label for="cr-birth">{{ $t("careers.birth_date") }}</label>
          <DatePicker inputId="cr-birth" v-model="form.birth_date" dateFormat="yy-mm-dd" :maxDate="maxBirth" :minDate="minBirth" showIcon fluid
            :defaultDate="maxBirth" :invalid="!!error('birth_date')" @hide="touch('birth_date')" />
          <small v-if="error('birth_date')" class="error">{{ error("birth_date") }}</small>
        </div>
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('gender'), 'cr-flag': flagged.has('gender') }">
          <label id="cr-gender-label">{{ $t("careers.gender") }}</label>
          <SelectButton v-model="form.gender" :options="genders" optionLabel="label" optionValue="value" aria-labelledby="cr-gender-label" @change="touch('gender')" />
          <small v-if="error('gender')" class="error">{{ error("gender") }}</small>
        </div>
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('marital_status'), 'cr-flag': flagged.has('marital_status') }">
          <label id="cr-marital-label">{{ $t("careers.marital_status") }}</label>
          <SelectButton v-model="form.marital_status" :options="maritals" optionLabel="label" optionValue="value" aria-labelledby="cr-marital-label" @change="touch('marital_status')" />
          <small v-if="error('marital_status')" class="error">{{ error("marital_status") }}</small>
        </div>
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('has_disability'), 'cr-flag': flagged.has('has_disability') }">
          <label id="cr-disability-label">{{ $t("careers.has_disability") }}</label>
          <SelectButton v-model="form.has_disability" :options="yesNo" optionLabel="label" optionValue="value" aria-labelledby="cr-disability-label" @change="touch('has_disability')" />
          <small v-if="error('has_disability')" class="error">{{ error("has_disability") }}</small>
        </div>
        <div v-if="form.has_disability" class="pp-field">
          <label for="cr-disability">{{ $t("careers.disability_details") }}</label>
          <InputText id="cr-disability" v-model="form.disability_details" maxlength="255" fluid />
          <small class="help">{{ $t("careers.disability_hint") }}</small>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="pp-card pp-card--pad cr-section">
      <h2 class="pp-h3 cr-section__title"><i class="pi pi-id-card" /> {{ $t("careers.contact") }}</h2>
      <div class="cr-grid">
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('email'), 'cr-flag': flagged.has('email') }">
          <label for="cr-email">{{ $t("careers.email") }}</label>
          <InputText id="cr-email" v-model="form.email" type="email" dir="ltr" autocomplete="email" maxlength="150" fluid :invalid="!!error('email')" @blur="touch('email')" />
          <small v-if="error('email')" class="error">{{ error("email") }}</small>
        </div>
        <div class="pp-field">
          <label for="cr-phone">{{ $t("careers.phone") }}</label>
          <InputText id="cr-phone" :modelValue="payload.candidate.phone" dir="ltr" readonly fluid />
          <small class="help">{{ $t("careers.phone_hint") }}</small>
        </div>
      </div>
      <div v-if="sa" class="pp-field is-required" :class="{ 'cr-invalid': error('national_address'), 'cr-flag': flagged.has('national_address') }">
        <label for="cr-naddress">{{ $t("careers.national_address") }}</label>
        <div dir="ltr" class="cr-otp">
          <InputOtp id="cr-naddress" :modelValue="form.national_address" :length="8" :invalid="!!error('national_address')"
            @update:modelValue="(v) => (form.national_address = String(v ?? '').toUpperCase())" @blur="touch('national_address')" />
        </div>
        <small v-if="error('national_address')" class="error">{{ error("national_address") }}</small>
        <small v-else class="help">{{ $t("careers.national_address_hint") }}</small>
      </div>
      <div class="pp-field" :class="{ 'cr-flag': flagged.has('address') }">
        <label for="cr-address">{{ $t("careers.address") }}</label>
        <Textarea id="cr-address" v-model="form.address" rows="2" autoResize maxlength="300" fluid />
        <div class="flex flex-wrap items-center gap-2">
          <Button type="button" icon="pi pi-map-marker" :label="$t('careers.use_location')" :loading="locating" size="small" @click="useLocation" />
          <span v-if="form.lat" class="help"><i class="pi pi-check-circle text-green-600" /> {{ $t("careers.location_set") }}</span>
          <small v-if="locationError" class="error">{{ locationError }}</small>
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section class="pp-card pp-card--pad cr-section">
      <h2 class="pp-h3 cr-section__title"><i class="pi pi-briefcase" /> {{ $t("careers.experience") }}</h2>
      <div class="pp-field is-required" :class="{ 'cr-invalid': error('has_experience'), 'cr-flag': flagged.has('has_experience') || flagged.has('experience') }">
        <label id="cr-exp-label">{{ $t("careers.has_experience") }}</label>
        <SelectButton v-model="form.has_experience" :options="yesNo" optionLabel="label" optionValue="value" aria-labelledby="cr-exp-label" @change="touch('has_experience')" />
        <small v-if="error('has_experience')" class="error">{{ error("has_experience") }}</small>
      </div>
      <template v-if="form.has_experience">
        <div v-for="(job, i) in form.experience" :key="i" class="cr-job">
          <div class="cr-grid">
            <div class="pp-field is-required" :class="{ 'cr-invalid': error(`experience.${i}.employer`) }">
              <label :for="`cr-emp-${i}`">{{ $t("careers.employer") }}</label>
              <InputText :id="`cr-emp-${i}`" v-model="job.employer" maxlength="150" fluid :invalid="!!error(`experience.${i}.employer`)" @blur="touch(`experience.${i}.employer`)" />
              <small v-if="error(`experience.${i}.employer`)" class="error">{{ error(`experience.${i}.employer`) }}</small>
            </div>
            <div class="pp-field is-required" :class="{ 'cr-invalid': error(`experience.${i}.title`) }">
              <label :for="`cr-title-${i}`">{{ $t("careers.job_title") }}</label>
              <InputText :id="`cr-title-${i}`" v-model="job.title" maxlength="150" fluid :invalid="!!error(`experience.${i}.title`)" @blur="touch(`experience.${i}.title`)" />
              <small v-if="error(`experience.${i}.title`)" class="error">{{ error(`experience.${i}.title`) }}</small>
            </div>
            <div class="pp-field is-required" :class="{ 'cr-invalid': error(`experience.${i}.from`) }">
              <label :for="`cr-from-${i}`">{{ $t("careers.from") }}</label>
              <DatePicker :inputId="`cr-from-${i}`" v-model="job.from" view="month" dateFormat="yy-mm" :maxDate="new Date()" showIcon fluid
                :invalid="!!error(`experience.${i}.from`)" @hide="touch(`experience.${i}.from`)" />
              <small v-if="error(`experience.${i}.from`)" class="error">{{ error(`experience.${i}.from`) }}</small>
            </div>
            <div class="pp-field" :class="{ 'cr-invalid': error(`experience.${i}.to`) }">
              <label :for="`cr-to-${i}`">{{ $t("careers.to") }}</label>
              <DatePicker :inputId="`cr-to-${i}`" v-model="job.to" view="month" dateFormat="yy-mm" :maxDate="new Date()" :disabled="job.current" showIcon fluid
                :invalid="!!error(`experience.${i}.to`)" @hide="touch(`experience.${i}.to`)" />
              <div class="flex items-center gap-2">
                <Checkbox v-model="job.current" :inputId="`cr-current-${i}`" binary />
                <label :for="`cr-current-${i}`" class="help">{{ $t("careers.current_job") }}</label>
              </div>
              <small v-if="error(`experience.${i}.to`)" class="error">{{ error(`experience.${i}.to`) }}</small>
            </div>
          </div>
          <Button v-if="form.experience.length > 1" type="button" icon="pi pi-trash" :label="$t('careers.remove_job')" text severity="danger" size="small"
            @click="form.experience.splice(i, 1)" />
        </div>
        <small v-if="error('experience')" class="error">{{ error("experience") }}</small>
        <Button v-if="form.experience.length < 10" type="button" icon="pi pi-plus" :label="$t('careers.add_job')" outlined size="small" class="self-start" @click="addJob" />
      </template>
    </section>

    <div class="cr-two">
      <!-- Bank -->
      <section class="pp-card pp-card--pad cr-section">
        <h2 class="pp-h3 cr-section__title"><i class="pi pi-building-columns" /> {{ $t("careers.bank") }}</h2>
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('bank_id'), 'cr-flag': flagged.has('bank_id') }">
          <label for="cr-bank">{{ $t("careers.bank_name") }}</label>
          <Select inputId="cr-bank" v-model="form.bank_id" :options="info.banks" optionValue="id" :optionLabel="name" filter fluid
            :placeholder="$t('careers.pick')" :invalid="!!error('bank_id')" @hide="touch('bank_id')" />
          <small v-if="error('bank_id')" class="error">{{ error("bank_id") }}</small>
        </div>
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('iban'), 'cr-flag': flagged.has('iban') }">
          <label for="cr-iban">{{ $t("careers.iban") }}</label>
          <div dir="ltr" class="cr-addon">
            <span class="cr-addon__label">{{ profile.iban_prefix }}</span>
            <InputText id="cr-iban" v-model="form.iban_rest" :maxlength="profile.iban_length - 2 + 8" autocomplete="off" class="cr-addon__input"
              :invalid="!!error('iban')" @blur="touch('iban')" @update:modelValue="(v) => (form.iban_rest = String(v ?? '').toUpperCase().replace(/^[A-Z]{2}(?=\d{2})/, (m) => (m === profile.iban_prefix ? '' : m)))" />
          </div>
          <small v-if="error('iban')" class="error">{{ error("iban") }}</small>
          <Message severity="info" size="small" :closable="false">{{ $t("careers.iban_hint") }}</Message>
        </div>
      </section>

      <!-- Academic -->
      <section class="pp-card pp-card--pad cr-section">
        <h2 class="pp-h3 cr-section__title"><i class="pi pi-graduation-cap" /> {{ $t("careers.academic") }}</h2>
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('qualification_id'), 'cr-flag': flagged.has('qualification_id') }">
          <label for="cr-qual">{{ $t("careers.qualification") }}</label>
          <Select inputId="cr-qual" v-model="form.qualification_id" :options="info.qualifications" optionValue="id" :optionLabel="name" fluid
            :placeholder="$t('careers.pick')" :invalid="!!error('qualification_id')" @hide="touch('qualification_id')" />
          <small v-if="error('qualification_id')" class="error">{{ error("qualification_id") }}</small>
        </div>
        <div class="pp-field is-required" :class="{ 'cr-invalid': error('specialty_id'), 'cr-flag': flagged.has('specialty_id') }">
          <label for="cr-spec">{{ $t("careers.specialty") }}</label>
          <Select inputId="cr-spec" v-model="form.specialty_id" :options="info.specialties" optionValue="id" :optionLabel="name" filter fluid
            :placeholder="$t('careers.pick')" :invalid="!!error('specialty_id')" @hide="touch('specialty_id')" />
          <small v-if="error('specialty_id')" class="error">{{ error("specialty_id") }}</small>
          <small v-else class="help">{{ $t("careers.specialty_hint") }}</small>
        </div>
      </section>
    </div>

    <div class="cr-actions">
      <Button type="button" :label="$t('careers.next_documents')" icon="pi pi-arrow-left" iconPos="right" size="large" @click="next" />
    </div>
  </div>
</template>
