<script setup>
// Edit an employee: profile header + tabs (personal / job / therapist). The record and every dropdown load
// together in two requests; leaving with unsaved changes asks first.
import axios from "axios";
import moment from "moment";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import SubstituteSelect from "@/components/SubstituteSelect.vue";
import WorkTypeSelect from "@/components/WorkTypeSelect.vue";
import AgeRangeField from "@/components/common/AgeRangeField.vue";
import EmployeeField from "@/components/employees/EmployeeField.vue";
import EmployeeHero from "@/components/employees/EmployeeHero.vue";
import { workTypesValue } from "@/utils/employeeWorkTypes";
import { can, isAdmin } from "@/utils/permissions";
import {
  employeeTypeName,
  employeeTypes,
  evaluationTypeGroups,
  fetchEmployeeFormOptions,
  hasTherapistFields,
} from "@/utils/employeeForm";

const { t } = useI18n();
const toast = useToast();
const route = useRoute();

const loading = ref(true);
const loadError = ref(false);
const saving = ref(false);
const tab = ref("personal");
const employee = ref({});
const original = ref("");
const errors = ref({});
const options = ref({ shifts: [], positions: [], treatments: [], skills: [], departments: [], roles: [] });

// Role, salary and type change only with «employees edit» («doctor edit» keeps them).
const canEditJob = computed(() => can("employees edit"));
const types = computed(() => employeeTypes(t));
const evaluationGroups = computed(() => evaluationTypeGroups(t));
const roles = computed(() => options.value.roles.filter((role) => !role.is_locked || isAdmin()));
const therapist = computed(() => hasTherapistFields(employee.value.type));

const snapshot = () => JSON.stringify(employee.value);
const dirty = computed(() => Boolean(original.value) && snapshot() !== original.value);

const nameOf = (list, id, key = "title") => list.find((item) => Number(item.id) === Number(id))?.[key] ?? "";
const facts = computed(() => [
  { icon: "pi pi-envelope", label: t("email"), value: employee.value.email },
  { icon: "pi pi-briefcase", label: t("position_name"), value: nameOf(options.value.positions, employee.value.position_id) },
  { icon: "pi pi-clock", label: t("shift_name"), value: nameOf(options.value.shifts, employee.value.shift_id) },
  { icon: "pi pi-calendar", label: t("date_of_enrollment"), value: formatDate(employee.value.date_of_enrollment) },
]);

const toDate = (value) => (value ? moment(value).toDate() : null);
const formatDate = (value) => (value ? moment(value).format("YYYY-MM-DD") : "");
const ids = (list) => (list ?? []).map((item) => Number(typeof item === "object" ? item.id : item)).filter(Number.isInteger);

function fill(data) {
  const user = data.user ?? {};
  employee.value = {
    name: data.name,
    email: data.email,
    password: "",
    title: user.title,
    user_id: data.user_id,
    national_id: data.national_id ?? "",
    employee_number: data.employee_number ?? "",
    date_of_birth: toDate(data.date_of_birth),
    image: user.image,
    file: null,
    position_id: data.position_id,
    shift_id: data.shift_id,
    basic_salary: data.basic_salary,
    spotter: user.spotter,
    contract_period: data.contract_period,
    date_of_enrollment: toDate(data.date_of_enrollment),
    type: user.type,
    role: user.roles?.[0]?.id ?? null,
    department: ids(user.departments),
    skills: ids(user.skills),
    treatments: ids(user.treatments),
    evaluation: ids(user.evaluations),
    substitute_ids: ids(user.substitutes),
    work_types: data.work_types ?? [],
    age_from_months: user.age_from_months ?? null,
    age_to_months: user.age_to_months ?? null,
  };
  original.value = snapshot();
}

