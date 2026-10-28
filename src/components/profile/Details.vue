<script setup>
// «My profile»: header + tabs. Everyone sees their details, picks their substitutes and changes their password;
// a therapist sets their age range; with «employees edit» the details are an editable form.
import axios from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import SubstituteSelect from "../SubstituteSelect.vue";
import AgeRangeField from "../common/AgeRangeField.vue";
import EmployeeField from "../employees/EmployeeField.vue";
import EmployeeHero from "../employees/EmployeeHero.vue";
import { can, isAdmin } from "../../utils/permissions";
import { employeeTypeName, employeeTypes, fetchEmployeeFormOptions, hasTherapistFields } from "../../utils/employeeForm";

const { t } = useI18n();
const toast = useToast();

const userId = localStorage.getItem("user_id");
const canEditProfile = computed(() => can("employees edit"));

const loading = ref(true);
const loadError = ref(false);
const tab = ref("personal");
const profile = ref({});
const employee = ref({});
const errors = ref({});
const saving = ref(false);
const options = ref({ shifts: [], positions: [], treatments: [], skills: [], departments: [], roles: [] });

const substituteIds = ref([]);
const savedSubstituteIds = ref([]);
const substituteSaving = ref(false);
const ageRange = ref({ from: null, to: null, saving: false });
const passwordForm = ref({ current_password: "", password: "", password_confirmation: "" });
const passwordErrors = ref({});
const passwordLoading = ref(false);

const types = computed(() => employeeTypes(t));
const roles = computed(() => options.value.roles.filter((role) => !role.is_locked || isAdmin()));
const therapist = computed(() => Number(profile.value.type) === 2);
const sameIds = (a, b) => [...a].map(Number).sort((x, y) => x - y).join(",") === [...b].map(Number).sort((x, y) => x - y).join(",");
const substitutesChanged = computed(() => !sameIds(substituteIds.value, savedSubstituteIds.value));
const passwordMismatch = computed(() => Boolean(passwordForm.value.password_confirmation)
  && passwordForm.value.password !== passwordForm.value.password_confirmation);

const toDate = (value) => (value ? moment(value).toDate() : null);
const formatDate = (value) => (value ? moment(value).format("YYYY-MM-DD") : "");
const ids = (list) => (list ?? []).map((item) => Number(item.id));
const names = (list, key = "name") => (list ?? []).map((item) => item[key]).filter(Boolean).join("، ");
const err = (key) => errors.value?.[key];

const facts = computed(() => [
  { icon: "pi pi-envelope", label: t("email"), value: profile.value.email },
  { icon: "pi pi-briefcase", label: t("position_name"), value: profile.value.position?.title },
  { icon: "pi pi-clock", label: t("shift_name"), value: profile.value.shift?.title },
  { icon: "pi pi-calendar", label: t("date_of_enrollment"), value: formatDate(profile.value.date_of_enrollment) },
]);

// Read-only details (without «employees edit»).
const personalInfo = computed(() => [
  { label: t("employee_name"), value: profile.value.name },
  { label: t("title"), value: profile.value.title },
  { label: t("email"), value: profile.value.email, ltr: true },
  { label: t("national_id"), value: profile.value.national_id, ltr: true },
  { label: t("date_of_birth"), value: formatDate(profile.value.date_of_birth), ltr: true },
]);
const jobInfo = computed(() => [
  { label: t("position_name"), value: profile.value.position?.title },
  { label: t("shift_name"), value: profile.value.shift?.title },
  { label: t("basic_salary"), value: profile.value.basic_salary },
  { label: t("Spotter"), value: profile.value.spotter },
  { label: t("contract_period"), value: profile.value.contract_period },
  { label: t("date_of_enrollment"), value: formatDate(profile.value.date_of_enrollment), ltr: true },
  { label: t("type"), value: employeeTypeName(t, profile.value.type) },
  { label: t("roles"), value: names(profile.value.roles) },
  { label: t("department"), value: names(profile.value.departments, "title") },
  ...(hasTherapistFields(profile.value.type) ? [
    { label: t("skill_name"), value: names(profile.value.skills) },
    { label: t("Typetreatment"), value: names(profile.value.treatments) },
  ] : []),
]);

