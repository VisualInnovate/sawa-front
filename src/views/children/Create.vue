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
    minDate: new Date(1640426400000),
    maxDate: new Date(),
    toast:useToast(),
    NameRules: [
      (value) => {
        if (value?.length >= 3) return true;

        return " name must be at least 3 characters.";
      },
    ],
    cities:{},
    error:{},
    child: {},
    lan:[],
    alert_text: null,
    snackbar: true,
  }),
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    arr (){
      return this.type =[
            { name:this.$t('male') , value:'0' },
                { name:this.$t('female') , value:'1' },
              
               
            ]
    },
    getlang(){
      axios
        .get("/api/languages")
        .then((res) => {
          this.lan=res.data.langs
          console.log(res);
        })
      
        axios
        .get("/api/countries")
        .then((res) => {
          console.log(res.data.countries)
          this.cities = res.data.countries
          console.log(res);
        })
        axios
        .get("/api/admin-parents")
        .then((res) => {
          console.log(res.data.countries)
          this.pasrents = res.data.parents
        
        })
    },
    submit() {
      this.child.parent_id =  localStorage.getItem("user_id");
      this.child.birth_date = moment(this.child.birth_date).format(
        "YYYY-MM-DD"
      );
      console.log(this);

      console.log(this.child.birth_date);

      axios.post(`/api/child/create`, this.child).then((res) => {
            this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });
      }).catch((el)=>{
          console.log(el.response.data.errors.name)
       this.error = el.response.data.errors
      })
    },
  },
  mounted() {
    this.getlang()
    console.log(moment(new Date()).format(" YYYY-MM-DD"));
  },
};
</script>
<template>
  <!--  <v-alert v-if="alert_text!= null " color="green" :text="alert_text" class="mb-5"></v-alert>-->

  <div>
    <v-btn height="45" class="mb-5 text-white" color="#135C65" @click="goBack">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      {{ $t("back") }}
    </v-btn>

    <v-sheet max-width="1200" class="mx-auto">
     
    
      <v-form class="animate__animated animate__zoomIn  p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-3 shadow-lg" fast-fail @submit.prevent>
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
              <div class="mt-1 mb-5 text-red-500" v-if="error?.birth_date">{{ error.birth_date[0] }}</div>
         </div>
           <div class="flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('primary_language') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="child.lang"  option-value="lang" :options="lan" optionLabel="lang" :placeholder='$t("primary_language")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.lang">{{ error.lang[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('parent_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="child.parent_id"  option-value="id" :options="pasrents" optionLabel="fname" :placeholder='$t("parent_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.parent_id">{{ error.parent_id[0] }}</div>
            </div>
            <div class=" flex flex-column gap-2">
                  <label class="w-full " for="username">{{ $t('place_of_birth') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="child.birth_place" :placeholder='$t("place_of_birth")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.birth_place">{{ error.birth_place[0] }}</div>
            </div>
            <div class=" flex flex-column gap-2">
                  <label class="w-full  " for="username">{{ $t('address') }}</label>
                <InputText  required class="bg-[#f7f5f5] text-center" v-model="child.address" :placeholder='$t("address")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.address">{{ error.address[0] }}</div>
            </div>
            <div class=" flex flex-column gap-2">
                  <label class="w-full  " for="username">{{ $t('national_id') }}</label>
                <InputText  required class="bg-[#f7f5f5] text-center" v-model="child.national_id" :placeholder='$t("national_id")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.national_id">{{ error.national_id[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full " for="username">{{ $t('Type') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="child.gender"  option-value="value" :options="arr()" optionLabel="name" :placeholder='$t("selectgender")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.gender">{{ error.gender[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full " for="username">{{ $t('Nationality') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="child.nationalty"  option-value="nationality" :options="cities" optionLabel="nationality" :placeholder='$t("Nationality")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.nationalty">{{ error.nationalty[0] }}</div>
            </div>
      <div class="card text-center py-3">
        <Button type="submit" @click="submit" :label='$t("submit")' class="create w-[90%] lg:w-[50%]"/>
    </div>   
      </v-form>
      <Toast/>
    </v-sheet>
  </div>
</template>
