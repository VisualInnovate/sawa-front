<template>
  <div
    class="min-h-screen bg-gray-50 p-3 md:p-6"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- Header Section -->
    <header class="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div
        v-if="result[0] && sideProfileName"
        class="flex flex-wrap items-center gap-2 text-xl font-bold text-gray-800"
      >
        <span class="text-blue-500">{{childName }}</span>
        <span class="text-gray-500">{{ locale === 'en' ? '/' : '\\' }}</span>
        <span class="text-pink-500">{{ sideProfileName }}</span>
        <span class="text-gray-500">{{ locale === 'en' ? '/' : '\\' }}</span>
        <span class="text-cyan-500">{{ result[0].evaluation_title }}</span>
      </div>

      <Button
        severity="primary"
        @click="goBack"
        rounded
        outlined
        class="inline-flex items-center gap-2 font-semibold"
      >
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

    <!-- Controls Container (Chart Controls + Date Filtering) -->
    <div
      class="mb-6 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 rounded-xl bg-white p-5 shadow-sm"
    >
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-600">{{ $t('chart_type') }}</label>
        <Dropdown
          v-model="selectedChartType"
          :options="chartTypes"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('select_chart_type')"
          class="w-full"
        />
      </div>

      <div v-if="!isNonCartesianChart" class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-600">{{ $t('xAxis') }}</label>
        <Dropdown
          v-model="selectX"
          :options="firstSelectBoxComputed"
          optionLabel="title"
          optionValue="value"
          :placeholder="$t('xAxis')"
          class="w-full"
        />
      </div>

      <div v-if="!isNonCartesianChart" class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-600">{{ $t('yAxis') }}</label>
        <Dropdown
          v-model="selectY"
          :options="secondSelectBoxComputed"
          optionLabel="title"
          optionValue="value"
          :placeholder="$t('yAxis')"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-600">{{ $t('from') }}</label>
        <Calendar
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
        <Calendar
          v-model="to"
          @update:model-value="filter"
          dateFormat="dd/mm/yy"
          :placeholder="$t('to')"
          showIcon
          class="w-full"
        />
      </div>
    </div>

    <!-- Main Chart -->
    <Card class="mb-6 overflow-hidden h-auto rounded-xl border-none shadow-md">
      <template #title>
        <div class="flex items-center gap-2 text-lg font-semibold">
          <i class="pi pi-chart-bar text-blue-500"></i>
          <span>{{ $t('evaluation_results_visualization') }}</span>
        </div>
      </template>
      <template #content>
        <!-- Custom scrollable legend for pie/doughnut/polarArea charts, which -->
        <!-- otherwise render one legend swatch per data point and can overflow -->
        <!-- the card when there are many entries. -->
        <div
          v-if="isNonCartesianChart && legendItems.length"
          class="mb-3 flex max-h-24 flex-wrap gap-x-4 gap-y-2 overflow-y-auto rounded-lg bg-gray-50 p-2.5"
        >
          <div
            v-for="(item, i) in legendItems"
            :key="i"
            class="flex items-center gap-1.5 text-xs text-gray-600"
          >
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: item.color }"></span>
            <span>{{ item.label }}</span>
          </div>
        </div>

        <div
          class="relative w-full"
          :class="isNonCartesianChart && legendItems.length
            ? 'h-72 md:h-[clamp(220px,38vh,420px)]'
            : 'h-96 md:h-[clamp(300px,50vh,500px)]'"
        >
          <Chart
            v-if="result.length > 0"
            :type="selectedChartType"
            :data="chartData"
            :options="chartOptions"
            class="h-full w-full"
            :aria-label="$t('evaluation_results_chart')"
          />
          <div v-else class="flex h-full flex-col items-center justify-center gap-2 text-gray-500">
            <i class="pi pi-info-circle text-4xl"></i>
            <span>{{ $t('no_data_available') }}</span>
          </div>
        </div>
      </template>
    </Card>

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
              class="w-full justify-center md:w-auto"
            >
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
          responsiveLayout="stack"
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
                v-tooltip.top="$t('edit_evaluation')"
              />
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
          <Calendar
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
            outlined
          />
          <Button
            :label="$t('save')"
            severity="primary"
            @click="submit"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import moment from 'moment';

// PrimeVue Components
import Button from 'primevue/button';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
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
const createdAt = ref([]);
const latePercentages = ref([]);
const growAge = ref([]);
const diffAge = ref([]);
const from = ref(null);
const to = ref(null);
const selectedChartType = ref('bar');
const selectX = ref('createdAt');
const selectY = ref('latePercentage');
const chartData = ref({});
const chartOptions = ref({});
const search = ref('');
const visible = ref(false);
const examDate = ref(null);
const examId = ref('');
const loading = ref(true);
const sideProfileName = ref('');
const formSubmitted = ref(false);
const childName = ref('');
// Dynamic Chart Select Options
const chartTypes = computed(() => [
  { label: t('bar_chart'), value: 'bar' },
  { label: t('line_chart'), value: 'line' },
  { label: t('pie_chart'), value: 'pie' },
  { label: t('doughnut_chart'), value: 'doughnut' },
  { label: t('polar_area_chart'), value: 'polarArea' },
  { label: t('radar_chart'), value: 'radar' },
]);

