<template>
  <Nave />
  <div  class="max-w-[1300px] mx-auto  py-[4%] ">
      <h1 class="font-bold text-5xl text-center text-[#303843] z-50">{{ $t("Requests") }}</h1>
   </div>

   <div >
      <div class="max-w-[1300px] mx-auto  py-[4%] ">
      
        <div class="card mt-3 px-4">

          <div v-if="!childs.length" class="empty-state bg-white rounded-xl border">
            <i class="pi pi-users" />
            {{ $t("no_children_yet") }}
          </div>
          <div v-else class="grid gap-3">
            <router-link v-for="child in childs" :key="child.id" :to="{ name: 'clidreen_parents' }"
              class="bg-white rounded-xl border p-4 flex items-center justify-between hover:border-[#135c65]">
              <span class="font-bold text-[#303843]">{{ child.name }}</span>
              <i class="pi pi-angle-left follow-arrow" aria-hidden="true"></i>
            </router-link>
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
          this.childs = res.data.childs ?? [];
        })
        .catch((err) => {
          console.log(err);
        });
    },

    Newchilde(){
      this.$router.push({ name: 'BookingTime' })
    }
  },

  mounted() {
    this.getChilds();
  },
};
</script>

<style scoped>
[dir="ltr"] .follow-arrow {
  transform: scaleX(-1);
}
</style>
