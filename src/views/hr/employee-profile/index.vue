<script setup>
// «ملف الموظف»: one employee (by user id, archived ones too) — the summary (data, contract, onboarding, documents,
// end of service), then a tab per part. Each tab shows to whoever may see its own page.
import axios from "axios";
import moment from "moment";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";
import EmployeeDocuments from "@/components/hr/profile/EmployeeDocuments.vue";
import EmployeeOnboarding from "@/components/hr/profile/EmployeeOnboarding.vue";
import EndOfServiceDialog from "@/components/hr/profile/EndOfServiceDialog.vue";
import ProfileAttendance from "@/components/hr/profile/ProfileAttendance.vue";
import ProfileLeaves from "@/components/hr/profile/ProfileLeaves.vue";
import ProfileMoney from "@/components/hr/profile/ProfileMoney.vue";
import PayrollFile from "@/components/hr/profile/PayrollFile.vue";
import HrLog from "@/views/hr/log/index.vue";
import { eosLineLabel, printSettlement } from "@/components/hr/profile/endOfService";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const userId = computed(() => Number(route.params.id));
const summary = ref(null);
const loading = ref(false);
const tab = ref(route.query.tab || "overview");
watch(tab, (value) => router.replace({ query: { ...route.query, tab: value === "overview" ? undefined : value } }));

async function load() {
  loading.value = true;
  try {
    summary.value = (await axios.get(`api/employee-profile/${userId.value}/summary`)).data.data;
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    loading.value = false;
  }
}
watch(userId, load, { immediate: true });

const employee = computed(() => summary.value?.employee);
const archived = computed(() => !!employee.value?.deleted_at);
const eos = computed(() => summary.value?.end_of_service);
const currency = computed(() => (summary.value?.profile?.currency_code === "SAR" ? t("vac.sar") : t("vac.jod")));
const activeContract = computed(() => summary.value?.contracts?.find((c) => c.status === "active"));
const date = (d) => (d ? moment(d).format("YYYY-MM-DD") : "—");
const money = (v) => (v == null ? "—" : `${Number(v).toLocaleString("en", { maximumFractionDigits: 2 })} ${currency.value}`);
const initials = computed(() => (employee.value?.name || "?").trim().slice(0, 1));
const ar = computed(() => locale.value === "ar");

const TYPES = { 1: "driver", 2: "doctor", 5: "Evaluator", 6: "أداري" };
const tabs = computed(() => [
  { value: "overview", label: t("prof.tab_overview"), icon: "pi pi-user" },
  can("employee documents list") && { value: "documents", label: t("prof.tab_documents"), icon: "pi pi-folder", badge: summary.value?.documents.expired + summary.value?.documents.expiring },
  can("onboarding list", "onboarding edit") && { value: "onboarding", label: t("prof.tab_onboarding"), icon: "pi pi-list-check" },
  can("attendance list") && { value: "attendance", label: t("prof.tab_attendance"), icon: "pi pi-clock" },
  can("leaves list", "leave balance list") && { value: "leaves", label: t("prof.tab_leaves"), icon: "pi pi-calendar" },
  can("payroll list", "financial advance list", "bonus list", "deduction list", "overtime list") && { value: "money", label: t("prof.tab_money"), icon: "pi pi-wallet" },
  can("hr log list") && { value: "log", label: t("prof.tab_log"), icon: "pi pi-history" },
].filter(Boolean));

const ending = ref(false);
function onEnded() {
  ending.value = false;
  toast.add({ severity: "success", summary: t("success_message"), detail: t("eos.saved"), life: 3000 });
  load();
}
const cancelling = ref(false);
async function cancelEnd() {
  try {
    await axios.post(`api/end-of-service/${eos.value.id}/cancel`);
    cancelling.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("eos.cancelled"), life: 3000 });
    load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  }
}
const print = () => printSettlement(t, { record: eos.value, employee: employee.value, locale: locale.value });

</script>

