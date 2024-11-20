<template>
  <div class="switcher">
    <Map />
    <section
      class="bg-gray-50 dark:bg-gray-900 bg-no-repeat bg-cover backdrop-blur-sm bg-white/30 my-4"
    >
      <div class="backdrop-blur-sm bg-white/30 p-6">
        <div class="mx-auto lg:py-0 text-center mb-4">
          <h1 class="text-3xl py-2 font-bold sec2 pb-3">
            {{ $t("Book_an_appointment") }}
          </h1>
          <p class="text-xl sec1">
            {{ $t("Consult_doctors_for_your_child_condition") }}
          </p>
          <p class="text-xl sec1">
            {{ $t("And_communicate_correctly_to_give_you_the_appropriate_diagnosis") }}
          </p>
        </div>
      </div>
      <div class="px-[5%] ">
        <p class="pb-4 text-3xl font-bold">
          {{ $t("Book_an_appointment_with_the_specialist") }}
        </p>
        <p class="sec1 text-xl">
          {{ $t("You_can_choose_the_appropriate") }}
        </p>
      </div>
      <div class="px-4  py-[4%] lg:p-[5%] min-w-[1399px]  overflow-x-auto">
        <v-table class="min-w-full border-2 border-[#967a80]  ">
          <thead>
            <tr class="details border-b-2 border-[#474042]">
              <th
                class="text-white w-52 text-center"
                v-for="(event, key) in tableEvent"
                :key="key"
              >
                {{ $t(key) }}
              </th>
            </tr>
          </thead>
          <tbody class="">
            <tr v-if="events.events && events.max" v-for="i in events.max" :key="i">
              <td
                class="w-60 relative p-[0_0.3rem]"
                v-for="j in Object.keys(events.events).length"
                :key="j"
              >
                <div
                  v-if="Object.values(tableEvent)[j-1][i-1]"
                  class="rounded-full border-2 border-gray-500 w-full py-2"
                >
                  <p
                    class="m-auto text-right w-full px-1 text-[11px] text-gray-700 font-medium"
                  >
                    {{ Object.values(tableEvent)[j - 1][i - 1]?.day }}
                    {{ Object.values(tableEvent)[j - 1][i - 1]?.start_time }}
                  </p>
                  <button
                    class="absolute top-[30%] left-5 text-sm trans pr-2 font-medium rounded-full px-2"
                    @click="submit(Object.values(tableEvent)[j - 1][i - 1]?.id)"
                  >
                    {{ $t("Book_now") }}
                  </button>
                </div>
                <div v-else class="rounded-full w-full bg-gray-300 py-4 text-center"></div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </section>
    <About />
  </div>
</template>

<script>
import axios from "axios";
import Map from "../components/Map.vue";
import About from "../components/About.vue";

export default {
  data() {
    return {
      events: [],
      tableEvent: {},
      max: 0,
    };
  },
  components: { Map, About },

  methods: {
    getEvents() {
      axios
        .post("/api/calender/events")
        .then((res) => {
          this.events = res.data.events;
          this.max = res.data.max;

          ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(day => {
            this.events.events[day] = this.events.events[day] || [];
            this.tableEvent[day] = this.events.events[day];
          });
        })
        .catch((err) => {
          console.log(err);
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
</style>
