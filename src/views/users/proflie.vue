
<template>
  <div class="sawa-card profile-page">
    <Tabs value="details">
      <TabList>
        <Tab value="details">{{ $t("student_details") }}</Tab>
        <Tab value="requests">{{ $t("evaluation_order") }}</Tab>
        <Tab value="evaluations">{{ $t("Consultations_evaluations") }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="details"><Details /></TabPanel>
        <TabPanel value="requests"><Requests /></TabPanel>
        <TabPanel value="evaluations"><Evaluation /></TabPanel>
      </TabPanels>
    </Tabs>
  </div>
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