<template>
  <Nave />
  <div  class="banner flex items-center h-[35vh] lg:h-[55vh] relative ">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png">
    <div class="z-50 text-white m-auto w-[80%] ">
      <H1 class="font-bold text-5xl text-white z-50">{{ $t("The_latest_developments") }}</H1>
     <div class="flex py-8 ">
      <p class="text-2xl font-semibold "> {{ $t("home") }}</p>
      <svg class="my-auto mx-[1%] ltr:rotate-180" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.999878 6.49976L16.9999 6.49976" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.99972 11.5C5.99972 11.5 0.999767 7.81756 0.999756 6.49996C0.999744 5.18237 5.99976 1.5 5.99976 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="text-2xl font-semibold "> {{ $t("The_latest_developments") }}</p>
     </div>
    </div>
   </div>

   <div >
      <div class="max-w-[1300px] mx-auto  py-[4%] ">
        <div class="flex justify-between w-full m-auto px-2">
           <h3 class="font-bold text-2xl text-[#303843]">{{ $t("The_latest_developments") }}</h3>
        </div>
        
        <div class="card mt-3">
        <Accordion v-for="x in 4" :activeIndex="1" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
            <AccordionTab>
                <template #header>
                    <span class="flex align-items-center gap-2 w-full">
                        <Avatar image="../image/childern.jpg" shape="circle" />
                        <span class="font-bold white-space-nowrap">Amy Elsner</span>
                        <Badge value="3" class="ml-auto mr-2" />
                    </span>
                </template>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </AccordionTab>
          
          
        </Accordion>
      </div>
      </div>
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


  <About />
</template>
<script>
import NewAcorrding from "../components/NewAcorrding.vue";
import Sidbar from "../components/Sidbar.vue";
import About from "../components/About.vue";
import axios from "axios";
import Nave from "../components/Nave.vue";
export default {
  components: { Nave, NewAcorrding, Sidbar, About },
  data() {
    return {
      showsider: false,
      notifications: [],
    };
  },
  methods: {
    toggle() {
      this.showsider = !this.showsider;
    },
    getNotifications() {
      axios
        .get("/api/parent/notification")
        .then((res) => {
          this.notifications = res.data.notifications;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getNotifications();
  },
};
</script>
<style>
.item:hover {
  background-color: #e6f8f6;
  transition: all linear 300ms;
}
</style>