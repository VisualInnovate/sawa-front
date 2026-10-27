<template>
  <div
    class="min-h-screen bg-gray-50 p-3 md:p-6"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- The result's approval by the management (pending / approved / rejected with the reason). -->
    <Toast />
    <ApprovalBanner ref="approvalBanner" :child-id="$route.params.child_id" :side-evaluation-id="$route.params.evaluation_id" @loaded="approval = $event" />
    <!-- Before approval the answers can still be edited (pending or rejected). -->
    <div v-if="approval && approval.status !== 'approved'" class="flex justify-end mb-3 print:hidden">
      <SideProfileAnswerEditor :result-id="approval.key.slice(1)" @saved="answersEdited" />
    </div>
    <!-- Header Section -->
    <header class="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div
        v-if="result[0]"
        class="flex flex-wrap items-center gap-2 text-xl font-bold text-gray-800"
      >
        <span class="text-blue-500">{{childName }}</span>
        <span class="text-gray-500">{{ locale === 'en' ? '/' : '\\' }}</span>
        <template v-if="sideProfileName">
          <span class="text-pink-500">{{ sideProfileName }}</span>
          <span class="text-gray-500">{{ locale === 'en' ? '/' : '\\' }}</span>
        </template>
        <span class="text-cyan-500">{{ result[0].evaluation_title }}</span>
      </div>

      <Button
        severity="primary"
        @click="goBack"
        rounded
        outlined
        class="inline-flex items-center gap-2 font-semibold">
        <i class="pi pi-arrow-left"></i>
        <span>{{ $t('back') }}</span>
      </Button>
    </header>

    <!-- Alert Message -->
    <Message
      v-if="alertText"
      :severity="alertType"
      class="mb-6 rounded-lg"
      @close="alertText = null"
    >
      {{ alertText }}
    </Message>

    <!-- Date filtering -->
    <div
      class="mb-6 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 rounded-xl bg-white p-5 shadow-sm"
    >
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-600">{{ $t('from') }}</label>
        <DatePicker
          v-model="from"
          @update:model-value="filter"
          dateFormat="dd/mm/yy"
          :placeholder="$t('from')"
          showIcon
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-600">{{ $t('to') }}</label>
        <DatePicker
          v-model="to"
          @update:model-value="filter"
          dateFormat="dd/mm/yy"
          :placeholder="$t('to')"
          showIcon
          class="w-full"
        />
      </div>
    </div>

    <!-- As in the printed report: the Side Profile sheet (a row per result, then the delay percentages chart). -->
    <div class="rxs-pages mb-6">
      <ResultSheet label="Side Profile" :band="false" :intro="false">
        <h2 class="rx-sp-title ltr">Side Profile</h2>
        <p class="rx-sp-child"><b>{{ childName }}</b></p>
        <SideProfileTable v-if="sheetTests.length" :tests="sheetTests" />
        <p v-else class="rx-empty">{{ loading ? $t('loading') : $t('no_data_available') }}</p>
      </ResultSheet>
    </div>

    <!-- Results Table Section -->
    <Card class="rounded-xl border-none shadow-md">
      <template #title>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-lg font-semibold">
            <i class="pi pi-table text-blue-500"></i>
            <span>{{ $t('evaluation_results') }}</span>
          </div>

          <div class="flex w-full flex-col items-stretch gap-4 md:w-auto md:flex-row md:items-center">
            <span class="relative">
              <i class="pi pi-search absolute top-1/2 -translate-y-1/2 rtl:right-3 ltr:left-3 text-gray-400"></i>
              <InputText
                v-model="search"
                :placeholder="$t('search')"
                class="w-full min-w-[220px] rounded-full ltr:pl-10 rtl:pr-10"
              />
            </span>

            <Button
              severity="success"
              @click="print"
              outlined
              rounded
              class="w-full justify-center md:w-auto">
              <i class="pi pi-print"></i>
              <span>{{ $t('print') }}</span>
            </Button>
          </div>
        </div>
      </template>
      <template #content>
        <div v-if="loading" class="flex flex-col items-center justify-center gap-4 p-12">
          <ProgressSpinner />
          <span class="text-gray-500">{{ $t('loading') }}</span>
        </div>

        <DataTable
          v-else
          :value="filteredResults"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5,10,25,50]"
          :loading="loading"
          class="w-full"
          breakpoint="960px"
          stripedRows
          removableSort
          :currentPageReportTemplate="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('entries')}`"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
          <Column field="id" :header="$t('id')" :sortable="true">
            <template #body="{ index }">
              <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                {{ index + 1 }}
              </span>
            </template>
          </Column>

          <Column field="therapist_name" :header="$t('therapist_name')" :sortable="true"></Column>

          <Column field="child_age" :header="$t('child_age')" :sortable="true">
            <template #body="{ data }">
              <span class="font-semibold">
                {{ data.child_age }} <span class="text-xs text-gray-500">{{ $t('months') }}</span>
              </span>
            </template>
          </Column>

          <Column field="grow_age" :header="$t('grow_age')" :sortable="true">
            <template #body="{ data }">
              <span class="inline-block rounded-lg bg-gray-100 px-2.5 py-1 font-semibold">{{ data.grow_age }}</span>
            </template>
          </Column>

          <Column field="diff_age" :header="$t('diff_age')" :sortable="true">
            <template #body="{ data }">
              <span class="inline-block rounded-lg bg-gray-100 px-2.5 py-1 font-semibold">{{ data.diff_age }}</span>
            </template>
          </Column>

          <Column field="basal_age" :header="$t('basal_age')" :sortable="true">
            <template #body="{ data }">
              <span class="font-semibold">
                {{ data.basal_age || 'N/A' }} <span class="text-xs text-gray-500">{{ $t('months') }}</span>
              </span>
            </template>
          </Column>

          <Column field="late_percentage" :header="$t('late_percentage')" :sortable="true">
            <template #body="{ data }">
              <div class="flex min-w-[140px] items-center gap-2">
                <span
                  class="w-[45px] font-bold"
                  :class="Math.round(data.late_percentage) >= 50 ? 'text-green-500' : 'text-red-500'"
                >
                  {{ Math.round(data.late_percentage) }}%
                </span>
                <ProgressBar
                  :value="Math.round(data.late_percentage)"
                  :showValue="false"
                  class="h-2 flex-1 rounded"
                  :class="Math.round(data.late_percentage) >= 50 ? 'progress-green' : 'progress-red'"
                />
              </div>
            </template>
          </Column>

          <Column field="result_created_at" :header="$t('created_at')" :sortable="true">
            <template #body="{ data }">
              <span class="font-mono">{{ formatDate(data.result_created_at) }}</span>
            </template>
          </Column>

          <Column :header="$t('operation')">
            <template #body="{ data }">
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                rounded
                @click="editItem(data.result_created_at, data.id)"
                v-tooltip.top="$t('edit_evaluation')" variant="outlined" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Edit Date Dialog -->
    <Dialog
      v-model:visible="visible"
      modal
      :header="$t('edit_evaluation_date')"
      class="w-full max-w-[450px]"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-600">{{ $t('evaluation_date') }}</label>
          <DatePicker
            v-model="examDate"
            dateFormat="dd/mm/yy"
            showIcon
            class="w-full"
            :class="{ 'p-invalid': formSubmitted && !examDate }"
          />
          <small v-if="formSubmitted && !examDate" class="p-error mt-1 block">
            {{ $t('date_required') }}
          </small>
        </div>

        <div class="mt-2 flex justify-end gap-3">
          <Button
            :label="$t('cancel')"
            severity="secondary"
            @click="visible = false"
            outlined />
          <Button
            :label="$t('save')"
            severity="primary"
            @click="submit" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import ApprovalBanner from "@/components/evaluations/ApprovalBanner.vue";
