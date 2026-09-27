<template>
  <div class="sawa-card p-[1%]">
    <h1 class="border-b text-3xl w-full md:w-1/2 uppercase text-green-800 py-4">
      {{ $t("bookings") }} / {{ booking.requester_name }}
    </h1>
    <!-- Booking details and the parent's answers, all on the page (no popup). -->
    <div class="booking-details mt-4">
      <div class="booking-details-grid">
        <div v-for="(field, index) in bookingFields" :key="index" class="booking-detail">
          <i class="booking-detail-icon pi pi-check" aria-hidden="true"></i>
          <p class="booking-detail-label">{{ field.label }} :</p>
          <p class="booking-detail-value" :dir="field.ltr ? 'ltr' : null">{{ field.value }}</p>
        </div>
      </div>

      <template v-if="answerFields.length">
        <h2 class="booking-answers-title">
          <i class="pi pi-comments" aria-hidden="true"></i>
          {{ $t("Answer_the_questions") }}
        </h2>
        <div class="booking-answers">
          <div v-for="(field, index) in answerFields" :key="index" class="booking-detail">
            <i class="booking-detail-icon pi pi-check" aria-hidden="true"></i>
            <p class="booking-detail-label">{{ field.label }} :</p>
            <p class="booking-detail-value">{{ field.value }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
  <div class="sawa-card mt-5 p-[2%] bg-slate-50" v-if="$can('bookings edit')">
    <form
      @submit.prevent="updateBooking"
      class="bg-white shadow-lg rounded-xl p-6 space-y-4 mx-auto border border-gray-200"
    >
      <h2 class="text-2xl font-bold text-gray-700 mb-4 text-center">
        {{ $t("Confirm_Booking") }}
      </h2>

      <div class="flex flex-col gap-2">
        <!-- Consultant Name -->
        <div class="flex items-center gap-2" v-if="doctor?.name">
          <p class="text-lg font-semibold text-gray-800">
            {{ $t("اسم الاستشاري") }}:
          </p>
          <p class="text-lg text-gray-600">{{ doctor?.name }}</p>
        </div>

        <!-- Request Sender -->
        <div class="flex items-center gap-2">
          <p class="text-lg font-semibold text-gray-800">
            {{ $t("request_sender") }}:
          </p>
          <p class="text-lg text-gray-600">
            {{ booking.details?.requester_name }}
          </p>
        </div>

        <!-- Consultation Date -->
        <div class="flex items-center gap-2" v-if="event_data">
          <p class="text-lg font-semibold text-gray-800">
            {{ $t("Consultation_date") }}:
          </p>
          <p class="text-lg text-gray-600">{{ event_data }}</p>
        </div>

        <!-- Notes Field -->
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium" for="notes">{{
            $t("Submit_a_note")
          }}</label>
          <textarea
            name="notes"
            v-model="accept_notes"
            id="notes"
            class="border border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg p-3 text-gray-700 w-full shadow-sm"
            cols="30"
            rows="4"
          ></textarea>
        </div>

        <!-- Status Dropdown -->
        <div class="booking-status-field">
          <label class="booking-status-label" for="booking-status">{{
            $t("status")
          }}</label>
          <Select
            inputId="booking-status"
            :class="['booking-status-select', `status-${bookingStatusTone}`]"
            v-model="new_status"
            option-value="code"
            :options="status"
            optionLabel="name"
          >
            <template #value>
              <div v-if="selectedStatusOption" class="booking-status-value">
                <span class="status-icon" aria-hidden="true">
                  <i :class="selectedStatusOption.icon" />
                </span>
                <span>{{ selectedStatusOption.name }}</span>
              </div>
              <span v-else class="booking-status-placeholder">{{ $t("status") }}</span>
            </template>
            <template #option="{ option }">
              <div class="booking-status-option" :class="`option-${option.tone}`">
                <span class="status-icon" aria-hidden="true">
                  <i :class="option.icon" />
                </span>
                <span>{{ option.name }}</span>
              </div>
            </template>
          </Select>
        </div>

        <!-- Submit Button -->
        <div class="text-center mt-4">
          <Button
            :label="$t('submit')"
            type="submit"
            :loading="submittingBooking"
            :disabled="submittingBooking"
            class="bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-300 px-6 py-2 rounded-lg shadow-md w-60"
            icon="pi pi-check"></Button>
        </div>
      </div>
    </form>
  </div>

  <Toast />

  <div class="sawa-card mt-5 p-[2%] bg-slate-50" v-if="$can('consultations edit')">
    <h2 class="text-lg font-semibold text-gray-800 mb-3">
      {{ $t("نتيجة الاستشارة") }}
    </h2>

    <form
      class="bg-white shadow-lg rounded-xl p-6 space-y-4 mx-auto border border-gray-200"
    >
      <div class="flex flex-col">
        <label class="text-gray-600 font-medium text-sm"
          >{{ $t("health_development_history") }}</label
        >
        <textarea
          v-model="student_massage.health"
          required
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
          rows="2"
        >
        </textarea>
      </div>

      <div class="flex flex-col">
        <label class="text-gray-600 font-medium text-sm">{{ $t("consultant_recommendations") }}</label>
        <textarea
          v-model="student_massage.consultant_recommendations"
          required
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
          rows="2"
        >
        </textarea>
      </div>

      <div class="flex flex-col">
        <label class="text-gray-600 font-medium text-sm"
          >{{ $t("choose_home_recommendations") }}</label
        >
        <MultiSelect
          v-model="student_massage.filed_value"
          filter
          :options="recommendationOptions"
          optionLabel="value"
          dataKey="id"
          :maxSelectedLabels="0"
          :selectedItemsLabel="$t('recommendations_selected', ['{0}'])"
          :placeholder="$t('choose_home_recommendations')"
          :filterPlaceholder="$t('search')"
          overlayClass="recommendations-overlay"
          class="w-full text-sm"
        >
          <!-- Long recommendations wrap inside the list instead of stretching it off screen. -->
          <template #option="{ option }">
            <span class="recommendation-option">{{ removeBracesAndReplace(option.value) }}</span>
          </template>
        </MultiSelect>
      </div>

      <!-- What the parent will read: the picked recommendations in display order, with the child's name. -->
      <div v-for="item in pickedRecommendations" :key="item.id" class="py-1">
        <p class="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-sm whitespace-pre-line">
          {{ removeBracesAndReplace(item.value) }}
        </p>
      </div>
      <div class="flex flex-col">
        <label class="text-gray-600 font-medium text-sm">
          {{ $t("additional_notes") }}
        </label>
        <textarea
          v-model="student_massage.notes"
          required
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
          rows="2"
        >
        </textarea>
      </div>

      <Button
        @click="studentMassage"
        :label="$t('submit')"
        class="w-full py-1.5 mt-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-200"
        icon="pi pi-check">
      </Button>
    </form>
  </div>

  <div v-can="'bookings edit'" class="sawa-card mt-5 p-[2%] bg-slate-50">
    <form
      class="bg-white shadow-lg rounded-xl p-6 space-y-4 mx-auto border border-gray-200"
    >
      <div class="space-y-2">
        <p class="w-full text- font-bold" for="username">
          {{ $t(" اضافة مواعيد مسبقة ") }}
        </p>

        <label class="block text-gray-700 font-semibold text-lg" for="username">
          {{ $t("pre_appointments_hint") }}
        </label>


        <MultiSelect
          v-model="pre_evalutions.pre_evalutions"
          :options="evaluate_types"
          optionLabel="name"
          class="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
        />
      </div>

      <div class="bg-gray-100 p-3 rounded-md">
        <p
          v-for="(pre, index) in pre_evalutions.pre_evalutions"
          :key="pre.name"
          class="text-gray-800 text-sm font-medium"
        >
          {{ index + 1 }} - {{ pre.name }}
        </p>
      </div>

      <Button
        @click="SenPrEvalutions(booking.id)"
        :label="$t('submit')"
        class="w-full text-white py-2 px-4 rounded-md font-semibold transition-all duration-300 ease-in-out shadow-md flex items-center justify-center"
        icon="pi pi-check" />
    </form>
  </div>

  <!-- Book an evaluation for the child (opens the evaluation calendar); allowed from the consultation day. -->
  <div v-can="'evaluation request create'" class="sawa-card mt-5 p-[2%] bg-slate-50">
    <section class="add-evaluation-card">
      <div class="add-evaluation-icon" aria-hidden="true"><i class="pi pi-calendar-plus"></i></div>
      <div class="add-evaluation-text">
        <h2>{{ $t("book_child_evaluation") }}</h2>
        <p>{{ $t("book_child_evaluation_hint") }}</p>
        <p v-if="booking?.child_name" class="add-evaluation-child">
          <i class="pi pi-user" aria-hidden="true"></i> {{ booking.child_name }}
        </p>
        <p v-if="comparisonResult" class="add-evaluation-locked">
          <i class="pi pi-lock" aria-hidden="true"></i> {{ $t("book_child_evaluation_locked") }}
        </p>
      </div>
      <Button
        :disabled="comparisonResult || !booking?.child_id"
        @click="AddEvalte(booking?.child_id)"
        icon="pi pi-plus"
        :label="$t('RatingAdd')"
        class="add-evaluation-btn" />
    </section>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  props: ["id"],
  data() {
    return {
      filed_value: "",
      comparisonResult: false,
      current_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ"),
      booking: {},
      pre_evalutions: {
        pre_evalutions: [],
      },
      student_massage: {},
      status: [
        { name: this.$t("Pending"), code: -1, tone: "pending", icon: "pi pi-clock" },
        { name: this.$t("Accept"), code: 1, tone: "accepted", icon: "pi pi-check" },
        { name: this.$t("Cancell"), code: 0, tone: "cancelled", icon: "pi pi-times" },
      ],
      fileds: [],
      evaluate_types: [
        { name: "side profile", id: 1 },
        { name: "milestone", id: 2 },
        { name: "barrier", id: 3 },
        { name: "ablls", id: 4 },
        { name: "carolina", id: 5 },
      ],

      show_status: false,
      doctor: {},
      evalate: {},
      doctors: {},
      business_hours: [],
      new_status: null,
      new_doctors: [],
      slots: [],
      accept_notes: "",
      show_modal: false,
      updatedialog: false,
      modal_text: "",
      modal_color: "",
      days: [0, 1, 2, 3, 4, 5, 6],
      sendMassage: false,
      submitted: false,
      submittingBooking: false,
    };
  },

  methods: {
    SenPrEvalutions(id) {
      axios
        .post(`api/calender/bookings/${id}/evaluations`, {
          pre_evaluations: this.pre_evalutions,
        })
        .then((res) => {
          this.$toast.add({
            severity: "success",
            summary: this.$t("success_message"),
            detail: `${this.$t("تم ارسال التقيممات المسبقة ")}`,
            life: 3000,
          });
        });
    },
    compareDates() {
      const eventDate = new Date(this.booking.event_date);
      const currentDate = new Date();

      if (eventDate > currentDate) {
        this.comparisonResult = true;
      } else if (eventDate.toDateString() === currentDate.toDateString()) {
        this.comparisonResult = false;
      } else {
        console.log("3");
        this.comparisonResult = false;
      }
    },

    // Picks saved before recommendations had ids are matched to their recommendation by text; the rest keep an
    // id of their own so they stay selected.
    alignPickedRecommendations() {
      const picked = this.student_massage?.filed_value;
      if (!Array.isArray(picked) || !this.fileds.length) return;
      const settings = this.settingsRecommendations;
      this.student_massage.filed_value = picked.map((item, position) => {
        if (item?.id != null && !String(item.id).startsWith("legacy-")) return item;
        const text = String(item?.value ?? "");
        const match = this.fileds.find((row) => [row.male, row.female, row.value].includes(text));
        const option = match && settings.find((row) => row.id === (match.id ?? this.fileds.indexOf(match) + 1));
        return option
          ? { id: option.id, display_order: option.display_order, value: text }
          : { id: `legacy-${position}`, display_order: 100000 + position, value: text };
      });
    },
    studentMassage() {
      const filed_value = [...(this.student_massage.filed_value ?? [])]
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      axios
        .post(`api/booking/result`, {
          consultation_result: { ...this.student_massage, filed_value },
          booking_id: this.booking.id,
        })
        .then((response) => {
          this.$toast.add({
            severity: "success",
            summary: this.$t("success_message"),
            detail: `${this.$t("element_update_success")}`,
            life: 3000,
          });
          this.sendMassage = !this.sendMassage;
        })
        .catch((el) => {
          this.$toast.add({
            severity: "error",
            summary: this.$t("error"),
            detail: `${this.$t("mission_error")}`,
            life: 3000,
          });
        });
    },

    getdoctor_evalte(id) {
      axios
        .post(`api/evaluation-doctors`, {
          evaluation_type: id,
        })
        .then((response) => {
          this.doctors = response.data.doctors;
        });
    },
    getDays(id) {
      this.business_hours = this.doctors.find(
        (item) => item.id == id
      ).business_hours;
      console.log(this.business_hours);
    },
    gettimes(e) {
      axios
        .post(`api/users/available/slots`, {
          user_id: this.evalate.specialist_id,
          evaluation_type: this.evalate.evaluation_type,
          date: moment(e).format("Y-MM-DD"),
        })
        .then((response) => {
          this.slots = response.data.slots;
        });
    },
    infoField(label, value, ltr = false) {
      if (value == null || String(value).trim() === "") return null;
      return { label: this.$t(label), value, ltr };
    },
    removeBracesAndReplace(text) {
      // {{name}} (any {{...}}) is the child's name.
      return String(text ?? "").replace(/\{\{.*?\}\}/g, this.booking.child_name);
    },

    AddEvalte(id) {
      this.$router.push({ name: "Calender", params: { id: id } });
    },
    create() {
      axios
        .post(`api/evaluation-request`, {
          child_id: this.booking.child_id,
          consultant_id: localStorage.getItem("user_id"),
          evaluation_type: this.evalate.evaluation_type,
          date: moment(this.evalate.date).format("Y-MM-DD"),
          employee_id: this.evalate?.specialist_id,
          start_time: this.evalate?.Session_time?.start,
          end_time: this.evalate?.Session_time?.end,
        })
        .then((response) => {
          this.updatedialog = !this.updatedialog;
          this.$toast.add({
            severity: "success",
            summary: this.$t("success_message"),
            detail: `${this.$t("element_add_success")}`,
            life: 3000,
          });
        })
        .catch((el) => {
          this.$toast.add({
            severity: "error",
            summary: this.$t("error"),
            detail: `${this.$t("mission_error")}`,
            life: 3000,
          });
        });
    },

    async getBooking() {
      const res = await axios.get(`/api/calender/bookings/${this.id}`, {
        params: { _ts: Date.now() },
      });

      this.booking = res.data.booking.booking;
      this.new_status = Number(res.data.booking.booking.accepted);
      this.accept_notes = res.data.booking.booking.accepted_notes;
      if (res.data.booking.booking.consultation_result) {
        this.student_massage = res.data.booking?.booking?.consultation_result;
        this.alignPickedRecommendations();
      }
      if (res.data.booking.booking.pre_evaluations?.pre_evalutions)
        this.pre_evalutions.pre_evalutions =
          res.data.booking?.booking?.pre_evaluations.pre_evalutions;
      this.doctor = res.data.booking.doctor;
      this.compareDates();
    },
    getConsultationSettings() {
      axios.get("api/consultation-settings").then((res) => {
        this.fileds = res.data.data.recommendations ?? [];
        this.alignPickedRecommendations();
      });
    },
    async updateBooking() {
      if (this.submittingBooking) return;

      this.submittingBooking = true;
      try {
        const res = await axios.post(`/api/calender/bookings/${this.id}/accept`, {
          status: Number(this.new_status),
          accepted_notes: this.accept_notes,
          user_id: this.booking.user_id,
          event_id: this.booking.event_id,
          doctor_name: this.doctor?.name,
          doctor_title: this.doctor?.title,
        });

        const savedBooking = res.data?.booking;
        if (savedBooking) {
          this.booking = { ...this.booking, ...savedBooking };
          this.new_status = Number(savedBooking.accepted);
          this.accept_notes = savedBooking.accepted_notes ?? "";
        }

        // Read the canonical row again so the status displayed to the user can never remain stale.
        await this.getBooking();
        this.$toast.add({
          severity: "success",
          summary: this.$t("success_message"),
          detail: `${this.$t("element_update_success")}`,
          life: 3000,
        });
      } catch (err) {
        const forbidden = err.response?.status === 403;
        this.$toast.add({
          severity: "error",
          summary: this.$t("error"),
          detail: forbidden ? this.$t("no_permission_action") : this.$t("mission_error"),
          life: 5000,
        });
      } finally {
        this.submittingBooking = false;
      }
    },
    changeDoctor() {
      axios
        .get("/api/doctors")
        .then((res) => {
          this.new_doctors = res.data.doctors;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    childGender() {
      return String(this.booking?.child_gender) === "1" ? "female" : "male";
    },
    // The home recommendations in display order, each in the child's gender.
    settingsRecommendations() {
      return (this.fileds ?? [])
        .map((row, position) => ({
          id: row.id ?? position + 1,
          display_order: row.display_order ?? (row.index ?? position) + 1,
          value: String(row[this.childGender] ?? row.value ?? ""),
        }))
        .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
    },
    // Earlier picks that no longer match a recommendation stay listed so they can be kept or removed.
    // Only filled fields are shown.
    bookingFields() {
      const b = this.booking ?? {};
      return [
        this.infoField("applicant", b.requester_name),
        this.infoField("degree_closeness_child", b.relative_degree),
        this.infoField("Full_Name", b.child_name),
        this.infoField("place_of_birth", b.child_birth_place),
        this.infoField("birth_date", b.child_birth_date, true),
        this.infoField("primary_language", b.child_lang),
        this.infoField("Nationality", b.child_nationalty),
        this.infoField("national_number", b.child_national_id, true),
        this.infoField("address", b.child_address),
        this.infoField("phone_number", b.requester_phone, true),
        this.infoField("Additional_phone_number", b.addtional_phone, true),
        this.infoField("owner_extra_number", b.addtional_phone_owner),
        this.infoField("degree_closeness_child", b.addtional_phone_degree),
        this.infoField("conversion_source", b.conversion_type),
        this.infoField("Specialist_code", b.doctor_code),
      ].filter(Boolean);
    },
    answerFields() {
      const b = this.booking ?? {};
      const d = b.details ?? {};
      // Gender codes match the child forms: 0 = male, 1 = female.
      const gender = b.child_gender != null && b.child_gender !== ""
        ? (String(b.child_gender) === "0" ? this.$t("male") : this.$t("female"))
        : null;
      if (!this.booking?.id && !b.child_name) return [];
      return [
        this.infoField("Type", gender),
        this.infoField("problem_type", d.child_parents_problems),
        this.infoField("child_problems_notes", d.child_problems_notes),
        this.infoField("child_problem", b.child_aids == 1 ? this.$t("yes") : this.$t("no")),
        this.infoField("child_aids_notes", d.child_aids_notes),
        this.infoField("priority_parents", d.parents_priorities),
      ].filter(Boolean);
    },
    recommendationOptions() {
      const kept = (this.student_massage?.filed_value ?? [])
        .filter((item) => !this.settingsRecommendations.some((row) => row.id === item?.id));
      return [...this.settingsRecommendations, ...kept];
    },
    pickedRecommendations() {
      return [...(this.student_massage?.filed_value ?? [])]
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    },
    selectedStatusOption() {
      return this.status.find((option) => option.code === Number(this.new_status)) ?? null;
    },
    bookingStatusTone() {
      return this.selectedStatusOption?.tone ?? "empty";
    },
    filteredDays() {
      // Extract the `day` values from `business_hours`
      const usedDays = this.business_hours.map((entry) => entry.day);
      // Filter `days` to only include those present in `usedDays`
      return this.days.filter((day) => !usedDays.includes(day));
    },
  },
  mounted() {
    this.getBooking();
    this.getConsultationSettings();
    this.changeDoctor();
  },
};
</script>
<style scoped>
.item:hover {
  background-color: #e6f8f6;
  transition: all linear 300ms;
}

#submit:disabled {
  background-color: #5fbec7;
  color: #5fbec7;
  cursor: not-allowed;
}

[v-cloak] {
  display: none;
}

.booking-status-field {
  display: grid;
  gap: 0.5rem;
}

.booking-status-label {
  color: #334155;
  font-weight: 700;
}

.booking-status-select {
  width: 100%;
  min-height: 3.5rem;
  border-width: 1px;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
  transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
}

.booking-status-select.status-accepted {
  border-color: #86efac;
  background: #f0fdf4;
  color: #166534;
}

.booking-status-select.status-pending {
  border-color: #fcd34d;
  background: #fffbeb;
  color: #92400e;
}

.booking-status-select.status-cancelled {
  border-color: #fda4af;
  background: #fff1f2;
  color: #9f1239;
}

.booking-status-select.status-empty {
  border-color: #cbd5e1;
  background: #fff;
  color: #475569;
}

.booking-status-select:hover {
  border-color: #5fbec7;
}

.booking-status-select:deep(.p-select-label) {
  display: flex;
  align-items: center;
  padding-block: 0.75rem;
  padding-inline: 1rem 0.5rem;
  color: inherit;
  font-weight: 700;
}

.booking-status-select:deep(.p-select-dropdown) {
  width: 3rem;
  color: currentColor;
}

.booking-status-select:deep(.p-select-dropdown-icon) {
  width: 0.9rem;
  height: 0.9rem;
}

.booking-status-select:deep(.p-focus) {
  box-shadow: none;
}

.booking-status-select.p-focus {
  border-color: #168694;
  box-shadow: 0 0 0 3px rgb(22 134 148 / 0.15);
}

.booking-status-value,
.booking-status-option {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  text-align: start;
}

.booking-status-option {
  padding-block: 0.15rem;
  font-weight: 600;
}

.status-icon {
  display: inline-grid;
  place-items: center;
  flex: 0 0 1.75rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.8);
  box-shadow: inset 0 0 0 1px currentColor;
}

