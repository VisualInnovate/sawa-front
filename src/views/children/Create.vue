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
    submitted:false,
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
          this.lan=res.data.langs.
          console.log(res);
        })
      
        axios
        .get(`/api/countries/${localStorage.getItem("appLang")}`)
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
      
      this.child.birth_date = moment(this.child.birth_date).format( "YYYY-MM-DD");


      axios.post(`/api/child/create`, this.child).then((res) => {
        this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });
      }).catch((el)=>{
        this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.$t("mission_error")}`, life: 3000 });

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
     
    
      <form @submit.prevent="submit" class="animate__animated animate__zoomIn  p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-3 shadow-lg" fast-fail >
        <div class="flex flex-column gap-2 py-2">
                <label for="username">{{ $t('child_name') }}</label>
              <InputText required class="bg-[#f7f5f5]" v-model="child.name" :placeholder='$t("child_name")' :class="{ 'p-invalid': submitted && !child.name }" />
              <small v-if="submitted && !child.name" class="p-invalid text-red-600" > {{$t("child_name") + ' ' + $t("required") }}.</small>
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
            :class="{ 'p-invalid': submitted && !child.birth_date }"

          />
          <small v-if="submitted && !child.birth_date" class="p-invalid text-red-600" > {{$t("birth_date") + ' ' + $t("required") }}.</small>

         </div>
           <div class="flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('primary_language') }}</label>
                    <Dropdown filter required id="pv_id_1" style="direction: ltr !important;" v-model="child.lang"  option-value="lang" :options="lan" optionLabel="lang" :placeholder='$t("primary_language")' class="w-full bg-[#f7f5f5]" :class="{ 'p-invalid': submitted && !child.lang }" />
                    <small v-if="submitted && !child.lang" class="p-invalid text-red-600" > {{$t("primary_language") + ' ' + $t("required") }}.</small>
                  </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full  " for="username">{{ $t('parent_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="child.parent_id"  option-value="id" :options="pasrents" optionLabel="fname" :placeholder='$t("parent_name")' class="w-full bg-[#f7f5f5] " :class="{ 'p-invalid': submitted && !child.parent_id }" />
                    <small v-if="submitted && !child.parent_id" class="p-invalid text-red-600" > {{$t("parent_name") + ' ' + $t("required") }}.</small>
            </div>
            <div class=" flex flex-column gap-2">
                  <label class="w-full " for="username">{{ $t('place_of_birth') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="child.birth_place" :placeholder='$t("place_of_birth")' :class="{ 'p-invalid': submitted && !child.birth_place }"/>
                <small v-if="submitted && !child.birth_place" class="p-invalid text-red-600" > {{$t("place_of_birth") + ' ' + $t("required") }}.</small>
              </div>
            <div class=" flex flex-column gap-2">
                  <label class="w-full  " for="username">{{ $t('address') }}</label>
                <InputText  required class="bg-[#f7f5f5] text-center" v-model="child.address" :placeholder='$t("address")' :class="{ 'p-invalid': submitted && !child.address }"/>
                <small v-if="submitted && !child.address" class="p-invalid text-red-600" > {{$t("address") + ' ' + $t("required") }}.</small>
            </div>
            <div class=" flex flex-column gap-2">
                  <label class="w-full  " for="username">{{ $t('national_id') }}</label>
                <InputText  required class="bg-[#f7f5f5] text-center" v-model="child.national_id" :placeholder='$t("national_id")' :class="{ 'p-invalid': submitted && !child.national_id }"/>
                <small v-if="submitted && !child.address" class="p-invalid text-red-600" > {{$t("address") + ' ' + $t("required") }}.</small>
            </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full " for="username">{{ $t('Type') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="child.gender"  option-value="value" :options="arr()" optionLabel="name" :placeholder='$t("selectgender")' class="w-full " :class="{ 'p-invalid': submitted && !child.gender }" />
                    <small v-if="submitted && !child.gender" class="p-invalid text-red-600" > {{$t("Type") + ' ' + $t("required") }}.</small>
                  </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full " for="username">{{ $t('Nationality') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="child.nationalty" filter  option-value="country" :options="cities" optionLabel="country" :placeholder='$t("Nationality")' class="w-full" :class="{ 'p-invalid': submitted && !child.nationalty }" />
                    <small v-if="submitted && !child.nationalty" class="p-invalid text-red-600" > {{$t("Nationality") + ' ' + $t("required") }}.</small>
            </div>
      <div class="card text-center py-3">
        <Button type="submit" @click="submitted =true" :label='$t("submit")' class="create w-[90%] lg:w-[50%]"/>
    </div>   
      </form>
      <Toast/>
    </v-sheet>
  </div>
</template>
