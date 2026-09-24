<script>
import axios from "axios";
import moment from "moment";

// A consultation booked from the dashboard for a parent's child. It asks what the parent's booking form
// asks (views/frontend/components/Cons.vue), plus the parent, child, consultant and time; past times are allowed.
const REQUIRED = ["requester_name", "relative_degree", "requester_phone", "child_parents_problems", "parents_priorities"];

// Requester details in form order; the additional phone, its owner and relation, the referral source and the
// child's doctor are optional.
const REQUESTER_FIELDS = [
  { key: "requester_name", label: "اسم ولي امر  مقدم الطلب", required: true },
  { key: "relative_degree", label: "درجه قرابته للطفل ", required: true },
  { key: "requester_phone", label: "رقم هاتف ولي الامر", required: true },
  { key: "addtional_phone", label: "رقم هاتف اضافي" },
  { key: "addtional_phone_owner", label: "مالك الرقم الاضافي" },
  { key: "addtional_phone_degree", label: "درجه قرابته بالطفل" },
  { key: "conversion_type", label: "مصدر التحويل" },
  { key: "child_doctor", label: "الطبيب الخاص بالطفل" },
];

export default {
  data() {
    return {
      loading: true,
      loadError: false,
      saving: false,
      submitted: false,
      requesterFields: REQUESTER_FIELDS,
      serverErrors: {},
      consultants: [],
      parents: [],
      children: [],
      form: { user_id: null, child_id: null, employee_id: null, start: null, doctor_code: null },
      details: {
        requester_name: "", relative_degree: "", requester_phone: "", addtional_phone: "", addtional_phone_owner: "",
        addtional_phone_degree: "", conversion_type: "", child_doctor: "", child_problem: null, problem: "",
        child_problems_notes: "", child_aids: null, aids: "", child_parents_problems: "", parents_priorities: "",
        child_aids_notes: "",
      },
      // What was last copied from the chosen parent, so switching parent only replaces untouched values.
      prefilled: { requester_name: "", requester_phone: "" },
    };
  },
  computed: {
    problemTypes() {
      return [
        { name: this.$t("حركية"), code: 1 },
        { name: this.$t("سمعيه"), code: 2 },
        { name: this.$t("عقليه_نمائيه"), code: 3 },
        { name: this.$t("توحد"), code: 4 },
        { name: this.$t("اخر"), code: 5 },
      ];
    },
    yesNo() {
      return [{ name: this.$t("yes"), id: 1 }, { name: this.$t("no"), id: 0 }];
    },
    parentChildren() {
      return this.children.filter((child) => child.parent_id === this.form.user_id);
    },
    // Field key => message; the same rules the server checks.
    clientErrors() {
      const errors = {};
      const need = (key, value) => { if (value === null || value === undefined || String(value).trim() === "") errors[key] = this.$t("field_required"); };
      need("user_id", this.form.user_id);
      need("child_id", this.form.child_id);
      need("employee_id", this.form.employee_id);
      need("start", this.form.start);
      REQUIRED.forEach((key) => need(`details.${key}`, this.details[key]));
      need("details.child_problem", this.details.child_problem);
      need("details.child_aids", this.details.child_aids);
      if (this.details.child_problem === 5) need("details.problem", this.details.problem);
      if (this.details.child_aids === 1) need("details.aids", this.details.aids);
      return errors;
    },
    isPast() {
      return this.form.start && moment(this.form.start).isBefore(moment());
    },
  },
  methods: {
    error(key) {
      if (this.serverErrors[key]) return this.serverErrors[key][0];
      return this.submitted ? this.clientErrors[key] : "";
    },
    async load() {
      this.loading = true;
      this.loadError = false;
      try {
        const { data } = await axios.get("/api/calender/new-booking/options");
        this.consultants = data.consultants ?? [];
        this.parents = (data.parents ?? []).map((parent) => ({ ...parent, label: parent.phone ? `${parent.name} — ${parent.phone}` : parent.name }));
        this.children = data.children ?? [];
      } catch {
        this.loadError = true;
      } finally {
        this.loading = false;
      }
    },
    chooseParent(parentId) {
      this.form.user_id = parentId;
      if (!this.parentChildren.some((child) => child.id === this.form.child_id)) {
        this.form.child_id = this.parentChildren.length === 1 ? this.parentChildren[0].id : null;
      }
      const parent = this.parents.find((item) => item.id === parentId);
      const fill = { requester_name: parent?.name ?? "", requester_phone: parent?.phone ?? "" };
      for (const [key, value] of Object.entries(fill)) {
        if (!this.details[key] || this.details[key] === this.prefilled[key]) this.details[key] = value;
      }
      this.prefilled = fill;
    },
    async submit() {
      this.submitted = true;
      this.serverErrors = {};
      if (Object.keys(this.clientErrors).length || this.saving) {
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail: this.$t("fill_required_fields"), life: 4000 });
        return;
      }
      this.saving = true;
      const details = { ...this.details };
      if (details.child_problem !== 5) delete details.problem;
      if (details.child_aids !== 1) delete details.aids;
      try {
        const { data } = await axios.post("/api/calender/new-booking", {
          ...this.form,
          start: moment(this.form.start).format("YYYY-MM-DD HH:mm"),
          details,
        });
        this.$toast.add({ severity: "success", summary: this.$t("success_message"), detail: this.$t("booking_created"), life: 3000 });
        this.$router.push({ name: "BookingDetails", params: { id: data.booking.id } });
      } catch (error) {
        this.serverErrors = error.response?.data?.errors ?? {};
        const detail = Object.values(this.serverErrors).flat()[0] ?? error.response?.data?.message ?? this.$t("request_failed_retry");
        this.$toast.add({ severity: "error", summary: this.$t("error"), detail, life: 6000 });
      } finally {
        this.saving = false;
      }
    },
  },
  mounted() {
    this.load();
  },
};
</script>

