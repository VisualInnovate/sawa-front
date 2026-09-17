<template>
  <Nave></Nave>
  <div  class="banner flex items-center h-[35vh] lg:h-[55vh] relative ">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png">
    <div class="z-50 text-white m-auto w-[80%] ">
      <h1 class="font-bold text-5xl text-white z-50">{{ $t("bookings") }}</h1>
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

      <div class="booking-wrap">
        <div class="booking-intro">
          <h2>{{ $t("Book_an_appointment_with_the_specialist") }}</h2>
          <p>{{ $t("booking_pick_day") }}</p>
        </div>

        <div v-if="loading" class="booking-days">
          <Skeleton v-for="i in 6" :key="i" height="9rem" borderRadius="1rem" />
        </div>
        <Message v-else-if="!availableDays.length" severity="info" :closable="false" class="booking-empty">
          {{ $t("booking_no_days") }}
        </Message>
        <div v-else class="booking-days">
          <button
            v-for="day in availableDays"
            :key="day.date"
            type="button"
            class="booking-day"
            @click="openDay(day)"
          >
            <span class="booking-day__weekday">{{ $t(day.weekday) }}</span>
            <span class="booking-day__number">{{ day.dayNumber }}</span>
            <span class="booking-day__month">{{ day.monthLabel }}</span>
            <span class="booking-day__cta">
              {{ $t("booking_view_times") }}
              <i class="pi pi-arrow-left ltr:rotate-180" />
            </span>
          </button>
        </div>
      </div>

      <Dialog
        v-model:visible="slotsDialog"
        :header="selectedDay ? `${$t('المواعيد المتاحة')} — ${$t(selectedDay.weekday)} ${selectedDay.fullLabel}` : $t('المواعيد المتاحة')"
        modal
        :style="{ width: '32rem' }"
        :breakpoints="{ '640px': '94vw' }"
      >
        <div v-if="slotsLoading" class="booking-slots">
          <Skeleton v-for="i in 4" :key="i" height="3.5rem" borderRadius="0.75rem" />
        </div>
        <Message v-else-if="!slots.length" severity="warn" :closable="false">
          {{ $t("booking_no_slots_day") }}
        </Message>
        <div v-else class="booking-slots">
          <div v-for="time in slots" :key="time.id" class="booking-slot">
            <div class="booking-slot__info">
              <i class="pi pi-clock" />
              <div>
                <p class="booking-slot__time" dir="ltr">{{ time.start }} – {{ time.end }}</p>
                <p v-if="time.title" class="booking-slot__title">{{ time.title }}</p>
              </div>
            </div>
            <Button :label="$t('Book_now')" size="small" @click="submit(time.id)" />
          </div>
        </div>
      </Dialog>
    </section>
    <About />
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import Map from "../components/Map.vue";
import About from "../components/About.vue";
import Nave from "./Nave.vue";

export default {
  components: { Map, About, Nave },
  data() {
    return {
      availableDays: [],
      loading: true,
      slots: [],
      slotsLoading: false,
      slotsDialog: false,
      selectedDay: null,
      slotsRequest: 0,
    };
  },
  methods: {
    async getEvents() {
      this.loading = true;
      try {
        const res = await axios.get("/api/event-calendar/get/front");
        // The API groups dates by weekday name; show them as one chronological list.
        const locale = localStorage.getItem("appLang") === "en" ? "en" : "ar";
        const dates = Object.values(res.data.data || {})
          .flatMap((events) => events || [])
          .map((event) => event.start);
        this.availableDays = [...new Set(dates)].sort().map((date) => {
          const day = moment(date, "YYYY-MM-DD");
          return {
            date,
            weekday: day.clone().locale("en").format("dddd"),
            dayNumber: day.format("D"),
            monthLabel: new Intl.DateTimeFormat(locale, { month: "long" }).format(day.toDate()),
            fullLabel: new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(day.toDate()),
          };
        });
      } catch (err) {
        this.availableDays = [];
        console.error("Error fetching events:", err);
      } finally {
        this.loading = false;
      }
    },
    async openDay(day) {
      const request = ++this.slotsRequest;
      this.selectedDay = day;
      this.slots = [];
      this.slotsLoading = true;
      this.slotsDialog = true;
      try {
        const response = await axios.get(`/api/event-calendar/get/${day.date}/slots`);
        if (request !== this.slotsRequest) return;
        this.slots = [...(response.data.data || [])].sort((a, b) => a.start.localeCompare(b.start));
      } catch (err) {
        // The API answers 404 when the day has no free slot left.
        if (request === this.slotsRequest) this.slots = [];
      } finally {
        if (request === this.slotsRequest) this.slotsLoading = false;
      }
    },
    submit(id) {
      this.$router.push({ name: "more", params: { event_id: id, child_id: this.$route.params.child_id } });
    },
  },
  mounted() {
    this.getEvents();
  },
};
</script>

<style scoped>
.booking-wrap {
  padding: 1rem clamp(1rem, 5vw, 4rem) 3rem;
}
.booking-intro h2 {
  font-size: clamp(1.5rem, 3vw, 1.9rem);
  font-weight: 700;
  color: #1e293b;
}
.booking-intro p {
  margin-top: 0.35rem;
  color: #64748b;
  font-size: 1.05rem;
}
.booking-days {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 1rem;
}
.booking-empty {
  margin-top: 1.5rem;
}
.booking-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 1rem 0.75rem;
  border: 1px solid #d5e5e7;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1px 3px rgb(15 23 42 / 0.06);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
}
.booking-day:hover,
.booking-day:focus-visible {
  transform: translateY(-2px);
  border-color: #135c65;
  box-shadow: 0 8px 20px rgb(19 92 101 / 0.15);
  outline: none;
}
.booking-day__weekday {
  font-weight: 600;
  color: #135c65;
}
.booking-day__number {
  font-size: 2.25rem;
  line-height: 1.1;
  font-weight: 700;
  color: #0f172a;
}
.booking-day__month {
  color: #64748b;
  font-size: 0.95rem;
}
.booking-day__cta {
  margin-top: 0.6rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  background: #e6f1f2;
  color: #135c65;
  font-size: 0.85rem;
  font-weight: 600;
}
.booking-day__cta .pi {
  font-size: 0.7rem;
}
.booking-slots {
  display: grid;
  gap: 0.75rem;
}
.booking-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #f8fafc;
}
.booking-slot__info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.booking-slot__info .pi {
  color: #135c65;
  font-size: 1.1rem;
}
.booking-slot__time {
  font-weight: 700;
  color: #0f172a;
}
.booking-slot__title {
  color: #64748b;
  font-size: 0.85rem;
}
</style>
