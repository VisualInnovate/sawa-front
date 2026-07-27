<template>
  <div class="evaluation-results-container">
    <!-- Header Section -->
    <header class="header-section">
      <div class="page-title" v-if="result[0] && sideProfileName">
        <span class="child-name">{{ result[0].child_name }}</span>
        <span class="separator" :class="locale">{{ locale === 'en' ? '/' : '\\' }}</span>
        <span class="profile-name">{{ sideProfileName }}</span>
        <span class="separator" :class="locale">{{ locale === 'en' ? '/' : '\\' }}</span>
        <span class="evaluation-title">{{ result[0].evaluation_title }}</span>
      </div>

      <Button 
        class="back-button" 
        severity="primary" 
        @click="goBack"
        rounded
        outlined
      >
        <i class="pi pi-arrow-left"></i>
        <span class="button-text">{{ $t('back') }}</span>
      </Button>
    </header>

    <!-- Alert Message -->
    <Message 
      v-if="alertText" 
      :severity="alertType" 
      class="alert-message"
      @close="alertText = null"
    >
      {{ alertText }}
    </Message>

    <!-- Controls Container (Chart Controls + Date Filtering) -->
    <div class="controls-wrapper">
      <div class="control-group">
        <label class="control-label">{{ $t('chart_type') }}</label>
        <Dropdown
          v-model="selectedChartType"
          :options="chartTypes"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('select_chart_type')"
          class="w-full"
        />
      </div>

      <div class="control-group" v-if="!isNonCartesianChart">
        <label class="control-label">{{ $t('xAxis') }}</label>
        <Dropdown
          v-model="selectX"
          :options="firstSelectBoxComputed"
          optionLabel="title"
          optionValue="value"
          :placeholder="$t('xAxis')"
          class="w-full"
        />
      </div>

      <div class="control-group" v-if="!isNonCartesianChart">
        <label class="control-label">{{ $t('yAxis') }}</label>
        <Dropdown
          v-model="selectY"
          :options="secondSelectBoxComputed"
          optionLabel="title"
          optionValue="value"
          :placeholder="$t('yAxis')"
          class="w-full"
        />
      </div>

      <div class="control-group">
        <label class="control-label">{{ $t('from') }}</label>
        <Calendar 
          v-model="from" 
          @update:model-value="filter"
          dateFormat="dd/mm/yy"
          :placeholder="$t('from')"
          showIcon
          class="w-full"
        />
      </div>

      <div class="control-group">
        <label class="control-label">{{ $t('to') }}</label>
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
    <Card class="chart-card">
      <template #title>
        <div class="chart-title">
          <i class="pi pi-chart-bar"></i>
          <span>{{ $t('evaluation_results_visualization') }}</span>
        </div>
      </template>
      <template #content>
        <div class="chart-wrapper">
          <Chart 
            v-if="result.length > 0"
            :type="selectedChartType" 
            :data="chartData" 
            :options="chartOptions" 
            class="main-chart"
            :aria-label="$t('evaluation_results_chart')"
          />
          <div v-else class="no-results">
            <i class="pi pi-info-circle"></i>
            <span>{{ $t('no_data_available') }}</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Results Table Section -->
    <Card class="results-card">
      <template #title>
        <div class="results-header">
          <div class="results-title">
            <i class="pi pi-table"></i>
            <span>{{ $t('evaluation_results') }}</span>
          </div>
          
          <div class="results-actions">
            <span class="p-input-icon-left search-box">
              <i class="pi pi-search"></i>
              <InputText 
                v-model="search" 
                :placeholder="$t('search')"
                class="search-input"
              />
            </span>
            
            <Button 
              severity="success" 
              @click="print"
              class="print-button"
              outlined
              rounded
            >
              <i class="pi pi-print"></i>
              <span class="button-text">{{ $t('print') }}</span>
            </Button>
          </div>
        </div>
      </template>
      <template #content>
        <div v-if="loading" class="loading-overlay">
          <ProgressSpinner />
          <span class="loading-text">{{ $t('loading') }}</span>
        </div>
        
        <DataTable
          v-else
          :value="filteredResults"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5,10,25,50]"
          :loading="loading"
          class="results-table"
          responsiveLayout="stack"
          breakpoint="960px"
          stripedRows
          removableSort
          :currentPageReportTemplate="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('entries')}`"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
          <Column field="id" :header="$t('id')" :sortable="true" class="id-column">
            <template #body="{ index }">
              <span class="index-badge">{{ index + 1 }}</span>
            </template>
          </Column>
          
          <Column field="therapist_name" :header="$t('therapist_name')" :sortable="true" class="therapist-column"></Column>
          
          <Column field="child_age" :header="$t('child_age')" :sortable="true" class="age-column">
            <template #body="{ data }">
              <span class="age-value">{{ data.child_age }} <span class="unit">{{ $t('months') }}</span></span>
            </template>
          </Column>
          
          <Column field="grow_age" :header="$t('grow_age')" :sortable="true" class="grow-column">
            <template #body="{ data }">
              <span class="value-badge">{{ data.grow_age }}</span>
            </template>
          </Column>

          <Column field="diff_age" :header="$t('diff_age')" :sortable="true" class="diff-column">
            <template #body="{ data }">
              <span class="value-badge">{{ data.diff_age }}</span>
            </template>
          </Column>

          <Column field="basal_age" :header="$t('basal_age')" :sortable="true" class="basal-column">
            <template #body="{ data }">
              <span class="age-value">{{ data.basal_age || 'N/A' }} <span class="unit">{{ $t('months') }}</span></span>
            </template>
          </Column>

          <Column field="late_percentage" :header="$t('late_percentage')" :sortable="true" class="percentage-column">
            <template #body="{ data }">
              <div class="percentage-container">
                <span 
                  class="percentage-value" 
                  :class="Math.round(data.late_percentage) >= 50 ? 'text-green' : 'text-red'"
                >
                  {{ Math.round(data.late_percentage) }}%
                </span>
                <ProgressBar 
                  :value="Math.round(data.late_percentage)" 
                  :showValue="false"
                  class="percentage-bar"
                  :class="Math.round(data.late_percentage) >= 50 ? 'above-50' : 'below-50'"
                />
              </div>
            </template>
          </Column>

          <Column field="result_created_at" :header="$t('created_at')" :sortable="true" class="date-column">
            <template #body="{ data }">
              <span class="date-value">{{ formatDate(data.result_created_at) }}</span>
            </template>
          </Column>

          <Column :header="$t('operation')" class="action-column">
            <template #body="{ data }">
              <Button 
                icon="pi pi-pencil" 
                severity="info" 
                text 
                rounded 
                @click="editItem(data.result_created_at, data.id)"
                class="edit-button"
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
      class="edit-dialog"
      :style="{ width: '100%', maxWidth: '450px' }"
    >
      <div class="edit-form">
        <div class="field">
          <label class="control-label mb-2 block">{{ $t('evaluation_date') }}</label>
          <Calendar 
            v-model="examDate" 
            dateFormat="dd/mm/yy" 
            showIcon 
            class="w-full"
            :class="{ 'p-invalid': formSubmitted && !examDate }"
          />
          <small v-if="formSubmitted && !examDate" class="p-error block mt-1">
            {{ $t('date_required') }}
          </small>
        </div>

        <div class="form-actions">
          <Button 
            :label="$t('cancel')" 
            severity="secondary" 
            @click="visible = false" 
            class="cancel-button"
            outlined
          />
          <Button 
            :label="$t('save')" 
            severity="primary" 
            @click="submit" 
            class="submit-button"
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

