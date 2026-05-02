<script setup lang="ts">
import { authClient } from '~~/lib/auth-client';

const loading = ref(false);

async function signOut() {
  loading.value = true;
  const result = await authClient.signOut();

  if (result.data?.success) {
    globalThis.location.reload();
  }
}
</script>

<template>
  <UMain>
    <UButton
      label="Sign out"
      :loading
      class="w-full justify-center"
      @click="signOut"
    />
  </UMain>
</template>
