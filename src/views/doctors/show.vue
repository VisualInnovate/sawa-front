<template>
  <div class="p-6 flex flex-col items-center">
    <!-- Evaluation Component -->
    <EvaluationType />

    <v-card class="bg-white shadow-lg rounded-xl p-6 max-w-2xl w-full">
      <!-- User Image -->
      <div class="flex justify-center mb-4">
        <Image 
          :src="details.image" 
          preview 
          width="150" 
          alt="User Image" 
          class="rounded-full shadow-md"
        />
      </div>

      <!-- User Information -->
      <div class="space-y-4">
        <div class="flex items-center">
          <h3 class="text-gray-700 font-semibold text-lg">{{ $t("name") }}:</h3>
          <p class="text-gray-900 text-xl font-medium ml-2">{{ details.name }}</p>
        </div>

        <div class="flex items-center">
          <h3 class="text-gray-700 font-semibold text-lg">{{ $t("email") }}:</h3>
          <p class="text-gray-900 text-xl font-medium ml-2">{{ details.email }}</p>
        </div>

        <div class="flex items-center">
          <h3 class="text-gray-700 font-semibold text-lg">{{ $t("title") }}:</h3>
          <p class="text-gray-900 text-xl font-medium ml-2">{{ details.title }}</p>
        </div>

        <!-- Skills Section -->
        <div>
          <h3 class="text-gray-700 font-semibold text-lg">{{ $t("skills") }}:</h3>
          <div class="flex flex-wrap gap-2 mt-1">
            <span 
              v-for="x in details.skills" 
              :key="x.name" 
              class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ x.name }}
            </span>
          </div>
        </div>

        <!-- Department Section -->
        <div>
          <h3 class="text-gray-700 font-semibold text-lg">{{ $t("department") }}:</h3>
          <div class="flex flex-wrap gap-2 mt-1">
            <span 
              v-for="x in details.departments" 
              :key="x.title" 
              class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ x.title }}
            </span>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { useStorage } from "@vueuse/core";
import EvaluationType from "../../components/EvaluationType.vue";
import { useToast } from "primevue/usetoast";

export default {
  components: { EvaluationType },

  data() {
    return {
      child_id: useStorage("child_id", Number),
      maxDate: new Date(),
      details: {},
    };
  },

  methods: {
    getusers() {
      axios
        .get(`api/users/${localStorage.getItem("doctor_id")}/get/evaluations`)
        .then((response) => {
          console.log(response.data.data);
          this.details = response.data;
        })
        .catch((error) => {
          console.error("Error retrieving Appointment Types:", error);
        });
    },
  },

  mounted() {
    this.getusers();
    this.child_id = localStorage.getItem("child_id");
  },
};
</script>

<style scoped>
/* Add smooth hover effect */
.v-card:hover {
  transform: translateY(-4px);
  transition: 0.3s ease-in-out;
}
</style>
