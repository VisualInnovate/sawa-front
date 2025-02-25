<template>
  <Nave />
  <div class="banner flex items-center h-[35vh] lg:h-[55vh] relative">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png">
    <div class="z-50 text-white m-auto w-[80%]">
      <H1 class="font-bold text-5xl text-white z-50">{{ $t("bookings") }}</H1>
      <div class="flex py-8">
        <p class="text-2xl font-semibold"> {{ $t("home") }}</p>
        <svg class="my-auto mx-[1%] ltr:rotate-180" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.999878 6.49976L16.9999 6.49976" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5.99972 11.5C5.99972 11.5 0.999767 7.81756 0.999756 6.49996C0.999744 5.18237 5.99976 1.5 5.99976 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="text-2xl font-semibold"> {{ $t("bookings") }}</p>
      </div>
    </div>
  </div>

  <div>
    <div class="max-w-[1300px] mx-auto py-[4%]">
      <div class="flex justify-between w-full m-auto px-2">
        <h3 class="font-bold text-2xl text-[#303843]">{{ $t("bookings") }}</h3>
        <Button @click="AddBooking" class="create" :label='$t("Add_new_booking")'></Button>
      </div>
      <div class="p-3 grid grid-cols-2 lg:grid-cols-4 gap-8 m-auto animate__animated animate__backInRight animate__delay-1s">
        <div class="detail w-full shadow-xl rounded-lg grid grid-cols-2 gap-2 p-3 relative" v-for="book in booking">
          <div class="h-full m-auto w-full bg-cover bg-no-repeat bg-center rounded-lg p-5" :style="{ backgroundImage: `url(${book?.user_image})` }"></div>
          <div>
            <h3 class="font-bold text-[#303843]">{{ book?.user_name }}</h3>
            <p class="text-lg py-1 border-b-2 text-[#44A2AD]">{{ book?.user_title }}</p>
            <p class="text-lg py-1 text-[#EB486D]">{{ $t(moment(book?.event_date).format("DD-MM-YY")) }}</p>
            <p class="text-lg py-1 text-[#EB486D]">{{ moment(book?.event_date).format("hh:mm: A") }}</p>
            <p v-if="book?.accepted == 0" class="px-2 py-2 bg-yellow-400 text-white rounded-lg font-medium text-center">{{ $t("Pending") }}</p>
            <p v-if="book?.accepted == 1" class="px-2 py-2 bg-green-700 text-white rounded-lg font-medium text-center">{{ $t("Accept") }}</p>
            <p v-if="book?.accepted == 2" class="px-2 py-2 bg-red-700 text-white rounded-lg font-medium text-center">{{ $t("Cancell") }}</p>
          </div>
          <!-- Tooltip Message -->
          <div class="tooltip rounded-md absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 text-white flex flex-col items-center justify-center opacity-0 transition-opacity duration-300">
               <p class="absolute top-2">ملاحظات المستشار</p>
               <p v-if="book?.accepted_notes !=null " > {{ book?.accepted_notes }}</p>
               <p v-else > لا يوجد ملاحظات</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <About />
</template>

<script setup>
import Nave from "../components/Nave.vue";
import AppointmentRecords from "../components/AppointmentRecords.vue";
import About from "../components/About.vue";
import moment from "moment";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
import { ref, onMounted } from 'vue';

const booking = ref({});

const getAllBooking = () => {
  axios
    .get("/api/calender/appointments")
    .then((res) => {
      booking.value = res.data.bookings;
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const AddBooking = () => {
  router.push({ name: 'clidreen_parents' });
};

onMounted(() => {
  getAllBooking();
});
</script>

<style scoped>
.detail {
  position: relative;
}

.tooltip {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.detail:hover .tooltip {
  opacity: .8;
}
</style>