const axisOptions = computed(() => [
  { title: t('created_at'), value: 'createdAt' },
  { title: t('grow_age'), value: 'growAge' },
  { title: t('diff_age'), value: 'diffAge' },
  { title: t('late_percentage'), value: 'latePercentage' },
]);

const isNonCartesianChart = computed(() =>
  ['pie', 'doughnut', 'polarArea'].includes(selectedChartType.value)
);

const legendColors = ['#66BB6A', '#EF5350', '#42A5F5', '#FFCA28', '#AB47BC', '#26A69A'];

// Drives the custom scrollable legend rendered above the chart for
// pie/doughnut/polarArea types, replacing Chart.js's built-in legend
// (which renders one swatch per data point and can't be constrained).
const legendItems = computed(() => {
  if (!isNonCartesianChart.value) return [];
  return createdAt.value.map((label, i) => ({
    label,
    color: legendColors[i % legendColors.length]
  }));
});

const firstSelectBoxComputed = computed(() =>
  axisOptions.value.filter(item => item.value !== selectY.value)
);

const secondSelectBoxComputed = computed(() =>
  axisOptions.value.filter(item => item.value !== selectX.value)
);

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

// Build Chart Datasets
const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  if (isNonCartesianChart.value) {
    return {
      labels: createdAt.value,
      datasets: [{
        data: latePercentages.value.map(val => val ?? 0),
        backgroundColor: legendColors,
        borderColor: documentStyle.getPropertyValue('--surface-border') || '#e5e7eb',
        borderWidth: 1
      }]
    };
  }

  if (selectX.value && selectY.value) {
    const xDataMap = { growAge: growAge.value, diffAge: diffAge.value, [t('late_percentage')]: latePercentages.value, createdAt: createdAt.value };
    const yDataMap = { growAge: growAge.value, diffAge: diffAge.value, [t('late_percentage')]: latePercentages.value };

    const xData = xDataMap[selectX.value] || createdAt.value;
    const yData = yDataMap[selectY.value] || latePercentages.value;

    return {
      labels: xData,
      datasets: [{
        label: t(selectY.value),
        data: yData.map(v => v ?? 0),
        backgroundColor: '#42A5F5',
        borderColor: '#1565C0',
        pointRadius: 4,
        tension: 0.3,
        fill: selectedChartType.value === 'line' || selectedChartType.value === 'radar'
      }]
    };
  }

  return {
    labels: createdAt.value,
    datasets: [
      {
        label: t('late_percentage'),
        backgroundColor: '#66BB6A',
        borderColor: '#388E3C',
        data: latePercentages.value.map(val => val ?? 0),
        tension: 0.3
      },
      {
        label: t('diff_age'),
        backgroundColor: '#EF5350',
        borderColor: '#D32F2F',
        data: diffAge.value.map(val => val ?? 0),
        tension: 0.3
      },
      {
        label: t('grow_age'),
        backgroundColor: '#42A5F5',
        borderColor: '#1565C0',
        data: growAge.value.map(val => val ?? 0),
        tension: 0.3
      }
    ]
  };
};

// Build Chart Display Config Options
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !isNonCartesianChart.value,
        position: 'top',
        labels: { color: textColor, font: { weight: '600' } }
      },
      tooltip: {
        padding: 10,
        usePointStyle: true
      }
    }
  };

  if (!isNonCartesianChart.value && selectedChartType.value !== 'radar') {
    baseOptions.scales = {
      x: {
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder, drawBorder: false },
        title: { display: true, text: t(selectX.value), color: textColor, font: { weight: 'bold' } }
      },
      y: {
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder, drawBorder: false },
        title: { display: true, text: t(selectY.value), color: textColor, font: { weight: 'bold' } }
      }
    };
  }

  return baseOptions;
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

    createdAt.value = [];
    latePercentages.value = [];
    growAge.value = [];
    diffAge.value = [];

    result.value.forEach((elem) => {
      createdAt.value.push(moment(elem.result_created_at).format('MM-DD-YYYY'));
      latePercentages.value.push(parseFloat(elem.late_percentage) || 0);
      growAge.value.push(parseInt(elem.grow_age) || 0);
      diffAge.value.push(parseInt(elem.diff_age) || 0);
    });

    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  } catch (error) {
    console.error('Error fetching results:', error);
    showAlert(t('failed_to_fetch_results'), 'error');
  } finally {
    loading.value = false;
  }
};

const getSideProfile = async () => {
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

onMounted(async () => {
  await Promise.all([getResults(), getSideProfile(), getchildreen()]);
});

watch([selectedChartType, selectX, selectY, locale], () => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
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