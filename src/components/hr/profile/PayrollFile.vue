<script setup>
// «ملف الراتب» on the employee's profile: what the monthly run takes from the employee — the English name for the
// bank file, bank or cheque and the account, social insurance (Jordan: the insurance salary; Saudi Arabia:
// nationality and GOSI registration), allowances, the monthly health insurance / life fund / tax, the fixed extra
// and where the extras are paid, leave settings, notes and a follow-up flag.
import axios from "axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const props = defineProps({ employee: { type: Object, required: true }, summary: { type: Object, required: true }, userId: { type: [Number, String], required: true }, archived: Boolean });
const emit = defineEmits(["saved"]);
const { t, locale } = useI18n();
const toast = useToast();

const saudi = computed(() => props.summary.country === "SA");
const e = computed(() => props.employee);
const currency = computed(() => (props.summary.profile?.currency_code === "SAR" ? t("vac.sar") : t("vac.jod")));
const money = (v) => Number(v ?? 0).toLocaleString("en", { maximumFractionDigits: 2 });

const banks = ref([]);
const form = ref(null);
const error = ref("");
const FIELDS = ["insured", "bank_id", "iban", "name_en", "insurance_salary", "health_insurance", "life_fund", "income_tax", "fixed_extra", "fixed_extra_note", "extra_paid",
  "payment_method", "branch_code", "account_number", "payroll_notes", "flagged", "leave_exempt", "leave_taken_before", "citizen", "gosi_registered_on",
  "housing_allowance", "transport_allowance", "other_allowance"];

async function open() {
  form.value = Object.fromEntries(FIELDS.map((k) => [k, e.value[k] ?? null]));
  form.value.gosi_registered_on = e.value.gosi_registered_on ? new Date(e.value.gosi_registered_on) : null;
  error.value = "";
  if (!banks.value.length) banks.value = (await axios.get("api/employee-profile/banks")).data.data;
}
async function save() {
  const f = form.value;
  const pad = (n) => String(n).padStart(2, "0");
  const date = f.gosi_registered_on ? `${f.gosi_registered_on.getFullYear()}-${pad(f.gosi_registered_on.getMonth() + 1)}-${pad(f.gosi_registered_on.getDate())}` : null;
  try {
    await axios.post(`api/employee-profile/${props.userId}/payroll-info`, { ...f, iban: f.iban?.trim() || null, gosi_registered_on: date });
    form.value = null;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("prof.pay_saved"), life: 2500 });
    emit("saved");
  } catch (err) {
    const code = err.response?.data?.errors?.iban?.[0];
    error.value = code === "hr.iban" ? t("prof.iban_invalid") : errorText(err);
  }
}
const bankName = (b) => (locale.value === "ar" ? b.name_ar : b.name_en || b.name_ar);
</script>

