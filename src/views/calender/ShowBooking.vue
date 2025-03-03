<template>
  <div class="mt-6 p-6">
    <!-- Page Title -->
    <h1 class="border-b-2 border-green-800 text-3xl w-full md:w-1/2 uppercase text-green-800 py-4 font-bold">
      {{ $t("bookings") }}
    </h1>

    <!-- Bookings List -->
    <v-card class="mt-6 shadow-lg rounded-lg overflow-hidden">
      <div class="p-6">
        <Accordion v-for="booking in bookings" :key="booking.id" :activeIndex="1" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
          <AccordionTab :header="booking.child_name" class="mb-4">
            <!-- Booking Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column: Booking Information -->
              <div class="space-y-4">
                <div class="flex items-center">
                  <p class="text-lg font-bold text-green-800">{{ $t("child_age") }}:</p>
                  <p class="ml-3 text-base text-gray-700">{{ booking.child_age }}</p>
                </div>
                <div class="flex items-center">
                  <p class="text-lg font-bold text-green-800">{{ $t("parent.phone") }}:</p>
                  <p class="ml-3 text-base text-gray-700">{{ booking.details.requester_phone }}</p>
                </div>
                <div class="flex items-center">
                  <p class="text-lg font-bold text-green-800">{{ $t("موعد الاستشارة") }}:</p>
                  <p class="ml-3 text-base text-gray-700">{{ booking.event_date || "N/A" }}</p>
                </div>
              </div>

              <!-- Right Column: Action Button -->
              <div class="flex justify-end items-center">
                <Button
                  @click="bookingDetailes(booking.id)"
                  icon="pi pi-arrow-right"
                  class="p-button-success p-button-outlined"
                  :label='$t("متابعة التفاصيل")'
                />
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      bookings: [],
      booking_result: "",
      booking_id: null,
      show_result_modal: false,
    };
  },
  methods: {
    getBookings() {
      axios
        .get("/api/calender/bookings")
        .then((res) => {
          this.bookings = res.data.bookings;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    bookingDetailes(id) {
      this.$router.push({ name: "BookingDetails", params: { id: id } });
    },
    openModal(booking_id) {
      this.show_result_modal = true;
      this.booking_id = booking_id;
    },
    addNote() {
      axios
        .patch(`/api/calender/bookings/${this.booking_id}`, {
          booking_result: this.booking_result,
        })
        .then((res) => {
          this.show_result_modal = false;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getBookings();
  },
};
</script>

<style scoped>
/* Custom Styles */
.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.p-accordion-tab {
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.p-accordion-tab:hover {
  background-color: #f0fdf4;
}

.p-button-success {
  border-color: #10b981;
  color: #10b981;
}

.p-button-success:hover {
  background-color: #10b981;
  color: white;
}
</style>