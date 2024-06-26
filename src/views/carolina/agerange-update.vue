<template>
    <div>
        <v-card class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 bg-slate-100">
            <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('from') }} (years)</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="carolina.from" :placeholder='$t("from")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.seats">{{ error.seats[0] }}</div>
                </div> 
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('to') }} (years)</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="carolina.to" :placeholder='$t("to")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.seats">{{ error.seats[0] }}</div>
                </div> 
       </v-card>
       <v-card class="bg-slate-100 my-5" >
        
       <div  class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 my-5 " >
        <div  class="flex flex-column gap-2">
                    <label for="username">{{ $t('from') }} (month)</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="carolina.frommonth" :placeholder='$t("from")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.seats">{{ error.seats[0] }}</div>
                </div> 
                <div class="flex">
                    <div class="flex w-[86%] flex-column gap-2">
                    <label for="username">{{ $t('to') }} (month)</label>
                    <InputNumber  required class="bg-[#f7f5f5]" v-model="carolina.tomonth" :placeholder='$t("to")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.seats">{{ error.seats[0] }}</div>
                    </div> 
                    <div class="flex flex-column gap-2">
                    <label class="invisible" for="username">{{ $t('to') }} (month)</label>
                    <Button   @click="addarry"  class="create m-auto  " icon="pi pi-plus" ></Button>
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.seats">{{ error.seats[0] }}</div>
                    </div> 
               
                </div>
       </div>
       <div class="flex flex-col col-span-2 gap-2 mx-5">
                    <div class="flex relative bg-slate-200 rounded-md p-4" v-for=" mou,index in carolina.groups">
                        <span class="my-auto">{{ index+1 }} - </span>
                        <span>{{ $t("from") }}</span>
                        <p class="px-1 text-green-500 text-xl">{{ mou.from }}</p>
                        <span>{{ $t("to") }}</span>
                        <p class="px-1 text-green-500 text-xl">{{ mou.to }}</p>
                        <Button   @click="deletearray(index)"  class="delete m-auto absolute top-1 ltr:right-2 rtl:left-2  " icon="pi pi-minus" ></Button>
                    </div>
                </div>
     
       <div class="w-full text-center">
        <Button @click="createtreatment" class="create m-auto w-64 my-4 " :label='$t("submit")'></Button>

       </div>
       </v-card>
    </div>
    <toast></toast>
</template>

<script>
import axios from "axios";
import InputNumber from "primevue/inputnumber";

  import {useToast} from 'primevue/usetoast'
export default {


  data() {
    return {
      carolina:{
        groups:[]
      },
      drivers:{},
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





    getusers(){
      axios
        .get(`api/carolina-age-range/${this.$route.params.id}`)
        .then((response) => {
          console.log(response.data.data)
          this.carolina = response.data.data
         
        })
        .catch((error) => {
          console.error("Error retrieving Appointment Types:", error);
        });

    },
    addarry(){
        if(this.carolina.tomonth &&this.carolina.frommonth ){
            this.carolina.groups.push({ from: `${this.carolina.frommonth}` ,to:`${this.carolina.tomonth}`})

        }
    },
    deletearray(index){
        this.carolina.groups.splice(index,1)
      },
  
    createtreatment() {

      axios.put(`/api/carolina-age-range/${this.$route.params.id}`,this.carolina).then((res) => {
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