function fill(user) {
  profile.value = user;
  employee.value = {
    name: user.name,
    email: user.email,
    title: user.title,
    // Accounts without an employee record (e.g. the admin) have no national id.
    national_id: user.national_id ?? "",
    date_of_birth: toDate(user.date_of_birth),
    image: user.image,
    file: null,
    position_id: user.position_id,
    shift_id: user.shift_id,
    basic_salary: user.basic_salary,
    spotter: user.spotter,
    contract_period: user.contract_period,
    date_of_enrollment: toDate(user.date_of_enrollment),
    type: user.type,
    role: user.roles?.[0]?.id ?? null,
    skills: ids(user.skills),
    treatments: ids(user.treatments),
    department: ids(user.departments),
  };
  savedSubstituteIds.value = (user.substitute_ids ?? []).map(Number);
  substituteIds.value = [...savedSubstituteIds.value];
  ageRange.value.from = user.age_from_months ?? null;
  ageRange.value.to = user.age_to_months ?? null;
}

async function load() {
  loading.value = true;
  loadError.value = false;
  try {
    // Only the details (?part=user), and the dropdowns at the same time when the form is editable.
    const [{ data }, lookups] = await Promise.all([
      axios.get(`api/users/${userId}`, { params: { part: "user" } }),
      // The dropdowns failing must not hide the profile itself.
      canEditProfile.value ? fetchEmployeeFormOptions().catch(() => null) : null,
    ]);
    if (lookups) options.value = { ...options.value, ...lookups };
    fill(data.user);
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

async function update() {
  if (!canEditProfile.value || saving.value) return;
  const e = employee.value;
  const body = new FormData();
  if (e.name) body.append("name", e.name);
  if (e.title) body.append("title", e.title);
  if (e.email) body.append("email", e.email);
  if (e.shift_id) body.append("shift_id", e.shift_id);
  if (e.spotter) body.append("spotter", e.spotter);
  if (e.position_id) body.append("position_id", e.position_id);
  if (e.date_of_birth) body.append("date_of_birth", formatDate(e.date_of_birth));
  if (e.date_of_enrollment) body.append("date_of_enrollment", formatDate(e.date_of_enrollment));
  if (e.contract_period) body.append("contract_period", e.contract_period);
  if (e.national_id) body.append("national_id", e.national_id);
  if (e.basic_salary) body.append("basic_salary", e.basic_salary);
  if (e.type) body.append("type", e.type);
  if (e.role) body.append("role", e.role);
  if (e.treatments) body.append("treatments", e.treatments);
  if (e.skills) body.append("skills", e.skills);
  if (e.department) body.append("department_id", e.department);
  if (e.file) body.append("image", e.file);
  saving.value = true;
  errors.value = {};
  try {
    await axios.post(`/api/employees/${userId}`, body);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("emp.saved"), life: 3000 });
  } catch (error) {
    errors.value = error.response?.data?.errors ?? {};
    toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message ?? t("request_failed_retry"), life: 4000 });
  } finally {
    saving.value = false;
  }
}

const firstError = (error) => Object.values(error.response?.data?.errors ?? {}).flat()[0] ?? t("request_failed_retry");

async function saveSubstitute() {
  if (substituteSaving.value) return;
  substituteSaving.value = true;
  try {
    const { data } = await axios.post("/api/users/profile/substitutes", { substitute_ids: substituteIds.value });
    savedSubstituteIds.value = (data?.substitutes ?? []).map((user) => Number(user.id));
    substituteIds.value = [...savedSubstituteIds.value];
    toast.add({ severity: "success", summary: t("success_message"), detail: t("substitute_employee_saved"), life: 3000 });
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: firstError(error), life: 4000 });
  } finally {
    substituteSaving.value = false;
  }
}

async function saveAgeRange() {
  if (ageRange.value.saving) return;
  ageRange.value.saving = true;
  try {
    const { data } = await axios.post("/api/users/profile/age-range", { age_from_months: ageRange.value.from, age_to_months: ageRange.value.to });
    ageRange.value.from = data.age_from_months;
    ageRange.value.to = data.age_to_months;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("age_ranges.saved"), life: 3000 });
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: firstError(error), life: 4000 });
  } finally {
    ageRange.value.saving = false;
  }
}

