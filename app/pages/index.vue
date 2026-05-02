<script setup lang="ts">
import { authClient } from '~~/lib/auth-client';

async function signOut() {
  const result = await authClient.signOut();

  if (result.data?.success) {
    globalThis.location.reload();
  }
}
</script>

<template>
  <div>
    <UButton
      label="Sign out"
      class="w-full justify-center"
      @click="signOut"
    />
  </div>
</template>
