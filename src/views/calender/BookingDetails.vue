<template>
  <div class="sawa-card p-[1%]">
    <h1 class="border-b text-3xl w-full md:w-1/2 uppercase text-green-800 py-4">
      {{ $t("bookings") }}<template v-if="booking.requester_name || booking.child_name"> / {{ booking.requester_name || booking.child_name }}</template>
    </h1>
    <!-- Booking details and the parent's answers, all on the page (no popup). -->
    <div v-if="booking?.child_name || booking?.requester_name" class="booking-overview mt-4">
      <!-- One compact profile card: the child, then its details and the requester's as tiles sized to their text. -->
      <section class="profile-card">
        <header class="profile-head">
          <div class="profile-avatar" aria-hidden="true">{{ childInitial }}</div>
          <div class="profile-name">
            <h2>{{ booking.child_name || "—" }}</h2>
            <div class="profile-chips">
              <span v-if="childGenderLabel" class="profile-chip"><i class="pi pi-user" aria-hidden="true"></i>{{ childGenderLabel }}</span>
              <span v-if="childAgeLabel" class="profile-chip"><i class="pi pi-hourglass" aria-hidden="true"></i>{{ childAgeLabel }}</span>
            </div>
          </div>
          <div v-if="booking.event_date" class="profile-date">
            <span>{{ $t("Consultation_date") }}</span>
            <strong dir="ltr">{{ String(booking.event_date).slice(0, 10) }}</strong>
          </div>
        </header>

        <div v-for="card in infoCards" :key="card.key" class="profile-section">
          <h3 class="profile-section-title">{{ card.title }}</h3>
          <ul class="info-tiles">
            <li v-for="(field, index) in card.fields" :key="index" class="info-tile">
              <span class="info-tile-icon" aria-hidden="true"><i :class="field.icon"></i></span>
              <span class="info-tile-text">
                <small>{{ field.label }}</small>
                <strong :dir="field.ltr ? 'ltr' : null">{{ field.value }}</strong>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section v-if="answerFields.length" class="answers-block">
        <h3 class="answers-title"><i class="pi pi-comments" aria-hidden="true"></i>{{ $t("Answer_the_questions") }}</h3>
        <ol class="answer-cards">
          <li v-for="(field, index) in answerFields" :key="index" class="answer-card">
            <span class="answer-number">{{ index + 1 }}</span>
            <p class="answer-question">{{ field.label }}</p>
            <p class="answer-text">{{ field.value }}</p>
          </li>
        </ol>
      </section>
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
          <!-- "Confirm" the first time; once the booking has been answered, the same form edits that answer. -->
          <Button
            :label="bookingAnswered ? $t('edit') : $t('submit')"
            type="submit"
            :loading="submittingBooking"
            :disabled="submittingBooking"
            class="bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-300 px-6 py-2 rounded-lg shadow-md w-60"
            :icon="bookingAnswered ? 'pi pi-pencil' : 'pi pi-check'"></Button>
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
      <!-- The evaluations the child needs; the programs manager books them with the specialists. -->
      <div class="flex flex-col">
        <label class="text-gray-600 font-medium text-sm" for="required-evaluations">{{ $t("required_evaluations") }}</label>
        <small class="text-gray-500 mb-1">{{ $t("required_evaluations_pick_hint") }}</small>
        <MultiSelect
          inputId="required-evaluations"
          v-model="pre_evalutions.pre_evalutions"
          :options="evaluate_types"
          optionLabel="name"
          dataKey="id"
          :placeholder="$t('required_evaluations')"
          class="w-full text-sm"
        >
          <template #option="{ option }">{{ getEvaluationTypeLabel(option.id, $t, option.name) }}</template>
          <template #value="{ value, placeholder }">
            {{ value?.length ? value.map((item) => getEvaluationTypeLabel(item.id, $t, item.name)).join("، ") : placeholder }}
          </template>
        </MultiSelect>
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
import { formatChildAge } from "@/utils/childAge";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";

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
        { name: "ABLLS Academy", id: 4 },
        { name: "carolina", id: 5 },
        { name: "Transition", id: 6 },
        { name: "Ablls OT", id: 7 },
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
          pre_evaluations: { pre_evalutions: this.pre_evalutions.pre_evalutions ?? [] },
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
    infoField(label, value, ltr = false, icon = "pi pi-circle-fill") {
      if (value == null || String(value).trim() === "") return null;
      return { label: this.$t(label), value, ltr, icon };
    },
    removeBracesAndReplace(text) {
      // {{name}} (any {{...}}) is the child's name.
      return String(text ?? "").replace(/\{\{.*?\}\}/g, this.booking.child_name);
    },

    // The calendar books for this consultation, so the evaluation is linked to it (and to its consultant).
    AddEvalte(id) {
      this.$router.push({ name: "Calender", params: { id: id }, query: { bookingId: this.booking.id } });
    },
    getEvaluationTypeLabel,
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
    // The booking was confirmed before (saved with a decision or a note to the parents), so the form edits it.
    // Read from the saved booking, not the form, so the label changes only after saving.
    bookingAnswered() {
      const accepted = this.booking?.accepted;
      const decided = accepted !== undefined && accepted !== null && accepted !== "" && Number(accepted) !== -1;
      return decided || String(this.booking?.accepted_notes ?? "").trim() !== "";
    },
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
    childGenderLabel() {
      const gender = this.booking?.child_gender;
      if (gender == null || gender === "") return "";
      // Gender codes match the child forms: 0 = male, 1 = female.
      return String(gender) === "0" ? this.$t("male") : this.$t("female");
    },
    childAgeLabel() {
      return this.booking?.child_birth_date ? formatChildAge(this.booking.child_birth_date, null, this.$t) : "";
    },
    childInitial() {
      return String(this.booking?.child_name ?? "").trim().charAt(0) || "؟";
    },
    // Only filled fields are shown; a card with nothing filled is hidden.
    infoCards() {
      const b = this.booking ?? {};
      return [
        {
          key: "child", icon: "pi pi-id-card", title: this.$t("booking_child_info"),
          fields: [
            this.infoField("birth_date", b.child_birth_date, true, "pi pi-calendar"),
            this.infoField("place_of_birth", b.child_birth_place, false, "pi pi-map-marker"),
            this.infoField("Nationality", b.child_nationalty, false, "pi pi-flag"),
            this.infoField("national_number", b.child_national_id, true, "pi pi-hashtag"),
            this.infoField("primary_language", b.child_lang, false, "pi pi-language"),
            this.infoField("address", b.child_address, false, "pi pi-home"),
          ],
        },
        {
          key: "requester", icon: "pi pi-phone", title: this.$t("booking_requester_info"),
          fields: [
            this.infoField("applicant", b.requester_name, false, "pi pi-user"),
            this.infoField("degree_closeness_child", b.relative_degree, false, "pi pi-users"),
            this.infoField("phone_number", b.requester_phone, true, "pi pi-phone"),
            this.infoField("Additional_phone_number", b.addtional_phone, true, "pi pi-mobile"),
            this.infoField("owner_extra_number", b.addtional_phone_owner, false, "pi pi-user-plus"),
            this.infoField("degree_closeness_child", b.addtional_phone_degree, false, "pi pi-users"),
            this.infoField("conversion_source", b.conversion_type, false, "pi pi-directions"),
            this.infoField("Specialist_code", b.doctor_code, false, "pi pi-key"),
          ],
        },
      ]
        .map((card) => ({ ...card, fields: card.fields.filter(Boolean) }))
        .filter((card) => card.fields.length);
    },
    answerFields() {
      const b = this.booking ?? {};
      const d = b.details ?? {};
      if (!this.booking?.id && !b.child_name) return [];
      // The gender shows in the child header above.
      return [
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

.booking-overview { display: grid; gap: 1rem; }

.profile-card { padding: 1.25rem 1.5rem; border: 1px solid #e2e8f0; border-radius: 1rem; background: #fff; box-shadow: 0 12px 28px -24px rgb(15 23 42 / .5); }
.profile-head { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
.profile-avatar { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; width: 3.25rem; height: 3.25rem; border-radius: 50%; background: linear-gradient(135deg, var(--sawa-primary, #135c65), #EC477C); color: #fff; font-size: 1.4rem; font-weight: 700; }
.profile-name { flex: 1 1 14rem; min-width: 0; }
.profile-name h2 { margin: 0 0 .35rem; color: #0f172a; font-size: 1.3rem; font-weight: 700; overflow-wrap: anywhere; }
.profile-chips { display: flex; flex-wrap: wrap; gap: .4rem; }
.profile-chip { display: inline-flex; align-items: center; gap: .35rem; padding: .15rem .6rem; border-radius: 999px; background: #fdf2f7; color: #9d174d; font-size: .8rem; font-weight: 600; }
.profile-chip i { font-size: .72rem; }
.profile-date { display: grid; justify-items: center; gap: .1rem; padding: .5rem 1rem; border-radius: .8rem; background: var(--sawa-primary, #135c65); color: #fff; }
.profile-date span { font-size: .72rem; opacity: .85; }
.profile-date strong { font-size: 1rem; }

.profile-section { margin-top: 1.1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0; }
.profile-section-title { margin: 0 0 .7rem; color: #64748b; font-size: .85rem; font-weight: 700; }
.info-tiles { display: flex; flex-wrap: wrap; gap: .6rem; margin: 0; padding: 0; list-style: none; }
.info-tile { display: inline-flex; align-items: center; gap: .6rem; max-width: 100%; padding: .5rem .9rem .5rem .6rem; border: 1px solid #eef2f6; border-radius: .8rem; background: #f8fafc; }
.info-tile-icon { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: .6rem; background: #fff; color: #EC477C; box-shadow: 0 1px 2px rgb(15 23 42 / .06); }
.info-tile-icon i { font-size: .85rem; }
.info-tile-text { display: grid; min-width: 0; line-height: 1.35; }
.info-tile-text small { color: #94a3b8; font-size: .72rem; }
.info-tile-text strong { color: #0f172a; font-size: .95rem; font-weight: 600; overflow-wrap: anywhere; }
.info-tile-text strong[dir="ltr"] { unicode-bidi: plaintext; text-align: start; }

.answers-block { padding: 1.1rem 1.5rem 1.25rem; border: 1px solid #e2e8f0; border-radius: 1rem; background: #fff; box-shadow: 0 12px 28px -24px rgb(15 23 42 / .5); }
.answers-title { display: flex; align-items: center; gap: .5rem; margin: 0 0 .85rem; color: var(--sawa-primary, #135c65); font-size: 1.05rem; font-weight: 700; }
.answer-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); gap: .75rem; margin: 0; padding: 0; list-style: none; }
.answer-card { position: relative; padding: .85rem 1rem .9rem; padding-inline-start: 2.9rem; border-radius: .8rem; background: #f8fafc; border: 1px solid #eef2f6; }
.answer-number { position: absolute; top: .85rem; inset-inline-start: .85rem; display: inline-flex; align-items: center; justify-content: center; width: 1.5rem; height: 1.5rem; border-radius: 50%; background: #fdf2f7; color: #EC477C; font-size: .75rem; font-weight: 700; }
.answer-question { margin: 0 0 .35rem; color: #64748b; font-size: .82rem; line-height: 1.6; }
.answer-text { margin: 0; color: #0f172a; font-weight: 700; line-height: 1.7; white-space: pre-line; overflow-wrap: anywhere; }

@media (max-width: 520px) {
  .profile-card, .answers-block { padding-inline: 1rem; }
  .profile-date { width: 100%; }
  .info-tile { width: 100%; }
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
