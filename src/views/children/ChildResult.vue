<template>
  <div class="evaluation-results-container">
    <!-- Header Section -->
    <div class="header-section">
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
    </div>

    <!-- Alert Message -->
    <Message 
      v-if="alertText" 
      :severity="alertType" 
      class="alert-message"
      @close="alertText = null"
    >
      {{ alertText }}
    </Message>

    <!-- Chart Controls -->
    <div class="chart-controls">
      <div class="chart-type-selector">
        <Dropdown
          v-model="selectedChartType"
          :options="chartTypes"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('select_chart_type')"
          class="chart-dropdown"
          :pt="{
            root: { class: 'dropdown-root' },
            input: { class: 'dropdown-input' },
            panel: { class: 'dropdown-panel' }
          }"
        />
      </div>

      <div class="axis-selectors">
        <div class="axis-selector">
          <span class="p-float-label">
            <Dropdown
              v-model="selectX"
              :options="firstSelectBoxComputed"
              optionLabel="title"
              optionValue="value"
              :placeholder="$t('xAxis')"
              class="chart-dropdown"
              :pt="{
                root: { class: 'dropdown-root' },
                input: { class: 'dropdown-input' },
                panel: { class: 'dropdown-panel' }
              }"
            />
            <label>{{ $t('xAxis') }}</label>
          </span>
        </div>
        <div class="axis-selector">
          <span class="p-float-label">
            <Dropdown
              v-model="selectY"
              :options="secondSelectBoxComputed"
              optionLabel="title"
              optionValue="value"
              :placeholder="$t('yAxis')"
              class="chart-dropdown"
              :pt="{
                root: { class: 'dropdown-root' },
                input: { class: 'dropdown-input' },
                panel: { class: 'dropdown-panel' }
              }"
            />
            <label>{{ $t('yAxis') }}</label>
          </span>
        </div>
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
        <div class="chart-container">
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
  <div>
      <div class="flex gap-4 pb-2">
        <div class="">
          <span class="">
            <Calendar 
              v-model="from" 
              @update:model-value="filter"
              dateFormat="dd/mm/yy"
              :placeholder='$t("from")'
              
              class="date-picker"
            />
          </span>
        </div>
        <div class="">
          <span class="">
            <Calendar 
              v-model="to" 
              @update:model-value="filter"
              dateFormat="dd/mm/yy"
              
              :placeholder='$t("to")'
              class="date-picker"
            />
          </span>
        </div>
      </div>
      </div>
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
          :globalFilterFields="['therapist_name', 'child_age', 'grow_age', 'diff_age', 'basal_age', 'late_percentage', 'result_created_at']"
          v-model:filters="filters"
          class="results-table"
          stripedRows
          removableSort
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
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
                <span class="percentage-value">{{ Math.round(data.late_percentage) }}%</span>
                <ProgressBar 
                  :value="Math.round(data.late_percentage)" 
                  :showValue="false"
                  class="percentage-bar"
                  :class="{
                    'low': Math.round(data.late_percentage) < 30,
                    'medium': Math.round(data.late_percentage) >= 30 && Math.round(data.late_percentage) < 70,
                    'high': Math.round(data.late_percentage) >= 70
                  }"
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

    <!-- Edit Dialog -->
    <Dialog 
      v-model:visible="visible" 
      modal 
      :header="$t('edit_evaluation_date')" 
      class="edit-dialog"
      :style="{ width: '450px' }"
    >
      <div class="edit-form">
        <div class="field">
          <span class="p-float-label">
            <Calendar 
              v-model="examDate" 
              dateFormat="dd/mm/yy" 
              showIcon 
              class="edit-date-picker"
              :class="{ 'p-invalid': formSubmitted && !examDate }"
            />
            <label>{{ $t('evaluation_date') }}</label>
          </span>
          <small v-if="formSubmitted && !examDate" class="p-error">
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
import Tooltip from 'primevue/tooltip';

// Vue Router and i18n
const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

// Reactive state
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
const filters = ref({ global: { value: null, matchMode: 'contains' } });
const visible = ref(false);
const examDate = ref(null);
const examId = ref('');
const loading = ref(true);
const sideProfileName = ref('');
const formSubmitted = ref(false);

