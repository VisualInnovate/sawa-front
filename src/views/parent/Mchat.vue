<template>
  <div class="pp-page">
  <PageHead :title="$t('pmchat.title')" :lead="$t('pmchat.not_diagnosis')" :kicker="$t('pp.brand')" icon="pi pi-heart" />
  <div class="max-w-[820px] w-full">
    <div v-if="loading" class="py-10 text-center"><ProgressSpinner style="width: 40px; height: 40px" /></div>

    <!-- 1. Pick the child -->
    <template v-else-if="step === 'pick'">
      <div class="pm-card bg-white rounded-2xl border p-5 mb-5">
        <p class="text-bp-135c65 font-bold text-xl mb-2"><i class="pi pi-heart mx-1" />{{ $t("pmchat.intro_title") }}</p>
        <p class="text-slate-600 leading-8 m-0">{{ $t("pmchat.intro", { count: data.questions?.length || 20, from: data.age_from, to: data.age_to }) }}</p>
        <p v-if="data.instructions" class="text-slate-600 leading-8 mt-2 mb-0">{{ data.instructions }}</p>
        <p class="pm-note mt-3 mb-0"><i class="pi pi-info-circle mx-1" />{{ $t("pmchat.not_diagnosis") }}</p>
      </div>

      <p class="font-bold text-lg text-[#303843] mb-3">{{ $t("pmchat.pick_child") }}</p>
      <div v-if="!data.children.length" class="bg-white rounded-xl border p-5 text-center text-slate-600">
        {{ $t("pmchat.no_children") }}
        <div class="mt-3"><Button icon="pi pi-plus" :label="$t('pmchat.add_child')" @click="$router.push({ name: 'ReAction' })" /></div>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <button v-for="child in data.children" :key="child.id" type="button" class="pm-child bg-white rounded-xl border p-4 text-start" @click="start(child)">
          <b class="text-bp-135c65 text-lg block">{{ child.name }}</b>
          <small class="text-slate-500">{{ formatChildAge(null, child.age_months, $t) }}</small>
          <small v-if="!child.in_range" class="block text-amber-700 mt-1"><i class="pi pi-exclamation-triangle" /> {{ $t("pmchat.out_of_range", { from: data.age_from, to: data.age_to }) }}</small>
          <span class="pm-go"><i class="pi pi-arrow-left" /> {{ $t("pmchat.start") }}</span>
        </button>
      </div>

      <template v-if="data.history.length">
        <p class="font-bold text-lg text-[#303843] mt-6 mb-3">{{ $t("pmchat.history") }}</p>
        <div class="grid gap-2">
          <button v-for="row in data.history" :key="row.id" type="button" class="pm-history bg-white rounded-xl border p-3 text-start" @click="open(row.id)">
            <span><b>{{ row.child }}</b> <small class="text-slate-500 mx-1" dir="ltr">{{ row.date }}</small></span>
            <span class="pm-risk" :class="`pm-risk--${row.risk}`">{{ row.total }}/20 · {{ row.risk_label }}</span>
          </button>
        </div>
      </template>
    </template>

    <!-- 2. The questions, one at a time -->
    <template v-else-if="step === 'questions'">
      <div class="flex items-center justify-between mb-2">
        <b class="text-bp-135c65">{{ child.name }}</b>
        <small class="text-slate-500">{{ $t("pmchat.progress", { n: index + 1, total: data.questions.length }) }}</small>
      </div>
      <ProgressBar :value="((index + (answers[question.id] !== undefined ? 1 : 0)) / data.questions.length) * 100" :showValue="false" style="height: 8px" />
      <transition name="pm-slide" mode="out-in">
        <div :key="question.id" class="pm-card bg-white rounded-2xl border p-6 mt-4">
          <p class="text-xl leading-9 text-[#303843] font-semibold m-0">{{ question.text }}</p>
          <p v-if="question.example" class="text-slate-500 leading-7 mt-3 mb-0">{{ question.example }}</p>
          <div class="grid grid-cols-2 gap-3 mt-6">
            <button type="button" class="pm-answer" :class="{ 'pm-answer--on': answers[question.id] === true }" @click="answer(true)">
              <i class="pi pi-check" /> {{ $t("pmchat.yes") }}
            </button>
            <button type="button" class="pm-answer" :class="{ 'pm-answer--on': answers[question.id] === false }" @click="answer(false)">
              <i class="pi pi-times" /> {{ $t("pmchat.no") }}
            </button>
          </div>
        </div>
      </transition>
      <div class="flex justify-between mt-4">
        <Button text icon="pi pi-arrow-right" :label="$t('pmchat.back')" :disabled="saving" @click="back" />
        <Button v-if="complete" icon="pi pi-check-circle" :label="$t('pmchat.show_result')" :loading="saving" @click="submit" />
      </div>
    </template>

    <!-- 3. The result -->
    <template v-else-if="step === 'result'">
      <div class="pm-card bg-white rounded-2xl border p-6 text-center">
        <p class="text-slate-500 m-0">{{ result.child }} · <span dir="ltr">{{ result.date }}</span></p>
        <div class="pm-score" :class="`pm-score--${result.risk}`">
          <b>{{ result.total }}</b><small>/20</small>
        </div>
        <p class="pm-risk pm-risk--big mx-auto" :class="`pm-risk--${result.risk}`">{{ $t("pmchat.level", { level: result.risk_label }) }}</p>
        <p class="text-[#303843] leading-8 mt-4 mb-0">{{ result.message }}</p>
        <p v-if="!result.in_range" class="text-amber-700 mt-3 mb-0"><i class="pi pi-exclamation-triangle" /> {{ $t("pmchat.out_of_range_result", { from: data.age_from, to: data.age_to }) }}</p>
        <p class="pm-note mt-4 mb-0 text-start"><i class="pi pi-info-circle mx-1" />{{ $t("pmchat.not_diagnosis") }}</p>
        <div class="flex flex-wrap justify-center gap-2 mt-5">
          <Button icon="pi pi-calendar-plus" :label="$t('pmchat.book')" :loading="booking" @click="book" />
          <Button outlined icon="pi pi-list" :label="showAnswers ? $t('pmchat.hide_answers') : $t('pmchat.show_answers')" @click="showAnswers = !showAnswers" />
          <Button text icon="pi pi-replay" :label="$t('pmchat.again')" @click="reset" />
        </div>
      </div>
      <div v-if="showAnswers" class="bg-white rounded-2xl border mt-4">
        <div v-for="a in result.answers" :key="a.number" class="pm-row">
          <span class="text-slate-400">{{ a.number }}</span>
          <span class="grow">{{ a.text }}</span>
          <b :class="a.yes ? 'text-bp-135c65' : 'text-slate-500'">{{ a.yes ? $t("pmchat.yes") : $t("pmchat.no") }}</b>
        </div>
      </div>
    </template>
  </div>
  <Toast />
  </div>
