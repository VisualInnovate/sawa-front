<template>
    <div>
      <div>
        <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" >{{ $t("Employees") }}</p>
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
        <v-form class="p-[2%]  bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4" ref="myForm" @submit.prevent="seedData">
          <!-- ... existing code ... -->
            
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('employee_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee.user_id"  option-value="id" :options="users" optionLabel="name" :placeholder='$t("employee_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.user_id">{{ error.user_id[0] }}</div>
                </div>
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('Nationality') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee.national_id"  option-value="id" :options="cities" optionLabel="nationality" :placeholder='$t("Nationality")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.national_id">{{ error.national_id[0] }}</div>
                </div>
                
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('department_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee.department_id"  option-value="id" :options="departments" optionLabel="title" :placeholder='$t("department_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.department_id">{{ error.department_id[0] }}</div>
                </div>
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('shift_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee.shift_id"  option-value="id" :options="shifts" optionLabel="title" :placeholder='$t("shift_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.shift_id">{{ error.shift_id[0] }}</div>
                </div>
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('position_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee.position_id"  option-value="id" :options="positions" optionLabel="title" :placeholder='$t("position_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.position_id">{{ error.position_id[0] }}</div>
                </div>

                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('basic_salary') }}</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="employee.basic_salary" :placeholder='$t("basic_salary")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.basic_salary">{{ error.basic_salary[0] }}</div>
                </div> 
              
               
    
                <div class="flex flex-column gap-2 w-full">
                  <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                  <Button @click="createtreatment" class="create m-auto w-full " :label='$t("submit")'></Button>
                  <small id="username-help"></small>
                </div>
                
  
        
        </v-form>
  <toast></toast>
        <!-- ... existing code ... -->
      </div>
    </v-card>
  </template>
  
  <script>
  import axios from "axios";
  import InputNumber from "primevue/inputnumber";
  
    import {useToast} from 'primevue/usetoast'
  export default {
  
  
    data() {
      return {
        employee:{ },
        users:{},
        childs:{},
        cities:{},
        positions:{},
        shifts:{},
        departments:{},
        qustions:{},
        error: {},
        maxDate: new Date(),
       
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {
      // ... existing methods ...
      Therapeutic (){
        this.$router.push({ name: 'answer' });
      },


  

  
      getusers(){
 
          axios
          .post("api/users")
          .then((response) => {
            this.users=response.data.users.data
          })
          axios
          .get("api/shifts")
          .then((response) => {
            this.shifts=response.data.data
          })
          axios
          .get("api/position")
          .then((response) => {
            this.positions=response.data.data
          })
          axios
          .get("api/department")
          .then((response) => {
            this.departments=response.data.data
          })
          axios
        .get("/api/countries")
        .then((res) => {
         
          this.cities = res.data.countries
          
        })
      },
     
      
    
      createtreatment() {
      
        axios.post(`/api/employees/import/users`,this.employee).then((res) => {
          this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });
        }).catch((el)=>{
          console.log(el.response.data.errors.name)
       this.error = el.response.data.errors
      })
      },
     
    },
    mounted() {
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
  