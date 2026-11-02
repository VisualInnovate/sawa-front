<script setup>
// «توصيات برنامج الحمام»: before a training program opens, the behaviour department says whether the child is ready
// (or has behaviour problems that stop it) and the speech department says how the child requests.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { CONSULT_SEVERITY, ageText, errorText, useToiletMeta } from "@/utils/toilet";

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const meta = useToiletMeta();
const seesPrograms = can("toilet program list");

const rows = ref([]);
const pending = ref(0);
const state = ref("pending");
const loading = ref(false);
const states = computed(() => [
  { value: "pending", label: t("toilet.pending_tab") },
  { value: "answered", label: t("toilet.answered_tab") },
  { value: "all", label: t("toilet.state_all") },
]);

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/toilet-consults", { params: { state: state.value } });
    rows.value = data.data;
    pending.value = data.pending;
  } finally {
    loading.value = false;
  }
}

const current = ref(null);
const form = ref({});
function openRow(row) {
  current.value = row;
  form.value = { status: row.status === "pending" ? null : row.status, request_skill: row.request_skill, note: row.note ?? "" };
}
const statuses = computed(() => ["ready", "not_ready"].map((value) => ({ value, label: t(`toilet.consult_${value}`) })));
const skills = computed(() => (meta.value?.speech_skills ?? []).map((value) => ({ value, label: t(`toilet.skill_${value}`) })));
const valid = computed(() => form.value.status && (current.value?.department !== "speech" || form.value.request_skill)
  && (form.value.status !== "not_ready" || form.value.note.trim()));
const locked = computed(() => !["assessment", "dryness", "consent"].includes(current.value?.program_status));

const saving = ref(false);
async function save() {
  saving.value = true;
  try {
    await axios.put(`api/toilet-consults/${current.value.id}`, form.value);
    toast.add({ severity: "success", summary: t("toilet.answered"), life: 2500 });
    current.value = null;
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await load();
  const id = Number(route.query.id);
  if (id) {
    const row = rows.value.find((r) => r.id === id);
    if (row) openRow(row);
  }
});
watch(() => route.query.id, async (id) => {
  if (!id) return;
  if (!rows.value.some((r) => r.id === Number(id))) {
    state.value = "all";
    await load();
  }
  const row = rows.value.find((r) => r.id === Number(id));
  if (row) openRow(row);
});
</script>

<template>
  <div class="sawa-card p-3">
    <Toast />
    <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div>
        <p class="text-xl text-bp-135c65 font-bold m-0"><i class="pi pi-comments" aria-hidden="true" /> {{ $t("toilet.consults_menu") }}</p>
        <small class="text-slate-500">{{ $t("toilet.consults_lead") }}</small>
      </div>
      <Button icon="pi pi-refresh" variant="outlined" :loading="loading" :aria-label="$t('refresh')" @click="load" />
    </div>
    <SelectButton v-model="state" :options="states" optionLabel="label" optionValue="value" :allowEmpty="false" class="mb-3" @change="load">
      <template #option="{ option }"><span>{{ option.label }}</span><Badge v-if="option.value === 'pending' && pending" :value="pending" severity="warn" class="ms-1" /></template>
    </SelectButton>

    <DataTable :value="rows" :loading="loading" dataKey="id" stripedRows rowHover responsiveLayout="scroll" class="cursor-pointer" @row-click="openRow($event.data)">
      <template #empty><p class="text-center text-slate-500 py-6">{{ $t("toilet.consults_empty") }}</p></template>
      <Column :header="$t('toilet.child')"><template #body="{ data }"><b>{{ data.child }}</b><br /><small class="text-slate-500">{{ ageText($t, data.age_months) }}</small></template></Column>
      <Column :header="$t('toilet.department')"><template #body="{ data }">{{ $t(`toilet.dept_${data.department}`) }}</template></Column>
      <Column :header="$t('toilet.therapist')" field="therapist" />
      <Column :header="$t('toilet.created_at')"><template #body="{ data }"><span class="ltr">{{ data.created_at }}</span></template></Column>
      <Column :header="$t('status')">
        <template #body="{ data }">
          <Tag :severity="CONSULT_SEVERITY[data.status]" :value="$t(`toilet.consult_${data.status}`)" />
          <small v-if="data.request_skill" class="block text-slate-600 mt-1">{{ $t(`toilet.skill_${data.request_skill}`) }}</small>
        </template>
      </Column>
    </DataTable>

    <Dialog :visible="!!current" modal :header="current ? `${current.child} · ${$t(`toilet.dept_${current.department}`)}` : ''" :style="{ width: '34rem' }"
            :breakpoints="{ '768px': '95vw' }" @update:visible="current = null; route.query.id && router.replace({ query: {} })">
      <div v-if="current" class="flex flex-col gap-3">
        <p class="m-0 font-semibold">{{ $t(`toilet.q_${current.department}`) }}</p>
        <div class="flex flex-col gap-1">
          <span>{{ $t("toilet.answer") }}</span>
          <SelectButton v-model="form.status" :options="statuses" optionLabel="label" optionValue="value" :disabled="locked" />
        </div>
        <div v-if="current.department === 'speech'" class="flex flex-col gap-1">
          <span>{{ $t("toilet.skill") }}</span>
          <SelectButton v-model="form.request_skill" :options="skills" optionLabel="label" optionValue="value" :disabled="locked" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="tc-note">{{ form.status === "not_ready" ? $t("toilet.not_ready_reason") : $t("toilet.note") }}</label>
          <Textarea id="tc-note" v-model="form.note" rows="3" autoResize maxlength="2000" :disabled="locked" fluid />
        </div>
        <small v-if="current.answered_by" class="text-slate-500">{{ current.answered_by }} · <span class="ltr">{{ current.answered_at }}</span></small>
      </div>
      <template #footer>
        <Button v-if="seesPrograms && current" variant="text" icon="pi pi-external-link" :label="$t('toilet.view_program')" class="me-auto"
                @click="router.push({ name: 'toilet-program', params: { id: current.program_id } })" />
        <Button variant="outlined" :label="$t('close')" @click="current = null" />
        <Button v-if="!locked" icon="pi pi-send" :label="$t('toilet.send_answer')" :loading="saving" :disabled="!valid" @click="save" />
      </template>
    </Dialog>
  </div>
</template>
