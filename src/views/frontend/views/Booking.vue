<template>
  <Nave />
  <div class="banner flex items-center h-[35vh] lg:h-[55vh] relative">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png" alt="Banner Image">
    <div class="z-50 text-white m-auto w-[80%] text-center">
      <h1 class="font-bold text-5xl text-white">{{ $t("bookings") }}</h1>
      <div class="flex justify-center py-8">
        <p class="text-2xl font-semibold"> {{ $t("home") }}</p>
        <svg class="my-auto mx-2 ltr:rotate-180" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.999878 6.49976L16.9999 6.49976" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5.99972 11.5C5.99972 11.5 0.999767 7.81756 0.999756 6.49996C0.999744 5.18237 5.99976 1.5 5.99976 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="text-2xl font-semibold"> {{ $t("bookings") }}</p>
      </div>
    </div>
  </div>

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
          <div class="card-front p-6 text-center  bg-gradient-to-r from-[#74dbc5] to-[#618990] flex flex-col justify-between bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div>
              <div class="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-md border-2 border-white">
                <img :src="book?.user_image" alt="User Image" class="w-full h-full object-cover">
              </div>
              <h3 class="mt-3 font-bold text-lg text-gray-800">{{ book?.user_name }}</h3>
              <p class="text-sm text-gray-600">{{ book?.user_title }}</p>
              <p class="text-lg py-1 text-blue-600">{{ moment(book?.event_date).format("DD-MM-YY") }}</p>
              <p class="text-lg py-1 text-gray-700">{{ moment(book?.event_date).format("hh:mm A") }}</p>
              <p v-if="book?.accepted == 0" class="px-2 py-2 bg-yellow-400 text-white rounded-lg font-medium mt-2">{{ $t("انتظار") }}</p>
              <p v-if="book?.accepted == 1" class="px-2 py-2 bg-green-700 text-white rounded-lg font-medium mt-2">{{ $t("مقبول") }}</p>
              <p v-if="book?.accepted == 2" class="px-2 py-2 bg-red-700 text-white rounded-lg font-medium mt-2">{{ $t("مرفوض") }}</p>
            </div>
          </div>

          <!-- Back Side -->
          <div class="card-back p-6 text-center  bg-gradient-to-r from-[#ffff] to-[#ED5586] rounded-lg shadow-lg">
            <div  v-if="book?.consultation_result">
              <p class="mt-2 text-gray-700 font-semibold">{{ $t("التوصييات الصحية والنمائية") }}:</p>
              <p class="text-sm text-gray-600">{{ book.consultation_result.health }}</p>

              <p class="mt-2 text-gray-700 font-semibold">{{ $t("توصييات المستشار") }} </p>
              <p class="text-sm text-gray-600">{{ book.consultation_result.consultant_recommendations }}</p>

              <p class="mt-2 text-gray-700 font-semibold">{{ $t("التوصييات المزلية") }}:</p>
              <p class="text-sm text-gray-600" v-for="bok in book.consultation_result?.filed_value" :key="bok.id">{{ bok?.value }}</p>
            </div>

            <p v-else class="mt-2 italic text-gray-400">{{ book.consultation_settings }}</p>
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

const router = useRouter();
const booking = ref([]);
const deleteDialogVisible = ref(false);
const bookingToDelete = ref(null);

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