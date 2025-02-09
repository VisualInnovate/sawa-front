
<template>
  <v-card class="card relative ">
         
<div class="absolute z-50 top-1 ltr:right-0-4 rtl:left-4 flex flex-column gap-2">
                        
                </div>
      <TabView  v-model:activeIndex="active">
            
          <TabPanel :header="$t('student_details')">
        
            <Details></Details>
          </TabPanel>
          <TabPanel :header="$t('evaluation_order')">
            <Requests></Requests>
            
          </TabPanel>
          <TabPanel :header="$t('Consultations_evaluations')">
            <Evaluation></Evaluation>
          </TabPanel>
      </TabView>
  </v-card>
</template>

<script>
import axios from "axios";
import { useStorage } from "@vueuse/core";
import EvaluationType from '../../components/EvaluationType.vue'
import Details from '../../components/profile/Details.vue'
import Evaluation from '../../components/profile/Evaluation.vue'
import Requests from '../../components/profile/Requests.vue'
import moment from "moment";
  import {useToast} from 'primevue/usetoast'
export default {
   components:{EvaluationType,Details,Evaluation,Requests},

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