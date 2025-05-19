<template>
  <div class="mb-4 shadow-lg p-6 rounded-md flex justify-between">
    <h1 class="px-4 py-2 mx-2 text-2xl font-bold text-end">notification</h1>
    <div class="flex justify-end items-center">
      <Button
        type="button"
        icon="pi pi-plus"
        @click="restform(true)"
        :label="$t('create_button')"
        severity="success"
      />
    </div>
  </div>
  <div class="shadow-lg p-6 rounded-md">
    <DataTable :value="items" class="mt-4" responsiveLayout="scroll">
      <Column field="id" header="#" />
      <Column field="name" :header="$t('name')" />
      <Column field="title" :header="$t('address')" />
      <Column field="body" :header="$t('content')" />
      <Column :header="$t('actions')" style="width: 200px">
        <template #body="slotProps">
          <div class="flex gap-2 justify-center">
            <Button
              :label="$t('send')"
              icon="pi pi-send"
              severity="info"
              @click="viewdialog(slotProps.data)"
              class="text-sm px-3 py-2"
            />
            <Button
              :label="$t('edit')"
              icon="pi pi-pencil"
              severity="warning"
              @click="editItem(slotProps.data)"
              class="text-sm px-3 py-2"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      :header="isEditMode ? $t('update') : $t('add_notification')"
      v-model:visible="showDialog"
      modal
      class="w-[500px]"
    >
      <div class="flex flex-col gap-4 p-2">
        <div v-if="!isEditMode">
          <label for="name" class="block mb-1 text-lg font-medium">{{
            $t("name")
          }}</label>
          <InputText
            id="title"
            v-model="newItem.name"
            class="w-full text-base py-3 px-4 rounded-md"
          />
        </div>
        <div>
          <label for="title" class="block mb-1 text-lg font-medium">{{
            $t("title")
          }}</label>
          <InputText
            id="title"
            v-model="newItem.title"
            class="w-full text-base py-3 px-4 rounded-md"
          />
        </div>

        <div>
          <label for="body" class="block mb-1 text-lg font-medium">{{
            $t("body_event")
          }}</label>
          <Textarea
            id="body"
            v-model="newItem.body"
            rows="6"
            autoResize
            class="w-full text-base p-3 rounded-md bg-[#f7f5f5]"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 px-3 pb-3">
          <Button
            :label="$t('cancel')"
            icon="pi pi-times"
            @click="
              showDialog = false;
              restform();
            "
            class="p-button-outlined p-button-danger text-base px-5 py-3"
          />
          <Button
            :label="isEditMode ? $t('update') : $t('add')"
            icon="pi pi-check"
            @click="addOrUpdateItem"
            class="p-button-success text-base px-5 py-3"
          />
        </div>
      </template>
    </Dialog>
    <Dialog
      :header="$t('send')"
      v-model:visible="sendDialog"
      class="w-full max-w-sm rounded-xl p-0 overflow-hidden shadow-2xl"
      modal
    >
      <div class="bg-white p-6 space-y-6">
        <h1 class="text-center text-lg font-medium text-gray-800">
          {{ $t("sure") }}
        </h1>

        <div class="flex justify-end gap-4">
          <Button
            :label="$t('No')"
            severity="secondary"
            class="!bg-gray-100 !text-gray-700 hover:!bg-gray-200 transition rounded-md px-4 py-2"
            @click="sendDialog = false"
          />
          <Button
            :label="$t('yes')"
            severity="success"
            class="!bg-green-600 !text-white hover:!bg-green-700 transition rounded-md px-4 py-2"
            @click="sendItem()"
          />
        </div>
      </div>
    </Dialog>
  </div>
  <Toast />
</template>

<script setup>
import { data } from "autoprefixer";
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const { t } = useI18n();

const showDialog = ref(false);
const isEditMode = ref(false);
const editId = ref(null);
const sendDialog = ref(false);
const items = ref([]);
const notfcation = ref();

onMounted(() => {
  const storedItems = localStorage.getItem("notification");
  if (storedItems) {
    items.value = JSON.parse(storedItems);
  }
});

watch(
  items,
  (newVal) => {
    localStorage.setItem("notification", JSON.stringify(newVal));
  },
  { deep: true }
);

const newItem = ref({
  name: "",
  title: "",
  body: "",
  id: null,
});

function addOrUpdateItem() {
  if (isEditMode.value && editId.value !== null) {
    const index = items.value.findIndex((item) => item.id === editId.value);
    if (index !== -1) {
      items.value[index] = { ...newItem.value, id: editId.value };
    }
  } else {
    const newId =
      items.value.length > 0
        ? Math.max(...items.value.map((i) => i.id)) + 1
        : 1;
    const item = { ...newItem.value, id: newId };
    items.value.push(item);
  }
  restform();
}

// Reset form
function restform(add = false) {
  newItem.value = { title: "", body: "", id: null, name: "" };
  isEditMode.value = false;
  editId.value = null;
  showDialog.value = false;
  if (add) showDialog.value = true;
}
const viewdialog = (item) => {
  sendDialog.value = true;
  notfcation.value = item;
};
const sendItem = () => {
  const formData = new FormData();
  formData.append("name", notfcation.value.name);
  formData.append("title", notfcation.value.title);
  formData.append("body", notfcation.value.body);
  axios
    .post("/api/notification-template", formData)
    .then((req) => {
      toast.add({
        severity: "success",
        summary: t("success"),
        detail: t("successMsg"),
        life: 3000,
      });
      console.log("Done send req");
    })
    .catch((e) => {
      toast.add({
        severity: "error",
        summary: t("error"),
        detail: t("errorMsg"),
        life: 3000,
      });
      console.log("Erorr in req : " + e);
    });
  sendDialog.value = false;
};
function editItem(item) {
  newItem.value = { ...item };
  editId.value = item.id;
  isEditMode.value = true;
  showDialog.value = true;
}
</script>

<style scoped>
.p-float-label {
  margin-top: 1rem;
}
</style>
