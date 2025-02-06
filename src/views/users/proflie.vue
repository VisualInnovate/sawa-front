
<template>
  <v-card class="card relative ">
         
<div class="absolute z-50 top-1 ltr:right-0-4 rtl:left-4 flex flex-column gap-2">
  <Dropdown @update:model-value="get_request" required id="pv_id_1" style="direction: ltr !important;" v-model="user.child_id"  option-value="id" filter :options="user.children" optionLabel="name" :placeholder='$t("child_name")' class=" bg-[#f7f5f5] [&>div>div>span]:bg-black w-[200px] h-[90%]" />   
                        
                </div>
      <TabView  v-model:activeIndex="active">
            
          <TabPanel :header="$t('student_details')">
        
            <Details></Details>
          </TabPanel>
          <TabPanel :header="$t('Consultations_evaluations')">
      
          </TabPanel>
          <TabPanel :header="$t('children')">
              
          </TabPanel>
      </TabView>
  </v-card>
</template>

<script>
import axios from "axios";
import { useStorage } from "@vueuse/core";
import EvaluationType from '../../components/EvaluationType.vue'
import Details from '../../components/profile/Details.vue'
import moment from "moment";
  import {useToast} from 'primevue/usetoast'
export default {
   components:{EvaluationType,Details},

  data() {
    return {
        child_id: useStorage("child_id", Number),
         maxDate: new Date(),
         user:{
          skills:[],
          department:[]
         },
         skills:[],
         roles:[],
         departments:[],
         evalate:{},
         error:{},
         deleteDialog:false,
         delete_id:'',
         doctors:{},
         updatedialog:false,
        evaluate_types : [
                    { name: 'side profile', id: 1 },
                    { name: 'milestone', id: 2 },
                    { name: 'barrier', id: 3 },
                   
                ]
     
      // Add other validation rules for the title field
    };

  },

 
  mounted() {
 
  },
};
</script>