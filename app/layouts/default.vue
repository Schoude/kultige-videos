<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const open = useCookie('sidebar-open', { default: () => true });

const items = [
  {
    label: 'Startseite',
    icon: 'i-lucide-house',
    to: '/',
  },
] as NavigationMenuItem[];

defineShortcuts({
  ctrl_b: () => (open.value = !open.value),
});
</script>

<template>
  <UApp>
    <div class="flex flex-1">
      <USidebar
        v-model:open="open"
        title="Kultige Videos"
        collapsible="icon"
      >
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
      </USidebar>
      <div class="flex-1">
        <UHeader>
          <template #left>
            <UButton
              icon="i-lucide-panel-left"
              color="neutral"
              variant="ghost"
              aria-label="Toggle sidebar"
              @click="open = !open"
            />
          </template>
        </UHeader>
        <NuxtPage />
      </div>
    </div>
  </UApp>
</template>
