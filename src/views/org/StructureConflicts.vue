<script setup>
// «تعارضات الهيكل»: where the structure does not hold together — employees whose role, type or department is not
// their job title's, heads whose title is not a head one (and the other way round), titles without a role, and old
// roles outside the structure that people still hold. Each employee can be brought in line with their title (or all
// at once), and an old role merged into a structure one (its people move to it, then it is deleted).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";
import { employeeTypeName } from "@/utils/employeeForm";

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const data = ref({ employees: [], positions_without_role: [], roles_outside: [], roles: [], accounts_without_employee: [] });
const loading = ref(true);
const busy = ref(null);
const editable = computed(() => can("org structure edit"));
const fixable = computed(() => data.value.employees.filter((row) => row.fixable));

async function load() {
  loading.value = true;
  try {
    data.value = (await axios.get("api/org-structure/conflicts")).data.data;
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  } finally {
    loading.value = false;
  }
}

function problemText(problem) {
  const value = (v) => (problem.code === "type" ? employeeTypeName(t, v) : v) || "—";
  return t(`stc.p_${problem.code}`, { has: value(problem.has), should: value(problem.should) });
}

async function fix(ids) {
  busy.value = ids ? `e${ids[0]}` : "all";
  try {
    const { data: result } = await axios.post("api/org-structure/conflicts/fix", ids ? { employee_ids: ids } : {});
    data.value = result.data;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("stc.fixed", { n: result.fixed }), life: 3000 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 5000 });
  } finally {
    busy.value = null;
  }
}
function fixAll() {
  confirm.require({
    message: t("stc.fix_all_confirm", { n: fixable.value.length }),
    header: t("stc.fix_all"),
    icon: "pi pi-exclamation-triangle",
    acceptLabel: t("yes"),
    rejectLabel: t("no"),
    accept: () => fix(null),
  });
}

// Merging an old role into a structure one.
const merging = ref(null);
const mergeInto = ref(null);
const mergeTargets = computed(() => data.value.roles.filter((role) => role.id !== merging.value?.id));
function openMerge(role) {
  merging.value = role;
  mergeInto.value = null;
}
async function merge() {
  busy.value = "merge";
  try {
    const { data: result } = await axios.post(`api/org-structure/roles/${merging.value.id}/merge`, { into_role_id: mergeInto.value });
    data.value = result.data;
    merging.value = null;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("stc.merged", { n: result.moved }), life: 3000 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 5000 });
  } finally {
    busy.value = null;
  }
}

const clean = computed(() => !loading.value && !data.value.employees.length && !data.value.positions_without_role.length && !data.value.roles_outside.length && !(data.value.accounts_without_employee ?? []).length);

onMounted(load);
</script>

