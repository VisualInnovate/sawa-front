<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <ChildTaps></ChildTaps>
    <v-card class="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden">
      <div class="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h2 class="text-3xl font-bold">{{ $t("معلومات الطفل") }}</h2>
      </div>
      <div class="p-6 bg-white">
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-700">{{ $t("child_name") }} : </h3>
            <p class="text-xl text-gray-900">{{ details.name }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-700">{{ $t("birth_date") }} : </h3>
            <p class="text-xl text-gray-900">{{ details.birth_date }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-700">{{ $t("selectgender") }} : </h3>
            <p class="text-xl text-gray-900" v-if="details.gender == 0">{{ $t("male") }}</p>
            <p class="text-xl text-gray-900" v-if="details.gender == 1">{{ $t("female") }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-700">{{ $t("Nationality") }} : </h3>
            <p class="text-xl text-gray-900">{{ details.nationality }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-700">{{ $t("place_of_birth") }} : </h3>
            <p class="text-xl text-gray-900">{{ details.birth_place }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-700">{{ $t("primary_language") }} : </h3>
            <p class="text-xl text-gray-900">{{ details.lang }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-700">{{ $t("address") }} : </h3>
            <p class="text-xl text-gray-900">{{ details.address }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-700">{{ $t("parent_name") }} : </h3>
            <p class="text-xl text-gray-900">{{ details.parent?.fname }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-700">{{ $t("email") }} : </h3>
            <p class="text-xl text-gray-900">{{ details.parent?.email }}</p>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { useStorage } from "@vueuse/core";
import ChildTaps from '../../components/ChildTaps.vue'
import { useToast } from 'primevue/usetoast'

export default {
  components: { ChildTaps },
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
        .get(`api/child/${localStorage.getItem("child_id")}/get/evaluations`)
        .then((response) => {
          console.log(response.data.data)
          this.details = response.data
        })
        .catch((error) => {
          console.error("Error retrieving Appointment Types:", error);
        });
    },
  },
  mounted() {
    this.getusers()
    this.child_id = localStorage.getItem("child_id")
  },
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>