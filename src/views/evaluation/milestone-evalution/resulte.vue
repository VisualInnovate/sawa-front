<template>
  <div class="p-6 bg-gray-50 min-h-screen container mx-auto print:p-0 print:w-full print:max-w-full print:mx-0">
    <!-- Header with Print Button -->
    <div class="flex justify-between items-center mb-8 print:hidden">
      <h1 class="text-3xl font-bold text-gray-800">{{ $t("evaluation_report") }}</h1>
      <button 
        @click="printReport"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
        </svg>
        {{ $t("print_report") }}
      </button>
    </div>

    <!-- Print-only header -->
    <div class="hidden print:block py-4 border-b border-gray-200 mb-4">
      <h1 class="text-3xl font-bold text-gray-800 text-center">{{ $t("evaluation_report") }}</h1>
      <div class="text-center text-gray-600 mt-2">
        {{ $t("generated_on") }}: {{ new Date().toLocaleDateString() }}
      </div>
    </div>

    <!-- Levels Grid -->
    <div class="space-y-12 print:space-y-6">
      <div v-for="(level, index) in mainSquares" :key="index" class="bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:border print:break-inside-avoid">
        <!-- Level Header -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 print:bg-blue-600">
          <h1 class="w-full py-2 text-2xl font-bold text-center text-white">{{ $t("level_n", { n: index + 1 }) }}</h1>
        </div>
        
        <!-- Grid Content -->
        <div class="p-4 print:p-2">
          <div class="grid grid-cols-10 border border-gray-200 rounded-lg overflow-hidden print:text-sm">
            <!-- Question Numbers Column -->
            <div class="grid grid-cols-1 bg-gray-100">
              <div class="level-heading-spacer text-center flex items-center justify-center bg-gray-200 font-medium"></div>
              <div 
                class="w-20 h-16 m-auto text-center flex items-center justify-center border-t border-gray-200 font-medium print:w-16 print:h-12" 
                v-for="(question, qIndex) in level?.subtests?.[0]?.questions || []" 
                :key="qIndex"
              >
                {{ 5 - (qIndex % 5) }}
              </div>
            </div>
            
            <!-- Test Columns -->
            <div 
              class="grid grid-cols-1" 
              v-for="(subtest, subIndex) in mainSquares[0]?.subtests || []"
            >
              <!-- Subtest Name -->
              <div class="level-subtest-title text-center flex justify-center bg-gray-100 border-l border-gray-200 font-medium">
                {{ level?.subtests[subIndex]?.subtest_name }}
              </div>
              
              <!-- Answer Cells -->
              <div 
                class="w-20 h-16 border-t border-l border-gray-200 flex flex-col justify-between print:w-16 print:h-12"
                v-for="(question, qIndex) in level?.subtests?.[subIndex]?.questions || []" 
                :key="qIndex"
              >
                <div 
                  class="h-1/2 border-b border-gray-200"
                  :style="{ 
                    backgroundColor: question.answer_score == 1 ? `#${question.answer_color}` : '',
                    border: '1px dotted #d1d5db'
                  }"
                ></div>
                <div 
                  class="h-1/2"
                  :style="{ 
                    backgroundColor: question?.answer_score == 1 || question?.answer_score == 0.5 ? `#${question?.answer_color}` : '',
                    border: '1px dotted #d1d5db'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Evaluation Summary -->
    <div class="mt-12 bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:border print:mt-8">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 print:bg-blue-600">
        <h2 class="text-xl font-bold text-white">{{ $t("evaluation_summary") }}</h2>
      </div>
      <div v-if="!table_resulte.length" class="px-6 py-10 text-center text-gray-500">
        {{ loading ? $t("loading") : loadError ? $t("request_failed_retry") : $t("no_data_available") }}
      </div>

      <div v-else class="evaluation-summary-list">
        <article
          v-for="(result, rIndex) in table_resulte"
          :key="result.index || rIndex"
          class="evaluation-summary-card print:break-inside-avoid"
        >
          <header class="summary-card-header">
            <div class="summary-goal-identity">
              <span class="summary-index">{{ result.index }}</span>

              <div class="summary-meta-block">
                <span class="summary-meta-label">{{ $t("target_symbol") }}</span>
                <strong class="summary-symbol">{{ result.symbol || '—' }}</strong>
              </div>

              <div class="summary-header-divider"></div>

              <div class="summary-meta-block summary-general-goal">
                <span class="summary-meta-label">{{ $t("milestone_general_goal") }}</span>
                <strong>{{ result.general_goal || '—' }}</strong>
              </div>
            </div>

            <div class="summary-status">
              <span class="summary-meta-label">{{ $t("status") }}</span>
              <span class="summary-status-badge">{{ result.status || '—' }}</span>
            </div>
          </header>

          <div class="summary-columns">
            <section class="summary-column summary-strengths">
              <div class="summary-column-heading">
                <span class="summary-heading-icon" aria-hidden="true">✓</span>
                <div>
                  <h3>{{ $t("strengths") }}</h3>
                  <span>{{ (result.strength || []).length }}</span>
                </div>
              </div>
              <ul v-if="result.strength?.length" class="summary-points">
                <li v-for="(strength, sIndex) in result.strength" :key="sIndex">
                  {{ strength.question }}
                </li>
              </ul>
              <p v-else class="summary-empty">{{ $t("no_data_available") }}</p>
            </section>

            <section class="summary-column summary-weaknesses">
              <div class="summary-column-heading">
                <span class="summary-heading-icon" aria-hidden="true">!</span>
                <div>
                  <h3>{{ $t("weaknesses") }}</h3>
                  <span>{{ (result.weak || []).length }}</span>
                </div>
              </div>
              <ul v-if="result.weak?.length" class="summary-points">
                <li v-for="(weakness, wIndex) in result.weak" :key="wIndex">
                  {{ weakness.question }}
                </li>
              </ul>
              <p v-else class="summary-empty">{{ $t("no_data_available") }}</p>
            </section>

            <section class="summary-column summary-plan-goals">
              <div class="summary-column-heading">
                <span class="summary-heading-icon summary-goal-icon" aria-hidden="true">▣</span>
                <div>
                  <h3>{{ $t("milestone_plan_goal") }}</h3>
                  <span>{{ (result.plan_goals || []).length }}</span>
                </div>
              </div>
              <ul v-if="result.plan_goals?.length" class="summary-points">
                <li v-for="(goal, goalIndex) in result.plan_goals" :key="goalIndex">
                  {{ goal.question }}
                </li>
              </ul>
              <p v-else class="summary-empty">{{ $t("no_data_available") }}</p>
            </section>
          </div>
        </article>
      </div>
    </div>

    <!-- Print Footer (only shows when printing) -->
    <div class="hidden print:block mt-8 pt-4 border-t border-gray-200 text-xs text-gray-600">
      <div class="flex justify-between">
        <div>{{ $t("evaluation_report") }} - {{ $t("generated_on") }}: {{ new Date().toLocaleDateString() }}</div>
        <div>{{ $t("page") }} <span class="pageNumber"></span></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'SquareGrid',
  data() {
    return {
      mainSquares: [],
      table_resulte: [],
      loading: true,
      loadError: false,
    };
  },
  methods: {
    async getresulte() {
      this.loading = true;
      this.loadError = false;

      const [levelsResult, reportResult] = await Promise.allSettled([
        axios.get(`api/mileston-levels/flow-chart/${this.$route.params.evla_id}`),
        axios.get(`api/evaluations/report/${this.$route.params.evla_id}`),
      ]);

      if (levelsResult.status === "fulfilled") {
        this.mainSquares = levelsResult.value.data?.data || [];
      } else {
        this.mainSquares = [];
        this.loadError = true;
        console.error("Error retrieving data:", levelsResult.reason);
      }

      if (reportResult.status === "fulfilled") {
        this.table_resulte = Array.isArray(reportResult.value.data) ? reportResult.value.data : [];
      } else {
        this.table_resulte = [];
        this.loadError = true;
        console.error("Error retrieving evaluation data:", reportResult.reason);
      }

      this.loading = false;
    },
    printReport() {
      // Add print-specific styles
      const style = document.createElement('style');
      style.innerHTML = `
        @page {
          size: auto;
          margin: 10mm;
        }
        body {
          padding: 0 !important;
          margin: 0 !important;
          background: white !important;
        }
        .sidebar {
          display: none !important;
        }
        .container {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .pageNumber:after {
          content: counter(page);
        }
        .print\\:break-inside-avoid {
          break-inside: avoid;
        }
      `;
      document.head.appendChild(style);
      
      window.print();
      
      // Clean up after printing
      setTimeout(() => {
        document.head.removeChild(style);
      }, 1000);
    }
  },
  mounted() {
    this.getresulte();
  },
};
</script>

