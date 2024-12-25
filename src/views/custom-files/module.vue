<script>
import axios from "axios";
import InputText from "primevue/inputtext";
import moment from "moment";
import {useToast} from 'primevue/usetoast'
import Calendar from "primevue/calendar";
import { max } from "date-fns";
export default {
  components: { InputText, Calendar },
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
  <!--  <v-alert v-if="alert_text!= null " color="green" :text="alert_text" class="mb-5"></v-alert>-->

  <v-card class="p-[1%]">

    <div class="flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('attributable_type') }}</label>
                    <Dropdown @update:model-value="get_request" filter required id="pv_id_1" style="direction: ltr !important;" v-model="custom.attributable_type"  option-value="name" :options="modules" optionLabel="name"  class="w-full bg-[#f7f5f5]"  />

            </div>
     
    
     
      <Toast/>
    
  </v-card>
</template>
