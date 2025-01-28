<template>
  <Nave />

  <div  class="banner flex items-center h-[35vh] lg:h-[55vh] relative ">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png">
    <div class="z-50 text-white m-auto w-[80%] ">
      <H1 class="font-bold text-5xl text-white z-50">{{ $t(" نتيجه التقييم") }}</H1>
     <div class="flex py-8 ">
      <p class="text-2xl font-semibold "> {{ $t("home") }}</p>
      <svg class="my-auto mx-[1%] ltr:rotate-180" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.999878 6.49976L16.9999 6.49976" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.99972 11.5C5.99972 11.5 0.999767 7.81756 0.999756 6.49996C0.999744 5.18237 5.99976 1.5 5.99976 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="text-2xl font-semibold "> {{ $t(" نتيجه التقييم") }}</p>
     </div>
    </div>
   </div>
   <div >
      <div class="max-w-[1300px] mx-auto  py-[4%] ">
        <div class="flex justify-between w-full m-auto px-2">
           <h3 class="font-bold text-2xl text-[#303843]">{{ $t("evaluation_result") }}</h3>
           <Button @click="AddBooking" class="create" :label='$t("اضافه طفل جديد")'></Button>
        </div>
      
      </div>
    </div>



 
  <About />
</template>
<script>
import Nave from "../components/Nave.vue";
import According from "../components/According.vue";
import Sidbar from "../components/Sidbar.vue";
import About from "../components/About.vue";
import { useParentStore } from "../../../stores/ParentStore";
import axios from "axios";
export default {
  components: { Nave, According, Sidbar, About },
  data() {
    return {
      showsider: false,
      routername:"",
      childs: [],
      parentStore: useParentStore(),
      errors: [],
    };
  },
  methods: {
    toggle() {
      this.showsider = !this.showsider;
    },
    async getChilds() {
      await axios
        .get("/api/parent/child/all")
        .then((res) => {
          this.childs = res.data.childs;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    
  },


  mounted() {
    this.getChilds();
  },
};
</script>