async function load() {
  loading.value = true;
  loadError.value = false;
  try {
    // The record and the dropdowns are fetched at the same time.
    const [record, lookups] = await Promise.all([
      axios.get(`api/employees/${route.params.id}`, { params: { form: 1 } }),
      fetchEmployeeFormOptions(),
    ]);
    options.value = { ...options.value, ...lookups };
    fill(record.data.data);
  } catch {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

function setImage({ file, preview }) {
  employee.value.image = preview;
  employee.value.file = file;
}

function body() {
  const e = employee.value;
  const form = new FormData();
  if (e.name) form.append("name", e.name);
  if (e.title) form.append("title", e.title);
  if (e.email) form.append("email", e.email);
  if (e.password) form.append("password", e.password);
  if (e.shift_id) form.append("shift_id", e.shift_id);
  if (e.spotter) form.append("spotter", e.spotter);
  if (e.position_id) form.append("position_id", e.position_id);
  if (e.date_of_birth) form.append("date_of_birth", formatDate(e.date_of_birth));
  if (e.date_of_enrollment) form.append("date_of_enrollment", formatDate(e.date_of_enrollment));
  if (e.contract_period) form.append("contract_period", e.contract_period);
  if (e.national_id) form.append("national_id", e.national_id);
  form.append("employee_number", e.employee_number ?? "");
  if (e.basic_salary) form.append("basic_salary", e.basic_salary);
  if (e.type) form.append("type", e.type);
  if (e.role) form.append("role", e.role);
  // Always sent: an empty value clears the substitutes.
  form.append("substitute_ids", e.substitute_ids ?? []);
  // Always sent too: an empty value clears the work types.
  form.append("work_types", workTypesValue(e.work_types));
  if (Number(e.type) === 2) {
    form.append("age_from_months", e.age_from_months ?? "");
    form.append("age_to_months", e.age_to_months ?? "");
  }
  if (e.evaluation) form.append("evaluations", e.evaluation);
  if (e.treatments) form.append("treatments", e.treatments);
  if (e.skills) form.append("skills", e.skills);
  if (e.department) form.append("department_id", e.department);
  if (e.file) form.append("image", e.file);
  return form;
}

// Which tab holds each field, to open the first one with an error.
const FIELD_TABS = {
  job: ["position_id", "shift_id", "basic_salary", "spotter", "contract_period", "date_of_enrollment", "type", "role", "department_id", "substitute_ids", "work_types"],
  therapist: ["skills", "evaluations", "treatments", "age_from_months", "age_to_months"],
};
const err = (key) => errors.value?.[key];
const tabOf = (field) => Object.keys(FIELD_TABS).find((name) => FIELD_TABS[name].includes(field.split(".")[0])) ?? "personal";
const tabsWithErrors = computed(() => new Set(Object.keys(errors.value ?? {}).map(tabOf)));

async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  try {
    await axios.post(`/api/employees/${route.params.id}`, body());
    employee.value.password = "";
    employee.value.file = null;
    original.value = snapshot();
    toast.add({ severity: "success", summary: t("success_message"), detail: t("emp.saved"), life: 3000 });
  } catch (error) {
    errors.value = error.response?.data?.errors ?? {};
    const first = ["personal", "job", "therapist"].find((name) => tabsWithErrors.value.has(name));
    if (first) tab.value = first;
    toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message ?? t("request_failed_retry"), life: 4000 });
  } finally {
    saving.value = false;
  }
}

function discard() {
  employee.value = JSON.parse(original.value);
  employee.value.date_of_birth = toDate(employee.value.date_of_birth);
  employee.value.date_of_enrollment = toDate(employee.value.date_of_enrollment);
  original.value = snapshot();
  errors.value = {};
}

// A therapist-only tab is left when the kind changes away from therapist.
watch(therapist, (value) => {
  if (!value && tab.value === "therapist") tab.value = "job";
});

const onBeforeUnload = (event) => {
  if (!dirty.value) return;
  event.preventDefault();
  event.returnValue = "";
};

onMounted(() => {
  load();
  window.addEventListener("beforeunload", onBeforeUnload);
});
onBeforeUnmount(() => window.removeEventListener("beforeunload", onBeforeUnload));
onBeforeRouteLeave(() => !dirty.value || window.confirm(t("هل أنت متاكد من الخروج ؟")));
</script>

