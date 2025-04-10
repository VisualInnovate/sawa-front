<template>
  <div class="p-6 bg-gray-50 min-h-screen container mx-auto print:p-0 print:w-full print:max-w-full print:mx-0">
    <!-- Header with Print Button -->
    <div class="flex justify-between items-center mb-8 print:hidden">
      <h1 class="text-3xl font-bold text-gray-800">Evaluation Report</h1>
      <button 
        @click="printReport"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
        </svg>
        Print Report
      </button>
    </div>

    <!-- Print-only header -->
    <div class="hidden print:block py-4 border-b border-gray-200 mb-4">
      <h1 class="text-3xl font-bold text-gray-800 text-center">Evaluation Report</h1>
      <div class="text-center text-gray-600 mt-2">
        Generated on: {{ new Date().toLocaleDateString() }}
      </div>
    </div>

    <!-- Levels Grid -->
    <div class="space-y-12 print:space-y-6">
      <div v-for="(level, index) in mainSquares" :key="index" class="bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:border print:break-inside-avoid">
        <!-- Level Header -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 print:bg-blue-600">
          <h1 class="w-full py-2 text-2xl font-bold text-center text-white">LEVEL {{ index+1 }}</h1>
        </div>
        
        <!-- Grid Content -->
        <div class="p-4 print:p-2">
          <div class="grid grid-cols-10 border border-gray-200 rounded-lg overflow-hidden print:text-sm">
            <!-- Question Numbers Column -->
            <div class="grid grid-cols-1 bg-gray-100">
              <div class="w-20 h-16 text-center flex items-center justify-center bg-gray-200 font-medium print:w-16 print:h-12"></div>
              <div 
                class="w-20 h-16 m-auto text-center flex items-center justify-center border-t border-gray-200 font-medium print:w-16 print:h-12" 
                v-for="(question, qIndex) in level?.subtests[0].questions" 
                :key="qIndex"
              >
                {{ qIndex+1 }}
              </div>
            </div>
            
            <!-- Test Columns -->
            <div 
              class="grid grid-cols-1" 
              v-for="(subtest, subIndex) in mainSquares[0]?.subtests"
            >
              <!-- Subtest Name -->
              <div class="w-20 h-20 text-center flex items-center justify-center bg-gray-100 border-l border-gray-200 p-2 text-sm font-medium print:w-16 print:h-16 print:text-xs">
                {{ level?.subtests[subIndex]?.subtest_name }}
              </div>
              
              <!-- Answer Cells -->
              <div 
                class="w-20 h-16 border-t border-l border-gray-200 flex flex-col justify-between print:w-16 print:h-12"
                v-for="(question, qIndex) in level?.subtests[subIndex].questions" 
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

    <!-- Results Table -->
    <div class="mt-12 bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:border print:break-inside-avoid print:mt-8">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 print:bg-blue-600">
        <h2 class="text-xl font-bold text-white">Evaluation Summary</h2>
      </div>
      <div class="relative overflow-x-auto print:overflow-x-visible">
        <table class="w-full text-sm text-left text-gray-700 print:text-xs">
          <thead class="text-xs text-white uppercase bg-blue-500 print:bg-blue-600">
            <tr>
              <th scope="col" class="px-6 py-3 print:px-3 print:py-2">#</th>
              <th scope="col" class="px-6 py-3 print:px-3 print:py-2">Strengths</th>
              <th scope="col" class="px-6 py-3 print:px-3 print:py-2">Weaknesses</th>
              <th scope="col" class="px-6 py-3 print:px-3 print:py-2">Status</th>
              <th scope="col" class="px-6 py-3 print:px-3 print:py-2">Target Symbol</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(result, rIndex) in table_resulte" 
              :key="rIndex"
              class="border-b border-gray-200 hover:bg-gray-50 print:hover:bg-transparent"
              :class="{ 'bg-gray-50': rIndex % 2 === 0 }"
            >
              <td class="px-6 py-4 font-medium print:px-3 print:py-2">{{ result.index }}</td>
              <td class="px-6 py-4 print:px-3 print:py-2">
                <span v-for="(strength, sIndex) in result.strength" :key="sIndex">
                  {{ strength }}<span v-if="sIndex < result.strength.length - 1">, </span>
                </span>
              </td>
              <td class="px-6 py-4 print:px-3 print:py-2">
                <span v-for="(weakness, wIndex) in result.weak" :key="wIndex">
                  {{ weakness }}<span v-if="wIndex < result.weak.length - 1">, </span>
                </span>
              </td>
              <td class="px-6 py-4 print:px-3 print:py-2">{{ result.status }}</td>
              <td class="px-6 py-4 font-medium print:px-3 print:py-2">{{ result.symbol }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Print Footer (only shows when printing) -->
    <div class="hidden print:block mt-8 pt-4 border-t border-gray-200 text-xs text-gray-600">
      <div class="flex justify-between">
        <div>Evaluation Report - Generated on: {{ new Date().toLocaleDateString() }}</div>
        <div>Page <span class="pageNumber"></span></div>
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
      table_resulte: []
    };
  },
  methods: {
    getresulte() {
      axios
        .get(`api/mileston-levels/flow-chart/${this.$route.params.id}`)
        .then((response) => {
          this.mainSquares = response.data.data;
        })
        .catch((error) => {
          console.error("Error retrieving data:", error);
        });
      
      axios
        .get(`api/evaluations/report/${this.$route.params.evla_id}`)
        .then((response) => {
          this.table_resulte = response.data;
        })
        .catch((error) => {
          console.error("Error retrieving evaluation data:", error);
        });
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