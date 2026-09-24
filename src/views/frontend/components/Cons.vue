<template>
  <div class="p-4 relative bg-gradient-to-r from-blue-50 to-[#035B65] min-h-screen">
    <div class="py-8">
      <div class="max-w-lg m-auto">
        <div class="flex items-center text-3xl font-bold text-gray-800">
          <div class="flex m-auto">
            <p class="text-[#ffff]">
              {{ event_day(event) }}
            </p>
            <p class="px-2 text-[#ffff]">
              {{ event_hour(event) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="m-auto p-8 rounded-2xl max-w-5xl mb-4 shadow-2xl bg-white transform transition-all  duration-300">
      <div class="my-4">
        <h2 class="text-start font-bold text-2xl text-gray-800">{{ $t("Book_an_appointment_with_the_specialist") }}</h2>
        <p class="text-start text-[#29CCFF] text-xl">{{ $t("Please_fill_in_the_information") }}</p>
      </div>
      <form class="py-4 min-w-full p-2 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6" @submit.prevent="bookTime">
        <!-- الحقول المطلوبة -->
        <div class="flex flex-column gap-2 required-field">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("اسم ولي امر  مقدم الطلب") }}</label>
          <InputText required class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.requester_name" :class="{ 'p-invalid': submitted && !booking.details.requester_name}" />
        </div>
        <div class="flex flex-column gap-2 required-field">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("درجه قرابته للطفل ") }}</label>
          <InputText required class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.relative_degree" :class="{ 'p-invalid': submitted && !booking.details.relative_degree}" />
        </div>
        <div class="flex flex-column gap-2 required-field">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("رقم هاتف ولي الامر") }}</label>
          <InputText required class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.requester_phone" :class="{ 'p-invalid': submitted && !booking.details.requester_phone}" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("رقم هاتف اضافي") }}</label>
          <InputText class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.addtional_phone" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("مالك الرقم الاضافي") }}</label>
          <InputText class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.addtional_phone_owner" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("درجه قرابته بالطفل") }}</label>
          <InputText class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.addtional_phone_degree" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("مصدر التحويل") }}</label>
          <InputText class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.conversion_type" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("الطبيب الخاص بالطفل") }}</label>
          <InputText class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.child_doctor" />
        </div>
        <p class="lg:py-1 font-bold text-base text-start text-gray-800">{{ $t("answer_following_questions") }}</p>
        <div class="lg:flex flex-column gap-2 col-span-2 required-field">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t('نرجو تحديد نوع المشكله') }}</label>
          <Select :placeholder="$t('نرجو تحديد نوع المشكله')" required v-model="booking.details.child_problem" :options="problem_type" optionLabel="name" :class="{ 'p-invalid': submitted && !booking.details.child_aids}" class="w-full rounded-lg hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div v-if="booking.details?.child_problem?.code == 5" class="flex flex-column gap-2 required-field">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("برجاء تحديد نوع المشكلة") }}</label>
          <InputText required class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.problem" :class="{ 'p-invalid': submitted && !booking.details.problem}" />
        </div>
        <div class="lg:flex flex-column gap-2">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("التشخيص ان وجد") }}</label>
          <InputText class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" :placeholder="$t('التشخيص ان وجد')" v-model="booking.details.child_problems_notes" />
        </div>
        <div class="lg:flex flex-column gap-2 required-field">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t('هل يستخدم الطفل اي معينات حركيه / سمعيه/ بصريه') }}</label>
          <Select :placeholder="$t('هل يستخدم الطفل اي معينات حركيه / سمعيه/ بصريه')" required v-model="booking.details.child_aids" :options="approve" optionLabel="name" :class="{ 'p-invalid': submitted && !booking.details.child_aids}" class="w-full rounded-lg hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div v-if="booking.details?.child_aids?.id == 1" class="flex flex-column gap-2 required-field">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("برجاء تحديد اسم المعين") }}</label>
          <InputText required class="text-center rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.aids" :class="{ 'p-invalid': submitted && !booking.aids}" />
        </div>
        <div class="lg:flex flex-column gap-2 required-field">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("المشاكل الرئيسيه لدي الطفل حاليا من وجهه نظر الاهل") }}</label>
          <Textarea class="w-full rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.child_parents_problems" rows="5" cols="30" :class="{ 'p-invalid': submitted && !booking.details.child_parents_problems}" />
        </div>
        <div class="lg:flex flex-column gap-2 required-field">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("ما هي اولويه الاهل في البرامج التاهليه للتعامل مع الطفل") }}</label>
          <Textarea class="w-full rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.parents_priorities" rows="5" cols="30" :class="{ 'p-invalid': submitted && !booking.details.parents_priorities}" />
        </div>
        <div class="lg:flex flex-column gap-2">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("اضف ملاحظات") }}</label>
          <Textarea class="w-full rounded-lg p-2 hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" v-model="booking.details.child_aids_notes" rows="5" cols="30" :class="{ 'p-invalid': submitted && !booking.details.child_aids_notes}" />
        </div>
        <!-- حقل كود الاستشاري (غير مطلوب) -->
        <div class="lg:flex flex-column gap-2">
          <label class="w-full text-gray-700 font-semibold" for="username">{{ $t("كود الاستشاري ان وجد") }}</label>
          <InputNumber inputId="withoutgrouping" :useGrouping="false" class="text-center rounded-lg hover:bg-gray-100 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" :placeholder="$t('كود الاستشاري ان وجد')" v-model="booking.details.doctor_code" />
        </div>
       
        <Button class="bg-gradient-to-r h-12 my-auto from-blue-500 to-purple-500 w-full text-white font-bold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 transform hover:scale-105" @click="submitted=true" :label="$t('Book_now')" type="submit"></Button>
      </form>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import Select from 'primevue/select';
