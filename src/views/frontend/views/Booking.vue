<template>
  <Nave />
  <div class="banner flex items-center h-[35vh] lg:h-[55vh] relative">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png">
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
      <button @click="AddBooking" class="create text-white px-4 py-2 rounded-lg hover:bg-blue-700">{{ $t("Add_new_booking") }}</button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 px-4">
  <div class="flip-card " v-for="book in booking" :key="book.id">
    <div class="flip-card-inner">
      <!-- Front Side -->
      <div class="flip-card-front p-4 text-center">
        <div class="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-md">
          <img :src="book?.user_image" alt="User Image" class="w-full h-full object-cover">
        </div>
        <h3 class="mt-3 font-bold text-lg text-gray-800">{{ book?.user_name }}</h3>
        <p class="text-sm text-gray-600">{{ book?.user_title }}</p>
        <p class="text-lg py-1 text-blue-600">{{ moment(book?.event_date).format("DD-MM-YY") }}</p>
        <p class="text-lg py-1 text-gray-700">{{ moment(book?.event_date).format("hh:mm A") }}</p>
        <p v-if="book?.accepted == 0" class="px-2 py-2 bg-yellow-400 text-white w-[50%] rounded-lg font-medium">{{ $t("انتظار") }}</p>
        <p v-if="book?.accepted == 1" class="px-2 py-2 bg-green-700 text-white w-[50%] rounded-lg font-medium">{{ $t("مقبول") }}</p>
        <p v-if="book?.accepted == 2" class="px-2 py-2 bg-red-700 text-white w-[50%] rounded-lg font-medium">{{ $t("مرفوض") }}</p>

      </div>

      <!-- Back Side -->
      <div class="flip-card-back p-4 text-center">
       
        <p class="mt-2 italic text-gray-500" v-if="book?.accepted_notes">{{ book?.accepted_notes }}</p>
        <p class="mt-2 italic text-gray-400" v-else>{{ $t("No_notes") }}</p>
      </div>
    </div>
  </div>
</div>

  </div>

  <About />
</template>

<script setup>
import Nave from "../components/Nave.vue";
import About from "../components/About.vue";
import moment from "moment";
import axios from "axios";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();
const booking = ref([]);

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

onMounted(() => {
  getAllBooking();
});
</script>

<style scoped>
.bg-white {
  transition: transform 0.3s ease-in-out;
}
.bg-white:hover {
  transform: translateY(-5px);
}
.flip-card {


  width: 100%;
  height: 300px;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  background-color: whitesmoke;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>
