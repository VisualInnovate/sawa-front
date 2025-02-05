<template>
  <div class="px-4 relative">
    <div>
      <v-alert
        class="fixed z-10"
        color="success"
        icon="$success"
        title="Booked Successfully"
        :text="alert_text"
        v-if="show_alert"
        >
    </v-alert>

    </div>
    <div class="md:grid flex flex-col gap-5 sm:grid-cols-6">
      <div class="p-0 m-auto">
        <img class="m-auto" src="../image/header/calendar-01nobg-01.png" />
      </div>
      <div class="col-span-4 text-center m-auto">
        <p class="flex items-center text-3xl">

          <div class="flex items-center">
            <p class=" text-[#FF3765]">
                {{ event_day(event) }}
              </p>
              <p class="px-2  text-[#FF3765]">
                {{ event_hour(event) }}
              </p>
          </div>
          <svg
            fill="#135C65"
            width="35px"
            height="40px"
            viewBox="0 0 1024.00 1024.00"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#CCCCCC"
              stroke-width="18.432"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M266.815 537.708c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zm182.77 0c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zm182.775 0c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zm182.77 0c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zM266.815 679.347c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zm182.77 0c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zm182.775 0c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zm182.77 0c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zM266.815 820.988c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zm182.77 0c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zm182.775 0c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zm182.77 0c0 22.62-18.34 40.96-40.96 40.96s-40.96-18.34-40.96-40.96 18.34-40.96 40.96-40.96 40.96 18.34 40.96 40.96zM228.18 81.918v153.6c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48v-153.6c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48zm528.09 0v153.6c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48v-153.6c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48z"
              ></path>
              <path
                d="M890.877 137.517c33.931 0 61.44 27.509 61.44 61.44v703.375c0 33.931-27.509 61.44-61.44 61.44h-757.76c-33.931 0-61.44-27.509-61.44-61.44V198.957c0-33.931 27.509-61.44 61.44-61.44h757.76zm-757.76 40.96c-11.309 0-20.48 9.171-20.48 20.48v703.375c0 11.309 9.171 20.48 20.48 20.48h757.76c11.309 0 20.48-9.171 20.48-20.48V198.957c0-11.309-9.171-20.48-20.48-20.48h-757.76z"
              ></path>
              <path
                d="M575.03 338.288c0-33.93-27.51-61.44-61.44-61.44s-61.44 27.51-61.44 61.44c0 33.93 27.51 61.44 61.44 61.44s61.44-27.51 61.44-61.44zm40.96 0c0 56.551-45.849 102.4-102.4 102.4s-102.4-45.849-102.4-102.4c0-56.551 45.849-102.4 102.4-102.4s102.4 45.849 102.4 102.4z"
              ></path>
            </g>
          </svg>
        </p>
      </div>
     
    </div>
    <div class="m-auto p-8 rounded-2xl max-w-3xl  mb-4 shadow-lg">
      <div class="my-4">
        <h2 class="text-right font-bold text-xl">{{ $t("Book_an_appointment_with_the_specialist") }}</h2>
        <p class="text-right text-[#29CCFF] text-xl">{{ $t("Please_fill_in_the_information") }}</p>
      </div>
      <form class="py-4 min-w-full grid-cols-1  p-2 lg:grid grid-cols-2  gap-4" @submit.prevent="bookTime">
        <div class="flex flex-column gap-2">
                  <label class="w-full  " for="username">{{ $t('child_name') }}  </label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="booking.child_id"   option-value="id" :options="childs" optionLabel="name" :class="{ 'p-invalid': submitted && !booking.child_id}"  />
        </div>
        <div class="flex flex-column gap-2">
                  <label class="w-full  " for="username">{{     $t("اسم ولي امر  مقدم الطلب")}}  </label>
                <InputText required class="bg-[#f7f5f5] text-center"    v-model="booking.details.requester_name"  :class="{ 'p-invalid': submitted && !booking.requester_name}" />
        </div>
        <div class=" flex flex-column gap-2">
                  <label class="w-full  " for="username">{{ $t("درجه قرابته للطفل ")}}  </label>
                <InputText required class="bg-[#f7f5f5] text-center"     v-model="booking.details.relative_degree"  :class="{ 'p-invalid': submitted && !booking.relative_degree}" />
        </div>
        <div class=" flex flex-column gap-2">
                  <label class="w-full  " for="username">{{  $t("رقم هاتف ولي الامر")  }}  </label>
                <InputText required class="bg-[#f7f5f5] text-center"      v-model="booking.details.requester_phone"  :class="{ 'p-invalid': submitted && !booking.requester_phone}" />
        </div>
        <div class="flex flex-column gap-2">
                  <label class="w-full  " for="username">{{ $t("رقم هاتف اضافي") }}  </label>
                <InputText required class="bg-[#f7f5f5] text-center"      v-model="booking.details.addtional_phone"  :class="{ 'p-invalid': submitted && !booking.addtional_phone}" />
        </div>

        <div class=" flex flex-column gap-2">
                  <label class="w-full  " for="username">{{   $t("مالك الرقم الاضافي")   }}  </label>
                <InputText required class="bg-[#f7f5f5] text-center"      v-model="booking.details.addtional_phone_owner"  :class="{ 'p-invalid': submitted && !booking.addtional_phone_owner}" />
        </div>
        <div class=" flex flex-column gap-2">
                  <label class="w-full  " for="username">{{    $t("درجه قرابته بالطفل")   }}  </label>
                <InputText required class="bg-[#f7f5f5] text-center"      v-model="booking.details.addtional_phone_degree"  :class="{ 'p-invalid': submitted && !booking.addtional_phone_degree}" />
        </div>
        <div class=" flex flex-column gap-2">
                  <label class="w-full  " for="username">{{    $t("مصدر التحويل")  }}  </label>
                <InputText required class="bg-[#f7f5f5] text-center"      v-model="booking.details.conversion_type"  :class="{ 'p-invalid': submitted && !booking.conversion_type}" />
        </div>
        
        <div class=" col-span-2 flex flex-column gap-2">
                  <label class="w-full " for="username">{{     $t("الطبيب الخاص بالطفل")  }}  </label>
                <InputText required class="bg-[#f7f5f5] text-center"      v-model="booking.details.child_doctor"  :class="{ 'p-invalid': submitted && !booking.child_doctor}" />
        </div>
    

        <p class="lg:col-span-2 py-1 font-bold text-base text-right">اجب عن الاسئله الاتيه</p>
       
       
        <div class="lg:col-span-2 flex flex-column gap-2">
                  <label class="w-full  " for="username">{{ $t('نرجو تحديد نوع المشكله') }}  </label>
                  <Dropdown  placeholder="نرجو تحديد نوع المشكله"  required id="pv_id_1" style="direction: ltr !important;"   v-model="booking.details.child_problem"   :options="problem_type" optionLabel="name" :class="{ 'p-invalid': submitted && !booking.child_aids}" class="w-full " />
        </div>
        <div v-if="booking.details?.child_problem?.code == 5" class=" col-span-2 flex flex-column gap-2">
                  <label class="w-full " for="username">{{     $t("  برجاء تحديد نوع المشكلة")  }}  </label>
                <InputText required class="bg-[#f7f5f5] text-center"     v-model="booking.details.problem"  :class="{ 'p-invalid': submitted && !booking.problem}" />
        </div>
         <div class="lg:col-span-2 flex flex-column gap-2">
          <label class="w-full " for="username">{{     $t("التشخيص ان وجد")  }}  </label>
                <InputText  class="bg-[#f7f5f5] text-center" placeholder="التشخيص ان وجد"     v-model="booking.details.child_problems_notes"   />
        </div>
      
        <div class="lg:col-span-2 flex flex-column gap-2">
                  <label class="w-full  " for="username">{{ $t('هل يستخدم الطفل اي معينات حركيه / سمعيه/ بصريه') }}  </label>
                  <Dropdown             placeholder="هل يستخدم الطفل اي معينات حركيه / سمعيه/ بصريه"
                  required id="pv_id_1" style="direction: ltr !important;" v-model="booking.details.child_aids"   :options="approve" optionLabel="name" :class="{ 'p-invalid': submitted && !booking.child_aids}" class="w-full " />
        </div>
        <div v-if="booking.details?.child_aids?.id == 1" class=" col-span-2 flex flex-column gap-2">
                  <label class="w-full " for="username">{{     $t("    برجاء تحديد اسم المعين  ")  }}  </label>
                <InputText required class="bg-[#f7f5f5] text-center"     v-model="booking.details.aids"  :class="{ 'p-invalid': submitted && !booking.aids}" />
        </div>
        <div class="lg:col-span-2 flex flex-column gap-2">
                  <label class="w-full " for="username">{{     $t("اضف ملاحظات")  }}  </label>
                  <Textarea class="w-full" v-model="booking.details.child_aids_notes" rows="5" cols="30" :class="{ 'p-invalid': submitted && !booking.child_aids_notes}"/>
        </div>
        <div class="lg:col-span-2 flex flex-column gap-2">
                  <label class="w-full " for="username">{{     $t(" :المشاكل الرئيسيه لدي الطفل حاليا من وجهه نظر الاهل")  }}  </label>
                  <Textarea class="w-full"    v-model="booking.details.child_parents_problems" rows="5" cols="30" :class="{ 'p-invalid': submitted && !booking.child_parents_problems}"/>
        </div>
        <div class="lg:col-span-2 flex flex-column gap-2">
                  <label class="w-full " for="username">{{     $t("   :ما هي اولويه الاهل في البرامج التاهليه للتعامل مع الطفل")  }}  </label>
                  <Textarea class="w-full"    v-model="booking.details.parents_priorities" rows="5" cols="30" :class="{ 'p-invalid': submitted && !booking.parents_priorities}"/>
        </div>
        <div class="lg:col-span-2 flex flex-column gap-2">
                  <label class="w-full " for="username">{{     $t("اضف ملاحظات")  }}  </label>
                  <Textarea class="w-full" v-model="booking.details.child_aids_notes" rows="5" cols="30" :class="{ 'p-invalid': submitted && !booking.child_aids_notes}"/>
        </div>
        <div class="lg:col-span-2 flex flex-column gap-2">
                <InputNumber inputId="withoutgrouping" :useGrouping="false" fluid class="bg-[#f7f5f5] text-center" placeholder="كود الاستشاري ان وجد "     v-model="booking.details.doctor_code" :class="{ 'p-invalid': submitted && !booking.doctor_code}"  />
        </div>
     
        <div class="text-right m-auto w-full space-x-4">
          <span class="m-auto text-xl">انا اوافق علي كافه الشروط والاحكام</span>
          <input style="border: 2px solid black" type="checkbox" />
        </div>
        <Button class="bg-[#148A98] w-full"  @click="submitted=true" label="احجز الان" type="submit"></Button>
     
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import { useParentStore } from "../../../stores/ParentStore";
import moment from "moment";
import { Button } from "flowbite-vue";
export default {
  props: ["event_id"],
  components: {
    Dropdown,
    Textarea,
  },
  data() {
    return {
      parentStore: useParentStore(),
      selectedFruit: null,
      fruits: [
        { id: 0, name: "انثي" },
        { id: 1, name: "ذكر" },
      ],
      submitted:false,
      problem_type: [
        { name:this.$t("حركية"),code:1 },
        { name:this.$t("سمعيه"),code:2 },
        { name:this.$t("عقليه_نمائيه"),code:3 },
        { name:this.$t("توحد"),code:4 },
        { name:this.$t("اخر"),code:5 },
      
      ],
      approve: [
        { id: 1, name: "نعم" },
        { id: 0, name: "لا" },
      ],
      errors: [],
      childs: [],
      event: {},
      alert_text:'',
show_alert:false,
      booking: {
        details:{}
      },
    };
  },
  methods: {
    async bookTime() {
      this.booking.user_id=localStorage.getItem("parent_id")
      this.booking.event_id = this.event_id;
      this.show_alert = false;
      console.log(this.booking);
      await axios
        .post("/api/calender/store-booking", this.booking)
        .then((res) => {
        
          Object.keys(this.booking).forEach((key) => {
            this.booking[key] = null;
          });
          this.$router.push({name:'Booking'})
        })
        .catch((err) => {
          this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.$t("mission_error")}`, life: 3000 });

        });
    },
    async getEvent() {
      await axios
        .get(`/api/calender/booking/${this.event_id}`)
        .then((res) => {
          this.event = res.data.calender.start;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
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
    event_day(event_day) {
      
      let day = moment(event_day).format("dddd");

    
      
      return `${day}`;
    },
    event_hour(event_hour) {
      let hour = moment(event_hour).format("hh:mm: A");
      return `${hour}`;
    },
  },
 

  mounted( ) {
   
    this.getEvent();
    this.getChilds();
   
    console.log(this.event_id);
  },
};
</script>