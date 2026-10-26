<script setup>
// «احجز تقييماً / استشارة»: the public pages' button lands here. The parent picks the child; a child with an
// accepted consultation already goes to the meeting request, the others to the free days.
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import PageHead from "@/components/parent/PageHead.vue";
import ChildAvatar from "@/components/parent/ChildAvatar.vue";
import EmptyState from "@/components/parent/EmptyState.vue";
import { useParentPortalStore } from "@/stores/ParentPortal";
import { ageText } from "@/utils/parentPortal";

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const portal = useParentPortalStore();
const checking = ref(null);

onMounted(() => portal.load());
const children = computed(() => portal.children);

async function pick(child) {
  checking.value = child.id;
  try {
    const { data } = await axios.get(`/api/child/${child.id}/check-active-booking`);
    router.push(data.active ? { name: "request-meeting", params: { child_id: child.id } } : { name: "BookingTime", params: { child_id: child.id } });
  } catch {
    toast.add({ severity: "error", summary: t("error"), detail: t("check_booking_failed"), life: 4000 });
  } finally {
    checking.value = null;
  }
}

const STEPS = ["pp.bk_step_1", "pp.bk_step_2", "pp.bk_step_3", "pp.bk_step_4"];
</script>

<template>
  <div class="pp-page">
    <Toast />
    <PageHead :title="$t('pp.book_title')" :lead="$t('pp.book_lead')" :kicker="$t('pp.brand')" icon="pi pi-calendar-plus" />

    <section class="pp-card pp-card--sand pp-card--pad pp-in" :style="{ '--i': 1 }">
      <ol class="pp-steps-row">
        <li v-for="(step, i) in STEPS" :key="step"><span>{{ i + 1 }}</span>{{ $t(step) }}</li>
      </ol>
    </section>

    <section class="pp-stack">
      <h2 class="pp-h2 pp-in" :style="{ '--i': 2 }">{{ $t("pp.book_pick_child") }}</h2>
      <div v-if="portal.loading && !portal.home" class="pp-grid pp-grid--3"><div v-for="i in 2" :key="i" class="pp-skeleton" style="height: 110px" /></div>
      <EmptyState v-else-if="!children.length" icon="pi pi-user-plus" :title="$t('pp.no_children_title')" :text="$t('pp.book_add_child_first')">
        <router-link :to="{ name: 'ReAction' }" class="pp-btn"><i class="pi pi-plus" /> {{ $t("Add_new_child") }}</router-link>
      </EmptyState>
      <div v-else class="pp-grid pp-grid--3">
        <button v-for="(child, i) in children" :key="child.id" type="button" class="pp-card pp-card--link pp-pick pp-in" :style="{ '--i': i + 3 }" :disabled="checking === child.id" @click="pick(child)">
          <ChildAvatar :child="child" :size="52" />
          <span class="min-w-0 flex-1 text-start">
            <b class="block truncate">{{ child.name }}</b>
            <small class="pp-muted">{{ ageText(child) }}</small>
            <small v-if="child.consultations?.accepted" class="block text-[var(--pp-success)]">{{ $t("pp.book_has_consultation") }}</small>
          </span>
          <i :class="checking === child.id ? 'pi pi-spin pi-spinner' : 'pi pi-angle-left rtl-arrow'" class="pp-muted" aria-hidden="true" />
        </button>
        <router-link :to="{ name: 'ReAction' }" class="pp-card pp-card--link pp-pick pp-pick--add pp-in" :style="{ '--i': children.length + 3 }">
          <span class="pp-item__icon pp-item__icon--magenta"><i class="pi pi-plus" /></span>
          <b>{{ $t("Add_new_child") }}</b>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pp-steps-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-weight: 700;
  font-size: 0.9rem;
}
.pp-steps-row li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.pp-steps-row span {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--pp-magenta);
  color: #fff;
  flex-shrink: 0;
}
.pp-pick {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem;
  border: 1px solid rgba(28, 103, 114, 0.1);
  font: inherit;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.pp-pick--add {
  border-style: dashed;
  background: transparent;
  box-shadow: none;
}
[dir="ltr"] .rtl-arrow {
  transform: scaleX(-1);
}
@media (min-width: 768px) {
  .pp-steps-row {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
