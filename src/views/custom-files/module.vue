<script>
import axios from "axios";
import InputText from "primevue/inputtext";
import moment from "moment";
import {useToast} from 'primevue/usetoast'
import DatePicker from 'primevue/datepicker';
import { max } from "date-fns";
export default {
  components: { InputText, DatePicker },
  data: () => ({
    pasrents:{},
   
    submitted:false,
    toast:useToast(),
     data:{},
     modules:[],
     custom:{},
   
  }),
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    get_request(name){

        axios
        .get(`/api/attributes/${name}/${localStorage.getItem("appLang")}`)
        .then((res) => {
          console.log(res.data.countries)
          this.data = res.data.data
         
        })
    },
    getModules(){
     
      
        axios
        .get(`/api/all-modules`)
        .then((res) => {
          console.log(res.data.countries)
          this.modules = res.data.data
         
        })
        
       
    },
  
  },
  mounted() {
    this.getModules()
  },
};
</script>
<template>


  <div class="sawa-card p-[1%]">

    <div class="flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('attributable_type') }}</label>
                    <Select @update:model-value="get_request" filter required v-model="custom.attributable_type"  option-value="name" :options="modules" optionLabel="name"  class="w-full"  />

            </div>
     
    
     
      <Toast/>
    
  </div>
</template>
