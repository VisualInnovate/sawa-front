<template>
    <div>

    
    </div>
    <v-card>
      <div>


      
        <v-form style="max-height: 80vh; overflow-y: scroll;" fast-fail ref="form" @submit.prevent="submit" class="p-[2%]  bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4" >
          <!-- ... existing code ... -->
            
              
                <div   class="flex flex-column gap-2">
                    <label for="username">{{ $t('evaluation_name') }}</label>
                    <InputText   required class="bg-[#f7f5f5]" v-model="answer.title" :placeholder='$t("evaluation_name")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
                </div> 
      
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('child_name') }}</label>
                    <Dropdown   filter required id="pv_id_1" style="direction: ltr !important;" v-model="answer.child_id"  option-value="id" :options="childs" optionLabel="name" :placeholder='$t("child_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.child_id">{{ error.child_id[0] }}</div>
                </div>
               
                <div  v-if="answer.child_id" class="flex flex-column gap-2">
                  <label for="username">{{ $t('date') }}</label>
                  <Calendar  @update:model-value="getage" style="width: 100%" showButtonBar v-model.number="answer.date" showIcon  :placeholder='$t("date")'   />   
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.child_age">{{ error.child_age[0] }}</div>

              </div> 
              <div  v-if="answer.date" class="flex flex-column gap-2">
                    <label for="username">{{ $t('age') }}</label>
                    <InputNumber readonly  required class="bg-[#f7f5f5]" v-model="answer.child_age" :placeholder='$t("age")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.child_age">{{ error.child_age[0] }}</div>
                </div> 
               
                <div  class="flex flex-column gap-2">
                    <label for="username">{{ $t('mission_id') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;"  @update:model-value="getquation" v-model="answer.mission_id"  option-value="id" :options="qustions" optionLabel="name" :placeholder='$t("mission_id")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.mission_id">{{ error.mission_id[0] }}</div>
                </div>
              
              
                <div  class=" flex flex-column gap-2">
                    <label for="username">{{ $t('color') }}</label>

                     <div class="flex">
                      <ColorPicker   :style="{ 'background-color':'#' +answer.color  }"  class="w-full h-[50px]" v-model="answer.color" />
                    <Button @click="createevalutae"  class="create m-auto  w-full h-[50px] " :label='$t("strart_evaluate")'></Button>
                     </div>
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.color">{{ error.color[0] }}</div>
                </div> 
                
                <div v-if="strart_evaluate && answer.mission_id && answer.child_age"  class="col-span-2 flex flex-column gap-2">
                  <h1  class="text-[black] text-xl font-bold" >{{allquestion.category.title }}</h1>
                 <div style="border: 1px solid black; border-radius: 5px;padding: 1%;">
                    <h3 class="text-lg font-semibold ">{{allquestion.question}}</h3>
                    <div class="flex" v-for=" answer,index in allquestion.benchmarks">
                        <p>{{ index+1 }} - </p>
                        <p class="px-2"> {{ answer.body }}</p>
                    </div>
                    
                    <div class="py-2 px-4" >
                        <Rating v-model="answer.score" :cancel="false" :stars="allquestion.benchmarks.length">

    <template #onicon>
        <img src="../frontend/image/hhh.jfif" height="30" width="30" />
    </template>
    <template #officon>
        <img src="../frontend/image/nnn.png" height="34" width="34" />
    </template>
</Rating>
                       
                    </div>
                    <!-- <Rating  v-model="answer.score" :stars="allquestion.benchmarks.length" :cancel="false" /> -->
                       
                    
                  
<!--                         
                  <div style="border-radius: 5px;padding: 1%;" class="my-2"  v-for="(question, index) in head.questions" :key="index">
                      
                       <p class="py-1">{{ index+1 }} - {{ question.title }}:</p>
                       <div>
                     
                       </div>
                       <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          
                          <input required @change="getanswer($event, question.id,answer.level_id)" style="border: 1px solid black " class="mx-2" type="radio"  :name="question.id" value="0">
                          <label for="html">0</label><br>
                          <input required @change="getanswer($event, question.id,answer.level_id)" style="border: 1px solid black " type="radio"  :name="question.id" value=".5">
                          <label for="css">0.5</label><br>
                          <input required @change="getanswer($event, question.id,answer.level_id)" style="border: 1px solid black "   type="radio"  :name="question.id" value="1">
                          <label for="javascript">1</label>
                        </div>
                       
                         <div v-for="not in notanswer">
                          
                             <div class="mt-1 mb-5 text-red-500" v-if="not ==  question.id">please answer this qustions</div>
                         </div>
                       </div>
                       
                       
                    
                  </div> -->
                 </div>
                        
                           
                
              
                </div> 
                <div v-if="strart_evaluate" class="flex flex-column gap-2 w-full">
                  <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                  <Button @click="getanswer"  class="create m-auto w-full " :label='$t("submit")'></Button>
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
    components:{},
  
  
    data() {
      return {
        strart_evaluate:false,
        answers:[],
        type:4,
        
           
        answer:{ 
            color:"00a2ff",
            score:0
            
        },
       allquestion:{},
        childs:{},
        qustions:{},
        error: {},
        maxDate: new Date(),
        notanswer:[],
       
        // Add other validation rules for the title field
      };
  
    },

  
    methods: {
      // ... existing methods ...
      Therapeutic (){
        this.$router.push({ name: 'answer' });
      },


      submit(){
        
        
      },
      createevalutae(id){
        console.log(id)
        
        axios
          .post(`api/evaluations/create`,{
            type:4,
            title:this.answer.title,
            child_id:this.answer.child_id,
            specialist_id:localStorage.getItem("user_id"),
            date:this.answer.date
          
          })
          .then((response) => {
          
            this.answer.evaluation_id=response.data.evaluation.id
           this.strart_evaluate=!(this.strart_evaluate)
           
           
          })
      },
      anserdata(id,val){
        console.log(id)
        console.log(val)
      },
      getcolor(id){
        this.answer.color=id.target.value
      },
      getquation(id){
        axios
          .get(`api/able-mission/${id}`)
          .then((response) => {
            console.log(response.data.data)
            this.allquestion = response.data.data
           
           
          })
      },
      getage(){
        axios
          .post("api/milestone-answers/get-age-child",{
            date:this.answer.date,
            child_id:this.answer.child_id
          })
          .then((response) => {
           this.answer.child_age=response.data
           
          })
      },
      getanswer(){

        
        axios.post("/api/able-answer",this.answer).then((res) => {
            this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });
          
        }).catch((el)=>{
        
       this.error = el.response.data.errors
      })
      

      },
      getusers(){
        
       
        axios
          .get("api/child")
          .then((response) => {
           
            this.childs = response.data.children
            this.answer.child_id=parseInt(this.$route.params.id)
            this.answer.evaluation_id=parseInt(this.$route.params.evaluation)
          })
          axios
          .get("api/able-mission")
          .then((response) => {
            console.log(response.data.data)
            this.qustions = response.data.data
           
          })
         
  
      },
     
      
    
      createtreatment() {
      
        axios.post("/api/milestone-answers/check/answers",{
          child_id:this.answer.child_id,
          level_id:this.answer.level_id,

        }).then((res) => {
          console.log(res.data.data)
          this.notanswer=res.data.data
          if(this.notanswer == ''){
            this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });
          }
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
  