<template>
  <div class="sawa-card p-3 flex flex-column gap-4">
    <Toast />
    <ConfirmDialog />
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("stc.title") }}</p>
        <small class="text-color-secondary">{{ $t("stc.subtitle") }}</small>
      </div>
      <div class="flex gap-2">
        <Button v-if="editable && fixable.length" icon="pi pi-check-square" :label="$t('stc.fix_all')" :loading="busy === 'all'" @click="fixAll" />
        <Button icon="pi pi-sitemap" :label="$t('org.menu')" severity="secondary" variant="outlined" @click="$router.push({ name: 'org-structure' })" />
        <Button icon="pi pi-refresh" variant="text" :loading="loading" @click="load" v-tooltip.top="$t('refresh_data')" :aria-label="$t('refresh_data')" />
      </div>
    </div>

    <Message v-if="clean" severity="success" :closable="false">{{ $t("stc.clean") }}</Message>

    <!-- Employees -->
    <section v-if="loading || data.employees.length">
      <p class="font-bold text-lg mb-2">{{ $t("stc.employees_title") }} <Tag v-if="!loading" :value="String(data.employees.length)" severity="warn" /></p>
      <DataTable :value="data.employees" :loading="loading" dataKey="id" size="small" stripedRows paginator :rows="25">
        <Column :header="$t('name')">
          <template #body="{ data: row }">
            <RouterLink v-if="row.user_id" :to="`/Employee-update/${row.user_id}`" class="font-bold">{{ row.name }}</RouterLink>
            <b v-else>{{ row.name }}</b>
          </template>
        </Column>
        <Column :header="$t('position_name')"><template #body="{ data: row }">{{ row.position ?? "—" }}</template></Column>
        <Column :header="$t('stc.main_department')"><template #body="{ data: row }">{{ row.department ?? "—" }}</template></Column>
        <Column :header="$t('stc.problems')">
          <template #body="{ data: row }">
            <ul class="m-0 ps-3">
              <li v-for="(problem, i) in row.problems" :key="i">{{ problemText(problem) }}</li>
            </ul>
          </template>
        </Column>
        <Column v-if="editable" style="width: 11rem">
          <template #body="{ data: row }">
            <Button v-if="row.fixable" size="small" icon="pi pi-check" :label="$t('stc.fix')" variant="outlined"
              :loading="busy === `e${row.id}`" v-tooltip.top="$t('stc.fix_hint')" @click="fix([row.id])" />
            <small v-else class="text-color-secondary">{{ $t("stc.fix_manually") }}</small>
          </template>
        </Column>
      </DataTable>
    </section>

    <!-- Old roles outside the structure -->
    <section v-if="!loading && data.roles_outside.length">
      <p class="font-bold text-lg mb-1">{{ $t("stc.roles_title") }}</p>
      <small class="text-color-secondary block mb-2">{{ $t("stc.roles_hint") }}</small>
      <DataTable :value="data.roles_outside" dataKey="id" size="small" stripedRows>
        <Column :header="$t('org.role_name')" field="name" />
        <Column :header="$t('org.people')"><template #body="{ data: row }"><Tag :value="String(row.users)" :severity="row.users ? 'info' : 'secondary'" /></template></Column>
        <Column v-if="editable" style="width: 11rem">
          <template #body="{ data: row }">
            <Button size="small" icon="pi pi-arrow-right-arrow-left" :label="$t('stc.merge')" variant="outlined" @click="openMerge(row)" />
          </template>
        </Column>
      </DataTable>
    </section>

    <!-- Job titles without a role -->
    <section v-if="!loading && data.positions_without_role.length">
      <p class="font-bold text-lg mb-1">{{ $t("stc.positions_title") }}</p>
      <small class="text-color-secondary block mb-2">{{ $t("stc.positions_hint") }}</small>
      <DataTable :value="data.positions_without_role" dataKey="id" size="small" stripedRows>
        <Column :header="$t('position_name')" field="title" />
        <Column :header="$t('org.people')"><template #body="{ data: row }"><Tag :value="String(row.employees)" :severity="row.employees ? 'info' : 'secondary'" /></template></Column>
        <Column style="width: 11rem">
          <template #body>
            <Button v-can="'positions edit'" size="small" icon="pi pi-pencil" :label="$t('stc.set_role')" variant="outlined" @click="$router.push({ name: 'posttion' })" />
          </template>
        </Column>
      </DataTable>
    </section>

    <!-- Accounts with permissions and no employee record -->
    <section v-if="!loading && data.accounts_without_employee?.length">
      <p class="font-bold text-lg mb-1">{{ $t("stc.accounts_title") }}</p>
      <small class="text-color-secondary block mb-2">{{ $t("stc.accounts_hint") }}</small>
      <DataTable :value="data.accounts_without_employee" dataKey="id" size="small" stripedRows>
        <Column :header="$t('name')" field="name" />
        <Column :header="$t('email')" field="email" />
        <Column :header="$t('roles')"><template #body="{ data: row }"><Tag v-for="r in row.roles" :key="r" :value="r" severity="secondary" class="me-1" /></template></Column>
      </DataTable>
    </section>

    <Dialog :visible="!!merging" @update:visible="merging = null" modal :header="$t('stc.merge_title', { name: merging?.name ?? '' })" :style="{ width: '440px', maxWidth: '96vw' }">
      <div class="flex flex-column gap-2">
        <p class="m-0">{{ $t("stc.merge_hint", { n: merging?.users ?? 0 }) }}</p>
        <label for="stc-merge-into">{{ $t("stc.merge_into") }}</label>
        <Select inputId="stc-merge-into" v-model="mergeInto" :options="mergeTargets" optionLabel="name" optionValue="id" filter class="w-full">
          <template #option="{ option }">
            <span>{{ option.name }}</span>
            <Tag v-if="option.structure" :value="$t('stc.structure_role')" severity="success" class="ms-2" />
          </template>
        </Select>
        <Message severity="warn" :closable="false">{{ $t("stc.merge_warn") }}</Message>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" variant="text" severity="secondary" @click="merging = null" />
        <Button :label="$t('stc.merge')" icon="pi pi-check" severity="danger" :disabled="!mergeInto" :loading="busy === 'merge'" @click="merge" />
      </template>
    </Dialog>
  </div>
</template>
