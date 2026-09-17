<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUsersStore } from "../../stores/Users";
import { useI18n } from "vue-i18n";

const usersStore = useUsersStore();

const router = useRouter();
const items = ref([]);
const { t } = useI18n();

const headers = ref([
  { text: t("ID"), value: "id", sortable: false },
  { text: t("Name"), align: "start", sortable: false, value: "name" },
  { text: t("email"), align: "start", sortable: false, value: "email" },
  { text: t("roles"), align: "start", sortable: false, value: "roles" },
  { text: t("actions"), value: "actions", sortable: false },
]);

const pageSizes = ref([5, 10, 20]);

const getItems = async () => {
  await usersStore.fetchUsers();
  items.value = usersStore.users.map(getDisplayItem);
};

const handlePageChange = (value) => {
  usersStore.params.page = value;
  getItems();
};

const handlePageSizeChange = (size) => {
  if (size === usersStore.params.size) return;
  usersStore.params.size = size;
  usersStore.params.page = 1;
  getItems();
};

const getDisplayItem = (item) => {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    role: item.roles[0],
  };
};

const editItem = (id) => {
  router.push({ name: "UserRole", params: { id: id } });
};

const deleteItem = (id) => {
  router.push({ name: "UserRoleDelete", params: { id: id } });
};

onMounted(() => {
  getItems();
});
</script>

<template>
  <div class="page">
    <Message v-if="usersStore.successMsg" severity="success">{{ usersStore.successMsg }}</Message>
    <Message v-if="usersStore.errors.length !== 0" severity="error">
      <template v-if="typeof usersStore.errors === 'object'">
        <div v-for="(item, index) in usersStore.errors" :key="index">{{ item }}</div>
      </template>
      <template v-else>{{ usersStore.errors }}</template>
    </Message>

    <DataTable :value="items" dataKey="id" lazy paginator :rows="usersStore.params.size"
      :totalRecords="(usersStore.params.totalPages || 1) * usersStore.params.size" :rowsPerPageOptions="pageSizes"
      :first="(usersStore.params.page - 1) * usersStore.params.size"
      @page="(e) => { handlePageSizeChange(e.rows); handlePageChange(e.page + 1); }">
      <template #header>
        <div class="page-header">
          <h1 class="page-title">{{ $t("users") }}</h1>
          <div class="table-actions">
            <IconField class="table-search">
              <InputIcon class="pi pi-search" />
              <InputText v-model="usersStore.params.keyword" :placeholder="$t('search_by_name')" @keyup="getItems()" />
            </IconField>
            <Button as="router-link" :to="{ name: 'CreateUser' }" :label="$t('create_button')" icon="pi pi-plus" />
          </div>
        </div>
      </template>
      <Column field="id" header="#" />
      <Column field="name" :header="$t('Name')" />
      <Column field="email" :header="$t('email')" />
      <Column :header="$t('roles')">
        <template #body="{ data }">{{ data.role?.name }}</template>
      </Column>
      <Column :header="$t('actions')">
        <template #body="{ data }">
          <div class="table-actions">
            <Button icon="pi pi-pencil" rounded variant="outlined" severity="info" v-tooltip.top="$t('edit')"
              :aria-label="$t('edit')" @click="editItem(data.id)" />
            <Button icon="pi pi-trash" rounded variant="outlined" severity="danger" v-tooltip.top="$t('delete')"
              :aria-label="$t('delete')" @click="deleteItem(data.id)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