<template>
  <div class="page">
    <Toast />
    <div class="page-header">
      <h1 class="page-title">{{ $t("new_consultation") }}</h1>
      <BackButton />
    </div>

    <div v-if="loading" class="surface-card empty-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="loadError" severity="error" :closable="false">{{ $t("request_failed_retry") }}</Message>

    <form v-else class="booking-form" novalidate data-no-request-spinner @submit.prevent="submit">
      <section class="surface-card form-section">
        <h2 class="section-title">{{ $t("new_consultation_who_when") }}</h2>
        <div class="form-grid">
          <div class="field required">
            <label for="booking-parent">{{ $t("parent_label") }}</label>
            <Select inputId="booking-parent" :modelValue="form.user_id" :options="parents" optionLabel="label" optionValue="id"
              filter fluid :placeholder="$t('choose_parent')" :invalid="Boolean(error('user_id'))" @update:modelValue="chooseParent" />
            <small v-if="error('user_id')" class="field-error">{{ error("user_id") }}</small>
          </div>
          <div class="field required">
            <label for="booking-child">{{ $t("child_name") }}</label>
            <Select inputId="booking-child" v-model="form.child_id" :options="parentChildren" optionLabel="name" optionValue="id"
              filter fluid :disabled="!form.user_id" :placeholder="form.user_id && !parentChildren.length ? $t('parent_has_no_children') : $t('select_child')"
              :invalid="Boolean(error('child_id'))" />
            <small v-if="error('child_id')" class="field-error">{{ error("child_id") }}</small>
          </div>
          <div class="field required">
            <label for="booking-consultant">{{ $t("consultant_label") }}</label>
            <Select inputId="booking-consultant" v-model="form.employee_id" :options="consultants" optionLabel="name" optionValue="id"
              filter fluid :placeholder="$t('choose_consultant')" :invalid="Boolean(error('employee_id'))" />
            <small v-if="error('employee_id')" class="field-error">{{ error("employee_id") }}</small>
          </div>
          <div class="field required">
            <label for="booking-start">{{ $t("consultation_date") }}</label>
            <DatePicker inputId="booking-start" v-model="form.start" showTime hourFormat="12" :stepMinute="15" showIcon fluid
              dateFormat="yy-mm-dd" :invalid="Boolean(error('start'))" />
            <small v-if="error('start')" class="field-error">{{ error("start") }}</small>
            <small v-else-if="isPast" class="field-hint">{{ $t("new_consultation_past_hint") }}</small>
          </div>
        </div>
      </section>

      <section class="surface-card form-section">
        <h2 class="section-title">{{ $t("new_consultation_requester") }}</h2>
        <div class="form-grid">
          <div v-for="field in requesterFields" :key="field.key" class="field" :class="{ required: field.required }">
            <label :for="`booking-${field.key}`">{{ $t(field.label) }}</label>
            <InputText :id="`booking-${field.key}`" v-model="details[field.key]" fluid :invalid="Boolean(error(`details.${field.key}`))" />
            <small v-if="error(`details.${field.key}`)" class="field-error">{{ error(`details.${field.key}`) }}</small>
          </div>
        </div>
      </section>

      <section class="surface-card form-section">
        <h2 class="section-title">{{ $t("answer_following_questions") }}</h2>
        <div class="questions-grid">
          <!-- Each choice keeps its follow-up question right under it. -->
          <div class="question-group">
            <div class="field required">
              <label for="booking-problem-type">{{ $t("نرجو تحديد نوع المشكله") }}</label>
              <Select inputId="booking-problem-type" v-model="details.child_problem" :options="problemTypes" optionLabel="name"
                optionValue="code" fluid :invalid="Boolean(error('details.child_problem'))" />
              <small v-if="error('details.child_problem')" class="field-error">{{ error("details.child_problem") }}</small>
            </div>
            <div v-if="details.child_problem === 5" class="field required follow-up">
              <label for="booking-problem">{{ $t("برجاء تحديد نوع المشكلة") }}</label>
              <InputText id="booking-problem" v-model="details.problem" fluid :invalid="Boolean(error('details.problem'))" />
              <small v-if="error('details.problem')" class="field-error">{{ error("details.problem") }}</small>
            </div>
          </div>
          <div class="question-group">
            <div class="field required">
              <label for="booking-aids">{{ $t("هل يستخدم الطفل اي معينات حركيه / سمعيه/ بصريه") }}</label>
              <Select inputId="booking-aids" v-model="details.child_aids" :options="yesNo" optionLabel="name" optionValue="id"
                fluid :invalid="Boolean(error('details.child_aids'))" />
              <small v-if="error('details.child_aids')" class="field-error">{{ error("details.child_aids") }}</small>
            </div>
            <div v-if="details.child_aids === 1" class="field required follow-up">
              <label for="booking-aid-name">{{ $t("برجاء تحديد اسم المعين") }}</label>
              <InputText id="booking-aid-name" v-model="details.aids" fluid :invalid="Boolean(error('details.aids'))" />
              <small v-if="error('details.aids')" class="field-error">{{ error("details.aids") }}</small>
            </div>
          </div>
          <div class="field">
            <label for="booking-diagnosis">{{ $t("التشخيص ان وجد") }}</label>
            <InputText id="booking-diagnosis" v-model="details.child_problems_notes" fluid />
          </div>
          <div class="field">
            <label for="booking-doctor-code">{{ $t("كود الاستشاري ان وجد") }}</label>
            <InputNumber inputId="booking-doctor-code" v-model="form.doctor_code" :useGrouping="false" fluid />
          </div>
          <div class="field required">
            <label for="booking-parents-problems">{{ $t("المشاكل الرئيسيه لدي الطفل حاليا من وجهه نظر الاهل") }}</label>
            <Textarea id="booking-parents-problems" v-model="details.child_parents_problems" rows="5" autoResize fluid
              :invalid="Boolean(error('details.child_parents_problems'))" />
            <small v-if="error('details.child_parents_problems')" class="field-error">{{ error("details.child_parents_problems") }}</small>
          </div>
          <div class="field required">
            <label for="booking-priorities">{{ $t("ما هي اولويه الاهل في البرامج التاهليه للتعامل مع الطفل") }}</label>
            <Textarea id="booking-priorities" v-model="details.parents_priorities" rows="5" autoResize fluid
              :invalid="Boolean(error('details.parents_priorities'))" />
            <small v-if="error('details.parents_priorities')" class="field-error">{{ error("details.parents_priorities") }}</small>
          </div>
          <div class="field wide">
            <label for="booking-notes">{{ $t("اضف ملاحظات") }}</label>
            <Textarea id="booking-notes" v-model="details.child_aids_notes" rows="3" autoResize fluid />
          </div>
        </div>
      </section>

      <div class="form-actions">
        <Button type="submit" :label="$t('new_consultation_submit')" icon="pi pi-check" :loading="saving" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.booking-form {
  display: grid;
  gap: 1rem;
}
.form-section {
  display: grid;
  gap: 1rem;
}
.section-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--sawa-primary);
}
/* Two even columns; fields in a row line up even when one label wraps to two lines. */
.questions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem 1rem;
  align-items: start;
}
.questions-grid .field {
  display: grid;
  gap: 0.4rem;
  margin: 0;
}
.questions-grid > .field,
.question-group > .field:first-child {
  grid-template-rows: minmax(2.6em, auto) auto;
  align-content: start;
}
.questions-grid > .field > label,
.question-group > .field:first-child > label {
  align-self: end;
}
.question-group {
  display: grid;
  gap: 0.75rem;
}
.follow-up {
  padding-inline-start: 0.75rem;
  border-inline-start: 3px solid var(--sawa-primary-soft);
}
.questions-grid .wide {
  grid-column: 1 / -1;
}
@media (max-width: 700px) {
  .questions-grid {
    grid-template-columns: 1fr;
  }
  .questions-grid > .field,
  .question-group > .field:first-child {
    grid-template-rows: auto auto;
  }
}
.field.required > label::after {
  content: " *";
  color: #dc2626;
}
.field-hint {
  color: var(--sawa-muted);
}
.form-actions {
  display: flex;
  justify-content: center;
}
.form-actions .p-button {
  min-width: 12rem;
}
</style>
