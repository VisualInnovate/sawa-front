<script setup>
// The student programs (inclusion / day / clinics); old programs from the removed «البرامج العلاجية» are hidden.
import { currency, programStatusSeverity } from "@/utils/accounting";
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from "@primevue/core/api";
import { money } from "@/utils/programFees";
import { programName } from "@/utils/studentPrograms";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const programs = ref([]);
const loading = ref(true);
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const removing = ref(null);

const rows = computed(() => programs.value.map((program) => ({
  ...program,
  student_name: program.student?.name,
  therapist_name: program.therapist?.name,
  program_name: programName(t, program),
})));

async function load() {
  loading.value = true;
  const { data } = await axios.get("api/student-program");
  programs.value = data.data;
  loading.value = false;
}

async function remove() {
  await axios.delete(`api/student-program/${removing.value.id}`);
  removing.value = null;
  toast.add({ severity: "success", summary: t("success_message"), detail: t("sp_deleted"), life: 2500 });
  load();
}

onMounted(load);
</script>

<template>
  <div class="sawa-card p-3">
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <p class="text-xl text-bp-135c65 font-bold">{{ $t("student_programe") }}</p>
      <div class="flex flex-wrap gap-2">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters.global.value" :placeholder="$t('search')" />
        </IconField>
        <Button v-can="'student program create'" icon="pi pi-plus" :label="$t('add_sp')" @click="router.push({ name: 'create-studentprograme' })" />
      </div>
    </div>
    <DataTable :value="rows" :loading="loading" dataKey="id" v-model:filters="filters" :globalFilterFields="['student_name', 'therapist_name', 'program_name']"
      paginator :rows="10" stripedRows>
      <Column field="student_name" :header="$t('sp_student')" sortable />
      <Column field="program_name" :header="$t('sp_program')" sortable>
        <template #body="{ data }"><Tag :value="data.program_name" severity="secondary" /></template>
      </Column>
      <Column field="therapist_name" :header="$t('sp_therapist')" sortable />
      <Column :header="$t('sp_period')">
        <template #body="{ data }"><span class="whitespace-nowrap">{{ data.start_date }} → {{ data.end_date }}</span></template>
      </Column>
      <Column field="weekly_sessions" :header="$t('sp_weekly_sessions')" />
      <Column :header="$t('acc.status')">
        <template #body="{ data }">
          <Tag :severity="programStatusSeverity[data.accounting_status]" :value="$t(`acc.program_status.${data.accounting_status}`)" />
          <i v-if="data.sessions_suspended_at" class="pi pi-pause text-red-600 ms-1" v-tooltip.top="$t('acc.suspended')" :aria-label="$t('acc.suspended')" />
        </template>
      </Column>
      <Column :header="$t('fees_price', { currency: currency.currency_name })">
        <template #body="{ data }">{{ money(data.price) }}</template>
      </Column>
      <Column header-style="width:10rem">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button icon="pi pi-eye" size="small" rounded variant="outlined" v-tooltip.top="$t('sp_details')" :aria-label="$t('sp_details')"
              @click="router.push({ name: 'show-studentprograme', params: { id: data.id } })" />
            <Button v-can="'student program edit'" icon="pi pi-pencil" size="small" rounded variant="outlined" severity="info" v-tooltip.top="$t('edit')" :aria-label="$t('edit')"
              @click="router.push({ name: 'update-studentprograme', params: { id: data.id } })" />
            <Button v-can="'student program delete'" icon="pi pi-trash" size="small" rounded variant="outlined" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')"
              @click="removing = data" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog :visible="!!removing" modal :header="$t('delete')" :style="{ width: '26rem' }" @update:visible="removing = null">
      <p>{{ $t("sp_delete_confirm") }}</p>
      <div class="flex justify-end gap-2 mt-3">
        <Button :label="$t('cancel')" severity="secondary" variant="outlined" @click="removing = null" />
        <Button :label="$t('delete')" severity="danger" @click="remove" />
      </div>
    </Dialog>
    <Toast />
  </div>
</template>
