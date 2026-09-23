<template>
  <Nave />
  <Toast />
  <Banner :heading="$t('bookings')" :title="$t('bookings_page_hint')"></Banner>

  <div class="max-w-[1300px] mx-auto py-10">
    <div class="flex justify-between px-4">
      <h3 class="font-bold text-2xl text-[#303843]">{{ $t("bookings") }}</h3>
      <button @click="AddBooking" class="create text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        {{ $t("Add_new_booking") }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 px-4">
      <div class="booking-card" v-for="book in booking" :key="book.id">
        <div class="card-content">
          <!-- Front Side -->
          <div class="card-front p-6 text-center bg-gradient-to-r from-[#74dbc5] to-[#618990] flex flex-col justify-between bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div>
              <div class="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-md border-2 border-white">
                <img :src="book?.user_image" alt="User Image" class="w-full h-full object-cover">
              </div>
              <h3 class="mt-3 font-bold text-lg text-gray-800">{{ book?.user_name }}</h3>
              <p class="text-sm text-gray-600">{{ book?.user_title }}</p>
              <p class="text-lg py-1 text-blue-600">{{ moment(book?.event_date).format("DD-MM-YY") }}</p>
              <p class="text-lg py-1 text-gray-700">{{ moment.parseZone(book?.event_date).format("hh:mm A") }}</p>
              <p v-if="book?.accepted == -1" class="px-2 py-2 bg-yellow-400 text-white rounded-lg font-medium mt-2">{{ $t("انتظار") }}</p>
              <p v-if="book?.accepted == 1" class="px-2 py-2 bg-green-700 text-white rounded-lg font-medium mt-2">{{ $t("مقبول") }}</p>
              <p v-if="book?.accepted == 0" class="px-2 py-2 bg-red-700 text-white rounded-lg font-medium mt-2">{{ $t("مرفوض") }}</p>
            </div>
          </div>

          <!-- Back Side -->
          <div class="card-back p-6 text-center bg-gradient-to-r from-[#ffff] to-[#ED5586] rounded-lg shadow-lg">
            <button v-if="book?.status == 1" @click="showConsultationResult(book)" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {{ $t("نتيجة الاستشارة") }}
            </button>
            <div v-else class="mt-4 text-gray-700">
              <div class="mb-2">
                <label class="font-semibold text-gray-600">{{ $t("تعليمات الاستشارة") }}:</label>
                <p class="mt-1 italic text-gray-500">{{ book.consultation_settings }}</p>
              </div>

              <div>
                <label class="font-semibold text-gray-600">{{ $t("ملاحظات المستشار") }}:</label>
                <p class="mt-1 italic text-gray-500">{{ book.accepted_notes }}</p>
              </div>
            </div>
            <button v-if="book.accepted !=1" @click="confirmDelete(book.booking_id)" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              {{ $t("إلغاء الحجز") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <Dialog v-model:visible="deleteDialogVisible" modal :header="$t('إلغاء الحجز')" :style="{ width: '400px', maxWidth: '92vw' }">
    <p class="text-lg text-gray-700">{{ $t("confirm_cancel_booking") }}</p>
    <template #footer>
      <Button :label="$t('back')" icon="pi pi-times" @click="deleteDialogVisible = false" variant="text" />
      <Button :label="$t('confirm_cancel')" icon="pi pi-check" @click="deleteBooking" severity="danger" />
    </template>
  </Dialog>

  <!-- Consultation Result Modal -->
  <Dialog v-model:visible="consultationResultDialogVisible" modal :header="$t('نتيجة الاستشارة')" :style="{ width: '600px', maxWidth: '92vw' }">
    <div v-if="selectedConsultationResult" id="consultation-result-content" ref="resultContent" class="consultation-result">
      <header class="cr-header">
        <p class="cr-caption">{{ $t("نتيجة الاستشارة") }}</p>
        <h2 class="cr-child">{{ selectedConsultationResult.child_name }}</h2>
        <div class="cr-meta">
          <span class="cr-chip"><span class="cr-chip-label">{{ $t("consultation_date") }}</span><span dir="ltr">{{ moment(selectedConsultationResult.event_date).format("DD-MM-YYYY") }}</span></span>
          <span v-if="selectedConsultationResult.user_name" class="cr-chip"><span class="cr-chip-label">{{ $t("consultant_label") }}</span>{{ selectedConsultationResult.user_name }}</span>
        </div>
      </header>

      <section v-if="result.health" class="cr-section">
        <h3 class="cr-label">{{ $t("التوصييات الصحية والنمائية") }}</h3>
        <p class="cr-text">{{ fillChildName(result.health) }}</p>
      </section>

      <section v-if="result.consultant_recommendations" class="cr-section">
        <h3 class="cr-label">{{ $t("توصييات المستشار") }}</h3>
        <p class="cr-text">{{ fillChildName(result.consultant_recommendations) }}</p>
      </section>

      <section v-if="homeRecommendations.length" class="cr-section">
        <h3 class="cr-label">{{ $t("التوصييات المزلية") }}</h3>
        <ol class="cr-list">
          <li v-for="(item, index) in homeRecommendations" :key="item.id ?? index">{{ fillChildName(item.value) }}</li>
        </ol>
      </section>

      <section v-if="result.notes" class="cr-section">
        <h3 class="cr-label">{{ $t("ملاحظات المستشار") }}</h3>
        <p class="cr-text">{{ fillChildName(result.notes) }}</p>
      </section>

      <p v-if="!hasResult" class="cr-empty">{{ $t("no_records_found") }}</p>
    </div>
    <template #footer>
      <Button :label="$t('print')" icon="pi pi-print" @click="printConsultationResult" variant="text" />
      <Button :label="$t('export_pdf')" icon="pi pi-file-pdf" @click="exportConsultationResultAsPDF" severity="success" />
      <Button :label="$t('close')" icon="pi pi-times" @click="consultationResultDialogVisible = false" variant="text" />
    </template>
  </Dialog>

  <About />
</template>

<script setup>
import Nave from "../components/Nave.vue";
import About from "../components/About.vue";
import moment from "moment";
import axios from "axios";
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import html2pdf from "html2pdf.js";
import Banner from '../components/Banner.vue';
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import { useStyleTag } from "@vueuse/core";

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const booking = ref([]);
const deleteDialogVisible = ref(false);
const bookingToDelete = ref(null);
const consultationResultDialogVisible = ref(false);
const selectedConsultationResult = ref(null);
const resultContent = ref(null);

// Shared by the dialog and the print frame, so the printed copy matches the screen. Literal colours
// because the print frame and html2pdf do not see the site's CSS variables.
const resultStyles = `
.consultation-result{color:#1e293b;line-height:1.8;display:grid;gap:14px}
.cr-header{background:#eef8f9;border-radius:14px;padding:16px 18px}
.cr-caption{margin:0;color:#135c65;font-size:13px;font-weight:600}
.cr-child{margin:2px 0 10px;font-size:20px;font-weight:700;color:#0e464d}
.cr-meta{display:flex;flex-wrap:wrap;gap:8px}
.cr-chip{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid #d5e7e9;border-radius:999px;padding:3px 12px;font-size:13px}
.cr-chip-label{color:#64748b}
.cr-section{border:1px solid #e2e8f0;border-inline-start:4px solid #135c65;border-radius:12px;padding:12px 16px;break-inside:avoid}
.cr-label{margin:0 0 6px;font-size:15px;font-weight:700;color:#135c65}
.cr-text{margin:0;white-space:pre-line}
.cr-list{margin:0;padding-inline-start:22px;display:grid;gap:6px}
.cr-list li::marker{color:#135c65;font-weight:700}
.cr-empty{margin:0;text-align:center;color:#64748b;padding:24px}
`;
useStyleTag(resultStyles);

// Older rows hold the result as JSON text, some encoded twice; decode until it is an object.
const parseResult = (value) => {
  let parsed = value;
  for (let i = 0; i < 3 && typeof parsed === "string"; i++) {
    try { parsed = JSON.parse(parsed); } catch { return {}; }
  }
  return parsed && typeof parsed === "object" ? parsed : {};
};
const result = computed(() => parseResult(selectedConsultationResult.value?.consultation_result));
const homeRecommendations = computed(() => (Array.isArray(result.value.filed_value) ? result.value.filed_value : [])
  .filter((item) => item?.value));
const hasResult = computed(() => Boolean(result.value.health || result.value.consultant_recommendations
  || result.value.notes || homeRecommendations.value.length));

const getAllBooking = () => {
  axios
    .get("/api/calender/appointments")
    .then((res) => {
      booking.value = res.data.bookings;
    })
    .catch((err) => {
      console.error(err);
    });
};

const AddBooking = () => {
  router.push({ name: "clidreen_parents" });
};

const confirmDelete = (id) => {
  bookingToDelete.value = id;
  deleteDialogVisible.value = true;
};

const deleteBooking = () => {
  if (bookingToDelete.value) {
    axios
      .delete(`/api/calender/appointments/${bookingToDelete.value}`)
      .then(() => {
        getAllBooking(); // Refresh the list after deletion
        deleteDialogVisible.value = false;
        toast.add({ severity: "success", summary: t("success_message"), detail: t("booking_cancelled"), life: 3000 });
      })
      .catch(() => {
        toast.add({ severity: "error", summary: t("error"), detail: t("booking_cancel_failed"), life: 4000 });
      });
  }
};

// Recommendation templates use {{ ... }} as the child's name placeholder.
const fillChildName = (text) => {
  if (!text) return "";
  const name = selectedConsultationResult.value?.child_name || t("your_child");
  return String(text).replace(/\{\{.*?\}\}/g, name);
};

const showConsultationResult = (book) => {
  selectedConsultationResult.value = book;
  consultationResultDialogVisible.value = true;
};

// Print only the result, in a throwaway frame that keeps the page direction.
const printConsultationResult = () => {
  const content = resultContent.value;
  if (!content) return;
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  Object.assign(frame.style, { position: "fixed", width: "0", height: "0", border: "0", right: "0", bottom: "0" });
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  doc.open();
  doc.write(`<!doctype html><html dir="${document.documentElement.dir || "rtl"}" lang="${document.documentElement.lang || "ar"}"><head><meta charset="utf-8"><title>${t("نتيجة الاستشارة")}</title>
<style>body{font-family:system-ui,"Segoe UI",Tahoma,sans-serif;padding:24px}${resultStyles}</style>
</head><body>${content.innerHTML}</body></html>`);
  doc.close();
  frame.contentWindow.focus();
  frame.contentWindow.print();
  setTimeout(() => frame.remove(), 1000);
};

const exportConsultationResultAsPDF = () => {
  const element = resultContent.value;
  if (!element) return;
  const childName = (selectedConsultationResult.value?.child_name || "consultation").replace(/\s+/g, "_");
  html2pdf()
    .set({
      margin: 10,
      filename: `consultation_result_${childName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save()
    .catch(() => {
      toast.add({ severity: "error", summary: t("error"), detail: t("request_failed_retry"), life: 4000 });
    });
};

onMounted(() => {
  getAllBooking();
});
</script>

<style scoped>
.banner {
  background-size: cover;
  background-position: center;
}

.booking-card {
  perspective: 1000px;
  width: 100%;
  height: 300px;
}

.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.booking-card:hover .card-content {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.card-front {
  backdrop-filter: blur(10px);
}

.card-back {
  backdrop-filter: blur(10px);
  transform: rotateY(180deg);
}

.create {
  background-color: #3b82f6;
}

.create:hover {
  background-color: #2563eb;
}
</style>