import ResultSheet from "@/components/reports/ResultSheet.vue";
import SideProfileTable from "@/components/reports/SideProfileTable.vue";
import SideProfileAnswerEditor from "@/components/evaluations/SideProfileAnswerEditor.vue";
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import moment from 'moment';

// PrimeVue Components
import Button from 'primevue/button';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import vTooltip from 'primevue/tooltip';

// Router & i18n Setup
const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

// Component State
const result = ref([]);
const alertText = ref(null);
const alertType = ref('success');
const from = ref(null);
const to = ref(null);
const search = ref('');
const visible = ref(false);
const examDate = ref(null);
const examId = ref('');
const loading = ref(true);
const sideProfileName = ref('');
const formSubmitted = ref(false);
const childName = ref('');
// The report's Side Profile rows, oldest first.
const sheetTests = computed(() => [...result.value]
  .sort((a, b) => String(a.result_created_at).localeCompare(String(b.result_created_at)))
  .map((row) => ({
    key: row.id,
    id: row.id,
    title: row.evaluation_title || sideProfileName.value,
    date: row.result_created_at,
    result: { child_age: row.child_age, grow_age: row.grow_age, diff_age: row.diff_age, late_percentage: row.late_percentage, created_at: row.result_created_at },
  })));

// Filtering Table Records
const filteredResults = computed(() => {
  if (!search.value) return result.value;
  return result.value.filter(item => {
    return Object.keys(item).some(key => {
      return String(item[key]).toLowerCase().includes(search.value.toLowerCase());
    });
  });
});
const getchildreen = async () => {
  try {
    const response = await axios.get(`/api/child/${route.params.child_id}`);
    childName.value = response.data.child.name;
  } catch (error) {
    console.error('Error fetching child data:', error);
    showAlert(t('failed_to_fetch_child_data'), 'error');
    return null;
  }
};

