<script setup>
// «النشاطات»: the activities (a name and an image) as cards, and the rooms' weekly activities (pick a room, then
// place activities on its week). Deleting an activity takes it out of every room, after saying how many places go.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { can } from "@/utils/permissions";
import RoomActivities from "@/components/activities/RoomActivities.vue";

const { t } = useI18n();
const toast = useToast();

const tab = ref(can("activities list") ? "activities" : "rooms");
const activities = ref([]);
const search = ref("");
const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);
const deleting = ref(null);
const errors = ref({});
const form = ref({});
const preview = ref(null);
const schedule = ref(null);

const shown = computed(() => {
  const q = search.value.trim().toLowerCase();
  return q ? activities.value.filter((activity) => activity.name.toLowerCase().includes(q)) : activities.value;
});
const firstError = (key) => (Array.isArray(errors.value[key]) ? errors.value[key][0] : errors.value[key]);
const notifyError = () => toast.add({ severity: "error", summary: t("error"), detail: t("request_failed_retry"), life: 4000 });

async function load() {
  loading.value = true;
  try {
    activities.value = (await axios.get("api/activities")).data.data ?? [];
  } catch {
    notifyError();
  } finally {
    loading.value = false;
  }
}

function openNew() {
  form.value = { name: "", image: null };
  preview.value = null;
  errors.value = {};
  dialog.value = true;
}
function edit(activity) {
  form.value = { id: activity.id, name: activity.name, image: null };
  preview.value = activity.image_url;
  errors.value = {};
  dialog.value = true;
}
// Activity images are square (1:1): the picked image is cut to its centred square (at most 800 × 800) before upload.
const SQUARE_MAX = 800;
function squareImage(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const size = Math.min(side, SQUARE_MAX);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d").drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      // PNG keeps transparency; everything else becomes JPEG.
      const type = file.type === "image/png" || file.type === "image/gif" ? "image/png" : "image/jpeg";
      const name = file.name.replace(/\.[^.]+$/, "") + (type === "image/png" ? ".png" : ".jpg");
      canvas.toBlob((blob) => resolve(blob ? new File([blob], name, { type }) : file), type, 0.9);
    };
    // Not readable as an image here: upload it as it is (the server checks it).
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}
async function pickImage(event) {
  const picked = event.target.files?.[0] ?? null;
  if (!picked) return;
  const file = await squareImage(picked);
  form.value.image = file;
  preview.value = URL.createObjectURL(file);
}
async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  const body = new FormData();
  body.append("name", form.value.name ?? "");
  if (form.value.image) body.append("image", form.value.image);
  try {
    await axios.post(form.value.id ? `api/activities/${form.value.id}` : "api/activities", body);
    dialog.value = false;
    toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 2500 });
    await load();
    schedule.value?.reload();
  } catch (error) {
    if (error.response?.status === 422) errors.value = error.response.data.errors || {};
    else notifyError();
  } finally {
    saving.value = false;
  }
}
async function remove() {
  if (saving.value || !deleting.value) return;
  saving.value = true;
  try {
    await axios.delete(`api/activities/${deleting.value.id}`);
    deleting.value = null;
    await load();
    schedule.value?.reload();
  } catch {
    notifyError();
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="ac-page">
    <header class="ac-hero">
      <span class="ac-hero-icon"><i class="pi pi-palette" aria-hidden="true" /></span>
      <div>
        <h1>{{ $t("activities.title") }}</h1>
        <p>{{ $t("activities.subtitle") }}</p>
      </div>
    </header>

    <Tabs v-model:value="tab">
      <TabList>
        <Tab v-if="$can('activities list')" value="activities"><i class="pi pi-th-large mx-1" />{{ $t("activities.tab_activities") }}</Tab>
        <Tab v-if="$can(['room activities list', 'room activities edit'])" value="rooms"><i class="pi pi-calendar mx-1" />{{ $t("activities.tab_rooms") }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="activities">
          <div class="ac-toolbar">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="search" :placeholder="$t('search')" />
            </IconField>
            <Button v-can="'activities create'" :label="$t('activities.add')" icon="pi pi-plus" @click="openNew" />
          </div>

          <div v-if="loading" class="ac-grid"><Skeleton v-for="n in 6" :key="n" height="13rem" /></div>
          <p v-else-if="!shown.length" class="ac-empty"><i class="pi pi-images" aria-hidden="true" /> {{ $t("activities.no_activities") }}</p>
          <div v-else class="ac-grid">
            <article v-for="(activity, i) in shown" :key="activity.id" class="ac-card" :style="{ '--d': `${Math.min(i, 12) * 40}ms` }">
              <!-- The whole image, never cropped (an image may carry its own title). -->
              <div class="ac-image">
                <img v-if="activity.image_url" :src="activity.image_url" :alt="activity.name" loading="lazy" />
                <i v-else class="pi pi-image" aria-hidden="true" />
              </div>
              <div class="ac-body">
                <h3 :title="activity.name">{{ activity.name }}</h3>
                <div class="ac-footer">
                  <span class="ac-count"><i class="pi pi-building" aria-hidden="true" /> {{ $t("activities.places", { n: activity.room_activities_count ?? 0 }) }}</span>
                  <span class="ac-actions">
                    <Button v-can="'activities edit'" icon="pi pi-pencil" rounded variant="text" severity="info" size="small" :aria-label="$t('edit')" v-tooltip.top="$t('edit')" @click="edit(activity)" />
                    <Button v-can="'activities delete'" icon="pi pi-trash" rounded variant="text" severity="danger" size="small" :aria-label="$t('delete')" v-tooltip.top="$t('delete')" @click="deleting = activity" />
                  </span>
                </div>
              </div>
            </article>
          </div>
        </TabPanel>
        <TabPanel value="rooms">
          <RoomActivities ref="schedule" />
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog v-model:visible="dialog" modal :header="form.id ? $t('activities.edit') : $t('activities.add')" :style="{ width: '480px', maxWidth: '95vw' }" :closable="!saving">
      <form class="ac-form" data-no-request-spinner @submit.prevent="save">
        <div class="ac-field">
          <label for="ac-name">{{ $t("activities.name") }}</label>
          <InputText id="ac-name" v-model="form.name" fluid :invalid="Boolean(errors.name)" />
          <small v-if="errors.name" class="ac-error">{{ firstError("name") }}</small>
        </div>
        <div class="ac-field">
          <label for="ac-image">{{ $t("activities.image") }}</label>
          <label class="ac-upload" :class="{ 'is-invalid': errors.image }">
            <img v-if="preview" :src="preview" alt="" />
            <span v-else><i class="pi pi-cloud-upload" aria-hidden="true" /> {{ $t("activities.choose_image") }}</span>
            <input id="ac-image" type="file" accept="image/*" @change="pickImage" />
          </label>
          <small class="ac-hint">{{ $t("activities.image_square_hint") }}</small>
          <small v-if="form.id" class="ac-hint">{{ $t("activities.image_keep_hint") }}</small>
          <small v-if="errors.image" class="ac-error">{{ firstError("image") }}</small>
        </div>
        <div class="ac-form-actions">
          <Button type="submit" :loading="saving" :label="$t('submit')" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="Boolean(deleting)" modal :header="$t('delete')" :style="{ width: '460px', maxWidth: '95vw' }" @update:visible="deleting = null">
      <p class="m-0">{{ $t("remove_item") }} <b>{{ deleting?.name }}</b>؟</p>
      <Message v-if="deleting?.room_activities_count" severity="warn" :closable="false" class="mt-3">
        {{ $t("activities.delete_cascade", { n: deleting.room_activities_count }) }}
      </Message>
      <template #footer>
        <Button :label="$t('no')" variant="text" severity="secondary" :disabled="saving" @click="deleting = null" />
        <Button :label="$t('yes')" severity="danger" :loading="saving" @click="remove" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.ac-page { display: grid; gap: 1rem; }
.ac-hero { display: flex; align-items: center; gap: 1rem; padding: 1.25rem 1.5rem; border-radius: var(--sawa-radius, 16px); background: linear-gradient(135deg, var(--sawa-primary, #135c65) 0%, #1b7c86 100%); color: #fff; }
.ac-hero-icon { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 14px; background: rgba(255, 255, 255, .15); font-size: 1.4rem; }
.ac-hero h1 { margin: 0; font-size: 1.35rem; font-weight: 800; }
.ac-hero p { margin: .2rem 0 0; opacity: .85; }
.ac-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem; margin-bottom: 1rem; }
.ac-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 13.5rem), 1fr)); gap: 1rem; align-items: start; }
.ac-empty { margin: 0; padding: 2.5rem 1rem; color: var(--sawa-muted, #64748b); text-align: center; }
.ac-card { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff;
  transition: box-shadow .2s, transform .2s; animation: ac-in .35s var(--d) ease both; }
.ac-card:hover { box-shadow: 0 12px 26px -18px rgba(15, 23, 42, .5); transform: translateY(-3px); }
.ac-image { display: grid; place-items: center; aspect-ratio: 1 / 1; padding: .6rem; background: #f8fafc; color: #94a3b8; font-size: 2rem; border-bottom: 1px solid #f1f5f9; }
.ac-image img { width: 100%; height: 100%; object-fit: contain; border-radius: 10px; transition: transform .25s ease; }
.ac-card:hover .ac-image img { transform: scale(1.03); }
.ac-body { display: grid; gap: .35rem; padding: .65rem .8rem .55rem; }
.ac-body h3 { margin: 0; overflow: hidden; font-size: 1rem; font-weight: 800; color: #0f172a; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
.ac-footer { display: flex; align-items: center; justify-content: space-between; gap: .4rem; min-height: 2rem; }
.ac-count { display: inline-flex; align-items: center; gap: .3rem; color: var(--sawa-muted, #64748b); font-size: .8rem; }
.ac-actions { display: inline-flex; gap: .1rem; }
@keyframes ac-in { from { opacity: 0; transform: translateY(8px); } }
@media (prefers-reduced-motion: reduce) { .ac-card { animation: none; } .ac-card:hover, .ac-card:hover .ac-image img { transform: none; } }
.ac-form { display: grid; gap: 1rem; }
.ac-field { display: grid; gap: .4rem; }
.ac-field > label:first-child { font-weight: 700; }
.ac-upload { position: relative; display: grid; place-items: center; width: min(100%, 14rem); aspect-ratio: 1 / 1; margin-inline: auto; overflow: hidden; border: 2px dashed #cbd5e1; border-radius: 14px; background: #f8fafc; color: #64748b; cursor: pointer; }
.ac-upload.is-invalid { border-color: #ef4444; }
.ac-upload img { width: 100%; height: 100%; object-fit: cover; }
.ac-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.ac-upload:focus-within { outline: 2px solid var(--sawa-primary, #135c65); outline-offset: 2px; }
.ac-hint { color: var(--sawa-muted, #64748b); }
.ac-error { color: #dc2626; }
.ac-form-actions { display: flex; justify-content: flex-end; }
</style>
