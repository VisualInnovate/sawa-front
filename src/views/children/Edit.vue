<script>
import axios from "axios";
import InputText from 'primevue/inputtext';
import Calendar from "primevue/calendar";
import {useToast} from 'primevue/usetoast'
export default {
  components:{InputText,Calendar},
  data: () => ({
    maxDate: new Date(),
    toast:useToast(),
    NameRules: [
      value => {
        if (value?.length >= 3) return true

        return ' name must be at least 3 characters.'
      },
    ],
    child:{
      name:"",
      birth_date:""
    },
    alert_text: null
  }),
  methods:{
    goBack() {
        this.$router.go(-1)
      },
    submit(){
   
      axios.post(`/api/child/${this.$route.params.id }/update`,this.child).then(res =>{
        this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });

      }).catch((el)=>{
      
       

    })
    },
    getChild(){
      axios.get(`/api/child/${this.$route.params.id}`).then(res =>{
        this.child=res.data.child
      })
    }
  },
  mounted() {
    this.getChild()
  }
}
</script>
<template>
 <div>
  <v-btn height="45" class="mb-5 text-white" color="#135C65" @click="goBack">
    <v-icon
      start
      icon="mdi-arrow-left"
    ></v-icon>
    {{$t('back')}}
  </v-btn>
    <v-sheet max-width="1200"  class="mx-auto" >
  
      <v-alert
          type="success"
          variant="tonal"
          border="start"
          elevation="2"
          closable
          :close-label="$t('close')"
          :text="alert_text"
          v-if="alert_text!= null "
          class="mb-8"
      >
      </v-alert>
  
      <v-form fast-fail @submit.prevent>
        <div class="flex flex-column gap-2 py-2">
                <label for="username">{{ $t('child_name') }}</label>
              <InputText required class="bg-[#f7f5f5]" v-model="child.name" :placeholder='$t("child_name")' />
              <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
         </div>
         <div class="flex flex-column gap-2 py-2">
                <label for="username">{{ $t('birth_date') }}</label>
                <Calendar
            style="width: 100%"
            showButtonBar
            v-model.number="child.birth_date"
            showIcon
            placeholder="dd/mm/yy"
            :maxDate="maxDate"

          />
              <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
         </div>
     
      <div class="card text-center py-3">
        <Button type="submit" @click="submit" :label='$t("submit")' class="create w-[90%] lg:w-[50%]"/>
    </div>  
      </v-form>
      <Toast/>
    </v-sheet>
 </div>
</template>