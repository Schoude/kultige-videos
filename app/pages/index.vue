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
  <UButton
    label="Sign out"
    :loading
    icon="i-lucide-log-out"
    @click="signOut"
  />
</template>
