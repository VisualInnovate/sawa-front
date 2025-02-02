<template>


    <div>
      <div>
        <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" >{{ $t("student_tans") }}</p>
      </div>
      <div v-if="loading" class="loader"></div>
      <!-- Your existing content goes here -->
    </div>
    <v-card>
      <div>
      
        <form class="p-[2%] bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4" ref="myForm" @submit.prevent="createtreatment">
          <!-- ... existing code ... -->
            
              
            
      
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('child_name') }}</label>
                    <MultiSelect filter required id="pv_id_1" style="direction: ltr !important;" v-model="student.child_ids"  option-value="id" :options="children" optionLabel="name" :placeholder='$t("child_name")' :class="{ 'p-invalid': submitted && !student.child_ids}" />
                </div>
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('area_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="student.region_id"  option-value="id" :options="areas" optionLabel="name" :placeholder='$t("area_name")' :class="{ 'p-invalid': submitted && !student.region_id}" />
                </div>
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('vecile_type') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="student.type"  option-value="value" :options="arr()" optionLabel="name" :placeholder='$t("vecile_type")' :class="{ 'p-invalid': submitted && !student.type}" />
                </div>
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('trip_type') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="student.trip_type"  option-value="value" :options="trip()" optionLabel="name" :placeholder='$t("trip_type")' :class="{ 'p-invalid': submitted && !student.trip_type}" />
                </div>
        
               
                  
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('price') }}</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="student.price" :placeholder='$t("price")' :class="{ 'p-invalid': submitted && !student.price}" />
                </div> 

                 <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('student_location') }}</label>
                <InputText required class="bg-[#f7f5f5]" v-model="student.location_url" :placeholder='$t("student_location")' :class="{ 'p-invalid': submitted && !student.location_url}" />
                </div>

                
              
                <div class="flex flex-column gap-2 w-full">
                  <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
           
                 
                  <Button type="submit" class="create m-auto w-full "  @click="submitted=true" :label='$t("submit")'></Button>
               
                  <small id="username-help"></small>
                </div>
              
        
        </form>


        
  <toast></toast>
        <!-- ... existing code ... -->
      </div>
    </v-card>
  </template>
  
  <script>
  import axios from "axios";
  import InputNumber from "primevue/inputnumber";
  import { GoogleMap, Circle } from 'vue3-google-map';
    import {useToast} from 'primevue/usetoast'
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
      student:{},
        children:{},
        areas:{},
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
        this.$router.push({ name: 'student-transportation' });
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

      
  //// get all child
      getusers(){
        axios
          .get("api/child")
          .then((response) => {
            console.log(response.data.data)
            this.children = response.data.children;
           
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
  
      },

    
    
      createtreatment() {

        axios.post("/api/student-transportation",this.student).then((res) => {
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });
        }).catch((el)=>{
          this.$toast.add({ severity: 'error', summary: this.$t("error"), detail:  `${el.response.data.message}`, life: 3000 });

      })
      },
     
    },
    mounted() {
        this.setupCircles();
     this.getusers()
     this.getareas()
    },
  };
  </script>
  