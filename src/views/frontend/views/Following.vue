<template>
  <Nave />
  <div  class="max-w-[1300px] mx-auto  py-[4%] ">
      <h1 class="font-bold text-5xl text-center text-[#303843] z-50">{{ $t("Requests") }}</h1>
   </div>

   <div >
      <div class="max-w-[1300px] mx-auto  py-[4%] ">
      
        <div class="card mt-3 px-4">

          <Accordion v-for="child in childs" :activeIndex="1" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
             <AccordionTab :header="child.name  ">
              
                <div class="grid grid-cols-2 gap-2">
                 
                </div>
          </AccordionTab>
           
        </Accordion>


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
  components: { Map, According, Sidbar, About ,Nave},
  data() {
    return {
      showsider: false,
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

    Newchilde(){
      router.push({name:'BookingTime' })
    }
  },

  mounted() {
    this.getChilds();
  },
};
</script>
