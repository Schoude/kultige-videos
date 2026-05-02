<template>
  <div class="grid h-screen place-items-center">
    <UCard
      title="Sign in here"
      variant="soft"
    >
      <NuxtLink to="/">To Index</NuxtLink>
      <template #footer>
        <UButton
          label="Sign in"
          class="w-full justify-center"
        />
      </template>
    </UCard>
  </div>
</template>
