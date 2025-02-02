<template>
    <div>
      <div>
        <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" >{{ $t("transportation_schedule") }}</p>
      </div>
      <div v-if="loading" class="loader"></div>
      <!-- Your existing content goes here -->
    </div>
    <v-card>
      <div>
      
        <form  class="p-[2%] c shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4" ref="myForm" @submit.prevent="submitForm">
          <!-- ... existing code ... -->
            
          <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('driver_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="student.driver_id"  option-value="id" :options="drivers" optionLabel="name" :placeholder='$t("driver_name")' :class="{ 'p-invalid': submitted && !student.driver_id}" />
                </div>

            
      
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('vecile_type') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="student.vehicle_id"  option-value="id" :options="vehicle" optionLabel="plate_number" :placeholder='$t("vecile_type")' :class="{ 'p-invalid': submitted && !student.vehicle_id}" />
                </div>


                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('student_tans') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="student.student_transportation_id"  option-value="id" :options="studenttransportation" optionLabel="location_url" :placeholder='$t("student_tans")' :class="{ 'p-invalid': submitted && !student.student_transportation_id}" />
                </div>


                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('start_date') }}</label>
                    <Calendar required style="width: 100%" showButtonBar v-model.number="student.date" showIcon  :placeholder='$t("start_date")'  :minDate="maxDate"  :class="{ 'p-invalid': submitted && !student.date}"/>

                </div> 
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('seats_number') }}</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="student.available_seats" :placeholder='$t("seats_number")' :class="{ 'p-invalid': submitted && !student.available_seats}" />
                </div> 
        
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('from') }}</label>
                       <input class="bg-[#F7F5F5] py-2" type="time" name="time_end" id="time_end" v-model="student.from" style="border-radius: 5px" :class="{ 'p-invalid': submitted && !student.from}" />
                </div>
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('to') }}</label>
                        <input  required class="bg-[#F7F5F5] py-2" type="time" name="time_end" id="pv_id_1" v-model="student.to"  />
                </div>
                  
              

               
  
                
             
                <div class="flex flex-column w-[70%]">
                  <label for="username">{{ $t('Active') }}</label>
                    <div class="flex">
                        <InputSwitch required class="m-auto px-3" v-model="student.is_active"/>
                      <Button type="submit" class="create m-auto w-full " @click="submitted = true" :label='$t("submit")'></Button>
                    </div>
                </div>
           
              
        
        </form>
  <toast></toast>
        <!-- ... existing code ... -->
      </div>
    </v-card>
  </template>
  
  <script>
  import axios from "axios";
  import moment from "moment";
  import InputNumber from "primevue/inputnumber";
  import { GoogleMap, Circle } from 'vue3-google-map';
    import {useToast} from 'primevue/usetoast'
import { faL } from "@fortawesome/free-solid-svg-icons";
  export default {
    components: {
    GoogleMap,
    Circle
  },
  
    data() {
      return {
        submitted:false,
        center: { lat: 37.09, lng: 8.712 },
      cities: {
        chicago: {
          center: { lat: 41.878, lng: 45.629 },
          population: 5000,
        },
      },
      circles: {},
      student:{
       is_active:true
      },
      vehicle:{},
      drivers:{},
        areas:{},
        error: {},
        studenttransportation:{},
        maxDate: new Date(),
       
        // Add other validation rules for the title field
      };
  
    },
  

    computed: {
    computedCircles() {
      const computedCircles = {};
      for (const key in this.cities) {
        computedCircles[key] = {
          center: this.cities[key].center,
          radius: Math.sqrt(this.cities[key].population) * 100,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
        };
      }
      return computedCircles;
    }
  },
    methods: {

        setupCircles() {
      this.circles = this.computedCircles;
    },
      // ... existing methods ...
      Therapeutic (){
        this.$router.push({ name: 'transportation-schedule' });
      },


  ////get all areas
  getareas(){
        axios
          .get("api/region")
          .then((response) => {
            console.log(response.data.data)
            this.areas = response.data.data;
           
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
  
      },


      /// transportation 
      getareas(){
        axios
          .get("api/student-transportation")
          .then((response) => {
            console.log(response.data.data)
            this.studenttransportation = response.data.data;
           
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
  
      },
      
  //// get all child
  getvehicle(){
        axios
          .get("api/vehicle")
          .then((response) => {
            console.log(response.data.data)
            this.vehicle = response.data.data;
           
          })
          axios
          .get("api/driver")
          .then((response) => {
            console.log(response.data.data)
            this.drivers = response.data.driver
           
          })
  
      },
      arr (){
      return this.roomType =[
            
                { name:'angel car' , value:0 },
                { name:'bus', value:1},
                { name:'Minibus' , value:2 },
               
            ]
    },
    trip (){
      return this.roomType =[
            
                { name:this.$t('One_way') , value:0 },
                { name:this.$t('tow_way') , value:1 },
            ]
    },
    
    
    submitForm() {
       
         if(this.student.is_active == true){
            this.student.is_active=1
         }
         if(this.student.is_active == false){
            this.student.is_active=0
         }
        axios.post("/api/transportation-schedule",this.student).then((res) => {
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });

        }).catch((el)=>{
          this.$toast.add({ severity: 'error', summary: this.$t("error"), detail:  `${el.response.data.message}`, life: 3000 });

      })
      },
     
    },
    mounted() {
        this.setupCircles();
     this.getvehicle()
     this.getareas()

    },
  };
  </script>
  
  <style scoped>
  /* Add custom styles for the name input field */
  .name-input {
    height: 70vh;
    margin: auto !important;
     overflow-y: scroll;
    width: 100%;
    position: relative;
    background-color: #e7e7e7;
    padding: 10px;
    margin-bottom: 15px !important;
    border-radius: 10px;
  }
  .name-input::-webkit-scrollbar {
    display: none;
  }
  #pv_id_1{
    text-align: center;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .name-input {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .name-input {
    width: 606px;
  }
  
  
  
  .seed {
    width: 600px;
  
    margin: auto !important;
    background-color: #135c65;
    display: block;
    color: white;
   
  
   
    /* Set the width to 606px */
  }
  
  .custom-select {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    background-color: #f8f8f8;
    color: #333;
    appearance: none;
    /* Remove default arrow in some browsers */
    -webkit-appearance: none;
    /* Remove default arrow in Chrome and Safari */
    cursor: pointer;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  
  
  .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
    margin: 20px auto;
    /* Adjust margin as needed */
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
  
    100% {
      transform: rotate(360deg);
    }
  }
  
  .error-message {
    display: flex;
    align-items: center;
    color: #ff0000;
    /* Red color for errors */
    margin-top: 5px;
    font-size: 0.9em;
  }
  
  .error-icon {
    margin-right: 5px;
    /* Add styles for your error icon */
  }
  
  @media (max-width: 768px) {
  
    .name-input,
    .custom-select,
    .error-message {
      width: 100%;
      /* Full width on smaller screens */
      margin-bottom: 15px;
    }
  
    .v-btn {
      width: 100%;
      /* Full width button */
      padding: 12px;
      /* Larger touch target */
    }
  
    .error-message {
      font-size: 0.8em;
      /* Adjust font size */
    }
  }
  
  /* Add additional CSS for animation or other styling as needed */
  
  /* Add any other custom styles here */
  </style>
  