// Chart types for dropdown
const chartTypes = computed(() => [
  { label: t('bar_chart'), value: 'bar' },
  { label: t('line_chart'), value: 'line' },
  { label: t('pie_chart'), value: 'pie' },
  { label: t('doughnut_chart'), value: 'doughnut' },
  { label: t('polar_area_chart'), value: 'polarArea' },
  { label: t('radar_chart'), value: 'radar' },
]);

// Axis selection options
const axisOptions = computed(() => [
  { title: t('created_at'), value: 'createdAt' },
  { title: t('grow_age'), value: 'growAge' },
  { title: t('diff_age'), value: 'diffAge' },
  { title: t('late_percentage'), value: 'latePercentage' },
]);

// Computed properties for dropdowns
const firstSelectBoxComputed = computed(() =>
  axisOptions.value.filter(item => item.value !== selectY.value)
);

const secondSelectBoxComputed = computed(() =>
  axisOptions.value.filter(item => item.value !== selectX.value)
);

// Computed filtered results
const filteredResults = computed(() => {
  if (!search.value) return result.value;
  return result.value.filter(item => {
    return Object.keys(item).some(key => {
      return String(item[key]).toLowerCase().includes(search.value.toLowerCase());
    });
  });
});

// Set chart data
const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const isNonCartesian = ['pie', 'doughnut', 'polarArea'].includes(selectedChartType.value);

  if (isNonCartesian) {
    return {
      labels: createdAt.value,
      datasets: [{
        data: latePercentages.value.map(val => val ?? 0),
        backgroundColor: [
          '#66BB6A', // Green
          '#EF5350', // Red
          '#42A5F5', // Blue
          '#FFCA28', // Yellow
          '#AB47BC', // Purple
          '#26A69A'  // Teal
        ],
        borderColor: documentStyle.getPropertyValue('--surface-border'),
        borderWidth: 1
      }]
    };
  }

  if (selectX.value && selectY.value) {
    const xDataMap = {
      growAge: growAge.value,
      diffAge: diffAge.value,
      latePercentage: latePercentages.value,
      createdAt: createdAt.value
    };
    const yDataMap = {
      growAge: growAge.value,
      diffAge: diffAge.value,
      latePercentage: latePercentages.value
    };

    const xData = xDataMap[selectX.value] || createdAt.value;
    const yData = yDataMap[selectY.value] || latePercentages.value;

    const dataPoints = xData.map((x, index) => ({
      x: x ?? 0,
      y: yData[index] ?? 0
    }));

    return {
      labels: xData,
      datasets: [{
        label: t(selectY.value),
        data: dataPoints,
        backgroundColor: '#42A5F5',
        borderColor: '#1565C0',
        pointRadius: selectedChartType.value === 'scatter' ? 5 : 0,
        pointHoverRadius: 7,
        showLine: selectedChartType.value === 'line' || selectedChartType.value === 'radar',
        fill: selectedChartType.value === 'line' || selectedChartType.value === 'radar',
        tension: 0.3
      }]
    };
  }

  // Default: All datasets with createdAt as X-axis
  return {
    labels: createdAt.value,
    datasets: [
      {
        label: t('late_percentage'),
        backgroundColor: '#66BB6A',
        borderColor: '#388E3C',
        data: latePercentages.value.map(val => val ?? 0),
        fill: selectedChartType.value === 'line' || selectedChartType.value === 'radar',
        tension: 0.3
      },
      {
        label: t('diff_age'),
        backgroundColor: '#EF5350',
        borderColor: '#D32F2F',
        data: diffAge.value.map(val => val ?? 0),
        fill: selectedChartType.value === 'line' || selectedChartType.value === 'radar',
        tension: 0.3
      },
      {
        label: t('grow_age'),
        backgroundColor: '#42A5F5',
        borderColor: '#1565C0',
        data: growAge.value.map(val => val ?? 0),
        fill: selectedChartType.value === 'line' || selectedChartType.value === 'radar',
        tension: 0.3
      }
    ]
  };
};

