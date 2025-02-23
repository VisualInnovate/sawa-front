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
        <div class="my-[2%] p-[1%] bg-slate-50 grid lg:grid-cols-2 gap-4">
        <div>
          <h2 class="text-2xl text-slate-600 font-bold ">{{ $t("Confirm_Booking") }}</h2>
        <div class="flex py-[1%]" v-if="doctor?.name">
          
              <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("اسم الاستشاري") }} :</p>
              <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{doctor?.name }}</p>
           </div>
       
            <div class="flex py-[1%]" >
              <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("request_sender") }} :</p>
              <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{booking.details?.requester_name }}</p>
            </div>
          <div class="flex py-[1%]" v-if="event_data ">
              <p class="text-xl md:text-xl px-1 my-auto" >  {{ $t("Consultation_date") }} :</p>
              <p class="text-lg text-[#7d7979] md:text-xl px-1 my-auto" >{{event_data }}</p>
            </div>
            <form @submit.prevent="updateBooking">
              <!-- <div class="flex flex-column gap-2 py-1">
                  <label class="w-full t" for="username">{{ $t('change_of_specialist') }}</label>
                  <Dropdown   id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="booking.event_id"  option-value="id" filter :options="new_doctors" optionLabel="name" :class="{ 'p-invalid': submitted && !usersdata.name}"  />
              </div> -->
              <div class="flex flex-column gap-2 py-1">
                  <label class="w-full t" for="username">{{ $t('Submit_a_note') }}</label>
                  <textarea  name="notes" v-model="accept_notes" id="notes" class="border ring-1  ring-black border-black rounded-md focus:ring-black" cols="30" rows="4"></textarea>

              </div>
              <div class="flex flex-column gap-2 py-1">
                  <label class="w-full t" for="username">{{ $t('status') }}</label>
                  <Dropdown  :style="{ backgroundColor: new_status == 1 ? '#10B981' : new_status == 2 ? '#EF4444' : new_status == 0 ? '#F59E0B' : 'transparent' }"     id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="new_status"  option-value="code" filter :options="status" optionLabel="name" :class="{ 'p-invalid': submitted && !usersdata.name}"  />
              </div>
              <div class="flex flex-column gap-2 py-1 text-center">
                <Button :label='$t("submit")' type="submit" class="create w-60" icon="pi pi-check"></Button>

              </div>
             
            </form>
        </div>

        <!-- left div -->
        <div class="flex items-center ">
  
          <div v-if="comparisonResult" class="text-center w-full">
            
          <Button @click="AddEvalte(booking?.child_id)" class="bg-[green] m-auto w-80" icon="pi pi-plus" label="اضافــــة تقييم">  </Button>
          <Button @click="sendMassage=!sendMassage" class="bg-[green] m-auto w-80" icon="pi pi-wallet" label=" نتيجة الاستشارة">  </Button>
          </div>
   
        </div>
          
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
  <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <form @submit.prevent="create" class="">
                
          
            <div  class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('evalute_type') }}</label>
                  <Dropdown @update:model-value="getdoctor_evalte" required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="evalate.evaluation_type"  option-value="id" filter :options="evaluate_types"  optionLabel="name"  class="w-full" :class="{ 'p-invalid': submitted && !evalate.evaluation_type}" />
            </div>
            <div v-if="evalate.evaluation_type" class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('Name_evaluator') }}</label>
                  <Dropdown @update:model-value="getDays" required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="evalate.specialist_id"  option-value="id" filter :options="doctors"  optionLabel="name"  class="w-full" :class="{ 'p-invalid': submitted && !evalate.specialist_id}"/>
            </div>
            <div v-if="evalate.specialist_id" class="flex flex-column gap-2">
                    <label  class="w-full text-right" for="username">{{ $t('Evaluation_date') }}</label>
                    <Calendar  @update:model-value="gettimes($event)"   :disabledDays="filteredDays"  style="width: 100%" showButtonBar v-model.number="evalate.date" showIcon  :class="{ 'p-invalid': submitted && !evalate.date}"  :minDate="maxDate" />   
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
            </div> 
            <div  v-if="evalate.date" class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('hour_evaluator') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="evalate.Session_time"   filter :options="slots"  optionLabel="key" :class="{ 'p-invalid': submitted && !evalate.Session_time}" class="w-full " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.specialist_id">{{ error.specialist_id[0] }}</div>
            </div>
           
            <div class="w-full text-center">
            <Button type="submit" @click="submitted=true" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
          </form>
           
            
          

           
  </Dialog>
  <Dialog v-model:visible="sendMassage" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <form  class="">
                
          
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-center" for="username">{{ $t('Submit_a_note') }}</label>
                  <textarea :class="{ 'p-invalid': submitted && !student_massage}" required name="notes" v-model="student_massage" id="notes" class="border ring-1  ring-black border-black rounded-md focus:ring-black" cols="30" rows="4"></textarea>

              </div>
              <Button @click="studentMassage"  :label='$t("submit")'  class="create  m-auto" icon="pi pi-check"></Button>
          </form>
           
            
          

           
  </Dialog>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  props: ["id"],
  data() {
    return {
      comparisonResult:false,
      current_date: moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ'),
      booking: {},
      student_massage:'',
      status:[
        { name: this.$t("Pending"), code: '0' },
        { name: this.$t("Accept"), code: '1' },
        { name: this.$t("Cancell"), code: '2' },
      
      ],
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
    compareDates() {
      // Parse the dates
      const momentDate1 = moment(this.booking.event_data);
      const momentDate2 = moment(this.current_date);

      // Compare the dates
      if (momentDate1.isAfter(momentDate2)) {
        this.comparisonResult = false;
      } else if (momentDate1.isBefore(momentDate2)) {
        this.comparisonResult = true;
      } else {
        this.comparisonResult = true;
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
          this.student_massage=res.data.booking.booking.consultation_result
          this.doctor = res.data.booking.doctor;
          this.compareDates()
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