</template>

<script setup>
// The parents' portal: the free M-CHAT-R at home. Pick a child, answer the 20 yes/no questions one by one, see the
// result at once; it is kept for the parent only (not an evaluation of the academy). The assistant can open this page
// on a child (/web/mchat/:child_id).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import PageHead from "@/components/parent/PageHead.vue";
import { formatChildAge } from "@/utils/childAge";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const data = ref(null);
const loading = ref(true);
const step = ref("pick");
const child = ref(null);
const index = ref(0);
const answers = ref({});
const saving = ref(false);
const result = ref(null);
const showAnswers = ref(false);
const booking = ref(false);

const question = computed(() => data.value.questions[index.value]);
const complete = computed(() => data.value.questions.every((q) => answers.value[q.id] !== undefined));

// quiet: refresh the list (after a new result) without hiding the page.
async function load(quiet = false) {
  if (!quiet) loading.value = true;
  const { data: res } = await axios.get("/api/parent/mchat");
  data.value = res.data;
  loading.value = false;
}

function start(picked) {
  child.value = picked;
  answers.value = {};
  index.value = 0;
  step.value = "questions";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function answer(yes) {
  answers.value = { ...answers.value, [question.value.id]: yes };
  // On to the next unanswered question; the last one waits for «show the result».
  if (index.value < data.value.questions.length - 1) setTimeout(() => (index.value += 1), 180);
}

function back() {
  if (index.value > 0) index.value -= 1;
  else step.value = "pick";
}

async function submit() {
  saving.value = true;
  try {
    const { data: res } = await axios.post("/api/parent/mchat", { child_id: child.value.id, answers: answers.value });
    result.value = res.data;
    step.value = "result";
    showAnswers.value = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    load(true);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: error.response?.data?.message ?? t("ai.chat_error"), life: 4000 });
  } finally {
    saving.value = false;
  }
}

