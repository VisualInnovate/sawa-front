<template>
  <div class="mt-6">
    <h1 class="border-b text-3xl w-full md:w-1/2 uppercase text-green-800 py-4">
      {{ $t("bookings") }}
    </h1>
      <v-card>
        <div class="card p-[1%]">
        <Accordion v-for="booking in bookings" :activeIndex="1" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
             <AccordionTab :header="booking.child_name  ">
              
                <div class="grid grid-cols-2 gap-2">
                   <div>
                      
                       <div class="flex">
                          <p class="my-auto text-lg font-bold " > {{ $t("child_age") }} : </p>
                          <p class="my-auto px-3 text-base text-slate-600  "> {{  booking.child_age }}</p>
                       </div>
                       <div class="flex">
                          <p class="my-auto text-lg font-bold " > {{ $t("parent.phone") }} : </p>
                          <p class="my-auto px-3 text-base text-slate-600  "> {{ booking.requester_phone }} </p>
                       </div>
                     
                       <div class="flex">
                          <p class="my-auto text-lg font-bold " > {{ $t("موعد الاستشارة") }} : </p>
                          <p class="my-auto px-3 text-base text-slate-600  "> {{ booking.event_date }} </p>
                       </div>
                   </div>
                   <div>
                    <Button @click="bookingDetailes(booking.id)" icon="pi pi-arrow-left"  class="create" :label='$t(" متابعة التفاصيل")'></Button>
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
    bookingDetailes(id){
        
      this.$router.push({name:'BookingDetails',params:{id:id}})
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
.item:hover {
  background-color: #e6f8f6;
  transition: all linear 300ms;
}
</style>