async function updatePassword() {
  if (passwordLoading.value || passwordMismatch.value) return;
  passwordLoading.value = true;
  passwordErrors.value = {};
  try {
    await axios.post("/api/users/profile/password", passwordForm.value);
    passwordForm.value = { current_password: "", password: "", password_confirmation: "" };
    toast.add({ severity: "success", summary: t("success_message"), detail: t("password_changed_successfully"), life: 3000 });
  } catch (error) {
    passwordErrors.value = error.response?.data?.errors ?? {};
    if (!Object.keys(passwordErrors.value).length) {
      toast.add({ severity: "error", summary: t("error"), detail: t("request_failed_retry"), life: 4000 });
    }
  } finally {
    passwordLoading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="profile-details">
    <div class="profile-details__top">
      <h1>{{ $t("profile_page_title") }}</h1>
      <p>{{ $t("profile_page_hint") }}</p>
    </div>

    <template v-if="loading">
      <div class="profile-skeleton sawa-card">
        <Skeleton shape="circle" size="112px" />
        <div class="flex-1 flex flex-column gap-2">
          <Skeleton width="40%" height="1.6rem" />
          <Skeleton width="25%" />
          <Skeleton width="60%" />
        </div>
      </div>
      <div class="sawa-card p-4 mt-3 profile-grid">
        <div v-for="n in 4" :key="n" class="flex flex-column gap-2">
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

    <template v-else>
      <EmployeeHero :name="canEditProfile ? employee.name : profile.name" :title="canEditProfile ? employee.title : profile.title"
        :image="employee.image" :type-name="employeeTypeName(t, profile.type)" :role-name="profile.roles?.[0]?.name"
        :facts="facts" :editable="canEditProfile" :image-error="err('image')" @image="setImage" />

      <div class="sawa-card profile-card">
        <Tabs v-model:value="tab" scrollable>
          <TabList>
            <Tab value="personal"><i class="pi pi-user mx-1" />{{ $t("student_details") }}</Tab>
            <Tab value="job"><i class="pi pi-briefcase mx-1" />{{ $t("job_details") }}</Tab>
            <Tab value="work"><i class="pi pi-users mx-1" />{{ $t("emp.work_tab") }}</Tab>
            <Tab value="security"><i class="pi pi-lock mx-1" />{{ $t("emp.security_tab") }}</Tab>
          </TabList>
          <TabPanels>
            <!-- Personal and job details: a form with «employees edit», otherwise read-only. -->
            <TabPanel value="personal">
              <form v-if="canEditProfile" class="profile-grid" @submit.prevent="update">
                <EmployeeField :label="$t('employee_name')" for="profile-name" required :error="err('name')">
                  <InputText id="profile-name" v-model="employee.name" :invalid="Boolean(err('name'))" />
                </EmployeeField>
                <EmployeeField :label="$t('title')" for="profile-title" required :error="err('title')">
                  <InputText id="profile-title" v-model="employee.title" :invalid="Boolean(err('title'))" />
                </EmployeeField>
                <EmployeeField :label="$t('email')" for="profile-email" required :error="err('email')">
                  <InputText id="profile-email" v-model="employee.email" type="email" dir="ltr" :invalid="Boolean(err('email'))" />
                </EmployeeField>
                <EmployeeField :label="$t('national_id')" for="profile-national-id" required :error="err('national_id')">
                  <InputText id="profile-national-id" v-model="employee.national_id" inputmode="numeric" dir="ltr" />
                </EmployeeField>
                <EmployeeField :label="$t('date_of_birth')" for="profile-birth" required :error="err('date_of_birth')">
                  <DatePicker v-model="employee.date_of_birth" inputId="profile-birth" dateFormat="yy-mm-dd" showIcon showButtonBar fluid />
                </EmployeeField>
                <div class="profile-form-actions">
                  <Button type="submit" icon="pi pi-check" :label="$t('save')" :loading="saving" :disabled="saving" />
                </div>
              </form>
              <template v-else>
                <Message severity="info" :closable="false" class="mb-3">{{ $t("profile_read_only_hint") }}</Message>
                <dl class="profile-info">
                  <div v-for="item in personalInfo" :key="item.label">
                    <dt>{{ item.label }}</dt>
                    <dd :dir="item.ltr ? 'ltr' : undefined">{{ item.value || "—" }}</dd>
                  </div>
                </dl>
              </template>
            </TabPanel>

            <TabPanel value="job">
              <form v-if="canEditProfile" class="profile-grid" @submit.prevent="update">
                <EmployeeField :label="$t('position_name')" for="profile-position" required :error="err('position_id')">
                  <Select v-model="employee.position_id" inputId="profile-position" :options="options.positions" optionLabel="title" optionValue="id" filter />
                </EmployeeField>
                <EmployeeField :label="$t('shift_name')" for="profile-shift" required :error="err('shift_id')">
                  <Select v-model="employee.shift_id" inputId="profile-shift" :options="options.shifts" optionLabel="title" optionValue="id" filter />
                </EmployeeField>
                <EmployeeField :label="$t('basic_salary')" for="profile-salary" required :error="err('basic_salary')">
                  <InputNumber v-model="employee.basic_salary" inputId="profile-salary" :useGrouping="false" fluid />
                </EmployeeField>
                <EmployeeField :label="$t('Spotter')" for="profile-spotter" required :error="err('spotter')">
                  <InputNumber v-model="employee.spotter" inputId="profile-spotter" :useGrouping="false" fluid />
                </EmployeeField>
                <EmployeeField :label="$t('contract_period')" for="profile-contract" required :error="err('contract_period')">
                  <InputText id="profile-contract" v-model="employee.contract_period" />
                </EmployeeField>
                <EmployeeField :label="$t('date_of_enrollment')" for="profile-enrollment" required :error="err('date_of_enrollment')">
                  <DatePicker v-model="employee.date_of_enrollment" inputId="profile-enrollment" dateFormat="yy-mm-dd" showIcon showButtonBar fluid />
                </EmployeeField>
                <EmployeeField :label="$t('type')" for="profile-type" required :error="err('type')">
                  <Select v-model="employee.type" inputId="profile-type" :options="types" optionLabel="name" optionValue="id" />
                </EmployeeField>
                <EmployeeField :label="$t('roles')" for="profile-role" required :error="err('role')">
                  <Select v-model="employee.role" inputId="profile-role" :options="roles" optionLabel="name" optionValue="id" filter />
                </EmployeeField>
                <EmployeeField :label="$t('department')" for="profile-department" :error="err('department_id')">
                  <MultiSelect v-model="employee.department" inputId="profile-department" :options="options.departments" optionLabel="title" optionValue="id" filter display="chip" />
                </EmployeeField>
                <template v-if="hasTherapistFields(employee.type)">
                  <EmployeeField :label="$t('skill_name')" for="profile-skills" :error="err('skills')">
                    <MultiSelect v-model="employee.skills" inputId="profile-skills" :options="options.skills" optionLabel="name" optionValue="id" filter display="chip" />
                  </EmployeeField>
                  <EmployeeField :label="$t('Typetreatment')" for="profile-treatments" :error="err('treatments')">
                    <MultiSelect v-model="employee.treatments" inputId="profile-treatments" :options="options.treatments" optionLabel="name" optionValue="id" filter display="chip" />
                  </EmployeeField>
                </template>
                <div class="profile-form-actions">
                  <Button type="submit" icon="pi pi-check" :label="$t('save')" :loading="saving" :disabled="saving" />
                </div>
              </form>
              <dl v-else class="profile-info">
                <div v-for="item in jobInfo" :key="item.label">
                  <dt>{{ item.label }}</dt>
                  <dd :dir="item.ltr ? 'ltr' : undefined">{{ item.value || item.value === 0 ? item.value : "—" }}</dd>
                </div>
              </dl>
            </TabPanel>

            <!-- Every user picks the employees who stand in for them (information only); a therapist sets their ages. -->
            <TabPanel value="work">
              <section class="profile-section">
                <div class="profile-section__head">
                  <h3><i class="pi pi-users" />{{ $t("substitute_employee") }}</h3>
                  <p>{{ $t("substitute_employee_hint") }}</p>
                </div>
                <form class="profile-inline-form" @submit.prevent="saveSubstitute">
                  <SubstituteSelect v-model="substituteIds" inputId="profile-substitute" :exclude="userId" />
                  <Button type="submit" icon="pi pi-check" :label="$t('save')" :loading="substituteSaving"
                    :disabled="substituteSaving || !substitutesChanged" />
                </form>
              </section>
              <section v-if="therapist" class="profile-section">
                <div class="profile-section__head">
                  <!-- The field shows the hint itself. -->
                  <h3 class="mb-3"><i class="pi pi-calendar" />{{ $t("age_ranges.therapist_label") }}</h3>
                </div>
                <form class="profile-inline-form" @submit.prevent="saveAgeRange">
                  <AgeRangeField v-model:from="ageRange.from" v-model:to="ageRange.to" />
                  <Button type="submit" icon="pi pi-check" :label="$t('save')" :loading="ageRange.saving" :disabled="ageRange.saving" />
                </form>
              </section>
            </TabPanel>

            <TabPanel value="security">
              <section class="profile-section">
                <div class="profile-section__head">
                  <h3><i class="pi pi-lock" />{{ $t("change_password") }}</h3>
                  <p>{{ $t("change_own_password_hint") }}</p>
                </div>
                <form class="profile-password-form" @submit.prevent="updatePassword">
                  <EmployeeField :label="$t('current_password')" for="profile-current-password" :error="passwordErrors.current_password">
                    <Password inputId="profile-current-password" v-model="passwordForm.current_password" toggleMask
                      :feedback="false" autocomplete="current-password" fluid :invalid="Boolean(passwordErrors.current_password)" />
                  </EmployeeField>
                  <EmployeeField :label="$t('new_password')" for="profile-new-password" :error="passwordErrors.password">
                    <Password inputId="profile-new-password" v-model="passwordForm.password" toggleMask
                      autocomplete="new-password" fluid :invalid="Boolean(passwordErrors.password)" />
                  </EmployeeField>
                  <EmployeeField :label="$t('confirm_password')" for="profile-password-confirmation"
                    :error="passwordMismatch ? $t('passwords_do_not_match') : ''">
                    <Password inputId="profile-password-confirmation" v-model="passwordForm.password_confirmation" toggleMask
                      :feedback="false" autocomplete="new-password" fluid :invalid="passwordMismatch" />
                  </EmployeeField>
                  <div class="profile-form-actions">
                    <Button type="submit" icon="pi pi-lock" :label="$t('change_password')" :loading="passwordLoading"
                      :disabled="!passwordForm.current_password || !passwordForm.password || passwordMismatch" />
                  </div>
                </form>
              </section>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-details__top h1 {
  margin: 0;
  color: var(--sawa-primary);
  font-size: 1.35rem;
  font-weight: 800;
}

.profile-details__top p {
  margin: 0.2rem 0 0;
  color: var(--sawa-muted);
}

.profile-skeleton {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
}

.profile-card {
  padding: 0.5rem 1rem 1rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.1rem 1.5rem;
  padding: 0.75rem 0.25rem 0;
}

.profile-form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid var(--sawa-border);
}

.profile-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0.75rem 0.25rem 0;
}

.profile-info > div {
  padding: 0.75rem 1rem;
  border: 1px solid var(--sawa-border);
  border-radius: 10px;
  background: rgb(var(--bp-fafcfc));
}

.profile-info dt {
  color: var(--sawa-muted);
  font-size: 0.78rem;
}

.profile-info dd {
  margin: 0.2rem 0 0;
  color: var(--sawa-text);
  font-weight: 600;
  overflow-wrap: anywhere;
}

[dir="rtl"] .profile-info dd[dir="ltr"] {
  text-align: right;
}

.profile-section {
  padding: 1rem 0.25rem;
}

.profile-section + .profile-section {
  border-top: 1px solid var(--sawa-border);
}

.profile-section__head h3 {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  color: var(--sawa-primary);
  font-size: 1.05rem;
  font-weight: 700;
}

.profile-section__head p {
  margin: 0.3rem 0 1rem;
  color: var(--sawa-muted);
}

.profile-inline-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: end;
}

.profile-password-form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;
}

@media (max-width: 900px) {
  .profile-password-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-grid,
  .profile-inline-form {
    grid-template-columns: 1fr;
  }
}
</style>