// Set chart options
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  const xAxisTitle = selectX.value ? t(selectX.value) : t('created_at');
  const yAxisTitle = selectY.value ? t(selectY.value) : t('values');

  const baseOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: '#424242',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: surfaceBorder,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            const value = context.parsed.y !== undefined ? context.parsed.y : context.parsed;
            return `${label}${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: textColorSecondary, font: { weight: 'bold' } },
        grid: { color: surfaceBorder, drawBorder: false },
        title: {
          display: true,
          text: xAxisTitle,
          color: textColor,
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        ticks: { color: textColorSecondary, font: { weight: 'bold' } },
        grid: { color: surfaceBorder, drawBorder: false },
        title: {
          display: true,
          text: yAxisTitle,
          color: textColor,
          font: { size: 14, weight: 'bold' }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad'
    },
    elements: {
      point: { radius: 4, hoverRadius: 6, borderWidth: 2 },
      line: { tension: 0.3, borderWidth: 2 },
      bar: { borderRadius: 6, borderWidth: 0, borderSkipped: false }
    }
  };

  if (['pie', 'doughnut', 'polarArea', 'radar'].includes(selectedChartType.value)) {
    delete baseOptions.scales;
    if (selectedChartType.value === 'polarArea') {
      baseOptions.scale = {
        ticks: { display: false },
        grid: { circular: true }
      };
    }
    if (selectedChartType.value === 'radar') {
      baseOptions.scales = {
        r: {
          angleLines: { display: true, color: surfaceBorder },
          suggestedMin: 0,
          ticks: { display: false },
          grid: { circular: true, color: surfaceBorder }
        }
      };
    }
  }

  return baseOptions;
};

// Fetch evaluation results
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
    result.value = response.data.resultEvaluation;
    
    // Reset data arrays
    createdAt.value = [];
    latePercentages.value = [];
    growAge.value = [];
    diffAge.value = [];
    
    // Process data
    result.value.forEach((elem) => {
      createdAt.value.push(moment(elem.result_created_at).format('MM-DD-YYYY'));
      latePercentages.value.push(parseFloat(elem.late_percentage) || 0);
      growAge.value.push(parseInt(elem.grow_age) || 0);
      diffAge.value.push(parseInt(elem.diff_age) || 0);
    });

    // Update chart data
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  } catch (error) {
    console.error('Error fetching results:', error);
    showAlert(t('failed_to_fetch_results'), 'error');
  } finally {
    loading.value = false;
  }
};

// Fetch side profile
const getSideProfile = async () => {
  try {
    const response = await axios.get(`/api/side-profiles/${route.params.sideProfile_id}`);
    sideProfileName.value = response.data.sideProfile.title;
  } catch (error) {
    console.error('Error fetching side profile:', error);
    showAlert(t('failed_to_fetch_side_profile'), 'error');
  }
};

// Filter results by date
const filter = async () => {
  if (from.value && to.value && moment(to.value).isBefore(from.value)) {
    showAlert(t('invalid_date_range'), 'error');
    return;
  }
  try {
    await getResults();
  } catch (error) {
    console.error('Error filtering results:', error);
    showAlert(t('failed_to_filter_results'), 'error');
  }
};

// Format date
const formatDate = (date) => {
  return moment(date).locale(locale.value).format('DD-MM-YYYY HH:mm');
};

// Print results
const print = () => {
  if (from.value && to.value) {
    router.push({
      name: 'printChildResult',
      params: {
        child_id: route.params.child_id,
        sideProfile_id: route.params.sideProfile_id,
        evaluation_id: route.params.evaluation_id,
        start: moment(from.value).format('YYYY-MM-DD'),
        end: moment(to.value).format('YYYY-MM-DD'),
      },
    });
  } else {
    router.push({
      name: 'printChildResultfilter',
      params: {
        child_id: route.params.child_id,
        sideProfile_id: route.params.sideProfile_id,
        evaluation_id: route.params.evaluation_id,
      },
    });
  }
};

// Edit evaluation
const editItem = (date, evaluationResultId) => {
  visible.value = true;
  examDate.value = new Date(date);
  examId.value = evaluationResultId;
  formSubmitted.value = false;
};

// Submit edited evaluation
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

// Show alert message
const showAlert = (message, type) => {
  alertText.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertText.value = null;
  }, 5000);
};

// Go back
const goBack = () => {
  router.go(-1);
};

// Initialize on mount
onMounted(async () => {
  await Promise.all([getResults(), getSideProfile()]);
});

// Watch for changes
watch([selectedChartType, selectX, selectY, locale], () => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

// Watch for date filter changes
watch([from, to], () => {
  if (from.value || to.value) {
    filter();
  }
});
</script>

<style scoped>
/* Main Container */
.evaluation-results-container {
  padding: 2rem;
  background-color: var(--surface-ground);
  min-height: 100vh;
  direction: v-bind('locale === "ar" ? "rtl" : "ltr"');
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.page-title .child-name {
  color: var(--primary-500);
}

.page-title .profile-name {
  color: var(--pink-500);
}

.page-title .evaluation-title {
  color: var(--cyan-500);
}

.page-title .separator {
  color: var(--text-color-secondary);
}

.page-title .separator.ar {
  transform: rotate(180deg);
  display: inline-block;
}

.back-button {
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateX(-5px);
}

.back-button .pi {
  margin-right: 0.5rem;
}

/* Alert Message */
.alert-message {
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Chart Controls */
.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-type-selector,
.axis-selector,
.date-filter {
  flex: 1;
  min-width: 200px;
}

.axis-selectors {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Chart Card */
.chart-card {
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
  border: none;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.chart-title .pi {
  color: var(--primary-500);
}

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

.main-chart {
  height: 100%;
  width: 100%;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color-secondary);
  gap: 0.5rem;
}

.no-results .pi {
  font-size: 2rem;
}

/* Results Card */
.results-card {
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.results-title .pi {
  color: var(--primary-500);
}

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
  padding-left: 2.5rem;
  border-radius: 20px;
  min-width: 250px;
}

.print-button {
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.print-button:hover {
  transform: translateY(-2px);
}

.print-button .pi {
  margin-right: 0.5rem;
}

/* Results Table */
.results-table {
  width: 100%;
}

.results-table :deep(.p-datatable-thead > tr > th) {
  background-color: var(--surface-card);
  color: var(--text-color);
  font-weight: 600;
  border-bottom: 2px solid var(--surface-border);
  padding: 1rem;
}

.results-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  transition: background-color 0.2s;
}

.results-table :deep(.p-datatable-tbody > tr:hover > td) {
  background-color: var(--surface-hover);
}

.results-table :deep(.p-paginator) {
  background-color: var(--surface-card);
  border-top: 1px solid var(--surface-border);
  padding: 1rem;
}

.index-badge {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  background-color: var(--surface-ground);
  color: var(--text-color);
  font-weight: 600;
}

.value-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background-color: var(--surface-ground);
  color: var(--text-color);
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.age-value {
  font-weight: 600;
}

.age-value .unit {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  margin-left: 0.25rem;
}

.percentage-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.percentage-value {
  font-weight: 600;
  min-width: 40px;
}

.percentage-bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
}

.percentage-bar.low {
  background-color: var(--green-500);
}

.percentage-bar.medium {
  background-color: var(--yellow-500);
}

.percentage-bar.high {
  background-color: var(--red-500);
}

.date-value {
  font-family: monospace;
  color: var(--text-color);
}

.edit-button {
  transition: all 0.2s;
}

.edit-button:hover {
  transform: scale(1.1);
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.loading-text {
  font-weight: 600;
  color: var(--text-color-secondary);
}

/* Edit Dialog */
.edit-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.edit-date-picker {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-button,
.submit-button {
  padding: 0.75rem 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-controls {
    flex-direction: column;
  }
  
  .chart-type-selector,
  .axis-selector,
  .date-filter {
    width: 100%;
  }
  
  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .results-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .search-box {
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chart-card, .results-card {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--surface-ground);
}

::-webkit-scrollbar-thumb {
  background: var(--surface-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-color-secondary);
}
</style>