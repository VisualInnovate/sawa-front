<script setup>
import axios from "axios";
import { computed, onActivated, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { getEvaluationTypeLabel } from "../utils/evaluationTypes";
import { REQUEST_STATUS, requestStatus } from "../utils/evaluationRequestStatus";
import { formatChildAge } from "../utils/childAge";
import { can } from "../utils/permissions";

// Consultations whose required evaluations still need appointments (the programs manager's list).
// `compact` (welcome page) shows only the pending ones, without the scope switch.
const props = defineProps({ compact: Boolean });

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const scope = ref("pending");
const rows = ref([]);
const loading = ref(false);
const search = ref("");
const expanded = ref({});
const cancelling = ref(null);
const cancelTarget = ref(null);

const scopes = computed(() => [
  { label: t("required_scope_pending"), value: "pending" },
  { label: t("required_scope_booked"), value: "booked" },
]);
const filtered = computed(() => {
  const term = search.value.trim().toLocaleLowerCase();
  return term ? rows.value.filter((row) => String(row.child?.name ?? "").toLocaleLowerCase().includes(term)) : rows.value;
});

const load = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get("api/required-evaluations", { params: { scope: scope.value, _ts: Date.now() } });
    rows.value = data.data ?? [];
  } catch {
    rows.value = [];
  } finally {
    loading.value = false;
  }
};

const typeLabel = (type) => getEvaluationTypeLabel(type, t, String(type));
const requiredLabel = (item) =>
  item.missing_dimensions?.length
    ? `${typeLabel(item.type)} (${t("required_dimensions_left", { count: item.missing_dimensions.length })})`
    : typeLabel(item.type);
const withChildName = (text, row) => String(text ?? "").replace(/\{\{.*?\}\}/g, row.child?.name ?? "");
const resultOf = (row) => row.consultation_result ?? {};
const recommendations = (row) => [...(resultOf(row).filed_value ?? [])]
  .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
const appointments = (row) => row.required.flatMap((item) => item.appointments);
const canCancel = (appointment) => Number(appointment.status) === REQUEST_STATUS.AWAITING && can("evaluation request delete");

const book = (row) => router.push({ name: "Calender", params: { id: row.child.id }, query: { bookingId: row.booking_id } });

const cancel = async () => {
  const appointment = cancelTarget.value;
  if (!appointment) return;
  cancelling.value = appointment.id;
  try {
    await axios.delete(`api/evaluation-request/${appointment.id}`);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("appointment_cancelled"), life: 3000 });
    cancelTarget.value = null;
    await load();
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("mission_error"), life: 3000 });
  } finally {
    cancelling.value = null;
  }
};

const changeScope = (value) => {
  if (!value || value === scope.value) return;
  scope.value = value;
  expanded.value = {};
  load();
};

onMounted(load);
onActivated(load);
</script>

