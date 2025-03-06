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
        
        <div class="flex ">
         <Button @click="show_answer_modal = true" class="create" icon="pi pi-arrow-left" :label='$t("Answer_the_questions")'></Button>

        </div>
       
        </div>
       

       
    
    </div>
  </v-card>
  <v-card class="mt-5  p-[2%] bg-slate-50">
  <form @submit.prevent="updateBooking" class="bg-white shadow-lg rounded-xl p-6 space-y-4 mx-auto border border-gray-200">
    <h2 class="text-2xl font-bold text-gray-700 mb-4 text-center">
      {{ $t("Confirm_Booking") }}
    </h2>

    <div class="flex flex-col gap-2">
      <!-- Consultant Name -->
      <div class="flex items-center gap-2" v-if="doctor?.name">
        <p class="text-lg font-semibold text-gray-800">{{ $t("اسم الاستشاري") }}:</p>
        <p class="text-lg text-gray-600">{{ doctor?.name }}</p>
      </div>

      <!-- Request Sender -->
      <div class="flex items-center gap-2">
        <p class="text-lg font-semibold text-gray-800">{{ $t("request_sender") }}:</p>
        <p class="text-lg text-gray-600">{{ booking.details?.requester_name }}</p>
      </div>

      <!-- Consultation Date -->
      <div class="flex items-center gap-2" v-if="event_data">
        <p class="text-lg font-semibold text-gray-800">{{ $t("Consultation_date") }}:</p>
        <p class="text-lg text-gray-600">{{ event_data }}</p>
      </div>

      <!-- Notes Field -->
      <div class="flex flex-col">
        <label class="text-gray-700 font-medium" for="notes">{{ $t("Submit_a_note") }}</label>
        <textarea
          name="notes"
          v-model="accept_notes"
          id="notes"
          class="border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg p-3 text-gray-700 w-full shadow-sm"
          cols="30"
          rows="4"
        ></textarea>
      </div>

      <!-- Status Dropdown -->
      <div class="flex flex-col">
        <label class="text-gray-700 font-medium" for="status">{{ $t("status") }}</label>
        <Dropdown
          :style="{
            backgroundColor: new_status == 1 ? '#10B981' : new_status == 2 ? '#EF4444' : new_status == 0 ? '#F59E0B' : 'transparent',
            color: 'white',
          }"
          id="pv_id_1"
          class=" rounded-lg shadow-sm  text-center"
          v-model="new_status"
          option-value="code"
          filter
          :options="status"
          optionLabel="name"
        />
      </div>

      <!-- Evaluation Button -->
      <div class="text-center mt-4">
        <Button
          :disabled="comparisonResult"
          @click="AddEvalte(booking?.child_id)"
          class="bg-gradient-to-r create from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 transition-all duration-300 px-6 py-2 rounded-lg shadow-md w-80"
          icon="pi pi-plus"
          label="اضافــــة تقييم"
        ></Button>
      </div>

      <!-- Submit Button -->
      <div class="text-center mt-4">
        <Button
          :label='$t("submit")'
          type="submit"
          class="bg-gradient-to-r create from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-300 px-6 py-2 rounded-lg shadow-md w-60"
          icon="pi pi-check"
        ></Button>
      </div>
    </div>
  </form>
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
          <div class="flex flex-initial  py-4" v-if="booking.details?.child_parents_problems ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("problem_type") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.details?.child_parents_problems  }}</p>
          </div>
          <div class="flex flex-initial  py-4" v-if="booking.details?.child_problems_notes ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("child_problems_notes") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.details?.child_problems_notes  }}</p>
          </div>
          <div class="flex flex-initial  py-4" >
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("child_problem") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.child_aids == 1 ? "yes" : "no" }}</p>
          </div>
          <div class="flex flex-initial  py-4" v-if="booking.details?.child_aids_notes ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("child_aids_notes") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.details?.child_aids_notes  }}</p>
          </div>
          <div class="flex flex-initial  py-4" v-if="booking.details?.child_aids_notes ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("main_problems") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.details?.child_aids_notes  }}</p>
          </div>
          <div class="flex flex-initial  py-4" v-if="booking.details?.parents_priorities ">
            <i class="bg-[#EC477C] p-1 rounded-full text-[white] my-auto pi pi-check"></i>
            <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("priority_parents") }} :</p>
            <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{ booking.details?.parents_priorities  }}</p>
          </div>
            
            
          </div>
        </div>
      </div>
    </div>
  </div>
  <toast></toast>

            <v-card class="mt-5  p-[2%] bg-slate-50">
            <h2 class="text-lg font-semibold text-gray-800 mb-3">{{ $t('نتيجة الاستشارة') }}</h2>

            <form class="bg-white shadow-lg rounded-xl p-6 space-y-4 mx-auto border border-gray-200">
              <div class="flex flex-col">
                <label class="text-gray-600 font-medium text-sm">السيرة الصحية والنمائية</label>
                <textarea 
                  v-model="student_massage.health"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                  rows="2">
                </textarea>
              </div>

              <div class="flex flex-col">
                <label class="text-gray-600 font-medium text-sm">توصيات المستشار</label>
                <textarea 
                  v-model="student_massage.consultant_recommendations"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
                  rows="2">
                </textarea>
              </div>

              <div class="flex flex-col">
                <label class="text-gray-600 font-medium text-sm">اختر التوصيات المنزلية</label>
                <MultiSelect 
                  v-model="student_massage.filed_value"
                  filter
                  :options="fileds"
                  optionLabel="value"
                  class="border border-gray-300 rounded-md p-1 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              <div v-for="(filed, index) in student_massage.filed_value" :key="index" class="py-1">
                <input
                  v-model="fileds[index].value"
                  readonly
                  class="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none"
                />
              </div>

              <Button 
                @click="studentMassage"
                :label='$t("submit")'
                class="w-full py-1.5 mt-3 create bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-200"
                icon="pi pi-check">
              </Button>
            </form>
          </v-card>

    <v-card class="mt-5  p-[2%] bg-slate-50">
     
      <form class="bg-white shadow-lg rounded-xl p-6 space-y-4 mx-auto border border-gray-200">
    <div class="space-y-2">
      <p class="w-full  text- font-bold" for="username">{{ $t(' اضافة مواعيد مسبقة ') }}</p>

      <label class="block text-gray-700 font-semibold text-lg" for="username">
        من هذة القائمه يمكنك اضافة مواعيد مسبقة للطفل
      </label>

      <label class="block text-gray-600 text-sm" for="username">{{ $t(' ') }}</label>
          
          <MultiSelect 
            v-model="pre_evalutions.pre_evalutions"
            filter  
            :options="evaluate_types"
            optionLabel="name"
            class="w-full  border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
          />
        </div>

        <div class="bg-gray-100 p-3 rounded-md">
          <p v-for="pre,index in pre_evalutions.pre_evalutions" :key="pre.name" class="text-gray-800 text-sm font-medium">
           {{ index+1 }} - {{ pre.name }}
          </p>
        </div>

        <Button 
          @click="SenPrEvalutions(booking.id)"
          :label='$t("submit")'
          class="w-full create text-white py-2 px-4 rounded-md font-semibold transition-all duration-300 ease-in-out shadow-md flex items-center justify-center"
          icon="pi pi-check"
        />
      </form>
      
    </v-card>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  props: ["id"],
  data() {
    return {
      filed_value:'',
      comparisonResult:false,
      current_date: moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ'),
      booking: {},
      pre_evalutions:{},
      student_massage:{},
      status:[
        { name: this.$t("Pending"), code: '0' },
        { name: this.$t("Accept"), code: '1' },
        { name: this.$t("Cancell"), code: '2' },
      
      ],
      fileds:[],
      evaluate_types : [
                      { name: 'side profile', id: 1 },
                      { name: 'milestone', id: 2 },
                      { name: 'barrier', id: 3 },
                      { name: 'ablls', id: 4 },
                      { name: 'carolina', id: 5 },
   
                  ],
       
      show_status: false,
      doctor: {},
      evalate:{},
      doctors:{},
      business_hours:[],
      new_status: null,
      new_doctors: [],
      slots:[],
      accept_notes: "",
      show_answer_modal: false,
      show_modal: false,
      updatedialog: false,
      modal_text: "",
      modal_color: "",
      days:[0,1,2,3,4,5,6],
      sendMassage:false,
      submitted:false,
    };
  },
  
  methods: {
    SenPrEvalutions(id){
      axios.post(`api/calender/bookings/${id}/evaluations`,{
       pre_evaluations:this.pre_evalutions
      }).then((res)=>{
        this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("تم ارسال التقيممات المسبقة ")}`, life: 3000 });

      })
    },
    compareDates() {
      
      const eventDate = new Date(this.booking.event_date);
      const currentDate = new Date();
    
      if (eventDate > currentDate) {
        this.comparisonResult=true;
      } else if (eventDate.toDateString() === currentDate.toDateString()) {
        this.comparisonResult=false;
      } else {
        console.log("3")
        this.comparisonResult=false;
      }
    },

    studentMassage(){
      axios
          .post(`api/booking/result`,{
           consultation_result: this.student_massage,
           booking_id: this.booking.id,
          })
          .then((response) => {
            
            this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_update_success")}`, life: 3000 });
            this.sendMassage=!this.sendMassage
            
           
          })
          .catch((el)=>{
            this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.$t("mission_error")}`, life: 3000 });
      });
    },

    getdoctor_evalte(id){
        axios
          .post(`api/evaluation-doctors`,{
            evaluation_type:id
          })
          .then((response) => {
           
            this.doctors = response.data.doctors
           
          })
         
      },
      getDays(id){
        this.business_hours=this.doctors.find(item => item.id == id).business_hours
        console.log(this.business_hours)
      },
      gettimes(e){
        
        axios
          .post(`api/users/available/slots`,{
            user_id:this.evalate.specialist_id,
            evaluation_type:this.evalate.evaluation_type,
            date:moment(e).format("Y-MM-DD") 
          })
          .then((response) => {
           
           this.slots=response.data.slots
          })
        


      },

      AddEvalte(id){
        this.$router.push({name:'Calender',params:{id:id}})
       
      },
      create(){
        axios
          .post(`api/evaluation-request`,{
            child_id:this.booking.child_id,
            consultant_id:localStorage.getItem("user_id"),
            evaluation_type:this.evalate.evaluation_type,
            date:moment(this.evalate.date).format("Y-MM-DD") ,
            specialist_id:this.evalate?.specialist_id,
            start_time:this.evalate?.Session_time?.start,
            end_time:this.evalate?.Session_time?.end,


          })
          .then((response) => {
            this.updatedialog=!(this.updatedialog)
            this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });
            
            
           
          })
          .catch((el)=>{
            this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.$t("mission_error")}`, life: 3000 });
      });

      },
  
    getBooking() {
      axios
        .get(`/api/calender/bookings/${this.id}`)
        .then((res) => {
          this.booking = res.data.booking.booking;
          this.new_status = res.data.booking.booking.accepted;
          this.accept_notes = res.data.booking.booking.accepted_notes;
          if(res.data.booking.booking.consultation_result) this.student_massage=res.data.booking?.booking?.consultation_result
          if(res.data.booking.booking.pre_evaluations.pre_evalutions) this.pre_evalutions.pre_evalutions=res.data.booking?.booking?.pre_evaluations.pre_evalutions
          this.doctor = res.data.booking.doctor;
          this.compareDates()
        })
        axios.get('api/consultation-settings').then((res)=>{
          this.fileds=res.data.data.recommendations
        }) 
    },
    updateBooking() {
      axios
        .post(`/api/calender/bookings/${this.id}/accept`, {
          status: this.new_status,
          accepted_notes: this.accept_notes,
          user_id: this.booking.user_id,
          event_id:this.booking.event_id,
          doctor_name: this.doctor?.name,
          doctor_title: this.doctor?.title,
        })
        .then((res) => {
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_update_success")}`, life: 3000 });

        })
        .catch((err) => {
          this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.$t("mission_error")}`, life: 3000 });
          ;
        });
    },
    changeDoctor() {
      axios
        .get("/api/doctors")
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
    filteredDays() {
      // Extract the `day` values from `business_hours`
      const usedDays = this.business_hours.map(entry => entry.day);
      // Filter `days` to only include those present in `usedDays`
      return this.days.filter(day => !usedDays.includes(day));
    },
  },
  mounted() {
    this.getBooking();
    this.changeDoctor()
    
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
