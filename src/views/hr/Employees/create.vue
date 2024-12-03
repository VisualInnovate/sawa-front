<template  >
  <div v-can="'employees create'">
    <div>
      <div>
        <p class="text-lg p-4 text-[#135C65] cursor-pointer font-bold" >{{ $t("Employees") }}</p>
      </div>
     
    </div>
    <v-card>
      <div>
       
        <form class="p-[2%]  bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4" ref="myForm" @submit.prevent="create">
          <!-- ... existing code ... -->

          <div class="col-span-2">
                 <div ><img onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px ;height: 150px;" :class="{ 'p-invalid': submitted && !employee.image}" v-if="employee.image" :src=" employee.image" >
                  <img  onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px ;height: 150px;" :class="{ 'p-invalid': submitted && !employee.image}" v-else src="https://sys.sawa.sawa.academy/public/default.jpg">
                 
                  </div>
           
          </div>
           <div class="flex flex-column gap-2 py-1">                
                <div class="flex">
                        <label class="text-right ">{{ $t("employee_name") }}</label>
                        <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                        </svg>
                    </div>
                  <InputText  class="bg-[#f7f5f5] text-center" v-model="employee.name" :class="{ 'p-invalid': submitted && !employee.name}" />
              </div>
              
              <div class="flex flex-column gap-2 py-1">
                 <div class="flex">
                         <label class="text-right ">{{ $t("email") }}</label>
                         <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                         </svg>
                     </div>
                   <InputText  type="email" class="bg-[#f7f5f5] text-center" v-model="employee.email" :class="{ 'p-invalid': submitted && !employee.email}" />
               </div>

               <div class="flex flex-column gap-2 py-1">                
                <div class="flex">
                        <label class="text-right ">{{ $t("password") }}</label>
                        <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                        </svg>
                    </div>
                  <InputText type="password" class="bg-[#f7f5f5] text-center" v-model="employee.password" :class="{ 'p-invalid': submitted && !employee.password}" />
              </div>
              <div class="flex flex-column gap-2 py-1">                
                <div class="flex">
                        <label class="text-right ">{{ $t("title") }}</label>
                        <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                        </svg>
                    </div>
                  <InputText  class="bg-[#f7f5f5] text-center" v-model="employee.title" :class="{ 'p-invalid': submitted && !employee.title}" />
              </div>
               <div class="flex flex-column gap-2">
                   <div class="flex">
                      <label class="text-right ">{{ $t("shift_name") }}</label>
                      <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                      </svg>
                    </div>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee.shift_id"  option-value="id" :options="shifts" optionLabel="title"  class="w-full  "  :class="{ 'p-invalid': submitted && !employee.shift_id }"/>

                </div>

                
                  <div class="flex flex-column gap-2">
                  <div class="flex">
                      <label class="text-right ">{{ $t("position_name") }}</label>
                      <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                      </svg>
                    </div>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee.position_id"  option-value="id" :options="positions" optionLabel="title"  class="w-full "  :class="{ 'p-invalid': submitted && !employee.position_id }"/>
                </div>

                <div class="flex flex-column gap-2">
                  <div class="flex">
                      <label class="text-right ">{{ $t("national_id") }}</label>
                      <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                      </svg>
                    </div>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="employee.national_id"  :class="{ 'p-invalid': submitted && !employee.national_id }" />
                </div>

                <div class="flex flex-column gap-2">
                  <div class="flex">
                      <label class="text-right ">{{ $t("basic_salary") }}</label>
                      <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                      </svg>
                    </div>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="employee.basic_salary"  :class="{ 'p-invalid': submitted && !employee.basic_salary }" />
                </div> 
                <div class="flex flex-column gap-2 py-1">
                  <div class="flex">
                    <label class="text-right ">{{ $t("type") }}</label>
                    <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                    </svg>
                  </div>
                  <Dropdown  id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="employee.type"  option-value="id" filter :options="tpes()" optionLabel="name" :class="{ 'p-invalid': submitted && !employee.type}"  />
               </div>
               <div v-if="employee.type == 0 || employee.type ==2 " class="flex flex-column gap-2">
                  <div class="flex">
                    <label class="text-right ">{{ $t("skill_name") }}</label>
                    <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                    </svg>
                  </div>
                  <MultiSelect  v-model="employee.skills" filter option-value="id" :options="skills" optionLabel="name" :class="{ 'p-invalid': submitted && !employee.skills}" />
              </div>
              <div  class="flex flex-column gap-2">
                    <div class="flex">
                      <label class="text-right ">{{ $t("department") }}</label>
                      <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                      </svg>
                    </div>
                    <MultiSelect  v-model="employee.department" filter option-value="id" :options="departments" optionLabel="title" :class="{ 'p-invalid': submitted && !employee.department}" />
              </div>
              
                
              
             
              
                <div class="flex flex-column gap-2 py-1">
                  <div class="flex">
                      <label class="text-right ">{{ $t("roles") }}</label>
                      <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                      </svg>
                    </div>
                  <Dropdown  id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="employee.role"  option-value="id" filter :options="roles" optionLabel="name" :class="{ 'p-invalid': submitted && !employee.role}" />
                </div>
                
                <div class=" flex-column gap-2 py-1 hidden">
                  <label class="w-full " for="username">{{ $t('personal_image') }}</label>
           
                  <InputText name="file"  ref="file" @change="uploadFile" accept="image/*" id="filr"   type="file" class="w-full" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
              </div>
               
    
                <div class="flex flex-column gap-2 w-full">
                  <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                  <Button @click="submitted=true" type="submit" class="create m-auto w-full " :label='$t("submit")'></Button>
                  <small id="username-help"></small>
                </div>
                
  
        
        </form>
  <toast></toast>
        <!-- ... existing code ... -->
      </div>
    </v-card>
  </div>
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
        submitted:false,
        childs:{},
        cities:{},
        positions:{},
        shifts:{},
        skills:[],
        roles:[],
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


       tpes(){
        return[
        
        { name:this.$t('driver'), id: 1 },
        { name:this.$t('doctor'), id: 2 },
        { name:this.$t('Evaluator'), id: 5 },

      ]
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
          axios.get("/api/skills").then((res)=>{
              this.skills=res.data.data
            

            });
          axios.post("/api/roles").then((res)=>{

           this.roles= res.data.roles.data


            });
          axios
          .get(`/api/countries/${localStorage.getItem("appLang")}`)
        .then((res) => {
         
          this.cities = res.data.countries
          
        })
      },
      uploadFile(e) {
      const image = e.target.files[0];
      if (!image) return; // Handle case where no file is selected

      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (event) => {
        this.employee.image = event.target.result; // Set base64 string
        this.employee.file = image;              // Set file object
        console.log(this.employee.image);        // Log the base64 string
      };
    },
      
    
      create() {
        const body = new FormData();
        if (this.employee.name) body.append("name", this.employee.name);
        if (this.employee.title) body.append("title", this.employee.title);
        if (this.employee.email) body.append("email", this.employee.email);
        if (this.employee.password) body.append("password", this.employee.password);
        if (this.employee.shift_id) body.append("shift_id", this.employee.shift_id);
        if (this.employee.position_id) body.append("position_id", this.employee.position_id);
        if (this.employee.national_id) body.append("national_id", this.employee.national_id);
        if (this.employee.basic_salary) body.append("basic_salary", this.employee.basic_salary);
        if (this.employee.type) body.append("type", this.employee.type);
        if (this.employee.role) body.append("role", this.employee.role);
        if (this.employee.skills) body.append("skills", this.employee.skills);
        if (this.employee.department) body.append("department_id", this.employee.department);
        if (this.employee.file) body.append("file", this.employee.file);
    
        axios.post(`/api/employees`,body).then((res) => {
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: this.$t("element_add_success"), life: 3000 });
        }).catch((el)=>{
          this.$toast.add({ severity: 'error', summary: this.$t("error"), detail:  `${el.response.data.message}`, life: 3000 });
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
  