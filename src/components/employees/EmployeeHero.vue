<script setup>
// The head of an employee's page: photo (click to change when editable), name, title, kind, role and key facts.
import { computed, ref, watch } from "vue";
import { DEFAULT_AVATAR } from "@/utils/employeeForm";

const props = defineProps({
  name: { type: String, default: "" },
  title: { type: String, default: "" },
  image: { type: String, default: "" },
  typeName: { type: String, default: "" },
  roleName: { type: String, default: "" },
  // [{ icon, label, value }]; empty values are left out.
  facts: { type: Array, default: () => [] },
  editable: Boolean,
  imageError: { type: [String, Array], default: "" },
});
const emit = defineEmits(["image"]);

const fileInput = ref(null);
const shownFacts = computed(() => props.facts.filter((fact) => fact.value !== null && fact.value !== undefined && fact.value !== ""));

// A missing file shows the default photo, and an icon if that fails too, instead of an empty circle.
const broken = ref(false);
watch(() => props.image, () => { broken.value = false; });
function onImageError(event) {
  if (event.target.src !== DEFAULT_AVATAR) event.target.src = DEFAULT_AVATAR;
  else broken.value = true;
}

function pick() {
  if (props.editable) fileInput.value?.click();
}

function onFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (loaded) => emit("image", { file, preview: loaded.target.result });
  reader.readAsDataURL(file);
}
</script>

<template>
  <section class="employee-hero">
    <div class="employee-hero__photo">
      <button type="button" class="employee-hero__avatar" :class="{ 'is-editable': editable }" :disabled="!editable"
        :aria-label="editable ? $t('emp.change_photo') : name" @click="pick">
        <span v-if="broken" class="employee-hero__placeholder"><i class="pi pi-user" /></span>
        <img v-else :src="image || DEFAULT_AVATAR" :alt="name" @error="onImageError" />
        <span v-if="editable" class="employee-hero__camera"><i class="pi pi-camera" /></span>
      </button>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFile" />
      <small v-if="imageError" class="employee-hero__error">{{ Array.isArray(imageError) ? imageError[0] : imageError }}</small>
    </div>

    <div class="employee-hero__body">
      <div class="employee-hero__heading">
        <h2>{{ name || "—" }}</h2>
        <p v-if="title">{{ title }}</p>
      </div>
      <div class="employee-hero__tags">
        <Tag v-if="typeName" :value="typeName" icon="pi pi-id-card" severity="info" />
        <Tag v-if="roleName" :value="roleName" icon="pi pi-shield" severity="secondary" />
        <slot name="tags" />
      </div>
      <dl v-if="shownFacts.length" class="employee-hero__facts">
        <div v-for="fact in shownFacts" :key="fact.label" class="employee-hero__fact">
          <dt><i :class="fact.icon" />{{ fact.label }}</dt>
          <dd>{{ fact.value }}</dd>
        </div>
      </dl>
    </div>

    <div v-if="$slots.actions" class="employee-hero__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped>
.employee-hero {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--sawa-border);
  border-radius: var(--sawa-radius);
  background: linear-gradient(135deg, var(--sawa-primary-soft) 0%, #fff 60%);
  box-shadow: var(--sawa-shadow);
}

.employee-hero__photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.employee-hero__avatar {
  position: relative;
  width: 112px;
  height: 112px;
  padding: 0;
  border: 4px solid #fff;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4px 14px rgba(19, 92, 101, 0.18);
  overflow: hidden;
  cursor: default;
}

.employee-hero__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.employee-hero__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--sawa-primary-soft);
  color: var(--sawa-primary);
}

.employee-hero__placeholder .pi {
  font-size: 2.6rem;
}

.employee-hero__avatar.is-editable {
  cursor: pointer;
}

.employee-hero__camera {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  justify-content: center;
  padding: 0.3rem 0 0.4rem;
  background: rgba(14, 70, 77, 0.65);
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s;
}

.employee-hero__avatar.is-editable:hover .employee-hero__camera,
.employee-hero__avatar.is-editable:focus-visible .employee-hero__camera {
  opacity: 1;
}

.employee-hero__error {
  color: #dc2626;
  max-width: 140px;
  text-align: center;
}

.employee-hero__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
}

.employee-hero__heading h2 {
  margin: 0;
  color: var(--sawa-primary-dark);
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.3;
}

.employee-hero__heading p {
  margin: 0.15rem 0 0;
  color: var(--sawa-muted);
}

.employee-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.employee-hero__facts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 0.6rem 1.25rem;
  margin: 0;
}

.employee-hero__fact dt {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--sawa-muted);
  font-size: 0.78rem;
}

.employee-hero__fact dd {
  margin: 0.1rem 0 0;
  color: var(--sawa-text);
  font-weight: 600;
  overflow-wrap: anywhere;
}

.employee-hero__actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: flex-start;
}

@media (max-width: 768px) {
  .employee-hero {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem 1rem;
  }

  .employee-hero__tags {
    justify-content: center;
  }

  .employee-hero__facts {
    text-align: start;
  }

  .employee-hero__actions {
    align-self: stretch;
  }
}
</style>
