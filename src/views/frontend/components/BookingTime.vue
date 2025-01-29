<template>
  <Nave></Nave>
  <div  class="banner flex items-center h-[35vh] lg:h-[55vh] relative ">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png">
    <div class="z-50 text-white m-auto w-[80%] ">
      <H1 class="font-bold text-5xl text-white z-50">{{ $t("bookings") }}</H1>
     <div class="flex py-8 ">
      <p class="text-2xl font-semibold "> {{ $t("home") }}</p>
      <svg class="my-auto mx-[1%] ltr:rotate-180" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.999878 6.49976L16.9999 6.49976" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.99972 11.5C5.99972 11.5 0.999767 7.81756 0.999756 6.49996C0.999744 5.18237 5.99976 1.5 5.99976 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="text-2xl font-semibold "> {{ $t("bookings") }}</p>
     </div>
    </div>
   </div>
  <div class="switcher">
    <Map />
    <section class="bg-gray-50 dark:bg-gray-900 bg-no-repeat bg-cover backdrop-blur-sm bg-white/30 my-4">
      <div class="backdrop-blur-sm bg-white/30 p-6">
        <div class="mx-auto lg:py-0 text-center mb-4">
          <h1 class="text-3xl py-2 font-bold sec2 pb-3">
            {{ $t("Book_an_appointment") }}
          </h1>
          <p class="text-xl sec1">{{ $t("Consult_doctors_for_your_child_condition") }}</p>
          <p class="text-xl sec1">
            {{ $t("And_communicate_correctly_to_give_you_the_appropriate_diagnosis") }}
          </p>
        </div>
      </div>
      <div class="px-[5%]">
        <p class="pb-4 text-3xl font-bold">{{ $t("Book_an_appointment_with_the_specialist") }}</p>
        <p class="sec1 text-xl">{{ $t("You_can_choose_the_appropriate") }}</p>
      </div>
      <div class="px-4 py-[4%] lg:p-[5%] overflow-x-auto">
        <v-table class="min-w-full border-2 border-[#967a80]">
          <thead>
            <tr class="details border-b-2 border-[#474042]">
              <th class="text-white w-52 text-center" v-for="day in Object.keys(tableEvent)" :key="day">
                {{ $t(day) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in max" :key="i">
              <td
                v-for="(events, day) in tableEvent"
                :key="day"
                class="w-60 relative p-[0_0.3rem]"
              >
              <div 
                  @click="getSolts(events[i - 1].start)" 
                  v-if="events[i - 1]" 
                  class="group rounded-full border-2 border-gray-500 w-full py-2  hover:bg-slate-700 cursor-pointer" 
                >
                  <p 
                    class="m-auto  text-center text-red-700 duration-300 delay-200 transition-opacity w-full px-1 text-[11px] font-medium group-hover:hidden"
                  >
                    {{ events[i - 1].start }}
                  </p>
                  <label 
                    class="m-auto text-center cursor-pointer text-white duration-300 delay-200 transition-opacity w-full px-1 text-[13px]  font-medium hidden group-hover:block"
                  >
                    {{ $t("show_details") }}
                  </label>
                    </div>
                <div v-else class="rounded-full w-full bg-gray-300 py-4 text-center"></div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("المواعيد المتاحة")' :modal="true">
          <div v-for="time in  solts" class="text-center flex">
            <button @click="submit(time.id)" class="text-[red]">{{ $t("Book_now") }}</button>
            <p class="font-bold p-1">{{ time.end }}</p>
            <p class="font-bold p-1">{{ $t("to") }}</p>
            <p class="font-bold p-1">{{ time.start }}</p>
            <p class="font-bold p-1">{{ $t("from") }}</p>
           <p class="font-bold p-1">{{ time.title }}</p>

         
       
      
            
          </div>
        
        </Dialog>
    </section>
    <About />
  </div>
</template>
<script>
import axios from "axios";
import Map from "../components/Map.vue";
import About from "../components/About.vue";
import Nave from "./Nave.vue";

export default {
  data() {
    return {
      events: {}, // Stores the API response directly
      tableEvent: {},
      solts:{}, // Normalized events grouped by day
      max: 0,
      deleteDialog:false // Maximum number of events in any day
    };
  },
  components: { Map, About,Nave },
  methods: {
    async getEvents() {
      try {
        const res = await axios.get("/api/event-calendar/get/front");
        this.events = res.data.data;

        // Ensure `null` days are replaced with empty arrays
        this.tableEvent = Object.keys(this.events).reduce((acc, day) => {
          acc[day] = this.events[day] || [];
          return acc;
        }, {});

        // Calculate the maximum number of rows
        this.max = Math.max(...Object.values(this.tableEvent).map((day) => day.length));
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    },
    getSolts(date){
      this.deleteDialog=!(this.deleteDialog)
     axios.get(`/api/event-calendar/get/${date}/slots`) .then((response) => {
          this.solts = response.data.data;
          
        });
      
    
    },
    submit(id) {
      this.$router.push({ name: "more", params: { event_id: id } });
    },
  },
  mounted() {
    this.getEvents();
  },
};
</script>

<style >
.no-scrollbar {
  overflow: hidden;
  scrollbar-width: none; /* Firefox */
}

.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.trans {
  color: red;
  transform: translateX(-100%);
  transition: transform 200ms linear;
}

td:hover button {
  transform: translateX(20%);
}
.hover-div {
  position: relative;
  cursor: pointer;
}
.hover-content {
  transition: opacity 0.9s ease;
}
.hidden-label {
  display: none;
}
.hover-div:hover .hover-content {
  display: none;
}
.hover-div:hover .hidden-label {
  display: block;
}
</style>