<template>
  <section class="sawa-card p-4">
    <div class="flex items-center justify-between gap-2 mb-3">
      <p class="font-bold m-0">
        <i v-if="e.flagged" class="pi pi-flag-fill text-red-500 me-1" v-tooltip.top="$t('pfile.flagged')" />{{ $t("pfile.title") }}
      </p>
      <Button v-if="!archived && can('employees edit')" :label="$t('edit')" icon="pi pi-pencil" text size="small" @click="open" />
    </div>
    <dl class="prof-dl">
      <dt>{{ $t("pfile.payment_method") }}</dt>
      <dd>{{ e.payment_method === "cheque" ? $t("run.pm_cheque") : summary.bank || $t("run.pm_bank") }}</dd>
      <template v-if="e.payment_method !== 'cheque'">
        <dt>IBAN</dt><dd><bdi dir="ltr">{{ e.iban || e.account_number || "—" }}</bdi></dd>
      </template>
      <dt>{{ $t("prof.insured") }}</dt>
      <dd>
        <template v-if="e.insured === false">{{ $t("prof.insured_no") }}</template>
        <template v-else-if="saudi">{{ e.citizen ? $t("pfile.saudi") : $t("pfile.non_saudi") }}<small v-if="e.gosi_registered_on" class="text-color-secondary"> · <bdi dir="ltr">{{ e.gosi_registered_on }}</bdi></small></template>
        <template v-else>{{ e.insurance_salary === null ? $t("pfile.insurance_on_basic") : money(e.insurance_salary) + " " + currency }}</template>
        <small v-if="!summary.insurance_enabled" class="block text-color-secondary">{{ $t("prof.insurance_off") }}</small>
      </dd>
      <template v-if="saudi && (e.housing_allowance || e.transport_allowance || e.other_allowance)">
        <dt>{{ $t("pfile.allowances") }}</dt>
        <dd>{{ money(e.housing_allowance + e.transport_allowance + e.other_allowance) }} {{ currency }}</dd>
      </template>
      <template v-if="e.health_insurance || e.life_fund || e.income_tax">
        <dt>{{ $t("pfile.monthly_cuts") }}</dt>
        <dd>{{ money(e.health_insurance + e.life_fund + (summary.income_tax_enabled ? e.income_tax : 0)) }} {{ currency }}</dd>
      </template>
      <template v-if="e.fixed_extra">
        <dt>{{ $t("run.c.fixed_extra") }}</dt>
        <dd>{{ money(e.fixed_extra) }} {{ currency }} <small class="text-color-secondary">· {{ $t(`run.ep_${e.extra_paid}`) }}</small></dd>
      </template>
      <template v-if="summary.leave?.accrued !== null && summary.leave?.accrued !== undefined && !e.leave_exempt">
        <dt>{{ $t("pfile.leave_earned") }}</dt>
        <dd>{{ $t("pfile.leave_earned_value", { days: summary.leave.accrued, months: summary.leave.months }) }}</dd>
      </template>
      <template v-if="e.leave_exempt"><dt>{{ $t("pfile.leaves") }}</dt><dd>{{ $t("pfile.leave_exempt") }}</dd></template>
    </dl>
    <p v-if="e.payroll_notes" class="text-sm mt-2 mb-0 pfile-note"><i class="pi pi-comment me-1" />{{ e.payroll_notes }}</p>
  </section>

  <Dialog :visible="!!form" modal :header="$t('pfile.title')" :style="{ width: '760px' }" :breakpoints="{ '820px': '96vw' }" @update:visible="form = null">
    <div v-if="form" class="flex flex-column gap-4">
      <fieldset class="pfile-group">
        <legend>{{ $t("pfile.g_payment") }}</legend>
        <div class="pfile-grid">
          <div class="flex flex-column gap-1">
            <label for="pf-name-en">{{ $t("pfile.name_en") }}</label>
            <InputText id="pf-name-en" v-model="form.name_en" dir="ltr" class="text-start" maxlength="255" />
          </div>
          <div class="flex flex-column gap-1">
            <label>{{ $t("pfile.payment_method") }}</label>
            <SelectButton v-model="form.payment_method" :options="['bank', 'cheque']" :optionLabel="(o) => $t(`run.pm_${o}`)" :allowEmpty="false" />
          </div>
          <template v-if="form.payment_method === 'bank'">
            <div class="flex flex-column gap-1">
              <label for="pf-bank">{{ $t("slip.bank") }}</label>
              <Select inputId="pf-bank" v-model="form.bank_id" :options="banks" optionValue="id" :optionLabel="bankName" filter showClear />
            </div>
            <div class="flex flex-column gap-1">
              <label for="pf-branch">{{ $t("pfile.branch_code") }}</label>
              <InputText id="pf-branch" v-model="form.branch_code" dir="ltr" class="text-start" maxlength="20" />
            </div>
            <div class="flex flex-column gap-1">
              <label for="pf-iban">IBAN</label>
              <InputText id="pf-iban" v-model="form.iban" dir="ltr" class="text-start" maxlength="40" :invalid="!!error" />
              <small v-if="error" class="text-red-500">{{ error }}</small>
              <small v-else class="text-color-secondary">{{ $t("prof.iban_hint", { prefix: summary.profile?.iban_prefix, length: summary.profile?.iban_length }) }}</small>
            </div>
            <div class="flex flex-column gap-1">
              <label for="pf-account">{{ $t("pfile.account_number") }}</label>
              <InputText id="pf-account" v-model="form.account_number" dir="ltr" class="text-start" maxlength="40" />
            </div>
          </template>
        </div>
      </fieldset>

      <fieldset class="pfile-group">
        <legend>{{ $t(saudi ? "pfile.g_gosi" : "pfile.g_ssc") }}</legend>
        <div class="pfile-grid">
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="form.insured" inputId="pf-insured" />
            <label for="pf-insured">{{ $t("prof.insured_label") }}</label>
          </div>
          <template v-if="saudi">
            <div class="flex flex-column gap-1">
              <label>{{ $t("pfile.nationality") }}</label>
              <SelectButton v-model="form.citizen" :options="[true, false]" :optionLabel="(o) => (o ? $t('pfile.saudi') : $t('pfile.non_saudi'))" :allowEmpty="false" />
            </div>
            <div class="flex flex-column gap-1">
              <label for="pf-gosi">{{ $t("pfile.gosi_registered_on") }}</label>
              <DatePicker v-model="form.gosi_registered_on" inputId="pf-gosi" dateFormat="yy-mm-dd" showIcon showButtonBar />
              <small class="text-color-secondary">{{ $t("pfile.gosi_hint") }}</small>
            </div>
          </template>
          <div v-else class="flex flex-column gap-1">
            <label for="pf-ins-salary">{{ $t("run.c.insurance_salary") }}</label>
            <InputNumber v-model="form.insurance_salary" inputId="pf-ins-salary" :maxFractionDigits="2" :suffix="` ${currency}`" fluid />
            <small class="text-color-secondary">{{ $t("pfile.insurance_salary_hint") }}</small>
          </div>
        </div>
      </fieldset>

      <fieldset class="pfile-group">
        <legend>{{ $t("pfile.g_monthly") }}</legend>
        <div class="pfile-grid">
          <div v-for="k in [...(saudi ? ['housing_allowance', 'transport_allowance', 'other_allowance'] : []), 'health_insurance', 'life_fund', ...(summary.income_tax_enabled ? ['income_tax'] : [])]"
            :key="k" class="flex flex-column gap-1">
            <label :for="`pf-${k}`">{{ $t(`pfile.${k}`) }}</label>
            <InputNumber v-model="form[k]" :inputId="`pf-${k}`" :min="0" :maxFractionDigits="2" :suffix="` ${currency}`" fluid />
          </div>
          <div class="flex flex-column gap-1">
            <label for="pf-fixed">{{ $t("run.c.fixed_extra") }}</label>
            <InputNumber v-model="form.fixed_extra" inputId="pf-fixed" :min="0" :maxFractionDigits="2" :suffix="` ${currency}`" fluid />
          </div>
          <div class="flex flex-column gap-1">
            <label for="pf-fixed-note">{{ $t("run.fixed_extra_note") }}</label>
            <InputText id="pf-fixed-note" v-model="form.fixed_extra_note" maxlength="255" :placeholder="$t('pfile.fixed_extra_example')" />
          </div>
          <div class="flex flex-column gap-1">
            <label>{{ $t("run.extra_paid") }}</label>
            <SelectButton v-model="form.extra_paid" :options="['salary', 'separate']" :optionLabel="(o) => $t(`run.ep_${o}`)" :allowEmpty="false" />
          </div>
        </div>
      </fieldset>

      <fieldset class="pfile-group">
        <legend>{{ $t("pfile.leaves") }}</legend>
        <div class="pfile-grid">
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="form.leave_exempt" inputId="pf-exempt" />
            <label for="pf-exempt">{{ $t("pfile.leave_exempt_label") }}</label>
          </div>
          <div class="flex flex-column gap-1">
            <label for="pf-taken">{{ $t("pfile.leave_taken_before") }}</label>
            <InputNumber v-model="form.leave_taken_before" inputId="pf-taken" :maxFractionDigits="2" :suffix="` ${$t('pfile.days')}`" fluid :disabled="form.leave_exempt" />
          </div>
        </div>
      </fieldset>

      <fieldset class="pfile-group">
        <legend>{{ $t("pfile.g_notes") }}</legend>
        <div class="flex flex-column gap-2">
          <Textarea v-model="form.payroll_notes" rows="2" autoResize maxlength="2000" :placeholder="$t('pfile.notes_example')" />
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="form.flagged" inputId="pf-flag" />
            <label for="pf-flag">{{ $t("pfile.flag_label") }}</label>
          </div>
        </div>
      </fieldset>
    </div>
    <template #footer>
      <Button :label="$t('cancel')" text severity="secondary" @click="form = null" />
      <Button icon="pi pi-check" :label="$t('save')" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.prof-dl { display: grid; grid-template-columns: max-content 1fr; gap: 0.55rem 1.25rem; margin: 0; }
.prof-dl dt { color: var(--p-text-muted-color); font-size: 0.9rem; }
.prof-dl dd { margin: 0; font-weight: 500; overflow-wrap: anywhere; }
.pfile-group { border: 1px solid var(--p-content-border-color); border-radius: 12px; padding: 0.75rem 1rem 1rem; margin: 0; }
.pfile-group legend { padding: 0 0.4rem; font-weight: 700; color: var(--p-primary-color); }
.pfile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; align-items: start; }
.pfile-note { background: var(--p-surface-50, #f8fafc); border-radius: 10px; padding: 0.5rem 0.75rem; }
</style>
