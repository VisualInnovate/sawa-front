<script setup>
// Booking a consultation, step 2: who asks, how to reach them, and what the parents see in the child — then the
// booking is sent and waits for the consultant.
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import { useParentStore } from "@/stores/ParentStore";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { fmtDay, fmtTime } from "@/utils/parentPortal";

const props = defineProps({ event_id: { type: [String, Number], required: true }, child_id: { type: [String, Number], required: true } });
const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const parentStore = useParentStore();
const portal = useParentPortalStore();

const event = ref(null);
const submitted = ref(false);
const sending = ref(false);
const details = ref({
  requester_name: [parentStore.user?.fname, parentStore.user?.lname].filter(Boolean).join(" "),
  requester_phone: parentStore.user?.phone ?? "",
  relative_degree: "",
  addtional_phone: "", addtional_phone_owner: "", addtional_phone_degree: "",
  conversion_type: "", child_doctor: "",
  child_problem: null, problem: "", child_problems_notes: "",
  child_aids: null, aids: "", child_parents_problems: "", parents_priorities: "", child_aids_notes: "",
});
const doctorCode = ref(null);

const child = computed(() => portal.childById(props.child_id));
const problems = computed(() => [
  { name: t("حركية"), code: 1 }, { name: t("سمعيه"), code: 2 }, { name: t("عقليه_نمائيه"), code: 3 }, { name: t("توحد"), code: 4 }, { name: t("اخر"), code: 5 },
]);
const yesNo = computed(() => [{ id: 1, name: t("yes") }, { id: 0, name: t("no") }]);

onMounted(async () => {
  portal.load();
  try {
    event.value = (await axios.get(`/api/event-calendar/front/slot/${props.event_id}`)).data.data?.start ?? null;
  } catch {
    event.value = null;
  }
});

const missing = (key) => submitted.value && !details.value[key];
const ready = computed(() => details.value.requester_name && details.value.requester_phone && details.value.relative_degree && details.value.child_problem
  && details.value.child_aids !== null && details.value.child_parents_problems && details.value.parents_priorities
  && (details.value.child_problem?.code !== 5 || details.value.problem) && (details.value.child_aids?.id !== 1 || details.value.aids));