async function open(id) {
  const { data: res } = await axios.get(`/api/parent/mchat/${id}`);
  result.value = res.data;
  showAnswers.value = false;
  step.value = "result";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function reset() {
  result.value = null;
  step.value = "pick";
  router.replace({ name: "parent-mchat" }).catch(() => {});
}

// As on «أطفالي»: a child without an active booking books a consultation, otherwise asks for a meeting.
async function book() {
  booking.value = true;
  try {
    const { data: res } = await axios.get(`/api/child/${result.value.child_id}/check-active-booking`);
    router.push({ name: res.active ? "request-meeting" : "BookingTime", params: { child_id: result.value.child_id } });
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("check_booking_failed"), life: 4000 });
  } finally {
    booking.value = false;
  }
}

onMounted(async () => {
  await load();
  // Opened on a child (from the assistant or a child card): start right away.
  const picked = data.value.children.find((c) => String(c.id) === String(route.params.child_id ?? ""));
  if (picked) start(picked);
});
</script>

<style scoped>
.pm-card {
  box-shadow: 0 6px 24px rgb(var(--bp-135c65) / 0.06);
}
.pm-note {
  background: rgb(var(--bp-f0f7f8));
  color: rgb(var(--bp-135c65));
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  line-height: 1.8;
}
.pm-child {
  position: relative;
  transition: border-color 0.15s, transform 0.15s;
}
.pm-child:hover {
  border-color: rgb(var(--bp-135c65));
  transform: translateY(-2px);
}
.pm-go {
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  margin-top: 0.75rem;
  color: #ff2a5b;
  font-weight: 700;
}
.pm-history {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.pm-answer {
  padding: 1rem;
  border-radius: 14px;
  border: 2px solid #d6e4e6;
  font-size: 1.15rem;
  font-weight: 700;
  color: rgb(var(--bp-135c65));
  background: #fff;
  transition: background 0.15s, border-color 0.15s;
}
.pm-answer:hover {
  border-color: rgb(var(--bp-135c65));
}
.pm-answer--on {
  background: rgb(var(--bp-135c65));
  border-color: rgb(var(--bp-135c65));
  color: #fff;
}
.pm-score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.2rem;
  margin-top: 1rem;
}
.pm-score b {
  font-size: 4rem;
  line-height: 1;
}
.pm-score small {
  font-size: 1.3rem;
  color: #94a3b8;
}
.pm-risk {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
}
.pm-risk--big {
  margin-top: 0.75rem;
  font-size: 1.1rem;
  padding: 0.35rem 1rem;
}
.pm-risk--low,
.pm-score--low b {
  color: #15803d;
}
.pm-risk--medium,
.pm-score--medium b {
  color: #b45309;
}
.pm-risk--high,
.pm-score--high b {
  color: #b91c1c;
}
.pm-risk--low {
  background: #dcfce7;
}
.pm-risk--medium {
  background: #fef3c7;
}
.pm-risk--high {
  background: #fee2e2;
}
.pm-row {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid #eef2f3;
  line-height: 1.7;
}
.pm-row:last-child {
  border-bottom: 0;
}
.pm-slide-enter-active,
.pm-slide-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.pm-slide-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}
.pm-slide-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
