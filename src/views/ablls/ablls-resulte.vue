<template>
  <v-card class="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
    <div class="grid md:grid-cols-3 grid-cols-2 lg:grid-cols-5 gap-6">
      <transition-group name="fade" tag="div" class="contents">
        <div 
          v-show="mainSquares" 
          v-for="(abll, index) in mainSquares" 
          :key="index"
          class="shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-3">
            <p class="m-auto text-center w-full py-1 text-white font-semibold text-sm uppercase tracking-wider">
              {{ abll?.category }}
            </p>
          </div>
          
          <div class="p-3 space-y-3">
            <div v-for="(count, idx) in abll.missions" :key="idx" class="mb-2 last:mb-0">
              <div class="flex items-center">
                <p class="px-2 w-16 text-sm font-medium text-gray-700 truncate">{{ count.mission_key }}</p>
                <div 
                  class="bg-white rounded-md grid overflow-hidden"
                  :class="[`grid-cols-${count.mission_degree.length-1}`]"
                >
                  <div 
                    v-for="(x, index) in count.mission_degree.length-1" 
                    :key="index"
                    class="h-8 w-9 flex items-center justify-center transition-all duration-500"
                    :style="{ 
                      border: '1px solid #e2e8f0',
                      backgroundColor: index < count.answer_score ? `#${count.answer_color}` : '#f8fafc',
                      'box-shadow': index < count.answer_score ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : 'none'
                    }"
                  >
                    <span 
                      v-if="index < count.answer_score"
                      class="text-white text-xs font-bold"
                    >             
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </v-card>
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
    async getresulte() {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(`api/able-category/flow-chart/${this.$route.params.id}`),
          axios.get(`api/api/evaluations/report/${this.$route.params.id}`)
        ]);
        
        this.mainSquares = response1.data.data || response2.data.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  },
  beforeMount() {
    setTimeout(() => {
      this.getresulte();
    }, 500);
  },
  mounted() {
    setTimeout(() => {
      this.getresulte();
    }, 500);
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Gradient animation for cards */
.shadow-lg:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
}

/* Pulse animation for loading */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-square {
  animation: pulse 1.5s infinite;
}
</style>