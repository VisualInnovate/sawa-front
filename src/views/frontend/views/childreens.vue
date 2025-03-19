<template>
  <Nave />
 <Banner heading="الاطفال" title=" يمكنك اضافة طفل من هنا"></Banner>
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
import Banner from '../components/Banner.vue'

import { useParentStore } from "../../../stores/ParentStore";
import axios from "axios";

export default {
  components: { Map, According, Sidbar, About, Nave ,Banner},
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
