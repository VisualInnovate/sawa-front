<template>
    <div>
      <div>
        <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" >{{ $t("missions") }}</p>
      </div>
      <div v-if="loading" class="loader"></div>
      <!-- Your existing content goes here -->
    </div>
    <v-card>
      <div>
        <!-- ... existing code ... -->
       
        <v-form class="p-[2%]  bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4" ref="myForm" @submit.prevent="seedData">
          <!-- ... existing code ... -->
            
              
            
      
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('category') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="mission.category_id"  option-value="id" :options="allcategory" optionLabel="title" :placeholder='$t("category")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1  text-red-500" v-if="error?.category_id">{{ error.category_id[0] }}</div>
                </div>
               
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('name') }}</label>
                    <InputText  required class="bg-[#f7f5f5]" v-model="mission.name" :placeholder='$t("name")' />
                    <div class="mt-1  text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
                </div> 
                <div class="flex  flex-column gap-2">
                    <label for="username">{{ $t('goal') }}</label>
                    <v-textarea rows="2" bg-color="#EAE8E9" v-model="mission.goal"  ></v-textarea>
                   
                    <div class="mt-1  text-red-500" v-if="error?.goal">{{ error.goal[0] }}</div>
                </div> 
                <div class="flex  flex-column gap-2">
                    <label for="username" >{{ $t('question') }}</label>
                    <v-textarea rows="2" bg-color="#EAE8E9" v-model="mission.question"  ></v-textarea>
                    
                    <div class="mt-1  text-red-500" v-if="error?.question">{{ error.question[0] }}</div>
                </div> 
                <div class="flex  flex-column gap-2">
                    <label for="username">{{ $t('sample') }}</label>
                    <v-textarea rows="2"  bg-color="#EAE8E9" v-model="mission.sample"  ></v-textarea>
             
                    <div class="mt-1  text-red-500" v-if="error?.sample">{{ error.sample[0] }}</div>
                </div> 
                <div class="flex  flex-column gap-2">
                    <label for="username">{{ $t('Note') }}</label>
                    <v-textarea rows="2" bg-color="#EAE8E9" v-model="mission.note"  ></v-textarea>
                     
                    <div class="mt-1  text-red-500" v-if="error?.note">{{ error.note[0] }}</div>
                </div> 
                <div class="flex flex-col gap-2">
                    <label for="username">{{ $t('note') }}</label>
                   <div class="flex">
                    <InputText  required class="bg-[#f7f5f5] w-[90%] m-auto" v-model="mission.body" :placeholder='$t("name")' />
                    <Button   @click="addarry"  class="create m-auto  " icon="pi pi-plus" ></Button>
                   </div>
                </div>
                <div class="flex flex-column gap-2 w-full">
                  <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                  <Button @click="create" class="create m-auto w-full " :label='$t("submit")'></Button>
                  <div class="mt-1  text-red-500" v-if="error?.benchmarks">{{ error.benchmarks[0] }}</div>
                </div>
                <div class="flex flex-col col-span-2 gap-2">
                    <div class="flex relative bg-slate-200 rounded-md p-4" v-for="bench,index in mission.benchmarks">
                        <span class="my-auto">{{ index+1 }} - </span>
                        <p class="px-1 text-green-500 text-xl">{{ bench.body }}</p>
                        <Button   @click="deletearray(index)"  class="delete m-auto absolute top-1 ltr:right-2 rtl:left-2  " icon="pi pi-minus" ></Button>
                    </div>
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
        mission:{
            benchmarks:[]
        },
        allcategory:[],
        error: {},
        maxDate: new Date(),
       
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {
      // ... existing methods ...
      Therapeutic (){
        this.$router.push({ name: 'transportation' });
      },
      addarry(){
        if(this.mission.body){
            this.mission.benchmarks.push({ body: `${this.mission.body}` });
        }
       
      },
      deletearray(index){
        this.mission.benchmarks.splice(index,1)
      },


  

  
      getcategory(){
        axios
          .get("api/able-category")
          .then((response) => {
            console.log(response.data.data)
            this.allcategory = response.data.data
           
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
  
      },
    
    create() {

        axios.post("/api/able-mission",this.mission).then((res) => {
          this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });
        }).catch((el)=>{
          console.log(el.response.data.errors.name)
       this.error = el.response.data.errors
      })
      },
     
    },
    mounted() {
     this.getcategory()
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
  