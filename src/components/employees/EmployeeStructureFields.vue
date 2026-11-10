<script setup>
// The employee's place in the org structure, on the add and edit forms: the job title decides the role, the type and
// (when it belongs to one) the department, so those are filled from it and locked; one main department plus extra
// ones; a head / deputy title leads the main department — when it already has one, replacing them is asked first.
// Mutates the employee object it is given: position_id, type, role, extra_roles, main_department, department, replace_leader.
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import EmployeeField from "@/components/employees/EmployeeField.vue";
import { applyPosition, employeeTypes, extraRoleOptions } from "@/utils/employeeForm";

const props = defineProps({
  employee: { type: Object, required: true },
  positions: { type: Array, default: () => [] },
  departments: { type: Array, default: () => [] },
  // The roles the editor may give (the admin role only for admins).
  roles: { type: Array, default: () => [] },
  errors: { type: Object, default: () => ({}) },
  // Role, type: «employees edit» only.
  canEditJob: { type: Boolean, default: true },
  // employees.id of the employee being edited (null when adding).
  employeeId: { type: Number, default: null },
});

const { t } = useI18n();
// The form may swap its employee object (load, discard): always the current one.
const e = computed(() => props.employee);
const err = (key) => props.errors?.[key];
const same = (a, b) => a != null && b != null && Number(a) === Number(b);

const position = computed(() => props.positions.find((p) => same(p.id, e.value.position_id)) ?? null);
const roleLocked = computed(() => Boolean(position.value?.role_id));
const typeLocked = computed(() => Boolean(position.value?.employee_type));
const departmentLocked = computed(() => Boolean(position.value?.department_id));
const types = computed(() => employeeTypes(t));
const extraRoles = computed(() => extraRoleOptions(props.roles, e.value.role));
const extraDepartments = computed(() => props.departments.filter((d) => !same(d.id, e.value.main_department)));
const nameOf = (list, id, key = "name") => list.find((item) => same(item.id, id))?.[key] ?? "";

// What the title fixes, applied when another one is chosen (the same employee object only).
watch(() => [e.value, e.value.position_id], ([obj, now], [objBefore, before]) => {
  if (obj === objBefore && !same(now, before)) {
    obj.replace_leader = false;
    applyPosition(obj, props.positions);
  }
});
watch(() => [e.value, e.value.main_department], ([obj, id], [objBefore, before]) => {
  if (obj === objBefore && !same(id, before)) {
    obj.department = (obj.department ?? []).filter((d) => !same(d, id));
    obj.replace_leader = false;
  }
});

// A head / deputy title: the main department's place, free or held by someone else.
const leads = computed(() => position.value?.leads ?? null);
const mainDepartment = computed(() => props.departments.find((d) => same(d.id, e.value.main_department)) ?? null);
const holder = computed(() => (leads.value && mainDepartment.value ? mainDepartment.value[leads.value] ?? null : null));
const taken = computed(() => Boolean(holder.value) && !same(holder.value.id, props.employeeId));
const leaderText = computed(() => {
  if (!leads.value || !mainDepartment.value) return "";
  const department = mainDepartment.value.title;
  if (!holder.value) return t(`stc.will_lead_${leads.value}`, { department });
  if (!taken.value) return t(`stc.leads_${leads.value}`, { department });
  return t(`stc.taken_${leads.value}`, { department, name: holder.value.name });
});
</script>

<template>
  <EmployeeField :label="$t('position_name')" for="emp-position" required :error="err('position_id')"
    :hint="position && (position.role_id || position.department_id) ? $t('stc.position_hint') : ''">
    <Select v-model="e.position_id" inputId="emp-position" :options="positions" optionLabel="title"
      optionValue="id" filter :placeholder="$t('position_name')" :invalid="Boolean(err('position_id'))" />
  </EmployeeField>
  <EmployeeField :label="$t('type')" for="emp-type" required :error="err('type')" :hint="typeLocked ? $t('stc.from_position') : ''">
    <Select v-model="e.type" inputId="emp-type" :options="types" optionLabel="name" optionValue="id"
      :disabled="!canEditJob || typeLocked" :invalid="Boolean(err('type'))" />
  </EmployeeField>
  <EmployeeField :label="$t('roles')" for="emp-role" required :error="err('role')" :hint="roleLocked ? $t('stc.from_position') : ''">
    <Select v-model="e.role" inputId="emp-role" :options="roles" optionLabel="name" optionValue="id"
      filter :disabled="!canEditJob || roleLocked" :invalid="Boolean(err('role'))" />
  </EmployeeField>
  <EmployeeField v-if="extraRoles.length" :label="$t('extra_roles')" for="emp-extra-roles" :hint="$t('extra_roles_hint')">
    <MultiSelect v-model="e.extra_roles" inputId="emp-extra-roles" :options="extraRoles" optionLabel="name" optionValue="id" filter display="chip" :disabled="!canEditJob" />
  </EmployeeField>
  <EmployeeField :label="$t('stc.main_department')" for="emp-main-department" required :error="err('main_department_id') || err('department_id')"
    :hint="departmentLocked ? $t('stc.from_position') : ''">
    <Select v-model="e.main_department" inputId="emp-main-department" :options="departments" optionLabel="title" optionValue="id"
      filter :disabled="departmentLocked" :placeholder="$t('stc.main_department')" :invalid="Boolean(err('main_department_id') || err('department_id'))" />
  </EmployeeField>
  <EmployeeField :label="$t('stc.extra_departments')" for="emp-department" :hint="$t('stc.extra_departments_hint')">
    <MultiSelect v-model="e.department" inputId="emp-department" :options="extraDepartments"
      optionLabel="title" optionValue="id" filter display="chip" />
  </EmployeeField>
  <div v-if="leaderText" class="employee-field--wide stc-leader">
    <Message :severity="taken ? 'warn' : 'info'" :closable="false">
      <div class="flex flex-column gap-2">
        <span>{{ leaderText }}</span>
        <div v-if="taken" class="flex items-center gap-2">
          <Checkbox v-model="e.replace_leader" inputId="emp-replace-leader" binary />
          <label for="emp-replace-leader">{{ $t(`stc.replace_${leads}`, { name: holder.name }) }}</label>
        </div>
        <small v-if="err('replace_leader')" class="text-red-600">{{ err('replace_leader')[0] ?? err('replace_leader') }}</small>
      </div>
    </Message>
  </div>
  <div v-if="roleLocked && e.role_before && !same(e.role_before, position.role_id)" class="employee-field--wide">
    <Message severity="warn" :closable="false">
      {{ $t("stc.role_will_change", { from: nameOf(roles, e.role_before) || $t("stc.other_role"), to: nameOf(roles, position.role_id) }) }}
    </Message>
  </div>
</template>

<style scoped>
.employee-field--wide {
  grid-column: 1 / -1;
}
</style>
