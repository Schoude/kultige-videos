<script setup lang="ts">
import { authClient } from '~~/lib/auth-client';

const loading = ref(false);

async function signIn(provider: 'google' | 'kakao') {
  loading.value = true;

  await authClient.signIn.social({ provider: provider });
}
</script>

<template>
  <UMain class="grid h-screen place-items-center">
    <section class="grid gap-6">
      <img
        width="230"
        class="mx-auto"
        src="/logo.webp"
        alt="Logo"
      >
      <h1 class="text-4xl font-semibold">
        Kultige Videos
      </h1>

      <UButton
        label="Google"
        :loading
        icon="i-simple-icons-google"
        block
        variant="outline"
        size="xl"
        @click="signIn('google')"
      />

      <UButton
        label="Kakao"
        :loading
        icon="i-simple-icons-kakao"
        block
        variant="outline"
        size="xl"
        @click="signIn('kakao')"
      />
    </section>
  </UMain>
</template>