// Build Chart Datasets
const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  if (isNonCartesianChart.value) {
    return {
      labels: createdAt.value,
      datasets: [{
        data: latePercentages.value.map(val => val ?? 0),
        backgroundColor: [
          '#66BB6A', '#EF5350', '#42A5F5', '#FFCA28', '#AB47BC', '#26A69A'
        ],
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
  await Promise.all([getResults(), getSideProfile()]);
});

watch([selectedChartType, selectX, selectY, locale], () => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
</script>

<style scoped>
/* Main Layout Container */
.evaluation-results-container {
  padding: 1.5rem;
  background-color: var(--surface-ground, #f8f9fa);
  min-height: 100vh;
  direction: v-bind('locale === "ar" ? "rtl" : "ltr"');
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color, #333);
  flex-wrap: wrap;
}

.page-title .child-name { color: var(--primary-500, #3B82F6); }
.page-title .profile-name { color: var(--pink-500, #EC4899); }
.page-title .evaluation-title { color: var(--cyan-500, #06B6D4); }
.page-title .separator { color: var(--text-color-secondary, #6c757d); }

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

/* Alerts */
.alert-message {
  margin-bottom: 1.5rem;
  border-radius: 8px;
}

/* Dynamic CSS Grid Controls Area */
.controls-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: var(--surface-card, #ffffff);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.control-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color-secondary, #4b5563);
}

/* Charts Section */
.chart-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  border: none;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.15rem;
  font-weight: 600;
}

.chart-title .pi { color: var(--primary-500, #3B82F6); }

.chart-wrapper {
  position: relative;
  width: 100%;
  height: clamp(300px, 50vh, 500px);
}

.main-chart {
  width: 100%;
  height: 100%;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color-secondary, #6c757d);
  gap: 0.5rem;
}

.no-results .pi { font-size: 2.5rem; }

/* Table Container & Header */
.results-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.15rem;
  font-weight: 600;
}

.results-title .pi { color: var(--primary-500, #3B82F6); }

.results-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
}

.search-input {
  border-radius: 20px;
  padding-left: 2.5rem;
  min-width: 220px;
}

/* Responsive Table Elements */
.results-table {
  width: 100%;
}

.index-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--surface-ground, #f3f4f6);
  font-weight: 600;
  font-size: 0.85rem;
}

.value-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  background-color: var(--surface-ground, #f3f4f6);
  font-weight: 600;
}

.age-value { font-weight: 600; }
.age-value .unit {
  font-size: 0.75rem;
  color: var(--text-color-secondary, #6c757d);
}

/* Percentage Styling Rule (<50% Red, >=50% Green) */
.percentage-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 140px;
}

.percentage-value {
  font-weight: 700;
  width: 45px;
}

.percentage-value.text-red {
  color: #ef4444;
}

.percentage-value.text-green {
  color: #22c55e;
}

.percentage-bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
}

.percentage-bar.below-50 :deep(.p-progressbar-value) {
  background-color: #ef4444;
}

.percentage-bar.above-50 :deep(.p-progressbar-value) {
  background-color: #22c55e;
}

.date-value { font-family: monospace; }

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* Mobile Responsiveness Rules */
@media (max-width: 768px) {
  .evaluation-results-container {
    padding: 0.75rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .results-header, .results-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .print-button {
    width: 100%;
    justify-content: center;
  }

  .chart-wrapper {
    height: 320px;
  }
}
</style>