<template>
  <div class="employee-page">
    <div class="employee-page__top">
      <div>
        <h1 class="employee-page__title">{{ $t("update_employee") }}</h1>
        <p class="employee-page__subtitle">{{ $t("emp.edit_hint") }}</p>
      </div>
      <!-- Opened from the employees or the doctors list: back returns there. -->
      <BackButton />
    </div>

    <!-- Loading: the shape of the page, not a blank spinner. -->
    <template v-if="loading">
      <div class="employee-hero-skeleton sawa-card">
        <Skeleton shape="circle" size="112px" />
        <div class="flex-1 flex flex-column gap-2">
          <Skeleton width="40%" height="1.6rem" />
          <Skeleton width="25%" />
          <Skeleton width="60%" />
        </div>
      </div>
      <div class="sawa-card p-4 mt-3 employee-grid">
        <div v-for="n in 6" :key="n" class="flex flex-column gap-2">
          <Skeleton width="35%" />
          <Skeleton height="2.5rem" />
        </div>
      </div>
    </template>

    <Message v-else-if="loadError" severity="error" :closable="false">
      <div class="flex align-items-center gap-3 flex-wrap">
        <span>{{ $t("request_failed_retry") }}</span>
        <Button :label="$t('refresh')" icon="pi pi-refresh" size="small" @click="load" />
      </div>
    </Message>

    <form v-else @submit.prevent="save">
      <EmployeeHero :name="employee.name" :title="employee.title" :image="employee.image"
        :type-name="employeeTypeName(t, employee.type)" :role-name="nameOf(options.roles, employee.role, 'name')"
        :facts="facts" :image-error="err('image')" editable @image="setImage" />

      <div class="sawa-card employee-card">
        <Tabs v-model:value="tab" scrollable>
          <TabList>
            <Tab value="personal">
              <i class="pi pi-user mx-1" />{{ $t("student_details") }}
              <i v-if="tabsWithErrors.has('personal')" class="pi pi-exclamation-circle tab-error" />
            </Tab>
            <Tab value="job">
              <i class="pi pi-briefcase mx-1" />{{ $t("job_details") }}
              <i v-if="tabsWithErrors.has('job')" class="pi pi-exclamation-circle tab-error" />
            </Tab>
            <Tab v-if="therapist" value="therapist">
              <i class="pi pi-heart mx-1" />{{ $t("emp.therapist_tab") }}
              <i v-if="tabsWithErrors.has('therapist')" class="pi pi-exclamation-circle tab-error" />
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="personal">
              <div class="employee-grid">
                <EmployeeField :label="$t('employee_name')" for="emp-name" required :error="err('name')">
                  <InputText id="emp-name" v-model="employee.name" :invalid="Boolean(err('name'))" />
                </EmployeeField>
                <EmployeeField :label="$t('title')" for="emp-title" required :error="err('title')">
                  <InputText id="emp-title" v-model="employee.title" :invalid="Boolean(err('title'))" />
                </EmployeeField>
                <EmployeeField :label="$t('email')" for="emp-email" required :error="err('email')">
                  <IconField>
                    <InputIcon class="pi pi-envelope" />
                    <InputText id="emp-email" v-model="employee.email" type="email" dir="ltr" :invalid="Boolean(err('email'))" />
                  </IconField>
                </EmployeeField>
                <EmployeeField :label="$t('password')" for="emp-password" :hint="$t('emp.password_keep')" :error="err('password')">
                  <Password v-model="employee.password" inputId="emp-password" toggleMask :feedback="false"
                    autocomplete="new-password" fluid :invalid="Boolean(err('password'))" />
                </EmployeeField>
                <EmployeeField :label="$t('national_id')" for="emp-national-id" required :error="err('national_id')">
                  <!-- Text, not a number: keeps leading zeros (the API stores it as a string). -->
                  <InputText id="emp-national-id" v-model="employee.national_id" inputmode="numeric" dir="ltr"
                    :invalid="Boolean(err('national_id'))" />
                </EmployeeField>
                <EmployeeField :label="$t('lflow.employee_number')" for="emp-number" :hint="$t('lflow.employee_number_hint')" :error="err('employee_number')">
                  <InputText id="emp-number" v-model="employee.employee_number" dir="ltr" :invalid="Boolean(err('employee_number'))" />
                </EmployeeField>
                <EmployeeField :label="$t('date_of_birth')" for="emp-birth" required :error="err('date_of_birth')">
                  <DatePicker v-model="employee.date_of_birth" inputId="emp-birth" dateFormat="yy-mm-dd" showIcon
                    showButtonBar fluid :maxDate="new Date()" :invalid="Boolean(err('date_of_birth'))" />
                </EmployeeField>
              </div>
            </TabPanel>

            <TabPanel value="job">
              <div class="employee-grid">
                <EmployeeField :label="$t('position_name')" for="emp-position" required :error="err('position_id')">
                  <Select v-model="employee.position_id" inputId="emp-position" :options="options.positions" optionLabel="title"
                    optionValue="id" filter :placeholder="$t('position_name')" :invalid="Boolean(err('position_id'))" />
                </EmployeeField>
                <EmployeeField :label="$t('shift_name')" for="emp-shift" required :error="err('shift_id')">
                  <Select v-model="employee.shift_id" inputId="emp-shift" :options="options.shifts" optionLabel="title"
                    optionValue="id" filter :placeholder="$t('shift_name')" :invalid="Boolean(err('shift_id'))" />
                </EmployeeField>
                <EmployeeField :label="$t('basic_salary')" for="emp-salary" required :error="err('basic_salary')">
                  <InputNumber v-model="employee.basic_salary" inputId="emp-salary" :useGrouping="false" fluid
                    :disabled="!canEditJob" :invalid="Boolean(err('basic_salary'))" />
                </EmployeeField>
                <EmployeeField :label="$t('Spotter')" for="emp-spotter" required :error="err('spotter')">
                  <InputNumber v-model="employee.spotter" inputId="emp-spotter" :useGrouping="false" fluid :invalid="Boolean(err('spotter'))" />
                </EmployeeField>
                <EmployeeField :label="`${$t('contract_period')} ${$t('In_months')}`" for="emp-contract" required :error="err('contract_period')">
                  <InputText id="emp-contract" v-model="employee.contract_period" :invalid="Boolean(err('contract_period'))" />
                </EmployeeField>
                <EmployeeField :label="$t('date_of_enrollment')" for="emp-enrollment" required :error="err('date_of_enrollment')">
                  <DatePicker v-model="employee.date_of_enrollment" inputId="emp-enrollment" dateFormat="yy-mm-dd" showIcon
                    showButtonBar fluid :invalid="Boolean(err('date_of_enrollment'))" />
                </EmployeeField>
                <EmployeeField :label="$t('type')" for="emp-type" required :error="err('type')">
                  <Select v-model="employee.type" inputId="emp-type" :options="types" optionLabel="name" optionValue="id"
                    :disabled="!canEditJob" :invalid="Boolean(err('type'))" />
                </EmployeeField>
                <EmployeeField :label="$t('roles')" for="emp-role" required :error="err('role')">
                  <Select v-model="employee.role" inputId="emp-role" :options="roles" optionLabel="name" optionValue="id"
                    filter :disabled="!canEditJob" :invalid="Boolean(err('role'))" />
                </EmployeeField>
                <EmployeeField :label="$t('department')" for="emp-department" required :error="err('department_id')">
                  <MultiSelect v-model="employee.department" inputId="emp-department" :options="options.departments"
                    optionLabel="title" optionValue="id" filter display="chip" :invalid="Boolean(err('department_id'))" />
                </EmployeeField>
                <!-- Optional: inclusion, day and/or clinics (evening); inclusion and day exclude each other. -->
                <EmployeeField :label="$t('work_types')" for="work-types" :error="err('work_types')">
                  <WorkTypeSelect v-model="employee.work_types" />
                </EmployeeField>
                <!-- The employees who stand in for this one (information only); every employee, searchable. -->
                <EmployeeField :label="$t('substitute_employee')" for="substitute-employee" :error="err('substitute_ids')" wide>
                  <SubstituteSelect v-model="employee.substitute_ids" :exclude="employee.user_id" />
                </EmployeeField>
              </div>
            </TabPanel>

            <TabPanel v-if="therapist" value="therapist">
              <div class="employee-grid">
                <EmployeeField :label="$t('skill_name')" for="emp-skills" :error="err('skills')">
                  <MultiSelect v-model="employee.skills" inputId="emp-skills" :options="options.skills" optionLabel="name"
                    optionValue="id" filter display="chip" :invalid="Boolean(err('skills'))" />
                </EmployeeField>
                <EmployeeField :label="$t('Typetreatment')" for="emp-treatments" :error="err('treatments')">
                  <MultiSelect v-model="employee.treatments" inputId="emp-treatments" :options="options.treatments"
                    optionLabel="name" optionValue="id" filter display="chip" :invalid="Boolean(err('treatments'))" />
                </EmployeeField>
                <EmployeeField :label="$t('Evaluate Types')" for="emp-evaluations" :error="err('evaluations')" wide>
                  <MultiSelect v-model="employee.evaluation" inputId="emp-evaluations" :options="evaluationGroups"
                    optionLabel="name" optionValue="id" optionGroupLabel="label" optionGroupChildren="items" filter
                    display="chip" :placeholder="$t('evalute_type')" :invalid="Boolean(err('evaluations'))" />
                </EmployeeField>
                <!-- Therapists: the ages they specialise in (choosing them for a child outside it only warns). -->
                <div v-if="Number(employee.type) === 2" class="employee-grid__wide">
                  <AgeRangeField v-model:from="employee.age_from_months" v-model:to="employee.age_to_months"
                    :label="$t('age_ranges.therapist_label')" />
                  <small v-if="err('age_from_months') || err('age_to_months')" class="text-red-600">
                    {{ (err('age_from_months') || err('age_to_months'))[0] }}
                  </small>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <!-- Buttons at the start: the floating assistant button sits at the end corner. -->
        <div class="employee-actions">
          <div class="flex gap-2">
            <Button type="submit" :label="$t('save')" icon="pi pi-check" :loading="saving" :disabled="saving" />
            <Button type="button" :label="$t('emp.discard')" icon="pi pi-undo" severity="secondary" variant="outlined"
              :disabled="!dirty || saving" @click="discard" />
          </div>
          <span v-if="dirty" class="employee-actions__state"><i class="pi pi-circle-fill" />{{ $t("emp.unsaved") }}</span>
          <span v-else class="employee-actions__state is-saved"><i class="pi pi-check-circle" />{{ $t("emp.no_changes") }}</span>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.employee-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.employee-page__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.employee-page__title {
  margin: 0;
  color: var(--sawa-primary);
  font-size: 1.35rem;
  font-weight: 800;
}

