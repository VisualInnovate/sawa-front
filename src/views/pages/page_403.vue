<template>
  <section class="forbidden">
    <div class="forbidden-card">
      <span class="forbidden-code">403</span>
      <h1>{{ $t("forbidden_title") }}</h1>
      <p>{{ $t("no_permission_action") }}</p>
      <Button as="router-link" :to="{ name: 'adminHome' }" :label="$t('home')" icon="pi pi-home" />
    </div>
  </section>
</template>

<style scoped>
.forbidden {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: var(--sawa-page-bg);
}
.forbidden-card {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  max-width: 440px;
  padding: 2.5rem 2rem;
  text-align: center;
  background: #fff;
  border: 1px solid var(--sawa-border);
  border-radius: 16px;
}
.forbidden-code {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--sawa-primary);
}
h1 {
  margin: 0;
  font-size: 1.3rem;
}
p {
  margin: 0;
  color: var(--sawa-muted);
}
</style>