// API Actions
const getResults = async () => {
  try {
    loading.value = true;
    const response = await axios.post(
      `/api/evaluations/${route.params.child_id}/${route.params.sideProfile_id}/${route.params.evaluation_id}/result`,
      {
        date1: from.value ? moment(from.value).format('YYYY-MM-DD') : '',
        date2: to.value ? moment(to.value).format('YYYY-MM-DD') : ''
      }
    );
    result.value = response.data.resultEvaluation || [];
  } catch (error) {
    console.error('Error fetching results:', error);
    showAlert(t('failed_to_fetch_results'), 'error');
  } finally {
    loading.value = false;
  }
};

const getSideProfile = async () => {
  // 0 stands for an evaluation that is not linked to a side profile.
  if (!Number(route.params.sideProfile_id)) return;
  try {
    const response = await axios.get(`/api/side-profiles/${route.params.sideProfile_id}`);
    sideProfileName.value = response.data.sideProfile.title;
  } catch (error) {
    console.error('Error fetching side profile:', error);
  }
};

const filter = async () => {
  if (from.value && to.value && moment(to.value).isBefore(from.value)) {
    showAlert(t('invalid_date_range'), 'error');
    return;
  }
  await getResults();
};

const formatDate = (date) => {
  return moment(date).locale(locale.value).format('DD-MM-YYYY HH:mm');
};

const print = () => {
  const routeName = (from.value && to.value) ? 'printChildResult' : 'printChildResultfilter';
  const params = {
    child_id: route.params.child_id,
    sideProfile_id: route.params.sideProfile_id,
    evaluation_id: route.params.evaluation_id,
    ...(from.value && to.value && {
      start: moment(from.value).format('YYYY-MM-DD'),
      end: moment(to.value).format('YYYY-MM-DD')
    })
  };
  router.push({ name: routeName, params });
};

const editItem = (date, evaluationResultId) => {
  visible.value = true;
  examDate.value = new Date(date);
  examId.value = evaluationResultId;
  formSubmitted.value = false;
};

const submit = async () => {
  formSubmitted.value = true;
  if (!examDate.value) {
    showAlert(t('date_required'), 'error');
    return;
  }
  try {
    await axios.post(`/api/evaluations/${examId.value}`, {
      date: moment(examDate.value).format('YYYY-MM-DD'),
    });
    showAlert(t('evaluation_edited_successfully'), 'success');
    visible.value = false;
    await getResults();
  } catch (error) {
    showAlert(error.response?.data?.message || t('failed_to_edit_evaluation'), 'error');
    visible.value = false;
  }
};

const showAlert = (message, type) => {
  alertText.value = message;
  alertType.value = type;
  setTimeout(() => { alertText.value = null; }, 5000);
};

const goBack = () => { router.go(-1); };
const approval = ref(null);
const approvalBanner = ref(null);
// Edited answers: the results and the approval state are read again.
const answersEdited = () => {
  approvalBanner.value?.reload();
  getResults();
};

onMounted(async () => {
  await Promise.all([getResults(), getSideProfile(), getchildreen()]);
});
</script>

<style scoped>
/*
  Tailwind can't reach into PrimeVue's internal DOM (the ProgressBar's
  inner ".p-progressbar-value" div), so these two rules are the only
  CSS left in the component — everything else above uses Tailwind
  utility classes directly in the template.
*/
.progress-red :deep(.p-progressbar-value) {
  background-color: #ef4444;
}

.progress-green :deep(.p-progressbar-value) {
  background-color: #22c55e;
}
</style>