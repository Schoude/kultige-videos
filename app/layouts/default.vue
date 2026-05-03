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
    to: '/trending',
  },
] as NavigationMenuItem[];

defineShortcuts({
  ctrl_b: () => (open.value = !open.value),
});
</script>

<template>
  <UApp>
    <UDashboardGroup>
      <UDashboardSidebar
        collapsible
        :collapsed="open"
      >
        <template #header>
          Meddl
        </template>

        <UNavigationMenu
          :items="items"
          orientation="vertical"
        />
      </UDashboardSidebar>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar>
            <template #leading>
              <UDashboardSidebarCollapse />
            </template>

            <UDashboardSearchButton />
          </UDashboardNavbar>
        </template>

        <template #body>
          <slot />
        </template>
      </UDashboardPanel>
      <UDashboardSearch />
    </UDashboardGroup>
  </UApp>
</template>
