<script setup lang="ts">
import { authClient } from '~~/lib/auth-client';
</script>

<template>
  <div class="grid h-screen place-items-center">
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
          class="w-full justify-center"
          @click="authClient.signIn.social({ provider: 'google' })"
        />
      </template>
    </UCard>
  </div>
</template>