<style>
/* Base styles */
th, td {
  text-align: center !important;
  vertical-align: middle !important;
}

/* Keep long Arabic subtest titles inside their own columns without changing the table design. */
.level-heading-spacer,
.level-subtest-title {
  width: 5rem;
  height: 15rem;
  min-height: 15rem;
}

.level-subtest-title {
  align-items: flex-start;
  padding: 1rem 0.5rem;
  overflow: hidden;
  font-size: 0.75rem;
  line-height: 1.75;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: normal;
}

.evaluation-summary-list {
  padding: 1.5rem;
  background: #f8fafc;
}

.evaluation-summary-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #ffffff;
}

.evaluation-summary-card + .evaluation-summary-card {
  margin-top: 1.5rem;
}

.summary-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  min-height: 6.25rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.summary-goal-identity {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.summary-index {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.875rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 700;
  box-shadow: 0 0.375rem 0.75rem rgba(37, 99, 235, 0.18);
}

.summary-meta-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-meta-label {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
}

.summary-symbol {
  color: #0f172a;
  font-size: 1rem;
}

.summary-header-divider {
  align-self: stretch;
  width: 1px;
  min-height: 2.75rem;
  background: #e2e8f0;
}

.summary-general-goal {
  min-width: 0;
  max-width: 42rem;
}

.summary-general-goal strong {
  color: #1e293b;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.summary-status {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.75rem;
}

.summary-status-badge {
  padding: 0.4rem 0.9rem;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.8rem;
  font-weight: 700;
}

.summary-columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
}

