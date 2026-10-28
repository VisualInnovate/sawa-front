<script>
// The selected child's name, fetched once per child and shared by every tab page.
const names = new Map();
</script>

<script setup>
import { ref, watchEffect } from "vue";
import axios from "axios";
import NavTabs from "./common/NavTabs.vue";

const items = [
  { to: { name: 'children-detailes' }, label: 'student_details' },
  { to: { name: 'children-consultations' }, label: 'child_consultations_tab', perm: 'bookings list' },
  { to: { name: 'children-evaluate' }, label: 'child_evaluations_tab' },
  { to: { name: 'children-recommendations' }, label: 'child_recommendations', perm: ['child recommendations list', 'child recommendations create'] },
  { to: { name: 'children-programe' }, label: 'evaluations_details' },
  { to: { name: 'children-request' }, label: 'child_requests' },
  { to: { name: 'children-finance' }, label: 'acc.finance_tab', perm: 'accounting list' },
];

const childName = ref("");
watchEffect(async () => {
  const id = Number(localStorage.getItem("child_id"));
  if (!id) return;
  if (!names.has(id)) {
    names.set(id, axios.get(`api/child/${id}/get/evaluations`).then(({ data }) => data?.name ?? ""));
  }
  try {
    childName.value = await names.get(id);
  } catch {
    names.delete(id); // try again on the next page
  }
});
</script>

<template>
  <NavTabs :items="items">
    <template v-if="childName" #end>
      <span class="child-tabs-name">
        <i class="pi pi-user" aria-hidden="true"></i>
        {{ childName }}
      </span>
    </template>
  </NavTabs>
</template>

<style scoped>
.child-tabs-name {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: rgb(var(--bs-fdf2f7));
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
}
.child-tabs-name i {
  color: rgb(var(--bs-ec477c));
  font-size: 0.85rem;
}
</style>
