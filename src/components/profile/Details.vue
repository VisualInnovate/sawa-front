<template v-can="'employees edit'">
    <v-card class="p-[1%]">
     
  
     <form class="form-container" ref="myForm" @submit.prevent="update">
       <!-- Step 1 -->
  
       <div   v-if="currentStep === 0">
         <h3 class="text-center text-xl font-bold text-blue-950"> {{ $t("student_details") }}</h3>
        <div class="p-[2%]  bg-[#FDFDFD]  grid grid-cols-1 lg:grid-cols-2 gap-4">
  
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
                       <label class="text-right ">{{ $t("national_id") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <InputNumber inputId="withoutgrouping" :useGrouping="false" fluid  required class="bg-[#f7f5f5]" v-model="employee.national_id"  :class="{ 'p-invalid': submitted && !employee.national_id }" />
                 </div>  
                 <div class="flex flex-column gap-2">
                   <div class="flex">
                       <label class="text-right ">{{ $t("date_of_birth") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <Calendar    showButtonBar v-model.number="employee.date_of_birth" showIcon    :class="{ 'p-invalid': submitted && !employee.date_of_birth }" /> 
                 </div> 
               <div class=" flex-column gap-2 py-1 hidden">
                   <label class="w-full " for="username">{{ $t('personal_image') }}</label>
            
                   <InputText name="file"  ref="file" @change="uploadFile" accept="image/*" id="filr"   type="file" class="w-full" />
                 <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
               </div>
        </div>
        <div class="w-full text-center">
         <Button class="create w-[50%]" :label='$t("next")' @click="nextStep"></Button>
        </div>
       
       </div>
       <!-- Step 2 -->
       <div v-if="currentStep === 1">
         <h3 class="text-center text-xl font-bold text-blue-950"> {{ $t("job_details") }}</h3>
         <div class="p-[2%]  bg-[#FDFDFD]  grid grid-cols-1 lg:grid-cols-2 gap-4">
  
           <div class="flex flex-column gap-2">
                <div class="flex">
                       <label class="text-right ">{{ $t("position_name") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
              <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee.position_id"  option-value="id" :options="positions" optionLabel="title" :placeholder='$t("position_name")' class="w-full "  :class="{ 'p-invalid': submitted && !employee.position_id }"/>
          </div>
          <div class="flex flex-column gap-2">
                    <div class="flex">
                       <label class="text-right ">{{ $t("shift_name") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="employee.shift_id"  option-value="id" :options="shifts" optionLabel="title" :placeholder='$t("shift_name")' class="w-full  "  :class="{ 'p-invalid': submitted && !employee.shift_id }"/>
  
           </div>
           <div class="flex flex-column gap-2">
                   <div class="flex">
                       <label class="text-right ">{{ $t("basic_salary") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <InputNumber inputId="withoutgrouping" :useGrouping="false" fluid   required class="bg-[#f7f5f5]" v-model="employee.basic_salary" :placeholder='$t("basic_salary")' :class="{ 'p-invalid': submitted && !employee.basic_salary }" />
             </div>
             <div class="flex flex-column gap-2">
                   <div class="flex">
                       <label class="text-right ">{{ $t("Spotter") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <InputNumber  required class="bg-[#f7f5f5]" v-model="employee.spotter" :placeholder='$t("Spotter")' :class="{ 'p-invalid': submitted && !employee.Spotter }" />
             </div>
             <div class="flex flex-column gap-2 py-1">                
                 <div class="flex">
                         <label class="text-right ">{{ $t("contract_period") }}</label>
                         <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                         </svg>
                     </div>
                   <InputText  class="bg-[#f7f5f5] text-center" v-model="employee.contract_period" :class="{ 'p-invalid': submitted && !employee.contract_period}" />
               </div>  
             <div class="flex flex-column gap-2">
                   <div class="flex">
                       <label class="text-right ">{{ $t("date_of_enrollment") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <Calendar    showButtonBar v-model.number="employee.date_of_enrollment" showIcon    :class="{ 'p-invalid': submitted && !employee.date_of_enrollment }" /> 
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
               <div v-if="employee.type == 0 || employee.type ==2 " class="flex flex-column gap-2">
                   <div class="flex">
                     <label class="text-right ">{{ $t("Typetreatment") }}</label>
                     <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                     </svg>
                   </div>
                   <MultiSelect  v-model="employee.treatments" filter option-value="id" :options="treatments" optionLabel="name" :class="{ 'p-invalid': submitted && !employee.treatments}" />
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
     
       </div>
       <div class="text-center">
         <Button @click="previousStep" class="create" :label='$t("Back")' ></Button>
         <Button  type="submit" @click="submitted=true"  class="create" :label='$t("submit")'></Button>
       </div>
         
       </div>
  
       <toast></toast>
     </form>
   </v-card>
  </template>
  
  <script>
  import axios from "axios";
  import InputNumber from "primevue/inputnumber";
  import moment from "moment";
  
    import {useToast} from 'primevue/usetoast'
  export default {
  
  
    data() {
      return {
        currentStep: 0,
        employee_id:'',
        steps: [
          { label: "Personal Details" },
          { label: "Job Details" },
          { label: "Additional Details" },
        ],
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
          treatments:[]
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {
      // ... existing methods ...
    
  
      tpes(){
          return[
          
          { name:this.$t('driver'), id: 1 },
          { name:this.$t('doctor'), id: 2 },
          { name:this.$t('Evaluator'), id: 5 },
          { name:this.$t('أداري'), id: 6 },
        ]
        },
  
          nextStep() {
            if (this.currentStep < this.steps.length - 1) {
              this.currentStep++;
            }
          },
          previousStep() {
            if (this.currentStep > 0) {
              this.currentStep--;
            }
          },
          navigateToStep(step) {
            this.currentStep = step;
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
      getoneanswer(){
          axios
            .get(`api/users/${this.employee_id}`)
            .then((response) => {
             
              this.employee.name = response.data.user.name
              this.employee.email = response.data.user.email
              this.employee.role = response.data.user?.roles[0]?.id 
              this.employee.title = response.data.user.title 
              this.employee.type = response.data.user.type  
              this.employee.date_of_birth = response.data.user.date_of_birth 
              this.employee.national_id =parseInt( response.data.user.national_id  )      
              this.employee.user_id = response.data.user.user_id
              this.employee.position_id = response.data.user.position_id
              this.employee.basic_salary = response.data.user.basic_salary
              this.employee.shift_id = response.data.user.shift_id
              this.employee.department_id = response.data.user.department_id          
              this.employee.contract_period = response.data.user.contract_period     
              this.employee.spotter = response.data.user.spotter          
              this.employee.date_of_enrollment = response.data.user.date_of_enrollment          
          
      
              this.employee.image = response.data.user.image          
         
           
               
              this.employee.skills = [];
              for (let i =0 ; i < response.data.user.skills.length; i++) {    
                this.employee.skills.push(response.data.user.skills[i].id);
          
            
                 }  
                 this.employee.department = [];
                 for (let i =0 ; i < response.data.user.departments.length; i++) {    
                this.employee.department.push(response.data.user.departments[i].id);
          
            
                 }  
                 this.employee.treatments = [];
                 for (let i =0 ; i < response.data.user.treatments.length; i++) {    
                this.employee.treatments.push(response.data.user.treatments[i].id);
          
            
                 }  
              
            })
  
         },
  
  
      getusers(){
  
          axios
          .post("api/users")
          .then((response) => {
            this.users=response.data.users.data
            this.getoneanswer()
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
          axios.get("api/treatment/all")
        .then((response) => {
          this.treatments=response.data.data
        })
          axios.post("/api/roles").then((res)=>{
  
          this.roles= res.data.roles.data
  
  
          });
          axios.get("/api/skills").then((res)=>{
                this.skills=res.data.data
              
  
              });
          axios
          .get("api/department")
          .then((response) => {
            this.departments=response.data.data
          })
          axios
          .get(`/api/countries/${localStorage.getItem("appLang")}`)
        .then((res) => {
         
          this.cities = res.data.countries
         
        })
      },
     
      
    
      update() {
        const body = new FormData();
          if (this.employee.name) body.append("name", this.employee.name);
          if (this.employee.title) body.append("title", this.employee.title);
          if (this.employee.email) body.append("email", this.employee.email);
          if (this.employee.password) body.append("password", this.employee.password);
          if (this.employee.shift_id) body.append("shift_id", this.employee.shift_id);
          if (this.employee.spotter) body.append("spotter", this.employee.spotter);
          if (this.employee.position_id) body.append("position_id", this.employee.position_id);
          if (this.employee.date_of_birth) body.append("date_of_birth",moment(this.employee.date_of_birth).format("YYYY-MM-DD" ) );
          if (this.employee.date_of_enrollment) body.append("date_of_enrollment", moment( this.employee.date_of_enrollment).format("YYYY-MM-DD" ) );
          if (this.employee.contract_period) body.append("contract_period", this.employee.contract_period);
          if (this.employee.national_id) body.append("national_id", this.employee.national_id);
          if (this.employee.basic_salary) body.append("basic_salary", this.employee.basic_salary);
          if (this.employee.type) body.append("type", this.employee.type);
          if (this.employee.role) body.append("role", this.employee.role);
          if (this.employee.treatments) body.append("treatments", this.employee.treatments);
          if (this.employee.skills) body.append("skills", this.employee.skills);
          if (this.employee.department) body.append("department_id", this.employee.department);
          if (this.employee.file) body.append("image", this.employee.file);
        axios.post(`/api/employees/${this.employee_id}`,body).then((res) => {
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: this.$t("element_add_success"), life: 3000 });
          }).catch((el)=>{
            this.$toast.add({ severity: 'error', summary: this.$t("error"), detail:  `${el.response.data.message}`, life: 3000 });
      })
      },
     
    },
    mounted() {
        this.employee_id=localStorage.getItem("user_id")
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
  