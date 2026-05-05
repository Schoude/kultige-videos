<script setup lang="ts">
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

watch(
  user,
  () => {
    if (user.value) {
      // Get redirect path, and clear it from the cookie
      const path = redirectInfo.pluck();
      // Redirect to the saved path, or fallback to home
      return navigateTo(path || '/');
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="grid h-screen place-items-center">
    <section class="text-center">
      <img
        width="200"
        src="/logo.webp"
        alt="Logo Kultige Videos"
      >
      <h1 class="mb-4 text-2xl">
        Waiting for login...
      </h1>
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin"
      />
      <USeparator class="my-4" />
      <div>
        <p class="text-secondary mb-2">
          Hängst du hier fest?
        </p>
        <UButton
          to="/login"
          icon="i-lucide-log-in"
          size="lg"
        >
          Zum Login
        </UButton>
      </div>
    </section>
  </div>
</template>
