<template>
  <v-card class="p-[1%]">
    <h1 class="border-b text-3xl w-full md:w-1/2 uppercase text-green-800 py-4">
      {{ $t("bookings") }} / {{ booking.requester_name }}
    </h1>
    <div class="w-full mt-4 py-2 ">
     
        <div class=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 bg-slate-50 gap-y-8 gap-x-4 shadow-md p-[1%]">

        <div class="flex " v-if="booking.requester_name ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >{{ $t("applicant") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.requester_name }}</p>

        </div>
        <div class="flex " v-if="booking.relative_degree ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("degree_closeness_child") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.relative_degree }}</p>

        </div>
        <div class="flex " v-if="booking.child_name ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("Full_Name") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.child_name }}</p>

        </div>
        <div class="flex " v-if="booking.child_birth_place ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("place_of_birth") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.child_birth_place }}</p>

        </div>
        <div class="flex " v-if="booking.child_birth_date ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("birth_date") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.child_birth_date }}</p>

        </div>
        <div class="flex " v-if="booking.child_lang ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("primary_language") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.child_lang }}</p>

        </div>
        <div class="flex " v-if="booking.child_nationalty ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("Nationality") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.child_nationalty }}</p>

        </div>
        <div class="flex " v-if="booking.child_national_id ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("national_number") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.child_national_id }}</p>

        </div>
        <div class="flex " v-if="booking.child_address ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("address") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.child_address }}</p>

        </div>
        <div class="flex " v-if="booking.requester_phone ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("phone_number") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.requester_phone }}</p>

        </div>
        <div class="flex " v-if="booking.addtional_phone ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("Additional_phone_number") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.addtional_phone }}</p>

        </div>
        <div class="flex " v-if="booking.addtional_phone_owner ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("owner_extra_number") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.addtional_phone_owner }}</p>

        </div>
        <div class="flex " v-if="booking.addtional_phone_degree ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("degree_closeness_child") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.addtional_phone_degree }}</p>

        </div>
        <div class="flex " v-if="booking.conversion_type ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("conversion_source") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.conversion_type }}</p>

        </div>
        
        <div class="flex " v-if="booking.doctor_code ">
          <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
          <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("Specialist_code") }} :</p>
          <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.doctor_code }}</p>
        </div>
        
        <div class="flex " v-if="booking.doctor_code ">
         <Button @click="show_answer_modal = true" class="create" icon="pi pi-arrow-left" :label='$t("Answer_the_questions")'></Button>

        </div>
       
        </div>
        <div class="my-[2%] p-[1%] bg-slate-50">
        
        <div class="flex py-[1%]" v-if="doctor.name">
              <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("اسم الاستشاري") }} :</p>
              <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{doctor.name }}</p>
           </div>
            <div class="flex py-[1%]" v-if="doctor.title">
              <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("title") }} :</p>
              <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{doctor.title }}</p>
            </div>
            <div class="flex py-[1%]" v-if="booking.requester_name">
              <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("request_sender") }} :</p>
              <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.requester_name }}</p>
            </div>
        <div class="flex py-[1%]" v-if="event_data ">
              <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("Consultation_date") }} :</p>
              <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{event_data }}</p>
            </div>
            <form @submit.prevent="updateBooking">
              <div class="flex flex-column gap-2 py-1">
                  <label class="w-full t" for="username">{{ $t('change_of_specialist') }}</label>
                  <Dropdown  id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="doctor"  option-value="user_id" filter :options="new_doctors" optionLabel="name" :class="{ 'p-invalid': submitted && !usersdata.name}"  />
              </div>
              <div class="flex flex-column gap-2 py-1">
                  <label class="w-full t" for="username">{{ $t('Submit_a_note') }}</label>
                  <textarea name="notes" v-model="accept_notes" id="notes" class="border ring-1 ring-black border-black rounded-md focus:ring-black" cols="30" rows="4"></textarea>

              </div>
              <div class="flex flex-column gap-2 py-1">
                  <label class="w-full t" for="username">{{ $t('new_status') }}</label>
                  <Dropdown  :style="{ backgroundColor: new_status === 1 ? '#10B981' : new_status === 2 ? '#EF4444' : new_status === 0 ? '#F59E0B' : 'transparent' }"                  id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="new_status"  option-value="code" filter :options="status" optionLabel="name" :class="{ 'p-invalid': submitted && !usersdata.name}"  />
              </div>
              <div class="flex flex-column gap-2 py-1 text-center">
                <Button :label='$t("submit")' type="submit" class="create w-60" icon="pi pi-check"></Button>

              </div>
             
            </form>
          
        </div>
      <!-- Left Side -->
     
      <!-- End Left Side -->
      <!-- Right Side -->
    
      <!-- End Right Side -->
    </div>
  </v-card>

  <div class="w-full mx-auto">
    <div class="flex justify-center">
      <div
        v-show="show_answer_modal"
        class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
      >
        <div class="w-1/2 p-6 bg-white rounded-md shadow-xl">
          <div class="flex items-center justify-between">
            <h3 class="text-3xl text-center">
              {{ $t("Answer_the_questions") }}
            </h3>
            <svg
              @click="show_answer_modal = false"
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mt-4">
          <div class="flex flex-initial " v-if="booking.child_gender ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("Type") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.child_gender == 1 ? "male" : "female" }}</p>
          </div>
          <div class="flex flex-initial  py-4" v-if="booking.child_problem ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("problem_type") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.child_problem  }}</p>
          </div>
          <div class="flex flex-initial  py-4" v-if="booking.child_problems_notes ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("child_problems_notes") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.child_problems_notes  }}</p>
          </div>
          <div class="flex flex-initial  py-4" >
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("child_problem") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.child_aids == 1 ? "yes" : "no" }}</p>
          </div>
          <div class="flex flex-initial  py-4" v-if="booking.child_aids_notes ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("child_aids_notes") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.child_aids_notes  }}</p>
          </div>
          <div class="flex flex-initial  py-4" v-if="booking.child_aids_notes ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("main_problems") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.child_aids_notes  }}</p>
          </div>
          <div class="flex flex-initial  py-4" v-if="booking.parents_priorities ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("priority_parents") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.parents_priorities  }}</p>
          </div>
            
            
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full mx-auto">
    <div class="flex justify-center">
      <div
        v-show="show_modal"
        class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
      >
        <div class="w-1/2 p-6 bg-white rounded-md shadow-xl">
          <div class="flex items-center justify-end">
            <h3
              class="text-2xl text-center w-full font-bold inline-flex items-center justify-center"
              :class="modal_color_c"
            >
              {{ modal_text_c }}
              <!-- <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 36 36"
                class="mx-2"
              >
                <path
                  id="ok-circle"
                  d="M18,0A18,18,0,1,0,36,18,18,18,0,0,0,18,0Zm0,3.911A14.088,14.088,0,1,1,3.913,18,14.089,14.089,0,0,1,18,3.911Zm6.9,5.542L14.465,19.887,11.081,16.5l-3.32,3.318,3.384,3.384,3.342,3.342,3.318-3.32L28.24,12.8,24.9,9.453Z"
                  fill="#66CB19"
                />
              </svg> -->
            </h3>
            <svg
              @click="show_modal = false"
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mt-4 text-right">
            <p class="border-b-2 my-9 py-2 border-black">
              <span class="text-gray-500 flex items-center justify-end">
                <span
                  class="font-bold text-lg w-1/2 block"
                  style="color: #00897b"
                  >{{ booking.child_name }}</span
                >
                <label class="block w-1/2">{{
                  $t("الاسم الرباعي للطفل")
                }}</label>
              </span>
            </p>
            <p class="border-b-2 my-9 py-2 border-black">
              <span class="text-gray-500 flex items-center justify-end">
                <span
                  class="font-bold text-lg w-1/2 block"
                  style="color: #00897b"
                  >{{ event_data }}</span
                >
                <label class="block w-1/2">{{ $t("موعد الاستشاره") }}</label>
              </span>
            </p>
            <p class="border-b-2 my-9 py-2 border-black" v-if="doctor">
              <span class="text-gray-500 flex items-center justify-end">
                <span
                  class="font-bold text-lg w-1/2 block"
                  style="color: #00897b"
                  >{{ doctor.name }}</span
                >
                <label class="block w-1/2">{{ $t("اسم الاخصائي") }}</label>
              </span>
            </p>
            <p class="border-b-2 my-9 py-2 border-black">
              <span class="text-gray-500 flex items-center justify-end">
                <span
                  class="font-bold text-lg w-1/2 block"
                  style="color: #00897b"
                  >{{ accept_notes }}...</span
                >
                <label class="block w-1/2">{{ $t("ملاحظه") }}</label>
              </span>
            </p>
            <p class="border-b-2 my-9 py-2 border-black">
              <span class="text-gray-500 flex items-center justify-end">
                <span
                  class="font-bold text-lg w-1/2 block"
                  style="color: #00897b"
                  >{{ booking.requester_name }}</span
                >
                <label class="block w-1/2">{{ $t("اسم مرسل الطلب") }}</label>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  props: ["id"],
  data() {
    return {
      booking: {},
    
      status:[
        { name: 'Pending', code: 0 },
        { name: 'Accept', code: 1 },
        { name: 'Cancell', code: 2 },
      ],
      show_status: false,
      doctor: {},
      new_status: null,
      new_doctors: [],
      accept_notes: "",
      show_answer_modal: false,
      show_modal: false,
      modal_text: "",
      modal_color: "",
    };
  },
  methods: {
    getBooking() {
      axios
        .get(`/api/calender/bookings/${this.id}`)
        .then((res) => {
          this.booking = res.data.booking.booking;
          this.new_status = res.data.booking.booking.accepted;
          this.doctor = res.data.booking.doctor;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateBooking() {
      axios
        .post(`/api/calender/bookings/${this.id}/accept`, {
          status: this.new_status,
          accepted_notes: this.accept_notes,
          user_id: this.booking.user_id,
          event_id: this.doctor.event_id,
          doctor_name: this.doctor.name,
          doctor_title: this.doctor.title,
        })
        .then((res) => {
          this.show_modal = true;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeDoctor(start) {
      axios
        .post("/api/calender/change-doctor", {
          start: start,
        })
        .then((res) => {
          this.new_doctors = res.data.doctors;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    event_data() {
      let day = moment(this.booking.event_date).format("dddd");
      let hour = moment(this.booking.event_date).format("hh:mm: A");

      return `${day} -- ${hour}`;
    },

    status_text() {
      if (this.new_status == 0) {
        return "pending";
      } else if (this.new_status == 1) {
        return "accepted";
      } else {
        return "cancelled";
      }
    },

    modal_text_c() {
      if (this.new_status == 0) {
        return "الحجز تحت المراجعه";
      } else if (this.new_status == 1) {
        return "تم تاكيد الحجز";
      } else {
        return "تم الغاء الحجز";
      }
    },
    modal_color_c() {
      if (this.new_status == 0) {
        return "text-yellow-400";
      } else if (this.new_status == 1) {
        return "text-green-700";
      } else {
        return "text-red-700";
      }
    },
  },
  mounted() {
    this.getBooking();
  },
};
</script>
<style scoped>
.item:hover {
  background-color: #e6f8f6;
  transition: all linear 300ms;
}

#submit:disabled {
  background-color: #5fbec7;
  color: #5fbec7;
  cursor: not-allowed;
}
[v-cloak] {
  display: none;
}
</style>
