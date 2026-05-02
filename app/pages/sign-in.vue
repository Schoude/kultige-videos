<script setup lang="ts">
import { authClient } from '~~/lib/auth-client';

const loading = ref(false);

async function signIn() {
  loading.value = true;
  await authClient.signIn.social({ provider: 'google' });
}
</script>

<template>
  <UMain class="grid h-screen place-items-center">
    <UCard
      title="Sign in here"
      variant="soft"
    >
      <template #description>
        Hello!
      </template>

      <p>This is cool</p>

      <template #footer>
        <UButton
          label="Sign in"
          :loading
          class="w-full justify-center"
          @click="signIn"
        />
      </template>
    </UCard>
  </UMain>
</template>
