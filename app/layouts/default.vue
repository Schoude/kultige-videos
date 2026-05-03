<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui';
import { authClient } from '~~/lib/auth-client';

const { data: session } = await authClient.useSession(useFetch);

const user = computed(() => ({
  name: session.value?.user.name,
  avatar: {
    src: session.value!.user.image as string,
    alt: session.value?.user.name,
  },
}));

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

const userItems = [
  [
    {
      label: 'Abmelden',
      icon: 'i-lucide-log-out',
      async onSelect() {
        await signOut();
      },
    },
  ],
] as DropdownMenuItem[][];

defineShortcuts({
  ctrl_b: () => (open.value = !open.value),
});

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

          <template #footer>
            <UDropdownMenu
              :items="userItems"
              :content="{ align: 'center', collisionPadding: 12 }"
              :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
            >
              <UButton
                v-bind="user"
                :label="user?.name"
                trailing-icon="i-lucide-chevrons-up-down"
                color="neutral"
                variant="ghost"
                square
                class="data-[state=open]:bg-elevated w-full overflow-hidden"
                :ui="{
                  trailingIcon: 'text-dimmed ms-auto'
                }"
              />
            </UDropdownMenu>
          </template>
        </USidebar>

        <UMain class="flex-1 p-4">
          <slot />
        </UMain>
      </div>
    </div>
  </UApp>
</template>
