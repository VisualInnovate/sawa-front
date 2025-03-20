<template>
  <Nave />
  <Banner heading="الحجوزات" title="يمكنك اضافة حجز من هنا"></Banner>

  <div class="max-w-[1300px] mx-auto py-10">
    <div class="flex justify-between px-4">
      <h3 class="font-bold text-2xl text-[#303843]">{{ $t("bookings") }}</h3>
      <button @click="AddBooking" class="create text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        {{ $t("Add_new_booking") }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 px-4">
      <div class="booking-card" v-for="book in booking" :key="book.id">
        <div class="card-content">
          <!-- Front Side -->
          <div class="card-front p-6 text-center bg-gradient-to-r from-[#74dbc5] to-[#618990] flex flex-col justify-between bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div>
              <div class="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-md border-2 border-white">
                <img :src="book?.user_image" alt="User Image" class="w-full h-full object-cover">
              </div>
              <h3 class="mt-3 font-bold text-lg text-gray-800">{{ book?.user_name }}</h3>
              <p class="text-sm text-gray-600">{{ book?.user_title }}</p>
              <p class="text-lg py-1 text-blue-600">{{ moment(book?.event_date).format("DD-MM-YY") }}</p>
              <p class="text-lg py-1 text-gray-700">{{ moment.parseZone(book?.event_date).format("hh:mm A") }}</p>
              <p v-if="book?.accepted == -1" class="px-2 py-2 bg-yellow-400 text-white rounded-lg font-medium mt-2">{{ $t("انتظار") }}</p>
              <p v-if="book?.accepted == 1" class="px-2 py-2 bg-green-700 text-white rounded-lg font-medium mt-2">{{ $t("مقبول") }}</p>
              <p v-if="book?.accepted == 0" class="px-2 py-2 bg-red-700 text-white rounded-lg font-medium mt-2">{{ $t("مرفوض") }}</p>
            </div>
          </div>

          <!-- Back Side -->
          <div class="card-back p-6 text-center bg-gradient-to-r from-[#ffff] to-[#ED5586] rounded-lg shadow-lg">
            <button v-if="book?.status == 1" @click="showConsultationResult(book)" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {{ $t("نتيجة الاستشارة") }}
            </button>
            <div v-else class="mt-4 text-gray-700">
              <div class="mb-2">
                <label class="font-semibold text-gray-600">{{ $t("تعليمات الاستشارة") }}:</label>
                <p class="mt-1 italic text-gray-500">{{ book.consultation_settings }}</p>
              </div>

              <div>
                <label class="font-semibold text-gray-600">{{ $t("ملاحظات المستشار") }}:</label>
                <p class="mt-1 italic text-gray-500">{{ book.accepted_notes }}</p>
              </div>
            </div>
            <button @click="confirmDelete(book.booking_id)" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              {{ $t("إلغاء الحجز") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <Dialog v-model:visible="deleteDialogVisible" modal header="Confirm Delete" :style="{ width: '400px' }">
    <p class="text-lg text-gray-700">Are you sure you want to delete this booking?</p>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="deleteDialogVisible = false" class="p-button-text" />
      <Button label="Delete" icon="pi pi-check" @click="deleteBooking" class="p-button-danger" />
    </template>
  </Dialog>

  <!-- Consultation Result Modal -->
  <Dialog v-model:visible="consultationResultDialogVisible" modal header="نتيجة الاستشارة" :style="{ width: '600px' }">
    <div v-if="selectedConsultationResult">
      <p class="mt-2 text-gray-700 font-semibold">{{ $t("التوصييات الصحية والنمائية") }}:</p>
      <p class="text-sm text-gray-600">{{ removeBracesAndReplace(selectedConsultationResult?.consultation_result?.health, selectedConsultationResult?.child_name) }}</p>

      <p class="mt-2 text-gray-700 font-semibold">{{ $t("توصييات المستشار") }}:</p>
      <p class="text-sm text-gray-600">{{ removeBracesAndReplace(selectedConsultationResult?.consultation_result?.consultant_recommendations, selectedConsultationResult?.child_name) }}</p>

      <p class="mt-2 text-gray-700 font-semibold">{{ $t("التوصييات المزلية") }}:</p>
      <p class="text-sm text-gray-600" v-for="bok in selectedConsultationResult.consultation_result?.filed_value" :key="bok.id">
        {{ removeBracesAndReplace(bok?.value, selectedConsultationResult?.child_name) }}
      </p>
    </div>
    <template #footer>
      <Button label="Print" icon="pi pi-print" @click="printConsultationResult" class="p-button-text" />
      <Button label="Export as PDF" icon="pi pi-file-pdf" @click="exportConsultationResultAsPDF" class="p-button-success" />
      <Button label="Close" icon="pi pi-times" @click="consultationResultDialogVisible = false" class="p-button-text" />
    </template>
  </Dialog>

  <About />
</template>

<script setup>
import Nave from "../components/Nave.vue";
import About from "../components/About.vue";
import moment from "moment";
import axios from "axios";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import html2pdf from "html2pdf.js";
import Banner from '../components/Banner.vue';

const router = useRouter();
const booking = ref([]);
const deleteDialogVisible = ref(false);
const bookingToDelete = ref(null);
const consultationResultDialogVisible = ref(false);
const selectedConsultationResult = ref(null);

const getAllBooking = () => {
  axios
    .get("/api/calender/appointments")
    .then((res) => {
      booking.value = res.data.bookings;
    })
    .catch((err) => {
      console.error(err);
    });
};

const AddBooking = () => {
  router.push({ name: "clidreen_parents" });
};

const confirmDelete = (id) => {
  bookingToDelete.value = id;
  deleteDialogVisible.value = true;
};

const deleteBooking = () => {
  if (bookingToDelete.value) {
    axios
      .delete(`/api/calender/appointments/${bookingToDelete.value}`)
      .then(() => {
        getAllBooking(); // Refresh the list after deletion
        deleteDialogVisible.value = false;
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const removeBracesAndReplace = (text, name) => {
  if (!text) return ""; // Handle undefined or null text
  return text.replace(/\{\{.*?\}\}/g, name || "محمد"); // Replace {{}} with the provided name or default to "محمد"
};

const showConsultationResult = (book) => {
  selectedConsultationResult.value = book;
  consultationResultDialogVisible.value = true;
};

const printConsultationResult = () => {
  window.print();
};

const exportConsultationResultAsPDF = () => {
  const element = document.getElementById("consultation-result-content");
  html2pdf(element, {
    margin: 10,
    filename: 'consultation_result.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  });
};

onMounted(() => {
  getAllBooking();
});
</script>

<style scoped>
.banner {
  background-size: cover;
  background-position: center;
}

.booking-card {
  perspective: 1000px;
  width: 100%;
  height: 300px;
}

.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.booking-card:hover .card-content {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.card-front {
  backdrop-filter: blur(10px);
}

.card-back {
  backdrop-filter: blur(10px);
  transform: rotateY(180deg);
}

.create {
  background-color: #3b82f6;
}

.create:hover {
  background-color: #2563eb;
}
</style>