async function submit() {
  submitted.value = true;
  if (!ready.value) {
    toast.add({ severity: "warn", summary: t("fill_required_fields"), life: 3000 });
    return;
  }
  const payload = {
    user_id: Number(parentStore.user?.parent_id ?? parentStore.parent_id ?? 0) || null,
    event_id: Number(props.event_id),
    child_id: Number(props.child_id),
    details: { ...details.value, child_problem: details.value.child_problem?.code, child_aids: details.value.child_aids?.id },
  };
  if (doctorCode.value != null && doctorCode.value !== "") payload.doctor_code = doctorCode.value;
  sending.value = true;
  try {
    await axios.post("/api/calender/store-booking", payload);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("pp.booking_sent"), life: 4000 });
    portal.refresh();
    router.push({ name: "Booking" });
  } catch (error) {
    const first = Object.values(error.response?.data?.errors ?? {}).flat()[0];
    toast.add({ severity: "error", summary: t("error"), detail: first || error.response?.data?.message || t("mission_error"), life: 4000 });
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="pp-page">
    <Toast />
    <PageHead :title="$t('Book_an_appointment_with_the_specialist')" :lead="$t('Please_fill_in_the_information')" :back="{ name: 'BookingTime', params: { child_id } }" :kicker="$t('pp.step_of', { n: 2, total: 2 })" icon="pi pi-calendar" />

    <section class="pp-card pp-card--teal pp-card--pad pp-when pp-in">
      <span class="pp-when__icon"><i class="pi pi-calendar-clock" /></span>
      <div>
        <p class="m-0 text-sm opacity-90">{{ $t("pp.chosen_time") }}<template v-if="child"> · {{ child.name }}</template></p>
        <p class="m-0 text-xl font-extrabold">{{ event ? `${fmtDay(event)} · ${fmtTime(event)}` : "…" }}</p>
      </div>
    </section>

    <form class="pp-card pp-card--pad pp-stack pp-in" :style="{ '--i': 1 }" novalidate data-no-request-spinner @submit.prevent="submit">
      <h2 class="pp-h2">{{ $t("new_consultation_requester") }}</h2>
      <div class="pp-form-grid">
        <div class="pp-field is-required"><label for="b-name">{{ $t("اسم ولي امر  مقدم الطلب") }}</label><InputText id="b-name" v-model="details.requester_name" fluid :invalid="missing('requester_name')" /></div>
        <div class="pp-field is-required"><label for="b-rel">{{ $t("درجه قرابته للطفل ") }}</label><InputText id="b-rel" v-model="details.relative_degree" fluid :invalid="missing('relative_degree')" /></div>
        <div class="pp-field is-required"><label for="b-phone">{{ $t("رقم هاتف ولي الامر") }}</label><InputText id="b-phone" v-model="details.requester_phone" type="tel" dir="ltr" fluid :invalid="missing('requester_phone')" /></div>
        <div class="pp-field"><label for="b-phone2">{{ $t("رقم هاتف اضافي") }}</label><InputText id="b-phone2" v-model="details.addtional_phone" type="tel" dir="ltr" fluid /></div>
        <div class="pp-field"><label for="b-owner">{{ $t("مالك الرقم الاضافي") }}</label><InputText id="b-owner" v-model="details.addtional_phone_owner" fluid /></div>
        <div class="pp-field"><label for="b-owner-rel">{{ $t("درجه قرابته بالطفل") }}</label><InputText id="b-owner-rel" v-model="details.addtional_phone_degree" fluid /></div>
        <div class="pp-field"><label for="b-source">{{ $t("مصدر التحويل") }}</label><InputText id="b-source" v-model="details.conversion_type" fluid /></div>
        <div class="pp-field"><label for="b-doctor">{{ $t("الطبيب الخاص بالطفل") }}</label><InputText id="b-doctor" v-model="details.child_doctor" fluid /></div>
      </div>

      <div class="pp-divider" />
      <h2 class="pp-h2">{{ $t("answer_following_questions") }}</h2>
      <div class="pp-form-grid">
        <div class="pp-field is-required"><label for="b-problem">{{ $t("نرجو تحديد نوع المشكله") }}</label><Select id="b-problem" v-model="details.child_problem" :options="problems" optionLabel="name" :placeholder="$t('نرجو تحديد نوع المشكله')" fluid :invalid="missing('child_problem')" /></div>
        <div v-if="details.child_problem?.code === 5" class="pp-field is-required"><label for="b-problem-other">{{ $t("برجاء تحديد نوع المشكلة") }}</label><InputText id="b-problem-other" v-model="details.problem" fluid :invalid="missing('problem')" /></div>
        <div class="pp-field"><label for="b-diag">{{ $t("التشخيص ان وجد") }}</label><InputText id="b-diag" v-model="details.child_problems_notes" fluid /></div>
        <div class="pp-field is-required"><label for="b-aids">{{ $t("هل يستخدم الطفل اي معينات حركيه / سمعيه/ بصريه") }}</label><Select id="b-aids" v-model="details.child_aids" :options="yesNo" optionLabel="name" :placeholder="$t('هل يستخدم الطفل اي معينات حركيه / سمعيه/ بصريه')" fluid :invalid="submitted && details.child_aids === null" /></div>
        <div v-if="details.child_aids?.id === 1" class="pp-field is-required"><label for="b-aids-name">{{ $t("برجاء تحديد اسم المعين") }}</label><InputText id="b-aids-name" v-model="details.aids" fluid :invalid="missing('aids')" /></div>
      </div>
      <div class="pp-field is-required"><label for="b-problems">{{ $t("المشاكل الرئيسيه لدي الطفل حاليا من وجهه نظر الاهل") }}</label><Textarea id="b-problems" v-model="details.child_parents_problems" rows="4" autoResize fluid :invalid="missing('child_parents_problems')" /></div>
      <div class="pp-field is-required"><label for="b-priorities">{{ $t("ما هي اولويه الاهل في البرامج التاهليه للتعامل مع الطفل") }}</label><Textarea id="b-priorities" v-model="details.parents_priorities" rows="4" autoResize fluid :invalid="missing('parents_priorities')" /></div>
      <div class="pp-form-grid">
        <div class="pp-field"><label for="b-notes">{{ $t("اضف ملاحظات") }}</label><Textarea id="b-notes" v-model="details.child_aids_notes" rows="3" autoResize fluid /></div>
        <div class="pp-field"><label for="b-code">{{ $t("كود الاستشاري ان وجد") }}</label><InputNumber inputId="b-code" v-model="doctorCode" :useGrouping="false" fluid /></div>
      </div>

      <div class="pp-row pp-between pt-2">
        <small class="pp-muted">{{ $t("pp.booking_wait_hint") }}</small>
        <Button type="submit" :label="$t('Book_now')" icon="pi pi-send" :loading="sending" size="large" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.pp-when {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.pp-when__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 1.4rem;
  flex-shrink: 0;
}
.pp-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}
@media (min-width: 768px) {
  .pp-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