.summary-column {
  min-width: 0;
  min-height: 20rem;
  padding: 1.5rem;
}

.summary-column + .summary-column {
  border-inline-start: 1px solid #dbe3ec;
}

.summary-strengths {
  background: #f4fbf7;
  color: #166534;
}

.summary-weaknesses {
  background: #fff9f4;
  color: #c2410c;
}

.summary-plan-goals {
  background: #faf7ff;
  color: #7e22ce;
}

.summary-column-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.summary-column-heading h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

.summary-column-heading div > span {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #64748b;
}

.summary-heading-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid currentColor;
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.78);
  font-weight: 800;
}

.summary-goal-icon {
  font-size: 0.8rem;
}

.summary-points {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #334155;
}

.summary-points li {
  position: relative;
  padding-block: 0 0.75rem;
  padding-inline: 1rem 0;
  line-height: 1.9;
  overflow-wrap: anywhere;
}

.summary-points li + li {
  padding-top: 0.75rem;
  border-top: 1px solid rgba(148, 163, 184, 0.35);
}

.summary-points li::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 0.75rem;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 999px;
  background: currentColor;
}

.summary-points li:first-child::before {
  top: 0.75rem;
}

.summary-points li + li::before {
  top: 1.5rem;
}

.summary-strengths .summary-points li::before {
  color: #16a34a;
}

.summary-weaknesses .summary-points li::before {
  color: #ea580c;
}

.summary-plan-goals .summary-points li::before {
  color: #9333ea;
}

.summary-empty {
  margin-top: 2rem;
  color: #94a3b8;
  text-align: center;
}

@media (max-width: 767px) {
  .summary-card-header,
  .summary-goal-identity {
    align-items: flex-start;
  }

  .summary-card-header {
    flex-direction: column;
  }

  .summary-goal-identity {
    flex-wrap: wrap;
  }

  .summary-header-divider {
    display: none;
  }

  .summary-general-goal {
    flex-basis: 100%;
  }

  .summary-columns {
    grid-template-columns: 1fr;
  }

  .summary-column {
    min-height: auto;
  }

  .summary-column + .summary-column {
    border-inline-start: 0;
    border-top: 1px solid #dbe3ec;
  }
}

/* Print-specific styles */
@media print {
  body {
    padding: 0.5in !important;
    background: white !important;
  }
  
  /* Hide sidebar and other non-essential elements */
  .sidebar, .navigation, .no-print {
    display: none !important;
  }
  
  .bg-blue-500, .bg-gradient-to-r {
    background: #3b82f6 !important;
    color: white !important;
  }
  
  .bg-gray-100 {
    background: #f3f4f6 !important;
  }
  
  .bg-gray-50 {
    background: #f9fafb !important;
  }
  
  .shadow-md, .rounded-xl {
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  
  .border, .border-t, .border-b, .border-l, .border-r {
    border-color: #e5e7eb !important;
  }

  .level-heading-spacer,
  .level-subtest-title {
    width: 4rem;
    height: 10rem;
    min-height: 10rem;
  }

  .level-subtest-title {
    padding: 0.5rem 0.25rem;
    font-size: 0.625rem;
    line-height: 1.45;
  }

  .evaluation-summary-list {
    padding: 0.5rem;
  }

  .evaluation-summary-card + .evaluation-summary-card {
    margin-top: 0.75rem;
  }

  .summary-card-header {
    min-height: auto;
    padding: 0.75rem;
  }

  .summary-index {
    width: 2.25rem;
    height: 2.25rem;
    box-shadow: none;
  }

  .summary-column {
    min-height: 12rem;
    padding: 0.75rem;
    font-size: 0.7rem;
  }

  .summary-column-heading {
    margin-bottom: 0.5rem;
  }

  .summary-points li {
    line-height: 1.55;
  }

  .summary-points li + li {
    padding-top: 0.5rem;
  }

  .summary-points li + li::before {
    top: 1.1rem;
  }
  
  /* Ensure table headers are visible */
  thead {
    display: table-header-group;
  }
  
  /* Page breaks */
  div {
    page-break-inside: avoid;
  }
  
  h1, h2 {
    page-break-after: avoid;
  }
}
</style>
