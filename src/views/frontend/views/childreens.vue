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
        <Button @click="Newchilde" class="create h-11" :label='$t("Add_new_child")'></Button>
   </div>
  <!-- Double-Faced Cards for Each Child -->
 <div class="w-full grid grid-cols-1 lg:grid-cols-4 py-5  ">
  
  <div v-for="(child, index) in childs" :key="child.id" class="flip-card">
  <div class="flip-card-inner">
    <!-- Front Side -->
    <div class="flip-card-front  bg-gradient-to-r from-[#ffff] to-[#ED5586]">
      <img :src="child.image" alt="Child Image" class="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
      <h2 class="text-lg font-semibold mt-2">{{ child.name }}</h2>
      <p class="text-base pt-1 text-gray-600">{{ $t("child_age") }}: {{ child.age }}</p>
      <p class="text-base pt-1 text-gray-600">{{ $t("selectgender") }}: {{ child.gender === '0' ? 'ذكر' : 'أنثى' }}</p>
      <p class="text-base pt-1 text-gray-600">{{ $t("primary_language") }}: {{ child.lang }}</p>
      <p class="text-base pt-1 text-gray-600">{{ $t("Nationality") }}: {{ child.nationalty }}</p>
      <i class="pi pi-arrow-right mt-4 text-xl"></i>
    </div>
    
    <!-- Back Side -->
    <div class="flip-card-back bg-gradient-to-r from-[#74dbc7] to-[#618990]">
      <h2 class="text-lg font-semibold">التقييم</h2>
      <p v-if="child.evaluations.length > 0" class="mt-2 text-sm text-center">{{ child.evaluations.join(', ') }}</p>
      <p v-else class="mt-2 text-sm">لا توجد تقييمات متاحة</p>
      <button @click="checkChildStatus(child.id)" class="mt-auto bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200">{{ $t("Evaluation_stage") }}</button>
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
        }else{
          this.$router.push({ name: "request-meeting", params: { child_id: id, } });
   
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
.flip-card {
  perspective: 1000px;
  width: 288px; /* Adjust based on your design */
  height: 320px; /* Adjust based on your design */
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.flip-card-front {
  background-color: #f8fafc; /* Front side background color */
}

.flip-card-back {
  background-color: #3b82f6; /* Back side background color */
  color: white;
  transform: rotateY(180deg);
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
