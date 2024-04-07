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
    minDate: new Date(1640426400000),
    maxDate: new Date(),
    toast:useToast(),
    NameRules: [
      (value) => {
        if (value?.length >= 3) return true;

        return " name must be at least 3 characters.";
      },
    ],
    child: {
      name: "",
      birth_date: "",
    },
    alert_text: null,
    snackbar: true,
  }),
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    submit() {
      this.child.birth_date = moment(this.child.birth_date).format(
        "YYYY-MM-DD"
      );
      console.log(this);

      console.log(this.child.birth_date);

      axios.post(`/api/child/create`, this.child).then((res) => {
            this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });
      });
    },
  },
  mounted() {
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
     
    
      <v-form class="animate__animated animate__zoomIn  p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-1 shadow-lg" fast-fail @submit.prevent>
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