.status-icon i {
  font-size: 0.75rem;
}

.option-accepted { color: #166534; }
.option-pending { color: #92400e; }
.option-cancelled { color: #9f1239; }
.booking-status-placeholder { color: #64748b; font-weight: 500; }

.add-evaluation-card { display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem; padding: 1.5rem; border: 1px solid #e2e8f0; border-inline-start: 5px solid var(--sawa-primary, #135c65); border-radius: 0.9rem; background: #fff; box-shadow: 0 10px 24px -18px rgb(15 23 42 / .35); }
.add-evaluation-icon { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; width: 3.5rem; height: 3.5rem; border-radius: 1rem; background: #e6f4f3; color: var(--sawa-primary, #135c65); font-size: 1.5rem; }
.add-evaluation-icon i { font-size: 1.5rem; }
.add-evaluation-text { flex: 1 1 18rem; min-width: 0; }
.add-evaluation-text h2 { margin: 0 0 .3rem; color: #0f172a; font-size: 1.25rem; font-weight: 700; }
.add-evaluation-text p { margin: 0; color: #64748b; line-height: 1.7; }
.add-evaluation-child { display: inline-flex; align-items: center; gap: .4rem; margin-top: .5rem !important; padding: .2rem .7rem; border-radius: 999px; background: #f1f5f9; color: #334155 !important; font-weight: 600; }
.add-evaluation-locked { display: flex; align-items: center; gap: .4rem; margin-top: .6rem !important; color: #92400e !important; font-size: .9rem; }
.add-evaluation-btn { min-width: 12rem; padding-block: .75rem; }
@media (max-width: 640px) { .add-evaluation-btn { width: 100%; } }

.booking-details { overflow: hidden; border-radius: 12px; background: #f8fafc; box-shadow: 0 4px 6px -1px rgb(0 0 0 / .08), 0 2px 4px -2px rgb(0 0 0 / .06); }
.booking-details-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem 1rem; padding: 1.25rem 1.5rem; }
.booking-detail { display: flex; align-items: flex-start; gap: .4rem; min-width: 0; }
.booking-detail-icon { flex-shrink: 0; margin-top: .3rem; padding: .25rem; border-radius: 9999px; background: #EC477C; color: #fff; font-size: .8rem; }
.booking-detail-label { flex-shrink: 0; font-size: 1.15rem; color: #1f2937; }
.booking-detail-value { min-width: 0; font-size: 1.1rem; line-height: 1.8; color: #6b7280; white-space: pre-line; overflow-wrap: anywhere; }
.booking-detail-value[dir="ltr"] { unicode-bidi: plaintext; }
.booking-answers-title { display: flex; align-items: center; gap: .5rem; margin: 0; padding: .9rem 1.5rem; border-top: 1px solid #e2e8f0; background: #edf7f5; color: var(--sawa-primary, #135c65); font-size: 1.15rem; font-weight: 700; }
.booking-answers { display: grid; gap: 1rem; padding: 1.25rem 1.5rem; }
.booking-answers .booking-detail { padding-bottom: 1rem; border-bottom: 1px dashed #e2e8f0; }
.booking-answers .booking-detail:last-child { padding-bottom: 0; border-bottom: 0; }
@media (max-width: 767px) {
  .booking-details-grid { grid-template-columns: 1fr; }
  .booking-detail { flex-wrap: wrap; }
}
</style>

<style>
/* The list is teleported to <body>, so it can't use scoped styles. */
.recommendations-overlay {
  max-width: min(46rem, calc(100vw - 2rem));
}
.recommendations-overlay .p-multiselect-option {
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eef2f7;
}
.recommendations-overlay .p-multiselect-option .p-checkbox {
  margin-top: 0.2rem;
  flex-shrink: 0;
}
.recommendation-option {
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.7;
  font-size: 0.9rem;
}
</style>
