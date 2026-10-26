<script setup>
// The frame of the parents' sign-in pages: the academy's photo and words on one side, the form on the other
// (on phones: a short photo strip on top of the form).
import LocaleSelect from "@/components/LocaleSelect.vue";
import logo from "@/views/frontend/views/main/images/logo.png";
import photo from "@/views/frontend/views/main/images/hero-teacher-child.jpg";

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  wide: { type: Boolean, default: false },
});
</script>

<template>
  <div class="pp-auth">
    <aside class="pp-auth__side">
      <img :src="photo" alt="" class="pp-auth__photo" />
      <div class="pp-auth__veil" />
      <div class="pp-auth__words pp-in">
        <p class="pp-auth__tag">{{ $t("pp.brand") }}</p>
        <h2 class="pp-auth__slogan">{{ $t("pp.auth_slogan") }}</h2>
        <ul class="pp-auth__points">
          <li><i class="pi pi-chart-line" /> {{ $t("pp.auth_point_progress") }}</li>
          <li><i class="pi pi-calendar" /> {{ $t("pp.auth_point_schedule") }}</li>
          <li><i class="pi pi-wallet" /> {{ $t("pp.auth_point_fees") }}</li>
        </ul>
      </div>
    </aside>

    <section class="pp-auth__form">
      <div class="pp-auth__top">
        <a href="/" class="pp-auth__logo-link"><img :src="logo" alt="Sawa" class="pp-auth__logo" /></a>
        <LocaleSelect />
      </div>
      <div class="pp-auth__card pp-in" :class="{ 'is-wide': wide }" :style="{ '--i': 1 }">
        <h1 class="pp-h1">{{ title }}</h1>
        <p v-if="subtitle" class="pp-lead mt-1 mb-5">{{ subtitle }}</p>
        <slot />
      </div>
      <p class="pp-auth__foot">
        <a href="/" class="pp-link"><i class="pi pi-globe" /> {{ $t("pp.public_site") }}</a>
      </p>
    </section>
  </div>
</template>

<style scoped>
.pp-auth {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: 190px 1fr;
  background: var(--pp-cream);
}
.pp-auth__side {
  position: relative;
  overflow: hidden;
  background: var(--pp-teal-900);
}
.pp-auth__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}
.pp-auth__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(3, 91, 101, 0.1) 0%, rgba(3, 91, 101, 0.75) 100%);
}
.pp-auth__words {
  position: absolute;
  inset-inline: 1.25rem;
  bottom: 1rem;
  color: #fff;
}
.pp-auth__tag {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 800;
  opacity: 0.9;
}
.pp-auth__slogan {
  margin: 0.15rem 0 0;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.5;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}
.pp-auth__points {
  display: none;
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  gap: 0.6rem;
}
.pp-auth__points li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
}
.pp-auth__points .pi {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.18);
}
.pp-auth__form {
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 2rem;
}
.pp-auth__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 520px;
  width: 100%;
  margin: 0 auto 1.25rem;
}
.pp-auth__logo {
  height: 46px;
  width: auto;
}
.pp-auth__card {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  background: #fff;
  border-radius: var(--pp-radius);
  box-shadow: var(--pp-shadow-lg);
  padding: 1.5rem 1.25rem;
}
.pp-auth__card.is-wide {
  max-width: 640px;
}
.pp-auth__foot {
  margin: 1.25rem auto 0;
  text-align: center;
}
@media (min-width: 1024px) {
  .pp-auth {
    grid-template-rows: none;
    grid-template-columns: minmax(380px, 44%) 1fr;
  }
  .pp-auth__side {
    min-height: 100dvh;
  }
  .pp-auth__words {
    inset-inline: 2.5rem;
    bottom: 2.5rem;
    max-width: 480px;
  }
  .pp-auth__slogan {
    font-size: 1.8rem;
    line-height: 1.5;
  }
  .pp-auth__points {
    display: grid;
  }
  .pp-auth__form {
    justify-content: center;
    padding: 2rem;
  }
  .pp-auth__card {
    padding: 2.25rem 2rem;
  }
}
</style>
