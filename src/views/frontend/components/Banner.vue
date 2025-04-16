<template>
     <div  class="banner flex items-center h-[35vh] lg:h-[35vh] relative bg-cover bg-no-repeat " :style="{ backgroundImage: `url(${banner})` }">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#193f47] opacity-40 w-full h-full z-50"></div>

    <div class="z-50 text-white m-auto w-[80%] ">
      <H1 class="font-bold text-5xl text-white z-50">{{ heading}}</H1>
     <div class="flex py-8 ">
      <p class="text-2xl font-semibold "> {{ $t("home") }}</p>
      <svg class="my-auto mx-[1%] ltr:rotate-180" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.999878 6.49976L16.9999 6.49976" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.99972 11.5C5.99972 11.5 0.999767 7.81756 0.999756 6.49996C0.999744 5.18237 5.99976 1.5 5.99976 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="text-2xl font-semibold "> {{ title }}</p>
     </div>
    </div>
   </div>
</template>
<script>
import Nave from "../components/Nave.vue";
import Sidbar from "../components/Sidbar.vue";
import banner from '../image/header/112.png'
import About from "../components/About.vue";
import Knob from "primevue/knob";
import FileUpload from "primevue/fileupload";
import { useParentStore } from "../../../stores/ParentStore";
import axios from "axios";

export default {
  components: { Nave, Sidbar, About, Knob, FileUpload },
  props:{
    heading:null,
    title:null
  },
  data() {
    return {
      banner:banner,
      imageSrc: null,
      image: null,
      parentStore: useParentStore(),
      parent: {},
   
    };
  },
  methods: {

  

   
  
  },
 
 
};
</script>