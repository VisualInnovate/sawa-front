<template>
    <div>
      <div>
        <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" >{{ $t("veciles") }}</p>
      </div>
      <div v-if="loading" class="loader"></div>
      <!-- Your existing content goes here -->
    </div>
    <v-card>
      <div>
        <!-- ... existing code ... -->
        <v-dialog v-model="isSuccessModalOpen" max-width="400px">
          <v-card>
            <v-card-title>{{ $t("Success!") }}</v-card-title>
            <v-card-text>
              {{ $t("Data seeded successfully!") }}
            </v-card-text>
            <v-card-actions>
              <v-btn @click="closeSuccessModal" color="success">
                {{ $t("OK") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-form class="p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4" ref="myForm" @submit.prevent="seedData">
          <!-- ... existing code ... -->
            
              
            
      
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('driver_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="veciles.driver_id"  option-value="id" :options="drivers" optionLabel="name" :placeholder='$t("driver_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.driver_id">{{ error.driver_id[0] }}</div>
                </div>
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('vecile_type') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="veciles.type"  option-value="value" :options="arr()" optionLabel="name" :placeholder='$t("vecile_type")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
                </div>
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('Vehicle_ID') }}</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="veciles.plate_number" :placeholder='$t("Vehicle_ID")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.plate_number">{{ error.plate_number[0] }}</div>
                </div> 
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('Insurance_date') }}</label>
                    <Calendar  style="width: 100%" showButtonBar v-model.number="veciles.insurance_exp_date" showIcon  :placeholder='$t("Insurance_date")'  :maxDate="maxDate" />   
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.insurance_exp_date">{{ error.insurance_exp_date[0] }}</div>
                </div> 
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('License_expiration') }}</label>
                    <Calendar  style="width: 100%" showButtonBar v-model.number="veciles.license_exp_date" showIcon  :placeholder='$t("License_expiration")'  :minDate="maxDate" />   
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.license_exp_date">{{ error.license_exp_date[0] }}</div>
                </div> 
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('seats_number') }}</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="veciles.seats" :placeholder='$t("seats_number")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.seats">{{ error.seats[0] }}</div>
                </div> 
                
                <!-- <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('ProgramName') }}</label>
                <InputText required class="bg-[#f7f5f5]" v-model="treatments.name" :placeholder='$t("ProgramName")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
                </div>
                  
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('price') }}</label>
                    <InputNumber inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="5" required class="bg-[#f7f5f5]" v-model="treatments.price" :placeholder='$t("price")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.price">{{ error.price[0] }}</div>
                </div> -->

                
               
         
         
             
                <div class="flex flex-column gap-2 w-full">
                  <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                  <Button @click="createtreatment" class="create m-auto w-full " :label='$t("submit")'></Button>
                  <small id="username-help"></small>
                </div>
<!--                 
                <div style="width: 100%; height: 500px">
    <GoogleMap
     
      style="width: 100%; height: 100%"
      mapTypeId="terrain"
      :center="center"
      :zoom="4"
    >
      <Circle v-for="(circle, key) in circles" :key="key" :options="circle" />
    </GoogleMap>
  </div> -->
        
        </v-form>
  <toast></toast>
        <!-- ... existing code ... -->
      </div>
      
    </v-card>
  </template>
  
  <script>
  import axios from "axios";
  
  import { GoogleMap, Circle } from 'vue3-google-map';
  import InputNumber from "primevue/inputnumber"; 

    import {useToast} from 'primevue/usetoast'
  export default {
    components: {
    GoogleMap,
    Circle
  },
  
    data() {
      return {
        center: { lat: 37.09, lng: 8.712 },
      cities: {
        chicago: {
          center: { lat: 41.878, lng: 45.629 },
          population: 2714856,
        },
      },
      circles: {},
    
        veciles:{},
        drivers:{},
        error: {},
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
        this.$router.push({ name: 'transportation' });
      },
      getonevecile(){
        axios
          .get(`api/vehicle/${this.$route.params.id}`)
          .then((response) => {
            console.log(response.data.data)
            this.veciles = response.data.data;
           
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
      },
  
      getusers(){
        axios
          .get(`api/driver`)
          .then((response) => {
            
            console.log(response.data.data)
            this.drivers = response.data.driver;
            this.getonevecile()
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
  
      },
      arr (){
      return this.roomType =[
            
                { name:'angel car' , value:0 },
                { name:'bus', value:1},
                { name:'Minibus' , value:2 },
               
            ]
    },
    
      createtreatment() {

        axios.put(`/api/vehicle/${this.$route.params.id}`,this.veciles).then((res) => {
          this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });
        }).catch((el)=>{
          console.log(el.response.data.errors.name)
       this.error = el.response.data.errors
      })
      },
     
    },
    mounted() {
        this.setupCircles();
     this.getusers()
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
  