<template>
  <div class="flex flex-column gap-3 p-1">
    <Toast />
    <ProgressSpinner v-if="loading && !summary" class="w-3rem h-3rem" />

    <template v-if="employee">
      <!-- Header -->
      <div class="prof-head sawa-card">
        <Avatar :label="initials" size="xlarge" shape="circle" class="prof-avatar" />
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="m-0 text-xl font-bold">{{ employee.name }}</h1>
            <Tag v-if="archived" severity="secondary" icon="pi pi-box" :value="$t('prof.archived')" />
            <Tag v-else-if="eos?.status === 'scheduled'" severity="danger" icon="pi pi-sign-out" :value="$t('prof.leaving_on', { date: date(eos.last_day) })" />
            <Tag v-if="summary.onboarding && !employee.onboarded_at && !archived" severity="info" icon="pi pi-list-check"
              :value="$t('prof.onboarding_tag', { done: summary.onboarding.done, total: summary.onboarding.total })" />
            <Tag v-else-if="employee.onboarded_at" severity="success" icon="pi pi-check" :value="$t('prof.onboarded')" />
          </div>
          <p class="m-0 mt-1 text-color-secondary">
            {{ employee.job_title || employee.user?.title || "—" }}<template v-if="employee.department"> · {{ employee.department.title }}</template>
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button v-if="!archived && can('employees edit')" icon="pi pi-pencil" :label="$t('prof.edit_data')" outlined
            @click="router.push({ name: 'Employee-update', params: { id: employee.user_id } })" />
          <Button v-if="!archived && !eos && can('end of service create')" icon="pi pi-sign-out" :label="$t('eos.title')" severity="danger" outlined @click="ending = true" />
        </div>
      </div>

      <Tabs v-model:value="tab" scrollable>
        <TabList>
          <Tab v-for="x in tabs" :key="x.value" :value="x.value">
            <i :class="x.icon" class="me-2" />{{ x.label }}
            <Badge v-if="x.badge" :value="x.badge" severity="danger" class="ms-2" />
          </Tab>
        </TabList>
        <TabPanels class="px-0">
          <!-- Overview -->
          <TabPanel value="overview">
            <div class="prof-grid">
              <section class="sawa-card p-4">
                <p class="font-bold m-0 mb-3">{{ $t("prof.data") }}</p>
                <dl class="prof-dl">
                  <dt>{{ $t("prof.email") }}</dt><dd><bdi dir="ltr">{{ employee.email || "—" }}</bdi></dd>
                  <dt>{{ $t("prof.national_id") }}</dt><dd><bdi dir="ltr">{{ employee.national_id || "—" }}</bdi></dd>
                  <dt>{{ $t("prof.user_type") }}</dt><dd>{{ TYPES[employee.user?.type] ? $t(TYPES[employee.user.type]) : "—" }}</dd>
                  <dt>{{ $t("prof.role") }}</dt><dd>{{ employee.user?.roles?.map((r) => r.name).join("، ") || "—" }}</dd>
                  <dt>{{ $t("prof.department") }}</dt><dd>{{ employee.department?.title || "—" }}</dd>
                  <dt>{{ $t("prof.position") }}</dt><dd>{{ employee.position?.title || "—" }}</dd>
                  <dt>{{ $t("prof.shift") }}</dt><dd>{{ employee.shift?.title || "—" }}</dd>
                  <dt>{{ $t("prof.enrolled") }}</dt><dd><bdi dir="ltr">{{ date(employee.date_of_enrollment) }}</bdi></dd>
                  <dt>{{ $t("prof.birth") }}</dt><dd><bdi dir="ltr">{{ date(employee.date_of_birth) }}</bdi></dd>
                  <dt>{{ $t("prof.salary") }}</dt><dd>{{ money(employee.basic_salary) }}</dd>
                </dl>
              </section>

              <div class="flex flex-column gap-3">
                <section v-if="summary.contracts" class="sawa-card p-4">
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <p class="font-bold m-0">{{ $t("prof.contract") }}</p>
                    <Button :label="$t('prof.all_contracts', { n: summary.contracts.length })" text size="small" @click="router.push({ name: 'contracts', query: {} })" />
                  </div>
                  <template v-if="activeContract">
                    <div class="flex flex-wrap items-center gap-2">
                      <Tag severity="success" :value="$t('ctr.status_active')" />
                      <Tag v-for="a in activeContract.alerts" :key="a" :severity="a === 'expired' ? 'danger' : a === 'expiring' ? 'warn' : 'info'" :value="$t(`ctr.alert_${a}`)" />
                    </div>
                    <dl class="prof-dl mt-3">
                      <dt>{{ $t("ctr.job") }}</dt><dd>{{ ar ? activeContract.vacancy?.title_ar : activeContract.vacancy?.title_en || activeContract.vacancy?.title_ar }}</dd>
                      <dt>{{ $t("ctr.period") }}</dt>
                      <dd><bdi dir="ltr">{{ date(activeContract.start_date) }} → {{ activeContract.end_date ? date(activeContract.end_date) : "∞" }}</bdi></dd>
                      <dt>{{ $t("ctr.salary") }}</dt><dd>{{ money(activeContract.basic_salary) }}</dd>
                      <template v-if="activeContract.probation_end">
                        <dt>{{ $t("ctr.probation_days") }}</dt><dd><bdi dir="ltr">{{ date(activeContract.probation_end) }}</bdi></dd>
                      </template>
                    </dl>
                  </template>
                  <p v-else class="m-0 text-color-secondary">{{ $t("prof.no_contract") }}</p>
                </section>

                <PayrollFile :employee="employee" :summary="summary" :userId="userId" :archived="archived" @saved="load" />

                <section v-if="can('onboarding list', 'onboarding edit')" class="sawa-card p-4">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <p class="font-bold m-0">{{ $t("prof.tab_onboarding") }}</p>
                    <Button :label="$t('prof.open')" text size="small" @click="tab = 'onboarding'" />
                  </div>
                  <template v-if="summary.onboarding">
                    <ProgressBar :value="Math.round((summary.onboarding.done / summary.onboarding.total) * 100)" :showValue="false" style="height: 8px" />
                    <small class="text-color-secondary">{{ $t("onb.progress", summary.onboarding) }}</small>
                  </template>
                  <small v-else class="text-color-secondary">{{ $t("onb.none") }}</small>
                </section>

                <section v-if="can('employee documents list')" class="sawa-card p-4">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <p class="font-bold m-0">{{ $t("prof.tab_documents") }}</p>
                    <Button :label="$t('prof.open')" text size="small" @click="tab = 'documents'" />
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <Tag v-if="summary.documents.expired" severity="danger" :value="$t('prof.docs_expired', { n: summary.documents.expired })" />
                    <Tag v-if="summary.documents.expiring" severity="warn" :value="$t('prof.docs_expiring', { n: summary.documents.expiring })" />
                    <small v-if="!summary.documents.expired && !summary.documents.expiring" class="text-color-secondary">{{ $t("prof.docs_ok") }}</small>
                  </div>
                </section>

                <section v-if="eos" class="sawa-card p-4 prof-eos">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <p class="font-bold m-0">{{ $t("eos.title") }}</p>
                    <Tag :severity="eos.status === 'done' ? 'secondary' : 'danger'" :value="$t(`eos.status_${eos.status}`)" />
                  </div>
                  <dl class="prof-dl">
                    <dt>{{ $t("eos.type") }}</dt><dd>{{ $t(`eos.type_${eos.type}`) }}</dd>
                    <dt>{{ $t("eos.last_day") }}</dt><dd><bdi dir="ltr">{{ date(eos.last_day) }}</bdi></dd>
                    <template v-for="line in eos.lines?.items ?? []" :key="line.key">
                      <dt>{{ eosLineLabel(t, line) }}</dt><dd><bdi dir="ltr">{{ Number(line.amount).toLocaleString("en", { maximumFractionDigits: 2 }) }}</bdi></dd>
                    </template>
                    <dt class="font-bold">{{ $t("eos.total") }}</dt><dd class="font-bold">{{ money(eos.total) }}</dd>
                  </dl>
                  <small v-if="eos.notes" class="block mt-2 text-color-secondary">{{ eos.notes }}</small>
                  <div class="flex flex-wrap gap-2 mt-3">
                    <Button icon="pi pi-print" :label="$t('eos.print')" outlined size="small" @click="print" />
                    <Button v-if="eos.status === 'scheduled' && can('end of service delete')" icon="pi pi-undo" :label="$t('eos.cancel')" severity="secondary" outlined size="small"
                      @click="cancelling = true" />
                  </div>
                </section>
              </div>
            </div>
          </TabPanel>

          <TabPanel v-if="can('employee documents list')" value="documents">
            <EmployeeDocuments v-if="tab === 'documents'" :employeeId="employee.id" :archived="archived" @changed="load" />
          </TabPanel>
          <TabPanel v-if="can('onboarding list', 'onboarding edit')" value="onboarding">
            <EmployeeOnboarding v-if="tab === 'onboarding'" :employeeId="employee.id" :startDate="employee.date_of_enrollment" :archived="archived" @changed="load" />
          </TabPanel>
          <TabPanel v-if="can('attendance list')" value="attendance">
            <ProfileAttendance v-if="tab === 'attendance'" :userId="userId" />
          </TabPanel>
          <TabPanel v-if="can('leaves list', 'leave balance list')" value="leaves">
            <ProfileLeaves v-if="tab === 'leaves'" :userId="userId" />
          </TabPanel>
          <TabPanel v-if="can('payroll list', 'financial advance list', 'bonus list', 'deduction list', 'overtime list')" value="money">
            <ProfileMoney v-if="tab === 'money'" :userId="userId" />
          </TabPanel>
          <TabPanel v-if="can('hr log list')" value="log">
            <HrLog v-if="tab === 'log'" :employeeId="employee.id" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </template>

    <EndOfServiceDialog v-if="ending" :employee="employee" @close="ending = false" @saved="onEnded" />
    <Dialog :visible="cancelling" modal :header="$t('eos.cancel')" :style="{ width: '440px' }" @update:visible="cancelling = false">
      <p class="m-0">{{ $t("eos.cancel_confirm") }}</p>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="cancelling = false" />
        <Button icon="pi pi-undo" :label="$t('eos.cancel')" @click="cancelEnd" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.prof-head { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; padding: 1.1rem 1.25rem; }
.prof-avatar { background: color-mix(in srgb, var(--p-primary-color) 14%, transparent); color: var(--p-primary-color); font-weight: 800; }
.prof-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 1rem; align-items: start; }
@media (max-width: 900px) { .prof-grid { grid-template-columns: minmax(0, 1fr); } }
.prof-dl { display: grid; grid-template-columns: max-content 1fr; gap: 0.55rem 1.25rem; margin: 0; }
.prof-dl dt { color: var(--p-text-muted-color); font-size: 0.9rem; }
.prof-dl dd { margin: 0; font-weight: 500; overflow-wrap: anywhere; }
.prof-eos { border-color: color-mix(in srgb, #ef4444 35%, transparent); }
</style>
