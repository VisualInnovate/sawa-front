<template>
    <div class="sawa-card p-[1%]">
     <div v-if="loading" class="flex justify-center py-8">
       <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="4" />
     </div>
     <form v-else class="form-container" ref="myForm" @submit.prevent="update">
       <Message v-if="!canEditProfile" severity="info" :closable="false" class="mb-4">
         {{ $t('profile_read_only_hint') }}
       </Message>
       <!-- Step 1 -->
  
       <div   v-if="currentStep === 0">
         <h3 class="text-center text-xl font-bold text-blue-950"> {{ $t("student_details") }}</h3>
        <div class="p-[2%]  bg-[#FDFDFD]  grid grid-cols-1 lg:grid-cols-2 gap-4">
  
         <div class="col-span-2">
         <div ><img @click="chooseImage" class="m-auto rounded-full" :class="{ 'profile-image-editable': canEditProfile, 'p-invalid': submitted && !employee.image}" style="width: 150px ;height: 150px;" v-if="employee.image" :src=" employee.image" >
                   <img @click="chooseImage" class="m-auto rounded-full" :class="{ 'profile-image-editable': canEditProfile, 'p-invalid': submitted && !employee.image}" style="width: 150px ;height: 150px;" v-else src="https://sys.sawa.sawa.academy/public/default.jpg">
                  
                   </div>
            
           </div>
         <div class="flex flex-column gap-2 py-1">                
             <div class="flex">
                     <label class="text-start ">{{ $t("employee_name") }}</label>
                     <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                     </svg>
                 </div>
             <InputText :disabled="!canEditProfile" class="text-center" v-model="employee.name" :class="{ 'p-invalid': submitted && !employee.name}" />
          </div>
        
          <div class="flex flex-column gap-2 py-1">
                  <div class="flex">
                          <label class="text-start ">{{ $t("email") }}</label>
                          <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                          </svg>
                      </div>
                    <InputText :disabled="!canEditProfile" type="email" class="text-center" v-model="employee.email" :class="{ 'p-invalid': submitted && !employee.email}" />
           </div>
             <div class="flex flex-column gap-2 py-1">                
                 <div class="flex">
                         <label class="text-start ">{{ $t("title") }}</label>
                         <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                         </svg>
                     </div>
                   <InputText :disabled="!canEditProfile" class="text-center" v-model="employee.title" :class="{ 'p-invalid': submitted && !employee.title}" />
               </div>  
               <div class="flex flex-column gap-2">
                   <div class="flex">
                       <label class="text-start ">{{ $t("national_id") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <InputNumber :disabled="!canEditProfile" inputId="withoutgrouping" :useGrouping="false" fluid required v-model="employee.national_id" :class="{ 'p-invalid': submitted && !employee.national_id }" />
                 </div>  
                 <div class="flex flex-column gap-2">
                   <div class="flex">
                       <label class="text-start ">{{ $t("date_of_birth") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <DatePicker :disabled="!canEditProfile" showButtonBar v-model.number="employee.date_of_birth" showIcon :class="{ 'p-invalid': submitted && !employee.date_of_birth }" /> 
                 </div> 
               <div class=" flex-column gap-2 py-1 hidden">
                   <label class="w-full " for="username">{{ $t('personal_image') }}</label>
            
                   <InputText :disabled="!canEditProfile" name="file" ref="file" @change="uploadFile" accept="image/*" id="filr" type="file" class="w-full" />
                 <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
               </div>
        </div>
        <div class="w-full text-center">
         <Button class="w-[50%]" :label='$t("next")' @click="nextStep"></Button>
        </div>
       
       </div>
       <!-- Step 2 -->
       <div v-if="currentStep === 1">
         <h3 class="text-center text-xl font-bold text-blue-950"> {{ $t("job_details") }}</h3>
         <div v-if="lookupsLoading" class="flex justify-center py-8">
           <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="4" />
         </div>
         <div v-else class="p-[2%]  bg-[#FDFDFD]  grid grid-cols-1 lg:grid-cols-2 gap-4">
  
           <div class="flex flex-column gap-2">
                <div class="flex">
                       <label class="text-start ">{{ $t("position_name") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
              <Select :disabled="!canEditProfile" required v-model="employee.position_id" option-value="id" :options="positions" optionLabel="title" :placeholder='$t("position_name")' class="w-full" :class="{ 'p-invalid': submitted && !employee.position_id }"/>
          </div>
          <div class="flex flex-column gap-2">
                    <div class="flex">
                       <label class="text-start ">{{ $t("shift_name") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <Select :disabled="!canEditProfile" required v-model="employee.shift_id" option-value="id" :options="shifts" optionLabel="title" :placeholder='$t("shift_name")' class="w-full" :class="{ 'p-invalid': submitted && !employee.shift_id }"/>
  
           </div>
           <div class="flex flex-column gap-2">
                   <div class="flex">
                       <label class="text-start ">{{ $t("basic_salary") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <InputNumber :disabled="!canEditProfile" inputId="withoutgrouping" :useGrouping="false" fluid required v-model="employee.basic_salary" :placeholder='$t("basic_salary")' :class="{ 'p-invalid': submitted && !employee.basic_salary }" />
             </div>
             <div class="flex flex-column gap-2">
                   <div class="flex">
                       <label class="text-start ">{{ $t("Spotter") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <InputNumber :disabled="!canEditProfile" required v-model="employee.spotter" :placeholder='$t("Spotter")' :class="{ 'p-invalid': submitted && !employee.Spotter }" />
             </div>
             <div class="flex flex-column gap-2 py-1">                
                 <div class="flex">
                         <label class="text-start ">{{ $t("contract_period") }}</label>
                         <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                         </svg>
                     </div>
                   <InputText :disabled="!canEditProfile" class="text-center" v-model="employee.contract_period" :class="{ 'p-invalid': submitted && !employee.contract_period}" />
               </div>  
             <div class="flex flex-column gap-2">
                   <div class="flex">
                       <label class="text-start ">{{ $t("date_of_enrollment") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <DatePicker :disabled="!canEditProfile" showButtonBar v-model.number="employee.date_of_enrollment" showIcon :class="{ 'p-invalid': submitted && !employee.date_of_enrollment }" /> 
                 </div> 
           <div class="flex flex-column gap-2 py-1">
                   <div class="flex">
                     <label class="text-start ">{{ $t("type") }}</label>
                     <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                     </svg>
                   </div>
                   <Select :disabled="!canEditProfile" v-model="employee.type" option-value="id" filter :options="tpes()" optionLabel="name" :class="{ 'p-invalid': submitted && !employee.type}" />
           </div>
            <div v-if="employee.type == 0 || employee.type ==2 " class="flex flex-column gap-2">
                   <div class="flex">
                     <label class="text-start ">{{ $t("skill_name") }}</label>
                     <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                     </svg>
                   </div>
                   <MultiSelect :disabled="!canEditProfile" v-model="employee.skills" filter option-value="id" :options="skills" optionLabel="name" :class="{ 'p-invalid': submitted && !employee.skills}" />
               </div>
               <div v-if="employee.type == 0 || employee.type ==2 " class="flex flex-column gap-2">
                   <div class="flex">
                     <label class="text-start ">{{ $t("Typetreatment") }}</label>
                     <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                     </svg>
                   </div>
                   <MultiSelect :disabled="!canEditProfile" v-model="employee.treatments" filter option-value="id" :options="treatments" optionLabel="name" :class="{ 'p-invalid': submitted && !employee.treatments}" />
               </div>
               <div  class="flex flex-column gap-2">
                     <div class="flex">
                       <label class="text-start ">{{ $t("department") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                     <MultiSelect :disabled="!canEditProfile" v-model="employee.department" filter option-value="id" :options="departments" optionLabel="title" :class="{ 'p-invalid': submitted && !employee.department}" />
               </div>
               
               <div class="flex flex-column gap-2 py-1">
                   <div class="flex">
                       <label class="text-start ">{{ $t("roles") }}</label>
                       <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                       </svg>
                     </div>
                   <Select :disabled="!canEditProfile" v-model="employee.role" option-value="id" filter :options="roles" optionLabel="name" :class="{ 'p-invalid': submitted && !employee.role}" />
                 </div>
     
       </div>
       <div class="text-center">
         <Button @click="previousStep" :label='$t("Back")'></Button>
         <Button v-can="'employees edit'" type="submit" @click="submitted=true"  :label='$t("submit")'></Button>
       </div>
         
       </div>
  
       <Toast />
     </form>

     <section v-if="!loading" class="password-section">
       <div>
         <h3>{{ $t('change_password') }}</h3>
         <p>{{ $t('change_own_password_hint') }}</p>
       </div>
       <form class="password-form" @submit.prevent="updatePassword">
         <div class="flex flex-column gap-2">
           <label for="profile-current-password">{{ $t('current_password') }}</label>
           <Password inputId="profile-current-password" v-model="passwordForm.current_password" toggleMask
             :feedback="false" autocomplete="current-password" fluid
             :invalid="Boolean(passwordErrors.current_password)" />
           <small v-if="passwordErrors.current_password" class="field-error">{{ passwordErrors.current_password[0] }}</small>
         </div>
         <div class="flex flex-column gap-2">
           <label for="profile-new-password">{{ $t('new_password') }}</label>
           <Password inputId="profile-new-password" v-model="passwordForm.password" toggleMask
             autocomplete="new-password" fluid :invalid="Boolean(passwordErrors.password)" />
           <small v-if="passwordErrors.password" class="field-error">{{ passwordErrors.password[0] }}</small>
         </div>
         <div class="flex flex-column gap-2">
           <label for="profile-password-confirmation">{{ $t('confirm_password') }}</label>
           <Password inputId="profile-password-confirmation" v-model="passwordForm.password_confirmation" toggleMask
             :feedback="false" autocomplete="new-password" fluid :invalid="passwordMismatch" />
           <small v-if="passwordMismatch" class="field-error">{{ $t('passwords_do_not_match') }}</small>
         </div>
         <Button type="submit" icon="pi pi-lock" :label="$t('change_password')" :loading="passwordLoading"
           :disabled="!passwordForm.current_password || !passwordForm.password || passwordMismatch" />
       </form>
     </section>
   </div>
  </template>
  
  <script>
  import axios from "axios";
  import InputNumber from "primevue/inputnumber";
  import moment from "moment";
  import { fetchUserProfile } from "./userProfile";
  import { can } from "../../utils/permissions";
  
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
          submitted:false,
          loading:true,
          lookupsLoading:false,
          lookupsLoaded:false,
          positions:[],
          shifts:[],
          skills:[],
          roles:[],
          departments:[],
          qustions:{},
          error: {},
          maxDate: new Date(),
          treatments:[]
          ,passwordForm: { current_password: '', password: '', password_confirmation: '' }
          ,passwordErrors: {}
          ,passwordLoading: false
        // Add other validation rules for the title field
      };
  
    },
  
    computed: {
      canEditProfile() {
        return can('employees edit')
      },
      passwordMismatch() {
        return Boolean(this.passwordForm.password_confirmation) &&
          this.passwordForm.password !== this.passwordForm.password_confirmation
      },
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
      chooseImage() {
        if (this.canEditProfile) document.getElementById('filr')?.click()
      },
  
          nextStep() {
            if (this.currentStep < this.steps.length - 1) {
              this.currentStep++;
            }
            if (this.currentStep === 1) this.getLookups();
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
          this.loading = true
          fetchUserProfile()
            .then((data) => {
              const response = { data }
             
              this.employee.name = response.data.user.name
              this.employee.email = response.data.user.email
              this.employee.role = response.data.user?.roles[0]?.id 
              this.employee.title = response.data.user.title 
              this.employee.type = response.data.user.type  
              this.employee.date_of_birth = response.data.user.date_of_birth 
              // Accounts without an employee record (e.g. the admin) have no national id.
              this.employee.national_id = response.data.user.national_id ? parseInt(response.data.user.national_id) : null
              this.employee.user_id = response.data.user.user_id
              this.employee.position_id = response.data.user.position_id
              this.employee.basic_salary = response.data.user.basic_salary
              this.employee.shift_id = response.data.user.shift_id
              this.employee.department_id = response.data.user.department_id          
              this.employee.contract_period = response.data.user.contract_period     
              this.employee.spotter = response.data.user.spotter          
              this.employee.date_of_enrollment = response.data.user.date_of_enrollment          
          
      
              this.employee.image = response.data.user.image          
              if (!this.canEditProfile) {
                this.positions = response.data.user.position ? [response.data.user.position] : []
                this.shifts = response.data.user.shift ? [response.data.user.shift] : []
                this.roles = response.data.user.roles ?? []
                this.skills = response.data.user.skills ?? []
                this.departments = response.data.user.departments ?? []
                this.treatments = response.data.user.treatments ?? []
              }
         
           
               
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
            .finally(() => {
              this.loading = false
            })
  
         },
  
  
      // Job-details dropdowns are only needed on step 2, so load them when it is first opened.
      getLookups(){
          if (!this.canEditProfile) return
          if (this.lookupsLoaded || this.lookupsLoading) return
          this.lookupsLoading = true
          Promise.all([
            axios.get("api/shifts").then((response) => { this.shifts = response.data.data }),
            axios.get("api/position").then((response) => { this.positions = response.data.data }),
            axios.get("api/treatment/all").then((response) => { this.treatments = response.data.data }),
            axios.post("/api/roles").then((res) => {
              this.roles = res.data.roles.data.filter((role) => !role.is_locked || this.$isAdmin())
            }),
            axios.get("/api/skills").then((res) => { this.skills = res.data.data }),
            axios.get("api/department").then((response) => { this.departments = response.data.data }),
          ])
            .then(() => { this.lookupsLoaded = true })
            .catch(() => {
              this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: this.$t("request_failed_retry"), life: 5000 });
            })
            .finally(() => { this.lookupsLoading = false })
      },
     
      
    
      update() {
        if (!this.canEditProfile) return
        const body = new FormData();
          if (this.employee.name) body.append("name", this.employee.name);
          if (this.employee.title) body.append("title", this.employee.title);
          if (this.employee.email) body.append("email", this.employee.email);
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
      async updatePassword() {
        if (this.passwordLoading || this.passwordMismatch) return
        this.passwordLoading = true
        this.passwordErrors = {}
        try {
          await axios.post('/api/users/profile/password', this.passwordForm)
          this.passwordForm = { current_password: '', password: '', password_confirmation: '' }
          this.$toast.add({ severity: 'success', summary: this.$t('success_message'), detail: this.$t('password_changed_successfully'), life: 3000 })
        } catch (error) {
          this.passwordErrors = error.response?.data?.errors ?? {}
          if (!Object.keys(this.passwordErrors).length) {
            this.$toast.add({ severity: 'error', summary: this.$t('error'), detail: this.$t('request_failed_retry'), life: 4000 })
          }
        } finally {
          this.passwordLoading = false
        }
      },
     
    },
    mounted() {
        this.employee_id=localStorage.getItem("user_id")
     this.getoneanswer()
    },
  };
  </script>
  
  <style scoped>
  .profile-image-editable {
    cursor: pointer;
  }

  .password-section {
    margin-top: 1.25rem;
    padding: 1.25rem;
    border: 1px solid var(--sawa-border, #dce8e8);
    border-radius: 14px;
    background: #fff;
  }

  .password-section h3 {
    margin: 0;
    color: var(--sawa-primary, #135c65);
    font-size: 1.1rem;
    font-weight: 700;
  }

  .password-section p {
    margin: 0.35rem 0 1rem;
    color: var(--sawa-muted, #64748b);
  }

  .password-form {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    align-items: end;
  }

  .password-form .p-button {
    width: fit-content;
  }

  @media (max-width: 900px) {
    .password-form {
      grid-template-columns: 1fr;
    }
  }

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
  