import Textarea from "primevue/textarea";
import { useParentStore } from "../../../stores/ParentStore";
import moment from "moment";
import { Button } from "flowbite-vue";

export default {
  props: ["event_id"],
  components: {
    Select,
    Textarea,
  },
  data() {
    return {
      parentStore: useParentStore(),
      selectedFruit: null,
      fruits: [
        { id: 0, name: this.$t("female") },
        { id: 1, name: this.$t("male") },
      ],
      submitted: false,
      problem_type: [
        { name: this.$t("حركية"), code: 1 },
        { name: this.$t("سمعيه"), code: 2 },
        { name: this.$t("عقليه_نمائيه"), code: 3 },
        { name: this.$t("توحد"), code: 4 },
        { name: this.$t("اخر"), code: 5 },
      ],
      approve: [
        { id: 1, name: this.$t("yes") },
        { id: 0, name: this.$t("no") },
      ],
      errors: [],
      childs: [],
      event: {},
      alert_text: '',
      show_alert: false,
      booking: {
        details: {}
      },
    };
  },
  methods: {
    getParentId() {
      const storeId = this.parentStore?.user?.id ?? this.parentStore?.parent_id ?? this.parentStore?.user?.parent_id;
      const localId = Number(localStorage.getItem("parent_id") ?? localStorage.getItem("user_id") ?? 0);
      return Number(storeId ?? localId ?? 0) || null;
    },
    buildBookingPayload() {
      // The API validates the form answers as a nested `details` object (StoreBookingRequest).
      const { doctor_code, ...details } = this.booking?.details ?? {};

      if (details.child_problem && typeof details.child_problem === "object") {
        details.child_problem = details.child_problem.code ?? details.child_problem.id ?? details.child_problem;
      }
      if (details.child_aids && typeof details.child_aids === "object") {
        details.child_aids = details.child_aids.id ?? details.child_aids.code ?? details.child_aids;
      }

      const payload = {
        user_id: this.getParentId(),
        event_id: Number(this.$route.params.event_id ?? this.event_id ?? 0),
        child_id: Number(this.$route.params.child_id ?? this.child_id ?? 0),
        details,
      };
      if (doctor_code != null && doctor_code !== "") {
        payload.doctor_code = doctor_code;
      }
      return payload;
    },
    async bookTime() {
      const payload = this.buildBookingPayload();
      this.show_alert = false;

      if (!payload.user_id || !payload.event_id || !payload.child_id) {
        this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: this.$t("mission_error"), life: 3000 });
        return;
      }

      try {
        await axios.post("/api/calender/store-booking", payload);
        this.booking = { details: {} };
        this.$router.push({ name: 'Booking' });
      } catch (err) {
        const firstError = Object.values(err.response?.data?.errors ?? {}).flat()[0];
        const errorMessage = firstError || err.response?.data?.message || this.$t("mission_error");
        this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: errorMessage, life: 3000 });
      }
    },
    async getEvent() {
      await axios
        // Slots come from event_calendars, not the legacy calenders table.
        .get(`/api/event-calendar/front/slot/${this.event_id}`)
        .then((res) => {
          this.event = res.data.data?.start;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    event_day(event_day) {
      let day = moment(event_day).format("dddd");
      return `${day}`;
    },
    event_hour(event_hour) {
      let hour = moment(event_hour).format("hh:mm A");
      return `${hour}`;
    },
  },
  mounted() {
    this.getEvent();
  },
};
</script>
<style scoped>
/* إضافة علامة النجمة الحمراء للحقول المطلوبة */
.required-field label::after {
  content: " *";
  color: red;
  font-weight: bold;
}
</style>