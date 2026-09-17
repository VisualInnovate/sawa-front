<template>
    <Nave />
    <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#ffff] to-[#035b65] p-5">
      <form @submit.prevent="submitForm" class="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-lg w-full animate-fadeIn">
         <p class="font-semibold text-lg mb-2 text-slate-700">{{ $t("meeting_request_hint") }}</p>
        <div class="mb-6 required-field">
          <label for="meeting_time" class="block text-sm font-medium text-gray-700 mb-2">{{ $t("meeting_suggested_time") }}</label>
          <DatePicker
            id="meeting_time"
            v-model="formData.meeting_time"
            showTime
            hourFormat="24"
            dateFormat="yy-mm-dd"
            :timeOnly="false"
            :placeholder="$t('meeting_pick_time')"
            class="w-full border border-gray-300 rounded-lg focus:border-[#6a11cb] focus:ring-2 focus:ring-[#6a11cb] transition duration-300"
          />
        </div>
  
        <div class="mb-6 required-field">
          <label for="location" class="block text-sm font-medium text-gray-700 mb-2">{{ $t("meeting_location") }}</label>
          <InputText
            id="location"
            required
            v-model="formData.location"
            :placeholder="$t('meeting_location_hint')"
            class="w-full p-3 border border-gray-300 rounded-lg focus:border-[#6a11cb] focus:ring-2 focus:ring-[#6a11cb] transition duration-300"
          />
        </div>
  
        <div class="mb-6">
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">{{ $t("notes") }}</label>
          <Textarea rows="3"  v-model="formData.notes" autoResize fluid />
         
        </div>
  
        <Button type="submit" :label="$t('submit')" class="w-full p-3 bg-gradient-to-br from-[#035B65] to-[#037B65] text-white rounded-lg hover:from-[#045B65] hover:to-[#039B65] transform hover:-translate-y-1 transition duration-300" />
      </form>
    </div>
    <Toast/>
    <About />
  </template>
  
  <script>
  import { ref } from "vue";
  import Nave from "../components/Nave.vue";
  import About from "../components/About.vue";
  import { useRoute } from "vue-router"; // Import useRoute
  import axios from "axios";
  import { useI18n } from 'vue-i18n'


import {useToast} from 'primevue/usetoast'
  export default {
    components: { Nave, About },
    setup() {
      const { t } = useI18n()
      const toast = useToast()
      const route = useRoute();
        const formData = ref({
        meeting_time: null,
        location: "",
        notes: "", // Ensure this is initialized
        // Ensure this is initialized
        });
  
        const submitForm = async () => {
            console.log(formData.value); // Check if notes is included
            try {
                const response = await axios.post(`api/parent-meeting`,{
                  data:formData.value,
                  child_id:route.params.child_id,
                } );
                toast.add({ severity: 'success', summary: t("success_message"), detail: `${t("تم اضاف الاجتماع ")}`, life: 3000 });

                console.log(response.data);
            } catch (error) {
                console.error("Error submitting form:", error);
            }
            };
      return { formData, submitForm };
    },
  };
  </script>
  
  <style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 1s ease-in-out;
  }
    /* إضافة علامة النجمة الحمراء للحقول المطلوبة */
    .required-field label::after {
    content: " *";
    color: red;
    font-weight: bold;
  }
  </style>
