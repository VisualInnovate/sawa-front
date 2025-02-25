<template>
  <Nave />
  <div class="banner flex items-center h-[35vh] lg:h-[55vh] relative">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png">
    <div class="z-50 text-white m-auto w-[80%]">
      <H1 class="font-bold text-5xl text-white z-50">{{ $t("الاطفال") }}</H1>
      <div class="flex py-8">
        <p class="text-2xl font-semibold"> {{ $t("home") }}</p>
        <svg class="my-auto mx-[1%] ltr:rotate-180" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.999878 6.49976L16.9999 6.49976" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5.99972 11.5C5.99972 11.5 0.999767 7.81756 0.999756 6.49996C0.999744 5.18237 5.99976 1.5 5.99976 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="text-2xl font-semibold"> {{ $t("الاطفال") }}</p>
      </div>
    </div>
  </div>
  <div class="max-w-[1300px] mx-auto py-[4%]">
  <div class="flex justify-between w-full m-auto px-2">
        <h3 class="font-bold text-2xl text-[#303843]">{{ $t("children") }}</h3>
        <Button @click="Newchilde" class="create" :label='$t("Add_new_child")'></Button>
   </div>
  <!-- Double-Faced Cards for Each Child -->
 <div class="w-full grid grid-cols-1 lg:grid-cols-4 py-5  ">
  
  <div v-for="(child, index) in childs" :key="child.id" class="  ">
      <div class="flex justify-center items-center   rtl">
  <div
    class="relative w-72 h-80 cursor-pointer perspective"
    @mouseenter="flipped = true"
    @mouseleave="flipped = false"
  >
    <div
      class="w-full h-full transition-transform duration-500 transform-style preserve-3d"
      :class="{ 'rotate-y-180': flipped }"
    >
      <!-- Front Side -->
      <div class="absolute w-full h-full bg-white shadow-lg rounded-lg backface-hidden flex flex-col items-center p-4 text-right">
        <img :src="child.image" alt="Child Image" class="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
        <h2 class="text-lg font-semibold mt-2">{{ child.name }}</h2>
        <p class="text-base pt-1 text-gray-600">{{ $t("child_age") }}: {{ child.age }}</p>
        <p class="text-base pt-1 text-gray-600">{{ $t("selectgender") }}: {{ child.gender === '0' ? 'ذكر' : 'أنثى' }}</p>
        <p class="text-base pt-1 text-gray-600">{{ $t("primary_language") }}: {{ child.lang }}</p>
        <p class="text-base pt-1 text-gray-600">{{ $t("Nationality") }}: {{ child.nationalty }}</p>
      </div>
      
      <!-- Back Side -->
      <div class="absolute w-full h-full create text-white shadow-lg rounded-lg backface-hidden rotate-y-180 flex flex-col items-center p-4 text-right">
        <h2 class="text-lg font-semibold">التقييم</h2>
        <p v-if="child.evaluations.length > 0" class="mt-2 text-sm text-center">{{ child.evaluations.join(', ') }}</p>
        <p v-else class="mt-2 text-sm">لا توجد تقييمات متاحة</p>
        <button @click="checkChildStatus(child.id)" class="mt-auto bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200">{{ $t("Evaluation_stage") }}</button>
      </div>
    </div>
  </div>
</div>
  </div>
 </div>
</div>




  <About />
</template>

<script>
import Map from "../components/Map.vue";
import According from "../components/According.vue";
import Sidbar from "../components/Sidbar.vue";
import Nave from "../components/Nave.vue";
import About from "../components/About.vue";
import { useParentStore } from "../../../stores/ParentStore";
import axios from "axios";

export default {
  components: { Map, According, Sidbar, About, Nave },
  data() {
    return {
      flipped: false,
      showsider: false,
      childs: [],
      flippedCards: [], // Track flip state for each card
      parentStore: useParentStore(),
      errors: [],
    };
  },
  methods: {
    toggle() {
      this.showsider = !this.showsider;
    },
    checkChildStatus(id) {
      axios.get(`/api/child/${id}/check-active-booking`).then((res) => {
        if (!res.data.active) {
          this.$router.push({ name: "BookingTime", params: { child_id: id, } });
        }
      });
    },
    async getChilds() {
      await axios
        .get("/api/parent/child/all")
        .then((res) => {
          this.childs = res.data.childs;
          // Initialize flippedCards array with false for each child
          this.flippedCards = new Array(this.childs.length).fill(false);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    flipCard(index) {
      // Toggle the flip state for the specific card
      this.$set(this.flippedCards, index, !this.flippedCards[index]);
    },
    goToNextPage(childId) {
      // Add logic to navigate to the next page with childId
      alert(`Navigating to the next page for child ID: ${childId}`);
    },
    Newchilde() {
      this.$router.push({ name: "ReAction" });
    },
  },
  mounted() {
    this.getChilds();
  },
};
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.rtl {
  direction: rtl;
}
</style>