<template>
  <div class="required-board">
    <header class="required-toolbar">
      <div>
        <h2>{{ t("required_evaluations") }}</h2>
        <p>{{ t("required_evaluations_hint") }}</p>
      </div>
      <div class="required-tools">
        <SelectButton v-if="!compact" :modelValue="scope" :options="scopes" optionLabel="label" optionValue="value"
          :allowEmpty="false" @update:modelValue="changeScope" />
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" :placeholder="t('child_name')" :aria-label="t('search')" />
        </IconField>
      </div>
    </header>

    <DataTable v-model:expandedRows="expanded" :value="filtered" :loading="loading" dataKey="booking_id"
      stripedRows responsiveLayout="scroll">
      <template #empty>
        <div class="required-empty"><i class="pi pi-inbox" /><p>{{ t("required_evaluations_empty") }}</p></div>
      </template>
      <Column expander style="width: 3rem" :pt="{ rowToggleButton: { 'aria-label': t('follow_details') } }" />
      <Column :header="t('child_name')">
        <template #body="{ data }">
          <span class="font-semibold">{{ data.child?.name }}</span>
          <small class="block text-gray-500">{{ formatChildAge(data.child?.birth_date, null, t) }}</small>
        </template>
      </Column>
      <Column :header="t('parent.phone')">
        <template #body="{ data }">
          <span class="block">{{ data.parent?.name || "—" }}</span>
          <a v-if="data.parent?.phone" :href="`tel:${data.parent.phone}`" dir="ltr" class="phone-link">{{ data.parent.phone }}</a>
        </template>
      </Column>
      <Column :header="t('consultant')">
        <template #body="{ data }">{{ data.consultant || "—" }}</template>
      </Column>
      <Column :header="t('consultation_date')">
        <template #body="{ data }"><span dir="ltr">{{ data.consultation_date || "—" }}</span></template>
      </Column>
      <Column :header="t('required_evaluations')">
        <template #body="{ data }">
          <div class="required-tags">
            <Tag v-for="item in data.required" :key="item.type" :severity="item.booked ? 'success' : 'warn'"
              :icon="item.booked ? 'pi pi-check' : 'pi pi-clock'" :value="requiredLabel(item)" />
          </div>
        </template>
      </Column>
      <Column :header="t('actions')" style="width: 11rem">
        <template #body="{ data }">
          <Button v-if="data.pending" v-can="'evaluation request create'" icon="pi pi-calendar-plus"
            :label="t('book_appointment')" size="small" @click="book(data)" />
        </template>
      </Column>

      <template #expansion="{ data }">
        <div class="required-details">
          <section>
            <h3><i class="pi pi-calendar" aria-hidden="true" /> {{ t("booked_appointments") }}</h3>
            <p v-if="!appointments(data).length" class="text-gray-500">{{ t("no_appointments_yet") }}</p>
            <ul v-else class="appointment-list">
              <li v-for="appointment in appointments(data)" :key="appointment.id">
                <div>
                  <strong>{{ typeLabel(appointment.evaluation_type) }}</strong>
                  <span class="appointment-meta">
                    <span dir="ltr">{{ appointment.date }} {{ appointment.start_time?.slice(0, 5) }}</span>
                    · {{ appointment.specialist || "—" }}
                  </span>
                </div>
                <Tag :severity="requestStatus(appointment.status).severity" :value="t(requestStatus(appointment.status).key)" />
                <Button v-if="canCancel(appointment)" icon="pi pi-times" severity="danger" variant="text" size="small"
                  :label="t('cancel_appointment')" :loading="cancelling === appointment.id" @click="cancelTarget = appointment" />
              </li>
            </ul>
          </section>
          <section>
            <h3><i class="pi pi-file" aria-hidden="true" /> {{ t("consultation_result") }}</h3>
            <dl class="result-list">
              <template v-if="resultOf(data).health">
                <dt>{{ t("health_development_history") }}</dt>
                <dd>{{ resultOf(data).health }}</dd>
              </template>
              <template v-if="resultOf(data).consultant_recommendations">
                <dt>{{ t("consultant_recommendations") }}</dt>
                <dd>{{ resultOf(data).consultant_recommendations }}</dd>
              </template>
              <template v-if="recommendations(data).length">
                <dt>{{ t("choose_home_recommendations") }}</dt>
                <dd>
                  <p v-for="(item, index) in recommendations(data)" :key="item.id ?? index">{{ withChildName(item.value, data) }}</p>
                </dd>
              </template>
              <template v-if="resultOf(data).notes">
                <dt>{{ t("additional_notes") }}</dt>
                <dd>{{ resultOf(data).notes }}</dd>
              </template>
            </dl>
            <p v-if="!data.consultation_result" class="text-gray-500">{{ t("no_consultation_result") }}</p>
          </section>
        </div>
      </template>
    </DataTable>

    <Dialog :visible="!!cancelTarget" modal :header="t('cancel_appointment')" :style="{ width: 'min(28rem, 92vw)' }"
      @update:visible="(value) => { if (!value) cancelTarget = null; }">
      <p>{{ t("cancel_appointment_confirm") }}</p>
      <template #footer>
        <Button :label="t('cancel')" severity="secondary" variant="text" @click="cancelTarget = null" />
        <Button :label="t('cancel_appointment')" severity="danger" icon="pi pi-times" :loading="cancelling !== null" @click="cancel" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.required-board { padding: clamp(.75rem, 2vw, 1.5rem); }
.required-toolbar, .required-tools { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.required-toolbar { justify-content: space-between; margin-bottom: 1.25rem; }
.required-toolbar h2 { margin: 0; font-size: 1.3rem; font-weight: 700; color: var(--sawa-primary, rgb(var(--bp-135c65))); }
.required-toolbar p { margin: .4rem 0 0; color: var(--sawa-muted, #64748b); font-size: .9rem; }
.required-tags { display: flex; flex-wrap: wrap; gap: .35rem; }
.required-empty { display: grid; justify-items: center; gap: .5rem; padding: 2rem 0; color: #64748b; }
.required-empty .pi { font-size: 1.8rem; }
.phone-link { color: var(--sawa-primary, rgb(var(--bp-135c65))); font-weight: 600; }
.required-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; padding: .5rem; }
.required-details h3 { display: flex; align-items: center; gap: .4rem; margin: 0 0 .75rem; font-size: 1rem; font-weight: 700; color: rgb(var(--bp-135c65)); }
.appointment-list { list-style: none; margin: 0; padding: 0; display: grid; gap: .5rem; }
.appointment-list li { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; padding: .6rem .75rem; border: 1px solid #e5eded; border-radius: 12px; background: #fff; }
.appointment-list li > div { flex: 1; min-width: 12rem; display: grid; }
.appointment-meta { font-size: .85rem; color: #64748b; }
.result-list { margin: 0; display: grid; gap: .35rem; }
.result-list dt { font-weight: 600; color: #374151; font-size: .9rem; }
.result-list dd { margin: 0 0 .5rem; color: #4b5563; font-size: .9rem; white-space: pre-line; }
.result-list dd p { margin: 0 0 .35rem; }
</style>
