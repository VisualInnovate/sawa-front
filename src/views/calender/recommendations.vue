<template>
  <div class="settings-page bg-gray-50 min-h-screen py-10 px-6">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-extrabold text-blue-800">{{ $t("اعدادات الاستشارات") }}</h1>
    </div>
    
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg mb-6">
      <p class="text-lg text-gray-600 my-2">{{ $t("تعليمات الاستشارة") }}</p>
      <textarea required name="notes" v-model="header" id="notes" class="border ring-1 w-full ring-black border-black rounded-md focus:ring-black" cols="30" rows="2"></textarea>
    </div>

    <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <p class="text-lg text-gray-600 my-2">{{ $t("توصييات منزلية") }}</p>
      <button @click="showInput = true" class="w-full create bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
        <i class="pi pi-plus-circle"></i> إضافة عنصر جديد
      </button>
      
      <transition name="fade">
        <div v-if="showInput" class="mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
          <input v-model="newValue" placeholder="قم بادخال التوصية" class="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button @click="addLabel" class="w-full create bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 mt-3 rounded-lg transition-all duration-300">
            حفظ
          </button>
        </div>
      </transition>
      
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="(item, index) in labels" :key="index" class="bg-gray-50 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div class="flex-1">
            <input v-model="item.value" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="flex justify-center m-auto text-center items-center gap-2">
            
            <button @click="removeLabel(index)" class="p-2 m-auto text-red-600 hover:text-red-800 transition-transform transform hover:scale-105">
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      <Button v-if="labels.length > 0" @click="updateSettings" label="حفظ" class="w-full create mt-6 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"></Button>
    </div>
    
    <Toast />
  </div>
</template>

<script>
import { useToast } from "primevue/usetoast";
import axios from "axios";

export default {
  data() {
    return {
      header: '',
      toast: useToast(),
      showInput: false,
      newValue: "",
      labels: [],
    };
  },
  methods: {
    getSettings() {
      axios.get("/api/consultation-settings")
        .then((res) => {
          this.labels = res.data.data.recommendations;
          this.header = res.data.data.instructions;
        })
        .catch((err) => console.log(err));
    },
    updateSettings() {
      axios.put("/api/consultation-settings", {
          recommendations: this.labels,
          instructions: this.header
        })
        .then(() => {
          this.toast.add({
            severity: "success",
            summary: "تم الحفظ",
            detail: "تم تحديث التوصيات بنجاح",
            life: 3000,
          });
        })
        .catch((err) => console.log(err));
    },
    addLabel() {
      if (!Array.isArray(this.labels)) {
        this.labels = []; // Ensure labels is an array
      }
      
      if (this.newValue.trim() !== "") {
        this.labels.push({ value: this.newValue, index: this.labels.length });
        this.newValue = "";
        this.showInput = false;
      }
    },

    removeLabel(index) {
      this.labels.splice(index, 1);
      this.labels.forEach((item, idx) => item.index = idx);
    },
  },
  mounted() {
    this.getSettings();
  },
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>