.employee-page__subtitle {
  margin: 0.2rem 0 0;
  color: var(--sawa-muted);
}

.employee-hero-skeleton {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
}

.employee-card {
  margin-top: 1rem;
  padding: 0.5rem 1rem 0;
}

.tab-error {
  margin-inline-start: 0.35rem;
  color: #dc2626;
  font-size: 0.85rem;
}

.employee-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.1rem 1.5rem;
  padding: 0.75rem 0.25rem 0.5rem;
}

.employee-grid__wide {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.employee-actions {
  position: sticky;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 0.75rem -1rem 0;
  padding: 0.85rem 1rem;
  border-top: 1px solid var(--sawa-border);
  border-radius: 0 0 var(--sawa-radius) var(--sawa-radius);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(4px);
}

.employee-actions__state {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #b45309;
  font-weight: 600;
  font-size: 0.875rem;
}

.employee-actions__state .pi-circle-fill {
  font-size: 0.55rem;
}

.employee-actions__state.is-saved {
  color: var(--sawa-muted);
  font-weight: 500;
}

@media (max-width: 768px) {
  .employee-grid {
    grid-template-columns: 1fr;
  }

  .employee-actions > div {
    width: 100%;
  }

  .employee-actions :deep(.p-button) {
    flex: 1;
  }
}
</style>
