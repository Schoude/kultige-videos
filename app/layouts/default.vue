<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const open = useCookie('sidebar-open', { default: () => true });

const items = [
  {
    label: 'Startseite',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: 'Trending',
    icon: 'i-lucide-house',
  },
  {
    label: 'Startseite',
    icon: 'i-lucide-house',
  },
] as NavigationMenuItem[];

defineShortcuts({
  ctrl_b: () => (open.value = !open.value),
});
</script>

<template>
  <UApp>
    <div class="flex flex-1 flex-col">
      <UHeader
        title="Kultige Videos"
        toggle-side="left"
        :ui="{ container: 'px-4!' }"
      >
        <template #toggle>
          <UButton
            icon="i-lucide-panel-left"
            variant="ghost"
            aria-label="Toggle sidebar"
            @click="open = !open"
          />
        </template>
      </UHeader>

      <div class="flex min-h-0 flex-1">
        <USidebar
          v-model:open="open"
          collapsible="icon"
          :ui="{
            gap: 'h-[calc(100%-var(--ui-header-height))]',
            container: 'absolute top-(--ui-header-height) bottom-0 h-[calc(100%-var(--ui-header-height))]'
          }"
        >
          <UNavigationMenu
            :items="items"
            orientation="vertical"
            :ui="{ link: 'p-1.5 overflow-hidden' }"
          />
        </USidebar>

        <UMain class="flex-1 p-4">
          <slot />
        </UMain>
      </div>
    </div>
  </UApp>
</template>
