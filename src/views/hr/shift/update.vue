<script setup>
import axios from "axios";
import InputMask from 'primevue/inputmask';
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import moment from "moment";

const name = ref('')
const x = ref(true)
const countaire = ref(1)
const shift24 = ref({})
const shift = ref({
  title: null,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  days: []
});
const submitted = ref(false);
const route = useRoute();
const router = useRouter();
const toast = useToast();
const dayspush = ref([])
const directorate = ref({})
const days = ref([
  { name: 'Sunday', value: 'Sunday' },
  { name: 'Monday', value: 'Monday' },
  { name: 'Tuesday', value: 'Tuesday' },
  { name: 'Wednesday', value: 'Wednesday' },
  { name: 'Thursday', value: 'Thursday' },
  { name: 'Friday', value: 'Friday' },
  { name: 'Saturday', value: 'Saturday' }
]);
const selectedCity = ref();
const cities = ref([
  { name: 'Normal Shift', value: '1' },
  { name: '24 Shift', value: '2' },
  { name: 'directorate shift', value: '3' },
]);

const increasecount = () => {
  dayspush.value.push(shift24.value)
  shift24.value = ref({})
  console.log(dayspush.value)
  x.value = true
}

const decreasecount = () => {
  dayspush.value.length = dayspush.value.length - 1
}

const createdirectorate = () => {
  axios.post(`/dashboard/directorate/shift`, directorate.value)
    .then((res) => {
      toast.add({ severity: 'success', summary: 'Success', detail: 'created Successfully', life: 3000 });
      router.go(-1)
    })
    .catch((error) => {
      console.error(error);
    });
}

const createshift = () => {
  dayspush.value.push(shift24.value)
  x.value = false
  shift24.value = ref({})
  axios.post(`/dashboard/custom/shift`, {
    name: name.value,
    days: dayspush.value
  })
    .then((res) => {
      toast.add({ severity: 'success', summary: 'Success', detail: 'created Successfully', life: 3000 });
      router.go(-1)
    })
    .catch((error) => {
      console.error(error);
    });
};

const submit = () => {
  submitted.value = true;
  let flag = 0
  if (!shift.value.title) flag++
  shift.value.days.forEach((elem) => {
    if (elem.week_end && (!elem.clock_out || !elem.clock_in)) flag++;
  });
  if (flag)
    return
  axios.put(`/api/shifts/${route.params.id}`, shift.value)
    .then((res) => {
      toast.add({ severity: 'success', summary: 'Success', detail: 'created Successfully', life: 3000 });
      router.go(-1)
      console.log(shift.value);
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'Success', detail: error, life: 3000 });
    });

  console.log(shift);
}

const fetchData = () => {
  axios.get(`/api/shifts/${route.params.id}`)
    .then((res) => {
      const apiDays = res.data.data.shift_days;
      const allDays = days.value.map(day => {
        const apiDay = apiDays.find(d => d.day === day.name);
        return {
          day: day.name,
          clock_in: apiDay ? apiDay.clock_in : null,
          clock_out: apiDay ? apiDay.clock_out : null,
          week_end: apiDay ? apiDay.week_end === 1 : false
        };
      });
      shift.value.title = res.data.data.title;
      shift.value.days = allDays;
    })
}

onMounted(() => {
  fetchData()
})

const changeStatus = (index) => {
  shift.value.days[index].clock_in = null;
  shift.value.days[index].clock_out = null;
}
</script>
<template>
  <div>
    <Toast />
    <form>
      <v-card style="overflow-x: scroll;">
        <div class="card">
          <div class="w-full m-5">
            <p class="" for="name">{{ $t("title") }}</p>
            <InputText v-model="shift.title" id="name" required :class="{ 'p-invalid': submitted && !shift.title }" />
          </div>
          <div v-for="(day, index) in shift.days" :key="day.day" class="flex align-items-center mb-2">
            <div class="field mx-5">
              <input type="checkbox" style="border: 1px solid black;" v-model="day.week_end" :binary="true" @click="changeStatus(index)" />
            </div>
            <div class="field mr-7 w-20">
              {{ day.day }}
            </div>

            <div class="field mx-5" v-if="!day.week_end">
              <label class="mx-5">Clock In</label>
              <InputText type="time" v-model.trim="day.clock_in" timeOnly disabled autofocus />
            </div>

            <div class="field mr-5" v-else>
              <label class="mx-5">Clock In</label>
              <InputText type="time" v-model.trim="day.clock_in" required timeOnly autofocus hourFormat="12" :class="{ 'p-invalid': submitted && !day.clock_out }" />
            </div>

            <div class="field" v-if="!day.week_end">
              <label class="mx-2.5 w-10">Clock Out</label>
              <InputText class="w-28" type="time" v-model.trim="day.clock_out" timeOnly disabled autofocus />
            </div>
            <div class="field" v-else>
              <label class="mx-5">Clock Out</label>
              <InputText type="time" v-model.trim="day.clock_out" timeOnly class="w-28" required hourFormat="12" autofocus :class="{ 'p-invalid': submitted && !day.clock_out }" />
            </div>
          </div>
          <Button class="create m-5" type="submit" @click.prevent="submit()">Submit</Button>
        </div>
      </v-card>
    </form>

    <!-- Other parts of the template remain unchanged -->
  </div>
</template>