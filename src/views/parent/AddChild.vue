<script setup>
// Registering a child: the name, the birth date, where they were born, the address, the national number, the
// gender, the nationality and the first language. Then their file opens.
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { toDateOnly } from "@/utils/childAge";

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const portal = useParentPortalStore();

const child = ref({ name: "", birth_date: null, birth_place: "", address: "", national_id: "", gender: null, nationalty: null, lang: null });
const countries = ref([]);
const languages = ref([]);
const errors = ref({});
const submitted = ref(false);
const sending = ref(false);
const maxDate = new Date();

const genders = computed(() => [{ name: t("male"), value: "0" }, { name: t("female"), value: "1" }]);
const firstError = (key) => errors.value[key]?.[0];
const missing = (key) => submitted.value && !child.value[key];
const ready = computed(() => ["name", "birth_date", "birth_place", "address", "national_id", "gender", "nationalty", "lang"].every((key) => child.value[key]));

onMounted(async () => {
  try {
    const [{ data: c }, { data: l }] = await Promise.all([axios.get(`/api/countries/${localStorage.getItem("appLang") || "ar"}`), axios.get("/api/languages")]);
    countries.value = c.countries ?? [];
    languages.value = [...(l.langs?.ar_en ?? []), ...(l.langs?.other ?? [])];
  } catch {
    // The lists stay empty; the fields still take typed values below.
  }
});

async function submit() {
  submitted.value = true;
  errors.value = {};
  if (!ready.value) {
    toast.add({ severity: "warn", summary: t("fill_required_fields"), life: 3000 });
    return;
  }
  sending.value = true;
  try {
    const { data } = await axios.post("/api/parent/child/create", { ...child.value, birth_date: toDateOnly(child.value.birth_date) });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("pp.child_added"), life: 3000 });
    await portal.refresh();
    const id = data?.child?.id ?? data?.data?.id ?? null;
    router.push(id ? { name: "parent-child", params: { child_id: id } } : { name: "clidreen_parents" });
  } catch (error) {
    errors.value = error.response?.data?.errors ?? {};
    toast.add({ severity: "error", summary: t("error"), detail: Object.values(errors.value).flat()[0] ?? error.response?.data?.message ?? t("mission_error"), life: 4000 });
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="pp-page">
    <Toast />
    <PageHead :title="$t('Register_your_child')" :lead="$t('pp.add_child_lead')" :back="{ name: 'clidreen_parents' }" :kicker="$t('pp.my_children')" icon="pi pi-user-plus" />

    <form class="pp-card pp-card--pad pp-stack pp-in max-w-[760px]" novalidate data-no-request-spinner @submit.prevent="submit">
      <div class="pp-field is-required">
        <label for="c-name">{{ $t("Full_Name") }}</label>
        <InputText id="c-name" v-model="child.name" autocomplete="off" fluid :invalid="missing('name') || Boolean(firstError('name'))" />
        <small v-if="firstError('name')" class="error">{{ firstError("name") }}</small>
      </div>
      <div class="pp-form-grid">
        <div class="pp-field is-required">
          <label for="c-birth">{{ $t("date_of_birth") }}</label>
          <DatePicker id="c-birth" v-model="child.birth_date" :maxDate="maxDate" showIcon dateFormat="yy-mm-dd" fluid :invalid="missing('birth_date') || Boolean(firstError('birth_date'))" />
          <small v-if="firstError('birth_date')" class="error">{{ firstError("birth_date") }}</small>
        </div>
        <div class="pp-field is-required">
          <label for="c-gender">{{ $t("Type") }}</label>
          <Select id="c-gender" v-model="child.gender" :options="genders" optionLabel="name" optionValue="value" fluid :invalid="missing('gender')" />
        </div>
        <div class="pp-field is-required">
          <label for="c-place">{{ $t("place_of_birth") }}</label>
          <InputText id="c-place" v-model="child.birth_place" fluid :invalid="missing('birth_place')" />
        </div>
        <div class="pp-field is-required">
          <label for="c-national">{{ $t("national_id") }}</label>
          <InputText id="c-national" v-model="child.national_id" dir="ltr" fluid :invalid="missing('national_id') || Boolean(firstError('national_id'))" />
          <small v-if="firstError('national_id')" class="error">{{ firstError("national_id") }}</small>
        </div>
        <div class="pp-field is-required">
          <label for="c-nat">{{ $t("Nationality") }}</label>
          <Select id="c-nat" v-model="child.nationalty" :options="countries" optionLabel="country" optionValue="country" filter editable fluid :invalid="missing('nationalty')" />
        </div>
        <div class="pp-field is-required">
          <label for="c-lang">{{ $t("primary_language") }}</label>
          <Select id="c-lang" v-model="child.lang" :options="languages" optionLabel="lang" optionValue="lang" filter editable fluid :invalid="missing('lang')" />
        </div>
      </div>
      <div class="pp-field is-required">
        <label for="c-address">{{ $t("address") }}</label>
        <InputText id="c-address" v-model="child.address" fluid :invalid="missing('address')" />
      </div>
      <div class="pp-row pp-between pt-2">
        <small class="pp-muted">{{ $t("pp.add_child_hint") }}</small>
        <Button type="submit" :label="$t('سجل طفلك معنا')" icon="pi pi-check" :loading="sending" size="large" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.pp-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}
@media (min-width: 640px) {
  .pp-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
